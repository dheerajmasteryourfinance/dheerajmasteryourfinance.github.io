import { describe, it, expect } from 'vitest';
import { readdirSync, statSync } from 'node:fs';
import { join, extname, relative, sep } from 'node:path';

// The Webgnr app's ZIP import only keeps these file types (backend/app/services/site_import.py,
// ALLOWED_EXTENSIONS). Anything else is skipped, so the site must not depend on it.
const ALLOWED = new Set(['html', 'htm', 'css', 'js', 'mjs', 'json', 'txt', 'xml', 'ico', 'svg', 'png', 'jpg', 'jpeg', 'webp', 'gif', 'avif', 'mp4', 'webm', 'ogg', 'mp3', 'woff', 'woff2', 'ttf', 'otf', 'webmanifest', 'pdf', 'map']);

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p);
    else yield p;
  }
}

describe('built site and the Webgnr ZIP import', () => {
  it('every file in dist has a file type the import accepts', () => {
    const dist = join(process.cwd(), 'dist');
    const bad = [...walk(dist)]
      .filter((f) => !ALLOWED.has(extname(f).slice(1).toLowerCase()))
      .map((f) => relative(dist, f).split(sep).join('/'));
    expect(bad).toEqual([]);
  });
});
