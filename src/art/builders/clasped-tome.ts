import { cover } from '../book';
import { PALETTE, shade } from '../palette';

/**
 * The heaviest thing on the shelf: thick boards, iron over the fore-edge.
 *
 * Taller and half again as thick as the leather book, which is the whole point
 * of it — a shelf needs one volume that the others are read against, and
 * thickness is the only proportion that separates two dark spines at ten paces.
 *
 * The clasps are not decoration. They are what a shelved tome shows that
 * nothing else in the family does: a shelf is read across the gaps between
 * spines, and iron standing in the gap is visible where tooling on a front
 * board is not.
 */
export const claspedTome = cover('clasped-tome', 'Clasped Tome', {
  height: [0.3, 0.37],
  proportion: [0.66, 0.73],
  bulk: [0.24, 0.34],
  board: 0.007,
  square: 0.007,
  bands: [4, 6],
  round: 0.16,
  furniture: 'clasps',
  hide: [
    shade(PALETTE.HIDE_DARK, 0.82),
    PALETTE.HIDE_DARK,
    shade(PALETTE.BARK, 0.78),
    shade(PALETTE.COMB, 0.4),
  ],
});
