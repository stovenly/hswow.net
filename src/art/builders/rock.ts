import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE } from '../palette';

/**
 * A rock: one icosahedron with its vertices shoved about.
 *
 * Displacing the vertices of a regular solid is the whole trick. An
 * undisplaced icosahedron is unmistakably a die; the same shape with each
 * vertex pushed a random distance along its own normal is unmistakably a rock,
 * and it costs one loop.
 *
 * Sunk slightly below the origin so it sits *in* the ground rather than on it.
 * Rocks resting exactly on a plane look like they were dropped there, which
 * they were.
 */
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

    // **Welded before displacement, and this is the whole builder.**
    //
    // `IcosahedronGeometry` is non-indexed: every triangle carries its own
    // three vertices, so a corner shared by five faces exists five times over
    // at identical coordinates. Displacing those copies independently pulls
    // them apart and the solid comes to pieces — a cloud of loose triangles.
    //
    // `mergeVertices` welds them, but only if they match in *every* attribute,
    // and a flat-shaded polyhedron is built so that they never do: each face
    // gives its corners that face's own normal, and the UV seam gives them
    // different texture coordinates too. Both have to go before the weld will
    // take. Neither is a loss — normals are recomputed below, and there is not
    // a texture anywhere in this project.
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
