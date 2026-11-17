// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { initReveal } from '../../src/scripts/reveal.ts';

let observers;
class FakeObserver {
  constructor(cb, opts) { this.cb = cb; this.opts = opts; this.targets = new Set(); observers.push(this); }
  observe(el) { this.targets.add(el); }
  unobserve(el) { this.targets.delete(el); }
  disconnect() { this.targets.clear(); }
  fire(el) { this.cb([{ target: el, isIntersecting: true }], this); }
}

const setup = ({ timeline = false, reduced = false } = {}) => {
  document.documentElement.className = '';
  document.body.innerHTML = '<section class="rv">a</section><div class="lift">b</div><p>c</p>';
  observers = [];
  globalThis.IntersectionObserver = FakeObserver;
  globalThis.CSS = { supports: vi.fn(() => timeline) };
  window.matchMedia = vi.fn(() => ({ matches: reduced }));
};

describe('initReveal', () => {
  beforeEach(() => setup());

  it('without scroll-timeline: hides targets behind js-reveal and reveals them once in view', () => {
    initReveal(document);
    expect(document.documentElement.classList.contains('js-reveal')).toBe(true);
    const [obs] = observers;
    expect(obs.targets.size).toBe(2);
    const rv = document.querySelector('.rv');
    obs.fire(rv);
    expect(rv.classList.contains('is-visible')).toBe(true);
    expect(obs.targets.has(rv)).toBe(false);
  });

  it('with reduced motion: hides nothing and creates no observer', () => {
    setup({ reduced: true });
    initReveal(document);
    expect(document.documentElement.classList.contains('js-reveal')).toBe(false);
    expect(observers).toHaveLength(0);
  });

  it('with scroll-driven animation support: leaves the page to CSS', () => {
    setup({ timeline: true });
    initReveal(document);
    expect(document.documentElement.classList.contains('js-reveal')).toBe(false);
    expect(observers).toHaveLength(0);
  });

  it('cleanup disconnects the observer', () => {
    const stop = initReveal(document);
    stop();
    expect(observers[0].targets.size).toBe(0);
  });
});
