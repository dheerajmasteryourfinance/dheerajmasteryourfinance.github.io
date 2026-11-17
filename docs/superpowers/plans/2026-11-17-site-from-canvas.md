# WebGen site v2: build the canvas design in code — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring the Astro site in this repo up to the approved design canvas (version 84): new Home story, Features, Examples + example detail, Docs, Early Access, Company, Email info, legal and 404 pages, in English (`/`) and Dutch (`/nl/`).

**Architecture:** Keep the existing pattern: thin route files under `src/pages/` (English) and `src/pages/nl/` (Dutch) that render one page component from `src/components/pages/`, with all copy in `{ en, nl }` dictionaries under `src/i18n/` read through `pick()`. Shared visual pieces (motion, route, cards) become small components; colours and fonts stay in `src/styles/tokens.css`. No framework JS; three tiny progressive-enhancement scripts (example filter, docs scroll-spy, sticky-CTA reveal fallback).

**Tech Stack:** Astro 7.4, vitest 5 + linkedom build tests, Pagefind, html-validate, axe-core, Lighthouse CI (all already in `package.json`).

**Spec:** `docs/spec.md` (structure, gates, security pass) + the design canvas, copied verbatim to `docs/design/canvas-v84/*.dc.html` (the visual and copy source of truth; open the matching `.dc.html` for each page — its inline styles carry exact sizes, spacing and copy). Where they disagree, the canvas wins; the decisions below record what changed since the spec.

## Global Constraints

- Locales: English at `/`, Dutch at `/nl/`, same slugs; every page has both; language switch maps to the same page in the other locale (helpers in `src/i18n/index.ts`).
- Canonical site constant: `SITE = 'https://website-generator.nl'` in `src/i18n/index.ts` (was webgnr.com; webgnr.com stays the sending domain, out of scope here). [CONFIRM with Dheeraj before launch]
- Colours (tokens.css): `--ink #0F1E3D`, `--link #1D4ED8`, `--link-hover #1E3A8A`, `--accent #40E0F5`, `--accent-hover #90F0FB`, `--accent-deep #1EC0DC`, `--surface #F4F7FB`, `--line #E3E8F0`, `--muted #55607A`. No `#FFC93C` or other yellow anywhere in `src/`.
- Fonts: Bricolage Grotesque (headings) + DM Sans (body) via the existing `@fontsource-variable` packages. Heading letter-spacing as in the canvas (−0.02 to −0.04em; never tighter than −0.04em except the 404 numeral at −0.05em).
- Text on accent fills is `--ink`. Body text contrast ≥ 4.5:1; touch targets ≥ 44px.
- Company facts (one source, `src/lib/company.ts`): Schenk Rekenmeesters · KvK 55633323 · BTW/VAT NL001579296B13 · Steijnstraat 18, 2987 AS Ridderkerk. [CONFIRM: this is the entity behind WebGen]
- Copy rules: no invented numbers, quotes, ratings or claims; anything not confirmed stays a bracketed placeholder (`[CONFIRM: …]` EN, `[BEVESTIG: …]` NL) so `scripts/check-placeholders.mjs` blocks `npm run build` until resolved. No pricing. No real client sites or names without written permission (only the four test sites + GreenLeaf).
- Motion: every animation is disabled under `prefers-reduced-motion: reduce`; content is never hidden when scroll-driven animation is unsupported (start visible, animate only inside `@supports (animation-timeline: view())`).
- Responsive: no horizontal scroll at 320–1440px (`html, body { overflow-x: clip }` plus contained decorations); under 640px headings use `h1 clamp(34px,10.5vw,46px)`, `h2 clamp(26px,7.5vw,34px)`; under 900px the header collapses to the menu panel.
- Forms keep field names `name`, `email`, `message` (the app's ZIP import wires them) and work without JS.

## Review Focus

1. Long Dutch words in headings, chips and cards (e.g. "Warmtepompinstallateur", "Nieuwsbrieven") on a 320px screen must wrap, not overflow — test in Task 2 (`overflow-wrap` rules) and Task 7 (card markup).
2. JavaScript disabled: the example filter shows all cards, the docs contents list still links to every heading, the sticky CTA is visible — tests in Tasks 7 and 8 assert the no-JS markup state.
3. Language switch on deep pages (each tutorial, the GreenLeaf detail page, the 404) must point to the same page in the other language — test in Task 3.
4. Older browsers without scroll-driven animations must still show every section (no `opacity:0` outside `@supports`) — test in Task 2.
5. The early-access and contact forms submitted twice or with empty fields must not break the page — required attributes + `type="email"` asserted in Task 9.

---

### Task 1: Adopt the in-progress Dutch work as the baseline

The working tree holds uncommitted i18n work (`src/i18n/`, `src/pages/nl/`, `src/components/pages/`, `LangSwitch.astro`, test edits) and new assets (`src/assets/examples/`, `docs/design/canvas-v84/`).

**Files:** Modify: `src/i18n/index.ts` (SITE), `tests/build/i18n.test.js` (SITE constant). Commit everything listed above.

- [ ] **Step 1:** Run `npm run test:build`. Record failures. Expected: only failures caused by pages not yet ported to `/nl/`.
- [ ] **Step 2:** Set `SITE = 'https://website-generator.nl'` in `src/i18n/index.ts` and in `tests/build/i18n.test.js`; update any other test that hard-codes `webgnr.com` as the canonical origin (grep `webgnr.com` under `tests/`; leave email-sender references alone).
- [ ] **Step 3:** Run `npm run test:build`. Expected: the same failures as Step 1 minus the SITE ones; list the remaining ones in the commit message as "ported in later tasks".
- [ ] **Step 4:** Commit: `git add -A && git commit -m "chore: adopt Dutch routing baseline, canvas v84 reference, example screenshots"`.

### Task 2: Tokens, base styles and motion primitives

**Files:**
- Modify: `src/styles/tokens.css`, `src/styles/base.css`
- Create: `src/styles/motion.css`, `src/scripts/reveal.ts`, `src/components/motion/Blobs.astro`, `src/components/motion/FloatingChips.astro`, `src/components/motion/Marquee.astro`, `src/components/StickyCta.astro`
- Test: `tests/build/design-system.test.js`, `tests/lib/reveal.test.js`

**Interfaces:**
- Produces: CSS classes `.rv` (reveal on scroll), `.lift` (hover lift), `.zoom`, `.pulse`, `.blob`, `.fchip`, `.drift`, `.drift2`, `.marq`, `.marq-track`.
- `<Blobs variant="hero" | "card" | "article" />` — two absolutely positioned decorative shapes, `aria-hidden="true"`, parent must be `position:relative; isolation:isolate`.
- `<FloatingChips locale={Locale} placement="right" | "around-shot" />` — three cards ("New form entry", "Email sent", "Site published" / "Formulier ontvangen", "E-mail verzonden", "Site gepubliceerd"), hidden under 900px.
- `<Marquee items={string[]} />` — duplicated track, `aria-hidden="true"`, pauses on hover.
- `<StickyCta locale={Locale} />` — "Be among the first to build with WebGen" + early-access link (NL copy from `docs/design/canvas-v84/MainNL.dc.html`).
- Scroll reveal (the canvas's `/* reveal */` block): sections with `.rv` fade in, rise 28px and un-blur 3px; cards, steps, FAQ items, figures and tutorial sections (`.lift, .stopcard, details, figure, .tsec, main section`) reveal on their own as each enters, which staggers grids naturally. Easing `cubic-bezier(.2,.7,.2,1)`. Reveal moves with the `translate` property (never `transform`), so card hover lifts keep working.
- `reveal.ts` exports `initReveal(root: Document = document): () => void` — for browsers without `animation-timeline: view()` (Safari, Firefox): adds `js-reveal` to `<html>`, observes the reveal targets with one `IntersectionObserver` (threshold 0.12, rootMargin `0px 0px -8% 0px`), adds `is-visible` once and unobserves. It does nothing when scroll-driven animation is supported or `prefers-reduced-motion: reduce` matches. Loaded once from `Base.astro` as a module script.

- [ ] **Step 1: Write failing tests** in `tests/build/design-system.test.js`:
  - `tokens.css` contains `--accent: #40E0F5`, `--accent-hover: #90F0FB`, `--accent-deep: #1EC0DC`.
  - No file under `src/` (excluding `src/assets`) contains `#FFC93C`, `#F5BB22` or `rgba(255, 201, 60` (case-insensitive).
  - In every built CSS file in `dist/_astro/`, each rule that sets `opacity:0` or `transform:translateY(` for `.rv` sits inside an `@supports (animation-timeline` block (Review Focus 4).
  - Built CSS contains a `prefers-reduced-motion: reduce` block that sets `animation:none` for `.rv`, `.blob`, `.marq-track`, `.pulse`, `.drift`, `.drift2`.
  - Built CSS contains `overflow-x:clip` on `html,body` and `overflow-wrap:break-word` (or `anywhere`) for `h1`, `h2`, `h3` (Review Focus 1).
  - The JS fallback's hidden state is scoped: any rule giving `.rv` or `.lift` `opacity:0` outside `@supports (animation-timeline` is prefixed `.js-reveal` and has a matching `.is-visible` rule restoring `opacity:1` (no-JS visitors always see content).
  - No reveal keyframe animates `transform` (only `opacity`, `translate`, `filter`).
  - `tests/lib/reveal.test.js` (jsdom, mocked `IntersectionObserver` and `matchMedia`): without scroll-timeline support, targets get `is-visible` when the observer fires and are unobserved; with reduced motion, nothing is hidden and no observer is created; with `CSS.supports('animation-timeline','view()')` true, `initReveal` returns without adding `js-reveal`.
- [ ] **Step 2:** Run `npm run test:build -- tests/build/design-system.test.js` and `npx vitest run tests/lib/reveal.test.js`. Expected: both FAIL.
- [ ] **Step 3: Implement.** Token values from Global Constraints; `--accent-hover` replaces the old hover; gradients from the canvas (`linear-gradient(135deg,#90F0FB 0%,#40E0F5 55%,#1EC0DC 100%)` for accent buttons; navy panel radial glows with `rgba(64,224,245,.20)`; page wash `linear-gradient(180deg,#EAF1FF 0,#FFFFFF 760px)`). Motion keyframes, timings and the reduced-motion block copied from the `<helmet>` of `docs/design/canvas-v84/Main.dc.html`; the mobile heading clamp from its `/* resp-fix */` block. Import `motion.css` in `src/layouts/Base.astro`.
- [ ] **Step 4:** Run the test file again. Expected: PASS. Run `npm test` (unit) — PASS.
- [ ] **Step 5:** Commit: `feat: aqua accent tokens, motion primitives, responsive base rules`.

### Task 3: Header, mobile menu panel, language switch, footer

**Files:**
- Modify: `src/components/Nav.astro`, `src/components/Footer.astro`, `src/components/LangSwitch.astro`
- Create: `src/lib/company.ts`
- Test: `tests/build/header-footer.test.js`

**Interfaces:**
- Produces: `COMPANY` from `src/lib/company.ts`: `{ legalName: string; kvk: string; vat: string; street: string; postcode: string; city: string; country: Record<Locale,string> }` (values in Global Constraints; country `{ en: 'the Netherlands', nl: 'Nederland' }`).
- Nav markup contract (used by Task 8's docs header): `<label class="burger"><input type="checkbox" id="navtoggle" class="navchk" aria-label="Open menu|Menu openen">…</label>`, `<label class="navback" for="navtoggle">`, `<div class="navpanel">` holding `.navhead`, `nav.navlinks`, `.navactions`.

- [ ] **Step 1: Write failing tests:**
  - Every page (`allRoutes()`) has exactly one `#navtoggle` with a non-empty `aria-label`, and `.navpanel` contains links to Features, Examples, Docs, Company in the page's locale (`/features/` vs `/nl/features/` etc.).
  - The language switch link on every route points to `counterpart(route)`; on `/404.html` it points to `/nl/` ↔ `/` (Review Focus 3). Include every `/docs/<slug>/` and `/examples/greenleaf-bakery/`.
  - Footer on every page contains `Schenk Rekenmeesters`, `55633323`, `NL001579296B13`; Dutch pages say `KvK` and `BTW`, English pages say `KvK` and `VAT`.
  - Footer has the trust row: three items (EN "Verified senders", "One-click unsubscribe", "Data stored in [EU REGION]"; NL "Geverifieerde afzenders", "Makkelijk uitschrijven", "Gegevens opgeslagen in [EU-REGIO]").
- [ ] **Step 2:** Run it. Expected: FAIL.
- [ ] **Step 3: Implement.** Panel behaviour, sizes and the docs variant follow `docs/design/canvas-v84/Main.dc.html` (`/* responsive navigation */` block) — slide-in from the right at ≤900px, 360px max width, backdrop closes it, `:root:has(.navchk:checked)` drives open state, reduced motion removes transitions. Footer reads `COMPANY`.
- [ ] **Step 4:** Run it. Expected: PASS.
- [ ] **Step 5:** Commit: `feat: mobile menu panel, locale-aware switch, company facts in footer`.

### Task 4: Shared content pieces — examples data, route, trust cards

**Files:**
- Create: `src/lib/examples.ts`, `src/components/Route.astro`, `src/components/ExampleCard.astro`, `src/components/TrustCards.astro`
- Test: `tests/lib/examples.test.js`

**Interfaces:**
- `type TradeKey = 'bakery' | 'restaurant' | 'coach' | 'agency' | 'local'`
- `type ExampleSite = { id: 'greenleaf' | 'tea' | 'garden' | 'heatpump' | 'physio'; name: string; trade: Record<Locale,string>; tradeKey: TradeKey; langs: ('en'|'nl'|'fr'|'de')[]; headline: string; image: ImageMetadata; alt: Record<Locale,string> }`
- `export const EXAMPLES: ExampleSite[]` — values from `docs/design/canvas-v84/Examples.dc.html`: Blad & Bloesem (tea shop, `local`, nl+en, `ex-tea.jpg`), De Groene Hand (garden care, `local`, nl, `ex-garden.jpg`), Warmtewijs (installer, `local`, nl, `ex-heatpump.jpg`), Beweegpunt (physiotherapy, `local`, nl, `ex-physio.jpg`), GreenLeaf Bakery (`bakery`, nl+fr+de, `src/assets/screens/site-desktop.png`).
- `<Route stops={{ label: string; href?: string }[]} mode="scroll" | "load" ariaLabel={string} />` — the dotted SVG route from the canvas (base path + `pathLength="1"` draw path, numbered pins, start pin, flag); stops with `href` render as `<a>`; hidden under 760px (the caller supplies the fallback).
- `<ExampleCard site={ExampleSite} locale={Locale} size="grid" | "strip" />` — renders `data-trade={tradeKey}` and `data-langs="nl en"` for the filter.
- `<TrustCards locale={Locale} />` — "Why WebGen" / "Waarom WebGen" block, three cards, copy from `MainNL.dc.html` / `Main.dc.html` `<!-- DUTCH TRUST -->`.

- [ ] **Step 1: Write failing tests** (`tests/lib/examples.test.js`): `EXAMPLES` has 5 entries with unique ids; every entry has non-empty `alt.en` and `alt.nl`; no `name` contains "TEST"; every `tradeKey` is one of the five keys; `greenleaf.langs` equals `['nl','fr','de']`.
- [ ] **Step 2:** Run `npx vitest run tests/lib/examples.test.js`. Expected: FAIL.
- [ ] **Step 3: Implement** the data file and the three components (markup and styles from the canvas sections named above; images through Astro `<Image>` with `widths={[480, 960]}`).
- [ ] **Step 4:** Run it. Expected: PASS.
- [ ] **Step 5:** Commit: `feat: example sites data, route, example card and trust cards`.

### Task 5: Home page (new story)

**Files:** Modify: `src/components/pages/HomePage.astro`, `src/i18n/home.ts`. Test: `tests/build/home.test.js` (rewrite).

**Interfaces:** Consumes Tasks 2–4 components.

- [ ] **Step 1: Write failing tests** for `/` and `/nl/`:
  - `[data-section]` order is exactly `hero, shot, problem, guide, how, get, proof, trust, faq, cta`.
  - `h1` text: EN "Get found. Get signed up. Follow up." / NL "Word gevonden. Krijg aanmeldingen. Volg op."; the last phrase is wrapped in `<mark>` (styled as the aqua underline).
  - Audience switch: two buttons with `aria-pressed`, agency headline present in the DOM (EN "Ship client sites faster. Send email as the client.") and hidden with the `hidden` attribute until chosen.
  - `how` contains a `Route` with 3 stops labelled Check, Route, Launch (NL: Check, Route, Lancering) and three stop cards.
  - `get` has three groups (Get found / Get signed up / Follow up) and the bullet "Your site in up to 8 languages" / "Je site in maximaal 8 talen".
  - `proof` has the GreenLeaf card plus 4 `ExampleCard size="strip"` linking to the examples page in the same locale.
  - `faq` has exactly 4 `<details>`; `cta` contains "Every day without a site that works" / "Elke dag zonder werkende site".
  - The page ends with one `StickyCta` linking to the early-access page in the same locale; the hero and shot contain `Blobs` and `FloatingChips`.
- [ ] **Step 2:** Run it. Expected: FAIL.
- [ ] **Step 3: Implement** from `docs/design/canvas-v84/Main.dc.html` and `MainNL.dc.html` (copy verbatim; placeholders stay bracketed). Audience switch: two buttons + `src/scripts/audience.ts` (toggle `hidden` and `aria-pressed`); without JS the business version shows.
- [ ] **Step 4:** Run it. Expected: PASS.
- [ ] **Step 5:** Commit: `feat: home page rebuilt on the get found / signed up / follow up story`.

### Task 6: Features page

**Files:** Modify: `src/components/pages/FeaturesPage.astro`, `src/i18n/features.ts`. Test: `tests/build/features.test.js` (extend).

- [ ] **Step 1: Write failing tests** for `/features/` and `/nl/features/`: a `Route` nav with 6 stop links to `#build #leads #email #search #domains #languages` in that order, plus a chip `nav` with the same 6 links for small screens; six rows with those ids; the languages row lists 8 languages by native name (English, Nederlands, Français, Deutsch, 中文, 日本語, Español, Русский) and shows the `lang-translate.png` screenshot with a non-empty `alt`.
- [ ] **Step 2:** Run it. Expected: FAIL.
- [ ] **Step 3: Implement** from `docs/design/canvas-v84/Features.dc.html` / `FeaturesNL.dc.html`; `Route mode="load"`.
- [ ] **Step 4:** Run it. Expected: PASS.
- [ ] **Step 5:** Commit: `feat: features page with route menu and languages row`.

### Task 7: Examples page and GreenLeaf detail page

**Files:**
- Create: `src/components/pages/ExamplesPage.astro`, `src/components/pages/ExampleDetailPage.astro`, `src/i18n/examples.ts`, `src/pages/examples/index.astro`, `src/pages/examples/greenleaf-bakery.astro`, `src/pages/nl/examples/index.astro`, `src/pages/nl/examples/greenleaf-bakery.astro`, `src/scripts/example-filter.ts`
- Test: `tests/build/examples.test.js`

**Interfaces:** `example-filter.ts` reads buttons `[data-filter-trade]` / `[data-filter-lang]` (value `all` or a key), sets `aria-pressed`, and sets `hidden` on `.example-grid > [data-trade]` cards that do not match both filters.

- [ ] **Step 1: Write failing tests:**
  - `/examples/` and `/nl/examples/`: trade chips (All + 5) and language chips (All + 8) are `<button>` elements; the grid has 4 cards + the GreenLeaf featured card; no card carries the `hidden` attribute in the built HTML (Review Focus 2); the "More examples on the way" slot is present.
  - Each card heading text wraps: card title elements have class `card-title` and built CSS sets `overflow-wrap:anywhere` on `.card-title` (Review Focus 1).
  - `/examples/greenleaf-bakery/` and NL: sections `hero, preview, made, languages, mobile, result, cta`; `languages` shows 3 cards (Dutch original, French, German) and the 2 how-it-works screenshots (`lang-menu.png`, `lang-translate.png`), each image with non-empty `alt`.
  - Main nav "Examples" link marks `aria-current="page"` on both pages.
- [ ] **Step 2:** Run it. Expected: FAIL.
- [ ] **Step 3: Implement** from `docs/design/canvas-v84/Examples*.dc.html` and `ExampleGreenleaf*.dc.html`; add a unit test `tests/lib/example-filter.test.js` (jsdom) for: choosing "Local services" hides GreenLeaf; choosing "Français" hides the four Dutch-only cards; "All" restores all.
- [ ] **Step 4:** Run both test files. Expected: PASS.
- [ ] **Step 5:** Commit: `feat: examples page with working filters and GreenLeaf detail page`.

### Task 8: Docs landing, tutorial layout, scroll-spy contents

**Files:**
- Modify: `src/layouts/Docs.astro`, `src/pages/docs/index.astro`, `src/pages/docs/[...slug].astro`, Dutch counterparts under `src/pages/nl/docs/`, `src/lib/docs.ts`
- Create: `src/scripts/toc-spy.ts`
- Test: `tests/build/docs.test.js` (extend), `tests/lib/toc-spy.test.js`

**Interfaces:** `toc-spy.ts` exports `initTocSpy(root: Document = document): () => void` — observes every `main h2[id]`, sets `aria-current="true"` on the matching `.toc a[href="#id"]` (the last heading whose top is above 30% of the viewport), returns a cleanup function. No-op when `.toc` is absent.

- [ ] **Step 1: Write failing tests:**
  - Each tutorial (EN + NL, 16 pages): left guide list and right "On this page" list are `position: sticky` in built CSS; every `.toc a` href matches an `h2[id]` in `main` (Review Focus 2); the docs header has the menu panel from Task 3 whose guide list marks the current tutorial with `aria-current="page"`; the search label has class `docsearch` and is hidden under 900px in built CSS.
  - Docs landing (EN + NL): example-search chips ("Connect a domain", "Send a newsletter", "Unsubscribe", "Forms" / NL equivalents) link to the right tutorials; "Start in 3 steps" links to build, domain, campaign tutorials.
  - `toc-spy.test.js` (jsdom with mocked `getBoundingClientRect`): heading 2 above the line → only the second link has `aria-current`; cleanup removes the listener.
- [ ] **Step 2:** Run them. Expected: FAIL.
- [ ] **Step 3: Implement** from `docs/design/canvas-v84/Docs*.dc.html` and `DocsHome*.dc.html`. Scroll-spy runs on `scroll` with `requestAnimationFrame` throttling (the canvas's CSS-only `view-timeline` version is not needed in code).
- [ ] **Step 4:** Run them. Expected: PASS.
- [ ] **Step 5:** Commit: `feat: docs landing, sticky sidebars, scroll-spy contents, docs menu panel`.

### Task 9: Early Access, Company, Email info, legal pages, 404

**Files:** Modify: `src/pages/early-access/index.astro`, `src/pages/company/index.astro`, `src/pages/email/index.astro`, `src/layouts/Legal.astro`, `src/pages/404.astro`, plus Dutch counterparts (create the missing `src/pages/nl/{early-access,company,email}/index.astro` via page components `EarlyAccessPage.astro`, `CompanyPage.astro`, `EmailInfoPage.astro` and dictionaries in `src/i18n/`). Test: extend `early-access.test.js`, `company.test.js`, `trust.test.js`; create `tests/build/notfound.test.js`.

- [ ] **Step 1: Write failing tests:**
  - Early Access (EN + NL): form fields `name` (required), `email` (required, `type="email"`), `message`; submit is a single `<button type="submit">` (Review Focus 5); examples strip (4 `ExampleCard`), `TrustCards`, FAQ has 5 `<details>` including "Does WebGen work in Dutch?" / "Werkt WebGen in het Nederlands?" and "Where is my data stored?" / "Waar worden mijn gegevens opgeslagen?".
  - Company (EN + NL): facts grid shows `COMPANY.legalName`, "KvK 55633323 · VAT NL001579296B13" (NL: "KvK 55633323 · BTW NL001579296B13"), "Ridderkerk"; address line `Steijnstraat 18, 2987 AS Ridderkerk`; examples strip and `TrustCards` sit before `#contact`; contact form fields as above.
  - Email info, privacy, terms, cookies (EN + NL): `Blobs` present inside a `position:relative` header; legal "Sections" list is sticky in built CSS.
  - 404: the numeral element has class `big404` and built CSS scales it with `vw` under 640px.
- [ ] **Step 2:** Run them. Expected: FAIL.
- [ ] **Step 3: Implement** from the matching `docs/design/canvas-v84/*.dc.html` files, including each page's motion (Blobs, FloatingChips where the canvas has them, Marquee, pulse on the main button); support/abuse/privacy mailboxes, phone, hours, reply time and hosting region stay bracketed placeholders.
- [ ] **Step 4:** Run them. Expected: PASS.
- [ ] **Step 5:** Commit: `feat: early access, company, email info, legal and 404 to canvas v84`.

### Task 10: Gates and cross-page checks

**Files:** Modify: `scripts/check.mjs` (add a no-horizontal-scroll gate), `lighthouserc.json` (add `/nl/`, `/examples/`, one tutorial). Create: `scripts/overflow.mjs`.

**Interfaces:** `scripts/overflow.mjs <distDir>` — add `puppeteer-core` (exact version pinned) as a devDependency and drive the Chrome that `chrome-launcher` (already pulled in by `@lhci/cli`) finds, to load every built page at 320, 390, 768 and 1024px widths and fail if `document.documentElement.scrollWidth > innerWidth + 1`, printing the route, width and the widest offending element's tag and text.

- [ ] **Step 1:** Write `tests/scripts/overflow.test.js` that runs `overflow.mjs` against a fixture dist folder with one page that overflows (expects exit code 1 and the route in stdout) and one that does not (exit 0).
- [ ] **Step 2:** Run it. Expected: FAIL.
- [ ] **Step 3:** Implement `overflow.mjs`; add it to `check.mjs` as the gate `"overflow"`.
- [ ] **Step 4:** Run `npm run check`. Expected: html-validate, axe, lhci and overflow all PASS (placeholders allowed in preview build). Fix any failures in the owning page component.
- [ ] **Step 5:** Manual click-through in a browser at 390px and 1280px, both languages: menu panel open/close, language switch on a tutorial, example filters, scroll-spy, forms submit without JS (disable JS in devtools). Note results in the commit message.
- [ ] **Step 6:** Commit: `chore: overflow gate, wider lighthouse coverage, click-through notes`.

---

## Out of scope (separate work)

- The webgnr.com sending-domain trust page and DNS.
- Hosting/ZIP-import spike results and launch (Task 9 of `docs/plan.md`).
- Replacing placeholders with real facts (needs Joel).
- The generator's own spacing fix (WebGeneratorV2 prompts).
