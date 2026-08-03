/**
 * Bubbles — the entire sound of water, near enough.
 *
 * Water itself is silent. What you hear when a tap runs, a drip lands, a brook
 * moves over stones or somebody pours a bucket is **air**: bubbles entrained by
 * the disturbance, each one oscillating at a frequency set by nothing but its
 * radius. Minnaert worked this out in 1933 and it is startlingly simple —
 *
 * ```
 *   f₀ ≈ 3.26 / r        (hertz, r in metres)
 * ```
 *
 * — so a one-millimetre bubble sings at 3.3 kHz and a five-millimetre one at
 * 650 Hz. Build a distribution of radii and you have built a body of water: fine
 * bubbles are spray and rain, coarse ones are a deep pour, a mixture is a
 * stream. Nothing else in this library gets so much from one number.
 *
 * ## The rising pitch is the model
 *
 * Every bubble's pitch **goes up** as it rings out. The oscillation loses
 * energy, the bubble rises and shrinks, and the frequency climbs with it. This
 * is the detail that matters more than any other: a decaying sine at a constant
 * pitch is a *blip*, a synthesiser artefact, immediately artificial. The same
 * sine rising twenty or thirty percent across its short life is unmistakably
 * water, and most people cannot say why.
 *
 * van den Doel's model has the frequency rising linearly in time with the
 * damping — `f(t) = f₀(1 + ξ β₀ t)` for a small ξ around 0.1. Here that is
 * expressed as `rise`, the fractional climb over the ring-down, because it is
 * the same shape with a control anyone can hear the effect of.
 *
 * ## Damping
 *
 * Two ways, and which one you want depends on how wide a range of sizes is in
 * play at once.
 *
 * **Cycles** is the approximation: hold the number of oscillations constant and
 * let the seconds fall out of the pitch. Over a narrow band that is very nearly
 * right and it is the parameter that stays put when the radii move.
 *
 * **`damping`** is the physics, and across a wide distribution the difference
 * is not subtle. van den Doel gives the coefficient as
 *
 * ```
 *   d(f) = 0.043 f + 0.0014 f^(3/2)
 * ```
 *
 * which works out to `1 / (0.043 + 0.0014 sqrt(f))` cycles — **17.5 of them at
 * 100 Hz and 4.1 at 20 kHz.** A splash spans five octaves, so holding cycles
 * constant across one makes the spray hang far too long and the gloops die far
 * too fast, and the cloud comes out flat. Letting the top end evaporate while
 * the bottom rings on is most of what makes a body of water sound layered
 * rather than uniform.
 *
 * The multiplier is the medium: 1 is water, and higher is more viscous. Mud at
 * four barely rings at all, which is exactly right — a bubble in mud goes
 * *blup*, it does not sing.
 *
 * ## Cost
 *
 * One oscillator and one gain per bubble, both self-terminating. This is the
 * cheapest event in the library by some distance, which is fortunate, because
 * convincing water needs a lot of them.
 */

/** Minnaert resonance. `r` in metres. */
export function bubbleHz(radius: number): number {
  return 3.26 / Math.max(radius, 5e-5);
}

export interface Bubble {
  /**
   * Radius in metres.
   *
   * 0.3 mm is spray, 1 mm a raindrop's entrained air, 3 mm a drip into a pool,
   * 8 mm the bottom of a pour, 5 cm the cavity behind something entering water.
   * Below about 0.1 mm you are above hearing.
   */
  radius: number;
  level: number;
  /**
   * Viscous damping relative to water. See the note above.
   *
   * Set this and the ring-down is derived from the frequency the way the
   * physics says, rather than from a fixed cycle count. 1 is water; 4 is thick
   * mud, where a bubble is a *blup* rather than a note.
   */
  damping?: number;
  /** Oscillations before it is gone. Ignored when `damping` is set. */
  cycles?: number;
  /**
   * Fractional pitch climb across the ring-down. See the note above — this is
   * the difference between water and a blip, and zero is audibly wrong.
   */
  rise?: number;
}

const CYCLES = 20;
const RISE = 0.28;

/**
 * van den Doel's damping coefficient, in inverse seconds. See the note above.
 *
 * Superlinear in frequency, which is the whole point: a 20 kHz spray bubble is
 * gone in a third of a millisecond and a 60 Hz cavity rings for a quarter of a
 * second, and no constant cycle count covers both.
 */
export function dampingFor(hz: number): number {
  return 0.043 * hz + 0.0014 * Math.pow(hz, 1.5);
}

/**
 * Schedules one bubble.
 *
 * @param at Audio-clock time. In the future; this schedules, it does not play.
 * @returns How long it lasts, in seconds.
 */
export function popBubble(
  context: BaseAudioContext,
  target: AudioNode,
  at: number,
  bubble: Bubble,
): number {
  const hz = bubbleHz(bubble.radius);
  const rise = bubble.rise ?? RISE;
  const decay =
    bubble.damping === undefined
      ? (bubble.cycles ?? CYCLES) / hz
      : 1 / (dampingFor(hz) * bubble.damping);

  const osc = context.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(hz, at);
  // Linear in time, following the model, rather than exponential. The climb is
  // small enough that the difference between the two is inaudible, and linear
  // is what the physics says.
  osc.frequency.linearRampToValueAtTime(hz * (1 + rise), at + decay);

  const envelope = context.createGain();
  // No attack ramp at all: a bubble's oscillation begins at full amplitude the
  // instant the surface breaks, and any rise time on it reads as a swell rather
  // than an event. It is safe here only because the waveform starts at zero
  // phase, so there is nothing to click.
  envelope.gain.setValueAtTime(bubble.level, at);
  envelope.gain.exponentialRampToValueAtTime(bubble.level * 0.001, at + decay);

  osc.connect(envelope).connect(target);
  osc.start(at);
  osc.stop(at + decay + 0.01);

  return decay;
}

/**
 * A radius drawn from a distribution, in metres.
 *
 * **Log-uniform, not uniform.** Radius maps to frequency as 1/r, so a uniform
 * draw between two radii piles almost every bubble into the bottom octave of
 * the resulting pitch range and leaves the top of it nearly empty. Drawing
 * uniformly in the log spreads them evenly across pitch, which is where the ear
 * is doing its counting.
 */
export function bubbleRadius(min: number, max: number, bias = 0): number {
  // **A real population is not flat across pitch either.** Splash measurements
  // put the radius distribution on a power law with far more small bubbles than
  // large, and log-uniform draws — equal numbers per octave — leave a cloud
  // sounding evenly spread in a way no water is. Raising the variate to a power
  // skews the draw toward the fine end while keeping the bounds exact, and one
  // number says how hard.
  const u = bias > 0 ? Math.pow(Math.random(), 1 + bias * 2) : Math.random();
  return min * Math.pow(max / min, u);
}
