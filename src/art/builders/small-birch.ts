import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, heightRamp, type Part } from '../assemble';
import { lumpySphere } from '../blob';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';
import { rod } from '../rod';

/**
 * A young birch: one whippy stem, a handful of branches, a wisp of crown.
 *
 * Written as its own builder rather than as `birch` with `scale` set, because a
 * scaled tree is a tree seen from further off and a sapling is a different
 * shape. Three differences, and all three are visible at a glance:
 *
 * - **It bends.** A mature birch is a near-vertical pole; a three-metre one is
 *   a wand, and its top wanders visibly off the axis of its foot. The lean here
 *   is four times the adult's as a fraction of height.
 * - **There is no black foot.** The fissured base an old birch carries is the
 *   work of decades. A young one is smooth to the ground, and it is *browner* —
 *   the famous white comes in from the top as the tree ages, so a sapling is a
 *   warm buff that only just reads as pale.
 * - **The crown is a few tufts, not a mass.** Four branches, one twig each. You
 *   can see the whole stem through it, which is the thing that says young.
 *
 * The unequal-segment trick for the bands is `birch`'s and the reasoning is
 * written up there, clustering included. Bands are thinner and sparser here:
 * they are one of the last markings to develop, and a sapling ringed like an
 * adult reads as a mature tree that has been shrunk — the exact mistake this
 * builder exists to avoid.
 *
 * *Sparser than an adult's* was taken too far the first time. At a flat 16% per
 * segment with pale runs of nearly half a metre, a three-metre stem carried one
 * or two marks, and one or two marks is indistinguishable from none: the stem
 * read as a plain brown pole, which is not a young birch, it is a stick. There
 * are five or six now, still finer and further apart than the adult's, and the
 * bottom tenth stays clean because the marks come in from the top downward.
 */

const TAU = Math.PI * 2;

/** Warmer and darker than `birch`'s white. Young bark has not bleached yet. */
const YOUNG_BARK = 0xc2b9a2;
const YOUNG_BAND = 0x5c5445;

export const smallBirch: MeshBuilder = {
  name: 'small-birch',
  category: 'foliage',
  radius: 1.3,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    // Stem height. The leader tuft sits on top of it, so the tree measures
    // fifteen or twenty centimetres more than this.
    const height = rng.range(2.2, 3.05);
    // Nearly parallel-sided. A sapling carries almost no load and has almost
    // no taper, and the taper is most of what the eye uses to judge age.
    const butt = rng.range(0.032, 0.05);
    const crownBase = height * rng.range(0.5, 0.62);

    const bendAt = rng.range(0, TAU);
    const bend = rng.range(0.18, 0.42);
    // A shallower exponent than the adult's, so the bend starts lower and the
    // whole stem is curved rather than just the top of it.
    const spine = (y: number): THREE.Vector3 => {
      const t = y / height;
      const off = bend * t ** 1.7;
      return new THREE.Vector3(Math.cos(bendAt) * off, y, Math.sin(bendAt) * off);
    };
    const radiusAt = (y: number): number => butt * (1 - 0.4 * (y / height));

    // --- the stem ------------------------------------------------------------
    //
    // Same three-kinds-of-segment walk as the adult, run gentler: smaller
    // clusters, thinner scars, and a lower chance of starting one.
    let y = 0;
    // Scars still owed by the current cluster. Unlike the adult this starts at
    // zero — there is no black foot to break away from, and a sapling's lowest
    // marks genuinely are some way up the stem.
    let cluster = 0;
    // Two scars end to end are one fat band. Always a sliver of pale between.
    let wasDark = false;
    // Marks made so far, only so that the stem cannot come out with none.
    let scars = 0;

    while (y < height - 0.05) {
      let length: number;
      let color: number;
      let dark = false;

      if (cluster > 0 && !wasDark) {
        dark = true;
        cluster -= 1;
        scars += 1;
        length = rng.range(0.03, 0.075);
        color = shade(YOUNG_BAND, rng.range(0.85, 1.2));
      } else if (cluster > 0) {
        length = rng.range(0.04, 0.09);
        color = shade(YOUNG_BARK, rng.range(0.86, 0.98));
      } else {
        length = rng.chance(0.3) ? rng.range(0.3, 0.5) : rng.range(0.11, 0.26);
        color = shade(YOUNG_BARK, rng.range(0.92, 1.06));
        // Nothing in the bottom tenth: the marks develop downward from the
        // young wood at the top, so a sapling banded to the ground is a shrunk
        // adult. Rolled after the run rather than before it, so a failed roll
        // gives two clean runs back to back and the spacing varies by more than
        // one draw's worth.
        //
        // **The first cluster is forced.** At 58% a run and only half a dozen
        // runs to a stem, a plain sequence of failures is not rare — sweeping
        // 1600 seeds turned up saplings with no marks anywhere, and an unmarked
        // stem is a stick, not a young birch. Above a third of the way up, the
        // first one stops being optional.
        const due = scars === 0 && y > height * 0.3;
        cluster = due || (y > height * 0.1 && rng.chance(0.58)) ? (rng.chance(0.25) ? 2 : 1) : 0;
      }

      const top = Math.min(height, y + length);
      const from = spine(y);
      const to = spine(top);
      // Overrun into the next segment, with an absolute floor as well as a
      // proportional one — a three-centimetre scar overrun by 9% is under three
      // millimetres, and the watertight check quantizes to an eighth of one.
      const span = Math.max(to.distanceTo(from), 1e-6);
      to.lerp(from, -Math.max(0.02, span * 0.09) / span);

      parts.push({
        geometry: rod(from, to, radiusAt(y), radiusAt(top), 5),
        color,
        sway: heightRamp(0, height, 2),
      });
      wasDark = dark;
      y = top;
    }

    // --- branches ------------------------------------------------------------
    const branches = rng.int(3, 5);
    const lean = rng.range(0, TAU);
    const leaf = rng.chance(0.3) ? PALETTE.LEAF_DRY : PALETTE.LEAF;

    for (let i = 0; i < branches; i++) {
      const t = branches > 1 ? i / (branches - 1) : 0;
      const at = Math.min(height * 0.97, crownBase + (height - crownBase) * t * rng.range(0.85, 1));
      const root = spine(at);
      const bearing = lean + i * 2.399963 + rng.around(0, 0.4);
      const reach = rng.range(0.28, 0.52) * (1.1 - 0.35 * t);
      // Steeper than the adult's. Young growth is reaching for light; the
      // horizontal branch is an old one that a decade of leaves has pulled down.
      const rise = rng.range(1, 1.3);

      const tip = new THREE.Vector3(
        root.x + Math.cos(bearing) * Math.cos(rise) * reach,
        root.y + Math.sin(rise) * reach,
        root.z + Math.sin(bearing) * Math.cos(rise) * reach,
      );
      parts.push({
        geometry: rod(root, tip, butt * 0.42, butt * 0.24, 4),
        color: shade(YOUNG_BARK, rng.range(0.78, 0.9)),
        sway: heightRamp(0, height, 1.3),
      });

      // Still drooping at the end, even this young — it is the family trait and
      // dropping it would leave the sapling unattributable to any species.
      const swing = bearing + rng.around(0, 0.3);
      const droop = rng.range(-0.5, -0.1);
      const twigLength = reach * rng.range(0.6, 0.95);
      const end = new THREE.Vector3(
        tip.x + Math.cos(swing) * Math.cos(droop) * twigLength,
        tip.y + Math.sin(droop) * twigLength,
        tip.z + Math.sin(swing) * Math.cos(droop) * twigLength,
      );
      // **Started back down the branch, not at its tip.** Two rods meeting
      // end-to-end at the same point with the same radius produce identical
      // rings whenever their directions happen to agree to within the
      // watertight check's quantum — and four triangles on one edge is read as
      // a hole. It is a rare roll rather than a constant one: 499 seeds out of
      // 500 were fine and seed 16 was not, which is exactly the kind of bug
      // that ships. The twig now sleeves over the branch, slightly fatter, so
      // there is nothing for the two caps to coincide with.
      const joint = tip.clone().lerp(root, 0.12);
      parts.push({
        geometry: rod(joint, end, butt * 0.27, butt * 0.12, 4),
        color: shade(PALETTE.BARK_PALE, rng.range(0.9, 1.1)),
        sway: 0.92,
      });

      // One or two tufts per twig. Any more and the crown closes up, and a
      // closed crown on a stem this thin is the lollipop.
      const clumps = rng.int(1, 2);
      for (let c = 0; c < clumps; c++) {
        const u = (c + 1) / clumps;
        const clump = lumpySphere(rng, rng.range(0.15, 0.24), 0, 0.7, 1.3);
        clump.scale(0.85, rng.range(1.15, 1.45), 0.85);
        clump.translate(
          tip.x + (end.x - tip.x) * u,
          tip.y + (end.y - tip.y) * u - u * u * rng.range(0.03, 0.09),
          tip.z + (end.z - tip.z) * u,
        );
        parts.push({
          geometry: clump,
          color: rng.chance(0.3) ? PALETTE.LEAF_DARK : shade(leaf, rng.range(0.92, 1.08)),
          sway: 1,
        });
      }
    }

    // The leader tuft, sitting on the top of the stem. A sapling is still
    // running for height, so the topmost growth is the strongest thing on it.
    const apex = spine(height);
    const leader = lumpySphere(rng, rng.range(0.18, 0.27), 0, 0.72, 1.28);
    leader.scale(0.9, rng.range(1.2, 1.5), 0.9);
    leader.translate(apex.x, apex.y + 0.04, apex.z);
    parts.push({ geometry: leader, color: shade(leaf, rng.range(0.94, 1.06)), sway: 1 });

    const geometry = assemble(parts);
    geometry.rotateY(rng.range(0, TAU));
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'small-birch', rng.range(0, TAU));
  },
};
