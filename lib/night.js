// The Night Train — shared drawing kit (Ink & Signal). Classic script; needs lib/core.js first.
// Every draw is a pure function of scene time t (seconds), so any seek reproduces the frame.
setFormat({ ar: '16:9', width: 1920 });

const NT = (() => {
  const P = {
    paper: '#f2e6d0', paperDeep: '#e6d4b4', ink: '#2a2420', inkSoft: '#5a4a3e',
    ochre: '#c8964a', rust: '#9a4a2a', gate: '#3e6a8a', gold: '#f0b443', nightPaper: '#3b302b',
    indigo: '#1a1240', magenta: '#e0287a', red: '#ff3b2f', yellow: '#ffd23f', ash: '#8a8580',
  };

  // boil: three redrawn states per second-ish, so held lines feel drawn, not printed
  const boil = (t, rate = 6) => Math.floor(t * rate) % 3;

  const bbox = pts => { let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; for (const [x, y] of pts) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); } return [x0, y0, x1 - x0, y1 - y0]; };

  // ink outline: wobbly, tapered pen line
  function line(c, pts, o = {}) {
    const { w = 3, color = P.ink, seed = 1, amp = 1.6, close = false, t = 0, al = 1, pressure = .6 } = o;
    c.save(); c.globalAlpha *= al; c.strokeStyle = color; c.lineWidth = w; c.lineCap = 'round'; c.lineJoin = 'round';
    wob(c, pts, amp, seed + boil(t) * 101, close, { pressure }); c.restore();
  }

  // hatch with `keep` (0..1): each stroke survives by its own seeded vote, so lowering keep erases marks one by one
  function hatch(c, pts, o = {}) {
    const { angle = .9, gap = 7, len = 16, jitter = 5, color = P.ink, al = .5, w = 1.3, seed = 1, keep = 1, t = 0 } = o;
    if (keep <= 0) return;
    const path = polyPath(pts), [bx, by, bw, bh] = bbox(pts), r = rng(seed + boil(t) * 7), cx = bx + bw / 2, cy = by + bh / 2, R = Math.hypot(bw, bh) / 2 + 4;
    const ca = Math.cos(angle), sa = Math.sin(angle);
    c.save(); c.clip(path); c.strokeStyle = color; c.globalAlpha *= al; c.lineWidth = w; c.lineCap = 'round'; c.beginPath();
    let k = 0;
    for (let v = -R; v <= R; v += gap) for (let u = -R; u <= R; u += len * 1.6) {
      const uu = u + (r() - .5) * jitter * 2, L = len * (.55 + r() * .9), x0 = cx + ca * uu - sa * v + (r() - .5) * jitter * .5, y0 = cy + sa * uu + ca * v + (r() - .5) * jitter * .5, bend = (r() - .5) * L * .25;
      if (hash(k++, seed) > keep) continue;
      c.moveTo(x0, y0); c.quadraticCurveTo(x0 + ca * L / 2 - sa * bend, y0 + sa * L / 2 + ca * bend, x0 + ca * L, y0 + sa * L);
    }
    c.stroke(); c.restore();
  }

  // shape: optional flat fill + hatch + outline, all governed by `keep` (detail = attention)
  function shape(c, pts, o = {}) {
    const { fill, fillAl = 1, outline = true, w = 3, seed = 1, t = 0, keep = 1, hatchAl = .45, angle = .9, gap = 7, color = P.ink, outlineKeep = keep } = o;
    if (fill && keep > 0) { c.save(); c.globalAlpha *= fillAl * Math.min(1, keep * 1.4); c.fillStyle = fill; c.fill(polyPath(pts)); c.restore(); }
    if (hatchAl > 0) hatch(c, pts, { angle, gap, al: hatchAl, seed: seed + 3, keep, t, color });
    if (outline && outlineKeep > .02) line(c, pts, { w, seed, t, close: true, color, al: Math.min(1, outlineKeep * 1.6) });
  }

  // backgrounds
  function paperBg(c, base = P.paper, seed = 5) { paper(c, base, null, seed); }
  function vignette(c, k = .5, color = '#2a1a10') { resetT(c); const g = c.createRadialGradient(CX, CY, H * .35, CX, CY, H * .95); g.addColorStop(0, alpha(color, 0)); g.addColorStop(1, alpha(color, k)); c.fillStyle = g; c.fillRect(0, 0, W, H); }
  function scanlines(c, al = .1, t = 0) { resetT(c); c.save(); c.fillStyle = '#000'; c.globalAlpha = al; const off = (t * 40) % 4; for (let y = -4 + off; y < H; y += 4) c.fillRect(0, y, W, 1.6); c.restore(); }
  function signalBg(c, t = 0, seed = 9) {
    resetT(c); c.fillStyle = P.indigo; c.fillRect(0, 0, W, H);
    glow(c, W * .3 + drift(t, seed, { amp: 40, freq: .1 }), H * .7, 700, P.magenta, .35);
    glow(c, W * .75, H * .25 + drift(t, seed + 2, { amp: 30, freq: .12 }), 600, P.red, .22);
    grain(c, rectPath(0, 0, W, H), [0, 0, W, H], 2200, '#ffffff', .07, seed + boil(t, 12), 1.8);
  }
  // heat ramp for thermal subjects: 0 cold indigo -> 1 white-hot yellow
  const heat = k => k < .33 ? mix(P.indigo, P.magenta, k / .33) : k < .66 ? mix(P.magenta, P.red, (k - .33) / .33) : mix(P.red, P.yellow, (k - .66) / .34);
  function hot(c, pts, k, o = {}) { const { t = 0, seed = 1 } = o; c.save(); c.fillStyle = heat(k); c.fill(polyPath(pts)); c.restore(); const [x, y, w, h] = bbox(pts); glow(c, x + w / 2, y + h / 2, Math.max(w, h) * .9, heat(Math.min(1, k + .15)), .5 * k); line(c, pts, { close: true, color: heat(Math.min(1, k + .25)), w: 2.5, seed, t, al: .9 }); }

  // paper -> signal glitch: horizontal slices of B pushed through A (u 0..1)
  function glitch(c, drawA, drawB, u, t, seed = 3) {
    drawA(c); if (u <= 0) return;
    const L = glitch._L || (glitch._L = layer()), g = L.getContext('2d'); drawB(g);
    const r = rng(seed + Math.floor(t * 24)), rows = 24;
    resetT(c); for (let i = 0; i < rows; i++) { if (r() > u * 1.15) continue; const y = i * H / rows, h = H / rows * (.4 + r() * .9), dx = (1 - u) * (r() - .5) * 260; c.drawImage(L, 0, y * S, W * S, h * S, dx, y, W, h); }
    if (u > .3 && u < .95) { c.save(); c.globalCompositeOperation = 'screen'; c.fillStyle = alpha(P.red, .25 * (1 - u)); for (let i = 0; i < 6; i++) c.fillRect(0, r() * H, W, 3 + r() * 10); c.restore(); }
  }

  // hand lettering (falls back to the system hand font)
  function words(c, text, x, y, o = {}) { const { size = 64, color = P.ink, align = 'center', al = 1, font = HAND_FONT, weight = '' } = o; c.save(); c.globalAlpha *= al; c.fillStyle = color; c.font = `${weight} ${size}px ${font}`; c.textAlign = align; c.textBaseline = 'middle'; c.fillText(text, x, y); c.restore(); }

  // ---- the carriage interior (paper world). sway: small rock. outside(c, rect) paints the window view.
  const WIN = [560, 170, 800, 420];   // window rect x,y,w,h
  function carriage(c, t, outside, o = {}) {
    const { seed = 40, lamp = 1 } = o;
    paperBg(c, '#352d4c', seed);
    // back wall + floor: lamplit night, warm where the lamp reaches, dusky violet elsewhere
    shape(c, [[0, 0], [W, 0], [W, 700], [0, 700]], { fill: '#3a3152', hatchAl: .12, gap: 14, angle: 1.2, seed: seed + 1, t, outline: false, color: '#120d22' });
    shape(c, [[0, 700], [W, 700], [W, H], [0, H]], { fill: '#2a223d', hatchAl: .2, gap: 10, angle: -.2, seed: seed + 2, t, outline: false, color: '#0c0818' });
    glow(c, CX, 300, 900, '#ffb866', .32 * lamp); glow(c, CX, 930, 700, '#ff9a55', .2 * lamp);
    line(c, [[0, 700], [W, 700]], { w: 3, seed: seed + 3, t, color: '#120d22' });
    for (let i = 0; i < 9; i++) line(c, [[i * 260 - 300, H], [i * 120 + 380, 705]], { w: 1.4, seed: seed + 10 + i, t, al: .45, color: '#120d22' });
    // window
    const [x, y, w, h] = WIN, wp = [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
    c.save(); c.clip(polyPath(wp)); outside(c, WIN); c.restore();
    line(c, wp, { close: true, w: 6, seed: seed + 4, t });
    line(c, [[x - 30, y - 24], [x + w + 30, y - 24], [x + w + 30, y + h + 30], [x - 30, y + h + 30]], { close: true, w: 3, seed: seed + 5, t });
    line(c, [[x + w / 2, y], [x + w / 2, y + h]], { w: 4, seed: seed + 6, t });
    // luggage rack + lamp
    line(c, [[120, 110], [W - 120, 110]], { w: 3, seed: seed + 7, t, color: '#120d22' }); for (let i = 0; i < 18; i++) line(c, [[150 + i * 92, 110], [170 + i * 92, 70]], { w: 1.6, seed: seed + 30 + i, t, al: .7, color: '#120d22' });
    // the lamp: a brass bowl with a living flame-glow and light shafts
    const fl = .9 + .1 * Math.sin(t * 7.3) * Math.sin(t * 3.1);
    shape(c, [[CX - 60, 40], [CX + 60, 40], [CX + 34, 92], [CX - 34, 92]], { fill: '#8a6a2a', hatchAl: .3, seed: seed + 8, t, color: '#2a1a08' });
    glow(c, CX, 100, 520, '#ffd27a', .7 * lamp * fl); glow(c, CX, 100, 120, '#fff3d0', .9 * lamp * fl);
    shafts(c, CX, 96, { len: 980, spread: 1.5, n: 7, al: .1 * lamp * fl, t, seed: seed + 9 });
    // seats: left and right benches
    seat(c, 80, 760, 1, seed + 50, t); seat(c, W - 80, 760, -1, seed + 60, t);
  }
  function seat(c, x, y, dir, seed, t) {
    const back = [[x, y - 330], [x + dir * 300, y - 330], [x + dir * 320, y + 20], [x, y + 20]];
    shape(c, back, { fill: P.rust, fillAl: .85, hatchAl: .4, angle: dir > 0 ? 1.1 : 2.0, seed, t });
    const cush = [[x, y + 10], [x + dir * 470, y + 10], [x + dir * 480, y + 70], [x, y + 80]];
    shape(c, cush, { fill: shade(P.rust, .15), hatchAl: .5, angle: .3, seed: seed + 1, t });
  }
  // outside at night: dark field, hatched hills, optional passing lit windows
  function nightOutside(c, R, t, o = {}) {
    const { seed = 70, lights = true, speed = 220 } = o, [x, y, w, h] = R;
    c.fillStyle = P.nightPaper; c.fillRect(x, y, w, h);
    hatch(c, [[x, y], [x + w, y], [x + w, y + h], [x, y + h]], { color: '#140e0c', al: .55, gap: 5, angle: .5, seed, t });
    const off = (t * speed * .35) % 400;
    for (let i = -1; i < 4; i++) { const hx = x + i * 400 - off; shape(c, [[hx, y + h], [hx + 120, y + h * .55], [hx + 260, y + h * .7], [hx + 420, y + h]], { fill: '#211814', hatchAl: .4, color: '#000', seed: seed + i, t, w: 2 }); }
    if (lights) for (let i = 0; i < 3; i++) { const lx = x + w - ((t * speed + i * 520) % (w + 700)) + 200, ly = y + h * .58; glow(c, lx, ly, 90, P.gold, .9); c.fillStyle = P.gold; c.fillRect(lx - 14, ly - 18, 28, 32); }
  }

  // ---- characters. Local origin = where they sit on the cushion. dir 1 faces right, -1 faces left.
  function traveller(c, x, y, o = {}) {
    const { s = 1, dir = 1, t = 0, look = 0, seed = 200, keep = 1, cup = true } = o;
    c.save(); c.translate(x, y); c.scale(s * dir, s);
    const br = breathe(t, 3.4) * 3;   // slow breath in the shoulders
    const coat = [[-70, 0], [80, 0], [96, -50], [78, -170 - br], [30, -208 - br], [-40, -205 - br], [-82, -150], [-88, -40]];
    shape(c, coat, { fill: '#6f6a5e', hatchAl: .55, angle: 1.9, gap: 6, seed, t, keep, w: 3.4 }); rim(c, coat, { dx: 5, dy: -4, seed, t, al: .45 * keep });
    shape(c, [[60, -10], [190, -14], [205, 30], [70, 40]], { fill: '#4d4842', hatchAl: .5, angle: .2, seed: seed + 1, t, keep });   // thigh
    shape(c, [[170, 10], [205, 18], [196, 170], [160, 168]], { fill: '#4d4842', hatchAl: .5, angle: 1.5, seed: seed + 2, t, keep });   // shin
    shape(c, [[150, 160], [230, 158], [238, 186], [146, 190]], { fill: P.ink, hatchAl: 0, seed: seed + 3, t, keep });   // shoe
    shape(c, [[-30, -200 - br], [70, -205 - br], [60, -175 - br], [-34, -172 - br]], { fill: P.rust, hatchAl: .4, seed: seed + 4, t, keep });   // scarf
    const hx = 22 + look * 6, hy = -255 - br;
    shape(c, ellPts(hx, hy, 46, 50, 0, 36), { fill: '#e9c9a2', hatchAl: .2, angle: 2.4, gap: 8, seed: seed + 5, t, keep }); rim(c, ellPts(hx, hy, 46, 50, 0, 36), { dx: 4, dy: -3, seed: seed + 5, t, al: .8 * keep });
    line(c, [[hx - 44, hy - 18], [hx - 20, hy - 54], [hx + 10, hy - 50], [hx + 38, hy - 40], [hx + 46, hy - 16]], { w: 5, seed: seed + 6, t });   // hair line
    hatch(c, [[hx - 48, hy - 10], [hx - 20, hy - 58], [hx + 44, hy - 44], [hx + 50, hy - 20], [hx - 10, hy - 34]], { al: .9, gap: 4, angle: 2.2, seed: seed + 7, t, w: 2 });
    c.fillStyle = P.ink; c.beginPath(); c.arc(hx + 30, hy - 2, 4.2, 0, TAU); c.fill();   // eye
    line(c, [[hx + 18, hy - 14], [hx + 38, hy - 16]], { w: 2.2, seed: seed + 8, t });   // tired brow
    line(c, [[hx + 26, hy + 26], [hx + 38, hy + 25]], { w: 2, seed: seed + 9, t });   // mouth
    if (cup) { line(c, [[40, -170], [74, -96], [118, -104]], { w: 7, seed: seed + 10, t, color: '#4d4842' }); shape(c, [[106, -138], [140, -138], [136, -96], [110, -96]], { fill: P.paper, hatchAl: .25, seed: seed + 11, t, keep }); }
    c.restore();
  }
  function conductor(c, x, y, o = {}) {
    const { s = 1, dir = -1, t = 0, seed = 300, keep = 1, al = 1 } = o;
    c.save(); c.globalAlpha *= al; c.translate(x, y); c.scale(s * dir, s);
    const br = breathe(t, 4.6, .3) * 2;
    const coat = [[-80, 0], [96, 0], [112, -60], [92, -230 - br], [40, -268 - br], [-46, -262 - br], [-94, -200], [-100, -50]];
    shape(c, coat, { fill: '#2f3a44', hatchAl: .7, angle: 2.1, gap: 5, seed, t, keep, w: 3.6 }); rim(c, coat, { dx: 5, dy: -4, seed, t, al: .45 * keep });
    for (let i = 0; i < 4; i++) { c.fillStyle = P.gold; c.beginPath(); c.arc(14, -220 + i * 44, 6, 0, TAU); c.fill(); }   // brass buttons
    shape(c, [[70, -10], [210, -10], [222, 34], [80, 44]], { fill: '#26303a', hatchAl: .6, angle: .2, seed: seed + 1, t, keep });
    shape(c, [[184, 14], [222, 20], [214, 176], [176, 174]], { fill: '#26303a', hatchAl: .6, angle: 1.5, seed: seed + 2, t, keep });
    shape(c, [[160, 166], [248, 164], [256, 194], [156, 196]], { fill: P.ink, hatchAl: 0, seed: seed + 3, t, keep });
    const hx = 26, hy = -318 - br;
    shape(c, ellPts(hx, hy, 48, 54, 0, 36), { fill: '#c9a07a', hatchAl: .55, angle: 2.4, gap: 5, seed: seed + 5, t, keep });
    hatch(c, ellPts(hx, hy + 6, 50, 34, 0, 30), { al: .8, gap: 4, angle: 2.6, seed: seed + 6, t, w: 1.6 });   // face mostly in shadow under the cap
    shape(c, [[hx - 56, hy - 34], [hx + 70, hy - 34], [hx + 92, hy - 26], [hx - 54, hy - 22]], { fill: P.ink, hatchAl: 0, seed: seed + 7, t });   // brim
    shape(c, [[hx - 46, hy - 34], [hx - 40, hy - 78], [hx + 50, hy - 82], [hx + 58, hy - 34]], { fill: '#2f3a44', hatchAl: .6, seed: seed + 8, t });   // crown
    c.fillStyle = P.gold; c.fillRect(hx - 6, hy - 64, 22, 14);   // cap badge
    line(c, [[hx + 10, hy + 22], [hx + 34, hy + 16], [hx + 52, hy + 24]], { w: 4, seed: seed + 9, t, color: '#d9d0c4' });   // moustache
    line(c, [[60, -150], [70, -60], [84, -40]], { w: 2, seed: seed + 10, t, color: P.gold });   // punch chain
    shape(c, [[74, -46], [104, -46], [100, -20], [78, -20]], { fill: '#9a9188', hatchAl: .2, seed: seed + 11, t });
    c.restore();
  }

  // ---- magic: bloom, light motes, light shafts, night sky ----
  // bloom: a blurred, contrast-pushed copy of the frame screened back on top, so only the lights bleed
  function bloom(c, k = .55, r = 26) {
    if (window.TOON) { k *= window.TOONLOC === 'carriage' ? 0 : .4; if (!k) return; }   // TV-cartoon look: crisp, little glow
    const cw = c.canvas.width, ch = c.canvas.height;
    const L = bloom._L || (bloom._L = Object.assign(document.createElement('canvas'), { width: cw >> 1, height: ch >> 1 })), g = L.getContext('2d');
    g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, L.width, L.height);
    g.filter = `blur(${r * S * .5}px) brightness(1.15) contrast(1.9)`; g.drawImage(c.canvas, 0, 0, L.width, L.height); g.filter = 'none';   // half-res: same look, a quarter of the work
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.globalCompositeOperation = 'screen'; c.globalAlpha = k; c.drawImage(L, 0, 0, cw, ch); c.restore();
  }
  // motes: seeded dust/sparks drifting on slow loops, each twinkling on its own phase
  function motes(c, t, o = {}) {
    const { n = 60, box = [0, 0, W, H], color = P.gold, size = 3, seed = 11, speed = 1, al = 1 } = o, r = rng(seed), [bx, by, bw, bh] = box;
    for (let i = 0; i < n; i++) {
      const x0 = r(), y0 = r(), ph = r() * TAU, sp = .3 + r() * .7, z = .4 + r() * .9;
      const x = bx + ((x0 * bw + Math.sin(t * .23 * sp + ph) * 60 + t * 14 * sp * speed) % bw + bw) % bw;
      const y = by + ((y0 * bh + Math.cos(t * .17 * sp + ph) * 40 - t * 9 * sp * speed) % bh + bh) % bh;
      const tw = .45 + .55 * Math.max(0, Math.sin(t * (1.2 + sp * 2) + ph)), s = size * z;
      glow(c, x, y, s * 7, color, .55 * tw * al); c.save(); c.globalAlpha = tw * al; c.fillStyle = '#fff8e6'; c.beginPath(); c.arc(x, y, s * .6, 0, TAU); c.fill(); c.restore();
    }
  }
  // shafts: soft light beams fanning down from a source
  function shafts(c, x, y, o = {}) {
    const { len = 900, spread = .9, n = 5, color = P.gold, al = .16, t = 0, seed = 4 } = o, r = rng(seed);
    c.save(); c.globalCompositeOperation = 'screen';
    for (let i = 0; i < n; i++) {
      const a = Math.PI / 2 + (i / (n - 1) - .5) * spread + Math.sin(t * .3 + i) * .02, w = 50 + r() * 90, k = al * (.6 + .4 * Math.sin(t * .5 + i * 1.7));
      const ex = x + Math.cos(a) * len, ey = y + Math.sin(a) * len, g = c.createLinearGradient(x, y, ex, ey);
      g.addColorStop(0, alpha(color, k)); g.addColorStop(1, alpha(color, 0)); c.fillStyle = g;
      const nx = -Math.sin(a), ny = Math.cos(a); c.beginPath(); c.moveTo(x - nx * 8, y - ny * 8); c.lineTo(x + nx * 8, y + ny * 8); c.lineTo(ex + nx * w, ey + ny * w); c.lineTo(ex - nx * w, ey - ny * w); c.closePath(); c.fill();
    }
    c.restore();
  }
  // magic night sky inside rect R: gradient, twinkling stars, haloed moon, aurora ribbon, passing village lights
  function magicSky(c, R, t, o = {}) {
    const { seed = 80, speed = 220, moon = true, aurora = 1 } = o, [x, y, w, h] = R;
    const g = c.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, '#0d0b2a'); g.addColorStop(.6, '#2a1d5a'); g.addColorStop(1, '#4a2a5e'); c.fillStyle = g; c.fillRect(x, y, w, h);
    const r = rng(seed); for (let i = 0; i < 140; i++) { const sx = x + r() * w, sy = y + r() * h * .7, tw = .3 + .7 * Math.max(0, Math.sin(t * (1 + r() * 3) + r() * TAU)), s = .6 + r() * 1.6; c.fillStyle = alpha('#fff6dc', tw); c.fillRect(sx, sy, s, s); if (s > 1.8) glow(c, sx, sy, 10, '#cfe0ff', tw * .5); }
    if (aurora) { c.save(); c.globalCompositeOperation = 'screen'; for (let b = 0; b < 3; b++) { c.beginPath(); for (let i = 0; i <= 40; i++) { const u = i / 40, ax = x + u * w, ay = y + h * (.28 + b * .06) + Math.sin(u * 5 + t * .35 + b) * 28 + Math.sin(u * 13 - t * .2) * 9; i ? c.lineTo(ax, ay) : c.moveTo(ax, ay); } c.strokeStyle = alpha(b === 1 ? '#7fffd0' : '#c48bff', .22 * aurora); c.lineWidth = 26 - b * 6; c.filter = 'blur(6px)'; c.stroke(); c.filter = 'none'; } c.restore(); }
    if (moon) { const mx = x + w * .78, my = y + h * .24; glow(c, mx, my, 180, '#fff1c8', .55); glow(c, mx, my, 70, '#fffaf0', .8); c.fillStyle = '#fff4d6'; c.beginPath(); c.arc(mx, my, 30, 0, TAU); c.fill(); c.fillStyle = alpha('#e8d8b0', .6); c.beginPath(); c.arc(mx - 8, my + 6, 7, 0, TAU); c.arc(mx + 10, my - 9, 5, 0, TAU); c.fill(); }
    const off = (t * speed * .35) % 400;
    for (let i = -1; i < 4; i++) { const hx = x + i * 400 - off; shape(c, [[hx, y + h], [hx + 120, y + h * .6], [hx + 260, y + h * .72], [hx + 420, y + h]], { fill: '#150f2a', hatchAl: .35, color: '#06040f', seed: seed + i, t, w: 2 }); }
    for (let i = 0; i < 4; i++) { const lx = x + w - ((t * speed + i * 430) % (w + 700)) + 200, ly = y + h * (.66 + (i % 2) * .08); glow(c, lx, ly, 110, P.gold, 1); c.fillStyle = '#ffe2a0'; c.fillRect(lx - 10, ly - 14, 20, 24); }
  }
  // rim light: a thin warm edge on the side of a silhouette that faces the lamp
  function rim(c, pts, o = {}) { const { dx = 4, dy = -3, color = P.gold, al = .5, w = 3.2, seed = 1, t = 0 } = o; c.save(); c.translate(dx, dy); c.globalCompositeOperation = 'screen'; line(c, pts, { close: true, w, color, al, seed: seed + 77, t, pressure: .2 }); c.restore(); }

  // camera: draw a full frame into a layer, then place it zoomed toward (fx, fy). key = which cached layer.
  const _cams = {};
  function zoomed(c, zoom, fx, fy, draw, key = 'a') {
    if (zoom <= 1.0005) { draw(c); return; }
    const L = _cams[key] || (_cams[key] = layer()), g = L.getContext('2d'); resetT(g); g.clearRect(0, 0, W, H); draw(g);
    resetT(c); c.save(); c.translate(fx, fy); c.scale(zoom, zoom); c.translate(-fx, -fy); c.drawImage(L, 0, 0, W, H); c.restore();
  }

  // mount a scene into its sub-composition: one paused timeline whose proxy tween redraws the canvas on every seek
  // global film time of the frame being drawn, and who is speaking at it (from lib/speech.js)
  const clock = { now: 0 };
  const TSCALE = 1 / .9;   // voice track is the original-speed Gemini take (0.9x of the calm take's length)
  // how open the speaker's mouth is (0..1): loudness of the real voice track, only inside that speaker's lines
  function speaking(who) {
    const S = (window.SPEECH || {})[who] || [], n = clock.now, M = window.MOUTH || '';
    for (const [a, b] of S) { if (n < a - .04 || n > b + .08) continue;
      const f = Math.floor(n * .9 * 24), v = (+M[f] || 0) / 9;   // the track runs at original speed: calm time x 0.9
      return v < .18 ? 0 : v; }
    return 0;
  }
  function mount(id, dur, draw, o = {}) {
    const { fade = .5 } = o;
    const cv = document.getElementById(id + '-cv'); cv.width = OUT_W; cv.height = OUT_H;
    const host = document.querySelector(`[data-composition-id="${id}"][data-start]`), start = host ? +host.getAttribute('data-start') : 0;
    const c = cv.getContext('2d'), proxy = { t: 0 };
    const render = () => {
      const tc = proxy.t * TSCALE;   // scenes are authored in calm-track time; the film plays at full speed
      clock.now = start * TSCALE + tc; resetT(c); c.clearRect(0, 0, W, H);
      const a = fade > 0 ? sm(0, fade, proxy.t, easeInOutSine) : 1;   // crossfade over the end of the previous scene (it keeps playing underneath)
      if (a >= 1) { draw(c, tc); return; }
      const L = mount._L || (mount._L = layer()), g = L.getContext('2d'); resetT(g); g.clearRect(0, 0, W, H); draw(g, tc);
      resetT(c); c.globalAlpha = a; c.drawImage(L, 0, 0, W, H); c.globalAlpha = 1;
    };
    const tl = gsap.timeline({ paused: true });
    tl.to(proxy, { t: dur, duration: dur, ease: 'none', onUpdate: render }, 0);
    render();
    window.__timelines[id] = tl;
  }

  return { P, boil, bbox, line, hatch, shape, paperBg, vignette, scanlines, signalBg, heat, hot, glitch, words, WIN, carriage, seat, nightOutside, traveller, conductor, zoomed, mount, speaking, clock, bloom, motes, shafts, magicSky, rim };
})();
