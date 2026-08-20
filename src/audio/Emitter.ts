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
 * The panner does direction. Everything about *place* happens in the two nodes
 * before it. Air absorbs high frequencies far faster than low, so distance
 * darkens a sound as well as quietening it — inverse-square alone gives a
 * quiet sound that still seems to be next to your ear. And a wall cuts the
 * highs hardest, because low frequencies diffract around obstacles: a machine
 * behind a wall should thud, not vanish.
 *
 * Both move with `setTargetAtTime` rather than being assigned. An `AudioParam`
 * set directly jumps between render quanta, and a jumping cutoff is a zip.
 *
 * Every emitter sits at one of three detail levels, assigned by the engine:
 *
 * - `'hrtf'` — full spatialisation, for the nearest handful. A continuous
 *   convolution per source, and the only thing that puts a sound outside your
 *   head rather than merely on your left.
 * - `'panned'` — equal-power. Direction without the convolution; at twenty
 *   metres nobody can tell, and it costs almost nothing.
 * - `'virtual'` — the model is **disconnected**, not turned down. A silent
 *   source still has its filters and panner processed every quantum, so gating
 *   on gain saves nothing. This is where the budget comes from.
 *
 * Switching between the first two goes through a brief gain dip: HRTF carries
 * an inherent delay that equal-power does not.
 */

export interface SoundModel {
  readonly output: AudioNode;
  /**
   * Called each frame while audible. `at` is where this model is standing, and
   * models that care about wind should read `engine.weather.strengthAt(at.x,
   * at.z)` rather than the global `strength` — the gust field travels, so the
   * far treeline quickens before the near hedge. A bed has no position of its
   * own and is handed the listener's.
   */
  update?(dt: number, engine: AudioEngine, at: THREE.Vector3): void;
  /** Told when the emitter goes virtual, so models can stop scheduling work. */
  setActive?(active: boolean): void;
  dispose(): void;
}

/** See the class doc. Assigned by the engine, never set directly. */
export type Detail = 'hrtf' | 'panned' | 'virtual';

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
  /**
   * How hard this emitter competes for the voice budget. Priority is distance
   * divided by importance, so 2 makes an emitter behave as though it were half
   * as far away. For the one sound in a zone that has to be heard — not for
   * making something louder, which is what `refDistance` is for.
   */
  importance?: number;

  // --- deliberate violations of physics -----------------------------------
  //
  // Everything above models how sound actually behaves. These three switch
  // parts of it off. In a world with a magical register, the way to signal
  // that something is not an ordinary object making an ordinary noise is to
  // have it disobey the rules every other sound obeys — a voice that does not
  // dull with distance is placed by the ear as "not here" before the player
  // could say why. Used often they are a mix with no depth in it.

  /** Distance stops darkening it. Reads as unnaturally present. */
  ignoreAbsorption?: boolean;
  /** Walls stop muffling it. Reads as coming from nowhere in particular. */
  ignoreOcclusion?: boolean;
  /**
   * Clearer the further away you get, silent when you reach it. The panner's
   * own distance model is switched off and the curve driven from here, because
   * no distance model in Web Audio runs backwards.
   */
  invertDistance?: boolean;
}

/** Cutoff with no absorption at all. Above hearing, so the filter is a no-op. */
const OPEN_HZ = 20000;
/** Cutoff for a fully occluded source. Low enough to read as "through a wall". */
const OCCLUDED_HZ = 420;
/** How much a fully occluded source is attenuated, on top of the filtering. */
const OCCLUDED_GAIN = 0.32;
/** Smoothing constant for absorption and occlusion moves. */
const GLIDE = 0.08;
/** Length of the dip that hides a panning-model swap. */
const SWAP_DIP = 0.04;

/**
 * Where the distance taper begins, as a fraction of `maxDistance`.
 *
 * Web Audio's distance models never reach zero: `inverse` clamps the distance
 * to `maxDistance` and holds whatever gain that implies, which for a typical
 * source at 40 m is about -29 dB — quiet, but audible in a still scene, and
 * then the emitter goes virtual a metre later and stops dead.
 *
 * This tapers the last of the range smoothly to silence, so `maxDistance`
 * means the distance past which you cannot hear this. `rolloff` steepens the
 * near field; the two are worth tuning separately.
 */
const TAPER_FROM = 0.5;

export class Emitter {
  readonly position = new THREE.Vector3();
  /** Set false to silence without tearing the emitter down. */
  enabled = true;
  /** Weighting for the voice budget. See `EmitterOptions.importance`. */
  readonly importance: number;
  readonly maxDistance: number;

  private readonly engine: AudioEngine;
  private readonly model: SoundModel;
  private readonly absorption: BiquadFilterNode;
  private readonly occlusion: GainNode;
  private readonly swap: GainNode;
  private readonly panner: PannerNode;
  private readonly sendGain: GainNode;
  private readonly reverb: number;
  private readonly ignoreAbsorption: boolean;
  private readonly ignoreOcclusion: boolean;
  private readonly invertDistance: boolean;

  private occluded = false;
  private detail: Detail = 'panned';
  private connected = false;
  private pending = 0;

  constructor(engine: AudioEngine, model: SoundModel, options: EmitterOptions) {
    this.engine = engine;
    this.model = model;
    this.position.copy(options.position);
    this.maxDistance = options.maxDistance ?? 60;
    this.reverb = options.reverb ?? 1;
    this.importance = options.importance ?? 1;
    this.ignoreAbsorption = options.ignoreAbsorption ?? false;
    this.ignoreOcclusion = options.ignoreOcclusion ?? false;
    this.invertDistance = options.invertDistance ?? false;

    const context = engine.context;

    this.absorption = context.createBiquadFilter();
    this.absorption.type = 'lowpass';
    this.absorption.frequency.value = OPEN_HZ;

    this.occlusion = context.createGain();
    this.swap = context.createGain();

    this.panner = context.createPanner();
    // Starts cheap. The engine promotes the nearest few on its first tick,
    // which happens before anything has had time to be heard.
    this.panner.panningModel = 'equalpower';
    this.panner.distanceModel = 'inverse';
    this.panner.refDistance = options.refDistance ?? 1.5;
    this.panner.maxDistance = this.maxDistance;
    // Zero disables distance attenuation entirely, which is what an inverted
    // curve needs — it is driven from `update` instead.
    this.panner.rolloffFactor = this.invertDistance ? 0 : (options.rolloff ?? 1.1);

    if (options.direction) {
      this.panner.coneInnerAngle = options.coneInner ?? 90;
      this.panner.coneOuterAngle = options.coneOuter ?? 240;
      this.panner.coneOuterGain = options.coneOuterGain ?? 0.35;
      setOrientation(this.panner, options.direction);
    }

    setPosition(this.panner, this.position);

    this.sendGain = context.createGain();
    this.sendGain.gain.value = this.reverb;

    this.absorption.connect(this.occlusion);
    this.occlusion.connect(this.swap);
    this.swap.connect(this.panner);
    this.panner.connect(engine.dry);
    this.panner.connect(this.sendGain);
    this.sendGain.connect(engine.send);

    this.connect();
    engine.register(this);
  }

  /** Moves the emitter. Cheap enough to call every frame for moving sources. */
  moveTo(position: THREE.Vector3): void {
    this.position.copy(position);
    setPosition(this.panner, this.position);
  }

  /**
   * Assigned by the engine once per occlusion tick — see the class doc.
   * Idempotent: called with the same value most ticks.
   */
  setDetail(next: Detail): void {
    if (next === this.detail) return;
    this.detail = next;
    this.retarget();
  }

  /**
   * Fades out, changes what the signal is routed through, fades back in.
   *
   * Every transition goes through silence, including going virtual. HRTF
   * delays its output by the length of the impulse response and equal-power
   * does not, so swapping mid-signal steps the waveform; and disconnecting a
   * source that is still audible is a cut. The `enabled` path reaches here
   * while the emitter is still at a fifth of its level, so a bare
   * `disconnect()` would click every time a zone changed.
   *
   * Forty milliseconds each way, on sounds that are by definition not the ones
   * being listened to.
   */
  private retarget(): void {
    const context = this.engine.context;
    const now = context.currentTime;

    this.swap.gain.cancelScheduledValues(now);
    this.swap.gain.setValueAtTime(this.swap.gain.value, now);
    this.swap.gain.linearRampToValueAtTime(0, now + SWAP_DIP);

    // One timer per emitter. A transition arriving while another is pending
    // supersedes it rather than queueing — a fast walk past a cluster of
    // sources would otherwise leave stale swaps firing in the wrong order.
    window.clearTimeout(this.pending);
    this.pending = window.setTimeout(
      () => {
        const target = this.detail;

        if (target === 'virtual') {
          if (this.connected) {
            this.disconnect();
            this.model.setActive?.(false);
          }
          return; // left silent; the fade back in belongs to whatever revives it
        }

        if (!this.connected) {
          this.connect();
          this.model.setActive?.(true);
        }
        this.panner.panningModel = target === 'hrtf' ? 'HRTF' : 'equalpower';

        const then = context.currentTime;
        this.swap.gain.cancelScheduledValues(then);
        this.swap.gain.setValueAtTime(0, then);
        this.swap.gain.linearRampToValueAtTime(1, then + SWAP_DIP);
      },
      SWAP_DIP * 1000 + 10,
    );
  }

  /**
   * @param retestOcclusion Whether the occlusion raycast is due this frame. The
   *   engine paces it; casting every frame for every emitter is the one part of
   *   this that would actually cost something.
   */
  update(dt: number, collider: Collider, retestOcclusion: boolean): void {
    if (this.detail === 'virtual' || !this.enabled) {
      if (this.enabled === false && this.connected) this.glide(this.occlusion.gain, 0);
      return;
    }

    this.model.update?.(dt, this.engine, this.position);

    // Everything below rides the occlusion tick rather than the frame. The
    // three writes at the end are `setTargetAtTime` with an 0.08 s constant and
    // a plain send level, so the filter already smooths five frames of them.
    // One distance per emitter per tick serves the raycast, the absorption
    // curve and the taper together.
    if (!retestOcclusion) return;

    const distance = this.position.distanceTo(this.engine.listenerPosition);
    if (!this.ignoreOcclusion) this.occluded = this.testOcclusion(collider, distance);

    const settings = this.engine.settings;
    const reach = Math.min(distance / this.maxDistance, 1);

    // Absorption rises with distance, and the curve is deliberately steep near
    // the listener: most of the perceptual change happens in the first few
    // metres, not the last few.
    const absorbed = this.ignoreAbsorption
      ? OPEN_HZ
      : OPEN_HZ * (1 - settings.airAbsorption * Math.sqrt(reach) * 0.94);

    const occlusionMix = this.occluded ? settings.occlusion : 0;
    const cutoff = Math.min(absorbed, lerp(OPEN_HZ, OCCLUDED_HZ, occlusionMix));

    // Smootherstep rather than a straight line: a linear fade to zero has a
    // corner at each end, and a gain corner on a sustained source is audible as
    // a change of gear rather than as distance.
    const taper = this.invertDistance
      ? // Backwards, and silent at the source rather than merely quiet — a
        // thing you can only hear from across the valley has to actually stop
        // when you arrive, or the effect reads as a bug.
        smootherstep(reach)
      : reach <= TAPER_FROM
        ? 1
        : 1 - smootherstep((reach - TAPER_FROM) / (1 - TAPER_FROM));

    this.glide(this.absorption.frequency, Math.max(cutoff, 180));
    this.glide(this.occlusion.gain, lerp(1, OCCLUDED_GAIN, occlusionMix) * taper);
    this.sendGain.gain.value = this.reverb * settings.reverbAmount;
  }

  /**
   * One ray, listener to source. If it hits anything before it arrives, there
   * is something in the way.
   *
   * Deliberately binary. Real occlusion is a question of how much material is
   * between two points and what it is made of, and honest answers to that cost
   * more than this whole engine. One ray plus a slow crossfade gets most of
   * the way there.
   */
  private testOcclusion(collider: Collider, distance: number): boolean {
    if (distance < 0.5) return false;
    _direction.subVectors(this.position, this.engine.listenerPosition).divideScalar(distance);
    const hit = collider.raycast(this.engine.listenerPosition, _direction);
    return hit !== null && hit < distance - 0.35;
  }

  private connect(): void {
    if (this.connected) return;
    this.model.output.connect(this.absorption);
    this.connected = true;
  }

  private disconnect(): void {
    if (!this.connected) return;
    try {
      this.model.output.disconnect(this.absorption);
    } catch {
      // Already detached. Web Audio throws rather than shrugging.
    }
    this.connected = false;
  }

  private glide(param: AudioParam, value: number): void {
    param.setTargetAtTime(value, this.engine.context.currentTime, GLIDE);
  }

  get isOccluded(): boolean {
    return this.occluded;
  }

  get isVirtual(): boolean {
    return this.detail === 'virtual';
  }

  get detailLevel(): Detail {
    return this.detail;
  }

  dispose(): void {
    this.engine.unregister(this);
    this.disconnect();
    this.model.dispose();
    this.panner.disconnect();
    this.sendGain.disconnect();
    this.absorption.disconnect();
    this.occlusion.disconnect();
    this.swap.disconnect();
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

/** Ken Perlin's smootherstep: zero first *and* second derivative at both ends. */
function smootherstep(t: number): number {
  const x = t < 0 ? 0 : t > 1 ? 1 : t;
  return x * x * x * (x * (x * 6 - 15) + 10);
}

const _direction = new THREE.Vector3();
