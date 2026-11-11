# WebGen Public Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the independent public site for WebGen on webgnr.com (Home, Features, Docs, Company, Email info, Privacy/Terms/Cookies), static, hosted through WebGen's own ZIP import.

**Architecture:** An Astro project in its own repository that builds to plain HTML and CSS. Each page's top-level blocks are `<section>` children of `<main>`, so the app's ZIP import tags them for free. The contact form follows the ZIP naming conventions, so the platform wires it to `/api/public/forms/submit`. Tests run against the built `dist/` HTML; small vanilla scripts are unit-tested in jsdom.

**Tech Stack:** Astro (static output, MDX for docs), Pagefind (static search), `@fontsource-variable/bricolage-grotesque` and `@fontsource-variable/dm-sans`, Vitest + jsdom + `linkedom` (HTML parsing in tests), `html-validate`, `@axe-core/cli` or `axe-core` via jsdom, Lighthouse CI.

**Spec:** `docs/superpowers/specs/2026-11-11-webgen-public-site-design.md` (in the WebGeneratorV2 repo; copy it into the new repo's `docs/` in Task 1). Visual reference: https://claude.ai/artifact/JAy7N7uR3Qvtra9nr87GLm

## Global Constraints

- Product name `WebGen`; domain `https://webgnr.com`. No pricing anywhere: no page, link, button or price text.
- Exact dependency versions in `package.json` (no `^` or `~`), lockfile committed.
- No runtime third-party requests: no Google Fonts, CDNs, embeds, iframes or analytics scripts in the source.
- Design tokens only, defined once in `src/styles/tokens.css`: `--ink #0F1E3D`, `--accent #FFC93C`, `--link #1D4ED8`, `--link-hover #1E3A8A`, `--muted #55607A`, `--body #1E293B`, `--line #E3E8F0`, `--line-strong #CBD3E1`, `--surface #F4F7FB`, `--tint #E8F0FE`, `--on-dark #C8D1E3`, `--on-dark-2 #DCE3EE`, `--danger #B91C1C`. Headings Bricolage Grotesque, body DM Sans.
- Buttons on `--accent` use `--ink` text. Text contrast at least 4.5:1. Touch targets at least 44px. No horizontal scroll at 390px.
- Every page: `<main>` whose direct children are `<section>` elements only.
- Copy: main CTA "Build my site" (links to `https://app.website-generator.nl/register` [CONFIRM URL]); transitional CTA "See an example" (href placeholder `#example`). No invented numbers, testimonials or logos.
- Placeholders are uppercase bracket tokens matching `\[[A-Z]+[\] :]`; email placeholders written as `[SUPPORT EMAIL]`, `[ABUSE EMAIL]`, `[PRIVACY EMAIL]`.
- Never mention Marchlands. Docs never expose admin URLs, internal endpoints or infrastructure.
- Do not push to a protected branch, deploy, or open a PR without the user's say-so. Run the `security-review` skill on the diff before any PR.

## Review Focus

- **Audience switch with JavaScript off:** business copy shows, agency copy is hidden, nothing flashes. Pinned in Task 2.
- **Contact form edge cases on the live host:** empty fields, a bad email, a double click and a fast second submit get the platform's validation and status message, and the page never echoes the raw query string. Pinned in Task 9.
- **A deep link to a page that doesn't exist** returns the site's own 404 page with working navigation. Pinned in Task 7.
- **Docs search** for a term with no results, or with characters like `<script>` or `"`, shows an empty-state message and never renders the query as HTML. Pinned in Task 6.
- **A placeholder left in any page** fails the production build. Pinned in Task 1.

---

### Task 0: Hosting spike (throwaway, blocks everything else)

**Files:** a scratch folder outside the new repo, e.g. `spike-import/`. Nothing here is kept.

- [ ] **Step 1:** Create a two-page static site by hand: `index.html` and `about/index.html`, each with `<main>` holding two `<section>`s. Add `/assets/app.js` (sets `document.body.dataset.js = "1"`), `/assets/site.css`, one `.woff2` font referenced via `@font-face`, a folder `/pagefind/` holding a `.wasm` and a `.json` file (any content), `sitemap.xml`, `robots.txt`, a canonical `<link>` and a JSON-LD `<script type="application/ld+json">`. On `about/`, add a contact form with `name`, `email`, a `<select name="topic">` and `<textarea name="message">`.
- [ ] **Step 2:** Zip it and upload it in the app with **Import an existing site**, using a test project on the user's account (local dev stack or staging, never production without the user's say-so).
- [ ] **Step 3:** Download the imported project (the app's download option) or open the preview, and check each item. Expected result for each:
  1. `app.js`, `site.css`, the font, and the `.wasm`/`.json` files exist byte-for-byte.
  2. The page script runs, so `data-js="1"` is set in the preview.
  3. The form's `action` is `/api/public/forms/submit`, it has a hidden `wg_kind` field and a honeypot input, and `topic` is kept.
  4. The uploaded `sitemap.xml`, `robots.txt`, canonical and JSON-LD are unchanged.
- [ ] **Step 4:** Publish the test project and submit the form from a real browser. Expected: a lead appears under Manage › Leads, the notification email arrives, and the page shows the platform's success message.
- [ ] **Step 5: Domain check (with the user or Joey; read-only).** Ask them for the production `SITES_BASE_DOMAIN` value, and read `backend/app/services/site_lookup.py` and `routers/internal.py` (`ask`) to confirm whether apex `webgnr.com` can be attached as a custom domain.
- [ ] **Step 6: Write `docs/spike-result.md` in the new repo** (created in Task 1) with pass or fail per item. **Gate:** if items 1, 3 or 5 fail, stop and tell the user. The spec's fallback (separate static host plus a form backend) needs its own design before Task 9.

### Task 1: Repo scaffold, tokens, layout and build checks

**Files:**
- Create: `package.json`, `astro.config.mjs` (`output: 'static'`, `site: 'https://webgnr.com'`, `trailingSlash: 'always'`, `build.format: 'directory'`), `src/styles/tokens.css`, `src/styles/base.css`, `src/layouts/Base.astro`, `src/components/Nav.astro`, `src/components/Footer.astro`, `src/components/Logo.astro`, `scripts/check-placeholders.mjs`, `tests/build/helpers.js`, `tests/build/layout.test.js`, `tests/scripts/check-placeholders.test.js`, `README.md`, `docs/spec.md` (copy of the spec)
- Scripts in `package.json`: `build` (`astro build && pagefind --site dist && node scripts/check-placeholders.mjs dist`), `build:preview` (same but `--allow-placeholders`), `test` (`vitest run`), `test:build` (`npm run build:preview && vitest run tests/build`)

**Interfaces:**
- Produces: `Base.astro` props `{ title: string, description: string, path: string }`, rendering `<head>` (title, description, canonical `https://webgnr.com{path}`, Open Graph tags, font CSS, `base.css`), then `<Nav current={path}/>`, `<main><slot/></main>`, `<Footer/>`.
- Produces: `Nav` links in this order: Product `/features/`, Docs `/docs/`, Company `/company/`, plus Sign in `https://app.website-generator.nl/login` [CONFIRM URL] and the CTA "Build my site". The current page gets `aria-current="page"`.
- Produces: `Footer` with columns Product (Features, Sign in), Learn (Docs), Company (About, Contact, Email from us? → `/email/`), Legal (Privacy `/privacy/`, Terms `/terms/`, Cookies `/cookies/`), plus a line with `[LEGAL ENTITY NAME]`, `[POSTAL ADDRESS]` and `[SUPPORT EMAIL]`.
- Produces: `tests/build/helpers.js` with `loadPage(route: string): Document` (reads `dist{route}index.html`, parses it with `linkedom`) and `allRoutes(): string[]` (every `index.html` under `dist`).
- Produces: `scripts/check-placeholders.mjs` exporting `findPlaceholders(text: string): string[]`. As a CLI it walks `dist/**/*.html`, strips tags, and exits 1 listing `file: token` for each match of `/\[[A-Z]+[\] :]/g` unless `--allow-placeholders` is passed.

- [ ] **Step 1: Write failing tests.**
  - `check-placeholders.test.js`:
    - `findPlaceholders('Price [YOUR PRICE] and [CONFIRM: x] and [N]')` returns 3 tokens.
    - `findPlaceholders('use array[0] and [link](x)')` returns `[]`.
    - The CLI on a temp dir with one placeholder exits 1; with `--allow-placeholders` it exits 0.
  - `layout.test.js` (on a stub `src/pages/index.astro` that uses `Base` with one `<section>`):
    - every route has exactly one `<main>`, and all of its element children are `SECTION`
    - the `<html lang="en">` attribute is set
    - the canonical href equals `https://webgnr.com` + route
    - nav has no element whose text matches `/pricing/i`
    - no `<link>` or `<script>` has an `http(s)` URL to another host (allow only `webgnr.com` and the app domain in `<a>`)
    - no `<iframe>`
    - every `<a>` whose host is not `webgnr.com` has a `rel` containing `noopener`
- [ ] **Step 2: Run** `npm test` and `npm run test:build`. Expected: FAIL.
- [ ] **Step 3: Implement the scaffold.**
  - Tokens and base styles follow the Global Constraints; fonts are imported from the two `@fontsource-variable` packages.
  - Nav: sticky, wraps at phone width, and its links are at least 44px high.
  - Logo: a 30px rounded square in `--accent` with a navy three-line stroke icon, plus the "WebGen" wordmark.
- [ ] **Step 4: Run both test commands.** Expected: PASS.
- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: scaffold Astro site with tokens, layout and build checks"
```

### Task 2: Home page

**Files:** Create `src/pages/index.astro`, `src/scripts/audience.js`, `tests/scripts/audience.test.js`, `tests/build/home.test.js`.

**Interfaces:**
- Consumes: `Base`, `Nav`, `Footer` from Task 1.
- Produces: `audience.js` exporting `initAudienceSwitch(root: HTMLElement): void`.
  - It finds `[data-audience-btn="business"|"agency"]` buttons and `[data-audience="business"|"agency"]` blocks.
  - Clicking a button sets `aria-pressed` on both buttons and toggles `hidden` on the blocks.
  - Without JavaScript the HTML ships with agency blocks `hidden` and business `aria-pressed="true"`.
  - The script is loaded with `<script>` in the page.

- [ ] **Step 1: Write failing tests.**
  - `audience.test.js` (jsdom):
    - clicking agency shows the agency blocks, hides the business blocks and sets `aria-pressed` to `true` on agency and `false` on business
    - clicking business restores the initial state
    - keyboard Enter on a focused button works (a native button, so a click is dispatched)
  - `home.test.js` against `/`:
    - the sections appear in this order, by `data-section` attribute: `hero, product, problem, guide, value, plan, audience, stakes, responsible, learn, faq, cta`
    - in the static HTML, agency blocks have `hidden` and the business button has `aria-pressed="true"`
    - the h1 contains "Your website, built for you." and the agency h1 contains "Ship client sites faster."
    - `plan` has exactly 3 steps
    - `stakes` has two lists of 3 items
    - links named "Build my site" appear in the nav, hero and closing CTA; one link "See an example" exists
    - `responsible` links to `/email/`
    - `learn` cards link to `/docs/...` routes that exist in `dist`
- [ ] **Step 2: Run** `npm test` and `npm run test:build`. Expected: FAIL.
- [ ] **Step 3: Implement the page.**
  - Port the Home artboard's copy and structure from the canvas.
  - Proof and StoryBrand lines stay as placeholders: `[PROOF: ...]` and `[CONFIRM: name StoryBrand publicly]`.
  - Section spacing: 88px between sections, 56px above the hero.
- [ ] **Step 4: Run both test commands.** Expected: PASS.
- [ ] **Step 5: Commit** with `feat: home page with StoryBrand sections and audience switch`.

### Task 3: Features page

**Files:** Create `src/pages/features/index.astro` and `tests/build/features.test.js`.

- [ ] **Step 1: Write failing tests.**
  - The page has sections with ids `build`, `leads`, `email`, `search` and `domains`, plus the in-page chip nav linking to each.
  - The closing CTA has "Build my site" and "Read the guides" (→ `/docs/`).
  - The page has no text matching `/pricing|price/i`.
- [ ] **Step 2: Run** the build tests. Expected: FAIL.
- [ ] **Step 3: Implement** from the Features artboard. Product mocks are HTML/CSS blocks as in the canvas; no screenshots yet.
- [ ] **Step 4: Run** the build tests. Expected: PASS.
- [ ] **Step 5: Commit** with `feat: features page`.

### Task 4: Company page with contact form

**Files:** Create `src/pages/company/index.astro` and `tests/build/company.test.js`.

- [ ] **Step 1: Write failing tests.**
  - The page has a `<form method="post">` with no `action`; the import sets it.
  - It contains `input[name=name][required][autocomplete=name]`, `input[type=email][name=email][required]`, `select[name=topic]` with the 4 options from the canvas and `textarea[name=message][required]`.
  - Every field has a `<label>`.
  - A submit `<button type="submit">` reads "Send message".
  - The consent note links to `/privacy/`.
  - Contact cards show `[SUPPORT EMAIL]`, `[ABUSE EMAIL]` and `[POSTAL ADDRESS]`.
  - The abuse card links to `/email/`.
- [ ] **Step 2: Run** the build tests. Expected: FAIL.
- [ ] **Step 3: Implement** from the Company artboard. There's no client-side "sent" state: the platform's injected status message handles it, as the spike confirmed.
- [ ] **Step 4: Run** the build tests. Expected: PASS.
- [ ] **Step 5: Commit** with `feat: company page with about and contact form`.

### Task 5: Email info and legal pages

**Files:** Create `src/pages/email/index.astro`, `src/layouts/Legal.astro` (props `{ title, summary, sections: {id, title, body}[] }`), `src/pages/privacy/index.astro`, `src/pages/terms/index.astro`, `src/pages/cookies/index.astro` and `tests/build/trust.test.js`.

- [ ] **Step 1: Write failing tests.**
  - `/email/`:
    - it has sections `quick, who, why, rules, spam, help` in order
    - `rules` has 4 cards
    - it contains `[ABUSE EMAIL]`
    - it has **no** `<form>` and no `input[type=email]`, so there's no unsubscribe-by-email lookup
  - Each legal page:
    - the h1 equals its title
    - the "On this page" list links match the section ids
    - the draft notice is present
    - the three legal pages link to each other
  - Section headings match the spec: Privacy has 8, Terms 8, Cookies 4, with the titles from the canvas.
- [ ] **Step 2: Run** the build tests. Expected: FAIL.
- [ ] **Step 3: Implement** from the EmailInfo and Privacy artboards. The tabs become three pages linked by a sub-nav that uses `aria-current`.
- [ ] **Step 4: Run** the build tests. Expected: PASS.
- [ ] **Step 5: Commit** with `feat: email info and legal pages`.

### Task 6: Docs layout, search and the first article

**Files:** Create `src/content.config.ts` (collection `docs`: `title`, `description`, `group` enum `getting-started|website|leads|email|domains`, `order: number`, `minutes: number`, `updated: date`), `src/layouts/Docs.astro`, `src/pages/docs/index.astro` (redirects to the first article via a meta refresh plus a link), `src/pages/docs/[...slug].astro`, `src/content/docs/build-your-first-website.mdx`, `src/scripts/docs-search.js`, `tests/scripts/docs-search.test.js` and `tests/build/docs.test.js`.

**Interfaces:**
- Produces: `Docs.astro` renders the top bar (search field, Support → `/company/#contact`, "Open the app"), a sidebar built **only from existing entries** grouped by `group` and sorted by `order`, the article, "On this page" from the headings, previous/next links and a static "Was this helpful?" link to `/company/#contact`.
- Produces: `docs-search.js` exporting `renderResults(container: HTMLElement, query: string, results: {url, title, excerpt}[]): void`.
  - It writes result titles and excerpts with `textContent`. The only exception is Pagefind's excerpt `<mark>` highlighting: rebuild it by splitting on `<mark>` tokens, never with `innerHTML`.
  - When there are no results it shows "No results for “{query}”" via `textContent`.
  - Wire it to Pagefind's JS API (`/pagefind/pagefind.js`) and to Ctrl/Cmd+K focusing the field. Only that one key binding, and only while no input is focused.

- [ ] **Step 1: Write failing tests.**
  - `docs-search.test.js`:
    - `renderResults` with query `<img src=x onerror=alert(1)>` and `[]` leaves no `img` element and shows the query as text
    - an excerpt `foo <mark>bar</mark> <b>x</b>` renders one `mark` element and the `<b>` as literal text
  - `docs.test.js`:
    - `/docs/build-your-first-website/` has an h1, the sidebar link to itself has `aria-current="page"`, every sidebar `href` resolves to a built route, and the "On this page" links match the h2 ids
    - the article contains the app labels "New website", "Publish" and "AI assistant"
    - `dist/pagefind/pagefind.js` exists
- [ ] **Step 2: Run** `npm test` and `npm run test:build`. Expected: FAIL.
- [ ] **Step 3: Implement.**
  - Port the canvas article.
  - The step about publishing needing a subscription stays `[CONFIRM: ...]` until checked.
- [ ] **Step 4: Run both test commands.** Expected: PASS.
- [ ] **Step 5: Commit** with `feat: docs layout, search and first tutorial`.

### Task 7: Remaining seven articles, 404, SEO files

**Files:** Create `src/content/docs/*.mdx` for the 7 remaining articles in the spec's list, `src/pages/404.astro`, `public/robots.txt` (allow all; `Sitemap: https://webgnr.com/sitemap-index.xml`), add `@astrojs/sitemap`, and create `src/components/OrgJsonLd.astro` (an `Organization` with `name: "WebGen"`, `url: "https://webgnr.com/"`, `email: "[SUPPORT EMAIL]"`, `address` placeholder, placed in `Base` on `/` only). Tests: `tests/build/seo.test.js`.

- [ ] **Step 1: Write failing tests.**
  - All 8 articles are built.
  - `/404.html` exists with the nav and a link to `/` and `/docs/`.
  - `robots.txt` names the sitemap.
  - The sitemap lists every route except `/404`.
  - `/` has exactly one `application/ld+json` that parses to `@type: Organization` with `name: "WebGen"`.
  - No route lacks a description meta.
- [ ] **Step 2: Run** the build tests. Expected: FAIL.
- [ ] **Step 3: Write each article by following it in the real app** (local or staging), using the exact UI labels. Anything you couldn't verify becomes `[CONFIRM: ...]`. Then implement the 404 and SEO files.
- [ ] **Step 4: Run** the build tests. Expected: PASS.
- [ ] **Step 5: Commit** with `feat: seven tutorials, 404 page, sitemap, robots and JSON-LD`.

### Task 8: Quality gates and packaging

**Files:** Create `.htmlvalidate.json`, `scripts/a11y.mjs` (runs axe-core over every built page in jsdom and exits 1 on any violation of `serious` or `critical` impact), `lighthouserc.json` (assert performance, accessibility and SEO of at least 0.9 for `/`, `/docs/build-your-first-website/` and `/email/`), `scripts/package-zip.mjs` (zips `dist/` to `webgen-site-<git short sha>.zip`, refusing if the placeholder check fails) and `tests/scripts/package-zip.test.js`. Add `npm run check` = `build:preview && html-validate dist && node scripts/a11y.mjs && lhci autorun`.

- [ ] **Step 1: Write failing tests.**
  - `package-zip` refuses when `dist` contains a placeholder and succeeds on a clean temp `dist`, with a zip whose root holds `index.html`.
  - New `tests/build/links.test.js`: every internal `href` on every built page (path, plus `#id` fragment where present) resolves to a built route and an existing element id.
- [ ] **Step 2: Run** `npm test`. Expected: FAIL.
- [ ] **Step 3: Implement the scripts, run `npm run check`, and fix every finding in the page code.** Do not loosen thresholds.
- [ ] **Step 4: Run** `npm test` and `npm run check`. Expected: all pass.
- [ ] **Step 5: Commit** with `chore: html, accessibility and lighthouse gates; zip packaging`.

### Task 9: Launch on webgnr.com (only with the user's go-ahead)

- [ ] **Step 1:** List every remaining placeholder (`node scripts/check-placeholders.mjs dist`) and send the list to the user. The list also includes three values the text check can't see because they sit in link targets:
  - the "See an example" link (still `#example`)
  - the app's register URL
  - the app's login URL

  **Stop until each is answered.** No production upload with placeholders.
- [ ] **Step 2:** Run the `security-review` skill on the full repo diff. Fix confident findings.
- [ ] **Step 3:** Confirm with the user that the `support@`, `abuse@` and `privacy@` mailboxes exist and are monitored.
- [ ] **Step 4:** `npm run build && node scripts/package-zip.mjs`. The user, or Claude with their go-ahead, imports the zip into the MYB-owned project and attaches `webgnr.com` (and `www`, redirecting to the apex). DNS changes are made by the user.
- [ ] **Step 5: Live browser check** in the Claude Browser tool on `https://webgnr.com`, at desktop and 390×844. Expected for each:
  - **Transport:** valid HTTPS on the apex and on `www`.
  - **Navigation:** every navigation and footer link resolves; a deep link to `/nope/` shows the 404 page.
  - **Interactive parts:**
    - the audience switch works, including with the keyboard
    - FAQ items open
    - docs search handles a real term, a no-result term and `<script>`
  - **Contact form:**
    - a valid submit shows the success message and arrives as a lead and an email
    - empty fields and a bad email give the platform's errors
    - a double click and a fast second submit are absorbed by the platform's guard
  - **Privacy:** the cookie banner behaves correctly; `read_network_requests` shows no requests to other hosts.
  - **Hygiene:** no console errors.
- [ ] **Step 6:** Report the results to the user with screenshots. Note anything that couldn't be checked.
