// Home page copy, from the design canvas (Main.dc.html / MainNL.dc.html). Dutch is written for
// Dutch small-business owners, not translated word for word; every fact matches the English.
// Anything unconfirmed stays a bracketed placeholder so the placeholder gate blocks a release build.

const en = {
  title: 'Webgnr: get found, get signed up, follow up',
  description: 'Describe your business and Webgnr builds your brand story, a website that tells it, and forms and email to follow up. Start free for 14 days.',
  announce: { text: 'New: automated email sequences for every site.', link: 'Read the guide' },
  hero: {
    switchLabel: 'Who are you building for',
    business: 'For businesses',
    agency: 'For agencies',
    h1Business: ['Get found. Get signed up.', 'Follow up.'],
    h1Agency: ['Ship client sites faster.', 'Send email as the client.'],
    ledeBusiness: 'Describe your business and get your brand story, a website that tells it, and forms and email ready to go. No designer, no developer, no extra tools.',
    ledeAgency: 'Generate, edit and publish for every client from one account. Each client keeps their own domain, sender identity, audience and reports.',
    cta: 'Start your free 14-day trial',
    requestLead: 'Not ready yet?',
    requestLink: 'Request early access',
    example: 'See an example',
    benefits: [
      { t: 'Your brand story, written for you', p: 'Answer a few questions in your own words. Webgnr turns them into your brand story and a website built around it.' },
      { t: 'AI that designs and writes', p: 'Change your site, translate it and draft campaigns by asking in plain words.' },
      { t: 'Start free, grow at fair rates', p: 'Try it free for 14 days. Choose a plan when you are ready.' },
    ],
  },
  shot: {
    label: 'Product preview',
    alt: 'The Webgnr editor in Edit mode, showing the GreenLeaf Bakery homepage with its headline selected and the text toolbar above it',
    caption: 'The real Webgnr editor: click any text on your site to change it.',
  },
  problem: {
    eyebrow: 'Sound familiar?',
    title: 'Getting online shouldn\'t need a big budget or a tech team.',
    cards: [
      { t: '"I don\'t know where to start."', p: 'Hosting, templates, plugins, email tools. Every choice leads to five more.' },
      { t: '"I can\'t afford a designer and a developer."', p: 'A custom site and a marketing setup can cost more than a small business spends in a year.' },
      { t: '"I worry it will look amateur."', p: 'Next to competitors with polished sites, a weak one can cost you the customer.' },
    ],
  },
  guide: {
    title: 'We know your time goes to your business, not to learning web tools.',
    text: 'That is why Webgnr asks about your customers, not about code. Your answers become your brand story: a clear message, a site built around it, and the tools to keep in touch.',
    cards: [] as { t: string; p: string }[],
  },
  how: {
    eyebrow: 'How it works',
    title: 'Three stops to a site that works.',
    routeLabel: 'Your route: check, route, launch',
    stops: ['Check', 'Route', 'Launch'],
    cards: [
      { tag: 'Stop 1 · Check', t: 'Tell us about your business', p: 'Answer a short brief about who you serve and how you help them.' },
      { tag: 'Stop 2 · Route', t: 'Review your site', p: 'Get a full site with pages and copy. Change anything by clicking it or asking.' },
      { tag: 'Stop 3 · Launch', t: 'Publish', p: 'Go live on your domain with forms and email connected.' },
    ],
  },
  get: {
    eyebrow: 'What you get',
    title: 'Everything you need, in the order you need it.',
    groups: [
      {
        t: 'Get found',
        items: [
          'Your brand story and a complete site, written from your brief',
          'Your own domain',
          'Your site in up to 8 languages',
        ],
      },
      {
        t: 'Get signed up',
        items: ['Forms on every page', 'One audience, tagged by where people signed up', 'Consent and unsubscribe handled for you'],
      },
      {
        t: 'Follow up',
        items: ['Newsletters from your own domain', 'Welcome emails and automated sequences', 'Visits, sign-ups and email results in one view'],
      },
    ],
    note: 'Instead of five separate tools (a site builder, a form plugin, a newsletter tool, an SEO plugin and analytics) you get one account.',
    more: 'Explore all features →',
  },
  proof: {
    eyebrow: 'Proof',
    title: 'Built with Webgnr.',
    text: 'Real websites, written from a short brief and edited in the same editor you just saw.',
    all: 'See all examples →',
    label: 'Example site',
    name: 'GreenLeaf Bakery',
    place: 'Bakery · Amsterdam',
    tags: ['Generated in minutes', 'Dutch copy', 'Works on phones'],
    altDesktop: 'The GreenLeaf Bakery website on a desktop screen, opening on the problem it solves for its customers',
    altPhone: 'The GreenLeaf Bakery website on a phone, with its headline and order button',
    stripTitle: 'Examples from small businesses, made in Webgnr',
    inbox: { t: 'Built to respect the inbox.', link: 'Got an email from us? Here is why →', chips: ['Double opt-in (optional)', 'Easy unsubscribe', 'Verified senders', 'Suppression lists'] },
  },
  faq: {
    title: 'Questions',
    items: [
      { q: 'Do I need to know how to code or design?', a: 'No. You describe the business and edit by clicking or asking for changes in plain words.' },
      { q: 'Can I use my own domain?', a: 'Yes. Connect it from your site\'s Domain settings. The docs walk through each step.' },
      { q: 'Is it safe to send email through Webgnr?', a: 'Every email goes to people who signed up, from a sender that is verified, with an unsubscribe link in every message.' },
    ],
  },
  cta: {
    title: 'See your site today.',
    text: 'Every day without a site that works is a day customers choose someone else. Describe your business and we will build the first version.',
  },
};

const nl: typeof en = {
  title: 'Webgnr: word gevonden, krijg aanmeldingen, volg op',
  description: 'Beschrijf je bedrijf en Webgnr bouwt je merkverhaal, een website die het vertelt en formulieren en e-mail om op te volgen. Start 14 dagen gratis.',
  announce: { text: 'Nieuw: automatische follow-upmails voor elke site.', link: 'Lees de handleiding' },
  hero: {
    switchLabel: 'Voor wie bouw je',
    business: 'Voor ondernemers',
    agency: 'Voor bureaus',
    h1Business: ['Word gevonden. Krijg aanmeldingen.', 'Volg op.'],
    h1Agency: ['Lever klantsites sneller op.', 'Mail namens je klant.'],
    ledeBusiness: 'Beschrijf je bedrijf en krijg je merkverhaal, een website die het vertelt en formulieren en e-mail die klaarstaan. Geen ontwerper, geen ontwikkelaar, geen gedoe.',
    ledeAgency: 'Maak, bewerk en publiceer voor al je klanten vanuit één account. Elke klant houdt een eigen domein, afzender, publiek en rapportage.',
    cta: 'Start je gratis proefperiode van 14 dagen',
    requestLead: 'Nog niet zover?',
    requestLink: 'Vraag vroege toegang aan',
    example: 'Bekijk een voorbeeld',
    benefits: [
      { t: 'Je merkverhaal, voor je geschreven', p: 'Beantwoord een paar vragen in je eigen woorden. Webgnr maakt er je merkverhaal van en een website eromheen.' },
      { t: 'AI die ontwerpt en schrijft', p: 'Pas je site aan, vertaal hem en laat campagnes opstellen door het gewoon te vragen.' },
      { t: 'Gratis starten, groeien tegen eerlijke tarieven', p: 'Probeer 14 dagen gratis. Kies een abonnement als je eraan toe bent.' },
    ],
  },
  shot: {
    label: 'Productvoorbeeld',
    alt: 'De Webgnr-editor in bewerkmodus met de homepage van GreenLeaf Bakery, de kop geselecteerd en de tekstbalk erboven',
    caption: 'De echte Webgnr-editor: klik op een tekst op je site om die aan te passen.',
  },
  problem: {
    eyebrow: 'Herkenbaar?',
    title: 'Online komen hoort geen groot budget of techteam te vragen.',
    cards: [
      { t: '"Ik weet niet waar ik moet beginnen."', p: 'Hosting, thema\'s, plugins, mailtools. Elke keuze leidt tot vijf nieuwe.' },
      { t: '"Een ontwerper én een developer kan ik niet betalen."', p: 'Een maatwerksite plus marketing kan meer kosten dan een klein bedrijf in een jaar uitgeeft.' },
      { t: '"Ik ben bang dat het amateuristisch oogt."', p: 'Naast concurrenten met een verzorgde site kan een zwakke site je de klant kosten.' },
    ],
  },
  guide: {
    title: 'Wij weten dat je tijd naar je bedrijf gaat, niet naar het leren van webtools.',
    text: 'Daarom vraagt Webgnr naar je klanten, niet naar code. Je antwoorden worden je merkverhaal: een helder verhaal, een site eromheen en de tools om in contact te blijven.',
    cards: [],
  },
  how: {
    eyebrow: 'Zo werkt het',
    title: 'Drie stops naar een site die werkt.',
    routeLabel: 'Je route: check, route, lancering',
    stops: ['Check', 'Route', 'Lancering'],
    cards: [
      { tag: 'Stop 1 · Check', t: 'Vertel over je bedrijf', p: 'Beantwoord een korte briefing over wie je helpt en hoe.' },
      { tag: 'Stop 2 · Route', t: 'Bekijk je site', p: 'Je krijgt een complete site met pagina\'s en teksten. Pas alles aan door erop te klikken of het te vragen.' },
      { tag: 'Stop 3 · Lancering', t: 'Publiceren', p: 'Ga live op je eigen domein, met formulieren en e-mail gekoppeld.' },
    ],
  },
  get: {
    eyebrow: 'Wat je krijgt',
    title: 'Alles wat je nodig hebt, in de volgorde waarin je het nodig hebt.',
    groups: [
      {
        t: 'Word gevonden',
        items: [
          'Je merkverhaal en een complete site, geschreven vanuit je briefing',
          'Je eigen domein',
          'Je site in maximaal 8 talen',
        ],
      },
      {
        t: 'Krijg aanmeldingen',
        items: ['Formulieren op elke pagina', 'Eén publiek, getagd op waar mensen zich aanmeldden', 'Toestemming en uitschrijven voor je geregeld'],
      },
      {
        t: 'Volg op',
        items: ['Nieuwsbrieven vanaf je eigen domein', 'Welkomstmails en automatische reeksen', 'Bezoeken, aanmeldingen en mailresultaten in één overzicht'],
      },
    ],
    note: 'In plaats van vijf losse tools (een sitebouwer, een formulierplugin, een nieuwsbrieftool, een SEO-plugin en statistieken) heb je één account.',
    more: 'Bekijk alle functies →',
  },
  proof: {
    eyebrow: 'Bewijs',
    title: 'Gemaakt met Webgnr.',
    text: 'Echte websites, geschreven vanuit een korte briefing en bewerkt in dezelfde editor die je net zag.',
    all: 'Bekijk alle voorbeelden →',
    label: 'Voorbeeldsite',
    name: 'GreenLeaf Bakery',
    place: 'Bakkerij · Amsterdam',
    tags: ['In minuten gemaakt', 'Nederlandse tekst', 'Werkt op telefoons'],
    altDesktop: 'De website van GreenLeaf Bakery op een computerscherm, openend met het probleem dat de bakkerij voor klanten oplost',
    altPhone: 'De website van GreenLeaf Bakery op een telefoon, met de kop en de bestelknop',
    stripTitle: 'Voorbeelden uit het mkb, gemaakt in Webgnr',
    inbox: { t: 'Gebouwd met respect voor de inbox.', link: 'E-mail van ons ontvangen? Zo zit het →', chips: ['Double opt-in (optioneel)', 'Makkelijk uitschrijven', 'Geverifieerde afzenders', 'Blokkadelijsten'] },
  },
  faq: {
    title: 'Veelgestelde vragen',
    items: [
      { q: 'Moet ik kunnen coderen of ontwerpen?', a: 'Nee. Je beschrijft je bedrijf en past aan door te klikken of een wijziging in gewone woorden te vragen.' },
      { q: 'Kan ik mijn eigen domein gebruiken?', a: 'Ja. Koppel het via de domeininstellingen van je site. De handleiding loopt elke stap door.' },
      { q: 'Is het veilig om e-mail via Webgnr te versturen?', a: 'Elke e-mail gaat naar mensen die zich aanmeldden, van een geverifieerde afzender, met een uitschrijflink in elk bericht.' },
    ],
  },
  cta: {
    title: 'Zie vandaag nog je site.',
    text: 'Elke dag zonder werkende site kiezen klanten voor iemand anders. Vertel over je bedrijf en wij bouwen de eerste versie.',
  },
};

export const HOME = { en, nl };
