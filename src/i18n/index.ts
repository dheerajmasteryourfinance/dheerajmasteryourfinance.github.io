// Locale helpers. English is the default and lives at the root; Dutch lives under /nl/
// with the same (English) slugs, so switching language is a prefix swap.

export const LOCALES = ['en', 'nl'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';
export const SITE = 'https://webgnr.com';

/** The page's locale, from Astro.currentLocale (set by the i18n routing config). */
export function getLocale(current: string | undefined): Locale {
  return current === 'nl' ? 'nl' : 'en';
}

/** '/nl/features/' -> '/features/'; '/features/' -> '/features/'. */
export function basePath(path: string): string {
  if (path === '/nl' || path === '/nl/') return '/';
  return path.startsWith('/nl/') ? path.slice(3) : path;
}

/** A locale-neutral path ('/features/', '/company/#contact') in the given locale. */
export function localize(path: string, locale: Locale): string {
  const base = basePath(path);
  return locale === DEFAULT_LOCALE ? base : `/nl${base}`;
}

/** Both language versions of a page, for hreflang alternates and the language switch. */
export function alternates(path: string): { locale: Locale; href: string }[] {
  return LOCALES.map((locale) => ({ locale, href: localize(path, locale) }));
}

/** Pick one locale's strings from a { en, nl } dictionary. */
export function pick<T>(dict: Record<Locale, T>, locale: Locale): T {
  return dict[locale];
}
