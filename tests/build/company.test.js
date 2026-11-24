import { describe, it, expect } from 'vitest';
import { loadPage } from './helpers.js';

const text = (el) => el.textContent.replace(/\s+/g, ' ').trim();

const L = {
  en: {
    route: '/company/', prefix: '', operated: 'Operated by', ids: 'KvK 99530856 · VAT NL869028662B01',
    send: 'Send message', phone: 'Phone', topics: 4, address: 'Steijnstraat 18, 2987 AS Ridderkerk',
  },
  nl: {
    route: '/nl/company/', prefix: '/nl', operated: 'Een product van', ids: 'KvK 99530856 · BTW NL869028662B01',
    send: 'Bericht versturen', phone: 'Telefoon', topics: 4, address: 'Steijnstraat 18, 2987 AS Ridderkerk',
  },
};

describe.each(Object.entries(L))('company page (%s)', (lang, c) => {
  const doc = loadPage(c.route);
  const contact = doc.querySelector('main > section#contact');

  it('has a contact section with id=contact', () => {
    expect(contact).toBeTruthy();
  });

  it('has a post form with no action and the required fields', () => {
    const form = contact.querySelector('form');
    expect(form.getAttribute('method').toLowerCase()).toBe('post');
    expect(form.hasAttribute('action')).toBe(false);
    expect(contact.querySelector('input[name=name][required][autocomplete=name]')).toBeTruthy();
    expect(contact.querySelector('input[type=email][name=email][required]')).toBeTruthy();
    expect(contact.querySelectorAll('select[name=topic] option')).toHaveLength(c.topics);
    expect(contact.querySelector('textarea[name=message][required]')).toBeTruthy();
  });

  it('labels every field', () => {
    const fields = contact.querySelectorAll('input, select, textarea');
    expect(fields.length).toBeGreaterThanOrEqual(4);
    for (const f of fields) {
      expect(f.id, f.outerHTML).toBeTruthy();
      expect(contact.querySelector(`label[for="${f.id}"]`), f.id).toBeTruthy();
    }
  });

  it('has a single submit button with the right label', () => {
    const buttons = contact.querySelectorAll('form button');
    expect(buttons).toHaveLength(1);
    expect(buttons[0].getAttribute('type')).toBe('submit');
    expect(text(buttons[0])).toBe(c.send);
  });

  it('links the consent note to the privacy page of this language', () => {
    expect(contact.querySelector(`form a[href="${c.prefix}/privacy/"]`)).toBeTruthy();
  });

  it('shows the real postal address and no placeholders', () => {
    expect(text(contact)).toContain(c.address);
    expect(contact.textContent).not.toMatch(/\[[A-Z]/);
  });

  it('the spam and abuse card links to the email page of this language', () => {
    const cards = [...contact.querySelectorAll('.card')].filter((x) => x.querySelector(`a[href="${c.prefix}/email/"]`));
    expect(cards).toHaveLength(1);
  });

  it('facts show the legal entity with KvK and the local tax label, and Ridderkerk', () => {
    const facts = [...doc.querySelectorAll('main dl.facts > div')];
    const op = facts.find((d) => text(d.querySelector('dt')) === c.operated);
    const t = text(op.querySelector('dd'));
    expect(t).toContain('Master Your Business');
    expect(t).toContain(c.ids);
    expect(text(doc.querySelector('main dl.facts'))).toContain('Ridderkerk');
  });

  it('shows the examples strip and the trust cards before the contact section', () => {
    const order = [...doc.querySelectorAll('main > section')].map((s) => s.getAttribute('data-section') || s.id);
    expect(order.indexOf('examples')).toBeGreaterThan(-1);
    expect(order.indexOf('trust')).toBeGreaterThan(-1);
    expect(order.indexOf('examples')).toBeLessThan(order.indexOf('contact'));
    expect(order.indexOf('trust')).toBeLessThan(order.indexOf('contact'));
    expect(doc.querySelectorAll('main > section[data-section="examples"] a.excard-strip')).toHaveLength(4);
    expect(doc.querySelectorAll('main > section[data-section="trust"] .tc-card')).toHaveLength(2);
  });
});
