# src/audio/ambience

What a place sounds like when nothing in particular is happening in it. A zone
names a vibe, the director reads that vibe's ambience half, and it decides what
may be heard here, now, given the hour and the weather.

Describe what this area is and how its pieces fit **now**. No history, no "we
changed X to Y", no rejected alternatives, no tuning notes. If a fact stops
being true, edit the line — do not append a correction.

## Files

- `spec.ts` — the book's grammar: bands, windows, and the four strata.
- `vibes.ts` — the book: one `AmbienceSpec` per kind of place.
- `voices.ts` — who can speak, and what each one is built out of.
- `conditions.ts` — what the world is doing, and how wide a window stands open.
- `director.ts` — the rack, the pump, the ring, and the pools.

## The four strata

Schafer's, and they are the ambience equivalent of drone, texture and melody:

- **`air`** — the keynote. No position, no events to resolve, and it never
  stops. Wind, water, a plant's hum, a room's tone.
- **`chorus`** — the middle distance. Continuous and positional.
- **`cast`** — who speaks. Brief, individually audible, and scarce.
- **`signals`** — meant to be listened to. One at a time. A signal with
  `clock: 'hour'` is a **soundmark**, and no two vibes share one.

## Conventions

**The keynote never stops.** The score is a scarcity system and this is its
opposite: a place that falls silent has died. Scarcity lives one stratum up —
signals are rare and soundmarks are rarer than signals.

**Nothing here is an object.** This layer is what a whole place sounds like
from anywhere in it, from every side. A chimney, a hearth, a clock, a windpump,
a beehive and a moored boat are all things you could walk up to and point at,
and every one of them belongs to the zone that placed it — `SoundscapeSpec`,
beside the geometry.

The test is whether you could walk round it. The vegetation of a wood, the
sheet metal a scrapyard is made of, the plant behind a factory wall and the
frame of a house all pass: they are everywhere, they come off every surface
between, and nobody can point at them. A single hedge, a single machine and a
single fire do not.

**Everything here is far**, for the same reason. There is no near and no middle
distance — a source close enough to be either is a source that belongs to a
place. Continuous layers are diffuse and only brief events carry a bearing,
because nobody localises a hum and everybody turns toward a shout.

**Nobody talks.** A voice is a person and a person is somebody you can walk up
to. Speech is the creature system's; what is left here is wordless.

**The world decides what is in the book, not the literature.** Soundscape
writing has a canon — every coast has a foghorn, every room has a clock, every
plant has a tannoy — and filling those rows put a nineteenth-century
compressed-air signal on a shore and a Renaissance escapement in a thatched
house. Both arrived because a table had a gap in it and the reading offered
something to put there. Ask what this place has, then find the model; never the
other way round.

**The band is a fact about the voice**, so it lives in `voices.ts` and not in
the cast. A robin occupies the same niche whichever wood it is in.

**Rhythm is the species.** The tables in `voices.ts` spend nearly all their
detail on time. A song thrush is a bird that says everything three times; get
that right and a plain source carries it.

**Conditions are pushed in, never read.** The clock and the weather live in
`src/world`, and nothing under `src/audio` imports it. `WeatherRig` fills one
struct per frame and hands it over.

**A gate is a weight, not a switch.** `openness` returns 0..1, so the chorus
builds through twilight rather than arriving all at once, and a cast member out
of season costs one comparison and builds nothing.

**Pools are per voice, not per cast member.** Two entries naming the same bird
share one throat. That is where the budget comes from.

## Adding a voice

A name in `AmbienceVoice`, an entry in `VOICES` giving its band and what builds
it, and a line in whichever vibes it belongs to. Prefer a table row over a new
model: most of the cast is `oneshots/call.ts` with different timing.
