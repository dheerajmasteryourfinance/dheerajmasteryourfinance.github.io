import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { loadPage } from './helpers.js';

const text = (el) => el.textContent.replace(/\s+/g, ' ').trim();
const NATIVE = ['English', 'Nederlands', 'Français', 'Deutsch', '中文', '日本語', 'Español', 'Русский'];

const L = {
  en: { list: '/examples/', detail: '/examples/greenleaf-bakery/', prefix: '', early: 'Request early access', more: 'More examples on the way', navLabel: 'Examples' },
  nl: { list: '/nl/examples/', detail: '/nl/examples/greenleaf-bakery/', prefix: '/nl', early: 'Vraag vroege toegang aan', more: 'Meer voorbeelden volgen', navLabel: 'Voorbeelden' },
};

const builtCss = () => {
  const dir = join(process.cwd(), 'dist', '_astro');
  return readdirSync(dir).filter((f) => f.endsWith('.css')).map((f) => readFileSync(join(dir, f), 'utf8')).join('\n').replace(/\s+/g, '');
};

describe.each(Object.entries(L))('examples page (%s)', (lang, c) => {
  const doc = loadPage(c.list);
  const grid = doc.querySelector('main .example-grid');

  it('has trade chips (All + 5) and language chips (All + 8) as buttons', () => {
    const trade = [...doc.querySelectorAll('button[data-filter-trade]')];
    const langs = [...doc.querySelectorAll('button[data-filter-lang]')];
    expect(trade.map((b) => b.getAttribute('data-filter-trade'))).toEqual(['all', 'bakery', 'restaurant', 'coach', 'agency', 'local']);
    expect(langs.map((b) => b.getAttribute('data-filter-lang'))).toEqual(['all', 'en', 'nl', 'fr', 'de', 'zh', 'ja', 'es', 'ru']);
    expect(trade[0].getAttribute('aria-pressed')).toBe('true');
    expect(langs[0].getAttribute('aria-pressed')).toBe('true');
    expect(langs.slice(1).map(text)).toEqual(NATIVE);
  });

  it('grid has the GreenLeaf featured card, 4 example cards and the "more on the way" slot, none hidden', () => {
    expect(grid.querySelectorAll(':scope > .featured[data-trade]')).toHaveLength(1);
    expect(grid.querySelectorAll(':scope > .excard[data-trade]')).toHaveLength(4);
    expect(text(grid.querySelector(':scope > .more-slot'))).toContain(c.more);
    for (const el of grid.querySelectorAll('*')) expect(el.hasAttribute('hidden'), el.outerHTML.slice(0, 80)).toBe(false);
  });

  it('card titles carry .card-title and the built CSS lets them wrap anywhere', () => {
    expect(grid.querySelectorAll('.card-title').length).toBeGreaterThanOrEqual(5);
    expect(builtCss()).toMatch(/\.card-title[^{}]*\{[^}]*overflow-wrap:anywhere/);
  });

  it('the Examples link in the main nav is current', () => {
    const link = [...doc.querySelectorAll('header.site-nav .navlinks a')].find((a) => text(a) === c.navLabel);
    expect(link.getAttribute('aria-current')).toBe('page');
    expect(link.getAttribute('href')).toBe(c.list);
  });

  it('industry cards point to early access', () => {
    const cards = [...doc.querySelectorAll('main [data-section="industry"] a')];
    expect(cards).toHaveLength(5);
    for (const a of cards) expect(a.getAttribute('href')).toBe(`${c.prefix}/early-access/`);
  });

  it('has a closing CTA to early access', () => {
    const a = [...doc.querySelectorAll('main > section[data-section="cta"] a')].find((x) => text(x) === c.early);
    expect(a.getAttribute('href')).toBe(`${c.prefix}/early-access/`);
  });
});

describe.each(Object.entries(L))('GreenLeaf detail page (%s)', (lang, c) => {
  const doc = loadPage(c.detail);
  const names = [...doc.querySelectorAll('main > section')].map((s) => s.getAttribute('data-section'));

  it('has the seven sections in order', () => {
    expect(names).toEqual(['hero', 'preview', 'made', 'languages', 'mobile', 'result', 'cta']);
  });

  it('languages shows 3 language cards and the 2 how-it-works screenshots, every image with alt', () => {
    const s = doc.querySelector('main > section[data-section="languages"]');
    expect(s.querySelectorAll('.lang-card')).toHaveLength(3);
    const srcs = [...s.querySelectorAll('img')].map((i) => i.getAttribute('src'));
    for (const name of ['lang-fr-edit', 'lang-de-hero', 'lang-menu', 'lang-translate']) {
      expect(srcs.some((x) => x.includes(`/_astro/${name}.`)), name).toBe(true);
    }
    for (const img of doc.querySelectorAll('main img')) {
      expect((img.getAttribute('alt') ?? '').trim().length, img.outerHTML.slice(0, 90)).toBeGreaterThan(10);
    }
  });

  it('the Examples link in the main nav is current', () => {
    const link = [...doc.querySelectorAll('header.site-nav .navlinks a')].find((a) => text(a) === c.navLabel);
    expect(link.getAttribute('aria-current')).toBe('page');
  });

  it('links back to all examples and keeps unconfirmed facts as placeholders', () => {
    expect([...doc.querySelectorAll('main a')].some((a) => a.getAttribute('href') === c.list)).toBe(true);
    expect(text(doc.querySelector('main'))).toMatch(/\[(CONFIRM|BEVESTIG): /);
  });
});
