import * as THREE from 'three';
import { AudioEngine } from '../audio/AudioEngine';
import { Emitter } from '../audio/Emitter';
import { createWind, type WindModel } from '../audio/models/wind';
import { createFoliage, type FoliageModel } from '../audio/models/foliage';
import { createMachine, type MachineModel } from '../audio/models/machine';
import { createBird } from '../audio/models/bird';
import { Footsteps } from '../audio/models/footsteps';
import type { Collider } from '../player/Collider';
import type { ProvingGround } from './ProvingGround';

/**
 * Hangs the Phase 3 emitters on the proving ground's objects.
 *
 * This is scaffolding. In Phase 5 a zone's data will declare its emitters and
 * this file goes away — which is why nothing here knows anything about the
 * models beyond where they go and how loud they are.
 */

export interface GardenTuning {
  machineRpm: number;
  /** Wind lowpass in Hz. The softness control. */
  windTone: number;
  /** Multiplies every tree and bush's grain level. 0 is pure hush. */
  foliageArticulation: number;
}

export class SoundGarden {
  readonly tuning: GardenTuning = { machineRpm: 52, windTone: 3400, foliageArticulation: 1 };
  readonly footsteps: Footsteps;

  private readonly engine: AudioEngine;
  private readonly collider: Collider;
  private readonly ground: ProvingGround;
  private readonly camera: THREE.Camera;
  private readonly emitters: Emitter[] = [];

  /**
   * The wind bed: not an emitter, because wind is not somewhere. It is the one
   * sound with no position — it is the air you are standing in — so it goes
   * straight to the dry bus and is simply everywhere.
   */
  private readonly bed: GainNode;
  private readonly windModel: WindModel;
  private lastRoom: string | null = null;

  constructor(
    engine: AudioEngine,
    ground: ProvingGround,
    collider: Collider,
    camera: THREE.Camera,
  ) {
    this.engine = engine;
    this.ground = ground;
    this.collider = collider;
    this.camera = camera;

    this.bed = engine.context.createGain();
    this.bed.connect(engine.dry);
    this.windModel = createWind(engine, { gain: 0.32, tone: this.tuning.windTone });
    this.windModel.output.connect(this.bed);

    this.footsteps = new Footsteps(engine, 0.55);

    const anchors = ground.anchors;

    // A big canopy: tuned down for broad heavy leaves, and articulated very
    // lightly — a tree at any distance is a hush with a texture in it, not a
    // collection of audible individual leaves.
    const canopy = createFoliage(engine, {
      density: 240,
      tone: 0.8,
      gain: 0.42,
      articulation: 0.22,
    });
    this.foliage.push({ model: canopy, base: 0.22 });
    this.emitters.push(
      new Emitter(engine, canopy, {
        position: anchors.tree,
        refDistance: 3,
        maxDistance: 34,
        reverb: 0.35,
      }),
    );

    // The bushes are small, dry and quiet — tuned up, and a much shorter reach,
    // so they only exist when you are beside them. Slightly more articulated,
    // because up close a small stiff bush genuinely does tick.
    for (const at of [anchors.bush, new THREE.Vector3(9.2, 0.5, 16.8)]) {
      const shrub = createFoliage(engine, {
        density: 160,
        tone: 1.45,
        gain: 0.26,
        articulation: 0.34,
      });
      this.foliage.push({ model: shrub, base: 0.34 });
      this.emitters.push(
        new Emitter(engine, shrub, {
          position: at,
          refDistance: 1.4,
          maxDistance: 14,
          reverb: 0.25,
        }),
      );
    }

    this.emitters.push(
      new Emitter(engine, createBird(engine, { pitch: 2600, interval: 6, gain: 0.2 }), {
        position: anchors.bird,
        refDistance: 6,
        maxDistance: 55,
        reverb: 0.5,
      }),
    );

    // Heavy, slow, and worn. Reaches a long way, because the point of it is to
    // be heard through the hall wall before you find it.
    this.machineModel = createMachine(engine, {
      rpm: this.tuning.machineRpm,
      fundamental: 42,
      gain: 0.4,
    });
    this.emitters.push(
      new Emitter(engine, this.machineModel, {
        position: anchors.machine,
        refDistance: 2.5,
        maxDistance: 65,
        reverb: 0.9,
      }),
    );
  }

  private readonly machineModel: MachineModel;
  private readonly foliage: { model: FoliageModel; base: number }[] = [];

  update(dt: number): void {
    const retestOcclusion = this.engine.update(dt, this.camera);
    this.windModel.update?.(dt, this.engine);

    for (const emitter of this.emitters) {
      emitter.update(dt, this.collider, retestOcclusion);
    }

    // Indoors, the wind bed drops away and loses its top end — you are hearing
    // it through a wall, and the whistle is the first thing a wall takes.
    const room = this.ground.roomAt(this.engine.listenerPosition);
    if (room !== this.lastRoom) {
      this.lastRoom = room;
      this.engine.setRoom(room ?? 'open');
      this.bed.gain.setTargetAtTime(
        room === null ? 1 : 0.22,
        this.engine.context.currentTime,
        0.35,
      );
      this.footsteps.material = room === null ? 'earth' : 'stone';
    }

    // The wheel you can see turns at the speed the clank you can hear is
    // firing at — including the phase cycle, so it visibly labours and surges.
    this.machineModel.setRpm(this.tuning.machineRpm);
    this.windModel.setTone(this.tuning.windTone);
    for (const { model, base } of this.foliage) {
      model.setArticulation(base * this.tuning.foliageArticulation);
    }
    this.ground.update(dt, this.machineModel.currentRpm);
  }

  get machinePhase(): string {
    return this.machineModel.phase;
  }

  get emitterCount(): number {
    return this.emitters.length;
  }

  get occludedCount(): number {
    return this.emitters.filter((e) => e.isOccluded).length;
  }

  get audibleCount(): number {
    return this.emitters.filter((e) => !e.isVirtual).length;
  }

  dispose(): void {
    for (const emitter of this.emitters) emitter.dispose();
    this.windModel.dispose();
    this.footsteps.dispose();
    this.bed.disconnect();
  }
}
