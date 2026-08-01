import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, heightRamp, type Part } from '../assemble';
import { whorl } from '../whorl';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';

/**
 * A spruce: one straight stem, staggered whorls of drooping boughs, dark all
 * year.
 *
 * The kit had no evergreen at all, which is a bigger hole than it sounds. Every
 * broadleaf here is some version of *mass on a stick* — the generic tree, the
 * bush, the sapling — so a wood built from them has one silhouette repeated at
 * different sizes. A conifer is the opposite shape in every respect: narrow
 * where they are wide, straight where they lean, tiered where they are lumpy,
 * and much darker. One of them on a ridge changes the whole read of a treeline.
 *
 * **The stem runs unbroken from root to tip and that is the species.** An oak
 * forks and loses its trunk in the crown; a spruce never does — the leader wins
 * for the tree's whole life and every branch is a side shoot off it. Build it
 * with a fork anywhere and you have made a strange dark broadleaf.
 *
 * ## Whorls, and why the first version read as a stack of cones
 *
 * A solid cone is what everybody builds first and it reads as a hat, so this
 * was built as tiers from the start — branches come off a conifer in *whorls*,
 * a ring of them per year's growth with a clear gap of bare stem between one
 * ring and the next, and the stepped outline that gives is most of what
 * survives the render pipeline chunking everything to three-pixel blocks.
 *
 * That was right and it was not enough. Each tier was one closed scalloped
 * cone, and art direction called the result exactly what it was: *a series of
 * cones rather than a proper spruce*. Two things were wrong with it, and both
 * are now fixed in `whorl.ts` rather than here:
 *
 * - **A closed rim has no sky in it.** A whorl is separate arms with daylight
 *   between them, so slots are now left deliberately empty and bough length
 *   varies by half either side of nominal. The outline is broken instead of
 *   ruled, which is what a real conifer's is.
 * - **Each tier was turned at random, which is not the same as staggered.**
 *   The old build did give every cone a fresh rotation and it bought nothing:
 *   an independent draw puts two neighbours nearly in phase as often as chance
 *   allows, and phase means nothing on a rim with no gaps in it anyway. The
 *   `azimuth` is now *carried* from one tier to the next and advanced by about
 *   half a bough's spacing, so each ring's arms sit over the gaps in the ring
 *   below by construction rather than by luck.
 *
 * Tier radius is also allowed to run *backwards*. A real spruce's widest whorl
 * is not reliably its lowest one, and a tier a little narrower than the tier
 * above it is the single cheapest thing that stops the profile looking drawn
 * with a straightedge. The lowest tier is separately shortened, because bottom
 * branches are the first to be shaded out and die back — the widest point of a
 * grown spruce is a metre or two off the ground, not at the foot.
 *
 * The frayed-tip rods that used to be scattered over the tiers are gone with
 * the cones. They existed to break a clean stepped outline that no longer
 * exists: varying bough length does the same job from inside the whorl, where
 * the branch is attached to something.
 *
 * ## Sway
 *
 * Much stiffer than any broadleaf here, and the authored weights say so rather
 * than leaving it to `FLEX`. A spruce bough is a stiff woody arm carrying a few
 * kilos of needles: in wind the tree hisses and the top few metres nod, and the
 * lower tiers barely move at all. The weights therefore rise from nothing at the
 * bottom tier to about half at the leader — where a broadleaf crown would be at
 * one — and the whole thing is scaled again by the species' entry in `FLEX`.
 */
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
    // Curve 3, against the generic tree's 2.2: the ramp stays near zero for most
    // of the trunk and only lets go near the top, which is how a stem this
    // straight and this thick actually bends. Halved on the way out, because
    // even the tip of a spruce moves less than a broadleaf's mid-branch.
    const stemRamp = heightRamp(0, height, 3);
    parts.push({
      geometry: stem,
      color: PALETTE.BARK,
      sway: (x, y) => stemRamp(x, y) * 0.5,
    });

    // **Fewer than the first two builds' nine to thirteen, and that is a
    // consequence of the boughs getting fat.** A whorl of thin blades could be
    // stacked half a metre apart and still show the leader between rings; a
    // whorl of half-metre-thick needle cushions at the same spacing closes the
    // gap and the tree is a cone again. Thickness and count are one decision.
    // **More tiers, and carried nearer the apex.** Seven to ten whorls up an
    // eight-metre tree is a gap of most of a metre between them, which reads as
    // a pole with plates on it rather than as a dense evergreen — and stopping
    // the top ring at 0.86–0.92 of the height left the last half-metre as bare
    // leader, so the tree finished in a spike of *wood* instead of needle.
    //
    // A spruce is densest at the top. The tiers already crowd upward (see
    // `rise` below); what was missing was enough of them to crowd, and somewhere
    // near the point for the last few to sit.
    const tiers = rng.int(12, 16);
    const lowest = height * rng.range(0.14, 0.24);
    const highest = height * rng.range(0.94, 0.98);
    // Where the bottom ring's first bough points. Every ring above turns off
    // this one, and the running total is the whole staggering mechanism.
    let azimuth = rng.range(0, Math.PI * 2);

    for (let i = 0; i < tiers; i++) {
      const t = i / (tiers - 1);
      // **Tiers crowd together toward the top.** Spaced evenly they do the
      // opposite of what they should: the boughs shrink as they climb, so equal
      // gaps mean the crown — the densest part of a real spruce, and the part
      // that makes the top of the silhouette a solid dark spike — comes out as
      // a handful of small plates with sky between them. A power under one
      // spreads the lower tiers and packs the upper ones.
      const rise = t ** 0.8;
      // Taper is deliberately gentler than linear near the base and steeper at
      // the top, so the profile is a slightly concave cone rather than a
      // triangle. Straight-sided conifers look machined.
      //
      // The ±17% is wide enough to run the profile backwards now and then, and
      // that is the point: a tier narrower than the one above it is what makes
      // the outline ragged. Narrow it and the tree is a ruled cone again.
      const shaded = i === 0 ? rng.range(0.74, 0.9) : 1;
      const radius = spread * (1 - t) ** 0.78 * rng.range(0.83, 1.17) * shaded + 0.14;
      const droop = rng.range(0.34, 0.55);
      // More arms on a wide ring than on a narrow one. A fixed count would
      // either leave the bottom tier as four spokes or pack the top ones back
      // into the solid disc this build exists to get away from.
      // Up from a 3.4 base and a ceiling of seven. The narrow upper rings were
      // bottoming out at three arms — a bough, a gap, a bough — which is what
      // made the crown look moth-eaten from below.
      const slots = Math.max(4, Math.min(9, Math.round(4.4 + radius * 1.8)));

      // **Clamped clear of the ground.** A bough hangs *below* the point it is
      // attached at, so a low attachment on a wide bottom tier puts the tips
      // underground — where they show as a hard straight line cut across the
      // skirt by the ground plane. The bottom tier of a tall spruce is normally
      // well above this anyway; the clamp is for the rolls where it is not.
      const attach = Math.max(
        lowest + (highest - lowest) * rise,
        // Reach, droop and the cushion's own depth, all of which hang below the
        // attachment. `whorl` would clamp anyway; hanging the tier high enough
        // that it does not have to is the difference between a skirt and a row
        // of boughs pressed flat against a glass floor.
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

      // **The stagger.** Turned by roughly half a slot, so this ring's boughs
      // sit over the gaps in the one below and its gaps sit over their boughs.
      // A constant offset would be a helix — regular from any angle you looked
      // hard enough — so it is jittered, and jittered by a slot fraction rather
      // than a fixed angle so the offset stays meaningful as the rings lose
      // arms toward the top.
      azimuth += ((Math.PI * 2) / slots) * rng.range(0.32, 0.7) + rng.around(0, 0.22);
    }

    const geometry = assemble(parts);
    geometry.rotateY(rng.range(0, Math.PI * 2));
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'spruce', rng.range(0, Math.PI * 2));
  },
};
