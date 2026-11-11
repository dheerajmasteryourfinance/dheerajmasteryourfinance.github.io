import { describe, it, expect } from 'vitest';
import { loadPage } from './helpers.js';

const doc = loadPage('/');
const ORDER = ['hero', 'product', 'problem', 'guide', 'value', 'plan', 'audience', 'stakes', 'responsible', 'learn', 'faq', 'cta'];
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

  it('has Build my site in nav, hero and closing CTA, all the same href, and one See an example', () => {
    const nav = linksNamed(doc.querySelector('nav'), 'Build my site');
    const hero = linksNamed(sec('hero'), 'Build my site');
    const cta = linksNamed(sec('cta'), 'Build my site');
    expect(nav).toHaveLength(1);
    expect(hero).toHaveLength(1);
    expect(cta).toHaveLength(1);
    const href = nav[0].getAttribute('href');
    expect(hero[0].getAttribute('href')).toBe(href);
    expect(cta[0].getAttribute('href')).toBe(href);
    expect(linksNamed(doc, 'See an example')).toHaveLength(1);
    expect(linksNamed(doc, 'See an example')[0].getAttribute('href')).toBe('#example');
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
});
