// Käsikirjoitetut dialogit aloittelijoille (A1/A2).
// Jokaisessa dialogissa: vaiheet (steps), joissa botin repliikki sekä käyttäjän vaihtoehdot.
// Vaihtoehdot ovat oikein/väärin -tyyppisiä — oikea vie eteenpäin, väärän jälkeen näytetään vinkki.

window.DIALOGUES = [
  {
    id: "cafe",
    title: "Kahvilassa",
    targetLanguage: "en",     // oletus — vaihdetaan käyttäjän kieliparin mukaan
    level: "A1",
    icon: "☕",
    description: "Tilaa kahvi ja leivos.",
    steps: [
      {
        speaker: "bot",
        lines: {
          en: "Hello! What can I get you?",
          fi: "Hei! Mitä saisi olla?",
          sv: "Hej! Vad får det vara?"
        },
        choices: [
          { correct: true,  text: { en: "A coffee, please.", fi: "Kahvi, kiitos.", sv: "En kaffe, tack." } },
          { correct: false, text: { en: "Goodbye.",          fi: "Näkemiin.",       sv: "Hej då." },
            hint: { en: "Order something first.", fi: "Tilaa ensin jotain.", sv: "Beställ något först." } },
          { correct: false, text: { en: "I am a cat.",       fi: "Olen kissa.",     sv: "Jag är en katt." },
            hint: { en: "Try ordering a drink.", fi: "Yritä tilata juoma.", sv: "Försök beställa en dryck." } }
        ]
      },
      {
        speaker: "bot",
        lines: {
          en: "Anything else?",
          fi: "Saako olla muuta?",
          sv: "Något annat?"
        },
        choices: [
          { correct: true, text: { en: "One bread, please.", fi: "Yksi leipä, kiitos.", sv: "Ett bröd, tack." } },
          { correct: true, text: { en: "No, thank you.",      fi: "Ei, kiitos.",         sv: "Nej, tack." } },
          { correct: false, text: { en: "Water is cold.",     fi: "Vesi on kylmää.",     sv: "Vattnet är kallt." },
            hint: { en: "Yes / no answer expected.", fi: "Vastaa kyllä tai ei.", sv: "Svara ja eller nej." } }
        ]
      },
      {
        speaker: "bot",
        lines: {
          en: "That's five euros.",
          fi: "Se tekee viisi euroa.",
          sv: "Det blir fem euro."
        },
        choices: [
          { correct: true, text: { en: "Here you are. Thank you!", fi: "Olkaa hyvä. Kiitos!", sv: "Var så god. Tack!" } },
          { correct: false, text: { en: "I have no money.",         fi: "Minulla ei ole rahaa.", sv: "Jag har inga pengar." },
            hint: { en: "Polite reply expected.", fi: "Kohtelias vastaus.", sv: "Artigt svar." } }
        ]
      }
    ]
  },

  {
    id: "greeting",
    title: "Tervehdys ja esittäytyminen",
    targetLanguage: "en",
    level: "A1",
    icon: "👋",
    description: "Tervehdi ja kerro nimesi.",
    steps: [
      {
        speaker: "bot",
        lines: { en: "Hello!", fi: "Hei!", sv: "Hej!" },
        choices: [
          { correct: true, text: { en: "Hello!", fi: "Hei!", sv: "Hej!" } },
          { correct: true, text: { en: "Good morning!", fi: "Hyvää huomenta!", sv: "God morgon!" } }
        ]
      },
      {
        speaker: "bot",
        lines: { en: "What is your name?", fi: "Mikä sinun nimesi on?", sv: "Vad heter du?" },
        choices: [
          { correct: true,  text: { en: "My name is Matti.",  fi: "Minun nimeni on Matti.",  sv: "Jag heter Matti." } },
          { correct: false, text: { en: "I am cold.",          fi: "Minulla on kylmä.",       sv: "Jag fryser." },
            hint: { en: "Tell your name.", fi: "Kerro nimesi.", sv: "Säg ditt namn." } }
        ]
      },
      {
        speaker: "bot",
        lines: { en: "How are you?", fi: "Mitä kuuluu?", sv: "Hur mår du?" },
        choices: [
          { correct: true, text: { en: "I am fine, thanks.", fi: "Hyvää, kiitos.",  sv: "Bra, tack." } },
          { correct: true, text: { en: "Tired but happy.",    fi: "Väsynyt mutta iloinen.", sv: "Trött men glad." } }
        ]
      }
    ]
  },

  {
    id: "directions",
    title: "Reittiohjeita",
    targetLanguage: "en",
    level: "A2",
    icon: "🗺️",
    description: "Kysy tietä asemalle.",
    steps: [
      {
        speaker: "bot",
        lines: { en: "Can I help you?", fi: "Voinko auttaa?", sv: "Kan jag hjälpa dig?" },
        choices: [
          { correct: true, text: { en: "Where is the train station?", fi: "Missä juna-asema on?", sv: "Var ligger tågstationen?" } },
          { correct: false, text: { en: "I love coffee.",  fi: "Rakastan kahvia.",  sv: "Jag älskar kaffe." },
            hint: { en: "Ask a question.", fi: "Esitä kysymys.", sv: "Ställ en fråga." } }
        ]
      },
      {
        speaker: "bot",
        lines: { en: "Go right, then walk to the big street.", fi: "Mene oikealle ja kävele isolle kadulle.", sv: "Gå höger och promenera till den stora gatan." },
        choices: [
          { correct: true, text: { en: "How long does it take?", fi: "Kuinka kauan se kestää?", sv: "Hur lång tid tar det?" } },
          { correct: true, text: { en: "Thank you very much!",    fi: "Kiitos paljon!",            sv: "Tack så mycket!" } }
        ]
      }
    ]
  },

  {
    id: "shopping",
    title: "Ostoksilla",
    targetLanguage: "en",
    level: "A1",
    icon: "🛒",
    description: "Osta leipää ja maitoa.",
    steps: [
      {
        speaker: "bot",
        lines: { en: "Welcome! Can I help?", fi: "Tervetuloa! Voinko auttaa?", sv: "Välkommen! Kan jag hjälpa?" },
        choices: [
          { correct: true, text: { en: "I need bread and milk.", fi: "Tarvitsen leipää ja maitoa.", sv: "Jag behöver bröd och mjölk." } }
        ]
      },
      {
        speaker: "bot",
        lines: { en: "Anything else?", fi: "Saako olla muuta?", sv: "Något annat?" },
        choices: [
          { correct: true, text: { en: "Yes, two apples please.", fi: "Kyllä, kaksi omenaa kiitos.", sv: "Ja, två äpplen tack." } },
          { correct: true, text: { en: "No, that's all.",          fi: "Ei, siinä kaikki.",            sv: "Nej, det är allt." } }
        ]
      }
    ]
  },

  {
    id: "smalltalk",
    title: "Säästä jutustelu",
    targetLanguage: "en",
    level: "A2",
    icon: "🌤️",
    description: "Vaihda kuulumiset säästä.",
    steps: [
      {
        speaker: "bot",
        lines: { en: "Nice weather today!", fi: "Mukava sää tänään!", sv: "Trevligt väder idag!" },
        choices: [
          { correct: true, text: { en: "Yes, the sun is beautiful.", fi: "Kyllä, aurinko on kaunis.", sv: "Ja, solen är vacker." } },
          { correct: true, text: { en: "I love summer.",              fi: "Rakastan kesää.",            sv: "Jag älskar sommaren." } }
        ]
      },
      {
        speaker: "bot",
        lines: { en: "What do you do in the summer?", fi: "Mitä teet kesällä?", sv: "Vad gör du på sommaren?" },
        choices: [
          { correct: true, text: { en: "I read books and walk.", fi: "Luen kirjoja ja kävelen.", sv: "Jag läser böcker och promenerar." } },
          { correct: true, text: { en: "I drive to the lake.",   fi: "Ajan järvelle.",            sv: "Jag kör till sjön." } }
        ]
      }
    ]
  }
];

console.log("Dialogit ladattu:", window.DIALOGUES.length);
