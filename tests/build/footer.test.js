import { describe, it, expect } from 'vitest';
import { loadPage, allRoutes } from './helpers.js';

const FACTS = ['[LEGAL ENTITY NAME]', 'KvK [KVK NUMBER]', 'BTW [BTW NUMBER]', '[POSTAL ADDRESS]', '[PHONE]', '[SUPPORT EMAIL]'];
const MADE_IN = { en: 'Made in the Netherlands', nl: 'Gemaakt in Nederland' };

describe.each(allRoutes())('%s footer', (route) => {
  const footer = loadPage(route).querySelector('footer.site-footer');

  it('shows the company facts in order (support email last), plus Made in the Netherlands in the page language', () => {
    const items = [...footer.querySelectorAll('.footer-facts > li')].map((li) => li.textContent.replace(/\s+/g, ' ').trim());
    expect(items).toEqual(FACTS);
    expect(footer.querySelector('.footer-made').textContent.trim()).toBe(MADE_IN[route.startsWith('/nl/') ? 'nl' : 'en']);
  });
});
