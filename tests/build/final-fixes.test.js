import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadPage, allRoutes } from './helpers.js';

const DIST = join(process.cwd(), 'dist');
const APP_LABELS = new Set(['Sign in', 'Open the app', 'Inloggen', 'Open de app']);

describe('app links are gated by a placeholder', () => {
  it('every Sign in / Open the app link carries data-placeholder', () => {
    const bad = [];
    let seen = 0;
    for (const route of allRoutes()) {
      for (const a of loadPage(route).querySelectorAll('a')) {
        if (!APP_LABELS.has(a.textContent.trim())) continue;
        seen += 1;
        if (!a.hasAttribute('data-placeholder') || !/^\[[A-Z]+[\] :]/.test(a.getAttribute('data-placeholder'))) {
          bad.push(`${route} ${a.textContent.trim()}`);
        }
      }
    }
    expect(seen).toBeGreaterThan(allRoutes().length);
    expect(bad).toEqual([]);
  });

  it('See an example points at the proof section and is no longer gated', () => {
    const a = [...loadPage('/').querySelectorAll('a')].find((x) => x.textContent.trim() === 'See an example');
    expect(a.getAttribute('href')).toBe('#proof');
    expect(a.hasAttribute('data-placeholder')).toBe(false);
  });
});

describe('early access is the primary CTA everywhere', () => {
  it('no page says Build my site', () => {
    const hits = allRoutes().filter((r) => /Build my site/.test(loadPage(r).body.textContent));
    expect(hits).toEqual([]);
  });

  it.each([
    ['en', 'Request early access', '/early-access/'],
    ['nl', 'Vraag vroege toegang aan', '/nl/early-access/'],
  ])('%s: every "%s" link is internal, ungated and goes to %s', (lang, label, target) => {
    const routes = allRoutes().filter((r) => r.startsWith('/nl/') === (lang === 'nl'));
    let seen = 0;
    for (const route of routes) {
      for (const a of loadPage(route).querySelectorAll('a')) {
        if (a.textContent.replace(/\s+/g, ' ').trim() !== label) continue;
        seen += 1;
        expect(a.getAttribute('href'), route).toBe(target);
        expect(a.hasAttribute('data-placeholder'), route).toBe(false);
        expect(a.hasAttribute('rel'), route).toBe(false);
      }
    }
    // One in the nav of every page, plus at least Home hero, Home closing CTA, Home sticky bar and Features CTA.
    // Later pages add their own closing CTAs, so this is a floor, not an exact count.
    expect(seen).toBeGreaterThanOrEqual(routes.length + 4);
  });
});

describe('email page claims', () => {
  const text = loadPage('/email/').querySelector('main').textContent;
  it('does not say unsubscribing needs no confirmation', () => {
    expect(text).not.toMatch(/or confirm anything/);
    expect(text).toMatch(/confirm on the page that opens/);
  });
  it('makes double opt-in conditional', () => {
    expect(text).not.toMatch(/you would also have clicked a confirmation link we sent/);
    expect(text).toMatch(/If the business asks new subscribers to confirm/);
  });
});

describe('feature claims', () => {
  it('Home and Features call double opt-in optional', () => {
    const home = loadPage('/').querySelector('main').textContent;
    const feat = loadPage('/features/').querySelector('main').textContent;
    expect(home).not.toMatch(/Subscribers confirm before they get anything/);
    expect(home).toMatch(/Optional double opt-in/);
    expect(feat).not.toMatch(/so every subscriber confirmed/);
    expect(feat).toMatch(/Optional double opt-in/);
  });
  it('unshipped SEO claims carry a placeholder', () => {
    const html = (r) => readFileSync(join(DIST, r, 'index.html'), 'utf8');
    expect(html('features')).toContain('[CONFIRM: ships with the SEO release]');
    expect(html('')).toContain('[CONFIRM: ships with the SEO release]');
  });
});

describe('focus ring on dark backgrounds', () => {
  it('uses the accent outline inside ink areas', () => {
    const css = readFileSync(join(process.cwd(), 'src/styles/base.css'), 'utf8');
    // The footer is light since canvas v84, so its focus ring uses the link blue.
    expect(css).toMatch(/\.site-footer :focus-visible[\s\S]*?outline-color:\s*var\(--link\)/);
    const home = readFileSync(join(process.cwd(), 'src/components/pages/HomePage.astro'), 'utf8');
    expect(home).toMatch(/section\.final :focus-visible[\s\S]*?var\(--accent\)/);
  });
});

describe('404 page', () => {
  it('has noindex and no canonical', () => {
    const doc = loadPage('/404.html');
    expect(doc.querySelector('link[rel="canonical"]')).toBeNull();
    expect(doc.querySelector('meta[name="robots"]').getAttribute('content')).toBe('noindex');
  });
});

describe('JSON-LD escape is applied', () => {
  it('component calls safeJson and the built script equals safeJson of its data', async () => {
    const { safeJson } = await import('../../src/lib/json-ld.mjs');
    const src = readFileSync(join(process.cwd(), 'src/components/OrgJsonLd.astro'), 'utf8');
    expect(src).toMatch(/const json = safeJson\(data\)/);
    const html = readFileSync(join(DIST, 'index.html'), 'utf8');
    const m = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    expect(m).not.toBeNull();
    expect(m[1]).not.toContain('<');
    expect(m[1]).toBe(safeJson(JSON.parse(m[1])));
  });
});

describe('no one-click claim', () => {
  it('no built page says one-click', () => {
    const hits = allRoutes().filter((r) => /one-click/i.test(readFileSync(join(DIST, r.endsWith('.html') ? r : `${r}index.html`), 'utf8')));
    expect(hits).toEqual([]);
  });
});
