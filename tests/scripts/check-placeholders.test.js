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
  it('ignores mixed-case and unterminated look-alikes', () => {
    expect(findPlaceholders('see [ABCdef] and [HTMLtag')).toEqual([]);
  });
  it('reports the full token up to the closing bracket', () => {
    expect(findPlaceholders('a [SUPPORT EMAIL] b [CONFIRM: x] c [N] d')).toEqual([
      '[SUPPORT EMAIL]',
      '[CONFIRM: x]',
      '[N]',
    ]);
  });
});

describe('check-placeholders CLI, where the placeholder hides', () => {
  const runOn = (html) => {
    const d = mkdtempSync(join(tmpdir(), 'ph-'));
    writeFileSync(join(d, 'index.html'), html);
    return spawnSync('node', ['scripts/check-placeholders.mjs', d], { encoding: 'utf8' });
  };
  it('fails for a placeholder only in an href', () => {
    expect(runOn('<a href="mailto:[SUPPORT EMAIL]">x</a>').status).toBe(1);
  });
  it('fails for a placeholder only in a meta content attribute', () => {
    expect(runOn('<meta name="description" content="[CONFIRM: x]"><p>ok</p>').status).toBe(1);
  });
  it('fails for a placeholder only in JSON-LD', () => {
    const html = '<script type="application/ld+json">{"email":"[SUPPORT EMAIL]"}</script><p>ok</p>';
    expect(runOn(html).status).toBe(1);
  });
  it('does not fail for a placeholder only inside a style block', () => {
    expect(runOn('<style>.a::after{content:"[SUPPORT EMAIL]"}</style><p>ok</p>').status).toBe(0);
  });
  it('does not fail for look-alikes', () => {
    expect(runOn('<p>[ABCdef] [HTMLtag array[0]</p>').status).toBe(0);
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

describe('findPlaceholders, Dutch tokens', () => {
  it('matches hyphenated uppercase tokens such as [KVK-NUMMER]', () => {
    expect(findPlaceholders('KvK [KVK-NUMMER] en [E-MAILADRES SUPPORT] en [JURIDISCHE TEKST: x]')).toEqual([
      '[KVK-NUMMER]',
      '[E-MAILADRES SUPPORT]',
      '[JURIDISCHE TEKST: x]',
    ]);
  });
  it('still ignores lower-case and dangling hyphen look-alikes', () => {
    expect(findPlaceholders('[KVK-nummer] [KVK-] [-KVK]')).toEqual([]);
  });
});
