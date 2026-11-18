import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { loadPage, allRoutes } from './helpers.js';

const DIST = join(process.cwd(), 'dist');
const read = (f) => readFileSync(join(DIST, f), 'utf8');
const SLUGS = [
  'build-your-first-website',
  'import-an-existing-site',
  'a-tour-of-the-editor',
  'forms-and-leads',
  'set-up-your-sender',
  'send-a-campaign',
  'follow-up-emails',
  'connect-your-domain',
];

describe('docs articles', () => {
  it.each(SLUGS)('%s is built with one h1', (slug) => {
    expect(existsSync(join(DIST, 'docs', slug, 'index.html'))).toBe(true);
    expect(loadPage(`/docs/${slug}/`).querySelectorAll('h1')).toHaveLength(1);
  });

  it.each(SLUGS)('%s does not expose internal endpoints or admin pages', (slug) => {
    const text = loadPage(`/docs/${slug}/`).querySelector('article').textContent;
    expect(text).not.toMatch(/\/api\//);
    expect(text).not.toMatch(/admin/i);
  });

  it('build-your-first-website ends with Next steps cards to domain and sender', () => {
    const doc = loadPage('/docs/build-your-first-website/');
    const h = doc.querySelector('article h2#next-steps');
    expect(h?.textContent.trim()).toBe('Next steps');
    const hrefs = [...doc.querySelectorAll('article a.next-card')].map((a) => a.getAttribute('href'));
    expect(hrefs).toEqual(['/docs/connect-your-domain/', '/docs/set-up-your-sender/']);
  });

  it('every internal link inside articles resolves to a built route', () => {
    const routes = new Set(allRoutes());
    for (const slug of SLUGS) {
      for (const a of loadPage(`/docs/${slug}/`).querySelectorAll('article a[href^="/"]')) {
        const href = a.getAttribute('href').split('#')[0];
        expect(routes.has(href), `${slug} -> ${href}`).toBe(true);
      }
    }
  });
});

describe('404 page', () => {
  it('is built as /404.html, noindex, with nav and links to / and /docs/', () => {
    expect(existsSync(join(DIST, '404.html'))).toBe(true);
    const doc = loadPage('/404.html');
    expect(doc.querySelector('meta[name="robots"]')?.getAttribute('content')).toMatch(/noindex/);
    expect(doc.querySelector('nav')).toBeTruthy();
    const hrefs = [...doc.querySelectorAll('main a[href]')].map((a) => a.getAttribute('href'));
    expect(hrefs).toContain('/');
    expect(hrefs).toContain('/docs/');
    expect(doc.querySelectorAll('h1')).toHaveLength(1);
  });

  it('is included in the shared route list so layout and email checks cover it', () => {
    expect(allRoutes()).toContain('/404.html');
  });
});

describe('robots.txt', () => {
  it('allows all and names the sitemap', () => {
    const t = read('robots.txt');
    expect(t).toMatch(/User-agent:\s*\*/);
    expect(t).toMatch(/Allow:\s*\//);
    expect(t).toContain('Sitemap: https://website-generator.nl/sitemap-index.xml');
  });
});

describe('sitemap', () => {
  it('lists every route except /404/', () => {
    expect(existsSync(join(DIST, 'sitemap-index.xml'))).toBe(true);
    expect(read('sitemap-index.xml')).toContain('https://website-generator.nl/sitemap-0.xml');
    const locs = [...read('sitemap-0.xml').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    const expected = allRoutes()
      .filter((r) => r !== '/404.html')
      .map((r) => `https://website-generator.nl${r}`);
    expect([...locs].sort()).toEqual([...expected].sort());
    expect(locs.some((l) => l.includes('/404'))).toBe(false);
    expect(locs).toContain('https://website-generator.nl/docs/');
    expect(locs).toContain('https://website-generator.nl/nl/docs/');
  });
});

describe('Organization JSON-LD', () => {
  it.each(['/', '/nl/'])('%s has exactly one ld+json block, an Organization named WebGen', (home) => {
    const doc = loadPage(home);
    const blocks = doc.querySelectorAll('script[type="application/ld+json"]');
    expect(blocks).toHaveLength(1);
    const data = JSON.parse(blocks[0].textContent);
    expect(data['@type']).toBe('Organization');
    expect(data.name).toBe('WebGen');
    expect(data.url).toBe('https://website-generator.nl/');
    expect(data.email).toBe('[SUPPORT EMAIL]');
  });

  it('no other route has ld+json', () => {
    for (const r of allRoutes().filter((r) => r !== '/' && r !== '/nl/')) {
      expect(loadPage(r).querySelectorAll('script[type="application/ld+json"]'), r).toHaveLength(0);
    }
  });
});

describe('every route', () => {
  it.each(allRoutes())('%s has a non-empty description meta', (route) => {
    const d = loadPage(route).querySelector('meta[name="description"]');
    expect((d?.getAttribute('content') ?? '').trim().length).toBeGreaterThan(20);
  });
});
