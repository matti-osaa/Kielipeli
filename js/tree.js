// ============================================================
// Rakennenäkymä — klikattava kielioppipuu (horisontaalinen mindmap)
// ============================================================
// Vasemmalla juuri, oikealle haarautuvat oksat. Solmun klikkaus:
//  • laajenna/sulje aliosa
//  • avaa detaljipaneeli, josta voi käynnistää harjoituksen
//
// Solmun edistyminen näkyy värisävynä ja pienenä palkkina.
// ============================================================

(function () {
  const NODE_W = 160;
  const NODE_H = 38;
  const COL_GAP = 60;
  const ROW_GAP = 8;

  const expanded = new Set();
  let focusedId = null; // mille solmulle paneeli on auki

  // Laajenna oletuksena vain juuri + 1. taso
  function initExpansion(root) {
    expanded.add(root.id);
    if (root.children) for (const c of root.children) expanded.add(c.id);
  }

  // Laske kunkin solmun y-paikka & korkeus rekursiivisesti
  function layout(root) {
    let y = 0;
    const positions = {};
    function visit(node, depth) {
      const open = expanded.has(node.id);
      const startY = y;
      if (open && node.children && node.children.length) {
        for (const c of node.children) visit(c, depth + 1);
      } else {
        y += NODE_H + ROW_GAP;
      }
      // Sijoitus
      let cy;
      if (open && node.children && node.children.length) {
        // Keskellä lapsiensa väliä
        const first = positions[node.children[0].id];
        const last = positions[node.children[node.children.length - 1].id];
        cy = (first.cy + last.cy) / 2;
      } else {
        cy = startY + NODE_H / 2;
      }
      positions[node.id] = {
        x: depth * (NODE_W + COL_GAP),
        cy
      };
    }
    visit(root, 0);
    return { positions, totalHeight: y };
  }

  function masteryColor(m) {
    // m: 0..1 — harmaasta vihreään
    if (m === 0) return "rgba(255,255,255,0.05)";
    const a = 0.1 + m * 0.35;
    return "rgba(110,231,183," + a + ")";
  }

  function render(host) {
    const root = window.currentGrammarTree();
    if (!root) return;
    if (expanded.size === 0) initExpansion(root);

    host.innerHTML = "";
    const wrap = document.createElement("div");
    wrap.style.display = "flex";
    wrap.style.gap = "20px";
    wrap.style.flexWrap = "wrap";
    wrap.style.alignItems = "flex-start";
    host.appendChild(wrap);

    // Vasen: SVG-puu
    const svgWrap = document.createElement("div");
    svgWrap.style.flex = "2";
    svgWrap.style.minWidth = "320px";
    svgWrap.style.overflowX = "auto";
    svgWrap.style.background = "var(--bg-1)";
    svgWrap.style.border = "1px solid var(--line)";
    svgWrap.style.borderRadius = "14px";
    svgWrap.style.padding = "16px";
    wrap.appendChild(svgWrap);

    // Oikea: detaljipaneeli
    const detail = document.createElement("div");
    detail.style.flex = "1";
    detail.style.minWidth = "280px";
    detail.id = "grammar-detail";
    wrap.appendChild(detail);

    const { positions, totalHeight } = layout(root);

    // Lasketaan svg-leveys: max(depth) * (NODE_W + COL_GAP)
    let maxDepth = 0;
    Object.keys(positions).forEach(id => {
      const p = positions[id];
      const d = Math.round(p.x / (NODE_W + COL_GAP));
      if (d > maxDepth) maxDepth = d;
    });
    const svgW = (maxDepth + 1) * (NODE_W + COL_GAP) + 20;
    const svgH = Math.max(totalHeight + 20, 200);

    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("width", svgW);
    svg.setAttribute("height", svgH);
    svg.setAttribute("viewBox", "0 0 " + svgW + " " + svgH);
    svgWrap.appendChild(svg);

    // Piirrä viivat lapsiin (vain laajennetuilla)
    function drawLines(node) {
      if (!expanded.has(node.id) || !node.children) return;
      const p = positions[node.id];
      for (const c of node.children) {
        const cp = positions[c.id];
        const x1 = p.x + NODE_W;
        const y1 = p.cy;
        const x2 = cp.x;
        const y2 = cp.cy;
        const path = document.createElementNS(ns, "path");
        const mx = (x1 + x2) / 2;
        path.setAttribute("d", `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`);
        path.setAttribute("stroke", "rgba(255,255,255,0.2)");
        path.setAttribute("stroke-width", "1.4");
        path.setAttribute("fill", "none");
        svg.appendChild(path);
        drawLines(c);
      }
    }
    drawLines(root);

    // Piirrä solmut
    function drawNodes(node) {
      const p = positions[node.id];
      const m = window.grammarMastery(node.id);
      const hasChildren = node.children && node.children.length;
      const isOpen = expanded.has(node.id);

      // Tausta
      const rect = document.createElementNS(ns, "rect");
      rect.setAttribute("x", p.x);
      rect.setAttribute("y", p.cy - NODE_H / 2);
      rect.setAttribute("width", NODE_W);
      rect.setAttribute("height", NODE_H);
      rect.setAttribute("rx", 10);
      rect.setAttribute("fill", masteryColor(m));
      rect.setAttribute("stroke", focusedId === node.id ? "var(--accent)" : "rgba(255,255,255,0.15)");
      rect.setAttribute("stroke-width", focusedId === node.id ? "1.8" : "1");
      rect.style.cursor = "pointer";
      svg.appendChild(rect);

      // Teksti
      const text = document.createElementNS(ns, "text");
      text.setAttribute("x", p.x + 14);
      text.setAttribute("y", p.cy + 5);
      text.setAttribute("fill", "var(--text)");
      text.setAttribute("font-size", "13");
      text.setAttribute("font-weight", "500");
      text.style.cursor = "pointer";
      text.style.userSelect = "none";
      text.textContent = node.label;
      svg.appendChild(text);

      // Laajennus-ikoni
      if (hasChildren) {
        const exp = document.createElementNS(ns, "text");
        exp.setAttribute("x", p.x + NODE_W - 18);
        exp.setAttribute("y", p.cy + 5);
        exp.setAttribute("fill", "var(--text-dim)");
        exp.setAttribute("font-size", "13");
        exp.style.cursor = "pointer";
        exp.style.userSelect = "none";
        exp.textContent = isOpen ? "▾" : "▸";
        svg.appendChild(exp);
      }

      // Edistymispalkki alareunaan
      if (m > 0) {
        const bar = document.createElementNS(ns, "rect");
        bar.setAttribute("x", p.x + 6);
        bar.setAttribute("y", p.cy + NODE_H / 2 - 4);
        bar.setAttribute("width", (NODE_W - 12) * m);
        bar.setAttribute("height", 2);
        bar.setAttribute("rx", 1);
        bar.setAttribute("fill", "var(--success)");
        svg.appendChild(bar);
      }

      // Klikkaus = focusoi + laajenna jos lapsia
      const onClick = (e) => {
        focusedId = node.id;
        if (hasChildren) {
          if (expanded.has(node.id)) expanded.delete(node.id);
          else expanded.add(node.id);
        }
        render(host);
      };
      rect.addEventListener("click", onClick);
      text.addEventListener("click", onClick);

      if (isOpen && hasChildren) for (const c of node.children) drawNodes(c);
    }
    drawNodes(root);

    // Detaljipaneeli
    renderDetail(detail, focusedId ? window.findGrammarNode(focusedId) : root);
  }

  function renderDetail(host, node) {
    if (!node) {
      host.innerHTML = "<p>Klikkaa solmua nähdäksesi tarkemmin.</p>";
      return;
    }
    host.innerHTML = "";
    const card = document.createElement("div");
    card.className = "card";
    host.appendChild(card);

    const h = document.createElement("h3");
    h.textContent = node.label;
    if (node.sub) {
      const sub = document.createElement("div");
      sub.className = "muted";
      sub.style.fontSize = "13px";
      sub.style.marginTop = "-4px";
      sub.style.marginBottom = "8px";
      sub.textContent = node.sub;
      card.appendChild(h);
      card.appendChild(sub);
    } else {
      card.appendChild(h);
    }

    if (node.desc) {
      const d = document.createElement("p");
      d.textContent = node.desc;
      d.style.marginTop = "8px";
      card.appendChild(d);
    }

    if (node.rules && node.rules.length) {
      const lbl = document.createElement("div");
      lbl.className = "label-cap";
      lbl.textContent = "Säännöt";
      lbl.style.marginTop = "10px";
      card.appendChild(lbl);
      const ul = document.createElement("ul");
      ul.style.fontSize = "13px";
      ul.style.color = "var(--text-soft)";
      ul.style.lineHeight = "1.5";
      ul.style.paddingLeft = "16px";
      node.rules.forEach(r => {
        const li = document.createElement("li");
        li.textContent = r;
        ul.appendChild(li);
      });
      card.appendChild(ul);
    }

    if (node.examples && node.examples.length) {
      const lbl = document.createElement("div");
      lbl.className = "label-cap";
      lbl.textContent = "Esimerkkejä";
      lbl.style.marginTop = "12px";
      card.appendChild(lbl);
      node.examples.forEach(ex => {
        const row = document.createElement("div");
        row.style.padding = "6px 0";
        row.style.borderBottom = "1px solid var(--line)";
        row.style.fontSize = "13px";
        row.innerHTML = "<div><b>" + ex.en + "</b></div><div class='muted' style='font-size:12px;'>" + ex.fi + "</div>";
        card.appendChild(row);
      });
    }

    // Harjoittele-painike
    const hasExer = (node.exercises && node.exercises.length) || hasDescendantExercises(node);
    if (hasExer) {
      const btn = document.createElement("button");
      btn.className = "btn btn-primary btn-full mt-16";
      btn.textContent = "Harjoittele tätä rakennetta";
      btn.onclick = () => startGrammarPractice(node);
      card.appendChild(btn);
    }

    // Edistyminen
    const m = window.grammarMastery(node.id);
    const p = window.getGrammarProgress(node.id);
    const prog = document.createElement("div");
    prog.className = "muted";
    prog.style.fontSize = "12px";
    prog.style.marginTop = "10px";
    prog.textContent = "Hallinta: " + Math.round(m * 100) + "% · " +
      "Oikein " + p.correct + " · Väärin " + p.wrong;
    card.appendChild(prog);
  }

  function hasDescendantExercises(node) {
    if (node.exercises && node.exercises.length) return true;
    if (!node.children) return false;
    return node.children.some(hasDescendantExercises);
  }

  async function startGrammarPractice(node) {
    // Avaa overlay-tyylinen harjoitussessio
    let overlay = document.getElementById("grammar-overlay");
    if (overlay) overlay.remove();
    overlay = document.createElement("div");
    overlay.id = "grammar-overlay";
    overlay.className = "modal-backdrop open";
    overlay.innerHTML = `
      <div class="modal" style="max-width:520px;">
        <div class="row" style="justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
          <h3>${node.label}</h3>
          <button class="btn btn-icon btn-ghost" id="grammar-overlay-close">✕</button>
        </div>
        <div class="exercise-card" id="grammar-overlay-card" style="padding:18px;"></div>
        <div class="row mt-16">
          <div class="grow"><div class="progress"><div class="bar" id="grammar-overlay-bar"></div></div></div>
          <div class="muted" id="grammar-overlay-text" style="min-width:60px; text-align:right;">0 / 0</div>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    document.getElementById("grammar-overlay-close").onclick = () => {
      overlay.remove();
      const host = document.getElementById("grammar-tree");
      if (host) render(host);
    };

    const card = document.getElementById("grammar-overlay-card");
    const bar = document.getElementById("grammar-overlay-bar");
    const txt = document.getElementById("grammar-overlay-text");

    const result = await window.GRAMMAR.runGrammarSession(node, card, (i, total, correct) => {
      bar.style.width = (total > 0 ? Math.round(100 * i / total) : 0) + "%";
      txt.textContent = i + " / " + total;
    });

    // Tulos
    card.innerHTML = "";
    const ok = document.createElement("div");
    ok.className = "ex-prompt";
    ok.textContent = "Sessio päättyi";
    const score = document.createElement("div");
    score.className = "ex-word";
    score.textContent = result.correct + " / " + result.total;
    const sub = document.createElement("div");
    sub.className = "ex-context";
    sub.textContent = "Hieno suoritus! Voit jatkaa toisen rakenteen pariin.";
    card.appendChild(ok); card.appendChild(score); card.appendChild(sub);
  }

  function focus(nodeId) {
    focusedId = nodeId;
    // Laajenna kaikki kantasolmut
    const flat = window.currentGrammarFlat();
    let cur = nodeId;
    while (cur) {
      const item = flat.find(x => x.node.id === cur);
      if (!item) break;
      expanded.add(cur);
      cur = item.parentId;
    }
  }

  function resetExpansion() {
    expanded.clear();
    focusedId = null;
  }

  window.TREE = { render, focus, startGrammarPractice, resetExpansion };
})();
