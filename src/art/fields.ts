import type * as THREE from 'three';

/**
 * The per-vertex fields — sway weight, wear, detail size, branch — packed as
 * one `vec4` attribute: `.x` sway, `.y` wear, `.z` detail, `.w` branch. One
 * attribute rather than four because vertex attributes are the scarce
 * resource: the kit sits at fourteen against a common limit of sixteen.
 *
 * A leaf module, so the stages and `assemble` can all import it without a cycle.
 */
export const FIELD_ATTRIBUTE = 'aField';
export const FIELD_LANES = 4;
/** Which lane of `FIELD_ATTRIBUTE` each field lives in. */
export const FIELD_SWAY = 0;
export const FIELD_WEAR = 1;
export const FIELD_DETAIL = 2;
export const FIELD_BRANCH = 3;

/**
 * A limb the wind swings as one lever about its own base. Every vertex on it
 * and on everything grown from it swings by its distance from the pivot.
 * `swing` is metres of tip travel per metre from the pivot at full gust.
 */
export interface Family {
  pivot: THREE.Vector3;
  /** 0..1, never shared with a sibling. */
  phase: number;
  swing: number;
}

/** Tip travel at the top code of each branch lane, metres. Both shaders divide by these. */
export const BRANCH_REACH = 1.0;
export const SUB_REACH = 0.5;

/**
 * The branch lane: a limb's travel and phase, and its sub-limb's, in one float
 * the shader unpacks exactly. Bits, high to low: travel 7, phase 5, sub travel
 * 7, sub phase 5 — 24 in all, the mantissa of a float. A phase code is never
 * zero, so a vertex on any family packs above zero and a zero lane means no
 * family at all.
 */
export function packBranch(x: number, y: number, z: number, family: Family | null | undefined, sub?: Family | null): number {
  if (!family) return 0;
  const code = (p: THREE.Vector3, f: Family, reach: number): [number, number] => {
    const dx = x - p.x;
    const dy = y - p.y;
    const dz = z - p.z;
    const travel = Math.sqrt(dx * dx + dy * dy + dz * dz) * f.swing;
    return [Math.round(Math.min(1, travel / reach) * 127), 1 + Math.round(Math.min(1, Math.max(0, f.phase)) * 30)];
  };
  const [a1, p1] = code(family.pivot, family, BRANCH_REACH);
  const [a2, p2] = sub ? code(sub.pivot, sub, SUB_REACH) : [0, 1];
  return a1 * 131072 + p1 * 4096 + a2 * 32 + p2;
}
