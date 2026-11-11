import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Detects the brief regex \[[A-Z]+[\] :] and extends the match to the closing bracket for readable reports.
const PLACEHOLDER = /\[[A-Z]+(?:[\] :][^\]\[]*\]?)?/g;

/** Return every placeholder-looking token found in text. */
export function findPlaceholders(text) {
  return text.match(PLACEHOLDER) ?? [];
}

function stripTags(html) {
  return html
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]*>/g, ' ');
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
    for (const token of findPlaceholders(stripTags(readFileSync(file, 'utf8')))) {
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
