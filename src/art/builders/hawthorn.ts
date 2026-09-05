import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, heightRamp, type Part } from '../assemble';
import { lumpySphere } from '../blob';
import { createRng } from '../random';
import { rod } from '../rod';
import { PALETTE, shade } from '../palette';

// Hawthorn: a short trunk bent by the wind, its dense crown streaming toward +Z.
// On y = 0; a placer turns +Z downwind.
export const hawthorn: MeshBuilder = {
  name: 'hawthorn',
  category: 'foliage',
  radius: 1.7,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const height = rng.range(1.3, 1.9);
    const lean = rng.range(0.28, 0.45);
    const butt = rng.range(0.09, 0.13);
    const bark = shade(PALETTE.BARK, rng.range(0.9, 1.05));
    const leaf = rng.chance(0.6) ? PALETTE.LEAF_DARK : PALETTE.LEAF;
    const ramp = heightRamp(0, height + 1, 1.6);

    // rotateX(lean) takes +Y toward +Z, the way the wind has bent it.
    const lowerLength = height * 0.5;
    const lower = new THREE.CylinderGeometry(butt * 0.85, butt, lowerLength, 6);
    lower.translate(0, lowerLength / 2, 0);
    lower.rotateX(lean);
    parts.push({ geometry: lower, color: bark, sway: ramp });

    const knee = new THREE.Vector3(0, lowerLength * Math.cos(lean), lowerLength * Math.sin(lean));
    const upperLean = lean * 1.5;
    const upperLength = height - lowerLength;
    const upper = new THREE.CylinderGeometry(butt * 0.55, butt * 0.87, upperLength, 5);
    upper.translate(0, upperLength / 2, 0);
    upper.rotateX(upperLean);
    upper.translate(knee.x, knee.y, knee.z);
    parts.push({ geometry: upper, color: bark, sway: ramp });

    const top = new THREE.Vector3(
      0,
      knee.y + upperLength * Math.cos(upperLean),
      knee.z + upperLength * Math.sin(upperLean),
    );

    const masses = rng.int(5, 7);
    for (let i = 0; i < masses; i++) {
      const r = rng.range(0.45, 0.75);
      const at = new THREE.Vector3(
        top.x + rng.range(-0.8, 0.8),
        top.y + rng.range(-0.1, 0.6),
        top.z + rng.range(-0.1, 1.1),
      );
      const mass = lumpySphere(rng, r, 0, 0.74, 1.22);
      mass.scale(1, rng.range(0.7, 0.85), 1);
      mass.translate(at.x, at.y, at.z);
      parts.push({
        geometry: mass,
        color: shade(rng.chance(0.3) ? PALETTE.LEAF : leaf, rng.range(0.9, 1.08)),
        sway: 0.5,
      });
      parts.push({ geometry: rod(top, at, butt * 0.5, butt * 0.2, 4), color: bark, sway: ramp });
    }

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'hawthorn', rng.range(0, Math.PI * 2));
  },
};
