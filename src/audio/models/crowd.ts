import type { AudioEngine } from '../AudioEngine';
import type { SoundModel } from '../Emitter';
import { createEventClock, type EventClock } from '../dsp/clock';
import { createFormantBank, VOWELS, type Formant, type FormantBank } from '../dsp/formant';

/**
 * Walla — a crowd, heard as a crowd.
 *
 * Several voices talking at once, and **not one of them saying anything.** That
 * is not a shortcut, it is the requirement. The film industry has recorded walla
 * for a century by putting people in a room and asking them to speak nonsense,
 * because the instant a listener can make out a word they stop hearing a room
 * full of people and start listening to that word. Intelligibility is the
 * failure mode.
 *
 * So there are no consonants here at all — consonants are what carry meaning,
 * and they are also what makes synthesised speech sound like synthesised speech.
 * What is left is the part that actually reads as *people*: pitch, a formant
 * shape moving at syllable rate, and a rhythm of phrases and pauses.
 *
 * ## The pauses do the work
 *
 * A continuous murmur is a drone. What makes this a crowd is that **each voice
 * stops** — a run of five or six syllables, then a second or three of nothing
 * while somebody else is talking. Overlapping phrase structures at incommensurate
 * lengths is what produces the ebb and swell that people recognise as a room
 * with a conversation happening in it, and no amount of timbre work substitutes
 * for it.
 *
 * It also means a crowd this size is quiet most of the time, per voice, which is
 * why six voices is plenty and twelve is worse rather than better.
 *
 * ## Always distant
 *
 * There is a shared lowpass on the bus and it is not optional. Close-up walla is
 * an uncanny valley: near enough to expect words, not near enough to have them.
 * Every use of this model should be through a wall, across a square, or up a
 * flight of stairs — and the emitter that carries it should have a short
 * `refDistance` and a lot of reverb, so that it is heard as a space with people
 * in it rather than as people.
 */

interface Voice {
  osc: OscillatorNode;
  envelope: GainNode;
  bank: FormantBank;
  clock: EventClock;
  /** Length of the syllable just scheduled, so the gap can follow it. */
  length: number;
  /** Syllables left in the current phrase. Zero means take a breath. */
  left: number;
  /** Where this voice's pitch sits, in Hz. */
  pitch: number;
  /** Tract length, as a multiplier on every formant. */
  tract: number;
}

const SHAPES = [VOWELS.a, VOWELS.e, VOWELS.i, VOWELS.o, VOWELS.u];

export interface CrowdOptions {
  gain?: number;
  /** How many talkers. Six is a tavern; three is a corner of one. */
  voices?: number;
  /**
   * How much of the time each voice is talking, 0..1.
   *
   * Low is a lull with the occasional remark, high is an argument. Above about
   * 0.8 the pauses stop overlapping into silence and it collapses into a drone
   * — see the note above.
   */
  density?: number;
  /** Centre pitch in Hz. Below ~110 is a room of men, above ~190 of women. */
  pitch?: number;
  /** Spread of pitch and tract length across the voices, 0..1. */
  variety?: number;
  /** How far off it is, as a lowpass in Hz. Lower is further and duller. */
  distance?: number;
}

export function createCrowd(engine: AudioEngine, options: CrowdOptions = {}): SoundModel {
  const context = engine.context;

  const count = Math.max(1, Math.min(10, options.voices ?? 6));
  const density = Math.min(0.95, Math.max(0.05, options.density ?? 0.45));
  const basePitch = options.pitch ?? 135;
  const variety = options.variety ?? 0.5;

  const output = context.createGain();
  output.gain.value = options.gain ?? 0.5;

  // Not optional. See the class doc — this is what keeps the model on the right
  // side of intelligibility, and it does more for the illusion than any of the
  // synthesis below.
  const far = context.createBiquadFilter();
  far.type = 'lowpass';
  far.frequency.value = options.distance ?? 1700;
  far.Q.value = 0.6;
  far.connect(output);

  const voices: Voice[] = [];

  for (let i = 0; i < count; i++) {
    // Spread deterministically across the range rather than randomly, so a
    // six-voice crowd never rolls six near-identical voices — which happens
    // often enough with independent draws to be worth designing out.
    const spread = count === 1 ? 0 : (i / (count - 1)) * 2 - 1;
    const tract = 1 + spread * variety * 0.35 + (Math.random() * 2 - 1) * 0.05;
    const pitch = basePitch * (1 - spread * variety * 0.4) * (0.95 + Math.random() * 0.1);

    const gain = context.createGain();
    // Each voice is quiet. A crowd is loud because there are several of them,
    // not because any one of them is — and voices summing incoherently gain
    // about 3 dB per doubling, not 6.
    gain.gain.value = 0.85 / Math.sqrt(count);
    gain.connect(far);

    const bank = createFormantBank(
      context,
      SHAPES[0].map((formant) => ({ ...formant, hz: formant.hz * tract })),
      gain,
    );

    const envelope = context.createGain();
    envelope.gain.value = 0;
    envelope.connect(bank.input);

    const osc = context.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.value = pitch;
    osc.connect(envelope);
    osc.start();

    voices.push({
      osc,
      envelope,
      bank,
      clock: createEventClock(context),
      length: 0.2,
      left: 0,
      pitch,
      tract,
    });
  }

  let active = true;

  const scale = (shape: readonly Formant[], tract: number): Formant[] =>
    shape.map((formant) => ({ ...formant, hz: formant.hz * tract }));

  const speak = (voice: Voice, at: number): void => {
    const length = 0.12 + Math.random() * 0.14;
    voice.length = length;
    voice.left--;

    // Prosody: pitch drifts down through a phrase and jumps back up at the
    // start of the next one. A flat crowd is a choir humming.
    const first = voice.left >= 4;
    const target = voice.pitch * (first ? 1.1 : 0.9 + Math.random() * 0.2);
    voice.osc.frequency.setTargetAtTime(target, at, length * 0.6);

    const level = 0.55 + Math.random() * 0.45;
    const attack = length * 0.22;
    voice.envelope.gain.setValueAtTime(0, at);
    voice.envelope.gain.linearRampToValueAtTime(level, at + attack);
    voice.envelope.gain.linearRampToValueAtTime(level * 0.75, at + length * 0.75);
    // Exponential tail rather than a ramp to zero: a corner at the end of every
    // syllable is a tick, and at four syllables a second across six voices that
    // is a rattle nobody can locate.
    voice.envelope.gain.setTargetAtTime(0, at + length * 0.75, length * 0.12);

    // The vowel arrives over most of the syllable rather than being set at the
    // start of it. Formants that step read as a filter being switched; formants
    // that glide read as a mouth.
    const shape = SHAPES[(Math.random() * SHAPES.length) | 0];
    voice.bank.shape(scale(shape, voice.tract), at, length * 0.8);
  };

  return {
    output,

    setActive(next) {
      active = next;
      if (next) {
        for (const voice of voices) voice.clock.reset();
      } else {
        for (const voice of voices) voice.envelope.gain.value = 0;
      }
    },

    update() {
      if (!active) return;

      for (const voice of voices) {
        voice.clock.pump(
          (at) => speak(voice, at),
          () => {
            if (voice.left > 0) {
              // Inside a phrase: syllables run almost into one another.
              return voice.length + 0.015 + Math.random() * 0.06;
            }
            voice.left = 3 + Math.floor(Math.random() * 6);
            // The breath between phrases, and the whole reason this is a crowd
            // rather than a drone. Scaled by density, so turning the room up
            // shortens the gaps rather than making anyone louder.
            const quiet = (1 - density) * 5.5;
            return voice.length + 0.35 + Math.random() * (0.6 + quiet);
          },
          // Individually audible only in the sense that a syllable is; resuming
          // immediately after a hitch is right, the same as for any texture.
          'immediate',
        );
      }
    },

    dispose() {
      for (const voice of voices) {
        try {
          voice.osc.stop();
        } catch {
          // Already stopped. Web Audio throws rather than shrugging.
        }
        voice.osc.disconnect();
        voice.envelope.disconnect();
        voice.bank.dispose();
      }
      voices.length = 0;
      far.disconnect();
      output.disconnect();
    },
  };
}
