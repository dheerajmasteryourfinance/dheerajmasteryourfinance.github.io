// Strings for the motion pieces (floating cards, sticky early-access bar).
import type { Locale } from './index.ts';

export const MOTION: Record<Locale, { chips: [string, string, string]; sticky: string; stickyCta: string }> = {
  en: {
    chips: ['New form entry', 'Email sent', 'Site published'],
    sticky: 'Be among the first to build with WebGen',
    stickyCta: 'Request early access',
  },
  nl: {
    chips: ['Formulier ontvangen', 'E-mail verzonden', 'Site gepubliceerd'],
    sticky: 'Wees een van de eersten met WebGen',
    stickyCta: 'Vraag vroege toegang aan',
  },
};
