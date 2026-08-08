# Shaders and materials

A companion to [SPEC.md](SPEC.md) and [SCALING.md](SCALING.md): the spec says what the
game is, scaling says what must change structurally, and this says how each planned
graphical feature would actually be built against the pipeline as it stands. Nothing
here is committed work. Everything here is a design worked out far enough that starting
it is a matter of doing, not deciding.

Two halves. The first is the screen-space roadmap — the pixel stage and the effects
that run in it, phased R0–R7. The second, from *Materials* onward, is the surface
roadmap — finishes, transmission, the M-phases. They share the pipeline and the
ground rules, and the section numbers (§1–§8) belong to the first half.

Written to be read cold. Update it as decisions land.

---

## The ground rules every feature inherits

The pipeline today (`src/engine/PostFX.ts`):

```
scene ─► PixelStage ──────────────────► OutputPass ─► RetroShader ─► screen
         chunky pixels, edge lines,      tone map     halftone dither,
         effect slot, upscale            and sRGB     quantize, vignette
```

(That was `RenderPixelatedPass` when this document was written. R0 replaced it;
the shape is otherwise the same.)

Five constraints fall out of it, and every section below is written against them.

1. **Effects go before `OutputPass`, in linear light.** The quantizer runs on
   display-referred sRGB and must stay last; anything inserted after it would either
   dodge the halftone (and look pasted on) or break the level maths. Inserted before,
   an effect's output is just scene colour — the dither and quantize treat a bloom
   gradient or an AO gradient exactly as they treat a lit wall, which is what makes
   these effects read as part of the look rather than as a modern layer over it.

2. **Effects run at chunky resolution.** One value per chunky pixel, never per device
   pixel — a value that varied inside a block would dissolve the pixelation, exactly
   as the dither threshold would (`RetroShader`, "one threshold per chunky pixel").
   The economics are the good news: at pixel size 2 on a 4K drawing buffer the working
   resolution is 960×540 — about half a million pixels, a sixteenth of the device
   count. Effects that are expensive at full resolution are cheap here.

3. **No temporal accumulation, anywhere.** TAA-style history reprojection needs
   sub-pixel jitter and a stable gradient field; the pixelation and the halftone
   destroy both, and a first-person camera under pointer lock snaps. Every effect
   below is spatial-only: noise is hidden by per-chunky-pixel hashing and the halftone
   itself, never by frames averaging. This rules out the cheap version of several
   techniques up front, and the designs account for it.

4. **One toggle per effect, layered over the preset.** The precedent is
   `PostFX.setDither`/`setPixelation`: the tuned values live in the saved settings,
   the on/off switch sits on top, and switching off never overwrites tuning. Every
   feature below ships the same way — one switch that genuinely turns it on and off,
   plus its tuning block in `RenderSettings` (or `ZoneAir`, where the value belongs to
   a place rather than to the look).

5. **No texture assets.** Noise is computed in-shader (the sky's fbm is the precedent)
   or shipped as a boot-built `DataTexture` (the wind field is the precedent). Nothing
   below needs a file.

---

## R0 — the prerequisite: own the pixel stage

**Every screen-space feature below wants the same slot: after the low-res render,
before the upscale.** `RenderPixelatedPass` does render-and-upscale in one pass, so
that slot does not exist yet. Creating it is the enabling work for the whole document.

Replace `RenderPixelatedPass` with our own stage (we already reach into its internals
to patch its normal material — `applySway(this.pixelPass.normalMaterial)` — so the
dependency is one-way and shallow):

- **`PixelStage`** renders the scene twice at chunky resolution, as the pass does now:
  - *Colour target* — `HalfFloatType`. Today's pass renders LDR; half-float costs a
    copy of nothing at this resolution and gives bloom and god rays real headroom to
    add light without clipping before the tone map.
  - *Normal target with depth texture* — exactly what the pass builds for its edge
    detector today. The difference is that we keep it bound and hand it to whoever
    asks: AO, fog, water, SSR, DoF all read the same two textures.
- **Effect passes** then run chunky-to-chunky in whatever order the sections below
  specify, ping-ponging two half-float targets.
- **`UpscalePass`** does the edge detection (the same depth/normal difference the
  pixelated pass does today, lifted out) and the nearest-neighbour blit to device
  resolution.
- `OutputPass` and `RetroShader` are untouched and stay in exactly the order they are
  in, for the reasons documented in `PostFX.ts`.

The glow-visibility hook (`hideGlowFromEdges`) and the sway patch on the normal
material move across unchanged — they are attached to materials, not to the pass.
(The surface material now also carries the weathering stage from `art/weathering`,
composed over its sway patch; it is colour-stage work on `ART_MATERIAL` only, so
the restructure never touches it.)

This is a contained rewrite of ~200 lines of upstream pass into engine code we own,
and it is the only structural change in this document. Everything after it is additive.

---

## 1. Ambient occlusion — GTAO, and here is the choice made

**GTAO, not classic SSAO.** The question was which is more performant at acceptable
quality, and the answer is that at equal cost GTAO is simply better, so it wins on
both axes:

- Classic SSAO fires a random hemisphere kernel per pixel and compares depths. Its
  quality lives and dies on kernel size and a per-pixel random rotation, it needs a
  strong blur to hide the noise, and it has two bias knobs that fight each other.
- GTAO marches the depth buffer along a few screen-space directions, finds the horizon
  angle each way, and integrates cosine-weighted visibility analytically. Same inputs,
  slightly more arithmetic per sample, **far fewer samples for the same quality** —
  and the result is physically meaningful, so there is one strength knob instead of a
  bias-tuning session.

For a flat-shaded world AO is the missing ingredient, not a refinement: Lambert under
a hemisphere light produces zero contact darkening, so props sit *on* the ground
rather than in it, and interior corners have no depth. This is the single
highest-value feature in the document.

**Implementation.**

- Inputs: the depth texture and normal target `PixelStage` already renders. No new
  scene passes.
- 2 directions × 6 horizon steps per pixel (12 taps), direction angle rotated per
  chunky pixel by a hash of the cell coordinate — stable per pixel, no temporal
  anything, and the residual pattern is exactly the kind of texture the halftone
  absorbs. World-space radius ~0.8 m, falloff quadratic.
- One 3×3 depth-aware blur at chunky resolution. Not more: at this resolution a wide
  blur eats the corner darkening it exists to preserve.
- Composite: `colour *= mix(1.0, ao, strength)`, faded by the fog factor
  (reconstructed from depth against the scene fog uniforms) so distant AO does not
  darken through the haze — AO applied after in-material fog would otherwise paint
  grime onto the fog itself.
- Cost: ~13 texture reads × ~0.5 M pixels. Trivial on desktop, fine on the phone
  target; if it ever is not, AO can run at half chunky resolution and upsample
  depth-aware, which is the standard escape hatch.
- three.js note: `GTAOPass` exists upstream but renders its own full-resolution
  normal/depth and assumes a conventional pipeline; hand-rolling against our shared
  targets is less code than adapting it.

Settings: `ao: { strength, radius }` in `RenderSettings`; toggle beside dither and
pixelation.

---

## 2. Placed fog volumes — dungeon mist, cloud banks, mountain illusions

**No global height fog.** Decided against: a zone-wide mist layer is weather the
whole zone wears whether it suits or not. What is wanted is fog as *set dressing* —
authored volumes placed exactly where they mean something. A mist pool hanging in a
dungeon room. A cloud bank wrapped around the rim so a 96 m bowl reads as a
mountainside with weather below the summit. A plume over a chimney. Placed like
props, because that is what they are.

The existing distance fog (`THREE.Fog`, in-material) stays untouched — it is the
haze of *distance*, the sky-link logic in `PostFX.apply` is built on it, and the
mountain illusion leans on it (below).

**The volume.** A `FogVolume` is authored data, no scene object:
`{ shape: ellipsoid | box, center, size, density, tint, softness, noiseScale,
turbulence, drift }` — pushed to the pass on entry alongside `ZoneAir`, because it
belongs to the place rather than to the look. Up to 8 active as a uniform array; if
a zone ever wants more, the nearest 8 by screen coverage win.

It is declared on `ZoneDefinition`, **not in `ZoneEnvironment`**, and the reason is
positions. Everything in the environment is a property a place shares with every
other place of its kind — which is what `OUTDOOR_ENVIRONMENT` and
`INDOOR_ENVIRONMENT` are for, and most zones spread one and override two fields. A
volume has a centre, so it can be shared by nothing: a mist pool declared in a
constant that forty zones spread would put the same pool at the same coordinates in
all forty. It sits beside `spawn` and `groundAt`, which are the other facts about
*this* place's geometry rather than about its kind.

**The pass**, at chunky resolution, in the effect slot:

- Reconstruct the world-space ray per chunky pixel from depth + inverse
  view-projection.
- Per volume: analytic ray/shape intersection; on hit, march the interior in 8
  steps, density shaped by fractal noise and feathered toward the shell by
  `softness` so no volume ever shows its geometric edge.
- **The noise is a texture, not the sky's fbm.** The plan said to lift the sky's
  chunk, and the sky's chunk is two-dimensional — sampled on the xz plane it gives
  a volume no vertical structure at all, which turns the plume into a column of
  even haze. Extending it to 3D is eight hashes per octave, and this is sampled
  eight times per volume per pixel rather than once. So `engine/noise` builds a
  small tileable noise texture at boot (ground rule 5's second clause; the wind
  field is the precedent) and fakes the third axis by quantizing it into slices
  and offsetting the lookup per slice — two hardware-filtered fetches per octave,
  three octaves, and the vertical structure is real. The sky's chunk did move into
  the same module, verbatim, and the sky still uses it.
- Accumulate front-to-back across volumes, early-out near full opacity, depth-tested
  against the scene — so a pillar stands *in* the dungeon mist and the player walks
  *into* the bank, rather than either being a backdrop.
- Start-offset each ray by the chunky-cell hash so 8 steps read as noise, not
  shells; the halftone then prints the soft gradient as screen-tone, which is the
  aesthetic argument for volumetrics in this pipeline at all.
- `drift` defaults to the wind (`windDir` from `src/art/sway.ts`) so outdoor banks
  answer the same weather as the trees; a dungeon pool sets its own slow drift,
  since indoors has no wind to answer.
- Runs before god rays (§4), so a placed cloud across the sun occludes the rays the
  same way a drawn one does.

**The mountain illusion, specifically.** The volume sits beyond the walkable rim,
straddling the distance-fog band, wrapping the silhouette terrain. The cloud hides
where the backdrop geometry ends, the distance fog grades it into the horizon, and
the two together let a small zone claim a large landform. Cheap by construction:
those rays hit far depth and the volume is a narrow shell on screen.

**Honest limitation.** Volumes are unlit media with an authored `tint` — a torch
will not illuminate the mist, because that is a per-light scattering loop this
design deliberately does not buy. The tint is chosen for the room, like every other
colour in the game. If a lit-mist moment is ever wanted, single-scatter against one
nominated light per volume is the contained follow-up, and it slots into the same
march.

Cost: worst case 8 volumes × 8 steps at half a million pixels, and the shell test
culls most rays for most volumes. Measure at the worst case in R2 and record it
here.

---

## 3. Bloom — selective, via the glow material

Thresholded bloom is the wrong tool here: nothing in the scene is HDR-bright (vertex
colours cap at 1), so a threshold either catches nothing or catches sunlit walls.
But everything that *means* to emit already shares one material — `GLOW_MATERIAL` —
and `hideGlowFromEdges` (`PostFX.ts`) already demonstrates the trick this design
turns into a feature:

- **Emitters-only pass:** render the scene into a chunky-res target with the camera
  restricted to a glow layer. Cost is the glow draw calls only — tens, not hundreds
  — because three culls by layer while building the render list. (The plan said to
  do this by hiding `ART_MATERIAL`, the exact inverse of the edge-detector trick.
  A layer turned out cleaner: it excludes the sky dome as well, which the material
  flag does not, and it is one call on the camera rather than a flag on each of the
  two shared materials plus a handle on the sky.)
- **It borrows the scene's depth buffer**, and this is the detail the plan missed.
  Rendered against black with no opaque geometry in the pass, a lantern inside a hut
  has nothing to occlude it and blooms through the wall. Binding the depth texture
  the colour pass already filled fixes it exactly — `GLOW_MATERIAL` is already
  `depthTest: true, depthWrite: false` — and the pass therefore clears colour only,
  since the upscale still needs that depth for its edge lines.
- **Blur:** dual-Kawase (or a 3-level mip chain), down and up, all at chunky
  resolution and below. Six or eight fullscreen passes over tiny targets.
- **Composite:** additive onto the scene colour, before `OutputPass`, in linear light
  — which is the correct place physically and puts the glow falloff through the tone
  map and the halftone like any other light.

The payoff scales with the day/night system: bloom at noon is nearly invisible, and at
dusk every lantern, window and forge blooms because those are the only things in the
emitters pass. No threshold tuning, ever.

Settings: `bloom: { strength, radius }`; one toggle.

---

## 4. God rays — screen-space, anchored to the real sun

The sun disc is drawn analytically in the sky shader and aimed from the actual
`DirectionalLight` direction (`Sky.aimAt`, fed by `PostFX.aimSun`) — so the screen
position of the light source is already a projection away, and shadows, disc and rays
agree by construction.

- **Mask:** at chunky resolution (or half), brightness of the scene colour weighted by
  angular proximity to the sun direction. Using the *rendered colour* rather than a
  pure depth test means the sky shader's own clouds occlude the rays for free — a
  cloud drawn over the disc darkens the mask exactly where it should.
- **Radial blur:** two iterated passes of 16 taps each marching toward the sun's
  screen position (equivalent to ~256 taps; the standard Sousa-style cascade).
- **Composite:** additive, in linear light, before `OutputPass`. Intensity scaled by
  `dot(viewDir, sunDir)` so rays fade smoothly as the sun leaves frame instead of
  snapping off at the screen edge, and by sun elevation once the day/night system
  exists — low golden sun is when this effect earns its place.

Cost: a mask pass and 32 taps at low resolution. Cheap enough to leave on.

---

## 5. Day / night

The largest feature here and the least shader-shaped — it is mostly a clock, a set of
authored keyframes, and the honouring of two seams the code already reserved.

- **The clock.** A global time-of-day (hours, 0–24) with a speed factor and a pause.
  It is *state*, not a preset — it must never be saved into the render settings, for
  the same reason `ZoneAir` is not.
- **Sun path.** Azimuth/elevation from time. The seam is documented and waiting:
  `PostFX.aimSun` "called once at start-up because the sun is static. When it stops
  being static this is the seam that has to move." It moves to per-frame. The shadow
  camera's position is currently a hard-coded point (`ZoneManager.ts`,
  `sun.position.set(-70, 90, 50)`); it becomes `direction × 125`, derived, so the
  documented near/far envelope keeps holding as the sun swings.
- **Shadows track in real time.** The map is already redrawn every frame
  (`Viewport.ts` — `autoUpdate` off, `needsUpdate` set once per frame in
  `PostFX.render`), so a moving sun costs *nothing additional*. No baking, no
  reduced-rate updates — the architecture already made that choice. At very low
  elevations shadows stretch across the whole ortho box; clamp the elevation the
  *shadow camera* uses to ~8° while the drawn sun continues to the horizon, which
  keeps texel density sane through the golden hour.
- **Atmosphere keyframes.** `SkySettings` already parameterises everything the sky can
  do; day/night is a table of authored keyframes — night, dawn, golden, noon — keyed
  by sun elevation and interpolated (numbers lerp, colours lerp in linear). The same
  table carries sun light colour/intensity, fill, hemisphere sky/ground, and fog —
  the fog-follows-horizon link then repaints distance haze through dusk for free.
  These are *authored looks*, tuned in the existing sky panel and captured, not a
  scattering model. (An analytic Hosek–Wilkie sky remains possible inside the same
  shader later; the keyframe table is what ships first and is probably more
  art-directable anyway.)
- **Night sky.** Stars: a hash-based sparkle mask in the sky shader, faded in below
  ~−6° sun elevation, drawn before clouds so clouds occlude them. Moon: the sun-disc
  code reused with its own direction and a dim blue-grey `DirectionalLight` at ~0.1×
  so night is not pitch black and something still casts a soft shadow.
- **Lamps.** Emissive props (candle, lantern, streetlamp, window, forge…) light on a
  dusk-to-dawn schedule. They are findable — every glow mesh shares `GLOW_MATERIAL`
  and carries its builder name — but per-prop control needs per-prop state, which one
  shared material cannot express. Options, in ascending cost: scale the shared glow's
  brightness globally (one uniform — but then the forge dims at noon too); or a
  `uLit` vertex attribute baked per prop and a registry of lamp meshes toggled at
  dusk. Decide when the feature is picked up; the global uniform is an acceptable
  first cut.
- **Interactions.** Interiors are untouched by design (`ZoneAir` already suppresses
  sky and owns fog indoors). Bloom (§3) and god rays (§4) read their moment-to-moment
  strength from sun elevation. AO is time-independent.

---

## 6. Depth of field — punctuation, not a state

Always-on DoF fights a look built on crisp edges. As a *focus event* — examining an
item, a conversation — it is well worth having.

- **API:** `postfx.focus(distanceMetres | null)`, critically damped toward the target
  so focus pulls rather than snaps. The interaction system already raycasts the
  crosshair target, so "focus on what I'm looking at" is a distance it can supply.
- **Shader:** thin-lens circle of confusion from the depth texture; gather blur at
  chunky resolution — a 12-tap poisson disc scaled by CoC, taps weighted by their own
  CoC so sharp foreground does not bleed into blurred background. Background-blur
  only in the first cut; near-field blur (foreground out of focus) doubles the
  complexity for a case the focus-event framing rarely needs.
- **Order:** after fog, before bloom, so blurred lamps still bloom.
- The quantizer turns the smooth blur gradient into stepped, dithered rings — chunky
  bokeh. This is the effect the pipeline will most visibly restyle, and it should be
  embraced rather than hidden: 12 taps at this resolution *is* the look.
- Default off; nothing enables it but a focus event.

---

## 7. Stylized water

There is water audio (`audio/models/water.ts`), reeds, a cistern — and no water
surface. The design is a third shared material, standing beside `ART_MATERIAL` and
`GLOW_MATERIAL` as the second permitted exception to one-material-for-everything.

- **`WATER_MATERIAL`**, one instance, used by a `waterPlane` builder that zones place
  like any prop. Placement data (`level`, extent) lives with the zone.
- **Vertex:** 2–3 summed sines (Gerstner-lite, vertical displacement only), phase from
  the existing `swayTime` uniform, amplitude scaled by the wind field — the same gust
  that bends the reeds roughens the pond, which is the wind system's whole thesis
  extended to water.
- **Fragment, in order of what sells it:**
  1. **Depth-difference shading.** The water samples the scene depth texture and
     compares against its own fragment depth: small difference → shore colour and a
     foam line, large → deep colour. This is the single feature that makes stylized
     water read, and it is why water draws in a second stage (below).
  2. **Foam:** value noise (the shared chunk from §2) thresholded on the
     depth-difference band and on wave crests. Two flat colours — quantizer-friendly
     by construction.
  3. **Reflection:** fresnel-weighted mix toward a reflection colour — from SSR where
     a ray hits (§8), from the *analytic sky evaluated in the reflected direction*
     where it misses. That fallback is the quiet advantage of a procedural sky: the
     miss case of SSR, which is where every SSR implementation looks broken, here
     returns exactly the correct sky gradient at zero cost. It also means **there is
     no specular highlight anywhere in the water shader** and none is wanted: the
     sky's own sun disc and halo are in what gets reflected, so the glitter on a
     choppy pool is the wave normals catching the drawn sun — and it will follow the
     sun for free when R4 lands.
- **Draw order:** `PixelStage` renders opaques and keeps its colour+depth; water then
  draws in the effect slot, into the *next* link of the chain, with those textures
  bound as uniforms — the standard second-stage arrangement, and the R0 restructure is
  what makes the targets ours to bind. It is a link rather than the same target
  because nothing may sample the buffer it is rendering into: the pass copies the
  frame forward and draws over the copy.
- **Water is on a layer of its own, exclusively** (`WATER_LAYER`, set rather than
  enabled), which is what takes it out of the opaque pass, the normal pass and the
  shadow map in one line. Three consequences, all wanted: no outline on the water —
  the foam line is the shore line, and it is the right line to draw; no shadow from a
  surface with no thickness; and, because water is absent from the depth buffer
  altogether, **the reflection ray has nothing of its own to intersect**, which is the
  self-intersection problem most SSR implementations spend a hack on.
- **The depth test is done in the shader**, not by the hardware. The fragment has to
  sample the scene's depth anyway for the shore shading, so discarding where the scene
  is nearer costs nothing extra — and it means the target water draws into never has
  the scene's depth texture attached, so there is no read-and-write feedback on it.

---

## 8. SSR and refraction — one family, three tiers

Ordered by cost, and each usable without the ones above it.

- **Tier 1 — screen-space refraction (heat shimmer, then glass).** After opaques are
  rendered, a *distortion pass*: marker volumes (billboard quads over the forge,
  chimneys, hot machinery — glow-style no-collide geometry, one shared material
  writing into a small R8 target) lay down a distortion mask; a composite pass then
  offsets its colour-buffer reads by time-scrolled noise scaled by that mask. Heat
  shimmer is the whole of it. Glass panes are the same read with a constant
  normal-based offset plus a tint — a fourth small shared material for the handful of
  surfaces that want it (display windows, tanks). Note the existing windows are
  *emissive by design* (`builders/window.ts` documents this); glass is for new
  surfaces, not a retrofit.
- **Tier 2 — SSR for water.** *(Built with R6.)* Computed inside the water shader
  (§7), since water already has the colour and depth targets bound: reflect the view
  ray about the wave normal, march the depth buffer — 16 coarse steps, 4
  binary-refine — with the chunky-cell hash jittering the start. Hit → colour buffer
  read; miss → analytic sky. Water is near-planar and its rays leave upward, which is
  SSR's best case: short marches, high hit rate on banks and huts, and the halftone
  eats the edge artifacts that plague full-res SSR. Two details settled in the
  building: the march runs in *world* space, because the depth here is a distance and
  metres are the unit everything else is authored in; and a hit is faded out toward
  the frame edge into the sky, which is a crossfade between two correct colours
  rather than the hard cut that makes SSR obvious elsewhere.
- **Tier 3 — general SSR (wet stone, polished floors) — deliberately parked.** It
  needs per-surface roughness/mask data the vertex-colour format does not carry, and
  flat-shaded Lambert does not read specularity anyway. If rain (a Weather visual)
  ever wants wet ground, revisit; until then this tier is recorded as ruled out for
  the same reason the palette pass was — it imposes a look the art did not choose.
- Planar mirror reflections (second scene render, mirrored) are ruled out outright:
  they double draw calls, and draw calls are the documented ceiling (SCALING.md).

---

## Player options

Not every switch in the dev panel is an option for the player. The line: **an option
is something a player may reasonably want off — for performance or comfort — while
the world still reads as itself without it.** Effects that *are* the place (mist in
the bowl, the day/night cycle, water) are not options, any more than a tree is; and
effects that carry gameplay information are not options because switching one off
would switch off the information.

Three of the features in this document cross the line into the options screen,
following the existing `setDither` / `setPixelation` / `setColorblind` pattern — the
toggle layers over the preset and never overwrites tuning:

| Option | Why it is one |
|---|---|
| **GTAO** | The most measurable per-frame cost in the document; purely additive shading. Off, the world is exactly today's. |
| **Bloom** | Taste as much as performance — some players find glow bleed distracting. Off, emitters still glow (the geometry is the glow); only the bleed goes. |
| **God rays** | Same shape: additive light, real cost, nothing lost but the flourish. |

Each is one honest switch that turns the effect on and off — not a quality ladder,
not a master "effects" group that gates them behind each other.

**Groundcover** is one dropdown — off, low, medium, high, ultra — for the one option
whose cost is vertex count rather than a pass. Off is a tier and not a switch above
the tiers: it is where thinning ends, and a remembered tier held under a separate
no is two controls for one thing on screen. The rest is a quantity of world content,
named looks rather than a 0–100 dial (which an earlier version shipped, and which was
never a look anyone chose on purpose). Ultra is the authored field; every tier below
draws an even fraction of the same sampled pool, so no tier is a different style of
grass — only less of the same one. Height, width, and species stay in the type table
and the render preset.

One more crosses the line by a different door: **water motion** is an *accessibility*
option, under reduced motion beside wind sway and head bob. The water itself is not
optional and never will be — it is the place. Whether the surface moves is the same
kind of ask as whether the grass does.

Deliberately **not** options:

- **DoF** — it is an interaction mechanic, not a look. A focus pull *is* the game
  saying "this, now"; an option to disable it would be an option to receive less.
  It has a dev-panel toggle for debugging and nothing player-facing.
- **Fog volumes, day/night, water, heat shimmer** — these are the world. A dungeon
  dressed in mist is a different room without it, a mountain wrapped in cloud is a
  backdrop with a visible edge, and a player who could switch the night off has
  switched off the game's clock. Their cost is carried in the zone budgets instead,
  like any prop's.

The options wiring lands with the phase that builds each effect (R1, R3, R5), not as
a separate pass later.

---

## Implementation phases

Numbered R0–R7 — *render* phases, deliberately not the spec's Phase 0–11, which this
work sits beside rather than inside. R0 blocks everything; after it, phases are
independent unless a dependency is named, so the order past R1 can bend to whatever
the game needs next. Names are provisional throughout.

**Every phase, before it is called done, lands the same four things:** its tuning
block in `RenderSettings` (or `ZoneAir`, where the value belongs to a place), one
honest toggle layered over the preset, a folder in the debug panel, and its cost read
off the existing draw-call/frame readouts. These are not restated per phase below.
The toggle is dev-facing by default; only GTAO, bloom and god rays additionally
surface in the player options — see *Player options* above.

---

### R0 — Own the pixel stage *(infrastructure; blocks everything)*

The split described at the top of this document, and nothing else — no new visuals.

- Build `PixelStage` (chunky-res colour target at `HalfFloatType`; normal target with
  depth texture; the two-stage draw: opaques, then glow with colour/depth bound).
- Build `UpscalePass` (depth/normal edge detection lifted from
  `RenderPixelatedPass`, nearest-neighbour blit).
- Rewire `PostFX` onto them; retire `RenderPixelatedPass`. The sway patch on the
  normal material and the `hideGlowFromEdges` hook move across unchanged.
- The effect slot exists but is empty: the pass chain must run with zero effect
  passes in it.

**Exit criteria.** Output is visually indistinguishable from today across the
galleries, the village, and an interior — same settings, same presets, same edge
outlines on swaying plants (the sway-patch regression is the one to watch; it has
bitten before, see `PostFX.ts`). Draw-call and frame readouts match today's within
noise. Every existing toggle (dither, pixelation, colorblind) still works. `npm run
check` passes untouched.

**Status: built** — `src/engine/PixelStage.ts`, wired in `PostFX`; the edge
shader is lifted verbatim so the maths matches. Visual indistinguishability and
the readout comparison were signed off in the browser alongside R2 and R3.

**Amended during R2/R3: the outline is drawn before the effect slot, not after
it.** The upstream pass fused edge detection to the upscale, so the outline ran
last, over the finished chain — and a *normal* edge brightens by
`×(1 + normalEdgeStrength)`. Applied last, that multiplies whatever is standing in
front of the geometry rather than the geometry itself: pale fog came back 1.5× and
clipped to white, and a lamp's bloom halo arrived wearing an outline of its own.
Both look like bugs in the new effects and neither is; it is one multiply happening
a stage too late.

So `PixelStage` now runs the edge shader onto the chunky colour and the upscale is a
bare nearest blit. Mist covers an outline exactly as it covers the wall the outline
is on, and a halo washes its own out — with no fog-aware or bloom-aware special case
in either effect.

Cheaper than it sounds, and *less* of a visual change than it sounds:

- One extra fullscreen pass at chunky resolution, ~9 texture reads over half a
  million pixels, and the upscale gets simpler by exactly what the edge pass gained.
- Skipped entirely when both edge strengths are zero.
- **With multiplicative effects the picture is unchanged, exactly.** GTAO's composite
  is a pure multiply and multiplication commutes: `colour × ao × edge` and
  `colour × edge × ao` are the same number. The output only moves where an effect
  *adds* light or veils it — which is the case being fixed.

### R1 — GTAO *(wants R0; first because it pays the most, everywhere, immediately)*

§1 in full: the horizon-march pass, the 3×3 depth-aware blur, the fog-faded
composite. Nothing downstream depends on it — it is first purely on value.

**Exit criteria.** Props visibly seated (the stump/rock scatter and interior corners
are the reference views); no halo around swaying foliage against the sky; toggled
off, output matches R0 exactly; frame cost measured and recorded here.

**Status: built** — `src/engine/GTAO.ts`: 4 slices × 6 steps each way (48 taps),
**interleaved gradient noise** rotation, a per-axis reach with squared step
spacing, samples read off texel centres and weighed against the tangent plane,
two 3×3 depth-aware blurs both one texel apart, composite faded by the zone's
actual fog (smoothstep, matching the material fog exactly).
`ao: { strength, radius }` in `RenderSettings`, dev-panel folder, and the player
option ("ambient occlusion", Video tab) all landed.

Ten notes for anyone tuning this, all learned by getting them wrong:

- **A sample on the surface's own plane is not an occluder, and the horizon is a
  maximum.** So noise in a near-tangent reading can only push the horizon up,
  never down, and the bias accumulates: an *open, unoccluded* floor collects a
  band of darkening that grows toward the horizon and shimmers, because the noise
  is keyed to the per-pixel rotation. On a bare plane, where the true answer is
  exactly 1 everywhere, the pre-fix march wrote 0.3% at 21 m and 5.4%±3.2 at
  65 m. Weighting each sample by how far it stands off the tangent plane —
  `smoothstep(0, 0.1, dot(D, N)/|D|)`, one dot product — takes that to 0.0%±0.0
  at every distance and costs nothing on real geometry.
- **Reconstruct a sample from the texel centre its depth came from.** The depth
  fetch is nearest, so it *is* a texel centre; feeding the un-snapped uv back
  through `uProjInverse` builds a point on no surface at all — that texel's depth
  along a ray beside it, displaced sideways off the plane, which is precisely
  what a spurious occluder looks like.
- **Where the taps land beats how many there are — but the radial step count is
  the exception, and it is the only thing here worth paying taps for.** Raising
  the *slice* count does nothing *for this case*: the analytic arc is smooth in
  angle, so on a floor seen from standing distance, 2 slices and 4 are within
  3% on every noise figure — but see the last note before believing that
  settles slices. What the grain
  is actually made of is the march: the radius covers 50–190 texels at ordinary
  distances, evenly spread steps leave gaps of tens of texels, and whether a
  thin occluder falls in a gap is decided by that pixel's jitter — a table leg
  is 6 cm and a chair leg 4, which is a handful of texels against those gaps,
  which is why an interior with furniture in it is the worst case in the game
  for this and the open countryside is not. Squaring the step parameter costs
  nothing and cuts the deviation from a converged estimate by 40% at 1.2 m, 49%
  at 4 m and 13% at 9 m. **It is only safe with the tangent bias above.**
  Without it, crowding taps inward puts them inside the falloff radius on a
  grazing floor, and the bias they feed the maximum turns that 5% band into
  45%. Going 4 → 6 steps then buys a further 22% in the room and 16% around
  crates while *deepening* the shadow toward truth (deepest 1%: 0.656 → 0.587
  against a converged 0.473) and lowering the structure ratio with it — the
  only lever measured that improves noise and accuracy together. It costs 8
  taps of 34, so about a quarter of the pass.
- **The march reach is per axis, not one number.** UV is not isotropic. One
  radius for both axes marches a circle in UV, which is an ellipse in the world
  reaching `aspect` further sideways than up — 1.78× at 16:9, where the falloff
  then throws away most of what the sideways taps found, and the slice-plane
  maths disagrees with where the samples actually went. Scaling by
  `projectionMatrix[0][0]` and `[1][1]` separately fixes both.
- **The rotation must be IGN, not a hash.** White noise gives neighbouring pixels
  uncorrelated estimates, and a small blur cannot reconstruct anything from that —
  the AO reads as grain over every shaded surface. IGN makes neighbours
  complementary, so a 3×3 neighbourhood contains a full rotation set.
- **Both blur passes stay one texel apart, and rms is the wrong way to judge
  that.** Two 3×3 boxes in series are a triangle across five texels. Widening
  the second pass to three texels makes the pair a *flat* nine-tap box — and
  that measures beautifully and looks awful. It cut the rms deviation in half
  (0.0111 → 0.0058 in a room with a table and a chair, the 1-in-100 tail from
  0.51 to 0.27 quantization levels) and shipped obvious striping, because a
  flat kernel does not reduce noise so much as *correlate* it: the residual
  stops being fine grain and becomes plateaus with steps between them, which is
  the one thing a 64-level quantizer will happily draw a hard edge along.
  Measure the residual at several scales and it is plain — fine grain averages
  away when downsampled, structure does not. Against `rms(8)/rms(1)`, the
  triangle sits at 0.47 and the flat box at 0.68. **Judge any change to this
  blur on that ratio, not on the rms.**
- **A quieter setting is usually just less AO.** Shrinking the radius to 0.5 m,
  swapping the quadratic falloff for a linear one, or respending the same 16
  taps as 4 slices × 2 steps instead of 2 × 4 — each roughly halves the
  measured noise, and each roughly halves the darkening with it. Matched on how
  much they actually shade, every falloff shape and radius tried lands within
  about 10% of the others. The noise is proportional to the effect being asked
  for, so before believing any improvement here, check what it did to the
  darkening in the same breath.
- **The blur's depth tolerance must be relative to distance.** An absolute
  metres-based threshold rejects every neighbour on a floor seen at a grazing
  angle — the blur switches itself off precisely on the surface the player looks
  at most, leaving raw noise there. Relative, the exact value barely matters:
  0.02 to 0.08 moves the residual noise by 5%.
- **The regime decides which knob matters, so measure the regime the complaint
  came from — and look at a picture, not only at numbers.** Every floor crop
  from standing distance said radial steps were the one lever worth paying for,
  and every one was true of floors — while the artifact that survived four
  rounds of tuning sat on none of them: a chair seat close to the camera with
  the table top a hand-span above it, dark enough that each quantization level
  is at its most visible. There, occluders stand at every distance in every
  direction and *direction* is most of the variance — which way a slice points
  decides whether the table is seen at all — so 4 slices × 6 steps cuts the
  residual 39% (p99 0.45 → 0.27 levels) with the expected shading unchanged,
  where more steps deepen the shading as they quiet it, and a third blur pass
  raises the structure ratio to 0.51, which is the striping direction. The
  harness renders the whole pipeline to a PNG (`AO_IMAGE`, the seat scene)
  because both scalar columns had already signed off on pictures that looked
  wrong; judge any change here with eyes first and numbers second.
- **Normalise against the unoccluded response, not the slice count.** An open
  slice integrates to `cos(n) + n·sin(n)`, not to 1 — equal to 1 only when the
  surface squarely faces the camera, and rising above it as the surface tilts.
  Dividing by `SLICES` therefore darkens in proportion to viewing obliquity: 3%
  at 40° off the view axis, 7% at 50°. That sounds negligible and is not, because
  the contours of the error are *circles centred on the optical axis* and the
  16-level quantizer turns a smooth 3% ramp into one hard ring that slides across
  a near wall as the camera turns. Worth stating plainly: this is a normalisation
  error, not a sampling one, so raising the slice count does nothing for it —
  2 slices and 256 slices are wrong by exactly the same amount.

Looked at and signed off. Still owed is a *number*: the frame cost for this
section, read off the existing readout. That is a measurement, not a judgement —
see the note at the end of R3.

### R2 — Fog volumes *(wants R0)*

§2 in full: the `FogVolume` registry, the raymarch pass, per-volume drift, the
8-volume uniform array. Test placements only — real dressing waits for the zones
that want it.

**Exit criteria.** Three rough fixtures prove the three uses: a mist pool that a
pillar stands in and the player walks through; a bank that wraps a silhouette and
grades into the distance fog; a plume that drifts with the wind. Zone crossings swap
the volume set at full black like fog today; the 8-volume worst case is measured and
recorded in §2.

**Status: built** — `src/engine/FogVolumes.ts`, third in the effect chain after
GTAO. Ellipsoid and box, 8 steps, IGN-offset ray starts, front-to-back accumulation
with early-out, depth-tested against the scene. `ZoneDefinition.fogVolumes` →
`ZoneManager` → `PostFX.setEnvironment`, swapped at full black with the air.
Dev-panel toggle only, per *Player options*.

The three fixtures live in a **Fog Showcase** rather than in real zones — a pillar in
a pool, a ridge with its ends deliberately showing under a bank, and a chimney with
a plume. Its door stands in the general props hall eight metres west of the Text
Showcase's, air belonging to no setting for the same reason lettering does not. Real
dressing still waits for the zones that want it.

Two notes for anyone tuning this:

- **A volume needs geometry to be judged against.** Mist with nothing in it is a
  grey patch, and the depth test — the thing that separates this from a decal — is
  only visible when something is half in it. That is why each station in the gallery
  is a fixture *and* a volume, and why the ridge's ends are left showing.
- **`softness` is not a detail.** Below about 0.5 an ellipsoid reads as a balloon:
  you can see the shape of the volume, which is the one thing a volume must never
  show. The gallery's three sit at 0.75, 0.85 and 0.9.

All three fixtures looked at and signed off. Still owed is the 8-volume worst-case
cost for §2 — a measurement, not a judgement.

### R3 — Bloom *(wants R0)*

§3 in full: the emitters-only pass via the two shared-material visibility flags, the
dual-Kawase chain, the additive linear-light composite.

**Exit criteria.** Lanterns, windows and the forge bloom; nothing else does — a
sunlit wall must not. The emitters pass costs only the glow draw calls (verify in the
readout). Toggled off, output matches R1/R2 exactly.

**Status: built** — `src/engine/Bloom.ts`, last in the effect chain. Emitters pass on
`GLOW_LAYER` (set in `finishGlow`, the one place a glow mesh is made) against the
scene's own depth; dual-Kawase, three levels down and two back up; additive composite
in linear light. `bloom: { strength, radius }` in `RenderSettings`, dev-panel folder,
and the player option ("bloom", Video tab) all landed. Default strength 0.55 rather
than 1 — every emitter in this game is a small flame against a dim surround, and at
full strength a street lamp haloes half a hut.

**Bloom flickered as the camera moved**, and it took two fixes, both in the blur
rather than in the emitters pass. Worth stating together, because this world is
close to the worst case for a bloom chain: its lights are single-texel flames, and
by the third level down a flame *is* one texel.

- **Taps must sit half a texel off centre, not a whole one.** At a whole texel every
  bilinear tap lands dead on a texel centre and interpolates nothing, so each tap
  returns one texel — and since the target is half the size, most source texels are
  never read at all. An emitter's contribution jumps as it crosses a boundary and
  the halo pulses in step with the camera. At half a texel each tap sits at a corner
  between four texels and comes back as their average.
- **Karis average on the first level.** A blur is a mean and a mean is dominated by
  its largest term, so one texel far brighter than its neighbours decides every
  downsample it survives into — and whether it survives depends on where it lands on
  the next grid down. Weighting each tap by `1/(1 + luma)` lets the neighbourhood
  decide instead of the outlier. First level only; after it the fireflies are already
  averaged away and repeating it would just flatten the falloff.

Note the two interact with the strength knob: the Karis average deliberately takes
energy out of exactly the small bright emitters this game is made of, so a strength
tuned before it was in place will read differently after.

Three further notes, all about state that is shared and easy to leave dirty:

- **Layers are a global namespace addressed by bare integers.** The emitters pass
  took layer 1 for the glow. Layer 1 was already the *collision* layer, which
  `markCollidable` enables and the collider's octree filters on — so every flame,
  lamp shaft and lit window in the game became solid. Nothing failed to compile and
  nothing near bloom misbehaved; what happened was four portal arrivals reporting
  `ARRIVES INSIDE GEOMETRY` in three zones with no emitters involved, because a
  lantern beside a door is a wall you cannot see. The fix is `src/layers.ts`, which
  now hands out every layer number, so picking one means reading the list.
- **The emitters pass must clear colour only.** An automatic clear takes the depth
  buffer with it, and that buffer is the stage's — the upscale still has edge lines
  to draw from it and the fog volumes have already marched against it.
- **A depth texture assigned after a target's first render does nothing.** Three
  builds the framebuffer once and never revisits its attachments, so the field is set
  and the attachment is not: bloom goes on ignoring depth, lamps go on shining
  through walls, and nothing anywhere reports a problem. Disposing the target forces
  the rebuild.

Looked at and signed off, and the sign-off is what produced both fixes above: the
flicker and the strength were reported from the running game, not found here.
Strength settled at 0.28.

**What is left across R0–R3 is measurement, not looking.** Three numbers, all read
off the draw-call and frame readouts that already exist: R1's frame cost, R2's
8-volume worst case, and the emitters pass's draw-call count. They are worth
writing down because the phases after this one are budgeted against them, and
nobody can judge a budget by eye.

### R4 — Day/night *(independent of R0; the largest phase — sub-phased)*

Mostly clock and keyframes, not shader work, so it can proceed in parallel with
R1–R3. Each sub-phase is shippable alone.

- **R4a — clock and sun path.** Time-of-day state (not preset), speed/pause, sun
  azimuth/elevation from time; `aimSun` goes per-frame; shadow-camera position
  derived from direction (with the ~8° elevation clamp for the map, per §5).
  *Exit:* scrubbing time in the panel swings sun, disc and shadows together; shadow
  contact stays tight through golden hour; frame cost unchanged (the map already
  redraws every frame).
- **R4b — atmosphere keyframes.** The elevation-keyed table of `SkySettings` + light
  + fog looks (night, dawn, golden, noon), interpolated; authored by tuning the
  existing sky panel and capturing. *Exit:* a full scrubbed cycle with no visible
  snap; dusk repaints the distance haze via the existing fog link; the four
  keyframes are Phillip's to tune — the phase delivers the machinery and placeholder
  values.
- **R4c — night sky.** Stars faded in below ~−6°, moon disc reusing the sun-disc
  code, dim moon `DirectionalLight`. *Exit:* night reads as night and the player can
  still see; clouds occlude stars.
- **R4d — lamps.** Dusk-to-dawn schedule; first cut is the global glow-brightness
  uniform, with the per-prop `uLit` attribute recorded as the follow-up (§5 has the
  trade). *Exit:* the village lights itself at dusk; with R3 landed, it blooms.

### R5 — God rays *(wants R0; worth doing after R4)*

§4 in full. Technically only needs R0, but the effect earns its cost at a low golden
sun, which does not exist until R4a/R4b.

**Exit criteria.** Rays through the village at golden hour, occluded by drawn
clouds; smooth fade as the sun leaves frame — no edge snap; off at night and near
noon by the elevation curve, not by a special case.

### R6 — Water *(wants R0; needs a place to put a pond)*

§7 plus §8 tier 2: `WATER_MATERIAL`, the `waterPlane` builder, the second-stage draw,
depth-difference shore shading, foam, fresnel with SSR-into-analytic-sky reflection.
The content question — which zone gets water, and what it is in the fiction — is
Phillip's; the phase can land against a bare test plane in a gallery, built only as
far as the checks need.

**Exit criteria.** A gallery pond: shore line reads, foam sits on banks and crests,
reflection shows huts where SSR hits and correct sky where it misses, wind roughens
the surface in the same gusts that bend the reeds. Water is `noCollide` and
`world-check`'s prop-grounding and interior-leak checks still pass.

**Status: built** — `src/art/water.ts` (the material and the plane builder),
`src/engine/Water.ts` (the pass), `src/debug/WaterShowcase.ts` (the room). The pass
sits between GTAO and the fog volumes: after AO so the bed showing through shallow
water is a shaded bed, before fog so mist hangs over a pond rather than under it,
before bloom so a lamp's halo lies over the surface. `water: { waves, reflections }`
in `RenderSettings` and a dev-panel folder; **no player option**, by the rule above —
a pond is part of the place.

Three decisions worth keeping written down, because each replaced an obvious
alternative that does not work here:

- **One material, per-vertex variation.** A still pool and a wind-whipped one differ
  by an `aChop` attribute, exactly as species stiffness differs by `SWAY_ATTRIBUTE` —
  so the Water Showcase's four pools are four numbers rather than four materials.
  Colour stays global: every body of water in the game is the same water, which is the
  call `ART_MATERIAL` already makes about surfaces.
- **Flow is a second attribute, `aFlow`, and that is what buys the corner.** A pond
  answers the wind; a race goes somewhere, at its own speed, and the flow velocity
  rotates the wave trains, adds itself to their phase speed, and carries the surface
  noise along with it. Held per *vertex* rather than as a uniform because a uniform
  cannot turn: the L-shaped channel is one plane whose flow field rotates through the
  elbow, and the surface pattern turns with it. The constraint on that is worth
  stating — wave *phase* depends on flow direction, so a flow field that turns
  sharply shears the height field between neighbouring vertices. Keep the turn gentle
  or the chop low. The noise shears cleanly at any rate, and the noise is most of what
  reads as flow.
- **Plain summed sines, not Gerstner.** Gerstner looks better in a screenshot and
  needs a finite difference or a second evaluation for its normal. The derivative of a
  sine is a cosine, and the surface normal is most of what water looks like — so the
  slope is exact for free, and the fine detail that Gerstner would have bought is
  bought more cheaply as a normal perturbation in the fragment shader.
- **The march is in world space.** The depth texture is read as a *distance* (the
  same unprojection the fog volumes use), so a metre-sized stride is expressible and
  the hit-acceptance band is in metres — the only unit anything else in the file is
  authored in. Stride grows geometrically to reach ~50 m in 16 steps, then four
  halvings refine. Hits fade out toward the frame edge, and what they fade *into* is
  the analytic sky — a crossfade between two right answers rather than between an
  answer and a hole.

**The pass must not run in a zone with no water**, because it costs a scene-graph
walk. Which zones those are is *observed* rather than declared — `waterPlane` marks
what it builds and `Zone.hasWater` counts them on the one traversal that already
happens at build. A `water: true` on the zone definition would be a second statement
of the same fact, and the two would eventually disagree: a pond moved out leaves a
flag that costs a walk a frame forever, and one added without the flag never draws.

Two things the shader shares rather than copies, both for the same reason two copies
of a number drift: `windUniforms`, so the gust that bends the reeds is the gust that
roughens the pond; and `skyUniforms` plus a `skyColour()` chunk lifted out of the sky
dome's `main` unchanged, so a reflection cannot part company with the sky it is
reflecting. That extraction is the only edit to `Sky.ts` and moves no arithmetic.

**Verified headless**, which for once is possible: a throwaway probe compiled the
material and drew it under SwiftShader with a wall standing in the water. Across four
cases — mirror-still, full chop, a straight race at 2.5 m/s, and a turning flow field
— 3.3–3.6k water pixels carried the wall's colour with the march on and exactly zero
with it off, with no shader log and no NaN in the alpha. That is the one part of this
that cannot be judged by looking, because a plausible-looking reflection and a correct
one are the same picture. Everything else here wants eyes.

**Three things the room found that the probe could not**, all reported from the
running game and all worth keeping written down, because each is a class of bug rather
than a number:

- **Anything hung over water owes a clearance sum.** The jetty's boards were 30 cm
  thick, putting their underside 10 cm above the surface — and wave crests reach
  8.5 cm. The shader's depth test has 2 cm of slack, so along the whole strip under
  the overhang the water flickered in and out. It reads exactly like z-fighting and
  there is no depth buffer involved. Boards are 15 cm now; the underside clears a
  full-amplitude crest by eight times the slack.
- **Water seen from below is a different shader, not the same one.** Wade in and
  every term inverts at once: `dot(normal, view)` goes negative and clamps, so fresnel
  returns a flat 1 and the surface becomes a total mirror; the reflected ray is forced
  back above the horizon by the guard that keeps it out of the ground; and the column
  thickness is measured to the *sky*, so the water reads as infinitely deep. An opaque
  warped ceiling with no sky in it. **The first fix overshot** — a faint tint over
  whatever was behind, which at 18 per cent is no surface at all, and swimming under
  it looked like swimming under nothing. The back face is now built properly, and it
  is one of the few things in optics that is both famous and cheap: **Snell's window**
  (light from the whole sky reaches an eye in water only through a cone about 49°
  wide; the constant is `sqrt(1 - 1/1.333²)` = 0.661) ringed by **total internal
  reflection**, which is the same screen-space march pointed *down* at the bed instead
  of up at the sky. A bright disc of sky in a mirror of the bottom, rippling with the
  same normal the top side uses. Reflections from below are **absorbed with
  distance**, which the top side is not: a ray leaving the surface upward travels
  through air and loses nothing, while one reflected downward is in water the whole
  way — and without that, grazing TIR marches twenty metres along the underside and
  returns a crisp picture of bright sand, which is the one thing an underwater
  ceiling never looks like.
- **The volume is a separate pass** (`engine/Underwater.ts`). Water shading runs on
  the pixels a water plane covers; being *under* the water runs on every pixel in the
  frame, because everything you can see is now being seen through it. Beer-Lambert
  murk against the scene depth is nearly the whole effect — a diver sees their hand
  and not the far end of the pool — with a flat cast, a dimming and a two-pixel
  wobble on top. Enabled per frame from the camera's depth below the nearest surface,
  ramped over the first 35 cm so a bobbing head at the waterline does not strobe the
  whole screen.

  **One pixel in the frame is exempt and has to ask for it.** The depth buffer has no
  water in it, so where you are looking up through the ceiling the depth is whatever
  is *beyond* it — the sky, at the far plane — and murk by distance would dissolve the
  surface above your head. The water shader writes alpha 0 on its back face to mark
  those pixels; nothing else in the pipeline touches alpha.
- **Two crossed sine trains are a grid, and a threshold on them is a lattice.** Crest
  foam put a white speck at every node, which slid across the pool as a repeating
  pattern rather than as water breaking. The threshold is now lowered by a drifting
  noise field instead of being constant — foam is possible where the noise is high and
  even there only the tallest crests reach it.
- **An effect nobody can see the cause of reads as a bug.** A submerged sill across a
  race foams into a bright bar, exactly as intended — and then hides under the very
  foam it is causing, leaving a line painted across the water for no visible reason.
  It is a weir now: abutments at both ends stand clear of the surface, so the white
  water is plainly the gap in a structure. The same rule caught the jetty standing in
  the shore pool, and it is worth stating generally — in a room built to demonstrate
  an effect, the *cause* has to be as visible as the effect.

**Advected noise moves; streaked noise flows.** The first cut carried isotropic noise
downstream, and it read as texture sliding about — nothing in the pattern said which
way. Sampling that noise in a frame *squeezed along the flow* stretches every feature
out along it, and what comes back is streaklines, which is the shape water draws on
itself. Three things fall out of it for free:

- The stretch scales with speed, so a slow channel is faintly combed and a fast one is
  drawn in long lines — a speed cue with nothing else different between them.
- Still water gets a stretch of exactly one, so a pond is never combed downwind.
- **It is the whole answer to a bend.** The frame is built from a varying, so it
  rotates across the surface exactly as the flow does, and the streaks curve round the
  corner because they are drawn in the water's frame rather than the world's. A height
  field cannot do this: wave phase is measured from the world origin, so a direction
  changing by a few degrees between neighbouring vertices moves the phase by whole
  radians and the trains decorrelate. The corner therefore runs at low chop and lets
  the streaklines carry the turn. Flow speed also varies across the sweep — faster
  outside, slower inside — which is most of what makes a bend read as a bend rather
  than as a channel that happens to point somewhere else.

**Two rooms, and the second one is the cost.** The Water Showcase is a bench — five
basins and five races, each sized to the one claim it settles, and no view in it is
more than a third water. Water Showcase 2 is a hundred and seventy metres of open
coast with the horizon most of the way up the frame: nearly every pixel is water,
nearly every one of them marches (a grazing angle is where fresnel is high, so the
reflection is *not* skipped), and the sea is a single 126k-triangle draw call. Fog is
pushed out to 300 m rather than hiding it. If this pass costs frames anywhere, it
costs them there.

**Water motion is an accessibility option**, under reduced motion beside wind sway
and head bob. Not a video option: a pond is part of the place, but whether it *moves*
is the same kind of ask as whether the grass does. It has its own uniform rather than
riding on `swayAmount`, so that turning wind sway off does not silently stop the ponds
and leave the water switch doing nothing. It stops the waves **and the noise scroll**
together — a waterline undulating around an otherwise dead pond is precisely what
somebody turning the option on is asking to be rid of.

### R7 — Garnish *(each independent; any time after its named parent)*

Two small items, in either order, neither blocking anything:

- **Heat shimmer / refraction** (§8 tier 1, wants R0) — distortion markers over the
  forge and chimneys, R8 mask target, offset composite. Glass panes only if and when
  a prop wants them. *Exit:* the forge shimmers; the effect is invisible in the
  readout at village scale.
- **DoF** (§6, wants R0) — `postfx.focus(distance | null)`, damped, background-only
  CoC gather. *Exit:* focusing on a prop blurs the world behind it and releases
  cleanly; default state is off and stays off.

### Dependency summary

```
R0 ──► R1 (GTAO)
  ├──► R2 (fog volumes)
  ├──► R3 (bloom)
  ├──► R5 (god rays) ◄─ value gated on R4
  ├──► R6 (water + SSR)
  └──► R7 shimmer, DoF

R4 (day/night) — independent; R4a → R4b → R4c → R4d
```

---

# Materials — surfaces that answer light

The surface roadmap: metallic sheen, glint, roughness, anisotropy,
velvet, iridescence, transmission, refraction, subsurface scattering — the family of
things a physically-based renderer calls material parameters, worked out against a
pipeline that is deliberately not a physically-based renderer.

Nothing here is committed work. Everything is designed far enough that starting it is
a matter of doing, not deciding. Names are provisional throughout.

The use cases this was written against: gilded objects, polished metal, chrome, silk,
velvet, crystals, bubbles, polished marble.

---

## The ground rules, and what they do to this feature

The constraints come from the architecture, and every one of them turns out to
*shape* the design rather than block it.

1. **One shared material, one draw call per prop.** Everything the art kit builds is
   merged geometry on `ART_MATERIAL` (`art/assemble.ts`). So a material parameter can
   never be a uniform — a uniform would mean a material per finish and a draw call
   per part. Parameters are **per-vertex attributes baked from `Part`**, exactly as
   sway, wear and detail already are. This is the load-bearing decision and it is
   already made three times over; this document just makes it a fourth time.

2. **Flat shading.** The normal is per facet, so a specular highlight is per facet:
   a curved goblet does not carry a smooth hotspot, it carries facets that catch the
   sun whole and let it go whole as the camera moves. That is not a compromise — it
   is the entire low-poly-gem aesthetic, and it is what makes specularity *work* in
   this art style where a smooth PBR highlight would look pasted on. The design
   leans on it everywhere below.

3. **No texture assets, no environment maps.** The reflection environment is the
   **analytic sky** — `skyColour(direction)` in `SKY_GLSL`, already exported and
   already proven as exactly this by the water shader, whose SSR misses fall back to
   it. A metal surface outdoors reflects the real sky, sun disc and clouds included,
   for the cost of evaluating a gradient. Indoors (`ZoneAir.sky` false) the fallback
   is the hemisphere-light pair evaluated in the reflected direction — a two-colour
   gradient, which is honestly what a dim interior reflects. When day/night (R4)
   lands, every reflection in the game follows the sun for free, because
   `skyUniforms` is shared rather than copied — the water shader's argument, verbatim.

4. **The quantizer is downstream and it is a friend.** Smooth specular gradients
   band; the halftone resolves them into screen-tone, which is what it is for. And
   the palette doctrine (`art/palette.ts`) — per-channel quantization preserves *hue*
   differences and collapses brightness-only ones — is a gift to exactly one feature
   here: iridescence is a hue play, and hue is what survives the pipeline best.

5. **No temporal accumulation.** A glint may never be frame-random. Sparkle is
   spatially hashed in object space and moves only because the camera or the sun
   moved — which is what real glitter does anyway.

6. **The opaque pass cannot read the scene.** Nothing can sample the buffer it is
   rendering into, so *transmission and refraction cannot live in `ART_MATERIAL`*.
   They live where water lives: a shared material drawn in the effect chain with the
   opaque colour and depth bound as textures. Water is the complete precedent — the
   layer trick, the pass gating, the hand depth-test, all of it transfers.

Those constraints split the work into three tracks:

```
Track A — the finish stage      opaque surfaces: metal, gilt, silk, velvet,
          (on ART_MATERIAL)     marble, glint, iridescent shell, SSS
Track B — the transmissive      crystals, glass, bubbles — drawn in the
          material              effect chain, like water
Track C — general SSR           mirror chrome, reflective floors — the
          (parked tier, now     upgrade path, off until a prop wants it
          unblocked)
```

---

## Track A — the finish stage on the shared material

### Where it hooks

The sway → wear → detail chain composes by wrapping `onBeforeCompile`
(`art/sway.ts`, bottom of `patchArtMaterial`). The finish stage joins that chain —
but it anchors in a **different part of the shader**. Wear and detail rewrite
`diffuseColor` in the colour chunks; finish rewrites the *lighting* chunks, which run
after them and consume their result. The two compose with no ordering subtlety:
colour stages decide what the surface is, the finish stage decides how it answers
light, and a wear patch that turned gilt to rust is automatically rust to the
lighting too (plus one explicit hand-off, below).

Concretely: `MeshLambertMaterial` computes its lighting per fragment through three's
lights loop. `lights_fragment_begin` folds the **shadow factor into
`directLight.color` before calling `RE_Direct`** — so a custom `RE_Direct` that adds
a specular lobe gets sun shadows for free, with no shadow-map code of its own. The
finish stage therefore:

- replaces the Lambert BRDF chunk with one that computes Lambert diffuse **plus** a
  specular lobe weighted by the per-vertex parameters — zero parameters yields
  bit-identical Lambert;
- appends an indirect-specular term after the lights loop: `skyColour(reflect(V, N))`
  outdoors, the hemisphere gradient indoors, weighted by metallic and blurred by
  roughness (see below);
- keeps the depth and normal materials untouched — finish is colour-stage work only,
  like weathering. The shadow pass, the edge pass and `check:art`'s geometry checks
  never see it.

`customProgramCacheKey` becomes `'sway-wear-detail-finish'`, and the same
default-attribute-values lesson all three prior patches record applies: a geometry
that carries no finish attribute must read zero, or the terrain glints with whatever
the last prop left in the slot.

### The data: `Part.finish`, a named table, two packed attributes

Following `FLEX` and the palette — named by material, not by parameter soup:

```ts
// art/finish.ts — names are placeholders, Phillip's to replace
export const FINISHES = {
  gilt:     { metallic: 1.0, roughness: 0.35, glint: 0.6 },
  polished: { metallic: 0.9, roughness: 0.15 },
  chrome:   { metallic: 1.0, roughness: 0.02 },
  silk:     { metallic: 0.0, roughness: 0.4, anisotropy: 0.8, sheen: 0.35 },
  velvet:   { sheen: 1.0, roughness: 0.9 },
  marble:   { metallic: 0.15, roughness: 0.2, translucency: 0.5 },
  shell:    { metallic: 0.6, roughness: 0.3, iridescence: 0.8 },
  waxen:    { roughness: 0.5, translucency: 0.8 },
} as const;
```

A `Part` says `finish: 'gilt'` (or a raw object, for the one-off), plus optionally
`grain` — a direction or a function of position, for anisotropy, exactly the shape
`sway` and `wear` already take. `assemble` bakes the table entry into **two
normalized-Uint8 vec4 attributes** (~`aFinish`: metallic, roughness, sheen,
iridescence; ~`aGrain`: oct-encoded grain axis ×2, anisotropy, translucency — glint
packs wherever a lane is spare; exact packing is build-time detail). Every parameter
is a 0–1 knob, so 1/255 precision is far more than any of them can use.

**Why Uint8 and not Float32: the merge makes everything pay.** The kit shares one
attribute set, so every vertex in the game carries these whether it glints or not.
The world is ~870k triangles ≈ 2.6M unindexed vertices; two Uint8 vec4s cost
8 bytes/vertex ≈ **21 MB** GPU memory total, where Float32 would cost 84 MB. (For
scale: the existing attribute set is ~72 bytes/vertex. This is a +11% memory ask, and
it is the single largest fixed cost in this document.)

The fragment early-out is the wear stage's: `if (all zero) → pure Lambert`, so the
matte 95% of the world pays one attribute fetch and a branch. Cheap surfaces stay
cheap; only finished fragments pay for their finish.

### The terms, each with its cost

All costs are per *finished* fragment, at chunky resolution (~0.5M pixels total
frame, of which finished surfaces are normally a small fraction).

**Specular + metallic + roughness** — the foundation everything else modifies. One
GGX (or Blinn, decided by eye in the gallery) lobe per light from the lights loop —
sun and fill, both already shadowed. Metallic tints the lobe by the surface's own
vertex colour and dims the diffuse; roughness widens the lobe and blurs the
environment term by mixing `skyColour(R)` toward the sky's average (the sky is
procedural, so its "blurred mip" is just its own gradient with the sun halo widened —
a couple of extra ALU, not a second texture). *Cost: ~25–35 ALU + one `skyColour`
evaluation (itself ~30 ALU with clouds).* This is trivial against GTAO's 48 texture
taps. **Covers: gilded objects, bronze, polished metal, polished marble's finish.**

**Anisotropy** — silk, brushed metal, turned wood. The tangent comes from the baked
grain axis: `T = normalize(cross(grain, N))`, per facet, which for a lathe-shaped
prop with a vertical grain axis is the circumferential direction — exactly where a
silk drape or a goblet's brushed band wants its highlight stretched. Stretched-GGX
(or Kajiya-Kay, same decision-by-eye). *Cost: ~+15 ALU on top of specular.* The
per-facet tangent means the stretch jumps at facet boundaries; on cloth builders
with reasonable subdivision that reads as woven structure, which is the goal.

**Sheen** — velvet, moss-as-fabric, worn cloth. An inverted-fresnel rim term
(bright where `dot(N, V)` is low) plus a retro-reflective lift, tinted from the
vertex colour. This is the cheapest term in the document and one of the most
legible: velvet is *defined* by its edge-glow, and a rim term at chunky resolution
with the quantizer behind it reads as exactly that. *Cost: ~10 ALU.* No tangents
needed.

**Iridescence** — bubbles (their surface term), beetle-shell, oil-slick, fantasy
metals. A thin-film approximation: the specular and environment terms get a hue
rotation driven by `dot(N, V)` — grazing angles walk the hue wheel. No spectral
integral, just a cheap cosine palette (Iñigo Quílez's trick) scaled by the
iridescence knob. Per ground rule 4 this is the term the pipeline is *best* at:
hue survives per-channel quantization where brightness ramps collapse. *Cost:
~12 ALU.* On flat facets, each facet holds one hue and neighbours differ — a cut
opal look, again the aesthetic rather than a defect.

**Glint** — gilt, gem-dust, frost, the sparkle on hammered metal. Procedural
micro-facets: hash the undisplaced object-space position (the wear stage's sampling
rule, for the wear stage's reason — sparkle must not swim on a swaying banner) into
a jittered micro-normal per cell; a glint fires where that micro-normal aligns with
the half-vector within a threshold. Spatially stable — a glint sits on its spot on
the surface and fires when *you* move or the *sun* does, never at random. At chunky
resolution a glint is one bright pixel, which the halftone prints as a single dot:
about as close to a hand-placed sparkle as a shader can get. *Cost: ~20 ALU behind
its own early-out (glint knob zero skips it).*

**Subsurface scattering** — marble, wax, skin, wet jade. The honest version of SSS
needs depth maps or path length through the object; this pipeline gets the two-term
approximation that stylized games actually ship: **wrap lighting** (diffuse wraps
past the terminator by the translucency knob, softening the flat-shaded facet
boundary at the light's edge) plus a **back-light term** (`pow(dot(V, -L), k)`
tinted warm, so a candle behind an alabaster panel blooms through it). Driven per
vertex, so a statue can be waxen at its thin edges and dense at its core — the
builder states thickness the way it states wear. *Cost: ~15 ALU.* It will not do a
photoreal skin pass; it will absolutely do "this marble is not plaster", which is
the whole ask.

**The weathering hand-off** — one explicit line: where the wear noise wins and
replaces the surface colour, the finish stage also scales its parameters down.
Mechanism: the wear chunk sets a shared local (`float wearTaken`) the lighting chunk
reads. Rusted gilt goes matte; that it does is what makes the gilt read as *plating*
rather than paint.

### What Track A cannot do, stated plainly

- **No mirror image of the world.** Environment reflection is the sky (or the
  indoor gradient) — a chrome sphere reflects sun, clouds and blue, not the hut
  beside it. For most props at most sizes this is imperceptible and it is what
  every stylized game does. Where it genuinely matters (a mirror, a still shield
  wall, a polished floor), that is Track C.
- **No transmission.** A finish is opaque by construction. Crystals are Track B.

---

## Track B — the transmissive family: crystal, glass, bubble

The fourth shared material, standing beside `ART_MATERIAL`, `GLOW_MATERIAL` and
`WATER_MATERIAL` — and it is fair to say water already paid nearly every design cost
this needs, because water *is* a transmissive material with a wave generator
attached. What transfers verbatim:

- **Drawn in the effect chain**, opaque colour + depth bound as textures, because
  nothing samples the buffer it renders into (ground rule 6).
- **Its own exclusive layer** (next number in `layers.ts` — reading the list, 6),
  `layers.set` not `enable`, taking it out of the opaque pass, the normal pass and
  the shadow map in one line. No outline (the fresnel rim *is* the outline); the
  screen-space march has nothing of its own to intersect.
- **Hand depth test in the shader**, centimetre of slack, `discard` where the scene
  is nearer.
- **Pass gating by observation, not declaration**: the builder marks
  `userData` the way `waterPlane` marks `water: true`; the zone counts them on the
  build traversal it already does (`Zone.hasWater`'s pattern), and the pass costs
  nothing in a zone with no glass in it.
- **Nearest-wins sorting** through the transparent list: two crystals in line show
  the nearer one's refraction only. Honest limitation, same as water's, and at prop
  scale it is nearly unobservable.

What is new is the shading, and it is *simpler* than water's (no waves, no flow, no
foam, no underside):

- **Refraction**: `refract(V, N, 1/ior)` per facet, projected to screen, and the
  scene colour read at the offset position — offset scaled by the thickness the
  depth buffer reports behind the fragment. Flat-shaded normals mean the refracted
  image *jumps* at every facet boundary — which is precisely what a cut gem does to
  the world behind it, and it is the single feature that will sell "crystal".
  (§8 tier 1 above already sketched constant-offset glass panes; this is that
  design given real normals and real thickness.)
- **Dispersion**: three refracted reads at slightly different IOR, one per channel.
  Costs two extra texture reads on crystal pixels only, and buys the rainbow fringe
  that separates "crystal" from "glass". Worth it; a knob, so a plain window pane
  sets it to zero.
- **Beer–Lambert tint** by the path length behind the surface — thin edges pale,
  thick cores deep, from the depth difference that is already in hand. The exact
  mechanism water uses for its column, reused.
- **Fresnel** between the refracted image and the reflection — analytic sky
  outdoors, and it can *reuse `marchReflection`* (factored out of the water shader
  into a shared GLSL chunk, the way `SKY_GLSL` was factored out of the sky) for
  true screen-space hits on the room around it. The march is the expensive option
  and a per-prop switch; the sky fallback alone is respectable.
- **Bubbles** are the same material at the thin-film limit: near-zero opacity,
  fresnel + strong iridescence (the Track A hue-rotation term, shared), a slight
  refraction wobble. A bubble is genuinely cheap — most of its pixels are one
  scene read and a rim term.

**The shadow question, decided when built.** Off layer 0 means casting no shadow.
For a bubble or a pane that is correct physics. For a chunky altar crystal it may
read as floating — the escape hatch is a *shadow proxy*: a copy of the hull on
layer 0 with `colorWrite: false, depthWrite: false`, which draws nothing and
occludes nothing in the main pass but appears in the shadow map. Costs one draw
call per crystal that wants it. Try without, add if a placed crystal looks wrong.

**Cost envelope.** Per crystal pixel: 1–3 scene reads + ~40 ALU, plus the march
only where enabled. A fist-sized prop is a few thousand chunky pixels — noise. The
worst case is architectural: a stained-glass wall filling the frame is ~0.5M
marched fragments, water-showcase-2 territory; the answer is the same as water's —
budget it in the zone that wants it, and measure there.

---

## Track C — general SSR, the parked tier, now unblockable

§8 tier 3 above parked general SSR "because it needs per-surface
roughness/mask data the vertex-colour format does not carry, and flat-shaded
Lambert does not read specularity anyway." **Track A dissolves both reasons** — the
format carries the data and the surfaces read specular. What remains is the real
architectural cost, so this stays a *deliberate later phase* rather than part of
the foundation:

- The finish attributes live in the opaque pass; an SSR pass lives in the effect
  slot and needs them *per pixel*. The cheapest honest bridge: the normal target is
  half-float RGBA and **its alpha channel is unused** — patch the normal-pass
  override material (which already carries the sway patch, so the wiring exists) to
  read `aFinish` and write `metallic × (1 − roughness)` into alpha. No new target,
  no MRT, one channel of an existing texture.
- The SSR pass then runs water's march (the shared chunk again) only on pixels
  whose mirrorness clears a threshold, compositing hit colour over the analytic-sky
  term Track A already painted — a crossfade between two correct answers, water's
  edge-fade included.
- Cost: zero on frames with no mirror pixels (the mask kills the march at the first
  read); a full-frame polished floor approaches water's cost, which R6 already
  demonstrated is carryable.

Until a prop actually wants a room-reflecting surface, Track A's sky reflections
are the shipped answer and this tier stays parked — but parked with the road built,
rather than parked as ruled out.

---

## The use cases, mapped

| Want | Recipe | Track |
|---|---|---|
| Gilded frame, idol | `gilt` — metallic, mid-rough, glint | A |
| Polished bronze, pewter | `polished` on the existing BRONZE/IRON colours | A |
| Chrome | `chrome` — sky-mirror now, room-mirror when C lands | A (→C) |
| Silk hanging, banner | `silk` — anisotropy along the drape + sheen; composes with sway | A |
| Velvet | `velvet` — sheen dominant, rough | A |
| Polished marble | `marble` — tight specular + translucency; floor reflections are C | A (→C) |
| Crystal, cut gem | transmissive + dispersion + facet refraction | B |
| Window/vessel glass | transmissive, dispersion 0 (existing windows stay emissive by design) | B |
| Bubble | transmissive thin-film + iridescence | B |
| Beetle shell, oil slick, fantasy alloy | `shell` — iridescence over metallic | A |
| Wax, alabaster, jade | `waxen` — translucency, wrap + backlight | A |

---

## Feasibility and cost, honestly totalled

**Feasibility: high, and structurally additive.** Track A is a fourth link in an
onBeforeCompile chain that already has three, using a lighting hook (`RE_Direct`)
that three hands us with shadows pre-applied. Track B is water minus the hard
parts. Track C is one alpha channel and a factored-out march. Nothing touches the
pass order, the targets, or the quantizer; the depth/normal/shadow passes never
learn any of this exists.

The bill:

*(Measured after M1/M2: three attributes, 9 B/vertex, ≤ ~24 MB. The row below
is the estimate that was written first — see the M1/M2 status block for why the
ninth lane became its own byte.)*

| Item | Cost | When paid |
|---|---|---|
| Two Uint8 vec4 attributes, whole kit | ~21 MB GPU (+11% vertex memory), +8 B/vertex bake time | Always, once M0 lands |
| Matte fragments (most of every frame) | 1 attribute fetch + branch | Always |
| Finished fragments | 25–90 ALU by term count + one `skyColour` | Only on finished surfaces |
| Glint | ~20 ALU behind its own early-out | Only where glint > 0 |
| Transmissive pass | 0 in zones without; 1–3 reads + ~40 ALU per crystal pixel; march extra | Per placed prop |
| SSR tier | 0 until enabled; water-class where a mirror fills the frame | Parked |
| Program complexity | one shared shader grows ~150 lines; compile once at boot | Boot |

For calibration: GTAO spends 48 texture taps on *every* pixel every frame and was
signed off as carryable. A frame where a gilded altar fills a third of the screen
spends less than half of that on the third it covers. The only figure that warrants
a real measurement before commitment is the vertex-memory ask, and the measurement
is `renderer.info` before and after M0 in the heaviest zone (the readables gallery,
~340k triangles).

**Risks worth naming:**

- *Three.js version drift.* The stage grafts onto Lambert's chunk names
  (`RE_Direct`, the lights loop). Upstream renames break it loudly at compile —
  same exposure the sway/wear/detail patches already carry, no worse.
- *The quantizer will band wide soft highlights.* By design — the dither absorbs
  it — but roughness values in the 0.5–0.8 band produce the widest gradients and
  should be *judged in the running game* (screenshot before tuning), not in a
  probe.
- *Facet popping.* A whole facet catching the sun in one frame is the aesthetic,
  and on a large flat roof it could strobe as the camera moves. The glint threshold
  and specular strength want tuning against big surfaces early, and big surfaces
  mostly should not be finished at all.
- *Attribute slot count.* WebGL guarantees 16 vertex attributes; the kit currently
  uses 8 (position, normal, color, sway, wear, wearTint, detail, detailTint) and
  this adds 2. Comfortable, but the ledger should live in a comment in
  `assemble.ts` once this lands.

**Checks.** `check:art` grows the same way it did for water: the FINISHES table
validated (all knobs 0–1, grain axes unit), the chunk anchors asserted, and a
SwiftShader probe that draws a finished fixture and asserts a facet actually
brightens with the lobe on and is bit-identical to Lambert with all knobs zero —
the "toggled off, output matches" guarantee, machine-checked.

---

## Implementation phases

M-numbered, beside the R-phases above. M0 blocks the rest of Track A; B and C
are independent of everything after M0's gallery exists to look at them in.

- **M0 — the finish stage.** `art/finish.ts` (table + patch), `Part.finish`,
  attribute packing in `assemble`, specular/metallic/roughness + sky/hemisphere
  environment, the weathering hand-off, dev-panel folder, check additions. A
  materials gallery rank with fixtures rough as the checks need and no rougher.
  *Exit: all-zero finish is bit-identical to today (probe-asserted); a gilt and a
  polished fixture read at a glance in the gallery; vertex-memory delta measured
  and recorded here.*

  **Status: built** — `art/finish.ts` (the `FINISHES` table, `resolveFinish`,
  `applyFinish`), baked by `assemble` as one normalized-Uint8 vec4 (`aFinish`:
  metallic, roughness, two lanes reserved for M1/M2). The patch is the fourth
  link in the `onBeforeCompile` chain and hooks the *lighting* chunks: a custom
  `RE_Direct` wrapping Lambert's (the lights loop folds the shadow factor into
  `directLight.color` first, so the highlight is shadowed for free), a GGX lobe
  with implicit visibility, and an indirect term after the lights loop —
  `skyColour(reflect)` outdoors, the hemisphere pair indoors, switched by
  `uFinishSky` from the zone's air. Lambert's outgoing-light line gains its two
  specular terms back, which upstream Lambert discards.

  Decisions worth keeping written down:

  - **The roughness lane is the has-finish gate.** Zero is the matte default
    every unfinished vertex carries, so a real finish keeps roughness ≥ 0.05
    (`check:art` enforces it on the table and on every baked vertex) and the
    shader gates every term on `step(0.001, vFinish.y)`. No fifth lane spent on
    an enable bit.
  - **The weathering hand-off is one global.** `art/weathering.ts` declares
    `float finishWorn` and sets it where the wear noise wins; the finish stage
    scales itself by `1 − finishWorn`, so rusted gilt is matte rust. The check
    asserts the declaration lands textually before the read — the patches
    insert in reverse application order at the `<common>` anchor, which is
    exactly the kind of ordering that breaks silently.
  - **Verified under SwiftShader** (throwaway probe, the R6 method): the
    patched program compiles with no shader log; a gilt fixture changes when
    the stage toggles; a matte crate is **zero bytes different** with the stage
    on and off — the bit-identical claim, held on an actual rasterizer rather
    than argued from IEEE identities.
  - **Vertex memory, measured:** 4 bytes/vertex, 359,712 vertices across the
    116 builders at one build each (~1.4 MB); against the ~2.6 M unindexed
    vertices of the fully resident world, ≤ ~10.5 MB. Half the spec's estimate,
    because M0 lands one attribute of the two — `aGrain` arrives with M1.

  The Materials Gallery hangs off the general hall's showcase rank (slot
  eleven, appended east rather than re-centring ten doors): chrome, polished,
  gilt, marble — mirror to dielectric. The fixtures carry no wear — the
  weathering hand-off is asserted in `check:art`, and tarnish is a statement a
  placed prop makes, not a default. `finish: { specular, environment }` in `RenderSettings`, a
  dev-panel folder ("material finish"), dev toggle via `PostFX.setFinish`; no
  player option, by the water rule. **Still owed: eyes.** The lobes and the
  gallery want looking at in the browser, and the world itself is untouched
  until real props declare finishes — which are Phillip's to assign.
- **M1 — cloth.** Anisotropy (`Part.grain`) + sheen. *Exit: a silk fixture's
  highlight follows the drape; a velvet fixture rims; both survive sway without
  swimming.*
- **M2 — sparkle and depth.** Glint, iridescence, SSS terms. *Exit: glints are
  static in object space (probe: two renders, same camera, identical); an
  iridescent fixture walks hue with view angle; a backlit waxen fixture glows
  through its thin edge.*

  **Status: both built**, together, since they share the attribute work. Five
  terms landed on M0's stage: an anisotropic GGX (the isotropic form is the
  same function at anisotropy zero, so the branch is arithmetic rather than
  answer), a sheen rim in the surface's own colour with direct and indirect
  halves, procedural glint, a thin-film hue walk, and wrap-plus-backlight
  translucency.

  **Nine parameters, three attributes, and the third one is a plain byte.**
  Two vec4s hold eight lanes and there were nine things to say. Every way of
  avoiding the ninth needed either a mode-switched lane — one number meaning
  two things depending on another — or sub-byte packing read back through
  float arithmetic, and both of those fail silently. `aGlint` is one byte and
  buys the absence of a class of bug nobody could see. The grain *axis* is two
  lanes rather than three by a cheaper trick that is not a trick: it is an
  axis, so sign carries no information, and flipping it to the upper
  hemisphere lets Y come back as `sqrt(1 − x² − z²)` exactly.

  Six things worth keeping written down:

  - **One grain axis per part is a whole surface's tangent field.** The tangent
    is `cross(grain, facet normal)`, so a single authored axis gives a turned
    column its circumferential stretch and a drape its stretch along the folds
    — no per-vertex direction, and nothing to interpolate wrong. Where the axis
    stands *along* the normal there is no grain direction at all (the pole of a
    lathe), so anisotropy fades out over the last few degrees rather than
    snapping to whatever the cross product rounded to.
  - **The axis rides the normal matrix, which sway never touches**, so grain is
    welded to a cloth however the cloth moves. That is why the drape fixture is
    hung taut and does not sway: the sway shader scales displacement by height
    above the origin, so a cloth fixed at its *top* would move most where it is
    nailed down. The stability claim is by construction, not by fixture — the
    exit criterion above asked for the wrong demonstration.
  - **Glint is jittered alignment, not a jittered normal.** The obvious
    implementation perturbs the micro-normal, and the perturbation has to live
    in some frame — pick view space and every sparkle swims when the camera
    turns, which is the one thing glitter must never do. Perturbing the
    *alignment* `dot(N, H)` instead is frame-free: each cell carries a fixed
    draw, crosses its own threshold as the geometry moves, and fires. Two
    identical frames come back byte-identical under the probe.
  - **Glint fades with the pixel footprint**, reusing the varying the detail
    stage already computes. 1.4 cm cells are about one chunky pixel at the
    range a prop is looked at; past that they are below Nyquist and would
    shimmer, which is precisely ANTIALIASING.md's subject. A feature too fine
    to sample has to dissolve, never sparkle harder.
  - **The stage borrows two varyings rather than declaring its own** —
    weathering's object-space position for the glint cells, the detail fade's
    footprint for the fade. Each would otherwise be a second interpolator
    saying something already said. `check:art` asserts both are still in scope,
    because the failure mode is a shader that stops compiling in whichever zone
    first draws a finished prop and nowhere else.
  - **The star sparkle is geometry, not shading** (`art/sparkle.ts`). A glint
    drawn in the material can only colour that material's own pixels, so it is
    cropped at the silhouette and rotated by the face under it — which reads as
    glitter stuck to the surface rather than as light reaching the eye.
    `assemble` scatters sites over whatever triangles carry the star lane (so a
    gilt band on a stone prop seeds the band alone), `ZoneManager.prepare`
    merges every prop's sites into one instanced draw per zone, and the quads
    face the camera on `PARTICLE_LAYER` + `GLOW_LAYER`. The depth test is **once
    per quad, at its centre**: a star arrives whole or not at all, so an
    occluder swallows it rather than cutting it in half. The cost is that a
    star whose centre clears an edge draws its arms over that edge, which is
    what a lens flare does anyway.
  - **The backlight is shadowed, and that is a real limit.** The lights loop
    folds the shadow factor into the light colour before any of this runs,
    which is what gives every lobe shadows for free — and it means a thick
    closed solid shadows its own back, so light-through reads on thin geometry
    and edges rather than through an orb. The wrap term carries the visible
    half of SSS regardless, which is why the waxen fixture is an orb: a
    softened terminator across facets is the thing to look at.

  **Verified under SwiftShader**, two probes. The first: every fixture changes
  when the stage toggles, the matte crate is **zero bytes different** on and
  off, and gilt renders twice to the byte. The second answers a question the
  first cannot — equal byte counts across fixtures are just shared geometry, so
  it renders eight finishes at *one colour on one shape* and compares all 28
  pairs. Every pair differs; the closest is polished against brushed at 476
  bytes, which is the pair separated by nothing but the grain. A term that was
  never wired would render identically to the one beside it and no
  against-off count would ever say so.

  Ten fixtures in the gallery now, each isolating one claim: chrome, polished,
  brushed, gilt, frost, shell, waxen, marble, then silk and velvet as drapes,
  since the terms that matter to cloth are both about a surface turning.
  **Memory, measured:** 9 bytes/vertex, 3.2 MB across the builders at one build
  each; ≤ ~24 MB for the fully resident world — against the 21 MB the estimate
  above budgeted for eight lanes, which is what the ninth byte cost.

  ### What the first look changed

  Reported from the running game: the gilt read "rough and pixellated" and the
  cloth read "saran wrap". Both were true, neither was guessable from the
  numbers, and chasing them produced four corrections and one lesson about the
  harness itself.

  - **A screenshot harness that does not call `patchArtMaterial` photographs a
    different renderer.** The first pass of the tuning harness imported it and
    never called it, so every image was stock Lambert with vertex colours —
    no finish at all — and looked entirely plausible: a smooth ochre ball,
    no obvious fault. Two rounds of tuning went into that picture before the
    giveaway, which was that turning the environment term to zero changed
    nothing. **If a knob does nothing, distrust the harness before the
    shader.**
  - **Glint was the pixellation, and cell size was why.** At 70 cells/m the
    cells were centimetres across — several chunky pixels each — so a gilded
    surface came back scattered with hard little squares. Cubes hashed in
    object space give square patches, and a patch is not a sparkle. At 160/m
    they are a pixel or so and read as fine glitter. Gilt then lost its glint
    entirely — gold leaf is laid smooth, and sparkle on it read as grit — so
    the term moved to a `frost` fixture where the sparkle *is* the material.
  - **A specular lobe narrower than a facet is not dim, it is absent.** Facets
    on this kit's props are ten or twenty degrees apart; a lobe of a few
    degrees falls between them and appears only when a facet swings through
    the mirror angle. The metal orbs read as painted clay for exactly this
    reason. The direct lobe now has a roughness floor of 0.16 — the
    environment term keeps the true roughness, so smooth finishes still read
    as smooth. The fixture orbs went from 80 faces to 320 for the same
    reason: a fixture should not fight its own shape.
  - **A tinted metal cannot reflect only the sky and come back right.** Gold
    has almost no blue in it, the sky has almost nothing else, and the product
    is olive. That is what a gold mirror in an empty blue room genuinely does,
    and nothing like gilding — real gilding stands in a landscape that bounces
    its own light back. The environment is now pulled toward its own
    brightness in proportion to **how much the surface colours what it
    reflects**, not to how metallic it is: chrome is a metal too, and a chrome
    ball reflecting a grey sky would be the same mistake reversed. `PALETTE.GOLD`
    was brightened alongside, because on a metal that entry is not a colour, it
    is the reflectance, and a mid-tone ochre had nothing to give back.
  - **The cloth was missing its geometric attenuation.** A constant stood in
    for the Smith visibility term, which is exactly right head-on and badly
    wrong at grazing, where Fresnel climbs to white with nothing holding it
    down — so every hem and edge wore a hard pale line. The honest term costs
    two square roots and evaluates to *the same 0.25* at normal incidence, so
    nothing tuned head-on moved and only the blow-out went. Alongside it,
    **sheen now replaces the specular lobe rather than adding to it** (direct
    and environment both): cloth scatters in its fibres and does not also
    carry a dielectric mirror. Velvet asks for all of the sheen and therefore
    none of the lobe, which is the whole difference between fabric and
    something wrapped in film.
- **M3 — the transmissive family.** The fourth material, its layer, its pass, the
  refraction/dispersion/Beer–Lambert/fresnel stack, bubble preset, `marchReflection`
  factored to a shared chunk. *Exit: a crystal fixture visibly refracts and
  disperses the gallery behind it; the pass is skipped in zones without (readout);
  the shadow-proxy question answered by looking.*

  **Status: built.** `art/glass.ts` is the material, `engine/Glass.ts` the pass,
  `GLASS_LAYER` 6, and the march now lives in `engine/reflect.ts` where water
  and glass both read it. Four fixtures: a cut gem, the same cut absorbing
  hard, a flat pane with dispersion off, and a bubble. Three things the plan
  did not have right:

  - **The depth buffer cannot measure a crystal's thickness.** The plan took
    the path length from the depth difference, the way water takes its column
    — but water sits *on* its bed, and a gem does not. That difference is the
    air gap to the wall behind, so a stone against a distant sky would read as
    infinitely deep and one against a wall as paper thin. The chord through a
    convex solid is what is wanted, and for a body `d` deep it is `d·cos θ`
    with `cos θ = dot(N, V)`: thickest through the middle, vanishing at the
    silhouette. One dot product already in hand, and on flat facets it steps
    face to face — which is a cut stone showing each face its own depth of
    colour, not an artefact.

    **And `d` is per face, along that face's own normal.** Measuring it from
    the bounding sphere is right for a gem or a bubble and absurd for a sheet:
    a 3 cm windowpane 1.6 m tall claimed to be 1.85 m deep and refracted like
    a slab of ice, throwing the image so far it landed on the frame's own
    posts. Both attempts to catch that in the shader — rejecting the read, then
    shortening it by bisection — treated the symptom, and the second banded
    visibly. The measurement is the box's width along the vertex normal, capped
    by the bounding sphere so a diagonal cannot claim the corner-to-corner
    reach. A pane's faces then read 3 cm, and its *edge strips* read the full
    width, which is correct — edge-on into a sheet really is a metre of glass —
    and is why the pane fixture is now a 15 cm slab: window glass bends the
    room behind it by about a millimetre, which is true and nothing to look at.
  - **A hull with no depth test may carry no interior face.** The pass
    composites in draw order, so a cylinder's end cap left inside the gem
    paints over the outside of it. Every transmissive hull is built open-ended
    and convex; front faces of a convex hull cannot overlap in screen space,
    which is the whole reason this material is safe without a depth buffer.
  - **`SKY_GLSL` does not carry its own noise.** It leaves `fbm` to the caller
    so a shader that already has it does not declare it twice — glass needs
    `NOISE_GLSL` alongside it or nothing compiles.

  Faceting is decided by the geometry rather than a flag: the shader reads the
  interpolated vertex normal, so un-indexed geometry with face normals gives
  hard facets and a smooth sphere gives a bubble. Shadow proxies were not
  needed — nothing placed yet reads as floating. No player option, by the water
  rule; the dev panel gets a refraction scale and glass rides water's
  reflection switch rather than growing a second one.
- **M4 — general SSR.** *Parked until a prop wants a room reflection.* Mirrorness
  into the normal target's alpha, the masked march in the effect slot. *Exit: a
  chrome fixture reflects the gallery; the pass reads zero-cost in a zone with no
  mirror pixels.*

Player options: **none.** A finish is what a prop is made of, like its colour — the
water rule. Costs are carried in zone budgets, like any prop's. (If M4 ever ships a
frame-filling mirror floor, its march can ride the existing water-reflections
switch rather than growing a new one.)

### Dependency summary

```
M0 ──► M1 (cloth)
  ├──► M2 (glint, iridescence, SSS)
  ├──► M3 (transmissive)  — independent of M1/M2, wants M0's gallery
  └──► M4 (general SSR)   — parked; wants M0's attributes
```
