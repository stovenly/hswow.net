import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE } from '../palette';

// A rock: one icosahedron with its vertices shoved about along their own normals.
// Sunk slightly below the origin, so it sits in the ground rather than on it.
export const rock: MeshBuilder = {
  name: 'rock',
  category: 'nature',
  radius: 0.9,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);

    const size = rng.range(0.35, 1.1);
    // Detail 1 for anything sizeable: detail 0 is twelve vertices, which is
    // too few to displace into anything but a lump.
    const raw = new THREE.IcosahedronGeometry(size, size > 0.7 ? 1 : 0);

    // Welded before displacement, and this is the whole builder.
    // `IcosahedronGeometry` is non-indexed, so a corner shared by five faces exists
    // five times over at identical coordinates and displacing the copies pulls the
    // solid to pieces. `mergeVertices` only welds vertices matching in every
    // attribute, and a flat-shaded polyhedron gives each face's corners its own
    // normal — so the normals and the UVs go first.
    raw.deleteAttribute('normal');
    raw.deleteAttribute('uv');
    const geometry = mergeVertices(raw);
    raw.dispose();

    const position = geometry.getAttribute('position');
    const vertex = new THREE.Vector3();

    for (let i = 0; i < position.count; i++) {
      vertex.fromBufferAttribute(position, i);
      vertex.multiplyScalar(rng.range(0.72, 1.28));
      position.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }
    position.needsUpdate = true;

    // Flattened, then part-buried. Boulders are wider than they are tall and
    // they are always partly in the earth.
    geometry.scale(1, rng.range(0.6, 0.85), rng.range(0.85, 1.15));
    geometry.translate(0, size * rng.range(0.28, 0.45), 0);
    geometry.computeVertexNormals();

    const parts: Part[] = [
      { geometry, color: rng.chance(0.3) ? PALETTE.STONE_DARK : PALETTE.STONE, sway: 0 },
    ];

    const merged = assemble(parts);
    if (scale !== 1) merged.scale(scale, scale, scale);
    return finish(merged, 'rock', 0);
  },
};
