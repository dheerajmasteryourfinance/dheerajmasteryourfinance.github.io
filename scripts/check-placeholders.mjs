import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Match condition is the brief pattern \[[A-Z]+[\] :]; the reported token then runs to the closing bracket.
const PLACEHOLDER = /\[[A-Z]+(?:\]|[ :][^\]\[]*\]?)/g;

/** Return every placeholder-looking token found in text. */
export function findPlaceholders(text) {
  return text.match(PLACEHOLDER) ?? [];
}

// Scan raw HTML (attribute values, <script> text and JSON-LD included); only <style> blocks are ignored.
function stripStyles(html) {
  return html.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ');
}

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (name.endsWith('.html')) yield p;
  }
}

function main(argv) {
  const allow = argv.includes('--allow-placeholders');
  const dir = argv.find((a) => !a.startsWith('--')) ?? 'dist';
  const hits = [];
  for (const file of walk(dir)) {
    for (const token of findPlaceholders(stripStyles(readFileSync(file, 'utf8')))) {
      hits.push(`${file}: ${token}`);
    }
  }
  if (hits.length === 0) {
    console.log('check-placeholders: no placeholders found.');
    return 0;
  }
  const list = hits.join('\n');
  if (allow) {
    console.log(`check-placeholders: ${hits.length} placeholder(s) allowed (preview):\n${list}`);
    return 0;
  }
  console.error(`check-placeholders: ${hits.length} placeholder(s) left in the build:\n${list}`);
  return 1;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.exit(main(process.argv.slice(2)));
}
