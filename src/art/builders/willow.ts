import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, heightRamp, type Part } from '../assemble';
import { lumpySphere } from '../blob';
import { createRng } from '../random';
import { rod } from '../rod';
import { PALETTE, blend, shade } from '../palette';

// Willow: a leaning trunk, a broad crown and curtains of trailing shoots. Leans
// toward +Z on y = 0, so a placer aims it at the water.
export const willow: MeshBuilder = {
  name: 'willow',
  category: 'foliage',
  radius: 2.8,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const height = rng.range(4.2, 5.8);
    const lean = rng.range(0.12, 0.26);
    const butt = rng.range(0.24, 0.34);
    const bark = shade(PALETTE.BARK_PALE, rng.range(0.9, 1.02));
    const leaf = blend(PALETTE.LEAF, PALETTE.GRASS_DRY, rng.range(0.35, 0.5));
    const ramp = heightRamp(0, height, 1.8);

    // rotateX(lean) takes +Y toward +Z, the way the tree leans.
    const lowerLength = height * rng.range(0.42, 0.55);
    const lower = new THREE.CylinderGeometry(butt * 0.8, butt, lowerLength, 7);
    lower.translate(0, lowerLength / 2, 0);
    lower.rotateX(lean);
    parts.push({ geometry: lower, color: bark, sway: ramp });

    const knee = new THREE.Vector3(0, lowerLength * Math.cos(lean), lowerLength * Math.sin(lean));
    const upperLength = height - lowerLength;
    const upperLean = lean * 1.6;
    const upper = new THREE.CylinderGeometry(butt * 0.5, butt * 0.82, upperLength, 6);
    upper.translate(0, upperLength / 2, 0);
    upper.rotateX(upperLean);
    upper.translate(knee.x, knee.y, knee.z);
    parts.push({ geometry: upper, color: bark, sway: ramp });

    const top = new THREE.Vector3(
      0,
      knee.y + upperLength * Math.cos(upperLean),
      knee.z + upperLength * Math.sin(upperLean),
    );

    const masses = rng.int(4, 6);
    const crown: { at: THREE.Vector3; r: number }[] = [];
    for (let i = 0; i < masses; i++) {
      const r = rng.range(0.9, 1.4);
      const bearing = (i / masses) * Math.PI * 2 + rng.around(0, 0.5);
      const out = rng.range(0.4, 1.1);
      const at = new THREE.Vector3(
        top.x + Math.sin(bearing) * out,
        top.y + rng.range(0.1, 0.7),
        top.z + 0.3 + Math.cos(bearing) * out,
      );
      const mass = lumpySphere(rng, r, 0, 0.72, 1.24);
      mass.scale(1, rng.range(0.7, 0.85), 1);
      mass.translate(at.x, at.y, at.z);
      parts.push({ geometry: mass, color: shade(leaf, rng.range(0.9, 1.1)), sway: ramp });
      parts.push({ geometry: rod(top, at, butt * 0.5, butt * 0.22, 5), color: bark, sway: ramp });
      crown.push({ at, r });
    }

    // Trailing shoots hang from the rim of each mass and move most at their tips.
    const shoots = rng.int(16, 24);
    for (let i = 0; i < shoots; i++) {
      const { at, r } = crown[rng.int(0, crown.length - 1)];
      const bearing = rng.range(0, Math.PI * 2);
      const from = new THREE.Vector3(
        at.x + Math.sin(bearing) * r * 0.85,
        at.y - r * 0.25,
        at.z + Math.cos(bearing) * r * 0.85,
      );
      const drift = rng.range(0.3, 0.7);
      const to = new THREE.Vector3(
        from.x + Math.sin(bearing) * drift,
        Math.max(0.4, rng.range(0.5, 1.6)),
        from.z + Math.cos(bearing) * drift,
      );
      parts.push({
        geometry: rod(from, to, 0.05, 0.02, 3),
        color: shade(leaf, rng.range(0.88, 1.06)),
        sway: 0.9,
      });
    }

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'willow', rng.range(0, Math.PI * 2));
  },
};
