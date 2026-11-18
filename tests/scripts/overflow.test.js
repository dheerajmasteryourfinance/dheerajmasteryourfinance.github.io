import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
let chrome = null;
try { chrome = require('chrome-launcher').Launcher.getInstallations()[0] ?? null; } catch { /* no launcher */ }
const hasChrome = Boolean(process.env.CHROME_PATH || chrome);

const HTML = (body) => `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>t</title><style>html,body{overflow-x:clip;margin:0}</style></head><body>${body}</body></html>`;
let root;

beforeAll(() => {
  root = mkdtempSync(join(tmpdir(), 'overflow-'));
  mkdirSync(join(root, 'fits'), { recursive: true });
  mkdirSync(join(root, 'wide'), { recursive: true });
  writeFileSync(join(root, 'fits', 'index.html'), HTML('<main><h1>Hello</h1><p>It fits.</p></main>'));
  // The page hides its overflow with overflow-x: clip, which the gate must see through.
  writeFileSync(join(root, 'wide', 'index.html'), HTML('<main><h1>Hello</h1><div id="big" style="width:2000px;height:20px;background:#ccc">far too wide</div></main>'));
});
afterAll(() => rmSync(root, { recursive: true, force: true }));

const run = (dir) => spawnSync(process.execPath, ['scripts/overflow.mjs', dir], { encoding: 'utf8', cwd: process.cwd(), timeout: 90_000 });

describe.skipIf(!hasChrome)('overflow gate', { timeout: 120_000 }, () => {
  it('exits 0 for a folder whose pages fit every width', () => {
    const r = run(join(root, 'fits'));
    expect(r.status, r.stdout + r.stderr).toBe(0);
    expect(r.stdout).toMatch(/no horizontal overflow/i);
  });

  it('exits 1 and names the route, the width and the widest element for a page that overflows', () => {
    const r = run(join(root, 'wide'));
    expect(r.status, r.stdout + r.stderr).toBe(1);
    expect(r.stdout).toContain('/');
    expect(r.stdout).toMatch(/320/);
    expect(r.stdout).toMatch(/div#big|far too wide/);
  });
});
