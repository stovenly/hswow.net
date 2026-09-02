# The continent — spec

Not built. Eight zones and three interiors, hand placed, that together are the
demo: a village with a farm and a plain at its gates, a river and a crossroads
past those, a wood with a house in it, and the sea at the end.

The debug hall is cut loose. Documents connect only to documents; everything
under `projects/debug/code/` stays reachable from the proving ground and
nothing in it reaches a place.

---

## Decided

- **Names lose "Demo".** `Village`, `Cottage`, `Workshop`, `Store`, `Cellar`.
  The ids go with them — `village`, `cottage`, `workshop`, `store`, `cellar` —
  so the new zones (`farm`, `plains`, …) are not the odd ones out. Saves
  written before this are void, which an in-progress app can afford once.
- **One compass for the whole country.** `+X` is east and `+Z` is south in every
  outdoor zone, and the `place` of each zone on the map agrees with which wall
  its gates are in. Walking south out of the village arrives at the north end
  of the plain. Nothing turns the world between zones.
- **Exits are gaps you walk through, not doors you press.** Every link between
  two outdoor zones is a `volume` end on both sides, set in a gate — a stone
  arch where there is a wall to put it in, a pair of crags, two oaks and a
  deadfall, a hazel tunnel — with the far zone's name over the crosshair from
  the approach. Doors stay doors: the interiors keep `doorOf` ends.
- **The vista says what is next.** Each zone's ring puts the neighbour's
  country in the neighbour's direction — roofs toward the village, a treeline
  toward the wood, a glint of water toward the river and the sea — and one
  landmark per zone that is not generic, per the vista spec's landmark rule.
- **Path zones are open hallways.** A corridor 10–16 m wide between banks the
  controller cannot climb, bent so the far gate is never seen from the near
  one, with a pocket at each bend that has one thing in it, and the vista
  showing over the bank at every bend. The reference is Fable's Greatwood and
  Bowerstone roads, and the two rules that make those work: the player always
  sees the next landmark before losing the last, and the walls are ground and
  trees, never a line the player can test.
- **Water is as many planes as the body needs.** A river is a chain of `water`
  entries along its course, one per reach, overlapping at the joins and all at
  one height; the sea is one broad plane and a wider, coarser one behind it.
  The banks hide every corner — the shader's own depth test does the cropping,
  so the waterline meanders wherever the ground crosses the surface, and two
  planes overlapping at one height draw the same thing twice to the same
  result. The one constraint is on the ground: **every walkable point inside
  any water plane's box stands above its surface.**
- **Paths are tracks.** Every path named below is a `track` entry (phase 1b):
  `dirt` for the roads between zones and the farm yard, `cobble` for the
  village lanes, `gravel` for the crossroads, `boards` over the mire. Sand is
  the ground itself and needs none.
- **The sea is wadeable, not swimmable.** Swimming is its own spec and is not
  built. The beach's bed stays under 1.4 m to the level's outline, an invisible
  `barrier` holds the player at chest depth along it, and the bed drops past
  that so the colour deepens. The barrier comes out when swimming goes in.
- **Hob moves to the farm.** Nobody new is written. The forest cottage stands
  empty inside: a resident is a person file, and people are yours.
- **The village keeps its hens and its dog.** The cattle, sheep and pigs go
  with the pen; they are the farm's now.
- **Farm interiors borrow the village's rooms.** There is no farm interior
  vibe. The farmhouse takes `village interior 1` (the hearth room) and the barn
  `village interior 2` (the hard-floored one) through the existing house and a
  new barn environment. Whether the farm wants a reduction of its own band is a
  music decision, and yours.
- **The map takes care of itself.** Zone families come off the vibe, the beach
  family already sits low on the land field, and `place` seeds the layout, so
  the continent is drawn from the same eight files.

## Open

- `villager-hut` is a document reached from the debug hall. It is a demo of the
  hut, not a place, so it keeps its door. Say if it should be cut too.
- The plains' one built thing — a cairn on the high ground, below — and the
  crossroads' signboard both carry text the builders can render. What the
  board says is yours; the spec leaves it blank.

---

## The graph

```
            Farm ──── Riverside
             │            │
          Village      Forest Path ──── Forest ──── Beach Path ──── Beach
             │            │
           Plains ────────┘
```

A loop and a tail. The loop is village → plains → crossroads → riverside →
farm → village, walkable either way; the tail is the crossroads' third arm.

| zone | id | vibe | `place` (km, east/south) | gates |
| --- | --- | --- | --- | --- |
| Village | `village` | `village 1` | 0, 0 | S → plains · W → farm |
| Farm | `farm` | `farm` | −1.7, 0.2 | E → village · S → riverside |
| Plains | `plains` | `plains 1` | 0.3, 1.6 | N → village · SW → forest path |
| Riverside | `riverside` | `riverside` | −2.6, 1.8 | N → farm · SE → forest path |
| Forest Path | `forest-path` | `forest path a` | −1.3, 3.0 | NE → plains · W → riverside · S → forest |
| Forest | `forest` | `forest a` | −1.5, 4.5 | N → forest path · SE → beach path |
| Beach Path | `beach-path` | `beach path` | −0.6, 5.7 | NW → forest · S → beach |
| Beach | `beach` | `beach` | 0.2, 6.8 | N → beach path |

Interiors, all `doorOf` ends on the building placed in the zone:

| zone | id | building | environment / vibe |
| --- | --- | --- | --- |
| Cottage, Workshop, Store, Cellar | `cottage` … | as now | as now |
| Farmhouse | `farmhouse` | `cottage` builder, in the farm | `countryside-house` / `village interior 1` |
| Barn | `barn` | `barn` builder, in the farm | new `barn` / `village interior 2` |
| Forest Cottage | `forest-cottage` | `cottage` builder, in the forest | `countryside-house` / `village interior 1` |

Every outdoor zone carries `place`, a `skirt`, `regions.outline`, an
`edgeFade`, a wind-and-rain `bed` as the village has, the vibe, and a
`vistaRing` and `dressing` entry. The terrain square is about two and a half
times the playable extent, as the village's is, and the playable boundary is a
thing in the world — a wall, a bank, a treeline — with the terrain past it
dressed and the skirt past that.

## The gate

A gate is a place in a zone's boundary, an object standing in it, and a
`volume` end centred in the opening. The object is one of:

- `stone-wall-archway`, where the boundary is a wall — the village's two, the
  farm's yard gate;
- two `crag`s or `outcrop`s with the path between, where the boundary is
  rock — the plains' far end, the crossroads' north-east arm, both ends of the
  beach path;
- two big trees with a `deadfall` or `root-tangle` under them, where the
  boundary is wood — the crossroads' south arm, the forest's ends;
- a `hazel` tunnel, where it is hedge — the crossroads' west arm, the
  riverside's ends.

The volume is the width of the opening, 2.6 m tall, 1.5 m deep, and the end's
`arrival` is three metres inside the zone facing in, so nobody lands in the
box. The track runs through the gate and on to the terrain edge, and the road
on the far side is the same surface, so the map's road and the ground agree.
Each end states `prompt.title` as the road — `Farm Track`, `Cart Road`, `River
Path`, `Wood Road`, `Sand Track` — and the far zone's name is the second line.

---

## Phases

Each phase is one commit and leaves the game bootable. The order is the loop
first, then the tail, because the loop is where the crossings are exercised
both ways.

### Phase 0 — Cut loose and rename

- `world.json`: `countryside-gate` goes. `hut-door` stays (see *Open*).
- The five countryside documents take their new ids and names; `world.json`
  and the people files (`home`) follow. `project.json` `start` and
  `editorEntry` become `village`.
- `projects/debug/code/countryside.ts` shrinks to the ids the code still
  needs (`ZONE_COUNTRYSIDE` → `village`, read by `index.ts` for the prebuild);
  `COUNTRYSIDE_GATE` has no reader and goes.
- `hob.json` gains `"home": "farm"`.

### Phase 1 — What the zones need from the engine and the project

Small, and all of it in service of a document.

- **`water` entries taper.** A `taper` field (metres): the plane's chop is
  scaled by the column under each vertex, `smoothstep(0, taper, surface −
  groundAt)`, so a swell dies as the bed comes up instead of driving through
  the sand. The kind has `ctx.groundAt`; the plane already takes a chop
  function. Omitted, the chop is flat as now.
- **A `barn` interior style and environment**, registered in
  `projects/debug/code/presets.ts` beside the house and the store: boards
  underfoot, timber walls to a five-metre eave, the store's fog and the
  `village interior 2` vibe. `interior.ts` already takes a registered style by
  name.
- **Nothing else.** The channel, scarp, terrace and rim landforms, `barrier`,
  `chain`, `run`, `scatter`, `dressing`, `vistaRing`, the `surf` and `water`
  emitters, and every builder named below exist.

### Phase 1b — Tracks

A path today is a ground patch: the terrain's own triangles, coloured. At
three metres a quad that is a two-metre lane drawn with a three-metre brush —
its edge is wherever the nearest vertex fell, it has no thickness, no camber,
no stones, and cobble and dirt differ only in tint. Every zone in this spec is
made of paths, so this comes first.

**A track is an entry kind that builds the surface as geometry**, draped on
the terrain along a polyline the way a `run` drapes a fence — the world layer
already samples ground for runs, chains and scatters, and a track is the same
idiom. The builder rule stands: a track builds the surface it was asked for
and nothing beside it.

```json
{ "kind": "track", "through": [[0, 22], [0, 12], [0, 3]], "width": 3,
  "surface": "cobble", "edge": "kerb", "wear": 0.6, "seed": 71 }
```

- **`through`, `width`** — the centreline and the width, as a path patch has.
  The strip is resampled at half a metre, cambered a hand's height at the
  crown, and its outline wobbled by a seeded noise so it never reads as a
  ribbon. Every vertex sits at `groundAt` plus a few centimetres.
- **`surface`** — what it is made of, and each is its own geometry:
  - `cobble`: setts in courses across the width, each a low rounded stone of
    six to eight vertices, jittered in plan and sunk to a near-level top, over
    a dark grout strip. Around twenty triangles a stone and four stones a
    square metre — a sixty-metre lane is twenty thousand triangles, merged.
  - `flagstone`: irregular slabs with staggered joints, one to the square
    metre, a few tilted a degree.
  - `gravel`: a fine strip with per-vertex colour noise at a quarter-metre
    tessellation, pebbles scattered thicker at the verges, two shallow ruts.
  - `dirt`: the worn one. Two ruts, a crown between with tufts at its edge,
    embedded stones, and the verge colour blending to the ground's own over
    the last half metre — a soft edge as vertex colour rather than a painted
    one.
  - `boards`: a boardwalk on bearers, for the mire in the plains' basin and
    a stretch of the river path. Planks with gaps.
- **`edge`** — `kerb` (a course of kerb stones, cobble and flagstone only),
  `verge` (a band of `tussock` cover a metre wide outside the strip), `none`.
- **`wear`** — 0..1: how worn. Rounds the setts, deepens the ruts, thins the
  tufts, lifts the verge blend.
- **`underfoot`** comes from the surface, so the footstep model hears cobble
  on a cobble track without a second declaration.

**A track declares its ground once.** The interpreter reads every `track`
entry before the terrain is built and adds the patch under it — the surface's
own material at the strip's width, and `cover: none` with a hard edge — so the
three copies of one polyline the village carries today (patch, cover, and now
the track) become one. The village's four paths convert; the polyline lives in
the track and nowhere else.

**Steps.** Where a `cobble` or `flagstone` track climbs past twenty degrees the
setts become risers — a flight, cut into the slope. Not in this phase; noted
so the strip's cross-section is built to allow it.

**Scatters keep off it** as they keep off patches now: a track's strip is a
`path` shape and `avoid` can name it by the track's `id`.

### Phase 2 — The village

- **The pen goes.** `cattle`, `sheep`, `pigs`, `pen-fence`, the `mire` blot,
  the `reeds` and `nettles` that stood in it, `cattle-calls`, `sheep-calls`,
  and the keep-clear blot at (−15, −11). The ground there is turf and the
  existing scatters fill it; nothing is put in its place.
- **A second gate, west.** A `stone-wall-archway` at (−22, −2) facing west, the
  cobble lane from the store extended to it as `dirt`. The west chain run ends
  at the arch's north jamb and a new run starts at its south jamb, so the wall
  reads as one wall with a gate in it.
- **The four paths become tracks.** The gate road `dirt` with a `verge`, the
  three lanes `cobble` with a `kerb`; the patches and cover patches that
  carried those polylines go.
- **The south arch** keeps everything it has; only its far side changes.
- **Portals.** `village-plains`: the south arch volume ↔ the plains' north
  gate. `village-farm`: the west arch volume ↔ the farm's east gate.
- **Vista re-aimed.** South, low: `vista-hill` ×3 and `vista-field-wall` ×2
  in the 60–110 m band — open country. West: the existing near hamlet moves to
  (−95, 10) at scale 1.1 with a `vista-copse` beside it — the farm's roofs.
  South-west, far: `vista-forest` ×3 in a line at apparent 300 — the wood the
  loop ends in. The castle stays where it is, the landmark.

### Phase 3 — The farm and its two rooms

A humble farm: a house, a barn, a beast pen, a crop pen, and a yard between.
Playable extent about 52 × 46 m inside a boundary of fence, low wall and hedge;
terrain 120 m at 3 m with a level-4 detail disc over the yard.

**Ground.** A `terrace` under the house and barn. The yard is `dirt`, worn to
`mire` in the pen's low corner, the crop pen `crop`, a `meadow` field behind
the house; the track from the east gate through the yard and out the south
gate is `dirt`, 3 m, `cover: none`.

**Buildings.** The farmhouse (`cottage`, thatch seed) on the north side facing
the yard, its door the `farmhouse` portal. The barn (`barn`) on the west,
turned so one cart porch faces the yard — that porch is the `barn` portal. A
`stable` lean-to would be a third building and this is a humble farm; none.

**The pen** (south-west): a `fence` run closed on the barn's south wall, with
a `trough`, a `dung-heap` by the gate, a `straw-pile` inside. `ovine` ×4,
`porcine` ×2 in the mire corner. Calls: sheep and pig `animal` scatters at the
pen, as the village had them.

**The crop pen** (east): a fenced `field`, rows implied by the `crop` material,
`sunflower` ×6 along its north fence, a `scarecrow` in the middle, the
`plough` parked at its gate, a `hay-rick` and a `hay-bale-stack` between it and
the barn.

**The yard.** `well`, `cart`, `log-pile` against the house, `sack` ×3 and a
`barrel` at the barn porch, `pail`, `pitchfork` and `rake` leant where they
were last used, `poultry` ×5 loose, the `dog`. Hob (`person: hob`, roam 5)
between the barn and the crop pen. `hedge` runs along the north boundary,
`stone-wall-low` along the east with the arch in it, `elder` and `hazel` at the
corners, `cowparsley` and `nettle` along the fences, `daisy` in the meadow.

**Gates.** East: `stone-wall-archway` in the east wall, the village beyond.
South: a gap in the fence with a `post` either side and a `hazel` each side of
that, the river beyond. Volumes in both.

**Sound.** The village's bed. Emitters: `foliage` on the elders, `hedge`,
`bird` ×2, the animal scatters, `friction` on the yard gate, `clatter` at the
barn porch, `fire` at the house chimney at low gain.

**Vista.** East, close: `vista-hamlet` at (90, 0) scale 1.3 — the village —
with the castle repeated far beyond it at apparent 360 so the two zones share
a landmark. South: a `water` plane 30 × 80 at y −2 sunk in a `basin` on the
terrain 70 m out, `reeds` dressing on its near bank, `vista-copse` ×3 along
it — the river. West and north: hills and field walls.

**Interiors.** `farmhouse`: the cottage's shell (8 × 6.5), `house` style;
hearth, bed, table and two chairs, dresser, washtub, hanging herbs, pegs, a
chest, candles. `barn`: 12 × 6.5 × 5, `barn` style; `hay-bale-stack` ×2,
`hay-bale` ×3 loose, `crate-stack`, `sack` ×4, `barrel` ×2, `plough` (the
spare; the working one is at the crop pen), `ladder` against the north wall
to nothing — a loft is a room graph and this is one room — `pitchfork`,
`lantern` on a crate. Vibes as decided.

**Portals.** `farmhouse-door`, `barn-door` (`doorOf`), `farm-riverside`
(volumes), plus `village-farm` from phase 2.

### Phase 4 — The plains

The empty zone: the widest playable extent in the set, about 110 × 90 m, and
the fewest things in it. Terrain 200 m at 3 m; the ground is what there is to
look at, so the landforms do the work — three broad `hill`s, one `ridge`
running south-west toward the far gate, a `basin` with a `blot` of `mire` and
`reeds` in it.

**Boundary.** North: a `stone-wall-low` run with the arch in it, `gorse`
either side. Elsewhere a `rim` on an outline, `inset` 12, `height` 9, with
`rockAngle` 42 — the plain rolls up into hillside the player slides back down.
The dressing band puts `gorse`, `bush`, `rock` and `boulder` on the rim's
slope and `thicket` over its crest.

**The path.** `dirt`, 2.6 m, from the north arch across the plain in three
bends to the south-west gate, `cover: none`, `edge: soft`; not levelled, so it
climbs and drops with the hills.

**Things.** A `cairn` on the ridge's high point — the landmark from inside the
zone, seen from the arch. One `oak` alone in the middle, big, with a `rock`
under it. A `stone-wall-ruin` run on the east hill. `outcrop` and `scree` on
the south hill. `standing-stone` ×3 in a loose line on the west, waist high.
Scatters: `large-grass-clump` 40, `small-grass-clump` 90, `thistle` 12,
`wildflower` 10, `poppy` 8 on one slope, `rock` 22, `bush` 10, `gorse` 8,
`hazel` 4 in the basin.

**Gates.** North: `stone-wall-archway` in the wall. South-west: the path drops
into a notch between two `crag`s with a `deadfall` beside it and the first
`spruce`s behind — the wood begins.

**Sound.** The village's bed, wind gain up to 0.22. `bird` ×2 far apart, high
`interval`; `foliage` on the oak; `hedge` in the gorse by the arch; a
`friction` gate creak at the arch; nothing else — the vibe's air, insects and
bustle carry the plain.

**Vista.** North: `vista-hamlet` at (0, −120) — the village — with the castle
beyond it. South-west, near: `vista-forest` ×4 overlapped at 80–120 m from the
gate, so the wood the path enters is a wall. East and south: `vista-range` ×2
far, `vista-hill` ×6, `vista-field-wall` ×3.

**Portals.** `village-plains` (phase 2), `plains-forest-path`.

### Phase 5 — The crossroads and the river

Two path zones in one phase because they meet.

#### Forest Path

Three arms from a clearing: north-east to the plain, west to the river, south
to the wood. Playable extent about 100 × 90 m; each arm a corridor 12 m wide
and 35–45 m long with one bend; the clearing 24 m across. Terrain 150 m at 3 m,
level-3 detail discs along all three arms and the clearing.

**Ground and walls.** Each arm is a `channel` — width 12, depth 3.2, bank 3 —
through the base ground, with `rockAngle` 46 so the banks show stone. The
banks are the wall: 47° at 3 m resolution is over the controller's limit once
the detail discs sharpen it. Above the banks, `spruce`, `oak` and `birch`
scatters and a `thicket` dressing band, so the corridor is a cut through a
wood. The clearing is a `terrace` at the channels' floor height, `dirt` worn
to `gravel` in the middle, `turf` in the arms with a `dirt` path 2.4 m down
each.

**The clearing.** A `signboard` at the meeting point with a `post` beside it
and a `lantern` hung on the post. A `well`. A `fallen-log` to sit on, a
`stump`. A `cairn` at the mouth of the south arm. `mushroom` ring, `moss`,
`fern`, `bluebell` drifts in the shade.

**The arms.** North-east: dry, `gorse` and `thistle` on the banks, an
`outcrop` at the bend. West: damp, `fern`, `foxglove`, `cowparsley`, a
`snag` at the bend, `root-tangle` on the bank. South: dark, `spruce` close
above both banks, `deadfall` on the bank at the bend, `pinecone` and `sticks`
on the floor.

**Gates.** North-east: two `crag`s with the channel between. West: a `hazel`
tunnel — four hazels each side, leaning in. South: two big `spruce`s with a
`root-tangle` under each.

**Sound.** Bed as the village's. `foliage` ×3 on the arms' trees, `bird` ×2,
`water` (`brook`) low in the west arm — the vibe has a brook, this places it.
`friction` on the signboard in wind, low.

**Vista.** Forest in every direction, `vista-forest` ×6 in the 60–110 m band,
denser south; `vista-crag` ×2 north-east where the plain's hills were rock;
one `vista-tower` south-south-east at apparent 420 — the same tower the forest
and the beach see, and what the tail is walking toward.

#### Riverside

A bent corridor about 120 × 50 m, the river on its east side and the path on
the west bank above it. Terrain 170 m at 3 m, detail discs along the path.

**The river.** A `channel` through the whole zone, width 9, depth 3.6, bank
3.5, following five bends; a `water` entry per reach, five or six, each
sized to its stretch of channel plus the banks and overlapping the next at the
bend, all at y −1.2, `flow` south at 0.5, `chop` 0.35, `segment` 0.6. The path is a
`terrace` shape along the west bank at +0.4, `dirt`, 2.6 m, `cover: none`; the
ground east of the river climbs as a `scarp` to +3 and is the far wall,
`hazel`, `elder` and `bramble` on it. West of the path a second `scarp` to
+2.5 with `oak`s above — the near wall.

**Along the water.** `reeds` ×14 at the waterline, `cowparsley`, `foxglove`,
`nettle`, `moss` on the bank stones, `rock` ×20 and `boulder` ×3 in and at the
water, a `fallen-log` across a side gully, `cairn` at the first bend where the
path is closest to the water. A `bench` is not a builder; a `stool` is not a
bench. Nothing to sit on.

**Gates.** North: `hazel` tunnel, the farm beyond. South-east: the path turns
away from the river through two `oak`s with a `deadfall` between the near one
and the bank, the crossroads beyond.

**Sound.** Bed as the village's. `water` (`stream`) emitters ×3 spaced along
the river at the bends, `refDistance` 4, `maxDistance` 30, so the river is
loud where it is near and the vibe's own water sits under it; `foliage` on the
elders; `bird` ×2; `flock` is already in the vibe.

**Vista.** The river continues: a `water` plane 14 × 70 at y −1.2 in a
`basin` at each end beyond the gates, `reeds` and `vista-copse` along them.
West: `vista-hill` and `vista-field-wall` — the farm's country. East and
south: `vista-forest` ×5, the tower south-south-east at apparent 480.

**Portals.** `farm-riverside` (phase 3), `riverside-forest-path`,
`plains-forest-path` (phase 4), `forest-path-forest`.

### Phase 6 — The forest and the house in it

Semi-open: clearings joined by gaps in the trees, about 100 × 90 m playable,
terrain 160 m at 3 m. Not a corridor — the player can go round.

**Ground.** `turf` base; three `basin`s making the clearings, `hill` between,
a `moss` blot in the wettest, `dirt` path 2.4 m from the north gate through
the clearings to the south-east gate, bent so the house is found and not
seen from the gate.

**Trees.** `oak` 8, `spruce` 12, `birch` 10, `small-*` 20, `hazel` 8, `elder`
5, `bush` 18, `bramble` 10, `fern` 30, `bluebell` 40 in the north clearing,
`mushroom` 25, `moss` 20, `sticks` 15, `pinecone` 20, `stump` 6,
`fallen-log` 3, `deadfall` 2, `snag` 2, `root-tangle` 3, `boulder` 3, `rock`
20. Scatters avoid the clearings' `keepClear` so the floor of each stays open
and the trees stand at their edges.

**The house.** The `cottage` in the middle clearing, `fence` run round a
garden with `lavender` and `daisy`, `log-pile`, `well`, `sticks` by the door,
`trough`, `hay-bale` ×2 under the eave, a `lantern` on a `post` at the gate.
Door: the `forest-cottage` portal. Inside: hearth, bed, table, chair, stool,
bookshelf-part, chest, dresser, curtain, candle, a `board-book` on the
table. Empty of people (see *Decided*).

**Boundary.** A `rim` on the outline, `inset` 10, `height` 8; `thicket` and
`spruce` dressing on it so the wood thickens to a wall.

**Gates.** North: two `oak`s with a `deadfall`, the crossroads beyond.
South-east: the ground goes to `sand` over the last 15 m, the trees thin to
`small-spruce` and `gorse`, and two `rock-shelf`s stand either side of the
path, the beach path beyond.

**Sound.** Bed as the village's, wind 0.12. `foliage` ×4 on the big oaks and
spruces, `bird` ×3, `hedge` at the garden, `fire` at the house chimney,
`friction` on the garden gate.

**Vista.** Forest all round, `vista-forest` ×6, `vista-copse` ×4. South-east
through the gap the trees leave: a `water` plane 200 × 60 at y 0 on a flat
skirt 130 m out — the sea, first seen — with `vista-crag` ×2 on its near edge
as a headland and the `vista-tower` on the headland at apparent 300.

**Portals.** `forest-path-forest` (phase 5), `forest-cottage-door`,
`forest-beach-path`.

### Phase 7 — The beach path and the beach

#### Beach Path

Short: a corridor 14 m wide and 70 m long with two bends, descending 6 m end
to end. Terrain 120 m at 3 m. The banks are dunes — `hill`s of `sand` — and
the `channel` between them, `rockAngle` 50 so the dune sides stay sand. The
path is `sand`, `cover: none`. `large-grass-clump` 30 and `reeds` 12 on the
dune sides, `gorse` 8 on the crests, `rock-shelf` ×2 and `scree` at the second
bend, `sticks` 10, a `fallen-log` half in a dune. At the second bend the dunes
open and the sea is ahead, below.

**Gates.** North-west: two `rock-shelf`s, the forest beyond. South: the
corridor ends between two `outcrop`s, the beach beyond.

**Sound.** Bed: wind 0.24, `surf` in the bed at gain 0.12 — heard before it is
seen. `foliage` (`tone` high) on the grass, `bird` ×1 (gulls are a `flock`; the
beach vibe has one).

**Vista.** The sea ahead: a `water` plane 220 × 120 at y 0 on the flat skirt
past the south gate, `vista-crag` headland east, the tower on it at apparent
260, `vista-hill` dunes west. Forest behind.

#### Beach

An open sprawl of sand and the sea, about 110 × 80 m playable, the sea taking
the south half. Terrain 200 m at 3 m, level-2 detail over the shore.

**Ground.** `sand` base. The land is a `terrace` at +3 along the north edge
(where the path comes in), sloping as a `scarp` down to the waterline at 0
over 25 m, then the bed goes on down as a shallow `basin` to −1.4 at the
outline's south side; past the outline a `scarp` drops it to −7. `rockAngle`
50. Dunes as `hill`s of `sand` along the north with `large-grass-clump` and
`reeds`; a `rock-shelf` headland at the east end running into the water,
`outcrop`, `boulder` ×4 and `scree` on it, `moss` low on the wet stones.

**The sea.** Two `water` entries at y 0.3 — above the flat skirt's 0: the
shore plane, 130 × 60 over the shelf and the bar, `chop` 1.8, `taper` 1.6,
`flow` north at 0.4, `segment` 0.7; and the offing behind it, 240 × 180 run
out to the fog, `chop` 1.2, `segment` 3, overlapping the shore plane by ten
metres. Skirt `roll` 0 and `curve` 5000, so the far ground bows
away under it. The `barrier` runs along the outline's seaward side at −1.2.

**Things.** A `cairn` on the headland. `fallen-log` ×2 and `sticks` 15 at the
tideline, `deadfall` ×1 in the dunes, `rock` 24 along the waterline, `reeds`
10 where a stream would come down at the west end (a `blot` of `mire`).
Nothing built: no boat, no hut, no crates — a beach the player found.

**Gate.** North: between two `outcrop`s where the path comes down.

**Sound.** Bed: wind 0.26, `surf` ×3 as positioned emitters along the
waterline at gain 0.22, `refDistance` 8, `maxDistance` 90, staggered
`period`, so the break moves along the shore rather than coming from one
point; `water` (`stream`) low at the west-end stream; `foliage` on the dune
grass. The vibe's flock is the gulls.

**Vista.** The sea, real, out to the fog. `vista-crag` ×3 along the east
headland at 80–160 m and the `vista-tower` on the last at apparent 240 — the
tower the crossroads first showed, reached as far as the demo goes. West:
`vista-hill` dunes, `vista-copse`. North: `vista-forest`.

**Portals.** `forest-beach-path` (phase 6), `beach-path-beach`.

### Phase 8 — The walk

Every crossing both ways, every door, the map after the loop, the boot
prebuild list, and the `place` values against what the map draws. What the
walk finds goes in the zone it was found in, not in a check.

---

## Builders the zones want and do not have

Suggestions, by the zone that first misses each. Slugs are provisional and the
names are yours. Each says what stands in for it in the phases above, so
nothing waits on any of these; the ones marked **first** are the ones whose
absence shows most.

| zone | builder | reads as | stands in today |
| --- | --- | --- | --- |
| Village, Farm | `gate` **first** | a five-bar field gate, hung open, in a fence or wall gap | two `post`s and a gap |
| Village | `stile` | steps over a fence — the goat quest names one | nothing |
| Village | `bench` | a plank on two stones by the well | a `stool` |
| Farm | `hen-house` | a boarded coop on legs with a ramp | the hens roam loose |
| Farm | `beehive` | a skep or a boarded hive, two or three in a row | nothing |
| Farm | `wheelbarrow` | tipped on its nose by the dung heap | a `pail` |
| Farm | `water-butt` | a barrel under a downpipe at the house corner | a `barrel` |
| Farm | `stook` | a sheaf of cut corn stood in a cone; a field of them is a harvest | `hay-bale` |
| Plains | `windmill` **first** | a post mill on the ridge — a landmark for a zone that has none | a `cairn` |
| Plains | `sheepfold` | a round drystone fold with one gap | `stone-wall-ruin` |
| Plains | `waymarker` | a milestone or a wind-bent post with a mark cut in | a `post` |
| Plains | `hawthorn` | a small wind-bent tree, the only tree that lives up here | `small-tree` |
| Riverside | `footbridge` **first** | a plank bridge on two posts over a side stream | a `fallen-log` |
| Riverside | `stepping-stones` | five flat stones across a shallow | nothing |
| Riverside | `willow` | the tree that belongs at water, trailing | `elder` |
| Riverside | `rowboat` | pulled up on the bank, oars in | nothing |
| Riverside | `weir` | a step in the river with the water tech spilling over it — engine work as much as art | nothing |
| Forest Path | `fingerpost` **first** | a post with three arms, each with a name — the crossroads' one built thing | a `signboard` |
| Forest Path | `wayside-shrine` | a niche on a post with a candle in it | a `cairn` |
| Forest | `chopping-block` | a stump with an axe stood in it, by the log pile | a `stump` |
| Forest | `charcoal-clamp` | a low turf mound with a smoke mount — a woodsman's living | nothing |
| Forest | `holly` | the dark evergreen understory a broadleaf wood has | `bush` |
| Forest | `deer` | one wild creature — a life builder, so the biggest ask here | nothing |
| Beach Path | `marram` | the stiff dune grass in tufts, paler than a meadow clump | `large-grass-clump` |
| Beach Path, Beach | `driftwood` | a bleached, bare log; the tideline's deadfall | `fallen-log` |
| Beach | `skiff` **first** | a boat pulled up above the tide, the one built thing on the sand | nothing |
| Beach | `groyne` | a row of posts running into the sea; the showcase makes one in code | nothing |
| Beach | `lobster-pot` | a wicker pot, two or three stacked | `crate` |
| Beach | `wrack` | a clump of weed at the tideline | `moss` |
| Beach | `drying-net` | a net hung between two posts | nothing |

### Vista builders

The roster is nine profiles of one mass function, and it was written for a
valley of hills. This country has a coast, a farm, and woods seen from close
enough that a blob is a blob. Five more, all under the roster's budgets and
built on the same grammar; the phases above use the stand-ins until they
exist.

| builder | reads as | for | stands in today |
| --- | --- | --- | --- |
| `vista-farmstead` | one long low roof, a stack, a rick beside it | the farm from the village's west arch and from the river | `vista-hamlet`, which is a cluster and reads as another village |
| `vista-treeline` | a row of eight to twelve simple trees — trunk and two or three canopy blobs, forty triangles each — heights uneven, spacing uneven | the 50–110 m band, between real trees at 2,000 triangles and the merged mass at 100 m+; the plains' south-west wall, the crossroads' banks | `vista-forest`, whose blobs read as blobs inside 100 m |
| `vista-dune` | a long low sand-coloured mass, flatter than a hill, with a darker fringe along the crest for the grass | the beach path and the beach, west | `vista-hill`, which is green |
| `vista-headland` | a `vista-range` that steps down into the water: four or five crag masses on a line, the last lowest, stone-coloured, cut flat at the surface | the coast east of the beach, seen from the forest, the beach path and the beach | three `vista-crag`s in a line, which do not step |
| `vista-sail` | a hull and one triangular sail, twelve triangles, pale against the sea | the beach's far particular — a boat out on the offing at apparent 400, the one thing in the zone that says someone else is out there | nothing |

Not made: a `vista-sea`. The far water is the water tech on a flat skirt and
it should stay so — a flat pale plane has no reflection, and the reflection is
the read. If the far plane's per-pixel cost shows on the beach it becomes a
coarser plane, not a different material.

## Budgets

The village is the reference: 101 entries, five buildings, a ring of about
sixty vista props. The farm and the forest come in near it; the plains, the
paths and the beach well under. The two big water planes (riverside, beach)
are 20–35k triangles each at their segment sizes, a third of what the sea
showcase measured. The beach's sea is the one thing in the set that costs per
pixel, and it is the last zone, seen only once the rest has run.
