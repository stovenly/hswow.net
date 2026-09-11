import * as THREE from 'three';
import type { WaterBody } from '../art/water/body';
import { Flotilla, type Mooring, type FloatOptions } from '../art/water/flotilla';
import { Persistence } from '../art/water/persistence';
import { RippleField } from '../art/water/ripples';
import { windUniforms } from '../art/sway';
import type { WaterRegime } from '../art/water/palettes';
import { createRng } from '../art/random';
import type { AudioEngine } from '../audio/AudioEngine';
import { Emitter } from '../audio/Emitter';
import { createDroplet } from '../audio/oneshots/droplet';
import type { OneShot } from '../audio/Scatter';
import type { Collider } from '../player/Collider';

// The zone's water at run time: the query everything reads, the ripple fields,
// the persistence buffer, the floats and the ropes, and the events the water fires.

export interface WaterQuery {
  body: string;
  regime: WaterRegime;
  /** Mean surface height here, metres. */
  level: number;
  /** level − ground, metres; ≤ 0 on the bank. */
  column: number;
  /** m/s, world xz. */
  flow: [number, number];
  /** The wave function: surface height at a time, the CPU twin of the vertex stage. */
  heightAt(t: number): number;
}

export interface FloatPlacement extends FloatOptions {
  object: THREE.Object3D;
}

/** A mooring built by its entry; the runtime only re-solves it. */
export type MooringPlacement = Mooring;

/** Metres from the camera within which a still body keeps a live ripple field. */
const RIPPLE_RANGE = 60;
/** Frames between re-finding where a river's voice stands. */
const EMITTER_EVERY = 8;

let persistence: Persistence | null = null;
/** One buffer for the whole game: it follows the camera, whichever zone is standing. */
function sharedPersistence(): Persistence {
  return (persistence ??= new Persistence());
}

export class WaterRuntime {
  readonly bodies: readonly WaterBody[];
  readonly flotilla = new Flotilla();
  readonly moorings: Mooring[] = [];
  /** Fired when a fish rises: where, so a one-shot can land there. */
  onRise: ((x: number, y: number, z: number) => void) | null = null;
  onSlap: ((x: number, y: number, z: number, force: number) => void) | null = null;
  /** Moves a soundscape emitter by id; the runtime never holds the soundscape. */
  moveEmitter: ((id: string, position: THREE.Vector3) => void) | null = null;
  /** Drives a mooring's creak: 0 slack, 1 bar-tight. */
  onCreak: ((id: string, tightness: number) => void) | null = null;

  private readonly ripples = new Map<WaterBody, RippleField>();
  private readonly byId = new Map<string, WaterBody>();
  private readonly riseTimers = new Map<WaterBody, number>();
  private readonly rng = createRng(7);
  private frame = 0;
  private readonly lastFeet = new THREE.Vector3(NaN, NaN, NaN);
  private readonly emitterAt = new Map<string, THREE.Vector3>();

  constructor(bodies: readonly WaterBody[], floats: readonly FloatPlacement[], moorings: readonly MooringPlacement[]) {
    this.bodies = bodies;
    for (const body of bodies) this.byId.set(body.id, body);
    for (const f of floats) this.flotilla.add(f.object, { draft: f.draft, radius: f.radius });
    this.moorings.push(...moorings);
    this.flotilla.onSlap = (x, y, z, force) => this.onSlap?.(x, y, z, force);
  }

  get hasWater(): boolean {
    return this.bodies.length > 0;
  }

  /** The body whose surface covers a point, or null. */
  waterAt(x: number, z: number): WaterQuery | null {
    let best: WaterBody | null = null;
    let bestColumn = -Infinity;
    for (const body of this.bodies) {
      if (body.regime === 'fall' || !body.covers(x, z)) continue;
      const column = body.columnAt(x, z);
      if (column > bestColumn) {
        bestColumn = column;
        best = body;
      }
    }
    if (!best || bestColumn <= 0) return null;
    const level = best.levelAt(x, z);
    const body = best;
    return {
      body: body.id,
      regime: body.regime,
      level,
      column: bestColumn,
      flow: body.flowAt(x, z),
      heightAt: (t) => level + body.liftAt(x, z, t, this.waveScale, this.motion),
    };
  }

  /** How far below the nearest surface a point is, and that surface's height. */
  submersionAt(x: number, y: number, z: number): { depth: number; level: number } | null {
    const query = this.waterAt(x, z);
    if (!query) return null;
    return { depth: query.level - y, level: query.level };
  }

  /** Surface height at a point and time, or null off the water. */
  heightAt(x: number, z: number, time: number): number | null {
    const query = this.waterAt(x, z);
    return query ? query.heightAt(time) : null;
  }

  private waveScale = 1;
  private motion = 1;

  /** The sea body, for the persistence pass's swash; the first one wins. */
  get sea(): WaterBody | null {
    return this.bodies.find((b) => b.regime === 'sea') ?? null;
  }

  get persistence(): Persistence {
    return sharedPersistence();
  }

  /** CPU work: floats, ropes, fish, the player's wake, the rivers' voices. */
  update(dt: number, time: number, feet: THREE.Vector3, listener: THREE.Vector3, waveScale: number, motion: number): void {
    this.waveScale = waveScale;
    this.motion = motion;
    this.frame++;
    const buffer = sharedPersistence();

    this.flotilla.update(dt, time, (x, z, t) => this.heightAt(x, z, t), buffer);
    for (const mooring of this.moorings) {
      mooring.update();
      this.onCreak?.(mooring.mesh.name.slice('mooring:'.length), mooring.tightness);
    }

    // The player: rings at each step in the shallows, a wake while swimming.
    const here = this.waterAt(feet.x, feet.z);
    if (here && here.column > 0.05) {
      const moved = Number.isNaN(this.lastFeet.x) ? Infinity : Math.hypot(feet.x - this.lastFeet.x, feet.z - this.lastFeet.z);
      const swimming = here.column > 1.2;
      if (moved > (swimming ? 0.25 : 0.45)) {
        const body = this.byId.get(here.body);
        const ripple = body ? this.ripples.get(body) : undefined;
        if (ripple && here.regime === 'still') ripple.impulse(feet.x, feet.z, swimming ? 0.6 : 0.3, swimming ? 0.03 : 0.02);
        else buffer.stamp({ x: feet.x, z: feet.z, radius: swimming ? 0.7 : 0.4, foam: swimming ? 0.7 : 0.45, wet: 0 });
        this.lastFeet.copy(feet);
      }
    } else {
      this.lastFeet.set(NaN, NaN, NaN);
    }

    for (const body of this.bodies) {
      // A fall's plunge: a continuous impulse or a continuous stamp in the lower body.
      if (body.fall) {
        const lower = body.fall.lower ? this.byId.get(body.fall.lower) : undefined;
        const ripple = lower ? this.ripples.get(lower) : undefined;
        const r = body.fall.width / 2;
        if (ripple && lower?.regime === 'still') {
          ripple.impulse(body.fall.x, body.fall.z, Math.max(0.3, r), 0.004 * Math.min(2, body.fall.drop));
        } else {
          const count = Math.max(4, Math.round(r * 6));
          for (let i = 0; i < count; i++) {
            const a = (i / count) * Math.PI * 2 + time * 0.7;
            buffer.stamp({ x: body.fall.x + Math.cos(a) * r, z: body.fall.z + Math.sin(a) * r, radius: Math.max(0.3, r * 0.6), foam: 0.85, wet: 0 });
          }
        }
      }

      // Fish rising, at the rate the body asked for.
      const rate = body.spec.rise ?? 0;
      if (rate > 0 && (body.regime === 'still' || body.regime === 'flow')) {
        let timer = this.riseTimers.get(body) ?? -Math.log(1 - this.rng()) * (60 / rate);
        timer -= dt;
        if (timer <= 0) {
          timer = -Math.log(1 - this.rng()) * (60 / rate);
          for (let tries = 0; tries < 10; tries++) {
            const x = body.bounds.minX + this.rng() * (body.bounds.maxX - body.bounds.minX);
            const z = body.bounds.minZ + this.rng() * (body.bounds.maxZ - body.bounds.minZ);
            if (body.columnAt(x, z) < 0.6) continue;
            const ripple = this.ripples.get(body);
            if (ripple) ripple.impulse(x, z, 0.25, 0.02);
            else buffer.stamp({ x, z, radius: 0.3, foam: 0.5, wet: 0 });
            this.onRise?.(x, body.levelAt(x, z), z);
            break;
          }
        }
        this.riseTimers.set(body, timer);
      }

      // A river's voice: the point on the course nearest the listener, re-found
      // every eighth frame and moved only when it has gone somewhere.
      if (body.regime === 'flow' && body.samples.length > 0 && this.frame % EMITTER_EVERY === 0 && this.moveEmitter) {
        let best = body.samples[0];
        let bestD = Infinity;
        for (const s of body.samples) {
          const d = (s.x - listener.x) ** 2 + (s.z - listener.z) ** 2;
          if (d < bestD) {
            bestD = d;
            best = s;
          }
        }
        const id = `${body.id}:flow`;
        let at = this.emitterAt.get(id);
        if (!at) {
          at = new THREE.Vector3(best.x, best.level, best.z);
          this.emitterAt.set(id, at);
          this.moveEmitter(id, at);
        } else if (Math.hypot(at.x - best.x, at.z - best.z) > 1.5) {
          at.set(best.x, best.level, best.z);
          this.moveEmitter(id, at);
        }
      }
    }
  }

  /** GPU work, inside the water pass: the ripple fields step and the buffer decays. */
  step(renderer: THREE.WebGLRenderer, camera: THREE.Camera, dt: number, motion: number): void {
    const cam = _camera.setFromMatrixPosition(camera.matrixWorld);
    for (const body of this.bodies) {
      if (body.regime !== 'still' || body.spec.ripples === false) continue;
      const b = body.bounds;
      const dx = Math.max(b.minX - cam.x, 0, cam.x - b.maxX);
      const dz = Math.max(b.minZ - cam.z, 0, cam.z - b.maxZ);
      const near = Math.hypot(dx, dz) < RIPPLE_RANGE;
      let ripple = this.ripples.get(body);
      if (near && !ripple) {
        const area = (b.maxX - b.minX) * (b.maxZ - b.minZ);
        ripple = new RippleField(b.minX, b.minZ, b.maxX - b.minX, b.maxZ - b.minZ, area > 400 ? 256 : 128);
        this.ripples.set(body, ripple);
        body.ripple = ripple;
      } else if (!near && ripple) {
        ripple.dispose();
        this.ripples.delete(body);
        body.ripple = null;
        continue;
      }
      if (!ripple) continue;
      ripple.rain(dt, (x, z) => body.columnAt(x, z) > 0.05, () => this.rng());
      ripple.step(renderer, dt, motion);
    }
    sharedPersistence().update(renderer, cam.x, cam.z, motion, this.sea);
  }

  dispose(): void {
    for (const ripple of this.ripples.values()) ripple.dispose();
    this.ripples.clear();
    for (const body of this.bodies) body.ripple = null;
  }
}

const _camera = new THREE.Vector3();

/** The wave clock every twin reads: `swayTime`. */
export function waterTime(): number {
  return windUniforms.swayTime.value as number;
}

// --- one-shots the water fires ---------------------------------------------------

/**
 * A few droplet voices for what the water does on its own: a fish taking
 * something off the surface, a hull slapping down. Pooled, because a splash
 * with no free voice is dropped rather than queued.
 */
export class WaterVoices {
  private readonly voices: { shot: OneShot; emitter: Emitter; busyUntil: number }[] = [];
  private readonly context: BaseAudioContext;

  constructor(engine: AudioEngine) {
    this.context = engine.context;
    for (const kind of ['rise', 'rise', 'plunk', 'plunk'] as const) {
      const shot = createDroplet(engine, { kind, gain: kind === 'rise' ? 0.5 : 0.6 });
      this.voices.push({
        shot,
        busyUntil: 0,
        emitter: new Emitter(engine, shot, { position: new THREE.Vector3(), refDistance: 3, maxDistance: 30, rolloff: 1.3, reverb: 0.35 }),
      });
    }
  }

  fire(kind: 'rise' | 'plunk', x: number, y: number, z: number, force: number): void {
    const at = this.context.currentTime + 0.02;
    const wanted = kind === 'rise' ? [0, 1] : [2, 3];
    const voice = wanted.map((i) => this.voices[i]).find((v) => v.busyUntil <= at);
    if (!voice) return;
    voice.emitter.moveTo(_point.set(x, y, z));
    voice.busyUntil = at + voice.shot.fire(at, force);
  }

  update(dt: number, collider: Collider, retestOcclusion: boolean): void {
    for (const voice of this.voices) voice.emitter.update(dt, collider, retestOcclusion);
  }

  setActive(active: boolean): void {
    for (const voice of this.voices) voice.emitter.enabled = active;
  }

  dispose(): void {
    for (const voice of this.voices) voice.emitter.dispose();
  }
}

const _point = new THREE.Vector3();
