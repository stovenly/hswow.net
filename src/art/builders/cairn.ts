import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng, type Rng } from '../random';
import { PALETTE } from '../palette';

// A cairn: stones stacked by hand, each smaller than the one beneath. Each stone
// is welded before displacement, or the shared corners of the non-indexed
// icosahedron pull the surface apart.
function stone(rng: Rng, radius: number): THREE.BufferGeometry {
  const raw = new THREE.IcosahedronGeometry(radius, 0);
  raw.deleteAttribute('normal');
  raw.deleteAttribute('uv');
  const geometry = mergeVertices(raw);
  raw.dispose();

  const position = geometry.getAttribute('position');
  const vertex = new THREE.Vector3();
  for (let i = 0; i < position.count; i++) {
    vertex.fromBufferAttribute(position, i);
    vertex.multiplyScalar(rng.range(0.78, 1.2));
    position.setXYZ(i, vertex.x, vertex.y, vertex.z);
  }
  position.needsUpdate = true;

  // Flattened. Stones that stack are stones that are wider than they are tall,
  // which is why anyone picked them up.
  geometry.scale(1, rng.range(0.45, 0.7), rng.range(0.85, 1.1));
  geometry.computeVertexNormals();
  return geometry;
}

export const cairn: MeshBuilder = {
  name: 'cairn',
  category: 'nature',
  radius: 0.7,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const count = rng.int(4, 7);
    let base = rng.range(0.26, 0.38);
    let y = 0;

    for (let i = 0; i < count; i++) {
      const geometry = stone(rng, base);
      geometry.computeBoundingBox();
      const box = geometry.boundingBox;
      const halfHeight = box ? (box.max.y - box.min.y) / 2 : base * 0.5;

      geometry.rotateY(rng.range(0, Math.PI * 2));
      // Each stone overlaps the one below rather than balancing on it. Stones
      // that merely touch look like they are about to fall, which is a thing
      // real cairns manage to avoid despite appearances.
      y += halfHeight * (i === 0 ? 1 : 1.55);
      geometry.translate(rng.around(0, base * 0.14), y, rng.around(0, base * 0.14));

      parts.push({
        geometry,
        color: rng.chance(0.35) ? PALETTE.STONE_DARK : PALETTE.STONE,
        sway: 0,
      });
      base *= rng.range(0.76, 0.9);
    }

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'cairn', 0);
  },
};
