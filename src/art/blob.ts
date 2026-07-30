import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import type { Rng } from './random';

/**
 * A sphere with its vertices shoved about — the kit's workhorse organic shape.
 *
 * Displacing a regular solid is most of what makes procedural geometry look
 * grown rather than generated, and it is used for rocks, for the stones in a
 * cairn, and for a sheep's fleece. Those all wanted the same twenty lines,
 * including the same non-obvious precondition, so they share them.
 *
 * **The weld has to happen first, and it has to be told what to ignore.**
 * `IcosahedronGeometry` is non-indexed: a corner shared by five faces exists
 * five times over at identical coordinates. Displace those copies
 * independently and the solid comes apart into loose triangles. `mergeVertices`
 * fixes that, but only welds vertices matching in *every* attribute — and a
 * flat-shaded polyhedron gives each face's corners that face's own normal, and
 * the UV seam gives them different texture coordinates. Both must be deleted
 * or nothing welds at all and the weld silently does nothing.
 */
export function lumpySphere(
  rng: Rng,
  radius: number,
  detail: number,
  low: number,
  high: number,
): THREE.BufferGeometry {
  const raw = new THREE.IcosahedronGeometry(radius, detail);
  raw.deleteAttribute('normal');
  raw.deleteAttribute('uv');
  const geometry = mergeVertices(raw);
  raw.dispose();

  const position = geometry.getAttribute('position');
  const vertex = new THREE.Vector3();
  for (let i = 0; i < position.count; i++) {
    vertex.fromBufferAttribute(position, i);
    vertex.multiplyScalar(rng.range(low, high));
    position.setXYZ(i, vertex.x, vertex.y, vertex.z);
  }
  position.needsUpdate = true;
  geometry.computeVertexNormals();
  return geometry;
}
