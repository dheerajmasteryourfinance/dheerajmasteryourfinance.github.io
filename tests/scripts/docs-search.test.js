// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { renderResults, bindShortcut, initDocsSearch } from '../../src/scripts/docs-search.js';

let box;
beforeEach(() => {
  document.body.innerHTML = '<div id="box"></div>';
  box = document.getElementById('box');
});

describe('renderResults', () => {
  it('shows a hostile query as text with no elements created', () => {
    const q = '<img src=x onerror=alert(1)>';
    renderResults(box, q, []);
    expect(box.querySelector('img')).toBeNull();
    expect(box.textContent).toBe(`No results for “${q}”`);
  });

  it('renders <mark> highlighting as one mark and everything else as literal text', () => {
    renderResults(box, 'bar', [
      { url: '/docs/x/', title: '<i>T</i>', excerpt: 'foo <mark>bar</mark> <b>x</b>' },
    ]);
    expect(box.querySelectorAll('mark')).toHaveLength(1);
    expect(box.querySelector('mark').textContent).toBe('bar');
    expect(box.querySelector('b')).toBeNull();
    expect(box.querySelector('i')).toBeNull();
    expect(box.textContent).toContain('<b>x</b>');
    expect(box.textContent).toContain('<i>T</i>');
    expect(box.querySelector('a').getAttribute('href')).toBe('/docs/x/');
  });

  it('replaces earlier results on a second call', () => {
    renderResults(box, 'a', [{ url: '/a/', title: 'A', excerpt: 'a' }]);
    renderResults(box, 'b', [{ url: '/b/', title: 'B', excerpt: 'b' }]);
    expect(box.querySelectorAll('a')).toHaveLength(1);
    expect(box.querySelector('a').getAttribute('href')).toBe('/b/');
  });

  it.each([
    'javascript:alert(1)',
    '//evil.com',
    '/\\evil.com',
    'data:text/html,x',
    'https://evil.com/',
    '/\t/evil.com',
    '/\n/evil.com',
    '/\r/evil.com',
    ' //evil.com',
  ])('rejects url %s', (url) => {
    renderResults(box, 'a', [{ url, title: 'A', excerpt: 'a' }]);
    expect(box.querySelector('a').getAttribute('href')).toBe('#');
  });

  it('accepts same-site paths and fragments', () => {
    renderResults(box, 'a', [
      { url: '/docs/a/', title: 'A', excerpt: 'a' },
      { url: '#top', title: 'B', excerpt: 'b' },
    ]);
    const hrefs = [...box.querySelectorAll('a')].map((a) => a.getAttribute('href'));
    expect(hrefs).toEqual(['/docs/a/', '#top']);
  });
});

describe('bindShortcut', () => {
  let input;
  const press = (init, target = document.body) => {
    const e = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, ...init });
    target.dispatchEvent(e);
    return e;
  };
  beforeEach(() => {
    document.body.innerHTML =
      '<input id="s" type="search"><input id="other"><textarea id="ta"></textarea><div id="ce" contenteditable="true" tabindex="0"></div>';
    input = document.getElementById('s');
    bindShortcut(input, document);
  });

  it.each([{ ctrlKey: true }, { metaKey: true }])('%o + K focuses the search and prevents default', (mod) => {
    const e = press({ key: 'k', ...mod });
    expect(document.activeElement).toBe(input);
    expect(e.defaultPrevented).toBe(true);
  });

  it.each(['other', 'ta', 'ce'])('does not hijack while #%s is focused', (id) => {
    const el = document.getElementById(id);
    el.focus();
    const e = press({ key: 'k', ctrlKey: true }, el);
    expect(document.activeElement).toBe(el);
    expect(e.defaultPrevented).toBe(false);
  });

  it('a plain k does nothing', () => {
    const e = press({ key: 'k' });
    expect(document.activeElement).not.toBe(input);
    expect(e.defaultPrevented).toBe(false);
  });
});

describe('per-language search', () => {
  it('shows the empty message in the page language', () => {
    renderResults(box, '<b>', [], { empty: (q) => `Geen resultaten voor “${q}”` });
    expect(box.textContent).toBe('Geen resultaten voor “<b>”');
    expect(box.querySelector('b')).toBeNull();
  });

  it('only searches the current language, via a Pagefind filter', async () => {
    document.body.innerHTML = '<input id="q"><div id="r" hidden></div>';
    const input = document.getElementById('q');
    const results = document.getElementById('r');
    const calls = [];
    const fake = {
      search: async (query, opts) => {
        calls.push([query, opts]);
        return { results: [{ data: async () => ({ url: '/nl/docs/a/', meta: { title: 'A' }, excerpt: 'x' }) }] };
      },
    };
    const run = initDocsSearch(input, results, { lang: 'nl', load: async () => fake, delay: 0 });
    input.value = 'domein';
    await run();
    expect(calls).toEqual([['domein', { filters: { lang: 'nl' } }]]);
    expect(results.querySelector('a').getAttribute('href')).toBe('/nl/docs/a/');
  });
});
