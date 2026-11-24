// Renders the launch video. Usage:
//   node video/render.mjs --lang en|nl --format wide|square [--still <sec>]
//   node video/render.mjs --all
import { mkdirSync, writeFileSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { openStage, SIZES } from './lib/browser.mjs';
import { encodeArgs } from './lib/encode.mjs';
import { DURATION, FPS } from './timeline.js';

const OUT = resolve(fileURLToPath(new URL('./out', import.meta.url)));
const FFMPEG = process.env.FFMPEG || 'ffmpeg';
const POSTER_AT = 59;

function args() {
  const a = process.argv.slice(2), o = {};
  for (let i = 0; i < a.length; i++) {
    if (!a[i].startsWith('--')) continue;
    const k = a[i].slice(2), v = a[i + 1] && !a[i + 1].startsWith('--') ? a[++i] : true;
    o[k] = o[k] ? [].concat(o[k], v) : v;
  }
  return o;
}

async function stills(lang, format, secs) {
  const stage = await openStage({ lang, format });
  try {
    for (const s of secs) {
      await stage.seek(Number(s));
      const file = resolve(OUT, `still-${lang}-${format}-${s}.png`);
      writeFileSync(file, await stage.shot());
      console.log(file);
    }
  } finally { await stage.close(); }
}

async function film(lang, format) {
  const { width, height } = SIZES[format];
  const size = `${width}x${height}`;
  const base = resolve(OUT, `webgnr-intro-${lang}`);
  const outputs = format === 'wide'
    ? [...encodeArgs('mp4', { fps: FPS, size }), '-y', `${base}-1080p.mp4`, ...encodeArgs('webm', { fps: FPS, size }), '-y', `${base}-1080p.webm`]
    : [...encodeArgs('square', { fps: FPS, size }), '-y', `${base}-square.mp4`];
  const ff = spawn(FFMPEG, ['-hide_banner', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'png', '-i', '-', ...outputs],
    { stdio: ['pipe', 'inherit', 'inherit'] });
  const done = new Promise((ok, fail) => ff.on('close', c => (c === 0 ? ok() : fail(new Error(`ffmpeg exited ${c}`)))));
  const stage = await openStage({ lang, format });
  try {
    const frames = DURATION * FPS;
    for (let f = 0; f < frames; f++) {
      await stage.seek(f / FPS);
      const buf = await stage.shot();
      if (!ff.stdin.write(buf)) await new Promise(ok => ff.stdin.once('drain', ok));
      if (f % 150 === 0) console.log(`${lang}/${format} ${f}/${frames}`);
    }
    if (format === 'wide') {
      await stage.seek(POSTER_AT);
      writeFileSync(`${base}-poster.webp`, await stage.shot('webp'));
    }
  } finally {
    ff.stdin.end();
    await stage.close();
  }
  await done;
  console.log(`done ${lang}/${format}`);
}

const o = args();
mkdirSync(OUT, { recursive: true });
const langs = o.all ? ['en', 'nl'] : [o.lang || 'en'];
const formats = o.all ? ['wide', 'square'] : [o.format || 'wide'];
for (const lang of langs) for (const format of formats) {
  if (o.still) await stills(lang, format, [].concat(o.still));
  else await film(lang, format);
}
