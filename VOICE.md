# Voice: one throat for everything that speaks

Spec for replacing the node-graph villager voice (`audio/oneshots/voice.ts`)
with a real-time articulatory synthesiser in an `AudioWorklet`, general enough
to carry every mammal-shaped voice the game will want. Written after the deep
dive on 2026-08-16.

**Built, all four phases, 2026-08-16.** `audio/voice/body.ts` (presets and the
track vocabulary), `audio/voice/processor.js` (the throat),
`audio/voice/writer.ts` (the villager writer), `audio/voice/Voice.ts` (the
client and the factory). Where the build differs from what is written below,
§10 says so and the code is right.

## 1. Goal

Villager speech that does not sound like a computer, at a cost that lets a few
of them talk at once, from a single piece of DSP that later serves other
people, animals and non-speech vocal sounds (laughs, sighs, grunts, bleats)
without growing per-species code.

Non-goals: intelligible English (against the fiction); birds, insects, frogs
(no throat — they keep their own models in `oneshots/animal.ts`); anything
pre-rendered or sampled.

## 2. Why the current voice tops out

It is a Klatt-style source–filter built from Web Audio nodes, and the
architecture caps it whatever the tuning:

1. the source is one frozen `PeriodicWave` per villager; real fold vibration
   changes shape (open quotient, skew, return phase) with effort and pitch;
2. jitter and shimmer are lowpassed noise on `detune` and gain — smooth
   warble, not per-cycle roughness; creak is not period doubling;
3. the filter is a parallel bandpass bank with hand-set levels and nothing
   between the peaks (hence the `body` bypass hack);
4. consonants are 16 ms bandpass blips: no closure, no VOT, no aspiration
   coloured by the vowel, no turbulence made *at* a constriction;
5. no source–tract interaction (F1 moving with the open phase);
6. everything is at render-quantum resolution.

All six need the sample loop. That means an `AudioWorklet`, which the engine
already runs (`noise.ts`, `faust/processor.js`).

## 3. Architecture

Three layers, hard boundary between each:

```
writers        speech.ts (villager)  |  later: animal calls, laugh/sigh/grunt, song
                       │  Score / call description
client         audio/voice/Voice.ts   — turns a score into a gesture score,
                       │                posts it, reports unit timings
worklet        audio/voice/processor.ts — the throat. Physical parameters in,
                                          samples out. Knows nothing above it.
```

**One processor, ever.** Every voice type is an instance of the same
`VoiceProcessor` with a different *body preset* and a different *writer*. There
is no per-species `switch` in the DSP and no second worklet module. This is the
rule that keeps adding voices cheap (they are data) and avoids the shape of the
materials problem (many compiled programs).

The worklet's vocabulary is **physical only**: f0, Rd, loudness, breath, source
mode, velum, and articulator targets. It never receives "vowel a" or "bleat".
If a thing cannot be phrased physically it belongs in a writer.

## 4. The worklet (`src/audio/voice/processor.ts`)

Runs on the audio thread. No allocation and no throw in `process`
(one exception kills the node for good — same discipline as
`faust/processor.js`). Buffers sized at construction. Denormals flushed
(add and subtract a tiny constant in the delay lines). Output clamped to ±1.
When nothing is scheduled and the tract has rung down, `process` writes
silence and returns early: an idle instance is a function call.

Internal rate: the tract runs at 2× the context rate (Pink Trombone's
arrangement — two tract passes per output sample); the glottis at 1×.

### 4.1 Source

- **LF pulse** computed per sample from `(f0, Rd, amplitude)`. `Rd` is the one
  wave-shape control (Fant's transformed LF): low = tense/pressed, high =
  breathy/lax; it covaries open quotient, skew and the return phase, so
  spectral tilt follows effort physically. Range 0.3–2.7; villager baseline
  ~0.9–1.5. The LF cycle is evaluated by a closed form per sample (no table),
  with the period fixed at the cycle boundary.
- **Per-period randomness**, rolled once at each new cycle: jitter (period
  ±0.5–1 %), shimmer (amplitude ±3–5 %). Not applied within a cycle.
- **Drift**: 1/f-ish wobble on f0 from a smoothed random walk (Pink Trombone
  uses simplex noise for this), ~1–2 % over 0.5–2 s. Plus an optional slow
  tremor (4–7 Hz, ~1 %) for old voices. No sinusoidal flutter.
- **Modes**, as continuous amounts, not switches:
  - *modulated* — amplitude and f0 modulated at 15–40 Hz (bleat, purr, growl
    roughness);
  - *chaotic* — period doubling with alternating amplitude, plus raised jitter
    (creak, fry, bark, scream, a rasp).
- **Aspiration**: white noise × glottal opening (with a floor so there is
  always a little), lowpassed by a corner that rises with Rd, injected at the
  glottal end. This is Klatt's pulsed aspiration and it stays.
- **Airflow budget**: a breath reservoir that runs down while voicing or
  hissing and refills on an inhale; Rd rises and loudness falls as it empties.
  Long calls die naturally; the inhale gesture (§6.4) refills it.

### 4.2 Tract

Kelly–Lochbaum digital waveguide.

- `N` sections from a body preset (villager ~36–40 at 44.1/48 k → a shorter
  tube than Pink Trombone's 44; large animals 48–64). Length is where `tone`
  goes.
- Scattering `k = (A_n − A_{n−1}) / (A_n + A_{n−1})`, `A = d²`.
- Reflection at the glottis ~0.75, at the lips ~−0.85, both preset-tunable.
  Zero-area sections clamp to 0.999 to stay stable.
- Wall loss ~0.999 per section per pass (preset; higher = brighter, ringier).
- Diameters move toward targets by the articulator followers (§4.4) each
  block, then are linearly interpolated per sample so shape changes never
  step.
- **Turbulence**: at the narrowest section (and at the lips if they are the
  constriction), noise injected proportional to `flow × (1 − area/threshold)`
  when the area is under a threshold, bandpassed by where it is. This *is*
  frication and burst — a stop is a closure that opens; the release transient
  and the following aspiration fall out of the tube.
- **Radiation**: output is the lip pressure differentiated (one-pole highpass);
  a gentle lowpass above ~8 k for the head; the distance, room and rolloff
  stay with `Emitter`.

### 4.3 Nose

A second waveguide (~28 sections, preset) joined at a preset section
(villager: about 40 % along), with the **velum** as its opening diameter,
0 = sealed. Nasals, lowing, hums, and the leak that makes some voices a
little nasal. Its own lip-end reflection; sums into the output.

### 4.4 Articulators

Regions of the area function driven by **critically damped second-order
followers** (mass–spring, time constant 15–30 ms, preset per articulator).
Fast syllables therefore undershoot — reduction for free. Regions:

| articulator | what it moves | villager | sheep/cow | dog |
| --- | --- | --- | --- | --- |
| jaw | overall opening, front half | yes | yes | yes |
| tongue body | position + diameter (Pink Trombone's two-value hump) | yes | small | no |
| tongue tip | a narrow constriction near the front | yes | no | no |
| lips | last two sections | yes | no | fixed open |
| velum | nose opening | yes | yes | yes |
| glottis | see 4.1 | yes | yes | yes |

Which articulators exist and how fast they move is the preset. A future
people can have more (a trill is a tip oscillation; a click is a tip release
against a closed body).

### 4.5 Coupling

The first tract section's reflection is perturbed by the glottal opening
each sample (a few percent), so F1 shifts and widens in the open phase.
One multiply; audible.

### 4.6 Numbers to start from

Villager: N 38, glottal 0.75, lip −0.85, wall 0.999, nose 26 joined at 15,
f0 base 200–320 by identity, Rd baseline 1.0–1.4, jitter 0.7 %, shimmer 4 %,
drift 1.5 %, follower τ 20 ms (jaw 30, tip 12). These are starting points;
tuning is by ear from the world.

## 5. Protocol (client ↔ worklet)

Construction: `processorOptions: { body: BodyPreset }`.

Messages, all timestamped on the audio clock (`context.currentTime` seconds),
so a whole utterance is posted ahead and delivered sample-accurately:

```ts
interface BodyPreset {
  sections: number; noseSections: number; noseAt: number;
  glottalReflect: number; lipReflect: number; wallLoss: number;
  restShape: Float32Array;                // resting diameters
  articulators: Record<Articulator, { tau: number; range: [number, number] }>;
  f0: [number, number]; rd: [number, number];
  jitter: number; shimmer: number; drift: number; tremor: number;
  breath: number;                          // aspiration floor
}

type Track = 'f0' | 'rd' | 'loud' | 'breath' | 'velum' | 'modulate' | 'chaos'
           | 'jaw' | 'bodyPos' | 'bodyDia' | 'tip' | 'lips';

interface Key { t: number; v: number; curve?: 'step' | 'lin' | 'exp' }

/** A whole utterance: keyframes per track, interpolated per sample. */
interface Gesture { id: number; tracks: Partial<Record<Track, Key[]>> }

type ToWorklet =
  | { kind: 'gesture'; gesture: Gesture }
  | { kind: 'hush'; at: number; over: number }   // cancels everything after `at`
  | { kind: 'inhale'; at: number; depth: number };
```

Keys arriving for a time already past are applied at once. `hush` ramps
loudness and breath to zero over `over` and drops all later keys. The worklet
sends nothing back except an optional `{ kind: 'idle' }` after ring-down so
the client can retire the node.

## 6. The client (`src/audio/voice/Voice.ts`) and the villager writer

Replaces `oneshots/voice.ts` behind the **same `Voice` interface** —
`say`, `babble`, `hush`, `speaking`, `syllables`, `output`, `fire`,
`dispose` — so `Creature.ts` and `Emitter` do not change. `Utterance.units`
is still computed on the main thread from the score, so head and mouth timing
in `voiceNow` keeps working exactly as now.

`speech.ts` (scoring, `GREETINGS`, `babbleScore`, the little language) is
untouched. The client turns each `Syllable` into gesture keys:

### 6.1 Phonemes → gestures

- **Vowels** `a e i o u schwa`: jaw + tongue body (position, diameter) + lips
  targets. Five villager shapes tuned by ear against the formant tables in
  `formant.ts` as the reference, then discarded as targets — the tube decides.
- **Stops** by place: full closure (lips / tip / body) held 50–80 ms (longer
  for lips), release, then VOT 10–40 ms of aspiration before voicing; voicing
  during the closure for the "voiced" set at low loudness. The burst is the
  tube's, not a noise blip.
- **Nasals**: velum open, closure at lip or tip, voicing on; velum closes
  ~30 ms into the vowel. Coda nasal: the reverse.
- **Liquids/glides**: partial constriction with voicing, slower followers.
- **Breath (h)**: the vowel's shape with voicing off and aspiration high.
- **Fricatives** are now cheap (a narrow constriction). The little language
  has none on purpose; whether to add any is a call for the world, not the spec.

### 6.2 Prosody → tracks

Carried over from `voice.ts` and made physical: f0 line (declination, question
rise, lilt, stress lift; arrives at ~22 % of the vowel and holds to ~62 %),
loudness by stress, **Rd by effort** (down on the stressed syllable, up at
phrase edges), breath more at onsets and tails.

### 6.3 Identity

From `spec.seed + spot` as now: tract length (`tone` × identity), f0 base and
range, Rd baseline, jitter/shimmer/drift levels, velum leak, rate. Replaces
`Character` in `voice.ts`. Two villagers on one seed still differ by placement.

### 6.4 Voice-quality events

- creak (chaos up, Rd up, f0 low) over the last 100 ms of a settled statement;
- an audible inhale before any utterance longer than ~1 s;
- breath release at the end of a run of talk.

## 7. Later writers (not in this build, but the reason for the shape)

- **Animals**: sheep/cow/goat/dog move to presets + call writers when wanted;
  rhythm tables in `oneshots/animal.ts` are the writers already, and the
  "rhythm is the species" note there still holds. Fowl stay where they are.
- **Non-speech**: laugh (voicing pulses at 4–6 Hz with jaw open, rising Rd),
  sigh (aspiration with a falling f0 ghost), effort grunt (short, low Rd,
  chaos), gasp (inhale event, sharp).
- **Song/chant**: sustained f0 with slow vibrato, low jitter, long vowels.

## 8. Performance and scaling

- Real-time, per sample, nothing baked. Interruptible at any instant.
- Cost only for *speaking* mouths: est. 2–4 % of one thread per active voice
  on a desktop (≈ 40 sections × 2 passes × 2× oversampling plus a nose),
  effectively zero idle. Two or three at once is the realistic case.
- One module load at audio start (`addModule`, ~1 ms). Instances are a few
  `Float32Array`s: microseconds, no I/O, no warm-up hitch.
- Voice types are data; adding one costs nothing until it is spoken.
- Audio thread is separate from render; overload would be dropouts, not
  frame hitches, and the soundscape already runs a lot more than this there.
- Fallback: `addModule` can fail. Through phase 3 the old node-graph voice
  stays as the fallback and the A/B; phase 4 decides whether it goes.

## 9. Phases

Each phase ends with someone listening in the world; that report is the
ground truth. Nothing else measures anything.

1. **Scaffold + vowels.** Worklet, protocol, LF glottis with per-period
   jitter/shimmer and pulsed aspiration, KL tract + radiation, followers,
   villager preset. Existing scores drive it with vowels only and voicing
   on/off per syllable. This alone should stop it reading as a computer.
2. **Consonants.** Stops, nasals (nose branch + velum), liquids, h — as
   gestures; retire the burst hacks.
3. **Voice quality.** Rd by effort, drift, creak, inhale, breath budget,
   source–tract coupling.
4. **Identity and cleanup.** Identity mapping, per-villager tuning, decide
   the fate of the old model, `LIFE.md` and this file updated.

## 10. What the build settled that the spec left open

- **The worklet is `processor.js`, not `.ts`.** Vite serves a `?url` import
  verbatim, so a TypeScript worklet would reach `addModule` untranspiled —
  which is why `faust/processor.js` is plain JavaScript too. The types it is
  handed live in `body.ts` and never cross the boundary.
- **Scattering is in volume velocity, not pressure.** `k` at a junction is
  `(A_behind − A_ahead)/(A_behind + A_ahead)`, and the outgoing pair is
  `a − k(a+b)` forward, `b + k(a+b)` back. §4.2 stated the pressure-wave sign;
  the velocity convention is the one that goes with a glottal reflection of
  +0.75 and a lip reflection of −0.85, which §4.2 also quotes.
- **Radiation is a DC block and nothing else.** The LF waveform is already the
  derivative of glottal flow, and the tract is linear, so differentiating at
  the source and at the lips are the same differentiation. Doing it twice
  would tilt the whole voice up 6 dB an octave. Turbulence, which is injected
  inside the tube and misses that, is pre-emphasised where it is made.
- **Tract length is in centimetres, and the section count follows from it and
  the device's sample rate.** Fixing `N` instead would have made a villager a
  different size at 44.1 k and 48 k.
- **The area function is four blends, not a special case each.** Every
  articulator pulls the tube toward its own diameter over a raised-cosine
  window; a weight of one is that diameter exactly, so a closure really closes.
- **A gesture replaces the whole schedule and glides in from wherever the
  throat is.** The worklet keeps each track's value at the moment the gesture
  landed and interpolates from it to the first key, so cutting a villager off
  mid-word does not leave it holding the note it was cut on. That is what makes
  the `hush` before a new line unnecessary; `hush` remains for a real stop.
- **The tract shape is recomputed once a block and the reflections crossfaded
  across it**, rather than the diameters being interpolated per sample. Same
  result — no step — at a third of the cost.
- **Stops are all voiced.** `speech.ts` has one stop, not a voiced and a
  voiceless set, and b/d/g is the friendlier half. If the little language ever
  wants p/t/k it is one flag on the syllable and a longer VOT here.
- **The old model stays.** `createVoice` returns the throat when the module
  registered and the node-graph voice when it did not. Deciding to delete it is
  a call for the world, not the spec's.

## 11. Rules that apply here as everywhere

- **No checks.** No probes, no spectra, no listening scripts, nothing under
  `tools/`. Read the code, then listen in the world.
- **Comments short.** A line or three; the DSP gets a header where the
  algorithm needs one, no tuning history anywhere.
- One processor. Physical parameters only across the boundary. Writers above.
- Nothing allocates or throws in `process`.
- Never push or publish without being asked.
