// Home page copy. Dutch is written for Dutch small-business owners, not translated
// word for word; every fact matches the English.

const en = {
  title: 'WebGen: your website, built for you',
  description: 'Describe your business and WebGen builds a complete site with forms, newsletters and search basics ready to go.',
  hero: {
    switchLabel: 'Who are you building for',
    business: 'For businesses',
    agency: 'For agencies',
    h1Business: ['Your website, built for you.', 'Marketing included.'],
    h1Agency: ['Ship client sites faster.', 'Send email as the client.'],
    ledeBusiness: 'Describe your business and get a complete site with forms, newsletters and search basics ready to go. No designer, no developer, no extra tools.',
    ledeAgency: 'Generate, edit and publish for every client from one account. Each client keeps their own domain, sender identity, audience and reports.',
    cta: 'Request early access',
    example: 'See an example',
    chips: ['Optional double opt-in', 'Easy unsubscribe', 'Your own domain'],
  },
  product: {
    label: 'Product preview',
    alt: 'The WebGen editor in Edit mode, showing the GreenLeaf Bakery homepage with its headline selected and the text toolbar above it',
  },
  examples: {
    title: 'Built with WebGen',
    altDesktop: 'The GreenLeaf Bakery website on a desktop screen, opening on the problem it solves for its customers',
    altPhone: 'The GreenLeaf Bakery website on a phone, with its headline and order button',
    label: 'Example site',
    name: 'GreenLeaf Bakery',
    place: 'Amsterdam bakery',
    pending: '[CONFIRM: customer site + permission]',
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
    text: 'That is why WebGen asks about your customers, not about code. Your answers are turned into a clear message, a site built around it, and the tools to keep in touch.',
    cards: [
      { t: 'Written with a proven story framework', p: '[CONFIRM: name StoryBrand publicly]' },
      { t: 'Trusted by real businesses', p: '[PROOF: Master Your Business and Mastercrest Games sites, if agreed]' },
    ],
  },
  value: {
    eyebrow: 'Everything in one place',
    title: 'A website is the start. Growing from it is the point.',
    wideTitle: 'Launch without a designer',
    wideText: 'Pages, copy and layout in minutes. Then change anything by clicking it, or by asking in a sentence.',
    pills: ['Home', 'About', 'Services', 'Contact', '+ New page'],
    wideAlt: 'The AI assistant panel open beside the GreenLeaf Bakery homepage, ready for a request such as a new section',
    darkTitle: 'Stay in touch with every lead',
    darkText: 'Campaigns and automated sequences sent from your own domain, with consent and unsubscribe handled for you.',
    seq: [['Welcome email', 'Day 0'], ['Getting started tips', 'Day 2'], ['Special offer', 'Day 7']],
    small: [
      { t: 'Know who is interested', p: 'Every form feeds one audience, tagged by where people signed up.' },
      { t: 'Get found by customers', p: 'Sitemap, search tags and structured data, generated and kept current. [CONFIRM: ships with the SEO release]' },
      { t: 'See what works', p: 'Visits, sign-ups and email results in one view, with visitor consent respected.' },
    ],
    more: 'Explore all features →',
  },
  plan: {
    eyebrow: 'How it works',
    title: 'Three steps to a site that works.',
    steps: [
      { t: 'Tell us about your business', p: 'Answer a short brief about who you serve and how you help them.' },
      { t: 'Review your site', p: 'Get a full site with pages and copy. Change anything by clicking it or asking.' },
      { t: 'Publish', p: 'Go live on your domain with forms and email connected.' },
    ],
  },
  audience: {
    businessTitle: 'For owners who would rather run the business than the website.',
    business: [
      { t: 'One place for everything', p: 'Site, leads and email live together, so nothing falls between tools.' },
      { t: 'No jargon', p: 'Plain-language steps and sensible defaults from the first minute.' },
      { t: 'Grows with you', p: 'Start with a page. Add a newsletter and follow-ups when you are ready.' },
    ],
    agencyTitle: 'For agencies who manage many clients without many logins.',
    agency: [
      { t: 'Every client kept apart', p: 'Each client has their own site, audience and reports.' },
      { t: 'Send as the client', p: 'Emails go out from the client\'s own domain and name, not yours.' },
      { t: 'Hand over when ready', p: '[CONFIRM: site and account hand-over to the client]' },
    ],
  },
  stakes: {
    eyebrow: 'What is at stake',
    title: 'Every day without a site that works is a day customers choose someone else.',
    withoutTitle: 'Without a site that works',
    without: [
      'Customers pick a competitor who looks more established',
      'Interested people leave with no way to follow up',
      'Evenings lost wrestling with tools instead of serving customers',
    ],
    withTitle: 'With WebGen',
    with: [
      'A professional site you are proud to share',
      'Every sign-up captured and followed up automatically',
      'Your site, audience and email in one place',
    ],
  },
  responsible: {
    eyebrow: 'Responsible email',
    title: 'Built to respect the inbox.',
    text: 'Every email sent through WebGen goes to people who asked for it, from a sender that is verified, with a working way out.',
    link: 'Got an email from us? Here is why →',
    cards: [
      { t: 'Optional double opt-in', p: 'Turn it on so subscribers confirm before they get anything.' },
      { t: 'Easy unsubscribe', p: 'An unsubscribe link in every email, honoured right away.' },
      { t: 'Verified senders', p: 'Sending domains are checked before use.' },
      { t: 'Suppression lists', p: 'Bounces and complaints are never mailed again.' },
    ],
  },
  learn: {
    eyebrow: 'Learn',
    title: 'Guides for every step.',
    all: 'Browse all docs →',
    cards: [
      { slug: 'build-your-first-website', tag: 'Getting started', title: 'Build your first site', text: 'From brief to published, step by step.' },
      { slug: 'connect-your-domain', tag: 'Domains', title: 'Connect your domain', text: 'Point your address at your site.' },
      { slug: 'send-a-campaign', tag: 'Email', title: 'Send your first newsletter', text: 'Set up a sender and reach your audience.' },
      { slug: 'follow-up-emails', tag: 'Email', title: 'Automate a welcome sequence', text: 'Greet every new subscriber on time.' },
    ],
  },
  faq: {
    title: 'Questions',
    items: [
      { q: 'Do I need to know how to code or design?', a: 'No. You describe the business and edit by clicking or asking for changes in plain words.' },
      { q: 'Can I use my own domain?', a: 'Yes. Connect it from your site\'s Domain settings. The docs walk through each step.' },
      { q: 'Who owns my content and contact list?', a: '[CONFIRM: ownership and export wording]' },
    ],
    email: {
      q: 'I got an email from a WebGen site. Why?',
      a: 'Businesses use WebGen to email people who signed up on their site.',
      link: 'Read how it works and how to unsubscribe.',
    },
  },
  cta: {
    title: 'See your site today.',
    text: 'Describe your business. We will build the first version.',
  },
};

const nl: typeof en = {
  title: 'WebGen: je website, voor je gebouwd',
  description: 'Vertel wat je bedrijf doet en WebGen bouwt een complete website, met formulieren, nieuwsbrieven en de basis voor vindbaarheid al geregeld.',
  hero: {
    switchLabel: 'Voor wie bouw je?',
    business: 'Voor bedrijven',
    agency: 'Voor bureaus',
    h1Business: ['Je website, voor je gebouwd.', 'Marketing zit erbij.'],
    h1Agency: ['Sneller klantsites opleveren.', 'Mailen uit naam van je klant.'],
    ledeBusiness: 'Vertel wat je bedrijf doet en krijg een complete website, met formulieren, nieuwsbrieven en de basis voor vindbaarheid al geregeld. Zonder ontwerper, zonder developer, zonder losse tools.',
    ledeAgency: 'Genereer, bewerk en publiceer voor al je klanten vanuit één account. Elke klant houdt een eigen domein, afzender, doelgroep en rapportages.',
    cta: 'Vraag vroege toegang aan',
    example: 'Bekijk een voorbeeld',
    chips: ['Dubbele opt-in als je wilt', 'Makkelijk afmelden', 'Je eigen domein'],
  },
  product: {
    label: 'Voorbeeld van het product',
    alt: 'De WebGen-editor in de bewerkmodus, met de homepage van GreenLeaf Bakery: de kop is geselecteerd en de tekstwerkbalk staat erboven (Engelse weergave)',
  },
  examples: {
    title: 'Gemaakt met WebGen',
    altDesktop: 'De website van GreenLeaf Bakery op een groot scherm, die opent met het probleem dat de bakkerij voor haar klanten oplost',
    altPhone: 'De website van GreenLeaf Bakery op een telefoon, met de kop en de bestelknop',
    label: 'Voorbeeldsite',
    name: 'GreenLeaf Bakery',
    place: 'Bakkerij in Amsterdam',
    pending: '[CONFIRM: customer site + permission]',
  },
  problem: {
    eyebrow: 'Herkenbaar?',
    title: 'Online gaan zou geen dik budget of techteam moeten vragen.',
    cards: [
      { t: '“Ik weet niet waar ik moet beginnen.”', p: 'Hosting, templates, plug-ins, e-mailtools. Elke keuze levert weer vijf nieuwe op.' },
      { t: '“Een ontwerper én een developer kan ik niet betalen.”', p: 'Een maatwerksite met marketingtools kan meer kosten dan een klein bedrijf in een jaar uitgeeft.' },
      { t: '“Straks ziet het er amateuristisch uit.”', p: 'Naast concurrenten met een strakke site kost een zwakke site je de klant.' },
    ],
  },
  guide: {
    title: 'Je tijd hoort bij je bedrijf, niet bij het leren van websitetools. Dat snappen we.',
    text: 'Daarom vraagt WebGen naar je klanten, niet naar code. Van je antwoorden maken we een helder verhaal, een website die daaromheen is gebouwd en de tools om contact te houden.',
    cards: [
      { t: 'Geschreven met een beproefde verhaalstructuur', p: '[CONFIRM: name StoryBrand publicly]' },
      { t: 'In gebruik bij echte bedrijven', p: '[PROOF: Master Your Business and Mastercrest Games sites, if agreed]' },
    ],
  },
  value: {
    eyebrow: 'Alles op één plek',
    title: 'Een website is het begin. Groeien is het doel.',
    wideTitle: 'Online zonder ontwerper',
    wideText: 'Pagina’s, teksten en opmaak in een paar minuten. Daarna pas je alles aan door erop te klikken, of door het in één zin te vragen.',
    pills: ['Home', 'Over ons', 'Diensten', 'Contact', '+ Nieuwe pagina'],
    wideAlt: 'Het paneel van de AI-assistent naast de homepage van GreenLeaf Bakery, klaar voor een verzoek zoals een nieuwe sectie (Engelse weergave)',
    darkTitle: 'Blijf in contact met elke lead',
    darkText: 'Campagnes en automatische e-mailreeksen vanaf je eigen domein. Toestemming en afmelden regelen we voor je.',
    seq: [['Welkomstmail', 'Dag 0'], ['Tips om te beginnen', 'Dag 2'], ['Speciale aanbieding', 'Dag 7']],
    small: [
      { t: 'Zie wie interesse heeft', p: 'Elk formulier komt uit in één doelgroep, met een tag voor de plek waar iemand zich aanmeldde.' },
      { t: 'Gevonden worden door klanten', p: 'Sitemap, zoektags en gestructureerde data, automatisch gemaakt en actueel gehouden. [CONFIRM: ships with the SEO release]' },
      { t: 'Zie wat werkt', p: 'Bezoeken, aanmeldingen en e-mailresultaten in één overzicht, met respect voor de toestemming van je bezoekers.' },
    ],
    more: 'Bekijk alle functies →',
  },
  plan: {
    eyebrow: 'Zo werkt het',
    title: 'In drie stappen een website die werkt.',
    steps: [
      { t: 'Vertel over je bedrijf', p: 'Vul een korte briefing in: voor wie je werkt en hoe je ze helpt.' },
      { t: 'Bekijk je website', p: 'Je krijgt een complete site met pagina’s en teksten. Pas alles aan door te klikken of het te vragen.' },
      { t: 'Publiceer', p: 'Ga live op je domein, met formulieren en e-mail al gekoppeld.' },
    ],
  },
  audience: {
    businessTitle: 'Voor ondernemers die liever hun bedrijf runnen dan hun website.',
    business: [
      { t: 'Eén plek voor alles', p: 'Website, leads en e-mail zitten bij elkaar, dus er valt niets tussen twee tools in.' },
      { t: 'Geen vakjargon', p: 'Stappen in gewone taal en handige standaardinstellingen, vanaf de eerste minuut.' },
      { t: 'Groeit met je mee', p: 'Begin met één pagina. Voeg een nieuwsbrief en vervolgmails toe als je eraan toe bent.' },
    ],
    agencyTitle: 'Voor bureaus met veel klanten, zonder stapel logins.',
    agency: [
      { t: 'Elke klant apart', p: 'Elke klant heeft een eigen site, doelgroep en rapportages.' },
      { t: 'Versturen als de klant', p: 'E-mails gaan uit vanaf het domein en de naam van je klant, niet die van jou.' },
      { t: 'Overdragen als het af is', p: '[CONFIRM: site and account hand-over to the client]' },
    ],
  },
  stakes: {
    eyebrow: 'Wat er op het spel staat',
    title: 'Elke dag zonder een website die werkt, kiezen klanten voor een ander.',
    withoutTitle: 'Zonder een website die werkt',
    without: [
      'Klanten kiezen een concurrent die professioneler overkomt',
      'Geïnteresseerden haken af en je kunt ze niet meer opvolgen',
      'Je avonden gaan op aan gedoe met tools in plaats van aan je klanten',
    ],
    withTitle: 'Met WebGen',
    with: [
      'Een professionele site die je met trots laat zien',
      'Elke aanmelding vastgelegd en automatisch opgevolgd',
      'Je website, doelgroep en e-mail op één plek',
    ],
  },
  responsible: {
    eyebrow: 'Verantwoord mailen',
    title: 'Gebouwd met respect voor de inbox.',
    text: 'Elke e-mail via WebGen gaat naar mensen die erom vroegen, komt van een geverifieerde afzender en heeft een afmeldlink die werkt.',
    link: 'Mail van ons gekregen? Lees hier waarom →',
    cards: [
      { t: 'Dubbele opt-in als je wilt', p: 'Zet het aan, dan bevestigen nieuwe inschrijvers eerst voordat ze iets ontvangen.' },
      { t: 'Makkelijk afmelden', p: 'Een afmeldlink in elke e-mail, en een afmelding gaat direct in.' },
      { t: 'Geverifieerde afzenders', p: 'We controleren verzenddomeinen voordat ze gebruikt worden.' },
      { t: 'Blokkeerlijsten', p: 'Wie bouncet of een klacht indient, krijgt nooit meer mail.' },
    ],
  },
  learn: {
    eyebrow: 'Hulp',
    title: 'Een handleiding voor elke stap.',
    all: 'Alle handleidingen →',
    cards: [
      { slug: 'build-your-first-website', tag: 'Aan de slag', title: 'Bouw je eerste website', text: 'Van briefing tot online, stap voor stap.' },
      { slug: 'connect-your-domain', tag: 'Domeinen', title: 'Koppel je domein', text: 'Laat je eigen webadres naar je site wijzen.' },
      { slug: 'send-a-campaign', tag: 'E-mail', title: 'Verstuur je eerste nieuwsbrief', text: 'Stel een afzender in en bereik je doelgroep.' },
      { slug: 'follow-up-emails', tag: 'E-mail', title: 'Automatiseer een welkomstreeks', text: 'Verwelkom elke nieuwe inschrijver op tijd.' },
    ],
  },
  faq: {
    title: 'Veelgestelde vragen',
    items: [
      { q: 'Moet ik kunnen programmeren of ontwerpen?', a: 'Nee. Je beschrijft je bedrijf en past alles aan door te klikken, of door in gewone woorden om een wijziging te vragen.' },
      { q: 'Kan ik mijn eigen domein gebruiken?', a: 'Ja. Koppel het via de domeininstellingen van je site. De handleiding neemt je stap voor stap mee.' },
      { q: 'Van wie zijn mijn content en mijn contactlijst?', a: '[CONFIRM: ownership and export wording]' },
    ],
    email: {
      q: 'Ik kreeg een e-mail van een WebGen-site. Waarom?',
      a: 'Bedrijven gebruiken WebGen om mensen te mailen die zich op hun website hebben aangemeld.',
      link: 'Lees hoe het werkt en hoe je je afmeldt.',
    },
  },
  cta: {
    title: 'Zie je website vandaag nog.',
    text: 'Vertel wat je bedrijf doet. Wij bouwen de eerste versie.',
  },
};

export const HOME = { en, nl };
