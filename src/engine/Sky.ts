import * as THREE from 'three';
import { NOISE_GLSL } from './noise';

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

export interface SkySettings {
  horizon: string;
  zenith: string;
  ground: string;
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

  cloudColor: string;
  /** Threshold on the noise. Higher means less sky covered. */
  cloudCover: number;
  /** Edge hardness. Small is crisp and cut-out; large is soft and hazy. */
  cloudSoftness: number;
  /** Noise frequency — how large an individual cloud is. */
  cloudScale: number;
  /** How opaque the thickest parts get. */
  cloudOpacity: number;
  /** Drift in units per second. 0 freezes them. */
  cloudDrift: number;

  /** Whether a sun disc is drawn at all. */
  sun: boolean;
  sunColor: string;
  /**
   * How much the sky warms on the sun's side of the world, 0..1. Broad and low, and
   * nothing to do with the disc's halo. Here rather than with the fog because the
   * fog fades to this gradient: warming one and not the other puts distant land at
   * odds with the sky behind it.
   */
  warmth: number;
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
  uCloudColor: { value: new THREE.Color() },
  uCloudCover: { value: 0.5 },
  uCloudSoftness: { value: 0.2 },
  uCloudScale: { value: 1.2 },
  uCloudOpacity: { value: 1 },
  uCloudDrift: { value: 0.01 },
  uTime: { value: 0 },
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

  uniform vec3 uCloudColor;
  uniform float uCloudCover;
  uniform float uCloudSoftness;
  uniform float uCloudScale;
  uniform float uCloudOpacity;
  uniform float uCloudDrift;
  uniform float uTime;
  uniform float uSunSize;
  uniform float uSunGlow;

  /**
   * The sky, with the sun's own brightness under the caller's control. A
   * flat-shaded facet has one normal and so one reflected direction, so when that
   * direction lands on the sun the entire triangle comes back as uSunColor — a
   * hard white polygon stuck to the side of an object. The finish stage's
   * roughness blur is no help, since it only starts mixing above roughness 0.15
   * and the surfaces this bites hardest are the smooth ones. So a reflector may
   * ask for a fraction of the sun and get the rest of the sky unchanged.
   */
  vec3 skyColourWithSun(vec3 direction, float sunScale) {
    float height = direction.y;
    float sunPower = uSunIntensity * sunScale;

    // The band the fog also fades to, so the two cannot drift apart.
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

    if (height > 0.0) {
      // Project the view ray onto a flat layer overhead. Rays close to the
      // horizon travel much further across it before they arrive, so the
      // pattern stretches and crowds toward the horizon on its own — which
      // is the whole reason clouds read as a ceiling rather than a dome.
      vec2 plane = direction.xz / max(height, 0.02);
      vec2 drift = vec2(uTime * uCloudDrift, uTime * uCloudDrift * 0.6);

      float density = fbm(plane * uCloudScale + drift);
      float amount = smoothstep(uCloudCover, uCloudCover + uCloudSoftness, density);
      // Faded out at the horizon, where the projection stretches to
      // infinity and the noise turns to mush.
      amount *= smoothstep(0.0, 0.18, height) * uCloudOpacity;

      colour = mix(colour, uCloudColor, amount);
    }

    return colour;
  }

  /** The sky as the dome draws it: skyColourWithSun at a sunScale of 1.0, which multiplies uSunIntensity by one and is bit-identical. */
  vec3 skyColour(vec3 direction) {
    return skyColourWithSun(direction, 1.0);
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
      gl_FragColor = vec4(skyColour(normalize(vDirection)), 1.0);
    }
  `,
};

export const DEFAULT_SKY: SkySettings = {
  // The gradient carries the 1.2 the edge pass used to hand the sky for free.
  // See ANTIALIASING.md. Cloud and sun keep their authored tints: both already
  // clipped to white under that multiply, so scaling them would bake a
  // rendering artefact into the art direction.
  horizon: '#cce6f9',
  zenith: '#458acf',
  ground: '#656d72',
  curve: 0.75,
  // Well above 1, so the horizon colour holds a long way down. Everything in
  // that range is covered by land from an eye on the ground, and from an eye
  // above it the land's own haze is the horizon colour too — see `underCurve`.
  underCurve: 1.8,
  // Above `curve`, and that is the whole rule — see `airCurve`. Enough of a gap
  // that a hill keeps its own value against the sky, close enough that the two
  // meet at the horizon.
  airCurve: 1.4,

  cloudColor: '#f2f5f8',
  cloudCover: 0.5,
  cloudSoftness: 0.22,
  cloudScale: 1.1,
  cloudOpacity: 0.95,
  cloudDrift: 0.012,

  sun: true,
  sunColor: '#fff6e0',
  // Gentle. This is scattered light on one side of the world, not a second sun.
  warmth: 0.3,
  // Several times life size. At the real 0.27° the sun is under two pixels once
  // the pixelation pass has had it, which reads as a stuck dead pixel rather
  // than as the sun.
  sunSize: 1.1,
  sunGlow: 240,

};

export class Sky {
  readonly mesh: THREE.Mesh;
  private readonly material: THREE.ShaderMaterial;

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

  apply(settings: SkySettings): void {
    const u = this.material.uniforms;
    (u.uHorizon.value as THREE.Color).set(settings.horizon);
    (u.uZenith.value as THREE.Color).set(settings.zenith);
    (u.uGround.value as THREE.Color).set(settings.ground);
    (u.uCloudColor.value as THREE.Color).set(settings.cloudColor);
    u.uCurve.value = settings.curve;
    u.uUnderCurve.value = settings.underCurve;
    u.uAirCurve.value = settings.airCurve;
    u.uCloudCover.value = settings.cloudCover;
    u.uCloudSoftness.value = settings.cloudSoftness;
    u.uCloudScale.value = settings.cloudScale;
    u.uCloudOpacity.value = settings.cloudOpacity;
    u.uCloudDrift.value = settings.cloudDrift;
    (u.uSunColor.value as THREE.Color).set(settings.sunColor);
    u.uSunIntensity.value = settings.sun ? 1 : 0;
    u.uWarmth.value = settings.warmth;
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
