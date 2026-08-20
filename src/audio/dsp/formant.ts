/**
 * Source-filter: a source with a pitch, through parallel bandpasses summed.
 * The source carries pitch and effort, the filter carries identity — species,
 * size, and which vowel it is. Three resonances are recognisable, five
 * convincing. Vocal bandwidths are 60-170 Hz, so these filters do not ring on
 * their own the way modal ones do.
 *
 * No `sqrt(Q)` compensation here, unlike `modal.ts`: a voiced source is a
 * harmonic series rather than broadband, and Web Audio normalises a bandpass
 * to 0 dB at centre whatever the Q. A noise component through the same bank
 * therefore comes out quieter, which is correct — breath is quieter than voice.
 */

export interface Formant {
  hz: number;
  /**
   * Sharpness, `hz / bandwidth`. Vocal bandwidths run 60-170 Hz, so usually
   * 5-20. Higher reads as a longer, narrower, more resonant throat.
   */
  q: number;
  /**
   * Relative level. Conventionally F1 is 1 and each formant above it about
   * 6 dB down, because the source spectrum itself falls with frequency.
   */
  level: number;
}

export interface FormantBank {
  /** Feed the source in here. Voiced, noisy, or both. */
  readonly input: GainNode;
  /**
   * Moves the resonances, arriving `over` seconds later; zero jumps.
   * Frequencies glide exponentially, levels linearly.
   *
   * The ramp runs from the previously *scheduled* shape, not from wherever the
   * filter is now — events are queued ahead of the clock, so where it is now is
   * a value from the past, and a chain of syllables would jump backwards
   * between each one.
   */
  shape(next: readonly Formant[], at: number, over?: number): void;
  dispose(): void;
}

export function createFormantBank(
  context: BaseAudioContext,
  formants: readonly Formant[],
  destination: AudioNode,
): FormantBank {
  const input = context.createGain();

  const built = formants.map((formant) => {
    const filter = context.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = formant.hz;
    filter.Q.value = formant.q;

    const level = context.createGain();
    level.gain.value = formant.level;

    input.connect(filter).connect(level).connect(destination);
    return { filter, level };
  });

  /** The last shape scheduled, which is where the next ramp starts from. */
  const pending: Formant[] = formants.map((formant) => ({ ...formant }));

  return {
    input,

    shape(next, at, over = 0) {
      for (let i = 0; i < built.length; i++) {
        const target = next[i];
        // A shape with fewer formants than the bank has leaves the extras
        // where they are. Collapsing them to zero would be a click.
        if (!target) continue;
        const { filter, level } = built[i];

        if (over <= 0) {
          filter.frequency.setValueAtTime(target.hz, at);
          level.gain.setValueAtTime(target.level, at);
        } else {
          filter.frequency.setValueAtTime(pending[i].hz, at);
          filter.frequency.exponentialRampToValueAtTime(Math.max(target.hz, 20), at + over);
          level.gain.setValueAtTime(pending[i].level, at);
          level.gain.linearRampToValueAtTime(target.level, at + over);
        }
        // Q is stepped rather than glided: a coefficient recalculation per
        // quantum for a second-order property nobody has heard move.
        filter.Q.setValueAtTime(target.q, at);

        pending[i] = { ...target };
      }
    },

    dispose() {
      input.disconnect();
      for (const { filter, level } of built) {
        filter.disconnect();
        level.disconnect();
      }
    },
  };
}

/**
 * Vowel shapes from the measured formant tables for an adult male tract. F1
 * tracks how open the mouth is and F2 how far forward the tongue is, which is
 * why a bank with only F1 cannot tell /i/ from /u/ at all.
 */
export const VOWELS: Record<'a' | 'e' | 'i' | 'o' | 'u', readonly Formant[]> = {
  a: [
    { hz: 730, q: 8, level: 1 },
    { hz: 1090, q: 10, level: 0.5 },
    { hz: 2440, q: 14, level: 0.25 },
  ],
  e: [
    { hz: 530, q: 7, level: 1 },
    { hz: 1840, q: 12, level: 0.45 },
    { hz: 2480, q: 15, level: 0.22 },
  ],
  i: [
    { hz: 270, q: 5, level: 1 },
    { hz: 2290, q: 14, level: 0.4 },
    { hz: 3010, q: 17, level: 0.2 },
  ],
  o: [
    { hz: 570, q: 7, level: 1 },
    { hz: 840, q: 8, level: 0.55 },
    { hz: 2410, q: 15, level: 0.16 },
  ],
  u: [
    { hz: 300, q: 5, level: 1 },
    { hz: 870, q: 8, level: 0.4 },
    { hz: 2240, q: 14, level: 0.12 },
  ],
};
