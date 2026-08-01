import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, heightRamp, type Part } from '../assemble';
import { lumpySphere } from '../blob';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';
import { rod } from '../rod';

/**
 * Oak: a short fat trunk that forks low into heavy limbs under a wide dome.
 *
 * The opposite tree to `birch` in every measurement that survives the render
 * pipeline, which is the point of it. Birch is tall, thin, pale and open; this
 * is squat, broad, dark and solid, and at thirty metres — where the chunking has
 * thrown away every leaf, every band of bark and most of the branches — those
 * two outlines are still not confusable. Adding a second slender tree would
 * have doubled the builders and changed nothing anybody could see.
 *
 * Oak rather than beech or lime because of **the low fork**. Beech holds a
 * single stem well up into its crown and lime is upright and tidy; an oak
 * divides at head height into three or four limbs nearly as thick as the trunk
 * they came from, and that Y is legible from any angle at any distance. It is
 * also the tree that reads as *old*, which is worth having in a kit where
 * everything else is a sapling or a shrub.
 *
 * ## Proportions, which are the whole builder
 *
 * - Trunk clear for about a quarter of the height. Birch is bare for half.
 * - Crown spread about six tenths of the height. Birch's is a quarter.
 * - Trunk radius around 0.45 m against birch's 0.16 — three times the width for
 *   a comparable height, and the reason a bare oak in winter still reads as an
 *   oak.
 *
 * ## Height comes from branching, not from scale
 *
 * The tree was raised by better than a metre — 6.4 to 9.4 m over all, against
 * 5.3 to 7.8 before — and **not one of the trunk, fork or crown-spread
 * measurements moved with it**. That is deliberate and it is the difference
 * between a taller oak and a bigger one. Multiplying everything by 1.2 gives a
 * tree with a 0.6 m trunk and a nine-metre crown, which is not an older oak,
 * it is the same oak seen from closer to.
 *
 * What was added instead is **a third tier of limb**. The limbs used to go
 * fork → elbow → crown in two rods; they now go fork → elbow → a second
 * division → two or three finer limbs that carry the leaves. An extra level of
 * branching is exactly how a real tree gains height: the crown is held further
 * from the fork by more structure, not by a longer spoke. `forkAt` and `spread`
 * are therefore expressed as *smaller* fractions of the new height than they
 * were of the old one, chosen so that the fork stays between 1.5 and 2.5 m off
 * the ground and the dome stays the width it already was.
 *
 * The crown is a dome of overlapping lumps rather than one squashed sphere.
 * A single mass gives a mushroom; an oak's canopy is visibly built of separate
 * billows with gaps of sky between them, and the lumpiness of the *outline* is
 * what stops it looking inflated. Lumps are drawn larger and higher near the
 * axis and smaller and lower at the rim, so the dome has a profile without
 * anyone having to model one.
 */

const TAU = Math.PI * 2;

export const oak: MeshBuilder = {
  name: 'oak',
  category: 'foliage',
  radius: 3.4,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    // Nominal, not measured: the crown tops out near this, because the dome
    // sits on the limbs rather than on the leader. A roll of 7.3 gives a tree
    // about 6.4 m over all, which is the bottom of the range this is meant to
    // cover.
    const height = rng.range(7.3, 9.4);
    // **Unchanged.** The tree got taller and the trunk did not, which is the
    // whole point — a thicker trunk would have made this a scale-up.
    const butt = rng.range(0.38, 0.52);
    // Low. This is the species marker; pushing it above a third of the height
    // turns the tree into an anonymous broadleaf.
    //
    // The fraction dropped from 0.24–0.32 to hold the fork at the same *height
    // off the ground* — 1.5 to 2.5 m either way. Keeping the old fraction on a
    // taller tree would have lifted the fork with the crown, and a fork you
    // cannot stand under is not the thing that reads as an oak.
    const forkAt = height * rng.range(0.2, 0.27);
    // Retuned the same way and for the same reason: 0.27–0.34 of the new height
    // is the width 0.3–0.38 of the old height already gave. The dome is meant to
    // sit higher, not to get wider.
    const spread = height * rng.range(0.27, 0.34);
    // Higher as a fraction as well as in metres. This is where the third tier
    // of limb spends itself — the extra division exists to carry the leaves
    // further from the fork, and if the crown stayed at 0.7 of the height it
    // would have bought nothing.
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
    //
    // Half a metre of trunk that is a third wider than the rest. Cheap, and it
    // is what makes the tree look *planted* — a cylinder meeting the ground at
    // a right angle looks like a post no matter how thick it is.
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
    //
    // **Three tiers, not two.** Each limb goes up steeply from the fork, turns
    // at an elbow, runs out and up to a second division, and splits there into
    // two or three finer limbs that carry the crown.
    //
    // The elbow was always what made the crown look carried rather than
    // balanced on top; the second division is what lets it be carried *higher*.
    // The alternative — simply making the outer rod longer — was tried first
    // and gives a taller tree with the same silhouette stretched, because a
    // spoke reaching four metres reads as a spoke however far it reaches. Real
    // height in a broadleaf is levels of branching, and the eye counts them.
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
      //
      // **The crown is not the only place an oak has leaves on it, and this was
      // lost when the third tier went in.** Adding a level of branching moved
      // every billow up to the new tips, so the whole canopy lifted into a band
      // around `crownY` and left three metres of bare limb underneath — the
      // tree read as a lamp on a stand. The old two-tier version put leaf out
      // along the limbs at the height they actually were, and that spread is
      // what has to come back.
      //
      // Small and gappy on purpose. A real oak's inner and lower growth is
      // sparse sprays on the shaded side of the limb, not another dome — the
      // point is to break the bare wood and fill the middle of the silhouette,
      // not to close it up.
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
      // Started back inside the inner limb rather than on the elbow itself.
      // Butted end to end at equal radius, the two rods' rings coincide exactly
      // whenever their directions happen to agree to within the watertight
      // check's quantum, and that reads as a hole. Sleeving the outer over the
      // inner removes the coincidence and the elbow looks better for it — a
      // real limb thickens at a bend rather than stepping down at one.
      const joint = elbow.clone().lerp(root, 0.09);
      parts.push({
        geometry: rod(joint, mid, butt * 0.35, butt * 0.22, 5),
        color: bark(),
        sway: heightRamp(0, height, 1.6),
      });

      // And again at the second division, so the leaf climbs the tree with the
      // branching instead of jumping from the elbow to the crown. Three heights
      // of foliage — elbow, division, tips — is what fills a silhouette in;
      // with only the tips it is a mushroom.
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

      // Tier three: the division that carries the crown.
      //
      // Each sub-limb sleeves back into tier two at **its own depth and its own
      // radius**. Sharing one joint would put two or three identical rings in
      // one place, which is the same hole as a butted join and is the first
      // thing that broke when the tier was added — a fan of limbs off a common
      // point is precisely the coincidence the sleeving exists to avoid, and
      // there are now three chances of it per limb instead of one. The radii
      // (0.250, 0.265, 0.280 of `butt`) each clear tier two's radius where they
      // sit on it (0.233, 0.246, 0.259), or the sleeve would be inside out and
      // the join would show as a step.
      const subs = rng.int(2, 3);
      for (let s = 0; s < subs; s++) {
        const way = swing + rng.around((s - (subs - 1) / 2) * 0.6, 0.22);
        // Measured from the trunk, not from the division, so the crown's
        // footprint is still set by `spread` alone and the extra tier cannot
        // quietly widen the tree.
        // Reaching a range of distances rather than all to the rim, and lifted
        // on the same hemisphere the leaf follows — an inner sub-limb ends
        // higher and further in, which is what actually carries the middle of
        // the dome. Every tip landing at one radius and one height was holding
        // the crown up on a flat ring.
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

        // A billow on the end of every sub-limb, so the crown is visibly held
        // up by the branches rather than hovering over them. Smaller than the
        // one-per-limb billow it replaces: there are two or three of them now,
        // and at the old size the dome closed into a wall.
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
      // Square-rooted, so lumps land evenly over the *area* of the disc. Using
      // the raw number piles them into the middle and leaves the rim thin,
      // which is precisely backwards for a tree whose leaves are all on the
      // outside.
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
        // Rise scaled off the crown's own width, so a wide tree gets a
        // correspondingly tall dome instead of the same flat lid at any size.
        // The jitter is doubled and a fifth of the lumps are kicked well
        // proud — that is what breaks the top up. A smooth surface of evenly
        // placed blobs reads as a moulded shape whatever curve it follows, and
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

    // The underside fringe: a few lumps hanging below the rim. An oak's canopy
    // has a heavy, ragged lower edge — sheep and cattle browse it flat at about
    // two metres and everything above that hangs. Without these the dome ends
    // in a clean horizontal line and looks cut with scissors.
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
