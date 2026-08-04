import { PALETTE, shade } from '../art/palette';
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
  dirt: { color: PALETTE.EARTH, variation: 0.09, step: 'soil' },
  /** Loose stone. A made road rather than a worn one. */
  gravel: { color: 0x6e6656, variation: 0.16, step: 'gravel' },
  /** Set stone, bedded and pointed. A yard, a market floor, a made road. */
  cobble: { color: PALETTE.STONE, variation: 0.19, step: 'cobble-fixed' },
  /** Broken stone, loose. A track rather than a road — the coarse aggregate. */
  rubble: { color: shade(PALETTE.STONE, 0.86), variation: 0.22, step: 'cobble-loose' },
  /** Fine and dry. A shore, a pit, a yard nobody has swept. */
  sand: { color: 0xc4ad84, variation: 0.08, step: 'sand' },
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
  /** Catwalk, grating, ductwork. Fixed at its ends, so the clang travels. */
  grating: { color: PALETTE.IRON, variation: 0.15, step: 'metal-ring' },
  /** Steel bedded on something solid. Dull, and the only quiet metal. */
  plate: { color: shade(PALETTE.IRON, 0.88), variation: 0.11, step: 'metal-solid' },
  /** A pipe run, a duct, a small drum. Hollow, but not much of a volume. */
  pipework: { color: shade(PALETTE.IRON, 0.78), variation: 0.14, step: 'metal-hollow-small' },
  /** A tank top, a hopper, a container roof. There is a great deal of air under it. */
  hollowmetal: { color: PALETTE.IRON_DARK, variation: 0.13, step: 'metal-hollow-big' },
  /** Lying snow, trodden. Almost no face variation — snow is famously even. */
  snow: { color: 0xd8dde4, variation: 0.05, step: 'snow' },
  /** Damp shade under a canopy, or the north side of a stone. */
  moss: { color: 0x455c31, variation: 0.14, step: 'moss' },
} as const satisfies Record<string, GroundMaterial>;

export type GroundName = keyof typeof GROUND;

/**
 * The shape of a painted region, without saying what is painted in it.
 *
 * Shared by ground materials and by cover, because "a route", "a rough circle"
 * and "a surveyed rectangle" are the three shapes an authored map wants and
 * neither list has a reason to disagree with the other about them.
 */
export type PatchShape =
  /** A route. Followed through its points in order, with rounded ends. */
  | { kind: 'path'; through: readonly (readonly [number, number])[]; width: number }
  /** A rough circle — a yard, a clearing, a worn patch by a gate. */
  | { kind: 'blot'; at: readonly [number, number]; radius: number }
  /** An axis-aligned rectangle. Fields and plots, which are surveyed, not worn. */
  | { kind: 'field'; min: readonly [number, number]; max: readonly [number, number] };

/**
 * A region of ground cover.
 *
 * Later patches win over earlier ones, so the list reads top to bottom like
 * layers of paint: lay the fields down, then the roads across them, then the
 * yard where the roads meet.
 */
export type GroundPatch = PatchShape & { material: GroundName };

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

/** Whether a shape contains a position. */
function inside(patch: PatchShape, x: number, z: number): boolean {
  switch (patch.kind) {
    case 'blot':
      return Math.hypot(x - patch.at[0], z - patch.at[1]) <= patch.radius;
    case 'field':
      return x >= patch.min[0] && x <= patch.max[0] && z >= patch.min[1] && z <= patch.max[1];
    case 'path': {
      const half = patch.width / 2;
      for (let p = 0; p + 1 < patch.through.length; p++) {
        const from = patch.through[p];
        const to = patch.through[p + 1];
        if (toSegment(x, z, from[0], from[1], to[0], to[1]) <= half) return true;
      }
      return false;
    }
  }
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
    if (inside(patches[i], x, z)) return patches[i].material;
  }
  return null;
}

// --- cover ------------------------------------------------------------------

/**
 * What grows on the ground, as opposed to what the ground is made of.
 *
 * The third fact about a material, beside its colour and its sound, and it
 * lives in the same file for the same reason those two do: a gravel path that
 * still has grass standing in it is the visual half of the mismatch that a
 * cobbled path sounding like turf is the audible half of.
 *
 * These are read by the shell shader in `art/cover.ts` — every field here is a
 * uniform it indexes with a per-face attribute, so the table is the *only*
 * place any of these numbers appear.
 */
export interface CoverType {
  /** Height as a multiple of the global. Species is mostly this. */
  height: number;
  /** Fraction of hash cells carrying a strand at all, 0..1. */
  density: number;
  /** Fraction of the ground the cover holds at the root, 0..1. */
  hold: number;
  /**
   * How sharply a tuft narrows as it rises.
   *
   * Above 1 is spikes — most of a tuft's footprint is gone by half its height,
   * which is grass. Below 1 is a mound that keeps its width to the top, which
   * is moss.
   */
  taper: number;
  /** Blade colour. Mixed with the ground's own so patches read through. */
  tint: number;
}

/**
 * The cover types, in the order the shader indexes them. `none` is 0.
 *
 * Adding one costs a uniform slot and nothing else; the shader has no branch on
 * type at all, because the shape *is* these four numbers.
 */
export const COVER_TYPES = {
  /** No cover. Also what every mesh without an attribute falls back to. */
  none: { height: 0, density: 0, hold: 0, taper: 1, tint: 0x000000 },
  /** Ordinary turf. Holds most of the ground and thins fast going up. */
  grass: { height: 1, density: 1, hold: 0.82, taper: 2, tint: PALETTE.GRASS },
  /** Long and unmown, and pale with it. */
  tussock: { height: 1.5, density: 0.95, hold: 0.76, taper: 2.3, tint: PALETTE.GRASS_DRY },
  /** Something growing in rows: medium, and dry. */
  stubble: { height: 1.1, density: 0.8, hold: 0.72, taper: 1.8, tint: PALETTE.LEAF_DRY },
  /** Sparse and wiry, on ground people have walked flat. */
  weeds: { height: 0.75, density: 0.45, hold: 0.34, taper: 2.6, tint: 0x6b7a45 },
  /** Round, squat and paler. Authored only — nothing grows it by default. */
  clover: { height: 0.6, density: 0.92, hold: 0.86, taper: 0.9, tint: 0x53823f },
  /** A dense low fuzz with almost no height. In the joints, on the north wall. */
  moss: { height: 0.35, density: 0.85, hold: 0.94, taper: 0.5, tint: 0x455c31 },
} as const satisfies Record<string, CoverType>;

export type CoverName = keyof typeof COVER_TYPES;

/** The shader's index for a cover type. `none` is 0 by construction. */
export const COVER_ORDER = Object.keys(COVER_TYPES) as readonly CoverName[];

/**
 * What each ground material grows. Absent means bare.
 *
 * Painting a gravel path across a field clears the grass off it for free, the
 * same way it already changes the footstep sound.
 */
export const COVER: Partial<Record<GroundName, CoverName>> = {
  turf: 'grass',
  meadow: 'tussock',
  crop: 'stubble',
  dirt: 'weeds',
  cobble: 'moss',
};

/**
 * Cover painted directly, over whatever the material underneath would grow.
 *
 * Clover in this hollow, moss along the north wall, and `none` to clear a
 * patch that the material would otherwise cover. Wins outright, including over
 * the rock a steep face falls back to.
 */
export type CoverPatch = PatchShape & { cover: CoverName };

/** Stable 0..1 value at an integer lattice point. */
function latticeHash(ix: number, iz: number, seed: number): number {
  let h = (Math.imul(ix, 374761393) + Math.imul(iz, 668265263) + Math.imul(seed, 1442695041)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

/** Smooth value noise on world XZ at a given feature size, 0..1. */
function smoothNoise(x: number, z: number, scale: number, seed: number): number {
  const px = x / scale;
  const pz = z / scale;
  const ix = Math.floor(px);
  const iz = Math.floor(pz);
  const sx = (px - ix) * (px - ix) * (3 - 2 * (px - ix));
  const sz = (pz - iz) * (pz - iz) * (3 - 2 * (pz - iz));
  const low = latticeHash(ix, iz, seed) + (latticeHash(ix + 1, iz, seed) - latticeHash(ix, iz, seed)) * sx;
  const high =
    latticeHash(ix, iz + 1, seed) +
    (latticeHash(ix + 1, iz + 1, seed) - latticeHash(ix, iz + 1, seed)) * sx;
  return low + (high - low) * sz;
}

/**
 * Where the cover stands taller and shorter, 0..1.
 *
 * Sweeps rather than noise: a field is not one height, and it is not a random
 * height per tuft either. Two octaves at 26 m and 9.5 m, so a plain has broad
 * areas you can see across and smaller ones inside them.
 */
export function coverSwell(x: number, z: number): number {
  return smoothNoise(x, z, 26, 101) * 0.68 + smoothNoise(x, z, 9.5, 227) * 0.32;
}

/** The same for how thick it stands. Separate seeds, so the two do not lock. */
export function coverThickness(x: number, z: number): number {
  return smoothNoise(x, z, 18, 613) * 0.7 + smoothNoise(x, z, 7, 859) * 0.3;
}

/** Which cover patch covers a position, or null for none. */
export function coverPatchAt(
  patches: readonly CoverPatch[],
  x: number,
  z: number,
): CoverName | null {
  for (let i = patches.length - 1; i >= 0; i--) {
    if (inside(patches[i], x, z)) return patches[i].cover;
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
