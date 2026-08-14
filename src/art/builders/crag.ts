import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { stoneColour, weathered, stoneLump, stoneChunk } from '../stone';

/**
 * A crag: a broken tor of stone, well over head height.
 *
 * **The accent, and a run of rock needs one.** Boulders and outcrops are all
 * roughly the same height as each other, so a line built only from those reads
 * as a heap however carefully it is placed — the eye wants one thing standing
 * clear of the rest to know that the line is terrain and not a wall. This is
 * that thing: four to seven metres, which is tree height, from something that is
 * obviously not a tree.
 *
 * ## It is stacked, and the stack is the silhouette
 *
 * A tor is a column of blocks left standing where the joints between them
 * happened not to give way. So this is built as three to five blocks piled up,
 * each turned on the one below, with the joints running **horizontally** — which
 * is what stops it reading as a spire. A single tapered mass at this height is a
 * rock formation from a cartoon; the horizontal joints are the whole difference.
 *
 * The blocks lean cumulatively rather than independently, so the column has one
 * overall list to it. A stack whose pieces disagree about which way to lean does
 * not read as precarious, it reads as broken.
 *
 * ## The joints are bedding planes, and they are flat
 *
 * This took two goes to get right and the two failures are opposite.
 *
 * **The blocks were boxes**, so it was a stack of dice. Rock does not fracture
 * into cuboids — see `art/stone.ts`.
 *
 * Then the blocks were hulls with *ragged* top and bottom faces, pushed deep
 * into each other so they could not show daylight — and that was worse to look
 * at than the dice. Two ragged faces have nothing to meet on, so shoving them
 * together drives the corners of one straight out through the sides of the
 * other, and every joint sprouted spikes.
 *
 * A tor does not work like that. It is a block of rock that has been split along
 * its **bedding planes**, and a bedding plane is flat, because that is the plane
 * it split along. So the blocks have level tops and bottoms (`flat`), each is
 * seated on the one below with a few centimetres of overlap — enough that no
 * gap can open, not enough for anything to come through — and what varies is
 * the *outline*: every block is turned well round on the one under it, so no two
 * present the same face and the joint lines never run true.
 *
 * The aspect is still rolled wide. A tor is not a column of similar blocks, it
 * is one broad shelf, one tall wedge and something jammed between them.
 *
 * ## And it sheds
 *
 * Two or three blocks at the foot, lying where they came off. They are cheap,
 * they widen the base so the column does not look planted in a hole, and they
 * say the thing has been standing long enough to lose pieces.
 */
export const crag: MeshBuilder = {
  name: 'crag',
  category: 'nature',
  radius: 2.6,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const blocks = rng.int(3, 5);
    const bed = stoneColour(rng);
    // The list of the whole column. **Small**, and smaller than it was: the
    // blocks meet on flat faces now, so every degree of tilt is a wedge of
    // daylight at one edge of the joint and a corner coming through at the
    // other. Two or three degrees reads as a mass that has settled; more reads
    // as a mistake.
    const listX = rng.around(0, 0.045);
    const listZ = rng.around(0, 0.045);

    let width = rng.range(0.75, 1.15);
    let depth = width * rng.range(0.62, 0.95);
    let turn = rng.range(0, Math.PI * 2);
    let offX = 0;
    let offZ = 0;
    /** Where the top face of the block below sits. The next one beds onto it. */
    let bedding = -rng.range(0.35, 0.8);

    for (let i = 0; i < blocks; i++) {
      // **Aspect is rolled wide on purpose.** A course that is half as tall as
      // it is broad is a shelf; one twice as tall is a wedge; a tor has both.
      // Rolling them all to the same proportion is most of what made the first
      // version read as a stack of similar objects.
      const half = width * rng.range(0.45, 1.35) * (1 - i * 0.04);

      const block = stoneChunk(rng, {
        width,
        height: half,
        depth,
        sides: rng.int(5, 7),
        rough: rng.range(0.16, 0.28),
        // Sheared, so the sides lean and the block is a wedge — but level top
        // and bottom, because those are the faces it has to sit on and be sat
        // on. See `flat` in `art/stone.ts`.
        skew: rng.range(0.25, 0.5),
        taper: rng.range(0.7, 1.15),
        flat: true,
        bury: 0.5,
      });
      // Turned about its own axis first, then given the column's list — the
      // other order rotates the list itself and the stack wanders off its line.
      block.rotateY(turn);
      block.rotateZ(listX);
      block.rotateX(listZ);

      // **Seated, with a few centimetres of bite.** Its underside lands on the
      // last block's top face and sinks a little way in: enough that no joint
      // can open, far too little for a corner to travel through anything.
      const bite = Math.min(half, 0.12) * rng.range(0.3, 0.8);
      const y = bedding - bite + half;
      block.translate(offX, y, offZ);
      parts.push({ geometry: block, color: weathered(rng, bed, y + half), sway: 0 });

      bedding = y + half;
      // Each block sits off the middle of the one below, by enough to read and
      // not enough to overhang — the outline is only so wide, and a block that
      // steps further than it has stone to spare is a block with a corner in
      // mid-air.
      offX += rng.around(0, width * 0.16);
      offZ += rng.around(0, depth * 0.16);
      // A big turn every course, so no two blocks show the same face and the
      // joint lines never run true. Free, because turning about the vertical
      // leaves the bedding faces exactly where they were.
      turn += rng.range(0.7, 2.4) * (rng.chance(0.5) ? 1 : -1);
      width *= rng.range(0.78, 0.95);
      depth *= rng.range(0.78, 0.96);
    }

    // What has come off it. Angular, because these have not been loose long —
    // and cut from the same function as the tor above them, so a block on the
    // ground is recognisably a block that used to be up there.
    for (let i = rng.int(2, 4); i > 0; i--) {
      const size = rng.range(0.3, 0.7);
      const bearing = rng.range(0, Math.PI * 2);
      const out = rng.range(1.1, 2.1);
      const fallen = stoneChunk(rng, {
        width: size,
        height: size * rng.range(0.4, 0.8),
        depth: size * rng.range(0.6, 1.05),
        sides: rng.int(5, 7),
        rough: rng.range(0.2, 0.32),
        skew: rng.range(0.3, 0.55),
        bury: rng.range(0.2, 0.4),
      });
      fallen.rotateX(rng.around(0, 0.3));
      fallen.rotateY(rng.range(0, Math.PI * 2));
      fallen.rotateZ(rng.around(0, 0.3));
      fallen.translate(Math.cos(bearing) * out, 0, Math.sin(bearing) * out);
      parts.push({ geometry: fallen, color: stoneColour(rng), sway: 0 });
    }

    // And the worn stuff between them, which softens the join to the ground.
    for (let i = rng.int(1, 3); i > 0; i--) {
      const chip = stoneLump(rng, {
        radius: rng.range(0.14, 0.28),
        detail: 0,
        rough: 0.38,
        squash: 0.7,
        bury: 0.42,
      });
      const bearing = rng.range(0, Math.PI * 2);
      chip.translate(Math.cos(bearing) * rng.range(0.9, 1.8), 0, Math.sin(bearing) * rng.range(0.9, 1.8));
      parts.push({ geometry: chip, color: stoneColour(rng), sway: 0 });
    }

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'crag', 0);
  },
};
