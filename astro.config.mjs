import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  site: 'https://webgnr.com',
  trailingSlash: 'always',
  build: { format: 'directory' },
});
