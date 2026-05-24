// ============================================================
// Sovellusliima — reititys, näytöt, tila
// ============================================================
(function () {
  const screens = ["home", "galaxy", "grammar", "practice", "speak", "conversation", "stats", "settings"];
  let practiceRunning = false;

  function $(id) { return document.getElementById(id); }
  function $$(sel) { return Array.from(document.querySelectorAll(sel)); }

  // ----- Reititys ---------------------------------------------
  function show(screen) {
    screens.forEach(s => {
      const el = $("screen-" + s);
      if (el) el.classList.toggle("active", s === screen);
    });
    $$(".nav-item").forEach(b => b.classList.toggle("active", b.dataset.screen === screen));
    $$(".bottom-nav-item").forEach(b => b.classList.toggle("active", b.dataset.screen === screen));
    // Tee näkymäkohtainen päivitys
    if (screen === "galaxy") renderGalaxy();
    if (screen === "grammar") renderGrammarTree();
    if (screen === "stats")  renderStats();
    if (screen === "home")   renderHome();
    if (screen === "settings") renderSettings();
    if (screen === "conversation") window.CONVERSATION.renderDialogueList($("dialogue-list"));
    if (screen === "speak") startSpeakLoop();
  }

  // ----- Etusivu ----------------------------------------------
  function renderHome() {
    const stats = window.STATE_API.statsCounts();
    $("stat-mastered").textContent = stats.mastered;
    $("stat-learning").textContent = stats.learning;
    $("stat-streak").textContent = window.STATE.streak || 0;
    $("stat-due").textContent = stats.due;
    $("home-sub").textContent = stats.due > 0
      ? stats.due + " sanaa odottaa kertausta. Hyvä aika aloittaa."
      : "Aloita uusi sessio tai sukella galaksiin.";
    $("nav-langpair").textContent = window.STATE.target + " ← " + window.STATE.source;
    $("nav-words").textContent = window.WORDS.length + " sanaa";
    renderGrammarTip();
  }

  // Etsi heikoin (eniten harjoittelua tarvitseva) kielioppisolmu
  function pickGrammarTip() {
    const flat = window.currentGrammarFlat ? window.currentGrammarFlat() : [];
    // Vain solmut joissa on harjoituksia
    const candidates = flat
      .map(x => x.node)
      .filter(n => n.exercises && n.exercises.length);
    if (!candidates.length) return null;
    // Pisteytys: 0–10. Ei nähty = 10. Nähty + heikko = 6–9. Hyvä = 1–3.
    function score(n) {
      const p = window.getGrammarProgress(n.id);
      const total = p.correct + p.wrong;
      if (total === 0) return 10;                      // ei vielä nähty → paras suositus
      const m = window.grammarMastery(n.id);           // 0..1
      const recencyDays = (Date.now() - (p.lastSeen || 0)) / (1000 * 60 * 60 * 24);
      // Heikkous painottuu, mutta vasta nähty saa olla rauhassa
      return (1 - m) * 8 + Math.min(recencyDays, 4) * 0.5;
    }
    candidates.sort((a, b) => score(b) - score(a));
    return candidates[0];
  }

  function renderGrammarTip() {
    const tip = pickGrammarTip();
    const card = $("grammar-tip");
    if (!tip || !card) {
      if (card) card.style.display = "none";
      return;
    }
    card.style.display = "";
    $("grammar-tip-title").textContent = tip.label + (tip.sub ? " — " + tip.sub : "");
    $("grammar-tip-desc").textContent = tip.desc ? tip.desc.slice(0, 140) + (tip.desc.length > 140 ? "…" : "") : "";
    const p = window.getGrammarProgress(tip.id);
    const m = window.grammarMastery(tip.id);
    $("grammar-tip-progress").textContent = p.correct + p.wrong === 0
      ? "Et ole vielä kohdannut tätä rakennetta."
      : "Hallinta " + Math.round(m * 100) + "% · " + p.correct + " oikein / " + p.wrong + " väärin";
    $("grammar-tip-go").onclick = () => {
      window.TREE.startGrammarPractice(tip);
    };
  }

  // ----- Galaksi ----------------------------------------------
  function renderGalaxy() {
    const svg = $("galaxy-svg");
    window.GALAXY.render(svg);
    window.GALAXY.renderLegend($("galaxy-legend"));
  }

  // ----- Kielen rakenne (kielioppipuu) ------------------------
  function renderGrammarTree() {
    const host = $("grammar-tree");
    if (!host) return;
    const root = window.currentGrammarTree();
    const desc = $("grammar-desc");
    if (root && desc) {
      desc.textContent = root.desc || "Klikkaa solmua avataksesi haaran, tai katso oikealla säännöt ja aloita harjoitus.";
    }
    window.TREE.render(host);
  }

  // ----- Sanakortti (modal) -----------------------------------
  function openWordCard(word) {
    const topicId = window.getWordTopic(word.id);
    const topic = window.getTopic(topicId);
    $("m-title").textContent = word.t[window.STATE.target] || word.id;
    $("m-pos").textContent = window.POS_LABEL[word.pos] || word.pos;
    $("m-topic").textContent = topic ? topic.label : "";
    $("m-en").textContent = word.t.en || "—";
    $("m-fi").textContent = word.t.fi || "—";
    $("m-sv").textContent = word.t.sv || "—";
    $("m-ex-en").textContent = word.ex?.en || "—";
    $("m-ex-fi").textContent = word.ex?.fi || "—";
    $("m-ex-sv").textContent = word.ex?.sv || "—";

    const fM = window.STATE_API.masteryLevel(word.id, "forward");
    const bM = window.STATE_API.masteryLevel(word.id, "backward");
    const p = window.STATE_API.getProgress(word.id, "forward");
    $("m-progress").textContent =
      "Hallinta: " + Math.round((fM + bM) / 2 * 100) + "% · " +
      "Laatikko: " + p.box + " · " +
      "Oikein: " + p.correct + " · Väärin: " + p.wrong;

    $("m-practice").onclick = () => {
      $("modal-back").classList.remove("open");
      startPracticeWithWords([word], { type: "mix" });
    };
    $("m-mark").onclick = () => {
      window.STATE_API.setProgress(word.id, "forward", { box: 5, next: Date.now() + 1000 * 60 * 60 * 24 * 7, correct: 5, wrong: 0, lastSeen: Date.now() });
      window.STATE_API.setProgress(word.id, "backward", { box: 5, next: Date.now() + 1000 * 60 * 60 * 24 * 7, correct: 5, wrong: 0, lastSeen: Date.now() });
      $("modal-back").classList.remove("open");
      renderGalaxy();
      renderHome();
    };

    $("modal-back").classList.add("open");
  }

  // ----- Harjoittelu ------------------------------------------
  function buildTopicSelect() {
    const sel = $("filter-topic");
    if (sel.options.length > 1) return;
    for (const t of window.TOPICS) {
      const opt = document.createElement("option");
      opt.value = t.id;
      opt.textContent = t.label + " (" + window.wordsByTopic(t.id).length + ")";
      sel.appendChild(opt);
    }
  }

  async function startPracticeWithWords(words, opts) {
    if (practiceRunning) return;
    if (!words || words.length === 0) {
      alert("Ei harjoiteltavia sanoja tällä rajauksella.");
      return;
    }
    practiceRunning = true;
    show("practice");
    $("practice-area").classList.remove("hidden");

    const source = window.STATE.source;
    const target = window.STATE.target;
    const card = $("exercise-card");

    const onProgress = (i, total, correct) => {
      $("ex-progress").style.width = Math.round(100 * i / total) + "%";
      $("ex-progress-text").textContent = i + " / " + total;
    };
    onProgress(0, words.length, 0);

    try {
      const result = await window.EXERCISES.runSession(
        words,
        { source, target, type: opts.type || "mix" },
        $("practice-area"),
        onProgress
      );
      // Tulosnäkymä
      card.innerHTML = "";
      card.appendChild(makeEl("div", { class: "ex-prompt" }, "Sessio päättyi"));
      card.appendChild(makeEl("div", { class: "ex-word" }, result.correct + " / " + result.total));
      card.appendChild(makeEl("div", { class: "ex-context" }, "Hieno suoritus! Voit aloittaa uuden sessio tai jatkaa galaksiin."));
      const row = makeEl("div", { class: "btn-row mt-16" });
      const again = makeEl("button", { class: "btn btn-primary" }, "Uusi sessio");
      again.onclick = () => {
        practiceRunning = false;
        $("start-practice").click();
      };
      const home = makeEl("button", { class: "btn btn-ghost" }, "Etusivulle");
      home.onclick = () => { practiceRunning = false; show("home"); };
      row.appendChild(again);
      row.appendChild(home);
      card.appendChild(row);
    } finally {
      practiceRunning = false;
    }
  }

  function startTopicPractice(topicId) {
    const session = window.SRS.pickSession({ total: 10, topicId });
    startPracticeWithWords(session, { type: "mix" });
  }

  // ----- Lue ääneen (oma näkymä) ------------------------------
  let speakCurrent = null;
  async function startSpeakLoop() {
    const host = $("speak-area");
    if (!window.SPEECH.isSupported()) {
      host.innerHTML = "";
      host.appendChild(makeEl("div", { class: "ex-prompt" }, "Puheentunnistus ei tuettu"));
      host.appendChild(makeEl("p", {}, "Selaimesi ei tue Web Speech API:a. Kokeile Google Chromea."));
      return;
    }
    const pool = window.SRS.pickSession({ total: 8 });
    let i = 0;
    const next = async () => {
      if (i >= pool.length) {
        host.innerHTML = "";
        host.appendChild(makeEl("div", { class: "ex-prompt" }, "Hieno suoritus!"));
        host.appendChild(makeEl("div", { class: "ex-word" }, "✅ Sessio ohi"));
        return;
      }
      const w = pool[i++];
      speakCurrent = w;
      const ex = window.EXERCISES.speakExercise(w, { source: window.STATE.source, target: window.STATE.target });
      const result = await ex.render(host);
      if (!result.skipped) window.SRS.review(w.id, "forward", result.correct);
      setTimeout(next, 600);
    };
    next();
  }

  // ----- Edistyminen -------------------------------------------
  function renderStats() {
    const stats = window.STATE_API.statsCounts();
    $("s-mastered").textContent = stats.mastered;
    $("s-learning").textContent = stats.learning;
    $("s-new").textContent = stats.untouched;
    $("s-streak").textContent = window.STATE.streak || 0;

    const host = $("topic-progress");
    host.innerHTML = "";
    for (const t of window.TOPICS) {
      const words = window.wordsByTopic(t.id);
      const total = words.length;
      const sumMastery = words.reduce((s, w) => s + window.STATE_API.masteryCombined(w.id), 0);
      const pct = total ? Math.round(100 * sumMastery / total) : 0;
      const row = makeEl("div", { class: "card mt-8", style: "padding:12px 16px;" });
      const head = makeEl("div", { class: "row", style: "justify-content:space-between; margin-bottom:6px;" });
      head.appendChild(makeEl("div", {}, [
        makeEl("span", { style: "display:inline-block;width:10px;height:10px;border-radius:50%;background:" + t.color + ";margin-right:8px;vertical-align:middle;" }),
        makeEl("span", { style: "font-weight:600;" }, t.label)
      ]));
      head.appendChild(makeEl("div", { class: "muted", style: "font-size:13px;" }, pct + "% · " + total + " sanaa"));
      row.appendChild(head);
      const prog = makeEl("div", { class: "progress" });
      const bar = makeEl("div", { class: "bar" });
      bar.style.width = pct + "%";
      bar.style.background = "linear-gradient(90deg," + t.color + ",rgba(255,255,255,0.5))";
      prog.appendChild(bar);
      row.appendChild(prog);
      host.appendChild(row);
    }

    // Sessiohistoria
    const hist = window.STATE.sessions.slice(0, 10);
    const h = $("session-history");
    if (!hist.length) {
      h.textContent = "Ei vielä historiaa.";
    } else {
      h.innerHTML = "";
      hist.forEach(s => {
        const d = new Date(s.date);
        const line = document.createElement("div");
        line.style.fontSize = "13px";
        line.style.padding = "4px 0";
        line.style.borderBottom = "1px solid var(--line)";
        line.textContent =
          d.toLocaleDateString("fi-FI") + " " + d.toLocaleTimeString("fi-FI", { hour: "2-digit", minute: "2-digit" }) +
          " · " + s.type + " · " + s.correct + "/" + s.count;
        h.appendChild(line);
      });
    }
  }

  // ----- Asetukset --------------------------------------------
  function renderSettings() {
    $("set-target").value = window.STATE.target;
    $("set-source").value = window.STATE.source;
    $("set-apikey").value = window.STATE.apiKey || "";
  }

  // ----- Apu --------------------------------------------------
  function makeEl(tag, props = {}, children = []) {
    const n = document.createElement(tag);
    for (const k in props) {
      if (k === "class") n.className = props[k];
      else if (k === "style") n.style.cssText = props[k];
      else if (k === "html") n.innerHTML = props[k];
      else if (k.startsWith("on")) n.addEventListener(k.slice(2), props[k]);
      else n.setAttribute(k, props[k]);
    }
    for (const c of [].concat(children)) {
      if (c == null) continue;
      n.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    }
    return n;
  }

  // ----- Tapahtumat -------------------------------------------
  function bindEvents() {
    $$(".nav-item, .bottom-nav-item").forEach(b => {
      b.addEventListener("click", () => show(b.dataset.screen));
    });

    // Etusivu — pika-aloitukset
    $$("[data-quick]").forEach(card => {
      card.addEventListener("click", () => {
        const type = card.dataset.quick;
        if (type === "conv") return show("conversation");
        if (type === "speak") {
          show("speak");
          return;
        }
        const session = window.SRS.pickSession({ total: 10 });
        startPracticeWithWords(session, { type });
      });
    });
    $("start-daily").onclick = () => {
      const session = window.SRS.pickSession({ total: 12 });
      startPracticeWithWords(session, { type: "mix" });
    };

    // Harjoitusnäkymä
    buildTopicSelect();
    $("start-practice").onclick = () => {
      const topicId = $("filter-topic").value || null;
      const type = $("filter-type").value;
      const session = window.SRS.pickSession({ total: 10, topicId });
      startPracticeWithWords(session, { type });
    };

    // Keskustelu
    $("start-free").onclick = () => {
      window.CONVERSATION.startFree($("free-topic").value);
    };
    $("end-conversation").onclick = () => {
      window.CONVERSATION.endConversation();
    };
    $("free-send").onclick = () => {
      const text = $("free-text").value.trim();
      if (!text) return;
      $("free-text").value = "";
      window.CONVERSATION.sendFreeMessage(text);
    };
    $("free-text").addEventListener("keydown", e => {
      if (e.key === "Enter") { e.preventDefault(); $("free-send").click(); }
    });
    $("free-mic").onclick = () => window.CONVERSATION.micFree($("free-text"));

    // Modal
    $("m-close").onclick = () => $("modal-back").classList.remove("open");
    $("modal-back").addEventListener("click", (e) => {
      if (e.target.id === "modal-back") $("modal-back").classList.remove("open");
    });
    $$("[data-speak]").forEach(b => {
      b.onclick = () => {
        const lang = b.dataset.speak;
        const txt = $("m-" + lang).textContent;
        window.SPEECH.speak(txt, lang);
      };
    });
    $$("[data-speak-ex]").forEach(b => {
      b.onclick = () => {
        const lang = b.dataset.speakEx;
        const txt = $("m-ex-" + lang).textContent;
        window.SPEECH.speak(txt, lang);
      };
    });

    // Asetukset
    $("set-target").onchange = (e) => {
      window.STATE.target = e.target.value;
      // Estä target = source
      if (window.STATE.target === window.STATE.source) {
        window.STATE.source = ["en","fi","sv"].find(x => x !== window.STATE.target);
        $("set-source").value = window.STATE.source;
      }
      window.STATE_API.save();
      // Nollaa rakennenäkymän laajennustila — uusi kieli, uusi puu
      if (window.TREE && window.TREE.resetExpansion) window.TREE.resetExpansion();
      renderHome();
    };
    $("set-source").onchange = (e) => {
      window.STATE.source = e.target.value;
      if (window.STATE.target === window.STATE.source) {
        window.STATE.target = ["en","fi","sv"].find(x => x !== window.STATE.source);
        $("set-target").value = window.STATE.target;
      }
      window.STATE_API.save();
      renderHome();
    };
    $("set-apikey").addEventListener("blur", (e) => {
      window.STATE.apiKey = e.target.value.trim();
      window.STATE_API.save();
    });
    $("reset-progress").onclick = () => {
      if (confirm("Nollataanko kaikki edistyminen?")) {
        window.STATE_API.reset();
        renderHome();
        renderGalaxy();
      }
    };

    // ----- Export / Import edistyminen ------------------------
    $("export-progress").onclick = () => {
      try {
        const includeKey = $("export-include-key").checked;
        window.STATE_API.exportToFile(includeKey);
        flashImportStatus("Edistyminen viety tiedostoksi.", true);
      } catch (e) {
        flashImportStatus("Vienti epäonnistui: " + e.message, false);
      }
    };

    $("import-progress-btn").onclick = () => $("import-progress").click();

    $("import-progress").onchange = async (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      // Esikatsele tiedosto: lue, validoi, varmista
      try {
        const text = await file.text();
        let parsed;
        try { parsed = JSON.parse(text); }
        catch (er) { throw new Error("JSON-jäsennys epäonnistui: " + er.message); }
        const v = window.STATE_API.validateImport(parsed);
        if (!v.ok) throw new Error(v.error);

        const s = v.payload.state;
        const sessCount = (s.sessions || []).length;
        const wordCount = Object.keys(s.progress || {}).length;
        const grCount = Object.keys(s.grammar || {}).length;
        const exportedAt = v.payload.exportedAt ? new Date(v.payload.exportedAt).toLocaleString("fi-FI") : "tuntematon";

        const confirmText =
          "Tuodaanko tämä varmuuskopio? Nykyinen edistyminen korvautuu.\n\n" +
          "Vienti tehty: " + exportedAt + "\n" +
          "Kielipari: " + (s.target || "?") + " ← " + (s.source || "?") + "\n" +
          "Sanaedistymisiä: " + wordCount + "\n" +
          "Kieliopin solmut: " + grCount + "\n" +
          "Sessio-historia: " + sessCount + " kpl\n" +
          "Putki: " + (s.streak || 0) + " päivää";

        if (!confirm(confirmText)) {
          e.target.value = "";
          flashImportStatus("Tuonti peruttu.", false);
          return;
        }

        window.STATE_API.applyImport(v.payload);
        e.target.value = "";
        // Päivitä koko UI
        if (window.TREE && window.TREE.resetExpansion) window.TREE.resetExpansion();
        renderHome();
        renderSettings();
        flashImportStatus("Edistyminen tuotu onnistuneesti.", true);
      } catch (er) {
        flashImportStatus("Tuonti epäonnistui: " + er.message, false);
        e.target.value = "";
      }
    };
  }

  function flashImportStatus(text, ok) {
    const el = $("import-status");
    if (!el) return;
    el.textContent = text;
    el.style.color = ok ? "var(--success)" : "var(--error)";
    clearTimeout(flashImportStatus._t);
    flashImportStatus._t = setTimeout(() => { el.textContent = ""; }, 5000);
  }

  // ----- Käynnistys -------------------------------------------
  window.APP = {
    show,
    openWordCard,
    startTopicPractice,
    renderGalaxy,
    renderHome
  };

  document.addEventListener("DOMContentLoaded", () => {
    bindEvents();
    show("home");
    console.log("Kielen oppiminen valmis. Sanoja:", window.WORDS.length, "Aihepiirejä:", window.TOPICS.length);
  });
})();
