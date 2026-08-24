import type { BuilderWith } from '../types';
import { buildQuadruped, porcineHead, type Species } from '../quadruped';
import { createRng } from '../random';
import { PALETTE } from '../palette';
import type { LifeOptions } from '../../life/spec';
import type { Fields } from '../schema';

// A pig: a torpedo on short legs, heavy at the ham, no neck to speak of. The head
// runs straight on from the shoulders, with a wedge face, a disc of a snout and
// ears flopped forward over it. The curl of tail does the rest.
const PORCINE: Species = {
  length: [0.83, 1.13],
  girth: [0.45, 0.59],
  legLength: [0.19, 0.27],
  legThickness: 0.038,
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
  neck: [0.09, 0.15],
  neckRise: [0, 0.2],
  neckThick: 0.34,
  headSize: [0.14, 0.18],
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
  options: { roam: { type: 'number', min: 0, max: 12, step: 0.1 }, face: { type: 'string' }, folk: { type: 'choice', options: ['country', 'city'] } } satisfies Fields,
  radius: 0.71,
  solid: false,
  build: (options = {}) =>
    buildQuadruped('porcine', PORCINE, createRng(options.seed ?? 1), options),
};
