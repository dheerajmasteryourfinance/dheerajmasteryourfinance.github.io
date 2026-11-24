import { describe, it, expect } from 'vitest';
import { loadPage } from './helpers.js';

const ORDER = ['hero', 'shot', 'problem', 'guide', 'how', 'get', 'proof', 'trust', 'faq', 'cta'];
const text = (el) => el.textContent.replace(/\s+/g, ' ').trim();

const COPY = {
  en: {
    route: '/',
    prefix: '',
    h1: 'Get found. Get signed up. Follow up.',
    mark: 'Follow up.',
    agency: 'Ship client sites faster. Send email as the client.',
    stops: ['Check', 'Route', 'Launch'],
    groups: ['Get found', 'Get signed up', 'Follow up'],
    langs: 'Your site in up to 8 languages',
    cta: 'Every day without a site that works',
    early: 'Request early access',
    sticky: 'Be among the first to build with Webgnr',
  },
  nl: {
    route: '/nl/',
    prefix: '/nl',
    h1: 'Word gevonden. Krijg aanmeldingen. Volg op.',
    mark: 'Volg op.',
    agency: 'Lever klantsites sneller op. Mail namens je klant.',
    stops: ['Check', 'Route', 'Lancering'],
    groups: ['Word gevonden', 'Krijg aanmeldingen', 'Volg op'],
    langs: 'Je site in maximaal 8 talen',
    cta: 'Elke dag zonder werkende site',
    early: 'Vraag vroege toegang aan',
    sticky: 'Wees een van de eersten met Webgnr',
  },
};

describe.each(Object.entries(COPY))('home page (%s)', (lang, c) => {
  const doc = loadPage(c.route);
  const sec = (n) => doc.querySelector(`main > section[data-section="${n}"]`);

  it('has the sections in order', () => {
    const names = [...doc.querySelectorAll('main > section')].map((s) => s.getAttribute('data-section'));
    expect(names).toEqual(ORDER);
  });

  it('h1 tells the story, with the last phrase in <mark>', () => {
    const h1 = doc.querySelector('h1[data-audience="business"]');
    expect(text(h1)).toBe(c.h1);
    expect(text(h1.querySelector('mark'))).toBe(c.mark);
  });

  it('audience switch: business pressed, agency headline in the DOM but hidden', () => {
    const buttons = [...sec('hero').querySelectorAll('button[data-audience-btn]')];
    expect(buttons).toHaveLength(2);
    expect(buttons[0].getAttribute('aria-pressed')).toBe('true');
    expect(buttons[1].getAttribute('aria-pressed')).toBe('false');
    const agency = doc.querySelector('h1[data-audience="agency"]');
    expect(text(agency)).toBe(c.agency);
    expect(agency.hasAttribute('hidden')).toBe(true);
    expect(doc.querySelector('h1[data-audience="business"]').hasAttribute('hidden')).toBe(false);
  });

  it('how has a route with 3 stops and three stop cards', () => {
    const how = sec('how');
    expect(how.querySelector('.route')).toBeTruthy();
    expect(how.querySelectorAll('.route .pin')).toHaveLength(3);
    const cards = [...how.querySelectorAll('.stopcard')];
    expect(cards).toHaveLength(3);
    c.stops.forEach((s, i) => expect(text(cards[i]).toLowerCase()).toContain(s.toLowerCase()));
  });

  it('get has the three groups and the 8-languages bullet', () => {
    const groups = [...sec('get').querySelectorAll('.get-group h3')].map(text);
    expect(groups).toEqual(c.groups);
    expect(text(sec('get'))).toContain(c.langs);
  });

  it('proof has GreenLeaf plus 4 strip cards linking to the examples page', () => {
    const p = sec('proof');
    expect(text(p.querySelector('.proof-main'))).toContain('GreenLeaf Bakery');
    const strips = [...p.querySelectorAll('a.excard-strip')];
    expect(strips).toHaveLength(4);
    for (const a of strips) expect(a.getAttribute('href')).toBe(`${c.prefix}/examples/`);
  });

  it('trust shows two cards', () => {
    expect(sec('trust').querySelectorAll('.tc-card')).toHaveLength(2);
  });

  it('faq has exactly 3 details', () => {
    expect(sec('faq').querySelectorAll('details')).toHaveLength(3);
  });

  it('closing CTA carries the stakes line and links to early access', () => {
    expect(text(sec('cta'))).toContain(c.cta);
    const a = [...sec('cta').querySelectorAll('a')].find((x) => text(x) === c.early);
    expect(a.getAttribute('href')).toBe(`${c.prefix}/early-access/`);
  });

  it('hero has exactly one early-access link, and hero and shot carry blobs and chips', () => {
    const hero = [...sec('hero').querySelectorAll('a')].filter((x) => text(x) === c.early);
    expect(hero).toHaveLength(1);
    expect(hero[0].getAttribute('href')).toBe(`${c.prefix}/early-access/`);
    expect(sec('hero').querySelectorAll('.blob').length).toBeGreaterThan(0);
    expect(sec('shot').querySelectorAll('.fchip')).toHaveLength(3);
  });

  it('ends with one sticky early-access bar in the page language', () => {
    const bars = doc.querySelectorAll('[data-sticky-cta]');
    expect(bars).toHaveLength(1);
    expect(text(bars[0])).toContain(c.sticky);
    expect(bars[0].querySelector('a').getAttribute('href')).toBe(`${c.prefix}/early-access/`);
  });

  it('shot uses the real editor screenshot as the eager, high-priority image', () => {
    const imgs = sec('shot').querySelectorAll('img');
    expect(imgs).toHaveLength(1);
    const img = imgs[0];
    expect(img.getAttribute('src')).toMatch(/\/_astro\/editor-edit\.[\w-]+\.(webp|avif)$/);
    expect(img.getAttribute('alt').length).toBeGreaterThan(20);
    expect(img.getAttribute('loading')).toBe('eager');
    expect(img.getAttribute('fetchpriority')).toBe('high');
    expect(Number(img.getAttribute('width'))).toBeGreaterThan(0);
  });

  it('every other image is lazy with dimensions; informative ones have alt text', () => {
    const hero = sec('shot').querySelector('img');
    const rest = [...doc.querySelectorAll('main img')].filter((i) => i !== hero);
    expect(rest.length).toBeGreaterThanOrEqual(4);
    for (const img of rest) {
      expect(img.getAttribute('loading'), img.outerHTML).toBe('lazy');
      expect(Number(img.getAttribute('width'))).toBeGreaterThan(0);
      expect(Number(img.getAttribute('height'))).toBeGreaterThan(0);
      if (!img.closest('.excard-strip')) expect((img.getAttribute('alt') ?? '').trim().length, img.outerHTML).toBeGreaterThan(10);
    }
  });
});

describe('English home', () => {
  const doc = loadPage('/');
  it('"See an example" jumps to the proof section', () => {
    const a = [...doc.querySelectorAll('main a')].find((x) => text(x) === 'See an example');
    expect(a.getAttribute('href')).toBe('#proof');
    expect(doc.getElementById('proof')).toBeTruthy();
  });
});
