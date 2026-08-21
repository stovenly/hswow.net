# Music director research brief

Status: research task, no code changes yet.

## The ask

Research music-director / algorithmic-composition theory and systems online, and
come back with concrete improvements for `src/audio/music/`. The goal is
**sophistication** — the director should make smarter decisions, not merely more
random ones. Deliverable is a written plan with options, not code; see
"What to hand back".

This brief exists because the previous session ran out of its web search budget
(`CLAUDE_CODE_MAX_WEB_SEARCHES_PER_SESSION`, 200/200 used). Start here so that
budget goes on research rather than on re-reading what is already known.

## What the director already is

Read these first — the answer has to fit them, not replace them:

- `src/audio/music/director.ts` — the whole machine (~1230 lines).
- `src/audio/music/vibes.ts` — the vibe book, 22 specs.
- `src/audio/music/theory.ts`, `harmony.ts`, `patterns.ts`, `rhythm.ts`, `tempo.ts`.
- `src/audio/music/instruments/` — every voice, synthesised in code.

The shape of it, so it does not have to be re-derived:

- **One clock.** `fireBar(at)` places everything a bar contains — chord and its
  drone, the texture figure, the kit, any melody statement come due. Drift and
  ritard stretch every part identically because every part is placed from the
  same bar length. There is no second scheduler.
- **Three strata plus an optional kit**: drone (pad, root and fifth, re-voiced
  on every refresh), texture (an ostinato figure), melody (statements), drums.
- **A vibe is a `MusicSpec`**: root Hz, mode, palette of five voices,
  `character` (register, gait, `chordBars`, `phraseRest`, `fragment`, levels),
  `density`, `pulse` span or `null`, optional `drums`, `seed`. Rack identity is
  spec identity — zones sharing a vibe share one rack, which is what makes the
  border crossfade work.
- **`pulse: null` is a fork, not a flag.** Pulsed: `barSec = beatSec * 4`, a
  metered cell fills the bar, melody steps from the rhythm cell. Pulse-free:
  8–13 second "breath bars", texture placed in jittered slots, melody steps
  1.1–2.2 s. Eleven of 22 vibes are pulse-free.
- **Form**: A A B A (or A A B when short), each section carrying a tension
  target on an arc that peaks about two thirds in. Tension is spent as
  register, subdivision and layer count — never as loudness.
- **Harmony**: per-seed "grounds" (home and away loops of mode degrees), a
  cadence approach that is bVII–i or plagal and never V, one optional borrowed
  chord per piece, a bridge that may step to a neighbouring mode.
- **Melody**: a seeded `head`, made into a period (antecedent + consequent),
  developed by one motif operation per section (`plain`, `inversion`,
  `fragment`, `sequence`), with ornaments, an optional heterophonic shadow
  voice, and a closing statement placed by the form at the final cadence.
- **Tempo**: Friberg & Sundberg's measured ritard curve at section ends and the
  final cadence; a per-section drift of a few percent; a phrase arch.
- **Scarcity is the design.** Pieces run 75–150 s, rests between them 160–380 s.
- `setNight(0..1)` exists and is stubbed — nothing feeds it until the day/night
  cycle is built. It inverts rather than reduces: alternates become the usual
  draw, registers flip, some answers go unsaid.

## Where it is weakest

Honest list, to aim the research:

1. **Chord choice is a loop lookup.** `ground[bar % length]` with a fixed
   `chordBars`. There is no notion of harmonic distance, so the tension arc
   cannot be spent harmonically — only as register and density.
2. **The pad is root-and-fifth only.** No thirds, no sevenths, no voice
   leading between chords; each refresh re-voices at random rather than moving
   the nearest way.
3. **Melody generation has no listener.** `applyOp(head, op)` transforms a
   motif; nothing scores the result for whether it is a good continuation, and
   nothing shapes a phrase toward or away from closure.
4. **Rhythm is a cell repeated with occasional mutation.** No metric hierarchy,
   no syncopation model, no relationship between accent and harmony.
5. **Form is fixed A A B A with fixed tension numbers.** Nothing hierarchical —
   a bar knows its section's tension and nothing about the piece's shape.
6. **Pulse-free is structurally poorer than pulsed**, and it took three rounds
   of complaints to find that out. Eleven vibes still live there.
7. **The 22 vibes differ mostly by palette and register.** The form machinery
   is identical for all of them.

## Leads worth chasing

Starting points only — find better ones. All of these were on the list when the
search budget ran out, none were read:

- **Neo-Riemannian theory** — P/L/R transformations on the Tonnetz, parsimonious
  voice leading, hexatonic and octatonic cycles, chord distance as a metric.
  Directly applicable to `harmony.ts` and to voicing the pad.
- **Lerdahl, *Tonal Pitch Space*** — a numeric distance between chords and
  between keys, which is exactly the missing input to the tension arc.
- **Narmour's implication-realization model** — bottom-up melodic expectation
  (registral direction, intervallic difference, proximity, closure). A scoring
  function for candidate continuations.
- **Huron, *Sweet Anticipation*** (ITPRA) — expectation as the mechanism of
  musical affect; how to earn tension rather than declare it.
- **Lerdahl & Jackendoff, GTTM** — grouping, metrical structure, time-span and
  prolongational reduction. Mostly analytic, but the preference rules invert
  into generation rules.
- **David Cope's SPEAC** — statement / preparation / extension / antecedent /
  consequent as a hierarchical tension grammar over phrases. Possibly the most
  directly usable idea on this list for a director.
- **Schoenberg's sentence (Satz)** — presentation, continuation with
  fragmentation and accelerating harmonic rhythm, cadence. A second phrase form
  to sit beside the period already implemented.
- **Metric hierarchy / syncopation models** — Longuet-Higgins & Lee, and the
  various syncopation measures, for accent placement that means something.
- **Variable-order Markov / factor oracle** — e.g. OMax/SoMax style continuation.
  Weigh against the constraint that everything must stay seeded and reproducible.
- **Shipped game systems** worth reading up on: how adaptive scores handle
  transition and cadence rather than crossfading — anything that gets past
  vertical remixing and horizontal resequencing.

## Constraints — these are not negotiable

- Everything is generated in code. No samples, no external assets, no
  dependencies added for this.
- Web Audio scheduling only. Note events are `noteOn(when, hz, velocity,
  duration)` on voices in `instruments/`.
- Zone material must stay reproducible from `spec.seed` — a place's motifs and
  ground recur on every visit. Performance dice may be seedless.
- Keep the one-clock property. Anything that needs a second scheduler is wrong.
- No percussion outside `drums: true` vibes; no V cadences; the scarcity numbers
  stay.
- **Nothing drones alone.** No long flat-drone stretch in any vibe, at any point
  in a piece, in any state. This has come up five times and is the single
  hardest constraint.
- Naming and fiction are the owner's. Propose behaviour, not names or prose.
- Comments stay short — a line or three. No tuning history in source.

## Verification

- `npx tsc --noEmit`
- `npm run check:audio`
- Measurement is expected, not optional: write a scratchpad `.ts`, import
  project modules by **absolute** path (`C:/Git/hswow.net/src/...`), bundle with
  `npx esbuild ... --bundle --platform=node --format=esm --outfile=node_modules/.cache/X.mjs`,
  and run it with node. Relative imports from the scratchpad do not resolve.
  Claims about what the director does should come with numbers.

## What to hand back

A written plan first, with options at each decision — not code. For each
proposal: what it changes, which file, what it costs, and how it would be
measured. Rank by how much intelligence it buys per unit of risk to the 22
vibes that already sound the way they should.
