import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import {
  hearting,
  patch,
  pointing,
  skin,
  stoneColours,
  tapered,
  wander,
  SKIN,
} from '../masonry';
import { stoneChunk } from '../stone';
import { WALL_DEPTH } from './stone-wall';

// A ruined wall: a run of field wall that has come down — what lets a boundary
// end without a squared pier saying somebody built this far and stopped.
//
// Everything visible comes out of `art/masonry`, the same as the wall it is the
// end of. There is no coping, and that absence is why it reads as ruined: a dry
// wall's coping is what holds the top course down, so a ruin with a neat capped
// top is a wall somebody built short.
//
// The height decays from one end to the other in uneven steps rather than a ramp,
// because a wall loses whole sections at the joints, and what came off is lying at
// the foot on the low side, where it breaks the line against the ground.
//
// Built along +X on y = 0, centred on its own span, tall end at −X.
export const stoneWallRuin: MeshBuilder = {
  name: 'stone-wall-ruin',
  category: 'structures',
  radius: 1.9,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const span = rng.range(2.4, 3.6);
    const stand = rng.range(0.9, 1.5);
    const dry = rng.chance(0.65);
    const point = pointing(rng, dry);
    const fill = hearting(rng, dry);
    const colour = stoneColours(rng);
    const stone = rng.range(0.36, 0.5);
    const amount = rng.range(0.016, 0.026);

    // The profile: a wall that falls away from one end, and about a third of the
    // time picks back up before the other. A ruin has to say this is where the wall
    // stops, and a run that falls away is the only profile that says it; the variety
    // comes from the far end, where a standing length makes the piece read as a gap
    // in a boundary rather than as its termination.
    const bays = rng.int(4, 7);
    const heights: number[] = [];
    // How fast it goes. Under 1 it drops away quickly and trails; over 1 it
    // holds up and then lets go.
    const bite = rng.range(0.7, 1.3);
    // And whether anything is left at the far end.
    const farEnd = rng.chance(0.35) ? rng.range(0.4, 0.85) : 0;

    for (let i = 0; i < bays; i++) {
      const t = bays > 1 ? i / (bays - 1) : 0;
      // The staircase down from −X.
      let level = (1 - t) ** bite;
      // The far end coming back up, over the last third or so.
      if (farEnd > 0) level = Math.max(level, farEnd * Math.max(0, (t - 0.55) / 0.45) ** 0.8);
      // One bay that has held better than the two beside it — every ruin has
      // one, and it is what stops the run reading as a ramp.
      const held = rng.chance(0.22) ? rng.range(0.12, 0.3) : 0;
      heights.push(Math.max(0.12, stand * (level * rng.range(0.85, 1.12) + held)));
    }

    const bayWidth = span / bays;
    const depthAt = (y: number): number => WALL_DEPTH * (1 - 0.26 * (y / Math.max(stand, 0.1)));
    /** Where a face lies at this height — the hearting's surface. */
    const faceAt = (y: number): number => depthAt(y) / 2 - SKIN;

    for (let i = 0; i < bays; i++) {
      const middle = -span / 2 + (i + 0.5) * bayWidth;
      const height = heights[i];

      // The hearting for this bay, tapered because the face it carries is: `faceAt`
      // narrows with height, and a plain box cut to the depth at half height beds
      // the bottom course out in front of anything and buries the top course. It
      // spans its bay exactly and takes no jitter, so two bays meet without daylight.
      const core = tapered(bayWidth, height, faceAt(0), faceAt(height));
      core.translate(middle, 0, 0);
      parts.push({ geometry: core, color: fill, sway: 0 });

      // Both faces, cut into stones the same way the standing wall is, and cut about
      // the origin and moved into place afterwards. The far face is made by turning
      // the near one a half turn about the vertical axis through the origin, so a
      // panel stated at the bay's own world x lands mirrored across the whole ruin.
      for (const facing of [1, -1]) {
        const stones: Part[] = [];
        skin(
          rng,
          patch(-bayWidth / 2, 0, bayWidth, height),
          (y) => stone * (1 - 0.3 * (y / Math.max(stand, 0.1))),
          point,
          faceAt,
          wander(rng, amount),
          colour,
          stones,
        );
        for (const part of stones) {
          if (facing < 0) part.geometry.rotateY(Math.PI);
          part.geometry.translate(middle, 0, 0);
          parts.push(part);
        }
      }

      // The broken top: one or two stones sitting half off the course below, which is
      // what the edge of a collapse looks like. Only where the bay still has a course
      // to lose, and bedded down into it rather than balanced on it.
      if (height > 0.3) {
        for (let k = rng.int(0, 2); k > 0; k--) {
          const size = stone * rng.range(0.5, 0.9);
          const loose = stoneChunk(rng, {
            width: size / 2,
            height: size * rng.range(0.24, 0.36),
            depth: WALL_DEPTH * rng.range(0.24, 0.34),
            sides: rng.int(5, 7),
            rough: 0.2,
            skew: 0.35,
            bury: 0.5,
          });
          loose.rotateY(rng.around(0, 0.35));
          loose.rotateZ(rng.around(0, 0.18));
          loose.translate(
            middle + rng.around(0, bayWidth * 0.3),
            height - size * rng.range(0.1, 0.2),
            rng.around(0, WALL_DEPTH * 0.12),
          );
          parts.push({ geometry: loose, color: colour(), sway: 0 });
        }
      }
    }

    // --- what came off it ----------------------------------------------------
    // Lying where the wall is missing, which has to be worked out rather than
    // assumed: the stone from a breach is in the breach. Bays are drawn by how much
    // of them has gone.
    const gone = heights.map((h) => Math.max(0.05, stand - h));
    const total = gone.reduce((sum, n) => sum + n, 0);
    const fallenIn = (): number => {
      let roll = rng() * total;
      for (let i = 0; i < gone.length; i++) {
        roll -= gone[i];
        if (roll <= 0) return -span / 2 + (i + rng()) * bayWidth;
      }
      return rng.range(-span / 2, span / 2);
    };

    // And to one side more than the other, because a wall falls the way it
    // leans rather than shedding evenly in both directions.
    const shed = rng.chance(0.5) ? 1 : -1;
    for (let i = rng.int(6, 12); i > 0; i--) {
      const size = stone * rng.range(0.4, 0.95);
      const at = fallenIn();
      // Hulls, like everything else made of rock in the kit. These came off a
      // field wall, and a field wall is built of whatever the field gave up.
      const block = stoneChunk(rng, {
        width: size / 2,
        height: size * rng.range(0.2, 0.34),
        depth: size * rng.range(0.3, 0.5),
        sides: rng.int(5, 7),
        rough: 0.24,
        skew: 0.4,
        bury: rng.range(0.2, 0.45),
      });
      block.rotateY(rng.range(0, Math.PI * 2));
      block.rotateX(rng.around(0, 0.25));
      block.rotateZ(rng.around(0, 0.25));
      block.translate(
        at,
        rng.range(0, 0.06),
        shed * rng.range(WALL_DEPTH * 0.5, WALL_DEPTH * 1.9) * (rng.chance(0.75) ? 1 : -1),
      );
      parts.push({ geometry: block, color: colour(), sway: 0 });
    }

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'stone-wall-ruin', 0);
  },
};
