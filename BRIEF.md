---
workflow: general-video
flow: automation
storyboard: yes
message: "Life doesn't speed up as you age; it goes unwatched. A day you notice is a day you keep."
destination: youtube
aspect: 1920x1080
language: en
length: 5m15s
angle: story
---

## Intent

Episode 1 of The Night Train, a full-length animated anthology. A sleepless Traveller and an old Conductor ride a night train; each episode is one life question answered through one picture. This one asks why life speeds up as we get older. Quiet, calm, 2 a.m. tone. The owner's ask: "be creative", not a copy of any reference.

## Assets

- ../audio/ep01-voice-gemini-calm.wav — the locked voice track (Gemini voices, slowed 0.9x, 5:15). Drives all timing.
- ../script.md — director's script: shots, palette, the "detail = attention" rule.
- ../audio/*.words.json — word timings per take (raw speed; divide by 0.9 for the calm track).

## Customizations

- Look "Ink & Signal": hatched ink on warm paper for the real world; thermal / CRT glow on indigo for the feeling worlds; the train window is the doorway between them.
- Visual rule: the number of drawn lines on a thing = how much the Traveller is noticing it.

## Notes

- Reference portfolio (style inspiration only, not to copy): ink-hatched coded animation, a CRT/glitch reveal, thermal-palette apartment windows.
- No Chaos Tab elements: no host to camera, no fast kinetic text.
- Laptop is a slow Celeron N5100 without AVX: keep scenes 2D canvas/SVG, avoid heavy WebGL.
- Free tools only.
