/**
 * Docs search over a small JSON index (no server, no WebAssembly, only file types the WebGen import accepts).
 * Entry: { url, title, headings: string[], text }. A query matches when EVERY word starts a word in the
 * entry; a title hit counts most, then headings, then body text. Case and accents are ignored.
 */
const norm = (s) => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const tokens = (q) => norm(q).split(/[^a-z0-9]+/).filter(Boolean);
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const wordStart = (t) => new RegExp(`(^|[^a-z0-9])(${escapeRe(t)}[a-z0-9]*)`, 'g');

/** Text with every matched word wrapped in <mark>; everything else is HTML-escaped. */
function markUp(text, toks) {
  const n = norm(text);
  const ranges = [];
  for (const t of toks) {
    for (const m of n.matchAll(wordStart(t))) {
      const start = m.index + m[1].length;
      ranges.push([start, start + m[2].length]);
    }
  }
  ranges.sort((a, b) => a[0] - b[0]);
  const merged = [];
  for (const r of ranges) {
    const last = merged[merged.length - 1];
    if (last && r[0] <= last[1]) last[1] = Math.max(last[1], r[1]);
    else merged.push([...r]);
  }
  let out = '';
  let pos = 0;
  for (const [a, b] of merged) {
    out += escapeHtml(text.slice(pos, a)) + '<mark>' + escapeHtml(text.slice(a, b)) + '</mark>';
    pos = b;
  }
  return out + escapeHtml(text.slice(pos));
}

function excerpt(text, toks) {
  const n = norm(text);
  let at = -1;
  for (const t of toks) {
    const m = wordStart(t).exec(n);
    if (m) {
      const i = m.index + m[1].length;
      if (at < 0 || i < at) at = i;
    }
  }
  const START = 40;
  const LEN = 170;
  const from = at < 0 ? 0 : Math.max(0, at - START);
  let slice = text.slice(from, from + LEN).trim();
  if (from > 0) slice = '… ' + slice;
  if (from + LEN < text.length) slice += ' …';
  return markUp(slice, toks);
}

/** @returns {{ url: string, title: string, excerpt: string }[]} best matches first */
export function searchEntries(entries, query, limit = 8) {
  const toks = tokens(query);
  if (!toks.length) return [];
  const hits = [];
  for (const e of entries) {
    const title = norm(e.title);
    const heads = (e.headings ?? []).map(norm).join(' | ');
    const text = norm(e.text);
    let score = 0;
    let ok = true;
    for (const t of toks) {
      const re = new RegExp(`(^|[^a-z0-9])${escapeRe(t)}`);
      const inTitle = re.test(title);
      const inHead = re.test(heads);
      const inText = re.test(text);
      if (!inTitle && !inHead && !inText) { ok = false; break; }
      score += (inTitle ? 10 : 0) + (inHead ? 4 : 0) + (inText ? 1 : 0);
    }
    if (ok) hits.push({ e, score });
  }
  hits.sort((a, b) => b.score - a.score);
  return hits.slice(0, limit).map(({ e }) => ({ url: e.url, title: e.title, excerpt: excerpt(e.text ?? '', toks) }));
}
