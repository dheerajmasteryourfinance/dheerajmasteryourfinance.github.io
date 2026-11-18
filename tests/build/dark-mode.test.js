import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { loadPage, allRoutes } from './helpers.js';

const routes = allRoutes();
const css = () => {
  const dir = join(process.cwd(), 'dist', '_astro');
  return readdirSync(dir).filter((f) => f.endsWith('.css')).map((f) => readFileSync(join(dir, f), 'utf8')).join('\n').replace(/\s+/g, '');
};

describe.each(routes)('%s', (route) => {
  const doc = loadPage(route);
  const lang = route === '/404.html' ? 'en' : route.startsWith('/nl/') ? 'nl' : 'en';

  it('has one dark-mode toggle button with a label, in the header', () => {
    const b = doc.querySelectorAll('header.site-nav button[data-theme-toggle]');
    expect(b).toHaveLength(1);
    expect(b[0].getAttribute('type')).toBe('button');
    expect(b[0].getAttribute('aria-pressed')).toBe('false');
    expect(b[0].getAttribute('aria-label')).toBe(lang === 'nl' ? 'Donkere modus' : 'Dark mode');
  });

  it('applies a saved theme before first paint (inline script in <head>)', () => {
    const scripts = [...doc.querySelectorAll('head script')].map((s) => s.textContent);
    expect(scripts.some((t) => t.includes('localStorage') && t.includes('dataset.theme'))).toBe(true);
  });
});

describe('theme CSS', () => {
  const c = css();
  it('has a system-following dark block and an explicit data-theme block', () => {
    expect(c).toMatch(/@media\(prefers-color-scheme:dark\)\{:root:not\(\[data-theme=light\]\)\{[^}]*--white:#0b1426/i);
    expect(c).toMatch(/:root\[data-theme=dark\]\{[^}]*--white:#0b1426/i);
  });
  it('declares color-scheme so form controls and scrollbars follow', () => {
    expect(c).toMatch(/color-scheme:dark/);
    expect(c).toMatch(/color-scheme:light/);
  });
  it('keeps text on the aqua accent dark in both themes (a dedicated token)', () => {
    expect(c).toMatch(/--on-accent:#0f1e3d/i);
  });
});
