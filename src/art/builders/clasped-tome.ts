import { cover } from '../book';
import { PALETTE, shade } from '../palette';

// The heaviest thing on the shelf: thick boards, iron over the fore-edge. Taller
// and half again as thick as the leather book, because thickness is the only
// proportion that separates two dark spines at ten paces. The clasps stand in the
// gap between spines, which is where a shelf is read.
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
