/**
 * Formants — the shape of the thing making the sound.
 *
 * Source-filter, which is the oldest idea in speech synthesis and still the
 * right one: a voice is a **source** with a pitch (vocal folds opening and
 * closing) passed through a **filter** with fixed resonances (the throat, mouth
 * and nose above them). The source carries pitch and effort. The filter carries
 * identity — species, size, and which vowel it is.
 *
 * The two are genuinely independent, and that is what makes this worth having.
 * Change the source and the same creature says the same thing higher or more
 * urgently; change the filter and a different creature says something else at
 * the same pitch. Nothing else in this library separates *who* from *what* so
 * cleanly.
 *
 * ## What a formant is, in nodes
 *
 * A parallel bandpass per resonance, summed. Three is enough to be recognisable,
 * four or five to be convincing. Q comes from the resonance's bandwidth —
 * `Q = hz / bandwidth` — and real vocal-tract bandwidths are 60–170 Hz, so the
 * Qs here are modest by the standards of `modal.ts` and the filters do not ring
 * on their own. They are colouring a source that is already there, not being
 * struck.
 *
 * ## A note on gain
 *
 * There is deliberately **no `sqrt(Q)` compensation** here, unlike `modal.ts`.
 * That correction exists because a bandpass fed *broadband* energy passes an
 * amount proportional to its bandwidth. A voiced source is not broadband — it is
 * a harmonic series, and what matters is the gain at the harmonics near the
 * centre, which Web Audio normalises to 0 dB whatever the Q. So `level` means
 * what it says for the voiced path.
 *
 * The consequence, and it is the right one: a noise component pushed through the
 * same bank comes out quieter than the voiced one at the same nominal level.
 * Breath and rasp *are* quieter than voice. Left alone.
 */

export interface Formant {
  hz: number;
  /**
   * Sharpness. `hz / bandwidth`, and vocal bandwidths run 60–170 Hz, so this
   * is usually 5–20. Higher reads as a longer, narrower, more resonant throat.
   */
  q: number;
  /**
   * Relative level. Conventionally the first formant is 1 and each one above it
   * is roughly 6 dB down, because the source spectrum itself falls with
   * frequency and the upper resonances have less to work with.
   */
  level: number;
}

export interface FormantBank {
  /** Feed the source in here. Voiced, noisy, or both. */
  readonly input: GainNode;
  /**
   * Moves the resonances.
   *
   * **Vowels are transitions, not states.** A held formant shape reads as a
   * synthesiser; a shape that moves across the length of a syllable reads as a
   * mouth. Frequencies glide exponentially because pitch is perceived
   * logarithmically, levels linearly because loudness is not.
   *
   * The ramp runs from the **previously scheduled** shape, not from wherever
   * the filter happens to be when this is called. Events are queued ahead of
   * the audio clock, so "wherever it is now" is a value from the past, and
   * pinning to it makes a chain of syllables jump backwards between each one.
   *
   * @param over Seconds to arrive. Zero jumps.
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
        // A bank asked for a shape with fewer formants than it has keeps the
        // extras where they are rather than collapsing them to zero — which
        // would be a click, and a shape with a hole in it.
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
        // Q is stepped rather than glided. It is a second-order property of the
        // shape and moving it costs a coefficient recalculation per quantum for
        // something nobody has ever heard.
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
 * Vowel shapes, from the standard measured formant tables for an adult male
 * tract.
 *
 * Here for crowd walla and for anything that has to sound like it is *saying*
 * something. Animal calls do not use these directly — a dog's tract is a
 * different length and shape — but they are the reference the animal tables
 * below were derived from, and it is worth being able to see the difference.
 *
 * The classic identifier is F1 against F2: F1 tracks how open the mouth is and
 * F2 how far forward the tongue is. /i/ and /u/ have nearly the same F1 and
 * F2s an octave and a half apart, which is why they are impossible to confuse
 * and why a bank with only F1 cannot tell them apart at all.
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
