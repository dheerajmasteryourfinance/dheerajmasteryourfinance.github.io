import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

describe('package script', () => {
  it('builds, validates, then zips', () => {
    const cmd = JSON.parse(readFileSync('package.json', 'utf8')).scripts.package;
    const i = (s) => cmd.indexOf(s);
    expect(i('npm run build')).toBeGreaterThanOrEqual(0);
    expect(i('scripts/check.mjs')).toBeGreaterThan(i('npm run build'));
    expect(i('scripts/package-zip.mjs')).toBeGreaterThan(i('scripts/check.mjs'));
  });
});
