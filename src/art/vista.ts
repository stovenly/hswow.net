import * as THREE from 'three';
import { mergeGeometries, mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { createRng, type Rng } from './random';
import { PALETTE, blend, shade } from './palette';
import { FIELD_ATTRIBUTE, FIELD_SWAY, type Facet, type Part } from './assemble';

/**
 * The vista family's grammar. Out-of-bounds scenery is one mass function and a
 * set of profiles rather than a set of unrelated builders: `vistaMass` is the
 * `rock` recipe — weld, displace along normals, squash — at hillside scale, and
 * what separates a hill from a crag from a forest mass is the numbers passed in
 * and the colour function laid over the result. Judged at 100+ metres through
 * heavy fog, so: big triangles, value contrast over hue, and patches of colour
 * instead of patches of geometry.
 */

/**
 * Triangles a single vista builder may spend. Most should sit well under 120 —
 * the whole band is meant to cost less than three birches.
 */
export const VISTA_TRIANGLES = 300;

/**
 * States that a mesh is scenery: out of the collider, out of the sun's shadow box
 * in both directions, no wind, and `ZoneManager.prepare` reads the tag rather
 * than guessing from the shadow box's current size. Sway is zeroed here rather
 * than left to the builders, because amplitude is authored in metres at prop
 * scale and on a hillside the same weights read as an earthquake.
 */
export function markVista<T extends THREE.Object3D>(object: T): T {
  object.userData.vista = true;
  object.userData.noCollide = true;
  object.traverse((node) => {
    node.castShadow = false;
    node.receiveShadow = false;
    if (!(node instanceof THREE.Mesh)) return;
    const fields = node.geometry.getAttribute(FIELD_ATTRIBUTE);
    if (!fields) return;
    const array = fields.array as Float32Array;
    for (let i = FIELD_SWAY; i < array.length; i += 3) array[i] = 0;
    fields.needsUpdate = true;
  });
  return object;
}

export interface MassOptions {
  /** Radius before any squashing, in metres. */
  radius: number;
  /** Icosahedron subdivision. 0 is 20 triangles, 1 is 80, 2 is 320. */
  detail?: number;
  /** How far vertices wander along their own normals, as a fraction of radius. */
  rough?: number;
  /** Vertical scale. Below 1 is a dome, above 1 is a spire. */
  squash?: number;
  /** Scale across Z, for a mass longer one way than the other. */
  stretch?: number;
  /** How much of the mass sits below y = 0. 0 rests on it, 0.5 is half buried. */
  bury?: number;
}

/**
 * A displaced solid — the shared shape every vista builder is cut from. Welded
 * before displacement for `rock`'s reason: an icosahedron is non-indexed, so a
 * corner shared by five faces exists five times over, and displacing the copies
 * independently pulls the solid to pieces.
 */
export function vistaMass(rng: Rng, options: MassOptions): THREE.BufferGeometry {
  const { radius, detail = 1, rough = 0.24, squash = 0.6, stretch = 1, bury = 0.4 } = options;

  const raw = new THREE.IcosahedronGeometry(radius, detail);
  raw.deleteAttribute('normal');
  raw.deleteAttribute('uv');
  const geometry = mergeVertices(raw);
  raw.dispose();

  const position = geometry.getAttribute('position');
  const vertex = new THREE.Vector3();
  for (let i = 0; i < position.count; i++) {
    vertex.fromBufferAttribute(position, i);
    vertex.multiplyScalar(rng.range(1 - rough, 1 + rough));
    position.setXYZ(i, vertex.x, vertex.y, vertex.z);
  }
  position.needsUpdate = true;

  geometry.scale(1, squash, stretch);
  // The mass spans ±`half` about its own centre; this drops it so that `bury`
  // of its height is underground.
  const half = radius * squash;
  geometry.translate(0, half * (1 - 2 * bury), 0);
  geometry.computeVertexNormals();
  return geometry;
}

export interface WashOptions {
  /** Roughly how far the colour takes to drift, in metres. Deliberately large. */
  scale?: number;
  /** Height at which the mass is fully lit. Below it, values fall away. */
  crown?: number;
}

/**
 * A continuous wash of colour across land — no patches, no edges. Indexing into a
 * palette turns a smooth field into hard-edged bands, and since `assemble`
 * evaluates colour per face those bands are drawn along facet boundaries;
 * blending between neighbours instead means adjacent facets differ by a fraction
 * of a step. Three sines at unrelated bearings and incommensurate wavelengths,
 * bunching toward the middle of the palette. The palette should be close — fog
 * compresses hue long before it compresses value.
 */
export function landWash(
  seed: number,
  palette: readonly number[],
  { scale = 140, crown = 0 }: WashOptions = {},
): (x: number, y: number, z: number) => number {
  const rng = createRng(seed);
  const waves = Array.from({ length: 3 }, () => {
    const angle = rng.range(0, Math.PI * 2);
    return {
      ax: Math.cos(angle),
      az: Math.sin(angle),
      length: scale * rng.range(0.55, 1.7),
      phase: rng.range(0, Math.PI * 2),
    };
  });

  return (x, y, z) => {
    let sum = 0;
    for (const wave of waves) {
      sum += Math.sin((x * wave.ax + z * wave.az) / wave.length + wave.phase);
    }
    const t = clamp01(0.5 + sum / 4);
    const span = (palette.length - 1) * t;
    const step = Math.min(palette.length - 2, Math.floor(span));
    const base = blend(palette[step], palette[step + 1], span - step);

    // Value falls toward the foot of the mass, and a couple of percent of
    // per-face wobble on top — small enough not to read as speckle, big enough
    // that the retro pass dithers the gradient instead of banding it.
    const lit = crown > 0 ? 0.82 + clamp01(y / crown) * 0.24 : 1;
    return shade(base, lit * (0.975 + faceJitter(x, z) * 0.05));
  };
}

function clamp01(value: number): number {
  return value > 0 ? (value < 1 ? value : 1) : 0;
}

/** A stable 0..1 draw from a position, at roughly a hand's width. */
function faceJitter(x: number, z: number): number {
  let h = Math.imul(Math.round(x * 7.3), 374761393) ^ Math.imul(Math.round(z * 7.3), 668265263);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

// ---------------------------------------------------------------------------
// vistaRidge

export interface RidgeOptions {
  /**
   * The crest in plan with its height at each point, `[x, z, height]` in metres,
   * three to nine of them. Heights should fall toward both ends; the ridge runs
   * on past each end and under the ground by itself. The face is to the left of
   * travel: a crest laid along +X looks toward +Z.
   */
  crest: readonly (readonly [number, number, number])[];
  /** Metres of run per metre of height, face side and back. */
  face: number;
  back: number;
  /** Rows of quads from crest to foot on each side, two to four. */
  facets?: number;
  /** Metres the last row runs on past the slope's own run, easing it into the ground. */
  foot?: number;
  /** Metres the foot row lies below y = 0, so the edge is buried in the skirt. */
  sink?: number;
  /** Short ridges branching off the face and running down to the foot, zero to three. */
  spurs?: number;
  /** Dips cut into the crest, zero to two. */
  notches?: number;
  /** Displacement along normals, as a fraction of the crest height there. */
  rough?: number;
}

interface Column {
  x: number;
  z: number;
  height: number;
  /** Unit tangent along the crest. */
  tx: number;
  tz: number;
}

/**
 * A crest swept by an asymmetric profile: convex at the shoulder, concave at the
 * foot, one run for the face and another for the back, so a ridge has a front
 * and looks different from either side. Indexed as one strip and displaced
 * along its normals; the foot row is left alone so it stays under the ground.
 */
export function vistaRidge(rng: Rng, options: RidgeOptions): THREE.BufferGeometry {
  const { crest, face, back, facets = 3, foot = 5, sink = 2, spurs = 0, notches = 0, rough = 0.06 } = options;
  if (crest.length < 2) throw new Error('vistaRidge: a crest needs at least two points');

  const columns = crestColumns(rng, crest, notches);
  const strip = sweep(rng, columns, face, back, facets, foot, sink, rough);
  if (spurs <= 0) return strip;

  const pieces = [strip];
  const candidates = columns.slice(1, -1);
  const chosen = new Set<number>();
  for (let n = 0; n < spurs && candidates.length > 0; n++) {
    let index = rng.int(0, candidates.length - 1);
    for (let tries = 0; tries < 4 && chosen.has(index); tries++) index = rng.int(0, candidates.length - 1);
    chosen.add(index);
    const column = candidates[index];
    // Down the face, swung a little off square so two spurs are not parallel.
    const swing = rng.range(-0.35, 0.35);
    const ax = -column.tz;
    const az = column.tx;
    const dx = ax * Math.cos(swing) - az * Math.sin(swing);
    const dz = ax * Math.sin(swing) + az * Math.cos(swing);
    const reach = column.height * face * rng.range(1.0, 1.3);
    const spurCrest: [number, number, number][] = [
      [column.x + dx * reach * 0.1, column.z + dz * reach * 0.1, column.height * 0.8],
      [column.x + dx * reach * 0.55, column.z + dz * reach * 0.55, column.height * rng.range(0.4, 0.55)],
      [column.x + dx * reach, column.z + dz * reach, column.height * 0.12],
    ];
    const run = Math.max(1.4, face * 0.9);
    pieces.push(sweep(rng, crestColumns(rng, spurCrest, 0), run, run, 2, foot, sink, rough));
  }
  const merged = mergeGeometries(pieces, false);
  for (const piece of pieces) piece.dispose();
  if (!merged) throw new Error('vistaRidge: spurs did not share an attribute set');
  return merged;
}

/** The crest resampled into columns, with the notches cut in and a tangent at each. */
function crestColumns(
  rng: Rng,
  crest: readonly (readonly [number, number, number])[],
  notches: number,
): Column[] {
  const along: number[] = [0];
  for (let i = 1; i < crest.length; i++) {
    along.push(along[i - 1] + Math.hypot(crest[i][0] - crest[i - 1][0], crest[i][1] - crest[i - 1][1]));
  }
  const length = along[along.length - 1];

  const at = (s: number): [number, number, number] => {
    let i = 1;
    while (i < crest.length - 1 && along[i] < s) i++;
    const t = along[i] === along[i - 1] ? 0 : (s - along[i - 1]) / (along[i] - along[i - 1]);
    const a = crest[i - 1];
    const b = crest[i];
    return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  };

  const stations: { s: number; point: [number, number, number] }[] = crest.map((point, i) => ({
    s: along[i],
    point: [point[0], point[1], point[2]],
  }));
  for (let n = 0; n < notches; n++) {
    const s = length * rng.range(0.25, 0.75);
    const width = length * rng.range(0.05, 0.1);
    const depth = rng.range(0.3, 0.5);
    const middle = at(s);
    middle[2] *= 1 - depth;
    stations.push({ s: s - width, point: at(s - width) }, { s, point: middle }, { s: s + width, point: at(s + width) });
  }
  stations.sort((a, b) => a.s - b.s);

  return stations.map(({ point }, i) => {
    const before = stations[Math.max(i - 1, 0)].point;
    const after = stations[Math.min(i + 1, stations.length - 1)].point;
    const tx = after[0] - before[0];
    const tz = after[1] - before[1];
    const t = Math.hypot(tx, tz) || 1;
    return { x: point[0], z: point[1], height: point[2], tx: tx / t, tz: tz / t };
  });
}

/**
 * The strip itself. Rows run from the back foot through the crest to the face
 * foot; a virtual column past each end carries the profile down under the
 * ground so the ridge steps down to nothing rather than stopping.
 */
function sweep(
  rng: Rng,
  columns: Column[],
  face: number,
  back: number,
  facets: number,
  foot: number,
  sink: number,
  rough: number,
): THREE.BufferGeometry {
  const rows = facets * 2 + 1;
  const first = columns[0];
  const last = columns[columns.length - 1];
  const endRun = (height: number) => Math.max(height, 2) * (face + back) * 0.35 + foot;
  const virtual = (column: Column, sign: number): Column => {
    const run = endRun(column.height);
    return {
      x: column.x + column.tx * run * sign,
      z: column.z + column.tz * run * sign,
      height: -1,
      tx: column.tx,
      tz: column.tz,
    };
  };
  const all = [virtual(first, -1), ...columns, virtual(last, 1)];
  const cols = all.length;

  const positions = new Float32Array(cols * rows * 3);
  for (let c = 0; c < cols; c++) {
    const column = all[c];
    const buried = column.height < 0;
    // A buried end column takes its width off its neighbour so the end cap has
    // area; every row of it lies at the sink.
    const width = buried ? Math.max(all[c === 0 ? 1 : cols - 2].height * 0.4, 1) : column.height;
    // across is the face side: +Z for a crest along +X.
    const ax = -column.tz;
    const az = column.tx;
    for (let r = 0; r < rows; r++) {
      const j = r - facets;
      const side = j > 0 ? face : back;
      const t = Math.abs(j) / facets;
      const isFoot = Math.abs(j) === facets;
      const distance = (isFoot ? side * width + foot : side * width * t) * Math.sign(j);
      const y = buried || isFoot ? -sink : column.height * (0.5 + 0.5 * Math.cos(Math.PI * t));
      const v = (c * rows + r) * 3;
      positions[v] = column.x + ax * distance;
      positions[v + 1] = y;
      positions[v + 2] = column.z + az * distance;
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setIndex(stripIndex(cols, rows, false));
  geometry.computeVertexNormals();

  const position = geometry.getAttribute('position');
  const normal = geometry.getAttribute('normal');
  for (let c = 1; c < cols - 1; c++) {
    const amount = rough * all[c].height;
    for (let r = 1; r < rows - 1; r++) {
      const i = c * rows + r;
      const d = rng.range(-amount, amount);
      position.setXYZ(
        i,
        position.getX(i) + normal.getX(i) * d,
        position.getY(i) + normal.getY(i) * d,
        position.getZ(i) + normal.getZ(i) * d,
      );
    }
  }
  position.needsUpdate = true;
  geometry.computeVertexNormals();
  return geometry;
}

/**
 * Two triangles per cell of a column-major grid. Rows increasing toward the face
 * side of a crest wind so the normal points up; `flip` for a grid whose rows run
 * the other way.
 */
function stripIndex(cols: number, rows: number, flip: boolean): number[] {
  const index: number[] = [];
  for (let c = 0; c < cols - 1; c++) {
    for (let r = 0; r < rows - 1; r++) {
      const a = c * rows + r;
      const b = (c + 1) * rows + r;
      const d = a + 1;
      const e = b + 1;
      if (flip) index.push(a, b, e, a, e, d);
      else index.push(a, d, e, a, e, b);
    }
  }
  return index;
}

// ---------------------------------------------------------------------------
// vistaBank

export type VistaMaterial =
  | 'pasture'
  | 'hay'
  | 'crop'
  | 'heath'
  | 'wood'
  | 'scrub'
  | 'rock'
  | 'scree'
  | 'sand'
  | 'water'
  | 'hedge';

/** Three close colours each, ordered by value, as `landWash` wants them. */
export const VISTA_MATERIALS: Record<VistaMaterial, readonly [number, number, number]> = {
  pasture: [PALETTE.LEAF_DARK, PALETTE.LEAF, PALETTE.GRASS],
  hay: [PALETTE.LEAF, PALETTE.GRASS, PALETTE.GRASS_DRY],
  crop: [PALETTE.GRASS_DRY, shade(PALETTE.GRASS_DRY, 1.12), shade(PALETTE.LEAF_DRY, 1.35)],
  heath: [
    shade(PALETTE.EARTH, 1.05),
    blend(PALETTE.EARTH, PALETTE.RUST, 0.35),
    blend(PALETTE.LEAF_DRY, PALETTE.RUST, 0.3),
  ],
  wood: [shade(PALETTE.LEAF_DARK, 0.68), shade(PALETTE.LEAF_DARK, 0.85), PALETTE.LEAF_DARK],
  scrub: [shade(PALETTE.LEAF_DARK, 0.8), PALETTE.LEAF_DARK, shade(PALETTE.LEAF_DRY, 0.85)],
  rock: [shade(PALETTE.STONE_DARK, 0.82), PALETTE.STONE_DARK, PALETTE.STONE],
  scree: [PALETTE.STONE_DARK, PALETTE.STONE, PALETTE.STONE_PALE],
  sand: [PALETTE.TIMBER_PALE, shade(PALETTE.TIMBER_PALE, 1.1), shade(PALETTE.TIMBER_PALE, 1.2)],
  water: [PALETTE.WATER, shade(PALETTE.WATER, 1.25), shade(PALETTE.WATER, 1.5)],
  hedge: [shade(PALETTE.LEAF_DARK, 0.58), shade(PALETTE.LEAF_DARK, 0.68), shade(PALETTE.LEAF_DARK, 0.78)],
};

export interface BankBand {
  material: VistaMaterial;
  /** Height range, metres; either end open. */
  above?: number;
  below?: number;
  /** Slope range, radians from horizontal; either end open. */
  steeperThan?: number;
  gentlerThan?: number;
  /** Bearing the face must look toward, within a quarter turn either side. */
  facing?: number;
}

export interface BankOptions {
  /** What every face is unless a band claims it. `fields` is a hedged patchwork. */
  ground: VistaMaterial | 'fields';
  /** Tested in order; the last that fits wins. */
  bands?: readonly BankBand[];
  /** Metres a band's boundary wanders along the slope. */
  wobble?: number;
  /** Height at which the mass is fully lit, as `landWash`. */
  crown?: number;
  /** Metres over which a material's own colour drifts. */
  scale?: number;
  /** Metres across one field, for `fields`. */
  field?: number;
  /** Metres either side of a field boundary that read as hedge. */
  hedge?: number;
}

/**
 * A colour policy over a landform: which material a face is, from its height,
 * slope and aspect, then that material's wash. Costs no triangles — colour is
 * per face already — so the bands land on facet edges like every other colour
 * edge here.
 */
export function vistaBank(
  seed: number,
  options: BankOptions,
): (x: number, y: number, z: number, facet: Facet) => number {
  const { ground, bands = [], wobble = 2, crown = 0, scale = 60, field = 60, hedge = 1.5 } = options;
  const rng = createRng(seed);
  const washes = new Map<VistaMaterial, (x: number, y: number, z: number) => number>();
  const washOf = (material: VistaMaterial) => {
    let wash = washes.get(material);
    if (!wash) {
      wash = landWash(seed ^ (material.length * 0x9e37 + material.charCodeAt(0) * 0x51), VISTA_MATERIALS[material], {
        scale,
        crown,
      });
      washes.set(material, wash);
    }
    return wash;
  };
  const waves = bands.map(() => {
    const angle = rng.range(0, Math.PI * 2);
    return {
      ax: Math.cos(angle),
      az: Math.sin(angle),
      length: rng.range(9, 18),
      phase: rng.range(0, Math.PI * 2),
    };
  });
  const fields = ground === 'fields' ? fieldCells(rng, field, hedge) : null;

  return (x, y, z, facet) => {
    let material: VistaMaterial = fields ? fields(x, z) : (ground as VistaMaterial);
    for (let i = 0; i < bands.length; i++) {
      const band = bands[i];
      const wave = waves[i];
      const w = Math.sin((x * wave.ax + z * wave.az) / wave.length + wave.phase);
      const height = y + wobble * w;
      const slope = facet.slope + 0.08 * w;
      if (band.above !== undefined && height < band.above) continue;
      if (band.below !== undefined && height > band.below) continue;
      if (band.steeperThan !== undefined && slope < band.steeperThan) continue;
      if (band.gentlerThan !== undefined && slope > band.gentlerThan) continue;
      if (band.facing !== undefined && Math.cos(facet.aspect - band.facing) < 0) continue;
      material = band.material;
    }
    return washOf(material)(x, y, z);
  };
}

/**
 * Jittered cells in plan, one of three field materials each, and hedge within
 * reach of the boundary between two.
 */
function fieldCells(rng: Rng, size: number, hedge: number): (x: number, z: number) => VistaMaterial {
  const salt = rng.int(1, 0x7fffffff);
  const crops: VistaMaterial[] = ['pasture', 'hay', 'crop'];
  const hash = (cx: number, cz: number, lane: number) => {
    let h = Math.imul(cx, 374761393) ^ Math.imul(cz, 668265263) ^ Math.imul(lane + 1, 1274126177) ^ salt;
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
  };
  return (x, z) => {
    const cx = Math.floor(x / size);
    const cz = Math.floor(z / size);
    let nearest = Infinity;
    let second = Infinity;
    let pick = 0;
    for (let dx = -1; dx <= 1; dx++) {
      for (let dz = -1; dz <= 1; dz++) {
        const ix = cx + dx;
        const iz = cz + dz;
        const px = (ix + 0.2 + hash(ix, iz, 0) * 0.6) * size;
        const pz = (iz + 0.2 + hash(ix, iz, 1) * 0.6) * size;
        const d = Math.hypot(x - px, z - pz);
        if (d < nearest) {
          second = nearest;
          nearest = d;
          pick = Math.floor(hash(ix, iz, 2) * crops.length);
        } else if (d < second) {
          second = d;
        }
      }
    }
    return second - nearest < hedge * 2 ? 'hedge' : crops[pick];
  };
}

// ---------------------------------------------------------------------------
// vistaWoodEdge

export interface WoodEdgeOptions {
  /** The front line in plan, `[x, z]`, two or more points. A line laid along +X has its wood toward −Z and its face toward +Z. */
  edge: readonly (readonly [number, number])[];
  /** Metres of canopy behind the line. */
  depth: number;
  /** The top wanders between these, metres. */
  low: number;
  high: number;
  /** Metres between columns along the line. */
  spacing?: number;
  /** Single trees standing off the line in front of it, zero to three. */
  standards?: number;
  /** Whether a ride cuts a notch in the wall, down to a third of its height. */
  gap?: boolean;
  /** Metres the foot lies below y = 0. */
  sink?: number;
}

/**
 * A wood from outside: a wall of canopy on a polyline with a slab behind it, the
 * top ragged and crowned every eight to fifteen metres, the front face in two
 * rows so the foot can be darker than the canopy, and standards in front. Comes
 * back as a part, colour and all, since the foot's darkness is part of the shape.
 */
export function vistaWoodEdge(rng: Rng, options: WoodEdgeOptions): Part {
  const { edge, depth, low, high, spacing = 5, standards = 2, gap = false, sink = 2 } = options;
  if (edge.length < 2) throw new Error('vistaWoodEdge: an edge needs at least two points');

  const along: number[] = [0];
  for (let i = 1; i < edge.length; i++) {
    along.push(along[i - 1] + Math.hypot(edge[i][0] - edge[i - 1][0], edge[i][1] - edge[i - 1][1]));
  }
  const length = along[along.length - 1];
  const count = Math.max(2, Math.round(length / spacing) + 1);
  const at = (s: number): [number, number] => {
    let i = 1;
    while (i < edge.length - 1 && along[i] < s) i++;
    const t = along[i] === along[i - 1] ? 0 : (s - along[i - 1]) / (along[i] - along[i - 1]);
    return [
      edge[i - 1][0] + (edge[i][0] - edge[i - 1][0]) * t,
      edge[i - 1][1] + (edge[i][1] - edge[i - 1][1]) * t,
    ];
  };
  const points = Array.from({ length: count }, (_, i) => at((length * i) / (count - 1)));
  const tangentAt = (i: number): [number, number] => {
    const before = points[Math.max(i - 1, 0)];
    const after = points[Math.min(i + 1, count - 1)];
    const tx = after[0] - before[0];
    const tz = after[1] - before[1];
    const t = Math.hypot(tx, tz) || 1;
    return [tx / t, tz / t];
  };

  const heights = points.map(() => rng.range(low, high));
  for (let i = 1; i < count - 1; i++) heights[i] = (heights[i - 1] + heights[i] * 2 + heights[i + 1]) / 4;
  for (let s = rng.range(0, spacing * 2); s < length; s += rng.range(8, 15)) {
    const i = Math.round(s / spacing);
    if (i <= 0 || i >= count - 1) continue;
    const lift = rng.range(1, 2);
    heights[i] += lift;
    heights[i - 1] += lift * 0.4;
    heights[i + 1] += lift * 0.4;
  }
  if (gap && count >= 5) {
    const i = rng.int(Math.floor(count / 3), Math.floor((count * 2) / 3) - 1);
    heights[i] = low / 3;
    heights[i + 1] = low / 3;
  }

  const foot = low * 0.3;
  const rows = 5;
  const cols = count + 2;
  const endRun = 3;
  const positions = new Float32Array(cols * rows * 3);
  for (let c = 0; c < cols; c++) {
    const i = Math.min(Math.max(c - 1, 0), count - 1);
    const buried = c === 0 || c === cols - 1;
    const [tx, tz] = tangentAt(i);
    // in points into the wood: −Z for a line along +X.
    const ix = tz;
    const iz = -tx;
    const sign = c === 0 ? -1 : 1;
    const px = points[i][0] + (buried ? tx * endRun * sign : 0);
    const pz = points[i][1] + (buried ? tz * endRun * sign : 0);
    const h = heights[i];
    // Rows: front foot, front mid, front top leaning out, back top, back foot.
    const profile: [number, number][] = buried
      ? [
          [0, -sink],
          [0, -sink],
          [-0.8, -sink],
          [depth * 0.55, -sink],
          [depth, -sink],
        ]
      : [
          [0, -sink],
          [0, foot],
          [-0.8, h],
          [depth * 0.55, h * 0.92],
          [depth, -sink],
        ];
    for (let r = 0; r < rows; r++) {
      const [d, y] = profile[r];
      const v = (c * rows + r) * 3;
      positions[v] = px + ix * d;
      positions[v + 1] = y;
      positions[v + 2] = pz + iz * d;
    }
  }
  const wall = new THREE.BufferGeometry();
  wall.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  wall.setIndex(stripIndex(cols, rows, true));
  wall.computeVertexNormals();

  const pieces: THREE.BufferGeometry[] = [wall];
  for (let n = 0; n < standards; n++) {
    const i = rng.int(1, count - 2);
    const stand = rng.range(3, 7);
    const [tx, tz] = tangentAt(i);
    // Out of the wood is the other way from in.
    const x = points[i][0] - tz * stand + rng.range(-2, 2);
    const z = points[i][1] + tx * stand;
    const height = rng.range(low * 0.7, low * 1.05);
    const trunkTop = height * 0.4;
    const trunk = new THREE.CylinderGeometry(0.35, 0.6, trunkTop + 1, 3, 1, true);
    trunk.deleteAttribute('uv');
    trunk.translate(x, trunkTop / 2, z);
    pieces.push(trunk);
    const crown = vistaMass(rng, {
      radius: (height - trunkTop) * 0.5,
      detail: 0,
      rough: rng.range(0.18, 0.28),
      squash: rng.range(0.8, 1.05),
      stretch: rng.range(0.85, 1.2),
      bury: 0.15,
    });
    crown.rotateY(rng.range(0, Math.PI * 2));
    crown.translate(x, trunkTop, z);
    pieces.push(crown);
  }
  const geometry = pieces.length > 1 ? mergeGeometries(pieces, false) : wall;
  if (!geometry) throw new Error('vistaWoodEdge: pieces did not share an attribute set');
  if (geometry !== wall) for (const piece of pieces) piece.dispose();

  const wash = landWash(rng.int(1, 0x7fffffff), VISTA_MATERIALS.wood, { scale: rng.range(30, 60), crown: high });
  return {
    geometry,
    color: (x, y, z, facet) => {
      const base = wash(x, y, z);
      if (y < foot && facet.slope > 1.1) return shade(base, 0.62);
      if (facet.slope < 0.5) return shade(base, 1.06);
      return base;
    },
    sway: 0,
  };
}
