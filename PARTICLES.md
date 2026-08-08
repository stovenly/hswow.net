# Particles — spec

**P1 to P5 are built.** `art/particles.ts`, `engine/Particles.ts`, the layer, the
wind integral in `art/sway.ts`, and the showcase room off the general hall. P6
(props build their own) and P7 (weather on the environment) are not.

Where building it disagreed with this document, the document has been corrected
and the correction is marked **[measured]**. There are five. Two of them were
found only after the feature shipped invisible: the hardware depth test in §2,
which killed every fragment, and the room in §12, which stood its stations
further away than §3's own arithmetic says a particle can be seen from.

A companion to [SHADERS-AND-MATERIALS.md](SHADERS-AND-MATERIALS.md) rather than a section of it. That document
is the screen-space roadmap — things that happen to the frame after the scene is
drawn. Particles are *geometry*, drawn from the scene graph with a vertex shader,
and only the pass that composites them touches the effect chain. The two meet in
exactly one place and it is written down below.

Scope: snow, rain, ash, motes, smoke, steam, sparks, embers, spray, falling
leaves. One system, one material family, one draw call each.

Heat shimmer is **not** here. It is a screen-space distortion and it already has a
home — SHADERS-AND-MATERIALS.md §8 tier 1, R7 — and nothing in this document is waiting on it.

---

## The rules this inherits

From SHADERS-AND-MATERIALS.md's ground rules, unchanged, because they are properties of the
pipeline rather than of any one feature:

- **No texture assets.** A particle's shape is geometry or a shader; nothing here
  loads a file, and there is no sprite sheet anywhere in this design.
- **One toggle per effect, layered over the preset.** Tuning in `RenderSettings`,
  the switch on top, switching off never overwrites tuning.
- **Effects run in linear light, before `OutputPass`.** Particles are composited
  into the chain like any other effect, so the quantizer and the halftone treat a
  smoke gradient exactly as they treat a lit wall. That is the whole answer to
  "particles should get our existing visual style": they are not styled to match,
  they go through the same machine.

And one that is this document's own, from the art kit rather than the pipeline:
**a builder returns everything a prop is.** A lantern already returns geometry, a
`PointLight` and additive glow from one call. A forge that smokes should return
its smoke from the same call, for the same reason.

---

## 1. The shape of the decision: no simulation at all

**A particle's position is a closed-form function of its index and the clock.**
There is no per-frame update, no state buffer, no integration. The CPU sets one
uniform — the time — and the vertex shader works out where every particle is.

The two alternatives, and why neither wins here:

- **CPU simulation.** A JavaScript loop over several thousand particles, writing
  positions into an attribute every frame. The upload is not the problem; the loop
  is. Snow at the density this needs is three to six thousand particles, and that
  is a per-frame cost in the language that also runs the collider, the audio
  graph and the zone logic. It is the one budget in this project that is genuinely
  tight.
- **GPU ping-pong simulation.** Positions in a float target, advanced by a pass
  each frame. Fast, general, and it introduces *state* — which means a zone
  crossing has to reset it, a pause has to freeze it, a frame hitch integrates a
  giant `dt` and blows the field apart, and a screenshot is no longer reproducible
  from a seed. Every one of those is a small thing and there are a lot of them.

Statelessness makes all of them unrepresentable. It is the same argument
`ZoneDefinition` makes about geometry — everything is derived from a seed, so the
same seed always gives back the same object — extended along the time axis.

### What it buys, concretely

- **Zero CPU cost per frame.** One uniform write per system.
- **A zone crossing needs no thought.** There is nothing to reset, because there
  is nothing that remembers. The camera-following snow box arrives centred on the
  camera because it is *defined* as centred on the camera.
- **Pause is free**, and so is time scrubbing, which the day/night clock (R4a)
  will want.
- **Deterministic.** Two machines at the same clock draw the same frame.

### What it costs

No collision, no interaction, no flocking, no fluid. Snow does not settle on a
roof; a spark does not bounce off an anvil. Those are out, permanently, not just
in the first version — they are what statelessness buys its way out of.

And **no events.** A pure function of the clock has no moments in it, so nothing
here can be *fired*: a hammer strike cannot throw a burst of sparks timed to the
blow.

That is the right trade, because these are decoration. A fire throwing sparks is
not an event, it is a condition — it never stops, so every particle in it is just
`age = mod(t · rate + φ, life)` with its own phase, and a hundred and twenty of
them at staggered phases is a continuous shower with no beginning. The same is
true of every system in §5: smoke from a chimney, snow, spray off a weir. They are
all things a place is *doing*, not things that happen.

So the design holds **exactly zero mutable state.** There is no burst machinery
here, and its absence is the decision rather than an omission: a ring of slots
holding one float apiece would have worked and cost almost nothing, and it would
also have been the only thing in the whole system that a zone crossing could leave
dirty. §10 records exactly what it would take, for the day something asks.

### The motions you get

Statelessness means **you get the motions somebody wrote a closed form for.**
Adding a motion is deriving a new one, not calling into a different physics. Four
cover everything in the table in §5:

| Motion | Closed form | Used by |
|---|---|---|
| `fall` | `y = wrap(y₀ − v·t)`, xz wrapped about the camera | snow, rain, ash, motes |
| `ballistic` | `p = origin + v₀·age + ½g·age²`, `age = mod(t·rate + φ, life)` | sparks, spray, embers |
| `rise` | `p = origin + up·(v·age + ½a·age²) + swirl(age)`, size grows with age | smoke, steam |
| `tumble` | `fall`, plus a per-instance rotation linear in `t` | leaves |

`wrap` is the whole trick behind ambient weather: modulo the position into a box
centred on the camera, so a few thousand particles follow the player forever and
the box never has to be told the player moved.

---

## 2. How a particle is drawn

### The layer, and what one line of it removes

**`PARTICLE_LAYER = 5`, set exclusively** — `layers.set`, not `layers.enable`, so
layer 0 is cleared. This is the second exception to the additive rule in
`src/layers.ts`, and it is the same exception water is, for very nearly the same
reasons.

It was written here as 4, and 4 was taken by the groundcover between this
document and its first line of code. Read `src/layers.ts` before picking that
number; that file exists because bloom took layer 1, layer 1 was the collision
layer, and every flame in the game silently became a wall. The number comes from
the list or it comes from a bug.

Three things follow from one line, and all three are wanted:

- **No outline.** `PixelStage` builds its normal buffer by re-rendering the scene
  with `scene.overrideMaterial` set, using the camera's default mask; a particle
  off layer 0 is never in that pass. Which is correct, because a snowflake is one
  or two chunky pixels and an outline round a two-pixel white square is a dark
  square. The edge detector is what makes this world read as drawn; a flake is
  below the scale it operates at.
- **No hole in anything else's outline.** This is the subtler half. If particles
  *were* in the normal pass, a flake drifting across a hut's silhouette would
  break the hut's outline for a frame — a dashed line crawling along a roof
  ridge, with the cause nowhere near it.
- **No shadow.** Off layer 0 is out of the shadow map too. Snow that casts
  thousands of tiny shadows is not wanted, and smoke that casts one is a loss
  recorded in §10.

**The lights have to be told.** Not in this document's first draft, and it is the
one thing about the layer that does not follow from water's precedent: three
collects lights while projecting the scene, filtered by whether the *camera* can
see them — so a camera restricted to this layer collects none of the scene's
lights, and the material compiles against an empty list and draws every flake
black. `ZoneManager` enables `PARTICLE_LAYER` on the three world lights and on
every light it walks past in a zone, which is also what makes the forge light its
own embers without the forge knowing particles exist.

**Do not patch the particle displacement into `PixelStage.normalMaterial`.** The
sway system does exactly that — `applySway(this.pixelStage.normalMaterial)`, with
a comment about motionless ghosts — and the temptation to follow the precedent
here is strong and wrong. Sway wants outlines on displaced geometry. Particles
want no outlines at all, which is a layer, not a patch.

### The pass, and where it sits in the chain

A `ParticlesEffect` implementing `PixelEffect`, borrowing `WaterEffect`'s shape
exactly: blit the chain's colour forward into the next link, then re-render the
scene with the camera set to `PARTICLE_LAYER`, into that same target, with the
chain's colour and the stage's depth bound as uniforms. Three culls by layer
while building the render list, so it costs the particle draw calls and a
scene-graph walk.

Position in the chain:

```
GTAO ─► water ─► underwater ─► fog volumes ─► particles ─► bloom
```

- **After water.** Rain in front of a lake has to be in front of the lake. Water
  draws into the chain and would paint straight over anything already there, so a
  rainstorm over the sea would stop at the shoreline.
- **After the fog volumes**, and this one is not obvious. The fog march veils a
  pixel according to the *scene* depth at that pixel. A flake half a metre from
  your face, over a wall twenty metres away, would be veiled by twenty metres of
  mist. Drawn after, particles apply the scene's linear `THREE.Fog` themselves,
  per particle, at their own distance — which is right. The cost is recorded in
  §7: a placed mist volume does not veil the snow standing inside it.
- **Before bloom**, so an ember's halo is added, and because bloom's emitters pass
  reads a uniform this pass sets. See *Emissive*, below.

### The depth test is in the shader

The ping-pong targets carry a depth renderbuffer that nothing fills — `Water.ts`
says so in as many words. So hardware depth testing is off, depth writing is off,
and the test is done by hand: sample `tDepth` at `gl_FragCoord.xy / uResolution`,
unproject, compare, `discard` where the scene is nearer.

That is the same arrangement water already uses and it is not extra work, because
this shader has to read the scene depth anyway.

**[measured]** And hardware depth testing must be *off*, not merely unused. This
document originally reasoned that `depthTest: true` was free — the target's depth
is cleared and nothing writes it, so the test would always pass, and the same
flag would make a spark fail bloom's emitters pass where the real depth buffer is
attached. Every step of that is true except the premise. **The blit that opens
the pass is a full-screen quad, and a `ShaderMaterial` writes depth by default**,
so it stamps the near plane across the whole target immediately before the
particles are drawn against it. Every fragment of every system failed.

It cost a session to find, because nothing else was wrong: eleven draw calls went
out, the instance data was correct, the shader compiled, and the room was empty.
`WATER_MATERIAL` has carried `depthTest: false, depthWrite: false` since it was
written and says in as many words that it is not an oversight — the convention
was already there to be read. `check:art` now asserts every material drawn into
the chain matches it.

Nothing is lost by turning it off: the shader's own test runs in bloom's pass too
— `tDepth` is still bound and the emitters target is at the same resolution — so
a spark behind a wall still does not bloom through it.

Which brings the free part:

### Soft particles are the same subtraction

A billboard intersecting the ground draws a hard straight line across itself —
the single most recognisable tell of cheap particles. The fix is to fade alpha by
how close the particle is to the geometry behind it, and **the depth difference
that fade needs is the value the depth test just computed.** One subtract, one
`smoothstep`, over a fade distance of about 0.4 m.

It is in the first version. Something that costs two instructions and removes the
main visual tell of the technique is not a refinement.

### Two shapes, and both are instanced

One `InstancedBufferGeometry` per system, one draw call, with the base geometry
chosen per system:

- **Billboards** — a quad, turned to face the camera in the vertex shader, for
  anything at or near one chunky pixel: snow, rain, ash, sparks, spray, motes.
  It stretches along its own velocity by the shutter time; §3 derives how far,
  and why there is no separate streak shape.
- **Solids** — real low-poly geometry, kept in object space and rotated per
  instance, for anything big enough to have a silhouette: smoke puffs, falling
  leaves, embers you can see the shape of. An `IcosahedronGeometry(r, 0)` is
  twenty faces and it is *flat-shaded out of the palette* — which is what
  everything else in this world is made of. A soft round smoke sprite would be the
  one object in the game that is not faceted.

Both go through the same material and the same instancing. `shape` is a field on
the spec, not a second code path.

Per-instance data is baked rather than hashed off `gl_InstanceID`, even though
hashing is free and would let every system of the same shape share one geometry.
Sharing is the trap: `Zone.dispose` walks the graph disposing geometry, and a
shared buffer freed by one zone is missing from the next. Materials are already
an exception there for exactly this reason, and one exception is a rule with a
footnote while two is a rule nobody trusts.

**[measured]** It is not "a few kilobytes per system". Because there is one
shared material, everything that differs between systems has to travel on the
instance — the box, the gravity, the drag, the motion code — which comes to
seven attributes and **88 bytes per particle**: 230 kB for heavy rain, 580 kB for
the whole showcase. That is the price of the material being shared, and it is
still the right trade, because the alternative is a material per system and a
second disposal exception to remember.

### Lighting: patch Lambert, do not hand-roll

The material is a patched `MeshLambertMaterial`, exactly as `ART_MATERIAL` is,
with the motion written into `begin_vertex` exactly as sway is.

This is the whole answer to *"ideally the particles would get our existing shaders
and visual styles too"*, and it is nearly free:

- **Vertex colours** work, so particles are coloured out of `art/palette.ts` like
  everything else.
- **Fog** works — `fog: true` and three fills `fogColor`/`fogNear`/`fogFar` from
  the scene, so particles fade into distance haze on the same curve the walls do,
  and follow `ZoneAir` through every threshold with no wiring.
- **The scene's real lights** work. Hemisphere, sun and fill, which is what makes
  a smoke puff read as a volume rather than a grey blob — and *point lights*, so
  an ember drifting past a forge is lit by the forge. That last one is the thing
  a hand-rolled shader would have had to reimplement and would have got subtly
  wrong.
- **Flat shading** works, so a solid particle is faceted like its neighbours.

Hand-rolling the lighting means maintaining a second, worse copy of what three
already compiles, and it would drift from the real one the first time
`OUTDOOR_ENVIRONMENT` is retuned. It is the same argument `art/water.ts` makes for
importing `skyUniforms` instead of cloning them.

**The wrinkle this section warned about is not there.** It said Lambert shades
per vertex, so a four-vertex billboard would interpolate to mush and smoke-scale
quads would need a 3×3 subdivision. That was true of Lambert years ago; in the
version this project ships it shades **per fragment**, and `flatShading` takes
the normal from the derivative of the view position — so a solid is faceted with
no normals to rotate per instance, and a billboard is lit as the camera-facing
plate it is. Sixteen vertices per smoke puff, and the code to rotate their
normals, both turned out to be unnecessary.

### Emissive is one extra layer

An emissive system additionally calls `layers.enable(GLOW_LAYER)` and uses the
additive variant of the material. Bloom's emitters pass points a camera at that
layer, draws it against the scene's real depth attachment, and blurs it.

**Sparks bloom for free, correctly occluded, with no code in Bloom.ts.** That is
the payoff for the design already in place, and it is worth stating that nothing
had to be added to collect it.

Two details that make or break it:

- Bloom's emitters pass draws with each object's own material and has the *real*
  depth buffer attached, so a spark behind a wall fails the hardware test and
  never reaches the blur. Both depth tests then agree.
- The shader's own test reads `tDepth`, a uniform this pass sets. **Particles must
  therefore run before bloom in the chain** — which they do for the other reason
  as well, but this is the one that breaks silently if the order is ever changed.

---

## 3. The arithmetic that decides how this looks

Two thirds of whether a particle system looks good in *this* pipeline is decided
by numbers rather than by taste, because the render resolution is so low. Working
them out first is cheaper than tuning against them later.

### A flake is one chunky pixel at ten metres

At `pixelSize` 2 on a 1080p CSS surface at DPR 2, the chunky buffer is 960×540.
The camera's vertical FOV is 80°.

**[measured]** The first pass here divided the frame by the angle —
`540 / 1.396 ≈ 387` chunky pixels per radian — and that is the small-angle form,
which is 20% out at a frame this wide. The scale at the centre of the picture is
a tangent, not a ratio:

```
pixelsPerRadian = (height / 2) / tan(fov / 2) = 270 / tan(40°) = 321.8
```

which is what `projectionMatrix[5] × height / 2` computes, and what the code
ships. It is exact at the centre and an underestimate toward the edges.

A 3 cm snowflake at 10 m subtends `0.03 / 10 = 3.0` mrad, which is
`3.0 × 321.8 / 1000 = 0.97` chunky pixels.

So: **everything past about ten metres is sub-pixel** — and the corrected number
makes that stronger rather than weaker, since a flake crosses the one-pixel line
at 9.7 m rather than at 11.6. That is not a detail, it is the governing fact of
the whole design. Snow at 30 m is 0.32 of a pixel, and a 0.32-pixel primitive
rasterises to one pixel or to none depending on where its centre lands — which
changes every frame as the camera moves. Left alone, a snowfield past ten metres
is *static*, in the television sense.

### The sub-pixel fade

Clamp the projected size to a floor of one chunky pixel, and scale alpha by the
square of how much clamping was needed:

```
wanted = size / distance × pixelsPerRadian
drawn  = max(wanted, 1)
alpha *= (wanted / drawn)²
```

Energy is preserved: a flake that wanted to be 0.39 px wide is drawn one pixel
wide at 15% alpha instead of flickering between one pixel and none. The field goes
from static to a soft haze that thins with distance, which is what distant
snowfall looks like anyway.

This is standard practice and it is *load-bearing here* in a way it is not in a
full-resolution renderer, because our pixels are sixteen times bigger. It goes in
with the first system that moves, not later as a polish pass.

### A streak is a shutter time, not a parameter

Rain reads as streaks because a real camera integrates over an exposure. So derive
it rather than authoring it: the streak length is `speed × shutter`, with
`shutter` one number for the whole system, around 1/60 s.

Falls out correctly for everything:

- Rain at 8 m/s: 13 cm of travel, which at 10 m is 4.3 chunky pixels — a real
  streak, tapered by the same sub-pixel fade across its width.
- Snow at 1 m/s: 1.7 cm, well under a pixel at any distance. **No streak, from the
  same formula, with nothing switched off.**
- A spark at 6 m/s leaving an anvil: 10 cm, and it draws its own short trail.

One number, three behaviours, and the fast things streak because they are fast
rather than because somebody set a flag.

**[measured]** Which means `streak` was never a shape. Once the length is
`max(size, speed × shutter)` and the quad is built along its own screen-projected
velocity, a `quad` *is* a streak that happens to be moving slowly — so the two
merged, and `shape` now only distinguishes a billboard from real geometry. The
velocity comes from each motion's derivative rather than from differencing two
positions, which would have cost two more taps into the wind table.

**[measured] And the `speed` in that formula is the speed *on screen*, not in the
world.** Written with the world speed — which is what "13 cm of travel" naturally
suggests — the length is right in every direction except along the view, and
along the view it is catastrophically wrong: a drop falling straight toward the
camera keeps its full 13 cm while the direction it is stretched along degenerates
to noise, so looking up at rain gives sticks lying on their sides. A shutter
integrates the image, so the quantity is the velocity's component across the
image plane. Measured at three pitches, run height over width: **7.7 looking
level, 5.2 at forty-five degrees, and 1.01 looking straight up** — square dots,
which is what a drop coming at your eye is.

### Sorting, and why the quantizer pays for not doing it

Alpha-blended particles drawn in arbitrary order composite wrongly. The usual fix
is a per-frame back-to-front sort, which is CPU work over the whole set — the very
cost §1 exists to avoid.

It is skipped, and the pipeline is what makes that affordable. The output is
quantized to 16 levels per channel; a particle at 0.15 alpha contributes about a
sixth of a step. Two of them composited in the wrong order differ from the right
order by a *second-order* term in their alphas — comfortably under one level,
which is to say under the smallest difference this renderer can express. The
halftone then dithers whatever is left.

Three sorts *objects*, so systems still order correctly against each other, which
handles the case anybody would actually notice (a smoke plume in front of another
one). Within a system, order is arbitrary and unobservable.

If a system ever wants high per-particle alpha — thick smoke, a few large puffs —
that argument stops holding, and the answer is to keep the count low enough to
sort, not to sort everything. Recorded, not built.

---

## 4. Wind — the same gust, integrated

Particles answer `windUniforms`, the same block the trees, the grass and the
ponds read. Not a copy of it: the claim is that the gust bending the reeds is the
gust carrying the snow, and two sets of numbers cannot make that claim.
`art/water.ts` states this for water and it is the same statement.

### Instantaneous wind rubber-bands

The obvious implementation is to displace each particle by the wind strength
sampled at its position — one texture tap, and the sway shader already does
exactly that.

It is wrong here, and visibly. Sway displaces a plant that is *anchored*: the gust
arrives, the tree leans, the gust passes, the tree returns. Correct, because the
tree is a spring. A snowflake is not anchored to anything. Displacing it by the
instantaneous field makes the entire snowfield slide downwind as a gust passes and
slide *back* as it leaves — the whole world's snow on a rubber band. It reads
immediately as a shader effect, and it is the single most likely way this feature
ends up looking cheap.

What a flake actually does is retain everything the wind has already given it. Its
displacement is the **integral of the wind over its own age**, not the wind now.

### The prefix sum

The gust field is a pure function of one scalar phase, and `art/sway.ts` already
ships it to the GPU as a 256-texel 1-D lookup rebuilt every frame from
`Weather.fieldAt`. So its integral is a *prefix sum of that same table* — 256
additions, once a frame, next to the loop that is already there.

A particle then reads two texels and subtracts:

```
drift = (I(phase_now) − I(phase_now − age)) × windDir × drag
```

Exact, cheap, and correct by construction — the same reasoning that put the
lookup table there in the first place rather than reimplementing the noise in
GLSL. A gust *pushes* the snow downwind and the snow stays pushed.

**The integral texture must not be eight-bit.** The existing gust table is
`UnsignedByteType`, which is plenty for a strength; a running sum is not the same
animal. Consider a spark with a 0.8 s life: at the default `gustRate` 0.06 that is
0.048 gust-time units, and the window the table spans is about 1.87 — so the two
taps are six texels apart out of 256, and their difference is a couple of
quantization levels. The drift comes out as a staircase of two or three discrete
speeds. Snow, being long-lived, would have been fine, which is exactly what makes
this the kind of bug that ships. A `FloatType` table of 256 texels is one
kilobyte; take it and stop thinking about it.

Two approximations, stated. The phase a particle experiences depends on where it
*is*, and it moves; the lag is taken from where the particle is now rather than
integrated along its path. Over a snowflake's drift — metres — against a front
crossing the world at 9 m/s, that is a fraction of a texel.

And the window is about 31 seconds wide at the default gust rate, so a particle
older than that reaches past the start of the table and its lookup clamps. The
oldest flakes in a tall, slow box therefore share one drift instead of a spread
of them — a uniform offset, which the wrap absorbs, rather than a visible bunch.
A spark's 0.8 s reaches back 6.6 texels, which is the figure this section's
argument for a float table was built on, and it holds.

The manual interpolation is the one implementation note worth keeping: the table
is sampled `NearestFilter` and mixed in the shader by hand, because linear
filtering of a float texture is an extension and this is not. Four taps for the
whole of the wind.

### Drag is the one per-system number

`windDrag`, 0 to 1: how much of the air's motion the particle takes. Ash and
motes are 1 — they *are* the air. Snow is around 0.8. Rain is 0.15, because a
raindrop is heavy and falls nearly straight in anything short of a gale. Sparks
are 0.3 and short-lived enough that it hardly reads.

One number, and it is most of the difference between snow and rain before either
one's speed is set.

---

## 5. What a system is, as data

### The spec

Names are provisional; naming is content.

The built interface is in `art/particles.ts`; what follows is what it says and
where it departs from the sketch above it.

```ts
shape: 'billboard' | THREE.BufferGeometry;
motion: 'fall' | 'ballistic' | 'rise' | 'tumble';
volume:
  | { kind: 'follow'; size: THREE.Vector3 }   // carried by the camera
  | { kind: 'field'; size: THREE.Vector3 }    // the same box, standing still
  | { kind: 'emitter'; spread: number };      // the mesh's own position

export function createParticles(spec: ParticleSpec, seed?: number): THREE.Mesh;
```

Three departures, all of them small:

- **`streak` is gone**, for the reason §3 gives: it was a shutter time wearing a
  shape's clothes.
- **`field` is new.** A wrapped box that stands where its mesh stands rather than
  where the camera is. The wrap machinery is identical — only the centre differs
  — and without it a room cannot put snow and rain side by side and let you walk
  between them, which is most of what a showcase is for.
- **`emitter` lost its `origin`,** and `rate` went with it. The origin is the
  mesh's own position, which is what makes §6's "the prop builds its own" a
  one-liner; and the phases are spread evenly across `life` by index, which is
  what `rate` was for and is one fewer number to get wrong. Rolled phases clump,
  and a clump reads as a pulse.

### The table of systems worth having

Starting points, not tuned values. The counts assume a `follow` box of 40 × 20 ×
40 m for ambient systems.

All ten are built, and they stand in the showcase in this order. The counts are
the showcase's own — sized to an 11 × 12 × 11 m box you can walk into rather than
to a 40 m weather box, so a zone that wants real snowfall will want more.

| System | Shape | Motion | Count | Speed | Drag | Notes |
|---|---|---|---|---|---|---|
| **snow** | billboard | fall | 1400 | 0.8–1.4 | 0.8 | The reference case for §3. |
| **rain** | billboard | fall | 2600 | 7–9 | 0.15 | Streaks fall out of the shutter. |
| **ash** | billboard | fall | 700 | 0.2–0.5 | 1.0 | Grey, and it wanders. High turbulence. |
| **leaves** | solid | tumble | 220 | 0.6–1.0 | 0.9 | Quads spinning about their own axis. |
| **motes** | billboard | fall | 260 | 0.05–0.15 | 1.0 | Dust in a light shaft. Emissive. |
| **smoke** | solid | rise | 44 | 0.5–0.9 | 0.6 | Icosahedra, flat-shaded, growing with age. |
| **steam** | solid | rise | 30 | 0.8–1.2 | 0.6 | Smoke, paler and shorter-lived. |
| **sparks** | billboard | ballistic | 140 | 3–7 | 0.3 | Emissive. A fire throws these continuously. |
| **embers** | billboard | rise | 70 | 0.3–0.7 | 0.9 | Emissive, long-lived, drifts off a fire. |
| **spray** | billboard | ballistic | 240 | 1–3 | 0.5 | A weir, a shoreline. Wants R6's water. |

Every one of them is one draw call and under 25,000 vertices. For scale: Water
Showcase 2's open sea is a single 126,000-triangle draw call that already ships.

**All ten are continuous.** Nothing in the table starts or stops, which is what
lets §1 hold no state at all — and it is not a restriction that had to be worked
around, it is what these things are. A forge throws sparks the whole time it is
lit.

---

## 6. Where systems come from

Two tiers, and the split is the same one `ZoneDefinition` already draws between
`fogVolumes` and `ZoneEnvironment` — it just lands on the other side.

### Ambient weather belongs to the environment, and here is exactly why

`ZoneDefinition.fogVolumes` sits on the *definition* rather than in
`ZoneEnvironment`, and the documented reason is positions: a volume has a centre,
so it can be shared by nothing, and a mist pool declared in a constant that forty
zones spread would put the same pool at the same coordinates in all forty.

**An ambient particle system has no position at all.** Its box is carried by the
camera. That is precisely the property that makes it shareable, so it belongs in
`ZoneEnvironment` beside `fogColor` and `soundscape` — the things every place of a
kind has in common:

```ts
/**
 * What is falling here, if anything.
 *
 * In the environment rather than on the definition — the opposite of
 * `fogVolumes`, and for the opposite reason. Weather has no coordinates: its
 * volume is carried by the camera. So a snowy hillside and a snowy pass can
 * share one constant, which is the whole point of an environment.
 */
weather?: WeatherVisual;
```

Interiors declare none and get none, so snow does not fall indoors and nobody had
to write a rule saying so — an interior is a separate zone with a separate
environment, and the zone system has already answered the question.

### Placed emitters belong to the prop that makes them

A forge's sparks, a chimney's smoke, a candle's soot wisp, a weir's spray. These
have positions, and the position they have is *inside a prop*.

So they are built by the builder, exactly as glow and point lights already are.
`forge.ts` ends by pushing a `PointLight` and a `finishGlow` child into the mesh
it returns; it should push a `finishParticles` child in the same block:

```ts
mesh.add(finishGlow(glowGeometry, 'forge:glow'));
mesh.add(finishParticles(SMOKE, 'forge:smoke'));
```

Placing a forge then places its smoke. There is no second authoring step, no list
of plume positions to keep in step with the list of forge positions, and no way to
place one without the other. This is the same argument `Zone.hasWater` makes about
observing rather than declaring, arriving one step earlier.

`finishParticles` mirrors `finishGlow` and owes the same two flags:
`userData.noCollide = true`, because a builder returns one object and the caller
marks the whole thing solid — without it the player walks into the smoke and
stops — and `frustumCulled = false`, for the reason in §7.

### One intensity, heard and seen

`audio/models/rain.ts` exists and is good, and there has never been any rain to
look at — the same situation SHADERS-AND-MATERIALS.md §7 described for water, in reverse.

When they meet, **there must be one intensity, read by both.** A zone whose
soundscape declares rain at 0.6 and whose environment declares rain particles at
0.9 is two weathers sharing a room, which is the exact failure the entire wind
design was built to avoid, and it would be invisible in code. The rain visual
reads the rain emitter's intensity, or both read one figure on the zone; either
is fine and having two is not.

The coupling is only ever this shape — two *conditions* agreeing about one
number — because nothing here is an event. A forge's sparks and the `fire`
emitter beside them are both simply on while the forge is; neither is triggered,
so there is no moment for them to disagree about. Smoke is silent, correctly.

---

## 7. Where this goes wrong

Ten things, each of which produces a plausible-looking picture that is wrong.

1. **An instanced mesh gets frustum-culled by its base geometry's bounds.** Three
   computes the bounding sphere from the quad at the origin, knows nothing about
   where the instances are, and drops the entire system the moment that origin
   leaves the frustum. The symptom is a snowfield that vanishes when you look
   away from an arbitrary point in the world. **`frustumCulled = false`** on every
   particle mesh, set in `finishParticles` so it cannot be forgotten.

2. **Rain falls through water.** Particles die into the ground for free — a drop
   below the terrain is behind it from the camera's view and the shader's depth
   test discards it. Water is *not in the depth buffer* (`WATER_LAYER`, by
   design), so rain over a pond keeps falling to the bed and is visible through
   the surface. `WaterEffect` already caches every surface's level; hand the
   particle pass one `uKillBelow` and discard under it. **Still open** — the
   showcase has no water in it, so there is nowhere to see it yet, and it wants
   doing before any zone puts weather over a pond.

3. **Placed fog volumes do not veil particles.** A consequence of drawing after
   the fog march (§2). Distance fog is applied correctly and per particle; a mist
   pool with snow falling through it does not dim the snow. Accepted; the fix
   would be evaluating the volumes a second time in the particle shader.

4. **The underwater pass does not murk particles either**, for the same reason.
   Harmless for weather, wrong for the bubble system somebody will want. Bubbles
   need the murk uniforms `art/water.ts` already shares with `Underwater.ts` —
   which is a small piece of work and not a redesign.

5. **Particles do not reflect in water.** The reflection march reads the chain's
   colour as of the water pass, which is before this one. A smoke plume beside a
   pond is missing from the pond. Same shape as the documented bloom case, and a
   larger loss; recorded rather than solved.

6. **The wrap boundary pops.** A flake that wraps from the bottom of the box to
   the top reappears in mid-air, in frame, if you are looking up. Alpha ramps to
   zero over the outer 10% of every axis of the box. Cheap, and without it the
   feature has a visible seam that follows the player around.

7. **A camera-carried box has no notion of shelter.** Snow falls through an awning
   in an exterior zone, because the box knows only where the camera is. Interiors
   are safe (separate zone, no weather declared); anything roofed *outdoors* is
   not. The follow-up, not built: a raycast upward every few frames, fading the
   near field when it hits.

8. **Hashes take the index, never the clock.** `elapsed` is unbounded and lives in
   a 32-bit uniform. Terms continuous in time are fine at any runtime — a
   millisecond of precision at the one-hour mark moves a particle two
   millimetres. Feeding time into a `fract(sin(…) * 43758.5453)` hash is not
   fine, and it fails an hour in, in a session nobody is watching.

9. **An 8-bit prefix sum quantizes the drift into two speeds.** §4 has the
   arithmetic. Float texture, one kilobyte.

10. **Shared geometry outlives the zone that disposed it.** `Zone.dispose` walks
    the graph freeing geometry, and materials are already exempted by hand because
    they are shared. Give every system its own instanced buffer and there is no
    second exemption to remember.

---

## 8. Options

**No player video option.** By SHADERS-AND-MATERIALS.md's line — an option is something a
player may reasonably want off while the world still reads as itself — snow in a
snowy zone is the place, like a pond or a mist pool. Tuning lives in
`RenderSettings.particles` (`density`, `size`, `shutter`) with a dev-panel folder
and a dev toggle, per the standing four-things rule.

If one is ever wanted it should be a **density scale, never an on/off**, because
off deletes the weather rather than the flourish.

**Reduced motion is different, and this one does cross the line.** Snow falling
across the whole frame is exactly the constant peripheral motion that switch
exists for, and it is a stronger case than wind sway.

The trap is that there is **no still version of falling snow.** Waves can hold
still and the pond is still a pond; head bob can stop and you are still walking.
Snow that holds still is snow hanging in the air, which is worse than either
state. So this is an honest toggle that removes the particles — `precipitation`,
in the accessibility tab beside `waterMotion` and `headBob`, held by
`reducedMotion` like the rest. Built, and reading *falling weather* in the menu.

A system opts in with `weather: true`, and the switch collapses those instances
to zero size in the vertex shader rather than hiding a mesh — with one shared
material there is nothing per-system to hide, and a zero-area quad covers no
pixels. Their vertices still run, which is the honest cost of the sharing.

That costs the zone something real, and it is the right trade: a mist pool does
not move, so switching it off would be pure loss; weather is nothing *but*
motion, so a player who cannot tolerate the motion cannot have the weather. **The
distinction is that motion is what makes a particle an accessibility question and
a fog volume not one.**

Smoke and sparks stay. They are small, local, and looked at rather than looked
through.

---

## 9. Cost

Read off the existing draw-call and frame readouts, per the standing rule. The
budget, before anything is measured:

- **Draw calls: one per active system.** Two or three in a dressed outdoor zone —
  weather, plus a chimney and a forge. Against a documented ceiling that
  SCALING.md puts in the hundreds, this is noise. The showcase is the outlier at
  eleven, and it is a showcase.
- **Vertices: 12,000 for snow at 3,000 particles**, 24,000 for heavy rain. The sea
  in Water Showcase 2 is 126,000 triangles in one call and already ships.
- **Memory: 88 bytes per particle** — see §2. The showcase's 6,600 instances are
  580 kB of instance data across eleven buffers.
- **Fill: negligible, and §3 is why.** A 3 cm flake is one chunky pixel past ten
  metres, so 3,000 of them cover a few thousand of 518,400 pixels. Even at the
  minimum-size clamp the whole snowfield is under 1% of the frame. The systems
  that could actually cost fill are the large soft ones — a smoke plume filling a
  quarter of the frame at 40 puffs is 40 overdraws of that quarter, which is the
  one number in this document genuinely worth measuring.
- **CPU: one uniform write per system per frame**, plus 256 additions for the
  wind integral.

---

## 10. Deliberately not in the first version

- **Collision and accumulation.** Snow settling, sparks bouncing, rain pooling.
  Ruled out by §1, permanently, not deferred.
- **Event bursts.** A volley of sparks timed to a hammer blow, a puff of dust
  under a landing. Everything in §5 is a condition rather than an event, so
  nothing needs this today. What it would take, if it is ever wanted: a ring of
  **N slots per system, each one float — the time that burst began** — with
  particle `i` reading slot `i % N`. Firing writes one number and the burst is
  analytic from there; overlapping bursts overwrite the oldest, so the ninth cuts
  the first short. Small, and worth naming precisely, because the cost is not the
  code. It is that the design stops being stateless, and everything §1 lists under
  *what it buys* would then need a sentence apiece rather than none.
- **Ground splashes and decals.** Rain that lands wants a splash where it lands,
  and that is a second system keyed to the surface — which the *audio* rain model
  already understands (`RainSurface`: canopy, stone, earth, water) and would be
  the natural source of truth for. Worth doing, worth being its own piece of work.
- **Particle shadows.** Off layer 0 means out of the shadow map. Smoke that
  shadows would be a real gain and needs a second draw with a depth material,
  which is most of the cost of the feature for one system.
- **Lit smoke.** Lambert gives a puff the sun and the room; what it does not give
  is the puff self-shadowing or a torch scattering through it. Same trade
  SHADERS-AND-MATERIALS.md §2 makes for fog volumes, and the same answer: the tint is chosen for
  the scene.
- **Per-particle sorting.** §3 has the argument and the escape hatch.
- **A GPU simulation tier.** If something one day genuinely needs state, it is a
  second backend behind the same `ParticleSpec`, not a rewrite of this one.

---

## 11. Needs an eye

Everything in §3 is arithmetic and can be checked headlessly. Everything below
cannot, and no phase gated on it is closed by "it builds."

Every one of these is still open — nothing below has been looked at, and the
suites passing says nothing about any of it.

- **Whether 1,400 flakes in an 11 m box is snowfall or drizzle.** The count is
  derived from a box volume and a guess at how much of it is on screen. It is the
  first number to be wrong.
- **Whether a lit lantern actually reaches the snow beside it.** The lights are
  on the particle layer and the material is Lambert, so it should; the thing to
  look for is a flake brightening as it passes the lamp rather than the whole
  field lifting.
- **Whether the wrapped box's seam shows.** The fade runs over the outer 18% of
  every axis rather than the 10% this document first proposed, on the reasoning
  that the vertical re-entry is the one you can be looking straight at. Only
  standing under it and looking up settles whether that is enough or too much.
- **Whether the sub-pixel fade reads as haze or as dirt.** The maths says the
  energy is right; only looking says whether a field of 15%-alpha dots at thirty
  metres looks like weather or like a smeared lens.
- **Whether faceted smoke works at all.** It is the most opinionated call in this
  document — every other engine makes smoke soft, and the argument here is that a
  soft sprite would be the one unfaceted object in the game. It might read as
  rocks floating out of a chimney. Worth finding out in P4 rather than after eight
  systems are built on it.
- **How much turbulence a plume wants** before it stops being a fountain and
  starts being smoke.
- **Whether sparks bloom too hard.** Bloom's strength settled at 0.28 against
  single-texel flames that do not move; a hundred and twenty moving ones is a
  different picture, and the knob that has to give may be the spark's, not
  bloom's.

---

## 12. Phases

**P** for particles, deliberately not R — this sits beside SHADERS-AND-MATERIALS.md's render
phases rather than inside them. P1 blocks everything; after that the order can
bend.

Every phase lands the four things SHADERS-AND-MATERIALS.md already requires and this document
does not restate: its tuning block in `RenderSettings`, one honest toggle layered
over the preset, a dev-panel folder, and its cost read off the existing readouts.

| | Phase | Touches | Gate |
|---|---|---|---|
| **P1** ✔ | The layer, the pass, the material | `layers.ts`, `engine/Particles.ts`, `art/particles.ts`, `PostFX.ts` | check ✔ + **eye** |
| **P2** ✔ | Fall, wrap, and the showcase | `art/particles.ts`, `debug/ParticleShowcase.ts` | **eye** |
| **P3** ✔ | Wind, integrated | `art/sway.ts`, `art/particles.ts` | **eye** |
| **P4** ✔ | Solids, and lit smoke | `art/particles.ts` | **eye** |
| **P5** ✔ | Emissive, and the ballistic motion | `art/particles.ts`, `layers.ts` | **eye** |
| **P6** | Props build their own | `builders/forge.ts`, `builders/*`, `art/particles.ts` | check + **eye** |
| **P7** | Weather on the environment | `world/Zone.ts`, `ZoneManager.ts`, `main.ts` | **eye** + **ear** |

P1 to P5 were built in one pass rather than five, which is a departure from how
this document expected them to land and worth saying plainly — and the departure
cost something real. **P1's exit criterion is "the dots are correctly occluded by
a wall", and it was never run.** A single static system in a debug room would
have shown the depth-test bug in the first minute, instead of after five phases
were stacked on top of it. The phases are small for a reason.

The five share one material and one shader, so splitting the *shader* across five
sittings would have meant writing it five times; splitting the *looking* would
have cost nothing and caught it. **Every one of their eye gates is still open.**
The
checks that can be automated are — `check:art` asserts the patches land in both
programs and that all four motions build deterministic, finite and off layer 0;
`check:world` asserts the showcase presents every motion, casts nothing, and
leaks nothing across sixty crossings — and none of that says the smoke looks like
smoke.

The two remaining phases are unblocked by anything here. P6 needs
`finishParticles` beside `finishGlow` and one caller; P7 needs
`ZoneEnvironment.weather` and the intensity coupling in §6, which is the only
part of this document that touches the audio.

### P1 — the layer, the pass, the material

`PARTICLE_LAYER` in `src/layers.ts` with its reasoning written next to it.
`ParticlesEffect` in the chain between the fog volumes and bloom, shaped after
`WaterEffect`. The patched Lambert material, instancing, the in-shader depth test,
the soft-particle fade, `frustumCulled = false`.

**One system, and it does nothing.** A few hundred static dots at fixed positions
in a debug room. Nothing moves; the point is the plumbing.

*Done when:* the dots are correctly occluded by a wall and by terrain; they carry
**no outline** and punch no hole in the outline of anything behind them; a dot
half-buried in the floor fades rather than showing a cut line; distance fog fades
them on the same curve as the wall beside them; the readout shows exactly one
extra draw call; and with the effect off the frame is identical to today's.

### P2 — fall, wrap, and the showcase

The `fall` motion, the camera-carried box, boundary fade, the sub-pixel clamp and
the streak-from-shutter derivation. Snow and rain.

**The showcase lands here**, and R2's note is why: *a volume needs geometry to be
judged against.* Snow against a grey void is a screensaver. The room wants a wall
to fall past, a lit lamp to fall through, ground to disappear into, and a deep
view so the sub-pixel band at ten to thirty metres is actually in frame — that
band is what P2 is really about.

Built as `debug/ParticleShowcase.ts`, with its door closing the showcase rank in
the general hall. Two rows of five either side of the walk in, everything within
about thirty metres of the arrival, walls behind the weather boxes, and lanterns
standing *inside* them.

**Nothing in the room follows the camera.** An eleventh system — a `follow` box
over the whole floor — stood there for one build on the reasoning that the wrap
claim needs one, and it was the wrong call: ambient weather in a comparison room
is snow falling through all ten stations at once, with no way to turn it off. The
wrap and the never-runs-out claims move to P7's done-when, where weather is
declared on a zone and the zone is the subject.

**[measured]** The first version was a single rank of ten, thirteen metres apart,
with the door twenty-four metres off the end of it — and §3 is exactly the reason
that was wrong. Alpha falls with the square of the distance once a particle is
under a pixel wide, and the pipeline quantizes to sixteen levels, so **anything
under 1/16 alpha is not dim, it is not drawn**. Five of the ten stations were
under it from the arrival and two more were at it. A showcase has to be built
against the arithmetic of the thing it shows: `check:world` now measures every
system's brightest instance from where the player actually arrives and fails if
it cannot clear the quantize floor.

*Done when:* snow reads as snowfall and rain as rain from the same code with
different numbers. The wrap half of this gate moved to P7 with the `follow` box
itself — a room for comparing systems cannot hold one that covers all of them.

### P3 — wind, integrated

The prefix-sum table in `art/sway.ts` beside the gust table, float, rebuilt in the
same loop. `windDrag`.

*Done when:* a gust visibly *carries* the snow and leaves it carried — the
rubber-band failure in §4 is the thing to look for, and it is obvious once seen.
The gust that moves the snow is the gust bending the trees in the same frame, and
the wind bed quickens with both.

### P4 — solids, and lit smoke

Instanced geometry, per-instance rotation, the `rise` motion with growth and fade,
the 3×3 billboard for shaded quads. Smoke and steam.

**This is the phase that tests the most opinionated call in the document** (§11).
If faceted smoke does not work, it is much cheaper to find out here than after
sparks and weather are built on the same material.

*Done when:* a plume reads as smoke rather than as a fountain of rocks; it is lit
by the sun on one side and the fill on the other; a plume near a forge picks up
the forge's point light.

### P5 — emissive, and the ballistic motion

`GLOW_LAYER` alongside `PARTICLE_LAYER`, the additive material variant, and the
`ballistic` closed form with `rate` staggering the phases. Embers and sparks.

The two arrive together because sparks are the case that needs both, and because
staggered phases are the thing to look at: a hundred and twenty particles sharing
one cycle at evenly spaced offsets should read as a continuous shower. If it reads
as a pulse, the phases are correlated with something — the likely culprit being a
seed that varies too little across the instance attribute.

*Done when:* embers and sparks bloom, **with no change to `Bloom.ts`** — a change
there is a signal the layer design is wrong, and it should be said rather than
worked around. An ember behind a wall does not bloom through it. The shower has no
visible period at any length of watching.

### P6 — props build their own

`finishParticles`, and the first two callers: the forge's sparks and a chimney's
smoke.

*Done when:* placing a forge places its sparks with no other authoring step;
`world-check`'s prop-grounding and interior-leak checks still pass; the player
walks through the smoke; `art-check` is happy with the new children.

### P7 — weather on the environment

`ZoneEnvironment.weather`, applied at a crossing beside the fog and the
soundscape. **The intensity coupling in §6.**

*Done when:* walking from a snowy exterior into an interior stops the snow at the
threshold with the fog and the reverb, and walking back out resumes it; and the
rain you hear and the rain you see come from the same number — which is checked by
turning that number down and confirming both answer.

**P2's wrap gate lands here too**, because this is where a `follow` box belongs:
walking a hundred metres in a straight line never runs out of snow and never
shows a wrap, and looking straight up shows no popping. There is nowhere in the
showcase to check that — see the note in P2.

### Standing rules

- **`Ground` is not the analogy here; `Bloom.ts` is.** A change to `Bloom.ts`,
  `Water.ts` or `PixelStage.ts` in any P phase after P1 is a signal that the seam
  is in the wrong place. Say so and move it rather than adding the exception.
- **The sub-pixel fade is not polish and does not get deferred.** Without it every
  ambient system is static past ten metres, and every later tuning decision is
  made against a flickering reference.
- **Nothing acquires state.** If a phase finds itself wanting a per-frame update, a
  buffer that survives a frame, or a value written on an event, it has left the
  design in §1 — and the answer is §10's note on bursts, deliberately, not a field
  quietly added to a system. The whole of *what it buys* rests on there being
  nothing to reset.
- **An eye-gated phase is not closed by "it builds."** Six of the seven phases
  here are eye-gated, which is the honest shape of the work: almost nothing about
  particles can be verified by arithmetic, and §3 is the part that can.
