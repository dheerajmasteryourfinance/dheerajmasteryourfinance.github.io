import { describe, it, expect } from 'vitest';
import { loadPage } from './helpers.js';

const doc = loadPage('/early-access/');
const sections = [...doc.querySelectorAll('main > section')];
const form = doc.querySelector('main form');

describe('early access page', () => {
  it('has the pitch, form and what-happens-next sections in order', () => {
    expect(sections.map((s) => s.getAttribute('data-section'))).toEqual(['pitch', 'form', 'next']);
    expect(doc.querySelectorAll('h1')).toHaveLength(1);
    expect(sections[0].textContent).toContain('WebGen is opening to a limited number of businesses');
  });

  it('lists three next steps: review, invite, build', () => {
    const steps = sections[2].querySelectorAll('ol > li');
    expect(steps).toHaveLength(3);
    const t = [...steps].map((s) => s.textContent.toLowerCase());
    expect(t[0]).toMatch(/review/);
    expect(t[1]).toMatch(/invite/);
    expect(t[2]).toMatch(/build/);
  });

  it('has one post form with no action, inside the form section', () => {
    expect(doc.querySelectorAll('main form')).toHaveLength(1);
    expect(sections[1].contains(form)).toBe(true);
    expect(form.getAttribute('method').toLowerCase()).toBe('post');
    expect(form.hasAttribute('action')).toBe(false);
  });

  it('has the fields the ZIP import recognises as a contact form', () => {
    expect(form.querySelector('input[name=name][required][autocomplete=name]')).toBeTruthy();
    expect(form.querySelector('input[type=email][name=email][required][autocomplete=email]')).toBeTruthy();
    const company = form.querySelector('input[name=company]');
    expect(company).toBeTruthy();
    expect(company.hasAttribute('required')).toBe(false);
    const opts = [...form.querySelectorAll('select[name=type] option')].map((o) => o.textContent.trim());
    expect(opts).toEqual(['Business', 'Agency', 'Other']);
    expect(form.querySelector('textarea[name=message][required]')).toBeTruthy();
    // Nothing that would make the import skip it as a login or a search box.
    expect(form.querySelector('[type=password], [type=search]')).toBeNull();
  });

  it('labels every field', () => {
    const fields = form.querySelectorAll('input, select, textarea');
    expect(fields).toHaveLength(5);
    for (const f of fields) {
      expect(f.id, f.outerHTML).toBeTruthy();
      expect(form.querySelector(`label[for="${f.id}"]`), f.id).toBeTruthy();
    }
    expect(form.querySelector('label[for="ea-message"]').textContent).toContain('What would you like to build?');
  });

  it('links the consent line to /privacy/ and submits with Request access', () => {
    expect(form.querySelector('a[href="/privacy/"]')).toBeTruthy();
    const b = form.querySelector('button[type=submit]');
    expect(b.textContent.trim()).toBe('Request access');
  });
});
