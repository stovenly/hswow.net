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
 * The duck bus pulls everything but the voices down under a line of dialogue.
 *
 * Browsers refuse to start an `AudioContext` without a user gesture, so the
 * context is created suspended and resumed on the first click or key. On
 * desktop that is the same click that grabs pointer lock.
 */

/** How far the world drops under a line of dialogue: about five decibels. */
const DUCK_UNDER = 0.56;

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
  /** The ambience layer's level, under its own limiter. */
  ambienceVolume: number;
  /** Your own feet and hands: footsteps and the door cue. */
  footstepVolume: number;
  /** Animals you can see, as against the ambience's unseen ones. */
  creatureVolume: number;
  /** People talking. */
  npcVolume: number;
  /** Precipitation, wherever it was declared. */
  weatherVolume: number;
}

export const DEFAULT_AUDIO: AudioSettings = {
  masterVolume: 0.7,
  reverbAmount: 1,
  airAbsorption: 0.65,
  occlusion: 0.8,
  musicVolume: 0.3,
  ambienceVolume: 0.85,
  // These four are the levels the game is already mixed at, so a slider at
  // 100% is the sound as designed and every slider only ever attenuates.
  footstepVolume: 1,
  creatureVolume: 1,
  npcVolume: 1,
  weatherVolume: 1,
};

/**
 * Where the early returns can land, in seconds.
 *
 * Spread over the range a real first reflection occupies: sound covers about
 * 34 cm per millisecond, so 7 ms is a wall two metres away and 140 ms is one
 * nearly fifty metres off. Prime-ish and irregular, because evenly spaced taps
 * comb-filter into a pitch and the pitch is the sound of a flanger.
 */
const EARLY_TAPS = [0.007, 0.013, 0.023, 0.037, 0.053, 0.079, 0.109, 0.149];

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
  /**
   * The first few returns off the nearest surfaces, which is what a person
   * means by *echo*. The tail says how big a space is; these say how hard it
   * is, how close the walls are, and whether there is anything soft in it —
   * and a cave without them is just a long reverb.
   */
  private readonly early: GainNode;
  private readonly taps: GainNode[] = [];
  /**
   * Sub-buses into `dry`, one per thing a player would reach for a slider to
   * turn down. A source belongs to exactly one of them, and anything that does
   * not belong to any goes straight to `dry` as before.
   */
  readonly steps: GainNode;
  /**
   * How much of the first-person bus reaches the room.
   *
   * Footsteps, the door cue, and anything else that happens *at* the listener
   * have no distance to derive a send from, so they need telling. It is one
   * number per zone on the bus rather than one field per sound: a weapon swing
   * added tomorrow inherits it without anybody remembering to.
   */
  private readonly stepsSend: GainNode;
  readonly creatures: GainNode;
  readonly voices: GainNode;
  readonly weatherBus: GainNode;
  /** Everything but the voices, pulled down under a line of dialogue. See `duckUnder`. */
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
  /** Rooms whose impulse response is still rendering. See `ensureRoom`. */
  private readonly pendingRooms = new Set<RoomName>();
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

    this.early = this.context.createGain();
    this.steps = this.context.createGain();
    this.creatures = this.context.createGain();
    this.voices = this.context.createGain();
    this.weatherBus = this.context.createGain();

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

    // Fixed times, per-room *levels*. Changing a `DelayNode`'s time while it
    // runs pitch-shifts whatever is in it, so a room chooses which of a fixed
    // set of returns it has rather than moving them — and a doorway is then a
    // crossfade between two patterns instead of a swept comb.
    this.send.connect(this.early);
    for (const time of EARLY_TAPS) {
      const delay = this.context.createDelay(0.5);
      delay.delayTime.value = time;
      const tap = this.context.createGain();
      tap.gain.value = 0;
      const pan = this.context.createStereoPanner();
      // Reflections do not all come from one side, and the alternation is what
      // keeps a room from collapsing onto whichever ear the source is in.
      pan.pan.value = (this.taps.length % 2 === 0 ? -1 : 1) * 0.45;
      this.early.connect(delay).connect(tap).connect(pan).connect(this.duck);
      this.taps.push(tap);
    }

    this.steps.connect(this.dry);
    this.stepsSend = this.context.createGain();
    this.stepsSend.gain.value = 0;
    this.steps.connect(this.stepsSend);
    this.stepsSend.connect(this.send);
    this.creatures.connect(this.dry);
    // Past the duck, not through it: the bus that dips under a line of
    // dialogue may not dip the line itself.
    this.voices.connect(this.master);
    this.weatherBus.connect(this.dry);

    const spread = crossfeed(this.context);
    this.dry.connect(this.duck);
    this.duck.connect(this.master);
    this.master.connect(spread.input);
    spread.output.connect(limiter);
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

    // Nothing is rendered here, and nothing is built here.
    //
    // A `ConvolverNode` is one of the most expensive nodes in the API and it
    // does not stop working when its output gain is zero — it keeps convolving
    // the send bus into silence. So the fallback exists only when the network
    // is missing, and even then a room is rendered the first time a zone asks
    // for it and never again.
    //
    // That is what makes the preset book free to grow: on the network path a
    // room is a handful of numbers, and on the fallback it costs one offline
    // render the first time somebody stands in it. Adding a room nobody visits
    // costs nothing at all.
    if (this.currentRoom !== null) this.setRoom(this.currentRoom);
  }

  /**
   * Builds the fallback's convolver for one room, once. Returns null while the
   * render is still running — the caller has already crossfaded, so the room
   * simply arrives a moment late rather than not at all.
   */
  private ensureRoom(name: RoomName): { convolver: ConvolverNode; gain: GainNode } | null {
    const built = this.rooms.get(name);
    if (built) return built;
    if (this.pendingRooms.has(name)) return null;
    this.pendingRooms.add(name);

    void generateImpulseResponse(this.context.sampleRate, ROOM_PRESETS[name]).then((buffer) => {
      this.pendingRooms.delete(name);
      if (this.faust) return;
      const convolver = this.context.createConvolver();
      convolver.normalize = true;
      convolver.buffer = buffer;

      const gain = this.context.createGain();
      gain.gain.value = 0;

      this.send.connect(convolver);
      convolver.connect(gain);
      gain.connect(this.duck);
      this.rooms.set(name, { convolver, gain });
      // Whatever the room is *now*, which may not be the one just rendered if
      // the player has walked on while it was being made.
      if (this.currentRoom !== null) this.setRoom(this.currentRoom, 0.25);
    });
    return null;
  }

  /**
   * Crossfades to a room's acoustics. Safe to call every frame with the same
   * value; only a change does anything.
   */
  setRoom(name: RoomName, seconds = 0.45): void {
    this.currentRoom = name;
    const now = this.context.currentTime;
    const preset = ROOM_PRESETS[name];

    // The early reflections, whichever tail is running underneath them. A
    // Gaussian window over the fixed taps: `spread` picks which returns this
    // room has and `bounce` says how much comes back.
    const width = Math.max(preset.spread * 0.8, 0.008);
    this.taps.forEach((tap, i) => {
      const offset = (EARLY_TAPS[i] - preset.spread) / width;
      const weight = Math.exp(-offset * offset);
      tap.gain.setTargetAtTime(
        preset.bounce * weight * this.settings.reverbAmount,
        now,
        seconds / 3,
      );
    });

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
    this.ensureRoom(name);

    for (const [key, room] of this.rooms) {
      const target = key === name ? ROOM_PRESETS[key].wet * this.settings.reverbAmount : 0;
      room.gain.gain.cancelScheduledValues(now);
      room.gain.gain.setTargetAtTime(target, now, seconds / 3);
    }
  }

  /**
   * How much of what happens at the listener feeds the room, 0..1. Set per
   * zone; see `stepsSend`.
   */
  setFirstPersonReverb(amount: number): void {
    this.stepsSend.gain.setTargetAtTime(
      Math.min(1, Math.max(0, amount)),
      this.context.currentTime,
      0.12,
    );
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
  /**
   * Pulls the world down under a line of dialogue and lets it back up after.
   * Both ends are ramps: a hard step reads as a fault in the mix.
   */
  duckUnder(from: number, until: number): void {
    const gain = this.duck.gain;
    const at = Math.max(from, this.context.currentTime);
    gain.cancelScheduledValues(at);
    gain.setTargetAtTime(DUCK_UNDER, at, 0.12);
    gain.setTargetAtTime(1, Math.max(until, at + 0.1), 0.3);
  }

  update(dt: number, camera: THREE.Camera): boolean {
    this.weather.update(dt);
    this.updateListener(camera);
    // Written when it moves, which is when a slider moves. An `AudioParam`
    // assignment is a message to the audio thread and was being sent sixty
    // times a second to say the same number.
    if (this.master.gain.value !== this.settings.masterVolume) {
      this.master.gain.value = this.settings.masterVolume;
    }
    // Written when they move, for the same reason: an `AudioParam` assignment
    // is a message to the audio thread and these change when a slider does.
    this.hold(this.steps, this.settings.footstepVolume);
    this.hold(this.creatures, this.settings.creatureVolume);
    this.hold(this.voices, this.settings.npcVolume);
    this.hold(this.weatherBus, this.settings.weatherVolume);

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
  private hold(gain: GainNode, value: number): void {
    if (gain.gain.value !== value) gain.gain.value = value;
  }

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

/**
 * How much of each channel is fed to the other, and how dull it arrives.
 *
 * **Nothing in the world ever reaches one ear and not the other.** A head is
 * not an infinite baffle: a sound hard on your right still arrives at your left
 * a few hundred microseconds later and only six to ten decibels down, and dull,
 * because a head is small compared to a bass wavelength and large compared to a
 * treble one. Panning that reaches the ends of the field has no physical
 * counterpart at all — it is a property of two loudspeakers, not of listening —
 * and on headphones it is the thing that makes a mix feel like it is happening
 * inside your skull rather than around you.
 *
 * So the whole master is crossfed. The delay is the real interaural one at a
 * wide angle; the lowpass is the head shadow, which is why the bleed is warm
 * and does not smear the top end. This costs four nodes for the entire game and
 * it applies to every source, positioned or not, including anything added later
 * that forgets to think about it.
 */
const CROSSFEED = 0.32;
const CROSSFEED_DELAY = 0.00027;
const CROSSFEED_HZ = 750;

function crossfeed(context: BaseAudioContext): { input: GainNode; output: GainNode } {
  const input = context.createGain();
  const output = context.createGain();
  const split = context.createChannelSplitter(2);
  const merge = context.createChannelMerger(2);

  input.connect(split);
  // The direct path, untouched.
  split.connect(merge, 0, 0);
  split.connect(merge, 1, 1);

  for (let side = 0; side < 2; side++) {
    const delay = context.createDelay(0.01);
    delay.delayTime.value = CROSSFEED_DELAY;
    const shadow = context.createBiquadFilter();
    shadow.type = 'lowpass';
    shadow.frequency.value = CROSSFEED_HZ;
    shadow.Q.value = 0.5;
    const level = context.createGain();
    level.gain.value = CROSSFEED;
    split.connect(delay, side).connect(shadow).connect(level);
    // Into the *other* ear.
    level.connect(merge, 0, side === 0 ? 1 : 0);
  }

  merge.connect(output);
  return { input, output };
}

export type { RoomName, RoomAcoustics };

const _position = new THREE.Vector3();
const _orientation = new THREE.Vector3();
const _up = new THREE.Vector3();
const _quaternion = new THREE.Quaternion();
