import type { AudioEngine } from '../AudioEngine';
import type { SoundModel } from '../Emitter';
import { playNoise } from '../noise';
import { createEventClock, poissonGap, type EventClock } from '../dsp/clock';
import { excite } from '../dsp/impact';

/**
 * A transformer, a switchgear yard, a failing tube.
 *
 * The hum is at **twice the line frequency**, not at it. Magnetostriction pulls
 * the core in as the flux peaks and it peaks twice a cycle, once each way — so
 * fifty hertz of supply gives a hundred hertz of noise, and the harmonics over
 * it are mostly even. Getting that wrong is the difference between a substation
 * and a ground loop.
 *
 * Over the hum sits **corona**: the air ionising at the sharp edges, as a
 * broadband hiss with crackles in it. It gets louder in the wet, which makes
 * rain a physically correct control rather than a gesture at a mixer.
 *
 * A failing fluorescent tube is the same object with the hum gated by a
 * stutter, which is why it lives here too.
 */

export interface ElectricOptions {
  gain?: number;
  /** Supply frequency in Hz. The hum sounds an octave above it. */
  mains?: number;
  /** Weight of the harmonic stack over the fundamental, 0..1. */
  harmonics?: number;
  /** Corona level, 0..1, before the damp is taken into account. */
  corona?: number;
  /** Shifts the whole thing. Above 1 is a smaller unit with less iron in it. */
  tone?: number;
  /**
   * Flickers the hum on and off at irregular intervals, 0..1. Zero is healthy
   * gear; anything above about 0.3 is a tube on its way out.
   */
  fault?: number;
}

export interface ElectricModel extends SoundModel {
  /** How damp the air is, 0..1. Corona rises with it. */
  setDamp(value: number): void;
  /** Load, 0..1. Moves the harmonics rather than only the level. */
  setLoad(value: number): void;
}

/**
 * Even harmonics carry the hum, because the effect is symmetric in the flux —
 * the core does not care which way the field points. The odd ones are what the
 * iron's own nonlinearity adds, so they are there and they are quieter.
 */
const PARTIALS = [
  { ratio: 1, level: 1 },
  { ratio: 2, level: 0.55 },
  { ratio: 3, level: 0.14 },
  { ratio: 4, level: 0.3 },
  { ratio: 6, level: 0.16 },
  { ratio: 8, level: 0.08 },
];

export function createElectric(engine: AudioEngine, options: ElectricOptions = {}): ElectricModel {
  const context = engine.context;
  const noise = engine.noise;
  if (!noise) throw new Error('electric built before the noise buffers were ready');

  const mains = options.mains ?? 50;
  const tone = options.tone ?? 1;
  const fault = options.fault ?? 0;
  const harmonics = options.harmonics ?? 0.6;

  const output = context.createGain();
  output.gain.value = options.gain ?? 0.18;

  // The gate everything humming passes through, so a failing tube stutters as
  // one object rather than as six oscillators going out of step.
  const gate = context.createGain();
  gate.gain.value = 1;
  gate.connect(output);

  const oscillators = PARTIALS.map((partial, i) => {
    const osc = context.createOscillator();
    osc.type = 'sine';
    // Twice the line frequency. This is the whole point of the file.
    osc.frequency.value = mains * 2 * partial.ratio * tone;
    // A few cents apart, so the stack beats slowly instead of standing still.
    osc.detune.value = (i - 2) * 1.6;
    const level = context.createGain();
    level.gain.value = partial.level * (i === 0 ? 1 : harmonics);
    osc.connect(level).connect(gate);
    osc.start();
    return { osc, level, partial };
  });

  // Corona: broadband, and it lives right at the top.
  const air = context.createBiquadFilter();
  air.type = 'highpass';
  air.frequency.value = 4200;
  air.Q.value = 0.7;
  air.connect(output);
  const coronaLevel = context.createGain();
  coronaLevel.gain.value = 0;
  coronaLevel.connect(air);
  const hiss = playNoise(context, noise.white, coronaLevel);

  // The crackles in it. Individually almost inaudible; together they are the
  // difference between a yard that is live and a yard that is a drone.
  const crackle = context.createBiquadFilter();
  crackle.type = 'bandpass';
  crackle.frequency.value = 6500;
  crackle.Q.value = 1.2;
  crackle.connect(output);

  const clock: EventClock = createEventClock(context);
  const gap = poissonGap(4);
  const faultClock: EventClock = createEventClock(context);
  const faultGap = poissonGap(0.6);

  const base = options.corona ?? 0.35;
  let damp = 0;
  let load = 0.6;
  let active = true;

  const apply = (): void => {
    const now = context.currentTime;
    // Damp air ionises more readily, so the crackle rate and the hiss both
    // climb when it rains.
    const wet = base * (0.55 + damp * 1.5);
    coronaLevel.gain.setTargetAtTime(wet * 0.09, now, 0.5);
    gap.rate = 3 + damp * 26;
    for (const voice of oscillators) {
      // Load moves the spectrum, not only the level: a transformer under load
      // is harsher, not merely louder.
      const weight = voice.partial.ratio === 1 ? 1 : harmonics * (0.5 + load * 0.9);
      voice.level.gain.setTargetAtTime(voice.partial.level * weight, now, 0.8);
    }
  };

  apply();

  return {
    output,

    setDamp(value) {
      damp = Math.min(1, Math.max(0, value));
      apply();
    },

    setLoad(value) {
      load = Math.min(1, Math.max(0, value));
      apply();
    },

    setActive(next) {
      active = next;
      if (next) {
        clock.reset();
        faultClock.reset();
      }
    },

    update() {
      if (!active) return;
      clock.pump((at) => {
        excite(context, noise.white, crackle, at, 0.02 + Math.random() * 0.05 * (0.4 + damp), 0.004);
      }, gap, 'immediate');

      if (fault <= 0.01) return;
      faultClock.pump((at) => {
        // Off for a few tens of milliseconds, back on with a bounce. Nothing
        // regular about it, which is what reads as a fault rather than a tremolo.
        const out = 0.02 + Math.random() * 0.09 * fault;
        gate.gain.setValueAtTime(1, at);
        gate.gain.setValueAtTime(0.06, at + 0.002);
        gate.gain.setValueAtTime(0.06, at + out);
        gate.gain.linearRampToValueAtTime(1, at + out + 0.012);
      }, faultGap, 'immediate');
    },

    dispose() {
      for (const voice of oscillators) {
        voice.osc.stop();
        voice.osc.disconnect();
        voice.level.disconnect();
      }
      oscillators.length = 0;
      hiss.stop();
      coronaLevel.disconnect();
      air.disconnect();
      crackle.disconnect();
      gate.disconnect();
      output.disconnect();
    },
  };
}
