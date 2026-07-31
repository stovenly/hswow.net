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
  /**
   * Flagstone. Hard and dead, with a little grit on top.
   *
   * Hard is not the same as *sharp*. This was a 7 kHz transient over modes at
   * 2100 and 3900, which is a tile struck by something small and hard — a
   * fingernail, a dropped coin. A boot on a flagstone is a much broader, duller
   * event: the sole is soft, it spreads the contact over several milliseconds,
   * and most of the energy that survives is mid-band. Keeping the top end up
   * there also put the steps *inside the listener's head*, because the ear
   * localises near-field sound almost entirely from high frequencies.
   *
   * So the transient comes down and lengthens, the top mode goes, and the grit
   * moves out of the sibilance range. It is still by far the brightest surface
   * here — stone genuinely has a crack to it — just no longer a click.
   */
  stone: {
    level: 0.5,
    impact: { level: 0.9, duration: 0.011, tone: 3800 },
    modes: [
      { hz: 620, decay: 0.06, level: 0.6 },
      { hz: 1450, decay: 0.03, level: 0.32 },
      { hz: 2600, decay: 0.018, level: 0.12 },
    ],
    grit: { count: 5, over: 0.06, energyDecay: 0.025, hz: 2600, q: 1.2, level: 0.12 },
    toe: 0.45,
    roll: 0.075,
  },

  /**
   * A boarded floor. Hollow, warm, and soft-edged.
   *
   * **The brightness is the whole difference between wood and tile.** This was
   * a 3.6 kHz transient over a mode at 1450, which is a hard glazed surface —
   * a floor tile, a flagstone — and it read as one. Timber is porous and it
   * flexes: the strike is damped on contact, so the transient is longer and
   * far duller, and the energy that survives is in the low modes where the
   * boards and the void beneath them resonate.
   *
   * So the impact tone comes down by half, its duration goes up, and the top
   * mode is dropped entirely. What is left is the hollowness, which is the
   * thing that actually says "floorboards" — and the reason `stone` keeps its
   * bright transient is that stone genuinely has one.
   */
  wood: {
    level: 0.6,
    impact: { level: 0.7, duration: 0.018, tone: 1700 },
    modes: [
      { hz: 155, decay: 0.22, level: 1 },
      { hz: 390, decay: 0.15, level: 0.6 },
      { hz: 720, decay: 0.075, level: 0.22 },
    ],
    // A trace of grit — dust and grain underfoot. Low and sparse, so it softens
    // the attack rather than adding a crunch.
    grit: { count: 4, over: 0.05, energyDecay: 0.02, hz: 1200, q: 0.9, level: 0.08 },
    toe: 0.6,
    roll: 0.085,
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
/** Impact speed at which a landing is as heavy as it gets, in m/s. */
const LANDING_FULL = 9;

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
  private readonly body: BiquadFilterNode;
  private readonly panner: StereoPannerNode;
  private readonly reverbSend: GainNode;
  /** Built on first use and kept — resonators are the ground, not the step. */
  private readonly chains = new Map<SurfaceName, Chain>();
  /** Which foot the *next* footfall belongs to. Toggled as each one is used. */
  private left = false;

  constructor(engine: AudioEngine, gain = 0.55) {
    this.engine = engine;
    const context = engine.context;

    this.output = context.createGain();
    this.output.gain.value = gain;

    // **Your own feet are a metre and a half below your ears, not between
    // them.** Nothing here is spatialised — a `PannerNode` at zero distance
    // from the listener produces nonsense — so the only cue available for
    // *where* these are coming from is their spectrum, and the ear places
    // near-field sound almost entirely by its high end. Rolling the top off
    // is what drops the steps to floor level; without it every surface, however
    // well modelled, sounds like it is happening inside the player's skull.
    //
    // Gentle on purpose. Far enough down to lose the sibilance that reads as
    // close, high enough to leave stone its crack and metal its ring.
    this.body = context.createBiquadFilter();
    this.body.type = 'lowpass';
    this.body.frequency.value = 5200;
    this.body.Q.value = 0.6;

    this.panner = context.createStereoPanner();
    this.reverbSend = context.createGain();
    this.reverbSend.gain.value = 0.6;

    this.output.connect(this.body);
    this.body.connect(this.panner);
    this.panner.connect(engine.dry);
    // A little reverb, so your own steps tell you what room you are in. This
    // is most of why walking into the hall lands as an event.
    //
    // Through its own gain rather than straight to the bus, because how much
    // is right depends on the room. Footfalls are the one sound that happens
    // *at* the listener, and a four-second tail on something with no distance
    // to it reads as standing in a cave rather than as walking through a hall —
    // so a big hard room wants rather less of this than its preset would give
    // everything else. The zone sets it.
    this.panner.connect(this.reverbSend);
    this.reverbSend.connect(engine.send);
  }

  /** How much of your footsteps feeds the room, 0..1. Set per zone. */
  setReverb(amount: number): void {
    this.reverbSend.gain.setTargetAtTime(
      Math.max(0, amount),
      this.engine.context.currentTime,
      0.1,
    );
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
    this.panner.pan.setValueAtTime(this.takeFoot() * 0.2, at);

    this.strike(chain, surface, at, force * rand(0.9, 1.1));

    // Heel then toe. The gap closes as you speed up, until at a sprint the two
    // are close enough to fuse into a single heavier event — which is what
    // running actually sounds like.
    if (surface.toe > 0) {
      const roll = surface.roll * Math.max(0.35, 1 - speed / 12);
      this.strike(chain, surface, at + roll, force * surface.toe * rand(0.8, 1.1));
    }
  }

  /**
   * Touching down after a fall or a jump.
   *
   * A landing is not a footstep with the volume up. Both feet arrive at once,
   * so it is centred rather than panned to one side; there is no heel-to-toe
   * roll, because nothing is rolling; and its weight comes from how fast you
   * were falling rather than from how fast you were walking, which is a
   * completely different number.
   *
   * Jumping on the spot used to be silent — the gait only advances while
   * grounded and moving, so hopping produced no events at all, and the ground
   * you were plainly hitting made no sound.
   */
  land(impact: number): void {
    const context = this.engine.context;
    if (context.state !== 'running' || !this.engine.noise) return;

    const surface = SURFACES[this.surface];
    const chain = this.chainFor(this.surface);
    const at = context.currentTime + 0.004;

    const weight = Math.min(impact / LANDING_FULL, 1);
    const force = surface.level * (0.7 + weight * 0.85);

    // Centred: you land on both feet.
    this.panner.pan.setValueAtTime(0, at);
    this.strike(chain, surface, at, force);

    // Feet never quite arrive together, and the few milliseconds between them
    // are most of what stops a landing sounding like a single synthetic event.
    this.strike(chain, surface, at + rand(0.012, 0.03), force * rand(0.4, 0.6));

    // The foot cycle is deliberately left alone. You land on both feet, so a
    // landing belongs to neither — and the jump before it already advanced the
    // gait, so walking out of the landing continues on the foot that was coming
    // next rather than starting the pattern over on the same side.
  }

  /**
   * Pushing off into a jump.
   *
   * Deliberately unlike the other two. A step arrives and a landing arrives
   * hard; a take-off *leaves* — the foot loads, the sole drags as it extends,
   * and the ground is leaned on rather than hit. So the transient is stretched
   * into a scrape, the body's ring is pulled right down because nothing struck
   * it, and the loose grit is scaled up because pushing is what scuffs a
   * surface. Same material table as everything else, different contact.
   *
   * Not called when the jump follows straight on from a landing: chaining hops
   * is one continuous contact, and the landing already spoke for it. Two
   * sounds a few milliseconds apart there reads as a stutter, not as effort.
   *
   * **A jump is a footfall, so it takes the next foot in the cycle** and
   * advances it — step left, step right, push off left. It is not the foot that
   * just made a sound: running at something and jumping it, you plant the
   * *next* foot and drive off that, which is why the gait carries straight
   * through a jump instead of stuttering on one side.
   *
   * Panned *narrower* than a footstep, not wider. A push-off is a shove
   * downward through the whole body rather than a contact at one side of it,
   * so it sits closer to the middle even though it is unambiguously one foot.
   * Widening it to match a footstep was tried and immediately sounded like a
   * different event.
   */
  jump(): void {
    const context = this.engine.context;
    if (context.state !== 'running' || !this.engine.noise) return;

    const surface = SURFACES[this.surface];
    const chain = this.chainFor(this.surface);
    const at = context.currentTime + 0.004;

    this.panner.pan.setValueAtTime(this.takeFoot() * 0.12, at);
    this.strike(chain, surface, at, surface.level * rand(0.42, 0.55), {
      stretch: 3.2,
      modes: 0.28,
      grit: 1.7,
    });
  }

  /**
   * Takes the next foot and advances the cycle. -1 left, +1 right.
   *
   * Every gesture that puts weight on a single foot goes through this, so the
   * alternation is one piece of state advanced in one place — reasoning about
   * which side is "current" at each call site is exactly how a push-off ends up
   * on the wrong foot.
   */
  private takeFoot(): -1 | 1 {
    const foot: -1 | 1 = this.left ? -1 : 1;
    this.left = !this.left;
    return foot;
  }

  /** One impact: transient, modal ring, and a burst of grit. */
  private strike(
    chain: Chain,
    surface: Surface,
    at: number,
    force: number,
    /**
     * Reshapes the contact without changing the material.
     *
     * A step, a landing and a push-off are the same foot on the same ground —
     * what differs is how the contact is made. `stretch` lengthens the
     * transient (a scrape rather than a strike), `modes` scales the body's
     * ring, and `grit` scales the loose material scuffed up. Giving each
     * gesture its own surface table instead would mean three copies of every
     * material that could drift apart.
     */
    shape?: { stretch?: number; modes?: number; grit?: number },
  ): void {
    const context = this.engine.context;
    const noise = this.engine.noise;
    if (!noise) return;

    const stretch = shape?.stretch ?? 1;
    const modeScale = shape?.modes ?? 1;
    const gritScale = shape?.grit ?? 1;

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

    excite(chain.impactInput, force * surface.impact.level, surface.impact.duration * stretch);

    // Resonators need only a click — their ring-down is the filter's own, not
    // an envelope's, which is what makes it sound like a body rather than a
    // fade.
    for (let i = 0; i < surface.modes.length; i++) {
      excite(chain.modeInputs[i], force * surface.modes[i].level * 0.5 * modeScale, 0.002);
    }

    if (surface.grit && chain.gritInput) {
      this.scatter(chain.gritInput, surface.grit, at, force * gritScale);
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
    this.body.disconnect();
    this.panner.disconnect();
    this.reverbSend.disconnect();
  }
}
