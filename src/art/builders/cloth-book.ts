import { cover } from '../book';
import { PALETTE, shade } from '../palette';

/**
 * Coloured cloth over thin boards. The colour note in the family.
 *
 * Everything else here is brown, grey or bone, because everything else is
 * leather, board or paper and none of those come in colours. Cloth does, and
 * this is the only cover that carries any — which is the point of it: a shelf
 * needs somewhere for the eye to land, and one green spine in thirty does more
 * for a library than another shape would.
 *
 * Thin boards, so it is slimmer than the leather book at nearly the same
 * height. Cloth over card is what a book is bound in when there are a lot of
 * them.
 */
export const clothBook = cover('cloth-book', 'Cloth Bound Book', {
  height: [0.2, 0.245],
  proportion: [0.6, 0.67],
  bulk: [0.08, 0.13],
  board: 0.0028,
  square: 0.004,
  bands: [0, 2],
  round: 0.08,
  hide: [
    shade(PALETTE.LEAF, 0.82),
    shade(PALETTE.COMB, 0.78),
    shade(PALETTE.WATER, 1.5),
    shade(PALETTE.BRONZE, 0.85),
    shade(PALETTE.PATINA, 1.1),
    shade(PALETTE.RUST, 1.05),
  ],
});
