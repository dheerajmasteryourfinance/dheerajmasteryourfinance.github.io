import { describe, it, expect } from 'vitest';
import { loadPage } from './helpers.js';

const text = (el) => el.textContent.replace(/\s+/g, ' ').trim();

const L = {
  en: {
    route: '/early-access/',
    prefix: '',
    lede: 'We are opening WebGen to a limited number of businesses',
    steps: [/read/i, /invitation/i, /build/i],
    labels: { name: 'Name', email: 'Email', company: 'Business name (optional)', type: 'Type', message: 'What would you like to build?' },
    types: ['Business', 'Agency', 'Other'],
    submit: 'Request access',
    faq: ['Does WebGen work in Dutch?', 'Where is my data stored?'],
  },
  nl: {
    route: '/nl/early-access/',
    prefix: '/nl',
    lede: 'We openen WebGen voor een beperkt aantal bedrijven',
    steps: [/lezen/i, /uitnodiging/i, /bouwt/i],
    labels: { name: 'Naam', email: 'E-mail', company: 'Bedrijfsnaam (optioneel)', type: 'Type', message: 'Wat wil je bouwen?' },
    types: ['Bedrijf', 'Bureau', 'Anders'],
    submit: 'Aanvraag versturen',
    faq: ['Werkt WebGen in het Nederlands?', 'Waar worden mijn gegevens opgeslagen?'],
  },
};

describe.each(Object.entries(L))('early access page (%s)', (lang, c) => {
  const doc = loadPage(c.route);
  const sections = [...doc.querySelectorAll('main > section')];
  const sec = (n) => sections.find((s) => s.getAttribute('data-section') === n);
  const form = doc.querySelector('main form');

  it('has the sections in order', () => {
    expect(sections.map((s) => s.getAttribute('data-section'))).toEqual(['pitch', 'form', 'marquee', 'examples', 'next', 'trust', 'faq']);
    expect(doc.querySelectorAll('h1')).toHaveLength(1);
    expect(text(sec('pitch'))).toContain(c.lede);
  });

  it('lists three next steps: read, invitation, build', () => {
    const steps = [...sec('next').querySelectorAll('ol > li')].map((s) => text(s));
    expect(steps).toHaveLength(3);
    c.steps.forEach((re, i) => expect(steps[i]).toMatch(re));
  });

  it('has one post form with no action, inside the form section', () => {
    expect(doc.querySelectorAll('main form')).toHaveLength(1);
    expect(sec('form').contains(form)).toBe(true);
    expect(form.getAttribute('method').toLowerCase()).toBe('post');
    expect(form.hasAttribute('action')).toBe(false);
  });

  it('has the fields the ZIP import recognises, with the right requirements', () => {
    expect(form.querySelector('input[name=name][required][autocomplete=name]')).toBeTruthy();
    expect(form.querySelector('input[type=email][name=email][required][autocomplete=email]')).toBeTruthy();
    const company = form.querySelector('input[name=company]');
    expect(company.hasAttribute('required')).toBe(false);
    expect([...form.querySelectorAll('select[name=type] option')].map(text)).toEqual(c.types);
    expect(form.querySelector('textarea[name=message][required]')).toBeTruthy();
    expect(form.querySelector('[type=password], [type=search]')).toBeNull();
  });

  it('labels every field in the page language', () => {
    const fields = [...form.querySelectorAll('input, select, textarea')];
    expect(fields.map((f) => f.getAttribute('name'))).toEqual(['name', 'email', 'company', 'type', 'message']);
    for (const f of fields) {
      expect(f.id, f.outerHTML).toBeTruthy();
      expect(text(form.querySelector(`label[for="${f.id}"]`)), f.id).toBe(c.labels[f.getAttribute('name')]);
    }
  });

  it('has exactly one submit button (a double click cannot send two forms from two buttons)', () => {
    const buttons = form.querySelectorAll('button');
    expect(buttons).toHaveLength(1);
    expect(buttons[0].getAttribute('type')).toBe('submit');
    expect(text(buttons[0])).toBe(c.submit);
  });

  it('links the consent line to the privacy page of this language', () => {
    expect(form.querySelector(`a[href="${c.prefix}/privacy/"]`)).toBeTruthy();
  });

  it('shows the four test example sites and the three trust cards', () => {
    expect(sec('examples').querySelectorAll('a.excard-strip')).toHaveLength(4);
    expect(sec('trust').querySelectorAll('.tc-card')).toHaveLength(3);
  });

  it('faq has 5 questions, including the Dutch and the data-location ones', () => {
    const qs = [...sec('faq').querySelectorAll('details > summary')].map(text);
    expect(qs).toHaveLength(5);
    for (const q of c.faq) expect(qs).toContain(q);
  });
});
