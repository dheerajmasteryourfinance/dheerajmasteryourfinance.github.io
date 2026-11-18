// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { currentTheme, initThemeToggle } from '../../src/scripts/theme.ts';

const setSystem = (dark) => {
  window.matchMedia = (q) => ({ matches: q.includes('dark') ? dark : false, addEventListener() {}, removeEventListener() {} });
};
const page = () => {
  document.documentElement.removeAttribute('data-theme');
  document.body.innerHTML = '<button type="button" data-theme-toggle aria-pressed="false">Dark mode</button>';
};
const btn = () => document.querySelector('[data-theme-toggle]');

describe('theme toggle', () => {
  beforeEach(() => { localStorage.clear(); page(); });

  it('follows the system when nothing was chosen', () => {
    setSystem(true);
    expect(currentTheme(document)).toBe('dark');
    setSystem(false);
    expect(currentTheme(document)).toBe('light');
  });

  it('an explicit data-theme wins over the system', () => {
    setSystem(true);
    document.documentElement.dataset.theme = 'light';
    expect(currentTheme(document)).toBe('light');
  });

  it('shows the pressed state on load', () => {
    setSystem(true);
    initThemeToggle(document);
    expect(btn().getAttribute('aria-pressed')).toBe('true');
  });

  it('click switches theme, remembers it and updates the button', () => {
    setSystem(false);
    initThemeToggle(document);
    btn().click();
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
    expect(btn().getAttribute('aria-pressed')).toBe('true');
    btn().click();
    expect(document.documentElement.dataset.theme).toBe('light');
    expect(localStorage.getItem('theme')).toBe('light');
    expect(btn().getAttribute('aria-pressed')).toBe('false');
  });

  it('still switches when storage is blocked', () => {
    setSystem(false);
    const orig = Storage.prototype.setItem;
    Storage.prototype.setItem = () => { throw new Error('blocked'); };
    try {
      initThemeToggle(document);
      expect(() => btn().click()).not.toThrow();
      expect(document.documentElement.dataset.theme).toBe('dark');
    } finally { Storage.prototype.setItem = orig; }
  });

  it('cleanup removes the click handler', () => {
    setSystem(false);
    const stop = initThemeToggle(document);
    stop();
    btn().click();
    expect(document.documentElement.dataset.theme).toBeUndefined();
  });
});
