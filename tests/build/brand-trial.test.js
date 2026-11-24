import { describe, it, expect } from 'vitest';
import { loadPage, allRoutes } from './helpers.js';

const text = (el) => el.textContent.replace(/\s+/g, ' ').trim();
const REG = 'https://app.website-generator.nl/register';

describe('brand name', () => {
  it('no page text says WebGen any more (the brand is Webgnr, like the domain)', () => {
    const bad = allRoutes().filter((r) => /WebGen(?!erator)/.test(loadPage(r).body.textContent) || /WebGen(?!erator)/.test(loadPage(r).title ?? ''));
    expect(bad).toEqual([]);
  });

  it('titles and the logo use Webgnr', () => {
    for (const r of ['/', '/nl/', '/features/', '/docs/']) {
      const doc = loadPage(r);
      expect(doc.querySelector('.logo-word').textContent.trim(), r).toBe('Webgnr');
      expect(doc.querySelector('meta[property="og:site_name"]').getAttribute('content')).toBe('Webgnr');
    }
  });
});

describe('free 14-day trial', () => {
  it.each(allRoutes())('%s has a header button that starts the trial in the app', (route) => {
    const links = [...loadPage(route).querySelectorAll('header.site-nav a.nav-cta')];
    expect(links).toHaveLength(1);
    expect(links[0].getAttribute('href')).toBe(REG);
  });

  it.each([['/', 'Start your free 14-day trial', 'Free for 14 days'], ['/nl/', 'Start je gratis proefperiode van 14 dagen', '14 dagen gratis']])('%s hero leads with the trial', (route, label, chip) => {
    const hero = loadPage(route).querySelector('main > section[data-section="hero"]');
    const a = [...hero.querySelectorAll('a')].find((x) => text(x) === label);
    expect(a.getAttribute('href')).toBe(REG);
    expect(text(hero)).toContain(chip);
  });

  it('the early-access page still offers the trial and keeps the request form', () => {
    const doc = loadPage('/early-access/');
    expect(doc.querySelector('main a[href="' + REG + '"]')).toBeTruthy();
    expect(doc.querySelector('main form[method="post"]')).toBeTruthy();
  });
});

describe('brand story is a core value', () => {
  it.each([['/', 'brand story'], ['/nl/', 'merkverhaal'], ['/features/', 'brand story'], ['/nl/features/', 'merkverhaal'], ['/early-access/', 'brand story'], ['/nl/early-access/', 'merkverhaal']])('%s names the %s', (route, word) => {
    expect(text(loadPage(route).querySelector('main')).toLowerCase()).toContain(word);
  });

  it('the home hero promises the brand story, not just a site', () => {
    const lede = text(loadPage('/').querySelector('p.lede[data-audience="business"]'));
    expect(lede).toMatch(/brand story/i);
  });
});
