import * as THREE from 'three';

/**
 * Colour ramps as data.
 *
 * Five of these were hand-written GLSL — a base colour and a chain of
 * `mix(c, next, smoothstep(a, b, t))` lines, one per stop, each one a constant
 * only reachable by editing a shader and reloading. They are rows of a table
 * now, so recolouring a material is a table edit or a drag of a swatch.
 * MATERIAL-SYSTEM.md R3.
 *
 * **The windows overlap, and that is the whole subtlety.** These are not
 * gradients between neighbouring stops: every stop is mixed over whatever the
 * chain has produced so far, so where one window has not closed before the next
 * opens, three colours are in play at once and the *order* decides the hue.
 * `rampAt` runs the same chain in the same order the shader used to, which is
 * why the ports came out identical rather than merely close.
 *
 * **The table is a texture, not a uniform bank.** It was 30 vec4 of
 * `uRampStops` and an evaluator that ran the chain per fragment. R6's colorways
 * want twenty more ramps, which is 120 vec4 against a fragment stage already at
 * 174 of a GLES3 floor of 224 — so the chain is evaluated on the CPU into a
 * lookup instead, and `rampColour` is one texture fetch. That is *cheaper* than
 * what it replaces, which was not the reason: voidstone reads a ramp up to
 * twenty-four times a fragment inside its star loops, and each of those was six
 * uniform reads, four smoothsteps and four mixes.
 *
 * What it costs is exactness. R3 was bit-identical on four ramps and a third of
 * a ulp on the fifth; a lookup samples the chain `LUT_WIDTH` times and
 * interpolates between samples, in half-float. See `LUT_WIDTH`.
 */

export type RampName =
  // schiller
  | 'labrador'
  | 'spectrolite'
  | 'moonsheen'
  | 'sunstone'
  // stained glass
  | 'oceanglass'
  | 'rosewindow'
  | 'ivyglass'
  | 'lapispane'
  // tenebrescent
  | 'violetbloom'
  | 'ember'
  | 'verdigris'
  // quickmetal's own cast
  | 'silver'
  | 'nightmetal'
  | 'brass'
  // scenes
  | 'star'
  | 'daylight'
  | 'lakestill'
  | 'dusk'
  | 'dawn'
  | 'day'
  | 'aurora'
  // finish features
  | 'ice';

/** A colour mixed over the ramp so far, across a window of `t`. */
export interface RampStop {
  /** Where this colour begins arriving, and where it has fully arrived. */
  start: number;
  end: number;
  /** Linear, 0..1 per channel — the numbers a GLSL vec3 held. */
  rgb: [number, number, number];
}

export interface Ramp {
  readonly name: RampName;
  /** Where the ramp stands at t = 0. */
  base: [number, number, number];
  /**
   * Mixed over the base in order, and there is no longer a limit on how many.
   *
   * There was, and it was four: the evaluator was a loop with a constant bound,
   * so every ramp paid for four stops whether or not it used them and none
   * could have a fifth. Only the CPU sees this list now.
   */
  stops: RampStop[];
  /**
   * How far the finished colour is pulled toward its own luma.
   *
   * Stored as the pull rather than what survives it, so the usual answer is
   * zero — and a mix by zero is the identity however a driver spells `mix`,
   * which is why four of the five original ports came out bit for bit.
   */
  grey: number;
}

/**
 * Samples across `t`, and the reason it is this number.
 *
 * The error a lookup adds is the ramp's own curvature across one sample
 * spacing. Every window below is at least 0.12 wide, which bounds a
 * smoothstep's second derivative, and 512 samples puts the worst channel error
 * under about 4e-4 — an eighth of an 8-bit step *at the ramp*. It is not the end
 * of the chain: voidstone multiplies a ramp by a star core, so raise this before
 * suspecting anything else if a scene ever shows a facet.
 *
 * Half-float storage adds about the same again (a 10-bit mantissa over 0..1),
 * and is used because linear filtering of RGBA16F is core in WebGL2 while
 * RGBA32F needs an extension nothing here should have to ask for.
 */
const LUT_WIDTH = 512;

/**
 * The ramps.
 *
 * The first five were lifted verbatim from the GLSL they replaced, and their
 * notes are the ones that stood over those functions — they say why the colours
 * are what they are, which is the part that will be argued with. The rest are
 * R6's colorways, and each says what it is *for*, since a colorway with no
 * argument behind it is a swatch somebody liked once.
 */
export const RAMPS: readonly Ramp[] = [
  // --- schiller ------------------------------------------------------------
  {
    // Labradorite's schiller: weighted blue, then teal, green uncommon, gold
    // rare — and the whole thing pulled toward grey, because it is a rock.
    name: 'labrador',
    base: [0.16, 0.3, 0.72],
    stops: [
      { start: 0, end: 0.36, rgb: [0.14, 0.44, 0.78] },
      { start: 0.44, end: 0.68, rgb: [0.16, 0.55, 0.66] },
      { start: 0.74, end: 0.88, rgb: [0.3, 0.62, 0.46] },
      { start: 0.91, end: 1, rgb: [0.78, 0.64, 0.32] },
    ],
    grey: 0.26,
  },
  {
    // Spectrolite is labradorite with the whole wheel in it and no apology.
    // The grey pull is off — that pull is what makes the default read as stone,
    // and this variant is the one that does not want to.
    name: 'spectrolite',
    base: [0.10, 0.18, 0.70],
    stops: [
      { start: 0, end: 0.24, rgb: [0.12, 0.46, 0.92] },
      { start: 0.26, end: 0.46, rgb: [0.10, 0.72, 0.66] },
      { start: 0.48, end: 0.66, rgb: [0.34, 0.80, 0.28] },
      { start: 0.68, end: 0.84, rgb: [0.94, 0.72, 0.16] },
      { start: 0.86, end: 1, rgb: [0.86, 0.22, 0.42] },
    ],
    grey: 0,
  },
  {
    // Rainbow moonstone: adularescence rather than schiller — one cold sheet of
    // blue-white light, with barely any hue in it at all. The narrow spread is
    // the point, so the stops sit close together near the top.
    name: 'moonsheen',
    base: [0.42, 0.56, 0.86],
    stops: [
      { start: 0, end: 0.40, rgb: [0.56, 0.74, 0.98] },
      { start: 0.44, end: 0.74, rgb: [0.78, 0.90, 1.0] },
      { start: 0.80, end: 1, rgb: [0.92, 0.97, 1.0] },
    ],
    grey: 0.12,
  },
  {
    // Sunstone's aventurescence: copper platelets, so the flood is metal rather
    // than spectrum. Never leaves the warm quadrant.
    name: 'sunstone',
    base: [0.46, 0.16, 0.05],
    stops: [
      { start: 0, end: 0.34, rgb: [0.76, 0.30, 0.07] },
      { start: 0.36, end: 0.62, rgb: [0.94, 0.52, 0.12] },
      { start: 0.64, end: 0.86, rgb: [1.0, 0.74, 0.30] },
      { start: 0.88, end: 1, rgb: [1.0, 0.92, 0.66] },
    ],
    grey: 0.08,
  },

  // --- stained glass -------------------------------------------------------
  {
    // Was `berry`, and the numbers are unchanged: the marble berry's Bragg
    // stacks by layer thickness. Saturated where labradorite is not — this is
    // structural colour with nothing over it. Renamed with the recipe (R6).
    name: 'oceanglass',
    base: [0.09, 0.2, 0.74],
    stops: [
      { start: 0, end: 0.38, rgb: [0.1, 0.42, 0.88] },
      { start: 0.4, end: 0.66, rgb: [0.16, 0.63, 0.6] },
      { start: 0.68, end: 0.86, rgb: [0.44, 0.62, 0.26] },
      { start: 0.88, end: 1, rgb: [0.88, 0.68, 0.26] },
    ],
    grey: 0,
  },
  {
    // A rose window: the reds and golds a west light comes through, with the
    // deep magenta that real pot-metal glass goes where it is thick.
    name: 'rosewindow',
    base: [0.30, 0.03, 0.16],
    stops: [
      { start: 0, end: 0.34, rgb: [0.72, 0.08, 0.20] },
      { start: 0.36, end: 0.60, rgb: [0.88, 0.24, 0.44] },
      { start: 0.62, end: 0.82, rgb: [0.94, 0.46, 0.20] },
      { start: 0.84, end: 1, rgb: [1.0, 0.80, 0.34] },
    ],
    grey: 0,
  },
  {
    // The green end of the same window. Amber at the top rather than gold, so
    // it does not simply read as cathedral with the blues removed.
    name: 'ivyglass',
    base: [0.03, 0.20, 0.12],
    stops: [
      { start: 0, end: 0.32, rgb: [0.08, 0.44, 0.22] },
      { start: 0.34, end: 0.58, rgb: [0.26, 0.66, 0.24] },
      { start: 0.60, end: 0.80, rgb: [0.62, 0.72, 0.18] },
      { start: 0.82, end: 1, rgb: [0.86, 0.52, 0.10] },
    ],
    grey: 0,
  },
  {
    // Two colours and nothing between: the deep cobalt of a Chartres blue and
    // the white of the glass it is leaded against. The narrowest windows here,
    // because the whole look is the absence of a middle.
    name: 'lapispane',
    base: [0.02, 0.06, 0.44],
    stops: [
      { start: 0, end: 0.46, rgb: [0.05, 0.16, 0.82] },
      { start: 0.66, end: 0.78, rgb: [0.30, 0.52, 0.96] },
      { start: 0.86, end: 0.94, rgb: [0.90, 0.95, 1.0] },
    ],
    grey: 0,
  },

  // --- tenebrescent --------------------------------------------------------
  {
    // **One hue, three values, and that is the whole rule.** These ramps used to
    // run from a near-white unburnt face into a coloured burnt one — and a ramp
    // that crosses the wheel passes through neutral on the way, so the middle of
    // every one of them came out grey. Verdigris never did that: it is green at
    // both ends and the stone reads as one material changing state rather than
    // two materials with a dead zone between them.
    //
    // So: pale lilac, mid violet, deep violet. Nothing here is unsaturated at
    // any t, and the probe checks it.
    name: 'violetbloom',
    base: [0.90, 0.84, 0.98],
    stops: [
      { start: 0.06, end: 0.34, rgb: [0.72, 0.46, 0.90] },
      { start: 0.30, end: 0.62, rgb: [0.46, 0.16, 0.66] },
      { start: 0.58, end: 1, rgb: [0.19, 0.05, 0.31] },
    ],
    grey: 0,
  },
  {
    // The same rule in the warm quadrant: pale amber, orange, a deep red-brown
    // that still has heat in it. Never leaves the warm half of the wheel, so it
    // never passes through grey and never lands on pink.
    name: 'ember',
    base: [1.0, 0.90, 0.68],
    stops: [
      { start: 0.06, end: 0.32, rgb: [1.0, 0.66, 0.24] },
      { start: 0.28, end: 0.60, rgb: [0.88, 0.30, 0.07] },
      { start: 0.56, end: 1, rgb: [0.31, 0.06, 0.03] },
    ],
    grey: 0,
  },
  {
    // And to verdigris: the pale side is a chalky mint, the burnt side the
    // near-black green of old bronze. The one burn that darkens further than
    // hackmanite does.
    name: 'verdigris',
    base: [0.78, 0.94, 0.82],
    stops: [
      { start: 0, end: 0.26, rgb: [0.52, 0.82, 0.68] },
      { start: 0.22, end: 0.55, rgb: [0.13, 0.44, 0.36] },
      { start: 0.52, end: 1, rgb: [0.04, 0.13, 0.10] },
    ],
    grey: 0,
  },

  // --- quickmetal's own cast -----------------------------------------------
  //
  // These replace a two-colour `mix` that stood in the ambient slot. Read by
  // the metal's warmth field, so t is a shift across the metal rather than a
  // gradient over the object.
  {
    // Mercury: the two colours the mix held, verbatim.
    name: 'silver',
    base: [0.74, 0.76, 0.83],
    stops: [{ start: 0, end: 1, rgb: [0.98, 0.92, 0.78] }],
    grey: 0,
  },
  {
    // The inverted mirror's metal: cold and dark, so what little light the
    // surface returns is the scene's rather than its own.
    name: 'nightmetal',
    base: [0.20, 0.22, 0.30],
    stops: [{ start: 0, end: 1, rgb: [0.46, 0.44, 0.52] }],
    grey: 0,
  },
  {
    name: 'brass',
    base: [0.62, 0.44, 0.16],
    stops: [{ start: 0, end: 1, rgb: [0.96, 0.80, 0.40] }],
    grey: 0,
  },

  // --- scenes --------------------------------------------------------------
  {
    // Star colour by surface temperature. Weighted heavily to the cool white
    // end, because that is what a naked eye resolves; the orange ones are the
    // rare bright giants and are worth having for exactly that reason.
    name: 'star',
    base: [0.72, 0.8, 1],
    stops: [
      { start: 0, end: 0.42, rgb: [0.94, 0.96, 1] },
      { start: 0.4, end: 0.76, rgb: [1, 0.95, 0.86] },
      { start: 0.8, end: 1, rgb: [1, 0.78, 0.55] },
    ],
    grey: 0,
  },
  {
    // A cloud deck by depth: the lit shoulder at the top of the ramp, the
    // shadowed underside at the bottom. Never white and never black — a cloud
    // that clips at either end stops having a shape.
    name: 'daylight',
    base: [0.30, 0.34, 0.42],
    stops: [
      { start: 0, end: 0.42, rgb: [0.55, 0.59, 0.66] },
      { start: 0.44, end: 0.74, rgb: [0.82, 0.84, 0.87] },
      { start: 0.76, end: 1, rgb: [0.97, 0.97, 0.98] },
    ],
    grey: 0.10,
  },
  {
    // Mackerel sky: high cirrocumulus, which is thin enough that the blue is
    // never fully covered. So the low end is sky and only the top is cloud.
    name: 'lakestill',
    base: [0.22, 0.42, 0.76],
    stops: [
      { start: 0, end: 0.46, rgb: [0.46, 0.64, 0.88] },
      { start: 0.52, end: 0.80, rgb: [0.84, 0.88, 0.94] },
      { start: 0.82, end: 1, rgb: [1.0, 0.98, 0.94] },
    ],
    grey: 0,
  },
  {
    // A sunset by elevation: the deep blue overhead, the band of rose that sits
    // above the horizon, and the gold in the last few degrees of it. The two
    // upper windows overlap hard, because that is where a real dusk sky has no
    // edge at all.
    name: 'dusk',
    base: [0.04, 0.06, 0.20],
    stops: [
      { start: 0, end: 0.34, rgb: [0.16, 0.14, 0.38] },
      { start: 0.30, end: 0.62, rgb: [0.62, 0.28, 0.40] },
      { start: 0.58, end: 0.84, rgb: [0.96, 0.48, 0.26] },
      { start: 0.86, end: 1, rgb: [1.0, 0.86, 0.52] },
    ],
    grey: 0,
  },
  {
    // Dawn rather than dusk, and the difference is not the hour — it is the air.
    // A night's still cold has dropped the dust out of it, so the sky is cleaner
    // and paler than an evening's and the rose never reaches red.
    name: 'dawn',
    base: [0.05, 0.09, 0.24],
    stops: [
      { start: 0, end: 0.34, rgb: [0.24, 0.28, 0.52] },
      { start: 0.30, end: 0.60, rgb: [0.72, 0.48, 0.58] },
      { start: 0.58, end: 0.84, rgb: [1.0, 0.74, 0.52] },
      { start: 0.86, end: 1, rgb: [1.0, 0.93, 0.78] },
    ],
    grey: 0,
  },
  {
    // Broad daylight: zenith blue overhead, and the haze that always sits on a
    // real horizon. **The one ramp here that is not an event** — nothing is
    // happening in it, which is what makes it the one to put behind something
    // that has to be looked at for a while.
    name: 'day',
    base: [0.08, 0.26, 0.70],
    stops: [
      { start: 0, end: 0.40, rgb: [0.30, 0.52, 0.86] },
      { start: 0.42, end: 0.72, rgb: [0.62, 0.78, 0.94] },
      { start: 0.74, end: 1, rgb: [0.88, 0.92, 0.95] },
    ],
    grey: 0,
  },
  {
    // One curtain carrying every colour an aurora has, in the order altitude
    // puts them — which is also the order a curtain seen **from below** presents
    // them, nearest overhead first.
    //
    // Nitrogen pink along the very bottom edge, oxygen green through the body at
    // a hundred kilometres, and the thin high red of the same oxygen at three
    // hundred. Green and crimson were two ramps and two looks; they are one
    // display, and a real great storm shows both at once with the blue-violet
    // band between them. Stacking them into one ramp is not a compromise — it is
    // what the sky does.
    name: 'aurora',
    base: [0.86, 0.24, 0.56],
    stops: [
      { start: 0.05, end: 0.20, rgb: [0.20, 0.94, 0.48] },
      { start: 0.22, end: 0.46, rgb: [0.16, 0.88, 0.72] },
      { start: 0.46, end: 0.66, rgb: [0.26, 0.44, 0.92] },
      { start: 0.66, end: 0.86, rgb: [0.78, 0.20, 0.66] },
      { start: 0.86, end: 1, rgb: [0.92, 0.16, 0.26] },
    ],
    grey: 0,
  },

  // --- finish features -----------------------------------------------------
  {
    // What a grain of ice does to the light it passes.
    //
    // Ice disperses far less than water, so its optics are pale rather than
    // spectral — a sun dog runs red nearest the sun through orange to a
    // white-blue tail, and iridescent cirrus is pastel pink and cyan. So this
    // is a light ramp, never a rainbow: rose to peach to cream to a cold cyan,
    // with a little violet at the far end. Every stop is high value on purpose;
    // the moment one of them darkens it stops reading as ice and starts reading
    // as painted glass.
    name: 'ice',
    base: [1, 0.44, 0.66],
    stops: [
      { start: 0, end: 0.3, rgb: [1, 0.68, 0.42] },
      { start: 0.28, end: 0.55, rgb: [1, 0.95, 0.84] },
      { start: 0.55, end: 0.8, rgb: [0.42, 0.8, 1] },
      { start: 0.8, end: 1, rgb: [0.66, 0.52, 1] },
    ],
    grey: 0,
  },
];

const BY_NAME = new Map<RampName, Ramp>(RAMPS.map((ramp) => [ramp.name, ramp]));

export function ramp(name: RampName): Ramp {
  const found = BY_NAME.get(name);
  if (!found) throw new Error(`no ramp '${name}'`);
  return found;
}

/**
 * Where each ramp sits in the lookup, as the texture V coordinate that reads
 * it — the centre of its row, so linear filtering returns that row and not a
 * blend of it and its neighbour. **This is the one way to get the lookup
 * wrong, and it fails as one colorway bleeding into the next.**
 *
 * A coordinate rather than an index because it is carried in the variant row as
 * a float and handed straight to `texture2D`. Nothing dynamically indexes an
 * array anywhere in this system now.
 */
export const RAMP_V = Object.fromEntries(
  RAMPS.map((entry, index) => [entry.name, (index + 0.5) / RAMPS.length]),
) as Record<RampName, number>;

/** GLSL's `smoothstep`, which is not `THREE.MathUtils.smoothstep`'s clamp. */
function smoothstep(e0: number, e1: number, x: number): number {
  const t = Math.min(Math.max((x - e0) / (e1 - e0), 0), 1);
  return t * t * (3 - 2 * t);
}

/**
 * One ramp at one `t`, as the shader used to compute it.
 *
 * The reference implementation: this is what gets baked, and it is what the
 * acceptance probe diffs the lookup against. Written to match the old GLSL
 * statement for statement, including `vec3(0.3333)` rather than a third —
 * a port that tidied that would not be a port.
 */
export function rampAt(entry: Ramp, t: number): [number, number, number] {
  let r = entry.base[0];
  let g = entry.base[1];
  let b = entry.base[2];
  for (const stop of entry.stops) {
    const s = smoothstep(stop.start, stop.end, t);
    r += (stop.rgb[0] - r) * s;
    g += (stop.rgb[1] - g) * s;
    b += (stop.rgb[2] - b) * s;
  }
  const luma = (r + g + b) * 0.3333;
  return [r + (luma - r) * entry.grey, g + (luma - g) * entry.grey, b + (luma - b) * entry.grey];
}

const LUT = new Uint16Array(LUT_WIDTH * RAMPS.length * 4);

/**
 * The lookup. One row per ramp, `LUT_WIDTH` samples across `t`.
 *
 * Half-float and linearly filtered; see `LUT_WIDTH`. Mipmaps are off because a
 * ramp has no notion of distance and a lower mip would be a different ramp.
 */
const LUT_TEXTURE = new THREE.DataTexture(
  LUT,
  LUT_WIDTH,
  RAMPS.length,
  THREE.RGBAFormat,
  THREE.HalfFloatType,
);
LUT_TEXTURE.minFilter = THREE.LinearFilter;
LUT_TEXTURE.magFilter = THREE.LinearFilter;
LUT_TEXTURE.wrapS = THREE.ClampToEdgeWrapping;
LUT_TEXTURE.wrapT = THREE.ClampToEdgeWrapping;
LUT_TEXTURE.generateMipmaps = false;

export const rampUniforms = {
  uRampLut: { value: LUT_TEXTURE },
};

/**
 * Bakes `RAMPS` into the lookup. The dev sliders call this on change, as they
 * called the old uploader — a colour edit is still live and still costs no
 * compile; it is a 512-sample re-evaluation and a texture upload now rather
 * than thirty vec4.
 */
export function uploadRamps(): void {
  const half = THREE.DataUtils.toHalfFloat;
  RAMPS.forEach((entry, row) => {
    const head = row * LUT_WIDTH * 4;
    for (let i = 0; i < LUT_WIDTH; i++) {
      // The sample *at* t, so the ends of the ramp are exact rather than half a
      // texel short of it. `rampColour` maps t back the same way.
      const [r, g, b] = rampAt(entry, i / (LUT_WIDTH - 1));
      const at = head + i * 4;
      LUT[at] = half(r);
      LUT[at + 1] = half(g);
      LUT[at + 2] = half(b);
      LUT[at + 3] = half(1);
    }
  });
  LUT_TEXTURE.needsUpdate = true;
}

uploadRamps();

/**
 * The reader. Spliced by `applyFinish` wherever a ramp is read — the recipes
 * and the frost grains both — and identical text whatever is in the mask.
 *
 * `row` is a V coordinate from `RAMP_V`, either a literal (frost, which has one
 * ramp and no variants) or the variant row's own (every recipe). The half-texel
 * arithmetic on `t` is the inverse of the bake: sample 0 is t = 0 and sample
 * `LUT_WIDTH - 1` is t = 1, so the ends are the ramp's ends exactly.
 */
export const RAMP_GLSL = /* glsl */ `
  uniform sampler2D uRampLut;

  vec3 rampColour(float row, float t) {
    float u = (clamp(t, 0.0, 1.0) * ${LUT_WIDTH - 1}.0 + 0.5) / ${LUT_WIDTH}.0;
    return texture2D(uRampLut, vec2(u, row)).rgb;
  }
`;
