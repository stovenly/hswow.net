/**
 * PhISEM — Cook's *Physically Informed Stochastic Event Modeling*. A maraca, a
 * handful of gravel, a chain on a floor and a boot in dry leaves are one
 * system: small objects colliding at Poisson intervals, with the total energy
 * decaying exponentially after whatever set them off, through one shared
 * resonance for the material.
 *
 * Cook's loop runs per sample, which Web Audio cannot do without a worklet.
 * Its output is a Poisson train of impulses under an exponential, and a train
 * of impulses is something the audio clock can place exactly, so the whole
 * burst is scheduled up front for nothing on the audio thread.
 */

import { strike } from './envelopes';

export interface Particles {
  /** Collisions in the burst. More is coarser, louder and heavier underfoot. */
  count: number;
  /** Seconds the burst is spread over. */
  over: number;
  /** Time constant of the energy decay. Short is a scuff, long is a spill. */
  energyDecay: number;
  /** Centre of the resonance — what the particles are made of. */
  hz: number;
  /** Broad. These are small irregular objects, not tuned ones. */
  q: number;
  level: number;
  /**
   * How many distinct sizes of thing are in the pile. Defaults to one, which
   * means every stone is the same stone — right for a maraca, where the beans
   * really are identical, and a loop over any long scatter of gravel.
   */
  voices?: number;
  /**
   * How far apart those sizes are, as a fraction either way. 0.7 spans about
   * 0.6 to 1.7 times `hz`.
   *
   * Grains sharing one resonance fuse into a material; grains at clearly
   * different pitches segregate into separate little things. Above roughly two
   * hundred collisions a second keep this under 0.2, or a substance turns into
   * a shimmer of pitched blips.
   */
  spread?: number;
  /**
   * How long one collision rings, in seconds. Defaults to 12 ms, and it is the
   * dry/wet control: a piece that stops dead is a leaf or a chip of slate, and
   * one that rings on for twenty or thirty milliseconds is a droplet.
   */
  grain?: number;
  /**
   * How much a collision shortens as the burst runs down, 0..1. Defaults to 1.
   * A stone bouncing loses height, so its later contacts are briefer as well as
   * quieter. A wet lump does not bounce — it arrives, spreads and stays.
   */
  bounce?: number;
  /**
   * How sharply one collision starts, in seconds. Defaults to 0.8 ms, which
   * assumes the pieces are hard. A burst of instant clicks reads as ball
   * bearings whatever the pitch and count; a few milliseconds is a texture.
   */
  attack?: number;
}

export interface ParticleBed {
  /** One per voice. Each collision goes into exactly one of them. */
  readonly inputs: GainNode[];
  dispose(): void;
}

/**
 * The material the particles are made of: the resonances they excite. Built
 * once and kept — a handful of gravel does not acquire new resonances each
 * time it is disturbed.
 */
export function createParticleBed(
  context: BaseAudioContext,
  particles: Particles,
  destination: AudioNode,
): ParticleBed {
  const voices = Math.max(1, Math.round(particles.voices ?? 1));
  const spread = particles.spread ?? 0;
  const nodes: AudioNode[] = [];

  const inputs = Array.from({ length: voices }, (_, i) => {
    const input = context.createGain();
    const filter = context.createBiquadFilter();
    filter.type = 'bandpass';
    // Geometric, because size maps to pitch reciprocally: spacing evenly in Hz
    // would crowd every large piece into the bottom of the range.
    const offset = voices === 1 ? 0 : (i / (voices - 1) - 0.5) * 2;
    filter.frequency.value = particles.hz * Math.pow(1 + spread, offset);
    // Deliberately low. A sharp filter here would give every stone a definite
    // note, which is the one thing a pile of loose material never has.
    filter.Q.value = particles.q;
    input.connect(filter).connect(destination);
    nodes.push(input, filter);
    return input;
  });

  return {
    inputs,
    dispose() {
      for (const node of nodes) node.disconnect();
    },
  };
}

/**
 * Schedules one burst of collisions into a bed. `at` is the audio time of the
 * first possible collision; `force` scales the whole burst.
 */
export function scatterParticles(
  context: BaseAudioContext,
  noise: AudioBuffer,
  bed: ParticleBed,
  particles: Particles,
  at: number,
  force: number,
): void {
  const rate = particles.count / Math.max(particles.over, 1e-3);
  let t = 0;

  for (let i = 0; i < particles.count; i++) {
    // Exponential gaps. Evenly spaced collisions are a buzz at the collision
    // rate; this is the difference between a crunch and a kazoo.
    t += -Math.log(1 - Math.random() * 0.999 - 0.001) / rate;
    // The tail is allowed to run past the nominal window, but not forever —
    // an exponential has no end and the quiet end of it is inaudible anyway.
    if (t > particles.over * 1.4) break;

    const energy = Math.exp(-t / particles.energyDecay);
    // The per-collision spread is wide on purpose. Uniform amplitudes read as
    // one object rattling; a broad spread reads as many different ones.
    const level = force * particles.level * energy * (0.35 + Math.random() * 0.65);
    if (level < 0.002) continue;

    const source = context.createBufferSource();
    source.buffer = noise;
    // Per-collision detune: pitch variety for the cost of a float.
    source.playbackRate.value = 0.7 + Math.random() * 0.7;

    const envelope = context.createGain();
    const when = at + t;
    // Varied per collision around the material's own figure, and shortening as
    // the burst runs down: a stone's later contacts are briefer, not merely
    // quieter, and a constant leaves the tail a thin run of identical rings.
    const bounce = particles.bounce ?? 1;
    const grain = (particles.grain ?? 0.012) * (1 - bounce * 0.5 * (1 - energy));
    const rise = Math.min(particles.attack ?? 0.0008, grain * 0.6);
    strike(envelope.gain, when, level, rise, grain * (0.6 + Math.random() * 0.8));

    // One voice, chosen per collision — see `Particles.voices`.
    const target = bed.inputs[(Math.random() * bed.inputs.length) | 0];
    source.connect(envelope).connect(target);
    source.start(when, Math.random() * Math.max(noise.duration - 0.2, 0), 0.06);
    source.stop(when + 0.07);
  }
}
