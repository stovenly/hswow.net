import type { AudioEngine } from '../AudioEngine';
import type { SoundModel } from '../Emitter';
import { playNoise, type NoiseVoice } from '../noise';
import { createEventClock, poissonGap } from '../dsp/clock';
import { createGrainBed } from '../dsp/grain';
import { thump } from '../dsp/impact';

/**
 * Fire, as three sounds at very different timescales, mixed roughly
 * 0.6 / 0.3 / 0.2:
 *
 * - **Lapping** — a low roar, bulk convection. Most of the level, none of the
 *   identity.
 * - **Hissing** — broadband breath, steam and volatiles leaving the fuel. The
 *   sense of heat.
 * - **Crackles** — sharp resonant transients as fuel cells burst. All of the
 *   identity, almost none of the level.
 *
 * Crackles are the one place a high crest factor is correct. Everywhere else
 * in this library an individually audible event ruins a texture; a fire whose
 * crackles have been smoothed into the bed is a gas burner. What keeps it from
 * sounding like a sound effect is their distribution — Poisson gaps, a wide
 * level range, and a few much larger "spits" with a low thump underneath.
 *
 * The roar breathes at 5-15 Hz, which is above what the frame loop resolves
 * and must not stop when the frame loop hitches, so the flicker is an
 * audio-rate signal summed into the lapping gain. It is a dedicated buffer
 * normalised to exactly ±1, which makes `flicker.gain` the depth in units;
 * noise through a lowpass would leave the filter's insertion loss in it.
 */

/**
 * Sample rate of the flicker buffer. 8 kHz, not the ~50 Hz the signal needs:
 * `createBuffer` is only required to accept 8000-96000 and browsers do reject
 * less. The resampler handles the rest.
 */
const FLICKER_RATE = 8000;
const FLICKER_SECONDS = 12;
/** Corner of the smoothing, in Hz. The pace of the breathing. */
const FLICKER_HZ = 7;

/**
 * Where crackles resonate. Bursting fuel cells are small cavities, so the
 * bands are high and narrow — the lowest is the tock of a log, the highest the
 * fizz. Weighted toward the middle; the extremes are seasoning.
 */
const CRACKLE_CHANNELS = [
  { hz: 1500, q: 6, weight: 0.34 },
  { hz: 2800, q: 7, weight: 0.42 },
  { hz: 5200, q: 8, weight: 0.24 },
];

/** Farnell's balance. */
const LAP_MIX = 0.6;
const HISS_MIX = 0.3;
const CRACKLE_MIX = 0.2;

const flickerBuffers = new WeakMap<BaseAudioContext, AudioBuffer>();

/**
 * A smooth random walk in [-1, 1], built once per context and shared: it is
 * the filtering and the start offset that give a voice its character. Two
 * fires decorrelate through `playNoise`'s random offset and rate detune.
 */
function flickerBuffer(context: BaseAudioContext): AudioBuffer {
  const cached = flickerBuffers.get(context);
  if (cached) return cached;

  const length = Math.floor(FLICKER_RATE * FLICKER_SECONDS);
  const buffer = context.createBuffer(1, length, FLICKER_RATE);
  const data = buffer.getChannelData(0);

  // One-pole lowpass over white noise. Cheap, and its impulse response has no
  // ringing, so the walk wanders rather than oscillating at a corner frequency.
  const a = Math.exp((-2 * Math.PI * FLICKER_HZ) / FLICKER_RATE);
  let value = 0;
  for (let i = 0; i < length; i++) {
    value = a * value + (1 - a) * (Math.random() * 2 - 1);
    data[i] = value;
  }

  // Cross-fade the tail into the head. A step in a modulator is a step in a
  // gain, which is a click — and it would land every twelve seconds, exactly
  // often enough to be noticed and not often enough to be diagnosed.
  const fade = Math.min(1024, (length / 4) | 0);
  for (let i = 0; i < fade; i++) {
    const t = i / fade;
    data[i] = data[i] * t + data[length - fade + i] * (1 - t);
  }

  let peak = 0;
  for (let i = 0; i < length; i++) peak = Math.max(peak, Math.abs(data[i]));
  if (peak > 0) for (let i = 0; i < length; i++) data[i] /= peak;

  flickerBuffers.set(context, buffer);
  return buffer;
}

export interface FireOptions {
  gain?: number;
  /**
   * How hard it is burning, 0..1. Moves level, brightness and crackle rate
   * together — see `setIntensity`.
   */
  intensity?: number;
  /**
   * Shifts every band. Below 1 is bigger: a bonfire is a lower, slower sound
   * than a candle, and both are the same three layers.
   */
  tone?: number;
  /** Scales the crackle layer alone. Damp wood crackles; charcoal does not. */
  crackle?: number;
  /** How much a gust fans it, 0..1. Sheltered hearths want this near zero. */
  draught?: number;
}

export interface FireModel extends SoundModel {
  /**
   * How hard it is burning, 0..1. Not a volume knob — it raises the roar,
   * brightens the hiss, and raises the crackle rate with the *square* of
   * intensity, so a fire being fed changes its spectrum and not just its level.
   */
  setIntensity(value: number): void;
}

export function createFire(engine: AudioEngine, options: FireOptions = {}): FireModel {
  const context = engine.context;
  const noise = engine.noise;
  if (!noise) throw new Error('fire model built before the noise buffers were ready');

  const tone = options.tone ?? 1;
  const crackle = options.crackle ?? 1;
  const draught = options.draught ?? 0.35;

  const output = context.createGain();
  output.gain.value = options.gain ?? 0.5;

  // --- Lapping ---------------------------------------------------------
  // Brown noise, because the roar is weight rather than detail, through a
  // broad low band. An octave or two above Farnell's 30 Hz, which is below the
  // useful range of a laptop speaker. What makes it *lap* is the modulation
  // below, not the width of the band.
  const lapFilter = context.createBiquadFilter();
  lapFilter.type = 'bandpass';
  lapFilter.frequency.value = 110 * tone;
  lapFilter.Q.value = 0.9;
  const lapGain = context.createGain();
  lapGain.gain.value = 0;
  const lap: NoiseVoice = playNoise(context, noise.brown, lapFilter);
  lapFilter.connect(lapGain).connect(output);

  // The breathing, summed into the lapping gain. A `GainNode`'s param takes the
  // sum of its automation value and everything connected to it, so `flicker`
  // is a depth in the same units as the base level.
  const flicker = context.createGain();
  flicker.gain.value = 0;
  const flickerVoice: NoiseVoice = playNoise(context, flickerBuffer(context), flicker, 0.12);
  flicker.connect(lapGain.gain);

  // --- Hissing ---------------------------------------------------------
  const hissFilter = context.createBiquadFilter();
  hissFilter.type = 'highpass';
  hissFilter.frequency.value = 800 * tone;
  hissFilter.Q.value = 0.6;
  // The same shelf the wind model carries, for the same reason: 2–5 kHz is
  // where the ear is most sensitive and where synthesised noise becomes
  // fatiguing. A fire is heard for minutes at a time.
  const soften = context.createBiquadFilter();
  soften.type = 'highshelf';
  soften.frequency.value = 4200;
  soften.gain.value = -7;
  const hissGain = context.createGain();
  hissGain.gain.value = 0;
  const hiss: NoiseVoice = playNoise(context, noise.white, hissFilter);
  hissFilter.connect(soften).connect(hissGain).connect(output);

  // --- Crackles --------------------------------------------------------
  const crackleBus = context.createGain();
  crackleBus.gain.value = CRACKLE_MIX * crackle;
  crackleBus.connect(output);
  const crackles = createGrainBed(context, noise.white, CRACKLE_CHANNELS, crackleBus, tone);

  let intensity = options.intensity ?? 0.7;
  let active = true;
  const clock = createEventClock(context);
  const crackleGap = poissonGap();

  const fireCrackle = (at: number): void => {
    // Most crackles are near the threshold of hearing. The few that are not
    // are what the ear actually counts, and spacing *those* by a Poisson
    // process at a low rate is what stops a fire sounding like a loop.
    const spit = Math.random() < 0.09;
    const level = spit ? 0.45 + Math.random() * 0.5 : 0.06 + Math.random() * 0.26;
    // Excitation length is contact hardness — see `dsp/impact.ts`. A cell
    // bursting is about as hard a contact as exists, hence the very short
    // bursts; spits are a larger, softer failure and get longer ones.
    const duration = spit ? 0.006 + Math.random() * 0.014 : 0.0015 + Math.random() * 0.005;

    crackles.strike(at, level, duration);

    // A spit displaces enough gas to be felt as well as heard. Straight into
    // the bus, bypassing the crackle bands, which are far too high to pass it.
    if (spit) {
      thump(context, crackleBus, at, 0.16, 95 * tone, 42 * tone, 0.085, 0.004);
    }
  };

  return {
    output,

    setIntensity(value) {
      intensity = Math.min(1, Math.max(0, value));
    },

    setActive(next) {
      active = next;
      if (next) clock.reset();
      if (!next) {
        lapGain.gain.value = 0;
        flicker.gain.value = 0;
        hissGain.gain.value = 0;
      }
    },

    update(_dt, audio, at) {
      if (!active) return;

      const now = context.currentTime;
      // A gust fans a fire and then it settles. Capped above 1 so an exposed
      // brazier in a storm genuinely flares rather than merely getting louder.
      const heat = Math.min(1.35, intensity * (1 + audio.weather.strengthAt(at.x, at.z) * draught));

      // Never quite off: embers still move air. The floor is what keeps a
      // banked hearth from vanishing entirely when intensity is turned down.
      const roar = LAP_MIX * (0.3 + heat * 0.7);
      lapGain.gain.setTargetAtTime(roar * 0.72, now, 0.4);
      flicker.gain.setTargetAtTime(roar * 0.62, now, 0.4);
      // The roar rises in pitch as well as level — more gas, moving faster.
      lapFilter.frequency.setTargetAtTime((85 + heat * 60) * tone, now, 0.4);

      hissGain.gain.setTargetAtTime(HISS_MIX * (0.15 + heat * 0.85), now, 0.3);
      // The brightness half of the centroid shift. A cool fire is a dull
      // breath; a hot one is a rush of steam.
      hissFilter.frequency.setTargetAtTime((650 + heat * 900) * tone, now, 0.3);

      // Square law: feeding a fire does not double the crackles, it multiplies
      // them. Same reasoning as foliage's gust response.
      crackleGap.rate = Math.max(0.6, 22 * heat * heat);
      clock.pump(fireCrackle, crackleGap);
    },

    dispose() {
      lap.stop();
      hiss.stop();
      flickerVoice.stop();
      flicker.disconnect();
      crackles.dispose();
      crackleBus.disconnect();
      lapGain.disconnect();
      hissGain.disconnect();
      output.disconnect();
    },
  };
}
