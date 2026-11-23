import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

let root;
const page = (lang, title, body) => `<!doctype html><html lang="${lang}"><head><title>${title}</title></head><body><main><article data-search-body data-search-lang="${lang}"><h1>${title}</h1><div class="prose"><h2 id="a">1. First step</h2><p>${body}</p></div></article></main></body></html>`;

beforeAll(() => {
  root = mkdtempSync(join(tmpdir(), 'sidx-'));
  mkdirSync(join(root, 'docs', 'one'), { recursive: true });
  mkdirSync(join(root, 'nl', 'docs', 'een'), { recursive: true });
  mkdirSync(join(root, 'docs'), { recursive: true });
  writeFileSync(join(root, 'docs', 'one', 'index.html'), page('en', 'First guide', 'Click <strong>Publish</strong> &amp; wait.'));
  writeFileSync(join(root, 'nl', 'docs', 'een', 'index.html'), page('nl', 'Eerste gids', 'Klik op Publiceren.'));
  // A page without the marker must not be indexed.
  writeFileSync(join(root, 'docs', 'index.html'), '<!doctype html><html lang="en"><head><title>Docs</title></head><body><main><h1>Landing</h1></main></body></html>');
});
afterAll(() => rmSync(root, { recursive: true, force: true }));

describe('build-search-index', () => {
  it('writes one JSON index per language with url, title, headings and text', () => {
    const r = spawnSync(process.execPath, ['scripts/build-search-index.mjs', root], { encoding: 'utf8' });
    expect(r.status, r.stdout + r.stderr).toBe(0);
    const en = JSON.parse(readFileSync(join(root, 'search-index-en.json'), 'utf8'));
    const nl = JSON.parse(readFileSync(join(root, 'search-index-nl.json'), 'utf8'));
    expect(en).toHaveLength(1);
    expect(en[0]).toMatchObject({ url: '/docs/one/', title: 'First guide', headings: ['1. First step'] });
    expect(en[0].text).toContain('Click Publish & wait.');
    expect(nl).toHaveLength(1);
    expect(nl[0].url).toBe('/nl/docs/een/');
  });

  it('fails when no searchable page is found (so a broken build is noticed)', () => {
    const empty = mkdtempSync(join(tmpdir(), 'sidx-empty-'));
    writeFileSync(join(empty, 'index.html'), '<!doctype html><title>x</title><p>x</p>');
    const r = spawnSync(process.execPath, ['scripts/build-search-index.mjs', empty], { encoding: 'utf8' });
    rmSync(empty, { recursive: true, force: true });
    expect(r.status).toBe(1);
    expect(existsSync(join(empty, 'search-index-en.json'))).toBe(false);
  });
});
