import { PALETTE } from '../art/palette';
import type { SurfaceName } from '../audio/models/footsteps';

/**
 * Ground cover: what the floor of the world is made of, patch by patch.
 *
 * Terrain shape and terrain *surface* are separate problems. Landforms decide
 * where the hills are; this decides that the track between them is trodden
 * earth, that the yard is cobbled, and that the strip behind the barn is crop.
 * Without it a heightfield is one colour of green with objects standing on it,
 * and no amount of clutter fixes that — clutter sits *on* the ground, it does
 * not make the ground itself mean anything.
 *
 * **A material is a colour and a sound.** That pairing is the whole point. A
 * cobbled path you can see but that still sounds like grass underfoot is worse
 * than no path at all, because the mismatch is exactly the sort of thing a
 * player notices without being able to say why. One table, both facts, so they
 * cannot drift apart.
 *
 * Patches are placed shapes, like landforms are, and for the same reason: this
 * is authored ground, and a list of paths and yards is something a person can
 * read, move and argue with.
 */

export interface GroundMaterial {
  color: number;
  /**
   * How much face-to-face brightness varies, 0..1.
   *
   * Cobble and gravel want a lot — they are made of separate pieces and the
   * variation is what reads as pieces. Turf wants little. A material with none
   * looks like painted concrete however good its colour is.
   */
  variation: number;
  /** Which footstep model plays when standing on it. */
  step: SurfaceName;
}

export const GROUND = {
  /** Ordinary grass. The default everywhere nothing else is painted. */
  turf: { color: PALETTE.GRASS, variation: 0.1, step: 'grass' },
  /** Long, dry, unmown. Verges and neglected corners. */
  meadow: { color: PALETTE.GRASS_DRY, variation: 0.13, step: 'grass' },
  /** Bare earth: a track people have walked flat. */
  dirt: { color: PALETTE.EARTH, variation: 0.09, step: 'earth' },
  /** Loose stone. A made road rather than a worn one. */
  gravel: { color: 0x6e6656, variation: 0.16, step: 'gravel' },
  /** Set stone. A yard, a market floor, the ground inside a gate. */
  cobble: { color: PALETTE.STONE, variation: 0.19, step: 'stone' },
  /** Big flat slabs. Formal, and quieter than cobble to look at. */
  flagstone: { color: PALETTE.STONE_PALE, variation: 0.08, step: 'stone' },
  /** Planked walkway over soft ground. */
  boards: { color: PALETTE.TIMBER, variation: 0.11, step: 'wood' },
  /** Something growing in rows. */
  crop: { color: PALETTE.LEAF_DRY, variation: 0.15, step: 'grass' },
  /** Churned and wet, where animals stand. */
  mire: { color: 0x453a2c, variation: 0.12, step: 'mud' },
  /** Exposed bedrock. Also what steep faces fall back to. */
  rock: { color: PALETTE.STONE_DARK, variation: 0.13, step: 'stone' },
} as const satisfies Record<string, GroundMaterial>;

export type GroundName = keyof typeof GROUND;

/**
 * A region of ground cover.
 *
 * Later patches win over earlier ones, so the list reads top to bottom like
 * layers of paint: lay the fields down, then the roads across them, then the
 * yard where the roads meet.
 */
export type GroundPatch =
  /** A route. Followed through its points in order, with rounded ends. */
  | { kind: 'path'; through: readonly (readonly [number, number])[]; width: number; material: GroundName }
  /** A rough circle — a yard, a clearing, a worn patch by a gate. */
  | { kind: 'blot'; at: readonly [number, number]; radius: number; material: GroundName }
  /** An axis-aligned rectangle. Fields and plots, which are surveyed, not worn. */
  | { kind: 'field'; min: readonly [number, number]; max: readonly [number, number]; material: GroundName };

/** Shortest distance from a point to a line segment, in the XZ plane. */
function toSegment(
  x: number,
  z: number,
  ax: number,
  az: number,
  bx: number,
  bz: number,
): number {
  const dx = bx - ax;
  const dz = bz - az;
  const lengthSquared = dx * dx + dz * dz;
  const t =
    lengthSquared === 0
      ? 0
      : Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / lengthSquared));
  return Math.hypot(x - (ax + dx * t), z - (az + dz * t));
}

/**
 * Which patch covers a position, or null for none.
 *
 * Edges are **hard**, not blended. Everything in this project is flat-shaded
 * and quantized to a handful of levels, so a soft gradient between two ground
 * materials survives the render pipeline as a band of dither and reads as a
 * mistake. A crisp edge on a facet boundary reads as a kerb.
 */
export function patchAt(
  patches: readonly GroundPatch[],
  x: number,
  z: number,
): GroundName | null {
  // Backwards: the last patch listed is the one on top.
  for (let i = patches.length - 1; i >= 0; i--) {
    const patch = patches[i];
    switch (patch.kind) {
      case 'blot':
        if (Math.hypot(x - patch.at[0], z - patch.at[1]) <= patch.radius) return patch.material;
        break;
      case 'field':
        if (
          x >= patch.min[0] &&
          x <= patch.max[0] &&
          z >= patch.min[1] &&
          z <= patch.max[1]
        ) {
          return patch.material;
        }
        break;
      case 'path': {
        const half = patch.width / 2;
        for (let p = 0; p + 1 < patch.through.length; p++) {
          const from = patch.through[p];
          const to = patch.through[p + 1];
          if (toSegment(x, z, from[0], from[1], to[0], to[1]) <= half) return patch.material;
        }
        break;
      }
    }
  }
  return null;
}

/**
 * A stable pseudo-random value for a position, for per-face variation.
 *
 * Hashed rather than drawn from an `Rng` because faces are visited in whatever
 * order the mesh builder happens to walk the grid — a sequence would make the
 * pattern depend on that order, and the same patch of ground would come out
 * differently if the loop were ever restructured. A hash of the coordinates
 * cannot: the ground at a place always looks the same.
 */
export function groundJitter(x: number, z: number): number {
  // Quantized at about a metre — deliberately coarser than the smallest facet.
  //
  // The value is sampled once per face, so a grid finer than the faces gives
  // every face its own shade and the variation reads as per-triangle noise
  // whose *scale changes* wherever the mesh density does. A grid coarser than
  // the faces makes neighbouring small faces share a value, so the variation
  // reads as patches of ground at a fixed size no matter how finely the ground
  // beneath them happens to be cut up.
  let h = (Math.round(x / 1.2) * 374761393 + Math.round(z / 1.2) * 668265263) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
