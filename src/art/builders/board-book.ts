import { cover } from '../book';
import { PALETTE, shade } from '../palette';

/**
 * Pale boards, a cloth spine, square and plain. The shelf's filler.
 *
 * **This is the one that has to be dull.** A shelf stocked entirely from covers
 * that each make a point is a shelf where nothing is the point; what makes a
 * clasped tome read as a clasped tome is the twenty ordinary books either side
 * of it. So this has no bands, no clasps, no round on its back and nothing
 * whatever going on — and the seed is spent on colour instead, because a spine
 * is nearly all colour once it has no other features.
 *
 * Its display name is just *Book*. It is what somebody would call it.
 */
export const boardBook = cover('board-book', 'Book', {
  height: [0.19, 0.235],
  proportion: [0.62, 0.7],
  bulk: [0.1, 0.17],
  board: 0.004,
  square: 0.005,
  bands: [0, 0],
  round: 0.04,
  // Pale, and the boards deliberately duller than the spine — the half-binding
  // that gives a rank of these its whole variety.
  hide: [
    PALETTE.WOOL,
    shade(PALETTE.WOOL, 0.88),
    shade(PALETTE.CLOTH, 1.05),
    shade(PALETTE.HIDE_PALE, 1.05),
  ],
  spine: [
    shade(PALETTE.LEAF_DARK, 1.05),
    shade(PALETTE.COMB, 0.62),
    shade(PALETTE.HIDE, 0.9),
    shade(PALETTE.WATER, 1.35),
    shade(PALETTE.BRONZE, 0.72),
    PALETTE.HIDE_DARK,
  ],
});
