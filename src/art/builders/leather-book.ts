import { cover } from '../book';
import { PALETTE, shade } from '../palette';

// Dark hide over boards, with raised bands across a rounded back: the heavy end
// of the shelf and the one every other cover is read against — the tallest, the
// thickest, and the only one whose spine is broken into panels. Sombre colours
// only.
export const leatherBook = cover('leather-book', 'Leather Bound Book', {
  height: [0.23, 0.29],
  proportion: [0.66, 0.72],
  bulk: [0.17, 0.26],
  board: 0.0045,
  square: 0.005,
  bands: [3, 5],
  round: 0.14,
  hide: [
    PALETTE.HIDE_DARK,
    shade(PALETTE.HIDE_DARK, 1.22),
    shade(PALETTE.BARK, 0.86),
    // Oxblood and a dark calf green — the two dyes a binder had that were not
    // brown, taken well down from the palette's own reds and greens.
    shade(PALETTE.COMB, 0.52),
    shade(PALETTE.LEAF_DARK, 0.78),
  ],
});
