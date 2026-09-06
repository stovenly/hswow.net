# Climate: the clock, the weather, the sky

**Built.** All fourteen steps below are in the code. What is open is the art
direction — the seven rows of the atmosphere table in `engine/atmosphere.ts`,
the nine rows of the genus roster in `art/glsl/clouds.ts`, and the weather kinds
in `world/climate.ts`. Those are numbers, and they are the repo owner's to move.

Two things this document proposed and the build did not take:

- **The wind field stayed in `audio/weather.ts`.** Moving it would have inverted
  the layering for the offline audition renderer, which needs a wind field with
  no world attached. `Climate` owns the settings and the audio engine steps the
  field, which is the ordering the sway shader already depended on.
- **Every zone is at the origin.** The coordinate system is in
  `ZoneDefinition.place`, and the countryside and the vista showcase declare
  it; the real distances go in when the node map does. A zone that declares no
  coordinate is held clear of the weather, which is what makes the galleries and
  showcases exhibits rather than places.

It replaces `ATMOSPHERE-WEATHER.md` §1 and §2
and leaves §3 (props that make their own air) exactly where it is — that piece is
independent of all of this and can land any time.

Working names throughout.

---

## What already exists

More than the open specs imply. The list matters because it decides what is new
work and what is wiring.

| | |
|---|---|
| `audio/weather.ts` | A global wind field: layered value noise, a slow swell under a faster gust, a **front** that travels — `lagAt(x, z)` delays the same gust downwind, so the far treeline quickens before the near hedge. Read by the audio models, by `sway.ts` through a byte lookup texture, by `ClothActivity`, and by the particle shader. It is already the one-number rule for wind, and it already works. |
| `engine/Sky.ts` | One procedural dome: a three-band gradient plus one fbm cloud deck projected on `direction.xz / direction.y`, a sun disc with a halo, and broad warmth on the sun's side. `skyUniforms` is module-scope and shared, because water reflects into the sky and two copies would be two skies. |
| `engine/fog.ts` | Aerial perspective that is the sky's own colour on its own elevation curve, measured radially, thinning with altitude in closed form. The dome and the air are exactly equal at `direction.y = 0`. |
| `art/finish.ts` | The per-fragment finish stage. `finishRough`, `finishF0`, `finishStrength` are named globals written before the lobes run, and `uFinishSky` is already 1 outdoors and 0 indoors. |
| `art/particles.ts` | `follow` — a camera-carried, wrapping box — is implemented. So is wind coupling off the same gust table, and `uPrecipitation` as the accessibility switch. |
| `debug/ParticleShowcase.ts` | Tuned snow and rain specs, sitting in a showcase. |
| `audio/models/rain.ts` | A rain model with intensity, wind coupling and shelter, and `Soundscape` already accepts a `rain` bed. |
| `audio/models/footsteps.ts` | `snow` and `mud` are already rows in `SURFACES`. |
| `ZoneEnvironment.wind` | A per-zone multiplier over the global wind. "Some zones are always a bit windy" is already supported. |

So: the wind half of item 1 is built, the sound of rain is built, the shape of
rain and snow is built, and the surfaces that would carry them have the hooks.
What is missing is the thing that decides, and the sky that agrees with it.

Two facts constrain everything below.

- **The attribute ledger is at fourteen of sixteen.** Nothing here may spend a
  vertex lane without a very good argument, and neither snow nor rain has one.
- **`skyColour` is called on every finished fragment**, not just on the dome —
  it fills `finishEnv`. Whatever the dome grows is paid for by the whole world.

---

## 1. Climate

One object, `src/world/climate.ts`, owning the clock, the wind field it inherits
from `audio/weather.ts`, and the weather state. The wind maths moves across
unchanged; it is good and it is load-bearing in four systems.

### Channels, not states

Extensibility is the stated requirement — factory wants smog, and whatever comes
after factory wants something nobody has thought of. An enum of weather types
cannot carry that, and neither can a free-form bag, because every consumer would
have to handle a channel it has never heard of.

The answer is a **registry of kinds over a fixed set of effects**. A kind is a
row of data. What a kind can *do* is closed; which kinds exist is open.

```ts
interface WeatherKind {
  name: string;
  /** What falls, if anything. A follow box, straight into the existing system. */
  particles?: ParticleSpec;
  /** What it sounds like. A Soundscape layer, faded by amount. */
  sound?: SoundscapeLayer;
  /** How it colours and thickens the air. Applied over the zone's own fog. */
  air?: AirBias;
  /** How it changes what surfaces are made of. See §2. */
  surface?: 'wet' | 'crust' | 'none';
  /** Which cloud genera it puts overhead, and how much. See §4. */
  sky?: readonly [GenusName, number][];
  /** What it does to the wind, the footstep surface, the groundcover tint. */
  ground?: GroundBias;
}
```

Live state is a sparse map of `name → amount`, almost always one or two entries.
Everything downstream asks `climate.amountOf('rain')` and gets a number.

Smog is then a row with no particles, an `air` bias that tints brown and shortens
`fogFar`, a `sky` of high `altostratus`, and no surface response. It needs no new
code, which is the test the design has to pass.

### The one number rule, generalised

`ATMOSPHERE-WEATHER.md` already states it for rain: the rain you hear and the
rain you see come from the same value. Extend it — **the rain you hear, the rain
you see, the wet on the stones, the grey in the sky and the mud underfoot are all
`amountOf('rain')`.** Nothing downstream keeps its own copy and nothing is tuned
to agree by hand.

### Where weather comes from

The requirement is that it is not per-zone: it is the same day everywhere. So
weather is a function of **world position and world time**, sampled — never a
property a zone declares.

```ts
climate.sampleAt(x, y, t): Map<string, number>
```

A slow 2-D field over the map's kilometres, advected along the prevailing wind,
seeded from `(worldSeed, dayNumber)`. A zone sits at a map coordinate (§5) and
samples it. Two zones in the same valley are under the same shower; a castle
thirty kilometres off is not, and the front that crosses the farm crosses the
town some minutes later because the field is moving in a direction the wind
already knows.

A zone modifies what it samples and never overrides it: `wind` (exists),
`shelter` (a courtyard takes less rain than a field), `exposure`. Interiors force
the particle and surface amounts to zero at the threshold, along with the fog and
the reverb, and keep a muffled sound bed — which `rain.ts` already models.

Per-day generation is a seeded draw biased by region and season, smoothed into
the field so a day arrives rather than switching on. Deterministic from
`(worldSeed, dayNumber)`, so the whole climate is two integers in a save.

### The clock

`timeOfDay` in 0..1 and `day` as an integer. Sun elevation and azimuth from a
simplified solar model with a fixed latitude and a season term off `day`. Day
length is a setting; a twenty-four minute day — one real minute to the hour —
is the usual place to start.

**Season is nearly free once the clock exists** and it earns its keep twice: it
biases which kinds the generator draws, and it moves the sun's arc, so a winter
noon is low and long-shadowed without anything being authored for it.

---

## 2. What the weather does to surfaces

### Rain — recommended, and not hard

The finish stage already computes everything this needs. Two uniforms, one field
per finish row, no vertex data, no new pass.

**Coverage.** How sky-facing a fragment is. The world normal is available with
the trick `SCENE_RAY` already uses — `inverseTransformDirection(normal,
viewMatrix)` — so `smoothstep(-0.1, 0.45, worldN.y)` gives wet floors, damp
walls and dry undersides. Multiply by `uFinishSky` and interiors are dry for
free, with no threshold logic anywhere.

**Porosity, per finish row.** This is the thing that makes it read as *wet*
rather than as *shiny*, and it is one number. Lagarde's point in *Water drop 3b*
is that the wetting effect is not uniform: a rough porous material darkens a
lot and gains a modest sheen; a smooth non-porous one barely darkens and gains a
mirror. So add `soak: number` to the `Finish` table — stone and soil high, glass
and metal zero. Thirty-odd rows, one number each, no GLSL per row.

**The shading.** Applied where the finish globals are written, before the lobes:

```
albedo       *= mix(1.0, 1.0 - 0.35 * soak, wet)
finishRough   = mix(finishRough, min(finishRough, 0.12), wet)
finishF0      = max(finishF0, vec3(0.02) * wet)     // water's own
finishStrength= max(finishStrength, wet * 0.6)      // so plain surfaces get a lobe
```

The sky a wet surface reflects is `finishEnv`, which is `skyColour` — so under
rain it reflects the overcast the same weather put overhead, automatically and
consistently. That is worth stating: the wetness and the sky cannot disagree,
because there is only one sky.

**The delay, the amplification and the resumption — one leaky integrator on the
CPU.**

```
target = amountOf('rain')
tau    = target > wet ? SOAK : DRY
wet   += (target - wet) * dt / tau
```

`SOAK` around twenty-five seconds, `DRY` around three minutes, and `DRY` scaled
by sun elevation and wind — a bright windy afternoon dries in under a minute, a
still overcast evening takes ten. That is exactly the asked-for behaviour and it
falls out of two lines: the gloss lags the rain starting, it keeps climbing while
the rain keeps falling, its ceiling is the rain's rate so drizzle asymptotes to a
damp sheen and a downpour to full gloss, and it lets go slowly afterwards.

**One caution.** The pipeline quantizes to sixty-four levels and dithers. A
narrow specular lobe on a quantized image bands, and worse, crawls as the camera
moves. Keep the wet roughness floor around 0.10–0.12 rather than going to mirror.
This is also the better look — a broad satin sheen suits the painted register
the rest of the game is in.

**Puddles** are a later polish: `wearNoise` in world XZ, gated on `worldN.y >
0.9` and on the ground materials, to break the flat wash. Not phase one.

### Snow — the honest answer

You are right that this is the hard one, and the reason is worth stating exactly.
Wetness gets away with a normal because water runs down a wall and *ought* to be
on the vertical faces. Snow does not run; it lies where it could fall. So snow
needs a **sky-occlusion** term, and the project has no baked AO and two spare
attribute lanes it should not spend.

Four ways, ranked.

**(a) Normal only — "top dusted".** Threshold on `worldN.y`, whiten the albedo,
raise the roughness, lift the value. One uniform, zero risk. It is wrong under
eaves, under a cart, under a dense tree — snow appears on top faces that never
saw the sky. **In practice at this art level it reads fine**, because the great
majority of upward faces genuinely are exposed, and the failures are in shadow
where the eye is not looking. **Recommend this as the shipping version.**

**(b) A per-vertex sky-exposure lane.** Tempting and wrong. Exposure is a fact
about *placement*, not about the object — a barrel is fully exposed until
somebody puts it under an eave — so the lane would have to be computed after
placement, per zone, by a raycast pass over merged geometry. That is a build-time
instrument of exactly the kind the project has ruled out, and it costs an
attribute lane the ledger cannot spare. **Recommend against.**

**(c) Screen-space, in the effect slot.** The chunky depth and normal targets
already exist — GTAO reads both. A short upward cone-march in depth gives real
occlusion, respects the spatial-only rule, and handles eaves correctly. But it
can only see what is on screen, so snow under an overhang that leaves the frame
flickers as you turn. **A later experiment, not a phase.**

**(d) A top-down accumulation map — the good answer.** Render the zone once from
straight above at build time into a small depth target; a fragment is covered if
its world height is close to the height the map records at its xz. One texture
lookup in the finish stage, correct under eaves, no per-frame cost, no attribute
lane, and the machinery is the shadow map's with the camera pointed down. Zone
builds are already async, so the render fits where the geometry is made.

It is worth more than snow: the same map is a **rain shadow**, so the stones
under an eave stay dry and the ones a metre away gloss over. That fixes
wetness's identical weakness and turns two half-solutions into one.

**Recommendation: (a) now, (d) as the upgrade, and (d) serves both.**

Whatever the coverage, snow also wants: the ambient lifted and cooled, because
snow-covered ground bounces light upward and is why a snowy day is not a dark
one; `fogColor` toward white; the footstep surface swapped to the `snow` row that
already exists; the groundcover whitened and shortened through `coverUniforms`;
and the soundscape damped, because snow absorbs.

---

## 3. Day and night

`ATMOSPHERE-WEATHER.md`'s D1–D4 is the right decomposition. What follows is the
detail it leaves open.

### The shadow camera is the one real engineering item

Today the sun sits at a fixed `(-70, 90, 50)` and the shadow camera's near and
far are 55 and 225, tuned around that distance. With a moving sun, place the
light at `target + direction × D` for a constant `D` of about 140 and leave near
and far alone — the box then travels with the sun and its depth range never
changes, which is what keeps the bias valid.

**Clamp the elevation to about eight degrees.** Below that an orthographic box
covering the same ground has to grow enormously and the shadows go to mush and
acne. Below the clamp, ramp `shadow.intensity` to zero as the sun sets rather
than letting the shadows stretch. Nobody sees the clamp; everybody sees the
mush.

### The bright blue night

You want night legible as night without being dark. Do it in the keyframe, not
in a post pass — the pipeline has no exposure control and does not want one.

- **High value, low saturation, blue-shifted.** Zenith around `#1e3a6b`, horizon
  `#3f5f92`, ground `#2a3346`. The night is *pale*, and its nightness comes from
  hue and from flattened contrast rather than from level.
- **Ambient stays high** — around 1.2 on the hemisphere, sky lobe cool, ground
  lobe cool-neutral. The moon is a `DirectionalLight` at about 0.5, `#c8d8ff`,
  and it may as well cast no shadow at all; a weak shadow at that intensity is
  noise, and turning it off is free.
- **Fake the Purkinje shift.** In dim light the eye's peak sensitivity moves
  toward blue and reds go dark first — that is *why* moonlight looks blue, and it
  is a perceptual effect rather than a change in the light. Desaturating warm
  hues faster than cool ones as the sun goes down sells "night" without touching
  brightness anywhere, which is precisely the thing you asked for. It is a
  hue-weighted term in the keyframe interpolation, a handful of lines, and it is
  the highest-payoff idea in this section.
- **Stars** fade in below −6° and are multiplied by `1 - cloudAmount`, so an
  overcast night has none. An overcast night should also be *lighter and flatter*
  than a clear one — a clear night is deep blue with stars, an overcast one is a
  pale even blue-grey. That contrast is a real thing and it costs nothing.
- **The moon disc** reuses the sun-disc code with its own direction, and its
  phase comes off `day`. Phase is worth having: it is a free calendar the player
  can read without a UI.

### The keyframe table

Key it on **sun elevation, not on clock time**. `ATMOSPHERE-WEATHER.md` already
says this and it is right — it makes latitude and season free, and it means one
table serves a winter afternoon and a summer evening without either being
authored.

Stops: −18°, −6°, −2°, +0.5°, +6°, +20°, +60°. Each is a `SkySettings` plus a
light rig plus fog.

**Interpolate in a perceptual space.** An sRGB lerp from a warm horizon to a blue
zenith passes through mud, and it will be visible at exactly the moment — the
half-minute either side of sunset — that everything else here is trying to make
beautiful. Oklab is the cheap correct answer; linear light is the cheap adequate
one.

### Dawn is not dusk

Two biases over one table, keyed on whether the elevation is rising or falling.
Dawn is cooler, cleaner and pinker; dusk is warmer, dustier and more orange,
because the day's convection has put moisture and particulate aloft that the
night settles out. It is a two-line change and players feel it without being able
to name it, which is the best kind.

---

## 4. Skies

The current dome is one fbm layer thresholded twice, which can make exactly one
kind of cloud and makes it everywhere. This section is the largest single body of
work in the document and the one with the most visible return.

### A deck is the unit, and a genus is a row

The sky is up to three **decks** composited from high to low. A deck is a flat
layer read in projection — the machinery already in `skyColourWithSun` — with its
own altitude, its own drift, and its own shape function. A **genus** is a row of
deck settings. Nothing about cirrus lives in code; it lives in a table, the way
a material recipe does.

```ts
interface Deck {
  /** Kilometres. Sets projection, horizon crowding, drift, and the twilight lead. */
  height: number;
  /** Which base field. This is the parameter the taxonomy actually turns on. */
  form: 'fbm' | 'cellular' | 'fibrous';
  /** Noise frequency. With height, this is what fixes apparent cell size. */
  scale: number;
  /** Stretch along the wind. 1 is isotropic; cirrus is six or more. */
  stretch: number;
  /** Threshold and edge, as today. */
  cover: number;
  softness: number;
  /** The most of the sky it may ever take. */
  opacity: number;
  /** How much optical-depth shading it takes. Ice cloud is near zero. */
  shading: number;
  drift: number;
  top: string;
  base: string;
}
```

### Why this parameterisation and not another

Because it is the meteorological one. The WMO separates cirrocumulus,
altocumulus and stratocumulus **by the apparent angular size of the individual
element** — under 1°, 1° to 5°, over 5° — and separates cirrocumulus from
altocumulus by **whether the elements are shaded**. Those are exactly `scale`
against `height`, and `shading`. Three genera fall out of two numbers, honestly,
rather than being three hand-tuned look-alikes that happen to resemble the
plates.

The other axis that matters is `form`, and it is a genuine function switch rather
than a setting:

- **fbm** — billowy, self-similar, soft. Cumulus, stratocumulus, nimbostratus.
- **cellular** — a Worley/Voronoi field. Regular, repeating elements of a
  consistent size. **fbm cannot make a mackerel sky at any settings** — the
  regularity is the whole point of it, and fbm is by construction irregular.
  Altocumulus, cirrocumulus.
- **fibrous** — ridged noise stretched hard along the wind, with the ridges
  sheared. Cirrus, and nothing else.

### The roster

| Genus | Height | Form | Cell | Cover | Opacity | Shading | Reads as |
|---|---|---|---|---|---|---|---|
| Cirrus | 9 km | fibrous | — | low | 0.35 | 0 | Mares' tails, streaked along the wind |
| Cirrostratus | 8 km | fibrous | — | near total | 0.20 | 0 | A milky veil. **The halo gate** |
| Cirrocumulus | 7 km | cellular | < 1° | mid | 0.30 | 0 | Fine unshaded ripples |
| Altocumulus | 4 km | cellular | 1–5° | mid | 0.65 | 0.5 | Mackerel sky, elements *shaded* |
| Altostratus | 4 km | fbm | — | near total | 0.75 | 0.2 | Featureless grey-blue; sun as through ground glass |
| Stratocumulus | 1.5 km | fbm | > 5° | mid-high | 0.85 | 0.9 | Big lumpy rolls with blue between |
| Stratus | 0.5 km | fbm | — | total | 0.9 | 0.4 | Flat, low, featureless. Lifted fog |
| Nimbostratus | 1 km | fbm | — | total | 1.0 | 0.7 | Thick, dark, precipitating |
| Cumulus | 1.2 km | fbm | — | low | 0.95 | 1.0 | Detached heaps, flat bases, sharp edges |

Cumulonimbus is deliberately absent. It needs vertical structure and an anvil
and it is a piece of work on its own; leave it until the rest is standing.

### The five shading terms, in order of what they buy

A deck seen from below is an optical-depth problem, not a lighting one, and that
is good news — the cheap terms are the dominant ones.

1. **Optical depth darkens the base.** `mix(top, base, density)`. Thick parts of
   a deck are grey from underneath because the light has not got through them.
   One line, and it is the difference between "a white shape" and "a cloud".
2. **Forward scatter.** Cloud near the sun is far brighter than cloud away from
   it, whatever its shape.
   `pow(max(dot(dir, sun), 0.0), 4.0)` lifting the whole deck toward the sun
   colour. Two lines, and at sunset it is most of the effect.
3. **The silver lining.** Where density is just over the threshold the cloud is
   thin and scatters forward, so edges are the brightest part of an overcast.
   A `smoothstep` band just above `cover`, brightened, and weighted by the same
   sun-facing term as (2).
4. **Sunward flank.** Take the gradient of the density field by finite difference
   — two extra taps — and light `dot(gradient, sunDirection.xz)`. This is what
   gives a heaped deck a lit side and a dark side. Worth it on the low deck
   only; on cirrus it is invisible and on stratus there is nothing to light.
5. **Parallax heaping.** Displace the sample point by the density field itself,
   along the view ray's own direction across the plane. It costs one extra tap
   and it turns a flat deck into something with apparent thickness — a cumulus
   whose near edge overhangs its far edge. This is the only affordable way to
   make cumulus look heaped rather than painted.

### The two details a cloud nerd will actually notice

**High cloud lights before the low cloud does, and holds it after.** At nine
kilometres the geometric horizon dip is about 2.9°, so the sun is still shining
on cirrus for roughly twelve minutes after it has left the ground — which is why
the sky goes grey below while the streaks overhead are still burning pink. It is
one number per deck: `effectiveElevation = sunElevation + dip(height)`, feeding
that deck's own sun colour. One line, and it is the most specific thing in this
whole document.

**Fair-weather cumulus have a daily cycle.** They form from surface heating two
or three hours after sunrise, peak mid-afternoon, and dissipate into a clear
still evening. A clear dawn, a puffy afternoon and a calm empty dusk is a shape
everyone recognises without being able to name, and once there is a clock it is a
curve on `cumulus` amount keyed to hours-since-sunrise. Free, and it makes the
day feel like a day rather than like a lighting rig turning.

### Sequences, not states

The reason to have a genus table at all is that real weather arrives in an
**order**, and the order is authorable as data once the decks are rows.

A warm front, over about a day of game time:

> cirrus thickening → cirrostratus, and the halo appears → altostratus, the sun
> goes to a bright smear → nimbostratus, and it rains → the front passes →
> stratocumulus breaking → cumulus in the clearing air

That sequence is a curve per genus against the front's position, and because the
weather field moves across the map (§5) it plays out on its own as the front
crosses. **The player can learn to read the sky and be right**, which is a much
better thing than weather that merely varies.

Two cheaper ones worth having: valley stratus at dawn burning off by mid-morning
(ties to `altitude`), and a cold-front squall — a fast narrow band of heavy rain
and a hard wind shift, clearing to sharp cumulus behind it.

### Cloud shadows

Sample the low deck's density from a lit fragment, projected up the sun
direction onto the deck plane, and darken. One fbm tap in the lighting term.

It is not cheap and it is not optional-feeling once seen: a cloud shadow crossing
a field is the thing that makes the sky and the ground the same place, and
because the decks drift on the wind the shadows travel in the direction the trees
are already bending. Budget it deliberately — it is the only item in this section
that costs per lit fragment rather than per sky pixel.

### The cost trap, stated plainly

`skyColour` is not just the dome. It fills `finishEnv` on every finished
fragment, and water calls it for its reflection misses. Three decks with five
shading terms there would be tens of noise evaluations per lit pixel in the
world.

**Split it: the full function for the dome, a one-layer approximation for
`finishEnv` and water.** A reflection in a wet cobble does not need cirrus
resolved. `skyColourWithSun`'s `sunScale` parameter is already the precedent for
a caller telling the sky how much sky it wants.

The dome itself is affordable — it draws at chunky resolution with depth test
off, so it is a few hundred thousand pixels and can carry real work.

### Atmospheric phenomena, by payoff

| | How | Cost |
|---|---|---|
| **Belt of Venus and the Earth's shadow** | At −2° to −6°, a pink band 10–20° above the *anti-solar* horizon with a blue-grey wedge under it. Two mix terms in `skyBand` keyed on `dot(dir, -sunDir)`. | ~5 lines, and the best value here |
| **Forward scatter, base darkening, silver lining** | above | ~6 lines together |
| **22° halo and sun dogs** | A faint ring at 22° from the sun, gated on cirrostratus amount. A smoothstep on the dot product. | ~4 lines — and it is precisely the cloud-nerd bait |
| **Rainbow** | A 42° arc opposite the sun, gated on rain falling *and* sun elevation between 0 and 40°. | ~8 lines, and the most memorable single weather beat available |
| **Cloud shadows** | above | Moderate, and per lit fragment |
| **Alpenglow** | Warm tint on `aerialAir` when the sun is below the horizon and distant land is not. **On the air, never on the ridge** — `VISTA.md` is emphatic that nothing drawn on the dome may enter the haze, and this must respect it | small, but it is near the tripwire |
| **Virga** | Precipitation that fades before it lands. | one field on `ParticleSpec` |
| **Crepuscular rays** | Already scoped in `SHADERS-V2.md`, which correctly parks them behind D1 and D2 | its own pass |

## 5. The map grid

**Recommended, and cheap — but not for the reason it first suggests.** The
honest case is worth setting out, because one of the benefits people expect from
this does not survive contact with the sky's own geometry.

```ts
interface ZonePlace {
  /** Kilometres, in the world's own frame. The node map's fiction made numeric. */
  at: readonly [number, number];
  /** Which climate row this place draws from. */
  region: RegionName;
  /** Metres above the datum. What decides rain against snow. */
  altitude: number;
}
```

Zones are currently a portal graph with no coordinates at all, so this is new —
but it is three fields on a definition, roughly ninety lines across the whole
catalogue, and one `sampleAt`.

### What it genuinely buys

- **Weather becomes one field, sampled.** Zones in the same valley are under the
  same shower with nothing authored. This is the stated requirement — the same
  day everywhere — and this is the thing that satisfies it. It would be worth
  doing for this alone.
- **Fronts arrive in the right order.** Rain reaches the upwind farm before the
  town, and `lagAt` already knows how to compute that delay. The player *can*
  verify this one, because they walked the distance themselves.
- **Altitude gives rain against snow for one subtraction.** The mountain node is
  under snow while the town below it is under rain, on the same day, from the
  same field.
- **The sun's bearing and the wind's bearing are world facts.** This is a
  correctness argument rather than a flourish: a sun that jumps compass quarters
  between two nodes you can see from each other is the kind of wrongness that is
  felt without ever being spotted.
- **Cloud continuity across a crossing.** Offset the deck sample by the zone's
  coordinate and the sky does not reshuffle when you walk from the town to the
  farm you could see from it. The clouds that were over there are now overhead.
  This is the version of "shared sky" that works, and it works because it is
  about the sky *overhead*, not the sky at the horizon.

### What it does not buy, and why

The tempting version is: put a distinctive cloud over one place and see it from
another. The geometry says no, three times over.

- **Angular size collapses.** A deck at 1.5 km seen from 5 km away sits at 17°
  elevation — fine. At 20 km it is at 4°, and a 1.5 km cloud there subtends
  about 4°. It is a smudge.
- **That band is already faded on purpose.** The dome fades the cloud layer over
  `smoothstep(0.0, 0.18, direction.y)` — roughly ten degrees — because the
  projection stretches to infinity at the horizon and the noise turns to mush.
  So anything past about eight kilometres is erased by the very term that keeps
  the deck from falling apart. Removing the fade to save the feature would break
  the deck everywhere.
- **The horizon band belongs to the fog and the vista.** `VISTA.md` is emphatic
  that nothing drawn on the dome may enter the air and that the dome and the
  haze must agree exactly at `direction.y = 0`. Putting *distinctive* content at
  four to ten degrees is fighting a system deliberately built to make that band
  featureless.

And even setting the geometry aside: nobody remembers a cloud's shape. The claim
is unverifiable in a way that "it was raining over there and it is raining here
now" is not.

### The exception — sell it with a column, not a deck

There is one case where "something in the sky over there" works, and it works
because it is **tall rather than wide**. A ten-kilometre column at twenty
kilometres' distance still stands at 27° elevation — clear of the horizon fade,
unmistakably over there, and readable as a landmark.

So: a cumulonimbus anvil over the mountains, or the factory's plume standing over
the works, is a **placed object drawn on the dome's layer at a map bearing and
distance** — geometry or a billboard, not a deck feature. The coordinate grid is
exactly what makes it placeable, and it is a far better answer to the underlying
want than trying to make a flat layer carry local news.

### One caution about the coordinates themselves

The map is fiction and it will be re-laid. **Seed weather from a coordinate;
never key authored content to one.** "It rains more in the west" is a region row
and survives a re-lay; "it always rains at (4, 7)" does not.
## 6. Spyro, and what is actually transferable

The research, first, since it is short and mostly not about technique.

The PS1 skies were **vertex-coloured sphere meshes** — colour painted per vertex
and Gouraud-interpolated, no texture at all. That is where the faceted triangular
gradient comes from, and it was a space decision before it was a look. Insomniac
kept **a whiteboard of every level's sky and core palette** from early in
development, because changing a sky changed a level more than anything else they
could do to it. Their stated rules: **a level's core palette is two or three base
colours**, developed in shades and values with small complementary accents;
**contrast the world against its sky and mind the saturation difference** — a
saturated terrain wants a desaturated sky or the horizon flattens and the player
loses their bearings; base textures were kept deliberately desaturated *because*
vertex colour on top compounds saturation. Unearthly sky colours read as wrong
rather than as dramatic — a misty green sky read as poisonous, not threatening.
And the Artisan world alone spanned daybreak, mid-afternoon, sunset and full
moon: variety of *hour* was their main tool for making levels distinct while
sharing an identity.

One thing does not transfer. Insomniac did not fog to cull, so their levels were
shaped to hide geometry. This project has a considered aerial-perspective model
and a three-band vista that depends on it. Take the colour lessons; leave the
occlusion ones.

What that means here, concretely:

1. **The dome is already the same idea, better executed** — a colour function of
   a direction with no texture anywhere. So the transferable part is not the
   technique, it is the **authoring discipline**. Build the whiteboard: a table
   of named skies, each two or three colours, and never author a sky ad hoc at a
   call site. The recipe system is already this pattern for materials, and it
   works.
2. **Keep cloud colour desaturated against the gradient.** `#f2f5f8` is right.
   Resist tinting clouds directly at sunset — tint the *light on* them through
   the forward-scatter term, so the base stays neutral and cannot compound.
3. **The faceting is worth stealing on purpose.** Evaluating a layer per vertex
   instead of per fragment gives soft triangular banding for free, and it would
   sit beautifully with the pixelation and the sixty-four-level quantizer this
   pipeline already has. **Only ever for a decorative layer** — never the horizon
   band, because the fog reads `skyAir` per fragment and the two must be exactly
   equal at `direction.y = 0`.
4. **Hours as identity.** Since the clock is global, the node map can carry a
   preferred arrival hour per zone: the farm is a morning place, the castle an
   evening one, without breaking the world clock. That is Insomniac's main
   distinctness tool, available here for one field. It is an art-direction call
   and therefore yours, not mine.

---

## 7. The steps

Fourteen, in order. Each says what it is, what it touches, and what has to be
true before it counts as done. Only step 1 blocks everything; after it the three
tracks — light, weather, sky — run independently, and the *needs* line on each
step says what it actually waits for.

---

**1. The Climate object.**
New `src/world/climate.ts`. Move the wind field out of `audio/weather.ts`
unchanged — the noise, the swell, the gust, `lagAt`, `strengthAt`, all of it —
and have `AudioEngine.weather` read the new owner. Add the clock (`timeOfDay`,
`day`, sun elevation and azimuth from a fixed latitude and a season term). Add
the `WeatherKind` registry and `amountOf(name)`. Dev panel gets a time scrub and
one slider per registered kind.
*Needs:* nothing.
*Done when:* **nothing on screen has changed.** The panel's weather folder drives
the same wind it drove before, the trees bend the same way, and scrubbing time
moves a number that nothing reads yet.

**2. Map coordinates.**
`ZonePlace` on `ZoneDefinition` — `at`, `region`, `altitude`. Fill it in for the
catalogue. Wire `climate.sampleAt(x, y, t)` so a zone's weather is sampled at
its coordinate rather than declared.
*Needs:* 1. Do it alongside 1 while the zone data is already open.
*Done when:* two zones at the same coordinate report the same weather, a zone
thirty kilometres off reports different weather, and the readout shows both.

**3. Sun path and the shadow camera.**
`PostFX.aimSun` goes per-frame instead of once at start-up. The sun light moves
to `target + direction × 140` so the shadow box travels with it and near/far
never change. Clamp the elevation at about 8°, and ramp `shadow.intensity` to
zero below the clamp rather than letting the box grow.
*Needs:* 1.
*Done when:* scrubbing time swings the sun, the drawn disc and the shadows
together; shadow contact stays tight through golden hour; the clamp is invisible;
frame cost is unchanged.

**4. Atmosphere keyframes.**
New `engine/atmosphere.ts`: a table keyed on **sun elevation**, not clock time,
with stops at −18°, −6°, −2°, +0.5°, +6°, +20°, +60°. Each stop is a
`SkySettings` plus the light rig plus the fog. Interpolate in Oklab. Bias dawn
cooler and pinker than dusk.
*Needs:* 3.
*Done when:* a full scrubbed cycle has no visible snap anywhere, the fog repaints
the distance with the dome at every stop, and the horizon seam holds — the dome
and the air are still exactly equal at `direction.y = 0`.

**5. Night.**
Stars faded in below −6° and multiplied by `1 - cloudAmount`. A moon disc reusing
the sun-disc code, with its phase off `day`. A moon `DirectionalLight` around 0.5
at `#c8d8ff`, casting no shadow. The bright-blue keyframe: high value, low
saturation, ambient left high. The Purkinje tilt — warm hues desaturating faster
than cool ones as the sun goes down.
*Needs:* 4.
*Done when:* night reads unmistakably as night, the player can still see to
walk, an overcast night has no stars and is paler than a clear one, and nothing
anywhere has been dimmed to achieve it.

**6. Precipitation.**
Wire `WeatherKind.particles` into the existing particle system as a `follow`
box. Amount drives count and opacity. The rain bed fades in on the same number.
Crossing a threshold stops it with the fog and the reverb, and resumes it on the
way back out.
*Needs:* 1.
*Done when:* **the wrap gate passes** — a hundred metres walked in a straight
line never runs out of snow and never shows a seam, and looking straight up shows
no popping. Walking into an interior stops the snow at the threshold; walking out
resumes it; turning the intensity down makes the sound and the sight answer
together.

**7. Wet surfaces.**
`uWetness` and `uWetSpec` in the finish stage. A `soak` field on every `Finish`
row — high for stone and soil, zero for glass and metal. Coverage from the world
normal, gated by `uFinishSky`. The leaky integrator on the CPU: about 25 s to
soak, about 180 s to dry, drying scaled by sun elevation and wind.
*Needs:* 1. Independent of 3–5, so it can run in parallel with the whole light
track.
*Done when:* rain starts and the cobbles gloss over about half a minute later;
it stops and they take minutes to come back; a downpour goes visibly further than
a drizzle; undersides and interiors stay dry with no special-casing; and the wet
highlight does not band or crawl against the quantizer.

**8. Cloud decks.**
New `art/glsl/clouds.ts`. Three decks composited high to low. The `Deck` record,
the three form functions (fbm, cellular, fibrous), the genus table, and the five
shading terms. Per-deck twilight lead from the horizon dip. A cheap one-layer
path for `finishEnv` and for water's reflection misses.
*Needs:* 1. Far better after 4, but not blocked by it.
*Done when:* cirrus, altocumulus and stratocumulus are distinguishable named
presets that a person can tell apart without being told which is which; the
horizon seam is unchanged; and `finishEnv`'s cost is flat against today's.

**9. Cloud shadows.**
Sample the low deck's density from each lit fragment, projected up the sun
direction onto the deck plane, and darken.
*Needs:* 8.
*Done when:* a cloud shadow crosses a field in the direction the trees are
bending, and the per-frame cost is measured and written down — this is the only
item here that costs per lit fragment rather than per sky pixel.

**10. Weather sequences.**
Data, not code. Genus amounts as curves against a front's position, so a warm
front plays out on its own as it crosses the map: cirrus, cirrostratus and the
halo, altostratus, nimbostratus and rain, then stratocumulus breaking behind it.
Plus the diurnal cumulus curve and valley stratus at dawn.
*Needs:* 8, 2.
*Done when:* the sky ahead of rain is reliably different from the sky behind it,
and a player who watches can tell which is coming.

**11. Snow surfaces.**
Normal-only coverage — threshold on the world normal, whiten, raise roughness,
lift the value. Ambient lifted and cooled. `fogColor` toward white. Footstep
surface swapped to the `snow` row that already exists. Groundcover whitened and
shortened through `coverUniforms`. Soundscape damped.
*Needs:* 6, 7.
*Done when:* a snowy zone reads as snowy, is not darker than a clear one, and
sounds right underfoot — and the known failure, snow on top faces under an eave,
is accepted and written down rather than patched around.

**12. Atmospheric phenomena.**
The Belt of Venus and the Earth's shadow at −2° to −6°. The 22° halo, gated on
cirrostratus. The 42° rainbow, gated on rain falling and the sun between 0° and
40°. Alpenglow as a tint on `aerialAir`, never on the ridge.
*Needs:* 4, 8.
*Done when:* each appears only in its own conditions and never otherwise, and
none of them has put anything into the haze that the vista band has to fade.

**13. The accumulation map.**
Render each zone once from directly overhead at build time into a small depth
target. One lookup in the finish stage decides whether a fragment saw the sky.
Replaces step 11's normal-only coverage and gives step 7 a rain shadow.
*Needs:* 7, 11.
*Done when:* snow does not lie under an eave, stones under an eave stay dry while
stones a metre away gloss over, and zone build time is measured and acceptable.

**14. Lamps.**
A dusk-to-dawn schedule on the glow-brightness uniform. A per-prop `uLit`
attribute only if one global proves too blunt.
*Needs:* 5.
*Done when:* the village lights itself at dusk and blooms.

---

### The three tracks

```
1 ─┬─ 2
   ├─ 3 ─ 4 ─ 5 ─ 14          light
   ├─ 6 ─ 7 ─ 11 ─ 13         weather and surfaces
   └─ 8 ─ 9 ─ 10              sky
              └─ 12 (also needs 4)
```

If only two steps beyond the first are ever built, make them **7** and **8** —
wet stone and real clouds are the two most visible things in this document, and
neither waits on the clock.

### Risks worth naming up front

- **The sixteen-attribute ledger** is at fourteen. Neither snow nor rain may
  spend a lane; step 13 exists partly so neither has to.
- **`skyColour` runs per finished fragment**, not just on the dome. Step 8's
  split is the single most important performance decision here.
- **Quantization plus a narrow specular lobe bands and crawls.** Floor the wet
  roughness near 0.1 — which is also the better look.
- **The moving sun forbids baking.** Already locked, and nothing here asks for an
  exception.
- **The horizon seam.** Every new sky layer must be either invisible at
  `direction.y = 0` or present identically in `skyAir`. Three decks is three new
  chances to break the one line the vista band cannot afford.
- **Precipitation must stop at a threshold** with the fog and the reverb, and
  resume on the way out.
