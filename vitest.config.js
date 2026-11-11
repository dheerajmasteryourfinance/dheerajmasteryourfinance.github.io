import { defineConfig } from 'vitest/config';
import { existsSync } from 'node:fs';

// tests/build inspects the built site, so it only joins a plain npm test
// when dist/ exists. npm run test:build always builds first.
const hasDist = existsSync('dist');

export default defineConfig({
  test: {
    include: ['tests/**/*.test.js'],
    exclude: ['node_modules/**', 'dist/**', ...(hasDist ? [] : ['tests/build/**'])],
  },
});
