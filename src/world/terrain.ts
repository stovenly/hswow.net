import * as THREE from 'three';
import { FIELD_ATTRIBUTE, finish } from '../art/assemble';
import { COVER_ATTRIBUTE, COVER_BLEND_ATTRIBUTE, COVER_FLOOR } from '../art/cover';
import { shade } from '../art/palette';
import {
  GROUND,
  COVER,
  COVER_ORDER,
  COVER_TYPES,
  type CoverType,
  patchAt,
  coverPatchAt,
  coverPatchWinner,
  coverSwell,
  coverThickness,
  groundJitter,
  type GroundName,
  outlineDistance,
  type GroundPatch,
  type CoverPatch,
  type PatchShape,
  type CoverName,
} from './ground';
import type { SurfaceName } from '../audio/models/footsteps';
import { Raster, type HeightRaster, type IndexRaster } from './raster';

/**
 * The painted tables, as indices. One-based, so zero can mean unpainted; the
 * order is the table's own, which is why adding a material in the middle of
 * `GROUND` would repaint every level that has a raster.
 */
const GROUND_NAMES = Object.keys(GROUND) as GroundName[];
const COVER_NAMES = Object.keys(COVER_TYPES) as CoverName[];

/**
 * Authored terrain: a heightfield summed from placed landforms. Not noise — every
 * bump in the ground is a shape somebody put there on purpose, listed in data, and
 * building the field is adding those up. A grid of control points is unreadable to
 * edit and impossible to review; landforms are legible as text and are the same
 * list an editor would drag around.
 *
 * There is no invisible wall. The `rim` landform lifts the outer ring past the
 * controller's slope limit, so walking at the edge of the world means walking up a
 * slope that gets steeper until you slide back down it — nothing special in the
 * collider, nothing to fall through, and it looks like hills because it is hills.
 */

export type Landform =
  /** A rounded rise. `falloff` above 1 makes it peakier, below 1 flatter-topped. */
  | { kind: 'hill'; at: [number, number]; radius: number; height: number; falloff?: number }
  /** A raised line between two points — an esker, a spine, a bank. */
  | { kind: 'ridge'; from: [number, number]; to: [number, number]; width: number; height: number }
  /** A rounded hollow. Somewhere to put things. */
  | { kind: 'basin'; at: [number, number]; radius: number; depth: number }
  /**
   * The wall of hills around the edge. `inset` is how far in from the boundary it
   * starts climbing — short insets give cliff-like sides, long ones a gentle bowl.
   *
   * `outline` is what makes a level any shape but square: without it the rim is
   * measured by Chebyshev distance to the field's own edge, so it follows the square
   * the heightfield is stored in. It is a `PatchShape[]`, the same union the ground
   * patches, the cover patches and the parallax keep-out are written in, so the
   * shape a level is can be stated once and used by all of them.
   */
  | { kind: 'rim'; inset: number; height: number; outline?: readonly PatchShape[] }
  /**
   * A one-sided step: level on one side, level on the other, a bank between —
   * the primitive a boundary wants, where `ridge` rises to a crest and falls off
   * both ways and so can only make a mound.
   *
   * `run` is the horizontal distance the step takes, centred on the line, so the
   * bank is `run` wide and `height` tall. `side` says which way is up: +1 raises the
   * left of the direction of travel.
   *
   * It dies out past its ends over `run`, but not sideways, and that is `reach`.
   * Without it the high side stays high for ever, which is what a scarp is — the
   * ground beyond a shelf cut into a hillside goes on being a hillside. With it, it
   * is a bank: high for that many metres and then easing back.
   *
   * It is also the difference between a landform the broad phase can bound and one
   * it cannot, so say `reach` unless the half-plane is what you meant.
   */
  | {
      kind: 'scarp';
      through: readonly (readonly [number, number])[];
      run: number;
      height: number;
      side?: 1 | -1;
      /** How far the high side holds before easing back down. Omitted, for ever. */
      reach?: number;
    }
  /**
   * A sunken corridor: a route cut into the ground with its banks left standing.
   * `ridge` inverted, and the strongest thing in the vocabulary for saying you are
   * on a route — because the banks are not raised, they are simply the ground that
   * was not lowered, so a channel across any terrain produces sides that match.
   *
   * `width` is the flat bottom; `bank` is how far either side the ground climbs back
   * to where it was. `rockAngle` then paints the steep faces as stone.
   */
  | {
      kind: 'channel';
      through: readonly (readonly [number, number])[];
      width: number;
      depth: number;
      bank: number;
    }
  /**
   * Level ground, for building on — the one landform that is not additive: it
   * replaces the height inside its shape and eases back over `blend`.
   *
   * Buildings are rigid and ground is not. A hut is placed at a single point and
   * stands square, so on ground that falls even a little across its footprint one
   * corner buries itself and the opposite corner floats. Applied after the additive
   * pass, in list order, so a later terrace can cut a step into an earlier one.
   *
   * A circle or a shape, and the shape form is what roads want: levelling a ribbon
   * with a chain of overlapping discs gives a scalloped edge and a height that
   * ripples along its length.
   */
  | { kind: 'terrace'; at: [number, number]; radius: number; height: number; blend: number }
  | { kind: 'terrace'; shape: readonly PatchShape[]; height: number; blend: number };

/** A circle in which the base grid is subdivided further. */
export interface DetailRegion {
  at: readonly [number, number];
  radius: number;
  /** Sub-quads per base quad edge. 2 halves them, 4 quarters them. */
  level: number;
}

export interface TerrainRasters {
  /** Added to the sum of the landforms, in metres. */
  sculpt?: HeightRaster;
  /** Material index into `GROUND`'s keys, plus one. Zero is unpainted. */
  paint?: IndexRaster;
  /** Cover index into `COVER_TYPES`' keys, plus one. Zero is unpainted. */
  cover?: IndexRaster;
}

export interface TerrainOptions {
  /** Metres across. The field is square and centred on the origin. */
  size: number;
  /** Metres per quad. Also the collision resolution — they are the same mesh. */
  resolution: number;
  landforms: readonly Landform[];
  /**
   * Places the grid is subdivided further. One resolution for a whole map is a
   * compromise made everywhere at once: fine enough for a two-metre street to have
   * straight edges is far finer than a bare hillside needs.
   *
   * Put the edges of these on gentle ground. Stitching closes the geometric seam,
   * but nothing can hide a change in facet size on a steep slope — big facets and
   * small facets approximate a curve with different normals, and under flat shading
   * two different normals meeting along a line is a line you can see. On flat ground
   * every facet points straight up whatever its size, so the boundary vanishes.
   */
  detail?: readonly DetailRegion[];
  /**
   * Ground cover, painted over the shape. Later patches win.
   *
   * Optional — a field with none is all turf, which is fine for a test slope
   * and wrong for anywhere anybody lives.
   */
  patches?: readonly GroundPatch[];
  /**
   * Cover painted over the automatic result. Later patches win. Most ground grows
   * what its material says it grows; this is for the cases a material cannot state —
   * clover in one hollow, moss along one wall, a clearing trodden bare.
   */
  cover?: readonly CoverPatch[];
  /** Slope in degrees past which a face falls back to rock, whatever is painted. */
  rockAngle?: number;
  /** What unpainted, unsteep ground is made of. */
  base?: GroundName;
  /**
   * Thins ground cover to nothing over the last stretch before the level's edge,
   * because cover ending in a line is the loudest seam a vista has: beyond the
   * boundary the skirt takes over and grows nothing, so a field that keeps full
   * density to the last quad simply stops and the eye reads the exact shape of the
   * playable area.
   *
   * `band` is metres, measured inward from `outline`, which defaults to the field's
   * own square. Density only — the ground material is unchanged.
   */
  edgeFade?: { band: number; outline?: readonly PatchShape[] };
  /**
   * The sculpted layers, over the shapes above. Height composes by addition;
   * material and cover are decided base, then raster, then patches — shapes win,
   * because a path is a decision and paint is a gesture.
   */
  rasters?: TerrainRasters;
}

/** The levelling landforms, which run in their own pass. */
type Terrace = Extract<Landform, { kind: 'terrace' }>;

/** Shared empty bucket, so a query off the field allocates nothing. */
const EMPTY: readonly number[] = [];

/** Smootherstep: zero gradient at both ends, so landforms blend without creases. */
function ease(t: number): number {
  const x = t < 0 ? 0 : t > 1 ? 1 : t;
  return x * x * x * (x * (x * 6 - 15) + 10);
}

/** Shortest distance from a point to a line segment, in the XZ plane. */
function toSegment(x: number, z: number, ax: number, az: number, bx: number, bz: number): number {
  const dx = bx - ax;
  const dz = bz - az;
  const lengthSquared = dx * dx + dz * dz;
  const t = lengthSquared === 0 ? 0 : Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / lengthSquared));
  return Math.hypot(x - (ax + dx * t), z - (az + dz * t));
}

/**
 * Where a point stands relative to a run of line segments. Three numbers, because
 * the two landforms written against a polyline want different ones.
 *
 * `near` is the shortest distance to the run, ends included, and decides which
 * segment the other two answers come from. `side` is `near` again, signed: the
 * magnitude is the distance to the run and the sign is which side of the nearest
 * segment's infinite line the point is on, so which way is up does not flip because
 * you walked past a vertex. Magnitude from the segment and sign from its line —
 * taking both from the line holds a scarp's full height a hundred metres away past
 * an interior corner. `past` is how far beyond the first or last vertex, measured
 * along the run, and is what lets a scarp die out at its ends.
 */
function polylineFit(
  x: number,
  z: number,
  through: readonly (readonly [number, number])[],
): { near: number; side: number; past: number } {
  if (through.length === 0) return { near: Infinity, side: 0, past: Infinity };
  if (through.length === 1) {
    const only = Math.hypot(x - through[0][0], z - through[0][1]);
    return { near: only, side: 0, past: only };
  }

  let near = Infinity;
  let side = 0;
  let past = 0;

  for (let i = 0; i + 1 < through.length; i++) {
    const a = through[i];
    const b = through[i + 1];
    const dx = b[0] - a[0];
    const dz = b[1] - a[1];
    const lengthSquared = dx * dx + dz * dz;
    if (lengthSquared === 0) continue;

    const raw = ((x - a[0]) * dx + (z - a[1]) * dz) / lengthSquared;
    const t = raw < 0 ? 0 : raw > 1 ? 1 : raw;
    const distance = Math.hypot(x - (a[0] + dx * t), z - (a[1] + dz * t));
    if (distance >= near) continue;

    const length = Math.sqrt(lengthSquared);
    near = distance;
    side = distance * (dx * (z - a[1]) - dz * (x - a[0]) < 0 ? -1 : 1);
    past =
      i === 0 && raw < 0
        ? -raw * length
        : i === through.length - 2 && raw > 1
          ? (raw - 1) * length
          : 0;
  }

  return { near, side, past };
}

/** A landform's bounding circle, or null for one that reaches everywhere. */
interface Reach {
  x: number;
  z: number;
  radius: number;
}

function polylineReach(
  through: readonly (readonly [number, number])[],
  pad: number,
): Reach | null {
  if (through.length === 0) return null;
  let minX = Infinity;
  let maxX = -Infinity;
  let minZ = Infinity;
  let maxZ = -Infinity;
  for (const [px, pz] of through) {
    minX = Math.min(minX, px);
    maxX = Math.max(maxX, px);
    minZ = Math.min(minZ, pz);
    maxZ = Math.max(maxZ, pz);
  }
  return {
    x: (minX + maxX) / 2,
    z: (minZ + maxZ) / 2,
    radius: Math.hypot(maxX - minX, maxZ - minZ) / 2 + pad,
  };
}

/**
 * How far a landform can possibly reach, for the broad phase. `null` means
 * everywhere, and is not a failure to answer — a rim is genuinely a fact about the
 * whole field, and a terrace is handled in the second pass.
 */
function reachOf(form: Landform): Reach | null {
  switch (form.kind) {
    case 'hill':
    case 'basin':
      return { x: form.at[0], z: form.at[1], radius: form.radius };
    case 'ridge':
      return {
        x: (form.from[0] + form.to[0]) / 2,
        z: (form.from[1] + form.to[1]) / 2,
        radius:
          Math.hypot(form.to[0] - form.from[0], form.to[1] - form.from[1]) / 2 + form.width,
      };
    // A scarp with no `reach` is unbounded and has to say so: its high side stays
    // high for ever, so any circle drawn round it is a claim that points outside are
    // unaffected — false by the full height of the step.
    case 'scarp':
      return form.reach === undefined
        ? null
        : polylineReach(form.through, form.reach + form.run);
    case 'channel':
      return polylineReach(form.through, form.width / 2 + form.bank);
    case 'rim':
    case 'terrace':
      return null;
  }
}

export class Terrain {
  readonly size: number;
  readonly resolution: number;
  private readonly landforms: readonly Landform[];
  private readonly patches: readonly GroundPatch[];
  private readonly cover: readonly CoverPatch[];
  private readonly detail: readonly DetailRegion[];
  private readonly rockAngle: number;
  /** Mutable: the editor writes into these while a stroke is under way. */
  private readonly rasters: TerrainRasters;
  private readonly base: GroundName;
  private readonly edgeFade: number;
  private readonly edgeOutline: readonly PatchShape[];

  /**
   * The broad phase: which landforms can possibly matter in which cell. `heightAt`
   * is called once per vertex when the mesh is built and again for every prop
   * dropped onto the ground, and walking the whole list each time is fine for eight
   * forms and wrong for the fifty to two hundred a terraformed level has.
   * Deliberately coarse — the job is to skip the forms that are nowhere near.
   */
  private readonly cols: number;
  private readonly cell: number;
  private readonly buckets: readonly (readonly number[])[];
  /** Landforms with no bounding circle, or one that leaves the field. Asked always. */
  private readonly always: readonly number[];
  /** The levelling pass, in list order — a later terrace cuts into an earlier one. */
  private readonly levellers: readonly Terrace[];

  constructor(options: TerrainOptions) {
    this.size = options.size;
    this.resolution = options.resolution;
    this.landforms = options.landforms;
    this.patches = options.patches ?? [];
    this.cover = options.cover ?? [];
    this.detail = options.detail ?? [];
    this.rockAngle = options.rockAngle ?? 34;
    this.base = options.base ?? 'turf';
    this.edgeFade = options.edgeFade?.band ?? 0;
    this.rasters = options.rasters ?? {};
    this.edgeOutline = options.edgeFade?.outline ?? [
      { kind: 'field', min: [-this.size / 2, -this.size / 2], max: [this.size / 2, this.size / 2] },
    ];

    // --- the broad phase -----------------------------------------------------
    const half = this.size / 2;
    this.cols = Math.max(1, Math.min(32, Math.round(this.size / Math.max(this.resolution * 4, 4))));
    this.cell = this.size / this.cols;

    const buckets: number[][] = Array.from({ length: this.cols * this.cols }, () => []);
    const always: number[] = [];
    const levellers: Terrace[] = [];

    this.landforms.forEach((form, index) => {
      if (form.kind === 'terrace') {
        levellers.push(form);
        return;
      }
      const reach = reachOf(form);
      // Anything that is not comfortably inside the field goes in `always`. A
      // bucketed form has to be wholly within the grid for the converse to hold —
      // that a query outside the grid cannot be reached by anything in it — and that
      // converse is what makes the scheme correct rather than merely fast.
      if (
        !reach ||
        reach.x - reach.radius < -half ||
        reach.x + reach.radius > half ||
        reach.z - reach.radius < -half ||
        reach.z + reach.radius > half
      ) {
        always.push(index);
        return;
      }
      const c0 = Math.max(0, Math.floor((reach.x - reach.radius + half) / this.cell));
      const c1 = Math.min(this.cols - 1, Math.floor((reach.x + reach.radius + half) / this.cell));
      const r0 = Math.max(0, Math.floor((reach.z - reach.radius + half) / this.cell));
      const r1 = Math.min(this.cols - 1, Math.floor((reach.z + reach.radius + half) / this.cell));
      for (let row = r0; row <= r1; row++) {
        for (let col = c0; col <= c1; col++) buckets[row * this.cols + col].push(index);
      }
    });

    this.buckets = buckets;
    this.always = always;
    this.levellers = levellers;
  }

  /**
   * The sculpted layer, made blank on first ask.
   *
   * Handed out live rather than copied: the brush writes into it and `heightAt`
   * reads it on the next vertex, which is what makes a stroke visible while the
   * mouse is still down.
   */
  sculptRaster(resolution: number): HeightRaster {
    this.rasters.sculpt ??= Raster.blank((n) => new Float32Array(n), this.size, resolution);
    return this.rasters.sculpt;
  }

  paintRaster(resolution: number): IndexRaster {
    this.rasters.paint ??= Raster.blank((n) => new Uint8Array(n), this.size, resolution);
    return this.rasters.paint;
  }

  coverRaster(resolution: number): IndexRaster {
    this.rasters.cover ??= Raster.blank((n) => new Uint8Array(n), this.size, resolution);
    return this.rasters.cover;
  }

  /** What has been sculpted, or nothing where nothing has. */
  sculptRasterIfAny(): HeightRaster | undefined {
    return this.rasters.sculpt;
  }

  paintRasterIfAny(): IndexRaster | undefined {
    return this.rasters.paint;
  }

  coverRasterIfAny(): IndexRaster | undefined {
    return this.rasters.cover;
  }

  /** How much cover survives here, 0 at the level's edge and 1 a band inward. Smootherstep, or a linear ramp draws a line of its own a band's width inside the one it was hiding. */
  private edgeDensity(x: number, z: number): number {
    if (this.edgeFade <= 0) return 1;
    return ease(-outlineDistance(this.edgeOutline, x, z) / this.edgeFade);
  }

  /**
   * Ground height at a world position — the authority for everything: the mesh is
   * sampled from it, props are dropped onto it, and the checks measure it. Called
   * once per vertex when building the mesh, so nothing expensive belongs here.
   */
  heightAt(x: number, z: number): number {
    let height = this.rasters.sculpt ? this.rasters.sculpt.sample(x, z) : 0;

    // First pass: everything that adds. Order does not matter, which is why it
    // can be split between the always-list and one bucket.
    for (const index of this.always) height += this.riseAt(this.landforms[index], x, z);
    for (const index of this.bucketAt(x, z)) height += this.riseAt(this.landforms[index], x, z);

    // Second pass: levelling. Separate from the sum above because blending
    // toward a target is not something that can be added in — a terrace has to
    // know what the ground would otherwise have been in order to replace it.
    for (const form of this.levellers) height = this.levelAt(form, height, x, z);

    return height;
  }

  /** Which landforms can reach a position. Empty off the field but for `always`. */
  private bucketAt(x: number, z: number): readonly number[] {
    const half = this.size / 2;
    const col = Math.floor((x + half) / this.cell);
    const row = Math.floor((z + half) / this.cell);
    if (col < 0 || row < 0 || col >= this.cols || row >= this.cols) return EMPTY;
    return this.buckets[row * this.cols + col];
  }

  /** What one additive landform contributes here. */
  private riseAt(form: Landform, x: number, z: number): number {
    switch (form.kind) {
      // Handled in the second pass — it replaces rather than adds.
      case 'terrace':
        return 0;
      case 'hill': {
        const d = Math.hypot(x - form.at[0], z - form.at[1]);
        const t = ease(1 - d / form.radius);
        return form.height * (form.falloff ? t ** form.falloff : t);
      }
      case 'ridge': {
        const d = toSegment(x, z, form.from[0], form.from[1], form.to[0], form.to[1]);
        return form.height * ease(1 - d / form.width);
      }
      case 'basin': {
        const d = Math.hypot(x - form.at[0], z - form.at[1]);
        return -form.depth * ease(1 - d / form.radius);
      }
      case 'scarp': {
        const run = Math.max(form.run, 1e-6);
        const fit = polylineFit(x, z, form.through);
        // Signed distance onto the high side, so the step is one ramp and the
        // `side` flag is the only thing that decides which way is up.
        const lift = (form.side ?? 1) * fit.side;
        // The step itself, centred on the line and `run` wide.
        let step = ease(0.5 + lift / run);
        // And back down again, if this one is a bank rather than a hillside.
        if (form.reach !== undefined) step *= ease((form.reach + run - lift) / run);
        // Times how much of the scarp is still alive this far past its ends.
        return form.height * step * ease(1 - fit.past / run);
      }
      case 'channel': {
        const half = form.width / 2;
        const bank = Math.max(form.bank, 1e-6);
        const near = polylineFit(x, z, form.through).near;
        if (near >= half + bank) return 0;
        // Flat across the bottom, then back up to whatever the ground already
        // was. The banks are not built; they are what was not dug out.
        return -form.depth * (near <= half ? 1 : ease((half + bank - near) / bank));
      }
      case 'rim': {
        // Distance in from the boundary, whichever boundary that is. Without an
        // outline it is the Chebyshev distance to the field's own square edge, so the
        // rim follows that square rather than being a circle inscribed in it — which
        // would leave four walkable corners straight out of the map.
        const inset = Math.max(form.inset, 1e-6);
        const edge = form.outline
          ? -outlineDistance(form.outline, x, z)
          : this.size / 2 - Math.max(Math.abs(x), Math.abs(z));
        return form.height * ease(1 - edge / inset);
      }
    }
  }

  /** What one terrace does to the height the additive pass arrived at. */
  private levelAt(form: Terrace, height: number, x: number, z: number): number {
    const blend = Math.max(form.blend, 1e-6);
    // Signed distance out of the levelled region: negative inside it. The
    // circle form is a `blot` written shorter, and comes out identical.
    const out =
      'shape' in form
        ? outlineDistance(form.shape, x, z)
        : Math.hypot(x - form.at[0], z - form.at[1]) - form.radius;
    if (out >= blend) return height;
    const w = out <= 0 ? 1 : ease((blend - out) / blend);
    return height * (1 - w) + form.height * w;
  }

  /** What unpainted ground here is made of. Exported so the skirt takes its colour from the level rather than being told twice — a mismatch puts a value step on the boundary the band exists to hide. */
  get baseMaterial(): GroundName {
    return this.base;
  }

  /** The detail regions, so the check can measure the ground under their edges. */
  get detailRegions(): readonly DetailRegion[] {
    return this.detail;
  }

  /** Steepest slope at a position, in degrees. Sampled, not analytic. */
  slopeAt(x: number, z: number, step = this.resolution): number {
    const dx = (this.heightAt(x + step, z) - this.heightAt(x - step, z)) / (2 * step);
    const dz = (this.heightAt(x, z + step) - this.heightAt(x, z - step)) / (2 * step);
    return (Math.atan(Math.hypot(dx, dz)) * 180) / Math.PI;
  }

  /**
   * Builds the visible and collidable mesh. They are the same triangles: split into
   * two would mean the player walking on a surface whose shape they cannot see.
   *
   * Cells inside a `detail` region are subdivided, which is the only way to get a
   * straight-edged two-metre street without paying for sub-metre quads across a map
   * of empty hillside. Subdividing unevenly opens T-junctions: a fine cell has
   * vertices along its border that its coarse neighbour has never heard of, and
   * those sit on the true surface while the neighbour's edge is a straight line
   * between two corners.
   *
   * The fix is to make border vertices lie. A vertex on an edge shared with a
   * coarser neighbour takes its height from that edge as the neighbour draws it,
   * interpolated between the neighbour's own samples, so both sides describe the
   * same line. Corners need no special case.
   *
   * Built by hand rather than through `assemble`, because face colour here depends
   * on the face normal — flat ground is turf, steep ground is rock.
   */
  build(): THREE.Mesh {
    const cells = Math.round(this.size / this.resolution);
    const half = this.size / 2;
    const res = this.resolution;

    // Subdivision per base cell, decided up front so neighbours can be asked.
    const levels = new Uint8Array(cells * cells);
    for (let row = 0; row < cells; row++) {
      for (let col = 0; col < cells; col++) {
        const cx = -half + (col + 0.5) * res;
        const cz = -half + (row + 0.5) * res;
        let best = 1;
        for (const region of this.detail) {
          if (Math.hypot(cx - region.at[0], cz - region.at[1]) <= region.radius) {
            best = Math.max(best, region.level);
          }
        }
        levels[row * cells + col] = best;
      }
    }
    // Off the map counts as coarse, which is right: there is nothing there.
    const levelAt = (row: number, col: number): number =>
      row < 0 || col < 0 || row >= cells || col >= cells ? 1 : levels[row * cells + col];

    const positions: number[] = [];
    const normals: number[] = [];
    const colors: number[] = [];
    // Type, feather, and the two broad fields, per vertex, for the cover sampler.
    const covers: number[] = [];
    // And who the neighbour across a boundary is, with how much of it to mix in.
    const blends: number[] = [];

    const a = new THREE.Vector3();
    const b = new THREE.Vector3();
    const c = new THREE.Vector3();
    const ab = new THREE.Vector3();
    const ac = new THREE.Vector3();
    const normal = new THREE.Vector3();
    const color = new THREE.Color();

    const emit = (p: THREE.Vector3, n: THREE.Vector3, floor: number): void => {
      positions.push(p.x, p.y, p.z);
      normals.push(n.x, n.y, n.z);
      colors.push(color.r * floor, color.g * floor, color.b * floor);
    };

    for (let row = 0; row < cells; row++) {
      for (let col = 0; col < cells; col++) {
        const n = levels[row * cells + col];
        const x0 = -half + col * res;
        const z0 = -half + row * res;

        const west = levelAt(row, col - 1);
        const east = levelAt(row, col + 1);
        const north = levelAt(row - 1, col);
        const south = levelAt(row + 1, col);

        // Height inside this cell in local 0..1 coordinates, deferring to a
        // coarser neighbour along any shared border. See the note above.
        const at = (u: number, v: number): number => {
          if (u === 0 && west < n) return this.alongEdge(x0, z0, x0, z0 + res, v, west);
          if (u === 1 && east < n) return this.alongEdge(x0 + res, z0, x0 + res, z0 + res, v, east);
          if (v === 0 && north < n) return this.alongEdge(x0, z0, x0 + res, z0, u, north);
          if (v === 1 && south < n) return this.alongEdge(x0, z0 + res, x0 + res, z0 + res, u, south);
          return this.heightAt(x0 + u * res, z0 + v * res);
        };

        for (let sv = 0; sv < n; sv++) {
          for (let su = 0; su < n; su++) {
            const u0 = su / n;
            const u1 = (su + 1) / n;
            const v0 = sv / n;
            const v1 = (sv + 1) / n;

            // Two triangles per quad, split along the same diagonal
            // throughout. A consistent split gives the field one faceting
            // direction, which reads as deliberate; alternating looks woven.
            const corners: [number, number, number][] = [
              [x0 + u0 * res, at(u0, v0), z0 + v0 * res],
              [x0 + u0 * res, at(u0, v1), z0 + v1 * res],
              [x0 + u1 * res, at(u1, v1), z0 + v1 * res],
              [x0 + u1 * res, at(u1, v0), z0 + v0 * res],
            ];

            for (const [p, q, r] of [
              [0, 1, 2],
              [0, 2, 3],
            ]) {
              a.set(...corners[p]);
              b.set(...corners[q]);
              c.set(...corners[r]);
              ab.subVectors(b, a);
              ac.subVectors(c, a);
              normal.crossVectors(ab, ac).normalize();
              if (normal.y < 0) normal.negate();

              const midX = (a.x + b.x + c.x) / 3;
              const midZ = (a.z + b.z + c.z) / 3;
              const name = this.faceMaterial(normal.y, midX, midZ);
              color.set(this.faceColor(name, (a.y + b.y + c.y) / 3, midX, midZ));
              // Type per face, so its edges stay hard; feather and blend per corner, so
              // they interpolate — cover runs out onto bare ground over a couple of
              // metres, and two grown types interleave rather than thinning to a gap.
              const cover = this.faceCover(name, midX, midZ);
              const grows = (COVER_TYPES[COVER_ORDER[cover]] as CoverType).blades !== undefined;
              for (const corner of [a, b, c]) {
                const [feather, neighbor, blend] = this.coverEdge(cover, corner.x, corner.z);
                // Thinned toward the level's edge, where the skirt takes over
                // and nothing grows. See `TerrainOptions.edgeFade`.
                const stand = feather * this.edgeDensity(corner.x, corner.z);
                covers.push(cover, stand, coverSwell(corner.x, corner.z), coverThickness(corner.x, corner.z));
                blends.push(neighbor, blend);
                // The floor under a stand of blades is in their shade. The sampler divides this back out of the tint it reads.
                emit(corner, normal, grows ? 1 - (1 - COVER_FLOOR) * stand : 1);
              }
            }
          }
        }
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    // Ground does not move in the wind. The attribute still has to exist —
    // Phase 7 patches one shared material, and a mesh missing the attribute it
    // reads is a mesh that fails to draw.
    geometry.setAttribute(
      FIELD_ATTRIBUTE,
      new THREE.Float32BufferAttribute(new Float32Array(positions.length), 3),
    );
    // Read by the cover sampler on the CPU and by nothing else. The ground's
    // own material never declares it, so it costs a buffer and no draw.
    geometry.setAttribute(COVER_ATTRIBUTE, new THREE.Float32BufferAttribute(covers, 4));
    geometry.setAttribute(COVER_BLEND_ATTRIBUTE, new THREE.Float32BufferAttribute(blends, 2));

    return finish(geometry, 'terrain', 0);
  }

  /**
   * Height along an edge as a mesh subdivided `level` times would draw it — the
   * stitching primitive. Instead of sampling the surface at `t`, this finds the
   * segment of the coarser neighbour's edge that `t` falls in and interpolates
   * between its endpoints, so a fine vertex lands exactly on the line the
   * neighbour is already drawing.
   */
  private alongEdge(
    x0: number,
    z0: number,
    x1: number,
    z1: number,
    t: number,
    level: number,
  ): number {
    const span = 1 / level;
    const i = Math.min(level - 1, Math.floor(t / span));
    const ta = i * span;
    const tb = ta + span;
    const ha = this.heightAt(x0 + (x1 - x0) * ta, z0 + (z1 - z0) * ta);
    const hb = this.heightAt(x0 + (x1 - x0) * tb, z0 + (z1 - z0) * tb);
    return ha + (hb - ha) * ((t - ta) / span);
  }

  /**
   * Which ground material covers a position. Steep ground overrides whatever is
   * painted on it: a cobbled yard laid across a forty-degree bank is not a cobbled
   * yard, it is a cliff. Making slope win means patches can be drawn carelessly
   * across a hillside and still come out sensible.
   */
  materialAt(x: number, z: number): GroundName {
    if (this.slopeAt(x, z) > this.rockAngle) return 'rock';
    return patchAt(this.patches, x, z) ?? this.paintedAt(x, z) ?? this.base;
  }

  /** What the material raster says here, or nothing where it is unpainted. */
  private paintedAt(x: number, z: number): GroundName | null {
    const raster = this.rasters.paint;
    if (!raster) return null;
    const index = raster.nearest(x, z);
    return index > 0 ? (GROUND_NAMES[index - 1] ?? null) : null;
  }

  /** And the same for cover. */
  private coverPaintedAt(x: number, z: number): CoverName | null {
    const raster = this.rasters.cover;
    if (!raster) return null;
    const index = raster.nearest(x, z);
    return index > 0 ? (COVER_NAMES[index - 1] ?? null) : null;
  }

  /** What the ground here sounds like underfoot. Read per footstep. */
  stepAt(x: number, z: number): SurfaceName {
    return GROUND[this.materialAt(x, z)].step;
  }

  /**
   * What grows here. A painted patch wins over whatever the material grows. The mesh
   * does not read this — `build` asks the same question per face off the face
   * normal — so this is here for the checks and the debug panel.
   */
  coverAt(x: number, z: number): CoverName {
    return (
      coverPatchAt(this.cover, x, z) ??
      this.coverPaintedAt(x, z) ??
      COVER[this.materialAt(x, z)] ??
      'none'
    );
  }

  /**
   * Which material one face is made of. Slope is taken from the face normal rather
   * than resampled, because the normal is what the light will use — deciding a face
   * is turf while shading it as a cliff looks like a bug in the lighting. Answered
   * once for the colour and the cover together.
   */
  private faceMaterial(normalY: number, x: number, z: number): GroundName {
    const slope = (Math.acos(Math.min(1, Math.max(-1, normalY))) * 180) / Math.PI;
    return slope > this.rockAngle
      ? 'rock'
      : (patchAt(this.patches, x, z) ?? this.paintedAt(x, z) ?? this.base);
  }

  /**
   * Colour for one face: its material, jittered, and darkened a little with
   * height so the high ground reads as further away and colder.
   */
  private faceColor(name: GroundName, height: number, x: number, z: number): number {
    const material = GROUND[name];

    // Centred on 1, so variation brightens as often as it darkens and the
    // material's stated colour stays its average.
    const jitter = 1 + (groundJitter(x, z) - 0.5) * material.variation * 2;
    const cooling = 1 - Math.min(Math.max(height / 55, 0), 1) * 0.16;
    return shade(material.color, jitter * cooling);
  }

  /** What one face grows, as a cover type index. A patch wins outright. */
  private faceCover(name: GroundName, x: number, z: number): number {
    const painted = coverPatchAt(this.cover, x, z);
    return COVER_ORDER.indexOf(painted ?? COVER[name] ?? 'none');
  }

  /** The cover at a probe point, and whether a hard-edged patch put it there. */
  private coverThere(x: number, z: number): { index: number; hard: boolean } {
    const patch = coverPatchWinner(this.cover, x, z);
    if (patch) return { index: COVER_ORDER.indexOf(patch.cover), hard: patch.edge === 'hard' };
    const name = COVER[patchAt(this.patches, x, z) ?? this.base] ?? 'none';
    return { index: COVER_ORDER.indexOf(name), hard: false };
  }

  /**
   * What happens to the cover at a corner: [feather, neighbour, blend]. Rings of
   * probes rather than a distance field. Feather thins density, and only toward
   * bare ground, so grass runs out onto a path as a scatter; between two grown
   * types the density holds and `blend` takes over — how much of this corner should
   * be rolled as the neighbouring type, so a boundary is an interleaved band rather
   * than a line or a gap. A `hard` patch opts out of both, from both sides. Slope is
   * left out, so the rock line on a cliff stays hard.
   */
  private coverEdge(cover: number, x: number, z: number): [number, number, number] {
    const own = coverPatchWinner(this.cover, x, z);
    if (own?.edge === 'hard') return [1, 0, 0];

    let same = 0;
    for (let i = 0; i < FEATHER_PROBES; i++) {
      const angle = (i / FEATHER_PROBES) * Math.PI * 2;
      const there = this.coverThere(
        x + Math.cos(angle) * FEATHER_REACH,
        z + Math.sin(angle) * FEATHER_REACH,
      );
      if (there.index === cover || there.index > 0 || there.hard) same++;
    }
    // Remapped so a point on the boundary, where half its ring disagrees, comes
    // out near nothing rather than near half.
    const feather = Math.min(Math.max((same / FEATHER_PROBES - 0.45) / 0.55, 0), 1);

    const votes = new Map<number, number>();
    for (let i = 0; i < BLEND_PROBES; i++) {
      const angle = ((i + 0.5) / BLEND_PROBES) * Math.PI * 2;
      const there = this.coverThere(
        x + Math.cos(angle) * BLEND_REACH,
        z + Math.sin(angle) * BLEND_REACH,
      );
      if (there.index > 0 && there.index !== cover && !there.hard) {
        votes.set(there.index, (votes.get(there.index) ?? 0) + 1);
      }
    }
    let neighbor = 0;
    let best = 0;
    for (const [index, count] of votes) {
      if (count > best) {
        best = count;
        neighbor = index;
      }
    }
    // Capped: a strip narrower than the ring keeps at least half its own kind.
    return [feather, neighbor, Math.min(best / BLEND_PROBES, 0.5)];
  }
}

/** How far out the feather looks, and how many ways. */
const FEATHER_REACH = 0.9;
const FEATHER_PROBES = 8;
/** The blend looks further: an interleaved boundary is a band, not a seam. */
const BLEND_REACH = 1.8;
const BLEND_PROBES = 10;
