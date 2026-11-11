import { describe, it, expect } from 'vitest';
import { loadPage, allRoutes } from './helpers.js';

const EMAIL = /[\w.+-]+@[\w-]+\.[\w.-]+/;

describe.each(allRoutes())('%s has no email-shaped strings', (route) => {
  const doc = loadPage(route);

  it('in text', () => {
    expect(doc.body.textContent).not.toMatch(EMAIL);
  });

  it('in attribute values', () => {
    for (const el of doc.querySelectorAll('*')) {
      for (const a of el.attributes) expect(a.value, `${el.tagName} ${a.name}`).not.toMatch(EMAIL);
    }
  });
});
