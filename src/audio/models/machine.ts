import type { AudioEngine } from '../AudioEngine';
import type { SoundModel } from '../Emitter';
import { playNoise, type NoiseVoice } from '../noise';
import { createEventClock, periodic } from '../dsp/clock';
import { strike } from '../dsp/envelopes';

/**
 * Something turning.
 *
 * Four parts, and all four are needed:
 *
 * - A **fundamental with a detuned harmonic stack** through a lowpass. Detuned
 *   because a real machine's harmonics are never exact multiples — the beating
 *   between them is what stops it sounding like a synthesiser patch.
 * - **Amplitude modulation at the rotation rate**, because a rotating thing
 *   presents a different face to you every revolution.
 * - **Filtered noise** for bearing hiss, which is most of what tells you the
 *   thing is mechanical and worn rather than electronic.
 * - **A per-revolution impulse** through a resonant bandpass: the clank. One
 *   loose part, once per turn. This is the detail that fixes the rotation rate
 *   in the listener's head — without it, speed is ambiguous.
 *
 * `rpm` is a live parameter, so machines can labour, spin up and stall.
 */

const HARMONICS = [1, 2, 3.02, 4.05, 5.97];
const HARMONIC_GAINS = [1, 0.5, 0.28, 0.16, 0.09];

export interface MachineOptions {
  /** Revolutions per minute. The clank fires once per revolution. */
  rpm?: number;
  /** Fundamental in Hz. Low is heavy industry, high is a small motor. */
  fundamental?: number;
  gain?: number;
  /** Bearing hiss level, 0..1. */
  wear?: number;
  /** Clank level, 0..1. Zero for something well maintained. */
  clank?: number;
}

export interface MachineModel extends SoundModel {
  /** Base speed. The phase cycle moves around this. Glides rather than jumps. */
  setRpm(value: number): void;
  /** What the machine is currently doing, for the debug readout. */
  readonly phase: PhaseName;
  /** Actual current speed, phase included. Drives the visible flywheel. */
  readonly currentRpm: number;
}

export type PhaseName = 'steady' | 'labouring' | 'surging' | 'stalling' | 'idling';

/**
 * What the machine does, and for how long.
 *
 * A machine at one constant speed is a drone, and the ear files a drone away
 * within seconds and stops hearing it. What keeps it present is that it is
 * evidently *doing* something — taking on load, freeing up, catching, easing
 * off — and none of that needs to be visible to be felt.
 *
 * `speed` multiplies the base rpm; `wear` and `clank` scale their layers, so a
 * labouring machine is not merely slower but rougher and more percussive,
 * which is what load actually sounds like.
 */
const PHASES: Record<PhaseName, {
  speed: number;
  wear: number;
  clank: number;
  min: number;
  max: number;
  next: PhaseName[];
}> = {
  steady: { speed: 1, wear: 1, clank: 1, min: 9, max: 26, next: ['labouring', 'surging', 'idling'] },
  labouring: { speed: 0.62, wear: 1.8, clank: 1.7, min: 5, max: 14, next: ['steady', 'stalling', 'surging'] },
  surging: { speed: 1.34, wear: 1.3, clank: 0.8, min: 3, max: 9, next: ['steady', 'labouring'] },
  stalling: { speed: 0.22, wear: 2.2, clank: 2.4, min: 1.5, max: 4, next: ['labouring', 'idling'] },
  idling: { speed: 0.45, wear: 0.7, clank: 0.5, min: 8, max: 20, next: ['steady', 'surging'] },
};

export function createMachine(engine: AudioEngine, options: MachineOptions = {}): MachineModel {
  const context = engine.context;
  const noise = engine.noise;
  if (!noise) throw new Error('machine model built before the noise buffers were ready');

  const fundamental = options.fundamental ?? 46;
  const clankAmount = options.clank ?? 0.5;

  const output = context.createGain();
  output.gain.value = options.gain ?? 0.35;

  // --- the tonal body -----------------------------------------------------
  const body = context.createGain();
  body.gain.value = 0.5;

  const shaping = context.createBiquadFilter();
  shaping.type = 'lowpass';
  shaping.frequency.value = 520;
  shaping.Q.value = 0.9;

  const oscillators: OscillatorNode[] = [];
  HARMONICS.forEach((ratio, index) => {
    const osc = context.createOscillator();
    osc.type = index === 0 ? 'sawtooth' : 'triangle';
    osc.frequency.value = fundamental * ratio;
    // A few cents off, so the partials beat against one another slowly.
    osc.detune.value = (Math.random() * 2 - 1) * 9;

    const gain = context.createGain();
    gain.gain.value = HARMONIC_GAINS[index];
    osc.connect(gain).connect(shaping);
    osc.start();
    oscillators.push(osc);
  });
  shaping.connect(body);

  // --- rotation, as amplitude modulation ----------------------------------
  const wobble = context.createGain();
  wobble.gain.value = 1;
  const lfo = context.createOscillator();
  lfo.type = 'sine';
  const lfoDepth = context.createGain();
  lfoDepth.gain.value = 0.22;
  lfo.connect(lfoDepth).connect(wobble.gain);
  lfo.start();

  body.connect(wobble).connect(output);

  // --- bearing hiss -------------------------------------------------------
  const hissBand = context.createBiquadFilter();
  hissBand.type = 'bandpass';
  hissBand.frequency.value = 2600;
  hissBand.Q.value = 0.8;
  const hissGain = context.createGain();
  hissGain.gain.value = (options.wear ?? 0.4) * 0.22;
  // Assigned below once the phase constants are in scope.
  const hiss: NoiseVoice = playNoise(context, noise.pink, hissBand);
  hissBand.connect(hissGain).connect(output);

  // --- the clank ----------------------------------------------------------
  const clankBus = context.createGain();
  clankBus.gain.value = clankAmount;
  clankBus.connect(output);

  let baseRpm = options.rpm ?? 52;
  let rpm = baseRpm;
  let active = true;
  // 0.15 rather than the clock's default: this is what the hand-rolled loop
  // used, and a clank is percussive enough that the window length is audible
  // as latency if it grows.
  const clankClock = createEventClock(context, 0.15);

  let phase: PhaseName = 'steady';
  let phaseRemaining = 12;
  const baseWear = (options.wear ?? 0.4) * 0.22;

  const scheduleClank = (at: number): void => {
    if (clankAmount <= 0) return;
    const source = context.createBufferSource();
    source.buffer = noise.white;

    // High Q so the burst rings at a pitch rather than just ticking: this is
    // a struck metal object, and struck metal has a note.
    const resonator = context.createBiquadFilter();
    resonator.type = 'bandpass';
    resonator.frequency.value = 190 + Math.random() * 90;
    resonator.Q.value = 14;

    const envelope = context.createGain();
    strike(envelope.gain, at, 0.9 + Math.random() * 0.3, 0.001, 0.15);

    source.connect(resonator).connect(envelope).connect(clankBus);
    source.start(at, Math.random() * 2, 0.4);
    source.stop(at + 0.45);
  };

  /**
   * Pushes the current speed into every layer that depends on it.
   *
   * Everything glides. A machine changing speed instantly is a machine that
   * has been edited, and the ear catches it at once — inertia is most of what
   * makes something read as heavy.
   */
  const applyRate = (glide = 0.9): void => {
    const now = context.currentTime;
    const settings = PHASES[phase];
    lfo.frequency.setTargetAtTime(rpm / 60, now, glide * 0.4);

    // Faster shafts whine higher, and the whole body brightens with them.
    const scale = Math.max(rpm, 4) / 52;
    HARMONICS.forEach((ratio, index) => {
      oscillators[index].frequency.setTargetAtTime(fundamental * ratio * scale, now, glide);
    });
    shaping.frequency.setTargetAtTime(420 + scale * 260, now, glide);

    // Load roughens it. Bearing hiss rises when it labours and falls when it
    // is freewheeling, which is what actually tells you it is under strain.
    hissGain.gain.setTargetAtTime(baseWear * settings.wear, now, glide);
    clankBus.gain.setTargetAtTime(clankAmount * settings.clank, now, glide);
  };

  const enterPhase = (next: PhaseName): void => {
    phase = next;
    const settings = PHASES[next];
    phaseRemaining = settings.min + Math.random() * (settings.max - settings.min);
    applyRate();
  };

  applyRate(0.01);

  return {
    output,

    get phase() {
      return phase;
    },

    get currentRpm() {
      return rpm;
    },

    setRpm(value) {
      baseRpm = value;
    },

    setActive(next) {
      active = next;
      if (next) clankClock.reset();
    },

    update(dt) {
      if (!active) return;

      // --- phase cycle ----------------------------------------------------
      phaseRemaining -= dt;
      if (phaseRemaining <= 0) {
        const options = PHASES[phase].next;
        enterPhase(options[Math.floor(Math.random() * options.length)]);
      }

      // Chase the phase's target speed rather than jumping to it, so spinning
      // up and dropping off both take time — a flywheel has mass.
      const target = baseRpm * PHASES[phase].speed;
      const inertia = Math.min(dt * 0.55, 1);
      if (Math.abs(target - rpm) > 0.05) {
        rpm += (target - rpm) * inertia;
        applyRate();
      }

      // --- the clank ------------------------------------------------------
      // One per revolution, with slight jitter — a perfectly periodic clank is
      // a metronome, and the ear latches onto metronomes and stops believing
      // them. `'oneGap'` because a clank is individually audible: resuming
      // immediately after a hitch would fire one the instant the machine comes
      // back, which reads as a glitch rather than as the shaft coming round.
      const period = 60 / Math.max(rpm, 3);
      clankClock.pump(scheduleClank, periodic(period, 0.06), 'oneGap');
    },

    dispose() {
      for (const osc of oscillators) osc.stop();
      lfo.stop();
      hiss.stop();
      output.disconnect();
    },
  };
}
