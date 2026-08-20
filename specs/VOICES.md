# Voices: many throats, not one throat resized

Spec for making two creatures sound like two people rather than one person at
two sizes. Follows on from `VOICE.md`, which built the throat, and `PHONEMES.md`,
which gave the peoples different words. This one gives them different **throats,
mouths and habits** — the things that make a voice recognisable when the words
are the same.

Nothing here touches `processor.js`. Every knob below is either a `BodyPreset`
field the worklet already reads, or a number the writer already uses and would
now draw per creature instead of hardcoding. Presets and writers, never DSP
branches — the rule from `VOICE.md` §3 holds throughout.

**This is an options list, not a decision.** §5 numbers every axis so you can
strike the ones you do not want before anything is built. §12 is what only you
can settle.

## 1. Where it stands

| layer | file | knows |
| --- | --- | --- |
| language | `audio/speech/*` | letters, syllables, tunes, the lects, the banks |
| writer | `audio/voice/writer.ts` | who this one is, what a vowel is, what a closure is |
| body | `audio/voice/body.ts` | the tube this one has |
| throat | `audio/voice/processor.js` | tubes, folds, noise. No people at all |

What actually varies between two creatures today, in full:

| what | where | spread |
| --- | --- | --- |
| `rate` | `identity` | the lect's, 3.6–5.2 or 5.6–7.6 syll/s |
| `lengthCm` | `identity` | 14.2–18.2 cm, ÷ `tone` |
| `f0` | `identity` | ~0.9–1.3 × of a size-derived centre |
| `range` | `identity` | the lect's, 0.14–0.26 or 0.28–0.44 |
| `rd` | `identity` | ±0.12 of a size-derived centre |
| `breath` | `identity` | 0.03–0.07 |
| `velum` | `identity` | 0 – the lect's leak |
| `jitter` `shimmer` `drift` | `villagerBody` | narrow, ±0.006 to ±0.025 |
| `tremor` | `villagerBody` | a quarter of people get one |
| `air` `noiseSeed` | `villagerBody` | inaudible as identity |

That is the whole of it. Everything else about a throat is a constant shared by
every creature alive.

## 2. Why they sound like one person

Four reasons, and they compound.

**2.1 There is one axis of person.** `identity()` draws `size = hash(seed, 9)`
and then tract length, f0 *and* Rd are all functions of it
(`writer.ts:172-184`). Big → long → low → dark; small → short → high → bright.
One correlated axis, which is exactly the high-versus-deep being heard, and
there is no second one. Two creatures who happen to draw a similar `size` have
no other way left to differ.

**2.2 Everyone has the same mouth.** `SHAPES` in `shapes.ts` is one global
table, so every creature in the world has an identical `/a/`: the same jaw, the
same tongue position, the same lips. Formant *pattern* is what identifies a
speaker; formant *scale* only says how big they are. Right now the entire world
shares one pattern and only the scale moves — which is the same statement as
2.1 from the other end.

**2.3 Everyone has the same throat.** `restShape` is a hardcoded three-step
curve (`body.ts:125-130`), and `noseAt`, `noseShape`, `bodySpread`, `tipAt`,
`tipSpread`, `lipSections`, `wallLoss`, `glottalReflect`, `lipReflect` and
`turbulence` are the same numbers for every creature ever built. The only body
field that varies by people is `wallDamp`, and the only ones that vary by
creature are the wobbles.

**2.4 Everyone has the same delivery habits.** `declination` and `pauseScale`
are per-lect constants with no per-creature spread at all, and the prosody maths
is hardcoded world-wide: the accent peaks at 0.32 through every syllable
(`writer.ts:320`), the scatter is always ±0.07 (`:311`), loudness is always
`0.4 + 0.6 × stress` (`:296`), length always `0.55 + 0.45 × stress` (`:290`).
Two creatures say different words with the same rhythm underneath.

And the two peoples differ in words but barely in throat: `BODIES` in `body.ts`
is four numbers — `breathScale`, `wallDamp`, `tipTau`, `jawTau`.

## 3. What is already free

Read out of `processor.js`, not wished for.

- `restShape` is copied into `this.rest` at construction and is the base of
  every diameter the tube computes (`:361`). A per-creature rest shape costs
  nothing and changes the resonance of every sound they make.
- The jaw **scales** the rest shape from `p = 0.33` forward
  (`open = 0.55 + jaw × 0.85`), so the mouth's rest width and the jaw multiply.
- The body constriction pulls the tube toward `bodyDia` across a raised cosine
  of half-width `bodySpread`. Where there is no constriction the rest shape is
  the whole story — so a per-creature pharynx is at its most audible on front
  vowels, where the hump is nowhere near it.
- `lipSections`, `tipAt`, `tipSpread`, `noseAt`, `noseSections`, `noseShape`,
  `wallLoss`, `wallDamp`, `glottalReflect`, `lipReflect`, `turbulence`,
  `breathFloor`, `jitter`, `shimmer`, `drift`, `tremor`, `tremorHz` are all
  read per instance and none of them is assumed constant anywhere.
- Six of them (`wallLoss`, `glottalReflect`, `lipReflect`, `wallDamp`,
  `turbulence`, `rdBias`) are already live-tunable through `tuning.ts`, which is
  how the spreads below get set by ear.

Cost of the whole spec on the audio thread: **nil**. Same tube, same twelve
tracks, same key counts. It is all different numbers in the same fields.

## 4. Three seeds, not one

The single `size` draw is the root of §2.1. Replace it with three independent
draws, and make no axis depend on more than one of them:

| seed | governs | one sentence |
| --- | --- | --- |
| `size` | tract length, nose size, f0 centre | how big this person is |
| `source` | Rd, breath, jitter, shimmer, tremor, creak | what their folds are like |
| `setting` | the vowel space, the throat shape, delivery habits | how they hold their mouth |

A big person with a small bright voice, a small person with a slack dark one,
and a precise mumbler are all reachable the moment these are separate. They are
not reachable now at any seed.

Derived as three hashes of the same creature seed, so a creature is still one
number to the rest of the world and `Creature.ts` keeps passing what it passes.

## 5. The axes

Every row: what it is, which field it lands in, the spread, what it does to the
sound, and how strongly it moves the voice — **hard** is recognisable across a
room, **soft** is a shade you would only hear beside the same line from someone
else. Strike any row.

### 5.1 The throat — `body.ts`

| # | axis | field | spread | what it does | pull |
| --- | --- | --- | --- | --- | --- |
| 1 | `larynx` | where the steps in `restShape` fall | 0.10–0.24 / 0.22–0.36 | a high larynx is bright and forward, a low one plummy and dark. **Independent of length** — this is the second size axis §2.1 has never had | hard |
| 2 | `throat` | the pharynx diameter | 0.45–0.80 | narrow rings and sounds pressed; wide sounds open and round. Loudest on front vowels | hard |
| 3 | `mouth` | the front diameter | 1.30–1.70 | how much room the vowels have; interacts with the jaw, which scales it | med |
| 4 | `damp` | `wallDamp` | 0.42–0.74 | how fast the round trip dulls. Hard and ringy against soft and muffled | hard |
| 5 | `ring` | `wallLoss` | 0.9985–0.9995 | formant bandwidth. Piercing against fuzzy — the difference between a voice that cuts and one that sits back | med |
| 6 | `horn` | `lipSections` | 1–4 | how much of the front counts as lips, so how much a rounded vowel costs them | soft |
| 7 | `hump` | `bodySpread` | 0.20–0.32 | a broad tongue or a pointed one; changes how far a vowel colours its neighbours | soft |
| 8 | `nose` | `noseSections`, `noseAt` | ±15%, ±3 sections | a nasal-sounding person against a clear one, under the velum leak they already have | med |
| 9 | `hiss` | `turbulence` | 0.16–0.36 | some people spit their `s`. Also changes how much a stop's release cuts | med |
| 10 | `couple` | `glottalReflect` | 0.68–0.82 | source-tract coupling: body in the bottom of the voice | soft |
| 11 | `tipAt` | `tipAt` | 0.77–0.83 | where their tongue touches. A dental speaker and an alveolar one, for life, across every coronal they say | soft |

### 5.2 The source — `identity` and `body.ts`

| # | axis | field | spread | what it does | pull |
| --- | --- | --- | --- | --- | --- |
| 12 | widen `rd` | `rd` | ±0.28, **off `source`** | the brightness of the fold wave, cut loose from size. This alone doubles the space | hard |
| 13 | `rough` | `jitter`, `shimmer` | ×0.4 – ×2.2 | a clean voice against a rough one | med |
| 14 | `old` | `tremor`, `tremorHz` | a trait, not a die roll | a wavering voice, deliberately given rather than landed on by a quarter of people | med |
| 15 | `airy` | `breathFloor` | ×0.5 – ×2.5 | audible air behind everything they say | med |
| 16 | `creak` | writes `chaos` at phrase ends | 0 – 0.5 | a habitual creaky-voiced person. Costs two keys a phrase | med |

### 5.3 The setting — the vowel space, `writer.ts` over `SHAPES`

The largest gain in the spec, and the one that answers §2.2. Each is one
arithmetic pass over the shape a syllable is about to use, so it is a function
of five lines, not a second table.

| # | axis | applied to | spread | what it does | pull |
| --- | --- | --- | --- | --- | --- |
| 17 | `tongue` | `bodyPos` | ±0.08 | the whole vowel space shifted front or back. Everything they say is fronted, or everything is backed | hard |
| 18 | `open` | `jaw` | ×0.80 – ×1.25 | a mumbler against someone who opens up | hard |
| 19 | `round` | `lips` | ×0.85 – ×1.10 | habitual rounding, on every vowel including the unrounded ones | med |
| 20 | `lazy` | all four, toward `ə` | 0 – 0.25 | how far the vowels collapse toward the middle. A slack speaker against a precise one. **Very strong** — this is most of what "an accent" is | hard |
| 21 | `reach` | the follower `tau`s and the 0.03 approach | ×0.7 – ×1.4 | undershoot: how far the mouth gets before it has to move on. A fast talker never quite arrives | med |

Constraint: `NO_HISS = 0.55` is a floor for anything held, so 17–20 clamp
against it. A setting that pushed `bodyDia` or `lips` under the threshold would
lay a hiss over the vowel, which is a bug and not a voice.

### 5.4 The habits — `writer.ts`

| # | axis | field | spread | what it does | pull |
| --- | --- | --- | --- | --- | --- |
| 22 | per-creature `declination` | `Identity` | ±40% of the lect's | how far they run downhill across a sentence | med |
| 23 | per-creature `pauseScale` | `Identity` | ±30% of the lect's | how much room they leave between words | med |
| 24 | `punch` | the `0.4 + 0.6 × stress` at `:296` and the length at `:290` | ×0.6 – ×1.5 | even and level against strongly accented | hard |
| 25 | `peakAt` | the `0.32` at `:320` | 0.18–0.55 | where the accent peaks in the syllable. Late-peakers are heard as a different person saying the same tune. **Applies to the default contour only** — a written tone in `TONES` sets its own shape and overrides it | med |
| 26 | `wobble` | the `0.14` at `:311` | 0.06–0.22 | how much of their pitch is nobody's plan | soft |
| 27 | `tuneBias` | reweights `lect.tunes` | ±1 weight | one who questions everything, one who states | soft |

### 5.5 What that comes to

Eleven axes marked **hard** or **med** in the throat and setting groups alone,
each with three or more steps you could pick out in a line-up. The count is not
the constraint. **Decorrelation is** — §4 is what makes the difference between
twenty voices and one voice with twenty settings.

## 6. The two peoples get different throats

§2 applies to the lects as much as to individuals. `BODIES` grows from four
numbers to a character, and each lect states a *region* of §5 rather than a
point — the per-creature draw then happens inside its people's region.

| | country | city |
| --- | --- | --- |
| larynx | low | high |
| throat | wide | narrow |
| damp / ring | lossy, soft | ringy, hard |
| hiss | little | a lot |
| airy | more | less |
| setting | open, backed, lazier | closed, fronted, precise |
| habits | shallow punch, long pauses | hard punch, short pauses, late peak |

Read as: dark, soft, open, unhurried against bright, hard, forward, clattering.
Which is the same reading as their inventories in `PHONEMES.md` §5, arrived at
through the body instead of through the chart.

## 7. Characters

Widening the spread buys **variety**. It does not buy **identity**: a randomly
drawn voice is not recognisably *that person*, and 10–20 named NPCs need to be
the same voice every time they are met.

So a second, authored path, in the spirit of `PEOPLE` in `figure-people.ts`:

```ts
export interface Character {
  lect: LectName;
  /** Any axis of §5, stated. Anything omitted is drawn from the lect's region. */
  ...Partial<all of the above>
}
export const VOICES: Record<string, Character> = { /* empty until you fill it */ };
```

and `VoiceOptions.character?: string`, which takes precedence over the draw. A
crowd villager passes a seed and gets a draw; a named NPC passes a name and gets
themselves.

Partial is the important word: a character states the two or three axes that
make them, and everything else still comes from their people. That is how a
character reads as one of the cityfolk *and* as themselves.

### 7.1 What a row holds

- `lect`, required. A character is one of a people before they are themselves.
- Any axis of §5, stated. Anything left out is drawn from the people's region.
- `size`, `f0`, `rate` and `range` are statable too, so a character can be a
  large slow one without going through `tone`.
- A one-line note saying what you should hear. It is the only way to tell later
  whether a row still does what it was written to do.

**The seed still moves what the row does not state.** Five guards on one
character sound like five guards rather than one guard five times, and a row
with three axes stated is a *kind of voice*; a row with ten is a *person*. Both
are useful and the same mechanism gives you both.

### 7.2 The table wants to span, not to fill

A table of fifteen entries that all sit in the middle is worth less than six
that sit in six different corners. So each row should **own at least one axis at
an extreme that no other row takes** — that is what makes it recognisable rather
than merely different.

A row also earns identity by how far it sits from its own people. A soft, slow,
warm cityfolk is memorable precisely because the cityfolk are hard and quick;
the contrast with §6 is doing as much work as the numbers are.

### 7.3 Fourteen to start

Ideas, not decisions — the handles describe a sound, not a person, and the
fiction stays yours. Seven of each people, each owning a different corner.

**Country**

- **`elder`** — `old` on, size long, f0 low, `rough` ×1.8, `lazy` 0.20,
  `punch` ×0.7, pauses ×1.4.
  *Slow and frail, the pitch wavering and running downhill.* Owns `old`.
- **`bellows`** — `throat` 0.78, `mouth` 1.68, `larynx` low, `rd` +0.15,
  `open` ×1.2, `punch` ×1.4.
  *Booming and cavernous, hearty, more room in the throat than anyone.* Owns
  the wide throat.
- **`reed`** — `throat` 0.47, `larynx` high, `nose` +15%, velum high, f0 high,
  `ring` 0.9993.
  *Pinched and buzzy, everything coming down the nose.* Owns nasality.
- **`sigh`** — `airy` ×2.4, `rd` +0.25, `punch` ×0.7, `wobble` 0.18,
  `rough` ×0.6.
  *Breathy and tired, half of every word unvoiced.* Owns air.
- **`gravel`** — `creak` 0.45, `rd` −0.22, `rough` ×2.0, f0 low, `punch` ×1.2.
  *Rasping and ground down, the folds barely holding a note.* Owns roughness.
- **`mumble`** — `lazy` 0.25, `open` ×0.82, `tongue` −0.07, `reach` ×0.75,
  `punch` ×0.7.
  *Swallows every word; the vowels never leave the middle.* Owns the collapsed
  vowel space.
- **`piping`** — size short, `larynx` high, f0 high, `damp` 0.44, `ring` high,
  `lazy` 0.04, rate high, range wide.
  *Small, quick and forward, bright enough to cut through a crowd.* Owns the
  high larynx.

**City**

- **`herald`** — `punch` ×1.5, `ring` 0.9994, `damp` 0.45, `peakAt` 0.50,
  range wide, `lazy` 0.02.
  *Declaims. Carries across a square whether or not anyone asked.* Owns
  loudness and projection.
- **`clerk`** — `lazy` 0.02, `reach` ×1.35, rate high, `punch` ×0.65,
  range narrow, `declination` low, `wobble` 0.06.
  *Rattles off a list, every consonant landed, none of them meant.* Owns
  precision and flatness at once.
- **`sneer`** — `round` ×1.08, `tongue` +0.07, `nose` +10%, `peakAt` 0.52,
  `declination` low, `tuneBias` toward question.
  *Drawling and superior; the accent arrives late in every syllable.* Owns the
  late peak.
- **`whistle`** — `hiss` 0.36, `tipAt` 0.83, `ring` high, `airy` ×1.6.
  *Spits every `s`. The sibilants whistle and the stops cut.* Owns turbulence —
  the one row that exercises an axis nothing else touches.
- **`iron`** — `rd` −0.25, `throat` 0.50, `damp` 0.72, f0 low, `punch` ×1.4,
  `creak` 0.30, `wobble` 0.05, pauses ×0.7.
  *Clipped, pressed and cold. Says less than it means to.* Owns the pressed
  fold.
- **`fluster`** — rate max, `reach` ×0.72, `wobble` 0.22, range wide,
  `punch` ×1.2, `airy` ×1.5, pauses ×0.6.
  *Gabbling and nervous; the mouth is always a syllable behind.* Owns
  undershoot.
- **`velvet`** — f0 low, `throat` 0.72, `rd` +0.20, `round` ×1.06,
  `punch` ×0.7, rate low, pauses ×1.3, `damp` 0.70.
  *Smooth, unhurried, expensive — and the only cityfolk who is none of those
  things their people are.* Owns the contrast with §6.

Coverage, as a check on the set: `old`, wide throat, nose, air, roughness, the
collapsed vowel space, the high larynx, projection, precision, the late peak,
turbulence, the pressed fold, undershoot and lect-contrast. Fourteen corners,
no two rows leaning on the same one.

### 7.4 Two decisions in the table

- **Ships empty, or ships with §7.3?** Empty is the honest default and matches
  `PHONEMES.md` §12.2 on lect names. Shipping these means the mechanism is
  audible the day it lands and you edit from something rather than from nothing.
- **Do characters inherit?** A `from: 'clerk'` field would let a row be a
  variation on another. Probably not worth it at fifteen rows; worth it at
  fifty. Not proposed.

## 8. Plumbing

Small, and mostly already there.

- `VoiceOptions` gains `character?: string`. `seed`, `tone`, `pitch`, `lect`
  keep their meanings exactly.
- `identity()` takes the lect's region and the three seeds; returns an
  `Identity` widened by §5.2–5.4.
- `villagerBody()` takes the same and returns a `BodyPreset` varied by §5.1. Its
  `kind` parameter becomes the lect's region rather than a key into four numbers.
- One new module for the axes themselves — a `Character`, the draw, and the
  region merge — so neither `writer.ts` nor `body.ts` grows a second job.
- `LifeSpec` gains `character?: string` beside `lect`, and `figure.ts` may set
  it. Nothing in `Creature.ts` changes except passing it through.
- The debug label already prints the lect; it prints the character name too when
  there is one.

## 9. File layout

```
audio/voice/
  character.ts   NEW — the axes, the regions, the draw, the VOICES table
  body.ts        varies the tube by a Character instead of by four constants
  writer.ts      identity() widened; the setting applied over SHAPES
  types.ts       VoiceOptions.character
  Voice.ts       passes it down
```

## 10. Phases

Each ends with someone listening in the world. Nothing else judges anything.

1. **Three seeds.** §4 only. `size` splits into `size`/`source`/`setting` and
   `rd` comes off `source`. Nothing else changes. This alone should be audible,
   and it is the cheapest test of whether the diagnosis in §2.1 is right.
2. **The throat.** §5.1. `restShape` becomes a function of `larynx`, `throat`
   and `mouth`; the rest of the body fields get their spreads. The tube stops
   being one tube.
3. **The setting.** §5.3. The vowel space moves per creature. Expect this to be
   the phase where the world stops sounding like one actor.
4. **Source and habits.** §5.2 and §5.4. The wobbles, the punch, the peak.
5. **The peoples.** §6. The two lects claim their regions and the galleries
   should now differ before a word is understood.
6. **Characters.** §7. The table, the option, the plumbing — shipped empty.

Phases 1–4 are per-creature and judged in a crowd. Phase 5 is judged by standing
`gallery-villager` next to `gallery-cityfolk`. Phase 6 is judged when you fill
the table, not before.

## 11. Risks

- **A spread that leaves the physical range.** A narrow enough pharynx or a
  wide enough spread crosses `NO_HISS`, or drives a reflection coefficient near
  unity, and the voice buzzes or whistles. Every spread in §5 is stated as a
  range for that reason and each clamps at its end. If one of them sounds broken
  at an extreme the range is wrong, not the axis.
- **Decorrelation undone by accident.** Any axis written as a function of two
  seeds collapses the space back toward §2.1 without looking like it has. One
  seed each.
- **Character drift.** A creature's voice is built once and kept for life
  (`Creature.ts:714`), and the seed includes where it stands. That is already
  true and must stay true — a voice that changes when a creature moves is worse
  than a voice that is shared.
- **Too much variety.** A world where every voice is maximally different is as
  wrong as one where they are all the same, and reads as a cast of cartoons. The
  lect regions in §6 are the guard: a people should be a recognisable sound
  before an individual is.
- **How any of it gets heard.** The two galleries and a walk through the
  village. **No voice gallery, no comparison tool, no probe, nothing under
  `tools/`.** An axis that cannot be judged from a row of figures is an axis
  that goes.

## 12. For you to settle

1. **Which axes.** §5 is numbered so rows can be struck. My own cut, if you want
   one: keep 1, 2, 4, 12, 17, 18, 20, 24 and treat the rest as optional.
2. **The characters table.** Whether §7 is in this piece of work or a later one,
   whether `VOICES` is keyed by a name or by something in the fiction, and which
   of the fourteen in §7.3 survive. They are sounds with placeholder handles —
   who in the world has any of these voices is not proposed and is not mine to
   propose.
3. **How far the two peoples are apart** in §6 — the table is written as a
   strong split and could be halved.
4. **Whether `tone` keeps its meaning.** It is set from the figure's stature in
   `figure.ts:279` and shortens the tract. It could stay as it is, or become one
   input to `size` among several.
5. **Names.** `larynx`, `lazy`, `punch`, `reach` and the rest are placeholders
   picked to be readable in a table. All yours.
