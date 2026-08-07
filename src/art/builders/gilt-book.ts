import { cover } from '../book';
import { PALETTE, shade } from '../palette';

/**
 * Pale calf with bright bands. The one spine that catches the light.
 *
 * Every other cover is darker than the wall behind it. This one is not, and
 * that is its whole job: a shelf read across the room is a dark band with a
 * texture, and one book in it that returns the light is what makes the band
 * read as *books* rather than as a dark band.
 *
 * The bands are the bright part rather than the boards, which is both correct
 * — gilt goes on the spine, where it can be read — and the only version that
 * survives being shelved, since the boards are inside the next book along.
 */
export const giltBook = cover('gilt-book', 'Gilt Book', {
  height: [0.26, 0.32],
  proportion: [0.62, 0.68],
  bulk: [0.14, 0.2],
  board: 0.005,
  square: 0.005,
  bands: [4, 6],
  round: 0.15,
  hide: [
    shade(PALETTE.HIDE_PALE, 1.08),
    shade(PALETTE.HIDE_PALE, 0.94),
    shade(PALETTE.BARK_PALE, 1.22),
  ],
  // Brighter than anything it is bound in — the bands are metal leaf, not hide.
  spine: [PALETTE.BRONZE, shade(PALETTE.BRONZE, 1.2), shade(PALETTE.MARKER_YELLOW, 1.05)],
});
