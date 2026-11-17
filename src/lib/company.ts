// Company facts, from the Master Your Business contact page (masteryourbusiness.org/en/contact).
// [CONFIRM: Schenk Rekenmeesters is the entity behind WebGen] — see docs/superpowers/plans/2026-11-17-site-from-canvas.md.
import type { Locale } from '../i18n/index.ts';

export const COMPANY = {
  legalName: 'Schenk Rekenmeesters',
  kvk: '55633323',
  vat: 'NL001579296B13',
  street: 'Steijnstraat 18',
  postcode: '2987 AS',
  city: 'Ridderkerk',
  country: { en: 'the Netherlands', nl: 'Nederland' } as Record<Locale, string>,
  phone: '[PHONE]',
  supportEmail: '[SUPPORT EMAIL]',
};

/** "KvK 55633323" */
export const kvkLine = () => `KvK ${COMPANY.kvk}`;
/** "VAT NL…" in English, "BTW NL…" in Dutch. */
export const vatLine = (locale: Locale) => `${locale === 'nl' ? 'BTW' : 'VAT'} ${COMPANY.vat}`;
/** "Steijnstraat 18, 2987 AS Ridderkerk" */
export const addressLine = () => `${COMPANY.street}, ${COMPANY.postcode} ${COMPANY.city}`;
