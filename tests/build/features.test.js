import { describe, it, expect } from 'vitest';
import { loadPage } from './helpers.js';

const doc = loadPage('/features/');
const IDS = ['build', 'leads', 'email', 'search', 'domains'];

describe('features page', () => {
  it('has sections with the five feature ids', () => {
    for (const id of IDS) {
      const s = doc.querySelector(`main > section#${id}`);
      expect(s, id).toBeTruthy();
    }
  });

  it('has an in-page chip nav linking to each section', () => {
    const nav = doc.querySelector('main nav[aria-label="Feature sections"]');
    expect(nav).toBeTruthy();
    const hrefs = [...nav.querySelectorAll('a')].map((a) => a.getAttribute('href'));
    expect(hrefs).toEqual(IDS.map((i) => `#${i}`));
  });

  it('has a closing CTA with Build my site and Read the guides', () => {
    const cta = doc.querySelector('main > section[data-section="cta"]');
    expect(cta).toBeTruthy();
    const links = [...cta.querySelectorAll('a')];
    expect(links.find((a) => a.textContent.trim() === 'Build my site')).toBeTruthy();
    const guides = links.find((a) => a.textContent.trim() === 'Read the guides');
    expect(guides.getAttribute('href')).toBe('/docs/');
  });

  it('mentions no pricing', () => {
    expect(doc.body.textContent).not.toMatch(/pricing|price/i);
  });
});
