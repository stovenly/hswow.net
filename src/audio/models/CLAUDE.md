# src/audio/models

One file, one sound-producing thing: fire, rain, a crowd, a door, feet. Each
builds a small node graph over `../dsp/` and hands back an object with a `stop`
and a handful of live controls.

Describe what this area is and how its pieces fit **now**. No history, no "we
changed X to Y", no rejected alternatives, no tuning notes. If a fact stops
being true, edit the line — do not append a correction.

## The shape every model has

**A bed carries the level, a population of events carries the identity.** The
bed is continuous and nearly featureless; the events are individually almost
inaudible and are what tells you what the thing is. Getting the balance
backwards is the standing failure — loud, short, broadband events a few hundred
times a second is the sound of crushing bubble wrap, not of leaves or rain.

Fire is the exception, and deliberately so: crackles are *supposed* to resolve.

**Nothing holds one setting.** A source that does not change is a drone, and the
ear files a drone away within seconds. Machines take on load and free up, birds
call in bouts, a windlass is hauled in strokes, wind ebbs most of the way to
nothing. Where a model has a live control it moves spectrum as well as level,
because a parameter that only moves level reads as somebody turning a knob.

## Conventions

Every model reads the same weather field, so a gust moves the whole world at
once. Response is thresholded and steep rather than proportional: a chime is
silent in still air and then hurries.

Gaps are Poisson unless the thing genuinely is periodic. `'oneGap'` resync for
anything individually audible, `'immediate'` for textures.

First-person gestures — footsteps, the door cue — go to the bus, not through a
panner. They have no direction worth rendering and they outlive the position
they were fired from.

`faust/` models keep a native fallback and say which is playing through
`usingFaust`. The fallback is a different thing that happens to sound similar,
and it is described that way rather than as the same model degraded.

## Adding a material to `footsteps.ts`

Five questions, in order. The first two are most of the answer.

1. **How fast does the contact arrive?** `impact.attack`. A millisecond is a
   strike; fifty is a foot decelerating into something that gives.
2. **What band does the contact occupy?** `impact.low` to `impact.tone`.
3. **Does it swell rather than strike?** `crush`, for anything a foot sinks
   into or pushes out of the way.
4. **Is it made of loose pieces?** `grit` — `voices` for size variety, `grain`
   for the dry/wet of one piece, `scuff` for how much answers to speed.
5. **Is it a solid body free to vibrate?** `modes`, and only then.

The impact is the contact, not the sound: on anything soft or loose it should
be barely audible next to the engine carrying the material. Realism is not the
standard, **distinction** is — what must be true is that no two surfaces can be
confused with one another.
