// Aihepiirit ja sanojen luokittelu.
// Jokainen aihepiiri saa värin (käytetään galaksinäkymässä ja korteissa)
// ja sanat liitetään yhteen aihepiiriin id:n perusteella.

window.TOPICS = [
  { id: "pronouns",   label: "Pronominit",       short: "Pron",  color: "#a78bfa", desc: "Persoona- ja osoittavat pronominit" },
  { id: "numbers",    label: "Numerot",          short: "Num",   color: "#fbbf24", desc: "Lukusanat 1–1000" },
  { id: "time",       label: "Aika ja päivät",    short: "Aika",  color: "#60a5fa", desc: "Aikailmaukset, viikonpäivät, vuorokaudenajat" },
  { id: "people",     label: "Ihmiset ja perhe", short: "Per",   color: "#f472b6", desc: "Perheenjäsenet, ystävät, ikäluokat" },
  { id: "body",       label: "Keho",             short: "Keho",  color: "#fb7185", desc: "Kehonosat" },
  { id: "food",       label: "Ruoka ja juoma",   short: "Ruok",  color: "#fb923c", desc: "Ruoka-aineet ja ateriat" },
  { id: "animals",    label: "Eläimet",          short: "Eläi",  color: "#a3e635", desc: "Koti- ja luonnoneläimet" },
  { id: "nature",     label: "Luonto ja sää",    short: "Luo",   color: "#34d399", desc: "Luontokohteet, sää ja vuodenajat" },
  { id: "home",       label: "Koti ja esineet",  short: "Koti",  color: "#facc15", desc: "Huoneet, huonekalut, esineet, vaatteet" },
  { id: "travel",     label: "Liikenne ja paikat", short: "Mat", color: "#22d3ee", desc: "Kulkuneuvot ja paikat" },
  { id: "colors",     label: "Värit",            short: "Vär",   color: "#e879f9", desc: "Värit ja niiden nimet" },
  { id: "qualities",  label: "Ominaisuudet",     short: "Omi",   color: "#84cc16", desc: "Asioita kuvaavia adjektiiveja" },
  { id: "feelings",   label: "Tunteet ja tilat", short: "Tunn",  color: "#f43f5e", desc: "Iloinen, väsynyt, nälkäinen jne." },
  { id: "social",     label: "Tervehdykset",     short: "Soc",   color: "#38bdf8", desc: "Kohteliaisuudet, tervehdykset, ilmaukset" },
  { id: "actions",    label: "Toiminta",         short: "Teko",  color: "#ef4444", desc: "Liikkumis-, arki- ja työverbit" },
  { id: "expression", label: "Ilmaisu ja mieli", short: "Mieli", color: "#6366f1", desc: "Puhuminen, ajattelu, aistit, tunteminen" },
  { id: "function",   label: "Määreet",          short: "Mää",   color: "#94a3b8", desc: "Kysymyssanat ja yleiset adverbit" }
];

// Suora id → topic-mappaus. Kun lisäät uuden sanan, lisää myös tähän.
window.WORD_TOPIC = {
  // pronouns
  i:"pronouns", you:"pronouns", he:"pronouns", she:"pronouns", it:"pronouns",
  we:"pronouns", they:"pronouns", this:"pronouns", that:"pronouns", who:"pronouns", what:"pronouns",

  // numbers
  one:"numbers", two:"numbers", three:"numbers", four:"numbers", five:"numbers",
  six:"numbers", seven:"numbers", eight:"numbers", nine:"numbers", ten:"numbers",
  hundred:"numbers", thousand:"numbers",

  // time
  time:"time", day:"time", night:"time", morning:"time", evening:"time",
  week:"time", month:"time", year:"time", hour:"time", minute:"time",
  monday:"time", tuesday:"time", wednesday:"time", thursday:"time",
  friday:"time", saturday:"time", sunday:"time",
  today:"time", tomorrow:"time", yesterday:"time", now:"time", later:"time",

  // people
  family:"people", mother:"people", father:"people", sister:"people", brother:"people",
  child:"people", boy:"people", girl:"people", man:"people", woman:"people",
  people:"people", friend:"people", name:"people",

  // body
  head:"body", eye:"body", ear:"body", mouth:"body", nose:"body",
  hand:"body", foot:"body", hair:"body", heart:"body", body:"body",

  // food
  food:"food", water:"food", milk:"food", coffee:"food", tea:"food",
  bread:"food", butter:"food", cheese:"food", egg:"food", meat:"food",
  fish:"food", fruit:"food", apple:"food", vegetable:"food", sugar:"food",
  salt:"food", breakfast:"food", lunch:"food", dinner:"food",

  // animals
  animal:"animals", cat:"animals", dog:"animals", bird:"animals", horse:"animals",
  cow:"animals", pig:"animals", sheep:"animals", mouse:"animals", bear:"animals",

  // nature
  sun:"nature", moon:"nature", star:"nature", sky:"nature", tree:"nature",
  flower:"nature", forest:"nature", mountain:"nature", river:"nature", lake:"nature",
  sea:"nature", rain:"nature", snow:"nature", wind:"nature", fire:"nature",
  weather:"nature", summer:"nature", winter:"nature", spring:"nature", autumn:"nature",

  // home (sisältää myös pienet esineet ja vaatteet jotta klusteri säilyy mielekkään kokoisena)
  house:"home", home:"home", room:"home", door:"home", window:"home",
  table:"home", chair:"home", bed:"home", kitchen:"home", bathroom:"home",
  book:"home", pen:"home", paper:"home", phone:"home", computer:"home",
  key:"home", money:"home",
  clothes:"home", shoe:"home", shirt:"home",

  // travel
  car:"travel", bus:"travel", train:"travel", plane:"travel", bike:"travel",
  street:"travel", city:"travel", country:"travel", school:"travel",
  shop:"travel", store:"travel", office:"travel", place:"travel",

  // colors
  color:"colors", red:"colors", blue:"colors", green:"colors", yellow:"colors",
  black:"colors", white:"colors", brown:"colors", gray:"colors",

  // qualities
  good:"qualities", bad:"qualities", big:"qualities", small:"qualities", new:"qualities",
  old:"qualities", young:"qualities", long:"qualities", short:"qualities",
  high:"qualities", low:"qualities", fast:"qualities", slow:"qualities",
  hot:"qualities", cold:"qualities", warm:"qualities", easy:"qualities", hard:"qualities",
  beautiful:"qualities", ugly:"qualities", important:"qualities", interesting:"qualities",
  right:"qualities", wrong:"qualities",

  // feelings
  happy:"feelings", sad:"feelings", tired:"feelings", hungry:"feelings", thirsty:"feelings",

  // social
  yes:"social", no:"social", please:"social", thanks:"social", hello:"social",
  goodbye:"social", sorry:"social",

  // actions (fyysiset & arkitoimet & kaupankäynti & työ)
  be:"actions", have:"actions", do:"actions", go:"actions", come:"actions",
  make:"actions", take:"actions", give:"actions", get:"actions", work:"actions",
  play:"actions", open:"actions", close:"actions", eat:"actions", drink:"actions",
  sleep:"actions", wake:"actions", walk:"actions", run:"actions", sit:"actions",
  stand:"actions", drive:"actions", buy:"actions", sell:"actions", pay:"actions",
  live:"actions", learn:"actions", teach:"actions", help:"actions", use:"actions",
  wait:"actions", start:"actions", stop:"actions",

  // expression (puhuminen, aistit, ajattelu, tunteminen)
  see:"expression", know:"expression", think:"expression", want:"expression",
  need:"expression", like:"expression", love:"expression", say:"expression",
  tell:"expression", ask:"expression", answer:"expression", read:"expression",
  write:"expression", speak:"expression", listen:"expression", hear:"expression",
  look:"expression", find:"expression",

  // function (adverbit & kysymyssanat)
  very:"function", always:"function", never:"function", often:"function",
  sometimes:"function", here:"function", there:"function",
  where:"function", when:"function", why:"function", how:"function"
};

// Sanaluokkien suomenkieliset nimet
window.POS_LABEL = {
  pron:   "pronomini",
  verb:   "verbi",
  noun:   "substantiivi",
  adj:    "adjektiivi",
  adv:    "adverbi",
  num:    "lukusana",
  interj: "huudahdus"
};

// Apufunktioita
window.getTopic = function(topicId) {
  return window.TOPICS.find(t => t.id === topicId);
};

window.getWordTopic = function(wordId) {
  return window.WORD_TOPIC[wordId] || "function";
};

window.wordsByTopic = function(topicId) {
  return window.WORDS.filter(w => window.getWordTopic(w.id) === topicId);
};

window.topicCounts = function() {
  const counts = {};
  for (const t of window.TOPICS) counts[t.id] = 0;
  for (const w of window.WORDS) {
    const tid = window.getWordTopic(w.id);
    counts[tid] = (counts[tid] || 0) + 1;
  }
  return counts;
};

console.log("Aihepiirit ladattu:", window.TOPICS.length);
