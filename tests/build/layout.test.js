import { describe, it, expect } from 'vitest';
import { loadPage, allRoutes } from './helpers.js';

const routes = allRoutes();
const SITE = 'webgnr.com';
const APP = 'app.website-generator.nl';

describe('layout', () => {
  it('has at least one built route', () => {
    expect(routes.length).toBeGreaterThan(0);
  });

  describe.each(routes)('%s', (route) => {
    const doc = loadPage(route);

    it('has exactly one <main> whose element children are all <section>', () => {
      const mains = doc.querySelectorAll('main');
      expect(mains).toHaveLength(1);
      const kids = [...mains[0].children];
      expect(kids.length).toBeGreaterThan(0);
      for (const k of kids) {
        expect(k.tagName).toBe('SECTION');
        expect((k.getAttribute('data-section') ?? '').trim()).not.toBe('');
      }
    });

    it('sets <html lang="en">', () => {
      expect(doc.documentElement.getAttribute('lang')).toBe('en');
    });

    it('has canonical = https://webgnr.com + route', () => {
      const c = doc.querySelector('link[rel="canonical"]');
      expect(c?.getAttribute('href')).toBe(`https://${SITE}${route}`);
    });

    it('nav has no pricing link or text', () => {
      const nav = doc.querySelector('nav');
      expect(nav).toBeTruthy();
      expect(nav.textContent).not.toMatch(/pricing/i);
      for (const el of nav.querySelectorAll('*')) expect(el.textContent).not.toMatch(/pricing/i);
    });

    it('loads no <link> or <script> from another host', () => {
      for (const el of doc.querySelectorAll('link[href], script[src]')) {
        const url = el.getAttribute('href') ?? el.getAttribute('src');
        if (/^(https?:)?\/\//.test(url)) {
          const host = new URL(url, `https://${SITE}`).host;
          expect(host).toBe(SITE);
        }
      }
    });

    it('has no <iframe>', () => {
      expect(doc.querySelectorAll('iframe')).toHaveLength(0);
    });

    it('external <a> links have rel containing noopener, and only point at the site or the app', () => {
      for (const a of doc.querySelectorAll('a[href]')) {
        const href = a.getAttribute('href');
        if (!/^https?:\/\//.test(href)) continue;
        const host = new URL(href).host;
        if (host !== SITE) {
          expect(a.getAttribute('rel') ?? '').toContain('noopener');
          expect(host).toBe(APP);
        }
      }
    });
  });
});
