import * as THREE from 'three';
import { WATER_LAYER } from '../layers';
import { NOISE_GLSL } from '../engine/noise';
import { SKY_GLSL, skyUniforms } from '../engine/Sky';
import { AERIAL_AIR_GLSL, fogUniforms } from '../engine/fog';
import { REFLECT_GLSL } from '../engine/reflect';
import { windUniforms } from './sway';
import { bakeSeaField, G, GAMMA, type SeaField, type SeaFieldSpec } from './sea-field';

// The sea: one surface from the sand to the horizon, every shore effect a
// function of one baked field. Drawn in the water pass with the scene's colour
// and depth bound, like the pond material, which it shares nothing else with.

/** Metres per quad on the grid unless the entry says otherwise. */
const SEGMENT = 0.6;
/** Metres per texel of the shore field. */
const TEXEL = 0.5;
/** The apron's rings: every `APRON_STEP` metres to `APRON_DENSE`, then geometrically to the reach. */
const APRON_STEP = 4;
const APRON_DENSE = 100;
const APRON_FAR_RINGS = 6;

/** The crossed chop trains: wavelengths, amplitudes, and deep-water celerity. */
const CHOP_LONG = 4.3;
const CHOP_SHORT = 2.6;
const K_LONG = (2 * Math.PI) / CHOP_LONG;
const K_SHORT = (2 * Math.PI) / CHOP_SHORT;
const C_LONG = Math.sqrt(G / K_LONG);
const C_SHORT = Math.sqrt(G / K_SHORT);

export interface Swell {
  /** The way it travels, world xz. */
  direction: readonly [number, number];
  /** Wavelength, metres. */
  length: number;
  /** Crest to trough, metres. */
  height: number;
}

export interface SeaPlaneOptions {
  /** The rectangle the shore field covers, metres, centred on `at`. */
  width: number;
  depth: number;
  /** Centre of the rectangle and the water level, world. */
  at: THREE.Vector3;
  swell: Swell;
  /** Metres the surface runs on past the rectangle, sea side only. */
  reach?: number;
  segment?: number;
  /** Ground height at a world x, z: only the apron's land test reads it. */
  groundAt: (x: number, z: number) => number;
}

/** Shared by both stages: the field lookup and the shore train it drives. */
const TRAIN_GLSL = /* glsl */ `
  uniform sampler2D tField;
  uniform vec2 uFieldMin;
  uniform vec2 uFieldSize;
  uniform float uLevel;
  // The swell: travel direction (xz), deep-water wavenumber, amplitude.
  uniform vec4 uSwell;
  uniform float uOmega;
  uniform float swayTime;
  uniform float uWaterMotion;
  uniform float uWaveScale;
  uniform float uRunup;

  // Column (m), phase (rad), signed distance to land (m), travel bearing (rad).
  // Outside the field it is the swell's own plane wave over deep water.
  vec4 fieldAt(vec2 p) {
    vec2 uv = (p - uFieldMin) / uFieldSize;
    if (any(lessThan(uv, vec2(0.0))) || any(greaterThan(uv, vec2(1.0)))) {
      return vec4(30.0, uSwell.z * dot(p, uSwell.xy), 60.0, atan(uSwell.y, uSwell.x));
    }
    return texture2D(tField, uv);
  }

  float wavenumberAt(float h) {
    float k0 = uSwell.z;
    return h > 0.0 ? clamp(k0 / sqrt(max(tanh(k0 * h), 1e-4)), k0, 2.1) : 2.1;
  }

  // Green's law up the bed, capped by McCowan: b is the breaking ratio, 1 at
  // and past the break point and on the land.
  void trainAt(vec4 f, float a0, out float a, out float b, out float k, out float phi) {
    float h = f.x;
    k = wavenumberAt(h);
    float kh = clamp(k * max(h, 0.0), 1e-3, 10.0);
    float shoal = h > 0.0 ? sqrt((k / uSwell.z) / (1.0 + 2.0 * kh / sinh(2.0 * kh))) : 0.0;
    float cap = ${(GAMMA / 2).toFixed(2)} * max(h, 0.0);
    float raw = a0 * shoal;
    b = a0 > 0.0 ? (h > 0.0 ? clamp(raw / max(cap, 1e-4), 0.0, 1.0) : 1.0) : 0.0;
    a = min(raw, cap);
    phi = f.y - uOmega * swayTime * uWaterMotion;
  }

  float swellAmplitude() {
    return uSwell.w * uWaveScale * uWaterMotion;
  }

  // How long ago the crest passed, in periods, and how far the surface is
  // pushed up the sand by it: fast up, slow to drain.
  float sinceCrest(float phi) {
    return fract(-phi * 0.15915494);
  }
  float surgeAt(float since) {
    return smoothstep(0.0, 0.3, since) * (1.0 - smoothstep(0.3, 1.0, since));
  }
`;

export const SEA_MATERIAL = new THREE.ShaderMaterial({
  name: 'Sea',
  uniforms: {
    tScene: { value: null },
    tDepth: { value: null },
    uResolution: { value: new THREE.Vector2(1, 1) },
    uProjectionView: { value: new THREE.Matrix4() },
    uInverseProjectionView: { value: new THREE.Matrix4() },
    uFar: { value: 500 },

    // Per mesh, written in onBeforeRender from the mesh's own field.
    tField: { value: null },
    uFieldMin: { value: new THREE.Vector2() },
    uFieldSize: { value: new THREE.Vector2(1, 1) },
    uLevel: { value: 0 },
    uSwell: { value: new THREE.Vector4(0, -1, 0.2, 0.3) },
    uOmega: { value: 1.4 },

    // Set by PostFX, the same three it sets on the pond material.
    uWaveScale: { value: 1 },
    uWaterMotion: { value: 1 },
    uReflections: { value: 1 },

    uShallow: { value: new THREE.Color('#5f9a92') },
    uDeep: { value: new THREE.Color('#173a44') },
    uFoam: { value: new THREE.Color('#eef3f2') },
    uScatter: { value: new THREE.Color('#8fcfbf') },
    /** Metres of column over which shore colour becomes deep colour. */
    uShoreDepth: { value: 1.6 },
    /** Metres of column that fully hides the bed. */
    uClarity: { value: 1.4 },
    /** How dark the bed is under water: it is wet sand. */
    uWetBed: { value: 0.65 },
    /** Metres the surface runs up the sand per metre of swell amplitude. */
    uRunup: { value: 1.4 },
    /** Amplitude of the crossed chop, as a fraction of its authored size. */
    uChop: { value: 1 },
    /** Microfacet roughness of the sun path: resolved ripple, and ripple filtered flat. */
    uRoughNear: { value: 0.02 },
    uRoughFar: { value: 0.3 },
    /** How much of the sun a facet aimed straight at it gives back. */
    uGlitter: { value: 0.1 },
    /** How far the surface tilt bends the bed seen through it. */
    uRefract: { value: 0.6 },
    /** How bright the caustics on a sunlit bed get. */
    uCaustics: { value: 0.5 },

    ...THREE.UniformsUtils.clone(THREE.UniformsLib.fog),
    ...windUniforms,
    ...skyUniforms,
    ...fogUniforms,
  },
  fog: true,
  transparent: true,
  blending: THREE.NoBlending,
  depthTest: false,
  depthWrite: false,
  side: THREE.DoubleSide,

  vertexShader: /* glsl */ `
    // 1 on the apron rings, which are too coarse to carry chop; 0 on the grid.
    attribute float aApron;

    uniform vec2 windDir;
    uniform float uChop;

    varying vec3 vWorld;
    /** Where this vertex stood before any wave moved it, world xz. */
    varying vec2 vPlace;
    varying vec3 vNormal;
    varying float vApron;

    ${NOISE_GLSL}
    ${TRAIN_GLSL}

    void main() {
      vec3 world = (modelMatrix * vec4(position, 1.0)).xyz;
      vPlace = world.xz;
      vApron = aApron;
      vec4 f = fieldAt(world.xz);
      float a0 = swellAmplitude();
      float a;
      float b;
      float k;
      float phi;
      trainAt(f, a0, a, b, k, phi);
      // dir is the way the wave travels; Gerstner pulls the front face back against it.
      vec2 dir = vec2(cos(f.w), sin(f.w));

      float lean = 0.5 * b;
      float phis = phi + lean * (1.0 - cos(phi));
      float dphis = 1.0 + lean * sin(phi);
      float cs = cos(phis);
      float sn = sin(phis);
      float steep = clamp(a * k / 0.2, 0.0, 1.0);
      float sweep = 0.6 * steep / k;
      vec2 shift = -dir * (sweep * sn);
      float lift = a * cs;
      float tx = 1.0 - sweep * k * cs * dphis;
      float ty = -a * k * sn * dphis;
      vec2 slope = dir * (ty / max(tx, 0.1));

      // The swash: the surface carries on over the sand and rises with each
      // wave, by an amount that varies along the shore and per wave.
      float since = sinceCrest(phi);
      vec2 across = vec2(-dir.y, dir.x);
      float wave = floor(-phi * 0.15915494);
      float tongue = valueNoise(vec2(dot(world.xz, across) * 0.3, wave * 0.618 + 3.7));
      float runup = uRunup * a0 * (0.65 + 0.7 * tongue);
      lift += runup * surgeAt(since) * (1.0 - smoothstep(0.0, 2.0 * runup, f.x));

      // Crossed chop, fading out in the shallows and absent on the apron.
      float carry = (1.0 - aApron) * smoothstep(0.3, 2.0, f.x) * uChop * uWaveScale * uWaterMotion;
      vec2 d1 = normalize(windDir + vec2(1e-4, 0.0));
      vec2 d2 = vec2(d1.x * 0.62 - d1.y * 0.78, d1.x * 0.78 + d1.y * 0.62);
      float t = swayTime * uWaterMotion;
      float p1 = (dot(world.xz, d1) - t * ${C_LONG.toFixed(4)}) * ${K_LONG.toFixed(5)};
      float p2 = (dot(world.xz, d2) - t * ${C_SHORT.toFixed(4)}) * ${K_SHORT.toFixed(5)};
      float a1 = 0.035 * carry;
      float a2 = 0.02 * carry;
      lift += a1 * sin(p1) + a2 * sin(p2);
      slope += d1 * (a1 * ${K_LONG.toFixed(5)} * cos(p1)) + d2 * (a2 * ${K_SHORT.toFixed(5)} * cos(p2));

      world.xz += shift;
      world.y += lift;
      vWorld = world;
      vNormal = normalize(vec3(-slope.x, 1.0, -slope.y));
      gl_Position = projectionMatrix * viewMatrix * vec4(world, 1.0);
    }
  `,

  fragmentShader: /* glsl */ `
    uniform sampler2D tScene;
    uniform sampler2D tDepth;
    uniform vec2 uResolution;
    uniform mat4 uProjectionView;
    uniform mat4 uInverseProjectionView;
    uniform float uFar;
    uniform float uReflections;
    uniform vec3 uShallow;
    uniform vec3 uDeep;
    uniform vec3 uFoam;
    uniform vec3 uScatter;
    uniform float uShoreDepth;
    uniform float uClarity;
    uniform float uWetBed;
    uniform float uRoughNear;
    uniform float uRoughFar;
    uniform float uGlitter;
    uniform float uRefract;
    uniform float uCaustics;
    uniform vec2 windDir;

    uniform vec3 fogColor;
    uniform float fogNear;
    uniform float fogFar;

    varying vec3 vWorld;
    varying vec2 vPlace;
    varying vec3 vNormal;
    varying float vApron;

    ${NOISE_GLSL}
    ${SKY_GLSL}
    ${AERIAL_AIR_GLSL}
    ${TRAIN_GLSL}

    /** Metres along the camera ray to what the scene drew at a screen position; sky is the far plane. */
    float sceneDistance(vec2 uv) {
      float d = texture2D(tDepth, uv).r;
      if (d >= 0.9999) return uFar;
      vec4 p = uInverseProjectionView * vec4(uv * 2.0 - 1.0, d * 2.0 - 1.0, 1.0);
      return length(p.xyz / p.w - cameraPosition);
    }

    vec3 scenePoint(vec2 uv) {
      float d = texture2D(tDepth, uv).r;
      vec4 p = uInverseProjectionView * vec4(uv * 2.0 - 1.0, d * 2.0 - 1.0, 1.0);
      return p.xyz / p.w;
    }

    ${REFLECT_GLSL}

    // --- noise resolved to the pixel -------------------------------------------
    // An octave the pixel spans too much of is pulled to its mean, by the span of
    // its coordinate, never by its own derivative; lost is the amplitude removed.
    float resolvedWeight(float cellsPerPixel) {
      return 1.0 - smoothstep(0.15, 0.4, cellsPerPixel);
    }
    float footprint(vec2 p) {
      return max(length(dFdx(p)), length(dFdy(p)));
    }
    float grain(vec2 p, float foot, out float lost) {
      float w1 = resolvedWeight(foot);
      float w2 = resolvedWeight(foot * 2.17);
      lost = 0.66 * (1.0 - w1) + 0.34 * (1.0 - w2);
      return 0.5 + (valueNoise(p) - 0.5) * (0.66 * w1) + (valueNoise(p * 2.17 + 11.3) - 0.5) * (0.34 * w2);
    }
    // Noise squeezed along a direction, so it reads as streaks that way.
    float streaks(vec2 p, vec2 along, float stretch, float scale, out float lost) {
      vec2 across = vec2(-along.y, along.x);
      vec2 q = vec2(dot(p, along) / stretch, dot(p, across)) * scale;
      return grain(q, footprint(q), lost);
    }
    // Above a threshold with a shoulder, resolved over the pixel and over what
    // the filter removed, so far away it is the fraction that would be over.
    float over(float field, float at, float shoulder, float lost) {
      float w = max(shoulder, max(fwidth(field) * 0.6, lost * 0.5));
      return smoothstep(at - w, at + w, field);
    }
    float bump(float x, float lo, float hi, float w) {
      return max(smoothstep(lo - w, lo + w, x) - smoothstep(hi - w, hi + w, x), 0.0);
    }

    /** GGX with Smith visibility and Schlick fresnel, for a light in direction l. */
    float glitter(vec3 n, vec3 v, vec3 l, float alpha) {
      vec3 hv = normalize(v + l);
      float nl = max(dot(n, l), 0.0);
      float nv = max(dot(n, v), 1e-3);
      float nh = max(dot(n, hv), 0.0);
      float a2 = alpha * alpha;
      float dd = nh * nh * (a2 - 1.0) + 1.0;
      float D = a2 / (3.14159265 * dd * dd);
      float V = 0.5 / max(mix(2.0 * nl * nv, nl + nv, alpha), 1e-4);
      float F = 0.02 + 0.98 * pow(1.0 - max(dot(hv, v), 0.0), 5.0);
      return D * V * F * nl;
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / uResolution;
      vec3 toEye = cameraPosition - vWorld;
      float surfaceDistance = length(toEye);
      vec3 view = toEye / surfaceDistance;
      float bedDistance = sceneDistance(uv);
      vec3 bedPoint = scenePoint(uv);

      vec4 f = fieldAt(vPlace);
      float a0 = swellAmplitude();
      float a;
      float b;
      float k;
      float phi;
      trainAt(f, a0, a, b, k, phi);
      float surf = smoothstep(0.85, 1.0, b);
      float since = sinceCrest(phi);
      vec2 dir = vec2(cos(f.w), sin(f.w));

      vec3 sunDir = normalize(uSunDirection);
      float sunUp = smoothstep(-0.02, 0.05, sunDir.y) * uSunIntensity;
      vec3 moonDir = normalize(uMoonDirection);
      float moonUp = smoothstep(-0.02, 0.05, moonDir.y) * uMoonIntensity;

      // --- wet sand ---------------------------------------------------------------
      // A bed in front of the surface is not water. Within the runup it is wet
      // sand: darkened, glancing the sky as the sheet beside it does.
      float rise = bedPoint.y - uLevel;
      if (bedDistance < surfaceDistance - 0.02) {
        float runup = surf * uRunup * a0;
        if (runup <= 0.0 || !gl_FrontFacing || rise >= runup * 1.3) discard;
        vec3 sand = texture2D(tScene, uv).rgb;
        float dry = smoothstep(runup * 0.7, runup * 1.3, rise);
        vec3 glance = skyColourDiscless(normalize(reflect(-view, vec3(0.0, 1.0, 0.0)) + vec3(0.0, 0.02, 0.0)));
        float graze = 0.02 + 0.98 * pow(1.0 - clamp(view.y, 0.0, 1.0), 5.0);
        vec3 wet = mix(sand * uWetBed, glance, graze * 0.8);
        gl_FragColor = vec4(mix(wet, sand, dry), 1.0);
        return;
      }
      // Nobody swims: the underside is the deep colour and nothing more.
      if (!gl_FrontFacing) {
        gl_FragColor = vec4(uDeep, 0.0);
        return;
      }

      float thickness = max(bedDistance - surfaceDistance, 0.0);

      // --- the surface normal ---------------------------------------------------
      // The wave slope from the vertex stage, filtered flat as the mesh outruns the
      // pixel, plus fine ripple by finite difference on resolved noise. What the
      // filtering takes out goes into the roughness of the sun path.
      vec3 normal = normalize(vNormal);
      float swim = clamp(length(fwidth(vNormal.xz)) * 5.0, 0.0, 1.0);
      normal = normalize(mix(normal, vec3(0.0, 1.0, 0.0), swim));
      vec2 wind = normalize(windDir + vec2(1e-4, 0.0));
      vec2 drift = wind * (0.3 * swayTime * uWaterMotion);
      vec2 rq = (vPlace - drift) * 1.35;
      float rippleFoot = footprint(rq);
      float lost;
      float n0 = grain(rq, rippleFoot, lost);
      float e = 0.24;
      float nx = grain(rq + vec2(e, 0.0), rippleFoot, lost) - n0;
      float nz = grain(rq + vec2(0.0, e), rippleFoot, lost) - n0;
      float rippleSwim = lost;
      float calm = smoothstep(0.0, 0.8, f.x) * uWaveScale * uWaterMotion;
      normal = normalize(normal + vec3(-nx, 0.0, -nz) * (0.14 * calm / e));
      float alpha = mix(uRoughNear, uRoughFar, clamp(swim + rippleSwim, 0.0, 1.0));

      // --- under the water ------------------------------------------------------
      vec3 tilt = mat3(viewMatrix) * (normal - vec3(0.0, 1.0, 0.0));
      vec2 bent = uv + tilt.xy * (uRefract * min(thickness, 1.0) / surfaceDistance);
      vec3 bed = texture2D(tScene, sceneDistance(bent) > surfaceDistance ? bent : uv).rgb * uWetBed;
      float shallows = smoothstep(0.05, 0.3, thickness) * (1.0 - smoothstep(1.2, 2.4, thickness)) * sunUp;
      if (shallows > 0.0) {
        vec2 cp = bedPoint.xz;
        float cfoot = footprint(cp);
        vec2 scroll = vec2(0.18, 0.11) * (swayTime * uWaterMotion);
        float c1 = 1.0 - abs(2.0 * valueNoise(cp * 0.9 + scroll) - 1.0);
        float c2 = 1.0 - abs(2.0 * valueNoise(cp * 1.9 - scroll * 1.4 + 7.3) - 1.0);
        c1 = mix(0.5, c1, resolvedWeight(cfoot * 0.9));
        c2 = mix(0.5, c2, resolvedWeight(cfoot * 1.9));
        bed *= 1.0 + c1 * c2 * uCaustics * shallows;
      }
      float opacity = 1.0 - exp(-thickness / max(uClarity, 0.01));
      vec3 body = mix(uShallow, uDeep, 1.0 - exp(-thickness / max(uShoreDepth, 0.01)));
      vec3 below = mix(bed, body, opacity);

      // --- reflection -------------------------------------------------------------
      vec3 bounce = reflect(-view, normal);
      bounce.y = max(bounce.y, 0.015);
      bounce = normalize(bounce);
      vec3 sky = skyColourDiscless(bounce);
      vec3 reflection = sky;
      float hit = 0.0;
      // Past 120 m the march finds nothing a sky lookup does not.
      if (uReflections > 0.5 && surfaceDistance < 120.0) {
        float found;
        float travelled;
        vec3 marched = marchReflection(vWorld, bounce, reflectJitter(floor(gl_FragCoord.xy)), found, travelled);
        reflection = mix(sky, marched, found);
        hit = found;
      }
      float fresnel = clamp(0.02 + 0.98 * pow(1.0 - clamp(dot(normal, view), 0.0, 1.0), 5.0), 0.0, 1.0);
      vec3 colour = mix(below, reflection, fresnel);

      // Scatter through a raised crest the eye looks into, never with sand behind it.
      float crest = max(cos(phi + 0.5 * b * (1.0 - cos(phi))), 0.0) * smoothstep(0.0, 0.05, a);
      float sss = crest * pow(max(dot(-view, sunDir), 0.0), 4.0) * (1.0 - fresnel)
        * smoothstep(0.3, 1.0, thickness) * sunUp;
      colour = mix(colour, uScatter, clamp(sss * 0.7, 0.0, 1.0));

      if (sunUp > 0.0) {
        float g = glitter(normal, view, sunDir, alpha) * uGlitter * sunUp;
        colour = mix(colour, uSunColor, clamp(g, 0.0, 1.0));
      }
      if (moonUp > 0.0) {
        float g = glitter(normal, view, moonDir, alpha) * uGlitter * moonUp;
        colour = mix(colour, uMoonColor, clamp(g, 0.0, 1.0));
      }

      // --- foam -----------------------------------------------------------------
      // One density, mixed in soft. Every term is metres wide, its noise resolved
      // to the pixel, and nothing here is a line.
      float laceLost;
      float clumpLost;
      float lace = streaks(vPlace - drift * 0.5, dir, 2.5, 0.9, laceLost);
      float clumps = streaks(vPlace - drift * 0.3, dir, 1.5, 0.28, clumpLost);

      // The break: white over the crest and down its front, in runs.
      float s = fract(phi * 0.15915494 + 0.5) - 0.5;
      float pw = fwidth(phi) * 0.15915494 * 0.5;
      float cap = bump(s, -0.02, 0.13, max(0.03, pw));
      float runs = over(clumps, 0.42, 0.1, clumpLost);
      float breakFoam = surf * cap * (0.55 + 0.45 * runs) * smoothstep(0.0, 0.15, f.x);

      // The wash behind it, thinning before the next crest and opening hole-first.
      float decay = 1.0 - smoothstep(0.02, 0.55, since);
      float washFoam = surf * decay * over(lace, mix(0.35, 0.7, since), 0.08, laceLost) * smoothstep(-0.1, 0.1, f.x);

      // The fringe: froth against every piece of land alike, sand and rock,
      // densest at the land and pulsing as each wave arrives there.
      float pulse = 0.55 + 0.45 * smoothstep(0.0, 0.15, since) * (1.0 - smoothstep(0.15, 0.8, since));
      float reach = 0.7 + 0.7 * lace;
      float fringe = (1.0 - smoothstep(0.0, reach, max(f.z, 0.0))) * pulse * step(0.0, f.z);

      // The sheet's edge over the sand: foam where the running water is thinnest.
      float column = max(vWorld.y - bedPoint.y, 0.0);
      float sheet = (1.0 - step(0.0, f.z)) * (1.0 - smoothstep(0.015, 0.09 + 0.08 * lace, column));

      // Whitecaps offshore, sparse, on the chop.
      float capLost;
      float capField = streaks(vPlace - drift * 1.4, wind, 3.0, 0.2, capLost);
      float caps = over(capField, 0.74, 0.06, capLost) * smoothstep(3.0, 8.0, f.x) * uWaveScale * uWaterMotion;

      float foam = clamp(breakFoam + 0.6 * washFoam + 0.75 * fringe + 0.85 * sheet + 0.5 * caps, 0.0, 1.0);
      vec3 foamColour = mix(uShallow, uFoam, 0.85);
      colour = mix(colour, foamColour, foam);

      // --- fog -------------------------------------------------------------------
      // Only the sea's own share of the pixel: the bed and a marched hit came out
      // of tScene already fogged for their own distance.
      float own = mix(opacity, 1.0 - hit, fresnel);
      own = mix(own, 1.0, foam);
      float haze = aerialAmount(-view, surfaceDistance) * own;
      gl_FragColor = vec4(mix(colour, aerialAir(-view), haze), 1.0);
    }
  `,
});

(SEA_MATERIAL as { defaultAttributeValues?: Record<string, number[]> }).defaultAttributeValues = {
  aApron: [0],
};

/** What a sea mesh carries for its own draw: the field, or the spec to bake it from. */
interface SeaState {
  spec: SeaFieldSpec;
  field: SeaField | null;
}

const pending = new Set<THREE.Mesh>();

/**
 * Bakes the field of every sea built since the last call. Run by the water pass
 * before it draws, once the whole zone stands in the scene, because the bake
 * reads the scene from above and a prop built after it would not be in it.
 */
export function bakePendingSeas(renderer: THREE.WebGLRenderer, scene: THREE.Scene): void {
  if (pending.size === 0) return;
  for (const mesh of pending) {
    const state = mesh.userData.sea as SeaState;
    // A sea whose zone has gone before its first frame is never baked.
    if (!mesh.parent) continue;
    state.field?.texture.dispose();
    state.field = bakeSeaField(renderer, scene, state.spec);
  }
  pending.clear();
}

/**
 * The sea, placed like any other prop. A grid over its rectangle at `segment`
 * spacing, then an apron of rings out to `reach` on the sides that face open
 * water. Sets `userData.water` so the water pass runs for the zone.
 */
export function seaPlane(options: SeaPlaneOptions): THREE.Mesh {
  const { width, depth, at, swell, reach = 600, segment = SEGMENT, groundAt } = options;

  const across = Math.max(1, Math.round(width / segment));
  const along = Math.max(1, Math.round(depth / segment));
  const sx = width / across;
  const sz = depth / along;
  const cols = across + 1;
  const rows = along + 1;
  const gridCount = cols * rows;

  const perimeter: number[] = [];
  for (let i = 0; i < across; i++) perimeter.push(i);
  for (let j = 0; j < along; j++) perimeter.push(j * cols + across);
  for (let i = across; i > 0; i--) perimeter.push(along * cols + i);
  for (let j = along; j > 0; j--) perimeter.push(j * cols);
  const rim = perimeter.length;

  const ringDistances: number[] = [];
  if (reach > 0) {
    const dense = Math.min(reach, APRON_DENSE);
    for (let d = APRON_STEP; d <= dense; d += APRON_STEP) ringDistances.push(d);
    if (reach > dense) {
      for (let r = 1; r <= APRON_FAR_RINGS; r++) {
        ringDistances.push(dense * Math.pow(reach / dense, r / APRON_FAR_RINGS));
      }
    }
  }
  const rings = ringDistances.length;
  const count = gridCount + rings * rim;

  const positions = new Float32Array(count * 3);
  const apron = new Float32Array(count);
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const n = j * cols + i;
      positions[n * 3] = -width / 2 + i * sx;
      positions[n * 3 + 2] = -depth / 2 + j * sz;
    }
  }

  const index: number[] = [];
  for (let j = 0; j < along; j++) {
    for (let i = 0; i < across; i++) {
      const a = j * cols + i;
      const b = a + 1;
      const c = a + cols + 1;
      const d = a + cols;
      index.push(a, c, b, a, d, c);
    }
  }

  if (rings > 0) {
    // Outward is measured from the rectangle shrunk by a margin, so the rings
    // round their corners. A perimeter point on land, or whose outermost ring
    // would stand on land, stays pinned: the sea does not run under the dunes.
    const margin = Math.min(width, depth) * 0.25;
    const hx = width / 2;
    const hz = depth / 2;
    const outward = new Float32Array(rim * 2);
    const pinned = new Uint8Array(rim);
    for (let p = 0; p < rim; p++) {
      const g = perimeter[p];
      const px = positions[g * 3];
      const pz = positions[g * 3 + 2];
      const ix = Math.min(Math.max(px, -hx + margin), hx - margin);
      const iz = Math.min(Math.max(pz, -hz + margin), hz - margin);
      const len = Math.hypot(px - ix, pz - iz) || 1;
      outward[p * 2] = (px - ix) / len;
      outward[p * 2 + 1] = (pz - iz) / len;
      const fx = px + Math.min(reach, 40) * outward[p * 2];
      const fz = pz + Math.min(reach, 40) * outward[p * 2 + 1];
      const land = groundAt(px + at.x, pz + at.z) >= at.y || groundAt(fx + at.x, fz + at.z) >= at.y;
      pinned[p] = land ? 1 : 0;
    }
    for (let r = 0; r < rings; r++) {
      const dist = ringDistances[r];
      for (let p = 0; p < rim; p++) {
        const g = perimeter[p];
        const n = gridCount + r * rim + p;
        const out = pinned[p] ? 0 : dist;
        positions[n * 3] = positions[g * 3] + out * outward[p * 2];
        positions[n * 3 + 2] = positions[g * 3 + 2] + out * outward[p * 2 + 1];
        apron[n] = 1;
      }
    }
    for (let r = 0; r < rings; r++) {
      for (let p = 0; p < rim; p++) {
        const q = (p + 1) % rim;
        const innerP = r === 0 ? perimeter[p] : gridCount + (r - 1) * rim + p;
        const innerQ = r === 0 ? perimeter[q] : gridCount + (r - 1) * rim + q;
        const outerP = gridCount + r * rim + p;
        const outerQ = gridCount + r * rim + q;
        index.push(innerP, innerQ, outerQ, innerP, outerQ, outerP);
      }
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('aApron', new THREE.BufferAttribute(apron, 1));
  geometry.setIndex(index);

  const length = Math.hypot(swell.direction[0], swell.direction[1]) || 1;
  const direction: [number, number] = [swell.direction[0] / length, swell.direction[1] / length];
  const k0 = (2 * Math.PI) / swell.length;
  const state: SeaState = {
    spec: {
      level: at.y,
      x0: at.x - width / 2,
      z0: at.z - depth / 2,
      width,
      depth,
      texel: TEXEL,
      direction,
      k0,
    },
    field: null,
  };

  const mesh = new THREE.Mesh(geometry, SEA_MATERIAL);
  mesh.name = 'sea';
  mesh.position.copy(at);
  mesh.layers.set(WATER_LAYER);
  mesh.userData.noCollide = true;
  mesh.userData.water = true;
  mesh.userData.sea = state;
  mesh.frustumCulled = false;
  mesh.onBeforeRender = () => {
    const u = SEA_MATERIAL.uniforms;
    u.tField.value = state.field?.texture ?? null;
    (u.uFieldMin.value as THREE.Vector2).set(state.spec.x0, state.spec.z0);
    (u.uFieldSize.value as THREE.Vector2).set(width, depth);
    u.uLevel.value = at.y;
    // Before the bake there is no field: the whole surface is the plane wave.
    if (!state.field) (u.uFieldSize.value as THREE.Vector2).set(-1, -1);
    (u.uSwell.value as THREE.Vector4).set(direction[0], direction[1], k0, swell.height / 2);
    u.uOmega.value = Math.sqrt(G * k0);
  };
  pending.add(mesh);
  return mesh;
}
