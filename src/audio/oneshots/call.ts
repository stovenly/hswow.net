import type { AudioEngine } from '../AudioEngine';
import type { OneShot } from '../Scatter';

/**
 * A voice with a syrinx: birds, and anything else whose call is a pitch being
 * bent rather than a throat being shaped.
 *
 * The table is the species and the synthesis is shared, the same split
 * `animal.ts` makes — and for the same reason. **The rhythm is the species.**
 * A song thrush is a bird that says everything three times; a wren is four
 * seconds of nothing followed by an explosion; a chaffinch is an accelerating
 * descent into a flourish. Get those right and a plain source carries them.
 *
 * The source is a sine with a sawtooth mixed in by `drive`, through one
 * resonance standing for the tract. That is the cheap reading of a syrinx: a
 * labial oscillator whose spectrum grows richer as it is driven harder,
 * filtered by the tube above it.
 */

export type Span = readonly [number, number];

export interface Syllable {
  /** Pitch at the start and at the end, as ratios of the call's base. */
  from: number;
  to: number;
  length: Span;
  /** Silence after it. */
  gap: Span;
  /** How hard the source is driven, 0..1. Low is a whistle, high is a shout. */
  drive?: number;
  /** Pitch turns here, 0..1 through the syllable, and heads for `to` instead. */
  bend?: { at: number; to: number };
  /** Warble: rate in Hz and depth in cents. */
  trill?: { hz: number; cents: number };
  /** Level, relative to the call. */
  level?: number;
}

export interface CallShape {
  /** Base pitch in Hz. Everything in `phrase` is a ratio of it. */
  pitch: number;
  /** Spread between one call and the next, as a fraction either way. */
  variance?: number;
  /** The syllables, in order. Taken `count` at a time from the front. */
  phrase: readonly Syllable[];
  /** How many of the phrase's syllables this call uses. */
  count?: Span;
  /** Times the whole thing is said. A song thrush is [2, 4]. */
  repeats?: Span;
  /** Silence between repeats. */
  between?: Span;
  /** Noise in the source, 0..1. Corvids, game birds and waders have plenty. */
  rasp?: number;
  /** The tract's resonance in Hz, and how much it insists. */
  formant?: number;
  q?: number;
  /** Level lost per syllable, as a ratio. */
  fade?: number;
  gain?: number;
}

export interface CallOptions {
  shape: CallShape;
  gain?: number;
  /** Size, as a multiplier on pitch and tract together. Below 1 is bigger. */
  tone?: number;
}

function between(span: Span): number {
  return span[0] + Math.random() * (span[1] - span[0]);
}

export function createCall(engine: AudioEngine, options: CallOptions): OneShot {
  const context = engine.context;
  const noise = engine.noise;
  if (!noise) throw new Error('call built before the noise buffers were ready');

  const shape = options.shape;
  const tone = options.tone ?? 1;
  const rasp = shape.rasp ?? 0;

  const output = context.createGain();
  output.gain.value = (options.gain ?? shape.gain ?? 0.5) * 1;

  // One resonance for the tract, shared across every syllable — a bird does not
  // change size between notes.
  const tract = context.createBiquadFilter();
  tract.type = 'bandpass';
  tract.frequency.value = (shape.formant ?? shape.pitch * 1.6) * tone;
  tract.Q.value = shape.q ?? 1.1;
  tract.connect(output);
  // Straight through as well, so the resonance colours rather than replaces.
  const direct = context.createGain();
  direct.gain.value = 0.55;
  direct.connect(output);

  const pending: AudioNode[] = [];
  let sweep = 0;
  /** Set by `setBend` and spent by the next `fire`. */
  let bendCents = 0;
  let bendOver = 0;
  let bendFrom = 0;

  const syllable = (at: number, unit: Syllable, base: number, force: number): number => {
    const length = between(unit.length);
    const drive = unit.drive ?? 0.25;
    const envelope = context.createGain();
    envelope.connect(tract);
    envelope.connect(direct);

    const from = base * unit.from;
    const to = base * unit.to;

    const voice = context.createOscillator();
    voice.type = 'sine';
    voice.frequency.setValueAtTime(from, at);

    // The driven half. A sawtooth has something for the tract to resonate with;
    // a sine has nothing, which is why a pure-sine bird is a whistle forever.
    const edge = context.createOscillator();
    edge.type = 'sawtooth';
    edge.frequency.setValueAtTime(from, at);
    const edgeGain = context.createGain();
    edgeGain.gain.value = drive * 0.32;

    // Exponential, because pitch is heard in ratios: a linear sweep sounds like
    // it slows down as it rises.
    const glide = (target: number, when: number): void => {
      voice.frequency.exponentialRampToValueAtTime(Math.max(target, 20), when);
      edge.frequency.exponentialRampToValueAtTime(Math.max(target, 20), when);
    };

    if (unit.bend) {
      glide(base * unit.bend.to, at + length * unit.bend.at);
      glide(to, at + length);
    } else {
      glide(to, at + length);
    }

    if (unit.trill) {
      const lfo = context.createOscillator();
      lfo.frequency.value = unit.trill.hz * (0.9 + Math.random() * 0.2);
      const depth = context.createGain();
      // Cents, so the warble stays constant in pitch as the note moves.
      depth.gain.value = unit.trill.cents;
      lfo.connect(depth);
      depth.connect(voice.detune);
      depth.connect(edge.detune);
      lfo.start(at);
      lfo.stop(at + length + 0.05);
      pending.push(depth);
    }

    if (bendCents !== 0) {
      // One ramp across the whole flight, sampled over this syllable: the note
      // is already falling by the time the second one starts.
      const span = Math.max(bendOver, 0.05);
      const cents = (t: number) => bendCents * (1 - 2 * Math.min(Math.max(t, 0), 1));
      voice.detune.setValueAtTime(cents((at - bendFrom) / span), at);
      voice.detune.linearRampToValueAtTime(cents((at + length - bendFrom) / span), at + length);
      edge.detune.setValueAtTime(cents((at - bendFrom) / span), at);
      edge.detune.linearRampToValueAtTime(cents((at + length - bendFrom) / span), at + length);
    }

    voice.connect(envelope);
    edge.connect(edgeGain).connect(envelope);

    let breath: AudioBufferSourceNode | null = null;
    if (rasp > 0.01) {
      breath = context.createBufferSource();
      breath.buffer = noise.white;
      breath.playbackRate.value = 0.9 + Math.random() * 0.4;
      const raspGain = context.createGain();
      raspGain.gain.value = rasp * 0.4 * force;
      breath.connect(raspGain).connect(tract);
      breath.start(at, Math.random() * Math.max(noise.white.duration - 2, 0));
      breath.stop(at + length + 0.02);
      pending.push(raspGain);
    }

    const peak = force * (unit.level ?? 1);
    const rise = Math.min(0.012, length * 0.22);
    envelope.gain.setValueAtTime(0, at);
    envelope.gain.linearRampToValueAtTime(peak, at + rise);
    envelope.gain.setValueAtTime(peak, at + length * 0.7);
    envelope.gain.linearRampToValueAtTime(0, at + length);

    const end = at + length + 0.02;
    voice.start(at);
    edge.start(at);
    voice.stop(end);
    edge.stop(end);
    pending.push(envelope, edgeGain);
    sweep = Math.max(sweep, end);

    return length + between(unit.gap);
  };

  let cleanup = 0;

  return {
    output,

    setBend(cents, seconds) {
      bendCents = cents;
      bendOver = seconds;
    },

    fire(at, force) {
      sweep = at;
      bendFrom = at;
      // One pitch for the whole call. Re-rolling per syllable is the commonest
      // way a procedural bird turns into a set of unrelated beeps.
      const variance = shape.variance ?? 0.08;
      const base = shape.pitch * (options.tone ?? 1) * (1 + (Math.random() * 2 - 1) * variance);
      const count = shape.count
        ? Math.round(between(shape.count))
        : shape.phrase.length;
      const says = shape.repeats ? Math.round(between(shape.repeats)) : 1;
      const fade = shape.fade ?? 0.94;

      let cursor = at;
      for (let repeat = 0; repeat < says; repeat++) {
        for (let i = 0; i < count; i++) {
          const unit = shape.phrase[i % shape.phrase.length];
          cursor += syllable(cursor, unit, base, force * Math.pow(fade, i));
        }
        if (repeat < says - 1) cursor += shape.between ? between(shape.between) : 0.3;
      }

      bendCents = 0;
      const busy = sweep - at;
      window.clearTimeout(cleanup);
      cleanup = window.setTimeout(
        () => {
          for (const node of pending) node.disconnect();
          pending.length = 0;
        },
        (busy + 0.4) * 1000,
      );
      return busy;
    },

    dispose() {
      window.clearTimeout(cleanup);
      for (const node of pending) node.disconnect();
      pending.length = 0;
      tract.disconnect();
      direct.disconnect();
      output.disconnect();
    },
  };
}
