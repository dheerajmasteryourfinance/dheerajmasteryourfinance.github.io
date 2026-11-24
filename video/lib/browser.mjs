// Headless Chrome/Edge plus a tiny local static server (Chrome won't run ES modules from file://).
import { existsSync, createReadStream, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const ROOT = resolve(fileURLToPath(new URL('../..', import.meta.url)));
const CANDIDATES = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
];
const TYPES = {
  '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png',
};
export const SIZES = { wide: { width: 1920, height: 1080 }, square: { width: 1080, height: 1080 } };

export function findBrowser() {
  return CANDIDATES.find(p => p && existsSync(p)) ?? null;
}

// Serves the repo root on 127.0.0.1 only, GET only, nothing outside the root.
function serve() {
  const server = createServer((req, res) => {
    let path;
    try { path = resolve(ROOT, '.' + decodeURIComponent(new URL(req.url, 'http://x').pathname)); } catch { path = ''; }
    if (req.method !== 'GET' || !path.startsWith(ROOT + sep) || !existsSync(path) || !statSync(path).isFile()) {
      res.writeHead(404).end();
      return;
    }
    res.writeHead(200, { 'content-type': TYPES[extname(path)] ?? 'application/octet-stream' });
    createReadStream(path).pipe(res);
  });
  return new Promise(ok => server.listen(0, '127.0.0.1', () => ok(server)));
}

export async function openStage({ lang = 'en', format = 'wide', onRequest } = {}) {
  const executablePath = findBrowser();
  if (!executablePath) throw new Error('No Chrome or Edge found; set CHROME_PATH.');
  const server = await serve();
  const origin = `http://127.0.0.1:${server.address().port}`;
  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    // --disable-gpu: with the GPU path, each screenshot of a still page waits ~1 s for a frame; software is ~75 ms.
    args: ['--disable-gpu', '--hide-scrollbars', '--force-color-profile=srgb', '--font-render-hinting=none'],
  });
  const page = await browser.newPage();
  if (onRequest) page.on('request', r => onRequest(r.url()));
  await page.setViewport({ ...SIZES[format], deviceScaleFactor: 1 });
  await page.goto(`${origin}/video/index.html?render&lang=${lang}&format=${format}`, { waitUntil: 'load' });
  await page.evaluate(() => window.__video.ready);
  const seek = t => page.evaluate(t => new Promise(ok => {
    window.__video.seek(t);
    requestAnimationFrame(() => requestAnimationFrame(ok));
  }), t);
  const shot = (type = 'png') => page.screenshot({ type, optimizeForSpeed: type === 'png' });
  const close = async () => { await browser.close(); server.close(); };
  return { page, seek, shot, close, origin };
}
