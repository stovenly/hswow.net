# Groundcover LOD — spec

Distance LOD for the instanced cover: fewer blades the further away they stand,
with no seam anywhere, and with the far field still ruffling in the wind.

Both phases are built, in `art/cover.ts` and `art/cover-sample.ts`. The knobs
live in the render preset under `cover.lod` and the debug panel's
`groundcover › distance` folder; every number is a placeholder and is yours to
move. The section *What exists* describes the system the LOD was designed
against.

**The short version.** The cost is vertices: nine per blade, for every blade in
every chunk the frustum keeps, drawn twice a frame. At 60 m a blade is a one-by-
two pixel dot and there are five of them stacked on every ground pixel — at eye
height, nearer two hundred per *screen* pixel. The fix is to draw a per-blade
fraction of the pool that falls with distance, derived from the same pixel size
the width clamp already reads, so the far field settles at about one and a half
blades per screen pixel whatever the resolution. There is no seam because there
is no boundary: each blade has its own hashed distance, sprouts out of the ground
as you approach it, and the chunk's instance count is only a cap that tracks the
same curve. A second phase swaps the far ribbon for a one-triangle blade; a
per-blade dithered switch, same attributes, same shader. Plumes and every wall
kind are exempt by table and draw as they do now.

---

## What exists

- **A blade is nine vertices, seven triangles**: four ribbon segments plus a tip
  (`SEGMENTS = 4`), bent, widened and coloured entirely in the vertex shader.
  The fragment is flat Lambert with one varying. Cost is vertex-bound.
- **Drawn twice a frame.** The colour pass, then `drawCoverNormals` draws the same
  meshes into the normal buffer for the edge detector. The `drawn` readout in the
  debug panel counts both, so the 30 M at ultra on the vista showcase is ~15 M
  per pass. (The showcase is a 152 m square of grass, most of it fade margin:
  roughly three million blades sampled at ultra.)
- **Chunks are 24 m tiles**, one mesh per tile per layer, shuffled at build so
  any prefix is an even scatter. The tier draws a prefix: `upload` rebuilds the
  geometry over the front of the pool's arrays — tens of milliseconds, once per
  settings change. Three reads `geometry.instanceCount` at every draw
  (r170, `renderBufferDirect`), so a count *below* the uploaded one is free per
  frame. This is the lever.
- **The width clamp.** `coverPixel` is the world size of one art pixel at unit
  depth, and a blade's half-width is floored at `0.5 · coverPixel · distance`.
  Grass (0.03 m) hits the clamp from ~12 m out at 540 art pixels tall; from there
  every blade is exactly one pixel wide however far it is.
- **Per-instance attributes**: `iPlace` 4, `iShape` 4, `iTint` 3, `iWild` 4,
  `iNormal` 3 — 72 bytes a blade. `iWild.w` is unused. Props carry `iProp` 4,
  `iTintP` 3, `iNormalP` 3, `iRoll` 1.
- **Wind** is the 1-D gust texture sampled at the root, a per-blade breathe and
  flutter, and a tip displacement of up to `0.9 · give · length` downwind. For
  grass that is ~0.17 m — one pixel at 60 m. The far "ruffle" seen today is
  mostly something else: many blades per pixel, each shifting a fraction of a
  pixel, with depth deciding which one the pixel shows. It is overdraw shimmer.
  Thinning will take most of it away, and this spec replaces it with a term that
  is designed rather than accidental (see *Far wind*).
- **The terrain is already darkened under blades** (`COVER_FLOOR`). Ground that
  shows between thinned far blades reads as shade, not lawn.
- The previous build's note stands: a per-pixel blend was a visible ring three
  times over. Any LOD here is per blade and stochastic, never per pixel.

## The numbers the design rests on

With a 70° camera and 540 art pixels of height, `coverPixel ≈ 0.0026` per metre
of depth. Grass at ultra is 208 blades/m² (160 × `COVER_POOL_SCALE`).

| distance | pixel on the ground | blades per ground pixel | blade height in px |
|---|---|---|---|
| 12 m | 3.1 cm | 0.2 | 11 |
| 20 m | 5.2 cm | 0.6 | 6.5 |
| 30 m | 7.8 cm | 1.3 | 4.4 |
| 60 m | 15.5 cm | 5 | 2.2 |
| 100 m | 26 cm | 14 | 1.3 |

Those are looking straight down. From an eye at 1.35 m the ground is seen at
grazing incidence and one *screen* pixel covers a strip of ground `d / 1.35`
times longer than it is wide: at 60 m, ~45 ground pixels, ~220 blades, most of
them hidden behind the two-pixel blades in front. That ratio is the whole budget.

## Phase 1 — thin with distance

### The keep test

Every blade gets a **keep distance** at assemble time, after the shuffle, and
carries it in `iWild.w` (free today, zero bytes added). Blade `i` of a chunk of
`N` has rank `r = (i + 0.5) / N` and is kept while

```
distance · coverPixel · grazing(θ) < iWild.w · coverLodScale
```

where `iWild.w = sqrt(a / r)`, `a` is the square metres one blade of this type
accounts for in the full pool (`1 / (density · COVER_POOL_SCALE)`, so a mixed
boundary chunk is right per blade), and `coverLodScale = sqrt(k)` for `k` = the
target blades per screen pixel. Rearranged, the fraction kept at a distance is
`k · a / (coverPixel · d)²`, clamped to one: k blades per pixel of ground, and
because `coverPixel` is the uniform the width clamp already reads, it is right at
any window size, any `pixelSize`, and any density tier without a second table.

`grazing(θ)` is the view-angle term: `pow(dot(groundNormal, toCamera), g)` with
`g` a knob in 0..1. At `g = 1` the test counts blades per *screen* pixel and the
kept fraction falls as `1/d³` from eye height; at `g = 0` it is per ground pixel
and falls as `1/d²`. Start at 1 and look. Both inputs are the camera's
*position*, never its heading, so turning on the spot changes nothing — a
density that rippled when you looked around would be the worst kind of seam.

A blade that fails the test collapses to its root (every vertex at `iPlace`):
zero area, no fragments, and the vertex shader is the only cost — which is why
the chunk cap matters.

### The chunk cap

Per frame, for every live chunk mesh: distance from the camera to the chunk's
bounding sphere (already built by `upload`), the grazing term at that nearest
point, and from them the largest rank the test could keep anywhere in the chunk.
`instanceCount` is set to that (never above `resident`), and `visible` follows
it. The shuffled order makes the prefix an even scatter, and the shader test
decides per blade inside it. This loop lives in `updateCover`, which already
runs every frame; it is a few dozen sphere distances.

The cap uses the chunk's *nearest* point, so it is generous: a 24 m chunk
straddling the curve draws some vertices it collapses. That is the trade for
never re-uploading. `upload` is untouched and still only runs on a tier change.

### The sprout

A blade does not pop. Its keep test has a band: over the last `sprout` fraction
of its own keep distance (placeholder 0.12, so ~1.5 m at 12 m and ~7 m at 60 m)
its length ramps from zero with a smoothstep, and its width rides the same ramp
until the clamp takes over. Walking into a field, blades come up out of the
ground one at a time in a hashed scatter; walking away they sink. Nothing
crosses a line, because there is no line: each blade's band sits at its own
distance.

The tread and the clump cells are unaffected. The normal pass shares
`patchBladeVertex`, so it collapses and sprouts identically by construction.

### Coverage

Thinning must not let the ground through. The width clamp already makes every
far blade a full pixel wide, and at `k ≈ 1.5` with blades two pixels or more
tall the far field stays solid. If the far field reads thin anyway, `k` is the
first knob; a `widen` knob that scales width by `1/sqrt(kept fraction)` is the
second and should be added only if `k` alone does not get there.

Expect a tonal drift: the near field is blade tint with its root-to-tip ramp,
the far field is the same blades over more visible `COVER_FLOOR`. It is not a
seam — it is continuous — but it may read as the far field going darker. The far
wind term below is where to lift it if so.

### Far wind

What the thinned field loses is the shimmer, and what it needs instead is the
thing the shimmer was standing in for: a gust front visibly crossing the field.
Two terms, both scaled by `1 − keptFraction` so they are exactly zero where
nothing has been thinned:

- **The tip still moves.** Unchanged. A one-pixel shift is still a shift, and
  the gust texture is already sampled per root with the downwind lag.
- **A sheen.** `vCoverTint` is multiplied by
  `1 + sheen · gust · breathe · dot(windDir, viewDirXZ)`: blades bending away
  from you catch the light, blades bending toward you lose it, and the front
  reads as a band of brightness rolling across the field with the same lag the
  trees answer. `sheen` is a knob; placeholder 0.18. It has no geometry cost
  and no distance cutoff — it simply comes on as the thinning does.

Whether the sheen's sign is right for this lighting is an eyeball call. If it
reads wrong, flip it; if it reads as nothing, it is the wrong cue and a
per-clump brightness wave (hash the clump cell into the gust phase) is the next
shape to try.

### Props

Ground props thin with the same test, carried in a new one-float attribute on
prop chunks (`iLodP`; `iRoll` is free on ground kinds but overloading it by kind
is a pun). The sprout scales the authored mesh from its root.

Which kinds thin is a table beside `PROP_GLOW` and `PROP_ROLLS`:

| kind | thins | why |
|---|---|---|
| `bloom` | yes | a flower head is a few pixels at 30 m; heather is 31/m² |
| `leaf` | yes | clover leaves are 234/m², denser than most blades |
| `plume` | **no** | the plume is the point of the field at every distance |
| `ivy`, `posy`, `raceme` | **no** | wall cover keeps its look from far off |

The long dry grass *under* pampas is a blade layer and thins like any other;
only the plume props are exempt. If the understory should hold too, that is a
`lod: false` on the `BladeLayer` row — a one-field addition, not in this phase
unless asked for.

### What phase 1 buys

From eye height on the showcase at ultra, thinning begins ~12 m out (grass
hits `k` blades per screen pixel there) and the far field settles at roughly
`k` blades per screen pixel of grass. Where today a frame holds ~15 M cover
triangles per pass, the estimate is under 4 M: a near disc at full density plus
a far field whose cost is a constant per screen pixel regardless of how big the
level is. Low tier (52/m²) starts thinning at ~19 m and converges on the same
far field — so above the thinning distance every tier costs the same, and the
tiers become a near-field setting, which is the honest thing for them to be.

## Phase 2 — a one-triangle far blade

Past ~25 m a blade is under five pixels tall and its cantilever curve is not
resolvable; a tapered triangle with the tip displaced the same way is the same
picture. `bladeGeometry` is already parameterised on `SEGMENTS`: `SEGMENTS = 1`
is three vertices and one triangle — same shader, same `t = position.y`, same
wind, same tint ramp. Nothing new is authored.

- Each chunk gets a second mesh over the same instance arrays with the tri base.
  Each blade has a hashed **switch distance** (`swapAt · (0.8 .. 1.2)` by a hash
  already on the instance) and is drawn by exactly one of the two meshes: the
  ribbon collapses it beyond the switch, the tri collapses it before. Per blade,
  dithered over a band, no contour.
- Per frame, a chunk whose nearest point lies past the band draws only the tri
  mesh; one whose farthest point is inside it draws only the ribbon; only the
  first ring draws both. Decided on the CPU with the same sphere distance.
- Instance attributes cannot be shared between two geometries without fighting
  three's dispose — `upload` already notes that disposing one geometry deletes
  the buffers behind every attribute it holds. So the second mesh is a second
  upload over the same heap views: +72 bytes a blade of video memory for chunks
  that need both, which is the first ring only, and a tri-only chunk can be
  uploaded with the tri base alone. Worth stating: at ultra the showcase already
  holds ~200 MB of instance data on the GPU, and this spec does not reduce it.
  Residency by distance — uploading a far chunk at its thinned count and
  re-uploading as you approach — is the follow-up that would, at the cost of
  uploads during play.

This phase takes the far field from seven triangles a blade to one, about 2.5×
on the part of the frame that phase 1 leaves. Build phase 1, look, and decide
whether phase 2 is needed before building it: it is the only part of this with a
transition that could be seen, and the thinning alone may already be enough.

## Knobs

All in the render preset under `cover.lod`, beside `cover.density`/`height`/
`width`, and in the debug folder — none in the player's menu:

| knob | placeholder | what it is |
|---|---|---|
| `blades` | 1.5 | `k`, target blades per pixel at the far field |
| `grazing` | 1 | exponent on the view-angle term, 0 = per ground pixel |
| `sprout` | 0.12 | fraction of a blade's keep distance over which it grows |
| `sheen` | 0.18 | far wind brightness term |
| `swapAt` | 25 | metres, phase 2 only |

The tier table stays as it is.

## Needs an eyeball

- **`k` and `grazing`**, at the showcase, walking the judged lane: is the far
  field solid, does it go dark, does anything crawl when you walk.
- **The sprout**, from 12 m, where a blade is eleven pixels tall. If a growing
  blade reads as a thing happening rather than a field being there, lengthen the
  band or push `k` up so thinning starts further out.
- **The sheen's sign and strength**, with the wind up and the sun low.
- **Phase 2's switch band**, if built: stand at `swapAt` and look for anything
  that reads as two fields.
- **Clover** after thinning: the leaves are what makes it clover.

## Not proposed

- **Per-pixel or per-chunk fades.** A per-pixel blend was a ring three times; a
  per-chunk density step draws the 24 m grid.
- **A merged far mesh or an impostor.** No textures in this project, and a static
  far sheet cannot ruffle — the far wind is the part worth keeping.
- **Changing the chunk size.** 24 m is fine for the cap; the per-blade test is
  what gives the curve its resolution.
- **Exempting types from thinning by distance alone** — exemption is by kind,
  in a table, so the plume and the wall kinds say so once.
