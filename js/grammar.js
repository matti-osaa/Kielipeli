// ============================================================
// Kielioppi — harjoitusten renderöinti ja solmukohtainen sessio
// ============================================================
// Jokainen kielioppisolmu voi sisältää exercises[]-taulukon.
// Tämä moduuli osaa renderöidä ne (choose / fill / transform /
// build) ja päivittää solmukohtaisen edistymisen.
// ============================================================

(function () {
  function el(tag, props = {}, children = []) {
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

  function showFeedback(host, ok, text) {
    let fb = host.querySelector(".feedback");
    if (!fb) {
      fb = el("div", { class: "feedback" });
      host.appendChild(fb);
    }
    fb.className = "feedback show " + (ok ? "ok" : "no");
    fb.textContent = text;
  }

  // ---- Yksittäisen harjoituksen renderöinti ------------------
  function renderExercise(node, exer, host) {
    return new Promise(resolve => {
      host.innerHTML = "";

      host.appendChild(el("div", { class: "ex-prompt" }, exer.prompt || "Harjoitus"));

      if (exer.type === "choose") {
        // template: "I ___ tired." options: [...]
        host.appendChild(el("div", { class: "ex-word", style: "font-size:24px;" }, exer.template));
        if (exer.fi) host.appendChild(el("div", { class: "ex-context" }, "Suomeksi: " + exer.fi));
        const list = el("div", { class: "choice-list" });
        let answered = false;
        exer.options.forEach(opt => {
          const btn = el("button", { class: "choice" }, opt);
          btn.onclick = () => {
            if (answered) return; answered = true;
            const correct = opt === exer.answer;
            btn.classList.add(correct ? "correct" : "wrong");
            if (!correct) {
              Array.from(list.children).forEach(c => { if (c.textContent === exer.answer) c.classList.add("correct"); });
            }
            showFeedback(host, correct, correct ? "Hienoa! Lause: " + exer.template.replace("___", exer.answer) : "Oikein: " + exer.template.replace("___", exer.answer));
            setTimeout(() => resolve({ correct }), correct ? 800 : 1800);
          };
          list.appendChild(btn);
        });
        host.appendChild(list);
      }

      else if (exer.type === "fill") {
        host.appendChild(el("div", { class: "ex-word", style: "font-size:22px;" }, exer.template));
        if (exer.fi) host.appendChild(el("div", { class: "ex-context" }, "Suomeksi: " + exer.fi));
        const input = el("input", { class: "input", placeholder: "Kirjoita…" });
        host.appendChild(input);
        const btn = el("button", { class: "btn btn-primary mt-16 btn-full" }, "Tarkista");
        host.appendChild(btn);
        input.focus();
        const submit = () => {
          const v = (input.value || "").trim();
          if (!v) return;
          const norm = s => s.toLowerCase().replace(/[.,!?;:]/g, "").trim();
          const correct = norm(v) === norm(exer.answer);
          input.disabled = true; btn.disabled = true;
          showFeedback(host, correct, correct ? "Hienoa! ✓" : "Oikea vastaus: " + exer.answer);
          setTimeout(() => resolve({ correct }), correct ? 800 : 1800);
        };
        btn.onclick = submit;
        input.addEventListener("keydown", e => { if (e.key === "Enter") submit(); });
      }

      else if (exer.type === "transform") {
        host.appendChild(el("div", { class: "ex-word", style: "font-size:20px;" }, exer.template));
        if (exer.fi) host.appendChild(el("div", { class: "ex-context" }, "Suomeksi: " + exer.fi));
        const input = el("input", { class: "input", placeholder: "Kirjoita muunnos…" });
        host.appendChild(input);
        const btn = el("button", { class: "btn btn-primary mt-16 btn-full" }, "Tarkista");
        host.appendChild(btn);
        input.focus();
        const submit = () => {
          const v = (input.value || "").trim();
          if (!v) return;
          const norm = s => s.toLowerCase().replace(/[.,!?;:]/g, "").trim();
          const correct = norm(v) === norm(exer.answer);
          input.disabled = true; btn.disabled = true;
          showFeedback(host, correct, correct ? "Hienoa! ✓" : "Oikein: " + exer.answer);
          setTimeout(() => resolve({ correct }), correct ? 800 : 1800);
        };
        btn.onclick = submit;
        input.addEventListener("keydown", e => { if (e.key === "Enter") submit(); });
      }

      else if (exer.type === "build") {
        // template: "book / read / a / I"
        const tokens = exer.template.split("/").map(s => s.trim()).filter(Boolean);
        const shuffled = tokens.slice().sort(() => Math.random() - 0.5);
        const assembled = [];

        if (exer.fi) host.appendChild(el("div", { class: "ex-context" }, "Suomeksi: " + exer.fi));
        const target1 = el("div", { class: "tile-row" });
        const target2 = el("div", { class: "tile-row" });
        host.appendChild(target1);
        host.appendChild(target2);

        const redraw = () => {
          target1.innerHTML = "";
          assembled.forEach((tok, i) => {
            const t = el("button", { class: "tile" }, tok);
            t.onclick = () => { assembled.splice(i, 1); shuffled.push(tok); redraw(); };
            target1.appendChild(t);
          });
          target2.innerHTML = "";
          shuffled.forEach((tok, i) => {
            const t = el("button", { class: "tile" }, tok);
            t.onclick = () => { shuffled.splice(i, 1); assembled.push(tok); redraw(); };
            target2.appendChild(t);
          });
        };
        redraw();

        const btn = el("button", { class: "btn btn-primary btn-full mt-16" }, "Tarkista");
        host.appendChild(btn);
        btn.onclick = () => {
          const user = assembled.join(" ");
          const norm = s => s.toLowerCase().replace(/[.,!?;:]/g, "").trim();
          const correct = norm(user) === norm(exer.answer);
          btn.disabled = true;
          showFeedback(host, correct, correct ? "Täydellistä!" : "Oikein: " + exer.answer);
          setTimeout(() => resolve({ correct }), correct ? 900 : 2000);
        };
      }

      else {
        host.appendChild(el("div", {}, "Tuntematon harjoitustyyppi: " + exer.type));
        setTimeout(() => resolve({ correct: false }), 800);
      }
    });
  }

  // ---- Sessio: ajaa solmun kaikki harjoitukset ---------------
  async function runGrammarSession(node, host, onProgress) {
    if (!node.exercises || node.exercises.length === 0) {
      // Kerää lapsisolmujen harjoitukset jos tällä ei ole omia
      const collected = [];
      function walk(n) {
        if (n.exercises) collected.push(...n.exercises.map(e => ({ ex: e, ownerId: n.id })));
        if (n.children) n.children.forEach(walk);
      }
      walk(node);
      if (collected.length === 0) {
        host.innerHTML = "<p>Ei harjoituksia tässä solmussa.</p>";
        return { total: 0, correct: 0 };
      }
      return runPool(collected, host, onProgress);
    }
    const pool = node.exercises.map(e => ({ ex: e, ownerId: node.id }));
    return runPool(pool, host, onProgress);
  }

  async function runPool(pool, host, onProgress) {
    // Sekoita
    pool = pool.slice().sort(() => Math.random() - 0.5).slice(0, 10);
    let correct = 0;
    const total = pool.length;
    for (let i = 0; i < total; i++) {
      onProgress && onProgress(i, total, correct);
      const card = host.querySelector(".exercise-card") || host;
      const r = await renderExercise(null, pool[i].ex, card);
      if (r.correct) correct++;
      // päivitä sekä omistajan että juuren edistyminen
      const id = pool[i].ownerId;
      const cur = window.getGrammarProgress(id);
      window.setGrammarProgress(id, {
        correct: cur.correct + (r.correct ? 1 : 0),
        wrong: cur.wrong + (r.correct ? 0 : 1),
        lastSeen: Date.now()
      });
    }
    onProgress && onProgress(total, total, correct);
    if (window.STATE_API && window.STATE_API.logSession) {
      window.STATE_API.logSession("grammar", total, correct);
    }
    return { total, correct };
  }

  window.GRAMMAR = { renderExercise, runGrammarSession };
})();
