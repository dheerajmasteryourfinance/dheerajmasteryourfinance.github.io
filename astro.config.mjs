import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { satteri } from '@astrojs/markdown-satteri';
import { validHeadingIds } from './src/lib/heading-id.mjs';

// /docs/ and /nl/docs/ are only redirect pages and /404/ is noindex, so none belong in the sitemap.
const EXCLUDED = new Set(['https://website-generator.nl/404/', 'https://website-generator.nl/docs/', 'https://website-generator.nl/nl/docs/']);

export default defineConfig({
  output: 'static',
  site: 'https://website-generator.nl',
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
