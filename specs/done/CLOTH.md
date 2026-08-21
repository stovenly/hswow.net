# Cloth — spec

**Built, C1 and C2.** `art/cloth.ts` is the sim, `art/clothMesh.ts` the
meshing, `engine/ClothActivity.ts` the driver, and `banner`, `hanging-banner`,
`flag` and `curtain` are the props. The fabrics gallery hangs off the general
hall.

**C3 and C4 are dropped.** C3 put simulated cloth on figures, which the
standing rule against cloth on rigged creatures rules out. C4 was always
conditional on C1–C3, and its one delight — a doorway curtain parting as you
walk through — is not worth a player capsule in the collider on its own.

A companion to [PARTICLES.md](PARTICLES.md) and the sway system in
`art/sway.ts`, and deliberately positioned between them: sway is stateless
displacement in the shader, particles are closed-form functions of the clock,
and cloth is the one thing in the game that earns **per-frame simulated state
on the CPU**. Section 1 is the argument for why this exception is real and why
it stays small.

Scope: hanging cloth. Banners strung between poles, vertical hanging banners,
flags, curtains over doorways, and one worn item per figure at most — a cloak,
a cape, a scarf. **Not clothing.** Tunics, sleeves and skirts are a different
problem (cloth pressed against a moving body over most of its area) and
nothing in this document is sized for it.

The one hard promise this document is organised around, because it is the one
thing that most breaks the read when it fails: **simulated cloth does not pass
through the body it hangs on.** A flag two metres away that swings a little
stiffly is fine. A cape whose corner slices through a figure's torso is not,
and every design choice below bends toward that guarantee.

---

## The rules this inherits

- **No texture assets, no external physics library.** The cloth is geometry
  built by the art kit and the simulation is a few hundred lines of plain
  arithmetic. Ammo, Rapier and friends bring a wasm build step, their own
  collision world to mirror ours into, and three orders of magnitude more
  solver than a dozen banners need.
- **One toggle.** A cloth-simulation switch in the options menu that actually
  turns the simulation on and off. Off does not mean "hidden behind the sway
  option" and does not mean the cloth vanishes — see §9.
- **One wind.** The gust that bends the trees is the gust that lifts the flag,
  by construction, because both read `Weather.fieldAt`. See §4 — this comes
  essentially for free and is the strongest reason to build cloth in this
  codebase rather than port a generic cloth demo into it.
- **A builder returns everything a prop is.** A flag builder returns the pole,
  the cloth panel and the simulation description from one call, exactly as a
  lantern returns geometry, light and glow.
- **Hand-placed and few.** Zones are small authored cells; cloth items are
  placed one at a time like every other prop. The budget in §8 is an authoring
  budget to stay inside, not a runtime system that manages overspend.

---

## 1. The shape of the decision: simulate, on the CPU, in position space

Three candidate mechanisms, and the choice is different from the one particles
made, for reasons worth stating.

**Extend the sway shader.** The banner already does this: authored weights pin
the fixings, the wind shader bends the belly. It is cheap and it stays one
draw call, and it is also fundamentally a *bend*, not a drape. A vertex
shader displacing each vertex independently by a function of position and time
cannot conserve edge lengths, so anything beyond a modest sway reads as rubber
sheeting; it cannot respond to gravity finding a new equilibrium when the wind
drops; and above all it cannot collide — the shader does not know where the
figure's shoulder is, and per-vertex distance checks against a set of
colliders in a patched Lambert vertex shader is exactly the kind of cost that
is paid by every vertex in the kit whether it is cloth or not. The sway
banner stays as the fallback tier, but it cannot grow into this feature.

**GPU simulation.** Ping-pong position textures in fragment shaders (WebGL2
has no compute). Real, and wrong here three times over: the scale is a
handful of cloths with a few hundred particles each, thousands of times below
where GPU residency pays; the wind field's source of truth is a CPU function,
and PARTICLES.md documents why reimplementing it GPU-side drifts; and
collision proxies live on the CPU, so the sim would be reading back or
mirroring state every frame anyway.

**CPU position-based dynamics.** Verlet integration plus constraint
projection — the standard small-cloth machine, and at this scale it is
genuinely small. The arithmetic: a strung banner is a 13×9 grid, 117
particles; structural, shear and bend constraints come to roughly five per
particle, ~600 constraints; at three substeps that is under 2,000 constraint
projections per cloth per frame. Eight active cloths is ~16,000 projections
of a few multiplies each — tens of microseconds in JavaScript, against a
frame budget where the triangle collider alone has cost whole milliseconds.
The per-frame buffer upload is a few kilobytes per cloth. This is not a
performance decision that needs care; it needs only a ceiling, and §8 sets
one.

Why position-based rather than force-based springs: explicit mass-spring
integration goes unstable exactly when fabric is stiff, and stiff is one of
the two fabric archetypes this feature exists to show. Projection is
unconditionally stable — a constraint that overshoots is corrected next
substep rather than compounding — and, decisively for the no-clipping
promise, **collision becomes a position projection too**: a particle found
inside a collider is *moved out*, every substep, unconditionally. There is no
force fighting a velocity; penetration is not discouraged, it is undone.

Contrast with PARTICLES.md §1, which rejected per-frame CPU state for
thousands of particles. Both decisions are the same principle: state costs
what the *count* costs. Six thousand snowflakes must be closed-form; a
hundred cloth particles may keep state, and cloth — whose whole visual
signature is memory, folds that persist, a hem that keeps swinging after the
gust has passed — is unrepresentable without it.

## 2. The simulation core

A leaf module, `art/cloth.ts` (name provisional), importable headless — plain
arrays and arithmetic, no renderer types in the sim itself, so `check:art`
can step it in node.

**Particles.** Flat arrays: current position, previous position, inverse
mass. Pinned particles have inverse mass zero and are *written* each step
from their attachment transform rather than integrated — which is also how a
cloth rides a moving carrier.

**Integration.** Verlet: `next = pos + (pos − prev) · damping + accel · dt²`.
Gravity always; wind per §4. Damping is a fabric property.

**Constraints, projected in order each substep:**

- *Structural* — each grid edge keeps its rest length. This is the fabric.
- *Shear* — cell diagonals. Without them a grid collapses sideways like a
  parallelogram linkage.
- *Bend* — distance constraints between second neighbours across each edge,
  at a per-fabric stiffness well below 1. This single knob is most of the
  difference between canvas and silk.
- *Tether* — each particle keeps a **maximum** (not exact) distance from its
  nearest pin: the straight-line slack it would have if the cloth hung taut.
  One cheap constraint per particle that eliminates the classic PBD failure
  where a hanging sheet stretches under its own weight for many iterations
  before converging. With tethers, one solver iteration per substep is
  enough.
- *Collision* — §5, last, so it has the final word on where a particle is.

**Time.** Fixed step with an accumulator: 60 Hz outer step, three substeps
(180 Hz inner). Substeps rather than solver iterations, on the XPBD result
that small steps buy stiffness faster than iterations do. The accumulator
clamps at three outer steps of debt and drops the rest — on a hitch the cloth
runs briefly in slow motion, which is invisible; a catch-up burst through a
huge dt is a cloth exploding, which is not. Fixed step also makes a run
deterministic for a given start state, which is what lets a headless check
assert anything at all.

## 3. Fabric — the `FLEX` of cloth

One table, `FABRICS`, in a leaf module beside `flex.ts`, for `flex.ts`'s
reason: the judgement is comparative. Whether sailcloth is stiffer than wool
is only answerable with the whole list in front of you. Builders name a
fabric; nothing tunes raw solver numbers at the call site.

Per fabric:

| property | what it is | what it does on screen |
| --- | --- | --- |
| `weight` | areal mass, relative | heavy cloth swings slow, settles fast, barely answers light air |
| `stiffness` | bend-constraint strength, 0..1 | the fold scale — canvas holds big slow curves, sheer cloth crumples fine |
| `drag` | wind force per area per relative speed | how much of the wind the cloth actually catches |
| `damping` | velocity retention | crisp snap versus underwater slosh |
| `thickness` | metres, both the drawn skin offset and the collision margin | dense cloth reads thick-edged; also load-bearing for §5 |

The two archetypes the table is tuned around, everything else interpolating:

- **`canvas`** — heavy and stiff. High weight, high stiffness, moderate drag,
  low damping loss. A canvas banner in a gust leans and bellies as one
  surface and takes seconds to settle. This is the strung banner and the
  vertical hanging banner.
- **`sheer`** — light and floppy. Low weight, low stiffness, high drag, more
  damping (thin cloth sheds energy to the air it drags). It ripples at fine
  scale, streams in wind, and a passing draught visibly disturbs it. Flags,
  scarves, a curtain over a doorway.

On *sheer* meaning translucent: not in this pass. The kit's one material has
no alpha and the quantized pipeline would have to dither it; thinness here is
sold by weight, motion and a near-zero thickness offset. If it ever matters,
screen-door transparency is a finish-stage question for
SHADERS-AND-MATERIALS.md, not a solver question.

`check:art` asserts every `FABRICS` entry is named by at least one builder
and every cloth-declaring builder names a real entry — `FLEX`'s typo rule:
absent from the table must fail loudly, because a misspelled fabric that
silently defaults is a banner made of the wrong material and nobody knows.

## 4. Wind — the part this codebase gets for free

A generic cloth demo drives its flag with `sin(t)`. This game already owns
something far better: `Weather.fieldAt` is a pure function of phase, already
sampled per emitter by the audio and per vertex by the sway shader through
the lookup texture. The cloth simulation, being CPU-side, simply calls
`weather.strengthAt(x, z)` at the cloth's position — the same call the
foliage audio makes. The gust front that you watch cross the valley bending
trees in sequence arrives at the flag on the same frame it arrives at the
tree beside it, and quickens the same rustle. No new coupling mechanism, no
LUT, no drift: one function call per cloth per frame.

Force model, per triangle rather than per particle, because wind loads area:
relative velocity `v = wind − particleVelocity`, project onto the triangle
normal, apply `drag · area · (v·n) · n` split to the corners. The projection
is what makes cloth behave unlike a tree: a surface square to the wind
catches everything, an edge-on surface nothing, so a flag *seeks* alignment
and then flutters about it — the flutter emerging from the dynamics rather
than from an authored sine, which is precisely the naturalness the sway
shader cannot fake.

Wind direction is `windDir` plus small value-noise wander in yaw and a touch
of vertical, seeded per cloth; the scalar field supplies gusting, the wander
keeps two adjacent flags from being mirror copies. Wind response scales with
the same composed `swayAmount` (player option × zone wind) the trees obey —
a reduced-motion world stills the flags too, and gravity still drapes them.

## 5. Collision — the no-clipping design

The promise restated: cloth does not pass through the body it hangs on, the
prop it is mounted on, or the ground.

**Analytic colliders only.** Spheres, capsules and the ground plane —
signed-distance shapes a particle can be pushed out of in a few multiplies.
Never the triangle octree: it exists for a player capsule, its cost profile
punishes dense queries (assemble.ts records a signboard's lettering costing
whole milliseconds against one capsule), and ~100 particles × 3 substeps ×
several colliders would be thousands of octree queries a frame for *worse*
robustness — a triangle soup has gaps and edges to tunnel through; a capsule
is airtight by definition.

A cloth carries its own short list of colliders, declared by the builder that
owns it (a figure's torso and head for a cape; a pole for a flag; a doorway's
jambs for a curtain), plus a ground plane. Half a dozen at most.

**Projection.** Last stage of every substep: signed distance of each particle
to each collider; any particle closer than `thickness + margin` is moved out
along the gradient to exactly that distance, with the tangential component of
its implied velocity kept and scaled by friction (so cloth slides down a
shoulder rather than sticking to it — and the *kept* tangential motion is
what makes a draped cape follow a turning figure believably). Position-level,
so there is no restitution to mistune and no force to overwhelm: at the end
of every substep, every particle is provably outside every collider.

**Particles out is not triangles out** — the honest gap in any
particle-based guarantee, and it is closed by margins rather than by
edge-collision tests:

- **The margin rule: collider inflation ≥ 0.6 × the cloth's rest spacing.**
  If adjacent particles both sit at least that far off the surface, the edge
  between them cannot sag through the real surface underneath. The knob is
  the *declared* collider, kept slightly fatter than the visible body — which
  the pixelated output at chunky resolution makes free, since a
  centimetre-odd standoff is under a rendered pixel at conversational range.
- **Colliders overlap.** A figure proxy is two or three capsules run
  well into each other — torso through neck through head. Gaps between
  colliders are where edges get through; the rule is no gaps, ever, even
  where the visible body narrows.
- **Displacement cap.** No particle moves more than half its rest spacing per
  substep (clamped between integrate and solve). Discrete stepping cannot
  tunnel if steps are smaller than the thinnest collider, and this bounds
  step size against exactly that. At 180 Hz inner rate the cap is far above
  any speed hanging cloth reaches, so it never visibly intervenes — it is
  purely the guarantee's backstop.
- **Carrier space.** A worn cloth simulates in its carrier's local frame,
  with world wind and gravity rotated in. The relative velocity between
  cloth and colliders is then only the cloth's own motion — a figure
  spinning or being teleported cannot sweep its colliders through the cloth,
  because in the frame that matters the colliders never move. Inertial
  forces from carrier acceleration are added, *clamped*, so a snapped turn
  swirls the cape without ever outrunning the displacement cap.

**Self-collision: none.** Real cost (pairwise or hashed proximity, every
substep) for a failure the design has already priced out of the common case:
coarse grids, bend stiffness, tethers and margins keep hanging cloth from
folding onto itself in ordinary wind, and at chunky resolution a brief
self-intersection in a flapping flag is a few pixels for a few frames.
Self-clipping is cloth lying about itself; body-clipping is the world lying
about the body — only the second breaks presence, and only the second is
paid for.

## 6. Meshing and rendering

**One dynamic mesh per cloth, skinned from the grid, two layers.** The sim is
the midplane; the drawn skin is a front and a back sheet offset ±`thickness/2`
along the local normal, plus a welded hem strip around the border. This keeps
`ART_MATERIAL` exactly as it is — front-side, flat-shaded, one patched
Lambert — rather than forcing a double-sided clone into the kit (a second
material is a second patch target and a second program, the precise thing
assemble.ts exists to avoid). It also gives dense fabric a visible edge,
which suits the chunky look. Cost: 2× triangles of a single sheet, ~400
triangles for the banner grid. Nothing.

Per frame, per awake cloth: write positions into a `DynamicDrawUsage`
attribute, recompute flat normals (the kit is un-indexed; face normal to
three corners, one pass), update the bounding sphere from the pins plus
tether reach. Colour, wear, detail and finish attributes are baked once at
build exactly as for any part; the sway attribute is zero — the shader then
leaves cloth alone and there is no double displacement.

**Shadows and outlines agree for free — the one place cloth is *simpler*
than sway.** Sway displaces in the shader and therefore had to patch the
depth material and the pixel pass's normal override too, or shadows and
outlines traced the undisplaced plant. Simulated cloth moves the actual
buffer; every pass that draws the mesh draws it where it is. Nothing to
patch, nothing to forget.

The cloth panel is a child mesh flagged `noCollide` (its triangles have no
business in the player collider's octree — the *prop's* static parts keep
their normal collision); the poles, rails and rings stay merged in the static
prop as always. Net render cost: one draw call per simulated cloth.

**Lettering rides the fabric** — the banner's words currently share baked
sway weights with the cloth, and that mechanism dies with shader sway. Its
replacement is a build-time skinning map: each lettering vertex is bound to
its nearest grid cell with barycentric weights and a normal offset, and
re-projected after each solve. A few hundred extra vertices transformed on
the CPU per frame; the words bend *with* the fold they sit on, which baked
weights only approximated.

## 7. The Figure — cape, scarf, and what Phase 7 needs

Worn cloth is one item per figure at most, and it attaches where the figure
already knows its own measurements:

- **Cape / cloak** — top row pinned across the shoulder line at the torso's
  measured back face; grid roughly 9×10 down to mid-calf; colliders: one
  torso capsule from hip to shoulder sized from `chest`/`halfDepth`, one
  head-and-neck capsule, overlapping. `canvas`-adjacent fabric.
- **Scarf** — a 3×12 strip pinned at the neck, both ends free. `sheer`,
  the liveliest thing in the set, and the best stress test of the margin
  rule because it lies directly on the smallest colliders.

The figure builder gains an export it should arguably have anyway: its
`Measurements` and a set of named collider capsules in `userData`, so worn
cloth (and eventually anything else) is placed against measured anatomy
rather than guessed offsets — the head-seating lesson generalised.

**Forward-compatibility with Phase 7 actors is a design input, not a wish.**
figure.ts already builds limbs about their own pivots for the jointed
version. Colliders are therefore declared *relative to a named node* (torso,
head), not in figure space; on today's static figure those nodes are the mesh
root, and when Phase 7 splits the figure into animated objects the capsules
ride their nodes with zero changes here. Carrier-space simulation (§5)
likewise keys off the attachment node's transform, so a patrolling NPC works
the day it exists. Until then, capes on standing figures still move — wind,
and the figure's own idle motion if Phase 7 adds it, are enough.

## 8. Budget and LOD

The authoring budget: **8 simultaneously awake cloths, ≤ 300 particles
each.** Comfortably: worst case ~2,400 particles × 3 substeps with ~6
constraint projections each is on the order of 50k cheap operations plus a
few kilobytes of buffer upload — well under half a millisecond of a frame,
alongside a collider that costs multiples of that. Zones are small authored
cells, so the count is a placement discipline, not an enforcement system; the
perf HUD gains a cloth line so exceeding it is visible the day it happens.

Waking is binary and boring on purpose:

- **Asleep** when its zone is inactive, or beyond ~40 m (where a banner is a
  few chunky pixels and motion reads as shimmer at best). Asleep means
  frozen in last pose — no integration, no upload. Not swapped to shader
  sway: a swap pops, and a still flag at forty metres reads fine.
- **Waking** runs a short settle (a dozen fixed steps, wind muted) before
  first draw if the pose is stale — a cloth frozen mid-gust and revealed
  minutes later in calm air should not resume a gust that no longer exists.
- At load, every cloth **pre-drapes**: settle steps from its rest shape so
  nothing is ever seen falling into place from a flat authored plane.

## 9. The toggle

One options entry: **cloth simulation, on or off,** in the menu beside the
sway option. Off freezes every cloth in its pre-draped settled pose —
present, natural, still — and skips simulation entirely. It is a real switch
over real work, not a gate on other settings. Orthogonally, the existing
sway/reduced-motion option scales cloth's *wind* response along with the
trees' (§4): sway off + cloth on = cloth that drapes and reacts to carriers
but sits in still air. Both compose without either becoming a no-op.

## 10. Testing

- **A fabrics gallery, first — a real gallery, with a door in the general
  hall.** `debug/galleries/fabrics.ts`, registered in `GALLERIES` and given
  its door off `ZONE_GENERAL_PROPS` in `debug/props.ts`, following the
  materials gallery: fabric belongs to no setting, so it hangs off the
  general hall like everything else that is a system rather than a place.
  `check:art`'s builder-coverage rule then guards it from both sides for
  free.

  The floor is a matrix, fabrics × implementations, so the comparative
  judgement `FABRICS` exists for can actually be made by walking a row:

  - *One row per implementation* — strung banner, vertical hanging banner,
    flag, doorway curtain — with the same implementation repeated in every
    fabric, so `canvas` and `sheer` differ only in the one thing being
    judged.
  - *A worn-cloth row* — stock figures wearing the cape and the scarf, one
    figure per fabric, deliberately across several seeds and head shapes so
    the collider capsules are exercised against varied anatomy. This row is
    the standing home of the no-clipping acceptance test: if a cape clips
    anywhere, it clips here first, in front of a wireframe toggle.

  Station controls: wind override (calm / breeze / gale), collider
  wireframes, and a freeze switch mirroring the options toggle. Rough
  fixtures throughout — stock builders at default seeds, no set dressing.
  All tuning happens here by looking at the rendered image under the
  reproduced wind regime, not by trusting solver numbers.
- **Headless checks in `check:art`.** The sim module is renderer-free, so
  node can step it: build each fabric's reference cloth against a standard
  capsule set, run N fixed steps under recorded gusty wind, assert — no
  NaN; no particle inside any collider at any substep boundary (the §5
  guarantee, mechanically enforced); max edge stretch under a per-fabric
  bound (the rubber test); settled pose within tolerance of a stored
  baseline (determinism, same shape as `audio/baselines.json`).
- **Table hygiene.** The `FABRICS` ↔ builder cross-check from §3.

## 11. Build order

- **C1 — the sim, the table, and the room.** `art/cloth.ts` core
  (particles, constraints, tethers, wind, collision projection), `FABRICS`
  with `canvas` and `sheer`, headless checks green, and the fabrics gallery
  stood up with its door in the general hall — near-empty at first, which
  is fine for a working room the way it is not for a shipped one. Done when
  a hard-coded test sheet drapes over a capsule at its station, no clipping
  at any wind setting.
- **C2 — hanging props.** Strung banner upgraded to simulation (lettering
  skinning included), vertical hanging banner, flag, doorway curtain; the
  gallery's implementation rows filled in across every fabric; sleep/wake
  and pre-drape; options toggle. Done when the banner reads *better* than
  its shader-sway ancestor at every wind level and the toggle freezes it
  cleanly.
- **C3 — worn cloth.** Figure measurements/collider export, cape and scarf,
  carrier-space sim, the gallery's worn-cloth row. Done when the row's
  scarfed and caped figures in gale-force wind show no body clipping across
  seeds and head shapes.
- **C4 — contact extras, only if earned.** Player capsule as a collider, so
  walking through a doorway curtain parts it — high delight per line, but
  it waits until C1–C3 have proven the margins. Flap/snap audio belongs to
  the sound-needs-an-object rule and would arrive with a specific prop, not
  speculatively.

## 12. Barriers, honestly

1. **The particles-out-vs-triangles-out gap** (§5) is the load-bearing risk.
   Margins, overlap and the displacement cap close it in the hanging-cloth
   regime; garments would reopen it, which is why they are out of scope.
2. **Stiff fabric on few iterations** wants to read as rubber. Tethers plus
   substeps are the standard cure; the gallery's gale setting is the
   acceptance test, judged by eye.
3. **Stateful simulation is new to this codebase** — everything else is a
   pure function of the clock, and the checks in §10 (fixed step,
   baselines) exist to keep the one stateful system testable anyway.
4. **Figure animation does not exist yet.** Worn cloth ships against static
   figures; the node-relative collider design is the bet that Phase 7 slots
   in rather than forcing a rework.
5. **A draw call and an upload per cloth** cuts against the merge-everything
   ethos. Bounded by the §8 budget and by hand placement; accepted.
