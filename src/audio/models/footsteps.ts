import type { AudioEngine } from '../AudioEngine';

/**
 * Footsteps, after Cook's physically informed models.
 *
 * The research splits ground materials into **solid** (stone, wood, metal),
 * **aggregate** (gravel, grass, leaves, snow), **liquid** (puddles, mud) and
 * hybrids of those, and gives each a different synthesis engine. A single
 * noise burst through one resonant filter — which is what this used to be — is
 * specifically the *liquid* model. That is why every surface sounded like a
 * wet slap: it was one.
 *
 * Three engines here, mixed per material:
 *
 * - **Impact.** A very short filtered noise transient. The strike itself. Its
 *   brightness and length are the material's hardness.
 * - **Modal ring** (solid). Parallel high-Q bandpasses excited by that
 *   impulse, each ringing down at its own rate. This is what makes wood sound
 *   hollow and stone sound dead; a resonator's decay time follows from its Q,
 *   so `decay` is specified and Q is derived rather than guessed.
 * - **Grit** (aggregate), which is PhISEM. A stone or a leaf underfoot is not
 *   one event but dozens of tiny collisions, and the system's energy decays
 *   exponentially while collisions keep happening at random intervals within
 *   it. Cook's insight is that this is enough — no particle simulation, just
 *   an exponentially falling excitation of a resonator at Poisson intervals.
 *
 * On top of that, **a footstep is two events, not one**: heel strike, then
 * toe-off some tens of milliseconds later. At walking pace they are separately
 * audible and at a run they merge. Games that emit one event per step sound
 * subtly mechanical, and no amount of work on the timbre fixes it.
 *
 * Resonators are built once per material and kept — excitation is scheduled,
 * the filters are not rebuilt. That is both cheaper and closer to the physics:
 * the ground does not get a new set of resonances every time it is stepped on.
 *
 * Not routed through a `PannerNode`: these happen at your own feet, and
 * spatialising something at zero distance from the listener produces nonsense.
 */

interface Mode {
  hz: number;
  /** Ring-down time in seconds. Q is derived from this. */
  decay: number;
  level: number;
}

interface Grit {
  /** Collisions per step. More is coarser and louder underfoot. */
  count: number;
  /** Seconds they are spread over. */
  over: number;
  /** How fast the collision energy falls away across that window. */
  energyDecay: number;
  hz: number;
  q: number;
  level: number;
}

export interface Surface {
  /** Overall level, before the speed curve. */
  level: number;
  impact: {
    level: number;
    /** Seconds. Hard surfaces are brief, soft ones smear. */
    duration: number;
    /** Lowpass on the transient. Brightness is hardness. */
    tone: number;
  };
  /** Solid materials ring. Loose ones do not. */
  modes: readonly Mode[];
  /** Aggregate materials crunch. Solid ones do not. */
  grit: Grit | null;
  /** Level of the toe-off relative to the heel strike. */
  toe: number;
  /** Seconds between heel and toe at walking pace. Shrinks as you speed up. */
  roll: number;
}

export const SURFACES = {
  /** Flagstone. Bright, dead, a little grit on top. */
  stone: {
    level: 0.55,
    impact: { level: 1, duration: 0.006, tone: 7000 },
    modes: [
      { hz: 900, decay: 0.035, level: 0.5 },
      { hz: 2100, decay: 0.022, level: 0.35 },
      { hz: 3900, decay: 0.014, level: 0.2 },
    ],
    grit: { count: 5, over: 0.05, energyDecay: 0.02, hz: 4800, q: 1.6, level: 0.16 },
    toe: 0.45,
    roll: 0.075,
  },

  /** Boards over a void. The long low modes are the hollowness. */
  wood: {
    level: 0.6,
    impact: { level: 0.85, duration: 0.01, tone: 3600 },
    modes: [
      { hz: 165, decay: 0.19, level: 0.9 },
      { hz: 410, decay: 0.13, level: 0.55 },
      { hz: 780, decay: 0.08, level: 0.3 },
      { hz: 1450, decay: 0.04, level: 0.15 },
    ],
    grit: null,
    toe: 0.55,
    roll: 0.08,
  },

  /** Packed earth. Almost all impact, one dull low mode, dry crumbs. */
  earth: {
    level: 0.5,
    impact: { level: 1, duration: 0.022, tone: 900 },
    modes: [{ hz: 120, decay: 0.05, level: 0.55 }],
    grit: { count: 9, over: 0.07, energyDecay: 0.028, hz: 1600, q: 1, level: 0.22 },
    toe: 0.4,
    roll: 0.085,
  },

  /** Loose stones. The one that is almost entirely PhISEM. */
  gravel: {
    level: 0.5,
    impact: { level: 0.45, duration: 0.012, tone: 2400 },
    modes: [],
    grit: { count: 26, over: 0.16, energyDecay: 0.06, hz: 3000, q: 1.4, level: 0.75 },
    toe: 0.7,
    roll: 0.09,
  },

  /** Soft, high, no ring at all. Barely there. */
  grass: {
    level: 0.32,
    impact: { level: 0.5, duration: 0.03, tone: 1400 },
    modes: [],
    grit: { count: 16, over: 0.11, energyDecay: 0.045, hz: 5200, q: 0.9, level: 0.4 },
    toe: 0.6,
    roll: 0.085,
  },

  /** Dry leaves: like grass but longer, rattlier, brighter. */
  leaves: {
    level: 0.4,
    impact: { level: 0.35, duration: 0.02, tone: 2600 },
    modes: [],
    grit: { count: 34, over: 0.2, energyDecay: 0.08, hz: 4200, q: 2.2, level: 0.55 },
    toe: 0.75,
    roll: 0.09,
  },

  /** Grating or plate. Long inharmonic ring — the only one that sings. */
  metal: {
    level: 0.45,
    impact: { level: 0.9, duration: 0.004, tone: 9000 },
    modes: [
      { hz: 480, decay: 0.5, level: 0.5 },
      { hz: 1270, decay: 0.42, level: 0.45 },
      { hz: 2340, decay: 0.3, level: 0.3 },
      { hz: 4100, decay: 0.18, level: 0.2 },
    ],
    grit: null,
    toe: 0.5,
    roll: 0.07,
  },

  /** The wet slap, kept — as one material among several rather than as all of them. */
  mud: {
    level: 0.5,
    impact: { level: 1, duration: 0.05, tone: 700 },
    modes: [{ hz: 240, decay: 0.06, level: 0.35 }],
    grit: { count: 6, over: 0.09, energyDecay: 0.03, hz: 900, q: 3.2, level: 0.3 },
    toe: 0.3,
    roll: 0.1,
  },
} as const satisfies Record<string, Surface>;

export type SurfaceName = keyof typeof SURFACES;

/**
 * Speed at which footsteps reach full weight.
 *
 * Above this they stop getting louder. Real footfalls do keep gaining energy
 * with pace, but only up to a point, and an unbounded curve turns a sprint
 * into stomping.
 */
const FULL_WEIGHT_SPEED = 6;
/** Level at a standstill-slow walk, as a fraction of full. */
const SOFTEST = 0.35;

/** Audio needs no determinism — unlike the art kit, nothing is stored by seed. */
function rand(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

interface Chain {
  impactInput: GainNode;
  modeInputs: GainNode[];
  gritInput: GainNode | null;
}

export class Footsteps {
  /** Surface underfoot. Phase 5 sets this from the zone the player is in. */
  surface: SurfaceName = 'earth';

  private readonly engine: AudioEngine;
  private readonly output: GainNode;
  private readonly panner: StereoPannerNode;
  /** Built on first use and kept — resonators are the ground, not the step. */
  private readonly chains = new Map<SurfaceName, Chain>();
  private left = false;

  constructor(engine: AudioEngine, gain = 0.55) {
    this.engine = engine;
    const context = engine.context;

    this.output = context.createGain();
    this.output.gain.value = gain;
    this.panner = context.createStereoPanner();

    this.output.connect(this.panner);
    this.panner.connect(engine.dry);
    // A little reverb, so your own steps tell you what room you are in. This
    // is most of why walking into the hall lands as an event.
    this.panner.connect(engine.send);
  }

  /**
   * Fired by the controller once per footfall.
   *
   * @param speed Metres per second, for weight.
   */
  step(speed: number): void {
    const context = this.engine.context;
    if (context.state !== 'running' || !this.engine.noise) return;

    const surface = SURFACES[this.surface];
    const chain = this.chainFor(this.surface);
    const at = context.currentTime + 0.004;

    // Saturating rather than linear. Loudness is perceived logarithmically, so
    // a linear map on speed overshoots badly at the top end.
    const weight =
      SOFTEST + (1 - SOFTEST) * (1 - Math.exp(-speed / (FULL_WEIGHT_SPEED * 0.45)));
    const force = surface.level * Math.min(weight, 1);

    // Alternate feet. Steps dead centre sound like one foot hopping.
    this.panner.pan.setValueAtTime(this.left ? -0.2 : 0.2, at);
    this.left = !this.left;

    this.strike(chain, surface, at, force * rand(0.9, 1.1));

    // Heel then toe. The gap closes as you speed up, until at a sprint the two
    // are close enough to fuse into a single heavier event — which is what
    // running actually sounds like.
    if (surface.toe > 0) {
      const roll = surface.roll * Math.max(0.35, 1 - speed / 12);
      this.strike(chain, surface, at + roll, force * surface.toe * rand(0.8, 1.1));
    }
  }

  /** One impact: transient, modal ring, and a burst of grit. */
  private strike(chain: Chain, surface: Surface, at: number, force: number): void {
    const context = this.engine.context;
    const noise = this.engine.noise;
    if (!noise) return;

    // A single short excitation feeds both the transient and every resonator,
    // exactly as one physical impact would.
    const excite = (target: AudioNode, level: number, duration: number): void => {
      const source = context.createBufferSource();
      source.buffer = noise.white;
      const envelope = context.createGain();
      envelope.gain.setValueAtTime(0, at);
      envelope.gain.linearRampToValueAtTime(level, at + Math.min(0.0012, duration * 0.3));
      envelope.gain.setTargetAtTime(0, at + 0.0012, duration * 0.4);
      source.connect(envelope).connect(target);
      source.start(at, rand(0, noise.white.duration - 0.5), duration + 0.05);
      source.stop(at + duration + 0.06);
    };

    excite(chain.impactInput, force * surface.impact.level, surface.impact.duration);

    // Resonators need only a click — their ring-down is the filter's own, not
    // an envelope's, which is what makes it sound like a body rather than a
    // fade.
    for (let i = 0; i < surface.modes.length; i++) {
      excite(chain.modeInputs[i], force * surface.modes[i].level * 0.5, 0.002);
    }

    if (surface.grit && chain.gritInput) {
      this.scatter(chain.gritInput, surface.grit, at, force);
    }
  }

  /**
   * PhISEM: collisions at random intervals, into an exponentially falling
   * system energy.
   *
   * Cook's algorithm runs per sample — decay the system energy, roll against
   * the object count, add energy to the resonator on a hit. Web Audio cannot
   * do per-sample logic without a worklet, but the *result* is a Poisson train
   * of impulses whose amplitude follows that exponential, and that schedules
   * exactly. Randomising the intervals is the part that matters: evenly spaced
   * collisions are a buzz, not a crunch.
   */
  private scatter(target: AudioNode, grit: Grit, at: number, force: number): void {
    const context = this.engine.context;
    const noise = this.engine.noise;
    if (!noise) return;

    const rate = grit.count / grit.over;
    let t = 0;

    for (let i = 0; i < grit.count; i++) {
      t += -Math.log(1 - rand(0.001, 1)) / rate;
      if (t > grit.over * 1.4) break;

      const energy = Math.exp(-t / grit.energyDecay);
      const level = force * grit.level * energy * rand(0.35, 1);
      if (level < 0.002) continue;

      const source = context.createBufferSource();
      source.buffer = noise.white;
      source.playbackRate.value = rand(0.7, 1.4);

      const envelope = context.createGain();
      const when = at + t;
      envelope.gain.setValueAtTime(0, when);
      envelope.gain.linearRampToValueAtTime(level, when + 0.0008);
      envelope.gain.setTargetAtTime(0, when + 0.0008, 0.004);

      source.connect(envelope).connect(target);
      source.start(when, rand(0, noise.white.duration - 0.2), 0.06);
      source.stop(when + 0.07);
    }
  }

  /** Builds and caches the resonator chain for a surface. */
  private chainFor(name: SurfaceName): Chain {
    const existing = this.chains.get(name);
    if (existing) return existing;

    const context = this.engine.context;
    const surface: Surface = SURFACES[name];

    const impactInput = context.createGain();
    const impactFilter = context.createBiquadFilter();
    impactFilter.type = 'lowpass';
    impactFilter.frequency.value = surface.impact.tone;
    impactInput.connect(impactFilter).connect(this.output);

    const modeInputs = surface.modes.map((mode) => {
      const input = context.createGain();
      const filter = context.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = mode.hz;
      // A two-pole resonator's ring-down follows from its Q, so the decay time
      // is the parameter and Q is derived. Specifying Q directly means every
      // change of pitch silently changes how long the mode rings.
      filter.Q.value = Math.min(220, Math.max(1, Math.PI * mode.hz * mode.decay));
      // High Q concentrates energy into a narrow band and makes it far louder;
      // this pays that back so `level` means what it says.
      const trim = context.createGain();
      trim.gain.value = 1 / Math.sqrt(filter.Q.value);
      input.connect(filter).connect(trim).connect(this.output);
      return input;
    });

    let gritInput: GainNode | null = null;
    if (surface.grit) {
      gritInput = context.createGain();
      const filter = context.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = surface.grit.hz;
      filter.Q.value = surface.grit.q;
      gritInput.connect(filter).connect(this.output);
    }

    const chain: Chain = { impactInput, modeInputs, gritInput };
    this.chains.set(name, chain);
    return chain;
  }

  dispose(): void {
    this.output.disconnect();
    this.panner.disconnect();
  }
}
