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
import { createAir, type AirOptions } from './models/air';
import { createCavern, type CavernOptions } from './models/cavern';
import { createPlant, type PlantOptions } from './models/plant';
import { createInsect, type InsectOptions } from './models/insect';
import { createSurf, type SurfOptions } from './models/surf';
import { createWire, type WireOptions } from './models/wire';
import { createElectric, type ElectricOptions } from './models/electric';
import { createPlate, type PlateOptions } from './models/plate';
import { createTick, type TickOptions } from './models/tick';
import { createFlock, type FlockOptions } from './models/flock';
import { createPlayed, type PlayedOptions } from './music/played';
import { ScatterField, type ScatterSpec } from './Scatter';
import type { Collider } from '../player/Collider';

/**
 * What a place sounds like, built from a description. A zone declares its
 * soundscape as data the same way it declares its fog and its light, and this
 * builds it. Content stays plain data with no engine imports.
 *
 * A soundscape is **not** torn down when you walk through a door. Zones are
 * revisited constantly, granular models are not free to construct, and a gap
 * where the wind should be is far more noticeable than the memory of a few
 * dozen dormant filters. `setActive(false)` silences and disconnects; only
 * disposing the zone disposes the sound. Same rule as materials: the expensive
 * shared thing outlives the cheap thing that referenced it.
 */

/**
 * A model and its settings. A discriminated union rather than `{ model:
 * string; options: object }`, so a typo in an option name is a compile error
 * in the zone file rather than a control that silently does nothing.
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
  | { model: 'waveguide'; options?: WaveguideOptions }
  | { model: 'air'; options?: AirOptions }
  | { model: 'cavern'; options?: CavernOptions }
  | { model: 'plant'; options?: PlantOptions }
  | { model: 'insect'; options?: InsectOptions }
  | { model: 'surf'; options?: SurfOptions }
  | { model: 'wire'; options?: WireOptions }
  | { model: 'electric'; options?: ElectricOptions }
  | { model: 'plate'; options?: PlateOptions }
  | { model: 'tick'; options?: TickOptions }
  // Options required: a flock with no call named is not a default anything.
  | { model: 'flock'; options: FlockOptions }
  // Options required, not optional: a played instrument with no voice named
  // is not a default anything, so there is nothing sensible to fall back to.
  | { model: 'played'; options: PlayedOptions };

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
 * A model with no position: the air you are standing in. Wind is the obvious
 * one — it is not *somewhere*, you do not walk toward it — so spatialising it
 * is wrong as well as wasteful, and it goes straight to the dry bus.
 */
export type BedSpec = ModelSpec & { id?: string; gain?: number };

export interface SoundscapeSpec {
  /**
   * One or several. The air in a place is not one thing — wind and rain are
   * both everywhere at once — so a bed is a list, mixed into one bus that
   * `setBedLevel` ducks as a whole.
   */
  bed?: BedSpec | readonly BedSpec[];
  emitters?: readonly EmitterSpec[];
  /**
   * One-shots fired at random points in a region at Poisson intervals: the
   * part that makes a place sound inhabited rather than merely present. See
   * `Scatter.ts` — it is more about timing than about synthesis.
   */
  scatter?: readonly ScatterSpec[];
}

/** Nothing at all. Interiors default to this until they are given a voice. */
export const SILENCE: SoundscapeSpec = {};

/**
 * Builds a model from its spec. Exported for the ambience director, which
 * builds the same models from a book of its own rather than from a zone.
 */
export function buildModel(engine: AudioEngine, spec: ModelSpec): SoundModel {
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
    case 'air':
      return createAir(engine, spec.options);
    case 'cavern':
      return createCavern(engine, spec.options);
    case 'plant':
      return createPlant(engine, spec.options);
    case 'insect':
      return createInsect(engine, spec.options);
    case 'surf':
      return createSurf(engine, spec.options);
    case 'wire':
      return createWire(engine, spec.options);
    case 'electric':
      return createElectric(engine, spec.options);
    case 'plate':
      return createPlate(engine, spec.options);
    case 'tick':
      return createTick(engine, spec.options);
    case 'flock':
      return createFlock(engine, spec.options);
    case 'played':
      return createPlayed(engine, spec.options);
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
  /** Which ids are beds. A station on the sound stage shares ids with the air. */
  private readonly bedIds = new Set<string>();
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
        const model = buildModel(engine, declared);
        const gain = engine.context.createGain();
        gain.gain.value = declared.gain ?? 1;
        // Precipitation goes to the weather bus wherever it was declared, so
        // one slider covers it whether the zone asked for rain or the rig did.
        model.output.connect(gain).connect(declared.model === 'rain' ? engine.weatherBus : bus);
        this.beds.push(model);
        if (declared.id) {
          this.models.set(declared.id, model);
          this.bedIds.add(declared.id);
        }
      }
    }

    for (const placed of spec.emitters ?? []) {
      const model = buildModel(engine, placed);
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
   * Switches the whole soundscape with its zone. The emitters cannot work this
   * out for themselves: occlusion is a raycast against the collider, and once
   * you are indoors the collider no longer contains the world they live in, so
   * every one of them would report itself unobstructed and audible.
   */
  setActive(active: boolean): void {
    if (active === this.active) return;
    this.active = active;
    for (const emitter of this.emitters) emitter.enabled = active;
    for (const field of this.scatter) field.setActive(active);
    this.bedBus?.gain.setTargetAtTime(active ? 1 : 0, this.engine.context.currentTime, 0.15);
  }

  /**
   * Ducks the non-positional bed without deactivating the soundscape, for being
   * inside something that is not a zone of its own — a test room within the
   * exterior takes the wind down and dulls it, because you are hearing it
   * through a wall. Separate from `setActive`, which is for having left.
   */
  setBedLevel(level: number, seconds = 0.35): void {
    if (!this.bedBus || !this.active) return;
    this.bedBus.gain.setTargetAtTime(level, this.engine.context.currentTime, seconds);
  }

  update(dt: number, collider: Collider, retestOcclusion: boolean): void {
    if (!this.active) return;
    // Beds have no emitter, so nothing else would ever call them.
    // A bed is the air you are standing in, so it samples the field at the
    // listener rather than at a position of its own — it has none.
    for (const bed of this.beds) bed.update?.(dt, this.engine, this.engine.listenerPosition);
    for (const emitter of this.emitters) emitter.update(dt, collider, retestOcclusion);
    for (const field of this.scatter) field.update(dt, collider, retestOcclusion);
  }

  /**
   * A model by its declared `id`. The escape hatch for the two things a pure
   * data spec cannot express: a tuning panel that wants a live control, and a
   * visual that has to agree with a sound — a flywheel turning at the rpm its
   * clank is firing at.
   */
  find<T extends SoundModel>(id: string): T | null {
    return (this.models.get(id) as T | undefined) ?? null;
  }

  /**
   * A bed by its declared `id`, and only a bed. The weather drives the air a
   * zone declared; a station on the sound stage carrying the same id is an
   * exhibit and is nobody's to turn down.
   */
  findBed<T extends SoundModel>(id: string): T | null {
    return this.bedIds.has(id) ? ((this.models.get(id) as T | undefined) ?? null) : null;
  }

  /** A scatter field by its declared `id`. See `find`. */
  findField(id: string): ScatterField | null {
    return this.fields.get(id) ?? null;
  }

  /**
   * Silences every emitter but one. `null` restores the lot.
   *
   * For the sound stage: a model that sounds wrong in a mix is either wrong or
   * merely masked, and there is no way to tell which without hearing it alone.
   * Walking up to a source gets most of the way there and not all — the room
   * tail is shared, and a neighbouring drone sits underneath however close you
   * stand.
   *
   * Deliberately not persisted. Leaving a zone re-activates every emitter
   * through `setActive`, so a soloed stage cannot follow you out of the room
   * and leave the world half-silent with no visible cause.
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
