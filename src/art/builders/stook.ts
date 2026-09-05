import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, heightRamp, type Part } from '../assemble';
import { createRng } from '../random';
import { rod } from '../rod';
import { PALETTE, shade } from '../palette';

// Stook: sheaves stood together in a cone, ears up, on y = 0.
export const stook: MeshBuilder = {
  name: 'stook',
  category: 'objects',
  radius: 0.75,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const count = rng.int(6, 8);
    const ring = rng.range(0.28, 0.36);
    const length = rng.range(1.0, 1.25);
    const straw = shade(PALETTE.GRASS_DRY, rng.range(1.05, 1.18));
    const ears = shade(PALETTE.GRASS_DRY, rng.range(1.22, 1.32));
    const band = shade(PALETTE.GRASS_DRY, 0.8);
    const ramp = heightRamp(0, length * 1.2, 2);

    const first = rng.range(0, Math.PI * 2);
    for (let i = 0; i < count; i++) {
      const bearing = first + (i / count) * Math.PI * 2 + rng.around(0, 0.15);
      const out = ring * rng.range(0.9, 1.1);
      const radius = rng.range(0.085, 0.11);
      const base = new THREE.Vector3(Math.cos(bearing) * out, 0.02, Math.sin(bearing) * out);
      const inward = out * 0.85;
      const tip = new THREE.Vector3(
        base.x - Math.cos(bearing) * inward,
        Math.sqrt(Math.max(length * length - inward * inward, 0.1)),
        base.z - Math.sin(bearing) * inward,
      );
      const along = (t: number): THREE.Vector3 => base.clone().lerp(tip, t);
      parts.push({ geometry: rod(base, tip, radius, radius * 0.75, 5), color: shade(straw, rng.around(1, 0.05)), sway: ramp });
      parts.push({ geometry: rod(along(0.78), along(0.83), radius * 1.15, radius * 1.15, 6), color: band, sway: ramp });
      const head = tip.clone().add(tip.clone().sub(base).normalize().multiplyScalar(0.26));
      parts.push({ geometry: rod(tip, head, radius * 0.8, radius * 1.5, 5), color: shade(ears, rng.around(1, 0.04)), sway: ramp });
    }

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'stook', rng.range(0, Math.PI * 2));
  },
};
