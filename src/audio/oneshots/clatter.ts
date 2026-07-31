import type { AudioEngine } from '../AudioEngine';
import type { OneShot } from '../Scatter';
import { createParticleBed, scatterParticles, type Particles } from '../dsp/phisem';
import { excite, thump } from '../dsp/impact';

/**
 * Something being handled, set down, or dropped.
 *
 * A bucket on cobbles, a stack of firewood, a crate, a shutter swinging back
 * against a wall, pots on a shelf. All of them are the same event: **one real
 * contact followed by a decaying scatter of smaller ones**, and the only thing
 * that changes between them is what the material rings at.
 *
 * That structure is the model. A single impact reads as deliberate and staged;
 * a pure PhISEM burst with no leading strike reads as a rattle with no cause.
 * Together they read as an object with mass that has been put down by somebody
 * who was not being careful about it — which is what almost every incidental
 * noise in an inhabited place actually is.
 *
 * See `dsp/phisem.ts` for why the scatter is scheduled rather than simulated.
 */

export type Material = 'wood' | 'pot' | 'metal' | 'stone';

/**
 * What the loose parts are made of.
 *
 * `hz` is the shared resonance and `q` is how much the material insists on it —
 * low for irregular objects, higher for a fired or forged one. Nothing here is
 * sharp: a sharp filter would give every piece the same pitch, which is the one
 * thing a heap of anything never has.
 */
const MATERIALS: Record<Material, Particles & { thumpHz: number }> = {
  wood: { count: 9, over: 0.34, energyDecay: 0.13, hz: 380, q: 2.1, level: 0.5, thumpHz: 120 },
  pot: { count: 7, over: 0.28, energyDecay: 0.1, hz: 950, q: 4.2, level: 0.42, thumpHz: 175 },
  metal: { count: 11, over: 0.42, energyDecay: 0.16, hz: 1750, q: 5.5, level: 0.4, thumpHz: 210 },
  stone: { count: 6, over: 0.22, energyDecay: 0.07, hz: 640, q: 1.6, level: 0.55, thumpHz: 95 },
};

export interface ClatterOptions {
  gain?: number;
  material?: Material;
  /** Shifts the resonance. Below 1 is a bigger, heavier object. */
  tone?: number;
  /** Loose parts per event. More is a pile, fewer is a single object. */
  pieces?: number;
  /** Weight of the first contact against the scatter that follows, 0..1. */
  heft?: number;
}

export function createClatter(engine: AudioEngine, options: ClatterOptions = {}): OneShot {
  const context = engine.context;
  const noise = engine.noise;
  if (!noise) throw new Error('clatter built before the noise buffers were ready');

  const material = MATERIALS[options.material ?? 'wood'];
  const tone = options.tone ?? 1;
  const heft = options.heft ?? 0.5;

  const output = context.createGain();
  output.gain.value = options.gain ?? 0.6;

  const particles: Particles = {
    ...material,
    hz: material.hz * tone,
    count: options.pieces ?? material.count,
  };

  const bed = createParticleBed(context, particles, output);

  return {
    output,

    fire(at, force) {
      // The contact that starts it. Longer excitation than a hammer blow by an
      // order of magnitude — this is a wooden thing landing on a soft surface,
      // not steel on steel, and the contact time is the whole difference.
      excite(context, noise.white, bed.input, at, force * 1.4, 0.012 + Math.random() * 0.01);
      thump(
        context,
        output,
        at,
        force * heft * 0.55,
        material.thumpHz * tone,
        material.thumpHz * tone * 0.45,
        0.08,
        0.004,
      );

      // Everything else settling. Offset slightly, because the second contact
      // cannot precede the first — a burst starting at exactly `at` puts half
      // its collisions before the strike that caused them.
      scatterParticles(context, noise.white, bed.input, particles, at + 0.02, force);

      return particles.over * 1.4 + 0.15;
    },

    dispose() {
      bed.dispose();
      output.disconnect();
    },
  };
}
