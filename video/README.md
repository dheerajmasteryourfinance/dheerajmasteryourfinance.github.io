# Webgnr intro video

A 60-second launch-style video for the Home page, built from code. Spec:
`docs/superpowers/specs/2026-11-24-launch-video-design.md`.

## Preview

Serve the repo root (for example `npx serve .`) and open `/video/index.html?lang=en` (or `nl`,
`&format=square`, `&t=30` to start at 30 s). It loops. Chrome blocks ES modules on `file://`,
so open it through a server.

## Render

Needs Chrome or Edge (or `CHROME_PATH`) and ffmpeg on `PATH` (or `FFMPEG`).

    npm run video:all                                   # en + nl, wide + square, ~15 min
    node video/render.mjs --lang nl --format wide        # one film
    node video/render.mjs --still 12.5 --still 40        # stills for checking a frame

Output goes to `video/out/` (gitignored):

- `webgnr-intro-{en,nl}-1080p.mp4`: H.264, no audio, for the Home page
- `webgnr-intro-{en,nl}-1080p.webm`: VP9, a second `<source>`
- `webgnr-intro-{en,nl}-square.mp4`: 1080×1080 for social
- `webgnr-intro-{en,nl}-poster.webp`: the end card, used as the poster and the reduced-motion fallback

## Change the words

All on-screen text is in `copy.en.json` and `copy.nl.json`. The end-card CTA and the triad must
match the site's Home copy (`src/i18n/home.ts`); `tests/video/copy.test.js` checks that.
Timing is in `timeline.js` (scenes) and in each element's `--at` (seconds into the film).

## Music

`audio/compose.mjs` synthesises an original 60 s music bed in code (120 BPM, F major, no samples,
so there are no licensing issues). It follows the storyboard: a quiet open, a hit on the logo,
a groove from 13 s, three hits on the triad cuts, and a fade to silence for the loop.

    npm run video:music          # writes *-music.mp4 next to each rendered silent MP4
    node video/audio/mux.mjs track.wav   # use your own track instead (keep it 60 s)

Keep the silent versions for the Home page autoplay. Use the `-music` versions for YouTube,
social posts and sales calls.

## Voiceover

`voiceover.md` has a timed English and Dutch script, plus the ffmpeg line for mixing in a recorded voice.
