// ============================================================
// Galaksinäkymä — kielen rakenne palloina ja klustereina
// ============================================================
// SVG-pohjainen visualisaatio:
//  • Jokainen aihepiiri on klusteri jolla on värillinen "halo"
//    ja keskellä nimi.
//  • Jokainen sana on pallo, jonka koko & kirkkaus = hallinta
//  • Sanaluokat erottuvat pallon reunaviivasta (nyt: ei erikseen,
//    pidetään yksinkertaisena ja luotetaan aihepiiriväriin).
//  • Klikkaus pallosta avaa sanakortin.
//  • Klikkaus klusterin nimestä rajaa harjoituksen aihepiiriin.
// ============================================================

(function () {
  const W = 1000, H = 750;
  const CENTER = { x: W/2, y: H/2 };

  // Klustereiden sijoittelu — kiinteät paikat aihepiireittäin
  // Säädetty visuaalisesti niin että lähikäsitteet ovat lähekkäin.
  const LAYOUT = {
    // Keskusta — kielen runko
    pronouns:   { cx: 500, cy: 375, r: 70, ring: 0 },
    function:   { cx: 350, cy: 250, r: 70, ring: 1 },

    // Yläosa — aika ja numerot
    numbers:    { cx: 500, cy: 130, r: 60, ring: 1 },
    time:       { cx: 700, cy: 170, r: 90, ring: 1 },

    // Oikea ylä — sosiaalinen / tervehdykset
    social:     { cx: 850, cy: 320, r: 70, ring: 2 },

    // Oikea — ihmiset, keho, tunteet
    people:     { cx: 800, cy: 480, r: 85, ring: 2 },
    body:       { cx: 870, cy: 620, r: 75, ring: 2 },
    feelings:   { cx: 690, cy: 600, r: 55, ring: 2 },

    // Vasen ylä — toiminta ja mieli
    actions:    { cx: 180, cy: 350, r: 120, ring: 2 },
    expression: { cx: 180, cy: 540, r: 90, ring: 2 },

    // Alaosa — fyysinen maailma
    food:       { cx: 380, cy: 600, r: 95, ring: 2 },
    home:       { cx: 530, cy: 650, r: 95, ring: 2 },
    travel:     { cx: 290, cy: 130, r: 75, ring: 1 },
    animals:    { cx: 130, cy: 700, r: 65, ring: 3 },

    // Reunat — ominaisuudet ja värit
    qualities:  { cx: 870, cy: 110, r: 100, ring: 2 },
    colors:     { cx: 920, cy: 720, r: 60, ring: 3 },
    nature:     { cx: 60,  cy: 130, r: 85, ring: 2 }
  };

  // Generoi sanojen sijainnit deterministisesti aihepiirin sisällä
  function wordPositions(topicId) {
    const layout = LAYOUT[topicId];
    const words = window.wordsByTopic(topicId);
    const positions = [];
    // Käytä spiraalia, jotta täyttö on tasaista
    const golden = Math.PI * (3 - Math.sqrt(5)); // golden angle
    for (let i = 0; i < words.length; i++) {
      const t = (i + 0.5) / words.length;
      const r = layout.r * Math.sqrt(t) * 0.85;
      const a = i * golden;
      positions.push({
        word: words[i],
        x: layout.cx + r * Math.cos(a),
        y: layout.cy + r * Math.sin(a)
      });
    }
    return positions;
  }

  function render(svg) {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    const ns = "http://www.w3.org/2000/svg";

    // Taustan glow-tähdet
    const stars = document.createElementNS(ns, "g");
    for (let i = 0; i < 60; i++) {
      const c = document.createElementNS(ns, "circle");
      c.setAttribute("cx", Math.random() * W);
      c.setAttribute("cy", Math.random() * H);
      c.setAttribute("r", Math.random() * 0.9 + 0.2);
      c.setAttribute("fill", "rgba(255,255,255," + (0.10 + Math.random() * 0.18) + ")");
      stars.appendChild(c);
    }
    svg.appendChild(stars);

    // Aihepiirit
    for (const topic of window.TOPICS) {
      const layout = LAYOUT[topic.id];
      if (!layout) continue;
      // Halo
      const halo = document.createElementNS(ns, "circle");
      halo.setAttribute("cx", layout.cx);
      halo.setAttribute("cy", layout.cy);
      halo.setAttribute("r", layout.r + 8);
      halo.setAttribute("fill", topic.color);
      halo.setAttribute("fill-opacity", "0.05");
      halo.setAttribute("stroke", topic.color);
      halo.setAttribute("stroke-opacity", "0.25");
      halo.setAttribute("stroke-width", "1");
      halo.style.cursor = "pointer";
      halo.addEventListener("click", () => {
        // Klikkaus klusterin haloon vie harjoitukseen
        window.APP && window.APP.startTopicPractice && window.APP.startTopicPractice(topic.id);
      });
      svg.appendChild(halo);

      // Nimi
      const label = document.createElementNS(ns, "text");
      label.setAttribute("x", layout.cx);
      label.setAttribute("y", layout.cy - layout.r - 14);
      label.setAttribute("text-anchor", "middle");
      label.setAttribute("fill", topic.color);
      label.setAttribute("font-size", "13");
      label.setAttribute("font-weight", "600");
      label.setAttribute("letter-spacing", "0.3");
      label.style.cursor = "pointer";
      label.style.userSelect = "none";
      label.textContent = topic.label;
      label.addEventListener("click", () => {
        window.APP && window.APP.startTopicPractice && window.APP.startTopicPractice(topic.id);
      });
      svg.appendChild(label);

      // Sanat
      const positions = wordPositions(topic.id);
      for (const pos of positions) {
        const w = pos.word;
        const mastery = window.STATE_API.masteryCombined(w.id);
        const r = 2.5 + mastery * 7;          // 2.5 .. 9.5 px
        const opacity = 0.35 + mastery * 0.6; // 0.35 .. 0.95
        const fill = topic.color;

        const dot = document.createElementNS(ns, "circle");
        dot.setAttribute("cx", pos.x);
        dot.setAttribute("cy", pos.y);
        dot.setAttribute("r", r);
        dot.setAttribute("fill", fill);
        dot.setAttribute("fill-opacity", opacity);
        dot.setAttribute("stroke", mastery > 0.6 ? "#ffffff" : "rgba(255,255,255,0.25)");
        dot.setAttribute("stroke-width", mastery > 0.6 ? "1.3" : "0.6");
        dot.style.cursor = "pointer";

        // Hover tooltip
        dot.addEventListener("mousemove", (e) => showTooltip(e, w));
        dot.addEventListener("mouseleave", hideTooltip);
        dot.addEventListener("click", () => {
          window.APP && window.APP.openWordCard && window.APP.openWordCard(w);
        });
        svg.appendChild(dot);
      }
    }
  }

  function showTooltip(evt, word) {
    const tip = document.getElementById("galaxy-tip");
    if (!tip) return;
    const source = window.STATE.source;
    const target = window.STATE.target;
    tip.textContent = word.t[target] + " — " + word.t[source];
    const wrap = document.querySelector(".galaxy-wrap").getBoundingClientRect();
    const x = evt.clientX - wrap.left;
    const y = evt.clientY - wrap.top;
    tip.style.left = x + "px";
    tip.style.top = y + "px";
    tip.classList.add("show");
  }
  function hideTooltip() {
    const tip = document.getElementById("galaxy-tip");
    if (tip) tip.classList.remove("show");
  }

  function renderLegend(host) {
    host.innerHTML = "";
    for (const t of window.TOPICS) {
      const chip = document.createElement("button");
      chip.className = "legend-chip";
      const sw = document.createElement("span");
      sw.className = "swatch";
      sw.style.background = t.color;
      const txt = document.createElement("span");
      const count = window.wordsByTopic(t.id).length;
      txt.textContent = t.label + " · " + count;
      chip.appendChild(sw);
      chip.appendChild(txt);
      chip.addEventListener("click", () => {
        window.APP && window.APP.startTopicPractice && window.APP.startTopicPractice(t.id);
      });
      host.appendChild(chip);
    }
  }

  window.GALAXY = { render, renderLegend };
})();
