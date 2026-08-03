import type { AudioEngine } from '../AudioEngine';
import { createModalBank, type ModalBank, type ModalOptions } from '../dsp/modal';
import { createParticleBed, scatterParticles, type Particles } from '../dsp/phisem';
import { excite, crush } from '../dsp/impact';
import { popBubble, bubbleRadius } from '../dsp/bubble';

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
 * Four engines here, mixed per material:
 *
 * - **Impact.** A short *band-limited* noise transient. The strike itself, and
 *   the band it occupies is most of what the material is — see `Surface`.
 * - **Crush** (soft, granular). The material packing under the foot after
 *   contact, over a tenth of a second, with the band climbing as it closes.
 *   Snow, moss, mud, sand and earth make most of their noise this way and none
 *   of it by being struck.
 * - **Modal ring** (solid). Parallel bandpasses excited by that impulse, each
 *   ringing down at its own rate. This is what makes wood sound hollow and
 *   stone sound dead. The ring-down lives in the excitation envelope rather
 *   than in the filter's Q — see `BANK`, which is where that was corrected.
 * - **Grit** (aggregate), which is PhISEM. A stone or a leaf underfoot is not
 *   one event but dozens of tiny collisions, and the system's energy decays
 *   exponentially while collisions keep happening at random intervals within
 *   it. Cook's insight is that this is enough — no particle simulation, just
 *   an exponentially falling excitation of a resonator at Poisson intervals.
 *   How much of it a step throws depends on how fast you are moving — see
 *   `Surface.scuff` and `dragFor`.
 * - **Splash** (liquid). Entrained air, which rings and climbs in pitch as it
 *   collapses. Only the shallows and, sparsely and much lower, mud.
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

/**
 * Loose material underfoot. See `dsp/phisem.ts` — this is Cook's model, and
 * the field names line up with `Particles` deliberately.
 */
type Grit = Particles;

/**
 * Air dragged under by a foot going into water. See `dsp/bubble.ts`.
 *
 * A fourth engine, and only the shallows use it. A bubble's pitch *rises* as it
 * collapses, and that climb is the whole difference between water and a blip —
 * neither the impact nor the particle bed can produce it, which is why `mud`
 * has never been a splash.
 */
interface Splash {
  /** Bubbles entrained. */
  count: number;
  /** Seconds they are spread over. */
  over: number;
  /** Radius bounds in metres. 0.3 mm is spray, 8 mm the bottom of a pour. */
  radius: readonly [number, number];
  level: number;
}

/** The material packing under the foot. See `dsp/impact.ts`. */
interface Crush {
  level: number;
  /** Seconds. An order of magnitude longer than an impact. */
  duration: number;
  /** Band at first contact, and where it has climbed to once packed. */
  from: number;
  to: number;
  /** Sharpness. Above about 4 the climb reads as a squeak. */
  q: number;
}

export interface Surface {
  /** Overall level, before the speed curve. */
  level: number;
  impact: {
    level: number;
    /** Seconds. Hard surfaces are brief, soft ones smear. */
    duration: number;
    /**
     * **The band the contact noise occupies**, in Hz — and most of a
     * material's identity lives here rather than in any of the engines below.
     *
     * `low` is the one that was missing, and its absence is why every soft
     * surface used to sound like a board: a lowpass alone says "everything
     * under 1 kHz", which includes a thump that grass and moss physically
     * cannot make. Set it and the plank is gone before any other change.
     */
    low?: number;
    tone: number;
    /**
     * Resonance of the band. Below 0.7 there is no peak at all.
     *
     * Default 1, which puts a gentle emphasis at the cutoff — fine for a hard
     * surface, where the contact genuinely has a pitch, and wrong for a soft
     * one, where it reads as a small tuned tap under the noise.
     */
    q?: number;
  };
  /** Loose or soft materials pack under load. Solid ones do not. */
  crush?: Crush;
  /** Solid materials ring. Loose and soft ones do not — see `RINGS`. */
  modes: readonly Mode[];
  /** Aggregate materials crunch. Solid ones do not. */
  grit: Grit | null;
  /** Standing water. Nothing else has it. */
  splash?: Splash;
  /**
   * How much the loose material answers to being **dragged** rather than
   * pressed, 0..1.
   *
   * A footfall is two forces, not one: a normal force that arrives and a
   * tangential one that shears along the ground. Level follows the first;
   * *scuffing* follows the second, and until now nothing did. So creeping
   * across gravel threw exactly as much stone as sprinting across it, only
   * quieter — which is the thing a player notices immediately and cannot name.
   *
   * At 0 the loose material is speed-blind: a flagstone's trace of dust is
   * there whether you creep or run. At 1 it is almost entirely shear: gravel
   * standing still barely moves, and gravel at a sprint is thrown. See `drag`.
   */
  scuff: number;
  /** Level of the toe-off relative to the heel strike. */
  toe: number;
  /** Seconds between heel and toe at walking pace. Shrinks as you speed up. */
  roll: number;
}

/**
 * The surfaces allowed to have modes at all.
 *
 * **A loose or soft material does not ring**, and a mode on one is a plank
 * underneath it — which is precisely how every surface in this table came to
 * sound like a boarded floor. Earth had a mode at 120 Hz ringing for 50 ms,
 * mud one at 240, snow one at 2100; none of the three is a body that can
 * vibrate freely, and all three read as a box.
 *
 * Held as a list rather than as a flag on each surface because it is the sort
 * of judgement that only makes sense compared across the whole table, the way
 * `art/flex.ts` holds species stiffness. `check:audio` enforces it.
 */
export const RINGS: readonly string[] = [
  'stone',
  'cobble-fixed',
  'wood',
  'metal-solid',
  'metal-ring',
  'metal-hollow',
];

/**
 * How the modal bank is built, and it used to be built wrong both ways.
 *
 * `'filter'` spent each mode's decay in the resonator's Q, which for metal's
 * half-second modes wants 750 and clamped at 220 — a bandpass two hertz wide,
 * which is a sine with a rumour of noise in it and carries no material
 * information at all. Every mode in the table but earth's was past the
 * threshold `modal.ts` names. And `'inverse'` divided by `sqrt(Q)` where the
 * physics calls for multiplying by it, so the sharpest modes came out quietest.
 *
 * Both corrected together, because they have to move together: the ratio
 * between the two compensations is Q itself, and switching one alone is 41 dB
 * on stone. The `level` figures in `SURFACES` were then put through the
 * loudness-neutral transform `level × (1/√Q_old) / √Q_new`, so the bank comes
 * out where it already sat with the timbre corrected — which is the change that
 * was actually wanted. `check:audio` asserts that transform still holds.
 */
export const BANK: ModalOptions = { ring: 'excitation', compensation: 'energy' };

/**
 * Excitation length per mode, as a fraction of its decay.
 *
 * `excite` stretches its envelope to 1.6× the duration it is given, so this
 * lands the audible tail on the mode's own decay. A flat click here — which is
 * what a filter-mode bank wants — produces a bank with no ring at all.
 */
const MODE_EXCITATION = 0.625;

/**
 * The materials.
 *
 * ## Adding one
 *
 * Four questions, in this order. The first is most of the answer and the last
 * is the one that goes wrong.
 *
 * 1. **What band does the contact noise occupy?** `impact.low` to `impact.tone`.
 *    A surface is mostly its band: grass lives from 380 Hz up and has no thump
 *    available to it, earth lives from 90 Hz up and is nearly all thump. Get
 *    this wrong and nothing below fixes it.
 * 2. **Does it give under you?** `crush`. Anything a foot sinks into — snow,
 *    moss, mud, sand, earth — makes most of its noise *after* contact, packing
 *    rather than being struck.
 * 3. **Is it made of loose pieces, and how big are they?** `grit`. The whole
 *    family from sand to rubble is one axis: many small high events, or few
 *    large low ones. And `scuff` says how much of that answers to speed rather
 *    than to weight.
 * 4. **Is it a solid body free to vibrate?** `modes` — and only then. This is
 *    the question that gets answered "yes" by mistake, which is how earth, mud
 *    and snow all ended up sounding like a boarded floor. See `RINGS`.
 *
 * Realism is not the standard; **distinction is**. Moss underfoot is inaudible
 * in a field and has a voice here, because a surface the player cannot hear is
 * a surface that does not exist. What must be true is that no two of these can
 * be confused with each other.
 */
export const SURFACES = {
  /**
   * Flagstone. Hard and dead, and softer than it reads on paper.
   *
   * Bedded in sand, so it barely rings: two modes, both short enough to be a
   * tick rather than a tone. The top mode is gone and the band has come down —
   * a boot on a slab is a broad, dull event, and the brightness that was here
   * was a fingernail on tile.
   */
  stone: {
    level: 0.5,
    impact: { level: 0.95, duration: 0.015, low: 180, tone: 2400, q: 0.9 },
    modes: [
      { hz: 560, decay: 0.03, level: 0.055 },
      { hz: 1240, decay: 0.017, level: 0.03 },
    ],
    grit: { count: 4, over: 0.05, energyDecay: 0.02, hz: 2200, q: 1.2, level: 0.1 },
    scuff: 0.25,
    toe: 0.45,
    roll: 0.075,
  },

  /**
   * Setts, bedded and pointed. A made road you cannot kick anything off.
   *
   * A sett is a small stone, so it knocks higher and dies faster than a slab,
   * and there is nothing loose on it beyond the sand in the joints. The whole
   * difference from `cobble-loose` is that: same stone, one of them fixed.
   */
  'cobble-fixed': {
    level: 0.48,
    impact: { level: 0.9, duration: 0.016, low: 160, tone: 2000, q: 0.85 },
    modes: [{ hz: 760, decay: 0.022, level: 0.048 }],
    grit: { count: 3, over: 0.04, energyDecay: 0.018, hz: 2600, q: 1.1, level: 0.07 },
    scuff: 0.3,
    toe: 0.48,
    roll: 0.08,
  },

  /**
   * Broken stone, loose. The coarse end of the aggregate family.
   *
   * No modes: a heap of stones is not a body, and each piece's own knock comes
   * from the particle bed's resonance. What separates it from `gravel` is only
   * size — fewer, bigger, lower and spread further, because a large stone
   * takes longer to stop moving.
   */
  'cobble-loose': {
    level: 0.52,
    impact: { level: 0.6, duration: 0.013, low: 200, tone: 2600, q: 1 },
    modes: [],
    grit: { count: 11, over: 0.14, energyDecay: 0.055, hz: 1500, q: 1.9, level: 0.9 },
    scuff: 0.85,
    toe: 0.6,
    roll: 0.085,
  },

  /**
   * Loose stones. The one that is almost entirely PhISEM, and the reference
   * the rest of the aggregate family is sized against.
   */
  gravel: {
    level: 0.5,
    impact: { level: 0.45, duration: 0.012, low: 250, tone: 2400, q: 1 },
    modes: [],
    grit: { count: 26, over: 0.16, energyDecay: 0.06, hz: 3000, q: 1.4, level: 0.75 },
    // The most speed-sensitive thing in the table, and the case that motivated
    // the whole idea: gravel stood on is nearly still, gravel run over is
    // thrown several feet.
    scuff: 0.95,
    toe: 0.7,
    roll: 0.09,
  },

  /**
   * Dry sand. The fine end of the same family, and it packs as well as scatters.
   *
   * Many tiny grains rather than a few stones, so the count is up, the pitch is
   * up, the window is tight and the resonance is broad — a grain of sand has no
   * note of its own. The crush is what stops it being quiet gravel.
   */
  sand: {
    level: 0.42,
    impact: { level: 0.35, duration: 0.02, low: 400, tone: 4200, q: 0.7 },
    crush: { level: 0.22, duration: 0.07, from: 900, to: 1500, q: 1.2 },
    modes: [],
    grit: { count: 44, over: 0.09, energyDecay: 0.028, hz: 5200, q: 0.6, level: 0.62 },
    scuff: 0.8,
    toe: 0.55,
    roll: 0.09,
  },

  /**
   * Packed earth.
   *
   * **Its mode is gone**, and that was the whole fault: 120 Hz ringing for
   * 50 ms is a hollow box, and it made the default surface of the entire world
   * sound like a stage set. Soil does not ring. What is left is a low soft thud
   * with a little give in it and a few dry crumbs — which is what earth is.
   */
  earth: {
    level: 0.5,
    impact: { level: 1, duration: 0.03, low: 90, tone: 1000, q: 0.8 },
    crush: { level: 0.26, duration: 0.075, from: 240, to: 380, q: 1.5 },
    modes: [],
    grit: { count: 10, over: 0.06, energyDecay: 0.024, hz: 1800, q: 1.1, level: 0.24 },
    scuff: 0.5,
    toe: 0.4,
    roll: 0.085,
  },

  /**
   * Churned wet ground.
   *
   * Thick rather than watery: a low slap, a long slow squeeze as it gives, and
   * a very few large bubbles — large means low, so mud gloops where `water`
   * plinks. That contrast is deliberate and it is the same engine at both ends.
   */
  mud: {
    level: 0.52,
    impact: { level: 1, duration: 0.045, low: 70, tone: 850, q: 1.1 },
    crush: { level: 0.3, duration: 0.13, from: 190, to: 300, q: 2.4 },
    modes: [],
    grit: { count: 5, over: 0.07, energyDecay: 0.028, hz: 800, q: 3.4, level: 0.26 },
    splash: { count: 3, over: 0.09, radius: [0.004, 0.009], level: 0.09 },
    scuff: 0.45,
    toe: 0.3,
    roll: 0.1,
  },

  /**
   * Ankle-deep water.
   *
   * Bright and thin, which is the whole difference from mud: the band starts at
   * 500 Hz so there is no thump available at all, the spray is high and tight,
   * and the bubbles are small — small means high — and there are a lot of them.
   * A step into water is mostly air being dragged under.
   */
  water: {
    level: 0.55,
    impact: { level: 0.85, duration: 0.018, low: 500, tone: 6500, q: 0.7 },
    modes: [],
    grit: { count: 22, over: 0.08, energyDecay: 0.03, hz: 4800, q: 0.8, level: 0.45 },
    splash: { count: 16, over: 0.1, radius: [0.0005, 0.0028], level: 0.3 },
    // You kick water forward. Running through a ford throws a great deal more
    // of it than standing in one does.
    scuff: 0.9,
    toe: 0.55,
    roll: 0.095,
  },

  /**
   * Moss.
   *
   * A dry cushion. Almost nothing arrives — the impact is quiet, bandlimited
   * well clear of any thump, and has no resonance on its filter at all — and
   * almost everything is the squeeze afterwards. No grit, because there is
   * nothing loose in it, and no modes, because there is nothing under it.
   *
   * In a field this is inaudible. Here it is the quietest thing in the table
   * and still unmistakably itself, which is the trade this whole file makes.
   */
  moss: {
    level: 0.3,
    impact: { level: 0.4, duration: 0.05, low: 180, tone: 1100, q: 0.6 },
    crush: { level: 0.42, duration: 0.12, from: 320, to: 780, q: 1.3 },
    modes: [],
    grit: null,
    scuff: 0.35,
    toe: 0.45,
    roll: 0.1,
  },

  /**
   * Turf.
   *
   * Soft and high. The band starts at 380 Hz, which is what stops it reading as
   * a board; the grit is many small events in a tight window rather than a
   * scatter, which is the difference between a brush and a crunch; and a little
   * squeeze underneath is the ground it is growing on.
   */
  grass: {
    level: 0.38,
    impact: { level: 0.4, duration: 0.028, low: 380, tone: 2600, q: 0.7 },
    crush: { level: 0.22, duration: 0.08, from: 700, to: 1250, q: 1.1 },
    modes: [],
    grit: { count: 22, over: 0.075, energyDecay: 0.028, hz: 4000, q: 0.85, level: 0.5 },
    scuff: 0.6,
    toe: 0.6,
    roll: 0.085,
  },

  /**
   * Dry leaf litter.
   *
   * The crunch was right and the tail was not: at a fifth of a second spread it
   * sounded like the leaves were still moving long after the foot had stopped.
   * Leaves crunch and damp out, so the window is tight and the energy decay is
   * short — and the band reaches down to 260 Hz for the dry *oomph* underneath
   * the rattle, which is the layer that says a depth of them rather than a few
   * on a path.
   */
  leaves: {
    level: 0.44,
    impact: { level: 0.45, duration: 0.018, low: 260, tone: 3200, q: 0.9 },
    modes: [],
    grit: { count: 30, over: 0.1, energyDecay: 0.032, hz: 4200, q: 2.2, level: 0.62 },
    scuff: 0.75,
    toe: 0.7,
    roll: 0.09,
  },

  /**
   * Lying snow, trodden.
   *
   * **The mode is gone and the squeak moved into the crush**, which is where it
   * physically comes from: below about −5 °C the crystals shear against each
   * other instead of melting, and the band climbs as the pack closes. A narrow
   * band and a big climb is a squeak. A mode at 2100 Hz was a small bell.
   *
   * Snow compresses completely, so the impact is muffled almost to nothing and
   * the crush is the longest in the table.
   */
  snow: {
    level: 0.42,
    impact: { level: 0.5, duration: 0.05, low: 120, tone: 800, q: 0.7 },
    crush: { level: 0.34, duration: 0.15, from: 1000, to: 2600, q: 6.5 },
    modes: [],
    grit: { count: 26, over: 0.08, energyDecay: 0.026, hz: 2600, q: 1.2, level: 0.4 },
    scuff: 0.55,
    toe: 0.45,
    roll: 0.105,
  },

  /**
   * A boarded floor, and now the only soft-footed thing in the table that is
   * *supposed* to be hollow.
   *
   * Its modes are up by roughly three times against everything else coming
   * down, which is the point: wood was being out-planked by earth and mud. A
   * board over a void is one of the few surfaces a person walks on that really
   * is a body free to vibrate, and it should be obvious.
   */
  wood: {
    level: 0.6,
    impact: { level: 0.75, duration: 0.02, low: 110, tone: 1900, q: 1 },
    modes: [
      { hz: 150, decay: 0.26, level: 0.09 },
      { hz: 375, decay: 0.17, level: 0.05 },
      { hz: 690, decay: 0.085, level: 0.022 },
    ],
    grit: { count: 4, over: 0.045, energyDecay: 0.018, hz: 1200, q: 0.9, level: 0.07 },
    scuff: 0.2,
    toe: 0.6,
    roll: 0.085,
  },

  /**
   * Steel plate, bedded on something.
   *
   * The dull one. Metal is not a bright tap — that was the fault, a 4 ms
   * transient at 9 kHz over modes too quiet to hear, which is a zap and not a
   * clang. Here the plate is held so it cannot ring: short modes, a broad
   * contact with some weight low down, and it lands as a *bonk*.
   */
  'metal-solid': {
    level: 0.48,
    impact: { level: 0.9, duration: 0.009, low: 200, tone: 4600, q: 1 },
    modes: [
      { hz: 700, decay: 0.045, level: 0.055 },
      { hz: 1650, decay: 0.03, level: 0.035 },
      { hz: 3300, decay: 0.018, level: 0.018 },
    ],
    grit: null,
    scuff: 0.15,
    toe: 0.5,
    roll: 0.072,
  },

  /**
   * Grating, catwalk, ductwork — metal fixed at its ends, so the vibration runs
   * away along it.
   *
   * Bright and long. A walkway is stiff, so its modes sit high and stay up for
   * a third to half a second, and the clang carries rather than stopping where
   * the foot is. The one in the family you can hear somebody else walking on.
   */
  'metal-ring': {
    level: 0.52,
    impact: { level: 0.85, duration: 0.007, low: 250, tone: 7000, q: 1 },
    modes: [
      { hz: 640, decay: 0.5, level: 0.1 },
      { hz: 1490, decay: 0.4, level: 0.075 },
      { hz: 2870, decay: 0.26, level: 0.04 },
      { hz: 5300, decay: 0.14, level: 0.02 },
    ],
    grit: null,
    scuff: 0.15,
    toe: 0.5,
    roll: 0.07,
  },

  /**
   * An empty drum, a tank top, a hollow hatch cover.
   *
   * The boom. A low inharmonic fundamental carrying most of the energy, ringing
   * for the best part of a second — which is the one place in this file a mode
   * under 500 Hz with a long decay is correct rather than a mistake, because
   * the container really is a box with air in it.
   */
  'metal-hollow': {
    level: 0.55,
    impact: { level: 0.8, duration: 0.01, low: 90, tone: 4200, q: 1 },
    modes: [
      { hz: 105, decay: 0.75, level: 0.16 },
      { hz: 262, decay: 0.6, level: 0.1 },
      { hz: 518, decay: 0.45, level: 0.06 },
      { hz: 1150, decay: 0.28, level: 0.03 },
    ],
    grit: null,
    scuff: 0.15,
    toe: 0.5,
    roll: 0.075,
  },
} as const satisfies Record<string, Surface>;

export type SurfaceName = keyof typeof SURFACES;

/**
 * One contact of a foot with the ground, relative to the material.
 *
 * A step, a landing and a push-off are the same foot on the same ground; what
 * differs is how the contact is made. Every field is a multiplier, so a gesture
 * never carries a surface's numbers around with it.
 */
interface Contact {
  /** When, as a multiple of the gesture's gap. The first is always 0. */
  at: number;
  /** Level, as a multiple of the gesture's force. */
  level: number;
  /** Contact time, as a multiple of `impact.duration`. Softness. */
  stretch: number;
  /** How hard the body is rung. */
  modes: number;
  /** How much loose material is scuffed up. */
  grit: number;
  /** Brightness, as a multiple of `impact.tone`. */
  tone: number;
}

/** Two contacts to a footfall: something lands, something follows it down. */
type Gait = readonly [Contact, Contact];

/**
 * Bounds on a *composed* contact.
 *
 * Every field above is a multiplier and they stack, so the worst case is a
 * product nobody authored. Clamping once at the end keeps the tables readable
 * as physics rather than shaved down to survive combinations that never occur.
 */
const LIMITS = {
  level: [0, 1.4],
  // 3.2 rather than 3.0, because the push-off is authored at 3.2 and has been
  // signed off by ear there.
  stretch: [0.5, 3.2],
  modes: [0, 1.2],
  grit: [0, 2.5],
  tone: [0.35, 1.3],
} as const satisfies Record<string, readonly [number, number]>;

function bound(value: number, [min, max]: readonly [number, number]): number {
  return Math.min(Math.max(value, min), max);
}

/** Composed multipliers, bounded once. See `LIMITS`. */
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

/**
 * Heel, then toe. The toe's level comes from the surface's own `toe`.
 *
 * A toe-off is a push, not a hit: more scuff, less ring, slightly duller. As an
 * exact copy of the heel strike at a lower level it was the same event twice,
 * which is what gave quick walking its faintly doubled, clicky quality.
 */
const WALK: Gait = [PLAIN, { at: 1, level: 1, stretch: 1.15, modes: 0.7, grit: 1.25, tone: 0.9 }];

/** Both feet, a few milliseconds apart. */
const LANDING: Gait = [PLAIN, { ...PLAIN, at: 1, level: 0.5 }];

/**
 * The push-off — one contact, and it leaves rather than arrives. The transient
 * stretches into a scrape, nothing strikes the body, and pushing is what
 * scuffs a surface.
 */
const PUSH: Contact = { at: 0, level: 1, stretch: 3.2, modes: 0.28, grit: 1.7, tone: 1 };

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

/**
 * Speed at which shear reaches its nominal full value, in m/s.
 *
 * Just above walking pace, and **deliberately not saturating there** — the
 * whole point is that a sprint throws visibly more than a walk. `DRAG_MAX`
 * caps it well above 1 so running is genuinely more than walking rather than
 * a hair more.
 */
const DRAG_SPEED = 5.5;
const DRAG_MAX = 1.5;

/**
 * How hard a footfall shears along the ground, from how fast it is travelling.
 *
 * Kept separate from `weight` above, which is the *normal* force and saturates
 * hard by design — walk to sprint is under a decibel of level. Shear does not
 * saturate, because the difference between creeping over gravel and running
 * over it is not a difference in loudness at all. It is how much of the ground
 * comes with you.
 */
function dragFor(speed: number): number {
  return Math.min(Math.max(speed, 0) / DRAG_SPEED, DRAG_MAX);
}

/**
 * One footfall's worth of context, shared by both its contacts.
 *
 * Bundled rather than passed as five loose numbers because every one of them
 * is a property of the *gesture* and none of them is a property of the contact
 * — which is exactly the distinction `Contact` exists to draw.
 */
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
 * A burst of entrained air, Poisson-spaced the way the particle bed is.
 *
 * Straight to the output rather than through a bed: a bubble is already a tuned
 * oscillator and has no shared body to resonate in, which is exactly what makes
 * it unlike grit.
 */
function scatterBubbles(
  context: BaseAudioContext,
  target: AudioNode,
  splash: Splash,
  at: number,
  force: number,
): void {
  const rate = splash.count / Math.max(splash.over, 1e-3);
  let t = 0;
  for (let i = 0; i < splash.count; i++) {
    t += -Math.log(1 - Math.random() * 0.999 - 0.001) / rate;
    if (t > splash.over * 2.5) return;
    popBubble(context, target, at + t, {
      radius: bubbleRadius(splash.radius[0], splash.radius[1]),
      level: splash.level * force * rand(0.5, 1),
    });
  }
}

interface Chain {
  bank: ModalBank;
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

    // Heel then toe. The gap closes as you speed up, until at a sprint the two
    // are close enough to fuse into a single heavier event — which is what
    // running actually sounds like.
    const gesture: Gesture = {
      at,
      gap: surface.roll * Math.max(0.35, 1 - speed / 12),
      force,
      drag: dragFor(speed),
    };
    const [heel, toe] = WALK;

    this.strike(chain, surface, gesture, { ...heel, level: heel.level * rand(0.9, 1.1) });
    if (surface.toe > 0) {
      this.strike(chain, surface, gesture, { ...toe, level: surface.toe * rand(0.8, 1.1) });
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
  land(impact: number, horizontal = 0): void {
    const context = this.engine.context;
    if (context.state !== 'running' || !this.engine.noise) return;

    const surface = SURFACES[this.surface];
    const chain = this.chainFor(this.surface);
    const at = context.currentTime + 0.004;

    const weight = Math.min(impact / LANDING_FULL, 1);
    const force = surface.level * (0.7 + weight * 0.85);

    // Centred: you land on both feet.
    this.panner.pan.setValueAtTime(0, at);

    // Feet never quite arrive together, and the few milliseconds between them
    // are most of what stops a landing sounding like a single synthetic event.
    //
    // Shear comes from how fast you were travelling *sideways* when you
    // touched down, not from how fast you fell. A drop straight down throws
    // nothing; skimming in at a run throws everything — which is the skid, and
    // it is the same number a step uses for the same reason.
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
  jump(speed = 0): void {
    const context = this.engine.context;
    if (context.state !== 'running' || !this.engine.noise) return;

    const surface = SURFACES[this.surface];
    const chain = this.chainFor(this.surface);
    const at = context.currentTime + 0.004;

    this.panner.pan.setValueAtTime(this.takeFoot() * 0.12, at);
    // A push-off is nearly all shear even standing still — the sole drags as
    // the foot extends — so this floors well above zero and still rewards a
    // run-up. Driving off gravel at a sprint should throw it.
    this.strike(
      chain,
      surface,
      { at, gap: 0, force: surface.level * rand(0.42, 0.55), drag: 0.5 + dragFor(speed) * 0.7 },
      PUSH,
    );
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

  /**
   * One contact: transient, modal ring, and a burst of grit.
   *
   * @param base Audio-clock time of the gesture's first contact.
   * @param gap Seconds that the contact's `at` is measured in.
   * @param force The gesture's weight, before the contact's own `level`.
   */
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

    // **The impact filter is part of the step, not the ground**, so it is built
    // per contact and brightness can follow the gesture. The resonators below
    // stay cached: their ring-down is state, and the ground does not get new
    // resonances every time it is stepped on.
    const filter = context.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = surface.impact.tone * contact.tone;
    filter.Q.value = surface.impact.q ?? 1;
    filter.connect(this.output);

    // The bottom of the band, when the material has one.
    //
    // **Not scaled by `contact.tone`, unlike the top.** A duller contact has
    // less top end, which is a fact about how the foot landed; the bottom is a
    // fact about the material — grass cannot thump however heavily you tread
    // on it — and moving it with the gesture would let the plank back in on
    // exactly the soft surfaces this exists to keep it out of.
    let entry: AudioNode = filter;
    if (surface.impact.low) {
      const shelf = context.createBiquadFilter();
      shelf.type = 'highpass';
      shelf.frequency.value = surface.impact.low;
      shelf.Q.value = 0.7;
      shelf.connect(filter);
      entry = shelf;
    }

    // A single short excitation feeds both the transient and every resonator,
    // exactly as one physical impact would.
    excite(
      context,
      noise.white,
      entry,
      at,
      level * surface.impact.level,
      surface.impact.duration * contact.stretch,
    );

    // The give. Straight to the output: `crush` builds its own sweeping band,
    // because the climb is the effect and a fixed filter cannot carry it.
    if (surface.crush) {
      crush(context, noise.white, this.output, at, level * surface.crush.level, {
        duration: surface.crush.duration * contact.stretch,
        from: surface.crush.from,
        to: surface.crush.to,
        q: surface.crush.q,
      });
    }

    // Each mode is fed a burst its own length: in excitation mode the ring-down
    // lives here rather than in the filter, so a flat click would leave the
    // bank with no ring at all. See `MODE_EXCITATION`.
    for (let i = 0; i < surface.modes.length; i++) {
      const mode = surface.modes[i];
      excite(
        context,
        noise.white,
        chain.bank.inputs[i],
        at,
        level * mode.level * 0.5 * contact.modes,
        mode.decay * MODE_EXCITATION,
      );
    }

    if (surface.grit && chain.gritInput) {
      scatterParticles(
        context,
        noise.white,
        chain.gritInput,
        surface.grit,
        at,
        level * contact.grit * scuffing,
      );
    }

    // Scaled the same way for the same reason: water you kick is water you
    // hear, and running through a ford throws far more of it than standing in
    // one does.
    if (surface.splash) {
      scatterBubbles(context, this.output, surface.splash, at, level * contact.grit * scuffing);
    }
  }

  /** Builds and caches the resonator chain for a surface. */
  private chainFor(name: SurfaceName): Chain {
    const existing = this.chains.get(name);
    if (existing) return existing;

    const context = this.engine.context;
    const surface: Surface = SURFACES[name];

    const bank = createModalBank(context, surface.modes, this.output, BANK);

    let gritInput: GainNode | null = null;
    if (surface.grit) {
      gritInput = createParticleBed(context, surface.grit, this.output).input;
    }

    const chain: Chain = { bank, gritInput };
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
