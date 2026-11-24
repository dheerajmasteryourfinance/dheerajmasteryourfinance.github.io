// Legal pages: plain-language DRAFTS written from what the website and the app actually do.
// They are not reviewed by a legal adviser yet (the on-page notice says so). Keep every statement
// factual; do not add claims about hosting regions, retention periods or providers until confirmed.

type Section = { id: string; title: string; body: string };
type LegalDoc = { title: string; description: string; summary: string; sections: Section[] };
type LegalSet = { privacy: LegalDoc; terms: LegalDoc; cookies: LegalDoc };

const en: LegalSet = {
  privacy: {
    title: 'Privacy policy',
    description: 'Webgnr privacy policy.',
    summary: 'We collect only what we need to run Webgnr: your account details, what you build, and the messages you send us. We do not sell personal data. You can ask us at any time what we hold about you and have it corrected or deleted.',
    sections: [
      { id: 'who', title: 'Who we are', body: 'Webgnr is operated by Master Your Business (KvK 99530856), Steijnstraat 18, 2987 AS Ridderkerk, the Netherlands. For your own account and for messages you send us, we are the data controller. You can reach us through the contact form on our company page.' },
      { id: 'collect', title: 'What we collect', body: 'On this website: what you type into the early-access and contact forms (name, email address, an optional business name, the type of request and your message). In the Webgnr app: account details such as your name, email address and login details, the websites you build, the contact lists you upload or collect through your forms, records of the emails you send (delivery, bounces, unsubscribes and, where you switch it on, opens and clicks), and technical logs needed to keep the service secure.' },
      { id: 'why', title: 'Why we use it', body: 'To answer your requests and invite you to early access; to create and run your account and the websites and emails you build; to keep the service secure and prevent abuse such as spam; to improve the product; and to meet legal obligations. Our legal bases are performing our agreement with you, our legitimate interest in running a secure service, your consent where we ask for it (for example for analytics), and legal obligations.' },
      { id: 'recipients', title: 'Data about email recipients', body: 'When a business sends email with Webgnr to its own subscribers, that business decides who receives it and why, and Webgnr processes the list on its behalf as a processor. If you received such an email, the sending business is your first contact for questions about your data. Every email has an unsubscribe link, and we keep a record of unsubscribes, bounces and complaints so that those addresses are not emailed again.' },
      { id: 'sharing', title: 'Who we share it with', body: 'We do not sell personal data. We share it only with service providers that help us run Webgnr, such as hosting and email delivery, under agreements that protect the data, and with authorities when the law requires it.' },
      { id: 'retention', title: 'How long we keep it', body: 'We keep personal data only as long as we need it for the purposes above. Messages to us are deleted once they are handled. Account data is deleted after you close your account, except where we must keep it by law. Records of unsubscribes, bounces and complaints are kept so that those addresses are not emailed again.' },
      { id: 'rights', title: 'Your rights', body: 'You can ask us to see, correct, delete or restrict the personal data we hold about you, to object to its use, and to receive it in a portable form. Send your request through the contact form and we will reply. You can also complain to the Dutch Data Protection Authority (Autoriteit Persoonsgegevens).' },
      { id: 'changes', title: 'Changes to this policy', body: 'We update this page when our practices change. If a change significantly affects you, we will tell account holders by email before it takes effect.' },
    ],
  },
  terms: {
    title: 'Terms of service',
    description: 'Webgnr terms of service.',
    summary: 'Webgnr is for businesses that want to build a website and email people who agreed to hear from them. You keep ownership of your content; we keep the service running and set rules that protect email recipients.',
    sections: [
      { id: 'account', title: 'Your account', body: 'You use Webgnr for your business and give us accurate details. You are responsible for keeping your login secure and for what happens under your account. During early access, accounts are created by invitation.' },
      { id: 'acceptable', title: 'Acceptable use and email rules', body: 'Send email only to people who have agreed to receive it. No bought or rented lists and no spam. Every email must carry a working unsubscribe link and the sender’s identity, and unsubscribes must be honoured. Do not use Webgnr for anything illegal, misleading or harmful. We may pause sending or suspend an account if bounce or complaint rates are too high or these rules are broken.' },
      { id: 'content', title: 'Your content', body: 'Your website content and contact lists remain yours. You give us permission to store, display and send them as needed to run the service for you. You confirm that you have the right to use everything you put into Webgnr.' },
      { id: 'billing', title: 'Billing and cancellation', body: 'Terms for fees will be agreed with you before you are charged. We will not charge you without your agreement. You can stop using Webgnr at any time.' },
      { id: 'availability', title: 'Service availability', body: 'We work to keep Webgnr available and to give notice of planned maintenance, but we cannot promise it will always run without interruption. Keep your own copy of content you could not easily recreate.' },
      { id: 'liability', title: 'Liability', body: 'To the extent the law allows, we are not liable for indirect damage, and our total liability is limited to the amount you paid for Webgnr in the twelve months before the event. Nothing in these terms limits liability for intent or deliberate recklessness, or anything else the law does not allow us to limit.' },
      { id: 'ending', title: 'Ending the agreement', body: 'You can end the agreement at any time by closing your account. We can end or suspend it if you break these terms. After it ends we delete your data as described in the privacy policy, and you can ask us for a copy of your content first.' },
      { id: 'law', title: 'Governing law', body: 'Dutch law applies to these terms. Disputes go to the competent court in the Netherlands.' },
    ],
  },
  cookies: {
    title: 'Cookie policy',
    description: 'Webgnr cookie policy.',
    summary: 'This website sets no cookies and runs no analytics. The Webgnr app uses only the cookies it needs to work. Analytics on websites built with Webgnr run only after the visitor agrees.',
    sections: [
      { id: 'what', title: 'What cookies are', body: 'Cookies are small files that a website stores in your browser. They are used, for example, to keep you signed in or to remember a choice.' },
      { id: 'essential', title: 'Essential cookies', body: 'This website sets no cookies. The Webgnr app uses a small number of strictly necessary cookies, for example to keep you signed in and to show previews of unpublished websites. These cookies are needed for the service to work and do not require consent.' },
      { id: 'analytics', title: 'Analytics cookies', body: 'This website does not use analytics. Websites built with Webgnr can offer visitor analytics, and those only run after the visitor has agreed.' },
      { id: 'choices', title: 'Changing your choices', body: 'Because this website sets no cookies, there is nothing to switch off here. You can delete or block cookies in your browser settings. On a website that offers analytics, you can change your choice again through that website’s own cookie settings.' },
    ],
  },
};

const nl: LegalSet = {
  privacy: {
    title: 'Privacybeleid',
    description: 'Het privacybeleid van Webgnr.',
    summary: 'We verzamelen alleen wat we nodig hebben om Webgnr te laten werken: je accountgegevens, wat je bouwt en de berichten die je ons stuurt. We verkopen geen persoonsgegevens. Je kunt ons altijd vragen wat we van je hebben en dat laten corrigeren of verwijderen.',
    sections: [
      { id: 'who', title: 'Wie we zijn', body: 'Webgnr wordt aangeboden door Master Your Business (KvK 99530856), Steijnstraat 18, 2987 AS Ridderkerk, Nederland. Voor je eigen account en voor berichten die je ons stuurt zijn wij de verwerkingsverantwoordelijke. Je bereikt ons via het contactformulier op onze bedrijfspagina.' },
      { id: 'collect', title: 'Welke gegevens we verzamelen', body: 'Op deze website: wat je invult in de formulieren voor vroege toegang en contact (naam, e-mailadres, een optionele bedrijfsnaam, het soort aanvraag en je bericht). In de Webgnr-app: accountgegevens zoals je naam, e-mailadres en inloggegevens, de websites die je bouwt, de contactlijsten die je uploadt of via je formulieren verzamelt, gegevens over de e-mails die je verstuurt (bezorging, bounces, uitschrijvingen en, als je dat aanzet, openingen en kliks) en technische logs die nodig zijn om de dienst veilig te houden.' },
      { id: 'why', title: 'Waarvoor we ze gebruiken', body: 'Om je vragen te beantwoorden en je uit te nodigen voor vroege toegang; om je account en de websites en e-mails die je bouwt aan te maken en te laten werken; om de dienst veilig te houden en misbruik zoals spam te voorkomen; om het product te verbeteren; en om aan wettelijke verplichtingen te voldoen. Onze grondslagen zijn de uitvoering van onze overeenkomst met jou, ons gerechtvaardigd belang bij een veilige dienst, jouw toestemming waar we die vragen (bijvoorbeeld voor statistieken) en wettelijke verplichtingen.' },
      { id: 'recipients', title: 'Gegevens van e-mailontvangers', body: 'Als een bedrijf met Webgnr e-mail stuurt naar zijn eigen abonnees, bepaalt dat bedrijf wie de e-mail krijgt en waarom. Webgnr verwerkt de lijst dan als verwerker in opdracht van dat bedrijf. Heb je zo’n e-mail ontvangen, dan is het verzendende bedrijf je eerste aanspreekpunt voor vragen over je gegevens. Elke e-mail bevat een uitschrijflink en wij houden uitschrijvingen, bounces en klachten bij, zodat die adressen niet opnieuw worden gemaild.' },
      { id: 'sharing', title: 'Met wie we ze delen', body: 'We verkopen geen persoonsgegevens. We delen ze alleen met dienstverleners die ons helpen Webgnr te laten werken, zoals hosting en e-mailverzending, op basis van afspraken die de gegevens beschermen, en met autoriteiten als de wet dat vereist.' },
      { id: 'retention', title: 'Hoe lang we ze bewaren', body: 'We bewaren persoonsgegevens alleen zolang we ze nodig hebben voor de doelen hierboven. Berichten aan ons verwijderen we zodra ze zijn afgehandeld. Accountgegevens verwijderen we nadat je je account hebt opgezegd, behalve als we ze volgens de wet moeten bewaren. Gegevens over uitschrijvingen, bounces en klachten bewaren we, zodat die adressen niet opnieuw worden gemaild.' },
      { id: 'rights', title: 'Jouw rechten', body: 'Je kunt ons vragen je persoonsgegevens in te zien, te corrigeren, te verwijderen of te beperken, bezwaar te maken tegen het gebruik ervan en ze in een overdraagbaar formaat te ontvangen. Stuur je verzoek via het contactformulier, dan antwoorden we je. Je kunt ook een klacht indienen bij de Autoriteit Persoonsgegevens.' },
      { id: 'changes', title: 'Wijzigingen in dit beleid', body: 'We passen deze pagina aan als onze werkwijze verandert. Heeft een wijziging merkbaar gevolgen voor je, dan laten we accounthouders dat per e-mail weten voordat de wijziging ingaat.' },
    ],
  },
  terms: {
    title: 'Algemene voorwaarden',
    description: 'De algemene voorwaarden van Webgnr.',
    summary: 'Webgnr is voor bedrijven die een website willen bouwen en mensen willen mailen die daarvoor toestemming gaven. Jouw content blijft van jou; wij houden de dienst draaiende en stellen regels die e-mailontvangers beschermen.',
    sections: [
      { id: 'account', title: 'Je account', body: 'Je gebruikt Webgnr voor je bedrijf en geeft ons juiste gegevens. Je bent verantwoordelijk voor de veiligheid van je inlog en voor alles wat onder je account gebeurt. Tijdens de vroege toegang worden accounts op uitnodiging aangemaakt.' },
      { id: 'acceptable', title: 'Toegestaan gebruik en regels voor e-mail', body: 'Stuur alleen e-mail naar mensen die daarvoor toestemming gaven. Geen gekochte of gehuurde lijsten en geen spam. Elke e-mail moet een werkende uitschrijflink en de identiteit van de afzender bevatten, en uitschrijvingen moeten worden gerespecteerd. Gebruik Webgnr niet voor iets wat onwettig, misleidend of schadelijk is. We kunnen het versturen pauzeren of een account opschorten als te veel e-mails bouncen of als spam worden gemeld, of als deze regels worden overtreden.' },
      { id: 'content', title: 'Jouw content', body: 'De inhoud van je website en je contactlijsten blijven van jou. Je geeft ons toestemming ze op te slaan, te tonen en te versturen voor zover nodig om de dienst voor jou uit te voeren. Je bevestigt dat je het recht hebt alles te gebruiken wat je in Webgnr zet.' },
      { id: 'billing', title: 'Betalen en opzeggen', body: 'De voorwaarden voor kosten spreken we met je af voordat we je iets in rekening brengen. We rekenen niets af zonder jouw akkoord. Je kunt Webgnr op elk moment stoppen met gebruiken.' },
      { id: 'availability', title: 'Beschikbaarheid van de dienst', body: 'We doen ons best Webgnr beschikbaar te houden en gepland onderhoud aan te kondigen, maar we kunnen niet beloven dat de dienst altijd zonder onderbreking werkt. Bewaar zelf een kopie van content die je niet makkelijk opnieuw kunt maken.' },
      { id: 'liability', title: 'Aansprakelijkheid', body: 'Voor zover de wet het toestaat, zijn we niet aansprakelijk voor indirecte schade en is onze totale aansprakelijkheid beperkt tot het bedrag dat je in de twaalf maanden voor de gebeurtenis voor Webgnr hebt betaald. Niets in deze voorwaarden beperkt aansprakelijkheid voor opzet of bewuste roekeloosheid, of voor iets anders wat de wet ons niet laat beperken.' },
      { id: 'ending', title: 'Einde van de overeenkomst', body: 'Je kunt de overeenkomst op elk moment beëindigen door je account op te zeggen. Wij kunnen haar beëindigen of opschorten als je deze voorwaarden overtreedt. Daarna verwijderen we je gegevens zoals beschreven in het privacybeleid, en je kunt ons eerst om een kopie van je content vragen.' },
      { id: 'law', title: 'Toepasselijk recht', body: 'Op deze voorwaarden is Nederlands recht van toepassing. Geschillen worden voorgelegd aan de bevoegde rechter in Nederland.' },
    ],
  },
  cookies: {
    title: 'Cookiebeleid',
    description: 'Het cookiebeleid van Webgnr.',
    summary: 'Deze website plaatst geen cookies en gebruikt geen statistieken. De Webgnr-app gebruikt alleen de cookies die nodig zijn om te werken. Statistieken op websites die met Webgnr zijn gemaakt, werken pas nadat de bezoeker toestemming geeft.',
    sections: [
      { id: 'what', title: 'Wat cookies zijn', body: 'Cookies zijn kleine bestanden die een website in je browser opslaat. Ze worden bijvoorbeeld gebruikt om je ingelogd te houden of een keuze te onthouden.' },
      { id: 'essential', title: 'Noodzakelijke cookies', body: 'Deze website plaatst geen cookies. De Webgnr-app gebruikt een klein aantal strikt noodzakelijke cookies, bijvoorbeeld om je ingelogd te houden en om voorbeelden van nog niet gepubliceerde websites te tonen. Deze cookies zijn nodig om de dienst te laten werken en vragen geen toestemming.' },
      { id: 'analytics', title: 'Analytische cookies', body: 'Deze website gebruikt geen statistieken. Websites die met Webgnr zijn gemaakt kunnen bezoekersstatistieken aanbieden, en die werken pas nadat de bezoeker toestemming heeft gegeven.' },
      { id: 'choices', title: 'Je keuze aanpassen', body: 'Omdat deze website geen cookies plaatst, valt hier niets uit te zetten. In de instellingen van je browser kun je cookies verwijderen of blokkeren. Op een website die statistieken aanbiedt, kun je je keuze opnieuw aanpassen via de eigen cookie-instellingen van die website.' },
    ],
  },
};

export const LEGAL = { en, nl };
export type LegalPage = keyof LegalSet;
