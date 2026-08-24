import type { BuilderWith } from '../types';
import { buildColumn, type StoneWallColumnOptions } from './stone-wall-square-column';
import { LOW, TALL } from './stone-wall';
import type { Fields } from '../schema';

// A five-sided pier: the gentle turn, and the one with choices — a run bends 36°,
// 72° or 108° depending which pair of faces it uses. Same face width as the
// others, so it is the largest of the three, and it reads as nearly round at any
// distance. Standing on y = 0, centred on the origin, face 0 looking along +X.
export const stoneWallPentagonColumn: BuilderWith<StoneWallColumnOptions> = {
  name: 'stone-wall-pentagon-column',
  category: 'structures',
  options: { height: { type: 'number', min: 0.5, max: 4, step: 0.05 }, phase: { type: 'number', min: 0, max: 1, step: 0.01 } } satisfies Fields,
  radius: 0.75,
  build: (options) => buildColumn('stone-wall-pentagon-column', TALL, 5, options),
};

/** The low wall's five-sided pier. */
export const stoneWallPentagonColumnLow: BuilderWith<StoneWallColumnOptions> = {
  name: 'stone-wall-pentagon-column-low',
  category: 'structures',
  options: { height: { type: 'number', min: 0.5, max: 4, step: 0.05 }, phase: { type: 'number', min: 0, max: 1, step: 0.01 } } satisfies Fields,
  radius: 0.62,
  build: (options) => buildColumn('stone-wall-pentagon-column-low', LOW, 5, options),
};
