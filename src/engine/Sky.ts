import * as THREE from 'three';

/**
 * A procedural sky: vertical gradient plus a drifting cloud layer.
 *
 * No cubemap and no texture — there are none anywhere in this project. The
 * gradient is three bands (ground, horizon, zenith) and the clouds are fractal
 * value noise projected onto a flat layer overhead.
 *
 * The horizon colour matters more than it looks. Distant geometry fades to the
 * *fog* colour, so if the fog and the horizon disagree, everything far away
 * dissolves into a band of the wrong colour hanging in front of the sky. They
 * are linked by default for that reason.
 *
 * Drawn as a sphere recentred on the camera each frame rather than a fixed one
 * large enough not to notice. A fixed sphere has parallax — walk toward the
 * horizon and it slides — which is subtle enough to be felt as wrongness
 * without being seen as an error.
 */

export interface SkySettings {
  horizon: string;
  zenith: string;
  ground: string;
  /**
   * How fast the horizon haze gives way to open sky. Below 1 the blue takes
   * over quickly and the haze stays a thin band, which is what a real sky
   * does; at 1 the gradient is linear and the whole dome looks washed out.
   */
  curve: number;

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
  /** Angular radius of the disc, in degrees. The real one is about 0.27. */
  sunSize: number;
  /** How far the halo reaches. Larger is *tighter* — it is an exponent. */
  sunGlow: number;
}

/** Comfortably inside the camera's far plane, and far outside the world. */
const RADIUS = 400;

const SkyShader = {
  uniforms: {
    uHorizon: { value: new THREE.Color() },
    uZenith: { value: new THREE.Color() },
    uGround: { value: new THREE.Color() },
    uCurve: { value: 1 },
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
  },

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
    uniform vec3 uHorizon;
    uniform vec3 uZenith;
    uniform vec3 uGround;
    uniform float uCurve;
    uniform vec3 uCloudColor;
    uniform float uCloudCover;
    uniform float uCloudSoftness;
    uniform float uCloudScale;
    uniform float uCloudOpacity;
    uniform float uCloudDrift;
    uniform float uTime;
    uniform vec3 uSunDirection;
    uniform vec3 uSunColor;
    uniform float uSunSize;
    uniform float uSunGlow;
    uniform float uSunIntensity;

    varying vec3 vDirection;

    float hash(vec2 p) {
      p = fract(p * vec2(123.34, 456.21));
      p += dot(p, p + 45.32);
      return fract(p.x * p.y);
    }

    float valueNoise(vec2 p) {
      vec2 cell = floor(p);
      vec2 f = fract(p);
      // Smoothstep on the interpolant: linear blending between cells leaves
      // visible creases along every cell boundary.
      vec2 blend = f * f * (3.0 - 2.0 * f);
      return mix(
        mix(hash(cell), hash(cell + vec2(1.0, 0.0)), blend.x),
        mix(hash(cell + vec2(0.0, 1.0)), hash(cell + vec2(1.0, 1.0)), blend.x),
        blend.y
      );
    }

    // Five octaves, each half the amplitude and twice the frequency. The big
    // ones are the cloud masses, the small ones are their ragged edges.
    float fbm(vec2 p) {
      float sum = 0.0;
      float amplitude = 0.5;
      for (int i = 0; i < 5; i++) {
        sum += amplitude * valueNoise(p);
        p *= 2.0;
        amplitude *= 0.5;
      }
      return sum;
    }

    void main() {
      vec3 direction = normalize(vDirection);
      float height = direction.y;
      float curve = max(uCurve, 0.01);

      vec3 above = mix(uHorizon, uZenith, pow(clamp(height, 0.0, 1.0), curve));
      vec3 below = mix(uHorizon, uGround, pow(clamp(-height, 0.0, 1.0), curve));
      vec3 colour = height > 0.0 ? above : below;

      // The sun, drawn before the clouds so they pass in front of it.
      //
      // A disc plus a halo, both from the same dot product. The disc alone is a
      // sticker: a real sun is surrounded by scattered light for many times its
      // own diameter, and that halo is most of what makes the sky look lit
      // *by* it rather than merely containing it.
      //
      // uSunSize is a cosine rather than an angle, so the comparison is against
      // the dot product directly and no inverse cosine runs per pixel. (No
      // backticks in here: this whole shader is a template literal, and one
      // inside a comment ends the string several hundred lines early.)
      if (uSunIntensity > 0.0) {
        float toSun = dot(direction, normalize(uSunDirection));
        float halo = pow(max(toSun, 0.0), uSunGlow);
        colour = mix(colour, uSunColor, clamp(halo * 0.6, 0.0, 1.0) * uSunIntensity);
        // A soft edge on the disc. Hard-edged, it aliases badly against a
        // pipeline that renders at a third of display resolution.
        float disc = smoothstep(uSunSize - 0.0004, uSunSize + 0.0004, toSun);
        colour = mix(colour, uSunColor, disc * uSunIntensity);
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

      gl_FragColor = vec4(colour, 1.0);
    }
  `,
};

export const DEFAULT_SKY: SkySettings = {
  horizon: '#bcd4e6',
  zenith: '#3f7fbf',
  ground: '#5d6469',
  curve: 0.35,

  cloudColor: '#f2f5f8',
  cloudCover: 0.5,
  cloudSoftness: 0.22,
  cloudScale: 1.1,
  cloudOpacity: 0.95,
  cloudDrift: 0.012,

  sun: true,
  sunColor: '#fff6e0',
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
      uniforms: THREE.UniformsUtils.clone(SkyShader.uniforms),
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
    u.uCloudCover.value = settings.cloudCover;
    u.uCloudSoftness.value = settings.cloudSoftness;
    u.uCloudScale.value = settings.cloudScale;
    u.uCloudOpacity.value = settings.cloudOpacity;
    u.uCloudDrift.value = settings.cloudDrift;
    (u.uSunColor.value as THREE.Color).set(settings.sunColor);
    u.uSunIntensity.value = settings.sun ? 1 : 0;
    // Degrees in, cosine out. The shader compares against a dot product, so
    // doing the conversion here keeps an `acos` out of the per-pixel path and
    // keeps the setting in units a person can reason about.
    u.uSunSize.value = Math.cos((settings.sunSize * Math.PI) / 180);
    u.uSunGlow.value = settings.sunGlow;
  }

  /**
   * Points the drawn sun at wherever the scene's sun light is.
   *
   * Taken from the light rather than authored separately, and this is the whole
   * reason the disc is worth having: shadows fall away from a direction, and a
   * sun painted somewhere else in the sky makes every shadow in the world look
   * wrong at once. One source of truth, and the light is it.
   */
  aimAt(direction: THREE.Vector3): void {
    (this.material.uniforms.uSunDirection.value as THREE.Vector3)
      .copy(direction)
      .normalize();
  }

  /** Recentres the dome on the camera and advances the drift. */
  follow(camera: THREE.Camera, elapsed: number): void {
    this.mesh.position.setFromMatrixPosition(camera.matrixWorld);
    this.material.uniforms.uTime.value = elapsed;
  }

  dispose(): void {
    this.mesh.geometry.dispose();
    this.material.dispose();
  }
}
