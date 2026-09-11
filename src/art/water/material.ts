import * as THREE from 'three';
import { NOISE_GLSL } from '../../engine/noise';
import { SKY_GLSL, skyUniforms } from '../../engine/Sky';
import { AERIAL_AIR_GLSL, fogUniforms } from '../../engine/fog';
import { REFLECT_GLSL } from '../../engine/reflect';
import { windUniforms } from '../sway';
import { TRAIN_GLSL } from './waves';

// One water material for every body. The regime is a per-body uniform and a
// small branch; everything a body varies is pushed in `onBeforeRender`.

/** Regime codes, as `uRegime` carries them. */
export const REGIME_CODE = { still: 0, flow: 1, fall: 2, sea: 3 } as const;

/** What the far field goes to underwater, blending deep toward shallow. Shared with `engine/Underwater`. */
export const MURK_MIX = 0.42;

/**
 * `depthTest` and `depthWrite` are off: the shader tests itself against the
 * scene's depth. `transparent` is on for its sorting only; blending is off
 * because the shader composites what is behind it.
 */
export const WATER_MATERIAL = new THREE.ShaderMaterial({
  name: 'Water',
  uniforms: {
    tScene: { value: null },
    tDepth: { value: null },
    uResolution: { value: new THREE.Vector2(1, 1) },
    uProjectionView: { value: new THREE.Matrix4() },
    uInverseProjectionView: { value: new THREE.Matrix4() },
    uFar: { value: 500 },

    uWaveScale: { value: 1 },
    uWaterMotion: { value: 1 },
    uReflections: { value: 1 },
    uSubmerged: { value: 0 },
    uMurkDensity: { value: 0.085 },

    // --- per body -----------------------------------------------------------
    uRegime: { value: 0 },
    tFieldA: { value: null },
    tFieldB: { value: null },
    uFieldMin: { value: new THREE.Vector2() },
    uFieldSize: { value: new THREE.Vector2(1, 1) },
    uLevel: { value: 0 },
    uSwell: { value: new THREE.Vector4(0, -1, 0.2, 0) },
    uOmega: { value: 1.4 },
    uRunup: { value: 1.4 },
    uChop: { value: 1 },
    uShallow: { value: new THREE.Color() },
    uDeep: { value: new THREE.Color() },
    uFoam: { value: new THREE.Color() },
    uScatter: { value: new THREE.Color() },
    uBands: { value: 0 },
    uFacet: { value: 0 },
    /** Metres of column over which shore colour becomes deep colour. */
    uShoreDepth: { value: 1.1 },
    /** Metres of column that fully hides the bed. */
    uClarity: { value: 0.9 },
    /** Wash-line width against the bank, metres. */
    uWash: { value: 0.25 },
    /** Collar width round what stands in the water, metres. */
    uCollar: { value: 0.3 },
    uFallDrop: { value: 1 },
    uFallSpeed: { value: 1 },
    tRipple: { value: null },
    uRippleMin: { value: new THREE.Vector2() },
    uRippleSize: { value: new THREE.Vector2(1, 1) },
    uRippleOn: { value: 0 },

    // --- shared look --------------------------------------------------------
    uWetBed: { value: 0.65 },
    uRoughNear: { value: 0.02 },
    uRoughFar: { value: 0.3 },
    uGlitter: { value: 0.1 },
    uMirror: { value: 0.55 },
    uRefract: { value: 0.6 },
    uCaustics: { value: 0.5 },

    // The persistence buffer: red foam, green wet, over 128 m round the camera.
    tPersist: { value: null },
    uPersistMin: { value: new THREE.Vector2() },
    uPersistSize: { value: new THREE.Vector2(1, 1) },

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
    attribute float aEdge;
    attribute vec2 aUV;
    attribute float aApron;

    uniform float uRegime;
    uniform sampler2D tRipple;
    uniform vec2 uRippleMin;
    uniform vec2 uRippleSize;
    uniform float uRippleOn;

    varying vec3 vWorld;
    varying vec2 vPlace;
    varying vec3 vNormal;
    varying float vEdge;
    varying vec2 vUV;
    varying float vApron;
    /** How folded the sea's crest is here, 0 flat: the Gerstner Jacobian's loss. */
    varying float vFold;

    ${NOISE_GLSL}
    ${TRAIN_GLSL}

    void main() {
      vec3 world = (modelMatrix * vec4(position, 1.0)).xyz;
      vPlace = world.xz;
      vEdge = aEdge;
      vUV = aUV;
      vApron = aApron;
      vec2 slope = vec2(0.0);
      float fold = 0.0;

      if (uRegime > 2.5) {
        vec4 fa = fieldA(world.xz);
        vec4 fb = fieldB(world.xz);
        float a0 = swellAmplitude(fb.w);
        float a;
        float b;
        float k;
        float phi;
        trainAt(fa.x, fb.z, a0, a, b, k, phi);
        // dir is the way the wave travels; Gerstner pulls the front face back against it.
        vec2 dir = vec2(cos(fa.z), sin(fa.z));
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
        slope = dir * (ty / max(tx, 0.1));
        fold = clamp(1.0 - tx, 0.0, 1.0);

        // The swash: the surface carries on over the sand and rises with each
        // wave, by an amount that varies along the shore and per wave.
        float since = sinceCrest(phi);
        vec2 across = vec2(-dir.y, dir.x);
        float wave = floor(-phi * 0.15915494);
        float tongue = valueNoise(vec2(dot(world.xz, across) * 0.3, wave * 0.618 + 3.7));
        float runup = uRunup * a0 * (0.65 + 0.7 * tongue);
        lift += runup * surgeAt(since) * (1.0 - smoothstep(0.0, 2.0 * runup, fa.x));

        float carry = (1.0 - aApron) * smoothstep(0.3, 2.0, fa.x) * uChop * uWaveScale * uWaterMotion * fb.w;
        float chopLift;
        vec2 chopSlope;
        chopAt(world.xz, carry, chopLift, chopSlope);
        lift += chopLift;
        slope += chopSlope;

        world.xz += shift;
        world.y += lift;
      } else if (uRegime < 0.5 && uRippleOn > 0.5) {
        vec2 ruv = (world.xz - uRippleMin) / uRippleSize;
        if (all(greaterThanEqual(ruv, vec2(0.0))) && all(lessThanEqual(ruv, vec2(1.0)))) {
          world.y += texture2D(tRipple, ruv).r * uWaveScale * uWaterMotion * (1.0 - aEdge);
        }
      }

      vWorld = world;
      vNormal = normalize(vec3(-slope.x, 1.0, -slope.y));
      vFold = fold;
      gl_Position = projectionMatrix * viewMatrix * vec4(world, 1.0);
      // Held inside the far plane, so an apron reaches the horizon instead of being cut short of it.
      if (aApron > 0.5) gl_Position.z = min(gl_Position.z, gl_Position.w * 0.99999);
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
    uniform float uSubmerged;
    uniform float uMurkDensity;
    uniform float uRegime;
    uniform vec3 uShallow;
    uniform vec3 uDeep;
    uniform vec3 uFoam;
    uniform vec3 uScatter;
    uniform float uBands;
    uniform float uFacet;
    uniform float uShoreDepth;
    uniform float uClarity;
    uniform float uWash;
    uniform float uCollar;
    uniform float uFallDrop;
    uniform float uFallSpeed;
    uniform sampler2D tRipple;
    uniform vec2 uRippleMin;
    uniform vec2 uRippleSize;
    uniform float uRippleOn;
    uniform float uWetBed;
    uniform float uRoughNear;
    uniform float uRoughFar;
    uniform float uGlitter;
    uniform float uMirror;
    uniform float uRefract;
    uniform float uCaustics;
    uniform sampler2D tPersist;
    uniform vec2 uPersistMin;
    uniform vec2 uPersistSize;

    uniform sampler2D gustField;
    uniform float windLagScale;
    uniform float windHalfSpan;

    uniform vec3 fogColor;
    uniform float fogNear;
    uniform float fogFar;

    varying vec3 vWorld;
    varying vec2 vPlace;
    varying vec3 vNormal;
    varying float vEdge;
    varying vec2 vUV;
    varying float vApron;
    varying float vFold;

    ${NOISE_GLSL}
    ${SKY_GLSL}
    ${AERIAL_AIR_GLSL}
    ${TRAIN_GLSL}

    /** Metres along the camera ray to what the scene drew at a screen position; sky is beyond everything. */
    float sceneDistance(vec2 uv) {
      float d = texture2D(tDepth, uv).r;
      if (d >= 0.9999) return 1.0e6;
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
    // its coordinate; lost is the amplitude removed.
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
    float streaks(vec2 p, vec2 along, float stretch, float scale, out float lost) {
      vec2 across = vec2(-along.y, along.x);
      vec2 q = vec2(dot(p, along) / stretch, dot(p, across)) * scale;
      return grain(q, footprint(q), lost);
    }
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

    /** The same gust the reeds bend to, at this point. */
    float gustAt(vec2 p) {
      float lag = dot(p, windDir) * windLagScale;
      float u = clamp(0.5 - lag / (2.0 * windHalfSpan), 0.0, 1.0);
      return texture2D(gustField, vec2(u, 0.5)).r;
    }

    /** Diffuse light on a flat white thing lying on the water: sky from above, sun by elevation. */
    vec3 foamLight() {
      vec3 sunDir = normalize(uSunDirection);
      vec3 hemi = skyColourDiscless(vec3(0.0, 1.0, 0.0)) * 0.55 + skyColourDiscless(vec3(0.0, -0.2, 1.0)) * 0.2;
      vec3 sun = uSunColor * uSunIntensity * max(sunDir.y, 0.0) * 0.75;
      vec3 moon = uMoonColor * uMoonIntensity * max(normalize(uMoonDirection).y, 0.0) * 0.4;
      return clamp(hemi + sun + moon, 0.0, 1.0);
    }

    /** Depth colour, posterised into uBands flat steps when asked, edge resolved over a pixel. */
    vec3 bodyColour(float column) {
      float t = 1.0 - exp(-max(column, 0.0) / max(uShoreDepth, 0.01));
      if (uBands >= 1.5) {
        float x = t * uBands;
        float i = floor(x);
        float f = x - i;
        float e = max(fwidth(x), 0.02);
        t = clamp((i + smoothstep(1.0 - e, 1.0, f)) / (uBands - 1.0), 0.0, 1.0);
      }
      return mix(uShallow, uDeep, t);
    }

    vec4 persistAt(vec2 p) {
      vec2 puv = (p - uPersistMin) / uPersistSize;
      if (any(lessThan(puv, vec2(0.0))) || any(greaterThan(puv, vec2(1.0)))) return vec4(0.0);
      return texture2D(tPersist, puv);
    }

    // --- a waterfall's sheet -----------------------------------------------------
    void fallPixel(vec2 uv, vec3 view, float surfaceDistance) {
      float u = vUV.x;
      float v = vUV.y;
      float t = swayTime * uWaterMotion * uFallSpeed;
      // Streaks scroll down V, displaced by a slower noise; a second layer at two
      // thirds the speed for parallax; posterised to five steps.
      float wobble = valueNoise(vec2(u * 1.5 + 3.1, v * 2.0 - t * 0.3));
      float n1 = valueNoise(vec2(u * 3.0 + wobble * 0.6, (v - t) * 4.0));
      float n2 = valueNoise(vec2(u * 3.0 + 7.1, (v - t * 0.667) * 4.0 + 2.0));
      float n = n1 * 0.6 + n2 * 0.4;
      float ropes = 0.5 + 0.5 * sin(u * 18.0 + wobble * 2.0);
      n = mix(n, n * 0.75 + 0.25 * ropes, 0.35);
      n = floor(n * 5.0) / 4.0;
      vec3 light = foamLight();
      vec3 dark = mix(uDeep, uShallow, v);
      vec3 bright = mix(mix(uShallow, uFoam, 0.5), uFoam, v) * light;
      vec3 colour = mix(dark, bright, n);
      // The lip, where the water folds over the edge, and the dark line where the sheet leaves the bed.
      float lip = 1.0 - smoothstep(0.0, 0.06, v);
      colour = mix(colour, uFoam * light, lip * 0.8);
      float leave = bump(v, 0.06, 0.1, 0.01);
      colour *= 1.0 - 0.35 * leave;
      // The foot dissolves into white by a noise threshold; the last row is foam.
      float foot = smoothstep(0.82, 1.0, v + (n - 0.5) * 0.18);
      colour = mix(colour, uFoam * light, foot);
      // A little of the scene shows through the thin top of the sheet.
      vec3 behind = texture2D(tScene, uv).rgb;
      colour = mix(colour, behind, 0.18 * (1.0 - smoothstep(0.0, 0.5, v)) * (1.0 - lip));
      float haze = aerialAmount(-view, surfaceDistance);
      gl_FragColor = vec4(mix(colour, aerialAir(-view), haze), 1.0);
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / uResolution;
      vec3 toEye = cameraPosition - vWorld;
      float surfaceDistance = length(toEye);
      vec3 view = toEye / surfaceDistance;
      float bedDistance = sceneDistance(uv);
      vec3 bedPoint = scenePoint(uv);
      bool sea = uRegime > 2.5;
      bool flow = uRegime > 0.5 && uRegime < 1.5;
      bool still = uRegime < 0.5;

      if (uRegime > 1.5 && uRegime < 2.5) {
        if (bedDistance < surfaceDistance - 0.02) discard;
        fallPixel(uv, view, surfaceDistance);
        return;
      }

      vec4 fa = fieldA(vPlace);
      vec4 fb = fieldB(vPlace);
      float column = fa.x;
      float bank = fa.y;
      float stand = fa.w;
      vec2 current = fb.xy;
      float speed = length(current);
      float calm = fb.w;

      vec3 sunDir = normalize(uSunDirection);
      float sunUp = smoothstep(-0.02, 0.05, sunDir.y) * uSunIntensity;
      vec3 moonDir = normalize(uMoonDirection);
      float moonUp = smoothstep(-0.02, 0.05, moonDir.y) * uMoonIntensity;
      vec3 light = foamLight();

      float a0 = 0.0;
      float a = 0.0;
      float b = 0.0;
      float k = 1.0;
      float phi = 0.0;
      vec2 dir = vec2(1.0, 0.0);
      if (sea) {
        a0 = swellAmplitude(calm);
        trainAt(column, fb.z, a0, a, b, k, phi);
        dir = vec2(cos(fa.z), sin(fa.z));
      }
      float surf = smoothstep(0.85, 1.0, b);
      float since = sinceCrest(phi);
      vec4 persist = persistAt(vPlace);

      // --- wet sand -------------------------------------------------------------
      // A bed in front of the surface is not water. On a sea, within the runup,
      // it is sand the last wave darkened: the persistence buffer's green lane
      // remembers where the swash reached and dries back over seconds.
      float rise = bedPoint.y - uLevel;
      if (bedDistance < surfaceDistance - 0.02) {
        if (!sea || !gl_FrontFacing) discard;
        float runup = uRunup * a0;
        float wetness = max(persist.g, surf * (1.0 - smoothstep(runup * 0.7, runup * 1.3, rise)));
        if (runup <= 0.0 || rise >= runup * 1.4 || wetness <= 0.01) discard;
        vec3 sand = texture2D(tScene, uv).rgb;
        vec3 glance = skyColourDiscless(normalize(reflect(-view, vec3(0.0, 1.0, 0.0)) + vec3(0.0, 0.02, 0.0)));
        float graze = 0.02 + 0.98 * pow(1.0 - clamp(view.y, 0.0, 1.0), 5.0);
        vec3 wet = mix(sand * uWetBed, glance, graze * 0.8);
        gl_FragColor = vec4(mix(sand, wet, wetness), 1.0);
        return;
      }

      // --- agitation --------------------------------------------------------------
      float gust = gustAt(vPlace);
      float wind = (0.35 + 0.65 * gust) * uChop * uWaveScale * uWaterMotion * calm;
      float rushing = clamp(speed / 1.5, 0.0, 1.0);
      float agitation = sea ? wind : max(wind * (still ? 1.0 : 0.6), rushing);
      // Everything below is zero at the bank and in a dead calm.
      agitation *= smoothstep(0.0, 0.15, column);

      // --- the surface normal ---------------------------------------------------
      vec3 normal = normalize(vNormal);
      float swim = clamp(length(fwidth(vNormal.xz)) * 5.0, 0.0, 1.0);
      normal = normalize(mix(normal, vec3(0.0, 1.0, 0.0), swim));
      if (uFacet > 0.0) {
        vec3 face = normalize(cross(dFdx(vWorld), dFdy(vWorld)));
        if (face.y < 0.0) face = -face;
        normal = normalize(mix(normal, face, uFacet * (1.0 - swim)));
      }

      // The ripple field, sampled for its gradient.
      if (still && uRippleOn > 0.5) {
        vec2 ruv = (vPlace - uRippleMin) / uRippleSize;
        if (all(greaterThanEqual(ruv, vec2(0.0))) && all(lessThanEqual(ruv, vec2(1.0)))) {
          vec2 texel = 1.0 / vec2(textureSize(tRipple, 0));
          vec2 metres = uRippleSize * texel;
          float hx = texture2D(tRipple, ruv + vec2(texel.x, 0.0)).r - texture2D(tRipple, ruv - vec2(texel.x, 0.0)).r;
          float hz = texture2D(tRipple, ruv + vec2(0.0, texel.y)).r - texture2D(tRipple, ruv - vec2(0.0, texel.y)).r;
          float rippleSwim = clamp(fwidth(hx + hz) * 4.0, 0.0, 1.0);
          normal = normalize(normal + vec3(-hx / (2.0 * metres.x), 0.0, -hz / (2.0 * metres.y)) * (uWaveScale * uWaterMotion * (1.0 - rippleSwim) * (1.0 - vEdge)));
        }
      }

      // Fine ripple: streaked noise in a frame that runs with the water. Still
      // water drifts downwind; flowing water scrolls with the Valve crossfade, two
      // samples half a cycle apart weighted by a triangle so one is always sharp.
      vec2 windward = normalize(windDir + vec2(1e-4, 0.0));
      vec2 along = speed > 1e-3 ? current / speed : windward;
      float stretch = 1.0 + min(speed, 3.0) * 1.15;
      float lost;
      float n0;
      float nx;
      float nz;
      float e = 0.2;
      if (flow) {
        float cycle = 2.0;
        float t = swayTime * uWaterMotion;
        float f1 = fract(t / cycle);
        float f2 = fract(t / cycle + 0.5);
        float w1 = abs(f1 * 2.0 - 1.0);
        vec2 q1 = vPlace - current * (f1 * cycle) * 1.35;
        vec2 q2 = vPlace - current * (f2 * cycle) * 1.35;
        float l1;
        float l2;
        float s1 = streaks(q1, along, stretch, 1.35, l1);
        float s2 = streaks(q2, along, stretch, 1.35, l2);
        n0 = mix(s1, s2, w1);
        nx = mix(streaks(q1 + vec2(e, 0.0), along, stretch, 1.35, l1), streaks(q2 + vec2(e, 0.0), along, stretch, 1.35, l2), w1) - n0;
        nz = mix(streaks(q1 + vec2(0.0, e), along, stretch, 1.35, l1), streaks(q2 + vec2(0.0, e), along, stretch, 1.35, l2), w1) - n0;
        lost = max(l1, l2);
      } else {
        vec2 drift = windward * (0.3 * swayTime * uWaterMotion);
        vec2 rq = vPlace - drift;
        float l;
        n0 = streaks(rq, along, 1.0, 1.35, lost);
        nx = streaks(rq + vec2(e, 0.0), along, 1.0, 1.35, l) - n0;
        nz = streaks(rq + vec2(0.0, e), along, 1.0, 1.35, l) - n0;
      }
      normal = normalize(normal + vec3(-nx, 0.0, -nz) * (0.16 * agitation * (1.0 - lost) / e));

      // Riffle: a standing ripple fixed to the bed where the water is thin and
      // fast, its wavelength shortening with speed. Pool: deep and slow goes quiet.
      float riffle = 0.0;
      if (flow) {
        riffle = smoothstep(0.35, 0.12, column) * smoothstep(0.45, 1.0, speed);
        float wavelength = clamp(0.9 / max(speed, 0.3), 0.3, 1.2);
        float standing = sin(dot(vPlace, along) * 6.2831853 / wavelength + valueNoise(vPlace * 1.7) * 2.0);
        float sw = clamp(fwidth(standing) * 2.0, 0.0, 1.0);
        normal = normalize(normal + vec3(along.x, 0.0, along.y) * (standing * 0.35 * riffle * (1.0 - sw)));
      }

      // Wake behind what stands in the current: a pair of eddies gated by the
      // stand ramp read a little upstream, so the disturbance trails downstream.
      float wake = 0.0;
      if (flow && speed > 0.05) {
        float up1 = fieldA(vPlace - along * 1.2).w;
        float up2 = fieldA(vPlace - along * 2.6).w;
        wake = max(1.0 - smoothstep(0.0, 0.7, up1), 0.7 * (1.0 - smoothstep(0.0, 0.9, up2))) * smoothstep(0.15, 0.7, speed);
        vec2 acrossFlow = vec2(-along.y, along.x);
        float swirl = sin(dot(vPlace, acrossFlow) * 9.0 - swayTime * uWaterMotion * 4.0 * speed) * sin(dot(vPlace, along) * 4.0);
        normal = normalize(normal + vec3(acrossFlow.x, 0.0, acrossFlow.y) * (swirl * 0.25 * wake));
      }
      float alpha = mix(uRoughNear, uRoughFar, clamp(swim + lost, 0.0, 1.0));

      // --- seen from below ----------------------------------------------------
      // Snell's window is a cone about 49 degrees wide, cos = 0.661; outside it,
      // total internal reflection. The sun shows as a disc through the window.
      if (!gl_FrontFacing) {
        vec3 upward = -view;
        float facing = clamp(dot(normal, upward), 0.0, 1.0);
        float window = smoothstep(0.60, 0.71, facing);
        vec3 mirrored = uDeep;
        if (uReflections > 0.5) {
          vec3 down = reflect(upward, normal);
          down.y = min(down.y, -0.03);
          float found;
          float travelled;
          vec3 marched = marchReflection(vWorld, normalize(down), reflectJitter(floor(gl_FragCoord.xy)), found, travelled);
          mirrored = mix(uDeep, marched, found * exp(-travelled * 0.32));
        }
        vec3 seen = mix(mirrored, texture2D(tScene, uv).rgb, window);
        seen = mix(seen, uShallow, 0.26);
        // Leaving the water: the incident ray runs up from the eye, eta is water over air.
        vec3 bent = refract(upward, -normal, 1.333);
        float disc = pow(max(dot(bent, sunDir), 0.0), 240.0) * sunUp * window;
        seen = mix(seen, uSunColor, clamp(disc, 0.0, 1.0));
        float murk = 1.0 - exp(-surfaceDistance * uMurkDensity);
        vec3 scattered = mix(uDeep, uShallow, ${MURK_MIX.toFixed(2)});
        seen = mix(seen, scattered, murk * uSubmerged);
        gl_FragColor = vec4(seen, 0.0);
        return;
      }

      float thickness = max(bedDistance - surfaceDistance, 0.0);

      // --- under the water ------------------------------------------------------
      vec3 tilt = mat3(viewMatrix) * (normal - vec3(0.0, 1.0, 0.0));
      vec2 bent = uv + tilt.xy * (uRefract * min(thickness, 1.0) / surfaceDistance);
      vec3 bed = texture2D(tScene, sceneDistance(bent) > surfaceDistance ? bent : uv).rgb * (sea ? uWetBed : 1.0);
      float shallows = smoothstep(0.05, 0.3, thickness) * (1.0 - smoothstep(1.2, 2.4, thickness)) * sunUp;
      if (shallows > 0.0) {
        vec2 cp = bedPoint.xz;
        float cfoot = footprint(cp);
        vec2 scroll = (speed > 1e-3 ? current : vec2(0.18, 0.11)) * (swayTime * uWaterMotion);
        float c1 = 1.0 - abs(2.0 * valueNoise(cp * 0.9 + scroll) - 1.0);
        float c2 = 1.0 - abs(2.0 * valueNoise(cp * 1.9 - scroll * 1.4 + 7.3) - 1.0);
        c1 = mix(0.5, c1, resolvedWeight(cfoot * 0.9));
        c2 = mix(0.5, c2, resolvedWeight(cfoot * 1.9));
        bed *= 1.0 + c1 * c2 * uCaustics * shallows;
      }
      float opacity = 1.0 - exp(-thickness / max(uClarity, 0.01));
      vec3 body = bodyColour(column);
      vec3 below = mix(bed, body, opacity);

      // --- reflection -----------------------------------------------------------
      vec3 bounce = reflect(-view, normal);
      bounce.y = max(bounce.y, 0.015);
      bounce = normalize(bounce);
      vec3 sky = skyColourDiscless(bounce);
      vec3 reflection = sky;
      float hit = 0.0;
      if (uReflections > 0.5 && surfaceDistance < 120.0) {
        float found;
        float travelled;
        vec3 marched = marchReflection(vWorld, bounce, reflectJitter(floor(gl_FragCoord.xy)), found, travelled);
        reflection = mix(sky, marched, found);
        hit = found;
      }
      float fresnel = min(0.02 + 0.98 * pow(1.0 - clamp(dot(normal, view), 0.0, 1.0), 5.0), uMirror);
      vec3 colour = mix(below, reflection, fresnel);

      // Scatter through a raised crest the eye looks into: the sea's crests and a riffle.
      float crest = sea ? max(cos(phi + 0.5 * b * (1.0 - cos(phi))), 0.0) * smoothstep(0.0, 0.05, a) : riffle * 0.6;
      float sss = crest * pow(max(dot(-view, sunDir), 0.0), 4.0) * (1.0 - fresnel) * smoothstep(0.3, 1.0, thickness) * sunUp;
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
      // Four sources, every one a thing that happened: the bank, the crest, the
      // current, and what the persistence buffer remembers. Noise tears foam that
      // is there and never places foam that is not.
      float laceLost;
      float clumpLost;
      vec2 foamAlong = sea ? dir : along;
      vec2 drift = windward * (0.3 * swayTime * uWaterMotion);
      float lace = streaks(vPlace - drift * 0.5, foamAlong, 2.5, 0.9, laceLost);
      float clumps = streaks(vPlace - drift * 0.3, foamAlong, 1.5, 0.28, clumpLost);

      // 1. The bank: a wash line where the water rubs it, scaled by agitation.
      float bankFoam = 0.0;
      if (sea) {
        // The fringe against every piece of land alike, pulsing as each wave arrives.
        float pulse = 0.55 + 0.45 * smoothstep(0.0, 0.15, since) * (1.0 - smoothstep(0.15, 0.8, since));
        float reach = 0.7 + 0.7 * lace;
        float fringe = (1.0 - smoothstep(0.0, reach, max(bank, 0.0))) * pulse * step(0.0, bank) * smoothstep(0.0, 0.2, a0);
        // The sheet's edge over the sand: foam where the running water is thinnest.
        float sheetColumn = max(vWorld.y - bedPoint.y, 0.0);
        float sheet = (1.0 - step(0.0, bank)) * (1.0 - smoothstep(0.015, 0.09 + 0.08 * lace, sheetColumn));
        bankFoam = max(0.75 * fringe, 0.85 * sheet);
      } else {
        float rub = still ? smoothstep(0.2, 0.7, wind) : smoothstep(0.1, 0.8, speed);
        float washWidth = uWash * (0.7 + 0.6 * lace) * (1.0 + rushing * 0.9);
        bankFoam = (1.0 - smoothstep(0.0, washWidth, bank)) * step(0.0, bank) * rub * 0.9;
      }

      // 2. The crest: the sea's break and its wash, and whitecaps where the
      // Gerstner fold says the surface is actually steep.
      float crestFoam = 0.0;
      if (sea) {
        float s = fract(phi * 0.15915494 + 0.5) - 0.5;
        float pw = fwidth(phi) * 0.15915494 * 0.5;
        float cap = bump(s, -0.02, 0.13, max(0.03, pw));
        float runs = over(clumps, 0.42, 0.1, clumpLost);
        float breakFoam = surf * cap * (0.55 + 0.45 * runs) * smoothstep(0.0, 0.15, column);
        float decay = 1.0 - smoothstep(0.02, 0.55, since);
        float washFoam = surf * decay * over(lace, mix(0.35, 0.7, since), 0.08, laceLost) * smoothstep(-0.1, 0.1, column);
        float caps = smoothstep(0.3, 0.55, vFold) * over(clumps, 0.5, 0.1, clumpLost) * smoothstep(3.0, 8.0, column);
        crestFoam = max(breakFoam, max(0.6 * washFoam, 0.6 * caps));
      }

      // 3. The current: riffle speckle, a tongue behind every stand, a collar.
      float currentFoam = 0.0;
      {
        float speckle = riffle * over(clumps, 0.55, 0.08, clumpLost) * 0.7;
        float tongue = wake * over(lace, 0.45, 0.1, laceLost) * 0.8;
        float ring = 1.0 - smoothstep(0.0, uCollar * (0.8 + 0.4 * lace), stand);
        float collar = ring * (flow ? 0.85 * smoothstep(0.1, 0.6, speed) : 0.5 * smoothstep(0.1, 0.6, agitation));
        currentFoam = max(speckle, max(tongue, collar));
      }

      // 4. What moved: a hull, a wader, a fall's plunge, remembered and dispersing.
      float bufferFoam = persist.r;

      float foam = max(max(bankFoam, crestFoam), max(currentFoam, bufferFoam));
      float tearLost;
      float tear = streaks(vPlace - drift * 0.8, foamAlong, 1.8, 1.4, tearLost);
      foam *= 0.55 + 0.9 * tear;
      float aa = max(fwidth(foam) * 0.75, 0.015);
      float wash = smoothstep(0.28 - aa, 0.28 + aa, foam);
      float white = smoothstep(0.62 - aa, 0.62 + aa, foam);
      vec3 foamColour = mix(mix(uShallow, uFoam, 0.55), uFoam, white) * light;
      colour = mix(colour, foamColour, wash);

      // --- fog --------------------------------------------------------------------
      float own = mix(opacity, 1.0 - hit, fresnel);
      own = mix(own, 1.0, wash);
      float haze = aerialAmount(-view, surfaceDistance) * own;
      gl_FragColor = vec4(mix(colour, aerialAir(-view), haze), 1.0);
    }
  `,
});

(WATER_MATERIAL as { defaultAttributeValues?: Record<string, number[]> }).defaultAttributeValues = {
  aEdge: [0],
  aUV: [0, 0],
  aApron: [0],
};
