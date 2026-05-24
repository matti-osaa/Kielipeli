// ============================================================
// Keskustelumoodi — scripted dialogit + LLM-pohjainen vapaa
// ============================================================
// Scripted: kulkee window.DIALOGUES-vaiheiden mukaan, käyttäjä
//           valitsee repliikin valinnoista.
// Free:     keskustelu Anthropic-API:n kautta. Käyttäjän
//           kirjoittama tai mikrofonilla puhuttu viesti
//           lähetetään, vastaus näytetään kuplina + käännös.
// ============================================================

(function () {
  const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
  const ANTHROPIC_MODEL = "claude-haiku-4-5-20251001";

  let currentDialogue = null;
  let stepIndex = 0;
  let freeMode = false;
  let freeHistory = []; // [{ role, content }]
  let freeTopic = "general";

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

  // ---- Scripted dialog ---------------------------------------
  function renderDialogueList(host) {
    host.innerHTML = "";
    for (const d of window.DIALOGUES) {
      const card = el("div", { class: "card hover" }, [
        el("div", { style: "font-size:24px;" }, d.icon || "💬"),
        el("h3", {}, d.title),
        el("div", { class: "muted", style: "font-size:13px;" }, d.description),
        el("div", { class: "muted mt-8", style: "font-size:11px;letter-spacing:1px;text-transform:uppercase;" }, "Taso: " + d.level)
      ]);
      card.addEventListener("click", () => startDialogue(d));
      host.appendChild(card);
    }
  }

  function startDialogue(dialogue) {
    currentDialogue = dialogue;
    stepIndex = 0;
    freeMode = false;
    document.getElementById("conversation-area").classList.remove("hidden");
    document.getElementById("free-input").classList.add("hidden");
    document.getElementById("chat-log").innerHTML = "";
    showNextStep();
  }

  function showNextStep() {
    if (!currentDialogue || stepIndex >= currentDialogue.steps.length) {
      endDialogue(true);
      return;
    }
    const step = currentDialogue.steps[stepIndex];
    const target = window.STATE.target;
    const source = window.STATE.source;

    // Botin repliikki
    addBubble("bot", step.lines[target] || step.lines.en, step.lines[source] || step.lines.fi);
    // TTS
    window.SPEECH.speak(step.lines[target] || step.lines.en, target);

    // Vaihtoehdot
    const choicesHost = document.getElementById("dialogue-choices");
    choicesHost.innerHTML = "";
    choicesHost.classList.add("wrap");
    choicesHost.style.flexDirection = "column";
    step.choices.forEach(ch => {
      const btn = el("button", { class: "choice" }, ch.text[target] || ch.text.en);
      btn.style.maxWidth = "100%";
      btn.addEventListener("click", () => {
        addBubble("user", ch.text[target] || ch.text.en, ch.text[source] || ch.text.fi);
        if (!ch.correct && ch.hint) {
          setTimeout(() => addBubble("bot", "💡 " + (ch.hint[source] || ch.hint.fi || ch.hint.en), null), 400);
          // Ei edetä — anna käyttäjän yrittää uudelleen
        } else {
          stepIndex++;
          setTimeout(showNextStep, 700);
        }
      });
      choicesHost.appendChild(btn);
    });
  }

  function endDialogue(success) {
    const choicesHost = document.getElementById("dialogue-choices");
    choicesHost.innerHTML = "";
    addBubble("bot", success ? "✅ Hyvin tehty!" : "🙋 Kokeile uudestaan.", null);
    window.STATE_API.logSession("dialogue:" + currentDialogue.id, currentDialogue.steps.length, currentDialogue.steps.length);
  }

  function addBubble(role, text, translation) {
    const log = document.getElementById("chat-log");
    const bubble = el("div", { class: "bubble " + role }, text);
    if (translation && translation !== text) {
      const tr = el("div", { class: "translation" }, translation);
      bubble.appendChild(tr);
    }
    log.appendChild(bubble);
    log.parentElement.scrollTop = log.parentElement.scrollHeight;
  }

  // ---- Free conversation (LLM) -------------------------------
  function startFree(topicKey) {
    freeMode = true;
    freeTopic = topicKey || "general";
    currentDialogue = null;
    stepIndex = 0;
    freeHistory = [];
    document.getElementById("conversation-area").classList.remove("hidden");
    document.getElementById("dialogue-choices").innerHTML = "";
    document.getElementById("free-input").classList.remove("hidden");
    document.getElementById("chat-log").innerHTML = "";

    if (!window.STATE.apiKey) {
      addBubble("bot",
        "Vapaa keskustelu tarvitsee Anthropic-API-avaimen. Käy lisäämässä se Asetuksista, niin pääsemme juttelemaan opettelemallasi kielellä.",
        null);
      return;
    }
    // Aloita avauspuheenvuorolla
    sendFreeMessage(null, true);
  }

  async function sendFreeMessage(userText, isOpening = false) {
    const target = window.STATE.target;
    const source = window.STATE.source;
    const targetName = { en: "English", fi: "Finnish", sv: "Swedish" }[target];
    const sourceName = { en: "English", fi: "Finnish", sv: "Swedish" }[source];
    const topicHints = {
      general: "general small talk",
      cafe: "ordering at a café",
      travel: "travel and transport",
      hobby: "hobbies and free time",
      work: "work and studies"
    };
    const systemPrompt =
      "You are a patient, encouraging language conversation partner. " +
      "The user is learning " + targetName + " and speaks " + sourceName + ". " +
      "Keep your replies short (1–2 sentences), at A2/B1 level. " +
      "Stay in " + targetName + ". " +
      "Topic: " + (topicHints[freeTopic] || freeTopic) + ". " +
      "Always reply as JSON: {\"reply\": \"...\", \"translation\": \"...\", \"correction\": \"...\"} where " +
      "\"translation\" is the " + sourceName + " translation of your reply, and " +
      "\"correction\" briefly (in " + sourceName + ") notes any error in the user's last message — or empty string if none. " +
      "On the first turn (no user message yet), greet the user and ask an opening question.";

    if (userText) {
      freeHistory.push({ role: "user", content: userText });
      addBubble("user", userText, null);
    }

    // Lisää "typing" -kuplakorvike
    const log = document.getElementById("chat-log");
    const typing = el("div", { class: "bubble bot", style: "opacity:0.6;" }, "…");
    log.appendChild(typing);
    log.parentElement.scrollTop = log.parentElement.scrollHeight;

    try {
      const messages = freeHistory.slice();
      if (isOpening && messages.length === 0) {
        messages.push({ role: "user", content: "(begin)" });
      }
      const res = await fetch(ANTHROPIC_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "anthropic-version": "2023-06-01",
          "x-api-key": window.STATE.apiKey,
          "anthropic-dangerous-direct-browser-access": "true"
        },
        body: JSON.stringify({
          model: ANTHROPIC_MODEL,
          max_tokens: 400,
          system: systemPrompt,
          messages
        })
      });
      typing.remove();
      if (!res.ok) {
        const err = await res.text();
        addBubble("bot", "⚠️ API-virhe (" + res.status + "). Tarkista avain Asetuksista.", err.slice(0, 200));
        return;
      }
      const data = await res.json();
      const text = data.content?.[0]?.text || "";
      let parsed = null;
      try {
        // Joskus malli ympäröi JSON:n koodilohkoon
        const m = text.match(/\{[\s\S]*\}/);
        parsed = JSON.parse(m ? m[0] : text);
      } catch (e) {
        parsed = { reply: text, translation: "", correction: "" };
      }
      freeHistory.push({ role: "assistant", content: text });

      addBubble("bot", parsed.reply || "(tyhjä)", parsed.translation || null);
      window.SPEECH.speak(parsed.reply || "", target);

      if (parsed.correction && parsed.correction.trim()) {
        setTimeout(() => addBubble("bot", "📝 " + parsed.correction, null), 600);
      }
    } catch (e) {
      typing.remove();
      addBubble("bot", "⚠️ Virhe: " + e.message, null);
    }
  }

  function endConversation() {
    document.getElementById("conversation-area").classList.add("hidden");
    document.getElementById("chat-log").innerHTML = "";
    currentDialogue = null;
    freeMode = false;
    freeHistory = [];
  }

  // ---- Mikrofoni vapaassa keskustelussa ----------------------
  async function micFree(inputEl) {
    try {
      const results = await window.SPEECH.recognize(window.STATE.target);
      if (results && results.length) {
        inputEl.value = results[0].transcript || "";
      }
    } catch (e) {
      alert("Mikrofoni ei toimi: " + e.message);
    }
  }

  window.CONVERSATION = {
    renderDialogueList,
    startDialogue,
    startFree,
    sendFreeMessage,
    endConversation,
    micFree
  };
})();
