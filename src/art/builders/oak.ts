import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, heightRamp, type Part } from '../assemble';
import { lumpySphere } from '../blob';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';
import { rod } from '../rod';

// Oak: a short fat trunk that forks low into heavy limbs under a wide dome — the
// opposite tree to `birch` in every measurement that survives the pipeline. The
// low fork is what makes it legible from any angle: the trunk is clear for about a
// quarter of the height where birch is bare for half, the crown spreads six tenths
// where birch's is a quarter, and the trunk is three times the width.
//
// Height comes from branching rather than from scale: fork → elbow → a second
// division → two or three finer limbs, so `forkAt` and `spread` are smaller
// fractions of a taller tree and the fork stays between 1.5 and 2.5 m. The crown
// is a dome of overlapping lumps, larger and higher near the axis and smaller and
// lower at the rim, because a single mass gives a mushroom.

const TAU = Math.PI * 2;

export const oak: MeshBuilder = {
  name: 'oak',
  category: 'foliage',
  radius: 3.4,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    // Nominal, not measured: the crown tops out near this, because the dome sits on
    // the limbs rather than on the leader.
    const height = rng.range(7.3, 9.4);
    // **Unchanged.** The tree got taller and the trunk did not, which is the
    // whole point — a thicker trunk would have made this a scale-up.
    const butt = rng.range(0.38, 0.52);
    // Low. This is the species marker; pushing it above a third of the height turns
    // the tree into an anonymous broadleaf. The fraction is set to hold the fork at
    // 1.5 to 2.5 m off the ground whatever the height rolls.
    const forkAt = height * rng.range(0.2, 0.27);
    // Retuned the same way and for the same reason: 0.27–0.34 of the new height
    // is the width 0.3–0.38 of the old height already gave. The dome is meant to
    // sit higher, not to get wider.
    const spread = height * rng.range(0.27, 0.34);
    // Higher as a fraction as well as in metres: the third tier of limb exists to
    // carry the leaves further from the fork.
    const crownY = height * rng.range(0.7, 0.77);

    // Barely any lean — a heavy trunk carrying a heavy crown stands up straight,
    // and a leaning oak reads as a storm-damaged one.
    const bendAt = rng.range(0, TAU);
    const bend = rng.range(0.02, 0.09);
    const spine = (y: number): THREE.Vector3 => {
      const t = y / height;
      const off = bend * t ** 2;
      return new THREE.Vector3(Math.cos(bendAt) * off, y, Math.sin(bendAt) * off);
    };

    const bark = (): number => shade(PALETTE.BARK, rng.range(0.88, 1.12));

    // --- root flare ----------------------------------------------------------
    // Half a metre of trunk a third wider than the rest. Cheap, and it is what makes
    // the tree look planted — a cylinder meeting the ground at a right angle looks
    // like a post however thick it is.
    const flareTop = rng.range(0.38, 0.55);
    parts.push({
      geometry: rod(
        new THREE.Vector3(0, 0, 0),
        spine(flareTop * 1.08),
        butt * rng.range(1.28, 1.45),
        butt * 1.02,
        8,
      ),
      color: bark(),
      // Zero at the roots and kept near zero for the whole flare. The base of a
      // tree this size does not move at all, and any bend visible down here
      // reads as the ground moving.
      sway: heightRamp(0, height, 3),
    });

    // --- trunk to the fork ---------------------------------------------------
    const trunkSegments = 2;
    for (let i = 0; i < trunkSegments; i++) {
      const from = flareTop + ((forkAt - flareTop) * i) / trunkSegments;
      const to = flareTop + ((forkAt - flareTop) * (i + 1)) / trunkSegments;
      const a = spine(from);
      const b = spine(to);
      // Overrun, so the caps of consecutive segments are not coplanar.
      b.lerp(a, -0.06);
      parts.push({
        geometry: rod(a, b, butt * (1.02 - 0.1 * i), butt * (1.02 - 0.1 * (i + 1)), 8),
        color: bark(),
        sway: heightRamp(0, height, 3),
      });
    }

    // --- the limbs -----------------------------------------------------------
    // Three tiers: each limb goes up steeply from the fork, turns at an elbow, runs
    // out and up to a second division, and splits there into two or three finer
    // limbs carrying the crown. Real height in a broadleaf is levels of branching,
    // and the eye counts them — a longer spoke reads as a spoke however far it goes.
    const limbs = rng.int(4, 6);
    const lean = rng.range(0, TAU);
    for (let i = 0; i < limbs; i++) {
      // Sunk to a different depth each. All the limbs springing from one point
      // stacks that many cap fans on one vertex, and it also looks like a hand
      // of bananas — real limbs separate over a metre or so of trunk.
      const root = spine(forkAt * rng.range(0.6, 0.95));
      const bearing = lean + i * 2.399963 + rng.around(0, 0.4);

      const elbowOut = spread * rng.range(0.34, 0.5);
      const elbow = new THREE.Vector3(
        root.x + Math.cos(bearing) * elbowOut,
        root.y + rng.range(1.0, 1.8),
        root.z + Math.sin(bearing) * elbowOut,
      );
      parts.push({
        geometry: rod(root, elbow, butt * 0.46, butt * 0.32, 6),
        color: bark(),
        sway: heightRamp(0, height, 2),
      });

      // --- leaf on the lower limbs ---------------------------------------------
      // An oak has leaves along its limbs, not only at the tips: without this the
      // whole canopy lifts into a band around `crownY` and the tree reads as a lamp
      // on a stand. Small and gappy on purpose — the point is to break the bare wood
      // and fill the middle of the silhouette, not to close it up.
      if (rng.chance(0.75)) {
        const at = elbowOut * rng.range(0.72, 1.02);
        const spray = lumpySphere(rng, rng.range(0.34, 0.58), 0, 0.74, 1.26);
        spray.scale(1, rng.range(0.58, 0.8), 1);
        spray.translate(
          root.x + Math.cos(bearing) * at,
          elbow.y + rng.around(0.05, 0.3),
          root.z + Math.sin(bearing) * at,
        );
        parts.push({
          geometry: spray,
          // Darker down here. Inner foliage is shaded by everything above it,
          // and that gradient is most of what gives a crown any depth at all.
          color: rng.chance(0.6) ? PALETTE.LEAF_DARK : shade(PALETTE.LEAF, rng.range(0.84, 0.98)),
          sway: rng.range(0.5, 0.7),
        });
      }

      // Tier two: out and up to the second division rather than all the way to
      // the crown, and left thicker at its far end than it used to be. It is a
      // limb that carries two or three more now, not a twig with a lump on it.
      const swing = bearing + rng.around(0, 0.3);
      const midOut = spread * rng.range(0.48, 0.64);
      const mid = new THREE.Vector3(
        root.x + Math.cos(swing) * midOut,
        elbow.y + (crownY - elbow.y) * rng.range(0.42, 0.6),
        root.z + Math.sin(swing) * midOut,
      );
      // Started back inside the inner limb rather than on the elbow itself. Butted
      // end to end at equal radius, the two rods' rings coincide whenever their
      // directions agree closely enough. A real limb thickens at a bend anyway.
      const joint = elbow.clone().lerp(root, 0.09);
      parts.push({
        geometry: rod(joint, mid, butt * 0.35, butt * 0.22, 5),
        color: bark(),
        sway: heightRamp(0, height, 1.6),
      });

      // And again at the second division, so the leaf climbs the tree with the
      // branching. Three heights of foliage — elbow, division, tips — is what fills
      // a silhouette in; with only the tips it is a mushroom.
      if (rng.chance(0.8)) {
        const spray = lumpySphere(rng, rng.range(0.4, 0.68), 0, 0.75, 1.25);
        spray.scale(1, rng.range(0.62, 0.84), 1);
        spray.translate(
          mid.x + rng.around(0, 0.22),
          mid.y + rng.around(0.1, 0.28),
          mid.z + rng.around(0, 0.22),
        );
        parts.push({
          geometry: spray,
          color: rng.chance(0.45) ? PALETTE.LEAF_DARK : shade(PALETTE.LEAF, rng.range(0.88, 1.02)),
          sway: rng.range(0.68, 0.84),
        });
      }

      // Tier three: the division that carries the crown. Each sub-limb sleeves back
      // into tier two at its own depth and its own radius, because a fan of limbs
      // off a common point puts identical rings in one place. The radii each clear
      // tier two's where they sit on it, or the sleeve is inside out.
      const subs = rng.int(2, 3);
      for (let s = 0; s < subs; s++) {
        const way = swing + rng.around((s - (subs - 1) / 2) * 0.6, 0.22);
        // Measured from the trunk, not from the division, so the crown's footprint is
        // still set by `spread` alone. Reaching a range of distances and lifted on
        // the same hemisphere the leaf follows: an inner sub-limb ends higher and
        // further in, which is what carries the middle of the dome.
        const out = spread * rng.range(0.45, 0.95);
        const lift = Math.sqrt(Math.max(0, 1 - (out / spread) ** 2)) * spread * 0.4;
        const tip = new THREE.Vector3(
          root.x + Math.cos(way) * out,
          crownY + lift + rng.around(0, 0.3),
          root.z + Math.sin(way) * out,
        );
        parts.push({
          geometry: rod(
            mid.clone().lerp(joint, 0.1 + s * 0.1),
            tip,
            butt * (0.25 + s * 0.015),
            butt * 0.13,
            4,
          ),
          color: shade(PALETTE.BARK_PALE, rng.range(0.9, 1.1)),
          sway: heightRamp(0, height, 1.2),
        });

        // A billow on the end of every sub-limb, so the crown is visibly held up by
        // the branches. Smaller than a one-per-limb billow, since there are two or
        // three of them now.
        const cap = lumpySphere(rng, rng.range(0.52, 0.8), 0, 0.78, 1.22);
        cap.scale(1, rng.range(0.72, 0.9), 1);
        cap.translate(tip.x, tip.y + rng.range(0.1, 0.35), tip.z);
        parts.push({
          geometry: cap,
          color: rng.chance(0.3) ? PALETTE.LEAF_DARK : shade(PALETTE.LEAF, rng.range(0.92, 1.08)),
          sway: rng.range(0.82, 0.95),
        });
      }
    }

    // --- the dome ------------------------------------------------------------
    const fill = rng.int(15, 21);
    for (let i = 0; i < fill; i++) {
      const a = rng.range(0, TAU);
      // Square-rooted, so lumps land evenly over the area of the disc: the raw number
      // piles them into the middle and leaves the rim thin.
      const d = spread * Math.sqrt(rng()) * 0.92;
      // **A round dome, not a paraboloid.** `1 - (d/R)²` falls away slowly near
      // the middle and fast at the rim, which is the profile of a saucer; the
      // square root of it is a hemisphere, which is the profile of an oak.
      const dome = Math.sqrt(Math.max(0, 1 - (d / spread) ** 2));

      const size = rng.range(0.55, 0.92) * (0.78 + 0.32 * dome);
      const lump = lumpySphere(rng, size, 0, 0.76, 1.24);
      lump.rotateY(rng.range(0, TAU));
      // Barely squashed now. Flattening every lump *and* using a flat profile
      // compounded: the crown came out under a metre deep over a two-and-a-half
      // metre radius, which is a pancake however good the outline is.
      lump.scale(1, rng.range(0.82, 1.0), 1);
      lump.translate(
        Math.cos(a) * d,
        // Rise scaled off the crown's own width, so a wide tree gets a taller dome
        // rather than the same flat lid at any size. A fifth of the lumps are kicked
        // well proud — a smooth surface of evenly placed blobs reads as moulded, and
        // the ragged skyline is most of what says oak at distance.
        crownY +
          dome * spread * rng.range(0.42, 0.7) +
          rng.around(0, 0.34) +
          (rng.chance(0.2) ? rng.range(0.25, 0.75) : 0),
        Math.sin(a) * d,
      );
      parts.push({
        geometry: lump,
        color: rng.chance(0.28)
          ? PALETTE.LEAF_DARK
          : // A little dry leaf on the outside only. The rim of a crown is the
            // part that gets scorched, and the lighter edge is what separates
            // the dome from the mass of trees behind it.
            rng.chance(0.15) && d > spread * 0.6
            ? PALETTE.LEAF_DRY
            : shade(PALETTE.LEAF, rng.range(0.9, 1.1)),
        sway: rng.range(0.85, 1),
      });
    }

    // The underside fringe: a few lumps hanging below the rim. An oak's canopy has a
    // ragged lower edge — browsed flat at about two metres, with everything above
    // hanging — and without it the dome ends in a line cut with scissors.
    const fringe = rng.int(3, 6);
    for (let i = 0; i < fringe; i++) {
      const a = rng.range(0, TAU);
      const d = spread * rng.range(0.6, 0.95);
      const lump = lumpySphere(rng, rng.range(0.42, 0.7), 0, 0.74, 1.26);
      lump.scale(1, rng.range(0.6, 0.8), 1);
      lump.translate(Math.cos(a) * d, crownY - rng.range(0.35, 1), Math.sin(a) * d);
      parts.push({
        geometry: lump,
        color: rng.chance(0.55) ? PALETTE.LEAF_DARK : shade(PALETTE.LEAF, rng.range(0.86, 1)),
        sway: rng.range(0.8, 0.95),
      });
    }

    const geometry = assemble(parts);
    geometry.rotateY(rng.range(0, TAU));
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'oak', rng.range(0, TAU));
  },
};
