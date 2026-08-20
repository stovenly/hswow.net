import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import type { Rng } from './random';

/**
 * A sphere with its vertices shoved about — the kit's workhorse organic shape,
 * used for rocks, for the stones in a cairn, and for a sheep's fleece.
 *
 * The weld has to happen first, and it has to be told what to ignore.
 * `IcosahedronGeometry` is non-indexed, so a corner shared by five faces exists
 * five times over at identical coordinates, and displacing those copies
 * independently pulls the solid apart. `mergeVertices` only welds vertices
 * matching in every attribute, and a flat-shaded polyhedron gives each face's
 * corners that face's own normal — so the normals and the UVs must be deleted or
 * nothing welds at all.
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
