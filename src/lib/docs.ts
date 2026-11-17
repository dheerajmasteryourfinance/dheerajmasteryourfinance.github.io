import type { CollectionEntry } from 'astro:content';
import type { Locale } from '../i18n/index.ts';

// English articles live in src/content/docs/*.md (id = slug); Dutch ones in
// src/content/docs/nl/*.md (id = nl/slug). Both use the same slugs.
export type DocEntry = CollectionEntry<'docs'> & { slug: string };

export function docLocale(entry: CollectionEntry<'docs'>): Locale {
  return entry.id.startsWith('nl/') ? 'nl' : 'en';
}

/** The entries of one locale, sorted by their order, each with its locale-free slug. */
export function docsFor(entries: CollectionEntry<'docs'>[], locale: Locale): DocEntry[] {
  return entries
    .filter((e) => docLocale(e) === locale)
    .map((e) => ({ ...e, slug: locale === 'nl' ? e.id.slice(3) : e.id }))
    .sort((a, b) => a.data.order - b.data.order);
}
