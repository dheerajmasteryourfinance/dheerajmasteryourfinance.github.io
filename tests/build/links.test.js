import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { loadPage, allRoutes } from './helpers.js';

const DIST = join(process.cwd(), 'dist');

function resolveTarget(pageRoute, href) {
  const base = new URL(pageRoute, 'https://website-generator.nl');
  const url = new URL(href, base);
  if (url.host !== 'website-generator.nl') return null; // external
  return url;
}

function routeFile(pathname) {
  if (pathname.endsWith('/')) return join(DIST, pathname, 'index.html');
  return join(DIST, pathname);
}

describe('internal links resolve', () => {
  for (const route of allRoutes()) {
    it(`${route}`, () => {
      const doc = loadPage(route);
      const problems = [];
      for (const a of doc.querySelectorAll('a[href]')) {
        const href = a.getAttribute('href');
        if (/^(mailto:|tel:|javascript:)/i.test(href)) continue;
        const url = resolveTarget(route, href);
        if (!url) continue;
        const key = `${url.pathname}${url.hash}`;
        const label = `${href} -> ${key}`;
        if (!existsSync(routeFile(url.pathname))) {
          problems.push(`${label}: no built route`);
          continue;
        }
        const id = decodeURIComponent(url.hash.slice(1));
        if (id) {
          const target = url.pathname === route ? doc : loadPage(url.pathname);
          if (!target.getElementById(id) && !target.querySelector(`[name="${globalThis.CSS?.escape ? globalThis.CSS.escape(id) : id}"]`)) {
            problems.push(`${label}: no element with id "${id}"`);
          }
        }
      }
      expect(problems).toEqual([]);
    });
  }
});
