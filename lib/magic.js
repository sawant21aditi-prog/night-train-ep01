// The Night Train — "drawn light" kit: banded skies, long grain lines, stipple, glowing rings and ticks,
// sparkles and lens reflections. Fine lines, many marks. Needs core.js + night.js.
const MG = (() => {
  const { line, hatch, bbox } = NT;

  // horizontal colour bands, each filled with thin wavy grain lines (the striped sky of the reference work)
  function bands(c, R, cols, t = 0, o = {}) {
    const { seed = 3, lines = 7, wave = 6, al = .35, ink = '#ffffff' } = o, [x, y, w, h] = R, bh = h / cols.length;
    cols.forEach((col, i) => {
      const y0 = y + i * bh; c.fillStyle = col; c.fillRect(x, y0 - 1, w, bh + 2);
      c.save(); c.strokeStyle = alpha(i < cols.length / 2 ? ink : '#2a0f20', al * (.4 + .6 * hash(i, seed))); c.lineWidth = 1.1; c.beginPath();
      for (let k = 0; k < lines; k++) { const yy = y0 + (k + .5) * bh / lines, ph = hash(k + i * 31, seed) * TAU; for (let s = 0; s <= 48; s++) { const xx = x + s / 48 * w, d = Math.sin(s * .35 + ph + t * .15) * wave * .3 + noise1(s * .2 + k, seed + i) * wave; s ? c.lineTo(xx, yy + d) : c.moveTo(xx, yy + d); } }
      c.stroke(); c.restore();
    });
  }
  // long contour/grain lines through a shape, following an angle (wood, hills, skin planes)
  function grain(c, pts, o = {}) {
    const { gap = 9, angle = 0, color = '#2a2420', al = .45, w = 1, seed = 2, wave = 5, t = 0 } = o, [bx, by, bw, bh] = bbox(pts), R = Math.hypot(bw, bh) / 2 + 10, cx = bx + bw / 2, cy = by + bh / 2, ca = Math.cos(angle), sa = Math.sin(angle);
    c.save(); c.clip(polyPath(pts)); c.strokeStyle = color; c.globalAlpha *= al; c.lineWidth = w; c.beginPath();
    for (let v = -R, k = 0; v <= R; v += gap, k++) for (let s = 0; s <= 40; s++) { const u = -R + s / 40 * 2 * R, d = noise1(s * .25 + k * .7, seed + NT.boil(t)) * wave, px = cx + ca * u - sa * (v + d), py = cy + sa * u + ca * (v + d); s ? c.lineTo(px, py) : c.moveTo(px, py); }
    c.stroke(); c.restore();
  }
  // stipple: seeded dots inside a shape; density(x,y) 0..1. glow=true makes each dot a little light
  function stipple(c, pts, o = {}) {
    const { n = 900, color = '#ffffff', size = 2.2, seed = 5, density = () => 1, glow: lit = false, al = 1, t = 0 } = o, [bx, by, bw, bh] = bbox(pts), path = polyPath(pts), r = rng(seed);
    c.save(); c.clip(path); c.fillStyle = color;
    for (let i = 0; i < n; i++) { const x = bx + r() * bw, y = by + r() * bh, d = density(x, y), tw = .6 + .4 * Math.sin(t * 2 + i); if (r() > d) continue; const s = size * (.5 + r() * .8); c.globalAlpha = al * (lit ? tw : 1); c.beginPath(); c.arc(x, y, s, 0, TAU); c.fill(); if (lit && s > size * .95) glow(c, x, y, s * 6, color, .35 * tw * al); }
    c.restore();
  }
  // glowing concentric rings that slowly breathe outward
  function rings(c, x, y, o = {}) {
    const { r0 = 40, gap = 26, n = 7, color = '#ffe0a0', al = .7, t = 0, w = 1.6, speed = 6 } = o;
    c.save(); c.globalCompositeOperation = 'screen'; c.strokeStyle = color; c.lineWidth = w;
    for (let i = 0; i < n; i++) { const r = r0 + i * gap + ((t * speed) % gap), k = al * (1 - r / (r0 + n * gap)); if (k <= 0) continue; c.globalAlpha = k; c.beginPath(); c.arc(x, y, r, 0, TAU); c.stroke(); }
    c.restore();
  }
  // radial tick rays around a light (the sun-with-ticks motif)
  function ticks(c, x, y, o = {}) {
    const { r1 = 60, r2 = 110, n = 36, color = '#ffd27a', al = .8, w = 1.6, t = 0, seed = 7 } = o;
    c.save(); c.strokeStyle = color; c.lineWidth = w; c.lineCap = 'round'; c.beginPath();
    for (let i = 0; i < n; i++) { const a = i / n * TAU + t * .02, L = r1 + (r2 - r1) * (i % 3 === 0 ? 1 : .55 + .2 * hash(i, seed)); c.moveTo(x + Math.cos(a) * r1, y + Math.sin(a) * r1); c.lineTo(x + Math.cos(a) * L, y + Math.sin(a) * L); }
    c.globalAlpha = al; c.stroke(); c.restore();
  }
  // four-point sparkle star
  function sparkle(c, x, y, s, color = '#fff6dc', al = 1) {
    if (al <= 0) return; c.save(); c.globalAlpha = al; c.fillStyle = color; c.beginPath();
    c.moveTo(x, y - s); c.quadraticCurveTo(x, y, x + s, y); c.quadraticCurveTo(x, y, x, y + s); c.quadraticCurveTo(x, y, x - s, y); c.quadraticCurveTo(x, y, x, y - s); c.fill(); c.restore(); glow(c, x, y, s * 3, color, .45 * al);
  }
  function sparkles(c, R, t, o = {}) {
    const { n = 40, seed = 21, size = 7, color = '#fff6dc' } = o, r = rng(seed), [x, y, w, h] = R;
    for (let i = 0; i < n; i++) { const px = x + r() * w, py = y + r() * h, ph = r() * TAU, sp = 1 + r() * 2.5, tw = Math.pow(Math.max(0, Math.sin(t * sp + ph)), 3); sparkle(c, px, py, size * (.4 + r()) * (.4 + tw), color, .25 + .75 * tw); }
  }
  // curling steam: thin rising wisps, seek-safe
  function steam(c, x, y, t, o = {}) {
    const { n = 3, h = 220, color = '#fff2dc', al = .55, seed = 9 } = o;
    c.save(); c.strokeStyle = color; c.lineWidth = 2; c.lineCap = 'round';
    for (let k = 0; k < n; k++) { c.beginPath(); for (let s = 0; s <= 30; s++) { const u = s / 30, yy = y - u * h, xx = x + (k - 1) * 18 + Math.sin(u * 7 + t * 1.6 + k * 2) * 14 * u + noise1(u * 4 + t * .5, seed + k) * 10; s ? c.lineTo(xx, yy) : c.moveTo(xx, yy); } c.globalAlpha = al * .8; c.stroke(); }
    c.restore();
  }
  return { bands, grain, stipple, rings, ticks, sparkle, sparkles, steam };
})();
