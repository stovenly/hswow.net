/**
 * Excitation — what happens *to* an object, as opposed to the object. A very
 * short window of noise, broadband enough to wake every mode.
 *
 * Its length is the softness of the contact: a couple of milliseconds for
 * steel on stone, five or six for a boot, fifty for a boot in mud. Same
 * resonator, wildly different event.
 */

import { strike } from './envelopes';

/**
 * Fires one burst of noise into a target. `at` is audio-clock time and must be
 * in the future; `duration` is the contact time in seconds.
 */
export function excite(
  context: BaseAudioContext,
  noise: AudioBuffer,
  target: AudioNode,
  at: number,
  level: number,
  duration: number,
  /**
   * Rise time in seconds. A millisecond is a strike; thirty is a foot
   * decelerating into snow, and no filtering downstream converts one into the
   * other. Defaults to as fast as the duration allows, capped at 1.2 ms.
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

  // The noise outlasts the envelope rather than matching it: `strike` ends in
  // a `setTargetAtTime` whose constant is about half the duration, so two and
  // a half times over is four constants and by then it is silent.
  const window = rise + duration * 2.5 + 0.05;
  // A random offset into the buffer, so repeated strikes do not phase together
  // and start to sound sampled.
  source.start(at, Math.random() * Math.max(noise.duration - window, 0), window);
  source.stop(at + window + 0.01);
}

/**
 * A material compressing under load rather than being struck. The foot keeps
 * going after contact and the sound is the material packing over a tenth of a
 * second, so the envelope swells to a peak instead of decaying.
 *
 * The band climbs as the voids close, which is snow's squeak — crystals
 * shearing — and at a lower ratio moss's squish and mud's suck.
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
     * Granular packing genuinely is a window: the voids are a size, and they
     * close. Liquid displacement is a lowpass falling — it starts with
     * everything in it and loses the top first — and a swept bandpass is a
     * whoosh whatever envelope is put on it.
     */
    band?: 'window' | 'ceiling';
    /**
     * Where the peak sits, as a fraction of the duration. Defaults to 0.45.
     * Packing builds while the load goes on and peaks near the middle; a
     * liquid is displaced almost at once and peaks in the first tenth.
     */
    rise?: number;
    /**
     * How irregular the flow is, 0..1. Defaults to smooth. A handful of
     * waypoints wander both the level and the spectrum, which is what anything
     * thick wants; granular packing really is smooth and stays at zero.
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
 * A tonal thump: a sine falling in pitch, felt more than heard. Modal banks
 * carry material and excitation carries contact, but neither carries mass —
 * for that you need energy below where the resonators live.
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
   * Rise time. At 60-150 Hz one cycle lasts 7-17 ms, so 2 ms is a meaningful
   * fraction of one and anything shorter is a click on the front of the
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
