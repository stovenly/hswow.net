import * as THREE from 'three';

/**
 * What the air is made of at a given sun elevation: the dome's colours, the
 * light rig, the stars and the colour a cloud is lit. Keyed on elevation rather
 * than on the clock, so a winter noon and a summer evening that stand at the
 * same angle are the same light, which is what they are.
 */

export interface Atmosphere {
  horizon: THREE.Color;
  zenith: THREE.Color;
  ground: THREE.Color;
  sunDisc: THREE.Color;
  warmth: number;
  /** Multipliers on whatever the zone declared. 1 is full daylight. */
  sunScale: number;
  sunColour: THREE.Color;
  fillScale: number;
  fillColour: THREE.Color;
  ambientScale: number;
  ambientSky: THREE.Color;
  ambientGround: THREE.Color;
  /** 0..1. Multiplied down by cloud cover before it reaches the dome. */
  stars: number;
  /** How brightly the moon disc is drawn, 0..1. */
  moon: number;
  /** What a cloud at this elevation is lit and shaded. */
  cloudLit: THREE.Color;
  cloudShade: THREE.Color;
}

interface Stop {
  /** Degrees of sun elevation this row describes. */
  at: number;
  horizon: number;
  zenith: number;
  ground: number;
  sunDisc: number;
  warmth: number;
  sunScale: number;
  sunColour: number;
  fillScale: number;
  fillColour: number;
  ambientScale: number;
  ambientSky: number;
  ambientGround: number;
  stars: number;
  moon: number;
  cloudLit: number;
  cloudShade: number;
}

/**
 * The seven rows. The top one is today's daylight exactly — the sky's authored
 * defaults and the outdoor light rig at full strength — so nothing about noon
 * moves when the clock is added.
 *
 * Night is not dark. It is high in value and low in saturation with everything
 * blue, and the ambient sits nearly as high as it does at noon: what says night
 * is the hue and the missing sun, not the exposure. Reds go dark on their own
 * under a blue light, which is the shift a dark-adapted eye makes anyway.
 */
const STOPS: readonly Stop[] = [
  {
    at: -18,
    horizon: 0x3f5f92,
    zenith: 0x1e3a6b,
    ground: 0x2a3346,
    sunDisc: 0xc8d8ff,
    warmth: 0.05,
    sunScale: 0.16,
    sunColour: 0xb9cdf2,
    fillScale: 0.5,
    fillColour: 0x6f86b4,
    ambientScale: 0.78,
    ambientSky: 0x7593cc,
    ambientGround: 0x333a4e,
    stars: 1,
    moon: 1,
    cloudLit: 0x8fa4c8,
    cloudShade: 0x54648a,
  },
  {
    at: -6,
    horizon: 0x6b7fae,
    zenith: 0x2b4a80,
    ground: 0x333c50,
    sunDisc: 0xd8b9c8,
    warmth: 0.25,
    sunScale: 0.2,
    sunColour: 0xc0c8ea,
    fillScale: 0.6,
    fillColour: 0x8291b8,
    ambientScale: 0.82,
    ambientSky: 0x8ba2cd,
    ambientGround: 0x3d4354,
    stars: 1,
    moon: 0.85,
    cloudLit: 0xa9b2cc,
    cloudShade: 0x6a7392,
  },
  {
    at: -2,
    horizon: 0xe6a48c,
    zenith: 0x3f6ba8,
    ground: 0x444a58,
    sunDisc: 0xffbb96,
    warmth: 0.55,
    sunScale: 0.34,
    sunColour: 0xe8b6a4,
    fillScale: 0.75,
    fillColour: 0x9fa6c0,
    ambientScale: 0.88,
    ambientSky: 0xa8b6d2,
    ambientGround: 0x50505c,
    stars: 0.9,
    moon: 0.5,
    cloudLit: 0xe8b6ac,
    cloudShade: 0x84809c,
  },
  {
    at: 0.5,
    horizon: 0xffb277,
    zenith: 0x5b8ec4,
    ground: 0x55565c,
    sunDisc: 0xffb066,
    warmth: 0.85,
    sunScale: 0.62,
    sunColour: 0xffb679,
    fillScale: 0.9,
    fillColour: 0xc4b9b4,
    ambientScale: 0.94,
    ambientSky: 0xbcc9dd,
    ambientGround: 0x5f5a55,
    stars: 0.65,
    moon: 0.2,
    cloudLit: 0xffc79c,
    cloudShade: 0x9a8c92,
  },
  {
    at: 6,
    horizon: 0xffd7ac,
    zenith: 0x5c93cd,
    ground: 0x5f6165,
    sunDisc: 0xffd9a8,
    warmth: 0.6,
    sunScale: 0.92,
    sunColour: 0xffdcae,
    fillScale: 1,
    fillColour: 0xdcceb8,
    ambientScale: 1,
    ambientSky: 0xa8c6e4,
    ambientGround: 0x7d7460,
    stars: 0.12,
    moon: 0,
    cloudLit: 0xffe6cc,
    cloudShade: 0xb0a8a4,
  },
  {
    at: 20,
    horizon: 0xd7e8f6,
    zenith: 0x4c8ed0,
    ground: 0x62686d,
    sunDisc: 0xfff0d0,
    warmth: 0.4,
    sunScale: 1,
    sunColour: 0xfff0d4,
    fillScale: 1,
    fillColour: 0xe0d6c0,
    ambientScale: 1,
    ambientSky: 0x9dc4e8,
    ambientGround: 0x8a7f68,
    stars: 0,
    moon: 0,
    cloudLit: 0xf8f4ee,
    cloudShade: 0xc0c2c6,
  },
  {
    at: 60,
    horizon: 0xcce6f9,
    zenith: 0x458acf,
    ground: 0x656d72,
    sunDisc: 0xfff6e0,
    warmth: 0.3,
    sunScale: 1,
    sunColour: 0xfff2d8,
    fillScale: 1,
    fillColour: 0xe0d6c0,
    ambientScale: 1,
    ambientSky: 0x9dc4e8,
    ambientGround: 0x8a7f68,
    stars: 0,
    moon: 0,
    cloudLit: 0xf2f5f8,
    cloudShade: 0xc8cbd0,
  },
];


/**
 * Dawn against dusk. The same elevation is not the same light: morning air has
 * had a night to settle and runs cooler and pinker, evening air has a day of
 * haze in it and runs warmer. A tint over the shared table rather than a second
 * table, so the two cannot drift apart.
 */
const DAWN_TINT = new THREE.Color(0xf6c2cc);
const DUSK_TINT = new THREE.Color(0xffb27a);
/** How far either tint is taken at its strongest. */
const TINT_DEPTH = 0.22;

/**
 * Oklab. Straight linear-RGB interpolation between a night blue and a sunset
 * orange passes through a dead grey; Oklab goes round the outside, which is
 * what the sky does.
 */
function toOklab(c: THREE.Color, out: THREE.Vector3): THREE.Vector3 {
  const l = Math.cbrt(0.4122214708 * c.r + 0.5363325363 * c.g + 0.0514459929 * c.b);
  const m = Math.cbrt(0.2119034982 * c.r + 0.6806995451 * c.g + 0.1073969566 * c.b);
  const s = Math.cbrt(0.0883024619 * c.r + 0.2817188376 * c.g + 0.6299787005 * c.b);
  return out.set(
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  );
}

function fromOklab(v: THREE.Vector3, out: THREE.Color): THREE.Color {
  const l = (v.x + 0.3963377774 * v.y + 0.2158037573 * v.z) ** 3;
  const m = (v.x - 0.1055613458 * v.y - 0.0638541728 * v.z) ** 3;
  const s = (v.x - 0.0894841775 * v.y - 1.291485548 * v.z) ** 3;
  return out.setRGB(
    Math.max(0, 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    Math.max(0, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    Math.max(0, -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
    THREE.LinearSRGBColorSpace,
  );
}

const LAB_A = new THREE.Vector3();
const LAB_B = new THREE.Vector3();
const HEX_A = new THREE.Color();
const HEX_B = new THREE.Color();

/** Mixes two authored hexes in Oklab and writes the result. */
function blendHex(a: number, b: number, t: number, out: THREE.Color): THREE.Color {
  toOklab(HEX_A.setHex(a, THREE.SRGBColorSpace), LAB_A);
  toOklab(HEX_B.setHex(b, THREE.SRGBColorSpace), LAB_B);
  return fromOklab(LAB_A.lerp(LAB_B, t), out);
}

function tint(colour: THREE.Color, toward: THREE.Color, amount: number): void {
  if (amount <= 0) return;
  toOklab(colour, LAB_A);
  toOklab(toward, LAB_B);
  // Hue and chroma only. Pulling the lightness would make dawn dimmer than
  // dusk at the same elevation, and it is not.
  const l = LAB_A.x;
  fromOklab(LAB_A.lerp(LAB_B, amount).setX(l), colour);
}

export function createAtmosphere(): Atmosphere {
  return {
    horizon: new THREE.Color(),
    zenith: new THREE.Color(),
    ground: new THREE.Color(),
    sunDisc: new THREE.Color(),
    warmth: 0,
    sunScale: 1,
    sunColour: new THREE.Color(),
    fillScale: 1,
    fillColour: new THREE.Color(),
    ambientScale: 1,
    ambientSky: new THREE.Color(),
    ambientGround: new THREE.Color(),
    stars: 0,
    moon: 0,
    cloudLit: new THREE.Color(),
    cloudShade: new THREE.Color(),
  };
}

function span(elevation: number): { lo: Stop; hi: Stop; t: number } {
  if (elevation <= STOPS[0].at) return { lo: STOPS[0], hi: STOPS[0], t: 0 };
  for (let i = 1; i < STOPS.length; i++) {
    const hi = STOPS[i];
    if (elevation <= hi.at) {
      const lo = STOPS[i - 1];
      const t = (elevation - lo.at) / (hi.at - lo.at);
      // Smoothed, so no stop reads as a corner while the clock runs through it.
      return { lo, hi, t: t * t * (3 - 2 * t) };
    }
  }
  const last = STOPS[STOPS.length - 1];
  return { lo: last, hi: last, t: 0 };
}

/**
 * The whole rig at one sun elevation. `rising` picks the dawn tint over the
 * dusk one; it has no effect once the sun is well up.
 */
export function sampleAtmosphere(elevation: number, rising: boolean, out: Atmosphere): void {
  const { lo, hi, t } = span(elevation);

  blendHex(lo.horizon, hi.horizon, t, out.horizon);
  blendHex(lo.zenith, hi.zenith, t, out.zenith);
  blendHex(lo.ground, hi.ground, t, out.ground);
  blendHex(lo.sunDisc, hi.sunDisc, t, out.sunDisc);
  blendHex(lo.sunColour, hi.sunColour, t, out.sunColour);
  blendHex(lo.fillColour, hi.fillColour, t, out.fillColour);
  blendHex(lo.ambientSky, hi.ambientSky, t, out.ambientSky);
  blendHex(lo.ambientGround, hi.ambientGround, t, out.ambientGround);
  blendHex(lo.cloudLit, hi.cloudLit, t, out.cloudLit);
  blendHex(lo.cloudShade, hi.cloudShade, t, out.cloudShade);

  out.warmth = lo.warmth + (hi.warmth - lo.warmth) * t;
  out.sunScale = lo.sunScale + (hi.sunScale - lo.sunScale) * t;
  out.fillScale = lo.fillScale + (hi.fillScale - lo.fillScale) * t;
  out.ambientScale = lo.ambientScale + (hi.ambientScale - lo.ambientScale) * t;
  out.stars = lo.stars + (hi.stars - lo.stars) * t;
  out.moon = lo.moon + (hi.moon - lo.moon) * t;

  // Strongest right at the horizon and gone by the time the sun is properly up.
  const depth = TINT_DEPTH * Math.max(0, 1 - Math.abs(elevation) / 12);
  if (depth > 0) {
    const toward = rising ? DAWN_TINT : DUSK_TINT;
    tint(out.horizon, toward, depth);
    tint(out.sunDisc, toward, depth * 0.6);
    tint(out.cloudLit, toward, depth);
    tint(out.sunColour, toward, depth * 0.5);
  }
}

/**
 * The colour a cloud at `heightKm` is lit, given how far below the horizon the
 * sun is *for that deck* — which is not how far it is for the observer. See
 * `twilightLead`.
 */
export function cloudLightAt(
  elevation: number,
  rising: boolean,
  lit: THREE.Color,
  shade: THREE.Color,
): void {
  const { lo, hi, t } = span(elevation);
  blendHex(lo.cloudLit, hi.cloudLit, t, lit);
  blendHex(lo.cloudShade, hi.cloudShade, t, shade);
  const depth = TINT_DEPTH * Math.max(0, 1 - Math.abs(elevation) / 12);
  if (depth > 0) tint(lit, rising ? DAWN_TINT : DUSK_TINT, depth);
}

