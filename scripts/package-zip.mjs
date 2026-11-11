import { readdirSync, readFileSync, statSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, relative, resolve, sep, dirname } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { zipSync } from 'fflate';

const HERE = dirname(fileURLToPath(import.meta.url));

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p);
    else yield p;
  }
}

function arg(argv, flag, fallback) {
  const i = argv.indexOf(flag);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
}

function gitShortSha() {
  const r = spawnSync('git', ['rev-parse', '--short', 'HEAD'], { encoding: 'utf8', cwd: HERE });
  const sha = r.status === 0 ? r.stdout.trim() : '';
  return sha || 'nogit';
}

function main(argv) {
  const dist = resolve(arg(argv, '--dist', 'dist'));
  const outDir = resolve(arg(argv, '--out', '.'));

  const check = spawnSync(process.execPath, [join(HERE, 'check-placeholders.mjs'), dist], {
    encoding: 'utf8',
  });
  if (check.status !== 0) {
    console.error(
      `package-zip: refusing to package, the placeholder check failed.\n${check.stderr || check.stdout}`,
    );
    return 1;
  }

  const files = {};
  for (const file of walk(dist)) {
    // Forward slashes, paths relative to dist so index.html sits at the zip root.
    files[relative(dist, file).split(sep).join('/')] = new Uint8Array(readFileSync(file));
  }
  if (!files['index.html']) {
    console.error(`package-zip: ${dist} has no index.html; run the build first.`);
    return 1;
  }

  mkdirSync(outDir, { recursive: true });
  const target = join(outDir, `webgen-site-${gitShortSha()}.zip`);
  writeFileSync(target, zipSync(files, { level: 9 }));
  console.log(`package-zip: wrote ${target} (${Object.keys(files).length} files).`);
  return 0;
}

process.exit(main(process.argv.slice(2)));
