import { defineConfig } from 'vitest/config';
import { existsSync } from 'node:fs';

// tests/build inspects the built site, so it only joins a plain npm test
// when dist/ exists. npm run test:build always builds first.
const hasDist = existsSync('dist');

export default defineConfig({
  test: {
    include: ['tests/**/*.test.js'],
    // Many tests parse every built page or start a process; a loaded machine can pass 5 s.
    testTimeout: 30_000,
    exclude: ['node_modules/**', 'dist/**', ...(hasDist ? [] : ['tests/build/**'])],
  },
});
