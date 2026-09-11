# Extended builders — spec

**Built.** A second kind of builder beside the one that makes an object
in a box: one that is handed a line or a region drawn on the ground and covers
it. Fences, dry-stone walls, hedges, tracks and cobbled lanes first; jetties,
kerbs, crop rows and orchards behind them; whatever else turns out to be long,
irregular and ground-hugging after that. The modular fence and wall sections,
the corner columns and the run and chain entries that lay them go.

**The one-sentence version:** a boundary is a polyline the author paints,
with marks on it where a gate, a stile or a gap should be; a *line builder*
walks that polyline by arc length, stands every post vertical on its own
patch of ground, lays every rail post to post, every stone to its own chord
and every ribbon lane on the ground under it, leaves the gaps the marks ask
for and puts the gate builder in them, and hands back one merged mesh, a chain
of colliders and its footprint — so a fence is a line, a wall is the same line
with one word changed, and neither is ever a count of sections again.

Everything here is checked against `world/track.ts`, `world/trackNetwork.ts`,
`world/placement.ts` (`layRun`, `along`), `world/kinds.ts` (`run`, `chain`,
`track`, `slab`, `layHedge`), `world/entry.ts` (`RunEntry`, `ChainEntry`,
`TrackEntry`, `BarrierEntry`), `world/ground.ts` (`PatchShape`,
`shapeDistance`), `world/coverMask.ts`, and the builders `fence`,
`fence-post`, `stone-wall`, `stone-wall-low`, the six `stone-wall-*-column`
files, `stone-wall-ruin`, `stone-wall-archway`, `hedge`, `gate`, `stile` as
they stand. Nothing is to be built to verify it — the render is the ground
truth.

---

## 1. The ask

- Builders today make a mesh inside a bounding box. The cobble and dirt
  trails are the beginning of another kind: a procedural builder that covers
  ground irregularly. There should be more of those.
- Wood fences, the cobblestone walls, the trails and cobble paths, and more as
  they come up.
- The modular design for stone walls and fences does not make sense. The fence
  should just be a boundary we paint, and the builder does the rest.
- The trails are still buggy; the new class should absorb them and fix them,
  not leave them as a separate case.

---

## 2. What this stands on

| | |
|---|---|
| `world/track.ts` | The prototype. `TrackEntry { through, width, surface, edge, wear, seed }` → `sampleLine` resamples at 0.5 m with tangent, normal and a wobbled half width; nine lateral stations; every vertex at `groundAt + profile`; crown, rutted and flat profiles; ends eased into a junction plane; dirt blended to the ground colour in the outer bands; stone surfaces recorded as `StoneStrip`s and paved *once* per network as Voronoi setts clipped to half-planes; a visible skin plus an invisible level bed carrying `underfoot`; `userData.footprint` as a capsule chain for the cover mask. |
| `world/trackNetwork.ts` | Snaps ends, finds crossings, trims arms, merges stubs, paves each junction in the winning surface. Rebuilt whole when any track changes; keyed by array index. |
| `world/kinds.ts` `run`, `chain` | `RunEntry { builder, points, pitch, most, cap }` → `layRun` per segment, chaining from the returned end because rounding to whole sections moves it. `ChainEntry { runs: [{ start, edges: [{ to, kind }] }], close }` → a pier or a post at each corner, a `slab` collider per edge. `RUNS` is a closed table of four names. `layHedge` divides a gap by 1.5 m and plants `hazel` props. |
| `builders/fence.ts`, `stone-wall.ts`, `hedge.ts` | Fixed-pitch modules — 1.4 m, 1.6 m, 1.6 m — with `sections: 1..4` and a `run` seed for what adjacent pieces must agree on. Rigid: placed at the centre's ground height, never bent or sheared to the slope. A run carries the near post of each section and `fence-post` supplies the far one. |
| `builders/stone-wall-*-column.ts` | Three plan shapes at two heights so a run can turn 60°, 90°, or 36/72/108°; `COLUMN_REACH` offsets the abutting runs. |
| `builders/gate.ts`, `stile.ts`, `stone-wall-archway.ts` | One-object builders. Openings are authored today as two runs with a gap and one of these dropped in it. |
| `world/ground.ts` | `PatchShape` = `path | blot | field`, `shapeDistance`, `GroundPatch`, `CoverPatch`. A track with `edge: 'verge'` injects a `path` cover patch two metres wider than itself. |
| `player/Collider.ts` | Per-triangle over an octree; `markCollidable` takes a subtree whole. The `slab` — an invisible box three times the standing height, sunk by the same — is the established collider for a long thing. `BarrierEntry` is its hand-authored form; `forest-path.json` has fifty-one. |
| `guidelines/ENVIRONMENT-DESIGN.md` §7 | "Human lines are straight and evenly spaced on purpose (fence posts, a row of planted trees, a wall). Natural lines never are. Do not blur the two." |
| `specs/EDITOR.md` §3.5 | Polyline, circle and rectangle tools, Top view only; a selected `run`, `chain` or `track` already gets a draggable handle per point (`editor/shapes.ts`). |
| `specs/CONTINENT.md` | Steps where a cobbled track climbs past twenty degrees: "not in this phase; noted so the strip's cross-section is built to allow it." |

---

## 3. Why the modules fail

**A module is rigid and the ground is not.** A 1.6 m wall piece sits at one
height, so on a slope one end floats and the other is buried; the fix is more,
shorter pieces, and the pitch is fixed, so there is no fix. A fence post
inside a module leans with the module.

**A run is a count.** Rounding a span to whole sections moves its end, so the
next segment starts where the last one *landed*, and a closed boundary does
not close. Corners need a pier of the right plan shape, chosen by the author,
offset by a constant the author must know.

**Openings are two runs and a prop.** The author computes where the gap
starts and ends, places the gate at the midpoint with the right yaw, and does
it again when the fence moves.

**Every kind is its own code.** `layRun` for four builders in a closed table,
`layHedge` for hedges, the track network for tracks, `slab` for chains but not
for runs — so a hedge run's collision is thousands of leaf triangles.

**And the track, which is the right idea, is keyed by index, rebuilt whole,
has hard corners, and cannot climb.** It paints nothing into the ground and
cannot be told where a ford is.

---

## 4. The model: a shape and a builder that covers it

Two new entry kinds and two new builder contracts.

| Entry | Shape | Builders |
|---|---|---|
| **`line`** | An open or closed polyline of world xz points with per-point attributes and arc-length *marks* | `fence`, `wall`, `hedge`, `track`, `kerb`, `jetty`, `rope` … |
| **`region`** | A closed polygon | `rows`, `border`; the existing `scatter` takes a region too |

A **line builder** is engine code in `art/lines/`, registered by file like
`builders/`, with:

```ts
interface LineBuilder {
  readonly name: string;
  readonly styles?: readonly string[];        // open list; a style is a recipe table
  readonly options?: Fields;
  lay(line: Line, ctx: LayContext): Laid;
  layMany?(lines: readonly Line[], ctx: LayContext): Map<string, Laid>;   // junction-aware kinds
}

interface Line {
  id: string; seed: number; closed: boolean; smooth: boolean;
  points: readonly LinePoint[];                // { at: [x, z], width?, height?, corner?: boolean }
  marks: readonly Mark[];                      // { at: metres, kind, width?, builder?, seed?, options? }
  style?: string; options?: Record<string, unknown>;
}

interface LayContext {
  groundAt: GroundAt;
  waterAt?: (x: number, z: number) => WaterQuery | null;    // WATER.md §5
  hash(index: number, channel: number): number;              // stateless, 0..1
}

interface Laid {
  parts: Part[];                               // one merged mesh through assemble/finish
  colliders: readonly OrientedBox[];           // { centre, halfExtents, yaw }
  footprint?: readonly [x: number, z: number, half: number][];   // capsule chain for the cover mask
  underfoot?: SurfaceName;
  props: readonly PlacedProp[];                // gates, stiles, arches, standards, at their marks
  wades?: readonly [x: number, z: number, r: number][];          // legs standing in water, WATER.md §5
}
```

Everything a line builder emits is what the existing pipeline already
accepts: parts go through `assemble` and `finish` as one mesh; colliders are
`BarrierEntry`'s boxes, built and marked collidable by the kind; the footprint
is the track's capsule chain; props are ordinary `prop` entries the kind
expands with an id prefix, as `prefabs` do. The kind, not the builder, does
all of that, so a line builder is pure geometry and captures on a worker.

**A style is a recipe, not a builder.** `fence` has `post-and-rail`, `picket`,
`hurdle`, `rope`; `wall` has `cotswold`, `dales`, `low`, `bank`; `hedge` has
`trimmed`, `laid`, `wild`; `track` has its five surfaces. A style is a row in
the builder's own table — pitch, rail count, stone length, course height,
colours — and a pack may not add one without adding a builder, which is the
rule for all builders. The set of *builders* is open: drop a file in
`art/lines/` and a zone may name it.

---

## 5. Walking the line

Shared by every line builder, in one module, and never reimplemented.

**Frame.** The horizontal projected frame: `T` the unit tangent flattened to
xz, `N = cross(up, T)` the horizontal left normal, `up` the binormal. Nothing
that stands on the ground wants a Frenet frame — it flips at every inflection
— and nothing here rolls. `rope` alone uses a rotation-minimising frame
(double reflection), because a rope sags and turns.

**Arc length.** With `smooth: false` the polyline's chords are the curve: a
fence *is* chords, a wall of stones is chords, and a track's corners are what
the author drew. With `smooth: true` a centripetal Catmull–Rom (α = 0.5) runs
through the points and is tabulated at sixteen samples a segment into a
cumulative-length table; every "at `s` metres" is a binary search and a lerp.
Tracks and hedges default smooth; fences and walls default not.

**Hard points.** The ends; every point with `corner: true`; every point whose
turn exceeds the builder's corner threshold (25° default); and both edges of
every mark. Hard points split the line into **runs**, and each run is treated
on its own: posts distributed along it, courses staggered from its start,
cheeks at its ends where the builder wants them.

**Even spacing, remainder distributed.** For a run of length `L` and nominal
pitch `p`: `n = max(1, round(L / p))`, `s = L / n`, an element at every
`k · s`. No short last panel, no stretched one, and the spacing never differs
from nominal by more than half a pitch. This is what a fencer does — corner
and end posts first, then divide the run equally — and it is what makes a
human line read as "straight and evenly spaced on purpose".

**Ground.** Every standing element samples `groundAt` at its own xz and
stands vertical there. Rails, copes and profiles interpolate between the
heights of the elements they join. Ribbons sample every lane at every
station. Nothing tilts to the slope except cobbles, which are small enough to
lie on it.

**Determinism.** `ctx.hash(index, channel)` is a stateless hash of the line's
seed, an element index and a channel, so adding a gate mid-run re-rolls
nothing on either side, and moving the whole line keeps its look. Jitter that
should read as age — a post's lean, a course's sag — is low-frequency noise in
`s`, not white noise per post: fences fail in stretches.

**Colliders.** One oriented box per chord of a run at the element's mean
width, from local ground to the top, chords overlapping by half the thickness
at a hard point so there is no slot at the corner. Posts get their own box
where a gap exists between them (a rope fence, a widely spaced post-and-rail
with one rail). Ribbons emit none; they are ground.

---

## 6. Marks

A mark is a thing on the line that is not the line: a place the builder must
stop and something else must stand. `at` is metres along the line from its
first point; the editor shows the readout, and a mark survives a redrawn
curve better than a point index does.

| Kind | On | What the builder does | What stands there |
|---|---|---|---|
| `gate` | fence, wall, hedge | ends the runs either side with a hanging post / cheek, snaps `width` to 1.0 (wicket), 3.0 or 3.6 m | `gate` prop, yaw from the tangent, or `builder` named on the mark |
| `gap` | any | leaves it open with proper terminals | nothing |
| `stile` | wall, hedge | cheeks either side; on a wall, two or three slabs through both faces at 0.3 m rises and a notch in the cope | `stile` prop on a fence or hedge |
| `creep` | wall | drops the lowest courses over 0.5 m and lays a lintel | nothing |
| `arch` | wall | stops at the arch's jambs | `stone-wall-archway` |
| `standard` | hedge | suppresses the bulge for 1.5 m either side | a tree builder named on the mark (`oak` by default) |
| `ruin` | wall | over `width` metres the courses tumble: stones fall outward and downward by hash, the cope goes | nothing; **opt-in weathering**, never rolled by the builder |
| `ford` | track | drops the tread to the water's bed level and switches the surface to stone across the crossing | nothing |
| `bridge` | track | suppresses the ribbon across `width` | the bridge builder named on the mark |
| `steps` | track | over `width` metres the setts become risers at 0.16 m and treads at 0.32 m | nothing |

A track that crosses a `flow` water course gets no ford by itself; the author
marks it. A wall that meets another wall gets a cheek by itself, because that
is what a wall does at its own end, and the two overlap by a stone's depth
inside the mass where nobody can see.

---

## 7. Fence

Styles: `post-and-rail` (default), `picket`, `rope`; `hurdle` later.

- **Posts** at even spacing per run: 2.4 m pitch for post-and-rail, 1.8 m for
  picket, 2.0 m for hurdle, 3.0 m for rope. Square, 0.16 m on a side — thicker
  than real, because a real post is one pixel at forty metres — 1.25 m tall
  above their own ground, sunk 0.5 m into it, leaning up to 3° on a
  low-frequency noise. Corner and end posts a third thicker. Vertical, always.
- **Rails** run from post top to post top along the chord, each its own box
  the length of its span — no stretched module. Three rails by default at
  0.35, 0.75 and 1.15 m *above each post's own ground*, so rails follow the
  slope; `stepped: true` keeps them horizontal and lets the posts' exposed
  height vary. Cleft rails sag `0.006 · span²` in the middle; sawn ones do
  not.
- **Picket**: pales at 0.14 m pitch between two rails, alternate heights by
  hash within ±2 cm, pointed tops. **Hurdle**: a wattle panel per run — a
  woven lattice of thin rods across the span as a single ruled surface. **Rope**:
  a catenary tube post to post from the same solver `WATER.md` §13 uses for
  moorings.
- **Colliders**: one box per chord, rail height. **Footprint**: none — grass
  grows under a fence.

`fence`, `fence-post`, `FENCE_SECTION`, `FENCE_MAX_SECTIONS` and `RunEntry`'s
`cap: 'post'` are deleted.

---

## 8. Wall

Styles: `cotswold` (default), `low`, `bank`; `dales` later.

The construction facts encoded, because a wall that ignores them reads as a
brick wall painted grey:

- **Two faces and a core.** Per chord of a run, one core box the wall's mean
  width and full height, in the hearting colour, so there is never daylight
  through a joint. On each face, courses of shallow **face stones** — five-
  sided open boxes, no back — standing 2–5 cm proud of the core. Big stones
  low, small high; 0.45–0.6 m long at chunky resolution, not the 0.25 m a real
  wall has, because four oversized courses read from across a field and eight
  real ones are noise.
- **Batter.** Width `lerp(base, top, y / H)`: cotswold 0.6 → 0.35 m over
  1.2 m; dales 0.75 → 0.4 over 1.4 m; low 0.5 → 0.35 over 0.7 m.
- **Courses by arc length.** Course `c` has bottom `y0` and top `y1`; along
  each face, stones step from `stagger(c)` — half a stone on odd courses —
  taking `len ± 30 %` each, capped at `R · Δθ` where the bend is tight so a
  stone never pokes through its neighbour; each stone's box is aligned to the
  chord of *its own* interval, so a curved wall is a polyline of stones and
  the face stays a face. Joints 15 mm. One over two, two over one falls out
  of the stagger.
- **Throughs** every metre at half height: one box the full width, proud on
  both faces on `dales`, flush on `cotswold`.
- **Coping** is its own course, its own colour, its own mesh edge: cotswold
  "cock and hen", thin stones on edge alternating tall and short; dales
  upright slabs; `low` a flat coverband. The cope is what gives the
  silhouette a top line.
- **Slopes.** The foundation course fills to ground — every stone's bottom
  at its own `groundAt` — and above it the courses are **horizontal and step**:
  a datum is taken every 2–3 m of arc length from the ground there, and the
  course set steps where the datum changes by more than half a course. A wall
  climbing a hill in steps is the read; courses rippling with the ground is a
  hedge.
- **Cheeks.** Every run end and every corner is a column of quoins — through-
  width boxes alternating orientation each course — replacing the six column
  builders. A corner cheek's plan is the corner's angle, not a choice from
  three shapes. Closed lines have no cheeks.
- **`bank`** is the Cornish hedge: a stone-faced earth bank with a concave
  batter, height equal to base width, top half the base, herringbone upper
  courses, a turf top in the ground colour. Faces are stones; the core is
  earth-coloured. It is one line builder style, not a hedge and a wall.
- **Colliders**: one box per chord at mean width, cope height. **Footprint**:
  the base width, so cover does not grow through the foundation.

`stone-wall`, `stone-wall-low`, the six columns, `stone-wall-ruin`,
`WALL_SECTION`, `WALL_DEPTH`, `COLUMN_REACH` and `ChainEntry` are deleted.
`stone-wall-archway` stays as the `arch` mark's prop.

---

## 9. Hedge

Styles: `trimmed` (default), `wild`; `laid` later.

- **Mesh.** A closed profile of ten points — a rounded A, wider at the base —
  swept along the smooth frame at 0.4 m arc steps, each ring's radius
  displaced by `1 + a · noise(s · f, θ)`: `a = 0.1` trimmed, `0.3` wild with a
  rougher top, `laid` in between with a visible line of stakes at 0.45 m and
  a binder rod along the top. Ends collapse to a rounded cap. Every ring's
  base sits 0.1 m under its own ground.
- **Fringe.** Fins on the top edge and the two ends, per `FOLIAGE.md` §10;
  the faces stay solid because a hedge's faces are solid and its silhouette
  is where the sky is. The hedge is the one line builder that emits canopy
  parts.
- **Bank.** `bank: true` puts the hedge on a low earth bank — the Devon
  hedge — a trapezoid sweep in the ground's colour under the profile.
- **Standards** by `standard` marks, never rolled.
- **Colliders**: one box per chord at the profile's widest. **Footprint**:
  the base width, soft edge.

`hedge`, `HEDGE_SECTION`, `layHedge` and `HEDGE_PITCH` are deleted. Hazel
stops being planted as a hedge.

---

## 10. Track

The existing builder becomes `art/lines/track.ts` with `lay` and `layMany`
— the network is its `layMany` — and these changes, each of which is a bug
or a gap on record:

- **Keyed by id.** The network keys tracks by `line.id`, never by index, and
  publishes `regions[id]` as now.
- **Smooth by default.** A track corner is a curve; `smooth: false` is legal
  for a made thing (a yard's edge, a causeway).
- **Steps** via the `steps` mark, as `CONTINENT.md` asked for.
- **Ford and bridge** via marks, reading `ctx.waterAt` for the bed level.
- **Dirt paints, cobble builds.** A dirt or gravel track's outer bands blend
  to `beside` today; that stays, and additionally the kind writes a `path`
  ground patch of the track's width and `feather` into the zone's patches,
  so the terrain under a dirt track *is* dirt for the footsteps and the cover
  mask, and the ribbon's edge lanes drop to alpha zero over the last band.
  Cobble, flagstone and boards stay ribbons with setts because a sett is a
  thing, and they get `polygonOffset` rather than a lift.
- **Junction rings, kerbs at open edges, overlapping strips** — the long tail
  of geometry fixes in the log — are re-read against the shared walk in §5.
  A junction is where two `Laid` footprints meet, and the trim-back distance
  becomes a function of both widths and the crossing angle rather than a
  constant number of half widths.

Nothing about paving changes: the Voronoi setts clipped to half-planes and
paved once per network are right and are kept whole.

---

## 11. Jetty, kerb, rope, and the rest

- **`jetty`** (styles `pier`, `pontoon`, `quay`, `slipway`): a boarded deck
  ribbon on piles at even spacing, each pile standing on the bed at
  `groundAt` and reaching the deck; the deck level is the water's `level`
  plus freeboard, read from `ctx.waterAt`, so a jetty is drawn from the shore
  into the water and stands at the right height without being told it. Piles
  are emitted as `wades` so the water gives them collars (`WATER.md` §9).
  `quay` is a wall style — `wall` with a vertical face and a coping — that
  happens to have water on one side; `slipway` is a `track` with `surface:
  'flagstone'` that runs under the level. Mooring posts by `post` marks.
- **`kerb`**: a single course of long stones along a line, for a yard's edge,
  a raised bed, a path margin.
- **`rope`**: a catenary between posts, the rotation-minimising frame, the
  mooring solver. A `fence` style and a line kind both, because a rope
  between two points with no posts is a thing on its own.
- **Later, as they come up** and only then: a plank walk over a marsh, a
  wire, a water leat as a `flow` course with kerbs, a row of standing stones.
  Each is a file in `art/lines/`.

---

## 12. Regions

A `region` entry is a closed polygon and a builder that fills it.

- **`rows`**: a bearing (or the polygon's longest edge), a row pitch, a plant
  pitch, a headland inset, and a builder to plant. Rows are lines clipped to
  the polygon; plants stand by arc length along each with a small jitter.
  Crop rows at 0.4–0.75 m; an orchard at 6 × 5 m with `fruit`. The polygon
  is also written as a `crop` ground patch when the builder says so, so the
  soil under the rows is soil.
- **`border`**: the polygon offset inward by `width` — mitred normals with a
  limit — and the ring between filled by a line builder run along it: a kerb,
  a low wall, a fence, a hedge round a field. This is how a whole field gets
  its boundary from one shape.
- **`scatter`** exists and gains `within: region-id`, with Bridson Poisson
  discs inside the polygon and an edge falloff, replacing the rectangle it
  takes today. Density gradients from hearts, as the environment guideline
  asks.
- **Floors** — a gravel yard, a flower bed — are ground patches already
  (`field`, `blot`, `path`) and a polygon `PatchShape` is added so a patch
  can be any shape. Triangulation for a polygon ribbon or a floor is ear
  clipping; the polygon-with-holes case is `earcut`, vendored, if it is ever
  needed.

---

## 13. Authoring

```json
{ "id": "north-field-wall", "kind": "line", "builder": "wall", "style": "cotswold",
  "seed": 4127, "closed": false, "smooth": false,
  "points": [ { "at": [12, -4.5] }, { "at": [20.5, -3] }, { "at": [26, 2], "corner": true } ],
  "marks": [ { "at": 7.5, "kind": "stile" }, { "at": 18, "kind": "gate", "width": 3 } ] }

{ "id": "orchard", "kind": "region", "builder": "rows",
  "points": [ [0, 0], [30, 2], [28, 22], [-2, 20] ],
  "options": { "bearing": 12, "rowPitch": 6, "pitch": 5, "headland": 2, "plant": "fruit" } }
```

`y` is never stored; it is sampled. A line's `points` serve any builder, so
swapping a fence for a wall is one string. The same polyline drawn once can
be named by a `border` region, a `track` and a `hedge` — a lane between two
hedges is one line and three entries. Every entry is keyed by `id` and merged
by id; nothing here is keyed by position.

**The editor** already draws polylines and drags their points. It gains: a
live arc-length readout on the selected line; right-click on a segment to add
a mark at that `s`; a mark inspector for `kind`, `width` and `builder`;
snapping a new point to another line's point so a field edge and its fence
share a vertex. `EDITOR.md` §3.5 is where those land.

---

## 14. Migration

| Today | Becomes |
|---|---|
| `run` entries (`fence`, `stone-wall`, `stone-wall-low`, `hedge`) | `line` entries with the same points, `builder` by name, `style: 'low'` for the low wall |
| `chain` entries with `edges[].kind` | one `line` per contiguous kind; `close: 'hedge'` a `border` region |
| gaps authored as two runs and a `gate` prop | one line and a `gate` mark |
| `track` entries | `line` entries with `builder: 'track'`, `surface` in `options`; `through` → `points` |
| `barrier` entries that shadow a run | deleted; the line's colliders replace them |
| `stone-wall-archway` props at a wall's end | an `arch` mark |
| `hazel` planted by `layHedge` | the hedge's own fringe |

Zones touched: every zone with a `run`, `chain` or `track` — `village`,
`farm`, `forest-path`, `riverside`, `beach-path`, `coast`, `plains`. The
migration is mechanical for runs and tracks and a judgement for chains, which
is the owner's.

---

## 15. Budgets

- A 100 m cotswold wall: two faces × ~200 stones × 5 courses × 10 triangles
  plus cores, throughs and cope — about 25 k triangles, one draw. Today's
  sixty-two sections of `stone-wall` are of the same order and sixty-two
  draws.
- A 100 m post-and-rail fence: 42 posts and 123 rails, under 3 k triangles,
  one draw.
- A 100 m hedge: 250 rings × 10 = 5 k triangles of sweep plus ~120 fins,
  one art draw and one canopy draw.
- Colliders: one box per chord; a zone's boundaries are tens of boxes where
  `forest-path` has fifty-one hand-placed barriers today.
- Build: every line builder is pure and captures on the worker pool like a
  prop. The track network stays the one thing built on the main thread until
  `layMany` is made capturable, which it can be.

---

## 16. Ways to get it wrong

- **A module in disguise.** No line builder may place a fixed-length piece
  and stretch or overlap it. Every rail, stone and ring is sized to its own
  span.
- **A tilted post.** Posts, piles, cheeks and stakes are vertical at their
  own ground. Only cobbles lie on the slope.
- **Courses that ripple.** A wall's courses are horizontal and step. If the
  owner prefers the ripple it is one flag, not a default.
- **Rolling what a mark should say.** No gap, ruin, standard or fallen stone
  that a mark did not ask for. Weathering is opt-in.
- **Dressing.** A wall does not scatter chips. A hedge does not drop leaves.
  A track does not wear a patch at its own gate — the author places the
  patch. The builder covers the shape it was given and nothing beside it.
- **Two lines at a pixel.** A dirt track under a cobbled one is the author's
  mistake; the network trims tracks of different surfaces against each other
  and does not try to blend them.
- **Signs.** `N = cross(up, T)` is the *left* normal. State it once in the
  frame module and nowhere else.
- **Index keys.** Nothing in a network is keyed by array position.
- **Instruments.** No debug overlay draws the polyline in the game. The
  editor shows the shape; the render shows the result.

---

## 17. Not here

- No terrain deformation by a line. Sunken lanes and ditches are `channel`
  landforms the author places; a track does not carve the ground.
- No road network solver, no A-star lanes, no desire paths computed. Tracks
  go where the author draws them; the level-design guideline says where that
  should be.
- No polygon boolean library. Mitred offsets with a limit and ear clipping;
  `earcut` vendored only when holes are needed.
- No wire fences. One-pixel lines flicker and the guideline forbids them.
- No new one-object builders except `pine` and `fruit`, which are
  `FOLIAGE.md`'s.
- No checks, probes or instruments.

---

## 18. Order of work

Each a commit and a look.

1. **The walk.** `art/lines/walk.ts`: frame, arc-length table, hard points,
   remainder spacing, hash, collider chain. The `line` and `region` kinds
   registered, expanding `Laid` into a mesh, barriers, a footprint and props.
   Nothing names them yet.
2. **Fence.** Post-and-rail on the walk, with `gate` and `gap` marks. Migrate
   one zone's fences; delete `fence`, `fence-post`, the `run` kind's fence
   row.
3. **Wall.** Cotswold and low, cheeks, stepped courses, `gate`, `stile`,
   `creep`, `arch`, `ruin`. Migrate; delete the wall builders, the columns,
   `chain`.
4. **Hedge.** Sweep, bank, standards; fringe when `FOLIAGE.md`'s canopy
   material exists, solid until then. Migrate; delete `hedge`, `layHedge`.
5. **Track.** Move into `art/lines/`, key by id, smooth, marks for steps, ford
   and bridge, dirt as a ground patch. Re-read the junction fixes against the
   shared walk.
6. **Regions.** `rows`, `border`, `scatter` within a polygon, polygon
   patches.
7. **Water lines.** `jetty` with `wades` and `waterAt`; `rope`; `quay` and
   `slipway` as styles. Lands with or after `WATER.md`'s field.
8. **Editor.** Arc-length readout, marks, snapping.

---

## 19. Decisions

Settled here so the build does not stop to ask.

- **Styles in the first build**: fence `post-and-rail`, `picket`, `rope`;
  wall `cotswold`, `low`, `bank`; hedge `trimmed`, `wild`. `hurdle`, `dales`
  and `laid` are rows in the tables, added when a zone asks for them.
- **Stones are oversized**, 0.45–0.6 m, four to five courses. Readability
  at chunky pixels beats a real wall's count.
- **Courses step** on a slope; the foundation course fills to ground.
- **Posts** are 0.16 m square, 1.25 m tall, three rails, corner posts a
  third thicker.
- **Corner threshold** is 25°.
- **A whole field's boundary is a `border` region**; anything partial — a
  fence along one side of a lane, a wall that stops at a crag — is a `line`.
- **Names** as written: `line`, `region`, `mark`, `wall`. Rename freely;
  nothing hangs on them.

---

## 20. Precedents — research notes

- **Unreal Landscape Splines**: control points with half-width, side and end
  falloff, a paint layer, raise/lower terrain; segments with meshes and a
  seed. The origin of "paint the ground under a dirt track, build the
  cobbles".
- **Unreal PCG spline fences, Unity `SplineInstantiate`, Godot
  `CSGPolygon3D`**: every engine ships *deform a mesh along a segment* or
  *instance at intervals*, and none ships remainder distribution, corner
  posts, vertical posts on a curve or gate segments. §5 and §6 are what they
  leave out.
- **Houdini fence tools** (Sicotte; SideFX Project Titan): resample by length
  for pitch, detect corners by angle, build corner geometry specially, gates
  as a second input.
- **Fencing practice** (UK post-and-rail): corners and ends first, then
  divide the run equally; 1.8–2.7 m post pitch; three rails at 1.2 m.
- **Dry-stone walling** (Conservation Handbooks; Cotswolds National
  Landscape; the Cornish Hedgers Guild): batter, one-over-two, throughs,
  coping styles, cheeks, horizontal stepped courses, smoots and creeps and
  stiles, the Cornish hedge as a stone-faced bank.
- **Wang, Jüttler, Zheng, Liu 2008, *Computation of Rotation Minimizing
  Frames***: the double-reflection method, for the rope.
- **Kearney et al., arc-length parametrisation by table and binary search**;
  centripetal Catmull–Rom against cusps.
- **DesLauriers, *Drawing Lines is Hard*; `extrude-polyline`**: mitre
  direction and length, the mitre limit, the bevel fallback, inner-edge
  self-intersection on tight bends.
- **Bridson 2007, fast Poisson disc sampling**: the scatter inside a region.
- **Konstantin Magnus, road on a heightfield**: blur heights *along* the
  curve. Not adopted — a track does not carve the ground here — but the
  reason a walked track looks walked.
- **Stardew Valley fences, Breath of the Wild walls**: posts thicker and
  taller than real, few large stones per metre, the cope as its own line.
