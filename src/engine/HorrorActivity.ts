import * as THREE from 'three';
import { horrorUniforms, MAX_HORRORS } from '../art/horror';
import { ownerIdFor, maskState } from '../art/effectId';
import type { HorrorEffectName, HorrorPlacement, HorrorSpec } from './Horror';

/**
 * Drives every horror volume in the active zone — `GlitchActivity`'s twin:
 * collected on zone prepare, released on evict, packed per frame for the zone
 * you stand in, attached volumes re-reading their object's world matrix.
 *
 * One departure: **two strengths per volume** — a steady one for the effects
 * that must not blink (pallor, stretch, lean) and a fit one for the motion
 * effects — long stillness, then a violent fit, which is the temporal shape of
 * a haunting where glitch's is a malfunction.
 */

/** Past this, a volume is left out of the pack entirely. */
const RANGE = 45;

/** Dev-only: the showcase's steady dial. Null follows each spec's own. */
let override: number | null = null;
export function setHorrorOverride(strength: number | null): void {
  override = strength;
}

/** Dev-only freeze: holds the clock, so a fit can be studied mid-air. */
let frozen = false;
export function setHorrorFrozen(on: boolean): void {
  frozen = on;
}

/**
 * Weight lanes in uniform order — vertex A, vertex B, surface. Mirrors the
 * packing documented on `horrorUniforms`.
 */
const LANES = [
  'tremor',
  'judder',
  'headshake',
  'breathe',
  'stretch',
  'lean',
  'pallor',
  'flicker',
  'shroud',
] as const satisfies readonly HorrorEffectName[];

interface Tracked {
  /** Null for a free-standing placement; the centre then never moves. */
  object: THREE.Object3D | null;
  spec: HorrorSpec;
  at: THREE.Vector3;
  /** Radii, floored off zero so the shader's divide is always defined. */
  size: THREE.Vector3;
  shape: number;
  seed: number;
  intSeed: number;
  /** Owner id for attached volumes, 0 for free-standing. See art/effectId.ts. */
  owner: number;
  /** Resolved weights, in `LANES` order. */
  lanes: Float32Array;
  distSq: number;
}

export class HorrorActivity {
  private readonly zones = new Map<string, Tracked[]>();
  private readonly near: Tracked[] = [];
  private clock = 0;
  /** Volumes packed last frame, for readouts. */
  live = 0;

  /** Records every horror in a freshly built zone — placements, then marks. */
  collect(id: string, root: THREE.Object3D, placements: readonly HorrorPlacement[]): void {
    const tracked: Tracked[] = [];

    for (const placement of placements) {
      tracked.push(entryFor(null, placement, placement.center));
    }

    root.traverse((object) => {
      const spec = object.userData.horror as HorrorSpec | undefined;
      if (!spec) return;
      object.updateWorldMatrix(true, false);
      tracked.push(entryFor(object, spec, null));
    });

    if (tracked.length) this.zones.set(id, tracked);
  }

  release(id: string): void {
    this.zones.delete(id);
  }

  clear(): void {
    this.zones.clear();
  }

  /**
   * Packs the active zone's volumes into the shared uniform store. Once a
   * frame, before the frame that reads it.
   */
  update(id: string | null, elapsed: number, eye: THREE.Vector3): void {
    if (!frozen) this.clock = elapsed;
    const t = this.clock;
    const u = horrorUniforms;
    const tracked = id ? this.zones.get(id) : undefined;
    let count = 0;

    if (tracked) {
      const near = this.near;
      near.length = 0;
      const limit = RANGE * RANGE;

      for (const entry of tracked) {
        if (entry.object) {
          const om = entry.object.matrixWorld.elements;
          const offset = entry.spec.offset;
          entry.at.set(
            om[12] + (offset?.x ?? 0),
            om[13] + (offset?.y ?? 0),
            om[14] + (offset?.z ?? 0),
          );
        }
        const dx = entry.at.x - eye.x;
        const dy = entry.at.y - eye.y;
        const dz = entry.at.z - eye.z;
        entry.distSq = dx * dx + dy * dy + dz * dz;
        if (entry.distSq <= limit) near.push(entry);
      }

      if (near.length > MAX_HORRORS) near.sort((a, b) => a.distSq - b.distSq);

      let owned = 0;
      for (let i = 0; i < near.length && count < MAX_HORRORS; i++, count++) {
        const entry = near[i];
        const spec = entry.spec;
        let steady: number;
        let fit: number;
        if (override !== null) {
          // The override is steady on purpose: it exists for judging an
          // effect, and a fit arriving mid-judgement is what it turns off.
          steady = clamp01(override);
          fit = steady;
        } else {
          const strength = clamp01(spec.strength);
          steady = strength;
          fit = Math.min(strength * sampleFit(entry.intSeed, spec.tempo ?? 1, strength, t), 1);
        }
        if (entry.owner && steady > 0.004) owned++;
        const l = entry.lanes;

        (u.uHorrorCentre.value[count] as THREE.Vector4).set(
          entry.at.x,
          entry.at.y,
          entry.at.z,
          entry.shape,
        );
        (u.uHorrorSize.value[count] as THREE.Vector4).set(
          entry.size.x,
          entry.size.y,
          entry.size.z,
          steady,
        );
        (u.uHorrorVertexA.value[count] as THREE.Vector4).set(l[0], l[1], l[2], l[3]);
        (u.uHorrorVertexB.value[count] as THREE.Vector4).set(
          l[4],
          l[5],
          spec.grounded ? 1 : 0,
          0,
        );
        (u.uHorrorSurfaceW.value[count] as THREE.Vector4).set(l[6], l[7], l[8], 0);
        (u.uHorrorParams.value[count] as THREE.Vector4).set(
          entry.seed,
          fit,
          spec.tempo ?? 1,
          entry.owner,
        );
      }
      maskState.horror = owned;
    } else {
      maskState.horror = 0;
    }

    u.uHorrorCount.value = count;
    this.live = count;
  }
}

function entryFor(
  object: THREE.Object3D | null,
  spec: HorrorSpec,
  center: THREE.Vector3 | null,
): Tracked {
  const at = center ? center.clone() : new THREE.Vector3();
  // Salted by where the volume stands, so identical specs never pulse together.
  const m = object?.matrixWorld.elements;
  const x = m ? m[12] : at.x;
  const z = m ? m[14] : at.z;
  const salt = Math.imul(Math.round(x * 71) ^ Math.round(z * 131), 0x9e3779b9);
  const intSeed = mix((spec.seed ?? 1) ^ salt);

  const lanes = new Float32Array(LANES.length);
  for (let i = 0; i < LANES.length; i++) {
    lanes[i] = clamp01(spec.weights?.[LANES[i]] ?? 1);
  }

  return {
    object,
    spec,
    at,
    size: new THREE.Vector3(
      Math.max(spec.size.x, 1e-3),
      Math.max(spec.size.y, 1e-3),
      Math.max(spec.size.z, 1e-3),
    ),
    shape: spec.shape === 'box' ? 1 : 0,
    seed: intSeed / 4294967296,
    intSeed,
    // Assigning the id also bakes it into the object's geometry and puts the
    // meshes on the mask layer — membership by identity, not by the volume.
    owner: object ? ownerIdFor(object) : 0,
    lanes,
    distSq: 0,
  };
}

/**
 * The fit envelope, a pure function of the clock: long stillness, then a
 * violent fit with a fast attack, a long hold and a slow settle. The resting
 * floor keeps a strong haunting from ever fully quieting; a faint one is a
 * rare fit and nothing between.
 */
function sampleFit(seed: number, tempo: number, strength: number, t: number): number {
  const floor = strength * (0.2 + 0.25 * strength);
  const rate = Math.max(tempo * (0.05 + 0.45 * strength * strength), 1e-4);
  let level = floor;

  const slot = Math.floor(t * rate);
  for (let s = slot - 1; s <= slot; s++) {
    if (hash01(seed, s) > 0.55) continue;
    const at = (s + hash01(seed ^ 0x9e3779b9, s)) / rate;
    const age = t - at;
    if (age < 0) continue;
    const attack = 0.06;
    const hold = 0.4 + hash01(seed ^ 0x85ebca6b, s) * 1.1;
    let envelope: number;
    if (age < attack) envelope = age / attack;
    else if (age < attack + hold) envelope = 1;
    else envelope = Math.exp(-(age - attack - hold) / 0.35);
    level += envelope * (0.55 + 0.45 * hash01(seed ^ 0xc2b2ae35, s));
  }

  return level > 1 ? 1 : level;
}

function clamp01(value: number): number {
  return value < 0 ? 0 : value > 1 ? 1 : value;
}

/** A stable hash of two integers to [0, 1). */
function hash01(seed: number, n: number): number {
  return mix(seed ^ Math.imul(n, 0x27d4eb2d)) / 4294967296;
}

function mix(value: number): number {
  let h = value >>> 0;
  h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
  h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
  return (h ^ (h >>> 16)) >>> 0;
}
