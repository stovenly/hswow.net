import * as THREE from 'three';
import type { AudioEngine } from './AudioEngine';
import { Emitter, type SoundModel } from './Emitter';
import { createWind, type WindOptions } from './models/wind';
import { createFoliage, type FoliageOptions } from './models/foliage';
import { createMachine, type MachineOptions } from './models/machine';
import { createBird, type BirdOptions } from './models/bird';
import { createFire, type FireOptions } from './models/fire';
import { createRain, type RainOptions } from './models/rain';
import { createWater, type WaterOptions } from './models/water';
import { createCrowd, type CrowdOptions } from './models/crowd';
import { createFriction, type FrictionOptions } from './models/friction';
import { createWaveguide, type WaveguideOptions } from './models/waveguide';
import { ScatterField, type ScatterSpec } from './Scatter';
import type { Collider } from '../player/Collider';

/**
 * What a place sounds like, built from a description.
 *
 * This replaces `debug/SoundGarden.ts`, which was Phase 3 scaffolding: a
 * hand-wired list of emitters hardcoded to the proving ground's anchors, whose
 * own header said it should have gone away in Phase 5. It did not, and the
 * consequence was that Arkstin Village — the first zone in this game that is a
 * *place* rather than a fixture — was silent apart from footsteps and doors.
 *
 * A zone now declares its soundscape as data, the same way it declares its fog
 * and its light, and this builds it. Content stays plain data with no engine
 * imports, which is the property Phase 10 depends on.
 *
 * ## Built once, silenced often
 *
 * A soundscape is **not** torn down when you walk through a door. Zones are
 * revisited constantly, granular models are not free to construct, and a gap
 * where the wind should be is far more noticeable than the memory of a few
 * dozen dormant filters. So `setActive(false)` silences and disconnects; only
 * disposing the zone itself disposes the sound.
 *
 * That mirrors the geometry rule in the other direction, and the reasoning is
 * the same one as "never dispose materials per zone": the expensive shared
 * thing outlives the cheap thing that referenced it.
 */

/**
 * A model and its settings.
 *
 * A discriminated union rather than `{ model: string; options: object }`, so
 * that a typo in an option name is a compile error in the zone file rather
 * than a control that silently does nothing.
 */
export type ModelSpec =
  | { model: 'wind'; options?: WindOptions }
  | { model: 'foliage'; options?: FoliageOptions }
  | { model: 'machine'; options?: MachineOptions }
  | { model: 'bird'; options?: BirdOptions }
  | { model: 'fire'; options?: FireOptions }
  | { model: 'rain'; options?: RainOptions }
  | { model: 'water'; options?: WaterOptions }
  | { model: 'crowd'; options?: CrowdOptions }
  | { model: 'friction'; options?: FrictionOptions }
  | { model: 'waveguide'; options?: WaveguideOptions };

/** A model somewhere in particular. */
export type EmitterSpec = ModelSpec & {
  at: readonly [number, number, number];
  /** Optional handle, so tuning panels and visuals can find this model again. */
  id?: string;
  refDistance?: number;
  maxDistance?: number;
  rolloff?: number;
  reverb?: number;
  importance?: number;
  /** See `EmitterOptions` — these three deliberately break physics. */
  ignoreAbsorption?: boolean;
  ignoreOcclusion?: boolean;
  invertDistance?: boolean;
};

/**
 * A model with no position: the air you are standing in.
 *
 * Wind is the obvious one. It is not *somewhere* — you do not walk toward it —
 * so spatialising it is not merely wasteful but wrong, and it goes straight to
 * the dry bus.
 */
export type BedSpec = ModelSpec & { id?: string; gain?: number };

export interface SoundscapeSpec {
  /**
   * One or several. The air in a place is not one thing — wind and rain are
   * both everywhere at once and neither is *somewhere* — so a bed is a list,
   * mixed into one bus that `setBedLevel` ducks as a whole.
   */
  bed?: BedSpec | readonly BedSpec[];
  emitters?: readonly EmitterSpec[];
  /**
   * One-shots fired at random points in a region at Poisson intervals.
   *
   * The part that makes a place sound inhabited rather than merely present.
   * See `Scatter.ts` — the reasoning is all there, because it is more about
   * timing than about synthesis.
   */
  scatter?: readonly ScatterSpec[];
}

/** Nothing at all. Interiors default to this until they are given a voice. */
export const SILENCE: SoundscapeSpec = {};

function build(engine: AudioEngine, spec: ModelSpec): SoundModel {
  switch (spec.model) {
    case 'wind':
      return createWind(engine, spec.options);
    case 'foliage':
      return createFoliage(engine, spec.options);
    case 'machine':
      return createMachine(engine, spec.options);
    case 'bird':
      return createBird(engine, spec.options);
    case 'fire':
      return createFire(engine, spec.options);
    case 'rain':
      return createRain(engine, spec.options);
    case 'water':
      return createWater(engine, spec.options);
    case 'crowd':
      return createCrowd(engine, spec.options);
    case 'friction':
      return createFriction(engine, spec.options);
    case 'waveguide':
      return createWaveguide(engine, spec.options);
  }
}

export class Soundscape {
  private readonly engine: AudioEngine;
  private readonly emitters: Emitter[] = [];
  private readonly models = new Map<string, SoundModel>();
  /** Only the emitters that declared an `id`. See `setSolo`. */
  private readonly emitterById = new Map<string, Emitter>();
  private readonly fields = new Map<string, ScatterField>();
  /** Beds are updated by hand — they have no emitter to do it for them. */
  private readonly beds: SoundModel[] = [];
  /** One fader over every bed, so ducking the air is one automation event. */
  private readonly bedBus: GainNode | null = null;
  private readonly scatter: ScatterField[] = [];
  private active = true;

  constructor(engine: AudioEngine, spec: SoundscapeSpec) {
    this.engine = engine;

    const bedSpecs = spec.bed ? (Array.isArray(spec.bed) ? spec.bed : [spec.bed as BedSpec]) : [];
    if (bedSpecs.length > 0) {
      const bus = engine.context.createGain();
      bus.connect(engine.dry);
      this.bedBus = bus;
      for (const declared of bedSpecs) {
        const model = build(engine, declared);
        const gain = engine.context.createGain();
        gain.gain.value = declared.gain ?? 1;
        model.output.connect(gain).connect(bus);
        this.beds.push(model);
        if (declared.id) this.models.set(declared.id, model);
      }
    }

    for (const placed of spec.emitters ?? []) {
      const model = build(engine, placed);
      if (placed.id) this.models.set(placed.id, model);
      const emitter = new Emitter(engine, model, {
        position: new THREE.Vector3(...placed.at),
        refDistance: placed.refDistance,
        maxDistance: placed.maxDistance,
        rolloff: placed.rolloff,
        reverb: placed.reverb,
        importance: placed.importance,
        ignoreAbsorption: placed.ignoreAbsorption,
        ignoreOcclusion: placed.ignoreOcclusion,
        invertDistance: placed.invertDistance,
      });
      this.emitters.push(emitter);
      if (placed.id) this.emitterById.set(placed.id, emitter);
    }

    for (const field of spec.scatter ?? []) {
      const built = new ScatterField(engine, field);
      this.scatter.push(built);
      if (field.id) this.fields.set(field.id, built);
    }
  }

  /**
   * Switches the whole soundscape with its zone.
   *
   * The emitters cannot work this out for themselves: occlusion is a raycast
   * against the collider, and once you are indoors the collider no longer
   * contains the world they live in, so every one of them would report itself
   * unobstructed and audible. The manager has to tell them.
   */
  setActive(active: boolean): void {
    if (active === this.active) return;
    this.active = active;
    for (const emitter of this.emitters) emitter.enabled = active;
    for (const field of this.scatter) field.setActive(active);
    this.bedBus?.gain.setTargetAtTime(active ? 1 : 0, this.engine.context.currentTime, 0.15);
  }

  /**
   * Ducks the non-positional bed without deactivating the soundscape.
   *
   * For being *inside* something that is not a zone of its own — the proving
   * ground's test rooms are rooms within the exterior, and standing in one has
   * to take the wind down and dull it, because you are hearing it through a
   * wall. Separate from `setActive`, which is for having left the place
   * entirely.
   */
  setBedLevel(level: number, seconds = 0.35): void {
    if (!this.bedBus || !this.active) return;
    this.bedBus.gain.setTargetAtTime(level, this.engine.context.currentTime, seconds);
  }

  update(dt: number, collider: Collider, retestOcclusion: boolean): void {
    if (!this.active) return;
    // Beds have no emitter, so nothing else would ever call them.
    for (const bed of this.beds) bed.update?.(dt, this.engine);
    for (const emitter of this.emitters) emitter.update(dt, collider, retestOcclusion);
    for (const field of this.scatter) field.update(dt, collider, retestOcclusion);
  }

  /**
   * A model by its declared `id`.
   *
   * The escape hatch for the two things a pure data spec cannot express: a
   * tuning panel that wants a live control, and a visual that has to agree
   * with a sound — the proving ground's flywheel turns at the rpm its clank is
   * firing at, and that link has to survive the model being declared as data.
   */
  find<T extends SoundModel>(id: string): T | null {
    return (this.models.get(id) as T | undefined) ?? null;
  }

  /** A scatter field by its declared `id`. See `find`. */
  findField(id: string): ScatterField | null {
    return this.fields.get(id) ?? null;
  }

  /**
   * Silences every emitter but one. `null` restores the lot.
   *
   * For the sound stage, and the reason it exists: a model that sounds wrong
   * in a mix is either wrong or merely masked, and there is no way to tell
   * which without hearing it alone. Walking up to a source gets most of the
   * way there and not all — the room tail is shared, and a neighbouring drone
   * sits underneath everything however close you stand.
   *
   * Deliberately not persisted anywhere. Leaving a zone re-activates every
   * emitter through `setActive`, so a soloed stage cannot follow you out of
   * the room and leave the world half-silent with no visible cause.
   */
  setSolo(id: string | null): void {
    if (!this.active) return;
    for (const [key, emitter] of this.emitterById) emitter.enabled = id === null || key === id;
    for (const [key, field] of this.fields) field.setActive(id === null || key === id);
  }

  get emitterCount(): number {
    return this.emitters.length + this.scatter.reduce((n, f) => n + f.voiceCount, 0);
  }

  get occludedCount(): number {
    return this.emitters.filter((emitter) => emitter.isOccluded).length;
  }

  dispose(): void {
    for (const emitter of this.emitters) emitter.dispose();
    this.emitters.length = 0;
    this.emitterById.clear();
    for (const field of this.scatter) field.dispose();
    this.scatter.length = 0;
    this.fields.clear();
    for (const bed of this.beds) bed.dispose();
    this.beds.length = 0;
    this.bedBus?.disconnect();
    this.models.clear();
  }
}
