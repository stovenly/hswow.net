import type { MeshBuilder, BuildOptions } from '../types';
import { assemble, finish } from '../assemble';
import { createRng } from '../random';
import { buildRowan } from './rowan';

/**
 * A young rowan: two to three metres, a single clean stem, and no fruit.
 *
 * Shares its construction with the grown tree rather than duplicating it,
 * because a young rowan genuinely *is* the same tree with fewer parts — unlike
 * the birch and the spruce, whose saplings differ in kind (a whippy bent wand,
 * a cone with no bare trunk at all) and therefore have builders of their own.
 *
 * Three things change, and all three are counts rather than shapes:
 *
 * - **It forks higher**, at about half its height instead of a third, so it
 *   reads as a stem with a tuft rather than as a many-branched shrub. That is
 *   what a sapling in a wood looks like: reaching for light, not spreading.
 * - **Three or four limbs**, against five to seven.
 * - **No berries.** A rowan does not fruit for several years, and a two-metre
 *   one hung with corymbs would read as a berry bush rather than as a young
 *   tree — which would undo the one job this builder has, filling the storey
 *   between the shrubs and the canopy.
 */
export const smallRowan: MeshBuilder = {
  name: 'small-rowan',
  category: 'foliage',
  radius: 0.9,

  build({ seed = 1, scale = 1 }: BuildOptions = {}) {
    const rng = createRng(seed);
    const geometry = assemble(buildRowan(rng, true));
    geometry.rotateY(rng.range(0, Math.PI * 2));
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'small-rowan', rng.range(0, Math.PI * 2));
  },
};
