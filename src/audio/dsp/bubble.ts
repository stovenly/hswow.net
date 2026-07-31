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
 * Expressed in **cycles** rather than seconds. The literature's damping
 * coefficient is frequency dependent in a way that works out, across the range
 * of radii that actually occur in water, to a roughly constant number of
 * oscillations — a fine spray bubble rings for a couple of milliseconds and a
 * fat one for forty, and both do it for a comparable count. Cycles is therefore
 * the parameter that stays put when the radius distribution changes, which is
 * the whole point of having one.
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
   * 8 mm the bottom of a pour. Below about 0.1 mm you are above hearing.
   */
  radius: number;
  level: number;
  /** Oscillations before it is gone. 12–30 is the useful range. */
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
  const cycles = bubble.cycles ?? CYCLES;
  const rise = bubble.rise ?? RISE;
  const decay = cycles / hz;

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
export function bubbleRadius(min: number, max: number): number {
  return min * Math.pow(max / min, Math.random());
}
