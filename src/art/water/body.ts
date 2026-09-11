import * as THREE from 'three';
import { WATER_LAYER } from '../../layers';
import { createParticles } from '../particles';
import { WaterField, type Disc } from './field';
import {
  apronSurface,
  appendSurface,
  emptySurface,
  insideRing,
  nearestSample,
  outlineSurface,
  ribbonInside,
  ribbonSurface,
  ringBounds,
  sampleCourse,
  sheetSurface,
  surfaceGeometry,
  type CoursePoint,
  type CourseSample,
  type Point,
} from './geometry';
import { WATER_MATERIAL, REGIME_CODE } from './material';
import { waterPalette, type WaterPalette, type WaterRegime } from './palettes';
import { seaLift, swellState, type Swell, type SwellState } from './waves';
import type { RippleField } from './ripples';
import { windUniforms } from '../sway';

// A body of water: its shape on the ground, its regime, its field, and one mesh.

export interface WaterBodySpec {
  id: string;
  regime: WaterRegime;
  palette?: string | Partial<WaterPalette>;
  level?: number;
  shape?: readonly Point[];
  course?: readonly CoursePoint[];
  fall?: { from: Point; to: Point; width: number; throw?: number };
  reach?: number;
  swell?: Swell;
  shelter?: string;
  facet?: number;
  segment?: number;
  bury?: number;
  ripples?: boolean;
  /** Wash-line width against the bank, metres. */
  wash?: number;
  /** Collar width round what stands in it, metres. */
  collar?: number;
  /** Scales the wind's agitation and the chop. */
  chop?: number;
  /** Fish rising per minute. */
  rise?: number;
}

/** A region as `PatchShape` spells it, for the shelter. */
export type ShelterShape =
  | { kind: 'path'; through: readonly Point[]; width: number }
  | { kind: 'blot'; at: Point; radius: number }
  | { kind: 'field'; min: Point; max: Point };

export interface WaterContext {
  groundAt(x: number, z: number): number;
  regions: Record<string, readonly ShelterShape[]>;
  /** Every body in the zone, this one included, so a course can end at another's outline. */
  bodies: readonly WaterBodySpec[];
  /** Everything that said `wades`, and every float's footprint. */
  stands: readonly Disc[];
  seed: number;
}

const DEFAULT_BURY = 0.6;
const DEFAULT_SEGMENT = 0.5;
/** Inside a shelter the swell and chop scale by this. */
const SHELTER_CALM = 0.15;
const SHELTER_RAMP = 6;

const courseCache = new WeakMap<WaterBodySpec, CourseSample[]>();

/** The course resampled at half a metre, shared by every body that asks about it. */
function samplesOf(spec: WaterBodySpec): CourseSample[] {
  let held = courseCache.get(spec);
  if (!held) {
    held = spec.course ? sampleCourse(spec.course, spec.segment ?? DEFAULT_SEGMENT) : [];
    courseCache.set(spec, held);
  }
  return held;
}

/** Whether a point lies over a body's authored shape, before any field is baked. */
export function specCovers(spec: WaterBodySpec, x: number, z: number): boolean {
  if (spec.shape && spec.shape.length >= 3) return insideRing(spec.shape, x, z);
  if (spec.course) return ribbonInside(samplesOf(spec), x, z);
  return false;
}

/** A body's surface height at a point, from its spec alone. */
export function specLevelAt(spec: WaterBodySpec, x: number, z: number): number {
  if (spec.course) {
    const samples = samplesOf(spec);
    if (samples.length === 0) return spec.level ?? 0;
    return samples[nearestSample(samples, x, z)].level;
  }
  return spec.level ?? 0;
}

function shapeDistance(shape: ShelterShape, x: number, z: number): number {
  switch (shape.kind) {
    case 'blot':
      return Math.hypot(x - shape.at[0], z - shape.at[1]) - shape.radius;
    case 'field': {
      const dx = Math.max(shape.min[0] - x, x - shape.max[0]);
      const dz = Math.max(shape.min[1] - z, z - shape.max[1]);
      return Math.hypot(Math.max(dx, 0), Math.max(dz, 0)) + Math.min(Math.max(dx, dz), 0);
    }
    case 'path': {
      let nearest = Infinity;
      const pts = shape.through;
      if (pts.length === 1) nearest = Math.hypot(x - pts[0][0], z - pts[0][1]);
      for (let i = 0; i + 1 < pts.length; i++) {
        const [ax, az] = pts[i];
        const [bx, bz] = pts[i + 1];
        const dx = bx - ax;
        const dz = bz - az;
        const len2 = dx * dx + dz * dz;
        const t = len2 > 0 ? Math.min(1, Math.max(0, ((x - ax) * dx + (z - az) * dz) / len2)) : 0;
        nearest = Math.min(nearest, Math.hypot(x - (ax + dx * t), z - (az + dz * t)));
      }
      return nearest - shape.width / 2;
    }
  }
}

/** Course samples bucketed on a grid, so a texel finds its nearest sample without a scan. */
class SampleIndex {
  private readonly cell: number;
  private readonly buckets = new Map<string, number[]>();
  constructor(
    private readonly samples: readonly CourseSample[],
    maxWidth: number,
  ) {
    this.cell = Math.max(2, maxWidth / 2 + 2);
    samples.forEach((s, i) => {
      const key = this.key(s.x, s.z);
      const list = this.buckets.get(key);
      if (list) list.push(i);
      else this.buckets.set(key, [i]);
    });
  }
  private key(x: number, z: number): string {
    return `${Math.floor(x / this.cell)},${Math.floor(z / this.cell)}`;
  }
  /** Index of the nearest sample within a neighbourhood, or −1 when none is near. */
  nearest(x: number, z: number): number {
    const cx = Math.floor(x / this.cell);
    const cz = Math.floor(z / this.cell);
    let best = -1;
    let bestD = Infinity;
    for (let j = -1; j <= 1; j++) {
      for (let i = -1; i <= 1; i++) {
        const list = this.buckets.get(`${cx + i},${cz + j}`);
        if (!list) continue;
        for (const n of list) {
          const s = this.samples[n];
          const d = (s.x - x) ** 2 + (s.z - z) ** 2;
          if (d < bestD) {
            bestD = d;
            best = n;
          }
        }
      }
    }
    return best;
  }
}

export class WaterBody {
  readonly id: string;
  readonly regime: WaterRegime;
  readonly palette: WaterPalette;
  readonly spec: WaterBodySpec;
  readonly root: THREE.Object3D;
  readonly mesh: THREE.Mesh;
  readonly field: WaterField | null;
  readonly swell: SwellState;
  /** The authored outline, for still and sea bodies. */
  readonly ring: readonly Point[] | null;
  readonly samples: readonly CourseSample[];
  /** Where the surface may be, for the query and for culling the ripple field. */
  readonly bounds: { minX: number; minZ: number; maxX: number; maxZ: number };
  /** A fall's foot: where its plunge lands, and which body it lands in. */
  readonly fall: { x: number; z: number; width: number; drop: number; lower: string | null } | null = null;
  /** Set by the runtime while the body is within ripple range. */
  ripple: RippleField | null = null;
  private readonly level: number;
  private readonly chop: number;
  private readonly bury: number;
  private readonly sampleIndex: SampleIndex | null;

  constructor(spec: WaterBodySpec, ctx: WaterContext) {
    this.spec = spec;
    this.id = spec.id;
    this.regime = spec.regime;
    this.palette = waterPalette(spec.palette, spec.regime);
    this.bury = spec.bury ?? DEFAULT_BURY;
    this.chop = spec.chop ?? 1;
    this.swell = swellState(spec.swell);
    const segment = spec.segment ?? DEFAULT_SEGMENT;
    const surface = emptySurface();
    let level = spec.level ?? 0;
    let samples: CourseSample[] = [];
    let ring: Point[] | null = null;
    let field: WaterField | null = null;
    let sampleIndex: SampleIndex | null = null;
    let bounds = { minX: 0, minZ: 0, maxX: 0, maxZ: 0 };

    if (spec.regime === 'fall' && spec.fall) {
      const { from, to, width } = spec.fall;
      const upper = ctx.bodies.find((b) => b !== spec && b.regime !== 'fall' && specCovers(b, from[0], from[1]));
      const lower = ctx.bodies.find((b) => b !== spec && b.regime !== 'fall' && specCovers(b, to[0], to[1]));
      const lip = upper ? specLevelAt(upper, from[0], from[1]) : spec.level ?? ctx.groundAt(from[0], from[1]);
      const pool = lower ? specLevelAt(lower, to[0], to[1]) : ctx.groundAt(to[0], to[1]);
      const drop = Math.max(lip - pool, 0.05);
      const throwOut = spec.fall.throw ?? drop / 4;
      appendSurface(surface, sheetSurface(from, lip, to, pool, width, throwOut));
      level = lip;
      let dx = to[0] - from[0];
      let dz = to[1] - from[1];
      const dl = Math.hypot(dx, dz) || 1;
      dx /= dl;
      dz /= dl;
      this.fall = { x: from[0] + dx * throwOut, z: from[1] + dz * throwOut, width, drop, lower: lower?.id ?? null };
      bounds = {
        minX: Math.min(from[0], to[0]) - width,
        minZ: Math.min(from[1], to[1]) - width,
        maxX: Math.max(from[0], to[0]) + width,
        maxZ: Math.max(from[1], to[1]) + width,
      };
    } else if (spec.regime === 'flow' && spec.course) {
      samples = samplesOf(spec).slice();
      // A course ending inside another body ends at that body's outline, at its level.
      const receiving = ctx.bodies.find(
        (b) => b !== spec && b.regime !== 'flow' && b.regime !== 'fall' && spec.course && b.shape && insideRing(b.shape, ...(spec.course[spec.course.length - 1].at as [number, number])),
      );
      if (receiving?.shape) {
        const cut = samples.findIndex((s) => insideRing(receiving.shape as readonly Point[], s.x, s.z));
        if (cut > 0) {
          samples.length = cut + 1;
          samples[cut] = { ...samples[cut], level: receiving.level ?? 0 };
        }
      }
      for (let i = 1; i < samples.length; i++) {
        if (samples[i].level > samples[i - 1].level + 1e-3) {
          console.warn(`water "${spec.id}": level rises downstream at ${samples[i].s.toFixed(1)} m`);
          break;
        }
      }
      appendSurface(surface, ribbonSurface(samples, this.bury));
      level = samples[0]?.level ?? level;
      let maxWidth = 0;
      for (const s of samples) maxWidth = Math.max(maxWidth, s.width);
      const b = ringBounds(samples.map((s) => [s.x, s.z] as Point));
      const pad = maxWidth / 2 + this.bury + 2;
      bounds = { minX: b.minX - pad, minZ: b.minZ - pad, maxX: b.maxX + pad, maxZ: b.maxZ + pad };
      sampleIndex = new SampleIndex(samples, maxWidth);
    } else if (spec.shape && spec.shape.length >= 3) {
      ring = [...spec.shape];
      appendSurface(surface, outlineSurface(ring, level, segment, this.bury));
      const reach = spec.reach ?? (spec.regime === 'sea' ? 3000 : 0);
      if (reach > 0) appendSurface(surface, apronSurface(ring, level, segment, reach, ctx.groundAt));
      const b = ringBounds(ring);
      const pad = spec.regime === 'sea' ? 8 : this.bury + 2;
      bounds = { minX: b.minX - pad, minZ: b.minZ - pad, maxX: b.maxX + pad, maxZ: b.maxZ + pad };
    }

    this.level = level;
    this.ring = ring;
    this.samples = samples;
    this.sampleIndex = sampleIndex;
    this.bounds = bounds;

    if (spec.regime !== 'fall' && (ring || samples.length > 0)) {
      const width = bounds.maxX - bounds.minX;
      const depth = bounds.maxZ - bounds.minZ;
      const texel = spec.regime === 'sea' || width * depth > 150 * 150 ? 1 : 0.5;
      const shelter = spec.shelter ? ctx.regions[spec.shelter] : undefined;
      const mouths: Disc[] = [];
      if (ring) {
        for (const other of ctx.bodies) {
          if (other === spec || other.regime !== 'flow' || !other.course) continue;
          const last = other.course[other.course.length - 1].at;
          if (!insideRing(ring, last[0], last[1])) continue;
          const theirs = samplesOf(other);
          const mouth = theirs.find((s) => insideRing(ring as readonly Point[], s.x, s.z)) ?? theirs[theirs.length - 1];
          if (mouth) mouths.push({ x: mouth.x, z: mouth.z, radius: mouth.width / 2 + 1 });
        }
      }
      field = new WaterField({
        x0: bounds.minX,
        z0: bounds.minZ,
        width,
        depth,
        texel,
        level: (x, z) => this.levelAt(x, z),
        inside: (x, z) => (ring ? insideRing(ring, x, z) : ribbonInside(samples, x, z)),
        groundAt: ctx.groundAt,
        flowAt: samples.length > 0 ? (x, z) => this.courseFlow(x, z, ctx.groundAt) : undefined,
        stands: ctx.stands,
        mouths,
        sea: spec.regime === 'sea' ? { direction: [this.swell.dx, this.swell.dz], k0: this.swell.k0 } : undefined,
        calmAt: shelter
          ? (x, z) => {
              let d = Infinity;
              for (const shape of shelter) d = Math.min(d, shapeDistance(shape, x, z));
              const t = Math.min(1, Math.max(0, (d + SHELTER_RAMP / 2) / SHELTER_RAMP));
              return SHELTER_CALM + (1 - SHELTER_CALM) * (t * t * (3 - 2 * t));
            }
          : undefined,
      });
    }
    this.field = field;

    const geometry = surfaceGeometry(surface);
    this.mesh = new THREE.Mesh(geometry, WATER_MATERIAL);
    this.mesh.name = `water:${spec.id}`;
    this.mesh.layers.set(WATER_LAYER);
    this.mesh.userData.noCollide = true;
    this.mesh.userData.water = true;
    this.mesh.frustumCulled = spec.regime !== 'sea' && !(spec.reach && spec.reach > 0);
    this.mesh.onBeforeRender = () => this.bind(WATER_MATERIAL.uniforms);

    if (this.fall) {
      this.root = new THREE.Group();
      this.root.add(this.mesh);
      const { x, z, width, drop } = this.fall;
      const pool = level - drop;
      const mist = createParticles(
        {
          count: Math.max(8, Math.round(width * drop * 6)),
          shape: 'billboard',
          motion: 'rise',
          volume: { kind: 'emitter', spread: width * 0.6 },
          size: [0.25, 0.5],
          colour: this.palette.foam,
          opacity: 0.32,
          speed: [0.25, 0.6],
          life: 2,
          rest: 0.6,
          growth: 1.6,
          windDrag: 0.6,
          turbulence: 0.3,
          weather: false,
        },
        ctx.seed,
      );
      mist.position.set(x, pool + 0.1, z);
      const splash = createParticles(
        {
          count: Math.max(6, Math.round(width * drop * 3)),
          shape: 'billboard',
          motion: 'ballistic',
          volume: { kind: 'emitter', spread: width * 0.5 },
          size: [0.03, 0.06],
          colour: this.palette.foam,
          opacity: 0.85,
          speed: [1.2, 2.8],
          gravity: 9.8,
          life: 0.7,
          rest: 1.2,
          weather: false,
        },
        ctx.seed + 1,
      );
      splash.position.set(x, pool + 0.05, z);
      this.root.add(mist, splash);
    } else {
      this.root = this.mesh;
    }
  }

  /** The mean surface height at a point: one number on a still body, the course's on a river. */
  levelAt(x: number, z: number): number {
    if (this.sampleIndex) {
      const n = this.sampleIndex.nearest(x, z);
      return n >= 0 ? this.samples[n].level : this.level;
    }
    return this.level;
  }

  private courseFlow(x: number, z: number, groundAt: (x: number, z: number) => number): readonly [number, number] {
    const n = this.sampleIndex?.nearest(x, z) ?? -1;
    if (n < 0) return [0, 0];
    const s = this.samples[n];
    // Slowed to nothing over the last 0.8 m of depth at the banks.
    const column = Math.min(1, Math.max(0, (s.level - groundAt(x, z)) / 0.8));
    const scale = s.speed * column * column * (3 - 2 * column);
    return [s.tx * scale, s.tz * scale];
  }

  covers(x: number, z: number): boolean {
    return x >= this.bounds.minX && x <= this.bounds.maxX && z >= this.bounds.minZ && z <= this.bounds.maxZ;
  }

  /** Column at a point, metres; ≤ 0 off the water. */
  columnAt(x: number, z: number): number {
    if (!this.field || !this.field.covers(x, z)) return -1;
    return this.field.sample(this.field.column, x, z);
  }

  flowAt(x: number, z: number): [number, number] {
    if (!this.field || !this.field.covers(x, z)) return [0, 0];
    return [this.field.sample(this.field.flowX, x, z), this.field.sample(this.field.flowZ, x, z)];
  }

  /** The wave height above the level at a point and time, the CPU twin of the vertex stage. */
  liftAt(x: number, z: number, time: number, waveScale: number, motion: number): number {
    if (this.regime !== 'sea' || !this.field) return 0;
    const wind = windUniforms.windDir.value as THREE.Vector2;
    return seaLift(this.field, this.swell, x, z, time, waveScale, motion, this.chop, wind.x, wind.y);
  }

  /** Pushes this body into the shared material. Also used by the persistence pass for the sea's swash. */
  bind(u: Record<string, THREE.IUniform>): void {
    const f = this.field;
    if ('uRegime' in u) u.uRegime.value = REGIME_CODE[this.regime];
    u.tFieldA.value = f?.textureA ?? null;
    u.tFieldB.value = f?.textureB ?? null;
    if (f) {
      (u.uFieldMin.value as THREE.Vector2).set(f.x0, f.z0);
      (u.uFieldSize.value as THREE.Vector2).set(f.width, f.depth);
    } else {
      (u.uFieldSize.value as THREE.Vector2).set(-1, -1);
    }
    u.uLevel.value = this.level;
    (u.uSwell.value as THREE.Vector4).set(this.swell.dx, this.swell.dz, this.swell.k0, this.swell.amp);
    u.uOmega.value = this.swell.omega;
    u.uRunup.value = this.swell.runup;
    u.uChop.value = this.chop;
    if (!('uShallow' in u)) return;
    (u.uShallow.value as THREE.Color).set(this.palette.shallow);
    (u.uDeep.value as THREE.Color).set(this.palette.deep);
    (u.uFoam.value as THREE.Color).set(this.palette.foam);
    (u.uScatter.value as THREE.Color).set(this.palette.scatter);
    u.uBands.value = this.palette.bands;
    u.uFacet.value = this.spec.facet ?? (this.regime === 'sea' || (this.spec.reach ?? 0) > 0 ? 0.6 : 0);
    u.uShoreDepth.value = this.regime === 'sea' ? 1.6 : 1.1;
    u.uClarity.value = this.regime === 'sea' ? 1.4 : 0.9;
    u.uWash.value = this.spec.wash ?? 0.25;
    u.uCollar.value = this.spec.collar ?? 0.3;
    if (this.fall) {
      u.uFallDrop.value = this.fall.drop;
      u.uFallSpeed.value = Math.sqrt(9.81 / this.fall.drop) * 0.5;
    }
    if (this.ripple) {
      u.tRipple.value = this.ripple.texture;
      (u.uRippleMin.value as THREE.Vector2).copy(this.ripple.min);
      (u.uRippleSize.value as THREE.Vector2).copy(this.ripple.size);
      u.uRippleOn.value = 1;
    } else {
      u.uRippleOn.value = 0;
    }
  }

  dispose(): void {
    this.mesh.geometry.dispose();
    this.field?.dispose();
  }
}
