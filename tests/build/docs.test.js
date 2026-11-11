import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { loadPage, allRoutes } from './helpers.js';

const ROUTE = '/docs/build-your-first-website/';
const doc = loadPage(ROUTE);
const routes = new Set(allRoutes());

describe('docs article', () => {
  it('has one h1', () => {
    const h1 = doc.querySelectorAll('h1');
    expect(h1).toHaveLength(1);
    expect(h1[0].textContent.trim()).toBe('Build your first website');
  });

  it('marks the sidebar link to itself as current', () => {
    const link = doc.querySelector(`nav[aria-label="Docs"] a[href="${ROUTE}"]`);
    expect(link?.getAttribute('aria-current')).toBe('page');
  });

  it('every sidebar href resolves to a built route', () => {
    const links = [...doc.querySelectorAll('nav[aria-label="Docs"] a[href]')];
    expect(links.length).toBeGreaterThan(0);
    for (const a of links) expect(routes.has(a.getAttribute('href'))).toBe(true);
  });

  it('"On this page" links match the h2 ids', () => {
    const ids = [...doc.querySelectorAll('article h2[id]')].map((h) => h.id);
    const hrefs = [...doc.querySelectorAll('nav[aria-label="On this page"] a')].map((a) =>
      a.getAttribute('href'),
    );
    expect(ids.length).toBeGreaterThan(0);
    expect(hrefs).toEqual(ids.map((i) => `#${i}`));
  });

  it('uses the real app labels', () => {
    const text = doc.querySelector('article').textContent;
    for (const label of ['New website', 'Publish', 'AI assistant', 'Design', 'History', 'Save']) {
      expect(text).toContain(label);
    }
  });

  it('says publishing goes to a free address', () => {
    expect(doc.querySelector('article').textContent).toContain('free address');
  });

  it('keeps the subscription note as a CONFIRM placeholder', () => {
    expect(doc.querySelector('article').textContent).toMatch(/\[CONFIRM: [^\]]*subscription[^\]]*\]/);
  });

  it('has a static helpful link to the contact section and a search field', () => {
    expect(doc.querySelector('a[href="/company/#contact"]')).toBeTruthy();
    expect(doc.querySelector('input[type="search"]')).toBeTruthy();
  });

  it('/docs/ links to the first article', () => {
    const idx = loadPage('/docs/');
    expect(idx.querySelector(`a[href="${ROUTE}"]`)).toBeTruthy();
    expect(idx.querySelector('meta[http-equiv="refresh"]')).toBeTruthy();
  });
});

describe('search index', () => {
  it('builds pagefind.js', () => {
    expect(existsSync(join(process.cwd(), 'dist', 'pagefind', 'pagefind.js'))).toBe(true);
  });
});
