import { describe, it, expect } from 'vitest';
import { loadPage } from './helpers.js';

const IDS = ['build', 'leads', 'email', 'search', 'domains', 'languages'];
const NATIVE = ['English', 'Nederlands', 'Français', 'Deutsch', '中文', '日本語', 'Español', 'Русский'];
const text = (el) => el.textContent.replace(/\s+/g, ' ').trim();

const LANGS = {
  en: { route: '/features/', prefix: '', early: 'Request early access', guides: 'Read the guides', phone: 'Looks right on every phone' },
  nl: { route: '/nl/features/', prefix: '/nl', early: 'Vraag vroege toegang aan', guides: 'Lees de handleidingen', phone: 'Ziet er op elke telefoon goed uit' },
};

describe.each(Object.entries(LANGS))('features page (%s)', (lang, c) => {
  const doc = loadPage(c.route);

  it('has sections with the six feature ids', () => {
    for (const id of IDS) expect(doc.querySelector(`main > section#${id}`), id).toBeTruthy();
  });

  it('has a route nav with six stop links, in order', () => {
    const nav = doc.querySelector('main nav.route');
    expect(nav).toBeTruthy();
    const hrefs = [...nav.querySelectorAll('a.stoplink')].map((a) => a.getAttribute('href'));
    expect(hrefs).toEqual(IDS.map((i) => `#${i}`));
  });

  it('has a chip nav with the same six links for small screens', () => {
    const nav = doc.querySelector('main nav.chip-nav');
    expect(nav).toBeTruthy();
    expect([...nav.querySelectorAll('a')].map((a) => a.getAttribute('href'))).toEqual(IDS.map((i) => `#${i}`));
  });

  it('languages row lists the eight languages by native name, with the translate screenshot', () => {
    const row = doc.querySelector('main > section#languages');
    const names = [...row.querySelectorAll('.lang-list li .native')].map(text);
    expect(names).toEqual(NATIVE);
    const img = row.querySelector('img');
    expect(img.getAttribute('src')).toMatch(/\/_astro\/lang-translate\./);
    expect((img.getAttribute('alt') ?? '').trim().length).toBeGreaterThan(10);
  });

  it('has a closing CTA with early access and the guides', () => {
    const cta = doc.querySelector('main > section[data-section="cta"]');
    const links = [...cta.querySelectorAll('a')];
    expect(links.find((a) => text(a) === c.early).getAttribute('href')).toBe(`${c.prefix}/early-access/`);
    expect(links.find((a) => text(a) === c.guides).getAttribute('href')).toBe(`${c.prefix}/docs/`);
  });

  it('mentions no pricing', () => {
    expect(doc.body.textContent).not.toMatch(/pricing|price|prijs|prijzen/i);
  });

  it('Build shows the brief and the editor screenshots instead of the CSS mock', () => {
    const build = doc.querySelector('main > section#build');
    expect(build.querySelector('.mock')).toBeNull();
    const srcs = [...build.querySelectorAll('img')].map((i) => i.getAttribute('src'));
    expect(srcs.some((x) => /\/_astro\/new-website-brief\./.test(x))).toBe(true);
    expect(srcs.some((x) => /\/_astro\/editor-(edit|ai)\./.test(x))).toBe(true);
  });

  it('Build has the phone row with the mobile preview screenshot', () => {
    const row = doc.querySelector('main > section#build .phone-row');
    expect(text(row.querySelector('h3'))).toBe(c.phone);
    expect(row.querySelector('img').getAttribute('src')).toMatch(/\/_astro\/editor-mobile\./);
  });

  it('every image is lazy with alt, width, height and sizes', () => {
    const imgs = [...doc.querySelectorAll('main img')];
    expect(imgs.length).toBeGreaterThanOrEqual(4);
    for (const img of imgs) {
      expect(img.getAttribute('loading')).toBe('lazy');
      expect((img.getAttribute('alt') ?? '').trim().length).toBeGreaterThan(10);
      expect(Number(img.getAttribute('width'))).toBeGreaterThan(0);
      expect(Number(img.getAttribute('height'))).toBeGreaterThan(0);
      expect(img.getAttribute('sizes')).toBeTruthy();
    }
  });

  it('keeps double opt-in optional', () => {
    expect(text(doc.querySelector('main'))).not.toMatch(/so every subscriber confirmed/);
  });
});
