import type { BuilderWith } from '../types';
import { buildColumn, type StoneWallColumnOptions } from './stone-wall-column';
import { LOW } from './stone-wall';

/**
 * The low wall's pier: `stone-wall-column` sized to `stone-wall-low`.
 *
 * A gate cheek on a garden wall, or the end of one. Same masonry and same
 * quoined corners, standing clear above the low wall's own band rather than the
 * tall one's — a pier scaled for a two-metre boundary looming over a wall you
 * can sit on is a gatepost with nothing to hold up.
 *
 * Standing on y = 0, centred on the origin.
 */
export const stoneWallColumnLow: BuilderWith<StoneWallColumnOptions> = {
  name: 'stone-wall-column-low',
  category: 'structures',
  radius: 0.4,
  build: (options) => buildColumn('stone-wall-column-low', LOW, options),
};
