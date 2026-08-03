# Shaders — the screen-space roadmap

A companion to [SPEC.md](SPEC.md) and [SCALING.md](SCALING.md): the spec says what the
game is, scaling says what must change structurally, and this says how each planned
graphical feature would actually be built against the pipeline as it stands. Nothing
here is committed work. Everything here is a design worked out far enough that starting
it is a matter of doing, not deciding.

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
     returns exactly the correct sky gradient at zero cost.
- **Draw order:** `PixelStage` renders opaques, keeps its colour+depth, then draws
  water (and glow) into the same colour target with those textures bound as uniforms
  — the standard second-stage arrangement, and the R0 restructure is what makes the
  targets ours to bind.

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
- **Tier 2 — SSR for water.** Computed inside the water shader (§7), since water
  already has the colour and depth targets bound: reflect the view ray about the
  wave normal, march the depth buffer — 16 coarse steps, 4 binary-refine — with the
  chunky-cell hash jittering the start. Hit → colour buffer read; miss → analytic
  sky. Water is near-planar and its rays leave upward, which is SSR's best case:
  short marches, high hit rate on banks and huts, and the halftone eats the edge
  artifacts that plague full-res SSR.
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

**Status: built** — `src/engine/GTAO.ts`: 2 slices × 4 steps each way (16 taps),
**interleaved gradient noise** rotation, two 3×3 depth-aware blurs, composite faded
by the zone's actual fog (smoothstep, matching the material fog exactly).
`ao: { strength, radius }` in `RenderSettings`, dev-panel folder, and the player
option ("ambient occlusion", Video tab) all landed.

Three notes for anyone tuning this, all learned by getting them wrong:

- **The rotation must be IGN, not a hash.** White noise gives neighbouring pixels
  uncorrelated estimates, and a small blur cannot reconstruct anything from that —
  the AO reads as grain over every shaded surface. IGN makes neighbours
  complementary, so a 3×3 neighbourhood contains a full rotation set.
- **The blur's depth tolerance must be relative to distance.** An absolute
  metres-based threshold rejects every neighbour on a floor seen at a grazing
  angle — the blur switches itself off precisely on the surface the player looks
  at most, leaving raw noise there.
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
