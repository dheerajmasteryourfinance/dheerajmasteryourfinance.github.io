// Helpers for the ZIP that is imported into the WebGen app.
// The app's importer rewrites root-absolute href/src to page-relative paths (so the site works at any
// base URL) but not srcset / imagesrcset, which is where Astro's responsive images live. This module
// rewrites those the same way, using the importer's own idea of where a page is published.
import { posix } from 'node:path';

/** Clean-URL form of a stored path: no .html, no trailing index (mirrors site_paths.canonicalize_path). */
function canonicalize(raw) {
  let rel = raw.replace(/\/+$/, '');
  if (rel.endsWith('.html')) rel = rel.slice(0, -'.html'.length);
  if (rel === 'index' || rel.endsWith('/index')) rel = rel.slice(0, -'index'.length).replace(/\/+$/, '');
  return rel;
}

/** Directory a stored page is published under: nl/docs/x/index.html is served at /nl/docs/x, so its base is nl/docs. */
export function publishedDir(filePath) {
  const d = posix.dirname(canonicalize(filePath));
  return d === '.' ? '' : d;
}

/** Root-absolute URL -> relative to baseDir. Everything else is returned unchanged. */
export function relativize(url, baseDir) {
  if (!url.startsWith('/') || url.startsWith('//')) return url;
  let path = url;
  let rest = '';
  for (const sep of ['#', '?']) {
    const i = path.indexOf(sep);
    if (i >= 0) {
      rest = path.slice(i) + rest;
      path = path.slice(0, i);
    }
  }
  const rel = posix.relative(baseDir || '.', path.replace(/^\/+/, '') || '.');
  return rel + rest;
}

const ATTR = /(\s(?:srcset|imagesrcset)=")([^"]*)(")/g;

/** Rewrite every candidate URL inside srcset="..." and imagesrcset="..." attributes of an HTML string. */
export function relativizeSrcsets(html, baseDir) {
  // Only inside tags, so prose that merely mentions srcset is left alone.
  return html.replace(/<[a-zA-Z][^>]*>/g, (tag) =>
    tag.replace(ATTR, (_m, open, value, close) => {
      const list = value
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean)
        .map((c) => {
          const [url, ...desc] = c.split(/\s+/);
          return [relativize(url, baseDir), ...desc].join(' ');
        })
        .join(', ');
      return open + list + close;
    }),
  );
}
