"""Five-layer sound mix for an episode, synthesised in code (free, no samples).

Usage: python sound_mix.py <episode dir>
Reads film/assets/voice.wav + film/lib/speech.js, writes film/assets/mix.wav.

Layers (DirectorSKILL, dB relative to dialogue at 0):
  RT  room tone    -36  continuous under everything
  AMB ambience     -24  one bed per location, crossfaded only where the space changes
  FOL foley        -18  synced to on-screen business (sips, the Conductor's gesture)
  SFX spot effects -12  synced to the frame (whistle, light sweeps, paper wipes, bells)
  MUS score        -20 under dialogue, -10 in the clear; enters and swells on named beats
"""
import json
import re
import sys
import wave
from pathlib import Path

import numpy as np

EP = Path(sys.argv[1])
FILM = EP / "film" if (EP / "film").exists() else EP
SR, DUR, CALM = 44100, 288.0, 0.9
N = int(SR * DUR)
rng = np.random.default_rng(7)
import time; T0 = time.time(); tick = lambda m: print(f"{time.time() - T0:6.1f}s {m}", flush=True)
t = np.arange(N) / SR
db = lambda d: 10 ** (d / 20)

# scene starts in calm seconds (direct.js) -> film seconds
START = dict(f01=0, f02=12.4, f03=39.0, f04=53.5, f05=79.2, f06=107.5, f07=137.4, f08=175.0, f09=203.0, f10=216.5, f11=253.0, f12=288.3, f13=309.4)
LOC = dict(f01="carriage", f02="carriage", f03="carriage", f04="road", f05="road", f06="carriage", f07="river", f08="train", f09="carriage", f10="street", f11="street", f12="platform", f13="platform")
F = {k: v * CALM for k, v in START.items()}
speech = json.loads(re.search(r"=\s*(\{.*\})", (FILM / "lib/speech.js").read_text()).group(1))
LINES = {w: [(a * CALM, b * CALM) for a, b, _ in speech[w]] for w in "TC"}


def band(x, lo, hi):   # FFT band-pass, soft edges
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    m = np.clip((f - lo * .7) / (lo * .3 + 1e-9), 0, 1) * np.clip((hi * 1.3 - f) / (hi * .3), 0, 1)
    return np.fft.irfft(X * m, len(x))


def bnoise(lo, hi):   # band-limited noise: filter a ~24s loop once, then tile it (noise has no audible seam)
    L = 1 << 20; x = band(rng.standard_normal(L), lo, hi)
    return np.tile(x, N // L + 1)[:N]


def norm(x):
    return x / (np.sqrt(np.mean(x ** 2)) + 1e-12) * .1   # every source at the same RMS, then levelled in dB


def noise(n=N):
    return rng.standard_normal(n)


def env(a, b, up=1.5, down=1.5):   # 0..1 window over [a, b] with smooth fades
    return np.clip(np.minimum((t - a) / up + .5, (b - t) / down + .5), 0, 1)


def place(buf, at, snd, gain=1.0):
    i = int(at * SR)
    if i >= N: return
    j = min(N, i + len(snd)); buf[i:j] += snd[:j - i] * gain


def tone(f, d, decay=3.0, harm=(1, .4, .2)):
    tt = np.arange(int(d * SR)) / SR
    return sum(h * np.sin(2 * np.pi * f * (k + 1) * tt) for k, h in enumerate(harm)) * np.exp(-tt * decay) * np.minimum(1, tt * 200)


# ---------- RT: one continuous bed, never re-triggered ----------
rt = norm(bnoise(40, 400)) * db(-36)

tick("rt")
# ---------- AMB: a bed per space, crossfaded at the space change ----------
def amb_carriage():
    rumble = norm(bnoise(30, 180)) * (1 + .25 * np.sin(2 * np.pi * .3 * t))
    clack = np.zeros(N); k = tone(90, .12, 40, (1, .6, .3)) + band(noise(int(.12 * SR)), 800, 3000) * np.exp(-np.arange(int(.12 * SR)) / SR * 50) * .5
    for s in np.arange(.2, DUR, 1.15): place(clack, s, k); place(clack, s + .16, k, .8)   # clickety-clack
    return rumble + norm(clack) * .7

def amb_crickets(n=6):
    L = 1 << 20; tl = t[:L]; out = np.zeros(L, np.float32)   # a ~24s cricket loop, tiled
    for c in range(n):
        f = 4200 + c * 260; ph = rng.uniform(0, 1); rate = rng.uniform(.6, 1.1)
        gate = (np.sin(2 * np.pi * (rate * tl + ph)) > .55) * (np.sin(2 * np.pi * 28 * tl) > 0)
        out += (np.sin(2 * np.pi * f * tl) * gate * rng.uniform(.5, 1)).astype(np.float32)
    return norm(np.tile(out, N // L + 1)[:N].astype(float))

def wind():
    return norm(bnoise(200, 1200)) * (.6 + .4 * np.sin(2 * np.pi * .07 * t))

def amb_river():
    water = norm(bnoise(300, 4000)) * (1 + .3 * np.sin(2 * np.pi * 1.7 * t) * np.sin(2 * np.pi * .43 * t))
    birds = np.zeros(N)
    for s in np.arange(F["f07"] + 2, F["f08"], 3.3):
        d = .18; tt = np.arange(int(d * SR)) / SR; f0 = rng.uniform(2500, 3800)
        chirp = np.sin(2 * np.pi * (f0 * tt + 3000 * tt ** 2)) * np.sin(np.pi * tt / d)
        place(birds, s + rng.uniform(0, 1.5), chirp); place(birds, s + 1.9, chirp, .6)
    return water + norm(birds) * .5

def amb_street():
    murmur = norm(bnoise(250, 1800)) * (1 + .4 * np.abs(np.sin(2 * np.pi * .9 * t)) * np.sin(2 * np.pi * .23 * t))
    bells = np.zeros(N)
    for s in np.arange(F["f10"] + 4, F["f12"], 9.0): place(bells, s, tone(2350, .8, 5, (1, .3, .1))); place(bells, s + .18, tone(2350, .8, 5, (1, .3, .1)))
    return murmur + norm(bells) * .35

def amb_platform():
    hum = norm(np.sin(2 * np.pi * 100 * t) + .5 * np.sin(2 * np.pi * 200 * t) + bnoise(80, 300))
    return hum * .5 + norm(bnoise(300, 1500)) * .5 + amb_crickets(3) * .3

BEDS = dict(carriage=amb_carriage(), road=amb_crickets() + wind() * .6, river=amb_river(), train=wind() * .7 + amb_crickets(4) * .5 + norm(bnoise(30, 120)) * .5,
            street=amb_street(), platform=amb_platform())
tick("beds")
order = sorted(F, key=F.get); amb = np.zeros(N)
spans = []   # merge consecutive frames in one space into one bed span
for k in order:
    if spans and spans[-1][0] == LOC[k]: continue
    spans.append([LOC[k], F[k]])
for i, (loc, a) in enumerate(spans):
    b = spans[i + 1][1] if i + 1 < len(spans) else DUR + 2
    amb += BEDS[loc] * env(a, b, 2.0, 2.0)
amb *= db(-24)

# ---------- FOL: on-screen business ----------
fol = np.zeros(N)
rustle = lambda d=.5: band(noise(int(d * SR)), 1500, 6000) * np.sin(np.pi * np.arange(int(d * SR)) / (d * SR)) ** 2
last = -99
for a0, b0 in LINES["C"]:   # mirrors direct.js sipAt(): the Traveller sips 1s into a Conductor line longer than 4s, at most every 12s
    g0 = a0 / CALM
    if (b0 - a0) / CALM > 4 and g0 - last > 12:
        s = (g0 + 1) * CALM; place(fol, s, rustle(.4), .6); place(fol, s + .7 * CALM, tone(3200, .25, 30, (1, .5)), .25); place(fol, s + 1.7 * CALM, rustle(.4), .5); place(fol, s + 2.4 * CALM, tone(1800, .2, 40, (1, .7, .3)), .5)   # cup down on the saucer
        last = g0
for a, b in LINES["C"]:   # the Conductor's coat as his hand lifts
    if (b - a) / CALM > 3: place(fol, a + .8 * CALM, rustle(.6), .7); place(fol, b - .9 * CALM, rustle(.5), .5)
fol = norm(fol) * db(-18)

tick("fol")
# ---------- SFX: frame-synced events ----------
sfx = np.zeros(N)
def whistle(d=2.4):
    tt = np.arange(int(d * SR)) / SR; f = 520 + 8 * np.sin(2 * np.pi * 5 * tt)
    ph = 2 * np.cumsum(np.pi * f / SR); body = np.sin(ph) + .6 * np.sin(1.26 * ph) + .3 * np.sin(1.5 * ph)
    return (body + band(noise(len(tt)), 1000, 4000) * .3) * np.minimum(1, tt / .2) * np.minimum(1, (d - tt) / .6)
place(sfx, .3, whistle(), .8)                      # the night train announces itself
place(sfx, F["f13"] + 7.0 * CALM, whistle(3.0), .7)  # and leaves
for k in order:   # station light sweeps through the carriage window (direct.js: per 7.5s, peak at u=.11)
    if LOC[k] != "carriage": continue
    nxt = next((F[j] for j in order if F[j] > F[k]), DUR)
    for n in range(0, 20):
        s = (START[k] + n * 7.5 - 2 + .3) * CALM
        if F[k] < s < nxt: place(sfx, s, band(noise(int(1.4 * SR)), 400, 2500) * np.sin(np.pi * np.arange(int(1.4 * SR)) / (1.4 * SR)) ** 2, .35)
for k in ("f04", "f07", "f10", "f12"):   # crumpled-paper wipe at each act opener
    place(sfx, F[k], band(noise(int(.7 * SR)), 1200, 8000) * (np.abs(np.sin(np.arange(int(.7 * SR)) / SR * 60)) ** 3), .8)
place(sfx, F["f12"] + 1.5, sum(tone(f, 2.5, 1.5) for f in (660, 830)), .4)   # platform bell
sfx = norm(sfx) * db(-12)

tick("sfx")
# ---------- MUS: soft pad + music-box, named beats, ducked under dialogue ----------
CH = [(146.8, 220.0, 293.7, 370.0), (123.5, 185.0, 246.9, 293.7), (98.0, 146.8, 196.0, 246.9), (110.0, 164.8, 220.0, 277.2)]   # D  Bm  G  A
bar = 4.0; pad = np.zeros(N); box = np.zeros(N)
for i, s in enumerate(np.arange(0, DUR, bar)):
    ch = CH[i % 4]; seg = np.arange(int(bar * 1.5 * SR)) / SR
    p = sum(np.sin(2 * np.pi * f * seg + j) + .3 * np.sin(2 * np.pi * f * 2.003 * seg) for j, f in enumerate(ch)) * np.sin(np.pi * seg / (bar * 1.5))
    place(pad, s, p)
    for q, f in enumerate((ch[1] * 2, ch[2] * 2, ch[3] * 2, ch[2] * 2)): place(box, s + q * bar / 4, tone(f, 1.6, 2.5, (1, .2, .05)))
# named beats: M1 in at the first question, swells at act openers, rests on the river, resolves at the stop
shape = .25 * env(4, DUR, 4, 3) + .5 * env(F["f04"] - 1, F["f04"] + 8, 2, 4) + .6 * env(F["f07"] - 1, F["f07"] + 10, 2, 5) \
      + .4 * env(F["f10"] - 1, F["f10"] + 8, 2, 4) + .9 * env(F["f12"], DUR, 3, 3)
mus = (norm(pad) * .7 + norm(box) * .5) * shape
talking = np.zeros(N)
for a, b in LINES["T"] + LINES["C"]: talking[int(a * SR):int(b * SR)] = 1
k = int(.4 * SR); cs = np.concatenate([[0], np.cumsum(talking)]); idx = np.arange(N)
duck = (cs[np.clip(idx + k // 2, 0, N)] - cs[np.clip(idx - k // 2, 0, N)]) / k   # 0.4s ride in and out (running mean)
mus *= db(-10) * (1 - duck) + db(-20) * duck

tick("mus")
# ---------- dialogue at 0, sum, deliver ----------
with wave.open(str(FILM / "assets/voice.wav")) as w:
    v = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(float) / 32768; vsr = w.getframerate()
v = np.interp(np.arange(int(len(v) * SR / vsr)) / SR, np.arange(len(v)) / vsr, v)
vo = np.zeros(N); vo[:len(v)] = v[:N]
vo = vo / (np.sqrt(np.mean(vo[np.abs(vo) > .01] ** 2)) + 1e-12) * .1   # dialogue RMS is the 0 dB reference
beds = rt + amb
L = vo + beds * 1.0 + fol * .9 + sfx * .8 + mus * 1.0
R = vo + beds * .9 + fol * 1.0 + sfx * 1.0 + mus * .9   # a little width on everything but the voice
mix = np.stack([L, R], 1); mix *= .5 / np.max(np.abs(mix))   # peak at -6 dBFS
mix *= np.minimum(1, np.minimum(t / .3, (DUR - t) / 2.0))[:, None]
with wave.open(str(FILM / "assets/mix.wav"), "w") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype(np.int16).tobytes())
print("mix.wav", DUR, "s,", len(spans), "ambience spaces:", [s[0] for s in spans])
