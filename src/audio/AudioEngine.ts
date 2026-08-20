import * as THREE from 'three';
import { createNoiseBuffers, type NoiseBuffers } from './noise';
import { generateImpulseResponse, ROOM_PRESETS, type RoomName, type RoomAcoustics } from './reverb';
import { Weather } from './weather';
import type { Emitter } from './Emitter';
import { createFaustNode, type FaustNode } from './faust/FaustNode';
import { reverbMeta, reverbUrl } from './faust/built/reverb';
import { registerVoice } from './voice/Voice';

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
 * The duck bus is a stub until there is dialogue to duck under.
 *
 * Browsers refuse to start an `AudioContext` without a user gesture, so the
 * context is created suspended and resumed on the first click or key. On
 * desktop that is the same click that grabs pointer lock.
 */

export interface AudioSettings {
  masterVolume: number;
  /** Multiplies every emitter's reverb send. 0 kills the rooms entirely. */
  reverbAmount: number;
  /**
   * How hard distance darkens a sound, 0..1. Air absorbs high frequencies far
   * more than low, so a distant sound is dull as well as quiet — this is the
   * control that most decides whether the world has depth.
   */
  airAbsorption: number;
  /** How much a wall between you and a sound muffles it, 0..1. */
  occlusion: number;
  /** The music director's level. The gain exists whether or not a zone is scored. */
  musicVolume: number;
}

export const DEFAULT_AUDIO: AudioSettings = {
  masterVolume: 0.7,
  reverbAmount: 1,
  airAbsorption: 0.65,
  occlusion: 0.8,
  musicVolume: 0.3,
};

/** Raycasts listener→emitter cost real time; they do not need doing every frame. */
const OCCLUSION_INTERVAL = 0.12;

/**
 * How many emitters get full HRTF spatialisation. The most expensive node in
 * the API, and the one that puts a sound outside your head rather than merely
 * on one side of it. Enough that everything in the room with you is placed,
 * few enough that a zone can afford forty sources.
 */
const HRTF_VOICES = 8;

/**
 * Ceiling on emitters that are audible at all. Beyond this the quietest are
 * forced virtual — disconnected, not turned down. Past a couple of dozen
 * simultaneous sources nothing is individually audible anyway, so the ones
 * that lose are ones nobody could have picked out.
 */
const VOICE_CAP = 24;

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
  /** Resolves true when the voice worklet registered, false when it could not. */
  readonly voiceReady: Promise<boolean>;

  /** True once a gesture has let the context actually run. */
  started = false;

  private readonly rooms = new Map<RoomName, { convolver: ConvolverNode; gain: GainNode }>();
  private currentRoom: RoomName | null = null;
  private occlusionTimer = 0;

  /**
   * Every live emitter, so the budget can be allocated across all of them. An
   * emitter cannot decide its own detail level: whether it deserves HRTF
   * depends on what *else* is audible, which only the engine knows. Emitters
   * register themselves on construction.
   */
  private readonly emitters = new Set<Emitter>();
  /**
   * The ranking, and the entries it is built out of. `entries` holds one object
   * per rank and grows to the high-water mark; `ranking` is emptied and
   * refilled with references to them, so a tick allocates nothing.
   */
  private readonly entries: { emitter: Emitter; priority: number }[] = [];
  private readonly ranking: { emitter: Emitter; priority: number }[] = [];

  /**
   * The feedback-delay-network reverb, when it loads. `null` means the wasm did
   * not arrive and the convolvers are carrying the rooms instead. Both paths
   * exist permanently and exactly one is audible.
   */
  private faust: FaustNode | null = null;
  private faustWet: GainNode | null = null;
  /** Built on demand by `analyser`. Nothing in the game proper asks for it. */
  private tap: AnalyserNode | null = null;

  /**
   * @param latencyHint How big a buffer to ask the device for. `'interactive'`
   *   is the smallest it will give, because footsteps that arrive late feel
   *   like someone else's footsteps; `'playback'` is at least 20 ms on Windows
   *   and survives a busy machine. A context's buffer size is fixed once it is
   *   open, so this cannot be changed without a reload.
   */
  constructor(latencyHint: AudioContextLatencyCategory = 'interactive') {
    this.context = new AudioContext({ latencyHint });

    this.master = this.context.createGain();
    this.duck = this.context.createGain();
    this.dry = this.context.createGain();
    this.send = this.context.createGain();

    // A limiter, not a compressor, despite the node's name. Procedural audio
    // has no mastering engineer, and a dozen emitters lining up in phase is a
    // matter of when rather than if.
    //
    // It has to stay out of the way until something would actually clip. A
    // threshold that starts working on a villager talking three metres away
    // pulls the whole mix down on every syllable, and a voice through that
    // sounds compressed, because it is.
    const limiter = this.context.createDynamicsCompressor();
    limiter.threshold.value = -2;
    limiter.knee.value = 2;
    limiter.ratio.value = 16;
    limiter.attack.value = 0.002;
    limiter.release.value = 0.1;

    this.dry.connect(this.duck);
    this.duck.connect(this.master);
    this.master.connect(limiter);
    limiter.connect(this.context.destination);

    // Before `build`, because `build` publishes `noise` and that is the flag
    // creatures take as "you may have a voice now". A creature holds the voice
    // it is given for life, so losing that race is permanent.
    this.voiceReady = registerVoice(this.context);

    this.ready = this.build();
    this.listenForGesture();
    document.addEventListener('visibilitychange', this.handleVisibility);
  }

  private async build(): Promise<void> {
    this.noise = createNoiseBuffers(this.context);

    // Tried first, because if it arrives the convolvers never make a sound and
    // there is no point paying for their impulse responses to be crossfaded.
    // They are still built: a room has to exist even when the network does not.
    const faust = await createFaustNode(this.context, reverbUrl, reverbMeta);
    if (faust) {
      const wet = this.context.createGain();
      wet.gain.value = 0;
      this.send.connect(faust.node);
      faust.node.connect(wet);
      wet.connect(this.duck);
      this.faust = faust;
      this.faustWet = wet;
    }

    // Rendered in parallel; the hall's four-second tail is the long pole.
    const names = Object.keys(ROOM_PRESETS) as RoomName[];
    const buffers = await Promise.all(
      names.map((name) => generateImpulseResponse(this.context.sampleRate, ROOM_PRESETS[name])),
    );

    // Only if the network did not arrive. A `ConvolverNode` is one of the most
    // expensive nodes in the API and it does not stop working when its output
    // gain is zero — it keeps convolving the send bus into silence.
    if (this.faust) return;

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
    const now = this.context.currentTime;
    const preset = ROOM_PRESETS[name];

    // --- the network -------------------------------------------------------
    //
    // No crossfade, and none is wanted. An FDN has no buffer to swap: changing
    // its decay changes the feedback gains, so the tail already ringing carries
    // on and starts dying at the new rate. Walking out of a hall is the room
    // changing size rather than two rooms fading past each other.
    if (this.faust && this.faustWet) {
      // Bass rings longer than treble in any real room — it is most of what
      // makes stone sound like stone — and a single RT60 cannot say so.
      this.faust.set('decayLow', preset.rt60 * 1.5);
      this.faust.set('decayMid', preset.rt60);
      this.faust.set('crossover', 200);
      // `damping` is 0 (bare stone) to 1 (heavy curtains); the control is the
      // frequency above which the tail dies fastest, so it runs the other way.
      this.faust.set('damping', 700 + (1 - preset.damping) ** 2 * 15300);
      this.faust.set('preDelay', preset.preDelay * 1000);

      this.faustWet.gain.cancelScheduledValues(now);
      this.faustWet.gain.setTargetAtTime(
        preset.wet * this.settings.reverbAmount,
        now,
        seconds / 3,
      );
      return;
    }

    // --- the fallback ------------------------------------------------------
    if (this.rooms.size === 0) return; // IRs still rendering; picked up in build()

    for (const [key, room] of this.rooms) {
      const target = key === name ? ROOM_PRESETS[key].wet * this.settings.reverbAmount : 0;
      room.gain.gain.cancelScheduledValues(now);
      room.gain.gain.setTargetAtTime(target, now, seconds / 3);
    }
  }

  /** Which reverb is actually running, for the debug readout. */
  get reverbKind(): 'fdn' | 'convolution' {
    return this.faust ? 'fdn' : 'convolution';
  }

  /**
   * The reverb's compiled module, for a generated tuning panel. `null` on the
   * convolution fallback, which has nothing to expose — an impulse response is
   * not adjustable, and that is the whole reason the network exists.
   *
   * The panel reaches separate low and mid decay and the crossover between
   * them, which is most of what makes stone sound like stone and which a
   * single RT60 cannot say.
   *
   * `setRoom` rewrites all of these on every zone change, so a hand-set decay
   * lasts until the next doorway. That is the intended lifetime: the panel is
   * for finding a number, and the number's home is a room preset.
   */
  get reverbControls(): FaustNode | null {
    return this.faust;
  }

  /**
   * An analyser across the master bus, built the first time it is asked for.
   * Tapped off `master` rather than the destination, because the limiter sits
   * after it and a limited signal tells you what survived rather than what was
   * sent. Never created unless something asks — an FFT per frame is not free.
   */
  get analyser(): AnalyserNode {
    if (!this.tap) {
      const analyser = this.context.createAnalyser();
      // 1024 bins over 24 kHz is about 23 Hz apiece — enough to see a
      // fundamental at 40 Hz sit apart from its second harmonic, which is the
      // resolution these models are actually judged at.
      analyser.fftSize = 2048;
      // Long enough that a band does not flicker between frames, short enough
      // that a hammer still shows up as an event.
      analyser.smoothingTimeConstant = 0.6;
      this.master.connect(analyser);
      this.tap = analyser;
    }
    return this.tap;
  }

  get room(): RoomName | null {
    return this.currentRoom;
  }

  /** Emitters register themselves. Not called directly. */
  register(emitter: Emitter): void {
    this.emitters.add(emitter);
  }

  unregister(emitter: Emitter): void {
    this.emitters.delete(emitter);
  }

  /** Per-frame housekeeping: weather, listener pose, and the occlusion clock. */
  update(dt: number, camera: THREE.Camera): boolean {
    this.weather.update(dt);
    this.updateListener(camera);
    // Written when it moves, which is when a slider moves. An `AudioParam`
    // assignment is a message to the audio thread and was being sent sixty
    // times a second to say the same number.
    if (this.master.gain.value !== this.settings.masterVolume) {
      this.master.gain.value = this.settings.masterVolume;
    }

    this.occlusionTimer -= dt;
    if (this.occlusionTimer > 0) return false;
    this.occlusionTimer = OCCLUSION_INTERVAL;

    // Paced with the raycasts rather than run every frame. Both are answers to
    // "what can be heard from here", both change at walking pace, and doing
    // them together means one distance calculation per emitter serves both.
    this.allocateVoices();
    return true; // emitters should re-test occlusion this frame
  }

  /**
   * Hands out the HRTF and audibility budgets, ranked by distance over
   * importance, so an emitter marked important competes as though it were
   * nearer. Anything past its own `maxDistance` is out regardless of rank: the
   * budget decides between things you could hear.
   */
  private allocateVoices(): void {
    this.ranking.length = 0;
    let n = 0;
    for (const emitter of this.emitters) {
      if (!emitter.enabled) {
        emitter.setDetail('virtual');
        continue;
      }
      const distance = emitter.position.distanceTo(_position);
      if (distance > emitter.maxDistance) {
        emitter.setDetail('virtual');
        continue;
      }
      const entry = (this.entries[n] ??= { emitter, priority: 0 });
      entry.emitter = emitter;
      entry.priority = distance / Math.max(emitter.importance, 0.01);
      this.ranking.push(entry);
      n++;
    }

    this.ranking.sort((a, b) => a.priority - b.priority);

    // Hysteresis, or the boundaries chatter. Two emitters at nearly equal
    // priority swap ranks on almost every tick and each swap costs a fade out
    // and back in. A dead band costs a couple of extra HRTF voices at worst.
    const SLACK = 2;
    for (let i = 0; i < this.ranking.length; i++) {
      const { emitter } = this.ranking[i];
      const held = emitter.detailLevel;

      let level: 'hrtf' | 'panned' | 'virtual';
      if (i < HRTF_VOICES) level = 'hrtf';
      else if (i < VOICE_CAP) level = 'panned';
      else level = 'virtual';

      // Only demote once it is properly past the line, never on a tie.
      if (held === 'hrtf' && i < HRTF_VOICES + SLACK) level = 'hrtf';
      else if (held === 'panned' && level === 'virtual' && i < VOICE_CAP + SLACK) level = 'panned';

      emitter.setDetail(level);
    }
  }

  /** How many emitters are at each level. For the debug readout. */
  get voiceCounts(): { hrtf: number; panned: number; virtual: number } {
    let hrtf = 0;
    let panned = 0;
    let virtual = 0;
    for (const emitter of this.emitters) {
      if (emitter.detailLevel === 'hrtf') hrtf++;
      else if (emitter.detailLevel === 'panned') panned++;
      else virtual++;
    }
    return { hrtf, panned, virtual };
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
