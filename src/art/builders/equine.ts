import type { MeshBuilder } from '../types';
import { buildQuadruped, type Species } from '../quadruped';
import { createRng } from '../random';
import { PALETTE } from '../palette';

/**
 * A horse. Legs and neck — everything that is not the barrel of the body.
 *
 * The longest legs and the highest-carried head in the set, and those two
 * numbers alone do most of the work. A horse's body is not much bigger than a
 * cow's; it simply stands further off the ground and looks over things rather
 * than at them.
 */
const EQUINE: Species = {
  length: [1.9, 2.2],
  girth: [0.75, 0.9],
  legLength: [0.95, 1.15],
  legThickness: 0.07,
  neck: [0.6, 0.8],
  neckRise: [0.75, 1.05],
  headSize: [0.2, 0.25],
  headStretch: 1.9,
  snout: 0.5,
  ears: 'perked',
  horns: 'none',
  tail: 'flowing',
  woolly: false,
  hide: [PALETTE.HIDE_DARK, PALETTE.HIDE, PALETTE.BARK],
  extremity: PALETTE.HIDE_DARK,
};

export const equine: MeshBuilder = {
  name: 'equine',
  category: 'animals',
  radius: 1.4,
  build: (options = {}) =>
    buildQuadruped('equine', EQUINE, createRng(options.seed ?? 1), options),
};
