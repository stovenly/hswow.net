import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';

// A scatter of pine cones on the ground — the one piece of litter that is
// specific, since cones overhead mean a particular kind of tree. A scatter rather
// than a single cone, as the flowers are clumps. The stepped, overlapping tiers of
// scales are the whole object and are built as real geometry.
export const pinecone: MeshBuilder = {
  name: 'pinecone',
  category: 'nature',
  radius: 0.4,
  // Ankle-height litter. Being stopped by a pine cone would be absurd.
  solid: false,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const cones = rng.int(3, 7);
    const spread = rng.range(0.16, 0.3);

    for (let c = 0; c < cones; c++) {
      const at = rng.range(0, Math.PI * 2);
      const away = Math.sqrt(rng()) * spread;
      const ox = Math.cos(at) * away;
      const oz = Math.sin(at) * away;

      const length = rng.range(0.11, 0.18);
      const fat = length * rng.range(0.36, 0.46);
      const brown = shade(rng.chance(0.5) ? PALETTE.BARK : 0x6b4a2c, rng.range(0.85, 1.15));

      // Lying on its side at a random angle, because that is how they land.
      // Built about the origin pointing +Y, then laid over as a whole.
      const tilt = rng.range(0.9, 1.35);
      const roll = rng.range(0, Math.PI * 2);
      const lay = (geometry: THREE.BufferGeometry): void => {
        geometry.rotateX(tilt);
        geometry.rotateY(roll);
        geometry.translate(ox, fat * 0.55, oz);
      };

      // The core, tapered at both ends — a cone is pointed at the tip and
      // rounded at the base, and a cylinder is neither.
      const core = new THREE.CylinderGeometry(fat * 0.18, fat * 0.5, length * 0.82, 6);
      lay(core);
      parts.push({ geometry: core, color: shade(brown, 0.8), sway: 0 });

      const nose = new THREE.ConeGeometry(fat * 0.2, length * 0.3, 6);
      nose.translate(0, length * 0.55, 0);
      lay(nose);
      parts.push({ geometry: nose, color: shade(brown, 0.75), sway: 0 });

      // Scales, in tiers up the cone, each tier turned from the last so they
      // interleave rather than lining up into ribs.
      const tiers = 4;
      const perTier = 5;
      for (let t = 0; t < tiers; t++) {
        const up = -length * 0.34 + (t / (tiers - 1)) * length * 0.66;
        // Widest in the middle, like the cone itself.
        const belly = 1 - Math.abs(t / (tiers - 1) - 0.35) * 0.9;
        for (let i = 0; i < perTier; i++) {
          const bearing = (i / perTier) * Math.PI * 2 + t * 0.62;
          const flake = new THREE.BoxGeometry(fat * 0.42, fat * 0.16, fat * 0.34);
          // Tipped down and outward, which is what makes the tiers overlap.
          flake.rotateX(-0.5);
          flake.translate(0, 0, fat * 0.5 * belly);
          flake.rotateY(bearing);
          flake.translate(0, up, 0);
          lay(flake);
          parts.push({ geometry: flake, color: shade(brown, rng.range(0.95, 1.2)), sway: 0 });
        }
      }
    }

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'pinecone', 0);
  },
};
