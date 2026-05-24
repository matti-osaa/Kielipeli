// ============================================================
// Puhe — TTS (Web Speech) ja SR (SpeechRecognition)
// ============================================================
// TTS toimii laajalti. Speech Recognition toimii parhaiten
// Chromessa (webkitSpeechRecognition). Safari/Firefox = puutteita.
// ============================================================

(function () {
  // Kartoita kielikoodit BCP47:ksi
  const LANG = { fi: "fi-FI", en: "en-US", sv: "sv-SE" };

  // ---- TTS ---------------------------------------------------
  function speak(text, lang = "en") {
    if (!("speechSynthesis" in window)) return;
    if (!text) return;
    try {
      window.speechSynthesis.cancel();
    } catch (e) {}
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = LANG[lang] || "en-US";
    utt.rate = 0.95;
    utt.pitch = 1.0;
    window.speechSynthesis.speak(utt);
  }

  // ---- Speech Recognition ------------------------------------
  function recognize(lang, opts = {}) {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      return Promise.reject(new Error("Puheentunnistus ei ole tuettu tässä selaimessa. Kokeile Chromea."));
    }
    return new Promise((resolve, reject) => {
      const rec = new SR();
      rec.lang = LANG[lang] || "en-US";
      rec.interimResults = false;
      rec.maxAlternatives = 3;
      rec.continuous = false;

      let timeoutId = setTimeout(() => {
        try { rec.stop(); } catch (e) {}
        reject(new Error("Aika loppui — yritä uudelleen."));
      }, opts.timeout || 10000);

      rec.onresult = (e) => {
        clearTimeout(timeoutId);
        const results = [];
        for (let i = 0; i < e.results[0].length; i++) {
          results.push({ transcript: e.results[0][i].transcript, confidence: e.results[0][i].confidence });
        }
        resolve(results);
      };
      rec.onerror = (e) => {
        clearTimeout(timeoutId);
        reject(new Error(e.error || "Tunnistus epäonnistui"));
      };
      rec.onend = () => clearTimeout(timeoutId);

      try { rec.start(); }
      catch (e) {
        clearTimeout(timeoutId);
        reject(e);
      }
    });
  }

  // ---- Samankaltaisuus pisteytykseen -------------------------
  // Pieni Levenshtein-pohjainen pisteytys 0..1
  function similarity(a, b) {
    if (!a || !b) return 0;
    a = a.toLowerCase().trim().replace(/[.,!?;:]/g, "");
    b = b.toLowerCase().trim().replace(/[.,!?;:]/g, "");
    if (a === b) return 1;
    const distance = levenshtein(a, b);
    const maxLen = Math.max(a.length, b.length);
    if (maxLen === 0) return 1;
    return Math.max(0, 1 - distance / maxLen);
  }

  function levenshtein(a, b) {
    const m = a.length, n = b.length;
    if (m === 0) return n;
    if (n === 0) return m;
    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const cost = a[i-1] === b[j-1] ? 0 : 1;
        dp[i][j] = Math.min(
          dp[i-1][j] + 1,
          dp[i][j-1] + 1,
          dp[i-1][j-1] + cost
        );
      }
    }
    return dp[m][n];
  }

  // Tarkista listalta paras vastine
  function bestMatch(transcripts, target) {
    let best = { transcript: "", score: 0 };
    for (const t of transcripts) {
      const s = similarity(t.transcript || t, target);
      if (s > best.score) best = { transcript: t.transcript || t, score: s };
    }
    return best;
  }

  window.SPEECH = {
    speak, recognize, similarity, bestMatch,
    isSupported: () => !!(window.SpeechRecognition || window.webkitSpeechRecognition)
  };
})();
