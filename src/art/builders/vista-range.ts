import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { markVista, vistaBank, vistaRidge } from '../vista';

// A range of hills as one long crest: six to eight stations rising to a peak
// off centre and falling to nothing at both ends, a notch cut in it, the face
// toward +Z a little steeper than the back. Turf low, wood on the steep face
// below the tree line, heath along the top.

export const vistaRange: MeshBuilder = {
  name: 'vista-range',
  category: 'vista',
  // The longest crest is about 136 m end to end; the placer's spacing and the
  // parallax keep-out both take this as the half-extent.
  radius: 70,
  solid: false,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);

    const count = rng.int(6, 8);
    const span = rng.range(110, 136);
    const peak = rng.range(0.3, 0.7);
    const height = rng.range(9, 14);
    const bend = rng.range(-0.16, 0.16);

    const crest: [number, number, number][] = [];
    for (let i = 0; i < count; i++) {
      const t = i / (count - 1);
      const x = -span / 2 + t * span + (i > 0 && i < count - 1 ? rng.range(-4, 4) : 0);
      const z = x * x * bend * 0.01 + rng.range(-3, 3);
      // Highest at the peak, never two stations alike, the ends low.
      const rise = t < peak ? t / peak : (1 - t) / (1 - peak);
      const h = height * (0.2 + 0.8 * Math.sin((rise * Math.PI) / 2)) * rng.range(0.82, 1.12);
      crest.push([x, z, i === 0 || i === count - 1 ? height * 0.2 : h]);
    }

    const geometry = vistaRidge(rng, {
      crest,
      face: rng.range(1.8, 2.6),
      back: rng.range(2.4, 3.6),
      facets: 3,
      foot: 6,
      notches: 1,
      rough: 0.06,
    });

    const parts: Part[] = [
      {
        geometry,
        color: vistaBank(seed ^ 0x2a91, {
          ground: 'pasture',
          bands: [
            { material: 'wood', steeperThan: 0.36, below: height * 0.55 },
            { material: 'heath', above: height * 0.68 },
          ],
          wobble: 2.5,
          crown: height * 0.55,
          scale: rng.range(70, 120),
        }),
        sway: 0,
      },
    ];

    const merged = assemble(parts);
    if (scale !== 1) merged.scale(scale, scale, scale);
    return markVista(finish(merged, 'vista-range', 0));
  },
};
