import * as THREE from 'three';
import { createNoiseBuffers, type NoiseBuffers } from './noise';
import { generateImpulseResponse, ROOM_PRESETS, type RoomName, type RoomAcoustics } from './reverb';
import { Weather } from './weather';

/**
 * The audio graph and its lifecycle.
 *
 * ```
 *  emitter ─► panner ─┬─► dry ────────────────────────┐
 *                     └─► send ─► room A convolver ───┤
 *                              └► room B convolver ───┼─► duck ─► master ─► limiter ─► out
 *                                                     │
 *  non-positional beds ───────────────────────────────┘
 * ```
 *
 * Two convolvers rather than one, crossfaded: swapping a `ConvolverNode`'s
 * buffer cuts its tail dead, so walking through a doorway would chop the room
 * you just left instead of letting it fall away behind you.
 *
 * The duck bus does nothing yet. Phase 8 pulls it down under dialogue.
 *
 * Browsers refuse to start an `AudioContext` without a user gesture, so the
 * context is created suspended and resumed on the first click, key or touch.
 * On desktop that is the same click that grabs pointer lock, so nothing has to
 * be asked of the player.
 */

export interface AudioSettings {
  masterVolume: number;
  /** Multiplies every emitter's reverb send. 0 kills the rooms entirely. */
  reverbAmount: number;
  /**
   * How hard distance darkens a sound, 0..1.
   *
   * Air absorbs high frequencies far more than low ones, so a distant sound is
   * not merely a quiet one — it is a dull one. This is the single control that
   * most decides whether the world has depth or is a flat mix of loud and
   * soft things.
   */
  airAbsorption: number;
  /** How much a wall between you and a sound muffles it, 0..1. */
  occlusion: number;
}

export const DEFAULT_AUDIO: AudioSettings = {
  masterVolume: 0.7,
  reverbAmount: 1,
  airAbsorption: 0.65,
  occlusion: 0.8,
};

/** Raycasts listener→emitter cost real time; they do not need doing every frame. */
const OCCLUSION_INTERVAL = 0.12;

export class AudioEngine {
  readonly context: AudioContext;
  readonly settings: AudioSettings = { ...DEFAULT_AUDIO };
  readonly weather = new Weather();

  /** Emitters connect their dry path here and their wet path to `send`. */
  readonly dry: GainNode;
  readonly send: GainNode;
  /** Pulled down under dialogue in Phase 8. Unity for now. */
  readonly duck: GainNode;
  readonly master: GainNode;

  noise: NoiseBuffers | null = null;
  /** Resolves once the noise buffers and every room IR are ready. */
  readonly ready: Promise<void>;

  /** True once a gesture has let the context actually run. */
  started = false;

  private readonly rooms = new Map<RoomName, { convolver: ConvolverNode; gain: GainNode }>();
  private currentRoom: RoomName | null = null;
  private occlusionTimer = 0;

  constructor() {
    // 'interactive' asks for the smallest buffer the device will give, because
    // footsteps that arrive late feel like someone else's footsteps.
    this.context = new AudioContext({ latencyHint: 'interactive' });

    this.master = this.context.createGain();
    this.duck = this.context.createGain();
    this.dry = this.context.createGain();
    this.send = this.context.createGain();

    // A limiter, not a compressor, despite the node's name: the settings below
    // make it transparent until something would clip. Procedural audio has no
    // mastering engineer, and a dozen emitters lining up in phase is a matter
    // of when, not if.
    const limiter = this.context.createDynamicsCompressor();
    limiter.threshold.value = -6;
    limiter.knee.value = 6;
    limiter.ratio.value = 12;
    limiter.attack.value = 0.003;
    limiter.release.value = 0.25;

    this.dry.connect(this.duck);
    this.duck.connect(this.master);
    this.master.connect(limiter);
    limiter.connect(this.context.destination);

    this.ready = this.build();
    this.listenForGesture();
    document.addEventListener('visibilitychange', this.handleVisibility);
  }

  private async build(): Promise<void> {
    this.noise = createNoiseBuffers(this.context);

    // Rendered in parallel; the hall's four-second tail is the long pole.
    const names = Object.keys(ROOM_PRESETS) as RoomName[];
    const buffers = await Promise.all(
      names.map((name) => generateImpulseResponse(this.context.sampleRate, ROOM_PRESETS[name])),
    );

    names.forEach((name, index) => {
      const convolver = this.context.createConvolver();
      convolver.normalize = true;
      convolver.buffer = buffers[index];

      const gain = this.context.createGain();
      gain.gain.value = 0;

      this.send.connect(convolver);
      convolver.connect(gain);
      gain.connect(this.duck);
      this.rooms.set(name, { convolver, gain });
    });

    if (this.currentRoom !== null) this.setRoom(this.currentRoom);
  }

  /**
   * Crossfades to a room's acoustics. Safe to call every frame with the same
   * value; only a change does anything.
   */
  setRoom(name: RoomName, seconds = 0.45): void {
    this.currentRoom = name;
    if (this.rooms.size === 0) return; // IRs still rendering; picked up in build()

    const now = this.context.currentTime;
    for (const [key, room] of this.rooms) {
      const target = key === name ? ROOM_PRESETS[key].wet * this.settings.reverbAmount : 0;
      room.gain.gain.cancelScheduledValues(now);
      room.gain.gain.setTargetAtTime(target, now, seconds / 3);
    }
  }

  get room(): RoomName | null {
    return this.currentRoom;
  }

  /** Per-frame housekeeping: weather, listener pose, and the occlusion clock. */
  update(dt: number, camera: THREE.Camera): boolean {
    this.weather.update(dt);
    this.updateListener(camera);
    this.master.gain.value = this.settings.masterVolume;

    this.occlusionTimer -= dt;
    if (this.occlusionTimer > 0) return false;
    this.occlusionTimer = OCCLUSION_INTERVAL;
    return true; // emitters should re-test occlusion this frame
  }

  private updateListener(camera: THREE.Camera): void {
    const listener = this.context.listener;
    camera.updateWorldMatrix(true, false);

    _position.setFromMatrixPosition(camera.matrixWorld);
    _orientation.set(0, 0, -1).applyQuaternion(camera.getWorldQuaternion(_quaternion));
    _up.set(0, 1, 0).applyQuaternion(_quaternion);

    // Web Audio is y-up and right-handed, same as three, so the vectors carry
    // straight across with no conversion.
    if (listener.positionX) {
      const now = this.context.currentTime;
      // Ramped rather than set: a teleporting listener produces a click on
      // every panner at once.
      const ramp = 0.02;
      listener.positionX.linearRampToValueAtTime(_position.x, now + ramp);
      listener.positionY.linearRampToValueAtTime(_position.y, now + ramp);
      listener.positionZ.linearRampToValueAtTime(_position.z, now + ramp);
      listener.forwardX.linearRampToValueAtTime(_orientation.x, now + ramp);
      listener.forwardY.linearRampToValueAtTime(_orientation.y, now + ramp);
      listener.forwardZ.linearRampToValueAtTime(_orientation.z, now + ramp);
      listener.upX.linearRampToValueAtTime(_up.x, now + ramp);
      listener.upY.linearRampToValueAtTime(_up.y, now + ramp);
      listener.upZ.linearRampToValueAtTime(_up.z, now + ramp);
    } else {
      // Deprecated, and still the only thing some Safari builds implement.
      const legacy = listener as unknown as {
        setPosition(x: number, y: number, z: number): void;
        setOrientation(x: number, y: number, z: number, ux: number, uy: number, uz: number): void;
      };
      legacy.setPosition(_position.x, _position.y, _position.z);
      legacy.setOrientation(
        _orientation.x,
        _orientation.y,
        _orientation.z,
        _up.x,
        _up.y,
        _up.z,
      );
    }
  }

  /** The listener's world position, for distance and occlusion tests. */
  get listenerPosition(): THREE.Vector3 {
    return _position;
  }

  applyReverbAmount(): void {
    if (this.currentRoom !== null) this.setRoom(this.currentRoom, 0.05);
  }

  // --- lifecycle ----------------------------------------------------------

  private listenForGesture(): void {
    const start = (): void => {
      void this.context.resume().then(() => {
        this.started = this.context.state === 'running';
      });
      window.removeEventListener('pointerdown', start);
      window.removeEventListener('keydown', start);
      window.removeEventListener('touchstart', start);
    };
    window.addEventListener('pointerdown', start);
    window.addEventListener('keydown', start);
    window.addEventListener('touchstart', start);
  }

  private readonly handleVisibility = (): void => {
    if (document.hidden) {
      void this.context.suspend();
    } else if (this.started) {
      void this.context.resume();
    }
  };

  dispose(): void {
    document.removeEventListener('visibilitychange', this.handleVisibility);
    void this.context.close();
  }
}

export type { RoomName, RoomAcoustics };

const _position = new THREE.Vector3();
const _orientation = new THREE.Vector3();
const _up = new THREE.Vector3();
const _quaternion = new THREE.Quaternion();
