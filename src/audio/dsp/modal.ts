/**
 * Modal resonance — what tells you what a thing is made of.
 *
 * Strike any solid object and it rings at a set of frequencies fixed by its
 * shape and material, each dying away at its own rate. That set *is* the
 * object's identity: wood is low and hollow and gone quickly, stone is dead,
 * iron is bright and inharmonic and rings for half a second. Model it as
 * parallel bandpass filters excited together by one impulse and you get an
 * object rather than a noise.
 *
 * Extracted from `footsteps.ts` and `door.ts`, which built this twice and
 * disagreed about it. The disagreement is documented below because both halves
 * of it are easy to get wrong and expensive to diagnose by ear.
 *
 * ## Where the ring-down lives
 *
 * A two-pole resonator's decay follows from its Q, so you can spend a mode's
 * decay time in one of two places, and they sound different:
 *
 * - `'filter'` — derive Q from the decay and let the filter ring. Physically
 *   the honest one, and correct for short decays.
 * - `'excitation'` — hold Q moderate and put the decay in the envelope driving
 *   the filter. Necessary for *long* decays, because a resonator sharp enough
 *   to ring for 150 ms at 200 Hz needs a Q above 120, and at that Q a bandpass
 *   passes a slice a few hertz wide: a sine wave with a rumour of noise in it,
 *   with no timbre left to identify the material by.
 *
 * Rule of thumb: `π · f · decay` above about 40 means you want `'excitation'`.
 *
 * ## Gain compensation
 *
 * Web Audio's bandpass is normalised to **0 dB at the centre frequency
 * whatever its Q**. That is a statement about a sustained sine. Fed broadband
 * excitation — which is what an impact is — the energy that gets through is
 * proportional to the bandwidth, so it falls as Q rises, and amplitude falls
 * as `1/sqrt(Q)`. Compensating therefore means multiplying **by** `sqrt(Q)`,
 * so that a mode's `level` means what it says at any sharpness.
 *
 * Getting this backwards makes the sharpest modes the quietest, which is
 * precisely inverted from the physics and reads as "the bright materials
 * aren't working". `footsteps.ts` still has it backwards; see `compensation`.
 */

export interface Mode {
  hz: number;
  /** Ring-down in seconds. Where it is spent depends on `ring`. */
  decay: number;
  level: number;
  /** Overrides the derived Q. Rarely wanted; the derivation is usually right. */
  q?: number;
}

export interface ModalOptions {
  /** See the note above. Defaults to `'excitation'` — the safer of the two. */
  ring?: 'filter' | 'excitation';
  /**
   * How `level` is corrected for the filter's bandwidth.
   *
   * `'energy'` is correct: multiply by `sqrt(Q)`. `'inverse'` divides instead,
   * which is backwards — it exists only so `footsteps.ts` can be moved onto
   * this bank without changing how a single surface sounds, because its
   * `SURFACES` table was tuned by ear against the wrong curve. Re-tuning that
   * table is an audible change and belongs in its own commit, not smuggled
   * into a refactor.
   */
  compensation?: 'energy' | 'inverse';
  /** Ceiling on derived Q. Above ~120 a bandpass stops having a timbre. */
  maxQ?: number;
}

export interface ModalBank {
  /**
   * One input per mode, in the order given.
   *
   * Excite them *together* from a single impulse — that is what makes it one
   * object being struck rather than several objects being struck at once.
   */
  readonly inputs: GainNode[];
  readonly modes: readonly Mode[];
  /** The Q each mode actually ended up with, for the debug readout. */
  readonly qs: readonly number[];
  dispose(): void;
}

/** Q that rings for `decay` seconds at `hz`. */
export function qForDecay(hz: number, decay: number): number {
  return Math.PI * hz * decay;
}

export function createModalBank(
  context: BaseAudioContext,
  modes: readonly Mode[],
  destination: AudioNode,
  options: ModalOptions = {},
): ModalBank {
  const ring = options.ring ?? 'excitation';
  const compensation = options.compensation ?? 'energy';
  // 220 is the historical value from `footsteps.ts`. It is far too high to
  // keep a timbre, which is exactly why `'excitation'` exists — but raising
  // the default ceiling for `'filter'` mode would change existing sounds.
  const maxQ = options.maxQ ?? (ring === 'filter' ? 220 : 14);

  const nodes: AudioNode[] = [];
  const qs: number[] = [];

  const inputs = modes.map((mode) => {
    const input = context.createGain();

    const filter = context.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = mode.hz;

    const q =
      mode.q ??
      (ring === 'filter'
        ? Math.min(maxQ, Math.max(1, qForDecay(mode.hz, mode.decay)))
        : // In excitation mode Q is colour, not pitch: enough to say "this
          // frequency matters" and wide enough to still carry noise. Scaled
          // gently with the decay so longer modes are a little more focused.
          Math.min(maxQ, Math.max(4, 4 + mode.decay * 24)));
    filter.Q.value = q;
    qs.push(q);

    const trim = context.createGain();
    trim.gain.value = compensation === 'energy' ? Math.sqrt(q) : 1 / Math.sqrt(q);

    input.connect(filter).connect(trim).connect(destination);
    nodes.push(input, filter, trim);
    return input;
  });

  return {
    inputs,
    modes,
    qs,
    dispose() {
      for (const node of nodes) node.disconnect();
    },
  };
}
