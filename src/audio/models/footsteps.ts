import type { AudioEngine } from '../AudioEngine';
import type { Footfall } from '../../player/Controller';
import { createModalBank, type ModalBank, type ModalOptions } from '../dsp/modal';
import { createParticleBed, scatterParticles, type Particles, type ParticleBed } from '../dsp/phisem';
import { excite, crush } from '../dsp/impact';
import { popBubble, bubbleRadius } from '../dsp/bubble';

// Footsteps after Cook: impact, crush, modal ring, PhISEM grit and bubble
// splash mixed per material, two contacts to a footfall. Not spatialised.

interface Mode {
  hz: number;
  decay: number; // ring-down, seconds; Q is derived from it
  level: number;
}

type Grit = Particles;

/** Air entrained by a foot going into water. The bubbles are the sound, not a garnish on noise. */
interface Splash {
  count: number;
  /** Seconds they are spread over. */
  over: number;
  /** Time constant of the energy decay, as the particle bed has. */
  decay: number;
  /** Radius bounds in metres, and so the pitch range: a bubble sings at 3.26/r Hz. */
  radius: readonly [number, number];
  /** Draw skew. Positive toward the fine end, negative toward the coarse. */
  bias?: number;
  level: number;
  /** Viscous damping relative to water. Replaces `cycles` when set. */
  damping?: number;
  /** Oscillations before one is gone. Ignored when `damping` is set. */
  cycles?: number;
}

/** Noise that swells instead of arriving: granular packing, or liquid pushed aside. */
interface Crush {
  level: number;
  /** Seconds. Past about a fifth of one it reads as a bed rather than an event. */
  duration: number;
  /** Band at first contact, and where it has moved to by the end. Either way. */
  from: number;
  to: number;
  /** Sharpness. Above about 4 the movement reads as a squeak or a whistle. */
  q: number;
  /** How irregular the flow is, 0..1. Smooth by default. */
  rough?: number;
  /** A window that moves (packing) or a ceiling that falls (splash). */
  band?: 'window' | 'ceiling';
  /** Where the peak sits, 0..1 of the duration. Defaults to 0.45. */
  rise?: number;
}

export interface Surface {
  /** Overall level, before the speed curve. */
  level: number;
  impact: {
    /** Loudness of the contact relative to the engine carrying the material. */
    level: number;
    /** Seconds. */
    duration: number;
    /** Rise time in seconds. A millisecond is a strike; thirty is a foot decelerating into snow. */
    attack?: number;
    /** Bottom of the contact band, Hz. Without it a soft surface gets a thump it cannot make. */
    low?: number;
    tone: number;
    /** Resonance of the band. Default 1; below 0.7 there is no peak at all. */
    q?: number;
  };
  /** Anything a foot sinks into, or pushes aside. Solid ones have none. */
  crush?: Crush;
  /** Solid materials ring. Loose and soft ones do not — see `RINGS`. */
  modes: readonly Mode[];
  grit: Grit | null;
  splash?: Splash;
  /** How much the loose material answers to shear rather than load, 0..1. See `dragFor`. */
  scuff: number;
  /** Level of the toe-off relative to the heel strike. */
  toe: number;
  /** Seconds between heel and toe at walking pace. Shrinks as you speed up. */
  roll: number;
}

/** The surfaces allowed modes at all: a loose or soft material does not ring. */
export const RINGS: readonly string[] = [
  'stone',
  'cobble-fixed',
  'wood',
  'metal-solid',
  'metal-ring',
  'metal-hollow-small',
  'metal-hollow-big',
];

/** The surfaces allowed a mode low enough and long enough to be a cavity. */
export const HOLLOW: readonly string[] = ['wood', 'metal-hollow-small', 'metal-hollow-big'];

/** Ring-down lives in the excitation envelope rather than the filter's Q; level compensates by energy. */
export const BANK: ModalOptions = { ring: 'excitation', compensation: 'energy' };

/** Excitation length per mode, as a fraction of its decay. `excite` stretches its envelope to 1.6x. */
const MODE_EXCITATION = 0.625;

export const SURFACES = {
  stone: {
    level: 0.48,
    impact: { level: 0.75, duration: 0.014, low: 200, tone: 2400, q: 1, attack: 0.0016 },
    modes: [
      { hz: 600, decay: 0.034, level: 0.12 },
      { hz: 1380, decay: 0.019, level: 0.06 },
    ],
    grit: { count: 4, over: 0.05, energyDecay: 0.02, hz: 2200, q: 1.2, level: 0.09, grain: 0.008 },
    scuff: 0.25,
    toe: 0.45,
    roll: 0.075,
  },

  /** Setts, bedded and pointed: several partial contacts a few milliseconds apart, not one clean one. */
  'cobble-fixed': {
    level: 0.44,
    impact: { level: 0.5, duration: 0.022, low: 160, tone: 1650, q: 0.75, attack: 0.0045 },
    modes: [{ hz: 790, decay: 0.021, level: 0.08 }],
    grit: {
      count: 7, over: 0.055, energyDecay: 0.022, hz: 1700, q: 1.6, level: 0.28,
      voices: 3, spread: 0.35, grain: 0.01,
    },
    scuff: 0.25,
    toe: 0.5,
    roll: 0.08,
  },

  /** Broken stone, loose. Fewer, bigger and lower than gravel, and ringing longer. */
  'cobble-loose': {
    level: 0.5,
    impact: { level: 0.3, duration: 0.015, low: 210, tone: 2200, q: 0.9, attack: 0.005 },
    modes: [],
    grit: {
      count: 13, over: 0.19, energyDecay: 0.07, hz: 1500, q: 1.9, level: 0.95,
      voices: 4, spread: 0.6, grain: 0.018,
    },
    scuff: 0.9,
    toe: 0.6,
    roll: 0.085,
  },

  /** Loose stones, and the reference the aggregate family is sized against. */
  gravel: {
    level: 0.5,
    impact: { level: 0.26, duration: 0.012, low: 260, tone: 2400, q: 0.9, attack: 0.004 },
    modes: [],
    grit: {
      count: 28, over: 0.22, energyDecay: 0.075, hz: 3200, q: 0.7, level: 0.8,
      voices: 3, spread: 0.16, grain: 0.007, attack: 0.0009,
    },
    scuff: 0.95,
    toe: 0.7,
    roll: 0.09,
  },

  /** Dry sand. The contact is a seventh of the crush and takes forty milliseconds to arrive. */
  sand: {
    level: 0.24,
    impact: { level: 0.06, duration: 0.05, low: 200, tone: 1500, q: 0.45, attack: 0.04 },
    crush: { level: 0.36, duration: 0.15, from: 480, to: 820, q: 0.75 },
    modes: [],
    grit: {
      count: 62, over: 0.13, energyDecay: 0.04, hz: 2400, q: 0.4, level: 0.42,
      grain: 0.008, attack: 0.0028,
    },
    scuff: 0.8,
    toe: 0.5,
    roll: 0.1,
  },

  /** Soil: packed earth, with crumbs bigger, drier and lower than snow's grains. */
  soil: {
    level: 0.42,
    impact: { level: 0.13, duration: 0.05, low: 90, tone: 750, q: 0.55, attack: 0.03 },
    crush: { level: 0.26, duration: 0.095, from: 240, to: 360, q: 1.1 },
    modes: [],
    grit: {
      count: 22, over: 0.08, energyDecay: 0.03, hz: 1300, q: 1, level: 0.34,
      voices: 2, spread: 0.15, grain: 0.011, attack: 0.0022,
    },
    scuff: 0.5,
    toe: 0.4,
    roll: 0.085,
  },

  /** Churned wet ground. A slow shear sweeping upward, a wet spatter riding in it, a few bubbles through that. */
  mud: {
    level: 0.42,
    // Barely a twentieth of the shear: mud is not a footstep with a squelch attached.
    impact: { level: 0.028, duration: 0.065, low: 80, tone: 900, q: 0.5, attack: 0.05 },
    crush: { level: 0.54, duration: 0.21, from: 220, to: 440, q: 2.6, rough: 0.45 },
    modes: [],
    grit: {
      count: 12, over: 0.11, energyDecay: 0.04, hz: 1500, q: 1.4, level: 0.3,
      voices: 2, spread: 0.4, grain: 0.026, attack: 0.0016, bounce: 0,
    },
    splash: {
      count: 9, over: 0.14, decay: 0.12, radius: [0.002, 0.006], level: 0.24,
    },
    scuff: 0.5,
    toe: 0.3,
    roll: 0.11,
  },

  /** Moss: a thin dry cushion, high, with soft slow compressions riding in the swell. */
  moss: {
    level: 0.2,
    impact: { level: 0.07, duration: 0.07, low: 200, tone: 850, q: 0.5, attack: 0.05 },
    crush: { level: 0.26, duration: 0.14, from: 340, to: 500, q: 0.65 },
    modes: [],
    grit: {
      count: 8, over: 0.1, energyDecay: 0.05, hz: 620, q: 0.7, level: 0.16,
      voices: 2, spread: 0.4, grain: 0.016, attack: 0.004,
    },
    scuff: 0.3,
    toe: 0.4,
    roll: 0.105,
  },

  /** Turf. A brush rather than a contact — spread and sharpness, not level. */
  grass: {
    level: 0.28,
    impact: { level: 0.09, duration: 0.04, low: 450, tone: 2000, q: 0.45, attack: 0.02 },
    crush: { level: 0.18, duration: 0.09, from: 550, to: 800, q: 0.8 },
    modes: [],
    grit: {
      count: 30, over: 0.085, energyDecay: 0.03, hz: 2600, q: 0.5, level: 0.32,
      grain: 0.009, attack: 0.0026,
    },
    scuff: 0.6,
    toe: 0.6,
    roll: 0.085,
  },

  /** Lying snow: a long soft pack with almost no arrival. */
  snow: {
    level: 0.32,
    impact: { level: 0.08, duration: 0.06, low: 140, tone: 850, q: 0.5, attack: 0.038 },
    crush: { level: 0.3, duration: 0.15, from: 420, to: 700, q: 0.9 },
    modes: [],
    grit: {
      count: 56, over: 0.11, energyDecay: 0.034, hz: 1900, q: 0.55, level: 0.28,
      grain: 0.01, attack: 0.0035,
    },
    scuff: 0.5,
    toe: 0.4,
    roll: 0.11,
  },

  /** A boarded floor — a thick plank over a void, not a stack of ply. */
  wood: {
    level: 0.58,
    impact: { level: 0.24, duration: 0.026, low: 80, tone: 1100, q: 0.8, attack: 0.004 },
    modes: [
      { hz: 132, decay: 0.2, level: 0.26 },
      { hz: 268, decay: 0.15, level: 0.17 },
      { hz: 505, decay: 0.085, level: 0.075 },
      { hz: 940, decay: 0.045, level: 0.03 },
    ],
    grit: { count: 7, over: 0.05, energyDecay: 0.02, hz: 1400, q: 1, level: 0.13, grain: 0.008 },
    scuff: 0.2,
    toe: 0.6,
    roll: 0.085,
  },

  /** Sheet metal, bedded. Inharmonic; the substrate drains the low end and takes the shimmer off the top. */
  'metal-solid': {
    level: 0.46,
    impact: { level: 0.2, duration: 0.007, low: 180, tone: 4200, q: 1.1, attack: 0.0009 },
    modes: [
      { hz: 340, decay: 0.1, level: 0.22 },
      { hz: 1050, decay: 0.24, level: 0.3 },
      { hz: 2140, decay: 0.17, level: 0.2 },
      { hz: 4600, decay: 0.06, level: 0.08 },
    ],
    grit: null,
    scuff: 0.15,
    toe: 0.5,
    roll: 0.072,
  },

  /** Grating, catwalk, ductwork — fixed at its ends, so the vibration runs away and comes back. */
  'metal-ring': {
    level: 0.42,
    impact: { level: 0.3, duration: 0.005, low: 400, tone: 9000, q: 1.6, attack: 0.0006 },
    modes: [
      { hz: 640, decay: 0.5, level: 0.3 },
      { hz: 1490, decay: 0.4, level: 0.22 },
      { hz: 2870, decay: 0.26, level: 0.12 },
      { hz: 5300, decay: 0.14, level: 0.06 },
    ],
    grit: null,
    scuff: 0.15,
    toe: 0.5,
    roll: 0.07,
  },

  /** A pipe, a duct, a small drum. Hollow, but not much of a volume. */
  'metal-hollow-small': {
    level: 0.6,
    impact: { level: 0.1, duration: 0.005, low: 200, tone: 6000, q: 1.2, attack: 0.0008 },
    modes: [
      { hz: 268, decay: 0.62, level: 0.56 },
      { hz: 615, decay: 0.5, level: 0.36 },
      { hz: 1180, decay: 0.36, level: 0.2 },
      { hz: 2400, decay: 0.22, level: 0.1 },
    ],
    grit: null,
    scuff: 0.15,
    toe: 0.5,
    roll: 0.072,
  },

  /** An empty tank. Low enough to be felt and ringing for over a second; the strike is only how it started. */
  'metal-hollow-big': {
    level: 0.82,
    impact: { level: 0.08, duration: 0.008, low: 60, tone: 3400, q: 1.2, attack: 0.001 },
    modes: [
      { hz: 74, decay: 1.65, level: 0.66 },
      { hz: 162, decay: 1.3, level: 0.44 },
      { hz: 355, decay: 0.95, level: 0.25 },
      { hz: 790, decay: 0.5, level: 0.12 },
    ],
    grit: null,
    scuff: 0.15,
    toe: 0.5,
    roll: 0.075,
  },
} as const satisfies Record<string, Surface>;

export type SurfaceName = keyof typeof SURFACES;

/** One contact of a foot with the ground. Every field is a multiplier on the material. */
export interface Contact {
  /** When, as a multiple of the gesture's gap. The first is always 0. */
  at: number;
  level: number;
  /** Contact time, as a multiple of `impact.duration`. */
  stretch: number;
  modes: number;
  grit: number;
  /** Brightness, as a multiple of `impact.tone`. */
  tone: number;
}

/** Two contacts to a footfall: something lands, something follows it down. */
export type Gait = readonly [Contact, Contact];

/** Bounds on a *composed* contact: the multipliers stack, so they are clamped once at the end. */
const LIMITS = {
  level: [0, 1.4],
  stretch: [0.5, 3.2],
  modes: [0, 1.2],
  grit: [0, 2.5],
  tone: [0.35, 1.3],
} as const satisfies Record<string, readonly [number, number]>;

function bound(value: number, [min, max]: readonly [number, number]): number {
  return Math.min(Math.max(value, min), max);
}

function settle(contact: Contact): Contact {
  return {
    at: Math.max(0, contact.at),
    level: bound(contact.level, LIMITS.level),
    stretch: bound(contact.stretch, LIMITS.stretch),
    modes: bound(contact.modes, LIMITS.modes),
    grit: bound(contact.grit, LIMITS.grit),
    tone: bound(contact.tone, LIMITS.tone),
  };
}

/** The material exactly as authored. */
const PLAIN: Contact = { at: 0, level: 1, stretch: 1, modes: 1, grit: 1, tone: 1 };

/** Heel, then toe. A toe-off is a push, not a hit: more scuff, less ring, slightly duller. */
const WALK: Gait = [PLAIN, { at: 1, level: 1, stretch: 1.15, modes: 0.7, grit: 1.25, tone: 0.9 }];

/**
 * Backwards, and not a symmetric mirror. The forefoot lands first and carries
 * the load; the heel is then lowered under control rather than striking.
 */
const BACKWARD: Gait = [
  { at: 0, level: 1, stretch: 0.85, modes: 0.9, grit: 1.25, tone: 1.08 },
  { at: 1.35, level: 0.62, stretch: 1.9, modes: 0.35, grit: 0.35, tone: 0.55 },
];

/**
 * Sidestep, lead foot. Nothing rolls heel to toe — the contact rolls across the
 * foot instead, which is why the second one lands at 0.4 of the gap.
 */
const LATERAL_LEAD: Gait = [
  { at: 0, level: 1, stretch: 1.3, modes: 0.8, grit: 0.9, tone: 0.7 },
  { at: 0.4, level: 0.55, stretch: 1.5, modes: 0.45, grit: 1.3, tone: 0.6 },
];

/** Sidestep, trail foot. It never strikes: it pushes off medially and is dragged in. */
const LATERAL_TRAIL: Gait = [
  { at: 0, level: 0.5, stretch: 2.4, modes: 0.3, grit: 1.8, tone: 0.75 },
  { at: 0.5, level: 0.4, stretch: 1.4, modes: 0.5, grit: 0.7, tone: 0.7 },
];

/** Both feet, a few milliseconds apart. */
const LANDING: Gait = [PLAIN, { ...PLAIN, at: 1, level: 0.5 }];

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** How far a forward diagonal discounts the lateral weight. Going backward, not at all. */
const AHEAD_BIAS = 0.35;

export function lateralWeight(right: number, forward: number): number {
  return Math.abs(right) * (1 - AHEAD_BIAS * Math.max(0, forward));
}

function mixContacts(parts: readonly (readonly [Contact, number])[]): Contact {
  const at = (key: keyof Contact): number =>
    parts.reduce((sum, [contact, weight]) => sum + contact[key] * weight, 0);
  return {
    at: at('at'),
    level: at('level'),
    stretch: at('stretch'),
    modes: at('modes'),
    grit: at('grit'),
    tone: at('tone'),
  };
}

/**
 * The gait for a direction, blended rather than chosen — a branch would flip
 * character mid-corridor. `right` and `forward` are in the player's own frame.
 */
export function gaitFor(right: number, forward: number, foot: -1 | 1, toe: number): Gait {
  const lateral = lateralWeight(right, forward);
  const backward = Math.max(0, -forward);
  const ahead = Math.max(0, 1 - Math.max(lateral, backward));
  const total = lateral + backward + ahead || 1;

  // The foot travelling toward where you are going reaches out.
  const sideways = right >= 0 ? (foot === 1 ? LATERAL_LEAD : LATERAL_TRAIL)
                              : (foot === -1 ? LATERAL_LEAD : LATERAL_TRAIL);

  const weights = [ahead / total, backward / total, lateral / total] as const;
  const walk: Gait = [WALK[0], { ...WALK[1], level: toe }];

  return [
    mixContacts([
      [walk[0], weights[0]],
      [BACKWARD[0], weights[1]],
      [sideways[0], weights[2]],
    ]),
    mixContacts([
      [walk[1], weights[0]],
      [BACKWARD[1], weights[1]],
      [sideways[1], weights[2]],
    ]),
  ];
}

/** How wide the feet sit: the lead foot lands out to the side, the trail foot near the midline. */
export function panFor(right: number, forward: number, foot: -1 | 1): number {
  const lead = right >= 0 ? foot === 1 : foot === -1;
  return lerp(0.2, lead ? 0.28 : 0.1, lateralWeight(right, forward));
}

/** The push-off: one contact, and it leaves rather than arrives. */
const PUSH: Contact = { at: 0, level: 1, stretch: 3.2, modes: 0.28, grit: 1.7, tone: 1 };

/** Speed in m/s at which footsteps reach full weight, above which they stop getting louder. */
const FULL_WEIGHT_SPEED = 6;
/** Level at a standstill-slow walk, as a fraction of full. */
const SOFTEST = 0.35;
/** Impact speed at which a landing is as heavy as it gets, in m/s. */
const LANDING_FULL = 9;

/** Speed in m/s at which shear reaches its nominal value. `DRAG_MAX` caps it above 1. */
const DRAG_SPEED = 5.5;
const DRAG_MAX = 1.5;

/**
 * Shear from travel speed. Unlike weight it does not saturate: creeping and
 * sprinting over gravel differ in how much ground comes with you, not in level.
 */
function dragFor(speed: number): number {
  return Math.min(Math.max(speed, 0) / DRAG_SPEED, DRAG_MAX);
}

/** One footfall's worth of context, shared by both its contacts. */
interface Gesture {
  /** Audio-clock time of the first contact. */
  at: number;
  /** Seconds that a contact's `at` is measured in. */
  gap: number;
  /** Weight, before each contact's own `level`. */
  force: number;
  /** Shear, 0..`DRAG_MAX`. See `dragFor` and `Surface.scuff`. */
  drag: number;
}

/** Audio needs no determinism — unlike the art kit, nothing is stored by seed. */
function rand(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

/**
 * A burst of entrained air, Poisson-spaced. Straight to the output rather than
 * through a bed: a bubble is already a tuned oscillator with no shared body.
 */
function scatterBubbles(
  context: BaseAudioContext,
  target: AudioNode,
  splash: Splash,
  at: number,
  force: number,
): void {
  const rate = splash.count / Math.max(splash.over, 1e-3);
  const [small, big] = splash.radius;

  let t = 0;
  for (let i = 0; i < splash.count; i++) {
    t += -Math.log(1 - Math.random() * 0.999 - 0.001) / rate;
    if (t > splash.over * 1.8) return;

    // The cloud thins as the water falls back.
    const energy = Math.exp(-t / splash.decay);
    const radius = bubbleRadius(small, big, splash.bias);
    // 0 at the fine end of the range, 1 at the coarse.
    const size = (radius - small) / Math.max(big - small, 1e-9);
    // Tilted slightly toward the coarse end, where the measured energy sits, and
    // left nearly flat: damping is superlinear in frequency, so a big bubble's
    // longer ring-down is already most of a fortyfold advantage.
    const level = splash.level * force * energy * rand(0.35, 1) * (1.22 - 0.36 * size);
    if (level < 0.0015) continue;

    popBubble(context, target, at + t, {
      radius,
      level,
      damping: splash.damping,
      cycles: splash.cycles,
    });
  }
}

interface Chain {
  bank: ModalBank;
  gritBed: ParticleBed | null;
}

export class Footsteps {
  /** Surface underfoot. Set from the zone the player is in. */
  surface: SurfaceName = 'soil';

  private readonly engine: AudioEngine;
  private readonly output: GainNode;
  private readonly body: BiquadFilterNode;
  private readonly panner: StereoPannerNode;
  private readonly reverbSend: GainNode;
  /** Built on first use and kept — resonators are the ground, not the step. */
  private readonly chains = new Map<SurfaceName, Chain>();
  /** Which foot the *next* footfall belongs to. Toggled as each one is used. */
  private left = false;
  /** Last footfall's sideways component, for spotting a strafe starting. */
  private lastLateral = 0;

  constructor(engine: AudioEngine, gain = 0.55) {
    this.engine = engine;
    const context = engine.context;

    this.output = context.createGain();
    this.output.gain.value = gain;

    // Your own feet are below your ears and nothing here is spatialised, so the
    // only cue for where they are is spectrum. Rolling the top off is what puts
    // them at floor level.
    this.body = context.createBiquadFilter();
    this.body.type = 'lowpass';
    this.body.frequency.value = 5200;
    this.body.Q.value = 0.6;

    this.panner = context.createStereoPanner();
    this.reverbSend = context.createGain();
    this.reverbSend.gain.value = 0.6;

    this.output.connect(this.body);
    this.body.connect(this.panner);
    this.panner.connect(engine.steps);
    // A little reverb, so your own steps tell you what room you are in. Through
    // its own gain because a long tail on something at zero distance reads as a
    // cave rather than a hall.
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

  /** Fired by the controller once per footfall. */
  step(step: Footfall): void {
    const context = this.engine.context;
    if (context.state !== 'running' || !this.engine.noise) return;

    const surface = SURFACES[this.surface];
    const chain = this.chainFor(this.surface);
    const at = context.currentTime + 0.004;
    const { speed, right, forward } = step;

    // Saturating rather than linear. Loudness is perceived logarithmically, so
    // a linear map on speed overshoots badly at the top end.
    const weight =
      SOFTEST + (1 - SOFTEST) * (1 - Math.exp(-speed / (FULL_WEIGHT_SPEED * 0.45)));
    const force = surface.level * Math.min(weight, 1);

    // Entering a strafe, start on the foot that reaches out.
    const lateral = Math.abs(right);
    if (lateral > 0.5 && this.lastLateral <= 0.5 && right !== 0) {
      this.left = right < 0;
    }
    this.lastLateral = lateral;

    // Alternate feet. Steps dead centre sound like one foot hopping.
    const foot = this.takeFoot();
    this.panner.pan.setValueAtTime(foot * panFor(right, forward, foot), at);

    // The gap closes as you speed up, until at a sprint the two contacts fuse.
    const gesture: Gesture = {
      at,
      gap: surface.roll * Math.max(0.35, 1 - speed / 12),
      force,
      drag: dragFor(speed),
    };
    const [first, second] = gaitFor(right, forward, foot, surface.toe);

    this.strike(chain, surface, gesture, { ...first, level: first.level * rand(0.9, 1.1) });
    if (second.level > 0) {
      this.strike(chain, surface, gesture, { ...second, level: second.level * rand(0.8, 1.1) });
    }
  }

  /**
   * Touching down after a fall or a jump. Both feet at once, so it is centred
   * and unrolled, and its weight comes from fall speed rather than travel speed.
   */
  land(impact: number, horizontal = 0): void {
    const context = this.engine.context;
    if (context.state !== 'running' || !this.engine.noise) return;

    const surface = SURFACES[this.surface];
    const chain = this.chainFor(this.surface);
    const at = context.currentTime + 0.004;

    const weight = Math.min(impact / LANDING_FULL, 1);
    const force = surface.level * (0.7 + weight * 0.85);

    this.panner.pan.setValueAtTime(0, at);

    // Feet never quite arrive together. Shear comes from how fast you were
    // travelling sideways, not from how fast you fell.
    const gesture: Gesture = {
      at,
      gap: rand(0.012, 0.03),
      force,
      drag: dragFor(horizontal),
    };
    const [first, second] = LANDING;
    this.strike(chain, surface, gesture, first);
    this.strike(chain, surface, gesture, {
      ...second,
      level: second.level * rand(0.8, 1.2),
    });

    // The foot cycle is left alone: a landing is on both feet, and the jump
    // before it already advanced the gait.
  }

  /**
   * Pushing off into a jump. The transient stretches into a scrape, the body
   * barely rings because nothing struck it, and the grit scales up. Takes the
   * next foot in the cycle, so the gait carries straight through a jump.
   */
  jump(speed = 0): void {
    const context = this.engine.context;
    if (context.state !== 'running' || !this.engine.noise) return;

    const surface = SURFACES[this.surface];
    const chain = this.chainFor(this.surface);
    const at = context.currentTime + 0.004;

    this.panner.pan.setValueAtTime(this.takeFoot() * 0.12, at);
    // A push-off is nearly all shear even standing still, so this floors well
    // above zero and still rewards a run-up.
    this.strike(
      chain,
      surface,
      { at, gap: 0, force: surface.level * rand(0.42, 0.55), drag: 0.5 + dragFor(speed) * 0.7 },
      PUSH,
    );
  }

  /** Takes the next foot and advances the cycle. -1 left, +1 right. */
  private takeFoot(): -1 | 1 {
    const foot: -1 | 1 = this.left ? -1 : 1;
    this.left = !this.left;
    return foot;
  }

  /** One contact: transient, crush, modal ring, grit and splash. */
  private strike(chain: Chain, surface: Surface, gesture: Gesture, shape: Contact): void {
    const context = this.engine.context;
    const noise = this.engine.noise;
    if (!noise) return;

    const contact = settle(shape);
    const at = gesture.at + contact.at * gesture.gap;
    const level = gesture.force * contact.level;

    // How much loose material this contact actually moves: partly weight,
    // partly speed, in the proportion the material sets. See `Surface.scuff`.
    const scuffing = 1 - surface.scuff + surface.scuff * gesture.drag;

    // Built per contact, so brightness can follow the gesture. The resonators
    // below stay cached: their ring-down is state.
    const filter = context.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = surface.impact.tone * contact.tone;
    filter.Q.value = surface.impact.q ?? 1;
    filter.connect(this.output);

    // The bottom of the band, when the material has one. Not scaled by
    // `contact.tone` as the top is: the bottom is a fact about the material.
    let entry: AudioNode = filter;
    if (surface.impact.low) {
      const shelf = context.createBiquadFilter();
      shelf.type = 'highpass';
      shelf.frequency.value = surface.impact.low;
      shelf.Q.value = 0.7;
      shelf.connect(filter);
      entry = shelf;
    }

    // A single short excitation feeds the transient and every resonator alike.
    excite(
      context,
      noise.white,
      entry,
      at,
      level * surface.impact.level,
      surface.impact.duration * contact.stretch,
      surface.impact.attack === undefined ? undefined : surface.impact.attack * contact.stretch,
    );

    // The give. Straight to the output: `crush` builds its own sweeping band.
    // A scrape compresses nothing, so `stretch` shortens and quietens it.
    if (surface.crush) {
      const press = 1 / Math.max(1, contact.stretch);
      crush(context, noise.white, this.output, at, level * surface.crush.level * press, {
        duration: surface.crush.duration * (0.7 + 0.3 * Math.min(contact.stretch, 1.6)),
        from: surface.crush.from,
        to: surface.crush.to,
        q: surface.crush.q,
        rise: surface.crush.rise,
        band: surface.crush.band,
        rough: surface.crush.rough,
      });
    }

    // In excitation mode the ring-down lives in the burst, so each mode is fed
    // one its own length — and always a strike, whatever the contact's rise.
    for (let i = 0; i < surface.modes.length; i++) {
      const mode = surface.modes[i];
      excite(
        context,
        noise.white,
        chain.bank.inputs[i],
        at,
        level * mode.level * contact.modes,
        mode.decay * MODE_EXCITATION,
      );
    }

    // Shear moves more pieces further and only incidentally louder, so most of
    // the variation goes into `count` and `over` rather than into level.
    if (surface.grit && chain.gritBed) {
      const thrown: Grit = {
        ...surface.grit,
        count: Math.max(1, Math.round(surface.grit.count * (0.35 + 0.65 * scuffing))),
        over: surface.grit.over * (0.5 + 0.5 * scuffing),
      };
      scatterParticles(
        context,
        noise.white,
        chain.gritBed,
        thrown,
        at,
        level * contact.grit * (0.75 + 0.25 * scuffing),
      );
    }

    // The same, wet.
    if (surface.splash) {
      // Count follows the contact as well as the speed.
      const thrown: Splash = {
        ...surface.splash,
        count: Math.max(
          1,
          Math.round(surface.splash.count * (0.35 + 0.65 * scuffing) * Math.min(contact.level, 1)),
        ),
        over: surface.splash.over * (0.6 + 0.4 * scuffing),
      };
      scatterBubbles(context, this.output, thrown, at, level * contact.grit * (0.75 + 0.25 * scuffing));
    }
  }

  private chainFor(name: SurfaceName): Chain {
    const existing = this.chains.get(name);
    if (existing) return existing;

    const context = this.engine.context;
    const surface: Surface = SURFACES[name];

    const bank = createModalBank(context, surface.modes, this.output, BANK);

    let gritBed: ParticleBed | null = null;
    if (surface.grit) {
      gritBed = createParticleBed(context, surface.grit, this.output);
    }

    const chain: Chain = { bank, gritBed };
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
