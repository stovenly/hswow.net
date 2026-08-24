import type { BuilderWith } from '../types';
import { buildColumn, type StoneWallColumnOptions } from './stone-wall-square-column';
import { LOW, TALL } from './stone-wall';
import type { Fields } from '../schema';

// A three-sided pier: the sharp turn — a run in one face and out of another bends
// 60°. Same face width as the others, so it is the smallest of the three, and its
// shallow arris means its quoins reach furthest along both faces. Standing on
// y = 0, centred on the origin, face 0 looking along +X.
export const stoneWallTriangleColumn: BuilderWith<StoneWallColumnOptions> = {
  name: 'stone-wall-triangle-column',
  category: 'structures',
  // Bigger than the square pier's despite the smaller shaft: a triangle's
  // circumradius is twice its apothem, so its cap has long corners.
  options: { height: { type: 'number', min: 0.5, max: 4, step: 0.05 }, phase: { type: 'number', min: 0, max: 1, step: 0.01 } } satisfies Fields,
  radius: 0.5,
  build: (options) => buildColumn('stone-wall-triangle-column', TALL, 3, options),
};

/** The low wall's three-sided pier. */
export const stoneWallTriangleColumnLow: BuilderWith<StoneWallColumnOptions> = {
  name: 'stone-wall-triangle-column-low',
  category: 'structures',
  options: { height: { type: 'number', min: 0.5, max: 4, step: 0.05 }, phase: { type: 'number', min: 0, max: 1, step: 0.01 } } satisfies Fields,
  radius: 0.4,
  build: (options) => buildColumn('stone-wall-triangle-column-low', LOW, 3, options),
};
