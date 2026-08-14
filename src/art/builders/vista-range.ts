import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE } from '../palette';
import { landWash, markVista, vistaMass } from '../vista';

/**
 * A range of hills, as one long silhouette — the biggest thing in the band.
 *
 * `vista-hill` is a hill. This is *country*: five or six masses strung along a
 * line, overlapping enough to read as one ridge with shoulders rather than as a
 * row of separate lumps. A hundred and forty metres of horizon in one prop.
 *
 * ## Why it is one builder and not six hills placed in a line
 *
 * Because the placer would never make this shape. Scatter keeps things apart —
 * that is what spacing is for — and a range is the opposite: the masses have to
 * interpenetrate, and their heights have to *rise and fall together* so the
 * profile reads as one landform seen end on. Both of those are facts about the
 * whole thing, so the whole thing is the prop.
 *
 * It also gives parallax something worth moving. A prop only reads as distant if
 * its motion disagrees with the ground, and disagreement is easier to see on
 * something that spans a third of the view than on something a thumb wide.
 *
 * ## Low, and lower than feels right
 *
 * The eye is 1.35 m up, so anything past a few metres tall already breaks the
 * horizon and reads against sky — `vista-hill` records the same lesson. What
 * makes a range read as *large* is its length and the fact that it steps down
 * to nothing at both ends, not its height. Peaks in the middle, shoulders
 * falling away, and the ends buried.
 *
 * Detail 0 throughout: twenty triangles a mass, and at this distance the facets
 * are smaller than the dither. Around 130 triangles for the whole ridge.
 */

/** Distance blues, not hillside greens — see `landWash` on close palettes. */
const FAR = [PALETTE.LEAF_DARK, PALETTE.LEAF, PALETTE.GRASS] as const;

export const vistaRange: MeshBuilder = {
  name: 'vista-range',
  category: 'vista',
  // Measured rather than guessed: the longest ridge these numbers produce is
  // about 136 m end to end. Under-declaring it here would be read as spare room
  // by the placer's spacing and by the parallax keep-out, both of which take
  // this as the prop's half-extent.
  radius: 70,
  solid: false,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);

    const count = rng.int(5, 6);
    // Overlapping by a third, so neighbours share a shoulder instead of meeting
    // at a notch. A notch between two masses reads as two hills; a shoulder
    // reads as one ridge.
    const step = rng.range(20, 24);
    const span = step * (count - 1);
    // A slight bend, so the ridge is not a wall drawn with a ruler. Small: seen
    // end on, a few metres of drift is all it takes.
    const bend = rng.range(-0.16, 0.16);

    const lumps: THREE.BufferGeometry[] = [];
    let tallest = 0;

    for (let i = 0; i < count; i++) {
      const t = count === 1 ? 0.5 : i / (count - 1);
      // Highest in the middle, falling away at both ends. The ends are what
      // make it a range rather than an escarpment.
      const along = Math.sin(t * Math.PI);
      const swell = 0.42 + along * 0.58;

      const radius = rng.range(21, 30) * swell;
      const squash = rng.range(0.3, 0.42);
      const lump = vistaMass(rng, {
        radius,
        detail: 0,
        rough: rng.range(0.16, 0.3),
        squash,
        stretch: rng.range(0.7, 1.25),
        // Deep. Only the crest of each mass is meant to show; the rest is what
        // welds them into a continuous profile.
        bury: rng.range(0.52, 0.62),
      });
      lump.rotateY(rng.range(0, Math.PI * 2));

      const x = -span / 2 + i * step;
      lump.translate(x, 0, x * x * bend * 0.01 + rng.range(-3, 3));
      tallest = Math.max(tallest, radius * squash);
      lumps.push(lump);
    }

    const ridge = mergeGeometries(lumps, false);
    for (const lump of lumps) lump.dispose();
    if (!ridge) throw new Error('vista-range: masses did not share an attribute set');

    const parts: Part[] = [
      {
        geometry: ridge,
        // Drifting over most of the ridge's length rather than over each mass,
        // so the colour belongs to the landform and not to its parts — which is
        // what stops the seams showing.
        color: landWash(seed ^ 0x2a91, FAR, {
          scale: rng.range(70, 120),
          crown: tallest * 0.55,
        }),
        sway: 0,
      },
    ];

    const merged = assemble(parts);
    merged.rotateY(rng.range(0, Math.PI * 2));
    if (scale !== 1) merged.scale(scale, scale, scale);
    return markVista(finish(merged, 'vista-range', 0));
  },
};
