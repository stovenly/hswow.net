# Modular interiors — spec

**Built.** A teardown of the stretched box every house interior is
today, and a rebuild as modular sets: rooms authored as cells on a metre
grid that snap together like bricks, marks on the cell edges for doors,
windows and arches, storeys stacked on storeys, stairs between them, and a
*kit* per architecture — house, stone, barn, cellar, crypt, cave — that turns
the same map into different walls. The pieces are the vocabulary; the
geometry is derived from the map so it is sealed by construction.

**The one-sentence version:** an interior is a list of storeys, each a grid
of half-metre cells assigned to rooms plus a list of edge marks; the kit
places a floor under every cell, a ceiling over it, a wall on every edge
between a room and not-a-room or between two rooms, a post at every corner,
trim over every joint, an opening wherever a mark says so, and a stair
wherever a stair strip runs — and because walls are derived from the cells
rather than placed, two rooms cannot disagree about the wall between them,
no author ever computes a wall's length, and there is no seam to hide.

Everything here is checked against `world/interior.ts`, `world/rooms.ts`,
`world/document.ts` (`ShellSpec`, `wallEnd`, `planOf`), `world/entry.ts`,
`art/builders/window.ts`, `art/door.ts`, `art/builders/stair.ts`,
`art/builders/ladder.ts`, `player/Controller.ts` (`DEFAULT_TUNING`),
`player/Collider.ts`, `engine/WindowLight.ts`, `projects/debug/content/
zones/villager-hut.json` and its six siblings, and `specs/done/EXTERIORS.md`,
`ZONE-TRANSITIONS.md`, `COLLISION-FIX.md` as they stand. Nothing is to be
built to verify it — the render is the ground truth.

---

## 1. The ask

- The villager interior is a box stretched up and down. It needs modular
  pieces: walls, doorways, ceilings, floors.
- The window is already modular and goes anywhere on a wall; the rest should
  work the same way.
- Adding a room, or a second storey, should be placing a wall piece with an
  opening and more modular room on the other side of it.
- Caves and other dungeons and interiors are coming and want the same kit
  idea.
- Modular sets do two things: more varied rooms, and pieces that snap
  together so clearly that whoever places them — a person or the assistant —
  cannot put them in the wrong place.

---

## 2. What this stands on

| | |
|---|---|
| `world/interior.ts` | `buildInterior({ width, depth, height, seed, style, planks, beams, thickness })`: six solid boxes merged into one mesh. `SHELL_THICKNESS = 0.35`. Walls span the full outer extent so corners overlap rather than butt — "two solids that meet exactly share corner vertices, which is a seam a player can fall through". Sealed; no doorway; portal doors stand against the wall with their own frame and dark backing. Floorboards let into the slab 6 mm down; beams; a 0.16 m skirting band. Styles are a code table: `HOUSE_STYLE` and the project's `countryside-store`, `countryside-cellar`, `barn`. |
| `world/rooms.ts` | **Already a multi-room generator, used by no zone.** `Room { id, at, width, depth, height, level, style, roughen }`, `Join { between, kind: doorway | arch | open | stair, offset, width, height }`. Every wall is built as panels that tile it exactly with the openings taken out; `reveal` lines an opening with jambs; `stairs` builds steps between rooms at different levels at 0.18 rise and 0.28 tread; `roughenInner` displaces inner faces for a cave or a crypt. Its header rejects kit pieces because butt-joined modules put hairline seams where flat shading cannot hide them. |
| `world/document.ts` | `ShellSpec` dispatch: `shell.rooms` → `buildRooms`, else `buildInterior`. `wallEnd(zone, wall, room)` derives a portal's interior end from a wall side. `planOf` computes the union box and ceiling. `PrefabEntry` expands a named entry list with an id prefix — the nearest thing to a kit document. |
| `art/builders/window.ts` | Cuts nothing. Sits flat on a solid wall with the wall at z = 0, everything proud toward +Z; a painted dark board for glass; a glow quad, a sheared light shaft aimed by `aimWindow`, and a `PointLight` outside the wall. `WindowLight.ts` drives every window from `environment.bearing`. **The property a kit wants for every piece: placeable on any wall, needs no hole.** |
| `art/door.ts`, `Portal.ts` | `buildDoor` picks a timber or iron leaf by material; `DOOR_PROUD = 0.07` inside the inner face; arrival `1.15` m along the facing. Doors do not open; the transition is a 0.22 s fade. |
| `art/builders/stair.ts`, `ladder.ts` | An iron stair to a landing, 0.17–0.2 rise, 0.23–0.27 going, open treads "because a closed stair is a ramp". A ladder of 0.3 m rung pitch, 1.2–8 m. No timber domestic stair. |
| `player/Controller.ts` | Capsule 1.8 × 0.32, eye 1.35, `stepHeight 0.45`, `slopeLimitDeg 50`, jump apex ≈ 1.0 m so a head clears ~2.8 m; crouch capsule ≈ 1.04 m. |
| `player/Collider.ts` | Per-triangle over an octree. The interior mesh *is* its collision surface; stair treads are what `tryStepUp` climbs. Villager hut: 6,978 triangles. |
| `world/Zone.ts` `INDOOR_ENVIRONMENT` | Sky off, fog 6 → 34, sun and a fill light aimed back so no wall of a box is black, `room: 'cell'`, `surface: 'wood'`. Acoustics are named presets — `cell`, `room`, `hall`, `vault`, `pipe`, `shed`. |
| The seven interior zones | villager-hut 10 × 8 × 3.4, cottage 8 × 6.5 × 3, forest-cottage 7 × 6 × 3, workshop 9 × 7 × 3.2, store 7 × 5.5 × 2.8, cellar 6.5 × 5 × 2.4, barn 12 × 6.5 × 5. Every one a single box. |
| `specs/done/EXTERIORS.md` | The exterior house is a separate builder with a doorway anchor; the interior is nearly twice its footprint and nothing checks. |

---

## 3. Why the box fails, and what `rooms.ts` got right

**A stretched box has one room and one shape.** Every house is a rectangle
with the same corners, the same ceiling, the same emptiness. There is no
second room, no passage, no step down into a scullery, no loft, no second
storey, no cellar stair that is a stair. The zones are seven boxes furnished
seven ways.

**Nothing in it snaps.** Furniture against a wall is placed by typing the
wall's world coordinate minus the prop's depth. A portal names a wall side.
There is no coordinate an author can count in.

**And `rooms.ts` is right about seams and wrong about what a kit is.** Its
header argues against kit *pieces* because a room assembled from butt-joined
modules is sealed by care, and hairline cracks land exactly where flat
shading cannot hide them. That is true and it stands. But a kit is not a bag
of loose modules: it is a **vocabulary and a grid**. Bethesda's kits are
placed by hand and sealed by convention; Townscaper's are placed by cells and
sealed by derivation. This document takes the second road. The author places
cells and marks — bricks — and the generator, which is `rooms.ts` grown up,
derives every wall, corner and trim from them so that sealing is not an
authoring problem at all. `rooms.ts`'s panel tiling, reveals, corner overlap
and roughening are the core of that generator.

---

## 4. The grid

**Cell.** Half a metre. Rooms are stated as cells of inner floor; the
villager hut's 10 × 8 m is 20 × 16 cells. Half a metre is the resolution at
which **every interior that exists is restated exactly** — 8 × 6.5, 7 × 5.5,
6.5 × 5 and 12 × 6.5 all land on the grid — and it makes a door two cells,
an arch three, a stair two wide, which is the room a leaf and a tread
actually take. A finer grid would make the maps long for nothing; a coarser
one would move walls the owner placed.

**Storey.** A storey has a `height` — the clear height from its floor's top
to its ceiling's underside — and a grid of cells. Storeys stack on a
**pitch** of `height + slab`, where `slab` is 0.30 m: the upper storey's
floor and the lower storey's ceiling are *one slab*, so there is never a
coplanar floor over a ceiling and nothing to fall between. Defaults: house
2.8, low room 2.4, hall or barn 4.5 or more, loft 2.2 at the ridge. The jump
apex is a metre, so a 2.8 m room takes a jumping head with 0.2 m to spare; a
2.4 m cellar does not, and that is fine for a cellar.

**Walls.** A **boundary wall** — a room against not-a-room — is extruded
*outward* from the cell edge by `t = 0.35` (`SHELL_THICKNESS`, kept), so
the room's inner dimensions are exactly its cells. A **partition** — two
rooms sharing an edge — is centred on the edge at `tp = 0.20`, eating ten
centimetres from each side, and is placed **once**, from the lower room id,
with two inner faces. Corners overlap by construction: a boundary wall runs
the full outer extent of its run, as `interior.ts` does now and for the
reason its comment gives.

**Three lattices, one integer grid.** Floors and ceilings live on cells;
walls live on cell edges; posts live on cell vertices. That is the dual-grid
trick, and it is what makes every piece's position a whole number.

**Origin.** The interior's cell `(0, 0)` is at the zone's origin, +x east and
+z south, so a cell address is half a world coordinate. A cell `(i, j)`
spans `[i/2, (i+1)/2] × [j/2, (j+1)/2]`; its centre is
`((i + 0.5)/2, (j + 0.5)/2)`.

---

## 5. The map

```json
"interior": {
  "kit": "house",
  "storeys": [
    { "height": 3,
      "cells": [ "AAAAAAAAAAABBBBB",
                 "AAAAAAAAAAABBBBB",
                 "AAAAAAAAAAABBBBB",
                 "AAAAAAAAAAABBBBB",
                 "AAAAAAAAAAABBBBB",
                 "AAAAAAAAAAABBBBB",
                 "AAAAAAAAAAABBBBB",
                 "AAAAAAAAAAABBBBB",
                 "AAAAAAAAAAABBBBB",
                 "AAAAAAAAAAABBBBB",
                 "AAAAAAAAAAABBBBB",
                 "AAAAAAAAAAABBBBB",
                 "AAAAAAAAAAABBBBB" ],
      "edges":  [ { "id": "front-door", "at": [6, 12], "side": "s", "kind": "door" },
                  { "at": [0, 3], "side": "w", "kind": "window" },
                  { "at": [10, 5], "side": "e", "kind": "arch" },
                  { "id": "hearth", "at": [15, 2], "side": "e", "kind": "hearth" } ],
      "stairs": [ { "id": "stair", "at": [0, 11], "dir": "e", "run": 6 } ] },
    { "height": 2.2, "ceiling": "rafters",
      "cells": [ "CCCCCCCC________",
                 "CCCCCCCC________",
                 "CCCCCCCC________",
                 "CCCCCCCC________",
                 "CCCCCCCC________",
                 "CCCCCCCC________",
                 "CCCCCCCC________",
                 "CCCCCCCC________",
                 "CCCCCCCC________",
                 "CCCCCCCC________",
                 "CCCCCCCC________",
                 "CCCCCCCC________",
                 "CCCCCCCC________" ] }
  ],
  "rooms": { "B": { "drop": 0.25, "style": "scullery" } }
}
```

That is the cottage: 8 × 6.5 m as sixteen by thirteen cells, a 5.5 m room
and a 2.5 m scullery a step down, a door in the south wall, a window west, an
arch between the rooms, a hearth on the east gable, a stair up the west side
to a loft over the room with the scullery open below.

- **`cells`** is one string per row, `z` down the rows and `x` along them.
  A letter is a room id; `.` is outside or solid; `_` on an upper storey is
  **void** — no floor, open to the room below, with a balustrade on its
  edges where a room adjoins it. A room id may appear in one storey only; a
  double-height hall is a room on the ground storey with `_` above it.
- **`edges`** are marks on cell edges. `at` names a cell and `side` one of
  `n e s w`; the mark starts at that cell's edge and runs `span` cells along
  the wall in the +x or +z direction, with `span` defaulting per kind (§7).
  The mark is canonical, so `[6,12] s` and `[6,13] n` are the same edge and a
  door is written once and seen by both rooms. `id` is optional and is what a
  portal names.
- **`stairs`** are strips two cells wide: a start cell (the strip's north-
  west corner), a direction and a run in cells; the stair rises from the
  storey's floor to the next storey's, and the cells above its top end on
  the storey above are a hole the generator cuts by itself. `dir` is the
  direction of ascent.
- **`rooms`** is optional per-room overrides: `drop` (a floor step down
  within the storey, ≤ 0.45 so the controller steps it), `style` (the kit's
  finish variant), `height` (a lower ceiling for one room), `roughen`.

Everything is keyed by id and merged by id: the interior document is one
field of the zone document, its rooms are letters, its edges carry ids. The
map is small enough to read as a picture, which is the point — an author, or
the assistant, looks at the rows and sees the house.

**Validation, at build.** Every cell letter names a room; every edge's cell
is a room cell; a `door`, `arch` or `open` mark lies on an edge between two
rooms or between a room and outside; a `window` or `hearth` mark lies on a
boundary edge; a stair strip lies within one room and ends against the
storey above's cells or its void; the storey above's cells over a stair's top
are cut. A violation is a build warning naming the cell, and the interior is
built anyway with the mark ignored, so the mistake is visible.

---

## 6. The kit

A kit is engine code in `world/interior/kits/`, registered by file, named by
content. It is a table of recipes for every **role** the generator asks for,
and the generator never knows what a wall looks like — only that there is
one, here, this long, this high, with these openings.

| Role | The generator asks for | House kit answer |
|---|---|---|
| `floor` | a room's floor: its cells as one region, level, style | boards let 6 mm into a slab, each board a shade, 9 mm seams; a flag floor in the `scullery` style |
| `ceiling` | a room's ceiling region, height, `flat` or `rafters` | plaster between beams every 2 cells across the short axis; rafters: a pitched underside with purlins |
| `wall` | one run of boundary or partition wall: length, height, side, thickness, its openings | timber frame at every cell edge with daub or plank infill; the frame *is* the cell rhythm, seen from inside |
| `opening` | a hole in a run: `door`, `arch`, `open`, `window`, `hearth`, `hatch` | jambs and lintel as `rooms.ts`'s `reveal`; a window's *board* stays solid and the window builder is placed on it |
| `post` | a cell vertex where walls meet: 1, 2, 3 or 4 arms | a squared oak post, full height, the corner's overlap made honest |
| `skirting`, `cornice` | the floor–wall and wall–ceiling joints of a room | a 0.16 m board proud 0.06; a beam or a plaster cove |
| `stair` | a strip: rise, run, width, direction, whether it turns | timber closed-string stair, risers ≈ 0.19, going = run / risers, open treads, a newel and a handrail |
| `balustrade` | an edge of a void | rails and turned balusters at 0.9 m |
| `hatch` | a ceiling opening over a ladder cell | a hinged trap with its frame |

Kits to ship, each a file:

| Kit | Character | Acoustics | Notes |
|---|---|---|---|
| `house` | timber frame, daub, planks, beams | `room` | the villager hut, cottages, workshop |
| `stone` | rubble walls, flag floors, stone stair | `cell` | a farmhouse kitchen, a chapel |
| `barn` | boarded walls, earth or plank floor, rafters, high | `shed` | the barn |
| `cellar` | rough stone, low, ladder not stair | `cell` | the cellar |
| `crypt` | ashlar, a **groin vault per cell** for the ceiling, pillars at every post, niches as a wall style | `vault` | dungeons |
| `cave` | §9 | `vault` or `pipe` | caves, mines, tunnels |

`interiorStyleByName` and the project's registered styles become styles of
the `house` kit; `HOUSE_STYLE` is its default. A pack that wants a kit the
base game lacks adds a kit file; a pack that wants a house that looks
different adds a style to `house`, which is the same rule as every other
builder.

---

## 7. Marks

| Kind | Where | Size | What happens |
|---|---|---|---|
| `door` | room ↔ outside, room ↔ room | 2 cells, 1.0 × 2.05 | an opening with jambs and lintel; a door leaf only if a portal names the edge |
| `arch` | room ↔ room | 3 cells, 1.5 × 2.4 | an opening, no leaf, a moulded head in `stone` and `crypt` |
| `open` | room ↔ room | the whole edge | no wall at all on that edge; two letters that share it are one space with two floors or two ceilings |
| `window` | boundary | 2 cells; the builder's own roll within them | the wall stays solid; the `window` prop stands on its inner face, `aimWindow` from `bearing`; its light is the room's daylight |
| `hearth` | boundary | 3 cells | a chimney breast proud 0.4 m with a firebox opening; the kit's `fireplace` prop stands in it; the mount for the smoke and the fire light |
| `hatch` | a ceiling cell (as `side: 'up'`) | 2 × 2 cells, 0.8 × 0.8 | a trap in the ceiling; the `ladder` prop stands under it; how a cellar and a loft are reached without a stair |
| `mouth` | boundary, `cave` kit | 4–6 cells | an irregular hole to daylight; where the portal into a cave stands |
| `niche`, `alcove` | boundary, `stone`, `crypt` | 2 cells | a recess the kit cuts; a shelf, a sarcophagus |

A mark is an opening the kit cuts and, where the table says so, a prop the
kit places at the mark with the right yaw. The window is the model: it
already stands on any wall; now the wall tells it where.

---

## 8. Storeys, stairs and lofts

**Stairs.** A strip two cells wide and `run` cells long rises one storey
pitch. Risers `n = round(pitch / 0.19)`, going `run · 0.5 / n`. For a 2.8 m
storey with `slab` 0.3 that is 16 risers over a run of six cells at
0.19 × 0.19 — steep, at 45°, as a cottage stair is, and every tread is under
the controller's 0.45 step and the 50° slope limit, so it is walked up as
stairs, not slid as a ramp. A `run` of 8 gives 37°. An `L` is two strips meeting at a landing cell, each
with its own `dir`. The cells above the stair's top three risers on the
storey above are cut from that storey's floor automatically — a stair that
arrives into a ceiling is the classic modular bug and the generator cannot
make it. Treads are real geometry and are what `tryStepUp` climbs, as
`COLLISION-FIX.md` insists.

**Lofts and galleries.** `_` cells on an upper storey are void: no floor, and
where a room cell adjoins a void the kit places a balustrade on that edge.
A loft is a partial upper storey whose remaining cells are void over the hall
below; a gallery is a ring of room cells round a void. `ceiling: 'rafters'`
on the top storey gives it the pitched underside a roof has, sloping from the
eaves walls to a ridge along the long axis, so a loft is 2.2 m at the ridge
and headroom falls toward the walls, which is why beds go under the eaves.

**Ladders and hatches.** A `hatch` mark on a ceiling cell with a `ladder` on
the storey below is the cellar and the loft in one; the `cottage`↔`cellar`
portal today is already a trapdoor prop and a ladder prop and becomes this.

**Drops.** `rooms.B.drop = 0.25` lowers one room's floor within its storey;
the partition to its neighbour gains a step and its walls grow by the drop.
`rooms.ts`'s `level` is this.

---

## 9. Caves

The `cave` kit uses the same cells, edges and stairs, and differs in three
ways.

- **The inner surface moves; the grid does not.** Every wall, floor and
  ceiling face is subdivided to the cell and its vertices displaced inward by
  two octaves of noise seeded from the *cell coordinate*, never from the
  storey or the room, so two faces that meet at a cell edge share their edge
  vertices and the seam is exact; the displacement is zero within 0.05 m of
  every cell edge, so the outer margin is rigid and the cells still butt.
  `rooms.ts`'s `roughenInner` is this, on the grid.
- **Tunnels are one-cell rooms.** A passage is a letter one cell wide,
  turning where its cells turn; the kit rounds the profile toward an arch and
  varies the ceiling height per room. A ramp between rooms at different
  `drop`s is a `stair` strip the cave kit renders as a rough slope under 45°.
- **Light is placed.** No windows. A `mouth` mark gives daylight at the
  entrance through the same window-light rig aimed from `bearing`; everything
  else is a lantern, a brazier, a glowing fungus — props the author places.
  The vertex occlusion of §10 is stronger in this kit.

Stalagmites, boulders, rubble and pools are props and water bodies placed by
the author. The kit does not dress its own cave.

---

## 10. Seams, light and collision

- **No two layers share a plane.** The slab drops 6 mm under boards; a
  partition's faces are 0.1 m inside each room's cell edge; skirting stands
  0.06 proud; the window board is 4 mm off the wall. The rule already exists
  and every kit piece obeys it.
- **Corners overlap.** Boundary runs span their outer extent; posts stand at
  every vertex where two or more walls meet and are the honest version of the
  overlap.
- **Trims cover joints.** Skirting at every floor–wall joint, a beam or
  cornice at every wall–ceiling joint, a lintel over every opening, a post at
  every corner. Where a kit has no trim — the cave — the roughening hides the
  joint instead.
- **Flat shading** means two faces that meet at a grid line get identical
  light and there is no lighting seam to hide; the kit never smooths a joint.
- **Occlusion in the vertices.** Every wall, floor and ceiling face carries
  an extra edge loop 0.3 m from each joint, and the vertex colour along the
  joint is darkened to 0.7 of its face colour, fading to 1.0 at the loop.
  Corners and the underside of beams are darkest. It is baked, free, and at
  this resolution it is most of what makes a room read as a room rather than
  a box with lights in it.
- **Daylight** is the window builder's, driven by `bearing` as now; the
  hearth's glow is the fireplace prop's; the fill light in
  `INDOOR_ENVIRONMENT` stays.
- **Collision** is the interior mesh, as now: one merged geometry per
  footstep material per storey (planks, flag, earth), so the surface byte is
  right and there are no per-piece micro-edges for the capsule to catch. The
  cell map is authoring resolution; the generator merges a room's floor into
  one slab and a wall run into one panel set, so the triangle count is a
  room's, not a cell's.

---

## 11. Portals and the exterior

- A portal's interior end names an edge: `{ "zone": "villager-hut",
  "edge": "front-door" }` replaces `{ "wall": "-z" }`. `wallEnd` reads the
  interior document, finds the edge, places the leaf `DOOR_PROUD` inside the
  inner face and sets the yaw from `side`. The arrival standoff is unchanged.
  `wall: '-z'` stays legal for a single-room interior with no marks and means
  the middle of that side.
- A `door` edge that no portal names is a doorway between rooms and gets no
  leaf. A `door` edge on a boundary that no portal names is a build warning:
  a door to nowhere.
- **The exterior does not have to match**, and the design keeps the Skyrim
  split on purpose: the interior is its own zone, reached through a fade,
  and may be larger than the shell for the same reason every first-person
  game's is. Two soft rules, checked at build as warnings: the interior's
  footprint is no more than one and a half times the exterior's in either
  axis, and the door edge is on the same compass side as the exterior's
  doorway anchor. Storey count and the hearth's side matching the chimney
  are the author's care.

---

## 12. Furniture in a room

Props keep world coordinates, and gain two ways to say them that count in
cells:

- **`in`**: `{ "in": "A", "at": [2.5, 0.4] }` — `at` is metres from room
  A's north-west cell corner on its storey's floor, and the storey's level
  is applied. A bed at `[2.5, 0.4]` is a bed 0.4 m from the north wall.
- **`against`**: `{ "against": { "at": [7, 2], "side": "e" }, "along": 0.5,
  "face": true }` — the prop stands on the inner face of that edge, its back
  to the wall, centred `along` the edge in 0..1, yawed to face into the room
  when `face` is set. Pegs, a dresser, a bookshelf, a bench under a window
  are all this, and none of them needs the wall's coordinate typed.

Both resolve to `at` and `yaw` at load and nothing downstream changes. This
is the part of the ask about placement being obvious: a room is addressed
by its letter, a wall by its cell and side, and the thing goes where the
words say.

---

## 13. Content and migration

`ShellSpec` is replaced by `InteriorSpec`, the document in §5. Dispatch in
`document.ts` becomes: `interior` → the generator; `shell` (the old box) is
read for one release as an `interior` with one storey and one room, then
deleted. `rooms.ts` becomes `world/interior/generate.ts`; `interior.ts` is
deleted with the box; `planOf` reads the cells.

| Zone | Today | Becomes |
|---|---|---|
| villager-hut | 10 × 8 × 3.4, `house` | 20 × 16 cells, one room, a `door` south, windows where the props are; the same house |
| cottage, farmhouse | 8 × 6.5 × 3 | 16 × 13, kit `house` |
| forest-cottage | 7 × 6 × 3 | 14 × 12 |
| workshop | 9 × 7 × 3.2 | 18 × 14, `house` with a `workshop` style |
| store | 7 × 5.5 × 2.8, `countryside-store` | 14 × 11, a `store` style |
| cellar | 6.5 × 5 × 2.4, `countryside-cellar` | 13 × 10, kit `cellar`, `hatch` under the cottage's trapdoor |
| barn | 12 × 6.5 × 5 | 24 × 13, kit `barn`, flat ceiling as now |

Every dimension and every height is the one the zone has today. The
migration changes no room's size and adds no room; a second room or a loft
is content and arrives when a zone asks for it.

Portal ends with `wall` are rewritten to `edge` ids. Furniture keeps its
world coordinates and moves to `in`/`against` only as zones are revisited.

---

## 14. Budgets

- The villager hut today: 6,978 collidable triangles for a box with boards
  and beams. As cells: one floor slab with boards (~1,200), one ceiling with
  beams (~400), four wall runs with frame and infill (~2,400), posts and
  skirting (~600), openings (~300) — of the same order, and every triangle
  is something. A second room adds its own share, not a multiple.
- A `crypt` vault is ~60 triangles a cell; a 6 × 8 crypt ceiling is ~3 k.
- A `cave` room at 0.5 m subdivision is ~8 triangles per square metre of
  surface; a 10 × 8 × 3 cave is ~4 k.
- Build: the generator is pure and captures on the worker like `rooms.ts`
  would. One `finish` per footstep material per storey.
- Draws: one to three per storey.

---

## 15. Ways to get it wrong

- **Placing a wall.** No author and no kit ever places a wall. Walls are
  derived from cells. If a wall is wanted where two cells share a letter,
  give the far cells another letter and mark the edge `open` — the
  generator then has a wall to cut and a doorway to give it.
- **Coplanar anything.** Every kit piece obeys the plane rule; a new piece
  that shares a plane with its neighbour z-fights in the shadow map first
  and in the colour buffer second.
- **A stair into a ceiling.** The generator cuts the hole. If a design needs
  the hole elsewhere, the stair is in the wrong place.
- **The quarter metre.** Cells are half a metre. A room that wants to be
  6.3 m is 6.5 m. Do not add a finer cell or a fractional span.
- **Windows that cut.** The window sits on the wall. A kit that cuts a hole
  for it has to seal the hole and light the reveal, and the builder already
  does both without one.
- **A cave that dresses itself.** Roughening is the kit's; stalagmites are
  the author's.
- **A kit for one room.** Add a kit when three zones want its architecture;
  add a style to an existing kit before that.
- **Instruments.** No overlay drawing the grid in the game. The map is the
  picture; the render is the result.

---

## 16. Not here

- No terrain inside interiors; a cave floor is a roughened slab with
  `drop`s, not a heightfield.
- No opening doors; the leaf is a prop, the transition is a fade, as
  `ZONE-TRANSITIONS.md` decided.
- No shared wall between an interior and its exterior shell; they are
  separate zones and stay so.
- No wave-function collapse, no procedural layouts. Every map is drawn.
- No furniture kits. Furniture is builders, placed with `in` and `against`.
- No checks, probes or instruments.

---

## 17. Order of work

Each a commit and a look.

1. **The map and the generator.** `InteriorSpec`, cells, edges, the
   derivation of walls, posts and trims from `rooms.ts`'s panels; `house`
   kit only; one storey; `door`, `arch`, `open` marks. Rebuild the villager
   hut as one room and confirm the picture is the same house with an honest
   corner post.
2. **Windows and hearths as marks.** The window builder placed by the edge;
   the chimney breast. Migrate the seven zones' windows to marks.
3. **Portals by edge.** `wallEnd` on edge ids; `world.json` rewritten.
4. **Storeys.** The slab pitch, stairs with the cut hole, void and
   balustrade, `hatch` and ladder, `rafters`. Give the villager hut a loft.
5. **Kits.** `stone`, `barn`, `cellar`; the project's styles folded in.
   Migrate the barn and the cellar.
6. **Occlusion in the vertices.**
7. **`in` and `against`.** Furniture addressed by room and edge.
8. **`crypt` and `cave`.** Vaults, roughening on the grid, `mouth`, ramps.
   The first dungeon zone is content and is the owner's.
9. **Delete** `interior.ts`, `ShellSpec`, the `shell` reader.

---

## 18. Decisions

Settled here so the build does not stop to ask.

- **Cell size** is half a metre, because every interior that exists lands on
  it exactly and nothing has to round.
- **Heights** are whatever each zone declares today; 2.8 house, 2.4 low,
  4.5 hall and 2.2 at a loft ridge are the defaults for rooms not yet
  written.
- **The migration adds nothing.** The villager hut stays one room. A second
  room or a loft is content, and arrives when a zone's sentence asks for it.
- **Kits in the first build**: `house`, `stone`, `barn`, `cellar`. `crypt`
  and `cave` land with the first dungeon zone.
- **Ceilings are flat** unless a storey says `rafters`. The barn keeps its
  flat ceiling as today.
- **Windows are marks** by default. A window placed as a free prop on any
  wall stays legal, because the builder needs no hole.
- **Names** as written: `interior`, `storey`, `kit`, `edge`, `span`, `in`,
  `against`. Rename freely; nothing hangs on them.

---

## 19. Precedents — research notes

- **Burgess & Purkeypile, *Skyrim's Modular Level Design*, GDC 2013**: a kit
  is a system whose pieces add up to more than their sum; a fixed footprint
  and a fixed pivot decided before the first piece; snap at half the
  footprint so misalignment is obvious; floors must have thickness so a
  stacked room's floor is never coplanar with the ceiling below; the
  loop-back and stack tests; players tire of repeated *dressing* long before
  repeated *architecture*, so kit and clutter are divorced; the cave kit as a
  rigid shell with free pieces pushed into it, joins hidden by lighting.
- **Burgess, *Fallout 4's Modular Level Design*, GDC 2016**: split walls,
  floors and ceilings into separate pieces for interchangeability; plug and
  socket transitions; "generic is versatile"; pick a pivot and never move it.
- **Stålberg, Townscaper and Bad North; Marian42's WFC write-up**: walls
  inferred from inside/outside, tiles on the dual grid so pieces sit on cell
  boundaries, typed sockets with a symmetry flag so a mismatch is a naming
  error rather than a visible one. The cells-and-edges model.
- **Boris the Brave, marching squares and the dual grid**: sixteen corner
  cases, six with rotation; posts and corners selected from the cells round a
  vertex.
- **Ian London, *Modular Level Kit Geometry***: a 3 m footprint with every
  surface inset from the footprint edge so back-to-back walls never coincide;
  inside corners need dedicated parts. The inset is our partition centring
  and the parts are our posts.
- **Level Design Book, metrics**: capsule 1.8, door 1.1–1.25 × 2.1–2.5,
  ceiling 3.0, stairs 0.15 × 0.25–0.3, in game units that are larger than
  life because a 90° field of view makes real rooms feel cramped.
- **Polycount, vertex-baked ambient occlusion**: darken vertices at joints
  and multiply; cheaper than screen-space and fully authored.
- **Valheim**: 1 m and 2 m walls, 2 × 2 floors, snap points at whole metres,
  26° and 45° roofs — the most successful "bricks" feel in a first-person
  game, on a one-metre grid.
- **Skyrim's farmhouse and Breezehome, Stardew Valley, Animal Crossing**:
  how little a room needs to read as a home — a hearth, a bed under the
  eaves, a ladder to a loft, a window with light coming through it.
