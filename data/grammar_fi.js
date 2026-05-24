// ============================================================
// Suomen kielioppipuu (grammar_fi)
// ============================================================
// Erityispiirteet:
//   • 15 sijamuotoa (taivutus tärkein osa kielen rakennetta)
//   • 6 verbityyppiä
//   • Astevaihtelu (k/kk, t/tt, p/pp; nk/ng, mp/mm jne.)
//   • Vokaalisointu (a/o/u vs. ä/ö/y)
//   • Possessiivisuffiksit
//   • Modukset ja aikamuodot
// ============================================================
//
// HUOM: tämä on suunnattu opiskelijoille, joiden lähtökieli on
// englanti/ruotsi tai jotka opettelevat suomea muista syistä.

window.GRAMMAR_FI = {
  id: "fi_root",
  label: "Suomen rakenne",
  sub: "Finsk struktur",
  desc: "Suomi on kieli, jossa kaikki taipuu — verbit, substantiivit, adjektiivit, jopa numerot. Sija ratkaisee mitä sanan rooli on lauseessa, joten sanajärjestys on vapaampi kuin englannissa tai ruotsissa.",
  children: [
    {
      id: "fi_cases", label: "Sijamuodot", sub: "Cases",
      desc: "Suomessa on 15 sijaa. Kuusi tärkeintä kantavat valtaosan käytöstä — kun ne hallitsee, suomi avautuu paljon.",
      children: [
        {
          id: "fi_nominative", label: "Nominatiivi", sub: "Subject case",
          desc: "Lauseen tekijä. Sanan perusmuoto. 'Talo on iso.' — talo = nominatiivi.",
          rules: [
            "Sanan perusmuoto sellaisenaan",
            "Käytetään kun sana on lauseen subjekti",
            "Yksikkö: talo, monikko: talot"
          ],
          examples: [
            { en: "talo / talot", fi: "house / houses (nom.)" },
            { en: "Kissa nukkuu.", fi: "The cat sleeps." }
          ],
          exercises: [
            { type:"choose", prompt:"Subjekti (nom.):", template:"___ on suuri.", options:["taloa","talossa","talo"], answer:"talo", fi:"talo (nom.)" }
          ]
        },
        {
          id: "fi_genitive", label: "Genetiivi", sub: "-n",
          desc: "Omistus, määräinen objekti, postpositioiden täydennys. 'Auton ovi.' (auton = genetiivi).",
          rules: [
            "Pääte: -n",
            "Vahva aste yleensä: katu → kadun, kasi → kasin",
            "Astevaihtelu kahdesti: kk → k (kukka → kukan)",
            "Käyttö: omistus (Marian kirja), kokonaisobjekti (Söin omenan)"
          ],
          examples: [
            { en: "talon (of the house)", fi: "Talon ovi on auki." },
            { en: "Marian", fi: "Marian kirja." },
            { en: "kissan", fi: "Kissan häntä." }
          ],
          exercises: [
            { type:"fill", prompt:"Genetiivi (talo):", template:"___ ovi on auki.", answer:"Talon", fi:"talon ovi" },
            { type:"fill", prompt:"Genetiivi (kissa):", template:"___ häntä on pitkä.", answer:"Kissan", fi:"kissan häntä" },
            { type:"fill", prompt:"Genetiivi (kukka):", template:"___ nimi on ruusu.", answer:"Kukan", fi:"kukan nimi (astevaihtelu kk→k)" }
          ]
        },
        {
          id: "fi_partitive", label: "Partitiivi", sub: "-a / -ä / -ta",
          desc: "Suomen omituisin ja tärkein sija — kuvaa epämääräistä, ei-koko, määrää tai kestoa. 'Juon kahvia.' (kahvia = partitiivi, et juo koko kahvia).",
          rules: [
            "Pääte: -a / -ä (vokaalisoinnun mukaan) tai -ta / -tä",
            "Käytetään: epämääräinen määrä (Juon vettä), kestävä toiminta (Luen kirjaa), negatiivi (En syö omenaa)",
            "Vahva tai heikko aste: vaihtelee",
            "Monikossa: -ja / -jä (lapsia, kissoja)"
          ],
          examples: [
            { en: "kahvia (some coffee)", fi: "Juon kahvia." },
            { en: "vettä (some water)", fi: "Otan vettä." },
            { en: "kirjoja (some books)", fi: "Luen kirjoja." }
          ],
          exercises: [
            { type:"fill", prompt:"Partitiivi (kahvi):", template:"Juon ___.", answer:"kahvia", fi:"juon (jonkin verran) kahvia" },
            { type:"fill", prompt:"Partitiivi (vesi):", template:"Otan ___.", answer:"vettä", fi:"otan vettä" },
            { type:"fill", prompt:"Partitiivi (omena):", template:"En syö ___.", answer:"omenaa", fi:"en syö omenaa (kielto → partitiivi)" }
          ]
        },
        {
          id: "fi_inessive", label: "Inessiivi", sub: "-ssa / -ssä  (sisällä)",
          desc: "Sisällä jossakin. Englanniksi 'in'. 'Olen Helsingissä.' = sisällä Helsingissä.",
          rules: [
            "Pääte: -ssa / -ssä (vokaalisoinnun mukaan)",
            "Vastaa englannin 'in' / ruotsin 'i'",
            "Konkreettinen sisäpaikka tai abstrakti tila: talossa, koulussa, vihaisessa mielessä"
          ],
          examples: [
            { en: "talossa", fi: "in the house" },
            { en: "koulussa", fi: "in school" },
            { en: "Helsingissä", fi: "in Helsinki" }
          ],
          exercises: [
            { type:"fill", prompt:"Inessiivi (talo):", template:"Asun ___.", answer:"talossa", fi:"asun talossa" },
            { type:"fill", prompt:"Inessiivi (kaupunki):", template:"Olen ___.", answer:"kaupungissa", fi:"olen kaupungissa (astevaihtelu k→g? Ei — vahva: kaupungissa)" },
            { type:"fill", prompt:"Inessiivi (Helsinki):", template:"Käyn ___.", answer:"Helsingissä", fi:"käyn Helsingissä" }
          ]
        },
        {
          id: "fi_elative", label: "Elatiivi", sub: "-sta / -stä  (sisältä pois)",
          desc: "Sisältä pois. Englanniksi 'from' (sisältä). 'Tulen kotoa Helsingistä.' = sisältä pois.",
          rules: [
            "Pääte: -sta / -stä",
            "Käytetään: liikkuminen sisältä ulos, aihe (puhua jostakin)",
            "Vastaa englannin 'from' / 'about'"
          ],
          examples: [
            { en: "talosta", fi: "from the house" },
            { en: "Puhumme säästä.", fi: "Talk about the weather." }
          ],
          exercises: [
            { type:"fill", prompt:"Elatiivi (kauppa):", template:"Tulen ___.", answer:"kaupasta", fi:"tulen kaupasta" },
            { type:"fill", prompt:"Elatiivi (Suomi):", template:"Olen ___.", answer:"Suomesta", fi:"olen Suomesta" }
          ]
        },
        {
          id: "fi_illative", label: "Illatiivi", sub: "-Vn / -hVn / -seen (sisään)",
          desc: "Sisään johonkin. Englanniksi 'into'. Tämä on monimutkaisin sija opetella, koska pääte vaihtelee.",
          rules: [
            "Vokaaliloppuiset: pidennä vokaali + n (talo → taloon, koti → kotiin)",
            "Konsonanttiloppuiset: -hVn samalla vokaalilla (mies → mieheen)",
            "Pitkä loppu: -seen (vapaaseen, perheeseen)"
          ],
          examples: [
            { en: "taloon", fi: "into the house" },
            { en: "kouluun", fi: "to school (into school)" },
            { en: "Helsinkiin", fi: "to Helsinki" }
          ],
          exercises: [
            { type:"fill", prompt:"Illatiivi (talo):", template:"Menen ___.", answer:"taloon", fi:"menen taloon" },
            { type:"fill", prompt:"Illatiivi (koulu):", template:"Lapsi menee ___.", answer:"kouluun", fi:"lapsi menee kouluun" },
            { type:"fill", prompt:"Illatiivi (Helsinki):", template:"Matkustan ___.", answer:"Helsinkiin", fi:"matkustan Helsinkiin" }
          ]
        },
        {
          id: "fi_adessive", label: "Adessiivi", sub: "-lla / -llä  (päällä, omistus)",
          desc: "Päällä jossakin. Myös omistuksen ilmaus: 'Minulla on…' = on minulla.",
          rules: [
            "Pääte: -lla / -llä",
            "Konkreettinen päällä: pöydällä, kadulla",
            "Omistus: Minulla on auto. (Auto is at me = I have a car.)"
          ],
          examples: [
            { en: "pöydällä", fi: "on the table" },
            { en: "Minulla on kissa.", fi: "I have a cat. (Lit. 'On me is a cat')" }
          ],
          exercises: [
            { type:"fill", prompt:"Adessiivi (pöytä):", template:"Kirja on ___.", answer:"pöydällä", fi:"pöydällä (astevaihtelu t→d)" },
            { type:"fill", prompt:"Omistus (minä):", template:"___ on auto.", answer:"Minulla", fi:"minulla on auto" }
          ]
        },
        {
          id: "fi_ablative", label: "Ablatiivi", sub: "-lta / -ltä  (päältä pois)",
          desc: "Päältä pois jostakin. Käytetään myös: pyytää joltakulta, kuulla joltakulta.",
          rules: [
            "Pääte: -lta / -ltä",
            "Konkreettinen: pöydältä, kadulta",
            "Henkilöltä: kysyä äidiltä, ottaa kaverilta"
          ],
          examples: [
            { en: "pöydältä", fi: "off the table" },
            { en: "äidiltä", fi: "from mother (asking)" }
          ],
          exercises: [
            { type:"fill", prompt:"Ablatiivi (äiti):", template:"Kysy ___.", answer:"äidiltä", fi:"kysy äidiltä" }
          ]
        },
        {
          id: "fi_allative", label: "Allatiivi", sub: "-lle  (päälle)",
          desc: "Päälle. Antaminen jollekin: 'Anna se minulle.'",
          rules: [
            "Pääte: -lle",
            "Konkreettinen: pöydälle",
            "Henkilölle: antaa lapselle, kertoa ystävälle"
          ],
          examples: [
            { en: "pöydälle", fi: "onto the table" },
            { en: "lapselle", fi: "to the child" }
          ],
          exercises: [
            { type:"fill", prompt:"Allatiivi (lapsi):", template:"Annan kirjan ___.", answer:"lapselle", fi:"annan kirjan lapselle" },
            { type:"fill", prompt:"Allatiivi (minä):", template:"Anna se ___.", answer:"minulle", fi:"anna se minulle" }
          ]
        }
      ]
    },
    {
      id: "fi_verbs", label: "Verbit", sub: "Verbs",
      desc: "Suomen verbit jakautuvat 6 tyyppiin sen mukaan miten ne taipuvat. Verbi taipuu persoonan mukaan: minä, sinä, hän, me, te, he.",
      children: [
        {
          id: "fi_verb_types", label: "6 verbityyppiä", sub: "Verb classes",
          desc: "Verbityyppi määräytyy infinitiivin loppuosan mukaan ja vaikuttaa siihen, miten persoonapäätteet liitetään.",
          rules: [
            "Tyyppi 1: -aa/-ää/-ia jne. → vahva vartalo (puhua → puhu-, lukea → luke-)",
            "Tyyppi 2: -da/-dä → poista da/dä (syödä → syö-, juoda → juo-)",
            "Tyyppi 3: -lla/-llä, -rra, -sta → -e- vartalo (tulla → tule-)",
            "Tyyppi 4: -ata/-ätä → -a vartalo (haluta → halua-)",
            "Tyyppi 5: -ita/-itä (lyhyt) → -tse-/-ts- (tarvita → tarvitse-)",
            "Tyyppi 6: -eta/-etä → -ne- (vanheta → vanhene-)"
          ],
          examples: [
            { en: "puhua → minä puhun", fi: "tyyppi 1" },
            { en: "syödä → minä syön", fi: "tyyppi 2" },
            { en: "tulla → minä tulen", fi: "tyyppi 3" }
          ],
          exercises: [
            { type:"fill", prompt:"Preesens (puhua, minä):", template:"Minä ___.", answer:"puhun", fi:"minä puhun" },
            { type:"fill", prompt:"Preesens (syödä, hän):", template:"Hän ___.", answer:"syö", fi:"hän syö" },
            { type:"fill", prompt:"Preesens (tulla, me):", template:"Me ___.", answer:"tulemme", fi:"me tulemme" }
          ]
        },
        {
          id: "fi_personal_endings", label: "Persoonapäätteet", sub: "Person endings",
          desc: "Suomen verbi taipuu aina persoonan mukaan. Persoonapronominia ei välttämättä tarvitse käyttää, koska pääte kertoo persoonan.",
          rules: [
            "minä → -n (puhun, syön)",
            "sinä → -t (puhut, syöt)",
            "hän → vartalo + (mahdollinen vokaali) — (puhuu, syö)",
            "me → -mme (puhumme, syömme)",
            "te → -tte (puhutte, syötte)",
            "he → -vat / -vät (puhuvat, syövät)"
          ],
          examples: [
            { en: "minä puhun", fi: "I speak" },
            { en: "hän puhuu", fi: "(s)he speaks" },
            { en: "he puhuvat", fi: "they speak" }
          ],
          exercises: [
            { type:"fill", prompt:"(sinä, lukea):", template:"Sinä ___.", answer:"luet", fi:"sinä luet" },
            { type:"fill", prompt:"(he, mennä):", template:"He ___.", answer:"menevät", fi:"he menevät" },
            { type:"fill", prompt:"(me, asua):", template:"Me ___.", answer:"asumme", fi:"me asumme" }
          ]
        },
        {
          id: "fi_negation", label: "Kielto", sub: "Negation 'en/et/ei…'",
          desc: "Suomen kielto on poikkeuksellinen: kieltoverbi taipuu persoonan mukaan (en, et, ei, emme, ette, eivät) ja pääverbi jää 'lyhyeen' muotoon.",
          rules: [
            "Kieltoverbi: en, et, ei, emme, ette, eivät",
            "Pääverbi: pelkkä vartalo (en puhu — ei: en puhun)",
            "Imperfektissä: en puhunut (kieltoverbi + pääverbin partisiippi)"
          ],
          examples: [
            { en: "En puhu.", fi: "I don't speak." },
            { en: "Hän ei syö.", fi: "(s)he doesn't eat." },
            { en: "Emme tule.", fi: "We don't come." }
          ],
          exercises: [
            { type:"fill", prompt:"Kielto (minä, puhua):", template:"___ puhu.", answer:"En", fi:"en puhu" },
            { type:"fill", prompt:"Kielto (hän, syödä):", template:"Hän ___ syö.", answer:"ei", fi:"hän ei syö" },
            { type:"fill", prompt:"Kielto (he, lukea):", template:"He ___ lue.", answer:"eivät", fi:"he eivät lue" }
          ]
        }
      ]
    },
    {
      id: "fi_phonology", label: "Astevaihtelu ja sointu", sub: "Sound patterns",
      desc: "Suomen kielen kaksi keskeistä foneettista sääntöä, jotka muuttavat sanojen muotoa taivutuksessa.",
      children: [
        {
          id: "fi_gradation", label: "Astevaihtelu", sub: "Consonant gradation",
          desc: "k, t, p vaihtelevat vahvan ja heikon asteen välillä taivutuksessa. Tämä on suomen pinnallinen mutta keskeinen sääntö.",
          rules: [
            "kk ↔ k: kukka → kukan",
            "pp ↔ p: kuppi → kupin",
            "tt ↔ t: matto → maton",
            "k ↔ ∅ (katoaa): jalka → jalan",
            "p ↔ v: kipu → kivun",
            "t ↔ d: pöytä → pöydän",
            "nk ↔ ng: Helsinki → Helsingin",
            "mp ↔ mm: lampi → lammen"
          ],
          examples: [
            { en: "kukka → kukan", fi: "kk→k" },
            { en: "jalka → jalan", fi: "k katoaa" },
            { en: "Helsinki → Helsingin", fi: "nk→ng" }
          ],
          exercises: [
            { type:"fill", prompt:"Astevaihtelu (kukka, gen.):", template:"___ nimi.", answer:"Kukan", fi:"kk→k" },
            { type:"fill", prompt:"Astevaihtelu (pöytä, gen.):", template:"___ ääni.", answer:"Pöydän", fi:"t→d" },
            { type:"fill", prompt:"Astevaihtelu (Helsinki, gen.):", template:"___ kaupunki.", answer:"Helsingin", fi:"nk→ng" }
          ]
        },
        {
          id: "fi_vowel_harmony", label: "Vokaalisointu", sub: "Vowel harmony",
          desc: "Saman sanan vokaalit kuuluvat joko etuvokaaleihin (ä, ö, y) tai takavokaaleihin (a, o, u). Päätteen vokaali mukautuu.",
          rules: [
            "Takavokaaliset (a, o, u): pääte myös takavokaalinen — talossa, autosta",
            "Etuvokaaliset (ä, ö, y): pääte myös etuvokaalinen — kädessä, päästä",
            "Neutraalit (e, i): eivät vaadi, joten sointu määräytyy muiden vokaalien mukaan"
          ],
          examples: [
            { en: "talo + ssa = talossa", fi: "takavokaaliset" },
            { en: "käsi + ssä = kädessä", fi: "etuvokaaliset" },
            { en: "Helsinki + ssä = Helsingissä", fi: "neutraalit + e = etu" }
          ],
          exercises: [
            { type:"choose", prompt:"Valitse oikea pääte (talo + inessiivi):", template:"talo___", options:["ssa","ssä"], answer:"ssa", fi:"taka → ssa" },
            { type:"choose", prompt:"Valitse oikea pääte (kylä + inessiivi):", template:"kylä___", options:["ssa","ssä"], answer:"ssä", fi:"etu → ssä" }
          ]
        }
      ]
    }
  ]
};

window.GRAMMAR_FI_FLAT = (function () {
  const out = [];
  function walk(node, depth, parent) {
    out.push({ node, depth, parentId: parent });
    if (node.children) for (const c of node.children) walk(c, depth + 1, node.id);
  }
  walk(window.GRAMMAR_FI, 0, null);
  return out;
})();

console.log("Kielioppi-FI ladattu:", window.GRAMMAR_FI_FLAT.length, "solmua");
