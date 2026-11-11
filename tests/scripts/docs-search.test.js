// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { renderResults } from '../../src/scripts/docs-search.js';

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

  it('drops javascript: urls', () => {
    renderResults(box, 'a', [{ url: 'javascript:alert(1)', title: 'A', excerpt: 'a' }]);
    expect(box.querySelector('a').getAttribute('href')).not.toMatch(/^javascript:/i);
  });
});
