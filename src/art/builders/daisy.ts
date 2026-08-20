import { species } from '../flower';

// Daisies: low, small-headed, many, and open flat. Most likely to be seen from
// directly above, which is why the petals barely cup — a daisy that curls its
// petals up is a marguerite.
export const daisy = species(
  'daisy',
  {
    height: [0.16, 0.36],
    stemThickness: 0.009,
    headSize: [0.034, 0.05],
    petals: 12,
    reach: 1.9,
    petalWidth: 0.24,
    cup: [0.05, 0.3],
    petal: [0xf2efe4, 0xe8e6da, 0xf0e2e6],
    centre: 0xe8c34a,
    count: [14, 26],
    spread: 0.42,
    leaves: 0,
    nod: 0,
  },
  0.45,
);
