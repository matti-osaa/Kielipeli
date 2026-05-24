// ============================================================
// Sovelluksen tila + localStorage-persistointi
// ============================================================
// Tallennetaan käyttäjän valinnat sekä jokaisen sanan
// "tilan" — toistolaatikko, eräpäivä, hallinnan taso, jne.
// Suuntaerottelu: opettelu A → B ja B → A pidetään erikseen.
// ============================================================

(function () {
  const LS_KEY = "kieli.state.v1";

  const DEFAULTS = {
    source: "fi",        // lähtökieli (mitä käyttäjä jo osaa)
    target: "en",        // opeteltava kieli
    apiKey: "",
    streak: 0,
    lastSessionDate: null,
    sessions: [],        // [{date, type, count, correct}]
    // sanan tila: { box, next, correct, wrong, lastSeen }
    // avain: wordId + "|" + suunta ("forward" tai "backward")
    progress: {}
  };

  function load() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return { ...DEFAULTS };
      const parsed = JSON.parse(raw);
      return Object.assign({}, DEFAULTS, parsed, {
        progress: Object.assign({}, parsed.progress || {})
      });
    } catch (e) {
      console.warn("Tilan luku epäonnistui:", e);
      return { ...DEFAULTS };
    }
  }

  function save() {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(window.STATE));
    } catch (e) {
      console.warn("Tilan tallennus epäonnistui:", e);
    }
  }

  function reset() {
    localStorage.removeItem(LS_KEY);
    // Tärkeää: tee tuoreet alaobjektit, jotta DEFAULTS-viittaukset
    // eivät jaa tilaa eri reset-kertojen välillä.
    window.STATE = {
      ...DEFAULTS,
      progress: {},
      grammar: {},
      sessions: []
    };
  }

  // ---- Sanan edistymisen apurit -------------------------------

  function progressKey(wordId, direction) {
    return wordId + "|" + (direction || "forward");
  }

  function getProgress(wordId, direction) {
    const k = progressKey(wordId, direction);
    return window.STATE.progress[k] || {
      box: 0, next: 0, correct: 0, wrong: 0, lastSeen: 0
    };
  }

  function setProgress(wordId, direction, patch) {
    const k = progressKey(wordId, direction);
    const cur = getProgress(wordId, direction);
    window.STATE.progress[k] = Object.assign({}, cur, patch);
    save();
  }

  // Hallinnan taso: 0 (tuntematon) — 1 (hallittu)
  // Perustuu laatikkoon (0..5) ja oikeiden vastausten määrään.
  function masteryLevel(wordId, direction) {
    const p = getProgress(wordId, direction);
    if (p.correct === 0 && p.wrong === 0) return 0;       // ei nähty
    const boxScore = Math.min(p.box / 5, 1);
    const ratio = p.correct / Math.max(1, p.correct + p.wrong);
    return Math.max(0.05, boxScore * 0.7 + ratio * 0.3);
  }

  // Yhdistetty hallinta molempiin suuntiin
  function masteryCombined(wordId) {
    return (masteryLevel(wordId, "forward") + masteryLevel(wordId, "backward")) / 2;
  }

  // Tilastojen apurit
  function statsCounts() {
    let mastered = 0, learning = 0, untouched = 0, due = 0;
    const now = Date.now();
    for (const w of window.WORDS) {
      const m = masteryCombined(w.id);
      if (m === 0) {
        untouched++;
      } else if (m >= 0.7) {
        mastered++;
      } else {
        learning++;
      }
      // due — jos jommankumman suunnan next on menneisyydessä ja sana on nähty
      for (const dir of ["forward", "backward"]) {
        const p = getProgress(w.id, dir);
        if (p.lastSeen && p.next && p.next <= now) { due++; break; }
      }
    }
    return { mastered, learning, untouched, due };
  }

  // Lisää sessio historiaan
  function logSession(type, count, correct) {
    window.STATE.sessions.unshift({
      date: new Date().toISOString(),
      type, count, correct
    });
    if (window.STATE.sessions.length > 100) window.STATE.sessions.length = 100;

    // Putki
    const today = new Date().toDateString();
    const last = window.STATE.lastSessionDate ? new Date(window.STATE.lastSessionDate).toDateString() : null;
    if (last !== today) {
      const y = new Date(); y.setDate(y.getDate() - 1);
      if (last === y.toDateString()) window.STATE.streak++;
      else window.STATE.streak = 1;
      window.STATE.lastSessionDate = new Date().toISOString();
    }
    save();
  }

  // ---- Vienti & tuonti (varmuuskopio) -------------------------
  const FILE_FORMAT_VERSION = 1;

  function exportPayload(includeApiKey = false) {
    const s = window.STATE;
    const out = {
      app: "kielen-oppiminen",
      version: FILE_FORMAT_VERSION,
      exportedAt: new Date().toISOString(),
      state: {
        source: s.source,
        target: s.target,
        streak: s.streak || 0,
        lastSessionDate: s.lastSessionDate || null,
        sessions: Array.isArray(s.sessions) ? s.sessions : [],
        progress: s.progress || {},
        grammar: s.grammar || {}
      }
    };
    if (includeApiKey && s.apiKey) out.state.apiKey = s.apiKey;
    return out;
  }

  function exportToFile(includeApiKey = false) {
    const payload = exportPayload(includeApiKey);
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const date = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = "kielen-oppiminen-" + date + ".json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return payload;
  }

  // Validoi tuotu data — palauttaa { ok: bool, error?: string, payload?: obj }
  function validateImport(obj) {
    if (!obj || typeof obj !== "object") return { ok: false, error: "Tiedosto ei ole JSON-objekti." };
    if (obj.app !== "kielen-oppiminen") return { ok: false, error: "Tiedosto ei näytä olevan tämän sovelluksen vienti (app-tunniste puuttuu)." };
    if (typeof obj.version !== "number") return { ok: false, error: "Tiedoston versiota ei tunnisteta." };
    if (obj.version > FILE_FORMAT_VERSION) return { ok: false, error: "Tiedosto on uudempaa versiota (" + obj.version + ") kuin tämä sovellus tukee (" + FILE_FORMAT_VERSION + ")." };
    const st = obj.state;
    if (!st || typeof st !== "object") return { ok: false, error: "Tilatieto puuttuu." };
    if (st.source && !["en","fi","sv"].includes(st.source)) return { ok: false, error: "Tuntematon lähtökieli: " + st.source };
    if (st.target && !["en","fi","sv"].includes(st.target)) return { ok: false, error: "Tuntematon kohdekieli: " + st.target };
    if (st.progress && typeof st.progress !== "object") return { ok: false, error: "Progress-kenttä on viallinen." };
    if (st.grammar && typeof st.grammar !== "object") return { ok: false, error: "Grammar-kenttä on viallinen." };
    if (st.sessions && !Array.isArray(st.sessions)) return { ok: false, error: "Sessions-kenttä ei ole taulukko." };
    return { ok: true, payload: obj };
  }

  // Korvaa tila tuodulla datalla. Säilyttää nykyisen apiKey:n
  // ellei tuonti sisällä omaansa.
  function applyImport(payload) {
    const st = payload.state;
    const prevApiKey = window.STATE.apiKey || "";
    const newState = {
      source: st.source || window.STATE.source,
      target: st.target || window.STATE.target,
      apiKey: st.apiKey || prevApiKey,
      streak: typeof st.streak === "number" ? st.streak : 0,
      lastSessionDate: st.lastSessionDate || null,
      sessions: Array.isArray(st.sessions) ? st.sessions : [],
      progress: st.progress || {},
      grammar: st.grammar || {}
    };
    window.STATE = newState;
    save();
    return newState;
  }

  // Lue tiedosto (FileReader) ja palauta Promise
  function readFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const obj = JSON.parse(reader.result);
          resolve(obj);
        } catch (e) {
          reject(new Error("JSON-jäsennys epäonnistui: " + e.message));
        }
      };
      reader.onerror = () => reject(new Error("Tiedoston luku epäonnistui."));
      reader.readAsText(file);
    });
  }

  async function importFromFile(file) {
    const obj = await readFile(file);
    const v = validateImport(obj);
    if (!v.ok) throw new Error(v.error);
    return applyImport(v.payload);
  }

  // ---- Julkinen rajapinta -------------------------------------
  window.STATE = load();
  window.STATE_API = {
    save, reset,
    progressKey, getProgress, setProgress,
    masteryLevel, masteryCombined,
    statsCounts, logSession,
    // varmuuskopio
    exportPayload, exportToFile,
    validateImport, applyImport, importFromFile
  };
})();
