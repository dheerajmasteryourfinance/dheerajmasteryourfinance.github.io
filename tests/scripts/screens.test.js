import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const SCREENS = join(ROOT, 'src/assets/screens');

/** Width and height from a PNG's IHDR chunk (bytes 16-23), no image library needed. */
function pngSize(file) {
  const b = readFileSync(file);
  expect(b.subarray(1, 4).toString('latin1'), file).toBe('PNG');
  return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
}

// The raw screenshots of the app's Manage pages show the app bar with the Admin
// menu and the user's initials. The committed copies must be cropped below it.
const PRIVACY_CROPPED = {
  'new-website-brief.png': { height: 902, width: 1892 },
  'manage-audience.png': { height: 907, width: 1895 },
  'campaign-settings.png': { height: 902, width: 1880 },
  'sender.png': { height: 896, width: 1905 },
};

const EXPECTED = [
  'campaign-settings.png',
  'editor-ai.png',
  'editor-edit.png',
  'editor-mobile.png',
  'editor-unsaved.png',
  'manage-audience.png',
  'new-website-brief.png',
  'sender.png',
  'site-desktop.png',
  'site-mobile.png',
];

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p);
    else yield p;
  }
}

describe('app screenshots', () => {
  it('ships exactly the renamed screenshots, none of the raw originals', () => {
    expect(existsSync(SCREENS)).toBe(true);
    expect(readdirSync(SCREENS).sort()).toEqual(EXPECTED);
  });

  it.each(Object.entries(PRIVACY_CROPPED))('%s is cropped below the app bar', (name, original) => {
    const { width, height } = pngSize(join(SCREENS, name));
    // The app bar is 62-64px tall; the crop removes at least that much.
    expect(height).toBeLessThanOrEqual(original.height - 62);
    // The language switch and user initials sit at the far right; the crop keeps the content column only.
    expect(width).toBeLessThan(original.width / 2);
  });

  it('no source file references the raw screenshot names', () => {
    const hits = [];
    for (const file of walk(join(ROOT, 'src'))) {
      if (!/\.(astro|md|mdx|js|mjs|ts|css)$/.test(file)) continue;
      if (/Screenshot \d{4}-\d{2}-\d{2}/.test(readFileSync(file, 'utf8'))) hits.push(file);
    }
    expect(hits).toEqual([]);
  });
});
