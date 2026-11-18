import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { loadPage } from './helpers.js';

const css = () => {
  const dir = join(process.cwd(), 'dist', '_astro');
  const files = readdirSync(dir).filter((f) => f.endsWith('.css')).map((f) => readFileSync(join(dir, f), 'utf8'));
  // Astro inlines small component CSS into the page itself.
  const inline = [...loadPage('/404.html').querySelectorAll('style')].map((st) => st.textContent);
  return [...files, ...inline].join('\n').replace(/\s+/g, '');
};

describe('404 page', () => {
  const doc = loadPage('/404.html');

  it('has the numeral element with class big404', () => {
    const big = doc.querySelector('main .big404');
    expect(big).toBeTruthy();
    expect(big.textContent.trim()).toBe('404');
  });

  it('the numeral scales with the viewport under 640px so it never overflows a phone', () => {
    expect(css()).toMatch(/@media\((?:max-width:640px|width<=640px)\)\{[^@]*\.big404[^{}]*\{[^}]*font-size:[^;}]*vw/);
  });

  it('still offers the way home and to the docs, and is not indexed', () => {
    const hrefs = [...doc.querySelectorAll('main a')].map((a) => a.getAttribute('href'));
    expect(hrefs).toContain('/');
    expect(hrefs).toContain('/docs/');
    expect(doc.querySelector('meta[name="robots"]').getAttribute('content')).toBe('noindex');
  });
});
