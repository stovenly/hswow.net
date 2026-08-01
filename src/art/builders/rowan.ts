import * as THREE from 'three';
import type { MeshBuilder, BuildOptions } from '../types';
import { assemble, finish, heightRamp, type Part } from '../assemble';
import { createRng, type Rng } from '../random';
import { rod } from '../rod';
import { PALETTE, shade } from '../palette';

/**
 * Rowan: a small open tree, upright and airy, hung with orange berries.
 *
 * **Built to replace the willow, which was cut.** Three attempts at a weeping
 * willow all failed the same way, and the reason turned out to be structural
 * rather than a tuning miss: a willow is read almost entirely as *falling
 * line*, which needs many long thin strands, and long thin strands are the one
 * thing this render pipeline destroys. Chunked to three-pixel blocks they alias
 * into a wiry mat. Every other tree in the kit is carried by a solid outline;
 * the willow was carried by texture the renderer cannot keep, so it was fighting
 * the pipeline rather than being badly made.
 *
 * A rowan fills the gap the set actually had. Oak is a broad dome, birch a
 * slender white pole, spruce a dark cone — all of them full-height trees, and
 * nothing stood between the 1.2 m bushes and a 7 m canopy. Rowan is a **small
 * tree**: four or five metres, upright, with an open crown you see straight
 * through and branches that ascend rather than spread.
 *
 * ## The berries are the point
 *
 * Colour survives quantization where geometry does not — that is the lesson the
 * gorse taught, and a rowan is the tree version of it. Dense flat-topped
 * corymbs of orange-red fruit are legible at any distance the player will ever
 * stand, and nothing else in the foliage set carries a warm note at all: the
 * kit is greens, browns and one yellow bush. A rowan on a hillside is an orange
 * mark on a green one.
 *
 * The berries also justify the shape. They hang in heavy bunches at the ends of
 * the branches, which pulls the outer twigs down and gives the crown a drooping
 * fringe under an otherwise upright tree — a silhouette none of the other three
 * has.
 *
 * ## Leaves
 *
 * Pinnate, like the elder's, and for the same reason: a rowan leaf is a row of
 * paired leaflets on a rachis, and that ragged comb-edge is what stops the
 * crown reading as a cloud. Drawn as clusters rather than individually — at
 * this scale a single 4 cm leaflet is well under one rendered block, so it
 * costs triangles and contributes nothing. Each cluster is a short rachis with
 * a few fins on it, which is a shape the quantizer can resolve.
 */

/** Ripe rowan berry, and the shaded side of a bunch. Warm and saturated. */
const BERRY = 0xc4431f;
const BERRY_SHADE = 0x8f2f18;
/** Rowan bark is smooth and grey, closer to a beech than to an oak. */
const ROWAN_BARK = 0x8e8778;

/**
 * One rowan, at either size.
 *
 * Shared rather than duplicated, because the sapling differs from the adult in
 * its numbers and not in its construction — a young rowan is the same tree with
 * fewer limbs and no fruit, which is exactly what `young` selects.
 */
export function buildRowan(rng: Rng, young: boolean): Part[] {
  const parts: Part[] = [];

  const height = young ? rng.range(1.9, 3.1) : rng.range(4.2, 5.8);
  // Slender. A rowan never gets thick, and a fat trunk is the quickest way to
  // turn this into a small oak.
  const butt = height * rng.range(0.021, 0.03);
  const spread = height * rng.range(0.3, 0.4);
  const bark = shade(ROWAN_BARK, rng.range(0.9, 1.1));
  const leafColor = rng.chance(0.35) ? PALETTE.LEAF_DARK : PALETTE.LEAF;
  const ramp = heightRamp(0, height, 2);

  // A gentle lean, all of it in the upper trunk.
  const leanAt = rng.range(0, Math.PI * 2);
  const lean = rng.range(0.05, 0.22);
  const spine = (t: number): THREE.Vector3 => {
    const off = spread * lean * t ** 2.2;
    return new THREE.Vector3(Math.cos(leanAt) * off, height * t, Math.sin(leanAt) * off);
  };

  // --- the trunk -----------------------------------------------------------
  //
  // Clear for the bottom third and then dividing. A rowan holds a single stem
  // well up — that is what makes it upright rather than a large shrub, and it
  // is the main thing separating it from the elder and hazel it shares a
  // height band with.
  const forkAt = young ? rng.range(0.42, 0.55) : rng.range(0.3, 0.4);
  const trunkSteps = 5;
  for (let i = 0; i < trunkSteps; i++) {
    const t0 = (forkAt * i) / trunkSteps;
    const t1 = (forkAt * (i + 1)) / trunkSteps;
    const from = spine(t0);
    const to = spine(t1);
    // Overrun, so consecutive segments never share a cap ring — four triangles
    // on one edge is a hole to the watertight check.
    const span = Math.max(to.distanceTo(from), 1e-6);
    to.lerp(from, -Math.max(0.02, span * 0.1) / span);
    parts.push({
      geometry: rod(from, to, butt * (1 - t0 * 0.3), butt * (1 - t1 * 0.3), 6),
      color: shade(bark, rng.range(0.92, 1.08)),
      sway: ramp,
    });
  }

  // --- limbs ---------------------------------------------------------------
  //
  // Ascending, not spreading. Every limb leaves the trunk at a steep angle and
  // stays steeper than it is long — the crown is taller than it is wide, which
  // is the opposite of the oak and the whole reason both can be in one wood.
  // **The adult was reading as a big sapling, and this is why.** Five to seven
  // limbs each carrying two to four twigs, with one leaf spray on the end of
  // each, comes to about twenty tufts spread through a five-metre crown — which
  // is a young tree's worth of foliage inflated to an adult's dimensions. What
  // separates a grown tree from a sapling is not size, it is *how many times it
  // has divided*: more limbs, more twigs on each, and leaf along the twig
  // rather than only at its tip.
  const limbs = young ? rng.int(3, 4) : rng.int(5, 6);
  const first = rng.range(0, Math.PI * 2);
  for (let i = 0; i < limbs; i++) {
    const bearing = first + i * 2.399963 + rng.around(0, 0.35);
    // Each from its own height on the trunk, so they separate over a stretch
    // of stem rather than fanning from one point — which is both what a tree
    // does and what stops a dozen cap rings landing on one vertex.
    const root = spine(forkAt * rng.range(0.62, 1));
    // **A limb that divides, not a spoke.**
    //
    // This was one rod running the whole way from the trunk to the crown edge,
    // and a rod reaching three metres reads as a *spoke* however far it
    // reaches — long, straight and sticky, with the leaf only at the far end.
    // Real height and real fullness in a broadleaf come from levels of
    // branching, and the eye counts them; this is the same correction the oak
    // needed when it went from two tiers to three.
    //
    // So the limb now runs about half way out to an elbow, and forks there into
    // two or three shorter arms. The arms are what carry the twigs, so the
    // crown's business happens over its outer half instead of at a point.
    const out = spread * rng.range(0.5, 1);
    const top = rng.range(0.78, 0.99);
    const crownTop = height * top;

    const elbow = new THREE.Vector3(
      root.x + Math.cos(bearing) * out * rng.range(0.42, 0.56),
      root.y + (crownTop - root.y) * rng.range(0.45, 0.62),
      root.z + Math.sin(bearing) * out * rng.range(0.42, 0.56),
    );
    parts.push({
      geometry: rod(root, elbow, butt * 0.55, butt * 0.34, 5),
      color: shade(bark, rng.range(0.9, 1.06)),
      sway: ramp,
    });

    /**
     * Where the outer arms end, and the shape of the whole tree.
     *
     * Tips are placed on a **dome** rather than at one radius and one height:
     * an arm reaching further out ends lower, following a rounded envelope, so
     * the outline curves over instead of finishing in a ring of spikes. That
     * envelope is the silhouette — the leaf hangs off these, so wherever they
     * end is where the crown edge is.
     */
    const arms = young ? 2 : rng.int(2, 3);
    for (let a = 0; a < arms; a++) {
      const way = bearing + rng.around((a - (arms - 1) / 2) * 0.55, 0.22);
      const reach = out * rng.range(0.62, 1);
      const frac = Math.min(1, reach / Math.max(spread, 1e-6));
      const tip = new THREE.Vector3(
        root.x + Math.cos(way) * reach,
        // Falls away toward the rim: full height on the axis, dropping to about
        // two thirds of the way up the crown at full spread.
        elbow.y + (crownTop - elbow.y) * Math.sqrt(Math.max(0, 1 - frac * frac * 0.75)),
        root.z + Math.sin(way) * reach,
      );
      // Sleeved back down the limb rather than butted onto its end — a fan of
      // arms off one point puts two or three identical rings in one place,
      // which the watertight check reads as a hole.
      const armFrom = elbow.clone().lerp(root, 0.1 + a * 0.06);
      parts.push({
        geometry: rod(armFrom, tip, butt * (0.3 + a * 0.015), butt * 0.16, 4),
        color: shade(bark, rng.range(0.92, 1.1)),
        sway: ramp,
      });
      // Twigs off *this arm*, carrying the leaf and the fruit — along it rather
      // than only at its end, so the crown has depth in it instead of being a
      // shell. Moved inside the arm loop: they used to hang off the single long
      // limb, which is what put all the foliage at one radius.
      const twigs = young ? 2 : rng.int(2, 3);
      for (let t = 0; t < twigs; t++) {
        const at = rng.range(0.3, 1);
        const from = armFrom.clone().lerp(tip, at);
        const aim = way + rng.around(0, 1.1);
      const reach = spread * rng.range(0.18, 0.34);
      // Slightly falling at the ends. A rowan's outer twigs are thin and carry
      // heavy fruit, so they bend over — that droop under an upright tree is
      // most of the species' character.
      const to = new THREE.Vector3(
        from.x + Math.cos(aim) * reach,
        from.y + rng.range(-0.16, 0.3) * reach * 2,
        from.z + Math.sin(aim) * reach,
      );
      // Sleeved back into the limb rather than butted onto it: two rods meeting
      // end to end at equal radius put coincident vertex rings in one place
      // whenever their directions nearly agree, which reads as a hole.
        const start = from.clone().lerp(armFrom, 0.12);
      parts.push({
        geometry: rod(start, to, butt * 0.24, butt * 0.12, 4),
        color: shade(bark, rng.range(1.0, 1.15)),
        sway: ramp,
      });

      // Two or three sprays down the twig instead of one on the end. A rowan
      // leaf is 20 cm long and they come alternately all the way along the
      // shoot, so a single tuft at the tip leaves the inner two thirds of every
      // branch bare — which is exactly the emptiness the crown had.
      const sprays = 2;
      for (let s = 0; s < sprays; s++) {
        const on = start.clone().lerp(to, 0.35 + (s / sprays) * 0.65);
        leafSpray(parts, rng, on, height, leafColor, aim + rng.around(0, 0.8));
      }

        // **And leaf back down the arm itself.** The crown was a Y with a tuft
        // on each fork: every spray hung off a twig, every twig hung off the
        // outer end of an arm, so the foliage formed a shell at one radius with
        // bare wood inside it and nothing at all underneath. A rowan is a
        // *lollipop* — a rounded head of leaf with the branches buried in it —
        // so leaf has to sit along the arms too, including low down where the
        // arm is still climbing. This is what fills the underside and the
        // middle, and it is the cheapest fill there is because the wood it
        // hangs on already exists.
        if (rng.chance(0.75)) {
          const back = armFrom.clone().lerp(tip, rng.range(0.12, 0.6));
          leafSpray(parts, rng, back, height, leafColor, way + rng.around(0, 1.5));
        }

      // Berries on about half the outer twigs of a grown tree, and never on a
      // sapling — a rowan does not fruit until it is several years old, and a
      // two-metre one hung with corymbs would read as a bush with berries.
        if (!young && at > 0.55 && rng.chance(0.38)) {
          corymb(parts, rng, to, height);
        }
      }
    }
  }

  return parts;
}

/**
 * A cluster of pinnate leaf about a point.
 *
 * A short rachis with paired fins down it. Three or four leaflets a side rather
 * than the nine or eleven a real rowan carries: past about four the extra pairs
 * are each under a rendered block wide and buy nothing but cost, and the comb
 * silhouette is already established by then.
 */
function leafSpray(
  parts: Part[],
  rng: Rng,
  at: THREE.Vector3,
  height: number,
  color: number,
  aim: number,
): void {
  // Bigger. A larger leaflet covers more crown per triangle than another whole
  // spray does, and at three-pixel blocks an undersized one is invisible anyway.
  const long = height * rng.range(0.075, 0.12);
  const droop = rng.range(0.1, 0.5);
  const dir = new THREE.Vector3(
    Math.cos(aim) * Math.cos(droop),
    -Math.sin(droop),
    Math.sin(aim) * Math.cos(droop),
  );
  const end = at.clone().addScaledVector(dir, long);
  parts.push({
    geometry: rod(at, end, height * 0.004, height * 0.0025, 3),
    color: shade(color, 0.7),
    sway: 1,
  });

  // Two or three pairs, not three or four. With sprays now running down every
  // twig there are three times as many of them, so the cost per spray is what
  // decides the whole tree — and a pair fewer on each is invisible where a
  // bare inner branch was not.
  const pairs = 2;
  for (let p = 0; p < pairs; p++) {
    const along = (p + 0.6) / (pairs + 0.4);
    const on = at.clone().lerp(end, along);
    // Sub-opposite rather than exactly opposite: two leaflets sharing one base
    // point put two three-vertex rings in the same place, and a real pinnate
    // leaf is slightly staggered anyway.
    for (const side of [-1, 1]) {
      const size = long * rng.range(0.3, 0.46) * (1 - along * 0.25);
      const fin = new THREE.ConeGeometry(size * 0.34, size * 1.9, 3);
      fin.translate(0, size * 0.95, 0);
      fin.scale(1, 1, rng.range(0.28, 0.42));
      fin.rotateZ(side * rng.range(1.1, 1.45));
      fin.rotateY(aim + rng.around(0, 0.3));
      const nudge = side * 0.012 * long;
      fin.translate(on.x + nudge, on.y + rng.around(0, 0.004), on.z - nudge);
      parts.push({ geometry: fin, color: shade(color, rng.range(0.85, 1.12)), sway: 1 });
    }
  }
}

/**
 * A corymb: a flat-topped bunch of berries on short stalks.
 *
 * Flat-topped is the identifying thing and it is worth spending a comment on —
 * a rowan's fruit is not a hanging grape-cluster like the elder's but a dense
 * plate held roughly level, so the two read as different plants even though
 * both are "small tree with berries".
 */
function corymb(parts: Part[], rng: Rng, at: THREE.Vector3, height: number): void {
  const radius = height * rng.range(0.028, 0.045);
  const drop = radius * rng.range(0.5, 1.1);
  // Trimmed from 9..15. An icosahedron is twenty triangles whatever its size,
  // so a corymb is the most expensive thing in the tree by a wide margin — and
  // past about ten beads the extra ones are entirely interior, hidden by the
  // ones in front of them. The plate reads by its outline and its colour.
  const berries = rng.int(7, 10);
  const centre = new THREE.Vector3(at.x, at.y - drop, at.z);

  // The stalk down to the bunch, so it hangs off the twig rather than floating
  // under it.
  parts.push({
    geometry: rod(at, centre.clone().addScaledVector(new THREE.Vector3(0, 1, 0), radius * 0.3), height * 0.003, height * 0.002, 3),
    color: shade(BERRY_SHADE, 0.7),
    sway: 1,
  });

  for (let i = 0; i < berries; i++) {
    // Golden angle over the plate, square-rooted so they cover the area evenly
    // rather than piling into the middle.
    const a = i * 2.399963;
    const d = radius * Math.sqrt((i + 0.5) / berries);
    const size = radius * rng.range(0.2, 0.29);
    const bead = new THREE.IcosahedronGeometry(size, 0);
    // Each its own slight squash, or congruent beads landing on each other weld
    // into edges belonging to four faces.
    bead.scale(rng.range(0.9, 1.1), rng.range(0.85, 1.05), rng.range(0.9, 1.1));
    bead.translate(
      centre.x + Math.cos(a) * d,
      // Domed a little: the top of a corymb is not flat-flat, it is a shallow
      // cap, and the difference is what stops it reading as a printed disc.
      centre.y + (1 - (d / radius) ** 2) * radius * 0.3 + rng.around(0, size * 0.4),
      centre.z + Math.sin(a) * d,
    );
    parts.push({
      geometry: bead,
      color: rng.chance(0.3) ? shade(BERRY_SHADE, rng.range(0.9, 1.1)) : shade(BERRY, rng.range(0.9, 1.12)),
      sway: 1,
    });
  }
}

export const rowan: MeshBuilder = {
  name: 'rowan',
  category: 'foliage',
  radius: 1.8,

  build({ seed = 1, scale = 1 }: BuildOptions = {}) {
    const rng = createRng(seed);
    const geometry = assemble(buildRowan(rng, false));
    geometry.rotateY(rng.range(0, Math.PI * 2));
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'rowan', rng.range(0, Math.PI * 2));
  },
};
