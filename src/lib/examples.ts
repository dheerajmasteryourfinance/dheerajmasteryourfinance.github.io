// Example sites made in Webgnr. Only test sites the team generated, plus GreenLeaf Bakery;
// never a real client's site without written permission.
import type { ImageMetadata } from 'astro';
import type { Locale } from '../i18n/index.ts';
import tea from '../assets/examples/ex-tea.jpg';
import garden from '../assets/examples/ex-garden.jpg';
import heatpump from '../assets/examples/ex-heatpump.jpg';
import physio from '../assets/examples/ex-physio.jpg';
import greenleaf from '../assets/screens/site-desktop.png';

export const TRADE_KEYS = ['bakery', 'restaurant', 'coach', 'agency', 'local'] as const;
export type TradeKey = (typeof TRADE_KEYS)[number];
export type SiteLang = 'en' | 'nl' | 'fr' | 'de';

export type ExampleSite = {
  id: 'greenleaf' | 'tea' | 'garden' | 'heatpump' | 'physio';
  name: string;
  trade: Record<Locale, string>;
  tradeKey: TradeKey;
  langs: SiteLang[];
  /** The site's own headline, quoted on the card; empty when the card shows no quote. */
  headline: string;
  image: ImageMetadata;
  alt: Record<Locale, string>;
};

export const EXAMPLES: ExampleSite[] = [
  {
    id: 'greenleaf', name: 'GreenLeaf Bakery', trade: { en: 'Bakery', nl: 'Bakkerij' }, tradeKey: 'bakery',
    langs: ['nl', 'fr', 'de'], headline: '', image: greenleaf,
    alt: { en: 'The GreenLeaf Bakery website on desktop', nl: 'De website van GreenLeaf Bakery op desktop' },
  },
  {
    id: 'tea', name: 'Blad & Bloesem', trade: { en: 'Tea shop', nl: 'Theewinkel' }, tradeKey: 'local',
    langs: ['nl', 'en'], headline: 'Elke dag thee die écht smaakt', image: tea,
    alt: {
      en: "The Blad & Bloesem tea shop website with the headline 'Elke dag thee die écht smaakt' and a language switch",
      nl: "De website van theehuis Blad & Bloesem met de kop 'Elke dag thee die écht smaakt' en een taalschakelaar",
    },
  },
  {
    id: 'garden', name: 'De Groene Hand', trade: { en: 'Garden care', nl: 'Hovenier' }, tradeKey: 'local',
    langs: ['nl'], headline: 'Je hoeft het niet alleen uit te zoeken.', image: garden,
    alt: {
      en: "The De Groene Hand garden care website with the headline 'Je hoeft het niet alleen uit te zoeken.'",
      nl: "De website van hoveniersbedrijf De Groene Hand met de kop 'Je hoeft het niet alleen uit te zoeken.'",
    },
  },
  {
    id: 'heatpump', name: 'Warmtewijs', trade: { en: 'Heat pump installer', nl: 'Warmtepompinstallateur' }, tradeKey: 'local',
    langs: ['nl'], headline: 'Warm huis, lage energierekening, zonder gedoe', image: heatpump,
    alt: {
      en: "The Warmtewijs heat pump installer website with the headline 'Warm huis, lage energierekening, zonder gedoe'",
      nl: "De website van installatiebedrijf Warmtewijs met de kop 'Warm huis, lage energierekening, zonder gedoe'",
    },
  },
  {
    id: 'physio', name: 'Beweegpunt', trade: { en: 'Physiotherapy', nl: 'Fysiotherapie' }, tradeKey: 'local',
    langs: ['nl'], headline: 'Snel weer pijnvrij en zelfstandig bewegen', image: physio,
    alt: {
      en: "The Beweegpunt physiotherapy website with the headline 'Snel weer pijnvrij en zelfstandig bewegen'",
      nl: "De website van fysiotherapie Beweegpunt met de kop 'Snel weer pijnvrij en zelfstandig bewegen'",
    },
  },
];

const LANG_NAMES: Record<Locale, Record<SiteLang, string>> = {
  en: { en: 'English', nl: 'Dutch', fr: 'French', de: 'German' },
  nl: { en: 'Engels', nl: 'Nederlands', fr: 'Frans', de: 'Duits' },
};

/** "Dutch + English" for the card's language tag. */
export const langLabel = (site: ExampleSite, locale: Locale) => site.langs.map((l) => LANG_NAMES[locale][l]).join(' + ');
