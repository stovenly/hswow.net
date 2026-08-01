import { species } from '../flower';

/**
 * Poppies: mid-height, wide-petalled, cupped, and sparse.
 *
 * Four broad petals rather than a dozen narrow ones, cupped hard. The colour is
 * the point — this is the only saturated red in the kit, and a few of them
 * scattered through a meadow do more for it than any amount of green.
 */
export const poppy = species(
  'poppy',
  {
    height: [0.42, 0.75],
    stemThickness: 0.011,
    headSize: [0.032, 0.05],
    petals: 5,
    reach: 2.2,
    petalWidth: 0.62,
    cup: [0.55, 0.95],
    petal: [0xb8342a, 0xc4402c, 0xa82c34],
    centre: 0x2a231c,
    count: [4, 9],
    spread: 0.5,
    leaves: 1,
    nod: 0.25,
  },
  0.55,
);
