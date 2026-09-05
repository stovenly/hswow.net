import * as THREE from 'three';
import type { Part } from './assemble';
import type { Rng } from './random';
import type { Fields } from './schema';
import { PALETTE, shade } from './palette';
import { landWash, vistaMass, VISTA_MATERIALS } from './vista';

// Small pieces the vista roster shares: variants, the built vocabulary of boxes,
// gables and caps, a far tree, a water glint, and their palettes.

/** The form field a variant builder declares. */
export function variantField(variants: readonly string[]): Fields {
  return { variant: { type: 'choice', options: variants } };
}

/** The named variant, or one rolled from the seed. The roll is always drawn, so naming one shifts nothing after it. */
export function pickVariant<V extends string>(rng: Rng, variants: readonly V[], named?: string): V {
  const rolled = rng.pick(variants);
  return named && (variants as readonly string[]).includes(named) ? (named as V) : rolled;
}

export const WALLS = [PALETTE.STONE_PALE, PALETTE.STONE, PALETTE.TIMBER_PALE] as const;
export const ROOFS = [shade(PALETTE.BARK, 0.9), PALETTE.TIMBER_DARK, shade(PALETTE.STONE_DARK, 0.8)] as const;
export const STONE = [PALETTE.STONE_DARK, PALETTE.STONE] as const;
/** Sun on still water, seen from a long way off. */
export const GLINT = shade(PALETTE.STONE_PALE, 1.12);
/** A dark cap over pale walls is what says roof through fog. */
export function roofShade(rng: Rng): number {
  return shade(PALETTE.STONE_DARK, rng.range(0.55, 0.72));
}

/** A box standing on `y`, centred on `x, z`. */
export function block(width: number, height: number, depth: number, x = 0, y = 0, z = 0): THREE.BufferGeometry {
  const box = new THREE.BoxGeometry(width, height, depth);
  box.translate(x, y + height / 2, z);
  return box;
}

/** A gable roof along X: two slopes and two gables, open underneath, eaves at `eave`. */
export function gable(length: number, width: number, eave: number, rise: number, x = 0, z = 0): THREE.BufferGeometry {
  const l = length / 2;
  const w = width / 2;
  const position: number[] = [];
  const tri = (...v: number[][]): void => {
    for (const p of v) position.push(p[0] + x, p[1], p[2] + z);
  };
  const ridgeA = [-l, eave + rise, 0];
  const ridgeB = [l, eave + rise, 0];
  tri([-l, eave, w], [l, eave, w], ridgeB);
  tri([-l, eave, w], ridgeB, ridgeA);
  tri([l, eave, -w], [-l, eave, -w], ridgeA);
  tri([l, eave, -w], ridgeA, ridgeB);
  tri([-l, eave, -w], [-l, eave, w], ridgeA);
  tri([l, eave, w], [l, eave, -w], ridgeB);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(position, 3));
  geometry.computeVertexNormals();
  return geometry;
}

/** A pyramid or cone cap sitting on `y`. Four sides turned to square with X. */
export function cap(radius: number, height: number, sides: number, x = 0, y = 0, z = 0): THREE.BufferGeometry {
  const cone = new THREE.ConeGeometry(radius, height, sides);
  if (sides === 4) cone.rotateY(Math.PI / 4);
  cone.translate(x, y + height / 2, z);
  return cone;
}

/** A flat quad lying on `y`, facing up. */
export function glint(width: number, depth: number, x = 0, y = 0, z = 0): THREE.BufferGeometry {
  const plane = new THREE.PlaneGeometry(width, depth);
  plane.rotateX(-Math.PI / 2);
  plane.translate(x, y, z);
  return plane;
}

/** A far tree: a three-sided trunk and one or two crown masses, `height` metres tall. */
export function treeParts(rng: Rng, height: number, x: number, z: number, palette = VISTA_MATERIALS.pasture): Part[] {
  const trunkTop = height * rng.range(0.32, 0.42);
  const trunk = new THREE.CylinderGeometry(0.3, 0.6, trunkTop + 0.5, 3, 1, true);
  trunk.deleteAttribute('uv');
  trunk.translate(x, trunkTop / 2, z);
  const parts: Part[] = [{ geometry: trunk, color: shade(PALETTE.BARK, 0.9), sway: 0 }];
  const count = rng.int(1, 2);
  const wash = landWash(rng.int(1, 0x7fffffff), palette, { scale: rng.range(8, 14), crown: height });
  let y = trunkTop;
  for (let i = 0; i < count; i++) {
    const radius = (height - trunkTop) * rng.range(0.28, 0.36) * (1 - i * 0.3);
    const crown = vistaMass(rng, {
      radius,
      detail: 0,
      rough: rng.range(0.16, 0.28),
      squash: rng.range(0.75, 0.95),
      stretch: rng.range(0.85, 1.2),
      bury: 0.1,
    });
    crown.rotateY(rng.range(0, Math.PI * 2));
    crown.translate(x + rng.around(0, radius * 0.2), y, z + rng.around(0, radius * 0.2));
    y += radius * rng.range(0.9, 1.1);
    parts.push({ geometry: crown, color: wash, sway: 0 });
  }
  return parts;
}

/** A conifer: a trunk and a stack of cones. */
export function pineParts(rng: Rng, height: number, x: number, z: number): Part[] {
  const trunkTop = height * 0.25;
  const trunk = new THREE.CylinderGeometry(0.25, 0.5, trunkTop + 0.5, 3, 1, true);
  trunk.deleteAttribute('uv');
  trunk.translate(x, trunkTop / 2, z);
  const parts: Part[] = [{ geometry: trunk, color: shade(PALETTE.BARK, 0.85), sway: 0 }];
  const tiers = 3;
  const colour = shade(PALETTE.LEAF_DARK, rng.range(0.7, 0.85));
  for (let i = 0; i < tiers; i++) {
    const t = i / tiers;
    const radius = height * 0.22 * (1 - t * 0.6);
    const tall = (height - trunkTop) * 0.5;
    const cone = new THREE.ConeGeometry(radius, tall, 5);
    cone.rotateY(rng.range(0, Math.PI * 2));
    cone.translate(x, trunkTop + t * (height - trunkTop) * 0.55 + tall / 2, z);
    parts.push({ geometry: cone, color: colour, sway: 0 });
  }
  return parts;
}

/** A stone cairn: a stubby cone. */
export function cairn(rng: Rng, height: number, x = 0, y = 0, z = 0): Part {
  const cone = new THREE.ConeGeometry(height * 0.7, height, 5);
  cone.rotateY(rng.range(0, Math.PI * 2));
  cone.translate(x, y + height / 2, z);
  return { geometry: cone, color: shade(PALETTE.STONE_DARK, 0.95), sway: 0 };
}

/** Moves every part of a piece, for composing pieces into one thing. */
export function shift(parts: Part[], x: number, y: number, z: number, yaw = 0): Part[] {
  for (const part of parts) {
    if (yaw !== 0) part.geometry.rotateY(yaw);
    part.geometry.translate(x, y, z);
  }
  return parts;
}

/**
 * A crest laid along +X: `points` stations over `length` metres rising to
 * `height` at `peak` (0..1 along it) and falling to a fifth of it at the ends,
 * with a little wander in plan and no two stations alike.
 */
export function crestAlong(
  rng: Rng,
  length: number,
  height: number,
  points: number,
  peak?: number,
): [number, number, number][] {
  const top = peak ?? rng.range(0.35, 0.65);
  const crest: [number, number, number][] = [];
  for (let i = 0; i < points; i++) {
    const t = i / (points - 1);
    const end = i === 0 || i === points - 1;
    const x = -length / 2 + t * length + (end ? 0 : rng.range(-length * 0.03, length * 0.03));
    const z = rng.range(-height * 0.25, height * 0.25);
    const rise = t < top ? t / top : (1 - t) / (1 - top);
    const h = end ? height * 0.2 : height * (0.2 + 0.8 * Math.sin((rise * Math.PI) / 2)) * rng.range(0.85, 1.12);
    crest.push([x, z, h]);
  }
  return crest;
}
