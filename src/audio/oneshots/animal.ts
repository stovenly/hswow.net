import type { AudioEngine } from '../AudioEngine';
import type { OneShot } from '../Scatter';
import { createFormantBank, type Formant } from '../dsp/formant';

/**
 * Animals, by source and filter.
 *
 * A dog, a sheep, a cow and a hen are the same three parts in different
 * proportions — a pitched source, a set of resonances above it, and a rhythm.
 * Nothing here models an animal; it models a **throat of a particular length
 * being driven at a particular effort**, which is all the ear has to go on
 * anyway.
 *
 * ## Rhythm is the species, more than timbre is
 *
 * This is the part that surprises people and it is worth stating plainly. Take
 * a dog bark and stretch one syllable to a second and a half and it stops being
 * a dog long before the formants have moved. Barks come in bursts of two to
 * four with a gap of a third of a second; a bleat is one long wobbling note; a
 * cow is one longer, lower, straighter one; a hen is a fast irregular train of
 * very short ones. **Get the rhythm right and a fairly crude source-filter pair
 * is unmistakable. Get it wrong and no amount of formant tuning rescues it.**
 *
 * So the tables below are mostly about time.
 *
 * ## Pitch contour
 *
 * Every call here rises fast into its peak and falls away, because that is what
 * a burst of subglottal pressure through a closing larynx does. A flat pitch
 * reads as an oscillator immediately. The fall is exponential — pitch is
 * perceived logarithmically, and a linear fall spends most of its length in the
 * last few hertz where nobody is listening.
 */

interface Call {
  /** Peak pitch, and where it falls to by the end of a syllable. */
  f0: readonly [number, number];
  /** How far below the peak the attack starts, as a ratio. */
  onset: number;
  syllables: readonly [number, number];
  /** Syllable length, seconds. */
  length: readonly [number, number];
  /** Silence between syllables, seconds. */
  gap: readonly [number, number];
  /** Rise time as a fraction of the syllable. Small is a bark, large is a moo. */
  attack: number;
  /** Noise mixed into the source, 0..1. Breath, rasp, and the fry of effort. */
  rasp: number;
  /** The shape the syllable starts on, and the one it closes to. */
  open: readonly Formant[];
  close: readonly Formant[];
  /** Wobble. A bleat is defined by it; a dog has none. */
  vibrato?: { hz: number; cents: number };
  /** Spread of pitch between one call and the next, as a ratio. */
  variance: number;
}

/**
 * Formant shapes, in the same units as `VOWELS` in `dsp/formant.ts`.
 *
 * Derived from the human tables by the length of the tract: resonances scale
 * roughly inversely with it, so a medium dog's muzzle puts its first formant
 * somewhat above a man's and a cow's puts it well below. That relationship is
 * why the same three numbers, moved together, read as size — and it is the
 * cheapest characterisation control in this whole file.
 */
const CALLS: Record<'dog' | 'sheep' | 'cow' | 'fowl', Call> = {
  // Short, hard, and in bursts. The bark is almost all attack: the mouth opens
  // wide and shuts, so F1 leaps and then collapses.
  dog: {
    f0: [440, 235],
    onset: 0.62,
    syllables: [2, 4],
    length: [0.085, 0.135],
    gap: [0.2, 0.34],
    attack: 0.06,
    rasp: 0.34,
    open: [
      { hz: 880, q: 6, level: 1 },
      { hz: 1620, q: 9, level: 0.55 },
      { hz: 3100, q: 12, level: 0.3 },
    ],
    close: [
      { hz: 520, q: 7, level: 0.7 },
      { hz: 1180, q: 8, level: 0.3 },
      { hz: 2600, q: 12, level: 0.12 },
    ],
    variance: 0.14,
  },

  // One long note that cannot hold still. The vibrato is not decoration — it is
  // the entire identity of a bleat, and at 0 cents this becomes a foghorn.
  sheep: {
    f0: [355, 300],
    onset: 0.82,
    syllables: [1, 2],
    length: [0.55, 1.05],
    gap: [0.35, 0.6],
    attack: 0.14,
    rasp: 0.22,
    open: [
      { hz: 620, q: 7, level: 1 },
      { hz: 1720, q: 11, level: 0.42 },
      { hz: 2650, q: 14, level: 0.18 },
    ],
    close: [
      { hz: 700, q: 7, level: 0.9 },
      { hz: 1500, q: 10, level: 0.3 },
      { hz: 2600, q: 14, level: 0.12 },
    ],
    vibrato: { hz: 13, cents: 105 },
    variance: 0.1,
  },

  // Long, low, and almost straight. A cow's tract is long enough that its first
  // formant sits under 400 Hz, which is what makes it read as *large* before
  // anything else about it registers.
  cow: {
    f0: [168, 108],
    onset: 0.72,
    syllables: [1, 1],
    length: [1.1, 1.8],
    gap: [0.5, 0.8],
    attack: 0.22,
    rasp: 0.16,
    open: [
      { hz: 390, q: 6, level: 1 },
      { hz: 800, q: 8, level: 0.5 },
      { hz: 1900, q: 12, level: 0.14 },
    ],
    close: [
      { hz: 330, q: 6, level: 0.85 },
      { hz: 720, q: 8, level: 0.3 },
      { hz: 1750, q: 12, level: 0.08 },
    ],
    vibrato: { hz: 5.5, cents: 35 },
    variance: 0.08,
  },

  // A fast, irregular, half-voiced train. More rasp than voice — a hen's cluck
  // is closer to a noise burst with a pitch on it than to a note.
  fowl: {
    f0: [880, 620],
    onset: 0.7,
    syllables: [3, 6],
    length: [0.045, 0.085],
    gap: [0.09, 0.21],
    attack: 0.12,
    rasp: 0.55,
    open: [
      { hz: 1450, q: 8, level: 1 },
      { hz: 2700, q: 11, level: 0.5 },
      { hz: 4200, q: 14, level: 0.22 },
    ],
    close: [
      { hz: 1150, q: 8, level: 0.6 },
      { hz: 2400, q: 11, level: 0.25 },
      { hz: 3900, q: 14, level: 0.1 },
    ],
    variance: 0.16,
  },
};

export type Creature = keyof typeof CALLS;

export interface AnimalOptions {
  kind?: Creature;
  gain?: number;
  /**
   * Size, as a multiplier on the whole tract.
   *
   * Below 1 is a **bigger** animal: resonances and pitch both fall as the tract
   * lengthens. One number moves a terrier to a mastiff, or a lamb to a ram.
   */
  tone?: number;
  /** Extra noise in the source, on top of what the kind already has. */
  rasp?: number;
}

function between(range: readonly [number, number]): number {
  return range[0] + Math.random() * (range[1] - range[0]);
}

function scale(formants: readonly Formant[], tone: number): Formant[] {
  return formants.map((formant) => ({ ...formant, hz: formant.hz * tone }));
}

export function createAnimal(engine: AudioEngine, options: AnimalOptions = {}): OneShot {
  const context = engine.context;
  const noise = engine.noise;
  if (!noise) throw new Error('animal built before the noise buffers were ready');

  const call = CALLS[options.kind ?? 'dog'];
  const tone = options.tone ?? 1;
  const rasp = Math.min(1, (options.rasp ?? 0) + call.rasp);

  const output = context.createGain();
  output.gain.value = options.gain ?? 0.6;

  const open = scale(call.open, tone);
  const close = scale(call.close, tone);
  const bank = createFormantBank(context, open, output);

  /** Nodes awaiting cleanup. Sources release themselves; gains do not. */
  const pendingNodes: AudioNode[] = [];
  let sweep = 0;

  const syllable = (at: number, length: number, force: number, pitch: number): void => {
    const envelope = context.createGain();
    envelope.connect(bank.input);

    // Source: a sawtooth, because a glottal pulse is a sharply asymmetric
    // waveform with energy at every harmonic, and that is exactly what a set of
    // resonances needs to have something to resonate with. A sine has nothing
    // for the upper formants to find.
    const osc = context.createOscillator();
    osc.type = 'sawtooth';
    const peak = pitch;
    const start = peak * call.onset;
    const rise = length * call.attack;
    osc.frequency.setValueAtTime(start, at);
    osc.frequency.exponentialRampToValueAtTime(peak, at + rise);
    osc.frequency.exponentialRampToValueAtTime(
      Math.max(peak * (call.f0[1] / call.f0[0]), 20),
      at + length,
    );
    osc.connect(envelope);
    osc.start(at);

    let lfo: OscillatorNode | null = null;
    if (call.vibrato) {
      lfo = context.createOscillator();
      lfo.frequency.value = call.vibrato.hz * (0.85 + Math.random() * 0.3);
      const depth = context.createGain();
      // `detune` is in cents, so the depth is in cents too and stays constant
      // in *pitch* as the fundamental falls. A depth in hertz would widen
      // audibly as the note descended.
      depth.gain.value = call.vibrato.cents;
      lfo.connect(depth).connect(osc.detune);
      lfo.start(at);
      pendingNodes.push(depth);
    }

    // Breath. Through the same bank as the voice, so it is the same throat.
    let breath: AudioBufferSourceNode | null = null;
    if (rasp > 0.01) {
      breath = context.createBufferSource();
      breath.buffer = noise.white;
      breath.playbackRate.value = 0.8 + Math.random() * 0.5;
      const raspGain = context.createGain();
      raspGain.gain.value = rasp * 0.55;
      breath.connect(raspGain).connect(envelope);
      breath.start(at, Math.random() * Math.max(noise.white.duration - 2, 0));
      pendingNodes.push(raspGain);
    }

    // Amplitude. The syllable decays through its own length rather than being
    // held flat — an animal is running out of air the whole time it is making
    // the sound — and the tail is exponential so it has no corner at the end.
    const release = Math.max(0.02, length * 0.28);
    envelope.gain.setValueAtTime(0, at);
    envelope.gain.linearRampToValueAtTime(force, at + rise);
    envelope.gain.linearRampToValueAtTime(force * 0.62, at + length - release);
    envelope.gain.setTargetAtTime(0, at + length - release, release / 3);

    const end = at + length + release * 3;
    osc.stop(end);
    lfo?.stop(end);
    breath?.stop(end);
    pendingNodes.push(envelope);
    sweep = Math.max(sweep, end);

    // The mouth opens and shuts. Two thirds of the way through, the shape has
    // already started closing — which is why the second half of a bark is
    // duller than the first, and why holding one shape sounds like a machine.
    bank.shape(open, at, rise);
    bank.shape(close, at + length * 0.55, length * 0.45);
  };

  let cleanup = 0;

  return {
    output,

    fire(at, force) {
      // Reset, not accumulate: `sweep` tracks the end of *this* call, and
      // carrying it over would make every voice report itself busy for longer
      // than the last one, forever.
      sweep = at;
      const count = Math.round(between(call.syllables));
      // One pitch for the whole call, varied between calls. Animals do not
      // change size between syllables, and re-rolling per syllable is the
      // commonest way a procedural call turns into a set of unrelated beeps.
      const pitch = call.f0[0] * tone * (1 + (Math.random() * 2 - 1) * call.variance);

      let cursor = at;
      for (let i = 0; i < count; i++) {
        const length = between(call.length);
        // Later syllables lose energy. A dog's first bark is its loudest.
        syllable(cursor, length, force * Math.pow(0.86, i) * (0.85 + Math.random() * 0.3), pitch);
        cursor += length + between(call.gap);
      }

      const busy = sweep - at;
      window.clearTimeout(cleanup);
      cleanup = window.setTimeout(
        () => {
          for (const node of pendingNodes) node.disconnect();
          pendingNodes.length = 0;
        },
        (busy + 0.4) * 1000,
      );

      return busy;
    },

    dispose() {
      window.clearTimeout(cleanup);
      for (const node of pendingNodes) node.disconnect();
      pendingNodes.length = 0;
      bank.dispose();
      output.disconnect();
    },
  };
}
