import * as THREE from 'three';
import type { BuilderWith, BuildOptions } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { shade } from '../palette';
import { hearting, pointing, quoinedPier, roughBox, stoneColours } from '../masonry';
import { LOW, TALL, WALL_DEPTH, type Build } from './stone-wall';

/**
 * A stone pier: the end of a wall, the corner of one, or the cheek of a gate.
 *
 * `stone-wall` carries no piers, so this is what a run is finished or turned
 * with. Wider than the wall on both axes and taller than its band, so it stands
 * proud whichever face a run butts into — a corner is two walls and one of
 * these, and needs no special piece.
 *
 * Quoined, which is `art/masonry`'s doing and is structural in two senses: it is
 * what stops the four skins poking through each other at the corners, and it is
 * why a pier reads as stronger than the wall beside it. A rubble panel between
 * dressed quoins says *somebody squared this up* in one glance.
 *
 * `stone-wall-column-low` is the same pier sized to `LOW`, for the low wall.
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
}

export function buildColumn(
  name: string,
  made: Build,
  { seed = 1, scale = 1, height }: StoneWallColumnOptions = {},
): THREE.Mesh {
  const rng = createRng(seed);

  const width = made.depth * rng.range(1.32, 1.56);
  const rolled = rng.range(made.height[1] + 0.1, made.height[1] + 0.6);
  const tall = Math.max(height ?? rolled, made.height[0] + 0.2);
  const capH = rng.range(0.13, 0.19) * (made === LOW ? 0.85 : 1);
  const shaft = tall - capH;

  const dry = rng.chance(0.5);
  const point = pointing(rng, dry);
  const colour = stoneColours(rng);

  const parts: Part[] = quoinedPier(rng, {
    width,
    depth: width,
    height: shaft,
    quoin: 0.13,
    // A pier's own, not the wall's: the panel between two quoins is barely a
    // stone and a half across, and asking for wall-sized stones in it gets one
    // cell filling the whole panel.
    stone: made === LOW ? rng.range(0.24, 0.3) : rng.range(0.28, 0.36),
    point,
    fill: hearting(rng, dry),
    colour,
  });

  // A cap, overhanging so rain comes off the pier instead of down through it.
  // The one part of a wall like this anybody dressed.
  const over = width * rng.range(0.55, 0.61);
  parts.push({
    geometry: roughBox(rng, [-over, over], [shaft, shaft + capH], [-over, over], 0.008),
    color: shade(colour(), rng.around(1.06, 0.05)),
    sway: 0,
  });

  const geometry = assemble(parts);
  if (scale !== 1) geometry.scale(scale, scale, scale);
  return finish(geometry, name, 0);
}

export const stoneWallColumn: BuilderWith<StoneWallColumnOptions> = {
  name: 'stone-wall-column',
  category: 'structures',
  radius: 0.45,
  build: (options) => buildColumn('stone-wall-column', TALL, options),
};
