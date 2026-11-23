import { describe, it, expect } from 'vitest';
import { publishedDir, relativize, relativizeSrcsets } from '../../scripts/import-paths.mjs';

// Mirrors the WebGen app's importer (backend/app/services/site_import.py + site_paths.py), which rewrites
// href/src but not srcset/imagesrcset, so those are rewritten here before the ZIP is built.

describe('publishedDir', () => {
  it('is the directory a page is served under (clean URLs drop the trailing folder)', () => {
    expect(publishedDir('index.html')).toBe('');
    expect(publishedDir('404.html')).toBe('');
    expect(publishedDir('nl/index.html')).toBe('');
    expect(publishedDir('nl/docs/index.html')).toBe('nl');
    expect(publishedDir('nl/docs/forms-and-leads/index.html')).toBe('nl/docs');
    expect(publishedDir('docs/forms-and-leads/index.html')).toBe('docs');
  });
});

describe('relativize', () => {
  it('turns a root-absolute URL into one relative to the page base', () => {
    expect(relativize('/_astro/a.webp', '')).toBe('_astro/a.webp');
    expect(relativize('/_astro/a.webp', 'nl/docs')).toBe('../../_astro/a.webp');
  });
  it('leaves relative, protocol-relative and absolute URLs alone', () => {
    expect(relativize('_astro/a.webp', 'nl')).toBe('_astro/a.webp');
    expect(relativize('//cdn.example.com/a.png', 'nl')).toBe('//cdn.example.com/a.png');
    expect(relativize('https://example.com/a.png', 'nl')).toBe('https://example.com/a.png');
    expect(relativize('data:image/png;base64,AAAA', 'nl')).toBe('data:image/png;base64,AAAA');
  });
});

describe('relativizeSrcsets', () => {
  const html = (inner) => `<picture>${inner}</picture>`;
  it('rewrites every candidate in srcset and imagesrcset, keeping the descriptors', () => {
    const src = html('<source srcset="/_astro/x-480.avif 480w, /_astro/x-800.avif 800w" type="image/avif"><img src="/_astro/x.webp" srcset="/_astro/x-480.webp 480w,/_astro/x-800.webp 800w" alt="a">')
      + '<link rel="preload" as="image" imagesrcset="/_astro/p-480.webp 480w, /_astro/p-800.webp 800w">';
    const out = relativizeSrcsets(src, 'nl/docs');
    expect(out).toContain('srcset="../../_astro/x-480.avif 480w, ../../_astro/x-800.avif 800w"');
    expect(out).toContain('srcset="../../_astro/x-480.webp 480w, ../../_astro/x-800.webp 800w"');
    expect(out).toContain('imagesrcset="../../_astro/p-480.webp 480w, ../../_astro/p-800.webp 800w"');
    // plain src is the importer's job and stays as it was
    expect(out).toContain('src="/_astro/x.webp"');
  });
  it('handles a single URL without a descriptor and base ""', () => {
    expect(relativizeSrcsets('<img srcset="/a.png">', '')).toBe('<img srcset="a.png">');
  });
  it('does not touch text that only mentions srcset', () => {
    const s = '<p>use srcset="/x.png 1x" in your markup</p>';
    expect(relativizeSrcsets(s, 'nl')).toBe(s);
  });
});
