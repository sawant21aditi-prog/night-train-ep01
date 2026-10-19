// The Night Train, Ep1 — scenes 2..7 (night-anime cel look). Each scene is (c, t) => draws one frame.
const SC = window.SC || (window.SC = {});
(() => {
  const C = AN.C, cel = AN.cel, st = AN.stroke;
  const fade = (t, a, b) => sm(a, b, t, easeInOutSine);
  const label = (c, txt, x, y, o = {}) => NT.words(c, txt, x, y, { size: 46, color: '#fff2dc', ...o });

  // ---------- shared props ----------
  function road(c, y, t, speed, o = {}) {
    if (window.TOON && TOON.road) return TOON.road(c, y, t, speed, o);
    const { al = 1 } = o;
    cel(c, [[0, y], [W, y], [W, H], [0, H]], '#20224e', { shadow: [[0, y + 70], [W, y + 70], [W, H], [0, H]], w: 0, smooth: false, al });
    const off = ((t * speed) % 240 + 240) % 240; c.save(); c.globalAlpha *= al; c.fillStyle = '#ffd98a';
    for (let x = -240 + off; x < W + 240; x += 240) c.fillRect(x, y + 46, 120, 8); c.restore();
    st(c, [[0, y], [W, y]], { w: 5, al });
  }
  function car(c, x, y, dir, t, o = {}) {
    const { driver = 1, al = 1, lights = 1 } = o, spin = t * 9 * dir;
    c.save(); c.translate(x, y); c.scale(dir, 1); c.globalAlpha *= al;
    if (lights) { glow(c, 250, -40, 260, '#ffe0a0', .5 * lights); c.save(); c.globalCompositeOperation = 'screen'; c.fillStyle = alpha('#ffe9b8', .18 * lights); c.beginPath(); c.moveTo(220, -50); c.lineTo(760, -150); c.lineTo(760, 60); c.closePath(); c.fill(); c.restore(); }
    cel(c, [[-230, -20], [-220, -100], [-120, -110], [-60, -190], [110, -190], [170, -110], [240, -90], [250, -20]], '#d8574a', { shadow: [[-230, -60], [250, -60], [250, -20], [-230, -20]], w: 6, smooth: false });
    cel(c, [[-50, -175], [40, -175], [40, -112], [-104, -112]], '#2a3a7a', { w: 4, smooth: false });
    cel(c, [[58, -175], [100, -175], [146, -112], [58, -112]], '#2a3a7a', { w: 4, smooth: false });
    if (driver > 0) { c.save(); c.globalAlpha *= driver; cel(c, [[-10, -112], [-6, -150], [16, -164], [34, -150], [34, -112]], C.hair, { w: 0 }); c.restore(); }
    c.save(); c.globalCompositeOperation = 'screen'; st(c, [[-40, -170], [20, -170]], { w: 4, color: '#cfe0ff', al: .5 }); c.restore();
    for (const wx of [-140, 150]) { cel(c, ellPts(wx, -16, 46, 46), '#15132e', { w: 5 }); cel(c, ellPts(wx, -16, 20, 20), '#9aa6d8', { w: 3 }); for (let k = 0; k < 3; k++) { const a = spin + k * TAU / 3; st(c, [[wx, -16], [wx + Math.cos(a) * 18, -16 + Math.sin(a) * 18]], { w: 3 }); } }
    glow(c, 246, -66, 30, '#fff3d0', lights); glow(c, -226, -66, 24, '#ff5a4a', .8);
    c.restore();
  }
  function hills(c, t, scroll, o = {}) {
    if (window.TOON && TOON.hills) return TOON.hills(c, t, scroll, o);
    const { k = 1 } = o, sky = [mix(C.skyTop, '#4a4a5a', 1 - k), mix(C.skyMid, '#5a5a6a', 1 - k), mix('#7a4aa8', '#6a6a78', 1 - k)];
    const g = c.createLinearGradient(0, 0, 0, 700); g.addColorStop(0, sky[0]); g.addColorStop(.6, sky[1]); g.addColorStop(1, sky[2]); c.fillStyle = g; c.fillRect(0, 0, W, 760);
    c.save(); c.globalAlpha = k; AN.stars(c, [0, 0, W, 420], t); AN.moon(c, 1560, 230, 90, t, { rays: .6, bokeh: .6 }); c.restore();
    const layers = [['#2c2a78', 520, .15], ['#1f1d5c', 600, .35], ['#15134a', 660, .6]];
    layers.forEach(([col, yy, par], i) => { const off = scroll * par; c.fillStyle = mix(col, '#55555f', 1 - k); c.beginPath(); c.moveTo(0, 760); for (let s = 0; s <= 48; s++) { const xx = s / 48 * W; c.lineTo(xx, yy + Math.sin((xx + off) / (180 + i * 90)) * 40 + Math.sin((xx + off) / 70) * 8); } c.lineTo(W, 760); c.fill(); });
  }

  // ---------- f02: the wrong answer (24s) ----------
  const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  SC.f02 = (c, t) => {
    const cx = 1150, cy = 470;
    if (window.TOON && t < 20) {   // memory flashes on TV-cartoon burst backgrounds: blue for the months, party pink for the birthdays
      if (t < 5.8) TOON.calendarShot(c, t); else TOON.burst(c, 'wonder', t, cx, cy + 60);   // the months tear off the carriage's own wall calendar
      if (t >= 5.6) for (let r = 0; r < 2; r++) { const yb = 150 + r * 70, sag = 60; AN.stroke(c, [[0, yb], [W / 2, yb + sag], [W, yb]], { w: 4, color: TOON.INK });
        for (let k = 0; k < 14; k++) { const u = (k + .5) / 14, x = u * W, y = yb + sag * 4 * u * (1 - u), sw = Math.sin(t * 3 + k) * .1; c.save(); c.translate(x, y); c.rotate(sw);
          AN.cel(c, [[-26, 0], [26, 0], [0, 52]], ['#ff6a8a', '#ffd23a', '#5ac8e0', '#8ae05a'][(k + r) % 4], { line: TOON.INK, w: 4, smooth: false }); c.restore(); } }
    } else { AN.sky(c, [0, 0, W, H]); AN.stars(c, [0, 0, W, H], t); glow(c, 1150, 480, 700, '#7a4aff', .35);
    AN.specks(c, t, { n: 24, seed: 3, color: '#d8c4ff' }); }
    // months fly off a calendar, faster and faster
    if (!window.TOON && t < 6.5) { const n = t * .45 + t * t * .035, i = Math.floor(n), u = n - i, al = 1 - fade(t, 5.5, 6.5);
      const page = (k, dx, dy, rot, a) => { c.save(); c.globalAlpha = a; c.translate(cx + dx, cy + dy); c.rotate(rot); cel(c, [[-190, -240], [190, -240], [190, 240], [-190, 240]], '#f6ecd8', { shadow: [[60, -240], [190, -240], [190, 240], [60, 240]], shade: .12, w: 6, smooth: false }); cel(c, [[-190, -240], [190, -240], [190, -140], [-190, -140]], '#c8323c', { w: 6, smooth: false }); NT.words(c, MONTHS[k % 12], 0, -190, { size: 62, color: '#fff2dc', font: 'Georgia, serif', weight: 'bold' }); NT.words(c, String(1 + (k * 7) % 28), 0, 40, { size: 190, color: '#2a2440', font: 'Georgia, serif', weight: 'bold' }); c.restore(); };
      page(i + 1, 0, 0, 0, al); page(i, u * 520, -u * 380 + u * u * 300, u * 1.3, al * (1 - u));
      for (let k = 1; k < 4; k++) { const v = (u + k / 4) % 1; c.save(); c.globalAlpha = al * (1 - v) * .5; c.translate(cx + 300 + v * 600, cy - 300 + v * 200); c.rotate(v * 3); cel(c, [[-40, -50], [40, -50], [40, 50], [-40, 50]], '#f6ecd8', { w: 3, smooth: false }); c.restore(); } }
    // birthdays, one after another: a cake lands on "cake", the next shoves it off on "another one", then faster and faster
    const CK = window.CAKES, ckAl = fade(t, 5.6, 5.8) * (1 - fade(t, 11.6, 12.2));
    if (ckAl > 0) {
      let i = -1; for (let k = 0; k < CK.length; k++) if (t >= CK[k]) i = k;
      const draw1 = (k, dx, land) => { const age = 27 + k, sq = land < 1 ? 1 + Math.sin(land * Math.PI) * .22 * (1 - land) : 1;   // squash on landing
        c.save(); c.globalAlpha = ckAl; c.translate(cx + dx, cy + 280); c.scale(sq, 2 - sq);
        cel(c, ellPts(0, 6, 300, 26), 'rgba(10,6,30,.35)', { w: 0 });
        cel(c, [[-260, -140], [260, -140], [260, 0], [-260, 0]], ['#f2a6c0', '#a6d8f2', '#f2d8a6', '#c8a6f2'][k % 4], { shadow: [[120, -140], [260, -140], [260, 0], [120, 0]], w: 6, smooth: false });
        cel(c, [[-190, -260], [190, -260], [190, -140], [-190, -140]], '#fbe3c8', { shadow: [[90, -260], [190, -260], [190, -140], [90, -140]], w: 6, smooth: false });
        for (let d = 0; d < 9; d++) cel(c, ellPts(-240 + d * 60, -140, 22, 16), '#fff6ee', { w: 3 });   // frosting drips
        const out = CK[k + 1] !== undefined && t > CK[k + 1] - .12;   // blown out just before the next one arrives
        cel(c, [[-14, -380], [14, -380], [14, -260], [-14, -260]], '#ffd27a', { w: 4, smooth: false });
        NT.words(c, String(age), 0, -300, { size: 40, color: '#c8323c', weight: 'bold' });
        if (!out) { glow(c, 0, -410, 60, '#ffc060', 1); cel(c, [[0, -440], [13, -406], [0, -390], [-13, -406]], '#ffe9a0', { w: 2, smooth: false }); }
        else { const u = Math.min(1, (t - CK[k + 1] + .12) / .4); c.globalAlpha = ckAl * (1 - u); st(c, [[0, -392], [-10, -420 - u * 40], [6, -450 - u * 70]], { w: 4, color: '#c8c0d8' }); }
        c.restore(); };
      if (i >= 0) {
        const t0 = CK[i], gap = (CK[i + 1] ?? t0 + .8) - t0, u = Math.min(1, (t - t0) / Math.min(.28, gap * .6)), e = easeOut(u);
        if (i > 0) draw1(i - 1, -e * 1500, 1);              // the last birthday gets shoved off to the left
        draw1(i, (1 - e) * 1500, u);                         // the new one slides in from the right and lands
        if (u < 1) for (let k = 0; k < 10; k++) { const a = k / 10 * TAU + i; st(c, [[cx + Math.cos(a) * 340, cy + 120 + Math.sin(a) * 200], [cx + Math.cos(a) * (360 + u * 120), cy + 120 + Math.sin(a) * (220 + u * 80)]], { w: 6, color: ['#ff8a9a', '#ffd27a', '#7fe0c0'][k % 3], al: ckAl * (1 - u) }); }   // confetti burst
      }
    }
    // less road left: the road shortens toward a closer horizon
    const rd = fade(t, 19, 20.5);
    if (rd > 0) { c.save(); c.globalAlpha = rd; const hz = 330 + 260 * fade(t, 20.5, 26); c.fillStyle = '#15134a'; c.fillRect(0, hz, W, H - hz);
      cel(c, [[cx - 40, hz], [cx + 40, hz], [cx + 520, H], [cx - 520, H]], '#2a2c62', { w: 6, smooth: false });
      for (let k = 0; k < 6; k++) { const v = ((k / 6 + t * .4) % 1), y0 = hz + (H - hz) * v * v, y1 = hz + (H - hz) * Math.min(1, (v + .06)) ** 2, w0 = 6 + 24 * v; c.fillStyle = '#ffd98a'; c.beginPath(); c.moveTo(cx - w0 / 2, y0); c.lineTo(cx + w0 / 2, y0); c.lineTo(cx + w0, y1); c.lineTo(cx - w0, y1); c.fill(); }
      glow(c, cx, hz, 260, '#ff7a6a', .6); c.restore(); }
    if (!window.NOCAST) CASTA.traveller(c, 300, 600, { s: 1.35, t, look: .4, blink: t > 4 && t < 4.1 ? 1 : 0 });
  };

  // ---------- f03: Return Road ticket (16s) ----------
  SC.f03 = (c, t) => {
    const g = c.createRadialGradient(CX, CY, 100, CX, CY, 1100); g.addColorStop(0, '#2a3a9a'); g.addColorStop(1, '#0a0c30'); c.fillStyle = g; c.fillRect(0, 0, W, H);
    AN.specks(c, t, { n: 30, seed: 9 }); glow(c, CX, 120, 600, C.practical, .3);
    const tip = fade(t, 0, 2), wob = Math.sin(t * 1.3) * .01;
    c.save(); c.translate(CX - 80, 560 + (1 - tip) * 300); c.rotate(-.08 + wob);
    cel(c, [[-260, 60], [-60, 40], [-20, 140], [-280, 210]], C.skin, { shadow: [[-280, 140], [-20, 120], [-20, 140], [-280, 210]], w: 6 });   // Traveller's hand
    cel(c, [[-380, -150], [380, -150], [380, 150], [-380, 150]], '#f6ecd8', { shadow: [[200, -150], [380, -150], [380, 150], [200, 150]], shade: .1, w: 6, smooth: false });
    st(c, [[-350, -120], [350, -120], [350, 120], [-350, 120]], { w: 3, color: '#c8963a', close: true });
    NT.words(c, 'THE NIGHT TRAIN', 0, -82, { size: 34, color: '#7a5a3a', font: 'Georgia, serif', weight: 'bold' });
    NT.words(c, 'RETURN ROAD', 0, 6, { size: 96, color: '#c8323c', font: 'Georgia, serif', weight: 'bold' });
    NT.words(c, 'ADMIT ONE  ·  TWO STOPS', 0, 88, { size: 30, color: '#7a5a3a', font: 'Georgia, serif' });
    cel(c, [[-80, 60], [-20, 40], [20, 120], [-60, 170]], C.skin, { w: 5 });   // thumb over the card
    const hole = t > 7.6;
    if (hole) { const k = fade(t, 7.6, 9); glow(c, 260, -40, 120 + 80 * k, '#ffe6a0', 1); MG.sparkle(c, 260, -40, 30 + 10 * Math.sin(t * 6), '#fffaf0', 1); MG.rings(c, 260, -40, { r0: 30, gap: 24, n: 6, color: '#ffe0a0', al: .7, t }); }
    c.restore();
    // the Conductor's gloved hand with the brass punch
    const inn = fade(t, 2.2, 4.5), punch = t > 7 && t < 7.6 ? 1 : 0;
    c.save(); c.translate(W + 200 - inn * 600, 380 + punch * 40);
    cel(c, [[0, -60], [500, -90], [520, 80], [0, 60]], C.coat, { w: 6, smooth: false });
    cel(c, [[-140, -50], [10, -66], [20, 66], [-150, 50]], '#f4f6ff', { shadow: [[-150, 10], [20, 10], [20, 66], [-150, 50]], w: 6 });
    cel(c, [[-300, -40], [-140, -40], [-140, 30], [-300, 30]], '#c8963a', { shadow: [[-300, 0], [-140, 0], [-140, 30], [-300, 30]], w: 5, smooth: false });
    glow(c, -220, -10, 50, C.practical, .6); c.restore();
    if (punch) { resetT(c); c.fillStyle = alpha('#ffffff', .25); c.fillRect(0, 0, W, H); }
    // the hole grows into light: through the ticket into the other world
    const out = fade(t, 10.5, 14.4);
    if (out > 0) { glow(c, CX + 180, 520, 200 + out * 1600, '#ffe6c0', out * 1.2); resetT(c); c.fillStyle = alpha('#fff4e6', out * out * .9); c.fillRect(0, 0, W, H); }
  };

  // ---------- f04: the first drive (26s) ----------
  const SPEED = 260, CARX = 760, at = s => CARX + (s - 2) * SPEED;   // world x that passes the car at time s
  const CUES = [7.9, 11.5, 13.9, 15.8, 18.1];
  const ITEMS = [['petrol', at(CUES[0])], ['dog', at(CUES[1])], ['gate', at(CUES[2])], ['turn', at(CUES[3])], ['tree', at(CUES[4])]];
  function landmark(c, kind, x, t, k = 1) {
    const al = k; if (al <= 0) return; c.save(); c.globalAlpha *= al;
    if (kind === 'petrol') { cel(c, [[x - 160, 760], [x - 160, 540], [x + 160, 540], [x + 160, 760]], '#3a3e8a', { w: 6, smooth: false }); cel(c, [[x - 200, 540], [x + 200, 540], [x + 180, 500], [x - 180, 500]], '#c8323c', { w: 6, smooth: false }); cel(c, [[x + 210, 760], [x + 230, 380], [x + 250, 760]], '#2a2a5a', { w: 4, smooth: false }); cel(c, [[x + 140, 300], [x + 340, 300], [x + 340, 390], [x + 140, 390]], '#f6ecd8', { w: 5, smooth: false }); NT.words(c, 'PE  OL', x + 240, 346, { size: 50, color: '#c8323c', font: 'Georgia, serif', weight: 'bold' }); glow(c, x, 600, 160, '#9fd0ff', .5); }
    if (kind === 'dog') { cel(c, [[x - 220, 760], [x - 220, 640], [x + 220, 640], [x + 220, 760]], '#7a6a9a', { shadow: [[x - 220, 700], [x + 220, 700], [x + 220, 760], [x - 220, 760]], w: 6, smooth: false }); for (let b = 0; b < 4; b++) st(c, [[x - 220 + b * 110, 640], [x - 220 + b * 110, 760]], { w: 3 }); const br = breathe(t, 2.2) * 4; cel(c, [[x - 90, 640], [x - 80, 600 - br], [x + 40, 596 - br], [x + 90, 612], [x + 96, 640]], '#e0a060', { shadow: [[x - 90, 625], [x + 96, 625], [x + 96, 640], [x - 90, 640]], w: 5 }); cel(c, [[x + 60, 600], [x + 70, 572], [x + 92, 582], [x + 96, 612]], '#c88040', { w: 4 }); st(c, [[x + 74, 604], [x + 86, 606]], { w: 3 }); NT.words(c, 'z', x + 120, 560 - (t * 20) % 40, { size: 40, color: '#e8eeff', al: .7 }); }
    if (kind === 'gate') { for (let b = 0; b < 7; b++) cel(c, [[x - 150 + b * 50, 760], [x - 150 + b * 50, 560], [x - 125 + b * 50, 540], [x - 100 + b * 50, 560], [x - 100 + b * 50, 760]], '#3e7ad8', { w: 4, smooth: false }); cel(c, [[x - 160, 600], [x + 210, 600], [x + 210, 624], [x - 160, 624]], '#3e7ad8', { w: 4, smooth: false }); glow(c, x, 640, 200, '#5aa0ff', .45); }
    if (kind === 'turn') { cel(c, [[x - 6, 760], [x + 6, 760], [x + 6, 470], [x - 6, 470]], '#9aa6d8', { w: 3, smooth: false }); cel(c, [[x, 330], [x + 90, 420], [x, 510], [x - 90, 420]], '#ffd23f', { w: 6, smooth: false }); st(c, [[x - 30, 460], [x - 30, 400], [x + 30, 400]], { w: 8 }); st(c, [[x + 14, 384], [x + 34, 400], [x + 14, 416]], { w: 8 }); }
    if (kind === 'tree') { const wave = Math.sin(t * 2.2) * 14; cel(c, [[x - 24, 760], [x + 24, 760], [x + 18, 520], [x - 18, 520]], '#4a2a40', { w: 5, smooth: false }); cel(c, ellPts(x + wave * .3, 440, 170, 140, 0, 30), '#2f7a6a', { shadow: ellPts(x + 60, 480, 120, 100, 0, 24), w: 6 }); st(c, [[x + 110, 470], [x + 230 + wave, 400 - wave], [x + 260 + wave * 1.6, 360]], { w: 10, color: '#4a2a40' }); MG.sparkles(c, [x - 160, 320, 320, 260], t, { n: 6, seed: 4, size: 7, color: '#c8ffe0' }); }
    c.restore();
  }
  function notice(c, x, t, t0) { const k = fade(t, t0 - .6, t0) * (1 - fade(t, t0 + 1.2, t0 + 2)); if (k <= 0) return; MG.rings(c, x, 600, { r0: 60, gap: 36, n: 5, color: '#ffe0a0', al: .8 * k, t }); MG.sparkle(c, x, 420, 26 * k, '#fff6dc', k); }
  SC.f04 = (c, t) => {
    const scroll = Math.max(0, t - 2) * SPEED;
    hills(c, t, scroll);
    ITEMS.forEach(([kind, wx], i) => { const sx = wx - scroll; if (sx > -500 && sx < W + 500) { landmark(c, kind, sx, t); notice(c, sx, t, CUES[i]); } });
    road(c, 760, t, -SPEED * (t > 2 ? 1 : 0));
    car(c, CARX, 800, 1, t);
    if (!window.TOON) MG.sparkles(c, [0, 100, W, 600], t, { n: 18, seed: 31, size: 6, color: '#c8ffe0' });
  };

  // ---------- f05: the drive home (25s) — the world loses its drawing ----------
  SC.f05 = (c, t) => {
    const k = 1 - fade(t, 3, 15), scroll = (t - 0) * SPEED;
    hills(c, t, -scroll, { k: .25 + .75 * k });
    ITEMS.forEach(([kind, wx], i) => { const sx = W - (wx - at(2)) + (t - 2) * SPEED - 400; const th = i / ITEMS.length * .8; landmark(c, kind, sx, t, clamp((k - th) * 4, 0, 1)); });
    // "Where did the dog go? The blue gate?" — their ghost outlines blink back, then go
    const ghost = fade(t, 19.5, 20.5) * (1 - fade(t, 25, 27));
    if (ghost > 0) { c.save(); c.globalAlpha = ghost * .55; c.globalCompositeOperation = 'screen'; st(c, [[560, 640], [570, 600], [690, 596], [740, 612], [746, 640]], { w: 4, color: C.line, close: true }); for (let b = 0; b < 7; b++) st(c, [[1150 + b * 50, 760], [1150 + b * 50, 560]], { w: 3, color: '#7fb4ff' }); c.restore(); }
    road(c, 760, t, SPEED, { al: 1 });
    car(c, W - CARX, 800, -1, t, { driver: 1 - fade(t, 24, 26), lights: .4 + .6 * k });
  };

  // ---------- f06: pages (31s) ----------
  SC.f06 = (c, t) => {
    c.fillStyle = '#2a1c3a'; c.fillRect(0, 0, W, H); glow(c, CX, 200, 1100, C.practical, .45);
    cel(c, [[0, 640], [W, 640], [W, H], [0, H]], '#5a3450', { shadow: [[0, 900], [W, 900], [W, H], [0, H]], w: 0, smooth: false });
    AN.specks(c, t, { n: 22, seed: 14, color: '#ffe0b0' });
    // the thick notebook: the way there
    const L = [520, 640], riff = t > 11 && t < 17 ? (t - 11) : 0;
    for (let p = 0; p < 26; p++) { const y = L[1] - p * 7, dx = p * 1.5; cel(c, [[L[0] - 300 + dx, y], [L[0] + 300 + dx, y], [L[0] + 300 + dx, y - 9], [L[0] - 300 + dx, y - 9]], p % 2 ? '#f6ecd8' : '#e8dcc0', { w: 2, smooth: false }); }
    const top = L[1] - 26 * 7;
    cel(c, [[L[0] - 300, top], [L[0] + 340, top], [L[0] + 300, top - 260], [L[0] - 340, top - 260]], '#c8323c', { shadow: [[L[0] + 120, top], [L[0] + 340, top], [L[0] + 300, top - 260], [L[0] + 100, top - 260]], w: 6, smooth: false });
    if (riff) for (let f = 0; f < 5; f++) { const u = ((riff * 1.6 + f / 5) % 1), a = -Math.PI * u; c.save(); c.translate(L[0] - 300, top - 130); c.scale(Math.cos(a), 1); cel(c, [[0, -126], [600, -126], [600, 126], [0, 126]], '#f6ecd8', { w: 3, smooth: false, al: .9 }); c.restore(); }
    // the single page: drove home
    const fly = fade(t, 26, 29.6), px = 1400 + fly * 700, py = 520 - fly * 640, rot = fly * 2.4;
    c.save(); c.translate(px, py); c.rotate(-.06 + rot); cel(c, [[-180, -120], [180, -120], [180, 120], [-180, 120]], '#f6ecd8', { shadow: [[60, -120], [180, -120], [180, 120], [60, 120]], shade: .1, w: 5, smooth: false }); NT.words(c, 'drove home', 0, 0, { size: 48, color: '#3a2440' }); c.restore();
    if (fly > 0) MG.sparkles(c, [px - 300, py - 100, 400, 400], t, { n: 10, seed: 3, size: 8 });
  };

  // ---------- f07: the summer jar (29s) — the warm dream world ----------
  const FIRSTS = [['river', 5.6, '#7fe0ff'], ['midnight', 8.0, '#c48bff'], ['sunburn', 9.1, '#ff8a6a'], ['mango', 11.0, '#ffd23f']];
  function jar(c, x, y, s, o = {}) { const { tint = '#cfe0ff', al = 1 } = o; c.save(); c.globalAlpha *= al; c.translate(x, y); c.scale(s, s); c.fillStyle = alpha(tint, .14); const body = [[-170, -230], [170, -230], [190, -170], [190, 230], [-190, 230], [-190, -170]]; c.fill(polyPath(AN.sp(body, .7))); st(c, body, { w: 6, color: tint, close: true }); cel(c, [[-150, -280], [150, -280], [150, -230], [-150, -230]], '#8a6a5a', { w: 5, smooth: false }); c.save(); c.globalCompositeOperation = 'screen'; st(c, [[-140, -160], [-140, 160]], { w: 10, color: '#ffffff', al: .35 }); c.restore(); c.restore(); }
  SC.f07 = (c, t) => {
    const cold = fade(t, 22.5, 24.5);
    if (window.TOON) TOON.summer(c, t); else {
    const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#ff9a6a'); g.addColorStop(.5, '#ffcf7a'); g.addColorStop(1, '#ffe9b0'); c.fillStyle = g; c.fillRect(0, 0, W, H);
    glow(c, 640, 260, 520, '#fff0c0', 1); c.fillStyle = '#fff6dc'; c.beginPath(); c.arc(640, 260, 120, 0, TAU); c.fill(); MG.ticks(c, 640, 260, { r1: 140, r2: 200, n: 48, color: '#fff2c0', al: .8, t });
    cel(c, [[0, 780], [W, 780], [W, H], [0, H]], '#3aa0c8', { shadow: [[0, 900], [W, 900], [W, H], [0, H]], w: 0, smooth: false });   // the river
    for (let i = 0; i < 18; i++) { const x = (i * 140 + t * 40) % W, y = 820 + (i % 4) * 50; st(c, [[x, y], [x + 60, y - 6], [x + 120, y]], { w: 4, color: '#e0f8ff', al: .7 }); }
    MG.sparkles(c, [0, 780, W, 300], t, { n: 22, seed: 5, size: 9, color: '#ffffff' }); }
    // mango on a branch
    st(c, [[0, 120], [180, 160], [300, 150]], { w: 14, color: '#5a3a2a' }); cel(c, [[250, 160], [330, 170], [340, 260], [270, 280], [236, 220]], '#ffb43a', { shadow: [[290, 160], [340, 200], [340, 260], [300, 280]], w: 6 }); cel(c, [[220, 150], [280, 120], [300, 150], [250, 165]], '#3aa06a', { w: 4 });
    // the jar fills with glowing firsts
    const JX = 980 - cold * 280, JY = 520;
    jar(c, JX, JY, 1, { tint: '#fff6dc' });
    FIRSTS.forEach(([name, t0, col], i) => { if (t < t0 - .8) return; const u = fade(t, t0 - .8, t0), px = JX - 90 + i * 60, py = lerp(JY - 520, JY + 180 - i * 18, easeOut(u)); glow(c, px, py, 80, col, 1); cel(c, blob(px, py, 34, 26, i + 3), col, { w: 4 }); });
    const more = Math.floor(fade(t, 11.5, 18) * 40); for (let i = 0; i < more; i++) { const px = JX - 150 + hash(i, 4) * 300, py = JY + 200 - Math.floor(i / 8) * 40 - 60 - hash(i, 9) * 20; glow(c, px, py, 30, ['#7fe0ff', '#c48bff', '#ff8a6a', '#ffd23f'][i % 4], .9); c.fillStyle = '#fffaf0'; c.beginPath(); c.arc(px, py, 10, 0, TAU); c.fill(); }
    // this year: the cold jar slides in
    if (cold > 0) { resetT(c); c.save(); c.globalAlpha = cold; const cg = c.createLinearGradient(W * .55, 0, W, 0); cg.addColorStop(0, alpha('#3a4a6a', 0)); cg.addColorStop(.2, '#3a4a6a'); cg.addColorStop(1, '#2a3450'); c.fillStyle = cg; c.fillRect(W * .55, 0, W * .45, H); c.restore();
      const KX = 1500 + (1 - cold) * 500; jar(c, KX, JY, 1, { tint: '#9aa6c0', al: cold });
      [['Mondays', 26.3], ['emails', 28.0], ['same lunch', 30.6]].forEach(([w2, t0], i) => { const u = fade(t, t0 - .5, t0); if (u <= 0) return; const px = KX - 70 + i * 70, py = JY + 180; cel(c, blob(px, py, 30, 22, 20 + i), '#7a7a88', { w: 4, al: u }); }); }
  };
})();
