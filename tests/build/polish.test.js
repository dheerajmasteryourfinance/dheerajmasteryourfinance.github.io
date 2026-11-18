import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadPage, allRoutes } from './helpers.js';

const DIST = join(process.cwd(), 'dist');
const NAV_LABELS = { en: ['Product', 'Docs', 'Company', 'Sign in'], nl: ['Product', 'Handleidingen', 'Over ons', 'Inloggen'] };
const CTA = { en: 'Request early access', nl: 'Vraag vroege toegang aan' };
const MENU = { en: ['Open menu', 'Close menu'], nl: ['Menu openen', 'Menu sluiten'] };
// Page links only: the EN | NL language switch is checked in i18n.test.js.
const pageLinks = (scope) => [...scope.querySelectorAll('a')].filter((a) => !a.closest('.lang-switch'));
const text = (el) => el.textContent.replace(/\s+/g, ' ').trim();

/** All CSS a built page ships: linked /_astro sheets plus inline <style> blocks, whitespace removed. */
function pageCss(doc) {
  const sheets = [...doc.querySelectorAll('link[rel="stylesheet"][href^="/"]')].map((l) =>
    readFileSync(join(DIST, l.getAttribute('href')), 'utf8'),
  );
  const inline = [...doc.querySelectorAll('style')].map((s) => s.textContent);
  return [...sheets, ...inline].join('\n').replace(/\s+/g, '');
}

// The mobile header menu is covered by tests/build/header-footer.test.js (slide-in panel, canvas v84).

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
  const shot = doc.querySelector('main > section[data-section="shot"] .shot');

  it('frames the editor screenshot in the browser-window chrome', () => {
    expect(shot.querySelector('.shot-bar')?.getAttribute('aria-hidden')).toBe('true');
    expect(shot.querySelector('picture img')).toBeTruthy();
  });

  it('uses the shadow token on the frame', () => {
    const css = pageCss(doc);
    expect(css).toMatch(/\.shot\{[^}]*box-shadow:var\(--shadow-lift\)/);
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
