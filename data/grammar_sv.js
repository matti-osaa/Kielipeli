// ============================================================
// Ruotsin kielioppipuu (grammar_sv)
// ============================================================
// Erityispiirteet:
//   • en-/ett-ord (genus)
//   • määräinen muoto liitepäätteenä (boken, huset)
//   • 5 verbiryhmää
//   • V2-sanajärjestys (lauseessa verbi 2. paikalla)
//   • Adjektiivin kongruenssi (en/ett/plural)
// ============================================================

window.GRAMMAR_SV = {
  id: "sv_root",
  label: "Ruotsin rakenne",
  sub: "Svensk struktur",
  desc: "Ruotsi kuuluu germaanisiin kieliin (kuten englanti ja saksa). Erityispiirteet suomalaiselle: en/ett-jako, määräiset päätteet ja V2-sanajärjestys.",
  children: [
    {
      id: "sv_pos", label: "Sanaluokat", sub: "Ordklasser",
      desc: "Ruotsin sanaluokat ovat lähes samat kuin englannissa, mutta substantiivien ja adjektiivien taivutus on rikkaampi.",
      children: [
        {
          id: "sv_nouns", label: "Substantiivit", sub: "Substantiv",
          desc: "Ruotsin substantiivit jakautuvat kahteen sukuun: en-ord (utrum) ja ett-ord (neutrum). Suvun mukaan menee artikkeli, monikkopääte ja adjektiivin muoto.",
          children: [
            {
              id: "sv_en_ett", label: "en/ett — sukuparit", sub: "Utrum / neutrum",
              desc: "Yli 70 % sanoista on en-ord, mutta tärkeät arkisanat ovat usein ett-ord. Suvun joutuu opettelemaan sanan mukana.",
              rules: [
                "en-ord: en bil, en katt, en stol — yleisempi",
                "ett-ord: ett hus, ett barn, ett bord — pienempi joukko mutta tärkeitä",
                "Adjektiivi taipuu: en stor bil, ett stort hus, stora bilar",
                "Epämääräinen artikkeli vastaa suomen 'yksi'-mielteen sanaa: en katt = (yksi) kissa"
              ],
              examples: [
                { en: "en bil — a car", fi: "auto — en-ord" },
                { en: "ett hus — a house", fi: "talo — ett-ord" },
                { en: "en gata — a street", fi: "katu — en-ord" },
                { en: "ett barn — a child", fi: "lapsi — ett-ord" }
              ],
              exercises: [
                { type:"choose", prompt:"Valitse artikkeli (sana: bil):", template:"___ bil", options:["en","ett"], answer:"en", fi:"auto" },
                { type:"choose", prompt:"Valitse artikkeli (sana: hus):", template:"___ hus", options:["en","ett"], answer:"ett", fi:"talo" },
                { type:"choose", prompt:"Valitse artikkeli (sana: barn):", template:"___ barn", options:["en","ett"], answer:"ett", fi:"lapsi" },
                { type:"choose", prompt:"Valitse artikkeli (sana: katt):", template:"___ katt", options:["en","ett"], answer:"en", fi:"kissa" },
                { type:"choose", prompt:"Valitse artikkeli (sana: bord):", template:"___ bord", options:["en","ett"], answer:"ett", fi:"pöytä" },
                { type:"choose", prompt:"Valitse artikkeli (sana: vän):", template:"___ vän", options:["en","ett"], answer:"en", fi:"ystävä" }
              ]
            },
            {
              id: "sv_definite", label: "Määräinen muoto", sub: "Bestämd form",
              desc: "Suomessa määräistä artikkelia ei ole, ruotsissa se on substantiivin LOPUSSA. en bok (kirja) → boken (se kirja). Tämä on ruotsin omituisin piirre.",
              rules: [
                "en-ord yksikkö: + -en (en bok → boken, en bil → bilen)",
                "en-ord -e: + -n (en flicka → flickan, en kvinna → kvinnan)",
                "ett-ord yksikkö: + -et (ett hus → huset, ett bord → bordet)",
                "Monikko en-ord: + -na (böckerna, bilarna)",
                "Monikko ett-ord: + -en tai -na (husen, äpplena)"
              ],
              examples: [
                { en: "en bok → boken", fi: "kirja → se kirja" },
                { en: "ett hus → huset", fi: "talo → se talo" },
                { en: "böcker → böckerna", fi: "kirjat → ne kirjat" },
                { en: "äpplen → äpplena", fi: "omenat → ne omenat" }
              ],
              exercises: [
                { type:"fill", prompt:"Määräinen muoto (en bil):", template:"___ är ny.", answer:"bilen", fi:"se auto on uusi" },
                { type:"fill", prompt:"Määräinen muoto (ett hus):", template:"Jag ser ___.", answer:"huset", fi:"näen sen talon" },
                { type:"fill", prompt:"Määräinen muoto (en katt):", template:"___ sover.", answer:"katten", fi:"se kissa nukkuu" },
                { type:"fill", prompt:"Määräinen muoto (ett barn):", template:"___ leker.", answer:"barnet", fi:"se lapsi leikkii" }
              ]
            },
            {
              id: "sv_plural", label: "Monikon muodostus", sub: "Plural",
              desc: "Ruotsin monikko on epäsäännöllisempi kuin englannin: viisi pääryhmää (1. -or, 2. -ar, 3. -er, 4. -n, 5. ei päätettä).",
              rules: [
                "Ryhmä 1: en-ord, -a → -or (en flicka → flickor)",
                "Ryhmä 2: en-ord, konsonantti → -ar (en bil → bilar)",
                "Ryhmä 3: -er (en katt → katter, en blomma sub)",
                "Ryhmä 4: ett-ord, joka päättyy vokaaliin → -n (ett äpple → äpplen)",
                "Ryhmä 5: ett-ord konsonantti → ei päätettä (ett hus → hus)"
              ],
              examples: [
                { en: "en flicka → flickor", fi: "tyttö → tytöt" },
                { en: "en bil → bilar", fi: "auto → autot" },
                { en: "en katt → katter", fi: "kissa → kissat" },
                { en: "ett äpple → äpplen", fi: "omena → omenat" },
                { en: "ett hus → hus", fi: "talo → talot" }
              ],
              exercises: [
                { type:"fill", prompt:"Monikko (en bil):", template:"Tre ___.", answer:"bilar", fi:"kolme autoa" },
                { type:"fill", prompt:"Monikko (en katt):", template:"Två ___.", answer:"katter", fi:"kaksi kissaa" },
                { type:"fill", prompt:"Monikko (ett äpple):", template:"Många ___.", answer:"äpplen", fi:"monta omenaa" },
                { type:"fill", prompt:"Monikko (ett hus):", template:"Stora ___.", answer:"hus", fi:"isoja taloja" },
                { type:"fill", prompt:"Monikko (en flicka):", template:"Glada ___.", answer:"flickor", fi:"iloisia tyttöjä" }
              ]
            }
          ]
        },
        {
          id: "sv_verbs", label: "Verbit", sub: "Verb",
          desc: "Ruotsin verbit jaetaan 4 ryhmään (tai 5, jos starka verb lasketaan erikseen). Verbi EI taivu persoonan mukaan — sama muoto kaikilla.",
          children: [
            {
              id: "sv_present", label: "Preesens", sub: "Presens",
              desc: "Preesensin pääte määräytyy verbiryhmän mukaan. Sama muoto kaikilla persoonilla — tämä helpottaa.",
              rules: [
                "Ryhmä 1: -ar (jag talar, du talar, han talar) — tala (puhua)",
                "Ryhmä 2a: -er (jag läser) — läsa (lukea)",
                "Ryhmä 2b: -er (jag köper) — köpa (ostaa)",
                "Ryhmä 3: -r (jag bor) — bo (asua)",
                "Starka verb / oregelbundna: omat muodot (jag är, jag har, jag går)"
              ],
              examples: [
                { en: "jag talar svenska", fi: "puhun ruotsia" },
                { en: "hon läser en bok", fi: "hän lukee kirjaa" },
                { en: "vi bor i Sverige", fi: "asumme Ruotsissa" },
                { en: "jag är trött", fi: "olen väsynyt" }
              ],
              exercises: [
                { type:"fill", prompt:"Preesens (tala):", template:"Jag ___ svenska.", answer:"talar", fi:"puhun ruotsia" },
                { type:"fill", prompt:"Preesens (läsa):", template:"Hon ___ en bok.", answer:"läser", fi:"hän lukee kirjaa" },
                { type:"fill", prompt:"Preesens (bo):", template:"Vi ___ i Finland.", answer:"bor", fi:"asumme Suomessa" },
                { type:"choose", prompt:"Valitse (vara):", template:"Jag ___ glad.", options:["är","har","blir"], answer:"är", fi:"olen iloinen" }
              ]
            },
            {
              id: "sv_preteritum", label: "Imperfekti", sub: "Preteritum",
              desc: "Preteritum kertoo päättyneestä menneestä tapahtumasta — vastaa englannin past simple.",
              rules: [
                "Ryhmä 1: -ade (tala → talade)",
                "Ryhmä 2a: -de (läsa → läste)",
                "Ryhmä 2b: -te (köpa → köpte)",
                "Ryhmä 3: -dde (bo → bodde)",
                "Starka: vokaalimuutos (vara → var, ha → hade, gå → gick, se → såg)"
              ],
              examples: [
                { en: "jag talade", fi: "puhuin" },
                { en: "hon läste", fi: "hän luki" },
                { en: "vi köpte mat", fi: "ostimme ruokaa" },
                { en: "jag var där", fi: "olin siellä" }
              ],
              exercises: [
                { type:"fill", prompt:"Preteritum (tala):", template:"Jag ___ med honom.", answer:"talade", fi:"puhuin hänelle" },
                { type:"fill", prompt:"Preteritum (vara):", template:"Han ___ glad.", answer:"var", fi:"hän oli iloinen" },
                { type:"fill", prompt:"Preteritum (gå):", template:"Vi ___ hem.", answer:"gick", fi:"menimme kotiin" },
                { type:"fill", prompt:"Preteritum (köpa):", template:"Jag ___ en bok.", answer:"köpte", fi:"ostin kirjan" }
              ]
            },
            {
              id: "sv_perfekt", label: "Perfekti", sub: "Perfekt",
              desc: "Perfekt = har + supinum. Käytetään lähimenneestä tai aikajakson sisällä tapahtuneesta.",
              rules: [
                "Rakenne: har + supinum",
                "Supinum: ryhmä 1 → -at (talat), ryhmä 2 → -t (läst, köpt), ryhmä 3 → -tt (bott)",
                "Starka verb: oma supinum (varit, gått, sett, ätit)"
              ],
              examples: [
                { en: "Jag har talat med henne.", fi: "Olen puhunut hänen kanssaan." },
                { en: "Vi har bott här länge.", fi: "Olemme asuneet täällä kauan." },
                { en: "Har du ätit?", fi: "Oletko syönyt?" }
              ],
              exercises: [
                { type:"fill", prompt:"Supinum (tala):", template:"Jag har ___ med henne.", answer:"talat", fi:"olen puhunut hänelle" },
                { type:"fill", prompt:"Supinum (vara):", template:"Han har ___ där.", answer:"varit", fi:"hän on ollut siellä" },
                { type:"fill", prompt:"Supinum (äta):", template:"Vi har ___ middag.", answer:"ätit", fi:"olemme syöneet illallisen" }
              ]
            },
            {
              id: "sv_modals", label: "Modaaliverbit", sub: "Hjälpverb",
              desc: "Modaalit ovat samankaltaisia kuin englannissa — perusmuoto seuraa: jag kan, jag måste, jag vill, jag ska.",
              rules: [
                "kan — osaa, voi",
                "vill — haluaa",
                "ska — aikoo / tulee (tulevaisuus)",
                "måste — täytyy",
                "får — saa (lupa)",
                "borde — pitäisi"
              ],
              examples: [
                { en: "Jag kan simma.", fi: "Osaan uida." },
                { en: "Hon vill komma.", fi: "Hän haluaa tulla." },
                { en: "Vi måste gå nu.", fi: "Meidän täytyy mennä nyt." }
              ],
              exercises: [
                { type:"choose", prompt:"Valitse modaali:", template:"Jag ___ tala svenska.", options:["kan","är","har"], answer:"kan", fi:"osaan puhua ruotsia" },
                { type:"choose", prompt:"Valitse modaali:", template:"Du ___ vara försiktig.", options:["måste","ska","får"], answer:"måste", fi:"sinun täytyy olla varovainen" }
              ]
            }
          ]
        },
        {
          id: "sv_adj", label: "Adjektiivit", sub: "Adjektiv",
          desc: "Ruotsissa adjektiivi taipuu pääsanan suvun ja luvun mukaan: en stor bil (iso auto), ett stort hus (iso talo), stora bilar (isoja autoja).",
          rules: [
            "en-muoto: perusmuoto (stor, glad, ny)",
            "ett-muoto: + -t (stort, glatt, nytt)",
            "Monikko & määräinen: + -a (stora, glada, nya)",
            "Vertailu: -are / -ast (stor → större → störst — joillain epäsäännöllinen)"
          ],
          examples: [
            { en: "en stor bil", fi: "iso auto" },
            { en: "ett stort hus", fi: "iso talo" },
            { en: "stora bilar", fi: "isoja autoja" },
            { en: "den stora bilen", fi: "se iso auto" }
          ],
          exercises: [
            { type:"choose", prompt:"Valitse adjektiivin muoto:", template:"Ett ___ hus.", options:["stor","stort","stora"], answer:"stort", fi:"iso talo" },
            { type:"choose", prompt:"Valitse:", template:"En ___ flicka.", options:["glad","glatt","glada"], answer:"glad", fi:"iloinen tyttö" },
            { type:"choose", prompt:"Valitse:", template:"Tre ___ katter.", options:["liten","litet","små"], answer:"små", fi:"kolme pientä kissaa" }
          ]
        }
      ]
    },
    {
      id: "sv_sentence", label: "Lauserakenne", sub: "Meningsbyggnad",
      desc: "Ruotsin sanajärjestys on tiukka: pääsääntö V2 — taipuva verbi tulee aina lauseen 2. paikalle.",
      children: [
        {
          id: "sv_v2", label: "V2-sanajärjestys", sub: "Verbet på andra plats",
          desc: "Lauseen alussa voi olla mikä tahansa lauseenjäsen (subjekti, ajan ilmaus, paikka), mutta verbi on AINA toisena.",
          rules: [
            "Subjekti alussa: Jag äter frukost. (Minä syön aamiaista.)",
            "Aika alussa: Idag äter jag frukost. (Tänään syön aamiaista.) — huomaa: subjekti tulee verbin perään!",
            "Paikka alussa: I köket äter jag frukost. (Keittiössä syön aamiaista.)",
            "Tämä on yleisin virhe suomenkieliselle"
          ],
          examples: [
            { en: "Jag dricker kaffe på morgonen.", fi: "Juon kahvia aamulla." },
            { en: "På morgonen dricker jag kaffe.", fi: "Aamulla juon kahvia. (verbi 2.)" },
            { en: "Imorgon ska vi gå.", fi: "Huomenna menemme." }
          ],
          exercises: [
            { type:"build", prompt:"Järjestä (V2):", template:"jag / kaffe / Idag / dricker", answer:"Idag dricker jag kaffe", fi:"Tänään juon kahvia" },
            { type:"build", prompt:"Järjestä (V2):", template:"vi / Imorgon / hem / går", answer:"Imorgon går vi hem", fi:"Huomenna menemme kotiin" },
            { type:"transform", prompt:"Muuta V2: 'Jag läser en bok hemma.'", template:"Hemma…", answer:"Hemma läser jag en bok", fi:"Kotona luen kirjaa" }
          ]
        },
        {
          id: "sv_questions", label: "Kysymyslauseet", sub: "Frågor",
          desc: "Kysymyksessä verbi ja subjekti vaihtavat paikkaa — sama logiikka kuin V2.",
          rules: [
            "Ja/Nej: verbi alussa → Talar du svenska?",
            "Kysymyssana + verbi + subj: Vad gör du? Var bor du? När kommer du?",
            "Yleisimmät kysymyssanat: vad (mitä), var (missä), vart (mihin), när (milloin), varför (miksi), hur (miten), vem (kuka)"
          ],
          examples: [
            { en: "Talar du svenska?", fi: "Puhutko ruotsia?" },
            { en: "Var bor du?", fi: "Missä asut?" },
            { en: "Vad heter du?", fi: "Mikä nimesi on?" }
          ],
          exercises: [
            { type:"transform", prompt:"Tee kysymys: 'Du talar svenska.'", template:"Du talar svenska.", answer:"Talar du svenska?", fi:"Puhutko ruotsia?" },
            { type:"choose", prompt:"Valitse kysymyssana:", template:"___ heter du?", options:["Vad","Var","Vart"], answer:"Vad", fi:"Mikä nimesi on?" },
            { type:"choose", prompt:"Valitse:", template:"___ bor du?", options:["Vad","Var","När"], answer:"Var", fi:"Missä asut?" }
          ]
        },
        {
          id: "sv_negation", label: "Kieltolauseet", sub: "Negation 'inte'",
          desc: "Kielto muodostetaan sanalla 'inte', joka tulee taipuvan verbin perään päälauseessa.",
          rules: [
            "Päälause: subj + verbi + inte + objektejä (Jag talar inte svenska.)",
            "Sivulause: inte ennen verbi (… om jag inte kommer)",
            "Yhdistettävissä kaikkien aikamuotojen kanssa: jag har inte sett, jag ska inte gå"
          ],
          examples: [
            { en: "Jag förstår inte.", fi: "En ymmärrä." },
            { en: "Hon kommer inte idag.", fi: "Hän ei tule tänään." },
            { en: "Vi har inte sett honom.", fi: "Emme ole nähneet häntä." }
          ],
          exercises: [
            { type:"transform", prompt:"Tee kielto: 'Jag talar svenska.'", template:"Jag talar svenska.", answer:"Jag talar inte svenska", fi:"En puhu ruotsia" },
            { type:"transform", prompt:"Tee kielto: 'Hon kommer.'", template:"Hon kommer.", answer:"Hon kommer inte", fi:"Hän ei tule" }
          ]
        }
      ]
    }
  ]
};

window.GRAMMAR_SV_FLAT = (function () {
  const out = [];
  function walk(node, depth, parent) {
    out.push({ node, depth, parentId: parent });
    if (node.children) for (const c of node.children) walk(c, depth + 1, node.id);
  }
  walk(window.GRAMMAR_SV, 0, null);
  return out;
})();

console.log("Kielioppi-SV ladattu:", window.GRAMMAR_SV_FLAT.length, "solmua");
