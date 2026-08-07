import { cover } from '../book';
import { PALETTE, shade } from '../palette';

/**
 * Tall, narrow and limp, with thongs hanging off the fore-edge.
 *
 * The one cover in the family whose *proportion* is the discriminator rather
 * than its size. A ledger is nearly twice as tall as it is wide, so it stands
 * a head above whatever is beside it and shows a spine half the width — which
 * is legible from across a room in a way that another dark rectangle of the
 * same shape would not be.
 *
 * Limp, because a book that is written *in* rather than printed was bound to be
 * opened flat on a desk a thousand times, and boards do not survive that.
 */
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
