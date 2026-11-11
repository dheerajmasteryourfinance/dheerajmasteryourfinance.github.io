import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { satteri } from '@astrojs/markdown-satteri';
import { validHeadingIds } from './src/lib/heading-id.mjs';

// /docs/ is only a redirect page and /404/ is noindex, so neither belongs in the sitemap.
const EXCLUDED = new Set(['https://webgnr.com/404/', 'https://webgnr.com/docs/']);

export default defineConfig({
  output: 'static',
  site: 'https://webgnr.com',
  trailingSlash: 'always',
  build: { format: 'directory' },
  markdown: { processor: satteri({ hastPlugins: [validHeadingIds] }) },
  integrations: [sitemap({ filter: (page) => !EXCLUDED.has(page) })],
});
