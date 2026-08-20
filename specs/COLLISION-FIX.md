# Collision fix

Status: **proposed**, nothing built. Four phases, in order. Phases 1 and 2 are engine
work in one file and need no content decisions; phases 3 and 4 are the builder contract
and the retrofit behind it.

---

## The bug

Walking into geometry with a lot of detail on it drops frames badly. It used to happen
with signage and stopped when lettering was flagged `noCollide`; it still happens with
factory doors, and with anything else dense you can press a capsule against.

The doors are not special. They are ~950 triangles in a doorway, and a doorway is
exactly where a wall's and a floor's large triangles pass through. Two defects in
three's `Octree` (`node_modules/three/examples/jsm/math/Octree.js`) multiply together,
and a feedback loop in `Controller` turns the product into a stall.

**The tree subdivides to its depth cap, duplicating triangles as it goes.** `split()`
recurses while a node holds more than 8 triangles and `level < 16`. It never asks
whether subdividing actually *separates* anything — a triangle straddling a boundary is
copied into every child it touches. Dense small detail drives subdivision down to the
cap, and every large triangle passing through that volume is copied into all of the
thousands of leaves that result. Every zone bottoms out at the cap:

| zone | unique tris | octree entries | nodes | duplication |
|---|---|---|---|---|
| villager-hut | 6,978 | 323,226 | 99,126 | ×46 |
| factory | 8,584 | 205,170 | 62,682 | ×24 |
| village | 33,662 | 790,287 | 235,615 | ×24 |
| hut-room | 2,396 | 102,576 | 33,303 | ×43 |

**The candidate gather dedupes with a linear scan.** `getCapsuleTriangles` runs
`triangles.indexOf(t) === -1` for every entry it visits, so the cost is *entries visited
× candidates so far*. At the worst spot in villager-hut it visits **74,536 entries to
return about 600 candidates** — 6 ms for a single query.

**`Controller` then issues up to ~17 queries per sub-step** when the capsule is pressed
into geometry: `resolve` up to 4, `snapToGround` up to 6, `tryStepUp` up to 7
(`Controller.ts:736,815,858,867`). At 60 fps that is 2 sub-steps, so ~34 queries — 34 ×
6 ms is the drop. And it feeds back: a slow frame means a larger `dt`, which means more
sub-steps, up to `MAX_SUB_STEPS = 16`, which is slower again. That is why it reads as a
bad drop rather than a dip.

Worth knowing while reading the HUD: `Collider.triangles` (`Collider.ts:139`, surfaced
via `main.ts:479`) counts *duplicated entries*, not unique triangles. It reads 323k for
a 7k-triangle hut, which is most of why this went unnoticed.

### Measurements

Headless, Node on desktop, mean of 300 repetitions at the worst capsule position found
by a 0.5 m grid sweep of each zone. Ratios should hold on a phone; absolute figures will
not.

| zone | today | + phase 1 | + phases 1 & 2 |
|---|---|---|---|
| villager-hut | **5.95 ms** | 1.74 ms | 0.027 ms |
| factory | 1.59 ms | 0.14 ms | 0.054 ms |
| hut-room | 1.04 ms | 0.18 ms | 0.016 ms |
| hut-room-2 | 0.98 ms | 0.10 ms | 0.019 ms |
| exterior | 0.12 ms | 0.08 ms | 0.001 ms |

---

## Phase 1 — Stamp the gather instead of scanning it

Replace the `indexOf` dedupe with a per-query stamp. Each triangle carries the id of the
last query that claimed it; a triangle already stamped with the current id is skipped.
That is O(1) per entry instead of a linear scan over the accumulated array.

Lives in `Collider.ts` as a private walk over the octree's nodes, replacing the calls to
`getCapsuleTriangles` in `intersectCapsule` and `overlaps`, and to `getRayTriangles` in
`raycast`. Three's `Octree` is still what indexes and stores; only the query side
changes.

Two details that matter:

- **The stamp counter must be monotonic and never reset**, or a stale stamp from a
  previous frame reads as current and triangles go missing — a player walking through a
  wall, once, unreproducibly. A plain incrementing integer is fine; at ~300 queries a
  frame it outlives the heat death of the session.
- **Duplicates are already harmless to correctness.** `intersectCapsule` takes the
  deepest contact and `overlaps` returns on the first hit, so processing a triangle
  twice changes nothing. Dedupe is purely an optimisation, which is why it can be
  replaced without touching the narrow phase.

`raycast` also allocates a `THREE.Ray` per call; worth fixing while in there, since the
audio occlusion path (`Emitter.ts:362`) drives it.

**Done when** the worst-spot query cost in villager-hut is under 2 ms and
`check:movement` and `check:world` pass unchanged.

## Phase 2 — Stop the split when it stops separating anything

Replace `Octree.split` with one that refuses to subdivide when subdivision is only
making copies. Two guards and a lower cap:

- **No progress** — if any child would receive 90% or more of the parent's triangles,
  stop and stay a leaf. This is the case that runs away today: nine large triangles that
  all straddle the whole box stay nine in every child, forever, to depth 16.
- **Net duplication** — if the eight children between them would hold more than ~2.5×
  the parent's count, the split is costing more than it saves.
- **Depth cap ~11** rather than 16.

Measured effect: entries fall 4.6×, nodes 7×, and build time and memory with them. The
depth caps land at 9–12 by zone rather than pinned at the maximum.

Also fix `Collider.triangles` to report unique triangles, so the HUD stops lying.

**The thresholds above are from one measurement pass and are not tuned.** They are a
starting point; phase 2 should re-run the sweep and settle them.

One risk worth stating plainly: reshaping the tree changes which triangle is visited
first, and therefore which contact wins a tie on depth in `intersectCapsule`. The
movement checks are the guard, and here they are load-bearing rather than a formality —
run them with `--trace` on the stair and slope fixtures.

**Done when** the sweep shows no zone above ~0.1 ms at its worst spot, zone build time
has not risen, and both check suites pass.

## Phase 3 — Collision belongs to the builder

Phases 1 and 2 make the index cheap. They do not make it *right*: 43,786 triangles
across the kit are currently collidable, and most of them are things nobody can lean on.
The builder is the only place that knows which parts of a prop are made of something.

**The principle: collidable geometry should resemble only the part of a thing that can
actually be collided with or stepped on.** Branches and trunks, not leaves. A door's
leaf and frame, not its rivets, straps, hinges, handle or window bars.

`Part` (`assemble.ts:36`) is the hook. It already carries `sway`, `wear` and `wearTint`
as per-part fields baked at build time; whether a part is made of anything is one more
field of exactly the same kind, and for the same reason — it is cheap to state while the
geometry is being generated and effectively impossible to infer afterwards, once the
parts have been merged.

Mechanism, with no changes to `Collider` at all:

- `assemble` merges the solid parts into a second, position-only geometry.
- `finish` hangs that off the prop as an invisible child and flags the visible mesh
  `noCollide`.
- `markCollidable` already prunes by subtree and recurses into children, and
  `Octree.fromGraphNode` filters on layer rather than visibility, so both ends already
  do the right thing.

No draw call — the child is never rendered — and the collision geometry is smaller than
what is indexed today.

Two grades, and both are worth having:

- **Tagging a part non-solid.** Covers foliage, where the render geometry is already the
  right shape for the solid parts and the canopy simply drops out.
- **Giving a part a simpler solid stand-in.** Covers anything subdivided for shading
  rather than for form. The factory door's leaf is 304 triangles only because it is
  `BoxGeometry(width, height, leafThickness, 6, 10, 1)` — subdivided 6×10 so the wear
  gradient can bend across it (`factory-door.ts:132`). As collision it is a 12-triangle
  box. Tagging alone takes that door from ~950 collidable triangles to ~376; the
  stand-in takes it to ~72.

**The default must be solid.** Opt-out, not opt-in, or a builder written next month
silently becomes walk-through and nothing says so. This also makes phase 4 safe to do
incrementally: every builder nobody has got to yet behaves exactly as it does now.

Existing whole-prop machinery stays as it is. `MeshBuilder.solid = false`
(`types.ts:88`) already excludes 23 builders — grasses, flowers, moss, sticks, poultry —
and remains the right answer for a prop that is soft all the way through. The per-part
field is for props that are solid *somewhere*.

**Done when** a builder can express "this part is decoration" and the gallery, the zone
checks and the movement checks all still pass.

## Phase 4 — The grandfathered builders

Everything in `builders/` predates the rule and was swept into the collider wholesale.
This phase goes back through them. It is safe to do incrementally and in any order,
because the default is solid.

**Foliage first. It is 57% of the entire problem.** Ten builders — tree canopies —
account for ~25,150 of the kit's 43,786 collidable triangles, and they are the purest
case of the rule: trunk and branches solid, leaves not.

| builder | category | collidable tris |
|---|---|---|
| `rowan` | foliage | 5,280 |
| `elder` | foliage | 3,828 |
| `birch` | foliage | 3,500 |
| `spruce` | foliage | 2,488 |
| `hazel` | foliage | 2,424 |
| `gorse` | foliage | 2,292 |
| `small-rowan` | foliage | 2,168 |
| `hoist` | structures | 1,740 |
| `oak` | foliage | 1,412 |
| `small-spruce` | foliage | 1,058 |
| `factory-door` | structures | 876 |
| `spinning-wheel` | furniture | 768 |
| `chainlink` | structures | 720 |
| `machine` | structures | 708 |
| `panel` | structures | 700 |
| `small-birch` | foliage | 700 |
| `factory-trapdoor` | structures | 564 |
| `tank` | structures | 552 |
| `stair` | structures | 516 |
| `porcine` | animals | 504 |

In place, the same picture by zone: trees are 39% of the village's collision index and
bushes another 13%; the factory is machines, pipes and the hoist; the villager hut is a
spinning wheel, two lanterns and a bunch of hanging herbs.

Suggested order, by payoff over effort:

1. **Tree canopies** — `rowan`, `elder`, `birch`, `spruce`, `hazel`, `gorse`, `oak`, and
   the four `small-*` variants. Pure tagging, no new geometry, over half the win.
2. **Doors and hardware** — `factory-door`, `factory-trapdoor`, `hut-door`,
   `hut-trapdoor`. The case that prompted this. Wants the stand-in grade for the leaf.
   Frame and leaf must stay solid so `DoorMetrics` and the portal arrival markers are
   unaffected.
3. **Works fittings** — `hoist`, `chainlink`, `machine`, `pipes`, `tank`, `panel`,
   `vent`. Mostly greebling on simple volumes.
4. **Furniture and objects** — `spinning-wheel`, `stove`, `fireplace`, `sink`, `bell`,
   `lantern`. Small individually; they add up in interiors, which is where the worst
   query cost is.
5. **Animals** — `porcine`, `bovine`, `equine`, `ovine`, `dog`. Whether an animal should
   be collidable at all is a design question, not a performance one.

Leave alone, deliberately:

- **`stair`, `ladder`, `railing`, `fence`, `archway`.** The treads are what make
  `tryStepUp` work; a simplified stair is a ramp or a wall. These keep their real
  geometry.
- **`terrain`, `flatGround`, `interior`.** These *are* the collision surface. 6,952
  triangles of village terrain and 5,408 of exterior ground cannot be tagged away, which
  is the standing reason phases 1 and 2 are worth doing on their own merits — and why
  Phase 5's sculpted terrain will put the pressure back regardless.

**Done when** every builder in the table has been through the rule, and the kit's total
collidable count is reported in `check:art` so it cannot drift back up unnoticed.

---

## Ordering, and why

Phases 1 and 2 first, before any content work. They are one file, no naming, no design
decisions, and they make collision cost stop being superlinear in local density. Doing
phases 3 and 4 first would mean authoring collision for 92 builders while the index
underneath is still quadratic — tuning content to dodge an engine bug, which is the
treadmill the lettering fix started down.

With phases 1 and 2 done, phase 4 stops being urgent and becomes what it should be: a
pass over the kit deciding, calmly and per prop, what each thing is made of.

## Checks

- `npm run check:movement` — the collision narrow phase, stairs, slopes, the crouch
  tunnel. Load-bearing for phase 2.
- `npm run check:world` — portal round trips, arrivals not inside scenery, sealed
  interiors not leaking. Load-bearing for phases 3 and 4: a gap in a room is the
  failure mode of over-tagging.
- `npm run check:art` — should gain a collidable-triangle report in phase 4.

## Open questions

- **What the per-part field is called.** `solid` is taken at the builder level
  (`types.ts:88`) and means the whole prop; the per-part concept is a sibling and needs
  its own word. Naming belongs to the repo owner.
- **Whether the stand-in grade lands with phase 3 or later.** Tagging alone is a smaller
  change and gets the foliage win in full; the stand-in is what gets the doors from 2.5×
  to 13×.
- **Whether animals are collidable at all.**
- **Phase 2's thresholds** — 0.9, 2.5 and depth 11 are a starting point from one
  measurement pass, not a tuned answer.
