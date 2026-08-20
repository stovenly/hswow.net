import { FABRICS, type Fabric } from './fabrics';

/**
 * Position-based cloth: Verlet integration plus constraint projection. A leaf
 * module of plain arrays and arithmetic, no renderer types, so it can be stepped
 * headless. Simulated cloth does not pass through the body it hangs on —
 * collision is a position projection run last every substep, so penetration is
 * undone rather than discouraged, and margins plus a displacement cap close the
 * particles-out-vs-triangles-out gap.
 */

export type ClothCollider =
  | { kind: 'sphere'; at: readonly [number, number, number]; radius: number }
  | {
      kind: 'capsule';
      a: readonly [number, number, number];
      b: readonly [number, number, number];
      radius: number;
    }
  | { kind: 'ground'; y: number };

export interface ClothSpec {
  /** Particles across. */
  cols: number;
  /** Particles down. */
  rows: number;
  /** Rest positions, row-major `(row * cols + col) * 3`, in the prop's own frame. */
  rest: Float32Array;
  /** Particles written from their rest position each step rather than integrated. */
  pins: readonly number[];
  /** A `FABRICS` name. Absent from the table fails loudly — never a default. */
  fabric: string;
  colliders: readonly ClothCollider[];
  /** Decorrelates the wind wander between neighbouring cloths. */
  seed?: number;
}

/** What one step of wind looks like from inside the cloth's own frame. */
export interface ClothWind {
  /** Unit direction, horizontal, already rotated into the cloth's local frame. */
  x: number;
  z: number;
  /** Field strength 0..1, the sway option already composed in. */
  strength: number;
  /** The clock, for the per-cloth wander noise. */
  time: number;
}

/** 60 Hz outer step, three substeps — stiffness bought with small steps, not iterations. */
const OUTER_DT = 1 / 60;
const SUBSTEPS = 3;
/**
 * The accumulator clamps at three outer steps of debt and drops the rest: on a
 * hitch the cloth runs briefly in slow motion, which is invisible; a catch-up
 * burst through a huge dt is a cloth exploding, which is not.
 */
const MAX_DEBT = 3 * OUTER_DT;
const OUTER_DT_INV = 60;
const GRAVITY = 9.8;
/** Metres per second of air at field strength 1. */
const WIND_SPEED = 13;
/** Tangential velocity lost at a contact, so cloth slides down a shoulder. */
const FRICTION = 0.6;
/**
 * Below this tangential speed a contact sticks outright — static friction.
 * Without it, numeric creep walks a balanced sheet off its bar millimetre by
 * millimetre, which kinetic damping can slow but never stop.
 */
const STICK_SPEED = 0.18;
/** Areal density at fabric weight 1, kg/m². Only ratios matter. */
const DENSITY = 0.45;

/**
 * The margin rule, as the exact chord bound rather than a flat fraction: an edge
 * whose endpoints both clear a collider of radius `r` by `√(r² + (s/2)²) − r`
 * cannot sag through it, whatever the spacing `s`. A flat plane needs no sag
 * margin at all — a chord between two points above it never dips below them.
 */
function chordMargin(radius: number, spacing: number): number {
  const half = spacing / 2;
  return Math.sqrt(radius * radius + half * half) - radius;
}

/** Same integer-mix noise the weather uses; the sine trick has structure in it. */
function hash(n: number): number {
  let x = Math.imul(n | 0, 0x27d4eb2d);
  x ^= x >>> 15;
  x = Math.imul(x, 0x85ebca6b);
  x ^= x >>> 13;
  return (x >>> 0) / 4294967296;
}

function valueNoise(t: number): number {
  const i = Math.floor(t);
  const f = t - i;
  const blend = (1 - Math.cos(f * Math.PI)) * 0.5;
  return hash(i) * (1 - blend) + hash(i + 1) * blend;
}

export class ClothSim {
  readonly cols: number;
  readonly rows: number;
  readonly count: number;
  readonly fabric: Fabric;
  readonly fabricName: string;
  readonly colliders: readonly ClothCollider[];
  readonly pins: readonly number[];
  /** Current particle positions, local frame. What the skin reads. */
  readonly positions: Float32Array;
  /** Mean structural rest length — the grid's own scale, used by every margin. */
  readonly spacing: number;
  /** The rest pose, kept for pins and for the tether anchors. */
  readonly rest: Float32Array;
  /** Longest tether slack, for a conservative bounding sphere. Zero when pinless. */
  readonly maxTether: number;

  private readonly prev: Float32Array;
  private readonly invMass: Float32Array;
  private readonly accel: Float32Array;
  /** Structural and shear edges: index pairs and rest lengths. Projected fully. */
  private readonly edges: Int32Array;
  private readonly edgeRest: Float32Array;
  /** Bend pairs — second neighbours — projected at the fabric's stiffness. */
  private readonly bends: Int32Array;
  private readonly bendRest: Float32Array;
  /** Per particle: nearest pin index (−1 none) and straight-line slack to it. */
  private readonly tetherPin: Int32Array;
  private readonly tetherMax: Float32Array;
  /** Triangles for wind loading, and each particle's share of the mass. */
  private readonly triangles: Int32Array;
  /** Per collider: how far above its surface a particle is kept. */
  private readonly keep: Float32Array;
  private readonly massInv: number;
  private readonly seed: number;
  private debt = 0;

  constructor(spec: ClothSpec) {
    const { cols, rows } = spec;
    this.cols = cols;
    this.rows = rows;
    this.count = cols * rows;
    const fabric = FABRICS[spec.fabric];
    // `FLEX`'s typo rule: a misspelled fabric that silently defaults is a
    // banner made of the wrong material and nobody knows.
    if (!fabric) throw new Error(`no such fabric: '${spec.fabric}'`);
    this.fabric = fabric;
    this.fabricName = spec.fabric;
    this.colliders = spec.colliders;
    this.pins = spec.pins;
    this.seed = spec.seed ?? 1;

    this.rest = spec.rest.slice();
    this.positions = spec.rest.slice();
    this.prev = spec.rest.slice();
    this.accel = new Float32Array(this.count * 3);

    this.invMass = new Float32Array(this.count).fill(1);
    for (const pin of spec.pins) this.invMass[pin] = 0;

    const at = (r: number, c: number) => r * cols + c;
    const restLength = (a: number, b: number): number => {
      const dx = this.rest[a * 3] - this.rest[b * 3];
      const dy = this.rest[a * 3 + 1] - this.rest[b * 3 + 1];
      const dz = this.rest[a * 3 + 2] - this.rest[b * 3 + 2];
      return Math.sqrt(dx * dx + dy * dy + dz * dz);
    };

    // Structural edges are the fabric; shear diagonals stop the grid folding
    // sideways like a parallelogram linkage.
    const edges: number[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (c + 1 < cols) edges.push(at(r, c), at(r, c + 1));
        if (r + 1 < rows) edges.push(at(r, c), at(r + 1, c));
        if (c + 1 < cols && r + 1 < rows) {
          edges.push(at(r, c), at(r + 1, c + 1));
          edges.push(at(r, c + 1), at(r + 1, c));
        }
      }
    }
    this.edges = Int32Array.from(edges);
    this.edgeRest = new Float32Array(edges.length / 2);
    for (let i = 0; i < this.edgeRest.length; i++) {
      this.edgeRest[i] = restLength(edges[i * 2], edges[i * 2 + 1]);
    }

    const bends: number[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (c + 2 < cols) bends.push(at(r, c), at(r, c + 2));
        if (r + 2 < rows) bends.push(at(r, c), at(r + 2, c));
      }
    }
    this.bends = Int32Array.from(bends);
    this.bendRest = new Float32Array(bends.length / 2);
    for (let i = 0; i < this.bendRest.length; i++) {
      this.bendRest[i] = restLength(bends[i * 2], bends[i * 2 + 1]);
    }

    // Mean structural rest length: the horizontal and vertical edges only.
    let structural = 0;
    let structuralCount = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c + 1 < cols; c++) {
        structural += restLength(at(r, c), at(r, c + 1));
        structuralCount++;
      }
    }
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r + 1 < rows; r++) {
        structural += restLength(at(r, c), at(r + 1, c));
        structuralCount++;
      }
    }
    this.spacing = structural / Math.max(structuralCount, 1);

    // Tethers: a maximum distance from the nearest pin — the straight-line
    // slack the cloth would have hung taut. One cheap constraint per particle
    // that lets a single solver iteration hold a hanging sheet's length.
    this.tetherPin = new Int32Array(this.count).fill(-1);
    this.tetherMax = new Float32Array(this.count);
    let maxTether = 0;
    if (spec.pins.length > 0) {
      for (let i = 0; i < this.count; i++) {
        if (this.invMass[i] === 0) continue;
        let best = -1;
        let bestDist = Infinity;
        for (const pin of spec.pins) {
          const d = restLength(i, pin);
          if (d < bestDist) {
            bestDist = d;
            best = pin;
          }
        }
        this.tetherPin[i] = best;
        this.tetherMax[i] = bestDist;
        maxTether = Math.max(maxTether, bestDist);
      }
    }
    this.maxTether = maxTether;

    // Triangles for the wind, which loads area rather than particles.
    const triangles: number[] = [];
    for (let r = 0; r + 1 < rows; r++) {
      for (let c = 0; c + 1 < cols; c++) {
        triangles.push(at(r, c), at(r + 1, c), at(r, c + 1));
        triangles.push(at(r, c + 1), at(r + 1, c), at(r + 1, c + 1));
      }
    }
    this.triangles = Int32Array.from(triangles);

    // How far off each collider's surface a particle must stay: the drawn
    // thickness plus, for curved surfaces, the chord-sag bound.
    this.keep = new Float32Array(spec.colliders.length);
    for (let i = 0; i < spec.colliders.length; i++) {
      const collider = spec.colliders[i];
      this.keep[i] =
        collider.kind === 'ground'
          ? fabric.thickness
          : fabric.thickness + chordMargin(collider.radius, this.spacing);
    }

    // Every particle carries an equal share of the cloth's mass.
    let area = 0;
    for (let t = 0; t < this.triangles.length; t += 3) {
      area += this.triangleArea(this.rest, t);
    }
    const mass = Math.max(fabric.weight * DENSITY * area, 1e-6) / this.count;
    this.massInv = 1 / mass;
  }

  /**
   * Advances the simulation. Fixed step with an accumulator: determinism for
   * a given start state is what lets anything be asserted about a run.
   */
  step(dt: number, wind: ClothWind): void {
    this.debt = Math.min(this.debt + dt, MAX_DEBT);
    while (this.debt >= OUTER_DT) {
      this.debt -= OUTER_DT;
      this.outerStep(wind);
    }
  }

  /** Wind-muted fixed steps: the pre-drape at build, and the settle on waking. */
  settle(steps: number): void {
    const calm: ClothWind = { x: 1, z: 0, strength: 0, time: 0 };
    for (let i = 0; i < steps; i++) this.outerStep(calm);
    this.debt = 0;
  }

  private outerStep(wind: ClothWind): void {
    const { accel, positions, prev } = this;

    // Gravity always.
    for (let i = 0; i < this.count; i++) {
      accel[i * 3] = 0;
      accel[i * 3 + 1] = -GRAVITY;
      accel[i * 3 + 2] = 0;
    }

    // The wind vector for this outer step: value-noise wander in yaw and a
    // touch of vertical, seeded per cloth, so two adjacent flags are not
    // mirror copies. The force itself is applied per substep — see applyWind.
    let windX = 0;
    let windY = 0;
    let windZ = 0;
    if (wind.strength > 0.001) {
      const yaw = (valueNoise(wind.time * 0.11 + this.seed * 17.7) - 0.5) * 1.1;
      const cos = Math.cos(yaw);
      const sin = Math.sin(yaw);
      const wx = wind.x * cos - wind.z * sin;
      const wz = wind.x * sin + wind.z * cos;
      const wy = (valueNoise(wind.time * 0.23 + this.seed * 31.3) - 0.5) * 0.5;
      const speed = wind.strength * WIND_SPEED;
      const norm = 1 / Math.sqrt(wx * wx + wy * wy + wz * wz);
      windX = wx * norm * speed;
      windY = wy * norm * speed;
      windZ = wz * norm * speed;
    }

    const dt = OUTER_DT / SUBSTEPS;
    const dt2 = dt * dt;
    const damping = this.fabric.damping;
    // The displacement cap: discrete stepping cannot tunnel if steps are
    // smaller than the thinnest collider. Purely the guarantee's backstop.
    const cap = this.spacing * 0.5;

    for (let sub = 0; sub < SUBSTEPS; sub++) {
      // Integrate.
      for (let i = 0; i < this.count; i++) {
        if (this.invMass[i] === 0) {
          // Pinned: written from the rest pose, never integrated.
          positions[i * 3] = this.rest[i * 3];
          positions[i * 3 + 1] = this.rest[i * 3 + 1];
          positions[i * 3 + 2] = this.rest[i * 3 + 2];
          prev[i * 3] = positions[i * 3];
          prev[i * 3 + 1] = positions[i * 3 + 1];
          prev[i * 3 + 2] = positions[i * 3 + 2];
          continue;
        }
        const x = positions[i * 3];
        const y = positions[i * 3 + 1];
        const z = positions[i * 3 + 2];
        let nx = x + (x - prev[i * 3]) * damping + accel[i * 3] * dt2;
        let ny = y + (y - prev[i * 3 + 1]) * damping + accel[i * 3 + 1] * dt2;
        let nz = z + (z - prev[i * 3 + 2]) * damping + accel[i * 3 + 2] * dt2;
        const mx = nx - x;
        const my = ny - y;
        const mz = nz - z;
        const moved = Math.sqrt(mx * mx + my * my + mz * mz);
        if (moved > cap) {
          const scale = cap / moved;
          nx = x + mx * scale;
          ny = y + my * scale;
          nz = z + mz * scale;
        }
        prev[i * 3] = x;
        prev[i * 3 + 1] = y;
        prev[i * 3 + 2] = z;
        positions[i * 3] = nx;
        positions[i * 3 + 1] = ny;
        positions[i * 3 + 2] = nz;
      }

      if (wind.strength > 0.001) this.applyWind(windX, windY, windZ, dt);
      this.projectEdges(this.edges, this.edgeRest, 1);
      this.projectEdges(this.bends, this.bendRest, this.fabric.stiffness);
      this.projectTethers();
      // Last, so it has the final word on where a particle is.
      this.collide();
    }
  }

  /**
   * Wind, per triangle, because wind loads area. The projection onto the normal
   * is what makes cloth behave unlike a tree: square to the wind catches
   * everything, edge-on nothing, so a flag seeks alignment and flutters about it.
   *
   * Applied as a clamped velocity relaxation toward the wind rather than an
   * explicit force: a blend can approach the wind's own speed and never overshoot
   * it, so drag cannot pump energy into a flap.
   */
  private applyWind(windX: number, windY: number, windZ: number, dt: number): void {
    const { positions, prev } = this;
    const invDt = 1 / dt;
    const rate = this.fabric.drag * this.massInv * dt;

    for (let t = 0; t < this.triangles.length; t += 3) {
      const a = this.triangles[t];
      const b = this.triangles[t + 1];
      const c = this.triangles[t + 2];
      // Triangle velocity, from the Verlet state.
      const vx =
        ((positions[a * 3] - prev[a * 3]) +
          (positions[b * 3] - prev[b * 3]) +
          (positions[c * 3] - prev[c * 3])) *
        (invDt / 3);
      const vy =
        ((positions[a * 3 + 1] - prev[a * 3 + 1]) +
          (positions[b * 3 + 1] - prev[b * 3 + 1]) +
          (positions[c * 3 + 1] - prev[c * 3 + 1])) *
        (invDt / 3);
      const vz =
        ((positions[a * 3 + 2] - prev[a * 3 + 2]) +
          (positions[b * 3 + 2] - prev[b * 3 + 2]) +
          (positions[c * 3 + 2] - prev[c * 3 + 2])) *
        (invDt / 3);
      const rx = windX - vx;
      const ry = windY - vy;
      const rz = windZ - vz;

      // Face normal and area from one cross product: |n| = 2 · area.
      const e1x = positions[b * 3] - positions[a * 3];
      const e1y = positions[b * 3 + 1] - positions[a * 3 + 1];
      const e1z = positions[b * 3 + 2] - positions[a * 3 + 2];
      const e2x = positions[c * 3] - positions[a * 3];
      const e2y = positions[c * 3 + 1] - positions[a * 3 + 1];
      const e2z = positions[c * 3 + 2] - positions[a * 3 + 2];
      const nx = e1y * e2z - e1z * e2y;
      const ny = e1z * e2x - e1x * e2z;
      const nz = e1x * e2y - e1y * e2x;
      const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
      if (len < 1e-9) continue;
      const area = len / 2;
      const dot = (rx * nx + ry * ny + rz * nz) / len;
      // The fraction of the normal velocity gap this triangle closes for each
      // of its corners this substep. Clamped: at 1 the corner matches the
      // wind, and past 1 is the instability this formulation exists to avoid.
      const blend = Math.min((rate * area) / 3, 1);
      const push = dot * blend * dt;
      const ix = (nx / len) * push;
      const iy = (ny / len) * push;
      const iz = (nz / len) * push;
      for (const corner of [a, b, c]) {
        if (this.invMass[corner] === 0) continue;
        prev[corner * 3] -= ix;
        prev[corner * 3 + 1] -= iy;
        prev[corner * 3 + 2] -= iz;
      }
    }
  }

  private projectEdges(pairs: Int32Array, rests: Float32Array, stiffness: number): void {
    if (stiffness <= 0) return;
    const positions = this.positions;
    for (let i = 0; i < rests.length; i++) {
      const a = pairs[i * 2];
      const b = pairs[i * 2 + 1];
      const wa = this.invMass[a];
      const wb = this.invMass[b];
      const w = wa + wb;
      if (w === 0) continue;
      const dx = positions[b * 3] - positions[a * 3];
      const dy = positions[b * 3 + 1] - positions[a * 3 + 1];
      const dz = positions[b * 3 + 2] - positions[a * 3 + 2];
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (dist < 1e-9) continue;
      const scale = ((dist - rests[i]) / dist / w) * stiffness;
      positions[a * 3] += dx * scale * wa;
      positions[a * 3 + 1] += dy * scale * wa;
      positions[a * 3 + 2] += dz * scale * wa;
      positions[b * 3] -= dx * scale * wb;
      positions[b * 3 + 1] -= dy * scale * wb;
      positions[b * 3 + 2] -= dz * scale * wb;
    }
  }

  private projectTethers(): void {
    const positions = this.positions;
    for (let i = 0; i < this.count; i++) {
      const pin = this.tetherPin[i];
      if (pin < 0) continue;
      const px = this.rest[pin * 3];
      const py = this.rest[pin * 3 + 1];
      const pz = this.rest[pin * 3 + 2];
      const dx = positions[i * 3] - px;
      const dy = positions[i * 3 + 1] - py;
      const dz = positions[i * 3 + 2] - pz;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      const max = this.tetherMax[i];
      if (dist <= max || dist < 1e-9) continue;
      const scale = max / dist;
      positions[i * 3] = px + dx * scale;
      positions[i * 3 + 1] = py + dy * scale;
      positions[i * 3 + 2] = pz + dz * scale;
    }
  }

  /**
   * Signed-distance projection against every collider, friction included:
   * the tangential part of the implied velocity is kept and scaled, so cloth
   * slides down a shoulder rather than sticking to it.
   */
  private collide(): void {
    const positions = this.positions;
    const prev = this.prev;

    for (let i = 0; i < this.count; i++) {
      if (this.invMass[i] === 0) continue;
      let x = positions[i * 3];
      let y = positions[i * 3 + 1];
      let z = positions[i * 3 + 2];

      for (let ci = 0; ci < this.colliders.length; ci++) {
        const collider = this.colliders[ci];
        let nx = 0;
        let ny = 1;
        let nz = 0;
        let dist = Infinity;
        const keep = this.keep[ci];

        if (collider.kind === 'ground') {
          dist = y - collider.y;
        } else if (collider.kind === 'sphere') {
          const dx = x - collider.at[0];
          const dy = y - collider.at[1];
          const dz = z - collider.at[2];
          const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
          dist = d - collider.radius;
          if (d > 1e-9) {
            nx = dx / d;
            ny = dy / d;
            nz = dz / d;
          }
        } else {
          const ax = collider.a[0];
          const ay = collider.a[1];
          const az = collider.a[2];
          const bx = collider.b[0] - ax;
          const by = collider.b[1] - ay;
          const bz = collider.b[2] - az;
          const lenSq = bx * bx + by * by + bz * bz;
          let t = lenSq > 1e-12 ? ((x - ax) * bx + (y - ay) * by + (z - az) * bz) / lenSq : 0;
          t = t < 0 ? 0 : t > 1 ? 1 : t;
          const cx = ax + bx * t;
          const cy = ay + by * t;
          const cz = az + bz * t;
          const dx = x - cx;
          const dy = y - cy;
          const dz = z - cz;
          const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
          dist = d - collider.radius;
          if (d > 1e-9) {
            nx = dx / d;
            ny = dy / d;
            nz = dz / d;
          }
        }

        if (dist >= keep) continue;
        const push = keep - dist;
        x += nx * push;
        y += ny * push;
        z += nz * push;

        // Friction. Kinetic: the normal part of the implied velocity is removed
        // and the tangential part kept scaled. Static: below the stick speed the
        // tangential displacement is undone too, not just its velocity —
        // constraint projection otherwise ratchets a draped sheet over its bar.
        const vx = x - prev[i * 3];
        const vy = y - prev[i * 3 + 1];
        const vz = z - prev[i * 3 + 2];
        const vn = vx * nx + vy * ny + vz * nz;
        const tx = vx - vn * nx;
        const ty = vy - vn * ny;
        const tz = vz - vn * nz;
        const speed = Math.sqrt(tx * tx + ty * ty + tz * tz) * (OUTER_DT_INV * SUBSTEPS);
        if (speed < STICK_SPEED) {
          x -= tx;
          y -= ty;
          z -= tz;
          prev[i * 3] = x;
          prev[i * 3 + 1] = y;
          prev[i * 3 + 2] = z;
        } else {
          prev[i * 3] = x - tx * (1 - FRICTION);
          prev[i * 3 + 1] = y - ty * (1 - FRICTION);
          prev[i * 3 + 2] = z - tz * (1 - FRICTION);
        }
      }

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
    }
  }

  private triangleArea(from: Float32Array, t: number): number {
    const a = this.triangles[t];
    const b = this.triangles[t + 1];
    const c = this.triangles[t + 2];
    const e1x = from[b * 3] - from[a * 3];
    const e1y = from[b * 3 + 1] - from[a * 3 + 1];
    const e1z = from[b * 3 + 2] - from[a * 3 + 2];
    const e2x = from[c * 3] - from[a * 3];
    const e2y = from[c * 3 + 1] - from[a * 3 + 1];
    const e2z = from[c * 3 + 2] - from[a * 3 + 2];
    const nx = e1y * e2z - e1z * e2y;
    const ny = e1z * e2x - e1x * e2z;
    const nz = e1x * e2y - e1y * e2x;
    return Math.sqrt(nx * nx + ny * ny + nz * nz) / 2;
  }
}
