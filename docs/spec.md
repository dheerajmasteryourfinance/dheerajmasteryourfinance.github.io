# WebGen public site (webgnr.com): design

Status: DRAFT for review. Replaces `2026-11-11-marketing-site-design.md` (superseded: that one built a page inside the app).
Approved visual design: https://claude.ai/artifact/JAy7N7uR3Qvtra9nr87GLm (6 pages after removing Pricing, navy and sunflower palette, StoryBrand Home).

## Goal

An independent, SaaS-style public website for the website generator. It has two jobs:

1. **Make the sending domain look genuine.** Mail providers, spam filters, Amazon's SES review and recipients who click a link in an email should find a real company: product pages, docs, an address, support and abuse contacts, policies, and a page explaining why someone got an email.
2. **Be the product's information and learning hub.** Features, pricing, and tutorials for using the generator.

Success means:
- Every page that a mail provider or recipient may check is live at a stable URL on webgnr.com with valid HTTPS.
- A recipient can find out who emailed them and how to unsubscribe within one click from the home page.
- A new user can build and publish their first site from the docs alone.

## Why webgnr.com

`webgnr.com` is the platform's fallback From domain (`backend/app/services/senders.py`, `_PLATFORM_DOMAINS`), and it appears in email tracking links (`utm_source=webgnr`). `docs/GO_LIVE_PLAN.md` §4 lists "fix or remove the webgnr.com broken SSL" as a go-live item. Putting the public site on the apex domain fixes the broken HTTPS and gives the sending domain a real website in one step.

## Pages (v1)

| Page | Path | Notes |
|---|---|---|
| Home | `/` | StoryBrand order: hero with business/agency switch, product shot, problem, guide, value stack, 3-step plan, audience block, stakes and success, responsible email, guides, FAQ, CTA |
| Features | `/features` | Five areas: build, forms and audience, email, search and analytics, domains and senders |
| Docs | `/docs/...` | Sidebar, search, article layout, "on this page" contents |
| Company | `/company` | About, values, contact form, support / abuse / postal contacts |
| Email info | `/email` | For recipients: who sent it, why, one-click unsubscribe, sender rules, report abuse |
| Legal | `/privacy`, `/terms`, `/cookies` | Separate URLs (the mockup's tabs become three pages, so each policy has a stable link) |

Not in v1: pricing (no Pricing page, no pricing links or buttons anywhere; decided 2026-11-11), blog, changelog.

Decided 2026-11-11: the public product name is **WebGen** for now, and the site lives on **webgnr.com**.

### Docs set for v1

Eight articles, each written against the real app's labels and checked by clicking through the app:

1. Build your first website
2. Import an existing site
3. A tour of the editor
4. Forms and leads
5. Set up your sender
6. Send a campaign
7. Follow-up emails
8. Connect your domain

The other sidebar entries in the mockup ship later. The sidebar shows only published articles, never dead links.

## Architecture

### Recommended: a static site, hosted by WebGen itself

- **Source** lives in its own repository (the site is independent of the app). [User creates the repo; suggested name `webgen-site`.]
- **Built with Astro** as a fully static site: plain HTML and CSS output, docs written in Markdown/MDX, no client framework. The three interactive bits (audience switch, FAQ, docs search) are small vanilla scripts. FAQ uses native `<details>`.
- **Docs search** uses Pagefind, which builds a static index at build time. There is no search server.
- **Hosting:** the build output is zipped and uploaded through the app's existing **Import an existing site** flow into a WebGen project owned by the MYB account. webgnr.com is then attached as that project's custom domain. Caddy's on-demand TLS issues the certificate.
- **Contact form:** follows `docs/ZIP_UPLOAD_CONVENTIONS.md` (`name`, `email`, `<textarea name="message">`). On import the platform rewrites it to post to `/api/public/forms/submit`, adding the honeypot, validation, per-IP rate limit and lead capture that already exist. **No new backend code.**
- **Markup rule:** every page's top-level blocks are direct `<section>` children of `<main>`, so the import tags them deterministically with no AI call.

Why this option:
- **It's proof:** the product's own website runs on the product.
- **Nothing new to run:** no new server, pipeline or form handler.
- **The platform's existing protections apply to the form for free.**

### Alternatives considered

- **Separate static host** (Cloudflare Pages, Netlify) for webgnr.com. It's independent of the app's uptime, but the contact form would need its own backend or a third party, and webgnr.com DNS would leave the VPS. This is the fallback if the spike below fails.
- **A static Caddy site block** for webgnr.com in this repo's `Caddyfile`. It's simple, but it couples the site to app deploys, and the form would have to post cross-origin to the app.

### Spike first (blocks the build)

Before any content work, prove the hosting path with a throwaway two-page Astro build that has one vanilla script, one stylesheet, one font file, a Pagefind index and a contact form:

1. Does ZIP import keep `<script>` files, `.wasm`/`.json` assets (Pagefind) and fonts unchanged?
2. Does it rewrite the contact form, and does a submission arrive as a lead and an email?
3. Can **apex** `webgnr.com` be attached as a custom domain? This needs the production `SITES_BASE_DOMAIN` value checked. If customer sites live at `*.webgnr.com`, the apex may be treated specially by `services/site_lookup.py` or by Caddy's `ask` endpoint.
4. Do the platform's own sitemap, robots and canonical generators respect the uploaded files? The SEO feature's rule is never to overwrite a site's own uploads.

If 1 or 3 fails, switch to the separate static host alternative and write the contact form into that design.

## Design system

From the approved mockup:

- **Colours:**
  - ink and dark sections: navy `#0F1E3D`
  - accent: sunflower `#FFC93C`, for the logo, primary buttons on light and dark, badges and the headline marker
  - links: blue `#1D4ED8` (hover `#1E3A8A`)
  - text: muted `#55607A`, body `#1E293B`
  - lines: `#E3E8F0` / `#CBD3E1`
  - surfaces: `#F4F7FB`, blue tint `#E8F0FE`
  - on dark: `#C8D1E3` / `#DCE3EE`
- **Type:** Bricolage Grotesque for headings, DM Sans for body. Both are self-hosted (`@fontsource`), with no Google Fonts requests.
- **Tokens:** defined once as CSS custom properties, so a later MYB restyle is a token swap.
- **Rules:**
  - Buttons on yellow use navy text.
  - All text meets 4.5:1 contrast (3:1 at 24px and above).
  - Touch targets are at least 44px.
  - Pages work at 390px wide with no horizontal scroll.

## Content rules

- StoryBrand on Home (per `docs/storybrand-webgen-messaging.md`). The main button is "Build my site" everywhere and the transitional button is "See an example". Features leads with outcomes.
- No invented numbers, testimonials or logos. Unknown facts stay as bracketed placeholders, and **the site does not go live while any placeholder remains** (a build check enforces this, see Testing).
- Legal text is written or approved by MYB and its adviser, not generated.
- Docs describe only what the app actually does, using its exact labels (New website, Design, AI assistant, History, Save, Publish, Manage tabs: Leads, Audience, Campaigns, Follow-up emails, Sender, Brand, Domain, Website, Stats).
- Marchlands is never mentioned.

## Security review (pre-code pass, per CLAUDE.md)

- **No new endpoints.** The only input surface is the contact form, which reuses `/api/public/forms/submit`. That route already has per-IP rate limiting (`rate_limit_by_ip("public_forms")`), a honeypot added on import, and server-side validation. The extra `topic` select must not stop the form being recognised, and the spike checks this.
- **No unsubscribe-by-email form** on the Email info page. Anyone could unsubscribe someone else with it, and it would reveal whether an address is on a list. Unsubscribing stays with the signed link in each email.
- **"Was this helpful?"** stays static in v1, or is removed. No endpoint is added for it.
- **Real request path:** the form posts, redirects and shows its status message on the live host. Per CLAUDE.md, test this in a real browser on webgnr.com, not just with a unit test.
- **No third parties at runtime:** fonts are self-hosted, there are no embeds or iframes, and nothing is loaded from a CDN. Analytics only via the platform's existing consent flow.
- **Content hygiene:** docs must not expose admin URLs, internal endpoints, environment names or infrastructure details. External links use `rel="noopener"`.
- **Supply chain:** pin Astro, Pagefind and font package versions and commit the lockfile.
- **Contacts that must really work:** the `support@`, `abuse@` and `privacy@` mailboxes on webgnr.com (or the chosen domain) must exist and be monitored before launch. A dead abuse address does more harm to trust than having none.
- **Deliverability (outside the site, listed so it isn't forgotten):** SPF, DKIM and DMARC for webgnr.com, and the go-live warm-up plan.

## Testing

- **Build-time checks in the site repo:**
  - no broken internal links
  - HTML validity
  - axe accessibility scan of every page
  - the placeholder guard: the build fails if rendered page text contains a placeholder token, meaning a bracket followed by an uppercase word (regex `\[[A-Z]+[\] :]`, which matches `[CONFIRM:`, `[YOUR PRICE]` and `[N]`; the mockup's lowercase `[support@your-domain]` style placeholders are written as `[SUPPORT EMAIL]` in the site source so the guard catches them), unless it runs with `--allow-placeholders` for previews. Ordinary brackets in docs prose don't trigger it.
- **Lighthouse:** performance, accessibility and SEO of 90 or more on Home, Docs and Email info.
- **Browser click-through on the live domain** (desktop and 390px):
  - every navigation and footer link
  - the audience switch
  - FAQ
  - docs search
  - contact form: success, empty fields, a bad email, a double click, and a second submit within the guard window
  - the cookie banner
  - HTTPS on the apex and on `www`
- **Docs accuracy:** follow each tutorial step by step in the real app before publishing it.

## Open questions

1. Legal entity details for the footer and Company page: Master Your Business B.V. name, address, registration number, year founded and city.
2. May we name StoryBrand publicly, and show the MYB and Mastercrest Games sites as proof? (Joel)
3. Is there an example site for "See an example"?
4. Who owns the support, abuse and privacy mailboxes, and what reply time can we promise?
5. Where does the site repo live, and who can push to it?

Resolved 2026-11-11: product name WebGen (for now); domain webgnr.com; no pricing in v1.
