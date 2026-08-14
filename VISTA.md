# Vista builders — spec

**Mostly built.** Steps 1–7, 9 and band 1 of 11 are in; see *Shape of the work*
for what each turned into and *What is left* for what is not. This is the plan
for the out-of-bounds suite: a new family of
builders whose job is to be seen and never visited, the ground they stand on,
the helper that places them, and the checks that keep them cheap. Names of
individual builders below are working slugs, not decisions.

**The one-sentence version:** the world beyond the rim becomes a ring of
ultra-low-poly, heavily fogged, vertex-coloured geometry — built by the same
seeded builders, merged by the same `assemble` path, lit by the same sun — so
it relights under the planned day/night cycle for free and costs a handful of
draw calls.

## Why geometry and not any of the other tricks

The standard toolkit for fake distance is painted skyboxes, texture billboards,
and render-to-texture imposters. All three are ruled out here, each by a
constraint this project already committed to:

- **Painted skybox features** are frozen at one time of day. The sun will move
  (day/night is planned work); a mountain painted with west-lit slopes becomes
  a visible lie at dawn. The sky stays procedural (`engine/Sky.ts`), and
  anything with a *shape* becomes geometry the sun can act on.
- **Texture billboards** are only cheap because of their alpha-cut texture,
  and there are no textures in this project — `art/flower.ts` already
  litigated this and the verdict stands. A billboard tree without a texture is
  a quad that looks like a quad.
- **Imposters** solve a draw-call problem this scene will not have. The whole
  vista band budgets below what two birches cost today.

What is left is the technique that happens to fit the existing pipeline
exactly: low-poly meshes, vertex colours, one shared `ART_MATERIAL`, merged
hard. Fable's distant hills and Overwatch's Dorado coastline are this — real
geometry at reduced scale, hazed by fog, dense near the boundary and crude
past it. The pixelated 960×540 render is an ally: a twenty-triangle hut at
150 m covers a handful of pixels, and the dither does the rest.

## The three bands

The out-of-bounds world is three layers at three costs. This spec is chiefly
about band 2; the others are here so the seams between them are designed
rather than discovered.

| Band | Range (countryside) | What it is | Cost model |
|---|---|---|---|
| 1. Rim dressing | 30–48 m | Ordinary builders on and over the rim: boulder runs, hedge masses, a wall that wanders out of sight | Normal prop budgets — players stand next to it |
| 2. Vista band | 55–170 m | The new `vista` builders on a coarse ground skirt, merged into arc chunks | Tens of tris per prop, ≤ 6 draw calls total |
| 3. Sky ridge | infinity | A procedural ridgeline layer in `Sky.ts`'s shader, per-zone parameters | Fragment shader only, zero geometry |

Band 1 is placement work with builders that mostly exist, plus perhaps an
outcrop-run helper in the `wallRun` family. Band 3 is a `Sky.ts` change with
its own small design (seeded fBm silhouette bands above the horizon line,
coloured from the same uniforms the sun already drives). Neither needs this
spec's machinery; both need to exist for band 2's edges to disappear —
band 1 hides the seam where the skirt begins, band 3 catches the eye past
where the fog has dissolved band 2.

### Where the band's numbers come from

Nothing above is arbitrary; each edge is pinned by an existing system.

- **Inner edge, 55 m** (countryside): where *props* start, not where ground
  starts. The skirt runs underneath the level rather than butting against it
  (below), so there is no seam to hide and no dependence on the level's
  outline — today's terrain is a 96 m square because it is debug scaffolding,
  and finished levels will be shaped however they want to be. What pins the
  number is composition: the band begins past the rim crest (around 35 m,
  `inset: 13`) with margin enough that nothing out of bounds ever reads as
  somewhere you could walk to.
- **Outer edge, 170 m**: fog in the countryside runs 30 → 190, and past
  `fogFar` everything converges on the sky-horizon colour (fog is linked to
  the sky in `PostFX`) — geometry there is invisible and pure waste. 170 m is
  ~87 % fogged: a hazy silhouette, which is the look, and heavy enough haze to
  forgive any crudeness. Rule, not constant: **outer edge ≤ zone
  `fogFar` × 0.9**, the same headroom `PostFX` already uses.
- **The legibility ceiling is nearer than the visibility ceiling.** Past about
  75 % fog a mass is compressed into a narrow range around the horizon tint,
  and the retro pass then quantizes to `levels` (64) — a large low-contrast
  silhouette can land across two or three steps and contour, with the dither
  as the only thing hiding it. So anything whose *shape* has to read belongs
  inside ~75 % fog (≈145 m at countryside settings), and 75–90 % is fringe
  country: ribbons, and masses that only need to be a suggestion. An eyeball
  item, but one to design for rather than discover.
- The sky dome sits at `camera.far × 0.95` (475 at default). The band is
  nowhere near it and must stay that way.
- The view-distance slider clamps fog down (`fog.far = min(zone.fogFar,
  viewDistance × 0.9)`). At the 80 m stop the band is almost entirely inside
  solid fog. That is correct — the slider only ever removes world — and it is
  why the band must never be *load-bearing* for containment, only for looks.

## The builder contract

A new `BuilderCategory`: `'vista'`, added to `CATEGORY_ORDER` (last — the
gallery reads near-to-far). Vista builders are ordinary `MeshBuilder`s in
`src/art/builders/`, auto-registered like everything else. What makes them a
family is a stricter set of invariants:

- **`solid: false`, always.** Nothing out of bounds is ever collidable, and
  none of it goes near `markCollidable` or the collider's triangle index.
- **`sway: 0` on every part.** Sway amplitude is authored in metres at prop
  scale; on a quarter-scale hillside it would read as an earthquake. If
  distant canopy movement is ever wanted, it is a new, tiny amplitude decided
  on purpose — not inherited.
- **No wear, no detail fields.** Both are invisible at 100 m through fog. This
  saves no memory, and the spec should not pretend otherwise: `assemble`
  writes `wear`, `wearTint`, `detail` and `detailTint` on every vertex
  regardless, zero-filled, because `mergeGeometries` demands identical
  attribute sets. What it saves is build time and authoring attention. The
  whole band at full budget is ~1.7 MB of vertex data either way, which is why
  the ceiling below is a triangle count and not a byte count.
- **Never in the `CLUTTER` set** (`art/clutter.ts`). Clutter is distance-culled
  at `viewDistance × 0.75` — a vista prop tagged clutter would blink out at
  exactly the range it exists for. A check should assert this (below).
- **No shadows, either direction.** The sun's shadow box is ±48 m; the band is
  entirely outside it. `castShadow = false, receiveShadow = false` explicitly,
  so nothing depends on the box's current size.
- **Triangle ceiling: 300 per build, and most should sit well under 120.**
  For calibration: the current birch is ~3 000 triangles; the whole vista
  band should cost less than three birches.

### Authoring rules — silhouette first

A vista builder is judged at 100+ metres through 75–90 % fog on a 960×540
buffer. At that range:

- **Silhouette is the entire prop.** The outline against sky and the two or
  three big value masses are all that survives. Author the profile, not the
  surface. A forest mass is a lumpy skyline, not fifty trunks.
- **Value contrast over hue.** Fog compresses colour toward the horizon tint
  long before it compresses value. Two greens that differ only in hue merge;
  a dark mass against a pale field survives.
- **One displaced primitive is usually enough.** The `rock` builder's whole
  method — weld, displace along normals, squash — is the right grammar at
  this scale too. A hill is a displaced hemisphere; a forest mass is a row of
  displaced, overlapped blobs sharing one geometry.
- **Faceting is free style.** Flat shading on big triangles gives distant
  slopes the same faceted read as the in-bounds kit, so the two scales feel
  like one hand.
- **Interior colour patches beat interior geometry.** Field patchwork on a
  hill is the per-face colour-function trick from `Part.color`, at zero
  triangles. A window is a single pale face, not a frame.

### The initial roster (slugs provisional — naming is yours)

| Slug | Reads as | Tris (target) | Notes |
|---|---|---|---|
| `vista-hill` | A rounded hill, optional field patchwork | ≤ 120 | Displaced hemisphere, colour-function patches |
| `vista-crag` | A rocky rise / cliff face | ≤ 100 | The `rock` recipe, taller and meaner |
| `vista-forest` | A treeline / woodland mass | ≤ 200 | Overlapped dark blobs, ragged skyline |
| `vista-copse` | Three or four distinct tree lumps | ≤ 80 | Bridges band 1 trees and `vista-forest` |
| `vista-hamlet` | A cluster of far roofs and a chimney | ≤ 250 | Boxes and prisms; one warm face for a lit window |
| `vista-tower` | A single tall landmark | ≤ 80 | Prism + roof cone; the "what is *that*" object |
| `vista-field-wall` | A wall meandering over a distant slope | ≤ 60 | A ribbon draped over the skirt |
| `vista-range` | A far ridge line at the band's outer fringe | ≤ 40 | Flat silhouette ribbon — see the third note |

Four design notes on the roster:

- **This is one mass function and eight profiles, not eight builders.** The
  `rock` recipe — weld, displace along normals, squash, all from a seed —
  is the grammar for every entry in the table; what differs is the silhouette
  policy and the colour function laid over it. Lift that into one shared
  seeded helper before the second builder exists. It is what keeps the family
  reading as one hand, and it turns eight separate triangle-budget
  negotiations into one.

- **The landmark rule.** Every zone's vista should contain at least one
  *specific* thing — a tower, an odd crag, a distinctive roofline — because a
  band of generic hills reads as wallpaper and a single particular into the
  haze reads as a world. Fable's Lookout Point and Dark Souls both trade on
  the stronger form: the landmark is a real place the player later visits.
  The builders make that cheap — a vista-scale echo of a real zone is a
  hand-placed arrangement of these props, and which places deserve echoes is
  a fiction decision, i.e. yours.
- **Forced perspective is a placement fact, not a builder fact.** Builders are
  authored at honest size; the *illusion* of a 400 m mountain comes from
  placing a hill at 150 m at `scale` such that it subtends the right angle.
  The placer owns the lie (next section), so the same builder serves at any
  apparent distance. Precedent from inside Overwatch: Junkertown's scrapyard
  ceiling reads taller because its lamps were deliberately shrunk — the scale
  lie lives in placement there too. Scale is only half of it: walking exposes
  a shrunk-and-placed-near object unless it also moves, which is what the
  parallax below is for.
- **Flat silhouette ribbons are geometry, not billboards.** The billboard ban
  is about alpha-cut textures; an opaque vertical ribbon whose *outline is*
  the ridge needs none, and Overwatch's own backdrops are, in Klafke's words,
  "just a plane... copy-pasted around." Reserve ribbons for the outermost
  fringe (≥ 80 % fog, where a card's flatness cannot be read) and orient them
  tangent to the ring so no in-bounds position sees one edge-on.

## Placement — the vista ring

A zone opts in from its `build` with something in the spirit of:

```ts
vistaRing(zone, terrain, {
  seed,
  inner: 55,          // ≥ terrain half-size + margin
  outer: 170,         // ≤ fogFar × 0.9 — asserted, not trusted
  chunks: 6,          // 60° arcs
  skirt: { … },       // ground ring, below
  place: [ … ],       // hand-placed props: bearing, distance, scale, seed
  scatter: [ … ],     // seeded fills between them, same filter idiom as scatter()
});
```

Mechanics, in the order they matter:

- **Arc chunks are the merge unit.** Everything in one 60° arc — skirt sector
  included — merges into a single geometry via the existing "merged can merge
  again" property of `assemble` output. Three.js frustum-culls per object with
  no occlusion pass, so granularity is the only culling lever there is: one
  full ring would always be partially in frustum and never culled, where six
  arcs mean looking north draws two or three. Be honest about the size of that
  win, though — it is two or three draws saved out of six, and a 60° arc 115 m
  deep has a bounding sphere so large that culling is coarse anyway. Chunks
  earn their keep mainly as the rebuild-and-edit unit; the draw saving is a
  bonus. Same shape as groundcover's 24 m chunks, one level up.
- **Hand placement first, scatter second.** Landmarks and sightline
  composition are placed by bearing and distance (what you see from the main
  path is authored, per the way everything else here is authored); scatter
  fills the gaps between with forest masses and hills so no bearing is empty.
- **Continuity across a zone group.** Ilios' three arenas read as one island
  because the artists authored the surrounding vista to agree between stages
  — the backdrop is the connective tissue that keeps a transition from
  feeling like teleportation. Zones sharing a `group` should agree on their
  skyline: the same landmark at consistent bearings from each zone. Bearing
  agreement is data the placer can state and a check can read, not vibes.
- **Forced-perspective helper.** The placer converts `apparent: { distance,
  size }` into an actual `(distance, scale)` inside the band — a hill meant to
  read as 200 m tall at 600 m becomes a 50 m mesh at 150 m (scale ≈ 0.25).
  One helper so the arithmetic lives in one place and the illusion is
  consistent across props: **farther-seeming things are placed smaller AND
  higher-fogged**, which the linear fog does automatically once distance is
  right. `apparent` is what gets *stored*; the real distance and scale are
  derived, so retuning the band's radii later moves everything together
  instead of scrambling the composition — the same discipline that keeps
  portal arrival markers derived rather than written down.
- **Tagging:** merged chunks get `userData.vista` (so `ZoneManager.prepare`
  can exempt them from shadow assignment explicitly), `userData.noCollide`,
  never `userData.clutter`, and the triangle-range table the editor picks
  through (see *Fitting the editor*).
- **Residency:** vista chunks are part of the zone's root like any other
  geometry — built lazily on first entry, disposed with the zone. No new
  lifecycle.

### The skirt — ground for things to stand on

Beyond `SIZE`/2 there is no terrain: a vista hill at 100 m would float over
void, visible from any rim-adjacent high ground. The band therefore includes a
**skirt**: a coarse annulus of ground from the terrain edge out to the band's
outer radius.

- **It runs underneath, not up against.** The skirt is a coarse disc out to
  the band's outer radius, and where the level's own ground exists the skirt
  passes below it — the level is a lid laid on top. Only a collar of ten-odd
  metres either side of the level's boundary has to agree in height (sample
  `terrain.heightAt` there and blend); everywhere further in, the skirt is
  hidden and free to be wrong. This is what makes the skirt indifferent to the
  level's *outline* — square, ring or blob — which matters because the square
  terrain in the countryside is debug scaffolding, not a shape the finished
  levels are committed to. Butting a ring against a square would have left
  holes on the axes and overlaps into the corners; running underneath has no
  such case. Outside the collar the skirt falls into seeded rolling ground,
  broad noise at tens-of-metres wavelength.
- **Resolution is brutal:** something like 8–12 m between vertices. The skirt
  is value and silhouette, not walkable ground; it never enters the collider
  and `surfaceAt`/`groundAt` never consult it.
- **Painted, not covered:** field and meadow patches are vertex colour on the
  skirt itself (the terrain `PATCHES` idea without the groundcover stage). No
  cover, no footstep surfaces, nothing per-blade out there, ever.
- The skirt merges into its arc's chunk — it is not a separate draw.
- **The outer edge dissolves, never ends.** The last ring of skirt vertices
  sits past `fogFar` headroom, so the ground visibly fades into horizon
  colour rather than presenting a rim. If a zone's fog is ever pulled far
  enough that the edge could show, the world-check below catches it.

### Parallax — the other half of the lie

Scale alone does not sell distance, because walking exposes it. Cross 40 m of
the countryside and a hill placed at 150 m sweeps about 15° of bearing, where a
genuine 600 m hill sweeps about 4°. Fog says far, motion says near, and motion
wins. Source solves this by putting a miniature skybox at the camera; that is
not available here, because the band is honest geometry at an honest distance.

The fix is the one 2D games have always used — Terraria's background layers
scroll at a fraction of the camera's speed — generalised to three dimensions
and one line of arithmetic:

```ts
prop.position.xz = base.xz + k * (camera.position.xz - zoneOrigin.xz);
// k = 1 - actual / apparent  →  150 m posing as 600 m is k = 0.75
```

**Translate only, never rotate.** A prop that yaw-locks to the camera is a
skybox, and the moment the band stops holding still under a turn it stops being
a place. XZ only: vertical player travel is a few metres, and vertical slide
against the horizon line is the most detectable kind there is.

#### It is per object, and there are no tiers

This was first built as *tiers*: parallax applied to a whole merged group, with
props sorted into layers by apparent distance. That was wrong, and the reason it
was wrong is worth recording because it is a general trap.

The tier existed because **merged geometry cannot carry per-object transforms**
— an implementation constraint, which then got written down as though it were a
design principle, and a great deal of machinery grew to serve it: a tier axis in
the ring's data, clearance arithmetic between tiers, rules about which tier may
stand on legible ground, and a scheme for splitting a tier into regions so that
a clamp at one end of a long level would not freeze the other.

All of it dissolves once you notice **the parallax set is sparse**. A level has
perhaps ten hills, a tower, and a few masses past the horizon. Fifteen objects
is fifteen matrix updates a frame; there is no reason for them to share a
transform, and every reason not to.

With per-object `k`, the thing the tier scheme was protecting stops being a
problem at all. Two props at different apparent distances moving differently
against each other is not warping — **it is parallax**, and it is the depth cue.
The bunching that made tiers painful came entirely from forcing a group to move
as one body and then clamping it.

So the rule is one sentence: **merged means still, individual means moving.**
Nothing in the merged band parallaxes; anything that parallaxes is its own mesh.
The cost is roughly one draw call per moving prop, which is fifteen or so, and
the chunking they would otherwise have shared was buying weak frustum culling
anyway (see *Placement*).

#### The three boundaries

Everything about placement keys off signed distance to shapes, in the same
`PatchShape` vocabulary ground cover is painted with — a route, a rough circle,
a surveyed rectangle. That is what makes an L or an S cost nothing extra: the
band follows the bend because the distance field does.

- **Inner** — nothing closer than this is out of bounds. Far enough that nothing
  in the band ever reads as somewhere you could walk to.
- **Outer** — where the band stops, at or under `fogFar × 0.9`.
- **Keep-out** — the region a parallaxing prop may never be dragged into. For a
  compact level this is the outline dilated by whatever the still band reaches;
  for a bent one it is drawn by hand, because the interesting case is a shape no
  dilation produces. A Y-shaped level wants a keep-out spanning the cup between
  its arms, so nothing can be pulled across the inside of the bend and cut the
  sightline down either one.

#### Stopping, not sliding

A prop whose parallax would carry it into the keep-out **stops, at whatever
angle it arrived**. It does not slide along the boundary: projecting the offset
onto the allowed region changes the prop's bearing, which is exactly the
rearranging of the horizon that must not happen. Clamp the magnitude along the
offset's own direction and leave the direction alone.

Props already stopped become obstacles in their turn, so a prop being carried
toward one stops short of *it* rather than continuing to the keep-out behind it.
Resolved nearest-first, so the order is deterministic.

**Parallax saturates rather than warps.** Walk far enough and a prop simply
stops moving — which is indistinguishable from a prop that is genuinely very far
away, and that is what it is pretending to be. An arrangement that warps has no
such excuse.

#### Authoring is `apparent`, not `k`

A prop says how far away it should *read*; `k` is derived. That keeps the
composition together when the band's radii are retuned later, the same
discipline that keeps portal arrival markers derived rather than written down.

**Placement is assumed to be in good faith.** Two props that read as equally
distant but carry very different `apparent` values will drift against each
other and look wrong — and that is an authoring matter for the editor, not a
thing to guard against in code. The rest of this kit is hand-placed on the same
assumption.

To eyeball rather than trust: how much parallax is too much, and whether a prop
stopping dead against a keep-out is legible from inside the level.


## Fitting the editor

EDITOR.md's model is that a zone is a document of verbs and the editor edits
the document. The vista band has to arrive as one more entry kind —
`{ "vista": { … } }` — rather than as a system the editor cannot see. Four
things keep that door open, and three of them are free only if done now.

- **Ring options stay pure data.** No callbacks anywhere in the placer's
  signature. Today's `scatter()` takes `avoid` and `maxSlope` predicates; if
  the ring inherits that idiom it can never serialise. Radii, bearings, slope
  numbers and named shapes — rules as data.
- **The merge breaks picking, and only the merge can fix it.** A chunk is one
  mesh for fifty props, so `userData.entry` on the mesh cannot say which prop
  was clicked. While concatenating, record `{ start, count, entry }` triangle
  ranges per prop, and let a raycast's `faceIndex` binary-search that table.
  Cheap during the merge, impossible afterwards, and it generalises: every
  merged system this project adds will hit the same wall, and the same table
  lets `check:world` name the document line that put a prop underground. (The
  fallback — build the ring unmerged in editor mode — looks identical and
  costs only draw calls, but it means editing something other than what
  ships.)
- **Vista entries are authored in polar, so the inspector needs a second
  form.** Bearing, distance and apparent size, not XYZ — with the
  authored polar values stored and placement derived, per the helper above.
- **Parallax needs a freeze toggle.** With it live, flying the camera
  slides the world under the prop being placed. Freezing is inspection state,
  session-only, exactly like the layer-preview toggles.

Two things the band gets from the editor for free, worth noting because they
make vista authoring practical: the fly camera can go out into the band and
inspect a prop from arm's length, since nothing there is collidable; and a
snap-back to the spawn point at eye height is what makes that usable, because
vista work is edit-close, judge-far and the judgement is the part that counts.

## Budgets

| Thing | Budget |
|---|---|
| Draw calls, honest band (k = 0) | ≤ 6 (one per arc chunk) |
| Draw calls, the moving props | one each, and there are ten-odd of them |
| Triangles, whole band (skirt and moving props included) | ≤ 8 000 |
| Triangles, single vista builder | ≤ 300 hard, ≤ 120 typical |
| Collider triangles | 0 |
| Shadow casters | 0 |
| Lights, sounds, particles, cover | 0 |

The band is a picture. Anything that ticks, sways, glows, or collides has
crossed back into the world and belongs to a real zone. The one motion allowed
is the parallax slide, which is not the band doing something — it is the
band holding still at a distance it is only pretending to be.

## Ways to get it wrong

Mirroring `VIEW-DISTANCE.md`, the failure modes that would each look like a
different bug:

1. **A vista prop lands in the `CLUTTER` set** (say, by name collision or a
   copy-pasted builder file) → it distance-culls at `viewDistance × 0.75` and
   the horizon blinks. The art check must assert the intersection of vista
   builders and `CLUTTER` is empty.
2. **The band outlasts the fog.** If a zone's `fogFar` grows past the sky
   dome or the band's outer edge shrinks under the fog, either the skirt's
   raw edge shows or props pop against the horizon. Assert
   `band.outer ≤ fogFar × 0.9` per zone, alongside the existing
   fog/sky/far ordering checks in `check:world`.
3. **Somebody walks on it.** A future zone with a taller rim or a flying
   camera could expose the skirt as apparently-walkable ground. The skirt is
   not in the collider, so the failure is falling through the world at the
   zone boundary — which is exactly what `floor`/`respawn` already backstop,
   but the check suite should assert no vista geometry is ever collidable so
   the invariant is stated, not incidental.
4. **The normal pass doesn't know it's scenery.** Vista chunks are drawn in
   `PixelStage`'s normal pass like everything else, so the edge detector will
   outline them. Through 75–90 % fog that is probably *good* (a faint drawn
   line is very much this game's look) — but the sky/outline interaction has
   burned this project before, so it is called out for the eyeball pass
   rather than assumed.
5. **A prop slides where its feet show.** Anything parallaxing while standing
   on ground whose detail can be read drags its own footings across it, which
   is the one artefact nobody mistakes for anything else: the world swimming.
   It reads as a bug in the camera rather than a mistake in placement, so it
   will be looked for in the wrong file. Two things prevent it — moving props
   belong out where the ground has dissolved, and the ground under them should
   be flat, since a slide across level ground reveals nothing.
6. **Gallery shock.** Vista builders in the art gallery will look terrible at
   arm's length — that is the correct behaviour and not a bug to fix. The
   gallery checks coverage; *judgment* happens in the showcase (below), at
   distance, through fog, in a screenshot. Do not tune vista props from the
   gallery.

## Checks

Extend the existing harnesses rather than adding a new one:

- `check:art`: vista builders exist in category `'vista'`; each build ≤ 300
  triangles; `solid === false`; no vista name appears in `CLUTTER`.
- `check:world`: for every zone with a vista ring — band outer ≤
  `fogFar × 0.9`; chunk count and draw-call count match; zero vista triangles
  in the collider; band total ≤ 8 000 triangles; the skirt within tolerance of
  `terrain.heightAt` across the boundary collar; and no parallaxing prop whose
  slide can carry it inside the keep-out.

## The showcase

A `VistaShowcase` zone (registered like the others in `debug/zones.ts`): a
small viewing platform at origin, a full vista ring, and the countryside's
fog settings — so props are judged at the distance and haze they will
actually be seen at, and screenshots can be taken before any tuning. It
should include one deliberately unfogged bearing (fog pulled back on one
side, or a toggle in the `?debug` panel) so silhouette geometry can be
inspected raw when a prop reads wrong and the fault needs locating.

## Shape of the work

A workflow rule first, borrowed from how Overwatch actually builds these:
Klafke stood up Junkertown's backdrop in five minutes at blockout — a plane
copy-pasted around, "just to get a sense of the space" — and made the proper
one as the map's *last* art task. Same here: once the placer exists, any new
zone gets a placeholder ring on day one (default hills at rough scale, seed
whatever), and the considered pass — landmarks, bearings, tuning — is the
final dressing step, not a gate on the zone existing.

The order below applies that rule to this document: the first screenshot
arrives at step 2, before a single vista builder is authored, because
everything after it is tuning and tuning wants a picture.

**Done, with notes where the plan changed under contact.** Each step below is
marked; the reasoning is left as written even where the outcome differs, because
the difference is the useful part.

1. **The `'vista'` category and its checks, containing no art.** *(done, checks
   dropped.)*
   `CATEGORY_ORDER` entry; `check:art` asserting `solid === false`, ≤ 300
   triangles, zero sway, and no name shared with `CLUTTER`. Every builder that
   follows lands pre-constrained.
2. **`VistaShowcase` with a placeholder ring** *(done, then deleted as
   planned.)* The blockout settled the band's range and was replaced by step 6.
   **There is no rim in it.** A wall of hills high enough to turn the player
   back also stands in front of everything the band exists to show, so the
   boundary is an invisible plane and the ground stays flat right up to it.
3. **The skirt** *(done.)* A coarse sheet running *underneath* the level, collar
   blend at the boundary, painted, merged, one draw. It takes its colour from
   the level's own base material, or the boundary is a value step.
4. **`vista-hill` alone**, plus the shared mass helper. *(done.)*
5. **`vista-forest` and `vista-crag`.** *(done.)*
6. **The `vistaRing` placer proper.** *(done, but not polar.)* Arcs and bearings
   assume a level shaped like a bowl. Everything is written against a signed
   distance to an authored outline instead — see *Placement*. Entry range tables
   and tags are in; the apparent-size helper is not.
7. **Parallax.** *(built as tiers, being rebuilt per object.)* The offset and
   the freeze toggle are in and correct; the tier axis around them is being
   removed in favour of per-object `apparent` and the three boundaries — see
   *Parallax* above for why the tier was a mistake rather than a simplification.
8. **Countryside ring.** *(not started, and gated.)* That zone still has a
   `rim`, which the showcase has demonstrated is the wrong shape for a place
   with a view — it wants replacing before a band behind it is worth placing.
   Which bearings get landmarks is still a fiction decision.
9. **Roster back half** (`vista-hamlet`, `vista-tower`, `vista-copse`,
   `vista-field-wall`). *(done.)*
10. **`check:world` assertions.** *(dropped on purpose.)* These are debug
    worlds; the assertions cost more than they caught.
11. **Band 1 dressing** *(done — `world/dressing.ts`)* and **band 3 sky ridge**
    *(done — `SkyRidge` in `engine/Sky.ts`)*. The ridge really is the k = 1
    limit of step 7: the dome is centred on the camera, so it moves exactly
    with you and therefore reads as infinitely far.

## What is left

None of it blocking, all of it deliberate.

- **Per-object parallax, and the retirement of tiers.** Decided and specified
  above, not yet built: `apparent` on a placed prop deriving its own `k`, the
  keep-out boundary as an authored shape, stop-don't-slide clamping, and the
  deletion of the tier axis with its clearance arithmetic and region splitting.
  This subsumes the `apparent` helper, which was already outstanding — in the
  sparse model it is not a convenience, it is how parallax is authored.
- **The editor's half of the merge.** `vistaRing` records `{ start, count, name,
  seed }` per prop while concatenating and `vistaPropAt` binary-searches it, but
  nothing calls either yet: no picking, and no `{ "vista": … }` entry kind. The
  table was the part that becomes impossible to add later; reading it is not.
- **`vista-range`**, the flat silhouette ribbon in the roster table. Step 9 did
  not build it and band 3 covers most of what it was for.
- **The countryside**, per step 8.

## Needs an eyeball, still

The list at the end of this document, less what the showcase has answered.
Three that matter most, in the order they will bite:

- **How much parallax is too much**, and whether a prop stopping dead against a
  keep-out is legible from inside the level. The freeze toggle is the A/B.
- **Where the legibility ceiling actually falls** — walk a mass outward and find
  the range at which the quantizer starts contouring it.
- **Whether the skirt's grid holds up on the horizon.** It is 11 m in the
  showcase and was 9 m before the fog was pulled out to 240; the coarser it is,
  the nearer its facets start to show.

## Precedents — research notes

Compressed from the Fable / Kingdom Hearts / Overwatch research passes
(full reports and talk transcripts live outside the repo; ask if a claim
needs its source). Confidence noted where it matters.

- **Overwatch:** the backdrop is a named per-artist kit deliverable, built
  from planes and simple meshes; fog is the *explicit* signal separating
  playable space from scenery (Klafke, Digital Dragons 2018). Sightlines are
  capped by orienting architecture — archways, rooflines — because long views
  mean drawing more map; the layout itself is the occlusion tool (Keller,
  Ars Technica). Guidance kit: one main route as the mental spine, at most
  two-to-three height tiers, objectives as iconic landmarks, "paint with
  lights." No vista scale factors or budgets were ever published; the famous
  1/16-scale miniature skybox is a Source-engine convention, not confirmed
  for Overwatch.
- **Kingdom Hearts:** each room is a self-contained file with an *optional*
  per-room skybox (absent = black, used freely indoors) and its own
  occlusion tree — one room plus sky is the whole rendered world (OpenKH
  docs). Rooms deliberately over-scaled versus their film sources because
  honest dimensions cramped combat (KH1 Ultimania map team). Visible-but-
  unreachable landmarks as exploration bait; Destiny Islands' main island is
  backdrop-only, sold entirely by cutscenes.
- **Fable:** zone scope was numerically copied from Devil May Cry's ~82
  zones — size and average dwell time counted and matched (Dene Carter).
  Regions are corridor/pocket cells with 2–4 exits behind hard loads; the
  most-criticized trait was load *frequency*, the cautionary bound on how
  small cells can get. No technical teardown of its out-of-bounds shell
  exists; the rock-wall-and-vista-hills description is inference from
  footage.

## Needs an eyeball

- **Whether 55–170 m is the right band** for the countryside, or whether the
  inner edge should hug the rim tighter. Screenshot from the green, the arch,
  and the highest rim-adjacent hill.
- **Outlines on vista silhouettes** — good, too strong, or absent (way 4).
- **Whether six chunks is enough granularity** — measured in draw calls while
  spinning in place at the zone centre.
- **How the band behaves at the 80 m view-distance stop** — it should fade
  honestly into fog, not pop or band.
- **Whether the skirt's 8–12 m resolution holds up** on the horizon line, or
  facets too coarsely against the sky.
- **Where the legibility ceiling actually falls** — walk a mass outward and
  find the range at which the quantizer starts contouring it, then set the
  fringe boundary there instead of at the estimated 75 %.
- **How much parallax is too much** — k values compared side by side while
  walking a fixed path, watching for the point where a prop reads as sliding
  rather than as far away.
