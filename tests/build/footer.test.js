import { describe, it, expect } from 'vitest';
import { loadPage, allRoutes } from './helpers.js';

const FACTS = ['[LEGAL ENTITY NAME]', 'KvK [KVK NUMBER]', 'BTW [BTW NUMBER]', '[POSTAL ADDRESS]', '[PHONE]'];

describe.each(allRoutes())('%s footer', (route) => {
  const footer = loadPage(route).querySelector('footer.site-footer');

  it('shows the company facts in order, plus Made in the Netherlands', () => {
    const items = [...footer.querySelectorAll('.footer-facts > li')].map((li) => li.textContent.replace(/\s+/g, ' ').trim());
    expect(items).toEqual(FACTS);
    expect(footer.textContent).toContain('Made in the Netherlands');
  });
});
