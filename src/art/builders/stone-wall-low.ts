import type { Fields } from '../schema';
import type { BuilderWith } from '../types';
import {
  buildWall,
  LOW,
  WALL_MAX_SECTIONS,
  WALL_SECTION,
  type StoneWallOptions,
} from './stone-wall';

// A low stone wall: `stone-wall` at half the height, with the same masonry, pitch
// and contract. Its stones are only a little smaller and it is only a little
// thinner — a wall does not get finer stones because it got shorter, it gets fewer
// courses of them. Built along +X on y = 0, centred on its own span.
export const stoneWallLow: BuilderWith<StoneWallOptions> = {
  name: 'stone-wall-low',
  category: 'structures',
  options: { sections: { type: 'int', min: 1, max: 4 }, run: { type: 'int' } } satisfies Fields,
  radius: (WALL_MAX_SECTIONS * WALL_SECTION) / 2,
  build: (options) => buildWall('stone-wall-low', LOW, options),
};
