import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { unzipSync } from 'fflate';

const SCRIPT = resolve('scripts/package-zip.mjs');

function makeDist(indexHtml) {
  const root = mkdtempSync(join(tmpdir(), 'zip-'));
  const dist = join(root, 'dist');
  mkdirSync(join(dist, 'docs', 'start'), { recursive: true });
  writeFileSync(join(dist, 'index.html'), indexHtml);
  writeFileSync(join(dist, 'docs', 'start', 'index.html'), '<p>docs</p>');
  const out = join(root, 'out');
  mkdirSync(out);
  return { dist, out };
}

const run = (dist, out) =>
  spawnSync(process.execPath, [SCRIPT, '--dist', dist, '--out', out], { encoding: 'utf8' });

describe('package-zip', () => {
  it('refuses, non-zero, when dist contains a placeholder', () => {
    const { dist, out } = makeDist('<p>Email [SUPPORT EMAIL]</p>');
    const r = run(dist, out);
    expect(r.status).not.toBe(0);
    expect(r.stderr).toMatch(/placeholder/i);
    expect(readdirSync(out)).toEqual([]);
  });

  it('zips a clean dist with index.html at the root and forward-slash entries', () => {
    const { dist, out } = makeDist('<p>clean</p>');
    const r = run(dist, out);
    expect(r.status).toBe(0);
    const files = readdirSync(out);
    expect(files).toHaveLength(1);
    expect(files[0]).toMatch(/^webgen-site-[0-9a-f]{7,}\.zip$/);
    const entries = unzipSync(new Uint8Array(readFileSync(join(out, files[0]))));
    const names = Object.keys(entries).sort();
    expect(names).toEqual(['docs/start/index.html', 'index.html']);
    expect(names.some((n) => n.includes('\\'))).toBe(false);
    expect(Buffer.from(entries['index.html']).toString()).toBe('<p>clean</p>');
  });
});
