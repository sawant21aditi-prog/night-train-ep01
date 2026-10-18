// The Night Train — night-anime cel kit (after html-anime's cel rules): flat paint, one hard shadow,
// bold contour, closed colour script, a glowing moon, soft clouds, far silhouettes, letterbox, grain.
// Needs core.js + night.js. Every function is a pure function of t.
const AN = (() => {
  // closed colour script for the night carriage
  const C = {
    ink: '#0a0a1f', skyTop: '#0c1036', skyMid: '#1b2a7a', skyLow: '#3a4fb0', cloud: '#5a6cc8', cloudLit: '#c9d4ff',
    moon: '#eef2ff', line: '#c9d6ff', practical: '#ffb347', skin: '#f2c9a8', hair: '#1a1630', coat: '#2c3e6b',
    scarf: '#c8323c', sclera: '#f4f6ff', iris: '#7fb4ff', wood: '#3a2440', far: '#141a52', near: '#0b0e33',
  };
  const sp = (pts, corner = .85) => smoothPts(pts, true, 3, corner);
  const P2 = pts => polyPath(pts);

  // cel: flat local colour, optional hard shadow shape clipped inside, bold contour on top
  function cel(c, pts, fill, o = {}) {
    const { shadow, shade = .22, line = C.ink, w = 6, smooth = true, al = 1 } = o, q = smooth ? sp(pts) : pts;
    c.save(); c.globalAlpha *= al; c.fillStyle = fill; c.fill(P2(q));
    if (shadow) { c.save(); c.clip(P2(q)); c.fillStyle = alpha(C.ink, shade); c.fill(P2(smooth ? sp(shadow) : shadow)); c.restore(); }
    if (w > 0) { c.strokeStyle = line; c.lineWidth = w; c.lineJoin = 'round'; c.stroke(P2(q)); }
    c.restore();
  }
  function stroke(c, pts, o = {}) { const { w = 3, color = C.ink, al = 1, close = false } = o; c.save(); c.globalAlpha *= al; c.strokeStyle = color; c.lineWidth = w; c.lineCap = 'round'; c.lineJoin = 'round'; c.stroke(polyPath(smoothPts(pts, close, 3, .9), close)); c.restore(); }

  function sky(c, R) { const [x, y, w, h] = R, g = c.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, C.skyTop); g.addColorStop(.55, C.skyMid); g.addColorStop(1, C.skyLow); c.fillStyle = g; c.fillRect(x, y, w, h); }
  function stars(c, R, t, seed = 3) { const [x, y, w, h] = R, r = rng(seed); for (let i = 0; i < 120; i++) { const sx = x + r() * w, sy = y + r() * h, tw = .35 + .65 * Math.max(0, Math.sin(t * (1 + r() * 2.5) + r() * TAU)), s = .8 + r() * 1.8; c.fillStyle = alpha('#e8eeff', tw * .9); c.beginPath(); c.arc(sx, sy, s, 0, TAU); c.fill(); } }

  // the big moon: halo, craters, light rays fanning down, bokeh specks drifting around it
  function moon(c, x, y, r, t, o = {}) {
    const { rays = 1, bokeh = 1, seed = 9 } = o;
    glow(c, x, y, r * 4.2, '#6f8cff', .9); glow(c, x, y, r * 2.2, '#cfdaff', .9); glow(c, x, y, r * 1.35, '#ffffff', .8);
    if (rays) { c.save(); c.globalCompositeOperation = 'screen'; for (let i = 0; i < 13; i++) { const a = Math.PI / 2 + (i / 12 - .5) * 1.25, L = r * (2.2 + .5 * Math.sin(i * 1.7 + t * .4)), ex = x + Math.cos(a) * L, ey = y + Math.sin(a) * L, wd = r * .11, g = c.createLinearGradient(x, y, ex, ey); g.addColorStop(0, alpha('#dfe6ff', .26 * rays)); g.addColorStop(1, alpha('#dfe6ff', 0)); c.fillStyle = g; const nx = -Math.sin(a), ny = Math.cos(a); c.beginPath(); c.moveTo(x + nx * wd * .3, y + ny * wd * .3); c.lineTo(ex + nx * wd, ey + ny * wd); c.lineTo(ex - nx * wd, ey - ny * wd); c.lineTo(x - nx * wd * .3, y - ny * wd * .3); c.fill(); } c.restore(); }
    const g = c.createRadialGradient(x - r * .25, y - r * .25, r * .1, x, y, r); g.addColorStop(0, '#ffffff'); g.addColorStop(.75, C.moon); g.addColorStop(1, '#c7d1f2'); c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill();
    const rr = rng(seed); c.save(); c.beginPath(); c.arc(x, y, r, 0, TAU); c.clip(); for (let i = 0; i < 22; i++) { const a = rr() * TAU, d = Math.sqrt(rr()) * r * .9, cr = r * (.04 + rr() * .11); c.fillStyle = alpha('#9aa8d8', .22 + rr() * .18); c.beginPath(); c.arc(x + Math.cos(a) * d, y + Math.sin(a) * d, cr, 0, TAU); c.fill(); } c.restore();
    if (bokeh) { const rb = rng(seed + 5); for (let i = 0; i < 26; i++) { const a = rb() * TAU, d = r * (1.1 + rb() * 1.6), bx = x + Math.cos(a + t * .03 * (rb() - .5)) * d, by = y + Math.sin(a) * d * .7 + Math.sin(t * .6 + i) * 6, s = 3 + rb() * 9, tw = .4 + .6 * Math.sin(t * 1.3 + i * 2.1) ** 2; glow(c, bx, by, s * 2.6, '#9fd0ff', .5 * tw * bokeh); } }
  }
  // soft layered cloud bank: stacked ellipses, lit along the top by the moon
  function cloud(c, x, y, wd, t, o = {}) {
    const { seed = 1, al = .9, drift: dr = 12 } = o, r = rng(seed), dx = Math.sin(t * .08 + seed) * dr;
    c.save(); c.globalAlpha *= al; c.filter = 'blur(3px)';
    for (let k = 0; k < 3; k++) { const yy = y + k * wd * .09; c.fillStyle = k === 0 ? alpha(C.cloudLit, .85) : alpha(mix(C.cloud, C.skyMid, k * .3), .9); c.beginPath(); for (let i = 0; i < 6; i++) { const ex = x + dx + (i - 2.5) * wd * .17 + (r() - .5) * 30, ew = wd * (.16 + r() * .1), eh = wd * (.045 + r() * .03); c.ellipse(ex, yy - k * 4, ew, eh, 0, 0, TAU); } c.fill(); }
    c.filter = 'none'; c.restore();
  }
  // far silhouette: rolling hills + village rooftops with a few lit windows (practicals)
  function village(c, y, t, o = {}) {
    const { speed = 60, seed = 7, color = C.far } = o, off = (t * speed) % 640, r = rng(seed);
    c.fillStyle = color; c.beginPath(); c.moveTo(0, H);
    for (let i = 0; i <= 40; i++) { const xx = i / 40 * W, yy = y + Math.sin(i * .45 + off / 100) * 18; c.lineTo(xx, yy); } c.lineTo(W, H); c.fill();
    for (let i = -1; i < 5; i++) { const hx = i * 640 - off, bw = 140 + (i & 1) * 60, bh = 70 + (i % 3) * 30;
      c.fillStyle = color; c.beginPath(); c.moveTo(hx, y + 10); c.lineTo(hx, y - bh); c.lineTo(hx + bw / 2, y - bh - 46); c.lineTo(hx + bw, y - bh); c.lineTo(hx + bw, y + 10); c.fill();
      c.strokeStyle = alpha(C.line, .5); c.lineWidth = 2; c.beginPath(); c.moveTo(hx - 8, y - bh + 4); c.lineTo(hx + bw / 2, y - bh - 50); c.lineTo(hx + bw + 8, y - bh + 4); c.stroke();
      const lx = hx + bw * .35, ly = y - bh * .5; glow(c, lx + 12, ly + 12, 46, C.practical, .8); c.fillStyle = C.practical; c.fillRect(lx, ly, 24, 26); }
  }
  // drifting light specks across the whole frame
  function specks(c, t, o = {}) { const { n = 40, seed = 21, color = '#bfe0ff', al = 1 } = o, r = rng(seed); for (let i = 0; i < n; i++) { const x = (r() * W + t * (6 + r() * 14)) % W, y = (r() * H - t * (3 + r() * 6) % H + H) % H, s = 1.5 + r() * 3.5, tw = .35 + .65 * Math.sin(t * (.8 + r() * 1.5) + i) ** 2; glow(c, x, y, s * 4, color, .6 * tw * al); c.fillStyle = alpha('#ffffff', .8 * tw * al); c.beginPath(); c.arc(x, y, s * .45, 0, TAU); c.fill(); } }
  // finishing: film grain, vignette, letterbox bars
  function finish(c, t, o = {}) {
    const { bars = 110, grainAl = .06, vig = .55 } = o; resetT(c);
    const g = c.createRadialGradient(CX, CY, H * .3, CX, CY, H * .95); g.addColorStop(0, alpha(C.ink, 0)); g.addColorStop(1, alpha(C.ink, vig)); c.fillStyle = g; c.fillRect(0, 0, W, H);
    grain(c, rectPath(0, 0, W, H), [0, 0, W, H], 2600, '#ffffff', grainAl, 40 + Math.floor(t * 12) % 4, 1.6);
    c.fillStyle = '#000'; c.fillRect(0, 0, W, bars); c.fillRect(0, H - bars, W, bars);
  }
  return { C, cel, stroke, sky, stars, moon, cloud, village, specks, finish, sp };
})();
