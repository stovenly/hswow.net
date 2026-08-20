import * as THREE from 'three';
import { EFFECT_MASK_LAYER } from '../layers';

/**
 * Object identity for the effect systems. An attached glitch or horror volume
 * belongs to a thing, not to a place, and a spatial test cannot tell the thing
 * from the floor it stands on: the two are a centimetre apart, and the screen
 * passes reconstruct position from a depth buffer whose error at grazing range is
 * several times that. So membership for attached volumes is by identity — every
 * marked object gets an id, baked into its geometry as a vertex attribute and
 * drawn into a chunky screen mask, and its volume carries the same id.
 * Free-standing volumes keep the spatial test: corrupting the floor is their
 * point.
 *
 * A leaf module, because both art patches and both engine activities need it.
 */

/**
 * Per-vertex owner id, zero on everything unmarked. Zero is load-bearing: the
 * patched materials default the attribute to 0 (`defaultAttributeValues`,
 * sway's mechanism), so the floor, the terrain and every unmarked prop can
 * never match an owned volume.
 */
export const EFFECT_ATTRIBUTE = 'aEffect';

/**
 * The mask the screen passes read: owner id per chunky pixel, 0 elsewhere.
 * Written by the effect-mask pass each frame it is enabled; the placeholder
 * black pixel keeps the samplers defined on frames it is not.
 */
const EMPTY_MASK = new THREE.DataTexture(new Float32Array([0]), 1, 1, THREE.RedFormat, THREE.FloatType);
EMPTY_MASK.needsUpdate = true;

export const maskUniforms = {
  tEffectMask: { value: EMPTY_MASK as THREE.Texture },
};

/**
 * How many owned volumes each activity packed this frame. The mask pass runs
 * only when the sum is non-zero, so a zone with no attached effects pays
 * nothing — the fog volumes' rule.
 */
export const maskState = { glitch: 0, horror: 0 };

let nextOwner = 1;

/**
 * The owner id of a marked object, assigned on first ask and stable after.
 *
 * Assigning it writes the id into every descendant mesh's geometry as
 * `EFFECT_ATTRIBUTE` and puts the meshes on the mask layer. Ids are shared
 * across the two effect systems — an object both haunted and glitched is one
 * object — and never reused, which single-precision floats carry exactly to
 * numbers no play session will reach.
 */
export function ownerIdFor(object: THREE.Object3D): number {
  const existing = object.userData.effectOwner as number | undefined;
  if (existing) return existing;

  const id = nextOwner++;
  object.userData.effectOwner = id;
  object.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (!mesh.isMesh || !mesh.geometry) return;
    const position = mesh.geometry.getAttribute('position');
    if (!position) return;
    mesh.geometry.setAttribute(
      EFFECT_ATTRIBUTE,
      new THREE.BufferAttribute(new Float32Array(position.count).fill(id), 1),
    );
    mesh.layers.enable(EFFECT_MASK_LAYER);
  });
  return id;
}
