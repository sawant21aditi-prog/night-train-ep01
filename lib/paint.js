// The Night Train — code painting: brushed skies and clouds, stroke grass, canvas texture,
// waving light ribbons and crumpled-paper transitions. Seeded and seek-safe. Load after anime.js.
const PT = (() => {
  // ---------- painted clouds: many soft brush dabs, lit on top, cool underneath ----------
  const _cs = {};
  function cloud(c, x, y, w, t, o = {}) {
    const { seed = 1, al = .9, drift = 10 } = o, dx = Math.sin(t * .06 + seed) * drift, key = seed + ':' + Math.round(w);
    let sp = _cs[key];
    if (!sp) {   // paint the cloud once, centred in its own sprite
      const pw = Math.ceil(w * 1.6), ph = Math.ceil(w * .7); sp = _cs[key] = Object.assign(document.createElement('canvas'), { width: pw, height: ph });
      const g = sp.getContext('2d'); g.translate(pw / 2, ph * .62); paintCloud(g, 0, 0, w, 0, { ...o, al: 1, drift: 0 });
    }
    c.save(); c.globalAlpha *= al; c.drawImage(sp, x + dx - sp.width / 2, y - sp.height * .62); c.restore();
  }
  function paintCloud(c, x, y, w, t, o = {}) {
    const { seed = 1, al = .9, lit = '#ffe2c0', body = '#7a7ab8', shade = '#3a3a78', drift = 10 } = o, r = rng(seed), dx = Math.sin(t * .06 + seed) * drift;
    c.save(); c.globalAlpha *= al;
    for (let pass = 0; pass < 3; pass++) {   // shadow base, body, lit crown
      const col = [shade, body, lit][pass], n = [14, 22, 16][pass];
      c.filter = `blur(${[10, 6, 3][pass]}px)`; c.fillStyle = col;
      for (let i = 0; i < n; i++) {
        const u = r(), px = x + dx + (u - .5) * w, hump = Math.sin(u * Math.PI), py = y - hump * w * .16 * (pass === 2 ? 1.05 : 1) + (pass === 0 ? w * .05 : 0) - pass * w * .02 + (r() - .5) * 20;
        const rx = w * (.07 + r() * .07) * (pass === 2 ? .8 : 1), ry = rx * (.45 + r() * .3);
        c.globalAlpha = al * (pass === 2 ? .55 : .85); c.beginPath(); c.ellipse(px, py, rx, ry, (r() - .5) * .4, 0, TAU); c.fill();
      }
    }
    c.filter = 'none'; c.restore();
  }
  // a brushed sky band: the flat gradient broken up by long soft horizontal strokes
  const _bs = {};
  function brushSky(c, R, t, o = {}) {
    const key = R.map(Math.round).join(',') + ':' + (o.seed || 3);
    let sp = _bs[key];
    if (!sp) { sp = _bs[key] = Object.assign(document.createElement('canvas'), { width: Math.ceil(R[2]), height: Math.ceil(R[3]) }); const g = sp.getContext('2d'); g.translate(-R[0], -R[1]); paintSky(g, R, 0, o); }
    c.drawImage(sp, R[0] + Math.sin(t * .05) * 8, R[1]);   // painted once, drifts slowly
  }
  function paintSky(c, R, t, o = {}) {
    const { seed = 3, tint = '#ffffff', al = .07 } = o, [x, y, w, h] = R, r = rng(seed);
    c.save(); c.beginPath(); c.rect(x, y, w, h); c.clip(); c.filter = 'blur(4px)';
    for (let i = 0; i < 40; i++) { const yy = y + r() * h, xx = x + r() * w - 200 + Math.sin(t * .05 + i) * 20, ww = 200 + r() * 500; c.globalAlpha = al * (.4 + r()); c.fillStyle = r() > .5 ? tint : '#000020'; c.beginPath(); c.ellipse(xx, yy, ww, 3 + r() * 8, 0, 0, TAU); c.fill(); }
    c.filter = 'none'; c.restore();
  }
  // ---------- stroke grass: tapered blades, colour-varied, swaying in the wind ----------
  function grass(c, R, t, o = {}) {
    const { seed = 7, cols = ['#2f4a3a', '#3e6a4a', '#5a8a5a', '#8ab070'], n = 900, h0 = 46, wind = 1 } = o, [x, y, w, h] = R, r = rng(seed);
    c.save(); c.lineCap = 'round';
    for (let i = 0; i < n; i++) {
      const bx = x + r() * w, by = y + Math.pow(r(), .7) * h, depth = (by - y) / h, len = h0 * (.5 + r()) * (.5 + depth), sway = Math.sin(t * 1.6 + bx * .01) * 10 * wind * (.5 + r() * .5);
      c.strokeStyle = cols[Math.min(cols.length - 1, Math.floor(r() * cols.length * (.6 + depth * .5)))]; c.lineWidth = 2 + depth * 3; c.globalAlpha = .7 + depth * .3;
      c.beginPath(); c.moveTo(bx, by); c.quadraticCurveTo(bx + sway * .4, by - len * .5, bx + sway, by - len); c.stroke();
    }
    c.restore();
  }
  // ---------- canvas texture over the whole frame (one cached layer) ----------
  let _tex = null;
  function texture(c, k = .16) {
    if (!_tex) { _tex = layer(); const g = _tex.getContext('2d'), r = rng(99); resetT(g); g.fillStyle = '#808080'; g.fillRect(0, 0, W, H);
      for (let i = 0; i < 9000; i++) { const x = r() * W, y = r() * H, v = 110 + r() * 50; g.fillStyle = `rgb(${v},${v},${v})`; g.globalAlpha = .35; g.fillRect(x, y, 1 + r() * 3, 1 + r() * 2); }
      g.globalAlpha = .12; g.strokeStyle = '#606060'; g.lineWidth = 1; for (let y = 0; y < H; y += 3) { g.beginPath(); g.moveTo(0, y + r()); g.lineTo(W, y + r()); g.stroke(); } }
    resetT(c); c.save(); c.globalCompositeOperation = 'overlay'; c.globalAlpha = k; c.drawImage(_tex, 0, 0, W, H); c.restore();
  }
  // ---------- waving ribbons of light (flag-like, tapered, overlapping folds) ----------
  function ribbons(c, t, o = {}) {
    const { n = 5, seed = 5, col = '#fff2dc', al = .85, y0 = 300, spread = 500, speed = 1 } = o, r = rng(seed);
    c.save(); c.globalCompositeOperation = 'screen';
    for (let k = 0; k < n; k++) {
      const yb = y0 + (r() - .5) * spread, amp = 40 + r() * 70, wl = 300 + r() * 300, ph = r() * TAU, wid = 14 + r() * 22, off = (t * 160 * speed * (.6 + r() * .6) + r() * W) % (W + 800) - 400;
      const top = [], bot = [];
      for (let i = 0; i <= 50; i++) { const u = i / 50, x = off - 900 + u * 900, y = yb + Math.sin(x / wl * TAU + t * 2 + ph) * amp * u, tw = Math.cos(x / (wl * .5) + t * 3 + ph), wd = wid * u * (.3 + .7 * Math.abs(tw)); top.push([x, y - wd]); bot.push([x, y + wd]); }
      c.globalAlpha = al * (.5 + r() * .5); c.fillStyle = col; c.beginPath(); top.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); bot.reverse().forEach(([x, y]) => c.lineTo(x, y)); c.closePath(); c.fill();
      glow(c, top[50][0], top[50][1], 60, col, .4 * al);
    }
    c.restore();
  }
  // ---------- crumpled-paper wipe: a sheet sweeps across the cut (u 0..1 over ~0.7s) ----------
  let _paper = null;
  function paperSheet() {
    if (_paper) return _paper; _paper = layer(); const g = _paper.getContext('2d'), r = rng(42); resetT(g);
    g.fillStyle = '#f0e6d6'; g.fillRect(0, 0, W, H); g.filter = 'blur(10px)';
    for (let i = 0; i < 70; i++) { const x0 = r() * W, y0 = r() * H, a = r() * TAU, L = 200 + r() * 700; const gr = g.createLinearGradient(x0, y0, x0 + Math.cos(a + 1.57) * 60, y0 + Math.sin(a + 1.57) * 60); gr.addColorStop(0, 'rgba(120,100,80,.10)'); gr.addColorStop(.5, 'rgba(255,255,255,.18)'); gr.addColorStop(1, 'rgba(120,100,80,0)'); g.fillStyle = gr; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x0 + Math.cos(a) * L, y0 + Math.sin(a) * L); g.lineTo(x0 + Math.cos(a) * L + Math.cos(a + 1.57) * 60, y0 + Math.sin(a) * L + Math.sin(a + 1.57) * 60); g.lineTo(x0 + Math.cos(a + 1.57) * 60, y0 + Math.sin(a + 1.57) * 60); g.fill(); }
    g.filter = 'none'; return _paper;
  }
  function paperWipe(c, u) {
    if (u <= 0 || u >= 1) return; const P = paperSheet(), e = u < .5 ? easeOut(u * 2) : 1 - easeIn((u - .5) * 2), x = u < .5 ? -W * (1 - e) : W * (1 - e) * 0 + W * ((u - .5) * 2);
    resetT(c); c.save(); c.translate(x, 0); c.rotate(-.04 + u * .05);
    c.beginPath(); c.moveTo(-60, -60); c.lineTo(W + 60, -60); for (let i = 0; i <= 20; i++) c.lineTo(W + 60 + Math.sin(i * 1.7) * 30, -60 + i * (H + 120) / 20); c.lineTo(-60, H + 60); c.closePath(); c.clip();
    c.drawImage(P, 0, 0, W, H); c.restore();
    c.save(); c.fillStyle = 'rgba(20,10,30,.25)'; c.fillRect(x + W + 40, 0, 30, H); c.restore();
  }
  return { cloud, brushSky, grass, texture, ribbons, paperWipe };
})();

// Repaint the anime kit's clouds and skies with brushwork, everywhere they are used.
(() => {
  const flatSky = AN.sky;
  AN.sky = (c, R) => { flatSky(c, R); PT.brushSky(c, R, NT.clock.now, { seed: 3 + (R[0] | 0) % 7 }); };
  AN.cloud = (c, x, y, wd, t, o = {}) => PT.cloud(c, x, y, wd, t, { seed: o.seed || 1, al: Math.min(1, (o.al ?? .9) * 1.15) });
})();
