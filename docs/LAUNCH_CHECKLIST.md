# Launch checklist: webgnr.com (hosted through the WebGen app)

Status 2026-11-23. The site builds and passes every gate with placeholders allowed (`npm run build:preview`).
`npm run build` (the real one) stays blocked until every placeholder below is filled in.
Domain agreed with Joel: **webgnr.com** is the site, Dutch at `webgnr.com/nl/`, **webgnr.nl** forwards to `https://webgnr.com/nl/`.
The domains are at Strato (nameservers `rzone.de`). Mail for webgnr.com is at Strato (`MX 5 smtp.rzone.de`).

## 1. Placeholders: removed (2026-11-23)

`npm run build` now passes with no placeholders. Unconfirmed claims were removed rather than filled in:
support, abuse and phone contacts (spam reports go through the contact form), data-region claims,
founding story and year, ownership promise, SEO claims that have not shipped, example results,
docs placeholders and screenshots. The privacy, terms and cookie pages are plain-language DRAFTS
(on-page notice says so) and still need a legal adviser's review.

Add back when confirmed: support/abuse/privacy mailboxes and phone, EU hosting region, founding story,
ownership and export promise, early-access terms and reply time, SEO claims once they ship, GreenLeaf results,
and the docs screenshots and DNS facts.

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
