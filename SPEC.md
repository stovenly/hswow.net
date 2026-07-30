# Heaven Sleeps Within Our Wounds — specification

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
| 3 — Procedural audio engine | **Built, not yet heard** |
| 4 — Procedural art kit | Not started |
| 5 — Zones and portals | Not started |
| 6 — World editor *(cuttable)* | Not started |
| 7 — Actors, animation, wind sway | Not started |
| 8 — Keyword dialogue, quests, narrative | Not started |
| 9 — Autosave, touch controls, performance | Not started |
| 10 — Content authoring | Not started |

---

## Locked decisions

| | |
|---|---|
| **Title** | Heaven Sleeps Within Our Wounds (`hswow.net`) |
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

### Synthesis models

Each is a factory returning `{ input, output, params, update(dt) }`, so any model can drive
any emitter.

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

**Optional models, undecided:** water (bubble chirps at Poisson intervals over a filtered
bed), fire (Poisson crackle over low rumble), bells, birds.

### Spatialization

Every emitter owns a `PannerNode` in `HRTF` mode with an inverse distance model and
per-emitter `refDistance` / `maxDistance` / `rolloffFactor`. Web Audio is y-up, same as
three.js, so positions map directly. On top of the panner:

- **Air absorption** — a lowpass whose cutoff falls with distance. High frequencies are
  absorbed more by air; this is what makes far-off sounds read as far off rather than
  merely quiet.
- **Occlusion** — raycast listener→emitter every N frames, then blend gain and a lowpass
  toward occluded values using `setTargetAtTime` to avoid zipper noise. A machine behind a
  wall should thud, not vanish.
- **Directionality** — `coneInnerAngle` / `coneOuterAngle` / `coneOuterGain` for emitters
  that face a direction.

### Per-zone acoustics

Each zone declares RT60, pre-delay, damping and wetness. Impulse responses are **generated
at boot** in an `OfflineAudioContext` — noise shaped by an exponential decay curve,
filtered for damping, decorrelated per channel — and fed to a `ConvolverNode` per zone.
Crossfading the wet bus on zone transitions means a doorway *sounds* like a doorway.
`reverbGen` and Tone.js's `Reverb` both work this way and are worth reading first.

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

Live panel for every model parameter; solo/mute per emitter; emitter positions, radii and
occlusion rays drawn in the debug view; a spectrum analyser. Presets saved as JSON.

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
- [ ] Crouch — **open**
- [ ] Stamina limiting sprint — **open**

### Rendering
- [x] Low-poly flat-shaded, vertex colors, no textures
- [x] Pixelation via `RenderPixelatedPass` (depth/normal edge outlines included)
- [x] Bayer ordered dithering, matrix size tunable
- [x] 16-color palette quantization
- [x] Per-zone fog and vignette
- [x] Live tuning panel for all of it
- [ ] Scanlines / CRT curvature — **open**
- [ ] Per-zone color grading LUT — **open**

### World
- [x] Bounded authored exterior; hills, cliffs and walls as natural barriers
- [x] Authored heightfield terrain, sculpted not generated
- [x] Proximity-based prop load/unload within the bounded zone
- [x] Instanced interiors, hand-built
- [x] Portal triggers with fade transition and reverb crossfade
- [x] Per-zone config: light, fog, ambience, acoustics
- [ ] Fixed hour vs day/night — **open** (recommendation: fix at one hour)
- [ ] Weather particles — **open**

### Audio
- [x] Everything in the audio section above
- [ ] Water, fire, bird models — **open**

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

`OutputPass` is where linear light becomes sRGB. Everything the retro pass does — matching
a hex palette, spacing quantization steps evenly, dithering across those steps — is only
correct on the display side of that conversion, so it runs last.

Shipped:

- `engine/RetroShader` — Bayer ordered dither at 2×2/4×4/8×8, per-channel level
  quantization *or* nearest-match against a 16-colour palette, and vignette. The dither
  grid is sized to the chunky pixel, not the screen pixel.
- `engine/PostFX` — owns the composer, the settings, and their persistence. Pixel size is
  authored in CSS pixels and applied in device pixels, so a look dialled in on a desktop
  reads the same on a phone at DPR 3.
- `debug/presets` — localStorage, best-effort, separate from Phase 9's autosave.
- Tuning panel folders: look, vignette, fog, palette (16 pickers), preset
  (save / reset / copy JSON).

**The palette default is a placeholder.** Sixteen neutral greys and browns, there so
palette mode does something the first time it is switched on. Quantize defaults to
`levels` precisely so no art direction is imposed. Choosing the real palette is yours.

**Not verified visually.** Everything typechecks, builds, and the Bayer matrices were
checked numerically against the canonical tables, but no one has looked at it yet. If it
boots black, the shader is the first suspect.

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

### Phase 4 — Art kit

`src/art/` mesh builders: figures, trees, rocks, terrain features, buildings, fittings.
Proving Ground gains a gallery row that auto-instantiates every builder.

**Builders must author sway weights.** Every mesh that will move in the wind carries a
per-vertex weight — 0 at the roots, 1 at the tips — baked into a vertex attribute at build
time. Phase 7's sway shader reads it and nothing else; without it, a trunk swings from its
middle and a leaf cluster shears off its branch. This is cheap to do while the geometry is
being generated and effectively impossible to add afterwards, which is why it belongs here
rather than there.

*Done when adding a mesh type is one file and it appears in the gallery automatically.*

### Phase 5 — Zones and portals

Zone abstraction over exterior and interiors, heightfield terrain, boundary geometry,
trigger volumes, fade + reverb-crossfade transitions, proximity prop loading.

*Done when zones can be crossed repeatedly with no leaks.*

### Phase 6 — World editor *(cuttable)*

In-browser: fly camera, place/move/rotate props, sculpt the heightfield, place audio
emitters with visible radii, place triggers and NPC spawns, export JSON to disk.

*Done when a zone can be built without touching code.*

> **Cut decision pending.** Dropping procedural generation means everything is placed by
> hand, including audio emitters, which are miserable to position by typing coordinates. An
> editor pays for itself if the world exceeds a couple of small zones. The fallback is
> hand-edited JSON with hot reload — fine for a small world, awful for a large one.

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

The displacement has three parts, and all three are needed:

- **Weight.** The per-vertex sway weight authored in Phase 4. Everything else is multiplied
  by it, which is what pins roots and frees tips.
- **Phase offset per instance.** Derived from world position, so no two trees move
  together. Trees swaying in unison is worse than trees not swaying at all — it reads
  immediately as a single mechanism rather than as many separate things in the same wind.
- **Two frequencies.** A slow bend along the wind direction, plus a faster, smaller
  perpendicular flutter. One frequency is a metronome; two that do not divide evenly never
  visibly repeat.

**Driven by the same `Weather` field as the audio.** This is the point of the whole idea.
The gust that opens the wind's whistle and quickens the foliage grains is the same number
that bends the trees, so what you see and what you hear are one event. Uncoupled, they are
two ambiences that happen to share a room; coupled, they are weather. `Weather.strength`
and `Weather.windDirection` go in as uniforms.

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

---

## Architecture

```
src/
  main.ts              boot, zone switch
  engine/              Viewport, Loop, Input, PostFX
  audio/               context, buses, noise substrate, models/, Emitter, zone acoustics
  player/              Controller, Collider
  world/               Zone, Heightfield, Portals, PropStreamer
  art/                 mesh builders — one file per family
  actors/              Actor, NPC, animation drivers
  systems/             Topics, Dialogue, Quests, Inventory, Interaction, Notes, Autosave
  ui/                  HUD, DialogueUI, JournalUI, NoteUI, TouchControls
  content/             data only — zones, npcs, topics, quests, items, notes
  editor/              world editor (Phase 6)
  debug/               ProvingGround, panels, overlays
tools/                 headless checks, run under node — outside the tsconfig
docs/                  build output, served by Pages — WIPED ON EVERY BUILD
public/                copied verbatim into docs/ (holds .nojekyll)
```

Content files hold no engine imports, so Phase 10 is authoring rather than coding.

> `docs/` is Vite's `outDir` with `emptyOutDir: true`. Never put hand-written files there —
> they will be deleted. Anything that must ship alongside the build goes in `public/`.

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
```

`check:movement` is not covered by `tsc --noEmit` — `tools/` is outside the tsconfig
`include`, which is what keeps Node globals out of the browser build's typecheck.

## Debug switches

Query-string flags that work in the **deployed** build, not just locally, because the game
is tested on a phone against the live URL.

| Flag | Effect |
|---|---|
| `?debug` | Frame stats, the live tuning panel, and a movement state readout |
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

1. World editor — build Phase 6, or hand-edit JSON?
2. Which optional audio models: water and fire? *(Birds are built.)*
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
