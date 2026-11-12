import { describe, it, expect } from 'vitest';
import { loadPage } from './helpers.js';

const doc = loadPage('/');
const ORDER = ['hero', 'product', 'examples', 'problem', 'guide', 'value', 'plan', 'audience', 'stakes', 'responsible', 'learn', 'faq', 'cta'];
const sec = (n) => doc.querySelector(`main > section[data-section="${n}"]`);
const linksNamed = (scope, text) => [...scope.querySelectorAll('a')].filter((a) => a.textContent.trim() === text);

describe('home page', () => {
  it('has the sections in order', () => {
    const names = [...doc.querySelectorAll('main > section')].map((s) => s.getAttribute('data-section'));
    expect(names).toEqual(ORDER);
  });

  it('ships agency blocks hidden and business pressed (no-JS state)', () => {
    const agency = doc.querySelectorAll('[data-audience="agency"]');
    expect(agency.length).toBeGreaterThan(0);
    agency.forEach((e) => expect(e.hasAttribute('hidden')).toBe(true));
    doc.querySelectorAll('[data-audience="business"]').forEach((e) => expect(e.hasAttribute('hidden')).toBe(false));
    expect(doc.querySelector('[data-audience-btn="business"]').getAttribute('aria-pressed')).toBe('true');
    expect(doc.querySelector('[data-audience-btn="agency"]').getAttribute('aria-pressed')).toBe('false');
  });

  it('has the business and agency h1s', () => {
    expect(doc.querySelector('h1[data-audience="business"]').textContent).toContain('Your website, built for you.');
    expect(doc.querySelector('h1[data-audience="agency"]').textContent).toContain('Ship client sites faster.');
  });

  it('plan has exactly 3 steps', () => {
    expect(sec('plan').querySelectorAll('ol > li')).toHaveLength(3);
  });

  it('stakes has two lists of 3 items', () => {
    const lists = sec('stakes').querySelectorAll('ul');
    expect(lists).toHaveLength(2);
    lists.forEach((l) => expect(l.querySelectorAll('li')).toHaveLength(3));
  });

  it('has Request early access in nav, hero and closing CTA, all to /early-access/, and one See an example', () => {
    const nav = linksNamed(doc.querySelector('nav'), 'Request early access');
    const hero = linksNamed(sec('hero'), 'Request early access');
    const cta = linksNamed(sec('cta'), 'Request early access');
    expect(nav).toHaveLength(1);
    expect(hero).toHaveLength(1);
    expect(cta).toHaveLength(1);
    for (const a of [...nav, ...hero, ...cta]) {
      expect(a.getAttribute('href')).toBe('/early-access/');
      expect(a.hasAttribute('data-placeholder')).toBe(false);
    }
    expect(linksNamed(doc, 'Build my site')).toHaveLength(0);
    const example = linksNamed(doc, 'See an example');
    expect(example).toHaveLength(1);
    expect(example[0].getAttribute('href')).toBe('#examples');
    expect(example[0].hasAttribute('data-placeholder')).toBe(false);
    expect(doc.getElementById('examples')).toBe(sec('examples'));
  });

  it('responsible links to /email/', () => {
    expect([...sec('responsible').querySelectorAll('a')].some((a) => a.getAttribute('href') === '/email/')).toBe(true);
  });

  it('learn cards link to the agreed /docs/ slugs', () => {
    const hrefs = [...sec('learn').querySelectorAll('a')].map((a) => a.getAttribute('href'));
    for (const s of ['build-your-first-website', 'connect-your-domain', 'send-a-campaign', 'follow-up-emails']) {
      expect(hrefs).toContain(`/docs/${s}/`);
    }
    for (const h of hrefs) expect(h.startsWith('/docs/')).toBe(true);
  });

  it('product shows the real editor screenshot as the eager, high-priority hero image', () => {
    const imgs = sec('product').querySelectorAll('img');
    expect(imgs).toHaveLength(1);
    const img = imgs[0];
    expect(img.getAttribute('src')).toMatch(/\/_astro\/editor-edit\.[\w-]+\.(webp|avif)$/);
    expect(img.getAttribute('alt').length).toBeGreaterThan(20);
    expect(img.getAttribute('loading')).toBe('eager');
    expect(img.getAttribute('fetchpriority')).toBe('high');
    expect(Number(img.getAttribute('width'))).toBeGreaterThan(0);
    expect(Number(img.getAttribute('height'))).toBeGreaterThan(0);
    expect(img.getAttribute('sizes')).toBeTruthy();
    expect(img.closest('picture')?.querySelector('source[type="image/avif"]')).toBeTruthy();
    expect(sec('product').querySelector('.shot-body')).toBeNull();
  });

  it('every other image on the page is lazy, with alt, width, height and sizes', () => {
    const hero = sec('product').querySelector('img');
    const rest = [...doc.querySelectorAll('main img')].filter((i) => i !== hero);
    expect(rest.length).toBeGreaterThanOrEqual(3);
    for (const img of rest) {
      expect(img.getAttribute('loading'), img.outerHTML).toBe('lazy');
      expect((img.getAttribute('alt') ?? '').trim().length, img.outerHTML).toBeGreaterThan(10);
      expect(Number(img.getAttribute('width'))).toBeGreaterThan(0);
      expect(Number(img.getAttribute('height'))).toBeGreaterThan(0);
      expect(img.getAttribute('sizes')).toBeTruthy();
    }
  });
});

describe('Built with WebGen examples', () => {
  const s = sec('examples');
  const cards = [...s.querySelectorAll('.ex-card')];

  it('is titled Built with WebGen and has 3 cards', () => {
    expect(s.querySelector('h2').textContent.trim()).toBe('Built with WebGen');
    expect(cards).toHaveLength(3);
  });

  it('card 1 is GreenLeaf Bakery, labelled as an example, with desktop and phone screenshots', () => {
    const c = cards[0];
    expect(c.querySelector('h3').textContent.trim()).toBe('GreenLeaf Bakery');
    expect(c.textContent).toContain('Example site');
    expect(c.textContent).toContain('Amsterdam');
    const srcs = [...c.querySelectorAll('img')].map((i) => i.getAttribute('src'));
    expect(srcs.some((x) => /\/_astro\/site-desktop\./.test(x))).toBe(true);
    expect(srcs.some((x) => /\/_astro\/site-mobile\./.test(x))).toBe(true);
    expect(c.textContent).not.toMatch(/customer/i);
  });

  it('cards 2 and 3 are gated customer placeholders with no screenshot', () => {
    for (const c of cards.slice(1)) {
      expect(c.textContent).toContain('[CONFIRM: customer site + permission]');
      expect(c.querySelectorAll('img')).toHaveLength(0);
      expect(c.querySelector('.ex-art')?.getAttribute('aria-hidden')).toBe('true');
    }
  });
});

describe('value bento', () => {
  it('fills the Launch without a designer card with the AI assistant screenshot', () => {
    const wide = sec('value').querySelector('.bento .wide');
    const img = wide.querySelector('img');
    expect(img.getAttribute('src')).toMatch(/\/_astro\/editor-ai\./);
    expect(img.getAttribute('alt')).toMatch(/AI assistant/);
  });
});
