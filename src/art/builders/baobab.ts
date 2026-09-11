import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { heightRamp, type Part } from '../assemble';
import { createRng } from '../random';
import { shade } from '../palette';
import { LEAVES, branchCards, cloud, finishFoliage, heightWeight, type Cloud, type Species, type Twig } from '../foliage';
import { OAK_GROWTH, endNormal, growLimb, limbBranch, limbGeometry, sweep, type GrowForm, type Limb } from '../limbs';
import { SHEET_OF } from '../branchSheet';

// Baobab: a bole of several stems fused into one barrel, the seams between them
// deepening as they rise until each stem parts at the shoulder and carries a
// bough away. A bough leaves on a seam's ridge out of a collar swept from inside
// the mass, so the wood runs unbroken through the junction. Stands on y = 0.

const TAU = Math.PI * 2;
const UP = new THREE.Vector3(0, 1, 0);
const BOLE = 0xa89a90;

/** Boughs rise off the shoulder and flatten; everything after them forks wide and turns up at the tip. */
const BAOBAB_GROWTH: GrowForm = {
  ...OAK_GROWTH,
  children: [
    [3, 4],
    [2, 3],
    [2, 3],
  ],
  lengthRatio: [
    [0.45, 0.62],
    [0.45, 0.65],
    [0.4, 0.6],
  ],
  angle: [
    [0.55, 0.95],
    [0.6, 1.05],
    [0.7, 1.2],
  ],
  along: [
    [0.3, 0.9],
    [0.25, 0.9],
    [0.3, 0.95],
  ],
  lift: [-0.06, 0.06, 0.14, 0.2],
  wobble: [0.16, 0.3, 0.45, 0.55],
  sides: [10, 7, 5, 4],
  levels: 3,
  swing: [0.04, 0.035],
  minRadius: 0.035,
  slender: 0.82,
};

export const baobab: MeshBuilder = {
  name: 'baobab',
  category: 'foliage',
  radius: 10,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const height = rng.range(18, 25);
    // A twelfth of the height in radius: the bole being far too fat for the tree is the whole read.
    const butt = height * rng.range(0.082, 0.108);
    const boleTop = height * rng.range(0.58, 0.66);
    const stems = rng.int(3, 5);
    const seamPhase = rng.range(0, TAU);
    const shoulderH = butt * rng.range(0.8, 1.15);
    const total = boleTop + shoulderH;

    const bendAt = rng.range(0, TAU);
    const bend = rng.range(0.06, 0.2);
    /** The bole's axis `s` metres up it, the foot buried at s = 0. */
    const axisAt = (s: number): THREE.Vector3 => {
      const t = Math.max(0, s / total);
      return new THREE.Vector3(Math.cos(bendAt) * bend * t * t, -0.2 + s, Math.sin(bendAt) * bend * t * t);
    };
    /** A barrel widest at two fifths, still nearly full at the top, then doming over into the shoulder. */
    const barrel = (s: number): number => {
      if (s <= boleTop) return 0.82 + 0.3 * Math.sin(Math.PI * (0.3 + (s / boleTop) * 0.48));
      const u = (s - boleTop) / shoulderH;
      return (0.82 + 0.3 * Math.sin(Math.PI * 0.78)) * (1 - 0.6 * u * u);
    };
    /** The seams between the fused stems: shallow at the foot, deep at the shoulder where the stems part. */
    const seam = (b: number, s: number): number => 1 + (0.05 + 0.16 * (s / total) ** 1.5) * Math.cos(stems * b + seamPhase);
    /** The world bearing of the k-th ridge, where the bole is widest and a bough leaves. */
    const ridgeAt = (k: number): number => (TAU * k - seamPhase) / stems;
    const radiusAt = (s: number, b: number): number => butt * barrel(s) * seam(b, s);

    // One field over the whole of the wood, bole and collar and bough alike: a
    // per-part tone would step at every shared ring, and the rings are shared
    // exactly so that the surface reads as one.
    const bark = (x: number, y: number, z: number): number => {
      const c = axisAt(Math.min(total, Math.max(0, y + 0.2)));
      const b = Math.atan2(z - c.z, x - c.x);
      // Light on the ridges and dark in the seams: the bark itself is smooth, so
      // the fusing is all the shape it has.
      const ridge = 0.5 + 0.5 * Math.cos(stems * b + seamPhase);
      const grain = Math.sin(x * 33.7 + y * 79.3 + z * 51.9) * 0.5 + 0.5;
      const skirt = 1 - 0.09 * Math.max(0, 1 - y / (height * 0.2));
      const away = Math.min(1, Math.hypot(x - c.x, z - c.z) / (butt * 3.2));
      return shade(BOLE, (0.88 + 0.16 * ridge) * (0.98 + 0.04 * grain) * skirt * (1 - 0.07 * away));
    };

    const points: THREE.Vector3[] = [];
    for (let i = 0; i <= 7; i++) points.push(axisAt((i / 7) * total));
    const sway = heightRamp(0, height, 3.0);
    parts.push({
      // With normal0 = +X the binormal is tangent × normal = −Z, so a ring's
      // frame angle θ stands at world bearing −θ; the seams are stated as
      // bearings, and the colour reads them the same way.
      geometry: sweep(points, (t, theta) => radiusAt(t * total, -theta), 16, true, new THREE.Vector3(1, 0, 0)),
      color: bark,
      sway,
    });

    const species: Species = { colour: LEAVES.baobab, deciduous: true, bark: shade(BOLE, 0.8), weight: heightWeight(height, 3.0) };
    const limbs: Limb[] = [];
    const twigs: Twig[] = [];
    const shoulder = butt * barrel(boleTop);
    const boughR = shoulder * rng.range(0.3, 0.4);
    const boughs = stems + rng.int(1, 3);
    const sides = BAOBAB_GROWTH.sides[0];
    for (let i = 0; i < boughs; i++) {
      const b = ridgeAt(i % stems) + rng.around(0, 0.11);
      const out = new THREE.Vector3(Math.cos(b), 0, Math.sin(b));
      // One bough off the crest of each ridge, and the spares off the same
      // ridges lower down and flatter, so the shoulder is never a ring of equals.
      const first = i < stems;
      const at = boleTop + shoulderH * (first ? rng.range(0.5, 0.85) : rng.range(0.05, 0.35));
      const c = axisAt(at);
      const r = radiusAt(at, b);
      const tilt = first ? rng.range(0.5, 0.85) : rng.range(0.95, 1.25);
      const dir = new THREE.Vector3(0, Math.cos(tilt), 0).addScaledVector(out, Math.sin(tilt)).normalize();

      // The collar: the bough's own wood carried down inside the bole and
      // swelling where it leaves, so the two are one mass and not a rod in a
      // socket. Rooted below the lip and drawn out over it before it turns away.
      const collar = boughR * rng.range(3.0, 4.2);
      const lip = c.clone().addScaledVector(out, r * 0.95);
      const end = lip.clone().addScaledVector(dir, collar);
      // The last two points differ by a multiple of `dir`, so the curve's end
      // tangent is `dir` exactly and the ring there is square to the bough.
      const spine = [c.clone().addScaledVector(out, r * 0.3).addScaledVector(UP, -collar * 0.3), lip.clone().addScaledVector(UP, collar * 0.1), end.clone().addScaledVector(dir, -collar * 0.35), end];
      // Never wider than the mass it comes out of, or the collar reads as a boil on the bole.
      const flare = Math.min(2.6, (r * 0.62) / boughR);
      // Uncapped and handed over the way one limb hands over to the next: same
      // end point, same radius, same side count, same frame. Anything else and
      // the bough sits on the collar as a separate tube.
      parts.push({ geometry: sweep(spine, (t) => boughR * (1 + (flare - 1) * (1 - t) ** 2.2), sides, false, UP), color: bark, sway });

      growLimb(rng, end.clone(), dir, (height - boleTop) * rng.range(1.1, 1.5), boughR, 0, BAOBAB_GROWTH, limbs, twigs, null, null, sides, endNormal(spine, UP));
    }
    for (const limb of limbs) {
      parts.push({ geometry: limbGeometry(limb), color: bark, sway, branch: limbBranch(limb) });
    }

    // Every card on a twig, none loose in the envelope: a baobab's leaf comes in
    // tufts on the ends of the wood, and the gaps between them are what lets the
    // tangle show. The cloud is only the field the crown is shaded from.
    const low = new THREE.Vector3(Infinity, Infinity, Infinity);
    const high = new THREE.Vector3(-Infinity, -Infinity, -Infinity);
    for (const twig of twigs) {
      low.min(twig.to);
      high.max(twig.to);
    }
    const middle = low.clone().add(high).multiplyScalar(0.5);
    const clouds: Cloud[] = [cloud(rng, middle, high.clone().sub(low).multiplyScalar(0.5).addScalar(1.2), 0.18)];
    parts.push(...branchCards(rng, species, clouds, { twigs, count: 0, length: [0.7, 1.15], tiles: SHEET_OF.smallleaf, perTwig: 3 }));

    return finishFoliage(parts, 'baobab', rng.range(0, TAU), 0, scale);
  },
};
