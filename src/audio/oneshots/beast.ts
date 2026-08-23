import type { AudioEngine } from '../AudioEngine';
import type { OneShot } from '../Scatter';
import { createFormantBank, type Formant } from '../dsp/formant';
import { excite } from '../dsp/impact';

/**
 * Animals with lungs: a dog, a cow, a sheep, a pig, a fowl, a fox, a stag.
 *
 * A raw sawtooth into a set of bandpasses is where every bad animal synth ends
 * up, and it is bad for four specific reasons. This file is those four fixes.
 *
 * **1. The spectrum has to grow with the effort.** A larynx driven harder does
 * not just get louder, it gets brighter and harsher, because the folds slam
 * shut faster. A fixed waveform cannot do that at any level. So the source is a
 * sine through a saturating curve with the envelope applied *before* the curve —
 * the same trick `call.ts` uses for a syrinx, and the reason a bark now has a
 * hard middle and a soft edge instead of one timbre throughout.
 *
 * **2. A bark starts with a burst.** It is a plosive: pressure builds behind a
 * closed glottis and is released. The first two milliseconds are broadband and
 * unvoiced, and without them the note reads as a tone that faded in.
 *
 * **3. Animal calls are nonlinear.** Real larynxes fall into period doubling
 * and deterministic chaos when driven hard — that rough, torn, "it means it"
 * quality is a subharmonic appearing under the fundamental. It is the single
 * strongest cue that a sound came out of an animal and not an oscillator.
 *
 * **4. Nothing about a throat is steady.** Jitter in the pitch and a tract that
 * keeps moving are what separate a creature from a patch.
 *
 * The rhythm still carries the species — `animal.ts` was right about that and
 * it is why the tables below are mostly about time.
 */

interface Call {
  /** Peak pitch and where it falls to by the end of a syllable. */
  f0: readonly [number, number];
  /** How far below the peak the attack starts, as a ratio. */
  onset: number;
  syllables: readonly [number, number];
  /** Syllable length, seconds. */
  length: readonly [number, number];
  /** Silence between syllables, seconds. */
  gap: readonly [number, number];
  /** Rise as a fraction of the syllable. Small is a bark, large is a moo. */
  attack: number;
  /** How hard it is driven, 0..1. Sets brightness and harshness together. */
  effort: number;
  /** Breath and rasp in the source, 0..1. */
  rasp: number;
  /** The unvoiced release at the front. Zero for anything that is not plosive. */
  burst: number;
  /** Subharmonic under the fundamental, 0..1. The roughness that means animal. */
  chaos: number;
  /** Pitch irregularity, in cents. Nothing alive holds a note straight. */
  jitter: number;
  /** The shape the syllable opens on, and the one it closes to. */
  open: readonly Formant[];
  close: readonly Formant[];
  /** Wobble. A bleat is defined by it; a dog has none. */
  vibrato?: { hz: number; cents: number };
  /** Spread of pitch between one call and the next, as a ratio. */
  variance: number;
}

/**
 * Formants scale roughly inversely with tract length, so moving all three
 * together *is* the size control — a cow's first formant under 400 Hz is what
 * makes it read as large before anything else registers.
 */
const CALLS: Record<'dog' | 'sheep' | 'cow' | 'fowl' | 'pig' | 'fox' | 'stag', Call> = {
  // Short, hard, plosive, and in bursts. The mouth opens wide and shuts, so F1
  // leaps and collapses. Nearly all of the character is in the first 20 ms.
  dog: {
    f0: [440, 210],
    onset: 0.55,
    syllables: [2, 4],
    length: [0.09, 0.14],
    gap: [0.19, 0.33],
    attack: 0.035,
    effort: 0.95,
    rasp: 0.3,
    burst: 0.85,
    chaos: 0.4,
    jitter: 45,
    open: [
      { hz: 880, q: 5, level: 1 },
      { hz: 1620, q: 7, level: 0.6 },
      { hz: 3100, q: 9, level: 0.34 },
    ],
    close: [
      { hz: 520, q: 6, level: 0.7 },
      { hz: 1180, q: 7, level: 0.3 },
      { hz: 2600, q: 10, level: 0.12 },
    ],
    variance: 0.14,
  },

  // One long note that cannot hold still. The vibrato is the entire identity of
  // a bleat, and at zero cents this becomes a foghorn.
  sheep: {
    f0: [355, 300],
    onset: 0.82,
    syllables: [1, 2],
    length: [0.55, 1.05],
    gap: [0.35, 0.6],
    attack: 0.14,
    effort: 0.55,
    rasp: 0.24,
    burst: 0.12,
    chaos: 0.5,
    jitter: 30,
    open: [
      { hz: 620, q: 6, level: 1 },
      { hz: 1720, q: 9, level: 0.45 },
      { hz: 2650, q: 12, level: 0.2 },
    ],
    close: [
      { hz: 700, q: 6, level: 0.9 },
      { hz: 1500, q: 9, level: 0.3 },
      { hz: 2600, q: 12, level: 0.12 },
    ],
    vibrato: { hz: 13, cents: 110 },
    variance: 0.1,
  },

  // Long, low and almost straight, and it runs out of air audibly.
  cow: {
    f0: [168, 104],
    onset: 0.7,
    syllables: [1, 1],
    length: [1.1, 1.8],
    gap: [0.5, 0.8],
    attack: 0.22,
    effort: 0.7,
    rasp: 0.2,
    burst: 0.06,
    chaos: 0.35,
    jitter: 20,
    open: [
      { hz: 390, q: 5, level: 1 },
      { hz: 800, q: 7, level: 0.55 },
      { hz: 1900, q: 10, level: 0.16 },
    ],
    close: [
      { hz: 330, q: 5, level: 0.85 },
      { hz: 720, q: 7, level: 0.3 },
      { hz: 1750, q: 10, level: 0.08 },
    ],
    vibrato: { hz: 5.5, cents: 40 },
    variance: 0.08,
  },

  // A fast, irregular, half-voiced train. Closer to a noise burst with a pitch
  // on it than to a note, which is what the high rasp and burst are for.
  fowl: {
    f0: [880, 600],
    onset: 0.68,
    syllables: [3, 6],
    length: [0.05, 0.09],
    gap: [0.09, 0.21],
    attack: 0.1,
    effort: 0.85,
    rasp: 0.5,
    burst: 0.55,
    chaos: 0.3,
    jitter: 70,
    open: [
      { hz: 1450, q: 7, level: 1 },
      { hz: 2700, q: 9, level: 0.55 },
      { hz: 4200, q: 12, level: 0.26 },
    ],
    close: [
      { hz: 1150, q: 7, level: 0.6 },
      { hz: 2400, q: 9, level: 0.25 },
      { hz: 3900, q: 12, level: 0.1 },
    ],
    variance: 0.16,
  },

  // Grunts: short, low, mostly rasp, and the chaos is high because a pig is
  // almost never phonating cleanly.
  pig: {
    f0: [190, 118],
    onset: 0.7,
    syllables: [2, 3],
    length: [0.16, 0.26],
    gap: [0.18, 0.32],
    attack: 0.1,
    effort: 0.8,
    rasp: 0.55,
    burst: 0.4,
    chaos: 0.7,
    jitter: 60,
    open: [
      { hz: 560, q: 4.5, level: 1 },
      { hz: 1250, q: 6, level: 0.45 },
      { hz: 2500, q: 9, level: 0.14 },
    ],
    close: [
      { hz: 460, q: 4.5, level: 0.7 },
      { hz: 1100, q: 6, level: 0.25 },
      { hz: 2300, q: 9, level: 0.08 },
    ],
    variance: 0.14,
  },

  // The scream: a rising, unstable, torn note. Almost pure nonlinearity, which
  // is exactly why it is unsettling.
  fox: {
    f0: [780, 900],
    onset: 0.45,
    syllables: [2, 4],
    length: [0.35, 0.55],
    gap: [0.5, 1.4],
    attack: 0.18,
    effort: 1,
    rasp: 0.4,
    burst: 0.25,
    chaos: 0.85,
    jitter: 90,
    open: [
      { hz: 1100, q: 5, level: 1 },
      { hz: 2100, q: 7, level: 0.5 },
      { hz: 3400, q: 10, level: 0.2 },
    ],
    close: [
      { hz: 1400, q: 5, level: 0.8 },
      { hz: 2400, q: 7, level: 0.35 },
      { hz: 3800, q: 10, level: 0.12 },
    ],
    variance: 0.12,
  },

  // The longest tract in the table, driven to the edge. It is a roar because
  // the chaos is high and the formants are very low, not because it is loud.
  stag: {
    f0: [140, 90],
    onset: 0.6,
    syllables: [1, 2],
    length: [0.9, 1.6],
    gap: [0.6, 1.2],
    attack: 0.16,
    effort: 1,
    rasp: 0.45,
    burst: 0.15,
    chaos: 0.8,
    jitter: 35,
    open: [
      { hz: 300, q: 4.5, level: 1 },
      { hz: 620, q: 6, level: 0.6 },
      { hz: 1500, q: 9, level: 0.2 },
    ],
    close: [
      { hz: 250, q: 4.5, level: 0.85 },
      { hz: 540, q: 6, level: 0.32 },
      { hz: 1300, q: 9, level: 0.1 },
    ],
    variance: 0.09,
  },
};

export type Creature = keyof typeof CALLS;

export interface BeastOptions {
  kind?: Creature;
  gain?: number;
  /**
   * Size, as a multiplier on the whole tract. Below 1 is a **bigger** animal:
   * resonances and pitch both fall as the tract lengthens, so one number moves
   * a terrier to a mastiff.
   */
  tone?: number;
  /** Extra rasp on top of what the kind already has. */
  rasp?: number;
  /** Extra roughness on top of what the kind already has, 0..1. */
  chaos?: number;
  /**
   * How much the body varies between one animal and the next, as multipliers
   * on `tone`. Drawn per call, so one entry is a herd rather than a specimen —
   * size is the difference the ear uses first, and it moves the tract and the
   * pitch together.
   */
  size?: readonly [number, number];
}

/** Soft saturation. See the file header, point 1. */
const CURVE = (() => {
  const points = 2048;
  const curve = new Float32Array(points);
  const k = 2.6;
  for (let i = 0; i < points; i++) {
    const x = (i / (points - 1)) * 2 - 1;
    curve[i] = Math.tanh(x * k) / Math.tanh(k);
  }
  return curve;
})();

function between(range: readonly [number, number]): number {
  return range[0] + Math.random() * (range[1] - range[0]);
}

function scale(formants: readonly Formant[], tone: number): Formant[] {
  return formants.map((formant) => ({ ...formant, hz: formant.hz * tone }));
}

export function createBeast(engine: AudioEngine, options: BeastOptions = {}): OneShot {
  const context = engine.context;
  const noise = engine.noise;
  if (!noise) throw new Error('beast built before the noise buffers were ready');

  const call = CALLS[options.kind ?? 'dog'];
  const tone = options.tone ?? 1;
  const rasp = Math.min(1, (options.rasp ?? 0) + call.rasp);
  const chaos = Math.min(1, (options.chaos ?? 0) + call.chaos);

  const output = context.createGain();
  output.gain.value = options.gain ?? 0.6;

  const spread = options.size;
  // Shaped per call rather than per throat: baking the size in is what forces
  // a second entry for every size of the same animal.
  let open = scale(call.open, tone);
  let close = scale(call.close, tone);
  const bank = createFormantBank(context, open, output);

  // The larynx. Everything voiced goes through the curve; breath and the
  // release burst go round it, straight into the tract, because neither of
  // them is the folds vibrating.
  const folds = context.createWaveShaper();
  folds.curve = CURVE;
  folds.oversample = '2x';
  folds.connect(bank.input);

  const pendingNodes: AudioNode[] = [];
  let sweep = 0;

  const syllable = (at: number, length: number, force: number, pitch: number): void => {
    const rise = Math.max(length * call.attack, 0.002);
    const release = Math.max(0.02, length * 0.28);
    const end = at + length + release * 3;
    const peak = pitch;
    const start = peak * call.onset;
    const fall = Math.max(peak * (call.f0[1] / call.f0[0]), 20);

    // --- the release burst -------------------------------------------------
    // Broadband, unvoiced, and over in a couple of milliseconds. It is the
    // difference between a bark and a note that faded in.
    if (call.burst > 0.02) {
      excite(context, noise.white, bank.input, at, force * call.burst * 0.7, 0.006, 0.0004);
    }

    // --- the folds ---------------------------------------------------------
    const osc = context.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(start, at);
    osc.frequency.exponentialRampToValueAtTime(peak, at + rise);
    osc.frequency.exponentialRampToValueAtTime(fall, at + length);

    // Period doubling: an octave below, coming in only where the drive is
    // hardest. This is the roughness that says the sound came out of a body.
    const sub = context.createOscillator();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(start * 0.5, at);
    sub.frequency.exponentialRampToValueAtTime(peak * 0.5, at + rise);
    sub.frequency.exponentialRampToValueAtTime(fall * 0.5, at + length);
    const subGain = context.createGain();
    subGain.gain.setValueAtTime(0, at);
    subGain.gain.linearRampToValueAtTime(chaos * 0.5 * force, at + rise * 1.6);
    subGain.gain.linearRampToValueAtTime(0, at + length);

    // Jitter, as a slow random walk on the detune. Nothing alive holds a note.
    if (call.jitter > 1) {
      const wander = context.createBufferSource();
      wander.buffer = noise.brown;
      wander.playbackRate.value = 0.02 + Math.random() * 0.03;
      const depth = context.createGain();
      depth.gain.value = call.jitter;
      wander.connect(depth);
      depth.connect(osc.detune);
      depth.connect(sub.detune);
      wander.start(at, Math.random() * Math.max(noise.brown.duration - 2, 0));
      wander.stop(end);
      pendingNodes.push(depth);
    }

    let lfo: OscillatorNode | null = null;
    if (call.vibrato) {
      lfo = context.createOscillator();
      lfo.frequency.value = call.vibrato.hz * (0.85 + Math.random() * 0.3);
      const depth = context.createGain();
      // Cents, so the wobble stays constant in pitch as the note descends.
      depth.gain.value = call.vibrato.cents;
      lfo.connect(depth);
      depth.connect(osc.detune);
      depth.connect(sub.detune);
      lfo.start(at);
      pendingNodes.push(depth);
    }

    // **Before the curve.** Effort decides brightness and level together,
    // because in a real larynx they are the same variable.
    const drive = context.createGain();
    const blown = force * (0.25 + call.effort * 1.5);
    drive.gain.setValueAtTime(0, at);
    drive.gain.linearRampToValueAtTime(blown, at + rise);
    drive.gain.linearRampToValueAtTime(blown * 0.55, at + length - release);
    drive.gain.setTargetAtTime(0, at + length - release, release / 3);
    osc.connect(drive);
    sub.connect(subGain).connect(drive);
    drive.connect(folds);

    osc.start(at);
    sub.start(at);
    osc.stop(end);
    sub.stop(end);
    lfo?.stop(end);

    // Breath, round the folds and through the same tract: it is air past the
    // throat, not the throat itself.
    if (rasp > 0.01) {
      const breath = context.createBufferSource();
      breath.buffer = noise.white;
      breath.playbackRate.value = 0.8 + Math.random() * 0.5;
      const raspGain = context.createGain();
      raspGain.gain.setValueAtTime(0, at);
      raspGain.gain.linearRampToValueAtTime(rasp * 0.45 * force, at + rise);
      raspGain.gain.linearRampToValueAtTime(0, at + length);
      breath.connect(raspGain).connect(bank.input);
      breath.start(at, Math.random() * Math.max(noise.white.duration - 2, 0));
      breath.stop(end);
      pendingNodes.push(raspGain);
    }

    pendingNodes.push(drive, subGain);
    sweep = Math.max(sweep, end);

    // The mouth opens and shuts, and it starts closing well before the end —
    // which is why the second half of a bark is duller than the first, and why
    // holding one shape sounds like a machine.
    bank.shape(open, at, rise);
    bank.shape(close, at + length * 0.5, length * 0.5);
  };

  let cleanup = 0;
  const syllables: { at: number; length: number }[] = [];

  return {
    output,
    syllables,

    fire(at, force) {
      sweep = at;
      const count = Math.round(between(call.syllables));
      // One animal, drawn now. Tract and pitch move together, because that is
      // what size is; nothing changes size between syllables.
      const body = tone * (spread ? between(spread) : 1);
      open = scale(call.open, body);
      close = scale(call.close, body);
      const pitch = call.f0[0] * body * (1 + (Math.random() * 2 - 1) * call.variance);

      let cursor = at;
      syllables.length = 0;
      for (let i = 0; i < count; i++) {
        const length = between(call.length);
        // Later syllables lose energy. A dog's first bark is its loudest.
        syllable(cursor, length, force * Math.pow(0.86, i) * (0.85 + Math.random() * 0.3), pitch);
        syllables.push({ at: cursor, length });
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
      folds.disconnect();
      bank.dispose();
      output.disconnect();
    },
  };
}
