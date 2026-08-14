import * as THREE from 'three';
import type { BuilderWith, BuildOptions } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { shade } from '../palette';
import { hearting, pointing, polygonPlan, quoinedPolygon, stoneColours, upright } from '../masonry';
import { LOW, TALL, WALL_DEPTH, type Build } from './stone-wall';

/**
 * A stone pier: the end of a wall, the corner of one, or the cheek of a gate.
 *
 * **Piers are how this wall turns corners** — there is no curved section and no
 * mitred corner piece. Three faces bend a run 60°, four 90°, five 36°, 72° or
 * 108°, which between them follows more or less any line using pieces that
 * already tile.
 *
 * Every face is the same width in all three shapes, so a run meets any pier
 * alike; what changes is the pier's overall size. Quoined by `art/masonry`,
 * which is what stops the skins poking through each other at the arrises.
 *
 * Standing on y = 0, centred on the origin.
 */

/**
 * How far beyond the end of a wall run a column has to stand.
 *
 * Half the widest pier there is, measured at the **cap** rather than the shaft —
 * the cap oversails, and a reach taken off the shaft alone sets the pier seven
 * centimetres too far in and drives the cap through the wall's own face.
 */
export const COLUMN_REACH = WALL_DEPTH * 1.56 * 0.61;

export interface StoneWallColumnOptions extends BuildOptions {
  /**
   * Overall height. Rolled clear above its wall's own band when the caller says
   * nothing, so a pier is never overtopped by the wall it is meant to end —
   * which reads as a lump in the run rather than its terminus. A placer that
   * knows its run's height should say so and match it.
   */
  height?: number;
  /** Which way face 0 looks, in radians. Turns the whole pier. */
  phase?: number;
}

/**
 * How much wider than the square's a shape's faces are cut.
 *
 * A triangle's apothem is only a third of its face, so at the square's face
 * width it comes out visibly the smallest pier of the set. Widened, its faces
 * are broader and the pier reads at a comparable size; the pentagon is already
 * the largest and needs nothing.
 */
const FACE_SCALE: Record<number, number> = { 3: 1.5, 4: 1, 5: 1 };

export function buildColumn(
  name: string,
  made: Build,
  sides: number,
  { seed = 1, scale = 1, height, phase }: StoneWallColumnOptions = {},
): THREE.Mesh {
  const rng = createRng(seed);

  const face = made.depth * rng.range(1.32, 1.56) * (FACE_SCALE[sides] ?? 1);
  const rolled = rng.range(made.height[1] + 0.1, made.height[1] + 0.6);
  const tall = Math.max(height ?? rolled, made.height[0] + 0.2);
  const capH = rng.range(0.13, 0.19) * (made === LOW ? 0.85 : 1);
  const shaft = tall - capH;
  // Face 0 looks along +X unless a placer says otherwise, so a pier's own
  // bearing is a decision rather than a roll.
  const turned = phase ?? 0;

  const dry = rng.chance(0.5);
  const point = pointing(rng, dry);
  const colour = stoneColours(rng);

  const parts: Part[] = quoinedPolygon(rng, {
    sides,
    face,
    height: shaft,
    quoin: 0.13,
    // A pier's own, not the wall's: the panel between two quoins is barely a
    // stone and a half across, and asking for wall-sized stones in it gets one
    // cell filling the whole panel.
    stone: made === LOW ? rng.range(0.24, 0.3) : rng.range(0.28, 0.36),
    point,
    fill: hearting(rng, dry),
    colour,
    phase: turned,
  });

  // A cap, oversailing so rain comes off. Follows the plan rather than being a
  // box, or a triangular pier wears a square hat.
  const apothem = face / (2 * Math.tan(Math.PI / sides));
  const over = apothem * rng.range(1.14, 1.24);
  parts.push({
    geometry: upright(polygonPlan(sides, over, turned), shaft, shaft + capH),
    color: shade(colour(), rng.around(1.06, 0.05)),
    sway: 0,
  });

  const geometry = assemble(parts);
  if (scale !== 1) geometry.scale(scale, scale, scale);
  return finish(geometry, name, 0);
}

export const stoneWallSquareColumn: BuilderWith<StoneWallColumnOptions> = {
  name: 'stone-wall-square-column',
  category: 'structures',
  radius: 0.45,
  build: (options) => buildColumn('stone-wall-square-column', TALL, 4, options),
};

/**
 * The low wall's square pier.
 *
 * A gate cheek on a garden wall, or the end of one. Same masonry and same
 * quoined arrises, standing clear above the low wall's own band rather than the
 * tall one's — a pier scaled for a two-metre boundary looming over a wall you
 * can sit on is a gatepost with nothing to hold up.
 */
export const stoneWallSquareColumnLow: BuilderWith<StoneWallColumnOptions> = {
  name: 'stone-wall-square-column-low',
  category: 'structures',
  radius: 0.4,
  build: (options) => buildColumn('stone-wall-square-column-low', LOW, 4, options),
};
