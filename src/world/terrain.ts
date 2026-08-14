import * as THREE from 'three';
import { SWAY_ATTRIBUTE, finish } from '../art/assemble';
import { COVER_ATTRIBUTE, COVER_BLEND_ATTRIBUTE } from '../art/cover';
import { shade } from '../art/palette';
import {
  GROUND,
  COVER,
  COVER_ORDER,
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

/**
 * Authored terrain: a heightfield summed from placed landforms.
 *
 * **Not noise.** The locked design says the exterior is hand-authored, and this
 * is how: every bump in the ground is a shape somebody put there on purpose,
 * listed in data. A hill is a position, a radius and a height. Building the
 * field is just adding those up.
 *
 * The alternative was a grid of control points — sixteen by sixteen, or two
 * hundred and fifty-six numbers, and a bigger zone needs proportionally more.
 * That is unreadable to edit and impossible to review: nobody can look at a
 * block of decimals and see a valley in it. Landforms are legible as text,
 * cheap to move, and they are the same list a Phase 6 editor would drag around.
 *
 * ## The rim is the boundary
 *
 * There is no invisible wall and no fence. The `rim` landform lifts the outer
 * ring of the map past the controller's slope limit, so walking at the edge of
 * the world means walking up a slope that gets steeper until you slide back
 * down it. That is the "ringed by natural barriers" in the design, made of the
 * same triangles as everything else — nothing special in the collider, nothing
 * to fall through, and it looks like hills because it is hills.
 *
 * The check asserts it actually holds: a ray of samples inward from every point
 * around the boundary has to cross at least one stretch steeper than the limit.
 */

export type Landform =
  /** A rounded rise. `falloff` above 1 makes it peakier, below 1 flatter-topped. */
  | { kind: 'hill'; at: [number, number]; radius: number; height: number; falloff?: number }
  /** A raised line between two points — an esker, a spine, a bank. */
  | { kind: 'ridge'; from: [number, number]; to: [number, number]; width: number; height: number }
  /** A rounded hollow. Somewhere to put things. */
  | { kind: 'basin'; at: [number, number]; radius: number; depth: number }
  /**
   * The wall of hills around the edge.
   *
   * `inset` is how far in from the boundary it starts climbing — short insets
   * give steep, cliff-like sides, long ones give a gentle bowl you can walk a
   * long way up before it turns you back.
   *
   * **`outline` is what makes a level any shape but square.** Without it the rim
   * is measured by Chebyshev distance to the field's own edge, so it follows the
   * square the heightfield happens to be stored in — and every level is
   * therefore a square bowl, whatever is drawn inside it. Given an outline it
   * measures from that instead, so a winding valley or an L-shaped glen is
   * walled by its own hills along its own shape.
   *
   * The outline is a `PatchShape[]`, the same union the ground patches, the
   * cover patches, the level's own boundary and the parallax keep-out are all
   * written in — so the shape a level *is* can be stated once and used by all of
   * them, rather than being implied by the size of the array it lives in.
   */
  | { kind: 'rim'; inset: number; height: number; outline?: readonly PatchShape[] }
  /**
   * A one-sided step: level on one side, level on the other, a bank between.
   *
   * **The primitive every boundary actually wants, and the one that was
   * missing.** `ridge` rises to a crest and falls off *both* ways, so it can
   * make a mound and never an edge — a path laid beside one runs between two
   * lumps. A scarp is what the side of a shelf cut into a hillside is, and the
   * side of a river terrace, and the top of a quarried bank: the ground beyond
   * it is simply higher, and stays higher.
   *
   * `run` is the horizontal distance the step takes, centred on the line, so the
   * bank is `run` wide and `height` tall — which is also how to make it a cliff
   * rather than a slope. `side` says which way is up: +1 raises the left of the
   * direction of travel, −1 the right.
   *
   * **It dies out past its ends**, over `run` — but not sideways, and the
   * difference is the whole of `reach`.
   *
   * Without `reach` the high side stays high for ever. That is what a scarp
   * *is*: the ground beyond a shelf cut into a hillside does not come back
   * down, it goes on being a hillside. Use it for the boundary between two
   * levels of a place.
   *
   * With `reach` it is a **bank**: high for that many metres and then easing
   * back to whatever the ground was doing, over another `run`. Use it for the
   * lip of a lane, or a headland along a field edge — anywhere the step is a
   * feature standing in the ground rather than a change to the ground.
   *
   * It is also the difference between a landform the broad phase can bound and
   * one it cannot. A scarp with no `reach` is asked at every point in the field,
   * because it genuinely does affect every point in the field; one with a
   * `reach` is bucketed like everything else. On a level with a bank along every
   * path that is the difference between the index working and the index being
   * decorative — so say `reach` unless the half-plane is what you meant.
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
   *
   * `ridge` inverted, and the strongest thing in the vocabulary for saying *you
   * are on a route* — because the banks cost nothing. They are not raised; they
   * are simply the ground that was not lowered, which means a channel drawn
   * across any terrain produces sides that match whatever was already there.
   *
   * `width` is the flat bottom; `bank` is how far either side the ground climbs
   * back to where it was. A holloway is a narrow bottom and a short bank; a dry
   * valley is a wide one and a long bank.
   *
   * `rockAngle` then paints the steep faces as stone with nothing further being
   * said, which is most of why an authored cut looks like an eroded one.
   */
  | {
      kind: 'channel';
      through: readonly (readonly [number, number])[];
      width: number;
      depth: number;
      bank: number;
    }
  /**
   * Level ground, for building on.
   *
   * **The one landform that is not additive.** Everything else adds to the
   * height; this *replaces* it, forcing the ground to `height` inside its shape
   * and easing back to whatever the rest of the landforms wanted over `blend`.
   *
   * It exists because buildings are rigid and ground is not. A hut is placed at
   * a single point and stands square, so on ground that falls even a little
   * across its footprint one corner buries itself and the opposite corner
   * floats — which is exactly what happened to the first village. Nudging the
   * placement cannot fix that; the building needs somewhere flat to be, so the
   * flat place is authored like anything else.
   *
   * Applied after the additive pass, in list order, so a later terrace can cut
   * a step into an earlier one.
   *
   * **A circle or a shape, and the shape form is what roads want.** A street is
   * a ribbon, and levelling one with a chain of overlapping discs gives it a
   * scalloped edge and a height that ripples along its length. Stated as a
   * `path` it is flat for its whole run and blends the same distance out
   * everywhere. The two forms are one landform because they do the same thing;
   * `at`/`radius` stays because most terraces genuinely are a circle and saying
   * so is shorter than wrapping one in a `blot`.
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

export interface TerrainOptions {
  /** Metres across. The field is square and centred on the origin. */
  size: number;
  /** Metres per quad. Also the collision resolution — they are the same mesh. */
  resolution: number;
  landforms: readonly Landform[];
  /**
   * Places the grid is subdivided further.
   *
   * One resolution for a whole map is a compromise made everywhere at once:
   * fine enough for a two-metre street to have straight edges is far finer than
   * a bare hillside will ever need, and paying for it across the map is most of
   * the cost for none of the benefit. A village square wants sub-metre quads,
   * the hills behind it do not care, and this is how to say so.
   *
   * **Put the edges of these on gentle ground.** Stitching closes the geometric
   * seam — there is no gap — but nothing can hide a change in *facet size* on a
   * steep slope: big facets and small facets approximate a curve with different
   * normals, and under flat shading two different normals meeting along a line
   * is a line you can see. On flat ground every facet points straight up
   * whatever its size, so the boundary vanishes. A ring that happened to cross
   * the map's rim at 61° drew exactly this, and it looked like a crack.
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
   * Cover painted over the automatic result. Later patches win.
   *
   * Most ground grows what its material says it grows — see `COVER` in
   * `world/ground.ts`. This is for the cases a material cannot state: clover in
   * one hollow, moss along one wall, a clearing trodden bare.
   */
  cover?: readonly CoverPatch[];
  /** Slope in degrees past which a face falls back to rock, whatever is painted. */
  rockAngle?: number;
  /** What unpainted, unsteep ground is made of. */
  base?: GroundName;
  /**
   * Thins ground cover to nothing over the last stretch before the level's edge.
   *
   * **Because cover ending in a line is the loudest seam a vista has.** Beyond
   * the boundary the skirt takes over, and the skirt grows nothing — so a field
   * of grass that keeps full density right up to the last quad simply stops,
   * and the eye reads the exact shape of the playable area. Ramped to zero over
   * a band, the grass runs out the way it runs out onto a path, and where the
   * level ends stops being a fact the player can see.
   *
   * `band` is metres, measured inward from `outline` — which defaults to the
   * field's own square. A winding level states its shape here and the cover
   * fades along the whole of it.
   *
   * Density only. The ground *material* is unchanged, so what is underfoot and
   * what colour the face is painted do not move with it.
   */
  edgeFade?: { band: number; outline?: readonly PatchShape[] };
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
 * Where a point stands relative to a run of line segments.
 *
 * Three numbers, because the two landforms written against a polyline want
 * different ones and neither wants only a distance.
 *
 * - `near` — shortest distance to the run, ends included. What a channel is
 *   measured by, and what decides which segment the other two answers come from.
 * - `side` — `near` again, signed. The **magnitude** is the distance to the run
 *   and the **sign** is which side of the nearest segment's infinite line the
 *   point is on, so which way is up does not flip because you walked past a
 *   vertex. Its sign is that of `dx·(z − a.z) − dz·(x − a.x)` for the winning
 *   segment `a → b` — which is to say it depends on the direction the points are
 *   listed in, and flipping `side` on the landform is the quick way to swap it.
 *
 *   **Magnitude from the segment and sign from its line, rather than both from
 *   the line.** Taking both from the line reads correctly beside the run and
 *   wrongly everywhere else: past an interior corner, the segment you have just
 *   left is still the nearest one and its infinite line runs off into open
 *   ground, so a scarp measured that way holds its full height a hundred metres
 *   away in the direction that segment happened to point. Which is also a lie to
 *   the broad phase, and how it was found.
 * - `past` — how far beyond the first or last vertex, measured *along* the run.
 *   Zero anywhere beside it, including at an interior corner. This is what lets
 *   a scarp die out at its ends instead of stepping an entire half-plane.
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
 * How far a landform can possibly reach, for the broad phase.
 *
 * `null` means "everywhere", and it is not a failure to answer — a rim is
 * genuinely a fact about the whole field, and a terrace is handled in the second
 * pass. Anything that returns null is simply asked every time, exactly as the
 * whole list used to be.
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
    // **A scarp with no `reach` is unbounded and has to say so.** Its high side
    // stays high for ever, so any circle drawn round it is a claim that points
    // outside are unaffected — which is false, and false by the full height of
    // the step. This was a bug for exactly as long as it took to compare the
    // bucketed field against a per-form sum.
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
  private readonly base: GroundName;
  private readonly edgeFade: number;
  private readonly edgeOutline: readonly PatchShape[];

  /**
   * The broad phase: which landforms can possibly matter in which cell.
   *
   * `heightAt` is called once per vertex when the mesh is built and again for
   * every prop dropped onto the ground, and it used to walk the whole landform
   * list each time. That is fine for the eight forms a hand-written zone has and
   * it is the wrong shape for what this is growing into: a terraformed level is
   * fifty to two hundred forms, and the cost is the product of the two. Walking
   * a list is also exactly the sort of thing that is invisible until an editor
   * makes it easy to add the hundredth hill, at which point it is a retrofit
   * rather than a decision.
   *
   * Deliberately coarse — a couple of dozen cells across at most. The job is to
   * skip the forms that are nowhere near, not to be exact about the ones that
   * are, and a fine grid costs memory and buys nothing because the per-form test
   * is a few multiplies anyway.
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
      // **Anything that is not comfortably inside the field goes in `always`.**
      // A bucketed form has to be wholly within the grid for the converse to
      // hold — that a query outside the grid cannot be reached by anything in
      // it — and that converse is what makes the whole scheme correct rather
      // than merely fast.
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
   * How much cover survives here, 0 at the level's edge and 1 a band inward.
   *
   * Smootherstep rather than linear: a linear ramp puts its sharpest change in
   * density right where the fade begins, which draws a line of its own a band's
   * width inside the one it was meant to hide.
   */
  private edgeDensity(x: number, z: number): number {
    if (this.edgeFade <= 0) return 1;
    return ease(-outlineDistance(this.edgeOutline, x, z) / this.edgeFade);
  }

  /**
   * Ground height at a world position.
   *
   * The authority for everything: the mesh is sampled from it, props are
   * dropped onto it, and the checks measure it. Cheap enough to call per prop
   * per build — it is a handful of distance calculations — but it is called
   * once per vertex when building the mesh, so nothing expensive belongs here.
   */
  heightAt(x: number, z: number): number {
    let height = 0;

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
        // Distance in from the boundary, whichever boundary that is.
        //
        // Without an outline it is the **Chebyshev** distance to the field's own
        // square edge, so the rim follows that square instead of being a circle
        // inscribed in it — which would leave four walkable corners straight out
        // of the map.
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

  /**
   * What unpainted ground here is made of.
   *
   * Exported so the skirt can take its colour from the level rather than being
   * told it twice — a distant field that does not match the near one puts a
   * value step exactly on the boundary the whole band exists to hide.
   */
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
   * Builds the visible and collidable mesh. They are the same triangles.
   *
   * Split into two meshes would mean the player walking on a surface they
   * cannot see the shape of, which on a slope is the difference between a hill
   * and a bug report.
   *
   * ## Variable density, and the seams it would otherwise open
   *
   * Cells inside a `detail` region are subdivided. That is the only way to get a
   * straight-edged two-metre street without paying for sub-metre quads across a
   * whole map of empty hillside — at the base resolution a street is about one
   * quad wide and its edges zigzag along whatever the grid happened to do, which
   * is what makes a village square look like a pile of triangles.
   *
   * Subdividing unevenly opens **T-junctions**. A fine cell has vertices along
   * its border that its coarse neighbour has never heard of, and since those
   * vertices sit on the true surface while the neighbour's edge is a straight
   * line between two corners, any curvature pulls them apart and daylight shows
   * through the crack.
   *
   * The fix is to make border vertices lie. A vertex on an edge shared with a
   * coarser neighbour takes its height from *that edge as the neighbour draws
   * it*, interpolated between the neighbour's own samples, rather than from the
   * surface. Both sides then describe the same line and meet exactly. Corners
   * need no special case: at either end of an edge the interpolation lands on a
   * real sample anyway.
   *
   * Built by hand rather than through `assemble`, because face colour here
   * depends on the face *normal* — flat ground is turf, steep ground is rock —
   * and `assemble` only offers the centroid position.
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

    const emit = (p: THREE.Vector3, n: THREE.Vector3): void => {
      positions.push(p.x, p.y, p.z);
      normals.push(n.x, n.y, n.z);
      colors.push(color.r, color.g, color.b);
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
              // Type per face, so its edges stay hard; feather and blend per
              // corner, so they interpolate — cover runs out onto bare ground
              // over a couple of metres, and two grown types interleave at
              // their boundary instead of thinning to a gap.
              const cover = this.faceCover(name, midX, midZ);
              for (const corner of [a, b, c]) {
                const [feather, neighbor, blend] = this.coverEdge(cover, corner.x, corner.z);
                covers.push(
                  cover,
                  // Thinned toward the level's edge, where the skirt takes over
                  // and nothing grows. See `TerrainOptions.edgeFade`.
                  feather * this.edgeDensity(corner.x, corner.z),
                  coverSwell(corner.x, corner.z),
                  coverThickness(corner.x, corner.z),
                );
                blends.push(neighbor, blend);
              }
              emit(a, normal);
              emit(b, normal);
              emit(c, normal);
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
      SWAY_ATTRIBUTE,
      new THREE.Float32BufferAttribute(new Float32Array(positions.length / 3), 1),
    );
    // Read by the cover sampler on the CPU and by nothing else. The ground's
    // own material never declares it, so it costs a buffer and no draw.
    geometry.setAttribute(COVER_ATTRIBUTE, new THREE.Float32BufferAttribute(covers, 4));
    geometry.setAttribute(COVER_BLEND_ATTRIBUTE, new THREE.Float32BufferAttribute(blends, 2));

    return finish(geometry, 'terrain', 0);
  }

  /**
   * Height along an edge as a mesh subdivided `level` times would draw it.
   *
   * The stitching primitive. Instead of sampling the surface at `t`, this finds
   * the segment of the coarser neighbour's edge that `t` falls in and
   * interpolates between its endpoints — so a fine vertex lands exactly on the
   * straight line the neighbour is already drawing, and the seam closes.
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
   * Which ground material covers a position.
   *
   * Steep ground overrides whatever is painted on it. That is not a shortcut:
   * a cobbled yard laid across a forty-degree bank is not a cobbled yard, it is
   * a cliff, and a path drawn straight up one should turn to rock where it gets
   * too steep to have been laid. Making slope win means patches can be drawn
   * carelessly across a hillside and still come out looking sensible.
   */
  materialAt(x: number, z: number): GroundName {
    if (this.slopeAt(x, z) > this.rockAngle) return 'rock';
    return patchAt(this.patches, x, z) ?? this.base;
  }

  /** What the ground here sounds like underfoot. Read per footstep. */
  stepAt(x: number, z: number): SurfaceName {
    return GROUND[this.materialAt(x, z)].step;
  }

  /**
   * What grows here. A painted patch wins over whatever the material grows.
   *
   * The mesh does not read this — `build` asks the same question per face off
   * the face normal, which is cheaper and cannot disagree with the shading. It
   * is here so the checks and the debug panel can ask without a mesh.
   */
  coverAt(x: number, z: number): CoverName {
    return coverPatchAt(this.cover, x, z) ?? COVER[this.materialAt(x, z)] ?? 'none';
  }

  /**
   * Which material one face is made of.
   *
   * Slope is taken from the face normal rather than resampled, because the
   * normal is what the light will actually use — deciding a face is turf while
   * shading it as a cliff is the sort of disagreement that looks like a bug in
   * the lighting. Asked once per face and answered for the colour and the
   * cover together, so the grass cannot disagree with the ground it stands on.
   */
  private faceMaterial(normalY: number, x: number, z: number): GroundName {
    const slope = (Math.acos(Math.min(1, Math.max(-1, normalY))) * 180) / Math.PI;
    return slope > this.rockAngle ? 'rock' : (patchAt(this.patches, x, z) ?? this.base);
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
   * What happens to the cover at a corner: [feather, neighbour, blend].
   *
   * Rings of probes rather than a distance field — enough to know what
   * surrounds a point. Feather thins density, and only toward *bare* ground,
   * so grass runs out onto a path as a scatter; between two grown types the
   * density holds and `blend` takes over — how much of this corner's cover
   * should be rolled as the neighbouring type instead, so a boundary is an
   * interleaved band rather than a line or a gap. A `hard` patch opts out of
   * both, from both sides. Slope is left out, so the rock line on a cliff
   * stays hard — it is a cliff.
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
