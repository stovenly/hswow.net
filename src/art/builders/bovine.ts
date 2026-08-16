import type { BuilderWith } from '../types';
import { buildQuadruped, bovineHead, type Species } from '../quadruped';
import { createRng } from '../random';
import { PALETTE } from '../palette';
import type { LifeOptions } from '../../life/spec';

/**
 * Cattle. Long and boxy, short in the leg, head carried low.
 *
 * A little under a real cow — about 1.4 m nose to tail rather than two
 * metres. At full size it dwarfed the village and the villagers beside it.
 *
 * The profile is a rectangle with a sagging belly and a high tail-head, on a
 * six-sided loft so the spine reads as a ridge and the belly as a slab. Black
 * and white, because a brown cow and a brown horse at forty metres are the
 * same animal.
 */
const BOVINE: Species = {
  length: [1.3, 1.56],
  girth: [0.58, 0.72],
  legLength: [0.44, 0.55],
  legThickness: 0.056,
  hock: 0.14,
  feet: 'hoof',
  body: [
    { z: -0.5, y: 0.14, rx: 0.2, ry: 0.2 },
    { z: -0.4, y: 0.06, rx: 0.34, ry: 0.42 },
    { z: -0.2, y: 0.0, rx: 0.37, ry: 0.48 },
    { z: 0.05, y: -0.03, rx: 0.38, ry: 0.53 },
    { z: 0.28, y: 0.02, rx: 0.34, ry: 0.5 },
    { z: 0.42, y: 0.06, rx: 0.28, ry: 0.42 },
    { z: 0.5, y: 0.08, rx: 0.16, ry: 0.26 },
  ],
  sides: 6,
  woolly: false,
  neck: [0.28, 0.36],
  neckRise: [0.05, 0.3],
  neckThick: 0.3,
  headSize: [0.17, 0.2],
  headPitch: 0.45,
  head: bovineHead,
  tail: 'switch',
  hide: [PALETTE.WOOL, PALETTE.STONE_PALE],
  extremity: PALETTE.HOG,
  hair: [PALETTE.COW_BLACK, PALETTE.HIDE_DARK],
  patch: [PALETTE.COW_BLACK, PALETTE.COW_BLACK, PALETTE.HIDE_DARK],
  patchCoverage: 0.46,
  walkSpeed: 0.5,
  call: 'cow',
  grazes: true,
};

export const bovine: BuilderWith<LifeOptions> = {
  name: 'bovine',
  category: 'animals',
  radius: 0.95,
  // Alive: the player is stopped by the creature itself, not by a ghost of
  // where it was built. See LIFE.md §7.
  solid: false,
  build: (options = {}) =>
    buildQuadruped('bovine', BOVINE, createRng(options.seed ?? 1), options),
};
