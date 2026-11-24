// Strings for the motion pieces (floating cards, sticky early-access bar).
import type { Locale } from './index.ts';

export const MOTION: Record<Locale, { chips: [string, string, string]; sticky: string; stickyCta: string }> = {
  en: {
    chips: ['New form entry', 'Email sent', 'Site published'],
    sticky: 'Try Webgnr free for 14 days',
    stickyCta: 'Start free trial',
  },
  nl: {
    chips: ['Formulier ontvangen', 'E-mail verzonden', 'Site gepubliceerd'],
    sticky: 'Probeer Webgnr 14 dagen gratis',
    stickyCta: 'Start gratis proefperiode',
  },
};
