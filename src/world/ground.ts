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
 * Read by the blade sampler in `art/cover.ts`, which turns each layer into
 * instanced geometry at zone build. This table is the only place the numbers
 * appear.
 */
export interface BladeLayer {
  /** Median blade length, metres. */
  length: number;
  /** Blade width at the root, metres. */
  width: number;
  /**
   * Blades per square metre at full thickness — the *ultra* figure, which is
   * twice a thick field. The player's density tiers draw a fraction of this
   * pool; high is 0.3 and medium 0.2.
   */
  density: number;
  /** 0 rigid .. 1 floppy: how far wind and droop move the tip. */
  give: number;
  /** 0 upright .. 1 sprawling: how far a blade leans at rest. */
  sprawl: number;
  /** Blade colour. Mixed with the ground's own so patches read through. */
  tint: number;
  /** 0 even .. 1 ragged: how much blade length varies. Default 0.3. */
  vary?: number;
  /** Row pitch in metres. Set, blades grow only in rows — crop stubble. */
  rows?: number;
  /**
   * 0 blades .. 1 mass: height follows a smooth rolling field instead of
   * per-blade jitter, and blades go blunt so neighbours merge — moss reads as
   * soft mounds you can see the sides of, not as very short grass.
   */
  mound?: number;
}

/** A scattered prop stood among the blades — a plume stalk, a flower head. */
export interface PropLayer {
  /** Which builder in `art/cover.ts` makes the mesh. */
  kind: 'plume' | 'bloom' | 'leaf' | 'ivy' | 'posy' | 'raceme';
  /** Props per square metre. */
  density: number;
  /** Height multiplier on the authored mesh. */
  scale: number;
  tint: number;
  /** Picked per instance when present — a mixed stand of flower colours. */
  tints?: readonly number[];
}

/** A cover type is blades and any number of prop layers, all optional. */
export interface CoverType {
  blades?: BladeLayer;
  props?: PropLayer | readonly PropLayer[];
  /**
   * Grows on near-vertical faces instead of the ground, oriented to them —
   * ivy on a wall. Stated per mesh (`userData.cover`), never painted on
   * terrain, which turns steep faces to rock before this could see them.
   */
  walls?: boolean;
}

/** The cover types, in the order the terrain attribute indexes them. `none` is 0. */
export const COVER_TYPES = {
  /** No cover. Also what every mesh without an attribute falls back to. */
  none: {},
  /** Ordinary turf. */
  grass: {
    blades: { length: 0.34, width: 0.03, density: 160, give: 0.55, sprawl: 0.3, tint: PALETTE.GRASS },
  },
  /** Long and unmown, and pale with it. Ragged, where turf is even. */
  tussock: {
    blades: { length: 0.6, width: 0.032, density: 110, give: 0.75, sprawl: 0.45, tint: PALETTE.GRASS_DRY, vary: 0.6 },
  },
  /** Crop stubble, and it actually grows in rows: stiff, straight, dry. */
  stubble: {
    blades: {
      length: 0.36, width: 0.032, density: 180, give: 0.3, sprawl: 0.12,
      tint: PALETTE.LEAF_DRY, vary: 0.1, rows: 0.8,
    },
  },
  /** Sparse, wiry and every height at once, on ground people walk flat. */
  weeds: {
    blades: { length: 0.32, width: 0.026, density: 40, give: 0.6, sprawl: 0.55, tint: 0x6b7a45, vary: 0.9 },
  },
  /** Stalks with round leaves over a short nap. Authored only. */
  clover: {
    blades: { length: 0.09, width: 0.04, density: 60, give: 0.3, sprawl: 0.6, tint: 0x53823f },
    props: { kind: 'leaf', density: 180, scale: 1, tint: 0x53823f },
  },
  /** Soft rolling mounds of green, not very short grass. See `mound`. */
  moss: {
    blades: {
      length: 0.14, width: 0.06, density: 320, give: 0.12, sprawl: 0.35,
      tint: 0x455c31, vary: 0.05, mound: 1,
    },
  },
  /** Meadow grass with a mixed stand of flower heads. Authored only. */
  flowers: {
    blades: { length: 0.3, width: 0.028, density: 130, give: 0.6, sprawl: 0.35, tint: 0x5f7040, vary: 0.4 },
    props: {
      kind: 'bloom', density: 3.5, scale: 1, tint: 0xcfc7a6,
      tints: [0xd9d3c0, 0xc9a83c, 0x9a86b8],
    },
  },
  /** Pampas: long dry grass under tall stalks with pale plumes. Authored only. */
  plume: {
    blades: { length: 0.55, width: 0.03, density: 70, give: 0.7, sprawl: 0.5, tint: PALETTE.GRASS_DRY, vary: 0.5 },
    props: { kind: 'plume', density: 3.6, scale: 1, tint: 0xd6c9a8 },
  },
  /** Tall, stiff and dark, for water edges and ditches. Authored only. */
  sedge: {
    blades: { length: 0.95, width: 0.035, density: 60, give: 0.35, sprawl: 0.2, tint: 0x3f5c35, vary: 0.5 },
  },
  /** Low woody scrub hazed with small purple flowers. Authored only. */
  heather: {
    blades: { length: 0.22, width: 0.034, density: 200, give: 0.2, sprawl: 0.7, tint: 0x5a5f42, vary: 0.3 },
    props: {
      kind: 'bloom', density: 24, scale: 0.55, tint: 0x9a86b8,
      tints: [0x9a86b8, 0xb59ac6],
    },
  },
  /** Crawling ivy: leaves flat against a wall. `userData.cover` on the mesh. */
  ivy: {
    walls: true,
    props: { kind: 'ivy', density: 9, scale: 1, tint: 0x3f5c30, tints: [0x3f5c30, 0x4a6636, 0x36512b] },
  },
  /** A climbing rose: sparser foliage with clustered blooms through it. */
  rose: {
    walls: true,
    props: [
      { kind: 'ivy', density: 5, scale: 0.9, tint: 0x445c32, tints: [0x445c32, 0x4f6839] },
      { kind: 'posy', density: 4.5, scale: 1, tint: 0xc76a72, tints: [0xc76a72, 0xd8888e, 0xb85560] },
    ],
  },
  /** Wisteria: foliage above, racemes hanging out of it. */
  wisteria: {
    walls: true,
    props: [
      { kind: 'ivy', density: 5, scale: 1.1, tint: 0x53663a, tints: [0x53663a, 0x5e7242] },
      { kind: 'raceme', density: 5.5, scale: 1, tint: 0x9a86c6, tints: [0x9a86c6, 0xb0a0d6, 0x8a74b8] },
    ],
  },
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
  moss: 'moss',
};

/**
 * Cover painted directly, over whatever the material underneath would grow.
 *
 * Clover in this hollow, moss along the north wall, and `none` to clear a
 * patch that the material would otherwise cover. Wins outright, including over
 * the rock a steep face falls back to.
 *
 * Edges feather unless the patch says `hard`: neighbouring cover runs at full
 * density to a hard patch's line and never mixes across it — a mown edge, a
 * kerb — where a feathered boundary interleaves both types over a couple of
 * metres.
 */
export type CoverPatch = PatchShape & { cover: CoverName; edge?: 'feather' | 'hard' };

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

/**
 * Where a mounded cover stands tall and where it hollows, 0..1. Much smaller
 * octaves than the swell — these are tufts you see the sides of, not sweeps
 * you see across.
 */
export function coverMound(x: number, z: number): number {
  return smoothNoise(x, z, 1.9, 431) * 0.6 + smoothNoise(x, z, 0.7, 733) * 0.4;
}

/** Which cover patch covers a position, or null for none. */
export function coverPatchAt(
  patches: readonly CoverPatch[],
  x: number,
  z: number,
): CoverName | null {
  return coverPatchWinner(patches, x, z)?.cover ?? null;
}

/** The winning patch itself, for asking about its edge. */
export function coverPatchWinner(
  patches: readonly CoverPatch[],
  x: number,
  z: number,
): CoverPatch | null {
  for (let i = patches.length - 1; i >= 0; i--) {
    if (inside(patches[i], x, z)) return patches[i];
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
