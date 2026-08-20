# Music director — research findings and plan

Answer to `MUSIC-RESEARCH.md`. Written plan with options; no code changes made.

Every number below came from a measurement pass over the current director, not
from reading it. The harness is
`%TEMP%\claude\C--Git-hswow-net\<session>\scratchpad\measure.ts` and `bench.ts`,
bundled with esbuild and run under node; rerun instructions at the end.

---

## What the measurements say

**Harmony is flat, and measurably so.** Scoring the ground loops with Lerdahl's
chord distance rule (`d = j + k`; `j` = circle-of-fifths steps between the two
roots, `k` = non-common pitch classes across basic-space levels a–c — level d,
the mode, cancels because both chords share it):

| | |
|---|---|
| chord moves measured (home + away, all 22 vibes) | 104 |
| distinct distances **within** a vibe | 1 or 2 (11 vibes have exactly 1) |
| distinct distances across the whole book | 6 of the rule's 14 |
| mean / sd | 6.46 / 2.08 |
| correlation with the tension arc | 0 by construction — the chord is `ground[bar % len]` |

Eleven vibes move by exactly one distance for a whole piece. The tension arc
cannot be spent harmonically because there is nothing to spend.

**The pad wastes half its motion.** Simulating `fireDrone`'s voicing dice over
4378 firings: mean displacement between consecutive firings is **8.77
semitones**; the nearest voicing of the same chord would move **4.64**. 47% of
the pad's movement is the re-voicing dice, not the harmony. Mean 2.15 voices per
firing, 18.3% bare root. Zero thirds, zero sevenths in 22/22 vibes.

**The melody is never listened to.** Scoring generated statements with
Schellenberg's two-factor simplification of Narmour (proximity β≈0.60, reversal
β≈0.38):

| op | mean proximity (0–6) | mean reversal | leaps >4 st per statement | widest |
|---|---|---|---|---|
| plain | 3.46 | 0.18 | 1.33 | 11 st |
| sequence | 3.33 | 0.14 | **2.38** | **14 st** |
| inversion | 3.47 | 0.10 | 1.27 | 12 st |
| fragment | 3.32 | 0.16 | 1.33 | 11 st |

`patterns.melodyCell` enforces a 9-semitone span (`CONNECT`) so any permutation
connects — and then `applyOp('sequence')` re-widens it to 14 and doubles the
leap count. Nothing reads the result.

**The gait vocabulary is unsyncopated.** Longuet-Higgins & Lee syncopation of
the seven cells (weights 0/−1/−2/−3/−4 at bar/half/beat/eighth/sixteenth):
`even` 0, `dotted` 0, `short-short-long` 0, `lilt` 0, `snap` 2, `aksak` 2,
`crooked` 2. Accent is a constant per step and never reads bar position or the
chord.

**Pulse-free is structurally poorer, by count.** A pulsed bar can apply eight
mechanisms (rhythm cell, accent, subdivision at tension ≥0.7, split-step
call-and-response, suspension over a chord change, night half-time, kit, melody
steps from the cell). A pulse-free bar applies **none of them** — `fireFigure`
returns before all eight. It has three things: a slot count fixed by bar length,
the ostinato order, and the mutation timer.

| | pulsed (13) | pulse-free (9) |
|---|---|---|
| chord changes per minute | 10.06 | **3.81** |
| bars in a piece | 15–31 | 7–14 |
| can ever reach the four-section form | yes | **never** (needs 24 bars; max is 14) |

**The 22 vibes differ where it is cheap and agree where it matters.** 22 distinct
palettes, 12 modes, 10 gait sets, 7 densities — and **2 tension vectors** and
**1 section plan** for all of them.

---

## What the reading changed

- **Neo-Riemannian theory does not apply here, and should be dropped.** P, L and
  R are defined on consonant triads and all three are moves *of the third*. The
  grammar has no thirds in 22/22 vibes. The two things worth taking from that
  literature are (a) chord distance as a metric and (b) parsimony — and both are
  better served by Lerdahl's basic space (works on any pitch-class set) and by
  plain minimal-displacement voice leading (Tymoczko), which need no triad.
- **Lerdahl's chord distance collapses to something almost free in this system.**
  Because every chord is a root and a fifth over a shared mode, `k` only ever
  counts levels a–c, and the whole rule is a 12×12 integer table per mode: 29 µs
  to build from scratch, or a constant.
- **Lerdahl's melodic attraction rule is the missing melody input.**
  `α(p1→p2) = (s2/s1)·(1/n²)`, `s` = anchoring strength by depth in the basic
  space, `n` = semitone distance. For a root-and-fifth chord over a mode the
  strengths fall out as root 4, fifth 3, other mode degrees 1 — and the third
  being weakly anchored *is* the modal ambiguity the design already wants.
- **Narmour's closure conditions are a checklist the director already half
  implements** — rest, strong beat, longer duration after shorter, large
  interval into small, direction change. `periodFrom` gets two of five right by
  construction, and loses them the moment an op is applied.
- **Schoenberg's sentence needs nothing new.** Presentation → continuation
  (fragmentation + *harmonic acceleration*) → cadence maps onto `fragment`,
  `chordBars` and `cadenceApproach`, all of which exist.
- **Eno's tape-loop trick is the answer for pulse-free.** *Music for Airports*
  is loops of 23.5 / 25.875 / 29.9375 s that never re-align. Incommensurable
  periodic streams are structure without a grid — exactly what the nine
  pulse-free vibes are missing, and they cost one clock, not two.
- **Game audio's transition practice is exit-cue-plus-transition-segment, not
  crossfade.** The director already has the exit cue: the bar line.

---

## Proposals, ranked by intelligence bought per unit of risk

Risk is measured against the 22 vibes that already sound right. Every proposal
is checked against **nothing drones alone** — noted per item.

### 1. Harmonic distance as a real quantity — `harmony.ts`, `director.fireBar`

**Highest ratio on the list.** Add `chordDistance(x, y, mode)` (the `j + k`
rule) and let the bar's chord be chosen to *hit a distance target* set by the
section's tension, instead of read from `ground[bar % len]`.

Options, cheapest first:

- **(a) Re-order, don't re-write.** Keep every ground loop exactly as written;
  choose which of the mode's loops a section uses, and in which rotation, so the
  distance profile rises toward the peak and falls at the cadence. Same chords,
  same vocabulary, different sequence. *Risk: low.*
- **(b) Distance-targeted selection.** Build the candidate set once per mode
  (degrees that keep a perfect fifth above them), and pick the bar's chord as
  the candidate whose distance from the current chord is nearest the section's
  target, with the ground loop as the prior and the tie-break. *Risk: medium* —
  chords appear that no ground book contains. Mitigate by keeping the loop as a
  hard fallback for A sections and letting B sections roam.
- **(c) Harmonic rhythm as a variable.** `chordBars` becomes a mean rather than
  a constant, shortening through a section's continuation and doubling at the
  cadence (which `penult` already does for one bar). This is Schoenberg's
  harmonic acceleration, and it is the single change that would most help the
  nine pulse-free vibes at 3.81 chord changes per minute. *Risk: medium* — it
  moves the felt pace of every vibe.

**Cost:** a 12×12 `Int8Array` per mode. 29 µs to build, once. Nothing per note.
**Measure:** rerun §1. Targets — distinct distances within a vibe ≥ 4 (from 1–2);
Pearson correlation between a bar's section tension and its chord distance > 0.5
(from 0); the distance at the final cadence in the bottom quartile of the piece.
**Drone check:** improves it — more chord changes means more pad re-firings.

### 2. Nearest-voicing pad — `director.fireDrone`

Keep the dice that choose *how many* notes and *which* register the chord sits
in; place each note in the octave nearest the previous firing rather than at a
fixed offset from the bass.

- **(a) Nearest voicing.** Measured waste is 4.13 semitones per firing. *Risk:
  very low* — the chord, the voice count, the bare-root frequency and the
  velocity wobble are all untouched; only octave placement changes.
- **(b) Common-tone retention.** In this grammar a plagal move shares a pitch
  class by construction (the fifth of `x` is the root of `x+5`). Hold that tone
  in the same octave, move the other voice by step. Parsimony without a triad —
  and it makes the plagal cadence audibly a cadence. *Risk: low.*
- **(c) Add the third, rationed.** Would open voice leading properly and would
  also decide major/minor under the melody, which the design refuses on purpose.
  **Owner's call — not proposed.**

**Cost:** 0.16 µs per firing. **Measure:** rerun §2. Target — actual displacement
within 15% of the nearest-voicing ideal; bare-root rate unchanged at ~18%.
**Drone check:** a pad that moves by step reads as motion, not as a held tone.
This is a direct mitigation, and worth doing for that reason alone.

### 3. Give the melody a listener — `patterns.ts`, `director.fireStatement`

Score candidates with proximity + reversal and pick, rather than transform and
play.

- **(a) Repair, not reject (recommended).** Re-apply `melodyCell`'s own
  invariant — one leap, then steps recovering against it, whole cell inside
  `CONNECT` — after every `applyOp`. That single rule takes `sequence` from 2.38
  leaps and 14 st back to the plain head's 1.33 and 11 st, and it is the rule the
  file already believes in. *Risk: low.*
- **(b) Threshold filter.** Score the op'd head; if it falls more than a margin
  below the plain head, re-roll the op from the seeded dice (still reproducible).
  *Risk: low*, but it can silently collapse to `plain` — cap the retries.
- **(c) Closure scoring.** Score phrase *endings* against Narmour's five closure
  conditions and require the consequent to close and the antecedent to fail to.
  `periodFrom` does this for the head's tail; the win is doing it after
  development and after the bridge's `lift`. *Risk: low-medium.*
- **(d) Attraction-led continuation.** Choose each next degree by Lerdahl
  attraction toward the chord's anchored tones (root 4, fifth 3, rest 1), rather
  than stepping a stored contour. *Risk: high* — it would replace the motif with
  a walk, and motif identity per zone is the thing that makes a place a place.
  Listed for completeness; do not do it.

**Cost:** 0.11 µs per candidate; a 24-phrase search is 1.2 µs.
**Measure:** rerun §3. Targets — mean proximity ≥ 4.2/6 (from ~3.4); `sequence`
leaps ≤ `plain`; widest interval ≤ 9 st, i.e. back inside `CONNECT`.
**Drone check:** neutral.

### 4. A structure for pulse-free — `director.fireFigure`, `vibes.ts`

Nine vibes, zero of eight mechanisms, and a form they can never complete.

- **(a) Incommensurable streams (recommended).** Replace the single jittered
  slot walk with 2–3 concurrent streams whose periods are mutually incommensurable
  (e.g. 4.7 / 6.1 / 7.9 s), each stepping the ostinato at its own offset, all
  still placed inside `fireBar` from the bar's own length. Structure without a
  grid; the streams interleave by construction, so the bar is never bare. *Risk:
  low-medium* — it changes the texture of all nine, but in the direction the
  last three rounds of complaints were pointing.
- **(b) Grouping hierarchy in the breath bar.** Make a breath bar 2–3 gestures
  with a strong/weak profile, so tension can be spent as gestures-per-bar the way
  a pulsed bar spends subdivision. GTTM's grouping preference rules inverted;
  no metre required. *Risk: medium.*
- **(c) Shorten the breath bar.** 8–13 s → 5–8 s roughly doubles a pulse-free
  piece's bar count, which brings the four-section form and the whole tension arc
  within reach for the first time. One constant. *Risk: medium* — it changes the
  harmonic pace of nine vibes, and that is an ear judgement, not a measurement.
- **(d) A silent grid used only for placement.** Rejected: a grid that decides
  placement is audible as a grid.

**Cost:** nothing measurable — the work is per bar, and a bar is 8–13 s.
**Measure:** rerun §5. Targets — mechanisms reached per pulse-free bar ≥ 4 (from
0); longest bare-of-texture stretch still under `FLOAT_GAP`; chord changes per
minute ≥ 6 (from 3.81).
**Drone check:** this is the proposal the constraint most depends on. Any
version must keep the "no stretch longer than `FLOAT_GAP`" property that the
current slot walk guarantees — with three streams that is a stronger guarantee,
not a weaker one, but it has to be asserted, not assumed.

### 5. Accent that means something — `rhythm.ts`

- **(a) Derive accent from metric weight** (0/−1/−2/−3/−4 at bar/half/beat/
  eighth/sixteenth) instead of storing it per step. Accent then survives
  `subdivide()` correctly, which today it does not — a subdivided cell inherits
  its parent's accent and loses the metrical hierarchy entirely. *Risk: very
  low.*
- **(b) A syncopation target per vibe.** Score the gait pool with LHL and pick
  the section's cell nearest a target the tension arc can raise. Adds one number
  to `MusicCharacter` — 22 hand-set values, and a new gait or two, since the
  current pool tops out at 2. *Risk: medium* — this is the vibes' walk.
- **(c) Accent follows harmony.** Raise the accent on the onset nearest a chord
  change. Pairs with proposal 1. *Risk: low.*

**Cost:** free — a lookup. **Measure:** rerun §4; report the syncopation actually
played per section, and check that subdivision no longer flattens the weights.
**Drone check:** neutral.

### 6. A second phrase form, and a form grammar — `director.buildSections`

- **(a) Schoenberg's sentence beside the period.** Presentation (basic idea +
  repetition), continuation (fragmentation + harmonic acceleration), cadence.
  Every part exists: `fragment`, `chordBars`, `cadenceApproach`. A per-vibe
  choice of period vs sentence would be the first *structural* difference
  between the 22. *Risk: medium* — new phrase shapes in vibes that already work.
  Mitigate by making it opt-in per vibe rather than a dice roll.
- **(b) SPEAC as the section grammar.** Replace `['A','A','B','A']` plus two
  hard-coded tension vectors with a grammar over statement / preparation /
  extension / antecedent / consequent, whose stability order (A < P < E < S < C)
  *produces* the tension target instead of declaring it, and whose one hard rule
  — an antecedent must eventually reach a consequent — produces the arc. Seeded
  per vibe, so a place's form is its form. *Risk: high.* This is the machinery
  all 22 share; it should be last, and behind a per-vibe opt-in.
- **(c) Per-vibe tension vectors.** Trivial, low gain, and it buys the *look* of
  differentiation without any new intelligence. Mentioned only to be dismissed.

**Cost:** free. **Measure:** rerun §6 — distinct section plans and tension
vectors across the book; plus statements per piece and mean statement length,
which is what a sentence should visibly change.
**Drone check:** a sentence's continuation is denser than a period's, so it
helps; SPEAC needs the check because a `P` section is by definition thin.

### 7. Border transitions — `director.setZone`

Game practice is exit cue + transition segment, not a gain crossfade. The
director already has the exit cue: the bar line. Option — hold the outgoing rack
to the end of the current bar and let the new key enter on the next downbeat,
through the approach chord. *Risk: low, gain small.* Ranked last because the
crossfade is already the thing that makes shared racks work.

---

## Not worth doing, and why

- **Neo-Riemannian P/L/R** — needs triads; there are none. See above.
- **Variable-order Markov / factor oracle (OMax, SoMax)** — learns from a corpus
  this project does not have and never will, and its state is a growing suffix
  automaton, so reproducibility from `spec.seed` would have to be re-established
  on every visit. The seeded-material constraint is not negotiable and this
  fights it directly.
- **Full GTTM time-span and prolongational reduction** — an analysis of an
  existing score. The director has no score to reduce. The generative half of
  GTTM is the preference rules, which is proposals 5(a) and 4(b).
- **Huron's ITPRA as a mechanism** — the right frame for *why* proposals 1 and 3
  work (tension is earned by managing what the listener predicts), but it
  prescribes no arithmetic. Read it as the argument, not as a spec.

---

## Suggested order

1 (a) → 2 (a) → 3 (a) → 5 (a) are all low risk, and each has a measurement that
either passes or does not. That block is the honest first pass. 4 is the biggest
single win but touches nine vibes' texture, so it wants its own round with the
owner's ear on it. 1 (b/c), 6 (a) and 6 (b) are the sophistication the brief is
actually asking for, and each should wait until the block before it has been
listened to.

## Phases

Continuing from 6m, the last music phase in the tree. Each phase is one
listening decision, carries its own pass/fail measurement, and leaves the 22
vibes playable if the work stops there.

**6n — Pad voice leading.** Proposal 2 (a) and (b). `fireDrone` places each note
in the octave nearest the last firing and holds the common tone across a plagal
move. Same chord, same voice count, same bare-root rate, same velocity wobble.
*Files:* `director.ts`. *Measure:* §2 — actual displacement within 15% of the
nearest-voicing ideal, bare-root rate unchanged. First because it is the lowest
risk on the list, and because a pad that moves by step is a real mitigation for
*nothing drones alone*.

**6o — Melody invariant.** Proposal 3 (a) then (c). Re-apply `melodyCell`'s
leap-then-recover rule and the `CONNECT` span after every `applyOp`, then check
closure after development and after the bridge's `lift`. *Files:* `patterns.ts`.
*Measure:* §3 — `sequence` leaps ≤ `plain`, widest ≤ 9 st, mean proximity ≥ 4.2.

**6p — Accent means metrical position.** Proposal 5 (a) and (c). Accent derived
from metric weight rather than stored per step, so `subdivide()` stops
flattening the hierarchy; accent raised on the onset nearest a chord change.
Touches the 13 pulsed vibes only. *Files:* `rhythm.ts`. *Measure:* §4.

**6q — Harmonic distance.** Proposal 1, in three steps, each its own listen:
(1) the distance table plus re-ordering the existing ground loops so the profile
follows the arc — same chords, no new vocabulary; (2) harmonic rhythm as a
variable; (3) optionally distance-targeted selection, the first step that puts
chords in a piece no ground book contains. Stopping after (1) or (2) is a valid
end. *Files:* `harmony.ts`, `director.ts`. *Measure:* §1 — distinct distances per
vibe ≥ 4, tension/distance correlation > 0.5.

**6r — Pulse-free structure.** Proposal 4 (a), then (c) as a separate decision.
Nine vibes, and the area that has already cost three rounds — it wants its own
round, not a shared one. *Files:* `director.ts`, `vibes.ts`. *Measure:* §5 —
mechanisms per pulse-free bar ≥ 4, chord changes ≥ 6/min, and an assertion that
no stretch exceeds `FLOAT_GAP`.

**6s — Phrase form and form grammar.** Proposal 6, in two steps, each its own
listen. (1) Schoenberg's sentence beside the period, opt-in per vibe rather than
a dice roll, so a complaint points at one vibe. (2) SPEAC replacing the fixed
A A B A and its two tension vectors, seeded per vibe, opt-in — the machinery all
22 vibes share, so it goes last and stopping after (1) is a valid end.
Proposal 7's bar-line border transitions fold in here. *Files:* `director.ts`,
`vibes.ts`. *Measure:* §6 — statements per piece, mean statement length, and
distinct section plans and tension vectors across the book.

Verification is the same every phase: `npx tsc --noEmit`, `npm run check:audio`,
and the relevant `measure.ts` section run before and after.

## Reruns

```
npx esbuild <scratchpad>/measure.ts --bundle --platform=node --format=esm \
  --outfile=node_modules/.cache/measure.mjs && node node_modules/.cache/measure.mjs
```

`measure.ts` imports project modules by absolute path and prints the seven
sections quoted above. `bench.ts` prints the per-bar cost of every proposed
computation; all of it is under 30 µs against a bar of 3.2–13 s.

---

## Sources

- [Tonal Pitch Step Distance (de Haas, Veltkamp, Wiering, ISMIR 2008)](https://archives.ismir.net/ismir2008/paper/000252.pdf) — the chord distance rule in implementable form
- [Modeling Tonal Tension (Lerdahl & Krumhansl)](https://static1.squarespace.com/static/58812885e6f2e1da63d1291b/t/589177f3f7e0abd41ebd1e75/1485928480330/Modeling+Tonal+Tension.pdf) — basic space, attraction rule, surface dissonance
- [Lerdahl's Surface Tension Rule (Henry, PhD thesis, York)](https://yorkspace.library.yorku.ca/server/api/core/bitstreams/66f8ed55-8b38-4784-9606-41b532f64e7b/content) — the rules restated with all values
- [Narmour's I-R model reviewed (Royal, MTO 1.6)](https://mtosmt.org/issues/mto.95.1.6/mto.95.1.6.royal.html) — archetypes, interval thresholds, the five closure conditions
- [Simplifying the Implication-Realization Model (Schellenberg)](https://www.semanticscholar.org/paper/Simplifying-the-Implication-Realization-Model-of-Schellenberg/3e1e3a8e51792291f0da2b93af2bc388aebc3b8c) — the two-factor model and its weights
- [Narmour's own summary of the I-R model](https://web.sas.upenn.edu/enarmour/the-implication-realization-model/)
- [Neo-Riemannian Triadic Progressions (Open Music Theory)](https://viva.pressbooks.pub/openmusictheory/chapter/neo-riemannian-triadic-progressions/) — why P/L/R needs a third
- [The Geometry of Musical Chords (Tymoczko)](https://dmitri.mycpanel.princeton.edu/voiceleading.pdf) — voice-leading distance without triads
- [Cope's SPEAC, described](https://esf.ccarh.org/CS275B-Mus254/02b_Cope1-2023.pdf) and [implemented](https://github.com/HeinrichApfelmus/david-cope-cmmc/blob/master/speac-chapter-7/speac-analysis.lisp)
- [The sentence (Open Music Theory)](https://openmusictheory.github.io/sentence) and [A Taxonomy of Sentence Structures](https://symposium.music.org/index.php/54/item/10629-a-taxonomy-of-sentence-structures)
- [The Study of Syncopation using Inner Metric Analysis (JNMR)](https://webspace.science.uu.nl/~veltk101/publications/art/JNMR08.pdf) and [An Experimental Comparison of Formal Measures of Rhythmic Syncopation](https://www.researchgate.net/publication/279235158_An_Experimental_Comparison_of_Formal_Measures_of_Rhythmic_Syncopation) — the LHL weights
- [Deconstructing Music for Airports (Reverb Machine)](https://reverbmachine.com/blog/deconstructing-brian-eno-music-for-airports/) — the loop lengths
- [Formal algorithms of tintinnabuli (Arvo Pärt Centre)](https://www.arvopart.ee/en/arvo-part/article/formal-algorithms-of-tintinnabuli-in-arvo-parts-music/) — a rule that generates a second voice from a first
- [Wwise 201: entry and exit cues](https://www.audiokinetic.com/en/courses/wwise201/?id=lesson_1_re_sequencing_creating_variation_using_horizontal_approach_positioning_entry_and_exit_cues/) — transition segments rather than crossfades
- [Huron, Sweet Anticipation — ITPRA reviewed (Aversa, MTO 15.3)](https://mtosmt.org/issues/mto.09.15.3/mto.09.15.3.aversa.html)
