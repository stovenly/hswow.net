/**
 * What a throat is made of, and the words it is spoken to in.
 *
 * A `BodyPreset` is the whole of what the worklet is told about a species:
 * how long the tube is, where the nose joins it, how lossy the walls are, how
 * fast each articulator moves. Everything after that arrives as gestures on
 * twelve tracks. Nothing here names a vowel or an animal — that is a writer's
 * business, one layer up.
 */

/** Speed of sound in a warm wet throat, cm/s. */
const C = 35000;

/** Tract passes per output sample. The worklet runs this same number. */
export const OVERSAMPLE = 2;

export type Articulator = 'velum' | 'jaw' | 'bodyPos' | 'bodyDia' | 'tip' | 'lips';

export type Track = 'f0' | 'rd' | 'loud' | 'breath' | 'modulate' | 'chaos' | Articulator;

/**
 * The order the worklet indexes by. The first six are read per sample; the six
 * articulators after them drive followers and are read once a block.
 */
export const TRACKS: readonly Track[] = [
  'f0', 'rd', 'loud', 'breath', 'modulate', 'chaos',
  'velum', 'jaw', 'bodyPos', 'bodyDia', 'tip', 'lips',
];

export const CURVE = { step: 0, lin: 1, exp: 2 } as const;
export type Curve = keyof typeof CURVE;

/**
 * One body. Diameters are in the same arbitrary units throughout — 1.5 is a
 * relaxed open tube, 0 is shut — and only their ratios reach the DSP.
 */
export interface BodyPreset {
  sampleRate: number;
  oversample: number;
  /** Tract sections, glottis to lips. Length is `sections × c / (rate × oversample)`. */
  sections: number;
  noseSections: number;
  /** Which tract section the nose branches off. */
  noseAt: number;
  restShape: Float32Array;
  noseShape: Float32Array;

  glottalReflect: number;
  lipReflect: number;
  /** Per section per pass. Higher is brighter and ringier. */
  wallLoss: number;
  /** One-pole coefficient on each end reflection: how fast the round trip dulls. */
  wallDamp: number;

  /** Where the tongue hump may sit, as a fraction along the tract, and how wide it is. */
  bodyFrom: number;
  bodyTo: number;
  bodySpread: number;
  tipAt: number;
  tipSpread: number;
  /** How many sections at the front count as lips. */
  lipSections: number;

  /** Follower time constants, seconds, in `TRACKS` order from `velum`. */
  tau: Float32Array;

  /** Period wobble rolled once a cycle, as a fraction. */
  jitter: number;
  /** Amplitude wobble, likewise. */
  shimmer: number;
  /** 1/f drift on f0, as a fraction. */
  drift: number;
  /** Slow tremor depth and rate — an old voice. */
  tremor: number;
  tremorHz: number;
  /** Rate of the `modulate` track's roughness. */
  modulateHz: number;
  /** Aspiration that is always there, however shut the `breath` track is. */
  breathFloor: number;
  /** Seconds of steady talk one lungful buys. */
  air: number;
  /** How loud the constriction hisses. */
  turbulence: number;
  gain: number;
  /** Seeds this throat's noise, so two of them are not the same hiss. */
  noiseSeed: number;
}

function hash(seed: number, n: number): number {
  const x = Math.sin(seed * 12.9898 + n * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * How a people's throat differs from the plain one. Presets and writers, never
 * DSP branches: the same tube, told different numbers.
 *
 * The countryside is darker and looser — more air always moving, a quick tip
 * for the tap, lossier walls. The city is brighter and more forward, with a
 * jaw so slow it barely opens, which is what makes the delivery clipped.
 */
const BODIES = {
  country: { breathScale: 1.33, wallDamp: 0.68, tipTau: 0.006, jawTau: 0.03 },
  city: { breathScale: 1, wallDamp: 0.5, tipTau: 0.008, jawTau: 0.038 },
} as const;

export type BodyKind = keyof typeof BODIES;

/**
 * A villager's throat, sized in centimetres so it is the same voice whatever
 * the device's sample rate. `lengthCm` is the tract; around 15 is a small
 * person, 18 a large one.
 */
export function villagerBody(
  sampleRate: number, lengthCm: number, seed: number, kind: BodyKind = 'country',
): BodyPreset {
  const folk = BODIES[kind];
  const perSection = C / (sampleRate * OVERSAMPLE);
  const sections = Math.max(24, Math.round(lengthCm / perSection));
  // A nose is about three quarters of the mouth's length and joins it in the
  // upper pharynx.
  const noseSections = Math.max(12, Math.round(lengthCm * 0.72 / perSection));
  const noseAt = Math.min(sections - 4, Math.max(3, Math.round(sections * 0.4)));

  const restShape = new Float32Array(sections);
  for (let i = 0; i < sections; i++) {
    const p = i / (sections - 1);
    restShape[i] = p < 0.16 ? 0.6 : p < 0.28 ? 1.1 : 1.5;
  }

  // Wide at the back of the nose, tapering to the nostrils. Section 0 is the
  // velum and the worklet overwrites it every block.
  const noseShape = new Float32Array(noseSections);
  for (let i = 0; i < noseSections; i++) {
    const d = (2 * i) / (noseSections - 1);
    noseShape[i] = Math.min(1.9, d < 1 ? 0.4 + 1.6 * d : 0.5 + 1.5 * (2 - d));
  }

  const tau = new Float32Array([
    0.026, // velum — soft and slow
    folk.jawTau, // jaw — the heaviest thing in the mouth
    0.022, // bodyPos
    0.009, // bodyDia — how long a k spends in the band where it hisses
    folk.tipTau, // tip — the quickest
    0.016, // lips
  ]);

  return {
    sampleRate,
    oversample: OVERSAMPLE,
    sections,
    noseSections,
    noseAt,
    restShape,
    noseShape,
    // The round trip is `glottal × lip × wallLoss^2N` and it sets the formant
    // bandwidths — about 190 Hz here, on the wide side, tunable live.
    glottalReflect: 0.75,
    lipReflect: -0.85,
    wallLoss: 0.999,
    wallDamp: folk.wallDamp,
    bodyFrom: 0.26,
    bodyTo: 0.82,
    bodySpread: 0.26,
    tipAt: 0.8,
    tipSpread: 0.09,
    lipSections: 2,
    tau,
    jitter: 0.006 + hash(seed, 21) * 0.007,
    shimmer: 0.03 + hash(seed, 22) * 0.025,
    // Never quite still: the ones drawn with the least of this were the ones
    // heard as a machine.
    drift: 0.015 + hash(seed, 23) * 0.012,
    tremor: hash(seed, 24) < 0.25 ? 0.006 + hash(seed, 25) * 0.008 : 0,
    tremorHz: 4.5 + hash(seed, 26) * 2.5,
    modulateHz: 24,
    breathFloor: (0.012 + hash(seed, 27) * 0.02) * folk.breathScale,
    air: 5.5 + hash(seed, 28) * 3,
    turbulence: 0.25,
    // Low on purpose: a tube on resonance swings several times its source, and
    // the model must stay clear of unity so nothing shapes it. Loudness is the
    // emitter's job.
    gain: 0.35,
    noiseSeed: (Math.floor(hash(seed, 29) * 0x7fffffff) | 0) || 22222,
  };
}
