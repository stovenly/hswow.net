import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, heightRamp, type Part } from '../assemble';
import { whorl } from '../whorl';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';

// A spruce: one straight stem, staggered whorls of drooping boughs, dark all year
// — the opposite shape to every broadleaf here.
//
// The stem runs unbroken from root to tip and that is the species: a spruce's
// leader wins for the tree's whole life, and a fork anywhere makes it a strange
// dark broadleaf. Branches come off in whorls, a ring per year's growth with bare
// stem between, and the stepped outline is what survives three-pixel blocks.
// `azimuth` is carried from one tier to the next and advanced by about half a
// bough's spacing, so each ring's arms sit over the gaps in the ring below by
// construction. Tier radius may run backwards, and the lowest tier is separately
// shortened, because bottom branches are the first to be shaded out.
//
// Much stiffer than any broadleaf, and the authored weights say so: they rise from
// nothing at the bottom tier to about half at the leader, then scale again by
// `FLEX`.
export const spruce: MeshBuilder = {
  name: 'spruce',
  category: 'foliage',
  radius: 2.6,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const height = rng.range(6.2, 8.8);
    const spread = height * rng.range(0.2, 0.25);
    const needle = rng.chance(0.3) ? shade(PALETTE.LEAF_DARK, 0.82) : PALETTE.LEAF_DARK;

    // The stem. Tapered hard and taken the full height — the tip of a spruce is
    // a bare shoot standing clear of the topmost branches, and leaving it out is
    // the difference between a spruce and a Christmas decoration.
    const butt = rng.range(0.16, 0.24);
    const stem = new THREE.CylinderGeometry(butt * 0.16, butt, height, 6);
    stem.translate(0, height / 2, 0);
    // Curve 3, against the generic tree's 2.2: the ramp stays near zero for most of
    // the trunk and only lets go near the top. Halved on the way out, because even
    // the tip of a spruce moves less than a broadleaf's mid-branch.
    const stemRamp = heightRamp(0, height, 3);
    parts.push({
      geometry: stem,
      color: PALETTE.BARK,
      sway: (x, y) => stemRamp(x, y) * 0.5,
    });

    // Thickness and count are one decision: a whorl of thin blades can be stacked
    // half a metre apart and still show the leader between rings, where a whorl of
    // half-metre needle cushions at the same spacing closes the gap. A spruce is
    // densest at the top, so the tiers crowd upward and enough of them are carried
    // near the apex that the tree does not finish in a spike of bare wood.
    const tiers = rng.int(12, 16);
    const lowest = height * rng.range(0.14, 0.24);
    const highest = height * rng.range(0.94, 0.98);
    // Where the bottom ring's first bough points. Every ring above turns off
    // this one, and the running total is the whole staggering mechanism.
    let azimuth = rng.range(0, Math.PI * 2);

    for (let i = 0; i < tiers; i++) {
      const t = i / (tiers - 1);
      // Tiers crowd together toward the top. Spaced evenly they do the opposite of
      // what they should: the boughs shrink as they climb, so equal gaps leave the
      // crown as a handful of small plates with sky between them. A power under one
      // spreads the lower tiers and packs the upper ones.
      const rise = t ** 0.8;
      // Taper gentler than linear near the base and steeper at the top, so the
      // profile is a slightly concave cone rather than a triangle — straight-sided
      // conifers look machined. The ±17% is wide enough to run the profile backwards
      // now and then, which is what makes the outline ragged.
      const shaded = i === 0 ? rng.range(0.74, 0.9) : 1;
      const radius = spread * (1 - t) ** 0.78 * rng.range(0.83, 1.17) * shaded + 0.14;
      const droop = rng.range(0.34, 0.55);
      // More arms on a wide ring than on a narrow one: a fixed count either leaves
      // the bottom tier as four spokes or packs the top ones back into a solid disc.
      // Narrow upper rings bottoming out at three arms is what makes a crown look
      // moth-eaten from below.
      const slots = Math.max(4, Math.min(9, Math.round(4.4 + radius * 1.8)));

      // Clamped clear of the ground: a bough hangs below the point it is attached
      // at, so a low attachment on a wide bottom tier puts the tips underground,
      // where the ground plane cuts a hard straight line across the skirt.
      const attach = Math.max(
        lowest + (highest - lowest) * rise,
        // Reach, droop and the cushion's own depth, all of which hang below the
        // attachment. `whorl` would clamp anyway; hanging the tier high enough that
        // it does not have to is the difference between a skirt and a row of boughs
        // pressed flat against a glass floor.
        radius * (droop * 1.45 + 0.25) + 0.15,
      );

      const boughs = whorl(rng, {
        y: attach,
        radius,
        droop,
        slots,
        azimuth,
        // The woody inner end, before the needles thicken up. Everything past
        // it is sized from the bough's own reach inside `whorl`.
        thickness: Math.min(0.1, Math.max(0.035, radius * 0.12)),
        // Fewer missing arms than before. Sky *between* whorls is the thing
        // that says conifer; sky inside one just reads as a sparse tree, and
        // with the rings this close together the vertical gaps carry it alone.
        gaps: rng.range(0.02, 0.1),
        // The lowest visible needle, not the lowest branch axis — `whorl` adds
        // the cushion's own depth on top.
        floor: 0.12,
      });

      // Lighter toward the top, where the light is, and a shade either side of
      // that per bough. A conifer in one flat green is a cutout; the gradient is
      // what gives it depth once the quantizer has flattened everything else.
      const tone = shade(needle, (0.76 + t * 0.34) * rng.range(0.94, 1.06));
      boughs.forEach((geometry, piece) => {
        parts.push({
          geometry,
          color: tone,
          // The outer half of each bough is a shade looser than its inner half:
          // it is the thinnest wood on the tree and the furthest from support.
          // `whorl` returns inner, outer, inner, outer.
          sway: 0.06 + t * t * 0.4 + (piece % 2) * 0.06,
        });
      });

      // The stagger: turned by roughly half a slot, so this ring's boughs sit over
      // the gaps in the one below. A constant offset would be a helix, so it is
      // jittered — and jittered by a slot fraction rather than a fixed angle, so the
      // offset stays meaningful as the rings lose arms toward the top.
      azimuth += ((Math.PI * 2) / slots) * rng.range(0.32, 0.7) + rng.around(0, 0.22);
    }

    const geometry = assemble(parts);
    geometry.rotateY(rng.range(0, Math.PI * 2));
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'spruce', rng.range(0, Math.PI * 2));
  },
};
