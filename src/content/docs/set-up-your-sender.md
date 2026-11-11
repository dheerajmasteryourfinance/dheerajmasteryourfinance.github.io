---
title: Set up your sender
description: Send newsletters and follow-up emails from your own address by adding your domain, a few DNS records and a sending address.
group: email
order: 1
minutes: 12
updated: 2026-11-11
---

<div class="callout"><strong>Before you start:</strong> you need a domain you own and access to where its DNS is managed, which is often your domain provider. Free email services such as Gmail or Outlook cannot be used, because you cannot change their DNS.</div>

Until your own sender is set up, your emails go out from WebGen's address and replies still come to you. Nothing breaks if you skip this, but emails from your own address look more trustworthy and are more likely to reach the inbox.

## 1. Open the Sender tab

Open your site, click **Manage**, then the **Sender** tab. It is titled **Sending address**.

## 2. Add your domain

Under **Add a domain you own**, type the part of your email address after the @, for example `yourbusiness.com`, and click **Add domain**. You can add up to 5 domains.

## 3. Prove the domain is yours

WebGen shows one record to add where you manage your domain's DNS. Add it exactly as shown, then click **Check DNS**.

- The record has three fields at your provider: **Type**, **Name / host** and **Value / content**. Fill them in separately, and use **Copy** next to each one.
- If your provider only wants the part before your domain name, enter just the first part of the name shown.
- Type: [CONFIRM: record type shown for domain verification]
- Name: [CONFIRM: exact record name shown for domain verification]
- Value: [CONFIRM: value is generated per domain; confirm how it is described to the user]

When it works, the status changes and you see **Done: we've confirmed this domain is yours.** Leave the record in place, because WebGen checks it again from time to time.

<div class="callout callout-note"><strong>Note:</strong> DNS changes can take a few hours to show up. If <strong>Check DNS</strong> cannot find the record yet, wait and try again. [CONFIRM: typical DNS wait time to quote]</div>

<div class="shot">[SCREENSHOT: Sender tab with the verification record]</div>

## 4. Add the signing records

Next comes **Last step: let your emails be signed**. WebGen shows 3 more records, each marked **Record 1 of 3** and so on. Add all three where you manage your domain's DNS, then click **Check now**. These records let the email service sign mail from your domain so it reaches inboxes instead of spam.

- If your provider wants the full name, add your domain after the name shown.
- If the records are not found yet, you see a message. Check they are exactly as shown, wait, and click **Check now** again.
- [CONFIRM: record types and number of signing records, and that they stay at 3 for every domain]

When everything is in place the status reads **Ready to send**. Leave all your DNS records where they are.

## 5. Add a sending address

Under **Sending addresses**, fill in the **New sending address** form.

- **Address:** the part before the @, such as `hello`. Use letters, numbers and . _ + - only.
- **Name shown to readers:** for example "Sam from Your Business".
- Tick **Use this as the site's sending address** to make it the one your emails use.

Click **Add address**. You can add up to 20 addresses. The one in use carries an **In use** badge. To switch, click **Use this one** on another address, or **Rename** to change its display name.

An address is only used once its domain is ready. Until then it says that emails still go out from WebGen's address.

## 6. Check where your emails come from

Open **Follow-up emails** and look under **Send as**. It shows the address your series will use. Campaigns and newsletters use the site's sending address too.

<div class="callout callout-tip"><strong>Tip:</strong> send yourself a test from a campaign or follow-up email to see the sender name and address as a reader sees them.</div>

## If a domain stops working

WebGen re-checks your records every day. If a record has gone missing several checks in a row, the domain shows **No longer verified** and your emails go back to WebGen's address. Put the record back as shown and click **Check DNS**. To remove a domain and its addresses, use **Remove this domain**.

## Next steps

<div class="next-grid">
<a class="next-card" href="/docs/send-a-campaign/"><strong>Send a campaign</strong><span>Write and send your first email.</span></a>
<a class="next-card" href="/docs/follow-up-emails/"><strong>Follow-up emails</strong><span>Reply to new leads automatically.</span></a>
</div>
