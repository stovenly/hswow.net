# View distance — spec

**Built.** `PostFX` owns the number and derives the five values from it in one
place; `Sky.follow` sizes the dome off `camera.far`; `ZoneManager` collects the
clutter as it prepares a zone and culls it per frame; `Options.viewDistance` is
the slider and `apply.ts` turns its top stop into the null the engine wants.
`check:world` asserts the fog, the sky and the far plane stay ordered, that the
clamp only ever takes away — across all 28 zones at all 14 notches — and that
clutter is still worth culling.

Where building it disagreed with this document, the document has been corrected
and the correction is marked **[measured]**. There are three, and one of them
removed a whole phase of the work: the outline does *not* move with the far
plane, the sky dome cannot sit where §1 said it should, and clutter is a third
of an outdoor zone rather than most of it.

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
of it casts.

**[measured] About a third, not most, and only where something scatters.** The
countryside is 129 clutter meshes out of 431; the hub is 99 meshes and *none* of
them, because it is hand-placed buildings rather than a scattered field. So this
part of the option pays in the countryside and pays nothing in the village, where
what the far plane buys is ordinary frustum culling of props. `check:world` prints
both numbers, because the day a hub starts scattering is the day this changes. Those objects are already tagged — `art/assemble.ts` stamps
`userData.clutter` from the `CLUTTER` set, and `ZoneManager.prepare` already walks
the scene reading tags.

So: **hide clutter well before the far plane**, at some fraction of the view
distance. A per-frame distance test over tagged objects' bounding spheres is cheap,
and it removes the bulk of the object count rather than the bulk of the pixels —
which is the right thing to remove, because the pipeline is draw-call bound long
before it is fill bound at 960×540.

This is the part of the feature that will actually move the frame rate, and it is
driven by the slider rather than being the slider. It landed as `clutterCull`, a
fraction of the view distance, at 0.75 — far enough in to remove a real share of the
object count, far enough out that the grass goes while the fog is already most of
the way through hiding it.

`ZoneManager` collects the tagged meshes as it prepares a zone rather than walking
the graph each frame, and reads their positions straight out of the matrices the
renderer has already updated. Nothing about collision changes: `Collider` never asks
what is visible, so the grass you cannot see is still grass.

**Groundcover comes along for free**, and was not planned for. `art/cover.ts` builds
one instanced mesh per chunk with a real bounding sphere on it, so the far plane
frustum-culls whole chunks of blades with no code at all — the same win the props
get, on the system with the highest vertex count in the game.

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

**Fix: scale the dome from `camera.far`**, in `follow()`, which already runs once
a frame with the camera in hand and already re-centres the mesh.

**[measured] Not 0.8 of it — 0.95, and the reason is the normal pass.** The dome's
own material writes no depth, but `PixelStage` draws the scene a second time with
`scene.overrideMaterial` set to a `MeshNormalMaterial`, which does. So in the normal
buffer the dome is a solid sphere at its own radius, and anything standing *behind*
it there fails the depth test and keeps the sky's normals instead of its own — which
means no outline, or a wrong one, on geometry that is still plainly inside the
frustum. At 0.8 that band is 0.80–0.90 of the view distance, and the fog does not
reach it. At 0.95 the band is 0.90–0.95, which is entirely behind `FOG_HEADROOM` and
therefore already solid fog colour.

That is why the two fractions are stated together and checked against each other:
`FOG_HEADROOM < SKY_FRACTION < 1` is the whole rule, and every part of it fails
silently on its own.

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

### 3. The outline look moves with the slider — **[measured] it does not**

This was the subtle one, and it is arithmetically negligible. The edge detector
thresholds on **non-linear** depth — `smoothstep(0.01, 0.02, diff)` on raw buffer
values — so the worry was that changing `far` redistributes that non-linearity and
makes the same world-space step fire differently.

Window depth is

```
d(z) = (1/n − 1/z) / (1/n − 1/f)
```

and `far` appears only in that denominator. With `n = 0.1`, `1/n` is 10 and `1/f`
is between 0.002 and 0.025 across the entire slider — so the denominator moves from
9.998 to 9.975, and a surface at 20 m reads 0.995199 at `far = 500` against
0.997494 at `far = 40`. **A 0.23% change across the whole range.** The encoding is
dominated by the near plane, not by the far one.

So no threshold scaling was built, and none is owed. The coupling is real, measured
and three orders of magnitude below anything anybody could see.

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

1. ~~**`RenderSettings.viewDistance`** and a debug-panel folder~~ — the distance is
   the player's, so it sits in `Options` and the panel binds *that*, the way shadows
   and groundcover already do. What the preset kept is `clutterCull`, which is
   tuning rather than a preference.
2. ✅ **Derive and apply the five values** in one place in `PostFX.apply` — far, fog
   near/far, sky radius, clutter radius. One function, because these five going out
   of step with each other is every gotcha above.
3. ✅ **Sky dome radius from `camera.far`,** in `follow()`. Scaled rather than
   rebuilt. The normal pass is exactly where the first radius was wrong; see the
   correction in §1.
4. ✅ **Clutter distance cull**, over meshes collected at prepare time rather than
   found each frame.
5. ✅ **Edge thresholds** — measured, and they do not move. See §3.
6. ✅ **`Options.viewDistance`** and `setViewDistance()` in `apply.ts`.
7. **Read the cost off the existing readouts** — draw calls and frame time, in the
   village and in Water Showcase 2, at unlimited and at 80 m. Since the ground is a
   constant and cannot be culled, the number that should move is draw calls, and
   most of that movement should come from step 4. **Still owed**; the check suite
   can say how much clutter there is to cull but not what removing it buys.

## Deliberately not in the first version

- **Camera-relative shadow camera.** The largest win, and its own piece of work with
  its own shimmer problem. See above.
- **Per-zone overrides of the clamp.** Zones already say what they want through
  `ZoneAir`; the clamp reads that. A second knob would be two sources of truth.

## Needs an eyeball

- ~~**Whether the outline actually moves** with far~~ — settled by arithmetic
  instead. See §3.
- **Whether `clutterCull` at 0.75 is right.** Too tight and grass visibly evaporates
  ahead of the player; too loose and the option buys nothing. The debug panel has
  the dial beside the slider for exactly this.
- **Whether 40 m is usable or merely survivable** as the bottom of the range. The
  floor should still be a playable world, not a proof that the slider works.
- **What it actually buys**, in draw calls and frame time, in the countryside and in
  Water Showcase 2. Step 7 above.
