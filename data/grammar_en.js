// ============================================================
// Englannin kielioppipuu
// ============================================================
// Solmun rakenne:
//   { id, label, sub?, desc?, rules?[], examples?[{en,fi}],
//     exercises?[{type, prompt, template, options?, answer, fi?}],
//     children?[] }
//
// Edistyminen tallennetaan solmun id:n alle window.STATE.grammar
// (kts. state.js, key "grammar.<id>").
//
// Harjoitustyypit:
//   choose    — valitse oikea muoto monivalinnasta (template-merkki "___")
//   fill      — kirjoita oikea muoto annettuun aukkoon
//   transform — muunna lause toiseksi muotoon
//   build     — järjestä sanat lauseeksi
// ============================================================

window.GRAMMAR_EN = {
  id: "en_root",
  label: "Englannin rakenne",
  sub: "English structure",
  desc: "Kielen luuranko: sanaluokat, niiden taivutus ja lauseenrakenne. Klikkaa solmua nähdäksesi tarkemmin ja harjoitellaksesi.",
  children: [

    // ===== SANALUOKAT =====
    {
      id: "en_pos", label: "Sanaluokat", sub: "Word classes",
      desc: "Sanat jaetaan luokkiin sen mukaan miten ne käyttäytyvät lauseessa. Englannin perussanaluokat ovat substantiivit, verbit, adjektiivit, adverbit, pronominit, prepositiot, sidesanat ja artikkelit.",
      children: [

        // --- Substantiivit ---
        {
          id: "en_nouns", label: "Substantiivit", sub: "Nouns",
          desc: "Substantiivi nimeää olennon, esineen tai asian. Englannissa substantiivit ovat yksikössä tai monikossa, ja niillä on usein artikkeli (a/an/the).",
          children: [
            {
              id: "en_plural", label: "Monikon muodostus", sub: "Plural",
              desc: "Englannin monikko muodostetaan yleensä -s-päätteellä, mutta sääntöjä on useita.",
              rules: [
                "Pääsääntö: lisää -s (cat → cats)",
                "Sanat jotka päättyvät -s, -x, -ch, -sh, -z: lisää -es (bus → buses, box → boxes)",
                "Sanat -y konsonantin jälkeen: y → ies (city → cities). -y vokaalin jälkeen: vain -s (day → days)",
                "Sanat -f / -fe: usein f → ves (knife → knives, leaf → leaves)",
                "Epäsäännöllisiä on paljon: child → children, man → men, foot → feet, mouse → mice"
              ],
              examples: [
                { en: "cat → cats", fi: "kissa → kissat" },
                { en: "bus → buses", fi: "bussi → bussit" },
                { en: "city → cities", fi: "kaupunki → kaupungit" },
                { en: "knife → knives", fi: "veitsi → veitset" },
                { en: "child → children", fi: "lapsi → lapset" },
                { en: "foot → feet", fi: "jalka → jalat" }
              ],
              exercises: [
                { type:"fill", prompt:"Kirjoita monikkomuoto:", template:"box → ___", answer:"boxes", fi:"laatikko → laatikot" },
                { type:"fill", prompt:"Kirjoita monikkomuoto:", template:"baby → ___", answer:"babies", fi:"vauva → vauvat" },
                { type:"fill", prompt:"Kirjoita monikkomuoto:", template:"man → ___", answer:"men", fi:"mies → miehet" },
                { type:"fill", prompt:"Kirjoita monikkomuoto:", template:"leaf → ___", answer:"leaves", fi:"lehti → lehdet" },
                { type:"choose", prompt:"Valitse oikea monikko:", template:"I have three ___.", options:["childs","children","childes"], answer:"children", fi:"Minulla on kolme lasta." },
                { type:"choose", prompt:"Valitse oikea monikko:", template:"Two ___ are here.", options:["mouses","mice","mices"], answer:"mice", fi:"Kaksi hiirtä on täällä." }
              ]
            },
            {
              id: "en_articles", label: "Artikkelit", sub: "a / an / the",
              desc: "Artikkeli kertoo onko substantiivi yleinen (a/an) vai tietty (the). Suomessa ei ole artikkeleita, joten tämä on yksi vaikeimmista englannin asioista suomenkielisille.",
              rules: [
                "a — konsonanttiäänteen edellä (a cat, a house)",
                "an — vokaaliäänteen edellä (an apple, an hour — h on hiljainen!)",
                "the — kun puhuja ja kuulija tietävät minkä asian (the sun, the book I bought)",
                "Ei artikkelia — yleisluontoiset monikot ja ei-laskettavat (Cats are nice. Water is wet.)"
              ],
              examples: [
                { en: "A dog ran past.", fi: "Joku koira juoksi ohi." },
                { en: "The dog is mine.", fi: "Se (tietty) koira on minun." },
                { en: "An umbrella, please.", fi: "Sateenvarjo, kiitos." },
                { en: "I love music.", fi: "Rakastan musiikkia. (yleisluontoinen)" }
              ],
              exercises: [
                { type:"choose", prompt:"Valitse artikkeli:", template:"I saw ___ owl in the tree.", options:["a","an","the"], answer:"an", fi:"Näin pöllön puussa." },
                { type:"choose", prompt:"Valitse artikkeli:", template:"Open ___ window, please.", options:["a","an","the"], answer:"the", fi:"Avaa ikkuna, kiitos." },
                { type:"choose", prompt:"Valitse artikkeli:", template:"She is ___ teacher.", options:["a","an","the"], answer:"a", fi:"Hän on opettaja." },
                { type:"choose", prompt:"Valitse artikkeli:", template:"___ sun is bright today.", options:["A","An","The"], answer:"The", fi:"Aurinko on kirkas tänään." }
              ]
            },
            {
              id: "en_countability", label: "Lukuvarius", sub: "Countable / uncountable",
              desc: "Substantiivit jaetaan laskettaviin (one apple, two apples) ja ei-laskettaviin (water, music, information). Tämä vaikuttaa siihen, mitä määräsanoja käytetään.",
              rules: [
                "Laskettavat: a/an + yksikkö, monikko mahdollinen — many, few, a lot of",
                "Ei-laskettavat: ei a/an, ei monikkoa — much, little, a lot of, some",
                "Some/any toimivat molempien kanssa"
              ],
              examples: [
                { en: "much water / many apples", fi: "paljon vettä / paljon omenoita" },
                { en: "little time / few friends", fi: "vähän aikaa / harvat ystävät" }
              ],
              exercises: [
                { type:"choose", prompt:"Valitse oikea:", template:"How ___ water do you drink?", options:["much","many"], answer:"much", fi:"Kuinka paljon vettä juot?" },
                { type:"choose", prompt:"Valitse oikea:", template:"How ___ friends do you have?", options:["much","many"], answer:"many", fi:"Kuinka monta ystävää sinulla on?" },
                { type:"choose", prompt:"Valitse oikea:", template:"There is ___ milk in the fridge.", options:["a few","a little"], answer:"a little", fi:"Jääkaapissa on vähän maitoa." }
              ]
            }
          ]
        },

        // --- Verbit ---
        {
          id: "en_verbs", label: "Verbit", sub: "Verbs",
          desc: "Verbi kertoo tekemisestä, tapahtumisesta tai olemisesta. Englannin verbisysteemi on kompakti mutta aikamuodot tärkeät hallita.",
          children: [
            {
              id: "en_to_be", label: "To be — olla", sub: "am / is / are",
              desc: "Englannin tärkein verbi. Taivutetaan persoonan mukaan: I am, you are, he/she/it is, we/they are.",
              rules: [
                "I am",
                "You are, We are, They are",
                "He / She / It is",
                "Lyhennetyt: I'm, you're, he's, she's, it's, we're, they're",
                "Kielto: I am not (I'm not), is not (isn't), are not (aren't)"
              ],
              examples: [
                { en: "I am a student.", fi: "Olen opiskelija." },
                { en: "She is happy.", fi: "Hän on iloinen." },
                { en: "They are my friends.", fi: "He ovat ystäviäni." },
                { en: "We aren't ready.", fi: "Emme ole valmiita." }
              ],
              exercises: [
                { type:"choose", prompt:"Valitse oikea muoto:", template:"I ___ tired.", options:["am","is","are"], answer:"am", fi:"Olen väsynyt." },
                { type:"choose", prompt:"Valitse oikea muoto:", template:"He ___ at home.", options:["am","is","are"], answer:"is", fi:"Hän on kotona." },
                { type:"choose", prompt:"Valitse oikea muoto:", template:"They ___ here.", options:["am","is","are"], answer:"are", fi:"He ovat täällä." },
                { type:"fill", prompt:"Täydennä:", template:"She ___ a teacher.", answer:"is", fi:"Hän on opettaja." },
                { type:"fill", prompt:"Täydennä:", template:"We ___ friends.", answer:"are", fi:"Olemme ystäviä." }
              ]
            },
            {
              id: "en_to_have", label: "To have — omistaa", sub: "have / has",
              desc: "Have/has käytetään omistamisesta ja perfektin apuverbinä. Yksikön 3. persoona: has.",
              rules: [
                "I / you / we / they → have",
                "He / she / it → has",
                "Kielto: don't have / doesn't have (TAI vanhempi haven't / hasn't)",
                "Kysymys: Do you have…? Does she have…?"
              ],
              examples: [
                { en: "I have a car.", fi: "Minulla on auto." },
                { en: "She has two dogs.", fi: "Hänellä on kaksi koiraa." },
                { en: "Do you have time?", fi: "Onko sinulla aikaa?" }
              ],
              exercises: [
                { type:"choose", prompt:"Valitse oikea muoto:", template:"He ___ a brother.", options:["have","has"], answer:"has", fi:"Hänellä on veli." },
                { type:"fill", prompt:"Täydennä:", template:"They ___ a big house.", answer:"have", fi:"Heillä on iso talo." }
              ]
            },
            {
              id: "en_tenses", label: "Aikamuodot", sub: "Tenses",
              desc: "Englannissa on 12 aikamuotoa: 3 aikaa (preesens, mennyt, tuleva) × 4 aspektia (yksinkertainen, kestomuoto, perfekti, perfekti-kestomuoto). Tärkeimmät hallita: simple ja continuous-muodot, sekä perfekti.",
              children: [
                {
                  id: "en_present_simple", label: "Present simple", sub: "Yksinkertainen preesens",
                  desc: "Käytetään tottumuksista, tosiasioista ja yleisistä tilanteista. Yksikön 3. persoonan päätteenä -s/-es.",
                  rules: [
                    "I / you / we / they + verb (I work)",
                    "He / she / it + verb-s (She works)",
                    "Kielto: don't / doesn't + verb (He doesn't work)",
                    "Kysymys: Do / Does + subj + verb? (Do you work?)"
                  ],
                  examples: [
                    { en: "I drink coffee every morning.", fi: "Juon kahvia joka aamu." },
                    { en: "She lives in Helsinki.", fi: "Hän asuu Helsingissä." },
                    { en: "The sun rises in the east.", fi: "Aurinko nousee idästä." }
                  ],
                  exercises: [
                    { type:"choose", prompt:"Valitse oikea muoto:", template:"He ___ to school by bus.", options:["go","goes","going"], answer:"goes", fi:"Hän menee kouluun bussilla." },
                    { type:"fill", prompt:"Täydennä (verb: 'play'):", template:"She ___ tennis on Sundays.", answer:"plays", fi:"Hän pelaa tennistä sunnuntaisin." },
                    { type:"fill", prompt:"Täydennä (verb: 'study'):", template:"They ___ every day.", answer:"study", fi:"He opiskelevat joka päivä." }
                  ]
                },
                {
                  id: "en_present_continuous", label: "Present continuous", sub: "Preesensin kestomuoto",
                  desc: "Käytetään juuri nyt meneillään olevasta tai lähitulevasta. Muodostuu apuverbillä am/is/are + verbi-ing.",
                  rules: [
                    "Rakenne: am/is/are + verbing (I am working)",
                    "Lyhennetyt: I'm, he's, she's, they're + verbing",
                    "-ing-säännöt: lopussa -e poistuu (make → making), lyhyt vokaali + konsonantti = konsonantti tuplaantuu (run → running)"
                  ],
                  examples: [
                    { en: "I am reading a book.", fi: "Luen kirjaa (juuri nyt)." },
                    { en: "She is sleeping.", fi: "Hän nukkuu." },
                    { en: "They are playing outside.", fi: "He leikkivät ulkona." }
                  ],
                  exercises: [
                    { type:"fill", prompt:"Täydennä (verb: 'work'):", template:"I am ___ now.", answer:"working", fi:"Olen töissä juuri nyt." },
                    { type:"fill", prompt:"Täydennä (verb: 'run'):", template:"The dog is ___.", answer:"running", fi:"Koira juoksee." },
                    { type:"choose", prompt:"Valitse:", template:"What ___ you doing?", options:["am","is","are"], answer:"are", fi:"Mitä sinä teet?" }
                  ]
                },
                {
                  id: "en_past_simple", label: "Past simple", sub: "Yksinkertainen mennyt",
                  desc: "Käytetään päättyneistä menneistä tapahtumista. Säännölliset: verb + -ed. Epäsäännölliset: muista ulkoa.",
                  rules: [
                    "Säännölliset: work → worked, play → played, study → studied",
                    "Epäsäännölliset: go → went, eat → ate, have → had, see → saw, do → did",
                    "Kielto: didn't + perusmuoto (I didn't work)",
                    "Kysymys: Did + subj + perusmuoto (Did you work?)"
                  ],
                  examples: [
                    { en: "I worked yesterday.", fi: "Tein töitä eilen." },
                    { en: "She went home.", fi: "Hän meni kotiin." },
                    { en: "We ate pizza last night.", fi: "Söimme pizzaa eilen illalla." }
                  ],
                  exercises: [
                    { type:"fill", prompt:"Imperfekti (verb: 'walk'):", template:"They ___ to school.", answer:"walked", fi:"He kävelivät kouluun." },
                    { type:"fill", prompt:"Imperfekti (verb: 'go'):", template:"I ___ to the shop.", answer:"went", fi:"Menin kauppaan." },
                    { type:"fill", prompt:"Imperfekti (verb: 'have'):", template:"She ___ a great time.", answer:"had", fi:"Hänellä oli hauskaa." },
                    { type:"transform", prompt:"Muuta imperfektiin:", template:"I see you.", answer:"I saw you.", fi:"Näin sinut." }
                  ]
                },
                {
                  id: "en_past_continuous", label: "Past continuous", sub: "Imperfektin kestomuoto",
                  desc: "Käytetään meneillään olleesta toiminnasta jonain hetkenä menneisyydessä. was/were + verbing.",
                  rules: [
                    "I / he / she / it → was + verbing",
                    "You / we / they → were + verbing",
                    "Usein toinen tapahtuma keskeyttää: I was sleeping when the phone rang."
                  ],
                  examples: [
                    { en: "I was reading when she called.", fi: "Luin kun hän soitti." },
                    { en: "They were playing all evening.", fi: "He leikkivät koko illan." }
                  ],
                  exercises: [
                    { type:"choose", prompt:"Valitse:", template:"He ___ watching TV.", options:["was","were"], answer:"was", fi:"Hän katsoi TV:tä." },
                    { type:"fill", prompt:"Täydennä:", template:"We ___ eating dinner at 7.", answer:"were", fi:"Söimme illallista seitsemältä." }
                  ]
                },
                {
                  id: "en_present_perfect", label: "Present perfect", sub: "Perfekti",
                  desc: "Käytetään menneestä tapahtumasta jolla on yhteys nykyhetkeen. have/has + perfektipartisiippi (3. muoto).",
                  rules: [
                    "Rakenne: have / has + V3 (I have seen, she has gone)",
                    "Säännöllinen V3 = V2 = verb + ed",
                    "Epäsäännöllinen V3: go → gone, see → seen, eat → eaten, do → done",
                    "Avainsanat: ever, never, just, already, yet, since, for"
                  ],
                  examples: [
                    { en: "I have seen that film.", fi: "Olen nähnyt sen elokuvan." },
                    { en: "She has just arrived.", fi: "Hän on juuri saapunut." },
                    { en: "Have you ever been to Paris?", fi: "Oletko koskaan käynyt Pariisissa?" }
                  ],
                  exercises: [
                    { type:"fill", prompt:"Täydennä apuverbi:", template:"She ___ finished her work.", answer:"has", fi:"Hän on lopettanut työnsä." },
                    { type:"fill", prompt:"Perfekti (verb: 'eat'):", template:"I have ___ already.", answer:"eaten", fi:"Olen jo syönyt." },
                    { type:"fill", prompt:"Perfekti (verb: 'see'):", template:"They have ___ the movie.", answer:"seen", fi:"He ovat nähneet elokuvan." },
                    { type:"choose", prompt:"Valitse:", template:"Have you ___ been to London?", options:["ever","never","yet"], answer:"ever", fi:"Oletko koskaan käynyt Lontoossa?" }
                  ]
                },
                {
                  id: "en_future_will", label: "Future — will", sub: "Tulevaisuus 'will'",
                  desc: "Will + perusmuoto. Käytetään ennustuksista, päätöksistä juuri nyt, ja lupauksista.",
                  rules: [
                    "Rakenne: will + verb (I will come)",
                    "Lyhennetty: I'll, you'll, he'll, she'll, we'll, they'll",
                    "Kielto: will not = won't",
                    "Kysymys: Will you…?"
                  ],
                  examples: [
                    { en: "I will help you.", fi: "Autan sinua." },
                    { en: "It will rain tomorrow.", fi: "Huomenna sataa." },
                    { en: "I won't tell anyone.", fi: "En kerro kenellekään." }
                  ],
                  exercises: [
                    { type:"fill", prompt:"Täydennä apuverbi:", template:"I ___ call you later.", answer:"will", fi:"Soitan sinulle myöhemmin." },
                    { type:"fill", prompt:"Kielto:", template:"He ___ come tonight.", answer:"won't", fi:"Hän ei tule tänään." }
                  ]
                },
                {
                  id: "en_future_going_to", label: "Future — going to", sub: "Tulevaisuus 'going to'",
                  desc: "Going to + perusmuoto. Käytetään suunnitelmista ja näkyvistä merkeistä.",
                  rules: [
                    "Rakenne: am/is/are + going to + verb",
                    "Suunnitelma: I'm going to study tonight.",
                    "Näkyvä merkki: Look at those clouds — it's going to rain."
                  ],
                  examples: [
                    { en: "We are going to visit Spain next summer.", fi: "Aiomme käydä Espanjassa ensi kesänä." },
                    { en: "She is going to be a doctor.", fi: "Hänestä tulee lääkäri." }
                  ],
                  exercises: [
                    { type:"choose", prompt:"Valitse:", template:"They ___ going to leave soon.", options:["is","are","am"], answer:"are", fi:"He aikovat lähteä pian." }
                  ]
                },
                {
                  id: "en_conditional", label: "Konditionaali", sub: "Would, if-lauseet",
                  desc: "If-lauseet ja would-rakenne. Käytetään ehdoista ja kuvitelluista tilanteista.",
                  rules: [
                    "Tyyppi 1 — todellinen: If it rains, I will stay home.",
                    "Tyyppi 2 — epätodennäköinen nykyhetkessä: If I had money, I would buy a car.",
                    "Tyyppi 3 — mahdoton menneisyys: If I had known, I would have come.",
                    "Would lyhennetty: 'd (I'd, he'd, she'd)"
                  ],
                  examples: [
                    { en: "If I were rich, I would travel a lot.", fi: "Jos olisin rikas, matkustaisin paljon." },
                    { en: "I would help if I could.", fi: "Auttaisin jos voisin." }
                  ],
                  exercises: [
                    { type:"fill", prompt:"Täydennä:", template:"If it ___ tomorrow, we will stay home.", answer:"rains", fi:"Jos huomenna sataa, jäämme kotiin." },
                    { type:"choose", prompt:"Valitse:", template:"If I ___ you, I would go.", options:["am","was","were"], answer:"were", fi:"Jos olisin sinä, menisin." }
                  ]
                }
              ]
            },
            {
              id: "en_modals", label: "Modaaliverbit", sub: "Modal verbs",
              desc: "Modaaliverbit (can, could, may, might, must, should, will, would) ilmaisevat mahdollisuutta, lupaa, pakkoa tai velvollisuutta. Ne ovat yksinkertaisia: ei taivuteta persoonan mukaan, perusmuoto seuraa aina.",
              rules: [
                "Rakenne: modal + perusmuoto (I can swim. She must go.)",
                "Ei -s yksikön 3. persoonassa (She can. Ei: She cans.)",
                "Kielto: modal + not (cannot/can't, must not/mustn't, should not/shouldn't)",
                "Tärkeät: can (osaa, voi), could (osasi, voisi), may/might (saattaa), must (täytyy), should (pitäisi)"
              ],
              examples: [
                { en: "I can swim.", fi: "Osaan uida." },
                { en: "You should rest.", fi: "Sinun pitäisi levätä." },
                { en: "She must finish her work.", fi: "Hänen täytyy lopettaa työnsä." },
                { en: "It might rain.", fi: "Saattaa sataa." }
              ],
              exercises: [
                { type:"choose", prompt:"Valitse modaali:", template:"You ___ see a doctor.", options:["should","shoulds","shoulding"], answer:"should", fi:"Sinun pitäisi mennä lääkäriin." },
                { type:"choose", prompt:"Valitse:", template:"She ___ speak three languages.", options:["can","cans","caning"], answer:"can", fi:"Hän osaa puhua kolmea kieltä." },
                { type:"choose", prompt:"Valitse:", template:"You ___ smoke here.", options:["must not","not must","don't must"], answer:"must not", fi:"Et saa polttaa täällä." }
              ]
            },
            {
              id: "en_irregular_verbs", label: "Epäsäännölliset verbit", sub: "Irregular verbs",
              desc: "Englannissa on noin 200 epäsäännöllistä verbiä. Kolme muotoa pitää muistaa ulkoa: perusmuoto (V1) — imperfekti (V2) — perfektipartisiippi (V3).",
              rules: [
                "be — was/were — been",
                "go — went — gone",
                "see — saw — seen",
                "eat — ate — eaten",
                "do — did — done",
                "have — had — had",
                "make — made — made",
                "take — took — taken",
                "give — gave — given",
                "come — came — come",
                "speak — spoke — spoken",
                "write — wrote — written",
                "drive — drove — driven",
                "find — found — found",
                "buy — bought — bought",
                "think — thought — thought"
              ],
              exercises: [
                { type:"fill", prompt:"Imperfekti (V2) verbistä 'go':", template:"He ___ home.", answer:"went", fi:"Hän meni kotiin." },
                { type:"fill", prompt:"V2 verbistä 'eat':", template:"They ___ lunch.", answer:"ate", fi:"He söivät lounaan." },
                { type:"fill", prompt:"V3 verbistä 'see':", template:"I have ___ her.", answer:"seen", fi:"Olen nähnyt hänet." },
                { type:"fill", prompt:"V2 verbistä 'take':", template:"She ___ a photo.", answer:"took", fi:"Hän otti kuvan." },
                { type:"fill", prompt:"V3 verbistä 'write':", template:"He has ___ a book.", answer:"written", fi:"Hän on kirjoittanut kirjan." }
              ]
            }
          ]
        },

        // --- Pronominit ---
        {
          id: "en_pronouns", label: "Pronominit", sub: "Pronouns",
          desc: "Pronominit korvaavat substantiiveja. Englannissa pronominilla on erikseen subjektin, objektin ja omistuksen muoto.",
          children: [
            {
              id: "en_pron_subject", label: "Subjektipronominit", sub: "I, you, he…",
              desc: "Lauseen tekijä: I, you, he, she, it, we, they.",
              rules: [
                "I — minä (yksikkö 1.)",
                "you — sinä / te (sama yksikössä ja monikossa)",
                "he — hän (mies), she — hän (nainen), it — se",
                "we — me, they — he"
              ],
              examples: [
                { en: "I live here.", fi: "Asun täällä." },
                { en: "They are happy.", fi: "He ovat iloisia." }
              ],
              exercises: [
                { type:"choose", prompt:"Valitse:", template:"___ am tired.", options:["I","Me","My"], answer:"I", fi:"Olen väsynyt." }
              ]
            },
            {
              id: "en_pron_object", label: "Objektipronominit", sub: "me, you, him…",
              desc: "Kun pronomini on objekti (tekemisen kohde): me, you, him, her, it, us, them.",
              rules: [
                "I → me, he → him, she → her, we → us, they → them",
                "Käyttö verbin tai preposition jälkeen: She saw me. Talk to him."
              ],
              examples: [
                { en: "Call me later.", fi: "Soita minulle myöhemmin." },
                { en: "I saw them at the park.", fi: "Näin heidät puistossa." }
              ],
              exercises: [
                { type:"choose", prompt:"Valitse:", template:"Tell ___ the truth.", options:["I","me","my"], answer:"me", fi:"Kerro minulle totuus." },
                { type:"choose", prompt:"Valitse:", template:"Don't talk to ___.", options:["he","him","his"], answer:"him", fi:"Älä puhu hänelle." }
              ]
            },
            {
              id: "en_pron_possessive", label: "Omistuspronominit", sub: "my, your, his… / mine, yours…",
              desc: "Omistus kahdessa muodossa: ennen substantiivia (my book) ja itsenäisenä (it's mine).",
              rules: [
                "Edellä: my, your, his, her, its, our, their + substantiivi",
                "Itsenäisenä: mine, yours, his, hers, ours, theirs"
              ],
              examples: [
                { en: "This is my house.", fi: "Tämä on minun taloni." },
                { en: "The book is yours.", fi: "Kirja on sinun." }
              ],
              exercises: [
                { type:"choose", prompt:"Valitse:", template:"Is this ___ pen?", options:["you","your","yours"], answer:"your", fi:"Onko tämä sinun kynäsi?" },
                { type:"choose", prompt:"Valitse:", template:"That coat is ___.", options:["she","her","hers"], answer:"hers", fi:"Tuo takki on hänen." }
              ]
            }
          ]
        },

        // --- Adjektiivit ---
        {
          id: "en_adj", label: "Adjektiivit", sub: "Adjectives",
          desc: "Adjektiivi kuvaa substantiivia. Englannissa adjektiivi ei taivu (ei luvussa eikä suvussa), mutta vertailumuodot pitää osata.",
          children: [
            {
              id: "en_comparison", label: "Vertailu", sub: "Comparative & superlative",
              desc: "Adjektiivit vertaillaan kolmessa muodossa: positiivi, komparatiivi (verrattu) ja superlatiivi (paras).",
              rules: [
                "Lyhyet (1 tavu): + -er, + -est (fast → faster → fastest)",
                "Tavu jossa lyhyt vokaali + konsonantti: konsonantti tuplaantuu (big → bigger → biggest)",
                "-y → -ier, -iest (happy → happier → happiest)",
                "Pitkät (2+ tavua): more / most (beautiful → more beautiful → most beautiful)",
                "Epäsäännölliset: good → better → best; bad → worse → worst; far → further → furthest"
              ],
              examples: [
                { en: "He is taller than me.", fi: "Hän on pidempi kuin minä." },
                { en: "She is the most beautiful person.", fi: "Hän on kaunein henkilö." },
                { en: "This is better than that.", fi: "Tämä on parempi kuin tuo." }
              ],
              exercises: [
                { type:"fill", prompt:"Komparatiivi sanasta 'big':", template:"This box is ___ than that one.", answer:"bigger", fi:"Tämä laatikko on isompi kuin tuo." },
                { type:"fill", prompt:"Superlatiivi sanasta 'happy':", template:"She is the ___ person here.", answer:"happiest", fi:"Hän on onnellisin henkilö täällä." },
                { type:"fill", prompt:"Komparatiivi 'good':", template:"This is ___ than yesterday.", answer:"better", fi:"Tämä on parempi kuin eilen." },
                { type:"choose", prompt:"Valitse:", template:"This is the ___ film I have seen.", options:["good","better","best"], answer:"best", fi:"Tämä on paras elokuva jonka olen nähnyt." }
              ]
            }
          ]
        },

        // --- Adverbit ---
        {
          id: "en_adv", label: "Adverbit", sub: "Adverbs",
          desc: "Adverbi kuvaa verbiä, adjektiivia tai toista adverbia. Englannissa adverbi muodostetaan usein lisäämällä -ly adjektiiviin.",
          rules: [
            "Adjektiivi + ly → adverbi (quick → quickly, slow → slowly, happy → happily)",
            "Poikkeukset: good → well, fast → fast, hard → hard",
            "Sijoittuminen: usein verbin jälkeen tai lauseen alussa/lopussa"
          ],
          examples: [
            { en: "She speaks quickly.", fi: "Hän puhuu nopeasti." },
            { en: "He drives carefully.", fi: "Hän ajaa varovasti." },
            { en: "I sing well.", fi: "Laulan hyvin." }
          ],
          exercises: [
            { type:"fill", prompt:"Adverbi sanasta 'careful':", template:"Drive ___, please.", answer:"carefully", fi:"Aja varovasti, kiitos." },
            { type:"choose", prompt:"Valitse:", template:"She sings ___.", options:["good","well","goodly"], answer:"well", fi:"Hän laulaa hyvin." }
          ]
        },

        // --- Prepositiot ---
        {
          id: "en_prep", label: "Prepositiot", sub: "Prepositions",
          desc: "Pieni sana joka kytkee substantiivin tai pronominin muuhun lauseeseen. Englannin prepositiot ovat tunnetusti hankalia — moni niistä on opittava ulkoa.",
          children: [
            {
              id: "en_prep_place", label: "Paikan prepositiot", sub: "in / on / at / under / behind…",
              desc: "in = sisällä, on = päällä/ylhäällä, at = kohdassa/tiettynä paikkana, under = alla, behind = takana, next to = vieressä.",
              examples: [
                { en: "The book is on the table.", fi: "Kirja on pöydällä." },
                { en: "She is in the kitchen.", fi: "Hän on keittiössä." },
                { en: "We met at the station.", fi: "Tapasimme asemalla." }
              ],
              exercises: [
                { type:"choose", prompt:"Valitse prepositio:", template:"The cat is ___ the box.", options:["in","on","at"], answer:"in", fi:"Kissa on laatikossa." },
                { type:"choose", prompt:"Valitse:", template:"The cup is ___ the table.", options:["in","on","at"], answer:"on", fi:"Kuppi on pöydällä." }
              ]
            },
            {
              id: "en_prep_time", label: "Ajan prepositiot", sub: "in / on / at / since / for…",
              desc: "in + kuukausi/vuosi/aamupäivä (in May, in 2026, in the morning). on + päivä (on Monday, on 5th May). at + kellonaika/yö (at 7, at night). since = jostakin alkaen, for = ajanjakson verran.",
              examples: [
                { en: "I was born in 1990.", fi: "Synnyin vuonna 1990." },
                { en: "We meet on Friday.", fi: "Tapaamme perjantaina." },
                { en: "The bus leaves at seven.", fi: "Bussi lähtee seitsemältä." }
              ],
              exercises: [
                { type:"choose", prompt:"Valitse:", template:"School starts ___ Monday.", options:["in","on","at"], answer:"on", fi:"Koulu alkaa maanantaina." },
                { type:"choose", prompt:"Valitse:", template:"I get up ___ seven.", options:["in","on","at"], answer:"at", fi:"Herään seitsemältä." },
                { type:"choose", prompt:"Valitse:", template:"We swim ___ summer.", options:["in","on","at"], answer:"in", fi:"Uimme kesällä." }
              ]
            }
          ]
        }

      ]
    },

    // ===== LAUSERAKENNE =====
    {
      id: "en_sentence", label: "Lauserakenne", sub: "Sentence patterns",
      desc: "Miten sanat järjestetään lauseiksi. Englannissa sanajärjestys on kiinteä: subjekti–verbi–objekti.",
      children: [
        {
          id: "en_svo", label: "Väitelause SVO", sub: "Subject + Verb + Object",
          desc: "Englannin perusjärjestys: kuka — tekee mitä — kenelle / mihin.",
          rules: [
            "Subjekti ennen verbiä",
            "Objekti verbin jälkeen",
            "Adverbit yleensä lopussa tai keskellä (ks. taajuusadverbit)"
          ],
          examples: [
            { en: "I love coffee.", fi: "Rakastan kahvia." },
            { en: "She bought a book.", fi: "Hän osti kirjan." }
          ],
          exercises: [
            { type:"build", prompt:"Järjestä sanat:", template:"book / read / a / I", answer:"I read a book", fi:"Luen kirjaa." },
            { type:"build", prompt:"Järjestä sanat:", template:"the / opened / She / door", answer:"She opened the door", fi:"Hän avasi oven." }
          ]
        },
        {
          id: "en_questions", label: "Kysymyslauseet", sub: "Questions",
          desc: "Englannissa kysymys muodostetaan käännöksellä: apuverbi ennen subjektia.",
          rules: [
            "Be-verbillä: subjekti ja be vaihtavat paikkaa (You are happy → Are you happy?)",
            "Muut verbit: apuverbi do/does/did + subj + perusmuoto (You like tea → Do you like tea?)",
            "Wh-kysymys: kysymyssana alkuun + do/does/did + subj + verb (Where do you live?)"
          ],
          examples: [
            { en: "Are you tired?", fi: "Oletko väsynyt?" },
            { en: "Do you speak English?", fi: "Puhutko englantia?" },
            { en: "Where does she live?", fi: "Missä hän asuu?" }
          ],
          exercises: [
            { type:"transform", prompt:"Tee kysymys: 'You are ready.'", template:"You are ready.", answer:"Are you ready?", fi:"Oletko valmis?" },
            { type:"transform", prompt:"Tee kysymys: 'He works here.'", template:"He works here.", answer:"Does he work here?", fi:"Tekeekö hän työtä täällä?" },
            { type:"choose", prompt:"Valitse:", template:"___ you like music?", options:["Are","Do","Does"], answer:"Do", fi:"Pidätkö musiikista?" }
          ]
        },
        {
          id: "en_negative", label: "Kieltolauseet", sub: "Negatives",
          desc: "Kielto muodostetaan apuverbillä + not. Lyhennetyt muodot ovat yleisiä.",
          rules: [
            "Be: am not / isn't / aren't (I'm not happy)",
            "Other verbs: don't / doesn't + perusmuoto (She doesn't know)",
            "Mennyt: didn't + perusmuoto (We didn't go)",
            "Modaalit: can't, won't, shouldn't, mustn't"
          ],
          examples: [
            { en: "I don't smoke.", fi: "En tupakoi." },
            { en: "She isn't here.", fi: "Hän ei ole täällä." },
            { en: "We didn't see him.", fi: "Emme nähneet häntä." }
          ],
          exercises: [
            { type:"transform", prompt:"Tee kielto: 'I like tea.'", template:"I like tea.", answer:"I don't like tea.", fi:"En pidä teestä." },
            { type:"transform", prompt:"Tee kielto: 'He works hard.'", template:"He works hard.", answer:"He doesn't work hard.", fi:"Hän ei tee kovasti töitä." },
            { type:"transform", prompt:"Tee kielto: 'They went home.'", template:"They went home.", answer:"They didn't go home.", fi:"He eivät menneet kotiin." }
          ]
        }
      ]
    }

  ]
};

// Apufunktiot puun läpikäyntiin -------------------------------
window.GRAMMAR_EN_FLAT = (function () {
  const out = [];
  function walk(node, depth, parent) {
    out.push({ node, depth, parentId: parent });
    if (node.children) for (const c of node.children) walk(c, depth + 1, node.id);
  }
  walk(window.GRAMMAR_EN, 0, null);
  return out;
})();

// Yhteinen rajapinta, joka hakee kohdekielen mukaisesta puusta
window.currentGrammarTree = function () {
  const t = window.STATE && window.STATE.target;
  if (t === "sv" && window.GRAMMAR_SV) return window.GRAMMAR_SV;
  if (t === "fi" && window.GRAMMAR_FI) return window.GRAMMAR_FI;
  return window.GRAMMAR_EN;
};
window.currentGrammarFlat = function () {
  const t = window.STATE && window.STATE.target;
  if (t === "sv" && window.GRAMMAR_SV_FLAT) return window.GRAMMAR_SV_FLAT;
  if (t === "fi" && window.GRAMMAR_FI_FLAT) return window.GRAMMAR_FI_FLAT;
  return window.GRAMMAR_EN_FLAT;
};

window.findGrammarNode = function (id) {
  const flat = window.currentGrammarFlat();
  const item = flat.find(x => x.node.id === id);
  return item ? item.node : null;
};

// Edistymisen apurit
window.grammarProgressKey = function (nodeId) {
  return "grammar." + nodeId;
};

window.getGrammarProgress = function (nodeId) {
  return (window.STATE.grammar && window.STATE.grammar[nodeId]) || { correct: 0, wrong: 0, lastSeen: 0 };
};

window.setGrammarProgress = function (nodeId, patch) {
  window.STATE.grammar = window.STATE.grammar || {};
  const cur = window.getGrammarProgress(nodeId);
  window.STATE.grammar[nodeId] = Object.assign({}, cur, patch);
  window.STATE_API && window.STATE_API.save();
};

window.grammarMastery = function (nodeId) {
  const p = window.getGrammarProgress(nodeId);
  if (p.correct + p.wrong === 0) return 0;
  const ratio = p.correct / (p.correct + p.wrong);
  const exposure = Math.min(1, (p.correct + p.wrong) / 8);
  return ratio * exposure;
};

console.log("Kielioppi-EN ladattu:", window.GRAMMAR_EN_FLAT.length, "solmua");
