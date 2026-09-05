# The exteriors, remade — spec

**Signed off 2026-09-04, with these decisions:

- The village landmark is the `church`.
- All seven builders in §4 are wanted: stile, bench, stepping-stones, willow,
  driftwood, hawthorn, stook.
- Wall cover is rose on Ada's house and ivy on the tower's north face.
- Wat's door moves from `demos` to his house in the village. His interior is
  one room with nothing behind it, so nothing else is removed and nobody is
  displaced.
- Interiors are named for their people: Ada's House, Ada's Cellar, Bess's
  House, Mark's Shop, Wat's House.
- The complaint is the ground surface itself — its triangle count and its
  colours — and §1 is the priority. Cover is liked and is not the problem.** Nothing here is built. This is the plan for remaking every
outdoor cell — village, farm, plains, riverside, forest path, forest — and
making the beach path and the coast anew, on better ground and better water,
with the interiors left as they are and linked back in. Names below are
working names; the fiction and the naming are yours.

Every cell is designed against `guidelines/LEVEL-DESIGN.md` and
`guidelines/ENVIRONMENT-DESIGN.md`: one sentence, one landmark, gates in the
compass walls, five to eight beats, a loop, honest slopes, nature derived not
decorated, nothing invented. Each cell section ends with what it needs that
does not exist, and §4 collects those into one ask.

Supersedes `COAST.md`.

---

## 0. What stays the same

- **The graph.** Village at the centre; farm west; plains south; riverside
  south of the farm; forest path south of the riverside and south-west of the
  plains; forest south of the forest path; beach path south-east of the forest
  and south of the plains; coast south of the beach path. Two loops already:
  village → plains → forest path → riverside → farm → village, and plains →
  forest path → forest → beach path → plains.
- **Ids.** `village`, `farm`, `plains`, `riverside`, `forest-path`, `forest`,
  `beach-path`. The beach becomes `coast`.
- **Interiors and their doors.** `cottage` (Ada), `workshop` (Bess), `store`,
  `cellar`, `farmhouse`, `barn`, `forest-cottage`, `villager-hut` (Wat). Each
  keeps its `wall: -z` end; the exterior end moves to the new building.
- **People and quests.** Mark, Tom, Nell, Vance in the village; Hob at the
  farm; Ada, Bess, Wat indoors. The three quests stand, and every place their
  dialogue names becomes a real thing the player can find (§2, village).
- **The compass.** `+X` east, `+Z` south, in every cell.
- **Sound.** Beds only (wind, rain, surf), plus emitters for things that are
  actually there and actually make noise: running water, a lit forge. No
  birds, no creaking gates, no clatter scatters, no bells.
- **Saves are void.** Zone documents are replaced wholesale.

## 0b. What goes

Signs of every kind (`signboard`, `banner`, `fingerpost` text). Bird emitters.
Friction emitters on gates. `soundScatter` entries. The crate tower and its
ladder portal. The `hut-door` and `hut-trapdoor` props lying about the
village. Dressing that a builder or a placer invented rather than the ground
suggesting it.

---

## 1. The ground

Two complaints, two fixes, both engine work done once before any cell is
authored.

### 1a. Triangles

Outdoor terrain is authored at 3 m per quad with detail discs at 2× and 4×
near buildings and `steepDetail` 3 on banks. At eye height a 3 m facet is a
visible tile out to forty metres.

- Every remade cell is authored at **`resolution: 1.5`**, `steepDetail: 2`,
  with **level-2 detail discs** (0.75 m) along every track, in every yard,
  and around every water edge. Level 4 is reserved for the ten metres round
  a door.
- Budget: **under 60 k ground triangles per cell**. The plains at 200 m is
  the largest: 35.6 k at level 1, about 50 k with its discs. Everything else
  is under 40 k. This is a budget, not a runtime lever: if a cell wants more,
  the cell gets smaller.
- Collision is the same mesh, so `Collider.carve` sees four times the
  triangles. The terrain already builds on the worker pool; the carve must
  stay inside the warm budget. If the loading bar lengthens, that is the
  report to send back, and the answer is a coarser collision mesh derived
  from the render mesh, not a coarser render mesh.

### 1b. Colour

The ground is coloured per face: material chosen at the face centre, a
per-face random shade on a 1.2 m hash, height cooling, and rock blended per
corner. Two things make it read as a patchwork: the random shade is
per-triangle noise, and every material boundary except rock is a hard step
between two unrelated hexes.

- **Per-corner colour.** Each corner takes the material at its own position,
  so a boundary crossing a facet becomes a gradient across it. The rock blend
  already works this way; every material joins it.
- **Feathered patches.** `patches` gain `feather` (metres, default 1.5;
  `0` keeps a hard edge for a kerb or a threshold). Inside the band a corner
  mixes the two materials by distance. Tracks keep their own verge logic.
- **Smooth variation instead of a hash.** `groundJitter` becomes two octaves
  of value noise at about 9 m and 2.2 m wavelength, sampled per corner, with
  amplitude `variation × 0.6`. Variation becomes patches of light and dark
  turf the size of a garden, never a change between two triangles.
- **A closer palette.** The ground colours are restated relative to one
  another rather than as unrelated hexes. Adjacent soft materials (turf,
  meadow, moss, dirt, crop, mire, gravel) sit within about twelve percent of
  each other in value, so the 64-level quantiser dithers between neighbours
  instead of banding. Sand, wet sand, shingle and rock keep their real
  contrast. Proposed starting values, to be tuned in the world:

  | material | now | proposed | note |
  |---|---|---|---|
  | turf | `PALETTE.GRASS` | unchanged, the anchor | |
  | meadow | `GRASS_DRY` | 8 % lighter, 6 % warmer than turf | |
  | moss | `#455c31` | turf 10 % darker, 5 % bluer | |
  | dirt | `EARTH` | turf's value −10 %, hue to earth | was far darker |
  | crop | `LEAF_DRY` | meadow, 6 % warmer | |
  | mire | `#453a2c` | dirt 12 % darker | |
  | gravel | `#6e6656` | dirt's value, desaturated | |
  | sand | `#c4ad84` | unchanged | a real contrast |
  | wetsand | `#9d8c6c` | sand −18 % value | |
  | rock | `STONE_DARK` | unchanged | a real contrast |

- **Live tuning.** The ground palette goes into the `?debug` tuning panel so
  the values above are set by looking, not by me guessing hexes.
- Flat shading stays. It is the look. If the facets still read as tiles with
  colour continuous, the fallback is smooth normals on ground shallower than
  the rock angle, behind a switch, and that is a separate decision.

### 1c. Cover

Two cover types are added for the coast, because grass on sand is wrong and
`large-grass-clump` scattered as a prop is a builder standing in for ground:

- **`marram`** — stiff pale tufts, `tussock` at 0.7 density with a sandy
  tint, on the foredune and the grey dune.
- **`wrack`** — low dark leaf props with no blades, for the strandline: a
  band 2 m wide where the tide leaves things.

---

## 2. The water

Done 2026-09-04 as: the sea's apron defaults to 3000 m and is held inside
the far plane, and the sky is no longer read as a bed in front of the water,
so the surface runs to the horizon. A `water` entry takes a `course`
polyline and a `speed`, and the flow follows the line and dies at the
banks. Ponds, rivers and the sea share one set of colours (`WATER_TINTS`),
tuned live from the water folder of the debug panel. The sea bake already
runs on the first frame under black, so it stays where it is.

The sea is a baked field with a Gerstner train on it; ponds and rivers are the
older two-train plane. Both composite themselves over the opaque pass. Three
pieces of work, done before the riverside and the coast are authored.

### 2a. The horizon stripe

A pale band of far sea draws over near dunes. The sea's own depth test should
discard it. The most likely reason it does not: the vista skirt and vista
props are drawn in their own pass, and the depth the water pass tests against
does not include them, so the sea passes wherever only vista geometry stands
in front of it. The fix is that the water pass tests against a depth that has
the vista in it, or the vista draws before the water. Verified by reading the
effect chain, then by the shot.

### 2b. Rivers flow

The `water` entry gains an optional **`course`**: a polyline with a speed.
The plane's per-vertex flow becomes the tangent of the nearest course segment
at that speed, so the streaks and the wave phase run downstream and bend round
the meanders. One `water` entry per reach as now, all at one height, joined
inside the banks.

### 2c. The sea reads at the coast

The field system stays. Two changes on top of the fresnel cap already in:

- **Bake on load, not first frame.** The field bakes in `bakePendingSeas` on
  the first water-pass frame. It moves to the zone's prepare step so the first
  frame at the coast is the finished sea.
- **One colour set.** Sea and water share `uShallow`, `uDeep`, `uFoam`, so a
  pond seen against the sea from the beach path is the same water.

Everything else about the sea's look is a tuning pass at the coast, with you
looking, after the cell exists. It is not designed blind again.

---

## 3. The cells

Each cell: the sentence, the size, the gates, the landmark and districts, the
route with its beats and loop, the ground and cover, what lives there, sound,
vista, and what it wants that does not exist.

Common to all: `resolution 1.5`, `steepDetail 2`, `edgeFade` band 20, a
skirt with `flatten`, a vista ring with one non-generic landmark and the
neighbours' country in the neighbours' directions, and `+Z` south.

### 3.1 Village

**Sentence.** A green round a well, a row of houses along its north side, and
the church tower over the east end.

**Size.** 140 m. Playable oval about 70 × 50 m inside a boundary of stone
wall, hedge and the stream. Altitude 0.

**Gates.** South arch at (0, 26) → plains. West arch at (−30, −4) → farm.
Both `stone-wall-archway` in the boundary wall, with the wall running to each
jamb.

**Landmark.** The `church`: west tower, nave, porch, on a 1.2 m rise at the
east end of the green at about (26, 2), tower toward the green. Seen down the
length of the green from the west arch; seen left-front from the south arch
between two house gables. Never seen whole until the green opens.

**Districts.**

- **The green** — an oval of turf with `clover` cover, worn to `dirt` at the
  well and where the lanes meet. The well (`well`) stands west of centre at
  (−6, 4). One `bench` (§4) on the green's south side facing the well.
- **The row** — five houses along the north side facing south onto the green,
  with uneven gaps and yards. West to east: Wat's house (`hut`, door →
  `villager-hut`), Tom's house (`hut`, a `gate` in its fence hung askew:
  "four doors down, the one with the bad gate"), Nell's house (`hut`, no
  interior), Mark's shop (`market`, the trading floor open to the green, its
  door → `store`), Ada's cottage (`hut`, door → `cottage`, `cover: rose` on
  its front wall). Hazel and elder in the gaps, a `sunflower` and `lavender`
  in Nell's garden behind a low fence run.
- **The east side** — Bess's workshop (`hut`, door → `workshop`) stands
  alone on the east side of the green under the church rise: "the workshop on
  the east side of the green". The `blacksmith` stands south of it by the
  south lane, `forge` and `anvil` inside its open wall, the forge lit.
- **The churchyard** — a `stone-wall-low` chain round the church with one
  gap toward the green, `flowers` cover inside, two `small-oak`, `cover: ivy`
  on the tower's north face.
- **The stream** — enters at the north-west, runs down the west side and
  out at the south-west, in a `channel` 3 m wide, 0.9 m deep, banks 4 m.
  `reeds` and `sedge` along it, `moss` on the shaded bank. The west road
  crosses it on a `footbridge`. South of the bridge, on the far bank, a
  `stile` (§4) in the boundary wall lets onto a small paddock with a `hedge`
  round it: "went through the stile at first light", "down by the water,
  before the reeds". The paddock is where the goat was and is not.

**Tracks.** The gate road `dirt` 3 m with a verge from the south arch to the
green's south edge and on round the west side to the bridge and the west
arch. Three lanes `cobble` 2.2 m with kerbs: along the row, across the green's
north edge; from the green up to the church gap; from the green past the
smithy to the south arch. The lanes and the road together ring the green,
which is the loop.

**Route and beats.** South arch → threshold between the smithy and the first
house gable, tower visible left → the green opens: well, row, tower (arrival
shot) → along the row, doors and yards → up the lane to the churchyard, the
one high point, looking back over the green and out west to the farm's roof
in the vista → down past the workshop and the smithy's glow → the road round
the south of the green to the bridge, the stream heard before seen → the
stile and the paddock → the west arch. Seven beats, none alike.

**People.** Mark at the shop front (roam 4). Tom by his gate (roam 2). Nell
between the well and her house (roam 4). Vance on the road inside the south
arch (roam 3). The dog on the green. Hens loose round the row. The `visitor`
and `villagers` keep their seeds so their faces do not change.

**Sound.** Wind and rain bed. `water` emitters at the bridge and the
south-west culvert. `fire` on the forge. Nothing else.

**Vista.** West: `vista-farmstead` at 95 m with a `vista-copse` — the farm's
roof. South: `vista-hill` ×3 low and `vista-field-wall` ×2, open country.
North and east: hills, copses, the castle far where it was. Ring inner 30,
outer 170.

**Wants.** `stile`, `bench` (§4). Wall covers `rose`, `ivy` exist.

### 3.2 Farm

**Sentence.** A yard between a house and a barn, with the fields running down
to the river.

**Size.** 140 m. Playable about 70 × 60 m. Altitude 0, falling 3 m to the
south.

**Gates.** East arch at (32, 0) → village. South field gate at (0, 30) →
riverside: a `gate` hung open between two `post`s in a hedge.

**Landmark.** The `barn`, on a terrace at (−16, −4), turned so a cart porch
faces the yard. Seen end-on down the hedged lane from the east arch, its roof
first over the hedge tops.

**Districts.**

- **The lane** — from the east arch, 3 m `dirt` between two `hedge` runs with
  `cowparsley` and `nettle` at their feet, bending once so the yard is not
  seen from the arch.
- **The yard** — `dirt` worn to `mire` at the pen gate, on a terrace. The
  farmhouse (`cottage`, door → `farmhouse`) on the north side facing the
  yard, the barn on the west (porch → `barn`), the `well`, the `cart`, the
  `log-pile` against the house, `sack` ×3 and a `barrel` at the barn porch,
  `pail`, `pitchfork`, `rake` leant where they were last used.
- **The pen** — south-west, a `fence` run closed on the barn's south wall,
  `trough`, `dung-heap` by its gate, `straw-pile` inside. `ovine` ×4,
  `porcine` ×2 in the mire corner.
- **The crop field** — east and north-east, fenced, `crop` ground with the
  rows implied, `sunflower` ×6 along its north fence, `scarecrow`, the
  `plough` at its gate, `hay-rick` and `hay-bale-stack` between it and the
  barn.
- **The meadow** — south of the yard, `meadow` ground with `daisy` and
  `flowers` cover, sloping down to the south gate, an `oak` on its own
  halfway. From it the river valley is seen below: the riverside's water on
  the skirt at −2 m, `reeds` on its near bank, `vista-copse` ×3 along it.
- **Behind the barn** — the field Hob works, `crop` ground, `stubble` cover,
  west of the barn: "past the barn — he is in the fields all day". Hob roams
  there (roam 6).

**Loop.** The lane forks at the field corner: a cart track runs round the
outside of the crop field and back into the yard by the barn, so the field is
walked round.

**Beats.** Hedged lane, barn roof rising → yard opens, porch ahead → the
house door and the well → the pen and its animals → round behind the barn to
Hob → the meadow slope and the valley view → the south gate.

**Sound.** Bed. `fire` on the farmhouse chimney only if it smokes.

**Vista.** East: `vista-hamlet` at 90 m — the village — with the castle
beyond at apparent 360. South: the river water and copses. West and north:
hills and field walls.

**Wants.** Nothing new. (`stook` would make the crop field a harvest; `hay-bale`
stands in.)

### 3.3 Plains

**Sentence.** Open high ground with a windmill on the ridge, seen from
everywhere.

**Size.** 200 m. Playable about 120 × 100 m. Altitude 20.

**Gates.** North at (0, −50) → village: two crags either side of the track.
South-west at (−52, 40) → forest path: a gap in a drystone wall with a
`gate`. South-east at (30, 50) → beach path: a gap between two `outcrop`s
where the heath drops.

**Landmark.** The `windmill` on the ridge at (12, −8). From the north gate
only its sails show over the crest; the track climbs and it comes up whole.
From every other point in the cell it is the tallest thing.

**Terrain.** A `ridge` running west-north-west to east-south-east through
the middle, 5 m high, the mill on its crest. A `hill` 3 m on the west
shoulder carrying three `standing-stone`s in a loose triangle, uneven. A
`basin` south-east with a pool in it (`water`, 12 × 9, at −0.6), `sedge` and
`reeds` round it, `wetsand` at its lip. `crag` ×2 on the ridge's north face
with `scree` and `boulder` clitter fanning below them.

**Ground and cover.** `meadow` base, `heather` on the ridge, `tussock` on
the slopes, `plume` in the sheltered south-west, `flowers` round the pool.
`gorse` in clumps of three and five on the ridge's south face, one
`small-tree` leaning south-west on the shoulder (a `hawthorn` if made, §4).
`outcrop`s where the crest breaks the turf.

**Tracks.** One `gravel` 2.6 m from the north gate up the saddle east of the
mill and down to the south-east gate, seeing the sea glint as it crests. A
`dirt` 2.2 m branch from the saddle west along the ridge's south foot to the
south-west wall gate. A sheep track (`dirt` 1.2 m, wear 0.3) round the back
of the ridge from the stones to the pool, rejoining the gravel: the loop.

**Beats.** Crags at the gate, sails over the crest → the climb, the mill
whole → the saddle: sea south-east, wood south-west, the whole cell below →
the stones on the shoulder, wind → the sheep track round the north face,
clitter → the pool in the hollow → the drystone wall and gate → out.

**Sound.** Bed with the wind up. `friction` on the mill only if the sails
turn.

**Vista.** North: village roofs low, the castle. South-east: far water on
the skirt with `vista-dune` and a `vista-headland` — the coast. South-west
and south: `vista-forest` and `vista-tree` at the band's inner edge. West:
`vista-farmstead`.

**Wants.** `hawthorn` (§4), optional.

### 3.4 Riverside

**Sentence.** The river bends through a meadow, and a footbridge crosses it at
the narrows.

**Size.** 170 m. Altitude 5. The river enters at the north (from under the
farm's meadow) and leaves at the south-east.

**Gates.** North at (−4, −64) → farm: the track between two `hazel`s. South-
east at (30, 62) → forest path: between an `oak` and a `rock-shelf`, the
canopy starting.

**Landmark.** The `footbridge` at the narrows, at about (10, 6), with one big
`oak` on the west bank beside it. Seen along the water from the north gate
in pieces, through the bank trees.

**The river.** Two bends: a wide left-hand bend north of the bridge with a
shingle point bar on its inside (east) and a cut bank (`scarp`, 1.4 m,
`rock`) on its outside (west), then the narrows at the bridge where two
`rock-shelf`s pinch it to 5 m, then a right-hand bend south with the bar on
the west. Four `water` reaches at −1.2, one `course` at 0.8 m/s. A riffle
between the bends (`boulder` ×5 half in the water, a `stepping-stones` line
§4 across it upstream of the bridge). Banks `wetsand` at the bars, `shingle`
on the riffle, `sedge` and `reeds` in the slack water on the outsides.

**Districts.** The west-bank meadow (flat, `meadow`, `flowers`, the track).
The east-bank terrace (higher, `turf`, the trees thickening toward the
south-east gate). The narrows (rock, the bridge, the oak). The north
floodplain (`mire` in a hollow, `reeds`).

**Tracks.** `dirt` 2.4 m along the west bank on the terrace lip (a ledge
path, the river open on the left), over the bridge, along the east bank to
the gate. The stepping stones make the loop: cross back to the west meadow
above the riffle.

**Trees.** `hazel` and `elder` on the banks in threes, `oak` ×2, a `willow`
(§4) trailing over the pool below the cut bank if made; `elder` stands in.
`birch` ×3 on the east terrace where the wood begins.

**Beats.** Gate, water heard → the meadow, the river seen in pieces → the
cut bank and the deep pool → the riffle, the stones → the bridge and the oak
(the one composed view: the river both ways) → the east terrace, the trees
closing → the gate.

**Sound.** `water` emitters at the riffle (`brook`) and under the bridge
(`stream`). Bed.

**Vista.** North: the farm's roof and copse. East: hills and field walls.
South: `vista-forest`, `vista-tree` along the band's inner edge. The river
continues on the skirt as far water both ways.

**Wants.** `stepping-stones`, `willow` (§4). Engine: `course` (§2b).

### 3.5 Forest path

**Sentence.** A hollow lane along the wood's edge that meets another and goes
down into the trees.

**Size.** 160 m. Altitude 15. A corridor cell: an open hallway 10–14 m wide
between banks the controller cannot climb, bent so no gate sees another.

**Gates.** West at (−60, −8) → riverside. North-east at (40, −58) → plains,
through the drystone wall's gate. South at (−4, 62) → forest, where the
canopy closes.

**Landmark.** One great `oak` at the crossroads, at (0, 4), its crown wider
than the lane. Seen at each bend as a mass before it is seen as a tree.

**Terrain.** Two `channel`s: the lane from the west gate bending twice to
the crossroads, and the lane from the north-east gate bending once to meet
it; a third from the crossroads south, its banks rising as the ground falls.
Width 8–10, depth 1.2, bank 6, so the banks are soft grass, not rock. A
`hill` 4 m north of the crossroads that both lanes go round.

**Pockets.** One thing at each bend: a `well` with a `post` and `lantern` at
the first bend from the west; a `fallen-log` and `stump` at the second; a
`brook` (a `water` sliver 1.5 m wide crossing the north-east lane in a dip,
`boulder`s either side, stepped across) at the north-east lane's bend; a
`cairn` where the south lane starts down.

**Recipe.** The wood's edge, stepping down: `oak` and `birch` on the banks'
tops, `hazel`, `elder`, `bramble` on the banks, `cowparsley`, `nettle`,
`foxglove`, `fern` at their feet, `weeds` cover on the lane's verges, `dirt`
2.6 m tracks worn to `wear 0.7`. North-east of the crossroads the trees thin
to the plains' heath (`gorse`, `tussock`); south of it they close (`spruce`,
`small-spruce`, `moss` cover, `mushroom`).

**Beats.** West gate, river behind → first bend, the well → second bend,
the oak's crown → the crossroads under the oak, three ways → the brook
crossing (if coming from the plains) → the cairn and the descent, light going
→ the forest gate.

**Sound.** `water` at the brook. Bed.

**Vista.** Over the banks at every bend: west, the river's water and copses;
north-east, the mill's silhouette (`vista-tower` stands in if the windmill
does not merge); south, `vista-forest` dense.

**Wants.** Nothing new.

### 3.6 Forest

**Sentence.** A clearing in the old wood with a cottage in it.

**Size.** 170 m. Altitude 10.

**Gates.** North at (0, −50) → forest path: two `oak`s and a `deadfall`.
South-east at (38, 42) → beach path: two `rock-shelf`s, the trees thinning
to `gorse`, the sea's glint beyond.

**Landmark.** The clearing itself, and in it the `cottage` (door →
`forest-cottage`) at (2, 2) with one giant `oak` at scale 1.4 beside it at
(−8, −6). From the north the cottage's roof is seen in pieces through trunks
for thirty metres before the clearing opens.

**Terrain.** Gentle: three `hill`s 2–3 m, a `basin` south-west with a pond
in it (`water` 14 × 10 at −0.5, `reeds`, `moss`), a `terrace` under the
cottage.

**Districts.** The wood (everything outside the clearing): `oak`, `birch`,
`spruce`, `small-spruce`, trunks 5–9 m apart in clumps, `fern`, `bramble`,
`mushroom`, `moss` cover under the dense stands, bare `dirt` floor under the
spruce. The clearing (radius about 22 m): `turf` with `flowers`, the
cottage, its `fence` garden with `lavender` and `hanging-herbs` seen through
the door, the `well`, the `log-pile`, the `trough`. The pond hollow. The
south-east rise where the wood opens to heath.

**Tracks.** `dirt` 2.4 m from the north gate winding between trunks to the
clearing, past the cottage and on south-east to the gate. A ride (`dirt`
1.6 m, wear 0.3) leaves the clearing west, rounds the pond and rejoins the
path north of the clearing: the loop.

**Beats.** Gate, trunks closing → the path bends, roof glimpsed → the
clearing opens, light, cottage and oak (arrival shot) → the door, the garden
→ the ride into the dark, the pond → back into the clearing from the north →
south-east, the trees thin, gorse, the sea's glint → the gate.

**Sound.** Bed with the wind low. `fire` at the chimney only if it smokes.

**Vista.** North, north-west, west: `vista-forest` and `vista-tree` dense
and close. South-east: far water and `vista-headland`, `vista-dune`. The
castle far north.

**Wants.** Nothing new.

### 3.7 Beach path

**Sentence.** A cliff-top path off the heath, down through a marsh, to the
dunes.

**Size.** 170 m. Altitude 8, the heath at +6 in the north falling to the
marsh at 0 and the dunes at +3.

**Gates.** North-west at (−40, −50) → forest: a hedged lane. North-east at
(36, −54) → plains: between two outcrops on the heath. South at (6, 74) →
coast: a blowout through the foredune.

**Landmark.** The sea stack off the coast's east arm, seen from the cliff top
across the bay to the south-east — the coast's landmark shown partly, so the
coast is wanted before it is reached. In the cell itself the cliff-top `cairn`
at (44, −10) marks the high point.

**Terrain.** A `scarp` along the east side (run 10, height 7, side toward
the sea) making the bluff, the sea on the skirt below it at −1.2. A `ridge`
of heath along the north. A `basin` in the middle (radius 20, depth 0.9)
holding the marsh: `mire` ground, `sedge` and `reeds`, `water` slivers in
its lowest part. Two dune `ridge`s across the south (3.5 m and 3 m) with a
`channel` cut through the outer one for the blowout (width 6, depth 1.2,
bank 8, sand all the way up).

**Districts.** The heath (north: `tussock`, `heather`, `gorse`, `outcrop`s,
a drystone `sheepfold` made of a `stone-wall-low` chain with one gap). The
bluff (east: the cliff-top path, `thistle`, `tussock`, the cairn, the view).
The marsh (middle: boardwalk on `post`s, `boards` track). The dunes (south:
`sand`, `marram` cover on the crests, `plume` in the slacks).

**Tracks.** From the plains gate: `dirt` 2.4 m along the bluff top (ledge
path, sea left) to the cairn, then switchbacks down the bluff's south end
(two turns, a `fallen-log` at the first) to the marsh edge. From the forest
gate: `dirt` 2.4 m between hedgebanks, meeting the first track at the marsh
edge. Across the marsh: `boards` 1.8 m on posts, one bend. Through the
dunes: `dirt` 2 m in the blowout, fading to sand.

**Loop.** A `dirt` 1.4 m track round the marsh's west side through the
willows to the dune foot rejoins the boardwalk's far end.

**Beats.** Plains gate, heath open, the sea appearing → the bluff top, the
stack across the bay → the cairn, the whole coast laid out → down the
switchbacks, the marsh below → the boardwalk, reeds either side → the dune
foot, sand underfoot → the blowout, sea heard loud, sky → the gate.

**Sound.** `surf` bed rising toward the south. Bed wind. Nothing placed.

**Vista.** East and south-east: `vista-headland` stepping into the water,
the stack's twin far off, far water. South: `vista-dune`. West: `vista-forest`.
North: heath hills, the mill's silhouette.

**Wants.** `marram` cover (§1c). `driftwood` (§4) for the strandline seen
from the dunes.

### 3.8 Coast

**Sentence.** A cove between two rock arms, with a fisher's hut in the lee of
the west arm and a stack standing off the east one.

**Size.** 180 m. Altitude 2. Sea level −3. The bed shelves to 1.4 m at the
barrier and drops past it.

**Gate.** North at (0, −44) → beach path, through the foredune blowout.

**Landmark.** The sea stack: a `crag` at scale 2.2 standing in the water off
the east arm at (66, 46), in line with the arm's trend. Seen whole for the
first time as the blowout opens onto the backshore.

**Terrain, sea to land.** Nearshore: the skirt's seabed. Foreshore: `wetsand`
band 8 m wide along the waterline. Berm: a `scarp` of 0.5 m along the whole
crescent. Strandline: `wrack` cover 2 m wide on the berm's top, `driftwood`
×3 along it. Backshore: `sand`, flat, 25 m deep. Foredune: a `ridge` at
z −30, 4 m, `marram` on its crest, steep to the sea. Behind it the blowout
lane and a second, lower `ridge` going over to `tussock` and `gorse`: the
grey dune. **West arm:** a `ridge` from (−70, −30) to (−46, 46), 6 m, `rock`
at its seaward end with three `crag`s of different sizes among `boulder`s,
`outcrop`s and `scree` at its foot, `gorse` and `heather` on its landward
top, a `standing-stone` on its crest at (−58, 10). **East arm:** lower, a
`ridge` 3.5 m with `boulder`s and `scree`, a `cairn` at its end at (62, 30),
the stack beyond in the water.

**The hut.** A `hut` at (−40, −12) on the first firm ground in the lee of the
west arm, above the berm, facing the sea. `skiff` drawn up on the backshore
below it, a `post` with a rope's worth of reason beside it, `barrel`, `pail`,
`log-pile` against the hut's landward wall. `lantern` on the post.

**Route and loop.** Blowout → backshore opens, the whole cove and the stack
(arrival) → down to the strandline and along it, feet on wet sand → west to
the skiff and the hut → up the arm's landward slope (turf, honest gradient)
to the standing stone: the vista point, the whole cove below and a `vista-sail`
on the offing → back along the foredune's crest (ridge path) east → the east
arm's cairn, the stack close → down to the strandline and back to the
blowout. Eight beats.

**Sea.** One `sea` entry 180 × 160 at −3, reach 600, segment 0.6, swell from
the south-south-east, length 34, height 0.6. The apron runs out over the
skirt's seabed. An invisible `barrier` along the 1.4 m contour.

**Sound.** `surf` bed. Wind. Nothing placed.

**Vista.** South: far water to the fog, `vista-sail` at apparent 400. East:
`vista-headland` stepping into the sea beyond the arm. West: `vista-dune`
and `vista-crag`. North: the heath's hills and the forest's edge.

**Wants.** `driftwood` (§4), `marram` and `wrack` cover (§1c).

---

## 4. Builders wanted

Asked for here; none is made until you say so. Each names what stands in if
it is not made, so no cell waits on it.

| builder | for | reads as | stands in |
|---|---|---|---|
| **`stile`** | village | two steps over a wall with a post either side — the goat quest names it | a gap in the wall |
| **`bench`** | village | a plank on two stones, the green's one rest | a `stool` |
| **`stepping-stones`** | riverside | five flat stones in a line across a riffle, tops dry | `boulder`s, not crossable |
| **`willow`** | riverside, beach path marsh | the tree that belongs at water, trailing | `elder` |
| **`driftwood`** | coast, beach path | a bleached bare log, root end up | `fallen-log`, which is brown and barked |
| `hawthorn` | plains | a small wind-bent tree with a dense crown, the only tree up there | `small-tree` |
| `stook` | farm | a cone of sheaves; a field of them is a harvest | `hay-bale` |

All seven made 2026-09-04. `stepping-stones` takes `rise` (base to top,
metres) and `count`; `willow` and `hawthorn` lean toward +Z, so the placer
aims them; `driftwood` lies along +X with its root end at -X.

Cover types `marram` and `wrack` (§1c) are ground data, not builders, and are
made in phase 1.

---

## 5. Phases

Each phase ends with a look from you before the next starts. Nothing is
pushed until the set is done.

| phase | work | you look at |
|---|---|---|
| **1. Ground** | §1a resolution and budget; §1b per-corner colour, feathered patches, smooth variation, palette in the tuning panel; §1c cover types | the plains as it is now, rebuilt at 1.5 m with the new colour, to judge the ground alone |
| **2. Water** | §2a stripe; §2b `course`; §2c bake on prepare and shared colours | the water showcase, and the old riverside with a course on its river |
| **3. Builders** | whichever of §4 you approve, one file each | the props gallery |
| **4. Village** | §3.1, the interiors relinked (`cottage`, `workshop`, `store`, `villager-hut`), the crate tower and `demos` door gone | the village, both gates, the three quests started and finished |
| **5. Farm** | §3.2, `farmhouse` and `barn` relinked | farm, and the letter quest end to end |
| **6. Plains** | §3.3 | plains from all three gates |
| **7. Riverside** | §3.4 on the phase-2 water | riverside |
| **8. Forest path** | §3.5 | the corridor from each gate |
| **9. Forest** | §3.6, `forest-cottage` relinked | forest |
| **10. Beach path** | §3.7 | beach path |
| **11. Coast** | §3.8, then the sea tuning pass with you | coast |
| **12. Close** | `world.json` portals and places; the map's place for `coast`; a walk of both loops; `check:world` is not run | the whole walk |

Budgets: every cell under 60 k ground triangles and near the village's entry
count; the coast's sea is the one per-pixel cost in the set.

### Status, 2026-09-04

Phases 1 to 8 are built and committed; nothing is pushed. **Resume at
phase 9, the forest.**

- **1. Ground** — done. Per-corner colour, feathered patches, smooth
  variation, grain on the stone materials, the closer palette, the debug
  panel's ground folder, `marram` and `wrack`. The village is at 1.5 m.
- **2. Water** — done. Sea to the horizon, river `course`, shared tints in
  the water folder. The bake stays on the first frame, which is under black.
- **3. Builders** — done, all seven.
- **4. Village** — built to §3.1 with these departures:
  - Ivy is on the churchyard's north wall, not the tower's north face. A
    wall cover is stated per mesh, so a face of the church cannot take it
    alone; the church whole would not be sparing.
  - The stream leaves the boundary twice (north-west in, south out). Those
    two gaps in the wall are closed by invisible barriers across the water,
    the way the beach closes its arms.
  - The `run` kind now lays `hedge` and `stone-wall-low` as well as fence
    and wall, and a run may carry a `cover`. The paddock hedges and the
    churchyard wall use it.
  - The church, the smithy and Nell's house have doorways and no door leaf:
    a door is only built by a portal, and they lead nowhere. A prop that
    stands a door in a builder's doorway would close this; not made.
  - Tom's is the fourth door counting from Ada's end, which is what the line
    says.
  - The `demos` hall no longer holds the villager hut; Wat's door is
    `wat-door` in world.json. The crate tower and its ladder portal are gone.
- **5. Farm** — built to §3.2 with these departures:
  - The river is cut across the terrain's south margin and leaves the square
    at its south corners, rather than lying on the skirt. The skirt carries
    the square's edge height under the level, so water at that height would
    have shown the skirt sheet through the channel.
  - The cart track leaves the lane just inside the arch, rounds the crop
    field's east, north and west sides, and rejoins the lane at its bend on
    the yard's edge, between the hay rick and the field gate.
  - The stooks stand in Hob's stubble field behind the barn. The crop field
    east of the yard is a standing crop.
  - The boundary is hedge runs with barriers behind them on the west and
    south; the chain lays the east wall and the north fence.
  - The dog and the hens are gone. Nothing smokes, so there is no fire.
- **6. Plains** — built to §3.3 with these departures:
  - The far water to the south-east is a plain `water` at −12 over the
    square's south-east corner, which a scarp beyond the wall drops by 16 m;
    the skirt's `sea` holds that seabed outward. The dune and the headland
    stand in it.
  - The pool plane is 13 × 13; the basin's contour gives the pool its shape.
  - A drystone wall runs the whole boundary between the north gate's crags
    and the south-east gate's outcrops, with the south-west gate hung in it.
  - The sheep track rounds the north foot under the clitter, climbs the east
    shoulder and drops past the pool to the gravel. No friction sound: the
    sails are still.
- **7. Riverside** — built to §3.4 with these departures:
  - The cut bank is the pool's basin summed onto the channel's outer bank,
    which takes that bank past the rock angle; there is no separate scarp,
    because a 2.5 m run would have stepped the meadow wherever it ended.
  - The narrows are two terraces cut into the banks at −0.3 either side of
    the bridge, with rock shelves on their faces; the bridge is 10 m long
    and rests on them. The west meadow is at the river's level and the east
    terrace 2 m above it.
  - The river leaves south-south-east, so the gate at (30, 62) is on the
    east terrace; beyond the square the reaches run out over the skirt and
    end where it rises through them.
  - The stepping stones are reached by a spur off the east track north of
    the bridge. The west boundary is the farm's hedge; the north, east and
    south-east are treelines with barriers behind them.

- **8. Forest path** — built to §3.5 with these departures:
  - Channels sum where they meet, so the crossroads is a terrace at the
    lanes' floor level, 8 m across with a 5 m blend, which stops the three
    lanes digging a pit under the oak. The oak stands on that level with the
    hill's foot behind it.
  - The banks are soft grass as stated, so the corridor's wall is the banks'
    mantle (hazel, elder, thicket, bramble) with slabs along the corridor's
    outline 13 m either side of each lane, the way the riverside's treelines
    are closed.
  - The south lane is cut 2 m deep over 8 m banks and the ground south of
    z 38 steps down 2.5 m over 30 m, so the floor falls about 3 m from the
    crossroads to the forest gate and the banks stand taller as it goes.
  - The river to the west is a bluff in the north-west corner of the square,
    dropped 8 m past the rock angle, with water at −6.5 held outward by the
    skirt's sea. It is seen from the north bank's top at the first bend, not
    from the lane floor.
  - The north-east gate is a five-bar gate in a drystone wall that runs 20 m
    into the wood either side and stops.
  - The pockets at the two west bends are small terraces cut into the outer
    bank; the well's post and lantern stand at the first, the log and stump
    at the second. The cairn is 16 m down the south lane.
  - The brook is a 1.5 m channel across the north-east lane's bend with its
    water 0.25 m below the floor, so the track fords it.
  - The fingerpost and the bird emitters are gone.

## 6. Open questions

1. **The church as the village's landmark.** It is the tallest builder in the
   kit and a village green wants a tower. If a church is not the fiction, the
   `manor` on the rise does the same job, or the `windmill` moves here and the
   plains take a `cairn`-topped tor.
2. **Wall cover.** Rose on Ada's cottage, ivy on the tower's north face,
   nothing else. Say if wisteria belongs on the shop front.
3. **Ground palette.** Tuned live in the panel, by you, once phase 1 is in;
   the table in §1b is a starting point only.
4. **Builders.** Which of §4.
5. **The `demos` door.** Wat's interior is currently entered from the demos
   room. It moves to his house in the village and the demos door goes.
