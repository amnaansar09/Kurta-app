(function () {
  const { OPTIONS, COLORS, VARIANTS, PRINCIPLES, QUIZ, DRESSING_STEPS } = window.AASANI;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- Storage (safe) ---------- */
  const store = {
    get(k, d) { try { const v = localStorage.getItem("aasani:" + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem("aasani:" + k, JSON.stringify(v)); return true; } catch (e) { return false; } }
  };

  /* ---------- Reading options ---------- */
  function applyReading() {
    const size = store.get("size", 1);
    const contrast = store.get("contrast", false);
    document.documentElement.dataset.size = size;
    document.documentElement.dataset.contrast = contrast ? "high" : "normal";
    $$("[data-size]").forEach((b) => b.setAttribute("aria-pressed", String(+b.dataset.size === size)));
    $("#contrastBtn").setAttribute("aria-pressed", String(contrast));
  }
  $$("[data-size]").forEach((b) => b.addEventListener("click", () => { store.set("size", +b.dataset.size); applyReading(); }));
  $("#contrastBtn").addEventListener("click", () => { store.set("contrast", !store.get("contrast", false)); applyReading(); });
  applyReading();

  /* ---------- Design model ---------- */
  let design = Object.assign({}, VARIANTS.classic.config);
  let designVariant = "classic";

  function variantName(cfg, key) {
    if (key && VARIANTS[key] && sameConfig(cfg, VARIANTS[key].config)) return VARIANTS[key].name;
    return (key && VARIANTS[key] ? VARIANTS[key].name : "Aasani") + " (customised)";
  }
  function sameConfig(a, b) { return Object.keys(b).every((k) => a[k] === b[k]); }

  function effort(cfg) {
    const lv = (n) => ["None", "Low", "Moderate", "High"][n];
    const arms = cfg.opening === "full" ? 0 : 1;
    let shoulder = cfg.sleeveWidth === "wide" ? 1 : 2;
    if (cfg.sleeveDetachable === "yes" || (cfg.sleeve === "short" && shoulder > 1)) shoulder -= 1;
    if (cfg.opening === "full" && shoulder > 0 && cfg.sleeveWidth === "wide") shoulder = 1;
    const fingers = { magnetic: 0, hookloop: 1, zip: 2, snaps: 2 }[cfg.closure];
    const bend = cfg.opening === "full" ? 0 : 1;
    return [
      { name: "Lifting arms overhead", n: arms, lvl: lv(arms) },
      { name: "Shoulder movement", n: shoulder, lvl: lv(shoulder) },
      { name: "Finger strength and dexterity", n: fingers, lvl: lv(fingers) },
      { name: "Bending the head and neck", n: bend, lvl: lv(bend) },
      { name: "Reaching behind the back", n: 0, lvl: "None" }
    ];
  }

  function checks(cfg) {
    const out = [];
    out.push({ ok: true, t: "Can be put on while seated", s: cfg.opening === "full" ? "Goes on like a coat over your lap." : "Lean your head forward into the wide opening. No standing needed." });
    out.push({ ok: true, t: "No fastenings at the back", s: "Every fastening is at the front, within easy reach." });
    const grip = { magnetic: [true, "Panels pull together on their own."], hookloop: [true, "Press flat to close, peel to open."], zip: [false, "The ring pull helps, but a zip still needs some grip."], snaps: [false, "Large snaps need a firm press. Choose magnets or soft tape for painful fingers."] }[cfg.closure];
    out.push({ ok: grip[0], t: "Works with weak grip", s: grip[1] });
    const shoulderOk = cfg.opening === "full" && (cfg.sleeveWidth === "wide" || cfg.sleeveDetachable === "yes");
    out.push({ ok: shoulderOk, t: "Very little shoulder movement", s: shoulderOk ? "Full opening and roomy sleeves." : "For stiff shoulders, choose a full opening with wide or detachable sleeves." });
    const magnetic = cfg.closure === "magnetic";
    out.push({ ok: !magnetic, t: "Safe with pacemakers", s: magnetic ? "Magnets are sealed in fabric. With an implanted device, choose snaps, soft tape or a zip." : "No magnets in this design." });
    out.push({ ok: true, t: "Looks like an ordinary kurta", s: "The closures are hidden in the placket and match the fabric." });
    return out;
  }

  function legendItems(cfg) {
    return [
      OPTIONS.opening.choices[cfg.opening].name,
      OPTIONS.closure.choices[cfg.closure].name,
      `${OPTIONS.sleeve.choices[cfg.sleeve].name}, ${OPTIONS.sleeveWidth.choices[cfg.sleeveWidth].name.toLowerCase()}`,
      cfg.sleeveDetachable === "yes" ? "Detachable sleeves" : null,
      cfg.sidePanels === "adjustable" ? "Adjustable side panels" : null,
      `${OPTIONS.neckline.choices[cfg.neckline].name}, ${OPTIONS.length.choices[cfg.length].name.toLowerCase()}`,
      `${COLORS[cfg.color].name} ${OPTIONS.fabric.choices[cfg.fabric].name.toLowerCase()}${cfg.print !== "plain" ? ", " + OPTIONS.print.choices[cfg.print].name.toLowerCase() : ""}`
    ].filter(Boolean);
  }

  /* ---------- Home ---------- */
  $("#heroArt").innerHTML = window.renderKurta(VARIANTS.classic.config, { label: "Aasani Classic kurta with a discreet front opening" });
  $("#principles").innerHTML = PRINCIPLES.map((p, i) => `<li><span class="num" aria-hidden="true">${i + 1}</span><h3>${esc(p.title)}</h3><p>${esc(p.text)}</p></li>`).join("");

  /* ---------- Collection ---------- */
  function renderCollection() {
    $("#collectionCards").innerHTML = Object.entries(VARIANTS).map(([k, v]) => `
      <article class="card">
        <div class="art">${window.renderKurta(v.config, { label: v.name })}</div>
        <h2 style="margin:0 0 .2rem;font-size:1.3rem">${esc(v.name)}</h2>
        <p class="tag">${esc(v.tagline)}</p>
        <p>${esc(v.desc)}</p>
        <p class="best"><strong>Best for:</strong> ${esc(v.bestFor)}</p>
        <div class="btn-row"><a class="btn primary" href="#design" data-load-variant="${k}">Customise</a></div>
      </article>`).join("");
  }
  renderCollection();

  document.addEventListener("click", (e) => {
    const lv = e.target.closest("[data-load-variant]");
    if (lv) { loadDesign(VARIANTS[lv.dataset.loadVariant].config, lv.dataset.loadVariant); }
  });

  /* ---------- Designer ---------- */
  function buildControls() {
    const order = ["opening", "closure", "sleeve", "sleeveWidth", "sleeveDetachable", "sidePanels", "neckline", "length", "fabric", "color", "print", "embroidery"];
    const html = order.map((key) => {
      if (key === "color") {
        return `<fieldset><legend>Colour</legend><p class="help">Traditional colours for everyday wear and occasions.</p><div class="swatches">${Object.entries(COLORS).map(([ck, c]) =>
          `<label class="swatch"><input type="radio" name="color" value="${ck}"><span class="sw" style="background:${c.hex}"></span>${esc(c.name)}</label>`).join("")}</div></fieldset>`;
      }
      const o = OPTIONS[key];
      return `<fieldset><legend>${esc(o.label)}</legend><p class="help">${esc(o.help)}</p><div class="choices">${Object.entries(o.choices).map(([ck, c]) =>
        `<label class="choice"><input type="radio" name="${key}" value="${ck}"><span class="dot" aria-hidden="true"></span><span><span class="c-title">${esc(c.name)}</span>${c.desc ? `<span class="c-desc">${esc(c.desc)}</span>` : ""}</span></label>`).join("")}</div>${key === "closure" ? '<div id="closureNote"></div>' : ""}</fieldset>`;
    }).join("");
    $("#controls").innerHTML = html;
    $("#controls").addEventListener("change", (e) => {
      if (!e.target.name) return;
      design[e.target.name] = e.target.value;
      renderDesign();
    });
    $("#presetRow").innerHTML = Object.entries(VARIANTS).map(([k, v]) => `<button type="button" data-preset="${k}" aria-pressed="false">${esc(v.name.replace("Aasani ", ""))}</button>`).join("");
    $("#presetRow").addEventListener("click", (e) => {
      const b = e.target.closest("[data-preset]");
      if (b) loadDesign(VARIANTS[b.dataset.preset].config, b.dataset.preset);
    });
    const spec = document.createElement("div");
    spec.className = "print-spec";
    spec.id = "printSpec";
    $(".preview-col").appendChild(spec);
  }

  function loadDesign(cfg, variantKey, title) {
    design = Object.assign({}, VARIANTS.classic.config, cfg);
    designVariant = variantKey || "classic";
    $("#designTitle").value = title || "";
    $("#saveStatus").textContent = "";
    renderDesign();
  }

  function renderDesign() {
    Object.entries(design).forEach(([k, v]) => {
      const input = $(`#controls input[name="${k}"][value="${v}"]`);
      if (input) input.checked = true;
    });
    $$("#presetRow [data-preset]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.preset === designVariant && sameConfig(design, VARIANTS[designVariant].config))));
    const name = variantName(design, designVariant);
    $("#designPreview").innerHTML = window.renderKurta(design, { label: "Preview of " + name });
    $("#designName").textContent = name;
    $("#legend").innerHTML = legendItems(design).map((l) => `<span>${esc(l)}</span>`).join("");

    $("#effort").innerHTML = `<h2>Movement needed to dress</h2>` + effort(design).map((m) => `
      <div class="meter"><span>${esc(m.name)}</span><span class="lvl">${m.lvl}</span>
      <span class="bar" aria-hidden="true">${[1, 2, 3].map((i) => `<i class="${i <= m.n ? "on" : ""}"></i>`).join("")}</span></div>`).join("");

    $("#checks").innerHTML = `<h2>Design requirements</h2><ul class="checks">` + checks(design).map((c) => `
      <li class="${c.ok ? "ok" : "warn"}"><span class="ic" aria-hidden="true">${c.ok ? "✓" : "!"}</span><span><strong>${c.ok ? "" : "Check: "}${esc(c.t)}</strong><small>${esc(c.s)}</small></span></li>`).join("") + `</ul>`;

    const note = $("#closureNote");
    if (note) {
      note.innerHTML = design.closure === "magnetic"
        ? `<p class="note"><strong>Pacemaker safety:</strong> magnets are sealed in fabric pockets and never touch the skin. If you have a pacemaker or ICD, choose another fastening or ask your doctor first. Keep magnets at least 15 cm from the device.</p>`
        : "";
    }

    $("#printSpec").innerHTML = `<h2>Tailor's specification – ${esc($("#designTitle").value || name)}</h2><table><tbody>` +
      Object.keys(OPTIONS).map((k) => `<tr><th>${esc(OPTIONS[k].label)}</th><td>${esc(OPTIONS[k].choices[design[k]].name)}${OPTIONS[k].choices[design[k]].desc ? " – " + esc(OPTIONS[k].choices[design[k]].desc) : ""}</td></tr>`).join("") +
      `<tr><th>Colour</th><td>${esc(COLORS[design.color].name)} (${COLORS[design.color].hex})</td></tr>` +
      `<tr><th>Construction notes</th><td>Enclose all magnets and hard parts in fabric. Never place a fastening at the back. Add 8–10 cm ease at the shoulders, chest, waist and hips. Keep seams flat at the shoulders and back to avoid pressure points.</td></tr></tbody></table>`;
  }

  $("#saveBtn").addEventListener("click", () => {
    const list = store.get("saved", []);
    const title = $("#designTitle").value.trim() || variantName(design, designVariant);
    list.unshift({ id: Date.now(), title, variant: designVariant, config: Object.assign({}, design), at: new Date().toISOString() });
    const ok = store.set("saved", list.slice(0, 50));
    $("#saveStatus").textContent = ok ? `Saved "${title}". Find it under Saved.` : "Sorry, this browser won't let us save. Try printing the spec sheet instead.";
    updateSavedCount();
  });
  $("#printBtn").addEventListener("click", () => window.print());

  buildControls();
  renderDesign();

  /* ---------- Saved ---------- */
  function updateSavedCount() {
    const n = store.get("saved", []).length;
    const el = $("#savedCount");
    el.hidden = n === 0;
    el.textContent = n;
  }
  function renderSaved() {
    const list = store.get("saved", []);
    if (!list.length) {
      $("#savedCards").innerHTML = `<div class="empty"><p>No saved designs yet.</p><a class="btn primary" href="#design">Design a kurta</a></div>`;
      return;
    }
    $("#savedCards").innerHTML = list.map((d) => `
      <article class="card">
        <div class="art">${window.renderKurta(d.config, { label: d.title })}</div>
        <h2 style="margin:0 0 .2rem;font-size:1.2rem">${esc(d.title)}</h2>
        <p class="best">${esc(legendItems(d.config).slice(0, 3).join(" · "))}</p>
        <div class="btn-row"><a class="btn primary" href="#design" data-open-saved="${d.id}">Open</a><button class="btn" type="button" data-delete-saved="${d.id}">Delete</button></div>
      </article>`).join("");
  }
  $("#savedCards").addEventListener("click", (e) => {
    const o = e.target.closest("[data-open-saved]");
    const del = e.target.closest("[data-delete-saved]");
    const list = store.get("saved", []);
    if (o) {
      const d = list.find((x) => String(x.id) === o.dataset.openSaved);
      if (d) loadDesign(d.config, d.variant, d.title);
    } else if (del) {
      const d = list.find((x) => String(x.id) === del.dataset.deleteSaved);
      if (d && confirm(`Delete "${d.title}"?`)) {
        store.set("saved", list.filter((x) => x !== d));
        renderSaved();
        updateSavedCount();
      }
    }
  });
  updateSavedCount();

  /* ---------- Fit Finder ---------- */
  let qi = 0;
  let answers = {};

  function recommend(a) {
    const reasons = [];
    const shoulders = a.difficulty === "shoulders" || a.difficulty === "both";
    const hands = a.difficulty === "hands" || a.difficulty === "both";
    const device = a.device === "yes" || a.device === "unsure";

    let key;
    if (a.occasion === "gatherings") key = "occasion";
    else if (shoulders || a.help === "always") key = "ease";
    else if (a.shape === "yes") key = "flex";
    else key = "classic";
    const cfg = Object.assign({}, VARIANTS[key].config);

    if (shoulders || a.help === "always") {
      cfg.opening = "full";
      cfg.sleeveWidth = "wide";
      reasons.push("<strong>Full front opening and wide sleeves.</strong> The kurta goes on like a coat, so your arms never go overhead and your shoulders barely rotate.");
      if (cfg.sleeve === "full" && a.occasion !== "gatherings") cfg.sleeve = "threequarter";
    } else if (a.difficulty === "general") {
      reasons.push("<strong>A wide, discreet front opening.</strong> Easier than a regular kurta, and it looks just like one.");
    }

    if (shoulders && a.help !== "none") {
      cfg.sleeveDetachable = "yes";
      reasons.push("<strong>Detachable sleeves.</strong> The person helping you can put the body on first, then attach each sleeve without moving your arm much.");
    }

    if (device) {
      cfg.closure = hands ? "hookloop" : "snaps";
      reasons.push(hands
        ? "<strong>Soft hook-and-loop instead of magnets.</strong> It's safe with implanted devices and needs no pinching. Press it flat to close."
        : "<strong>Large snaps instead of magnets.</strong> They're safe with pacemakers and implanted devices.");
      if (a.device === "unsure") reasons.push("You weren't sure about an implanted device, so we left out magnets. Ask your doctor if you'd like magnetic closures.");
    } else if (hands || shoulders || a.help !== "none") {
      cfg.closure = "magnetic";
      reasons.push(`<strong>Concealed magnetic closures.</strong> The panels pull together on their own${hands ? ", so painful finger joints don't need to grip or pinch" : ""}.`);
    }

    if (a.shape === "yes") {
      cfg.sidePanels = "adjustable";
      reasons.push("<strong>Adjustable side panels.</strong> Make it roomier or closer-fitting as your comfort changes, without visiting a tailor.");
    }

    if (a.seated === "yes") {
      if (a.occasion !== "gatherings") cfg.length = "standard";
      reasons.push(a.occasion === "gatherings"
        ? "<strong>A detachable hem extension.</strong> Wear it long for events, and remove it for daily wear so the kurta doesn't bunch when you sit."
        : "<strong>Knee length with side slits.</strong> It won't bunch or pull when you dress sitting down.");
    }

    if (a.help === "always" || a.help === "sometimes") {
      reasons.push("Every fastening is at the front, so a caregiver can help face-to-face. See the caregiver tips in the dressing guide.");
    }

    if (a.occasion === "gatherings") {
      reasons.push("<strong>Occasion styling.</strong> Embroidery and rich colours, with every adaptive feature hidden in the design.");
    }

    return { key, cfg, reasons };
  }

  function renderQuiz() {
    const box = $("#quiz");
    if (qi >= QUIZ.length) return renderResult();
    const q = QUIZ[qi];
    box.innerHTML = `
      <div class="progress" aria-hidden="true"><span style="width:${(qi / QUIZ.length) * 100}%"></span></div>
      <p class="q-count">Question ${qi + 1} of ${QUIZ.length}</p>
      <form id="qForm">
        <fieldset>
          <legend>${esc(q.q)}</legend>
          ${q.sub ? `<p class="help" style="color:var(--muted)">${esc(q.sub)}</p>` : ""}
          <div class="choices">
            ${q.options.map((o) => `<label class="choice"><input type="radio" name="a" value="${o.v}" ${answers[q.id] === o.v ? "checked" : ""}><span class="dot" aria-hidden="true"></span><span class="c-title">${esc(o.label)}</span></label>`).join("")}
          </div>
        </fieldset>
        <div class="quiz-nav">
          <button type="button" class="btn" id="qBack" ${qi === 0 ? "disabled" : ""}>Back</button>
          <button type="submit" class="btn primary" id="qNext">${qi === QUIZ.length - 1 ? "See my kurta" : "Next"}</button>
        </div>
        <p class="status" id="qErr" role="alert" style="color:var(--primary)"></p>
      </form>`;
    $("#qBack").addEventListener("click", () => { qi = Math.max(0, qi - 1); renderQuiz(); focusQuiz(); });
    $("#qForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const v = ($("#qForm input:checked") || {}).value;
      if (!v) { $("#qErr").textContent = "Please choose an answer to continue."; return; }
      answers[q.id] = v;
      qi++;
      renderQuiz();
      focusQuiz();
    });
  }
  function focusQuiz() { const l = $("#quiz legend, #quiz h2"); if (l) { l.setAttribute("tabindex", "-1"); l.focus(); } }

  function renderResult() {
    const r = recommend(answers);
    const v = VARIANTS[r.key];
    $("#quiz").innerHTML = `
      <div class="progress" aria-hidden="true"><span style="width:100%"></span></div>
      <h2>We recommend: ${esc(v.name)}</h2>
      <div class="result">
        <div class="preview-card">${window.renderKurta(r.cfg, { label: "Recommended " + v.name })}</div>
        <div>
          <p class="lead">${esc(v.desc)}</p>
          <h3>Why this suits you</h3>
          <ul class="reasons">${r.reasons.map((x) => `<li>${x}</li>`).join("")}</ul>
          <div class="btn-row">
            <a class="btn primary" href="#design" id="customiseRec">Customise this kurta</a>
            <a class="btn" href="#guide">How to put it on</a>
            <button class="btn" type="button" id="restartQuiz">Start again</button>
          </div>
        </div>
      </div>`;
    $("#customiseRec").addEventListener("click", () => loadDesign(r.cfg, r.key));
    $("#restartQuiz").addEventListener("click", () => { qi = 0; answers = {}; renderQuiz(); focusQuiz(); });
  }
  renderQuiz();

  /* ---------- Guide ---------- */
  function renderGuide(tab) {
    $$(".tabs [role=tab]").forEach((b) => {
      const sel = b.dataset.tab === tab;
      b.setAttribute("aria-selected", String(sel));
      b.tabIndex = sel ? 0 : -1;
    });
    $("#guidePanel").setAttribute("aria-labelledby", "tab-" + tab);
    $("#guidePanel").innerHTML = `<ol class="steps">${DRESSING_STEPS[tab].map((s) => `<li><span>${esc(s)}</span></li>`).join("")}</ol>`;
  }
  $(".tabs").addEventListener("click", (e) => { const b = e.target.closest("[data-tab]"); if (b) renderGuide(b.dataset.tab); });
  $(".tabs").addEventListener("keydown", (e) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const tabs = $$(".tabs [role=tab]");
    const i = tabs.indexOf(document.activeElement);
    const n = tabs[(i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length];
    n.focus(); renderGuide(n.dataset.tab);
  });
  renderGuide("full");

  /* ---------- Router ---------- */
  function route() {
    const view = (location.hash || "#home").slice(1).split("?")[0] || "home";
    const valid = $$("[data-view]").map((s) => s.dataset.view);
    const v = valid.includes(view) ? view : "home";
    $$("[data-view]").forEach((s) => { s.hidden = s.dataset.view !== v; });
    $$(".main-nav a").forEach((a) => {
      if (a.getAttribute("href") === "#" + v) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    if (v === "saved") renderSaved();
    const titles = { home: "Aasani – Adaptive Everyday Wear", finder: "Find my fit – Aasani", design: "Design your kurta – Aasani", collection: "Collection – Aasani", guide: "Dressing guide – Aasani", saved: "Saved designs – Aasani" };
    document.title = titles[v];
    window.scrollTo(0, 0);
    const h = $(`[data-view="${v}"] h1`);
    if (h && route.ran) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); }
    route.ran = true;
  }
  window.addEventListener("hashchange", route);
  route();
})();
