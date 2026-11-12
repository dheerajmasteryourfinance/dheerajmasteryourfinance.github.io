import { describe, it, expect } from 'vitest';
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { loadPage } from './helpers.js';

const DIST = join(process.cwd(), 'dist');

// Each docs article and the screenshots it must show, optimised by Astro into /_astro/.
const DOCS = {
  'a-tour-of-the-editor': ['editor-ai', 'editor-mobile', 'editor-unsaved'],
  'build-your-first-website': ['new-website-brief'],
  'forms-and-leads': ['manage-audience'],
  'send-a-campaign': ['campaign-settings'],
  'set-up-your-sender': ['sender'],
};

describe.each(Object.entries(DOCS))('docs %s', (slug, names) => {
  const doc = loadPage(`/docs/${slug}/`);
  const imgs = [...doc.querySelectorAll('article img')];

  it('shows its screenshots as optimised images with alt, size and a caption', () => {
    expect(imgs).toHaveLength(names.length);
    for (const name of names) {
      const img = imgs.find((i) => new RegExp(`/_astro/${name}\\.[\\w-]+\\.(webp|avif)$`).test(i.getAttribute('src')));
      expect(img, name).toBeTruthy();
      expect((img.getAttribute('alt') ?? '').trim().length, name).toBeGreaterThan(10);
      expect(img.getAttribute('loading')).toBe('lazy');
      expect(Number(img.getAttribute('width'))).toBeGreaterThan(0);
      expect(Number(img.getAttribute('height'))).toBeGreaterThan(0);
      // Caption: the paragraph right after the image is a single <em>.
      const caption = img.closest('p').nextElementSibling;
      expect(caption?.tagName, name).toBe('P');
      expect(caption.children).toHaveLength(1);
      expect(caption.firstElementChild.tagName).toBe('EM');
      expect(caption.textContent.trim().length).toBeGreaterThan(10);
    }
  });
});

describe('docs screenshot placeholders that now have a real screenshot', () => {
  it('send-a-campaign no longer has the builder placeholder', () => {
    expect(loadPage('/docs/send-a-campaign/').querySelector('article').textContent).not.toContain('[SCREENSHOT: New campaign');
  });
});

describe('the built site still fits the app ZIP import', () => {
  it('has under 400 files, none over 25 MB', () => {
    const files = [];
    const walk = (d) => {
      for (const n of readdirSync(d)) {
        const p = join(d, n);
        if (statSync(p).isDirectory()) walk(p);
        else files.push([p, statSync(p).size]);
      }
    };
    walk(DIST);
    expect(files.length).toBeLessThan(400);
    for (const [p, size] of files) expect(size, p).toBeLessThan(25 * 1024 * 1024);
  });
});
