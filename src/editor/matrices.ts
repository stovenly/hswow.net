import type * as THREE from 'three';

/**
 * Recomputes an object's matrix after the editor has moved it.
 *
 * A built zone has `matrixAutoUpdate` off on every object — `freezeMatrices` in
 * the zone manager — so setting `position` on its own changes nothing on
 * screen and the next bounds read gives the old place back. Nothing here turns
 * auto-update back on: the editor moved it, so the editor says so.
 */
export function moved(object: THREE.Object3D): void {
  object.updateMatrix();
  object.updateMatrixWorld(true);
}
