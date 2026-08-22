# Ambience — research and plan

**Not built.** This is the design for a third audio layer beside the soundscape
and the score: one ambience per vibe, wired into zones the way music already is,
driven by a director of its own that reads the clock and the weather.

Everything below is checked against the code as it stands. No instrument was
built to write it and none should be built to verify it — the render and the
report from the world are the ground truth.

---

## 1. The ask

- Ambience is wired per **vibe**, over the same twenty-two vibes the score uses.
- A **vibe becomes a top-level entity** owning a music spec *and* an ambience
  spec, so a zone can be given ambience A and music B, or rotate its ambience.
- Ambience gets **its own director** — no music theory, but the same kind of
  machine: something that decides what may be heard, when, and against what.
- The director **reads the zone's conditions** — weather, hour, season,
  temperature, wind — and chooses from there.
- Everything is synthesised. Diversity and quality first, and the quality bar is
  the rest of `src/audio`, not the bar a background loop usually clears.

---

## 2. What this stands on

The engine already has almost everything an ambience system needs. Naming what
exists matters, because the commonest failure here would be building a second
copy of it.

| | |
|---|---|
| `AudioEngine` | Two buses (`dry`, `send`), one FDN room, an emitter budget: 8 HRTF voices, 24 audible, the rest disconnected. Ranked by `distance / importance` every 120 ms. |
| `Emitter` | Panner, air absorption, occlusion raycast, three detail levels, `moveTo`. |
| `Soundscape` | A zone's declared sound: a `bed` list, placed `emitters`, `scatter` fields. Built once, silenced on exit, never torn down at a doorway. |
| `ScatterField` | One-shots at Poisson intervals in a region over a small voice pool, each voice busy until its event rings out. |
| `Weather` | One travelling gust field. `strengthAt(x, z)` lags by distance along the wind, so the far treeline quickens before the near hedge. |
| `Climate` | The clock and the sky: `timeOfDay`, `sunElevation`, `day`, `seasonPhase`, `temperature`, `moonLight`, `moonPhase`, `amountOf(kind)`, `precipitation`, `precipitationSoon`, `precipitationPast`, and the zone's map coordinate. |
| `MusicDirector` | One rack per spec, built once and silenced often; a worker-timer pump off the frame loop; crossfade-and-retune at a border. The shape to copy. |
| `models/` | wind, foliage, rain, water, fire, crowd, machine, friction, waveguide, bird. |
| `oneshots/` | hammer, clatter, animal (dog/sheep/cow/fowl/pig), voice, drip, bell. |
| `dsp/` | modal, impact, phisem, bubble, formant, grain, envelopes, clock, ticker. |
| `voice/` | A Kelly-Lochbaum tube. Real speech, and by extension anything with a throat. |
| `faust/` | reverb, friction, waveguide. A wasm tier that is never load-bearing. |

**What is missing is not synthesis — it is a conductor.** A zone today declares
a fixed list of sources at fixed points with fixed rates. Nothing decides that
the birds should stop because it started raining, that a rook may not speak
while a dog is barking in the same band, that this is the twenty minutes before
sunrise, or that the whole wood should go quiet for half a minute and then come
back in the order it went out.

---

## 3. The structural decision: the vibe is the entity

Today a zone declares `environment.music?: MusicSpec` and
`environment.soundscape: SoundscapeSpec`. The vibe exists only as a `MusicSpec`
constant plus a name in a dev-panel record.

Make it real:

```ts
// src/audio/vibes.ts — above both directors, importing neither's internals.
export interface Vibe {
  readonly music: MusicSpec;
  readonly ambience: AmbienceSpec;
}

export type VibeName = 'village 1' | 'village 2' | /* ... */ 'beach path';
export const VIBES: Record<VibeName, Vibe> = { /* ... */ };
```

and a zone declares a pairing rather than a spec:

```ts
export type VibeChoice =
  | VibeName
  /** Different halves, and an ambience that rotates between visits. */
  | { music: VibeName | null; ambience: VibeName | readonly VibeName[] | null };

export interface ZoneEnvironment {
  // ...
  vibe?: VibeChoice;
}
```

Four rules carry over from the score unchanged, because they are right and
because two systems that disagreed about them would fight:

- **Rack identity is spec identity.** An ambience rack is keyed on the
  `AmbienceSpec` object, so two zones naming `'farm'` share one rack and the
  border crossfade works. A zone that copies the fields gets its own rack and
  breaks it.
- **Built once, silenced often.** Crossing a doorway does not dispose an
  ambience; `setActive(false)` disconnects it.
- **Content is data.** An `AmbienceSpec` is a discriminated union all the way
  down, so a typo in a cast member is a compile error rather than a bird that
  silently never sings.
- **Naming is placeholder.** `'village 1'`, `'cave dark'` and the rest are
  working labels and stay that way until the fiction says otherwise.

### The rotation

`ambience: ['village 1', 'village 2']` picks one on entry, seeded on the zone id
and the game **day** — so a place sounds the same all day and different next
week, the way `Climate.toneOf` draws a smog colour. Not re-rolled on every
crossing: walking out of a door and back in must not change what the village
sounds like.

### Where ambience ends and the soundscape begins

Both keep running. They answer different questions and the boundary is sharp:

- **`SoundscapeSpec` is *this* place.** The forge behind the house on the east
  lane. That hedge, at those coordinates. The gate on its hinges. Hand-placed,
  authored beside the geometry, tied to objects you can walk up to.
- **`AmbienceSpec` is what *kind* of place this is.** A farm has cattle
  somewhere, hens somewhere, swallows in the season, and a dog that answers
  another dog. Nothing here knows where the byre is and nothing here should.

The ambience director never places a source at an authored coordinate. It works
in a ring around the listener and in the sky above them.

### And how a cast member gets auditioned

The requirement in `src/audio/CLAUDE.md` that a new sound come with an art-kit
object is about being able to hear the thing on purpose — a sound you cannot
walk up to is a sound you cannot tune. Most of this cast has nothing to walk up
to: a rook half a mile off, a draught in a passage, a bell across the valley.

So auditioning is a tooling problem here, not a modelling one. A debug menu that
fires any cast member on demand, scrubs the hour and forces the weather covers
it, and covers it better than a mesh would — a source that speaks every ninety
seconds is otherwise mostly waiting, and waiting is how a parameter gets changed
twice between hearings.

That menu is **not needed to start**, and its shape is open. Nothing in this
document depends on it.

---

## 4. What makes an ambience system good

Ambience is the game-audio layer that is nearly always bad, and it is bad for
reasons that are structural and well documented rather than a matter of taste.

### Schafer: keynote, signal, soundmark

R. Murray Schafer's three-part division of a soundscape is directly a stratum
plan, and it is the ambience equivalent of the score's drone / texture / melody:

- **Keynote** — heard continuously, forming the ground everything else is
  perceived against, and not consciously listened to. Wind, water, a plant's
  hum, a room's tone.
- **Signal** — a foreground sound, meant to be listened to. A bell, a shout, a
  dog, a gull.
- **Soundmark** — a sound unique to a place, and noticed by the people in it.
  The church bell on the hour, the bell buoy, the mill, the klaxon.

A system with only keynotes is a fan. A system with only signals is a
sound-effect reel. The failure most systems make is having the first two and no
third: nothing that belongs to *this* place and no other.

### Krause: the acoustic niche, which is the whole director

Bernie Krause's division into **geophony** (wind, water, earth), **biophony**
(everything alive) and **anthropophony** (everything people make) is a useful
label, but the acoustic niche hypothesis under it is the important part: in a
mature habitat species partition the soundscape **spectrally and temporally** so
their signals are not masked. Frogs stop when the insects start. A wren's band
is not a wood pigeon's band.

That is not a metaphor for what an ambience director should do — it *is* what an
ambience director should do, and it is the cheapest source of quality on this
list:

> **Two sources may not hold the same band at the same time.** An event whose
> band is busy is deferred or dropped, and a dropped event is indistinguishable
> from one that was never due.

It pays for itself in performance twice: an event refused for band occupancy is
an event never synthesised, and a mix where nothing masks anything needs less
level to be heard.

### Game practice, and where this project is already ahead

The standing advice for sampled ambience is: keep detail *out* of the bed,
because a detailed loop becomes recognisable within a few passes and the moment
it is recognised it stops being a place; move the detail into randomised
one-shots; and modulate the bed's layers at runtime rather than baking the
variation, so a quiet air tone does not sit still.

Every one of those is a workaround for playing back a recording, and none of
them applies here — **there is no loop to recognise.** The beds are noise
through filters driven by a gust field that never repeats at any scale a player
will sit through. What survives from that literature is the part about the ear
rather than the file:

- **A bed carries level and almost no identity.** `models/CLAUDE.md` already
  calls this the standing failure, and it is doubly true across a whole place:
  loud, individually resolvable events a few times a second is not a wood, it is
  a rattle.
- **Position is a variable.** A source arriving from an identical point every
  time is heard as a loudspeaker. `ScatterField` already wanders.
- **Nothing holds one setting** — held at the level of the place, not of one
  model.

### Eno: incommensurable periods

*Music for Airports* is tape loops of 23.5, 25.875 and 29.9375 seconds that
never re-align. The score already uses this for pulse-free vibes
(`FLOAT_PERIODS = [3.7, 4.9, 6.7]`). Ambience wants it at three scales at once:
the drips in a cave, the clocks in a shop, and the director's own activity
cycles. It costs no second scheduler — everything is still placed from one pump.

### Scarcity, inverted

The score's design is scarcity: a piece runs a few minutes and the rest after it
runs longer. Ambience cannot do that — a place that falls silent has died. So
the scarcity moves down a stratum:

> **The keynote never stops. Signals are rare, and soundmarks are rarer than
> signals.**

A soundmark heard twice an hour is a soundmark. Heard twice a minute it is a
keynote with delusions.

### The three mechanics worth having

Everything above is arrangement. These three are behaviour, they are what
separates a director from a trigger table, and all three are cheap.

**The hush.** Real biophony stops together — an alarm goes up, or something
passes, and the wood is silent for twenty to forty seconds before it comes back
in the order it went out. Nothing else so cheaply makes a place feel as though
it is paying attention. It is also exactly the mechanism Phase 8 will want in
order to duck ambience under dialogue.

**Answering.** A dog answers a dog across a village. A tawny owl's hoot is
answered by another bird's *kee-wick*. `models/bird.ts` already does this within
one throat — "a third of the time the bird answers itself a beat later". Across
two positions it needs the director, because a `ScatterField` fires one point
per event and an answer has to come from somewhere else, later, and further off.

**The pass-by.** A source that moves: rooks crossing at dusk, a swift over the
rooftops, a fly in a room. One emitter walked along a path over two to six
seconds. `PannerNode` has no Doppler — `setVelocity` is long gone — so the pitch
shift is a hand-written `detune` ramp, which is fine, and is also the only way
to keep it tasteful.

---

## 5. The director

### The data

```ts
/** Six bands. Coarse on purpose: this is a masking model, not an equaliser. */
export type Band = 'floor' | 'body' | 'throat' | 'call' | 'song' | 'air';
//                  <80 Hz   80–300   300–900    0.9–2.5k  2.5–6k   6k+

export interface AmbienceSpec {
  /** The keynote. Non-positional, always on, never resolvable into events. */
  air: readonly AirLayer[];
  /** The middle distance: continuous and positional, sited in a ring. */
  chorus: readonly ChorusLayer[];
  /** Who may speak here, and when. */
  cast: readonly CastMember[];
  /** Rare and individually memorable. See `Signal`. */
  signals: readonly Signal[];
  /** How busy this place is at its busiest, 0..1. The one scarcity dial. */
  activity: number;
  /** Bands this vibe keeps thin, so the score has somewhere to sit. */
  yield?: readonly Band[];
  /** The place's own dice. Rotations, siting and cycle phases all re-roll here. */
  seed: number;
}

export interface CastMember {
  voice: AmbienceVoice;
  /** Mean seconds between utterances at full activity. */
  every: Span;
  /** Decides reverb, absorption, rolloff and whether occlusion is tested. */
  tier: 'near' | 'mid' | 'far';
  /** Chance this one is answered from somewhere else, 0..1, and by what. */
  answers?: number;
  answer?: AmbienceVoice;
  /** It crosses rather than sits. Path length in metres, and seconds to fly it. */
  passes?: { over: number; seconds: Span };
  when?: Window;
  level: number;
}

/** What a cast member is allowed to require. Closed; the cast is open. */
export interface Window {
  /** Sun elevation span, degrees. `[-6, 12]` is the dawn and dusk chorus. */
  sun?: Span;
  /** Minutes before sunrise this one wakes. Orders the chorus. */
  wakes?: number;
  /** Season phase span, 0 at midwinter, wrapping. */
  season?: Span;
  /** Silent above this wind strength, 0..1. */
  shy?: number;
  /** Rain amount it tolerates — or `after`, for what only speaks once it stops. */
  rain?: Span;
  after?: 'rain' | 'snow';
  /** Degrees C. Below the floor it does not sound at all. */
  warmth?: Span;
  /** Needs this much moonlight, 0..1. */
  moon?: number;
  /** Only indoors, or only out. */
  under?: 'roof' | 'sky';
}
```

The band is **not** on the cast entry. It is a fact about the voice — a robin
occupies the same niche whichever wood it is in — so it lives beside the voice
in `voices.ts`, along with whether the voice is something breathing, which is
what decides whether a hush silences it.

`Signal` is a `CastMember` with a floor on its gap and a cap of one at a time.
A **soundmark** is a `Signal` with `clock: 'hour'` — the climate already knows
what time it is, and a bell on the hour is the cheapest identity a place can
own.

### The clock

One `Ticker` at 100 ms, off the frame loop, exactly as the score's pump is. Every
decision reads `context.currentTime` and the climate, never frame state, so a
late frame is never a reason for a late event. Everything the director fires is
scheduled into the future through `dsp/clock`.

Per pump, in order:

1. **Sample the conditions** — once, into one struct, and hand the same struct to
   every gate. Two cast members must not disagree about what time it is.
2. **Advance the activity curve** (below) and write the air layers' levels.
3. **Age the band ledger** — each band holds an occupancy that decays with the
   length of whatever last claimed it.
4. **Walk the cast.** For each member whose gate is open and whose clock is due:
   pick a point, check the band, fire or drop, claim the band, and roll for an
   answer.
5. **Consider one signal**, at most, and only if nothing is running.

### Activity, and the shape of the hour

`activity` is the vibe's ceiling. What the director actually runs at is:

```
live = activity
     × hour(sunElevation, cast member's window)   // the chorus curve
     × season(seasonPhase)
     × weather(rain, snow, wind)
     × cycle(t)                                    // three incommensurable swells
     × hush(t)                                     // 0 during a hush, ramping back
```

`cycle` is three value-noise fields at coprime periods — roughly 41 s, 67 s and
103 s — summed and expanded the way `weather.ts` expands its octaves. That is
what gives a place busy stretches and quiet ones without anything that reads as
periodic.

`hush` is triggered by an alarm call, by a signal firing, on a roll of the dice
every few minutes, and — later — by the game. It drops the biophony to zero over
about 0.4 s, holds for 15–40 s, and comes back **in wake order**: the same
`wakes` ordering that runs the dawn chorus, compressed. The keynote and the
geophony do not participate; wind does not stop because a jay shouted.

### The band ledger

Six counters. Firing a source with band *b* and length *L* sets
`busy[b] = max(busy[b], now + L × slack)` where `slack` is about 1.4 for a
`near` source and 0.6 for a `far` one — distance is itself a form of masking
relief. A cast member whose band is busy is dropped, not queued, except that
`answers` re-tries once after the answer delay.

Two bands are special:

- **`floor` is never contested** — nothing in the low end is masked by anything,
  and everything in it is a bed.
- **The score claims two bands while a piece is playing.** The director reads
  the active `MusicSpec` — its `root` puts the drone in `floor` or `body`, and
  `character.melodyOctave` above that root puts the melody in `call` or `song` —
  and raises the occupancy floor there. The vibe's `yield` list is the author's
  override. This is the one place the two directors talk, and it is one number
  in each direction.

### Siting

The director owns a ring, not a set of points:

| tier | radius | `refDistance` | reverb send | occlusion | detail |
|---|---|---|---|---|---|
| `near` | 3–14 m | 2–4 | 0.2–0.4 | tested | may reach `hrtf` |
| `mid` | 14–45 m | 6–10 | 0.5–0.7 | tested | `panned` |
| `far` | 45–160 m | 20+ | 0.85–1 | `ignoreOcclusion` | `panned`, low `importance` |

Elevation is part of the ring: a rook is at +12 m, a cricket at 0.1 m, a bat at
+5 m. Height is most of what stops a scatter field sounding like a ring of
speakers at head level.

A `far` source is also run through the **distance chain** (§8.7) rather than
given its own darkened model, so one bird covers both ends of the ring.

### Borders

The same rule the score uses: a doorway is a change of key, not of track. The
old rack fades over ~0.9 s to the new one; the activity curve, the cycle phases
and the hush state carry across unchanged, so walking out of a wood into a field
during a hush stays hushed. Ambience to no-ambience is fast (~0.35 s) for the
score's reason — a leak into an unscored place reads as a bug.

---

## 6. Conditions: what the director reads

Every coupling below is a **gate or a rate on something that already exists**.
None of them is a new model, and that is the constraint that keeps the list
affordable.

| condition | source | what it does |
|---|---|---|
| Dawn chorus | `sunElevation`, `Window.wakes` | The chorus opens 30–90 min before sunrise and builds in species order. A Royal Society study puts the song thrush about **47 minutes** before sunrise, just after the blackbird; robin and blackbird are earliest because larger eyes for their body mass gather more light. Chaffinch and blue tit come much later. `wakes` is that ordering as one number per cast member, and it is the same number the hush recovers in. |
| Warm bright nights | `temperature`, `moonLight` | Shift `wakes` earlier by a few minutes. The blackbird under a streetlamp is a real thing and it is one addition. |
| Dusk chorus | `sunElevation` in `[-6, 4]` descending | Thinner than dawn and different in cast: blackbird and robin sing latest, then stop, then the owls and the nightjar start. The handover is the point. |
| Night | `sunElevation < -6` | Owls, fox, nightjar, frogs, crickets, bats. Fewer sources, wider gaps, and the reverb reads longer because the ground is cooler — a real effect and free, as one nudge on the far tier's send. |
| Insects | `temperature` | Dolbear's law: for the snowy tree cricket, `T_F = 50 + (chirps − 92) / 4.7`, i.e. **chirp rate rises about 4.7 per minute per °F**. Katydid: `T_F = 60 + (chirps − 19) / 3`. Reliable roughly 13–32 °C, and they stop below ~10 °C. So the insect layer's rate is a function of `Climate.temperature` and its gate is a floor on the same number — and a cold night is quiet for a reason a player can feel without naming. |
| Season | `seasonPhase` | Swifts and cuckoo in spring and summer only; rooks and fieldfares weighted to winter; no dawn chorus worth the name at midwinter; the rut in autumn; bees and gorse pods in the heat. |
| Rain falling | `amountOf('rain')` | Birds go quiet — `models/bird.ts` already has `shySpeed`, and this generalises it to the cast. Insects stop. The keynote gains the rain bed, which the `WeatherRig` already drives. Anthropophony thins: nobody is in the square. |
| Rain stopping | `precipitationPast` | **The most valuable single coupling on this list.** Eaves drip for minutes after rain stops, gutters run, a ditch trickles, and the birds come back into a wet quiet wood before anything else does. `precipitationPast` already exists and nothing reads it. |
| Rain coming | `precipitationSoon` | Rooks get restless, the wind gets up, gulls come inland. A place that anticipates its own weather is rare and costs a lookup. |
| Snow | `amountOf('snow')`, `ground.cover` | The muffling: snow cover absorbs high frequencies hard. Pull the `air` and `song` bands down 6–10 dB across the whole layer, shorten the room, drop the activity. A snowy place is quieter and duller, and the few sounds left carry further. |
| Fog | `amountOf('fog')` | Wind settles (`blow: -0.4` already), the far tier loses its highs, and the foghorn gate opens on the coast. |
| Wind | `Weather.strengthAt` | Rustle, chimes, plate, wire and gate all scale steeply rather than proportionally — the convention `models/CLAUDE.md` already sets. Birds shy above ~0.7. The gust **front** matters: siting canopy sources at spread positions makes the same gust arrive across the wood in the order you would watch it cross. |
| Wind direction | `windDirection` | Bias where far sources are drawn from and how loud they are. Sound carries downwind; a village heard from upwind is a different village. |
| Indoors | zone `room`, `sky` | Everything outdoors gets a wall between it and the listener: `setBedLevel`-style duck, a hard lowpass, and the `near` cast replaced by the interior's own. Rain on the window, wind at the chimney, the fire. |
| The hour | `timeOfDay` | Soundmarks on the hour. Bells, a clock striking, a shift klaxon, a curfew. |
| Moon | `moonLight`, `moonName` | Owls and foxes more active; a full-moon night is the one where the far tier reaches furthest. |

---

## 7. The cast, per vibe

The research pass. Each vibe gets a keynote, a middle, a cast and at least one
soundmark, and every entry names what it is made of from the kit that exists or
from §8. Bands are the six of §5; gates are shorthand for §6.

Three rules ran through the whole list.

**No vibe repeats another vibe's soundmark** — that is what makes it a
soundmark.

**No cast is longer than it can be heard.** Twelve members with wide gaps beats
thirty with narrow ones; the ear notices variety over minutes and masking over
seconds.

**Where accuracy and interest disagree, take the interesting one.** This is a
game. A sound that is correct and dull loses to one that is wrong and worth
turning your head for, and several entries below are already on that side of the
line — gorse pods cracking in the heat, a stonechat that is two stones tapped
together, a broken fan turning on nothing but the wind, car bodies ticking as
the sun leaves them. Physics is the method here, not the goal: it is used
because it is the cheapest route to something that sounds alive, and it gets
overruled the moment it stops being that.

### village 1 — settled, evening, wide

*Keynote:* sheltered wind, a settlement's own low murmur, smoke drawing.

| source | stratum | made from | band | gate |
|---|---|---|---|---|
| lane wind | keynote | `wind` soft, `tone` 3000 | air | always |
| village murmur | keynote | `crowd` at very low density, far, hard lowpass | throat | day |
| chimney draw | chorus | `waveguide` closed, low, gust-driven | body | wind |
| garden trees, hedges | chorus | `foliage` ×2 at spread positions | air | wind |
| blackbird from a roof ridge | cast | §8.1 | song | dusk, `wakes` 35 |
| robin | cast | §8.1 | song | latest of all, into dark |
| swifts screaming over the roofs | cast | §8.1, `passes` | song | summer, evening |
| rooks going to roost | cast | §8.6 flock, `passes` | throat | autumn/winter dusk |
| dog answering a dog | cast | `animal` dog, `answers` 0.6 | throat | night-weighted |
| cow in a byre | cast | `animal` cow, `under: 'roof'` | body | evening |
| hens settling | cast | `animal` fowl | call | dusk |
| a bucket, a door, a besom | cast | `clatter` wood/pot | call | day |
| someone whistling in the lane | cast | a bare whistle, **not in the score's key** — see §12 | song | evening |
| **the church bell on the hour** | soundmark | `bell` | body+song | `clock: 'hour'` |

### village 2 — the market, fast, close

*Keynote:* a square full of people, and canvas.

| source | stratum | made from | band | gate |
|---|---|---|---|---|
| the square | keynote | `crowd`, density ~0.55, mid distance | throat | trading hours |
| awnings and tarpaulins | chorus | §8.5 plate, gust-driven | air | wind |
| a cart on cobbles | chorus | `machine` + `phisem` hoof/wheel impacts | body | day |
| hawker's shout | cast | `voice`, one long call | call | day |
| haggling, laughter | cast | `crowd` bursts | throat | day |
| pigeons on the eaves | cast | `animal`-style coo, low formants | body | day |
| pigeons clattering off | cast | `phisem` wing burst + `passes` | call | on alarm |
| sparrows in the gutters | cast | §8.1, short and busy | song | day |
| crates, barrels, coins | cast | `clatter` wood/pot/metal | call | day |
| knife on a whetstone | cast | `friction` high, short strokes | song | day |
| poultry in a crate | cast | `animal` fowl | call | day |
| a goat, a dog under a table | cast | `animal` sheep tuned / dog | throat | day |
| **the trading handbell** | soundmark | `bell` small, twice a day | song | `clock` |

### village interior 1 — the hearth room

*Keynote:* room tone and a fire. Silence indoors is the point — `INDOOR_ENVIRONMENT` defaults to `SILENCE` for a good reason, and this must stay under it.

| source | stratum | made from | band | gate |
|---|---|---|---|---|
| room tone | keynote | one narrow low resonance over brown noise, very quiet | body | always |
| the hearth | chorus | `fire` small, sheltered | air | always |
| wind at the chimney | chorus | `waveguide` closed, moaning | body | wind |
| rain on the window | chorus | `rain` 'stone', hard lowpass + a pane resonance | call | rain |
| the clock | chorus | §8.9 tick, periodic with drift | song | always |
| embers settling | cast | `phisem` low, soft, long decay | body | always |
| a log on the fire | cast | `clatter` wood + `thump` | body | rare |
| a fly at the glass | cast | §8.2, `passes` short | song | summer, day |
| a mouse in the wainscot | cast | `phisem` tiny, very short bursts | air | night |
| someone humming next door | cast | `voice` through a wall, unrelated to the score | throat | evening |
| floorboards above | cast | `friction` slow + `thump` | body | evening |
| a dog shifting by the fire | cast | `friction` cloth + a sigh | throat | always |
| **the clock striking the hour** | soundmark | §8.9 + `bell` small | song | `clock: 'hour'` |

### village interior 2 — the shop, clockwork and lit

| source | stratum | made from | band | gate |
|---|---|---|---|---|
| room tone | keynote | as above, drier, higher | body | always |
| **several clocks at coprime rates** | chorus | §8.9 ×3, periods 1.03 / 1.19 / 1.31 s | song | always |
| the stove | chorus | `fire` banked, low | air | cold |
| a draught under the door | chorus | `wind` very soft, narrow | air | wind |
| a fly | cast | §8.2 | song | summer |
| a drawer, a jar, scales | cast | `clatter` wood/pot + `friction` | call | day |
| paper, a pen | cast | `grain` very light | air | day |
| coins on a counter | cast | `clatter` metal small | song | day |
| a cough in a back room | cast | `voice` | throat | day |
| a mouse | cast | `phisem` tiny | air | night |
| **the bell over the door** | soundmark | `bell` tiny — and *not* the vibe's `chimes` melody voice | song | on entry |

### farm — the working band

*Keynote:* an exposed field. The highest wind multiplier of the pastoral half.

| source | stratum | made from | band | gate |
|---|---|---|---|---|
| field wind | keynote | `wind` strong, `tone` 3600 | air | always |
| the crop | keynote | `foliage` dry, high tone, low articulation — barley hisses | air | wind, summer |
| the byre | chorus | `crowd`-shaped low animal bed, `under: 'roof'` | body | always |
| the windpump | chorus | `machine` slow + `friction`, gust-driven rpm | body | wind |
| a beehive | chorus | §8.6 flock of detuned wing tones | throat | summer, warm, day |
| a trough dripping | chorus | `drip` periodic | song | always |
| cattle | cast | `animal` cow, `answers` 0.4 | body | day |
| sheep | cast | `animal` sheep, in twos and threes | throat | day |
| pigs | cast | `animal` pig | throat | day |
| hens, and a cockerel | cast | `animal` fowl; the cockerel at `wakes` 20 **and all day** | call | day |
| **geese raising the alarm** | soundmark | §8.6, harsh, sudden, triggers a hush | call | on approach |
| a dog working sheep | cast | `animal` dog, short and repeated | throat | day |
| swallows in the barn | cast | §8.1, fast, `passes` | song | summer |
| a scythe whetted, a flail, a churn | cast | `friction` / `clatter` | call | day |
| a farmhand calling, a whistle to the dog | cast | `voice` / bare whistle | song | day |
| a cart, a gate | cast | `clatter` + `friction` | body | day |

### forest a — the bright forest

*Keynote:* broadleaf canopy. The richest cast in the book, and the one the birdsong model exists for.

| source | stratum | made from | band | gate |
|---|---|---|---|---|
| canopy | keynote | `foliage` `tone` 0.8, ×3 at spread positions so the gust front crosses | air | wind |
| wind aloft | keynote | `wind` heard above rather than around | body | wind |
| song thrush — **each phrase three times** | cast | §8.1 | song | `wakes` 47 |
| blackbird | cast | §8.1, fluted, unhurried | song | `wakes` 50 |
| robin | cast | §8.1, silvery, ends in a run | song | `wakes` 45, and dusk |
| wren | cast | §8.1, explosive, ends in a hard trill | song | `wakes` 20 |
| chaffinch | cast | §8.1, accelerating descent into a flourish | song | `wakes` 10 |
| great tit | cast | §8.1, a two-note see-saw | song | `wakes` 8 |
| blackcap, warblers | cast | §8.1 | song | spring/summer |
| cuckoo | cast | §8.1, two notes a falling minor third | call | spring only |
| wood pigeon | cast | `formant` low coo, five notes | body | day |
| woodpecker drumming | cast | `impact` ×12 in 0.5 s into a `modal` trunk | call | spring |
| **the jay's alarm — which silences the wood** | soundmark | §8.1 harsh + `hush` trigger | call | any |
| bees, hoverflies | cast | §8.2 | throat | warm, day |
| a deer barking | cast | `animal` tuned long-tract | throat | night, autumn |
| midges | cast | §8.2 high whine, near tier | air | dusk, warm |

### forest b — the deep forest, pulse-free

*Keynote:* conifer. Steadier, higher and more continuous than broadleaf, and it never stops.

| source | stratum | made from | band | gate |
|---|---|---|---|---|
| conifer canopy | keynote | `foliage` narrow, high tone, high `restlessness` | air | always |
| the sub-floor | keynote | brown noise under 60 Hz, barely there | floor | always |
| **trees creaking against each other** | chorus | `friction` `'weather'` motion — already built and one of the best sounds in the kit | body | wind |
| a stream through rock | chorus | `water` 'stream', hard lowpass, heavy send | throat | always |
| **tawny owl, and the answering kee-wick** | soundmark | §8.1, `answers` 0.8 at a second position | call | night |
| raven — three descending knocks | cast | §8.1 harsh | throat | day |
| wood pigeon, five notes, endlessly | cast | `formant` | body | day |
| fox scream | cast | `formant` long, rising, unstable | call | night, winter |
| nightjar churr | cast | §8.2 — a 30 Hz pulse train, mechanical and unmistakable | song | summer dusk |
| woodcock roding | cast | §8.1, a grunt then a squeak, `passes` | throat | spring dusk |
| stag bellowing | cast | `formant` very long tract | body | autumn night |
| bats | cast | §8.6, faint ticks at the top of hearing | air | dusk |
| a branch cracking behind you | cast | `impact` + `modal` wood, `near`, rare | body | any |

### forest path a — the walked path

| source | stratum | made from | band | gate |
|---|---|---|---|---|
| hedge and open sky | keynote | `foliage` small, dry, close; `wind` mid | air | wind |
| the field beyond | chorus | `foliage` very broad, distant | air | wind |
| a stream crossing | chorus | `water` 'brook' | song | always |
| **skylark — a long unbroken song that hangs** | soundmark | §8.1 sustained, `far`, high overhead | song | spring/summer day |
| yellowhammer, whitethroat | cast | §8.1 | song | summer |
| **a pheasant flushing** | soundmark | §8.1 grating shout + `phisem` wing burst | call | any, rare |
| grasshoppers | cast | §8.2, rate from temperature | air | warm day |
| rabbits, a thump | cast | `thump` soft | body | dusk |
| a bee | cast | §8.2, `passes` | throat | warm |
| a distant cart, a farm dog | cast | `clatter` / `animal`, `far` | throat | day |
| the church bell, far off | cast | `bell` through the distance chain | body | `clock: 'hour'` |

### forest path b — the overgrown path, pulse-free

*Keynote:* closer, damper, less wind reaches it, and it drips long after the rain.

| source | stratum | made from | band | gate |
|---|---|---|---|---|
| dense damp foliage | keynote | `foliage` low tone, high density, low articulation | air | wind |
| ditch water | chorus | `water` 'cistern' | throat | always |
| **dripping, long after it stopped** | chorus | `drip` periodic ×3 at coprime rates | song | `after: 'rain'` |
| a fallen tree creaking | chorus | `friction` slow, low | body | wind |
| wren scolding — a machine-gun tick | cast | §8.1 / `phisem` hybrid | song | any |
| robin ticking at dusk | cast | §8.1 | song | dusk |
| blackbird alarm rattle | cast | §8.1, triggers a hush | call | any |
| a rustle in the undergrowth that stops | cast | `phisem` leaf-litter, `near`, then nothing | air | any |
| toads | cast | §8.6 chorus, entrains then breaks | throat | spring night, wet |
| midges, a distant crow | cast | §8.2 / §8.1 | air / throat | dusk |

### riverside — water on metal

| source | stratum | made from | band | gate |
|---|---|---|---|---|
| the river | keynote | `water` 'stream' | throat | always |
| a riffle, a weir | chorus | `water` 'brook' / 'fountain' | air | always |
| reeds | chorus | `foliage` very high tone, papery, low body | air | wind |
| a bank hollow | chorus | `bubble` slow and large | body | always |
| a moored boat, a jetty | chorus | `friction` rope + `thump` knock | body | wind |
| **the curlew's bubbling call** | soundmark | §8.1, an accelerating trill rising in pitch | song | dawn/dusk |
| **swan wingbeats overhead** | soundmark | a periodic low throb, `passes` | body | any, rare |
| heron croaking off | cast | §8.1 harsh, once | throat | any |
| ducks — a descending quack series | cast | `formant` rasp | call | day |
| moorhen, coot — one sharp note | cast | §8.1 | call | day |
| kingfisher — a single whistle | cast | §8.1 pure, very rare | song | day |
| reed warbler — pure rhythm | cast | §8.1, dry rhythmic chatter | song | summer |
| frogs | cast | §8.6 chorus, entrainment | throat | spring night, warm |
| a fish rising | cast | `bubble` single plop | song | dusk |
| dragonflies | cast | §8.2, `passes` | air | warm day |

### cave — the full dungeon, pulse-free

*Keynote:* pressure and draught. A cave's silence is not silence.

| source | stratum | made from | band | gate |
|---|---|---|---|---|
| chamber pressure | keynote | brown noise + one narrow low resonance | floor | always |
| **draught through the passage** | keynote | `waveguide` closed, very low, gust-modulated — already built | body | always |
| a stream through rock | chorus | `water` heavily lowpassed, no highs at all | throat | always |
| **drips at coprime intervals** | chorus | `drip` periodic ×3, `reverb: 1`, low dry — as `drip.ts` itself recommends | song | always |
| a sump | chorus | `bubble` large, very slow | body | always |
| gravel trickling | cast | `phisem` | air | any |
| a rock shifting | cast | `impact` + `modal` stone | body | rare |
| **a bat colony leaving** | soundmark | §8.6 wing wash + individual ticks | air | dusk |
| a distant boom | cast | `thump` through the distance chain | floor | very rare |

### cave 2 — the lived-in cave

| source | stratum | made from | band | gate |
|---|---|---|---|---|
| chamber pressure | keynote | as cave, warmer, less draught | floor | always |
| the fire | chorus | `fire` | air | always |
| drips, further off | chorus | `drip` | song | always |
| candles | chorus | `grain` very soft flutter | air | always |
| a chain, a censer | chorus | `friction` + `waveguide` | body | always |
| **a single voice breathing a note** | soundmark | `voice` — one throat, a different register from the score's `monks` and not in its key | throat | rare |
| footsteps not yours | cast | `impact` stone through the distance chain | body | any |
| a bowl set down, cloth, a cough | cast | `clatter` pot / `voice` | call | any |
| **a struck bowl** | soundmark | `waveguide` long decay | song | rare |

### cave dark — under the cave

*Keynote:* lower again, and the draught acquires a pitch that moves.

**Everything here has a cause.** Nothing in this cast is unexplained, nothing
responds to the player, and nothing implies company. The dread is that the place
is deep, loaded and indifferent — rock under its own weight, water further down
than you can follow, air moving through passages you will never see. That is a
harder effect than a jump and a better one, and it is also the honest reading of
the vibe: `harmonic-minor` is the mode with a leading tone, which is *tension
that resolves*, not tension with a monster in it.

| source | stratum | made from | band | gate |
|---|---|---|---|---|
| the floor | keynote | brown noise under 50 Hz | floor | always |
| **a draught with a pitch that wanders** | keynote | `waveguide` with a slow detune drift — a passage whose effective length changes as the air moves through it | body | always |
| **rock under load** | chorus | `friction` extremely slow, very low. A mountain settling, and the one sound that says how much is above you | floor | rare |
| water at depth | chorus | `water` past the distance where its detail survives | throat | always |
| a drip answered by a drip | cast | `drip` ×2, `answers` 1.0 — two seeps off one fissure, not a conversation | song | always |
| grit off the roof | cast | `phisem` tiny, dry | air | rare |
| a slab shifting | cast | `impact` + `modal` stone, `far` | body | rare |
| **one rockfall, far off, once** | soundmark | `phisem` large + `thump` through the distance chain | floor | very rare |

### factory 1 — the plant floor

| source | stratum | made from | band | gate |
|---|---|---|---|---|
| the plant | keynote | `machine` low + §8.4 mains hum at 100 Hz with even harmonics | body | always |
| extraction | keynote | `wind` broad, steady, indoors | air | always |
| a line running | chorus | `machine`, clank once per revolution | body | shift hours |
| a conveyor | chorus | `friction` rolling + intermittent judder | throat | shift hours |
| a compressor cycling | chorus | `machine` with a real spin-up and stall | body | periodic |
| **steam release** | soundmark | a sharp broadband hiss with a falling pitch | air | Poisson, rare |
| cooling fins ticking | chorus | §8.9, rate falling as it cools | song | after a stop |
| **the tannoy** | soundmark | `voice` through a narrow band-pass and clipping — unintelligible on purpose | call | rare |
| distant workers | cast | `crowd` through a wall | throat | shift hours |
| a trolley, a shutter, a dropped bar | cast | `clatter` metal | call | any |
| **the shift klaxon** | soundmark | `waveguide` harsh, two tones | call | `clock` |

### factory 2 — the loud room

*The loudest ambience in the book.* The score's own spec says the music vacates the low-mid because the clatter owns it — here the ambience **is** the clatter, and it sits in front.

| source | stratum | made from | band | gate |
|---|---|---|---|---|
| the room | keynote | `machine` close and loud + room resonance | body | always |
| **a press at a fixed period** | chorus | `impact` + `modal` heavy, deliberately **incommensurable with the score's pulse** so it never reads as a doubled metronome | floor+body | always |
| a drop hammer | chorus | `hammer` scaled up | body | always |
| a grinder | chorus | `friction` at the top of its range | song | intermittent |
| a furnace | chorus | `fire` large | air | always |
| a chain hoist | chorus | `friction` + `clatter` metal | throat | intermittent |
| shouting over the noise | cast | `voice` forced, short | call | shift hours |
| a spanner, a bar, a bin | cast | `clatter` metal | call | any |
| **a steam dump** | soundmark | as factory 1, bigger | air | rare |

### sewer 1 — the pipe with light down it

| source | stratum | made from | band | gate |
|---|---|---|---|---|
| **the pipe tone** | keynote | `waveguide` closed, long — at a different length from the score's blown drone | body | always |
| the flow | keynote | `water` 'stream', lowpassed, heavy send | throat | always |
| a sluice | chorus | `water` 'fountain' | air | always |
| drips with a long tail | chorus | `drip`, `reverb: 1` | song | always |
| **a grating overhead** | soundmark | a thin band of muffled street: `crowd` + footsteps, band-passed hard | call | day |
| rats | cast | `phisem` scurry + a high squeak | air | always |
| water falling down a shaft | cast | `water` + `bubble` | throat | always |
| a distant voice down the pipe | cast | `voice`, unintelligible, enormous send | throat | rare |
| **a manhole cover** | soundmark | `clatter` metal huge, above you | body | rare |

### sewer 2 — the maintenance side

| source | stratum | made from | band | gate |
|---|---|---|---|---|
| a fan | keynote | `machine` small, high | throat | always |
| close, dry, low air | keynote | `wind` narrow, indoors | body | always |
| a pump cycling | chorus | `machine` with a real duty cycle | body | periodic |
| a valve, a trickle | chorus | `water` 'cistern' | throat | always |
| a dripping pipe with a metallic ring | chorus | `drip` into a `modal` pipe | song | always |
| **a strip light buzzing and stuttering** | soundmark | §8.4 mains buzz gated by an irregular flicker | call | always |
| rats | cast | `phisem` | air | always |
| a hinge | cast | `friction` | throat | any |
| **water hammer down the pipe run** | soundmark | one `impact` fired into several emitters at staggered delays along the run | body | rare |

### scrapyard — mountains of it, pulse-free

| source | stratum | made from | band | gate |
|---|---|---|---|---|
| exposed wind over metal | keynote | `wind` strong, bright | air | always |
| **loose corrugated sheet** | keynote | §8.5 plate — low, dense, inharmonic modes excited by gusts. The defining sound of the place | body | wind |
| chainlink whistling | chorus | §8.3 Aeolian tone, rises with wind speed | song | wind |
| a hanging chain, a tarpaulin | chorus | `friction` + §8.5 | throat | wind |
| **car bodies ticking as the sun leaves them** | soundmark | §8.9, rate falling; gated on `sunElevation` descending | song | dusk |
| a stack settling | cast | `phisem` large + `thump` | body | rare |
| **a stack collapsing** | soundmark | `phisem` very large, once in a long while | body+floor | very rare |
| gulls inland | cast | §8.1 wailing series | call | day |
| crows, rats, a dog | cast | §8.1 / `phisem` / `animal` | throat | day |
| a distant crusher, a torch cutting | cast | `machine` / `friction` bright | body / air | day |

### substation 1 — the chainlink maze that hums

| source | stratum | made from | band | gate |
|---|---|---|---|---|
| **transformer hum** | keynote | §8.4: **100 Hz** from magnetostriction — twice line frequency, not line frequency — with a stack of mostly even harmonics over it | body | always |
| **corona hiss, louder in the wet** | keynote | §8.4, broadband, rate scaled by `amountOf('rain')` | air | always |
| fans | chorus | `machine` | throat | always |
| **the fence singing up in a gust** | chorus | §8.3: Aeolian tone at `f ≈ 0.2·U/d` — about 530 Hz for a 3 mm wire at 8 m/s, and it rises with the gust | song | wind |
| an insulator ticking | chorus | §8.9 | song | always |
| relay clicks | cast | `impact` dry, tiny, Poisson | call | always |
| a contactor closing | cast | `thump` + `clatter` metal | body | rare |
| birds on the wires | cast | §8.1 — sparrows, a wagtail | song | day |
| a wasp nest in a cabinet | cast | §8.2/§8.6 | throat | summer |
| **a corona crack in the rain** | soundmark | §8.4, sharp | air | rain |

### substation 2 — the whine, not the buzz

*Unpowered and derelict. Less hum, more wind, and a machine that still moves without power.*

| source | stratum | made from | band | gate |
|---|---|---|---|---|
| **a high whine** | keynote | §8.4 at the harmonic rather than the fundamental — thinner, no mass | song | always |
| wind through the compound | keynote | `wind` mid, nothing to break it | air | wind |
| grass and weeds through the concrete | chorus | `foliage` sparse, dry | air | wind |
| **a broken fan turning freely in gusts** | soundmark | `friction` + `machine` with rpm driven by the gust field and nothing else | throat | wind |
| a door, a loose panel | chorus | §8.5 | body | wind |
| birds nesting in the gear | cast | §8.1 | song | day |
| insects, a rat, paper | cast | §8.2 / `phisem` / `grain` | air | warm |
| a stone falling | cast | `impact` + `modal` concrete | body | rare |

### beach — the cold Atlantic

*Keynote:* the surf, and it deserves its own model (§8.3). The swell keeps the score's time; it should keep the ambience's too.

| source | stratum | made from | band | gate |
|---|---|---|---|---|
| **the surf cycle** | keynote | §8.3: swell → break → **draw-back over shingle, which is literally Cook's model** | air+body | always, period 8–14 s |
| wind off the water | keynote | `wind` — the strongest in the book, nothing breaks it | air | always |
| marram grass | chorus | `foliage` dry, high | air | wind |
| a rope on a pole, a boat | chorus | `friction` + `thump` | body | wind |
| **the bell buoy — rung by the swell** | soundmark | `bell`, fired **from the surf cycle's own phase**, so the soundmark derives from the keynote | song | always |
| **herring gulls, the long wailing series** | soundmark | §8.1 | call | day |
| kittiwakes, oystercatcher piping | cast | §8.1 | song | day |
| curlew on the shore | cast | §8.1 | song | winter |
| a raven on the cliff | cast | §8.1 | throat | day |
| seals moaning | cast | `formant` long tract, rare | body | any |
| **a foghorn** | soundmark | `waveguide` very low, two-tone, long | body | `amountOf('fog')` |

### beach path — the same water, walked past

| source | stratum | made from | band | gate |
|---|---|---|---|---|
| surf, further and duller | keynote | §8.3 through the distance chain | body | always |
| gorse and grass | keynote | `foliage` dry | air | wind |
| a fence wire | chorus | §8.3 Aeolian | song | wind |
| **gorse pods cracking in the heat** | soundmark | `impact` tiny, Poisson, rate from `temperature` | song | hot, dry, day |
| skylark | cast | §8.1 sustained, high overhead | song | spring/summer |
| **stonechat — two stones tapped together** | soundmark | two `impact` clicks. Trivially made, instantly identifiable | song | day |
| meadow pipit, linnets | cast | §8.1 | song | day |
| gulls inland, a distant dog | cast | §8.1 / `animal` | call / throat | day |
| rabbits | cast | `thump` | body | dusk |

---

## 8. Where the current kit falls short

The cast above is mostly reachable with what exists. Nine things are not, and
they are ranked by how much of the quality bar they carry.

### 8.1 `models/birdsong.ts` — the headline

**The biggest single quality lever in this document.** `models/bird.ts` is two
sine sweeps and a partial at 2.02×. It is a decent placeholder and it is the
most-heard ambience sound in the project, so it is the wrong thing to leave
placeholder.

The physics is well established. A songbird's syrinx has two labial sources, one
in each bronchus below the tracheal junction, and each behaves as a variant of a
**van der Pol oscillator**: at the instability the oscillation is born through a
Hopf bifurcation with almost no spectral content, and **it grows spectrally
richer as it grows in amplitude**. The whole song is then a **motor gesture** — a
path traced in a two-parameter space of *air-sac pressure* and *labial tension* —
filtered by the trachea and the oro-esophageal cavity. Two parameters generate
every syllable type there is:

| gesture in (pressure, tension) | what is heard |
|---|---|
| tension ramping up under steady pressure | an upsweep |
| ramping down | a downsweep |
| an arc | a chevron — the commonest syllable shape in songbirds |
| tension oscillating a few tens of Hz | a trill |
| pressure pulsed | a stutter or a rattle |
| pressure below threshold | silence between syllables, with no gate needed |

Two ways to build it, and both belong here:

- **Native first.** An oscillator whose harmonic richness is a function of its
  own amplitude — waveshaping, or a pulse whose width tracks level — through a
  two-resonance tract filter, all driven by scheduled `AudioParam` ramps. No
  worklet, no wasm, everything placed on the audio clock the way the rest of the
  library is, and already far past two sines.
- **`faust/syrinx.dsp` as the tier above it**, the same way `friction` and
  `waveguide` are. It is never load-bearing; `usingFaust` says which is playing.

A species then becomes a **table of gestures** in the shape of `oneshots/animal.ts`'s
`CALLS` — and, as that file already argues at length, **rhythm is the species
more than timbre is**. The song thrush repeating each phrase three times is
worth more than any amount of formant tuning, and it costs a loop counter.

This one file covers robin, blackbird, thrush, wren, chaffinch, tit, warbler,
skylark, cuckoo, curlew, gull, owl, raven, corvids, pheasant and waders.

### 8.2 `models/insect.ts` — stridulation

One mechanism, one table, and it unlocks a whole stratum nobody else has:

- **Cricket** — a nearly pure tone around 4–5 kHz in short chirps. A pulse train
  at the tooth-strike rate exciting a very high-Q resonator (the harp). Chirp
  rate from **Dolbear's law** on `Climate.temperature`.
- **Grasshopper** — femur on wing: noisy, dry, broad, low duty cycle.
- **Katydid** — a coarse broadband rasp, its own Dolbear constants.
- **Cicada** — tymbal buckling at 200–500 clicks/s into a body resonance.
- **Bee, fly, mosquito** — a wing tone with a wandering fundamental and a strong
  second harmonic. Two or three detuned copies make a hive; one with a `passes`
  path is the fly at the window.
- **Nightjar** — not an insect, but the same object: a ~30 Hz pulse train.

`dsp/phisem.ts` and `dsp/modal.ts` already do the hard part.

### 8.3 `models/surf.ts` and the Aeolian tone

Two geophony gaps.

**Surf** is a cycle, not a bed: a slow broadband swell rising over 3–6 s, a break
(a broadband burst with a low thump under it), and the **draw-back** — thousands
of stones dragged, which is Cook's PhISEM exactly, at a count and duration
nothing else in the library uses. Period 8–14 s with a slow drift. It should
publish its phase, so the bell buoy rings on the swell.

**The Aeolian tone** is a wire or a fence singing in wind: vortex shedding at
`f ≈ 0.2·U/d`, so a 3 mm wire at 8 m/s sings near 530 Hz and the pitch *rises
with the gust*. `models/wind.ts` already does exactly this for its whistle layer;
this is a narrower, more tonal sibling that belongs on chainlink, fence wire,
rigging and telegraph wire.

### 8.4 `models/electric.ts`

Transformer hum is **twice the line frequency** — 100 Hz here, from
magnetostriction: the core expands and contracts twice per cycle as flux peaks
in both directions. The harmonics are mostly even, and core nonlinearity adds
more. Over it sits **corona discharge**: a broadband crackle whose rate climbs
in damp air, which makes `amountOf('rain')` a physically correct control.

The same file covers a failing fluorescent tube (the same buzz, gated by an
irregular flicker) and the derelict substation's whine (the harmonic without
the fundamental).

Not to be confused with the score's `hum` instrument — that is a musical voice
and this is a machine.

### 8.5 `models/plate.ts`

A large thin sheet in wind: corrugated iron, a tarpaulin, an awning, a banner, a
shutter, a sign. Low, dense, inharmonic modes excited by gusts and by an
occasional hard snap when the sheet lets go. `dsp/modal.ts` plus a gust-driven
excitation, and it is the defining sound of the scrapyard.

### 8.6 `models/flock.ts`

`models/crowd.ts`'s structure — N throats, phrases, overlapping pauses, and the
pauses doing the work — with a non-human source. Rooks, gulls, starlings, geese,
bats, frogs. Frogs get one extra thing worth having: **entrainment**, where the
chorus pulls into phase and then breaks apart again.

### 8.7 The distance chain

Not a model. One shared chain — a lowpass, a short diffuse pre-delay, and a
heavy send — that any one-shot may be routed through so that one bird model
covers both ends of the ring. This is what stops the cast doubling in size.

### 8.8 The pass

A moving emitter: a path over 2–6 s, walked with `Emitter.moveTo`, with a
hand-written `detune` ramp for the Doppler `PannerNode` will not do. Rooks,
swifts, a fly, a bee, a pheasant, a stone.

### 8.9 `models/tick.ts`

A clock, an insulator, a cooling engine, a car body at dusk. A periodic impulse
into a small resonator, with a rate that may fall as the thing cools. Three at
coprime periods is the shop.

---

## 9. Performance

The engine's budget is 8 HRTF voices and 24 audible emitters. Ambience has to
live inside it beside the zone's own soundscape and the score. The following are
limits, not targets.

| | budget |
|---|---|
| `air` layers per vibe | ≤ 3 models, non-positional, straight to the bed bus |
| `chorus` emitters live at once | ≤ 6 |
| cast voices live at once | ≤ 6, pooled |
| signals live at once | 1 |
| ambience share of the emitter cap | ≤ 12 of 24 |
| ambience emitters that may reach `hrtf` | ≤ 2, and only `near` |
| director cost per pump | one conditions sample, six counters, one pass over the cast |

Five decisions carry most of it:

**Pool by band, not by species.** `ScatterField` builds one `OneShot` per voice
per spec, so a cast of fifteen birds would be fifteen fields. Instead the
ambience rack owns a **small pool of generic voices per band**, and the species
is an argument to `fire`. A pool of four in `song` serves every songbird in the
vibe. This is the single largest saving in the design and it is why §8.1 is one
model with a table rather than fifteen models.

**The niche allocator is a performance feature.** An event dropped because its
band is busy is an event never synthesised, and the drop is inaudible by
construction.

**`far` is cheap by construction.** `panned`, `ignoreOcclusion` (no raycast),
low `importance` so it loses the budget first, and one shared distance chain
rather than a filter per source.

**Gates are checked before anything is built.** A cast member out of season, out
of hours or rained off costs one comparison. The insect layer at 4 °C costs
nothing at all, and that is the normal state for half the year.

**A silenced ambience is disconnected, not turned down.** Same rule as the
emitters: a source running into a zero gain still has every filter processed
each quantum.

---

## 10. Not in scope

- **No samples.** Same as everywhere else, and there will not be one.
- **No checks, probes or verification scripts.** Not permanent, not temporary.
  Read the code; judge it in the world.
- **No scene dressing.** Builders are untouched by this document. An ambience
  does not place props and does not ask for any.
- **No weathering.** Nothing here adds wear, rust, lichen or grime to anything.
- **It does not replace `SoundscapeSpec`.** Hand-placed sound stays hand-placed;
  see §3.
- **It does not own creature calls.** A dog you can see barks through its own
  `Creature` and `life/spec.ts`'s `call`. Ambience only speaks for what is not
  there.
- **No ambience in an interior by default.** `INDOOR_ENVIRONMENT` is `SILENCE`
  on purpose — a room that is genuinely quiet is what makes a threshold work.
  The two interior vibes are opt-in like everything else.

---

## 11. Steps

In order. Each is judged by listening, and the three marked **ship** are the
points where the work stands up on its own.

### Foundation — nothing sounds different

1. **The types.** `AmbienceSpec`, `Band`, `AirLayer`, `ChorusLayer`,
   `CastMember`, `Signal`, `Window`. A discriminated union all the way down, so
   a typo is a compile error.
2. **`src/audio/vibes.ts`.** `Vibe`, `VibeName`, `VIBES` — the twenty-two
   existing `MusicSpec` constants paired with placeholder ambience specs, each
   one bare `air` layer lifted from that zone's current wind bed.
3. **`ZoneEnvironment.vibe`.** `VibeChoice`, and the rotation seeded on zone id
   plus game day.
4. **`ZoneManager` splits the choice** and hands each director its half.
   Migrate every zone that declares `music`. **Ship.**

### The director

5. **`AmbienceDirector`.** One rack per spec, built once and silenced often; a
   `Ticker` pump at 100 ms off the frame loop; `setActive`, `dispose`.
6. **The conditions sample.** One struct per pump from `Climate`, `Weather` and
   the zone, handed to every gate — two cast members must not disagree about
   what time it is.
7. **Air layers.** The keynote onto the bed bus, driven by conditions. The first
   audible step.
8. **`setZone` and the border.** 0.9 s in, 0.35 s out to nothing; activity,
   cycle phase and hush state carry across unchanged.
9. **Tiers and siting.** The ring, elevation, and the `near` / `mid` / `far`
   emitter parameters of §5.
10. **The distance chain** (§8.7). One shared lowpass, pre-delay and send that
    every `far` source routes through.
11. **Pooled voices per band**, and fire-or-drop. Not a field per species — this
    is the saving the whole design rests on.
12. **The activity curve.** Hour, season, weather, and three value-noise cycles
    at coprime periods.
13. **The gates.** Every `Window` field against the conditions struct, per §6.
14. **The cast walked, and the chorus sited.**
15. **Author the twenty-two casts from existing models only** — `bird`,
    `animal`, `clatter`, `drip`, `bell`, `crowd`, `foliage`, `water`,
    `friction`, `waveguide`, `machine`, `fire`. Correct behaviour, placeholder
    voices. This is the step that proves the design. **Ship.**
16. **Signals and soundmarks.** One at a time, with a floor on the gap, and
    `clock: 'hour'`.

### The mechanics

17. **The band ledger.** Six counters, and the occupancy rule.
18. **The score handshake.** The director reads the active `MusicSpec`'s root
    and `melodyOctave` and raises the floor in those two bands; `yield` is the
    author's override. One number each way, and the only place the two
    directors talk.
19. **The hush**, with its wake-order recovery.
20. **Answering** across two positions.
21. **The pass**, with the hand-written `detune` ramp.

### The synthesis, in order of how much of the book each unlocks

22. **`models/birdsong.ts`**, native tier. The quality step.
23. **Move the cast onto it** and retire `models/bird.ts`.
24. **`models/insect.ts`** — and with it the temperature coupling.
25. **`models/surf.ts`** and the Aeolian tone.
26. **`models/electric.ts`**.
27. **`models/plate.ts`**.
28. **`models/flock.ts`**.
29. **`models/tick.ts`**.
30. **`faust/syrinx.dsp`** above the native birdsong. Never load-bearing;
    `usingFaust` says which is playing.

### Tuning

31. **A way to audition** — switch vibe, scrub the hour, force the weather, fire
    any cast member. Most likely a debug menu; shape open, no gallery zone.
    Pull this earlier the moment tuning starts to hurt, which will be somewhere
    around step 24.
32. **The tuning pass**, vibe by vibe, in the world. **Ship.**

---

## 12. Decisions

**Whistling and humming are not in the score's key.** A whistler in the lane is
a person, and is deliberately out of tune with whatever the director is playing.
Diegetic and non-diegetic stay apart: the whistle reads as somebody real rather
than as an instrument that wandered out of the rack. Applies to the village
whistler, the hummer next door and the voice in `cave 2`.

**`cave dark` keeps its causes.** Nothing in that cast is unexplained, nothing
responds to the player, nothing implies company. The dread is depth, load and
indifference. See the vibe's entry in §7.

**The fiction is industrial, and fun beats accuracy.** The tannoy, the klaxon,
the conveyor and the press stay. More generally — and this now runs through the
whole cast, not just the industrial half — where being right and being
interesting disagree, take the interesting one. Physics is the method here, not
the goal: it is used because it is the cheapest route to something that sounds
alive, and it is overruled the moment it stops being that.

**Auditioning is a tooling question, deferred.** Cast members do not need art-kit
objects; a debug menu will do it better. See §3. No gallery zone is planned.

**Vibe names stay placeholders.** `'village 1'`, `'cave dark'` and the rest are
working labels and remain so. Under §3 the name stops being a dev-panel label
and becomes the API — `VibeName`, the key of `VIBES`, and the string a zone
spells out — so renaming later is a wider edit than it would be today. That is
accepted. Nothing in this plan waits on the fiction.

---

## Sources

- [Bernie Krause — *The Niche Hypothesis*](https://www.academia.edu/12453440/The_Niche_Hypothesis) and [Bernie Krause (overview)](https://en.wikipedia.org/wiki/Bernie_Krause) — biophony, geophony, anthropophony, and spectral/temporal partitioning.
- [Geophony, Biophony & Anthropophony](https://justsoundeffects.com/article/geophony-biophony-anthropophony/)
- [R. Murray Schafer, *The Soundscape* — introduction](https://musicstudios.calarts.edu/wp-content/uploads/2016/02/Shafer-Introduction.pdf) and [Keynotes, Signals and Soundmarks](https://www.bulldozia.com/2010/07/17/keynotes-signals-and-soundmarks/)
- [Acoustic ecology](https://en.wikipedia.org/wiki/Acoustic_ecology)
- [Models of birdsong (physics) — Scholarpedia](http://www.scholarpedia.org/article/Models_of_birdsong_(physics))
- [The physics of birdsong (Mindlin)](https://www.researchgate.net/publication/260264013_The_Physics_of_Birdsong) and [birdsongs — motor-gesture implementation](https://github.com/saguileran/birdsongs)
- [Synthetic birdsongs from low-dimensional dynamical models](https://www.frontiersin.org/journals/neuroscience/articles/10.3389/fnins.2021.647978/full)
- [Dolbear's law](https://en.wikipedia.org/wiki/Dolbear's_law) and [Crickets and temperature (UNL Entomology)](https://entomology.unl.edu/sites/unl.edu.ianr.casnr.entomology/files/media/file/Crickets%20and%20Temperature.pdf)
- [Dawn chorus timing and species order](https://www.discoverwildlife.com/how-to/watch-wildlife/dawn-chorus-guide), [Dawn chorus (birds)](https://grokipedia.com/page/Dawn_chorus_(birds)), [What bird wakes earliest — eye size and light](https://scienceinsights.org/what-bird-wakes-up-the-earliest-for-the-dawn-chorus/)
- [Why transformers hum at 100/120 Hz — magnetostriction](https://industrialmonitordirect.com/blogs/knowledgebase/transformer-magnetostriction-hum-why-100120hz-not-300360hz), [Mains hum](https://en.wikipedia.org/wiki/Mains_hum), [Corona discharge and power-line buzz](https://www.scienceabc.com/innovation/why-do-power-lines-produce-a-buzzing-sound)
- [How to make ambiences for games](https://www.gameaudiolearning.com/knowledgebase/how-to-make-ambiences-for-games) and [Tell Me Why — audio diary: beds, one-shots and runtime modulation](https://www.audiokinetic.com/en/community/blog/tell-me-why-audio-diary-part-3-sound-design/)
