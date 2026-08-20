# src/audio/music/instruments

The rack. One file per family, each exporting builders that satisfy the
`Instrument` contract in `voice.ts`. `build.ts` is the only registry — a voice
name is added there and nowhere else.

Describe what this area is and how its pieces fit **now**. No history, no "we
changed X to Y", no rejected alternatives, no tuning notes. If a fact stops
being true, edit the line — do not append a correction.

## The contract

`noteOn(at, freq, velocity, duration?)`. `at` is audio-clock time and is always
in the future; the director's lookahead guarantees it. `velocity` is 0..1 and
means **level and brightness at once**, because that is what more energy does
to a real instrument. `duration` is in seconds and the struck and plucked
families ignore it — they ring for their own time.

Scheduling happens on the TypeScript side, never inside a worklet. A parameter
messaged to Faust lands on a render-quantum boundary, which is inaudible on a
pad swell and ruinous on a beat grid.

**Humanisation is applied inside `noteOn`**, by `human()`. The director writes
clean idealised notes. Putting the jitter here means no instrument can forget
it and no caller can double it.

## The families

- **Blown** — flute, reeds, brass, and the bowed strings. All run on `mono.ts`,
  a pool of players that never stop. Legato is read from timing alone: a note
  starting while a player still sounds glides into it with no new attack.
- **Struck** — `struck.ts`, `bell.ts`, `drums.ts`. Modal: a few sines with
  per-partial decay over a click, told apart by their partial table. Metal is
  constant-Q, so decay scales as 1/f.
- **Plucked** — `pluck.ts`, `guitar.ts`, `banjo.ts`. A Faust waveguide played
  round-robin from a pool, because retuning is a message and would bend the
  tail of whatever is still ringing. Character is downstream of the string.
- **Sustained** — `strings.ts`, `choir.ts`, `hum.ts`, `glass.ts`. Detuned saws
  and a chorus, or a formant bank. The chorus is the section, not an effect.

## Conventions

No periodic vibrato at full depth from the first sample: it builds from nothing
over 0.3-1 s and its rate differs a few percent per note. Short notes get none.

`setTargetAtTime` on both sides of a sustained envelope, so there is no corner
anywhere. A linear attack meeting its peak is a click however slow it is.

A Faust-backed voice keeps a native fallback that plays the same notes at the
same times, and is described as the stand-in it is.

## Adding an instrument

A builder in the right family file, a name in `build.ts`, and a `role` default
so a drone gets the slow front and an upper stratum speaks sooner. One line at
the top of the file saying what the thing is and which one cue makes it read as
that thing rather than as a synthesiser.
