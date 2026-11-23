// Company facts, from the Master Your Business contact page (masteryourbusiness.org/en/contact).
import type { Locale } from '../i18n/index.ts';

export const COMPANY = {
  legalName: 'Schenk Rekenmeesters',
  kvk: '55633323',
  vat: 'NL001579296B13',
  street: 'Steijnstraat 18',
  postcode: '2987 AS',
  city: 'Ridderkerk',
  country: { en: 'the Netherlands', nl: 'Nederland' } as Record<Locale, string>,
};

/** "KvK 55633323" */
export const kvkLine = () => `KvK ${COMPANY.kvk}`;
/** "VAT NL…" in English, "BTW NL…" in Dutch. */
export const vatLine = (locale: Locale) => `${locale === 'nl' ? 'BTW' : 'VAT'} ${COMPANY.vat}`;
/** "Steijnstraat 18, 2987 AS Ridderkerk" */
export const addressLine = () => `${COMPANY.street}, ${COMPANY.postcode} ${COMPANY.city}`;
