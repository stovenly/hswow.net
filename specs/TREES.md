# Trees — spec

**Open.** `FOLIAGE.md` built one tree in the new way and proved it. This is
the rest of them: every tree in the kit rebuilt as wood plus branch cards,
eight species added, and the zones that already have trees given a mix that
belongs where they stand.

**The one-sentence version:** the `village-*` trees drop their prefix and
become the kit; the fourteen `lobe`-and-`fringe` trees are rebuilt on the
same wood and the same cards; ash, alder, Scots pine, yew, rowan, holly,
poplar and sycamore join them; the sheet grows four new leaf kinds to carry
them; and the placement pass splits the monocultures the zones currently
plant.

Checked against `art/foliage.ts`, `art/canopy.ts`, `art/branchSheet.ts`,
`art/oakwood.ts`, `art/limbs.ts`, `art/fields.ts`, `art/sway.ts`,
`art/flex.ts`, `art/underfoot.ts`, `world/kinds.ts`, `art/lines/hedge.ts`,
every builder in `art/builders/` with `category: 'foliage'`, and the nine
outdoor zone documents, as they stand. Nothing is to be built to verify it —
the render is the ground truth.

---

## 1. The ask

- More species of tree.
- Every existing tree builder replaced. The card-on-branches style is the
  style from here on, because it looks better.
- Go through the places the old trees stand and put a variety of the
  current trees there, where it makes sense.
- **Land the work one or two phases at a time and hand it back for a look
  before the next.** See §3; this governs everything below it.

Answered before writing:

| | |
|---|---|
| Species | All eight offered: ash, alder, Scots pine, yew, rowan, holly, poplar, sycamore |
| Names | Fold `village-*` to plain names; the old builders are deleted |
| Scope | The trees, plus the tree-like shrubs: `hazel`, `elder`, `hawthorn`, `fruit`. `bush`, `thicket`, `gorse`, `bramble` and `hedge` stay on `lobe`/`fringe` for now |
| Placements | Mix into what is there. Positions and counts hold; species split |

---

## 2. What this stands on

| | |
|---|---|
| `art/oakwood.ts` | `lathe` and `oakWood`. A buttressed lathe trunk, then `growLimb` from it, clouds gathered round each big limb's twigs. This is the broadleaf archetype and it already takes a `WoodForm`. |
| `art/limbs.ts` | `growLimb`, `sweep`, `limbGeometry`, `limbBranch`, `GrowForm`. Recursive limbs as swept tubes, each level thinner, the last level handed back as twigs. Every species' structure is a `GrowForm`. |
| `art/foliage.ts` | `branchCards`, `cloud`, `crownOf`, `heightWeight`, `finishFoliage`, `LEAVES`, `STAND_SPECIES`, `CANOPY_VARIANTS`. Unchanged in kind; `LEAVES` and `STAND_SPECIES` gain entries. |
| `art/branchSheet.ts` | The boot-rendered sprite sheet: one row of six tiles per leaf kind, 384 px a tile. §6 grows it a row at a time. Seven kinds now. |
| `art/canopy.ts` | `FIN_FLAG` and the season uniforms. Blossom and fruit are a per-vertex flag that scales solidity in their weeks — cards carry it as fins did, so **no shader change is needed for blossom**. |
| `art/sway.ts`, `art/fields.ts` | The wind. A species' limb travel is its `GrowForm.swing`; its trunk travel is its `FLEX`. Both are per species and both are set in §5. |
| `world/kinds.ts` | `STAND_SPECIES` decides which builders are built once per zone in four variants and instanced. Every tree is in it. |
| `guidelines/ENVIRONMENT-DESIGN.md` §5, §6 | Which tree grows where. The placement pass in §9 is that section applied to the zones we have. |

---

## 3. How the work lands

**One or two phases, then back for a look, then the next.** Nothing here is
built end to end and handed over as a heap. Each phase below is a thing that
can be walked up to and judged on its own, and the next phase does not start
until the previous one has been seen.

| Phase | What lands | What to look at |
|---|---|---|
| **1** | The names fold. `village-oak` → `oak` and the rest; the five old builders of those names deleted; `FLEX`, `underfoot`, `STAND_SPECIES` and `village.json` follow | Every zone that already says `oak`, `birch`, `spruce`, `willow` now grows a card tree with no edit. Forest, riverside and farm change completely. The other nine builders are still old-style in the same shot, which is the contrast worth seeing |
| **2** | The sheet grows: the `pinnate` leaf kind and the tile budget of §6. **Ash** and **alder**, and both placed | A hedgerow ash on the farm, alders on the riverside bank |
| **3** | The `pine` needle kind. **Scots pine** rebuilt, **yew** added; `village.json`'s two yew stand-ins become real yews | The churchyard, and pine on the heath |
| **4** | The `smallleaf` kind. **Rowan**, **holly**, **poplar**, **sycamore** | Four silhouettes against sky |
| **5** | The understorey rebuilt: `hazel`, `elder`, `hawthorn`, `fruit`, and the `blossom` kind | Eye-level wood in a lane, and blossom in its weeks |
| **6** | The young wood: `small-oak`, `small-birch`, `small-spruce`, `small-tree`, `tree` | A wood with an understorey again |
| **7** | The placement pass of §9, nine zone documents | Every outdoor zone |

Phases 2 and 3 may go together; 4 is one phase on its own because it is four
species; 5, 6 and 7 are each their own.

**If a phase's look is rejected, the next phase does not start.** The wind
work is the precedent: four rounds on one complaint, because each round
tuned the previous instead of stopping. `redesign, not tweak` applies.

---

## 4. The kit after this work

Twenty-two builders, every one of them wood plus branch cards.

| Builder | Was | Wood | Leaf kind | Height, m |
|---|---|---|---|---|
| `oak` | `village-oak` renamed; old `oak` deleted | broadleaf | broadleaf | 8.5–10.5 |
| `beech` | `village-beech` renamed | broadleaf | broadleaf | 10–12.5 |
| `birch` | `village-birch` renamed; old `birch` deleted | broadleaf, pole | birch | 8–11 |
| `willow` | `village-willow` renamed; old `willow` deleted | willow's own | willow | 5–6.5 |
| `spruce` | `village-spruce` renamed; old `spruce` deleted | whorl | conifer | 11–14 |
| `ash` | **new** | broadleaf | pinnate | 12–14.5 |
| `alder` | **new** | broadleaf, multi-stemmed | broadleaf | 8.5–11.5 |
| `pine` | rebuilt | broadleaf, high fork, plate clouds | pine | 12–18 |
| `yew` | **new** | broadleaf, fluted, low | conifer | 7–11 |
| `rowan` | **new** | broadleaf, pole | pinnate | 6–9 |
| `holly` | **new** | broadleaf, pole | smallleaf | 4–7 |
| `poplar` | **new** | broadleaf, fastigiate | broadleaf | 16–22 |
| `sycamore` | **new** | broadleaf | broadleaf | 13–18 |
| `hawthorn` | rebuilt | its own leaning trunk | smallleaf + blossom | 1.3–1.9 to the fork |
| `hazel` | rebuilt | stool | broadleaf | 2.0–2.8 |
| `elder` | rebuilt | stool | pinnate + berry | 2.0–2.9 |
| `fruit` | rebuilt | broadleaf, low fork | broadleaf + blossom + fruit | 3.2–4.2 |
| `tree` | rebuilt | broadleaf | broadleaf | 3.2–4.6 |
| `small-oak` | rebuilt | broadleaf, one leader | broadleaf | 2.6–3.8 |
| `small-birch` | rebuilt | its own banded pole | birch | 2.2–3.05 |
| `small-spruce` | rebuilt | whorl | conifer | 2.1–3.4 |
| `small-tree` | rebuilt | broadleaf, one leader | broadleaf | 1.6–2.8 |

The understorey and the saplings keep the heights they already had rather than
the ones this table first guessed. Nine zones are dressed around a hazel that
comes to 2.8 m and a hawthorn that comes to 1.9; growing them to a field
guide's numbers would move every placement that stands beside one.

The saplings stay separate builders rather than becoming scaled adults. A
young tree is a different shape, not a small one: one leader, side branches
nearly level, no fork, no heavy limbs — which is exactly why `small-oak`
exists today and why scaling `oak` down has never looked like a sapling.

---

## 5. The wood: three archetypes and a table

A species is a table entry. Three functions build the wood.

**`broadleafWood`** — today's `oakWood`, renamed and generalised. A
buttressed lathe trunk to the fork, then `growLimb` from it, the trunk
carrying on as the leader, a cloud gathered round each first-level limb's
twigs and one over the whole. This is fifteen of the twenty-two.

`WoodForm` gains, on top of what it has:

| Field | What it decides | Why it is needed |
|---|---|---|
| `flute` | How much the ribs swell the foot, and over how many metres that fades | A yew is fluted well up its bole; a rowan is a pole from the ground |
| `bark` | Widened from a colour to `(t) => number`, `t` up the height | The pine's orange upper bole cannot survive as a flat hex |
| `thin` | The lathe's taper | A poplar's bole barely tapers; an oak's halves |
| `lean` | Trunk bend range | A hawthorn is bent by the wind, a poplar is not |
| `stems` | Root limbs leaving the top of the lathe, splayed | An alder on a bank stands on two or three stems from one stool; one is a single leader |
| `crownFlat` | The crown's clouds against the dome a broadleaf gets | Under 1 is the pine's plate, over it the poplar's spire |
| `evergreen` | Keeps its leaves through the winter weeks | The pine, the yew and the holly |
| `leaf` | Sheet kind, `LEAVES` entry, card length, `flag` | Which picture a card wears |

`lean` and a separate `leaf` group are not built: a species names its sheet
kind and card length at its own `branchCards` call, and the trunk's bend is
still `oakWood`'s own roll.

**`whorlWood`** — the spruce's, lifted out of it whole: a straight lathe
leader, whorls of stubs each carrying a crossed pair of needle cards, whorls
shortening to a cone. Serves `spruce` and `small-spruce`. Each bough is its
own wind family off the trunk. Its form carries eight plain distances in
metres rather than fractions of the height, because that is what the spruce
already encoded and re-basing them would have moved a tree that was
accepted.

**`stoolWood`** — **new.** A sheaf of rods splayed from a stool at the
ground, each rod a `growLimb` at level 1 with its own family. Serves
`hazel` and `elder`. This is what the current `hazel` and `elder` draw by
hand with `rod`, ported rather than redesigned. `holly` is not one of them:
a holly in a wood is a single slender pole branched from low down, and
building it as a stool gave it a wide stump under thin stems.

`willow` keeps its own swept leaning trunk. It is a shape no table produces
and it already works.

**Porting, not redesigning.** Each rebuilt builder carries its construction
across. The birch's banded white lathe and its bend, the pine's bare bole
and flat plates, the hawthorn's lean and its streaming crown, the hazel's
splayed rods, the fruit tree's low fork: these are the descriptions the old
builders already encode and they are what makes each read as itself. The new
wood and the new cards replace the crown and the branch geometry, not the
silhouette. A fresh design in place of a working one is a regression.

**The wind per species.** Two numbers each, both stated in the table entry:
`GrowForm.swing` — a limb tip's travel per metre from its pivot, and
`FLEX` — the trunk's own bend. A poplar's whole crown moves as one and its
trunk barely does; an ash's limbs are long and whippy; a holly is a dense
cushion that does not acknowledge weather; a yew is the stiffest thing in
the kit. These are the numbers that separate species in motion, and they are
set once per species, not tuned per complaint.

---

## 6. The sheet grows

`branchSheet.ts` renders four kinds of six tiles into a 4×6 grid of 512 px
tiles — 2048×3072. Four kinds cannot carry twelve more species: an ash and
an oak at forty metres differ by the shape of the leaf mass on the shoot,
and nothing else.

Four new kinds, of which `pinnate`, `pine` and `smallleaf` are built:

| Kind | The picture | Species |
|---|---|---|
| `pinnate` | Leaflets in opposed ranks along a rachis, the shoot's outline a long feather rather than a mass of separate blades | `ash`, `rowan`, `elder` |
| `pine` | Long paired needles in tufts at the shoot's end only, the shoot bare behind them | `pine` |
| `smallleaf` | Small, stiff, dense, dark; the shoot solid rather than airy | `holly`, `hawthorn` |
| `blossom` | The same shoot in flower, or in berry: leaves replaced by loose clusters of small round blobs | `hawthorn`, `fruit`, `elder` |

**A kind is a row.** The columns are `PER_KIND` and the rows are
`KIND_ORDER.length`, so a kind is added by adding it to `KIND_ORDER` and the
sheet grows a row; `SHEET_OF` is derived from the order rather than written
out. **The tile drops from 512 to 384.** Five kinds is 2304×1920 — 4.4 Mpx
against 6.3 before, so the sheet is *smaller* than it was until the seventh
kind arrives, and eight kinds is 2304×3072, 7.1 Mpx, about 38 MB with
mipmaps against 34. A card is at most three metres long and is magnified
only at arm's length; 384 holds.

**Height and heights.** The species table's heights are the kit's scale, not
the field guide's. A mature oak is 20–25 m in the world and 8.5–10.5 m here,
so every other species is set against the kit's oak rather than against the
real one — an ash is the tall tree at 12–14.5 m, not at 25.

**`FORMS` gains a `blossom` flag** rather than a fifth branch of the leaf
writer: a blossom tile is the kind's own shoot with clusters where the
leaves went, so the picture matches the leafy tile it stands beside.

`pinnate` is the first kind whose leaves are not scattered over the twigs.
`BranchForm.rachis` lays them in opposed ranks along every twig, longest
across the middle of the run and ending in a terminal blade, and
`BranchForm.paired` makes the shoots leave the stem in opposite pairs.
Those two together are what separates an ash from an oak at forty metres.

**Needles and tufts.** A `needle` form lays its leaves as a fan off the shoot
rather than at any angle, and `tufted` holds `stemFrom` on every twig instead
of on the card's own stem alone, so the leaves sit at the shoot ends with bare
wood behind — the two together are a Scots pine's shoot, and the
first alone is the spruce's, which is what took `conifer` out of the writer as
a name it checked for.

**Eight kinds is 2304 × 3072**, 7.1 Mpx against the 6.3 the four kinds at 512
cost, about 38 MB with mipmaps against 34. That is the whole of the growth and
there is no ninth kind planned.

---

## 7. The names fold

`village-oak` was the name of one tree on one green while the system was
being proved. It is the kit now and the prefix says nothing true.

- `village-oak` → `oak`, `village-beech` → `beech`, `village-birch` →
  `birch`, `village-willow` → `willow`, `village-spruce` → `spruce`.
- The old `oak.ts`, `birch.ts`, `spruce.ts`, `willow.ts` are deleted.
- `flex.ts`: the five `village-*` keys become the plain ones and the old
  entries go. The comment about the village trees becomes a comment about
  the trees.
- `underfoot.ts`: same five keys.
- `foliage.ts` `STAND_SPECIES`: the five `village-*` entries go; every new
  species is added.
- `village.json`: twelve entries change builder. **The ids do not change** —
  `green-oak` stays `green-oak`. An id is what other documents point at.
- Every other zone document is untouched by the fold. `forest.json` says
  `"builder": "oak"` and gets the new oak.

`art/whorl.ts` had no callers and is deleted.

---

## 8. What says each species

The forms below are the standard descriptions of these trees. They are
written from general knowledge, not from a source read in this session —
correct any that reads wrong and the table entry follows.

**Ash.** A straight bole with the limbs leaving it high and sweeping out
then up, so the branch line is a shallow S and the tip points at the sky.
Airy: you see through an ash. Pale grey bark, smooth when young, ridged
when old. Pinnate leaves in opposed pairs. Last into leaf, first out of it.
`GrowForm`: few children, long, `lift` positive and rising through the
levels.

**Alder.** Wet ground and only wet ground. Often several stems from one
base at a bank; conical when single. Dark, almost black fissured bark; dark
round leaves with a notched end. Small black cones hang on all winter. It
is the darkest broadleaf in the kit and that is most of what says alder.

**Scots pine.** A bare straight bole for two thirds, then flat plates of
foliage and nothing below them. The upper bole and the limbs are
orange-red and flaking; the lower trunk is grey-brown and plated. Blue-green
needles in pairs. The crown is flat-topped in an old one. The old `pine`
builder already has this silhouette and it is right; only its crown changes.

**Yew.** Slow, low and vast for its height. A fluted trunk that is often
several fused stems, red-brown and flaking. Dark to the point of black, dense
enough to stop light, and branched to the ground. Churchyards. The stiffest
thing in the kit: `FLEX` below the spruce.

**Rowan.** Slight, upright, smooth silver-grey bark, branches upswept. High
ground, rock, gullies — a rowan grows where nothing bigger will. Pinnate
leaves, and clusters of orange-red berries from late summer, which ride the
`fruit` flag as the apple's do.

**Holly.** Dense, conical, evergreen, understorey. Smooth grey bark, dark
glossy leaves — spined low down where things browse, smooth higher up, which
is a real thing and worth having. Stays green when the wood is bare, which
is the whole reason to have it.

**Poplar.** The columnar one: branches at a steep angle close against the
bole, so the tree is a spire twenty metres tall and three across. It is the
strongest silhouette available and it should be used sparingly — one line of
them across a field is a landmark, and two lines is a nursery.

**Sycamore.** A big heavy dome. Flaking plated bark, five-lobed leaves, the
crown read as mass rather than as structure. This is the tree that fills a
skyline where an oak would show its limbs.

---

## 9. The placement pass

Positions, counts and ids hold. Where a zone plants one species by the
dozen, the count splits across species that belong in that country. No new
ground is dressed, nothing moves and no entry is deleted.

| Zone | What changes |
|---|---|
| `forest` | `wood-oaks` 12 → oak 8, ash 4. `wood-birches` 18 → birch 12, rowan 3, holly 3. `wood-spruces` 8 → spruce 5, pine 3. `rise-birches` on the SE heath → rowan. `screen-*` and the gate oaks keep their kinds; `great-oak` stays an oak |
| `forest-path` | `wood-oaks` 10 → oak 6, ash 4. `wood-birches` 16 → birch 11, rowan 5. `wood-bushes` 16 → bush 10, holly 6. `heath-birches` → rowan. `south-spruces` 14 → spruce 10, pine 4 |
| `riverside` | The alder zone. `edge-oaks` 5 → oak 3, ash 2. `edge-birches` 5 → birch 3, alder 2. `bar-elder-*` keep elder; the three north-bank hazels split hazel/alder. `se-oaks`, `se-birches` split with ash |
| `beach-path` | `west-oaks` 5 → oak 3, holly 2. `west-spruces` 8 → spruce 5, pine 3 — pine is the coastal conifer. `west-birches` 6 → birch 4, rowan 2 |
| `village` | `yew-1` and `yew-2` become `yew`, which is what they were always meant to be. `green-birch-*` and `edge-birch-*` hold; one `edge-birch` becomes a rowan |
| `farm` | `north-oak` → ash. Little else: the farm plants two oaks, an elder and two hazels, and there is nothing to split |
| `plains` | Nothing. One hawthorn and gorse. The hawthorn is rebuilt in phase 5 and that is the whole change |
| `coast` | Nothing. Gorse only, correctly — nothing else grows on that arm |
| `water-showcase` | Nothing worth changing |

**What this pass does not do**, because "mix into what is there" was the
answer: no standards along the farm hedgerows, no mantle at a wood edge
that currently stops dead, no trees in the lee on the plains. `hedge`
already takes a `standard` mark with a builder — only `water-showcase` uses
one — and hedgerow standards are the obvious next thing if the farm and the
lane want work.

**Poplar and sycamore land nowhere in this pass.** Neither belongs in a
wood, on a heath or on a river bank, which is what the nine zones are. A line
of poplars across a field and a sycamore over a farmyard are both plantings
rather than splits, and plantings were ruled out — so until a zone asks for
one, both live in the tree gallery.

**Build cost.** A species used in a zone is built four times for its
variants. `forest` goes from six tree species to nine, `forest-path` from
seven to ten. That is twelve more builds in the heaviest zone, on the worker
pool, at load.

---

## 10. Tables that must follow

Each of these is keyed by builder name and each will silently do the wrong
thing if a species is missing rather than fail:

- **`art/flex.ts`** — a name that is not there does not bend at all. Every
  new species needs an entry and every renamed one needs its key moved.
- **`art/underfoot.ts`** — a name that is not there is a build error, which
  is the safe direction. Add all eight.
- **`art/foliage.ts` `STAND_SPECIES`** — a name that is not there is built
  once per placement instead of once per zone. Twelve oaks in a wood would
  be twelve builds.
- **`art/foliage.ts` `LEAVES`** — `ash`, `alder`, `yew`, `rowan`, `holly`,
  `poplar`, `sycamore`. `pine` and `hawthorn` are already there.
- **`art/lines/hedge.ts`** — the `standard` mark defaults to `'oak'`, which
  keeps working through the fold and is worth leaving alone.

---

## 11. Ways to get it wrong

- **A trunk made of pieces that do not share a ring.** The trunk is one
  surface. Where a piece hands over, the next one **starts on the ring the
  last one ended on**: the same point, the same radius, the same side count
  and the same frame, and only then tapers to whatever it needs. Anything
  else shows — butt two tubes together at one radius and their flats cross
  and gap, because their rings are cut at different angles and counts; fatten
  the upper one and you get a lip; lap and neck them and you get a nub. So:
  `sweep` takes the frame to start on and `endNormal` reports the one to hand
  it; `growLimb` carries the side count down a chain and grows a limb's first
  step along the direction it was given, so its first ring is cut square to
  what handed it over; `lathe` leaves its top ring open, and the limb that
  continues it rises on +Y with `LATHE_SIDES` and `LATHE_NORMAL`, which cuts
  the lathe's own ten points. This is the rule for the lathe under `oakWood`,
  for every level change inside `growLimb`, and for the birch's, small
  birch's, willow's and hawthorn's own poles.
- **One ramp for the trunk and another for the limbs.** Two tubes sharing a
  ring have to be pulled by the same weight at it, or the wind opens the seam
  the geometry closed. A tree has one `sway` ramp. The branch lanes are what
  make a limb move differently, and they pivot at the ring, where their
  displacement is zero.
- **Stems that stand on the trunk instead of being it.** Several stems from
  one base share the top's cross-section, so each is the top radius over root
  n — 0.58 of it for three. Grown from the axis they are three posts on a disc
  twice their width. Each stands `topRadius - stemRadius` in from the rim,
  which puts their union over the whole top.
- **Wood sticking out past the leaves.** A card's length is rolled, a twig's
  length is grown, and nothing makes them agree. `branchCards` floors a twig
  card at 1.15 times its twig and roots it at the fork; a builder that passes
  `lengthOf` is stating it knows better and gets no floor. Lengthening the
  card is not the fix on its own — the tile's own first sixth is bare stem,
  so a longer card moves the leaves further out and bares the twig's base.
- **A knee that always bends the same way.** A trunk drawn as two segments,
  the upper leaning further than the lower, folds on every roll: there is no
  seed that stands up. Wind-flagging lives in the crown, and the bole above
  the knee comes back toward vertical.
- **Density built out of wood.** The premise is that the picture carries the
  leaves and the geometry is a handful of quads. Raising `children` to make
  a crown look full multiplies — every level adds its children *and* the
  parent's own continuation — and gives a ball of wire. Density is
  `perTwig`, not another level of branching.
- **A card's wood in the wrong colour.** The sheet's picture includes the
  twig it grew on, tinted per species from `Species.bark`. Unset, it draws
  oak-brown twigs on a white tree. Set to the twig's own colour it can still
  be wrong: a card is read against whatever wood is *near* it, which on a
  stool is the rods rather than the twig it technically sits on, so a stool
  has one wood colour and no second one to disagree with. The shader's own
  factor has to land on 1 at the sheet's wood tone or every card's wood is
  brighter than the branch beside it.
- **Redesigning a builder while porting it.** The silhouettes are the part
  that works. Carry them over.
- **Making every species from one table with no escape hatch.** The willow
  is a swept leaning trunk, the spruce is whorls, the stools are sheaves.
  A table that has to express all of those expresses none of them.
- **Two species that differ only in leaf colour.** If ash and oak share a
  sheet kind, a crown shape and a growth form, there is one tree in the kit
  with two names. The distinguishing thing goes in the `GrowForm` and the
  sheet kind, not in a hex.
- **Sub-pixel wood.** `minRadius` is four centimetres for the reason in
  `FOLIAGE.md` §14, and a rowan or a holly is thin enough to reach it.
- **A sapling that is a scaled adult.** §4.
- **A constant sized for the biggest tree.** `oakWood` floored a crown cloud
  at 1.3 m, which is a fifth of an oak and most of a sapling. Anything the
  whole kit runs through is a fraction of the height or it is a bug waiting
  for the first small caller.
- **Blossom as a new mechanism.** It is `FIN_FLAG.blossom` on a second
  `branchCards` call and the shader already handles it.
- **A crown on a species that has no wood.** Every one of these has a trunk
  or stems. `bush` and `gorse` are the ones that do not, and they are not in
  this pass.
- **Losing an id in the fold.** A builder name changes; an entry id never
  does.
- **Dressing.** A builder makes the tree. Nothing scatters leaves, cones,
  fallen fruit or shade under itself.
- **Building all seven phases and handing over a heap.** §3.

---

## 12. Not here

- `bush`, `thicket`, `gorse`, `bramble`, `hedge`. They stay on `lobe` and
  `fringe`, so `lobe` and `fringe` stay. `FOLIAGE.md` §16 step 3 is the
  hedge's own pass.
- The vista builders. `vista-tree`, `vista-copse`, `vista-forest` and
  `vista-wood-edge` are distant masses on their own kit and one mass per
  builder is their rule.
- Seasonal leaf fall, leaf particles, a species' own autumn colour. The
  season is the four uniforms already there.
- New wind behaviour. §5 sets two numbers per species and nothing else in
  `sway.ts` changes.
- Any check, probe or verification script.

---

## 13. Decisions

- **Eight new species**, all of them: ash, alder, Scots pine, yew, rowan,
  holly, poplar, sycamore.
- **Plain names.** The `village-` prefix goes and the old builders are
  deleted.
- **Scope is trees and the tree-like shrubs.** `hazel`, `elder`, `hawthorn`
  and `fruit` come; `bush`, `thicket`, `gorse`, `bramble` and `hedge` do not.
- **Placements mix into what is there.** No new plantings.
- **Four new sheet kinds**, tile 384, one row of six per kind. `blossom`
  carries berries as well as flowers, on the fruit flag.
- **Seven phases, one or two at a time, reviewed between.**
- **Saplings stay their own builders.**
