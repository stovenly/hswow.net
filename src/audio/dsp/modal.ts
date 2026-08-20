/**
 * Modal resonance: parallel bandpasses excited together by one impulse. The
 * set of frequencies and their decay rates *is* the material — wood is low and
 * hollow and gone quickly, stone is dead, iron is bright and inharmonic.
 *
 * A mode's decay can live in the filter's Q or in the envelope driving it.
 * Above about `pi * f * decay = 40` use `'excitation'`: a resonator sharp
 * enough to ring 150 ms at 200 Hz needs Q over 120, and at that Q a bandpass
 * passes a slice a few hertz wide, with no timbre left to identify by.
 *
 * Web Audio's bandpass is 0 dB at centre whatever its Q, but that is a
 * statement about a sustained sine. Fed broadband excitation it passes energy
 * proportional to bandwidth, so amplitude falls as `1/sqrt(Q)` and
 * compensating means multiplying **by** `sqrt(Q)`.
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
   * How `level` is corrected for the filter's bandwidth. `'energy'` multiplies
   * by `sqrt(Q)` and is the correct one. `'inverse'` divides instead, and
   * exists only because `footsteps.ts`'s `SURFACES` table was tuned by ear
   * against the wrong curve; re-tuning that table is an audible change.
   */
  compensation?: 'energy' | 'inverse';
  /** Ceiling on derived Q. Above ~120 a bandpass stops having a timbre. */
  maxQ?: number;
}

export interface ModalBank {
  /**
   * One input per mode, in the order given. Excite them *together* from a
   * single impulse — that is what makes it one object being struck.
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

/**
 * The Q a mode ends up with under a set of options. In excitation mode Q is
 * colour rather than pitch: enough to say the frequency matters, wide enough
 * to still carry noise, scaled gently with the decay.
 */
export function derivedQ(mode: Mode, options: ModalOptions = {}): number {
  if (mode.q !== undefined) return mode.q;
  const ring = options.ring ?? 'excitation';
  const maxQ = options.maxQ ?? (ring === 'filter' ? 220 : 14);
  return ring === 'filter'
    ? Math.min(maxQ, Math.max(1, qForDecay(mode.hz, mode.decay)))
    : Math.min(maxQ, Math.max(4, 4 + mode.decay * 24));
}

/** How `level` is scaled for the filter's bandwidth. See `compensation`. */
export function trimFor(q: number, compensation: ModalOptions['compensation']): number {
  return compensation === 'inverse' ? 1 / Math.sqrt(q) : Math.sqrt(q);
}

export function createModalBank(
  context: BaseAudioContext,
  modes: readonly Mode[],
  destination: AudioNode,
  options: ModalOptions = {},
): ModalBank {
  const compensation = options.compensation ?? 'energy';

  const nodes: AudioNode[] = [];
  const qs: number[] = [];

  const inputs = modes.map((mode) => {
    const input = context.createGain();

    const filter = context.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = mode.hz;

    const q = derivedQ(mode, options);
    filter.Q.value = q;
    qs.push(q);

    const trim = context.createGain();
    trim.gain.value = trimFor(q, compensation);

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
