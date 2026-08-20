import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE } from '../palette';

// A tuft of grass: a handful of tapered blades leaning off vertical. Three-sided
// cones squashed flat rather than crossed quads, which need an alpha-cut texture.
// The tuft you scatter to break an edge; `large-grass-clump` is what you lay a
// field with.
export const smallGrassClump: MeshBuilder = {
  name: 'small-grass-clump',
  category: 'foliage',
  radius: 0.55,
  // Walk straight through it. A tuft that stops you is the fastest way to make
  // a world feel like a floor with boxes on it.
  solid: false,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    // A clump, not a handful: grass only starts looking like ground cover somewhere
    // past about thirty blades, where they overlap enough that the eye stops
    // counting them.
    const blades = rng.int(30, 46);

    for (let i = 0; i < blades; i++) {
      const height = rng.range(0.16, 0.6);
      const blade = new THREE.ConeGeometry(rng.range(0.016, 0.032), height, 3);
      blade.translate(0, height / 2, 0);
      // Flattened across one axis so a blade is a blade and not a spike.
      blade.scale(1, 1, rng.range(0.3, 0.55));
      // Taller blades flop further — a tuft is domed, not a flat-topped brush.
      const droop = rng.range(0.1, 0.75) * (height / 0.6);
      blade.rotateZ(rng.chance(0.5) ? droop : -droop);
      blade.rotateY(rng.range(0, Math.PI * 2));

      // Denser in the middle, thinning at the edges. A uniform scatter across
      // a disc leaves a ring of stragglers with a hole in the centre, because
      // area grows with the square of the radius.
      const angle = rng.range(0, Math.PI * 2);
      const distance = Math.sqrt(rng()) * 0.26;
      blade.translate(Math.cos(angle) * distance, 0, Math.sin(angle) * distance);

      parts.push({
        geometry: blade,
        color: rng.chance(0.3) ? PALETTE.GRASS_DRY : PALETTE.GRASS,
        // Free at the tip, pinned at the root, with the exponent keeping the lower
        // half almost still. Clamped before the power, not after: tilting a blade
        // rotates its base vertices fractionally below y = 0, and a negative base to
        // a fractional exponent is NaN.
        sway: (_x, y) => Math.max(0, y / height) ** 1.5,
      });
    }

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'small-grass-clump', rng() * Math.PI * 2);
  },
};
