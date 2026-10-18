// The Night Train — original cast drawn as night-anime cels. Needs core, night, anime.
const CASTA = (() => {
  const { C, cel, stroke } = AN;

  // Traveller, profile facing right. Origin near the ear. Head ~360 tall at s=1.
  // blink 0..1, look -1..1 shifts the iris, breath lifts the shoulders.
  function traveller(c, x, y, o = {}) {
    const { s = 1, t = 0, blink = 0, look = 0 } = o, br = breathe(twos(t), 3.6) * 4, talk = NT.speaking('T');
    c.save(); c.translate(x, y); c.scale(s, s);
    // coat and scarf
    cel(c, [[-300, 420], [-250, 210 - br], [-120, 150 - br], [40, 160 - br], [170, 205 - br], [260, 300], [320, 420]], C.coat, { shadow: [[-300, 420], [-250, 200], [-80, 170], [-40, 420]], w: 6 });
    stroke(c, [[60, 175 - br], [150, 260], [190, 420]], { w: 4, color: C.ink });   // coat fold
    cel(c, [[-30, 70], [40, 92], [48, 160], [-36, 160]], C.skin, { shadow: [[-30, 70], [10, 80], [0, 160], [-36, 160]], shade: .3, w: 5 });   // neck
    cel(c, [[-170, 150 - br], [-80, 118 - br], [60, 128 - br], [150, 160 - br], [130, 220], [-40, 215], [-160, 222]], C.scarf, { shadow: [[-170, 150], [-60, 170], [130, 200], [130, 222], [-160, 222]], w: 6 });
    stroke(c, [[-60, 140 - br], [-50, 212]], { w: 3, color: alpha(C.ink, .6) });
    // head
    const face = [[-40, -150], [40, -168], [96, -122], [112, -64], [117, -34], [135, -2], [119, 10], [121, 28], [114, 38], [117, 50], [100, 76], [80, 96], [48, 100], [8, 80], [-30, 40], [-62, -20], [-72, -92]];
    cel(c, face, C.skin, { shadow: [[-90, -120], [20, -120], [36, 30], [70, 110], [-90, 110]], shade: .2, w: 6 });
    glow(c, 96, -20, 70, '#9fc0ff', .25);   // moonlight on the cheek
    c.save(); c.globalCompositeOperation = 'screen'; stroke(c, [[110, -70], [116, -36], [133, -4]], { w: 3, color: C.line, al: .8 }); c.restore();   // cool rim
    // ear
    cel(c, [[-34, -64], [-10, -78], [4, -50], [-6, -20], [-30, -18]], C.skin, { shadow: [[-34, -64], [-18, -64], [-20, -18], [-30, -18]], w: 4 });
    // hair: back mass, bangs chunks, nape, one hard sheen band
    cel(c, [[-152, -36], [-142, -152], [-62, -218], [42, -224], [112, -174], [128, -122], [96, -132], [64, -152], [2, -146], [-40, -90], [-66, -20], [-104, 46], [-150, 34]], C.hair, { w: 6 });
    cel(c, [[26, -196], [116, -156], [132, -96], [104, -112], [100, -80], [76, -116], [60, -88], [44, -134]], C.hair, { w: 5, smooth: false });
    cel(c, [[-106, 30], [-70, -10], [-52, 40], [-80, 70]], C.hair, { w: 5, smooth: false });
    c.save(); c.globalCompositeOperation = 'screen'; stroke(c, [[-96, -158], [-46, -194], [14, -204]], { w: 14, color: alpha(C.line, .4) }); c.restore();
    // eye (profile anime): lid line, sclera wedge, iris, pupil, two catchlights
    const lid = blink;
    if (lid < .85) {
      c.save(); const eye = [[70, -60], [101, -71], [106, -52 - lid * 12], [80, -45 - lid * 10]]; c.fillStyle = C.sclera; c.fill(polyPath(eye)); c.clip(polyPath(eye));
      c.fillStyle = C.iris; c.beginPath(); c.ellipse(92 + look * 5, -57, 10, 14, 0, 0, TAU); c.fill();
      c.fillStyle = C.hair; c.beginPath(); c.ellipse(94 + look * 5, -57, 5, 8, 0, 0, TAU); c.fill();
      c.fillStyle = C.moon; c.fillRect(96 + look * 5, -66, 4, 5); c.fillRect(89 + look * 5, -52, 2.5, 3); c.restore();
    }
    stroke(c, [[66, -58], [84, -68], [104, -72 + lid * 14]], { w: 5, color: C.ink });   // upper lid
    stroke(c, [[78, -44], [100, -48]], { w: 2, color: alpha(C.ink, .7) });
    stroke(c, [[62, -84], [86, -92], [106, -88]], { w: 5, color: C.hair });   // brow (a little worried)
    if (talk) { c.fillStyle = '#5a1e22'; c.beginPath(); c.ellipse(112, 34, 6, 7, 0, 0, TAU); c.fill(); } else stroke(c, [[108, 30], [116, 31]], { w: 2.5, color: alpha('#7a3a30', .8) });   // mouth: opens on the Traveller's words
    c.restore();
  }

  // the Conductor as a reflection in the glass: cool glowing line drawing, soft fill
  function conductorReflection(c, x, y, o = {}) {
    const { s = 1, t = 0, al = .5 } = o, talk = NT.speaking('C'); if (al <= 0) return;
    c.save(); c.translate(x, y); c.scale(s, s); c.globalAlpha *= al; c.globalCompositeOperation = 'screen';
    const body = [[-180, 420], [-160, 170], [-70, 120], [70, 120], [160, 170], [180, 420]], head = ellPts(0, 20, 76, 90, 0, 32);
    c.fillStyle = alpha('#3a4fb0', .45); c.fill(polyPath(AN.sp(body))); c.fill(polyPath(AN.sp(head)));
    const cap = [[-78, -46], [-84, -100], [-30, -128], [60, -124], [86, -46]], brim = [[-70, -48], [92, -48], [150, -20], [-60, -30]];
    c.fillStyle = alpha('#3a4fb0', .55); c.fill(polyPath(cap)); c.fill(polyPath(brim));
    [body, head].forEach(p => stroke(c, p, { w: 3, color: C.line, close: true }));
    stroke(c, cap, { w: 3, color: C.line, close: true }); stroke(c, brim, { w: 4, color: C.line, close: true });
    stroke(c, [[-36, 60], [0, 48], [36, 60]], { w: 5, color: '#ffffff' });   // moustache
    if (talk) stroke(c, [[-14, 76], [14, 76]], { w: 4, color: C.line });   // he speaks
    for (let i = 0; i < 4; i++) glow(c, 0, 180 + i * 56, 14, C.practical, .9);
    glow(c, 0, -86, 16, C.practical, 1);   // cap badge
    c.restore();
  }

  // a glass of chai on the sill, glowing warm; the moon floats in the tea
  function chai(c, x, y, o = {}) {
    const { s = 1, t = 0 } = o;
    c.save(); c.translate(x, y); c.scale(s, s);
    glow(c, 0, -40, 220, C.practical, .45);
    const glass = [[-66, -150], [66, -150], [54, 30], [-54, 30]];
    c.fillStyle = alpha('#cfe0ff', .16); c.fill(polyPath(glass));
    cel(c, [[-62, -96], [62, -96], [54, 30], [-54, 30]], '#b8602a', { shadow: [[10, -96], [62, -96], [54, 30], [20, 30]], shade: .3, w: 0, smooth: false });
    c.save(); c.beginPath(); c.ellipse(0, -96, 62, 11, 0, 0, TAU); c.fillStyle = '#e08a40'; c.fill(); c.clip(); glow(c, 16, -96, 34, C.moon, 1); c.fillStyle = C.moon; c.beginPath(); c.ellipse(16, -96, 11, 4, 0, 0, TAU); c.fill(); c.restore();
    stroke(c, glass, { w: 4, color: C.line, close: true });
    c.save(); c.globalCompositeOperation = 'screen'; stroke(c, [[-48, -130], [-40, 8]], { w: 6, color: '#ffffff', al: .45 }); c.restore();
    c.save(); c.strokeStyle = alpha('#fff0dc', .5); c.lineWidth = 3; c.lineCap = 'round';
    for (let k = 0; k < 3; k++) { c.beginPath(); for (let i = 0; i <= 24; i++) { const u = i / 24, yy = -110 - u * 190, xx = (k - 1) * 18 + Math.sin(u * 6 + t * 1.5 + k * 2) * 16 * u; i ? c.lineTo(xx, yy) : c.moveTo(xx, yy); } c.globalAlpha = .55 * (1 - .3 * k); c.stroke(); }
    c.restore(); c.restore();
  }
  return { traveller, conductorReflection, chai };
})();
