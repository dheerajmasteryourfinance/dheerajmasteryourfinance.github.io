# WebGen marketing site

Static Astro site for WebGen at https://webgnr.com. Spec: `docs/spec.md`.

## Commands

- `npm run dev` - local dev server
- `npm run build` - production build: Astro, Pagefind index, then the placeholder check
- `npm run build:preview` - same, but allows placeholders (use while copy is unfinished)
- `npm test` - unit tests (build tests join only if `dist/` exists)
- `npm run test:build` - build a preview, then run the tests on the built HTML

## Placeholders and the build

Unfinished copy uses uppercase bracket tokens such as `[LEGAL ENTITY NAME]`, `[POSTAL ADDRESS]`
and `[SUPPORT EMAIL]`. `npm run build` is expected to FAIL while any remain in page text; that is
correct behaviour, so a placeholder can never ship. `npm run build:preview` must pass.

## Rules

No pricing, no third-party requests (fonts are self-hosted via @fontsource-variable), exact
pinned dependency versions, design tokens only in `src/styles/tokens.css`.
