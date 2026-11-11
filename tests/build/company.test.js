import { describe, it, expect } from 'vitest';
import { loadPage } from './helpers.js';

const doc = loadPage('/company/');
const contact = doc.querySelector('main > section#contact');

describe('company page', () => {
  it('has a contact section with id=contact', () => {
    expect(contact).toBeTruthy();
  });

  it('has a post form with no action', () => {
    const form = contact.querySelector('form');
    expect(form.getAttribute('method').toLowerCase()).toBe('post');
    expect(form.hasAttribute('action')).toBe(false);
  });

  it('has the required fields', () => {
    expect(contact.querySelector('input[name=name][required][autocomplete=name]')).toBeTruthy();
    expect(contact.querySelector('input[type=email][name=email][required]')).toBeTruthy();
    expect(contact.querySelectorAll('select[name=topic] option')).toHaveLength(4);
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

  it('has a Send message submit button', () => {
    const b = contact.querySelector('button[type=submit]');
    expect(b.textContent.trim()).toBe('Send message');
  });

  it('links the consent note to /privacy/', () => {
    expect(contact.querySelector('form a[href="/privacy/"]')).toBeTruthy();
  });

  it('shows the contact placeholders', () => {
    const t = contact.textContent;
    for (const p of ['[SUPPORT EMAIL]', '[ABUSE EMAIL]', '[POSTAL ADDRESS]']) expect(t).toContain(p);
  });

  it('abuse card links to /email/', () => {
    const cards = [...contact.querySelectorAll('.card')].filter((c) => c.textContent.includes('[ABUSE EMAIL]'));
    expect(cards.length).toBeGreaterThan(0);
    expect(cards[0].querySelector('a[href="/email/"]')).toBeTruthy();
  });
});
