import type { AudioEngine } from '../AudioEngine';
import type { SoundModel } from '../Emitter';
import { createEventClock, poissonGap, type EventClock } from '../dsp/clock';
import { createModalBank, type ModalBank, type Mode } from '../dsp/modal';
import { excite } from '../dsp/impact';

/**
 * Vegetation you are standing next to: a hedge, a garden tree, a climber on a
 * wall, a row of beans.
 *
 * **This is not a canopy and must not be built like one.** A wood overhead is
 * thousands of leaves too far away to resolve, so it is a *hush* — a continuous
 * band of noise with grains on top for shimmer. Three metres away that model is
 * wrong in a way no amount of filtering fixes, because at three metres you can
 * hear individual leaves hit one another, and individual events are exactly
 * what a hush is built to destroy.
 *
 * So this is the other way round: **impulses first, and almost no bed at all.**
 * A leaf slapping its neighbour is a tiny, papery contact into a very lightly
 * damped twig; a hedge in a gust is a few hundred of those a second, and in
 * still air it is four or five, which is why a hedge is *silent* most of the
 * time and a canopy never is. That silence is the whole reason to walk past one.
 *
 * The twigs are the only resonance, they are woody and short, and there are
 * only three of them: a hedge has no pitch and the moment it acquires one it
 * has become a shaker.
 */

export interface HedgeOptions {
  gain?: number;
  /** Leaf contacts a second at a full gust. */
  density?: number;
  /** Leaf size. Above 1 is small and dry, below is broad and wet. */
  tone?: number;
  /** How woody it is, 0..1. High is bare winter twigs; low is soft summer growth. */
  woody?: number;
  /** Gust strength below which it is still. A hedge has a real threshold. */
  onset?: number;
  /** Contacts a second in dead air. Small, and never quite zero. */
  restless?: number;
}

/** Twig resonances. Three, short, and with no relationship worth hearing. */
const TWIGS: readonly number[] = [1, 2.31, 3.87];

export function createHedge(engine: AudioEngine, options: HedgeOptions = {}): SoundModel {
  const context = engine.context;
  const noise = engine.noise;
  if (!noise) throw new Error('hedge built before the noise buffers were ready');

  const density = options.density ?? 220;
  const tone = options.tone ?? 1;
  const woody = options.woody ?? 0.5;
  const onset = options.onset ?? 0.12;
  const restless = options.restless ?? 4;

  const output = context.createGain();
  output.gain.value = options.gain ?? 0.2;

  // Leaves are small and papery, so almost nothing below a kilohertz survives
  // them. Rolling it off is what stops a hedge sounding like a bag of crisps.
  const body = context.createBiquadFilter();
  body.type = 'highpass';
  body.frequency.value = 700 * tone;
  body.Q.value = 0.5;
  body.connect(output);

  const modes: Mode[] = TWIGS.map((ratio, i) => ({
    hz: 1300 * ratio * tone,
    // Very short. A twig is not a bar.
    decay: (0.012 + woody * 0.03) * Math.pow(0.7, i),
    level: 1 / (1 + i),
  }));
  const twigs: ModalBank = createModalBank(context, modes, body, { ring: 'excitation' });

  const clock: EventClock = createEventClock(context);
  const gap = poissonGap(restless);

  let active = true;
  let strength = 0;

  const leaf = (at: number): void => {
    // One leaf against another: soft, brief, and individually almost nothing.
    // The contact is long for its size because a leaf is not rigid.
    const force = 0.04 + Math.random() * 0.16;
    const contact = 0.0025 + Math.random() * 0.004;
    // Only one twig per contact. Exciting the whole bank every time would make
    // every leaf the same leaf, which is the one thing a hedge never has.
    const which = Math.floor(Math.random() * twigs.inputs.length);
    excite(context, noise.white, twigs.inputs[which], at, force, contact, contact * 0.5);
  };

  return {
    output,

    setActive(next) {
      active = next;
      if (next) clock.reset();
    },

    update(_dt, audio, at) {
      if (!active) return;
      strength = audio.weather.strengthAt(at.x, at.z);
      const over = Math.max(0, (strength - onset) / (1 - onset));
      // Steep rather than proportional. A hedge is still, and then it is
      // suddenly working, and the gap between those two is the sound.
      gap.rate = restless + density * over * over;
      clock.pump(leaf, gap, 'immediate');
    },

    dispose() {
      twigs.dispose();
      body.disconnect();
      output.disconnect();
    },
  };
}
