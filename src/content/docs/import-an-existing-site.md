---
title: Import an existing site
description: Already have a website as files? Upload it as a zip, check it in the editor, then publish it with WebGen.
group: getting-started
order: 2
minutes: 8
updated: 2026-11-11
---

<div class="callout"><strong>Before you start:</strong> have your website ready as a single zip file with an <code>index.html</code> at its root. Sites built with an AI tool or by hand both work.</div>

## 1. Prepare your files

WebGen needs two small things from your pages so it can make them editable and connect your forms.

- **Put each top-level block in a section.** Inside your page's main area, use one `section` element per block, such as the hero, services and contact. This is what lets you click a block in the editor to change its text, swap an image or restyle it. Blocks that are not sections still publish, but they stay uneditable as blocks.
- **Name your form fields in the usual way.** A contact form needs an email field and a message field. A newsletter form needs just an email field. Use the standard email field type, which is the most reliable.

Forms WebGen cannot place with confidence are left exactly as they are. You can connect those by hand in the editor afterwards.

<div class="callout callout-note"><strong>Note:</strong> forms with a password field, search boxes and forms with no email field are skipped on purpose, because they are not lead forms.</div>

## 2. Start the import

On your dashboard, click **Import**.

## 3. Add your files

Drop your zip onto the box that says **Drop your files or zip here, or click to choose**, or click it to pick the file.

- Use one zip to keep your folders intact. You can also add several loose files (HTML, CSS, JS, images and videos).
- The upload can be up to 50 MB, with at most 25 MB per file and 400 files in total.
- If your zip has a single wrapping folder, WebGen removes it for you.

The files you picked are listed under **Selected** with their size.

## 4. Click Import website

Click **Import website**. You see an upload bar, then a short message while your site is checked and prepared.

If something is wrong, the page says **The import didn't work** and lists each problem next to the file it belongs to. Common ones are a missing homepage (no `index.html`), a zip that cannot be read, and files that are too large. Nothing is half-imported: fix the problem and click **Try again**.

<div class="callout callout-tip"><strong>Tip:</strong> a short <strong>Good to know</strong> list can appear even when the import works. It covers small things such as a file type that was skipped or an <code>index.htm</code> that was renamed to <code>index.html</code>.</div>

## 5. Check it in the editor

When you see **Your website has been imported!**, click **Open in the editor**. Click a block to edit it, check your pages on desktop, tablet and phone, and make sure your forms look right. Your imported site is also saved as the first entry under **History**.

## 6. Publish

Click **Publish** when you are happy. Your site goes online at a free address, and you can add your own domain afterwards.

## Update the site later

Changed your site outside WebGen? You do not need to import it again.

- Open your site, click **Manage**, then the **Website** tab.
- Drop the new zip into the box and click **Replace website**, then confirm with **Yes, replace**.

Every page is replaced, so pages that are not in the new zip disappear. Your domain, form submissions, newsletter subscribers, downloads and email settings stay as they are. The current version is saved to your history first, and **Undo this update** brings it back. The live site only changes when you publish again.

Leave **Connecting forms and sections** on **Automatic (free)** unless you have a form it could not place.

## Next steps

<div class="next-grid">
<a class="next-card" href="/docs/a-tour-of-the-editor/"><strong>A tour of the editor</strong><span>Find your way around.</span></a>
<a class="next-card" href="/docs/forms-and-leads/"><strong>Forms and leads</strong><span>See who gets in touch.</span></a>
</div>
