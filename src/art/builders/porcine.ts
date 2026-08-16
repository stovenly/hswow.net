import type { BuilderWith } from '../types';
import { buildQuadruped, porcineHead, type Species } from '../quadruped';
import { createRng } from '../random';
import { PALETTE } from '../palette';
import type { LifeOptions } from '../../life/spec';

/**
 * A pig. A torpedo on short legs, heavy at the ham, no neck to speak of.
 *
 * The head runs straight on from the shoulders — the neck is short and level
 * — with a wedge face, a disc of a snout, and ears flopped forward over it.
 * The curl of tail does the rest.
 */
const PORCINE: Species = {
  length: [1.1, 1.5],
  girth: [0.6, 0.78],
  legLength: [0.25, 0.36],
  legThickness: 0.05,
  hock: 0.1,
  feet: 'hoof',
  body: [
    { z: -0.5, y: 0.0, rx: 0.26, ry: 0.3 },
    { z: -0.36, y: 0.0, rx: 0.4, ry: 0.48 },
    { z: -0.12, y: 0.02, rx: 0.42, ry: 0.5 },
    { z: 0.15, y: 0.0, rx: 0.42, ry: 0.5 },
    { z: 0.38, y: 0.02, rx: 0.38, ry: 0.46 },
    { z: 0.5, y: 0.04, rx: 0.28, ry: 0.36 },
  ],
  sides: 8,
  woolly: false,
  neck: [0.12, 0.2],
  neckRise: [0, 0.2],
  neckThick: 0.34,
  headSize: [0.19, 0.24],
  headPitch: 0.3,
  head: porcineHead,
  tail: 'curl',
  hide: [PALETTE.HOG, PALETTE.HIDE_PALE, PALETTE.HIDE_DARK],
  extremity: PALETTE.HOG,
  hair: [PALETTE.HOG],
  patch: [PALETTE.HIDE_DARK, PALETTE.HIDE],
  patchCoverage: 0.3,
  walkSpeed: 0.5,
  call: 'pig',
  grazes: true,
};

export const porcine: BuilderWith<LifeOptions> = {
  name: 'porcine',
  category: 'animals',
  radius: 0.95,
  solid: false,
  build: (options = {}) =>
    buildQuadruped('porcine', PORCINE, createRng(options.seed ?? 1), options),
};
