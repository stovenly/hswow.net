import { cover } from '../book';
import { PALETTE, shade } from '../palette';

/**
 * Limp, pale, and no boards at all.
 *
 * The pale end of the shelf, and the one silhouette that is not a rectangle:
 * with nothing stiff inside it a vellum cover cockles, so it is wider than its
 * own block and its edges do not agree with each other. Shelved, it is the
 * spine that has gone soft between two that have not.
 *
 * Tall — nearly the leather book's height — and a third of its thickness, which
 * is what separates them at a glance.
 */
export const vellumBook = cover('vellum-book', 'Vellum Book', {
  height: [0.245, 0.3],
  proportion: [0.64, 0.72],
  bulk: [0.06, 0.1],
  board: 0,
  square: 0.0035,
  bands: [0, 1],
  round: 0.06,
  worn: 0.55,
  hide: [
    PALETTE.WOOL,
    shade(PALETTE.WOOL, 1.06),
    shade(PALETTE.HIDE_PALE, 1.12),
    shade(PALETTE.CLOTH, 1.18),
  ],
});
