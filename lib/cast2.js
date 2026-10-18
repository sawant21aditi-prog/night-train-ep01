// The Night Train — supporting cast, same model-sheet style as chars.js. Original designs. Feet at (0,0).
const CH2 = (() => {
  const INK = '#231c2e';
  const sp = (p, k = .85) => smoothPts(p, true, 3, k);
  function fill(c, p, col, o = {}) { const { sm = true, lw = 6, shade, shadeCol = 'rgba(35,28,46,.14)' } = o, P = polyPath(sm ? sp(p) : p); c.fillStyle = col; c.fill(P); if (shade) { c.save(); c.clip(P); c.fillStyle = shadeCol; c.fill(polyPath(sm ? sp(shade) : shade)); c.restore(); } if (lw) { c.strokeStyle = INK; c.lineWidth = lw; c.lineJoin = 'round'; c.stroke(P); } }
  function ln(c, p, w = 4, col = INK) { c.save(); c.strokeStyle = col; c.lineWidth = w; c.lineCap = 'round'; c.lineJoin = 'round'; c.stroke(polyPath(smoothPts(p, false, 3, .9), false)); c.restore(); }
  const ell = (c, x, y, rx, ry, col, lw = 6) => fill(c, ellPts(x, y, rx, ry, 0, 28), col, { lw });
  function eyes(c, y, gap, r, o = {}) { const { iris = '#5a3424', shut = false } = o; for (const sd of [-1, 1]) { if (shut) { ln(c, [[sd * gap - r, y], [sd * gap, y + r * .5], [sd * gap + r, y]], 5); continue; } ell(c, sd * gap, y, r, r * 1.15, '#ffffff', 0); ell(c, sd * gap, y + 2, r * .65, r * .75, iris, 0); ell(c, sd * gap + r * .25, y - r * .25, r * .22, r * .22, '#ffffff', 0); ln(c, [[sd * gap - r - 2, y - r * .9], [sd * gap + r + 2, y - r * .9]], 5); } }
  const blush = (c, y, gap) => { for (const sd of [-1, 1]) { c.fillStyle = 'rgba(242,120,120,.42)'; c.beginPath(); c.ellipse(sd * gap, y, 16, 9, 0, 0, TAU); c.fill(); } };

  // the Traveller at eight: two hair puffs, yellow tee, red shorts, a plaster on one knee, sun-pink cheeks
  function kid(c, x, y, s = 1) {
    c.save(); c.translate(x, y); c.scale(s, s);
    for (const sd of [-1, 1]) { fill(c, [[sd * 20, -280], [sd * 64, -280], [sd * 60, -40], [sd * 26, -40]].map(([a, b]) => [a, b]), '#f3c9a6', { sm: false }); fill(c, [[sd * 14, -6], [sd * 16, -44], [sd * 70, -50], [sd * 84, -8]], '#3e7ad8'); }
    fill(c, [[24, -150], [58, -150], [58, -126], [24, -126]], '#f6e3c0', { sm: false, lw: 4 });   // plaster
    fill(c, [[-78, -340], [78, -340], [84, -250], [-84, -250]], '#d23b3b', { sm: false });   // shorts
    fill(c, [[-84, -520], [84, -520], [104, -460], [80, -440], [78, -330], [-78, -330], [-80, -440], [-104, -460]], '#ffd23f', { sm: false, shade: [[-84, -400], [84, -400], [78, -330], [-78, -330]] });
    for (const sd of [-1, 1]) { fill(c, [[sd * 92, -460], [sd * 118, -350], [sd * 100, -340], [sd * 80, -440]], '#f3c9a6', { sm: false, lw: 5 }); }
    c.save(); c.translate(0, -620);
    for (const sd of [-1, 1]) ell(c, sd * 92, -70, 46, 44, '#2b1d26');
    fill(c, [[-92, -10], [-86, -84], [-40, -112], [40, -112], [86, -84], [92, -10], [80, 50], [40, 86], [-40, 86], [-80, 50]], '#f3c9a6');
    fill(c, [[-96, -40], [-80, -100], [-20, -126], [50, -122], [92, -90], [96, -40], [60, -70], [10, -84], [-40, -70]], '#2b1d26');
    eyes(c, -6, 34, 17); blush(c, 30, 56); ln(c, [[-4, 18], [2, 26]], 3, '#b87a64'); fill(c, [[-22, 44], [22, 44], [12, 62], [-12, 62]], '#8a2a3a', { lw: 4 });
    c.restore(); c.restore();
  }
  // the tailor: elderly, bald crown with grey sides, measuring tape round the neck, waistcoat, sleeves rolled
  function tailor(c, x, y, s = 1) {
    c.save(); c.translate(x, y); c.scale(s, s);
    for (const sd of [-1, 1]) { fill(c, [[sd * 10, -360], [sd * 74, -360], [sd * 68, -36], [sd * 18, -36]], '#6a6a7a', { sm: false }); fill(c, [[sd * 10, -4], [sd * 14, -40], [sd * 80, -44], [sd * 90, -6]], '#3a2a2a'); }
    fill(c, [[-96, -700], [96, -700], [108, -360], [-108, -360]], '#f4efe6', { sm: false });
    fill(c, [[-92, -690], [-14, -690], [-6, -380], [-100, -380]], '#3a6a5a', { sm: false, shade: [[-100, -500], [-70, -500], [-70, -380], [-100, -380]] }); fill(c, [[92, -690], [14, -690], [6, -380], [100, -380]], '#3a6a5a', { sm: false });
    for (let k = 0; k < 3; k++) ell(c, -24, -640 + k * 80, 7, 7, '#e2b44a', 3);
    for (const sd of [-1, 1]) { fill(c, [[sd * 96, -690], [sd * 140, -620], [sd * 140, -500], [sd * 110, -500], [sd * 104, -600]], '#f4efe6'); fill(c, [[sd * 112, -500], [sd * 140, -500], [sd * 136, -400], [sd * 112, -404]], '#d8a07a', { lw: 5 }); }
    ln(c, [[-50, -700], [-40, -560], [-30, -420]], 10, '#ffd23f'); ln(c, [[50, -700], [40, -600]], 10, '#ffd23f');   // measuring tape
    c.save(); c.translate(0, -800);
    fill(c, [[-84, 0], [-80, -80], [-30, -110], [30, -110], [80, -80], [84, 0], [76, 60], [40, 94], [-40, 94], [-76, 60]], '#d8a07a');
    for (const sd of [-1, 1]) fill(c, [[sd * 86, -40], [sd * 98, 0], [sd * 88, 40], [sd * 74, 10], [sd * 76, -40]], '#e8e4dc', { lw: 5 });
    eyes(c, -10, 32, 13); ln(c, [[-50, -40], [-16, -46]], 6, '#e8e4dc'); ln(c, [[16, -46], [50, -40]], 6, '#e8e4dc');
    ln(c, [[0, 6], [8, 28], [-4, 32]], 4, '#a86a50'); ln(c, [[-20, 56], [0, 64], [20, 56]], 4, '#7a3a3a'); blush(c, 34, 52);
    ln(c, [[-30, -96], [10, -104]], 5, 'rgba(255,255,255,.6)');   // shine on the bald crown
    c.restore(); c.restore();
  }
  // the woman at the bus stop: short curly hair, long camel coat, the scarf (a new colour every day)
  function scarfWoman(c, x, y, s = 1, scarf = '#3e7ad8') {
    c.save(); c.translate(x, y); c.scale(s, s);
    for (const sd of [-1, 1]) { fill(c, [[sd * 14, -230], [sd * 60, -230], [sd * 56, -36], [sd * 20, -36]], '#2a2a3a', { sm: false }); fill(c, [[sd * 12, -4], [sd * 16, -40], [sd * 66, -44], [sd * 74, -6]], '#5a2a3a'); }
    fill(c, [[-96, -720], [96, -720], [124, -230], [-124, -230]], '#c89a6a', { sm: false, shade: [[-124, -500], [-90, -500], [-90, -230], [-124, -230]] });
    ln(c, [[0, -680], [0, -240]], 5); for (let k = 0; k < 3; k++) ell(c, 0, -600 + k * 110, 7, 7, '#5a3a2a', 3);
    for (const sd of [-1, 1]) { fill(c, [[sd * 96, -716], [sd * 140, -650], [sd * 148, -440], [sd * 116, -430], [sd * 110, -620]], '#c89a6a'); ell(c, sd * 132, -420, 18, 20, '#c88a6a', 5); }
    fill(c, [[-76, -760], [76, -760], [84, -700], [-84, -700]], scarf); fill(c, [[30, -720], [70, -720], [64, -580], [32, -584]], scarf, { sm: false });
    c.save(); c.translate(0, -850);
    fill(c, [[-80, 0], [-76, -76], [-30, -104], [30, -104], [76, -76], [80, 0], [70, 56], [34, 88], [-34, 88], [-70, 56]], '#c88a6a');
    for (let k = 0; k < 9; k++) { const a = Math.PI + k / 8 * Math.PI; ell(c, Math.cos(a) * 82, -40 + Math.sin(a) * 76, 30, 28, '#4a2a1a', 5); }
    eyes(c, -4, 30, 14, { iris: '#3a2a1a' }); blush(c, 30, 50); ln(c, [[0, 12], [6, 28], [-2, 30]], 4, '#8a5a40'); ln(c, [[-14, 52], [0, 58], [14, 52]], 4, '#7a3a3a');
    c.restore(); c.restore();
  }
  // the chai stall keeper: young, towel over the shoulder, steel kettle
  function chaiwala(c, x, y, s = 1) {
    c.save(); c.translate(x, y); c.scale(s, s);
    for (const sd of [-1, 1]) { fill(c, [[sd * 12, -330], [sd * 66, -330], [sd * 62, -36], [sd * 18, -36]], '#4a5a7a', { sm: false }); fill(c, [[sd * 10, -4], [sd * 14, -40], [sd * 74, -44], [sd * 82, -6]], '#c89a6a'); }
    fill(c, [[-90, -680], [90, -680], [100, -330], [-100, -330]], '#e8eef8', { sm: false, shade: [[-100, -500], [-70, -500], [-70, -330], [-100, -330]] });
    fill(c, [[20, -690], [80, -690], [70, -520], [40, -520]], '#d23b3b', { sm: false }); for (let k = 0; k < 4; k++) ln(c, [[26 + k * 14, -680], [34 + k * 10, -530]], 3, '#ffffff');   // checked towel
    for (const sd of [-1, 1]) { fill(c, [[sd * 90, -676], [sd * 130, -600], [sd * 136, -420], [sd * 106, -410], [sd * 100, -580]], '#e8eef8'); ell(c, sd * 122, -400, 18, 20, '#b07850', 5); }
    fill(c, [[-170, -460], [-110, -460], [-104, -380], [-176, -380]], '#b8c0cc', { sm: false, lw: 5 }); ln(c, [[-110, -440], [-80, -420]], 6, '#8a92a0'); ln(c, [[-150, -480], [-160, -520], [-146, -548]], 3, 'rgba(160,140,170,.6)');   // kettle + steam
    c.save(); c.translate(0, -780);
    fill(c, [[-80, 0], [-76, -76], [-30, -104], [30, -104], [76, -76], [80, 0], [70, 56], [34, 88], [-34, 88], [-70, 56]], '#b07850');
    fill(c, [[-86, -30], [-74, -100], [-20, -126], [50, -120], [88, -80], [86, -30], [50, -76], [0, -60], [-50, -76]], '#1a1418');
    eyes(c, -4, 30, 14, { iris: '#2a1a12' }); blush(c, 30, 50); ln(c, [[0, 12], [6, 28], [-2, 30]], 4, '#7a4a30'); fill(c, [[-22, 50], [22, 50], [14, 64], [-14, 64]], '#ffffff', { lw: 4 });   // big grin
    c.restore(); c.restore();
  }
  // the sleepy street dog on the wall, and the pigeon
  function dog(c, x, y, s = 1, asleep = true) {
    c.save(); c.translate(x, y); c.scale(s, s);
    fill(c, [[-170, 0], [-160, -70], [-60, -96], [80, -90], [150, -60], [160, 0]], '#c8803a', { shade: [[-170, -30], [160, -30], [160, 0], [-170, 0]] });
    fill(c, [[90, -60], [110, -120], [190, -126], [230, -90], [220, -30], [140, -20]], '#c8803a');
    fill(c, [[120, -110], [96, -60], [118, -50], [140, -100]], '#8a4a20'); fill(c, [[200, -116], [236, -70], [222, -56], [196, -96]], '#8a4a20');   // floppy ears
    ell(c, 232, -74, 14, 11, '#231c2e', 0);   // nose
    if (asleep) { ln(c, [[160, -84], [176, -78], [190, -84]], 4); ln(c, [[196, -86], [208, -82]], 4); } else { ell(c, 176, -86, 9, 10, '#231c2e', 0); ell(c, 204, -88, 9, 10, '#231c2e', 0); }
    ln(c, [[-160, -40], [-220, -60], [-240, -30]], 12, '#c8803a'); fill(c, [[-120, -10], [-60, -10], [-60, 6], [-120, 6]], '#c8803a', { sm: false, lw: 5 });
    ell(c, 0, -60, 30, 18, '#f0c890', 0);   // pale belly patch
    c.restore();
  }
  function pigeon(c, x, y, s = 1) {
    c.save(); c.translate(x, y); c.scale(s, s);
    fill(c, [[-70, -20], [-60, -70], [0, -90], [60, -70], [80, -30], [40, 0], [-40, 0]], '#9a9ab8', { shade: [[-70, -40], [80, -40], [40, 0], [-40, 0]] });
    fill(c, [[-80, -50], [-140, -40], [-130, -20], [-70, -26]], '#7a7a98');
    fill(c, ellPts(66, -100, 30, 30, 0, 22), '#8a8aa8'); fill(c, [[40, -84], [90, -84], [84, -60], [44, -60]], '#5a9a8a', { sm: false, lw: 4 });   // green-purple neck sheen
    ell(c, 76, -108, 7, 7, '#ff8a3a', 3); ell(c, 76, -108, 3, 3, '#231c2e', 0); fill(c, [[94, -104], [118, -98], [94, -92]], '#e8c8a0', { sm: false, lw: 4 });
    for (const sd of [-1, 1]) ln(c, [[sd * 14, 0], [sd * 16, 30], [sd * 26, 34]], 5, '#e88a7a');
    c.restore();
  }

  function sheet(c) {
    c.fillStyle = '#f7f3ec'; c.fillRect(0, 0, W, H);
    c.strokeStyle = 'rgba(80,110,170,.12)'; c.lineWidth = 1; for (let x = 0; x < W; x += 40) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, H); c.stroke(); } for (let yy = 0; yy < H; yy += 40) { c.beginPath(); c.moveTo(0, yy); c.lineTo(W, yy); c.stroke(); }
    const txt = (s2, x, y, sz = 24, col = '#3a5ea8', wt = 'bold', al = 'center') => { c.fillStyle = col; c.font = `${wt} ${sz}px "Segoe UI", system-ui, sans-serif`; c.textAlign = al; c.textBaseline = 'middle'; c.fillText(s2, x, y); };
    txt('SUPPORTING CAST', 40, 46, 44, '#231c2e', 'bold', 'left'); txt('The Night Train · Episode 1 · original characters', 40, 86, 20, '#6a6680', '', 'left');
    const base = 900;
    [['THE TRAVELLER, AGE 8', 'scene 7 · river', 200, kid, .9], ['THE TAILOR', 'scene 10 · corner shop', 520, tailor, .78], ['THE SCARF WOMAN', 'scene 10 · bus stop', 840, scarfWoman, .76], ['THE CHAI SELLER', 'scene 12 · station', 1160, chaiwala, .8]].forEach(([n, where, x, fn, s]) => {
      c.fillStyle = 'rgba(35,28,46,.12)'; c.beginPath(); c.ellipse(x, base, 120, 14, 0, 0, TAU); c.fill(); fn(c, x, base, s); txt(n, x, base + 50, 22); txt(where, x, base + 80, 18, '#6a6680', '');
    });
    // the scarf, every day a different colour
    txt('THE SCARF, DAY BY DAY', 1640, 150, 22); ['#c8323c', '#3e7ad8', '#ffd23f', '#3aa06a', '#c48bff', '#ff8a6a'].forEach((col, i) => { fill(c, [[1480 + (i % 3) * 110, 200 + Math.floor(i / 3) * 80], [1560 + (i % 3) * 110, 200 + Math.floor(i / 3) * 80], [1564 + (i % 3) * 110, 240 + Math.floor(i / 3) * 80], [1476 + (i % 3) * 110, 240 + Math.floor(i / 3) * 80]], col, { lw: 4 }); });
    txt('THE DOG ON THE WALL', 1640, 420, 22); dog(c, 1600, 600, .9, true); txt('asleep (drive there)', 1640, 640, 18, '#6a6680', '');
    txt('THE PIGEON', 1640, 720, 22); pigeon(c, 1640, 880, 1); txt('scene 12 · platform', 1640, 930, 18, '#6a6680', '');
  }
  return { kid, tailor, scarfWoman, chaiwala, dog, pigeon, sheet };
})();
