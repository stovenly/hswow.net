import * as THREE from 'three';

/** One material for the entire art kit. `sway.ts` patches this and nothing else. */
export const ART_MATERIAL = new THREE.MeshLambertMaterial({
  vertexColors: true,
  flatShading: true,
});
