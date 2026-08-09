# GLITCH-SHADERS.md

Digital corruption effects that can be placed anywhere in the worldspace and attached
to any rendered object — a figure, a crate, a door — the way a fog volume is placed in
a room. Every effect has a strength slider, and one master slider walks an object from
"something is faintly wrong about this" through "this thing is visibly breaking apart"
to "I cannot tell what this was."

All effect names below are working names. Rename freely; nothing in the design depends
on them.

---

## 1. What the codebase permits (and forbids)

The design is shaped by five facts, all load-bearing:

1. **One material for the whole art kit.** Every prop shares `ART_MATERIAL`
   (`src/art/assemble.ts:98`, a `MeshLambertMaterial` with vertex colors and flat
   shading). It is never cloned and never disposed. Per-object glitch cannot be a
   per-mesh uniform; it must be a *world-space test inside a shared shader* — the
   vertex asks "am I inside a glitch volume?" exactly the way a screen pixel asks
   "am I inside a fog volume?"
2. **No textures, no UVs.** `assemble.ts` deletes UVs on principle. Every noise
   source below is a hash of world/object position and the clock — never a texture
   lookup, never a UV.
3. **The chunky-pixel chain has two ground rules** (`src/engine/PixelStage.ts:74`):
   one value per chunky pixel, and **no temporal accumulation** — no history buffers,
   no feedback. Real datamoshing (motion-vector smearing from held frames) and real
   pixel sorting (neighborhood scans) are therefore off the table. Both are
   *approximated* below with pure functions of `(position, time)`, which also makes
   every glitch seekable and deterministic, matching `art/activity.ts` doctrine.
4. **Fog volumes are authored data, not scene objects** (`src/engine/FogVolumes.ts`)
   — packed into fixed-size uniform arrays, costing nothing in zones that have none.
   That is the placement model. The one thing fog does *not* do is follow a moving
   object; this system adds that by re-pushing volume centers from tracked
   `matrixWorld`s each frame, which is what `ClothActivity` already does per frame
   for cloth anchors.
5. **The Activity pattern exists twice** (`LightActivity`, `ClothActivity`):
   `collect(id, root)` on zone build via a `userData` tag, `release(id)` on
   eviction, `update(...)` for the active zone only, distance culling against a
   named range constant, dormant-latch on the way out, module-level setters for dev
   overrides. `GlitchActivity` is the third instance of the same shape.

---

## 2. The effect roster

Two tiers. **Tier A** lives in the scene — a patch on `ART_MATERIAL` (vertex +
fragment), so it corrupts the *object itself*: its silhouette, its facets, its
colors. **Tier B** lives in the effect chain — a `PixelEffect` gated by a world-space
volume mask reconstructed from depth (exactly `FogVolumesEffect`'s method), so it
corrupts the *image of* the object: smears, tears, channel splits that bleed past the
silhouette. The two tiers layered together are what sells "digitally corrupting" —
geometry that misbehaves *and* a signal that misbehaves.

The scene renders at chunky resolution, so Tier A fragment noise lands at one value
per chunky pixel for free, and everything upstream of `RetroShader` gets dithered and
quantized with the rest of the frame — the same argument `FogVolumes.ts:33` makes for
why fog belongs in the chain: the dither is what makes an effect *belong* to this
world instead of floating on top of it.

### Tier A — in-scene (geometry and surface)

| # | Name | What it does | Strength slider maps to |
|---|------|--------------|-------------------------|
| A1 | `stutter` | Time inside the volume quantizes — sway and any animated signal step at 6–2 Hz instead of flowing. The subtlest tell: the object moves like dropped frames. | Coarseness of the time step, fraction of time spent stepped. |
| A2 | `jitter` | Per-vertex positional noise, hash of (object-space position, stepped time). At low strength a sub-centimetre shiver; higher, the surface boils. | Displacement amplitude (metres, scaled by object radius). |
| A3 | `slice` | Horizontal bands (quantized world-Y) shear sideways by a per-band hash that re-rolls a few times a second — the classic "sliced signal" look, in 3D. | Band displacement and how many bands are live at once. |
| A4 | `shatter` | Whole faces displace coherently along their normals (faces are addressable: geometry is non-indexed, so `gl_VertexID / 3` is a stable face id under WebGL2). Low: seams crack open. High: the object hangs as a cloud of drifting facets. | Displacement distance; fraction of faces affected. |
| A5 | `erode` | Per-face `discard` — faces vanish and reappear on a hash schedule. Holes open through the object; at full strength most of it is simply missing. | Fraction of faces discarded per burst. |
| A6 | `palette-rot` | Vertex colors channel-swap / hue-rotate in horizontal time-bands — the object's own colors go wrong (grass-green figure, magenta stone) while shading stays correct, which reads as data corruption rather than lighting. | Fraction of bands affected; how far the swap goes. |
| A7 | `facet-flash` | Individual facets slam to full white or full black for a frame or three (face id via flat varying). Flat shading makes this look exactly like corrupted triangle data. | Flash rate and coverage. |
| A8 | `crush` | The lit result posterizes to N levels inside the volume — 5 levels reads as "compressed badly", 2 levels as "barely a picture". | N slides from 6 down to 2. |
| A9 | `static-fill` | Surface color replaced by per-pixel hash static (white/black/saturated RGB). The endgame effect: at full strength the silhouette is pure noise — the shape is there, the *thing* is gone. | Blend fraction from 0 (none) to 1 (all static). |

### Tier B — screen-space (the signal)

All Tier B effects apply only where the destination pixel's reconstructed world
position falls inside a glitch volume (depth → world via `inverseProjectionView`,
same as fog), so they track the object and respect occlusion automatically.

| # | Name | What it does | Strength slider maps to |
|---|------|--------------|-------------------------|
| B1 | `split` | RGB channel separation — red and blue sampled at opposing horizontal offsets. The universal "signal going bad" tell; readable even at 1 chunky pixel of offset. | Offset in chunky pixels (1–6). |
| B2 | `tear` | Horizontal rows inside the mask displace sideways by a per-row hash, re-rolling in bursts. Pulls background pixels *into* the silhouette — the image, not the object, is torn. | Row displacement and live-row fraction. |
| B3 | `blocks` | Rectangular blocks (quantized to multiples of the chunky pixel) copy their color from a hash-offset location — faux datamosh, no history buffer needed. | Block size, offset distance, coverage. |
| B4 | `dropout` | Scanline rows inside the mask go flat black or hold a single smeared color. | Dropped-row fraction. |
| B5 | `ghost` | A displaced duplicate: sample color+depth at an offset; where *that* sample is inside the volume, blend it at the destination — the object gets a translucent doubled self, offset and flickering, bleeding outside its own silhouette. | Ghost offset and opacity. |
| B6 | `salt` | Sparse chunky pixels inside the mask replaced with saturated random colors — sparkling bit-error noise. | Density. |

Deliberately excluded: true pixel sorting and true datamoshing (need
neighborhood scans / frame history — forbidden by the chain's ground rules; `blocks`
+ `tear` + `ghost` cover the same visual territory), and any texture-based grunge
(no textures in this codebase, on principle).

---

## 3. The strength model

### One master slider, staged onsets

Each placement has a master `strength` in 0..1. Each effect has a fixed **onset**
and ramps in above it, so one slider walks the whole ladder and the stages arrive in
a deliberate order — timing wrongness first, then color wrongness, then geometry
wrongness, then destruction:

```
effectAmount(e) = smoothstep(onset_e, 1.0, strength) * weight_e * burst(t)
```

| Master strength | What the object reads as | Effects live (by onset) |
|---|---|---|
| 0.05–0.20 | "Something is off about this thing" | stutter (.05), split (.10), jitter (.15) |
| 0.20–0.45 | "It's glitching" | tear (.25), palette-rot (.30), slice (.35), salt (.35), facet-flash (.40) |
| 0.45–0.70 | "It's really messed up" | dropout (.50), blocks (.55), crush (.60), erode (.60) |
| 0.70–1.00 | "I can't tell what this is anymore" | static-fill (.70), ghost (.75), shatter (.85) |

### Per-effect sliders

`weight_e` is the per-effect slider — every effect independently 0..1 (default 1)
via `GlitchSpec.weights`, so a placement can be authored as, say, pure `split` +
`stutter` with everything else silenced, or a recipe that never destroys geometry.
The dev panel exposes every weight; specs store only the ones that differ from 1.

### The burst envelope

Constant corruption reads as a material; **intermittent** corruption reads as a
malfunction. `burst(t)` is a pure function of (seed, tempo, clock) — overlapping
hash-gated pulses with sharp attack and decaying tail, the same signal philosophy as
`art/activity.ts` (`bands` + `events`), and a natural second consumer of that module
on the JS side. Master strength also raises the duty cycle: at 0.1 the object
glitches for half a second a few times a minute; at 0.5 every few seconds; near 1.0
it never fully settles. `tempo` on the spec scales cadence independently. Seeds are
salted by hashed volume position (the `LightActivity.ts:79` decorrelation trick) so
two glitched objects never pulse in lockstep.

No accumulated state anywhere: pause, seek, or alt-tab and the glitch is exactly
where the clock says it is.

---

## 4. Architecture

### Data type

```ts
// src/engine/Glitch.ts
export type GlitchShape = 'sphere' | 'box';

export interface GlitchSpec {
  shape?: GlitchShape;              // default 'sphere'
  size: THREE.Vector3;              // radii / half-extents, metres
  strength: number;                 // 0..1 master
  seed?: number;
  tempo?: number;                   // burst cadence multiplier, default 1
  weights?: Partial<Record<GlitchEffectName, number>>;  // per-effect 0..1
}

export interface GlitchPlacement extends GlitchSpec {
  center: THREE.Vector3;            // zone world space — for free-standing volumes
}
```

Like `FogVolume`: authored data, no `Object3D`, no geometry, no collision.

### Two attachment routes (fog only has the first; this system needs both)

1. **Free-standing volume** — `ZoneDefinition.glitches?: readonly GlitchPlacement[]`
   (beside `fogVolumes` in `src/world/Zone.ts:282`; same argument for why it lives
   on the definition, not the shared environment: it has coordinates). Getter
   returns a shared frozen empty array.
2. **Attached to an object** — `markGlitched(object, spec)` in `src/art/glitch.ts`
   sets `userData.glitch`, mirroring `markCollidable`/`markLabelled`. A zone author
   builds a figure, marks it, places it. `GlitchActivity.collect` finds it in the
   post-build traverse; each frame the active volume's center is re-derived from
   the object's `matrixWorld` — so when jointed/animated figures arrive, glitches
   follow them with zero API change. (Nothing moves today; the read is a stub cost
   of three floats per volume per frame either way.)

### GlitchActivity — the coordinator

`src/engine/GlitchActivity.ts`, the `LightActivity` shape, owned by `ZoneManager`:

```ts
class GlitchActivity {
  collect(id: ZoneId, root: THREE.Object3D): void  // userData.glitch traverse
  setPlacements(id: ZoneId, placements: readonly GlitchPlacement[]): void
  release(id: ZoneId): void
  clear(): void
  update(id: ZoneId | null, elapsed: number, eye: THREE.Vector3): void
  get liveCount(): number
}

export function setGlitchOverride(strength: number | null): void  // dev / gallery
export function setGlitchFrozen(on: boolean): void                // dev
```

`update` culls by distance (`RANGE = 45`, squared, straight off matrix elements,
no allocation), evaluates each live volume's burst envelope on the JS side, and
packs the survivors into the shared uniform store. Dormant volumes are zeroed once
on the way out, not every frame.

### One uniform store, two consumers

`MAX_GLITCHES = 8`, packed vec4 arrays in a module-level `glitchUniforms` object
(`src/art/glitch.ts`), shared **by reference** into every compiled program — the
`windUniforms` mechanism:

- `uGlitchCentre[8]` : vec4 — xyz center, w = radius (or box flag, fog's trick)
- `uGlitchSize[8]`   : vec4 — xyz half-extents, w = burst-modulated strength
- `uGlitchParams[8]` : vec4 — seed, tempo, shape, spare
- `uGlitchWeightsA/B/C/D[8]` : vec4 each — the 15 per-effect weights, but **each
  tier's program declares only the vec4s it reads** (vertex stage: A2/A3/A4/A5 +
  stutter; scene fragment: A6–A9; screen pass: B1–B6), so no shader carries dead
  uniforms
- `uGlitchCount` : int — zones with no glitches loop zero times; the patch costs
  one uniform compare per vertex when idle

The Tier A patch **wraps** the existing `onBeforeCompile` chain (`sway` claims the
slot, `finish`/`detail`/`weathering` each wrap the prior — `art/finish.ts:122` is
the template), installed inside `patchArtMaterial()` so the load-bearing
`Viewport → patchArtMaterial → PostFX` order in `main.ts:66` is untouched. Note
`sway.ts:344`: program cache keys partly on patch identity — fine here, since the
patch is unconditional and the idle cost is the count check.

The Tier B pass (`GlitchScreenEffect implements PixelEffect` in
`src/engine/Glitch.ts`) reads the *same* `glitchUniforms` object by reference —
activity writes once, both tiers see it, nothing is copied per frame.

### Chain position (recommendation — see §8)

```ts
this.pixelStage.effects.push(
  this.gtao, this.water, this.underwater, this.glass, this.fog, this.particles,
  this.bloom,
  this.glitch,   // ← last in the chain, before OutputPass/RetroShader
);
```

Last in the chain so tears and channel splits corrupt *everything* the object
contributes — including its bloom halo and any fog in front of it — and still
upstream of `RetroShader`, so the whole mess gets dithered and quantized into the
world's look rather than floating over it. `enabled` follows
`this.glitchActivity.liveCount > 0` in `apply()` / per-frame, fog's zero-cost-when-
unused pattern.

---

## 5. Shader sketches

Illustrative, not final. All noise = `hash(vec3)` of the kind already in the tree;
`T` = burst-stepped time; `g` = per-effect amount from §3.

**Volume membership (both tiers):**

```glsl
float glitchAt(vec3 worldPos) {           // max over volumes, like fog's density sum
  float s = 0.0;
  for (int i = 0; i < uGlitchCount; i++) {
    vec3 d = abs(worldPos - uGlitchCentre[i].xyz) / nonzero(uGlitchSize[i].xyz);
    float inside = 1.0 - smoothstep(0.7, 1.0, uGlitchShape[i] > 0.5
        ? max(d.x, max(d.y, d.z)) : length(d));
    s = max(s, inside * uGlitchSize[i].w);   // w = burst-modulated strength
  }
  return s;
}
```

(Defensive habits carried over from `FogVolumes.ts`: `nonzero()` on the divide,
soft edge so the volume boundary never shows as a hard shell through geometry.)

**A3 slice (vertex):**

```glsl
float band = floor(worldPos.y / SLICE_H) + hashSeed;
float roll = floor(T * 7.0);
float h = hash(vec2(band, roll));
if (h > 1.0 - g * 0.5) transformed.xz += (hash(vec2(band, roll + 9.0)) - 0.5) * g * RADIUS;
```

**A4 shatter / A5 erode (vertex, per-face via `gl_VertexID / 3` on non-indexed
geometry, WebGL2):**

```glsl
float face = float(gl_VertexID / 3);
float h = hash(vec2(face, floor(T * 4.0)));
transformed += objectNormal * step(1.0 - gShatter, h) * gShatter * SHATTER_DIST; // A4
vGlitchFace = h;                    // flat varying → fragment: A5 discard, A7 flash
```

**B2 tear (screen pass):**

```glsl
float row = floor(vUv.y * uSize.y);
float h = hash(vec2(row, floor(uTime * 9.0) + seed));
vec2 uv = vUv;
if (h > 1.0 - g * 0.6) uv.x += (hash(vec2(row, 3.0)) - 0.5) * g * 0.2;
vec3 col = texture(tColour, uv).rgb;    // destination masked by glitchAt(worldFromDepth)
```

**B1 split:** two extra taps at `±vec2(g * px, 0)`, take `.r` from one and `.b`
from the other. **B3 blocks:** quantize `vUv` to block cells, hash the cell for an
offset source cell, copy. **B5 ghost:** tap color+depth at offset, test *that*
sample's world position for membership, additive-blend. All single-pass, all reads
from `context.colour`, write to `context.write` — the chain contract.

---

## 6. Integration — the complete edit list

New files:

| File | Contents |
|---|---|
| `src/engine/Glitch.ts` | `GlitchSpec`/`GlitchPlacement` types, uniform packing, `GlitchScreenEffect implements PixelEffect` (Tier B) |
| `src/engine/GlitchActivity.ts` | collect/setPlacements/release/clear/update, culling, burst evaluation, `setGlitchOverride`/`setGlitchFrozen` |
| `src/art/glitch.ts` | `markGlitched()`, `glitchUniforms`, the Tier A `onBeforeCompile` wrap for `ART_MATERIAL` |
| `src/debug/galleries/glitch.ts` | `ZONE_GLITCH_GALLERY`, `glitchGalleryPlan` (§7) |

Edits:

| File | Edit |
|---|---|
| `src/world/Zone.ts` | `ZoneDefinition.glitches?: readonly GlitchPlacement[]` + getter with shared frozen empty |
| `src/world/ZoneManager.ts` | `private readonly glitch = new GlitchActivity()`; `glitch.collect(zone.id, root)` + `setPlacements` in `prepare()` (ZoneManager.ts:618); `release`/`clear` at the two eviction sites; thin `updateGlitch(elapsed, eye)` passthrough |
| `src/engine/PostFX.ts` | construct `GlitchScreenEffect`, push last into `pixelStage.effects` (PostFX.ts:541) with an ordering comment; enabled-when-live wiring in `apply()` |
| `src/main.ts` | wire Tier A patch into `patchArtMaterial()`; `zones.updateGlitch(elapsed, eye)` in the loop beside `updateCloth` (order note: after the clock, before `postfx.render`); dev-gui folder (§7) |
| `src/debug/galleries/index.ts` | import + append + re-export, the `fabrics` three-line pattern |
| `src/debug/props.ts` | `galleryPortal(glitchGalleryPlan, gridDoor(...))` in the general hall — a door, or the room is unreachable |
| `src/debug/galleries/layout.ts` | thread `glitches?` through `GalleryPlan` → `galleryZone()`, exactly as `fogVolumes` is threaded |

Not touched: `src/layers.ts` (no new layer needed — Tier A rides the existing art
material, Tier B is a fullscreen pass), `ui/options/model.ts`/`apply.ts` (see §8),
`ART_MATERIAL` itself (patched, never cloned, never disposed).

Out of scope for v1, stated once: cloth (`clothMesh.ts` material), water, glass,
glow, and particle materials are not patched — a figure wearing a cape will glitch
everywhere except the cape. Same wrap applied to the cloth material later closes
that; Tier B already covers those surfaces since it works on the rendered image.

---

## 7. Gallery and dev controls

`src/debug/galleries/glitch.ts` — `builders: []` with the customary comment (the
subject of this room is a system, not a prop; `fog.ts` and `fabrics.ts` are the
precedents), everything in `extras()`:

- **The ladder rank:** one `figure` + one crate at each of strength 0.1 / 0.25 /
  0.4 / 0.55 / 0.7 / 0.85 / 1.0, each with a `signPost` — walk the row, watch the
  stages arrive in order. The figure matters: the whole point is NPCs, and a
  humanoid going wrong reads very differently from a box going wrong.
- **The isolation rank:** one figure per effect, that effect's weight at 1 and all
  others 0, master strength 0.8, sign-posted with the working name — this is where
  each effect gets judged (and renamed) on its own.
- **One free-standing volume** over a cluster of unmarked props, proving the
  fog-style placement route: things *near* the anomaly corrupt too.

Dev panel (`main.ts`, folder `'glitch'`, beside the `cloth` folder's controls):
strength override slider 0..1 (`setGlitchOverride`, null on reset), freeze toggle
(`setGlitchFrozen` — separate from any option so the menu cannot fight it), and a
burst-tempo override for judging envelopes without waiting on one.

---

## 8. Decisions that are yours

1. **Names.** All fifteen effect names and the system name itself are placeholders.
   The fiction of *what* this corruption is in-world (and whether the word "glitch"
   ever appears anywhere player-facing) is yours.
2. **Player option or not.** `PostFX.setFogVolumes` (PostFX.ts:662) rules that
   place-effects are part of the world and get no player toggle. Glitch is diegetic
   in the same way, so the spec follows that doctrine: dev controls only, no
   `model.ts` entry. Say the word and it becomes the standard four-edit slider
   instead (`colorblindStrength` is the exact 0..1 precedent).
3. **Photosensitivity.** `facet-flash`, `dropout`, and high-strength `static-fill`
   are rapid luminance flicker. Options considered: (a) cap flash rates globally to
   ~3 Hz and ship as-is; (b) have `reducedMotion` (already in `effective()`) damp
   flicker-class effects to steady-state versions — flash becomes hold, static
   stops boiling; (c) nothing. The spec assumes (a) + (b); (c) is not recommended.
4. **Chain position.** Recommended: last effect, after bloom, before RetroShader
   (§4). The alternative — before bloom — keeps halos clean while the object
   corrupts, which is a different fiction ("the light is fine, the thing is wrong").
   One line to move it; the gallery will settle it.
5. **Volume budget.** 8, matching fog. Raising to 16 is a constant and one more
   vec4 array; the culling range (45 m) makes 8 simultaneous *live* volumes already
   generous for hand-placed cells.

## 9. Performance notes

- **Idle cost ~zero.** Zones without glitches: Tier B pass disabled (fog's
  `hasVolumes` pattern), Tier A loop runs zero iterations behind one uniform int
  compare per vertex.
- **Active cost.** Tier B: one fullscreen pass at chunky resolution, ≤8 volume
  tests + ≤4 texture taps per pixel — strictly cheaper than the fog march (8
  volumes × 8 steps). Tier A: ≤8 sphere/box tests per vertex on patched draws;
  the art kit's merged-mesh, one-draw-call-per-prop discipline keeps vertex counts
  where this doesn't register.
- **No per-frame allocation** in `update` (matrix-element reads, squared
  distances — the `LightActivity` discipline), no cloned materials, no new render
  targets (Tier B is read-`colour`/write-`write`, no scratch buffer needed).
- **Determinism.** Every visual is a pure function of (seed, clock). No history
  means resize, tab-away, and zone transitions need no special handling.

## 10. Phasing

1. **Tier B + placement plumbing + gallery** — `GlitchScreenEffect` with `split`,
   `tear`, `blocks`, `dropout`, `salt`, `ghost`; `GlitchActivity`; zone/gallery
   threading; dev folder. Proves the volume model, the mask, the burst envelope,
   and the ladder end-to-end. Judgeable in the gallery immediately.
2. **Tier A** — the `ART_MATERIAL` wrap: `stutter`, `jitter`, `slice`,
   `palette-rot`, `crush`, `static-fill`, then the per-face pair (`shatter`,
   `erode`, `facet-flash`) which share the `gl_VertexID` plumbing.
3. **Polish** — weight recipes worth naming as presets, photosensitivity damping
   (§8.3), cloth-material wrap if the cape gap grates.

Each phase lands whole and judgeable; nothing waits on future infrastructure.

## 11. As built (2026-08-08)

Both tiers shipped together, with these deltas from the plan above:

- **The depth material and the normal override are patched after all**
  (`applyGlitchDisplacement`). The spec assumed shadows were static; in fact
  `PostFX.render` re-primes the shadow map every frame, so an unpatched depth
  material would have been the sway "motionless ghost" bug from day one. A
  shattered face now casts the shadow of where it went, and the ink outline
  follows the displaced geometry. `erode`'s discard remains surface-only —
  an eroded face still casts and outlines (§12.1).
- **`MAX_GLITCHES` is 16, not 8.** The showcase walks a rank of sixty-plus
  stations and packs the nearest; at eight, the next row over kept winking
  out mid-comparison. The shader loop breaks at the live count, so the raise
  costs uniform space, not per-frame work.
- **The onset table is data** — `GLITCH_ONSETS` in `art/glitch.ts`,
  interpolated into all three shader bodies and read by the showcase to place
  each effect row's strength steps inside that effect's own active range.
- **`stutter` is a hold-and-snap hop** (the whole object sits a few
  centimetres off, then re-rolls), not a quantization of sway time — sway has
  already displaced by the time the glitch chunk runs, so its input cannot be
  retroactively stepped. Reads as dropped-frames all the same.
- **`ghost` blends an offset double inside the mask** rather than
  membership-testing the offset sample — one texture tap instead of a second
  depth reconstruction. It does not bleed outside the silhouette; revisit if
  that reads as too tame.
- **Per-face addressing uses `gl_VertexID / 3`** (non-indexed geometry,
  WebGL2) rather than the finish stage's `aFace` attribute, because the
  depth and normal materials don't carry the finish patch and a duplicate
  attribute declaration would break the surface program.
- **The showcase is rows-by-effect, and only that**: walking west to east
  crosses the fifteen effects in ladder order, then the free-standing
  `anomaly`. Strength climbs down every row, faint at the sign, with the steps
  placed inside each effect's own onset..1 span.
- **Combinations moved out** to the `object-effects` room (door 14), shared
  with the horror system — the recipes (`bad-signal`, `data-rot`,
  `coming-apart`, all working names), each system's whole ladder, the
  crossings between the two, and everything at once. Down each of its rows the
  combination is held and the *subject* changes — figure, bovine, barrel,
  crate, chair, small-oak, hanging orb — which is the question a rank of
  identical figures cannot answer. Two axes, two rooms: a station here differs
  from its neighbour in exactly one way.
- The dev override is **steady** (bursts suspended) since it exists for
  judging; `frozen` holds the burst clock instead.
- **Attached volumes are gated by owner identity, not by their faces**
  (HORROR-SHADERS.md §3, shared machinery in art/effectId.ts and
  engine/EffectMask.ts): a marked object's id is baked as a vertex attribute
  and drawn into a chunky id mask each frame, and both the in-scene and
  screen halves compare ids instead of testing the volume's geometry — whole
  object, full strength, floor and neighbours immune. The owner id rides in
  `uGlitchCentre.w` alongside the shape flag (`w = shape + 2 × id`).
  Free-standing volumes keep the spatial test, with a hard-cut underside so a
  placed anomaly can sit on a floor it deliberately corrupts.

## 12. Future-work interactions

None of these force rework now; they are the points where later systems touch
this one.

1. **`erode` vs shadows/outlines.** The discard lives only in the surface
   fragment stage, so holes don't open in an eroded object's shadow or
   outline. Closing it means a fragment patch on the depth and normal
   materials carrying the face varying. Worth judging in the gallery first.
2. **Skinned figures.** The vertex chunk is anchored after
   `#include <skinning_vertex>` precisely so that jointed figures corrupt in
   their posed positions. When figures animate, nothing here should need to
   move — that anchor is the reason.
3. **God rays.** The chain comment in `PostFX` promises the last slot to god
   rays; glitch holds it today. When rays land, decide whether corruption
   tears the light shafts (glitch stays last) or not (glitch moves before).
4. **Collision and interaction are untouched by the visuals.** A shattered
   object still collides and raycasts at its original silhouette. Currently
   the right fiction — the thing is still there; its image is what's wrong —
   but revisit before glitching anything interactive, like a door.
5. **Unpatched material families.** Cloth, glow, water, glass stay calm while
   the art-kit surface corrupts. Tier B covers them (it works on the rendered
   image), Tier A does not. Each new material family either takes the wrap or
   visibly opts out — a recurring one-line decision, not a debt.
6. **Non-indexed assumption.** Per-face effects break quietly if kit geometry
   is ever indexed or instanced. The assumption is stated at the `gl_VertexID`
   site in `art/glitch.ts`.
7. **Photosensitivity damping** (§8.3) is not yet wired to `reducedMotion`;
   flash rates are tuned conservative instead. Wire it in `effective()` /
   `apply.ts` if the flicker-class effects ship anywhere player-facing.
