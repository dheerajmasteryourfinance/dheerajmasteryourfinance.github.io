import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { loadPage, allRoutes } from './helpers.js';

const DIST = join(process.cwd(), 'dist');

// Known placeholder: the "See an example" CTA on Home points at #example, which
// has no matching id yet. Allowed here on purpose so the launch step still has
// to resolve it; any other unresolved href fails.
const ALLOWED_UNRESOLVED = new Set(['/#example']);

function resolveTarget(pageRoute, href) {
  const base = new URL(pageRoute, 'https://webgnr.com');
  const url = new URL(href, base);
  if (url.host !== 'webgnr.com') return null; // external
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
        if (ALLOWED_UNRESOLVED.has(key)) continue;
        if (!existsSync(routeFile(url.pathname))) {
          problems.push(`${label}: no built route`);
          continue;
        }
        const id = decodeURIComponent(url.hash.slice(1));
        if (id) {
          const target = url.pathname === route ? doc : loadPage(url.pathname);
          if (!target.getElementById(id) && !target.querySelector(`[name="${CSS.escape ? CSS.escape(id) : id}"]`)) {
            problems.push(`${label}: no element with id "${id}"`);
          }
        }
      }
      expect(problems).toEqual([]);
    });
  }
});
