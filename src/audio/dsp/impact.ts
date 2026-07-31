/**
 * Excitation — the thing that happens *to* an object, as opposed to the object.
 *
 * Modal banks, waveguides and resonant bodies all need feeding, and what they
 * want is a short burst of broadband energy: an impulse. A mathematically
 * perfect impulse is a click with infinite bandwidth and no character, so what
 * is actually used everywhere is a very short window of noise, which is
 * broadband enough to wake every mode and has a length and a spectrum of its
 * own that carry information.
 *
 * **The length of the excitation is the softness of the contact.** A steel ball
 * on stone is a couple of milliseconds; a boot on stone is five or six, because
 * the sole deforms and spreads the contact out; a boot on mud is fifty. Same
 * resonator, wildly different event. This is usually a more powerful control
 * than anything in the resonator itself, and it is the one most often left at
 * a constant.
 *
 * Extracted from the `excite` closure in `footsteps.ts` and the click path in
 * `door.ts`.
 */

import { strike } from './envelopes';

/**
 * Fires one burst of noise into a target at a scheduled time.
 *
 * @param at Audio-clock time. Must be in the future; this schedules, it does
 *   not play.
 * @param duration Contact time in seconds. See the note above — this is the
 *   hardness control.
 */
export function excite(
  context: BaseAudioContext,
  noise: AudioBuffer,
  target: AudioNode,
  at: number,
  level: number,
  duration: number,
): void {
  if (level <= 0.0005) return;

  const source = context.createBufferSource();
  source.buffer = noise;

  const envelope = context.createGain();
  // The attack is capped as well as scaled: below about a millisecond the ramp
  // is short enough to be a click in its own right, and above it the burst
  // stops being an impulse and starts being a note.
  strike(envelope.gain, at, level, Math.min(0.0012, duration * 0.3), duration * 1.6);

  source.connect(envelope).connect(target);
  // A random offset into the buffer, so a hundred impacts are a hundred
  // different noises rather than the same click a hundred times. Without this
  // repeated strikes phase together and start to sound sampled.
  source.start(at, Math.random() * Math.max(noise.duration - 0.5, 0), duration + 0.05);
  source.stop(at + duration + 0.06);
}

/**
 * A tonal thump: a sine falling in pitch, felt more than heard.
 *
 * The weight of a thing. Modal banks carry material and excitation carries
 * contact, but neither carries *mass* — for that you need energy below where
 * the resonators live, and a short falling sine is how impacts are described
 * everywhere from foley practice to automotive door engineering.
 *
 * Extracted from `door.ts`, where it is what makes an iron door feel heavy
 * rather than merely sound bright.
 */
export function thump(
  context: BaseAudioContext,
  target: AudioNode,
  at: number,
  level: number,
  from: number,
  to: number,
  decay: number,
  /**
   * Rise time. Longer than it looks like it should be, on purpose.
   *
   * Down at 60–150 Hz a single cycle lasts 7–17 ms, so a 2 ms attack is a
   * meaningful fraction of one and reads as a click on the front of the
   * weight. Heavier things want more.
   */
  attack = 0.002,
): void {
  if (level <= 0.0005) return;

  const osc = context.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(from, at);
  // Exponential rather than linear: pitch is perceived logarithmically, and a
  // linear fall spends most of its time in the last few hertz.
  osc.frequency.exponentialRampToValueAtTime(Math.max(to, 1), at + decay);

  const envelope = context.createGain();
  strike(envelope.gain, at, level, attack, decay);

  osc.connect(envelope).connect(target);
  osc.start(at);
  osc.stop(at + decay * 3 + 0.06);
}
