// Writes dist/search-index-<lang>.json from the built docs articles (the ones marked data-search-body).
// Plain JSON, so the site also imports into the WebGen app, which rejects Pagefind's own file types.
// Usage: node scripts/build-search-index.mjs [distDir]
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { parseHTML } from 'linkedom';

const dist = process.argv[2] ?? 'dist';

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (name === 'index.html') yield p;
  }
}

const clean = (s) => s.replace(/\s+/g, ' ').trim();
const byLang = {};

for (const file of walk(dist)) {
  const doc = parseHTML(readFileSync(file, 'utf8')).document;
  const article = doc.querySelector('article[data-search-body]');
  if (!article) continue;
  const lang = article.getAttribute('data-search-lang') || doc.documentElement.getAttribute('lang') || 'en';
  const rel = relative(dist, file).split(sep).slice(0, -1).join('/');
  const prose = article.querySelector('.prose') ?? article;
  (byLang[lang] ??= []).push({
    url: `/${rel}/`,
    title: clean(article.querySelector('h1')?.textContent ?? ''),
    headings: [...prose.querySelectorAll('h2')].map((h) => clean(h.textContent)),
    text: clean(prose.textContent),
  });
}

const langs = Object.keys(byLang);
if (langs.length === 0) {
  console.error(`search-index: no searchable pages found under ${dist}.`);
  process.exit(1);
}
for (const lang of langs) {
  byLang[lang].sort((a, b) => a.url.localeCompare(b.url));
  writeFileSync(join(dist, `search-index-${lang}.json`), JSON.stringify(byLang[lang]));
  console.log(`search-index: ${lang} ${byLang[lang].length} pages`);
}
