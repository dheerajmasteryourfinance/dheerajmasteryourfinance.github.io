/**
 * Docs search. Results come from Pagefind's JS API (built into /pagefind/).
 * Nothing here ever uses innerHTML: titles, excerpts and the query are written as text.
 */

const ENTITIES = { '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&#x27;': "'", '&amp;': '&' };
const decode = (s) => s.replace(/&(?:lt|gt|quot|#39|#x27|amp);/g, (m) => ENTITIES[m]);

function safeUrl(url) {
  const u = String(url ?? '');
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

/** @param {HTMLElement} container @param {string} query @param {{url:string,title:string,excerpt:string}[]} results */
export function renderResults(container, query, results) {
  container.replaceChildren();
  if (!results || results.length === 0) {
    const p = document.createElement('p');
    p.className = 'search-empty';
    p.textContent = `No results for “${query}”`;
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

export function initDocsSearch(input, container) {
  let pagefind;
  let latest = 0;
  let timer;

  const load = async () => {
    if (!pagefind) {
      const url = '/pagefind/pagefind.js';
      pagefind = await import(/* @vite-ignore */ url);
    }
    return pagefind;
  };

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
      const found = await pf.search(query);
      const top = await Promise.all(found.results.slice(0, 8).map((r) => r.data()));
      results = top.map((d) => ({ url: d.url, title: d.meta?.title ?? d.url, excerpt: d.excerpt }));
    } catch {
      results = [];
    }
    if (ticket !== latest) return;
    renderResults(container, query, results);
  };

  input.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(run, 150);
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      input.value = '';
      run();
    }
  });
  bindShortcut(input);
}
