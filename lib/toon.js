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
    c.fillStyle = g; c.fillRect(x, y, w, h);
    for (let i = 0; i < 26; i++) { const sx = x + ((i * 397) % w), sy = y + 20 + ((i * 131) % (h * .5)), tw = .6 + .4 * Math.sin(t * 2 + i); c.fillStyle = alpha('#fff6d8', .8 * tw); c.fillRect(sx, sy, 4, 4); }
    E(c, x + w * .78, y + 90, 46, 46, '#fff4c8', { w: 4 }); E(c, x + w * .78 + 14, y + 80, 9, 8, '#efe0a8', { w: 0 });
    const hill = (col, base, amp, par, per) => { const off = t * par; c.fillStyle = col; c.beginPath(); c.moveTo(x, y + h);
      for (let s = 0; s <= 40; s++) { const xx = x + s / 40 * w; c.lineTo(xx, y + base + Math.sin((xx + off) / per) * amp + Math.sin((xx + off) / (per * .37)) * amp * .3); } c.lineTo(x + w, y + h); c.fill(); };
    hill('#2e3d86', h * .62, 26, 40, 210); hill('#22306e', h * .74, 18, 110, 150);
    for (let i = 0; i < 7; i++) { const hx = x + (((i * 260) - t * 110) % (w + 260) + w + 260) % (w + 260) - 130, hy = y + h * .74 - 4;
      R(c, hx - 34, hy - 46, 68, 46, '#1a2458', { w: 3 }); P(c, [[hx - 42, hy - 46], [hx, hy - 78], [hx + 42, hy - 46]], '#141c48', { w: 3 });
      R(c, hx - 12, hy - 34, 18, 16, i % 2 ? '#ffd27a' : '#ffb85a', { w: 2 }); }
    for (let i = 0; i < 3; i++) { const px = x + w + 200 - ((t * 900 + i * 560) % (w + 600)); R(c, px, y + 30, 14, h, '#141030', { w: 0 }); R(c, px - 44, y + 60, 102, 9, '#141030', { w: 0 }); }
  }
  function carriage(c, t) {
    const rock = Math.sin(t * 2.3) * 1.5;   // the carriage rocks a little
    c.save(); c.translate(0, rock);
    // ceiling and lamps
    R(c, -10, -10, W + 20, 172, '#f3e8cf', { w: 0 }); L(c, [[0, 160], [W, 160]], 6);
    for (const lx of [560, 1360]) { E(c, lx, 82, 120, 26, '#fff2c4', { w: 4 }); }
    // walls: pale green above, wood wainscot below
    R(c, -10, 160, W + 20, 470, '#cfe6c4', { w: 0 }); R(c, -10, 608, W + 20, 26, '#f0e2c2', { w: 5 });
    R(c, -10, 634, W + 20, 170, '#c98a55', { w: 5 }); for (let x = 30; x < W; x += 96) L(c, [[x, 640], [x, 800]], 3, '#9a6234');
    // the window: wood frame, two panes, curtains tied back
    const [x, y, w, h] = WIN; view(c, t);
    R(c, x - 30, y - 30, w + 60, 30, '#b8743e'); R(c, x - 30, y + h, w + 60, 30, '#b8743e'); R(c, x - 30, y, 30, h, '#b8743e'); R(c, x + w, y, 30, h, '#b8743e');
    R(c, x + w / 2 - 12, y, 24, h, '#b8743e'); R(c, x - 50, y + h + 16, w + 100, 26, '#d8955a');
    c.save(); c.globalAlpha = .18; c.fillStyle = '#ffffff'; c.beginPath(); c.moveTo(x + 60, y); c.lineTo(x + 200, y); c.lineTo(x + 60, y + 160); c.fill(); c.beginPath(); c.moveTo(x + w / 2 + 70, y); c.lineTo(x + w / 2 + 170, y); c.lineTo(x + w / 2 + 70, y + 110); c.fill(); c.restore();
    for (const sd of [-1, 1]) { const x0 = sd < 0 ? x - 30 : x + w + 30, d = -sd * 110, sw = Math.sin(t * 1.4 + sd) * 6;
      P(c, [[x0, y - 34], [x0 + d, y - 34], [x0 + d * .7 + sw, y + 150], [x0 + d * .45 + sw, y + h + 20], [x0, y + h + 20]], '#f2a0aa', { w: 5 });
      L(c, [[x0 + d * .25, y], [x0 + d * .4 + sw, y + h]], 3, '#d87a88'); E(c, x0 + d * .55 + sw, y + 160, 22, 12, '#f6d36a', { w: 4 }); }
    // posters and a wall clock
    for (const [px, col, k] of [[95, '#f08a5a', 0], [1625, '#5ab0d8', 1]]) {
      R(c, px, 210, 200, 270, '#fff8ea'); R(c, px + 14, 224, 172, 180, col, { w: 3 });
      if (!k) { P(c, [[px + 14, 404], [px + 70, 300], [px + 110, 350], [px + 140, 316], [px + 186, 404]], '#6a5aa0', { w: 3 }); E(c, px + 140, 264, 22, 22, '#fff2a0', { w: 3 }); }
      else { R(c, px + 14, 344, 172, 60, '#2a7ab0', { w: 3 }); P(c, [[px + 60, 344], [px + 100, 300], [px + 140, 344]], '#ffffff', { w: 3 }); }
      L(c, [[px + 34, 432], [px + 166, 432]], 6, '#e0505a'); L(c, [[px + 54, 456], [px + 146, 456]], 4, '#8a6a4a'); }
    { const cx = 1560, cy = 540, a = t * .02, b = t * .24; E(c, cx, cy, 40, 40, '#fff8ea'); L(c, [[cx, cy], [cx + Math.sin(a) * 20, cy - Math.cos(a) * 20]], 5); L(c, [[cx, cy], [cx + Math.sin(b) * 30, cy - Math.cos(b) * 30]], 3); }
    // luggage racks with bags; a cat asleep on the right one
    for (const sd of [-1, 1]) { const x0 = sd < 0 ? 40 : W - 420; R(c, x0, 152, 380, 12, '#a8acc0', { w: 4 }); for (let k = 0; k < 6; k++) L(c, [[x0 + 20 + k * 68, 164], [x0 + 20 + k * 68, 178]], 3); }
    R(c, 70, 92, 150, 60, '#3a8a6a'); L(c, [[110, 92], [110, 74], [180, 74], [180, 92]], 5); R(c, 236, 104, 110, 48, '#e0a040'); L(c, [[236, 128], [346, 128]], 3, '#a86a20');
    const cb = breathe(t, 3.2) * 3; P(c, [[W - 390, 152], [W - 384, 116 - cb], [W - 304, 106 - cb], [W - 254, 120], [W - 248, 152]], '#f4ecdc', { w: 5 });
    P(c, [[W - 266, 122], [W - 250, 96], [W - 234, 114]], '#f4ecdc', { w: 4 }); L(c, [[W - 390, 146], [W - 430, 160], [W - 420, 176]], 7, '#f4ecdc'); L(c, [[W - 300, 128], [W - 286, 128]], 3);
    // hanging grab handles sway with the train
    L(c, [[0, 196], [W, 196]], 5, '#a8acc0');
    for (let i = 0; i < 7; i++) { const hx = 150 + i * 270, sw = Math.sin(t * 1.8 + i * .7) * .12; c.save(); c.translate(hx, 196); c.rotate(sw); L(c, [[0, 0], [0, 54]], 5, '#7a7e96'); E(c, 0, 76, 20, 24, 'rgba(0,0,0,0)', { w: 7, line: '#f0e6d0' }); c.restore(); }
    // seats: teal benches either side
    for (const sd of [-1, 1]) { const x0 = sd < 0 ? -20 : W + 20, x1 = sd < 0 ? 400 : W - 400;
      P(c, [[x0, 470], [x1 - sd * 40, 470], [x1, 510], [x1, 810], [x0, 810]], '#3aa69c');
      for (let k = 0; k < 5; k++) for (let j = 0; j < 4; j++) E(c, Math.min(x0, x1) + 50 + k * 74, 540 + j * 70, 5, 5, '#7fd4c8', { w: 0 });
      P(c, [[x0, 780], [x1 + sd * 10, 780], [x1 + sd * 10, 860], [x0, 860]], '#2e8a80'); }
    // floor: warm tiles running toward the far end
    R(c, -10, 800, W + 20, 300, '#ebcf9e', { w: 5 });
    for (let k = 0; k <= 12; k++) { const fx = k / 12 * W; L(c, [[CX + (fx - CX) * .55, 800], [fx + (fx - CX) * .5, H]], 3, '#d0ad78'); }
    for (const fy of [850, 920, 1010]) L(c, [[0, fy], [W, fy]], 3, '#d0ad78');
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
  return { carriage, table, marks, burst, star, INK };
})();
window.TOON = TOON;
