import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { satteri } from '@astrojs/markdown-satteri';
import { validHeadingIds } from './src/lib/heading-id.mjs';

// /404/ is noindex, so it does not belong in the sitemap. The docs landing pages do.
const EXCLUDED = new Set(['https://webgnr.com/404/']);

export default defineConfig({
  output: 'static',
  site: 'https://webgnr.com',
  trailingSlash: 'always',
  build: { format: 'directory' },
  // English stays at the root; Dutch lives under /nl/ with the same slugs.
  i18n: { defaultLocale: 'en', locales: ['en', 'nl'], routing: { prefixDefaultLocale: false } },
  markdown: { processor: satteri({ hastPlugins: [validHeadingIds] }) },
  integrations: [
    sitemap({
      filter: (page) => !EXCLUDED.has(page),
      i18n: { defaultLocale: 'en', locales: { en: 'en', nl: 'nl' } },
    }),
  ],
});
