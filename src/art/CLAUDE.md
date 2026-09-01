# src/art

The art kit: every buildable thing in the world, generated from a seed. No
textures, no files, no loading — a prop is a name and a number, and the same
number always gives back the same object.

Describe what this area is and how its pieces fit **now**. No history, no "we
changed X to Y", no rejected alternatives, no tuning notes. If a fact stops
being true, edit the line — do not append a correction.

## Files

- `types.ts` — the contract: `MeshBuilder`, `BuildOptions`, the categories.
- `assemble.ts` — `Part[]` to one merged geometry; `finish` wraps it in a mesh.
- `rig.ts` — the same for a creature: bones, skinning, and one draw call.
- `sway.ts` — the shared materials and the patch chain; `updateWind` per frame.
- `palette.ts` — colours by material, with `shade` and `blend`.
- `masonry.ts`, `building.ts` — the stone and the timber vocabularies.
- `loft.ts`, `sheet.ts`, `rod.ts`, `blob.ts`, `whorl.ts` — shape primitives.
- `cover.ts`, `particles.ts`, `sparkle.ts` — instanced fields, one draw each.
- `bolt.ts` — the lightning channel: one ribbon mesh, rewritten per strike.
- `finish.ts`, `weathering.ts`, `detail.ts`, `glitch.ts`, `horror.ts` — shader
  stages, in the order they wrap.
- `flex.ts`, `clutter.ts`, `underfoot.ts`, `fabrics.ts` — per-species tables.
  Comparative judgements, so they live in one list, not on the builders.
- `registry.ts` — Vite-only. Nothing the headless tools reach may import it.

## Conventions

Every builder stands on **y = 0** facing **+Z**, centred on the origin in x
and z. `rotateY(θ)` takes +Z to `(sin θ, 0, cos θ)`, so a face's yaw is the
bearing of its outward normal. `CylinderGeometry`'s axis is +Y; `throughStone`
faces +Z; `assemble` fixes nothing up afterwards.

A builder makes **one complete connected thing** and nothing around it. No
debris, no ground marks, no dice rolled on gaps or damage a placer could add.
Weathering is opt-in per part and never added unasked.

`Math.random` is banned. Everything takes an `Rng`, and every roll is drawn
whether or not it is used, so a caller fixing one value does not shift the
sequence for everything after it.

**The attribute ledger.** `mergeGeometries` needs every input to carry the same
attribute set, so a lane added here is paid for by the whole kit, and WebGL
guarantees sixteen. Spoken for: `position` and `normal`; `color`; `aField`
(sway, wear, detail size); `wearTint` and `detailTint`; the four byte lanes
`aFinish`, `aGrain`, `aGlint` and `aFace`; `aRecipe`, an index and never
normalized; and `aEffect`, the glitch/horror owner id. Twelve, and a rigged
creature's `skinIndex`/`skinWeight` make fourteen.

**Collision is decided before the merge**, because after it nothing can tell a
rivet from the door it is driven into. A prop's collidable geometry should
resemble only what can be collided with or stepped on — a tree's trunk, not its
leaves; a door's leaf, not its hinges. Say it with `MeshBuilder.solid = false`,
or keep the decoration in a child mesh flagged `userData.noCollide`.

**Groundcover thins per blade, never per pixel or per chunk.** Each instance
carries its own keep distance (`iKeep = sqrt(area / rank)` after the shuffle)
and sprouts out of the ground over the last fraction of it; a chunk's
`instanceCount` is only a cap that tracks the same curve from its sphere. A
per-pixel blend draws a ring and a per-chunk step draws the 24 m grid. Past
`swapAt` a blade is drawn by its chunk's one-triangle mesh instead of its
ribbon, hashed per blade; the base geometry's `position.z` says which is which.

**No two layers may share a plane.** Two faces at one depth is a z-fight the
depth buffer cannot resolve at any distance; depth is made by stacking outward.

## Built where it is asked for

`assemble` returns a geometry and `finish` dresses it, and that seam is what
lets a builder run on a worker. `capture` runs one with `finish` and
`finishRigged` recording their arguments rather than making a mesh, so a
builder whose whole body is one pure walk to one of them yields its geometry
with no edit to the builder at all. Anything else — a light, a child mesh, a
moved mesh, two finishes — comes back refused and is built on the frame as
before.

A builder may stamp `userData` after finishing and still be captured, but only
plain data: numbers, strings, booleans, arrays and object literals. A class
instance would arrive with its prototype gone, so it refuses the capture
instead.

## Adding a builder

One file in `builders/`, one builder name, one line of header naming the object
and its origin or axis convention. Declare `category`, `radius`, `variants` and
`solid`; add the name to `underfoot.ts`, and to `flex.ts` if it bends.
