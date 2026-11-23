import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
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

  it('has no placeholders left in the article', () => {
    expect(doc.querySelector('article').textContent).not.toMatch(/\[(CONFIRM|BEVESTIG|SCREENSHOT)/);
  });

  it('has a static helpful link to the contact section and a search field', () => {
    expect(doc.querySelector('a[href="/company/#contact"]')).toBeTruthy();
    expect(doc.querySelector('input[type="search"]')).toBeTruthy();
  });

  it('/docs/ is a landing page that links to the first article', () => {
    const idx = loadPage('/docs/');
    expect(idx.querySelector(`a[href="${ROUTE}"]`)).toBeTruthy();
    expect(idx.querySelector('meta[http-equiv="refresh"]')).toBeNull();
  });
});

const SLUGS = ['build-your-first-website', 'import-an-existing-site', 'a-tour-of-the-editor', 'forms-and-leads', 'set-up-your-sender', 'send-a-campaign', 'follow-up-emails', 'connect-your-domain'];
const text = (el) => el.textContent.replace(/\s+/g, ' ').trim();
const builtCss = () => {
  const dir = join(process.cwd(), 'dist', '_astro');
  return readdirSync(dir).filter((f) => f.endsWith('.css')).map((f) => readFileSync(join(dir, f), 'utf8')).join('\n').replace(/\s+/g, '');
};

describe.each([['en', ''], ['nl', '/nl']])('docs tutorials (%s)', (lang, prefix) => {
  it.each(SLUGS)('%s: contents, guide list, search and language filter', (slug) => {
    const route = `${prefix}/docs/${slug}/`;
    const d = loadPage(route);
    // every "On this page" link points at an h2 id in the article (Review Focus 2: works without JS)
    const ids = new Set([...d.querySelectorAll('main h2[id]')].map((h) => h.id));
    const links = [...d.querySelectorAll('.toc a')];
    expect(links.length).toBeGreaterThan(0);
    for (const a of links) expect(ids.has(a.getAttribute('href').slice(1)), a.outerHTML).toBe(true);
    // the menu panel carries the guide list and marks the current tutorial
    const current = [...d.querySelectorAll('header.site-nav .navguides a[aria-current="page"]')];
    expect(current).toHaveLength(1);
    expect(current[0].getAttribute('href')).toBe(route);
    expect(d.querySelectorAll('header.site-nav .navguides a')).toHaveLength(SLUGS.length);
    // search: labelled, in the page language, and the article is tagged for the same language
    expect(d.querySelector('label.docsearch input[data-docs-search]').getAttribute('data-lang')).toBe(lang);
    expect(d.querySelector('article[data-search-body]').getAttribute('data-search-lang')).toBe(lang);
    // the index is linked from the page (so it still resolves after the app's importer makes links relative)
    expect(d.querySelector('head link[data-search-index]').getAttribute('href')).toBe(`/search-index-${lang}.json`);
  });

  it('sidebar and contents are sticky in the built CSS', () => {
    expect(builtCss()).toMatch(/\.side[^{}]*\.toc[^{}]*\{[^}]*position:sticky/);
  });

  it('the landing page chips and the three starter steps link to the right tutorials', () => {
    const d = loadPage(`${prefix}/docs/`);
    const hrefs = (sel) => [...d.querySelectorAll(sel)].map((a) => a.getAttribute('href'));
    expect(hrefs('main .try a')).toEqual([`${prefix}/docs/connect-your-domain/`, `${prefix}/docs/send-a-campaign/`, `${prefix}/email/`, `${prefix}/docs/forms-and-leads/`]);
    expect(hrefs('main [data-section="steps"] a')).toEqual([`${prefix}/docs/build-your-first-website/`, `${prefix}/docs/connect-your-domain/`, `${prefix}/docs/send-a-campaign/`]);
    expect(d.querySelectorAll('main [data-section="topics"] .topic li a')).toHaveLength(SLUGS.length);
    expect(d.querySelector('label.docsearch input').getAttribute('data-lang')).toBe(lang);
    expect(text(d.querySelector('h1')).length).toBeGreaterThan(10);
  });
});

describe('search index', () => {
  it.each(['en', 'nl'])('builds search-index-%s.json with the 8 articles of that language', (lang) => {
    const file = join(process.cwd(), 'dist', `search-index-${lang}.json`);
    expect(existsSync(file)).toBe(true);
    const entries = JSON.parse(readFileSync(file, 'utf8'));
    expect(entries).toHaveLength(8);
    for (const e of entries) {
      expect(e.url.startsWith(lang === 'nl' ? '/nl/docs/' : '/docs/')).toBe(true);
      expect(e.title.length).toBeGreaterThan(3);
      expect(e.headings.length).toBeGreaterThan(0);
      expect(e.text.length).toBeGreaterThan(200);
    }
  });
});
