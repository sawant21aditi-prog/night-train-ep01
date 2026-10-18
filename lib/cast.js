// The Night Train — close-up drawings of the cast, fine-line, form-following hatch. Needs core, night, magic.
const CAST = (() => {
  const { line, hatch, P } = NT;
  const sp = pts => smoothPts(pts, true, 3, .9);

  // Traveller in profile, facing right, looking out. Local origin ~ ear. Head height ~400 at s=1.
  function travellerProfile(c, x, y, o = {}) {
    const { s = 1, t = 0, seed = 500, moon = '#bfe0ff', blink = 0, lift = 0 } = o;
    c.save(); c.translate(x, y); c.scale(s, s); c.rotate(-lift * .05);
    // coat + collar + scarf (below the head)
    const coat = [[-260, 230], [-150, 150], [-40, 170], [90, 190], [210, 260], [300, 420], [-320, 420]];
    c.fillStyle = '#3d4256'; c.fill(polyPath(sp(coat)));
    MG.grain(c, sp(coat), { gap: 7, angle: .5, color: '#14121e', al: .6, seed, t, wave: 4 });
    line(c, sp(coat), { close: true, w: 2.2, seed, t, color: '#14121e' });
    const scarf = [[-150, 150], [-60, 120], [60, 135], [120, 170], [90, 215], [-20, 200], [-130, 205]];
    c.fillStyle = '#b8452e'; c.fill(polyPath(sp(scarf)));
    MG.grain(c, sp(scarf), { gap: 6, angle: 1.2, color: '#5a1a10', al: .55, seed: seed + 1, t, wave: 3 });
    for (let i = 0; i < 9; i++) line(c, [[-140 + i * 28, 150 + i * 2], [-130 + i * 28, 205]], { w: 1.2, seed: seed + 40 + i, t, color: '#ffd9b0', al: .35 });
    line(c, sp(scarf), { close: true, w: 2, seed: seed + 1, t, color: '#3a120a' });
    // head
    const head = [[-120, 150], [-112, 60], [-132, -20], [-122, -112], [-72, -172], [0, -196], [70, -176], [114, -122], [130, -62], [127, -42], [151, 2], [139, 15], [129, 22], [133, 38], [127, 48], [131, 61], [119, 73], [117, 93], [101, 111], [60, 120], [40, 152]];
    const hp = smoothPts(head, true, 3, .85);
    c.fillStyle = '#f0c6a0'; c.fill(polyPath(hp));
    c.save(); c.clip(polyPath(hp));   // form shading: dense hatch on the far (back) side, light on the cheek
    const sg = c.createLinearGradient(-130, 0, 140, 0); sg.addColorStop(0, alpha('#8a4a30', .55)); sg.addColorStop(.55, alpha('#8a4a30', .08)); sg.addColorStop(1, alpha('#8a4a30', 0)); c.fillStyle = sg; c.fillRect(-200, -260, 420, 420);
    MG.grain(c, [[-140, -200], [10, -200], [-30, 160], [-140, 160]], { gap: 7, angle: 1.35, color: '#6a3a24', al: .22, w: .8, seed: seed + 2, t, wave: 4 });
    glow(c, 70, 40, 60, '#ff8a7a', .18);
    const cg = c.createRadialGradient(150, -20, 10, 150, -20, 220); cg.addColorStop(0, alpha(moon, .35)); cg.addColorStop(1, alpha(moon, 0)); c.fillStyle = cg; c.fillRect(-200, -260, 420, 420);   // moonlight on the face
    c.restore();
    line(c, hp, { close: true, w: 2.4, seed: seed + 4, t, color: '#2a1610', pressure: .7 });
    c.save(); c.globalCompositeOperation = 'screen'; line(c, smoothPts(head.slice(8, 17), false, 3, .6), { w: 3, seed: seed + 5, t, color: moon, al: .8 }); c.restore();   // cool rim on the profile
    // hair: a mass, then many fine flowing strands
    const hair = [[-140, -10], [-134, -122], [-74, -192], [10, -216], [88, -190], [124, -128], [104, -118], [62, -150], [4, -160], [-38, -124], [-66, -64], [-92, 18]];
    const hpth = smoothPts(hair, true, 3, .8); c.fillStyle = '#2b1e1a'; c.fill(polyPath(hpth));
    c.save(); c.clip(polyPath(hpth)); c.strokeStyle = '#7a5a48'; c.lineWidth = 1; c.globalAlpha = .7; c.beginPath();
    for (let k = 0; k < 34; k++) { const a0 = -.2 + k * .09; for (let u = 0; u <= 20; u++) { const a = a0 + u * .02, rr = 60 + u * 9 + noise1(k + u * .3, seed + 6 + NT.boil(t)) * 6, px = -10 + Math.cos(Math.PI + a) * rr * -.9 + u * 2, py = -40 - Math.sin(a + 1.2) * rr; u ? c.lineTo(px, py) : c.moveTo(px, py); } }
    c.stroke(); c.restore();
    line(c, hpth, { close: true, w: 2, seed: seed + 7, t, color: '#140c0a' });
    // ear
    line(c, [[-8, -60], [14, -70], [22, -40], [6, -8], [-6, 0]], { w: 2, seed: seed + 8, t, color: '#5a2e1c' }); line(c, [[2, -48], [10, -30]], { w: 1.4, seed: seed + 9, t, color: '#5a2e1c' });
    // eye: tired, half-lidded, a point of moonlight in it
    const ey = -58, ex = 98, lid = .55 + blink * .45;
    line(c, [[ex - 26, ey], [ex - 6, ey - 11 + lid * 6], [ex + 14, ey - 6 + lid * 4]], { w: 2.6, seed: seed + 10, t, color: '#1a0e0a' });
    if (blink < .8) { c.fillStyle = '#1a0e0a'; c.beginPath(); c.ellipse(ex - 4, ey + 1, 6, 6 * (1 - blink), 0, 0, TAU); c.fill(); c.fillStyle = '#eaf6ff'; c.beginPath(); c.arc(ex - 2, ey - 1, 1.8, 0, TAU); c.fill(); }
    line(c, [[ex - 22, ey + 9], [ex + 6, ey + 10]], { w: 1.2, seed: seed + 11, t, color: '#5a2e1c', al: .8 });
    line(c, [[ex - 30, ey - 22], [ex + 16, ey - 26]], { w: 3, seed: seed + 12, t, color: '#2b1e1a' });   // brow
    line(c, [[ex - 20, ey + 22], [ex - 2, ey + 30]], { w: 1, seed: seed + 13, t, color: '#6a3a24', al: .6 });   // tired crease
    c.restore();
  }

  // the Conductor as a ghostly reflection: cool-blue silhouette with cap, moustache and gold buttons
  function conductorGhost(c, x, y, o = {}) {
    const { s = 1, t = 0, al = .5, seed = 600 } = o; if (al <= 0) return;
    c.save(); c.translate(x, y); c.scale(s, s); c.globalAlpha *= Math.min(1, al * 1.3); c.globalCompositeOperation = 'screen';
    const body = smoothPts([[-170, 420], [-150, 160], [-80, 110], [80, 110], [150, 160], [170, 420]], true, 3, .8);
    const head = smoothPts(ellPts(0, 10, 78, 92, 0, 30), true, 3, .8);
    c.fillStyle = '#1d2a55'; c.fill(polyPath(body)); c.fill(polyPath(head));
    MG.stipple(c, body, { n: 700, color: '#9fc4ff', size: 1.6, seed, t, glow: true, al: .7, density: (px, py) => .3 + .5 * Math.max(0, (py - y) / 400) });
    line(c, body, { close: true, w: 2, color: '#9fc4ff', seed, t, al: .8 }); line(c, head, { close: true, w: 2, color: '#9fc4ff', seed: seed + 1, t, al: .8 });
    const crown = [[-74, -46], [-66, -112], [-20, -126], [60, -118], [80, -46]], brim = [[-92, -48], [92, -48], [112, -30], [-84, -34]];
    c.fillStyle = '#16204a'; c.fill(polyPath(crown)); c.fill(polyPath(brim)); MG.stipple(c, crown, { n: 260, color: '#9fc4ff', size: 1.5, seed: seed + 9, t, glow: true, al: .8 });
    line(c, crown, { close: true, w: 2.4, color: '#cfe0ff', seed: seed + 3, t }); line(c, brim, { close: true, w: 3, color: '#cfe0ff', seed: seed + 2, t });
    MG.sparkle(c, 0, -86, 10, '#ffd27a', 1);   // cap badge
    line(c, [[-34, 52], [0, 42], [34, 52]], { w: 3, color: '#ffffff', seed: seed + 4, t, al: .9 });   // moustache
    for (let i = 0; i < 4; i++) MG.sparkle(c, 0, 160 + i * 60, 8, '#ffd27a', .9);
    c.restore();
  }

  // glass of chai on the sill; the moon floats in the tea
  function chai(c, x, y, o = {}) {
    const { s = 1, t = 0, seed = 700, moon = '#fff4d6' } = o;
    c.save(); c.translate(x, y); c.scale(s, s);
    const glass = [[-70, -150], [70, -150], [56, 30], [-56, 30]];
    c.fillStyle = alpha('#d8e8f0', .18); c.fill(polyPath(glass));
    c.fillStyle = '#9a4e22'; c.fill(polyPath([[-66, -100], [66, -100], [56, 30], [-56, 30]]));
    MG.grain(c, [[-66, -100], [66, -100], [56, 30], [-56, 30]], { gap: 6, angle: .05, color: '#3a1606', al: .4, seed, t, wave: 2 });
    c.save(); c.beginPath(); c.ellipse(0, -100, 66, 12, 0, 0, TAU); c.fillStyle = '#c87a3a'; c.fill(); c.clip();
    glow(c, 18, -100, 40, moon, .9); c.fillStyle = moon; c.beginPath(); c.ellipse(18, -100, 10, 4, 0, 0, TAU); c.fill(); c.restore();
    MG.rings(c, 18, -100, { r0: 6, gap: 10, n: 4, color: '#fff4d6', al: .5, t, w: 1, speed: 4 });
    line(c, glass, { close: true, w: 2, color: '#e8f4ff', seed, t, al: .9 });
    c.save(); c.globalCompositeOperation = 'screen'; line(c, [[-52, -130], [-44, 10]], { w: 4, color: '#ffffff', seed: seed + 1, t, al: .5 }); c.restore();   // glass highlight
    MG.steam(c, 0, -112, t, { h: 200 });
    c.restore();
  }
  return { travellerProfile, conductorGhost, chai };
})();
