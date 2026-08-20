import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, heightRamp, type Part } from '../assemble';
import { whorl } from '../whorl';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';

// A young spruce: a dense narrow spire of staggered branch whorls standing in the
// grass, with a bare leading shoot out of the top. Not the grown one scaled down —
// its branches reach the ground, where a mature spruce has shaded its lower tiers
// out and stands on bare trunk, and its leader is a long bare spike of last
// summer's growth. Proportionally narrower than the adult, with nearly complete
// rings and shallower boughs, packed close enough that the stagger between them is
// what keeps the surface from closing into a cone.
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

    // Where the whorls stop and the leading shoot begins. A clear leader, but not a
    // third of the tree — at that length the sapling reads as empty rather than
    // young.
    const crownTop = height * rng.range(0.84, 0.91);
    // Fewer tiers than the adult, for the same reason its own count came down: the
    // boughs are needle cushions, and stacking cushions closes the leader. More
    // rings in that shorter run, so the crown is a dense little cone.
    const tiers = rng.int(6, 9);
    const lowest = rng.range(0.06, 0.16);
    let azimuth = rng.range(0, Math.PI * 2);

    for (let i = 0; i < tiers; i++) {
      const t = i / (tiers - 1);
      // Packed toward the top, as on the adult — a young conifer is denser than
      // a grown one, not sparser, because nothing has shaded out yet.
      const rise = t ** 0.85;
      // No die-back at the foot, unlike the adult: the bottom whorl is the widest
      // thing on the tree. The jitter still lets a tier come out narrower than the
      // one above it, which keeps the outline stepped rather than ruled.
      const radius = spread * (1 - t * 0.86) ** 0.85 * rng.range(0.86, 1.14) + 0.07;
      // Shallower than the adult's. Young branches are still springy and carry
      // almost nothing, so they sweep out rather than hang.
      const droop = rng.range(0.24, 0.42);
      // Capped two slots below the adult's seven. This tree is a third the size
      // and the same count of needle cushions would close the ring back into the
      // disc that whorls of separate boughs exist to avoid.
      const slots = Math.max(4, Math.min(7, Math.round(4.4 + radius * 2.2)));

      // Into the grass, and not through it: a bough hangs below its attachment, so
      // the bottom whorl has to be hung high enough for its tips to clear the ground
      // or the ground plane slices the skirt off in a straight line.
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

    // The leading shoot: this year's growth, needles only at its tip. Sunk well into
    // the top of the stem rather than sitting on it — two cones meeting at a shared
    // cap is the classic way to open a hole in an otherwise closed mesh.
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
