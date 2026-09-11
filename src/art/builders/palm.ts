import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { heightRamp, type Part } from '../assemble';
import { createRng } from '../random';
import { shade } from '../palette';
import { rod } from '../rod';
import { LEAVES, branchCards, cloud, finishFoliage, heightWeight, type Cloud, type Species, type Twig } from '../foliage';
import { sweep } from '../limbs';
import { SHEET_OF } from '../branchSheet';

// Palm: one unbranched stem, swollen at the foot, leaning and ringed with old
// leaf scars, swelling again at the top into the head every frond leaves from.
// The head is part of the same swept tube as the stem, and everything up there
// is placed on the stem's own axis and radius — offsetting from a world point
// leaves it hanging in air as soon as the stem leans. The arch of a frond is
// drawn into its card, so the cards are pinned rather than turned. Leans toward
// +Z on y = 0, so a placer aims the lean.

const TAU = Math.PI * 2;
/** Successive fronds leave at this bearing apart, so no two sit over one another. */
const GOLDEN = 2.399963;
const UP = new THREE.Vector3(0, 1, 0);

const STEM = 0x7c7060;
const FROND_BASE = 0x8b7a5c;

export const palm: MeshBuilder = {
  name: 'palm',
  category: 'foliage',
  radius: 5,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const height = rng.range(9, 15);
    const butt = rng.range(0.19, 0.27);
    const lean = rng.range(0.14, 0.46);
    const wander = rng.range(-0.09, 0.09);

    // The lean grows with height, so the foot stands square and the crown is the
    // part that has gone over.
    const steps = 8;
    const stemLen = height + 0.18;
    const rise = stemLen / steps;
    const spine: THREE.Vector3[] = [new THREE.Vector3(0, -0.18, 0)];
    const axis = new THREE.Vector3(0, 1, 0);
    for (let i = 0; i < steps; i++) {
      const t = i / (steps - 1);
      const fall = lean * t;
      axis.set(wander * Math.sin(t * 3.1), Math.cos(fall), Math.sin(fall)).normalize();
      spine.push(spine[i].clone().addScaledVector(axis, rise));
    }
    const tip = spine[steps].clone();
    const head = rng.range(0.6, 0.95);
    spine.push(tip.clone().addScaledVector(axis, head * 0.5));
    spine.push(tip.clone().addScaledVector(axis, head));

    const total = stemLen + head;
    const topR = butt * 0.66;
    /** The head's radius, `u` from the stem's tip to the crown. Meets the stem's own top radius at u = 0. */
    const headR = (u: number): number => topR * (1 + 0.32 * Math.sin(Math.PI * u) - 0.86 * u ** 3);
    const stemR = (t: number): number => {
      const s = t * total;
      if (s >= stemLen) return headR((s - stemLen) / head);
      const along = s / stemLen;
      const boot = 1 + 0.6 * Math.max(0, 1 - along / 0.1) ** 2;
      const bulge = 1 + 0.07 * Math.sin(Math.PI * Math.min(1, along / 0.7));
      return butt * boot * bulge * (1 - 0.34 * along);
    };
    const sway = heightRamp(0, height, 1.4);
    const scarPhase = rng.range(0, TAU);
    parts.push({
      geometry: sweep(spine, stemR, 9, true),
      // Scars ring the stem every two thirds of a metre, which is one band per
      // pair of sweep rings: closer than that and the rings alias into stripes.
      color: (x, y, z) => {
        const grain = Math.sin(x * 41.3 + y * 87.9 + z * 59.1) * 0.5 + 0.5;
        return shade(STEM, (0.86 + 0.2 * (0.5 + 0.5 * Math.sin(y * 9.2 + scarPhase))) * (0.98 + 0.04 * grain));
      },
      sway,
    });

    /** A point on the head's axis at `u`, the outward direction there at bearing `b` square to the stem, and the radius. */
    const onHead = (u: number, b: number): { at: THREE.Vector3; out: THREE.Vector3; r: number } => {
      const flat = new THREE.Vector3(Math.cos(b), 0, Math.sin(b));
      return {
        at: tip.clone().addScaledVector(axis, head * u),
        out: flat.addScaledVector(axis, -flat.dot(axis)).normalize(),
        r: headR(u),
      };
    };

    // The boot: the stubs of the fronds that have already fallen, each planted
    // inside the head and standing out past its surface.
    const stubs = rng.int(8, 12);
    const stubStart = rng.range(0, TAU);
    for (let i = 0; i < stubs; i++) {
      const { at, out, r } = onHead(rng.range(0.08, 0.5), stubStart + (i / stubs) * TAU + rng.around(0, 0.2));
      const foot = at.clone().addScaledVector(out, r * 0.55);
      const end = at.clone().addScaledVector(out, r + rng.range(0.13, 0.25)).addScaledVector(axis, rng.range(0.12, 0.28));
      parts.push({ geometry: rod(foot, end, rng.range(0.055, 0.08), 0.028, 4), color: shade(FROND_BASE, rng.range(0.88, 1.08)), sway });
    }

    const species: Species = { colour: LEAVES.palm, deciduous: false, bark: FROND_BASE, weight: heightWeight(height, 1.4) };
    const frondLength = height * rng.range(0.29, 0.37);
    // The one point every frond leaves, well up the head so a card's first tenth is inside it.
    const crown = tip.clone().addScaledVector(axis, head * 0.45);
    const clouds: Cloud[] = [cloud(rng, crown.clone().addScaledVector(UP, frondLength * 0.12), new THREE.Vector3(frondLength * 0.85, frondLength * 0.5, frondLength * 0.85), 0.14)];

    // One card per frond, and no crossed twin: a frond really is a blade, and
    // the ones pointing at the eye going thin is the palm's own read.
    const fronds = rng.int(21, 29);
    const twigs: Twig[] = [];
    const start = rng.range(0, TAU);
    for (let i = 0; i < fronds; i++) {
      const u = i / (fronds - 1);
      // Pitch is the angle the frond *leaves* at; the card's picture carries it
      // down from there, so even the flat ones end up drooping.
      const pitch = 1.0 - 1.45 * u ** 0.8 + rng.around(0, 0.1);
      const b = start + GOLDEN * i + rng.around(0, 0.14);
      const flat = new THREE.Vector3(Math.cos(b), 0, Math.sin(b));
      const away = new THREE.Vector3(0, Math.sin(pitch), 0).addScaledVector(flat, Math.cos(pitch)).normalize();
      // Shortest where they are newest and standing up in the middle of the crown.
      const length = frondLength * (0.6 + 0.4 * Math.sin(Math.PI * Math.min(1, 0.22 + u * 0.78))) * rng.range(0.92, 1.08);
      twigs.push({ from: crown.clone(), to: crown.clone().addScaledVector(away, length) });
    }
    parts.push(...branchCards(rng, species, clouds, { twigs, count: 0, length: [1, 1], tiles: SHEET_OF.frond, turn: false, lengthOf: (twig) => twig.from.distanceTo(twig.to) }));

    // The dead skirt, rooted on the head's lower rim so it hangs against the
    // stem rather than out of the middle of the living crown.
    const dead: Twig[] = [];
    const deadStart = rng.range(0, TAU);
    for (let i = rng.int(4, 7); i > 0; i--) {
      const { at, out, r } = onHead(rng.range(0.05, 0.2), deadStart + GOLDEN * i);
      const pitch = rng.range(-1.35, -0.95);
      const away = new THREE.Vector3(0, Math.sin(pitch), 0).addScaledVector(out, Math.cos(pitch)).normalize();
      const from = at.addScaledVector(out, r * 0.7);
      dead.push({ from, to: from.clone().addScaledVector(away, frondLength * rng.range(0.45, 0.68)) });
    }
    parts.push(...branchCards(rng, species, clouds, { twigs: dead, count: 0, length: [1, 1], tiles: SHEET_OF.frond, turn: false, colour: LEAVES.dry, lengthOf: (twig) => twig.from.distanceTo(twig.to) }));

    return finishFoliage(parts, 'palm', rng.range(0, TAU), 0, scale);
  },
};
