import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { findPlaceholders } from '../../scripts/check-placeholders.mjs';

describe('findPlaceholders', () => {
  it('finds uppercase bracket tokens', () => {
    expect(findPlaceholders('Price [YOUR PRICE] and [CONFIRM: x] and [N]')).toHaveLength(3);
  });
  it('ignores array indexes and markdown links', () => {
    expect(findPlaceholders('use array[0] and [link](x)')).toEqual([]);
  });
});

describe('check-placeholders CLI', () => {
  const dir = mkdtempSync(join(tmpdir(), 'ph-'));
  mkdirSync(join(dir, 'a'));
  writeFileSync(join(dir, 'a', 'index.html'), '<p>Hello [SUPPORT EMAIL]</p>');
  const run = (...args) =>
    spawnSync('node', ['scripts/check-placeholders.mjs', dir, ...args], { encoding: 'utf8' });

  it('exits 1 when a placeholder exists', () => {
    const r = run();
    expect(r.status).toBe(1);
    expect(r.stderr + r.stdout).toContain('[SUPPORT EMAIL]');
  });
  it('exits 0 with --allow-placeholders', () => {
    expect(run('--allow-placeholders').status).toBe(0);
  });
});
