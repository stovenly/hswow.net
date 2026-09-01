# src/life

Things that move on their own. A rigged mesh from `art/builders/`, a small mind
over a home disc, and a pose summed fresh every frame. No keyframes, no clips,
no imported animation.

Describe what this area is and how its pieces fit **now**. No history, no "we
changed X to Y", no rejected alternatives, no tuning notes. If a fact stops
being true, edit the line — do not append a correction.

## Files

- `Creature.ts` — the mind, the attention, and the per-frame assembly.
- `meetings.ts` — two of them crossing paths: turn-taking, decaying small talk.
- `gaits.ts` — every pose layer: walks, idles, greetings, talk, the mask.
- `legs.ts` — planted feet and two-bone IK back to the hips.
- `pose.ts` — the pose buffer and the Euler convention.
- `spring.ts` — Holden's closed-form damped springs.
- `spec.ts` — what a builder tells the runtime about what it built.
- `envelope.ts` — the largest rotation any layer applies, per bone.

## How a frame is built

The mind decides weights and phases. The layers in `gaits` are summed into one
`Pose`. A biped's legs are then solved from its planted feet, the transition
offset is added and decayed, and the whole pose is written to the skeleton.

**Nothing here keeps state.** Every layer is a pure function of a phase or a
clock, so a creature that goes quiet and comes back picks up wherever the clock
says it should be. The only state is the feet and the springs.

## Conventions

Rotations are Euler **YXZ** — yaw about the creature's up, then pitch about the
yawed side axis, then roll. With every bone facing +Z at rest, `rx > 0` tips the
front *down*, so a hanging leg swings back.

**Feet are points in the world, not a sine.** A planted foot stays exactly where
it is while the body moves over it; one that falls too far behind its home under
the hip lifts, swings ahead and plants again. So feet never slide and turning on
the spot is a shuffle of real steps.

**The head goes first and the body follows.** Attention is continuous and
separate from the state machine: the head tracks from notice range, the
shoulders come after it, and only far enough to leave you off one shoulder.

**No cloth simulation on a rigged creature**, and no weathering. Garments are
cleared against `envelope.ts` — a new animation stays inside those numbers or
widens the entry it exceeds, and the widened entry is the list of what to
recheck.

Everything has to read at ten metres on a figure with mitts for hands, so
gestures are whole-arm shapes and never finger work.

## Adding a gesture

A function in `gaits.ts` taking `(pose, t01, ...)` and adding into the pose, an
entry in whichever family list names it, and a check that its largest rotation
per bone is inside `envelope.ts`.
