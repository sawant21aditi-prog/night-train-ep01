// The Night Train, Ep1 — the director. Turns each scene into coverage: an establishing wide,
// close-ups that cut to whoever is speaking (from lib/speech.js), reaction shots, and inserts
// (the existing scene art). Needs core, night, anime, chars, cast2, scenes-1/2, speech.
window.NOCAST = true;   // scene art in scenes-1/2 is used as plates; the old cast is not drawn
const DIR = (() => {
  const A = AN.C, cel = AN.cel, st = AN.stroke;
  const START = { f01: 0, f02: 12.4, f03: 39.0, f04: 53.5, f05: 79.2, f06: 107.5, f07: 137.4, f08: 175.0, f09: 203.0, f10: 216.5, f11: 253.0, f12: 288.3, f13: 309.4 };
  const DUR = { f01: 12.4, f02: 26.6, f03: 14.5, f04: 25.7, f05: 28.3, f06: 29.9, f07: 37.6, f08: 28.0, f09: 13.5, f10: 36.5, f11: 35.3, f12: 21.1, f13: 10.6 };
  // per scene: location, forced shots [from, to, type] (type: wide | insert | T | K), expressions [from, who, exp]
  const PLAN = {
    f01: { loc: 'carriage', force: [[0, 3.2, 'wide'], [10.4, 12.4, 'T']], exp: [[0, 'K', 'neutral'], [5, 'K', 'laugh'], [8.4, 'T', 'neutral']] },
    f02: { loc: 'carriage', force: [[1.6, 6.4, 'insert'], [6.6, 11.5, 'insert'], [20, 25.2, 'insert']], exp: [[0, 'T', 'neutral'], [16, 'T', 'tired'], [25, 'T', 'sad']] },
    f03: { loc: 'carriage', force: [[0, 2.4, 'wide'], [6.6, 14.5, 'insert']], exp: [[0, 'T', 'tired'], [4.5, 'T', 'surprised']] },
    f04: { loc: 'road', force: [[0, 6, 'wide'], [7, 19.5, 'wide']], exp: [[0, 'T', 'surprised'], [7, 'T', 'wonder'], [21, 'K', 'laugh']] },
    f05: { loc: 'road', force: [[0, 4, 'wide'], [6, 18.5, 'wide'], [24, 28.3, 'T']], exp: [[0, 'T', 'tired'], [19, 'T', 'sad'], [24, 'T', 'sad']] },
    f06: { loc: 'carriage', force: [[0, 2.5, 'wide'], [11, 17, 'insert'], [25.6, 29.9, 'insert']], exp: [[0, 'T', 'tired'], [20, 'T', 'sad']] },
    f07: { loc: 'river', force: [[0, 4, 'wide'], [4.6, 19, 'wide'], [22.4, 31, 'wide']], exp: [[0, 'T', 'wonder'], [5, 'T', 'laugh'], [19, 'T', 'neutral'], [31, 'T', 'sad'], [34, 'K', 'neutral']] },
    f08: { loc: 'train', force: [[0, 4.5, 'wide'], [14, 19, 'wide']], exp: [[0, 'T', 'tired'], [20, 'T', 'sad']] },
    f09: { loc: 'carriage', force: [[1.4, 10.5, 'insert']], exp: [[0, 'T', 'wonder'], [10.5, 'T', 'sad']] },
    f10: { loc: 'street', force: [[0, 3.5, 'wide'], [17.8, 31, 'wide']], exp: [[0, 'T', 'tired'], [5.4, 'T', 'skeptic'], [14, 'T', 'tired'], [18, 'T', 'wonder']] },
    f11: { loc: 'street', force: [[0, 9, 'wide'], [10.4, 13.6, 'wide'], [19.6, 26.5, 'wide']], exp: [[0, 'T', 'wonder'], [27, 'T', 'neutral'], [33, 'T', 'wonder']] },
    f12: { loc: 'platform', force: [[0, 10.5, 'wide']], exp: [[0, 'T', 'tired'], [6, 'T', 'wonder'], [12, 'T', 'neutral'], [19.5, 'K', 'laugh']] },
    f13: { loc: 'platform', force: [[0, 10.6, 'wide']], exp: [] },
  };
  const ACT = { f04: 1, f07: 1, f10: 1, f12: 1 };   // a crumpled-paper wipe opens each new act
  // ---------- shot list: build once per scene from who is speaking ----------
  const cache = {};
  function shots(id) {
    if (cache[id]) return cache[id];
    const s0 = START[id], d = DUR[id], list = [{ t: 0, type: 'wide' }], S = window.SPEECH || { T: [], C: [] };
    const lines = [...S.T.map(l => ['T', l[0], l[1]]), ...S.C.map(l => ['K', l[0], l[1]])].filter(([, a, b]) => b > s0 + .5 && a < s0 + d - .6).sort((a, b) => a[1] - b[1]);
    let last = 0, n = 0;
    const push = (t, type) => { if (t < d - .8) { list.push({ t, type }); last = t; } };
    for (const [who, a, b] of lines) {
      let lt = Math.max(0, a - s0 - .15); const end = b - s0, other = who === 'T' ? 'K' : 'T';
      if (lt - last < 1.1) { if (list.length === 1 && end > 2.6) lt = last + 2.0; else continue; }
      n++; push(lt, n % 6 === 0 ? 'wide' : who);
      // a long speech gets the listener's reaction, then back to the speaker (and a wide if it runs on)
      for (let k = lt + 3.2; k < end - 1.6; k += 5.4) { push(k, other); if (k + 2.2 < end - 1.2) push(k + 2.2, (n + k | 0) % 3 === 0 ? 'wide' : who); }
    }
    list.sort((p, q) => p.t - q.t);
    return (cache[id] = list);
  }
  function shotAt(id, t) {
    for (const [a, b, type] of PLAN[id].force) if (t >= a && t < b) return { type, since: a };
    const L = shots(id); let cur = L[0]; for (const s of L) if (s.t <= t) cur = s;
    // a forced range ending mid-shot hands back to the speaker shot
    return { type: cur.type, since: cur.t };
  }
  function expAt(id, who, t) { let e = who === 'T' ? 'tired' : 'neutral'; for (const [a, w, x] of PLAN[id].exp) if (w === who && t >= a) e = x; return e; }
  const blink = (t, seed) => { const p = 3.7 + (seed % 3) * .6, u = ((t + seed) % p); return u < .12; };

  // ---------- the carriage set ----------
  function carriage(c, t) {
    if (window.TOON) return TOON.carriage(c, t);
    const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#2a2650'); g.addColorStop(1, '#3a2c52'); c.fillStyle = g; c.fillRect(0, 0, W, H);
    // the window: night sky, moon, village sliding past
    const R = [460, 150, 1000, 470]; c.save(); c.beginPath(); c.rect(...R); c.clip();
    AN.sky(c, [R[0], R[1], R[2], R[3] + 60]); AN.stars(c, [R[0], R[1], R[2], 300], t); AN.moon(c, 1240, 290, 90, t, { rays: .5, bokeh: .6 });
    AN.cloud(c, 760, 230, 600, t, { seed: 3, al: .55 }); c.translate(0, -200); AN.village(c, 800, t, { speed: 90, seed: 5 }); c.translate(0, 200);
    for (let i = 0; i < 3; i++) { const px = R[0] + R[2] + 200 - ((t * 900 + i * 520) % (R[2] + 600)); cel(c, [[px, R[1] + 40], [px + 16, R[1] + 40], [px + 22, R[1] + R[3]], [px - 6, R[1] + R[3]]], '#0c0a24', { w: 0, smooth: false }); cel(c, [[px - 50, R[1] + 70], [px + 66, R[1] + 70], [px + 66, R[1] + 80], [px - 50, R[1] + 80]], '#0c0a24', { w: 0, smooth: false }); st(c, [[px - 600, R[1] + 120], [px + 8, R[1] + 74], [px + 600, R[1] + 120]], { w: 2, color: '#0c0a24' }); }
    c.restore();
    cel(c, [[R[0] - 26, R[1] - 26], [R[0] + R[2] + 26, R[1] - 26], [R[0] + R[2] + 26, R[1] + R[3] + 26], [R[0] - 26, R[1] + R[3] + 26]], 'rgba(0,0,0,0)', { w: 10, smooth: false, line: '#1a1430' });
    st(c, [[R[0] + R[2] / 2, R[1]], [R[0] + R[2] / 2, R[1] + R[3]]], { w: 8, color: '#1a1430' });
    // travel posters on the wall
    [[110, 170, '#e07a5a', 'mtn'], [1610, 170, '#5aa0c8', 'sea']].forEach(([px, py, col, k]) => {
      cel(c, [[px, py], [px + 200, py], [px + 200, py + 270], [px, py + 270]], '#f6ecd8', { w: 5, smooth: false });
      cel(c, [[px + 14, py + 14], [px + 186, py + 14], [px + 186, py + 200], [px + 14, py + 200]], col, { w: 3, smooth: false });
      if (k === 'mtn') { cel(c, [[px + 14, py + 200], [px + 80, py + 90], [px + 120, py + 140], [px + 150, py + 110], [px + 186, py + 200]], '#5a3a6a', { w: 3, smooth: false }); glow(c, px + 140, py + 60, 30, '#fff2c0', .8); }
      else { cel(c, [[px + 14, py + 150], [px + 186, py + 150], [px + 186, py + 200], [px + 14, py + 200]], '#2a6a9a', { w: 3, smooth: false }); glow(c, px + 100, py + 110, 34, '#ffe0a0', .9); }
      st(c, [[px + 30, py + 232], [px + 170, py + 232]], { w: 5, color: '#c8323c' }); st(c, [[px + 50, py + 252], [px + 150, py + 252]], { w: 3, color: '#7a5a3a' });
    });
    // curtains tied back at the window
    for (const sd of [-1, 1]) { const x0 = sd < 0 ? 440 : 1480, dx = sd < 0 ? 60 : -60;
      cel(c, [[x0, 110], [x0 + dx, 110], [x0 + dx, 360], [x0 + dx / 3, 640], [x0, 640]], '#7a2a4a', { shadow: [[x0, 110], [x0 + dx / 3, 110], [x0 + dx / 6, 640], [x0, 640]], w: 5 });
      st(c, [[x0, 380], [x0 + dx * .8, 372]], { w: 6, color: '#e2b44a' }); }
    // luggage racks with bags, and a cat asleep up there
    for (const sd of [-1, 1]) { const x0 = sd < 0 ? 60 : W - 420; st(c, [[x0, 120], [x0 + 360, 120]], { w: 6, color: '#8a8aa8' }); st(c, [[x0, 96], [x0 + 360, 96]], { w: 3, color: '#8a8aa8' }); }
    cel(c, [[90, 70], [250, 70], [250, 120], [90, 120]], '#3a6a5a', { w: 5, smooth: false }); st(c, [[140, 70], [140, 54], [200, 54], [200, 70]], { w: 4 });
    cel(c, [[270, 80], [370, 76], [380, 120], [262, 120]], '#c8963a', { w: 5 });
    const cb = breathe(t, 3.2) * 3;
    cel(c, [[W - 380, 120], [W - 372, 92 - cb], [W - 300, 84 - cb], [W - 250, 96], [W - 246, 120]], '#e8e0d0', { w: 5 });
    cel(c, [[W - 260, 100], [W - 244, 76], [W - 228, 92], [W - 236, 112]], '#e8e0d0', { w: 4 });
    st(c, [[W - 380, 112], [W - 420, 128], [W - 410, 150]], { w: 7, color: '#e8e0d0' }); st(c, [[W - 248, 98], [W - 240, 100]], { w: 2.5 });
    // grab handles sway with the train
    for (let i = 0; i < 6; i++) { const hx = 380 + i * 230, sw = Math.sin(t * 1.7 + i * .6) * .12; c.save(); c.translate(hx, 10); c.rotate(sw); st(c, [[0, 0], [0, 70]], { w: 4, color: '#8a8aa8' }); cel(c, ellPts(0, 90, 18, 22, 0, 18), 'rgba(0,0,0,0)', { w: 6, line: '#b8b8d0' }); c.restore(); }
    // lamp
    const fl = .9 + .1 * Math.sin(t * 7.3) * Math.sin(t * 3.1); glow(c, CX, 70, 640, '#ffc870', .45 * fl); cel(c, [[CX - 60, 30], [CX + 60, 30], [CX + 36, 80], [CX - 36, 80]], '#c8963a', { w: 5, smooth: false });
    // seats (behind the cast)
    for (const sd of [-1, 1]) { const x = sd < 0 ? 40 : W - 40; cel(c, [[x, 400], [x + sd * 330, 420], [x + sd * 330, 900], [x, 900]], '#a8402e', { shadow: [[x, 400], [x + sd * 80, 404], [x + sd * 80, 900], [x, 900]], w: 6, smooth: false }); }
    glow(c, CX, 1000, 700, '#ff9a55', .18);
    const per = 7.5, u = ((t + 2) % per) / per;
    if (u < .22) { const k = Math.sin(u / .22 * Math.PI), x = W + 400 - u / .22 * (W + 1200); c.save(); c.globalCompositeOperation = 'screen';
      const lg = c.createLinearGradient(x - 300, 0, x + 300, 0); lg.addColorStop(0, 'rgba(255,200,120,0)'); lg.addColorStop(.5, 'rgba(255,210,140,' + (.28 * k) + ')'); lg.addColorStop(1, 'rgba(255,200,120,0)'); c.fillStyle = lg; c.fillRect(0, 0, W, H); c.restore(); }
  }
  function table(c) {   // the little table between them, in front of the cast
    if (window.TOON) return TOON.table(c, NT.clock.now);
    cel(c, [[640, 820], [1280, 820], [1300, 860], [620, 860]], '#6a3a2a', { shadow: [[640, 840], [1300, 840], [1300, 860], [620, 860]], w: 6, smooth: false });
    cel(c, [[930, 860], [990, 860], [980, H], [940, H]], '#4a2a20', { w: 5, smooth: false });
    cel(c, [[0, 900], [W, 900], [W, H], [0, H]], '#2a2040', { w: 0, smooth: false });
    // the Traveller's chai on the table, the moon in it
    cel(c, [[760, 760], [800, 760], [796, 820], [764, 820]], 'rgba(220,235,255,.45)', { w: 4, smooth: false }); cel(c, [[762, 776], [798, 776], [796, 820], [764, 820]], '#c06a2c', { w: 0, smooth: false }); glow(c, 784, 778, 22, '#eef2ff', .8);
  }
  // ---------- finishing: every character is lit by the scene it stands in ----------
  // amb: ambient tint (multiplied), key: [x, y, colour] the light source, rim: rim-light colour, grade: scene grade
  const LIGHT = {
    carriage: { amb: '#fff0dc', ambK: .08, key: [960, 40, '#ffe6b0'], keyK: .18, rim: '#fff4dc', grade: ['#ffffff', '#ffe8c8'] },   // lamp-lit cartoon interior: barely any tint
    road: { amb: '#5a66c0', ambK: .25, key: [1560, 230, '#cfe0ff'], keyK: .35, rim: '#cfe0ff', grade: ['#1a1a5a', '#4a3a8a'] },
    river: { amb: '#ffc890', ambK: .22, key: [640, 260, '#fff0c0'], keyK: .55, rim: '#fff4d0', grade: ['#ff9a6a', '#ffe0a0'] },
    train: { amb: '#5a66c0', ambK: .25, key: [1600, 220, '#cfe0ff'], keyK: .3, rim: '#cfe0ff', grade: ['#1a1a5a', '#3a2a6a'] },
    street: { amb: '#c4cce4', ambK: .18, key: [1270, 190, '#ffe0a0'], keyK: .35, rim: '#fff0c8', grade: ['#9aa6c8', '#f0d8b8'] },
    platform: { amb: '#e8a8b8', ambK: .25, key: [1500, 700, '#ffd8a0'], keyK: .6, rim: '#ffe8c0', grade: ['#5a3a8a', '#ffc87a'] },
  };
  const _CL = {};
  function lit(c, loc, id, t, draw, o = {}) {
    const L = LIGHT[loc], lay = _CL.a || (_CL.a = layer()), rimL = _CL.b || (_CL.b = layer());
    const g = lay.getContext('2d'); resetT(g); g.clearRect(0, 0, W, H); draw(g);
    const maskL = _CL.m || (_CL.m = layer()), mg = maskL.getContext('2d'); mg.setTransform(1, 0, 0, 1, 0, 0); mg.clearRect(0, 0, maskL.width, maskL.height); mg.drawImage(lay, 0, 0);   // the silhouette, kept to re-cut the light
    const glow2 = (id === 'f11' ? sm(.5, 5.5, t) : 1);   // the gold street: the light arrives
    // ambient tint and key light, only where the character is painted
    g.save(); g.globalCompositeOperation = 'source-atop';
    g.globalAlpha = L.ambK; g.fillStyle = L.amb; g.globalCompositeOperation = 'multiply'; g.fillRect(0, 0, W, H);
    g.globalCompositeOperation = 'source-atop'; g.globalAlpha = 1;
    const [kx, ky, kc] = L.key, kr = g.createRadialGradient(kx, ky, 40, kx, ky, 1500); kr.addColorStop(0, alpha(kc, L.keyK * glow2)); kr.addColorStop(.6, alpha(kc, L.keyK * .25 * glow2)); kr.addColorStop(1, alpha(kc, 0));
    g.globalCompositeOperation = 'screen'; g.fillStyle = kr; g.fillRect(0, 0, W, H);
    g.restore();
    { const cxx = o.cx ?? CX, sx = Math.sign(kx - cxx) || 1, fg = g.createLinearGradient(cxx + sx * 260 * (o.sc || 1), 0, cxx - sx * 260 * (o.sc || 1), 0);
      fg.addColorStop(0, 'rgba(255,240,220,0)'); fg.addColorStop(.55, 'rgba(40,30,80,.10)'); fg.addColorStop(1, 'rgba(30,20,70,.32)');
      g.save(); g.globalCompositeOperation = 'source-atop'; g.fillStyle = fg; g.fillRect(0, 0, W, H); g.restore(); }   // form shadow, soft like a brush
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'destination-in'; g.drawImage(maskL, 0, 0); g.restore();   // light stays on the character
    // multiply leaves the transparent area black under source-atop rules on some engines: re-cut to the silhouette
    // rim light: the silhouette minus itself shifted away from the key light = a bright edge on the lit side
    const r = rimL.getContext('2d'); resetT(r); r.clearRect(0, 0, W, H);
    const cx = o.cx ?? CX, cy = o.cy ?? 500, dx = Math.sign(kx - cx) * (o.rimW ?? 5), dy = Math.sign(ky - cy) * (o.rimW ?? 5) * .6;
    r.drawImage(lay, 0, 0, W, H); r.globalCompositeOperation = 'source-in'; r.fillStyle = L.rim; r.fillRect(0, 0, W, H);
    r.globalCompositeOperation = 'destination-out'; r.drawImage(lay, -dx, -dy, W, H); r.globalCompositeOperation = 'source-over';
    resetT(c); c.drawImage(lay, 0, 0, W, H); c.save(); c.globalCompositeOperation = 'screen'; c.globalAlpha = .6; c.drawImage(rimL, 0, 0, W, H); c.restore();
  }
  // soft contact shadow so a figure stands on the ground
  function shadow(c, x, y, w) { c.save(); const g = c.createRadialGradient(x, y, 4, x, y, w); g.addColorStop(0, 'rgba(10,8,30,.45)'); g.addColorStop(1, 'rgba(10,8,30,0)'); c.fillStyle = g; c.beginPath(); c.ellipse(x, y, w, w * .18, 0, 0, TAU); c.fill(); c.restore(); }
  // one grade per scene: cool shadows, warm lights, depth haze at the top, so the frame reads as one picture
  function grade(c, loc, t) {
    if (window.TOON && loc === 'carriage') return;   // flat TV-cartoon colour indoors
    const L = LIGHT[loc]; resetT(c); c.save();
    const gg = c.createLinearGradient(0, 0, 0, H); gg.addColorStop(0, alpha(L.grade[0], .28)); gg.addColorStop(1, alpha(L.grade[1], .18));
    c.globalCompositeOperation = 'soft-light'; c.fillStyle = gg; c.fillRect(0, 0, W, H);
    c.globalCompositeOperation = 'screen'; const hz = c.createLinearGradient(0, 110, 0, 520); hz.addColorStop(0, alpha(L.grade[1], .08)); hz.addColorStop(1, alpha(L.grade[1], 0)); c.fillStyle = hz; c.fillRect(0, 0, W, H);
    c.restore();
  }

  // ---------- characters, as the director places them ----------
  // ---- blocking: every gesture has a rise, a held end state, and a return ----
  const env = (n, a, b, up = .5, down = .5) => n < a || n > b ? 0 : Math.min(easeInOutSine(Math.min(1, (n - a) / up)), easeInOutSine(Math.min(1, (b - n) / down)));
  // the Conductor lifts his hand to explain on any line longer than 3s, holds it, and lowers it before the line ends
  function gestAt() { const n = NT.clock.now; for (const [a, b] of (window.SPEECH || {}).C || []) if (b - a > 3 && n > a && n < b) return env(n, a + .8, b - .3, .6, .7); return 0; }
  // the Traveller sips the chai while he listens: 1s into a Conductor line longer than 4s; cup up 0.7s, held 1s, down 0.8s; at most every 12s
  const SIPS = (() => { const out = []; let last = -99;
    for (const [a, b] of (window.SPEECH || {}).C || []) if (b - a > 4 && a - last > 12) { out.push(a + 1); last = a; } return out; })();
  function sipAt() { const n = NT.clock.now; for (const s of SIPS) if (n > s && n < s + 2.5) return env(n, s, s + 2.5, .7, .8); return 0; }
  // ---- acting, pose to pose: each line snaps into a new attitude (lean + head tilt) with overshoot, holds, and
  // relaxes after the line; the listener leans in with a cocked head; an expression change lands as a squash-and-stretch take
  const POSE = [[0, 0], [.045, -.08], [-.035, .07], [.06, .1], [-.05, -.06], [.02, .12]];
  const backOut = u => 1 + 2.70158 * Math.pow(u - 1, 3) + 1.70158 * Math.pow(u - 1, 2);
  function acting(who, t, id) {
    const n = NT.clock.now, S = (window.SPEECH || {})[who] || [], O = (window.SPEECH || {})[who === 'T' ? 'C' : 'T'] || [];
    let i = -1; for (let k = 0; k < S.length; k++) if (S[k][0] - .12 <= n) i = k;
    let lean = 0, tilt = 0;
    if (i >= 0) { const [a, b] = S[i], p = POSE[(i + (who === 'C' ? 3 : 0)) % POSE.length], e = backOut(Math.min(1, (n - a + .12) / .32)), rel = 1 - sm(b + .25, b + .85, n, easeInOutSine);
      lean = p[0] * e * rel; tilt = p[1] * e * rel + NT.speaking(who) * .035 * Math.sin(n * 8.5); }
    const lis = O.some(([a, b]) => n > a + .3 && n < b + .2) ? sm(0, 1, Math.min(...O.map(([a]) => n - a > 0 ? n - a : 99)), easeInOutSine) : 0;
    lean += -.025 * lis; tilt += (.06 + .02 * Math.sin(n * .9)) * lis * (who === 'T' ? 1 : -1);
    const ex = PLAN[id].exp.filter(([a, w]) => w === (who === 'T' ? 'T' : 'K') && a <= t && a > 0).pop(), age = ex ? t - ex[0] : 9;
    const pop = age < .4 ? Math.sin(Math.PI * age / .4) * (1 - age / .4 * .5) : 0;
    return { lean, tilt, pop };
  }
  function popAt(c, x, y, pop) { if (!pop) return; c.translate(x, y); c.scale(1 - pop * .06, 1 + pop * .09); c.translate(-x, -y); }
  function travRaw(c, x, y, s, t, id, o = {}) { const talk = NT.speaking('T'), A = acting('T', t, id); c.save(); popAt(c, x, y, A.pop); CH.traveller(c, x, y, { s, view: o.view || 'three', exp: expAt(id, 'T', t), talk, look: o.look ?? .6, bob: -talk * 5 + breathe(twos(t), 3.6) * -3, chai: o.chai, sip: o.chai === false ? 0 : sipAt(), lean: A.lean, tilt: A.tilt, t }); c.restore(); }
  function condRaw(c, x, y, s, t, id, o = {}) { const talk = NT.speaking('C'), A = acting('C', t, id); c.save(); popAt(c, x, y, A.pop); c.translate(x, y); c.scale(-1, 1); CH.conductor(c, 0, 0, { s, view: o.view || 'three', exp: expAt(id, 'K', t), talk, bob: -talk * 5 + breathe(twos(t), 4.4) * -3, gest: gestAt(), lean: A.lean, tilt: A.tilt, t }); c.restore(); }

  let LOCNOW = 'carriage';
  function trav(c, x, y, s, t, id, o = {}) { if (s < 1.2) shadow(c, x, y - 6 * s, 150 * s); lit(c, LOCNOW, id, t, g => travRaw(g, x, y, s, t, id, o), { cx: x, cy: y - 800 * s, sc: s, rimW: Math.min(6, Math.max(3, 6 * s)) }); }
  function cond(c, x, y, s, t, id, o = {}) { if (s < 1.2) shadow(c, x, y - 6 * s, 170 * s); lit(c, LOCNOW, id, t, g => condRaw(g, x, y, s, t, id, o), { cx: x, cy: y - 900 * s, sc: s, rimW: Math.min(6, Math.max(3, 6 * s)) }); }
  // ---------- extra life for the outdoor sets ----------
  function streetLife(c, t, id) {
    const k = id === 'f11' ? 1 : sm(18, 20.5, t);
    st(c, [[0, 300], [700, 360], [W, 290]], { w: 3, color: '#3a3a5a' }); st(c, [[0, 330], [900, 400], [W, 330]], { w: 3, color: '#3a3a5a' });
    for (let i = 0; i < 5; i++) { const bx = 300 + i * 210, by = 330 + 30 * Math.sin(bx / 400) - (Math.floor(t * 2 + i) % 7 === 0 ? 6 : 0); cel(c, ellPts(bx, by, 14, 10, 0, 14), mix('#c8ccd8', '#4a4a6a', k), { w: 3 }); cel(c, ellPts(bx + 12, by - 8, 7, 7, 0, 10), mix('#c8ccd8', '#4a4a6a', k), { w: 3 }); }
    c.save(); c.globalAlpha *= .4 + .6 * k; for (const wx of [1240, 1380]) cel(c, ellPts(wx, 790, 34, 34, 0, 20), 'rgba(0,0,0,0)', { w: 6 }); st(c, [[1240, 790], [1300, 740], [1380, 790]], { w: 6, color: '#c8323c' }); st(c, [[1300, 740], [1310, 712]], { w: 5 }); c.restore();
    for (const [px, col] of [[620, '#3aa06a'], [1220, '#c8963a']]) { cel(c, [[px - 30, 820], [px + 30, 820], [px + 22, 770], [px - 22, 770]], mix('#dde0ea', col, k), { w: 5, smooth: false }); cel(c, ellPts(px, 740, 44, 40, 0, 20), mix('#e4e8f0', '#3aa06a', k), { w: 5 }); }
    AN.specks(c, t, { n: 18, seed: 51, color: '#ffe8c0', al: .7 * k });
  }
  function platformLife(c, t, id) {
    for (const lx of [880, 1820]) { st(c, [[lx, 700], [lx, 330]], { w: 8, color: '#3a3050' }); cel(c, [[lx - 34, 330], [lx + 34, 330], [lx + 24, 300], [lx - 24, 300]], '#3a3050', { w: 4, smooth: false }); glow(c, lx, 340, 120, '#ffe0a0', .7); }
    cel(c, [[1100, 690], [1240, 690], [1240, 620], [1100, 620]], '#8a5a3a', { w: 5, smooth: false }); cel(c, [[1110, 620], [1180, 620], [1180, 570], [1110, 570]], '#3e7ad8', { w: 4, smooth: false }); for (const wx of [1120, 1220]) cel(c, ellPts(wx, 700, 12, 12, 0, 12), '#231c2e', { w: 0 });
    for (let i = 0; i < 2; i++) { const hop = Math.abs(Math.sin(t * 2.2 + i * 1.3)) * 8; CH2.pigeon(c, 1020 + i * 90, 700 - hop, .45); }
    AN.specks(c, t, { n: 22, seed: 61, color: '#fff0d0', al: .8 });
  }
  // ---------- each location: the plate (background), the wide (plate + cast) ----------
  const LOC = {
    carriage: { plate: (c, t) => carriage(c, t), wide: (c, t, id) => { carriage(c, t); trav(c, 470, 1180, .62, t, id); cond(c, 1450, 1250, .6, t, id); table(c); } },
    road: { plate: (c, t, id) => SC[id](c, t), wide: (c, t, id) => { SC[id](c, t); if (!window.TOON) cel(c, [[0, 980], [W, 980], [W, H], [0, H]], '#1a2a4a', { w: 0, smooth: false }); trav(c, 300, 1040, .44, t, id, { view: 'three', chai: false }); cond(c, 150, 1050, .44, t, id); PT.grass(c, [0, 1000, W, 80], t, { seed: 11, cols: ['#1e2a4a', '#2a3a6a', '#3a4a80', '#5a6aa0'], n: 700 }); } },
    river: { plate: (c, t) => SC.f07(c, t), wide: (c, t, id) => { SC.f07(c, t); if (t > 4 && t < 20) CH2.kid(c, 760 - (t > 17 ? 0 : 0), 1000, .34); trav(c, 1500, 1020, .44, t, id, { view: 'three', chai: false }); cond(c, 1690, 1035, .44, t, id); PT.grass(c, [0, 1000, W, 80], t, { seed: 13, cols: ['#4a7a3a', '#6aa04a', '#8ac060', '#c8e080'], n: 700 }); } },
    train: { plate: (c, t) => SC.f08(c, t), wide: (c, t, id) => { SC.f08(c, t); trav(c, 1380, 1060, .3, t, id, { chai: false }); cond(c, 1560, 1068, .3, t, id); PT.grass(c, [0, 1010, W, 70], t, { seed: 17, cols: ['#141a3a', '#1e2a50', '#2a3a68'], n: 600 }); } },
    street: { plate: (c, t, id) => SC[id](c, t), wide: (c, t, id) => { SC[id](c, t); streetLife(c, t, id); trav(c, 940, 1010, .36, t, id, { chai: false }); cond(c, 1120, 1020, .36, t, id); } },
    platform: { plate: (c, t, id) => SC[id](c, t), wide: (c, t, id) => {
      SC[id](c, t); if (id === 'f12' || !window.TOON) platformLife(c, t, id);   // the platform props belong to the platform shot only
      if (id === 'f12') { CH2.chaiwala(c, 1490, 760, .32); trav(c, 560, 980, .42, t, id, { view: 'three' }); cond(c, 120, 900, .4, t, id); }
      else { const tx = 160 + t * 80; c.save(); c.globalAlpha = 1 - sm(4, 7, t); cond(c, tx + 120, 760, .16, t, id); c.restore(); trav(c, 820, 900, .2, t, id, { view: 'back' }); }
    } },
  };
  // close-up: the plate behind, softly out of focus, the speaker big on a third
  const _L = {};
  function closeup(c, who, t, id, loc) {
    const ex = PLAN[id].exp.filter(([a, w]) => w === (who === 'T' ? 'T' : 'K') && a <= t && a > 0).pop();
    if (window.TOON && ex && t - ex[0] < 1.2 && ['surprised', 'laugh', 'wonder', 'sad', 'skeptic'].includes(ex[2])) {
      TOON.burst(c, ex[2], t, who === 'T' ? 720 : 1200, 470);
      if (who === 'T') trav(c, 720, 2170, 2.25, t, id, { look: .8 }); else cond(c, 1200, 2340, 2.05, t, id);
      return;
    }
    if (window.TOON) { resetT(c); c.save(); c.translate(CX, CY); c.scale(1.12, 1.12); c.translate(-CX + (who === 'T' ? 160 : -160), -CY); LOC[loc].plate(c, t, id); c.restore();
      if (who === 'T') trav(c, 720, 2170, 2.25, t, id, { look: .8 }); else cond(c, 1200, 2340, 2.05, t, id);
      return;
    }
    const L = _L.p || (_L.p = layer()), g = L.getContext('2d'); resetT(g); g.clearRect(0, 0, W, H); LOC[loc].plate(g, t, id);
    const HB = _L.h || (_L.h = Object.assign(document.createElement('canvas'), { width: L.width >> 1, height: L.height >> 1 })), hb = HB.getContext('2d');
    hb.setTransform(1, 0, 0, 1, 0, 0); hb.filter = 'blur(4.5px) brightness(.85)'; hb.drawImage(L, 0, 0, HB.width, HB.height); hb.filter = 'none';   // half-res blur
    resetT(c); c.save(); c.translate(CX, CY); c.scale(1.25, 1.25); c.translate(-CX, -CY); c.drawImage(HB, 0, 0, W, H); c.restore();
    glow(c, who === 'T' ? 700 : 1220, 420, 500, loc === 'river' || loc === 'platform' ? '#ffd8a0' : '#9fb8ff', .25);
    if (who === 'T') trav(c, 720, 2170, 2.25, t, id, { look: .8 }); else cond(c, 1200, 2340, 2.05, t, id);
    AN.specks(c, t, { n: 16, seed: who === 'T' ? 3 : 7, al: .6 });
  }
  function frame(id) {
    const loc = PLAN[id].loc;
    return (c, t) => {
      LOCNOW = loc; window.TOONLOC = loc; const sh = shotAt(id, t), age = t - sh.since;
      // the camera never stops: one slow continuous drift for the whole scene, plus a gentle settle after each cut
      const z = 1.03 + .025 * Math.sin(t * .21 + id.length) + .02 * sm(0, 3, age, easeOut), fx = sh.type === 'T' ? 760 : sh.type === 'K' ? 1160 : CX + Math.sin(t * .13) * 60;
      const paint = (g, s2) => { if (s2.type === 'insert') SC[id](g, t); else if (s2.type === 'wide') LOC[loc].wide(g, t, id); else closeup(g, s2.type, t, id, loc); };
      NT.zoomed(c, z, fx, 470, g => {
        // a cut gets a quick 0.2s dissolve from the previous shot, so it lands soft but still on the word
        const prev = sh.since > 0 ? shotAt(id, sh.since - .01) : null;
        if (prev && age < .2 && prev.type !== sh.type) { const PL = _L.x || (_L.x = layer()), pg = PL.getContext('2d'); resetT(pg); pg.clearRect(0, 0, W, H); paint(pg, prev); paint(g, sh); resetT(g); g.globalAlpha = 1 - age / .2; g.drawImage(PL, 0, 0, W, H); g.globalAlpha = 1; }
        else paint(g, sh);
        if (sh.type !== 'insert') grade(g, loc, t);
        if (id === 'f03' && t > 9.5) PT.ribbons(g, t, { n: 6, seed: 3, col: '#fff0d0', al: .7 * sm(9.5, 11, t), y0: 520, spread: 600 });
        if (id === 'f07' && sh.type === 'wide' && t < 19) PT.ribbons(g, t, { n: 4, seed: 7, col: '#fff6e0', al: .45, y0: 330, spread: 300, speed: .6 });
        if (id === 'f11' && sh.type === 'wide') PT.ribbons(g, t, { n: 5, seed: 11, col: '#ffe0a0', al: .55 * sm(.5, 5, t), y0: 420, spread: 500, speed: .7 });
      }, 'dir');
      if (ACT[id]) PT.paperWipe(c, t / .75);
      PT.texture(c, .14);
      // a fresh cut: one frame of soft flash so the eye resets (not on inserts)
    };
  }
  return { frame, shots, shotAt, START, DUR };
})();
