# Launch checklist: webgnr.com (hosted through the WebGen app)

Status 2026-11-23. The site builds and passes every gate with placeholders allowed (`npm run build:preview`).
`npm run build` (the real one) stays blocked until every placeholder below is filled in.
Domain agreed with Joel: **webgnr.com** is the site, Dutch at `webgnr.com/nl/`, **webgnr.nl** forwards to `https://webgnr.com/nl/`.
The domains are at Strato (nameservers `rzone.de`). Mail for webgnr.com is at Strato (`MX 5 smtp.rzone.de`).

## 1. Fill in the placeholders (398 in the build, about 70 different ones)

Run `node scripts/check-placeholders.mjs dist` to see the live list. Grouped by who can answer:

**Joel (business decisions)**
- Entity: confirm Schenk Rekenmeesters (KvK 55633323, Steijnstraat 18, Ridderkerk) is the company behind WebGen. Then the legal pages and the site data can use the real name and address (`[LEGAL ENTITY NAME]`, `[POSTAL ADDRESS]`, `[ADDRESS]`).
- Founding story and year, who is behind WebGen (`[CONFIRM: founding story…]`, `[YEAR]`).
- May the StoryBrand framework be named publicly? May the Master Your Business and Mastercrest Games sites be shown as proof?
- Ownership and export promise for a customer's content and contact list.
- "Made in the Netherlands" wording; reply time (`[RESPONSE TIME]`); early-access terms and invitation rhythm; what the product costs for early access (no prices are shown on the site).
- GreenLeaf example: build time in minutes, real results from the owner (or remove the block); next example sites and languages.

**Contact details (whoever owns the mailboxes)**
- Support email (`[SUPPORT EMAIL]`, 43 places), abuse email (`[ABUSE EMAIL]`), privacy email (`[PRIVACY EMAIL]`).
- Phone number and opening hours (`[PHONE]`, `[TELEFOONNUMMER]`, `[OPENINGSTIJDEN]`).

**Joey (hosting and app)**
- EU hosting region and provider (`[EU REGION]` / `[EU-REGIO]`, 45 places, and the FAQ answer "Where is my data stored?").
- The app sign-in and app addresses. The links now carry `[CONFIRM URL]` (94 places) until `https://app.website-generator.nl/login` is confirmed. Then remove `APP_PLACEHOLDER` in `src/lib/links.js`.
- Production `SITES_BASE_DOMAIN` for the app (needed for step 2).

**Legal adviser**
- Privacy policy, terms of service and cookie policy text (`[LEGAL TEXT]` / `[JURIDISCHE TEKST]`, plus the summaries and the "last updated" date).

**Dheeraj (check in the real app)**
- Docs facts: DNS wait time, record names, types and values shown in the app, sender verification records and how many signing records, sending speed and limits, whether publishing or a custom domain needs a plan, wording of the confirmation email and the email footer, the support route to name.
- Six screenshots (`[SCREENSHOT: …]`): add photos step, DNS records after attaching a domain, follow-up series with two emails, leads tab with a message, import page with a zip selected, sender tab with the verification record.

## 2. Host it through the WebGen app (ZIP import)

1. `npm run package` builds the real site and writes the ZIP (it refuses while placeholders remain; use the spike ZIP in `webgen-site-spike` to test earlier).
2. In the app: import the ZIP as a website. The contact and early-access forms use the field names `name`, `email`, `message` so the app wires them to its form handler.
3. Test first with the spike ZIP: does the import keep scripts, assets and folders, does `/nl/` and the 404 page work, can the apex domain `webgnr.com` be attached as a custom domain?
4. Attach `webgnr.com` in the app's Domain tab and add the DNS records the app shows.

## 3. DNS and forwarding at Strato

- **webgnr.com:** replace the old A record (`217.160.148.61`) with what the app shows. **Do not touch the MX record** (`smtp.rzone.de`) or any TXT/DKIM records.
- **webgnr.nl:** Domain forwarding to `https://webgnr.com/nl/`, permanent (301), not masked.
- Check the mail records before and after the change:
  ```
  nslookup -type=MX webgnr.com      # must still show smtp.rzone.de, preference 5
  nslookup -type=TXT webgnr.com     # note SPF/DKIM before the change and compare after
  ```
- Also send one test email to and from an address at webgnr.com after the change.

## 4. After launch

- Open `https://webgnr.com/`, `/nl/`, `/docs/`, `/email/` and check the padlock, the redirect from `webgnr.nl`, and that the sitemap at `/sitemap-index.xml` lists `webgnr.com` addresses.
- Email recipients and SES review will land on `/email/` and the contact page: make sure the abuse and support mailboxes really receive mail.
