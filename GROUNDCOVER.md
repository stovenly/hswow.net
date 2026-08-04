# Groundcover — spec

**Built**, as specified. `art/cover.ts` is the shell material and the attach, the
`COVER` table and `CoverPatch` are in `world/ground.ts`, the terrain writes the
per-face type, `ZoneManager.prepare` attaches it, `PostFX` carries the tuning and the
slider, and there is a showcase off General Props. `check:world` holds the vertex
budget below and asserts every cover type appears in that room.

What is *not* settled is everything under **Needs an eyeball** — starting with shell
count, which is the whole quality dial and cannot be arrived at from a type checker.
The numbers in this document are where the implementation starts, not where it lands.

Scope is deliberately **carpet only** — short cover read from above and at a normal
third-person angle. Blades standing against the skyline are a separate, more
expensive tier and are explicitly out of this version. See *What is not in this
version*.

## The problem

A field of grass today means placing `small-grass-clump` props. Each one is thirty
to forty-six cones merged through `art/assemble.ts`, and each one is a placement
somebody authored. Covering a hillside that way costs hundreds of draw calls and a
list of positions nobody wants to maintain, and the moment the terrain moves the
list is wrong.

What is wanted instead is **cover that is a property of the ground, not a set of
objects standing on it**: point it at any ground mesh and grass appears, with no
authoring step and nothing to invalidate when the mesh changes.

## The technique — shells on the ground mesh

One `InstancedMesh` whose geometry **is** the ground geometry, with
`count = shells`. Each instance is one shell, lifted along +Y by
`gl_InstanceID / shells × height`. The fragment shader hashes world XZ into cells
and discards any fragment whose cell does not reach this shell's height. A stack
of cross-sections reads as blades.

This is shell texturing, the classic fur trick (Lengyel et al., *Real-Time Fur over
Arbitrary Surfaces*). What it buys here:

- **One draw call for the entire field.** Shell index comes from the instance ID;
  there is no per-blade data of any kind.
- **No placement, no bake, no builder.** It reuses the ground `BufferGeometry`
  that already exists.
- **Conforms to any mesh for free.** Terrain heightfield, a flat floor, an ad-hoc
  slab in a debug zone — all the same code path, none of them prepared.
- **Fragment cost scales with screen area, not world area.** A two hundred metre
  field costs what a twenty metre one does, because it is the same overdraws of
  whatever ground is on screen.

The cost is that shells have no silhouette. That is accepted here, by scope.

## Three things specific to this project

These are not in any tutorial and each one is a bug if it is got wrong.

### Offset along +Y, never along the vertex normal

Every shell-texturing reference pushes each shell along the surface normal. Our
ground is deliberately flat-shaded and un-indexed with **one normal per face**
(`world/terrain.ts` emits per-face normals so the faceting reads as deliberate).
Normal-offset shells would therefore tear apart at every face boundary — adjacent
faces push their shared corner in different directions.

Offsetting along world +Y sidesteps it entirely, and grass growing straight up is
more correct anyway. The slope case handles itself: `rockAngle` already turns
faces past 34° to rock, and rock grows nothing.

### Hash world XZ, not UVs

`assemble.ts` deletes UVs on principle, and the terrain has *variable* face
density — `DetailRegion` subdivides a village square while leaving the hills
coarse. A UV-space hash would make blade size change wherever the mesh density
does, which is exactly the failure `groundJitter` already documents and avoids.

Hashing world XZ gives one consistent blade scale across the whole map regardless
of the mesh underneath, and means an ad-hoc slab gets identical grass to the
terrain with no attributes at all.

### Keep the shells out of the normal pass

`PixelStage` re-renders the scene with `MeshNormalMaterial` as an override to build
the normal buffer that GTAO and the edge lines read. The obvious worry is that
shells not drawn there leave the normal buffer disagreeing with the depth buffer.

**It does not matter, because a shell is the ground geometry translated in Y.** Its
normal is *identical* to the ground's. The normal buffer at a grass pixel reads the
ground's normal whether the shell was drawn or not, so excluding shells changes
nothing except that we do not pay for them twice. It also removes the only piece of
genuinely new plumbing this system would otherwise need — a *fragment* patch on the
shared normal material, where `applySway` has only ever patched vertex shaders.

Depth is a different matter and shells do write it. See the open questions.

## Variety

Automatic from the ground material, with authored variety layered on top.

### A `COVER` table beside `GROUND`

`world/ground.ts` already pairs a colour and a footstep sound per material, on the
principle that a cobbled path that sounds like grass is worse than no path. Cover
is the third fact about the same material and belongs in the same table:

| material | cover |
|---|---|
| `turf` | grass, dense, short |
| `meadow` | grass, dense, tall, dry-tinted |
| `crop` | grass, medium, dry |
| `dirt` | weeds, sparse, short |
| `cobble` | moss, thin — in the joints only |
| `gravel`, `flagstone`, `boards`, `mire`, `rock` | nothing |

Painting a gravel path across a field then clears the grass off it for free, the
same way it already changes the footstep sound. One table, facts that cannot drift
apart.

### Three independent knobs

- **`CoverPatch`** — the same shapes `GroundPatch` already offers (`path`, `blot`,
  `field`), painted over the automatic result. "Clover in this hollow", "moss along
  the north wall", regardless of what the ground material underneath says.
- **Clumping** — a coarse hash cell, around 0.8 m, picks height and thickness per
  clump. This is what stops a field reading as a lawn. Ghost of Tsushima's clumping,
  at our scale.
- **Broad sweeps** — two smooth fields on world XZ, at 26/9.5 m for height and
  18/7 m for thickness, baked per vertex by the terrain. Clumping alone still reads as
  one uniform field of tufts from any distance; a plain wants areas that are longer
  and thinner than the areas beside them, and those have to be bigger than a clump to
  be seen as areas at all. Decorrelated seeds, so the tall places are not the thick
  ones.
- **Species shape** — each type is a different cross-section in the hash. Grass is
  thin and tall, clover round and squat and paler, moss a dense low fuzz with
  almost no height. One shader, a branch on the type index.

Species height multiplies the global height: moss ×0.35, clover ×0.6, turf ×1.0,
meadow ×1.5. Shell **count** stays global — it is one instanced draw's count and
cannot vary per fragment — so taller species get proportionally coarser layer
spacing. That is acceptable: meadow grass is longer and sparser and generally
further away.

Density is a single threshold, so **thin → sparse → thick** is continuous and can
vary smoothly across a field rather than switching at patch edges.

### Wind

Offset the hash sample point by the gust displacement, scaled by shell height, and
the cover shears with the wind. This reuses `windUniforms` exactly — the same 1-D
gust lookup texture that bends the trees and, by construction, drives the rustle in
the audio. Nothing new to build, and it inherits the existing reduced-motion gate
without wiring.

## The player slider

**One slider, 0–100, default 60.** It is layered over the preset the way
`setDither` and `setWaterMotion` are, and never writes back into tuning.

**It moves density, and nothing else.** This reverses what this section originally
specified, which was that the slider should move *height* and let shell count fall out
of a fixed spacing — on the argument that density is nearly free and a slider that only
moved it would thin the grass without moving the frame rate. That argument is correct
about cost and wrong about what the control is for. A slider that changes how tall the
grass is changes the *place*; a player reaching for a groundcover setting is asking how
much of it there is. Height and shell count are a look, and looks belong to the preset.

| slider | reads as |
|---|---|
| 0 | bare ground; the draw is skipped entirely |
| 30 | thin, worn, plenty of soil showing |
| **60** | ordinary turf |
| 100 | thick, nothing showing through |

The consequence, stated rather than hidden: **only 0 costs less.** Everything above it
draws the same shells, because the shells are the vertex cost and the slider no longer
touches them. It is an appearance control with an off switch, not a quality ladder.
Anyone needing the frame time back turns it off, and anyone tuning the cost uses
`RenderSettings.cover.shells` in the debug folder.

Changing it is free at runtime: an instance count and a uniform. No rebuild,
consistent with the rest of the system.

**Call it "groundcover", not "grass density".** The Video tab already has a
`grassShadows` toggle, and it refers to a different grass — the `CLUTTER` props.
Two adjacent rows both saying "grass" that control unrelated systems is a support
question waiting to happen. The shell cover does not cast shadows at all, so the
two never interact.

**`SHADERS.md` needs a sentence.** Its *Player options* section says each option is
"one honest switch that turns the effect on and off — not a quality ladder". That
rule was written about GTAO, bloom and god rays, where partial is meaningless.
Groundcover density is a quantity of world content, nearer in kind to field of view
than to bloom. It is an exception with a reason, and the doc should say so rather
than quietly contradict itself.

## Cost

- **Fragment** — visible ground area × shells. At 960×540 (1920 CSS at
  `pixelSize: 2`) this is a few hundred thousand invocations. Negligible, and it is
  what makes huge fields free.
- **Vertex** — ground triangles × shells, fixed per frame regardless of what is on
  screen. Real, but only in the colour pass — keeping shells out of the normal pass
  (above) means it is not doubled.
- **Memory** — zero. It is the same `BufferGeometry`.
- **Draw calls** — one.

### The vertex figure is a budget, and the cell size is what holds it

Levels here are small, focused, hand-authored cells. There is no streaming and no
chunking, so the ground is one mesh that is always drawn in full — which means this
cost cannot be reduced by distance, only by the two things that set it.

State it as a rule instead: **ground triangles × shells stays under about 250k.**
At the default eight shells that is a 30k-triangle ground, which is a 96 m bowl at
1 m resolution with room to spare. A cell that cannot meet it is either larger than
the design calls for or more finely subdivided than it needs — `DetailRegion` exists
precisely so that fine resolution is spent where a village square needs it and not
across a hillside.

The two levers, in order: coarsen the ground where it does not need to be fine, and
lower the default shell count. Both are visible in the debug folder, so a cell that
is over budget says so.

## What is not in this version

**Silhouettes.** A shell is a horizontal cross-section; a silhouette needs vertical
geometry. No shell count, spacing or discard shape produces one, and the place
shells fail worst is a ridgeline, where the stack is seen edge-on. This is
structural, not a tuning problem.

Adding it later means a second tier, and the enabling piece for either approach is
the same: **a way to know ground height, tint and species at an arbitrary XZ inside
the vertex shader**. That is gettable without a bake — render the ground from above
with an orthographic camera into a small target, colour into RGB and depth into
height. 512×512 covers a 128 m zone at 25 cm per texel, it regenerates whenever the
ground changes, it works on any mesh, and species comes free because the terrain
already writes its material into per-face vertex colours.

Given that map, the two options are Lengyel's **fins** or a **blade tier**. Prefer
the blade tier: fins need welded edge adjacency and the terrain is un-indexed with
isolated triangles, whereas blades need no prep at all, also fix the crouching and
close-up cases, and reuse this system's species, clumping and wind logic unchanged.
Budget for it is roughly 370k triangles for a 25 m disc at the density
`small-grass-clump` already art-directs to (~180 blades/m²).

If it lands, the slider gains a second lever and sheds the expensive tier first:
low settings keep shells everywhere and drop blades, so a weak machine still gets
groundcover, just without profile.

## Shape of the work

1. **The shell material.** A patch over `ART_MATERIAL`'s lineage, following
   `applySway`'s composition pattern — vertex offset along +Y by instance index,
   fragment discard by world-XZ hash. Its own `customDepthMaterial` is not needed
   because cover does not cast (see `art/clutter.ts` for the standing rule that
   small scattered things do not).
2. **Attach it.** Given any mesh, produce an `InstancedMesh` sharing its geometry.
   Driven from `ZoneManager.prepare`, which already identifies ground by
   `object.name === 'flatGround' || object.name === 'terrain' || userData.ground`.
3. **The `COVER` table and `CoverPatch`**, beside the existing ones in
   `world/ground.ts`. Cover type reaches the shader as a per-face attribute on the
   terrain — `terrain.build()` already calls `materialAt` per face, so this is free
   — with a uniform fallback for meshes that carry no attribute, exactly as
   `defaultAttributeValues` gives non-kit geometry a sway weight of zero.
4. **Species and clumping** in the fragment hash.
5. **Wind**, from `windUniforms`.
6. **`RenderSettings.cover { shells, height, density }`** plus a debug-panel folder
   exposing the three separately, so they can be tuned independently of the
   player-facing collapse.
7. **`Options.groundcover`** (0–100) and `setGroundcover()` in `apply.ts`.
8. **A showcase zone** off General Props, in the pattern of the water showcases: a
   field with every cover type, a density ramp from bare to thick, the ground
   materials side by side, and a slope steep enough to show where cover stops.

## Needs an eyeball, not arithmetic

- **Shell count is the whole quality dial and cannot be guessed.** Under six and the
  layers show; over twelve is paying for nothing. It interacts with the chunky
  resolution in a way arithmetic will not settle. The default of 60 is a starting
  point, not a finding.
- **Depth-edge speckle.** Shells write depth, and the edge pass fires on depth
  differences of 0.01–0.02. A carpet of cross-sections a few centimetres apart may
  add fine noise to the outline. If it does, the fix is a depth bias on the shells
  or excluding them from the edge test.
- **How low the camera ever gets.** Shells read correctly from above and at a normal
  angle, and start showing their stack when you get near and low. Whether that ever
  happens is a design question, not a rendering one.
- **Whether `small-grass-clump` and `large-grass-clump` still earn their place** as
  accents once fields exist, or become redundant.

## Prior art

- Lengyel, Praun, Finkelstein, Hoppe — *Real-Time Fur over Arbitrary Surfaces*
  (shells and fins): <https://hhoppe.com/fur.pdf>
- Wohllaib — *Procedural Grass in 'Ghost of Tsushima'*, GDC 2021 Advanced Graphics
  Summit (tile textures, clumping):
  <https://gdcvault.com/play/1027033/Advanced-Graphics-Summit-Procedural-Grass>
- Ilett — *Six Grass Rendering Techniques*:
  <https://danielilett.com/2022-12-05-tut6-2-six-grass-techniques/>
- *Classic Video Games Trick For Rendering Grass & Fur*:
  <https://80.lv/articles/classic-video-games-trick-for-rendering-grass-fur>
