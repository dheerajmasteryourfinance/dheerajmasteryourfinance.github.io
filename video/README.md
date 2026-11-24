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

## Add music

Cuts sit on a 0.5 s grid (120 BPM). To add a royalty-free track:

    ffmpeg -i video/out/webgnr-intro-en-1080p.mp4 -i track.mp3 -c:v copy -c:a aac -b:a 160k -shortest -af "afade=t=out:st=58:d=2" webgnr-intro-en-music.mp4

Keep the silent version for the Home page autoplay.
