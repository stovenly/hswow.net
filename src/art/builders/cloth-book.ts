import { cover } from '../book';
import { PALETTE, shade } from '../palette';

// Coloured cloth over thin boards: the only cover in the family that carries any
// colour, because everything else is leather, board or paper. A shelf needs
// somewhere for the eye to land. Thin boards, so it is slimmer than the leather
// book at nearly the same height.
export const clothBook = cover('cloth-book', 'Cloth Book', {
  height: [0.2, 0.245],
  proportion: [0.6, 0.67],
  bulk: [0.08, 0.13],
  board: 0.0028,
  square: 0.004,
  bands: [0, 2],
  round: 0.08,
  hide: [
    { color: shade(PALETTE.LEAF, 0.82), word: 'Green' },
    { color: shade(PALETTE.COMB, 0.78), word: 'Red' },
    { color: shade(PALETTE.WATER, 1.5), word: 'Blue' },
    { color: shade(PALETTE.BRONZE, 0.85), word: 'Olive' },
    { color: shade(PALETTE.PATINA, 1.1), word: 'Sage' },
    { color: shade(PALETTE.RUST, 1.05), word: 'Rust' },
  ],
});
