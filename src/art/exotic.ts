/**
 * The exotic lane: ten optical models selected by a one-byte recipe index
 * rather than by ten more per-vertex parameters. See EXOTIC-MATERIALS.md.
 *
 * Recipes are driven by object-space position and object-space directions, not
 * by the fragment normal: the material is flat shaded, so `dot(N, H)` and
 * `dot(N, V)` are constant across a triangle and anything keyed on them comes
 * out as triangle-shaped patches confined to the specular highlight. Where a
 * surface normal is genuinely needed, `exoticSmoothNormal()` gives the
 * interpolated attribute normal — smooth on lathes and subdivided polyhedra,
 * the face normal on a box.
 *
 * Each recipe is evaluated twice: against the light (the peak) and against the
 * eye (everywhere).
 */

/** Which optical model runs, if any. One byte, un-normalized: 0 is none. */
export const EXOTIC_ATTRIBUTE = 'aExotic';

/** The recipes. Indices are written down because they are baked into geometry. */
export const EXOTICS = {
  schiller: 1,
  quickmetal: 2,
  tenebrescent: 3,
  nacreous: 4,
  pointillist: 7,
  voidstone: 10,
} as const satisfies Record<string, number>;

export type ExoticName = keyof typeof EXOTICS;

export const exoticUniforms = {
  /** Dev toggle. Zero leaves the plain finish underneath. */
  uExoticOn: { value: 1 },
  /** Scales every clock here. Rides the reduced-motion setting. */
  uExoticMotion: { value: 1 },
};

function id(name: ExoticName): string {
  return EXOTICS[name].toFixed(1);
}

/**
 * Spliced into the shared art material by `applyFinish`, after the finish
 * stage's helpers and before its `RE_Direct`. Requires `vExotic`,
 * `vExoticView`, `vExoticSide`, `vExoticUp`, `vExoticNormal`, `vWearPos`,
 * `vObjectPhase`, `vDetailView`, `swayTime`, `wearNoise`, `finishHash3`,
 * `exoticToObject`, `exoticSmoothNormal` and `skyColourWithSun` in scope.
 *
 * (No backticks below: this is a template literal.)
 */
export const EXOTIC_GLSL = /* glsl */ `
  uniform float uExoticOn;
  uniform float uExoticMotion;

  /** The light direction in object space, captured from the brightest light. */
  vec3 exoticSunObj = vec3(0.0, 1.0, 0.0);
  float exoticSunWeight = 0.0;
  /** How close this fragment is to the tenebrescent front, for its edge glow. */
  float exoticBurnHalo = 0.0;
  /** The tenebrescent state here: 0 pale, 1 violet. */
  float exoticBurnT = 0.0;

  bool isExotic(float which) {
    return uExoticOn > 0.5 && abs(vExotic - which) < 0.5;
  }

  float exoticTime() {
    return swayTime * uExoticMotion;
  }

  /** Rolls a value off toward a ceiling instead of letting it clip. */
  vec3 exoticKnee(vec3 c, float ceiling) {
    return ceiling * c / (ceiling + c);
  }

  /** Metres per chunky pixel on this surface. */
  float exoticFootprint() {
    return length(fwidth(vDetailView));
  }

  float exoticFbm(vec3 p) {
    return wearNoise(p) * 0.68 + wearNoise(p * 2.7 + 13.1) * 0.32;
  }

  /** (angle about the object axis, height, radius). */
  vec3 exoticBody(vec3 p) {
    return vec3(atan(p.z, p.x), p.y, length(p.xz));
  }

  /**
   * Pushes a position sideways by a drifting noise field, so anything
   * quantized or latticed from it comes out irregular instead of axis-aligned.
   */
  vec3 exoticWarp(vec3 p, float scale, float amount, float rate) {
    float t = exoticTime() * rate;
    return p + (vec3(
      wearNoise(p * scale + vec3(t, 0.0, 0.0)),
      wearNoise(p * scale + vec3(3.1, t * 0.71, 0.0)),
      wearNoise(p * scale + vec3(0.0, 0.0, 7.3 + t * 0.53))
    ) - 0.5) * amount;
  }

  /**
   * An irrational tilt for point lattices. Geometry faces are axis-aligned and
   * so are lattice planes, so points on a large flat face land in visible
   * rows; tilted, the face cuts the lattice at an angle and the points land
   * nonperiodically.
   */
  const mat3 EXOTIC_TILT = mat3(
    0.7986, 0.0, -0.6018,
    0.2351, 0.9205, 0.3120,
    0.5540, -0.3907, 0.7351);

  /**
   * A real integer hash (pcg3d). The sin hash is periodic along lattice rows,
   * so neighbouring cells draw correlated values and whole rows of features
   * align and light together — which is exactly a stripe. This one has no
   * correlation to band.
   */
  vec3 exoticHash3(vec3 p) {
    uvec3 v = uvec3(ivec3(floor(p))) * uvec3(1664525u, 1013904223u, 2246822519u);
    v.x += v.y * v.z;
    v.y += v.z * v.x;
    v.z += v.x * v.y;
    v ^= v >> 16u;
    v.x += v.y * v.z;
    v.y += v.z * v.x;
    v.z += v.x * v.y;
    return vec3(v) * (1.0 / 4294967295.0);
  }

  /**
   * Nearest feature point in a jittered lattice. Returns distance in x and the
   * owning cell in yzw. Sites are held near their cell centres, so the eight
   * cells meeting at the nearest lattice corner are enough to search.
   */
  vec4 exoticCell(vec3 p, out float border) {
    vec3 corner = floor(p + 0.5);
    float best = 100.0;
    float second = 100.0;
    vec3 bestCell = corner;
    for (int i = -1; i <= 0; i++) {
      for (int j = -1; j <= 0; j++) {
        for (int k = -1; k <= 0; k++) {
          vec3 c = corner + vec3(float(i), float(j), float(k));
          vec3 site = c + 0.5 + (exoticHash3(c) - 0.5) * 0.72;
          float d = length(site - p);
          if (d < best) {
            second = best;
            best = d;
            bestCell = c;
          } else if (d < second) {
            second = d;
          }
        }
      }
    }
    // The gap to the runner-up is zero exactly on the boundary between two
    // cells, so it draws the polygon edges rather than a ring round each site.
    border = second - best;
    return vec4(best, bestCell);
  }

  // --- schiller: labradorite ------------------------------------------------
  //
  // Twinned domains, each a stack of lamellae at its own angle inside the
  // crystal. A domain floods when the light and the eye straddle *its* plane,
  // which is independent of the surface — so the flood is smooth across facets
  // and different domains answer all over the stone at once.

  /** Weighted blue, then teal, green uncommon, gold rare. Pulled toward grey. */
  vec3 exoticLabradorTint(float draw) {
    vec3 c = mix(vec3(0.16, 0.30, 0.72), vec3(0.14, 0.44, 0.78), smoothstep(0.0, 0.36, draw));
    c = mix(c, vec3(0.16, 0.55, 0.66), smoothstep(0.44, 0.68, draw));
    c = mix(c, vec3(0.30, 0.62, 0.46), smoothstep(0.74, 0.88, draw));
    c = mix(c, vec3(0.78, 0.64, 0.32), smoothstep(0.91, 1.0, draw));
    return mix(vec3(dot(c, vec3(0.3333))), c, 0.74);
  }

  /** The domain field, warped so boundaries interlock rather than tile. */
  vec2 exoticPlates() {
    vec3 w = exoticWarp(vWearPos, 3.1, 0.16, 0.02);
    return vec2(wearNoise(w * 7.5 + 3.1), wearNoise(w * 12.0 + 11.7));
  }

  /** Darkening where two domains meet. */
  float exoticSchillerSeam() {
    vec2 f = exoticPlates();
    float seam = smoothstep(0.06, 0.0, abs(fract(f.x * 6.0) - 0.5) - 0.44)
      + smoothstep(0.06, 0.0, abs(fract(f.y * 5.0) - 0.5) - 0.44);
    return 1.0 - 0.30 * saturate(seam);
  }

  /** One scale of domain. */
  vec3 exoticSchillerScale(vec3 driveObj, vec2 field, float coarseness, float bandGain) {
    float plate = floor(field.x * 6.0) * 11.0 + floor(field.y * 5.0);
    vec3 draw = finishHash3(vec3(plate, plate * 0.37 + 1.3, plate * 1.71 + 7.9));
    vec3 alt = finishHash3(vec3(plate * 2.11 + 5.7, plate * 0.53, plate * 1.29 + 19.3));
    float t = exoticTime();

    // The domain's plane, precessing slowly so floods travel rather than blink.
    vec3 plane = normalize(draw * 2.0 - 1.0 + vec3(0.0, 0.0013, 0.0));
    plane = normalize(plane + vec3(
      sin(t * 0.13 + draw.x * 6.2831853),
      sin(t * 0.11 + draw.y * 6.2831853),
      sin(t * 0.09 + draw.z * 6.2831853)
    ) * 0.11);

    // A band, not a threshold: each domain answers at its own angle, so only a
    // fraction are alight at any moment. Two unrelated clocks move the band.
    float align = abs(dot(plane, driveObj));
    float centre = 0.34 + draw.x * 0.55
      + sin(t * 0.10 + vWearPos.y * 2.4 + vObjectPhase * 6.2831853) * 0.045
      + sin(t * (0.21 + alt.y * 0.3) + draw.z * 6.2831853) * 0.035;
    float width = (0.05 + alt.x * 0.07) * bandGain;

    float away = abs(align - centre) / width;
    if (away >= 1.0) return vec3(0.0);
    float lit = 1.0 - away * away;
    lit = lit * lit * (0.55 + 0.45 * lit);

    // Lamellae along the plate's own normal, with a finer cross-set over them.
    float pitch = (120.0 + alt.y * 150.0) * coarseness;
    float sheets = 0.5 + 0.5 * sin(dot(vWearPos, plane) * pitch + alt.z * 6.2831853);
    vec3 across = normalize(cross(plane, vec3(0.37, 0.86, 0.35)));
    float weave = 0.5 + 0.5 * sin(dot(vWearPos, across) * pitch * 2.3 + 1.7);
    float structure = 0.72 + 0.20 * sheets + 0.08 * weave;
    structure = mix(1.0, structure, 1.0 - smoothstep(0.004, 0.017, exoticFootprint()));

    // Fringes run a little further round the wheel than the core of a flood.
    vec3 tint = exoticLabradorTint(fract(draw.y + draw.z * 0.31 + (1.0 - lit) * 0.10));
    return tint * (lit * structure);
  }

  /**
   * The flood: coarse domains, a finer set inside them, and a faint sheen
   * everywhere so the rock between floods is never plain dead grey.
   */
  vec3 exoticSchiller(vec3 driveObj) {
    vec3 wCoarse = exoticWarp(vWearPos, 3.1, 0.16, 0.02);
    vec2 coarse = vec2(wearNoise(wCoarse * 7.5 + 3.1), wearNoise(wCoarse * 12.0 + 11.7));
    vec3 wFine = exoticWarp(vWearPos, 6.2, 0.09, 0.035);
    vec2 fine = vec2(wearNoise(wFine * 19.0 + 27.3), wearNoise(wFine * 31.0 + 5.9));

    vec3 flood = exoticSchillerScale(driveObj, coarse, 1.0, 1.0)
      + exoticSchillerScale(driveObj, fine, 2.1, 1.5) * 0.28;

    // A low sheen over the whole stone, from the coarse field's own plane: a
    // labradorite that is not flooding still catches light off its twins.
    float base = 0.5 + 0.5 * sin(dot(vWearPos, normalize(vec3(coarse, 0.5) * 2.0 - 1.0)) * 40.0);
    vec3 rest = exoticLabradorTint(fract(coarse.x * 3.0 + 0.2))
      * (0.055 + 0.05 * base) * (0.35 + 0.65 * abs(driveObj.y));
    return flood + rest;
  }

  // --- quickmetal: mercury --------------------------------------------------
  //
  // A mirror reflecting an invented, violently contrasted surroundings: dark
  // ground, a blazing horizon line, cool sky above, coloured from the zone's
  // own sky pair. The wobble bends the reflected ray across that horizon, so
  // bright and dark bands snake over the surface as it flows.

  /**
   * Four scales of flow: broad swells, a mid counter-swell drifting the other
   * way, a chop advected by the swells, and a fine ripple advected by the
   * chop. Each layer bends the reflected ray at its own rate.
   */
  vec3 exoticWobble(vec3 worldDir) {
    float t = exoticTime() * 0.16;
    vec3 q = vWearPos * 2.1 + vObjectPhase * 9.0;
    vec3 swell = vec3(
      wearNoise(q + vec3(t, 0.0, 0.0)),
      wearNoise(q * 1.13 + vec3(0.0, t * 1.25, 3.7)),
      wearNoise(q * 0.91 + vec3(5.1, 0.0, t * 0.75))
    ) - 0.5;
    swell *= vec3(0.75, 1.7, 0.75);

    vec3 q2 = vWearPos * 4.6 + vObjectPhase * 5.0;
    vec3 swell2 = (vec3(
      wearNoise(q2 + vec3(0.0, t * 0.9, 1.7)),
      wearNoise(q2 * 1.07 + vec3(t * 0.7, 0.0, 8.3)),
      wearNoise(q2 * 0.95 + vec3(2.9, t * 0.55, 0.0))
    ) - 0.5) * vec3(0.45, 0.85, 0.45);

    vec3 r = vWearPos * 8.5 + swell * 0.55 + vec3(0.0, -t * 2.2, 0.0);
    vec3 chop = (vec3(
      wearNoise(r), wearNoise(r * 1.07 + 11.3), wearNoise(r * 0.94 + 23.9)
    ) - 0.5) * 0.50;

    vec3 r2 = vWearPos * 22.0 + chop * 2.0 + vec3(0.0, -t * 4.5, 0.0);
    vec3 ripple = (vec3(
      wearNoise(r2), wearNoise(r2 * 1.09 + 31.7), wearNoise(r2 * 0.93 + 47.1)
    ) - 0.5) * 0.16;

    return normalize(worldDir + swell + swell2 + chop + ripple);
  }

  /**
   * The invented surroundings, keyed only on the bent ray's elevation. Hard
   * edges on purpose: a mirror is only as crisp as what it reflects.
   */
  vec3 exoticChromeEnv(vec3 dir) {
    float h = dir.y;
    vec3 ground = uHorizon * 0.08;
    vec3 upper = mix(uHorizon * 1.30, uZenith * 1.05, smoothstep(0.02, 0.75, h));
    vec3 env = mix(ground, upper, smoothstep(-0.015, 0.02, h));
    // The flash line at the horizon, thin and hot, with a dark cut just below
    // so the mirror line reads double, and fainter strata above it.
    env += uHorizon * (exp(-h * h * 700.0) * 1.1);
    float under = h + 0.05;
    env *= 1.0 - exp(-under * under * 800.0) * 0.5;
    float band1 = h - 0.16;
    float band2 = h - 0.40;
    env += uHorizon * (exp(-band1 * band1 * 900.0) * 0.30);
    env += uZenith * (exp(-band2 * band2 * 500.0) * 0.22);
    // Two bright pillars turning slowly about the azimuth, for the mirror to
    // stretch and snap as the surface flows.
    float az = atan(dir.z, dir.x);
    float tq = exoticTime();
    float pillar = exp(-pow2(sin((az - tq * 0.021) * 0.5)) * 150.0)
      + exp(-pow2(sin((az + 1.9 + tq * 0.013) * 0.5)) * 260.0) * 0.55;
    env += (uHorizon * 1.1 + uZenith * 0.45)
      * (pillar * smoothstep(-0.02, 0.10, h) * (1.0 - smoothstep(0.2, 0.8, h)));
    // Scattered bright shards and dark pits at a fine angular scale, in both
    // hemispheres: two-dimensional content for the flow to warp, so the
    // reflection is detail everywhere rather than one banded gradient.
    float shard = smoothstep(0.70, 0.78, wearNoise(dir * 14.0 + 3.7))
      + smoothstep(0.76, 0.83, wearNoise(dir * 31.0 + 17.1)) * 0.6;
    env += (uHorizon * 0.9 + uZenith * 0.4) * shard;
    env *= 1.0 - smoothstep(0.68, 0.78, wearNoise(dir * 9.0 + 41.0)) * 0.55;
    return env;
  }

  /**
   * x: a slight warm-to-cool shift, the metal's own colour. y: ridged streaks
   * running down the surface, sampled in a frame squeezed along the drain.
   */
  vec2 exoticQuickBody() {
    float t = exoticTime() * 0.16;
    vec3 q = vec3(vWearPos.x * 12.0, vWearPos.y * 3.2 - t * 2.4, vWearPos.z * 12.0);
    float sheet = wearNoise(q) * 0.52
      + wearNoise(q * 2.3 + 7.3) * 0.30
      + wearNoise(q * 5.7 + 19.1) * 0.18;
    sheet = 1.0 - abs(sheet * 2.0 - 1.0);
    sheet = pow(saturate(sheet), 2.2);
    float warmth = exoticFbm(vWearPos * 1.8 + vec3(t * 0.5, 0.0, 0.0));
    return vec2(warmth, sheet);
  }

  // --- tenebrescence: hackmanite --------------------------------------------
  //
  // Sunlight darkens it; shade leaves it pale. Everything interesting is at the
  // boundary, which grows fingers toward the light and moves.

  /**
   * How far the front is pushed here, in exposure units. Finger-width and
   * finer only: a coarse octave would displace the front bodily off the
   * terminator instead of fraying it.
   */
  float exoticCreep() {
    float t = exoticTime();
    // Sampled along the light direction, so fingers elongate toward the sun.
    vec3 toward = vWearPos - exoticSunObj * 0.022;
    vec3 tendrilPos = exoticWarp(toward * 15.0, 0.9, 1.0, 0.07);
    float tendrils = wearNoise(tendrilPos + vec3(t * 0.22, 0.0, -t * 0.14)) - 0.5;
    float fray = wearNoise(toward * 42.0 - vec3(0.0, t * 0.41, 0.0)) - 0.5;
    float dust = wearNoise(toward * 105.0 + vec3(t * 0.6, 0.0, 0.0)) - 0.5;
    return tendrils * 0.52 + fray * 0.33 + dust * 0.15;
  }

  /**
   * The body of the stone in both states: a drifting blue-white bloom under
   * the surface, a tighter core inside it, and fine crystalline grain over
   * everything so neither face is flat paint.
   */
  vec3 exoticMoonbloom(float t) {
    float drift = exoticTime() * 0.035;
    // Two clouds at different rates, so the bloom moves through itself.
    float bloom = exoticFbm(vWearPos * 1.9 + vec3(0.0, drift, 0.0)) * 0.62
      + exoticFbm(vWearPos * 3.7 - vec3(drift * 0.7, 0.0, 1.3)) * 0.38;
    bloom = smoothstep(0.30, 0.78, bloom);

    vec3 grit = exoticWarp(vWearPos, 8.0, 0.05, 0.0);
    float sugar = wearNoise(grit * 120.0) * 0.6 + wearNoise(grit * 320.0) * 0.4;
    sugar = mix(1.0, 0.82 + 0.36 * sugar, 1.0 - smoothstep(0.003, 0.014, exoticFootprint()));

    float core = smoothstep(0.55, 0.95, exoticFbm(vWearPos * 5.2 + vec3(drift * 1.3, 0.0, 4.4)));

    // Pale state: cool blue-white where the bloom is, warm white where it is not.
    vec3 pale = mix(vec3(1.0, 0.99, 0.96), vec3(0.74, 0.85, 1.0), bloom * 0.62);
    pale = mix(pale, vec3(0.88, 0.94, 1.0), core * 0.45);
    // Dark state: the same blooms read as fire inside the violet.
    vec3 deep = mix(vec3(0.88, 0.84, 1.0), vec3(1.0, 0.78, 0.90), bloom * 0.75);
    deep = mix(deep, vec3(1.0, 0.62, 0.78), core * 0.5);
    return mix(pale, deep, t) * sugar;
  }

  vec3 exoticBurn(float exposure) {
    // Threshold grain, kept fine and small — a broad offset here would move
    // the terminator itself.
    float region = wearNoise(vWearPos * 3.0);
    float speck = wearNoise(vWearPos * 26.0);
    float grain = (region - 0.5) * 0.06 + (speck - 0.5) * 0.09;

    float t = saturate((exposure * 1.9 - 0.30) / 0.86 + grain);
    // The creep only acts in a narrow window around the front.
    float edge = 4.0 * t * (1.0 - t);
    edge *= edge;
    t = saturate(t + exoticCreep() * 0.85 * edge);
    t = t * t * (3.0 - 2.0 * t);

    vec3 c = mix(vec3(1.0, 0.99, 0.97), vec3(0.90, 0.55, 0.58), smoothstep(0.0, 0.26, t));
    c = mix(c, vec3(0.52, 0.17, 0.44), smoothstep(0.22, 0.55, t));
    c = mix(c, vec3(0.24, 0.07, 0.30), smoothstep(0.52, 1.0, t));
    // A warm lift right at the front, and the edge-glow weight read back by
    // the finish stage.
    float halo = 4.0 * t * (1.0 - t);
    exoticBurnHalo = halo * halo * 0.45;
    exoticBurnT = t;
    c += vec3(0.10, 0.03, 0.05) * halo * halo;
    return c * exoticMoonbloom(t);
  }

  /**
   * Crystalline sparkle, different in each state: the pale face carries sparse
   * icy pinpricks, the violet face denser rose-gold sparks.
   */
  vec3 exoticTeneSparkle(vec3 halfObj, float state) {
    vec3 p = EXOTIC_TILT * (vWearPos * 150.0);
    vec3 cellId = floor(p);
    vec3 seed = exoticHash3(cellId);
    vec3 alt = exoticHash3(cellId + 18.0);
    float t = exoticTime();
    // The catching plane precesses, so sparks flare and die over time.
    vec3 plane = normalize(seed * 2.0 - 1.0 + vec3(0.0, 0.0013, 0.0) + vec3(
      sin(t * (0.5 + alt.z * 0.7) + seed.x * 6.2831853),
      sin(t * 0.43 + seed.y * 6.2831853),
      sin(t * 0.37 + alt.x * 6.2831853)) * 0.16);
    float lit = pow(abs(dot(plane, halfObj)), 30.0 + alt.y * 60.0);
    float shimmer = 0.65 + 0.35 * sin(t * (1.2 + alt.y * 1.6) + seed.z * 6.2831853);
    vec3 off = fract(p) - 0.5 - (seed - 0.5) * 0.5;
    float spot = 1.0 - smoothstep(0.0, 0.20 + alt.x * 0.15, length(off));
    float fade = 1.0 - smoothstep(0.002, 0.010, exoticFootprint());
    float gate = mix(step(0.62, seed.y), step(0.30, seed.y), state);
    vec3 tint = mix(vec3(0.85, 0.93, 1.0), vec3(1.0, 0.72, 0.86), state);
    return tint * (spot * lit * shimmer * gate * fade);
  }

  // --- nacreous: pearl ------------------------------------------------------
  //
  // Warm near-white body, a deep lustre from under the surface, curved growth
  // lines, and only a faint wash of interference over it.

  /**
   * Film thickness in soft broad patches.
   *
   * Growth lines drawn as a wave gave a corduroy shell, and a pearl has no
   * stripes on it — the nacre is laid in concentric shells around a nucleus and
   * what you see at the surface is an uneven *thickness*, which puts the colour
   * in soft clouds. Two scales of noise, drifting slowly.
   */
  float exoticNacreThickness() {
    float t = exoticTime() * 0.035;
    return 0.55
      + 1.15 * exoticFbm(vWearPos * 2.3 + vec3(0.0, t, 0.0))
      + 0.35 * wearNoise(vWearPos * 6.8 - vec3(t * 0.6, 0.0, 2.1));
  }

  /**
   * Orient: the iridescent wash.
   *
   * A pearl really does show pink, green and gold, so this is a full hue walk —
   * but laid over white at low strength, in patches, and strongest where the
   * surface turns away. Saturated hue on a white body is what pearlescence is;
   * saturated hue on a coloured body would be an oil slick.
   */
  vec3 exoticNacreSheen(float smoothNV) {
    float phase = (1.0 - smoothNV) * 2.1 + exoticNacreThickness() * 1.35;
    vec3 hue = 0.5 + 0.5 * cos(6.2831853 * (phase + vec3(0.0, 0.33, 0.67)));
    // Pale, and never below white: this tints the lustre rather than replacing
    // it, so the pearl stays a pearl and gains a rainbow.
    return mix(vec3(1.0), hue, 0.42) * (0.70 + 0.30 * pow(1.0 - smoothNV, 1.4));
  }

  /** Orient: broadest where the path through the platelets is longest. */
  float exoticOrient(float smoothNV) {
    float rim = pow(1.0 - smoothNV, 2.0);
    float body = pow(1.0 - smoothNV, 0.55) * 0.6;
    float t = exoticTime() * 0.05;
    float cloud = 0.80 + 0.32 * exoticFbm(vWearPos * 3.4 + vec3(0.0, t, 7.7));
    return (rim + body) * cloud;
  }

  // --- pointillist: the marble berry ----------------------------------------
  //
  // Bragg stacks whose layer thickness differs cell to cell. Cells come from a
  // Worley lattice and are shaded as domes, so they interlock instead of
  // tiling.

  vec3 exoticBerryTint(float thickness, float smoothNV) {
    float h = saturate(thickness - (1.0 - smoothNV) * 0.20);
    vec3 c = mix(vec3(0.09, 0.20, 0.74), vec3(0.10, 0.42, 0.88), smoothstep(0.0, 0.38, h));
    c = mix(c, vec3(0.16, 0.63, 0.60), smoothstep(0.40, 0.66, h));
    c = mix(c, vec3(0.44, 0.62, 0.26), smoothstep(0.68, 0.86, h));
    return mix(c, vec3(0.88, 0.68, 0.26), smoothstep(0.88, 1.0, h));
  }

  float exoticCellDensity() {
    float finest = 1.0 / 26.0;
    float steps = clamp(log2(max(exoticFootprint() * 2.0, finest) / finest), 0.0, 3.0);
    return 26.0 / exp2(floor(steps));
  }

  /** (stack thickness, dome shading, how much film the cell carries). */
  vec3 exoticBerryCell(float density) {
    // Barely warped: the lattice showing through is the point. What is wanted
    // is mathematical irregularity, not organic blobbing.
    vec3 p = exoticWarp(vWearPos, 4.5, 0.014, 0.012) * density;
    float border;
    vec4 cell = exoticCell(p, border);
    vec3 draw = finishHash3(cell.yzw);
    vec3 alt = finishHash3(cell.yzw + 47.3);

    // A coarser field underneath, offset along the eye ray, so a cell shows a
    // hint of a different one behind it and the skin has a thickness.
    float underBorder;
    vec4 under = exoticCell((vWearPos - vExoticView * 0.012) * density * 0.42 + 9.7, underBorder);
    vec3 deep = finishHash3(under.yzw);

    float cluster = wearNoise(floor(cell.yzw * 0.25) * 0.8 + 3.3);
    float breath = sin(exoticTime() * 0.045 + draw.z * 6.2831853 + vObjectPhase * 6.2831853);
    // Cubed: the stops past two thirds of the ramp are olive and gold, so four
    // cells in five need to land in the blues.
    // Narrower than before: the cells that landed in olive and gold were
    // reading as flecks of solid colour stuck on rather than as part of the
    // same skin.
    float thickness = saturate(
      0.06 + 0.44 * draw.x * draw.x * draw.x + cluster * 0.24
        + deep.x * 0.10 + breath * 0.020
    );

    // Nearly flat across the cell: a tile, not a dome. The under-layer lifts
    // the middle a little so the skin is not perfectly even.
    // Edge width, widened with the pixel footprint. A line whose width is fixed
    // in object space falls under a pixel at a few metres and crawls; widened
    // as it recedes it stays a line and simply softens, which is what every
    // other fine field here does and for the same reason.
    float soft = 0.055 + exoticFootprint() * density * 0.9;
    float shade = 0.80 + 0.26 * (1.0 - smoothstep(0.20, 0.55 + soft, cell.x))
      + 0.12 * (1.0 - smoothstep(0.1, 0.5, under.x));
    // A rare cell catches the light for a moment, in its own colour.
    float flash = step(0.985, alt.z)
      * pow(0.5 + 0.5 * sin(exoticTime() * (0.6 + alt.x * 0.8) + draw.x * 6.2831853), 8.0);
    shade += flash * 0.4;
    float film = alt.y > 0.97 ? 0.30 : 1.0;
    // The polygon edge, and a fainter one from the layer beneath showing through.
    film *= 0.30 + 0.70 * smoothstep(0.0, soft, border);
    film *= 0.80 + 0.20 * smoothstep(0.0, soft * 1.6, underBorder);
    return vec3(thickness, shade, film);
  }

  // --- voidstone ------------------------------------------------------------
  //
  // A night sky as a function of direction. Layers drift on their own axes at
  // their own rates, which is what makes it a volume rather than a turntable.

  vec3 exoticDrift(vec3 d, float rate, vec3 axis) {
    float a = exoticTime() * rate;
    float c = cos(a);
    float s = sin(a);
    return d * c + cross(axis, d) * s + axis * dot(axis, d) * (1.0 - c);
  }

  /**
   * Star colour by surface temperature. Weighted heavily to the cool white end,
   * because that is what a naked eye resolves; the orange ones are the rare
   * bright giants and are worth having for exactly that reason.
   */
  vec3 exoticStarTint(float h) {
    vec3 c = mix(vec3(0.72, 0.80, 1.00), vec3(0.94, 0.96, 1.00), smoothstep(0.0, 0.42, h));
    c = mix(c, vec3(1.00, 0.95, 0.86), smoothstep(0.40, 0.76, h));
    return mix(c, vec3(1.00, 0.78, 0.55), smoothstep(0.80, 1.0, h));
  }

  /**
   * A dense field of faint stars.
   *
   * Gaussian rather than a thresholded disc: a hard edge on a point smaller
   * than a pixel is a lit pixel with an aliased boundary, which is what the
   * single-pixel specks were. A gaussian has no edge to alias, stays smooth at
   * any size, and is what a defocused point source actually looks like.
   *
   * Magnitudes follow a power law, so most of the field is far below the
   * threshold of notice and the few that are not carry the sky.
   */
  vec3 exoticStarDust(vec3 d, float density, float size, float rarity) {
    vec3 p = d * density;
    // A star smaller than a pixel widens to pixel size and dims to conserve
    // energy, so distance fades the field instead of deleting it.
    float px = length(fwidth(p)) * 0.55;
    // The eight cells around the point, so a star's kernel is drawn whole
    // from every side instead of being sliced off at its own cell wall.
    vec3 corner = floor(p - 0.5);
    vec3 total = vec3(0.0);
    for (int i = 0; i <= 1; i++) {
      for (int j = 0; j <= 1; j++) {
        for (int k = 0; k <= 1; k++) {
          vec3 c = corner + vec3(float(i), float(j), float(k));
          vec3 draw = finishHash3(c);
          float magnitude = pow(draw.z, rarity);
          vec3 delta = p - (c + 0.25 + finishHash3(c + 31.7) * 0.5);
          float radius = size * (0.45 + magnitude);
          float r2 = radius * radius;
          float r2eff = r2 + px * px;
          // Super-gaussian: a flat bright core with a fast clean falloff, so
          // a star is a point of light rather than a smudge, and alias-free.
          float g = dot(delta, delta) / r2eff;
          float star = exp(-g * g) * (r2 / r2eff);
          total += exoticStarTint(draw.y) * (star * magnitude);
        }
      }
    }
    return total;
  }

  /**
   * The bright few, with halos and a slow twinkle.
   *
   * Searched over the eight cells around the point rather than only its own, so
   * a halo crosses cell walls instead of being clipped by them, and two stars
   * can sit close together the way real ones do.
   */
  vec3 exoticStarBright(vec3 d, float density, float size, float rarity, float twinkle) {
    vec3 p = d * density;
    float px = length(fwidth(p)) * 0.55;
    // Centred on the point, not forward-biased: a star just behind a wall
    // would otherwise have its halo and spikes clipped by it.
    vec3 corner = floor(p - 0.5);
    vec3 total = vec3(0.0);
    for (int i = 0; i <= 1; i++) {
      for (int j = 0; j <= 1; j++) {
        for (int k = 0; k <= 1; k++) {
          vec3 c = corner + vec3(float(i), float(j), float(k));
          vec3 draw = finishHash3(c);
          float magnitude = pow(draw.z, rarity);
          if (magnitude < 0.06) continue;

          // Two unrelated fast beats, each star on its own phase and rate.
          float beat = exoticTime() * (1.4 + draw.x * 2.3) + draw.y * 6.2831853;
          float shimmer = 1.0 - twinkle * 0.30
            * (0.5 + 0.5 * sin(beat)) * (0.65 + 0.35 * sin(beat * 0.37 + 1.7));
          magnitude *= shimmer;

          vec3 delta = p - (c + finishHash3(c + 31.7));
          float r2 = dot(delta, delta);
          float radius = size * (0.45 + 0.55 * magnitude);
          // Widened to at least a pixel and dimmed to match, as in the dust.
          float rr = radius * radius;
          float r2eff = rr + px * px;
          float g = r2 / r2eff;
          float core = exp(-g * g) * (rr / r2eff);
          // A weak halo: the scatter an eye adds to anything bright.
          float halo = exp(-r2 / (rr * 9.0)) * 0.08;
          // The brightest carry four-point diffraction spikes, narrow across
          // and long along, sharing one orientation like a lens flare does.
          float bright = smoothstep(0.55, 0.90, magnitude);
          if (bright > 0.0) {
            float w2 = rr * 0.16 + px * px;
            float l2 = rr * 14.0;
            float spikes =
              exp(-(delta.y * delta.y + delta.z * delta.z) / w2 - delta.x * delta.x / l2)
              + exp(-(delta.x * delta.x + delta.z * delta.z) / w2 - delta.y * delta.y / l2);
            core += spikes * bright * 0.55 * (rr * 0.16 / w2);
          }
          total += exoticStarTint(draw.y) * ((core + halo) * magnitude);
        }
      }
    }
    return total;
  }

  vec3 exoticVoid(vec3 dir) {
    vec3 d = normalize(dir);
    float band = 1.0 - smoothstep(0.0, 0.5, abs(dot(d, vec3(0.31, 0.86, -0.41))));
    float crowd = 0.3 + 0.7 * band;

    vec3 slow = exoticDrift(d, 0.016, normalize(vec3(0.2, 1.0, 0.1)));
    float broad = smoothstep(0.40, 0.90, exoticFbm(slow * 2.6 + 4.7));
    float tight = smoothstep(0.52, 0.95, exoticFbm(slow * 6.1 + 21.3));
    float haze = exoticFbm(slow * 1.2 + 31.7);
    vec3 cool = mix(vec3(0.05, 0.03, 0.17), vec3(0.02, 0.10, 0.16), wearNoise(slow * 1.4));
    vec3 warm = mix(vec3(0.16, 0.05, 0.13), vec3(0.13, 0.09, 0.04), wearNoise(slow * 2.2 + 8.1));

    vec3 base = vec3(0.010, 0.012, 0.030) + vec3(0.020, 0.014, 0.040) * haze;
    vec3 cloud = cool * (broad * (0.55 + 0.75 * band))
      + warm * (tight * broad * (0.50 + 0.80 * band));

    // Two planes only: star fields behind the nebula, dimmed by it, and the
    // sharp bright stars in front. No dust is ever drawn over the clouds.
    //
    // Layer offsets are added AFTER the drift rotation. Added before, the
    // rotation spins the offset vector too, which turns a slow rotation into
    // a fast translation — the whole field sweeps across the window instead
    // of drifting in place.
    // Every plane turns at its own rate on its own axis, slowest at the back
    // and fastest in front (the nebula's 0.016 sits between), so the layers
    // shear against each other and the sky reads as a volume.
    vec3 far = exoticDrift(d, 0.0088, normalize(vec3(0.1, 1.0, 0.25)));
    vec3 far2 = exoticDrift(d, 0.0120, normalize(vec3(0.35, 1.0, -0.15))) + 3.0;
    vec3 near = exoticDrift(d, 0.0300, normalize(vec3(-0.3, 0.8, 0.5))) + 17.0;

    float behind = 1.0 - 0.80 * broad * (0.4 + 0.6 * band);
    vec3 sky = base
      + exoticStarDust(far, 135.0, 0.13, 9.0) * (1.4 * crowd) * behind
      + exoticStarDust(far2, 92.0, 0.14, 7.5) * (1.05 * crowd) * behind;
    sky += cloud;
    sky += exoticStarBright(near, 23.0, 0.10, 9.0, 1.0) * 1.35;
    // Kneed: a star that clips is a white disc, and the shape of a star is the
    // only thing that says it is one.
    return exoticKnee(sky, 0.90);
  }

  float exoticFilm(float base) {
    if (isExotic(${id('nacreous')})) return exoticNacreThickness();
    return base;
  }
`;
