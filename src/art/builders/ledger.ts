import { cover } from '../book';
import { PALETTE, shade } from '../palette';

// Tall, narrow and limp, with thongs hanging off the fore-edge — the one cover
// whose proportion is the discriminator rather than its size: nearly twice as tall
// as it is wide, so it stands a head above whatever is beside it. Limp, because a
// book that is written in was bound to be opened flat a thousand times.
export const ledger = cover('ledger', 'Ledger', {
  height: [0.33, 0.4],
  proportion: [0.4, 0.48],
  bulk: [0.055, 0.09],
  board: 0,
  square: 0,
  bands: [0, 0],
  round: 0.05,
  hide: [
    PALETTE.HIDE,
    shade(PALETTE.HIDE, 0.86),
    shade(PALETTE.HIDE_PALE, 0.82),
    shade(PALETTE.LEAF_DARK, 0.92),
  ],
});
