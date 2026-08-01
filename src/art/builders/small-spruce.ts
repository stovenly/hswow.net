import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, heightRamp, type Part } from '../assemble';
import { whorl } from '../whorl';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';

/**
 * A young spruce: a dense narrow spire of staggered branch whorls standing in
 * the grass, with a bare leading shoot sticking out of the top of it.
 *
 * **Not the grown one scaled down, and the two differences are the ones you can
 * see from a distance.**
 *
 * - *Its branches reach the ground.* A mature spruce has shaded its own lower
 *   tiers out and stands on two metres of bare trunk; a young one in the open
 *   has kept every branch it ever grew, so the skirt sits in the grass and there
 *   is no trunk visible at all. That single fact is most of what reads as
 *   "young" — the same reasoning as `small-tree`'s parallel stem, applied to a
 *   tree whose whole outline is branches.
 * - *The leader is long and bare.* A conifer puts out one leading shoot a year
 *   and hangs the next whorl of branches off it the year after, so on a fast
 *   young tree there is always a bare spike of last summer's growth standing
 *   clear above the topmost tier — sometimes a fifth of the tree. On a mature
 *   one the same shoot is a hand's width against eight metres and vanishes.
 *
 * It is also proportionally *narrower* than the adult. A young spruce is a
 * spire; the tree only broadens out once it has height enough to afford the
 * side branches.
 *
 * ## Denser whorls, and fewer gaps
 *
 * The tiers here are rings of separate boughs for the same reason the adult's
 * are — see the long note in `whorl.ts` about why the scalloped cone this
 * replaced read as a stack of cones — but the two trees ask that shared code
 * for opposite things. A young spruce has lost nothing yet, so its rings are
 * nearly complete where the adult's are gappy, its boughs are shallower because
 * young wood is springy and carries almost nothing (the deep droop of the adult
 * is a decade of snow), and its whorls are packed close enough that the
 * staggering between them is what keeps the surface from closing into a cone.
 */
export const smallSpruce: MeshBuilder = {
  name: 'small-spruce',
  category: 'foliage',
  // Down from 1.3. The boughs of a whorl are shorter than the closed cone rim
  // they replaced, and a declared radius that over-states the footprint spaces
  // a thicket out into an orchard.
  radius: 1.1,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const height = rng.range(2.1, 3.4);
    // Narrow. Roughly half the adult's width-to-height ratio.
    const spread = height * rng.range(0.19, 0.24);
    const needle = rng.chance(0.35) ? shade(PALETTE.LEAF_DARK, 0.86) : PALETTE.LEAF_DARK;

    // Barely tapered, and hidden for its whole length. It exists so the whorls
    // have something to hang from and so the tree has a core: without it the
    // boughs share nothing but a bit of air near the axis.
    const butt = rng.range(0.045, 0.07);
    const stem = new THREE.CylinderGeometry(butt * 0.35, butt, height, 5);
    stem.translate(0, height / 2, 0);
    const stemRamp = heightRamp(0, height, 2.6);
    parts.push({
      geometry: stem,
      color: PALETTE.BARK,
      // Looser than the adult's 0.5 — a sapling this thin does whip about — but
      // still nothing like a broadleaf.
      sway: (x, y) => stemRamp(x, y) * 0.65,
    });

    // Where the whorls stop and the leading shoot begins.
    // **A shorter bare leader than before.** A young conifer genuinely does
    // carry a long leading shoot above its topmost whorl — that is the thing
    // this builder exists to show — but at 0.72–0.82 nearly a third of the
    // sapling was a bare stick, and it read as empty rather than as young. Kept
    // as a clear leader, just not a third of the tree.
    const crownTop = height * rng.range(0.84, 0.91);
    // Down from five to eight, for the same reason the adult's came down: the
    // boughs are needle cushions now, and stacking cushions closes the leader.
    // More rings in that shorter run, so the crown is a dense little cone
    // under the leader rather than a few plates with sky between them.
    const tiers = rng.int(6, 9);
    const lowest = rng.range(0.06, 0.16);
    let azimuth = rng.range(0, Math.PI * 2);

    for (let i = 0; i < tiers; i++) {
      const t = i / (tiers - 1);
      // Packed toward the top, as on the adult — a young conifer is denser than
      // a grown one, not sparser, because nothing has shaded out yet.
      const rise = t ** 0.85;
      // No die-back at the foot, unlike the adult: the bottom whorl is the
      // widest thing on the tree. The jitter is still wide enough to let a tier
      // come out narrower than the one above it, which is what keeps the
      // outline stepped rather than ruled.
      const radius = spread * (1 - t * 0.86) ** 0.85 * rng.range(0.86, 1.14) + 0.07;
      // Shallower than the adult's. Young branches are still springy and carry
      // almost nothing, so they sweep out rather than hang.
      const droop = rng.range(0.24, 0.42);
      // Capped two slots below the adult's seven. This tree is a third the size
      // and the same count of needle cushions would close the ring back into the
      // disc that whorls of separate boughs exist to avoid.
      const slots = Math.max(4, Math.min(7, Math.round(4.4 + radius * 2.2)));

      // Into the grass, and not through it. A bough hangs below its attachment,
      // so the bottom whorl has to be hung high enough for its tips to clear the
      // ground — otherwise the ground plane slices the skirt off in a dead
      // straight line, which is what the first version did. `whorl`'s own floor
      // is the backstop; this keeps the tier from being pressed flat against it.
      const attach = Math.max(
        lowest + (crownTop - lowest) * rise,
        radius * (droop * 1.3 + 0.25) + 0.05,
      );

      const boughs = whorl(rng, {
        y: attach,
        radius,
        droop,
        slots,
        azimuth,
        thickness: Math.min(0.06, Math.max(0.022, radius * 0.11)),
        // Nearly complete rings. A young spruce in the open has not lost a
        // branch in its life, and the gaps that do read come from the stagger
        // between whorls rather than from missing arms.
        gaps: rng.range(0.02, 0.12),
        // Just into the grass. `whorl` allows for the cushion's own depth on
        // top of this, so it is the height of the lowest visible needle.
        floor: 0.03,
      });

      const tone = shade(needle, (0.8 + t * 0.32) * rng.range(0.95, 1.05));
      boughs.forEach((geometry, piece) => {
        parts.push({
          geometry,
          color: tone,
          sway: 0.1 + t * t * 0.5 + (piece % 2) * 0.06,
        });
      });

      // Half a slot on, jittered. See the adult: this is the fix for whorls
      // whose gaps line up into vertical channels, and it matters more here
      // because these rings are closer together.
      azimuth += ((Math.PI * 2) / slots) * rng.range(0.32, 0.7) + rng.around(0, 0.22);
    }

    // The leading shoot: this year's growth, needles only at its tip. Sunk well
    // into the top of the stem rather than sitting on it — two cones meeting at
    // a shared cap is the classic way to open a hole in an otherwise closed
    // mesh, and overlapping them costs nothing.
    const candleLength = (height - crownTop) * rng.range(0.55, 0.8);
    const candle = new THREE.ConeGeometry(rng.range(0.05, 0.085), candleLength, 7);
    candle.translate(0, height - candleLength / 2 - 0.03, 0);
    parts.push({ geometry: candle, color: shade(needle, 1.15), sway: 0.6 });

    const geometry = assemble(parts);
    geometry.rotateY(rng.range(0, Math.PI * 2));
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'small-spruce', rng.range(0, Math.PI * 2));
  },
};
