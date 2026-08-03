/**
 * PhISEM — many small things colliding.
 *
 * Perry Cook's *Physically Informed Stochastic Event Modeling*. The insight is
 * that a maraca, a handful of gravel, a chain dropped on a floor and a boot in
 * dry leaves are all the same system: a population of small objects whose
 * collisions happen at random moments, and whose total energy decays
 * exponentially after whatever set them off. You do not need to simulate the
 * particles. You need collisions at Poisson intervals, an exponential energy
 * envelope over them, and one shared resonance for the material — and that is
 * genuinely enough to be convincing.
 *
 * It is also almost free, which is why it turns up everywhere: gravel and
 * leaves underfoot, rockfall, a portcullis chain, coins, rain on a canopy.
 *
 * ## Why this schedules rather than runs
 *
 * Cook's original runs per sample: decay the system energy, roll against the
 * object count, inject into the resonator on a hit. Web Audio cannot do
 * per-sample logic without a worklet — but the *output* of that loop is a
 * Poisson train of impulses whose amplitudes follow an exponential, and a train
 * of impulses is something the audio clock can place exactly. So the whole
 * burst is scheduled up front. The result is identical and it costs nothing on
 * the audio thread.
 *
 * Extracted from the `scatter` method in `footsteps.ts`.
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
   * How many distinct sizes of thing are in the pile. Defaults to one.
   *
   * **One resonance means every stone is the same stone.** Cook's model shares
   * a single resonator across the whole population, which is right for a maraca
   * — the beans really are identical — and audibly wrong for gravel, where the
   * pieces range from sand to knuckle-sized. Over a short scuff nobody notices;
   * over a long scatter it reads as a loop, because it is one.
   *
   * A handful of voices spread around `hz`, one picked per collision, is enough
   * to break that up completely, and it costs a few filters built once.
   */
  voices?: number;
  /**
   * How far apart those sizes are, as a fraction either way. 0.7 spans from
   * about six-tenths of `hz` to about one and seven-tenths of it.
   */
  spread?: number;
  /**
   * How long one collision rings, in seconds. Defaults to 12 ms.
   *
   * **This is the dry/wet control and it is easy to miss.** A piece that stops
   * dead is dry — a leaf, a grain of sand, a chip of slate. A piece that rings
   * on for twenty or thirty milliseconds through a resonant filter is a
   * *droplet*, and a burst of them is unmistakably water however the rest of
   * the material is set up. Leaves and gravel both acquired a wet quality from
   * nothing but this.
   */
  grain?: number;
  /**
   * How sharply one collision starts, in seconds. Defaults to 0.8 ms.
   *
   * **Cook's model assumes the pieces are hard**, because his were: beans in a
   * gourd, coins, gravel. A hard piece arrives instantly and the click is the
   * point. A snow crystal shearing past another, or a dry leaf folding under a
   * boot, does not — and a burst of instant clicks reads unmistakably as **ball
   * bearings**, whatever the pitch and the count are set to.
   *
   * A few milliseconds is enough to turn the same burst from a rattle of small
   * hard things into a texture, and it is the only control here that does.
   */
  attack?: number;
}

export interface ParticleBed {
  /** One per voice. Each collision goes into exactly one of them. */
  readonly inputs: GainNode[];
  dispose(): void;
}

/**
 * The material the particles are made of: the resonances they excite.
 *
 * Built once and kept. A handful of gravel does not acquire new resonances each
 * time it is disturbed, and rebuilding filters per event is both slower and
 * less true.
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
 * Schedules one burst of collisions into a bed.
 *
 * @param at Audio-clock time for the first possible collision.
 * @param force Scales the whole burst.
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
    // Varied per collision, like the pitch and the level — a fixed ring-down
    // makes every piece the same weight — but around the material's own figure
    // rather than around a constant. See `grain`.
    const grain = particles.grain ?? 0.012;
    const rise = Math.min(particles.attack ?? 0.0008, grain * 0.6);
    strike(envelope.gain, when, level, rise, grain * (0.6 + Math.random() * 0.8));

    // One voice, chosen per collision — see `Particles.voices`.
    const target = bed.inputs[(Math.random() * bed.inputs.length) | 0];
    source.connect(envelope).connect(target);
    source.start(when, Math.random() * Math.max(noise.duration - 0.2, 0), 0.06);
    source.stop(when + 0.07);
  }
}
