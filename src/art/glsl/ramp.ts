/**
 * Colour ramps as data.
 *
 * Five of these were hand-written GLSL — a base colour and a chain of
 * `mix(c, next, smoothstep(a, b, t))` lines, one per stop, each one a constant
 * only reachable by editing a shader and reloading. They are rows of a uniform
 * table now, so recolouring a material is a table edit or a drag of a swatch.
 * MATERIAL-SYSTEM.md R3.
 *
 * **The windows overlap, and that is the whole subtlety.** These are not
 * gradients between neighbouring stops: every stop is mixed over whatever the
 * chain has produced so far, so where one window has not closed before the next
 * opens, three colours are in play at once and the *order* decides the hue.
 * `rampColour` runs the same chain in the same order, which is why the ports
 * came out identical rather than merely close.
 */

export type RampName = 'labrador' | 'berry' | 'star' | 'burn' | 'ice';

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
  /** Mixed over the base in order. Fewer than `STOPS` is fine. */
  stops: RampStop[];
  /**
   * How far the finished colour is pulled toward its own luma.
   *
   * Stored as the pull rather than what survives it, so the usual answer is
   * zero — and a mix by zero is the identity however a driver spells `mix`,
   * which is why four of these five ports came out bit for bit.
   */
  grey: number;
}

/** Stops per ramp. Fixed, so the evaluator is one loop with a constant bound. */
const STOPS = 4;

/** vec4 rows per ramp: the head, one per stop, then the four window ends. */
const STRIDE = STOPS + 2;

/**
 * The window a padding stop sits in. Past 1, so `smoothstep` returns zero and
 * the mix is the identity for any `t` a ramp is asked about.
 */
const NEVER = 2;

/**
 * The ramps.
 *
 * Every number here was lifted verbatim from the GLSL it replaces; the notes
 * are the ones that stood over those functions, kept because they say why the
 * colours are what they are, which is the part that will be argued with.
 */
export const RAMPS: readonly Ramp[] = [
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
    // The marble berry's Bragg stacks, by layer thickness. Saturated where
    // labradorite is not: this is structural colour with nothing over it.
    name: 'berry',
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
    // The tenebrescent front: unburnt white, through the rose of the edge, into
    // the violet the stone darkens to.
    name: 'burn',
    base: [1, 0.99, 0.97],
    stops: [
      { start: 0, end: 0.26, rgb: [0.9, 0.55, 0.58] },
      { start: 0.22, end: 0.55, rgb: [0.52, 0.17, 0.44] },
      { start: 0.52, end: 1, rgb: [0.24, 0.07, 0.3] },
    ],
    grey: 0,
  },
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

/** Where each ramp starts in the bank. Interpolated into GLSL as a constant. */
export const RAMP_ROW = Object.fromEntries(
  RAMPS.map((ramp, index) => [ramp.name, index * STRIDE]),
) as Record<RampName, number>;

const ROWS = RAMPS.length * STRIDE;

const BANK = new Float32Array(ROWS * 4);

export const rampUniforms = {
  uRampStops: { value: BANK },
};

/** Pushes `RAMPS` into the uniform bank. The dev sliders call this on change. */
export function uploadRamps(): void {
  RAMPS.forEach((ramp, index) => {
    const head = index * STRIDE * 4;
    BANK[head] = ramp.base[0];
    BANK[head + 1] = ramp.base[1];
    BANK[head + 2] = ramp.base[2];
    BANK[head + 3] = ramp.grey;

    const ends = head + (STRIDE - 1) * 4;
    for (let i = 0; i < STOPS; i++) {
      const stop = ramp.stops[i];
      const at = head + (1 + i) * 4;
      BANK[at] = stop ? stop.rgb[0] : 0;
      BANK[at + 1] = stop ? stop.rgb[1] : 0;
      BANK[at + 2] = stop ? stop.rgb[2] : 0;
      BANK[at + 3] = stop ? stop.start : NEVER;
      BANK[ends + i] = stop ? stop.end : NEVER + 1;
    }
  });
}

uploadRamps();

/**
 * The evaluator. Spliced by `applyFinish` wherever a ramp is read — the recipes
 * and the frost grains both — and identical text whatever is in the mask.
 *
 * A row is six vec4: the base colour with the grey pull in its w, then four
 * stop colours each carrying the t it starts at, then the four t it finishes
 * at. Stops a ramp does not use sit in a window past 1 and change nothing.
 */
export const RAMP_GLSL = /* glsl */ `
  uniform vec4 uRampStops[${ROWS}];

  vec3 rampColour(int row, float t) {
    vec4 head = uRampStops[row];
    vec4 ends = uRampStops[row + ${STRIDE - 1}];
    vec3 c = head.rgb;
    for (int i = 0; i < ${STOPS}; i++) {
      vec4 stop = uRampStops[row + 1 + i];
      c = mix(c, stop.rgb, smoothstep(stop.w, ends[i], t));
    }
    return mix(c, vec3(dot(c, vec3(0.3333))), head.w);
  }
`;
