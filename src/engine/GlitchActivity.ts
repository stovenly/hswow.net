import * as THREE from 'three';
import { glitchUniforms, MAX_GLITCHES, setGlitchErode } from '../art/glitch';
import { ownerIdFor, maskState } from '../art/effectId';
import type { GlitchEffectName, GlitchPlacement, GlitchSpec } from './Glitch';

/**
 * Drives every glitch volume in the active zone. The `LightActivity` shape:
 * collected once when a zone is prepared, released when it is evicted, packed only
 * for the zone you are standing in. Two kinds of entry share the list —
 * free-standing placements, and specs attached to objects with `markGlitched`,
 * whose centres are re-read from the object's world matrix every frame. That
 * re-read is what lets corruption follow a thing rather than a place.
 *
 * The burst envelope is evaluated here as a pure function of the clock: constant
 * corruption reads as a material, intermittent corruption as a malfunction. At
 * most `MAX_GLITCHES` are live at once, nearest first.
 */

/** Past this, a volume is left out of the pack entirely. */
const RANGE = 45;

/** Dev-only: the showcase's steady dial. Null follows each spec's own. */
let override: number | null = null;
export function setGlitchOverride(strength: number | null): void {
  override = strength;
}

/** Dev-only freeze: holds the clock, so a burst can be studied mid-air. */
let frozen = false;
export function setGlitchFrozen(on: boolean): void {
  frozen = on;
}

/**
 * Weight lanes in uniform order — vertex, surface, screen, then the params
 * tail. Mirrors the packing documented on `glitchUniforms`.
 */
const LANES = [
  'jitter',
  'slice',
  'shatter',
  'stutter',
  'palette-rot',
  'facet-flash',
  'crush',
  'static-fill',
  'split',
  'tear',
  'blocks',
  'dropout',
  'erode',
  'ghost',
  'salt',
] as const satisfies readonly GlitchEffectName[];

interface Tracked {
  /** Null for a free-standing placement; the centre then never moves. */
  object: THREE.Object3D | null;
  spec: GlitchSpec;
  /** Where the volume is this frame. Authored for placements, scratch for attached. */
  at: THREE.Vector3;
  /** Radii, floored off zero so the shader's divide is always defined. */
  size: THREE.Vector3;
  shape: number;
  /** The shader's 0..1 seed and the burst hash's integer one. */
  seed: number;
  intSeed: number;
  /** Owner id for attached volumes, 0 for free-standing. See art/effectId.ts. */
  owner: number;
  /** Resolved weights, in `LANES` order. */
  lanes: Float32Array;
  /** Set during the cull, read by the nearest-first sort. */
  distSq: number;
}

export class GlitchActivity {
  private readonly zones = new Map<string, Tracked[]>();
  /** Reused each frame, so the common under-budget case allocates nothing. */
  private readonly near: Tracked[] = [];
  private clock = 0;
  /** Volumes packed last frame, for readouts and the pass's enable. */
  live = 0;

  /**
   * Walks a freshly built zone once and records every glitch in it — the
   * definition's placements first, then everything a builder marked.
   */
  collect(id: string, root: THREE.Object3D, placements: readonly GlitchPlacement[]): void {
    const tracked: Tracked[] = [];

    for (const placement of placements) {
      tracked.push(entryFor(null, placement, placement.center));
    }

    root.traverse((object) => {
      const spec = object.userData.glitch as GlitchSpec | undefined;
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

  /** Whether this zone compiles the erode discard in. Asked before entry, so the compile builds the variant that will be drawn. */
  erodes(id: string | null): boolean {
    return id !== null && this.zones.get(id) !== undefined;
  }

  /**
   * Packs the active zone's volumes into the shared uniform store. Once a
   * frame, before the frame that reads it.
   */
  update(id: string | null, elapsed: number, eye: THREE.Vector3): void {
    if (!frozen) this.clock = elapsed;
    const t = this.clock;
    const u = glitchUniforms;
    const tracked = id ? this.zones.get(id) : undefined;
    let count = 0;

    // Per frame and free when nothing changed, which is every frame but the one
    // you walk through a door on: the erode discard is compiled out of the art
    // materials wherever there is nothing to erode. See `setGlitchErode`.
    setGlitchErode(tracked !== undefined);

    if (tracked) {
      const near = this.near;
      near.length = 0;
      const limit = RANGE * RANGE;

      for (const entry of tracked) {
        // Attached volumes follow their object; the offset rides on top so a
        // figure's corruption sits mid-torso rather than at its feet.
        if (entry.object) {
          const m = entry.object.matrixWorld.elements;
          const offset = entry.spec.offset;
          entry.at.set(
            m[12] + (offset?.x ?? 0),
            m[13] + (offset?.y ?? 0),
            m[14] + (offset?.z ?? 0),
          );
        }
        const dx = entry.at.x - eye.x;
        const dy = entry.at.y - eye.y;
        const dz = entry.at.z - eye.z;
        entry.distSq = dx * dx + dy * dy + dz * dz;
        if (entry.distSq <= limit) near.push(entry);
      }

      // Only the showcase ever exceeds the budget; there, nearest first is
      // also the ones being looked at.
      if (near.length > MAX_GLITCHES) near.sort((a, b) => a.distSq - b.distSq);

      let owned = 0;
      for (let i = 0; i < near.length && count < MAX_GLITCHES; i++, count++) {
        const entry = near[i];
        const spec = entry.spec;
        const strength = clamp01(override ?? spec.strength);
        // The override is steady on purpose: it exists for judging an effect,
        // and a burst arriving mid-judgement is the thing being turned off.
        const burst =
          override !== null ? 1 : sampleBurst(entry.intSeed, spec.tempo ?? 1, strength, t);
        const w = Math.min(strength * burst, 1);
        if (entry.owner && w > 0.004) owned++;
        const l = entry.lanes;

        (u.uGlitchCentre.value[count] as THREE.Vector4).set(
          entry.at.x,
          entry.at.y,
          entry.at.z,
          entry.shape + 2 * entry.owner,
        );
        (u.uGlitchSize.value[count] as THREE.Vector4).set(
          entry.size.x,
          entry.size.y,
          entry.size.z,
          w,
        );
        (u.uGlitchVertexW.value[count] as THREE.Vector4).set(l[0], l[1], l[2], l[3]);
        (u.uGlitchSurfaceW.value[count] as THREE.Vector4).set(l[4], l[5], l[6], l[7]);
        (u.uGlitchScreenW.value[count] as THREE.Vector4).set(l[8], l[9], l[10], l[11]);
        (u.uGlitchParams.value[count] as THREE.Vector4).set(entry.seed, l[12], l[13], l[14]);
      }
      maskState.glitch = owned;
    } else {
      maskState.glitch = 0;
    }

    u.uGlitchCount.value = count;
    this.live = count;
  }
}

function entryFor(
  object: THREE.Object3D | null,
  spec: GlitchSpec,
  center: THREE.Vector3 | null,
): Tracked {
  const at = center ? center.clone() : new THREE.Vector3();
  // Two identical specs must not pulse in lockstep, so the seed is salted by
  // where the volume stands — LightActivity's trick.
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
 * The burst envelope: a pure function of the clock, so it is seekable and the
 * freeze switch is just a held timestamp. Slots fire on a hash, and a firing slot
 * carries one burst with a sharp attack, a varied hold and a decaying tail.
 * Strength raises the resting floor, the slot rate and how often a slot fires.
 */
function sampleBurst(seed: number, tempo: number, strength: number, t: number): number {
  const floor = 0.25 * strength * (1 + strength);
  const rate = Math.max(tempo * (0.06 + 0.6 * strength * strength), 1e-4);
  let level = floor;

  const slot = Math.floor(t * rate);
  for (let s = slot - 1; s <= slot; s++) {
    if (hash01(seed, s) > 0.62) continue;
    const at = (s + hash01(seed ^ 0x9e3779b9, s)) / rate;
    const age = t - at;
    if (age < 0) continue;
    const attack = 0.05;
    const hold = 0.15 + hash01(seed ^ 0x85ebca6b, s) * 0.5;
    let envelope: number;
    if (age < attack) envelope = age / attack;
    else if (age < attack + hold) envelope = 1;
    else envelope = Math.exp(-(age - attack - hold) / 0.2);
    level += envelope * (0.5 + 0.5 * hash01(seed ^ 0xc2b2ae35, s));
  }

  return level > 1 ? 1 : level;
}

function clamp01(value: number): number {
  return value < 0 ? 0 : value > 1 ? 1 : value;
}

/** A stable hash of two integers to [0, 1). `art/activity.ts`'s shape. */
function hash01(seed: number, n: number): number {
  return mix(seed ^ Math.imul(n, 0x27d4eb2d)) / 4294967296;
}

function mix(value: number): number {
  let h = value >>> 0;
  h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
  h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
  return (h ^ (h >>> 16)) >>> 0;
}
