// The app's editor lists pages as flat `name.html` (default language) or `lang/name.html`; any other
// folder is read as a language prefix, so folder-style pages (features/index.html) would be hidden.
// The ZIP therefore flattens them: features/index.html -> features.html, docs/x/index.html -> docs-x.html,
// and nl/docs/x/index.html -> nl/docs-x.html. Clean URLs keep working: /docs-x serves docs-x.html.

const SITE = 'https://webgnr.com';

/** New stored path for a built file. Anything that is not a folder-style page is returned unchanged. */
export function flatName(path) {
  if (!path.endsWith('/index.html')) return path;
  const parts = path.slice(0, -'/index.html'.length).split('/');
  const lang = parts[0] === 'nl' ? parts.shift() : null;
  if (parts.length === 0) return `${lang}/index.html`;
  const flat = `${parts.join('-')}.html`;
  return lang ? `${lang}/${flat}` : flat;
}

/** Old route ("/docs/x/") -> new clean URL ("/docs-x"), only for routes that actually change. */
export function buildRouteMap(paths) {
  const map = new Map();
  for (const p of paths) {
    if (!p.endsWith('/index.html')) continue;
    const to = flatName(p);
    if (to === p) continue;
    map.set(`/${p.slice(0, -'index.html'.length)}`, `/${to.slice(0, -'.html'.length)}`);
  }
  return map;
}

// A quoted (or tag-delimited) route, optionally on the site origin and with a #fragment or ?query.
const ROUTE = /(["'>])(https:\/\/webgnr\.com)?(\/[a-z0-9\-/]*\/)([#?][^"'<\s]*)?(?=["'<])/g;

/** Rewrite every route in html/json/xml text to its flat form. Unknown routes and prose are untouched. */
export function rewriteRoutes(text, map) {
  return text.replace(ROUTE, (m, pre, origin = '', route, rest = '') => {
    const to = map.get(route);
    return to ? `${pre}${origin}${to}${rest}` : m;
  });
}

export { SITE };
