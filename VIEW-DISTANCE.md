# View distance — spec

Not built. Researched and specified.

**Short answer to the question that prompted it: yes.** Pulling the camera's far
plane in genuinely reduces how far a player can see *and* gets culling for free,
because three.js frustum-culls every object against the far plane along with the
other five. But the size of the win depends on what the scene is made of, and there
are four ways to get it wrong that would each look like a rendering bug. Both are
below.

## What it actually does

One number — the view distance in metres — drives five things:

| Derived from it | Effect |
|---|---|
| `camera.far` | Frustum culling, and depth precision |
| `fog.far` / `fog.near` | Hides the cut, so nothing pops at the boundary |
| Sky dome radius | Stops the dome being clipped out of existence |
| Clutter cull radius | The real culling win — see below |
| Shadow camera extent | Cheaper *and* sharper shadows — but see the caveat |

## The three wins, honestly sized

### Frustum culling — real, and it applies to props only

Three.js tests each object's bounding sphere against all six frustum planes, so a
shorter far plane culls more objects with no code at all. Props are individual
meshes and benefit immediately.

**The ground never will.** `Terrain.build()` returns a *single* mesh covering the
whole cell, and a single mesh is either drawn or not — its triangles are all
submitted regardless of how much of it is beyond the far plane. Same for
`flatGround`.

Chunking would fix that, and it is **deliberately not on the table**: levels here
are small, focused, hand-authored cells, not streamed terrain. So the ground's cost
is a constant this option cannot touch, and it is held by cell size instead — the
same budget `GROUNDCOVER.md` states for the same reason.

That is not a problem so much as a scoping fact: **this option is a prop and clutter
knob, not a terrain knob.** Sizing it against the wrong thing is how it would end up
looking like it does nothing.

### Clutter culling — this is where the win actually is

`art/clutter.ts` already states the case, about shadows: clutter is *"most of the
object count in an outdoor zone and almost none of the picture"*, which is why none
of it casts. Those objects are already tagged — `art/assemble.ts` stamps
`userData.clutter` from the `CLUTTER` set, and `ZoneManager.prepare` already walks
the scene reading tags.

So: **hide clutter well before the far plane**, at some fraction of the view
distance. A per-frame distance test over tagged objects' bounding spheres is cheap,
and it removes the bulk of the object count rather than the bulk of the pixels —
which is the right thing to remove, because the pipeline is draw-call bound long
before it is fill bound at 960×540.

This is the part of the feature that will actually move the frame rate, and it is
driven by the slider rather than being the slider.

### Depth precision — a quality win, not a performance one

The camera is `PerspectiveCamera(70, 1, 0.1, 500)` — a near:far ratio of 5000:1,
which is poor. Pulling far to 150 makes it 1500:1 and spreads far more of the depth
buffer's range across the distances anything is actually drawn at.

That matters here more than usual, because five things unproject from that depth
texture: the edge detector, GTAO, fog volumes, water and the underwater pass. All
of them get quieter at distance. **See the third gotcha, though — it cuts both
ways.**

### Shadows — the biggest win, but it is a separate change

The sun's shadow camera is a fixed orthographic box: `extent = 48`, `near = 55`,
`far = 225`, sized once to the village because that is the largest place in the
game. At 4096² over 96 m, one texel is 2.3 cm.

If view distance drops to 60 m, that box could shrink to match — 4096² over 60 m is
1.5 cm per texel, so shadows get **sharper and cheaper at the same time**, and fewer
casters fall inside the frustum.

**But the box is anchored at the world origin, not at the camera.** Shrinking it
would cut shadows off around a player standing away from the middle of the zone.
Sizing it to the view distance therefore requires making it camera-relative first,
which brings its own problem — an ortho shadow box that slides with the camera
shimmers unless it is snapped to texel boundaries.

So: the slider *enables* this win, it does not deliver it. Worth doing, worth being
its own piece of work, and out of scope for the first version.

## Four ways to get it wrong

### 1. The sky must not move at all — and naively it disappears

**Requirement: this slider never touches the sky.** Pulling the view in should
close the world down around the player; the sky is not part of the world in that
sense, and a horizon that retreats or a dome that vanishes would read as the setting
being broken rather than as distance.

Naively it does exactly that. `engine/Sky.ts` builds the dome at `RADIUS = 400`,
with a comment saying it is "comfortably inside the camera's far plane" — true at
the current far of 500, false the moment the slider moves.

`depthTest: false` and `frustumCulled: false` do **not** save it. Those disable the
depth test and three's CPU-side cull; neither has anything to do with the GPU
clipping geometry against the near and far planes. A dome at 400 with `far = 120` is
clipped away entirely and the sky is the clear colour.

**Fix: scale the dome from `camera.far`** — around 0.8 of it, in `follow()`, which
already runs once a frame with the camera in hand and already re-centres the mesh.

### Why that is a correctness fix and not a workaround

**The dome's radius has no effect on the picture.** Its vertex shader sets
`vDirection = position` and the fragment shader uses `normalize(vDirection)` — the
radius divides straight out. The dome is a gradient evaluated per view direction; it
has no parallax, no texture and no scale of any kind. Four hundred was an arbitrary
number that happened to be under an arbitrary far plane.

So this is not "shrink the sky to fit". It is tying a number that never meant
anything to the one constraint that acts on it, after which it cannot be wrong
again.

### Why a layer does not solve it

The obvious thought is to put the dome on its own layer and exempt it. It does not
work: **layers choose which objects a camera draws, not what it clips against.**
Near and far clipping is a property of the projection matrix, so the same camera
gives the same far plane to every layer it renders.

Exempting the sky would therefore mean a *second pass with a different projection* —
the shape `WaterEffect` already uses, but with a far-plane switch on top. It would
have to be done twice, in the colour pass and the normal pass, or the outline along
the horizon changes. Two extra scene traversals and two extra render calls per
frame, to move a number that does not affect the image.

### Why a small fixed dome does not solve it either

Also tempting, since the dome is camera-centred and writes no depth: a 2 m sphere
fills the screen just as well. In the colour pass. But `PostFX` adds it to the scene
proper, so `PixelStage` also draws it in the **normal pass**, where
`scene.overrideMaterial` swaps in a `MeshNormalMaterial` that *does* write depth. At
400 m it is a far backdrop everything paints over; at 2 m it would be nearer than
the entire world, and the normal buffer would be nothing but sky — taking GTAO and
every edge line in the game with it.

Fog is already `false` on the sky material, and the water's reflection reads
`skyColour()` analytically rather than sampling the dome, so neither follows the
radius and neither needs touching.

### 2. Fog has to track it, or there is a hard cut

Fog is linear `THREE.Fog`, with near and far coming from `ZoneAir` — 25/140
outdoors, 6/34 indoors, 90/300 in Water Showcase 2. If `fog.far` exceeds
`camera.far`, geometry vanishes mid-air while still partly visible.

So fog is clamped under the view distance with margin, and near is clamped under
far so it cannot invert:

```
fog.far  = min(zone.fogFar,  viewDistance × 0.9)
fog.near = min(zone.fogNear, fog.far × 0.6)
```

Worked through for Water Showcase 2 (90/300) at a 100 m setting: far becomes 90,
near becomes 54. For an ordinary outdoor zone (25/140) at the same setting: far
becomes 90, near stays 25 — the zone's own near survives, which is right.

`GTAO.setFog` is already fed these values by `PostFX` and follows for free.

### 3. The outline look moves with the slider

This is the subtle one. The edge detector thresholds on **non-linear** depth —
`smoothstep(0.01, 0.02, diff)` on raw buffer values. Changing `far` changes how
that non-linearity distributes, so the same world-space step produces a *different*
buffer difference. Pulling the far plane in makes distant edges fire harder.

That means a performance option would quietly change the art direction, which is
exactly the failure R0 was written to avoid. Either the thresholds scale with far
to hold the look constant, or the coupling is measured and accepted deliberately.
It must not be discovered later.

### 4. A metre value means nothing indoors

Zone fog ranges span 20 m to 300 m. A global "see 80 metres" is meaningless in a
dungeon room 12 m across, and `ZoneAir` exists precisely because the air belongs to
the place rather than to the game.

So the slider **clamps and never extends**. It can only pull the view in, never push
it past what the zone asked for. Indoors it is a no-op; in Water Showcase 2 it bites
hard, which is correct and is the test case.

This is the same shape as every other option here: layered over the tuning, never
written back.

## The slider

`Options.viewDistance`, in the Video tab, 40–300 m in 20 m steps, with the top stop
reading **unlimited** rather than a number — the pattern `fontSize` already uses for
its zero and `fpsCap` uses for "uncapped".

**Default: unlimited.** Unlike groundcover, where the default is a look, reducing
view distance only ever *removes* world. Nobody's game should change until they ask
for it, and the honest default is today's picture exactly.

```
format: (v) => (v >= MAX ? 'unlimited' : `${v} m`)
```

Applied through `PostFX` alongside the fog it has to stay consistent with, and
`camera.updateProjectionMatrix()` on change — which is cheap and happens on a
setting change, not per frame.

## Shape of the work

1. **`RenderSettings.viewDistance`** and a debug-panel folder, so it can be tuned
   before it is exposed.
2. **Derive and apply the five values** in one place in `PostFX.apply` — far, fog
   near/far, sky radius, clutter radius. One function, because these five going out
   of step with each other is every gotcha above.
3. **Sky dome radius from `camera.far`,** in `follow()`. Scale the existing mesh
   rather than rebuilding it. Check it in the normal pass as well as the colour
   one — that is where getting the radius wrong shows up as something other than a
   missing sky.
4. **Clutter distance cull.** A per-frame pass over objects tagged
   `userData.clutter`, toggling `visible`. Radius from the slider.
5. **Edge thresholds.** Measure whether the outline moves; scale
   `normalEdgeStrength` / `depthEdgeStrength` inputs against far if it does.
6. **`Options.viewDistance`** and `setViewDistance()` in `apply.ts`.
7. **Read the cost off the existing readouts** — draw calls and frame time, in the
   village and in Water Showcase 2, at unlimited and at 80 m. Since the ground is a
   constant and cannot be culled, the number that should move is draw calls, and
   most of that movement should come from step 4.

## Deliberately not in the first version

- **Camera-relative shadow camera.** The largest win, and its own piece of work with
  its own shimmer problem. See above.
- **Per-zone overrides of the clamp.** Zones already say what they want through
  `ZoneAir`; the clamp reads that. A second knob would be two sources of truth.

## Needs an eyeball

- **Whether the outline actually moves** with far, and by how much. Arithmetic says
  it should; only looking will say whether it is visible.
- **What fraction of view distance clutter should cull at.** Too tight and grass
  visibly evaporates ahead of the player; too loose and the option buys nothing.
- **Whether 40 m is usable or merely survivable** as the bottom of the range. The
  floor should still be a playable world, not a proof that the slider works.
