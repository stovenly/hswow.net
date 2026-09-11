# Zone boundary — spec

**Built.** Five of the eight outdoor cells stop the player with an invisible
slab and show nothing for it. `forest` has 392 metres of them and not one metre
of anything to see. This is a boundary for every cell that lacks one, built
from the line builders the project already has, and the gateways the boundaries
make possible.

**The one-sentence version:** `wall`, `fence` and `hedge` lines — alone or in
combination, and banked and planted where the cell is wild — close the arcs
that are currently held by nothing but collision; and because there is then a
boundary to put a hole in, every zone transition gets a built threshold instead
of a gap in the air.

Checked against `art/lines/wall.ts`, `art/lines/fence.ts`, `art/lines/hedge.ts`,
`art/lines/walk.ts`, `art/lines/index.ts`, `art/builders/gate.ts`,
`art/builders/stone-wall-archway.ts`, `art/builders/stile.ts`,
`world/kinds.ts`, `guidelines/LEVEL-DESIGN.md`, `guidelines/ENVIRONMENT-DESIGN.md`,
`projects/debug/content/world.json` and all eight outdoor zone documents, as
they stand. Nothing is to be built to verify it — the render is the ground truth.

---

## 1. The ask

- Every zone without a boundary wall or thicket wall gets one.
- Built from `hedge`, `fence` and the stone `wall` line — one of them, or a
  combination, as the place wants.
- **And with a boundary to open, put proper gateways in for the zone
  transitions: arches and gates.**

---

## 2. The survey

Metres of boundary that can be seen, against metres held by an invisible
`barrier` slab, per cell. "Seen" counts only `wall`, `fence` and `hedge` runs
more than 28 m from the origin — a paddock fence in the middle of a field is
not a boundary.

| Cell | half | Seen | Unseen | State |
|---|---|---|---|---|
| `village` | 70 m | **244 m** | 11 m | Done. Walls, a fence run and a hedge close, all round |
| `farm` | 70 m | **254 m** | 4 m | Done. Wall, fence and three hedges |
| `plains` | 100 m | **280 m** | 17 m | Done. Three long wall runs |
| `riverside` | 85 m | 169 m | 231 m | **East is bare** — one 130 m slab and nothing on it |
| `beach-path` | 85 m | 175 m | 725 m | **North only.** The lane hedges and one wall; 545 m of edge slab elsewhere |
| `forest-path` | 80 m | 21 m | 575 m | **Almost nothing.** Two short walls on the north-east; 518 m of edge slab round the rest |
| `coast` | 90 m | **0 m** | 527 m | **Nothing.** 168 m of it is sea, which is a boundary; 360 m is not |
| `forest` | 85 m | **0 m** | 392 m | **Nothing at all**, on all eight sectors |

Two of the unseen totals are legitimate and stay: `coast`'s twelve `sea-slab`
runs (168 m, south-west through south-east) and `riverside`'s `south-water-slab`
(16 m). Water is a boundary. Everything else in the Unseen column is a wall the
player walks into and cannot see.

### What is actually missing

| Cell | Arc | Metres |
|---|---|---|
| `forest` | all eight sectors | 392 |
| `coast` | N 160, E 98, W 102 | 360 |
| `riverside` | E 130, and the north topped up | ~160 |
| `forest-path` | all eight sectors, less the 21 m of wall on the north-east | ~500 |
| `beach-path` | everything but N and NW | ~550 |

---

## 3. What the guidelines already decide

Not open questions, and the spec is written inside them:

- **`LEVEL-DESIGN.md` §Boundaries.** *"Boundaries are walls, hedges, treelines,
  water and rock. **Never a rim of hills.** … A boundary must look like one and
  must be the same kind of thing the player has already learnt they cannot
  cross."*
- **`LEVEL-DESIGN.md` §Path zones.** For the corridor cells: *"an open hallway
  10–16 m wide between banks the controller cannot climb … **The walls are
  ground and trees, never a line that can be tested.**"* `forest-path` and
  `beach-path` are those cells, and this is the one place where a dry-stone wall
  round the edge would be wrong. §6.4 and §6.5.
- **`LEVEL-DESIGN.md` §The gates and the compass.** *"A gate is a gap walked
  through (an arch, two crags, two trees) with the far zone's name over the
  crosshair on approach."*
- **`ENVIRONMENT-DESIGN.md` §Farmland and lane.** *"Hedgerows — a bank, then the
  hedge, with standard trees along it at uneven intervals. The hedge is the wall
  the player cannot cross and the edge the eye follows."*
- **`ENVIRONMENT-DESIGN.md` §Boundaries follow the ground.** *"Walls follow
  existing edges: a stream, a slope foot, a rock line."* No boundary in this
  spec is drawn as a straight line at a fixed radius.

---

## 4. The vocabulary

Three line builders, all present, all with styles and marks already:

| Builder | Styles | What it says |
|---|---|---|
| `wall` | `tall` (0.4–2.5 m, `height` option), `low` | Stone. Resources, permanence, a boundary somebody paid for. Batter, coping, a foundation carried below the datum so a run on a slope stands on stone |
| `fence` | `post-and-rail`, `picket`, `rope` | Timber. Cheap, recent, a stock boundary rather than a land boundary. 1.25 m — it reads as a limit without hiding what is past it |
| `hedge` | `trimmed` (1.5 × 1.0 m), `wild` (2.1 × 1.4 m), `height` option, `bank` option | Growth. The Devon hedge — a bank then the hedge — is the `bank` option and it is what most of this spec wants |

And a fourth thing that is not a line: a **planted band** of `thicket`,
`gorse`, `bramble` and trees, scattered inside a region against the edge, with
the slab behind it. That is the "thicket wall", and it is what a wood and a dune
want where a built wall would be a lie.

**Combination is the point.** A single material for 400 m is a fence around a
level. What reads is what actually happens in the country: wall where the ground
is stony and somebody cleared it, hedge on a bank where it is farmed, fence
where a gap was made good cheaply, and the boundary handing off from one to the
next at a corner or a change of ground — never mid-run for no reason.

### The marks already exist and nothing uses them

`wall.ts:281–308` handles mark kinds `gate`, `arch`, `stile`, `creep`, `ruin`
and `gap`, and **leaves the opening**: `if (kind === 'gate' || kind === 'gap' ||
kind === 'arch')` the run is skipped so the wall does not close over the prop.
`hedge.ts` does the same for `standard`, `gate` and `stile`, and suppresses its
own bulge for 1.5 m either side of a standard.

Across all eighteen zone documents these marks are used **three times**, all in
`water-showcase`. Every gate and archway in the project is a `prop` entry
standing next to a line that does not know it is there. §5 is largely about
using what is built.

---

## 5. The gateways

Nine portal pairs, eighteen ends:

| Pair | Ends today |
|---|---|
| `village` W ↔ `farm` E | An archway on both sides. **The only pair that reads as a threshold from both directions** |
| `village` S ↔ `plains` N | An arch slab on the village side; a bare slab on the plains side |
| `farm` S ↔ `riverside` N | A gate on the farm side; slabs on the riverside side |
| `riverside` SE ↔ `forest-path` W | Slabs both sides |
| `plains` SW ↔ `forest-path` NE | Slabs both sides |
| `plains` SE ↔ `beach-path` NE | Slabs both sides |
| `beach-path` S ↔ `coast` N | Slabs both sides |
| `forest-path` S ↔ `forest` N | A slab one side; **`forest` has no gate slab at all** |
| `forest` SE ↔ `beach-path` NW | **`forest` has no gate slab at all** |

The rule this spec applies at every one of the eighteen:

1. **The threshold is a mark in the boundary line**, not a prop beside it. The
   line opens for it and closes on both sides of it, which is the difference
   between a gate in a wall and a gate in a field.
2. **The two sides agree in kind.** Walking out of a stone arch and arriving at
   a hedge gap is the same mistake as a door that is a different door on the
   other side. What is on each side is the cell's own material, but the *kind*
   of opening — arch, gate, gap, stile — matches its partner.
3. **The threshold is enclosed, then it opens.** `LEVEL-DESIGN.md`'s arrival
   shot: *"The first ten metres after a gate are a threshold: enclosed, then
   opening."* The boundary running away on both sides of the opening is what
   makes those ten metres enclosed, and it is exactly what is missing now.
4. **The far zone's name is over the crosshair on approach.** That already works
   off the portal; nothing here changes it.

| Kind | Builder | Where |
|---|---|---|
| Arch | `stone-wall-archway` | A `wall` boundary, where the transition is between two settled places |
| Gate | `gate`, `width` from the mark | A `hedge` or `fence` boundary, and at a lane or track crossing it |
| Gap | none — the line just opens | A wild boundary: a planted band with a way through it, two trees, two crags |
| Stile | `stile` | Where a footpath crosses a boundary that has no gate. Not a zone transition — a detail on a run that needs one |

A `fingerpost` at the approach to a gateway is worth having where two ways
part, and is a placement decision per cell rather than a rule.

---

## 6. Cell by cell

Positions are not written here. Each phase reads `LEVEL-DESIGN.md` and
`ENVIRONMENT-DESIGN.md`, plans against the ground the cell actually has, and
runs both checklists before it is reported. What is fixed here is the **kind**
of boundary each cell gets and why.

### 6.1 `forest` — 392 m, and nothing there now

A wood is bounded by the wood. The boundary is a **planted band**, not a
built one, for most of the way round:

- A **bank** — the `hedge` line's own `bank` option gives a stone-faced earth
  bank in the ground's colour, which is the right foot for a woodland boundary
  even where nothing is planted on top of it.
- **`hedge` in `wild` style on the bank** where the wood meets open ground, and
  the reworked dense hedge of `CARD-FOLIAGE.md` §8 is what makes that hold up
  at eye level.
- A **`wall` in `low` style, ruined in places** on one arc only. An old
  woodland boundary wall half swallowed by the wood is the single best thing
  this cell can have on its edge, and `wall.ts` already has a `ruin` mark for
  it. One arc, because two would be a pattern.
- **`thicket`, `bramble` and `holly` scattered against the band** everywhere,
  so the eye reads impassable growth rather than a line.

Both gate ends are new: **N to `forest-path`** and **SE to `beach-path`**, and
neither has so much as a slab today. Both are **gaps** — a way through the bank
between two standards — because a stone arch in the middle of a wood is a
building nobody built.

### 6.2 `coast` — 360 m, with the sea keeping the south

The sea stays the boundary from south-west to south-east and needs nothing.
The other three arcs are bare.

- **North, 160 m** — this is the arc the gate to `beach-path` sits in, and it is
  currently one slab named `gate-slab` running the whole width. Above the beach
  the ground is dune and links: a **`fence` in `post-and-rail`** along the top
  of the dune line, gapped and leaning, is what is really there, with **gorse**
  and **marram** against it.
- **East, 98 m and west, 102 m** — where the coast runs out at a headland.
  **`wall` in `low` style** on the seaward stretch — a field wall run right to
  the cliff, which is what actually happens — handing off to a planted band of
  gorse where the ground breaks up.
- The gate end at **N** becomes a **gate** in the fence, on the track.
- If `CARD-FOLIAGE.md` phase 4 has landed, the **palms and the baobab** stand
  inside this boundary and not on it. A landmark on the edge of a cell is a
  landmark half of which is out of bounds.

### 6.3 `riverside` — the east side, 130 m

The cell has 169 m of visible boundary already — the west hedge and the two
north hedges — and one bare slab running the whole east side.

- **`hedge` with `bank`, in the same idiom as the west hedge**, so the cell
  reads as one farmed valley rather than two halves. Standards along it at
  uneven intervals, which the `standard` mark does and which nothing in this
  project currently uses.
- The **north** is topped up to meet the existing hedges, so the arc is
  continuous rather than three hedges with 58 m of slab between them.
- The **south stays water**. `south-water-slab` is the river and is correct.
- Two gate ends: **N to `farm`** (a gate in the hedge, on the track) and
  **SE to `forest-path`** (a gate, matching whatever `forest-path` puts on its
  west end — §6.4).

### 6.4 `forest-path` — the corridor cell, ~500 m

**This is where a wall would be wrong.** `LEVEL-DESIGN.md` is explicit: a
corridor cell's *"walls are ground and trees, never a line that can be
tested"*. 518 m of dry-stone wall round a woodland path is a level with a fence
around it, and it would be the most visible mistake in the project.

So:

- **Bank and treeline** for the great majority of it — the ground already rises
  and falls here (four channels, two scarps) and the boundary is the foot of
  that, planted. A `hedge` line with `bank: true` and a `height` well down,
  under a dense scatter of `thicket`, `holly` and `bramble`, is a bank with
  growth on it and not a hedge.
- **The two existing 21 m walls on the north-east are kept and extended a
  little** — they are where the path passes an old boundary, and one built
  thing on an otherwise wild edge is an anomaly worth having.
- **`fence` in `post-and-rail`, short runs only**, where a track runs beside the
  edge and somebody would have fenced it off.
- Three gate ends: **W to `riverside`**, **NE to `plains`**, **S to `forest`**.
  W and NE are **gates** — they meet farmed cells. S is a **gap** in the bank,
  matching `forest`'s north end.

### 6.5 `beach-path` — the other corridor cell, ~550 m

Same rule, different ground. Dune and scarp, with 154 m of the unseen total
already following a real crest.

- **The crest stays the boundary where there is one.** A dune crest is rock and
  ground, which the guideline allows, and it needs planting rather than
  building: **marram, gorse and thicket** banded along it.
- **`fence` in `post-and-rail`** along the boardwalk and the dune track, where
  a path is kept off the dune. This is the one built thing that belongs on a
  dune and it is exactly what is there in life.
- **The existing north wall and the two lane hedges are kept** and extended to
  meet the new work.
- Three gate ends: **NW to `forest`** (a gap), **NE to `plains`** (a gate, since
  `plains` is walled), **S to `coast`** (a gate in the dune fence, on the track).

### 6.6 `village`, `farm`, `plains` — boundaries done, gateways not

No new boundary. What these three get is §5 applied to their six gate ends: the
gate and arch props moved **into** their boundary lines as marks, so the line
opens for them, and the four ends that are a bare slab given a threshold.

`village` ↔ `farm` is the reference. It already reads correctly from both
sides and it is what the other eight pairs are being brought up to.

---

## 7. How the work lands

| Phase | What lands | What to look at |
|---|---|---|
| **1** | `forest`: 392 m of bank, wild hedge, one ruined low wall, planted band. Both gate ends as gaps | Walking the whole edge of the wood, and both ways out |
| **2** | `coast`: the dune fence north, low wall east and west, gorse against it. The gate to `beach-path` | The headlands, and arriving from `beach-path` |
| **3** | `riverside`: the east hedge on its bank with standards, the north made continuous. Both gate ends | The east side from the river, and both gates |
| **4** | `forest-path`: bank and treeline, the two walls extended, short fence runs. Three gate ends | The whole corridor, and whether the edge can be tested |
| **5** | `beach-path`: crest planting, boardwalk fence, existing runs extended. Three gate ends | The dune line, and all three ways out |
| **6** | `village`, `farm`, `plains`: six gate ends, and every gate and arch in the project moved into its line as a mark | The eighteen ends, each from both sides |

Phases 1 and 2 may go together. 3 is small and can ride with either. **4 and 5
are each their own** — they are the corridor cells and the place this spec is
most likely to be wrong. 6 is last because it is the pass that makes all
eighteen agree, and it cannot be judged until they exist.

**If a phase's look is rejected, the next phase does not start.**

### What this wants to land after

`CARD-FOLIAGE.md` phases 1–3 rebuild `thicket`, `bramble` and `hedge` on branch
cards, and phase 3 in particular makes the hedge dense enough to hide what is
behind it. **Every boundary in this spec is made of those three things.**
Building 1,900 m of boundary out of the old fluffy-lobe thicket and the
see-through hedge, and then rebuilding all of it a week later, is two passes for
one result. Recommended order: `CARD-FOLIAGE` 1–3, then this.

---

## 8. Ways to get this wrong

- **A wall round a corridor cell.** §6.4 and §6.5. The guideline says ground and
  trees and it says why: a line that can be tested tells the player they are in
  a box.
- **A rim of hills.** Named in both guidelines and in the standing rules. The
  boundary is a wall, a hedge, a treeline, water or rock, and the vista goes
  beyond it.
- **One material for 400 m.** The hand-off between wall, hedge and fence happens
  at a corner or a change of ground, for a reason the player can see. Never
  mid-run at a random station.
- **A straight line at a fixed radius.** Boundaries follow the ground: a slope
  foot, a stream, a rock line. A circle at 85 m is the level's edge drawn in
  stone.
- **A gate that is a prop beside a line.** The mark machinery exists in both
  `wall.ts` and `hedge.ts`, it leaves the opening, and it is used three times in
  the whole project. Use it.
- **Two ends of one portal that disagree.** An arch on one side and a hedge gap
  on the other is a door that is a different door from the other room.
- **Standing a landmark on the boundary.** Half of it is out of bounds. Inside,
  with the boundary behind it.
- **Dressing the ground under the boundary.** A builder builds the object; a
  boundary line lays a boundary. No churned earth, no leaf litter, no spill.
- **Leaving the slabs where the line now collides.** §10, decision 3.

---

## 9. Not here

- Any new line builder. `wall`, `fence` and `hedge` are the vocabulary and they
  are enough.
- Any change to `walk.ts`, the mark system or the collision shape. The marks
  already do what §5 needs.
- New portals, or moving an existing one. The nine pairs and their positions are
  fixed and everything here is arranged around them.
- The three interior-facing cells and the debug rooms. `barn`, `cellar`,
  `cottage`, `farmhouse`, `forest-cottage`, `store`, `villager-hut`,
  `workshop`, `demos`, `water-showcase` have no terrain and no outdoor edge.
- Re-cutting terrain. Where a boundary wants a bank, the `hedge` line's `bank`
  option gives it one; no landform is added, and nothing in `landforms` is
  touched. Adding ground here is how the pits happened.
- The vista beyond the boundary. `CARD-FOLIAGE.md` owns that band.

---

## 10. Decisions

| # | Before | Question | My recommendation |
|---|---|---|---|
| 1 | Phase 1 | Does this wait on `CARD-FOLIAGE` phases 1–3? | **Yes.** Every boundary here is thicket, bramble and hedge, and all three are being rebuilt. Otherwise it is built twice |
| 2 | Phase 4 | `forest-path` and `beach-path` are the corridor cells the guidelines say must have ground-and-trees walls. Planted band, or built boundary anyway? | **Planted band**, with short built runs only where a track passes. The guideline is specific and it is right |
| 3 | Phase 1 | When a boundary line covers an arc, does its own collision replace the `barrier` slab, or stand in front of it? | **Replace it.** `wall`, `fence` and `hedge` all return `chordBoxes` colliders. Leaving the slab stops the player a metre short of a hedge they can see, which reads as an invisible wall — the exact thing this spec exists to remove. The slab stays only where the boundary is water or a scarp |
| 4 | Phase 6 | Do the existing hand-placed `gate` and `stone-wall-archway` props move into their lines as marks? | **Yes.** Eight props, and it is what makes the wall open for them instead of closing behind them |

---

## 11. Built

Phases 1–6 landed together. Three departures from the text above:

- **The edge slabs stay.** §10 decision 3 said a line's own colliders replace
  the slab behind it. Every boundary here runs two or three metres *inside* the
  outline, so the slab is behind the thing the player can see and is never the
  first thing met — and dropping it opened a walkable strip between the line and
  the outline that a player could follow round and out of the cell. The slab is
  now the back of the boundary rather than the whole of it, which is what the
  survey was actually complaining about.
- **`forest-path` gets no hedge.** §6.4 proposed a `hedge` line with `bank`
  and a low `height` under the planting. At the corridor's ~500 m and the card
  density of `CARD-FOLIAGE.md` §8 that is forty-five thousand quads for a wall
  the guideline says must not be a line at all. It is a planted band against the
  edge instead — thicket, holly, bramble and birch in a nine-metre band on the
  outline — with one short hedge at the west mouth to carry its gate, and a rail
  along the last of the corridor before the wood.
- **The arches and gates already anchored to their walls stay props.** §10
  decision 4 said to move them into their lines as marks. `village`, `farm` and
  `plains` already lay each wall from `{ ref: <arch>, edge }`, so the wall
  already opens for the prop and stops on its face — with an authored yaw a
  mark's `yawAlong` would not reproduce. What phase 6 delivered instead is the
  two ends that had no threshold at all: a gate hung in `riverside`'s north
  opening to answer the farm's, and a gate between `plains`' south-east
  outcrops to answer the beach path's.

`plains`' north end is a gap between two crags against `village`'s stone arch.
Both are gateways `LEVEL-DESIGN.md` names, they differ in kind, and putting an
arch between the crags would be clutter. Left as it is, and flagged.
