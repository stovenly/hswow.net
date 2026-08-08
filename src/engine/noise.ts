import * as THREE from 'three';
import { createRng } from '../art/random';

/**
 * Noise, shared between the sky and the fog volumes.
 *
 * Two things live here, and they are different answers to the same question.
 *
 * `NOISE_GLSL` is the sky's own fractal value noise, lifted out of `Sky.ts`
 * **verbatim** so that moving it changes nothing about the clouds. It is
 * hash-based and two-dimensional: five octaves of four hashes each, which is
 * twenty hashes per lookup. That is the right trade for a sky, where the
 * lookup happens once per pixel on the dome and nowhere else.
 *
 * `VOLUME_NOISE_GLSL` is the answer for a raymarch, where the lookup happens
 * eight times per volume per pixel and twenty hashes apiece would be the whole
 * cost of the effect. It reads a small tileable noise texture instead — one
 * hardware-filtered fetch where the hash version does four, and the filtering
 * is free.
 *
 * **The texture is built at boot from arithmetic, not shipped.** Ground rule 5
 * in SHADERS-AND-MATERIALS.md: no texture assets anywhere in this project. The wind field in
 * `art/sway.ts` is the precedent, and this is the same move at a different
 * size.
 */

/**
 * The sky's noise, unchanged.
 *
 * Kept as a string rather than left in `Sky.ts` because the fog volumes wanted
 * the same functions and a second copy is a second thing to keep in agreement.
 * Nothing in here is ours to improve — the cloud look is tuned against it.
 */
export const NOISE_GLSL = /* glsl */ `
  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float valueNoise(vec2 p) {
    vec2 cell = floor(p);
    vec2 f = fract(p);
    // Smoothstep on the interpolant: linear blending between cells leaves
    // visible creases along every cell boundary.
    vec2 blend = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(cell), hash(cell + vec2(1.0, 0.0)), blend.x),
      mix(hash(cell + vec2(0.0, 1.0)), hash(cell + vec2(1.0, 1.0)), blend.x),
      blend.y
    );
  }

  // Five octaves, each half the amplitude and twice the frequency. The big
  // ones are the cloud masses, the small ones are their ragged edges.
  float fbm(vec2 p) {
    float sum = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 5; i++) {
      sum += amplitude * valueNoise(p);
      p *= 2.0;
      amplitude *= 0.5;
    }
    return sum;
  }
`;

/** Side of the noise texture, in texels. Tileable, so a power of two. */
const NOISE_SIZE = 64;

let texture: THREE.DataTexture | null = null;

/**
 * The tileable noise texture, built once.
 *
 * White noise rather than pre-smoothed value noise, because the smoothing is
 * what the hardware's bilinear filter does for free on the way out — baking it
 * in as well would only blur the result twice and cost a lookup its detail.
 *
 * Seeded, like everything else that is generated in this project: an
 * unreproducible cloud bank is a cloud bank nobody can tune against a
 * screenshot.
 */
export function noiseTexture(): THREE.DataTexture {
  if (texture !== null) return texture;

  const rng = createRng(0x5f0c);
  const data = new Uint8Array(NOISE_SIZE * NOISE_SIZE);
  for (let i = 0; i < data.length; i++) data[i] = Math.floor(rng() * 256);

  texture = new THREE.DataTexture(
    data,
    NOISE_SIZE,
    NOISE_SIZE,
    THREE.RedFormat,
    THREE.UnsignedByteType,
  );
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  // Repeat on both axes, which is what makes the lookup tileable and therefore
  // what lets a volume of any size sample it without showing an edge.
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Three-dimensional fractal noise from a two-dimensional texture.
 *
 * **The trick is that a 3D lookup is two 2D lookups.** Quantize the third axis
 * into slices, offset the xz lookup by a per-slice amount that wraps the
 * texture into an unrelated part of itself, and interpolate between the two
 * neighbouring slices. Two fetches per octave, hardware-filtered within each
 * slice, and the vertical structure is real rather than a column of the same
 * value repeated up the height of the volume.
 *
 * The offsets are deliberately not round numbers. A slice offset that lands on
 * a texel boundary would make two slices correlate, and the result reads as
 * horizontal banding through the middle of a mist pool.
 *
 * **`p` is measured in billows, not in metres or in UV.** One unit of `p` is
 * one texel across and one slice up — so a caller dividing world position by a
 * size in metres gets features of exactly that size, and the horizontal and
 * vertical detail come out matched. Getting this wrong is not subtle and is
 * easy to do: feeding UV straight in makes the base octave a *texel* wide,
 * which for a five-metre feature size is eight centimetres of detail, and the
 * volume fills with hash instead of billowing.
 *
 * Requires `uNoise` to be in scope.
 */
export const VOLUME_NOISE_GLSL = /* glsl */ `
  uniform sampler2D uNoise;

  float noiseSlice(vec2 billows, float slice) {
    // Billows to UV: one texel per billow. The wrap is what decorrelates one
    // slice from the next — the texture repeats, so an irrational-looking
    // offset lands somewhere unrelated in it.
    vec2 uv = billows / ${NOISE_SIZE.toFixed(1)};
    vec2 offset = vec2(slice * 0.1371, slice * 0.3793);
    return texture2D(uNoise, uv + offset).r;
  }

  float volumeNoise(vec3 p) {
    float slice = floor(p.y);
    // Smoothstep between slices for the same reason the sky's value noise
    // smoothsteps between cells: linear blending creases at every boundary,
    // and here the creases would be level horizontal planes, which is the one
    // artifact a mist pool cannot get away with.
    float blend = fract(p.y);
    blend = blend * blend * (3.0 - 2.0 * blend);
    return mix(noiseSlice(p.xz, slice), noiseSlice(p.xz, slice + 1.0), blend);
  }

  // Three octaves rather than the sky's five. This is sampled eight times per
  // volume per pixel instead of once, and at chunky resolution under a
  // halftone the fourth octave is not visible enough to pay for.
  float volumeFbm(vec3 p) {
    float sum = 0.0;
    float amplitude = 0.5;
    float total = 0.0;
    for (int i = 0; i < 3; i++) {
      sum += amplitude * volumeNoise(p);
      total += amplitude;
      p *= 2.0;
      amplitude *= 0.5;
    }
    // Normalised to 0..1. The sky's fbm does not bother, because its output
    // feeds a threshold that was tuned against whatever range it happened to
    // produce; density here is authored in real units and has to mean the
    // same thing whatever the octave count is.
    return sum / total;
  }
`;
