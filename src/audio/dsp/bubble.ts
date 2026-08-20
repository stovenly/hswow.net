/**
 * Bubbles. Minnaert: f0 = 3.26 / r hertz, r in metres, so a 1 mm bubble sings
 * at 3.3 kHz and a 5 mm one at 650 Hz. Air entrained by a disturbance is what
 * water sounds like; the water itself is silent.
 *
 * The pitch *rises* across the ring-down as the bubble loses energy and
 * shrinks. A decaying sine at constant pitch is a blip, not water.
 */

/** Minnaert resonance. `r` in metres. */
export function bubbleHz(radius: number): number {
  return 3.26 / Math.max(radius, 5e-5);
}

export interface Bubble {
  /**
   * Radius in metres. 0.3 mm is spray, 1 mm a raindrop, 3 mm a drip into a
   * pool, 8 mm the bottom of a pour, 5 cm an entry cavity.
   */
  radius: number;
  level: number;
  /**
   * Viscous damping relative to water. Set it and the ring-down comes from the
   * frequency rather than a fixed cycle count. 1 is water, 4 is thick mud.
   */
  damping?: number;
  /** Oscillations before it is gone. Ignored when `damping` is set. */
  cycles?: number;
  /** Fractional pitch climb across the ring-down. Zero is audibly wrong. */
  rise?: number;
}

const CYCLES = 20;
const RISE = 0.28;

/**
 * van den Doel's damping coefficient, in inverse seconds. Superlinear in
 * frequency, so no constant cycle count covers a splash's five octaves.
 */
export function dampingFor(hz: number): number {
  return 0.043 * hz + 0.0014 * Math.pow(hz, 1.5);
}

/** Schedules one bubble at audio time `at`. Returns its length in seconds. */
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
  // Linear in time, following the model. The climb is small enough that linear
  // and exponential are indistinguishable.
  osc.frequency.linearRampToValueAtTime(hz * (1 + rise), at + decay);

  const envelope = context.createGain();
  // No attack ramp: a bubble is at full amplitude the instant the surface
  // breaks. Safe only because the waveform starts at zero phase.
  envelope.gain.setValueAtTime(bubble.level, at);
  envelope.gain.exponentialRampToValueAtTime(bubble.level * 0.001, at + decay);

  osc.connect(envelope).connect(target);
  osc.start(at);
  osc.stop(at + decay + 0.01);

  return decay;
}

/**
 * A radius in metres, drawn log-uniformly. Radius maps to frequency as 1/r, so
 * a uniform draw piles nearly every bubble into the bottom octave of pitch.
 */
export function bubbleRadius(min: number, max: number, bias = 0): number {
  // Skew toward the fine end (positive) or the coarse end (negative), bounds
  // kept exact. Negative is what a splash wants: measurement puts half a
  // puddle's energy between 900 Hz and 2 kHz and two per cent above 8.
  const skew = bias >= 0 ? 1 + bias * 2 : 1 / (1 - bias * 2);
  return min * Math.pow(max / min, Math.pow(Math.random(), skew));
}
