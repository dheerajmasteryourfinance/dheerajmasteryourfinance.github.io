# Webgnr Launch Video Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A 60-second, launch-film-style intro video for the Webgnr Home page, in English and Dutch, rendered from code into MP4, WebM, a square cut and a poster.

**Architecture:** One HTML page (`video/index.html`) holds all nine scenes as layers. They're animated with CSS animations and driven by a deterministic timeline (`window.__video.seek(t)` pauses every animation and sets its `currentTime`). A Node renderer (`video/render.mjs`) opens the page in headless Chrome/Edge via `puppeteer-core`, screenshots each frame, and pipes the frames to ffmpeg.

**Tech Stack:** HTML/CSS + Web Animations API, Node 20+, `puppeteer-core` 25.17.0 (already in node_modules via lhci; pin it as a devDependency), ffmpeg 8 (installed via winget), vitest 3 for tests.

**Spec:** `docs/superpowers/specs/2026-11-24-launch-video-design.md`

## Global Constraints

- Duration exactly 60.0 s, 30 fps, 1800 frames. Main format 1920×1080, square format 1080×1080.
- Scene boundaries (s): open 0–4, problem 4–9, reveal 9–13, brief 13–22, story 22–30, site 30–40, followup 40–50, triad 50–55, end 55–60. Every boundary and beat is on a 0.5 s grid.
- Colours: navy `#0F1E3D`, aqua `#40E0F5`, aqua-deep `#1EC0DC`, aqua-hover `#90F0FB`, blue `#1D4ED8`. Take them from `src/styles/tokens.css` (import that file; don't copy the values).
- Fonts: Bricolage Grotesque (headings) and DM Sans (body), loaded only from `node_modules/@fontsource-variable/*`. No CDN, no network requests at render time.
- Brand name is "Webgnr". The end-card CTA must equal `home.ts` `hero.cta` for each language (EN "Start your free 14-day trial", NL "Start je gratis proefperiode van 14 dagen"). Triad lines equal `hero.h1Business` joined.
- No invented numbers, testimonials, logos or results; the chart has no numeric labels. No pricing. No "no card needed". Demo business is "GreenLeaf Bakery" only.
- No violet, no Geist, nothing imitating another company's branding.
- Main MP4: H.264, yuv420p, `+faststart`, **no audio stream**, under 8 MB. The WebM is VP9.
- Work on a new branch `launch-video` off `main` in `C:\Users\Dheeraj\webgen-site`. Don't merge it or push it.
- Everything lives under `video/`. Rendered output goes to `video/out/` (gitignored). The site build and `npm run check` must not change.

## Review Focus

1. **Fonts not loaded before the first frame** → frame 0 shows fallback serif. The renderer must await `document.fonts.ready` plus `window.__video.ready`. Test: a render-smoke test asserts `document.fonts.check('700 48px "Bricolage Grotesque Variable"')` is true before capture.
2. **Dutch text is longer and overflows its box** (NL CTA is about 40% longer). Expected: no text clips at 1920 or 1080 square. Test: `overflow.test.js` loads each lang×format at each scene's midpoint and asserts no `[data-copy]` element has `scrollWidth > clientWidth + 1`.
3. **Seeking backwards or non-sequentially gives a different frame than playing forward** → glitches in stills. Expected: `seek(t)` is pure. Test: the screenshot at t=20 after seeking 50→20 is byte-identical to a fresh seek to 20.
4. **The loop seam**: the frame at 60 s must look like the end card and frame 0 must be clean navy, so the autoplay loop restarts without a flash of half-built UI. Test: the still at t=0 has no visible element other than the background and the first word's container (opacity check).
5. **Missing or extra copy keys between EN and NL** → blank text in one language. Test: `copy.test.js` asserts identical key sets and no empty strings.

---

## File Structure

| File | Responsibility |
|---|---|
| `video/index.html` | Scene markup; every text node is `<span data-copy="key">` |
| `video/video.css` | Stage, tokens import, fonts, shared type and motion classes |
| `video/scenes/*.css` | One file per scene group: `intro.css` (open, problem, reveal), `brief.css` (brief, story), `site.css`, `outro.css` (followup, triad, end) |
| `video/timeline.js` | `SCENES`, `DURATION`, `FPS`, `seek(t)`, `ready`; exposes `window.__video` |
| `video/copy.js` | Reads `?lang=`, fills `[data-copy]` from `copy.en.json` / `copy.nl.json`; reads `?format=square` and sets `data-format` on `<html>` |
| `video/copy.en.json`, `video/copy.nl.json` | All on-screen words |
| `video/transcript.en.txt`, `video/transcript.nl.txt` | Accessible text description |
| `video/render.mjs` | CLI: `--lang en|nl --format wide|square [--still <sec>] [--out dir]` |
| `video/lib/browser.mjs` | `findBrowser(): string` (Chrome, then Edge, then `CHROME_PATH`) and `openStage({lang, format}): Promise<{page, close}>` |
| `video/lib/encode.mjs` | `encodeArgs(kind, {fps, size}): string[]` with the ffmpeg args per output kind |
| `tests/video/*.test.js` | Unit and render-smoke tests (smoke tests skip when no browser is found) |

---

### Task 1: Scaffold, copy files and the timeline

**Files:**
- Create: `video/index.html`, `video/video.css`, `video/timeline.js`, `video/copy.js`, `video/copy.en.json`, `video/copy.nl.json`
- Modify: `.gitignore` (add `video/out/`), `package.json` (devDependency `"puppeteer-core": "25.17.0"`; scripts `"video:render": "node video/render.mjs"`, `"video:all": "node video/render.mjs --all"`)
- Test: `tests/video/copy.test.js`, `tests/video/timeline.test.js`

**Interfaces:**
- Produces: `export const DURATION = 60, FPS = 30;` `export const SCENES: {id: string, start: number, end: number}[]` (ids: `open, problem, reveal, brief, story, site, followup, triad, end`). `export function seek(t: number): void` sets every `document.getAnimations()` entry to paused with `currentTime = t*1000` (for CSS animations, the global time; scene animations use `animation-delay` equal to the beat's absolute time). `window.__video = { DURATION, FPS, SCENES, seek, ready: Promise<void> }`, where `ready` resolves after copy is filled and `document.fonts.ready`.
- Produces: copy keys (both files): `open.line`, `problem.line`, `problem.placeholders[]`, `reveal.tag`, `brief.caption`, `brief.business`, `brief.fields[] {label, answer}`, `brief.upload`, `story.caption`, `story.parts[] {label, text}`, `story.headline`, `site.caption`, `site.domain`, `site.nav[]`, `site.heroSub`, `followup.caption`, `followup.formLabel`, `followup.contactName`, `followup.tag`, `followup.emails[]`, `followup.chartLabel`, `triad[3]`, `end.cta`, `end.url`.

- [ ] **Step 1: Write the failing tests**

```js
// tests/video/copy.test.js
import en from '../../video/copy.en.json' with { type: 'json' };
import nl from '../../video/copy.nl.json' with { type: 'json' };
const keys = (o, p = '') => Object.entries(o).flatMap(([k, v]) =>
  v && typeof v === 'object' ? keys(v, `${p}${k}.`) : [`${p}${k}`]);
test('EN and NL have identical keys', () => expect(keys(nl).sort()).toEqual(keys(en).sort()));
test('no empty strings', () => [...keys(en).map(k=>['en',k]), ...keys(nl).map(k=>['nl',k])]
  .forEach(([l,k]) => expect(k.split('.').reduce((o,x)=>o[x], l==='en'?en:nl)).not.toBe('')));
test('end CTA matches site', () => {
  expect(en.end.cta).toBe('Start your free 14-day trial');
  expect(nl.end.cta).toBe('Start je gratis proefperiode van 14 dagen');
});
test('triad matches the hero H1', () => {
  expect(en.triad).toEqual(['Get found.', 'Get signed up.', 'Follow up.']);
  expect(nl.triad).toEqual(['Word gevonden.', 'Krijg aanmeldingen.', 'Volg op.']);
});
test('banned words absent', () => expect(JSON.stringify([en, nl]))
  .not.toMatch(/price|prijs|€|\$|no card|geen creditcard|testimonial/i));
```

```js
// tests/video/timeline.test.js
import { SCENES, DURATION, FPS } from '../../video/timeline.js';
test('60 s at 30 fps', () => { expect(DURATION).toBe(60); expect(FPS).toBe(30); });
test('scenes contiguous, ordered, cover 0..60', () => {
  expect(SCENES.map(s => s.id)).toEqual(['open','problem','reveal','brief','story','site','followup','triad','end']);
  expect(SCENES[0].start).toBe(0); expect(SCENES.at(-1).end).toBe(60);
  SCENES.forEach((s, i) => i && expect(s.start).toBe(SCENES[i-1].end));
});
test('on the 0.5 s grid', () => SCENES.forEach(s => {
  expect((s.start * 2) % 1).toBe(0); expect((s.end * 2) % 1).toBe(0);
}));
```

`timeline.js` must import cleanly in Node: guard the `window`/`document` use with `typeof window !== 'undefined'`.

- [ ] **Step 2: Run** `npx vitest run tests/video`. Expected: FAIL (files missing).
- [ ] **Step 3: Implement** the files above. The copy JSON is written from the spec storyboard (EN), with Dutch written natively in the same style as `src/i18n/home.ts` NL. `index.html` holds a 1920×1080 `#stage` (1080×1080 when `html[data-format=square]`) and one empty `<section class="scene" data-scene="id">` per scene, visible only between its start and end via an opacity animation.
- [ ] **Step 4: Run** `npx vitest run tests/video`. Expected: PASS. Then `npm test` and `npm run check`. Expected: both still pass, unchanged.
- [ ] **Step 5: Commit** `feat(video): scaffold, copy and timeline for the launch video`

### Task 2: Renderer (stills first, then the full encode)

**Files:**
- Create: `video/render.mjs`, `video/lib/browser.mjs`, `video/lib/encode.mjs`
- Test: `tests/video/encode.test.js`, `tests/video/render-smoke.test.js`

**Interfaces:**
- Consumes: `window.__video` from Task 1.
- Produces: `findBrowser(): string | null`; `openStage({lang, format}): Promise<{page, close}>`, which loads `video/index.html` via a `file://` URL with `?lang&format`, sets the viewport to the stage size at deviceScaleFactor 1, and awaits `__video.ready`. `encodeArgs(kind: 'mp4'|'webm'|'square'|'poster', {fps, size}): string[]`. CLI output names: `webgnr-intro-{lang}-1080p.mp4`, `-1080p.webm`, `-square.mp4`, `-poster.webp`, and `still-{lang}-{format}-{sec}.png` for `--still`.

- [ ] **Step 1: Write the failing tests**

```js
// tests/video/encode.test.js
import { encodeArgs } from '../../video/lib/encode.mjs';
test('mp4 is h264 yuv420p faststart, no audio', () => {
  const a = encodeArgs('mp4', { fps: 30, size: '1920x1080' }).join(' ');
  expect(a).toMatch(/-c:v libx264/); expect(a).toMatch(/-pix_fmt yuv420p/);
  expect(a).toMatch(/-movflags \+faststart/); expect(a).toMatch(/-an/);
});
test('webm is vp9', () => expect(encodeArgs('webm', { fps: 30, size: '1920x1080' }).join(' ')).toMatch(/libvpx-vp9/));
```

```js
// tests/video/render-smoke.test.js  (describe.skipIf(!findBrowser()))
// - fonts: after openStage, page.evaluate(() => document.fonts.check('700 48px "Bricolage Grotesque Variable"')) === true
// - seek purity: screenshot after seek(50); seek(20) equals screenshot after a fresh seek(20) (Buffer.equals)
// - no network: page.on('request') sees only file:// URLs
```

- [ ] **Step 2: Run** `npx vitest run tests/video`. Expected: FAIL.
- [ ] **Step 3: Implement.** Frames are written as PNGs to `video/out/frames-{lang}-{format}/%05d.png`, then encoded with `ffmpeg -framerate 30 -i %05d.png ...`. Poster = the frame at 59.0 s. `--all` renders en and nl × wide and square. The frame directory is deleted after a successful encode.
- [ ] **Step 4: Run** the tests (PASS), then `node video/render.mjs --lang en --format wide --still 2`. Expected: a PNG exists, and looking at it shows navy with the first words in Bricolage.
- [ ] **Step 5: Commit** `feat(video): frame renderer and ffmpeg encode`

### Task 3: Scenes open, problem, reveal (0–13 s)

**Files:** Create `video/scenes/intro.css`; modify `video/index.html` (markup inside the three sections).

- [ ] **Step 1: Build.** Open: words of `open.line` rise and settle one by one, 0.5 s apart, with kinetic weight change. Problem: grey wireframe blocks with `problem.placeholders` drift, tilt and fall off-frame from 6 s, while `problem.line` lands. Reveal: an aqua SVG route line (`stroke-dashoffset`) draws in from the left, ends in the logo mark (use `src/components/Logo.astro`'s SVG), and `reveal.tag` fades up.
- [ ] **Step 2: Verify** with stills at 0, 2, 6, 8, 11 and 12.5, in en and nl. View each one: nothing clips, there's no fallback font, and t=0 is a clean navy frame.
- [ ] **Step 3: Commit** `feat(video): opening, problem and reveal scenes`

### Task 4: Scenes brief and story (13–30 s)

**Files:** Create `video/scenes/brief.css`; modify `video/index.html`.

- [ ] **Step 1: Build.** Brief: a card styled like the app's intake form (white, 16px radius, DM Sans). Fields fill in with a typing effect (CSS `steps()` on width over a monospace-free clip, or one `<span>` per character with staggered delay), plus a `brief.upload` chip flying in at about 19 s. Story: the field cards collapse into a four-part `story.parts` card, then `story.headline` sets in large Bricolage.
- [ ] **Step 2: Verify** with stills at 14, 17, 20, 23, 26 and 29, in en and nl, wide and square.
- [ ] **Step 3: Commit** `feat(video): brief and brand story scenes`

### Task 5: Scene site (30–40 s)

**Files:** Create `video/scenes/site.css`; modify `video/index.html`.

- [ ] **Step 1: Build.** A browser frame with an address bar. GreenLeaf Bakery hero, nav (`site.nav`) and three section blocks assemble with staggered rises. A cursor moves to the headline at about 34 s, an edit outline plus toolbar appears and the text changes. An EN ⇄ NL toggle flips at about 36.5 s (the headline swaps language in both renders). The address bar types `site.domain` at about 38 s. No real client content, and images are flat illustrated shapes, not photos.
- [ ] **Step 2: Verify** with stills at 31, 34, 36.5, 38.5 and 39.5, in all four lang×format combinations.
- [ ] **Step 3: Commit** `feat(video): site build scene`

### Task 6: Scenes followup, triad, end (40–60 s), plus overflow and loop tests

**Files:** Create `video/scenes/outro.css`, `tests/video/overflow.test.js`; modify `video/index.html`.

- [ ] **Step 1: Write the failing test** `overflow.test.js` (skipIf no browser): for each lang × format × scene midpoint, after `seek(mid)` assert every *visible* `[data-copy]` has `scrollWidth <= clientWidth + 1` and `scrollHeight <= clientHeight + 1`. Add the loop-seam assertion: at t=0 every `.scene` except `open` has computed opacity `0`.
- [ ] **Step 2: Run.** Expected: FAIL, because the outro scenes are empty and their copy elements are missing.
- [ ] **Step 3: Build.** Followup: a form submits, a contact row drops into the list with a `followup.tag` pill, three email cards (`followup.emails`) fan out as a sequence, then a line chart draws with no axis numbers. Triad: three hard cuts at 50, 51.5 and 53 s, one line each, full-bleed, alternating navy and aqua backgrounds. End: logo, `end.cta` as an aqua button, `end.url` underneath, static from 56 s to 60 s.
- [ ] **Step 4: Run** `npx vitest run tests/video`. Expected: PASS. Fix any Dutch overflow by adjusting the layout, not by shortening the agreed copy (CTA and triad text are fixed).
- [ ] **Step 5: Commit** `feat(video): follow-up, triad and end card; overflow and loop tests`

### Task 7: Full renders, transcripts, README

**Files:** Create `video/transcript.en.txt`, `video/transcript.nl.txt`, `video/README.md` (how to render, how to add music with one ffmpeg line: `ffmpeg -i in.mp4 -i track.mp3 -c:v copy -c:a aac -shortest out.mp4`).
- Test: `tests/video/output.test.js` (skipIf `video/out` missing) uses `ffprobe -v error -show_streams -show_format -of json`.

- [ ] **Step 1: Write the test.** For each `*-1080p.mp4`: duration within 60 ± 0.05, width 1920, height 1080, `r_frame_rate` `30/1`, `pix_fmt` `yuv420p`, no stream with `codec_type: 'audio'`, size < 8 × 1024 × 1024. Square: 1080×1080. WebM: codec `vp9`. Poster exists.
- [ ] **Step 2: Run** `npm run video:all` (in the background, several minutes), then `npx vitest run tests/video`. Expected: PASS. If the MP4 is ≥ 8 MB, raise `-crf` in `encodeArgs('mp4')` in steps of 2 (starting at 20) and re-encode.
- [ ] **Step 3: Watch** each MP4 end to end at full speed (open it in the browser pane with a `file://` URL). Check the rhythm, that no scene overlaps, and that the loop restarts cleanly.
- [ ] **Step 4: Commit** `docs(video): transcripts and README for the launch video` (source only; `video/out/` stays ignored).
