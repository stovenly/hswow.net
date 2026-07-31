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
 *
 * ## Detail levels
 *
 * **HRTF panning is the most expensive node in the Web Audio API.** It runs a
 * continuous convolution against a head-related impulse response, per source,
 * forever — and it is what makes a sound seem to be *outside your head* rather
 * than merely on your left, so it is also the one thing here worth paying for.
 * The way to afford both is to pay for it only where it is audible.
 *
 * Every emitter sits at one of three levels, assigned by the engine:
 *
 * - `'hrtf'` — full spatialisation. Reserved for the nearest handful, where
 *   the difference is obvious.
 * - `'panned'` — equal-power panning. Direction without the convolution. At
 *   twenty metres nobody can tell, and it costs almost nothing.
 * - `'virtual'` — **the model is disconnected from the graph entirely.** Not
 *   turned down: disconnected. A silent source still has its filters and its
 *   panner processed every quantum, so gating on gain saves nothing at all.
 *   This is where the real budget comes from.
 *
 * Switching between the first two is done under a brief gain dip, because
 * HRTF carries an inherent delay that equal-power does not, and stepping
 * between them mid-signal is an audible discontinuity.
 */

export interface SoundModel {
  readonly output: AudioNode;
  /** Called each frame while audible. */
  update?(dt: number, engine: AudioEngine): void;
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
   * How hard this emitter competes for the voice budget.
   *
   * Priority is distance divided by importance, so 2 makes an emitter behave
   * as though it were half as far away. For the one sound in a zone that has
   * to be heard — the thing the player is meant to walk toward — not for
   * making something louder, which is what `refDistance` is for.
   */
  importance?: number;

  // --- deliberate violations of physics -----------------------------------
  //
  // Everything above models how sound actually behaves. These three switch
  // parts of that off, and they exist for exactly one reason: in a world with
  // a magical register, the way you signal that something is *not* an ordinary
  // object making an ordinary noise is to have it disobey the rules every
  // other sound in the world visibly obeys. A voice that does not get duller
  // with distance, or that walls do not muffle, is placed by the ear as "not
  // here" long before the player could say why.
  //
  // Used sparingly they are uncanny. Used often they are just a mix with no
  // depth in it.

  /** Distance stops darkening it. Reads as unnaturally present. */
  ignoreAbsorption?: boolean;
  /** Walls stop muffling it. Reads as coming from nowhere in particular. */
  ignoreOcclusion?: boolean;
  /**
   * Clearer the further away you get, silent when you reach it.
   *
   * The panner's own distance model is switched off and the curve is driven
   * from here instead, because no distance model in Web Audio runs backwards.
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
 * **Web Audio's distance models never reach zero.** `inverse` clamps the
 * distance to `maxDistance` and holds whatever gain that implies — for a source
 * with `refDistance` 2.5 and `rolloff` 1.1 at 40 m that is about −29 dB, which
 * is quiet but perfectly audible in a still scene. The emitter then goes
 * virtual one metre later and stops dead.
 *
 * So the far field was both too loud and, at the very edge, a step. This tapers
 * the last part of the range smoothly to silence, which makes `maxDistance`
 * mean what it looks like it means: the distance past which you cannot hear
 * this. Raising an emitter's `rolloff` steepens the near field; this fixes the
 * far one, and the two are worth tuning separately.
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
   * Assigned by the engine once per occlusion tick. See the class doc.
   *
   * Idempotent — called with the same value most ticks, and only a change
   * does anything.
   */
  setDetail(next: Detail): void {
    if (next === this.detail) return;
    this.detail = next;
    this.retarget();
  }

  /**
   * Fades out, changes what the signal is routed through, fades back in.
   *
   * **Every transition goes through silence, including going virtual.** HRTF
   * delays its output by the length of the impulse response and equal-power
   * does not, so swapping between them mid-signal steps the waveform. And
   * disconnecting a source that is still audible is a cut, which is worse —
   * the `enabled` path in particular reaches here while the emitter is still
   * at a fifth of its level, so a bare `disconnect()` would click every time a
   * zone changed.
   *
   * Forty milliseconds each way, once per transition, on sounds that are by
   * definition not the ones being listened to.
   */
  private retarget(): void {
    const context = this.engine.context;
    const now = context.currentTime;

    this.swap.gain.cancelScheduledValues(now);
    this.swap.gain.setValueAtTime(this.swap.gain.value, now);
    this.swap.gain.linearRampToValueAtTime(0, now + SWAP_DIP);

    // One timer per emitter. A transition that arrives while another is still
    // pending supersedes it rather than queueing behind it — otherwise a fast
    // walk past a cluster of sources leaves a backlog of stale swaps that fire
    // in the wrong order.
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
   * @param retestOcclusion Whether the occlusion raycast is due this frame.
   *   The engine paces it; casting every frame for every emitter is the one
   *   part of this that would actually cost something.
   */
  update(dt: number, collider: Collider, retestOcclusion: boolean): void {
    if (this.detail === 'virtual' || !this.enabled) {
      if (this.enabled === false && this.connected) this.glide(this.occlusion.gain, 0);
      return;
    }

    const distance = this.position.distanceTo(this.engine.listenerPosition);

    this.model.update?.(dt, this.engine);

    if (retestOcclusion && !this.ignoreOcclusion) {
      this.occluded = this.testOcclusion(collider, distance);
    }

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
