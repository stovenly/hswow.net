# src/debug

The test world. Every zone in here is a rig: a room built so one claim about
the engine can be answered by standing somewhere and looking, or listening.
None of it is game content and none of it is fiction.

Describe what this area is and how its pieces fit **now**. No history, no "we
changed X to Y", no rejected alternatives, no tuning notes. If a fact stops
being true, edit the line — do not append a correction.

## The shape of the world

`zones.ts` is the hub. Turn around for the kit — three prop halls, with the
galleries and the materials wing hanging off them; look forward for the world —
the Demo Showcase, with the finished places behind it. `chains.ts` hangs two
three-deep chains off it, which is the only way to observe zone eviction.

- **Galleries** (`galleries/`) answer *does this family hang together*: a rank
  of rows, eight seeds each, one room per palette. Built through
  `galleries/layout.ts` from a `GalleryPlan`.
- **Showcases** (`*Showcase.ts`) answer *does this system work*: one station per
  claim, hand-placed, no rows.
- **Stages** (`SoundStage.ts`, `MusicStage.ts`) answer *is this one louder than
  its neighbours*: identical stations in a rank, defaults throughout.

## Conventions

**One room, one question.** A room is a scale, and standing something in it
that differs by a whole optical model breaks the scale.

**Only one thing varies down a rank.** Every station gets the same distance, the
same reach, the same spacing and the same seed where it can. Tuning one station
to flatter it is hiding the thing the room exists to show.

**Galleries are silent; showcases may not be.** Eight copies of a builder in a
line is not a place, so a sound coming out of one has nothing to be judged
against. A showcase whose subject makes a noise gets emitters, and every one of
them stands on something you can see.

**Placement runs object → sound, never the reverse.** A room that wants an
emitter on its third tree asks `rowPosition` for the third tree. A coordinate
typed twice is how a bell ends up ringing six metres above a rooftop.

**Builders are imported, not globbed.** `art/registry` only exists under Vite,
and a gallery a headless tool cannot see is a gallery whose portals nobody
verifies. Listing them also makes a gallery a statement about what belongs
together.

**Every name is a placeholder.** Door tooltips are the most player-facing
strings in the project so far, and naming is the repo owner's.

## Adding a room

A `GalleryPlan` in `galleries/` for a family of props, or a zone module for a
system. Register it in `galleries/index.ts` or `zones.ts`, and give it a door
in `props.ts` — a room with no door is a room nothing verifies.
