import Slugger from 'github-slugger';

// HTML ids may not start with a digit, but numbered step headings ("1. Open ...")
// slug to "1-open-...". Prefix those ids so the page is valid HTML. The processor's
// own heading-id step keeps an id that is already set, so the docs table of
// contents (built from the collected headings) links to the prefixed id too.
export function headingId(slug) {
  return /^\d/.test(slug) ? `step-${slug}` : slug;
}

// Satteri hast plugin factory; runs before Astro's heading-ids step, one Slugger per document.
export function validHeadingIds() {
  const slugger = new Slugger();
  return {
    name: 'valid-heading-ids',
    element: {
      filter: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      visit(node, ctx) {
        if (typeof node.properties?.id === 'string') return;
        ctx.setProperty(node, 'id', headingId(slugger.slug(ctx.textContent(node))));
      },
    },
  };
}
