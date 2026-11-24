---
title: Connect your domain
description: Use your own web address for your Webgnr site, either by buying a domain through Webgnr or by connecting one you already own.
group: domains
order: 1
minutes: 10
updated: 2026-11-11
---

<div class="callout"><strong>Before you start:</strong> have your site ready to publish. If you already own a domain, have the login for the place where its DNS is managed, which is often your domain provider.</div>

## 1. Open the Domain tab

Open your site, click **Manage**, then the **Domain** tab. At the top you see your **Free web address**. Click **Change** to pick a different one. Webgnr tells you if a name is **Available!** or already taken, and suggests alternatives.

You can also reach the same choices when you publish: after your first publish, Webgnr asks **Want a custom domain?** and offers **Buy a domain through us**, **I already have a domain** and **Maybe later**.

## 2a. Buy a domain through Webgnr

Under **Buy a domain through us**, type a name in **Domain name** and click **Search**. Names that are not free say **Taken**. Click **Buy** next to the one you want.

The domain registry requires some details for the registration: first and last name, street, house number, postal code, city, phone number and country (as a 2-letter code). They are used only for this registration. Click **Confirm purchase** to finish.

## 2b. Connect a domain you already own

Under **I already own a domain**, type it into **Your own domain**. Whether you type the www prefix does not matter. Click **Attach**.

Webgnr then shows the DNS records to add where you manage your domain. Each record has three separate fields at your provider, **Type**, **Name / Host** and **Value / Content**, so fill them in one by one rather than pasting the whole line into one box. Use **Copy** next to each value.

- **A records** point your domain at Webgnr. With these, your site works on both your domain and the www version.
  - Type: A
- **A TXT record** proves the domain is yours. If your provider only asks for the part before your domain name, enter `_wg-verify` as the name. Most providers add the rest for you.
  - Type: TXT

## 3. Verify

When the records are saved at your provider, click **Verify**. If Webgnr cannot find the TXT record yet, you see **Verification failed. Check the TXT record and try again.** Check it is entered exactly as shown, wait, and try again.

DNS changes can take a while to show up.

When it works, the page says **Verified and live.** If your site is not published yet, it says it will go live once you publish.

## 4. Publish again

If the page says your domain will go live once you publish, click **Publish** so it starts serving your site. Your free address keeps working.

## Change your mind

- **Remove custom domain** disconnects it. Your site stays live on its free web address.
- **Move this domain elsewhere** shows a transfer code you can give to a new registrar.

<div class="callout callout-tip"><strong>Tip:</strong> if a domain is already connected to a different Webgnr account, you see a message saying so. Contact us if you think that is a mistake.</div>

## Next steps

<div class="next-grid">
<a class="next-card" href="/docs/set-up-your-sender/"><strong>Set up your sender</strong><span>Email from your own address.</span></a>
<a class="next-card" href="/docs/forms-and-leads/"><strong>Forms and leads</strong><span>See who gets in touch.</span></a>
</div>
