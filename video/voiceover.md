# Voiceover script (for a real voice)

The video works without a voice: the music bed carries it. This script is for a later version
with a voiceover. It is timed to the cuts, so a voice actor (or a good AI voice such as ElevenLabs,
if you have an account) can record it to picture. Aim for a warm, confident, unhurried read:
about 120 words a minute, with the music ducked about 8 dB under the voice.

The Windows voices on this machine (David, Zira, Hazel, ...) sound robotic and have no Dutch,
so they aren't used.

## English

| Time | Picture | Line |
|---|---|---|
| 0.5–3.5 | "Every business has a story." | Every business has a story. |
| 5.0–8.5 | Template falls apart | But most websites... don't tell it. |
| 10.3–12.5 | Logo reveal | Meet Webgnr. Brand story sites. |
| 13.5–21 | Brief fills in | Just describe your business: who you serve, what gets in their way, and how you help. Or upload your brand guide. |
| 22.5–29 | Story card, headline | Webgnr turns your answers into your brand story... |
| 30.5–39 | Site assembles, edit, language flip | ...and a website that tells it. Click any text to change it. In your language, on your own domain. |
| 40.5–49 | Sign-up, audience, emails | Forms and email are ready from day one, so every visitor who signs up hears from you. |
| 50–54.5 | Triad | Get found. Get signed up. Follow up. |
| 55.5–59 | End card | Start your free fourteen-day trial at website-generator.nl. |

## Nederlands

| Tijd | Beeld | Tekst |
|---|---|---|
| 0.5–3.5 | "Elk bedrijf heeft een verhaal." | Elk bedrijf heeft een verhaal. |
| 5.0–8.5 | Sjabloon valt uit elkaar | Maar de meeste websites... vertellen het niet. |
| 10.3–12.5 | Logo | Maak kennis met Webgnr. Sites vanuit je merkverhaal. |
| 13.5–21 | Briefing | Beschrijf je bedrijf: voor wie je werkt, waar ze tegenaan lopen en hoe je ze helpt. Of upload je merkgids. |
| 22.5–29 | Verhaal, kop | Webgnr maakt van je antwoorden je merkverhaal... |
| 30.5–39 | Site, bewerken, taal | ...en een website die het vertelt. Klik op een tekst om hem aan te passen. In jouw taal, op je eigen domein. |
| 40.5–49 | Aanmelding, publiek, e-mails | Formulieren en e-mail staan vanaf dag één klaar, zodat elke bezoeker die zich aanmeldt van je hoort. |
| 50–54.5 | Drieluik | Word gevonden. Krijg aanmeldingen. Volg op. |
| 55.5–59 | Eindkaart | Start je gratis proefperiode van veertien dagen op website-generator.nl. |

## Mixing a recorded voice in

    ffmpeg -i video/out/webgnr-intro-en-1080p.mp4 -i video/out/webgnr-intro-music.wav -i vo-en.wav \
      -filter_complex "[1:a][2:a]sidechaincompress=threshold=0.05:ratio=8:attack=20:release=300[m];[m][2:a]amix=inputs=2:normalize=0,loudnorm=I=-14:TP=-1[a]" \
      -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k -t 60 -movflags +faststart webgnr-intro-en-vo.mp4
