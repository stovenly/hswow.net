# src/audio/dsp

The substrate. Small, model-free pieces that the models in `../models/` are
built out of: a resonator, an excitation, an envelope, a clock. Nothing here
knows what a door or a stream is.

Describe what this area is and how its pieces fit **now**. No history, no "we
changed X to Y", no rejected alternatives, no tuning notes. If a fact stops
being true, edit the line — do not append a correction.

## Files

- `modal.ts` — parallel bandpasses excited together: the material.
- `impact.ts` — `excite`, `crush`, `thump`: the contact, the give, the mass.
- `phisem.ts` — Cook's model of many small things colliding.
- `bubble.ts` — Minnaert bubbles, which is everything water says.
- `formant.ts` — source-filter: a throat and a mouth over a source.
- `grain.ts`, `envelopes.ts` — granular texture and the windows it needs.
- `clock.ts` — scheduling ahead on the audio clock, with `Gap` distributions.
- `ticker.ts` — a worker-thread interval, for pumps that must not miss.

## Conventions

**Everything schedules; nothing plays.** A function takes `at`, an audio-clock
time in the future, and queues automation for it. The frame loop's only job is
to keep the lookahead fed, which is a far weaker requirement than being on time.

Times are **seconds**, frequencies **hertz**, radii **metres**, and anything
called a level, a fraction or a density is **0..1** unless the doc says
otherwise. Defaults are stated on the option, not left to be read out of the
code.

Nodes are self-terminating. A scheduled event owns the sources and gains it
built and lets them fall off the graph; nothing here holds a handle for later.

**Grains, collisions and bubbles are records, not nodes.** A grain bed, a
particle bed and every node bubbles are popped into own one
`particle-processor` (`audio/particles/`), fed ten-float records the worklet
renders into the bed's own filter channels — batched per task on the port, or
through a shared ring when the page is isolated. Every writer keeps the
node-per-event path for a context where the worklet was refused.

Filters, beds and buffers that describe a *material* are built once and kept —
gravel does not acquire new resonances each time it is disturbed. Filters that
describe a *gesture* are built per event.

No `setValueAtTime` at the same instant as the start of a value curve. It is a
spec violation and it throws.

## Adding a piece

It belongs here if two models would otherwise write it, and if it can be
described without naming any object in the world. Take the context and the
target node as arguments; return the duration in seconds if the caller could
need to know when it is over.
