// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { initExampleFilter } from '../../src/scripts/example-filter.ts';

function page() {
  document.body.innerHTML = `
    <button data-filter-trade="all" aria-pressed="true">All</button>
    <button data-filter-trade="bakery" aria-pressed="false">Bakeries</button>
    <button data-filter-trade="local" aria-pressed="false">Local</button>
    <button data-filter-lang="all" aria-pressed="true">All</button>
    <button data-filter-lang="nl" aria-pressed="false">Nederlands</button>
    <button data-filter-lang="fr" aria-pressed="false">Francais</button>
    <div class="example-grid">
      <div id="gl" data-trade="bakery" data-langs="nl fr de"></div>
      <div id="tea" data-trade="local" data-langs="nl en"></div>
      <div id="garden" data-trade="local" data-langs="nl"></div>
      <div id="heat" data-trade="local" data-langs="nl"></div>
      <div id="physio" data-trade="local" data-langs="nl"></div>
      <div id="more"></div>
    </div>`;
  initExampleFilter(document);
}
const click = (sel) => document.querySelector(sel).click();
const hidden = () => [...document.querySelectorAll('.example-grid > *')].filter((e) => e.hidden).map((e) => e.id);

describe('example filter', () => {
  beforeEach(page);

  it('starts with everything visible', () => {
    expect(hidden()).toEqual([]);
  });

  it('choosing Local services hides GreenLeaf', () => {
    click('[data-filter-trade="local"]');
    expect(hidden()).toEqual(['gl']);
    expect(document.querySelector('[data-filter-trade="local"]').getAttribute('aria-pressed')).toBe('true');
    expect(document.querySelector('[data-filter-trade="all"]').getAttribute('aria-pressed')).toBe('false');
  });

  it('choosing French hides the four Dutch-only cards', () => {
    click('[data-filter-lang="fr"]');
    expect(hidden().sort()).toEqual(['garden', 'heat', 'physio', 'tea']);
  });

  it('combines trade and language, and All restores everything', () => {
    click('[data-filter-trade="local"]');
    click('[data-filter-lang="fr"]');
    expect(hidden().sort()).toEqual(['garden', 'gl', 'heat', 'physio', 'tea']);
    click('[data-filter-trade="all"]');
    click('[data-filter-lang="all"]');
    expect(hidden()).toEqual([]);
  });

  it('keeps the slot without data attributes visible whatever the filter', () => {
    click('[data-filter-trade="bakery"]');
    expect(document.getElementById('more').hidden).toBe(false);
  });
});
