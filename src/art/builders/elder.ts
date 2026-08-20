import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, heightRamp, type Part } from '../assemble';
import { lumpySphere } from '../blob';
import { createRng } from '../random';
import { rod } from '../rod';
import { PALETTE, shade } from '../palette';

// Elder in fruit: a low, wide, multi-stemmed shrub hung with black berries.
// Foliage from 0.2 m with nothing bare below it, because what says tree is a
// clear stem and this has to obscure the midline instead. In berry rather than
// in flower — a white umbel lands on cow parsley's silhouette. One instance in
// eight flowers, and its heads are domed and bedded into the leaf rather than
// flat and held clear.

/** Ripe elderberry, the waxy bloom on top of it, and the crimson stalks it hangs on. Purple-black rather than brown: quantization is per channel, so hue is what survives against the leaf. */
const BERRY = 0x2d1c36;
const BERRY_BLOOM = 0x4a3a5e;
const BERRY_STALK = 0x8b3d4c;

/** Elderflower cream, and a shadow of it, for the minority flowering roll. Not white — a pure white plate blows out to a flat block once the levels are applied. */
const FLOWER = 0xe4dec2;
const FLOWER_SHADE = 0xc4bd9e;

export const elder: MeshBuilder = {
  name: 'elder',
  category: 'foliage',
  // The widest point of any instance sits about 1.05 m off the axis, at the end
  // of an arched stem. A spacing hint that undersells the footprint makes the
  // gallery rank grow into itself.
  radius: 1.15,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    // Wider than tall on every seed: that ratio is the difference between a shrub
    // and a sapling, and it is worth enforcing rather than hoping for.
    const height = rng.range(1.08, 1.42);
    const spread = rng.range(0.64, 0.84);
    // Softer than the hazel's ramp. Elder is a pithy, fast, weak wood — a stem the
    // thickness of a thumb bends visibly under a wet bunch of fruit, which is why
    // the plant always looks half collapsed.
    const ramp = heightRamp(0, height, 1.3);

    /** The sway of the wood at a given height, for things hanging off it: a berry bunch goes where the stem carrying it goes. */
    const swayAt = (y: number): number => Math.min(1, ramp(0, y) * 1.15);

    const bark = rng.chance(0.6) ? PALETTE.BARK_PALE : PALETTE.BARK;
    const green = rng.chance(0.45) ? PALETTE.LEAF : PALETTE.LEAF_DARK;
    // Most of the time. See the header — the flowering roll is kept only for
    // variety and is deliberately the exception.
    const inFruit = !rng.chance(0.12);

    // --- the stool -----------------------------------------------------------
    //
    // No bole: an elder comes out of the ground as a handful of separate stems off
    // a woody boss, and a clear stem is what would make it read as a tree. The
    // boss also gives them something to emerge from at different depths, rather
    // than a stack of coincident base caps at the origin.
    const boss = lumpySphere(rng, rng.range(0.13, 0.19), 0, 0.8, 1.18);
    boss.scale(1, rng.range(0.42, 0.6), 1);
    boss.translate(0, rng.range(0.02, 0.05), 0);
    parts.push({ geometry: boss, color: shade(bark, 0.85), sway: ramp });


    // --- the stems -----------------------------------------------------------
    // Stems are the expensive unit here — each carries three leaf nodes and a
    // bunch of fruit — so the density comes from what hangs on them.
    const stems = rng.int(7, 9);
    const facing = rng.range(0, Math.PI * 2);

    for (let s = 0; s < stems; s++) {
      const bearing = facing + (s / stems) * Math.PI * 2 + rng.around(0, 0.3);
      const across = bearing + Math.PI / 2;
      // Tips at varied heights: all of them reaching the same ceiling gives a dome
      // with a machined rim. One designated leader, though, or some seeds roll
      // every stem short and the plant comes out small rather than wide. The whole
      // bush is spun by a random `rotateY` at the end, so there is no bias in
      // where the tall side faces.
      const top = height * (s === 0 ? rng.range(0.92, 1) : rng.range(0.58, 1));
      const reach = spread * rng.range(0.8, 1);
      const wander = reach * rng.around(0, 0.26);
      const butt = rng.range(0.022, 0.034);

      const base = new THREE.Vector3(
        Math.sin(bearing) * rng.range(0.02, 0.06),
        rng.range(0.03, 0.07),
        Math.cos(bearing) * rng.range(0.02, 0.06),
      );

      /**
       * A point on the stem's arch, u from 0 at the ground to 1 at the tip. The two
       * exponents pull in opposite directions — height rises fast and flattens,
       * reach starts slow and accelerates — so the stem goes up first and out
       * afterwards, which is what an arch is. Both linear gives a straight spoke.
       */
      const along = (u: number): THREE.Vector3 => {
        const outward = reach * u ** 1.5;
        // A sideways bow, largest in the middle and zero at both ends. Without it
        // every stem lies in its own vertical plane through the axis.
        const side = wander * Math.sin(Math.PI * u);
        return new THREE.Vector3(
          base.x + Math.sin(bearing) * outward + Math.sin(across) * side,
          base.y + (top - base.y) * (1 - (1 - u) ** 1.6),
          base.z + Math.cos(bearing) * outward + Math.cos(across) * side,
        );
      };

      const nodes = [along(0), along(1 / 3), along(2 / 3), along(1)];
      let behind: THREE.Vector3 | null = null;

      for (let i = 0; i < 3; i++) {
        // Overlapped into the segment below, not butted onto it. Two rods meeting
        // end to end put two rings of the same radius on the same circle, tilted
        // apart only by the change in pitch, and two of those vertices can land in
        // one quantized cell. A few centimetres of overlap is under the bark.
        const sunk = behind
          ? new THREE.Vector3().lerpVectors(nodes[i], behind, rng.range(0.07, 0.15))
          : nodes[i];
        parts.push({
          geometry: rod(sunk, nodes[i + 1], butt * (1 - i * 0.22), butt * (1 - (i + 1) * 0.22), 4),
          color: shade(bark, rng.range(0.92, 1.08)),
          sway: ramp,
        });
        behind = nodes[i];
      }

      // Leaf along the whole arch, including low down: the lowest node sits at
      // roughly a quarter of the plant's height, and its leaves droop from there.
      pinnateLeaves(along(rng.range(0.24, 0.34)), bearing);
      pinnateLeaves(along(rng.range(0.55, 0.66)), bearing);
      pinnateLeaves(along(rng.range(0.86, 0.95)), bearing);

      // The head hangs from a point back inside the woody stem rather than off
      // its very tip, for the same near-coincidence reason as the segments.
      const hangs = new THREE.Vector3().lerpVectors(nodes[3], nodes[2], rng.range(0.08, 0.2));
      if (inFruit) berryCyme(hangs, bearing);
      else corymb(hangs, bearing);
    }

    // --- basal shoots --------------------------------------------------------
    // Elder suckers hard from the base, and short leafy whips out of the boss put
    // leaf at knee height out at the edge of the footprint — the one place the
    // arched stems cannot reach.
    const shoots = rng.int(3, 4);
    for (let i = 0; i < shoots; i++) {
      const bearing = facing + rng.range(0, Math.PI * 2);
      const long = height * rng.range(0.34, 0.5);
      // Steeply up, and the floor on this angle is load-bearing: an elder leaf
      // hangs about 0.23 m below the node it grows from, so a shallower shoot puts
      // its whole leaf pair through the ground.
      const lean = rng.range(1, 1.35);
      const from = new THREE.Vector3(
        Math.sin(bearing) * rng.range(0.03, 0.08),
        rng.range(0.02, 0.05),
        Math.cos(bearing) * rng.range(0.03, 0.08),
      );
      const to = new THREE.Vector3(
        from.x + Math.sin(bearing) * Math.cos(lean) * long,
        from.y + Math.sin(lean) * long,
        from.z + Math.cos(bearing) * Math.cos(lean) * long,
      );
      parts.push({
        geometry: rod(from, to, rng.range(0.012, 0.017), rng.range(0.006, 0.009), 4),
        color: shade(bark, rng.range(1, 1.12)),
        sway: ramp,
      });
      pinnateLeaves(to, bearing);
    }

    /**
     * An opposed pair of pinnate leaves at a node, held out sideways from the stem
     * and roughly level. `rod` for the rachis, because it has to start exactly on
     * the stem.
     */
    function pinnateLeaves(node: THREE.Vector3, stemBearing: number): void {
      const long = height * rng.range(0.19, 0.27);

      for (const side of [-1, 1]) {
        // Out to the side of the stem and swept a little forward, which is what
        // stops an opposed pair reading as one straight bar through the node.
        const aim = stemBearing + side * rng.range(1, 1.45);
        // Level to distinctly drooping. A leaf that hangs fills the space below its
        // node, which is where a bush needs filling.
        const droop = rng.range(-0.42, 0.04);
        const tip = new THREE.Vector3(
          node.x + Math.sin(aim) * Math.cos(droop) * long,
          node.y + Math.sin(droop) * long,
          node.z + Math.cos(aim) * Math.cos(droop) * long,
        );
        // Started a centimetre out along its own direction and given its own
        // thickness: a pair of rods leaving one point at one radius put their end
        // rings on the same small circle. This end is buried in the stem either
        // way. Three-sided rather than four — a rachis is two millimetres thick.
        const stalk = new THREE.Vector3().lerpVectors(node, tip, rng.range(0.03, 0.07));
        parts.push({
          geometry: rod(stalk, tip, rng.range(0.0072, 0.0092), 0.0035, 3),
          color: shade(green, 0.78),
          sway: ramp,
        });

        // Two opposed pairs and a terminal leaflet. Five is the low end of what an
        // elder leaf carries and it is enough: the read is a row of leaflets.
        const pairs = 2;
        for (let p = 0; p < pairs; p++) {
          const at = (p + 0.85) / (pairs + 1.15);
          const size = long * rng.range(0.36, 0.46);
          for (const fan of [-1, 1]) {
            // Sub-opposite rather than exactly opposite, which is what an elder leaf
            // does and what keeps the pair from sharing one base point.
            const on = new THREE.Vector3().lerpVectors(node, tip, at + rng.around(0, 0.045));
            parts.push({
              geometry: leaflet(
                size * rng.range(0.94, 1.08),
                // Perpendicular to the rachis, swept back toward the node —
                // the angle every pinnate leaf makes.
                aim + fan * rng.range(1.05, 1.35),
                droop + rng.around(0, 0.22),
                on,
              ),
              color: shade(green, rng.range(0.86, 1.14)),
              sway: ramp,
            });
          }
        }

        // The terminal leaflet, on the axis of the rachis. Without it the leaf
        // stops mid-air at its last pair and reads as broken.
        parts.push({
          geometry: leaflet(long * rng.range(0.38, 0.48), aim, droop, tip),
          color: shade(green, rng.range(0.86, 1.14)),
          sway: ramp,
        });
      }
    }

    /**
     * One leaflet: a flattened three-sided fin, lying face-up. `rotateX(π/2 +
     * droop)` lays the cone down — it was built pointing +Y with its thin axis on
     * Z, so this swings the length into the horizontal plane and the thin axis
     * into the vertical one — and only then does `rotateY` aim it. The other order
     * tips the blade onto its edge.
     */
    function leaflet(
      size: number,
      aim: number,
      droop: number,
      at: THREE.Vector3,
    ): THREE.BufferGeometry {
      const blade = new THREE.ConeGeometry(size * rng.range(0.28, 0.36), size, 3);
      blade.translate(0, size * 0.5, 0);
      blade.scale(1, 1, rng.range(0.2, 0.3));
      blade.rotateX(Math.PI / 2 + droop);
      blade.rotateY(aim);
      blade.translate(at.x, at.y, at.z);
      return blade;
    }

    /**
     * A cyme of ripe berries, hanging. It goes down from its node rather than up,
     * has depth rather than being a plate, is crimson and near-black rather than
     * cream, and sits under the arch in shadow — every part of it chosen to be
     * un-umbel-like. The berries are knots rather than individual fruit: each lump
     * is a sub-bunch three centimetres across, as octahedra, which is what makes
     * seven per cyme affordable.
     */
    function berryCyme(from: THREE.Vector3, stemBearing: number): void {
      const drop = height * rng.range(0.1, 0.16);
      // Out along the stem and down. Hung straight down, the bunch disappears
      // behind the leaves at the node above it.
      const hub = new THREE.Vector3(
        from.x + Math.sin(stemBearing) * drop * rng.range(0.25, 0.55),
        from.y - drop,
        from.z + Math.cos(stemBearing) * drop * rng.range(0.25, 0.55),
      );
      parts.push({
        geometry: rod(from, hub, rng.range(0.008, 0.011), rng.range(0.005, 0.007), 4),
        color: shade(BERRY_STALK, rng.range(0.9, 1.1)),
        sway: swayAt(hub.y),
      });

      // Two side arms off the peduncle, so the bunch is branched rather than a ball
      // on a stick. Each draws its own radius and its own attachment point.
      const heads = [hub];
      for (const hand of [-1, 1]) {
        const arm = stemBearing + hand * rng.range(1.6, 2.4);
        const armLong = drop * rng.range(0.38, 0.62);
        const at = new THREE.Vector3().lerpVectors(from, hub, rng.range(0.5, 0.78));
        const end = new THREE.Vector3(
          at.x + Math.sin(arm) * armLong,
          at.y - armLong * rng.range(0.35, 0.75),
          at.z + Math.cos(arm) * armLong,
        );
        parts.push({
          geometry: rod(at, end, rng.range(0.0032, 0.0045), 0.0026, 3),
          color: shade(BERRY_STALK, rng.range(0.85, 1.05)),
          sway: swayAt(end.y),
        });
        heads.push(end);
      }

      const knots = rng.int(6, 7);
      for (let k = 0; k < knots; k++) {
        const head = heads[k % heads.length];
        const spoke = (k / knots) * Math.PI * 2 + rng.around(0, 0.8);
        const size = rng.range(0.026, 0.04);
        const reach = size * rng.range(0.5, 1.5);
        const at = new THREE.Vector3(
          head.x + Math.sin(spoke) * reach,
          head.y - rng.range(0, size * 1.2),
          head.z + Math.cos(spoke) * reach,
        );
        // Octahedra, each with its own radius and its own pair of rotations.
        // Congruent parts landing on one another is what welds edges onto four
        // faces, and three independent draws per knot makes that measure-zero.
        const knot = new THREE.OctahedronGeometry(size, 0);
        knot.scale(rng.range(0.85, 1.15), rng.range(0.8, 1.05), rng.range(0.85, 1.15));
        knot.rotateY(rng.range(0, Math.PI));
        knot.rotateX(rng.range(0, Math.PI));
        knot.translate(at.x, at.y, at.z);
        parts.push({
          geometry: knot,
          // The bloom on top, the wet black underneath. Per face at its centroid,
          // so the change lands on a facet boundary and comes out crisp.
          color: (_x, y) => (y > at.y ? BERRY_BLOOM : BERRY),
          sway: swayAt(at.y),
        });
      }
    }

    /**
     * The minority flowering roll: a domed corymb bedded into the leaf. Cow
     * parsley's head is a flat table on a bare stem with nothing underneath it,
     * and that combination is its whole identity; three lobes and a middle, humped
     * and sitting in foliage, is a different object.
     */
    function corymb(from: THREE.Vector3, stemBearing: number): void {
      const plate = height * rng.range(0.12, 0.16);
      const hub = new THREE.Vector3(
        from.x + Math.sin(stemBearing) * plate * rng.range(0.1, 0.35),
        from.y + plate * rng.range(0.18, 0.38),
        from.z + Math.cos(stemBearing) * plate * rng.range(0.1, 0.35),
      );
      parts.push({
        geometry: rod(from, hub, rng.range(0.009, 0.012), 0.007, 4),
        color: shade(green, 0.8),
        sway: swayAt(hub.y),
      });

      const lobes = 3;
      for (let l = 0; l < lobes; l++) {
        const spoke = (l / lobes) * Math.PI * 2 + rng.around(0, 0.35);
        const at = new THREE.Vector3(
          hub.x + Math.sin(spoke) * plate * rng.range(0.42, 0.6),
          hub.y + plate * rng.around(0, 0.07),
          hub.z + Math.cos(spoke) * plate * rng.range(0.42, 0.6),
        );
        const lobe = lumpySphere(rng, plate * rng.range(0.3, 0.42), 0, 0.82, 1.12);
        // Squashed to a third rather than a quarter: that number is the difference
        // between a dome and a plate.
        lobe.scale(1, rng.range(0.34, 0.46), 1);
        lobe.translate(at.x, at.y, at.z);
        parts.push({
          geometry: lobe,
          color: (_x, y) => (y > at.y ? FLOWER : FLOWER_SHADE),
          sway: swayAt(at.y),
        });
      }

      const centre = lumpySphere(rng, plate * rng.range(0.34, 0.44), 0, 0.84, 1.1);
      centre.scale(1, rng.range(0.38, 0.5), 1);
      centre.translate(hub.x, hub.y + plate * rng.range(0.03, 0.08), hub.z);
      parts.push({ geometry: centre, color: FLOWER, sway: swayAt(hub.y) });
    }

    const geometry = assemble(parts);
    geometry.rotateY(rng.range(0, Math.PI * 2));
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'elder', rng.range(0, Math.PI * 2));
  },
};
