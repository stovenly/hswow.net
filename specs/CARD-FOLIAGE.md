# Card foliage — spec

**Built.** `TREES.md` rebuilt every tree as wood plus branch cards and left four
shrubs, the hedge and the whole vista band on the old grammar. This is the rest
of the foliage: the shrubs and the hedge rebuilt on cards, three species added
that the kit has no shape for, single vista trees replaced by cards of the real
trees, and the wooded vista masses given the quality pass they have never had.

**The one-sentence version:** `thicket`, `gorse`, `bush` and `bramble` lose the
lobe and the fins and become wood with cards on it; `hedge` becomes a line of
carded stools with no mass inside it that is still hard to see through; palm,
baobab and acacia join the kit and stand on the coast; a vista tree becomes
either the real tree or a card of it, said so by hand at the placement; the
leaves go white in snow like the grass does; and the wooded masses stop being
smooth green blobs.

Checked against `art/foliage.ts`, `art/cards.ts`, `art/canopy.ts`,
`art/branchSheet.ts`, `art/limbs.ts`, `art/flex.ts`, `art/underfoot.ts`,
`art/vista.ts`, `art/vista-kit.ts`, `art/lines/hedge.ts`, `art/cover.ts`,
`art/finish.ts`, `world/WeatherRig.ts`, `world/stands.ts`,
`world/vista-ring.ts`, `world/ZoneManager.ts`, `engine/work/jobs.ts`, the
sixty-six `vista-*` builders and the eight outdoor zone documents, as they
stand. Nothing is to be built to verify it — the render is the ground truth.

---

## 1. The ask

- `thicket`, `gorse`, `bush`, `bramble` reworked to the card technique. Keep
  the general idea of each; lose the big fluffy lobe and the floppy fins.
- Three more species: **palm**, **baobab**, **acacia**.
- The vista trees reworked to use the billboard stands instead of what they
  use now. A close placement gets the actual tree; a far one gets the
  billboard — **and which it is, is said at the placement, never worked out by
  the engine.**
- The leaves on the cards turn white slowly over time when it is snowing, the
  way groundcover already does.
- The wooded vista masses stay masses, but they look bad and get a quality
  pass: proper forests at a distance.
- Once that is done, the old builders go, or are replaced.
- `hedge` reworked to the card technique. It keeps its collision, and it is
  dense enough that it is very hard to see through.

**Land the work one or two phases at a time and hand it back for a look before
the next.** See §3.

---

## 2. What this stands on

| | |
|---|---|
| `art/foliage.ts` | `branchCards`, `cloud`, `crownOf`, `Twig`, `Species`, `LEAVES`, `STAND_SPECIES`. The card grammar, unchanged in kind. Cards root on twigs and point out along them; `clouds` are the invisible envelope they fill. |
| `art/limbs.ts` | `growLimb`, `GrowForm`, `limbGeometry`, `limbBranch`, `sweep`. Every stem, cane, stool and bough in this spec is a `GrowForm`, the same as every tree's. |
| `art/branchSheet.ts` | Eight kinds, six tiles each, boot-rendered. `broadleaf`, `birch`, `conifer`, `willow`, `pinnate`, `pine`, `smallleaf`, `blossom`. §5 and §6 say which kind each new plant draws from; the sheet grows one row and only one. |
| `art/canopy.ts` | `FIN_FLAG` for blossom, `CANOPY_MODE.branch` for a turning card and `.pinned` for a fixed crossed pair, and `canopyUniforms` — `uSeasonA` and `uSeasonB` and nothing else. §7 is the one shader change in this spec; blossom, fruit and season need none. |
| `art/cards.ts` | `CardAtlas`, `frameOf`, `cardStand`, `CardVariant`, `CardInstance`. Written for `TREES.md`, complete, and **currently unreferenced** — nothing places a card. §9 is what gives it a placement path. |
| `art/flex.ts`, `art/underfoot.ts` | The trunk's wind travel and what falls under a tree. Every new species needs a row in both; §6.4 sets them. |
| `art/vista.ts` | `vistaMass`, `landWash`, `markVista`, `VISTA_TRIANGLES = 300`. The mass recipe the whole band is built on, and the budget §10 works inside. |
| `world/stands.ts` | `raiseStands` gathers a zone's crowns into one instanced mesh per variant and records `collected.cards`: the key, the trunk geometry, the crown geometry, and where every copy stands. That record is already the exact input `CardAtlas` wants. |
| `engine/work/jobs.ts` | `prop-geometry` builds a prop in a worker and returns `PropWire` with the trunk geometry **and the crown geometry separately**. A real tree built off-thread hands back the two halves a `CardVariant` is made of, for free. |
| `world/vista-ring.ts` | `VistaProp`, `VistaScatter`, `vistaRingPlan`, `vistaRing`. Placement is an offset from the level outline; still props merge into chunks, `apparent` props stay separate for parallax. |
| `world/ZoneManager.ts` | Holds `postfx.renderer`. The atlas render is a main-thread renderer pass and can only happen here, after the ring is built. |
| `world/WeatherRig.ts`, `art/cover.ts`, `art/finish.ts` | `lying` — how deep the snow is, 0..1, already lagged by `SETTLE` and `THAW` — driving `finishUniforms.uSnow` for surfaces and `coverUniforms.coverSnow` for the grass. §7 gives the crowns the third reader of the same number. |

---

## 3. How the work lands

| Phase | What lands | What to look at |
|---|---|---|
| **1** | `bush` and `thicket` rebuilt: wood, cards, no lobe, no fins | A hedgerow bottom on the farm, thickets in the forest and on the riverside |
| **2** | `gorse` and `bramble` rebuilt, with gorse's yellow kept as a blossom flag | The coast and beach-path gorse; brambles along the forest path |
| **3** | `hedge` rebuilt on cards, no mass inside it. Collision unchanged; opacity is the thing to judge | The farm and village hedges, stood right against and looked through |
| **4** | **Palm, baobab and acacia**, the `frond` sheet row, and all three placed on `coast` and `beach-path` | Three silhouettes against the sea, and whether the bend of reality reads |
| **5** | The card placement path: cards buildable outside a zone's own stands, one ring-owned atlas, and a `tree` placement that says whether it is a card. `vista-tree`, `vista-shelterbelt` and `vista-avenue` converted | One card oak beside one real oak at the same distance, and the shelterbelt on the farm horizon |
| **6** | **Snow on the leaves**: the crowns whiten as the ground does, and the vista's cards with them | Standing in the forest through a snowfall, and the horizon behind it |
| **7** | The quality pass on the wooded masses: `vista-forest`, `vista-copse`, `vista-wood-edge`, `vista-hanging-wood`, `vista-plantation`, `vista-orchard`, `vista-scrub`, and the `treeParts` trees the landform builders carry | Every outdoor zone's horizon, before and after |
| **8** | Removal: `vista-tree`, `vista-shelterbelt`, `vista-avenue`, and the zone documents that name them | Nothing new; nothing dead left |

Phases 1 and 2 may go together. 3, 4 and 5 are each their own — 5 is the
architecture, and if its look is wrong 6 must not start. 6 is small and rides
after 5 because half of it is the vista's cards. 7 and 8 may go together.

**If a phase's look is rejected, the next phase does not start.**

---

## 4. What is wrong with the four shrubs now

All four are the same three moves: one or more `lobe` masses — a displaced
sphere, shaded from a noise field — with `fringe` fins stuck through the skin
and, on two of them, `tufts` of grass blades.

| Builder | Now | What survives the rework |
|---|---|---|
| `thicket` | 3–5 arching stems out of a stool, two lobes hung on each, a core lobe, 30–40 tufts | The stems. Arching out and back in, stool at the foot, head high, stems showing through |
| `gorse` | 3–5 lobes in a mound, 50–70 spine tufts, 36–48 yellow blossom fins | The mound. Dense, dark, spiny, yellow over the sunny side all year |
| `bush` | One lobe, 12–16 fins | The one low mass with no trunk, so the whole plant leans rather than bends |
| `bramble` | 5–8 cylinder canes looping out and diving back, one low lobe, 10–14 fins | The canes. Looping out of a low mass and back to the ground |

The lobe is what has to go. It is a solid ball of leaf colour with a hard
silhouette, and next to a carded tree it reads as a different game.

---

## 5. The four shrubs after this work

Each is wood grown with `growLimb` and clothed with `branchCards`, exactly as
every tree now is. The clouds are the envelope only — nothing draws them.

| Builder | Wood | Sheet kind | Card length, m | Height, m | Solid |
|---|---|---|---|---|---|
| `bush` | 3–5 short stems from one stool, no trunk, 2 levels | `smallleaf` | 0.30–0.45 | 0.7–1.1 | no |
| `thicket` | 3–5 stems arching out and back, 3 levels, stool at the foot | `smallleaf` | 0.35–0.55 | 2.2–2.9 | **yes** — it is stated as too dense to push through and has never had a collider |
| `gorse` | 4–6 stiff stems from a low crown, 3 levels, short and much-forked | `pine` needles, dark | 0.18–0.30 | 1.0–1.5 | yes, as now |
| `bramble` | 5–8 canes, swept as tubes rather than cylinder chains, arcing out and diving back to the ground | `smallleaf` | 0.22–0.35 | 0.9 mass, canes to 1.4 | no, as now |

Notes that are not free choices:

- **Gorse's yellow stays a flag, not a colour.** A second `branchCards` pass over
  a third of the twigs, `tiles: SHEET_OF.blossom`, `flag: FIN_FLAG.evergreenBlossom`,
  `colour: LEAVES.gorseYellow` — the same shape `hawthorn` already uses for its
  spring. That is what keeps it on all year and keeps the season shader out of it.
- **Gorse's needles are the `pine` row tinted with `LEAVES.gorse`,** which is
  already a dark green pair. No new row: a gorse spine and a pine needle are the
  same picture at three metres.
- **Bramble's canes become `sweep` tubes.** Four butted cylinders with a
  decreasing pitch is what makes the current cane read as a segmented worm; one
  swept tube through the same points is the same shape without the joints.
- **`bush`, `thicket` and `gorse` are already in `STAND_SPECIES`;** they are
  built once per zone in four variants and instanced, and that keeps working
  unchanged. `bramble` is not, and joins it — 42 scattered brambles across four
  zones is exactly the case the stand path exists for.
- The `Species.weight` functions and `finishFoliage` calls are unchanged in
  shape. Only what is between them changes.

---

## 6. Three new species

None of these is a variation on a tree the kit has. Each is a different
proportion, and the proportion is the whole read.

### 6.1 `palm`

The tropical one. Height 6–11 m to the crown.

- **Wood.** One unbranched trunk, no limbs at all — `sweep` through five points
  with a lean of 0.08–0.22 rad that increases above half height, so it curves
  rather than tilts. Radius 0.20 at the foot to 0.13 under the crown, with a
  slight swell at the base. Colour a pale grey-brown with darker ring scars
  laid in by the colour function, banded every 0.25 m.
- **Crown.** 14–22 fronds off the trunk's top, at even bearings with a little
  wander. **One frond is one card**, 2.4–3.6 m long, and there is no wood under
  it — the frond's own stem is in the picture. The bearings are the twigs:
  each is a `Twig` from the crown point outward and downward, its pitch rolled
  between +0.5 and −0.9 rad so the outer ones arch over and fall.
- **Cards are pinned, not turning, and not crossed.** A frond is a flat blade
  with a real orientation; turning it about its own axis would spin it. Eighteen
  fronds at eighteen bearings and eighteen pitches cover every view between
  them, which is exactly how a real palm reads.
- **A collar** of 3–5 dead fronds hanging straight down under the live ones,
  same card, `colour: LEAVES.dry`.
- **Sheet kind: `frond`, a new row.** This is the one row the spec adds. A frond
  is a single long blade with a midrib and forty leaflets down it, filling the
  tile lengthwise; nothing in the eight existing kinds is that shape at that
  aspect.
- `LEAVES.palm`: a bright yellow-green, lit well above `broadleaf`, shade close
  to it, because a frond in sun against a frond in shade is most of the read.
- `FLEX.palm = 0.7`. Nothing else in the kit whips like a palm trunk.

### 6.2 `baobab`

*Adansonia grandidieri.* Height 14–22 m, and the trunk is 70% of it.

- **Wood.** One enormous trunk: radius **0.9–1.5 m**, barely tapering — 0.82 of
  the foot radius at the top, not the 0.4 every other tree in the kit uses.
  Smooth, no buttress, no lathe flutes; a pale grey with a pink cast, and the
  colour function laying faint vertical shading rather than bark texture.
  This is the whole silhouette from any distance and it must not be given
  ordinary bark.
- Above 0.72 of the height, **5–8 boughs** break out at once — short, thick
  (0.3 of the trunk's radius), rising steeply for their first third and then
  flattening hard, forking twice into a plate. `GrowForm.lift` of
  `[0.8, 0.1, -0.15, -0.2]`, `levels: 3`, `angle` wide from level 1.
- **Crown.** A flat plate, not a ball: clouds at radii `(5–7, 1.1–1.7, 5–7)`
  sitting on the bough ends, so the envelope is four times wider than deep.
- **Sheet kind: `smallleaf`.** Baobab leaves are small and palmate and the row
  already renders them.
- `LEAVES.baobab`: a grey-green, both ends duller than `broadleaf` — dry-country
  foliage against a hot sky.
- `FLEX.baobab = 0.05`. It is the stiffest thing in the kit.
- Cards 0.5–0.8 m, turning, dense on the plate's upper surface and sparse under
  it, which is what leaves the boughs visible from below.

### 6.3 `acacia`

The savanna umbrella. Height 6–9 m, crown 8–12 m across.

- **Wood.** A short trunk, 1.6–2.6 m to the first fork, then **2–4 boughs** that
  go out hard at 1.0–1.3 rad off vertical and fork three more times, each fork
  flattening further. `GrowForm.lift` of `[0.35, 0.05, -0.05, -0.05]`,
  `levels: 3`, `minRadius: 0.02`. The branch structure is meant to be **read
  through the crown from below and from the side**; it is half the picture.
- **Crown.** A flat disc riding on the outer twigs: clouds at radii
  `(4.5–6, 0.55–0.95, 4.5–6)`, centred at 0.82 of the height. Flat on top, flat
  underneath, and thin.
- **Sheet kind: `pinnate`,** the ash and rowan row. An acacia's bipinnate leaf
  is finer than an ash's, but the row is a compound spray of small leaflets and
  that is what reads at any distance an acacia is seen from. **No new row.**
- `LEAVES.acacia`: a grey-green a shade warmer than baobab's, and the widest
  lit-to-shade gap in the kit after holly, because a thin flat crown lit from
  above is exactly that contrast.
- `FLEX.acacia = 0.25`.
- Cards short — 0.35–0.55 m — and many, because the plate has to hold together
  as a plate.

### 6.4 The tables that follow

| Table | Gains |
|---|---|
| `LEAVES` in `art/foliage.ts` | `palm`, `baobab`, `acacia` |
| `STAND_SPECIES` in `art/foliage.ts` | `palm`, `baobab`, `acacia` |
| `FLEX` in `art/flex.ts` | `palm: 0.7`, `baobab: 0.05`, `acacia: 0.25` |
| `underfoot` in `art/underfoot.ts` | all three `null`, as every other tree is |
| `KIND_ORDER` in `art/branchSheet.ts` | `frond`, with a `BranchForm` — one stem, forty leaflets, `aligned`, no sub-shoots |

### 6.5 Where they grow

**`coast` and `beach-path`, and reality bends to fit.** These are the two zones
that already read as somewhere warm at the edge of the map, and they are the two
that have the open ground and the sea horizon that all three of these trees want
behind them.

| Zone | What goes in |
|---|---|
| `coast` | A group of 3–5 **palms** on the dune line above the beach, leaning off the prevailing wind; one **baobab** stood alone as a landmark, well back from the water and away from the gorse |
| `beach-path` | **Palms** in ones and twos along the path where it runs above the sand; one **acacia** on the open ground inland of it, and a second baobab only if the first reads |

Placements are hand-written `prop` entries with real positions, not scatters —
these are landmarks and there are fewer than a dozen of them. The existing gorse,
thicket and bramble scatters are not touched; §5's rework already changes what
they look like and two changes in one shot cannot be judged apart.

`guidelines/ENVIRONMENT-DESIGN.md` is read before the positions are chosen, and
its checklist is run before the phase is reported.

---

## 7. Snow on the leaves

A crown should go white as it snows, at the pace the grass does. It does not
today: the ground whitens, the boughs whiten, and the leaves stay green.

### 7.1 Why the crowns are the only thing left out

Three readers of one number. `WeatherRig` integrates `lying` — how deep the
snow is, 0..1 — toward its target at `SETTLE` and away at `THAW`, and hands it
to `finishUniforms.uSnow`, which lays snow on every up-facing surface through
the finish stage, and to `setCoverWeather`, which mixes the grass blades toward
`vec3(0.86, 0.9, 0.96)` at up to 0.62.

`canopyUniforms` has no third entry. It carries `uSeasonA` — bare, autumn,
spring, winter darkening — and `uSeasonB` — blossom, fruit — and nothing about
weather at all. So a snowed-in wood has a white floor, white boughs, and a
green canopy over both.

**The lag comes free.** `lying` is already the slow number: it is what makes
snow settle over a minute rather than switch on. The crown reads the same one,
so it whitens at exactly the rate the grass under it does, and this spec
introduces no timing of its own.

### 7.2 What lands

`canopyUniforms` gains `uSnow`, set in `WeatherRig` on the line beside
`finishUniforms.uSnow` and `setCoverWeather` — the same value, no gate of its
own.

**Where it lands on a leaf is not even.** A card is a picture, not a surface:
there is no per-pixel up-facing normal to test the way the finish stage tests
`finishUp.y`. The handle that does exist is the crown field. Every leaf vertex
already carries `aCrown` — the crown ellipsoid's centre and x radius — and
`aCrownAxes` — its y and z radii — because that is what the crown is coloured
from. **The leaf's height within its own ellipsoid is how exposed it is**, and
the snow follows it: full at the top of the envelope, falling to about a third
of that underneath. One `smoothstep` over a value the fragment shader already
has in hand.

A third and not nothing, because a snow-laden tree is pale over the whole of
its outside — an underside with no snow at all reads as a green tree wearing a
hat.

The white is `vec3(0.86, 0.9, 0.96)` at up to 0.62, both taken from
`art/cover.ts`, so a crown and the grass beneath it go to the same white rather
than to two.

### 7.3 What comes free with it

- **Bare trees stay bare and evergreens carry it.** `uSeasonA.x` already strips
  a deciduous crown in winter, so an oak in snow has almost no card left to
  whiten and what shows is snow on its wood through the finish stage. A spruce
  keeps every card and goes white. No branch in the shader; the season does it.
- **The hedge.** Its cards are on the canopy material, so a snowed hedge comes
  with §8 and costs nothing extra.
- **Blossom and fruit.** Gorse's yellow, hawthorn's white and the fruit trees'
  fins are cards on the same path and whiten with everything else. No exception
  for the flagged ones — snow does not care.

### 7.4 The vista's cards

`art/cards.ts` has its own shader and its own atlas, and the atlas is rendered
**once at zone load**. Snow must not be baked into it: it would be frozen at
whatever the weather was when the zone came up, and would then disagree with
the wood the player is standing in.

It goes in the card's fragment shader instead, off the same `uSnow`. The shader
already reconstructs a world normal from the normal atlas in order to light the
card — `n` — so `n.y` is the up-facing amount, and the whitening is one `mix`
over `smoothstep(0.2, 0.9, n.y)` against the same colour. Which is the whole
reason the horizon whitens with the foreground rather than staying green behind
a white field.

---

## 8. The hedge

`lines/hedge.ts` sweeps a rounded profile along the line, displaces its radius
with noise, caps the ends, sticks `fringe` fins on the top edge, and drops two
decorative stems per half metre underneath. What it gets right is the
**profile** and the **collision**; the profile becomes an invisible envelope and
the collision is kept exactly.

**There is no mass inside it.** The swept profile stops being geometry
altogether and becomes the shape the cards are asked to fill — the same job
`clouds` do for a tree. Opacity comes from card density and nothing else.

After the rework, one bay of hedge is:

1. **The envelope.** The profile sweep as now — the noise, the caps, the
   `bulge` suppression near a standard — computed and kept, but as a set of
   `Cloud`s along the line rather than a `BufferGeometry`. One cloud every
   0.4 m, radii `(0.25, H/2, W/2)` at that station's displaced scale. Nothing
   draws it.
2. **The stools.** One every **0.4 m** along the line, alternating either side
   of the centre by up to `W/4`, each `growLimb` to 3 levels with the shoots
   pushed outward and upward through the envelope. Their twigs are what the
   cards root on, and unlike the current decorative stems they are real wood
   that carries the crown.
3. **The cards.** `branchCards` over the stools' twigs, turning to the eye,
   `smallleaf`, 0.22–0.34 m, with `perTwig: 2` and the envelope's clouds as the
   crown field, plus a `count` of loose cards rooted inside the envelope and
   pointing out, which is what fills the middle where no twig reaches.
4. **The density.** This is the whole risk of the phase and it is set by one
   number: cards per metre of line. **Start at 90 a metre** for `trimmed`
   (1.5 m × 1.0 m section) and 130 for `wild`, which is roughly ten cards over
   every square metre of skin and three card layers across any sightline
   through the section. 40 m of trimmed hedge is then ~3,600 quads, 7,200
   triangles — against the current sweep's ~1,000 plus 280 fins. That is the
   cost of having no mass to hide behind and it is paid on purpose.
5. **The ends.** A crossed pinned pair per end stool rather than turning cards,
   so a hedge end read along the line does not collapse to nothing.

Unchanged: `chordBoxes` collision on the **full profile width and height**,
`footprint`, `footprintSoft`, `underfoot`, the `standard`/`gate`/`stile` marks,
the `bank` option and its earth trapezoid, the `trimmed` and `wild` styles and
their `height` option. The `fins` field of `HedgeStyle` becomes `cards` and
means cards per metre of line.

**If it can still be seen through, the number goes up before anything else is
changed.** One dial, tried once; if 90 is not enough and 140 is not enough, the
design is wrong and the core comes back rather than a third round of tuning.

---

## 9. The vista's single trees

### 9.1 What is there now

Sixty-six `vista-*` builders. `treeParts` and `pineParts` in `art/vista-kit.ts`
make every countable tree in the band: a three-sided trunk and one or two
`vistaMass` blobs, or a trunk and a stack of three cones. Eight builders call
them. Across the eight zones that is 11 hand-placed and 18 scattered
`vista-tree`, plus the trees inside the shelterbelt, the avenue, the knoll, the
marsh and the two icons.

### 9.2 What replaces it

**A card of the real tree.** Not a new picture of a tree — the same builder that
grows a `pine` in the forest, rendered from eight bearings and above into the
atlas that `art/cards.ts` already builds, and stood as one quad that turns to
the camera about Y and blends the two nearest views.

The pieces are all present and none of them needs inventing:

- `prop-geometry` already returns a built prop's trunk and crown geometry
  **separately** (`PropWire.geometry` and `PropWire.canopy`). That pair is a
  `CardVariant` minus its frame, and `frameOf` computes the frame.
- `CardAtlas.render` takes a renderer and a list of variants and fills one
  2048² colour target and one normal target, nine 128 px views a variant, 28
  variants to an atlas.
- `cardStand` takes the atlas and a list of `CardInstance` — world position,
  yaw, scale, which variant — and returns one instanced mesh.

So the ring gains **one card mesh** beside its merged chunks, and it costs one
atlas pair and one draw call however many trees stand in it.

### 9.3 The placement says which

`VistaProp` and `VistaScatter` gain two fields:

- `tree?: string` — the name of a real foliage builder (`oak`, `pine`, `birch`,
  `palm`, …), used in place of `builder`.
- `card?: boolean` — **whether this placement is a billboard.** Default `false`:
  a `tree` placement with nothing said is the real tree, built and merged like
  any other still prop.

**There is no distance threshold and the engine measures nothing.** No
`cardsFrom`, no automatic swap, nothing that turns into anything. A card stands
where a card is placed and a tree stands where a tree is placed, and both are
written into the zone document by hand.

The rule of thumb while placing, which lives here and nowhere in the code:
**past about 120 m out from the outline, a card.** Nearer than that the wood is
worth having. It is judged by eye at the placement, like everything else in the
ring.

**The 28-variant atlas cap is a real cap.** A variant is `(tree, seed mod
variants)` and the ring holds **one variant per species** by default — a vista
tree is seen at 150 m and the four-variant spread was for trees you walk under.
`variants` on the ring entry may raise it for a species that reads as a repeat.
If the count exceeds 28 the build **throws at plan time with the list**, rather
than dropping variants. Silently dropping is exactly what left bare trunks
across the forest last week.

### 9.4 Which builders convert

| Builder | What happens |
|---|---|
| `vista-tree` | **Deleted.** Every placement of it becomes a `tree` placement, `card: true` beyond about 120 m. The `oak` variant becomes `oak`, `pine` becomes `pine`, `dead` becomes `snag` |
| `vista-shelterbelt` | **Deleted.** A planted line is 5 or 9 trees at an even pitch and the ring can lay that — a `tree` placement each, written into the document |
| `vista-avenue` | **Deleted**, the same way |
| `vista-knoll`, `vista-marsh`, `vista-patchwork`, `vista-icon-forest-path`, `vista-icon-riverside` | **Kept.** These are a landform or a field pattern with trees standing on their own local ground, which the ring cannot place onto. Their `treeParts` trees get §10's quality pass instead |

`treeParts` and `pineParts` therefore survive, improved, for the five builders
that still need a tree in local space.

---

## 10. The wooded masses: a quality pass

The wooded masses stay masses. `vista-forest`, `vista-copse`, `vista-wood-edge`,
`vista-hanging-wood`, `vista-plantation`, `vista-orchard` and `vista-scrub` keep
their grammar — `vistaMass` blobs washed with `landWash` — and get the pass they
have never had. They currently read as smooth green lumps, and five things are
missing from all of them.

| # | What is missing | The move |
|---|---|---|
| 1 | **A broken skyline.** A wood's top edge is a row of separate crowns; the masses have a smooth low-frequency wobble | Raise the displacement frequency on the upper third only, to about one bump per 6–9 m of arc, at 1.5–2.5 m amplitude. The sides and base keep the current low frequency — a bumpy flank is noise, a bumpy skyline is trees |
| 2 | **Emergent crowns.** Every real wood has a few trees standing proud of the canopy | 3–6 small separate masses, radius 2.5–4 m, sitting 2–4 m above the silhouette along its ridge, in the same wash. Costs ~60 triangles inside the 300 budget |
| 3 | **A dark base band.** The strongest distance cue a wood has is the shadowed trunk zone under the canopy, and none of them has it | The bottom fifth of the mass in a much darker green, as a step in the colour function rather than a separate mesh. Free |
| 4 | **Value contrast across the mass.** `landWash` currently varies hue more than value, so the whole thing is one tone | Widen the wash's lit-to-shade range and bias it to the sun's bearing, so one flank is lit and the other is not. Value over hue, which is what `art/vista.ts`'s own header already says |
| 5 | **A scalloped edge in plan.** The near face of a wood is bays and points; these are convex outlines | Displace the plan outline of `vista-forest` and `vista-wood-edge` at 8–14 m wavelength, so the edge has depth rather than being a wall |

The trees inside `vista-knoll`, `vista-marsh`, `vista-patchwork` and the two
icons get 1, 3 and 4 of the above applied to `treeParts` and `pineParts`
directly — the same broken skyline, the same dark base, the same value spread.

`VISTA_TRIANGLES = 300` holds for every one of them. Nothing here adds a
subdivision level; all five moves are displacement, colour and a handful of
extra blobs.

---

## 11. What is removed

Nothing is removed before phase 7, and phase 7 removes only what has a
replacement standing.

| Goes | Because |
|---|---|
| `vista-tree` | Replaced by a `tree` placement |
| `vista-shelterbelt`, `vista-avenue` | Replaced by lines of `tree` placements the ring lays |
| The `fringe` and `tufts` calls in the four shrubs and the hedge | Replaced by cards |
| The `lobe` calls in the four shrubs, and the hedge's swept mass geometry | Replaced by wood and cards |

`lobe`, `fringe` and `tufts` themselves **stay in `art/foliage.ts`**. After this
spec their callers are `figure-finery`, `figure-head-city`, `figure-surface`,
`figure-trunk`, `figure-wear`, `thistle` and `recipe-fixtures` — hair, cloth and
one flower. They stop being tree code and stay being what those need. That is a
rename at most and this spec does not do it.

`treeParts` and `pineParts` **stay**, improved by §10, for the five vista
builders whose trees stand on their own local ground.

---

## 12. Ways to get this wrong

- **Making the card an automatic swap.** It is not, at any range, by any
  measure. Nothing measures a distance at runtime or at plan time, nothing
  fades, nothing dissolves a crown, and there is no threshold field. A
  placement says `card: true` or it does not.
- **Silently dropping variants over the atlas cap.** Throw with the list.
- **Putting a mass back inside the hedge.** The decision was cards all the way
  through. If it is see-through, the density number goes up — twice, and then
  the design is reconsidered from the top, not tuned a third time.
- **Growing the sheet for every new plant.** Each new kind is six more tiles
  rendered at boot. Four shrubs are three `smallleaf` and one `pine`; acacia is
  `pinnate`; baobab is `smallleaf`. One row is added in this whole spec, for the
  palm, because a frond has no analogue in the eight.
- **Giving the baobab ordinary bark or ordinary taper.** A 0.4 taper and a
  buttressed lathe makes it a fat oak. The trunk is a near-cylinder and it is
  most of the tree.
- **Turning a palm frond.** Pinned. A long flat blade spun about its own axis
  reads as a propeller.
- **A shrub that dresses its ground.** No leaf litter, no scatter, no bare
  patch under a bramble, no sand round a palm. The builders make the plant.
- **Rotations.** A card's axis comes out of its twig and `branchCards` builds
  the quad; nothing in this spec rotates a crown. The hedge's stools are the
  one place a bearing is chosen, and the profile's `nx, nz` is the outward
  normal across the line — `rotateY` is not involved and must not be
  reintroduced.
- **Losing the hedge's collision.** `chordBoxes(walk, s0, s1, W, H, groundAt)`
  stays on the full profile width and height, though nothing draws that profile
  any more.
- **Baking snow into the card atlas.** It is rendered once at zone load. Snow
  baked there is the weather at load time, for the rest of the session, and it
  will disagree with the wood the player is standing in. §7.4.
- **Whitening a crown evenly.** Snow lies on what is exposed. The crown
  ellipsoid says which leaves those are, and a crown that goes uniformly white
  reads as a colour change rather than as weather.
- **Letting a card cast a shadow.** `cardStand` sets `castShadow = false` and
  `receiveShadow = false`, and `markVista` takes vista props out of the shadow
  box. Both hold.
- **Judging two changes in one shot.** The coast's gorse is reworked in phase 2
  and the coast gets palms in phase 4. They are two phases apart on purpose.

---

## 13. Not here

- Autumn on the vista's cards. The atlas is rendered once at zone load, so a
  vista tree does not turn. Snow is the exception and §7 says why: it is applied
  in the card's own shader, not baked into the atlas.
- Cards for anything but trees. No card shrubs in the vista, no card buildings.
- Any change to the neighbour icons' or the shared far layer's role. They stand
  at 150–200 m, they are stylised on purpose, and only the two that call
  `treeParts` are touched at all.
- Snow weighing a bough down, or sliding off one. The leaves go white; nothing bends.
- The scatter multipliers `TREES.md` §9 left flagged.
- A desert or savanna cell. The three new species stand on the coast.
- `ZoneGroup`, packs, or anything in `CONTENT-PACKS.md`.

---

## 14. Decisions

| Question | Answer |
|---|---|
| Gorse's needles: a new sheet row, or the `pine` row tinted? | The `pine` row |
| The hedge: an inner core, or cards all the way through? | **Cards all the way through.** No mass inside it |
| Palm's `frond` row, acacia on `pinnate`, baobab on `smallleaf`? | Yes. One new row in the whole spec |
| Where do palm, baobab and acacia stand? | **`coast` and `beach-path`.** Reality bends |
| How far out does a vista tree become a card? | **By eye, at the placement.** No threshold in the code. About 120 m is the habit, not the rule |
| The wooded masses: cards, or masses? | **Masses**, kept — and given the quality pass of §10, because they look bad |

---

## 15. Built

Phases 1–8 landed together, with two departures from the text above:

- **A tree in the ring is not merged into a chunk.** §9.3 assumed a real
  `tree` placement would merge like any other still prop; a crown is a second
  mesh on a second material and has nothing a chunk can merge. Ring trees go
  through the same stand path a tree inside the level does — shared geometry
  per variant, crowns instanced by `raiseStands` — and keep their wind, since
  a rigid trunk under a moving crown opens the seam between the two.
- **`lobe`, `fringe` and `tufts` are gone from `art/foliage.ts`.** §11 kept
  them for `figure-*` and `thistle`; those call a different `fringe`, the one in
  `figure-surface.ts`. With the four shrubs and the hedge reworked they had no
  callers at all.
