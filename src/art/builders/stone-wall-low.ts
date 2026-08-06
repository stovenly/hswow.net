import type { BuilderWith } from '../types';
import {
  buildWall,
  LOW,
  WALL_MAX_SECTIONS,
  WALL_SECTION,
  type StoneWallOptions,
} from './stone-wall';

/**
 * A low stone wall: `stone-wall` at half the height.
 *
 * Waist high or under — a garden edge, a yard boundary, something to sit on. The
 * same masonry, the same pitch, and the same contract: a run of any length is a
 * count of sections, and `stone-wall-column` finishes it.
 *
 * Its stones are only a little smaller than the tall wall's and it is only a
 * little thinner. See `LOW` — a wall does not get finer stones because it got
 * shorter, it gets fewer courses of them, and a low wall built of scaled-down
 * everything reads as a model of a wall rather than a low one.
 *
 * Built along **+X**, standing on y = 0, centred on its own span.
 */
export const stoneWallLow: BuilderWith<StoneWallOptions> = {
  name: 'stone-wall-low',
  category: 'structures',
  radius: (WALL_MAX_SECTIONS * WALL_SECTION) / 2,
  build: (options) => buildWall('stone-wall-low', LOW, options),
};
