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

/** A block with its top drawn in, standing on the skin at (s, u). Five faces. */
function block(
  sample: Sample,
  u: number,
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
  const [cx, cz] = at(sample, u);
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
  // Tight courses with a finger's joint, and the tops nearly the full stone.
  const pitch = 0.21;
  const length = samples[samples.length - 1].s;
  for (let s = pitch / 2, course = 0; s < length; s += pitch, course++) {
    const [sample, index] = sampleAt(samples, s);
    const reach = sample.half - inset;
    const across = 0.16;
    const count = Math.max(1, Math.floor((reach * 2) / (across + 0.015)));
    const gap = (reach * 2) / count;
    // Alternate courses half a stone over, as setts are laid.
    const stagger = course % 2 === 0 ? 0 : gap / 2;
    for (let k = 0; k < count; k++) {
      const u = (-reach + gap * (k + 0.5) + stagger + rng.around(0, 0.004)) / sample.half;
      if (Math.abs(u) > 1 - (gap * 0.5) / sample.half) continue;
      parts.push({
        geometry: block(
          sample,
          u,
          groundAt,
          profile,
          index,
          pitch * 0.93,
          gap * 0.9,
          SETT_HEIGHT + rng.around(0, 0.003),
          0.9 - 0.06 * wear,
          0.015,
          rng,
          0.002,
        ),
        color: colour(),
        sway: 0,
      });
    }
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
      const [sample, index] = sampleAt(samples, Math.min(length - 0.01, s + along / 2));
      const reach = sample.half - inset;
      const u = (-reach + across * (row + 0.5)) / sample.half;
      parts.push({
        geometry: block(
          sample,
          u,
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
      const [sample, index] = sampleAt(samples, Math.min(length - 0.01, s + along / 2));
      const u = (side * (sample.half - KERB_WIDTH / 2)) / sample.half;
      parts.push({
        geometry: block(
          sample,
          u,
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
    const [sample, index] = sampleAt(samples, rng.range(0, length));
    const u = rng.range(-0.9, 0.9);
    const size = rng.range(0.08, 0.22);
    parts.push({
      geometry: block(sample, u, groundAt, profile, index, size, size * rng.range(0.6, 1), size * 0.35, 0.6, size * 0.15, rng, size * 0.1),
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
    const [sample, index] = sampleAt(samples, rng.range(0, length));
    // Kicked to the sides: the middle is walked.
    const u = rng.pick([-1, 1]) * Math.sqrt(rng.range(0.15, 1)) * 0.92;
    const size = rng.range(0.035, 0.07);
    parts.push({
      geometry: block(sample, u, groundAt, profile, index, size, size * rng.range(0.7, 1), size * 0.5, 0.5, 0, rng, size * 0.1),
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
