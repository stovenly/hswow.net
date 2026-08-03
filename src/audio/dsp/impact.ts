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
  /**
   * Rise time in seconds. **This is the hardness control, and leaving it at a
   * constant is how everything ends up sounding like the same tap.**
   *
   * A millisecond is a strike: steel, stone, a resonator being rung. Thirty is
   * not a strike at all — it is a foot decelerating into snow or moss, where
   * nothing arrives suddenly because nothing stops suddenly. Between the two
   * the ear hears a completely different *event*, not a differently coloured
   * one, and no filtering downstream can convert one into the other.
   *
   * Defaults to the old behaviour: as fast as the duration allows, capped at
   * 1.2 ms, which is right for anything being genuinely struck.
   */
  attack?: number,
): void {
  if (level <= 0.0005) return;

  const source = context.createBufferSource();
  source.buffer = noise;

  const rise = Math.min(attack ?? Math.min(0.0012, duration * 0.3), duration * 2);

  const envelope = context.createGain();
  strike(envelope.gain, at, level, rise, duration * 1.6);

  source.connect(envelope).connect(target);

  // **The noise has to outlast the envelope, not match it.** `strike` ends in a
  // `setTargetAtTime` whose time constant is about half the duration, so a
  // window of `duration` cuts a long excitation while it is still a tenth up —
  // which for a modal bank driven in excitation mode is most of its ring. Two
  // and a half times over is four time constants, and by then it is silent.
  const window = rise + duration * 2.5 + 0.05;
  // A random offset into the buffer, so a hundred impacts are a hundred
  // different noises rather than the same click a hundred times. Without this
  // repeated strikes phase together and start to sound sampled.
  source.start(at, Math.random() * Math.max(noise.duration - window, 0), window);
  source.stop(at + window + 0.01);
}

/**
 * A material compressing under load, rather than being struck.
 *
 * The third gesture, and the one every impact model leaves out. An impact is
 * energy arriving and leaving — fast in, exponential out. Snow, moss, deep
 * earth, sand and mud do not do that: the foot keeps going after contact, and
 * the sound is the material *packing* over a tenth of a second. It swells
 * rather than decays, and it has no strike in it at all.
 *
 * Two things make it read as compression rather than as a long soft noise:
 *
 * - **The envelope rises.** A percussive envelope on this sounds like a muffled
 *   hit; a rise-and-fall sounds like weight going into something.
 * - **The band climbs.** As a granular material packs, the voids close and the
 *   noise it makes shifts up. That climb is snow's squeak — literally, crystals
 *   shearing against each other — and at a lower ratio it is the squish of moss
 *   and the suck of mud. Zero climb sounds like a filter sweep somebody forgot
 *   to set.
 */
export function crush(
  context: BaseAudioContext,
  noise: AudioBuffer,
  target: AudioNode,
  at: number,
  level: number,
  shape: {
    /** Seconds the material takes to pack. Tens of times an impact. */
    duration: number;
    /** Band centre at first contact, and where it has climbed to by the end. */
    from: number;
    to: number;
    /** Sharpness. Above about 4 the climb reads as a squeak. */
    q: number;
  },
): void {
  if (level <= 0.0005) return;

  const band = context.createBiquadFilter();
  band.type = 'bandpass';
  band.Q.value = shape.q;
  band.frequency.setValueAtTime(shape.from, at);
  band.frequency.linearRampToValueAtTime(shape.to, at + shape.duration);
  band.connect(target);

  const source = context.createBufferSource();
  source.buffer = noise;

  // Peaks part-way through rather than at the start: the load is still going
  // on. Cosine-free because a bandpass this narrow smooths the corners itself.
  const envelope = context.createGain();
  const peak = at + shape.duration * 0.45;
  envelope.gain.setValueAtTime(0, at);
  envelope.gain.linearRampToValueAtTime(level, peak);
  envelope.gain.setTargetAtTime(0, peak, shape.duration * 0.25);

  source.connect(envelope).connect(band);
  const window = shape.duration * 2.2 + 0.03;
  source.start(at, Math.random() * Math.max(noise.duration - window, 0), window);
  source.stop(at + window + 0.01);
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
