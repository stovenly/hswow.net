import { cover } from '../book';
import { PALETTE, shade } from '../palette';

/**
 * Cocked boards, and a block of leaves that no longer agrees with them.
 *
 * **The family needs one of these and exactly one.** Every other cover is built
 * square, and a shelf of nothing but square books reads as a shop — a rank
 * where each spine is the same rectangle at a different size. One that has been
 * sat on is the cheapest thing that says the others were looked after.
 *
 * Not damage a placer could add, and not a roll on the ordinary covers either.
 * It is its own builder because it is its own object: somebody would call this
 * a battered book and would not call the one beside it a pristine one.
 */
export const batteredBook = cover('battered-book', 'Battered Book', {
  height: [0.21, 0.27],
  proportion: [0.63, 0.72],
  bulk: [0.13, 0.21],
  board: 0.005,
  square: 0.007,
  bands: [1, 3],
  round: 0.1,
  worn: 1,
  hide: [
    shade(PALETTE.HIDE_DARK, 1.1),
    shade(PALETTE.BARK, 1.05),
    shade(PALETTE.EARTH, 1.15),
    shade(PALETTE.HIDE, 0.88),
  ],
});
