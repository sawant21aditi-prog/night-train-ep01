// The Night Train, Ep1 — scenes 8..13 (night-anime cel look). Original designs throughout.
const SC2 = (() => {
  const SC = window.SC;
  const C = AN.C, cel = AN.cel, st = AN.stroke;
  const fade = (t, a, b) => sm(a, b, t, easeInOutSine);

  // ---------- f08: the carriages (39s) — the train is a life, one carriage per year ----------
  function carriage(c, x, y, w, h, o = {}) {
    const { lit = 0, label: lb } = o;
    cel(c, [[x, y], [x + w, y], [x + w, y + h], [x, y + h]], lit ? '#d8574a' : '#2c3e6b', { shadow: [[x, y + h * .7], [x + w, y + h * .7], [x + w, y + h], [x, y + h]], w: Math.max(2, w * .025), smooth: false });
    const nw = 3, ww = w / (nw * 2 + 1);
    for (let i = 0; i < nw; i++) { const wx = x + ww * (1 + i * 2), wy = y + h * .2; glow(c, wx + ww / 2, wy + h * .2, ww * 1.4, C.practical, .55); c.fillStyle = '#ffd98a'; c.fillRect(wx, wy, ww, h * .38); }
    for (const fx of [x + w * .22, x + w * .78]) { c.fillStyle = '#0a0a1f'; c.beginPath(); c.arc(fx, y + h, h * .16, 0, TAU); c.fill(); }
    if (lit) { glow(c, x + w / 2, y + h / 2, w * 1.3, '#ffcf7a', .9 * lit); MG.rings(c, x + w / 2, y + h / 2, { r0: w * .6, gap: w * .25, n: 4, color: '#ffe0a0', al: .6 * lit, t: o.t || 0 }); }
    if (lb) NT.words(c, lb, x + w / 2, y - h * .45, { size: Math.max(22, h * .32), color: '#fff2dc' });
  }
  SC.f08 = (c, t) => {
    AN.sky(c, [0, 0, W, H]); AN.stars(c, [0, 0, W, 600], t); AN.moon(c, 1600, 220, 110, t, { rays: .5 });
    AN.cloud(c, 500, 200, 900, t, { seed: 3, al: .55 });
    const n = Math.round(5 + 25 * fade(t, 14.5, 18.5)), cw = 300, ch = 150, gap = 26, len = n * (cw + gap);
    const s = Math.min(1, 1500 / (len + 340)), x0 = W / 2 - (len + 340) * s / 2, y = 560;
    AN.village(c, 760, t, { speed: 30, seed: 12 });
    c.fillStyle = '#0b0e33'; c.fillRect(0, 760, W, H);
    st(c, [[0, 770], [W, 770]], { w: 6, color: '#9aa6d8' });
    c.save(); c.translate(x0, 770 - ch * s); c.scale(s, s);
    // locomotive at the front (right), carriages behind: the newest year is the last, at the left
    cel(c, [[len, 0], [len + 260, 0], [len + 340, 80], [len + 340, ch], [len, ch]], '#1f2a58', { w: 6, smooth: false });
    glow(c, len + 340, 90, 260, '#fff3d0', .8);
    for (let i = 0; i < n; i++) { const newest = i === 0, age = n - i; carriage(c, i * (cw + gap), 0, cw, ch, { lit: newest ? 1 : 0, t, label: null }); }
    c.restore();
    AN.specks(c, t, { n: 26, seed: 18 });
  };

  // ---------- f09: the beach fades (18s) ----------
  SC.f09 = (c, t) => {
    const k = 1 - fade(t, 6, 12), grey = v => mix(v, '#6a6a74', 1 - k);
    const g = c.createLinearGradient(0, 0, 0, 780); g.addColorStop(0, grey('#ff7a8a')); g.addColorStop(.6, grey('#ffb46a')); g.addColorStop(1, grey('#ffe0a0')); c.fillStyle = g; c.fillRect(0, 0, W, 800);
    glow(c, 1150, 560, 500 * k + 100, grey('#fff0c0'), .9 * k + .1); c.fillStyle = grey('#fff6dc'); c.beginPath(); c.arc(1150, 560, 110, 0, TAU); c.fill();
    cel(c, [[0, 600], [W, 600], [W, 800], [0, 800]], grey('#3a9ad8'), { w: 0, smooth: false });
    for (let i = 0; i < 14; i++) { const x = (i * 150 + t * 60) % W, y = 630 + (i % 3) * 50; st(c, [[x, y], [x + 70, y - 8], [x + 140, y]], { w: 4, color: grey('#ffffff'), al: .5 + .5 * k }); }
    if (k > .05) MG.sparkles(c, [0, 560, W, 240], t, { n: Math.round(26 * k), seed: 6, size: 9 });
    for (const [px, sc] of [[1500, 1], [1700, .8]]) { const sw = Math.sin(t * 1.4 + px) * 10 * k; st(c, [[px, 800], [px + 20, 600], [px + 60 + sw, 420]], { w: 18 * sc, color: grey('#5a3a3a') }); for (let f = 0; f < 6; f++) { const a = -Math.PI / 2 + (f - 2.5) * .55 + sw * .01; cel(c, [[px + 60 + sw, 420], [px + 60 + sw + Math.cos(a) * 200 * sc, 420 + Math.sin(a) * 120 * sc + 60], [px + 60 + sw + Math.cos(a) * 120 * sc, 420 + Math.sin(a) * 60 * sc + 20]], grey('#2f9a6a'), { w: 4, smooth: false }); } }
    // window frame + the Traveller, as in frame 1
    AN.cel(c, [[0, 780], [W, 780], [W, H], [0, H]], C.wood, { shadow: [[0, 860], [W, 860], [W, H], [0, H]], w: 6, smooth: false });
    if (!window.NOCAST) CASTA.traveller(c, 430, 560, { s: 1.5, t, look: .6, blink: t > 10 && t < 10.1 ? 1 : 0 });
  };

  // ---------- shared street for f10 / f11 ----------
  const BUILD = [[-40, 300, 360], [330, 220, 300], [640, 340, 260], [900, 180, 380], [1290, 280, 300], [1600, 200, 360]];
  function street(c, t, o = {}) {
    const { k = 0, gold = 0 } = o, sky = mix('#c8d0e8', '#ffcf8a', gold);
    c.fillStyle = mix('#e8ecf6', sky, Math.max(k, gold)); c.fillRect(0, 0, W, H);
    BUILD.forEach(([x, top, w], i) => { const pts = [[x, 820], [x, top], [x + w, top], [x + w, 820]], col = ['#c87a6a', '#7a8ac8', '#e0b060', '#6aa08a', '#b86aa0', '#8a7ac8'][i];
      if (k > 0) cel(c, pts, mix('#f4f6fa', col, k), { shadow: [[x + w * .7, 820], [x + w * .7, top], [x + w, top], [x + w, 820]], shade: .2 * k, w: 0, smooth: false });
      st(c, pts.concat([pts[0]]), { w: 5, color: mix('#9aa0b4', C.ink, k) });
      for (let r = 0; r < 4; r++) for (let q = 0; q < 2; q++) { const wx = x + 40 + q * (w / 2), wy = top + 50 + r * 120; if (wy > 760) continue; st(c, [[wx, wy], [wx + 70, wy], [wx + 70, wy + 70], [wx, wy + 70], [wx, wy]], { w: 3, color: mix('#b0b4c4', C.ink, k), al: .8 }); if (gold > 0) { glow(c, wx + 35, wy + 35, 60, '#ffd27a', .6 * gold); c.fillStyle = alpha('#ffe0a0', gold); c.fillRect(wx, wy, 70, 70); } } });
    cel(c, [[0, 820], [W, 820], [W, H], [0, H]], mix('#dfe2ea', '#5a5a7a', Math.max(k, gold * .8)), { w: 5, smooth: false });
  }
  function tailor(c, t, k) {
    const x = 330, y = 560; if (k <= 0) return; c.save(); c.globalAlpha *= k;
    cel(c, [[x, 820], [x, y], [x + 300, y], [x + 300, 820]], '#f2a65a', { shadow: [[x + 220, 820], [x + 220, y], [x + 300, y], [x + 300, 820]], w: 6, smooth: false });
    cel(c, [[x - 20, y], [x + 320, y], [x + 300, y - 70], [x, y - 70]], '#c8323c', { w: 6, smooth: false }); for (let i = 0; i < 6; i++) st(c, [[x + i * 56, y - 70], [x + i * 56 + 20, y]], { w: 4, color: '#fff2dc' });
    NT.words(c, 'TAILOR', x + 150, y + 50, { size: 44, color: '#3a2440', font: 'Georgia, serif', weight: 'bold' });
    cel(c, [[x + 110, 820], [x + 110, y + 110], [x + 190, y + 110], [x + 190, 820]], '#3a2440', { w: 4, smooth: false });
    cel(c, [[x + 210, y + 150], [x + 280, y + 150], [x + 280, y + 200], [x + 210, y + 200]], '#5a3a7a', { w: 4, smooth: false });   // the little radio
    for (let n = 0; n < 4; n++) { const u = ((t * .35 + n / 4) % 1), nx = x + 250 + u * 160 + Math.sin(u * 8 + n) * 20, ny = y + 140 - u * 260; c.save(); c.globalAlpha *= (1 - u); glow(c, nx, ny, 34, '#ffd27a', .9); NT.words(c, '♪', nx, ny, { size: 50, color: '#fff2dc' }); c.restore(); }
    c.restore();
  }
  const SCARVES = ['#c8323c', '#3e7ad8', '#ffd23f', '#3aa06a', '#c48bff', '#ff8a6a'];
  function busStop(c, t, k) {
    const x = 1400; if (k <= 0) return; c.save(); c.globalAlpha *= k;
    st(c, [[x + 240, 820], [x + 240, 480]], { w: 8, color: '#3a3a5a' }); cel(c, [[x + 200, 440], [x + 280, 440], [x + 280, 500], [x + 200, 500]], '#3e7ad8', { w: 4, smooth: false }); NT.words(c, 'BUS', x + 240, 470, { size: 30, color: '#fff', weight: 'bold' });
    cel(c, [[x - 30, 820], [x - 20, 600], [x + 30, 580], [x + 80, 600], [x + 90, 820]], '#3a4a7a', { shadow: [[x + 40, 820], [x + 40, 590], [x + 90, 600], [x + 90, 820]], w: 6 });
    cel(c, ellPts(x + 30, 530, 46, 52, 0, 28), C.skin, { w: 5 }); cel(c, [[x - 18, 520], [x - 10, 480], [x + 40, 470], [x + 78, 500], [x + 76, 530], [x + 40, 500]], '#5a2a1a', { w: 5 });
    const sc = SCARVES[Math.floor(t / 1.3) % SCARVES.length]; cel(c, [[x - 20, 580], [x + 80, 580], [x + 84, 610], [x - 24, 610]], sc, { w: 5 }); cel(c, [[x + 50, 600], [x + 76, 600], [x + 70, 680], [x + 46, 680]], sc, { w: 4 }); glow(c, x + 30, 600, 80, sc, .6);
    c.restore();
  }
  // ---------- f10: new eyes (33s) ----------
  SC.f10 = (c, t) => {
    street(c, t, { k: 0 });
    tailor(c, t, fade(t, 18, 20.5)); busStop(c, t, fade(t, 27, 29.5));
    if (t > 18) MG.sparkles(c, [300, 480, 360, 360], t, { n: 8, seed: 2, size: 9, color: '#ffe0a0' });
    if (t > 27) MG.sparkles(c, [1350, 450, 260, 380], t, { n: 8, seed: 7, size: 9, color: '#ffe0a0' });
  };
  // ---------- f11: that's a page (34s) ----------
  SC.f11 = (c, t) => {
    const k = .45 + .55 * fade(t, 1.5, 6.5), gold = fade(t, .5, 5.5);
    street(c, t, { k, gold }); tailor(c, t, 1); busStop(c, t, 1);
    // the gold light through the gap between two buildings
    c.save(); c.globalCompositeOperation = 'screen'; const sweep = fade(t, .5, 6); const bx = 1260;
    const gb = c.createLinearGradient(bx, 0, bx - 600, H); gb.addColorStop(0, alpha('#ffd27a', .7 * sweep)); gb.addColorStop(1, alpha('#ffd27a', 0)); c.fillStyle = gb;
    c.beginPath(); c.moveTo(bx, 180); c.lineTo(bx + 30, 180); c.lineTo(bx - 200 + 900 * sweep, H); c.lineTo(bx - 1100 + 600 * sweep, H); c.fill(); c.restore();
    glow(c, bx + 15, 200, 300, '#fff0c0', sweep); MG.rings(c, bx + 15, 200, { r0: 40, gap: 30, n: 7, color: '#ffe0a0', al: .7 * sweep, t });
    AN.specks(c, t, { n: 40, seed: 11, color: '#ffe0a0', al: sweep });
    // "That's a page." — the street becomes a page in a book
    const pg = fade(t, 10.5, 12) * (1 - fade(t, 32, 35));
    if (pg > 0) { resetT(c); c.save(); c.globalAlpha = pg; c.lineWidth = 46; c.strokeStyle = '#f6ecd8'; c.strokeRect(70, 70, W - 140, H - 140); c.lineWidth = 5; c.strokeStyle = C.ink; c.strokeRect(47, 47, W - 94, H - 94); c.strokeRect(93, 93, W - 186, H - 186); c.restore(); }
    // one first a day: little glowing ideas float up
    [['→', 20.0, 360], ['?', 21.3, 960], ['♨', 24.4, 1560]].forEach(([txt, t0, x]) => { const u = fade(t, t0, t0 + 1.2); if (u <= 0) return; const y = 640 - u * 260 + Math.sin(t * 1.2 + x) * 8; glow(c, x, y, 160, '#ffd27a', .7 * u); cel(c, AN.sp(ellPts(x, y, 70, 62, 0, 30)), '#fff6dc', { w: 5, al: u }); NT.words(c, txt, x, y, { size: 64, color: '#3a2440', al: u, weight: 'bold' }); });
  };

  // ---------- f12: your stop (17s) — dawn at home, the station fills with detail ----------
  SC.f12 = (c, t) => {
    const k = fade(t, 1.5, 9);
    const g = c.createLinearGradient(0, 0, 0, 700); g.addColorStop(0, '#2a2a7a'); g.addColorStop(.5, '#c86a8a'); g.addColorStop(1, '#ffc87a'); c.fillStyle = g; c.fillRect(0, 0, W, 760);
    glow(c, 1500, 700, 700, '#ffd8a0', .9); MG.ticks(c, 1500, 700, { r1: 150, r2: 230, n: 40, color: '#fff2c0', al: .7 * k, t });
    cel(c, [[0, 700], [W, 700], [W, H], [0, H]], mix('#d8d4e4', '#8a6a7a', k), { shadow: [[0, 700], [W, 700], [W, 740], [0, 740]], w: 6, smooth: false });
    const show = (th, fn) => { const a = clamp((k - th) * 3, 0, 1); c.save(); c.globalAlpha *= .25 + .75 * a; fn(a); c.restore(); };
    show(0, () => { st(c, [[300, 700], [300, 300]], { w: 10 }); cel(c, [[160, 300], [440, 300], [440, 380], [160, 380]], '#3e7ad8', { w: 6, smooth: false }); NT.words(c, 'HOME', 300, 340, { size: 54, color: '#fff', font: 'Georgia, serif', weight: 'bold' }); });
    show(.15, a => { cel(c, [[640, 640], [1040, 640], [1040, 670], [640, 670]], '#8a5a3a', { w: 5, smooth: false }); cel(c, [[650, 600], [1030, 600], [1030, 625], [650, 625]], '#8a5a3a', { w: 5, smooth: false }); st(c, [[680, 670], [680, 720]], { w: 8 }); st(c, [[1000, 670], [1000, 720]], { w: 8 }); st(c, [[900, 602], [920, 618]], { w: 3, color: '#fff2dc', al: a }); });   // chipped bench
    show(.3, () => { const hop = Math.abs(Math.sin(t * 2.4)) * 6; cel(c, blob(1110, 690 - hop, 40, 26, 5), '#8a8aa8', { w: 4 }); cel(c, ellPts(1144, 664 - hop, 16, 16), '#9a9ab8', { w: 3 }); c.fillStyle = '#c8323c'; c.beginPath(); c.arc(1150, 660 - hop, 3, 0, TAU); c.fill(); });   // pigeon
    show(.45, a => { cel(c, [[1300, 700], [1300, 470], [1680, 470], [1680, 700]], '#c8963a', { shadow: [[1580, 700], [1580, 470], [1680, 470], [1680, 700]], w: 6, smooth: false }); cel(c, [[1280, 470], [1700, 470], [1660, 400], [1320, 400]], '#c8323c', { w: 6, smooth: false }); NT.words(c, 'CHAI', 1490, 520, { size: 52, color: '#3a2440', font: 'Georgia, serif', weight: 'bold' }); cel(c, [[1460, 610], [1520, 610], [1530, 660], [1450, 660]], '#5a5a7a', { w: 4, smooth: false }); glow(c, 1490, 600, 160, C.practical, .7 * a); MG.steam(c, 1490, 600, t, { h: 260, color: '#fff6e6', al: .7 * a }); });
    if (!window.NOCAST) CASTA.traveller(c, 420, 760, { s: 1.15, t, look: .9, blink: t > 6 && t < 6.1 ? 1 : 0 });
    if (k > .6) MG.sparkles(c, [1250, 380, 480, 320], t, { n: 10, seed: 9, size: 8, color: '#fff2c0' });
  };

  // ---------- f13: unwatched (12s) — the train leaves, the title lands ----------
  SC.f13 = (c, t) => {
    const g = c.createLinearGradient(0, 0, 0, 760); g.addColorStop(0, '#3a3a8a'); g.addColorStop(.55, '#e07a8a'); g.addColorStop(1, '#ffd08a'); c.fillStyle = g; c.fillRect(0, 0, W, 780);
    const sun = fade(t, 0, 9); glow(c, CX, 760, 600 + 500 * sun, '#ffe0a0', .7 + .3 * sun); MG.rings(c, CX, 760, { r0: 140, gap: 46, n: 8, color: '#fff0c0', al: .5, t });
    AN.village(c, 760, t, { speed: 20, seed: 30, color: '#3a2a5a' });
    c.fillStyle = '#2a1c40'; c.fillRect(0, 760, W, H); st(c, [[0, 770], [W, 770]], { w: 5, color: '#c88a8a' });
    const tx = 160 + t * 80;   // the train pulls away to the right
    for (let i = 0; i < 6; i++) { const x = tx + i * 330; cel(c, [[x, 640], [x + 300, 640], [x + 300, 770], [x, 770]], '#1a1438', { w: 5, smooth: false }); const last = i === 0; for (let q = 0; q < 3; q++) { const wx = x + 30 + q * 92; glow(c, wx + 30, 690, last ? 120 : 50, last ? '#ff5a4a' : C.practical, last ? 1 : .6); c.fillStyle = last ? '#ff7a6a' : '#ffd98a'; c.fillRect(wx, 670, 60, 44); } }
    AN.specks(c, t, { n: 30, seed: 40, color: '#fff2c0' });
    const ti = fade(t, 5.4, 7.6);
    if (ti > 0) { NT.words(c, 'THE NIGHT TRAIN', CX, 340 - (1 - ti) * 24, { size: 130, color: '#fff6e6', font: 'Georgia, serif', weight: 'bold', al: ti }); NT.words(c, 'Stop 1  ·  Return Road', CX, 470 - (1 - ti) * 24, { size: 56, color: '#ffe0c0', font: 'Georgia, serif', al: fade(t, 6.2, 8.4) }); glow(c, CX, 340, 500, '#fff0c0', .3 * ti); }
    const out = fade(t, 10.25, 10.6); if (out > 0) { resetT(c); c.fillStyle = alpha(C.ink, out); c.fillRect(0, 0, W, H); }
  };
  return {};
})();
