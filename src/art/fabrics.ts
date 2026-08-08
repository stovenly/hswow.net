/**
 * What each cloth is made of — the `FLEX` of cloth.
 *
 * One table, for `FLEX`'s reason: the judgement is comparative. Whether
 * sailcloth is stiffer than wool is only answerable with the whole list in
 * front of you. Builders name a fabric; nothing tunes raw solver numbers at
 * the call site. See CLOTH.md §3.
 *
 * A leaf module with no imports, beside `flex.ts`.
 */

export interface Fabric {
  /** Areal mass, relative. Heavy cloth swings slow, settles fast, barely answers light air. */
  weight: number;
  /** Bend-constraint strength, 0..1 — the fold scale. Canvas holds big slow curves. */
  stiffness: number;
  /** Wind force per area per relative speed — how much of the wind it actually catches. */
  drag: number;
  /** Velocity retention per substep: crisp snap against underwater slosh. */
  damping: number;
  /** Metres. Both the drawn skin offset and the collision margin. */
  thickness: number;
}

/**
 * The two archetypes the table is tuned around; everything later interpolates.
 * A name that is not here is a build-time error in `ClothSim`, never a default.
 */
export const FABRICS: Record<string, Fabric> = {
  // Heavy and stiff. A canvas banner in a gust leans and bellies as one
  // surface and takes seconds to settle. Stiffness well short of 1: past
  // ~0.5 the bend constraints read as a rigid plate rather than stiff cloth —
  // a plate balanced on a bar rolls off, where canvas drapes and stays.
  canvas: { weight: 1, stiffness: 0.45, drag: 0.7, damping: 0.99, thickness: 0.012 },
  // Light and floppy. Ripples at fine scale, streams in wind; a passing
  // draught visibly disturbs it. Thinness is sold by weight and motion —
  // the kit's one material has no alpha.
  sheer: { weight: 0.22, stiffness: 0.06, drag: 1.5, damping: 0.965, thickness: 0.004 },
};
