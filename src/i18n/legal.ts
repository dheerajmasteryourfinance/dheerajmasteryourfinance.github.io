// Legal pages: headings and structure only. Bodies stay bracket placeholders until the
// business and its adviser supply the text, so the build keeps failing until then.

type Section = { id: string; title: string; body: string };
type LegalDoc = { title: string; description: string; summary: string; sections: Section[] };
type LegalSet = { privacy: LegalDoc; terms: LegalDoc; cookies: LegalDoc };

const en: LegalSet = {
  privacy: {
    title: 'Privacy policy',
    description: 'WebGen privacy policy.',
    summary: '[SUMMARY: what we collect, why, who we share it with, and how to reach us. Two or three plain sentences.]',
    sections: [
      { id: 'who', title: 'Who we are', body: '[LEGAL TEXT: the data controller, legal entity and contact details]' },
      { id: 'collect', title: 'What we collect', body: '[LEGAL TEXT: account details, website content, contact lists uploaded by customers, usage data]' },
      { id: 'why', title: 'Why we use it', body: '[LEGAL TEXT: purposes and legal bases]' },
      { id: 'recipients', title: 'Data about email recipients', body: '[LEGAL TEXT: our role as processor for our customers’ subscriber lists]' },
      { id: 'sharing', title: 'Who we share it with', body: '[LEGAL TEXT: service providers, e.g. hosting, email delivery, payments]' },
      { id: 'retention', title: 'How long we keep it', body: '[LEGAL TEXT: retention periods]' },
      { id: 'rights', title: 'Your rights', body: '[LEGAL TEXT: access, correction, deletion, objection, complaint to the regulator]' },
      { id: 'changes', title: 'Changes to this policy', body: '[LEGAL TEXT: how changes are announced]' },
    ],
  },
  terms: {
    title: 'Terms of service',
    description: 'WebGen terms of service.',
    summary: '[SUMMARY: who can use WebGen, what you agree to, and what we promise in return.]',
    sections: [
      { id: 'account', title: 'Your account', body: '[LEGAL TEXT]' },
      { id: 'acceptable', title: 'Acceptable use and email rules', body: '[LEGAL TEXT: permission-based email only, no bought lists, no spam]' },
      { id: 'content', title: 'Your content', body: '[LEGAL TEXT: ownership and licence to host it]' },
      { id: 'billing', title: 'Billing and cancellation', body: '[LEGAL TEXT]' },
      { id: 'availability', title: 'Service availability', body: '[LEGAL TEXT]' },
      { id: 'liability', title: 'Liability', body: '[LEGAL TEXT]' },
      { id: 'ending', title: 'Ending the agreement', body: '[LEGAL TEXT]' },
      { id: 'law', title: 'Governing law', body: '[LEGAL TEXT]' },
    ],
  },
  cookies: {
    title: 'Cookie policy',
    description: 'WebGen cookie policy.',
    summary: '[SUMMARY: which cookies we use, and that analytics only run after you agree.]',
    sections: [
      { id: 'what', title: 'What cookies are', body: '[LEGAL TEXT]' },
      { id: 'essential', title: 'Essential cookies', body: '[LEGAL TEXT: list with names and purposes]' },
      { id: 'analytics', title: 'Analytics cookies', body: '[LEGAL TEXT: only after consent]' },
      { id: 'choices', title: 'Changing your choices', body: '[LEGAL TEXT: cookie settings link]' },
    ],
  },
};

const nl: LegalSet = {
  privacy: {
    title: 'Privacybeleid',
    description: 'Het privacybeleid van WebGen.',
    summary: '[SAMENVATTING: welke gegevens we verzamelen, waarom, met wie we ze delen en hoe je ons bereikt. Twee of drie heldere zinnen.]',
    sections: [
      { id: 'who', title: 'Wie we zijn', body: '[JURIDISCHE TEKST: de verwerkingsverantwoordelijke, de rechtspersoon en de contactgegevens]' },
      { id: 'collect', title: 'Welke gegevens we verzamelen', body: '[JURIDISCHE TEKST: accountgegevens, website-inhoud, door klanten geüploade contactlijsten, gebruiksgegevens]' },
      { id: 'why', title: 'Waarvoor we ze gebruiken', body: '[JURIDISCHE TEKST: doelen en grondslagen]' },
      { id: 'recipients', title: 'Gegevens van e-mailontvangers', body: '[JURIDISCHE TEKST: onze rol als verwerker van de abonneelijsten van onze klanten]' },
      { id: 'sharing', title: 'Met wie we ze delen', body: '[JURIDISCHE TEKST: dienstverleners, zoals hosting, e-mailverzending en betalingen]' },
      { id: 'retention', title: 'Hoe lang we ze bewaren', body: '[JURIDISCHE TEKST: bewaartermijnen]' },
      { id: 'rights', title: 'Jouw rechten', body: '[JURIDISCHE TEKST: inzage, correctie, verwijdering, bezwaar, klacht bij de toezichthouder]' },
      { id: 'changes', title: 'Wijzigingen in dit beleid', body: '[JURIDISCHE TEKST: hoe we wijzigingen aankondigen]' },
    ],
  },
  terms: {
    title: 'Algemene voorwaarden',
    description: 'De algemene voorwaarden van WebGen.',
    summary: '[SAMENVATTING: wie WebGen mag gebruiken, waar je mee akkoord gaat en wat wij daartegenover beloven.]',
    sections: [
      { id: 'account', title: 'Je account', body: '[JURIDISCHE TEKST]' },
      { id: 'acceptable', title: 'Toegestaan gebruik en regels voor e-mail', body: '[JURIDISCHE TEKST: alleen e-mail met toestemming, geen gekochte lijsten, geen spam]' },
      { id: 'content', title: 'Jouw content', body: '[JURIDISCHE TEKST: eigendom en de licentie om het te hosten]' },
      { id: 'billing', title: 'Betalen en opzeggen', body: '[JURIDISCHE TEKST]' },
      { id: 'availability', title: 'Beschikbaarheid van de dienst', body: '[JURIDISCHE TEKST]' },
      { id: 'liability', title: 'Aansprakelijkheid', body: '[JURIDISCHE TEKST]' },
      { id: 'ending', title: 'Einde van de overeenkomst', body: '[JURIDISCHE TEKST]' },
      { id: 'law', title: 'Toepasselijk recht', body: '[JURIDISCHE TEKST]' },
    ],
  },
  cookies: {
    title: 'Cookiebeleid',
    description: 'Het cookiebeleid van WebGen.',
    summary: '[SAMENVATTING: welke cookies we gebruiken, en dat analytische cookies pas werken als je toestemming geeft.]',
    sections: [
      { id: 'what', title: 'Wat cookies zijn', body: '[JURIDISCHE TEKST]' },
      { id: 'essential', title: 'Noodzakelijke cookies', body: '[JURIDISCHE TEKST: lijst met namen en doelen]' },
      { id: 'analytics', title: 'Analytische cookies', body: '[JURIDISCHE TEKST: alleen na toestemming]' },
      { id: 'choices', title: 'Je keuze aanpassen', body: '[JURIDISCHE TEKST: link naar de cookie-instellingen]' },
    ],
  },
};

export const LEGAL = { en, nl };
export type LegalPage = keyof LegalSet;
