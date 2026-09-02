import * as THREE from 'three';
import { assemble, finish, type Part } from '../art/assemble';
import { createRng, type Rng } from '../art/random';
import { PALETTE, blend, shade } from '../art/palette';
import { stoneColours } from '../art/masonry';
import { markCollidable } from '../player/Collider';
import { GROUND, type GroundName } from './ground';
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
}

export const TRACK_SURFACES: readonly TrackSurface[] = ['cobble', 'flagstone', 'gravel', 'dirt', 'boards'];

/** What the terrain is painted under each surface. */
export const TRACK_GROUND: Record<TrackSurface, GroundName> = {
  cobble: 'cobble',
  flagstone: 'flagstone',
  gravel: 'gravel',
  dirt: 'dirt',
  boards: 'boards',
};

const UNDERFOOT: Record<TrackSurface, SurfaceName> = {
  cobble: 'cobble-fixed',
  flagstone: 'stone',
  gravel: 'gravel',
  dirt: 'soil',
  boards: 'wood',
};

/** Metres between samples along the centreline. */
const STEP = 0.5;
/** Lateral stations, as fractions of the half width. */
const STATIONS = [-1, -0.75, -0.5, -0.25, 0, 0.25, 0.5, 0.75, 1];
/** Metres the crown stands above the ground, per metre of width. */
const CROWN = 0.014;
const LIFT = 0.025;
const KERB_WIDTH = 0.18;
const SETT_HEIGHT = 0.07;
const BOARD_LIFT = 0.12;

interface Sample {
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
  const rng = createRng(options.seed);
  const wear = Math.min(1, Math.max(0, options.wear ?? 0.5));
  const samples = sampleLine(options.through, options.width, rng);
  const group = new THREE.Group();
  if (samples.length < 2) return group;

  const surface = options.surface;
  const underfoot = UNDERFOOT[surface];
  const parts: Part[] = [];
  let bedTop = 0;

  switch (surface) {
    case 'dirt': {
      const profile = ruttedProfile(options.width, 0.03 + 0.04 * wear);
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
      const profile = ruttedProfile(options.width, 0.015 + 0.02 * wear);
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
      const profile = crownProfile(options.width);
      const grout = shade(PALETTE.STONE_DARK, 0.55);
      const kerb = options.edge === 'kerb';
      parts.push(...ribbon(samples, options.groundAt, profile, () => grout));
      parts.push(...setts(samples, options.groundAt, profile, rng, wear, kerb ? KERB_WIDTH : 0));
      if (kerb) parts.push(...kerbs(samples, options.groundAt, profile, rng));
      bedTop = SETT_HEIGHT;
      break;
    }
    case 'flagstone': {
      const profile = crownProfile(options.width);
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
    const profile = surface === 'boards' ? flatProfile() : crownProfile(options.width);
    const bed = new THREE.Mesh(
      ribbonGeometry(samples, options.groundAt, (u, i) => profile(u, i) + bedTop, [-1, 1]),
      BED_MATERIAL,
    );
    bed.visible = false;
    bed.userData.underfoot = underfoot;
    group.add(markCollidable(bed));
  }
  return group;
}

// --- the line ---------------------------------------------------------------

function sampleLine(through: readonly Point[], width: number, rng: Rng): Sample[] {
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
    return { x: p.x, z: p.z, tx, tz, nx: -tz, nz: tx, half: (width / 2) * (1 + wander), s: p.s };
  });
}

/** Where a station stands, in plan. */
function at(sample: Sample, u: number): [number, number] {
  return [sample.x + sample.nx * sample.half * u, sample.z + sample.nz * sample.half * u];
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

/**
 * Setts as the wall builder lays its stones: sites scattered over the strip,
 * jittered off a staggered grid, and every stone the patch nearer its own site
 * than any other, so no joint runs straight and two stones share exactly one.
 * Each is a flat-topped prism with a finger's joint round it.
 */
function setts(
  samples: Sample[],
  groundAt: GroundAt,
  profile: Profile,
  rng: Rng,
  wear: number,
  inset: number,
): Part[] {
  const parts: Part[] = [];
  const colour = stoneColours(rng, 0.1);
  const pitch = 0.2;
  const joint = 0.015;
  const chamfer = 0.012 + 0.02 * wear;
  const length = samples[samples.length - 1].s;

  // Sites in the strip's own plane: s along, t across.
  const rows: { s: number; t: number }[][] = [];
  for (let s = pitch / 2, row = 0; s < length; s += pitch * 0.92, row++) {
    const [sample] = sampleAt(samples, s);
    const reach = sample.half - inset;
    const count = Math.max(1, Math.floor((reach * 2) / pitch));
    const gap = (reach * 2) / count;
    const stagger = row % 2 === 0 ? 0 : gap / 2;
    const sites: { s: number; t: number }[] = [];
    for (let k = 0; k < count; k++) {
      const t = -reach + gap * (k + 0.5) + stagger + rng.around(0, gap * 0.2);
      if (Math.abs(t) > reach - gap * 0.2) continue;
      sites.push({ s: s + rng.around(0, pitch * 0.2), t });
    }
    rows.push(sites);
  }

  const near = pitch * 2.4;
  rows.forEach((sites, row) => {
    for (const site of sites) {
      const [sample] = sampleAt(samples, site.s);
      const reach = sample.half - inset;
      let cell: Cell = [
        { x: site.s - near, y: Math.max(-reach, site.t - near) },
        { x: site.s + near, y: Math.max(-reach, site.t - near) },
        { x: site.s + near, y: Math.min(reach, site.t + near) },
        { x: site.s - near, y: Math.min(reach, site.t + near) },
      ];
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
      if (cell.length < 3) continue;
      const geometry = sett(cell, samples, groundAt, profile, joint, chamfer, SETT_HEIGHT + rng.around(0, 0.003), rng);
      if (geometry) parts.push({ geometry, color: colour(), sway: 0 });
    }
  });
  return parts;
}

interface Cell2 {
  x: number;
  y: number;
}
type Cell = Cell2[];

/** The part of a convex polygon on the near side of a bisector. */
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
  let cx = 0;
  let cy = 0;
  for (const p of cell) {
    cx += p.x / cell.length;
    cy += p.y / cell.length;
  }
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
    const toMid = Math.hypot(cx - b.x, cy - b.y);
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

/** One sett: a flat-topped prism over a cell of the strip's plane, stood on the skin. */
function sett(
  cell: Cell,
  samples: Sample[],
  groundAt: GroundAt,
  profile: Profile,
  joint: number,
  chamfer: number,
  height: number,
  rng: Rng,
): THREE.BufferGeometry | null {
  const foot = drawIn(cell, joint / 2);
  const crown = drawIn(cell, joint / 2 + chamfer);
  if (foot.length < 3 || crown.length < 3) return null;
  let cs = 0;
  let ct = 0;
  for (const p of cell) {
    cs += p.x / cell.length;
    ct += p.y / cell.length;
  }
  const [sample, index] = sampleAt(samples, cs);
  const u = ct / sample.half;
  const [mx, mz] = at(sample, u);
  const cx = mx + sample.tx * (cs - sample.s);
  const cz = mz + sample.tz * (cs - sample.s);
  const base = groundAt(cx, cz) + profile(u, index) - 0.015;
  const top = base + height;
  const world = (p: Cell2, y: number): THREE.Vector3 => {
    const [wsample] = sampleAt(samples, p.x);
    const advance = p.x - wsample.s;
    return new THREE.Vector3(
      wsample.x + wsample.tx * advance + wsample.nx * p.y + rng.around(0, 0.002),
      y + rng.around(0, 0.001),
      wsample.z + wsample.tz * advance + wsample.nz * p.y + rng.around(0, 0.002),
    );
  };
  const b = foot.map((p) => world(p, base));
  const t = crown.map((p) => world(p, top));
  const position: number[] = [];
  const tri = (p: THREE.Vector3, q: THREE.Vector3, r: THREE.Vector3): void => {
    position.push(p.x, p.y, p.z, q.x, q.y, q.z, r.x, r.y, r.z);
  };
  // Wound so the outside faces out: the ring's own sense decides which way round.
  let twice = 0;
  for (let i = 0; i < cell.length; i++) {
    const a = cell[i];
    const c = cell[(i + 1) % cell.length];
    twice += a.x * c.y - c.x * a.y;
  }
  // (s, t) maps to (x, z) with no reflection, and a ring with negative area
  // there is counter-clockwise seen from above: its cap faces up as it is.
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
