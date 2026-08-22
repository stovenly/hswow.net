import type { AudioEngine } from '../AudioEngine';
import type { OneShot } from '../Scatter';

/**
 * A voice with a syrinx: birds, and anything else whose call is a pitch being
 * bent rather than a throat being shaped.
 *
 * A songbird's labia sit in the bronchi and behave as a nonlinear oscillator:
 * at the point of instability the oscillation is born with almost no spectral
 * content and **grows richer as it is driven harder**. So the source here is a
 * sine into a saturating curve, with the *envelope applied before the curve* —
 * which is the whole model. A note that swells brightens as it swells and dulls
 * as it dies, and no fixed waveform does that.
 *
 * Above it: the beak, as a lowpass that opens with effort, and two resonances
 * standing for the trachea and the cavity behind it. Nothing here has a formant
 * table, and nothing here is a recording.
 *
 * The rest is time, and time is the species. **The rhythm is what makes a song
 * thrush a song thrush** — everything said two to four times — long before the
 * timbre is. Get the table right and a plain source carries it.
 */

export type Span = readonly [number, number];

export interface Syllable {
  /** Pitch at the start and at the end, as ratios of the call's base. */
  from: number;
  to: number;
  length: Span;
  /** Silence after it. */
  gap: Span;
  /** How hard the labia are blown, 0..1. Low is a whistle, high is a shout. */
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
  /** The trachea's resonance in Hz, and how much it insists. */
  formant?: number;
  q?: number;
  /** The cavity above it. Defaults to a little over twice the first. */
  formant2?: number;
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

/**
 * The saturating curve the labia are read through. `tanh`, normalised so unit
 * input gives unit output: below about a fifth of full scale it is a sine and
 * by full scale it has a stack of odd harmonics on it.
 */
const CURVE = (() => {
  const points = 2048;
  const curve = new Float32Array(points);
  const k = 3.2;
  for (let i = 0; i < points; i++) {
    const x = (i / (points - 1)) * 2 - 1;
    curve[i] = Math.tanh(x * k) / Math.tanh(k);
  }
  return curve;
})();

/** Where the beak sits shut, and how far effort opens it. Hz. */
const BEAK_SHUT = 900;
const BEAK_OPEN = 9000;

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
  output.gain.value = options.gain ?? shape.gain ?? 0.5;

  // Everything below is built once and shared across syllables — a bird does
  // not change size between notes, and the syllables of a call do not overlap.
  const level = context.createGain();
  level.gain.value = 0;
  level.connect(output);

  const first = (shape.formant ?? shape.pitch * 1.6) * tone;
  const tract = context.createBiquadFilter();
  tract.type = 'bandpass';
  tract.frequency.value = first;
  tract.Q.value = shape.q ?? 1.1;
  tract.connect(level);

  const cavity = context.createBiquadFilter();
  cavity.type = 'bandpass';
  cavity.frequency.value = (shape.formant2 ?? first * 2.35) * (shape.formant2 ? tone : 1);
  cavity.Q.value = (shape.q ?? 1.1) * 1.4;
  const cavityGain = context.createGain();
  cavityGain.gain.value = 0.45;
  cavity.connect(cavityGain).connect(level);

  // Straight through as well, so the resonances colour rather than replace.
  const direct = context.createGain();
  direct.gain.value = 0.5;
  direct.connect(level);

  const beak = context.createBiquadFilter();
  beak.type = 'lowpass';
  beak.frequency.value = BEAK_SHUT;
  beak.Q.value = 0.7;
  beak.connect(tract);
  beak.connect(cavity);
  beak.connect(direct);

  const labia = context.createWaveShaper();
  labia.curve = CURVE;
  labia.oversample = '2x';
  labia.connect(beak);

  const pending: AudioNode[] = [];
  let sweep = 0;
  /** Set by `setBend` and spent by the next `fire`. */
  let bendCents = 0;
  let bendOver = 0;
  let bendFrom = 0;

  const syllable = (at: number, unit: Syllable, base: number, force: number): number => {
    const length = between(unit.length);
    const drive = unit.drive ?? 0.25;
    const peak = force * (unit.level ?? 1);
    const rise = Math.min(0.014, length * 0.22);
    const hold = at + length * 0.7;

    const from = base * unit.from;
    const to = base * unit.to;

    const osc = context.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(from, at);

    // Exponential, because pitch is heard in ratios: a linear sweep sounds like
    // it slows down as it rises.
    const glide = (target: number, when: number): void => {
      osc.frequency.exponentialRampToValueAtTime(Math.max(target, 20), when);
    };
    if (unit.bend) glide(base * unit.bend.to, at + length * unit.bend.at);
    glide(to, at + length);

    if (unit.trill) {
      const lfo = context.createOscillator();
      lfo.frequency.value = unit.trill.hz * (0.9 + Math.random() * 0.2);
      const depth = context.createGain();
      // Cents, so the warble stays constant in pitch as the note moves.
      depth.gain.value = unit.trill.cents;
      lfo.connect(depth).connect(osc.detune);
      lfo.start(at);
      lfo.stop(at + length + 0.05);
      pending.push(depth);
    }

    if (bendCents !== 0) {
      // One ramp across the whole flight, sampled over this syllable, so the
      // note is already falling by the time the next one starts.
      const span = Math.max(bendOver, 0.05);
      const cents = (t: number): number => bendCents * (1 - 2 * Math.min(Math.max(t, 0), 1));
      osc.detune.setValueAtTime(cents((at - bendFrom) / span), at);
      osc.detune.linearRampToValueAtTime(cents((at + length - bendFrom) / span), at + length);
    }

    // **Before the curve.** This is the model: how hard the labia are blown
    // decides both how loud and how rich, so the two cannot be separated.
    const blow = context.createGain();
    const blown = 0.22 + drive * 0.78;
    blow.gain.setValueAtTime(0, at);
    blow.gain.linearRampToValueAtTime(blown, at + rise);
    blow.gain.setValueAtTime(blown, hold);
    blow.gain.linearRampToValueAtTime(blown * 0.25, at + length);
    osc.connect(blow).connect(labia);

    // The beak, opening with effort.
    const open = BEAK_SHUT + BEAK_OPEN * drive;
    beak.frequency.setValueAtTime(BEAK_SHUT, at);
    beak.frequency.linearRampToValueAtTime(open, at + rise);
    beak.frequency.setValueAtTime(open, hold);
    beak.frequency.linearRampToValueAtTime(BEAK_SHUT, at + length);

    level.gain.setValueAtTime(0, at);
    level.gain.linearRampToValueAtTime(peak, at + rise);
    level.gain.setValueAtTime(peak, hold);
    level.gain.linearRampToValueAtTime(0, at + length);

    let breath: AudioBufferSourceNode | null = null;
    if (rasp > 0.01) {
      // Through the tract but not through the labia: breath is air past the
      // throat, not the throat itself.
      breath = context.createBufferSource();
      breath.buffer = noise.white;
      breath.playbackRate.value = 0.9 + Math.random() * 0.4;
      const raspGain = context.createGain();
      raspGain.gain.setValueAtTime(0, at);
      raspGain.gain.linearRampToValueAtTime(rasp * 0.5, at + rise);
      raspGain.gain.linearRampToValueAtTime(0, at + length);
      breath.connect(raspGain).connect(beak);
      breath.start(at, Math.random() * Math.max(noise.white.duration - 2, 0));
      breath.stop(at + length + 0.02);
      pending.push(raspGain);
    }

    const end = at + length + 0.02;
    osc.start(at);
    osc.stop(end);
    pending.push(blow);
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
      const base = shape.pitch * tone * (1 + (Math.random() * 2 - 1) * variance);
      const count = shape.count ? Math.round(between(shape.count)) : shape.phrase.length;
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
      labia.disconnect();
      beak.disconnect();
      tract.disconnect();
      cavity.disconnect();
      cavityGain.disconnect();
      direct.disconnect();
      level.disconnect();
      output.disconnect();
    },
  };
}
