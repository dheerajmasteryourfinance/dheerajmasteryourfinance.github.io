// No-horizontal-scroll gate. Usage: node scripts/overflow.mjs <distDir>
// Serves the built site, opens every page at 320, 390, 768 and 1024px in a real Chrome and fails when
// the page is wider than the window. The site hides decorative overflow with `overflow-x: clip` on
// html/body, so the check turns that off (and hides the decorative blobs and floating cards) to see
// whether the real content fits.
import { createServer } from 'node:http';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, extname, normalize, sep } from 'node:path';
import { createRequire } from 'node:module';
import puppeteer from 'puppeteer-core';

const require = createRequire(import.meta.url);
const WIDTHS = [320, 390, 768, 1024];
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.woff2': 'font/woff2', '.woff': 'font/woff', '.xml': 'application/xml', '.txt': 'text/plain' };

const dist = process.argv[2] ?? 'dist';
if (!existsSync(dist)) {
  console.error(`overflow: ${dist} does not exist; build first.`);
  process.exit(2);
}

function chromePath() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  const found = require('chrome-launcher').Launcher.getInstallations()[0];
  if (!found) throw new Error('No Chrome found. Install Chrome or set CHROME_PATH.');
  return found;
}

/** Every page: "/" style routes for index.html files, plus /404.html. */
function routes(dir, base = '') {
  const out = [];
  for (const name of readdirSync(join(dir, base))) {
    if (name === 'pagefind') continue;
    const rel = join(base, name);
    if (statSync(join(dir, rel)).isDirectory()) out.push(...routes(dir, rel));
    else if (name === 'index.html') out.push('/' + base.split(sep).join('/') + (base ? '/' : ''));
    else if (name === '404.html' && !base) out.push('/404.html');
  }
  return out.sort();
}

const server = createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.endsWith('/')) p += 'index.html';
  const file = normalize(join(dist, p));
  if (!file.startsWith(normalize(dist)) || !existsSync(file) || statSync(file).isDirectory()) {
    res.writeHead(404, { 'content-type': 'text/plain' });
    res.end('not found');
    return;
  }
  res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' });
  res.end(readFileSync(file));
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const origin = `http://127.0.0.1:${server.address().port}`;

// Runs in the page: returns null when it fits, or the widest offender.
function measure() {
  const root = document.documentElement;
  if (root.scrollWidth <= window.innerWidth + 1) return null;
  let worst = null;
  for (const el of document.body.querySelectorAll('*')) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    if (getComputedStyle(el).visibility === 'hidden') continue;
    if (r.right > window.innerWidth + 1 && (!worst || r.right > worst.right)) worst = { el, right: r.right };
  }
  const el = worst?.el;
  const id = el?.id ? `#${el.id}` : '';
  const cls = el && typeof el.className === 'string' && el.className.trim() ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '';
  return {
    scrollWidth: root.scrollWidth,
    element: el ? `${el.tagName.toLowerCase()}${id}${cls}` : '(none found)',
    text: el ? (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 50) : '',
    right: worst ? Math.round(worst.right) : 0,
  };
}

const browser = await puppeteer.launch({ executablePath: chromePath(), headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
const list = routes(dist);
let pages = 0;
let failures = 0;

try {
  for (const route of list) {
    for (const width of WIDTHS) {
      await page.setViewport({ width, height: 800 });
      await page.goto(origin + route, { waitUntil: 'load' });
      await page.addStyleTag({ content: 'html,body{overflow-x:visible!important}.blob,.fchip{display:none!important}' });
      const bad = await page.evaluate(measure);
      pages += 1;
      if (bad) {
        failures += 1;
        console.log(`${route} at ${width}px: page is ${bad.scrollWidth}px wide. Widest element: ${bad.element} ends at ${bad.right}px "${bad.text}"`);
      }
    }
  }
} finally {
  await browser.close();
  server.close();
}

if (pages === 0) {
  console.error(`overflow: no pages found under ${dist}.`);
  process.exit(2);
}
if (failures > 0) {
  console.log(`overflow: ${failures} overflow(s) across ${list.length} pages at ${WIDTHS.join(', ')}px.`);
  process.exit(1);
}
console.log(`overflow: ${list.length} pages at ${WIDTHS.join(', ')}px, no horizontal overflow.`);
