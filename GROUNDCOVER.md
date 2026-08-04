# Groundcover — spec

**Built.** `art/cover.ts` is the sampler, the two materials and the attach; the type
table and `CoverPatch` are in `world/ground.ts`; the terrain writes the per-face
attribute; `ZoneManager.prepare` attaches cover to anything it already calls ground;
the player has one toggle; and there is a showcase off General Props with every type,
a plume meadow, and the bank where cover stops. `check:world` holds the blade budget
and asserts every type appears in that room; `check:art` asserts the shader patches
land.

This is the second build of this document. The first specified shell texturing —
cross-sections of a height field stacked over the ground — and it was built, tuned
through five commits, and replaced. What survives from it is everything except the
draw: the type table, the per-face terrain attribute, the feather, the broad fields,
the wind coupling and the showcase. See *Why not shells* at the end.

## The technique — instanced blades

The Ghost of Tsushima shape, scaled to a pixelated Lambert world: every blade is real
geometry, one instance of a 9-vertex ribbon, built and bent in the vertex shader.

- **Placement is a CPU sampler, not a bake.** At zone build, `coverFor` walks the
  ground's triangles, reads the cover attribute the terrain already writes, and rolls
  blades per face — position, length, width, facing, tint, all packed into instanced
  attributes. Hash-driven on face and blade index, so the same mesh grows the same
  field on every visit, with no placement authored and nothing to invalidate when the
  mesh changes.
- **A blade is a camera-facing ribbon** bent along a cantilever curve: displacement
  grows with height squared, the tip dips to pay for the bend. Facing the camera costs
  nothing here because a blade is not lit by its own surface — see below.
- **Chunked instancing.** Instances are grouped into 24 m tiles, one draw each, so
  the frustum drops the parts of a field behind the camera. Within a chunk the
  instances are shuffled at build, so drawing a prefix (the tuning density) is an even
  scatter rather than a region.

### The two shading decisions that matter

- **A blade is lit by the ground's normal.** The BotW/Genshin trick: the field shades
  as one surface with the terrain, blades and ground answer the sun identically, and
  the seam between a blade's root and the ground it stands on cannot show because
  there is nothing to disagree about. Tint is the type's colour pulled a quarter of
  the way toward the actual face colour under the root, darkened toward the root.
- **A blade never projects under one art pixel wide.** Tsushima stretches thin blades
  in view space; at `pixelSize: 2` this matters twice as much. `updateCover` ships
  the world size of one chunky pixel at unit depth, and the vertex shader floors the
  ribbon's half-width against it. This is the anti-aliasing story: the previous
  system's moiré came from features that fell under the pixel grid, and this one
  simply refuses to have any.

### Clumps, not noise

Voronoi-flavoured cells at 0.9 m: every blade in a cell shares a height multiplier, a
facing bias and a shade nudge. Locally correlated, globally varied — Tsushima's stated
core insight, and what stops per-blade randomness reading as static. The broad sweeps
ride above it: `coverSwell`/`coverThickness` on world XZ (26/9.5 m and 18/7 m
octaves), baked per vertex by the terrain, so a plain has areas of longer and thinner
standing than the areas beside them.

### Wind, and the tread

The same 1-D gust texture that bends the trees and drives the rustle
(`art/sway.ts`), sampled at the blade's root with the same downwind lag — a gust
front rolls across a field of grass exactly when it rolls through the trees standing
in it. On top: a slow breathe, a two-frequency tip flutter, and for props a *lagged*
gust sample, so a heavy plume head answers a beat after the grass under it.

The player carries a displacement sphere at their feet: blades within ~0.85 m push
radially away and spring back behind them. One uniform, updated per frame.

## The type table

A cover type is up to two layers, both optional (`world/ground.ts`):

- **`blades`** — length, width, density (per m²), give (wind response), sprawl
  (rest lean), tint. Grass, tussock, stubble, weeds, clover and moss are all this one
  ribbon with different numbers.
- **`props`** — a small authored mesh scattered among the blades: `plume` (a pampas
  stalk and three stippled fins) or `bloom` (a stem and a flower head tinted per
  instance from a small palette). `flowers` is grass plus blooms; `plume` is long dry
  grass plus pampas. Adding a type is a table row; adding a prop kind is a builder
  function and a table row.

The pampas plume is Tsushima's own recipe — their fields are procedural blades with
*modelled* stalks and tufts scattered through them — done in this project's idiom: the
fin's solidity falls from the spine outward and a hash stipple discards against it, so
the feathery rim is literally a stipple, which is what this pipeline quantises soft
edges into anyway. Plumes also carry a backlight term: looking through one toward a
low sun adds wrapped light, strongest at golden hour, never quite zero.

Materials grow cover automatically via the `COVER` map (turf → grass, meadow →
tussock, crop → stubble, dirt → weeds, cobble → moss, moss → moss); `CoverPatch`
paints over the automatic answer, including `none` to clear. Feather thins density
over ~0.9 m at every cover boundary, so grass runs out onto a path as a scatter
rather than stopping on a line. Steep ground turns to rock and rock grows nothing —
the line on the showcase bank is not authored anywhere.

## The player toggle

**One toggle: on or off.** On is the authored field; off skips every cover draw
outright. This replaces the density slider the first build shipped — a percentage of
grass was never a look anyone wanted, and SHADERS.md no longer needs its exception
paragraph. Tuning lives in the render preset as multipliers over the table
(`cover.density` draws a fraction of each chunk, `cover.height`/`cover.width` scale
blades live), in the debug folder, never in the player's menu.

Call it "groundcover", not "grass": `grassShadows` in the same menu refers to the
`CLUTTER` props, which are a different grass. Cover casts no shadows; the two never
interact.

## Cost

- **Vertex** — 9 verts × blades in view. The budget check holds every zone at or
  under **200k blades sampled** (the countryside sits at ~167k), and chunk culling
  means a frame typically carries a third of that. Desktop-only makes this fine.
- **Fragment** — trivial: no discard on blades, flat Lambert, one varying tint.
- **CPU** — the sampler runs once per zone build, a few tens of ms behind the
  transition fade. Per frame: four uniforms.
- **Draw calls** — one per 24 m chunk per layer, single digits in view.
- **Not in the normal pass, not casting shadows.** The override material cannot know
  the instanced construction, and the normal buffer already says the right thing —
  the ground's own normal. See `PostFX.hideGlowFromEdges`.

## What is not in this version

- **A wake.** The tread sphere parts blades at your feet but nothing stays parted. A
  small decaying render target stamped by footfalls would leave a trail through a
  field; it is the one feature here with real plumbing, and it is a follow-up.
- **Gust vorticles.** Tsushima drives local wind detail with invisible wind
  particles. The 1-D gust field is enough until a field is the centrepiece of a
  scene; a uniform array of 2–4 moving radial pushes is the shape if wanted.
- **Distance LOD.** Cells are small and the budget holds without one. If a zone ever
  needs it, the mechanism is per-blade and stochastic — sink blades below the ground
  past a hashed threshold distance — never a per-pixel blend. The first build proved
  three times that a blended contour is a visible ring however well its sides match.

## Needs an eyeball, not arithmetic

- **The type table is fresh.** Every number in it changed meaning in the rewrite
  (real metres, real blades per m²) and none has been judged by eye. Densities are
  set for the pixel scale — the terrain is already green under the blades, so 30/m²
  is a full lawn here — but that is a prediction, not a finding.
- **Blade width against the pixel clamp.** If distant fields read as uniformly thick
  thatch, widths are hitting the clamp everywhere and the table's widths only matter
  up close. That may be fine; it may want narrower far tint instead.
- **The plume mesh.** Authored blind: stalk height, fin droop, stipple grain (24
  cells along a fin) and the backlight strength all want looking at, ideally at a low
  sun angle.
- **Depth-edge speckle.** Blades write depth and the edge pass fires on depth steps,
  so every blade can carry a dark outline like any other prop. That is the house
  style, but a whole field of it may be noisier than a few props of it.
- **Whether `small-grass-clump`/`large-grass-clump` still earn their place** as
  accents now that fields have silhouettes of their own.

## Why not shells

The first build was shell texturing (Lengyel et al.): the ground drawn 16 times,
lifted along +Y, a fragment discard reading a height field. Shells are the right tool
for pile — moss, fur, carpet — and structurally incapable of long thin strands: a
strand must survive being sliced into horizontal cross-sections and reassembled by
eye, which at this pixel scale it does not. The tuning history is instructive: a
coarse lattice read as piles, a fine one as noise, every distance LOD read as a ring,
and the lattice itself moiréd against the pixel grid at whatever scale it was given.
The moiré was the lattice; the seam was the LOD; blades have neither — geometry
reconstructs through the pixel pipeline like any other geometry, and the same shader
runs at every distance.

## Prior art

- Wohllaib — *Procedural Grass in 'Ghost of Tsushima'*, GDC 2021 (bezier blades,
  clumps, view-space width, tiles):
  <https://gdcvault.com/play/1027033/Advanced-Graphics-Summit-Procedural-Grass>
- *Blowing from the West: Simulating Wind in 'Ghost of Tsushima'*, GDC 2021
  (vorticles): <https://gdcvault.com/play/1027124/Blowing-from-the-West-Simulating>
- Sucker Punch on the pampas fields — modelled stalks and tufts over procedural
  grass: <https://blog.playstation.com/2021/01/12/how-stunning-visual-effects-bring-ghost-of-tsushima-to-life/>
- Smyth — *Breath of the Wild style grass in three.js* (5-vertex blades, ground
  normals): <https://smythdesign.com/blog/stylized-grass-webgl/>
- Codrops — *The Fluffiest Grass with three.js* (chunked instancing at WebGL scale):
  <https://tympanus.net/codrops/2025/02/04/how-to-make-the-fluffiest-grass-with-three-js/>
- three.js `MeshSurfaceSampler` — the standard weighted-surface scatter this
  project's per-face sampler is a deterministic cousin of:
  <https://threejs.org/docs/examples/en/math/MeshSurfaceSampler.html>
