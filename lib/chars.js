// The Night Train — original cast, modern cartoon model-sheet style. Feet at (0,0), up is -y.
// Chunky outline, flat colour, one soft shade, big eyes with highlights, blush.
const CH = (() => {
  const INK = '#231c2e', LW = 6;
  const sp = (p, k = .85) => smoothPts(p, true, 3, k);
  const path = (p, sm = true) => polyPath(sm ? sp(p) : p);
  function fill(c, p, col, o = {}) { const { sm = true, lw = LW, line = INK, shade, shadeCol = 'rgba(35,28,46,.14)' } = o, P = path(p, sm); c.fillStyle = col; c.fill(P); if (shade) { c.save(); c.clip(P); c.fillStyle = shadeCol; c.fill(path(shade, sm)); c.restore(); } if (lw) { c.strokeStyle = line; c.lineWidth = lw; c.lineJoin = 'round'; c.stroke(P); } }
  function ln(c, p, w = 4, col = INK, close = false) { c.save(); c.strokeStyle = col; c.lineWidth = w; c.lineCap = 'round'; c.lineJoin = 'round'; c.stroke(polyPath(smoothPts(p, close, 3, .9), close)); c.restore(); }
  function ell(c, x, y, rx, ry, col, lw = LW, line = INK) { c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, TAU); c.fillStyle = col; c.fill(); if (lw) { c.strokeStyle = line; c.lineWidth = lw; c.stroke(); } }
  const mirror = p => p.map(([x, y]) => [-x, y]).reverse();

  // ---------- eyes / faces ----------
  // exp: tired | surprised | laugh | sad | wonder | skeptic | neutral
  function eye(c, x, y, o = {}) {
    const { rx = 20, ry = 23, iris = '#5a3424', exp = 'tired', look = 0, sx = 1, side = 1 } = o;
    c.save(); c.translate(x, y); c.scale(sx, 1);
    if (exp === 'laugh') { ln(c, [[-rx, 4], [0, -12], [rx, 4]], 6); c.restore(); return; }
    const lid = { tired: .42, neutral: .12, surprised: -.05, sad: .3, wonder: 0, skeptic: .5 }[exp] ?? .12;
    c.beginPath(); c.ellipse(0, 0, rx, ry, 0, 0, TAU); c.fillStyle = '#ffffff'; c.fill();
    c.save(); c.clip(); const ir = exp === 'surprised' ? .7 : 1;
    ell(c, look * 6, 3, rx * .68 * ir, ry * .74 * ir, iris, 0); ell(c, look * 6, 4, rx * .34 * ir, ry * .38 * ir, '#1a1018', 0);
    ell(c, look * 6 + rx * .25, -ry * .2, rx * .2, rx * .2, '#ffffff', 0); ell(c, look * 6 - rx * .22, ry * .32, rx * .1, rx * .1, '#ffffff', 0);
    if (exp === 'wonder') { for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2; ell(c, look * 6 + Math.cos(a) * rx * .45, 3 + Math.sin(a) * ry * .45, 2.5, 2.5, '#fff7d0', 0); } }
    if (lid > 0) { c.fillStyle = o.skin || '#f3c9a6'; c.fillRect(-rx - 2, -ry - 2, rx * 2 + 4, ry * 2 * lid + 2); }
    c.restore();
    const ly = -ry + ry * 2 * Math.max(0, lid);
    ln(c, [[-rx - 3, ly + 4], [0, ly - 2], [rx + 4, ly + 2], [rx + 9, ly - 4 * side]], 6);   // lash line with a little flick
    if (exp !== 'surprised') ln(c, [[-rx * .6, ry + 1], [rx * .5, ry + 2]], 2.4, 'rgba(35,28,46,.55)');
    c.restore();
  }

  // ---------- THE TRAVELLER ----------
  const T = { skin: '#f3c9a6', skinS: '#e3a989', blush: 'rgba(242,120,120,.42)', hair: '#2b1d26', hairHi: '#5e4352', card: '#e2a43c', cardS: '#c4862a', tee: '#fbf6ee', scarf: '#d43c3c', scarfS: '#a82a2c', jean: '#a9c4e0', jeanS: '#87a7c9', shoe: '#ffffff', sole: '#e3ddd2', iris: '#6a3a26', chai: '#c06a2c', bags: 'rgba(150,120,190,.35)' };

  function tHead(c, x, y, o = {}) {
    const { exp = 'tired', turn = 0, look = 0, s = 1, back = false, talk = false } = o, d = turn * 34;
    c.save(); c.translate(x, y); c.scale(s, s);
    // hair back mass + messy bun (behind the head)
    fill(c, [[-120, 10], [-114, -92], [-62, -146], [0, -160], [62, -146], [114, -92], [120, 10], [108, 92], [82, 104], [70, 30], [-70, 30], [-84, 104], [-110, 92]], T.hair);
    fill(c, ellPts(48 - d * .5, -150, 40, 36, 0, 26), T.hair); ln(c, [[22 - d, -168], [36, -196], [54, -184]], 3, T.hairHi); ln(c, [[70 - d, -168], [92, -186]], 3, T.hairHi);
    if (back) { ln(c, [[-80, -90], [-30, -130], [30, -134]], 8, T.hairHi); c.restore(); return; }
    // ears
    if (turn < .6) fill(c, ellPts(-90 + d * .6, -8, 14, 20, 0, 18), T.skin, { lw: 5 });
    fill(c, ellPts(90 + d * .4, -8, 14, 20, 0, 18), T.skin, { lw: 5 });
    // face
    const F = [[-88, -30], [-80, -90], [-40, -114], [40, -114], [80, -90], [88, -30], [84, 30], [60, 76], [20 + d * .3, 98], [-20 + d * .3, 98], [-60, 76], [-84, 30]].map(([px, py]) => [px * (1 - turn * .1) + d * .3, py]);
    fill(c, F, T.skin, { shade: [[-100, -40], [-60, -40], [-50, 110], [-100, 110]].map(([px, py]) => [px + (turn > 0 ? 160 : 0), py]), shadeCol: 'rgba(200,120,100,.14)' });
    // eyes, bags, brows
    const ex = 36, ey = -12, far = 1 - turn * .28;
    eye(c, -ex + d, ey, { exp, look, sx: far, iris: T.iris, skin: T.skin, side: -1 }); eye(c, ex + d * 1.2, ey, { exp, look, iris: T.iris, skin: T.skin });
    if (exp === 'tired' || exp === 'sad') { ln(c, [[-ex - 16 + d, ey + 30], [-ex + d, ey + 34], [-ex + 14 + d, ey + 30]], 3, T.bags); ln(c, [[ex - 14 + d * 1.2, ey + 30], [ex + d * 1.2, ey + 34], [ex + 16 + d * 1.2, ey + 30]], 3, T.bags); }
    const bw = { tired: [-7, 0], sad: [-13, 0], surprised: [-14, 0], wonder: [-9, 0], laugh: [-4, 0], skeptic: [4, -14], neutral: [0, 0] }[exp] || [0, 0];
    ln(c, [[-ex - 18 + d, ey - 40 + bw[0] * .3], [-ex + d, ey - 46 + bw[0] * .2], [-ex + 18 + d, ey - 42 + bw[0]]], 6, T.hair);
    ln(c, [[ex - 18 + d * 1.2, ey - 42 + bw[0] + bw[1]], [ex + d * 1.2, ey - 46 + bw[0] * .2 - bw[1] * .4], [ex + 18 + d * 1.2, ey - 40 + bw[0] * .3]], 6, T.hair);
    // nose, blush, mouth
    ln(c, [[d * 1.4 + 2, 16], [d * 1.4 + 6, 26], [d * 1.4 - 2, 30]], 3.4, '#b87a64');
    ell(c, -54 + d, 34, 18, 10, T.blush, 0); ell(c, 54 + d * 1.2, 34, 18, 10, T.blush, 0);
    const mx = d * 1.3;
    if (talk) fill(c, ellPts(mx, 58 + talk * 3, 10 + talk * 6, 3 + talk * 12, 0, 18), '#8a2a3a', { lw: 4 });
    else if (exp === 'laugh') fill(c, [[mx - 26, 50], [mx + 26, 50], [mx + 16, 72], [mx - 16, 72]], '#8a2a3a', { lw: 4 });
    else if (exp === 'surprised') fill(c, ellPts(mx, 60, 9, 12, 0, 16), '#8a2a3a', { lw: 4 });
    else if (exp === 'wonder') ln(c, [[mx - 14, 54], [mx, 62], [mx + 14, 54]], 4, '#8a3a3a');
    else if (exp === 'sad') ln(c, [[mx - 14, 62], [mx, 56], [mx + 14, 62]], 4, '#8a3a3a');
    else if (exp === 'skeptic') ln(c, [[mx - 16, 58], [mx + 4, 58], [mx + 16, 52]], 4, '#8a3a3a');
    else ln(c, [[mx - 12, 58], [mx + 12, 58]], 4, '#8a3a3a');
    // curtain bangs + loose strands (in front)
    fill(c, [[-4, -116], [-60, -106], [-94, -48], [-86, -8], [-66, -60], [-30, -92]].map(([px, py]) => [px + d * .4, py]), T.hair);
    fill(c, [[4, -116], [62, -104], [92, -44], [80, -6], [58, -62], [26, -94]].map(([px, py]) => [px + d * .6, py]), T.hair);
    ln(c, [[-92 + d * .4, -40], [-104, 20], [-96, 60]], 4, T.hair); ln(c, [[92 + d * .6, -40], [104, 24], [94, 58]], 4, T.hair);
    ln(c, [[-50 + d * .4, -98], [-20, -108]], 5, T.hairHi);   // sheen
    c.restore();
  }

  function tBody(c, o = {}) {
    const { turn = 0, back = false, chai = true, sip = 0 } = o, n = 1 - turn * .18;
    const X = p => p.map(([x, y]) => [x * n, y]);
    // legs + sneakers
    for (const sd of [-1, 1]) {
      const leg = X([[-92, -430], [-6, -430], [-14, -40], [-120, -40]]).map(([x, y]) => [x * (sd < 0 ? 1 : -1), y]);
      fill(c, leg, T.jean, { sm: false, shade: X([[-40, -430], [-6, -430], [-14, -40], [-50, -40]]).map(([x, y]) => [x * (sd < 0 ? 1 : -1), y]), shadeCol: 'rgba(60,90,140,.18)' });
      fill(c, X([[-124, -64], [-12, -64], [-12, -36], [-126, -36]]).map(([x, y]) => [x * (sd < 0 ? 1 : -1), y]), T.jeanS, { sm: false, lw: 5 });
      fill(c, X([[-132, -4], [-128, -40], [-82, -50], [-16, -42], [-8, -6]]).map(([x, y]) => [x * (sd < 0 ? 1 : -1), y]), T.shoe);
      ln(c, X([[-130, -14], [-10, -14]]).map(([x, y]) => [x * (sd < 0 ? 1 : -1), y]), 4, '#b9b2a6');
      if (!back) for (let k = 0; k < 3; k++) ln(c, X([[-74 + k * 12, -46], [-64 + k * 12, -36]]).map(([x, y]) => [x * (sd < 0 ? 1 : -1), y]), 3);
    }
    // tee + cardigan
    fill(c, X([[-82, -650], [82, -650], [90, -420], [-90, -420]]), T.tee, { sm: false });
    const cl = X([[-112, -650], [-28, -662], [back ? 0 : -36, -350], [-124, -350], [-128, -520]]);
    fill(c, cl, T.card, { sm: false, shade: X([[-128, -520], [-96, -520], [-96, -350], [-124, -350]]) });
    fill(c, mirror(cl), T.card, { sm: false, shade: mirror(X([[-128, -520], [-96, -520], [-96, -350], [-124, -350]])) });
    if (back) fill(c, X([[-122, -650], [122, -650], [126, -350], [-126, -350]]), T.card, { sm: false, shade: X([[-126, -520], [-96, -520], [-96, -350], [-126, -350]]) });
    if (!back) { for (const sd of [-1, 1]) fill(c, X([[-104, -430], [-60, -430], [-60, -390], [-104, -390]]).map(([x, y]) => [x * sd, y]), T.cardS, { sm: false, lw: 4 }); for (let k = 0; k < 4; k++) ell(c, -32 * n, -620 + k * 60, 5, 5, '#8a5a2a', 3); }
    // arms: left hangs, right bends to hold the chai at the chest
    fill(c, X([[-112, -646], [-150, -600], [-160, -420], [-126, -402], [-116, -560]]), T.card, { shade: X([[-160, -520], [-140, -520], [-130, -400], [-160, -410]]) });
    fill(c, ellPts(-146 * n, -390, 18, 20, 0, 16), T.skin, { lw: 5 });
    if (chai && !back) {
      c.save(); c.translate(-sip * 14, -sip * 150);   // sip: the cup rises to the mouth
      fill(c, X([[112, -646], [150, -590], [140, -470], [106, -480], [116, -560]]), T.card);
      fill(c, X([[140, -500], [104, -470], [40, -540], [56, -574], [120, -530]]), T.card);
      fill(c, [[24, -620], [70, -620], [64, -540], [30, -540]].map(([x, y]) => [x * n, y]), 'rgba(220,235,255,.5)', { sm: false, lw: 5 });
      fill(c, [[27, -598], [67, -598], [64, -544], [30, -544]].map(([x, y]) => [x * n, y]), T.chai, { sm: false, lw: 0 });
      fill(c, ellPts(46 * n, -560, 18, 16, 0, 16), T.skin, { lw: 5 });
      for (let k = 0; k < 2; k++) ln(c, [[40 + k * 14, -630], [36 + k * 14, -650], [44 + k * 14, -668]], 3, 'rgba(160,140,170,.6)');
      c.restore();
    } else fill(c, mirror(X([[-112, -646], [-150, -600], [-160, -420], [-126, -402], [-116, -560]])), T.card);
    if (back || !chai) fill(c, ellPts(146 * n, -390, 18, 20, 0, 16), T.skin, { lw: 5 });
    // neck + scarf (wrap and a hanging tail)
    fill(c, [[-24, -700], [24, -700], [26, -652], [-26, -652]], T.skin, { sm: false, lw: 5 });
    fill(c, X([[-74, -680], [74, -680], [82, -630], [-82, -630]]), T.scarf, { shade: X([[-82, -650], [82, -650], [82, -630], [-82, -630]]), shadeCol: 'rgba(120,20,30,.25)' });
    if (!back) { fill(c, X([[-56, -640], [-14, -640], [-22, -520], [-62, -526]]), T.scarf, { sm: false }); for (let k = 0; k < 3; k++) ln(c, X([[-58 + k * 14, -526], [-60 + k * 14, -508]]), 4, T.scarfS); }
  }

  function traveller(c, x, y, o = {}) {
    const { s = 1, view = 'front', exp = 'tired', look = 0 } = o;
    c.save(); c.translate(x, y); c.scale(s, s);
    if (view === 'side') { travellerSide(c, o); c.restore(); return; }
    const turn = view === 'three' ? 1 : 0, back = view === 'back';
    tBody(c, { turn, back, chai: o.chai !== false, sip: o.sip || 0 }); tHead(c, turn * 8, -800 + (o.bob || 0), { exp, turn, look, back, talk: o.talk });
    c.restore();
  }
  function travellerSide(c, o) {
    // profile facing right: same costume, narrower
    fill(c, [[-40, -430], [30, -430], [40, -40], [-46, -40]], T.jean, { sm: false });
    fill(c, [[-56, -4], [-50, -42], [20, -50], [70, -40], [78, -6]], T.shoe); ln(c, [[-54, -14], [76, -14]], 4, '#b9b2a6');
    fill(c, [[-56, -650], [40, -660], [56, -350], [-60, -350]], T.card, { sm: false, shade: [[-60, -650], [-30, -650], [-30, -350], [-60, -350]] });
    fill(c, [[-10, -640], [30, -600], [60, -500], [90, -560], [70, -600], [20, -650]], T.card);
    fill(c, [[80, -620], [116, -620], [110, -540], [84, -540]], 'rgba(220,235,255,.5)', { sm: false, lw: 5 }); fill(c, [[83, -598], [113, -598], [110, -544], [86, -544]], T.chai, { sm: false, lw: 0 }); fill(c, ellPts(92, -560, 18, 16, 0, 16), T.skin, { lw: 5 });
    fill(c, [[-14, -700], [24, -700], [26, -652], [-16, -652]], T.skin, { sm: false, lw: 5 });
    fill(c, [[-40, -680], [46, -680], [52, -628], [-46, -628]], T.scarf); fill(c, [[-46, -650], [-80, -560], [-60, -552], [-30, -640]], T.scarf, { sm: false });
    c.save(); c.translate(0, -800);
    fill(c, [[-100, 0], [-96, -100], [-40, -150], [30, -150], [60, -120], [20, -60], [-20, 40], [-60, 104], [-100, 90]], T.hair);
    fill(c, ellPts(-74, -140, 38, 34, 0, 24), T.hair);
    fill(c, [[-40, -112], [40, -114], [80, -80], [88, -30], [104, 6], [86, 16], [88, 40], [70, 76], [30, 98], [-20, 92], [-40, 40]], T.skin);
    fill(c, ellPts(-14, -6, 14, 20, 0, 16), T.skin, { lw: 5 });
    fill(c, [[-20, -126], [56, -116], [82, -70], [60, -52], [36, -88]], T.hair);
    eye(c, 54, -12, { exp: 'tired', iris: T.iris, skin: T.skin, sx: .55 });
    ln(c, [[40, -54], [70, -58]], 6, T.hair); ell(c, 50, 34, 16, 9, T.blush, 0); ln(c, [[70, 58], [84, 58]], 4, '#8a3a3a');
    c.restore();
  }

  // ---------- THE CONDUCTOR ----------
  const K = { skin: '#e8b48e', skinS: '#cf9672', blush: 'rgba(230,110,100,.38)', white: '#f4f1ec', coat: '#24345e', coatS: '#1a2648', brass: '#e2b44a', cap: '#1e2c52', brim: '#16161e', glove: '#ffffff', trouser: '#1e2238', shoe: '#1a1418', glass: 'rgba(210,230,255,.35)' };
  function kHead(c, x, y, o = {}) {
    const { exp = 'neutral', turn = 0, s = 1, back = false, talk = false } = o, d = turn * 20;
    c.save(); c.translate(x, y); c.scale(s, s);
    fill(c, [[-92, -20], [-88, -96], [-40, -122], [40, -122], [88, -96], [92, -20], [86, 46], [56, 96], [0, 112], [-56, 96], [-86, 46]].map(([px, py]) => [px * (1 - turn * .1) + d * .3, py]), K.skin, { shade: [[-110, -40], [-70, -40], [-60, 130], [-110, 130]].map(([px, py]) => [px + (turn > 0 ? 170 : 0), py]), shadeCol: 'rgba(170,90,70,.15)' });
    if (back) { fill(c, [[-94, -88], [94, -88], [92, -52], [60, -44], [-60, -44], [-92, -52]], K.white, { lw: 5 }); for (const sd of [-1, 1]) fill(c, ellPts(sd * 94, -10, 15, 22, 0, 18), K.skin, { lw: 5 }); }
    if (turn < .6 && !back) fill(c, ellPts(-94 + d * .6, -10, 15, 22, 0, 18), K.skin, { lw: 5 });
    if (!back) fill(c, ellPts(94 + d * .4, -10, 15, 22, 0, 18), K.skin, { lw: 5 });
    if (!back) {
      const ex = 34, ey = -16;
      for (const [sx2, k2] of [[-1, 1 - turn * .28], [1, 1]]) { const xx = sx2 * ex + d * (sx2 > 0 ? 1.2 : 1); eye(c, xx, ey, { exp: exp === 'neutral' ? 'neutral' : exp, rx: 13, ry: 15, iris: '#4a3a2a', skin: K.skin, sx: k2 });
        c.beginPath(); c.arc(xx, ey, 24, 0, TAU); c.fillStyle = K.glass; c.fill(); c.strokeStyle = '#7a6a5a'; c.lineWidth = 4; c.stroke();
        ln(c, [[xx + sx2 * 24, ey + 12], [xx + sx2 * 34, ey + 22]], 2.5, 'rgba(120,70,50,.6)'); }   // crinkles
      ln(c, [[-10 + d, ey], [10 + d, ey]], 4, '#7a6a5a');   // glasses bridge
      const bw = exp === 'surprised' ? -12 : exp === 'sad' ? 8 : 0;
      fill(c, [[-66 + d, ey - 42 + bw], [-14 + d, ey - 52], [-10 + d, ey - 38], [-60 + d, ey - 30 + bw]], K.white, { lw: 4 }); fill(c, [[66 + d * 1.2, ey - 42 + bw], [14 + d * 1.2, ey - 52], [10 + d * 1.2, ey - 38], [60 + d * 1.2, ey - 30 + bw]], K.white, { lw: 4 });
      ln(c, [[d * 1.3, 4], [d * 1.3 + 12, 30], [d * 1.3 - 4, 36]], 4, '#a86a50');   // nose
      ell(c, -56 + d, 36, 18, 10, K.blush, 0); ell(c, 56 + d * 1.2, 36, 18, 10, K.blush, 0);
      const mx = d * 1.3; for (const sd of [-1, 1]) fill(c, [[mx + sd * 2, 40], [mx + sd * 40, 36], [mx + sd * 74, 46], [mx + sd * 84, 30], [mx + sd * 76, 62], [mx + sd * 40, 62], [mx + sd * 4, 54]], K.white, { lw: 5 });   // the big curled moustache
      if (talk) fill(c, ellPts(mx, 78 + talk * 3, 9 + talk * 5, 3 + talk * 10, 0, 18), '#7a2a30', { lw: 4 }); else if (exp === 'laugh') fill(c, [[mx - 18, 72], [mx + 18, 72], [mx + 10, 88], [mx - 10, 88]], '#7a2a30', { lw: 4 }); else if (exp === 'surprised') fill(c, ellPts(mx, 80, 8, 10, 0, 14), '#7a2a30', { lw: 4 }); else ln(c, [[mx - 12, 78], [mx, 81 + (exp === 'sad' ? -3 : 2)], [mx + 12, 78]], 4, '#7a3a3a');
    }
    // cap
    fill(c, [[-96, -86], [-104, -146], [-50, -186], [50, -190], [104, -150], [100, -86]].map(([px, py]) => [px + d * .3, py]), K.cap, { shade: [[-104, -120], [104, -120], [100, -86], [-96, -86]].map(([px, py]) => [px + d * .3, py]), shadeCol: 'rgba(0,0,0,.2)' });
    if (!back) { fill(c, [[-100, -92], [100, -92], [118 + d, -64], [-80 + d, -60]], K.brim, { sm: false }); fill(c, ellPts(d * .6, -138, 18, 16, 0, 16), K.brass, { lw: 4 }); }
    ln(c, [[-96 + d * .3, -98], [100 + d * .3, -98]], 6, K.brass);
    c.restore();
  }
  function conductor(c, x, y, o = {}) {
    const { s = 1, view = 'front', exp = 'neutral', talk = false, bob = 0 } = o, turn = view === 'three' ? 1 : 0, back = view === 'back', n = 1 - turn * .12;
    const X = p => p.map(([px, py]) => [px * n, py]);
    c.save(); c.translate(x, y); c.scale(s, s);
    if (view === 'side') { conductorSide(c); c.restore(); return; }
    for (const sd of [-1, 1]) { fill(c, X([[-80, -260], [-10, -260], [-16, -40], [-84, -40]]).map(([px, py]) => [px * sd, py]), K.trouser, { sm: false }); fill(c, X([[-110, -4], [-104, -44], [-60, -52], [-12, -44], [-6, -6]]).map(([px, py]) => [px * sd, py]), K.shoe); ln(c, X([[-90, -40], [-60, -46]]).map(([px, py]) => [px * sd, py]), 3, 'rgba(255,255,255,.4)'); }
    const coat = X([[-120, -740], [120, -740], [150, -560], [146, -220], [-146, -220], [-150, -560]]);
    fill(c, coat, K.coat, { shade: X([[-150, -560], [-110, -560], [-110, -220], [-146, -220]]), shadeCol: 'rgba(0,0,0,.18)' });
    if (!back) { ln(c, X([[0, -740], [0, -230]]), 5); for (let k = 0; k < 5; k++) for (const sd of [-1, 1]) ell(c, sd * 34 * n, -690 + k * 90, 9, 9, K.brass, 4);
      fill(c, X([[-46, -740], [46, -740], [0, -680]]), K.white, { sm: false, lw: 5 }); fill(c, X([[-12, -736], [12, -736], [6, -690], [-6, -690]]), '#a8323a', { sm: false, lw: 4 });   // shirt + tie
      ln(c, X([[60, -480], [96, -400], [110, -330]]), 4, K.brass); fill(c, X([[96, -340], [130, -340], [128, -300], [98, -300]]), '#b8b0a6', { sm: false, lw: 4 }); }   // punch on its chain
    for (const sd of [-1, 1]) { const g = sd > 0 ? (o.gest || 0) : 0; c.save(); if (g) { c.translate(120 * n, -736); c.rotate(-g * 1.05); c.translate(-120 * n, 736); }   // gest: the explaining hand lifts out from the shoulder
      fill(c, X([[-120, -736], [-166, -680], [-176, -430], [-140, -410], [-128, -600]]).map(([px, py]) => [px * sd, py]), K.coat, { shade: X([[-176, -560], [-156, -560], [-144, -410], [-176, -420]]).map(([px, py]) => [px * sd, py]) }); ell(c, sd * 160 * n, -396, 24, 26, K.glove, 5); c.restore(); }
    fill(c, [[-30, -790], [30, -790], [32, -736], [-32, -736]], K.skin, { sm: false, lw: 5 });
    kHead(c, turn * 8, -890 + bob, { exp, turn, back, talk });
    c.restore();
  }
  function conductorSide(c) {
    fill(c, [[-40, -260], [30, -260], [36, -40], [-44, -40]], K.trouser, { sm: false }); fill(c, [[-60, -4], [-54, -44], [20, -52], [74, -42], [80, -6]], K.shoe);
    fill(c, [[-80, -740], [60, -740], [96, -560], [86, -220], [-90, -220], [-96, -560]], K.coat, { shade: [[-96, -560], [-60, -560], [-60, -220], [-90, -220]] });
    for (let k = 0; k < 5; k++) ell(c, 60 - k * 2, -690 + k * 90, 8, 8, K.brass, 4);
    fill(c, [[-30, -730], [20, -720], [40, -420], [6, -404], [-20, -600]], K.coat); ell(c, 24, -400, 24, 26, K.glove, 5);
    fill(c, [[-20, -790], [30, -790], [32, -736], [-22, -736]], K.skin, { sm: false, lw: 5 });
    c.save(); c.translate(0, -890);
    fill(c, [[-70, -96], [40, -110], [86, -70], [96, -20], [116, 14], [96, 26], [96, 60], [60, 100], [0, 110], [-60, 90], [-80, 20]], K.skin);
    fill(c, ellPts(-30, -6, 15, 22, 0, 16), K.skin, { lw: 5 }); fill(c, [[-70, -40], [-30, -40], [-30, 20], [-74, 20]], K.white, { lw: 4 });
    eye(c, 60, -16, { exp: 'neutral', rx: 13, ry: 15, iris: '#4a3a2a', skin: K.skin, sx: .55 }); c.beginPath(); c.arc(60, -16, 22, 0, TAU); c.fillStyle = K.glass; c.fill(); c.strokeStyle = '#7a6a5a'; c.lineWidth = 4; c.stroke(); ln(c, [[38, -16], [-20, -12]], 4, '#7a6a5a');
    fill(c, [[40, -62], [90, -66], [86, -50], [40, -48]], K.white, { lw: 4 }); fill(c, [[70, 44], [118, 40], [126, 64], [96, 72], [60, 64]], K.white, { lw: 5 });
    fill(c, [[-80, -86], [-80, -150], [-20, -190], [60, -186], [86, -140], [80, -86]], K.cap); fill(c, [[70, -96], [150, -78], [146, -64], [70, -70]], K.brim, { sm: false }); ln(c, [[-80, -98], [82, -98]], 6, K.brass);
    c.restore();
  }

  // ---------- the model sheet ----------
  function sheet(c, who, o = {}) {
    const isT = who === 'traveller', pal = isT ? T : K, draw = isT ? traveller : conductor, head = isT ? tHead : kHead;
    c.fillStyle = '#f7f3ec'; c.fillRect(0, 0, W, H);
    c.strokeStyle = 'rgba(80,110,170,.12)'; c.lineWidth = 1; for (let x = 0; x < W; x += 40) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, H); c.stroke(); } for (let y = 0; y < H; y += 40) { c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke(); }
    const blue = '#3a5ea8', txt = (s2, x, y, sz = 26, al = 'center', col = blue, wt = 'bold') => { c.fillStyle = col; c.font = `${wt} ${sz}px "Segoe UI", system-ui, sans-serif`; c.textAlign = al; c.textBaseline = 'middle'; c.fillText(s2, x, y); };
    txt(isT ? 'THE TRAVELLER' : 'THE CONDUCTOR', 40, 46, 44, 'left', '#231c2e'); txt('The Night Train · model sheet · original character', 40, 86, 20, 'left', '#6a6680', '');
    const sc = isT ? .8 : .74, base = 990, views = [['FRONT', 'front', 220], ['3/4', 'three', 520], ['SIDE', 'side', 820], ['BACK', 'back', 1100]];
    views.forEach(([lb, v, x]) => { txt(lb, x, 150, 24); c.fillStyle = 'rgba(35,28,46,.12)'; c.beginPath(); c.ellipse(x, base, 130 * sc, 16, 0, 0, TAU); c.fill(); draw(c, x, base, { s: sc, view: v, exp: isT ? 'tired' : 'neutral' }); });
    // height guide
    const top = base - (isT ? 960 : 1080) * sc; c.strokeStyle = blue; c.lineWidth = 2; c.beginPath(); c.moveTo(60, top); c.lineTo(60, base); c.stroke(); txt(isT ? '5.5 heads' : '6 heads', 70, (top + base) / 2, 18, 'left');
    // expressions
    txt('EXPRESSIONS', 1580, 150, 24);
    const exps = isT ? [['tired', 'tired (default)'], ['surprised', 'startled'], ['laugh', 'laughing'], ['sad', 'sad'], ['wonder', 'wonder'], ['skeptic', '"fridge magnet"']] : [['neutral', 'calm (default)'], ['laugh', 'chuckle'], ['surprised', 'raised brows'], ['sad', 'gentle'], ['neutral', 'listening'], ['laugh', 'proud']];
    exps.forEach(([e, lb], i) => { const x = 1440 + (i % 2) * 280, y = 290 + Math.floor(i / 2) * 230; head(c, x, y + 20, { exp: e, s: .62 }); txt(lb, x, y + 112, 18, 'center', '#6a6680', ''); });
    // palette
    txt('PALETTE', 1580, 960, 22); const sw = isT ? [pal.skin, pal.hair, pal.card, pal.tee, pal.scarf, pal.jean, pal.shoe] : [pal.skin, pal.white, pal.coat, pal.brass, pal.cap, pal.glove, pal.trouser];
    sw.forEach((col, i) => { c.fillStyle = col; c.beginPath(); c.arc(1350 + i * 64, 1015, 22, 0, TAU); c.fill(); c.strokeStyle = '#231c2e'; c.lineWidth = 3; c.stroke(); });
  }
  return { traveller, conductor, tHead, kHead, sheet, T, K };
})();
