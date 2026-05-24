// ============================================================
// Harjoitusmoottori — eri harjoitustyyppien rakentajat
// ============================================================
// Jokainen harjoitus on objekti, joka osaa renderöidä itsensä
// annettuun elementtiin ja palauttaa Promise:n, joka resolvaa
// kun käyttäjä on vastannut: { correct: bool, userAnswer }
//
// Tyypit:
//   recognition  — näytä sana lähtökielellä, valitse oikea käännös
//   reverse      — näytä sana opeteltavalla kielellä, valitse oikea lähtökielinen
//   production   — kirjoita käännös käsin
//   arrange      — järjestä sanat lauseeksi (käytetään esimerkkilausetta)
//   listen       — kuule sana TTS:llä ja valitse oikea käännös
//   speak        — lue sana ääneen mikrofoniin
// ============================================================

(function () {
  // Apufunktiot ----------------------------------------------------
  function el(tag, props = {}, children = []) {
    const n = document.createElement(tag);
    for (const k in props) {
      if (k === "class") n.className = props[k];
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

  function pickDistractors(correct, pool, lang, count = 3) {
    // Karsi pois sanat, joilla on sama käännös, ja sekoita
    const out = [];
    const seen = new Set([correct.t[lang]]);
    const shuffled = pool.slice().sort(() => Math.random() - 0.5);
    for (const w of shuffled) {
      if (w.id === correct.id) continue;
      if (seen.has(w.t[lang])) continue;
      seen.add(w.t[lang]);
      out.push(w);
      if (out.length >= count) break;
    }
    return out;
  }

  function shuffle(arr) {
    const out = arr.slice();
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  }

  // =============== Harjoitustyyppi: Tunnistus ====================
  function recognitionExercise(word, opts = {}) {
    const target = opts.target;     // opeteltava kieli
    const source = opts.source;     // lähtökieli
    const pool = window.WORDS;
    const distractors = pickDistractors(word, pool, target, 3);
    const choices = shuffle([word, ...distractors]);

    return {
      type: "recognition",
      direction: "forward",
      wordId: word.id,
      render(host) {
        return new Promise(resolve => {
          host.innerHTML = "";
          host.appendChild(el("div", { class: "ex-prompt" }, "Valitse oikea käännös"));
          host.appendChild(el("div", { class: "ex-word" }, word.t[source]));
          if (word.ex && word.ex[source]) {
            host.appendChild(el("div", { class: "ex-context" }, "esim. " + word.ex[source]));
          }
          const list = el("div", { class: "choice-list" });
          let answered = false;
          choices.forEach(c => {
            const btn = el("button", { class: "choice" }, c.t[target]);
            btn.onclick = () => {
              if (answered) return;
              answered = true;
              const correct = c.id === word.id;
              btn.classList.add(correct ? "correct" : "wrong");
              if (!correct) {
                Array.from(list.children).forEach(child => {
                  if (child.textContent === word.t[target]) child.classList.add("correct");
                });
              }
              showFeedback(host, correct, correct ? "Hienoa!" : "Oikea vastaus: " + word.t[target]);
              setTimeout(() => resolve({ correct, userAnswer: c.t[target] }), correct ? 700 : 1500);
            };
            list.appendChild(btn);
          });
          host.appendChild(list);
        });
      }
    };
  }

  // =============== Harjoitustyyppi: Käännösuunta (reverse) =======
  function reverseExercise(word, opts) {
    // Näytä opeteltava kieli, valitse lähtökielen vaihtoehdoista
    const target = opts.target;
    const source = opts.source;
    const distractors = pickDistractors(word, window.WORDS, source, 3);
    const choices = shuffle([word, ...distractors]);

    return {
      type: "reverse",
      direction: "backward",
      wordId: word.id,
      render(host) {
        return new Promise(resolve => {
          host.innerHTML = "";
          host.appendChild(el("div", { class: "ex-prompt" }, "Mitä tämä tarkoittaa?"));
          const w = el("div", { class: "ex-word" }, word.t[target]);
          host.appendChild(w);
          const audio = el("button", { class: "btn btn-icon btn-ghost", style: "margin-bottom:14px" }, "🔊");
          audio.onclick = () => window.SPEECH.speak(word.t[target], target);
          host.appendChild(audio);

          const list = el("div", { class: "choice-list" });
          let answered = false;
          choices.forEach(c => {
            const btn = el("button", { class: "choice" }, c.t[source]);
            btn.onclick = () => {
              if (answered) return;
              answered = true;
              const correct = c.id === word.id;
              btn.classList.add(correct ? "correct" : "wrong");
              if (!correct) {
                Array.from(list.children).forEach(child => {
                  if (child.textContent === word.t[source]) child.classList.add("correct");
                });
              }
              showFeedback(host, correct, correct ? "Hienoa!" : "Oikea vastaus: " + word.t[source]);
              setTimeout(() => resolve({ correct, userAnswer: c.t[source] }), correct ? 700 : 1500);
            };
            list.appendChild(btn);
          });
          host.appendChild(list);
        });
      }
    };
  }

  // =============== Harjoitustyyppi: Tuotto (kirjoitus) ===========
  function productionExercise(word, opts) {
    const target = opts.target;
    const source = opts.source;
    return {
      type: "production",
      direction: "forward",
      wordId: word.id,
      render(host) {
        return new Promise(resolve => {
          host.innerHTML = "";
          host.appendChild(el("div", { class: "ex-prompt" }, "Kirjoita käännös"));
          host.appendChild(el("div", { class: "ex-word" }, word.t[source]));
          if (word.ex && word.ex[source]) {
            host.appendChild(el("div", { class: "ex-context" }, "esim. " + word.ex[source]));
          }
          const input = el("input", { class: "input", placeholder: "Kirjoita " + langName(target) + "ksi…" });
          host.appendChild(input);
          const btn = el("button", { class: "btn btn-primary mt-16 btn-full" }, "Tarkista");
          host.appendChild(btn);

          input.focus();
          const submit = () => {
            const v = input.value.trim();
            if (!v) return;
            const ans = word.t[target];
            // Hyväksy hieman löyhästi: poista sulkeet jne.
            const norm = s => s.toLowerCase().replace(/\s*\([^)]*\)/g, "").replace(/[.,!?;:]/g, "").trim();
            const acceptable = norm(ans).split(/\s*\/\s*/);
            const userN = norm(v);
            const exact = acceptable.includes(userN);
            const close = acceptable.some(a => window.SPEECH.similarity(userN, a) > 0.85);
            const correct = exact || close;
            input.disabled = true;
            btn.disabled = true;
            showFeedback(host, correct, correct ? "Hienoa! ✓" : "Oikea vastaus: " + ans);
            setTimeout(() => resolve({ correct, userAnswer: v }), correct ? 800 : 1800);
          };
          btn.onclick = submit;
          input.addEventListener("keydown", e => { if (e.key === "Enter") submit(); });
        });
      }
    };
  }

  // =============== Harjoitustyyppi: Järjestä lause ===============
  function arrangeExercise(word, opts) {
    const target = opts.target;
    const source = opts.source;
    const sentence = word.ex && word.ex[target];
    // Jos ei esimerkkilausetta, palaa tunnistusharjoitukseen
    if (!sentence) return recognitionExercise(word, opts);

    const cleaned = sentence.replace(/[.,!?;:]/g, "");
    const tokens = cleaned.split(/\s+/).filter(Boolean);
    const shuffled = shuffle(tokens);

    return {
      type: "arrange",
      direction: "forward",
      wordId: word.id,
      render(host) {
        return new Promise(resolve => {
          host.innerHTML = "";
          host.appendChild(el("div", { class: "ex-prompt" }, "Järjestä sanat oikeaan järjestykseen"));
          host.appendChild(el("div", { class: "ex-context" }, "Suomeksi: " + (word.ex[source] || "—")));

          const assembled = [];
          const target1 = el("div", { class: "tile-row" });
          const target2 = el("div", { class: "tile-row" });
          host.appendChild(target1);
          host.appendChild(target2);

          const redraw = () => {
            target1.innerHTML = "";
            assembled.forEach((tok, i) => {
              const t = el("button", { class: "tile" }, tok);
              t.onclick = () => {
                assembled.splice(i, 1);
                shuffled.push(tok);
                redraw();
              };
              target1.appendChild(t);
            });
            target2.innerHTML = "";
            shuffled.forEach((tok, i) => {
              const t = el("button", { class: "tile" }, tok);
              t.onclick = () => {
                shuffled.splice(i, 1);
                assembled.push(tok);
                redraw();
              };
              target2.appendChild(t);
            });
          };
          redraw();

          const submit = el("button", { class: "btn btn-primary btn-full mt-16" }, "Tarkista");
          host.appendChild(submit);
          submit.onclick = () => {
            const userSentence = assembled.join(" ");
            const correctSentence = tokens.join(" ");
            const correct = userSentence.toLowerCase() === correctSentence.toLowerCase();
            submit.disabled = true;
            showFeedback(host, correct, correct ? "Täydellistä!" : "Oikein: " + sentence);
            setTimeout(() => resolve({ correct, userAnswer: userSentence }), correct ? 900 : 2000);
          };
        });
      }
    };
  }

  // =============== Harjoitustyyppi: Kuule ja valitse =============
  function listenExercise(word, opts) {
    const target = opts.target;
    const source = opts.source;
    const distractors = pickDistractors(word, window.WORDS, source, 3);
    const choices = shuffle([word, ...distractors]);

    return {
      type: "listen",
      direction: "backward",
      wordId: word.id,
      render(host) {
        return new Promise(resolve => {
          host.innerHTML = "";
          host.appendChild(el("div", { class: "ex-prompt" }, "Kuule ja valitse merkitys"));
          const playBtn = el("button", { class: "btn btn-primary btn-lg" }, "🔊 Toista");
          host.appendChild(playBtn);
          playBtn.onclick = () => window.SPEECH.speak(word.t[target], target);
          setTimeout(() => window.SPEECH.speak(word.t[target], target), 300);

          const list = el("div", { class: "choice-list mt-16" });
          let answered = false;
          choices.forEach(c => {
            const btn = el("button", { class: "choice" }, c.t[source]);
            btn.onclick = () => {
              if (answered) return;
              answered = true;
              const correct = c.id === word.id;
              btn.classList.add(correct ? "correct" : "wrong");
              showFeedback(host, correct, correct ? "Hienoa! Sana oli: " + word.t[target] : "Oikea: " + word.t[source] + " (" + word.t[target] + ")");
              setTimeout(() => resolve({ correct, userAnswer: c.t[source] }), correct ? 800 : 1800);
            };
            list.appendChild(btn);
          });
          host.appendChild(list);
        });
      }
    };
  }

  // =============== Harjoitustyyppi: Lue ääneen ===================
  function speakExercise(word, opts) {
    const target = opts.target;
    return {
      type: "speak",
      direction: "forward",
      wordId: word.id,
      render(host) {
        return new Promise(resolve => {
          host.innerHTML = "";
          host.appendChild(el("div", { class: "ex-prompt" }, "Lue ääneen"));
          host.appendChild(el("div", { class: "ex-word" }, word.t[target]));
          if (word.ex && word.ex[target]) host.appendChild(el("div", { class: "ex-context" }, word.ex[target]));

          const btnRow = el("div", { class: "row mt-16" });
          const playBtn = el("button", { class: "btn btn-ghost" }, "🔊 Kuule malli");
          playBtn.onclick = () => window.SPEECH.speak(word.t[target], target);
          const micBtn = el("button", { class: "btn btn-primary grow" }, "🎙️ Puhu");
          btnRow.appendChild(playBtn);
          btnRow.appendChild(micBtn);
          host.appendChild(btnRow);

          micBtn.onclick = async () => {
            micBtn.disabled = true;
            micBtn.classList.add("mic-pulse");
            micBtn.textContent = "🎙️ Kuuntelen…";
            try {
              const results = await window.SPEECH.recognize(target);
              const best = window.SPEECH.bestMatch(results, word.t[target]);
              const correct = best.score >= 0.7;
              showFeedback(host, correct,
                correct
                  ? "Hienoa! Kuulin: \"" + best.transcript + "\" (" + Math.round(best.score * 100) + "%)"
                  : "Sanoit: \"" + best.transcript + "\" — kohde: " + word.t[target]);
              micBtn.classList.remove("mic-pulse");
              micBtn.textContent = "🎙️ Yritä uudelleen";
              setTimeout(() => resolve({ correct, userAnswer: best.transcript }), 1500);
            } catch (e) {
              micBtn.classList.remove("mic-pulse");
              micBtn.textContent = "🎙️ Puhu";
              micBtn.disabled = false;
              showFeedback(host, false, "Virhe: " + e.message);
            }
          };
          // Salli ohitus jos mikrofoni ei toimi
          const skip = el("button", { class: "btn btn-ghost mt-16 btn-full" }, "Ohita");
          skip.onclick = () => resolve({ correct: false, userAnswer: "", skipped: true });
          host.appendChild(skip);
        });
      }
    };
  }

  // ---- Palaute -----------------------------------------------
  function showFeedback(host, ok, text) {
    let fb = host.querySelector(".feedback");
    if (!fb) {
      fb = el("div", { class: "feedback" });
      host.appendChild(fb);
    }
    fb.className = "feedback show " + (ok ? "ok" : "no");
    fb.textContent = text;
  }

  // ---- Apurit ------------------------------------------------
  function langName(code) {
    return { en: "englanni", fi: "suome", sv: "ruotsi" }[code] || code;
  }

  // ---- Sessiomoottori ----------------------------------------
  // Aja sarja harjoituksia järjestyksessä
  async function runSession(words, opts, host, onProgress) {
    const { source, target, type = "mix" } = opts;
    let correct = 0;
    let total = words.length;

    for (let i = 0; i < words.length; i++) {
      const w = words[i];
      onProgress && onProgress(i, total, correct);

      let ex;
      const chosen = (type === "mix")
        ? pickRandomType(w, opts)
        : buildByType(type, w, opts);

      const card = host.querySelector(".exercise-card") || host;
      const result = await chosen.render(card);
      if (result.correct) correct++;
      if (!result.skipped) {
        window.SRS.review(w.id, chosen.direction, result.correct);
      }
    }
    onProgress && onProgress(total, total, correct);
    window.STATE_API.logSession(opts.type || "mix", total, correct);
    return { total, correct };
  }

  function buildByType(type, word, opts) {
    switch (type) {
      case "recognition": return recognitionExercise(word, opts);
      case "reverse":     return reverseExercise(word, opts);
      case "production":  return productionExercise(word, opts);
      case "arrange":     return arrangeExercise(word, opts);
      case "listen":      return listenExercise(word, opts);
      case "speak":       return speakExercise(word, opts);
      default:            return recognitionExercise(word, opts);
    }
  }

  function pickRandomType(word, opts) {
    // Painota tyyppejä: tunnistus 25 %, käänteinen 20 %, kirjoitus 20 %,
    // järjestä 10 % (jos esimerkki), kuule 15 %, lue ääneen 10 %
    const choices = ["recognition","recognition","reverse","reverse","production","production","listen","listen"];
    if (word.ex && word.ex[opts.target]) choices.push("arrange");
    if (window.SPEECH.isSupported()) choices.push("speak");
    return buildByType(choices[Math.floor(Math.random() * choices.length)], word, opts);
  }

  window.EXERCISES = {
    recognitionExercise, reverseExercise, productionExercise,
    arrangeExercise, listenExercise, speakExercise,
    runSession, buildByType
  };
})();
