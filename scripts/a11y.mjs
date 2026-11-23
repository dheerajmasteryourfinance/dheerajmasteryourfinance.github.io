import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { createRequire } from 'node:module';
import { JSDOM, VirtualConsole } from 'jsdom';

const require = createRequire(import.meta.url);
const axeSource = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');

const dist = process.argv[2] ?? 'dist';
const BLOCKING = new Set(['serious', 'critical']);

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      yield* walk(p);
    } else if (name.endsWith('.html')) yield p;
  }
}

let pages = 0;
let failures = 0;
for (const file of walk(dist)) {
  pages += 1;
  const dom = new JSDOM(readFileSync(file, 'utf8'), { runScripts: 'outside-only', virtualConsole: new VirtualConsole() });
  dom.window.eval(axeSource);
  // jsdom has no layout engine, so axe reports colour contrast as "incomplete" rather than a violation.
  const results = await dom.window.axe.run(dom.window.document.documentElement);
  const bad = results.violations.filter((v) => BLOCKING.has(v.impact));
  for (const v of bad) {
    failures += 1;
    console.error(`${relative(dist, file)}: [${v.impact}] ${v.id}: ${v.help}`);
    for (const n of v.nodes) console.error(`    ${n.target.join(' ')}`);
  }
  dom.window.close();
}

if (pages === 0) {
  console.error(`a11y: no HTML pages found under ${dist}; build first.`);
  process.exit(1);
}
if (failures > 0) {
  console.error(`a11y: ${failures} serious or critical violation(s) across ${pages} pages.`);
  process.exit(1);
}
console.log(`a11y: ${pages} pages, no serious or critical violations.`);
