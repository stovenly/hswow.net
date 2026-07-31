import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE } from '../palette';

/**
 * A small building: stone base, timber upper, pitched roof, dark doorway.
 *
 * The doorway is a solid dark panel rather than a hole. Cutting an opening
 * would mean constructive solid geometry, which is a great deal of machinery
 * for something the player reads at a glance — and at this distance and this
 * palette, an unlit recess and an actual hole are indistinguishable. Phase 5's
 * enterable interiors are separate geometry anyway, reached through a trigger,
 * so nothing is ever seen through this.
 *
 * The roof overhangs on purpose. A roof flush with its walls looks like a lid;
 * the overhang and the shadow line under it are what make it a building.
 */
export const hut: MeshBuilder = {
  name: 'hut',
  category: 'structures',
  radius: 2.6,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const width = rng.range(3, 4.4);
    const depth = rng.range(2.6, 3.8);
    const wallHeight = rng.range(2, 2.6);
    const baseHeight = rng.range(0.4, 0.8);

    // Pitched roof from a three-sided cylinder — a prism lying on its side is
    // a gable, and it is one primitive instead of two mitred slabs.
    //
    // **Built about the origin and then lifted onto the walls by measurement.**
    // A prism rotated twice and scaled has an underside whose height is not
    // obvious from any of those numbers, so placing it by a guessed offset
    // buried its lower half inside the walls. Measuring the bounding box and
    // lifting by exactly the shortfall puts the eave on the wall head, whatever
    // the roof shape is next changed to.
    const ridge = rng.range(0.9, 1.5);
    const roof = new THREE.CylinderGeometry(ridge, ridge, width * 1.16, 3, 1);
    roof.rotateZ(Math.PI / 2);
    // Flat side down: the untouched prism rests on an edge.
    roof.rotateX(Math.PI / 6);
    roof.scale(1, 1, (depth * 1.2) / (ridge * 2));
    roof.computeBoundingBox();
    roof.translate(0, wallHeight - (roof.boundingBox?.min.y ?? 0), 0);
    parts.push({ geometry: roof, color: PALETTE.STONE, sway: 0 });

    // Everything below now stops at the wall head, which is where the roof
    // starts. One number, shared, so nothing can end up at a different height
    // from anything else.
    const eave = wallHeight;

    const base = new THREE.BoxGeometry(width, baseHeight, depth);
    base.translate(0, baseHeight / 2, 0);
    parts.push({ geometry: base, color: PALETTE.STONE_DARK, sway: 0 });

    const walls = new THREE.BoxGeometry(width * 0.97, eave - baseHeight, depth * 0.97);
    walls.translate(0, baseHeight + (eave - baseHeight) / 2, 0);
    parts.push({ geometry: walls, color: PALETTE.TIMBER, sway: 0 });

    const doorWidth = rng.range(0.75, 0.95);
    const doorHeight = rng.range(1.5, 1.8);
    // Held in a variable and reused below. The lintel used to be centred on
    // the wall while the door was offset along it, so the beam meant to sit on
    // the doorway sat beside it instead.
    const doorX = rng.around(0, width * 0.15);

    const door = new THREE.BoxGeometry(doorWidth, doorHeight, 0.08);
    door.translate(doorX, doorHeight / 2, depth * 0.487);
    parts.push({ geometry: door, color: 0x171a1c, sway: 0 });

    const lintel = new THREE.BoxGeometry(doorWidth * 1.3, 0.14, 0.16);
    lintel.translate(doorX, doorHeight + 0.07, depth * 0.49);
    parts.push({ geometry: lintel, color: PALETTE.TIMBER_DARK, sway: 0 });

    // Corner posts, tying the timber to the stone. Full height to the eave, so
    // they meet the roof rather than stopping short under it.
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        const corner = new THREE.BoxGeometry(0.16, eave, 0.16);
        corner.translate((sx * width) / 2, eave / 2, (sz * depth) / 2);
        parts.push({ geometry: corner, color: PALETTE.TIMBER_DARK, sway: 0 });
      }
    }

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);

    const mesh = finish(geometry, 'hut', 0);
    // Where a portal door goes, in the hut's own space, facing +Z like the
    // door builder does.
    //
    // Recorded rather than recomputed by the caller. The doorway's position
    // depends on `doorX` and `depth`, both of which are rolled from the seed,
    // so anything placing a door against this hut by arithmetic would have to
    // duplicate the builder's random draws in the right order — and would
    // silently drift the moment anything above is reordered.
    const anchor: HutDoorAnchor = {
      x: doorX * scale,
      z: depth * 0.487 * scale,
      width: doorWidth * scale,
      height: doorHeight * scale,
    };
    mesh.userData.doorAnchor = anchor;
    return mesh;
  },
};

/** Where a hut's doorway is, in the hut's own space. */
export interface HutDoorAnchor {
  x: number;
  z: number;
  width: number;
  height: number;
}

/** Reads the anchor back off a mesh built by this builder. */
export function hutDoorAnchor(mesh: THREE.Mesh): HutDoorAnchor {
  return mesh.userData.doorAnchor as HutDoorAnchor;
}
