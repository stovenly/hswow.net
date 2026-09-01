import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';
import type { FinishName } from '../finish';

// The material orbs: one hand-sized sphere per fancy finish, for carrying the
// finish system around as an item. Body colours follow `recipe-fixtures`.

function orb(name: string, display: string, look: FinishName, color: number): MeshBuilder {
  return {
    name,
    display,
    category: 'objects',
    radius: 0.12,
    solid: false,

    build({ seed = 1, scale = 1 } = {}) {
      const rng = createRng(seed);
      const parts: Part[] = [];

      // Subdivided twice for the finish fixtures' reason: fewer facets and a
      // highlight lands between them.
      const radius = rng.range(0.085, 0.115);
      const shape = new THREE.IcosahedronGeometry(radius, 2);
      shape.rotateY(rng() * Math.PI);
      shape.translate(0, radius, 0);
      parts.push({ geometry: shape, color, sway: 0, finish: look });

      const geometry = assemble(parts);
      if (scale !== 1) geometry.scale(scale, scale, scale);
      return finish(geometry, name, 0);
    },
  };
}

export const voidstoneOrb = orb('voidstone-orb', 'Voidstone Orb', 'voidstone', PALETTE.STONE);
export const goldOrb = orb('gold-orb', 'Gold Orb', 'gilt', PALETTE.GOLD);
export const pearlOrb = orb('pearl-orb', 'Pearl Orb', 'nacreous', shade(PALETTE.WOOL, 1.22));
export const quicksilverOrb = orb(
  'quicksilver-orb',
  'Quicksilver Orb',
  'quicksilver',
  shade(PALETTE.CHROME, 0.74),
);
export const oceanglassOrb = orb('oceanglass-orb', 'Oceanglass Orb', 'oceanglass', PALETTE.INK);
