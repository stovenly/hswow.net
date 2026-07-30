import * as THREE from 'three';
import type { AudioEngine } from './AudioEngine';
import type { Collider } from '../player/Collider';

/**
 * A sound in the world.
 *
 * ```
 *  model ─► absorption ─► occlusion ─► panner ─┬─► dry
 *           (lowpass)      (gain)              └─► send (reverb)
 * ```
 *
 * The panner does direction. Everything interesting about *place* happens in
 * the two nodes before it:
 *
 * - **Air absorption.** High frequencies are absorbed by air far faster than
 *   low ones, so distance does not merely quieten a sound, it darkens it. This
 *   is what actually sells distance; inverse-square attenuation alone gives you
 *   a quiet sound that still seems to be next to your ear.
 * - **Occlusion.** A wall between listener and source cuts the highs hardest,
 *   because low frequencies diffract around obstacles and high ones do not. A
 *   machine behind a wall should thud, not vanish.
 *
 * Both are moved with `setTargetAtTime` rather than assigned. An `AudioParam`
 * set directly jumps between render quanta, and a jumping filter cutoff is an
 * audible zip.
 */

export interface SoundModel {
  readonly output: AudioNode;
  /** Called each frame while audible. */
  update?(dt: number, engine: AudioEngine): void;
  /** Told when the emitter goes virtual, so models can stop scheduling work. */
  setActive?(active: boolean): void;
  dispose(): void;
}

export interface EmitterOptions {
  position: THREE.Vector3;
  /** Distance at which the sound is at full volume. */
  refDistance?: number;
  /** Past this it is inaudible, and the emitter goes virtual. */
  maxDistance?: number;
  rolloff?: number;
  /** How much of this emitter feeds the room, 0..1. */
  reverb?: number;
  /** Which way it faces, for directional sources. Omit for omnidirectional. */
  direction?: THREE.Vector3;
  coneInner?: number;
  coneOuter?: number;
  coneOuterGain?: number;
}

/** Cutoff with no absorption at all. Above hearing, so the filter is a no-op. */
const OPEN_HZ = 20000;
/** Cutoff for a fully occluded source. Low enough to read as "through a wall". */
const OCCLUDED_HZ = 420;
/** How much a fully occluded source is attenuated, on top of the filtering. */
const OCCLUDED_GAIN = 0.32;
/** Smoothing constant for absorption and occlusion moves. */
const GLIDE = 0.08;

export class Emitter {
  readonly position = new THREE.Vector3();
  /** Set false to silence without tearing the emitter down. */
  enabled = true;

  private readonly engine: AudioEngine;
  private readonly model: SoundModel;
  private readonly absorption: BiquadFilterNode;
  private readonly occlusion: GainNode;
  private readonly panner: PannerNode;
  private readonly sendGain: GainNode;
  private readonly maxDistance: number;
  private readonly reverb: number;

  private occluded = false;
  private virtual = false;

  constructor(engine: AudioEngine, model: SoundModel, options: EmitterOptions) {
    this.engine = engine;
    this.model = model;
    this.position.copy(options.position);
    this.maxDistance = options.maxDistance ?? 60;
    this.reverb = options.reverb ?? 1;

    const context = engine.context;

    this.absorption = context.createBiquadFilter();
    this.absorption.type = 'lowpass';
    this.absorption.frequency.value = OPEN_HZ;

    this.occlusion = context.createGain();

    this.panner = context.createPanner();
    // HRTF rather than equalpower: it is the difference between a sound being
    // on your left and a sound being *outside your head* on your left. It only
    // pays off on headphones, which is how this should be listened to anyway.
    this.panner.panningModel = 'HRTF';
    this.panner.distanceModel = 'inverse';
    this.panner.refDistance = options.refDistance ?? 1.5;
    this.panner.maxDistance = this.maxDistance;
    this.panner.rolloffFactor = options.rolloff ?? 1.1;

    if (options.direction) {
      this.panner.coneInnerAngle = options.coneInner ?? 90;
      this.panner.coneOuterAngle = options.coneOuter ?? 240;
      this.panner.coneOuterGain = options.coneOuterGain ?? 0.35;
      setOrientation(this.panner, options.direction);
    }

    setPosition(this.panner, this.position);

    this.sendGain = context.createGain();
    this.sendGain.gain.value = this.reverb;

    model.output.connect(this.absorption);
    this.absorption.connect(this.occlusion);
    this.occlusion.connect(this.panner);
    this.panner.connect(engine.dry);
    this.panner.connect(this.sendGain);
    this.sendGain.connect(engine.send);
  }

  /** Moves the emitter. Cheap enough to call every frame for moving sources. */
  moveTo(position: THREE.Vector3): void {
    this.position.copy(position);
    setPosition(this.panner, this.position);
  }

  /**
   * @param retestOcclusion Whether the occlusion raycast is due this frame.
   *   The engine paces it; casting every frame for every emitter is the one
   *   part of this that would actually cost something.
   */
  update(dt: number, collider: Collider, retestOcclusion: boolean): void {
    const distance = this.position.distanceTo(this.engine.listenerPosition);

    // Past maxDistance the panner has already attenuated this to nothing, so
    // the work of running the model is wasted. Models that schedule — the
    // granular ones especially — stop scheduling entirely.
    const shouldBeVirtual = distance > this.maxDistance;
    if (shouldBeVirtual !== this.virtual) {
      this.virtual = shouldBeVirtual;
      this.model.setActive?.(!shouldBeVirtual);
    }

    if (this.virtual || !this.enabled) {
      this.glide(this.occlusion.gain, 0);
      return;
    }

    this.model.update?.(dt, this.engine);

    if (retestOcclusion) this.occluded = this.testOcclusion(collider, distance);

    const settings = this.engine.settings;

    // Absorption rises with distance, and the curve is deliberately steep near
    // the listener: most of the perceptual change happens in the first few
    // metres, not the last few.
    const reach = Math.min(distance / this.maxDistance, 1);
    const absorbed = OPEN_HZ * (1 - settings.airAbsorption * Math.sqrt(reach) * 0.94);

    const occlusionMix = this.occluded ? settings.occlusion : 0;
    const cutoff = Math.min(absorbed, lerp(OPEN_HZ, OCCLUDED_HZ, occlusionMix));

    this.glide(this.absorption.frequency, Math.max(cutoff, 180));
    this.glide(this.occlusion.gain, lerp(1, OCCLUDED_GAIN, occlusionMix));
    this.sendGain.gain.value = this.reverb * settings.reverbAmount;
  }

  /**
   * One ray, listener to source. If it hits anything before it arrives, there
   * is something in the way.
   *
   * Deliberately binary. Real occlusion is a question of how much material is
   * between two points and what it is made of, and the honest answers to that
   * cost more than this whole engine. A single ray plus a slow crossfade gets
   * most of the way there.
   */
  private testOcclusion(collider: Collider, distance: number): boolean {
    if (distance < 0.5) return false;
    _direction.subVectors(this.position, this.engine.listenerPosition).divideScalar(distance);
    const hit = collider.raycast(this.engine.listenerPosition, _direction);
    return hit !== null && hit < distance - 0.35;
  }

  private glide(param: AudioParam, value: number): void {
    param.setTargetAtTime(value, this.engine.context.currentTime, GLIDE);
  }

  get isOccluded(): boolean {
    return this.occluded;
  }

  get isVirtual(): boolean {
    return this.virtual;
  }

  dispose(): void {
    this.model.dispose();
    this.panner.disconnect();
    this.sendGain.disconnect();
    this.absorption.disconnect();
    this.occlusion.disconnect();
  }
}

function setPosition(panner: PannerNode, position: THREE.Vector3): void {
  if (panner.positionX) {
    panner.positionX.value = position.x;
    panner.positionY.value = position.y;
    panner.positionZ.value = position.z;
  } else {
    (panner as unknown as { setPosition(x: number, y: number, z: number): void }).setPosition(
      position.x,
      position.y,
      position.z,
    );
  }
}

function setOrientation(panner: PannerNode, direction: THREE.Vector3): void {
  _direction.copy(direction).normalize();
  if (panner.orientationX) {
    panner.orientationX.value = _direction.x;
    panner.orientationY.value = _direction.y;
    panner.orientationZ.value = _direction.z;
  } else {
    (panner as unknown as { setOrientation(x: number, y: number, z: number): void }).setOrientation(
      _direction.x,
      _direction.y,
      _direction.z,
    );
  }
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

const _direction = new THREE.Vector3();
