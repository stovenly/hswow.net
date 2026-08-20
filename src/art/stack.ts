import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import type { MeshBuilder, BuilderWith, BuildOptions } from './types';
import type { Rng } from './random';

/**
 * Piling props on top of each other. `crate-stack` and `barrel-stack` are not new
 * objects: they call the real builder and merge what comes back, rather than
 * rebuilding a crate inside a second builder and having two definitions drift
 * apart. That is only possible because everything the kit makes shares one
 * attribute set, so merged geometry can be merged again.
 *
 * Measure, do not assume. A crate rolls its own size class and a barrel sometimes
 * lands on its side, so a stack is laid by stacking — put a piece down, ask how
 * tall it is, put the next one on top — rather than by guessing a pitch.
 */

/** A built piece, waiting to be placed. */
export interface Piece {
  readonly mesh: THREE.Mesh;
  readonly box: THREE.Box3;
}

/**
 * Builds one piece and measures it. Generic over the builder's own options, so a
 * caller that needs to say something — `barrel-stack` has to ask for an upright
 * cask, because a cask on its side cannot be stacked on — passes it through with
 * the builder's own type checking it.
 */
export function piece<Options extends BuildOptions>(
  builder: BuilderWith<Options> | MeshBuilder,
  options: Options,
): Piece {
  const mesh = (builder as BuilderWith<Options>).build(options);
  mesh.geometry.computeBoundingBox();
  return { mesh, box: mesh.geometry.boundingBox ?? new THREE.Box3() };
}

/** How much room a piece takes: width across X and Z, and height. */
export function sizeOf(item: Piece): { width: number; depth: number; height: number } {
  const size = new THREE.Vector3();
  item.box.getSize(size);
  return { width: size.x, depth: size.z, height: size.y };
}

/**
 * Merges placed pieces into one geometry.
 *
 * Each piece's own transform is baked in, so a caller positions and turns the
 * meshes as if they were being added to a scene and then hands them over. The
 * source geometries are disposed: they exist only to be copied out of.
 */
export function pileUp(pieces: readonly Piece[]): THREE.BufferGeometry {
  const parts = pieces.map(({ mesh }) => {
    mesh.updateMatrix();
    const geometry = mesh.geometry;
    geometry.applyMatrix4(mesh.matrix);
    return geometry;
  });
  const merged = mergeGeometries(parts, false);
  for (const geometry of parts) geometry.dispose();
  if (!merged) throw new Error('pileUp: geometries did not share an attribute set');
  return merged;
}

/**
 * Sets a piece down at a spot, turned and tipped a little.
 *
 * `lean` is small on purpose. Things stacked by hand are never square, and they
 * are never far off it either — a crate at fifteen degrees is not a stacked
 * crate, it is a crate somebody dropped.
 */
export function settle(
  item: Piece,
  rng: Rng,
  x: number,
  y: number,
  z: number,
  lean = 0.05,
): Piece {
  item.mesh.position.set(x, y, z);
  item.mesh.rotation.set(rng.around(0, lean), rng.range(0, Math.PI * 2), rng.around(0, lean), 'YXZ');
  return item;
}
