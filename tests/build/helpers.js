import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { parseHTML } from 'linkedom';

const DIST = join(process.cwd(), 'dist');

/** Parse dist{route}index.html, e.g. loadPage('/') or loadPage('/features/'). */
export function loadPage(route) {
  const file = route.endsWith('.html') ? join(DIST, route) : join(DIST, route, 'index.html');
  return parseHTML(readFileSync(file, 'utf8')).document;
}

/** Every route (with leading and trailing slash) that has an index.html under dist, plus /404.html. */
export function allRoutes() {
  if (!existsSync(DIST)) return [];
  const routes = [];
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const p = join(dir, name);
      if (statSync(p).isDirectory()) walk(p);
      else if (name === 'index.html') {
        const rel = relative(DIST, dir).split(sep).join('/');
        routes.push(rel ? `/${rel}/` : '/');
      }
    }
  };
  walk(DIST);
  if (existsSync(join(DIST, '404.html'))) routes.push('/404.html');
  return routes.sort();
}
