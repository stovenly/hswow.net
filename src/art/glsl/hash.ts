/**
 * Hash primitives.
 *
 * Four systems each carried their own copy of the same one or two hashes, and
 * glitch and horror carried theirs twice over — once for the vertex
 * declarations and once for the fragment ones, kept in step by hand. The
 * *shape* is what repeated. The constants never did and must not: a hash's
 * constants are a look, so reseeding one moves every speck it scatters and
 * every slot roll it decides. The shapes live here; the constants stay written
 * down at the call sites. MATERIAL-SYSTEM.md R4.
 */

/** The multiplier every sin hash here fracts. Shared because it is arbitrary. */
const SCALE = '43758.5453';

/** A GLSL float literal — a bare integer would be an int in a constructor. */
function f(v: number): string {
  return Number.isInteger(v) ? v.toFixed(1) : String(v);
}

/** vec2 in, one float out. The workhorse: a slot roll, a per-face draw. */
export function sinHash2(name: string, k: readonly [number, number]): string {
  return `float ${name}(vec2 p) {
  return fract(sin(dot(p, vec2(${f(k[0])}, ${f(k[1])}))) * ${SCALE});
}`;
}

/** vec3 in, one float out. */
export function sinHash31(name: string, k: readonly [number, number, number]): string {
  return `float ${name}(vec3 p) {
  return fract(sin(dot(p, vec3(${f(k[0])}, ${f(k[1])}, ${f(k[2])}))) * ${SCALE});
}`;
}

/**
 * Three draws from a vec2 hash at fixed offsets — a direction or a colour
 * where the scalar form gives a weight.
 */
export function sinHash2x3(
  name: string,
  from: string,
  offsets: readonly [number, number],
): string {
  return `vec3 ${name}(vec2 p) {
  return vec3(${from}(p), ${from}(p + ${f(offsets[0])}), ${from}(p + ${f(offsets[1])}));
}`;
}

/** vec3 in, vec3 out, by three independent dots. */
export function sinHash3(
  name: string,
  rows: readonly [
    readonly [number, number, number],
    readonly [number, number, number],
    readonly [number, number, number],
  ],
): string {
  const row = (r: readonly [number, number, number]): string =>
    `dot(p, vec3(${f(r[0])}, ${f(r[1])}, ${f(r[2])}))`;
  return `vec3 ${name}(vec3 p) {
  p = vec3(${row(rows[0])},
           ${row(rows[1])},
           ${row(rows[2])});
  return fract(sin(p) * ${SCALE});
}`;
}

/**
 * A real integer hash (pcg3d). The sin hashes above are periodic along lattice
 * rows, so neighbouring cells draw correlated values and whole rows of features
 * align and light together — which is exactly a stripe. This one has no
 * correlation to band, and is what anything laid on a lattice wants.
 */
export function pcgHash3(name: string): string {
  return `vec3 ${name}(vec3 p) {
  uvec3 v = uvec3(ivec3(floor(p))) * uvec3(1664525u, 1013904223u, 2246822519u);
  v.x += v.y * v.z;
  v.y += v.z * v.x;
  v.z += v.x * v.y;
  v ^= v >> 16u;
  v.x += v.y * v.z;
  v.y += v.z * v.x;
  v.z += v.x * v.y;
  return vec3(v) * (1.0 / 4294967295.0);
}`;
}
