import type { BuilderWith, BuildOptions } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { stoneColour, weathered, stoneLump, stoneChunk } from '../stone';

// A rock shelf: a low ledge of broken stone, laid to a line — what an authored
// step in the terrain needs to stop looking like a ramp.
//
// Stones all the way through, with no core: a bank of boulders two courses deep,
// each overlapping its neighbours along the run and the course behind it. The
// front course is the face and stands proud; the back course is mostly buried and
// gives the mass depth. Nothing in it is a box and nothing is repeated.
//
// Sectioned like a fence, at a fixed `SHELF_SECTION` pitch. Without a core the
// tiling comes from the stones, so the first and last of each course are centred
// on the ends of the piece and two runs interlock across a join. `run` seeds what
// has to agree across one: height, depth, and what bed the stone came out of.
//
// Built along +X on y = 0, centred on its own span, face toward +Z. The back is
// buried; a shelf is the front of a bank.

/** Metres of ledge in one section. The same for every shelf, so runs tile. */
export const SHELF_SECTION = 2;

/** Sections in one piece. */
export const SHELF_MAX_SECTIONS = 4;

/**
 * How far back into the bank the second course sits: close in, and deep. A hull is
 * narrowest at its top and bottom, so two stones can share a slab of space and
 * still have clear air between their surfaces — the bank has to be pushed into the
 * face, not parked behind it.
 */
const SHELF_BACK = 0.3;

export interface RockShelfOptions extends BuildOptions {
  /** How many sections long, 1..4. Rolled from the seed when the caller says nothing. */
  sections?: number;
  /** Seeds what has to agree across a join — height, depth, stone. Defaults to `seed`. */
  run?: number;
}

export const rockShelf: BuilderWith<RockShelfOptions> = {
  name: 'rock-shelf',
  category: 'nature',
  // Half the longest span plus the overhang: the end plates are centred *on*
  // the ends of the piece so two runs interlock across a join, which puts about
  // a third of a metre of stone past the pitch at each end.
  radius: (SHELF_MAX_SECTIONS * SHELF_SECTION) / 2 + 0.7,

  build({ seed = 1, scale = 1, sections, run }: RockShelfOptions = {}) {
    const rng = createRng(seed);
    // Everything a neighbouring piece has to match comes off this one, in this
    // order, before anything else touches it.
    const along = createRng(run ?? seed);
    const parts: Part[] = [];

    const rolled = rng.int(1, SHELF_MAX_SECTIONS);
    const count = Math.max(1, Math.min(SHELF_MAX_SECTIONS, Math.round(sections ?? rolled)));
    const span = count * SHELF_SECTION;
    const stand = along.range(0.7, 1.6);
    const front = along.range(0.1, 0.3);
    const bed = stoneColour(along);

    // Two courses of boulders: the face, and the bank behind it. The back course
    // goes down first, so anything showing between two front stones is more stone.
    // Each course steps at rather less than a stone's own width, because an
    // irregular outline cannot butt another without leaving a gap, and the first and
    // last of each are centred on the ends of the piece, so two runs interlock.
    const lay = (
      count: number,
      z: number,
      deep: number,
      height: (t: number) => number,
      foot: number,
      seat: number,
    ): void => {
      for (let i = 0; i <= count; i++) {
        const at = -span / 2 + (i / count) * span;
        // Wider than the step, not narrower: stones are set `span / count` apart, so
        // two neighbours only meet if their half-widths add up to more than that.
        // Half again over is comfortable even allowing for a hull being narrower at
        // its faces than at its corners.
        const wide = (span / count) * rng.range(1.35, 1.8);
        const top = height(i / count);
        const stone = stoneChunk(rng, {
          width: wide / 2,
          height: (top - foot) / 2,
          depth: deep / 2,
          sides: rng.int(5, 7),
          rough: rng.range(0.18, 0.3),
          // Leaning out of the bank, the way a block levered up by frost does.
          skew: rng.range(0.2, 0.45),
          taper: rng.range(0.6, 0.95),
          bury: 0.5,
        });
        stone.rotateY(rng.around(0, 0.32));
        stone.translate(at + rng.around(0, wide * 0.1), (top + foot) / 2 + seat, z);
        parts.push({ geometry: stone, color: weathered(rng, bed, top), sway: 0 });
      }
    };

    // The bank: bigger, blunter, further back, and cut off at about two thirds
    // the height of the face so it reads as the ground the ledge is the edge of.
    const behind = Math.max(2, Math.round(span / rng.range(0.85, 1.25)));
    lay(
      behind,
      -SHELF_BACK,
      SHELF_BACK * 3.4,
      () => stand * rng.range(0.62, 0.92),
      -0.6,
      0,
    );

    // The face. The ragged skyline is the whole read — a ledge with a level top edge
    // is a wall, however good the stone on it is. Wandering with a long wave along
    // the run as well as per stone, so the crest rises and falls in one movement.
    const swell = rng.range(0, Math.PI * 2);
    // Rolled here rather than inside the callback: a wavelength drawn per stone
    // is not a wave, it is the jitter it was meant to replace.
    const waves = rng.range(2.2, 4.5);
    const stones = Math.max(2, Math.round(span / rng.range(0.5, 0.8)));
    lay(
      stones,
      front,
      front * 2 + 0.5,
      (t) => stand * (1 + Math.sin(swell + t * waves) * 0.16) * rng.range(0.9, 1.1),
      -0.55,
      0,
    );

    // Blocks that have come off the face and lie at its foot. They break the
    // line where the ledge meets the ground, which is the second-loudest
    // straight edge on the object after the top.
    for (let i = rng.int(2, 4 + count); i > 0; i--) {
      const size = rng.range(0.14, 0.34);
      const fallen = rng.chance(0.55)
        ? stoneChunk(rng, {
            width: size,
            height: size * rng.range(0.45, 0.75),
            depth: size * rng.range(0.6, 1),
            sides: rng.int(5, 7),
            rough: 0.26,
            skew: 0.4,
            bury: rng.range(0.25, 0.45),
          })
        : stoneLump(rng, { radius: size, detail: 0, rough: 0.36, squash: 0.65, bury: 0.4 });
      fallen.rotateY(rng.range(0, Math.PI * 2));
      fallen.rotateX(rng.around(0, 0.22));
      // Against the foot of the face rather than out in front of it: a block
      // that has come off the ledge has come off *it*, and one lying half a
      // metre clear reads as a rock that happens to be nearby.
      fallen.translate(rng.range(-span / 2 + 0.2, span / 2 - 0.2), 0, front + rng.range(0, 0.3));
      parts.push({ geometry: fallen, color: stoneColour(rng), sway: 0 });
    }

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'rock-shelf', 0);
  },
};
