import { cover } from '../book';
import { PALETTE, shade } from '../palette';

// A few sheets in a paper wrapper: the thinnest thing the family makes, and the
// only register the other covers do not reach. Shelved, it is a sliver between two
// spines and half of them will have slumped. No boards, no bands and no round.
export const pamphlet = cover('pamphlet', 'Pamphlet', {
  height: [0.15, 0.2],
  proportion: [0.7, 0.78],
  bulk: [0.03, 0.055],
  board: 0,
  square: 0,
  bands: [0, 0],
  round: 0,
  hide: [
    PALETTE.CLOTH,
    shade(PALETTE.CLOTH, 1.12),
    shade(PALETTE.WOOL, 0.86),
    shade(PALETTE.LEAF_DRY, 0.9),
  ],
});
