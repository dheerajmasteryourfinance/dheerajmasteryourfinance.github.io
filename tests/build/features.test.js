import { describe, it, expect } from 'vitest';
import { loadPage } from './helpers.js';

const doc = loadPage('/features/');
const IDS = ['build', 'leads', 'email', 'search', 'domains'];

describe('features page', () => {
  it('has sections with the five feature ids', () => {
    for (const id of IDS) {
      const s = doc.querySelector(`main > section#${id}`);
      expect(s, id).toBeTruthy();
    }
  });

  it('has an in-page chip nav linking to each section', () => {
    const nav = doc.querySelector('main nav[aria-label="Feature sections"]');
    expect(nav).toBeTruthy();
    const hrefs = [...nav.querySelectorAll('a')].map((a) => a.getAttribute('href'));
    expect(hrefs).toEqual(IDS.map((i) => `#${i}`));
  });

  it('has a closing CTA with Request early access and Read the guides', () => {
    const cta = doc.querySelector('main > section[data-section="cta"]');
    expect(cta).toBeTruthy();
    const links = [...cta.querySelectorAll('a')];
    const early = links.find((a) => a.textContent.trim() === 'Request early access');
    expect(early.getAttribute('href')).toBe('/early-access/');
    const guides = links.find((a) => a.textContent.trim() === 'Read the guides');
    expect(guides.getAttribute('href')).toBe('/docs/');
  });

  it('mentions no pricing', () => {
    expect(doc.body.textContent).not.toMatch(/pricing|price/i);
  });

  it('Build shows the brief and the editor screenshots instead of the CSS mock', () => {
    const build = doc.querySelector('main > section#build');
    expect(build.querySelector('.mock')).toBeNull();
    const srcs = [...build.querySelectorAll('img')].map((i) => i.getAttribute('src'));
    expect(srcs.some((x) => /\/_astro\/new-website-brief\./.test(x))).toBe(true);
    expect(srcs.some((x) => /\/_astro\/editor-(edit|ai)\./.test(x))).toBe(true);
  });

  it('Build has a Looks right on every phone row with the mobile preview screenshot', () => {
    const row = doc.querySelector('main > section#build .phone-row');
    expect(row.querySelector('h3').textContent.trim()).toBe('Looks right on every phone');
    expect(row.querySelector('img').getAttribute('src')).toMatch(/\/_astro\/editor-mobile\./);
  });

  it('every image is lazy with alt, width, height and sizes', () => {
    const imgs = [...doc.querySelectorAll('main img')];
    expect(imgs.length).toBeGreaterThanOrEqual(3);
    for (const img of imgs) {
      expect(img.getAttribute('loading')).toBe('lazy');
      expect((img.getAttribute('alt') ?? '').trim().length).toBeGreaterThan(10);
      expect(Number(img.getAttribute('width'))).toBeGreaterThan(0);
      expect(Number(img.getAttribute('height'))).toBeGreaterThan(0);
      expect(img.getAttribute('sizes')).toBeTruthy();
    }
  });
});
