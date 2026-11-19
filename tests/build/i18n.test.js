import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { loadPage, allRoutes } from './helpers.js';

const DIST = join(process.cwd(), 'dist');
const SITE = 'https://webgnr.com';
const routes = allRoutes();
const routeSet = new Set(routes);
const isNl = (r) => r.startsWith('/nl/');
// The single 404 page is shared by both languages (static hosts serve one 404.html).
const pages = routes.filter((r) => r !== '/404.html');
const en = pages.filter((r) => !isNl(r));
const nl = pages.filter(isNl);
const counterpart = (r) => (isNl(r) ? r.slice(3) : `/nl${r}`);
const text = (el) => el.textContent.replace(/\s+/g, ' ').trim();

describe('every English page has a Dutch counterpart and vice versa', () => {
  it('has Dutch pages at all', () => {
    expect(nl.length).toBeGreaterThan(10);
  });

  it('English -> /nl/', () => {
    expect(en.filter((r) => !routeSet.has(`/nl${r}`))).toEqual([]);
  });

  it('/nl/ -> English', () => {
    expect(nl.filter((r) => !routeSet.has(r.slice(3)))).toEqual([]);
  });

  it('covers the pages named in the brief', () => {
    const want = ['/nl/', '/nl/features/', '/nl/company/', '/nl/email/', '/nl/early-access/', '/nl/privacy/', '/nl/terms/', '/nl/cookies/'];
    for (const r of want) expect(routeSet.has(r), r).toBe(true);
    expect(nl.filter((r) => /^\/nl\/docs\/[^/]+\/$/.test(r))).toHaveLength(8);
  });
});

describe.each(pages)('%s', (route) => {
  const doc = loadPage(route);
  const lang = isNl(route) ? 'nl' : 'en';
  const enRoute = isNl(route) ? route.slice(3) : route;

  it(`sets <html lang="${lang}">`, () => {
    expect(doc.documentElement.getAttribute('lang')).toBe(lang);
  });

  it('has en, nl and x-default alternates pointing at built routes, x-default = English', () => {
    const alts = [...doc.querySelectorAll('link[rel="alternate"][hreflang]')];
    const map = Object.fromEntries(alts.map((l) => [l.getAttribute('hreflang'), l.getAttribute('href')]));
    expect(alts).toHaveLength(3);
    expect(map).toEqual({
      en: `${SITE}${enRoute}`,
      nl: `${SITE}/nl${enRoute}`,
      'x-default': `${SITE}${enRoute}`,
    });
    for (const href of Object.values(map)) expect(routeSet.has(href.slice(SITE.length)), href).toBe(true);
  });

  it('canonical points at its own locale URL', () => {
    expect(doc.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(`${SITE}${route}`);
  });

  it('header switch and footer switch link to both versions, current one marked', () => {
    const groups = [
      doc.querySelector('header.site-nav .navpanel .lang-switch'),
      doc.querySelector('footer .lang-switch'),
    ];
    for (const g of groups) {
      expect(g).toBeTruthy();
      const links = [...g.querySelectorAll('a')];
      expect(links.map((a) => a.getAttribute('hreflang'))).toEqual(['en', 'nl']);
      expect(links.map((a) => a.getAttribute('lang'))).toEqual(['en', 'nl']);
      const byLang = Object.fromEntries(links.map((a) => [a.getAttribute('hreflang'), a]));
      expect(byLang[lang].getAttribute('href')).toBe(route);
      expect(byLang[lang === 'en' ? 'nl' : 'en'].getAttribute('href')).toBe(counterpart(route));
      expect(byLang[lang].getAttribute('aria-current')).toBe('true');
      expect(byLang[lang === 'en' ? 'nl' : 'en'].hasAttribute('aria-current')).toBe(false);
    }
    expect(text(groups[1])).toContain('English');
    expect(text(groups[1])).toContain('Nederlands');
  });

  it('every internal link stays in its own language (except the language switch)', () => {
    const bad = [];
    for (const a of doc.querySelectorAll('a[href^="/"]')) {
      if (a.closest('.lang-switch')) continue;
      const href = a.getAttribute('href');
      if (isNl(route) !== href.startsWith('/nl/')) bad.push(href);
    }
    expect(bad).toEqual([]);
  });
});

describe('the 404 page', () => {
  const doc = loadPage('/404.html');
  it('links to both home pages', () => {
    const hrefs = [...doc.querySelectorAll('main a[href]')].map((a) => a.getAttribute('href'));
    expect(hrefs).toContain('/');
    expect(hrefs).toContain('/nl/');
  });
  it('marks its Dutch text with lang="nl"', () => {
    expect(doc.querySelector('main [lang="nl"]')).toBeTruthy();
  });
});

describe('Dutch copy', () => {
  it('no Dutch page has the English CTA', () => {
    const hits = nl.filter((r) => /Request early access|Request access/.test(loadPage(r).body.textContent));
    expect(hits).toEqual([]);
  });

  it('every Dutch page has the Dutch CTA in the nav, linking to /nl/early-access/', () => {
    for (const r of nl) {
      const nav = loadPage(r).querySelector('header.site-nav');
      const ctas = [...nav.querySelectorAll('a')].filter((a) => text(a) === 'Vraag vroege toegang aan');
      expect(ctas, r).toHaveLength(1);
      expect(ctas[0].getAttribute('href')).toBe('/nl/early-access/');
      // The CTA text is split in lead / rest / tail spans (the panel shows all three).
      expect(ctas[0].querySelector('.cta-rest')?.textContent.trim()).toBe('vroege toegang');
    }
  });

  it('Dutch home has the CTA in hero and closing section', () => {
    const doc = loadPage('/nl/');
    for (const s of ['hero', 'cta']) {
      const a = [...doc.querySelectorAll(`main > section[data-section="${s}"] a`)].filter((x) => text(x) === 'Vraag vroege toegang aan');
      expect(a, s).toHaveLength(1);
      expect(a[0].getAttribute('href')).toBe('/nl/early-access/');
    }
  });

  it('Dutch pages keep the same section structure as English', () => {
    for (const r of nl) {
      const names = (d) => [...d.querySelectorAll('main > section')].map((s) => s.getAttribute('data-section'));
      expect(names(loadPage(r)), r).toEqual(names(loadPage(r.slice(3))));
    }
  });

  it('Dutch pages use Dutch date formats', () => {
    const meta = loadPage('/nl/docs/build-your-first-website/').querySelector('.meta').textContent;
    expect(meta).toMatch(/11 november 2026/);
  });
});

describe('Dutch early access form', () => {
  const form = loadPage('/nl/early-access/').querySelector('main form');
  const label = (id) => text(form.querySelector(`label[for="${id}"]`));

  it('keeps the field names and has Dutch labels', () => {
    expect(form.getAttribute('method')).toBe('post');
    expect(form.hasAttribute('action')).toBe(false);
    const names = [...form.querySelectorAll('input, select, textarea')].map((f) => f.getAttribute('name'));
    expect(names).toEqual(['name', 'email', 'company', 'type', 'message']);
    expect(label(form.querySelector('[name=name]').id)).toBe('Naam');
    expect(label(form.querySelector('[name=email]').id)).toBe('E-mail');
    expect(label(form.querySelector('[name=company]').id)).toBe('Bedrijfsnaam (optioneel)');
    expect(label(form.querySelector('[name=type]').id)).toBe('Type');
    expect(label(form.querySelector('[name=message]').id)).toBe('Wat wil je bouwen?');
    expect([...form.querySelectorAll('select[name=type] option')].map(text)).toEqual(['Bedrijf', 'Bureau', 'Anders']);
    expect(text(form.querySelector('button[type=submit]'))).toBe('Aanvraag versturen');
    expect(form.querySelector('a[href="/nl/privacy/"]')).toBeTruthy();
  });
});

describe('Dutch email page keeps the corrected facts', () => {
  const t = text(loadPage('/nl/email/').querySelector('main'));
  it('unsubscribe opens a confirm page and needs no sign-in', () => {
    expect(t).toMatch(/bevestig/i);
    expect(t).toMatch(/hoeft niet in te loggen/);
  });
  it('double opt-in depends on the business', () => {
    expect(t).toMatch(/Als het bedrijf nieuwe inschrijvers vraagt om te bevestigen/);
  });
  it('still names the abuse placeholder', () => {
    expect(t).toContain('[ABUSE EMAIL]');
  });
});

describe('Dutch legal pages', () => {
  const PH = /^\[[A-Z]+(?:-[A-Z]+)*[\] :]/;
  it.each(['/nl/privacy/', '/nl/terms/', '/nl/cookies/'])('%s keeps the English ids and placeholder bodies', (r) => {
    const doc = loadPage(r);
    const secs = [...doc.querySelectorAll('main article section[id]')];
    const enSecs = [...loadPage(r.slice(3)).querySelectorAll('main article section[id]')];
    expect(secs.map((s) => s.id)).toEqual(enSecs.map((s) => s.id));
    for (const s of secs) {
      expect(text(s.querySelector('p')), s.id).toMatch(PH);
      expect(text(s.querySelector('h2'))).not.toBe(text(enSecs.find((e) => e.id === s.id).querySelector('h2')));
    }
  });
});

// Bold text in the Dutch docs must be the app's own Dutch label, verbatim.
const APP_NL = join(process.cwd(), '..', 'WebGeneratorV2', 'frontend', 'src', 'i18n', 'nl.json');
// Bold text that is not an app label: callout lead-ins, the help icon, and two list lead-ins
// in the import guide that are instructions, not buttons. Next-step card titles are checked
// separately against the linked article's title.
const NOT_UI = new Set([
  'Voordat je begint:',
  'Voor je begint:',
  // Verbatim excerpts of longer app strings (checkbox text, status sentence).
  'Ja, stuur mij vervolgmails',
  'Klaar: we hebben bevestigd dat dit domein van jou is.',
  'Tip:',
  'Let op:',
  '?',
  'Zet elk blok op het hoogste niveau in een section.',
  'Geef je formuliervelden de gebruikelijke namen.',
  'A-records',
  'Een TXT-record',
]);

function appValues() {
  const out = [];
  const walk = (o) => {
    for (const v of Object.values(o)) {
      if (v && typeof v === 'object') walk(v);
      else out.push(String(v));
    }
  };
  walk(JSON.parse(readFileSync(APP_NL, 'utf8')));
  return out;
}

describe.runIf(existsSync(APP_NL))('Dutch docs use the app labels from nl.json', () => {
  const values = appValues();
  const exact = new Set(values);
  // Values with {{n}} slots ("Record {{n}} van {{total}}") match any filled-in text.
  const templates = values
    .filter((v) => v.includes('{{'))
    .map((v) => new RegExp(`^${v.split(/\{\{[^}]+\}\}/).map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('.+')}$`));
  const isLabel = (s) => exact.has(s) || templates.some((re) => re.test(s));
  const slugs = nl.filter((r) => /^\/nl\/docs\/[^/]+\/$/.test(r));

  it.each(slugs)('%s', (r) => {
    const doc = loadPage(r);
    const bad = [];
    let checked = 0;
    for (const s of doc.querySelectorAll('article .prose strong')) {
      // The Markdown processor turns ' into a curly apostrophe; the app's labels use the straight one.
      const t = text(s).replace(/’/g, "'");
      const card = s.closest('a.next-card');
      if (card) {
        expect(t).toBe(text(loadPage(card.getAttribute('href')).querySelector('article h1')));
        continue;
      }
      if (NOT_UI.has(t)) continue;
      checked += 1;
      if (!isLabel(t)) bad.push(t);
    }
    expect(bad).toEqual([]);
    expect(checked).toBeGreaterThan(0);
  });
});

describe('Dutch docs', () => {
  it('screenshots keep their images, with Dutch alt text marked as the English UI', () => {
    for (const slug of ['a-tour-of-the-editor', 'build-your-first-website', 'forms-and-leads', 'send-a-campaign', 'set-up-your-sender']) {
      const nlImgs = [...loadPage(`/nl/docs/${slug}/`).querySelectorAll('article img')];
      const enImgs = [...loadPage(`/docs/${slug}/`).querySelectorAll('article img')];
      expect(nlImgs.map((i) => i.getAttribute('src'))).toEqual(enImgs.map((i) => i.getAttribute('src')));
      nlImgs.forEach((img, i) => {
        expect(img.getAttribute('alt')).not.toBe(enImgs[i].getAttribute('alt'));
        expect(img.getAttribute('alt')).toContain('(Engelse weergave)');
      });
    }
  });

  it('sidebar lists the 8 Dutch articles only', () => {
    const doc = loadPage('/nl/docs/build-your-first-website/');
    const hrefs = new Set([...doc.querySelectorAll('nav[aria-label] .side-full a')].map((a) => a.getAttribute('href')));
    expect(hrefs).toEqual(new Set(nl.filter((r) => /^\/nl\/docs\/[^/]+\/$/.test(r))));
  });

  it('/nl/docs/ is a Dutch landing page, not a redirect', () => {
    const doc = loadPage('/nl/docs/');
    expect(doc.querySelector('meta[http-equiv="refresh"]')).toBeNull();
    expect(doc.documentElement.getAttribute('lang')).toBe('nl');
    expect(doc.querySelector('a[href="/nl/docs/build-your-first-website/"]')).toBeTruthy();
  });
});

describe('search is per language', () => {
  it.each(pages.filter((r) => /^(\/nl)?\/docs\/[^/]+\/$/.test(r)))('%s tags its body with its language filter', (r) => {
    const doc = loadPage(r);
    const lang = doc.documentElement.getAttribute('lang');
    const body = doc.querySelector('[data-pagefind-body]');
    expect(body).toBeTruthy();
    expect(body.getAttribute('data-pagefind-filter')).toBe(`lang:${lang}`);
    expect(doc.querySelector('[data-docs-search]').getAttribute('data-lang')).toBe(lang);
  });

  it('pagefind builds one index per language, 8 pages each', () => {
    const entry = JSON.parse(readFileSync(join(DIST, 'pagefind', 'pagefind-entry.json'), 'utf8'));
    expect(Object.keys(entry.languages).sort()).toEqual(['en', 'nl']);
    expect(entry.languages.en.page_count).toBe(8);
    expect(entry.languages.nl.page_count).toBe(8);
  });
});

describe('sitemap and JSON-LD', () => {
  const xml = readFileSync(join(DIST, 'sitemap-0.xml'), 'utf8');
  it('lists Dutch pages with hreflang alternates', () => {
    expect(xml).toContain(`<loc>${SITE}/nl/</loc>`);
    expect(xml).toContain(`<loc>${SITE}/nl/docs/connect-your-domain/</loc>`);
    expect(xml).toMatch(/hreflang="nl" href="https:\/\/webgnr\.com\/nl\/features\/"/);
    expect(xml).toContain(`<loc>${SITE}/nl/docs/</loc>`);
  });

  it('both home pages carry the Organization block', () => {
    for (const r of ['/', '/nl/']) {
      const blocks = loadPage(r).querySelectorAll('script[type="application/ld+json"]');
      expect(blocks, r).toHaveLength(1);
      expect(JSON.parse(blocks[0].textContent)['@type']).toBe('Organization');
    }
  });
});

describe('section spacing', () => {
  it('no page ships a main > section rule scoped to a <main> that never gets the scope', () => {
    const bad = [];
    for (const r of routes) {
      const doc = loadPage(r);
      const css = [
        ...[...doc.querySelectorAll('link[rel="stylesheet"][href^="/"]')].map((l) => readFileSync(join(DIST, l.getAttribute('href')), 'utf8')),
        ...[...doc.querySelectorAll('style')].map((s) => s.textContent),
      ].join('\n');
      if (/main\[data-astro-cid-[\w-]+\]/.test(css)) bad.push(r);
    }
    expect(bad).toEqual([]);
  });
});
