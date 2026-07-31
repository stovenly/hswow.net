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

#### Arkstin Village

`debug/village.ts`. The first zone that is a place rather than a fixture: a 96 m bowl with a
settlement on a level shelf, streets between the houses, fields and a paddock, and clear
ground left deliberately open for the Phase 7 actors.

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

### Phase 6 — Procedural audio: the sound of places 🔨 in progress

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

**Remaining:** the friction family (`friction.dsp` — rope on a windlass, cart axles,
portcullis chains, hinges, a tree groaning under load). Stick-slip needs a per-sample
feedback loop and is the genuine Faust case. Then the sound stage and the rendering half
of the audition harness.

> **The bell is not a Faust model, and that was a real decision.** The plan reserved
> `pm.lib`'s physical bell for it. But `dsp/modal.ts`'s own argument rules modal synthesis
> out of bells — a resonator sharp enough to ring for fifteen seconds has no bandwidth left
> to carry timbre — and a bell's partials genuinely *are* near-pure sines, so the thing
> modal loses is the thing a bell does not have. Additive is the honest implementation,
> and it is cheaper, exactly controllable, and numerically safe where a biquad at Q ≈ 600
> is not. Faust is worth spending on what nodes genuinely cannot do, not on what they can.

### Phase 6b — Galleries, and objects for the sounds

Sits before the Faust friction work that closes Phase 6.

**Every sound gets a builder.** A forge fire at `[13, 1.2, 7]` with nothing standing there
is not something you can walk up to and judge — it reads as a bug rather than as a thing.
Needed now: anvil, bell, dog, sink. **Placement runs object → sound, never the reverse**:
the coordinates already in the zone files were picked to get a model audible in the absence
of anything to look at, and they constrain nothing.

The Proving Ground has meanwhile accumulated an object gallery it was never meant to hold —
it was built as a movement and acoustics rig. So the objects move out to galleries of their
own, split by kind with setting used only where it matters: **Animal, Foliage, Prop,
Village Structures, Factory Structures**. Castle and Cave when those kits exist; an empty
gallery is worse than none. Each gallery is a soundscape too — the anvil should ring when
you walk up to it. A rank of portals stands in the Proving Ground where the gallery was.

> **The "infinite floor" is a quad and some fog.** The instinct is a ground mesh that
> recentres on the player; do not build it. The collider indexes each zone into an octree
> once and caches it by key, so ground that moves reinvalidates that index every frame. The
> Proving Ground's floor is expensive because it is a *painted terrain patch*, not because
> it is large — one flat 400 m quad is two triangles, and `fogFar: 140` hides the edge two
> and a half times over. The only worthwhile addition is a world-space grid in vertex
> colour: in a featureless void there is no way to judge how big a thing is or how far you
> have walked, which is the entire job of a gallery.

#### The galleries

| Gallery | Contents |
|---|---|
| **Animal** | bovine, ovine, equine, porcine, poultry, **dog**, figure |
| **Foliage** | tree, bush, grass, mushroom, stump, rock, cairn |
| **Prop** | crate, barrel, table, trough, post, fence, **anvil**, **bell**, **sink** |
| **Village Structures** | hut, archway, fence runs, and the forge when it lands |
| **Factory Structures** | machine, flywheel, and the industrial kit as it lands |

One file each, next to `debug/village.ts`, sharing a layout helper — the grid-with-labels
logic is identical between them and should exist once.

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

A forge or hearth is the obvious fifth, for the fire in Arkstin. It is a structure rather
than a prop, so it waits for the Village Structures kit rather than being rushed in.

#### Work order

1. `flatGround` and one gallery end to end, to prove the shape.
2. The four builders.
3. The remaining four galleries, moving objects out of the Proving Ground as they land.
4. Portals in the Proving Ground, standing where the vacated gallery was.
5. Site the new builders in Arkstin and the Proving Ground, moving the emitters to them.

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
npm run check           # all four
```

The `tools/` suites are not covered by `tsc --noEmit` — `tools/` is outside the tsconfig
`include`, which is what keeps Node globals out of the browser build's typecheck.

## Debug switches

Query-string flags that work in the **deployed** build, not just locally, because the game
is tested on a phone against the live URL.

| Flag | Effect |
|---|---|
| `?debug` | Frame stats, the live tuning panel, a movement/zone readout, and zone jumps |
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
