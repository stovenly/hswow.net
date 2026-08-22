import type { AudioEngine } from '../AudioEngine';
import type { SoundModel } from '../Emitter';
import { playNoise, type NoiseVoice } from '../noise';
import { createEventClock, poissonGap, type EventClock } from '../dsp/clock';
import { excite } from '../dsp/impact';

/**
 * A settlement working, heard from inside it and **with nobody talking**.
 *
 * This is the layer a village was missing and a farm already had. The farm has
 * a crop and a windpump and a hive going the whole time, so its occasional
 * animal lands *on* something; a village had the air and then a bucket, and
 * between the buckets there was nothing at all. A place with no continuous
 * middle is a place that keeps starting and stopping.
 *
 * What a settlement actually makes, once the voices are taken out, is **a great
 * many small hard contacts too far off to resolve** — a door, a crate, a hoof,
 * a wheel on stone, a shutter, a tool set down two streets away — plus the low
 * roll of things being moved. None of it is identifiable. All of it says that
 * work is happening somewhere out of sight, and that is exactly the job.
 *
 * The rate is the whole control. Below about six contacts a second the ear
 * starts picking individual ones out and it becomes a list of noises; above
 * thirty it fuses into rain on a roof. Between those it is a village.
 */

export interface BustleOptions {
  gain?: number;
  /** Contacts a second at full activity. Six is a lane; twenty-five is a market. */
  rate?: number;
  /** How far off, as a lowpass in Hz. This is a *distant* texture or it is nothing. */
  distance?: number;
  /** The roll of things being moved: carts, barrows, feet on stone. 0..1. */
  roll?: number;
  /** How busy it is, 0..1. Live. */
  busy?: number;
}

export interface BustleModel extends SoundModel {
  /** How busy the place is, 0..1 — the hour of the day, essentially. */
  setBusy(value: number): void;
}

/**
 * What the contacts are made of. Three materials, because a settlement is wood
 * and pot and stone and nothing else — and deliberately broad, since anything
 * sharp here would be a *thing* rather than the sound of a place.
 */
const MATERIALS = [
  { hz: 340, q: 1.6, weight: 0.42 },
  { hz: 820, q: 2.1, weight: 0.36 },
  { hz: 1900, q: 1.8, weight: 0.22 },
];

export function createBustle(engine: AudioEngine, options: BustleOptions = {}): BustleModel {
  const context = engine.context;
  const noise = engine.noise;
  if (!noise) throw new Error('bustle built before the noise buffers were ready');

  const rate = options.rate ?? 12;
  const roll = options.roll ?? 0.5;

  const output = context.createGain();
  output.gain.value = options.gain ?? 0.12;

  // Distance, and it is not optional. Close up this is a bag of junk being
  // shaken; a long way off it is a town.
  const far = context.createBiquadFilter();
  far.type = 'lowpass';
  far.frequency.value = options.distance ?? 900;
  far.Q.value = 0.6;
  far.connect(output);

  const bands = MATERIALS.map((material) => {
    const band = context.createBiquadFilter();
    band.type = 'bandpass';
    band.frequency.value = material.hz;
    band.Q.value = material.q;
    const level = context.createGain();
    level.gain.value = material.weight;
    band.connect(level).connect(far);
    return band;
  });

  // The roll: wheels, barrows, feet. Low, continuous, and it wanders rather
  // than holding — a cart goes past and then does not.
  const rumble = context.createBiquadFilter();
  rumble.type = 'lowpass';
  rumble.frequency.value = 220;
  rumble.Q.value = 0.7;
  const rollGain = context.createGain();
  rollGain.gain.value = 0;
  rumble.connect(rollGain).connect(far);
  const voices: NoiseVoice[] = [playNoise(context, noise.brown, rumble)];

  const clock: EventClock = createEventClock(context);
  const gap = poissonGap(rate);

  let busy = options.busy ?? 0.6;
  let active = true;
  let drift = Math.random() * 1000;

  const contact = (at: number): void => {
    // Individually almost nothing, and that is the point: the moment one of
    // these can be picked out it has become an event rather than a place.
    const which = Math.floor(Math.random() * bands.length);
    const force = 0.02 + Math.random() * 0.07;
    const hardness = 0.001 + Math.random() * 0.006;
    excite(context, noise.white, bands[which], at, force, hardness, hardness * 0.4);
  };

  return {
    output,

    setBusy(value) {
      busy = Math.min(1, Math.max(0, value));
    },

    setActive(next) {
      active = next;
      if (next) clock.reset();
    },

    update(dt) {
      if (!active) return;
      drift += dt;
      // Two slow swells at unrelated rates. A settlement does not work at a
      // constant rate all day and an LFO reads as periodic inside a minute.
      const swell =
        0.62 + 0.38 * (Math.sin(drift * 0.037) * 0.6 + Math.sin(drift * 0.014 + 1.7) * 0.4);
      const live = busy * swell;
      gap.rate = Math.max(0.4, rate * live);
      rollGain.gain.setTargetAtTime(roll * live * 0.22, context.currentTime, 1.5);
      clock.pump(contact, gap, 'immediate');
    },

    dispose() {
      for (const voice of voices) voice.stop();
      voices.length = 0;
      for (const band of bands) band.disconnect();
      bands.length = 0;
      rumble.disconnect();
      rollGain.disconnect();
      far.disconnect();
      output.disconnect();
    },
  };
}
