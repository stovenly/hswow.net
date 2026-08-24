# Window daylight

A window stops being a lamp with a random aim and becomes a hole in a wall with
the sky on the other side of it. The shaft swings with the sun, reddens at dusk,
goes cool and faint under the moon, and closes altogether under an overcast.

Two pieces: the floor patch comes out, and the rest is driven by the clock the
sky already runs on.

---

## 1. Where it stands

`src/art/builders/window.ts` builds five lit things, all baked at build time and
none of them ever touched again:

| name | what it is |
|---|---|
| pane board and `window:glow` halo | the bright rectangle and its glare |
| `window:shaft` | the sheared box beam, additive, faded to black along its length |
| `window:pool` | the patch on the floor, a `1 x 0.012 x 1` box at 4 x 4 segments |
| `window:sun` | a `PointLight` at the aperture |

`aimWindow(mesh, azimuth, elevation)` writes the shaft's and the pool's matrices
directly. Nothing calls it. Every window in the world sits on the default aim
rolled from its own seed at the end of `build`.

Every window in the world is inside an interior — two in the villager hut, two
in each countryside home, three along the mill's south wall — all at yaw `PI` on
the south wall. The one exception is the structures gallery, which is an outdoor
zone.

---

## 2. The floor patch comes out

The pool is 4 x 4 segments carrying a `smoothstep` edge fade evaluated per face,
so it reads as a square made of triangles at four different brightnesses. It
goes: `poolGeometry`, `poolLift`, the `window:pool` branch of `aimWindow`, and
the `pool.visible` guard.

`MAX_REACH` stays — the shaft still needs a length cap.

The point light was deliberately held weak so it would not burn a circle of its
own, on the grounds that the square was drawn by the additive slab. With the slab
gone it is the only thing marking the floor. Its numbers are not changed in this
pass; they are retuned after a look.

---

## 3. The orientation contract

The builder's frame: wall at `z = 0`, everything proud toward `+Z`, floor at
`y = 0`. The fitting stands into the room, so **local +Z is the inward normal and
the wall's outside faces local −Z**. Light enters when
`dot(sunDirection, inward) < 0`.

Three yaws compose, in this order:

1. **The prop's world matrix.** Third column of `matrixWorld`, normalised. The
   inverse rotation quaternion is cached at collect time — `freezeMatrices` has
   already composed everything, so this is paid once.
2. **The zone's bearing.** `ZoneEnvironment.bearing`, degrees the zone's `+Z` is
   turned from world `+Z`. Interiors are their own zones authored about their own
   origin, so nothing otherwise connects an interior's north to the building's.
   One number per room orients every window in it.
3. **The window's own override.** `metrics.bearing`, for the odd wall.

`bearing` is optional, and **its absence is the opt-out**: a zone that has not
said which way it faces has no business being driven by the sun, so its windows
are left exactly as built. That is also what keeps the structures gallery out —
it runs on `OUTDOOR_ENVIRONMENT` and states no bearing.

---

## 4. The daylight sample

`WeatherRig.applyLight` already works out everything needed, once per frame, in
one place: `this.key` (the sun, or the moon once `sunElevation < MOON_TAKES_OVER`),
`this.air.sunColour` and `sunScale` off the atmosphere table, `clear = 1 - overcast`,
and `moonLight` for the phase. Nothing is re-derived per window.

A struct, in `src/engine/daylight.ts`:

    direction   toward the key, world, unit
    colour      what a beam through a hole is
    level       0..1: sunScale x clear^2 x (moonlit ? 0.45 * phase : 1)
    moonlit     which body it is

`WeatherRig` fills it where it already computes `moonlit`, `phase` and `clear`,
and hands it to the zone manager. The night rows of the atmosphere table give
`sunColour: 0xb9cdf2` at `sunScale: 0.16` — that is a moonbeam already, and no
second table is wanted.

Folding `clear^2` into the level is the strongest thing here and it is free: an
overcast day has no shaft at all, on the same curve the key light already uses.

---

## 5. The per-window system

`src/engine/WindowLight.ts`, mirroring `LightActivity` exactly — `collect(id, root)`
walking for `userData.window`, `release(id)`, `update(id, daylight, eye)` — owned
by `ZoneManager` beside `this.activity`, collected in `prepare`, released on
eviction, updated for the active zone only.

Per window, per update:

1. Rotate the daylight direction into the window's local frame, through the
   cached inverse quaternion and the two bearings.
2. With `d` the travel direction of light in that frame:
   `elevation = asin(-d.y)`, `azimuth = atan2(d.x, d.z)`. That is the convention
   `aimWindow` already uses — `dx = sin(az)cos(el)`, `dy = -sin(el)`,
   `dz = cos(az)cos(el)` — so the primitive does not change.
3. Fade, then aim with the **clamped** angles. The split matters: the existing
   clamps stop the shear inverting and the shaft length blowing up, but on their
   own a sun swinging past one leaves the beam frozen at full brightness pointing
   the wrong way.
   - **grazing** — `smoothstep` on `cos(azimuth)` between `cos(1.3) ~ 0.27` (gone)
     and `cos(1.0) ~ 0.54` (full). Below zero the sun is behind the wall and the
     beam is off outright.
   - **horizon** — `smoothstep` on elevation between `MIN_ELEVATION` and about
     twice it, so a setting sun dims out instead of snapping when the clamp
     catches it.
   - **overhead** — `MAX_ELEVATION` only shortens the shaft. No fade wanted.
4. `level = daylight.level * metrics.openness * graze * horizon`.
5. Write the colour and the level.

Clipping into walls is handled by `MAX_REACH` capping the shaft, plus the grazing
fade. `metrics.reach` lets a placer shorten it for a small room. A truncated
shaft shows no hard end — the fade to black along its length already covers that.

**Cadence.** `dayLength` defaults to 24 minutes, so the hour angle moves a quarter
of a degree a second. Per-frame aiming is waste. Cull by distance as
`LightActivity` does, and within range stagger: window `i` re-aims on frames
where `(frame + i) % 8 == 0`. No interpolation — the change between updates is
under a pixel.

Windows whose curtains are drawn have no shaft built at all, so they are
collected for their pane and skipped for the aim.

---

## 6. The material

The one real obstacle, and it decides the shape of the change.

The shaft, pane and halo bake their hue into vertex colours and all share the
single module-level `GLOW_MATERIAL`, whose opacity is driven globally by
`setGlowLevel`. So today a window's beam cannot be recoloured or dimmed without
rewriting its vertex buffer.

- **The ramps go monochrome.** The shaft's vertex colour carries only
  `0.22 * (1 - z)^1.35` as grey; the halo carries only its radial falloff. No hue
  in the buffer.
- **Each window clones the glow material** — one instance shared by its shaft,
  pane and halo. `MeshBasicMaterial.color` multiplies vertex colour, so hue goes
  there and level goes into opacity. Same shader program, so it is a uniform
  change per draw and not a new pipeline.
- The rolled `sunny` / north-light choice survives as a **tint** multiplied over
  `daylight.colour` rather than as the colour itself, so a north window stays cool
  at every hour and a sunset still reddens it.

A cloned material does not follow `setGlowLevel`. For a driven window that is
right — a daylight shaft has no business brightening at dusk along with the
lamps.

---

## 7. Static is what the mesh is born as

`BuildOptions` is `{ seed, scale }` and the registry calls it that way, so there
is no flag to pass. The switch is inverted instead.

**A window comes out of `build` finished.** It rolls its default aim from its seed
and writes its cloned material once from its own tint at full level. In the
gallery, or placed by a caller that knows nothing about the climate, it is a
static window and nothing has to run for it to look right.

`WindowLight.collect` then picks up every window in a zone that states a bearing
and starts overwriting it. Day and night is the default with no flag anywhere.

Opting out is a call after the build:

    holdWindow(mesh)                          stop the cycle touching it
    holdWindow(mesh, { azimuth, elevation })  and set it where you want

which clears `metrics.driven`. `aimWindow` and `lightWindow` stay public, so a
held window can be dialled to anything — a permanent noon shaft in a showcase, a
fixed cold light in a room that should never change.

Both paths share one geometry path and one material path. They differ only in who
writes the material: the builder once, or `WindowLight` every eighth frame.

---

## 8. The pane at night

Two modes, because the answer depends on the room and not on the window.

- **`shine`** — the pane, the halo and the point light keep a floor under them
  once the sun is down, so a dark interior is lit by its windows. The default.
- **`dark`** — the pane goes to black at night. Right for a room lit brightly
  enough that the glass would read as a black rectangle from inside, which is
  what it does.

Set per window alongside `holdWindow`, defaulting to `shine`.

---

## 9. Metrics

    width, height, centreY   as now
    openness                 as now
    azimuth, elevation       as now
    tint                     the rolled hex, multiplied over daylight.colour
    reach                    shaft length cap, default MAX_REACH
    bearing                  per-window yaw override, default 0
    night                    'shine' or 'dark', default 'shine'
    driven                   true; holdWindow clears it

---

## 10. Files

| file | change |
|---|---|
| `src/art/builders/window.ts` | drop the pool; monochrome the ramps; clone the glow material; the new metrics; split `lightWindow` off `aimWindow`; `holdWindow` |
| `src/engine/daylight.ts` | new — the sample struct |
| `src/engine/WindowLight.ts` | new — collect, release, update |
| `src/world/WeatherRig.ts` | fill the sample in `applyLight` and hand it over |
| `src/world/ZoneManager.ts` | own the system and drive it |
| `src/world/Zone.ts` | `bearing` on `ZoneEnvironment` |

---

## 11. What this deliberately does not do

**A window is wired to the global cycle, not to a named exterior.** It knows what
hour it is; it does not know which place is on the other side of its wall.

That is the whole reason lightning is left out. A flash in the shaft would be a
claim that the storm is outside *this* room, and nothing here can make that claim
— the same sun reaches every interior in the world, including one that should be
underground. Building the exterior link is what unlocks lightning through a
window, a cellar that gets no sky, and a room whose outside is a different
weather to the one the player walked in from. It is worth doing on its own terms,
and doing it for the sake of one flash would be doing it badly.

**Nothing knows what stands in front of a window.** A window looking into an
alley between two buildings takes the full beam. The two ends of that are already
covered — a window that gets no light at all is left static, and one in open air
is driven — and what is missing is the middle: driven by the hour, but at a
fraction of the magnitude.

When it is wanted it is one more factor in the product at §5.4, not a new
mechanism, and it is the same place the question of whether a held window keeps
the global dusk ramp gets settled. Neither is worth doing before a window in the
world is visibly too bright for where it stands.
