import type { AudioEngine } from '../../AudioEngine';
import { PARTIALS } from '../../oneshots/bell';
import { excite } from '../../dsp/impact';
import { human, type Instrument } from './voice';

/**
 * Bells, melodic — the additive bell adapted to take a frequency.
 *
 * The synthesis and the partial table are `oneshots/bell.ts`'s, and the
 * reasoning lives there: near-pure sines, the flat tierce, the warble pair per
 * partial. What changes here is the framing. A rung bell is an *object* with
 * one pitch for life; this is an *instrument*, so the pitch arrives with the
 * note — and it arrives as the pitch you want to hear. A bell's perceived
 * note is the nominal, an octave above the prime, so `noteOn` places the
 * nominal on the asked-for frequency rather than handing the melody to a
 * partial nobody perceives as the pitch.
 *
 * Velocity goes into brightness the way a clapper does: a soft stroke wakes
 * the hum and prime, a hard one wakes everything.
 */

export interface BellsOptions {
  gain?: number;
  /** Longest partial's decay, in seconds. Melodic bells sit well under a tower's 15–25. */
  decay?: number;
}

export function createBells(engine: AudioEngine, options: BellsOptions = {}): Instrument {
  const context = engine.context;
  const noise = engine.noise;
  if (!noise) throw new Error('bells built before the noise buffers were ready');

  const decay = options.decay ?? 6;

  const output = context.createGain();
  output.gain.value = options.gain ?? 0.5;

  // A melodic bell is a chime, not a tower: everything rides a ceiling that
  // keeps the top of the strike out of the foreground.
  const tone = context.createBiquadFilter();
  tone.type = 'lowpass';
  tone.frequency.value = 5000;
  tone.Q.value = 0.5;
  tone.connect(output);

  // The clapper, shared and retuned per note. It is a few milliseconds of
  // bright transient; by the next note the last one is long gone.
  const clapper = context.createBiquadFilter();
  clapper.type = 'bandpass';
  clapper.frequency.value = 2000;
  clapper.Q.value = 1.6;
  clapper.connect(tone);

  const ring = (at: number, hz: number, seconds: number, level: number, cents: number): void => {
    const osc = context.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = hz;
    osc.detune.value = cents;

    const envelope = context.createGain();
    envelope.gain.setValueAtTime(level, at);
    envelope.gain.exponentialRampToValueAtTime(level * 0.0005, at + seconds);

    osc.connect(envelope).connect(tone);
    osc.start(at);
    osc.stop(at + seconds + 0.02);
  };

  return {
    output,

    noteOn(at, freq, velocity) {
      const n = human(context, at, freq, velocity);
      // The nominal at ratio 2 lands on the asked-for note. See the header.
      const hz = n.freq / 2;
      const top = context.sampleRate * 0.45;

      // The clapper fades faster than the ring as the stroke softens — energy
      // in the contact goes as the square — so quiet notes are nearly all hum.
      clapper.frequency.setValueAtTime(Math.min(hz * 5, 6000), n.at);
      excite(context, noise.white, clapper, n.at, n.velocity * n.velocity * 0.55, 0.003);

      for (const partial of PARTIALS) {
        const f = hz * partial.ratio;
        if (f > top) continue;
        // The brightness tilt: partials above the prime scale with velocity.
        const tilt = partial.ratio <= 1 ? 1 : Math.min(1, 0.45 + n.velocity * 0.7);
        // The chime voicing: the solemn tierce held well back, the top of the
        // series with it. The tuning is the tower's; the manner is not.
        const soften = partial.ratio === 1.2 ? 0.4 : partial.ratio > 2 ? 0.5 : 1;
        const level = n.velocity * partial.level * tilt * soften * 0.13 * (0.85 + Math.random() * 0.3);
        const seconds = decay * partial.decay * (0.9 + Math.random() * 0.2);
        const cents = partial.ratio * 1.6;
        ring(n.at, f, seconds, level, -cents);
        ring(n.at, f, seconds, level, cents);
      }
    },

    dispose() {
      clapper.disconnect();
      tone.disconnect();
      output.disconnect();
    },
  };
}
