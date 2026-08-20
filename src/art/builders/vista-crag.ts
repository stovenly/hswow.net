import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';
import { landWash, markVista, vistaMass } from '../vista';

// A rocky rise — the `rock` recipe, taller and meaner, and the one thing in the
// band that is not green. Fog compresses hue long before value, so a mass
// differing from the hills only in shade disappears into them where grey stone
// survives to the outer fringe. Narrow, steep and heavily displaced.

/** Weathered stone, ordered by value so the wash never puts a step in it. */
const STONE = [shade(PALETTE.STONE_DARK, 0.82), PALETTE.STONE_DARK, PALETTE.STONE] as const;

export const vistaCrag: MeshBuilder = {
  name: 'vista-crag',
  category: 'vista',
  radius: 12,
  solid: false,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);

    const radius = rng.range(9, 14);
    // Taller than wide, where the hill is the reverse.
    const squash = rng.range(1.1, 1.75);
    const geometry = vistaMass(rng, {
      radius,
      detail: 1,
      // Hard displacement. At this scale the facets are ten metres across and
      // the silhouette is the prop, so the roughness has to live in the outline
      // rather than in any surface treatment.
      rough: rng.range(0.3, 0.46),
      squash,
      // Pinched one way, so it reads as a ridge end rather than a lump.
      stretch: rng.range(0.5, 0.85),
      // Well in. A crag is bedrock coming up through the ground.
      bury: rng.range(0.34, 0.44),
    });
    geometry.rotateY(rng.range(0, Math.PI * 2));

    const parts: Part[] = [
      {
        geometry,
        color: landWash(seed ^ 0x0c2a, STONE, {
          scale: rng.range(18, 34),
          crown: radius * squash,
        }),
        sway: 0,
      },
    ];

    const merged = assemble(parts);
    if (scale !== 1) merged.scale(scale, scale, scale);
    return markVista(finish(merged, 'vista-crag', 0));
  },
};
