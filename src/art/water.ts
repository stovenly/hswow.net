import * as THREE from 'three';
import { WATER_LAYER } from '../layers';
import { NOISE_GLSL } from '../engine/noise';
import { SKY_GLSL, skyUniforms } from '../engine/Sky';
import { AERIAL_AIR_GLSL, fogUniforms } from '../engine/fog';
import { REFLECT_GLSL } from '../engine/reflect';
import { windUniforms } from './sway';

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

    uniform sampler2D gustField;
    uniform vec2 windDir;
    uniform float windLagScale;
    uniform float windHalfSpan;
    uniform float swayTime;
    uniform float uWaveScale;
    uniform float uWaterMotion;

    varying vec3 vWorld;
    varying vec3 vSurfaceNormal;
    /** This vertex's chop, after the gust and the global scale. */
    varying float vChop;
    /** Where on the wave this vertex sits, -1 in a trough to 1 on a crest. */
    varying float vCrest;
    /** Which way the surface is travelling, m/s, for the fragment stage. */
    varying vec2 vFlow;
    /** The authored flow speed. Zero on a pond, and the fragment stage cares. */
    varying float vStreak;

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

      float a1 = ${AMP_LONG.toFixed(3)} * chop;
      float a2 = ${AMP_SHORT.toFixed(3)} * chop;
      float height = a1 * sin(p1) + a2 * sin(p2);

      // Plain sines, so the slope is exact: the derivative of a sine is a cosine,
      // and the surface normal is most of what water looks like. A Gerstner sum
      // would need a finite difference or a second evaluation for its normal.
      vec2 slope = d1 * (a1 * k1 * cos(p1)) + d2 * (a2 * k2 * cos(p2));

      world.y += height;
      vWorld = world;
      vSurfaceNormal = normalize(vec3(-slope.x, 1.0, -slope.y));
      vChop = chop;
      vCrest = height / max(a1 + a2, 1e-4);
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

    ${REFLECT_GLSL}

    /** Two scales of value noise. Cheaper than fbm, and this is not a cloud. */
    float ripple(vec2 p) {
      return valueNoise(p) * 0.66 + valueNoise(p * 2.17 + 11.3) * 0.34;
    }

    /**
     * The same noise, drawn in a frame that runs with the water and is squeezed
     * along it. Compressing the coordinate along the flow stretches every feature
     * out along it in world space, and what comes back is streaklines. The frame
     * is built from a varying, so the streaks bend round a corner with the flow.
     */
    float streaked(vec2 p, vec2 along, float stretch, float scale) {
      vec2 across = vec2(-along.y, along.x);
      return ripple(vec2(dot(p, along) / stretch, dot(p, across)) * scale);
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
      if (bedDistance < surfaceDistance - 0.02) discard;

      // How much water the eye is looking through, in metres. Everything below
      // is a function of this number.
      float thickness = max(bedDistance - surfaceDistance, 0.0);

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

      vec3 normal = normalize(vSurfaceNormal);
      if (agitation > 0.002) {
        vec2 q = vWorld.xz - stream * 1.35;
        float e = 0.18;
        float n0 = streaked(q, along, stretch, 1.35);
        float gx = streaked(q + vec2(e, 0.0), along, stretch, 1.35) - n0;
        float gz = streaked(q + vec2(0.0, e), along, stretch, 1.35) - n0;
        // Small. This tilts the normal, which decides both the fresnel weight and
        // where the reflection ray goes, so past about ten degrees the reflected
        // image stops being a reflection. Ripple is a few degrees of scatter.
        normal = normalize(normal + vec3(-gx, 0.0, -gz) * (0.16 * agitation / e));
      }

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
      vec3 bed = texture2D(tScene, uv).rgb;
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

      vec3 sky = skyColour(bounce);
      vec3 reflection = sky;
      float hit = 0.0;
      if (uReflections > 0.5) {
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

      // --- foam ---------------------------------------------------------------
      // Two bands and two flat colours, hard-thresholded: the quantizer would band
      // a gradient anyway, so the bands are authored where they belong. The
      // waterline is scaled by noise and scrolled downwind, in three layers at
      // slightly different rates, all carried by stream — so the motion switch
      // stops every one of them.
      float lap = streaked(vWorld.xz - stream * 0.85, along, stretch, 0.55);
      // Fast water is aerated, and aerated water is white further out: the band a
      // race foams over is nearly twice a pond's.
      float band = uFoamDepth * (0.45 + 1.1 * lap) * (1.0 + rushing * 0.95);
      float shore = 1.0 - smoothstep(band * 0.5, band, thickness);

      // Crest foam has to be broken up, because two crossed sine trains interfere
      // into a regular lattice and a plain threshold puts a white speck at every
      // node of it. So the threshold is lowered by a drifting noise field instead.
      float speck = streaked(vWorld.xz - stream, along, stretch, 1.7);
      float crest =
        smoothstep(1.05 - speck * 0.55, 1.25 - speck * 0.5, vCrest) *
        smoothstep(0.12, 0.5, agitation);
      float foam = max(shore, crest);

      float wash = step(0.28, foam);
      float white = step(0.68, foam);
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
// and it always sets one.
(WATER_MATERIAL as { defaultAttributeValues?: Record<string, number[]> }).defaultAttributeValues = {
  aChop: [0],
  aFlow: [0, 0],
};

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
}

/**
 * A body of water, placed like any other prop. `WATER_LAYER` is set rather than
 * enabled, which takes it out of the opaque pass, the normal pass and the shadow
 * map in one line; `noCollide`, because you wade into water rather than walk
 * into it. Sized a little larger than its basin, so the hard geometric edge of
 * the surface is buried in the bank.
 */
export function waterPlane(options: WaterPlaneOptions): THREE.Mesh {
  const { width, depth, at, chop = 1, flow, segment = SEGMENT } = options;

  const across = Math.max(1, Math.round(width / segment));
  const along = Math.max(1, Math.round(depth / segment));
  const geometry = new THREE.PlaneGeometry(width, depth, across, along);
  geometry.rotateX(-Math.PI / 2);

  const position = geometry.getAttribute('position');
  const count = position.count;

  const chopValues = new Float32Array(count);
  if (typeof chop === 'function') {
    for (let i = 0; i < count; i++) {
      chopValues[i] = Math.max(chop(position.getX(i) + at.x, position.getZ(i) + at.z), 0);
    }
  } else {
    chopValues.fill(Math.max(chop, 0));
  }
  geometry.setAttribute('aChop', new THREE.BufferAttribute(chopValues, 1));

  // Zero everywhere unless a flow was authored: the shader reads a zero-length
  // flow as "answer the wind" rather than as "go nowhere".
  const flowValues = new Float32Array(count * 2);
  if (flow) {
    for (let i = 0; i < count; i++) {
      // World coordinates, so a flow field can be written against the room's
      // own layout rather than against wherever this plane's origin landed.
      const velocity =
        typeof flow === 'function'
          ? flow(position.getX(i) + at.x, position.getZ(i) + at.z)
          : flow;
      flowValues[i * 2] = velocity.x;
      flowValues[i * 2 + 1] = velocity.y;
    }
  }
  geometry.setAttribute('aFlow', new THREE.BufferAttribute(flowValues, 2));

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
