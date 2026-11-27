import { describe, it, expect } from 'vitest';
import { flatName, buildRouteMap, rewriteRoutes } from '../../scripts/flatten-pages.mjs';

// The app's editor lists pages as flat `name.html` (default language) or `lang/name.html`; any other folder
// is read as a language prefix and hidden. So the package flattens folder-style pages.

describe('flatName', () => {
  it('flattens default-language folder pages into one root file', () => {
    expect(flatName('index.html')).toBe('index.html');
    expect(flatName('404.html')).toBe('404.html');
    expect(flatName('features/index.html')).toBe('features.html');
    expect(flatName('docs/index.html')).toBe('docs.html');
    expect(flatName('docs/forms-and-leads/index.html')).toBe('docs-forms-and-leads.html');
  });
  it('keeps Dutch pages one level under nl/', () => {
    expect(flatName('nl/index.html')).toBe('nl/index.html');
    expect(flatName('nl/features/index.html')).toBe('nl/features.html');
    expect(flatName('nl/docs/forms-and-leads/index.html')).toBe('nl/docs-forms-and-leads.html');
  });
  it('leaves non-pages alone', () => {
    expect(flatName('_astro/a.webp')).toBe('_astro/a.webp');
    expect(flatName('search-index-en.json')).toBe('search-index-en.json');
  });
});

describe('rewriteRoutes', () => {
  const map = buildRouteMap([
    'index.html', 'features/index.html', 'docs/index.html', 'docs/forms-and-leads/index.html',
    'nl/index.html', 'nl/docs/index.html', 'nl/docs/forms-and-leads/index.html', '404.html',
  ]);
  it('maps routes to clean flat URLs', () => {
    expect(map.get('/docs/forms-and-leads/')).toBe('/docs-forms-and-leads');
    expect(map.get('/nl/docs/')).toBe('/nl/docs');
    expect(map.get('/')).toBeUndefined();
    expect(map.get('/nl/')).toBeUndefined();
  });
  it('rewrites hrefs, fragments, absolute site URLs and JSON strings', () => {
    const src = [
      '<a href="/docs/forms-and-leads/">x</a>',
      '<a href="/features/#a">y</a>',
      '<link rel="canonical" href="https://webgnr.com/nl/docs/">',
      '{"url":"/docs/forms-and-leads/"}',
      '<loc>https://webgnr.com/docs/</loc>',
      '<a href="/">home</a><a href="/nl/">nl</a><a href="/_astro/x.css">c</a>',
    ].join('\n');
    const out = rewriteRoutes(src, map);
    expect(out).toContain('href="/docs-forms-and-leads"');
    expect(out).toContain('href="/features#a"');
    expect(out).toContain('href="https://webgnr.com/nl/docs"');
    expect(out).toContain('{"url":"/docs-forms-and-leads"}');
    expect(out).toContain('<loc>https://webgnr.com/docs</loc>');
    expect(out).toContain('href="/"');
    expect(out).toContain('href="/nl/"');
    expect(out).toContain('href="/_astro/x.css"');
  });
  it('does not touch prose that merely contains a path', () => {
    expect(rewriteRoutes('<p>see /docs/ for more</p>', map)).toBe('<p>see /docs/ for more</p>');
  });
});
