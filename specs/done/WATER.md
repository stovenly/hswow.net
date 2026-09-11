# Water — spec

**Built.** A teardown of the game's water and a rebuild around one
surface that knows where its banks are, which way it runs, and what is
standing in it. Ponds, tarns, creeks, rivers, falls, the sea, a harbour full
of boats, and a body the player can be inside — one material, one pass, one
world query that everything else reads.

**The one-sentence version:** every body of water is a shape on the ground
plus a *regime* — still, flow, fall or sea — and at zone build the game bakes
a field over that shape saying, at every half metre, how deep the column is,
how far the bank is and which way it lies, how fast the water moves and where
something stands in it; the shader draws from that field and nothing else, the
controller, the boats and the sound read the same field, and foam is paint
that a wave, a current or a hull actually put there.

This supersedes `OCEAN.md`, now in `specs/done/`; the parts of it that
worked are kept here as the sea regime. It also answers §1 of
`SWIMMING-CONTROLS.md` — the world query that spec needs is the field this one
bakes — and that spec's `WaterSurface { box, level }` should be read as
replaced by §5 below.

Everything here is checked against `art/water.ts`, `art/sea.ts`,
`art/sea-field.ts`, `art/water-tints.ts`, `engine/Water.ts`,
`engine/Underwater.ts` and the `water`/`sea` kinds in `world/kinds.ts` as they
stand. Nothing is to be built to verify it — the render is the ground truth.

---

## 1. The ask

- Water everywhere it belongs: rivers, creeks, small falls, ponds, bends that
  move, the sea, beaches, coasts, a marina with many boats. The whole gamut,
  and water with motion in it, because motion is what brings a scene to life.
- It has to look and sound great. Realism helps and is not the goal; the game
  is stylised and low poly and the water is allowed to be too.
- It is not a minor system. Swimming and fishing are coming and a marina
  level is planned, so the surface must be something the player, a boat and a
  bobber can sit in, not a picture.
- The seafoam rim has to go. It draws round every ridge, pixelates in the
  reeds, is bright at midnight, and makes a small round pond look worst of all.
- The same stack: three.js r170, WebGL2, one `ShaderMaterial`, no textures, no
  files, the pixel stage at chunky resolution, MSAA on the colour target only.

---

## 2. What this stands on

| | |
|---|---|
| `art/water.ts` | `WATER_MATERIAL`, one shared shader for every pond and river. Two crossed sine trains in the vertex stage; per-vertex `aChop` and `aFlow`. Fragment: manual depth test against `tDepth`, Beer–Lambert body colour, screen-space reflection march, Schlick fresnel, fwidth-filtered ripple normal, the depth-difference waterline rim, contour surf, whitecaps, two flat foam colours. No sun term anywhere. |
| `art/sea.ts`, `art/sea-field.ts` | `SEA_MATERIAL`, a second, independent shader: Gerstner shore train from a baked four-lane field (column, phase, signed distance to land, travel bearing), Green's-law shoaling capped at McCowan's 0.78, swash run-up, wet sand, refraction, caustics, GGX sun and moon glitter, apron rings to the horizon. The field is baked by a top-down depth render from inside the water pass. |
| `art/water-tints.ts` | `WATER_TINTS = { shallow, deep, foam }`. One palette for every drop of water in the game. |
| `engine/Water.ts` | `WaterEffect`: blits the chain forward, re-renders `WATER_LAYER` with colour and depth bound, pushes the same six uniforms into both materials. `submersion()` is a lazy scene traverse for `userData.water`. |
| `engine/Underwater.ts` | Beer–Lambert murk over the frame, ramped over 35 cm, skipping surface pixels by alpha. |
| `world/kinds.ts` `water`, `sea` | `WaterEntry { width, depth, chop, taper, flow, course, speed, segment }`; `SeaEntry { width, depth, swell, reach, segment }`. Both are axis-aligned rectangles. `courseFlow` turns a polyline into an inverse-square velocity field sampled on the rectangle. |
| `world/Zone.ts` | Walks the built group for `userData.water` to set `hasWater`. |
| `audio/models/water.ts`, `surf.ts`, `oneshots/droplet.ts` | Bubble-population flows (`brook`, `stream`, `fountain`, `cistern`), the surf cycle, drips and a fish rising. Attached per zone by vibe or by `sound` entries. |
| `art/sway.ts` `windUniforms` | The gust field both water shaders already sample, so the gust bending the reeds roughens the pond. Kept exactly as is. |
| `engine/Sky.ts` `skyUniforms` | Sun and moon direction, colour and intensity; `skyColour(dir)` for reflection misses. |
| `art/particles.ts` | The particle system, with `billboard` sprites and motion presets. Mist and splash live here. |
| `SWIMMING-CONTROLS.md` | The controller side. Its §1 asks for a world query; §5 here is that query. |

---

## 3. Why it fails

The complaints in the ask are one mechanism and four omissions.

**The rim is a screen-space measurement pretending to be a shoreline.**
`shore` in the fragment stage is a band on `thickness`, the difference between
the scene depth and the surface depth at that pixel, widened by
`fwidth(thickness)` and clamped at 2.5 m. At any silhouette seen through the
water — a reed stem, the lip of a rock, the far edge of a bank — the depth
jumps by metres inside one chunky pixel, `fwidth` explodes, the band snaps to
its clamp and the pixel goes white. That is the halo round every ridge. The
contour surf is worse for the same reason: its phase is a function of depth,
so it draws isobaths, and a silhouette is a fake isobath. In a small round
pond the band is a large fraction of the whole surface, so the pond is a white
ring with a blue middle.

**Foam is unlit.** It is two flat colours mixed from `uShallow` and `uFoam`
and then fogged. There is no sun term in `WATER_MATERIAL` at all — no
`uSunDirection`, no hemisphere, nothing — so foam at midnight is as bright as
foam at noon, and a pond in the shade of a wood has a white edge in full sun.

**Every body is a rectangle.** Ponds, rivers, rock pools and the beach's sea
are all `PlaneGeometry`, buried under the bank so the hard edge is hidden.
A river is a rectangle with a velocity field painted on it, so it cannot bend
past its own corners, cannot change level, and `riverside.json` needs four
overlapping rectangles sharing one course to follow one bend. Two surfaces at
one pixel is exactly the thing `OCEAN.md` §7 forbids.

**There are two shaders and one palette.** The sea has sun glitter, shoaling,
refraction and caustics; the pond has none of them. Both have a different foam.
Both read the same three colours, so a peat tarn and a sea are the same blue.

**Nothing outside the render pass knows where the water is.** `submersion`
traverses the scene for the camera; `Zone.root()` traverses it again for
`hasWater`; the controller, the boats and the sound have no query at all.
`SWIMMING-CONTROLS.md` §1 makes the case for one list; this document makes
the list a field.

**And there is no water that goes anywhere.** No waterfall, no weir, no
cascade, no rapid, no confluence, no flow geometry. Rivers do not descend.

---

## 4. The model: one surface, four regimes

A **body** is one entry of kind `water`. It has a *shape* on the ground, a
*regime* that says how it behaves, a *palette*, and a *level*. One material
draws every body; the regime is a per-body uniform set and a small branch, not
a second shader.

| Regime | What it is | Shape | Level | Motion |
|---|---|---|---|---|
| **`still`** | Pond, pool, tarn, lake, mere, moat, cistern, rock pool | Closed outline | One number | No travelling waves. Wind roughness from the gust field, a ripple height-field for rain, feet, fish and floats |
| **`flow`** | Creek, brook, stream, river, mill race, leat | Course: a centre line with width and level per point | Descends along the course | Flow along the ribbon; riffles where shallow and fast, pools where deep and slow; eddies behind what stands in it |
| **`fall`** | Waterfall, weir spill, cascade step | Lip to plunge | Drops from one body to another | A curved sheet with streaks, a lip, a plunge ring, mist |
| **`sea`** | The sea, a bay, a harbour, an estuary mouth | Outline with a reach to the horizon | One number, tide later | Swell, shoaling, breakers, swash, wet sand; damped inside a painted shelter |

Regimes are engine behaviours, like entry kinds, and the union is closed on
purpose. Everything a pack might vary — palette, swell, speed, width, shape,
shelter — is data.

A pond and a river both read one field (§5), one foam rule (§9), one light
(§8), one sound contract (§16) and one query (§5). The whole of §3 is answered
by that sentence: there is one surface, it knows its banks, and paint goes
where the field says something happened.

---

## 5. The field

At zone build, for every body, the game bakes a grid over the body's bounding
box at `texel` spacing — 0.5 m for `still` and `flow`, 1 m for `sea`, the
apron excluded. Six lanes, two `RGBA` `DataTexture`s per body, and **the same
arrays kept CPU-side** for everything that is not a shader:

| Lane | | Unit |
|---|---|---|
| `column` | still-water depth `level − groundAt`, negative on land | m |
| `bank` | signed distance to the waterline, negative on land | m |
| `dir` | bearing from here to the nearest bank | rad |
| `flow` | surface velocity | m/s, two lanes |
| `stand` | distance to the nearest thing standing in the water | m |

`groundAt` is `ctx.groundAt`, which is CPU code, so the bake is CPU code: a
fast march over the grid from the waterline for `bank` and `dir`, the
regime's rule for `flow` (§7), and a stamp per standing prop for `stand`.
**The top-down depth render in `sea-field.ts` goes.** It bakes from the GPU
what the CPU already knows, and it is the reason the sea field is not
available to anything but the shader. The eikonal march `OCEAN.md` §4.1
describes — wave phase refracting round rocks and into coves — stays, as the
sea regime's seventh lane in a third texture, computed from `column` and
`dir` on the CPU the same way.

**What stands in the water.** A prop contributes a disc of its `radius` at
the waterline to `stand` when it declares `wades: true`, and only then. Rocks,
boulders, pilings, jetty legs, stepping stones, a mill wheel, a moored hull:
yes. Reeds, lilies, willow shoots, anything `solid: false`: never. `stand` is
what foam collars and eddies read, and a reed must not have a collar because a
collar the size of a reed is one pixel, which is the complaint. Builders never
set `wades` on themselves; the entry does, the same way it sets `solid`.

**The query.** `ZoneManager` gains, beside `surfaceAt`:

```ts
interface WaterQuery {
  body: string;            // entry id
  regime: 'still' | 'flow' | 'fall' | 'sea';
  level: number;           // mean surface height here, metres
  column: number;          // level − ground, metres; ≤ 0 on the bank
  flow: [number, number];  // m/s, world xz
  heightAt(t: number): number;   // the wave function, CPU twin of the vertex stage
}
waterAt(x: number, z: number): WaterQuery | null
```

It looks up the bodies whose bounding box covers the point, reads the CPU
lanes bilinearly, and returns the one with the greatest `column`. `heightAt`
is the analytic wave sum for that regime at that point — one function in
TypeScript with a GLSL twin in the vertex stage, and the two are one contract:
**the sea's `trainAt` and the still body's ripple are written once each in
both languages, side by side, and a change to one is a change to both.** That
is what lets a hull ride the wave the eye sees.

`WaterEffect.submersion` reads `waterAt` at the camera and deletes its
traverse and its `scanned` flag. `Zone.root()`'s walk for `userData.water`
goes; `hasWater` is whether the zone declared a body. The swim test in
`SWIMMING-CONTROLS.md` reads `column` at the feet and needs nothing else.

---

## 6. Geometry

Every body's surface is built at zone build from its shape, and every body
carries the same attribute set: `position`, `aCell` (the field texel
coordinate, so the fragment stage samples the field without a matrix), and
`aEdge` (0 in open water, 1 at the buried edge, for the regime to fade its
motion against the bank). `aChop` and `aFlow` are deleted; both are field
lanes now.

**Still: an outline.** `shape` is a closed ring of world xz points, six or
more. The surface is that ring offset outward by `bury` (0.6 m, so the hard
geometric edge is inside the bank as `water.ts` already argues) and
triangulated, with an interior grid at `segment` spacing (0.5 m default) so
the ripple field has vertices to displace. Triangulation is a fan from the
centroid for convex outlines and ear clipping for the rest; a pond is rarely
concave and a lake with a spit is. Inside `bury` of the ring `aEdge` rises to
one.

**Flow: a ribbon.** `course` is a list of `{ at: [x, z], width, level?,
speed? }`. A Catmull–Rom curve through the points is resampled by arc length
at `segment` (0.5 m), and at each sample a lateral row of nine stations spans
`−(width/2 + bury) … +(width/2 + bury)` along the curve's normal, at the
interpolated level. Width and level interpolate along the curve; `level` at a
point defaults to the previous point's, so a flat river is a course with one
level on its first point and a descending brook says where it drops. **The
level must not rise downstream**; a course that does is a build warning, and
the surface is built anyway so the mistake is visible. `U` is across, `V` is
arc length in metres, and the regime's flow scroll is a scroll of `V`. Nine
stations is what the track ribbon uses, for the same reason: the two outer
bands are the buried edge and the seven inner ones carry the profile.

A course whose last point lies inside another body's outline **ends at that
outline**: the ribbon is clipped to the ring and its final row's level is that
body's level, so a brook into a pond or a river into the sea is a seam of two
surfaces sharing a level and a texel, never two surfaces at a pixel. The
receiving body's field marks the mouth as open water — `bank` is not zero
across a mouth — so no foam line forms across a river mouth.

**Fall: a sheet.** `fall` has `from` (a point on the upper body's outline or
course; its level is the lip), `to` (a point in the lower body; its level is
the pool), `width`, and `throw` (metres the sheet stands out from the lip at
the pool, default a quarter of the drop). The sheet is a strip of `width / 0.5`
columns by 12 rows following a quadratic from the lip out and down to the
pool, curling in at the foot. It is one body with its own field row: the field
under a fall is the lower body's.

**Sea: an outline and a reach.** As `sea.ts` builds it now — the authored
rectangle at `segment` plus apron rings growing geometrically out to `reach`,
pinned to the perimeter on the land side, `gl_Position.z` clamped so the last
ring reaches the horizon — except that the inner surface is an outline like a
still body's, not a rectangle, so a bay can be a bay. `reach` is also legal
on a `still` body: a lake whose far side is out of the level gets an apron to
the fog the same way, and the `far-water` rectangles in `forest.json` and
`plains.json` become that.

**One body, one draw**, as now. Every body is on `WATER_LAYER`, `noCollide`,
built outside `assemble` because it has its own material and its own ledger.

---

## 7. The shape of the surface

Displacement is the vertex stage; everything smaller than a vertex is the
normal. `uWaterMotion` stops all of it, as now.

**Still.** No travelling wave. Two things move the normal: the gust field,
sampled downwind exactly as `water.ts` does, tilting a two-octave streaked
noise by `0.16 · agitation`, and the ripple field (§10), whose height is
sampled per vertex and whose gradient is the normal. Flat calm is a mirror,
and it should be — the stillness is the read of a pond.

**Flow.** The surface does not heave; a river's motion is in its skin. The
flow lane scrolls the streak noise along `V` with the Valve crossfade — two
samples half a cycle apart, weighted by a triangle so one is always sharp —
so the streaks slide round the bends without stretching. Where `column` is
under 0.35 m and `|flow|` is over 0.5 m/s the regime adds **riffle**: a
standing ripple whose wavelength shortens with speed, fixed to the bed rather
than scrolling, with a speckle of foam (§9). Where `column` is deep and `flow`
slow the normal goes quiet and the body colour deep — the **pool**. Riffle
and pool alternate down a real stream because the bed does, and the field
carries the bed, so they alternate here without being placed.

Behind anything in `stand`, within three radii downstream, a **wake pair**:
curl noise gated by the `stand` ramp adds two counter-rotating eddies to the
scroll and a tongue of foam. Nothing is simulated; the pattern is a function of
`stand`, `flow` and time.

**Sea.** Exactly `sea.ts`: the long swell over the whole plane, deep-water
dispersion, the shore train from the phase lane with Green's-law shoaling,
McCowan's breaking cap, Gerstner steepness leaning the crest shoreward, the
crossed chop on top. Its `TRAIN_GLSL` is the vertex stage of this regime, and
`trainAt` gets the TypeScript twin §5 requires. New here: a **shelter**. A
`sea` body may name a region of the zone's `regions` as `shelter`; inside it
the swell and chop amplitudes scale by `calm` (default 0.15) over a 6 m ramp
at the region's edge. A harbour behind a breakwater is flat because someone
built the breakwater and painted the shelter, not because the field guessed.

**Facets.** One per-body knob, `facet: 0..1`, blends the normal between the
analytic smooth normal and the geometric face normal,
`normalize(cross(dFdx(vWorld), dFdy(vWorld)))`. A displaced triangle is
planar, so the derivative is the exact face normal at no attribute cost, and
it is filtered toward the smooth normal by the same `fwidth` weight the
ripple already uses so far faces do not sparkle. At one, a lake is a sheet of
tilted plates catching the sky and the sea heaves in visible panes; at zero it
is today's smooth surface. This is the low-poly look; the default is 0.6 on
the sea and on lakes with a reach, 0 on ponds and rivers (§22).

---

## 8. Colour and light

**Palettes are per body and come from content.** A body names a palette —
`pond`, `river`, `tarn`, `sea`, `harbour`, `rockpool` — from a `water`
palette family in `world.json`, keyed by id and merged by id like every other
document, or carries one inline. A palette is `{ shallow, deep, foam,
scatter, bands }`. `WATER_TINTS` and `water-tints.ts` are deleted. The
defaults ship with the base project; a pack that wants a green sea ships a
palette.

**Depth colour** is Beer–Lambert on the column as now, `body = mix(shallow,
deep, 1 − exp(−column / shoreDepth))`, with `bands` optionally posterising it
into two, three or four flat steps with a pixel-AA'd edge between them. Bands
are what make Wind Waker and A Short Hike read as painted water; zero bands is
today's gradient. Three on still and flowing water, a gradient on the sea
(§22).

**Reflection.** The screen-space march stays for the near field, because a
reed's reflection and a hull's reflection are what put a thing *on* the water.
Past 120 m it is sky, as `OCEAN.md` §3.3 argues. Fresnel is Schlick with
`F₀ = 0.02` and may be posterised with the bands.

**Sun and moon.** The GGX glitter `sea.ts` has moves into the shared material
and every body gets it: a broad road under a low sun on the lake, sparkle
underfoot in the brook, with roughness rising with the normal's filtered
variance as `OCEAN.md` §3.4 lays out. Scatter through a raised crest, keyed to
`palette.scatter`, applies wherever there is a crest, which is the sea and a
riffle.

**Caustics and refraction** as `sea.ts` has them, for every body with a lit
bed: two octaves of ridged noise on the bed's world xz, scrolled by `flow`
where there is flow and by two fixed directions where there is not; the bed
read at a normal-offset uv only when the depth there is still behind the
surface, so nothing above the water bends.

**Foam is lit.** This is the rule §3 exists to state. Foam is a diffuse white
cloud on the surface: `foamColour = palette.foam · (hemisphere + sunColour ·
sunIntensity · max(dot(up, sunDir), 0))`, composited by mix, never added, and
fogged with the surface. In a wood's shade at noon it is grey; at dusk it is
warm; at midnight it is as dark as everything else. Reading the shadow map for
the sun term is a stretch goal noted in §21; the hemisphere and elevation
alone remove the midnight glare.

---

## 9. Foam

The rim, the contour surf and the noise-placed whitecaps are deleted. Foam
has **four sources**, every one of them a thing that happened, and a noise
that tears foam that is there and never places foam that is not.

1. **The bank.** A `still` or `flow` body gets a *wash line*: a thin band
   where `bank` is between 0 and `washWidth` (0.25 m default), scaled by
   agitation — the gust on a pond, `|flow|` on a river — so a dead-calm pond
   in still air has no line at all and a river has a lick of white where it
   rubs its bank. It is a function of the field, so it is the same width on a
   cliff face and a beach, does not exist at a reed, and does not care what
   the depth buffer says. On `sea` it is the swash edge, §12.
2. **The crest.** Where the surface folds: the sea's breaking ratio `b` from
   the shore train, and the Jacobian of the Gerstner displacement offshore
   for whitecaps that sit on a real crest. Lip and wash as `OCEAN.md` §4.3.
3. **The current.** Riffle speckle where riffle is, a tongue behind every
   `stand`, a streak down the steepest fall of a course, the plunge ring under
   a fall (§11). All from `flow`, `column` and `stand`.
4. **Things that move.** A hull, the player wading or swimming, a bobber, a
   fish, rain — written into the **persistence buffer**: a 512² `RGBA8`
   world-xz render target covering 128 m around the camera, snapped to its
   texel so it does not swim, ping-ponged each frame as
   `foam = max(foam · decay, source)` with a one-texel blur, red foam and
   green wet (§12). Decay is around 0.985 per frame at sixty. Sources are
   stamped as small quads: a hull's outline scaled by its speed, a V behind a
   moving one at ±19.5°, a disc under a splash. Sea of Thieves's foam is a
   blurred feedback buffer for exactly the reason it reads well: foam
   disperses, it does not switch off.

`foam = max(bank, crest, current, buffer)`, torn by two octaves of streaked
noise whose threshold rises as the foam ages, so it opens hole-first, then
through two pixel-AA'd thresholds into the wash colour and the white, as now,
and lit as §8 says.

**Collars.** Where `stand` is under a body's `collar` (0.3 m default) a
still body draws a faint ring and a flowing body a bow and tongue. Because
`stand` only holds `wades` props, a collar is never narrower than a rock, and
a rock at a chunky pixel is many pixels. A reed gets nothing, and the pixel
saw at its stem goes away with the rim.

---

## 10. Motion that reads as life

**The ripple field.** Every `still` body within 60 m of the camera owns a
ping-pong pair of `RGBA16F` targets, 128² for a pond and 256² for a lake,
covering its bounding box. Each frame one fragment pass runs the classic
height-field step — `h' = (n + s + e + w) / 2 − h_prev`, damped by 0.985 —
and the surface samples height and gradient per vertex. Bodies farther than
60 m freeze; a body that comes back in range restarts from flat, which nobody
sees. Sources are impulses stamped into the field as cosine bumps:

| Source | When | Size |
|---|---|---|
| Rain | Poisson per frame, rate from `weather.rain` | 0.15 m |
| The player | each footstep in `column > 0.05`; continuously while swimming | 0.3 m, 0.6 m |
| A float | a bobber landing, a hull bobbing | 0.2 m, its radius |
| A fish | the `rise` scatter event, §15 | 0.25 m |
| A fall | continuous at the plunge point | `fall.width` |

Rain on a pond is the single strongest "this world is alive" cue available and
it costs one small pass per body.

**The persistence buffer** (§9) does the same job for `flow` and `sea`, where
a height-field would fight the regime's own displacement; foam and wet are
what a moving thing leaves on a moving surface.

**Wind.** Unchanged: the gust that bends the reeds tilts the pond. It is the
one uniform set both old shaders already share by reference and the new one
keeps it.

---

## 11. Waterfalls

The `fall` regime, and the place a stylised water system earns its keep.

- **The sheet** (§6) is drawn with `V` down the fall, `U` across. Streaks are
  two-octave value noise displaced by a slower noise, scrolled down `V` at the
  fall's speed, **posterised to five steps**, and coloured
  `mix(mix(deepDark, lipDark, v), mix(deepLight, lipLight, v), n)` from the
  palette. A second layer scrolls at two thirds the speed for parallax. A
  faint set of vertical bands, fixed in `U`, makes the sheet read as ropes of
  water rather than a curtain.
- **The lip**: a bright band over the top 6 % of `V` where the water folds
  over the edge, and a dark line just below it where the sheet leaves the bed.
- **The foot**: below `V ≈ 0.85` the sheet dissolves into white by a noise
  threshold, and the last row is fully foam.
- **The plunge ring** is not on the sheet. It is a continuous impulse in the
  lower body's ripple field (still) or a continuous foam stamp in the
  persistence buffer (flow, sea), an annulus `fall.width` wide whose foam
  the current then carries downstream. RiME's rings slow toward the rim; a
  ripple field does that on its own.
- **Mist**: a `particles.ts` emitter at the foot, billboard sprites with a
  radial procedural gradient, rising slowly and fading over two seconds,
  count from `fall.width × drop`. **Splash**: a second, sparse emitter of
  short-lived drops thrown outward at the foot.
- **Sound**: §16, `cascade`.

A fall is placed by the author with `from` and `to`. A course whose level
drops sharply between two points is *not* turned into a fall by the engine;
the water descends steeply as a rapid (riffle at full strength) and the author
decides whether it deserves a sheet. Nothing is placed that nobody asked for.

---

## 12. The sea

Carried over from `sea.ts` and `OCEAN.md`, with three changes.

- **Shelter**, §7: painted calm behind a breakwater, for the marina.
- **Wet sand has memory.** The green lane of the persistence buffer is
  written by the swash each frame and decays slower than foam (0.995), so the
  sand darkens where the last wave reached and dries back over ten seconds
  rather than by a fixed gradient. The terrain shader reads the buffer where
  it is inside the sea's box; `OCEAN.md` §4.4's runup band stays the source.
- **The field is CPU** (§5), which is what lets a hull sit on the swell (§13)
  and the controller wade the beach (`SWIMMING-CONTROLS.md` §3) off the same
  numbers the shader draws.

Swell direction, length and height stay on the entry and stay the owner's. A
`sea` with no `swell` is a dead calm, which is legal and is what a lagoon is.

**Tide** is not built, and the design leaves room for it: a tide is a change
of `level`, and every lane of the field is a function of `level` and
`groundAt`, so a tide is a re-bake of the field — a few milliseconds on the
CPU — at a rate no one would notice. Noted in §20.

---

## 13. Things on the water

The marina needs the surface to hold things up. This is a contract, not boat
art; the boats are builders and the list of them is the owner's.

**Afloat.** A `prop` entry may declare `afloat: true` or `afloat: { draft }`.
The placer puts it at `waterAt(x, z).level − draft` instead of on the ground,
and registers it with the **flotilla**: a per-zone list of floating objects
updated once per frame. For each, the flotilla samples `heightAt(t)` at three
points on the hull's footprint — bow, stern and one beam — and drives heave
from the mean, pitch from bow minus stern, roll from beam minus centre, each
through a critically damped spring so a hull lags the water and settles. Each
float carries a phase offset so a fleet does not bob in unison. Because the
sea's `trainAt` has a TypeScript twin, the hull rides the wave that is drawn;
because the shelter damps the swell, harbour boats nod and open-water boats
pitch.

**Wake and collar.** A float's footprint is stamped into `stand` at build, so
it has a collar, and into the persistence buffer each frame at its speed, so a
moving one leaves a V. The skiff on the coast gains `afloat` and moves off the
sand into the shallows; `skiff.ts` is built on its keel along +X and needs no
change.

**Moorings.** A `mooring` entry names a float and a post (or two points) and
builds a catenary — `y = a·cosh(x/a)` solved for the sag from the endpoints and
a `slack` — as a rope tube of twelve segments, re-solved per frame from the
float's current position. It tightens as the hull drifts and slackens as it
returns. This is the `mooring-line` builder; the rope is the same rope the
kit already has.

**Docks.** A jetty, a pier, a quay, a slipway and a pontoon are long
irregular things laid along a line into the water, which is exactly what
`EXTENDED-BUILDERS.md` is for, and they are specified there. What this
document owes them: every leg they plant is a `wades` disc in `stand`, so a
pier stands in a row of collars and the current tongues behind each pile.

**Drift.** A moored float may yaw slowly within its mooring's slack; an
unmoored one does not drift in v1. Sailing, rowing, or a boat as a vehicle is
`SWIMMING-CONTROLS.md` §2's third control mode and is not here.

---

## 14. Under the water

`engine/Underwater.ts` stays as the murk. What changes:

- **The query.** `setDepth` reads `waterAt` at the camera, the same number the
  swim test reads at the feet, so the moment the view goes green is the
  moment the controls change, as that spec argues.
- **From below**, the surface is the back face of the same mesh: Snell's
  window at η = 1.33 showing the sky squeezed into a 97° cone, total internal
  reflection outside it mirroring the murk, as `water.ts` already does; the
  new material keeps that branch and adds the sun as a bright disc through the
  window.
- **Wobble.** A slow two-octave offset of the frame's uv while submerged, of
  one chunky pixel at most, so the view swims without smearing.
- **The crossing frame.** The near plane straddles the surface for a frame
  or two. Per pixel, the murk pass tests the near-plane corner heights
  against `heightAt`, so half the frame can be under and half above with a
  one-pixel meniscus line between; this replaces the hard flip.
- **God rays** are a `SHADERS-V2.md` matter and are not here.

---

## 15. Fishing hooks

The mechanic is not designed here. What the water owes it, so it can be:

- `waterAt` says whether a point is fishable and how deep and how fast.
- `flotilla.add(object, { draft, radius })` floats a bobber and bobs it.
- `ripples.impulse(body, x, z, size)` and `foam.stamp(...)` are public, so a
  cast makes rings and a strike makes a splash.
- A **`rise`** scatter event: for a `still` body or a `flow` pool, at Poisson
  intervals the zone's soundscape asks for, a ripple impulse at a random
  point over `column > 0.6` plus the existing `droplet` one-shot — a fish
  taking something off the surface. It is a scatter field like any other, and
  a zone that does not ask for it has no fish rising.

---

## 16. Sound

Water that is not heard is not there. The models mostly exist; what is new is
the contract between a body and its sound.

**A body declares its sound by regime**, and the soundscape builds it:

| Regime | Model | Notes |
|---|---|---|
| `still` | `lap` (new flow of `water.ts`) | Near silence; sparse large bubbles and a lapping envelope scaled by agitation. Drips from `droplet` where the zone asks |
| `flow` | `water.ts` flows by speed class: `brook` under 0.4 m/s, `stream` to 0.9, `rapid` (new) above | One **linear emitter per course**: its position is the point on the course nearest the listener, re-found every eighth frame with hysteresis so it does not jump at a bend; gain by mean width × speed |
| `fall` | `cascade` (new) | A pink-noise roar lowpassed near 800 Hz whose level tracks `width × drop`, crossfaded by distance into a close layer built from `water.ts`'s turbulence bed and a dense bubble population. Positioned at the plunge point, `refDistance` large, so it is heard before it is seen — the level-design guideline's water-before-sight |
| `sea` | `surf.ts`, as now | Plus `slap`: a one-shot fired at each afloat hull when `heightAt` at its bow crosses upward through the hull's waterline, so the harbour knocks at the swell's period. Rope creak on moorings from the friction model when the catenary tightens |

The regime is the default; a `sound` entry on the body overrides it as `sound`
entries do today, and a zone's vibe may still place water models by hand.
Wading, strokes, splashes and the muffle are `SWIMMING-CONTROLS.md` §7.

---

## 17. Content

### The entry

```ts
interface WaterEntry extends EntryBase {
  kind: 'water';
  regime: 'still' | 'flow' | 'fall' | 'sea';
  palette?: string | WaterPalette;      // id from the water palette family, or inline
  level?: number;                       // still, sea
  shape?: readonly Point[];             // still, sea: closed outline, world xz
  course?: readonly CoursePoint[];      // flow: { at, width, level?, speed? }
  fall?: { from: Point; to: Point; width: number; throw?: number };
  reach?: number;                       // still, sea: apron to the horizon
  swell?: { direction: Point; length: number; height: number };   // sea
  shelter?: string;                     // sea: a regions[] name
  facet?: number;                       // 0..1
  segment?: number;                     // m
  bury?: number;                        // m, default 0.6
  ripples?: boolean;                    // still, default true
  sound?: SoundSpec;                    // overrides the regime default
}
```

`width`, `depth`, `chop`, `taper`, `flow`, `speed` on the old entry are gone.
`chop` becomes agitation from the gust; `taper` is the field. The `sea` kind
is deleted; it is `regime: 'sea'`.

### Migration, every body

| Zone | Today | Becomes |
|---|---|---|
| `forest.json` `pond` | 14 × 10 rectangle | `still`, outline traced from the basin, palette `pond` |
| `forest.json`, `plains.json` `far-water` | 240 × 110 and 300 × 300 rectangles at `segment: 4` | `still` with `reach`, outline on the level's edge |
| `plains.json` `pool` | 13 × 13 | `still` |
| `village.json` `stream` | 28 × 80, 7-point course | `flow`, the same seven points with `width`, one `level` |
| `forest-path.json` `brook`, `river` | course + 150 × 200 constant flow | two `flow` courses; the river's outline widens where it was a plane |
| `farm.json` `river` | 150 × 44, course | `flow` |
| `riverside.json` `reach-1…4` | four overlapping rectangles, one 14-point course | **one** `flow` body on that course |
| `beach-path.json` `pool-w`, `pool-e` | 5 × 3.6 | `still`, palette `rockpool` |
| `beach-path.json` `sea` | a 500 × 500 `water` plane | `sea`, with a swell |
| `coast.json` `sea` | `sea` entry | `regime: 'sea'`, unchanged values |
| `WaterShowcase`, `WaterShowcase2` | direct `waterPlane` calls with callbacks | rewritten on the new entries, or deleted |

Values are content and are the owner's. The migration is mechanical except
for tracing outlines, which is a morning with the editor's polyline tool.

---

## 18. Budgets

- **Field**: a 180 m zone at 0.5 m is 360² texels × 6 lanes as `Float32` —
  3.1 MB CPU, two `RGBA32F` textures GPU, per body's box not per zone; a pond
  is kilobytes. Bake is one fast march over the grid, under 10 ms for the
  largest river.
- **Ripple fields**: at most three live, 256² `RGBA16F` × 2 each, one small
  pass each per frame.
- **Persistence buffer**: one 512² `RGBA8` pair, one pass per frame, plus the
  stamps.
- **Vertices**: sea 36 k + 9 k as `OCEAN.md`; a 400 m river at 0.5 m × 9
  stations is 7 k; ponds are hundreds.
- **Fragment**: as `sea.ts` today for every body, plus one field fetch, one
  buffer fetch and the Valve pair on flow. The reflection march off past 120 m
  pays for it.
- **Attributes**: `position`, `aCell`, `aEdge` on the water geometry; the art
  ledger is untouched.
- **Draws**: one per body, plus one per live ripple field and one for the
  buffer.

---

## 19. Ways to get it wrong

- **Foam by measurement.** No term may read `tDepth` to decide where foam
  goes. The depth buffer decides what is *behind* the surface and nothing
  else. The moment a silhouette can paint white, the rim is back.
- **Foam by noise.** Noise tears foam that a source put there. It never
  places foam.
- **Two twins that drift.** `heightAt` in TypeScript and the vertex stage are
  one contract. Write them side by side, name the constants once, and change
  both in one commit or the hulls float above the water.
- **Two surfaces at a pixel.** A course ends at the outline it flows into.
  Aprons never overlap a level's land. Nothing else overlaps water.
- **A level that rises.** A course whose level goes up downstream is a
  warning, never silently fixed.
- **Signs.** `flow` points the way the water goes. `dir` points *to* the
  bank. Gerstner moves a vertex against the travel direction on the front
  face. State each in the shader beside the line that uses it.
- **`wades` by default.** A builder never declares itself standing in water;
  the entry does. Reeds never get a collar.
- **Killing the pond.** Every new term is zero at `column ≤ 0` and at zero
  agitation. A dead-calm pond in still air is a mirror with no foam anywhere.
- **The motion switch.** Every clocked term — swell, scroll, ripple step,
  buffer decay, caustics, mist — reads `uWaterMotion` and the reduced-motion
  option.
- **Instrumenting it.** No probe, no top-down debug view, no check script.
  The field is data; if it looks wrong, read the bake.

---

## 20. Not here

- No FFT ocean, no shallow-water solver, no fluid simulation. The ripple field
  is a height-field and the buffer is a decay; everything else is analytic.
- No projected grid or camera-following mesh. Bodies are shapes with aprons.
- No textures, no files. Noise, Voronoi, BRDF and render targets filled at
  boot.
- No tide, though the field is built so a tide is a re-bake (§12).
- No currents on the player, no boats as vehicles, no sailing. Controller
  work is `SWIMMING-CONTROLS.md`.
- No fishing mechanic, only its hooks (§15).
- No god rays (`SHADERS-V2.md`).
- No checks, probes or instruments.

---

## 21. Order of work

Each a commit and a look before the next. The first changes nothing visible.

1. **The field and the query.** Bake the six lanes on the CPU for every
   existing body; `waterAt`; `submersion` reads it; `Zone.root()`'s traverse
   and `sea-field.ts`'s top-down render go. The picture is unchanged.
2. **One material, four regimes.** Port `sea.ts` into the shared shader as
   the sea regime, `water.ts` as still and flow reading the field. Outlines
   for still bodies, ribbons for flow, palettes from content. **Delete the
   rim, the contour surf and the noise whitecaps.** The picture changes: the
   halos are gone and nothing has replaced them yet, deliberately.
3. **Lit foam and its sources.** Bank wash, crest, current, lit as §8.
4. **Flow.** Valve scroll, riffle and pool, wakes behind `stand`, confluence
   at outlines, linear emitters.
5. **Ripples.** The height-field, rain, the player, `rise`.
6. **Falls.** Sheet, lip, plunge, mist, `cascade`.
7. **Look knobs.** `facet`, `bands`, glitter on every body, caustics and
   refraction on every body.
8. **Afloat.** The flotilla, moorings, the skiff in the shallows, collars and
   wakes through the buffer, `slap`.
9. **Sea polish.** Shelter, wet-sand memory.
10. **Under the water.** The crossing frame, wobble, the sun through the
    window.
11. **Stretch:** foam through the shadow map.

Phases 3 through 10 are each gated on a look; there is no other gate.

---

## 22. Decisions

Settled here so the build does not stop to ask. Two of them are looks
rather than reasoning and are the ones to say so about after the first look:
facets and bands.

- **Facets.** `facet` defaults to 0.6 on `sea` and on any `still` body with
  a `reach` — the big water is plated — and to 0 on ponds, pools and every
  `flow` body, which are mirrors and skins. One number per body flips it.
- **Bands.** `still` and `flow` palettes default to three flat steps of
  depth colour with a pixel-AA'd edge; `sea` keeps the gradient, because a
  band edge crawling along a thirty-metre swell reads as a contour line and
  the sea's motion is already in its shape and its foam.
- **Palettes.** Six ship: `pond`, `river`, `tarn`, `rockpool`, `sea`,
  `harbour`. `pond` is today's three colours; the others are derived from it
  at the first build and adjusted by eye afterward like any other colour.
- **No wash on a calm pond.** A dead-calm pond in still air has no line at
  its bank.
- **A steep course never becomes a fall by itself.** The author places the
  `fall`.
- **Shelter calm** is 0.15.
- **Names** as written: `still`, `flow`, `fall`, `sea`, `wades`, `afloat`,
  `rise`, `shelter`. Rename freely; nothing hangs on them.

---

## 23. Precedents — research notes

- **Wind Waker**: flat colour, hard-edged opaque foam as a *field pattern*
  over the whole surface, not an outline; a swell of summed sines; the pattern
  wobbled by low-frequency noise. Texture-free recreations build the rings from
  Voronoi edges. The lesson kept: foam as paint with an edge, not a glow.
- **Breath of the Wild**: foam gated on the *distance from surface to bed*,
  never screen depth, which is why reeds push through its water cleanly. That
  is `column` here.
- **RiME** (Schreibt, Unreal Fest 2018): unlit flat water, posterised
  streaks on a curved sheet for falls, a plunge ring whose UVs run radially
  so a scroll is outward motion and slows toward the rim.
- **Sea of Thieves** (Ang, SIGGRAPH 2018): foam from crests via the Jacobian
  and from intersections, *blurred with feedback each frame* so it disperses;
  colour from a wave-peak mask; Snell's window from below; catenary ropes
  solved on the CPU and deformed in the vertex stage. The persistence buffer
  and the moorings are these.
- **A Short Hike**: a plane that follows the player, world-space animation,
  colour posterised into bands. The `bands` knob.
- **Valve, *Water Flow in Portal 2*** (Vlachos, 2010): two time-offset
  samples crossfaded by a triangle weight, so a scrolled pattern never
  stretches. The flow regime's scroll.
- **Bridson, *Curl-Noise for Procedural Fluid Flow*** (2007): divergence-free
  flow from the curl of a potential, ramped to zero at obstacles so it bends
  round them. The wakes behind `stand`.
- **Jump flooding / fast marching**: distance and nearest-seed fields in
  `log n` passes; here on the CPU because `groundAt` is.
- **GPU Gems 1 ch. 1, GPU Gems 2 ch. 18**: Gerstner form and normals; four
  octaves are enough for lighting and two for displacement.
- **Tessendorf, *Whitecap Phenomenology***; **Airy shoaling, Green's law,
  McCowan γ = 0.78**: the sea regime, as `sea.ts` already has them.
- **Cyanilux, *Shoreline Shader Breakdown***: shore waves on a shore-distance
  gradient, swash on a cosine, wet sand as a dark tint. §12's swash.
- **Elias / Wallace height-field ripples**, the three.js `webgpu_compute_water`
  example: the four-neighbour step and cosine impulses. §10.
- **Kelvin wake**: 19.47° half-angle. The V behind a moving hull.
