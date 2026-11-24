# Webgnr launch video: design

Date: 2026-11-24. Status: draft for approval.

## Intent

A 60-second product video for the Webgnr Home page. It should feel like a big-platform
product launch film (Google, Meta, Apple style): bold kinetic type, smooth product-UI motion,
one idea per beat, quick cuts on a steady rhythm. It also works as a product overview in
sales calls and on social.

The message: **Webgnr makes brand story sites.** You describe your business, Webgnr turns it
into your brand story and a website that tells it, plus forms and email to follow up. It closes
on **"Start your free 14-day trial"**, which matches the site's main call to action.

## Goals

- In 60 seconds a viewer knows what Webgnr is, what they get, and what to click.
- Works with sound off (the Home page autoplays muted and loops). Every idea is on screen as text.
- Looks like the site: navy `#0F1E3D`, aqua `#40E0F5` (deep `#1EC0DC`), blue `#1D4ED8`,
  Bricolage Grotesque headings, DM Sans body.
- English and Dutch versions. Copy comes from `src/i18n/home.ts` wherever possible, so the
  video and the page say the same thing.
- Easy to change: edit text or timing and re-render. No re-shooting.

## Non-goals

- Embedding the video on the Home page. That's a separate small change after the files exist.
- Voiceover, and choosing or downloading music.
- A long walkthrough or tutorial.

## Anti-goals (it fails if...)

- It copies another company's branding, logo motion, music or signature look. We borrow the
  genre, not the identity.
- It looks like generic "AI slop": violet gradients, stock 3D blobs, Geist.
- It invents numbers, testimonials, customer logos or results.
- It shows a real client site (Capture Life, AffectEd Tech, Anneke van der Kuip), or mentions pricing.

## Approaches considered

| | Approach | Trade-off |
|---|---|---|
| **A (chosen)** | Animated from code: HTML/CSS scenes, frames captured by a headless browser, encoded with ffmpeg | Launch-film polish, sharp text, cheap to update and translate. The UI shown is a faithful recreation, not live footage. |
| B | Screen recording of the real app with motion overlays | Authentic, but it reads as a demo, shows any UI rough edges, and has to be re-shot whenever the UI changes. |
| C | Mix of A plus real-app clips | Most proof and most work. The clips date fastest. |

The user picked **A** on 2026-11-24.

## Storyboard (60 s, 30 fps; beats on a 0.5 s grid, about 120 BPM, so music fits later)

| Time | Beat | On screen (EN; NL from the matching `home.ts` copy or written alongside) |
|---|---|---|
| 0–4 s | Cold open | Navy screen. Words land one by one: **"Every business has a story."** |
| 4–9 s | Problem | Grey template blocks ("Your headline here", lorem text) drift and fall apart. **"Most websites don't tell it."** |
| 9–13 s | Reveal | An aqua route line draws across the screen into the Webgnr logo. **"Webgnr. Brand story sites."** |
| 13–22 s | Tell it | A recreated brief form. Answers type themselves in for the example business, GreenLeaf Bakery (already the example on the site). A chip flies in: "Or upload your brand guide". Caption: **"Describe your business."** |
| 22–30 s | Your story | Answers collapse into a brand story card: customer, problem, plan, success. A headline forms from it. Caption: **"Get your brand story."** |
| 30–40 s | The site | A browser frame. Hero, sections and images assemble. A cursor clicks the headline and edits it. A quick EN ⇄ NL flip. The address bar settles on the bakery's own domain. Caption: **"A website that tells it."** |
| 40–50 s | Follow up | A visitor signs up through a form. The contact drops into the audience list with its tag. A welcome email and a sequence of 3 steps slide out. A simple visits/sign-ups chart draws, with no numbers claimed. Caption: **"Forms and email, ready to go."** |
| 50–55 s | Triad | Three hard cuts, one line each: **"Get found." / "Get signed up." / "Follow up."** (the site's H1) |
| 55–60 s | End card | Logo, **"Start your free 14-day trial"** as a button, `website-generator.nl` underneath. Holds still so the loop restarts cleanly. |

All bakery content is visibly fictional demo content. Screens are simplified recreations of the
real app, styled with the site's tokens, not pixel copies of the current app UI.

## How it's built (builder's call, stated here)

- Lives in `webgen-site/video/`, outside `src/` so the Astro build and the site's gates ignore it.
- One HTML page per language (`video/index.html?lang=en|nl`), with scenes as absolutely positioned
  layers and copy in `video/copy.{en,nl}.json`.
- Animation uses CSS animations / the Web Animations API, with no new dependency. The renderer pauses
  every animation and sets `currentTime` per frame, so output is frame-exact and repeatable.
- Renderer: `video/render.mjs` uses the existing `puppeteer-core` with locally installed Chrome
  or Edge. It screenshots 1800 frames at 1920×1080, then the installed ffmpeg encodes them.
- Fonts are loaded locally (the same files the site uses), never from a CDN, so renders stay stable.
- Respects the 1080×1080 safe area: key text stays in the centre square, so the square cut is a re-layout, not a crop.

## Deliverables (per language: EN and NL)

- `webgnr-intro-{lang}-1080p.mp4`: H.264, yuv420p, faststart, no audio track, target under 8 MB.
- `webgnr-intro-{lang}-1080p.webm`: VP9, for the site's `<video>` source list.
- `webgnr-intro-{lang}-square.mp4`: 1080×1080, for social.
- `webgnr-intro-{lang}-poster.webp`: the end card, used as the poster and the reduced-motion fallback.
- A short text transcript per language, for the page's accessible description.

Rendered files go to `video/out/` (gitignored). Only the source is committed.

## Open items (not blocking the build)

- **Music.** You choose a royalty-free track. Beats are on a 0.5 s grid, so it drops in with one ffmpeg command.
- **"No card needed".** The app's trial is card-free (`TRIAL_DAYS = 14`, local trial), but the
  site doesn't say so yet. The video leaves it out unless Joel confirms.
- **Domain on the end card.** `website-generator.nl` is still awaiting confirmation as the canonical domain (see the launch checklist).

## Left to the builder

Exact easing curves, transition styles between beats, type sizes, the shape of the template
"fall apart" motion, and the demo bakery's wording, all within the site's style and the copy above.
