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
 * - **Crush** (soft, granular, liquid). Noise that *swells* rather than
 *   arriving — a band-limited rush over a tenth of a second, moving in pitch as
 *   it goes. Snow, moss, mud, sand and soil pack under the foot; shallow water
 *   is pushed out of the way. Physically unalike and acoustically the same
 *   shape, and every one of them makes most of its noise this way.
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
 * Air entrained by a foot going into water. See `dsp/bubble.ts`.
 *
 * **This is not a garnish on a noise burst — for water it is the whole sound.**
 * Almost everything audible about water is bubble oscillation: a volume of
 * trapped air ringing at Minnaert's frequency and climbing in pitch as it
 * collapses. A splash is not a hiss with a few plinks in it, it is *hundreds of
 * those events at once*, dense enough to read as a rush and pitched enough
 * never to read as noise. Every attempt at water that led with filtered noise
 * came out as static, and it came out as static because that is what it was.
 */
interface Splash {
  /**
   * Bubbles entrained. **Tens, not a handful.** A drip is one; a boot going
   * into standing water is a cloud, and the density is most of the difference
   * between a liquid and a wet click.
   */
  count: number;
  /** Seconds they are spread over. */
  over: number;
  /** Time constant of the energy decay, as the particle bed has. */
  decay: number;
  /**
   * Radius bounds in metres, and therefore the pitch range: a bubble sings at
   * 3.26/r hertz. A millimetre is 3.3 kHz of spray; a centimetre is a 326 Hz
   * gloop.
   *
   * **Go wide, and especially go high.** Everything here leaves through the body
   * lowpass at 5.2 kHz, which invites the conclusion that finer than about two
   * thirds of a millimetre is wasted — and that conclusion is wrong and cost
   * two rounds. It is a biquad at twelve decibels an octave, not a wall: 10 kHz
   * comes through about twelve down and 20 kHz about twenty-four, quiet but
   * unmistakably there, and there are dozens of them.
   *
   * That fine end is the **air** in a splash. It carries no pitch worth the
   * name — a fifth of a millimetre rings for a fifth of a millisecond, three or
   * four cycles — but collectively it is the sizzle that makes a splash sound
   * wide rather than thick. Trimming the top of the range to "what survives" is
   * what turned a puddle into a gloop.
   *
   * Keep the bottom off five millimetres unless the liquid is meant to be
   * heavy, and take the top as high as the sample rate allows.
   */
  radius: readonly [number, number];
  /** How far the draw is skewed toward the fine end. See `bubbleRadius`. */
  bias?: number;
  level: number;
  /**
   * Viscous damping relative to water. Physical; see `dsp/bubble.ts`.
   *
   * Right for a population of clean water bubbles spanning several octaves,
   * where holding the ring-down to a fixed number of oscillations makes the
   * spray hang and the gloops die. Leave it off and the fixed-cycle model
   * applies instead, which is what anything tuned by ear against that model
   * should keep using — the two are alternatives, not a correction.
   */
  damping?: number;
  /** Oscillations before one is gone. Ignored when `damping` is set. */
  cycles?: number;
  /**
   * The cavity dragged down behind the foot, if the water is deep enough to
   * make one.
   *
   * **This is what depth actually sounds like.** Entrained spray tells you a
   * surface was broken; a *cavity* tells you how far in you went. An object
   * entering water drags a column of air down with it, and once that column
   * pinches off it oscillates as one enormous bubble — five centimetres across
   * sings at 65 Hz and rings for a quarter of a second. That low whoomp,
   * arriving a beat after the contact rather than with it, is the difference
   * between a puddle and a river, and no amount of extra spray substitutes.
   */
  cavity?: {
    /** Metres. Comparable to the thing going in, not to the droplets. */
    radius: number;
    level: number;
    /** Seconds after contact that the column pinches off. */
    delay: number;
  };
  /**
   * The unresolvable end of the cloud, as noise.
   *
   * **A real splash throws thousands of bubbles and this file can afford
   * eighty.** That is fine for the ones you can hear individually and hopeless
   * for the rest, and the rest are not a rounding error — below about a quarter
   * of a millimetre they are so numerous, so brief and so close together that
   * they stop being events at all and become a continuous hiss. Modelling that
   * population as noise is not an approximation of last resort; it is what it
   * *is*, and it is the airiness that no number of discrete pings supplies.
   *
   * **This is the one place noise belongs in water, and the band is why.** Every
   * earlier attempt reached for a broad bed running down into the low mids, and
   * a broad bed in the low mids is static — that is not a description, it is
   * the definition. Kept above about three kilohertz and under a tenth of a
   * second it is sizzle instead, and sizzle is what a splash is made of.
   */
  fizz?: {
    level: number;
    duration: number;
    /** Band, and it starts high and falls. Nothing here goes near the mids. */
    from: number;
    to: number;
    q: number;
  };
}

/**
 * Noise that swells instead of arriving. See `dsp/impact.ts`.
 *
 * Two physically unalike things with the same acoustic shape: a granular
 * material packing under load, and a liquid being pushed out of the way. Both
 * are a rush that builds after contact and dies, and both move in pitch as they
 * go — up as voids close, down as displaced water spreads out.
 */
interface Crush {
  level: number;
  /** Seconds. An order of magnitude longer than an impact. */
  duration: number;
  /** Band at first contact, and where it has moved to by the end. Either way. */
  from: number;
  to: number;
  /** Sharpness. Above about 4 the movement reads as a squeak or a whistle. */
  q: number;
  /**
   * A window that moves, or a ceiling that falls. See `dsp/impact.ts`.
   *
   * Packing is a window — the voids are a size and they close. A splash is a
   * ceiling: everything at once, losing the top first.
   */
  band?: 'window' | 'ceiling';
  /**
   * Where the peak sits, 0..1 of the duration. Defaults to 0.45.
   *
   * Packing builds while the load goes on and peaks near the middle. A liquid
   * is displaced almost at once and spends the rest of the time falling back,
   * so it peaks in the first tenth — which is the whole difference between a
   * foot sinking into snow and a foot going into water.
   */
  rise?: number;
  /**
   * How irregular the flow is, 0..1. Smooth by default.
   *
   * A smooth envelope over a smooth sweep is a *filter sweep*, which is why
   * noise so reliably reads as static or as cloth. Anything thick wants this —
   * mud, a bog, a leg dragging through water. Granular packing does not,
   * because packing really is smooth.
   */
  rough?: number;
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
  /** Anything a foot sinks into, or pushes aside. Solid ones have none. */
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
 *    the difference between two *events*, not two colours of one.
 * 2. **What band does the contact occupy?** `impact.low` to `impact.tone`.
 *    Grass lives from 450 Hz up and has no thump available to it; soil lives
 *    from 100 up and is nearly all thump.
 * 3. **Does it swell rather than strike?** `crush`. Anything a foot sinks into
 *    makes most of its noise *after* contact — and so does anything a foot
 *    pushes out of the way, which is why shallow water uses it too.
 * 4. **Is it made of loose pieces — how big, how varied, how dry?** `grit`,
 *    with `voices` for size variety and `grain` for how long one piece rings.
 *    **`grain` is the dry/wet control**: a piece that stops dead is a leaf, one
 *    that rings on is a droplet. `scuff` says how much of it answers to speed.
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
   */
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

  /**
   * Setts, bedded and pointed.
   *
   * **Blunter than a flagstone, not brighter.** A cobbled road never takes the
   * whole sole: the foot bridges two or three stones and the joints stay empty,
   * so instead of one clean contact there are several small ones a few
   * milliseconds apart and nothing crisp. The grit is not loose material —
   * there is none — it is those partial contacts.
   */
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

  /**
   * Broken stone, loose. Nearly all particle bed, and only the size of the
   * pieces separates it from gravel: fewer, bigger, lower, spread further, and
   * ringing longer, because a large stone takes longer to stop.
   */
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

  /**
   * Loose stones, and the reference the aggregate family is sized against.
   *
   * **Barely spread at all, and barely resonant either.**
   *
   * Spread was the first mistake: five voices across two octaves broke up the
   * repetition and broke up the *material* with it, because at a hundred and
   * thirty collisions a second, pitches that far apart stop fusing and the ear
   * begins counting them. Three voices a fraction apart thicken the band
   * without segregating it.
   *
   * Sharpness was the second, and it survived the first fix. **A small stone
   * has no note.** Its own resonances are up in the kilohertz and damp inside a
   * millisecond, so a struck pebble is a broadband tick and nothing else — give
   * the grains a Q much above one and each becomes a tuned blip at the same
   * pitch as every other, which is a bag of ball bearings. Broad and short
   * here; the material comes from where the band sits and how thickly the
   * collisions fall, not from any of them having a pitch.
   */
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

  /**
   * Dry sand. **The foot sinks and the sand closes over the sound.**
   *
   * Almost nothing arrives: the contact is a seventh of the crush and takes
   * thirty-eight milliseconds, and its band is deliberately narrow and low so
   * that what little of it there is comes out muffled rather than crisp. Sand
   * on a board is a hiss on top of a knock; sand underfoot is a knock buried in
   * a hiss, and the difference is entirely which one is louder.
   *
   * Sixty grains, very fine, very dry, and low enough not to read as spray.
   */
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

  /**
   * Soil — packed earth, soft and coarse.
   *
   * Built on snow rather than on anything hard: nothing arrives, the ground
   * absorbs a foot instead of resisting it. What separates it is the crumbs,
   * which are bigger, drier and lower than snow's grains — and there are enough
   * of them that it reads as ground rather than as bedding. The pack underneath
   * is shorter than snow's for the same reason.
   */
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

  /**
   * ## The liquids
   *
   * Three of them, and they are **two parameters of one model** rather than
   * three recipes. Stating that is what took the longest: every earlier attempt
   * tuned water and mud as separate objects, and they kept drifting into each
   * other because nothing said what actually distinguishes them.
   *
   * - **Medium is which way the bulk moves.** Water spreads and thins, so its
   *   rush is a ceiling *falling* — everything at once, losing the top first.
   *   Mud packs around the foot, so its shear is a window *climbing*. That is
   *   the difference, and it survived being tested by ear where a neater theory
   *   did not: killing mud's bubbles to a dead *blup* is defensible physics and
   *   sounds nothing like mud, because the wet spatter in churned ground is
   *   free water and rings like it.
   * - **Depth is `splash.cavity`.** Spray says a surface was broken; a cavity
   *   says how far in you went. Anything entering water drags a column of air
   *   down behind it, and once that column pinches off it oscillates as one
   *   enormous bubble — four and a half centimetres across is 72 Hz for a
   *   quarter of a second, arriving a beat *after* the contact rather than with
   *   it. A puddle has none. A pond has the big low one, and that single event
   *   is what depth sounds like; no amount of extra spray substitutes for it.
   *
   * `crush` appears only where there is a *mass* of something to move — a leg
   * through a pond, a foot pulled out of mud. It is a bulk rush, and shallow
   * water has no bulk.
   *
   * The contact underneath runs the other way from the depth. In a puddle you
   * hit the ground hard and hear it, which is why that one is genuinely
   * *struck* in a couple of milliseconds; in a pond there is a foot of water in
   * the way and there is very nearly nothing to hear.
   *
   * **No `grit` in either water.** A particle bed is small hard things
   * colliding, and it stood in for spray for far too long — which is how water
   * kept arriving as static. Spray is bubbles, just very small ones. Mud keeps
   * a bed because mud genuinely throws lumps.
   */

  /**
   * A puddle. Shallow enough that the ground is part of the sound.
   *
   * The one member of the family that is mostly a *footstep*: there are a
   * couple of centimetres between the sole and something hard, so the contact
   * is real, sharp and bright, and the water is the splash thrown off it. Sixty
   * bubbles go under for that — but no *column* of air, because there is no
   * depth to drag one down into, and that absence is the whole difference from
   * the pond.
   *
   * **Splashy is wide, and wide means the top end.** Two rounds went the other
   * way: I trimmed the cloud to the band that comfortably survives the body
   * lowpass, on reasoning that was sound and a conclusion that was wrong, and
   * each trim made this thicker. The fine spray above 5 kHz carries no pitch and
   * is not supposed to — it is the *air*, and without it a puddle is a gloop.
   *
   * Three things carry that now. The cloud runs 1.8 to 18 kHz with **no coarse
   * end at all** — a puddle is two centimetres deep and cannot hold a pocket
   * that gloops, and every one of those it had was dominating the sound by
   * ringing forty times longer than its neighbours. The per-bubble level is
   * tilted *up* toward the fine end to undo the same imbalance. And under both,
   * the fizz: the spray too small to count, which is where the air actually
   * comes from.
   *
   * The contact is exactly what it was when this last worked: sharp, bright and
   * untouched.
   */
  'water-puddle': {
    level: 0.48,
    impact: { level: 0.3, duration: 0.012, low: 380, tone: 6000, q: 0.8, attack: 0.002 },
    modes: [],
    grit: null,
    splash: {
      count: 58, over: 0.1, decay: 0.042,
      radius: [0.00018, 0.0018], bias: 0.35, damping: 1, level: 0.5,
      fizz: { level: 0.5, duration: 0.075, from: 9500, to: 3600, q: 0.4 },
    },
    scuff: 0.95,
    toe: 0.6,
    roll: 0.078,
  },

  /**
   * A pond. Half a foot of water up to knee deep.
   *
   * **Deep, and deliberately not thick.** The damping stays at water's, so every
   * bubble rings out in full; depth comes from a cavity arriving a beat late and
   * from a bulk rush as the leg drags a mass of water aside.
   *
   * **The cavity is a bloop, not a thump, and it kept getting bigger than the
   * water is deep.** At four and a half centimetres it sang at 72 Hz for a
   * quarter of a second, which is a body going in rather than a leg; at two and
   * a bit it was still leading the whole surface. Thirteen millimetres is
   * 251 Hz and about seventy milliseconds — an octave and a half below the
   * cloud, which is all the separation it needs to read as *depth* rather than
   * as another droplet, and quiet enough that the splash is what you hear
   * first.
   *
   * The cloud runs 930 Hz to 16 kHz and carries a fizz under it, exactly as the
   * puddle does and for the same reason: the spray too fine to resolve is where
   * airiness lives, and without it a body of water is muffled however many
   * discrete bubbles are thrown at it. A pond's fizz is longer than a puddle's
   * because there is more water to keep breaking.
   *
   * The bulk rush is nearly gone — a twentieth of the cloud. It is the layer
   * that turns into mush the moment it is loud enough to notice, and it does not
   * need to be noticed; it only has to say that something heavy moved.
   *
   * There is a contact in here, a fifteenth of the splash and eighteen
   * milliseconds late. At this depth you feel the bottom and barely hear it.
   */
  'water-pond': {
    level: 0.5,
    impact: { level: 0.05, duration: 0.034, low: 300, tone: 2200, q: 0.5, attack: 0.018 },
    crush: {
      level: 0.08, duration: 0.24, from: 5200, to: 1800, q: 0.7,
      rise: 0.09, band: 'ceiling', rough: 0.4,
    },
    modes: [],
    grit: null,
    splash: {
      count: 105, over: 0.22, decay: 0.085,
      radius: [0.0002, 0.0035], bias: 0.3, damping: 1, level: 0.58,
      cavity: { radius: 0.013, level: 0.2, delay: 0.028 },
      fizz: { level: 0.44, duration: 0.13, from: 8500, to: 3000, q: 0.4 },
    },
    scuff: 1,
    toe: 0.65,
    roll: 0.115,
  },

  /**
   * Churned wet ground. The squelch.
   *
   * A slow viscous shear sweeping *upward* as the mud packs around the foot —
   * the opposite direction from a pond, where the water spreads and thins —
   * with a wet spatter riding in it and a handful of bubbles through that.
   *
   * **The spatter is the squelch and it is a particle bed**, which makes mud the
   * one liquid here that keeps one. That looks like the fault every other wet
   * surface had, and it is the opposite: a bed standing in for *spray* is what
   * made water read as static, because spray is bubbles. Churned ground genuinely
   * does throw small wet lumps, and they collide.
   *
   * The bubbles keep the fixed-cycle ring-down rather than the physical damping
   * the pond uses. Dialled in by ear, and the ear was right: killing them to a
   * dead *blup* is defensible viscosity and sounds nothing like mud, because
   * what is bubbling in churned ground is the free water in it.
   *
   * **`bounce: 0` is what stops the spatter reading as sand.** The particle bed
   * shortens each collision as the burst runs down, which is right for stones
   * losing height and wrong for wet lumps, and it had quietly been drying mud
   * out ever since it was added for gravel. Under it the shear is longer,
   * louder and now *rough*, because irregular flow is the whole of squelch, and
   * the lumps came down in pitch to where wet things sit rather than where
   * grains do.
   */
  mud: {
    level: 0.42,
    // Barely a twentieth of the shear. There *is* ground under mud and you feel
    // it arrive, but hearing it is the surface reverting to a footstep with a
    // squelch attached, which is the wrong way round.
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

  /**
   * Moss. The quietest thing in the table and still unmistakably itself.
   *
   * A dry cushion, and a *high* one — the squeeze sits well above the bottom of
   * the range, because moss is a thin mat and there is no depth in it to boom.
   *
   * **A smooth swept band on its own is cloth**, which is what this had become:
   * a broad filter moving evenly across a noise swell is exactly how a linen
   * swish is made, and nothing about it says anything grew there. So a handful
   * of very soft, very slow, very quiet compressions ride in it — not a crunch,
   * there is nothing brittle in moss, but enough irregularity that the swell has
   * a grain rather than a curve. Eight of them, opening over four milliseconds
   * each, which is far too slow to click.
   */
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

  /**
   * Turf. Soft, high, and a brush rather than a contact — the difference
   * between a brush and a crunch is spread and sharpness, not level.
   */
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

  /**
   * Lying snow — soft, deep and cold.
   *
   * Built on moss, which is what it should always have been: a long soft pack
   * with almost no arrival. The grains are many, fine and broad, so they read
   * as compaction rather than crunch. A swept sharp filter was tried here for
   * the squeak and it is a whistle, not snow.
   */
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

  /**
   * A boarded floor — **a thick plank over a void, not a stack of ply**.
   *
   * The fundamental is strong, low and woody; everything above it falls away
   * fast; and the contact is a quarter of the ring, so a plank is heard through
   * the board rather than on top of it. The decays came in from where they were
   * — a board resonates, it does not reverberate — and the dust and grain
   * underfoot came up, because that noise is half of what says *timber* rather
   * than *drum*.
   */
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

  /**
   * Sheet metal, bedded — an aluminium plate or a tread panel.
   *
   * Inharmonic, with a body note for the bright partials to be out of tune
   * against — what says metal is the *interval* between notes that belong to no
   * common series.
   *
   * Sustain says metal — at a tenth of a second and under, a pitched inharmonic
   * knock is a woodblock, which is what this was for a while.
   *
   * **But its modes have to be a different object's, not the catwalk's played
   * shorter.** Same four frequencies at half the decay is a grating heard
   * through a wall, and the ear files it as the same thing rather than as
   * another one. A plate lying on something genuinely is a different resonator:
   * the substrate drains its low end fast and takes the shimmer off the top,
   * leaving the midrange, which is where the whole character sits.
   *
   * So the bottom mode is short and dull, because that energy is going into
   * whatever it is bedded on; the two mid modes are the loudest and longest and
   * land nowhere near `metal-ring`'s; and the top dies almost at once rather
   * than hanging on for a seventh of a second.
   */
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
   * Size in a hollow body reads almost entirely as pitch and ring-down, which
   * is why these are worth having as a pair: a bang that says *small container*
   * is completely different information from one that says *tank*.
   */
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

  /**
   * An empty tank, a hopper, a container roof. **The biggest sound in the file.**
   *
   * Two things make a body read as *large* rather than merely hollow, and it
   * needs both: the fundamental has to be low enough to be felt rather than
   * heard — 74 Hz, below anything else here by an octave — and it has to ring
   * for well over a second, because that is how long it takes a wave to cross a
   * tank and come back enough times to die. At 0.45 s it was a bin.
   *
   * The strike is a twentieth of the fundamental's level. A tank being hit is
   * not a tap with a boom afterwards; it is a boom, and the tap is only how it
   * started.
   *
   * The one place in this file a mode under 500 Hz with a long decay is correct
   * rather than the plank fault under another name.
   */
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
 * A burst of entrained air, Poisson-spaced and decaying the way the particle
 * bed is.
 *
 * Straight to the output rather than through a bed: a bubble is already a tuned
 * oscillator and has no shared body to resonate in, which is exactly what makes
 * it unlike grit — and why, unlike grit, a wide spread of pitches here is
 * correct rather than a fault. Water is *supposed* to be countable.
 */
function scatterBubbles(
  context: BaseAudioContext,
  noise: AudioBuffer,
  target: AudioNode,
  splash: Splash,
  at: number,
  force: number,
): void {
  // The spray that cannot be counted. First, because it is the sheet breaking
  // and everything below is what comes out of it.
  if (splash.fizz) {
    crush(context, noise, target, at, splash.fizz.level * force, {
      duration: splash.fizz.duration,
      from: splash.fizz.from,
      to: splash.fizz.to,
      q: splash.fizz.q,
      // Almost no rise. A sheet of water breaking is not a swell.
      rise: 0.05,
    });
  }

  const rate = splash.count / Math.max(splash.over, 1e-3);
  const [small, big] = splash.radius;

  // The cavity first, because it is the loudest thing here and reads as the
  // event the cloud is decoration on. Delayed: the column pinches off after the
  // foot has passed through it, and arriving together it is merely a bass note.
  if (splash.cavity) {
    popBubble(context, target, at + splash.cavity.delay, {
      radius: splash.cavity.radius,
      level: splash.cavity.level * force,
      damping: splash.damping,
      cycles: splash.cycles,
      // Barely climbs. A big slow pocket changes size by very little over its
      // ring, and a cavity that swoops is a cartoon.
      rise: 0.06,
    });
  }

  let t = 0;
  for (let i = 0; i < splash.count; i++) {
    t += -Math.log(1 - Math.random() * 0.999 - 0.001) / rate;
    if (t > splash.over * 1.8) return;

    // The cloud thins as the water falls back, exactly as a scatter of stones
    // runs down. Without it a splash is a uniform wash for its whole length,
    // which is the other way to arrive at static.
    const energy = Math.exp(-t / splash.decay);
    const radius = bubbleRadius(small, big, splash.bias);
    // Bigger bubbles carry more air and more energy, so the low ones lead and
    // the spray rides on top rather than the other way round.
    const size = (radius - small) / Math.max(big - small, 1e-9);
    // **The fine end needs *more* level, not less, and this took embarrassingly
    // long to see.** Damping is superlinear in frequency, so a 1.2 kHz bubble
    // rings for eight milliseconds and an 18 kHz one for a quarter of one —
    // roughly forty times the energy at the same peak. Weighting the big ones
    // up on top of that leaves a cloud that is four fifths fine spray and
    // sounds like half a dozen gloops, which is exactly the thickness that
    // would not go away however far the distribution was skewed.
    const level = splash.level * force * energy * rand(0.35, 1) * (1.15 - 0.3 * size);
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
  /** Surface underfoot. Phase 5 sets this from the zone the player is in. */
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
    // because the movement is the effect and a fixed filter cannot carry it.
    //
    // **A scrape does not compress anything.** `stretch` lengthens the impact,
    // which is right — a scrape is a long contact — and applying it here as
    // well turned the push-off's 3.2 into half a second of snow, which snow
    // does not do. A crush follows the *normal* force, so a contact that is
    // mostly tangential gets a shorter, much quieter one.
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
      // Count follows the contact as well as the speed: a toe-off trailing
      // through water throws a fraction of what a heel landing in it does, and
      // it is the number of droplets rather than their level that says so.
      const thrown: Splash = {
        ...surface.splash,
        count: Math.max(
          1,
          Math.round(surface.splash.count * (0.35 + 0.65 * scuffing) * Math.min(contact.level, 1)),
        ),
        over: surface.splash.over * (0.6 + 0.4 * scuffing),
      };
      scatterBubbles(
        context,
        noise.white,
        this.output,
        thrown,
        at,
        level * contact.grit * (0.75 + 0.25 * scuffing),
      );
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
