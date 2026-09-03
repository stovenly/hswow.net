import * as THREE from 'three';
import { assemble, finish, type Part } from '../art/assemble';
import { createRng, type Rng } from '../art/random';
import { PALETTE, blend, shade } from '../art/palette';
import { stoneColours } from '../art/masonry';
import { markCollidable } from '../player/Collider';
import { GROUND } from './ground';
import type { SurfaceName } from '../audio/models/footsteps';
import type { GroundAt, Point } from './placement';

// A track: the surface of a path as geometry, draped on the ground along a polyline.

export type TrackSurface = 'cobble' | 'flagstone' | 'gravel' | 'dirt' | 'boards';
export type TrackEdge = 'kerb' | 'verge' | 'none';

export interface TrackOptions {
  through: readonly Point[];
  width: number;
  surface: TrackSurface;
  edge?: TrackEdge;
  /** 0..1 */
  wear?: number;
  seed: number;
  groundAt: GroundAt;
  /** sRGB hex of the ground beside the track, which a dirt verge blends into. */
  beside: number;
  /**
   * Metres above the ground the skin must reach at an end that meets a
   * junction, which the profile eases into over the last width of the strip.
   * See `trackNetwork.ts`.
   */
  ends?: { start?: number; end?: number };
}

/** A track built for the network: its group, the line it was built on, and — for a stone surface — the strip the network paves. */
export interface BuiltTrack {
  group: THREE.Group;
  samples: Sample[];
  stone?: StoneStrip;
}

/** A strip of the stone paving: where it runs, how high its skin stands, and how it is cut. */
export interface StoneStrip {
  samples: Sample[];
  profile: Profile;
  /** Metres in from the edge the stones stop, for a kerb. */
  inset: number;
  surface: 'cobble' | 'flagstone';
}

/** A junction of the stone paving: its ring, and the height its skin stands at. */
export interface StoneRing {
  ring: readonly (readonly [number, number])[];
  lift: number;
  surface: 'cobble' | 'flagstone';
}

export function isStone(surface: TrackSurface): surface is 'cobble' | 'flagstone' {
  return surface === 'cobble' || surface === 'flagstone';
}

/** Where the skin stands above the ground at the middle of a surface, which is what a junction is levelled to. */
export function liftOf(surface: TrackSurface, width: number): number {
  return surface === 'boards' ? BOARD_LIFT : LIFT + CROWN * width;
}

export const TRACK_SURFACES: readonly TrackSurface[] = ['cobble', 'flagstone', 'gravel', 'dirt', 'boards'];

const UNDERFOOT: Record<TrackSurface, SurfaceName> = {
  cobble: 'cobble-fixed',
  flagstone: 'stone',
  gravel: 'gravel',
  dirt: 'soil',
  boards: 'wood',
};

/** Metres between samples along the centreline. */
const STEP = 0.5;
/** Metres over which the edge wobble dies away toward a junction, so the end row is the stated width. */
const WOBBLE_FADE = 2;
/** Lateral stations, as fractions of the half width. */
const STATIONS = [-1, -0.75, -0.5, -0.25, 0, 0.25, 0.5, 0.75, 1];
/** Metres the crown stands above the ground, per metre of width. */
const CROWN = 0.014;
const LIFT = 0.025;
const KERB_WIDTH = 0.18;
const SETT_HEIGHT = 0.045;
const BOARD_LIFT = 0.12;

export interface Sample {
  x: number;
  z: number;
  /** Unit tangent. */
  tx: number;
  tz: number;
  /** Unit normal, to the left of travel. */
  nx: number;
  nz: number;
  /** Half width here, after the wobble. */
  half: number;
  /** Metres along. */
  s: number;
}

const BED_MATERIAL = new THREE.MeshBasicMaterial();

/**
 * The track as a group: a visible skin, and — for the surfaces made of pieces —
 * an unseen level bed at the top of those pieces, so walking a cobbled lane is
 * walking a lane and not three thousand stones.
 */
export function buildTrack(options: TrackOptions): THREE.Group {
  return buildTrackWith(options).group;
}

export function buildTrackWith(options: TrackOptions): BuiltTrack {
  const rng = createRng(options.seed);
  const wear = Math.min(1, Math.max(0, options.wear ?? 0.5));
  const ends = options.ends ?? {};
  const samples = sampleLine(options.through, options.width, rng, ends.start !== undefined, ends.end !== undefined);
  const group = new THREE.Group();
  if (samples.length < 2) return { group, samples };

  const surface = options.surface;
  const underfoot = UNDERFOOT[surface];
  const parts: Part[] = [];
  let bedTop = 0;
  let stone: StoneStrip | undefined;
  const eased = (profile: Profile): Profile => easeEnds(profile, samples, ends, options.width);

  switch (surface) {
    case 'dirt': {
      const profile = eased(ruttedProfile(options.width, 0.03 + 0.04 * wear));
      const dirt = GROUND.dirt.color;
      const crown = shade(dirt, 1 + 0.1 * wear);
      const bands = (u: number): number => {
        const a = Math.abs(u);
        if (a > 0.875) return blend(dirt, options.beside, 0.6);
        if (a > 0.625) return blend(dirt, options.beside, 0.25);
        if (a > 0.375) return shade(dirt, 0.92);
        return crown;
      };
      parts.push(...ribbon(samples, options.groundAt, profile, bands));
      parts.push(...embeddedStones(samples, options.groundAt, profile, rng, 0.35));
      break;
    }
    case 'gravel': {
      const profile = eased(ruttedProfile(options.width, 0.015 + 0.02 * wear));
      const gravel = GROUND.gravel.color;
      const seed = options.seed;
      parts.push(
        ...ribbon(samples, options.groundAt, profile, () => gravel, (x, _y, z) =>
          shade(gravel, 0.9 + 0.2 * hash(x, z, seed)),
        ),
      );
      parts.push(...pebbles(samples, options.groundAt, profile, rng));
      break;
    }
    // The stones themselves are the network's: one paving over every stone
    // strip and junction, so a joint never lines up with a strip's end.
    case 'cobble':
    case 'flagstone': {
      const profile = eased(crownProfile(options.width));
      const kerb = options.edge === 'kerb';
      if (kerb) parts.push(...kerbs(samples, options.groundAt, profile, rng));
      stone = { samples, profile, inset: kerb ? KERB_WIDTH : 0, surface };
      bedTop = bedTopOf(surface);
      break;
    }
    case 'boards': {
      parts.push(...boardwalk(samples, options.groundAt, rng, wear));
      bedTop = BOARD_LIFT;
      break;
    }
  }

  if (parts.length > 0) {
    const skin = finish(assemble(parts), `track-${surface}`, 0, underfoot);
    skin.name = 'track';
    skin.userData.ground = true;
    // The strip's print on the cover mask: bare under the track, thinning over the verge.
    skin.userData.footprint = samples.map((sample) => [sample.x, sample.z, sample.half]);
    skin.userData.footprintSoft = options.edge === 'verge' ? 0.9 : 0.3;
    group.add(markCollidable(skin));
  }

  if (bedTop > 0) {
    const profile = surface === 'boards' ? flatProfile() : eased(crownProfile(options.width));
    const bed = new THREE.Mesh(
      ribbonGeometry(samples, options.groundAt, (u, i) => profile(u, i) + bedTop, [-1, 1]),
      BED_MATERIAL,
    );
    bed.visible = false;
    bed.userData.underfoot = underfoot;
    group.add(markCollidable(bed));
  }
  return { group, samples, stone };
}

/** Metres above the skin the pieces of a surface stand, which is where its bed is. */
function bedTopOf(surface: TrackSurface): number {
  switch (surface) {
    case 'cobble':
      return SETT_HEIGHT - SINK;
    case 'flagstone':
      return 0.06 - SINK;
    case 'boards':
      return BOARD_LIFT;
    default:
      return 0;
  }
}

// --- the line ---------------------------------------------------------------

function sampleLine(through: readonly Point[], width: number, rng: Rng, fadeStart = false, fadeEnd = false): Sample[] {
  const points = through.filter(
    (p, i) => i === 0 || Math.hypot(p[0] - through[i - 1][0], p[1] - through[i - 1][1]) > 1e-3,
  );
  if (points.length < 2) return [];
  const raw: { x: number; z: number; s: number }[] = [];
  let s = 0;
  for (let i = 0; i + 1 < points.length; i++) {
    const [ax, az] = points[i];
    const [bx, bz] = points[i + 1];
    const length = Math.hypot(bx - ax, bz - az);
    const steps = Math.max(1, Math.round(length / STEP));
    for (let k = 0; k < steps; k++) {
      const t = k / steps;
      raw.push({ x: ax + (bx - ax) * t, z: az + (bz - az) * t, s: s + length * t });
    }
    s += length;
  }
  const last = points[points.length - 1];
  raw.push({ x: last[0], z: last[1], s });

  // Two waves that do not divide, so the edge wanders and never repeats.
  const wobble = [
    { length: rng.range(5, 8), phase: rng.range(0, Math.PI * 2), amount: 0.07 },
    { length: rng.range(1.7, 2.6), phase: rng.range(0, Math.PI * 2), amount: 0.04 },
  ];
  return raw.map((p, i) => {
    const before = raw[Math.max(0, i - 1)];
    const after = raw[Math.min(raw.length - 1, i + 1)];
    let tx = after.x - before.x;
    let tz = after.z - before.z;
    const length = Math.hypot(tx, tz) || 1;
    tx /= length;
    tz /= length;
    let wander = 0;
    for (const wave of wobble) wander += wave.amount * Math.sin((p.s / wave.length) * Math.PI * 2 + wave.phase);
    if (fadeStart) wander *= Math.min(1, p.s / WOBBLE_FADE);
    if (fadeEnd) wander *= Math.min(1, (s - p.s) / WOBBLE_FADE);
    return { x: p.x, z: p.z, tx, tz, nx: -tz, nz: tx, half: (width / 2) * (1 + wander), s: p.s };
  });
}

/** Where a station stands, in plan. */
function at(sample: Sample, u: number): [number, number] {
  return [sample.x + sample.nx * sample.half * u, sample.z + sample.nz * sample.half * u];
}

/** The skin's row of stations at a sample, which is what a junction takes up as one of its arms. */
export function rowOf(sample: Sample): [number, number][] {
  return STATIONS.map((u) => at(sample, u));
}

// --- profiles ---------------------------------------------------------------

/** Height of the skin above the ground at station `u`, metres. */
type Profile = (u: number, i: number) => number;

function crownProfile(width: number): Profile {
  const crown = CROWN * width;
  return (u) => (Math.abs(u) >= 1 ? 0.004 : LIFT + crown * (1 - u * u));
}

function ruttedProfile(width: number, depth: number): Profile {
  const crown = CROWN * width;
  return (u) => {
    if (Math.abs(u) >= 1) return 0.004;
    const d = (Math.abs(u) - 0.5) / 0.14;
    return LIFT + crown * (1 - u * u) - depth * Math.exp(-d * d);
  };
}

function flatProfile(): Profile {
  return () => 0;
}

/** The profile as it is along the strip, levelled to a junction's lift over the last `width` metres at either end that has one. */
function easeEnds(profile: Profile, samples: Sample[], ends: { start?: number; end?: number }, width: number): Profile {
  if (ends.start === undefined && ends.end === undefined) return profile;
  const length = samples[samples.length - 1].s;
  const reach = Math.max(width, 0.5);
  return (u, i) => {
    const s = samples[Math.min(i, samples.length - 1)].s;
    let value = profile(u, i);
    if (ends.start !== undefined) {
      const t = Math.min(1, s / reach);
      value += (ends.start - value) * (1 - t * t * (3 - 2 * t));
    }
    if (ends.end !== undefined) {
      const t = Math.min(1, (length - s) / reach);
      value += (ends.end - value) * (1 - t * t * (3 - 2 * t));
    }
    return value;
  };
}

// --- the ribbon -------------------------------------------------------------

function ribbonGeometry(
  samples: Sample[],
  groundAt: GroundAt,
  profile: Profile,
  stations: readonly number[],
): THREE.BufferGeometry {
  const rows = samples.map((sample, i) =>
    stations.map((u) => {
      const [x, z] = at(sample, u);
      return new THREE.Vector3(x, groundAt(x, z) + profile(u, i), z);
    }),
  );
  const position: number[] = [];
  const put = (v: THREE.Vector3): void => {
    position.push(v.x, v.y, v.z);
  };
  for (let i = 0; i + 1 < rows.length; i++) {
    for (let k = 0; k + 1 < stations.length; k++) {
      const a = rows[i][k];
      const b = rows[i][k + 1];
      const c = rows[i + 1][k + 1];
      const d = rows[i + 1][k];
      // Anticlockwise from above, so the face normal is up.
      put(a);
      put(b);
      put(c);
      put(a);
      put(c);
      put(d);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(position, 3));
  return geometry;
}

/** One part per lateral band, so each band takes its own colour. */
function ribbon(
  samples: Sample[],
  groundAt: GroundAt,
  profile: Profile,
  bandColour: (u: number) => number,
  noise?: (x: number, y: number, z: number) => number,
): Part[] {
  const parts: Part[] = [];
  for (let k = 0; k + 1 < STATIONS.length; k++) {
    const band = [STATIONS[k], STATIONS[k + 1]];
    const mid = (band[0] + band[1]) / 2;
    parts.push({
      geometry: ribbonGeometry(samples, groundAt, profile, band),
      color: noise ?? bandColour(mid),
      sway: 0,
    });
  }
  return parts;
}

// --- pieces -----------------------------------------------------------------

/** A block with its top drawn in, on the skin `advance` metres past its sample at station `u`. Five faces. */
function block(
  sample: Sample,
  u: number,
  advance: number,
  groundAt: GroundAt,
  profile: Profile,
  index: number,
  along: number,
  across: number,
  height: number,
  shrink: number,
  sink: number,
  rng: Rng,
  jitter: number,
): THREE.BufferGeometry {
  const [sx, sz] = at(sample, u);
  const cx = sx + sample.tx * advance;
  const cz = sz + sample.tz * advance;
  const base = groundAt(cx, cz) + profile(u, index) - sink;
  const corner = (a: number, b: number, y: number): THREE.Vector3 =>
    new THREE.Vector3(
      cx + sample.tx * a + sample.nx * b + rng.around(0, jitter),
      y + rng.around(0, jitter * 0.3),
      cz + sample.tz * a + sample.nz * b + rng.around(0, jitter),
    );
  const ha = along / 2;
  const hb = across / 2;
  const ta = ha * shrink;
  const tb = hb * shrink;
  const b = [corner(-ha, -hb, base), corner(ha, -hb, base), corner(ha, hb, base), corner(-ha, hb, base)];
  const t = [
    corner(-ta, -tb, base + height),
    corner(ta, -tb, base + height),
    corner(ta, tb, base + height),
    corner(-ta, tb, base + height),
  ];
  const position: number[] = [];
  const face = (...v: THREE.Vector3[]): void => {
    for (const [i, j, k] of [
      [0, 1, 2],
      [0, 2, 3],
    ]) {
      position.push(v[i].x, v[i].y, v[i].z, v[j].x, v[j].y, v[j].z, v[k].x, v[k].y, v[k].z);
    }
  };
  face(b[0], t[0], t[1], b[1]);
  face(b[1], t[1], t[2], b[2]);
  face(b[2], t[2], t[3], b[3]);
  face(b[3], t[3], t[0], b[0]);
  face(t[0], t[3], t[2], t[1]);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(position, 3));
  return geometry;
}

/** The sample at a distance along, with its index. */
function sampleAt(samples: Sample[], s: number): [Sample, number] {
  let lo = 0;
  let hi = samples.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (samples[mid].s <= s) lo = mid;
    else hi = mid - 1;
  }
  return [samples[lo], lo];
}

/** A point in a paving's own plane: s along, t across. */
interface Cell2 {
  x: number;
  y: number;
}
type Cell = Cell2[];

/** How a paving is cut: the stones' mean spacing, the joint between them, and how far the crown is worn back. */
interface Paving {
  pitch: number;
  joint: number;
  chamfer: number;
  height: number;
}

function settPaving(wear: number): Paving {
  return { pitch: 0.2, joint: 0.015, chamfer: 0.012 + 0.02 * wear, height: SETT_HEIGHT };
}

function slabPaving(wear: number): Paving {
  return { pitch: 1.0, joint: 0.03, chamfer: 0.015 + 0.02 * wear, height: 0.06 };
}

function centreOf(cell: Cell): Cell2 {
  let x = 0;
  let y = 0;
  for (const p of cell) {
    x += p.x / cell.length;
    y += p.y / cell.length;
  }
  return { x, y };
}

/** The part of a convex polygon on the near side of a line. */
function halfPlane(cell: Cell, nx: number, ny: number, c: number): Cell {
  const out: Cell = [];
  for (let i = 0; i < cell.length; i++) {
    const a = cell[i];
    const b = cell[(i + 1) % cell.length];
    const da = nx * a.x + ny * a.y - c;
    const db = nx * b.x + ny * b.y - c;
    if (da <= 0) out.push(a);
    if (da <= 0 !== db <= 0) {
      const t = da / (da - db);
      out.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
    }
  }
  return out;
}

/** A cell drawn in toward its middle by `by` metres on every side. */
function drawIn(cell: Cell, by: number): Cell {
  const mid = centreOf(cell);
  const out: Cell = [];
  for (let i = 0; i < cell.length; i++) {
    const a = cell[(i + cell.length - 1) % cell.length];
    const b = cell[i];
    const c = cell[(i + 1) % cell.length];
    // Inward normals of the two edges at this corner, in a ring wound either way.
    const wind = Math.sign((b.x - a.x) * (c.y - b.y) - (b.y - a.y) * (c.x - b.x)) || 1;
    const n1 = inward(a, b, wind);
    const n2 = inward(b, c, wind);
    const nx = n1.x + n2.x;
    const ny = n1.y + n2.y;
    const dot = 1 + n1.x * n2.x + n1.y * n2.y;
    const mx = (nx / dot) * by;
    const my = (ny / dot) * by;
    // Never past the middle, so a sliver does not turn inside out.
    const toMid = Math.hypot(mid.x - b.x, mid.y - b.y);
    const move = Math.hypot(mx, my);
    const k = move > toMid * 0.8 ? (toMid * 0.8) / move : 1;
    out.push({ x: b.x + mx * k, y: b.y + my * k });
  }
  return out;
}

function inward(a: Cell2, b: Cell2, wind: number): Cell2 {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  return { x: (-dy / len) * wind, y: (dx / len) * wind };
}

/**
 * One stone: a flat-topped prism over a cell, its foot drawn in by the joint
 * and its crown by the chamfer. `toWorld` takes the plane to x/z as a
 * rotation, never a reflection, which is what the winding below relies on.
 */
function prismOver(
  cell: Cell,
  toWorld: (p: Cell2) => [number, number],
  base: number,
  height: number,
  paving: Paving,
  rng: Rng,
  draped?: (x: number, z: number) => number,
): THREE.BufferGeometry | null {
  const foot = drawIn(cell, paving.joint / 2);
  const crown = drawIn(cell, paving.joint / 2 + paving.chamfer);
  if (foot.length < 3 || crown.length < 3) return null;
  const top = base + height;
  const world = (p: Cell2, y: number): THREE.Vector3 => {
    const [x, z] = toWorld(p);
    return new THREE.Vector3(x + rng.around(0, 0.002), y + rng.around(0, 0.001), z + rng.around(0, 0.002));
  };
  // The foot follows the skin where one is given, so the stone stands on it however the ground lies.
  const b = foot.map((p) => {
    const [x, z] = toWorld(p);
    return world(p, draped ? Math.min(base, draped(x, z)) : base);
  });
  const t = crown.map((p) => world(p, top));
  const position: number[] = [];
  const tri = (p: THREE.Vector3, q: THREE.Vector3, r: THREE.Vector3): void => {
    position.push(p.x, p.y, p.z, q.x, q.y, q.z, r.x, r.y, r.z);
  };
  let twice = 0;
  for (let i = 0; i < cell.length; i++) {
    const a = cell[i];
    const c = cell[(i + 1) % cell.length];
    twice += a.x * c.y - c.x * a.y;
  }
  // A ring with negative area in the plane is counter-clockwise seen from
  // above, and its cap faces up as it is.
  const up = twice < 0;
  const n = cell.length;
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    if (up) {
      tri(b[i], t[j], t[i]);
      tri(b[i], b[j], t[j]);
    } else {
      tri(b[i], t[i], t[j]);
      tri(b[i], t[j], b[j]);
    }
  }
  for (let i = 1; i + 1 < n; i++) {
    if (up) tri(t[0], t[i], t[i + 1]);
    else tri(t[0], t[i + 1], t[i]);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(position, 3));
  return geometry;
}

// --- the stone paving -----------------------------------------------------------

export interface StonePavingOptions {
  strips: readonly StoneStrip[];
  rings: readonly StoneRing[];
  wear?: number;
  seed: number;
  groundAt: GroundAt;
}

/** Metres the stones sink into the skin. */
const SINK = 0.015;
/** Metres of skin cell in the index the paving looks its strips up through. */
const INDEX_CELL = 4;

/**
 * One paving over every stone strip and junction of a network: sites
 * scattered over the whole of it, every stone the patch nearer its own site
 * than any other, so the joints run on through a junction and across a
 * strip's end as if nothing were there. Each cell is a plate of grout draped
 * on the skin, a stone stood on it, and — unseen — its top in the bed.
 */
export function buildStonePaving(options: StonePavingOptions): THREE.Group {
  const group = new THREE.Group();
  const { strips, rings, groundAt } = options;
  if (strips.length === 0 && rings.length === 0) return group;
  const rng = createRng(options.seed);
  const wear = Math.min(1, Math.max(0, options.wear ?? 0.5));
  const pavings = { cobble: settPaving(wear), flagstone: slabPaving(wear) };
  const colours = { cobble: stoneColours(rng, 0.1), flagstone: stoneColours(rng, 0.06) };

  // --- where the paving is, and how high -----------------------------------
  const index = new Map<number, { strip: StoneStrip; at: number }[]>();
  const key = (x: number, z: number): number => Math.floor(x / INDEX_CELL) * 65536 + Math.floor(z / INDEX_CELL) + 32768;
  for (const strip of strips) {
    strip.samples.forEach((sample, at) => {
      const k = key(sample.x, sample.z);
      const held = index.get(k);
      if (held) held.push({ strip, at });
      else index.set(k, [{ strip, at }]);
    });
  }
  const flats = rings.map((held) => {
    let minX = Infinity;
    let minZ = Infinity;
    let maxX = -Infinity;
    let maxZ = -Infinity;
    for (const [x, z] of held.ring) {
      minX = Math.min(minX, x);
      minZ = Math.min(minZ, z);
      maxX = Math.max(maxX, x);
      maxZ = Math.max(maxZ, z);
    }
    return { ...held, minX, minZ, maxX, maxZ };
  });
  const inRing = (flat: (typeof flats)[number], x: number, z: number): boolean => {
    if (x < flat.minX || x > flat.maxX || z < flat.minZ || z > flat.maxZ) return false;
    let crossings = 0;
    const ring = flat.ring;
    for (let i = 0; i < ring.length; i++) {
      const a = ring[i];
      const b = ring[(i + 1) % ring.length];
      if (a[1] > z !== b[1] > z && x < a[0] + ((z - a[1]) * (b[0] - a[0])) / (b[1] - a[1])) crossings++;
    }
    return crossings % 2 === 1;
  };
  /** The nearest strip sample about a point, with the point's station on it: u across, advance along. */
  const nearStrip = (x: number, z: number): { strip: StoneStrip; at: number; u: number; lift: number } | null => {
    const cx = Math.floor(x / INDEX_CELL);
    const cz = Math.floor(z / INDEX_CELL);
    let best: { strip: StoneStrip; at: number; u: number; lift: number; away: number } | null = null;
    for (let dx = -1; dx <= 1; dx++) {
      for (let dz = -1; dz <= 1; dz++) {
        const held = index.get((cx + dx) * 65536 + (cz + dz) + 32768);
        if (!held) continue;
        for (const { strip, at } of held) {
          const sample = strip.samples[at];
          const px = x - sample.x;
          const pz = z - sample.z;
          const advance = px * sample.tx + pz * sample.tz;
          const s = sample.s + advance;
          if (s < -0.01 || s > strip.samples[strip.samples.length - 1].s + 0.01) continue;
          const across = px * sample.nx + pz * sample.nz;
          const reach = sample.half - strip.inset;
          if (Math.abs(across) > reach) continue;
          const away = Math.abs(advance);
          if (!best || away < best.away) {
            const u = across / sample.half;
            best = { strip, at, u, lift: Math.max(LIFT, strip.profile(u, at)), away };
          }
        }
      }
    }
    return best;
  };
  const whereIs = (x: number, z: number): { surface: 'cobble' | 'flagstone'; lift: number } | null => {
    let found: { surface: 'cobble' | 'flagstone'; lift: number } | null = null;
    for (const flat of flats) {
      if (inRing(flat, x, z) && (!found || flat.lift > found.lift)) found = { surface: flat.surface, lift: flat.lift };
    }
    const strip = nearStrip(x, z);
    if (strip && (!found || strip.lift > found.lift)) found = { surface: strip.strip.surface, lift: strip.lift };
    return found;
  };
  const skinAt = (x: number, z: number): number => groundAt(x, z) + (whereIs(x, z)?.lift ?? LIFT) - SINK;

  // --- the sites ---------------------------------------------------------------
  interface Site {
    x: number;
    z: number;
    surface: 'cobble' | 'flagstone';
  }
  const sites: Site[] = [];
  const taken = new Map<number, Site[]>();
  const HASH = 0.5;
  const hashKey = (x: number, z: number): number => Math.floor(x / HASH) * 65536 + Math.floor(z / HASH) + 32768;
  const near = (x: number, z: number, within: number, visit: (site: Site) => boolean): void => {
    const cx = Math.floor(x / HASH);
    const cz = Math.floor(z / HASH);
    const span = Math.ceil(within / HASH);
    for (let dx = -span; dx <= span; dx++) {
      for (let dz = -span; dz <= span; dz++) {
        const held = taken.get((cx + dx) * 65536 + (cz + dz) + 32768);
        if (!held) continue;
        for (const site of held) if (!visit(site)) return;
      }
    }
  };
  const settle = (x: number, z: number, surface: 'cobble' | 'flagstone'): void => {
    const pitch = pavings[surface].pitch;
    let crowded = false;
    near(x, z, pitch * 0.5, (site) => {
      if (Math.hypot(site.x - x, site.z - z) < pitch * 0.45) crowded = true;
      return !crowded;
    });
    if (crowded) return;
    const site = { x, z, surface };
    sites.push(site);
    const k = hashKey(x, z);
    const held = taken.get(k);
    if (held) held.push(site);
    else taken.set(k, [site]);
  };
  // Rings first, so a strip's sites give way at its mouth rather than the other way round.
  for (const flat of flats) {
    const { pitch } = pavings[flat.surface];
    let row = 0;
    for (let z = flat.minZ + pitch / 2; z < flat.maxZ; z += pitch * 0.92, row++) {
      for (let x = flat.minX + (row % 2 === 0 ? pitch / 2 : pitch); x < flat.maxX; x += pitch) {
        const sx = x + rng.around(0, pitch * 0.2);
        const sz = z + rng.around(0, pitch * 0.2);
        if (inRing(flat, sx, sz)) settle(sx, sz, flat.surface);
      }
    }
  }
  for (const strip of strips) {
    const { pitch } = pavings[strip.surface];
    const length = strip.samples[strip.samples.length - 1].s;
    for (let s = pitch / 2, row = 0; s < length; s += pitch * 0.92, row++) {
      const [sample] = sampleAt(strip.samples, s);
      const reach = sample.half - strip.inset;
      const count = Math.max(1, Math.floor((reach * 2) / pitch));
      const gap = (reach * 2) / count;
      const stagger = row % 2 === 0 ? 0 : gap / 2;
      for (let k = 0; k < count; k++) {
        const t = -reach + gap * (k + 0.5) + stagger + rng.around(0, gap * 0.2);
        if (Math.abs(t) > reach - gap * 0.2) continue;
        const advance = s - sample.s + rng.around(0, pitch * 0.2);
        settle(sample.x + sample.tx * advance + sample.nx * t, sample.z + sample.tz * advance + sample.nz * t, strip.surface);
      }
    }
  }

  // --- the cells ---------------------------------------------------------------
  const skin: Part[] = [];
  const toWorld = (p: Cell2): [number, number] => [p.x, p.y];
  for (const site of sites) {
    const paving = pavings[site.surface];
    const reach = paving.pitch * 2.4;
    let cell: Cell = [
      { x: site.x - reach, y: site.z - reach },
      { x: site.x + reach, y: site.z - reach },
      { x: site.x + reach, y: site.z + reach },
      { x: site.x - reach, y: site.z + reach },
    ];
    near(site.x, site.z, reach, (other) => {
      if (other === site) return true;
      const dx = other.x - site.x;
      const dz = other.z - site.z;
      const away = Math.hypot(dx, dz);
      if (away < 1e-9 || away > reach) return true;
      const nx = dx / away;
      const nz = dz / away;
      cell = halfPlane(cell, nx, nz, (nx * (site.x + other.x) + nz * (site.z + other.z)) / 2);
      return cell.length >= 3;
    });
    if (cell.length < 3) continue;
    // Shrink-wrapped to the paving: a corner outside it is drawn back toward
    // the site until it is on the edge.
    cell = cell.map((corner) => {
      if (whereIs(corner.x, corner.y)) return corner;
      let lo = 0;
      let hi = 1;
      for (let step = 0; step < 8; step++) {
        const mid = (lo + hi) / 2;
        const x = site.x + (corner.x - site.x) * mid;
        const z = site.z + (corner.y - site.z) * mid;
        if (whereIs(x, z)) lo = mid;
        else hi = mid;
      }
      return { x: site.x + (corner.x - site.x) * lo, y: site.z + (corner.y - site.z) * lo };
    });
    const mid = centreOf(cell);
    const base = skinAt(mid.x, mid.y);
    const stone = prismOver(cell, toWorld, base, paving.height + rng.around(0, 0.003), paving, rng, skinAt);
    if (!stone) continue;
    skin.push({ geometry: stone, color: colours[site.surface](), sway: 0 });
    skin.push({ geometry: plateOver(cell, skinAt), color: shade(PALETTE.STONE_DARK, site.surface === 'cobble' ? 0.55 : 0.6), sway: 0 });
  }
  if (skin.length === 0) return group;

  // Walked on through the strips' and junctions' own beds; this is what is seen.
  const mesh = finish(assemble(skin), 'track-stone', 0, UNDERFOOT.cobble);
  mesh.name = 'track';
  mesh.userData.ground = true;
  mesh.userData.footprintFaces = true;
  group.add(markCollidable(mesh));
  return group;
}

/** A cell as one flat-lying polygon, each corner at `height`, facing up. */
function plateOver(cell: Cell, height: (x: number, z: number) => number): THREE.BufferGeometry {
  let twice = 0;
  for (let i = 0; i < cell.length; i++) {
    const a = cell[i];
    const b = cell[(i + 1) % cell.length];
    twice += a.x * b.y - b.x * a.y;
  }
  const ring = twice < 0 ? cell : [...cell].reverse();
  const position: number[] = [];
  const at = (p: Cell2): [number, number, number] => [p.x, height(p.x, p.y), p.y];
  const first = at(ring[0]);
  for (let i = 1; i + 1 < ring.length; i++) {
    const b = at(ring[i]);
    const c = at(ring[i + 1]);
    position.push(...first, ...b, ...c);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(position, 3));
  return geometry;
}

// --- junctions ----------------------------------------------------------------

/** One arm of a junction: the end row of the strip that meets it, right to left seen from the middle. */
export interface JunctionArm {
  row: readonly (readonly [number, number])[];
  surface: TrackSurface;
  width: number;
}

export interface JunctionOptions {
  at: Point;
  arms: readonly JunctionArm[];
  /** The surface the whole junction is paved in, and the width its lift is taken from. */
  surface: TrackSurface;
  width: number;
  wear?: number;
  seed: number;
  groundAt: GroundAt;
}

/**
 * Where strips meet: one patch over the mouths of every arm, level with the
 * lift the arms have eased into, paved once in the winning surface. The
 * patch is the arms' end rows joined in order round the middle, so it shares
 * every vertex of every row and no crack can open along them.
 */
export function junctionRing(at: Point, arms: readonly JunctionArm[]): [number, number][] {
  const [cx, cz] = at;
  const ordered = [...arms]
    .map((arm) => {
      const first = arm.row[0];
      const last = arm.row[arm.row.length - 1];
      const mx = (first[0] + last[0]) / 2;
      const mz = (first[1] + last[1]) / 2;
      return { arm, bearing: Math.atan2(mz - cz, mx - cx) };
    })
    .sort((a, b) => a.bearing - b.bearing);
  const ring: [number, number][] = [];
  for (const { arm, bearing } of ordered) {
    // In angle order about the middle, as the arms themselves are.
    const row = [...arm.row].sort(
      (a, b) => turn(Math.atan2(a[1] - cz, a[0] - cx) - bearing) - turn(Math.atan2(b[1] - cz, b[0] - cx) - bearing),
    );
    for (const p of row) ring.push([p[0], p[1]]);
  }
  let twice = 0;
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i];
    const b = ring[(i + 1) % ring.length];
    twice += a[0] * b[1] - b[0] * a[1];
  }
  // Anticlockwise from above is a negative area in x/z, and faces up.
  if (twice > 0) ring.reverse();
  return ring;
}

/** A junction in a loose surface: one patch over the ring, level with the lift its arms eased into. Stone junctions are the paving's. */
export function buildJunction(options: JunctionOptions): THREE.Group {
  const wear = Math.min(1, Math.max(0, options.wear ?? 0.5));
  const group = new THREE.Group();
  const [cx, cz] = options.at;
  const lift = liftOf(options.surface, options.width);
  const height = (x: number, z: number): number => options.groundAt(x, z) + lift;
  const ring = junctionRing(options.at, options.arms);
  if (ring.length < 3) return group;

  const fan = (top: number): THREE.BufferGeometry => {
    const position: number[] = [];
    const centre = height(cx, cz) + top;
    for (let i = 0; i < ring.length; i++) {
      const a = ring[i];
      const b = ring[(i + 1) % ring.length];
      position.push(cx, centre, cz, a[0], height(a[0], a[1]) + top, a[1], b[0], height(b[0], b[1]) + top, b[1]);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(position, 3));
    return geometry;
  };

  const parts: Part[] = [];
  const surface = options.surface;
  switch (surface) {
    case 'dirt':
      parts.push({ geometry: fan(0), color: shade(GROUND.dirt.color, 1 + 0.1 * wear), sway: 0 });
      break;
    case 'gravel': {
      const gravel = GROUND.gravel.color;
      const seed = options.seed;
      parts.push({ geometry: fan(0), color: (x, _y, z) => shade(gravel, 0.9 + 0.2 * hash(x, z, seed)), sway: 0 });
      break;
    }
    case 'boards':
      parts.push({ geometry: fan(0), color: shade(PALETTE.TIMBER_PALE, 0.9 * (1 - 0.15 * wear)), sway: 0 });
      break;
    // The stones are the paving's; the junction keeps only its bed.
    case 'cobble':
    case 'flagstone':
      break;
  }

  if (parts.length > 0) {
    const skin = finish(assemble(parts), `track-${surface}`, 0, UNDERFOOT[surface]);
    skin.name = 'track';
    skin.userData.ground = true;
    skin.userData.footprintFaces = true;
    group.add(markCollidable(skin));
  }

  const bedTop = bedTopOf(surface);
  if (bedTop > 0) {
    const bed = new THREE.Mesh(fan(bedTop), BED_MATERIAL);
    bed.visible = false;
    bed.userData.underfoot = UNDERFOOT[surface];
    group.add(markCollidable(bed));
  }
  return group;
}

/** An angle folded into -π..π. */
function turn(angle: number): number {
  return Math.atan2(Math.sin(angle), Math.cos(angle));
}


function kerbs(samples: Sample[], groundAt: GroundAt, profile: Profile, rng: Rng): Part[] {
  const parts: Part[] = [];
  const colour = shade(PALETTE.STONE_DARK, 0.9);
  const length = samples[samples.length - 1].s;
  for (const side of [-1, 1]) {
    let s = rng.range(0, 0.3);
    while (s < length) {
      const along = rng.range(0.45, 0.65);
      const mid = Math.min(length - 0.01, s + along / 2);
      const [sample, index] = sampleAt(samples, mid);
      const u = (side * (sample.half - KERB_WIDTH / 2)) / sample.half;
      parts.push({
        geometry: block(
          sample,
          u,
          mid - sample.s,
          groundAt,
          profile,
          index,
          along - 0.03,
          KERB_WIDTH,
          SETT_HEIGHT + 0.05,
          0.85,
          0.03,
          rng,
          0.006,
        ),
        color: shade(colour, rng.range(0.92, 1.08)),
        sway: 0,
      });
      s += along;
    }
  }
  return parts;
}

function embeddedStones(
  samples: Sample[],
  groundAt: GroundAt,
  profile: Profile,
  rng: Rng,
  perSquareMetre: number,
): Part[] {
  const parts: Part[] = [];
  const colour = stoneColours(rng, 0.2);
  const length = samples[samples.length - 1].s;
  const count = Math.round(length * samples[0].half * 2 * perSquareMetre);
  for (let n = 0; n < count; n++) {
    const s = rng.range(0, length);
    const [sample, index] = sampleAt(samples, s);
    const u = rng.range(-0.9, 0.9);
    const size = rng.range(0.08, 0.22);
    parts.push({
      geometry: block(sample, u, s - sample.s, groundAt, profile, index, size, size * rng.range(0.6, 1), size * 0.35, 0.6, size * 0.15, rng, size * 0.1),
      color: colour(),
      sway: 0,
    });
  }
  return parts;
}

function pebbles(samples: Sample[], groundAt: GroundAt, profile: Profile, rng: Rng): Part[] {
  const parts: Part[] = [];
  const base = GROUND.gravel.color;
  const length = samples[samples.length - 1].s;
  const count = Math.round(length * samples[0].half * 2 * 2.5);
  for (let n = 0; n < count; n++) {
    const s = rng.range(0, length);
    const [sample, index] = sampleAt(samples, s);
    // Kicked to the sides: the middle is walked.
    const u = rng.pick([-1, 1]) * Math.sqrt(rng.range(0.15, 1)) * 0.92;
    const size = rng.range(0.035, 0.07);
    parts.push({
      geometry: block(sample, u, s - sample.s, groundAt, profile, index, size, size * rng.range(0.7, 1), size * 0.5, 0.5, 0, rng, size * 0.1),
      color: shade(base, rng.range(0.8, 1.25)),
      sway: 0,
    });
  }
  return parts;
}

function boardwalk(samples: Sample[], groundAt: GroundAt, rng: Rng, wear: number): Part[] {
  const parts: Part[] = [];
  const length = samples[samples.length - 1].s;
  const pitch = 0.27;
  const box = (
    sample: Sample,
    a0: number,
    a1: number,
    b0: number,
    b1: number,
    y0: number,
    y1: number,
  ): THREE.BufferGeometry => {
    const corner = (a: number, b: number, y: number): THREE.Vector3 =>
      new THREE.Vector3(sample.x + sample.tx * a + sample.nx * b, y, sample.z + sample.tz * a + sample.nz * b);
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const position = geometry.getAttribute('position');
    for (let i = 0; i < position.count; i++) {
      const a = position.getX(i) < 0 ? a0 : a1;
      const b = position.getZ(i) < 0 ? b0 : b1;
      const y = position.getY(i) < 0 ? y0 : y1;
      const v = corner(a, b, y);
      position.setXYZ(i, v.x, v.y, v.z);
    }
    return geometry;
  };
  // The deck rides the ground along its length and is level across it.
  const deck = (x: number, z: number): number => groundAt(x, z) + BOARD_LIFT;
  for (let s = pitch / 2; s < length; s += pitch) {
    const [sample] = sampleAt(samples, s);
    const y = deck(sample.x, sample.z);
    const reach = sample.half + 0.08;
    parts.push({
      geometry: box(sample, -0.115, 0.115, -reach + rng.around(0, 0.03), reach + rng.around(0, 0.03), y - 0.05, y + rng.around(0, 0.006)),
      color: shade(PALETTE.TIMBER_PALE, rng.range(0.8, 1) * (1 - 0.15 * wear)),
      sway: 0,
    });
  }
  for (const side of [-0.78, 0.78]) {
    for (let i = 0; i + 1 < samples.length; i++) {
      const a = samples[i];
      const b = samples[i + 1];
      const [ax, az] = at(a, side);
      const [bx, bz] = at(b, side);
      const under = Math.min(groundAt(ax, az), groundAt(bx, bz)) - 0.05;
      const top = Math.min(deck(a.x, a.z), deck(b.x, b.z)) - 0.05;
      parts.push({
        geometry: box(a, -0.02, b.s - a.s + 0.02, side * a.half - 0.07, side * a.half + 0.07, under, top),
        color: PALETTE.TIMBER_DARK,
        sway: 0,
      });
    }
  }
  return parts;
}

/** Stable 0..1 per face for the gravel's grain. */
function hash(x: number, z: number, seed: number): number {
  let h = (Math.imul(Math.round(x * 37), 374761393) + Math.imul(Math.round(z * 37), 668265263) + Math.imul(seed, 1442695041)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
