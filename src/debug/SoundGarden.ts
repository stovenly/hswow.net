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
  /** `undefined` forces the next update to reapply, whatever it last was. */
  private lastRoom: string | null | undefined = undefined;
  /** The garden belongs to the exterior; indoors it is another zone's problem. */
  private active = true;

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
    this.windModel = createWind(engine, { gain: 0.17, tone: this.tuning.windTone });
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
      // Pulled in hard. Wind in a tree is a *local* sound — you notice it when
      // you are under the canopy and it should be gone well before the tree is
      // out of sight. At 34 m with the default rolloff it was still clearly
      // audible from most of the field, which made the whole exterior sound
      // like it had a tree in the middle of it.
      new Emitter(engine, canopy, {
        position: anchors.tree,
        refDistance: 2.5,
        maxDistance: 20,
        rolloff: 1.7,
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
      // Quiet, dull and wet: three things together read as "over there" where
      // any one of them alone reads as "turned down".
      new Emitter(
        engine,
        createBird(engine, { pitch: 2600, interval: 6, gain: 0.075, tone: 2800 }),
        { position: anchors.bird, refDistance: 4, maxDistance: 38, rolloff: 1.4, reverb: 0.85 },
      ),
    );

    // Heavy, slow, and worn.
    this.machineModel = createMachine(engine, {
      rpm: this.tuning.machineRpm,
      fundamental: 42,
      gain: 0.4,
    });
    this.emitters.push(
      // Still the longest reach of anything here — the point of it is to be
      // heard through the hall wall before you find it — but 65 m was most of
      // the level. It now carries across the yard rather than across the map,
      // and the taper means it is genuinely gone at the edge instead of
      // dropping off a step.
      new Emitter(engine, this.machineModel, {
        position: anchors.machine,
        refDistance: 2.5,
        maxDistance: 34,
        rolloff: 1.8,
        reverb: 0.9,
      }),
    );
  }

  private readonly machineModel: MachineModel;
  private readonly foliage: { model: FoliageModel; base: number }[] = [];

  /**
   * Switches the garden on and off with its zone.
   *
   * The tree, the bird, the machine and the wind are all *outside*. Once zones
   * exist, standing in an interior means none of them should be audible — and
   * the emitters cannot work that out for themselves, because occlusion is a
   * raycast against the collider and the collider no longer contains the world
   * they live in. So the zone manager tells them.
   *
   * Silenced rather than disposed: this is the same place you walked out of,
   * and rebuilding a dozen granular models every time somebody steps through a
   * door would be both slower and audible as a gap.
   */
  setActive(active: boolean): void {
    if (active === this.active) return;
    this.active = active;
    for (const emitter of this.emitters) emitter.enabled = active;
    this.bed.gain.setTargetAtTime(active ? 1 : 0, this.engine.context.currentTime, 0.15);
    // Forget the room, so re-entering reapplies the acoustics and the floor
    // material that the interior overwrote.
    if (active) this.lastRoom = undefined;
  }

  update(dt: number): void {
    const retestOcclusion = this.engine.update(dt, this.camera);
    this.windModel.update?.(dt, this.engine);

    for (const emitter of this.emitters) {
      emitter.update(dt, this.collider, retestOcclusion);
    }

    // The rest of this belongs to the exterior. Indoors the zone owns the
    // acoustics and the floor, and the garden must not fight it for them.
    if (!this.active) return;

    // Inside one of the proving ground's test rooms, the wind bed drops away
    // and loses its top end — you are hearing it through a wall, and the
    // whistle is the first thing a wall takes. These are rooms *within* the
    // exterior zone, not zones of their own: the Phase 3 acoustics fixture.
    const room = this.ground.roomAt(this.engine.listenerPosition);
    if (room !== this.lastRoom) {
      this.lastRoom = room;
      this.engine.setRoom(room ?? 'open');
      this.bed.gain.setTargetAtTime(
        room === null ? 1 : 0.22,
        this.engine.context.currentTime,
        0.35,
      );
      this.footsteps.surface = room === null ? 'earth' : 'stone';
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
