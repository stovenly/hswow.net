import * as THREE from 'three';
import type { Part } from './assemble';
import type { Rng } from './random';

/**
 * What a small flame looks like, and how bright it is. Shared by everything that
 * burns at hand scale. Kept out of `palette.ts` because these are not surface
 * colours: a flame tint is used three ways at once — the glow geometry, the point
 * light, and the wax or glass immediately around it — and the grouping is the
 * useful thing rather than the individual hex.
 */

/**
 * Flame tints, and how often each turns up. Weighted, not uniform: two of the
 * three are what tallow and beeswax actually do, and the third is not — a light
 * that is the wrong colour for what it is burning, rare enough to read as
 * something rather than as a palette.
 */
export interface Flame {
  /** The glow geometry and the surfaces it lights. */
  color: number;
  /** The point light. Slightly deeper — see `rollFlame`. */
  light: number;
  weight: number;
}

export const FLAMES: readonly Flame[] = [
  // Ordinary tallow. Orange, and the commonest thing in any room.
  { color: 0xffc074, light: 0xffb765, weight: 0.5 },
  // Guttering, or burning something with more iron in it than it should have.
  { color: 0xff8a5c, light: 0xff7a48, weight: 0.32 },
  // And the one that is not chemistry.
  { color: 0x9fd8ff, light: 0x8fc8ff, weight: 0.18 },
];

/**
 * Rolls a tint. The light colour is a touch deeper than the glow colour on each
 * entry, deliberately: the glow is drawn additively and is already at its own
 * brightness, but the point light is multiplied into surface albedo, and a
 * near-white light washes the colour out of everything it touches.
 */
export function rollFlame(rng: Rng): Flame {
  const roll = rng.range(0, 1);
  let seen = 0;
  for (const flame of FLAMES) {
    seen += flame.weight;
    if (roll <= seen) return flame;
  }
  return FLAMES[0];
}

/**
 * How fast a small light falls off with distance. Not 2, which is what physics
 * says: three has been physically based since r155, so `decay: 2` at the five
 * centimetres you can get your eye to a candle is several hundred times the value
 * at arm's length — and the pipeline quantizes the whole near field onto the top
 * level, a flat white blob with a hard edge. A gentler exponent buys a light that
 * has somewhere to go between next to it and not next to it.
 */
export const FLAME_DECAY = 1.25;

/**
 * Glow geometry for one flame: a bright core inside a wide, faint halo. The core
 * alone is a hard-edged shape, and a hard-edged shape is what makes a synthetic
 * flame look like a piece of geometry that happens to be orange. The halo is four
 * times the size at a fraction of the brightness, ramped to black — and
 * `GLOW_MATERIAL` is additive, so black adds nothing and the falloff needs no
 * alpha channel. Two octahedra, sixteen triangles between them.
 */
export function flameGlow(
  glow: Part[],
  flame: Flame,
  x: number,
  y: number,
  z: number,
  size: number,
): void {
  const core = new THREE.OctahedronGeometry(size, 0);
  core.scale(1, 2.4, 1);
  core.translate(x, y, z);
  glow.push({ geometry: core, color: flame.color, sway: 0 });

  const halo = new THREE.OctahedronGeometry(size * 4.2, 0);
  halo.scale(1, 1.5, 1);
  halo.translate(x, y, z);
  const reach = size * 4.2 * 1.5;
  glow.push({
    geometry: halo,
    // Faded by distance from the wick, so the outer points of the octahedron
    // are black and contribute nothing. Evaluated per face at its centroid,
    // which suits a faceted shape — the ramp lands on facet boundaries.
    color: (fx, fy, fz) => {
      const d = Math.hypot(fx - x, fy - y, fz - z) / reach;
      return fade(flame.color, Math.max(0, 0.34 * (1 - d)));
    },
    sway: 0,
  });
}

/** Scales a packed hex toward black. Additive, so this is an amount of light. */
function fade(hex: number, factor: number): number {
  const r = Math.round(((hex >> 16) & 0xff) * factor);
  const g = Math.round(((hex >> 8) & 0xff) * factor);
  const b = Math.round((hex & 0xff) * factor);
  return (r << 16) | (g << 8) | b;
}
