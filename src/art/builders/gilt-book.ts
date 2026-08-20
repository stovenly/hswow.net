import { cover } from '../book';
import { PALETTE, shade } from '../palette';

// Pale calf with bright bands: the one spine that catches the light, so a shelf
// read across the room is books rather than a dark band. The bands are the bright
// part rather than the boards — gilt goes on the spine, and the boards are inside
// the next book along.
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
