import * as THREE from 'three';

/**
 * A tapered rod running from one point to another, and touching both.
 *
 * **This exists because hand-placed joins kept missing.** The pattern that
 * caused it is always the same: build a cylinder about the origin, rotate it by
 * an angle, then translate it to where the far end is *believed* to be — and
 * the belief is a line of trigonometry written separately from the rotation it
 * is meant to describe. Get a sign wrong and the part floats; get the length
 * wrong and it stops short. Both happened, repeatedly, and neither is visible
 * in the code.
 *
 * Given two points there is nothing left to get wrong. The length is the
 * distance between them and the orientation is whatever quaternion takes +Y to
 * the direction — asked for rather than derived, so it cannot disagree with
 * itself.
 *
 * Use it for anything that connects: a flower stalk to its bell, an umbel ray
 * to its head, a brace to a frame. If two things are supposed to touch, this is
 * how they touch.
 */
export function rod(
  from: THREE.Vector3,
  to: THREE.Vector3,
  radiusFrom: number,
  radiusTo = radiusFrom,
  sides = 4,
): THREE.BufferGeometry {
  _dir.copy(to).sub(from);
  const length = _dir.length();
  // Degenerate input would give a NaN quaternion and put the whole mesh in the
  // bin, so it returns something harmless and visible-sized instead.
  if (length < 1e-6) return new THREE.CylinderGeometry(radiusFrom, radiusFrom, 1e-4, sides);

  // `CylinderGeometry` takes the +Y radius first, so `radiusTo` is the end at
  // `to` and `radiusFrom` the end at `from`.
  const geometry = new THREE.CylinderGeometry(radiusTo, radiusFrom, length, sides);
  geometry.translate(0, length / 2, 0);
  geometry.applyQuaternion(_turn.setFromUnitVectors(UP, _dir.divideScalar(length)));
  geometry.translate(from.x, from.y, from.z);
  return geometry;
}

const UP = new THREE.Vector3(0, 1, 0);
const _dir = new THREE.Vector3();
const _turn = new THREE.Quaternion();
