import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { heightRamp, type Part } from '../assemble';
import { createRng } from '../random';
import { shade } from '../palette';
import { LEAVES, branchCards, cloud, finishFoliage, type Cloud, type Species, type Twig } from '../foliage';
import { sweep } from '../limbs';
import { packBranch, type Family } from '../fields';
import { SHEET_OF } from '../branchSheet';

// A bramble: canes swept out of a low mass and diving back to the ground,
// leaves as cards rooted along them. Stands on y = 0.

const TAU = Math.PI * 2;
const CANE_TOP = 1.4;

export const bramble: MeshBuilder = {
  name: 'bramble',
  category: 'foliage',
  radius: 1.3,
  solid: false,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const canes = rng.int(5, 8);
    const reach = rng.range(0.85, 1.4);
    const wood = rng.chance(0.5) ? 0x5a4a38 : 0x6b5230;
    const lean = rng.range(0, TAU);
    const species: Species = { colour: LEAVES.thicket, deciduous: true, bark: shade(wood, 1.2), weight: heightRamp(0, 0.9, 1.4) };
    const sway = heightRamp(0, 0.9, 1.4);

    const twigs: Twig[] = [];
    const clouds: Cloud[] = [];
    const at = new THREE.Vector3();
    const dir = new THREE.Vector3();
    for (let c = 0; c < canes; c++) {
      const bearing = lean + rng.range(-1.6, 1.6);
      const cos = Math.cos(bearing);
      const sin = Math.sin(bearing);
      const run = reach * rng.range(0.8, 1.25);
      const top = rng.range(0.7, 1) * CANE_TOP;
      const root = rng.range(0, 0.09);
      const rootAt = rng.range(0, TAU);
      const x0 = Math.cos(rootAt) * root;
      const z0 = Math.sin(rootAt) * root;
      const p = (f: number, y: number): THREE.Vector3 => new THREE.Vector3(x0 + cos * run * f, y, z0 + sin * run * f);
      // Out and up to an apex at half the run, then over and down to the ground.
      const spine = [p(0, 0.02), p(0.22, top * 0.62), p(0.5, top), p(0.78, top * 0.66), p(1, 0.05)];
      const thick = rng.range(0.013, 0.022);
      const family: Family = { pivot: spine[0].clone(), phase: rng.range(0, 1), swing: 0.14 };
      parts.push({
        geometry: sweep(spine, (t) => thick * (1 - 0.35 * t), 4),
        color: shade(wood, rng.range(0.88, 1.1)),
        sway,
        branch: (x, y, z) => packBranch(x, y, z, family, null),
      });

      // Leaves root on the cane itself and point out from it; there are no side shoots.
      const curve = new THREE.CatmullRomCurve3(spine, false, 'centripetal', 0.5);
      const shoots = rng.int(6, 9);
      for (let k = 0; k < shoots; k++) {
        const t = (k + rng.range(0.15, 0.85)) / shoots;
        at.copy(curve.getPointAt(t));
        const roll = bearing + rng.range(-2.2, 2.2);
        dir.set(Math.cos(roll), rng.range(0.35, 1.1), Math.sin(roll)).normalize().multiplyScalar(rng.range(0.12, 0.2));
        twigs.push({ from: at.clone(), to: at.clone().add(dir), family, sub: null });
        if (k % 3 === 1) {
          const r = reach * rng.range(0.24, 0.34);
          clouds.push(cloud(rng, at.clone().add(new THREE.Vector3(0, r * 0.2, 0)), new THREE.Vector3(r, r * 0.8, r), 0.24));
        }
      }
    }
    clouds.push(cloud(rng, new THREE.Vector3(Math.cos(lean) * reach * 0.15, 0.38, Math.sin(lean) * reach * 0.15), new THREE.Vector3(reach * 0.62, 0.34, reach * 0.55), 0.26));
    parts.push(...branchCards(rng, species, clouds, { twigs, count: 34, length: [0.22, 0.35], tiles: SHEET_OF.smallleaf, perTwig: 2, upward: 0.2 }));

    return finishFoliage(parts, 'bramble', rng.range(0, TAU), 0, scale);
  },
};
