import { spawnSync } from 'node:child_process';

// build:preview first (must succeed), then every gate runs even if an earlier
// one fails, so a Lighthouse problem never hides the html and a11y results.
const run = (label, cmd) => {
  console.log(`\n== ${label} ==`);
  return spawnSync(cmd, { shell: true, stdio: 'inherit' }).status === 0;
};

if (!run('build:preview', 'npm run build:preview')) process.exit(1);

const results = [
  ['html-validate', run('html-validate', 'npx html-validate "dist/**/*.html"')],
  ['a11y (axe)', run('a11y (axe)', 'node scripts/a11y.mjs dist')],
  ['lhci', run('lhci', 'npx lhci autorun')],
];

console.log('\n== summary ==');
for (const [name, ok] of results) console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}`);
process.exit(results.every(([, ok]) => ok) ? 0 : 1);
