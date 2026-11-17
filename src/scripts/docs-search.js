/**
 * Docs search. Results come from Pagefind's JS API (built into /pagefind/).
 * Nothing here ever uses innerHTML: titles, excerpts and the query are written as text.
 */

const ENTITIES = { '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&#x27;': "'", '&amp;': '&' };
const decode = (s) => s.replace(/&(?:lt|gt|quot|#39|#x27|amp);/g, (m) => ENTITIES[m]);

function safeUrl(url) {
  const u = String(url ?? '');
  // The URL parser strips tab/LF/CR, so reject any control character or space first.
  if (/[\u0000- \u007F]/.test(u)) return '#';
  return /^(\/(?![/\\])|#)/.test(u) ? u : '#';
}

/** Build an excerpt node: <mark> tokens become real mark elements, all other text stays literal. */
function excerptNode(excerpt) {
  const p = document.createElement('p');
  p.className = 'search-excerpt';
  let inMark = false;
  for (const part of String(excerpt ?? '').split(/(<\/?mark>)/i)) {
    if (/^<mark>$/i.test(part)) inMark = true;
    else if (/^<\/mark>$/i.test(part)) inMark = false;
    else if (part) {
      if (inMark) {
        const m = document.createElement('mark');
        m.textContent = decode(part);
        p.append(m);
      } else {
        p.append(document.createTextNode(decode(part)));
      }
    }
  }
  return p;
}

const EMPTY_EN = (q) => `No results for “${q}”`;

/**
 * @param {HTMLElement} container @param {string} query @param {{url:string,title:string,excerpt:string}[]} results
 * @param {{ empty?: (q: string) => string }} [opts] empty: the no-results line in the page language
 */
export function renderResults(container, query, results, opts = {}) {
  container.replaceChildren();
  if (!results || results.length === 0) {
    const p = document.createElement('p');
    p.className = 'search-empty';
    p.textContent = (opts.empty ?? EMPTY_EN)(query);
    container.append(p);
    return;
  }
  const ul = document.createElement('ul');
  ul.className = 'search-list';
  for (const r of results) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = safeUrl(r.url);
    a.textContent = r.title;
    li.append(a, excerptNode(r.excerpt));
    ul.append(li);
  }
  container.append(ul);
}

const FIELD_TAGS = ['INPUT', 'TEXTAREA', 'SELECT'];

/** Ctrl/Cmd+K focuses the field, only while no form field has focus. */
export function bindShortcut(input, doc = document) {
  doc.addEventListener('keydown', (e) => {
    if (!(e.ctrlKey || e.metaKey) || e.altKey || e.shiftKey || e.key.toLowerCase() !== 'k') return;
    const active = doc.activeElement;
    if (active && (FIELD_TAGS.includes(active.tagName) || active.isContentEditable || active.closest?.('[contenteditable]:not([contenteditable="false"])'))) return;
    e.preventDefault();
    input.focus();
  });
}

/**
 * @param {HTMLInputElement} input @param {HTMLElement} container
 * @param {{ lang?: string, load?: () => Promise<any>, delay?: number, empty?: (q: string) => string }} [opts]
 *   lang: only results whose page carries data-pagefind-filter="lang:<lang>"; load: Pagefind loader (tests).
 * @returns {() => Promise<void>} run the search for the current input value
 */
export function initDocsSearch(input, container, opts = {}) {
  let pagefind;
  let latest = 0;
  let timer;
  const delay = opts.delay ?? 150;

  const load = opts.load ?? (async () => {
    if (!pagefind) {
      const url = '/pagefind/pagefind.js';
      pagefind = await import(/* @vite-ignore */ url);
    }
    return pagefind;
  });

  const run = async () => {
    const query = input.value.trim();
    const ticket = ++latest;
    if (!query) {
      container.replaceChildren();
      container.hidden = true;
      return;
    }
    container.hidden = false;
    let results = [];
    try {
      const pf = await load();
      const found = opts.lang ? await pf.search(query, { filters: { lang: opts.lang } }) : await pf.search(query);
      const top = await Promise.all(found.results.slice(0, 8).map((r) => r.data()));
      results = top.map((d) => ({ url: d.url, title: d.meta?.title ?? d.url, excerpt: d.excerpt }));
    } catch {
      results = [];
    }
    if (ticket !== latest) return;
    renderResults(container, query, results, { empty: opts.empty });
  };

  input.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(run, delay);
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      input.value = '';
      run();
    }
  });
  bindShortcut(input);
  return run;
}
