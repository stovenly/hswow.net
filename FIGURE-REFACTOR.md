# Figure refactor: one surface vocabulary, explicit layers, physiques

A design for reworking how figures are dressed and proportioned. Read LIFE.md
§3 and §5 first; this document assumes it. The code it covers: `figure.ts`,
`figure-trunk.ts`, `figure-wear.ts`, `figure-finery.ts` in `src/art/builders/`,
plus `src/art/rig.ts`, `src/art/assemble.ts`, `src/life/gaits.ts`.

## 1. Why

Three present pains and four future extensions drive this.

**Pains:**

1. Adding clothing has no standard. The garment primitives are split across
   two files, layering state (`m.layer`, `m.neck`) is mutated as a side effect
   by whichever garment builds, proud offsets are hand-tuned literals, and the
   dress driver in `figure.ts` is two parallel branches. New work has to
   reverse-engineer all of it.
2. The quality bar is not structural. `Wear.build(rng, m): Part[]` accepts
   anything, including a box floated near the body. The decisions that make a
   garment good — closed rings, folded hems, linings, plumb edges, colour
   boundaries on mesh edges — live inside the good primitives, but nothing
   routes new work through them.
3. Clothing clips under animation. The baldric, sash, blanket roll and capes
   wrap the deltoid balls **at rest** but are skinned with `trunk.skin`, which
   knows hips/torso/chest/clavicles and nothing about the arms. The deltoid
   rides `armLu`; the wave greet turns `armLu` ~1.55 rad while the clavicle
   gets 0.12. The ball leaves; the band stays; stretch and clip. Systematic:
   the baldric crosses the shoulder on the dominant side, which is the side
   the wave uses.

**Extensions this must not build itself out of:**

- A shorter physique — dwarf-style factory NPCs with mechanical accessories.
- Nonhumanoid NPCs: new rigs and gaits, but the *clothing* principles reused.
- More and more complex animations, without revisiting garments each time.
- Iterating the base model (arm length, elbow/knee shape) with everything
  downstream refitting automatically.

## 2. What stays

These are working and are kept as-is:

- The `Trunk` parametric surface and its blended `skin(x, y)` field.
- `assemble`/`finishRigged`: one merged geometry, one draw call, rigid
  per-part bones or blended `Part.skin`, ≤ 4 influences per vertex. The
  attribute budget does not change (`skinIndex`/`skinWeight` already exist).
- The pose system: procedural layers summing deltas into `Pose`, springs,
  inertialised transitions, planted feet with two-bone leg IK.
- Every existing garment's *look*. The restructure must be visually inert at
  rest: the same seed renders the same villager. The only intended visible
  change is under animation (§4).
- All CLAUDE.md rules: builders build the object only; no checks, probes or
  verification scripts — verify by reading and by what the world shows; short
  comments; no cloth sim on figures; colour boundaries are mesh edges.

## 3. The design

Seven pieces. File names below are proposals; keep the flat `figure-*.ts`
naming in `src/art/builders/` so the registry entry does not move.

### 3.1 `Surface` — the one thing the vocabulary depends on

New file `figure-surface.ts`. Everything clothing-shaped is built against this
interface, of which the humanoid trunk is the first implementation:

```ts
interface BoneBall {            // a bulge the surface wraps and follows
  x: number; y: number; z: number; r: number;
  bone: string;                 // what the ball rides: 'armLu', a leg root…
}

interface Surface {
  sides: number;                       // ring vertex count
  us: readonly number[];               // the sample heights
  point(u: number, bearing: number, proud?: number): Vec3;   // bare surface
  extent(u: number): { w: number; front: number; back: number; cz: number };
  uOf(y: number): number;
  yOf(u: number): number;
  boneAt(y: number): string;           // rigid binding for stuck things
  skin: NonNullable<Part['skin']>;     // the blended field of the bare surface
  obstacles: readonly BoneBall[];      // what the dressed surface wraps
}
```

The **dressed surface** (today's `surface()` in figure-wear) becomes a
function of a `Surface`: the bare point taken outward wherever an obstacle
ball stands past it at that height. Same math as now; the deltoids become
`obstacles` with `bone: 'armLu' | 'armRu'`. Generalising the deltoid to
`BoneBall` is what lets a quadruped's leg roots, or a dwarf's shoulder rig,
use the identical wrap later.

The vocabulary — `shell`, `cape`, `band`, `ribbon`, `fringe`, `stuck`, plus
`stole`, `facing`/`facings`, `cloak`, `sash`, `pleated` moved here from
figure-finery — all take a `Surface` (via the wearer context, §3.4) and
nothing humanoid. `pickWeighted`, `Columns` helpers and `frontColumns`/
`backColumns` live here too. figure-finery's copy of the hem lip and the
extras driver are deleted in favour of the shared ones (§3.4).

### 3.2 Skin-follow — the clipping fix

New: `dressedSkinOf(surface): Part['skin']`. For a vertex at `p`:

- For each obstacle ball, an influence
  `w = ease(1 − max(0, |p − centre| − r) / (0.5 · r))` — 1 inside the ball,
  fading to 0 half a radius outside it. Tune the 0.5 by eye in the gallery;
  the intent is that a band crossing the chest is pure trunk skin a column or
  two away from the shoulder, and pure arm right over it.
- Result: the bare `surface.skin(p)` weights scaled by `(1 − Σw)`, plus each
  ball's bone at its `w`. Trim to the four largest weights and renormalise
  **here** — do not rely on `assemble` to trim (it slices to four but
  normalises over the full list).

By construction the rest pose is unchanged — weights only matter once bones
move. Under the wave, the shoulder run of a baldric now travels with `armLu`
and the blend stretches the cloth smoothly into the part that stays on the
trunk: the "stretch or stay attached" behaviour, with no cloth sim and no
per-frame cost.

**The rule for who gets which skin:** geometry sampled off the *dressed*
surface (`rowsOf`, `surface()` calls — capes, bands, ribbons, sashes, cloaks,
stoles, facings, the blanket roll, `shell` with `over: true`) skins with
`dressedSkinOf`. Geometry on the *bare* surface (base garment bands via
`trunk.rows`, `shell` cutting armholes) keeps `surface.skin` — it lies under
the deltoids, not over them.

**Stuck things:** `stuck` currently pairs with a single `boneAt(y)` bone while
the band under it is blended, so a bow can shear a buckle off its belt.
Instead, evaluate `dressedSkinOf` once at the anchor point and give the whole
primitive those constant weights.

This piece is independent of everything else and ships first (§5, steps 1–2).

### 3.3 `LayerStack` — layering as a declaration, not a side effect

New file `figure-layers.ts`.

```ts
type Region = string;   // declared by the body plan: 'waist', 'neck',
                        // 'shoulder', 'back' for the humanoid trunk

class LayerStack {
  proudAt(region: Region): number;               // current outer level
  wear(region: Region, thickness: number): number; // proud to build at;
                                                   // raises the level
}
```

Every catalog entry declares the regions it occupies and its thickness, and
*receives* its proud from the stack instead of reading `m.layer`/`m.neck` —
both of which are deleted, along with `figure.ts` poking `body.layer` between
slots. The driver walks the slots in order (base → overlayer → waist →
shoulder → extras); a garment can no longer depend on knowing what else was
worn, only on the level the stack reports.

Derived clearances replace duplicate literals: the arm hanging line's
hard-coded `+ 0.024` coat allowance becomes
`max(...overlayers.map(o => o.proud ?? 0))` computed from the catalog at
module load, so a thicker coat can never desync from the arms that must clear
it.

### 3.4 Catalogs and the shared driver

- `figure-wear.ts` shrinks to the **countryside catalog**: `GARMENTS`,
  `OVERLAYERS`, `WAISTS`, `SHOULDERS`, `EXTRAS` as compositions of §3.1
  vocabulary. `figure-finery.ts` likewise becomes the **city catalog** only.
- One `dress()` driver in `figure-layers.ts` replaces the two branches in
  `figure.ts` and the duplicated hem-lip and extras-count code. It is
  parameterised by a catalog set and the wearer context.
- The wearer context (today's `Body`) splits: a generic part — `surface`,
  the `LayerStack`, colours (`cloth`/`lower`/`accent`/`trim`/`leather`/
  `metal`/`fur`), `side` — and a humanoid extension carrying `hemU` and
  anything else trunk-specific. Vocabulary functions take the generic part.

### 3.5 `Physique` and `People` — proportions and gestures as data

New file `figure-people.ts`. Everything `figure.ts` currently hard-codes
about shape moves into a record:

```ts
interface Physique {
  height: [number, number];       // 1.28..1.68 for villagers
  headR: [number, number];
  legFraction: [number, number];  // of (height − head)
  armR: number;                   // units of T, today 0.068
  legR: number;                   // 0.095
  upperArm: number;               // 0.49
  forearm: number;                // 0.4
  frame: FrameRanges;             // the drawFrame slider ranges
  gestures: GestureFit;           // §3.5.1
}

interface People {
  physique: Physique;
  heads: { kinds: readonly string[]; default: string };  // mask or helm set
  outfit(rng: Rng, hide: number): Colours;   // today's outfit / outfitCity
  lowerStyles: WeightedTable;                // trousers/wraps… or hose/garters
  catalogs: { garments; overlayers; waists; shoulders; extras };
}

const PEOPLE: Record<'country' | 'city', People> = { … };
```

`figure.ts` becomes a driver that reads `PEOPLE[folk]`. Villager and cityfolk
are the first two entries and must render identically to today from the same
seeds. The dwarf later is a third entry — new physique, largely reused
catalogs plus a mechanical-extras catalog — with **no new machinery**.

Per-item scaling stays a decision, not a rule: catalog entries that size
things in absolute metres (a pouch is a real object) keep doing so; entries
that should scale with the body use units of T. When the dwarf is added, each
extra gets looked at once and marked. Do not pre-convert them now.

#### 3.5.1 `GestureFit` — contact gestures per physique

Poses are rotational; contact is positional. The greets and fidgets that
*touch* something — `heart`, `press`, `brow`, `doff`, `clap`, and the
`scratch`/`fold` fidgets — encode the current arm-to-torso ratio in their
tuned rotations, so a big proportion change makes a hand miss the mask or the
chest. The fix for now is two scalars, tuned by eye per physique:

```ts
interface GestureFit {
  reachIn: number;   // scales the elbow-fold of hands-to-chest gestures
                     // (heart, press, clap, fold): 1 for villagers
  reachUp: number;   // scales hand-to-head gestures (brow, doff, scratch)
}
```

Carried onto `LifeSpec` by the figure builder, passed by `Creature` into
`bipedGreet`/`bipedFidget`, and multiplied into exactly those gestures'
arm rotations in `gaits.ts`. Both default 1; villagers and cityfolk stay
byte-identical. The dwarf tunes them once, in its `Physique`, by looking at
the gallery.

### 3.6 Limb surfaces — sleeves become catalog work

New file `figure-limbs.ts`. Each limb segment gets a small handle mirroring
the trunk's idea at limb scale:

```ts
interface Limb {
  point(t: number, bearing: number, proud?: number): Vec3;  // along the loft
  radiusAt(t: number): number;
  bone: string;
  from: Vec3; to: Vec3;
}
```

Built from the same station arrays the limb loft uses, so a changed elbow or
knee profile refits everything on it. Sleeve ends, cuffs, wraps, garters,
gloves and boot collars move out of `figure.ts`'s arm/leg loops into limb
catalogs on the `People` spec, using `band`/`ribbon`-style ops over the limb
surface. Pieces stay per-segment — one bone each — which is what the
joint-head convention wants; nothing spans a hinge.

### 3.7 The motion envelope — the animation/clothing contract

New file `src/life/envelope.ts`: per body plan, per bone, the largest
excursion any animation layer applies —

```ts
const BIPED_ENVELOPE: Record<string, { rx: number; ry: number; rz: number }>
```

— with values taken by **reading** `gaits.ts` (the wave's `armLu` rz reaches
1.55·e plus idle drift; the raise 1.7; torso rx tops out in the bow at 0.28;
and so on), not by instrumenting anything. Two consumers:

- Clearance derivations in the builder (the arm hanging line, shoulder-layer
  flares) read it instead of embedding assumptions.
- It is the contract for new animations: stay inside it and no garment needs
  revisiting; widen it and the widened entry is the list of what to recheck.

### 3.8 Arm IK — a seam, cut but not built

Not implemented in this refactor; designed so nothing forecloses it. When
prop-interaction animations or a third physique arrive, add `src/life/arms.ts`
mirroring `legs.ts`: two-bone IK from shoulder to wrist, elbow hinted down
and out, writing `armXu`/`armXl` rotations into the pose from a hand target in
creature space. Contact gestures then graduate from `GestureFit` scalars to
targets ("mask brim", "chest centre") published by the builder on `LifeSpec`
(the mask's brim height is `built.faceY`, already carried). Nothing in this
refactor may assume arm rotations come only from gait layers — `Creature`
already sums layers into one `Pose`, which is the only assumption IK needs.

### 3.9 The standard (goes into LIFE.md §3 when done)

The checklist that is the quality bar. With §3.1–§3.4 in place it is also the
path of least resistance:

- Every worn piece is a layer, band, ribbon, or stuck thing of a body
  surface. Free-floating geometry near the body is not clothing.
- Every edge folds back or closes; no open lip you can see into.
- Every colour boundary is a ring or a run of columns. Never a threshold.
- Every piece declares its slot, regions and thickness to the `LayerStack`
  and builds at the proud it is given.
- Geometry off the dressed surface takes the dressed skin; on the bare
  surface, the bare skin; stuck things sample the dressed skin once at their
  anchor.
- New primitives go in `figure-surface.ts` with a reason, or not at all.
- Animations stay inside the envelope or widen it deliberately.

## 4. Invariants

- Same seed → same villager at rest, before and after. The restructure is
  visually inert; §3.2 changes only what happens when bones move.
- One draw call per figure; ≤ 4 bone influences per vertex; no new vertex
  attributes.
- No cloth simulation, no weathering, no per-frame garment work.
- No checks, probes, or throwaway tools — correctness is established by
  reading the code and by the villager/cityfolk galleries in the world.
  the world's report is the ground truth on how it looks.

## 5. The path

Work the steps in order. Each is a self-contained change that leaves the
project working; do not start a step with the previous one unfinished.

**Step 1 — skin-follow** (§3.2). Add `dressedSkinOf` and put it on every part
whose geometry is sampled off the dressed surface: capes, the shoulder
mantle, bands, ribbons, sashes, the baldric, cloaks, stoles, facings, the
blanket roll, `shell` with `over: true`. Parts on the bare trunk keep
`trunk.skin`. Files: `figure-wear.ts`, `figure-finery.ts`.
*Done when:* rest pose unchanged; a waving cityfolk's chest band moves with
the shoulder instead of stretching through the arm.

**Step 2 — stuck anchors** (§3.2, last paragraph). `stuck` pieces stop
binding to a single `boneAt(y)` bone; each takes constant weights from one
`dressedSkinOf` evaluation at its anchor point. Files: `figure-wear.ts` and
the call sites in both catalogs.
*Done when:* a bow no longer shears buckles, badges or clasps off the bands
under them.

**Step 3 — consolidate the vocabulary** (§3.1, second half). Create
`figure-surface.ts` and move every garment primitive into it: `surface`/
`rowsOf`/`dressedSkinOf`, `shell`, `cape`, `band`, `ribbon`, `fringe`,
`stuck`, and figure-finery's `stole`, `facing`/`facings`, `cloak`, `sash`,
`pleated`, plus `pickWeighted` and the column helpers. Delete figure-finery's
duplicated hem lip in favour of one shared implementation. Pure move — no
behaviour change.
*Done when:* both catalogs import only from `figure-surface.ts`; same seeds
render identically.

**Step 4 — the `Surface` interface** (§3.1, first half). Define `Surface` and
`BoneBall` in `figure-surface.ts`; retype every primitive against them; the
trunk implements `Surface` with the deltoids as `obstacles`. Nothing humanoid
remains imported by the vocabulary.
*Done when:* `figure-surface.ts` has no import from `figure-trunk.ts` beyond
the `Trunk`-implements-`Surface` adapter, and renders are unchanged.

**Step 5 — `LayerStack` and the shared driver** (§3.3, §3.4). Create
`figure-layers.ts`: the stack, the slot driver `dress()`, the split wearer
context. Delete `m.layer`/`m.neck` and the two dress branches in `figure.ts`;
every catalog entry declares regions and thickness and builds at the proud it
is given. Replace the arm hanging line's `0.024` literal with the maximum
proud computed from the catalog.
*Done when:* no catalog entry reads or writes layering state; `figure.ts`
calls `dress()` once; renders are unchanged.

**Step 6 — `Physique` and `People`** (§3.5, without `GestureFit`). Create
`figure-people.ts`; move the proportion constants, outfit functions, head
sets, lower-style tables and catalog references into two `PEOPLE` entries.
`figure.ts` becomes a driver reading `PEOPLE[folk]`.
*Done when:* `figure.ts` contains no proportion constants, no catalog
knowledge and no `city ? … : …` dress branches; same seeds render identically.

**Step 7 — `GestureFit`** (§3.5.1). Add the two scalars to `Physique`, carry
them on `LifeSpec`, pass them through `Creature` into `bipedGreet`/
`bipedFidget`, and multiply them into the contact gestures only (`heart`,
`press`, `brow`, `doff`, `clap`; `scratch`, `fold`). Both 1.0 for the
existing peoples.
*Done when:* the plumbing exists end to end and animation is byte-identical
at 1.0.

**Step 8 — write the standard** (§3.9). Fold the checklist into LIFE.md §3,
updated to describe the built system (Surface, LayerStack, PEOPLE), and trim
anything LIFE.md now states twice.
*Done when:* LIFE.md describes the new shape and carries the checklist.

**Step 9 — limb surfaces** (§3.6). Create `figure-limbs.ts`; give each limb
segment a `Limb` handle built from its station arrays; move sleeve ends,
cuffs, wraps, garters, gloves and boot collars out of `figure.ts` into limb
catalogs on the `People` spec.
*Done when:* `figure.ts`'s arm/leg loops build only the limb lofts, joint
heads, hands and feet; all limb dressing is catalog entries; renders
unchanged.

**Step 10 — the motion envelope** (§3.7). Create `src/life/envelope.ts` with
`BIPED_ENVELOPE`, values read out of `gaits.ts`. Point the builder's
clearance derivations (arm hanging line, shoulder-layer flares) at it, and
note the contract in LIFE.md: new animations stay inside it or widen it
deliberately.
*Done when:* the table exists, the builder reads it, and no clearance
assumption about animation lives anywhere else.

Future, explicitly out of scope for this path: the dwarf `People` entry, item
by-item accessory scaling decisions (taken with the dwarf), nonhumanoid
`Surface` implementations, arm IK (§3.8), key-pose sequence helpers.

## 6. Acceptance

- Villager and cityfolk gallery rows read unchanged at rest from the same
  seeds.
- A cityfolk with a baldric or chest band waving hello: the band moves with
  the shoulder instead of stretching through the raised arm. Capes tent over
  a raised arm instead of being pierced by it.
- `figure.ts` contains no catalog knowledge, no layering literals, and no
  proportion constants outside `PEOPLE`.
- Adding a hypothetical new overlayer requires touching exactly one catalog
  file.
