// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { initTocSpy } from '../../src/scripts/toc-spy.ts';

function page(tops) {
  document.body.innerHTML = `
    <nav class="toc"><ul>
      <li><a href="#a">A</a></li><li><a href="#b">B</a></li><li><a href="#c">C</a></li>
    </ul></nav>
    <main><h2 id="a">A</h2><h2 id="b">B</h2><h2 id="c">C</h2></main>`;
  const heads = [...document.querySelectorAll('main h2')];
  heads.forEach((h, i) => { h.getBoundingClientRect = () => ({ top: tops[i], bottom: tops[i] + 30, height: 30 }); });
  Object.defineProperty(window, 'innerHeight', { value: 1000, configurable: true });
}
const current = () => [...document.querySelectorAll('.toc a')].filter((a) => a.getAttribute('aria-current') === 'true').map((a) => a.textContent);
const frame = () => new Promise((r) => requestAnimationFrame(() => r()));

describe('toc spy', () => {
  beforeEach(() => { vi.restoreAllMocks(); });

  it('marks the last heading above the 30% line', () => {
    page([-400, 200, 900]); // 30% of 1000 = 300: a and b are above, c is below
    const stop = initTocSpy(document);
    expect(current()).toEqual(['B']);
    stop();
  });

  it('marks the first link when every heading is still below the line', () => {
    page([500, 900, 1400]);
    const stop = initTocSpy(document);
    expect(current()).toEqual(['A']);
    stop();
  });

  it('follows the scroll position', async () => {
    page([-400, 200, 900]);
    const stop = initTocSpy(document);
    document.querySelectorAll('main h2')[2].getBoundingClientRect = () => ({ top: 100, bottom: 130, height: 30 });
    window.dispatchEvent(new Event('scroll'));
    await frame();
    expect(current()).toEqual(['C']);
    stop();
  });

  it('cleanup removes the listener', async () => {
    page([-400, 200, 900]);
    const stop = initTocSpy(document);
    stop();
    document.querySelectorAll('main h2')[2].getBoundingClientRect = () => ({ top: 100, bottom: 130, height: 30 });
    window.dispatchEvent(new Event('scroll'));
    await frame();
    expect(current()).toEqual(['B']);
  });

  it('is a no-op without a .toc', () => {
    document.body.innerHTML = '<main><h2 id="a">A</h2></main>';
    const stop = initTocSpy(document);
    expect(typeof stop).toBe('function');
    expect(() => stop()).not.toThrow();
  });
});
