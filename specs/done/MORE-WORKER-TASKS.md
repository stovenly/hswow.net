# More work off the main thread — spec

**Built, all six phases.** Each step carries a note where what landed differs
from the sketch under it, and those notes are the authority.

The pool exists and has three tenants. This is the list of everything else that
should be on it, in the order it is worth doing.

**The short version.** Only `prop` entries are warmed, because a prop's builder
call can be read straight off the document. Every other entry kind decides
*what* to build during the walk, so nothing else is warmed — and the kinds that
are not warmed are the ones with the props in them. The fix is to give an entry
kind a way to say what it will build before it builds it, and to teach the warm
pass to ask.

---

## Why

Counted out of `countryside-village.json`, the largest zone document:

| entry kind | builder calls | warmed today |
| --- | --- | --- |
| `prop` | 40 | **yes** |
| `scatter`, 31 entries | 248 | no |
| `vistaRing`, 3 placed and 49 scattered | 52 | no |
| `dressing`, 4 kinds over 20 clumps | about 75 | no |
| `creature` | 6 | no |
| `run`, `wall`, `fence`, `chain` | 14 entries, several pieces each | no |

So the pool serves roughly one call in ten, and the nine it does not serve are
the expensive ones. The vista ring's props are `vista-forest`, `vista-range`
and `vista-copse` — masses, the heaviest builders in the kit. The dressing's
are gorse at 2,200 triangles a clump member. The creatures are figures, which
is `figure.ts` plus seven `figure-*` files of surface, wear, finery and head.

Everything below is behaviour preserving. A warmed geometry and an inline one
are the same geometry: both are a pure function of the same builder call.

## The seam that is missing

`warmProps.scan` walks the document looking for `kind === 'prop'` and reads the
builder, seed, scale and options off the JSON. That works for exactly one kind
and generalises to none of the others, because the rest derive their builder
calls from a seeded sequence, from the terrain, or from both.

They are not all equally hard:

- **`scatter` needs nothing.** `scatterProps` draws angle, radius, yaw, scale
  and seed unconditionally at the top of each iteration, *before* the accept,
  slope, height and avoid tests. So the sequence of `{seed, scale}` for a
  scatter entry is a pure function of the entry's seed and count, and the
  terrain only decides which of them are used.
- **`vistaRing` and `dressing` need the skirt**, which already exists before
  the walk: `zoneFromDocument` constructs the terrain and the skirt at
  definition time, and `warmDocument` is called after that.
- **`run` and `chain` need the built context.** `pointOf` resolves anchors
  against entries built earlier in the walk, and how many pieces a run divides
  into falls out of the resolved length. These do not get a plan and should not
  try.

## Step 1 — an entry kind says what it will build

A kind may declare `asks(entry, ctx): PropAsk[]`, listing the builder calls it
is going to make. `warmProps` walks the kind table instead of matching on
`'prop'`; a kind with no `asks` is warmed for nothing, as every kind but one is
today. The context is a reduced one — `{ terrain, skirt, groundAt }`, the three
things that exist before the walk — and a kind needing more than that declares
no `asks`.

`prop`'s `asks` is the body of `askOf` moved onto the kind, which is where it
belonged.

*Done when* the prop warm runs through the kind table with no change to what is
warmed.

**Built**, and it found a bug: the scan walked `doc.layers`, which is absent on
every document written with `entries` instead — including the village, the one
zone with enough props to be worth warming. So the warm had never run on it.
It walks `layersOf` now, the same expression the build does, and applies the
same `when` tests, so a layer the state has turned off is not warmed.

## Step 2 — scatter

`placement.ts` grows `scatterAsks(rule)`, the draw sequence on its own, and
`scatterProps` calls it rather than drawing inline. That is the point of doing
it this way: the order of the draws is a contract between the warm and the
build, and one function is the only honest way to hold a contract like that —
`seedOf` is already duplicated in `warmProps` for exactly this reason and
should not gain a second sibling.

The warm builds all `count` of them and the walk claims the ones that land.
Everything rejected is disposed by `dropWarm`, which already does that for a
`when` the state turned off. Over-building on a background thread is the trade
and it is the right one, but it is a real cost: the village warms 248 scattered
props to place some smaller number of them.

*Done when* a zone of scatters builds off the pool and is identical to the one
built inline.

**Built** as `scatterCandidates` rather than `scatterAsks` — it returns the
whole candidate, position and yaw included, and `scatterProps` filters the list
instead of drawing inline. The over-warming was accepted; see *To settle*.

## Step 3 — the vista ring and the edge dressing

Both are rejection samplers that place first and build second, and `vistaRing`
is already written that way: the sampling loop touches only `skirt.outside`,
the rng and `builder.radius`, and every `build()` happens afterwards. Split that
placement pass out as `vistaRingPlan(options)` returning the placed props, and
`vistaRing` calls it. `edgeDressing` interleaves its clump members with the rng
and has to be restructured into the same shape.

The warm then runs the plan, warms every prop in it, and the build runs the same
plan again and claims. Running the plan twice costs a few thousand `Math.hypot`
calls and keeps one source of truth for where things stand.

*Done when* the ring and the dressing build off the pool, and the ring's merged
chunks and its `vistaRanges` table are unchanged.

**Built.** One thing the sketch missed: the ring warns when a band places none
of what it was asked for, and the plan now runs twice, so the warning would
have arrived twice. It is reported through a callback the build supplies and
the warm does not.

## Step 4 — rigged creatures

`finishRigged` is a second seam the capture does not know about. Split it the
way `finish` is already split: a pure half that merges the parts against the
bone names and returns a geometry, and a main-thread half that makes the bones,
binds the skeleton and hangs the handle on `userData.rig`. Add a
`rigged-geometry` kind carrying the geometry, the bone specs and the scale.

The capture has to widen slightly. A rigged builder is not a pure walk to a
single `finishRigged` — `figure.ts` and every `quadruped` caller stamp
`userData.life` on the mesh afterwards. `LifeSpec` is plain data throughout
(numbers, strings, and a `{reachIn, reachUp}` record), so the capture can record
what the builder wrote to `userData` and replay it, rather than refusing because
the stub was touched. Anything not structured-cloneable is still a refusal.

Eight builders route through `finishRigged`: `figure`, `poultry`, and
`quadruped` for bovine, ovine, porcine and dog.

*Done when* a zone's villagers and livestock come off the pool, animate as they
did, and `LifeActivity` finds the same rig and the same spec.

**Built**, and the widening went further than rigs: the capture no longer
refuses any builder for stamping `userData`, rigged or not. `plainData` decides
— numbers, strings, booleans, arrays and object literals pass, anything with a
prototype refuses — so the guard can only ever refuse a capture, never corrupt
one. That also picked up whichever plain-mesh builders stamp metrics on
themselves.

## Step 5 — the palette thumbnails

`Thumbnails` draws one builder per frame because each frame builds a mesh *and*
stalls on `readRenderTargetPixels`. With the geometry already made, the
per-frame cost is only the render and the readback, and the rate can go up. 192
builders at one a frame is about three seconds of a palette filling in.

No new job kind: `prop-geometry` with `{ builder, seed: 1 }` is exactly what a
thumbnail asks for. Warm the queue ahead of the draw.

*Done when* opening a palette tab fills it in visibly fewer frames.

**Built.** Four a frame instead of one, and the drain takes the first entry the
pool has answered for rather than the first in the queue — waiting on the head
would have put the build straight back on the frame. The palette fills a little
out of order as a result.

## Step 6 — the warm must not become the new stall

Two things in the pool are sized for three tenants and not for four hundred
jobs:

- **`warmDocument` awaits every job before the walk starts.** With the steps
  above that is four hundred awaits gated on the slowest one. It should take a
  deadline: whatever has not come back is a miss and builds inline, which is the
  ordinary path and produces the same zone. Timing changes; the result cannot.
- **The queue is FIFO with no priority.** A zone crossing's `collision-index`
  warm queues behind however many prop jobs the next zone's prewarm has already
  put in front of it. A crossing is the one piece of work with a deadline the
  player can see, and it should be able to jump.

*Done when* a zone with four hundred props starts building on a fixed budget
rather than on the pool's slowest job, and a crossing's index is not stuck
behind a prewarm.

**Built**, and landed second rather than last: the deadline and the jump are
what keep every phase after them bounded, so they wanted to be in place before
the flood rather than after it. The budget is 2.5 seconds and the jump is
`urgent` on a `pool.run`, which only `Collider.warmAsync` passes, and only when
a crossing is waiting on it.

## Looked at and left alone

- **The terrain and skirt meshes.** `Terrain.build()` is a per-vertex
  `heightAt` over the field, and pure. At the village's 114 m over a 3 m
  resolution that is 38 by 38 base cells, which is not where the time goes. It
  becomes worth moving if a level is authored large or finely, and the editor's
  live sculpt path would have to keep the inline build anyway — a stroke has to
  be visible while the mouse is still down.
- **The voice writer.** `write(score, me, at)` is pure and returns
  `Float32Array`s, which is the exact shape of a job. It is also a few hundred
  keyframes for a sentence. The postMessage would cost more than the work.
- **Reverb and the noise buffers.** `OfflineAudioContext` and
  `AudioContext.createBuffer` are main-thread APIs; there is no Web Audio in a
  worker.
- **The ramp LUT, the noise texture and the gust field.** 512 by 30, 64 by 64,
  and a strip. All one-off and all trivial.
- **`Collider.carve`.** It walks the scene graph, so it stays where the scene
  graph is. This was settled in the workers spec and has not changed.
- **Shader compilation and buffer upload.** Main thread by definition.

## What this is not

- Not a change to what any builder produces. Every step is behaviour preserving;
  if a picture changes, the step is wrong.
- Not an async document walk. The walk stays synchronous and a miss stays free;
  that is what makes each of these steps landable on its own.
- Not a plan for `run` and `chain`. They need the built context and they are
  fourteen entries.
- Not the adaptive pool sizing deferred from the workers spec. That is still
  step 6 there and is independent of all of this.

## To settle before building

1. **Over-warming.** *Accepted.* The warm builds every scattered prop a
   document asks for and `dropWarm` frees the rejected ones. Passing the
   terrain in would have made the warm a second copy of the scatter loop
   instead of a shared one, and the waste is on a background thread.
2. **Order.** *Step 6 moved to second.* The deadline and the queue jump are the
   safety valve for everything after them.
3. **How far.** All six.

Still open, and not a decision anybody can make from the code: whether any of
this is faster. Nothing here has been timed, and the render is the only place
that can say.
