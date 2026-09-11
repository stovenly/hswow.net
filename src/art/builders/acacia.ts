import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { heightRamp, type Part } from '../assemble';
import { createRng } from '../random';
import { shade } from '../palette';
import { LEAVES, branchCards, cloud, finishFoliage, heightWeight, type Cloud, type Species, type Twig } from '../foliage';
import { lathe } from '../oakwood';
import { OAK_GROWTH, growLimb, limbBranch, limbGeometry, type GrowForm, type Limb } from '../limbs';
import { SHEET_OF } from '../branchSheet';

// Umbrella thorn: a short dark bole forking low into two or three limbs that go
// up in a narrow V and then flatten right over, under a plate of fine pinnate
// cards far wider than the tree is tall. The plate is stacked from discs at one
// height rather than one ellipsoid, so it is flat above and below and rounded
// only at the rim. Stands on y = 0.

const TAU = Math.PI * 2;
const BOLE = 0x4a4036;
const BOUGH = 0x8c8069;

/** The bough leaves steeply and `lift` lays it over; everything after it runs level and lifts at the tips. */
const ACACIA_GROWTH: GrowForm = {
  ...OAK_GROWTH,
  children: [
    [2, 3],
    [2, 3],
    [3, 4],
  ],
  lengthRatio: [
    [0.5, 0.68],
    [0.45, 0.62],
    [0.4, 0.58],
  ],
  angle: [
    [0.5, 0.85],
    [0.55, 0.95],
    [0.6, 1.0],
  ],
  along: [
    [0.35, 0.92],
    [0.3, 0.92],
    [0.3, 0.95],
  ],
  lift: [-0.2, -0.04, 0.03, 0.05],
  wobble: [0.1, 0.22, 0.3, 0.4],
  sides: [7, 6, 5, 4],
  levels: 3,
  swing: [0.09, 0.08],
  minRadius: 0.03,
};

export const acacia: MeshBuilder = {
  name: 'acacia',
  category: 'foliage',
  radius: 6,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const height = rng.range(7, 9.5);
    const butt = rng.range(0.24, 0.34);
    const forkAt = rng.range(1.6, 2.6);
    const bendAt = rng.range(0, TAU);
    const bend = rng.range(0.03, 0.12);
    const spine = (y: number): THREE.Vector3 => {
      const t = Math.max(0, y / height);
      return new THREE.Vector3(Math.cos(bendAt) * bend * t, y, Math.sin(bendAt) * bend * t);
    };
    const thin = 0.26;
    const ribs = rng.int(3, 5);
    const ribPhase = rng.range(0, TAU);
    const fissurePhase = rng.range(0, TAU);
    const sway = heightRamp(0, height, 2.0);
    parts.push({
      geometry: lathe(spine, butt, forkAt, ribs, ribPhase, thin, [0.5, Math.min(1.2, forkAt)], true),
      color: (x, y, z) => {
        const c = spine(y);
        const theta = Math.atan2(z - c.z, x - c.x);
        const cut = Math.sin(theta * 7 + y * 1.1 + fissurePhase) * 0.6 + Math.sin(theta * 15 - y * 1.7) * 0.4;
        return shade(BOLE, cut > 0.45 ? 0.84 : cut > 0.05 ? 0.95 : 1.06);
      },
      sway,
    });

    const species: Species = { colour: LEAVES.acacia, deciduous: true, bark: BOUGH, weight: heightWeight(height, 2.0) };
    const limbs: Limb[] = [];
    const twigs: Twig[] = [];
    const boughs = rng.int(3, 4);
    const topR = butt * (1 - thin);
    // Over the cross-section the bole could pay for: an acacia's fork is limbs nearly as thick as what they left.
    const boughR = topR * rng.range(0.5, 0.62);
    const start = rng.range(0, TAU);
    const from = spine(forkAt);
    for (let i = 0; i < boughs; i++) {
      const b = start + (i / boughs) * TAU + rng.around(0, 0.2);
      const out = new THREE.Vector3(Math.cos(b), 0, Math.sin(b));
      // A narrow V: the limbs are still climbing where they part, and `lift` is
      // what lays them over into the plate, not the angle they leave at.
      const tilt = rng.range(0.26, 0.44);
      const dir = new THREE.Vector3(0, Math.cos(tilt), 0).addScaledVector(out, Math.sin(tilt)).normalize();
      const at = from.clone().addScaledVector(out, topR - boughR);
      growLimb(rng, at, dir, (height - forkAt) * rng.range(0.82, 1.0), boughR, 0, ACACIA_GROWTH, limbs, twigs);
    }
    for (const limb of limbs) {
      parts.push({ geometry: limbGeometry(limb), color: shade(limb.level === 0 ? BOLE : BOUGH, (0.9 + limb.level * 0.05) * rng.range(0.95, 1.05)), sway, branch: limbBranch(limb) });
    }

    // Where the wood actually ended up, rather than a guess: the plate is laid on
    // the tips, so a bough that went further carries the rim out with it.
    const deep = height * rng.range(0.1, 0.13);
    let crownY = 0;
    let spread = 0;
    for (const twig of twigs) {
      crownY += twig.to.y;
      spread = Math.max(spread, Math.hypot(twig.to.x, twig.to.z));
    }
    crownY = crownY / Math.max(1, twigs.length) + deep * 0.2;
    // Capped at five eighths of the height: an umbrella thorn is about as wide as it is tall, not half as wide again.
    const wide = Math.min(height * 0.62, Math.max(height * 0.42, spread + height * 0.06));

    const clouds: Cloud[] = [cloud(rng, new THREE.Vector3(0, crownY, 0), new THREE.Vector3(wide * 0.58, deep, wide * 0.58), 0.1)];
    const ring = rng.int(5, 7);
    const spin = rng.range(0, TAU);
    for (let i = 0; i < ring; i++) {
      const b = spin + (i / ring) * TAU;
      const at = new THREE.Vector3(Math.cos(b) * wide * 0.5, crownY + rng.around(0, deep * 0.25), Math.sin(b) * wide * 0.5);
      clouds.push(cloud(rng, at, new THREE.Vector3(wide * 0.46, deep * 0.9, wide * 0.46), 0.15));
    }
    // The second tier, hung under one side: an umbrella thorn is layered, and one
    // unbroken plate reads as a table rather than as a tree.
    const off = rng.range(0, TAU);
    clouds.push(
      cloud(
        rng,
        new THREE.Vector3(Math.cos(off) * wide * 0.36, crownY - deep * rng.range(1.4, 2.2), Math.sin(off) * wide * 0.36),
        new THREE.Vector3(wide * 0.42, deep * 0.75, wide * 0.42),
        0.15,
      ),
    );
    parts.push(...branchCards(rng, species, clouds, { twigs, count: 420, length: [0.3, 0.46], tiles: SHEET_OF.pinnate, perTwig: 2, upward: 0.3 }));

    return finishFoliage(parts, 'acacia', rng.range(0, TAU), 0, scale);
  },
};
