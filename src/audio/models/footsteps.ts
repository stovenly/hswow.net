import type { AudioEngine } from '../AudioEngine';
import type { Footfall } from '../../player/Controller';
import { createModalBank, type ModalBank, type ModalOptions } from '../dsp/modal';
import { createParticleBed, scatterParticles, type Particles, type ParticleBed } from '../dsp/phisem';
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
    /**
     * How loud the contact is *relative to the engine that carries the
     * material*.
     *
     * On anything soft or loose this should be small. A surface that reads as
     * "the standard footstep with an effect on top" is one where this number is
     * fighting the grit or the modes instead of introducing them.
     */
    level: number;
    /** Seconds. Hard surfaces are brief, soft ones smear. */
    duration: number;
    /**
     * **Rise time in seconds, and the most important field here.**
     *
     * A millisecond is a strike — steel, stone, something being rung. Thirty is
     * a foot decelerating into snow, where nothing arrives suddenly because
     * nothing stops suddenly. Between the two the ear hears a different
     * *event*, not a differently coloured one, and nothing downstream can
     * convert one into the other.
     *
     * This was fixed at 1.2 ms for every material, which is why every surface
     * used to read as the same tap with things glued on: they were.
     */
    attack?: number;
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
  'metal-hollow-small',
  'metal-hollow-big',
];

/**
 * The surfaces allowed to be *boxy* — a mode low enough and long enough to be
 * a resonant cavity rather than a knock.
 *
 * Two things a person walks on qualify: a board over a void, and a steel
 * container with air in it. Anywhere else it is the plank fault under another
 * surface's name, which is why this is a licence and not an accident.
 */
export const HOLLOW: readonly string[] = ['wood', 'metal-hollow-small', 'metal-hollow-big'];

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
 * Five questions, in this order. The first two are most of the answer and the
 * last is the one that goes wrong.
 *
 * 1. **How fast does the contact arrive?** `impact.attack`. A millisecond is a
 *    strike; fifty is a foot decelerating into something that gives. This is
 *    the difference between two *events*, not two colours of one, and getting
 *    it wrong is why every surface once read as the same tap with things glued
 *    on top.
 * 2. **What band does the contact occupy?** `impact.low` to `impact.tone`.
 *    Grass lives from 450 Hz up and has no thump available to it; earth lives
 *    from 100 up and is nearly all thump.
 * 3. **Does it give under you?** `crush`. Anything a foot sinks into makes most
 *    of its noise *after* contact, packing rather than being struck.
 * 4. **Is it made of loose pieces, how big, and how varied?** `grit` — and
 *    `voices`, because one resonance means every piece is the same piece, which
 *    reads as a loop over any window long enough to hear. `scuff` says how much
 *    of it answers to speed rather than to weight.
 * 5. **Is it a solid body free to vibrate?** `modes` — and only then. See
 *    `RINGS`.
 *
 * **The impact is the contact, not the sound.** On anything soft or loose it
 * should be barely audible by itself; the engine carrying the material's
 * identity should be several times louder. Where a surface reads as "the
 * standard footstep with an effect on it", this balance is the fault.
 *
 * Realism is not the standard; **distinction is**. Moss underfoot is inaudible
 * in a field and has a voice here, because a surface the player cannot hear is
 * a surface that does not exist. What must be true is that no two of these can
 * be confused with each other.
 */
export const SURFACES = {
  /**
   * Flagstone. A flat slab takes the whole foot at once, which makes it the most
   * *defined* surface in the table — one contact, one crack, a definite pitch.
   * Everything else is either several contacts or none.
   */
  stone: {
    level: 0.48,
    impact: { level: 0.75, duration: 0.014, low: 200, tone: 2400, q: 1, attack: 0.0016 },
    modes: [
      { hz: 600, decay: 0.034, level: 0.12 },
      { hz: 1380, decay: 0.019, level: 0.06 },
    ],
    grit: { count: 4, over: 0.05, energyDecay: 0.02, hz: 2200, q: 1.2, level: 0.09 },
    scuff: 0.25,
    toe: 0.45,
    roll: 0.075,
  },

  /**
   * Setts, bedded and pointed.
   *
   * **Blunter than a flagstone, not brighter**, which is the opposite of the
   * obvious guess. A cobbled road never takes the whole sole: the foot bridges
   * two or three stones and the joints between them stay empty, so instead of
   * one clean contact there are several small ones a few milliseconds apart and
   * nothing crisp. The grit here is not loose material — there is none — it is
   * those partial contacts, pitched where small stones knock.
   */
  'cobble-fixed': {
    level: 0.44,
    impact: { level: 0.5, duration: 0.022, low: 160, tone: 1650, q: 0.75, attack: 0.0045 },
    modes: [{ hz: 790, decay: 0.021, level: 0.08 }],
    grit: { count: 7, over: 0.055, energyDecay: 0.022, hz: 1700, q: 1.6, level: 0.28, voices: 3, spread: 0.35 },
    scuff: 0.25,
    toe: 0.5,
    roll: 0.08,
  },

  /**
   * Broken stone, loose — a track rather than a road. Nearly all particle bed,
   * and only the size of the pieces separates it from gravel: fewer, bigger,
   * lower and spread further, because a large stone takes longer to stop.
   */
  'cobble-loose': {
    level: 0.5,
    impact: { level: 0.3, duration: 0.015, low: 210, tone: 2200, q: 0.9, attack: 0.005 },
    modes: [],
    grit: { count: 13, over: 0.19, energyDecay: 0.07, hz: 1500, q: 1.9, level: 0.95, voices: 4, spread: 0.6 },
    scuff: 0.9,
    toe: 0.6,
    roll: 0.085,
  },

  /**
   * Loose stones, and the reference the rest of the aggregate family is sized
   * against.
   *
   * **Five voices, spread wide.** A gravel path is not one grade of stone; it
   * runs from grit to knuckle-sized, and a single shared resonance made every
   * piece the same piece — fine over a short scuff and unmistakably a loop over
   * the long scatter this surface wants. The scatter itself stretches further
   * the faster you are going. See `scuff`.
   */
  gravel: {
    level: 0.5,
    impact: { level: 0.26, duration: 0.012, low: 260, tone: 2400, q: 0.9, attack: 0.004 },
    modes: [],
    grit: { count: 28, over: 0.22, energyDecay: 0.075, hz: 2800, q: 1.5, level: 0.8, voices: 5, spread: 0.75 },
    scuff: 0.95,
    toe: 0.7,
    roll: 0.09,
  },

  /**
   * Dry sand. The fine end of the family, and it packs as well as it scatters.
   *
   * A swish, not a crunch: a great many tiny grains, a broad resonance because
   * a grain of sand has no note of its own, and a slow arrival because the foot
   * keeps sinking. Nothing here is solid.
   */
  sand: {
    level: 0.3,
    impact: { level: 0.1, duration: 0.035, low: 350, tone: 2800, q: 0.5, attack: 0.024 },
    crush: { level: 0.26, duration: 0.1, from: 650, to: 950, q: 0.8 },
    modes: [],
    grit: { count: 54, over: 0.11, energyDecay: 0.034, hz: 3400, q: 0.5, level: 0.5, voices: 3, spread: 0.5 },
    scuff: 0.8,
    toe: 0.55,
    roll: 0.09,
  },

  /**
   * Packed earth — soft, muffled, and coarse.
   *
   * Built on snow rather than on anything hard: nothing arrives, the ground
   * absorbs a foot instead of resisting it, and the pack closes afterwards.
   * What separates it is the crumbs, which are bigger and drier than snow's
   * grains and sit low enough to read as soil.
   */
  earth: {
    level: 0.42,
    impact: { level: 0.14, duration: 0.05, low: 100, tone: 900, q: 0.55, attack: 0.03 },
    crush: { level: 0.3, duration: 0.11, from: 260, to: 400, q: 1.2 },
    modes: [],
    grit: { count: 16, over: 0.075, energyDecay: 0.028, hz: 1700, q: 1.6, level: 0.34, voices: 3, spread: 0.55 },
    scuff: 0.5,
    toe: 0.4,
    roll: 0.085,
  },

  /**
   * Churned wet ground. **A squelch, which is almost entirely give.**
   *
   * The contact is a tenth of the crush and takes thirty-five milliseconds to
   * happen, so there is nothing to tap. What you hear is the ground closing
   * around a foot, a wet spatter through it, and a handful of mid-sized bubbles
   * — mid, because big ones read as a drain and small ones read as water.
   *
   * `water` is the same three engines with every setting at the other end, and
   * the pair only works if both stay there: mud is slow, low and long, water is
   * fast, high and short.
   */
  mud: {
    level: 0.5,
    impact: { level: 0.12, duration: 0.055, low: 90, tone: 1100, q: 0.55, attack: 0.036 },
    crush: { level: 0.5, duration: 0.17, from: 240, to: 460, q: 2.6 },
    modes: [],
    grit: { count: 12, over: 0.1, energyDecay: 0.035, hz: 2200, q: 1.2, level: 0.34, voices: 2, spread: 0.4 },
    splash: { count: 8, over: 0.13, radius: [0.0015, 0.0045], level: 0.22 },
    scuff: 0.5,
    toe: 0.3,
    roll: 0.11,
  },

  /**
   * An inch of standing water. **Light, bright and fast.**
   *
   * Nothing below 900 Hz, a contact at a fifth of the spray over it, and twenty
   * small bubbles — small means high, so these are plinks rather than gloops.
   * A step into shallow water is spray thrown and air dragged under, and only
   * incidentally a contact with the ground beneath it.
   *
   * There is no `crush` here on purpose. Water does not pack; it gets out of
   * the way, and a give on this is the single thing that makes it read as mud.
   */
  water: {
    level: 0.5,
    impact: { level: 0.18, duration: 0.008, low: 900, tone: 9000, q: 0.5, attack: 0.0025 },
    modes: [],
    grit: { count: 34, over: 0.055, energyDecay: 0.02, hz: 6500, q: 0.55, level: 0.5, voices: 3, spread: 0.45 },
    splash: { count: 20, over: 0.07, radius: [0.0003, 0.0015], level: 0.4 },
    scuff: 0.95,
    toe: 0.6,
    roll: 0.08,
  },

  /**
   * Moss. The quietest thing in the table and still unmistakably itself.
   *
   * A dry cushion: fifty milliseconds to arrive, nothing loose in it, nothing
   * underneath that rings, and a squeeze so broad it has no texture at all —
   * moss packs evenly rather than shearing, so the band barely moves and the
   * filter is well under any resonance. Very nearly all crush, and the model
   * `snow` is built on.
   */
  moss: {
    level: 0.22,
    impact: { level: 0.09, duration: 0.07, low: 160, tone: 800, q: 0.5, attack: 0.05 },
    crush: { level: 0.3, duration: 0.16, from: 240, to: 380, q: 0.7 },
    modes: [],
    grit: null,
    scuff: 0.3,
    toe: 0.4,
    roll: 0.105,
  },

  /**
   * Turf. Soft, high, and a brush rather than a contact.
   *
   * The band starts at 450 Hz, which keeps any board out of it, and the grit is
   * many small events in a tight window — the difference between a brush and a
   * crunch is spread, not level.
   */
  grass: {
    level: 0.3,
    impact: { level: 0.12, duration: 0.04, low: 450, tone: 2200, q: 0.5, attack: 0.018 },
    crush: { level: 0.2, duration: 0.09, from: 550, to: 850, q: 0.9 },
    modes: [],
    grit: { count: 28, over: 0.08, energyDecay: 0.028, hz: 3200, q: 0.8, level: 0.45, voices: 3, spread: 0.4 },
    scuff: 0.6,
    toe: 0.6,
    roll: 0.085,
  },

  /**
   * Dry leaf litter. **Squishy and crisp, in that order.**
   *
   * A leaf layer is mostly air, so a foot meets nothing solid for sixteen
   * milliseconds, then compresses the whole depth of it — that is the squish —
   * and the crackle rides on top rather than underneath. Sharper voices than
   * anything else in the table, because a dry leaf really does have a note, and
   * several of them at once because a leaf layer is not one size of leaf.
   */
  leaves: {
    level: 0.46,
    impact: { level: 0.11, duration: 0.03, low: 400, tone: 3600, q: 0.6, attack: 0.016 },
    crush: { level: 0.2, duration: 0.09, from: 900, to: 1500, q: 1.2 },
    modes: [],
    grit: { count: 36, over: 0.09, energyDecay: 0.028, hz: 4600, q: 2.6, level: 0.75, voices: 4, spread: 0.5 },
    scuff: 0.75,
    toe: 0.7,
    roll: 0.09,
  },

  /**
   * Lying snow — soft, deep and cold.
   *
   * Built on moss, which is what it should always have been: a long soft pack
   * with almost no arrival. The grains are many, fine and broad, so they read
   * as compaction rather than as a crunch, and the crush underneath them is the
   * whole depth closing. A swept sharp filter was tried here for the squeak and
   * it is a whistle, not snow.
   */
  snow: {
    level: 0.36,
    impact: { level: 0.1, duration: 0.06, low: 140, tone: 850, q: 0.5, attack: 0.038 },
    crush: { level: 0.34, duration: 0.15, from: 420, to: 760, q: 1 },
    modes: [],
    grit: { count: 52, over: 0.1, energyDecay: 0.03, hz: 2400, q: 0.9, level: 0.38, voices: 3, spread: 0.4 },
    scuff: 0.5,
    toe: 0.4,
    roll: 0.11,
  },

  /**
   * A boarded floor — **a thick plank over a void, not a stack of ply**.
   *
   * The difference is where the energy sits. Thin sheets ring high and briefly
   * and buzz against each other; a heavy board carries a low, long, woody
   * fundamental with its partials dying away fast. So the fundamental is strong
   * and at 132 Hz for a third of a second, everything above it falls away
   * quickly, and the contact is a quarter of the ring rather than the other way
   * round — a plank is heard through the board, not on top of it.
   */
  wood: {
    level: 0.58,
    impact: { level: 0.24, duration: 0.026, low: 80, tone: 1100, q: 0.8, attack: 0.004 },
    modes: [
      { hz: 132, decay: 0.32, level: 0.26 },
      { hz: 268, decay: 0.24, level: 0.17 },
      { hz: 505, decay: 0.13, level: 0.075 },
      { hz: 940, decay: 0.06, level: 0.03 },
    ],
    grit: { count: 4, over: 0.045, energyDecay: 0.018, hz: 1200, q: 0.9, level: 0.06 },
    scuff: 0.2,
    toe: 0.6,
    roll: 0.085,
  },

  /**
   * Sheet metal, bedded — an aluminium plate or a tread panel.
   *
   * **High and inharmonic, not low and dull.** A sheet is thin and stiff: it
   * has no deep tone in it at all, and what it does have sits in the upper
   * midrange and above, ringing briefly and slightly out of tune with itself.
   * That inharmonicity is most of what says metal rather than tile. The
   * contact is resonant on its own filter too, so even the first four
   * milliseconds are pitched.
   */
  'metal-solid': {
    level: 0.46,
    impact: { level: 0.2, duration: 0.004, low: 500, tone: 8000, q: 1.8, attack: 0.0006 },
    modes: [
      { hz: 1180, decay: 0.09, level: 0.34 },
      { hz: 2450, decay: 0.07, level: 0.26 },
      { hz: 4300, decay: 0.045, level: 0.16 },
      { hz: 6800, decay: 0.028, level: 0.09 },
    ],
    grit: null,
    scuff: 0.15,
    toe: 0.5,
    roll: 0.072,
  },

  /**
   * Grating, catwalk, ductwork — fixed at its ends, so the vibration runs away
   * along it and comes back. High and long.
   */
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

  /**
   * A pipe, a duct, a small drum — hollow, but not much of a volume.
   *
   * The same box as its big brother an octave and a half up and half as long.
   * Size in a hollow body reads almost entirely as pitch and ring-down, which
   * is why these are worth having as a pair: a bang that says *small container*
   * is a completely different piece of information from one that says *tank*,
   * and nothing else in the kit carries it.
   */
  'metal-hollow-small': {
    level: 0.46,
    impact: { level: 0.16, duration: 0.005, low: 200, tone: 6000, q: 1.2, attack: 0.0008 },
    modes: [
      { hz: 290, decay: 0.42, level: 0.4 },
      { hz: 660, decay: 0.34, level: 0.26 },
      { hz: 1240, decay: 0.24, level: 0.15 },
      { hz: 2500, decay: 0.15, level: 0.08 },
    ],
    grit: null,
    scuff: 0.15,
    toe: 0.5,
    roll: 0.072,
  },

  /**
   * An empty tank, a hopper, a container roof. **One big hollow boom.**
   *
   * The fundamental is at 88 Hz and carries five times the energy of the
   * contact, ringing for very nearly a second, because the box really is large
   * and full of air. A drum being hit is not a tap with a boom afterwards; it
   * is a boom, and the strike is only how it started.
   *
   * The one place in this file a mode under 500 Hz with a long decay is correct
   * rather than the plank fault under another name.
   */
  'metal-hollow-big': {
    level: 0.46,
    impact: { level: 0.14, duration: 0.007, low: 90, tone: 4200, q: 1.2, attack: 0.0009 },
    modes: [
      { hz: 88, decay: 0.95, level: 0.5 },
      { hz: 218, decay: 0.78, level: 0.32 },
      { hz: 452, decay: 0.58, level: 0.19 },
      { hz: 1010, decay: 0.34, level: 0.1 },
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
export interface Contact {
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
export type Gait = readonly [Contact, Contact];

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

/**
 * Going backwards, which is a mirror and **not a symmetric one**.
 *
 * The contact order genuinely reverses — `heel off` replaces `toe off` as the
 * transition event, so the forefoot lands first — but the weights do not
 * mirror with it. Forward gait peaks around halfway through the cycle;
 * backward peaks at 15% of it, at 118% of body weight. The *first* contact
 * carries the load.
 *
 * So this is not the walk swapped over. It is a firm, slightly bright tap,
 * followed by a heel **lowering under control** — which is not a strike at all
 * but a flat pad being set down: long, dull, almost no ring, and barely any
 * scuff, because nothing is pushing off. The two together are what makes
 * walking backwards audibly a thing people are bad at.
 *
 * Grit is up on the first contact and down on the second. Backward walking
 * shows a larger medial force than forward — 7.3% of body weight against 4.6%
 * — so it is the sideways-scuffier event, and that shows up in what gets moved
 * rather than in how loud it is.
 */
const BACKWARD: Gait = [
  { at: 0, level: 1, stretch: 0.85, modes: 0.9, grit: 1.25, tone: 1.08 },
  { at: 1.35, level: 0.62, stretch: 1.9, modes: 0.35, grit: 0.35, tone: 0.55 },
];

/**
 * Stepping sideways, lead foot — the one that reaches out to where you are
 * going.
 *
 * **There is no heel-to-toe roll in a sidestep**, because the foot's long axis
 * is perpendicular to travel: there is nothing to roll *along*. The contact
 * rolls across the foot instead — the outer border catches your weight, then
 * the sole flattens onto it — and the width of a foot is about a third of its
 * length, which is why the second contact lands at 0.4 of the gap where a walk
 * puts it at 1.0. **That timing is most of what says sideways.**
 *
 * Broad and dull rather than sharp. Side-step cutting studies find forefoot
 * and lateral contacts produce a lower peak force and a lower loading rate
 * than a rearfoot strike, so this is genuinely softer than a heel landing and
 * not merely different.
 */
const LATERAL_LEAD: Gait = [
  { at: 0, level: 1, stretch: 1.3, modes: 0.8, grit: 0.9, tone: 0.7 },
  { at: 0.4, level: 0.55, stretch: 1.5, modes: 0.45, grit: 1.3, tone: 0.6 },
];

/**
 * Stepping sideways, trail foot — and it does something else entirely.
 *
 * Unlike a walk, where both feet do the same thing half a cycle apart, a
 * sidestep is **asymmetric between the feet**. The trailing one never strikes
 * anything: it pushes off medially and is dragged in to close the gap. A scuff
 * and a placement, which is very nearly the shape the push-off already uses.
 *
 * The alternation comes free. `takeFoot` returns −1 or +1, so the foot matching
 * the direction of travel is the lead one, and a held strafe therefore produces
 * lead, trail, lead, trail — step out, drag in, step out, drag in. Which is
 * what sidestepping is.
 */
const LATERAL_TRAIL: Gait = [
  { at: 0, level: 0.5, stretch: 2.4, modes: 0.3, grit: 1.8, tone: 0.75 },
  { at: 0.5, level: 0.4, stretch: 1.4, modes: 0.5, grit: 0.7, tone: 0.7 },
];

/** Both feet, a few milliseconds apart. */
const LANDING: Gait = [PLAIN, { ...PLAIN, at: 1, level: 0.5 }];

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * How much a diagonal ahead counts as a sidestep, discounted.
 *
 * **A forward diagonal is not half a strafe, and a backward one very nearly
 * is.** Moving forward-and-right you are still walking: your feet turn a few
 * degrees toward where you are going and keep rolling heel to toe, because
 * that is the efficient thing to do and you have the control to do it.
 * Backward-and-right you have neither — you cannot turn a foot behind you into
 * the direction of travel, so it is genuinely placed rather than rolled.
 *
 * So the lateral weight is scaled down in proportion to how far *ahead* you
 * are going, and not at all going back. The discount eases in with the forward
 * component rather than switching at the halfway line, so nothing jumps as a
 * player swings from one to the other.
 */
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
 * The gait for a direction, blended rather than chosen.
 *
 * **If this branched, it would ship worse than having no gaits at all.**
 * Strafing while walking forward is most real movement, and `wasd` gives eight
 * directions, so a player drifting across the boundary between "forward" and
 * "lateral" would hear their footsteps flip character mid-corridor. That hard
 * switch would be far more noticeable than the missing detail it was added to
 * fix.
 *
 * So the *parameters* interpolate. Every gait is two contacts of six numbers,
 * which makes a diagonal genuinely half a sidestep — which is what it
 * physically is — with no branch and no discontinuity anywhere. `check:audio`
 * sweeps the full circle and asserts it.
 *
 * @param right  +1 travelling to the player's right, in their own frame.
 * @param forward +1 straight ahead.
 * @param foot   Which foot this footfall is, from `takeFoot`.
 * @param toe    The material's own toe-off level, for the forward gait.
 */
export function gaitFor(right: number, forward: number, foot: -1 | 1, toe: number): Gait {
  const lateral = lateralWeight(right, forward);
  const backward = Math.max(0, -forward);
  const ahead = Math.max(0, 1 - Math.max(lateral, backward));
  const total = lateral + backward + ahead || 1;

  // The foot travelling toward where you are going reaches out; the other is
  // dragged in after it.
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

/**
 * How wide the two feet sit, for a direction.
 *
 * The lead foot lands out to the side you are travelling toward and the trail
 * foot is dragged in near the midline, so they are genuinely not the same
 * distance from you. Costs nothing and is most of what sells the asymmetry.
 */
export function panFor(right: number, forward: number, foot: -1 | 1): number {
  const lead = right >= 0 ? foot === 1 : foot === -1;
  // The same discount the gait gets: on a forward diagonal the feet are not as
  // far apart as they are in a true strafe, because you are still walking.
  return lerp(0.2, lead ? 0.28 : 0.1, lateralWeight(right, forward));
}

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
  gritBed: ParticleBed | null;
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
  /** Last footfall's sideways component, for spotting a strafe starting. */
  private lastLateral = 0;

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

    // **Entering a strafe, start on the foot that reaches out.** Otherwise the
    // first sidestep is a trail-foot drag with nothing to drag toward, which
    // is audibly the wrong way round for exactly one step and impossible to
    // place.
    const lateral = Math.abs(right);
    if (lateral > 0.5 && this.lastLateral <= 0.5 && right !== 0) {
      this.left = right < 0;
    }
    this.lastLateral = lateral;

    // Alternate feet. Steps dead centre sound like one foot hopping.
    const foot = this.takeFoot();
    this.panner.pan.setValueAtTime(foot * panFor(right, forward, foot), at);

    // The gap closes as you speed up, until at a sprint the two contacts are
    // close enough to fuse into a single heavier event — which is what running
    // actually sounds like. Sideways it is already short, because the gait puts
    // its second contact at 0.4 of this rather than at 1.
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
      surface.impact.attack === undefined ? undefined : surface.impact.attack * contact.stretch,
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
    //
    // The excitation is always a *strike*, whatever the contact's own rise
    // time: a resonator is set going by an impulse, and a slow swell into a
    // bandpass is a swell rather than a ring. Only the surfaces that ring have
    // modes at all, and all of them are struck.
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

    // **Shear moves more pieces further, and only incidentally louder.**
    //
    // Scaling level alone was the obvious way to do this and it is the wrong
    // one: turning gravel up does not sound like kicking gravel, it sounds like
    // gravel at a higher volume. What actually changes when you run over stones
    // is how many of them move and how far they scatter before stopping — so
    // most of the variation goes into `count` and `over`, and the level barely
    // moves at all.
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

    // The same, wet. Running through a ford throws a great deal more water than
    // standing in one does, and the tell is the number of droplets rather than
    // how loud any of them is.
    if (surface.splash) {
      const thrown: Splash = {
        ...surface.splash,
        count: Math.max(1, Math.round(surface.splash.count * (0.35 + 0.65 * scuffing))),
        over: surface.splash.over * (0.6 + 0.4 * scuffing),
      };
      scatterBubbles(context, this.output, thrown, at, level * contact.grit * (0.75 + 0.25 * scuffing));
    }
  }

  /** Builds and caches the resonator chain for a surface. */
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
