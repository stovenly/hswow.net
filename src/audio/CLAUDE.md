# src/audio

Everything you can hear. All of it synthesised at runtime from noise and
filters — there is not one recorded sample in the project, and there will not
be one.

Describe what this area is and how its pieces fit **now**. No history, no "we
changed X to Y", no rejected alternatives, no tuning notes. If a fact stops
being true, edit the line — do not append a correction.

## The layers

```
zone declares data ─► Soundscape ─► Emitter ─► AudioEngine ─► out
                          │            │
                       models/     panner, absorption, occlusion
                          │
                        dsp/
```

- `AudioEngine.ts` — the graph, the buses, the voice budget, the rooms.
- `Emitter.ts` — one sound in the world, and its three detail levels.
- `Soundscape.ts` — a zone's sound, built from a declarative spec.
- `Scatter.ts` — one-shots at Poisson intervals over a region.
- `weather.ts` — one wind, read by everything, positional.
- `noise.ts`, `reverb.ts` — the shared buffers and the generated IRs.
- `dsp/` — the substrate. `models/` — continuous things. `oneshots/` — brief
  ones. `music/` — the score. `voice/` — the throat. `faust/` — the wasm tier.

## Conventions

**Schedule, never play.** Anything with a `fire` or a `noteOn` takes an
audio-clock time that is already in the future. The frame loop only keeps the
lookahead fed. Nothing rhythmic is driven from `requestAnimationFrame`.

**Content is data.** A zone declares its soundscape as a discriminated union,
so a typo in an option is a compile error rather than a control that silently
does nothing. Nothing in `content/` imports an engine module.

**Built once, silenced often.** A soundscape is not torn down at a doorway.
`setActive(false)` disconnects; only disposing the zone disposes the sound.

**Virtual means disconnected**, not turned down. A silent source still has its
filters and panner processed every quantum.

**The Faust tier is never load-bearing.** Every caller keeps a native path and
says which one is playing. A wasm fetch can fail, and a missing room is worse
than a simpler one.

## Adding a sound

Decide whether it is continuous (`models/`), brief and repeated
(`oneshots/` behind a `Scatter`), or musical (`music/instruments/`). Build it
over `dsp/` rather than over raw nodes. Add a spec variant so a zone can
declare it, and give it a matching art-kit object — a sound with no visible
source cannot be judged in the world.
