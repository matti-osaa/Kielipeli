#!/usr/bin/env node
// ============================================================
// generate-vocab.js — Sanaston generointi Claude-API:n kautta
// ============================================================
// Lukee nykyisen sanaston (data/*.js), generoi puuttuvat sanat
// kohti tavoitemäärää (oletus 5000) kutsumalla Claude Haikua
// eräajoissa, ja kirjoittaa lopputuloksen data/words_generated.js
// -tiedostoon.
//
// Käyttö:
//   export ANTHROPIC_API_KEY=sk-ant-...
//   node scripts/generate-vocab.js
//
// Argumentit (kaikki valinnaisia):
//   --target=N        Tavoitemäärä sanoja yhteensä (oletus 5000)
//   --batch=N         Sanoja per API-kutsu (oletus 25)
//   --model=NAME      Mallin nimi (oletus claude-haiku-4-5-20251001)
//   --resume          Jatka edellisestä snapshotista
//
// Lopputulos:
//   data/words_generated.js   - sanasto-objektit ja topic-mapit
//   .vocab-snapshot.json      - resumea varten
// ============================================================

const fs = require("fs");
const path = require("path");

const API_KEY = process.env.ANTHROPIC_API_KEY;
if (!API_KEY) {
  console.error("VIRHE: aseta ympäristömuuttuja ANTHROPIC_API_KEY ennen ajamista.");
  console.error("  export ANTHROPIC_API_KEY=sk-ant-...");
  process.exit(1);
}

// Parsi argumentit
const args = Object.fromEntries(
  process.argv.slice(2).map(a => {
    const m = a.match(/^--(\w+)(?:=(.+))?$/);
    return m ? [m[1], m[2] ?? true] : [a, true];
  })
);
const TARGET = Number(args.target) || 5000;
const BATCH_SIZE = Number(args.batch) || 25;
const MODEL = args.model || "claude-haiku-4-5-20251001";
const RESUME = !!args.resume;

const ROOT = path.resolve(__dirname, "..");
const SNAPSHOT_PATH = path.join(ROOT, ".vocab-snapshot.json");
const OUTPUT_PATH = path.join(ROOT, "data", "words_generated.js");

// ---- Lataa nykyiset sanat ----------------------------------
function loadExisting() {
  global.window = {};
  require(path.join(ROOT, "data", "words.js"));
  require(path.join(ROOT, "data", "topics.js"));
  require(path.join(ROOT, "data", "words_ext.js"));
  require(path.join(ROOT, "data", "words_ext2.js"));
  return {
    ids: new Set(window.WORDS.map(w => w.id)),
    topicIds: window.TOPICS.map(t => t.id),
    count: window.WORDS.length
  };
}

// ---- Snapshot -----------------------------------------------
function loadSnapshot() {
  if (!RESUME) return null;
  if (!fs.existsSync(SNAPSHOT_PATH)) return null;
  try { return JSON.parse(fs.readFileSync(SNAPSHOT_PATH, "utf8")); }
  catch (e) { console.warn("Snapshot vioittunut:", e.message); return null; }
}
function saveSnapshot(state) {
  fs.writeFileSync(SNAPSHOT_PATH, JSON.stringify(state, null, 2));
}

// ---- Claude-API ---------------------------------------------
const SYSTEM_PROMPT =
  `You are generating vocabulary entries for a Finnish-language learning app supporting English, Finnish, and Swedish.

Output ONLY a valid JSON array of word entries — no markdown, no code fences, no preamble, no trailing text.

Each entry has these exact fields:
- "id": unique slug. Lowercase ASCII, alphanumeric + underscores only. Derived from the English form. If a name collides with an existing word, add a disambiguating suffix like "_v" (verb), "_n" (noun), "_adj", or a topical hint.
- "pos": one of "noun" | "verb" | "adj" | "adv" | "num" | "pron" | "interj" | "prep" | "conj" | "det"
- "level": 1 (A1), 2 (A2), 3 (B1), or 4 (B2)
- "topic": one of these IDs only: pronouns, numbers, time, people, body, food, animals, nature, home, travel, colors, qualities, feelings, social, actions, expression, function
- "t": object with keys "en", "fi", "sv". Values are short translations.
  - For verbs in English use "to X" form (e.g. "to eat")
  - For verbs in Finnish use the basic infinitive ("syödä")
  - For verbs in Swedish use "att X" ("att äta")
  - For nouns keep them as bare singular forms in all languages
  - Use commonly accepted modern usage. If a word has multiple meanings, pick the most common one matching the topic.
- "ex": object with keys "en", "fi", "sv". Short example sentences (4–10 words) that are translations of each other and naturally use the headword.

Quality requirements:
- Pick words that are GENUINELY common in everyday spoken/written language at the requested CEFR level.
- Avoid: archaic words, narrow technical jargon, proper nouns, derivatives that are obvious from a base word already in the list.
- Avoid duplicates with the existing-IDs list provided.
- IDs must be unique within the batch.
- Translations must be accurate. If unsure, prefer a more common alternative word.

Output format: a JSON array, e.g.:
[
  {"id":"chair","pos":"noun","level":1,"topic":"home","t":{"en":"chair","fi":"tuoli","sv":"stol"},"ex":{"en":"Sit on the chair.","fi":"Istu tuolille.","sv":"Sitt på stolen."}},
  ...
]`;

async function callClaude({ haveIds, level, count, attempt = 1 }) {
  const userPrompt = `Generate ${count} more common English words at CEFR level ${level} (A${level === 1 ? "1" : level === 2 ? "2" : level === 3 ? "B1" : "B2"}).

Already-included IDs (do NOT repeat any of these): ${[...haveIds].sort().join(", ")}

Return JSON array only.`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "anthropic-version": "2023-06-01",
      "x-api-key": API_KEY
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 4500,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }]
    })
  });

  if (!res.ok) {
    const text = await res.text();
    if (res.status === 429 && attempt < 4) {
      const wait = 5000 * attempt;
      console.warn(`  Rate limit, odotetaan ${wait}ms ja yritetään uudelleen (yritys ${attempt+1}/4)…`);
      await new Promise(r => setTimeout(r, wait));
      return callClaude({ haveIds, level, count, attempt: attempt + 1 });
    }
    throw new Error(`API ${res.status}: ${text.slice(0, 300)}`);
  }

  const data = await res.json();
  const text = data.content?.[0]?.text || "";
  // Yritä parsia JSON suoraan tai poimia objekti tekstistä
  const m = text.match(/\[\s*[\s\S]*\]/);
  if (!m) throw new Error("API vastaus ei sisältänyt JSON-taulukkoa: " + text.slice(0, 200));
  const arr = JSON.parse(m[0]);
  if (!Array.isArray(arr)) throw new Error("Vastaus ei ole taulukko.");
  return { entries: arr, usage: data.usage };
}

// ---- Validointi ja siivous ----------------------------------
function validateEntry(e, allowedTopics) {
  if (!e || typeof e !== "object") return "ei ole objekti";
  if (!e.id || !/^[a-z0-9_]+$/.test(e.id)) return "viallinen id: " + e.id;
  const validPos = ["noun","verb","adj","adv","num","pron","interj","prep","conj","det"];
  if (!validPos.includes(e.pos)) return "viallinen pos: " + e.pos;
  if (![1,2,3,4].includes(e.level)) return "viallinen level: " + e.level;
  if (!allowedTopics.includes(e.topic)) return "tuntematon topic: " + e.topic;
  if (!e.t || !e.t.en || !e.t.fi || !e.t.sv) return "puuttuvia käännöksiä";
  if (!e.ex || !e.ex.en || !e.ex.fi || !e.ex.sv) return "puuttuvia esimerkkilauseita";
  return null;
}

// ---- Pääsilmukka --------------------------------------------
async function main() {
  console.log(`Kohde: ${TARGET} sanaa yhteensä. Eräkoko: ${BATCH_SIZE}. Malli: ${MODEL}.`);
  const existing = loadExisting();
  console.log(`Nykyisiä sanoja: ${existing.count}.`);

  let snapshot = loadSnapshot();
  let generated = snapshot?.generated || [];
  const allIds = new Set([...existing.ids, ...generated.map(w => w.id)]);
  console.log(`Aiemmin generoituja (snapshot): ${generated.length}.`);

  let totalInTokens = snapshot?.totalInTokens || 0;
  let totalOutTokens = snapshot?.totalOutTokens || 0;

  // Tasojen jakauma. Painotetaan keskiosaa.
  // Alku: täytetään level 2:lla kunnes 1500, sitten 3:lla kunnes 3500, sitten 4:lla loppuun.
  function pickLevel(total) {
    if (total < 1500) return 2;
    if (total < 3500) return 3;
    return 4;
  }

  let batchNum = 0;
  let consecutiveFailures = 0;
  const startTime = Date.now();

  while (allIds.size < TARGET) {
    batchNum++;
    const remaining = TARGET - allIds.size;
    const count = Math.min(BATCH_SIZE, remaining);
    const level = pickLevel(allIds.size);

    // Älä lähetä koko valtavaa ID-listaa joka kerta — viimeisten 800 lisäys riittää
    const haveSample = [...allIds].slice(-800);

    process.stdout.write(`[${batchNum}] taso ${level}, +${count} sanaa (yht ${allIds.size}/${TARGET})… `);
    try {
      const { entries, usage } = await callClaude({ haveIds: haveSample, level, count });
      totalInTokens += usage?.input_tokens || 0;
      totalOutTokens += usage?.output_tokens || 0;

      let accepted = 0;
      for (const e of entries) {
        const err = validateEntry(e, existing.topicIds);
        if (err) continue;
        if (allIds.has(e.id)) continue;
        allIds.add(e.id);
        generated.push(e);
        accepted++;
      }
      const cost = totalInTokens / 1e6 + totalOutTokens / 1e6 * 5;
      console.log(`hyväksytty ${accepted}/${entries.length}, kustannus tähän asti $${cost.toFixed(3)}`);

      consecutiveFailures = 0;
      // Tallenna snapshot joka 5. erän jälkeen
      if (batchNum % 5 === 0) {
        saveSnapshot({ generated, totalInTokens, totalOutTokens });
      }
    } catch (e) {
      consecutiveFailures++;
      console.log(`VIRHE: ${e.message}`);
      if (consecutiveFailures >= 3) {
        console.error("Kolme peräkkäistä virhettä, lopetetaan. Aja uudelleen --resume kun valmis.");
        saveSnapshot({ generated, totalInTokens, totalOutTokens });
        process.exit(1);
      }
      await new Promise(r => setTimeout(r, 3000));
    }
  }

  saveSnapshot({ generated, totalInTokens, totalOutTokens });

  // Kirjoita ulos
  console.log(`\nGeneroitu ${generated.length} uutta sanaa. Kirjoitetaan ${path.relative(ROOT, OUTPUT_PATH)}…`);
  writeOutput(generated);

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
  const cost = totalInTokens / 1e6 + totalOutTokens / 1e6 * 5;
  console.log(`Valmis. Aikaa kului ${elapsed} s. Kustannus noin $${cost.toFixed(2)}.`);
}

function writeOutput(generated) {
  // Ryhmitä topic-mappauksen mukaan
  const lines = [];
  lines.push("// Automaattisesti generoitu sanaston laajennus.");
  lines.push("// Älä muokkaa käsin paitsi tarkistusten korjauksiin.");
  lines.push("// Generoitu: " + new Date().toISOString());
  lines.push("");
  lines.push("(function () {");
  lines.push("  const W = [");
  for (const e of generated) {
    const t = JSON.stringify(e.t);
    const ex = JSON.stringify(e.ex);
    lines.push(`    { id:${JSON.stringify(e.id)}, pos:${JSON.stringify(e.pos)}, level:${e.level}, t:${t}, ex:${ex} },`);
  }
  lines.push("  ];");
  lines.push("");
  lines.push("  Array.prototype.push.apply(window.WORDS, W);");
  lines.push("");
  lines.push("  const M = {");
  for (const e of generated) {
    lines.push(`    ${JSON.stringify(e.id)}: ${JSON.stringify(e.topic)},`);
  }
  lines.push("  };");
  lines.push("  Object.assign(window.WORD_TOPIC, M);");
  lines.push("");
  lines.push(`  console.log("Generoitu sanasto ladattu:", W.length, "+", "=", window.WORDS.length, "yhteensä");`);
  lines.push("})();");
  fs.writeFileSync(OUTPUT_PATH, lines.join("\n") + "\n");
}

main().catch(e => {
  console.error("Vakava virhe:", e);
  process.exit(1);
});
