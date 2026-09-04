import * as THREE from 'three';
import { WATER_LAYER } from '../layers';
import { NOISE_GLSL } from '../engine/noise';
import { SKY_GLSL, skyUniforms } from '../engine/Sky';
import { AERIAL_AIR_GLSL, fogUniforms } from '../engine/fog';
import { REFLECT_GLSL } from '../engine/reflect';
import { windUniforms } from './sway';
import { bakeShore, deepWavenumber, wavenumber, G, GAMMA } from './shore';

// Stylized water: the shared material beside ART_MATERIAL and its finish
// variants, and GLOW_MATERIAL. Everything it does is a function of
// what is behind it, so it draws in the effect chain with the opaque pass's
// colour and depth bound as textures and the depth test done in the shader.
// Per-pool variation is per-vertex; colour is global.

/** Metres per quad, unless a caller says otherwise. See `waterPlane`. */
const SEGMENT = 0.5;

/**
 * Wavelengths in metres, and the amplitude of each train. Two crossing trains at
 * lengths that do not divide evenly, or the ridge line reads as corduroy. The
 * short one is bounded by the mesh: at `SEGMENT` metres per quad a 2.6 m wave
 * gets five vertices, which is about the least that still looks like a wave.
 */
const WAVE_LONG = 4.3;
const WAVE_SHORT = 2.6;
const AMP_LONG = 0.055;
const AMP_SHORT = 0.03;

/** Wavenumbers, and the speed each train travels over still water. */
const K_LONG = (2 * Math.PI) / WAVE_LONG;
const K_SHORT = (2 * Math.PI) / WAVE_SHORT;
/**
 * How fast each train moves when the water under it is still. Derived from the
 * angular frequencies the pools were tuned at, so a flow speed can be added to
 * it in the units it is authored in.
 */
const CELERITY_LONG = 1.05 / K_LONG;
const CELERITY_SHORT = 1.63 / K_SHORT;

/** The apron's rings: every `APRON_STEP` metres out to `APRON_DENSE`, then geometrically to the reach. */
const APRON_STEP = 4;
const APRON_DENSE = 100;
const APRON_FAR_RINGS = 5;
/** How fast the bed falls away under the apron, metres of column per metre out. */
const APRON_SHELF = 0.05;
/** Metres inside a sea plane's perimeter over which the crossed chop trains fade to nothing. */
const CHOP_FADE = 12;

/**
 * What the far field goes to underwater, blending deep toward shallow. Shared
 * with `engine/Underwater` — the two murk different pixels of the same frame.
 */
export const MURK_MIX = 0.42;

/**
 * The shared water material: one instance, for every pond in the game.
 * `depthTest` and `depthWrite` are both off by design. `transparent` is on for
 * its sorting effect only — the blending is off, because this shader composites
 * what is behind it itself, and back-to-front sorting is the answer the missing
 * depth test would have given.
 */
export const WATER_MATERIAL = new THREE.ShaderMaterial({
  name: 'Water',
  uniforms: {
    // The scene so far — opaque colour with the outline already on it — and the
    // depth it was drawn with. Bound per frame by `WaterEffect`.
    tScene: { value: null },
    tDepth: { value: null },
    uResolution: { value: new THREE.Vector2(1, 1) },
    uProjectionView: { value: new THREE.Matrix4() },
    uInverseProjectionView: { value: new THREE.Matrix4() },
    uFar: { value: 500 },

    /** Global wave amplitude. A look knob, not a per-pool one. */
    uWaveScale: { value: 1 },
    /** The reduced-motion switch, 0 or 1. Its own uniform, so turning wind sway off does not stop the ponds. It stops the noise scroll too. */
    uWaterMotion: { value: 1 },
    /** Whether the screen-space march runs at all. A real switch — see `Water.ts`. */
    uReflections: { value: 1 },

    // Set by `engine/Underwater`, which shares both of these — it imports this
    // material, so they live here.
    uSubmerged: { value: 0 },
    uMurkDensity: { value: 0.085 },

    uShallow: { value: new THREE.Color('#6d8f8a') },
    uDeep: { value: new THREE.Color('#1f3a41') },
    uFoam: { value: new THREE.Color('#e8f0f2') },
    /** Metres of column over which shore colour becomes deep colour. */
    uShoreDepth: { value: 1.1 },
    /** Metres of column that fully hides the bed. */
    uClarity: { value: 0.9 },
    /** Roughly how thin the water has to be to foam, in metres. */
    uFoamDepth: { value: 0.34 },

    /** Steepness (a·k) at which the shore train's crest is fully piled. */
    uSteep: { value: 0.2 },
    /** Microfacet roughness of the sun path: resolved ripple, and ripple filtered flat. */
    uRoughNear: { value: 0.02 },
    uRoughFar: { value: 0.3 },
    /** How much of the sun a facet aimed straight at it gives back. A look knob. */
    uGlitter: { value: 0.1 },
    /** Metres the surface rises at the shore as each wave arrives, per metre of swell amplitude. */
    uRunup: { value: 1.2 },
    /** What a backlit crest glows: the shallow colour brightened, until the owner says otherwise. */
    uScatter: { value: new THREE.Color('#93c1ba') },
    /** How far the surface tilt bends the bed seen through it. A look knob. */
    uRefract: { value: 0.6 },
    /** How bright the caustics on a sunlit bed get. */
    uCaustics: { value: 0.55 },

    // Distance fog, filled by the renderer because `fog` is true below.
    ...THREE.UniformsUtils.clone(THREE.UniformsLib.fog),

    // The wind field, shared with every plant in the world. Not copied: the gust
    // bending the reeds is the gust roughening the pond.
    ...windUniforms,

    // And the sky's own, so the reflection asks the same dome what colour it is
    // in a direction. A cloned set would be a second sky.
    ...skyUniforms,
    ...fogUniforms,
  },
  // The renderer fills `fogColor`, `fogNear` and `fogFar` from the scene's fog.
  // The shader applies them by hand: only part of this pixel is the water's to fog.
  fog: true,
  transparent: true,
  blending: THREE.NoBlending,
  depthTest: false,
  depthWrite: false,
  // Seen from underneath the moment anybody wades in.
  side: THREE.DoubleSide,

  vertexShader: /* glsl */ `
    attribute float aChop;
    attribute vec2 aFlow;
    // Still column (m), wave phase (rad), and the unit direction the shore train travels.
    attribute vec4 aShore;
    // The swell's deep-water wavenumber and amplitude, the wavenumber at this
    // column, and how much of the crossed chop trains this mesh carries.
    attribute vec4 aSwell;

    uniform sampler2D gustField;
    uniform vec2 windDir;
    uniform float windLagScale;
    uniform float windHalfSpan;
    uniform float swayTime;
    uniform float uWaveScale;
    uniform float uWaterMotion;
    uniform float uSteep;
    uniform float uRunup;

    varying vec3 vWorld;
    varying vec3 vSurfaceNormal;
    /** This vertex's chop, after the gust and the global scale. */
    varying float vChop;
    /** Where on the chop this vertex sits, -1 in a trough to 1 on a crest. */
    varying float vCrest;
    /** Which way the surface is travelling, m/s, for the fragment stage. */
    varying vec2 vFlow;
    /** The authored flow speed. Zero on a pond, and the fragment stage cares. */
    varying float vStreak;
    /** The shore train's breaking ratio, 0 unbroken to 1 saturated. */
    varying float vBreak;
    /** The shore train's phase; the crest is at 0 mod 2π and the front face follows. */
    varying float vPhase;
    /** How much of a raised crest this is, 0..1. */
    varying float vSurf;
    /** The still level, world y, before any wave lifted this vertex. */
    varying float vLevel;
    /** The swell's amplitude after the global scale, the motion switch and the tongue, metres. */
    varying float vRunup;
    /** The still column at this vertex, metres; zero or less over the sand. */
    varying float vColumn;
    /** The way the shore train travels, world xz. */
    varying vec2 vDir;

    ${NOISE_GLSL}

    void main() {
      vec3 world = (modelMatrix * vec4(position, 1.0)).xyz;

      // The same lookup the plants do, texel for texel: how far downwind this
      // point stands decides which gust it is in. See art/sway.ts, which owns the
      // window and rebuilds it from the audio weather every frame.
      float lag = dot(world.xz, windDir) * windLagScale;
      float u = clamp(0.5 - lag / (2.0 * windHalfSpan), 0.0, 1.0);
      float gust = texture2D(gustField, vec2(u, 0.5)).r;

      // Never all the way to nothing: water in a lull is calmer, not glass.
      // uWaterMotion is the accessibility switch, and it is a hard zero.
      float chop = aChop * uWaveScale * uWaterMotion * (0.35 + 0.65 * gust);

      // Flowing water carries its own direction and speed in aFlow; still water
      // answers the wind, which is what every pond does.
      float rate = length(aFlow);
      // Two trains, crossed at about fifty degrees. The first runs with the
      // water; the second is it, rotated, so both turn together.
      vec2 d1 = rate > 0.001 ? aFlow / rate : normalize(windDir + vec2(1e-4, 0.0));
      vec2 d2 = vec2(d1.x * 0.62 - d1.y * 0.78, d1.x * 0.78 + d1.y * 0.62);

      float k1 = ${K_LONG.toFixed(5)};
      float k2 = ${K_SHORT.toFixed(5)};
      // Phase speed is the train's own celerity plus the speed of the water under
      // it, projected onto that train's direction. No flow is the still-water phase.
      float p1 = (dot(world.xz, d1) - swayTime * (${CELERITY_LONG.toFixed(4)} + dot(aFlow, d1))) * k1;
      float p2 = (dot(world.xz, d2) - swayTime * (${CELERITY_SHORT.toFixed(4)} + dot(aFlow, d2))) * k2;

      // The chop as displacement only where the mesh can carry it; as ripple and
      // agitation it runs on everywhere, so a coarse apron looks like its neighbour.
      float a1 = ${AMP_LONG.toFixed(3)} * chop * aSwell.w;
      float a2 = ${AMP_SHORT.toFixed(3)} * chop * aSwell.w;
      float height = a1 * sin(p1) + a2 * sin(p2);

      // Plain sines, so the slope is exact: the derivative of a sine is a cosine,
      // and the surface normal is most of what water looks like.
      vec2 slope = d1 * (a1 * k1 * cos(p1)) + d2 * (a2 * k2 * cos(p2));

      // --- the shore train ----------------------------------------------------
      // One Gerstner wave: the swell in deep water, shoaling as the bed comes up.
      float h = aShore.x;
      float k0 = aSwell.x;
      float a0 = aSwell.y * uWaveScale * uWaterMotion;
      float k = max(aSwell.z, 1e-4);
      vec2 dir = aShore.zw;
      float b = 0.0;
      float phi = 0.0;
      float lift = 0.0;
      vec2 shift = vec2(0.0);
      float surf = 0.0;
      float swash = a0;
      if (k0 > 0.0) {
        float omega = sqrt(${G.toFixed(2)} * k0);
        float kh = clamp(k * h, 1e-3, 10.0);
        // Green's law: the amplitude grows as the group velocity falls.
        float shoal = h > 0.0 ? sqrt((k / k0) / (1.0 + 2.0 * kh / sinh(2.0 * kh))) : 0.0;
        float cap = ${(GAMMA / 2).toFixed(2)} * max(h, 0.0);
        float raw = a0 * shoal;
        b = a0 > 0.0 ? (h > 0.0 ? clamp(raw / max(cap, 1e-4), 0.0, 1.0) : 1.0) : 0.0;
        float a = min(raw, cap);
        phi = aShore.y - omega * swayTime * uWaterMotion;

        float steep = clamp(a * k / uSteep, 0.0, 1.0);
        // A breaking crest leans the way it travels: the front face is compressed
        // in phase and the back stretched, by the same even term.
        float lean = 0.5 * b;
        float phis = phi + lean * (1.0 - cos(phi));
        float dphis = 1.0 + lean * sin(phi);
        float cs = cos(phis);
        float sn = sin(phis);
        // Gerstner: the crest at phi = 0, and the front face (phi > 0) pulled back
        // against dir, which is the way the wave travels. Q·a·k stays under 0.6.
        float sweep = 0.6 * steep / k;
        shift = -dir * (sweep * sn);
        lift = a * cs;
        float tx = 1.0 - sweep * k * cs * dphis;
        float ty = -a * k * sn * dphis;
        slope += dir * (ty / max(tx, 0.1));
        surf = max(cs, 0.0) * smoothstep(0.0, 0.05, a);

        // The swash: the surface rises as each wave arrives, fast up and slow to
        // drain, and carries on over the sand as one sheet. The runup varies
        // along the shore and per wave, so the sheet's edge is tongues.
        float since = fract(-phi * 0.15915494);
        float surge = smoothstep(0.0, 0.3, since) * (1.0 - smoothstep(0.3, 1.0, since));
        vec2 across = vec2(-dir.y, dir.x);
        float wave = floor(-phi * 0.15915494);
        float tongue = valueNoise(vec2(dot(world.xz, across) * 0.3, wave * 0.618 + 3.7));
        swash = a0 * (0.65 + 0.7 * tongue);
        float runup = uRunup * swash;
        lift += runup * surge * (1.0 - smoothstep(0.0, 2.0 * runup, h));
      }

      vLevel = world.y;
      vRunup = swash;
      vColumn = h;
      vDir = dir;
      world.xz += shift;
      world.y += height + lift;
      vWorld = world;
      vSurfaceNormal = normalize(vec3(-slope.x, 1.0, -slope.y));
      vChop = chop;
      vCrest = height / max(a1 + a2, 1e-4);
      vBreak = b;
      vPhase = phi;
      vSurf = surf;
      // What the fragment stage advects its noise along. Still water still drifts
      // downwind — a surface pattern nailed to the world reads as ice.
      vFlow = rate > 0.001 ? aFlow : windDir * 0.25;
      // Zero on still water, which is what keeps a pond from looking combed.
      vStreak = rate;

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
    uniform float uSubmerged;
    uniform float uMurkDensity;
    uniform vec3 uShallow;
    uniform vec3 uDeep;
    uniform vec3 uFoam;
    uniform float uShoreDepth;
    uniform float uClarity;
    uniform float uFoamDepth;
    uniform float uRoughNear;
    uniform float uRoughFar;
    uniform float uGlitter;
    uniform float uRunup;
    uniform vec3 uScatter;
    uniform float uRefract;
    uniform float uCaustics;

    uniform vec2 windDir;
    uniform float swayTime;
    uniform float uWaterMotion;

    uniform vec3 fogColor;
    uniform float fogNear;
    uniform float fogFar;

    varying vec3 vWorld;
    varying vec3 vSurfaceNormal;
    varying float vChop;
    varying float vCrest;
    varying vec2 vFlow;
    varying float vStreak;
    varying float vBreak;
    varying float vPhase;
    varying float vSurf;
    varying float vLevel;
    varying float vRunup;
    varying float vColumn;
    varying vec2 vDir;

    ${NOISE_GLSL}
    ${SKY_GLSL}
    ${AERIAL_AIR_GLSL}

    /**
     * How far along the camera ray the scene stops, at a screen position. By
     * unprojection, so the result is a length between two world points and a
     * distance along the ray by construction. Sky comes back as the far plane.
     */
    float sceneDistance(vec2 uv) {
      float d = texture2D(tDepth, uv).r;
      if (d >= 0.9999) return uFar;
      vec4 p = uInverseProjectionView * vec4(uv * 2.0 - 1.0, d * 2.0 - 1.0, 1.0);
      return length(p.xyz / p.w - cameraPosition);
    }

    /** Where the scene stops, at a screen position, in world space. */
    vec3 scenePoint(vec2 uv) {
      float d = texture2D(tDepth, uv).r;
      vec4 p = uInverseProjectionView * vec4(uv * 2.0 - 1.0, d * 2.0 - 1.0, 1.0);
      return p.xyz / p.w;
    }

    ${REFLECT_GLSL}

    /** How much of a noise octave the pixel resolves, from the cells it spans. */
    float resolved(float cellsPerPixel) {
      return 1.0 - smoothstep(0.15, 0.4, cellsPerPixel);
    }

    /** The pixel's span in a coordinate's own units: its longer screen derivative. */
    float span(vec2 p) {
      return max(length(dFdx(p)), length(dFdy(p)));
    }

    // Two scales of value noise, each pulled to its mean as the pixel outgrows
    // it; lost is the amplitude that took out. Filtered by the coordinate's
    // footprint, never by the noise's own derivative, which is random sub-pixel.
    float ripple(vec2 p, float foot, out float lost) {
      float w1 = resolved(foot);
      float w2 = resolved(foot * 2.17);
      lost = 0.66 * (1.0 - w1) + 0.34 * (1.0 - w2);
      return 0.5 + (valueNoise(p) - 0.5) * (0.66 * w1) + (valueNoise(p * 2.17 + 11.3) - 0.5) * (0.34 * w2);
    }

    // A frame that runs with the water and is squeezed along it, so the noise
    // drawn in it comes out as streaklines that bend with the flow.
    vec2 frame(vec2 p, vec2 along, float stretch, float scale) {
      vec2 across = vec2(-along.y, along.x);
      return vec2(dot(p, along) / stretch, dot(p, across)) * scale;
    }

    float streaked(vec2 p, vec2 along, float stretch, float scale, out float lost) {
      vec2 q = frame(p, along, stretch, scale);
      return ripple(q, span(q), lost);
    }

    // Above a threshold with an authored shoulder, resolved over the pixel and
    // over the spread the filter removed, so a field pulled to its mean gives
    // the fraction that would have been over, not a step at the mean.
    float over(float field, float at, float half_, float lost) {
      float w = max(half_, max(fwidth(field) * 0.6, lost * 0.5));
      return smoothstep(at - w, at + w, field);
    }

    float edge(float x, float at, float w) {
      return smoothstep(at - w, at + w, x);
    }

    /** The smaller of two steps, sign kept: a jump on one side is not a slope. */
    vec3 lesser(vec3 a, vec3 b) {
      return dot(a, a) < dot(b, b) ? a : b;
    }

    /** Integral to t of a fringe that is 1 at zero and thins to nothing at width. */
    float fringeArea(float t, float width) {
      t = clamp(t, 0.0, width);
      return t - t * t / (2.0 * width);
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

      // The depth test, done by hand: everything opaque was drawn before this pass
      // and its distance is in tDepth. The centimetre of slack keeps a bed that
      // breaks the surface from flickering along its own waterline.
      float bedDistance = sceneDistance(uv);
      vec3 bedPoint = scenePoint(uv);
      // How far the bed stands above the still level, metres.
      float rise = bedPoint.y - vLevel;
      if (bedDistance < surfaceDistance - 0.02) {
        // --- wet sand -------------------------------------------------------------
        // The bed in front of the surface but within the swash's reach is wet
        // sand: darkened, and glancing the sky the way the sheet beside it
        // does, so the sheet's edge is a fringe and not a step. Everywhere else
        // the discard stands.
        float runup = smoothstep(0.9, 1.0, vBreak) * vRunup * uRunup;
        if (runup <= 0.0 || !gl_FrontFacing || rise >= runup * 1.25) discard;
        vec3 sand = texture2D(tScene, uv).rgb;
        float dry = smoothstep(runup * 0.8, runup * 1.25, rise);
        vec3 glance = skyColourDiscless(normalize(reflect(-view, vec3(0.0, 1.0, 0.0)) + vec3(0.0, 0.02, 0.0)));
        float graze = 0.02 + 0.98 * pow(1.0 - clamp(view.y, 0.0, 1.0), 5.0);
        vec3 wet = mix(sand * 0.6, glance, graze * 0.8);
        gl_FragColor = vec4(mix(wet, sand, dry), 1.0);
        return;
      }

      // How much water the eye is looking through, in metres. Everything below
      // is a function of this number.
      float thickness = max(bedDistance - surfaceDistance, 0.0);

      // The bed one pixel over on each axis, by the smaller step, so a rock's
      // silhouette beside this pixel is an edge and not a slope. Per pixel, not
      // per quad: a derivative of a depth sample is a block at every edge.
      vec2 texel = 1.0 / uResolution;
      vec3 dBx = lesser(
        scenePoint(uv + vec2(texel.x, 0.0)) - bedPoint,
        bedPoint - scenePoint(uv - vec2(texel.x, 0.0))
      );
      vec3 dBy = lesser(
        scenePoint(uv + vec2(0.0, texel.y)) - bedPoint,
        bedPoint - scenePoint(uv - vec2(0.0, texel.y))
      );
      // Metres of thickness one pixel spans, metres of bed it spans, and the
      // bed's slope under it.
      float bedNear = length(bedPoint - cameraPosition);
      float gx = length(bedPoint + dBx - cameraPosition) - bedNear - dFdx(surfaceDistance);
      float gy = length(bedPoint + dBy - cameraPosition) - bedNear - dFdy(surfaceDistance);
      float thicknessSpan = length(vec2(gx, gy));
      float bedFoot = max(length(dBx.xz), length(dBy.xz));
      float bedSlope = max(
        abs(dBx.y) / max(length(dBx.xz), 1e-3),
        abs(dBy.y) / max(length(dBy.xz), 1e-3)
      );

      // --- the surface normal ------------------------------------------------
      // The wave slope from the vertex stage, plus fine ripple that would need a
      // much denser mesh to carry as displacement. Gradient by finite difference.
      //
      // stream is how far the surface has carried its own pattern, in metres, and
      // every noise lookup below is offset by it — which is what makes flowing
      // water read as flowing. It grows without bound, so float32 coarsens the
      // hash after twenty-odd minutes on one fast channel.
      vec2 stream = vFlow * (swayTime * uWaterMotion);

      // The frame the surface pattern is drawn in. Still water gets a stretch of
      // exactly 1: a pond that looked combed downwind would be the worse lie.
      float carried = length(vFlow);
      vec2 along = carried > 1e-4 ? vFlow / carried : vec2(1.0, 0.0);
      float stretch = 1.0 + min(vStreak, 3.0) * 1.15;

      // How broken the surface is, which is not the same as how big its waves are.
      // A race carries almost no swell, because a channel that turns shears the
      // phase — so speed drives the surface break directly here rather than
      // through the vertex stage.
      float rushing = min(vStreak, 3.0) / 3.0;
      float agitation = max(vChop, rushing * 1.15);

      // Filtered to the pixel: a pattern finer than a pixel is drawn as its mean
      // over the pixel, never as one sample of it.
      vec3 normal = normalize(vSurfaceNormal);
      float swim = clamp(length(fwidth(vSurfaceNormal.xz)) * 5.0, 0.0, 1.0);
      normal = normalize(mix(normal, vec3(0.0, 1.0, 0.0), swim));
      float rippleSwim = 0.0;
      vec2 rq = vWorld.xz - stream * 1.35;
      float rippleFoot = span(frame(rq, along, stretch, 1.35));
      if (agitation > 0.002) {
        float e = 0.18;
        float lost;
        float n0 = ripple(frame(rq, along, stretch, 1.35), rippleFoot, lost);
        float nx = ripple(frame(rq + vec2(e, 0.0), along, stretch, 1.35), rippleFoot, lost) - n0;
        float nz = ripple(frame(rq + vec2(0.0, e), along, stretch, 1.35), rippleFoot, lost) - n0;
        // Small. This tilts the normal, which decides both the fresnel weight and
        // where the reflection ray goes, so past about ten degrees the reflected
        // image stops being a reflection. Ripple is a few degrees of scatter.
        rippleSwim = lost;
        normal = normalize(normal + vec3(-nx, 0.0, -nz) * (0.16 * agitation / e));
      }
      // What the filtering took out of the normal goes into the roughness, so a
      // sea filtered flat at range still glitters under the sun.
      float alpha = mix(uRoughNear, uRoughFar, clamp(swim + rippleSwim, 0.0, 1.0));

      vec3 sunDir = normalize(uSunDirection);
      float sunUp = smoothstep(-0.02, 0.05, sunDir.y) * uSunIntensity;
      vec3 moonDir = normalize(uMoonDirection);
      float moonUp = smoothstep(-0.02, 0.05, moonDir.y) * uMoonIntensity;

      // --- seen from below ----------------------------------------------------
      //
      // A different surface, not a fainter one: every term above assumes the eye
      // is in air. Snell's window is a cone about 49 degrees wide,
      // cos = sqrt(1 - 1/1.333^2) = 0.661; outside it, total internal reflection.
      if (!gl_FrontFacing) {
        vec3 upward = -view;
        float facing = clamp(dot(normal, upward), 0.0, 1.0);
        float window = smoothstep(0.60, 0.71, facing);

        vec3 mirrored = uDeep;
        if (uReflections > 0.5) {
          vec3 down = reflect(upward, normal);
          // Never let a grazing ray run flat along the underside of the surface,
          // where it would march for fifty metres and find whatever is at the
          // far end of the pool.
          down.y = min(down.y, -0.03);
          float found;
          float travelled;
          vec3 marched = marchReflection(
            vWorld,
            normalize(down),
            reflectJitter(floor(gl_FragCoord.xy)),
            found,
            travelled
          );
          // Absorbed with distance, unlike the air side: without this, grazing
          // TIR marches twenty metres and returns crisp bright sand.
          mirrored = mix(uDeep, marched, found * exp(-travelled * 0.32));
        }

        vec3 seen = mix(mirrored, texture2D(tScene, uv).rgb, window);
        seen = mix(seen, uShallow, 0.26);

        // This surface murks itself: the depth buffer has no water in it, so the
        // underwater pass has no distance for these pixels. Same density and far
        // colour, so the two converge at range with no seam.
        float murk = 1.0 - exp(-surfaceDistance * uMurkDensity);
        vec3 scattered = mix(uDeep, uShallow, ${MURK_MIX.toFixed(2)});
        seen = mix(seen, scattered, murk * uSubmerged);

        // Alpha zero: nothing left for the underwater pass to do here.
        gl_FragColor = vec4(seen, 0.0);
        return;
      }

      // --- what is under the water -------------------------------------------
      // The bed is read where the tilted surface bends the ray, but only if what
      // is there is still behind the surface: nothing above the water bends.
      vec3 tilt = mat3(viewMatrix) * (normal - vec3(0.0, 1.0, 0.0));
      vec2 bent = uv + tilt.xy * (uRefract * min(thickness, 1.0) / surfaceDistance);
      vec3 bed = texture2D(tScene, sceneDistance(bent) > surfaceDistance ? bent : uv).rgb;
      // Sand under the surf is as wet as the sand the sheet leaves behind.
      bed *= mix(1.0, 0.6, smoothstep(0.9, 1.0, vBreak));

      // Caustics: two octaves of ridged noise on the bed, scrolled two ways, in
      // the shallows under a sun, each pulled to its mean as the pixel outgrows it.
      float shallows = smoothstep(0.05, 0.3, thickness) * (1.0 - smoothstep(1.2, 2.2, thickness)) * sunUp;
      if (shallows > 0.0) {
        vec2 cp = bedPoint.xz;
        vec2 scroll = vec2(0.18, 0.11) * (swayTime * uWaterMotion);
        float c1 = 1.0 - abs(2.0 * valueNoise(cp * 0.9 + scroll) - 1.0);
        float c2 = 1.0 - abs(2.0 * valueNoise(cp * 1.9 - scroll * 1.4 + 7.3) - 1.0);
        c1 = mix(0.5, c1, resolved(bedFoot * 0.9));
        c2 = mix(0.5, c2, resolved(bedFoot * 1.9));
        bed *= 1.0 + c1 * c2 * uCaustics * shallows;
      }
      // Beer-Lambert on the column, the same shape the fog volumes use: the bed
      // does not vanish at a threshold, it fades out at a rate.
      float opacity = 1.0 - exp(-thickness / max(uClarity, 0.01));
      vec3 body = mix(uShallow, uDeep, 1.0 - exp(-thickness / max(uShoreDepth, 0.01)));
      vec3 below = mix(bed, body, opacity);

      // --- reflection ---------------------------------------------------------
      vec3 bounce = reflect(-view, normal);
      // A wave normal at a grazing angle can send the ray below the horizon,
      // where the sky shader returns ground colour and the march finds the
      // floor at the camera's feet. Neither is a reflection of anything.
      bounce.y = max(bounce.y, 0.015);
      bounce = normalize(bounce);

      // No disc: the sun's image on the water is the glitter term below.
      vec3 sky = skyColourDiscless(bounce);
      vec3 reflection = sky;
      float hit = 0.0;
      // Past 120 m the march finds nothing a sky lookup does not.
      if (uReflections > 0.5 && surfaceDistance < 120.0) {
        float found;
        float travelled;
        vec3 marched = marchReflection(
          vWorld,
          bounce,
          reflectJitter(floor(gl_FragCoord.xy)),
          found,
          travelled
        );
        reflection = mix(sky, marched, found);
        hit = found;
      }

      // Schlick, with water's own 0.02 at normal incidence: looking straight down
      // you see the bed, looking along the pool you see the sky.
      float fresnel = clamp(
        0.02 + 0.98 * pow(1.0 - clamp(dot(normal, view), 0.0, 1.0), 5.0),
        0.0,
        1.0
      );

      vec3 colour = mix(below, reflection, fresnel);

      // Scatter through the crest: the sun through the upper face of a raised
      // wave when the eye looks into it, and never with sand right behind it.
      float sss = vSurf * pow(max(dot(-view, sunDir), 0.0), 4.0) * (1.0 - fresnel)
        * smoothstep(0.3, 1.0, thickness) * sunUp;
      colour = mix(colour, uScatter, clamp(sss * 0.7, 0.0, 1.0));

      // --- the sun path -------------------------------------------------------
      if (sunUp > 0.0) {
        float g = glitter(normal, view, sunDir, alpha) * uGlitter * sunUp;
        colour = mix(colour, uSunColor, clamp(g, 0.0, 1.0));
      }
      if (moonUp > 0.0) {
        float g = glitter(normal, view, moonDir, alpha) * uGlitter * moonUp;
        colour = mix(colour, uMoonColor, clamp(g, 0.0, 1.0));
      }

      // --- foam ---------------------------------------------------------------
      // Two bands and two flat colours, thresholded over one pixel: the quantizer
      // bands a gradient anyway, so the bands are authored where they belong.
      // Every term below is resolved at the pixel: its noise band-limited, its
      // edges at least a pixel wide, and where it is thinner than a pixel it is
      // drawn at the coverage it has, never widened to a line.

      // --- the waterline --------------------------------------------------------
      float lapLost;
      float lap = streaked(vWorld.xz - stream * 0.85, along, stretch, 0.55, lapLost);
      // Fast water is aerated, and aerated water is white further out: the band a
      // race foams over is nearly twice a pond's.
      float band = uFoamDepth * (0.45 + 1.1 * lap) * (1.0 + rushing * 0.95);
      if (vRunup > 0.0) {
        // On a sea the rim is a line along the waterline and never a field over
        // a flat: it reaches under a metre across the bed, which on a bed of
        // slope s seen at elevation e is a thickness of reach * s / sin(e).
        float reach = 0.4 * (0.45 + 1.1 * lap);
        band = min(band, reach * bedSlope / max(view.y, 0.05));
      }
      // The rim is a fringe, dense against the bed and thinning outward, drawn
      // as its mean over the thickness this pixel spans: white only where it
      // stands several pixels tall, and a pale line where it is thinner.
      float halfSpan = max(thicknessSpan * 0.5, 1e-3);
      band = max(band, 1e-4);
      float shore = clamp(
        (fringeArea(thickness + halfSpan, band) - fringeArea(thickness - halfSpan, band)) / (2.0 * halfSpan),
        0.0,
        1.0
      );

      // --- surf ---------------------------------------------------------------
      // Foam comes off the shore train; the noise tears it, never places it.
      // cycle is 0 at the crest and positive down the front face; since is how
      // long ago the crest went by, in periods.
      float cycle = fract(vPhase * 0.15915494 + 0.5) - 0.5;
      float since = fract(-vPhase * 0.15915494);
      // Half a pixel, in periods.
      float pw = fwidth(vPhase) * 0.15915494 * 0.5;
      // Broken water streaks the way the wave travels, so the noise frame is
      // stretched along vDir: fine streaks, and the clumps that gap a crest.
      vec2 travel = normalize(vDir + vec2(1e-4, 0.0));
      float streakLost;
      float clumpLost;
      float streak = streaked(vWorld.xz - stream * 0.6, travel, 3.0, 0.9, streakLost);
      float clumps = streaked(vWorld.xz - stream * 0.35, travel, 1.6, 0.25, clumpLost);
      float breaking = smoothstep(0.85, 1.0, vBreak);
      // The lip: a white core on the crest and the top of the front face, a
      // pale skirt tumbling down the face, in runs with gaps between. Each
      // window's edges are at least half a pixel wide, so a crest a pixel
      // across is a fainter line and not a brighter one.
      float core = max(edge(cycle, -0.01, max(0.01, pw)) - edge(cycle, 0.06, max(0.02, pw)), 0.0);
      float apron = max(edge(cycle, -0.03, max(0.02, pw)) - edge(cycle, 0.14, max(0.06, pw)), 0.0);
      float runs = over(clumps, 0.46, 0.06, clumpLost);
      float lip = breaking * runs * smoothstep(0.0, 0.1, vColumn) * max(
        core * over(streak, 0.375, 0.125, streakLost),
        apron * 0.55 * over(streak, 0.5, 0.1, streakLost)
      );
      // The wash: what the breaker leaves behind it, thinning away before the
      // next crest, and never white. Streaked lace that opens hole-first, the
      // threshold rising as it decays.
      float decay = 1.0 - smoothstep(0.0, 0.45, since);
      float laceField = streak * 0.7 + clumps * 0.3;
      float lace = over(laceField, mix(0.4, 0.73, since), 0.05, streakLost * 0.7 + clumpLost * 0.3);
      // Over the sand the sheet's foam is its edge alone.
      float trail = 0.6 * smoothstep(0.9, 1.0, vBreak) * decay * lace * smoothstep(-0.05, 0.05, vColumn);
      float breaker = max(lip, trail);
      // How far into the surf zone this is, for anything that stops there.
      float surfZone = smoothstep(0.4, 0.85, vBreak);

      // --- whitecaps ------------------------------------------------------------
      // Out in deep water the wind tears the odd crest: sparse patches placed by
      // noise, sitting on a crest where there is one, never on every one.
      float capLostA;
      float capLostB;
      float capField = streaked(vWorld.xz - stream * 1.1, along, stretch, 0.22, capLostA) * 0.55
        + streaked(vWorld.xz - stream * 1.7, along, stretch, 1.2, capLostB) * 0.3
        + max(vCrest, 0.0) * 0.15;
      float cap = over(capField, 0.72, 0.06, capLostA * 0.55 + capLostB * 0.3)
        * smoothstep(0.35, 0.95, agitation) * (1.0 - surfZone);

      float foam = max(shore, max(breaker, cap));

      float aa = fwidth(foam) * 0.75;
      float wash = smoothstep(0.28 - aa, 0.28 + aa, foam);
      float white = smoothstep(0.68 - aa, 0.68 + aa, foam);
      // The paler band is mixed from the shore colour rather than authored, so
      // the two never drift apart when the palette is tuned.
      vec3 foamColour = mix(mix(uShallow, uFoam, 0.55), uFoam, white);
      colour = mix(colour, foamColour, wash);

      // --- fog ----------------------------------------------------------------
      // Only the part of this pixel that is ours gets fogged: the bed came out of
      // tScene already fogged for its own distance, and so did anything the
      // reflection march found.
      float own = mix(opacity, 1.0 - hit, fresnel);
      own = mix(own, 1.0, wash);
      // The same air as the rest of the world, from the same functions - see
      // engine/fog.ts. No backticks in here: this is a template literal, and one
      // inside a comment would end it mid-GLSL. The view vector points at the eye,
      // and the air is measured going the other way.
      float haze = aerialAmount(-view, surfaceDistance) * own;

      gl_FragColor = vec4(mix(colour, aerialAir(-view), haze), 1.0);
    }
  `,
});

// A geometry without the attribute would read whatever the last draw left in the
// slot, exactly as the sway weight would. Nothing but `waterPlane` builds water,
// and it always sets every one.
(WATER_MATERIAL as { defaultAttributeValues?: Record<string, number[]> }).defaultAttributeValues = {
  aChop: [0],
  aFlow: [0, 0],
  aShore: [0, 0, 0, 0],
  aSwell: [0, 0, 0, 1],
};

/** The long offshore train. `direction` is the way it travels, world xz. */
export interface Swell {
  direction: readonly [number, number];
  /** Wavelength, metres. */
  length: number;
  /** Crest to trough, metres. */
  height: number;
}

export interface WaterPlaneOptions {
  /** Extent along X and Z, in metres. */
  width: number;
  depth: number;
  /** Where the middle of the surface sits, in the zone's space. The plane places itself, because `flow` is authored in world coordinates and evaluated per vertex. */
  at: THREE.Vector3;
  /**
   * How rough this water is: 0 is a mirror, 1 the full wind-driven chop, and
   * above 1 is a swell rather than a ripple — 2.5 is a quarter-metre wave. A
   * function makes a beach, evaluated per vertex in world coordinates.
   */
  chop?: number | ((x: number, z: number) => number);
  /**
   * How fast the water is going and which way, in metres per second. Omitted,
   * the surface is still and answers the wind. A function makes a race that
   * turns a corner, which is why this is an attribute. A flow field that turns
   * sharply shears the wave phase between vertices, so keep the turn gentle.
   */
  flow?: THREE.Vector2 | ((x: number, z: number) => THREE.Vector2);
  /** Metres per quad. Finer than the shortest wave, or the wave is a zigzag. */
  segment?: number;
  /** Metres the surface runs on past its rectangle as a coarse apron, on the sea side only. The apron carries the perimeter's chop and flow. */
  reach?: number;
  /** The swell, and with it the shore train it shoals into. Needs `groundAt`. */
  swell?: Swell;
  /** Ground height at a world x, z: what the shore bake and the apron's land test read. */
  groundAt?: (x: number, z: number) => number;
}

/**
 * A body of water, placed like any other prop. `WATER_LAYER` is set rather than
 * enabled, which takes it out of the opaque pass, the normal pass and the shadow
 * map in one line; `noCollide`, because you wade into water rather than walk
 * into it. Sized a little larger than its basin, so the hard geometric edge of
 * the surface is buried in the bank.
 */
export function waterPlane(options: WaterPlaneOptions): THREE.Mesh {
  const { width, depth, at, chop = 1, flow, segment = SEGMENT, reach = 0, swell, groundAt } = options;

  const across = Math.max(1, Math.round(width / segment));
  const along = Math.max(1, Math.round(depth / segment));
  const sx = width / across;
  const sz = depth / along;
  const cols = across + 1;
  const rows = along + 1;
  const gridCount = cols * rows;

  // The rectangle's boundary walked clockwise seen from above; the apron's
  // strips take their winding from it.
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
  const chopValues = new Float32Array(count);
  const flowValues = new Float32Array(count * 2);
  const shoreValues = new Float32Array(count * 4);
  const swellValues = new Float32Array(count * 4);
  for (let n = 0; n < gridCount; n++) swellValues[n * 4 + 3] = 1;

  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const n = j * cols + i;
      positions[n * 3] = -width / 2 + i * sx;
      positions[n * 3 + 2] = -depth / 2 + j * sz;
    }
  }

  for (let n = 0; n < gridCount; n++) {
    const x = positions[n * 3] + at.x;
    const z = positions[n * 3 + 2] + at.z;
    chopValues[n] = Math.max(typeof chop === 'function' ? chop(x, z) : chop, 0);
    if (flow) {
      // World coordinates, so a flow field can be written against the room's
      // own layout rather than against wherever this plane's origin landed.
      const velocity = typeof flow === 'function' ? flow(x, z) : flow;
      flowValues[n * 2] = velocity.x;
      flowValues[n * 2 + 1] = velocity.y;
    }
  }

  const shore =
    swell && groundAt
      ? bakeShore(
          { cols, rows, x0: at.x - width / 2, z0: at.z - depth / 2, sx, sz },
          at.y,
          groundAt,
          swell,
        )
      : null;
  const k0 = swell ? deepWavenumber(swell) : 0;
  const a0 = swell ? swell.height / 2 : 0;
  const omega = Math.sqrt(G * k0);
  if (shore) {
    for (let n = 0; n < gridCount; n++) {
      shoreValues[n * 4] = shore.h[n];
      shoreValues[n * 4 + 1] = shore.sigma[n];
      shoreValues[n * 4 + 2] = shore.dir[n * 2];
      shoreValues[n * 4 + 3] = shore.dir[n * 2 + 1];
      swellValues[n * 4] = k0;
      swellValues[n * 4 + 1] = a0;
      swellValues[n * 4 + 2] = shore.k[n];
    }
  }
  if (rings > 0) {
    // The chop trains fade out toward the perimeter, where the mesh gets too
    // coarse to carry them, so the apron and the rectangle meet as one surface.
    for (let n = 0; n < gridCount; n++) {
      const x = positions[n * 3];
      const z = positions[n * 3 + 2];
      const inset = Math.min(width / 2 - Math.abs(x), depth / 2 - Math.abs(z));
      const t = Math.min(Math.max(inset / CHOP_FADE, 0), 1);
      swellValues[n * 4 + 3] = t * t * (3 - 2 * t);
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
    // round their corners instead of fanning them.
    const margin = Math.min(width, depth) * 0.25;
    const hx = width / 2;
    const hz = depth / 2;
    const level = at.y;
    const swellLength = swell ? Math.hypot(swell.direction[0], swell.direction[1]) || 1 : 1;
    const swellX = swell ? swell.direction[0] / swellLength : 0;
    const swellZ = swell ? swell.direction[1] / swellLength : 0;

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
      if (groundAt) {
        // Land side: the vertex, or the perimeter point nearest the outermost
        // ring's foot, stands above the water.
        const fx = Math.min(Math.max(px + reach * outward[p * 2], -hx), hx);
        const fz = Math.min(Math.max(pz + reach * outward[p * 2 + 1], -hz), hz);
        const land =
          groundAt(px + at.x, pz + at.z) >= level || groundAt(fx + at.x, fz + at.z) >= level;
        pinned[p] = land ? 1 : 0;
      }
    }

    for (let r = 0; r < rings; r++) {
      const dist = ringDistances[r];
      for (let p = 0; p < rim; p++) {
        const g = perimeter[p];
        const n = gridCount + r * rim + p;
        const out = pinned[p] ? 0 : dist;
        const x = positions[g * 3] + out * outward[p * 2];
        const z = positions[g * 3 + 2] + out * outward[p * 2 + 1];
        positions[n * 3] = x;
        positions[n * 3 + 2] = z;
        chopValues[n] = chopValues[g];
        flowValues[n * 2] = flowValues[g * 2];
        flowValues[n * 2 + 1] = flowValues[g * 2 + 1];
        swellValues[n * 4 + 3] = 0;
        if (shore) {
          const h = shore.h[g] + out * APRON_SHELF;
          shoreValues[n * 4] = h;
          shoreValues[n * 4 + 1] = k0 * (swellX * (x + at.x) + swellZ * (z + at.z));
          shoreValues[n * 4 + 2] = swellX;
          shoreValues[n * 4 + 3] = swellZ;
          swellValues[n * 4] = k0;
          swellValues[n * 4 + 1] = a0;
          swellValues[n * 4 + 2] = wavenumber(omega, h, k0);
        }
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
  geometry.setAttribute('aChop', new THREE.BufferAttribute(chopValues, 1));
  geometry.setAttribute('aFlow', new THREE.BufferAttribute(flowValues, 2));
  geometry.setAttribute('aShore', new THREE.BufferAttribute(shoreValues, 4));
  geometry.setAttribute('aSwell', new THREE.BufferAttribute(swellValues, 4));
  geometry.setIndex(index);

  const mesh = new THREE.Mesh(geometry, WATER_MATERIAL);
  mesh.name = 'water';
  mesh.position.copy(at);
  mesh.layers.set(WATER_LAYER);
  mesh.userData.noCollide = true;
  // How the zone finds out it has water in it. The geometry says so rather than a
  // declaration on the zone, which could disagree with what was actually built.
  mesh.userData.water = true;
  return mesh;
}
