# Foliage — spec

**Open. Third revision.** The first build drew an opaque ball with fins on
it. The second build removed the ball and filled the crown with static fins,
and static fins are edge-on from most angles, so the crown read as sparse.
Both were built without checking what the references actually do. This
revision is built on the thing they all do: **a leaf cluster is a card that
turns to face the camera about its own pivot.** That is why a SpeedTree, an
Oblivion tree, an Airborn tree and a Quibli tree look lush on a few hundred
polygons, and it is what this project's trees do from here on.

**The one-sentence version:** a crown is a few dozen *branch cards*, each
a quad wearing one whole branch off a sprite sheet the game renders at
boot from geometry — hundreds of leaves in the picture — rooted on the
wood and pointing out along it, each turning about its own axis to face the
eye, coloured from one smooth field over the crown so nothing pops where
cards cross, on a trunk and limbs built to be looked at; one canopy
material, one trunk material, instanced per species, shrinking to a card
across the level.

Everything here is checked against `art/foliage.ts`, `art/canopy.ts`,
`art/cards.ts`, `art/cover.ts`, `art/sway.ts`, `art/assemble.ts`,
`world/stands.ts`, `art/lines/hedge.ts`, the tree builders and
`specs/done/VISTA.md`, `GROUNDCOVER.md`, `ANTIALIASING.md`, `PERFORMANCE.md`
as they stand, and against the sources in §18, read on 2026-09-08. Nothing
is to be built to verify it — the render is the ground truth.

---

## 1. The ask

- The trees are big blobs on wood. They should look like a fluffy piece of
  foliage — not see-through, not a texture, on a low triangle count.
- Extend the principle the pampas grass found: a simple flat mesh that sells
  the plant, to trees and to shrubs.
- No textures, by design. Silhouette and colour come from geometry and
  shader math.
- A flat version of each tree for far away, to sell vistas.
- Foliage looking great is a large part of what will make the game look
  great. This is a system, and it gets the work.

**From the first look:**

- **Never a giant green ball.** "Not see-through" was a demand for density,
  not for a solid shape. Nothing round, smooth and opaque is ever drawn as
  foliage.
- **The whole tree is the fin tech.** More of it, everywhere, so the entire
  crown is bushy and fluffy — and the same for hedges.
- **The trunk and branches get real work.**

**From the second look:**

- **The sprites rotate toward the player**, or rotate in some way that gives
  the illusion of a full tree. Static planes do not; that is what the
  research was for.
- **High quality, good looking trees. Not sparse.**
- **Performant.**

**From the third look:**

- **Those aren't leaves or branches, they're circular noise splotches.** A
  solid round card with a dissolved rim is a disc, and a crown of discs is
  a crown of discs.
- **It looks terrible and obvious when they clip into each other**, and
  "the circles just pop in and out of each other constantly." Two solid
  cards of different tones crossing draw a straight line where they meet,
  and the depth test flips it as the eye moves.
- **If the colours smoothly blended together more this could be a useful
  look.** The tech is right; the card's shape and its colour are wrong.
- **Standing right under it and spinning, the camera-facing spin is obvious.**
  A card aligned to the view's right and up turns about its own centre when
  the eye turns; under the crown, looking up, the whole canopy pinwheels.

---

## 2. What this stands on

| | |
|---|---|
| `art/canopy.ts` | Built. `CANOPY_MATERIAL` and its normal, depth and flat twins; the `aCanopy`, `aWind`, `aRoot` lanes; rank shrink-and-grow LOD; the season uniforms; the card crossfade; `canopyMesh`, `drawCanopyNormals`. This revision adds the `aCard` lane and the turn-to-eye in the shared vertex body. |
| `art/foliage.ts` `cloud`, `leaves`, `tufts`, `leafColour`, `finishFoliage` | `cloud` and the envelope maths from the second build stay. `leaves` now writes cluster cards. `lobe` and `fringe` are the older pair, kept until their last caller goes. |
| `art/cards.ts`, `world/stands.ts` | Built. Variants, instanced crowns, the boot atlas, card stands. The atlas renders through the same vertex body, so the cluster cards face its orthographic camera and every view is full. |
| `art/cover.ts` `plumeFin`, `TUFT_MATERIAL` | The stipple discard and the borrowed-normal double-sided trick the canopy material inherited. The plume's static fins are right *for a plume* — a metre-tall thing you walk past — and wrong for a crown you see from thirty metres in every direction. |
| `art/material.ts` | `ART_MATERIAL` flat-shades from screen derivatives and ignores the `normal` attribute — the trunk's material, never the crown's. |
| `ANTIALIASING.md` | MSAA on the colour target only. Edges are found by the detector, not by coverage. |

---

## 3. Why the first two builds failed

**The first drew the envelope.** An ellipsoid with noise on it is still an
ellipsoid; sixty fins on its surface decorate it, they do not hide it.

**The second used static fins.** A flat fin is only full-face from one
direction. From every other direction it is a sliver, and a crown of four
hundred slivers with gaps between them is see-through and sparse from most
viewpoints however many there are. Every reference that looks lush on flat
geometry solves exactly this and in the same way: the plane turns to face
the viewer, so it is always seen full-face. SpeedTree: "the leaf cards
always turn to face the camera, and as a result, they are all parallel to
the view plane." Oblivion: "billboarded leaf clusters which rotate to face
the camera … you won't ever see them from an angle, which helps maintain the
lushness." Airborn's modern form: each quad's corners are remapped to −1..1
and multiplied by the view matrix. Quibli: "Each Face" billboarding. The
Witness went the other way and faded planes out as they went edge-on, which
is the same admission. The second build ignored all of it.

**The trunk was fixed in the second build and stays.**

---

## 4. The model: envelope and field

The envelope and the colour field are kept from the earlier builds; what fills the envelope is §4b, the branch sheet.

**The envelope.** A few overlapping ellipsoids — *clouds* — one hung on the
end of each limb and one over the top, their union the shape of the crown,
noise on the radius so the union is lumpy. The envelope is **never drawn**.
It is the space the cards fill, the surface whose normal every card borrows,
and the measure of how deep in the crown a card sits.

**A leaf carries no colour. The shader paints the crown as one field of
position, per pixel.** Leaves overlap by the hundred and flutter past each
other in depth all the time, even with the eye still, and every time two
swap order the pixel shows whichever is in front. If the two carry
different colours — any difference, however small — that is a pop, and
three rounds of making leaves' colours *more alike* did not end it, because
alike is not the same. So a leaf brings only the species' lit and shade
pair and the crown's ellipsoid (`aShade`, `aCrown`, `aCrownAxes`), and the
fragment shader colours every pixel from where that pixel lies in the
ellipsoid: two leaves at one pixel read the identical colour whichever is
in front, and a swap cannot be seen. The lighting normal is the same field,
also per pixel: a leaf lit by a normal taken where it rests is lit as a
different point on the crown from the leaf it overlaps, because a big leaf
rests most of a metre from where its pixels land once it turns, and where
the sun grazes the crown that difference is the pop again. The field at a
point is: top light from the
envelope's normal there, occlusion from its depth in the envelope (a smooth
ramp, not a step per shell), and a slow noise in hue and value over about
two metres. Two sprays at the same place get the same colour, so where they
cross nothing changes and nothing pops. Within a spray the leaves differ by
a few percent — the ones toward the top a touch lighter, a small gradient
from base to tip — enough to read as leaves, not enough to make a seam.

Solidity is one over the whole leaf: **no stipple on a leaf.** Seen from
under the crown against the sky, every stipple hole is a white dot, and the
edge detector, finding a one-pixel depth cliff in each, rings it black — a
screen of dead pixels. The leaf's shape is its mesh. The stipple still runs
for what the material does with solidity anyway — winter, the card
crossfade — and its lattice for a spray lies **on the spray**, in `aCard`
space with a per-spray offset, so it holds still as the spray turns.

**Borrowed normals, with lumps.** Every vertex of a card takes the
envelope's normal at the card's root — for a point inside several clouds,
the clouds it is in blended by how deep it is in each — bent ~30 % toward
the direction from the nearest of a few lump points seeded inside its cloud,
so the mass shows the soft cauliflower lumps a crown has. `n.y` clamps at
−0.15. The normal does not turn with the card: the card is a sprite standing
in for a piece of a surface, and it is lit as that piece of surface from
every angle. This is the Airborn and Breath of the Wild rule, and it is why a
crown of camera-facing sprites does not look like a crown of sprites.

**Shadows.** In the shadow pass the same vertex body runs with the light's
view matrix, so **every card turns to face the light** and casts a disc.
That is SpeedTree's rule verbatim — "when rendering to the shadow map, they
turn to face the light source and thus make good shadow casters" — and it
means the crown casts as a soft lumpy mass with no separate caster and no
drawn ball. The old static fins still collapse in the shadow pass and cast
nothing.

Together: a full oak is a trunk, limbs, branches and twigs of ~1,200
triangles and ~340 sprays of ~25,000 — about 27,000 for the hero tree on the
green, thinning by rank with distance — and it is full from every side.

---

## 4b. The branch sheet

Nine crowns stood on the green on 2026-09-08 — eye-turned leaf sprays,
solid lumps, crossed clusters, fin rosettes, fur shells, a marched volume,
scattered leaves, stacked tiers, tufts — and every one was judged laughably
bad against what the ask had named from the start: **the Skyrim tree, which
is a sprite sheet of branches.** All nine were taken out.

The crown is now a few dozen **branch cards**. At boot the game renders a
**branch sheet** (`art/branchSheet.ts`): eight whole branches, each a twig
with side twigs and two to three hundred leaves, built from geometry and
drawn face-on into one render target, red the leaf's tone under a light
from above, green marking wood, alpha the cut-out. No file, no texture
asset — the same rule the far-card atlas already lives by. A crown is then
one quad per twig, rooted a little way along it and pointing out along it,
plus thirty or so more rooted inside the envelope pointing out through its
skin, each 2.2–3 m long and wearing one tile of the sheet. **The density
comes from the picture**: hundreds of leaves a card, sixty cards a tree,
two triangles each.

**Fitting the tile.** A branch is drawn at four fifths of its tile about
the base, so it never reaches the tile's edge: a branch cut flat by the edge
is a square. And the cut-out is read from a sharp mip level — a far mip's
averaged alpha turns every card into a solid square too — while the colour
reads the proper one, un-premultiplied, since the empty texels round a leaf
are black.

**Conifers** are the same tech with a needle spray on the sheet's other
half: a straight lathe trunk, whorls of branch stubs from a quarter of the
way up, five to seven a whorl, each stub carrying one card whose length is
the branch's, shortening toward the top into the cone, drooping more at the
bottom; three short cards point up round the leader (`spruce`).

**The sheet has a kind of branch per family** — broadleaf, birch (small
round leaves on shoots that rise then hang), conifer (needled sprays), willow
(a broom of shoots running on up the card, so a card hung downward hangs
them) — six tiles each, and every species is a wood plus a kind: oak and
beech on the oak's wood in two forms, birch on a white pole with primaries,
willow on two leaning trunks with limbs whose cards point down and out,
spruce on the lathe with whorls. **Every card is pinned where it is built,
as a crossed pair on its twig**, one upright and one flat; nothing turns.

Each card **turns about its own branch axis** to face the eye (the axis in
the normal lane; the vertex shader swings the card's width vector round it),
so a branch is never seen on edge and never pinwheels — kept as the
`turn` option, and off for every species: from underneath, circling the
trunk, the twigs pointing at the eye swing fastest and the crown spins. The picture's holes
break every crossing between overlapping cards into leaf-shaped pieces,
which is how those games hide the crossings. A card is coloured from the
crown field per pixel, times the picture's tone, and bark where the picture
is wood; it casts with its holes, through the depth twin's own cut-out.

---

## 5. The trunk and the limbs

The trunk is looked at from arm's length on a village green, and the limbs
carry the cards, so the wood is grown rather than tabled (`art/limbs.ts`):

- **A lathe for the butt.** Ten sides, a row every half metre, buttress ribs
  at the foot fading out by a metre and a half, a taper, the spine's bend.
  Bark per face, kept within a few percent: a face this big reads any step
  as a patch.
- **Limbs as smooth swept tubes.** A limb is a curve through a few points,
  bending a little at random at each and pulled toward the sky by its
  species' lift, swept with a parallel-transported frame so the rings never
  twist, tapering linearly in radius. Its start ring sits inside its parent,
  so a fork is a fork; only its end is capped.
- **Grown recursively.** The trunk carries on above the lathe as the root
  limb and its leader; children leave a parent at a set angle off its
  tangent, spiralling round it at the golden angle so no two leave on one
  side, each as long as a fraction of its parent and each as thick as its
  share of the parent's cross-section where it leaves — da Vinci's rule,
  parent squared about the sum of the children squared, with the parent
  keeping a share to go on with. Three levels below the root; the last is
  the twigs the cards sit on. Nothing thinner than four centimetres.
- **Species are mostly a gravity setting**, which is what the growth models
  say too: oak limbs leave low and wide and lift a little; beech narrower
  and lifting more; birch fine and upswept until the twigs, which hang;
  willow out and up at the limbs and falling hard from there. The spruce
  keeps its lathe and whorls of stubs.

The dead trees keep their own hand-shaped limbs.

## 6. The canopy material

Built; this revision adds the card. What it does now:

- `MeshLambertMaterial({ vertexColors, side: DoubleSide })`, the normal from
  the attribute, never flipped for the back face, bent a little toward the
  sun so the terminator wraps.
- **The card turn.** In the shared vertex body: `card` is set when `aCard`
  is non-zero; the eye direction is taken from `cameraPosition` to the
  world root and carried into object space through the instance matrix's
  columns; the resting offset `position − aRoot` is rotated by the least
  rotation taking the vertex's normal to that direction, and `aCard.z` is
  added along it. Static fins keep `position − aRoot`. The rank
  shrink-and-grow scales the same offset, so a far card shrinks to its
  root like a fin.
- The stipple discard on `aCanopy.x`, lattice on the card for a card and in
  the world for a fin, cell scaled by `fwidth`.
- Backlight on `aCanopy.y`, one at an outer rim, zero in the core.
- The depth twin: cards face the light and cast; fins collapse.
- The seasons, the sway patch, aerial fog, the normal twin, the flat twin.

Its ledger is `position`, `normal`, `color`, `aCanopy`, `aWind`, `aRoot`,
`aCard`: seven lanes on its own material. `assembleCanopy` fills `aCard`
with zeros on any part that did not write it.

---

## 7. Colour

Per pixel, from the field of §4: top light from the crown ellipsoid's
normal, fading with depth; occlusion as a smooth ramp of depth in the
ellipsoid, about 0.65 at the core to 1 at the surface; value from a slow
grain over the crown. Nothing per leaf. Per tree, `instanceColor` from the
stand. Species palettes and seasons as built.

---

## 8. Wind

A tree is not one mass that leans. It is a trunk that barely moves, limbs
that each swing about their own base out of step with their neighbours, and
leaves that flutter faster than any of them. That is what the measurements
say (§18) and what every engine that gets trees right builds: a bend for the
whole, a lever per branch, a shimmer per leaf. The old wind was the first of
those alone, so the crown tilted as a block.

**What the physics says.** A 15–20 m broadleaf trunk swings at 0.26–0.34 Hz;
a 10–15 m one at roughly 0.3–0.5. Its base is pinned and the profile is a
cantilever's, growing toward the top. In a breeze the top travels under one
percent of the height; a gust is a quasi-static lean with remnant swing after
it. First-order limbs swing at about the trunk's frequency but each at its
own phase, and *each pivots at its own attachment* with the wood upstream
hardly deforming — the trunk's first mode is a rigid rotation of the upper
bole with the branches riding it. Successive branch orders sit a constant
factor higher, about 1.3 per order. Leaves flutter near 6–8 Hz and nearly as
much in a breeze as in a gale, while limb buffeting grows near the square of
the wind. Conifers are one dominant cantilever; broadleaves are many limbs in
near-resonance, which is why a broadleaf reads as its crown moving and a
spruce as its top nodding.

**What the engines do.** Crysis: a main bend polynomial in height, then
"detail bending" from vertex colours — a per-branch stiffness and phase, an
edge flutter — summed from four smoothed triangle waves. SpeedTree: global,
branch 1, branch 2, then leaf ripple and tumble, each level faster than the
one above. Unreal's Pivot Painter: every branch's pivot and direction baked
so it rotates as a rigid lever about its own base, inheriting its parent's
motion. All three agree on the shape: a bend for the tree, a lever per limb,
a shimmer per leaf, with phase unique per limb. A rubber tree is what you get
when the limbs share a phase or bend instead of pivoting.

**As built.** Nothing moves but by the wind. There is no wave on a clock
anywhere in it — no flutter sine, no leaf quiver — because every one of
those is motion the tree makes on its own, and a tree makes none. What
moves a limb at its own pace is the turbulence in the wind: the gust
field is the audio's and is too coarse to hold it, so on the CPU the wind
the levers answer is the field with eddies laid on it at a third of the
wind's strength, cells of two seconds, four fifths and a third, so still
air is still and a gale is rough. Every lever is a damped oscillator
driven by that wind: once a twelfth of a second it is sampled across the
same window the vertex shader reads, and twenty-one oscillators are
stepped through it from rest. Each row of `gustResponse` is one lever's
answer as a function of position along the wind, so a vertex reads its
lever's row at its own lag with one fetch, and the same gust that bends a
tree is the one that moves its limbs and quickens its rustle. One shared
GLSL chunk (`WIND_GLSL` in `sway.ts`) is compiled by the wood's material
and the canopy's, so a twig and the card on it are moved by the same
arithmetic.

- **Trunk**: the authored height weight times height along the wind, by the
  trunk's response — 0.35 Hz, damping 0.35, four frequency variants picked
  by the instance hash. The species' `FLEX` scales this alone, set so the
  village trees' tops travel two to four percent of height at full gust.
- **Limbs**: every first-level limb grown by `growLimb` is a *family* — a
  pivot at its base, a phase code, a `swing` per species — and every
  second-level limb a *sub-family* on it. A vertex packs its distance from
  each pivot times that swing into one float, 7+5+7+5 bits, in `aField.w`
  on the wood and `aWind.w` on the canopy (`packBranch` in `fields.ts`).
  The phase code picks one of eight variant rows (0.5 Hz, damping 0.3,
  spread 0.8–1.35×; sub-limbs 0.9 Hz, damping 0.35) and a trail of up to
  0.36 s behind the front, so limbs answer one eddy at different paces and
  lags — which is all that separates them, and all that separates real
  ones. Travel is the response along the wind; the swing about the lean
  (the wind smoothed over seconds) dips and lifts the limb at 0.6 of it;
  both scale by the root of the lean, since buffeting grows faster than
  the wind. A first-level oak limb's tip travels about 0.08 m per metre
  from its pivot at unit response, a birch's twice that. Travel is proportional to distance from the pivot,
  so a limb is a rigid lever and its base never leaves the trunk. The
  spruce has no grower, so each bough in a whorl is its own family off the
  trunk.
- **Cards**: ride their twig and nothing else.

Lobes and fins with no family keep the old per-cloud rock.

---

## 9. Instancing and distance

As built. The LOD rank is dealt across the outer shell. **Nothing thins inside
thirty metres, and a leaf never switches off**: past thirty, a leaf whose
rank passes the LOD shrinks to its root over a band of ranks, so walking
toward or round a tree never pops a leaf in or out. At eighty metres a
crown is twenty big leaves facing the eye, which is what a crown is at
eighty metres; past ninety it is one card from the atlas. The atlas is
rendered through the same vertex body, so its nine views show full clusters.

---

## 10. The builder contract

Unchanged in `assemble` and `finish`. The helpers:

```
cloud(rng, centre, radii, roughness)          → Cloud: an envelope piece, never a Part
leaves(rng, species, clouds, options)          → Part[]: cluster cards in shells, outer first
tufts(rng, species, clouds, options)           → Part[]: static fans for what must not dissolve
```

`leaves` takes `count`, `size` (outer radius range), `upward`, `lump`,
`shells` (the §4 table as default), `flag`, `colour`. A tree builder reads:

```
trunk, limbs, twigs = the structure of §5, each twig's tip returned
clouds = one per limb at its twigs' centroid, one over the top
return [ ...wood, ...leaves(rng, species, clouds, recipe) ]
```

---

## 11. The species

Each a recipe on the helpers. **The oak is built first and alone**, and
nothing else starts until it reads.

| Builder | Wood | Clouds | Cards | Notes |
|---|---|---|---|---|
| **oak** | §5 in full | one per limb, one crown | ~220, radius 0.7–1.1 | The broad crown |
| **birch** | one tapering lathe, lenticels as dark faces; 2–3 primaries | 2, tall, narrow | ~160, small, more dissolve | Airy: a thinner core |
| **spruce**, **small-spruce** | straight stem | none | tufts in whorls, as built | Unchanged |
| **pine** | leaning trunk, bare to two thirds | 2–3 flat clouds at the top | ~80 dark cards plus tufts | |
| **willow** | two leaning trunks | 3, low, wide | ~150, plus the trailing fins | |
| **hawthorn**, **small-oak**, **small-birch**, **small-tree**, **tree** | as §5, fewer levels | 1–2 | 60–110 | `tree` is the generic broadleaf |
| **fruit** | short trunk, low fork | 2, round | ~100, blossom and fruit by season | |
| **bush** | none | 1 | 30–50, small | |
| **thicket** | 3–5 arching stems | 2 small per stem | tufts along stems | |
| **gorse** | none | 3–5 small | tufts, dense; blossom cards | |
| **hedge** | stools | the swept profile as clouds, every other ring | cards over both faces and the top in the three shells, radius 0.2–0.35; the sweep is never drawn | The block was the hedge's green ball |
| **hazel**, **elder**, **bramble** | as now | 1 small | 20–30 | |
| **reeds**, **fern**, **nettle**, grass clumps | — | — | as now | Not touched |

---

## 12. Shadows, collision, edges

- **Shadows** come from trunks and from leaves facing the light. A crown's
  shadow is a soft lumpy mass. **A crown receives no shadow**: its leaves
  turn to the light to cast and to the eye to be seen, so the shadow map
  never lines up with what is drawn, and a crown that reads it shows sun
  dapple as bright dots through its leaves and patches that change as the
  eye moves. Its own shade is baked — the depth ramp and the borrowed
  normal — and that is what a crown's underside looks like anyway.
- **Collision** is the trunk mesh. The canopy child is `noCollide`.
- **Nothing screen-space touches a leaf.** The canopy's normal twin writes
  alpha 0 into the normal buffer, and the ambient occlusion pass returns
  full visibility wherever it finds that. Hundreds of leaves at hundreds of
  depths would otherwise speckle the crown black at every overlap, and the
  speckle would move with the eye.
- **Nothing view-dependent colours a leaf.** No backlight glow, no received
  shadow, no occlusion. A leaf's colour is baked at build and lit by the
  sun on its borrowed normal, and that is all; it looks the same from every
  side and from underneath. This is a stylised crown, not a simulation.

---

## 13. Budgets

| | Target |
|---|---|
| Hero oak | ~1,300 tris: wood ~1,200, sixty branch cards of two; the sheet is 2048×1024, rendered once a session |
| Small trees and bushes | 1,500–3,000 |
| Hedge | ~20 cards per metre |
| Overdraw on a crown | outer shell about twice, inner shells near zero, from the outer-first order |
| Shadow pass | trunks and cards, cards turned to the light |
| Past 90 m | 2 triangles |

---

## 14. Ways to get it wrong

- **Static planes.** A flat plane that does not turn is a sliver from most
  directions, and a crown of slivers is sparse however many there are. Every
  cluster turns to the eye.
- **A solid card.** A disc with a soft rim is a splotch, and two of them
  crossing draw a line. A cluster is overlapping leaf shapes.
- **A spray turned as one plane.** Two coplanar sprays at one depth cross
  along a line that slides through their leaves as the eye moves. Every leaf
  turns about its own centre.
- **A starburst.** Leaves radiating from the spray's centre make the centre
  visible and the spokes gappy: splotchy and sparse at once. Leaves are
  scattered at any bearing and overlap.
- **Any colour on a leaf.** Rolled per card, carried from a spray's root,
  or even sampled per leaf from a smooth field: two leaves at one pixel
  still differ, and they swap order constantly, so every crossing pops.
  The leaf carries no colour. The pixel is coloured from where it is.
- **Flutter on a leaf.** Moving leaves along their normals churns the
  order of every overlapping pair. Leaves bend and rock with their cloud;
  only the old static fins flutter.
- **View-aligned cards.** Right and up taken from the camera make every
  card pinwheel when the eye turns under the crown. The turn is the least
  rotation from the card's own resting frame.
- **Drawing the envelope.** In any form: a lobe, a block, a ball. The
  envelope is the space the cards fill and it is never a Part with a colour.
- **One shell.** Cards at one depth are a rim.
- **Turning the normal with the card.** The card is a sprite standing in for
  a piece of surface; it keeps the surface's normal from every angle, or the
  crown lights like a bag of coins.
- **A world-space stipple on a card.** The dissolve crawls through the
  cluster as the eye moves. The lattice is in card space.
- **Cards that do not face the light in the shadow pass.** They would cast
  slivers. The shadow pass runs the same turn with the light's view.
- **A crown that receives shadow, occlusion or glow.** See §12: dots and
  shifting patches. Anything computed per pixel from the view is off.
- **Sprays rolled on each cloud's own skin.** Most of that skin is inside
  the crown. Roll against the union.
- **Shape by discard.** The leaf's outline is its mesh. Any stipple on a
  leaf is white dots against the sky and black dots from the edge detector.
- **A rank of zero on a card.** It would never thin.
- **Thinning as a switch, or thinning close.** A leaf that is either there
  or not pops as its distance crosses the line, and a player circling a
  tree at twenty metres crosses that line for a different leaf every step.
  The shrink is a ramp and starts at thirty metres.
- **Strong depth darkening.** Two leaves at one distance from the eye but
  different depths in the envelope swap order as the eye moves, and the
  swap shows exactly their difference in tone. Depth darkens gently.
- **Inner shells written first.**
- **A stick under the crown.** The trunk is §5 or the tree is not done.
- **Sub-pixel wood.** Any rod, twig or stalk thinner than a pixel at the
  distance it is seen from is a scatter of single dark pixels, not a line.
  Four centimetres is the floor, and thin ends live inside sprays.
- **A card that leaks.** The far card's dissolve compared a hash against a
  reveal of zero with `>`, and a hash that lands on exactly zero passes:
  lone dark pixels of the card's picture in the air round every tree
  inside ninety metres. Under the card distance the card discards outright,
  and the test is `>=`.
- **Dissolving a leaf for winter.** A leaf is opaque; thinning it through
  the stipple puts pinholes in it, which are white pixels from below. A
  leaf shrinks to its root as the season turns; only the old static fins
  dissolve.
- **Dressing.** A tree builder makes a tree.

---

## 15. Not here

- No textures, no files. No alpha-to-coverage, no alpha test.
- No cylindrical billboards: they are edge-on from above, and the level has
  hills. No view-aligned spherical billboards either: they spin. The least
  rotation from the resting frame, always.
- No space-colonisation branching.
- No change to the groundcover system, the vista band or the `CLUTTER` cull.
- No leaf particles, no seasonal leaf fall.
- No checks, probes or instruments.

---

## 16. Order of work

1. **The spray and the oak.** `aCard`, the turn, the spray writer, the oak on
   the village green. **This is the phase the look is decided in; nothing
   else starts until it reads.**
2. **The species**, each a recipe; `lobe` and `fringe` deleted with their
   last caller.
3. **Hedge.** The sweep as envelope, cards over its faces.
4. Anything the look at 1 asked for that the material does not yet do.

---

## 17. Decisions

- **Every spray faces the eye** by the least rotation from its resting
  frame, about its root, in the vertex shader.
- **Cards cast**, turned to the light. No caster proxy.
- **Variants per zone**: four. **`cardAt`** is 90 m. **Winter bares the
  deciduous species**, as built.
- **The first oak was a new builder placed once**, accepted, and folded back
  to `oak`. The species that follow it are `TREES.md`.
- **Shell shares, radii, rim solidity and tones** are the §4 table until the
  first look says otherwise. They are a look, and the look is the owner's
  call.
- **Wind is three levers, not one bend**: trunk, limb, sub-limb, per §8,
  each a damped oscillator driven by the gust and never a wave on a clock.
  **No plant makes motion of its own**: no flutter sine, no leaf quiver;
  what moves a limb is the turbulence in the wind, a fraction of the wind
  itself, so still air is still.
  The limb data rides the fourth lane of the field attribute and the
  fourth of the canopy's wind lane, so no attribute is added.

---

## 18. Sources, read 2026-09-08

Wind, read 2026-09-09:

- **James, Haritos & Ades 2006 (Am. J. Bot.)** and James, *Role of
  branches in dynamic response*: a 19.7 m silver maple's trunk at 0.34 Hz
  with its four codominant limbs all at 0.33 Hz, out of phase — the
  multiple-mass damping that keeps a crown from swinging as one; crown
  damping ~10 %, a bare pole ~1 %.
- **Rodriguez, de Langre & Moulia 2008 (Am. J. Bot. 95:1523)**: the walnut
  finite-element modes — the trunk's first mode a rigid rotation of the
  upper bole with the branches riding it, branch modes bending the branch
  "with negligible deformation of upstream segments", and successive
  branch orders a constant factor (≈1.3) higher in frequency.
- **Spatz, Brüchert & Pfisterer 2007 (Am. J. Bot.)**: Douglas fir; all
  large branches near the tree's own frequency.
- **Jackson et al. 2019 (J. R. Soc. Interface) and 2021
  (Biogeosciences)**: conifers follow the cantilever law, broadleaves a
  pendulum; slender trees are one frequency; leaves lower the frequency
  and double the damping.
- **Tadrist et al. 2018 (J. R. Soc. Interface)**: leaves flutter near
  6–8 Hz from an onset of 1.35 m/s and hardly grow with the wind; branch
  buffeting grows as U^1.8 and takes over above 5 m/s.
- **Scots pine field sway** (9.5 and 13.5 m): under 2 cm and 5 cm at the
  crown at 4–8 m/s; a gust is a quasi-static lean followed by remnant
  oscillation.
- **GPU Gems 3 ch. 16, *Vegetation Procedural Animation and Shading in
  Crysis***: main bend in height, detail bend from vertex colours (edge
  stiffness, branch phase, branch stiffness), four smoothed triangle waves
  at 1.975, 0.793, 0.375 and 0.193.
- **SpeedTree Modeler docs, wind**: global → branch 1 → branch 2 → leaf
  ripple, tumble, twitch; "global frequency < branch < leaf".
- **Unreal Pivot Painter 2.0 docs**: per-element pivot, direction, parent
  index and depth baked to textures; each element a rigid lever about its
  pivot, solved per hierarchy level, inheriting the parent's motion.

- **GPU Gems 3 ch. 4, *Next-Generation SpeedTree Rendering*** (NVIDIA):
  leaf cards "always turn to face the camera, and as a result, they are all
  parallel to the view plane"; for the shadow map "they turn to face the
  light source and thus make good shadow casters"; LOD crossfades by a
  noise-thresholded "fizzle". The card turn, the shadow rule and the LOD
  here are this chapter's.
- **SpeedTree glossary / forums**: "Leaf cards are leaves that always
  billboard (face) the camera, which allows a SpeedTree to look very lush
  and full while having few leaf polygons." Leaf *meshes* are the static
  alternative and are used where a leaf must have a shape.
- **Oblivion tree recreation** (GameDev.net): "leaves are billboarded leaf
  clusters which rotate to face the camera … you won't ever see them from an
  angle, which helps maintain the lushness."
- **Airborn — Trees** (Simon Schreibt): the inner bubble's normals projected
  onto the leaf planes for "a very nice and soft shadow gradient all over the
  leafs"; the bubble culls the planes behind it; and the modern form, where
  "each quad face is unwrapped individually to 0–1 in uv space. The shader
  remaps the uv to −1 to 1 and is then multiplied with the view matrix" —
  per-quad billboarding about its own pivot. The normal rule and the turn
  in one place.
- **Polycount, *Smooth foliage like in Breath of the Wild* (Helder Pinto)**
  and the vertex-normal threads: normals transferred from a dome, "the cards
  are simple overlapping quads with no centre vertices"; a dome rather than a
  sphere so the underside still points somewhat out.
- **Quibli foliage shader**: "meshes always face the camera regardless of
  the camera's position and/or rotation"; per-face billboarding as a mode;
  a gradient over the cluster and a fresnel rim for the painted look.
- **Unreal forum, *Camera facing foliage for trees via material***: the
  pivot per cluster stored on the vertex, rotation about that pivot rather
  than the tree's origin.
- **Unity forum, *Leaf card billboards — camera facing matrix***: corner
  offsets stored per vertex and applied along side and up vectors built from
  the view; the open problem in that thread — shadows rendered toward the
  camera instead of the light — is what the depth twin's own turn avoids.
- **The Witness — Tree update**: trees "looked like a mess of triangles up
  close"; the fix was a shader that fades polygons as they go edge-on. The
  same problem, solved by hiding it; this spec solves it by never having an
  edge-on card.
- **Habrador, *Witness-style trees***: leaf planes emitted over a blob,
  normals edited to the blob so leaves "face outwards and upwards from the
  center of the tree."
- **ez-tree** (Codrops): leaves as two perpendicular quads at branch ends
  "to increase the fullness of the foliage and make the leaves visible from
  all angles" — the static compromise, and not enough here; the branch
  recursion and taper table are what the trunk's limbs follow.
- **Geeks3D, *Billboarding vertex shader***: spherical billboarding from the
  view matrix's rotation, cylindrical by keeping its up column. Spherical is
  the choice here.
- **Eastshade, *Foliage optimization in Unity***: fullness comes from
  coverage per card, not from more cards; overdraw is accepted; one material
  across the forest so groups merge.
- **Firewatch** (PC Gamer, GDC *The Art of Firewatch*): twenty-three
  hand-built trees placed 4,600 times; three wind bands — vertical sway,
  branch flap, leaf flutter; a custom shader for simplified, stylised
  foliage.
- **Crysis** (GPU Gems 3 ch. 16): the wind bands and the smooth triangle
  waves at 1.975/0.793 and 0.375/0.193, as built.
- **Cyanilux, *Soft Foliage***: `normalize(worldPos − objectOrigin)` as the
  normal on intersecting quads from a particle system; the borrowed normal
  in its simplest form.
