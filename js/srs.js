// ============================================================
// SRS — Spaced Repetition (Leitner-malli)
// ============================================================
// 6 laatikkoa (0..5). Oikea vastaus nostaa laatikkoa, väärä
// pudottaa joko nollaan tai yhden alas (asetus). Eräpäivä
// kasvaa eksponentiaalisesti.
//
// Tutkimustausta: Leitnerin laatikko on yksinkertainen mutta
// tehokas spaced repetition -toteutus. Sopii hyvin sanaston
// alkuvaiheeseen; pidemmälle voi siirtyä SM-2:een tai FSRS:ään.
// ============================================================

(function () {
  // Eräaika minuuteissa per laatikko
  const INTERVALS = [
    1,        // laatikko 0: minuutti (sama sessio)
    10,       // 10 min
    60,       // 1 h
    60 * 24,  // 1 vrk
    60 * 24 * 3,   // 3 vrk
    60 * 24 * 7,   // 7 vrk
    60 * 24 * 21   // 21 vrk
  ];

  function nextDue(box) {
    const minutes = INTERVALS[Math.min(box, INTERVALS.length - 1)];
    // Pieni satunnaisuus jotta erääntymiset eivät kasaannu
    const jitter = 1 + (Math.random() * 0.1 - 0.05);
    return Date.now() + minutes * 60 * 1000 * jitter;
  }

  // Arvioi vastaus ja päivitä laatikko
  function review(wordId, direction, correct) {
    const p = window.STATE_API.getProgress(wordId, direction);
    let newBox = p.box;
    let correctCount = p.correct + (correct ? 1 : 0);
    let wrongCount = p.wrong + (correct ? 0 : 1);

    if (correct) {
      newBox = Math.min(p.box + 1, 6);
    } else {
      // Tippuu yhden alas, mutta ei alle nollan
      newBox = Math.max(p.box - 1, 0);
    }

    const next = nextDue(newBox);
    window.STATE_API.setProgress(wordId, direction, {
      box: newBox,
      next,
      correct: correctCount,
      wrong: wrongCount,
      lastSeen: Date.now()
    });
    return { newBox, next };
  }

  // Hae erääntyneet sanat (tai jos ei ole, niin uusia)
  // params: { limit, topicId, direction }
  function pickDue(opts = {}) {
    const { limit = 10, topicId = null, direction = "forward" } = opts;
    const now = Date.now();
    const candidates = window.WORDS.filter(w => {
      if (topicId && window.getWordTopic(w.id) !== topicId) return false;
      const p = window.STATE_API.getProgress(w.id, direction);
      return p.lastSeen && p.next <= now;
    });
    candidates.sort((a, b) => {
      const pa = window.STATE_API.getProgress(a.id, direction);
      const pb = window.STATE_API.getProgress(b.id, direction);
      return pa.next - pb.next;
    });
    return candidates.slice(0, limit);
  }

  // Hae uudet sanat (sellaiset joita ei ole nähty)
  function pickNew(opts = {}) {
    const { limit = 5, topicId = null, direction = "forward" } = opts;
    const candidates = window.WORDS.filter(w => {
      if (topicId && window.getWordTopic(w.id) !== topicId) return false;
      const p = window.STATE_API.getProgress(w.id, direction);
      return !p.lastSeen;
    });
    return candidates.slice(0, limit);
  }

  // Sekoitettu sessio: 40 % erääntyneitä, 30 % uusia, 30 % satunnaisia
  function pickSession(opts = {}) {
    const { total = 12, topicId = null } = opts;
    const dueCount = Math.ceil(total * 0.4);
    const newCount = Math.ceil(total * 0.3);
    const due = pickDue({ limit: dueCount, topicId });
    const fresh = pickNew({ limit: newCount, topicId });
    const seen = new Set([...due, ...fresh].map(w => w.id));
    const restPool = window.WORDS.filter(w => {
      if (seen.has(w.id)) return false;
      if (topicId && window.getWordTopic(w.id) !== topicId) return false;
      return true;
    });
    // Sekoita pool
    for (let i = restPool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [restPool[i], restPool[j]] = [restPool[j], restPool[i]];
    }
    const rest = restPool.slice(0, total - due.length - fresh.length);
    const all = [...due, ...fresh, ...rest];
    // Sekoita kokonaislista
    for (let i = all.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [all[i], all[j]] = [all[j], all[i]];
    }
    return all;
  }

  window.SRS = { review, pickDue, pickNew, pickSession, INTERVALS };
})();
