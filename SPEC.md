# Here Stands What Once Was — specification

A first-person browser game served from GitHub Pages. three.js, TypeScript, Vite. No art
or audio assets: every mesh and every sound is generated in code.

This document is the source of truth for the build. It is written to be read cold, without
prior conversation context. Update it as decisions change.

---

## Status

| Phase | State |
|---|---|
| 0 — Harness | **Complete** |
| 1 — First-person controller | **Built, awaiting your verdict on feel** |
| 2 — Render pipeline and filters | **Built, not yet seen on a screen** |
| 3 — Procedural audio engine | **Complete** |
| 4 — Procedural art kit | **Complete** |
| 5 — Zones and portals | **Complete** (trigger volumes and prop streaming deferred) |
| 6 — Procedural audio: the sound of places | **In progress** — library and zone soundscapes built; friction and the sound stage remain |
| 6b — Galleries, and objects for the sounds | Planned, to be done before 6 closes |
| 7 — Actors, animation, wind sway | Not started |
| 8 — Keyword dialogue, quests, narrative | Not started |
| 9 — Autosave, touch controls, performance | Not started |
| 10 — Content authoring | Not started |
| 11 — World editor *(cuttable)* | **Deferred** — revisit when hand-editing hurts for a reason a builder cannot fix |

---

## Locked decisions

| | |
|---|---|
| **Title** | Here Stands What Once Was (`hswow.net` — the initials are unchanged) |
| **Camera** | First person, modern FPS — pointer lock, WASD, shift sprint, Escape releases |
| **Art** | Procedural code-only meshes; glTF loader wired but unused |
| **World** | Bounded, hand-authored exterior ringed by natural barriers. No noise terrain, no infinite streaming |
| **Audio** | Fully procedural, 3D positional, per-zone acoustics |
| **Dialogue** | Morrowind/FF2 keyword system — static greetings, learned topic pool |
| **Saves** | Autosave only. No save UI, no reset, no manual load |
| **Shell** | No title screen, no pause menu, no intertitles. Boots straight into the world |
| **Combat** | Out. There is no danger in this world |
| **Accessibility** | Not a goal. The game is meant to be obscure |
| **Stack** | three.js + TypeScript + Vite → `docs/` |

### Working agreements

- Plan and get sign-off before implementing anything multi-file.
- Nothing is committed, pushed, or deployed without explicit confirmation.
- Naming and fiction belong to the repo owner. Do not invent premise or title.

---

## The audio system

Audio is a headline system, not dressing. Ambience and immersion carry the game even
though it is visually simple.

### Why not per-sample synthesis

An `AudioWorklet` generating noise per sample per emitter does not scale past a handful of
voices. Instead **pre-render noise once** — white, pink, brown, a few seconds each — into
`AudioBuffer`s at boot, then loop them from `AudioBufferSourceNode`s with randomized start
offsets and slight `playbackRate` variation so voices decorrelate. Character comes from
cheap, hardware-accelerated `BiquadFilterNode`s and `GainNode`s. Worklets are reserved for
models that genuinely need per-sample state.

### Four tiers

Phase 6 gave the library a shape. Tier 0 is the substrate that existed from Phase 3 — noise
buffers, the gust field, the material tables. Tier 1 is `audio/dsp/`: primitives extracted
from models that had already proved them, and the answer to the fact that Poisson
scheduling had been written three times and modal resonance twice, disagreeing with itself
both times. Tier 2 is the model library, native Web Audio node graphs. Tier 3 is
`audio/faust/` — precompiled `.wasm` worklets.

**Nothing in tier 3 is load-bearing.** Every Faust model has a native fallback or is
optional dressing, so a wasm that does not load degrades the soundscape rather than
breaking the game. It is used for the two things node graphs genuinely cannot do: a
feedback delay network whose decay is a live parameter, and a per-sample friction loop.

### Synthesis models

Each is a factory returning `{ output, update(dt), setActive(), dispose() }`, so any model
can drive any emitter.

**Wind** — three layered bands off the noise buffers:

| Layer | Source | Filter |
|---|---|---|
| Low rumble | brown noise | lowpass ~200 Hz |
| Mid whoosh | pink noise | bandpass 400–900 Hz, Q ≈ 2 |
| High whistle | white noise | bandpass 1.5–4 kHz, Q ≈ 8–20 |

A **gust generator** — smooth 1-D value noise, *not* an LFO, because an LFO reads as
periodic within about thirty seconds — drives all three band gains plus the whistle's
center frequency and Q. Center frequency rises with wind speed. Wind speed and direction
are **global world parameters** so everything downstream stays coherent.

**Foliage** — granular synthesis, the standard technique for wind-in-trees: one grain ≈ one
leaf or branch rustle. A grain is a 5–40 ms noise burst through a 2–8 kHz bandpass with
fast attack and short exponential decay. Grain rate and amplitude are driven by **the same
gust signal as the wind model**, so trees rustle when the wind actually gusts rather than
idling independently. Grains are scheduled against `AudioContext.currentTime` with a
lookahead window — the "two clocks" pattern — not on the render loop, so timing survives
frame hitches.

**Machinery** — fundamental plus a detuned harmonic stack through a lowpass, amplitude
modulated at the rotation rate, with filtered-noise bearing hiss and a per-revolution
impulse through a resonant bandpass for the clank. Rotation rate is a parameter, so
machines can spin up, labor and stall.

**Footsteps** — noise burst shaped by a material-specific resonant filter and envelope,
randomized per step, material read from the surface underfoot. Driven by head-bob phase so
steps land with the camera.

**Friction** — stick-slip, and the only genuine per-sample case in the library. The
friction force depends on the relative velocity, the relative velocity depends on how the
body is already moving, and the body moves because of the force: a loop that has to close
every sample. The shortest loop a node graph can express is one render quantum, 2.7 ms,
which is longer than a whole slip cycle. Everything else follows from one fact — kinetic
friction is lower than static and *falls* as speed rises — so the sliding speed is not a
volume control but a walk across that curve, and groan, squeal and rub fall out of the
physics rather than being three sounds crossfaded. Ropes, axles, hinges, chains, a tree
under load. A native fallback schedules slip events into a modal bank; it creaks and rubs
but cannot reach the sung tone at the top of the range, which is the boundary the loop
exists to cross.

**Waveguide** — a delay line that feeds itself: chimes, hanging wire, struck tubes, singing
bowls, and air through pipework or an arrow slit. The second thing node graphs cannot do,
and for a blunter reason than friction. A `DelayNode` in a Web Audio feedback loop is
clamped by the spec to at least one render quantum — 128 samples, 2.67 ms — which resonates
at 375 Hz, and that is the *ceiling*, because the delay cannot be made shorter. Every pitch
above middle F# is unavailable by construction. The delay here is also fractional, which
matters more than it sounds: at 2 kHz a whole-sample step is nearly a semitone, so a rank
of chimes tuned in integers would be audibly sour.

One sign controls whether the wave reflects in phase or inverted, which is the difference
between all harmonics and odd ones an octave down — a flute and a clarinet, a struck wire
and a stopped pipe, for one multiply. **It takes an audio input and makes no sound of its
own**: the excitation is scheduled from TypeScript with `dsp/impact` and `dsp/clock`, so
strikes stay sample-accurate. That split is the pattern for every module after this one —
Faust does the part node graphs cannot, and the substrate does everything else.

**Also built:** water, fire, rain, crowd, bird as continuous models; hammer, clatter,
animal, drip and bell as one-shots fired by scatter fields.

### Spatialization

Every emitter owns a `PannerNode` with an inverse distance model and per-emitter
`refDistance` / `maxDistance` / `rolloffFactor`. Web Audio is y-up, same as three.js, so
positions map directly.

**HRTF is the most expensive node in the API**, and it is also the one that makes a sound
seem to be outside your head. The way to afford both is to pay for it only where it is
audible, so the engine hands out three levels by rank: the nearest handful get `hrtf`, the
rest get `equalpower`, and past `maxDistance` they go **virtual** — disconnected, not
turned down, because a silent source still has every node processed each quantum. Swapping
between the first two happens under a brief gain dip, because HRTF carries a delay that
equal-power does not.

On top of the panner:

- **Air absorption** — a lowpass whose cutoff falls with distance. High frequencies are
  absorbed more by air; this is what makes far-off sounds read as far off rather than
  merely quiet.
- **Occlusion** — raycast listener→emitter every N frames, then blend gain and a lowpass
  toward occluded values using `setTargetAtTime` to avoid zipper noise. A machine behind a
  wall should thud, not vanish.
- **Directionality** — `coneInnerAngle` / `coneOuterAngle` / `coneOuterGain` for emitters
  that face a direction.

**And three switches that turn physics off.** `ignoreAbsorption`, `ignoreOcclusion` and
`invertDistance`. The way to signal that something is not an ordinary object making an
ordinary noise is to have it disobey the rules every other sound visibly obeys: a voice
that does not dull with distance, or that walls do not muffle, is placed by the ear as
"not here" long before the player could say why. Used sparingly they are uncanny; used
often they are a mix with no depth in it.

### Per-zone acoustics

Each zone declares RT60, pre-delay, damping and wetness. Two implementations, and exactly
one is audible.

**A feedback delay network**, compiled from `reverb.dsp` — Fons Adriaensen's `zita_rev1`,
with separate decay times either side of a crossover because a stone room's bass rings far
longer than its treble and a single RT60 cannot say so. The point of it is that changing a
room changes *parameters*: the tail already ringing carries on and starts dying at the new
rate, so walking out of a hall is the room changing size rather than a crossfade between
two of them. It is also what makes a cave tunable with no cave to stand in.

**The fallback** is the original design and still ships: impulse responses generated at
boot in an `OfflineAudioContext` — noise shaped by an exponential decay, filtered for
damping, decorrelated per channel — into two `ConvolverNode`s crossfaded past each other,
because swapping a convolver's buffer cuts its tail dead. Built only if the wasm did not
arrive; a `ConvolverNode` keeps convolving into a muted gain, and three of them running
behind a fader for nothing was the first version's mistake.

### Zone soundscapes

A zone declares what it sounds like as data, the same way it declares its fog:

- `bed` — non-positional models. The air you are standing in. Wind is not *somewhere*, so
  spatialising it is not merely wasteful but wrong.
- `emitters` — models at world positions.
- `scatter` — one-shots fired at random points in a region at Poisson intervals. Continuous
  sources establish that a place exists; scattered ones establish that somebody lives in it,
  and that single primitive did more for ambience than any three synthesis models.

Built on entry and **silenced, never torn down**, on exit. Zones are revisited constantly,
granular models are not free to construct, and a gap where the wind should be is more
noticeable than a few dozen dormant filters. Same reasoning as "never dispose materials per
zone", in the other direction.

**Placement runs object → sound, never the reverse.** Every emitter in the game has
something visible standing at its position, and the coordinates come from the object.

### Graph and voice management

```
model → panner → ├→ dry ───────────────────────┐
                 └→ reverbSend → zoneConvolver ─┤
                                                ├→ master → compressor → destination
                                 dialogue duck ─┘
```

Panners come from a pool. Emitters past `maxDistance` release their nodes and go *virtual*
— still simulated, not audible. A cap on concurrent voices sheds by priority
`f(distance, importance)`. The context resumes on the first pointer-lock click, which
doubles as the autoplay-policy gesture, and suspends on `visibilitychange`.

### Audio tooling

**The sound stage** — a room with one of everything in it, standing in a line on pedestals.
Every station is identically configured, so the only difference between two of them is the
model, which is what makes it a comparison rather than a demonstration. A rank and not a
circle: half of what these models do is change with distance, and none of that is audible
from a fixed radius. Reachable only from the zone jump list under `?debug`, because
fifteen sources at once is a workbench and not a place.

Alongside it in the panel: solo per emitter, a spectrum and level meter on the master bus,
and **a generated control panel for every Faust module**. The meter earns its place on the
narrowest ground — audio has no visible output at all, so a silent model and a muted bus
are indistinguishable until something draws one of them.

The generated panels are read, not written. Each `.dsp` already declares every control's
range, step and default, and `tools/faust-build.ts` carries all three through to the
runtime, so a folder builds itself from the module and is correct for a module nobody has
written yet. This was worth doing on evidence rather than on principle: `friction` shipped
with seven controls and no panel, and was tuned by instantiating the compiled wasm in Node
and printing octave-band tables — which found two structural faults and is an absurd way to
answer "is this a little too bright." Hand-writing sliders is the alternative, and it means
the bounds are typed twice and agree until someone widens one.

There was an `AudioEngine.tuneRoom(rt60, damping, preDelay)` behind three hand-written
reverb sliders. The generated panel covers strictly more — separate low and mid decay, and
the crossover between them, which is most of what makes stone sound like stone — so the
wrapper was deleted rather than left as a narrower duplicate.

**The audition harness** renders the whole library through an `OfflineAudioContext` and
measures it. This does not replace listening; it replaces the *other* listening test, the
one where you walk the rack after every change hoping to notice by ear that something is
now three decibels louder than last week. Nobody notices that, and everybody notices the
mix it eventually ruins.

Two kinds of check. **Rules** are absolute and need no history: clipping, DC offset, a
scheduler that has quietly become a loop, and a crest factor outside what its kind of
source should have. **Baselines** are recorded measurements of a specific model and catch
drift — a change to a shared primitive that moves six models nobody was thinking about.
That is the case for a row per model, and it is a strong one: `impact` has nine consumers,
`clock` seven, `modal` five.

> **The first cut of the rules was miscalibrated, and the first real run proved it.** Six
> of fifteen rows flagged on a library that was fine. Both errors were the same mistake —
> rules written for textures and applied to everything.
>
> **Crest factor means opposite things for the two kinds of source.** A continuous texture
> with a high crest has come apart into audible grains; an impulsive one with a high crest
> is doing its job. Judged by one band, the drip (30 dB), the hammer, the clatter and the
> chime all failed for being correctly transient. There are two bands now, and a subject
> declares which it is by what its *output* looks like rather than by what built it — the
> bird is a continuous model judged as events, because that is what discrete calls with
> silence between them are.
>
> **And loudness cannot be compared across the library.** The plan asked for every model
> within 3 units of every other, on the reasoning that one model four times louder than its
> neighbours is the commonest way a procedural library sounds bad. The reasoning is right
> and the measurement does not test it: models render at their *defaults*, and a zone spec
> sets `gain`, `refDistance` and `maxDistance`, so the mixing happens at placement. The real
> spread is 23 — a wind bed at −47 against an engine at −27 — and both are correct, because
> one is the air you are standing in and the other is a thing you walk toward. The number is
> reported and asserted on never; per-model loudness *drift* is the check that survived, and
> it was always the one doing the work.
>
> The band energies went the same way for a different reason: eight per model is 120
> tripwires that mostly restate the centroid, and every honest re-tuning trips several. They
> are recorded and printed, because reading them is what caught the friction model coming
> out spectrally flat — a diagnostic, not a gate. A check that cries wolf trains you to stop
> reading it, and then it cannot catch the one that mattered.

Rendering a scheduled model offline needs `OfflineAudioContext.suspend`, and that is the
whole trick: `startRendering()` is one call, so a naive render pumps the scheduler once and
returns a lookahead window of sound followed by silence. Suspending at fixed intervals and
pumping at each is the offline equivalent of a frame — and better than one, because the
steps are exact, so a texture rendered twice is identical where the same model on
`requestAnimationFrame` never is.

---

## The dialogue system

Keyword-driven, after Morrowind and Final Fantasy II. Progression is knowing *what* to ask
and *who* to ask it of. Inventory stays and plugs into the same frame.

### Shape

- **Greeting** — one static line per NPC, shown every time, never changes.
- **Topic pool** — a single global set of keywords the player has learned. Learning is permanent.
- **Asking** — pick a known topic; the NPC answers from their own topic table, or rebuffs.
- **Learning** — responses carry inline markup:
  `He keeps the [[ledger of departures]] and will not be asked about it.`
  The parser renders the keyword highlighted and adds it to the pool when the line is read.
  Writing dialogue and designing progression therefore become the same act.
- **Showing items** — an item can be presented as a conversational move, keyed the same way
  as topics, so fetch quests resolve inside conversation rather than through a separate
  hand-in verb.

### Data model

```ts
interface NPC {
  id: string
  greeting: string                        // static, always shown
  rebuffs: string[]                       // flavored "I know nothing of that"
  topics: Record<TopicId, Response[]>     // first response whose condition passes wins
  itemResponses?: Record<ItemId, Response[]>
}

interface Response {
  when?: Condition      // quest stage, flag, item held, topic already asked
  text: string          // may contain [[keyword]] markup
  actions?: Action[]    // give/take item, set flag, advance quest, teach topic
}
```

Runtime state: known topics, asked topics per NPC (so the UI can mark what's new), and the
flags and quest stages conditions read. All autosaved.

UI is two panes — response text on one side, scrollable topic list on the other — plus an
affordance to present an item from inventory.

### Topic list visibility

Morrowind only lists topics an NPC has an entry for. That is kinder, but the list then
tells you who knows what, undercutting "learning who to ask."

**Decision: list every known topic for every NPC**, with unmatched ones drawing a rebuff
written per character rather than a generic line. Asking the wrong person costs a little
time and tells you something about them. Topics already asked of that NPC dim so you aren't
rereading. Reversible in one line if it plays tedious.

### Beyond flat topics

Mostly flat, like Morrowind — but a response can raise a short inline choice when a moment
needs a real decision. Those are the exception, not the structure.

---

## Feature list

Checked items are decided. Unchecked are open.

### Movement
- [x] Pointer lock, mouse look, sensitivity, invert-Y; Escape releases
- [x] WASD, shift sprint, gravity, jump, slope limit, step-up
- [x] Head bob tied to speed, driving footstep timing
- [x] Sprint FOV kick
- [x] Crouch — the capsule shrinks, with a headroom test before standing up
- [ ] ~~Holding an edge while crouched~~ — **built and cut.** Stopping at a drop
      and leaning out over it worked in the checks and felt buggy to play
- [ ] Stamina limiting sprint — **open**

### Rendering
- [x] Low-poly flat-shaded, vertex colors, no textures
- [x] Pixelation via `RenderPixelatedPass` (depth/normal edge outlines included)
- [x] Clustered-dot halftone dithering, cell size tunable
- [x] Per-channel level quantization, dithered in linear light
- [ ] Dither density driven by surface normal — the texture substitute — **open**
- [ ] ~~Fixed-palette quantization~~ — **cut.** Colour comes from the art, not the renderer
- [x] Per-zone fog and vignette
- [x] Live tuning panel for all of it
- [ ] Scanlines / CRT curvature — **open**
- [ ] Per-zone color grading LUT — **open**

### World
- [x] Bounded authored exterior; hills, cliffs and walls as natural barriers
- [x] Authored heightfield terrain, sculpted not generated
- [x] Ground cover: paths, fields, cobble — colour and footstep sound in one table
- [ ] Proximity-based prop load/unload within the bounded zone — *moved to Phase 9*
- [x] Interiors as their own zones, hand-built, sealed
- [x] Clickable door portals with fade transition and reverb crossfade
- [x] Per-zone config: light, fog, ambience, acoustics, floor material
- [ ] Fixed hour vs day/night — **open** (recommendation: fix at one hour)
- [ ] Weather particles — **open**

### Audio
- [x] Everything in the audio section above
- [x] Water, fire, bird models — *built in Phase 6, with rain, crowd and scatter one-shots*
- [x] Zone-declared soundscapes; panner LOD and voice cap; FDN room acoustics
- [ ] Friction family (stick-slip, needs Faust) — Phase 6
- [ ] Sound stage and the rendering half of the audition harness — Phase 6

### Actors and animation
- [x] Procedural jointed figures from primitives
- [x] Walk cycle, idle sway, head look-at
- [x] Door and mechanism tweens

### Interaction and narrative
- [x] Center-screen raycast, crosshair, verb prompt
- [x] Keyword dialogue: static greeting, global topic pool, per-NPC tables, flavored rebuffs
- [x] `[[keyword]]` markup that highlights and teaches topics as lines are read
- [x] Presenting an item as a conversational move
- [x] Response conditions on quest stage, flags, items held, topics already asked
- [x] Dialogue actions: give/take, set flag, advance quest, teach topic
- [x] Quests with stages, resolving through conversation
- [x] Inventory as a list
- [x] Journal, with a keyword index recording where each topic was learned
- [x] Readable notes and letters found in the world — these teach keywords too
- [ ] Occasional inline choice prompts — **open** (recommendation: keep, used sparingly)
- [ ] Scrollable dialogue history — **open**
- [ ] Unreliable in-fiction map — **open**

### Meta
- [x] Autosave to localStorage — position, rotation, zone, quests, inventory, flags, read
      notes, known and asked topics
- [x] Restores silently on load; no save UI, no reset
- [x] Touch controls — **moved to Phase 1**, see deviations
- [ ] Minimal settings overlay on a key (sensitivity, FOV, filter toggle) — **open**
- ~~Title screen, pause menu, intertitles, accessibility pass~~ — cut

---

## Phases

Each phase ends runnable and tunable. The **Proving Ground** is a permanent debug level
that accumulates test fixtures.

### Phase 0 — Harness ✅

Vite/TS/three scaffold, `docs/` output, `.nojekyll`, Pages config. Proving Ground v0: grid
floor, 1.8 m reference pole, measured cubes, distance markers, stats overlay, tuning panel
shell. Camera is temporary OrbitControls.

### Phase 1 — First-person controller ✅ built

Pointer lock, look, WASD, sprint, gravity, jump, slope/step handling, head bob. Collision
against indexed triangles — no physics engine (see deviations). **Touch controls ship here**
(see deviations). Proving Ground gains a movement gym: ramps at 10/20/30/45°, two stair
pitches, kerbs bracketing the step height, calibrated jump gaps, a strafe wall with a
corner, and a high walkway to fall off.

Shipped:

- `engine/Input` — keyboard, pointer lock (with `unadjustedMovement` where available),
  and touch, all writing into one state the controller reads. Jump is buffered; keys clear
  on blur.
- `player/Collider` — three's `Octree` for broad phase, our own capsule–triangle narrow
  phase. Only meshes on the collision layer are indexed.
- `player/Controller` — capsule, Quake-shaped acceleration, fixed 1/120 s sub-steps,
  ground-plane steering, ledge climbing, ground snapping, coyote time, head bob, sprint
  FOV, landing dip. Exposes `onFootstep` and `onLand` for Phase 3.
- `ui/TouchControls` — dynamic left-half stick, right-half look drag, jump pad.
- `tools/movement-check.ts` — headless assertions, `npm run check:movement`.

**Not built, still open:** crouch and sprint stamina were left undecided in the feature
list and are not in. Both are small additions to `Controller` if wanted.

*Done when the movement feels right. Expect iteration — everything else is experienced
through it. Every constant is a slider under `?debug`.*

### Phase 2 — Render pipeline ✅ built

Composer stack, all parameters live-tunable with saveable presets. Proving Ground gains a
calibration board: colour chart, three gradient ramps, a smooth-shaded sphere and a raked
lit plane for judging banding.

The chain, and the order matters:

```
scene ─► RenderPixelatedPass ─► OutputPass ─► RetroShader ─► screen
         chunky pixels,          tone map     vignette,
         depth/normal edges      and sRGB     dither, quantize
```

`OutputPass` is where linear light becomes sRGB. Spacing quantization steps evenly is only
correct on the display side of that conversion — in linear light every level would bunch
into the shadows — so the pass runs last. The dither *within* a step is the opposite case
and is resolved in linear light; see below.

**The colour is the scene's.** There is no palette in the renderer and there is not going
to be one. Every surface is flat-shaded vertex colour out of `art/palette.ts`, lit, fogged
and tone-mapped; that is the colour set, it is continuous, and it changes when the art
changes. The pass quantizes what it is handed. Nothing here decides what the game is
allowed to look like.

**The dither is the texture.** With no textures anywhere in this game the quantizer is the
entire surface treatment, which is why the pattern list is long: a hatch across a flat
face is the cheapest thing that reads as a material rather than as fill.

Shipped:

- `engine/RetroShader` — a clustered-dot halftone screen, per-channel level quantization,
  and vignette. The dot cell is measured in chunky pixels, not screen pixels: every device
  pixel inside a block carries the same colour, so a threshold that varied within the block
  would dither *inside* it and dissolve the pixelation.
- `engine/PostFX` — owns the composer, the settings, and their persistence. Pixel size is
  authored in CSS pixels and applied in device pixels, so a look dialled in on a desktop
  reads the same on a phone at DPR 3.
- `debug/presets` — localStorage, best-effort, separate from Phase 9's autosave.
- Tuning panel folders: look, vignette, fog, preset (save / reset / copy JSON).

**The dither is resolved in linear light, and this was wrong for a long time.** The old
form added a threshold to the colour and rounded, in display-referred sRGB. But the eye
and the display average two adjacent chunky pixels in *linear* light, so a half-and-half
dither between two levels does not read as their midpoint — at five levels, the middle of
the first band came out **41% too bright** (0.125 in, 0.177 perceived). The fix is to stop
nudging and rounding: find the two levels the colour falls between, solve for the
proportion of the brighter one whose linear average *is* the colour asked for, and compare
that proportion against the threshold. Mean reproduction error over the range falls from
0.0174 to 0.0013 and the worst case from 0.064 to 0.020.

`ditherScale` is how much of one step the dither spreads across. At 1 every tone between
two levels is reproduced exactly; the shipped 1.65 is deliberately over that, so the
transition never fully resolves to flat colour and the dots stay visible as a texture
rather than appearing only at band boundaries.

**Bayer, blue noise, gradient noise and the line and crosshatch screens were all built and
all removed** once the halftone was chosen, along with the per-channel decorrelation knob
and `engine/blueNoise.ts`. Six selectable patterns is six ways to second-guess a decision
that has been made. They are in the history.

*Done when a look can be dialed in and persists.*

### Phase 3 — Audio engine ✅ built

The whole system above: noise substrate, wind/foliage/machinery/footstep models, panners,
air absorption, occlusion, generated IRs, buses, tooling. Proving Ground gains an emitter
garden and two rooms with very different RT60 joined by a doorway.

Shipped:

- `audio/noise` — white, pink and brown rendered once at boot, looped with random offsets
  and slight rate detune so voices decorrelate. Loop points cross-faded.
- `audio/weather` — one global gust field driving everything. Layered value noise with a
  contrast expansion (see below), an integer hash rather than the usual `fract(sin())`.
- `audio/reverb` — impulse responses generated in an `OfflineAudioContext`: decaying noise,
  damped, decorrelated per channel. Three presets: `open`, `cell`, `hall`.
- `audio/AudioEngine` — buses, listener tracking, room crossfade between two convolvers,
  limiter, autoplay-gesture handling, suspend on tab hide.
- `audio/Emitter` — panner, distance-driven air absorption, raycast occlusion, going
  virtual past `maxDistance`.
- Models: `wind` (three bands + gust-driven whistle), `foliage` (granular, Poisson grains),
  `machine` (harmonic stack, AM, bearing hiss, per-revolution clank), `bird` (Poisson calls,
  falls silent in strong wind), `footsteps` (material-filtered, driven by head-bob phase).
- Objects to hang them on: a tree, two bushes, a perched bird, a machine with a turning
  flywheel, and the two rooms.
- `tools/audio-check.ts` — `npm run check:audio`.

**Birds are in**, answering one of the open questions. Water and fire are still not built.

**Not built from the spec:** the spectrum analyser, emitter solo/mute, panner pooling and
the voice cap. Pooling and voice-capping are premature at five emitters and would be
guesswork without a real scene to profile; they belong with Phase 9's performance pass. The
dialogue duck bus exists in the graph but does nothing until Phase 8.

**Not verified by ear.** Everything typechecks and the pure-maths parts are asserted, but
nobody has listened to it.

*Done when walking between those two rooms sounds obviously different, and a machine behind
a wall is audibly occluded.*

### Phase 4 — Art kit ✅ built

`src/art/` mesh builders: figures, trees, rocks, terrain features, buildings, fittings.
Proving Ground gains a gallery row that auto-instantiates every builder.

Shipped, nineteen builders: `barrel`, `bovine`, `bush`, `cairn`, `crate`, `equine`,
`fence`, `figure`, `grass`, `hut`, `mushroom`, `ovine`, `porcine`, `post`, `poultry`,
`rock`, `stump`, `tree`, `trough`. Twenty to four hundred and forty triangles each.

The four hoofed animals share one body plan in `art/quadruped.ts` — a cow, a pig, a sheep
and a horse are the same parts at different proportions, and proportion is nearly all of
what tells them apart at a glance. Poultry is separate: a chicken is not a small
quadruped, its legs come out of the middle of the body rather than the corners.

- `art/types` — a builder is a name, a radius, and `build({ seed, scale })`.
- `art/random` — seeded RNG. **`Math.random` is banned inside builders**: a prop is stored
  in world data as a name and a seed and rebuilt from those on load, so a builder that is
  not reproducible would let the world rearrange itself between sessions.
- `art/assemble` — vertex colours and sway weights baked per part, then merged into one
  geometry sharing one material. One draw call per prop, and exactly one material for
  Phase 7's wind shader to patch.
- `art/palette` — colours named by material, not by hue. Placeholder art direction.
- `art/registry` — `import.meta.glob` over `builders/`, so a new file appears in the
  gallery without anything else being edited. **Vite-only**; nothing reachable from
  `tools/` may import it, which is why the proving ground imports builders directly.
- `art/masonry` — a face of rubble, and the pieces built out of it: the wall, its pier and
  the archway. Stones are **scattered, not split** — a cell is the patch of face nearer its
  own stone than any other, so no joint runs further than the two stones sharing it. What
  makes a run tile is that the sideways warp fades to a shared `seam(y)` at each end, which
  two independently-built pieces both compute identically.
- `art/blob` — welded, vertex-displaced spheres. Shared by rock, cairn and the sheep's
  fleece, along with the non-obvious precondition: normals and UVs must be deleted before
  `mergeVertices`, or nothing welds and the weld silently does nothing.
- `MeshBuilder.solid` — grass, mushrooms and poultry are walked through. Blocking on a tuft
  of grass is the fastest way to make a world feel like a floor with boxes on it.
- `debug/Gallery` — four seeds per builder, spaced by each builder's own radius.
- `tools/art-check.ts` — `npm run check:art`.

The proving ground's tree and bushes are now built by the kit rather than by hand. The
audio anchors did not move: a sound belongs to a place, not to whichever mesh is standing
there.

**Builders must author sway weights.** Every mesh that will move in the wind carries a
per-vertex weight — 0 at the roots, 1 at the tips — baked into a vertex attribute at build
time. Phase 7's sway shader reads it and nothing else; without it, a trunk swings from its
middle and a leaf cluster shears off its branch. This is cheap to do while the geometry is
being generated and effectively impossible to add afterwards, which is why it belongs here
rather than there.

**Builders must author collision.** A prop's collidable geometry should resemble only the
part of it that can actually be collided with or stepped on — the branches and trunk of a
tree, not its leaves; a door's leaf and frame, not its rivets, straps, hinges, handle or
window bars. Embellishment and accessory detail are there to be looked at, and nothing
that is only there to be looked at should be in the collision index.

This is a performance rule and a feel rule at once. The collider indexes raw triangles, and
cost rises faster than linearly with how *densely* they are packed — a hand-span of small
detail is far worse than the same triangle count spread over a wall. Pressing the capsule
against a signboard used to cost whole milliseconds a frame for the sake of its lettering,
which is why `art/lettering` flags itself `noCollide` and why `signboard` and `banner` hang
their words off the prop as a separate child mesh. The felt version is the same rule from
the other side: catching on a rivet, a handle or a leaf reads as the world being made of
invisible boxes.

Today there are two ways to say it, and a third is planned:

- `MeshBuilder.solid = false` for a prop that is soft the whole way through — the grasses,
  flowers, moss and poultry already take this.
- A child mesh flagged `userData.noCollide` for decoration inside an otherwise solid prop.
  `signboard`, `banner`, `lettering` and `glow` all do this; it costs one extra draw call
  and prunes the whole subtree.
- Per-*part* collision, so a builder can mark a part decorative without splitting it into
  its own mesh, and can give a part a simpler stand-in where the render geometry is
  subdivided for shading rather than for form. Not built — see `COLLISION-FIX.md`.

The default is solid, and stays solid, so a builder that says nothing behaves as it always
has. Saying nothing is still a decision worth making on purpose.

**Lessons worth not relearning.** Three of these cost real time:

- **A box cannot lie on a curved surface.** Anything worn flat against a body — a sash, a
  shoulder strap — is a box passing through a torso with its corners protruding. Both were
  rebuilt and then cut. Fittings that work have volume and sit *beside* the body, where
  overlapping is invisible rather than wrong.
- **Seeds must be avalanched before use.** Mulberry32 advances by a fixed constant, so
  seeds a fixed distance apart stay a fixed distance apart and their nth draws correlate.
  The gallery drew from `1000 + i * 7919` and a 62% feature appeared on two of eight, twice
  running — indistinguishable from a broken feature. `createRng` now mixes the seed once.
- **Rare features are invisible at eight samples.** Eight is all anyone sees at once, and
  at p = 0.5 eight draws come up with one or none about four times in a hundred. Anything
  meant to be noticed has to be commoner than "rare".

*Done when adding a mesh type is one file and it appears in the gallery automatically.*

### Phase 5 — Zones and portals ✅ built

Zone abstraction over exterior and interiors, authored heightfield terrain, boundary
geometry, ground cover, and fade + reverb-crossfade transitions.

**Trigger volumes and proximity prop loading are deferred.** Triggers are a second portal
kind — walk through an opening rather than pressing a key — and are cheap now that
`PortalGraph` and `ZoneManager.use` exist. Prop streaming moves to Phase 9: it is an
optimisation with no problem left to solve, because the collider cache below removed the
cost it would have addressed.

**Zones.** Exactly one zone is in the scene and in the collider at a time. Crossing is: fade
out, swap the group, rebuild the collider, push the zone's air and acoustics into the render
pipeline and the audio engine, drop the player on the arrival marker, fade in — all inside a
single frame at full black. Zones build lazily on first entry and are kept, so re-entry is
free.

- `world/Zone.ts` — `ZoneDefinition` is data: name, environment, spawn, and a build function.
  `ZoneEnvironment` is sky on/off, fog, light levels, room acoustics, floor material.
- `world/ZoneManager.ts` — owns the active zone, the collider rebuild, and the two lights.
- `world/interior.ts` — parametric sealed shell: floor, four walls, ceiling, beams, skirting.
- `debug/zones.ts` — the fixture: one exterior, two interiors, two portals.

**Environment is layered over the tuned look, never merged into it.** `RenderSettings` is the
look and is saved as a preset; `ZoneAir` is the place and changes at every threshold. A zone
writing into the settings would silently overwrite what the player had dialled in, and save it.

**Lights are global, not zone-owned.** One sun and one hemisphere light, driven from the
active zone's environment. Lights parented into a zone get removed with it, and the frame
between one zone's lights leaving and the next's arriving is black that no fade is covering.

**Portals.** One link, two ends; each end is a door and a place to stand in front of it. The
arrival marker is *derived* from its own door — a step out along the facing, turned to look
away — so authoring is two placements rather than four and the marker cannot drift out of
alignment with its door. `arrival` overrides it where the derived spot lands awkwardly.

**Doors do not open.** No swing, no animation, no hinge axis. Using one is `E`, a fade, and a
teleport. The *sound* carries the gesture instead.

- Interact is **`E`**, not left click — left click already acquires pointer lock, so a
  click-to-interact scheme has to disambiguate the first click after every alt-tab.
- There is no cursor to hover with. The crosshair is the cursor, so the tooltip sits above it.
- Tooltip and use share one reach (3.2 m), which makes the tooltip *be* the affordance: if you
  can read it, you can use it.
- Two rays per probe: a mesh raycast for object identity, then the collider, so a door cannot
  be used through the wall it is set into.

#### The door sound

Researched rather than guessed, because with no animation it is the only thing carrying the
gesture. Three engines, after the same decomposition that recorded libraries and automotive
acoustics both use: **hardware** (latch, bolt, strike plate), **panel** (the leaf's formants
and its early reflections), and **hinge** (friction).

- **A creak is stick-slip, not noise.** The joint grips, elastic force builds, it releases with
  a snap, it grips again. Each release is a discrete impulse and the sound is a train of them.
- **So the train is quasi-*periodic*, not Poisson** — a creak has a pitch, and that pitch is
  the slip rate. This is the exact opposite of the PhISEM grit in `footsteps.ts`, where
  independent stone collisions genuinely are Poisson. Even intervals there give a buzz instead
  of a crunch; random intervals here give a rattle instead of a creak. Easiest mistake in the
  model, and the check asserts a coefficient of variation below 0.7 to pin it.
- **Slip rate follows swing velocity**, which is why a door groans low, rises, and falls away.
  Below a stiction threshold nothing happens at all, and that silence is what makes the first
  creak land.
- **Force accumulated while stuck is velocity × time**, square-rooted to compress the range.
  Note what this does *not* say: rate is itself proportional to velocity, so the product comes
  out roughly constant along the swing — correct physics, since a limit cycle releases about
  the same energy each cycle regardless of drive. A door speeding up gets *higher*, not louder.
  The loudness variation is local, and the check detrends both series before correlating.
- **Panel network**: eight parallel pure delays across the leaf, averaged and high-passed —
  Farnell's approximation to a rectangular panel's early reflections, and most of the
  difference between "resonant" and "wooden". Timber formants and delay times are his measured
  wooden-door values.
- Three voices: `timber`, `iron`, `plank`. Material drives look and sound from one field.

**The whole gesture is scheduled at fire time**, not driven per frame. That is correctness, not
performance: a door sound outlives the zone that made it. The creak carries across the cut,
which is most of what makes a transition feel like a door rather than a screen wipe.

Sources: [Farnell, *Designing Sound*, Practical 9](http://aspress.co.uk/sd/practical09.html)
and its [SuperCollider port](https://en.wikibooks.org/wiki/Designing_Sound_in_SuperCollider/Print_version);
[DAFx-17 friction synthesis](https://www.dafx17.eca.ed.ac.uk/papers/DAFx17_paper_58.pdf);
[door slam anatomy](https://sfxengine.com/blog/door-slam-sound-effect).

#### Terrain

`world/terrain.ts`. A heightfield summed from **placed landforms** — `hill`, `ridge`, `basin`,
`rim`, `terrace` — rather than from noise or from a grid of control numbers. Every bump is a
shape somebody put there, listed as data, legible as text, and the same list a Phase 11 editor
would drag around. 256 raw decimals are unreviewable; nobody can look at them and see a valley.

- **The boundary is terrain.** `rim` lifts the outer ring past the controller's slope limit,
  so the edge of the world turns you back. No invisible walls, no special collision.
- **`terrace` is the one landform that is not additive** — it *replaces* height inside a
  radius and eases back over a blend. Buildings are rigid and ground is not; a hut on a
  one-in-twenty slope buries one corner and floats the other, and no placement fixes that
  because the problem is the ground.
- **Variable density.** `detail` regions subdivide the base grid where it matters. Stitching
  closes the T-junctions: a vertex on an edge shared with a coarser neighbour takes its
  height from *that edge as the neighbour draws it*, so both sides describe the same line.

#### Ground cover

`world/ground.ts`. **A ground material is a colour and a footstep sound in one table** — a
cobbled path you can see but that sounds like grass is worse than no path, and one table
means the two cannot drift apart. Painted with placed shapes (`path`, `blot`, `field`),
layered so later wins. Edges are hard, not blended: a gradient between two materials survives
the pixelation and quantization as a band of dither and reads as a mistake.

#### Countryside Exterior Demo

`debug/countryside.ts`, with its interiors in `debug/countryside-homes.ts`. The first zone
that is a place rather than a fixture: a 96 m bowl with a settlement on a level shelf,
streets between the houses, fields and a paddock, and clear ground left deliberately open
for the Phase 7 actors. Was *Arkstin Village*, and is now the exterior half of the
countryside kit standing at real densities — every outdoor builder in the palette, placed by
the ground it belongs in, with three of the houses open. A gallery answers "does this row of
props hang together"; this answers "does the kit make a place", which is a different question
and the only one that catches a palette with a hole in it.

**It is also the zone that costs something.** 364k triangles across 420 props, against 130k
before — deliberate, because `main.ts` prebuilds it at boot and the checks measure it, so it
is the one place where the price of the art kit is visible. The expensive builders are named
where they are placed.

#### Lessons worth not relearning

- **Never dispose materials per zone.** The art kit shares one `ART_MATERIAL`; freeing it
  breaks other zones and surfaces as black geometry somewhere else entirely.
- **Abutting boxes fail watertightness.** Exact shared corners weld into edges on four
  triangles. Overlap by a few percent.
- **A ring handle does not survive the render pass.** Concave detail at this scale reads as
  damage once chunked. Convex shapes stay legible.
- **Feet exactly on the ground is an intersection.** The capsule's lower sphere is tangent to
  the surface, and on any slope the uphill side of the contact is higher than the contact
  point. Settled placements get 12 cm of clearance.
- **Detail boundaries belong on gentle ground.** Stitching closes the geometric seam, but
  nothing hides a change of *facet size* on a slope: two different normals meeting along a
  line is a line you can see, and it looks exactly like a crack.
- **Widening a check catches more than deepening one.** Extending "buildings stand on level
  ground" from huts to everything rigid immediately found a gateway arch with 127 cm of fall
  across its piers. Twice this phase, pointing an existing check at more objects beat making
  it cleverer.

*Done when zones can be crossed repeatedly with no leaks.* `npm run check:world` asserts:
every portal has two live ends; arrivals are clear of geometry, standing on floor, within
reach of their own door, facing away from it, and walkable-off; round trips return within
0.01 m; interiors contain 600 rays fired out of their centre; 60 crossings change neither
triangle count nor child count; the rim cannot be walked over at any of 240 spokes; the
valley is walkable; every prop stands on the ground; buildings stand level; detail boundaries
sit on gentle ground; and variable density leaves no cracks.

### Phase 6 — Procedural audio: the sound of places ✅ built

The Phase 3 engine was good and nearly unused. Every model it built was wired into one
debug object hardcoded to the Proving Ground's anchors, and Arkstin Village — the first
zone in this game that is a *place* — was silent apart from footsteps and doors. This
phase makes a zone declare its own soundscape as data, and widens the library enough to
dress forest, village, castle, industrial and cave settings.

Four tiers. Tier 0 (noise, weather, materials) existed. Tier 1 is `src/audio/dsp/` —
shared primitives extracted from models that already proved them. Tier 2 is the model
library. Tier 3 is `src/audio/faust/` — precompiled `.wasm` worklets, **and nothing in it
is load-bearing**: every Faust model has a native fallback or is optional dressing, so a
wasm load failure degrades the soundscape rather than breaking the game.

**Built:**

- `dsp/` — `clock` (lookahead scheduling), `envelopes`, `modal`, `impact`, `phisem`,
  `grain`, `formant`, `bubble`.
- `Soundscape.ts` — a zone declares `bed` / `emitters` / `scatter` as data, built on entry
  and silenced (never torn down) on exit.
- `Scatter.ts` — one-shots at random points in a region at Poisson intervals. The missing
  primitive: continuous sources establish that a place exists, scattered ones establish
  that somebody lives in it.
- Emitter rework — panner LOD (`hrtf` / `panned` / `virtual`), voice cap, and the three
  magical flags (`ignoreAbsorption`, `ignoreOcclusion`, `invertDistance`).
- Faust spine — hand-rolled loader and worklet, `reverb.dsp` replacing the two-convolver
  crossfade with a live-parameter FDN. `check:faust` asserts no shared-memory imports, so
  GitHub Pages' inability to set COOP/COEP is a checked fact rather than a hope.
- Models: wind, foliage, machine, bird, footsteps, door (Phase 3) plus **fire, rain,
  water, crowd**. One-shots: **hammer, clatter, animal, drip, bell**.
- `audition/measure.ts` — peak, RMS, DC, crest, centroid, band balance, loudness,
  periodicity. Self-tested in `check:audio` against signals with known answers.
- **`friction.dsp`** and `models/friction.ts` — the second Faust module and the genuine
  case for the tier. Sited on the objects that make the noise: the gantry in the factory
  hall, the gate in Arkstin, a limb of the Proving Ground's tree. See the audio section
  for what the model does and why nodes cannot.
- **`debug/SoundStage.ts`** — one of everything, on pedestals, identically configured.
- **`debug/Audition.ts`**, `audition/render.ts` and `audio/baselines.json` — the whole
  library rendered offline and measured against absolute rules, plus recorded baselines
  once a run has been captured.
- **`debug/Meter.ts`** — spectrum and level on the master bus, and `Soundscape.setSolo`
  and `AudioEngine.tuneRoom` behind the panel that drives them.

> **The friction model had to be given a rhythm before its parameters mattered.** The
> first pass ran at a constant speed during each working burst, which puts the contact at
> one fixed point on the friction curve — so the loop settled into one timbre and held it,
> and a rough timbre held for four seconds is a buzz. It read, accurately, as television
> static, and no amount of retuning `pitch` or `roughness` would have fixed it.
>
> Nothing hauls a chain at a constant speed. It is pulled in strokes, and each stroke
> sweeps the speed from nothing up and back down — through the sticking region, through
> the Stribeck dip, out into the rub and back. **That sweep is the creak.** Adding it took
> the crest factor from 6.5 dB to 13, which is the difference between a drone and a
> rhythm, and it is a property of the gesture rather than of the synthesis.
>
> A second lesson from the same pass, and a more portable one: `bright` and `roughness`
> above about half put the energy into the upper modes and the contact noise between them,
> and the octave-band measurement came out *flat*. A friction source with no peak anywhere
> is hiss whatever its parameters claim. That was visible in a number and would have taken
> an afternoon to find by ear — which is the argument for the audition harness in one line.

> **Two of the model's own faults were structural, and the numbers found both.**
>
> **The upper modes were winning against their own levels.** A constant-Q resonator's
> bandwidth is proportional to its centre frequency, so a mode at 4.17× collects four times
> as much of a broadband force as the fundamental — the levels said the first mode was
> twenty times the fourth and what came out was a thousand-hertz whistle with nothing under
> it. Levels cannot fix that; a one-pole tilt inside the loop can, and `bright` now opens
> the tilt rather than raising a level the bandwidth was going to undo.
>
> **And there is a corner at very low speed where it sings.** Down there the contact spends
> nearly all its time in the steep regularised region around zero and what survives is a
> thin high partial: four fifths of the energy above 5 kHz, crest factor 3 dB, which is a
> sine. Every source crosses that range on its way into and out of a gust or a stroke, so
> every one of them whistled at both ends. The fix is not a parameter — it is that a
> contact creeping that slowly is *stuck*, and a stuck contact does not sing, so the output
> is gated below it.

> **The bell is not a Faust model, and that was a real decision.** The plan reserved
> `pm.lib`'s physical bell for it. But `dsp/modal.ts`'s own argument rules modal synthesis
> out of bells — a resonator sharp enough to ring for fifteen seconds has no bandwidth left
> to carry timbre — and a bell's partials genuinely *are* near-pure sines, so the thing
> modal loses is the thing a bell does not have. Additive is the honest implementation,
> and it is cheaper, exactly controllable, and numerically safe where a biquad at Q ≈ 600
> is not. Faust is worth spending on what nodes genuinely cannot do, not on what they can.

### Phase 6b — Galleries, and objects for the sounds ✅ built

Sat before the Faust friction work that closed Phase 6.

**Every sound gets a builder.** A forge fire at `[13, 1.2, 7]` with nothing standing there
is not something you can walk up to and judge — it reads as a bug rather than as a thing.
Needed now: anvil, bell, dog, sink. **Placement runs object → sound, never the reverse**:
the coordinates already in the zone files were picked to get a model audible in the absence
of anything to look at, and they constrain nothing.

The Proving Ground has meanwhile accumulated an object gallery it was never meant to hold —
it was built as a movement and acoustics rig. So the objects move out to galleries of their
own, split by kind with setting used only where it matters: **Animal, Foliage, Prop,
Village Structures, Factory Structures**. Castle and Cave when those kits exist; an empty
gallery is worse than none. A rank of portals stands in the Proving Ground, directly behind
spawn.

> **Galleries are silent.** They were built with emitters sited on their own rows, on the
> theory that a sound is judged next to the thing making it. That holds in the *world* and
> not in here: eight copies of a builder in a line is not a place, so a sound coming out of
> one of them has nothing to be judged against — it is just noise over the thing you came to
> look at. The objects these rooms exist to provide get their emitters where they are
> actually placed.

> **The "infinite floor" is a quad and some fog.** The instinct is a ground mesh that
> recentres on the player; do not build it. The collider indexes each zone into an octree
> once and caches it by key, so ground that moves reinvalidates that index every frame. The
> Proving Ground's floor is expensive because it is a *painted terrain patch*, not because
> it is large — one flat 400 m quad is two triangles, and `fogFar: 140` hides the edge two
> and a half times over. The only worthwhile addition is a world-space grid in vertex
> colour: in a featureless void there is no way to judge how big a thing is or how far you
> have walked, which is the entire job of a gallery.

#### The galleries

Four, not five. **Prop and Village Structures were the same room** and pretending otherwise
meant deciding, per object, whether a trough is a prop or a fixture — a question with no
answer that anyone would ask twice. What a village gallery is *for* is judging whether a
settlement's kit hangs together, and a barrel belongs in that judgement.

| Gallery | Contents |
|---|---|
| **Animal** | bovine, ovine, equine, porcine, poultry, **dog** |
| **Foliage** | the wood, the ground cover and the flowers, tallest first, plus rock and cairn |
| **Village** | figure, hut, archway, door, fence, **fence-post**, **stone-wall** and **stone-wall-low**, **stone-wall-column** and **stone-wall-column-low**, post, streetlamp, trough, cistern, **anvil**, **bell**, and the furniture |
| **Factory** | machine, **forge**, tank, hopper, pipes, hoist, vent, workbench, panel, **sink**, stair, ladder, railing, chainlink, floodlight |

Figure moved from Animal to Village: it is a person-shaped object standing in a settlement,
and the question it answers is about the village's scale rather than about livestock.

One file each, next to `debug/village.ts`, sharing a layout helper — the grid-with-labels
logic is identical between them and exists once. The sound stage reuses its sign posts.

#### The floor

New helper in the world kit, roughly `flatGround(size, options)`:

- One `PlaneGeometry`, segmented 8 × 8 rather than 1 × 1 so vertex lighting across 400 m is
  not degenerate, and excluded from shadow casting.
- `markCollidable`, so it enters the octree as a handful of triangles.
- A world-space grid in vertex colour at 4 m spacing — the ruler, per the note above.
- Zone wiring: `groundAt: () => 0`, `floor: -20`, flat `environment.surface`.

Deliberately **not** doing: painted ground cover, height variation, or the terrain system in
any form. A gallery is a dev room and should look like one.

#### The builders

- **anvil** — the hammer scatter field in Arkstin has nothing standing under it.
- **bell** — currently ringing from six and a half metres up, out of thin air.
- **dog** — the only creature in the animal call table with no body.
- **sink / cistern** — a stone basin for the standing water in the Proving Ground's cell.

A forge was the obvious fifth, for the fire in Arkstin, and it waited — a hearth is a
structure rather than a prop, and rushing it in before the structure kit would have given
Arkstin a brazier with a fire emitter tuned for a forge sitting on it. It landed with the
factory kit and Arkstin has one now, with the anvil beside it.

#### Work order

1. `flatGround` and one gallery end to end, to prove the shape.
2. The four builders.
3. The remaining four galleries, moving objects out of the Proving Ground as they land.
4. Portals in the Proving Ground, standing where the vacated gallery was.
5. Site the new builders in Arkstin and the Proving Ground, moving the emitters to them.

All five steps are done. Arkstin's forge, anvil, bell and dog now stand at named anchors
that the emitters are derived from, so neither can move without the other; the Proving
Ground's sink and cistern were sited the same way; and the factory hall got a gantry before
it got a creak.

Two of those moved the *sound* rather than the object, which is the rule working. The bell
was ringing from six and a half metres up, over a rooftop, from a tower that does not
exist — the kit's bell brings its own two-post frame, so it now rings from head height by
the lane. And the dog roamed the whole settlement on eleven metres of wander, which is a
good argument with nothing standing under it; it has a yard now.

*Done when every emitter in the game has something visible at its position.*

> **Watch the triangle count.** A gallery's collider index should come out *lower* than the
> Proving Ground's, not higher. If a flat floor costs more than a terrain, the follower-mesh
> mistake has been made by accident.

### Phase 7 — Actors and ambient motion

NPC figures, procedural animation, patrol and idle, look-at. Proving Ground gains a
patrolling NPC.

#### Wind sway — the world moving on its own

A still world reads as a diorama however good it looks, and a small amount of constant,
unforced motion does more for the feeling of being somewhere than almost anything else that
could be spent the same effort. This is cheap and it should be built early in the phase, not
last.

**Vertex sway, in the shader, not on the CPU.** Displace vertices in a `MeshLambertMaterial`
patched via `onBeforeCompile`, so it stays one draw call and costs nothing per instance.
Moving objects on the CPU would mean a matrix update per prop per frame and no way to make
a single tree's branches move differently from its trunk.

The displacement has four parts:

- **Weight.** The per-vertex sway weight authored in Phase 4. Everything else is multiplied
  by it, which is what pins roots and frees tips.
- **Stiffness per species.** `art/flex.ts`, applied to the weights when a builder finishes.
  The vertex attribute says *where* a thing bends; it cannot say whether the species bends
  at all, because that is a fact about the plant. Reeds thrash, a sunflower nods, a mushroom
  is rigid. **Absent from the table means rigid** — an anvil that wobbles because somebody
  forgot is a worse failure than a new plant that stands still until noticed. `check:art`
  asserts every entry names a real builder, because a typo is otherwise silent: it is not an
  error, it is a plant that has quietly gone stiff.
- **A travelling front.** Not a phase offset per instance. See below.
- **Two frequencies.** A slow bend along the wind, plus a faster, smaller perpendicular
  flutter. One frequency is a metronome; two that do not divide evenly never visibly repeat.

**The gust travels, and that replaced the per-instance phase offset.** The original plan
gave each tree a random offset so no two moved together. That is the right instinct and the
wrong mechanism: wind has a current and a front, so a gust *arrives* somewhere and moves
through, and what separates two trees is not a random number but where they stand. So the
field gained a position argument — `strengthAt(x, z)` samples `fieldAt` at a phase lagged by
how far downwind the point is, `frontSpeed` metres per second. Everything on a line across
the wind receives it together, which is what a front is; everything downwind receives it
later, which is what lets you watch it cross a valley. At 9 m/s that is about eleven seconds
for Arkstin's bowl.

**And it is the same field the audio reads.** Every wind-driven model — foliage, wind, fire,
rain, the tree groan, the gate creak — samples at *its own position* rather than at the
listener, so the far treeline quickens before the near hedge, in the order you watch the same
gust reach them. That coupling is the entire point of having built a gust field.

**Getting the shader to agree exactly is the one real engineering problem**, and the obvious
answer is wrong. Reimplementing the noise in GLSL would differ in the last bits — integer
hashing and float precision are not the same on both sides — and over a minute the picture
and the sound drift apart. That failure is invisible in code and shows up only as a vague
sense that something is off, which is worse than never having coupled them. So the CPU stays
the single source of truth and *ships the answer*: the field depends on one scalar, so a
rolling 256-texel `DataTexture` holds it across the window of phases the visible world can
ask for, rebuilt each frame from `Weather.fieldAt`. Agreement by construction rather than by
care. Eight bits is ample — a strength quantised to 1/255 is far finer than any displacement
it drives.

Candidates beyond trees: grass and bushes (higher frequency, smaller amplitude), hanging
cloth and banners, water surfaces, smoke, chains and signs on pivots, reeds. Anything with
a pivot can use a simpler rotation instead of vertex work.

**Not only wind.** The same machinery covers idle motion generally — a breathing NPC, a
guttering lamp, a door easing on its hinge. Ambient motion is a system, not a tree feature.

*Done when one NPC walks a loop and turns to watch you, and when standing still in the open
does not feel like standing in a photograph.*

### Phase 8 — Interaction and narrative

Raycast interaction; topic pool and `[[keyword]]` parser; dialogue UI; per-NPC topic tables,
rebuffs and item responses; quests; inventory; journal with keyword index; notes and
letters. Proving Ground gains two test NPCs — one who teaches a keyword, one who only
answers it — plus a fetch quest that resolves in conversation and a letter that teaches a
topic.

*Done when you can learn a keyword from a note, carry it to the NPC who answers it, be
rebuffed by the one who doesn't, and close a quest by presenting an item mid-conversation.*

### Phase 9 — Meta

Autosave, settings overlay if kept, performance pass. (Touch controls moved to Phase 1.)

*Done when it survives a reload and plays on a phone.*

### Phase 10 — Content

Systems frozen. Authoring data files only. **The fiction is to be settled with the repo
owner before this starts — do not invent it.**

### Phase 11 — World editor ⏸ optional

In-browser: fly camera, place/move/rotate props, sculpt the heightfield, place audio
emitters with visible radii, place triggers and NPC spawns, export JSON to disk.

*Done when a zone can be built without touching code.*

> **Deferred, not cut, and moved to the end.** The argument for an editor was that
> hand-placing everything by typing coordinates would become miserable. Phase 5 weakened
> that: terrain is a short list of named landforms, ground cover is a short list of painted
> shapes, and props are scattered by seeded rules against the heightfield rather than placed
> one at a time. Arkstin Village is a few dozen lines of data, and the checks catch the
> errors an editor would otherwise catch by eye — props off the ground, buildings on slopes,
> arrivals inside walls.
>
> Phase 6 pushed in the other direction and is worth recording: **placing sounds by typing
> coordinates genuinely is miserable**, because there is nothing to look at. But the answer
> to that turned out to be Phase 6b — give every sound an object and put the objects in
> galleries — not an editor. The editor is worth building when hand-editing hurts for a
> reason a builder cannot fix. The signal to watch for: wanting to nudge one prop at a time,
> or authoring a zone that is mostly hand-placed set pieces rather than rules.

---

## Architecture

```
src/
  main.ts              boot, zone switch
  engine/              Viewport, Loop, Input, PostFX
  audio/               context, buses, noise substrate, models/, Emitter, zone acoustics
  player/              Controller, Collider
  world/               Zone, ZoneManager, Portal, Interaction, interior,
                       terrain (landforms), ground (cover materials)
  art/                 mesh builders — one file per family
  actors/              Actor, NPC, animation drivers
  systems/             Topics, Dialogue, Quests, Inventory, Interaction, Notes, Autosave
  ui/                  Reticle (prompt + fade), Loader, TouchControls
                       (DialogueUI, JournalUI, NoteUI from Phase 8)
  content/             data only — zones, npcs, topics, quests, items, notes
  editor/              world editor (Phase 11, optional)
  debug/               ProvingGround, panels, overlays
tools/                 headless checks, run under node — outside the tsconfig
docs/                  build output, served by Pages — WIPED ON EVERY BUILD
public/                copied verbatim into docs/ (holds .nojekyll)
```

Content files hold no engine imports, so Phase 10 is authoring rather than coding.

> `docs/` is Vite's `outDir` with `emptyOutDir: true`. Never put hand-written files there —
> they will be deleted. Anything that must ship alongside the build goes in `public/`.

**This has already bitten once.** `docs/CNAME` — the custom domain for `hswow.net`, added
through the GitHub web UI, which naturally writes to the directory Pages serves — would
have been deleted by the next `npm run build`, silently taking the domain down with it. It
now lives in `public/CNAME` and Vite copies it out on every build. Anything else added to
the repo through GitHub's UI is exposed to the same trap.

## Dependencies

`three`, `vite`, `typescript`, `@types/three`, `lil-gui`. Note that three 0.170 ships **no**
TypeScript types, hence `@types/three`. `PointerLockControls`, `EffectComposer`,
`RenderPixelatedPass` and `stats.module` all ship inside three — import them from
`three/examples/jsm/…`, which resolves for both the bundler and the typechecker.

## Commands

```
npm run build           # tsc --noEmit, then bundle into docs/
npm run preview         # serve the built docs/ locally
npm run dev             # dev server with HMR, exposed on the LAN
npm run check:movement  # headless collision and movement assertions
npm run check:audio     # gust field, noise colour, reverb decay
npm run check:art       # builder determinism, sway weights, scale, watertightness
npm run check:world     # portals, arrivals, sealing, crossing leaks, terrain, door cue
npm run check:faust     # committed .wasm matches its .dsp, no shared memory, size budget
npm run build:faust     # recompile the .dsp sources; the artifacts are committed
npm run check           # all five
```

The `tools/` suites are not covered by `tsc --noEmit` — `tools/` is outside the tsconfig
`include`, which is what keeps Node globals out of the browser build's typecheck.

`check:world` passes `--external:../faust/*` to esbuild, and it is load-bearing. `Zone.ts`
imports `Soundscape` for `SILENCE`, which reaches every model, one of which reaches the
Faust tier — and that tier resolves its wasm and worklet through Vite's `?url` imports,
which nothing outside Vite can. The friction model defers its half behind a dynamic
`import()`, and the flag is what stops esbuild bundling it anyway: a dynamic import stops
the module *running*, not from being pulled in.

The audition harness is deliberately **not** a `check:` script. It needs a real
`OfflineAudioContext`, real biquads and a real worklet, and a reimplementation in Node
would measure the reimplementation. It runs from the debug panel; see the audio section.

## Debug switches

Query-string flags that work in the **deployed** build, not just locally, because the game
is tested on a phone against the live URL.

| Flag | Effect |
|---|---|
| `?debug` | Frame stats, the live tuning panel, a movement/zone readout, and zone jumps — including the sound stage, which has no door |
| `?level=<name>` | Which level to boot into. Only `proving` exists so far |
| `?touch` | Force the touch controls on, to test them with a mouse |

## Deployment

`docs/` is committed on purpose. One-time setup on GitHub: **Settings → Pages → Deploy from
a branch → `main`, folder `/docs`**. Every subsequent push touching `docs/` redeploys to
`https://stovenly.github.io/hswow.net/`.

---

## Deviations from the original plan

Recorded so future sessions understand why the code differs from the phase list.

**Debug gating is `?debug`, not dev-only builds.** The plan specified `import.meta.env.DEV`.
Testing happens against the deployed build on a phone, so a dev-only gate would put the
tuning panel somewhere permanently unreachable.

**Touch controls moved from Phase 9 to Phase 1.** Pointer lock does not exist on mobile
Safari or Chrome Android. The moment OrbitControls is replaced by the first-person
controller, the build stops being testable on a phone unless touch look and move ship in
the same phase. Phase 0 is mobile-testable only because OrbitControls happens to handle
touch.

**Collision is triangles, not "heightfield plus an AABB list".** The plan named those two
because they are cheap and easy to reason about, but an AABB list cannot represent a ramp,
and maintaining a second, separate path for terrain would mean every collision bug has to
be found twice. three's `Octree` indexes raw triangles, so authored walls, ramps, stairs
and Phase 5's sculpted terrain all reduce to one representation and one code path. Still
no physics engine, and still no dependency added.

**The narrow phase is ours, not three's.** `Octree.capsuleIntersect` decides penetration
from the capsule's distance to a triangle's infinite *plane*. Standing beside a stair
tread, that reports the capsule as half a metre inside it and launches the player. Our
`penetration()` reduces the capsule to the single sphere nearest the triangle and does a
proper closest-point test, which bounds every push by the capsule radius. three's octree
is still doing the broad phase, which is the part worth reusing.

**`tools/movement-check.ts` was added — a headless test, which no phase asked for.** Six
real bugs in the controller were found by it and would not have been found by playing:
a downward ground bias that made a 45° ramp unclimbable while 20° was fine; a ground snap
that depenetrated along the surface normal and so pushed the player backwards every
sub-step; a step-up whose obstruction test measured velocity that collision had already
zeroed, so it never fired. Collision is pure geometry and needs no GPU, and the build is
played on a phone where there is no debugger — asserting it is cheaper than feeling for
it. Delete it if it stops earning its keep.

**Dither, quantization and vignette are one pass, not three.** The plan listed them
separately. They are not independent: the dither has to be added *before* quantization —
that is the entire mechanism, trading spatial resolution for colour resolution — and the
vignette has to be applied before both, or its falloff is the smoothest gradient on screen
and bands worse than whatever it was darkening. Splitting them would also cost two extra
full-screen passes for nothing.

**A gradient sky with procedural clouds was added, which no phase asked for.** Requested
directly. `engine/Sky` — three colour bands plus fractal value noise projected onto a flat
layer overhead, recentred on the camera each frame. Two knock-on changes came with it: the
fog colour is now driven from the sky's horizon (distant geometry fades to the fog colour,
so a mismatch leaves a band of the wrong colour hanging in front of the sky), and the
proving ground's lighting was rebalanced for daylight.

**The gust field needed a contrast expansion.** Summing octaves of value noise gives a
distribution clustered hard around its mean — the central limit theorem — so the raw field
spent one second above 0.75 in ten minutes. The wind's whistle layer scales as the cube of
strength, so that layer would have been dead code. Expanding around the midpoint and
clamping costs the extremes, which become brief plateaus, and a sustained lull or a gust
that holds are both things weather does. Found by `check:audio`, not by ear.

**`tools/audio-check.ts` was added**, on the same reasoning as the movement check. It
caught the gust-distribution problem above, and a `fract(sin(n))` hash whose structure put
slow correlations back into a signal whose entire purpose is not having any.

---

## Open questions

1. World editor — build Phase 11, or hand-edit JSON? *(Leaning hand-edit; see Phase 11.)*
2. ~~Which optional audio models: water and fire?~~ *(Settled in Phase 6: both built, plus
   rain, crowd, and the scatter one-shots.)*
3. Crouch and sprint-stamina — in or out? *(Phase 1 shipped without them.)*
4. Keep the minimal settings overlay, or truly no UI at all?
5. Fixed hour or a day/night cycle?
6. The 16-colour palette itself — the shipped one is placeholder scaffolding.

---

## Sources

Research behind the audio system:

- [Developing game audio with the Web Audio API — web.dev](https://web.dev/articles/webaudio-games)
- [Web Audio API, Boris Smus — ch. 6](https://webaudioapi.com/book/Web_Audio_API_Boris_Smus_html/ch06.html)
- [Web Audio spatialization basics — MDN](https://docs.w3cub.com/dom/web_audio_api/web_audio_spatialization_basics.html)
- [reverbGen — generating artificial impulse responses](https://github.com/adelespinasse/reverbGen)
- [Tone.js Reverb — decaying-noise IR generation](https://tonejs.github.io/docs/14.7.58/Reverb.html)
- [Making Reverb with the Web Audio API — gskinner](https://blog.gskinner.com/archives/2019/02/reverb-web-audio-api.html)
- [music-dsp: Wind in Trees, how to synthesize](https://music-dsp.music.columbia.narkive.com/sRNWKJyD/wind-in-trees-how-to-synthesize)
- [Synthetic Wilderness: recreating nature sounds](https://www.knobulism.com/2025/01/29/synthetic-wilderness-recreating-nature-sounds/)
- [Andy Farnell, *Designing Sound*](https://mitpress.mit.edu/9780262014410/designing-sound/) — the standard reference for procedural audio models
