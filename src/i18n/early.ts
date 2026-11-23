// Early Access and Company page copy (canvas EarlyAccess*.dc.html, Company*.dc.html).
// Unconfirmed facts stay bracketed (English [CONFIRM: ...], Dutch [BEVESTIG: ...]) so the
// placeholder gate blocks a release build until they are filled in.

const early = {
  en: {
    title: 'Request early access to WebGen',
    description: 'WebGen is opening to a limited number of businesses. Request early access and we will email you an invite.',
    eyebrow: 'Early access',
    h1: 'Be among the first to build with WebGen.',
    lede: 'We are opening WebGen to a limited number of businesses, in small groups, so every new site gets our attention. Tell us about yours and we will send you an invitation.',
    points: ['A complete website from a short brief', 'Forms, newsletters and follow-up emails built in', 'Personal help getting your first site live'],
    form: {
      title: 'Request early access',
      sub: 'It takes about a minute. We reply by email.',
      name: 'Name',
      email: 'Email',
      company: 'Business name (optional)',
      type: 'Type',
      types: ['Business', 'Agency', 'Other'],
      message: 'What would you like to build?',
      consentLead: 'We use your details only to reply about early access. See our ',
      consentLink: 'privacy policy',
      consentTail: '.',
      submit: 'Request access',
    },
    marquee: ['Website', 'Forms', 'Newsletters', 'Your own domain', 'Follow-up emails', 'Search basics', 'Reports'],
    examples: { eyebrow: 'Examples', title: 'What other owners build.', text: 'Example sites for small businesses, made in WebGen from a short brief.' },
    next: {
      eyebrow: 'What happens next',
      title: 'Three steps to your first site.',
      steps: [
        { t: 'We read your request', p: 'A person looks at every request, so tell us a little about your business.' },
        { t: 'You get an invitation', p: 'We email you a personal link to create your account.' },
        { t: 'You build your site', p: 'Answer the brief, review the result and publish when you are happy.' },
      ],
    },
    faq: {
      title: 'Early access questions',
      items: [
        { q: 'I am an agency. Can I join?', a: 'Yes. Choose "Agency" in the form and tell us how many clients you build for.' },
        { q: 'Does WebGen work in Dutch?', a: 'Yes. The app is in Dutch and English, and your site can be in up to eight languages.' },
      ],
    },
  },
  nl: {
    title: 'Vraag vroege toegang aan voor WebGen',
    description: 'WebGen opent voor een beperkt aantal bedrijven. Vraag vroege toegang aan en we mailen je een uitnodiging.',
    eyebrow: 'Vroege toegang',
    h1: 'Wees een van de eersten die met WebGen bouwt.',
    lede: 'We openen WebGen voor een beperkt aantal bedrijven, in kleine groepen, zodat elke nieuwe site onze aandacht krijgt. Vertel over jouw bedrijf en we sturen je een uitnodiging.',
    points: ['Een complete website vanuit een korte briefing', 'Formulieren, nieuwsbrieven en follow-upmails ingebouwd', 'Persoonlijke hulp om je eerste site live te krijgen'],
    form: {
      title: 'Vraag vroege toegang aan',
      sub: 'Het kost ongeveer een minuut. We antwoorden per e-mail.',
      name: 'Naam',
      email: 'E-mail',
      company: 'Bedrijfsnaam (optioneel)',
      type: 'Type',
      types: ['Bedrijf', 'Bureau', 'Anders'],
      message: 'Wat wil je bouwen?',
      consentLead: 'We gebruiken je gegevens alleen om te reageren op je aanvraag. Zie ons ',
      consentLink: 'privacybeleid',
      consentTail: '.',
      submit: 'Aanvraag versturen',
    },
    marquee: ['Website', 'Formulieren', 'Nieuwsbrieven', 'Eigen domein', 'Vervolgmails', 'Zoekbasis', 'Statistieken'],
    examples: { eyebrow: 'Voorbeelden', title: 'Dit bouwen andere ondernemers.', text: 'Voorbeeldsites uit het mkb, gemaakt in WebGen vanuit een korte briefing.' },
    next: {
      eyebrow: 'Wat er daarna gebeurt',
      title: 'Drie stappen naar je eerste site.',
      steps: [
        { t: 'We lezen je aanvraag', p: 'Een mens bekijkt elke aanvraag, dus vertel ons iets over je bedrijf.' },
        { t: 'Je krijgt een uitnodiging', p: 'We mailen je een persoonlijke link om je account aan te maken.' },
        { t: 'Jij bouwt je site', p: 'Beantwoord de briefing, bekijk het resultaat en publiceer als je tevreden bent.' },
      ],
    },
    faq: {
      title: 'Vragen over vroege toegang',
      items: [
        { q: 'Ik ben een bureau. Kan ik meedoen?', a: 'Ja. Kies "Bureau" in het formulier en vertel voor hoeveel klanten je bouwt.' },
        { q: 'Werkt WebGen in het Nederlands?', a: 'Ja. De app is in het Nederlands en het Engels, en je site kan in maximaal acht talen staan.' },
      ],
    },
  },
};

const company = {
  en: {
    title: 'About WebGen and contact',
    description: 'Who is behind WebGen, what we stand for, and how to reach a person.',
    eyebrow: 'About us',
    h1: 'We think every small business deserves a website that works for it.',
    p1: 'Getting online used to mean hiring a designer, a developer and a marketing tool, then making them talk to each other. Most small businesses never got past the first step.',
    p2: 'WebGen puts the website, the sign-up forms and the email in one place, and writes the first version for you.',
    facts: { based: 'Based in', operated: 'Operated by' },
    marquee: ['Website', 'Forms', 'Newsletters', 'Your own domain', 'Follow-up emails', 'Search basics', 'Reports'],
    values: {
      title: 'What we stand for',
      cards: [
        { t: 'Plain language', p: 'No jargon in the product or in our support replies.' },
        { t: 'Consent first', p: 'People only get email they asked for, and can leave in one click.' },
      ],
    },
    examples: { eyebrow: 'Examples', title: 'What other owners build.', text: 'Example sites for small businesses, made in WebGen from a short brief.' },
    contact: {
      eyebrow: 'Contact',
      title: 'Talk to a person.',
      reply: 'Send us a message and a person will reply.',
      abuse: 'Report spam or abuse',
      abuseValue: 'Use the form and choose “An email I received”.',
      abuseLink: 'Got an email you did not expect? →',
      postal: 'Postal address',
      form: {
        name: 'Name',
        email: 'Email',
        topic: 'Topic',
        topics: ['A question about WebGen', 'Help with my account', 'Agency or partnership', 'An email I received'],
        message: 'Message',
        consentLead: 'We use your details only to reply. See our ',
        consentLink: 'privacy policy',
        consentTail: '.',
        submit: 'Send message',
      },
    },
  },
  nl: {
    title: 'Over WebGen en contact',
    description: 'Wie achter WebGen zit, waar we voor staan en hoe je een mens bereikt.',
    eyebrow: 'Over ons',
    h1: 'Wij vinden dat elk klein bedrijf een website verdient die voor hem werkt.',
    p1: 'Online komen betekende vroeger: een ontwerper, een developer en een marketingtool inhuren en ze met elkaar laten praten. De meeste kleine bedrijven kwamen nooit voorbij de eerste stap.',
    p2: 'WebGen brengt de website, de aanmeldformulieren en de e-mail samen op één plek en schrijft de eerste versie voor je.',
    facts: { based: 'Gevestigd in', operated: 'Een product van' },
    marquee: ['Website', 'Formulieren', 'Nieuwsbrieven', 'Eigen domein', 'Vervolgmails', 'Zoekbasis', 'Statistieken'],
    values: {
      title: 'Waar we voor staan',
      cards: [
        { t: 'Gewone taal', p: 'Geen jargon in het product of in onze support-antwoorden.' },
        { t: 'Toestemming eerst', p: 'Mensen krijgen alleen e-mail waar ze om vroegen en kunnen zich altijd uitschrijven.' },
      ],
    },
    examples: { eyebrow: 'Voorbeelden', title: 'Dit bouwen andere ondernemers.', text: 'Voorbeeldsites uit het mkb, gemaakt in WebGen vanuit een korte briefing.' },
    contact: {
      eyebrow: 'Contact',
      title: 'Praat met een mens.',
      reply: 'Stuur ons een bericht en een mens antwoordt.',
      abuse: 'Spam of misbruik melden',
      abuseValue: 'Gebruik het formulier en kies “Een e-mail die ik ontving”.',
      abuseLink: 'Onverwachte e-mail ontvangen? →',
      postal: 'Postadres',
      form: {
        name: 'Naam',
        email: 'E-mail',
        topic: 'Onderwerp',
        topics: ['Een vraag over WebGen', 'Hulp bij mijn account', 'Bureau of samenwerking', 'Een e-mail die ik ontving'],
        message: 'Bericht',
        consentLead: 'We gebruiken je gegevens alleen om te antwoorden. Zie ons ',
        consentLink: 'privacybeleid',
        consentTail: '.',
        submit: 'Bericht versturen',
      },
    },
  },
};

export const EARLY = early;
export const COMPANY_COPY = company;
