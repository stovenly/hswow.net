import type { BuilderWith, BuildOptions } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { shade } from '../palette';
import { stoneChunk, stoneColour } from '../stone';
import type { Fields } from '../schema';

// Stepping stones: flat-topped stones a stride apart in a line along +X, bases on
// y = 0 and tops level at `rise`, so a placer standing them on a river bed says
// how far they clear the water.
export interface SteppingStonesOptions extends BuildOptions {
  /** Metres from base to top. */
  rise?: number;
  count?: number;
}

export const steppingStones: BuilderWith<SteppingStonesOptions> = {
  name: 'stepping-stones',
  category: 'nature',
  options: {
    rise: { type: 'number', min: 0.2, max: 2.5, step: 0.05, label: 'top above base (m)' },
    count: { type: 'int', min: 3, max: 7 },
  } satisfies Fields,
  radius: 2.9,

  build({ seed = 1, scale = 1, rise = 0.45, count = 5 }: SteppingStonesOptions = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const stride = rng.range(0.95, 1.1);
    const stones = Math.max(1, Math.round(count));
    for (let i = 0; i < stones; i++) {
      const stone = stoneChunk(rng, {
        width: rng.range(0.34, 0.44),
        height: (rise / 2) * rng.range(0.97, 1),
        depth: rng.range(0.28, 0.38),
        sides: 7,
        rough: 0.15,
        skew: 0.1,
        flat: true,
      });
      stone.rotateY(rng.range(0, Math.PI));
      stone.translate((i - (stones - 1) / 2) * stride + rng.around(0, 0.05), 0, rng.around(0, 0.08));
      parts.push({ geometry: stone, color: shade(stoneColour(rng), rng.range(0.92, 1.04)), sway: 0 });
    }

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'stepping-stones', 0);
  },
};
