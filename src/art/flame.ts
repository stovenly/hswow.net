import * as THREE from 'three';
import type { Part } from './assemble';
import type { Rng } from './random';
import type { BuildOptions } from './types';

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
 * What a flame-carrying prop takes beyond seed and scale.
 *
 * A point light's shadow is a cube — six depth passes of everything in range,
 * and a 4 x 2 atlas of them, 33 MB, that three never gives back once it has
 * allocated it — so this is off everywhere until a placer asks. Worth asking for in a small room that is meant
 * to be moody and nowhere else: a hall with six lanterns in it would pay thirty
 * six passes for shadows nobody is standing close enough to read.
 */
export interface FlameOptions extends BuildOptions {
  shadows?: boolean;
}

/**
 * Points a flame's own light at the room. `range` is the light's, so the depth
 * range matches what it actually reaches and the little bias it needs is little.
 */
export function castFlame(light: THREE.PointLight, range: number): void {
  light.castShadow = true;
  // Marks it for the global shadow switch, which has to be able to find it.
  light.userData.casts = true;
  // Per cube face, and a cube face is a right angle: 1024 is a fifth of a degree
  // a texel, or a centimetre across a small room.
  light.shadow.mapSize.set(1024, 1024);
  light.shadow.camera.near = 0.08;
  light.shadow.camera.far = range;
  light.shadow.bias = -0.002;
  // A flame sits centimetres from what it lights, where a flat bias either
  // leaks or detaches. Along the normal instead, which does neither.
  light.shadow.normalBias = 0.03;
  // Texels of spread on the point light's own 20-tap filter, which is the one
  // thing `PCFSoftShadowMap` does not reach — its wider kernel is for the
  // directional path, and a cube shadow takes the fixed one whatever the type.
  light.shadow.radius = 3;
}

/**
 * The profile of a flame, as (radius, height) in units of `size`: a rounded
 * foot swelling just above the wick and drawing up to a point. Turned on a lathe
 * to make the body.
 */
const FLAME_PROFILE: readonly [number, number][] = [
  [0, -0.2], [0.55, -0.05], [0.8, 0.35], [0.78, 0.8], [0.6, 1.35], [0.36, 1.95], [0.16, 2.5], [0, 2.9],
];

/**
 * Glow geometry for one flame: a bright teardrop inside a wide, faint halo. The
 * body is a lathe of `FLAME_PROFILE`, nearly white at the foot where a flame is
 * hottest and the flame's own colour up its length, thinning to a deeper tint
 * at the tip. The halo is a rounded shell four times the size at a fraction of
 * the brightness, ramped to black — and `GLOW_MATERIAL` is additive, so black
 * adds nothing and the falloff needs no alpha channel.
 */
export function flameGlow(
  glow: Part[],
  flame: Flame,
  x: number,
  y: number,
  z: number,
  size: number,
): void {
  const points = FLAME_PROFILE.map(([r, h]) => new THREE.Vector2(r * size, h * size));
  const body = new THREE.LatheGeometry(points, 10);
  body.translate(x, y, z);
  const top = 2.9 * size;
  glow.push({
    geometry: body,
    // Per face at its centroid. Height up the flame, 0 at the wick, 1 at the tip.
    color: (_fx, fy) => {
      const t = Math.max(0, Math.min(1, (fy - y + 0.2 * size) / (top + 0.2 * size)));
      if (t < 0.4) return blend(0xfff4dc, flame.color, t / 0.4);
      return fade(flame.color, 1 - 0.45 * ((t - 0.4) / 0.6));
    },
    sway: 0,
  });

  const halo = new THREE.IcosahedronGeometry(size * 4.2, 1);
  halo.scale(1, 1.5, 1);
  halo.translate(x, y + size * 0.9, z);
  const reach = size * 4.2 * 1.5;
  glow.push({
    geometry: halo,
    color: (fx, fy, fz) => {
      const d = Math.hypot(fx - x, fy - y - size * 0.9, fz - z) / reach;
      return fade(flame.color, Math.max(0, 0.3 * (1 - d) ** 1.5));
    },
    sway: 0,
  });
}

/**
 * What a flame does to the air: a few short-lived embers lifting off the tip,
 * and the heat over it bending what is behind. Made by whoever installed the
 * sink — the main thread's `dress.ts`, which is where the particle and heat
 * materials live; a worker has none and gets an empty group, which is right,
 * since a flame is never captured. One group, stood on the wick, for the
 * builder to place and scale with the rest.
 */
export interface FlameAirSink {
  (flame: Flame, size: number, seed: number): THREE.Group;
}

let airSink: FlameAirSink | null = null;

export function installFlameAir(installed: FlameAirSink): void {
  airSink = installed;
}

export function flameAir(flame: Flame, size: number, rng: Rng): THREE.Group {
  const seed = rng.int(1, 1_000_000);
  const air = airSink ? airSink(flame, size, seed) : new THREE.Group();
  air.name = 'flame:air';
  return air;
}

/** Mixes two packed hexes, 0 all the first, 1 all the second. */
function blend(a: number, b: number, t: number): number {
  const r = Math.round(((a >> 16) & 0xff) * (1 - t) + ((b >> 16) & 0xff) * t);
  const g = Math.round(((a >> 8) & 0xff) * (1 - t) + ((b >> 8) & 0xff) * t);
  const bl = Math.round((a & 0xff) * (1 - t) + (b & 0xff) * t);
  return (r << 16) | (g << 8) | bl;
}

/** Scales a packed hex toward black. Additive, so this is an amount of light. */
function fade(hex: number, factor: number): number {
  const r = Math.round(((hex >> 16) & 0xff) * factor);
  const g = Math.round(((hex >> 8) & 0xff) * factor);
  const b = Math.round((hex & 0xff) * factor);
  return (r << 16) | (g << 8) | b;
}
