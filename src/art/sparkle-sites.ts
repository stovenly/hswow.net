import * as THREE from 'three';
import { GLINT_ATTRIBUTE } from './finishes';
import { FIELD_SPAN, RECIPE_ATTRIBUTE } from './recipes/types';

/** Sites per square metre of star-carrying surface. */
const SITE_DENSITY = 50;
/** Floats per site: position, normal, colour, clock seed, bright seed, star,
 * sprite (0 the four-armed star, 1 the thin sliver). */
export const STRIDE = 13;

/**
 * Scatters sites over a merged geometry's star-carrying triangles, area
 * weighted, reading the same baked lane the shader does — so a gilt band on a
 * stone prop seeds the band and nothing else. Deterministic per geometry;
 * stored on `userData` for the zone build to collect.
 */
export function collectSparkleSites(geometry: THREE.BufferGeometry): void {
  const glint = geometry.getAttribute(GLINT_ATTRIBUTE);
  if (!glint) return;
  const lanes = glint.array as Uint8Array;
  let starred = false;
  for (let i = 1; i < lanes.length; i += 2) {
    if (lanes[i] > 0) {
      starred = true;
      break;
    }
  }
  if (!starred) return;

  const position = geometry.getAttribute('position');
  const colour = geometry.getAttribute('color');
  const recipe = geometry.getAttribute(RECIPE_ATTRIBUTE);
  const recipeLanes = recipe ? (recipe.array as Uint8Array) : null;
  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  const c = new THREE.Vector3();
  const ab = new THREE.Vector3();
  const ac = new THREE.Vector3();
  const n = new THREE.Vector3();
  const sites: number[] = [];

  for (let i = 0; i < position.count; i += 3) {
    const star = lanes[i * 2 + 1] / 255;
    if (star <= 0) continue;
    // Any nacreous look, not one of them: the sliver sprite belongs to the
    // field, and all four of its variants are the same shell under the light.
    const byte = recipeLanes ? recipeLanes[i] : 0;
    const nacre = FIELD_SPAN.nacreous;
    const sprite = byte >= nacre.lo && byte <= nacre.hi ? 1 : 0;
    a.fromBufferAttribute(position, i);
    b.fromBufferAttribute(position, i + 1);
    c.fromBufferAttribute(position, i + 2);
    ab.subVectors(b, a);
    ac.subVectors(c, a);
    n.crossVectors(ab, ac);
    const twice = n.length();
    if (twice <= 0) continue;
    n.divideScalar(twice);

    // xorshift over the triangle index, so a rebuilt prop seeds the same spots.
    let h = (Math.imul(i / 3 + 1, 2654435761) ^ 0x9e3779b9) >>> 0;
    const roll = (): number => {
      h ^= h << 13;
      h ^= h >>> 17;
      h ^= h << 5;
      h >>>= 0;
      return h / 4294967296;
    };

    const expected = (twice / 2) * SITE_DENSITY;
    let count = Math.floor(expected);
    if (roll() < expected - count) count += 1;
    for (let s = 0; s < count; s++) {
      let u = roll();
      let v = roll();
      if (u + v > 1) {
        u = 1 - u;
        v = 1 - v;
      }
      sites.push(
        a.x + ab.x * u + ac.x * v,
        a.y + ab.y * u + ac.y * v,
        a.z + ab.z * u + ac.z * v,
        n.x,
        n.y,
        n.z,
        colour.getX(i),
        colour.getY(i),
        colour.getZ(i),
        roll(),
        roll(),
        star,
        sprite,
      );
    }
  }
  if (sites.length) geometry.userData.sparkleSites = new Float32Array(sites);
}
