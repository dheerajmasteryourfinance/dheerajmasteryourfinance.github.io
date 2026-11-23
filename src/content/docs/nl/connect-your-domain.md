---
title: "Koppel je domein"
description: "Gebruik je eigen webadres voor je WebGen-site, door een domein via WebGen te kopen of een domein te koppelen dat je al hebt."
group: domains
order: 1
minutes: 10
updated: 2026-11-11
---

<div class="callout"><strong>Voor je begint:</strong> zorg dat je site klaarstaat om te publiceren. Heb je al een domein, houd dan de inloggegevens klaar van de plek waar de DNS wordt beheerd, vaak je domeinprovider.</div>

## 1. Open het tabblad Domein

Open je site, klik op **Beheren** en dan op het tabblad **Domein**. Bovenaan zie je je **Gratis webadres**. Klik op **Wijzigen** om een ander te kiezen. WebGen laat weten of een naam **Beschikbaar!** is of al bezet, en stelt alternatieven voor.

Je kunt dezelfde keuzes ook bij het publiceren bereiken: na je eerste keer publiceren vraagt WebGen **Een eigen domein erbij?** en biedt **Domein kopen via ons**, **Ik heb al een domein** en **Misschien later** aan.

## 2a. Koop een domein via WebGen

Typ onder **Domein kopen via ons** een naam in bij **Domeinnaam** en klik op **Zoeken**. Namen die niet vrij zijn, tonen **Bezet**. Klik op **Kopen** naast de naam die je wilt.

De domeinregistratie vraagt om enkele gegevens: voor- en achternaam, straat, huisnummer, postcode, plaats, telefoonnummer en land (als code van 2 letters). Ze worden alleen voor deze registratie gebruikt. Klik op **Aankoop bevestigen** om af te ronden.

## 2b. Koppel een domein dat je al hebt

Typ onder **Ik heb al een domein** het domein in bij **Je eigen domein**. Of je het www-voorvoegsel typt, maakt niet uit. Klik op **Koppelen**.

WebGen toont dan de DNS-records die je moet toevoegen op de plek waar je je domein beheert. Elk record heeft bij je provider drie aparte velden, **Type**, **Naam / Host** en **Waarde / Inhoud**, dus vul ze één voor één in in plaats van de hele regel in één vak te plakken. Gebruik **Kopiëren** naast elke waarde.

- **A-records** laten je domein naar WebGen wijzen. Hiermee werkt je site op zowel je domein als de www-versie.
- **Een TXT-record** bewijst dat het domein van jou is. Vraagt je provider alleen om het deel vóór je domeinnaam, vul dan `_wg-verify` in als naam. De meeste providers vullen de rest zelf aan.

## 3. Verifieer

Zijn de records bij je provider opgeslagen, klik dan op **Verifiëren**. Kan WebGen het TXT-record nog niet vinden, dan zie je **Verificatie mislukt. Controleer het TXT-record en probeer het opnieuw.** Controleer of het precies zo is ingevuld als getoond, wacht even en probeer het opnieuw.

DNS-wijzigingen kunnen even duren voor ze zichtbaar zijn.

Werkt het, dan staat er **Geverifieerd en live.** Is je site nog niet gepubliceerd, dan staat er dat hij live gaat zodra je publiceert.

## 4. Publiceer opnieuw

Staat er dat je domein live gaat zodra je publiceert, klik dan op **Publiceren** zodat het je site gaat tonen. Je gratis adres blijft werken.

## Bedenk je je?

- **Eigen domein verwijderen** koppelt het los. Je site blijft live op het gratis webadres.
- **Domein verplaatsen** toont een transfercode die je aan een nieuwe registrar kunt geven.

<div class="callout callout-tip"><strong>Tip:</strong> is een domein al gekoppeld aan een ander WebGen-account, dan zie je daar een melding over. Neem contact met ons op als je denkt dat dit een vergissing is.</div>

## Volgende stappen

<div class="next-grid">
<a class="next-card" href="/nl/docs/set-up-your-sender/"><strong>Stel je afzender in</strong><span>Mail vanaf je eigen adres.</span></a>
<a class="next-card" href="/nl/docs/forms-and-leads/"><strong>Formulieren en leads</strong><span>Zie wie contact opneemt.</span></a>
</div>
