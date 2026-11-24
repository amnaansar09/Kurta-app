/* Draws a front-view flat sketch of a modular kurta from a config object. */
window.renderKurta = (function () {
  const INK = "#3b2a20";

  function shade(hex, amt) {
    const n = parseInt(hex.slice(1), 16);
    let r = (n >> 16) + amt, g = ((n >> 8) & 255) + amt, b = (n & 255) + amt;
    r = Math.max(0, Math.min(255, r)); g = Math.max(0, Math.min(255, g)); b = Math.max(0, Math.min(255, b));
    return "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
  }

  function pt(p) { return p[0].toFixed(1) + "," + p[1].toFixed(1); }

  function patternDefs(id, cfg, base, accent) {
    const bg = `<rect width="100%" height="100%" fill="${base}"/>`;
    let motif = "";
    let size = 24;
    if (cfg.print === "block") {
      motif = `<g fill="${accent}" opacity="0.75"><circle cx="12" cy="12" r="2.4"/><ellipse cx="12" cy="6.5" rx="1.6" ry="2.6"/><ellipse cx="12" cy="17.5" rx="1.6" ry="2.6"/><ellipse cx="6.5" cy="12" rx="2.6" ry="1.6"/><ellipse cx="17.5" cy="12" rx="2.6" ry="1.6"/></g>`;
    } else if (cfg.print === "floral") {
      size = 32;
      motif = `<g opacity="0.7"><circle cx="9" cy="9" r="4.5" fill="${accent}"/><circle cx="9" cy="9" r="1.8" fill="${shade(base, -40)}"/><circle cx="25" cy="25" r="3.5" fill="${accent}"/><circle cx="25" cy="25" r="1.4" fill="${shade(base, -40)}"/><path d="M14 20 q4 -4 8 0" stroke="${accent}" stroke-width="1.4" fill="none"/></g>`;
    } else if (cfg.print === "stripe") {
      size = 12;
      motif = `<rect x="5" y="0" width="2" height="12" fill="${accent}" opacity="0.55"/>`;
    }
    return `<pattern id="${id}" width="${size}" height="${size}" patternUnits="userSpaceOnUse">${bg}${motif}</pattern>`;
  }

  return function renderKurta(cfg, opts) {
    opts = opts || {};
    const C = window.AASANI.COLORS[cfg.color] || window.AASANI.COLORS.firozi;
    const uid = "k" + Math.random().toString(36).slice(2, 8);
    const base = C.hex;
    const accent = C.accent;
    const panelFill = shade(base, -22);
    const fillId = uid + "-fill";

    const wide = cfg.sleeveWidth === "wide";
    const ay = wide ? 150 : 128; // armhole depth
    const hemY = 360;
    const longY = 402;
    const isLong = cfg.length === "long";
    const bottomY = isLong ? longY : hemY;

    // Neck & shoulders
    const nl = [136, 42], nr = [184, 42];
    const sl = [102, 54], sr = [218, 54];
    const al = [98, ay], ar = [222, ay];
    const hl = [76, hemY], hr = [244, hemY];

    let neckPath, neckY;
    if (cfg.neckline === "v") { neckPath = `L160,96 L${pt(nl)}`; neckY = 96; }
    else if (cfg.neckline === "band") { neckPath = `Q160,62 ${pt(nl)}`; neckY = 52; }
    else { neckPath = `Q160,74 ${pt(nl)}`; neckY = 58; }

    // Sleeves
    const lens = { short: 72, threequarter: 152, full: 220 };
    const L = lens[cfg.sleeve] || 152;
    const dx = wide ? -0.42 : -0.3;
    const dl = Math.hypot(dx, 1);
    const d = [dx / dl, 1 / dl];
    const perp = [d[1], -d[0]];
    const cuff = wide ? 50 : 36;
    const S = sl;
    const O = [S[0] + d[0] * L, S[1] + d[1] * L];
    const I = [O[0] + perp[0] * cuff, O[1] + perp[1] * cuff];
    const leftSleeve = `M${pt(S)} L${pt(O)} L${pt(I)} L${pt(al)} Z`;
    const mirror = (p) => [320 - p[0], p[1]];

    let out = [];
    out.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 ${isLong ? 430 : 390}" role="img" aria-label="${opts.label || "Kurta preview"}" class="kurta-svg">`);
    out.push(`<defs>${patternDefs(fillId, cfg, base, accent)}
      <pattern id="${uid}-hl" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="${shade(base, -10)}"/><path d="M0 3h6M3 0v6" stroke="${shade(base, -45)}" stroke-width="0.8"/></pattern>
      <pattern id="${uid}-emb" width="14" height="14" patternUnits="userSpaceOnUse"><rect width="14" height="14" fill="${shade(base, -30)}"/><circle cx="7" cy="7" r="3" fill="none" stroke="${accent}" stroke-width="1.4"/><circle cx="7" cy="7" r="1" fill="${accent}"/></pattern>
    </defs>`);

    const stroke = `stroke="${INK}" stroke-width="2" stroke-linejoin="round"`;

    // Sleeves behind body
    [leftSleeve, `M${pt(mirror(S))} L${pt(mirror(O))} L${pt(mirror(I))} L${pt(ar)} Z`].forEach((p) => {
      out.push(`<path d="${p}" fill="url(#${fillId})" ${stroke}/>`);
    });
    // Cuff hem line / embroidery
    [[O, I, d], [mirror(O), mirror(I), [-d[0], d[1]]]].forEach(([a, b, ad]) => {
      const a3 = [a[0] - ad[0] * 12, a[1] - ad[1] * 12];
      const b3 = [b[0] - ad[0] * 12, b[1] - ad[1] * 12];
      if (cfg.embroidery === "yes") {
        out.push(`<path d="M${pt(a)} L${pt(b)} L${pt(b3)} L${pt(a3)} Z" fill="url(#${uid}-emb)" ${stroke}/>`);
      } else {
        out.push(`<path d="M${pt(a3)} L${pt(b3)}" stroke="${INK}" stroke-width="1.2" stroke-dasharray="3 3" fill="none"/>`);
      }
    });

    // Body
    const bodyPath = `M${pt(nl)} L${pt(sl)} L${pt(al)} L${pt(hl)} L${pt(hr)} L${pt(ar)} L${pt(sr)} L${pt(nr)} ${neckPath} Z`;
    out.push(`<path d="${bodyPath}" fill="url(#${fillId})" ${stroke}/>`);

    // Inside back neck (visible through neckline)
    if (cfg.neckline === "band") {
      out.push(`<path d="M134,42 L134,32 Q160,26 186,32 L186,42 Q160,62 134,42 Z" fill="${shade(base, -12)}" ${stroke}/>`);
    } else {
      out.push(`<path d="M${pt(nl)} Q160,48 ${pt(nr)}" fill="none" stroke="${INK}" stroke-width="1.5"/>`);
    }

    // Detachable sleeve seam
    if (cfg.sleeveDetachable === "yes") {
      [[sl, al], [sr, ar]].forEach(([s, a]) => {
        out.push(`<path d="M${pt(s)} Q${s[0] < 160 ? s[0] + 10 : s[0] - 10},${(s[1] + a[1]) / 2} ${pt(a)}" fill="none" stroke="${accent}" stroke-width="3" stroke-dasharray="6 4"/>`);
        const mid = [(s[0] + a[0]) / 2 + (s[0] < 160 ? 5 : -5), (s[1] + a[1]) / 2];
        out.push(`<circle cx="${mid[0]}" cy="${mid[1] - 18}" r="5" fill="#fff" ${stroke}/><circle cx="${mid[0]}" cy="${mid[1] + 18}" r="5" fill="#fff" ${stroke}/>`);
      });
    }

    // Adjustable side panels
    if (cfg.sidePanels === "adjustable") {
      const top = ay + 12;
      const lp = `M${pt([al[0] + 0.1, top])} L${al[0] + 18},${top} L${hl[0] + 22},${hemY} L${pt(hl)} Z`;
      const rp = `M${pt([ar[0], top])} L${ar[0] - 18},${top} L${hr[0] - 22},${hemY} L${pt(hr)} Z`;
      [lp, rp].forEach((p) => out.push(`<path d="${p}" fill="${panelFill}" fill-opacity="0.85" ${stroke}/>`));
      // adjustment tabs
      [0.25, 0.55, 0.85].forEach((t) => {
        const y = top + (hemY - top) * t;
        const xl = al[0] + (hl[0] - al[0]) * ((y - ay) / (hemY - ay));
        const xr = 320 - xl;
        out.push(`<rect x="${xl + 12}" y="${y - 6}" width="16" height="12" rx="4" fill="${accent}" ${stroke}/>`);
        out.push(`<rect x="${xr - 28}" y="${y - 6}" width="16" height="12" rx="4" fill="${accent}" ${stroke}/>`);
      });
    }

    // Long extension band
    if (isLong) {
      out.push(`<path d="M${pt(hl)} L72,${longY} L248,${longY} L${pt(hr)} Z" fill="url(#${cfg.embroidery === "yes" ? uid + "-emb" : fillId})" ${stroke}/>`);
      out.push(`<path d="M${pt(hl)} L${pt(hr)}" stroke="${accent}" stroke-width="3" stroke-dasharray="6 4"/>`);
    } else if (cfg.embroidery === "yes") {
      out.push(`<path d="M${hl[0] + 1.5},${hemY - 22} L${hr[0] - 1.5},${hemY - 22} L${pt(hr)} L${pt(hl)} Z" fill="url(#${uid}-emb)" ${stroke}/>`);
    }

    // Neckline embroidery
    if (cfg.embroidery === "yes" && cfg.neckline !== "band") {
      const ctrlY = cfg.neckline === "v" ? null : 74;
      if (ctrlY) out.push(`<path d="M${pt(nr)} Q160,${ctrlY} ${pt(nl)}" fill="none" stroke="${accent}" stroke-width="7" stroke-dasharray="2 4" stroke-linecap="round"/>`);
      else out.push(`<path d="M${pt(nr)} L160,96 L${pt(nl)}" fill="none" stroke="${accent}" stroke-width="7" stroke-dasharray="2 4" stroke-linecap="round"/>`);
    }

    // Front opening + placket
    const openEnd = cfg.opening === "full" ? bottomY : 220;
    const pw = cfg.closure === "hookloop" ? 9 : 7;
    out.push(`<rect x="${160 - pw}" y="${neckY}" width="${pw * 2}" height="${openEnd - neckY}" fill="${cfg.closure === "hookloop" ? `url(#${uid}-hl)` : shade(base, -8)}" ${stroke} stroke-width="1.5"/>`);
    out.push(`<line x1="160" y1="${neckY}" x2="160" y2="${openEnd}" stroke="${INK}" stroke-width="2"/>`);
    if (cfg.opening === "partial") {
      out.push(`<path d="M${160 - pw},${openEnd} L160,${openEnd + 8} L${160 + pw},${openEnd}" fill="none" stroke="${INK}" stroke-width="1.5"/>`);
    }

    // Closures
    const span = openEnd - neckY - 20;
    const n = Math.max(2, Math.round(span / 34));
    const ys = [];
    for (let i = 0; i < n; i++) ys.push(neckY + 14 + (span * i) / (n - 1));
    if (cfg.closure === "magnetic") {
      ys.forEach((y) => out.push(`<circle cx="160" cy="${y}" r="4.5" fill="none" stroke="${INK}" stroke-width="1.2" stroke-dasharray="2 2"/>`));
    } else if (cfg.closure === "snaps") {
      ys.forEach((y) => out.push(`<circle cx="160" cy="${y}" r="7.5" fill="${accent}" ${stroke} stroke-width="1.5"/><circle cx="160" cy="${y}" r="2.5" fill="${INK}"/>`));
    } else if (cfg.closure === "zip") {
      for (let y = neckY + 4; y < openEnd - 2; y += 5) out.push(`<line x1="157" y1="${y}" x2="163" y2="${y}" stroke="${INK}" stroke-width="1"/>`);
      out.push(`<line x1="160" y1="${neckY + 4}" x2="160" y2="${neckY + 18}" stroke="${INK}" stroke-width="2"/><circle cx="160" cy="${neckY + 26}" r="8" fill="none" stroke="${accent}" stroke-width="3.5"/><circle cx="160" cy="${neckY + 26}" r="8" fill="none" stroke="${INK}" stroke-width="1"/>`);
    }

    // Side slits at hem
    out.push(`<path d="M${hl[0] + 1.5},${hemY - 34} L${hl[0] + 0.5},${hemY}" stroke="${INK}" stroke-width="1.2" fill="none"/>`);
    out.push(`<path d="M${hr[0] - 1.5},${hemY - 34} L${hr[0] - 0.5},${hemY}" stroke="${INK}" stroke-width="1.2" fill="none"/>`);

    out.push(`</svg>`);
    return out.join("");
  };
})();
