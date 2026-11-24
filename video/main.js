// Fills the copy for ?lang=, sets ?format=, builds typing effects, exposes window.__video.
import { DURATION, FPS, SCENES, seek } from './timeline.js';

const params = new URLSearchParams(location.search);
const lang = params.get('lang') === 'nl' ? 'nl' : 'en';
const format = params.get('format') === 'square' ? 'square' : 'wide';
document.documentElement.lang = lang;
document.documentElement.dataset.format = format;

const get = (o, path) => path.split('.').reduce((x, k) => (x == null ? x : x[k]), o);

async function fill() {
  const copy = await (await fetch(`./copy.${lang}.json`)).json();
  for (const el of document.querySelectorAll('[data-copy]')) {
    const v = get(copy, el.dataset.copy);
    if (typeof v !== 'string') throw new Error(`missing copy: ${el.dataset.copy}`);
    el.textContent = v;
  }
  // data-type-at="<sec>": the text types in one character at a time from that second.
  for (const el of document.querySelectorAll('[data-type-at]')) {
    const at = Number(el.dataset.typeAt);
    const step = Number(el.dataset.typeStep || 0.035);
    const chars = [...el.textContent];
    el.textContent = '';
    chars.forEach((c, i) => {
      const s = document.createElement('span');
      s.className = 'ch';
      s.textContent = c;
      s.style.setProperty('--at', (at + i * step).toFixed(3));
      el.append(s);
    });
  }
  // data-words-at="<sec>": each word lands on its own beat.
  for (const el of document.querySelectorAll('[data-words-at]')) {
    const at = Number(el.dataset.wordsAt);
    const step = Number(el.dataset.wordsStep || 0.5);
    const words = el.textContent.split(' ');
    el.textContent = '';
    words.forEach((w, i) => {
      const s = document.createElement('span');
      s.className = 'word';
      s.textContent = w;
      s.style.setProperty('--at', (at + i * step).toFixed(3));
      el.append(s, i < words.length - 1 ? ' ' : '');
    });
  }
}

const ready = (async () => {
  await fill();
  await document.fonts.ready;
  await Promise.all([...document.fonts].filter(f => f.status !== 'loaded').map(f => f.load().catch(() => {})));
  seek(0);
})();

window.__video = { DURATION, FPS, SCENES, seek, ready, lang, format };

// Opened directly (not by the renderer): play it on a loop for previewing.
if (!params.has('render')) {
  ready.then(() => {
    const t0 = performance.now() - Number(params.get('t') || 0) * 1000;
    const tick = () => { seek(((performance.now() - t0) / 1000) % DURATION); requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  });
}
