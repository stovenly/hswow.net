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
    /**
     * Whether the band is a window or a ceiling. Defaults to a window.
     *
     * **A swept bandpass is a whoosh, whatever envelope you put on it**, and no
     * amount of shaping turns one into a splash. A splash is *broadband* — it
     * starts with everything in it and loses the top first, because that is
     * where the energy dissipates fastest. That is a lowpass falling, not a
     * window moving, and the two are not interchangeable however similar the
     * numbers look.
     *
     * Granular packing genuinely is a window: the voids are a size, and they
     * close. Liquid displacement is not.
     */
    band?: 'window' | 'ceiling';
    /**
     * Where the peak sits, as a fraction of the duration. Defaults to 0.45.
     *
     * **This is the difference between a swell and a burst**, and it is what
     * separates a foot sinking into snow from a foot going into water. Packing
     * builds while the load goes on, so it peaks near the middle; a liquid is
     * displaced almost at once and then takes a long time to fall back, so it
     * peaks in the first tenth and the rest is tail.
     */
    rise?: number;
    /**
     * How irregular the flow is, 0..1. Defaults to smooth.
     *
     * **A smooth envelope over a smooth sweep is the sound of a synthesiser**,
     * and it is why filtered noise so reliably reads as static or as cloth. Real
     * flow does not decay evenly: it surges and catches, and both the level and
     * the spectrum wander while it does. A handful of irregular waypoints on
     * each is the difference between a filter sweep and something moving.
     *
     * Wanted most by anything thick — mud, a bog, a leg dragging through water.
     * Left at zero for granular packing, which really is smooth.
     */
    rough?: number;
  },
): void {
  if (level <= 0.0005) return;

  const fraction = shape.rise ?? 0.45;
  const rough = shape.rough ?? 0;
  const peak = at + shape.duration * fraction;
  const fall = shape.duration * (1 - fraction);
  const tau = fall * 0.55;
  // Enough to read as unsteady, few enough that each is a surge rather than a
  // flutter. Above about eight this turns into tremolo.
  const STEPS = 6;

  const band = context.createBiquadFilter();
  band.type = shape.band === 'ceiling' ? 'lowpass' : 'bandpass';
  band.Q.value = shape.q;
  band.frequency.setValueAtTime(shape.from, at);
  if (rough > 0) {
    // The sweep wanders on its way rather than travelling in a straight line,
    // which is what turns a glide into a gurgle.
    for (let i = 1; i <= STEPS; i++) {
      const t = i / STEPS;
      const along = shape.from + (shape.to - shape.from) * t;
      const wander = 1 + rough * 0.5 * (Math.random() * 2 - 1);
      band.frequency.linearRampToValueAtTime(
        Math.max(30, along * (i === STEPS ? 1 : wander)),
        at + shape.duration * t,
      );
    }
  } else {
    band.frequency.linearRampToValueAtTime(shape.to, at + shape.duration);
  }
  band.connect(target);

  const source = context.createBufferSource();
  source.buffer = noise;

  // Peaks part-way through rather than at the start — see `rise`. Cosine-free
  // because a bandpass this narrow smooths the corners itself.
  const envelope = context.createGain();
  envelope.gain.setValueAtTime(0, at);
  envelope.gain.linearRampToValueAtTime(level, peak);
  // The fall is what is left of the duration, so an early peak buys a long
  // tail rather than an abrupt stop.
  if (rough > 0) {
    let t = peak;
    for (let i = 1; i <= STEPS; i++) {
      t = peak + (fall * i) / STEPS;
      const settled = level * Math.exp(-(t - peak) / tau);
      envelope.gain.linearRampToValueAtTime(settled * (1 - rough + rough * Math.random()), t);
    }
    envelope.gain.setTargetAtTime(0, t, tau * 0.5);
  } else {
    envelope.gain.setTargetAtTime(0, peak, tau);
  }

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
