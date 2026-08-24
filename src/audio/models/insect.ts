import type { AudioEngine } from '../AudioEngine';
import type { SoundModel } from '../Emitter';
import { playNoise, type NoiseVoice } from '../noise';
import { createEventClock, periodicGap, type EventClock, type Rated } from '../dsp/clock';

/**
 * Stridulation: a file drawn across a scraper, driving a resonant membrane.
 * A cricket, a grasshopper, a katydid and a cicada are one system at different
 * rates — a train of pulses through a sharp resonance — and the differences
 * between them are how fast the train runs, how many pulses are in a chirp, and
 * how much of the source is tone rather than rasp.
 *
 * **The rate is the temperature.** Dolbear's law, published in 1897 and still
 * accurate: a snowy tree cricket's chirps per minute rise about 4.7 per degree
 * Fahrenheit. Below roughly 10 °C they stop altogether. So a cold night is
 * quiet for a reason the player can feel without ever being told it, and the
 * whole layer costs nothing for half the year.
 *
 * The carriers run continuously and are gated per pulse rather than built per
 * event, so the node count does not move with the rate. At three hundred pulses
 * a minute that is the difference between a field of crickets and a leak.
 */

export type Stridulator = 'cricket' | 'grasshopper' | 'katydid' | 'cicada';

interface Kind {
  /** The membrane's resonance, Hz, and how sharply it insists. */
  hz: number;
  q: number;
  /** Pulses per chirp, and how long one pulse lasts in seconds. */
  pulses: readonly [number, number];
  pulse: number;
  /** Seconds between pulses inside a chirp. */
  step: number;
  /**
   * Dolbear's constants for this kind: chirps per minute is
   * `intercept + (T_F - base) * slope`.
   */
  base: number;
  intercept: number;
  slope: number;
  /** Noise against tone in the source, 0..1. A cricket is nearly pure. */
  rasp: number;
  /** Degrees C below which it does not sound at all. */
  floor: number;
}

const KINDS: Record<Stridulator, Kind> = {
  // Nearly a pure tone, in short chirps. The one everybody can hum.
  cricket: {
    hz: 4600,
    q: 24,
    pulses: [3, 5],
    pulse: 0.022,
    step: 0.026,
    base: 50,
    intercept: 92,
    slope: 4.7,
    rasp: 0.08,
    floor: 10,
  },
  // Femur on wing: dry, broad, and barely pitched at all.
  grasshopper: {
    hz: 5400,
    q: 2.2,
    pulses: [10, 22],
    pulse: 0.014,
    step: 0.019,
    base: 50,
    intercept: 70,
    slope: 4,
    rasp: 0.92,
    floor: 14,
  },
  // Coarser and slower, and its own constants.
  katydid: {
    hz: 3800,
    q: 4.5,
    pulses: [2, 4],
    pulse: 0.05,
    step: 0.07,
    base: 60,
    intercept: 19,
    slope: 3,
    rasp: 0.7,
    floor: 13,
  },
  // A tymbal buckling a few hundred times a second, through the whole abdomen.
  cicada: {
    hz: 2900,
    q: 6,
    pulses: [40, 90],
    pulse: 0.004,
    step: 0.0055,
    base: 50,
    intercept: 40,
    slope: 2.4,
    rasp: 0.5,
    floor: 18,
  },
};

export interface InsectOptions {
  kind?: Stridulator;
  gain?: number;
  /** How many are singing. Three is a hedge, six is a meadow. */
  voices?: number;
  /** Shifts every carrier. Below 1 is a larger insect. */
  tone?: number;
  /** Degrees C. Live — see `setWarmth`. */
  warmth?: number;
}

export interface InsectModel extends SoundModel {
  /**
   * The temperature, in degrees C. Drives the chirp rate through Dolbear and
   * silences the whole model below the kind's floor.
   */
  setWarmth(celsius: number): void;
}

interface Singer {
  gate: GainNode;
  clock: EventClock;
  gap: Rated;
  noise: NoiseVoice;
  raspGain: GainNode;
  osc: OscillatorNode;
}

export function createInsect(engine: AudioEngine, options: InsectOptions = {}): InsectModel {
  const context = engine.context;
  const noise = engine.noise;
  if (!noise) throw new Error('insect built before the noise buffers were ready');

  const kind = KINDS[options.kind ?? 'cricket'];
  const tone = options.tone ?? 1;
  const count = Math.max(1, options.voices ?? 3);

  const output = context.createGain();
  output.gain.value = options.gain ?? 0.12;

  const singers: Singer[] = [];
  for (let i = 0; i < count; i++) {
    // Each one its own size, so a field is not one insect played three times.
    const spread = 1 + (Math.random() * 2 - 1) * 0.06;
    const body = context.createBiquadFilter();
    body.type = 'bandpass';
    body.frequency.value = kind.hz * tone * spread;
    body.Q.value = kind.q;
    body.connect(output);

    const gate = context.createGain();
    gate.gain.value = 0;
    gate.connect(body);

    const osc = context.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = kind.hz * tone * spread;
    const oscGain = context.createGain();
    oscGain.gain.value = 1 - kind.rasp;
    osc.connect(oscGain).connect(gate);
    osc.start();

    const raspGain = context.createGain();
    raspGain.gain.value = kind.rasp;
    raspGain.connect(gate);
    const hiss = playNoise(context, noise.white, raspGain);

    singers.push({
      gate,
      clock: createEventClock(context),
      // Periodic: stridulation is a muscle running at a rate, not a decision.
      gap: periodicGap(1, 0.05),
      noise: hiss,
      raspGain,
      osc,
    });
  }

  let warmth = options.warmth ?? 15;
  let active = true;

  /** Chirps per second, from Dolbear. Zero below the kind's floor. */
  const rate = (): number => {
    if (warmth < kind.floor) return 0;
    const fahrenheit = warmth * 1.8 + 32;
    const perMinute = kind.intercept + (fahrenheit - kind.base) * kind.slope;
    return Math.max(perMinute, 0) / 60;
  };

  const chirp = (singer: Singer, at: number): void => {
    const rolled =
      kind.pulses[0] + Math.floor(Math.random() * (kind.pulses[1] - kind.pulses[0] + 1));
    // One singer's pulses share a gate, so a chirp has to finish before the
    // next begins. `gap.rate` is seconds per chirp; the margin covers its jitter.
    const room = Math.floor((singer.gap.rate * 0.8) / kind.step);
    const pulses = Math.max(1, Math.min(rolled, room));
    let cursor = at;
    for (let i = 0; i < pulses; i++) {
      const edge = kind.pulse * 0.3;
      singer.gate.gain.setValueAtTime(0, cursor);
      singer.gate.gain.linearRampToValueAtTime(1, cursor + edge);
      singer.gate.gain.setValueAtTime(1, cursor + kind.pulse - edge);
      singer.gate.gain.linearRampToValueAtTime(0, cursor + kind.pulse);
      cursor += kind.step;
    }
  };

  return {
    output,

    setWarmth(celsius) {
      warmth = celsius;
    },

    setActive(next) {
      active = next;
      if (next) for (const singer of singers) singer.clock.reset();
    },

    update() {
      if (!active) return;
      const perSecond = rate();
      if (perSecond <= 0.001) return;
      for (const singer of singers) {
        // Each singer at its own rate around the shared one: a chorus that
        // agrees exactly is one insect through three speakers. `periodicGap`
        // counts seconds per event, so this is the reciprocal.
        singer.gap.rate = 1 / (perSecond * (0.85 + Math.random() * 0.3));
        singer.clock.pump((at) => chirp(singer, at), singer.gap, 'oneGap');
      }
    },

    dispose() {
      for (const singer of singers) {
        singer.osc.stop();
        singer.osc.disconnect();
        singer.noise.stop();
        singer.raspGain.disconnect();
        singer.gate.disconnect();
      }
      singers.length = 0;
      output.disconnect();
    },
  };
}
