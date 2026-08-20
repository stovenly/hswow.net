import { species } from '../flower';

// Sunflowers: tall, huge-headed, few, and nodding. The `nod` does most of the
// work — a sunflower's head is heavy enough to pull the stem over, and posture is
// the identifying feature.
export const sunflower = species(
  'sunflower',
  {
    height: [1.1, 1.9],
    stemThickness: 0.022,
    headSize: [0.1, 0.16],
    petals: 16,
    reach: 1.5,
    petalWidth: 0.3,
    cup: [0.15, 0.5],
    petal: [0xe8b53a, 0xdca62c, 0xefc352],
    centre: 0x5b442a,
    count: [3, 7],
    spread: 0.4,
    leaves: 2,
    nod: 0.85,
    // A fifth of a turn of slop. Enough that no two heads are parallel, far
    // too little to lose the fact that they are all looking one way.
    facing: 0.6,
  },
  0.75,
);
