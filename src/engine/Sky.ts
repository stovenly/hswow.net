import * as THREE from 'three';
import { NOISE_GLSL } from './noise';
import { CLOUDS_GLSL, DECK_LEVELS, GENERA, FORM, windAtHeight, type GenusName } from '../art/glsl/clouds';

/**
 * A procedural sky: vertical gradient plus a drifting cloud layer. No cubemap and
 * no texture — the gradient is three bands and the clouds are fractal value noise
 * projected onto a flat layer overhead.
 *
 * The horizon colour matters more than it looks: distant geometry fades to the fog
 * colour, so if the two disagree everything far away dissolves into a band of the
 * wrong colour hanging in front of the sky. Drawn as a sphere recentred on the
 * camera each frame — a fixed one has parallax, which is felt as wrongness without
 * being seen as an error.
 */

/**
 * The dome's *shape*, not its colour. Every colour in the sky is decided by sun
 * elevation and lives in `engine/atmosphere.ts` — one authored blue could only
 * ever be right at one hour of the day.
 */
export interface SkySettings {
  /**
   * How fast the horizon haze gives way to open sky. A real sky holds its pale band
   * for ten or fifteen degrees and deepens above that, so distant geometry meets it
   * at the horizon and separates from it gradually rather than all at once.
   */
  curve: number;
  /**
   * How fast the fog leaves the horizon, going up — not `curve`, and the difference
   * is load-bearing. `curve` describes the dome, kilometres of atmosphere seen
   * looking up; airlight over a couple of hundred metres of near-horizontal path is
   * horizon light and almost nothing else, so this stays well above it. Equal, an
   * object's own vertical ramp is the sky's ramp and it reads as a window rather
   * than as a hill.
   */
  airCurve: number;
  /**
   * The same, downward — how fast the dome leaves the horizon for `ground`. Its own
   * number, and it has to be: sharing `curve` puts the dome a fifth of the way to
   * grey half a degree below the horizon while the land in front of it is fading to
   * the sky's horizon colour, and the two disagree along the exact line the vista
   * band exists to hide. Above 1 the horizon colour holds a long way down.
   */
  underCurve: number;

  /** Master multiplier on every deck's opacity. 0 clears the sky. */
  cloudOpacity: number;
  /** Master multiplier on how fast the decks travel. 0 freezes them. */
  cloudDrift: number;

  /** Whether a sun disc is drawn at all. */
  sun: boolean;
  /** Angular radius of the disc, in degrees. The real one is about 0.27. */
  sunSize: number;
  /** How far the halo reaches. Larger is *tighter* — it is an exponent. */
  sunGlow: number;
}

/** The size the dome is authored at. `follow` scales it from the far plane. */
const RADIUS = 400;

/**
 * The dome's share of the far plane. Under 1 so it is never clipped away, and above
 * the fog's share so whatever stands behind it is already solid fog — the dome
 * writes depth in the normal pass and would take those outlines with it.
 */
export const SKY_FRACTION = 0.95;

/**
 * The sky's uniforms, at module scope and shared, for `windUniforms`' reason:
 * there is one sky, and everything that asks what colour it is has to get the same
 * answer. Water reflects into the sky where its screen-space march finds nothing,
 * and a reflection evaluated against a second copy would drift from the sky it is
 * reflecting the moment either was tuned. `Sky.apply` writes them; anything else
 * reads.
 */
export const skyUniforms = {
  uHorizon: { value: new THREE.Color() },
  uZenith: { value: new THREE.Color() },
  uGround: { value: new THREE.Color() },
  uCurve: { value: 1 },
  uUnderCurve: { value: 1.6 },
  /** The fog's own elevation curve. Large is flat. See `SKY_GRADIENT_GLSL`. */
  uAirCurve: { value: 1.4 },
  uTime: { value: 0 },
  // cover, softness, elements per kilometre, opacity.
  uDeckShape: { value: [new THREE.Vector4(), new THREE.Vector4(), new THREE.Vector4()] },
  // height in kilometres, form code, detail, stretch.
  uDeckForm: { value: [new THREE.Vector4(), new THREE.Vector4(), new THREE.Vector4()] },
  // shade, drift kilometres per second, amount, spare.
  uDeckLight: { value: [new THREE.Vector4(), new THREE.Vector4(), new THREE.Vector4()] },
  uDeckLit: { value: [new THREE.Color(), new THREE.Color(), new THREE.Color()] },
  uDeckShade: { value: [new THREE.Color(), new THREE.Color(), new THREE.Color()] },
  uDeckWind: { value: [new THREE.Vector2(), new THREE.Vector2(), new THREE.Vector2()] },
  uCloudWind: { value: new THREE.Vector2(0.01, 0) },
  uCloudTime: { value: 0 },
  /** What every path that is not the dome sees instead of three decks. */
  uSkyCover: { value: 0 },
  uSkyCloudColour: { value: new THREE.Color(0xf2f5f8) },
  uSkyCheapScale: { value: 0.55 },
  /** Strength, elements per kilometre, deck height in kilometres, drift. */
  uCloudShadow: { value: new THREE.Vector4(0, 0.7, 1.6, 0.006) },
  uMoonDirection: { value: new THREE.Vector3(0, 1, 0) },
  uMoonColor: { value: new THREE.Color(0xdce8ff) },
  uMoonIntensity: { value: 0 },
  uMoonSize: { value: Math.cos((1.9 * Math.PI) / 180) },
  uMoonPhase: { value: 0.5 },
  uStars: { value: 0 },
  /** Belt of Venus, 22 degree halo, 42 degree bow, and the shadow's top as sin(elevation). */
  uPhenomena: { value: new THREE.Vector4(0, 0, 0, 0) },
  /** Celestial pole axis in xyz, the night's turn in w. */
  uStarSpin: { value: new THREE.Vector4(0, 1, 0, 0) },
  uSunDirection: { value: new THREE.Vector3(0, 1, 0) },
  uSunColor: { value: new THREE.Color() },
  uSunSize: { value: 0.9993 },
  uSunGlow: { value: 260 },
  uSunIntensity: { value: 1 },
  /** Broad scattered warmth on the sun's side. See `skyGradient`. */
  uWarmth: { value: 0.3 },
};

/**
 * Two colours of air: what the dome shows, and what the fog fades to. The same
 * function with different curves — both run horizon → zenith upward and horizon →
 * ground downward, both warm on the sun's side, and both are exactly the horizon
 * colour at direction.y = 0, which is the one line the vista band cannot afford a
 * seam on.
 *
 * uCurve is the dome's number and it is tiny, because that is what a sky looks
 * like: the blue takes over within a few degrees. uAirCurve is the fog's own and
 * it is large, so the air is horizon coloured across every elevation anything hazy
 * occupies — flat, so nothing gets a ramp painted on it. Handing the dome's curve
 * to the fog paints a steep blue ramp down a distant hill and the identical ramp
 * on the sky right behind it, and the hill becomes a window onto the gradient.
 */
export const SKY_GRADIENT_GLSL = /* glsl */ `
  #ifndef SKY_GRADIENT_INCLUDED
  #define SKY_GRADIENT_INCLUDED

  uniform vec3 uHorizon;
  uniform vec3 uZenith;
  uniform vec3 uGround;
  uniform float uCurve;
  uniform float uUnderCurve;
  uniform float uAirCurve;
  uniform vec3 uSunDirection;
  uniform vec3 uSunColor;
  uniform float uSunIntensity;
  uniform float uWarmth;

  /** Horizon to zenith going up, horizon to ground going down, warm toward the sun. */
  vec3 skyBand(vec3 direction, float up, float down) {
    float height = direction.y;
    vec3 above = mix(uHorizon, uZenith, pow(clamp(height, 0.0, 1.0), max(up, 0.01)));
    vec3 below = mix(uHorizon, uGround, pow(clamp(-height, 0.0, 1.0), max(down, 0.01)));
    vec3 colour = height > 0.0 ? above : below;

    // Scattered light on the sun's side of the world - broad, and nothing to do
    // with the disc's own halo, which is a couple of degrees wide. Applied to
    // both bands, so the dome and the air warm together and distant land does
    // not part company with the sky behind it every time you look west.
    float toSun = max(dot(direction, normalize(uSunDirection)), 0.0);
    return mix(colour, uSunColor, uWarmth * uSunIntensity * pow(toSun, 5.0));
  }

  /** What the dome draws. */
  vec3 skyGradient(vec3 direction) {
    return skyBand(direction, uCurve, uUnderCurve);
  }

  /** What the air between you and something far away is coloured. */
  vec3 skyAir(vec3 direction) {
    return skyBand(direction, uAirCurve, uAirCurve);
  }

  #endif
`;

/**
 * What colour the sky is in a given direction — the dome's own shading, as a
 * function anything can call: the gradient, then the disc and halo, then the cloud
 * layer. It has a name because screen-space reflection can only reflect what is on
 * screen, and here the miss case is not an approximation — the reflected direction
 * is a direction, and this returns exactly the sky that is in it, sun disc
 * included, for the price of one call.
 *
 * Include `NOISE_GLSL` before this, which the clouds need. Left to the caller, so a
 * shader that already has the noise does not declare `fbm` twice.
 *
 * (No backticks anywhere below: this is a template literal, and one inside a
 * comment would end it mid-GLSL.)
 */
export const SKY_GLSL = /* glsl */ `
  ${SKY_GRADIENT_GLSL}
  ${CLOUDS_GLSL}

  uniform float uSunSize;
  uniform float uSunGlow;
  uniform vec3 uMoonDirection;
  uniform vec3 uMoonColor;
  uniform float uMoonIntensity;
  uniform float uMoonSize;
  uniform float uMoonPhase;
  uniform float uStars;
  uniform vec4 uStarSpin;
  uniform vec4 uPhenomena;

  /**
   * Twilight, opposite the sun. The Earth's own shadow stands on the antisolar
   * horizon as a blue-grey wedge and the antitwilight arch sits pink on top of
   * it, and the two rise together as the sun goes down — which is why the top
   * of the wedge is handed in rather than derived here.
   */
  vec3 skyTwilight(vec3 direction, vec3 colour) {
    float belt = uPhenomena.x;
    if (belt <= 0.001 || direction.y < -0.03 || direction.y > 0.45) return colour;
    vec2 look = normalize(direction.xz + vec2(1e-5, 0.0));
    vec2 sunward = normalize(uSunDirection.xz + vec2(1e-5, 0.0));
    float away = pow(clamp(-dot(look, sunward), 0.0, 1.0), 1.6);
    if (away <= 0.001) return colour;

    float top = uPhenomena.w;
    float wedge = (1.0 - smoothstep(top - 0.03, top + 0.025, direction.y))
      * smoothstep(-0.03, 0.015, direction.y);
    colour = mix(colour, vec3(0.30, 0.34, 0.47), wedge * away * belt * 0.8);

    float arch = smoothstep(top - 0.015, top + 0.05, direction.y)
      * (1.0 - smoothstep(top + 0.06, top + 0.22, direction.y));
    return mix(colour, vec3(0.93, 0.68, 0.70), arch * away * belt * 0.7);
  }

  /**
   * The 22 degree halo, and the 42 degree bow opposite it. Both are ice or
   * water in the air doing one specific thing, so both are gated on the sky
   * actually holding it — a halo out of a clear sky is worse than none.
   */
  vec3 skyOptics(vec3 direction, vec3 colour) {
    vec3 toward = normalize(uSunDirection);
    float halo = uPhenomena.y;
    if (halo > 0.001) {
      float a = dot(direction, toward);
      // cos 22 degrees is 0.92718. Red inside, blue outside, faint everywhere.
      float ring = smoothstep(0.9195, 0.9272, a) * (1.0 - smoothstep(0.9272, 0.9365, a));
      vec3 tint = mix(vec3(1.10, 0.94, 0.82), vec3(0.90, 0.96, 1.10),
        smoothstep(0.9235, 0.9315, a));
      colour = mix(colour, colour * tint + vec3(0.05), ring * halo);
    }

    float bow = uPhenomena.z;
    if (bow > 0.001 && direction.y > 0.0) {
      // Measured from the antisolar point: 42 degrees for red, 40.5 for violet,
      // whose cosines are 0.743145 and 0.760406.
      float a = dot(direction, -toward);
      float t = (a - 0.743145) / 0.017261;
      if (t > 0.0 && t < 1.0) {
        vec3 arc = 0.55 + 0.45 * cos(6.2831853 * (t * 0.85 + vec3(0.0, 0.33, 0.67)));
        colour += arc * (sin(t * 3.14159265) * bow * 0.16 * smoothstep(0.0, 0.12, direction.y));
      }
    }
    return colour;
  }

  /**
   * The sky, with the sun's own brightness under the caller's control. A
   * flat-shaded facet has one normal and so one reflected direction, so when that
   * direction lands on the sun the entire triangle comes back as uSunColor — a
   * hard white polygon stuck to the side of an object. The finish stage's
   * roughness blur is no help, since it only starts mixing above roughness 0.15
   * and the surfaces this bites hardest are the smooth ones. So a reflector may
   * ask for a fraction of the sun and get the rest of the sky unchanged.
   *
   * This is the path everything that is not the dome takes: one cloud layer, no
   * stars and no moon. It runs on every lit fragment through finishEnv and on
   * every reflection miss in the water, which the dome most certainly does not.
   */
  vec3 skyColourWithSun(vec3 direction, float sunScale) {
    float sunPower = uSunIntensity * sunScale;
    vec3 colour = skyGradient(direction);

    // The sun, drawn before the clouds so they pass in front of it: a disc plus a
    // halo from the same dot product, because a real sun is surrounded by scattered
    // light for many times its own diameter, and that halo is most of what makes
    // the sky look lit by it. uSunSize is a cosine rather than an angle, so no
    // inverse cosine runs per pixel.
    if (sunPower > 0.0) {
      float toSun = dot(direction, normalize(uSunDirection));
      float halo = pow(max(toSun, 0.0), uSunGlow);
      colour = mix(colour, uSunColor, clamp(halo * 0.6, 0.0, 1.0) * sunPower);
      // A soft edge on the disc. Hard-edged, it aliases badly against a
      // pipeline that renders at a third of display resolution.
      float disc = smoothstep(uSunSize - 0.0004, uSunSize + 0.0004, toSun);
      colour = mix(colour, uSunColor, disc * sunPower);
    }

    return skyCloudsCheap(direction, colour);
  }

  /** Kept for callers that want the sky in a direction and no say over the disc. */
  vec3 skyColour(vec3 direction) {
    return skyColourWithSun(direction, 1.0);
  }

  /**
   * Stars, hashed on a three-dimensional lattice the view direction sweeps a
   * shell of. A flat projection of the sphere pinches somewhere — at the zenith
   * or at the pole — and the pinch is visible as a smear of stars in one part of
   * the sky; a 3-D lattice has no pole to pinch at.
   *
   * Turned about the celestial pole, so the field wheels the way it does at this
   * latitude rather than spinning flat about the zenith.
   */
  float starField(vec3 direction) {
    if (uStars <= 0.001 || direction.y <= 0.02) return 0.0;
    float a = uStarSpin.w;
    vec3 axis = uStarSpin.xyz;
    vec3 spun = direction * cos(a) + cross(axis, direction) * sin(a)
      + axis * dot(axis, direction) * (1.0 - cos(a));

    vec3 p = spun * 62.0;
    vec3 cell = floor(p);
    vec2 key = cell.xy + cell.z * 37.31;
    float pick = hash(key + 7.71);
    if (pick > 0.32) return 0.0;

    vec3 jitter = vec3(hash(key + 1.37), hash(key + 4.19), hash(key + 9.53)) - 0.5;
    // Size and brightness are separate draws off one magnitude, and size grows
    // far slower than brightness: a sky whose bright stars are also its big
    // ones reads as dots on paper rather than as depth.
    float magnitude = hash(key + 3.11);
    float size = 0.09 + 0.12 * magnitude * magnitude;
    float bright = 0.4 + 0.6 * magnitude;
    float d = length(fract(p) - 0.5 - jitter * 0.7);
    // Scintillation: the near-horizon ones twinkle hardest, which is what a
    // longer path through the air does to them.
    float twinkle = 0.72 + 0.28 * sin(uCloudTime * (1.7 + pick * 40.0) + pick * 61.0);
    twinkle = mix(1.0, twinkle, 1.0 - smoothstep(0.15, 0.7, direction.y));
    return smoothstep(size, 0.0, d) * bright * twinkle * uStars;
  }

  /**
   * The moon.
   *
   * Everything is measured in units of the moon's own angular radius, never by
   * thresholding the cosine: at a radius of a degree or two the whole disc
   * spans six ten-thousandths of the cosine's range, so an edge written that
   * way cannot resolve at all and comes out as a fuzzy ball.
   *
   * A sphere lit from one side and seen from another shows the intersection of
   * a circle and an ellipse whose major axis is the circle's own diameter —
   * convex against the circle is gibbous, concave is a crescent. That falls out
   * of testing the surface normal against the sun, because on a sphere the
   * normal is the point: with u toward the sun, v across it and w out of the
   * disc toward the eye, the visible point is (u, v, -w) and the sun sits at
   * (sin E, 0, cos E) for elongation E. Lit is u sin E - w cos E > 0, which
   * rearranges to u^2 / cos^2(E) + v^2 = 1 — the ellipse, exactly.
   */
  vec3 skyMoon(vec3 direction, vec3 colour) {
    if (uMoonIntensity <= 0.001) return colour;
    vec3 toward = normalize(uMoonDirection);
    float toMoon = dot(direction, toward);
    if (toMoon <= 0.0) return colour;

    // How much of the disc is lit. 0 at new, 1 at full.
    float lit = 0.5 - 0.5 * cos(uMoonPhase * 6.2831853);

    float radius = sqrt(max(1.0 - uMoonSize * uMoonSize, 1e-6));
    vec3 offset = direction - toward * toMoon;
    // 0 at the centre, 1 at the limb.
    float r = length(offset) / radius;

    // The glow, scaled by the square of what is lit: a crescent gives off
    // almost nothing, and a full round halo round a crescent is the tell that
    // gives the whole thing away.
    float glow = exp(-r * 0.55) * lit * lit;
    colour = mix(colour, uMoonColor, clamp(glow * 0.22, 0.0, 1.0) * uMoonIntensity);
    if (r > 1.04) return colour;

    // Toward the sun, and across it. When the sun is directly behind or in
    // front of the moon there is no limb to speak of and any axis will do.
    vec3 sunward = normalize(uSunDirection);
    vec3 across = sunward - toward * dot(sunward, toward);
    float span = length(across);
    across = span > 1e-4
      ? across / span
      : normalize(cross(toward, vec3(0.0, 1.0, 0.0)) + vec3(1e-5, 0.0, 0.0));
    vec3 side = cross(toward, across);

    float u = dot(offset, across) / radius;
    float v = dot(offset, side) / radius;
    float w = sqrt(max(1.0 - r * r, 0.0));

    float elongation = uMoonPhase * 6.2831853;
    float face = smoothstep(-0.05, 0.05, u * sin(elongation) - w * cos(elongation));

    // The maria. Two octaves over the disc, and it is worth the eight hashes:
    // a plain white circle reads as a light, and any marking at all reads as
    // the moon.
    float mare = valueNoise(vec2(u, v) * 2.1 + 31.7) * 0.6
      + valueNoise(vec2(u, v) * 5.3 - 12.4) * 0.4;
    vec3 rock = uMoonColor * (0.88 + 0.12 * smoothstep(0.35, 0.75, mare));

    // No limb darkening. The moon is retroreflective, which is why a full one
    // reads as a flat disc cut out of the sky rather than as a lit ball.
    float disc = 1.0 - smoothstep(0.9, 1.02, r);
    // The dark limb is not black: earthshine puts a little back into it, and
    // hardest when the crescent is thinnest, which is when the Earth hanging
    // over it is nearly full.
    vec3 dark = colour * 0.5 + uMoonColor * (0.06 + 0.14 * (1.0 - lit));
    return mix(colour, mix(dark, rock, face), disc * uMoonIntensity);
  }

  /**
   * What the dome draws, and only the dome. Stars first, then the moon, then the
   * sun and its halo, then the three decks over all of it.
   */
  vec3 skyDome(vec3 direction) {
    vec3 colour = skyTwilight(direction, skyGradient(direction));
    colour += vec3(1.55, 1.62, 1.85) * starField(direction);
    colour = skyMoon(direction, colour);
    colour = skyOptics(direction, colour);

    if (uSunIntensity > 0.0) {
      float toSun = dot(direction, normalize(uSunDirection));
      float halo = pow(max(toSun, 0.0), uSunGlow);
      colour = mix(colour, uSunColor, clamp(halo * 0.6, 0.0, 1.0) * uSunIntensity);
      float disc = smoothstep(uSunSize - 0.0004, uSunSize + 0.0004, toSun);
      colour = mix(colour, uSunColor, disc * uSunIntensity);
    }

    return skyDecks(direction, colour);
  }
`;

const SkyShader = {
  vertexShader: /* glsl */ `
    varying vec3 vDirection;

    void main() {
      // Left unnormalized and normalized per-fragment instead: interpolating
      // between normalized vertex directions bends toward the chord and would
      // facet the gradient at low segment counts.
      vDirection = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,

  fragmentShader: /* glsl */ `
    varying vec3 vDirection;

    // Lifted into engine/noise when the fog volumes wanted the same functions.
    // Verbatim, so the clouds are the clouds they were tuned to be. (No
    // backticks in this comment either, for the reason given above.)
    ${NOISE_GLSL}
    ${SKY_GLSL}

    void main() {
      gl_FragColor = vec4(skyDome(normalize(vDirection)), 1.0);
    }
  `,
};

export const DEFAULT_SKY: SkySettings = {
  curve: 0.75,
  // Well above 1, so the horizon colour holds a long way down. Everything in
  // that range is covered by land from an eye on the ground, and from an eye
  // above it the land's own haze is the horizon colour too — see `underCurve`.
  underCurve: 1.8,
  // Above `curve`, and that is the whole rule — see `airCurve`. Enough of a gap
  // that a hill keeps its own value against the sky, close enough that the two
  // meet at the horizon.
  airCurve: 1.4,

  cloudOpacity: 0.95,
  cloudDrift: 1,

  sun: true,
  // Several times life size. At the real 0.27° the sun is under two pixels once
  // the pixelation pass has had it, which reads as a stuck dead pixel rather
  // than as the sun.
  sunSize: 1.1,
  sunGlow: 240,

};

/** One slot of the sky, filled by the climate. Null is clear at that level. */
export interface DeckState {
  genus: GenusName | null;
  /** 0..1. How much of this level's sky the genus takes. */
  amount: number;
  /** What it is lit and shaded, already carrying its own twilight lead. */
  lit: THREE.Color;
  shade: THREE.Color;
}

export function createDecks(): DeckState[] {
  return DECK_LEVELS.map(() => ({
    genus: null,
    amount: 0,
    lit: new THREE.Color(0xffffff),
    shade: new THREE.Color(0xc0c4cc),
  }));
}

export class Sky {
  readonly mesh: THREE.Mesh;
  private readonly material: THREE.ShaderMaterial;
  /** Master dials off `SkySettings`, applied to every deck. */
  private opacity = 1;
  private speed = 1;

  constructor() {
    this.material = new THREE.ShaderMaterial({
      name: 'Sky',
      // The shared set, not a clone — see `skyUniforms`. Water reads these to
      // resolve the miss case of its reflection march, and two copies would be
      // two skies.
      uniforms: skyUniforms,
      vertexShader: SkyShader.vertexShader,
      fragmentShader: SkyShader.fragmentShader,
      // Seen from inside, and never occluding anything: it writes no depth and
      // is drawn first, so it is a backdrop rather than a very large object.
      side: THREE.BackSide,
      depthWrite: false,
      depthTest: false,
      // Fogging the sky would pull it toward the fog colour, which is the
      // colour taken *from* the sky. The horizon band does that job honestly.
      fog: false,
    });

    this.mesh = new THREE.Mesh(new THREE.SphereGeometry(RADIUS, 32, 16), this.material);
    this.mesh.name = 'Sky';
    this.mesh.renderOrder = -1;
    // Nothing about the sky changes with where it is, and recentring it every
    // frame would otherwise cost a needless bounds recalculation.
    this.mesh.frustumCulled = false;
  }

  /**
   * The authored dome: the curves, the disc's shape and the master cloud dials.
   * The *colours* are the atmosphere's — see `setAir` — because they depend on
   * where the sun is and these do not.
   */
  apply(settings: SkySettings): void {
    const u = this.material.uniforms;
    u.uCurve.value = settings.curve;
    u.uUnderCurve.value = settings.underCurve;
    u.uAirCurve.value = settings.airCurve;
    this.opacity = settings.cloudOpacity;
    this.speed = settings.cloudDrift;
    u.uSunIntensity.value = settings.sun ? 1 : 0;
    // Degrees in, cosine out. The shader compares against a dot product, so
    // doing the conversion here keeps an `acos` out of the per-pixel path and
    // keeps the setting in units a person can reason about.
    u.uSunSize.value = Math.cos((settings.sunSize * Math.PI) / 180);
    u.uSunGlow.value = settings.sunGlow;
  }

  /**
   * Points the drawn sun at wherever the scene's sun light is. Taken from the light
   * rather than authored separately, which is the whole reason the disc is worth
   * having: shadows fall away from a direction, and a sun painted somewhere else in
   * the sky makes every shadow in the world look wrong at once.
   */
  aimAt(direction: THREE.Vector3): void {
    (this.material.uniforms.uSunDirection.value as THREE.Vector3)
      .copy(direction)
      .normalize();
  }

  /** The colours the atmosphere decided this frame, over the authored ones. */
  setAir(horizon: THREE.Color, zenith: THREE.Color, ground: THREE.Color, sun: THREE.Color, warmth: number): void {
    const u = this.material.uniforms;
    (u.uHorizon.value as THREE.Color).copy(horizon);
    (u.uZenith.value as THREE.Color).copy(zenith);
    (u.uGround.value as THREE.Color).copy(ground);
    (u.uSunColor.value as THREE.Color).copy(sun);
    u.uWarmth.value = warmth;
  }

  setNight(stars: number, moon: number, phase: number, direction: THREE.Vector3, latitude: number, elapsed: number): void {
    const u = this.material.uniforms;
    u.uStars.value = stars;
    u.uMoonIntensity.value = moon;
    u.uMoonPhase.value = phase;
    (u.uMoonDirection.value as THREE.Vector3).copy(direction).normalize();
    // The celestial pole: due north, at the latitude's own elevation. +Z is
    // south here, so north is −Z.
    const tilt = (latitude * Math.PI) / 180;
    (u.uStarSpin.value as THREE.Vector4).set(0, Math.sin(tilt), -Math.cos(tilt), elapsed * 0.0007);
  }

  /**
   * The three decks, high to low. Element size is authored in kilometres and
   * turned into elements per kilometre here, so the apparent size a viewer
   * judges genus by is the deck's height doing the work rather than a number
   * tuned by eye.
   */
  /**
   * Belt of Venus, halo and bow, each 0..1, with the Earth's shadow's top as
   * sin(elevation). All four are worked out on the CPU because all four are one
   * number a frame, and none of them is worth an inverse trig per pixel.
   */
  setPhenomena(belt: number, halo: number, bow: number, shadowTop: number): void {
    (this.material.uniforms.uPhenomena.value as THREE.Vector4).set(belt, halo, bow, shadowTop);
  }

  setDecks(
    decks: readonly DeckState[],
    windBearing: number,
    windStrength: number,
    elapsed: number,
  ): void {
    const u = this.material.uniforms;
    const shape = u.uDeckShape.value as THREE.Vector4[];
    const form = u.uDeckForm.value as THREE.Vector4[];
    const light = u.uDeckLight.value as THREE.Vector4[];
    const wind = u.uDeckWind.value as THREE.Vector2[];
    const lit = u.uDeckLit.value as THREE.Color[];
    const shade = u.uDeckShade.value as THREE.Color[];

    let cover = 0;
    let heaviest = 0;
    let scale = 0.55;
    // The low deck overwrites this; without one there is nothing casting a
    // shadow anyway, and the cheap path still wants a direction to drift in.
    {
      const air = windAtHeight(windStrength, windBearing, 1.5);
      (u.uCloudWind.value as THREE.Vector2)
        .set(Math.cos(air.bearing), Math.sin(air.bearing))
        .multiplyScalar(air.speed * this.speed);
    }

    for (let i = 0; i < 3; i++) {
      const deck = decks[i];
      const genus = deck?.genus ? GENERA[deck.genus] : null;
      const amount = genus ? deck.amount : 0;
      if (!genus || amount <= 0) {
        light[i].set(0, 0, 0, 0);
        continue;
      }
      shape[i].set(genus.cover, genus.erosion, 1 / genus.element, genus.opacity * this.opacity);
      form[i].set(genus.height, FORM[genus.form], genus.base, genus.stretch);
      light[i].set(genus.shade, 0, amount, genus.ripple);
      // No deck has a speed of its own. It goes at the speed of the air it is
      // in, and the air at nine kilometres is not the air at head height.
      const air = windAtHeight(windStrength, windBearing, genus.height);
      wind[i].set(Math.cos(air.bearing), Math.sin(air.bearing)).multiplyScalar(air.speed * this.speed);
      if (genus.level === 'low') (u.uCloudWind.value as THREE.Vector2).copy(wind[i]);
      lit[i].copy(deck.lit);
      shade[i].copy(deck.shade);

      // How much sky this deck actually takes: how much it covers at full,
      // scaled by how much of it there is and how opaque it is. Union rather
      // than sum — two decks over the same sky do not cover it twice.
      const taken = amount * genus.cover * genus.opacity;
      cover = cover + taken - cover * taken;
      if (taken > heaviest) {
        heaviest = taken;
        scale = 1 / (genus.element * 3.5);
        (u.uSkyCloudColour.value as THREE.Color).copy(deck.lit).lerp(deck.shade, genus.shade * 0.4);
      }
    }

    u.uSkyCover.value = cover;
    u.uSkyCheapScale.value = scale;
    u.uCloudTime.value = elapsed;
  }

  /** How hard a low deck darkens the ground under it. Zero costs no noise at all. */
  setCloudShadow(strength: number, decks: readonly DeckState[]): void {
    const low = decks[2];
    const genus = low?.genus ? GENERA[low.genus] : null;
    const value = genus ? strength * low.amount * genus.opacity : 0;
    (this.material.uniforms.uCloudShadow.value as THREE.Vector4).set(
      value,
      genus ? 1 / (genus.element * 2.2) : 0.7,
      genus ? genus.height : 1.6,
      0,
    );
  }

  /** Recentres the dome on the camera, sizes it to the far plane, and drifts. */
  follow(camera: THREE.PerspectiveCamera, elapsed: number): void {
    this.mesh.position.setFromMatrixPosition(camera.matrixWorld);
    // The radius divides out of the shading — the dome is a gradient per view
    // direction — so this is only about not being clipped. Pulling the view
    // distance in moves the far plane, and the sky has to come with it.
    this.mesh.scale.setScalar((camera.far * SKY_FRACTION) / RADIUS);
    this.material.uniforms.uTime.value = elapsed;
  }

  dispose(): void {
    this.mesh.geometry.dispose();
    this.material.dispose();
  }
}
