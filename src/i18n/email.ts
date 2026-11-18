// "Got an email sent with WebGen?" page copy (canvas EmailInfo*.dc.html).
// The corrected facts (unsubscribe needs a confirmation click but no sign-in; double opt-in depends on
// the business) are kept from the earlier review, in both languages.

const en = {
  title: 'Got an email sent with WebGen?',
  description: 'Who sent it, why it reached you, and how to stop it.',
  eyebrow: 'For email recipients',
  h1: 'Got an email sent with WebGen?',
  lede: 'Here is who sent it, why it reached you, and how to stop it.',
  stop: {
    title: 'Want to stop these emails?',
    lead: 'Open the email and click ',
    unsub: 'Unsubscribe',
    mid: ' at the bottom. Click ',
    unsub2: 'Unsubscribe',
    tail: ', then confirm on the page that opens. You will not need to sign in. Many mail apps also show their own Unsubscribe button.',
    mockLabel: 'Example email footer',
    mockLine1: 'You are receiving this because you signed up at sunrisebakery.com.',
    mockUnsub: 'Unsubscribe',
    mockLine2: ' · Sunrise Bakery, 12 High St',
  },
  who: { title: 'Who sent it', text: 'WebGen is a website and email platform. Businesses use it to run their website and to email the people who signed up there. The email came from that business, not from WebGen itself. Their name and address are in the email\'s footer.' },
  why: { title: 'Why it reached you', text: 'Most likely you filled in a form on that business\'s website, such as a newsletter sign-up, a contact form or a free download. If the business asks new subscribers to confirm, you would also have clicked a confirmation link first.' },
  rules: {
    title: 'What we require of every sender',
    cards: [
      { t: 'Permission', p: 'Only people who signed up. No bought or rented lists.' },
      { t: 'A real identity', p: 'A verified sending domain and the sender\'s details in every email.' },
      { t: 'An easy way out', p: 'An unsubscribe link in every email, honoured straight away.' },
      { t: 'No repeat mail', p: 'Unsubscribes, bounces and complaints are blocked from future sends.' },
    ],
    policy: '[CONFIRM: link to the acceptable use policy once written]',
  },
  spam: { title: 'Think it is spam?', lead: 'If you never signed up, tell us. Forward the email to ', abuse: '[ABUSE EMAIL]', tail: ' as an attachment if you can, so we can see where it came from. We look into every report and stop senders who break our rules.' },
  help: { title: 'Still need help?', text: 'A person will reply within [RESPONSE TIME].', link: 'Contact us' },
  marquee: ['Website', 'Forms', 'Newsletters', 'Your own domain', 'Follow-up emails', 'Search basics', 'Reports'],
};

const nl: typeof en = {
  title: 'E-mail ontvangen die met WebGen is verstuurd?',
  description: 'Wie hem stuurde, waarom je hem kreeg en hoe je hem stopt.',
  eyebrow: 'Voor ontvangers van e-mail',
  h1: 'E-mail ontvangen die met WebGen is verstuurd?',
  lede: 'Hier lees je wie hem stuurde, waarom je hem kreeg en hoe je ze stopt.',
  stop: {
    title: 'Wil je deze e-mails stoppen?',
    lead: 'Open de e-mail en klik onderaan op ',
    unsub: 'Uitschrijven',
    mid: '. Klik op ',
    unsub2: 'Uitschrijven',
    tail: ' en bevestig daarna op de pagina die opent. Je hoeft niet in te loggen. In veel mailapps vind je ook een eigen knop om je uit te schrijven.',
    mockLabel: 'Voorbeeld van een e-mailvoettekst',
    mockLine1: 'Je ontvangt dit omdat je je hebt aangemeld op bakkerijzonnestraal.nl.',
    mockUnsub: 'Uitschrijven',
    mockLine2: ' · Bakkerij Zonnestraal, Hoofdstraat 12',
  },
  who: { title: 'Wie het verstuurde', text: 'WebGen is een platform voor websites en e-mail. Bedrijven gebruiken het om hun website te runnen en de mensen te mailen die zich daar aanmeldden. De e-mail kwam van dat bedrijf, niet van WebGen zelf. Hun naam en adres staan onderaan de e-mail.' },
  why: { title: 'Waarom je hem kreeg', text: 'Waarschijnlijk vulde je een formulier in op de website van dat bedrijf, zoals een nieuwsbriefaanmelding, een contactformulier of een gratis download. Als het bedrijf nieuwe inschrijvers vraagt om te bevestigen, klikte je ook eerst op een bevestigingslink.' },
  rules: {
    title: 'Wat we van elke afzender eisen',
    cards: [
      { t: 'Toestemming', p: 'Alleen mensen die zich aanmeldden. Geen gekochte of gehuurde lijsten.' },
      { t: 'Een echte identiteit', p: 'Een geverifieerd verzenddomein en de gegevens van de afzender in elke e-mail.' },
      { t: 'Makkelijk uitschrijven', p: 'Een uitschrijflink in elke e-mail, direct verwerkt.' },
      { t: 'Geen herhaling', p: 'Uitschrijvingen, bounces en klachten worden geblokkeerd voor toekomstige verzendingen.' },
    ],
    policy: '[BEVESTIG: link naar het gebruiksbeleid zodra dat er is]',
  },
  spam: { title: 'Denk je dat het spam is?', lead: 'Heb je je nooit aangemeld? Laat het ons weten. Stuur de e-mail door naar ', abuse: '[ABUSE EMAIL]', tail: ', het liefst als bijlage, zodat we zien waar hij vandaan komt. We onderzoeken elke melding en stoppen afzenders die onze regels overtreden.' },
  help: { title: 'Nog hulp nodig?', text: 'Een mens antwoordt binnen [REACTIETIJD].', link: 'Neem contact op' },
  marquee: ['Website', 'Formulieren', 'Nieuwsbrieven', 'Eigen domein', 'Vervolgmails', 'Zoekbasis', 'Statistieken'],
};

export const EMAIL_INFO = { en, nl };
