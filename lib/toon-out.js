// The Night Train — outdoor sets in the TV-cartoon look (Shin-chan backgrounds): painted skies, layered
// mountains and tree lines for depth, ground planes in perspective, big cropped foreground objects, thin coloured
// background lines, soft painted shading, a blue-violet wash at night. Load after toon.js. Seek-safe.
(() => {
  const T = window.TOON; if (!T) return;
  const BGL = '#6e5f72';
  const B = (c, pts, fill, o = {}) => AN.cel(c, pts, fill, { line: BGL, w: 3, smooth: false, ...o });
  const L = (c, pts, w = 3, color = BGL, al = 1) => AN.stroke(c, pts, { w, color, al });
  const Eb = (c, x, y, rx, ry, fill, o = {}) => AN.cel(c, ellPts(x, y, rx, ry, 0, 24), fill, { line: BGL, w: 3, ...o });
  const vgrad = (c, y0, y1, stops) => { const g = c.createLinearGradient(0, y0, 0, y1); stops.forEach(([u, col]) => g.addColorStop(u, col)); return g; };
  const grey = (col, k) => k >= 1 ? col : mix('#8a8a96', col, k);   // k: 1 = full colour, 0 = the world without its drawing
  const wrap = (x, span) => ((x % span) + span) % span;

  // a ridge line: base y, bumps from two sines + a seeded wobble, scrolled with parallax
  function ridge(c, base, amp, per, off, fill, o = {}) {
    const { rim, seed = 1, y1 = H } = o; const pts = [];
    for (let s = 0; s <= 64; s++) { const x = s / 64 * (W + 40) - 20, xx = x + off; pts.push([x, base - Math.abs(Math.sin(xx / per + seed)) * amp - Math.sin(xx / (per * .31) + seed * 2) * amp * .25]); }
    c.save(); c.fillStyle = fill; c.beginPath(); c.moveTo(-20, y1); pts.forEach(p => c.lineTo(...p)); c.lineTo(W + 20, y1); c.closePath(); c.fill();
    if (rim) { c.lineWidth = 3; c.strokeStyle = rim; c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(...p) : c.moveTo(...p)); c.stroke(); }
    c.restore(); return pts;
  }
  function treeLine(c, base, off, fill, o = {}) { const { r = 34, gap = 46, seed = 3 } = o; c.save(); c.fillStyle = fill; c.fillRect(-20, base, W + 40, H - base);
    for (let i = -2; i < W / gap + 3; i++) { const x = i * gap - wrap(off, gap), k = hash(Math.floor((i * gap + off) / gap), seed); c.beginPath(); c.arc(x, base - r * (.4 + k * .6), r * (.7 + k * .5), 0, TAU); c.fill(); } c.restore(); }
  function stars(c, R, t, n = 40, seed = 7) { const [x, y, w, h] = R; for (let i = 0; i < n; i++) { const sx = x + hash(i, seed) * w, sy = y + hash(i, seed + 1) * h, tw = .55 + .45 * Math.sin(t * 2 + i); c.fillStyle = alpha('#fff6d8', .85 * tw); c.fillRect(sx, sy, 3, 3); } }
  function moonFlat(c, x, y, r) { glow(c, x, y, r * 3, '#dfe6ff', .25); Eb(c, x, y, r, r, '#fff6d0', { line: '#e6d8a8' }); Eb(c, x - r * .3, y - r * .2, r * .18, r * .15, '#efe2b0', { w: 0 }); Eb(c, x + r * .25, y + r * .3, r * .12, r * .1, '#efe2b0', { w: 0 }); }
  function nightWash(c, al = 1) { c.save(); c.globalCompositeOperation = 'multiply'; c.globalAlpha = al; c.fillStyle = vgrad(c, 0, H, [[0, '#c4c2ec'], [1, '#e2def4']]); c.fillRect(0, 0, W, H); c.restore(); }

  // ---------- the night road (f04, f05): sky, three distances of land, the road with two kerbs, a rushing foreground ----------
  T.hills = (c, t, scroll, o = {}) => {
    const k = o.k ?? 1;
    c.fillStyle = vgrad(c, 0, 760, [[0, grey('#121844', k)], [.55, grey('#2a3678', k)], [1, grey('#6a6cb8', k)]]); c.fillRect(0, 0, W, 760);
    c.save(); c.globalAlpha = k; stars(c, [0, 110, W, 330], t); moonFlat(c, 1560, 240, 70); c.restore();
    cloud(c, 520 - scroll * .03, 250, 700, t, 'night', 3, .7 * k); cloud(c, 1200 - scroll * .03, 330, 520, t, 'night', 8, .6 * k);
    ridge(c, 600, 120, 260, scroll * .1, vgrad(c, 470, 640, [[0, grey('#323c86', k)], [1, grey('#1c2460', k)]]), { rim: grey('#a8b4ec', k), seed: 2 });                // far mountains, moonlit edge
    ridge(c, 680, 60, 170, scroll * .25, vgrad(c, 610, 700, [[0, grey('#1e2864', k)], [1, grey('#141a4a', k)]]), { rim: grey('#5a66b0', k), seed: 5 });                                          // nearer hills
    for (let i = 0; i < 30; i++) { const x = wrap(i * 97 - scroll * .25, W + 40) - 20, y = 664 + hash(i, 3) * 30; c.fillStyle = alpha('#ffd27a', k * (.6 + .4 * hash(i, 4))); c.fillRect(x, y, 4, 3); }   // a far town
    treeLine(c, 728, scroll * .45, grey('#0e1336', k), { r: 26, gap: 38 });                                         // tree line just behind the road
  };
  T.road = (c, y, t, speed, o = {}) => {
    const al = o.al ?? 1, off = t * speed; c.save(); c.globalAlpha *= al;
    B(c, [[-10, y - 22], [W + 10, y - 22], [W + 10, y], [-10, y]], '#8a8cb4');                                       // far kerb + pavement, thin
    c.fillStyle = vgrad(c, y, 1000, [[0, '#30345e'], [1, '#3e4474']]); c.fillRect(-10, y, W + 20, 1000 - y);          // tarmac, a touch lighter as it comes closer
    for (let x = -260 + wrap(-off * .9, 240); x < W + 260; x += 240) B(c, [[x, 862], [x + 110, 862], [x + 118, 878], [x - 6, 878]], '#ffd98a', { w: 2 });   // centre dashes, perspective-thick
    L(c, [[0, y + 14], [W, y + 14]], 2, '#4e5488'); L(c, [[0, 985], [W, 985]], 4, '#e8e0c8');                       // lane edges
    c.fillStyle = vgrad(c, 1000, H, [[0, '#9a9cc0'], [1, '#b8b8d4']]); c.fillRect(-10, 1000, W + 20, H - 1000); L(c, [[0, 1000], [W, 1000]], 5, BGL);   // near pavement
    for (let x = -200 + wrap(-off * 1.6, 160); x < W + 200; x += 160) L(c, [[x, 1000], [x - 40, H]], 2, '#8a8cac');  // paving joints rushing past, faster: they are nearest
    for (let i = -1; i < 9; i++) { const x = i * 300 + wrap(-off * 2.2, 300), sw = Math.sin(t * 2 + i) * 4;          // foreground grass tufts and a post, biggest and fastest
      if (i % 3 === 0) { B(c, [[x - 14, H + 20], [x - 10, 940], [x + 10, 936], [x + 14, H + 20]], '#c8b49a', { w: 4 }); B(c, [[x - 18, 936], [x + 18, 930], [x + 18, 946], [x - 18, 952]], '#e0503a', { w: 3 }); }
      for (let b = 0; b < 6; b++) { const bx = x + 60 + b * 14; c.save(); c.strokeStyle = b % 2 ? '#3a6a4a' : '#4a8a5a'; c.lineWidth = 5; c.beginPath(); c.moveTo(bx, H + 10); c.quadraticCurveTo(bx + sw, 1000, bx + sw * 2 + (b - 3) * 6, 960 + (b % 3) * 14); c.stroke(); c.restore(); } }
    c.restore();
    nightWash(c, .9);
  };

  // ---------- summer at the river (f07): bright sky, big clouds, the river running away between its banks ----------
  T.summer = (c, t) => {
    c.fillStyle = vgrad(c, 0, 700, [[0, '#5aaee8'], [.7, '#a8daf4'], [1, '#e8f4f0']]); c.fillRect(0, 0, W, 700);
    Eb(c, 640, 260, 92, 92, '#fff8d8', { line: '#f4dca0' }); glow(c, 640, 260, 300, '#fff6d0', .5);
    cloud(c, 1250, 300, 900, t, 'summer', 4, 1); cloud(c, 300, 420, 560, t, 'summer', 9, .95);
    ridge(c, 600, 70, 240, t * 3, '#7ab0a0', { rim: '#a8d0c0', seed: 4 });                                           // far blue-green hills
    ridge(c, 650, 34, 140, t * 6, '#5a9a6a', { seed: 7 });
    treeLine(c, 662, t * 8, '#3e7a4a', { r: 30, gap: 44, seed: 5 });
    const VPx = 1290, hz = 640;                                                                                      // the river recedes to here
    B(c, [[-10, hz], [W + 10, hz], [W + 10, H], [-10, H]], '#7ac05a', { w: 0 });                                     // banks
    for (let i = 0; i < 40; i++) { const u = hash(i, 11), v = hash(i, 12), y = hz + 20 + v * v * (H - hz), x = u * W; L(c, [[x, y], [x + 4, y - 10 - v * 14]], 2 + v * 2, '#5a9a3a'); }   // grass strokes, bigger as they come closer
    const wq = [[VPx - 40, hz], [VPx + 50, hz], [1460, H], [140, H]];
    c.save(); c.fillStyle = vgrad(c, hz, H, [[0, '#9ad8f0'], [1, '#3aa0c8']]); c.beginPath(); wq.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.closePath(); c.fill(); c.clip();
    for (let i = 0; i < 26; i++) { const v = wrap(i / 26 + t * .05, 1), y = hz + v * v * (H - hz), s = .2 + v, x = mix2x(VPx, 800, v) + (hash(i, 2) - .5) * 900 * v; L(c, [[x - 40 * s, y], [x, y - 4 * s], [x + 40 * s, y]], 2 + 3 * v, '#e8f8ff', .8); }
    c.restore();
    L(c, [[VPx - 40, hz], [140, H]], 4, '#4a8a4a'); L(c, [[VPx + 50, hz], [1460, H]], 4, '#4a8a4a');                  // the banks' edges
    for (const [x, y, s] of [[1700, 640, 1], [1560, 630, .6], [160, 650, .8]]) { B(c, [[x - 10 * s, y], [x - 8 * s, y - 120 * s], [x + 8 * s, y - 120 * s], [x + 10 * s, y]], '#7a5a3a'); Eb(c, x, y - 170 * s, 90 * s, 80 * s, '#4a9a4a'); Eb(c, x - 30 * s, y - 200 * s, 40 * s, 30 * s, '#6ab85a', { w: 0 }); }   // trees on the banks
    for (let b = 0; b < 26; b++) { const x = 1480 + b * 18, sw = Math.sin(t * 1.6 + b) * 6; c.save(); c.strokeStyle = b % 2 ? '#4a8a3a' : '#6aa84a'; c.lineWidth = 6; c.beginPath(); c.moveTo(x, H + 10); c.quadraticCurveTo(x + sw, 980, x + sw * 2, 900 + (b % 4) * 20); c.stroke(); c.restore(); }   // reeds, foreground right
  };
  const mix2x = (a, b, u) => a + (b - a) * u;
  const CLOUD = { summer: { lit: '#ffffff', body: '#eef3fa', shade: '#c4d2e6' }, dawn: { lit: '#ffe6d6', body: '#e8a8c0', shade: '#a072a0' }, night: { lit: '#c8d0f4', body: '#5a64a8', shade: '#363c7a' } };
  const cloud = (c, x, y, w, t, kind, seed, al = .9) => PT.cloud(c, x, y, w, t, { seed: seed + { summer: 40, dawn: 60, night: 80 }[kind], al, ...CLOUD[kind] });

  // ---------- the train at night (f08): painted land, an embankment with sleepers, poles in front ----------
  T.nightLand = (c, t) => {
    c.fillStyle = vgrad(c, 0, 760, [[0, '#121844'], [.55, '#2a3678'], [1, '#6a6cb8']]); c.fillRect(0, 0, W, 760);
    stars(c, [0, 110, W, 360], t, 50, 9); moonFlat(c, 1600, 230, 80); cloud(c, 500, 220, 800, t, 'night', 3, .7);
    ridge(c, 620, 150, 300, t * 2, vgrad(c, 460, 660, [[0, '#323c86'], [1, '#1c2460']]), { rim: '#a8b4ec', seed: 3 }); ridge(c, 700, 60, 160, t * 5, vgrad(c, 630, 720, [[0, '#1e2864'], [1, '#141a4a']]), { rim: '#5a66b0', seed: 6 });
    for (let i = 0; i < 40; i++) { const x = wrap(i * 61 - t * 5, W + 40) - 20, y = 690 + hash(i, 5) * 40; c.fillStyle = alpha('#ffd27a', .5 + .5 * hash(i, 6)); c.fillRect(x, y, 4, 3); }
    treeLine(c, 740, t * 12, '#0e1336', { r: 24, gap: 36, seed: 8 });
    c.fillStyle = vgrad(c, 760, H, [[0, '#3a3a5e'], [1, '#55557a']]); c.fillRect(0, 760, W, H - 760);                 // the embankment
    for (let x = -40; x < W + 40; x += 34) B(c, [[x, 772], [x + 22, 772], [x + 26, 782], [x - 4, 782]], '#6a5a4a', { w: 1.5 });   // sleepers
    L(c, [[0, 770], [W, 770]], 4, '#b8bcd8'); L(c, [[0, 778], [W, 778]], 3, '#9aa0c0');
    for (let i = 0; i < 60; i++) { const x = hash(i, 21) * W, y = 800 + hash(i, 22) * 260, r = 3 + hash(i, 23) * 6 * (y - 760) / 300; Eb(c, x, y, r, r * .7, '#6a6a8e', { w: 0 }); }   // gravel, larger near
  };
  T.trackFront = (c, t) => {   // two telegraph poles framing the shot, cropped by the frame, with sagging wires
    for (const [x, s] of [[150, 1.25], [1840, 1.1]]) { B(c, [[x - 16 * s, H + 10], [x - 12 * s, 110], [x + 12 * s, 110], [x + 16 * s, H + 10]], '#3a2e40', { w: 4 }); B(c, [[x - 90 * s, 190], [x + 90 * s, 190], [x + 90 * s, 206], [x - 90 * s, 206]], '#3a2e40', { w: 3 }); for (const d of [-70, -30, 30, 70]) Eb(c, x + d * s, 184, 6, 8, '#cfd4e8', { w: 2 }); }
    for (const d of [-70, -30, 30, 70]) { c.save(); c.strokeStyle = '#2a2234'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(150 + d * 1.25, 182); c.quadraticCurveTo(CX, 300 + Math.sin(t * .8 + d) * 4, 1840 + d * 1.1, 182); c.stroke(); c.restore(); }
    for (let b = 0; b < 40; b++) { const x = b * 50 + 10, sw = Math.sin(t * 1.4 + b) * 5; c.save(); c.strokeStyle = b % 2 ? '#26304e' : '#323e62'; c.lineWidth = 6; c.beginPath(); c.moveTo(x, H + 10); c.quadraticCurveTo(x + sw, 1010, x + sw * 2, 960 + (b % 4) * 16); c.stroke(); c.restore(); }
    nightWash(c, .85);
  };

  // ---------- the street (f10, f11): building fronts with side walls toward the vanishing point, a road in
  // perspective with a zebra crossing, and utility poles + wires in the foreground ----------
  const VPs = [1000, 560];
  T.street = (c, t, o = {}, BUILD = []) => {
    const { k = 0, gold = 0 } = o, kk = Math.max(k, gold), col = (a) => mix('#f4f6fa', a, kk), ln = mix('#b0b4c4', BGL, kk);
    c.fillStyle = vgrad(c, 0, 820, [[0, mix(mix('#e6eaf4', '#9ac4ec', k), '#ffc88a', gold)], [1, mix(mix('#f4f6fa', '#d8ecf8', k), '#ffe8c0', gold)]]); c.fillRect(0, 0, W, 820);
    if (kk > 0) { c.save(); c.globalAlpha = kk; cloud(c, 600, 160, 700, t, 'summer', 6, .9); c.restore(); }
    ridge(c, 600, 40, 120, 0, col('#c8d0e0'), { seed: 9, y1: 820 });                                                // far city blocks, flattened by distance
    const COLS = ['#c87a6a', '#7a8ac8', '#e0b060', '#6aa08a', '#b86aa0', '#8a7ac8'];
    BUILD.forEach(([x, top, w], i) => {                                                                               // each block: its side wall first, then the front
      const edge = x + w < VPs[0] ? x + w : x > VPs[0] ? x : null, d = .14;
      if (edge !== null) { const bx = VPs[0] + (edge - VPs[0]) * (1 - d), btop = VPs[1] + (top - VPs[1]) * (1 - d), bbot = VPs[1] + (820 - VPs[1]) * (1 - d);
        B(c, [[edge, top], [bx, btop], [bx, bbot], [edge, 820]], mix('#e8eaf0', mix(COLS[i], '#3a2a4a', .3), kk), { line: ln }); }
      B(c, [[x, 820], [x, top], [x + w, top], [x + w, 820]], col(COLS[i]), { line: ln });
      B(c, [[x - 8, top - 16], [x + w + 8, top - 16], [x + w + 8, top], [x - 8, top]], col(mix(COLS[i], '#ffffff', .3)), { line: ln });   // a parapet
      for (let r = 0; r < 4; r++) for (let q = 0; q < 2; q++) { const wx = x + 40 + q * (w / 2), wy = top + 50 + r * 120; if (wy > 740) continue;
        B(c, [[wx, wy], [wx + 70, wy], [wx + 70, wy + 70], [wx, wy + 70]], gold > 0 ? mix(col('#bcd8f0'), '#ffe0a0', gold) : col('#bcd8f0'), { line: ln, w: 2 });
        if (kk > 0) { L(c, [[wx + 35, wy], [wx + 35, wy + 70]], 2, ln, kk); B(c, [[wx - 6, wy + 70], [wx + 76, wy + 70], [wx + 76, wy + 78], [wx - 6, wy + 78]], col('#ffffff'), { line: ln, w: 2 }); } } });
    B(c, [[-10, 820], [W + 10, 820], [W + 10, 870], [-10, 870]], col('#d8d2c4'), { line: ln });                       // pavement
    c.fillStyle = col('#8a8ca4'); c.fillRect(-10, 870, W + 20, H - 870); L(c, [[0, 870], [W, 870]], 4, ln);           // road
    for (const X of [-900, -300, 300, 900, 1500, 2100, 2900]) L(c, [[VPs[0] + (X - VPs[0]) * (870 - VPs[1]) / (H - VPs[1]), 870], [X, H]], 2, mix('#c8ccd8', '#e8e4d8', kk));   // lines running toward the vanishing point
    for (let s = 0; s < 8; s++) { const x0 = 360 + s * 70, q = [[x0, 900], [x0 + 40, 900], [x0 + 40 + (x0 - VPs[0]) * .5, H], [x0 + (x0 - VPs[0]) * .5, H]]; B(c, q, col('#f4f4f0'), { line: ln, w: 1.5 }); }   // zebra crossing
    for (const [x, s] of [[110, 1.3], [1790, 1.15]]) {                                                                  // utility poles, nearest of all
      B(c, [[x - 18 * s, H + 10], [x - 13 * s, 100], [x + 13 * s, 100], [x + 18 * s, H + 10]], col('#8a8478'), { line: ln, w: 4 });
      B(c, [[x - 70 * s, 200], [x + 70 * s, 200], [x + 70 * s, 214], [x - 70 * s, 214]], col('#6a6458'), { line: ln });
      B(c, [[x + 20 * s, 300], [x + 70 * s, 300], [x + 70 * s, 360], [x + 20 * s, 360]], col('#9aa0a8'), { line: ln }); }   // a transformer box
    for (const dy of [0, 26, 50]) { c.save(); c.strokeStyle = mix('#a8acb8', '#3a2e40', kk); c.lineWidth = 2.5; c.beginPath(); c.moveTo(110 - 80, 196 + dy); c.quadraticCurveTo(CX, 300 + dy + Math.sin(t * .7 + dy) * 3, 1790 + 80, 196 + dy); c.stroke(); c.restore(); }
  };

  // ---------- the station at dawn (f12): the platform runs off into the distance under a canopy ----------
  const VPp = [1880, 600];
  const pp = (x, y, d) => [VPp[0] + (x - VPp[0]) * (1 - d), VPp[1] + (y - VPp[1]) * (1 - d)];   // d: 0 near .. 1 at the vanishing point
  T.platform = (c, t, k) => {
    c.fillStyle = vgrad(c, 0, 700, [[0, '#3a3a8a'], [.5, '#d07a96'], [1, '#ffcf8a']]); c.fillRect(0, 0, W, 700);
    Eb(c, 1500, 640, 110, 110, '#fff2c8', { line: '#ffd8a0' }); glow(c, 1500, 640, 420, '#ffd8a0', .6);
    cloud(c, 500, 260, 700, t, 'dawn', 12, .85); cloud(c, 1300, 200, 500, t, 'dawn', 13, .75);
    ridge(c, 640, 50, 150, 0, '#8a5a8a', { seed: 11, y1: 700 }); treeLine(c, 680, 0, '#6a4a7a', { r: 22, gap: 34, seed: 12 });
    const fl = mix('#d8d4e4', '#c8a8a8', k);
    B(c, [[-10, 700], [W + 10, 700], [W + 10, H], [-10, H]], fl, { w: 0 });                                            // the platform floor
    for (let i = 0; i < 9; i++) { const [sx, sy] = pp(-400 + i * 330, H, 0), u = (700 - VPp[1]) / (sy - VPp[1]); L(c, [[sx, sy], [VPp[0] + (sx - VPp[0]) * u, 700]], 2, mix('#c0bcd0', '#b89a9a', k)); }   // tile seams to the vanishing point
    for (let j = 1; j < 8; j++) { const d = 1 - Math.pow(j / 8, 1.6), y = VPp[1] + (H - VPp[1]) * (1 - d); if (y > 700) L(c, [[0, y], [W, y]], 2, mix('#c0bcd0', '#b89a9a', k)); }
    B(c, [pp(-300, 1000, 0), pp(-300, 1040, 0), pp(-300, 1040, .97), pp(-300, 1000, .97)], '#f2c84a', { w: 2 });         // the yellow safety strip
    for (let i = 7; i >= 0; i--) { const d = .05 + i * .11, [x0, y0] = pp(1180, 150, d), [, y1] = pp(1180, 700, d), s = 1 - d;   // pillars along the platform, shrinking into the distance
      B(c, [[x0 - 16 * s, y0], [x0 + 16 * s, y0], [x0 + 16 * s, y1], [x0 - 16 * s, y1]], mix('#8a7a9a', '#9a6a6a', k)); B(c, [[x0 - 26 * s, y1 - 6 * s], [x0 + 26 * s, y1 - 6 * s], [x0 + 26 * s, y1], [x0 - 26 * s, y1]], mix('#6a5a7a', '#7a5a5a', k)); }
    const cq = [pp(1100, 110, 0), pp(2600, 110, 0), pp(2600, 110, .97), pp(1100, 110, .97)], eq = [pp(1100, 110, 0), pp(1100, 150, 0), pp(1100, 150, .97), pp(1100, 110, .97)];
    B(c, [[1100, 0], [W + 10, 0], cq[1], cq[2], cq[3], cq[0]], mix('#6a5a7e', '#7a5a6a', k));                           // the canopy roof over the platform
    B(c, eq, mix('#e8dcc8', '#e8c8b8', k));                                                                               // its front edge, catching the dawn
    for (let i = 0; i < 6; i++) { const d = .08 + i * .13, [lx, ly] = pp(1800, 132, d), s = 1 - d; B(c, [[lx - 70 * s, ly], [lx + 70 * s, ly], [lx + 70 * s, ly + 10 * s], [lx - 70 * s, ly + 10 * s]], '#fff2c0', { w: 1.5 }); glow(c, lx, ly + 12 * s, 140 * s, '#fff0c0', .3); }   // canopy lights
  };
  T.dawnField = (c, t) => {
    c.fillStyle = vgrad(c, 0, 760, [[0, '#3a3a8a'], [.55, '#e07a8a'], [1, '#ffd08a']]); c.fillRect(0, 0, W, 780);
    const sun = sm(0, 9, t, easeInOutSine); Eb(c, CX, 760 - sun * 60, 120, 120, '#fff2c8', { line: '#ffd8a0' }); glow(c, CX, 720, 500 + 300 * sun, '#ffe0a0', .5);
    cloud(c, 500, 300, 700, t, 'dawn', 21, .85); cloud(c, 1450, 240, 600, t, 'dawn', 22, .75);
    ridge(c, 700, 70, 200, 0, '#8a5a8a', { rim: '#ffb8a0', seed: 14, y1: 780 }); treeLine(c, 745, t * 4, '#5a3a6a', { r: 24, gap: 36, seed: 15 });
    c.fillStyle = vgrad(c, 760, H, [[0, '#4a3a5e'], [1, '#6a4a6e']]); c.fillRect(0, 760, W, H - 760);
    for (let b = 0; b < 40; b++) { const x = b * 50 + 10, sw = Math.sin(t * 1.4 + b) * 5; c.save(); c.strokeStyle = b % 2 ? '#3a2a4e' : '#4a3a5e'; c.lineWidth = 6; c.beginPath(); c.moveTo(x, H + 10); c.quadraticCurveTo(x + sw, 1010, x + sw * 2, 960 + (b % 4) * 16); c.stroke(); c.restore(); }
  };
})();
