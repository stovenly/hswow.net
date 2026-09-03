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

/** A track built for the network: its group, and the line it was built on. */
export interface BuiltTrack {
  group: THREE.Group;
  samples: Sample[];
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
const SETT_HEIGHT = 0.07;
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
    case 'cobble': {
      const profile = eased(crownProfile(options.width));
      const grout = shade(PALETTE.STONE_DARK, 0.55);
      const kerb = options.edge === 'kerb';
      parts.push(...ribbon(samples, options.groundAt, profile, () => grout));
      parts.push(...setts(samples, options.groundAt, profile, rng, wear, kerb ? KERB_WIDTH : 0));
      if (kerb) parts.push(...kerbs(samples, options.groundAt, profile, rng));
      bedTop = SETT_HEIGHT;
      break;
    }
    case 'flagstone': {
      const profile = eased(crownProfile(options.width));
      const grout = shade(PALETTE.STONE_DARK, 0.6);
      const kerb = options.edge === 'kerb';
      parts.push(...ribbon(samples, options.groundAt, profile, () => grout));
      parts.push(...slabs(samples, options.groundAt, profile, rng, wear, kerb ? KERB_WIDTH : 0));
      if (kerb) parts.push(...kerbs(samples, options.groundAt, profile, rng));
      bedTop = 0.06;
      break;
    }
    case 'boards': {
      parts.push(...boardwalk(samples, options.groundAt, rng, wear));
      bedTop = BOARD_LIFT;
      break;
    }
  }

  const skin = finish(assemble(parts), `track-${surface}`, 0, underfoot);
  skin.name = 'track';
  skin.userData.ground = true;
  // The strip's print on the cover mask: bare under the track, thinning over the verge.
  skin.userData.footprint = samples.map((sample) => [sample.x, sample.z, sample.half]);
  skin.userData.footprintSoft = options.edge === 'verge' ? 0.9 : 0.3;
  group.add(markCollidable(skin));

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
  return { group, samples };
}

/** Metres above the ground the pieces of a surface stand, which is where its bed is. */
function bedTopOf(surface: TrackSurface): number {
  switch (surface) {
    case 'cobble':
      return SETT_HEIGHT;
    case 'flagstone':
      return 0.06;
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

/**
 * Stones as the wall builder lays them: sites jittered off a staggered grid
 * over the plane, and every stone the patch nearer its own site than any
 * other, so no joint runs straight and two stones share exactly one. `bound`
 * cuts a site's cell to the paving's own edge.
 */
function pavingCells(
  rng: Rng,
  paving: Paving,
  s0: number,
  s1: number,
  across: (s: number) => [number, number],
  bound: (cell: Cell, s: number, t: number) => Cell,
): Cell[] {
  const { pitch } = paving;
  const rows: { s: number; t: number }[][] = [];
  for (let s = s0 + pitch / 2, row = 0; s < s1; s += pitch * 0.92, row++) {
    const [t0, t1] = across(s);
    const count = Math.max(1, Math.floor((t1 - t0) / pitch));
    const gap = (t1 - t0) / count;
    const stagger = row % 2 === 0 ? 0 : gap / 2;
    const sites: { s: number; t: number }[] = [];
    for (let k = 0; k < count; k++) {
      const t = t0 + gap * (k + 0.5) + stagger + rng.around(0, gap * 0.2);
      if (t < t0 + gap * 0.2 || t > t1 - gap * 0.2) continue;
      sites.push({ s: s + rng.around(0, pitch * 0.2), t });
    }
    rows.push(sites);
  }
  const near = pitch * 2.4;
  const cells: Cell[] = [];
  rows.forEach((sites, row) => {
    for (const site of sites) {
      let cell: Cell = bound(
        [
          { x: site.s - near, y: site.t - near },
          { x: site.s + near, y: site.t - near },
          { x: site.s + near, y: site.t + near },
          { x: site.s - near, y: site.t + near },
        ],
        site.s,
        site.t,
      );
      for (let r = Math.max(0, row - 3); r <= Math.min(rows.length - 1, row + 3) && cell.length >= 3; r++) {
        for (const other of rows[r]) {
          if (other === site) continue;
          const dx = other.s - site.s;
          const dy = other.t - site.t;
          const away = Math.hypot(dx, dy);
          if (away < 1e-9 || away > near) continue;
          const nx = dx / away;
          const ny = dy / away;
          cell = halfPlane(cell, nx, ny, (nx * (site.s + other.s) + ny * (site.t + other.t)) / 2);
          if (cell.length < 3) break;
        }
      }
      if (cell.length >= 3) cells.push(cell);
    }
  });
  return cells;
}

function setts(
  samples: Sample[],
  groundAt: GroundAt,
  profile: Profile,
  rng: Rng,
  wear: number,
  inset: number,
): Part[] {
  return stripPaving(samples, groundAt, profile, rng, settPaving(wear), inset, stoneColours(rng, 0.1));
}

/** Stones over the strip, in its own (s, t) plane, stood on the skin. */
function stripPaving(
  samples: Sample[],
  groundAt: GroundAt,
  profile: Profile,
  rng: Rng,
  paving: Paving,
  inset: number,
  colour: () => number,
): Part[] {
  const length = samples[samples.length - 1].s;
  const reachAt = (s: number): number => sampleAt(samples, s)[0].half - inset;
  const cells = pavingCells(
    rng,
    paving,
    0,
    length,
    (s) => [-reachAt(s), reachAt(s)],
    (cell, s) => {
      const reach = reachAt(s);
      cell = halfPlane(cell, 0, 1, reach);
      cell = halfPlane(cell, 0, -1, reach);
      cell = halfPlane(cell, 1, 0, length);
      return halfPlane(cell, -1, 0, 0);
    },
  );
  const toWorld = (p: Cell2): [number, number] => {
    const [sample] = sampleAt(samples, p.x);
    const advance = p.x - sample.s;
    return [sample.x + sample.tx * advance + sample.nx * p.y, sample.z + sample.tz * advance + sample.nz * p.y];
  };
  const parts: Part[] = [];
  for (const cell of cells) {
    const middle = centreOf(cell);
    const [sample, index] = sampleAt(samples, middle.x);
    const [mx, mz] = toWorld(middle);
    const base = groundAt(mx, mz) + profile(middle.y / sample.half, index) - 0.015;
    const geometry = prismOver(cell, toWorld, base, paving.height + rng.around(0, 0.003), paving, rng);
    if (geometry) parts.push({ geometry, color: colour(), sway: 0 });
  }
  return parts;
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
): THREE.BufferGeometry | null {
  const foot = drawIn(cell, paving.joint / 2);
  const crown = drawIn(cell, paving.joint / 2 + paving.chamfer);
  if (foot.length < 3 || crown.length < 3) return null;
  const top = base + height;
  const world = (p: Cell2, y: number): THREE.Vector3 => {
    const [x, z] = toWorld(p);
    return new THREE.Vector3(x + rng.around(0, 0.002), y + rng.around(0, 0.001), z + rng.around(0, 0.002));
  };
  const b = foot.map((p) => world(p, base));
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
export function buildJunction(options: JunctionOptions): THREE.Group {
  const rng = createRng(options.seed);
  const wear = Math.min(1, Math.max(0, options.wear ?? 0.5));
  const group = new THREE.Group();
  const [cx, cz] = options.at;
  const lift = liftOf(options.surface, options.width);
  const height = (x: number, z: number): number => options.groundAt(x, z) + lift;

  // The rows in order round the middle, each right to left, into one ring.
  const arms = [...options.arms]
    .map((arm) => {
      const first = arm.row[0];
      const last = arm.row[arm.row.length - 1];
      const mx = (first[0] + last[0]) / 2;
      const mz = (first[1] + last[1]) / 2;
      return { arm, bearing: Math.atan2(mz - cz, mx - cx) };
    })
    .sort((a, b) => a.bearing - b.bearing);
  const ring: [number, number][] = [];
  for (const { arm, bearing } of arms) {
    // In angle order about the middle, as the arms themselves are.
    const row = [...arm.row].sort(
      (a, b) => turn(Math.atan2(a[1] - cz, a[0] - cx) - bearing) - turn(Math.atan2(b[1] - cz, b[0] - cx) - bearing),
    );
    for (const p of row) ring.push([p[0], p[1]]);
  }
  if (ring.length < 3) return group;
  let twice = 0;
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i];
    const b = ring[(i + 1) % ring.length];
    twice += a[0] * b[1] - b[0] * a[1];
  }
  // Anticlockwise from above is a negative area in x/z, and faces up.
  if (twice > 0) ring.reverse();

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
    case 'cobble':
    case 'flagstone': {
      parts.push({ geometry: fan(0), color: shade(PALETTE.STONE_DARK, surface === 'cobble' ? 0.55 : 0.6), sway: 0 });
      parts.push(...ringPaving(ring, [cx, cz], height, rng, surface === 'cobble' ? settPaving(wear) : slabPaving(wear), stoneColours(rng, surface === 'cobble' ? 0.1 : 0.06)));
      break;
    }
  }

  const skin = finish(assemble(parts), `track-${surface}`, 0, UNDERFOOT[surface]);
  skin.name = 'track';
  skin.userData.ground = true;
  skin.userData.footprintFaces = true;
  group.add(markCollidable(skin));

  const bedTop = bedTopOf(surface);
  if (bedTop > 0) {
    const bed = new THREE.Mesh(fan(bedTop), BED_MATERIAL);
    bed.visible = false;
    bed.userData.underfoot = UNDERFOOT[surface];
    group.add(markCollidable(bed));
  }
  return group;
}

function toEdge(x: number, y: number, a: Cell2, b: Cell2): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const lengthSquared = dx * dx + dy * dy;
  const t = lengthSquared === 0 ? 0 : Math.max(0, Math.min(1, ((x - a.x) * dx + (y - a.y) * dy) / lengthSquared));
  return Math.hypot(x - (a.x + dx * t), y - (a.y + dy * t));
}

/** An angle folded into -π..π. */
function turn(angle: number): number {
  return Math.atan2(Math.sin(angle), Math.cos(angle));
}

/** Stones over a convex ring, in a plane laid along its first edge, each stood on the levelled skin. */
function ringPaving(
  ring: readonly [number, number][],
  middle: [number, number],
  height: (x: number, z: number) => number,
  rng: Rng,
  paving: Paving,
  colour: () => number,
): Part[] {
  const [cx, cz] = middle;
  // s along the ring's first edge, t to its left, as a strip's plane is laid.
  const ex = ring[1][0] - ring[0][0];
  const ez = ring[1][1] - ring[0][1];
  const len = Math.hypot(ex, ez) || 1;
  const tx = ex / len;
  const tz = ez / len;
  const nx = -tz;
  const nz = tx;
  const toPlane = (x: number, z: number): Cell2 => ({ x: (x - cx) * tx + (z - cz) * tz, y: (x - cx) * nx + (z - cz) * nz });
  const toWorld = (p: Cell2): [number, number] => [cx + tx * p.x + nx * p.y, cz + tz * p.x + nz * p.y];
  const flat = ring.map((p) => toPlane(p[0], p[1]));
  // Which side of its edges the ring keeps: to the left of travel when it is
  // wound counter-clockwise in the plane, to the right otherwise. The ring
  // need not be convex, so a cell is cut only by the edges near its own site.
  let twice = 0;
  for (let i = 0; i < flat.length; i++) {
    const a = flat[i];
    const b = flat[(i + 1) % flat.length];
    twice += a.x * b.y - b.x * a.y;
  }
  const side = twice >= 0 ? 1 : -1;
  const edges = flat.map((a, i) => {
    const b = flat[(i + 1) % flat.length];
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const l = Math.hypot(dx, dy) || 1;
    const ex = (-dy / l) * side;
    const ey = (dx / l) * side;
    // Everything on the far side of the edge from the inside is cut: n·p >= c.
    return { a, b, nx: -ex, ny: -ey, c: -(ex * a.x + ey * a.y) };
  });
  const inside = (x: number, y: number): boolean => {
    let crossings = 0;
    for (const { a, b } of edges) {
      if (a.y > y !== b.y > y && x < a.x + ((y - a.y) * (b.x - a.x)) / (b.y - a.y)) crossings++;
    }
    return crossings % 2 === 1;
  };
  let s0 = Infinity;
  let s1 = -Infinity;
  let t0 = Infinity;
  let t1 = -Infinity;
  for (const q of flat) {
    s0 = Math.min(s0, q.x);
    s1 = Math.max(s1, q.x);
    t0 = Math.min(t0, q.y);
    t1 = Math.max(t1, q.y);
  }
  const reach = paving.pitch * 3;
  const cells = pavingCells(rng, paving, s0, s1, () => [t0, t1], (cell, s, t) => {
    if (!inside(s, t)) return [];
    for (const edge of edges) {
      if (toEdge(s, t, edge.a, edge.b) > reach) continue;
      cell = halfPlane(cell, edge.nx, edge.ny, edge.c);
      if (cell.length < 3) break;
    }
    return cell;
  });
  const parts: Part[] = [];
  for (const cell of cells) {
    const mid = centreOf(cell);
    const [mx, mz] = toWorld(mid);
    const base = height(mx, mz) - 0.015;
    const geometry = prismOver(cell, toWorld, base, paving.height + rng.around(0, 0.003), paving, rng);
    if (geometry) parts.push({ geometry, color: colour(), sway: 0 });
  }
  return parts;
}

function slabs(
  samples: Sample[],
  groundAt: GroundAt,
  profile: Profile,
  rng: Rng,
  wear: number,
  inset: number,
): Part[] {
  const parts: Part[] = [];
  const colour = stoneColours(rng, 0.06);
  const length = samples[samples.length - 1].s;
  const width = samples[0].half * 2 - inset * 2;
  const rows = Math.max(1, Math.round(width / 1.0));
  const across = width / rows;
  for (let row = 0; row < rows; row++) {
    let s = rng.range(0, 0.6);
    while (s < length) {
      const along = rng.range(0.85, 1.3);
      const mid = Math.min(length - 0.01, s + along / 2);
      const [sample, index] = sampleAt(samples, mid);
      const reach = sample.half - inset;
      const u = (-reach + across * (row + 0.5)) / sample.half;
      parts.push({
        geometry: block(
          sample,
          u,
          mid - sample.s,
          groundAt,
          profile,
          index,
          along - 0.05,
          across - 0.05,
          0.06,
          0.9 - 0.06 * wear,
          0.01,
          rng,
          0.03,
        ),
        color: shade(colour(), 1.05),
        sway: 0,
      });
      s += along;
    }
  }
  return parts;
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
