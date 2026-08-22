import type { AudioEngine } from '../AudioEngine';
import type { SoundModel } from '../Emitter';
import { playNoise, type NoiseVoice } from '../noise';
import { createEventClock, type EventClock, poissonGap } from '../dsp/clock';

/**
 * A settlement heard from inside it: several people talking, none of them near
 * enough to be a person.
 *
 * **There are no vowels in here, and that is the entire design.** A bank of
 * formants driven by an oscillator gives you `aah — eee — ooo`, and once the
 * ear has picked out a single vowel it has stopped hearing a village and
 * started hearing a synthesiser. The give-away is not the quality of the
 * formants; it is that they are *identifiable at all*.
 *
 * Distance does not work like that. It destroys the fine spectral detail that
 * carries a vowel long before it touches the **syllable envelope** — so what
 * actually survives a hundred metres of air is the rhythm of speech and its
 * long-term average spectrum, and nothing else. Both are reproduced here and
 * neither needs a single oscillator:
 *
 * - The **long-term average speech spectrum**: a broad rise into a peak around
 *   500 Hz and a steady fall above a kilohertz. That is a filter, not a vowel.
 * - The **syllable rate**: three to five a second, in phrases of a few seconds
 *   with breaths between them. Each talker runs its own, and the overlapping of
 *   their pauses is what gives a crowd its swell and ebb.
 *
 * Three streams is a village and six is a riot. The pauses do the work, so
 * adding talkers past the point where the gaps stop lining up buys nothing but
 * a drone.
 */

export interface MurmurOptions {
  gain?: number;
  /** How many are talking. Three is a lane; five is a square at noon. */
  voices?: number;
  /** How much of the time each one is talking, 0..1. */
  density?: number;
  /** Syllables a second. Speech sits between three and five. */
  rate?: number;
  /** How far off, as a lowpass in Hz. Lower is further and duller. */
  distance?: number;
  /** Where the speech peak sits. Lower is a room of men. */
  pitch?: number;
}

interface Stream {
  noise: NoiseVoice;
  gate: GainNode;
  body: GainNode;
  clock: EventClock;
  gap: ReturnType<typeof poissonGap>;
  /** Syllables left before this one takes a breath. */
  left: number;
}

export function createMurmur(engine: AudioEngine, options: MurmurOptions = {}): SoundModel {
  const context = engine.context;
  const noise = engine.noise;
  if (!noise) throw new Error('murmur built before the noise buffers were ready');

  const count = Math.max(1, options.voices ?? 3);
  const density = options.density ?? 0.5;
  const rate = options.rate ?? 4;
  const pitch = options.pitch ?? 190;

  const output = context.createGain();
  output.gain.value = options.gain ?? 0.12;

  // How far off it all is. Not optional: close-up walla is near enough to
  // expect words and not near enough to have them.
  const far = context.createBiquadFilter();
  far.type = 'lowpass';
  far.frequency.value = options.distance ?? 1100;
  far.Q.value = 0.6;
  far.connect(output);

  const streams: Stream[] = [];
  for (let i = 0; i < count; i++) {
    // Each talker its own corner of the spectrum, so the sum is a crowd rather
    // than one voice at three levels.
    const spread = 1 + (i / Math.max(count - 1, 1) - 0.5) * 0.5;

    // The speech spectrum, as a filter and nothing else.
    const speech = context.createBiquadFilter();
    speech.type = 'bandpass';
    speech.frequency.value = 520 * spread;
    speech.Q.value = 0.55;

    const gate = context.createGain();
    gate.gain.value = 0;
    speech.connect(gate).connect(far);

    // The body underneath: the sense that a chest is behind it, at the rate
    // voices sit at, without any pitch being findable.
    const chest = context.createBiquadFilter();
    chest.type = 'bandpass';
    chest.frequency.value = pitch * spread;
    chest.Q.value = 1.8;
    const body = context.createGain();
    body.gain.value = 0;
    chest.connect(body).connect(far);

    const source = playNoise(context, noise.pink, speech, 0.12);
    // The same stream feeds the chest band, so a talker's body and their
    // consonants belong to one another.
    speech.connect(chest);

    streams.push({
      noise: source,
      gate,
      body,
      clock: createEventClock(context),
      gap: poissonGap(rate),
      left: 3 + Math.floor(Math.random() * 5),
    });
  }

  let active = true;

  const syllable = (stream: Stream, at: number): void => {
    // A syllable is a rise, a held middle and a fall, over roughly a fifth of a
    // second. Sharper than that reads as a click train; softer as a wash.
    const length = 0.09 + Math.random() * 0.13;
    const peak = (0.35 + Math.random() * 0.65) / Math.sqrt(count);
    const rise = length * 0.28;

    stream.gate.gain.setValueAtTime(stream.gate.gain.value, at);
    stream.gate.gain.linearRampToValueAtTime(peak, at + rise);
    stream.gate.gain.linearRampToValueAtTime(peak * 0.55, at + length * 0.75);
    stream.gate.gain.linearRampToValueAtTime(0, at + length);

    stream.body.gain.setValueAtTime(stream.body.gain.value, at);
    stream.body.gain.linearRampToValueAtTime(peak * 0.5, at + rise * 1.4);
    stream.body.gain.linearRampToValueAtTime(0, at + length);

    stream.left -= 1;
    if (stream.left > 0) {
      stream.gap.rate = rate * (0.8 + Math.random() * 0.4);
    } else {
      // A breath. Overlapping pauses are what make a crowd breathe, and a
      // density much past 0.8 stops them lining up into silence at all.
      stream.left = 3 + Math.floor(Math.random() * 6);
      stream.gap.rate = density / (0.9 + Math.random() * 2.4);
    }
  };

  return {
    output,

    setActive(next) {
      active = next;
      if (next) for (const stream of streams) stream.clock.reset();
    },

    update() {
      if (!active) return;
      for (const stream of streams) {
        stream.clock.pump((at) => syllable(stream, at), stream.gap, 'immediate');
      }
    },

    dispose() {
      for (const stream of streams) {
        stream.noise.stop();
        stream.gate.disconnect();
        stream.body.disconnect();
      }
      streams.length = 0;
      far.disconnect();
      output.disconnect();
    },
  };
}
