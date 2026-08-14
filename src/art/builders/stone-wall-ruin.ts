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

/**
 * A ruined wall: a run of field wall that has come down.
 *
 * **This is what lets a boundary end.** Every run of `stone-wall` in the world
 * finishes in a `stone-wall-column` — a squared pier, deliberate, saying somebody
 * built this far and stopped. That is right for a gateway and wrong for
 * everywhere else, because most old walls do not end, they *fail*: the coping
 * goes, then the top course, then a sheep walks through the gap. A boundary that
 * only ever terminates in tidy piers reads as a set of enclosures rather than as
 * a landscape somebody has been maintaining for two hundred years and losing.
 *
 * It is also the answer to the thing that is otherwise hard here — how a wall
 * meets a rock line. A ruin's tumbled end and a run of boulders are the same
 * kind of object at that point, and the eye stops asking where one stopped and
 * the other began.
 *
 * ## Built from the wall's own masonry, not a copy of it
 *
 * Everything visible here comes out of `art/masonry` — the same face-splitting,
 * the same warp, the same joints, the same stone colours, the same choice
 * between dry-laid and pointed. A ruin built from its own private stonework
 * would diverge from the wall it is supposed to be the end of on the first day
 * either was touched, and the mismatch would be most visible exactly where the
 * two meet.
 *
 * There is **no coping**, and that absence is the whole reason it reads as
 * ruined. A dry wall's coping is what holds the top course down; once it is
 * gone the wall unravels, so a ruin with a neat capped top is a wall somebody
 * built short.
 *
 * ## The profile falls away, and the stones are underneath it
 *
 * The height decays from one end to the other in uneven steps — not a ramp,
 * because a wall does not erode evenly, it loses whole sections at the joints.
 * What came off is lying at the foot on the low side, which is where gravity put
 * it and also where it does the most good: it breaks the line where the wall
 * meets the ground.
 *
 * Built along **+X**, standing on y = 0, centred on its own span, tall end at
 * −X. A placer turns it to run a ruin out of a standing wall.
 */
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

    // The profile: **a wall that falls away from one end**, and about a third of
    // the time picks back up before the other.
    //
    // It briefly had four shapes — robbed, breached, stubbed, slumped — on the
    // argument that a wall does not fail from one end. It does not, and it did
    // not help: three of the four put the tall stonework in the middle, where it
    // reads as a lump with rubble either side rather than as the end of
    // something. A ruin has to say *this is where the wall stops*, and a run that
    // falls away is the only profile that says it.
    //
    // The variety comes from the far end instead. Most of the time it goes on
    // down to the footings; sometimes a length of it is still standing, so the
    // piece reads as a gap in a boundary rather than as its termination — which
    // is the other thing a ruin is for and is worth having without giving up the
    // shape that works.
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

      // The hearting for this bay: **tapered**, because the face it has to
      // carry is. `faceAt` narrows with height — that is the wall's batter —
      // and this was a plain box cut to the depth at half height, so the
      // bottom course of stones was bedded a few centimetres out in front of
      // anything and the top course was buried in it. `stone-wall` uses
      // `tapered` for exactly this reason and this now does the same.
      //
      // It spans its bay exactly and takes no jitter, so two bays meet without
      // daylight between them.
      const core = tapered(bayWidth, height, faceAt(0), faceAt(height));
      core.translate(middle, 0, 0);
      parts.push({ geometry: core, color: fill, sway: 0 });

      // Both faces, cut into stones the same way the standing wall is.
      //
      // **Cut about the origin and moved into place afterwards.** The panel used
      // to be stated at the bay's own world x, and the far face is made by
      // turning the near one a half turn about the *vertical axis through the
      // origin* — so its stones landed mirrored across the middle of the whole
      // ruin, on top of a different bay of a different height, and a good number
      // of them ended up standing in mid-air where no core reached. A skin has to
      // be cut where it will be turned.
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

      // The broken top: one or two stones sitting half off the course below,
      // which is what the edge of a collapse actually looks like. Only where
      // the bay is still tall enough to have a course left to lose, and bedded
      // down into it rather than balanced on it.
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
    //
    // **Lying where the wall is missing**, which now that the profile is not
    // always a staircase means it has to be worked out rather than assumed: the
    // stone from a breach is in the breach, not at the +X end where the old
    // profile always happened to be lowest. Bays are drawn by how much of them
    // has gone.
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
