import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadPage, allRoutes } from './helpers.js';

const DIST = join(process.cwd(), 'dist');
const NAV_LABELS = ['Product', 'Docs', 'Company', 'Sign in'];
const text = (el) => el.textContent.replace(/\s+/g, ' ').trim();

/** All CSS a built page ships: linked /_astro sheets plus inline <style> blocks, whitespace removed. */
function pageCss(doc) {
  const sheets = [...doc.querySelectorAll('link[rel="stylesheet"][href^="/"]')].map((l) =>
    readFileSync(join(DIST, l.getAttribute('href')), 'utf8'),
  );
  const inline = [...doc.querySelectorAll('style')].map((s) => s.textContent);
  return [...sheets, ...inline].join('\n').replace(/\s+/g, '');
}

describe('mobile header menu', () => {
  describe.each(allRoutes())('%s', (route) => {
    const doc = loadPage(route);
    const nav = doc.querySelector('nav[aria-label="Main"]');
    const menu = nav?.querySelector('details.nav-menu');

    it('has a closed <details> menu whose summary has an accessible name', () => {
      expect(menu).toBeTruthy();
      expect(menu.hasAttribute('open')).toBe(false);
      const summary = menu.querySelector(':scope > summary');
      expect(summary).toBeTruthy();
      expect(text(summary)).toContain('Open menu');
      expect(text(summary)).toContain('Close menu');
      const panel = doc.getElementById(summary.getAttribute('aria-controls'));
      expect(panel).toBeTruthy();
      expect(menu.contains(panel)).toBe(true);
    });

    it('puts Product, Docs, Company and Sign in inside the menu, with the desktop hrefs', () => {
      const inMenu = [...menu.querySelectorAll('a')];
      expect(inMenu.map(text)).toEqual(NAV_LABELS);
      const desktop = [...nav.querySelectorAll('.nav-links a')];
      expect(desktop.map(text)).toEqual(NAV_LABELS);
      expect(inMenu.map((a) => a.getAttribute('href'))).toEqual(desktop.map((a) => a.getAttribute('href')));
    });

    it('keeps one Request early access CTA in the nav, outside the menu', () => {
      const ctas = [...nav.querySelectorAll('a')].filter((a) => text(a) === 'Request early access');
      expect(ctas).toHaveLength(1);
      expect(menu.contains(ctas[0])).toBe(false);
    });
  });
});

describe('docs mobile menu', () => {
  const ROUTE = '/docs/build-your-first-website/';
  const doc = loadPage(ROUTE);
  const side = doc.querySelector('nav[aria-label="Docs"]');
  const menu = side?.querySelector('details');

  it('has a closed <details> with a "Docs menu" summary naming the current article', () => {
    expect(menu).toBeTruthy();
    expect(menu.hasAttribute('open')).toBe(false);
    const summary = text(menu.querySelector(':scope > summary'));
    expect(summary).toContain('Docs menu');
    expect(summary).toContain(text(doc.querySelector('article h1')));
  });

  it('contains every sidebar link, with the current one marked', () => {
    const all = new Set([...side.querySelectorAll('a')].map((a) => a.getAttribute('href')));
    const inMenu = [...menu.querySelectorAll('a')].map((a) => a.getAttribute('href'));
    // Every built docs article (/docs/<slug>/) is in the sidebar.
    const articles = allRoutes().filter((r) => /^\/docs\/[^/]+\/$/.test(r));
    expect(articles.length).toBeGreaterThan(0);
    expect(all).toEqual(new Set(articles));
    expect(new Set(inMenu)).toEqual(all);
    expect(menu.querySelector(`a[href="${ROUTE}"]`)?.getAttribute('aria-current')).toBe('page');
  });
});

describe('home product shot', () => {
  const doc = loadPage('/');
  const shot = doc.querySelector('main > section[data-section="product"] .shot');

  it('frames the editor screenshot in the browser-window chrome', () => {
    expect(shot.querySelector('.shot-bar')?.getAttribute('aria-hidden')).toBe('true');
    expect(shot.querySelector('picture img')).toBeTruthy();
  });

  it('uses the shadow token on the frame', () => {
    const css = pageCss(doc);
    expect(css).toMatch(/\.product\.shot\{[^}]*box-shadow:var\(--shadow-lift\)/);
  });
});

describe('home value bento', () => {
  const doc = loadPage('/');
  const bento = doc.querySelector('main > section[data-section="value"] .bento');
  const cards = [...bento.children];

  it('is one wide light card, the dark sequence card, then 3 small cards', () => {
    expect(cards).toHaveLength(5);
    expect(cards[0].classList.contains('wide')).toBe(true);
    expect(text(cards[0].querySelector('h3'))).toBe('Launch without a designer');
    expect(cards[1].classList.contains('card-dark')).toBe(true);
    expect(text(cards[1].querySelector('h3'))).toBe('Stay in touch with every lead');
    expect(cards[1].querySelectorAll('.seq li')).toHaveLength(3);
    expect(bento.querySelectorAll('.wide')).toHaveLength(1);
  });
});

describe('shadow token', () => {
  it('defines --shadow-lift once in tokens.css and uses no rgba() literal in components', () => {
    const tokens = readFileSync(join(process.cwd(), 'src/styles/tokens.css'), 'utf8');
    expect(tokens).toMatch(/--shadow-lift:/);
    const docs = readFileSync(join(process.cwd(), 'src/layouts/Docs.astro'), 'utf8');
    expect(docs).not.toMatch(/rgba\(/);
    expect(docs).toContain('var(--shadow-lift)');
  });
});
