import type { AudioEngine } from '../../AudioEngine';
import { excite } from '../../dsp/impact';
import { human, type Instrument } from './voice';

/**
 * The struck family — one modal engine, nine instruments.
 *
 * A music box tooth, a kalimba tine, a tongue-drum tongue and a metal bar are
 * the same machine: a few sines with per-partial exponential decay over a
 * click. What tells them apart is the partial table, how fast the overtones
 * die against the fundamental, and what does the striking. The tables come
 * from the measured-partial literature: cantilever tines near 1 : 6, the
 * tongue drum's built 1 : 2 : 3, the uniform bar's 1 : 2.76 : 5.4, the
 * marimba's arch-tuned 1 : 3.92 : 9.24.
 *
 * Metal is constant-Q, so decay scales as 1/f — high notes ring shorter, and
 * that scaling is most of why a struck run sounds real.
 *
 * Junk metal is the same machine with the ratios deliberately unmusical: an
 * anvil's table is not a harmonic series and no two strikes of it agree, which
 * is what the per-partial jitter is for.
 */

interface StruckPartial {
  ratio: number;
  level: number;
  /** Fraction of the instrument's decay this partial rings. */
  decay: number;
  /** ± fraction of ratio drift per note — no two tines are milled alike. */
  jitter?: number;
}

interface StruckSpec {
  /** Longest decay in seconds at the reference pitch. */
  decay: number;
  /** The pitch that decay was stated at; 1/f scaling stands on it. */
  reference: number;
  partials: readonly StruckPartial[];
  /** Cents between the beating pair each partial is doubled into. 0 is single. */
  pair: number;
  /** The strike: a filtered noise burst into the same tone chain. */
  strike: {
    type: BiquadFilterType;
    hz: (freq: number) => number;
    q: number;
    level: (velocity: number) => number;
    duration: number;
    attack?: number;
  };
  /** Sounding transposition in octaves — a music box lives above its written note. */
  octave?: number;
  body?: readonly { type: BiquadFilterType; hz: number; q: number; gain?: number }[];
  /** Ceiling over everything. */
  tone: number;
  /** The vibraphone's motor: one slow tremolo over the whole output. */
  tremolo?: { rate: number; depth: number };
}

export interface StruckOptions {
  gain?: number;
  decay?: number;
}

function createStruck(engine: AudioEngine, spec: StruckSpec, options: StruckOptions = {}): Instrument {
  const context = engine.context;
  const noise = engine.noise;
  if (!noise) throw new Error('struck built before the noise buffers were ready');

  const decay = options.decay ?? spec.decay;

  const output = context.createGain();
  const level = options.gain ?? 0.5;
  output.gain.value = level;

  // The motor: one LFO on the output gain, shared by every note, because a
  // vibraphone's fans turn whether or not a bar is ringing.
  let motor: OscillatorNode | undefined;
  let motorDepth: GainNode | undefined;
  if (spec.tremolo) {
    motor = context.createOscillator();
    motor.type = 'sine';
    motor.frequency.value = spec.tremolo.rate;
    motorDepth = context.createGain();
    motorDepth.gain.value = level * spec.tremolo.depth;
    motor.connect(motorDepth).connect(output.gain);
    motor.start();
  }

  const tone = context.createBiquadFilter();
  tone.type = 'lowpass';
  tone.frequency.value = spec.tone;
  tone.Q.value = 0.5;

  // The body chain sits between the rings and the ceiling.
  let entry: AudioNode = tone;
  const bodies: BiquadFilterNode[] = [];
  for (const shape of spec.body ?? []) {
    const filter = context.createBiquadFilter();
    filter.type = shape.type;
    filter.frequency.value = shape.hz;
    filter.Q.value = shape.q;
    if (shape.gain !== undefined) filter.gain.value = shape.gain;
    filter.connect(entry);
    entry = filter;
    bodies.push(filter);
  }
  tone.connect(output);

  const strike = context.createBiquadFilter();
  strike.type = spec.strike.type;
  strike.frequency.value = spec.strike.hz(440);
  strike.Q.value = spec.strike.q;
  strike.connect(entry);

  const ring = (at: number, hz: number, seconds: number, level: number, cents = 0): void => {
    const osc = context.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = hz;
    osc.detune.value = cents;

    const envelope = context.createGain();
    envelope.gain.setValueAtTime(level, at);
    envelope.gain.exponentialRampToValueAtTime(level * 0.0005, at + seconds);

    osc.connect(envelope).connect(entry);
    osc.start(at);
    osc.stop(at + seconds + 0.02);
  };

  return {
    output,

    noteOn(at, freq, velocity) {
      const n = human(context, at, freq, velocity);
      const fund = n.freq * 2 ** (spec.octave ?? 0);
      const top = context.sampleRate * 0.45;
      // Constant-Q metal: an octave up rings half as long.
      const stretch = Math.min(Math.max(spec.reference / fund, 0.45), 1.7);

      strike.frequency.setValueAtTime(spec.strike.hz(fund), n.at);
      excite(
        context,
        noise.white,
        strike,
        n.at,
        spec.strike.level(n.velocity),
        spec.strike.duration,
        spec.strike.attack,
      );

      for (const partial of spec.partials) {
        const drift = partial.jitter ? 1 + (Math.random() * 2 - 1) * partial.jitter : 1;
        const f = fund * partial.ratio * drift;
        if (f > top) continue;
        // Overtones scale with velocity — a soft touch is nearly pure.
        const tilt = partial.ratio <= 1.5 ? 1 : Math.min(1, 0.45 + n.velocity * 0.7);
        const level = n.velocity * partial.level * tilt * 0.15 * (0.9 + Math.random() * 0.2);
        const seconds = decay * partial.decay * stretch * (0.9 + Math.random() * 0.2);
        if (spec.pair > 0) {
          ring(n.at, f, seconds, level * 0.6, -spec.pair / 2);
          ring(n.at, f, seconds, level * 0.6, spec.pair / 2);
        } else {
          ring(n.at, f, seconds, level);
        }
      }
    },

    dispose() {
      if (motor) {
        motor.stop();
        motor.disconnect();
      }
      motorDepth?.disconnect();
      strike.disconnect();
      for (const filter of bodies) filter.disconnect();
      tone.disconnect();
      output.disconnect();
    },
  };
}

/** Near-pure teeth an octave up, one drifting overtone, the pin's click. */
const MUSIC_BOX: StruckSpec = {
  decay: 2.2,
  reference: 660,
  partials: [
    { ratio: 1, level: 1, decay: 1 },
    { ratio: 6.5, level: 0.13, decay: 0.05, jitter: 0.15 },
  ],
  pair: 0,
  strike: { type: 'highpass', hz: () => 4000, q: 0.7, level: (v) => v * 0.25, duration: 0.003 },
  octave: 1,
  body: [{ type: 'peaking', hz: 1500, q: 1, gain: 2 }],
  tone: 9000,
};

/** The tine: overtones near 1 : 6 : 14, dead in a blink, thumb click, small box. */
const KALIMBA: StruckSpec = {
  decay: 3,
  reference: 262,
  partials: [
    { ratio: 1, level: 1, decay: 1 },
    { ratio: 5.7, level: 0.18, decay: 0.07, jitter: 0.12 },
    { ratio: 14.2, level: 0.05, decay: 0.03, jitter: 0.1 },
  ],
  pair: 0,
  strike: { type: 'bandpass', hz: () => 3200, q: 1, level: (v) => v * v * 0.4, duration: 0.004 },
  body: [{ type: 'peaking', hz: 200, q: 1.2, gain: 3 }],
  tone: 6000,
};

/** Tuned 1 : 2 : 3 by construction, every partial a beating pair, soft hands. */
const TONGUE_DRUM: StruckSpec = {
  decay: 6,
  reference: 220,
  partials: [
    { ratio: 1, level: 1, decay: 1 },
    { ratio: 2, level: 0.45, decay: 0.65 },
    { ratio: 3, level: 0.22, decay: 0.4 },
  ],
  pair: 5,
  strike: {
    type: 'lowpass',
    hz: () => 900,
    q: 0.5,
    level: (v) => v * 0.3,
    duration: 0.012,
    attack: 0.004,
  },
  body: [{ type: 'peaking', hz: 85, q: 2, gain: 4 }],
  tone: 3800,
};

/** Arch-tuned bar over its resonator: loud short fundamental, woody thump. */
const MARIMBA: StruckSpec = {
  decay: 1.4,
  reference: 220,
  partials: [
    { ratio: 1, level: 1, decay: 1 },
    { ratio: 3.92, level: 0.3, decay: 0.22 },
    { ratio: 9.24, level: 0.12, decay: 0.08 },
  ],
  pair: 0,
  strike: {
    type: 'lowpass',
    hz: () => 800,
    q: 0.5,
    level: (v) => v * 0.35,
    duration: 0.008,
    attack: 0.002,
  },
  body: [{ type: 'peaking', hz: 250, q: 1, gain: 2 }],
  tone: 4500,
};

/** The uniform bar an octave up — colder than the bells on purpose. */
const CHIMES: StruckSpec = {
  decay: 3,
  reference: 880,
  partials: [
    { ratio: 1, level: 1, decay: 1 },
    { ratio: 2.76, level: 0.25, decay: 0.12 },
    { ratio: 5.4, level: 0.1, decay: 0.05 },
  ],
  pair: 0,
  strike: { type: 'highpass', hz: () => 5000, q: 0.7, level: (v) => v * v * 0.3, duration: 0.002 },
  octave: 1,
  tone: 10000,
};

/** Junk steel: no series anywhere near it, and never twice the same. */
const ANVIL: StruckSpec = {
  decay: 1.6,
  reference: 440,
  partials: [
    { ratio: 1, level: 0.8, decay: 1 },
    { ratio: 2.4, level: 0.55, decay: 0.5, jitter: 0.25 },
    { ratio: 3.6, level: 0.4, decay: 0.3, jitter: 0.3 },
    { ratio: 5.4, level: 0.25, decay: 0.18, jitter: 0.35 },
    { ratio: 7.2, level: 0.15, decay: 0.1, jitter: 0.4 },
  ],
  pair: 9,
  strike: { type: 'highpass', hz: () => 2500, q: 0.7, level: (v) => v * 0.45, duration: 0.004 },
  tone: 11000,
};

/** A tongue drum left outside for a decade: dull head, damped top, thump. */
const OIL_DRUM: StruckSpec = {
  decay: 3.2,
  reference: 160,
  partials: [
    { ratio: 1, level: 1, decay: 1 },
    { ratio: 2.1, level: 0.35, decay: 0.45, jitter: 0.04 },
    { ratio: 3.3, level: 0.16, decay: 0.22, jitter: 0.06 },
  ],
  pair: 11,
  strike: {
    type: 'lowpass',
    hz: () => 520,
    q: 0.6,
    level: (v) => v * 0.4,
    duration: 0.02,
    attack: 0.005,
  },
  body: [{ type: 'peaking', hz: 70, q: 1.6, gain: 5 }],
  tone: 2200,
};

/** A great skin an octave down: membrane modes, soft hands, a long boom. */
const DEEP_DRUM: StruckSpec = {
  decay: 5,
  reference: 70,
  partials: [
    { ratio: 1, level: 1, decay: 1 },
    // The circular membrane's series — nowhere near harmonic by nature.
    { ratio: 1.59, level: 0.45, decay: 0.5, jitter: 0.02 },
    { ratio: 2.14, level: 0.25, decay: 0.28, jitter: 0.03 },
    { ratio: 2.65, level: 0.12, decay: 0.16, jitter: 0.04 },
  ],
  pair: 0,
  strike: {
    type: 'lowpass',
    hz: () => 350,
    q: 0.5,
    level: (v) => v * 0.35,
    duration: 0.025,
    attack: 0.008,
  },
  octave: -1,
  body: [{ type: 'peaking', hz: 60, q: 1.4, gain: 5 }],
  tone: 1600,
};

/** The long bar under its fans — cold metal that will not stop ringing. */
const VIBRAPHONE: StruckSpec = {
  decay: 8,
  reference: 440,
  partials: [
    { ratio: 1, level: 1, decay: 1 },
    { ratio: 3.9, level: 0.22, decay: 0.3 },
    { ratio: 9.6, level: 0.07, decay: 0.1 },
  ],
  pair: 0,
  strike: {
    type: 'lowpass',
    hz: () => 1400,
    q: 0.5,
    level: (v) => v * 0.2,
    duration: 0.01,
    attack: 0.003,
  },
  body: [{ type: 'peaking', hz: 300, q: 1, gain: 2 }],
  tone: 6000,
  tremolo: { rate: 4.2, depth: 0.35 },
};

export const createMusicBox = (engine: AudioEngine, options: StruckOptions = {}): Instrument =>
  createStruck(engine, MUSIC_BOX, options);
export const createKalimba = (engine: AudioEngine, options: StruckOptions = {}): Instrument =>
  createStruck(engine, KALIMBA, options);
export const createTongueDrum = (engine: AudioEngine, options: StruckOptions = {}): Instrument =>
  createStruck(engine, TONGUE_DRUM, options);
export const createMarimba = (engine: AudioEngine, options: StruckOptions = {}): Instrument =>
  createStruck(engine, MARIMBA, options);
export const createChimes = (engine: AudioEngine, options: StruckOptions = {}): Instrument =>
  createStruck(engine, CHIMES, options);
export const createAnvil = (engine: AudioEngine, options: StruckOptions = {}): Instrument =>
  createStruck(engine, ANVIL, options);
export const createOilDrum = (engine: AudioEngine, options: StruckOptions = {}): Instrument =>
  createStruck(engine, OIL_DRUM, options);
export const createVibraphone = (engine: AudioEngine, options: StruckOptions = {}): Instrument =>
  createStruck(engine, VIBRAPHONE, options);
export const createDeepDrum = (engine: AudioEngine, options: StruckOptions = {}): Instrument =>
  createStruck(engine, DEEP_DRUM, options);
