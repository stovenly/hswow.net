import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE } from '../palette';

// A water trough: four walls, a floor, and sometimes standing water. Built from
// five slabs rather than by cutting a box, because a container is walls. The water
// is a flat panel a little below the rim — the only surface in the kit meant to be
// looked into rather than at, and a trough filled to the brim reads as a solid
// block of colour.
export const trough: MeshBuilder = {
  name: 'trough',
  category: 'objects',
  radius: 1.1,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const length = rng.range(1.4, 2.1);
    const width = rng.range(0.5, 0.75);
    const height = rng.range(0.4, 0.6);
    const t = rng.range(0.09, 0.14);
    const stone = rng.chance(0.55);
    const shell = stone ? PALETTE.STONE : PALETTE.TIMBER;

    // Set into the walls rather than flush with them, in both directions. A floor
    // the full outer size puts its side faces exactly where the walls' outer faces
    // land, which is a coplanar pair running the whole way round the base. A
    // thickness smaller in each direction lands the floor's edge halfway into the
    // wall it meets, coincident with neither face.
    const floor = new THREE.BoxGeometry(length - t, t, width - t);
    // Lifted clear of the ground for the same reason, in the one direction the inset
    // cannot help with: on y = 0 the floor's underside is coplanar with the walls'.
    // The void it leaves underneath is sealed by the walls on every side.
    floor.translate(0, t / 2 + 0.01, 0);
    parts.push({ geometry: floor, color: stone ? PALETTE.STONE_DARK : PALETTE.TIMBER_DARK, sway: 0 });

    // Each piece is a slightly different size from its neighbours on purpose: boxes
    // that share an exact corner share exact edges, and a shared edge belongs to
    // four faces instead of two.
    for (const side of [-1, 1]) {
      const long = new THREE.BoxGeometry(length * 0.99, height, t);
      long.translate(0, height / 2, (side * (width - t)) / 2);
      parts.push({ geometry: long, color: shell, sway: 0 });

      // Full width, so the ends run through the sides rather than butting exactly
      // against them. Overlapping is both cheaper to reason about and how joinery
      // actually works.
      const short = new THREE.BoxGeometry(t, height * 0.985, width * 0.985);
      short.translate((side * (length - t)) / 2, height / 2, 0);
      parts.push({ geometry: short, color: shell, sway: 0 });
    }

    if (rng.chance(0.6)) {
      // Wider than the cavity, so its edges disappear into the walls: at exactly the
      // width of the opening the water's four side faces sit in the same planes as
      // the walls' inner faces, which is the pair you look straight at. Sinking it a
      // fifth of a wall's thickness also removes the hairline of background a
      // perfectly fitted panel shows at grazing angles.
      const water = new THREE.BoxGeometry(length - t * 1.6, 0.03, width - t * 1.6);
      water.translate(0, height * rng.range(0.55, 0.78), 0);
      parts.push({ geometry: water, color: 0x2c3f46, sway: 0 });
    }

    const geometry = assemble(parts);
    geometry.rotateY(rng.range(0, Math.PI));
    if (scale !== 1) geometry.scale(scale, scale, scale);
    // Said here rather than in `art/underfoot.ts`, because only the roll above
    // knows which of the two this one is.
    return finish(geometry, 'trough', 0, stone ? 'stone' : 'wood');
  },
};
