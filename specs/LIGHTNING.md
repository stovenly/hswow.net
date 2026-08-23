# Lightning and thunder

Storms: the cell that makes them, the flash that lights the world, the channel
you can see, and the peal that arrives afterwards from wherever the bolt was.

This is a research and design document. Nothing here is built. It is written
against the code as it stands, and every claim about the existing systems below
was read out of them rather than remembered.

Working names throughout. The numbers are placeholders and are the repo owner's
to move, as the atmosphere table and the genus roster already are.

**The short version.** A storm is one more row in `WEATHER_KINDS`, and it costs
two new fields on the row rather than a system. A *strike* is a discrete event,
which nothing in the climate has needed before, and it is drawn from a hash of a
time bucket so that it stays what the climate already is: sampled everywhere,
stored nowhere. The flash enters the world in exactly one place — `skyBand` —
which is what makes the dome, the fog, the water and every reflection light up
together for one add. The channel is a ribbon mesh on the glow layer, because
the camera's far plane is 500 m and anything past that has to be sky. Thunder is
a line source: twenty filtered noise arrivals spread over the channel's own
length, delayed by distance over the speed of sound the climate already knows.
It is not an ambience signal — it is geophony, so it stays the rig's and it
*causes* the director's hush rather than being subject to it, which is the best
thing here and costs one call.

---

## What already exists

The list decides what is new work and what is wiring. Nearly all of this is
wiring.

| | |
|---|---|
| `world/climate.ts` | `WEATHER_KINDS` is an open registry over a closed set of effects; `sample()` writes one amount per kind per frame from time and map position. `temperature` is already modelled, and it is what the speed of sound depends on. `precipitation`, `precipitationSoon` and `precipitationPast` are already three samples of the same field six hours apart — which is a rain *gradient*, and therefore already knows whether the weather is coming toward you or leaving. |
| `world/WeatherRig.ts` | Applies the climate once a frame: the light rig, the dome, the decks, the falling, the sound and the wet. It already owns a scene-level `root` that survives every threshold, already builds and destroys particle systems on demand, and already fades the weather bed indoors rather than cutting it. |
| `engine/Sky.ts` | `skyUniforms` is module-scope and shared. `skyBand` is called by **both** `skyGradient` (the dome) and `skyAir` (the fog), which is the hook the whole flash design hangs on. `uSkyLight` already carries "what lights the decks, and how hard", and it is already swapped between sun and moon. |
| `engine/atmosphere.ts` | Seven rows keyed on sun elevation, interpolated in Oklab, producing sun, fill and ambient scales and colours that the rig then modifies before handing on. A flash is one more modification in a place that already takes several. |
| `art/glsl/clouds.ts` | Nine genera, each a data row. `planSky` lets **one weather kind put a genus in two different decks**, which is exactly what a cumulonimbus with an anvil needs and means the sky costs no new machinery. |
| `art/glow.ts`, `engine/Bloom.ts` | `GLOW_LAYER` plus an additive, depth-tested, non-depth-writing material is all it takes to make something bloom. Bloom's emitters pass borrows the scene depth, so a channel behind a hill is occluded for free. |
| `audio/models/rain.ts` | The bed-and-events shape, `createGrainBed`, `poissonGap`, and a live `setIntensity`. Thunder is the same shape with the bed removed and the events spread by geometry instead of by a Poisson clock. |
| `audio/dsp/impact.ts`, `dsp/clock.ts` | `excite`, `crush`, `thump`, and `createEventClock`. Everything a peal is made of. |
| `main.ts` | The dev panel builds one slider per row of `WEATHER_KINDS` in a loop. **A storm row gets its control with no panel code**, and holding it at 1 is the test harness. |
| `audio/ambience/conditions.ts` | `Conditions` — what the world is doing, filled once a frame by `WeatherRig.applyAmbience` into one module-scope struct and pushed to the director. It names weather kinds one by one: `rain`, `snow`, `fog`, beside `wet`, `lying`, `wind`, `gust`, `indoors`. `weatherDamp` is what the falling weather already takes off the top of everything alive. |
| `audio/ambience/director.ts` | The rack, the pump and the ring. **`hush()` is public**, and it is what a thunderclap wants: it drops the biophony to zero over about 0.4 s, holds for 15–40 s, and lets it back in wake order. The keynote and the geophony do not take part. |
| `audio/ambience/spec.ts` | `Window` — the closed set of gates a cast member may require, whose own doc says it is "the same split `WeatherKind` makes". `Driver` — what a continuous layer's level follows, already carrying `rain`, `snow` and `fog`. `Signal.hushes` — "alarm calls, and anything loud enough to". |
| `ui/options/model.ts` | `reducedMotion` is an umbrella over five motion switches, and `effective()` is where an option overrides another. `precipitation` is the precedent for "an accessibility option rather than a video one". |

Four facts constrain everything below, and all four were checked.

- **The camera's far plane is 500 m** (`Viewport.CAMERA_FAR`). Nothing past it
  can be geometry. A bolt three kilometres away is a sky phenomenon or it is
  nothing.
- **`skyColourWithSun` runs on every lit fragment** through `finishEnv`, and on
  every reflection miss in the water. Whatever the sky grows, the whole world
  pays for.
- **The sky's own rule**: every new sky layer is either invisible at
  `direction.y = 0` or present identically in `skyAir`. A flash that lights the
  dome and not the haze puts a seam along the horizon for the length of the
  flash, which is exactly the frame the player is looking hardest at.
- **`dt` is clamped to 0.1 s** in `Loop`, and the frame rate can be capped to
  30. A flash is 150 ms. It must therefore be a **function sampled at the
  current time**, never an envelope stepped frame by frame — one skipped frame
  must lose a stroke's brightness, not the stroke.

---

## 1. The storm is a row

Everything in this section is data, and it lands in `world/climate.ts`.

```ts
{
  name: 'storm',
  onset: 0.74,
  pace: 0.9,
  season: (phase) => 0.15 + SUMMER(phase) * 0.85,
  daily: (hour) => 0.2 + convection(hour) * 0.8,
  air: { colour: 0x6a6f7a, colourMix: 0.35, far: 0.7, darken: 0.25 },
  sky: [['cumulonimbus', 1], ['cirrostratus', 0.55]],
  ground: { wind: 0.5 },
  blow: 0.5,
  strike: { rate: 5, kinds: [...] },
}
```

Two new fields on `WeatherKind`, and they are the whole extension:

- **`daily?: (hour: number) => number`** — the partner to `season`. A storm is a
  convective weather and convective weather has a time of day; the sine
  `planSky` already uses for cumulus is the same curve, and it should be lifted
  out and shared rather than written twice.
- **`strike?: StrikeBias`** — what a kind throws, how often, and which channels
  it draws. Absent means a kind never flashes, which is every existing row.

### Where a kind is still spelled by hand

`CLIMATE.md` promises that a new kind "needs no code anywhere downstream". That
is true of the climate, the rig, the sky, the particles, the surfaces and the
dev panel, and it is **no longer true of the audio ambience**, which arrived
after that promise and names its weather one field at a time.

Three places, all in `src/audio/ambience/`, and all one line each:

| | |
|---|---|
| `Conditions` | `rain`, `snow`, `fog` as named numbers. Add `storm`, and one line in `WeatherRig.applyAmbience` beside the three that are already there. |
| `Driver` | What a continuous `air` or `chorus` layer's level follows. Add `'storm'` so a vibe's keynote can lean on one. |
| `Window` | The closed gate set. Add `storm?: Span`, and `after: 'storm'` alongside `after: 'rain'`. |

This is not a fault in either design. `Window`'s own doc says which fields exist
is closed and which voices exist is open — "the same split `WeatherKind`
makes" — so both systems are deliberately closed at exactly this joint, and a
new kind that wants to be *heard about* pays three lines to cross it. Worth
stating plainly rather than discovering it at L5.

### The moisture gate

A storm needs water in the air, and the climate has already sampled it three
times. Any kind declaring `strike` is multiplied by

```
smoothstep(0.12, 0.45, max(precipitation, precipitationSoon, precipitationPast))
```

This is the one place a row's contents change the draw rather than only the
output, and it is worth being honest about that. It buys three things at once:

1. A storm can never appear in a fortnight of clear weather.
2. **Dry lightning ahead of the rain falls out for free.** `precipitationSoon`
   high with `precipitation` at zero is a cell approaching, and that is exactly
   the evening where the sky flickers over the hills an hour before the first
   drop.
3. The storm outlives the shower behind it, through `precipitationPast`.

If the special case is unwanted, the general form is a `damp?: number` field on
the row and `smoothstep(0, damp, …)` in the loop. Same result, one more number
nobody will ever set to anything but one value.

### Cumulonimbus

A tenth genus row. The three deck slots hold one genus each and a real
cumulonimbus spans all three, so it is modelled as what the player actually
stands under: a very dark, total, heaped low deck, with `cirrostratus` put in
the high slot as the anvil's ice. `planSky` already supports one kind naming two
genera at two levels, so this is two rows of the `sky` array and nothing else.

```
cumulonimbus: level 'low', height 0.8, form 'heap', element 2.4,
  cover 0.97, softness 0.5, opacity 1, stretch 1.2,
  shade 0.62, glow 0.12, base 0.62, ripple 0, grey 0.66
```

`base` well above nimbostratus's is the point of the row: what says
cumulonimbus from underneath is that the bottom of it is nearly black.

**What this does not give:** a tower. There is no vertical extent in the deck
model and there should not be one for this — a deck is a projection onto a
height, and a cumulonimbus drawn as a tower is a second cloud system. The tower
is a thing you see from ten kilometres away, and at ten kilometres away it is
the vista band's problem, not the sky's.

---

## 2. A strike is an event, drawn and not stored

This is the only genuinely new idea in the document. Everything the climate does
today is a continuous field sampled at a coordinate; a strike is discrete, and
discrete state is what "sampled at a map coordinate, never declared" was written
to avoid.

**Keep the property.** Cut game time into buckets — call it four seconds — and
give bucket *n* a strike if `hash(seed + n)` clears a threshold set by
`amountOf('storm') * strike.rate`. Everything about that strike — its bearing,
its range, which row of the lightning table it is, how many return strokes it
has and where every kink in its channel sits — comes from further hashes of the
same *n*. Nothing is stored.

What that buys, and it is worth listing because it is the same list `Climate`
already earns elsewhere:

- Two zones in the same valley see the **same storm**, with the same bolts in
  the same places, without talking to each other.
- Scrubbing the clock in the dev panel scrubs the lightning with it.
- A zone rebuild — which `evict` does routinely, on the promise that builders
  are seeded — gives back the same weather it took away.
- Nothing to serialise when there is a save.

The rig holds one small piece of live state: the **pending peals**, because a
sound that is forty seconds late has to be somewhere while it waits. That is a
queue of at most a handful of entries, and it is state about audio scheduling
rather than about the world.

### Where a strike is

Two numbers, drawn from the strike's own hash and biased by the rain gradient:

- **Bearing.** Uniform, except that a cell is upwind of where it is going, so it
  is biased toward `windDirection` by however much the field is moving.
- **Range.** Drawn against `closeness = precipitation` at this place. Rain
  hammering here means the cell is on top of you and strikes are drawn from the
  near end; a dry field with rain coming means the cell is over there, and they
  are drawn from the far end. This is why no new field is needed to know where
  the storm is: the rain already says.

---

## 3. The kinds of lightning

Rows, as the genera are rows. Names are meteorological because they are the
clearest available, not because the game will use them.

| row | range | strokes | channel | flash | thunder |
|---|---|---|---|---|---|
| **sheet** — in cloud, no channel visible | 4–18 km | 1–2 | none | 0.25 | soft, long, all rumble |
| **forked** — cloud to ground, the ordinary one | 1.5–9 km | 3–5 at 40–90 ms | fork | 1.0 | crack then a long peal |
| **crawler** — along the cloud base, cloud to cloud | 2–10 km | 1, long decay | crawl | 0.4 | a wide, late, formless roll |
| **near** — a ground strike close enough to be frightening | 0.2–1.5 km | 1–2 | fork, wide | 3.0 | rip, then a hard bang |
| **horizon** — a cell beyond the range of its own sound | 18–40 km | 1 | none | 0.1 | **none at all** |

Two things in that table do most of the work.

**Return strokes.** A single flash reads as a camera going off. Three or four
strokes 40–90 ms apart, each dimmer than the last, is what reads as lightning,
and it is what real cloud-to-ground lightning does — the channel is reused by
successive strokes down the same ionised path. This is also the single biggest
photosensitivity problem in the design; see §8.

**The horizon row exists so that distant lightning is silent.** Thunder is
inaudible past about fifteen kilometres, and a flash with no sound is a real and
recognisable thing — it is what people call heat lightning. Having a row for it
removes the awkward case of a peal pending for two minutes, and it is free
accuracy.

Which row a strike draws is the row weights multiplied by how close the cell is:
overhead, `near` and `forked` dominate; far off, `sheet` and `horizon` do. The
day never sees a `near` bolt from a storm that is ten kilometres away, which is
the whole reason the weighting is against closeness and not flat.

The row carries what the flash and the peal both need, so the two cannot
disagree: how many strokes and how far apart, the peak light, whether a channel
is drawn and how far it wanders, how much of the peal is crack against rumble,
and how many kilometres of channel the peal is spread over.

---

## 4. The flash

The flash has to reach the dome, the haze on the distant hills, every surface it
lands on, the water, and the reflection in a wet cobble. Doing that in four
places is four things to keep in agreement. It is done in two.

### One add in `skyBand`

```glsl
vec3 skyBand(vec3 direction, float up, float down) {
  ...
  return mix(colour, uSunColor, ...) + uFlashAir;
}
```

`skyBand` is the shared body of `skyGradient` and `skyAir`. One vec3 add there
puts the flash into:

- the dome, because `skyGradient` draws it;
- the aerial perspective, because `skyAir` colours it — so the horizon band
  lights up **with** the sky and the seam rule is satisfied by construction
  rather than by care;
- `finishEnv` on every lit fragment, because `skyColourWithSun` calls
  `skyGradient`;
- the water, because its reflection miss calls `skyColour`.

Cost when nothing is flashing: one vector add per call to a function that
already runs two `mix`es, a `pow` and a `dot`. It is inside the noise.

### A second, structured term in the dome only

`uFlashGlow` — `vec4(direction toward the flash, strength)` — brightens the
quarter of the sky the bolt is in, weighted by a dot product and pushed into the
deck's lit and shade colours. This is what makes sheet lightning look like a
cloud lit from inside rather than the whole sky blinking. It is applied where
the decks are composited, which is the dome path only, so the whole world does
not pay for it.

### The light rig

`WeatherRig.applyLight` already modifies the atmosphere sample before handing it
on — the overcast block above it does exactly this. The flash adds:

- **ambient**: `ambientScale` scaled up by the flash, `ambientSky` pushed hard
  toward the channel's blue-white. This is most of the effect and it is what
  makes a night flash light the ground.
- **fill**: aimed at the strike's bearing and boosted. The fill light is already
  moved every frame by `aimKeyLight` and it casts no shadow, so this is free and
  gives the flash a direction without touching the shadow camera.

**The key light is not moved.** A strike lasts three to eight frames; swinging
the shadow camera and putting it back is a change of shadow direction the eye
has no time to read and the shadow map every reason to alias on. Shadows that
snap to the bolt are a real and wanted effect and they are a **later, optional
step** with a cost that must be stated when it is taken: a second
shadow-casting `DirectionalLight`, enabled only during a flash, is one more full
scene depth render on the frames it is on — acceptable at a few frames per
strike, and worth nothing at all if it is left enabled.

### Bloom, and the quantizer

The sky is not on `GLOW_LAYER`, so the sky flash does not bloom, and that is
right — a smeared sky is a smeared frame. The **channel** is on the glow layer
and does bloom, which is what gives it a halo.

The output shader encodes sRGB, then quantizes to `levels` per channel with a
dither. A flash that saturates to white for three frames is a white frame, which
is what lightning does. The risk is banding on the ramp *out*, and the dither
already spreads a whole quantization step; if it shows, the answer is a shorter
ramp, not a smoother one.

---

## 5. The channel

`src/art/bolt.ts`, beside `sparkle.ts` and `particles.ts` — art, but not a
builder, because it makes no object anybody places.

- **One mesh, built once, rewritten per strike.** A fixed vertex budget — say
  256 — as a camera-facing ribbon; a strike rewrites the position and colour
  attributes and uploads them. Unused segments collapse to a degenerate point.
  Nothing is allocated per strike, which matters because the strike rate at full
  storm is several a minute and this project's per-frame allocation behaviour is
  already documented as a concern.
- **Its own additive material on `GLOW_LAYER`**, matching `GLOW_MATERIAL`'s
  depth behaviour: tested, not written.
- **It must be added to the list in `PostFX.hideGlowFromEdges`** — L1 renames
  that to `hideGlowFromNormals`, which is what it has done since the edge
  detector went. The hook is live and still called, and what it does is keep
  glow and cover materials out of the normal pass. A bolt material that is not
  in the list draws a ribbon of wrong normals into that buffer, and the ambient
  occlusion computes against it for the length of the flash: a smear rather than
  a hole, and still with the cause nowhere near the symptom. It also costs a
  needless draw in a pass the bolt has no business in.
- It hangs off `WeatherRig.root`, which is scene-level and survives thresholds,
  and it is hidden indoors along with the falling.
- It spends **nothing** from the attribute ledger, because it does not use the
  surface material.

**The shape.** A random walk from a cloud-base height down toward the horizon
line, each segment turning by a bounded angle, with branches thrown off at a
draw and terminating early. Width tapers along the channel, and the core is
drawn brighter than the flanks — a bolt is a white core in a violet sheath, and
one flat colour reads as a crack in the screen.

**Where it can be.** Inside the far plane, so within 500 m of the camera. A
`near` strike genuinely is that close and can be drawn honestly. Everything else
is placed at the far plane on the strike's bearing and scaled — it is behind the
vista ring, it is occluded by the vista ring, and that is correct, because a
bolt six kilometres away *is* behind the hills.

The `sheet` and `horizon` rows draw no channel at all. That is not a
simplification: in-cloud lightning is the majority of all flashes and it has no
visible channel, which is why the cheapest row is also the commonest one.

---

## 6. Thunder

`src/audio/oneshots/thunder.ts`, as a `OneShot` — `fire(at, force)`, scheduling
on the audio clock, self-terminating nodes, exactly the contract `dsp/` states.

### The model: a line source, not a bang

A bolt is five kilometres of channel, and every part of it is a different
distance from the ear. That single fact produces every characteristic of
thunder, and building the model out of it is both cheaper and better than
filtering a bang.

**Twenty to thirty arrivals**, one per notional segment of channel. Each is a
short burst of noise through a bandpass, scheduled at
`at + segmentDistance / c` and gained by `1 / distance`. Then:

- The **nearest segment arrives first and loudest** — for a close strike that is
  the crack, and it is sharp because it has travelled least through the air.
- The rest arrive over the **difference** in path length across the channel,
  which for a vertical bolt a few kilometres off is five to fifteen seconds.
  That is the rumble, and it is irregular because the channel is.
- **Air absorption is per-arrival**: a one-pole lowpass whose cutoff falls with
  that segment's own distance. Distant thunder comes out almost entirely below
  200 Hz without anybody deciding that it should.
- The `crack` value in the lightning row is the level of the first two arrivals
  against the rest. It is the one dial that separates a rip from a roll.

Each arrival is a buffer source, a biquad and a gain — the same three nodes the
rain model fires three hundred times a second. Thirty of them per strike, at a
few strikes a minute, is nothing.

The peal also feeds `audio.send`, so the room extends it. Indoors that is the
right answer twice over: a hall's tail on a thunderclap is what a thunderclap
indoors is.

### The delay, and why it can be accurate

```
c = 331.3 + 0.606 * climate.temperature      // metres per second
delay = range * 1000 / c
```

The climate already models temperature, so the speed of sound varies correctly
across the year for free — thunder is genuinely slower on a cold night. Three
seconds a kilometre is the number a player will check against, and this gives it
to them.

**Scheduling.** The strike is a frame-clock event; the peal is an audio-clock
one. The rig keeps a queue of pending peals and schedules each only when it is
within the lookahead — a fifth of a second — of being due. That ordering is not
tidiness:

- the **indoors or outdoors** decision has to be the one that is true when the
  sound arrives, not when the bolt fell, and forty seconds is long enough to
  walk into a house;
- a zone change or a dispose can drop what has not been scheduled yet, and
  cannot drop what has;
- for a very close strike the delay is under half a second, and there
  `context.outputLatency` is worth subtracting. At forty seconds it is not.

If the tab is hidden the context suspends and its clock stops, so a pending peal
simply waits and arrives coherently on return. Nothing needs doing about it.

### Direction

Thunder is too far away for a `PannerNode` — the default `maxDistance` is 60 m
and an HRTF panner at four kilometres is a virtual emitter. It goes to the dry
bus through a `StereoPanner`, as the rain bed's three voices already do, with
the pan taken from the strike's bearing against the camera's yaw and **updated
per frame**, because a peal lasts ten seconds and the player will turn during
it. The pan is shallow, and shallower with distance: a near crack is placed, a
distant roll is everywhere.

`WeatherRig.update` currently receives the camera *position*. It needs the
camera. One argument.

### Indoors

Not silenced and not merely turned down. The peal keeps its level and loses its
top: a lowpass plus the existing bed attenuation. What you hear through a wall
is the rumble, and losing the crack is most of what says you are inside.

### Thunder is not an ambience signal

`AMBIENCE.md` does not mention thunder anywhere, so this document owns the
join. The obvious reading — a peal is a `Signal` with `hushes: true` — is wrong,
for four reasons, each of which is a rule one of the two systems already states.

- **The director sites its own sources in a ring**, `near` at 3–14 m through
  `far` at 45–160 m. Thunder is at two to fifteen kilometres. There is no tier
  for it and there should not be one; `far`'s whole design is a shared distance
  chain for things at the edge of a wood.
- **Ambience is per vibe, and thunder is not a property of a place.** The same
  storm has to sound the same in the village, the forest and on the beach, and
  a zone whose ambience is `QUIET` — which is what an interior gets by
  default — would lose its thunder entirely. Muffled thunder indoors is the
  case that most needs to work.
- **`Nothing here knows where anything is`** is the director's stated
  convention. A peal has a bearing, and the bearing comes from the strike.
- **A signal is permission to speak; a peal is an appointment.** The pump is a
  100 ms ticker deciding what *may* be heard; thunder must arrive at an
  audio-clock time derived from a flash that has already happened, whatever
  else is going on.

So thunder stays a `WeatherRig`-owned one-shot on the dry bus, and it **talks
to** the director rather than living inside it. Two calls, and that is the
whole interface:

1. `Conditions.storm`, filled in `applyAmbience` beside `rain`, `snow` and
   `fog`, so gates and drivers can answer to it continuously.
2. **`director.hush()` when a peal fires** — not when the bolt falls. `hush` is
   already public and already does exactly the right thing: the biophony drops
   over about 0.4 s, holds 15–40 s, and comes back in wake order, while the
   keynote and the geophony carry on.

That second one is the best thing in this document that costs nothing. The
director's own note says the keynote and the geophony do not take part in a
hush — *wind does not stop because a jay shouted*. Thunder is geophony, so it
sits on the causing side of that rule rather than the receiving side, and a
wood going silent after a clap and coming back bird by bird is a whole effect
for one call.

It also means thunder never enters the six-band ledger. That is right: the
ledger is a masking model for sources that compete, and a thunderclap does not
compete. The hush is the coarser, correct mechanism, and `floor` — where a
distant peal lives almost entirely — is never contested anyway.

---

## 7. Pairing with rain

The one-number rule, extended: `amountOf('storm')` is the strike rate, the
flash's ceiling, the cumulonimbus overhead, the extra wind, and the darkening of
the air. Nothing keeps a second copy.

What the storm should *not* do is drive a second rain. The rain kind already
scales its particle count with its own amount, and a storm sits on a wet field
by construction of the moisture gate, so a storm is already raining hard. If a
downpour under a cell wants to be heavier than the field alone gives, that is a
bias from one kind onto another and it is a separate, larger idea — leave it.

The sequence that this gets for free is worth naming, because it is the reason
to build the thing at all:

1. The rain gradient turns up. `planSky` runs its warm-front sequence — cirrus,
   then the veil, then the grey sheet. Ambience's *rain coming* coupling reads
   the same gradient: rooks get restless, the wind gets up.
2. The moisture gate opens on a field that is not yet raining here. The storm
   amount comes up; strikes are drawn at the far end of the range; the sky
   flickers over the hills with **no sound**, because they are `horizon` and
   `sheet` rows. Nothing has gone quiet yet, and that is right — a silent flash
   over the hills does not stop a wood singing.
3. The cell closes. `precipitation` rises here, the range distribution walks in,
   and the delay between flash and peal shortens every time — which is a thing
   the player can *count*, and it is correct. `weatherDamp` is already taking
   the birds down as the rain arrives.
4. Rain, cumulonimbus, `forked` bolts a couple of kilometres off, wind up by
   half. Every peal calls `hush`, so the biophony is knocked flat and only ever
   half recovers before the next one — which is what a wood under a storm
   actually sounds like, and it is one call.
5. `precipitationPast` carries the storm out behind the shower, the delays
   lengthen again, and the last of it grumbles from downwind. The final hush
   runs its full 15–40 s and recovers in wake order into a wet quiet, and
   `Window.after: 'rain'` opens the eaves and the gutters over the top of it.

None of those five steps is scripted. They are what the fields already do, once
a strike knows to read them.

**Two of those couplings are specified in `AMBIENCE.md` and not yet wired.**
`Conditions` carries `rain`, `snow` and `fog` but not `precipitationSoon` or
`precipitationPast`, so §6's *rain coming* and *rain stopping* rows have
nothing to read. Step 1 above waits on whichever document adds those fields;
steps 2 to 5 do not. Nothing here should add them on ambience's behalf — but
if they land, the storm's approach and the rooks' restlessness are reading one
number, which is the whole point of the climate owning it.

---

## 8. Photosensitivity

This is the one part of the document that is not optional.

A three-stroke flash is a luminance transient at roughly 15–20 Hz, full-frame,
at night, from near-black to near-white. That is squarely the pattern that
causes seizures, and it is the strongest such thing in the project by a
distance — stronger than `facet-flash`, which is per-triangle.

`specs/BUGS.md` already carries an open bug that glitch and horror's flicker
effects ignore `reducedMotion`. **Do not add a third.** The switch is read at
build time, not mitigated by a conservative constant.

A new option, `lightning: boolean`, under accessibility, gated by
`reducedMotion` in `effective()` alongside `precipitation`. Off, the storm does
not go away:

- one stroke, never a train;
- a slow rise and a slow fall — 250 ms rather than 15 ms;
- a hard ceiling on the added luminance, well short of white;
- the channel still drawn, the thunder untouched.

That is a version of lightning somebody can watch, rather than an absence of
weather, which is the standard `precipitation`'s note sets and the one it could
not meet.

There is a second, unconditional guard: **strokes are rate-capped globally**, so
that two strikes drawn into overlapping buckets cannot compound into a longer
flicker train than one bolt produces. The cap belongs in the rig, where the
schedule is, and not in the shader.

---

## 9. What this costs

| | |
|---|---|
| **No storm** | One `hash` per bucket boundary, so roughly one every four seconds. One vec3 add in `skyBand`. One branch in the deck composite. Nothing else — no mesh, no light, no node. |
| **Storm, between strikes** | The above, plus a tenth genus in the low deck, which costs exactly what any other low deck costs. |
| **During a flash (3–8 frames)** | Uniform writes that already happen every frame; one directional light re-aimed, which already happens every frame; one 256-vertex mesh in the colour pass and again in bloom's emitters pass, both of which are already running. |
| **Per peal** | 20–30 self-terminating node triples spread over 5–15 seconds. The rain model fires 300 a second. |
| **Pending queue** | At most a handful of entries, each a few numbers. |
| **The ambience join** | One more number in the `Conditions` struct that is already filled every frame, and one `hush()` call per peal. The director's budgets — three air layers, six chorus emitters, one signal, two HRTF — are untouched, because thunder is none of those things. |
| **VRAM** | One small buffer geometry. |

The one item that is not free is the optional flash shadow, and it is optional
precisely because it is not.

---

## 10. What this breaks

Read out of the code, not guessed. All four are small and all four are silent
if missed.

**`WeatherRig.heaviest()` picks the largest amount over every kind, and the
`surface` getter then asks that one kind for a footstep surface.** A storm row
whose amount exceeds rain's — which is the normal case at the height of a
storm — would win, declare no surface, and the mud underfoot would vanish in the
heaviest rain of the year. The fix is four lines: `heaviest` should be asked for
the heaviest kind *that declares what is being asked for*, which is already what
`applySound` does by hand for `sound`.

**`hideGlowFromEdges` flips a fixed list of materials.** The bolt material joins
it or the normal buffer, and with it the ambient occlusion, takes a ribbon of
normals belonging to an additive surface. The hook's name is left over from an
edge detector that no longer exists; the hook itself is live. §5, and L1 for the
name.

**`climate.pinned` must keep holding.** A gallery zone declares no `place` and
every kind reads zero there. The strike scheduler must key off the amount and
not off the storm's underlying field, or the exhibits get thunder.

**`hush()` extends rather than restarts** — `hushUntil = max(hushUntil, now +
15..40 s)` — so a storm throwing a peal every few seconds holds the biophony
down for the whole storm. That is correct and it is meant, and it is written
here because it looks exactly like a stuck flag to anyone who finds it later. A
wood under a thunderstorm has no birds in it. What must not happen is a `hush`
per *stroke*: a flash is one peal and one call, whatever the return-stroke train
did.

---

## 11. The steps

Each is shippable alone and each is judged in the countryside, which is the zone
that declares a `place`.

**L1 — name the hook after what it does.** Housekeeping, and first because L4
adds a caller to it, and a caller added to a misnamed hook is how the name
survives another year.

The edge detector is gone: `RetroShader` has no edge uniforms, antialiasing is
coverage samples on the colour target through `PixelStage.setSamples`, and the
normal buffer's only remaining reader is `GTAO`. Three things still describe the
pass that used to exist.

- `PostFX.hideGlowFromEdges` → `hideGlowFromNormals`, and its docstring says
  what the normal pass is *for* now, which is ambient occlusion.
- `src/engine/CLAUDE.md` still draws the pipeline as "chunky pixels, edge lines"
  and still says the upscale carries the edge lines. Both lines are wrong. Per
  that file's own rule — *if a fact stops being true, edit the line* — they are
  edited, not annotated.
- Anywhere else in `src/engine` that names an edge detector or an outline pass.
  Nothing outside `src/engine` refers to it.

*Done when* nothing in the tree promises an edge pass, and the frame is
bit-identical, because nothing here changes what is drawn.

**L2 — the cell.** The `storm` row, `daily`, the moisture gate, the
cumulonimbus genus, the anvil. Plus the three lines that let the ambience hear
about it: `Conditions.storm` and its fill in `applyAmbience`, the `'storm'`
`Driver`, and `Window.storm` with `after: 'storm'` beside it. No flash, no
sound, and no vibe is obliged to use the new gate.

*Done when* holding `storm` at 1 in the panel puts a black-based heaped deck
overhead with ice above it, the light goes out under it, the wind comes up, and
letting go hands it back to the day; when a summer afternoon reaches one on its
own within a few scrubbed days; and when a cast member given `storm: [0, 0.2]`
goes quiet under it.

**L3 — the flash.** `uFlashAir`, `uFlashGlow`, the light-rig terms, the strike
scheduler, the lightning table with `sheet` and `horizon` only. No channel, no
thunder.

*Done when* a storm flickers, the distant hills flicker with the sky rather than
a beat behind it, a wet cobble flashes, the water flashes, and turning the storm
off stops it dead.

**L4 — the channel.** `art/bolt.ts`, the glow material, the `forked` and
`crawler` rows, return strokes.

*Done when* a bolt has a core and branches, blooms, is occluded by the treeline
it is behind, and never reaches the normal buffer.

**L5 — thunder.** The line-source model, the pending queue, the temperature-
derived speed of sound, the stereo placement, the indoor filter, and the
`director.hush()` call at the moment the peal is scheduled.

*Done when* the delay can be counted against the range the panel reports, a
close strike cracks and a far one rolls, walking indoors between the flash and
the peal muffles the peal, a zone change during a pending peal neither drops it
wrongly nor plays it in the wrong room, and a wood goes silent on the clap and
comes back bird by bird rather than all at once.

**L6 — the switch.** The `lightning` option, `effective()`, the reduced-motion
flash shape, the global stroke cap.

*Done when* the option is what turns the flicker off, and not a constant.

L1 stands alone and can land any time. L2 before L3. L4 and L5 are independent
of each other and both want L3. L6 lands with L4, because L4 is what introduces
the stroke train.

---

## Open questions, and they are the repo owner's

1. **How frightening.** The `near` row is a bolt a few hundred metres away with
   a peak three times daylight and a bang under a second behind it. That is a
   genuine startle, in a world whose locked decisions say there is no danger in
   it. It may want to be rare, or it may want to be cut. The row exists; the
   weight is a number.
2. **Whether a bolt may land inside the level.** This document says no — every
   channel is at or beyond the vista ring. A bolt that strikes the ground you
   are standing on wants a scorch, a light on the geometry it hits, and an
   argument with the rule that builders do not dress scenes. It is a bigger idea
   than the rest of this put together.
3. **Names.** `sheet`, `forked`, `crawler`, `near`, `horizon` are
   meteorologists' words and are placeholders, as the genus names were before
   them.
4. **Whether the sky flash blooms.** It does not, by default, and the
   alternative is one line. The gallery will settle it.
5. **The flash shadow.** §4 leaves it out and prices it. It is the single
   biggest available upgrade and the only item here that costs a pass.
6. **Whether a peal should hush at every range.** §6 calls `hush()` on every
   peal. A crack overhead plainly should; a rumble from twelve kilometres
   arguably should not, and gating the call on the strike's range is one
   comparison. It is left ungated because a storm that only silences the wood
   when it is directly overhead reads as the wood not minding — but this is a
   listening call, not a design one, and the `horizon` row already makes no
   sound to hush with.
