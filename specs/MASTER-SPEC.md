# Here Stands What Once Was — specification

A first-person browser game served from GitHub Pages. three.js, TypeScript, Vite. No art
or audio assets: every mesh and every sound is generated in code.

This document is the source of truth for the build. It is written to be read cold, without
prior conversation context. Update it as decisions change.

---

## Status

| Phase | State |
|---|---|
| 0 — Harness | **Complete** |
| 1 — First-person controller | **Complete** |
| 2 — Render pipeline and filters | **Complete** |
| 3 — Procedural audio engine | **Complete** |
| 4 — Procedural art kit | **Complete** |
| 5 — Zones and portals | **Complete** — trigger volumes deferred; residency and streaming landed with `ZONE-LOADING` |
| 6 — Procedural audio: the sound of places | **Complete** |
| 6b — Galleries, and objects for the sounds | **Complete** |
| 6c — Procedural music | **Complete** |
| 6d — The voicing pass | **Complete** |
| 6e — The vibe book | **Complete** |
| 6f — The wider band | **Complete** |
| 6g — The composed machine | **Complete** |
| 6h — Nine places, one band | **Complete** |
| 6i — Rust and cold water | **Complete** |
| 6j — Bows, bends and breath | **Complete** |
| 6k — The old rules | **Complete** |
| 6l — The back of the wagon | **Complete** |
| 6m — The other side of things | **Complete** |
| 6n–6s — The theory pass | **Complete** — voice leading, melody invariant, metrical accent, harmonic distance, pulse-free structure, phrase form |
| 7 — Actors, animation, wind sway | **Complete** — figures, animals, rig, gaits and voices, per `done/LIFE.md` |
| 8 — Keyword dialogue, quests, narrative | **Not started** — the largest unbuilt phase, and two other documents wait on it |
| 9 — Autosave, performance | **Performance complete**; autosave not started. Touch controls **dropped** — desktop keyboard and mouse only |
| 10 — Content authoring | **Not started** |
| 11 — World editor *(cuttable)* | **Deferred** — `EDITOR.md` is the plan for it; revisit when hand-editing hurts for a reason a builder cannot fix |

### Where the rest of the work lives

`specs/` holds what is open; `specs/done/` holds what is closed and is kept for
its reasoning. Open, at the time of writing:

| | |
|---|---|
| `CLIMATE.md` | The clock, the weather, the surfaces and the sky. Steps 1–14 **built**; the numbers in the atmosphere table and the genus roster are open to tuning |
| `ATMOSPHERE-WEATHER.md` | Superseded by `CLIMATE.md` except for §3, props that make their own air |
| `SHADERS-V2.md` | God rays, heat shimmer, depth of field |
| `EDITOR.md` | Zones as data, then the editor over that data |
| `SWIMMING-CONTROLS.md` | Water the player can be inside |
| `VISTA.md` | The countryside band, and picking into the vista merge |
| `FOOTSTEPS.md` | Crouch, per-foot character, the surface derivation table |
| `READABLES-POLISH.md` | Making the reading screen worth stopping for |
| `ZONE-LOADING.md` | Migrating the remaining zones to lazy load |
| `NPC-ANIMATION-BLEND.md` | Tweening a figure's gestures into one another |
| `FUTURE-REFACTORS.md` | Understood, unblocked, unscheduled |
| `BUGS.md` | Temporary, until there is a tracker |

---

## Locked decisions

| | |
|---|---|
| **Title** | Here Stands What Once Was (`hswow.net` — the initials are unchanged) |
| **Camera** | First person, modern FPS — pointer lock, WASD, shift sprint, Escape releases |
| **Art** | Procedural code-only meshes; glTF loader wired but unused |
| **World** | Bounded, hand-authored exterior ringed by natural barriers. No noise terrain, no infinite streaming |
| **Audio** | Fully procedural, 3D positional, per-zone acoustics |
| **Dialogue** | Morrowind/FF2 keyword system — static greetings, learned topic pool |
| **Saves** | Autosave only. No save UI, no reset, no manual load |
| **Shell** | No title screen, no pause menu, no intertitles. Boots straight into the world |
| **Combat** | Out. There is no danger in this world |
| **Accessibility** | Not a goal. The game is meant to be obscure |
| **Stack** | three.js + TypeScript + Vite → `docs/` |

### Working agreements

- Plan and get sign-off before implementing anything multi-file.
- Nothing is committed, pushed, or deployed without explicit confirmation.
- Naming and fiction belong to the repo owner. Do not invent premise or title.

---

## The audio system

Audio is a headline system, not dressing. Ambience and immersion carry the game even
though it is visually simple.

### Why not per-sample synthesis

An `AudioWorklet` generating noise per sample per emitter does not scale past a handful of
voices. Instead **pre-render noise once** — white, pink, brown, a few seconds each — into
`AudioBuffer`s at boot, then loop them from `AudioBufferSourceNode`s with randomized start
offsets and slight `playbackRate` variation so voices decorrelate. Character comes from
cheap, hardware-accelerated `BiquadFilterNode`s and `GainNode`s. Worklets are reserved for
models that genuinely need per-sample state.

### Four tiers

Phase 6 gave the library a shape. Tier 0 is the substrate that existed from Phase 3 — noise
buffers, the gust field, the material tables. Tier 1 is `audio/dsp/`: primitives extracted
from models that had already proved them, and the answer to the fact that Poisson
scheduling had been written three times and modal resonance twice, disagreeing with itself
both times. Tier 2 is the model library, native Web Audio node graphs. Tier 3 is
`audio/faust/` — precompiled `.wasm` worklets.

**Nothing in tier 3 is load-bearing.** Every Faust model has a native fallback or is
optional dressing, so a wasm that does not load degrades the soundscape rather than
breaking the game. It is used for the two things node graphs genuinely cannot do: a
feedback delay network whose decay is a live parameter, and a per-sample friction loop.

### Synthesis models

Each is a factory returning `{ output, update(dt), setActive(), dispose() }`, so any model
can drive any emitter.

**Wind** — three layered bands off the noise buffers:

| Layer | Source | Filter |
|---|---|---|
| Low rumble | brown noise | lowpass ~200 Hz |
| Mid whoosh | pink noise | bandpass 400–900 Hz, Q ≈ 2 |
| High whistle | white noise | bandpass 1.5–4 kHz, Q ≈ 8–20 |

A **gust generator** — smooth 1-D value noise, *not* an LFO, because an LFO reads as
periodic within about thirty seconds — drives all three band gains plus the whistle's
center frequency and Q. Center frequency rises with wind speed. Wind speed and direction
are **global world parameters** so everything downstream stays coherent.

**Foliage** — granular synthesis, the standard technique for wind-in-trees: one grain ≈ one
leaf or branch rustle. A grain is a 5–40 ms noise burst through a 2–8 kHz bandpass with
fast attack and short exponential decay. Grain rate and amplitude are driven by **the same
gust signal as the wind model**, so trees rustle when the wind actually gusts rather than
idling independently. Grains are scheduled against `AudioContext.currentTime` with a
lookahead window — the "two clocks" pattern — not on the render loop, so timing survives
frame hitches.

**Machinery** — fundamental plus a detuned harmonic stack through a lowpass, amplitude
modulated at the rotation rate, with filtered-noise bearing hiss and a per-revolution
impulse through a resonant bandpass for the clank. Rotation rate is a parameter, so
machines can spin up, labor and stall.

**Footsteps** — noise burst shaped by a material-specific resonant filter and envelope,
randomized per step, material read from the surface underfoot. Driven by head-bob phase so
steps land with the camera.

**Friction** — stick-slip, and the only genuine per-sample case in the library. The
friction force depends on the relative velocity, the relative velocity depends on how the
body is already moving, and the body moves because of the force: a loop that has to close
every sample. The shortest loop a node graph can express is one render quantum, 2.7 ms,
which is longer than a whole slip cycle. Everything else follows from one fact — kinetic
friction is lower than static and *falls* as speed rises — so the sliding speed is not a
volume control but a walk across that curve, and groan, squeal and rub fall out of the
physics rather than being three sounds crossfaded. Ropes, axles, hinges, chains, a tree
under load. A native fallback schedules slip events into a modal bank; it creaks and rubs
but cannot reach the sung tone at the top of the range, which is the boundary the loop
exists to cross.

**Waveguide** — a delay line that feeds itself: chimes, hanging wire, struck tubes, singing
bowls, and air through pipework or an arrow slit. The second thing node graphs cannot do,
and for a blunter reason than friction. A `DelayNode` in a Web Audio feedback loop is
clamped by the spec to at least one render quantum — 128 samples, 2.67 ms — which resonates
at 375 Hz, and that is the *ceiling*, because the delay cannot be made shorter. Every pitch
above middle F# is unavailable by construction. The delay here is also fractional, which
matters more than it sounds: at 2 kHz a whole-sample step is nearly a semitone, so a rank
of chimes tuned in integers would be audibly sour.

One sign controls whether the wave reflects in phase or inverted, which is the difference
between all harmonics and odd ones an octave down — a flute and a clarinet, a struck wire
and a stopped pipe, for one multiply. **It takes an audio input and makes no sound of its
own**: the excitation is scheduled from TypeScript with `dsp/impact` and `dsp/clock`, so
strikes stay sample-accurate. That split is the pattern for every module after this one —
Faust does the part node graphs cannot, and the substrate does everything else.

**Also built:** water, fire, rain, crowd, bird as continuous models; hammer, clatter,
animal, drip and bell as one-shots fired by scatter fields.

### Spatialization

Every emitter owns a `PannerNode` with an inverse distance model and per-emitter
`refDistance` / `maxDistance` / `rolloffFactor`. Web Audio is y-up, same as three.js, so
positions map directly.

**HRTF is the most expensive node in the API**, and it is also the one that makes a sound
seem to be outside your head. The way to afford both is to pay for it only where it is
audible, so the engine hands out three levels by rank: the nearest handful get `hrtf`, the
rest get `equalpower`, and past `maxDistance` they go **virtual** — disconnected, not
turned down, because a silent source still has every node processed each quantum. Swapping
between the first two happens under a brief gain dip, because HRTF carries a delay that
equal-power does not.

On top of the panner:

- **Air absorption** — a lowpass whose cutoff falls with distance. High frequencies are
  absorbed more by air; this is what makes far-off sounds read as far off rather than
  merely quiet.
- **Occlusion** — raycast listener→emitter every N frames, then blend gain and a lowpass
  toward occluded values using `setTargetAtTime` to avoid zipper noise. A machine behind a
  wall should thud, not vanish.
- **Directionality** — `coneInnerAngle` / `coneOuterAngle` / `coneOuterGain` for emitters
  that face a direction.

**And three switches that turn physics off.** `ignoreAbsorption`, `ignoreOcclusion` and
`invertDistance`. The way to signal that something is not an ordinary object making an
ordinary noise is to have it disobey the rules every other sound visibly obeys: a voice
that does not dull with distance, or that walls do not muffle, is placed by the ear as
"not here" long before the player could say why. Used sparingly they are uncanny; used
often they are a mix with no depth in it.

### Per-zone acoustics

Each zone declares RT60, pre-delay, damping and wetness. Two implementations, and exactly
one is audible.

**A feedback delay network**, compiled from `reverb.dsp` — Fons Adriaensen's `zita_rev1`,
with separate decay times either side of a crossover because a stone room's bass rings far
longer than its treble and a single RT60 cannot say so. The point of it is that changing a
room changes *parameters*: the tail already ringing carries on and starts dying at the new
rate, so walking out of a hall is the room changing size rather than a crossfade between
two of them. It is also what makes a cave tunable with no cave to stand in.

**The fallback** is the original design and still ships: impulse responses generated at
boot in an `OfflineAudioContext` — noise shaped by an exponential decay, filtered for
damping, decorrelated per channel — into two `ConvolverNode`s crossfaded past each other,
because swapping a convolver's buffer cuts its tail dead. Built only if the wasm did not
arrive; a `ConvolverNode` keeps convolving into a muted gain, and three of them running
behind a fader for nothing was the first version's mistake.

### Zone soundscapes

A zone declares what it sounds like as data, the same way it declares its fog:

- `bed` — non-positional models. The air you are standing in. Wind is not *somewhere*, so
  spatialising it is not merely wasteful but wrong.
- `emitters` — models at world positions.
- `scatter` — one-shots fired at random points in a region at Poisson intervals. Continuous
  sources establish that a place exists; scattered ones establish that somebody lives in it,
  and that single primitive did more for ambience than any three synthesis models.

Built on entry and **silenced, never torn down**, on exit. Zones are revisited constantly,
granular models are not free to construct, and a gap where the wind should be is more
noticeable than a few dozen dormant filters. Same reasoning as "never dispose materials per
zone", in the other direction.

**Placement runs object → sound, never the reverse.** Every emitter in the game has
something visible standing at its position, and the coordinates come from the object.

### Graph and voice management

```
model → panner → ├→ dry ───────────────────────┐
                 └→ reverbSend → zoneConvolver ─┤
                                                ├→ master → compressor → destination
                                 dialogue duck ─┘
```

Panners come from a pool. Emitters past `maxDistance` release their nodes and go *virtual*
— still simulated, not audible. A cap on concurrent voices sheds by priority
`f(distance, importance)`. The context resumes on the first pointer-lock click, which
doubles as the autoplay-policy gesture, and suspends on `visibilitychange`.

### Audio tooling

**The sound stage** — a room with one of everything in it, standing in a line on pedestals.
Every station is identically configured, so the only difference between two of them is the
model, which is what makes it a comparison rather than a demonstration. A rank and not a
circle: half of what these models do is change with distance, and none of that is audible
from a fixed radius. Reachable only from the zone jump list under `?debug`, because
fifteen sources at once is a workbench and not a place.

Alongside it in the panel: solo per emitter, a spectrum and level meter on the master bus,
and **a generated control panel for every Faust module**. The meter earns its place on the
narrowest ground — audio has no visible output at all, so a silent model and a muted bus
are indistinguishable until something draws one of them.

The generated panels are read, not written. Each `.dsp` already declares every control's
range, step and default, and `tools/faust-build.ts` carries all three through to the
runtime, so a folder builds itself from the module and is correct for a module nobody has
written yet. This was worth doing on evidence rather than on principle: `friction` shipped
with seven controls and no panel, and was tuned by instantiating the compiled wasm in Node
and printing octave-band tables — which found two structural faults and is an absurd way to
answer "is this a little too bright." Hand-writing sliders is the alternative, and it means
the bounds are typed twice and agree until someone widens one.

There was an `AudioEngine.tuneRoom(rt60, damping, preDelay)` behind three hand-written
reverb sliders. The generated panel covers strictly more — separate low and mid decay, and
the crossover between them, which is most of what makes stone sound like stone — so the
wrapper was deleted rather than left as a narrower duplicate.

**The audition harness** renders the whole library through an `OfflineAudioContext` and
measures it. This does not replace listening; it replaces the *other* listening test, the
one where you walk the rack after every change hoping to notice by ear that something is
now three decibels louder than last week. Nobody notices that, and everybody notices the
mix it eventually ruins.

Two kinds of check. **Rules** are absolute and need no history: clipping, DC offset, a
scheduler that has quietly become a loop, and a crest factor outside what its kind of
source should have. **Baselines** are recorded measurements of a specific model and catch
drift — a change to a shared primitive that moves six models nobody was thinking about.
That is the case for a row per model, and it is a strong one: `impact` has nine consumers,
`clock` seven, `modal` five.

> **The first cut of the rules was miscalibrated, and the first real run proved it.** Six
> of fifteen rows flagged on a library that was fine. Both errors were the same mistake —
> rules written for textures and applied to everything.
>
> **Crest factor means opposite things for the two kinds of source.** A continuous texture
> with a high crest has come apart into audible grains; an impulsive one with a high crest
> is doing its job. Judged by one band, the drip (30 dB), the hammer, the clatter and the
> chime all failed for being correctly transient. There are two bands now, and a subject
> declares which it is by what its *output* looks like rather than by what built it — the
> bird is a continuous model judged as events, because that is what discrete calls with
> silence between them are.
>
> **And loudness cannot be compared across the library.** The plan asked for every model
> within 3 units of every other, on the reasoning that one model four times louder than its
> neighbours is the commonest way a procedural library sounds bad. The reasoning is right
> and the measurement does not test it: models render at their *defaults*, and a zone spec
> sets `gain`, `refDistance` and `maxDistance`, so the mixing happens at placement. The real
> spread is 23 — a wind bed at −47 against an engine at −27 — and both are correct, because
> one is the air you are standing in and the other is a thing you walk toward. The number is
> reported and asserted on never; per-model loudness *drift* is the check that survived, and
> it was always the one doing the work.
>
> The band energies went the same way for a different reason: eight per model is 120
> tripwires that mostly restate the centroid, and every honest re-tuning trips several. They
> are recorded and printed, because reading them is what caught the friction model coming
> out spectrally flat — a diagnostic, not a gate. A check that cries wolf trains you to stop
> reading it, and then it cannot catch the one that mattered.

Rendering a scheduled model offline needs `OfflineAudioContext.suspend`, and that is the
whole trick: `startRendering()` is one call, so a naive render pumps the scheduler once and
returns a lookahead window of sound followed by silence. Suspending at fixed intervals and
pumping at each is the offline equivalent of a frame — and better than one, because the
steps are exact, so a texture rendered twice is identical where the same model on
`requestAnimationFrame` never is.

---

## The music system

*Planned — Phase 6c. Spec written ahead of the build.*

A non-diegetic score, generated like everything else: no composed tracks, no note data in a
file pretending not to be an asset. A **director** reads the zone's declared mode, palette
and density and plays — or, most of the time, deliberately does not. The library today can
make places; this is the layer that says how a place *feels*.

### What the acclaimed ones actually do

The case studies — Soule's Elder Scrolls scores, Minecraft, Breath of the Wild, Journey,
No Man's Sky, Spore — converge on one sentence: **every acclaimed exploration score is a
scarcity system.** Harmonically ambiguous, percussion-free, soft-attack material in one
locked scale, where the thing being generated is mostly *time*. The notes are conservative;
the silences are the design.

Four lessons carried whole:

- **Silence is the primary anti-fatigue tool.** Minecraft waits a randomized 10–20 minutes
  between tracks, and that scarcity is what turns background music into an event. Oblivion
  played its explore playlist wall-to-wall and is remembered as wearying; Skyrim added
  silence spacers on purpose. Silence is a valid outcome of every scheduling decision.
- **Scale-lock everything.** Eno's week on Spore: day one was random note sequences, day
  two was filtering them into modes, and that one filter is what turned noise into music.
  One mode per zone; no voice ever sounds a note outside it.
- **Intensity is layer count.** No Man's Sky raises stakes by enabling more instruments at
  once, not by pushing volume or tempo. And exits happen by *removing* layers — Journey's
  transitions are successive subtraction, never a cut.
- **Seeds are motifs.** Spore stored its RNG seeds and re-rolled them later, so a pattern
  could recur: recognition without literal repetition, and without storing a bar of
  composed data. Each zone keeps its seeds, so its music is *its* music on every visit.

### The grammar

| Parameter | Rule |
|---|---|
| Tempo | 50–70 BPM felt pulse, or pulse-free. No percussion in calm states |
| Drone | Root + fifth, **no third** — major/minor stays undecided, so nothing demands resolution |
| Harmonic rhythm | One chord per 2–8 bars; modal and relative moves, never dominant cadences |
| Melody | 2–6 note cells, one leap then steps, scale-locked; cells written order-independent so any permutation connects |
| Texture | Three strata: low drone, mid ostinato, sparse high melody. Melody is an event; texture is what persists |
| Silence | Duty cycle well under half; gaps randomized, never a fixed timer |
| Intensity | Concurrent layer count, nothing else |
| Variants | Day/night is the same seeds with different timbre and rhythm, not different music |
| Sitting behind | Keep 1–4 kHz sparse — speech and SFX live there. Soft attacks, low dynamic range, generous reverb send so entries and exits blur |

### The instruments

Native node graphs, tier 2, the same `{ output, update, setActive, dispose }` contract as
every model — **not Faust**, for one decisive reason: Faust parameters travel by
`postMessage` and land on a render-quantum boundary, which is inaudible on a pad swell and
ruinous on a drum, and a beat grid is the one place the ear forgives nothing. Native nodes
schedule onsets sample-accurately with the pooled envelope curves the library already owns.
The second reason is flexibility: every family below is oscillators, biquads and gains, so
a new zone's genre is a new patch, not a new toolchain artifact. The one thing native
genuinely cannot do — a pitched feedback loop above the 128-sample delay clamp (~F♯4) — is
already covered by the committed waveguide.

| Family | Recipe |
|---|---|
| Strings / pads | Two or three saws detuned ±10 cents through a dual-rate chorus. The chorus *is* the section: each player of a real section drifts independently, and modulated detune is that drift. Attack 80 ms–2 s; something always moving |
| Brass | Saw into a lowpass whose cutoff **overshoots** on attack and settles — higher harmonics speak late, and that bloom is the single most brass-identifying cue |
| Flute | Saw, highpassed then lowpassed ~2 kHz, vibrato at 5–6 Hz applied to *brightness*, not pitch — players vary breath pressure, and broadband hiss makes it less convincing, not more |
| Choir | Detuned saw pair through the existing formant bank, drifting slowly between vowels — a static vowel is a doorbell |
| Bells | The additive bell, adapted to take a frequency |
| Plucks / chimes / harp | The waveguide, struck on schedule from TypeScript, as `pipe-air` and the chimes already are |
| Bass | One saw, one lowpass, keytracked |
| Kick / snare / hat | Sine pitch-drop with a thump; noise burst into a modal snap; filtered noise tick — all assembled from `dsp/impact` and `dsp/phisem` |
| Electric guitar | Waveguide into a `WaveShaperNode` and a cabinet-ish lowpass. The string exists; distortion is a native node |

**What makes a synth read as fake is stasis, not synthesis.** Demoscene 64k intros carried
whole orchestras on saw-filter-chorus-reverb; the ear forgives "synthetic" instantly and
never forgives static or disjoint. So the humanization is the voice contract, not a
per-instrument nicety: no instant envelopes anywhere; vibrato that arrives late (building
over 0.3–1 s, rate jittered a few percent per note); per-note randomization of ±5 cents,
±15 % velocity, ±15 ms timing; velocity into brightness and not merely level; and every
voice sends into the **one shared FDN**, because a common room is most of what glues
admittedly-fake sources into an ensemble — and it is already paid for.

### The director

One non-positional system beside the beds: its own gain into `dry` and `send`, outside the
24-voice emitter budget entirely, with a music slider in options (the gain node exists
regardless). Zones opt in through one optional field — `ZoneEnvironment.music` declaring
root, mode, palette, density and pulse — and **absent means silent**, so every existing
zone is untouched until it is scored on purpose.

Three strata, scheduled by `dsp/clock` against the audio clock:

1. **Drone** — root + fifth pad, near-continuous while a piece plays. It crossfades and
   retunes across zone borders, which is what makes crossing a portal a change of key
   rather than a change of track.
2. **Texture** — ostinato or slow arpeggio cells at the felt pulse, from the zone's seeds.
3. **Melody** — sparse order-independent cells on a solo voice. Enters rarely, states a
   phrase, leaves.

Above them a scarcity state machine: pieces a few minutes long, then long randomized
silence; intensity mapped to layer count; every exit by subtraction. Note generation is
seeded and scale-locked — the Spore recipe — so motifs recur per zone without any authored
score. Day/night variants reuse the same seeds with different timbre; the director takes a
time-of-day input that is stubbed until a day/night cycle exists to feed it.

The theory and pattern code — note-to-Hz, mode tables, the scale lock, cell generation — is
pure arithmetic with no audio context in it, which puts it in `check:audio` territory:
assert every generated note lands in the declared mode, every cell obeys
one-leap-then-steps, every permutation of a cell connects.

---

## The dialogue system

Keyword-driven, after Morrowind and Final Fantasy II. Progression is knowing *what* to ask
and *who* to ask it of. Inventory stays and plugs into the same frame.

### Shape

- **Greeting** — one static line per NPC, shown every time, never changes.
- **Topic pool** — a single global set of keywords the player has learned. Learning is permanent.
- **Asking** — pick a known topic; the NPC answers from their own topic table, or rebuffs.
- **Learning** — responses carry inline markup:
  `He keeps the [[ledger of departures]] and will not be asked about it.`
  The parser renders the keyword highlighted and adds it to the pool when the line is read.
  Writing dialogue and designing progression therefore become the same act.
- **Showing items** — an item can be presented as a conversational move, keyed the same way
  as topics, so fetch quests resolve inside conversation rather than through a separate
  hand-in verb.

### Data model

```ts
interface NPC {
  id: string
  greeting: string                        // static, always shown
  rebuffs: string[]                       // flavored "I know nothing of that"
  topics: Record<TopicId, Response[]>     // first response whose condition passes wins
  itemResponses?: Record<ItemId, Response[]>
}

interface Response {
  when?: Condition      // quest stage, flag, item held, topic already asked
  text: string          // may contain [[keyword]] markup
  actions?: Action[]    // give/take item, set flag, advance quest, teach topic
}
```

Runtime state: known topics, asked topics per NPC (so the UI can mark what's new), and the
flags and quest stages conditions read. All autosaved.

UI is two panes — response text on one side, scrollable topic list on the other — plus an
affordance to present an item from inventory.

### Topic list visibility

Morrowind only lists topics an NPC has an entry for. That is kinder, but the list then
tells you who knows what, undercutting "learning who to ask."

**Decision: list every known topic for every NPC**, with unmatched ones drawing a rebuff
written per character rather than a generic line. Asking the wrong person costs a little
time and tells you something about them. Topics already asked of that NPC dim so you aren't
rereading. Reversible in one line if it plays tedious.

### Beyond flat topics

Mostly flat, like Morrowind — but a response can raise a short inline choice when a moment
needs a real decision. Those are the exception, not the structure.

---

## Feature list

Checked items are decided. Unchecked are open.

### Movement
- [x] Pointer lock, mouse look, sensitivity, invert-Y; Escape releases
- [x] WASD, shift sprint, gravity, jump, slope limit, step-up
- [x] Head bob tied to speed, driving footstep timing
- [x] Sprint FOV kick
- [x] Crouch — the capsule shrinks, with a headroom test before standing up
- [ ] ~~Holding an edge while crouched~~ — **built and cut.** Stopping at a drop
      and leaning out over it worked in the checks and felt buggy to play
- [ ] Stamina limiting sprint — **open**

### Rendering
- [x] Low-poly flat-shaded, vertex colors, no textures
- [x] Pixelation via `RenderPixelatedPass` (depth/normal edge outlines included)
- [x] Clustered-dot halftone dithering, cell size tunable
- [x] Per-channel level quantization, dithered in linear light
- [ ] Dither density driven by surface normal — the texture substitute — **open**
- [ ] ~~Fixed-palette quantization~~ — **cut.** Colour comes from the art, not the renderer
- [x] Per-zone fog and vignette
- [x] Live tuning panel for all of it
- [ ] Scanlines / CRT curvature — **open**
- [ ] Per-zone color grading LUT — **open**

### World
- [x] Bounded authored exterior; hills, cliffs and walls as natural barriers
- [x] Authored heightfield terrain, sculpted not generated
- [x] Ground cover: paths, fields, cobble — colour and footstep sound in one table
- [ ] Proximity-based prop load/unload within the bounded zone — *moved to Phase 9*
- [x] Interiors as their own zones, hand-built, sealed
- [x] Clickable door portals with fade transition and reverb crossfade
- [x] Per-zone config: light, fog, ambience, acoustics, floor material
- [ ] Fixed hour vs day/night — **open** (recommendation: fix at one hour)
- [ ] Weather particles — **open**

### Audio
- [x] Everything in the audio section above
- [x] Water, fire, bird models — *built in Phase 6, with rain, crowd and scatter one-shots*
- [x] Zone-declared soundscapes; panner LOD and voice cap; FDN room acoustics
- [x] Friction family (stick-slip, needs Faust) — *built in Phase 6*
- [x] Sound stage and the rendering half of the audition harness — *built in Phase 6*
- [ ] Music: instrument rack (native voices over the model contract) — Phase 6c
- [ ] Music: theory and seeded pattern generation, asserted in `check:audio` — Phase 6c
- [ ] Music: the director, `ZoneEnvironment.music`, options slider — Phase 6c
- [ ] Music: showcase zone with instrument stations and sample vibes — Phase 6c

### Actors and animation
- [x] Procedural jointed figures from primitives
- [x] Walk cycle, idle sway, head look-at
- [x] Door and mechanism tweens

### Interaction and narrative
- [x] Center-screen raycast, crosshair, verb prompt
- [x] Keyword dialogue: static greeting, global topic pool, per-NPC tables, flavored rebuffs
- [x] `[[keyword]]` markup that highlights and teaches topics as lines are read
- [x] Presenting an item as a conversational move
- [x] Response conditions on quest stage, flags, items held, topics already asked
- [x] Dialogue actions: give/take, set flag, advance quest, teach topic
- [x] Quests with stages, resolving through conversation
- [x] Inventory as a list
- [x] Journal, with a keyword index recording where each topic was learned
- [x] Readable notes and letters found in the world — these teach keywords too
- [ ] Occasional inline choice prompts — **open** (recommendation: keep, used sparingly)
- [ ] Scrollable dialogue history — **open**
- [ ] Unreliable in-fiction map — **open**

### Meta
- [x] Autosave to localStorage — position, rotation, zone, quests, inventory, flags, read
      notes, known and asked topics
- [x] Restores silently on load; no save UI, no reset
- [x] Touch controls — **moved to Phase 1**, see deviations
- [ ] Minimal settings overlay on a key (sensitivity, FOV, filter toggle) — **open**
- ~~Title screen, pause menu, intertitles, accessibility pass~~ — cut

---

## Phases

Each phase ends runnable and tunable. The **Proving Ground** is a permanent debug level
that accumulates test fixtures.

### Phase 0 — Harness ✅

Vite/TS/three scaffold, `docs/` output, `.nojekyll`, Pages config. Proving Ground v0: grid
floor, 1.8 m reference pole, measured cubes, distance markers, stats overlay, tuning panel
shell. Camera is temporary OrbitControls.

### Phase 1 — First-person controller ✅ built

Pointer lock, look, WASD, sprint, gravity, jump, slope/step handling, head bob. Collision
against indexed triangles — no physics engine (see deviations). **Touch controls ship here**
(see deviations). Proving Ground gains a movement gym: ramps at 10/20/30/45°, two stair
pitches, kerbs bracketing the step height, calibrated jump gaps, a strafe wall with a
corner, and a high walkway to fall off.

Shipped:

- `engine/Input` — keyboard, pointer lock (with `unadjustedMovement` where available),
  and touch, all writing into one state the controller reads. Jump is buffered; keys clear
  on blur.
- `player/Collider` — three's `Octree` for broad phase, our own capsule–triangle narrow
  phase. Only meshes on the collision layer are indexed.
- `player/Controller` — capsule, Quake-shaped acceleration, fixed 1/120 s sub-steps,
  ground-plane steering, ledge climbing, ground snapping, coyote time, head bob, sprint
  FOV, landing dip. Exposes `onFootstep` and `onLand` for Phase 3.
- `ui/TouchControls` — dynamic left-half stick, right-half look drag, jump pad.
- `tools/movement-check.ts` — headless assertions, `npm run check:movement`.

**Not built, still open:** crouch and sprint stamina were left undecided in the feature
list and are not in. Both are small additions to `Controller` if wanted.

*Done when the movement feels right. Expect iteration — everything else is experienced
through it. Every constant is a slider under `?debug`.*

### Phase 2 — Render pipeline ✅ built

Composer stack, all parameters live-tunable with saveable presets. Proving Ground gains a
calibration board: colour chart, three gradient ramps, a smooth-shaded sphere and a raked
lit plane for judging banding.

The chain, and the order matters:

```
scene ─► RenderPixelatedPass ─► OutputPass ─► RetroShader ─► screen
         chunky pixels,          tone map     vignette,
         depth/normal edges      and sRGB     dither, quantize
```

`OutputPass` is where linear light becomes sRGB. Spacing quantization steps evenly is only
correct on the display side of that conversion — in linear light every level would bunch
into the shadows — so the pass runs last. The dither *within* a step is the opposite case
and is resolved in linear light; see below.

**The colour is the scene's.** There is no palette in the renderer and there is not going
to be one. Every surface is flat-shaded vertex colour out of `art/palette.ts`, lit, fogged
and tone-mapped; that is the colour set, it is continuous, and it changes when the art
changes. The pass quantizes what it is handed. Nothing here decides what the game is
allowed to look like.

**The dither is the texture.** With no textures anywhere in this game the quantizer is the
entire surface treatment, which is why the pattern list is long: a hatch across a flat
face is the cheapest thing that reads as a material rather than as fill.

Shipped:

- `engine/RetroShader` — a clustered-dot halftone screen, per-channel level quantization,
  and vignette. The dot cell is measured in chunky pixels, not screen pixels: every device
  pixel inside a block carries the same colour, so a threshold that varied within the block
  would dither *inside* it and dissolve the pixelation.
- `engine/PostFX` — owns the composer, the settings, and their persistence. Pixel size is
  authored in CSS pixels and applied in device pixels, so a look dialled in on a desktop
  reads the same on a phone at DPR 3.
- `debug/presets` — localStorage, best-effort, separate from Phase 9's autosave.
- Tuning panel folders: look, vignette, fog, preset (save / reset / copy JSON).

**The dither is resolved in linear light, and this was wrong for a long time.** The old
form added a threshold to the colour and rounded, in display-referred sRGB. But the eye
and the display average two adjacent chunky pixels in *linear* light, so a half-and-half
dither between two levels does not read as their midpoint — at five levels, the middle of
the first band came out **41% too bright** (0.125 in, 0.177 perceived). The fix is to stop
nudging and rounding: find the two levels the colour falls between, solve for the
proportion of the brighter one whose linear average *is* the colour asked for, and compare
that proportion against the threshold. Mean reproduction error over the range falls from
0.0174 to 0.0013 and the worst case from 0.064 to 0.020.

`ditherScale` is how much of one step the dither spreads across. At 1 every tone between
two levels is reproduced exactly; the shipped 1.65 is deliberately over that, so the
transition never fully resolves to flat colour and the dots stay visible as a texture
rather than appearing only at band boundaries.

**Bayer, blue noise, gradient noise and the line and crosshatch screens were all built and
all removed** once the halftone was chosen, along with the per-channel decorrelation knob
and `engine/blueNoise.ts`. Six selectable patterns is six ways to second-guess a decision
that has been made. They are in the history.

*Done when a look can be dialed in and persists.*

### Phase 3 — Audio engine ✅ built

The whole system above: noise substrate, wind/foliage/machinery/footstep models, panners,
air absorption, occlusion, generated IRs, buses, tooling. Proving Ground gains an emitter
garden and two rooms with very different RT60 joined by a doorway.

Shipped:

- `audio/noise` — white, pink and brown rendered once at boot, looped with random offsets
  and slight rate detune so voices decorrelate. Loop points cross-faded.
- `audio/weather` — one global gust field driving everything. Layered value noise with a
  contrast expansion (see below), an integer hash rather than the usual `fract(sin())`.
- `audio/reverb` — impulse responses generated in an `OfflineAudioContext`: decaying noise,
  damped, decorrelated per channel. Three presets: `open`, `cell`, `hall`.
- `audio/AudioEngine` — buses, listener tracking, room crossfade between two convolvers,
  limiter, autoplay-gesture handling, suspend on tab hide.
- `audio/Emitter` — panner, distance-driven air absorption, raycast occlusion, going
  virtual past `maxDistance`.
- Models: `wind` (three bands + gust-driven whistle), `foliage` (granular, Poisson grains),
  `machine` (harmonic stack, AM, bearing hiss, per-revolution clank), `bird` (Poisson calls,
  falls silent in strong wind), `footsteps` (material-filtered, driven by head-bob phase).
- Objects to hang them on: a tree, two bushes, a perched bird, a machine with a turning
  flywheel, and the two rooms.
- `tools/audio-check.ts` — `npm run check:audio`.

**Birds are in**, answering one of the open questions. Water and fire are still not built.

**Not built from the spec:** the spectrum analyser, emitter solo/mute, panner pooling and
the voice cap. Pooling and voice-capping are premature at five emitters and would be
guesswork without a real scene to profile; they belong with Phase 9's performance pass. The
dialogue duck bus exists in the graph but does nothing until Phase 8.

**Not verified by ear.** Everything typechecks and the pure-maths parts are asserted, but
nobody has listened to it.

*Done when walking between those two rooms sounds obviously different, and a machine behind
a wall is audibly occluded.*

### Phase 4 — Art kit ✅ built

`src/art/` mesh builders: figures, trees, rocks, terrain features, buildings, fittings.
Proving Ground gains a gallery row that auto-instantiates every builder.

Shipped, nineteen builders: `barrel`, `bovine`, `bush`, `cairn`, `crate`, `equine`,
`fence`, `figure`, `grass`, `hut`, `mushroom`, `ovine`, `porcine`, `post`, `poultry`,
`rock`, `stump`, `tree`, `trough`. Twenty to four hundred and forty triangles each.

The four hoofed animals share one body plan in `art/quadruped.ts` — a cow, a pig, a sheep
and a horse are the same parts at different proportions, and proportion is nearly all of
what tells them apart at a glance. Poultry is separate: a chicken is not a small
quadruped, its legs come out of the middle of the body rather than the corners.

- `art/types` — a builder is a name, a radius, and `build({ seed, scale })`.
- `art/random` — seeded RNG. **`Math.random` is banned inside builders**: a prop is stored
  in world data as a name and a seed and rebuilt from those on load, so a builder that is
  not reproducible would let the world rearrange itself between sessions.
- `art/assemble` — vertex colours and sway weights baked per part, then merged into one
  geometry sharing one material. One draw call per prop, and exactly one material for
  Phase 7's wind shader to patch.
- `art/palette` — colours named by material, not by hue. Placeholder art direction.
- `art/registry` — `import.meta.glob` over `builders/`, so a new file appears in the
  gallery without anything else being edited. **Vite-only**; nothing reachable from
  `tools/` may import it, which is why the proving ground imports builders directly.
- `art/masonry` — a face of rubble, and the pieces built out of it: the wall, its pier and
  the archway. Stones are **scattered, not split** — a cell is the patch of face nearer its
  own stone than any other, so no joint runs further than the two stones sharing it. What
  makes a run tile is that the sideways warp fades to a shared `seam(y)` at each end, which
  two independently-built pieces both compute identically.
- `art/blob` — welded, vertex-displaced spheres. Shared by rock, cairn and the sheep's
  fleece, along with the non-obvious precondition: normals and UVs must be deleted before
  `mergeVertices`, or nothing welds and the weld silently does nothing.
- `MeshBuilder.solid` — grass, mushrooms and poultry are walked through. Blocking on a tuft
  of grass is the fastest way to make a world feel like a floor with boxes on it.
- `debug/Gallery` — four seeds per builder, spaced by each builder's own radius.
- `tools/art-check.ts` — `npm run check:art`.

The proving ground's tree and bushes are now built by the kit rather than by hand. The
audio anchors did not move: a sound belongs to a place, not to whichever mesh is standing
there.

**Builders must author sway weights.** Every mesh that will move in the wind carries a
per-vertex weight — 0 at the roots, 1 at the tips — baked into a vertex attribute at build
time. Phase 7's sway shader reads it and nothing else; without it, a trunk swings from its
middle and a leaf cluster shears off its branch. This is cheap to do while the geometry is
being generated and effectively impossible to add afterwards, which is why it belongs here
rather than there.

**Builders must author collision.** A prop's collidable geometry should resemble only the
part of it that can actually be collided with or stepped on — the branches and trunk of a
tree, not its leaves; a door's leaf and frame, not its rivets, straps, hinges, handle or
window bars. Embellishment and accessory detail are there to be looked at, and nothing
that is only there to be looked at should be in the collision index.

This is a performance rule and a feel rule at once. The collider indexes raw triangles, and
cost rises faster than linearly with how *densely* they are packed — a hand-span of small
detail is far worse than the same triangle count spread over a wall. Pressing the capsule
against a signboard used to cost whole milliseconds a frame for the sake of its lettering,
which is why `art/lettering` flags itself `noCollide` and why `signboard` and `banner` hang
their words off the prop as a separate child mesh. The felt version is the same rule from
the other side: catching on a rivet, a handle or a leaf reads as the world being made of
invisible boxes.

Today there are two ways to say it, and a third is planned:

- `MeshBuilder.solid = false` for a prop that is soft the whole way through — the grasses,
  flowers, moss and poultry already take this.
- A child mesh flagged `userData.noCollide` for decoration inside an otherwise solid prop.
  `signboard`, `banner`, `lettering` and `glow` all do this; it costs one extra draw call
  and prunes the whole subtree.
- Per-*part* collision, so a builder can mark a part decorative without splitting it into
  its own mesh, and can give a part a simpler stand-in where the render geometry is
  subdivided for shading rather than for form. Not built — see `COLLISION-FIX.md`.

The default is solid, and stays solid, so a builder that says nothing behaves as it always
has. Saying nothing is still a decision worth making on purpose.

**Lessons worth not relearning.** Three of these cost real time:

- **A box cannot lie on a curved surface.** Anything worn flat against a body — a sash, a
  shoulder strap — is a box passing through a torso with its corners protruding. Both were
  rebuilt and then cut. Fittings that work have volume and sit *beside* the body, where
  overlapping is invisible rather than wrong.
- **Seeds must be avalanched before use.** Mulberry32 advances by a fixed constant, so
  seeds a fixed distance apart stay a fixed distance apart and their nth draws correlate.
  The gallery drew from `1000 + i * 7919` and a 62% feature appeared on two of eight, twice
  running — indistinguishable from a broken feature. `createRng` now mixes the seed once.
- **Rare features are invisible at eight samples.** Eight is all anyone sees at once, and
  at p = 0.5 eight draws come up with one or none about four times in a hundred. Anything
  meant to be noticed has to be commoner than "rare".

*Done when adding a mesh type is one file and it appears in the gallery automatically.*

### Phase 5 — Zones and portals ✅ built

Zone abstraction over exterior and interiors, authored heightfield terrain, boundary
geometry, ground cover, and fade + reverb-crossfade transitions.

**Trigger volumes and proximity prop loading are deferred.** Triggers are a second portal
kind — walk through an opening rather than pressing a key — and are cheap now that
`PortalGraph` and `ZoneManager.use` exist. Prop streaming moves to Phase 9: it is an
optimisation with no problem left to solve, because the collider cache below removed the
cost it would have addressed.

**Zones.** Exactly one zone is in the scene and in the collider at a time. Crossing is: fade
out, swap the group, rebuild the collider, push the zone's air and acoustics into the render
pipeline and the audio engine, drop the player on the arrival marker, fade in — all inside a
single frame at full black. Zones build lazily on first entry and are kept, so re-entry is
free.

- `world/Zone.ts` — `ZoneDefinition` is data: name, environment, spawn, and a build function.
  `ZoneEnvironment` is sky on/off, fog, light levels, room acoustics, floor material.
- `world/ZoneManager.ts` — owns the active zone, the collider rebuild, and the two lights.
- `world/interior.ts` — parametric sealed shell: floor, four walls, ceiling, beams, skirting.
- `debug/zones.ts` — the fixture: one exterior, two interiors, two portals.

**Environment is layered over the tuned look, never merged into it.** `RenderSettings` is the
look and is saved as a preset; `ZoneAir` is the place and changes at every threshold. A zone
writing into the settings would silently overwrite what the player had dialled in, and save it.

**Lights are global, not zone-owned.** One sun and one hemisphere light, driven from the
active zone's environment. Lights parented into a zone get removed with it, and the frame
between one zone's lights leaving and the next's arriving is black that no fade is covering.

**Portals.** One link, two ends; each end is a door and a place to stand in front of it. The
arrival marker is *derived* from its own door — a step out along the facing, turned to look
away — so authoring is two placements rather than four and the marker cannot drift out of
alignment with its door. `arrival` overrides it where the derived spot lands awkwardly.

**Doors do not open.** No swing, no animation, no hinge axis. Using one is `E`, a fade, and a
teleport. The *sound* carries the gesture instead.

- Interact is **`E`**, not left click — left click already acquires pointer lock, so a
  click-to-interact scheme has to disambiguate the first click after every alt-tab.
- There is no cursor to hover with. The crosshair is the cursor, so the tooltip sits above it.
- Tooltip and use share one reach (3.2 m), which makes the tooltip *be* the affordance: if you
  can read it, you can use it.
- Two rays per probe: a mesh raycast for object identity, then the collider, so a door cannot
  be used through the wall it is set into.

#### The door sound

Researched rather than guessed, because with no animation it is the only thing carrying the
gesture. Three engines, after the same decomposition that recorded libraries and automotive
acoustics both use: **hardware** (latch, bolt, strike plate), **panel** (the leaf's formants
and its early reflections), and **hinge** (friction).

- **A creak is stick-slip, not noise.** The joint grips, elastic force builds, it releases with
  a snap, it grips again. Each release is a discrete impulse and the sound is a train of them.
- **So the train is quasi-*periodic*, not Poisson** — a creak has a pitch, and that pitch is
  the slip rate. This is the exact opposite of the PhISEM grit in `footsteps.ts`, where
  independent stone collisions genuinely are Poisson. Even intervals there give a buzz instead
  of a crunch; random intervals here give a rattle instead of a creak. Easiest mistake in the
  model, and the check asserts a coefficient of variation below 0.7 to pin it.
- **Slip rate follows swing velocity**, which is why a door groans low, rises, and falls away.
  Below a stiction threshold nothing happens at all, and that silence is what makes the first
  creak land.
- **Force accumulated while stuck is velocity × time**, square-rooted to compress the range.
  Note what this does *not* say: rate is itself proportional to velocity, so the product comes
  out roughly constant along the swing — correct physics, since a limit cycle releases about
  the same energy each cycle regardless of drive. A door speeding up gets *higher*, not louder.
  The loudness variation is local, and the check detrends both series before correlating.
- **Panel network**: eight parallel pure delays across the leaf, averaged and high-passed —
  Farnell's approximation to a rectangular panel's early reflections, and most of the
  difference between "resonant" and "wooden". Timber formants and delay times are his measured
  wooden-door values.
- Three voices: `timber`, `iron`, `plank`. Material drives look and sound from one field.

**The whole gesture is scheduled at fire time**, not driven per frame. That is correctness, not
performance: a door sound outlives the zone that made it. The creak carries across the cut,
which is most of what makes a transition feel like a door rather than a screen wipe.

Sources: [Farnell, *Designing Sound*, Practical 9](http://aspress.co.uk/sd/practical09.html)
and its [SuperCollider port](https://en.wikibooks.org/wiki/Designing_Sound_in_SuperCollider/Print_version);
[DAFx-17 friction synthesis](https://www.dafx17.eca.ed.ac.uk/papers/DAFx17_paper_58.pdf);
[door slam anatomy](https://sfxengine.com/blog/door-slam-sound-effect).

#### Terrain

`world/terrain.ts`. A heightfield summed from **placed landforms** — `hill`, `ridge`, `basin`,
`rim`, `terrace` — rather than from noise or from a grid of control numbers. Every bump is a
shape somebody put there, listed as data, legible as text, and the same list a Phase 11 editor
would drag around. 256 raw decimals are unreviewable; nobody can look at them and see a valley.

- **The boundary is terrain.** `rim` lifts the outer ring past the controller's slope limit,
  so the edge of the world turns you back. No invisible walls, no special collision.
- **`terrace` is the one landform that is not additive** — it *replaces* height inside a
  radius and eases back over a blend. Buildings are rigid and ground is not; a hut on a
  one-in-twenty slope buries one corner and floats the other, and no placement fixes that
  because the problem is the ground.
- **Variable density.** `detail` regions subdivide the base grid where it matters. Stitching
  closes the T-junctions: a vertex on an edge shared with a coarser neighbour takes its
  height from *that edge as the neighbour draws it*, so both sides describe the same line.

#### Ground cover

`world/ground.ts`. **A ground material is a colour and a footstep sound in one table** — a
cobbled path you can see but that sounds like grass is worse than no path, and one table
means the two cannot drift apart. Painted with placed shapes (`path`, `blot`, `field`),
layered so later wins. Edges are hard, not blended: a gradient between two materials survives
the pixelation and quantization as a band of dither and reads as a mistake.

#### Countryside Exterior Demo

`debug/countryside.ts`, with its interiors in `debug/countryside-homes.ts`. The first zone
that is a place rather than a fixture: a 96 m bowl with a settlement on a level shelf,
streets between the houses, fields and a paddock, and clear ground left deliberately open
for the Phase 7 actors. Was *Arkstin Village*, and is now the exterior half of the
countryside kit standing at real densities — every outdoor builder in the palette, placed by
the ground it belongs in, with three of the houses open. A gallery answers "does this row of
props hang together"; this answers "does the kit make a place", which is a different question
and the only one that catches a palette with a hole in it.

**It is also the zone that costs something.** 364k triangles across 420 props, against 130k
before — deliberate, because `main.ts` prebuilds it at boot and the checks measure it, so it
is the one place where the price of the art kit is visible. The expensive builders are named
where they are placed.

#### Lessons worth not relearning

- **Never dispose materials per zone.** The art kit shares one `ART_MATERIAL`; freeing it
  breaks other zones and surfaces as black geometry somewhere else entirely.
- **Abutting boxes fail watertightness.** Exact shared corners weld into edges on four
  triangles. Overlap by a few percent.
- **A ring handle does not survive the render pass.** Concave detail at this scale reads as
  damage once chunked. Convex shapes stay legible.
- **Feet exactly on the ground is an intersection.** The capsule's lower sphere is tangent to
  the surface, and on any slope the uphill side of the contact is higher than the contact
  point. Settled placements get 12 cm of clearance.
- **Detail boundaries belong on gentle ground.** Stitching closes the geometric seam, but
  nothing hides a change of *facet size* on a slope: two different normals meeting along a
  line is a line you can see, and it looks exactly like a crack.
- **Widening a check catches more than deepening one.** Extending "buildings stand on level
  ground" from huts to everything rigid immediately found a gateway arch with 127 cm of fall
  across its piers. Twice this phase, pointing an existing check at more objects beat making
  it cleverer.

*Done when zones can be crossed repeatedly with no leaks.* `npm run check:world` asserts:
every portal has two live ends; arrivals are clear of geometry, standing on floor, within
reach of their own door, facing away from it, and walkable-off; round trips return within
0.01 m; interiors contain 600 rays fired out of their centre; 60 crossings change neither
triangle count nor child count; the rim cannot be walked over at any of 240 spokes; the
valley is walkable; every prop stands on the ground; buildings stand level; detail boundaries
sit on gentle ground; and variable density leaves no cracks.

### Phase 6 — Procedural audio: the sound of places ✅ built

The Phase 3 engine was good and nearly unused. Every model it built was wired into one
debug object hardcoded to the Proving Ground's anchors, and Arkstin Village — the first
zone in this game that is a *place* — was silent apart from footsteps and doors. This
phase makes a zone declare its own soundscape as data, and widens the library enough to
dress forest, village, castle, industrial and cave settings.

Four tiers. Tier 0 (noise, weather, materials) existed. Tier 1 is `src/audio/dsp/` —
shared primitives extracted from models that already proved them. Tier 2 is the model
library. Tier 3 is `src/audio/faust/` — precompiled `.wasm` worklets, **and nothing in it
is load-bearing**: every Faust model has a native fallback or is optional dressing, so a
wasm load failure degrades the soundscape rather than breaking the game.

**Built:**

- `dsp/` — `clock` (lookahead scheduling), `envelopes`, `modal`, `impact`, `phisem`,
  `grain`, `formant`, `bubble`.
- `Soundscape.ts` — a zone declares `bed` / `emitters` / `scatter` as data, built on entry
  and silenced (never torn down) on exit.
- `Scatter.ts` — one-shots at random points in a region at Poisson intervals. The missing
  primitive: continuous sources establish that a place exists, scattered ones establish
  that somebody lives in it.
- Emitter rework — panner LOD (`hrtf` / `panned` / `virtual`), voice cap, and the three
  magical flags (`ignoreAbsorption`, `ignoreOcclusion`, `invertDistance`).
- Faust spine — hand-rolled loader and worklet, `reverb.dsp` replacing the two-convolver
  crossfade with a live-parameter FDN. `check:faust` asserts no shared-memory imports, so
  GitHub Pages' inability to set COOP/COEP is a checked fact rather than a hope.
- Models: wind, foliage, machine, bird, footsteps, door (Phase 3) plus **fire, rain,
  water, crowd**. One-shots: **hammer, clatter, animal, drip, bell**.
- `audition/measure.ts` — peak, RMS, DC, crest, centroid, band balance, loudness,
  periodicity. Self-tested in `check:audio` against signals with known answers.
- **`friction.dsp`** and `models/friction.ts` — the second Faust module and the genuine
  case for the tier. Sited on the objects that make the noise: the gantry in the factory
  hall, the gate in Arkstin, a limb of the Proving Ground's tree. See the audio section
  for what the model does and why nodes cannot.
- **`debug/SoundStage.ts`** — one of everything, on pedestals, identically configured.
- **`debug/Audition.ts`**, `audition/render.ts` and `audio/baselines.json` — the whole
  library rendered offline and measured against absolute rules, plus recorded baselines
  once a run has been captured.
- **`debug/Meter.ts`** — spectrum and level on the master bus, and `Soundscape.setSolo`
  and `AudioEngine.tuneRoom` behind the panel that drives them.

> **The friction model had to be given a rhythm before its parameters mattered.** The
> first pass ran at a constant speed during each working burst, which puts the contact at
> one fixed point on the friction curve — so the loop settled into one timbre and held it,
> and a rough timbre held for four seconds is a buzz. It read, accurately, as television
> static, and no amount of retuning `pitch` or `roughness` would have fixed it.
>
> Nothing hauls a chain at a constant speed. It is pulled in strokes, and each stroke
> sweeps the speed from nothing up and back down — through the sticking region, through
> the Stribeck dip, out into the rub and back. **That sweep is the creak.** Adding it took
> the crest factor from 6.5 dB to 13, which is the difference between a drone and a
> rhythm, and it is a property of the gesture rather than of the synthesis.
>
> A second lesson from the same pass, and a more portable one: `bright` and `roughness`
> above about half put the energy into the upper modes and the contact noise between them,
> and the octave-band measurement came out *flat*. A friction source with no peak anywhere
> is hiss whatever its parameters claim. That was visible in a number and would have taken
> an afternoon to find by ear — which is the argument for the audition harness in one line.

> **Two of the model's own faults were structural, and the numbers found both.**
>
> **The upper modes were winning against their own levels.** A constant-Q resonator's
> bandwidth is proportional to its centre frequency, so a mode at 4.17× collects four times
> as much of a broadband force as the fundamental — the levels said the first mode was
> twenty times the fourth and what came out was a thousand-hertz whistle with nothing under
> it. Levels cannot fix that; a one-pole tilt inside the loop can, and `bright` now opens
> the tilt rather than raising a level the bandwidth was going to undo.
>
> **And there is a corner at very low speed where it sings.** Down there the contact spends
> nearly all its time in the steep regularised region around zero and what survives is a
> thin high partial: four fifths of the energy above 5 kHz, crest factor 3 dB, which is a
> sine. Every source crosses that range on its way into and out of a gust or a stroke, so
> every one of them whistled at both ends. The fix is not a parameter — it is that a
> contact creeping that slowly is *stuck*, and a stuck contact does not sing, so the output
> is gated below it.

> **The bell is not a Faust model, and that was a real decision.** The plan reserved
> `pm.lib`'s physical bell for it. But `dsp/modal.ts`'s own argument rules modal synthesis
> out of bells — a resonator sharp enough to ring for fifteen seconds has no bandwidth left
> to carry timbre — and a bell's partials genuinely *are* near-pure sines, so the thing
> modal loses is the thing a bell does not have. Additive is the honest implementation,
> and it is cheaper, exactly controllable, and numerically safe where a biquad at Q ≈ 600
> is not. Faust is worth spending on what nodes genuinely cannot do, not on what they can.

### Phase 6b — Galleries, and objects for the sounds ✅ built

Sat before the Faust friction work that closed Phase 6.

**Every sound gets a builder.** A forge fire at `[13, 1.2, 7]` with nothing standing there
is not something you can walk up to and judge — it reads as a bug rather than as a thing.
Needed now: anvil, bell, dog, sink. **Placement runs object → sound, never the reverse**:
the coordinates already in the zone files were picked to get a model audible in the absence
of anything to look at, and they constrain nothing.

The Proving Ground has meanwhile accumulated an object gallery it was never meant to hold —
it was built as a movement and acoustics rig. So the objects move out to galleries of their
own, split by kind with setting used only where it matters: **Animal, Foliage, Prop,
Village Structures, Factory Structures**. Castle and Cave when those kits exist; an empty
gallery is worse than none. A rank of portals stands in the Proving Ground, directly behind
spawn.

> **Galleries are silent.** They were built with emitters sited on their own rows, on the
> theory that a sound is judged next to the thing making it. That holds in the *world* and
> not in here: eight copies of a builder in a line is not a place, so a sound coming out of
> one of them has nothing to be judged against — it is just noise over the thing you came to
> look at. The objects these rooms exist to provide get their emitters where they are
> actually placed.

> **The "infinite floor" is a quad and some fog.** The instinct is a ground mesh that
> recentres on the player; do not build it. The collider indexes each zone into an octree
> once and caches it by key, so ground that moves reinvalidates that index every frame. The
> Proving Ground's floor is expensive because it is a *painted terrain patch*, not because
> it is large — one flat 400 m quad is two triangles, and `fogFar: 140` hides the edge two
> and a half times over. The only worthwhile addition is a world-space grid in vertex
> colour: in a featureless void there is no way to judge how big a thing is or how far you
> have walked, which is the entire job of a gallery.

#### The galleries

Four, not five. **Prop and Village Structures were the same room** and pretending otherwise
meant deciding, per object, whether a trough is a prop or a fixture — a question with no
answer that anyone would ask twice. What a village gallery is *for* is judging whether a
settlement's kit hangs together, and a barrel belongs in that judgement.

| Gallery | Contents |
|---|---|
| **Animal** | bovine, ovine, equine, porcine, poultry, **dog** |
| **Foliage** | the wood, the ground cover and the flowers, tallest first, plus rock and cairn |
| **Village** | figure, hut, archway, door, fence, **fence-post**, **stone-wall** and **stone-wall-low**, **stone-wall-column** and **stone-wall-column-low**, post, streetlamp, trough, cistern, **anvil**, **bell**, and the furniture |
| **Factory** | machine, **forge**, tank, hopper, pipes, hoist, vent, workbench, panel, **sink**, stair, ladder, railing, chainlink, floodlight |

Figure moved from Animal to Village: it is a person-shaped object standing in a settlement,
and the question it answers is about the village's scale rather than about livestock.

One file each, next to `debug/village.ts`, sharing a layout helper — the grid-with-labels
logic is identical between them and exists once. The sound stage reuses its sign posts.

#### The floor

New helper in the world kit, roughly `flatGround(size, options)`:

- One `PlaneGeometry`, segmented 8 × 8 rather than 1 × 1 so vertex lighting across 400 m is
  not degenerate, and excluded from shadow casting.
- `markCollidable`, so it enters the octree as a handful of triangles.
- A world-space grid in vertex colour at 4 m spacing — the ruler, per the note above.
- Zone wiring: `groundAt: () => 0`, `floor: -20`, flat `environment.surface`.

Deliberately **not** doing: painted ground cover, height variation, or the terrain system in
any form. A gallery is a dev room and should look like one.

#### The builders

- **anvil** — the hammer scatter field in Arkstin has nothing standing under it.
- **bell** — currently ringing from six and a half metres up, out of thin air.
- **dog** — the only creature in the animal call table with no body.
- **sink / cistern** — a stone basin for the standing water in the Proving Ground's cell.

A forge was the obvious fifth, for the fire in Arkstin, and it waited — a hearth is a
structure rather than a prop, and rushing it in before the structure kit would have given
Arkstin a brazier with a fire emitter tuned for a forge sitting on it. It landed with the
factory kit and Arkstin has one now, with the anvil beside it.

#### Work order

1. `flatGround` and one gallery end to end, to prove the shape.
2. The four builders.
3. The remaining four galleries, moving objects out of the Proving Ground as they land.
4. Portals in the Proving Ground, standing where the vacated gallery was.
5. Site the new builders in Arkstin and the Proving Ground, moving the emitters to them.

All five steps are done. Arkstin's forge, anvil, bell and dog now stand at named anchors
that the emitters are derived from, so neither can move without the other; the Proving
Ground's sink and cistern were sited the same way; and the factory hall got a gantry before
it got a creak.

Two of those moved the *sound* rather than the object, which is the rule working. The bell
was ringing from six and a half metres up, over a rooftop, from a tower that does not
exist — the kit's bell brings its own two-post frame, so it now rings from head height by
the lane. And the dog roamed the whole settlement on eleven metres of wander, which is a
good argument with nothing standing under it; it has a yard now.

*Done when every emitter in the game has something visible at its position.*

> **Watch the triangle count.** A gallery's collider index should come out *lower* than the
> Proving Ground's, not higher. If a flat floor costs more than a terrain, the follower-mesh
> mistake has been made by accident.

### Phase 6c — Procedural music

The music system as specified above. Decided before the build, after the research pass:
constrained note generation with seeded motifs rather than authored cells (nothing in this
project ships composed data, and seeds give zones recurring identity for free); native Web
Audio instruments rather than new Faust modules (sample-accurate onsets, no toolchain step,
and the waveguide already covers the one case native cannot do); the full three-strata
director in one phase rather than piecewise, proven on a showcase zone.

#### Work order

1. **The instrument rack** — `audio/music/instruments/`: a voice contract
   (`noteOn(at, freq, velocity)` over the standard model contract) with the humanization
   baked in, then the families: strings/pads, brass, flute, choir, bells, plucks, bass,
   kick/snare/hat, electric guitar. Each gets audition subjects and baseline rows; the
   existing meter and solo tooling come along free.
2. **Theory and patterns** — `audio/music/theory.ts` and `patterns.ts`: note math, mode
   tables, scale lock, seeded cell generators. Pure arithmetic, asserted in `check:audio`.
3. **The director** — the strata, the scarcity state machine, zone transitions,
   `ZoneEnvironment.music`, the options slider. Existing zones stay silent.
4. **The music stage** — a showcase zone on the sound-stage pattern: a door beside the
   other showcases, stations to solo each instrument (walking to a plinth is the solo —
   a station's reach ends before its neighbour begins), and a panel of sample vibes to
   switch between, with a night toggle to prove same-seeds-different-timbre. The original
   pastoral and industrial samples served here and retired when Phase 6e's book replaced
   them. Name and fiction to be settled with the repo owner; the id is a placeholder
   until then.

*Done when you can stand on the music stage and solo every instrument, play vibes that
flow without a seam or a metronome in them, and walk between two scored zones hearing
the drone change key rather than the track change.*

#### Second pass — musicality and voicing

The first pass proved the machinery and exposed what it lacks: a piece holds one chord for
its whole length, every stratum is nailed to one register, the dynamics sit in one band,
and the melody states a cell and stops. Listening found the gap the checks cannot.

5. **Modal chord motion** — the harmonic rhythm made real. Every 2–8 bars the harmonic
   centre steps to another degree of the mode, weighted toward the classic modal moves and
   never a dominant, with the texture and melody re-rolled over the new centre while the
   drone pedals on. The first pass only re-rolled the ostinato over a fixed root, which is
   one chord per piece — harmonic rhythm in name only.
6. **Melody phrasing** — a statement cell and an answer, the answer transposed to land on
   the root or the fifth; a velocity arc across the phrase; the register free to drop an
   octave between phrases. Still seeded, still the zone's motifs — the change is shape,
   not material.
7. **A dynamics arc over the piece** — soft in, fullest in the middle, soft out, scaling
   every stratum's velocities together. Velocity is brightness in every voice, so this
   moves the tone and not merely the level.
8. **The voicing pass** — the rank report came in and the research answered it at a size
   one step could not hold. It stands as Phase 6d.

*Done when a piece moves — chord to chord, phrase to phrase, soft to full and back. The
rank's own listening test moved to Phase 6d with the step that answers it.*

### Phase 6d — The voicing pass

Step 8 of the music phase, grown into a phase of its own once the rank report and the
research landed. The report: the winds sound fine but stop harshly — the notes want to
glide in and out, not gate off; the plucks are harsh and the flute can be shrill; and all
of it is background music with no business distracting. The research went family by
family through the classic patch literature — the Synth Secrets series, the
Karplus-Strong papers, the measured Roland service data — and every change below is that
reference disagreeing with a first instinct, not a new instinct.

Two findings frame the whole pass. First, the harsh stops are an architecture problem,
not an envelope problem: a wind phrase is one breath, and building it from independent
per-note oscillators re-tongues every join and gates the last note off. Second, most of
the harshness elsewhere is velocity curves living in the loud half of a real player's
range — the fix is almost never *quieter*, it is *darker sooner*.

#### Work order

1. **The mono wind core** — flute and brass each become a small pool (two or three) of
   persistent monophonic players: one oscillator–filter–gain chain each, alive for the
   whole piece. A note arriving while a player still sounds nearby in pitch *glides* to
   it (~20 ms, with a small breath dip) instead of restarting; the envelope attacks from
   zero only at phrase starts and releases only at phrase ends, where it tapers — a
   decrescendo to about half level over the last half second, then a slow release with
   the filter darkening alongside the gain. The director already schedules phrase notes
   overlapping, so legato is read from timing alone and the voice contract does not
   change. Allocation is by nearest pitch, so a drone's root and fifth land on separate
   players. This is Minimoog single-trigger behaviour, and it is what the measured
   flute-transition literature says a slur is.
2. **Flute** — the saw source is the shrillness: a real flute is nearly all fundamental.
   Rebuilt on a ~40% pulse, ceiling near 2 kHz, partial keytracking (~65%), vibrato kept
   on brightness rather than pitch — the one part that was already right.
3. **Brass** — the overshoot-then-settle filter is canonical and stays; its numbers were
   a lead's, not a horn's. Filter attack 150–350 ms and settle τ 300–500 ms (was 90 ms);
   an absolute cutoff ceiling near 1.8 kHz (it could reach twelve times the fundamental);
   two saws detuned ±6 cents with a quiet sine under them for the section; the periodic
   vibrato replaced by ±3–6 cents of slow random drift — orchestral horn is straight-tone,
   and a steady LFO is the classic "sounds electronic" tell.
4. **Pluck** — the excitation is the harshness: `900 + velocity × 5200 Hz` is a
   fortissimo harp, and the literature calls this filter the *dynamic level* control.
   Becomes roughly `800 + velocity × 1800` capped near 2.6 kHz; the noise burst
   envelope-shaped rather than rectangular (the square edge is the slap); brightness
   keytracked *down* as pitch rises so high notes never go glassy; pick position at a
   soft mid-string ~0.4; and a simple body — a gentle lowpass near 4 kHz over a low
   warmth peak.
5. **Guitar** — a bright string into saturation is the ice-pick recipe: the string
   darkened (bright 0.75 → ~0.55) with a pre-shaper lowpass, drive scaled by velocity so
   quiet notes run the amp nearly clean, and a second-order cabinet — first-order at
   3.4 kHz is too shallow to kill the fizz the shaper makes.
6. **Strings** — closest to reference already; the recipe *is* the string machine. A
   third chorus line at 120° (two lines cannot hide their moments of common motion), base
   delays shortened to 8–12 ms, the mix turned wet-dominant — the dry saw is the buzz —
   the ceiling down to ~6.5 kHz over a gentle highpass near 200 Hz, and the fast shimmer
   halved: ±19 cents reads seasick.
7. **Choir** — the vowel drift was the research's biggest flag: a moving mouth is a
   foreground effect, and the canonical machine fixes its vowels per registration. Frozen
   on one dark vowel with only slight slow drift, never passing through the nasal e/i
   region; a lowpass ~3.5 kHz above the formants; vibrato onset delayed; the attack a
   touch longer.
8. **Bells** — the partial table is a church bell; the music wants a chime. Tierce and
   uppers attenuated, the clapper duller (~5× the prime, capped 6 kHz) and scaled with
   velocity² so soft strokes have almost no strike, a global lowpass near 5 kHz. The
   decay structure stays — the hum already outlives everything, which the reference
   confirms is right.
9. **Bass** — a quiet sine under the saw for fundamental weight, and a small ~300 ms
   filter-envelope pluck on the non-drone role only; the drone keeps its static filter.
10. **Drums** — the kick sweep lands *below* its tuning (2.2f → 0.75f over 280 ms) and
    becomes ~1.8f → 1.0f over ~60 ms: a heartbeat, not a boom. The snare's noise moves
    darker and longer (~1.2 kHz, ~100 ms), the hat gets a 20 ms floor and a fizz-killing
    lowpass, and every transient layer — beater, wires, clapper — scales with velocity²,
    so soft hits go round instead of clicky.
11. **Re-audition and re-capture** — the rank walked again, the eleven `music-*`
    baselines re-captured, `check:audio` green.

*Done when the winds glide in and out instead of stopping, and every station on the rank
survives being listened to alone — as background: nothing on it earns a glance from a
player doing something else.*

### Phase 6e — The vibe book

The stage's three vibes proved the machinery; the game needs a book of them — one
composition per kind of place, so a zone declares what it is and sounds like it. Music
only: a place's *noise* — birds, water, wind, drips — is the soundscape system's job
(Phase 6) and nothing in this phase touches it. Where a line below reaches for an image
like drips or light on water, it describes what the notes evoke, not a sound effect. The
archetypes wanted: village, village interior, farm, two contrasting forests, two
contrasting forest paths, riverside, cave. Researched against how exploration-game and
ambient composers actually score these places (the Zelda mode analyses, Stardew's
documented palette, Skyrim's town-versus-wild split, the BOTW near-silence practice,
dungeon-synth convention for the underground; the pastoral drone topic runs from
Beethoven's bare fifth straight to this project's root+fifth grammar).

Three findings carry the book:

- **Settlements pulse, wilderness floats.** Towns get a steady gentle pulse and the
  fullest arrangements; open country runs rubato fragments over long silence. Pulse and
  drums are the single strongest "people live here" lever.
- **Mode is the character.** The associations named again and again in the analyses:
  lydian is the enchanted forest (Saria's Song), dorian is water (Serenade of Water) and
  the habitable dark, mixolydian is relaxed folk (Stardew), phrygian is the underground,
  pentatonics are the safe naive tunes. Plain ionian is rarer than assumed.
- **An interior is a reduction, not a piece.** Indoors keeps the settlement's root, mode
  and *seed* — the same motifs — with the arrangement thinned: fewer layers, no drums,
  the pad swapped for a quiet bass. The player hears "indoors", not "elsewhere".

#### The table

The tunable heart of the phase. Roots chosen so neighbouring archetypes differ; seeds
distinct except the interior, which shares the village's on purpose.

| Vibe | Root | Mode | Drone | Texture | Melody | Pulse | Density | Drums | Seed |
|---|---|---|---|---|---|---|---|---|---|
| village | C3 130.81 | mixolydian | strings | pluck | flute | 65 | 0.85 | yes | 48 |
| village interior | C3 130.81 | mixolydian | bass | pluck | flute | 55 | 0.4 | no | 48 |
| farm | F3 174.61 | ionian | strings | guitar | flute | 70 | 0.8 | yes | 49 |
| forest a | A3 220.00 | lydian | strings | pluck | flute | 58 | 0.6 | no | 50 |
| forest b | E2 82.41 | dorian | choir | strings | bells | — | 0.35 | no | 51 |
| forest path a | G3 196.00 | pentatonic-major | bass | guitar | pluck | 68 | 0.55 | yes | 52 |
| forest path b | E3 164.81 | pentatonic-minor | flute | strings | pluck | — | 0.25 | no | 53 |
| riverside | D3 146.83 | dorian | strings | pluck | bells | 56 | 0.5 | no | 54 |
| cave | A2 110.00 | phrygian | choir | bass | bells | — | 0.2 | no | 55 |

*The drone/texture/melody columns above are the book as first written; Phase 6f
re-spread them across its wider instrument list — its table is the current one. Roots,
modes, pulses, densities and seeds are unchanged and this table remains their home.*

The characters, briefly: the village is the fullest, warmest thing in the game; its
interior is the same tunes played small. The farm is the working tempo — top of the
grammar's range — with the guitar as the porch instrument. Forest a is sun through
leaves: lydian lilt, high and bright. Forest b is the forest that watches back:
pulse-free, a low choir, bells glimpsed between the trees, and a hollow middle register
that is what makes it feel vast. Path a is the walking-song — pentatonic pluck tune over
a footstep pulse, nothing on it able to sound wrong; path b is the path where you lower
your voice, sharing forest b's key family, mostly silence. The riverside is D dorian —
the documented water mode — with the pluck rippling and bells as light on the surface.
The cave is the register split taken to its end: low choir, low bass, rare high pings as
drips, the emptiest density in the book. Brass sits the book out deliberately — it is
the alternate drone for the cave or forest b if either wants more distance later.

The contrast pairs run on one axis, motion versus stillness: forest a lilts while forest
b holds still; path a walks while path b holds its breath. The pairs read as kin because
each path shares register or key with its forest.

#### Work order

1. **Density becomes a dice roll.** The director derives layers from density
   deterministically, so anything under 0.75 *never* states its melody — but the sparse
   places above are built on rare fragments, not absent ones. Layer count becomes a
   per-piece roll weighted by density (intensity is still layer count, decided once per
   piece; the grammar holds). The one director change in the phase.
2. **The vibe book** — a module exporting the nine specs above as constants. The
   stage's original three retire in its favour: the stage zone declares the village,
   the annex the cave (the book's farthest pair, so the border test is the hardest
   one), and night becomes the toggle it always was. The archetype labels are working
   names; real zones adopt a vibe by declaring it, and any renaming that fiction wants
   is the repo owner's.
3. **The stage panel** learns all nine, so the book can be walked in one sitting with
   play-the-vibe.
4. **The audition pass** — the repo owner listens; the table above is what gets tuned,
   not the code.

*Done when all nine can be told apart blind from the stage panel, the pairs contrast on
the axis they were built on, and the interior reads as the village heard from indoors.*

### Phase 6f — The wider band

The book proved the vibes contrast; the instruments inside them do not, yet. Eight
melodic voices across nine vibes means the same waveguide pluck carries six of them, and
a border crossing changes the key while the band stays. This phase doubles-and-a-half
the voice list — thirteen new names — built on two research passes: which instruments
*genuinely* synthesize well with oscillators, biquads and one Karplus-Strong waveguide,
and which levers turn one existing engine into several instruments.

The honesty findings that shaped the list (per the synthesis literature — Synth Secrets,
the CCRMA percussion and physical-modeling notes, the measured-partial studies):

- **Struck metal is the best deal in synthesis.** A music box tooth, a kalimba tine, a
  tongue-drum tongue, a glockenspiel bar are all a handful of exponentially-decaying
  sines over a click — the same machine as our bell, with a different partial table.
  These sound *convincing*, not merely acceptable; the tongue drum (partials tuned 1:2:3
  by construction) is the single best new-timbre-per-effort on the list.
- **One waveguide is many strings.** Pluck position (mid-string is a hollow harp,
  near-bridge is a thin dulcimer), excitation hardness, decay and paired courses are
  what actually distinguish the plucked family — the samey-pluck problem is unexposed
  parameters, not a missing engine.
- **Trumpet is honest-but-synthy; sections and darkness forgive.** A solo trumpet will
  never be mistaken for real; a faster bloom, a brighter ceiling and an 80 Hz rasp on
  hard attacks get it to "good". Tuba and horn are nearly free and fully convincing.
- **Free reeds and pipes are additive synths already.** An accordion is detuned saw
  pairs beating in constant cents; an organ is a drawbar recipe on one periodic wave.
  Both are sustained voices, which the drone role is short of.

#### The instrument table

The tunable heart of the phase. Working labels throughout — naming stays with the repo
owner. "Engine" names the implementation the voice is a preset of.

| Voice | Engine | The recipe, in brief | Sits best |
|---|---|---|---|
| music box | struck (new) | sine + one ~6.5× overtone (jittered per tooth), 4 kHz pin click, sounds an octave up | melody, high |
| kalimba | struck | 1 : ~5.7 : 14, overtones dead in 200 ms, thumb click, 200 Hz box | texture/melody |
| tongue drum | struck | 1 : 2 : 3 all strong, each partial a beating pair, soft thump, long ring | texture |
| marimba | struck | 1 : 3.92 : 9.24, short loud fundamental (the resonator), mallet thump | texture |
| chimes | struck | uniform bar 1 : 2.76 : 5.4, fast-dying overtones, sounds an octave up | texture/melody |
| trumpet | brass | bloom ~2× faster and ~2× brighter than the horn, 80 Hz rasp on hard attacks | melody |
| tuba | brass | sub-dominant, ceiling ~2× f0, slow speak, barely detuned | drone, low |
| ocarina | flute | near-sine wave, sung vibrato (pitch + tone together), low fixed ceiling | melody |
| accordion | reeds (new) | saw pair beating at constant cents (dry musette), 500 Hz body, onset sag | drone/texture |
| organ | reeds | drawbar wave (principal mix), chiff grace at 3×, straight tone | drone |
| harp | pluck | mid-string place (hollow), soft long excitation, slow decay | texture/melody |
| dulcimer | pluck | near-bridge place, hard strike, paired courses a few cents apart, hammer bounce | texture |
| monks | choir | the "oh" vowel of the bass row of the formant tables, lower veil | drone |

And the levers now exposed on the old engines, so the table above stays tunable:
pluck grows `place` (with a per-note jitter — the swept comb that stops machine-gun
repeats), excitation floor/span/cap and courses; brass grows `bright`, `speak`, `sub`,
`detune`, `rasp`; flute grows its wave and vibrato style; choir grows a vowel.

#### The book, re-spread

Same roots, modes, seeds, densities and pulses as 6e — this phase moves only the
palette columns, so each vibe keeps its key and gets its own band. No struck voice
carries two vibes except the guitar (farm and path a are kin on purpose) and the harp
(forest a and path b, same family). Trumpet enters at the farm; brass-the-horn and
tuba stay in reserve as alternate drones.

| Vibe | Drone | Texture | Melody |
|---|---|---|---|
| village | strings | dulcimer | flute |
| village interior | accordion | music box | flute |
| farm | accordion | guitar | trumpet |
| forest a | strings | harp | ocarina |
| forest b | choir | strings | chimes |
| forest path a | bass | guitar | kalimba |
| forest path b | flute | marimba | harp |
| riverside | strings | tongue drum | bells |
| cave | organ | bass | bells |

The characters of the changes: the village square gains the hammered dulcimer ring; its
interior swaps to a wheezing accordion under a music box — the same tunes, heard as
furniture. The farm gets the working band: accordion, porch guitar, a trumpet that
calls across the field. Forest a ripples on a harp under an ocarina, the naive whistle.
Forest b trades bells for colder chimes. Path a walks on a kalimba — the pentatonic
thumb tune. Path b goes woody and hollow: marimba under a harp. The riverside's pluck
becomes the tongue drum, water on metal. The cave goes full dungeon: organ under bass,
the bell pings staying as drips.

#### Work order

1. **The struck engine** — one modal file, the five presets above. Partial tables and
   decays from the measured studies; every overtone dies fast and the fundamental
   rings, which is the family signature.
2. **Brass becomes a family** — numeric levers on the one player, trumpet and tuba as
   preset factories beside the horn.
3. **The pluck opens up** — place, excitation and courses become options; harp and
   dulcimer presets; per-note place jitter for everyone including the old pluck.
4. **Ocarina** on the flute engine; **accordion and organ** on a new reeds engine over
   the mono core (they are wind instruments in the way that matters: legato joins).
5. **Monks** — the choir's second vowel.
6. **The book re-spread** per the table, rack identity preserved (specs stay the
   constants zones declare).
7. **The rank and the rows** — every new voice gets a stage plinth and an audition
   subject; baselines gain thirteen novel rows at the next capture.
8. **The audition pass** — the repo owner listens; both tables above are the tunables.

*Done when the nine vibes no longer share a band — blind at the stage panel, a border
crossing changes instruments, not just key — and each required instrument (music box,
kalimba, tongue drum, trumpet) reads as itself.*

### Phase 6g — The composed machine

The band is wide now; the writing is not. Three faults, all confirmed in the code, all
named by the owner's ear: the drone is one chord forever (root+fifth refired for the
whole piece — the centre shifts move only the upper strata, so nothing *felt* ever
changes); the texture is a metronome (one note per beat, no rhythm, no rests, until a
re-roll); the melody is a wanderer (a random walk with no rhythmic design, no relation
to any chord, ending wherever the walk ends). The bar for this phase is the owner's:
not music that exists and fits the checkbox — music players enjoy. Smart and full of
variety, not busy.

Two research passes stand under it. The theory pass (modal harmony practice, phrase
form, the performance-timing literature) and the corpus pass (Hooktheory transcriptions
of Volume Alpha, the C418 interviews, the cozy-game comparators) converge on the same
sentence: **structure comes from scheduling, not from note choice.** What reads as
"composed" is repetition with intent — a chord loop that returns, a phrase heard twice
with a different ending, one rhythmic cell owned for a section — and none of it needs
more notes than we play now.

The findings that shaped the options:

- **The floating drone is solved in folk practice by a rocking bass, not a progression.**
  The "double tonic" — two chords a whole step apart, i↔bVII — is the oldest ground in
  the islands' folk music, and the lament tetrachord and passamezzo grounds are 4-chord
  seeds. All dominant-free, so our grammar keeps its one law.
- **C418 writes major-mode loops of 2–5 third-less chords, one per bar, and never
  resolves V–I.** Sweden's loop omits the third of its tonic; Wet Hands is two add9
  chords rocking, Satie-style; Calm 1 is I–vi6 forever at 53 BPM. Our root+fifth
  no-third rule is *already his ambiguity trick* — what's missing is only that our
  chord never changes. One borrowed chord per loop (his single Mixolydian bVII in Wet
  Hands) is the entire emotional event; dissonance is rationed, not sprinkled.
- **A period is same head, different tail.** Antecedent and consequent open with the
  same idea; the antecedent ends open (degree 2 or 5), the consequent descends stepwise
  to 1 on a strong beat and holds. Our current answer transposes the *whole* cell,
  which misses the trick that makes an answer an answer.
- **Intentional rhythm is a repeated cell, not per-note dice.** Scotch snap, dotted
  long-short, short-short-long: folk rhythm is a bar-length figure owned for a section.
  Randomizing onsets independently is what a metronome with noise sounds like.
- **Tempo lives.** The corpus drifts 3–5% between sections of one track (transcribers
  assign different BPMs to sections); phrase ends lengthen; final ritards follow a
  measured curve (Friberg & Sundberg: v(x) = (1+(v_end^q−1)x)^(1/q), q≈2). And the
  per-piece tempo spread across the corpus (51–88 BPM) is itself variety our single
  fixed pulse never gives.
- **Sweden varies by adding voices, not changing notes.** Re-orchestration on
  restatement — the same material handed to another instrument — is the corpus's
  variation engine, and our rack machinery is already shaped for it.
- **Our scarcity numbers are validated.** Minecraft plays ~2–4 minutes in every 15–20,
  silence randomized at the composer's request. Piece/rest stays as built.

#### The options

Lettered for the cut line. Each names what it buys and what it costs. They interlock —
A is the floor the others stand on.

**A. The ground — harmony that moves.** Replace the eternal pedal with a seeded chord
loop: 2–5 chords, one per bar, drawn from a small ground library — double tonic
(i↔bVII), lament (i–bVII–bVI–bVII), the per-mode signature moves (mixolydian I–bVII,
dorian i–IV, lydian I–II, phrygian i–bII) — every chord rendered as our third-less
root+fifth, the drone voice walking the loop's bass with its long overlapping
envelopes. Texture and melody read the chord-of-the-bar and agree with it. One
borrowed-chord event allowed per piece, seeded, rare. No loop contains a dominant.
*Buys: kills "one note the entire time" at the root. Cost: new `harmony.ts`, drone
firing rewritten, texture/melody made chord-aware — the deepest single change.*

**B. The period — melody that intends.** The phrase becomes a true period: one motif
per piece; antecedent = head + open tail (ends degree 2 or 5); consequent = *same
head* + closing tail (stepwise descent to 1, strong beat, final note held 2–4× and
a breath between the halves). Later statements develop the motif by one operation —
sequence, inversion, fragment, augmentation at section end — instead of re-rolling.
Leap rules stay ("one leap then steps" survives); notes lean on the chord of the bar.
*Buys: kills the wanderer; a zone's motif becomes recognizable across a whole piece.
Cost: patterns.ts grows a period builder and the op set; firePhrase rewritten.*

**C. The cell — rhythm with intent.** A rhythm-cell library (even, dotted long-short,
scotch snap, short-short-long, 6/8 lilt); each section seeds ONE cell and owns it —
texture states it bar over bar, melody phrases share its family. The texture gains a
subdivision ladder (quarters under the melody, eighth-note broken-chord figures in the
melody's silences — call-and-response for free) and the minimalist mutation rule: every
4–8 repeats, exactly one element changes (a neighbor swap, a note added or dropped, an
accent moved). Cadence approach = harmonic rhythm doubles in the penultimate bar.
*Buys: kills the metronome; the texture becomes the thing worth listening to between
phrases. Cost: new `rhythm.ts`, fireTexture rewritten onto the grid.*

**D. The form — AABA and the arc.** The piece stops being one long window and becomes
scheduled sections — A A B A (or the compact A A B): B shifts the centre and re-rolls
the loop *with a guaranteed return*, so the existing centre machinery becomes a bridge
instead of a drift. Each section takes a tension target on a low → peak (~2/3 in) →
resolve arc, spent as register, subdivision level and layer count; growth is Sweden's
— one voice added per section, exits by subtraction (the machinery exists). Section
ends cadence (bVII–i or plagal, phrase-final lengthening); the last A ends the piece
properly. *Buys: pieces become journeys with a shape you could hum back; the single
biggest step from "exists" to "enjoy". Cost: a section scheduler replacing the flat
piece windows in the director — the largest code motion after A.*

**E. The clock — tempo that breathes.** The vibe's single pulse becomes a span; each
piece rolls its tempo from it (the 51–88 corpus spread, mapped per vibe). Sections
drift ±3–5%; phrases carry a light arch rubato; piece ends take the measured ritard
(gentle at section ends, v_end ≈ 0.5–0.7 at the final cadence). Downbeats accent,
offbeats soften. *Buys: kills "tempo never varies"; the sequencer feel dies with it.
Cost: cheap — a tempo state object the clocks and cells read.*

**F. The spread — the band into more hands.** Each vibe's palette gains alternates
(a second texture and melody voice); a piece picks per seed, and under D a
restatement may re-orchestrate (A on flute, A′ on music box). The thin-spread problem
dies here: music box, kalimba, tongue drum, marimba and chimes each land in two or
more vibes' pools. *Buys: the owner's missing instruments, heard; per-piece band
variety. Cost: cheap — palette schema + rackFor grows alternates.*

#### What the checks keep and lose

`check:audio`'s grammar promises evolve, not vanish: "the centre never moves onto a
dominant" generalizes to "no ground chord stands on the fifth or leading tone"; "one
leap then steps" survives inside phrase heads; new assertions come free with the new
maths (grounds stay in-mode and dominant-free, a period's two halves share their head,
a consequent lands on the root, rhythm cells sum to their bar, the ritard curve is
monotone and bounded, an ostinato mutation changes exactly one element). The bench and
the plinth rank stay as they are — they audition voices, not the score.

#### Work order (after the cut line)

1. **A** — `harmony.ts`, the ground library, the chord-aware drone.
2. **E** — the tempo state (small, and everything after reads it).
3. **C** — `rhythm.ts`, the cell library, the texture on the grid.
4. **B** — the period builder and motif ops in patterns.ts.
5. **D** — the section scheduler in the director.
6. **F** — palette alternates and the re-spread of the new band.
7. `check:audio` grows the new grammar assertions alongside each step.
8. **The audition pass** — the repo owner listens; the ground library, cell library
   and per-vibe tempo spans are the tunables.

*Done when a piece heard start to finish has a shape — a chord that moves and returns,
a motif stated, answered and developed, a rhythm it owns, a tempo that breathes and an
ending that lands — and two pieces from the same vibe are recognizably the same place
without being the same music.*

### Phase 6h — Nine places, one band

The composed machine passed its first listening with three complaints against it, all
the owner's ear and all traceable in the code:

- **The vibes sound alike.** Root, mode, tempo span and palette differ; everything
  *behavioural* is shared. Every vibe draws from the same five rhythm cells, builds the
  same period shapes at the same phrase lengths, changes chords at the same one-per-bar
  rate, plays texture at +12 and melody at +24 everywhere, and walks the same arc. One
  composer, nine transpositions.
- **The music box is everywhere.** It landed in five palette slots across four vibes,
  and the bridge *guaranteed* the unused texture alternate a turn — so any vibe carrying
  it played it in essentially every piece.
- **The parts don't play together.** Four independent clocks: the drone fired on bar
  boundaries, but the texture's figure started wherever its entry window opened and
  wandered against the bars under drift and ritard; melody statements began mid-bar as
  often as not; the kick's "one" was the kit's own counter. Harmonically correct in
  isolation, rhythmically unrelated in ensemble — "goes off randomly."

The letters below keep the numbering of the cut-line conversation. E — an audition
button that rolls the vibe's true density instead of forcing every layer — was left at
the cut line.

**A. Register.** The spec grows a per-vibe character block, and the first thing in it
is where each stratum sits: cave and overgrown path put the texture at the root and the
melody low, the bright forest rings both strata high, settlements hold the middle.

**B. Gait.** Each vibe owns a *subset* of the rhythm-cell library — the village dotted
and snapped, the farm even-footed, the paths lilting — so the rhythmic fingerprint is
the place's, not the engine's. Wilderness vibes stay cell-free.

**C. Harmonic pace.** Bars-per-chord, per vibe: the village rocks every bar; riverside
and the deep forest hold a chord for two to four bars and drift. Changes the felt speed
of thought more than tempo does.

**D. Phrase habit.** Per-vibe phrase rest spans and a fragment bias: settlements state
full periods often; the cave and the overgrown path mostly drop short closing fragments
into long silences.

**F. The one clock.** The ensemble fix, and the deepest change: the bar clock becomes
the *only* clock. Each bar, the director schedules everything the bar contains — the
drone's chord, the texture figure with its downbeat *on* the downbeat, the kit's four
beats, and any melody statement that has come due, started on the bar line. Chord
changes and figure changes agree by construction; drift and ritard stretch every part
identically because every part is placed from the same bar length. Three clocks and
their resync rules are deleted, not replaced.

**G. Rarer hands.** The music box falls back to the village interior plus the deep
forest; the bridge's re-orchestration becomes a seeded *chance*, not a guarantee, so
an alternate voice is a visit rather than a scheduled appearance.

Alongside, from the same listening: the director's output takes a 20% master trim, and
the character block carries a per-vibe level — the interior sits a further 40% down,
because furniture music was arriving at concert volume.

The character table in `vibes.ts` is the tunable, all of it: registers, gaits, chord
pace, phrase habit, level. Working values are the builder's first guesses; the table is
the owner's.

*Done when the nine vibes are strangers who share a landscape — a blindfolded walk from
the village to the cave could be narrated from the music alone — and any two strata
heard at once are audibly playing the same bar of the same piece.*

### Phase 6i — Rust and cold water

Eleven more places, and every one of them falls outside what the book was built for. The
nine vibes are a pastoral book: villages, farms, forests, water, one cave. The new list
is three families the pastoral assumptions actively mislead — the underground, the
industrial park, and a cold coast — so this phase extends the three tables the machine
reads from (modes, voices, vibes) rather than adding behaviour to the director. The
director is not touched.

The new places, as the owner described them: **Cave 2** and **Cave Dark**, deeper and
worse than the one cave the book has. **Factory 1** and **Factory 2**, the interior of
the industrial park. **Sewer 1** and **Sewer 2**, inside a deep reverberating pipe and
its maintenance areas. **Scrapyard**, mountains of trash under metal and fences.
**Substation 1** and **Substation 2**, the industrial park's exterior innards — visible
structures, chainlink and bollard mazes. **Beach**, a cold Atlantic coast. **Beach
Path**, still in the woods on sand, the water barely audible.

#### The four findings

**1. The world will be loud where the music is.** The industrial places are getting
machinery ambience — running plant, metal clangs, groaning beams — and the sewers are
getting runoff and drips. None of that belongs in the score; all of it competes with it.
Machine noise is broadband and owns the low-mid, so those vibes vacate that band on
purpose: a tuned drone *underneath* the clatter, glints well above it, and a deliberately
thin middle. They also sit lower in the mix — `level` 0.85–0.9 — because in those rooms
the world is the foreground and the music is what is playing behind it.

**2. Machines march even; people swing.** The strongest untouched lever in the character
block is gait. Every folk cell in the library — the dotted pair, the scotch snap, the
6/8 lilt — is a *human* rhythm, and the whole existing book uses them. The industrial
vibes take `even` alone (or even plus short-short-long, which is a hammer, not a dance)
with long chord holds: a machine states its cycle and does not phrase it. That single
rule separates the two halves of the book before a note of timbre is chosen.

**3. Seven folk modes cannot carry twenty places.** Nine vibes over eight modes was
already close; twenty would mean two or three places per mode, and mode is the character.
Five new scales, all of which keep a perfect fifth so no zone argues with its own drone
(the reason locrian is still out), and all of which the ground library can serve.

**4. The struck engine still has the cheapest new timbres in the project.** Junk metal is
just a partial table that isn't a harmonic series — the same machine as the tongue drum
with the ratios deliberately unmusical. Two of the six new voices are one table entry
each; the other four are small.

The beach is the one where the research is mostly negative. **Not tropical**: no steel
pan, no bright major-key warmth, nothing that reads as a holiday. A Delaware coast is a
beautiful view you don't want to sit in — so the mode is a minor third with a major sixth
(picturesque and cold in the same five notes), the whole vibe sits high and thin with no
depth under it (all sky and glare, no warm bottom), and there is no pulse at all, because
the shore is weather.

#### The new modes

| Mode | Semitones | Where | Ground (home / away / borrow) |
|---|---|---|---|
| harmonic minor | 0 2 3 5 7 8 11 | cave dark | 0–8, 0–5, 0–8–5–8 / 5–8, 8–0–5–0 / borrow 10 |
| phrygian dominant | 0 1 4 5 7 8 10 | factory 1, substation 2 | 0–10, 0–1, 0–10–1–10 / 10–1, 1–10 / borrow 3 |
| blues hexatonic | 0 3 5 6 7 10 | factory 2, scrapyard | 0–10, 0–3, 0–5–3–5 / 5–10, 3–10 / borrow 8 |
| hirajoshi | 0 2 3 7 8 | cave 2 | 0–8, 0–0–8–8 / 8–0, 8–8–0–0 / borrow 5 |
| kumoi | 0 2 3 7 9 | beach, beach path | 0–2, 0–0–2–2 / 2–0, 2–2–0–0 / borrow 10 |

All five obey the existing grammar unchanged: the fifth is in the mode, no ground roots
on the fifth or the leading tone, and each borrow chord is out-of-mode and neither. The
literature names are working labels.

The grammar also decides how wide each book can be, which is why the last two are two
chords across. A ground root is rendered as a root and a *perfect fifth*, so a degree
whose own fifth is missing from the mode cannot be one — and in a five-note scale that
leaves two candidates. Both places that use those modes barely move anyway, so the second
loop is the slow one, two bars home and two away, rather than another pair of roots.

The one deliberate risk is the blues hexatonic's flat fifth, a semitone off the droned
fifth. Against a pastoral drone that would be a mistake; under a factory and a scrapyard
it is the grind, and it is the reason those two places sound *wrong* on purpose. If it
reads as broken rather than grimy on the listening pass, the fix is one line — drop the 6
and the mode becomes the pentatonic minor already in the book.

#### The new voices

| Voice | Engine | The recipe, in brief | Sits best |
|---|---|---|---|
| anvil | struck | inharmonic steel, ratios ~1 : 2.4 : 3.6 : 5.4 : 7.2 with heavy per-note jitter, hard short strike, no body | texture, industrial |
| oil drum | struck | a dull tuned head, 1 : 2.1 : 3.3, damped top, thump under it — a tongue drum that has been left outside | texture, low |
| vibraphone | struck (+ tremolo) | arch-tuned metal bar, long decay, a slow shared tremolo over the output — the motor | melody, cold |
| glass | new, small | rubbed rim: near-pure sines, no attack transient, seconds-long swell, a faint tremble | drone/texture |
| hum | new, small | a tuned transformer: odd harmonics, two partials beating slowly, a faint octave hum, mains flutter | drone, low |
| pipe | flute | the blown bottle — the ocarina's round wave, a low ceiling, and the breath the flute deliberately refuses | drone/melody |

Alongside them, the four voices 6f built and the book never used are put to work: **monks**
(cave 2's drone), **tuba** (factory 2), **brass** the horn (factory 2's melody), and the
plain **pluck** (substation 1, beach path).

#### The book, extended

Roots continue the ladder rather than crowding it. The industrial and underground half
takes the octaves below the settlements; the coast takes the one gap above them.

| Vibe | Root | Mode | Pulse | Drone / Texture / Melody | Character |
|---|---|---|---|---|---|
| cave dark | G1 49 | harmonic minor | — | organ / glass / bells | tex +12, mel +24, 2 bars a chord, rests 30–70 s, 85% fragments, density 0.15 |
| sewer 2 | B1 61.7 | phrygian | — | bass / oil drum / pipe | tex +12, mel +12 (low and close), rests 26–60 s, 75% fragments, density 0.2 |
| sewer 1 | C2 65.4 | aeolian | — | pipe / glass / bells | tex +12, mel +24, 1 bar a chord, rests 24–52 s, drone 0.7, density 0.25 |
| factory 2 | D2 73.4 | blues hexatonic | 72–84, **kit** | tuba / anvil / brass | even + short-short-long, tex +24, mel +24, rests 12–24 s, level 0.85, density 0.6 |
| cave 2 | F2 87.3 | hirajoshi | — | monks / glass / vibraphone | tex +12, mel +24, 2 bars a chord, rests 22–48 s, 70% fragments, density 0.25 |
| factory 1 | G2 98 | phrygian dominant | 46–54 | hum / anvil / chimes | even, 3 bars a chord, tex +24, **mel +36** — under the clatter and far above it, density 0.45 |
| scrapyard | A2 110 | blues hexatonic | — | bass / anvil / guitar | tex +12, mel +12, rests 18–40 s, one lone detuned guitar over the junk, density 0.4 |
| substation 1 | B2 123.5 | aeolian | 44–52 | hum / anvil / pluck | even, 3 bars a chord, tex +12, mel +24, level 0.9, density 0.4 |
| substation 2 | F#3 185 | phrygian dominant | — | hum / glass / pluck | the whine, not the buzz: tex +0, mel +12, drone 0.75, density 0.3 |
| beach | A3 220 | kumoi | — | strings / glass / vibraphone | tex +0, mel +12 — all sky, no bottom; 1 bar a chord, rests 16–34 s, density 0.4 |
| beach path | A3 220 | kumoi | — | strings / pluck / ocarina | the beach's reduction: same root, mode and seed, wood for glass, level 0.85, density 0.28 |

Where the table leaves a field unstated the built value follows the rule behind it: the
pulse-free places hold a chord for two bars (one where the table says so), the industrial
places that the table does not level explicitly sit at 0.85–0.9 with the rest of their
half, and factory 2 holds four of its short pulsed bars a chord.

Alternates, one pair each, drawn to keep any voice from carrying more than two vibes:
cave dark pipe/chimes, sewer 2 anvil/kalimba, sewer 1 oil drum/chimes, factory 2
guitar/trumpet, cave 2 pipe/chimes, factory 1 oil drum/vibraphone, scrapyard oil
drum/dulcimer, substation 1 oil drum/vibraphone, substation 2 anvil/ocarina, beach
harp/ocarina, beach path kalimba/vibraphone. New seeds 56–65 — the beach path shares the
beach's, the way the village interior shares the village's; a place's motifs recur on
every visit as before.

Three shapes carry over from the existing book and are worth stating, because they are
what stop twenty vibes from becoming twenty transpositions:

- **Beach and beach path are a pair the way the village and its interior are** — same
  root, same mode, same seed, thinner arrangement and different hands. Walking out of the
  trees onto the sand is the same music opening up, not a track change.
- **Only three of the eleven have a pulse.** Machinery is the only thing down there that
  keeps time; the caves, sewers, scrapyard and coast are weather, and float. One kit in
  eleven, at factory 2.
- **Pulse-free chord holds stay at 1–2 bars.** A breath bar is 8–13 seconds, and 6h's
  monotony bug was chord pace written for pulsed bars applied to those. None of the new
  pulse-free vibes exceeds two.

#### Work order

1. **Five modes** into the mode table, and five ground books beside them — the grammar
   checks (fifth in mode, no dominant grounds, borrow out-of-mode) run over the new
   entries with the old ones.
2. **The struck three** — anvil, oil drum, vibraphone as partial tables; a shared slow
   tremolo on the output for the vibraphone's motor.
3. **Glass and hum** — two small sustained files. Glass is additive sines with a
   seconds-long swell and no transient; hum is the odd-harmonic buzz with a beat between
   its two partials.
4. **Pipe** — the flute engine gains breath (which the flute itself still refuses) and a
   bottle preset over the round wave.
5. **The eleven specs** per the table, rack identity preserved — zones declare the
   constants, so a shared vibe is a shared rack and the border crossfade holds.
6. **The rank and the rows** — six plinths on the music stage, six audition subjects,
   the dev panel's vibe list grows to twenty.
7. **The audition pass** — the owner listens. Every table above is the tunable, and the
   two most likely redirections are named already: the blues flat fifth, and how far the
   industrial vibes sit under the world.

*Done when the industrial half of the map cannot be mistaken for the pastoral half with
the ambience muted — no folk gait, no warm mode, nothing in the band the machines will
occupy — and the beach reads as a cold coast rather than a warm one.*

### Phase 6j — Bows, bends and breath

Reading the twenty vibes as stories, every voice in the book is one of two things: a hand
that releases a note and leaves (everything struck and plucked), or a vessel that sounds
without anyone holding it (the winds, the pads, the hum — weather). Nothing is *performed*.
And several areas share a narrator that should belong to one of them: strings drone five
vibes, glass textures five, the ocarina sits in six palettes, anvil in five. This phase
adds five performer voices and reseats twelve palette slots, so more places are told by
someone rather than something — and so the glue voices thin out to the places that own them.

#### The two gaps, and how they close

**Nothing in the book is bowed solo.** The strings are a section and a pad — weather, not
a person. The answer is the **fiddle**: one bowed line with a bow-noise onset and a vibrato
that arrives late, the way a player settles into a note rather than starting inside it. A
bow is a breath that does not run out, so it is built on the mono wind core, not on
per-note oscillators: a fiddle phrase is one bow direction the way a flute phrase is one
lungful, and re-attacking every join is the same harsh stop-start the winds were cured of.
The section stays the section; the fiddle is the soloist in front of it.

**Nothing bends between notes.** Every interval in the book is a step — noteOn, noteOff,
no path travelled between pitches. The fix is two layers, neither of which touches the
director:

- **Onset bends, per instrument.** A note bends *into itself*: the harmonica scoops up
  from below over its first tenth of a second, the fiddle slides the last few cents into
  pitch as the vibrato wakes, the saw arrives from a third below and never quite stops
  moving. Instrument-local, cheap, and each voice's bend is its signature.
- **True between-note glides, from machinery that already exists.** The mono core reads
  legato from timing alone — a note starting over a sounding player *joins* it, and the
  join is a pitch glide, not a new attack. The winds glide in ~20 ms because a tongued
  join is quick; but glide speed belongs to the voice's `tune`, not the pool. The fiddle
  takes a fast audible shift (~60 ms — a finger moving along a string), and the saw takes
  a slow one (~200 ms — the blade has to travel). The director already writes phrases
  with overlapping notes, so portamento falls out of the existing contract: nothing
  upstream declares a bend, the bendy voices simply answer overlap differently.

#### The five voices

| Voice | Engine | The recipe, in brief | The story |
|---|---|---|---|
| fiddle | mono core | sawtooth under two formant peaks, a breath of bowed noise at the front, vibrato ramping in late, fast glides at joins | the book's first performer — a person, where strings are weather |
| hurdy-gurdy | new, small | a cranked drone: the melody string, a constant fifth under it, and the trompette — a buzzing bridge that ticks when the crank pushes | the folk instrument that is a machine; the hinge between the book's halves |
| saw | mono core | a near-pure sine with one faint upper partial, deep slow vibrato, a rise into every note and slow glides between them | things singing where they shouldn't |
| harmonica | mono core | a reed's square-saw blend with breath noise in the tone and a scoop up into each onset | the pocket instrument; the loneliest sound the book can make |
| deep drum | struck | one table entry: ~70 Hz head, inharmonic skin partials, soft strike, long boom | ritual time, where the kit is human time |

#### The seats

Swaps inherit their seat — octave, role and level stay as tuned unless the row says
otherwise. Twelve seats across eleven vibes:

| Vibe | Seat | Was | Becomes | The story |
|---|---|---|---|---|
| village | alt melody | ocarina | fiddle | the evening fiddler |
| farm | alt melody | kalimba | fiddle | the barn dance when the texture flips |
| farm | drone | accordion | hurdy-gurdy | the working crank; the accordion becomes the interior's alone |
| forest path a | drone | bass | hurdy-gurdy | the walking drone — `droneLevel` 0.65 was tuned against the bass and gets re-heard |
| forest path a | alt melody | dulcimer | harmonica | the walker's pocket |
| beach | alt melody | ocarina | harmonica | someone at the cold shore — the anchor placement |
| sewer 2 | alt melody | kalimba | harmonica | someone lives down here |
| scrapyard | alt melody | dulcimer | saw | the literal one: a saw in the junk, played |
| cave dark | melody | bells | saw | bells say shrine; a glide in harmonic minor says something is down there singing |
| substation 2 | alt melody | ocarina | saw | the whine's cousin, and the last pastoral stray leaves the industrial half |
| cave | alt texture | tongue drum | deep drum | struck far off, felt more than heard |
| cave 2 | alt texture | pipe | deep drum | monks over a ritual drum — the lived-in cave completes |

The exposure ledger this settles: ocarina six palettes → three, kalimba five → three,
dulcimer four → two, bells four → three, and the accordion sharpens to the interior alone.
Each new voice lands in two or three vibes — the saw and harmonica take three, split
across roles and halves of the book so neither becomes the new glue.

Benched, considered and kept off: a **waterphone** (bowed junk metal — takes the saw's
dark seats if the saw reads too tuneful on the listening pass) and a **celesta** (the
music box and vibraphone already own that shelf).

#### Work order

1. **Fiddle** — a mono-core voice: formant body, bow-noise front, late vibrato, fast
   joins. The bowed-solo gap closes here.
2. **Saw** — the smallest mono-core voice, and the proof of the between-note bend: slow
   glides at joins, a rise into every phrase start.
3. **Harmonica** — mono-core reed with breath in the tone and the onset scoop.
4. **Hurdy-gurdy** — the cranked drone with its constant fifth and trompette tick.
5. **Deep drum** — one struck table entry.
6. **The twelve seats** per the table — swaps inherit their seat's tuning; forest path
   a's drone level gets re-heard against the gurdy.
7. **The rank and the rows** — five plinths on the music stage, five audition subjects,
   `build.ts` cases, the voice union.
8. **The audition pass** — the owner listens. The named risks: the saw reading comic
   rather than eerie, the gurdy's buzz crowding the path's band, and whether the
   harmonica's scoop survives the beach's thin mix.

*Done when a stranger walking the map could say who plays where — the fiddler in the
village, the crank on the farm, the saw in the junk, the harmonica at the shore, the drum
in the deep — and when at least one voice in the book audibly travels between two pitches
instead of stepping.*

### Phase 6k — The old rules

The composed machine knows form — sections, periods, the four operations, the measured
ritard — but every rule it has is about *which notes and when*. What it does not know is
everything a band knows that never reaches the page: how notes are tuned against a drone,
how a tune is decorated the second time through, how two players share one melody, and
where a piece is allowed to go. Six moves close that, and all of them are old — most are
older than the classical rules the grammar already refuses. Nothing here adds a voice or
a vibe; the band gets smarter, not bigger.

#### The six moves

1. **Pure intervals over the drone.** `hz()` is equal temperament, so every held
   interval beats slowly against the pad — the fifth two cents shy of pure, the sixth
   sixteen wide. Drone traditions tune to the drone instead: a `JUST_CENTS` table in
   `theory.ts`, one entry per pitch class above the **zone root** (3:2 for the fifth,
   4:3, 9:8, 6:5 …), applied on the way to hertz by the music path alone — the world's
   `hz` stays as it is. The reference is the zone root, never the chord of the bar,
   because the drone is what the ear tunes to; octaves stay pure by construction. The
   blues mode's flat fifth takes 7:5, which makes it the blue note by ratio rather than
   by accident. The subtlest move in the phase and likely the deepest: held fifths and
   fourths lock onto the pad instead of hovering near it.
2. **The bridge changes mode, not just ground.** A `NEIGHBOURS` table in `theory.ts`:
   pairs of equal-length modes one accidental apart — the brightness chain
   lydian–ionian–mixolydian–dorian–aeolian–phrygian, plus aeolian↔harmonic-minor,
   phrygian↔phrygian-dominant, pentatonic-major↔kumoi and kumoi↔hirajoshi.
   Blues-hexatonic has six notes and no same-size neighbour, so it sits out. In
   `onSection`, a B section may (dice, ~0.5) step one notch darker or brighter on the
   same root. Heads and ostinatos already live in degree space, so equal length means
   the same idea re-said with one accidental moved — the scale lock holds by
   construction, and the drone survives every step because every mode in the book keeps
   the fifth. The return to A was always the return home; now leaving means something.
3. **Ornaments on restatement.** A small vocabulary: the cut (a short grace a degree
   above, just ahead of the note), the mordent (note–lower neighbour–note), the
   anticipation (the landing touched early and softly). Dice per long note in
   `fireStatement`, scaled by tension — and never on a piece's first statement: plain,
   then decorated, is a performer warming in. Rendered as short extra `noteOn`s, no
   instrument changes anywhere; the mono voices read a tight leading grace as a join
   and glide through it, which is a fiddle cut for free.
4. **Heterophony — the other player knows the tune.** Where the alt melody voice is
   not carrying the statement and tension sits high (~0.6 up), it shadows the melody:
   the same notes 30–90 ms behind, at ~0.6 velocity, each passing note carrying a
   chance (~0.25) of being skipped. Not a harmony line and not a doubling — one tune,
   two players, the oldest ensemble texture there is.
5. **The echo answer.** At low tension the consequent may return a bar later in the
   idle alt voice — an octave away, quiet, alone: the hills answering. Cousin of move
   4, riding the same idle-alt machinery. It lands last and only if the listening pass
   wants more air filled — garnish, not default.
6. **Suspensions, and the crooked bar.** At a chord change the texture may hold its
   previous pitch through the figure's first step — the old chord suspended over the
   new — then resolve by step into the new one: fourth into fifth, second into root,
   never a third. And the rhythm library gains two aksak cells, 3+3+2 and 2+3+3 over
   the same four beats — the crooked gaits; which vibes take one into their gait is a
   per-vibe table choice, never a global one.

#### Work order

1. `JUST_CENTS` and a music-path `justHz` — hear the pad lock before anything else
   moves.
2. The `NEIGHBOURS` table and the B-section mutation.
3. Ornaments in `fireStatement`.
4. The heterophonic shadow.
5. Suspensions in `fireFigure`; the two aksak cells and their gait-table seats.
6. The echo answer — only on request, after the listening pass.
7. The listening pass, and `check:audio` re-run — ornament and shadow change note
   counts, so any moved crest or periodicity gets re-captured, not argued with.

*Done when a held fifth sits still instead of shimmering, a bridge audibly goes
somewhere and the return home is felt as a return, and no restatement of a motif is
note-for-note the statement before it.*

### Phase 6l — The back of the wagon

After 6j the rack holds thirty-two voices, but mapped by family there are holes: nothing
twangs (no swept-formant sound at all), nothing is bowed metal (the waterphone stayed on
the bench), every plucked voice is sustain-pretty (harp, dulcimer, guitar — nothing
percussive with a drum body), no voice is a *person* who is not playing an instrument,
and strings still drones five vibes — the reseat question 6j left open. Five voices, and
three of them (waterphone, jaw harp, viol) are allies of the night pass that follows:
they land in alt seats, and at night the alternates become the usual draw.

#### The five voices

| Voice | Engine | The recipe, in brief | The story |
|---|---|---|---|
| jaw harp | new, small | one plucked burst through swept formant filters over a fixed fundamental — the mouth is the filter | the idle twang; mystery in the pocket |
| waterphone | new, small | an inharmonic partial stack under a slow bowed swell, the pitch wandering as it rings | the promoted understudy — bowed junk metal, benched in 6j |
| banjo | pluck family | a bright fast-decay pluck into a drum-head body resonance | the percussive pluck the sustain-pretty family lacks |
| whistler | mono core | near-sine with breath in it, idle vibrato arriving late, portamento joins | not an instrument — a person, whistling |
| viol | mono core | the fiddle recipe taken low and slow: darker formants, slower vibrato, a longer bow | a bowed drone, so strings can stop being the book's default weather |

#### The seats

Swaps inherit their seat's tuning as in 6j; the three drone seats get their `droneLevel`
re-heard, since those numbers were tuned against the string section. Eleven seats across
ten vibes:

| Vibe | Seat | Was | Becomes | The story |
|---|---|---|---|---|
| riverside | drone | strings | viol | one bow by the water |
| beach | drone | strings | viol | one cold bow on the shore |
| beach path | drone | strings | viol | the same bow, heard through trees |
| riverside | alt melody | chimes | whistler | someone by the water |
| beach path | melody | ocarina | whistler | someone walking the shore path, whistling |
| farm | alt texture | marimba | banjo | the barn dance gets its rhythm hand |
| forest path a | texture | guitar | banjo | the walking band's strum sharpens |
| forest path b | alt melody | ocarina | jaw harp | the idle walker's twang |
| scrapyard | alt texture | oildrum | jaw harp | junk twang over the heap |
| cave dark | alt melody | chimes | waterphone | something bowed answers the saw |
| sewer 1 | alt melody | chimes | waterphone | water on metal, bowed |

The exposure ledger this settles: strings five drones → two (village and forest a, the
two brightest — a section again, not weather), chimes six seats → three, ocarina three
→ one, oildrum five → four, marimba three → two, guitar five → four. Each new voice
lands in two or three vibes, and the beach pair counts as one place twice.

#### Work order

1. **Viol** — the mono-core low bow, tuned in a drone seat from the start.
2. **Whistler** — mono core; the risk is named early: it must read as a person, not a
   flute patch.
3. **Banjo** — the pluck family's percussive member.
4. **Jaw harp** — the formant sweep; one dial from cartoon, so tuned carefully.
5. **Waterphone** — the inharmonic bow.
6. **The eleven seats** per the table; the three viol drone seats re-heard for level.
7. **The rank and the rows** — five plinths on the music stage, five audition rows,
   `build.ts` cases, the voice union, fresh baselines.
8. **The audition pass** — the owner listens. Named risks: the whistler reading as a
   patch rather than a person, the jaw harp reading comic, and the viol carrying a
   whole shore alone where a section used to.

*Done when the shore is a single cold bow instead of a section, somebody whistles on the
path through the trees, and no glue voice holds more than three seats anywhere in the
book.*

### Phase 6m — The other side of things

The score already has a night input — a 0..1 scalar on the director, fed by the dev
panel's toggle until the day/night cycle exists to drive it. What it does today is
reduction: touch cut 30 %, texture half-time, kit half-time. Velocity is brightness in
every voice, so the result is the day turned down and dimmed — darker and sleepier, which
is the wrong story. Night is not the day gone bad. We are under the moon now, not the
blinding sun; the night is the other side of things — what we couldn't see during the day.

So night inverts instead of reducing. Same seeds, same motifs, same places; the other
half of the existing vocabulary. No new modes, no new voices — the night does not get its
own vocabulary, it gets the rest of this one.

#### The five moves

All in the director, all riding the existing `night` scalar:

1. **The other hands play.** The alternates' per-piece dice sit near 0.3 by day; at
   night they flip to ~0.75, so the alt texture and alt melody become the usual draw and
   the primaries the exception. The village's fiddle where the flute sang, the harp
   where the dulcimer hammered — the hands the day never showed.
2. **Registers invert instead of lights dimming.** The texture lifts an octave — the
   same figure as glints, moonlight on the same object — and the melody drops one where
   its seat leaves an octave to give (the existing may-drop rule, leaned on harder).
   The village interior already proved inversion reads as the same music heard from
   elsewhere, not a different track.
3. **Questions outnumber answers.** A statement is a question that hangs open, then an
   answer that lands on the root. At night ~40 % of statements speak the question and
   withhold the answer — the phrase rest begins on the open note. Mystery as form, not
   as a darker key: nothing new is said, something is left unsaid.
4. **Hush, don't gloom.** The touch cut drops from 30 % to ~12 % — a little quiet for
   the moon without muffling the tone. The half-time texture and kit stay: stillness is
   not scariness.
5. **More sky between sounds.** The drone's breath (a due pad refresh skipped so the pad
   falls away and re-enters) rises from 30 % to ~45 % at night.

#### Work order

1. The alternate flip, the register inversion and the softened touch — one pass over
   `level`, `fireFigure`, `fireStatement` and the per-piece orchestration dice.
2. The withheld answer in `fireStatement`.
3. The night breath in the ordinary-bar drone refresh.
4. The listening pass — the owner flips the panel toggle mid-piece and judges whether
   the place stayed the same place.

*Done when flipping the night toggle mid-piece reads as the same place under the moon —
the other side of the same music — and never as a darker track.*

### Standing rule — nothing drones alone

Long stretches of pad with nothing moving over it are the one thing the score must never
do. Three separate reports of it traced to three causes, all now closed:

- **Density was a coin flip on whether the melody existed.** A losing roll meant a whole
  two-minute piece of pad and scattered texture. Every piece now gets all three strata;
  `density` instead leans the rest between statements toward the short end of the vibe's
  `phraseRest` span. How *much* the melody speaks is the tunable; whether it speaks is not.
- **The entries and exits were counted in bars.** A breath bar is ten seconds, so "the
  melody arrives with the second section, the texture leaves two bars early" spent half a
  minute of bare pad at each end of a pulse-free piece. Both edges are now counted in
  seconds and converted: a pulse-free piece concedes no intro at all, and the outros are
  a few seconds rather than a few bars.
- **The book's own numbers.** Rests ran to seventy seconds and densities to 0.15.
  `check:audio` now fails the build on any vibe under 0.7 density or over a 24-second rest.

Measured worst case across the book: no bare pad at all in the pulse-free vibes, under
eight seconds in the pulsed ones, and at most twenty-odd seconds between melody statements
anywhere — with the texture playing throughout. Sparseness belongs in the rests *between*
pieces, never in a stratum holding still.

### Phase 7 — Actors and ambient motion

NPC figures, procedural animation, patrol and idle, look-at. Proving Ground gains a
patrolling NPC.

#### Wind sway — the world moving on its own

A still world reads as a diorama however good it looks, and a small amount of constant,
unforced motion does more for the feeling of being somewhere than almost anything else that
could be spent the same effort. This is cheap and it should be built early in the phase, not
last.

**Vertex sway, in the shader, not on the CPU.** Displace vertices in a `MeshLambertMaterial`
patched via `onBeforeCompile`, so it stays one draw call and costs nothing per instance.
Moving objects on the CPU would mean a matrix update per prop per frame and no way to make
a single tree's branches move differently from its trunk.

The displacement has four parts:

- **Weight.** The per-vertex sway weight authored in Phase 4. Everything else is multiplied
  by it, which is what pins roots and frees tips.
- **Stiffness per species.** `art/flex.ts`, applied to the weights when a builder finishes.
  The vertex attribute says *where* a thing bends; it cannot say whether the species bends
  at all, because that is a fact about the plant. Reeds thrash, a sunflower nods, a mushroom
  is rigid. **Absent from the table means rigid** — an anvil that wobbles because somebody
  forgot is a worse failure than a new plant that stands still until noticed. `check:art`
  asserts every entry names a real builder, because a typo is otherwise silent: it is not an
  error, it is a plant that has quietly gone stiff.
- **A travelling front.** Not a phase offset per instance. See below.
- **Two frequencies.** A slow bend along the wind, plus a faster, smaller perpendicular
  flutter. One frequency is a metronome; two that do not divide evenly never visibly repeat.

**The gust travels, and that replaced the per-instance phase offset.** The original plan
gave each tree a random offset so no two moved together. That is the right instinct and the
wrong mechanism: wind has a current and a front, so a gust *arrives* somewhere and moves
through, and what separates two trees is not a random number but where they stand. So the
field gained a position argument — `strengthAt(x, z)` samples `fieldAt` at a phase lagged by
how far downwind the point is, `frontSpeed` metres per second. Everything on a line across
the wind receives it together, which is what a front is; everything downwind receives it
later, which is what lets you watch it cross a valley. At 9 m/s that is about eleven seconds
for Arkstin's bowl.

**And it is the same field the audio reads.** Every wind-driven model — foliage, wind, fire,
rain, the tree groan, the gate creak — samples at *its own position* rather than at the
listener, so the far treeline quickens before the near hedge, in the order you watch the same
gust reach them. That coupling is the entire point of having built a gust field.

**Getting the shader to agree exactly is the one real engineering problem**, and the obvious
answer is wrong. Reimplementing the noise in GLSL would differ in the last bits — integer
hashing and float precision are not the same on both sides — and over a minute the picture
and the sound drift apart. That failure is invisible in code and shows up only as a vague
sense that something is off, which is worse than never having coupled them. So the CPU stays
the single source of truth and *ships the answer*: the field depends on one scalar, so a
rolling 256-texel `DataTexture` holds it across the window of phases the visible world can
ask for, rebuilt each frame from `Weather.fieldAt`. Agreement by construction rather than by
care. Eight bits is ample — a strength quantised to 1/255 is far finer than any displacement
it drives.

Candidates beyond trees: grass and bushes (higher frequency, smaller amplitude), hanging
cloth and banners, water surfaces, smoke, chains and signs on pivots, reeds. Anything with
a pivot can use a simpler rotation instead of vertex work.

**Not only wind.** The same machinery covers idle motion generally — a breathing NPC, a
guttering lamp, a door easing on its hinge. Ambient motion is a system, not a tree feature.

*Done when one NPC walks a loop and turns to watch you, and when standing still in the open
does not feel like standing in a photograph.*

### Phase 8 — Interaction and narrative

Raycast interaction; topic pool and `[[keyword]]` parser; dialogue UI; per-NPC topic tables,
rebuffs and item responses; quests; inventory; journal with keyword index; notes and
letters. Proving Ground gains two test NPCs — one who teaches a keyword, one who only
answers it — plus a fetch quest that resolves in conversation and a letter that teaches a
topic.

*Done when you can learn a keyword from a note, carry it to the NPC who answers it, be
rebuffed by the one who doesn't, and close a quest by presenting an item mid-conversation.*

### Phase 9 — Meta

Autosave, settings overlay if kept, performance pass. (Touch controls moved to Phase 1.)

*Done when it survives a reload and plays on a phone.*

### Phase 10 — Content

Systems frozen. Authoring data files only. **The fiction is to be settled with the repo
owner before this starts — do not invent it.**

### Phase 11 — World editor ⏸ optional

In-browser: fly camera, place/move/rotate props, sculpt the heightfield, place audio
emitters with visible radii, place triggers and NPC spawns, export JSON to disk.

*Done when a zone can be built without touching code.*

> **Deferred, not cut, and moved to the end.** The argument for an editor was that
> hand-placing everything by typing coordinates would become miserable. Phase 5 weakened
> that: terrain is a short list of named landforms, ground cover is a short list of painted
> shapes, and props are scattered by seeded rules against the heightfield rather than placed
> one at a time. Arkstin Village is a few dozen lines of data, and the checks catch the
> errors an editor would otherwise catch by eye — props off the ground, buildings on slopes,
> arrivals inside walls.
>
> Phase 6 pushed in the other direction and is worth recording: **placing sounds by typing
> coordinates genuinely is miserable**, because there is nothing to look at. But the answer
> to that turned out to be Phase 6b — give every sound an object and put the objects in
> galleries — not an editor. The editor is worth building when hand-editing hurts for a
> reason a builder cannot fix. The signal to watch for: wanting to nudge one prop at a time,
> or authoring a zone that is mostly hand-placed set pieces rather than rules.

---

## Architecture

```
src/
  main.ts              boot, zone switch
  engine/              Viewport, Loop, Input, PostFX
  audio/               context, buses, noise substrate, models/, Emitter, zone acoustics
  player/              Controller, Collider
  world/               Zone, ZoneManager, Portal, Interaction, interior,
                       terrain (landforms), ground (cover materials)
  art/                 mesh builders — one file per family
  actors/              Actor, NPC, animation drivers
  systems/             Topics, Dialogue, Quests, Inventory, Interaction, Notes, Autosave
  ui/                  Reticle (prompt + fade), Loader, TouchControls
                       (DialogueUI, JournalUI, NoteUI from Phase 8)
  content/             data only — zones, npcs, topics, quests, items, notes
  editor/              world editor (Phase 11, optional)
  debug/               ProvingGround, panels, overlays
tools/                 headless checks, run under node — outside the tsconfig
docs/                  build output, served by Pages — WIPED ON EVERY BUILD
public/                copied verbatim into docs/ (holds .nojekyll)
```

Content files hold no engine imports, so Phase 10 is authoring rather than coding.

> `docs/` is Vite's `outDir` with `emptyOutDir: true`. Never put hand-written files there —
> they will be deleted. Anything that must ship alongside the build goes in `public/`.

**This has already bitten once.** `docs/CNAME` — the custom domain for `hswow.net`, added
through the GitHub web UI, which naturally writes to the directory Pages serves — would
have been deleted by the next `npm run build`, silently taking the domain down with it. It
now lives in `public/CNAME` and Vite copies it out on every build. Anything else added to
the repo through GitHub's UI is exposed to the same trap.

## Dependencies

`three`, `vite`, `typescript`, `@types/three`, `lil-gui`. Note that three 0.170 ships **no**
TypeScript types, hence `@types/three`. `PointerLockControls`, `EffectComposer`,
`RenderPixelatedPass` and `stats.module` all ship inside three — import them from
`three/examples/jsm/…`, which resolves for both the bundler and the typechecker.

## Commands

```
npm run build           # tsc --noEmit, then bundle into docs/
npm run preview         # serve the built docs/ locally
npm run dev             # dev server with HMR, exposed on the LAN
npm run check:movement  # headless collision and movement assertions
npm run check:audio     # gust field, noise colour, reverb decay
npm run check:art       # builder determinism, sway weights, scale, watertightness
npm run check:world     # portals, arrivals, sealing, crossing leaks, terrain, door cue
npm run check:faust     # committed .wasm matches its .dsp, no shared memory, size budget
npm run build:faust     # recompile the .dsp sources; the artifacts are committed
npm run check           # all five
```

The `tools/` suites are not covered by `tsc --noEmit` — `tools/` is outside the tsconfig
`include`, which is what keeps Node globals out of the browser build's typecheck.

`check:world` passes `--external:../faust/*` to esbuild, and it is load-bearing. `Zone.ts`
imports `Soundscape` for `SILENCE`, which reaches every model, one of which reaches the
Faust tier — and that tier resolves its wasm and worklet through Vite's `?url` imports,
which nothing outside Vite can. The friction model defers its half behind a dynamic
`import()`, and the flag is what stops esbuild bundling it anyway: a dynamic import stops
the module *running*, not from being pulled in.

The audition harness is deliberately **not** a `check:` script. It needs a real
`OfflineAudioContext`, real biquads and a real worklet, and a reimplementation in Node
would measure the reimplementation. It runs from the debug panel; see the audio section.

## Debug switches

Query-string flags that work in the **deployed** build, not just locally, because the game
is tested on a phone against the live URL.

| Flag | Effect |
|---|---|
| `?debug` | Frame stats, the live tuning panel, a movement/zone readout, and zone jumps — including the sound stage, which has no door |
| `?level=<name>` | Which level to boot into. Only `proving` exists so far |
| `?touch` | Force the touch controls on, to test them with a mouse |

## Deployment

`docs/` is committed on purpose. One-time setup on GitHub: **Settings → Pages → Deploy from
a branch → `main`, folder `/docs`**. Every subsequent push touching `docs/` redeploys to
`https://stovenly.github.io/hswow.net/`.

---

## Deviations from the original plan

Recorded so future sessions understand why the code differs from the phase list.

**Debug gating is `?debug`, not dev-only builds.** The plan specified `import.meta.env.DEV`.
Testing happens against the deployed build on a phone, so a dev-only gate would put the
tuning panel somewhere permanently unreachable.

**Touch controls moved from Phase 9 to Phase 1.** Pointer lock does not exist on mobile
Safari or Chrome Android. The moment OrbitControls is replaced by the first-person
controller, the build stops being testable on a phone unless touch look and move ship in
the same phase. Phase 0 is mobile-testable only because OrbitControls happens to handle
touch.

**Collision is triangles, not "heightfield plus an AABB list".** The plan named those two
because they are cheap and easy to reason about, but an AABB list cannot represent a ramp,
and maintaining a second, separate path for terrain would mean every collision bug has to
be found twice. three's `Octree` indexes raw triangles, so authored walls, ramps, stairs
and Phase 5's sculpted terrain all reduce to one representation and one code path. Still
no physics engine, and still no dependency added.

**The narrow phase is ours, not three's.** `Octree.capsuleIntersect` decides penetration
from the capsule's distance to a triangle's infinite *plane*. Standing beside a stair
tread, that reports the capsule as half a metre inside it and launches the player. Our
`penetration()` reduces the capsule to the single sphere nearest the triangle and does a
proper closest-point test, which bounds every push by the capsule radius. three's octree
is still doing the broad phase, which is the part worth reusing.

**`tools/movement-check.ts` was added — a headless test, which no phase asked for.** Six
real bugs in the controller were found by it and would not have been found by playing:
a downward ground bias that made a 45° ramp unclimbable while 20° was fine; a ground snap
that depenetrated along the surface normal and so pushed the player backwards every
sub-step; a step-up whose obstruction test measured velocity that collision had already
zeroed, so it never fired. Collision is pure geometry and needs no GPU, and the build is
played on a phone where there is no debugger — asserting it is cheaper than feeling for
it. Delete it if it stops earning its keep.

**Dither, quantization and vignette are one pass, not three.** The plan listed them
separately. They are not independent: the dither has to be added *before* quantization —
that is the entire mechanism, trading spatial resolution for colour resolution — and the
vignette has to be applied before both, or its falloff is the smoothest gradient on screen
and bands worse than whatever it was darkening. Splitting them would also cost two extra
full-screen passes for nothing.

**A gradient sky with procedural clouds was added, which no phase asked for.** Requested
directly. `engine/Sky` — three colour bands plus fractal value noise projected onto a flat
layer overhead, recentred on the camera each frame. Two knock-on changes came with it: the
fog colour is now driven from the sky's horizon (distant geometry fades to the fog colour,
so a mismatch leaves a band of the wrong colour hanging in front of the sky), and the
proving ground's lighting was rebalanced for daylight.

**The gust field needed a contrast expansion.** Summing octaves of value noise gives a
distribution clustered hard around its mean — the central limit theorem — so the raw field
spent one second above 0.75 in ten minutes. The wind's whistle layer scales as the cube of
strength, so that layer would have been dead code. Expanding around the midpoint and
clamping costs the extremes, which become brief plateaus, and a sustained lull or a gust
that holds are both things weather does. Found by `check:audio`, not by ear.

**`tools/audio-check.ts` was added**, on the same reasoning as the movement check. It
caught the gust-distribution problem above, and a `fract(sin(n))` hash whose structure put
slow correlations back into a signal whose entire purpose is not having any.

---

## Structural work still owed

`done/SCALING.md` worked out what has to change for the world to reach its
finished size. Most of it landed; five decisions did not, and each is cheap to
make now and expensive to make after the phase that needs it has shipped. They
are listed here because the document they came from is closed.

- **The override layer, and stable ids.** Anything the player changes about a
  zone cannot be a mutation of built geometry — a zone is rebuilt from a seed.
  It has to be data held outside the zone, keyed to a stable id, and replayed
  when the zone is rebuilt. **Must land before Phase 8.**
- **Static and dynamic, declared.** A builder says which of its parts move, so
  the shadow map can stop redrawing a world that does not. **Must land with the
  first geometry that moves.**
- **Autosave at transitions.** Phase 9 owns it; the shape is settled in the
  scaling document.
- **A builder returns a descriptor, not a `Mesh`.** The contract change that
  makes a zone cheap to rebuild. Wanted by whichever phase first needs it.
- **A `casts` flag on `MeshBuilder`.** Every solid surface currently casts a
  shadow, including grass and clutter whose shadows are sub-pixel after the
  chunky stage and the quantize. Half of the shadow work landed; this is the
  other half.

---

## Open questions

1. World editor — build Phase 11, or hand-edit JSON? *(Leaning hand-edit; see Phase 11.)*
2. ~~Which optional audio models: water and fire?~~ *(Settled in Phase 6: both built, plus
   rain, crowd, and the scatter one-shots.)*
3. Crouch and sprint-stamina — in or out? *(Phase 1 shipped without them.)*
4. Keep the minimal settings overlay, or truly no UI at all?
5. ~~Fixed hour or a day/night cycle?~~ *(Settled: the sun moves. The clock is
   `ATMOSPHERE-WEATHER.md` §1.)*
6. The 16-colour palette itself — the shipped one is placeholder scaffolding.

---

## Sources

Research behind the audio system:

- [Developing game audio with the Web Audio API — web.dev](https://web.dev/articles/webaudio-games)
- [Web Audio API, Boris Smus — ch. 6](https://webaudioapi.com/book/Web_Audio_API_Boris_Smus_html/ch06.html)
- [Web Audio spatialization basics — MDN](https://docs.w3cub.com/dom/web_audio_api/web_audio_spatialization_basics.html)
- [reverbGen — generating artificial impulse responses](https://github.com/adelespinasse/reverbGen)
- [Tone.js Reverb — decaying-noise IR generation](https://tonejs.github.io/docs/14.7.58/Reverb.html)
- [Making Reverb with the Web Audio API — gskinner](https://blog.gskinner.com/archives/2019/02/reverb-web-audio-api.html)
- [music-dsp: Wind in Trees, how to synthesize](https://music-dsp.music.columbia.narkive.com/sRNWKJyD/wind-in-trees-how-to-synthesize)
- [Synthetic Wilderness: recreating nature sounds](https://www.knobulism.com/2025/01/29/synthetic-wilderness-recreating-nature-sounds/)
- [Andy Farnell, *Designing Sound*](https://mitpress.mit.edu/9780262014410/designing-sound/) — the standard reference for procedural audio models

Research behind the music system:

- [Skyrim and immersion: Soule's ostinatos and instrumentation — USU theory analysis](https://usutheoryiv.wordpress.com/2016/10/27/skyrim-and-immersion-jeremy-soules-use-of-ostinatos-and-instrumentation/) — the root-and-fifth ostinato, the three-strata texture
- [The Sound of No Man's Sky — Paul Weir, GDC 2017](https://www.gdcvault.com/play/1024067/The-Sound-of-No-Man) — contexts, instruments, intensity as layer count
- [Procedural Music in Spore — Jolly & McLeran, GDC 2008](https://www.gdcvault.com/play/323/Procedural-Music-in) — scale-locked generation, seeds as motifs
- [Minecraft — Twenty Thousand Hertz interview with C418](https://www.20k.org/episodes/minecraft) — randomized silence as the design
- [Breath of the Wild soundtrack analysis — kylydian](https://kylydian.tumblr.com/post/172277263339/breath-of-the-wild-soundtrack-analysis-day-5) — order-independent melody fragments
- [From Journey to Erica — Austin Wintory](https://awintory.medium.com/from-journey-to-erica-214355002896) — transitions by successive removal of layers
- [Synthesizing Strings — Sound on Sound](https://www.soundonsound.com/techniques/synthesizing-strings-pwm-string-sounds), [Brass](https://www.soundonsound.com/techniques/synthesizing-brass-instruments), [Flute](https://www.soundonsound.com/techniques/practical-flute-synthesis), [Formants](https://www.soundonsound.com/techniques/formant-synthesis) — the Gordon Reid synth-secrets recipes
- [Extended Karplus-Strong — Julius O. Smith](https://ccrma.stanford.edu/~jos/pasp/Extended_Karplus_Strong_Algorithm.html)
- [Csound formant tables](https://csound.com/docs/manual/MiscFormants.html) — vowel frequencies, amplitudes and bandwidths per voice type
