# src/audio/music

The score. A zone declares a vibe, the director composes a piece from that
zone's seeds, and a rack of instruments plays it. Nothing here is a recording
and nothing here is a written tune.

Describe what this area is and how its pieces fit **now**. No history, no "we
changed X to Y", no rejected alternatives, no tuning notes. If a fact stops
being true, edit the line — do not append a correction.

## Files

- `director.ts` — the bar clock and everything it places. The conductor.
- `vibes.ts` — the book: one `MusicSpec` per kind of place.
- `theory.ts` — modes, the scale lock, just intonation. Pure arithmetic.
- `harmony.ts` — ground loops, Lerdahl distance, choosing a chord by tension.
- `patterns.ts` — seeded cells, periods and sentences.
- `rhythm.ts` — a section's one cell, metric weight, the mutation rule.
- `form.ts` — Cope's SPEAC as a section grammar.
- `tempo.ts` — ritard and phrase-arch curves, stateless.
- `played.ts` — one instrument as a placeable model, for auditioning.
- `instruments/` — the rack. `build.ts` is the single voice registry.

## There is one clock

Each bar, `fireBar` places everything that bar contains: the chord and its
drone, the texture figure, the kit, and any melody statement due. Chord changes
and figure changes agree by construction, and drift and ritard stretch every
part identically. Nothing schedules against anything but the bar length.

The pump is a worker timer, not the frame loop — no decision here reads frame
state, so a late frame was never a reason for a late bar.

## Conventions

**Seeds, never notes.** A zone stores seeds; re-rolling one replays its cell
exactly, so a place's motifs recur on every visit. Note material uses the
seeded `Rng`; timing and performance choices use `Math.random`.

**Degree space until the last moment.** Cells are walked as mode degrees and
converted to semitones at the end, so the scale lock holds by construction and
a mutated bridge re-says the same idea with one accidental moved.

**A chord is a root and a fifth.** No thirds anywhere in the grammar, and never
the fifth degree or the leading tone as a root — a dominant would turn the
rocking into a cadence.

**Scarcity is the design.** Pieces run a few minutes and the rests after them
run longer. Sparseness lives in those rests and in how much a vibe's melody
speaks, never in a stratum going missing.

## Adding a vibe

A constant in `vibes.ts`, declared by zones by name — rack identity is spec
identity, so a zone that copies the fields gets its own rack and breaks the
border crossfade. Give it a root on the ladder, a mode, a `character`, and
decide the one question that separates the halves of the book: does it pulse?
