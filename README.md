# Kielen oppiminen

Tutkimuspohjainen kielen oppimispeli englannille, suomelle ja ruotsille. Mukana SRS-pohjainen kertaus, monipuoliset harjoitustyypit (tunnistus, kirjoitus, järjestäminen, kuuntelu, ääneen lukeminen), käsikirjoitetut keskustelut sekä vapaa LLM-pohjainen keskustelu, ja koko sanaston visualisoiva **galaksinäkymä**.

## Käynnistys

```bash
# vaihtoehto 1: ilman Node:a
python3 -m http.server 8080

# vaihtoehto 2: npm
npm install
npm start
```

Avaa selaimessa http://localhost:8080.

## Tutkimustausta

- **Spaced repetition** (Leitner) — sanat erääntyvät oman vaikeuden mukaan
- **Active recall** — tuottoharjoituksia (kirjoitus, ääneen lukeminen) ei vain tunnistusta
- **Bidirectional learning** — sanat kysytään molempiin suuntiin (passiivinen + aktiivinen sanavarasto)
- **Interleaving** — sekoitettu sessio aihepiirien ja harjoitustyyppien välillä
- **Dual coding** — teksti + ääni samaan aikaan TTS:n kanssa
- **Output hypothesis** — keskustelu pakottaa tuottoon, jolloin oppiminen syvenee

## Rakenne

```
index.html                — Käyttöliittymä ja CSS
data/
  words.js                — Sanasto (257 sanaa)
  topics.js               — Aihepiirit ja luokitin
  dialogues.js            — Käsikirjoitetut keskustelut
js/
  state.js                — Tila ja localStorage
  srs.js                  — Leitner-pohjainen kertausjärjestelmä
  speech.js               — TTS + Speech Recognition
  exercises.js            — Harjoitustyypit
  galaxy.js               — SVG-visualisaatio
  conversation.js         — Scripted + LLM-keskustelu
  app.js                  — Reititys ja UI-liima
```

## Vapaa keskustelu (LLM)

Vapaa keskustelu käyttää Anthropic-API:a suoraan selaimesta. Lisää API-avain Asetuksista — se tallentuu vain selaimesi localStorageen.

> Huom: selaimesta suoraan tehty kutsu vaatii `anthropic-dangerous-direct-browser-access: true` -otsakkeen. Älä jaa avainta julkisesti.

## Selaintuki

- Chrome / Edge — kaikki toimii ml. puheentunnistus
- Safari — TTS toimii, puheentunnistus rajoittunutta
- Firefox — puheentunnistus puuttuu, muu toimii

## Tiedostot

```
index.html                — Käyttöliittymä ja CSS
data/
  words.js                — Alkuperäinen sanasto (257)
  words_ext.js            — Laajennus (+425 = yht. 682 sanaa)
  topics.js               — 17 aihepiiriä ja luokitin
  dialogues.js            — Käsikirjoitetut keskustelut
  grammar_en.js           — Englannin kielioppipuu (34 solmua)
js/
  state.js                — Tila ja localStorage
  srs.js                  — Leitner-pohjainen SRS
  speech.js               — TTS + Speech Recognition
  exercises.js            — Sanasto-harjoitustyypit
  galaxy.js               — Sanasto-galaksin SVG-visualisaatio
  grammar.js              — Kielioppi-harjoitusmoottori
  tree.js                 — Rakennenäkymän mindmap-puu
  conversation.js         — Scripted + LLM-keskustelu
  app.js                  — Reititys ja UI-liima
```

## Status

v0.3. Sanasto 896, kolme kielioppipuuta (en 34 solmua, sv 16, fi 18). Rakennenäkymä noudattaa kohdekieltä — vaihda Asetuksista. Etusivulla "Päivän kielioppi" -kortti suosittelee heikoimman rakenteen. Sanakortissa lausetason TTS.

Seuraavat askeleet: sanasto 1000+:aan, syvempi suomen sijapuu, chunkit/kollokaatiot, LLM-pohjainen virheanalyysi joka linkittää havaitut virheet rakennepuun solmuihin.
