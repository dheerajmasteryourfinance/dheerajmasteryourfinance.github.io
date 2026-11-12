// Labels used by shared components (Nav, Footer). Kept in one place so a
// translated version of the site can swap them without editing the components.

// The nav CTA hides its lead word under 420px so it fits beside the logo and the
// menu button; the full label stays the link's text and accessible name.
const ctaLead = 'Request ';
const ctaRest = 'early access';

export const COPY = {
  ctaEarlyAccess: ctaLead + ctaRest,
  ctaEarlyAccessLead: ctaLead,
  ctaEarlyAccessRest: ctaRest,
  footerFactsLabel: 'Company details',
  madeIn: 'Made in the Netherlands',
};

// Company facts shown in the footer and on /company/. Placeholders until confirmed.
export const COMPANY = {
  legalName: '[LEGAL ENTITY NAME]',
  kvk: 'KvK [KVK NUMBER]',
  btw: 'BTW [BTW NUMBER]',
  address: '[POSTAL ADDRESS]',
  phone: '[PHONE]',
};
