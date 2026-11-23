import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { loadPage } from './helpers.js';

describe('/email/', () => {
  const doc = loadPage('/email/');

  it('has the sections in order', () => {
    const names = [...doc.querySelectorAll('main > section')].map((s) => s.getAttribute('data-section'));
    expect(names).toEqual(['quick', 'who', 'why', 'rules', 'spam', 'help']);
  });

  it('rules has 4 cards', () => {
    expect(doc.querySelectorAll('main > section[data-section="rules"] .card')).toHaveLength(4);
  });

  it('sends spam reports through the contact form', () => {
    expect(doc.querySelector('main a[href="/company/#contact"]')).toBeTruthy();
    expect(doc.querySelector('main').textContent).toContain('An email I received');
  });

  it('has no form and no email input', () => {
    expect(doc.querySelectorAll('main form')).toHaveLength(0);
    expect(doc.querySelectorAll('input[type=email]')).toHaveLength(0);
  });
});

const LEGAL = [
  { route: '/privacy/', title: 'Privacy policy', count: 8, ids: ['who', 'collect', 'why', 'recipients', 'sharing', 'retention', 'rights', 'changes'], titles: ['Who we are', 'What we collect', 'Why we use it', 'Data about email recipients', 'Who we share it with', 'How long we keep it', 'Your rights', 'Changes to this policy'] },
  { route: '/terms/', title: 'Terms of service', count: 8, ids: ['account', 'acceptable', 'content', 'billing', 'availability', 'liability', 'ending', 'law'], titles: ['Your account', 'Acceptable use and email rules', 'Your content', 'Billing and cancellation', 'Service availability', 'Liability', 'Ending the agreement', 'Governing law'] },
  { route: '/cookies/', title: 'Cookie policy', count: 4, ids: ['what', 'essential', 'analytics', 'choices'], titles: ['What cookies are', 'Essential cookies', 'Analytics cookies', 'Changing your choices'] },
];

describe.each(LEGAL)('legal $route', ({ route, title, count, ids, titles }) => {
  const doc = loadPage(route);

  it('h1 equals the title', () => {
    expect(doc.querySelector('h1').textContent.trim()).toBe(title);
  });

  it('has the right number of section headings with the canvas titles', () => {
    const secs = [...doc.querySelectorAll('main article section[id]')];
    expect(secs).toHaveLength(count);
    expect(secs.map((s) => s.getAttribute('id'))).toEqual(ids);
    expect(secs.map((s) => s.querySelector('h2').textContent.trim())).toEqual(titles);
  });

  it('On this page links match the section ids', () => {
    const nav = doc.querySelector('main nav[aria-label="On this page"]');
    expect(nav).toBeTruthy();
    expect([...nav.querySelectorAll('li a')].map((a) => a.getAttribute('href'))).toEqual(ids.map((i) => `#${i}`));
  });

  it('shows the draft notice', () => {
    expect(doc.querySelector('main').textContent).toMatch(/Draft:/);
  });

  it('links to the other two legal pages and marks itself current', () => {
    const nav = doc.querySelector('main nav[aria-label="Legal documents"]');
    const hrefs = [...nav.querySelectorAll('a')].map((a) => a.getAttribute('href'));
    expect(hrefs).toEqual(['/privacy/', '/terms/', '/cookies/']);
    const current = nav.querySelectorAll('a[aria-current="page"]');
    expect(current).toHaveLength(1);
    expect(current[0].getAttribute('href')).toBe(route);
  });
});

describe('Dutch email page', () => {
  const doc = loadPage('/nl/email/');
  const text = (el) => el.textContent.replace(/\s+/g, ' ').trim();

  it('has the same six sections and four rule cards, no form', () => {
    const names = [...doc.querySelectorAll('main > section')].map((s) => s.getAttribute('data-section'));
    expect(names).toEqual(['quick', 'who', 'why', 'rules', 'spam', 'help']);
    expect(doc.querySelectorAll('main > section[data-section="rules"] .card')).toHaveLength(4);
    expect(doc.querySelectorAll('main form')).toHaveLength(0);
  });

  it('links help to the Dutch contact section and has no placeholders', () => {
    expect(doc.querySelector('main').textContent).not.toMatch(/\[[A-Z]/);
    expect(doc.querySelector('main a[href="/nl/company/#contact"]')).toBeTruthy();
    expect(text(doc.querySelector('h1'))).toContain('WebGen');
  });
});

describe.each(['/privacy/', '/nl/privacy/', '/terms/', '/nl/terms/', '/cookies/', '/nl/cookies/', '/email/', '/nl/email/'])('motion on %s', (route) => {
  const doc = loadPage(route);

  it('has blobs inside a header section that is positioned (so they stay inside it)', () => {
    const head = doc.querySelector('main > section:first-child');
    expect(head.querySelector('.blob')).toBeTruthy();
    expect(head.classList.contains('has-blobs')).toBe(true);
  });
});

describe.each(['/privacy/', '/nl/privacy/'])('legal sections list on %s', (route) => {
  it('is sticky in the built CSS', () => {
    const doc = loadPage(route);
    expect(doc.querySelector('main nav.toc')).toBeTruthy();
    const dir = join(process.cwd(), 'dist', '_astro');
    const css = readdirSync(dir).filter((f) => f.endsWith('.css')).map((f) => readFileSync(join(dir, f), 'utf8')).join('\n').replace(/\s+/g, '');
    expect(css).toMatch(/\.toc\[[^\]]+\]\{[^}]*position:sticky|\.toc\{[^}]*position:sticky/);
  });
});
