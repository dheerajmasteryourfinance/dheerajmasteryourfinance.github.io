import { describe, it, expect } from 'vitest';
import { loadPage, allRoutes } from './helpers.js';

const routes = allRoutes();
const isNl = (r) => r.startsWith('/nl/');
const counterpart = (r) => (isNl(r) ? r.slice(3) : `/nl${r}`);
const text = (el) => el.textContent.replace(/\s+/g, ' ').trim();
const CTA = { en: 'Start free trial', nl: 'Start gratis proefperiode' };
const TRUST = {
  en: ['Verified senders', 'Easy unsubscribe'],
  nl: ['Geverifieerde afzenders', 'Makkelijk uitschrijven'],
};

describe.each(routes)('%s', (route) => {
  const doc = loadPage(route);
  const lang = route === '/404.html' ? 'en' : isNl(route) ? 'nl' : 'en';
  const loc = (p) => (lang === 'nl' ? `/nl${p}` : p);
  const header = doc.querySelector('body > header.site-nav');

  it('has one menu toggle with an accessible name', () => {
    const toggles = doc.querySelectorAll('#navtoggle');
    expect(toggles).toHaveLength(1);
    expect(toggles[0].getAttribute('type')).toBe('checkbox');
    expect((toggles[0].getAttribute('aria-label') ?? '').trim()).not.toBe('');
    expect(header.querySelector('label.navback[for="navtoggle"]')).toBeTruthy();
  });

  it('puts Features, Docs and Company in the menu panel, in the page language', () => {
    const hrefs = [...header.querySelectorAll('.navpanel nav.navlinks a')].map((a) => a.getAttribute('href'));
    for (const p of ['/features/', '/docs/', '/company/']) expect(hrefs).toContain(loc(p));
  });

  it('has exactly one free-trial CTA in the header, in the actions, linking to the app sign-up', () => {
    const ctas = [...header.querySelectorAll('a')].filter((a) => text(a) === CTA[lang]);
    expect(ctas).toHaveLength(1);
    expect(ctas[0].closest('.navactions')).toBeTruthy();
    expect(ctas[0].getAttribute('href')).toBe('https://app.website-generator.nl/register');
  });

  it('language switch points at this page in the other language', () => {
    const links = [...header.querySelectorAll('.navpanel .lang-switch a')];
    expect(links.map((a) => a.getAttribute('hreflang'))).toEqual(['en', 'nl']);
    const nlHref = links[1].getAttribute('href');
    const enHref = links[0].getAttribute('href');
    if (route === '/404.html') {
      expect([enHref, nlHref]).toEqual(['/', '/nl/']);
    } else {
      expect(lang === 'nl' ? nlHref : enHref).toBe(route);
      expect(lang === 'nl' ? enHref : nlHref).toBe(counterpart(route));
    }
  });

  it('footer shows the company facts with the local tax label', () => {
    const f = text(doc.querySelector('footer.site-footer'));
    expect(f).toContain('Master Your Business');
    expect(f).toContain('KvK 99530856');
    expect(f).toContain(lang === 'nl' ? 'BTW NL869028662B01' : 'VAT NL869028662B01');
    expect(f).toContain('Steijnstraat 18, 2987 AS Ridderkerk');
  });

  it('footer has the two trust points', () => {
    const items = [...doc.querySelectorAll('footer .footer-trust li')].map(text);
    expect(items).toEqual(TRUST[lang]);
  });
});
