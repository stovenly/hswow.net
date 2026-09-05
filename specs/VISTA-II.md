# The vista, widened — spec

Nothing here is built. This is the plan for taking the out-of-bounds band from
fourteen builders that read as green blobs to a suite of distant country that
reads as slopes, ridges, woods and farmed land, and for putting each cell's
iconic thing on its neighbours' horizons where it really stands. Names below
are working slugs; the fiction and the naming are yours.

`VISTA.md` is the foundation and still holds: geometry not billboards, the
three bands and the air they stand in, the `vistaMass` grammar, the ring with
its signed-distance placement, per-prop parallax from `apparent`, the skirt,
the budgets. Read it first. This spec changes what the builders *are* and adds
one rule about *where* the landmarks go. It does not touch the fog, the skirt
or the parallax.

---

## 0. What exists

- **Builders**, all in `src/art/builders/vista-*.ts`: `hill`, `range`, `crag`,
  `headland`, `dune`, `forest`, `copse`, `tree`, `field-wall`, `hamlet`,
  `farmstead`, `tower`, `castle`, `sail`. Fourteen, each one displaced
  icosahedron or a row of them (`vistaMass` in `src/art/vista.ts`) under a
  three-colour `landWash`.
- **The ring** (`src/world/vista-ring.ts`): hand-placed props by world
  position plus seeded scatter by band, merged into 280 m chunks; props with
  `apparent` further than they stand are their own mesh and slide with the
  camera (`vista-parallax.ts`).
- **Each zone document** carries a `vistaRing` entry with its own `place` list
  of fifteen to twenty props. The neighbours' country is named by hand per
  zone: the farm's roof west of the village, the mill's silhouette as a
  `vista-tower` from the beach path, and so on. Nothing derives it from the
  map.
- **Budgets**: ≤ 300 triangles per builder, ≤ 5 000 for the props of a band,
  band outer edge ≤ `fogFar` × 0.9.

## 1. What is wrong with it

Judged from inside any cell, with the render at 960 × 540 and the dither on:

1. **Every landform is the same shape.** A displaced sphere squashed flat has
   no crest line, no asymmetry and no foot: it is a mound from every bearing.
   Real hills have a top edge with a rhythm along it, a steep side and a gentle
   side, shoulders and a notch or two. Six mounds in a row read as six mounds,
   never as a range.
2. **Every landform is one material.** A wash of three greens over the whole
   mass says pasture and nothing else. Real slopes change material with height
   and steepness: wood in the hollows and on the flank, turf on the shoulder,
   heath or rock on the crest, and the hedge lines of fields drawn over the
   lower slopes. Those bands are what tell the eye a slope is a slope.
3. **The wood has no edge.** `vista-forest` is a row of dark blobs. A wood seen
   from outside is a wall with a top: a ragged dark skyline, a lit face, a
   shadowed foot where it meets the field, and one or two trees standing off
   the line. That edge is the single most common distant feature in this kind
   of country and the kit cannot draw it.
4. **The horizon is not the map.** From the plains the mill is the tallest thing
   in the cell, and from the beach path it is a generic tower at a guessed
   bearing. From the village nothing says the plains are south. The landmarks
   are there for the cell that owns them and nowhere else.

## 2. What the eye reads at distance

Research notes, from landscape painting practice and the landscape character
assessments the English lowland and downland are described by. Sources at the
end.

**Air.** Distance compresses value before it compresses hue, and it
compresses everything toward the horizon tint. So a far mass survives as a
silhouette and two or three value steps; hue differences are gone by the
middle band. Edges soften with distance, and detail should be suggested, not
drawn. The nearest band is the only one that may carry interior contrast.
Our fog already does all of this; the consequence for builders is that
**everything past the near band is silhouette plus one value split**, and the
work goes into the outline.

**Landform silhouettes.** Old, worn country reads as long, low and rounded:
downs, whalebacks, rolling ridges stepping down at both ends. Young country
reads as jagged with exposed rock. This world is the first kind, with one
permitted exception: a far range on the horizon that is allowed to be higher
and bluer than anything nearer. The shapes that carry the read are:

- the **scarp and dip**: one steep face and one long gentle back, so a ridge
  has a front and a back and looks different from either side;
- **spurs and coombes**: ridges that send fingers down toward the viewer with
  valleys between them, overlapping like interlocking teeth — the strongest
  depth cue landform has, because each spur stands in front of the next;
- **shoulders and saddles** along a crest, and never two equal bumps side by
  side;
- **the foot**: a slope eases into the flat, it does not sit on it like a
  boulder; the change of slope at the foot is where woods and hedges gather.

**Vegetation bands.** Woodland clings to the steep ground and the crest, and
narrow woods along a scarp's top form skyline features on their own. Fields
climb the gentle slopes as a patchwork edged by hedges and standard trees.
Copses sit in field corners and on knolls. Shelterbelts are straight, planted
lines. Above a certain height on exposed ground the wood gives way to heath
and then bare rock. A **tree line** on a hill is read as a height, which is
how the eye scales the hill.

**Marks of people.** The far landmarks of a lowland skyline are few and always
the same: a church tower, a windmill on a ridge, a farmstead with its barn and
rick, a hamlet's roofs, a castle or a tower on a mound, a bridge, a line of
smoke. Fields as a patchwork of two or three greens divided by darker hedge
lines. A lane climbing a slope as a pale line between hedges. All of it sits
on the dry, in the lee, near water and on the way, the way the guideline says.

**Composition.** Painters build a far view as overlapping planes, each one a
value step lighter and cooler than the one in front, and each plane's outline
crossing the one behind it. Three or four planes are enough. The horizon line
itself is broken by something in every third of the frame, and the tallest
thing is never in the middle.

## 3. The grammar, extended

`vistaMass` stays for what it is good at: knolls, copse lumps, crag tops. It
gains two siblings in `src/art/vista.ts`, and every builder in §4 is drawn
from one of the three.

### 3a. `vistaRidge` — a crest with two sides

A polyline **crest** in plan with a **height** at each vertex, swept by a
cross-profile. The profile is asymmetric: a `face` slope and a `back` slope
given as run-per-metre-of-height, so a scarp is `face 1.2, back 4`, a
whaleback is `2.5, 2.5`, and a coombe side is a ridge turned to face the
viewer. Options:

- `crest`: three to nine points, heights rising and falling along it, ends
  stepping down to nothing; the placer never sees a flat top;
- `spurs`: zero to three short ridges branching off the face side and running
  down to the foot, each with its own falling height, so the face is not a
  wall;
- `notches`: one or two dips cut into the crest;
- `foot`: metres over which the slope eases into the ground at zero gradient,
  so the mass grows out of the skirt;
- `facets`: how many rows of quads across the profile, two to four. Big
  triangles are the style; a ridge of ninety triangles is a good ridge.

Generated as a strip mesh, welded, with the same ±`rough` displacement along
normals `vistaMass` uses but smaller (0.04–0.1), so the crest keeps its line.

### 3b. `vistaBank` — a band of material on a slope

Not a mesh. A colour policy taking `(x, y, z, slope, aspect)` and returning
one of a short list of materials by rules, so a ridge can be **turf below a
tree line, wood on the steep face, heath on the crest, rock where the face is
steepest**, with each boundary wobbling along the slope by a slow sine so it
is a band and not a contour line. Materials are short palettes as `landWash`
uses now: `pasture`, `hay`, `crop`, `heath`, `wood`, `scrub`, `rock`, `scree`,
`sand`, `water`. Fields are a special case: a cell noise at 40–90 m in plan
picks one of `pasture`, `hay`, `crop` per cell, and the faces within about
1.5 m of a cell boundary take `hedge` (the wood palette, dark). At 200 m and
beyond the hedge lines are one dark pixel, which is exactly what a hedge is at
that range.

Because colour is per face in `assemble`, none of this costs a triangle. The
`slope` and `aspect` inputs are computed from the face normal before the
colour function runs, which `Part.color` does not yet receive; it gains an
optional fourth argument.

### 3c. `vistaWoodEdge` — a wall of canopy with a top

The forest from outside. A polyline **edge** in plan; behind it a slab of
canopy `depth` metres deep whose top wanders between `low` and `high`, whose
front face is a vertical wall of two facet rows (lit canopy above, shadowed
foot below, the foot always darker), and whose skyline is broken every eight
to fifteen metres by a rounded crown one or two metres above the rest. Two or
three **standards** — single `vistaMass` crowns on a short trunk quad —
stand a few metres in front of the wall at uneven spacing. Zero to one **gap**
where a ride or a lane goes in, drawn as a notch in the wall down to a third
of its height. This is a builder of its own (`vista-wood-edge`) and also the
policy that dresses the flank of a ridge with wood.

## 4. The roster

Six families, sixty-odd builders. Ten times the *variety*, not ten times the
files: most entries are one builder with two or three named `variant` options
(`RockShelf` already takes options this way), and the ring picks a variant by
seed unless the placer names one. Triangle budgets are per build; ≤ 300 hard,
and the far families sit well under 100 because they are silhouettes.

### 4a. Landforms (`vistaRidge` unless said)

| slug | reads as | variants | tris |
|---|---|---|---|
| `vista-down` | a long rounded whaleback, both sides gentle | short, long, double-crested | 80 |
| `vista-scarp` | a steep face and a long back, the classic escarpment | wooded face, bare face, with hanging wood on the crest | 100 |
| `vista-ridge-spurs` | a ridge sending two or three spurs toward the viewer, coombes between | 2 spurs, 3 spurs | 140 |
| `vista-knoll` | one small steep hill on its own, often with a copse or a tower on top (`vistaMass`) | bare, wooded, with a tor | 60 |
| `vista-tor` | a granite top: a rounded hill with a stack of blocks on the crest and clitter below | one stack, two stacks | 90 |
| `vista-foothills` | three or four low overlapping rises stepping up toward a range behind | — | 120 |
| `vista-mountain` | one high mass with a distinct peak, rock above a tree line, for the far band only | peaked, flat-topped, twin | 110 |
| `vista-range-far` | five to seven peaks welded into one long jagged profile, at the horizon, bluest thing in the frame | — | 160 |
| `vista-plateau` | a flat-topped table with a steep rim, moor on top | — | 90 |
| `vista-valley-side` | one side of a valley: a long slope facing the viewer, fields low and wood high, so the viewer reads a valley between here and there | — | 110 |
| `vista-bluff` | a river or coast bluff: a short steep drop with a flat top, rock painted on the face | — | 60 |
| `vista-cliff` | a sea cliff, taller, with a wave-cut foot | — | 80 |
| `vista-headland` | keep, rebuilt on `vistaRidge` so it has a spine running into the sea | — | 90 |
| `vista-stack` | a sea stack off a headland, in line with it | — | 40 |
| `vista-dune-field` | a row of three to five dune ridges, crests sharing the wind's bearing | — | 100 |
| `vista-hill` | keep, for the near band only, with the bank policy (turf below, wood on the steep side) | — | 120 |
| `vista-range` | keep, rebuilt on `vistaRidge` so its crest has a line | — | 150 |
| `vista-crag` | keep | — | 100 |

### 4b. Woods and trees

| slug | reads as | variants | tris |
|---|---|---|---|
| `vista-wood-edge` | the wall of a wood with a ragged top and a dark foot, standards in front | straight, bowed, with a ride gap | 160 |
| `vista-hanging-wood` | a wood on a steep slope, its top edge along a crest, seen face on | — | 120 |
| `vista-shelterbelt` | a straight planted line of tall trees, even spacing on purpose | 5 trees, 9 trees | 80 |
| `vista-copse` | keep; three to five crowns on a knoll or in a field corner | — | 80 |
| `vista-plantation` | a dark rectangular block of conifers with straight edges, the one wood that is a box | — | 60 |
| `vista-avenue` | two parallel lines of trees with a pale lane between | — | 90 |
| `vista-orchard` | a grid of small round crowns, low, pale green | — | 90 |
| `vista-tree` | keep; a lone standard in a field | oak, pine, dead | 60 |
| `vista-scrub` | a loose scatter of low dark lumps on a slope, gorse and thorn on heath | — | 70 |
| `vista-forest` | keep, rebuilt as a wood with an edge on the near side and a lumpy interior behind | — | 200 |

### 4c. Fields and ground

| slug | reads as | variants | tris |
|---|---|---|---|
| `vista-patchwork` | a slope of hedged fields, two or three greens with dark lines between, standards at the corners; the bank policy laid on a low `vistaRidge` | pasture, mixed, harvest | 110 |
| `vista-strip-fields` | long narrow strips running downslope, alternate colours | — | 80 |
| `vista-hay-field` | a pale field with a row of ricks in it | — | 70 |
| `vista-stubble` | a pale gold field with stooks in rows | — | 70 |
| `vista-field-wall` | keep | — | 60 |
| `vista-hedge-lane` | a lane between two hedges climbing a slope, seen as a pale line between two dark ones | — | 50 |
| `vista-moor` | a broad dark heath with a paler sheep track across it and one cairn | — | 70 |
| `vista-marsh` | a flat of reeds and standing water glints with a line of willows | — | 90 |

### 4d. Marks of people

| slug | reads as | variants | tris |
|---|---|---|---|
| `vista-church` | a west tower and a nave, the tower always the tallest thing in its cluster | tower, spire | 90 |
| `vista-windmill` | a tower mill with four sails, on a rise | tower, post mill | 80 |
| `vista-watermill` | a mill with a wheel by a water glint | — | 90 |
| `vista-hamlet` | keep | — | 250 |
| `vista-farmstead` | keep; a house, a barn and a rick round a yard | — | 120 |
| `vista-barn` | one long roof on its own in the fields | — | 40 |
| `vista-cottage` | one roof with a chimney at a wood's edge | — | 50 |
| `vista-tower` | keep; the generic tall thing | — | 80 |
| `vista-castle` | keep | — | 200 |
| `vista-ruin` | a broken tower and one standing wall on a knoll | — | 90 |
| `vista-bridge` | three arches over a water glint | — | 90 |
| `vista-causeway` | a straight raised road across marsh, with posts | — | 60 |
| `vista-beacon` | a cairn and a pole on a summit | — | 40 |
| `vista-stones` | a ring or line of standing stones on a down | ring, row | 60 |
| `vista-sheepfold` | a small walled square on a hillside | — | 40 |
| `vista-smoke` | not geometry: a vertical ribbon of pale grey, three quads, fading up, pinned over a chimney; opaque geometry, no texture, the one moving thing allowed because it does not move | — | 6 |

### 4e. Water

| slug | reads as | variants | tris |
|---|---|---|---|
| `vista-mere` | a flat pale water glint in a hollow with reeds on the near shore | — | 40 |
| `vista-river-reach` | a bend of pale water between two banks, seen along it | — | 50 |
| `vista-weir` | a white line across a river reach | — | 20 |
| `vista-sail` | keep | one, two | 30 |
| `vista-island` | a low wooded island in far water | — | 60 |

### 4f. Cell icons — see §5

One per exterior cell, eight builders. Each is the cell's landmark at vista
scale in its own company, and nothing else: `vista-icon-village` (the church
tower over a short row of roofs), `vista-icon-farm` (the barn's long roof
with the rick beside it), `vista-icon-plains` (the windmill on its ridge),
`vista-icon-riverside` (the footbridge and one great oak over a water glint),
`vista-icon-forest-path` (the great oak's crown standing over a wood's edge
where three lanes meet), `vista-icon-forest` (a clearing in a wood with one
roof and a chimney in it), `vista-icon-beach-path` (the bluff with its
cairn), `vista-icon-coast` (the two arms and the stack between them). Each
is a composition of the §4 pieces at fixed relative positions, built as one
mesh, ≤ 250 triangles.

## 5. The neighbours' horizons

**The rule.** Every exterior cell shows the icon of every other exterior cell
within reach, at the true bearing and at its true distance, and shows nothing
that contradicts the map.

**The data is already there.** Each zone document has `place.at` in
kilometres on the world map and `+X` east, `+Z` south in every cell; the map's
`y` is south too. From cell A at `(ax, ay)` to cell B at `(bx, by)`:

- bearing: the world vector `(bx − ax, by − ay)`, so the icon stands on the ray
  from A's origin along that vector;
- distance: `d = hypot(bx − ax, by − ay)` km, in metres;
- **within reach** when `d ≤ 3 km`, or when A and B share a portal at any
  distance.

Today's distances (km): village–farm 1.7, village–plains 1.6, farm–riverside
1.8, plains–forest path 2.1, riverside–forest path 1.8, forest path–forest
1.5, plains–beach path 4.2, forest–beach path 1.5, beach path–coast 1.4. So
the village sees the farm and the plains; the plains see the village, the
farm, the forest path and the beach path; the coast sees the beach path and
the forest. Nine of the twelve pairs within 3 km are also portal pairs, which
is what makes the rule feel like the map rather than like decoration.

**Placement.** The ring gains one option, `neighbours: true`, and the document
gains `vista.icon: 'vista-icon-plains'`. With both, the interpreter adds one
`place` entry per neighbour to the ring's plan before scatter runs:

- `at`: on the bearing ray, at the band's outer edge minus the icon's radius,
  so it is the farthest thing in the honest band and everything scattered
  stands in front of it;
- `apparent`: the true distance in metres, so parallax makes it hold nearly
  still (1 600 m read from a 150 m stand is `k` ≈ 0.9);
- `scale`: whatever makes it subtend what the true thing would at the true
  distance, times a forced-perspective factor of 1.5, because at 960 pixels
  across an honest 30 m tower at 1.7 km is twelve pixels tall and the lie is
  what lets it read. The factor is one constant, in one place;
- the neighbour's icon is **exempt from the keep-out clamp**, or it is placed
  first so nothing pushes it. Its bearing is the whole point.

**Agreement with the gates.** A gate faces its neighbour, so the neighbour's
icon must lie beyond that gate, not off to one side. For every portal pair,
the bearing from the gate's position to the icon should be within about 30°
of the gate's facing. Where the map coordinate disagrees with the gate, the
map coordinate is wrong and moves; the gates are the fixed points.

**Consistency.** The hand-placed `place` lists lose every entry that stood in
for a neighbour (the `vista-tower` for the mill from the beach path, the
`vista-farmstead` for the farm from the village, the hamlet from the farm and
the plains). Generic country stays hand-placed and scattered as now.

**The far layer.** Beyond the icons, at `apparent` 2–6 km, the horizon takes
`vista-range-far` and `vista-mountain` on bearings that are the same from
every cell: one far range along the whole north, say, and nothing to the
south where the sea is. Stated once as data the ring reads (`horizon: [...]`
in a shared file), not per zone, so walking from cell to cell keeps the same
mountains in the same place. Which bearings, and whether there are mountains
at all, is yours (§7).

## 6. Composition rules for a band

For the person placing a zone's ring, in addition to `ENVIRONMENT-DESIGN.md`:

1. **Three planes.** Near (60–140 m, honest): hedges, copses, knolls, the
   wood's edge, fields; full bank colouring. Mid (`apparent` 300–900 m):
   downs, scarps, spurs, icons; two values each. Far (`apparent` 2–6 km):
   ranges and mountains; one value, the horizon tint darkened a step.
2. **Every plane crosses the one behind it** somewhere in every main view.
   A spur in front of a down in front of a range is three overlaps and reads
   as a mile of country.
3. **Break the horizon in every third of the frame** from the arrival shot and
   from the landmark, with the tallest break never dead centre.
4. **The wood has an edge facing the player.** Never place `vista-forest`
   with its interior toward the cell.
5. **Fields on the gentle side, wood on the steep.** The bank policy does this
   inside a builder; the placer does it between builders.
6. **One icon per neighbour, no stand-ins.** If a neighbour is out of reach,
   its country is suggested by generic props of the right family and no
   landmark.
7. **Match the cell's country at the edge.** A cell's near plane continues
   what the cell is: dunes and gorse behind the coast, wood behind the forest,
   heath and walls behind the plains.

## 7. Open questions

1. **Mountains.** The far range gives the world a skyline it does not have
   now. One range along the north, none elsewhere, is the proposal. Say if the
   world is flatter than that.
2. **The icons' fiction.** Each icon is the cell's landmark as the spec has
   it. If a cell's identity should be something else on the horizon (the
   forest's smoke rather than its clearing), say so.
3. **Reach.** 3 km, and always across a portal. A larger reach puts more on
   every horizon and makes the world read smaller.
4. **Naming.** All slugs are working names.

## 8. Phases

Each ends with a look from you.

| phase | work | you look at |
|---|---|---|
| 1. Grammar | `vistaRidge`, `vistaBank` with the slope/aspect argument on `Part.color`, `vistaWoodEdge`; `vista-hill`, `vista-range`, `vista-forest` rebuilt on them | the props gallery, and the plains' existing band |
| 2. Landforms | §4a | a test ring of every landform at three distances |
| 3. Woods and fields | §4b, §4c | the same ring |
| 4. People and water | §4d, §4e | the same ring |
| 5. Icons | §4f, one per cell | each icon in the gallery |
| 6. Neighbours | §5: `neighbours`, `vista.icon`, the far layer file, the hand-placed stand-ins removed | the village from both gates, the plains from the saddle |
| 7. Bands | every exterior's ring re-laid to §6 | each cell from its gates and its landmark |

Budgets hold: ≤ 300 triangles per builder, a band's props ≤ 6 000 (raised
from 5 000 for the icons), draw calls as now.

## Sources

- Atmospheric perspective in landscape painting: value compression, cooling,
  edge softening, simplification with distance —
  https://www.virtualartacademy.com/atmospheric-perspective/ ,
  https://drawpaintacademy.com/atmospheric-perspective/ ,
  https://samuelearp.com/blog/how-to-create-atmospheric-depth-in-a-landscape-painting/ ,
  https://lorimcnee.com/mastering-aerial-perspective-for-believable-landscape-paintings/
- Mountain forms: young jagged against old rounded, tree line as a scale cue,
  overlapping forms — https://samuelearp.com/blog/8-essential-tips-for-painting-mountains-from-life/ ,
  https://skyryedesign.com/art/mountains-drawing/ ,
  https://followmybrushmarks.wordpress.com/2020/08/29/mountains-on-my-mind-tree-lines/
- Interlocking spurs — https://en.wikipedia.org/wiki/Interlocking_spur
- Low-poly scenery: silhouette first, colour over detail, layering —
  https://www.gamedeveloper.com/design/how-to-make-low-poly-look-good ,
  https://retrostylegames.com/blog/low-poly-game-art-an-ultimate-guide/
- Landscape character of chalk scarp and vale, downs, escarpment: skyline
  woods on the crest, hedgerow patchwork, the church tower as landmark —
  https://www.dorsetcouncil.gov.uk/countryside-coast-parks/the-dorset-landscape/landscape-character-type.aspx?id=107a00b5-bd6b-4f71-b4fd-1bbc656937c9 ,
  https://kentdowns.org.uk/wp-content/uploads/2023/01/7.0-LCA-2C_Postling-Scarp-and-Vale_FINAL.pdf ,
  https://www.cotswolds-nl.org.uk/wp/wp-content/uploads/2025/02/LCT-2-Escarpment.pdf ,
  https://www.southdowns.gov.uk/wp-content/uploads/2015/03/ILCA-Appendix-A-Open-Downland.pdf
- Shelterbelts and planted lines — https://www.woodlandtrust.org.uk/plant-trees/agroforestry-benefits/shelterbelt/
