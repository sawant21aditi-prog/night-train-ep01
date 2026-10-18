// The Night Train — TV-cartoon look (Shin-chan / TheOdd1sOut references): crisp flat colour, one clean dark
// outline, bright detailed sets that stay sharp behind close-ups, reaction marks, and burst backgrounds for takes.
// Seek-safe: everything is a function of t. Load after anime.js and before direct.js.
const TOON = (() => {
  const INK = '#2e2230';
  const P = (c, pts, fill, o = {}) => AN.cel(c, pts, fill, { line: INK, w: 5, smooth: false, ...o });
  const R = (c, x, y, w, h, fill, o = {}) => P(c, [[x, y], [x + w, y], [x + w, y + h], [x, y + h]], fill, o);
  const L = (c, pts, w = 4, color = INK, al = 1) => AN.stroke(c, pts, { w, color, al });
  const E = (c, x, y, rx, ry, fill, o = {}) => AN.cel(c, ellPts(x, y, rx, ry, 0, 28), fill, { line: INK, w: 5, ...o });

  // ---------- the carriage: warm lamp-lit interior, night outside the window ----------
  const WIN = [430, 170, 1060, 400];
  function view(c, t) {   // what slides past the window: flat night, moon, two hill layers, a village, poles
    const [x, y, w, h] = WIN, g = c.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, '#1c2a66'); g.addColorStop(1, '#4a5fb0');
    c.save(); c.beginPath(); c.rect(x, y, w, h); c.clip();   // everything outside the train stays inside the glass
    c.fillStyle = g; c.fillRect(x, y, w, h);
    for (let i = 0; i < 26; i++) { const sx = x + ((i * 397) % w), sy = y + 20 + ((i * 131) % (h * .5)), tw = .6 + .4 * Math.sin(t * 2 + i); c.fillStyle = alpha('#fff6d8', .8 * tw); c.fillRect(sx, sy, 4, 4); }
    E(c, x + w * .78, y + 90, 46, 46, '#fff4c8', { w: 4 }); E(c, x + w * .78 + 14, y + 80, 9, 8, '#efe0a8', { w: 0 });
    const hill = (col, base, amp, par, per) => { const off = t * par; c.fillStyle = col; c.beginPath(); c.moveTo(x, y + h);
      for (let s = 0; s <= 40; s++) { const xx = x + s / 40 * w; c.lineTo(xx, y + base + Math.sin((xx + off) / per) * amp + Math.sin((xx + off) / (per * .37)) * amp * .3); } c.lineTo(x + w, y + h); c.fill(); };
    hill('#2e3d86', h * .62, 26, 40, 210);
    for (let i = 0; i < 40; i++) { const lx = x + (((i * 83) - t * 40) % w + w) % w, ly = y + h * .62 + Math.sin(((lx - x) + t * 40) / 210) * 26 - 8 - (i % 3) * 6; c.fillStyle = i % 4 ? '#ffd27a' : '#fff0c0'; c.fillRect(lx, ly, 3, 3); }   // far town lights
    for (let i = 0; i < 14; i++) { const tx = x + (((i * 150) - t * 75) % (w + 150) + w + 150) % (w + 150) - 75, ty = y + h * .7; E(c, tx, ty - 30, 30 + (i % 3) * 8, 36 + (i % 2) * 10, '#1e2a62', { w: 0 }); R(c, tx - 4, ty - 4, 8, 30, '#1e2a62', { w: 0 }); }   // trees
    hill('#22306e', h * .74, 18, 110, 150);
    for (let i = 0; i < 7; i++) { const hx = x + (((i * 260) - t * 110) % (w + 260) + w + 260) % (w + 260) - 130, hy = y + h * .74 - 4;
      R(c, hx - 34, hy - 46, 68, 46, '#1a2458', { w: 3 }); P(c, [[hx - 42, hy - 46], [hx, hy - 78], [hx + 42, hy - 46]], '#141c48', { w: 3 });
      R(c, hx - 12, hy - 34, 18, 16, i % 2 ? '#ffd27a' : '#ffb85a', { w: 2 }); }
    for (let i = 0; i < 3; i++) { const px = x + w + 200 - ((t * 900 + i * 560) % (w + 600)); R(c, px, y + 30, 14, h, '#141030', { w: 0 }); R(c, px - 44, y + 60, 102, 9, '#141030', { w: 0 }); }
    // a station light sweeps past every 7.5s (sound_mix.py times its whoosh to the same clock)
    const u = ((t + 2) % 7.5) / 7.5; if (u < .22) { const k = Math.sin(u / .22 * Math.PI), lx = x + w + 300 - u / .22 * (w + 600), lg = c.createLinearGradient(lx - 260, 0, lx + 260, 0);
      lg.addColorStop(0, 'rgba(255,214,140,0)'); lg.addColorStop(.5, `rgba(255,224,160,${.55 * k})`); lg.addColorStop(1, 'rgba(255,214,140,0)'); c.fillStyle = lg; c.fillRect(x, y, w, h); }
    c.restore();
  }
  // ---------- the wall calendar (its pages tear off in the "I blinked and it was March" shot) ----------
  const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  function calPage(c, m, w, h) {
    R(c, -w / 2, 0, w, h, '#fffaf0', { w: 3 }); R(c, -w / 2, 0, w, 54, '#d8505a', { w: 3 });
    NT.words(c, MONTHS[m % 12], 0, 28, { size: 34, color: '#fff8ea', weight: 'bold', font: 'Georgia, serif' });
    NT.words(c, String(1 + (m * 7) % 28), 0, 108, { size: 78, color: INK, weight: 'bold', font: 'Georgia, serif' });
    for (let r = 0; r < 4; r++) for (let k = 0; k < 7; k++) E(c, -w / 2 + 20 + k * (w - 40) / 6, 158 + r * 16, 3, 3, (r * 7 + k) % 9 === 0 ? '#d8505a' : '#b8b0a0', { w: 0 });
  }
  function calendar(c, cx, top, t, o = {}) {
    const { m = 9, u = -1, s = 1 } = o, w = 170, h = 230, sw = Math.sin(t * 2.3) * .02;
    c.save(); c.translate(cx, top); c.scale(s, s);
    L(c, [[0, -26], [-40, 0], [0, -26], [40, 0]], 3, BGL); E(c, 0, -28, 6, 6, '#a8acc0', { w: 2, line: BGL });
    c.rotate(sw);
    for (let k = 3; k >= 1; k--) { c.save(); c.translate(k * 2, k * 2); R(c, -w / 2, 0, w, h, '#e8dece', { w: 2, line: BGL }); c.restore(); }   // the pad thickness
    calPage(c, u >= 0 ? m + 1 : m, w, h);
    if (u >= 0 && u < 1) { c.save(); c.globalAlpha *= 1 - u; c.translate(u * 520, -u * 380 + u * u * 300); c.rotate(u * 1.3); c.scale(1 - u * .2, 1 - u * .2); calPage(c, m, w, h); c.restore(); }   // the torn page flies off
    for (let k = 0; k < 6; k++) E(c, -w / 2 + 18 + k * (w - 36) / 5, 4, 5, 5, '#a8acc0', { w: 2, line: BGL });   // spiral binding
    c.restore();
  }
  function calendarShot(c, t) {   // the camera pushes in on the calendar while months tear off, faster and faster
    const n = t * .45 + t * t * .035, i = Math.floor(n), u = n - i, z = 1.9 + .5 * easeInOutSine(Math.min(1, t / 5.8));
    resetT(c); c.save(); c.translate(CX, CY); c.scale(z, z); c.translate(-CAL[0] - 170, -CAL[1] - 90); carriage(c, t, { cal: { m: i, u } }); c.restore();
  }

  // ---------- the carriage, in one-point perspective down the aisle (like the sleeper-train episode) ----------
  // Painted background rules: thin coloured lines (BGL), muted pastels, soft shading; only characters get the bold ink.
  const BGL = '#6e5f72', VP = [1150, 450], LW = -260, RW = 2180, FL = 1300, CE = -160, ZF = 4.2;
  const sOf = z => 1 / (1 + z), pr = (X, Y, z) => { const s = sOf(z); return [VP[0] + (X - VP[0]) * s, VP[1] + (Y - VP[1]) * s]; };
  const B = (c, pts, fill, o = {}) => AN.cel(c, pts, fill, { line: BGL, w: 3, smooth: false, ...o });
  const wallQ = (X, Y0, Y1, z0, z1) => [pr(X, Y0, z0), pr(X, Y0, z1), pr(X, Y1, z1), pr(X, Y1, z0)];
  const flatQ = (X0, X1, Y, z0, z1) => [pr(X0, Y, z0), pr(X1, Y, z0), pr(X1, Y, z1), pr(X0, Y, z1)];
  const faceQ = (X0, X1, Y0, Y1, z) => [pr(X0, Y0, z), pr(X1, Y0, z), pr(X1, Y1, z), pr(X0, Y1, z)];
  const CAL = [235, 250];   // where the calendar hangs on screen (left bulkhead)
  const quadPath = (c, q) => { c.beginPath(); q.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.closePath(); };

  function windowView(c, q, t, k) {   // night outside one window: sky, hills, a few lights streaking past
    c.save(); quadPath(c, q); c.clip();
    const ys = q.map(p => p[1]), y0 = Math.min(...ys), y1 = Math.max(...ys), xs = q.map(p => p[0]), x0 = Math.min(...xs), x1 = Math.max(...xs), g = c.createLinearGradient(0, y0, 0, y1);
    g.addColorStop(0, '#26306a'); g.addColorStop(.7, '#4a5a9c'); g.addColorStop(1, '#2a2f5e'); c.fillStyle = g; c.fillRect(x0, y0, x1 - x0, y1 - y0);
    c.fillStyle = '#1e2656'; c.beginPath(); c.moveTo(x0, y1); for (let s = 0; s <= 12; s++) { const xx = x0 + s / 12 * (x1 - x0); c.lineTo(xx, y0 + (y1 - y0) * (.62 + .08 * Math.sin(xx / 60 + t * .8 + k))); } c.lineTo(x1, y1); c.fill();
    for (let i = 0; i < 4; i++) { const u = ((t * .7 + i * .27 + k * .13) % 1), lx = x1 - u * (x1 - x0) * 1.3; c.fillStyle = i % 2 ? '#ffd27a' : '#fff0c0'; c.fillRect(lx, y0 + (y1 - y0) * (.6 + .04 * i), Math.max(2, (x1 - x0) * .05), 3); }
    const u = ((t * .9 + k * .31) % 1); if (u < .3) { c.fillStyle = '#141030'; c.fillRect(x1 - u / .3 * (x1 - x0) * 1.2, y0, Math.max(3, (x1 - x0) * .04), y1 - y0); }   // a pole flicks past
    const v = ((t + 2) % 7.5) / 7.5; if (v < .22) { c.fillStyle = `rgba(255,224,160,${.5 * Math.sin(v / .22 * Math.PI)})`; c.fillRect(x0, y0, x1 - x0, y1 - y0); }   // the station light (sound_mix.py whoosh)
    c.restore();
    c.save(); c.globalAlpha = .16; c.fillStyle = '#ffffff'; c.beginPath(); c.moveTo(q[0][0], q[0][1]); c.lineTo(mix2(q[0], q[1], .5)[0], mix2(q[0], q[1], .5)[1]); c.lineTo(mix2(q[0], q[3], .5)[0], mix2(q[0], q[3], .5)[1]); c.fill(); c.restore();
    B(c, q, 'rgba(0,0,0,0)', { w: 6, line: '#a88a68' });
  }
  const mix2 = (a, b, u) => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u];
  function seam(c, a, b, w = 34, al = .10) { c.save(); c.globalAlpha = al; c.strokeStyle = '#3a2a4a'; c.lineWidth = w; c.filter = 'blur(10px)'; c.beginPath(); c.moveTo(...a); c.lineTo(...b); c.stroke(); c.restore(); }   // soft painted shading in the corners

  function carriage(c, t, o = {}) {
    const rock = Math.sin(t * 2.3) * 1.5;   // the carriage rocks a little
    c.save(); c.translate(0, rock);
    // far end: the connecting door with its little window and a route map above
    const fq = faceQ(LW, RW, CE, FL, ZF); B(c, fq, '#d6c9b2');
    B(c, faceQ(1040, 1260, 170, FL, ZF), '#b8a68c'); B(c, faceQ(1080, 1220, 260, 560, ZF), '#4a5a9c'); B(c, faceQ(1190, 1210, 700, 760, ZF), '#a8acc0');
    B(c, faceQ(700, 1600, 40, 130, ZF), '#fffaf0'); { const [a] = faceQ(760, 760, 85, 85, ZF), [b] = faceQ(1540, 1540, 85, 85, ZF); L(c, [a, b], 2, '#d8505a'); for (let k = 0; k < 6; k++) E(c, a[0] + (b[0] - a[0]) * k / 5, a[1], 3, 3, k === 4 && Math.sin(t * 5) > 0 ? '#ff5050' : '#d8505a', { w: 0 }); }
    // ceiling with a strip of lamps; floor with a runner down the aisle
    B(c, [pr(LW, CE, 0), pr(RW, CE, 0), pr(RW, CE, ZF), pr(LW, CE, ZF)], '#efe8d8');
    for (let k = 0; k < 5; k++) { const z0 = .3 + k * .85; B(c, flatQ(950, 1350, CE, z0, z0 + .35), '#fff6d6'); const [gx, gy] = pr(1150, CE, z0 + .17); glow(c, gx, gy, 160 * sOf(z0), '#fff0c0', .35); }
    B(c, [pr(LW, FL, 0), pr(RW, FL, 0), pr(RW, FL, ZF), pr(LW, FL, ZF)], '#a9aec0');
    B(c, flatQ(820, 1480, FL, 0, ZF), '#8a6a8a'); for (const X of [860, 1440]) L(c, [pr(X, FL, 0), pr(X, FL, ZF)], 2, '#c8a86a');
    for (let k = 1; k < 9; k++) L(c, [pr(LW, FL, k * .5), pr(RW, FL, k * .5)], 2, '#979cb0');
    // both side walls: beige above, panelled below, windows receding with lavender curtains
    for (const X of [LW, RW]) {
      B(c, wallQ(X, CE, FL, 0, ZF), '#e6dac4'); B(c, wallQ(X, 640, FL, 0, ZF), '#c8b49a');
      for (let k = 0; k < 9; k++) L(c, [pr(X, 640, k * .5), pr(X, FL, k * .5)], 2, '#b09c82');
      for (let b = 3; b >= 0; b--) { const z0 = .3 + b * 1.0, z1 = z0 + .72; windowView(c, wallQ(X, 150, 600, z0, z1), t, b + (X > 0 ? 5 : 0));
        const sw = Math.sin(t * 1.4 + b) * 4 * sOf(z0); B(c, [pr(X, 160, z0 - .08), pr(X, 160, z0 + .05), pr(X, 400, z0), pr(X, 600, z0 - .02)].map(([x, y]) => [x + sw, y]), '#b9b2d6'); }
      // luggage rack along the wall, with bags
      const ri = X < 0 ? X + 300 : X - 300; L(c, [pr(X, 140, 0), pr(X, 140, ZF)], 3, BGL); L(c, [pr(ri, 150, 0), pr(ri, 150, ZF)], 4, '#9a9eb4');
      for (let k = 0; k < 9; k++) L(c, [pr(X, 140, k * .5), pr(ri, 150, k * .5)], 2, '#9a9eb4');
      for (const [z, col] of [[.6, '#5a8a6a'], [1.7, '#c88a3a'], [2.9, '#7a6a9a']]) { const q = faceQ(Math.min(X, ri) + 40, Math.max(X, ri) - 60, 70, 150, z); B(c, q, col); }
      // hanging grab handles along the inner rail
      const hX = X < 0 ? X + 520 : X - 520; L(c, [pr(hX, 200, 0), pr(hX, 200, ZF)], 3, '#9a9eb4');
      for (let k = 0; k < 8; k++) { const z = .25 + k * .5, s = sOf(z), [hx, hy] = pr(hX, 200, z), sw = Math.sin(t * 1.8 + k * .7 + X) * .12; c.save(); c.translate(hx, hy); c.rotate(sw); L(c, [[0, 0], [0, 60 * s]], Math.max(1.5, 4 * s), '#8a8ea4'); E(c, 0, 84 * s, 20 * s, 24 * s, 'rgba(0,0,0,0)', { w: Math.max(2, 6 * s), line: '#efe6d0' }); c.restore(); }
    }
    seam(c, pr(LW, FL, 0), pr(LW, FL, ZF)); seam(c, pr(RW, FL, 0), pr(RW, FL, ZF)); seam(c, pr(LW, CE, 0), pr(LW, CE, ZF), 26, .06); seam(c, pr(RW, CE, 0), pr(RW, CE, ZF), 26, .06);
    // seat rows: backs facing the camera, receding; white headrest cloths; the aisle side shows the seat's thickness
    for (let b = 7; b >= 0; b--) { const z = .2 + b * .5;
      for (const sd of [-1, 1]) { const X0 = sd < 0 ? LW : RW - 620, X1 = sd < 0 ? LW + 620 : RW, Xa = sd < 0 ? X1 : X0;
        B(c, [pr(Xa, 640, z), pr(Xa, 640, z + .22), pr(Xa, FL, z + .22), pr(Xa, FL, z)], '#5a9496');
        B(c, faceQ(X0, X1, 640, FL, z), '#72b0ae');
        B(c, faceQ(Xa - sd * 300, Xa - sd * 40, 640, 700, z - .001), '#fffaf0');
        L(c, [pr(X0 + 30, 840, z), pr(X1 - 30, 840, z)], Math.max(1, 3 * sOf(z)), '#5a9496'); } }
    // bulkheads at the near end: left one carries the calendar and a coach plate, right one the clock, a sign and a coat hook
    B(c, faceQ(LW, 380, CE, 620, .12), '#e4d6bc'); B(c, faceQ(RW - 640, RW, CE, 620, .12), '#e4d6bc');
    seam(c, pr(380, CE, .12), pr(380, 470, .12), 20, .08); seam(c, pr(RW - 640, CE, .12), pr(RW - 640, 470, .12), 20, .08);
    calendar(c, CAL[0], CAL[1], t, { ...(o.cal || {}), s: .9 });
    B(c, faceQ(-200, -60, 200, 250, .12), '#2a5a9a'); { const [px, py] = pr(-130, 225, .12); NT.words(c, 'C-7', px, py, { size: 22, color: '#fff8ea', weight: 'bold' }); }
    { const [cx, cy] = pr(1760, 300, .12), a = t * .02, b2 = t * .24; E(c, cx, cy, 34, 34, '#fff8ea', { line: BGL, w: 4 }); for (let k = 0; k < 12; k++) { const an = k / 12 * TAU; E(c, cx + Math.cos(an) * 26, cy + Math.sin(an) * 26, 2, 2, BGL, { w: 0 }); } L(c, [[cx, cy], [cx + Math.sin(a) * 16, cy - Math.cos(a) * 16]], 5, INK); L(c, [[cx, cy], [cx + Math.sin(b2) * 24, cy - Math.cos(b2) * 24]], 3, INK); }
    { const [sx, sy] = pr(1620, 380, .12); E(c, sx, sy, 22, 22, '#fff8ea', { line: '#d8403a', w: 5 }); L(c, [[sx - 15, sy - 15], [sx + 15, sy + 15]], 5, '#d8403a'); }
    { const [hx, hy] = pr(1960, 260, .12); L(c, [[hx, hy], [hx - 14, hy + 14]], 5, BGL); B(c, [[hx - 50, hy + 14], [hx + 18, hy + 14], [hx + 4, hy - 12], [hx - 36, hy - 12]], '#5a4a3a'); B(c, [[hx - 62, hy + 14], [hx + 30, hy + 14], [hx + 30, hy + 22], [hx - 62, hy + 22]], '#5a4a3a');
      const us = Math.sin(t * 2.3) * .05; c.save(); c.translate(hx - 26, hy + 30); c.rotate(us); L(c, [[0, 0], [0, 120]], 5, '#3a3a5a'); B(c, [[-16, 18], [16, 18], [7, 120], [-7, 120]], '#3a6ad8'); c.restore(); }
    // the sleeping cat on the near-left rack, and a bag by the seat
    { const [cx, cy] = pr(RW - 150, 140, 1.2), s = sOf(1.2), cb = breathe(t, 3.2) * 3 * s; B(c, [[cx - 70 * s, cy], [cx - 64 * s, cy - 34 * s - cb], [cx + 10 * s, cy - 42 * s - cb], [cx + 56 * s, cy - 26 * s], [cx + 60 * s, cy]], '#f4ecdc'); B(c, [[cx + 40 * s, cy - 30 * s], [cx + 54 * s, cy - 54 * s], [cx + 66 * s, cy - 32 * s]], '#f4ecdc'); }
    B(c, [[180, 900], [330, 900], [340, 990], [170, 990]], '#7a5a9a'); L(c, [[205, 900], [225, 868], [285, 868], [305, 900]], 5, BGL);
    // night: a faint blue-violet wash over the whole carriage, the far end a little darker
    c.save(); c.globalCompositeOperation = 'multiply'; const ng = c.createRadialGradient(VP[0], VP[1], 80, VP[0], VP[1], 1300); ng.addColorStop(0, 'rgba(200,198,238,1)'); ng.addColorStop(1, 'rgba(246,242,252,1)'); c.fillStyle = ng; c.fillRect(-20, -20, W + 40, H + 40); c.restore();
    c.restore();
  }
  function table(c, t) {   // the little table between them, in front of the cast: chai, a thermos, an orange
    P(c, [[620, 800], [1300, 800], [1330, 850], [590, 850]], '#d8955a'); R(c, 590, 850, 740, 22, '#a86a34');
    R(c, 930, 872, 60, 220, '#8a5428');
    R(c, 760, 742, 44, 60, '#ffffff', { w: 4 }); R(c, 764, 756, 36, 44, '#c8742c', { w: 0 }); L(c, [[804, 754], [822, 762], [804, 782]], 4);
    for (let k = 0; k < 2; k++) L(c, [[772 + k * 18, 734], [768 + k * 18, 712 + Math.sin(t * 3 + k) * 4], [776 + k * 18, 690]], 3, 'rgba(120,110,140,.6)');
    R(c, 1080, 690, 56, 112, '#e05a5a'); R(c, 1074, 676, 68, 22, '#7a7e96'); L(c, [[1088, 720], [1088, 780]], 4, '#ff9a9a');
    E(c, 1200, 778, 26, 24, '#ff9a2a', { w: 4 }); L(c, [[1200, 754], [1206, 742]], 4, '#3a8a3a');
  }

  // ---------- reaction marks, drawn on the head (char-local units, head centre at hx, hy) ----------
  function marks(c, hx, hy, exp, t, s = 1) {
    c.save(); c.translate(hx, hy); c.scale(s, s);
    if (exp === 'tired' || exp === 'skeptic') {   // one big sweat drop on the temple, sliding a little
      const dy = (t * 6) % 18; c.save(); c.translate(118, -40 + dy);
      AN.cel(c, [[0, -34], [18, 0], [10, 16], [-10, 16], [-18, 0]], '#bfe4ff', { line: INK, w: 4 }); L(c, [[-6, -6], [-2, 6]], 3, '#ffffff'); c.restore(); }
    if (exp === 'sad') for (let k = 0; k < 5; k++) L(c, [[-60 + k * 30, -120], [-60 + k * 30, -40]], 4, alpha('#5a4aa8', .7));   // gloom lines over the brow
    if (exp === 'surprised') for (let k = 0; k < 3; k++) { const a = -1.9 + k * .45; L(c, [[Math.cos(a) * 170, Math.sin(a) * 170 - 20], [Math.cos(a) * 220, Math.sin(a) * 220 - 20]], 6); }   // shock lines
    if (exp === 'laugh' || exp === 'wonder') { for (const sd of [-1, 1]) for (let k = 0; k < 3; k++) L(c, [[sd * 52 + k * 9 - 9, 22], [sd * 52 + k * 9 - 3, 34]], 3, '#e0507a'); }   // blush hatching
    if (exp === 'wonder') for (let k = 0; k < 3; k++) { const a = t * 2 + k * 2.1, r = 1 + .3 * Math.sin(t * 6 + k); star(c, Math.cos(a) * 190, -60 + Math.sin(a) * 90, 16 * r, '#fff3a0'); }
    c.restore();
  }
  function star(c, x, y, r, col) { const p = []; for (let k = 0; k < 8; k++) { const rr = k % 2 ? r * .35 : r, a = k * Math.PI / 4; p.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]); } AN.cel(c, p, col, { line: INK, w: 3, smooth: false }); }

  // ---------- burst backgrounds for big reactions (the classic TV-cartoon "take") ----------
  const BURST = { surprised: ['#2a5ad8', '#bcd4ff'], laugh: ['#ffb02a', '#fff2a0'], wonder: ['#ff7ab8', '#ffe0f0'], skeptic: ['#7a5ad8', '#d8ccff'], sad: ['#3a3a7a', '#8a8ac8'] };
  function burst(c, exp, t, fx = CX, fy = CY) {
    const [a, b] = BURST[exp] || BURST.surprised, g = c.createRadialGradient(fx, fy, 50, fx, fy, 1300); g.addColorStop(0, b); g.addColorStop(1, a);
    resetT(c); c.fillStyle = g; c.fillRect(0, 0, W, H);
    c.save(); c.translate(fx, fy); c.rotate(t * .4);
    for (let k = 0; k < 28; k++) { const an = k / 28 * TAU, w2 = .05 + .02 * Math.sin(k * 3.1); c.fillStyle = alpha('#ffffff', k % 2 ? .35 : .18);
      c.beginPath(); c.moveTo(0, 0); c.lineTo(Math.cos(an - w2) * 1600, Math.sin(an - w2) * 1600); c.lineTo(Math.cos(an + w2) * 1600, Math.sin(an + w2) * 1600); c.fill(); }
    c.restore();
    if (exp === 'wonder' || exp === 'laugh') for (let k = 0; k < 9; k++) { const u = (t * .6 + k / 9) % 1; star(c, fx + Math.cos(k * 2.4) * (300 + u * 600), fy + Math.sin(k * 2.4) * (200 + u * 400), 18 + u * 18, '#ffffff'); }
  }
  return { carriage, table, marks, burst, star, calendarShot, INK };
})();
window.TOON = TOON;
