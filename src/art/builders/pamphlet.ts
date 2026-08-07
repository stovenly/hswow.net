import { cover } from '../book';
import { PALETTE, shade } from '../palette';

/**
 * A few sheets in a paper wrapper. The thinnest thing the family makes.
 *
 * Small and almost flat, which is the only register the covers do not otherwise
 * reach — everything else is a volume, and a shelf of nothing but volumes reads
 * as a set rather than as a collection. Shelved, a pamphlet is a sliver between
 * two spines and half of them will have slumped.
 *
 * No boards, no bands and no round: a stitched wrapper has none of the three,
 * and putting any of them on it would make it a small book instead.
 */
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
