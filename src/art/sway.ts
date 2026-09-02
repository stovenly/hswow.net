import * as THREE from 'three';
import { FIELD_ATTRIBUTE } from './fields';
import { ART_MATERIAL } from './material';
import { applyWear } from './weathering';
import { applyDetail } from './detail';
import { applyAerialFog } from '../engine/fog';
import { applyFinish } from './finish';
import { applyGlitch, applyGlitchDisplacement, glitchVariant } from './glitch';
import { applyHorror, applyHorrorDisplacement, horrorVariant } from './horror';
import type { Weather } from '../audio/weather';

/**
 * The world moving on its own. A gust travels: the field is sampled at a phase
 * offset by how far downwind a point stands, which makes it a front rather than
 * a switch. The CPU owns the field and ships the answer in a one-dimensional
 * byte lookup texture, rebuilt each frame from `Weather.fieldAt` — so the gust
 * that bends a tree is the gust that quickens its rustle, by construction. What
 * bends by how much is `art/flex.ts`, applied to the sway weights when a builder
 * finishes; a uniform would mean a material per species.
 */

/** Texels across the lookup window. 256 over ~25 s is a sample every 100 ms. */
const FIELD_SIZE = 256;

/** Half-width of the sampled window, in metres along the wind. Comfortably past the largest zone; the cost of being generous is only resolution. */
const WORLD_REACH = 140;

/**
 * How far a vertex leans downwind at full strength, as a fraction of its own
 * height above the ground. The authored sway weight is normalised to each
 * plant's own height, so a displacement measured in metres would move a daisy
 * and an oak the same absolute distance. Object-space height, so a builder's
 * `scale` carries through for free.
 */
const BEND = 0.16;
/** The same, across the wind. Smaller, faster, and never quite zero. */
const FLUTTER = 0.05;

export interface WindUniforms {
  gustField: { value: THREE.DataTexture };
  /**
   * The running integral of the same field, in strength-seconds — what an
   * unanchored thing needs: a plant answers the wind now, a snowflake keeps
   * everything the wind has already given it. Float, because a running sum
   * quantised to a byte comes out as a staircase of two or three drifts; sampled
   * `NearestFilter` and interpolated by hand, since linear filtering of a float
   * texture is an extension.
   */
  gustIntegral: { value: THREE.DataTexture };
  windDir: { value: THREE.Vector2 };
  /** Metres per gust-time unit along the wind. Converts world position to phase. */
  windLagScale: { value: number };
  /** Half the lookup window, in the same units as the lag. */
  windHalfSpan: { value: number };
  /** Seconds of age → texture coordinate, for reaching back into the integral. */
  windAgeScale: { value: number };
  swayTime: { value: number };
  swayAmount: { value: number };
}

const field = new THREE.DataTexture(
  new Uint8Array(FIELD_SIZE),
  FIELD_SIZE,
  1,
  THREE.RedFormat,
  THREE.UnsignedByteType,
);
field.minFilter = THREE.LinearFilter;
field.magFilter = THREE.LinearFilter;
field.wrapS = THREE.ClampToEdgeWrapping;
field.wrapT = THREE.ClampToEdgeWrapping;
field.needsUpdate = true;

const integral = new THREE.DataTexture(
  new Float32Array(FIELD_SIZE),
  FIELD_SIZE,
  1,
  THREE.RedFormat,
  THREE.FloatType,
);
integral.minFilter = THREE.NearestFilter;
integral.magFilter = THREE.NearestFilter;
integral.wrapS = THREE.ClampToEdgeWrapping;
integral.wrapT = THREE.ClampToEdgeWrapping;
integral.needsUpdate = true;

export const windUniforms: WindUniforms = {
  gustField: { value: field },
  gustIntegral: { value: integral },
  windDir: { value: new THREE.Vector2(1, 0) },
  windLagScale: { value: 0 },
  windHalfSpan: { value: 1 },
  windAgeScale: { value: 0 },
  swayTime: { value: 0 },
  // A global scale, so the whole world's motion can be turned down without
  // re-tuning seventy builders against each other. Composed below from the
  // player's option and the active zone's own wind.
  swayAmount: { value: 1 },
};

let swayOption = 1;
let swayZone = 1;

/** The reduced-motion / wind-sway option. Zero stills everything. */
export function setSwayOption(enabled: boolean): void {
  swayOption = enabled ? 1 : 0;
  windUniforms.swayAmount.value = swayOption * swayZone;
}

/** The active zone's wind, over the weather's. An exposed hilltop blows harder. */
export function setZoneWind(factor: number): void {
  swayZone = factor;
  windUniforms.swayAmount.value = swayOption * swayZone;
}

/**
 * The depth material the shadow map is drawn with, displaced to match. A vertex
 * shader that moves geometry has to move it twice: three draws the shadow pass
 * with its own `MeshDepthMaterial`, so an unpatched plant casts a perfectly
 * still shadow of where it is not. `RGBADepthPacking` is what the renderer
 * expects from a `customDepthMaterial` on a non-cube light.
 */
export const SWAY_DEPTH_MATERIAL = new THREE.MeshDepthMaterial({
  depthPacking: THREE.RGBADepthPacking,
});

let patched = false;

/** Patches the one shared art material to displace vertices. Idempotent, and called once at boot; only what the art kit builds picks it up. */
export function patchArtMaterial(): void {
  if (patched) return;
  patched = true;

  // Both, and with the same code: the surface material decides what you see, the
  // depth material what the sun sees. `MeshDepthMaterial`'s vertex shader carries
  // the same two include points, so one patch serves both.
  const patch = (shader: { vertexShader: string; uniforms: Record<string, unknown> }): void => {
    Object.assign(shader.uniforms, windUniforms);

    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        /* glsl */ `#include <common>
        // Declared here for the whole chain: .x sway, .y wear, .z detail.
        attribute vec3 ${FIELD_ATTRIBUTE};
        uniform sampler2D gustField;
        uniform vec2 windDir;
        uniform float windLagScale;
        uniform float windHalfSpan;
        uniform float swayTime;
        uniform float swayAmount;

        // A cheap hash, for the per-instance flutter offset. Two objects the
        // same distance downwind receive the same gust at the same moment,
        // which is correct — but they must not then flutter in lockstep, so
        // the fast component is offset by where the object stands.
        float swayHash(vec2 p) {
          return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
        }
        `,
      )
      .replace(
        '#include <begin_vertex>',
        /* glsl */ `#include <begin_vertex>
        {
          float weight = ${FIELD_ATTRIBUTE}.x * swayAmount;
          if (weight > 0.0001) {
            // Where this vertex stands, and therefore when the gust reaches it.
            vec3 worldAt = (modelMatrix * vec4(transformed, 1.0)).xyz;
            float lag = dot(worldAt.xz, windDir) * windLagScale;
            // The window is centred on now, so upwind (negative lag) reads
            // ahead of the present and downwind reads behind it.
            float u = clamp(0.5 - lag / (2.0 * windHalfSpan), 0.0, 1.0);
            float strength = texture2D(gustField, vec2(u, 0.5)).r;

            // The wind, in this object's own space. Only Y rotation and a
            // uniform scale are ever used, so the inverse rotation is the
            // transpose over the scale squared — which avoids needing
            // inverse() or transpose(), neither of which exists in GLSL ES 1.
            vec3 c0 = modelMatrix[0].xyz;
            vec3 c1 = modelMatrix[1].xyz;
            vec3 c2 = modelMatrix[2].xyz;
            float scaleSq = max(dot(c0, c0), 0.0001);
            vec3 windWorld = vec3(windDir.x, 0.0, windDir.y);
            vec3 windObj =
              vec3(dot(c0, windWorld), dot(c1, windWorld), dot(c2, windWorld)) / scaleSq;
            vec3 crossObj = vec3(-windObj.z, 0.0, windObj.x);

            float offset = swayHash(floor(modelMatrix[3].xz * 4.0)) * 6.2831;

            // Two frequencies that do not divide evenly, so the pair never
            // visibly repeats. The slow one leans downwind and stays there —
            // wind pushes one way, and a symmetric sine reads as a metronome
            // rather than as a load.
            float lean = 0.62 + 0.38 * sin(swayTime * 1.1 + offset);
            float flutter = sin(swayTime * 3.7 + offset * 2.3);

            // Height is a factor, and it has to be: the sway weight is relative
            // to each plant's own height, so without this a daisy and an oak
            // move the same number of metres -- see BEND. Object-space Y, taken
            // before anything is displaced.
            //
            // (No backticks anywhere in this shader source: it is a template
            // literal, and one would end it mid-GLSL.)
            float tall = max(transformed.y, 0.0);
            float push = weight * strength * tall;
            transformed += windObj * (push * lean * ${BEND.toFixed(3)})
                         + crossObj * (push * flutter * ${FLUTTER.toFixed(3)});
          }
        }
        `,
      );
  };

  swayPatch = patch;
  applySway(ART_MATERIAL);
  applySway(SWAY_DEPTH_MATERIAL);

  // The weathering stage wraps the sway patch on the surface material only —
  // the depth and normal materials read geometry, not colour. Applied here,
  // after sway has claimed `onBeforeCompile`, because it composes by
  // wrapping; see `applyWear`.
  applyWear(ART_MATERIAL);
  // And detail fading wraps that, in this order: it dissolves the finished
  // surface colour, weathering included. See `applyDetail`.
  applyDetail(ART_MATERIAL);
  // The finish stage wraps last. It hooks the lighting chunks rather than the
  // colour ones, so it consumes whatever the three stages above decided the
  // surface is. Mask 0: the lean material carries only the base finish, and
  // anything that declared more takes a variant from `artMaterialFor`.
  applyFinish(ART_MATERIAL, 0);
  // And the glitch stage wraps after even that: it corrupts the lit result,
  // finish and all, which is what makes it read as the signal going bad rather
  // than the material changing. The depth material takes the displacement half
  // too, since shadows re-render every frame.
  applyGlitch(ART_MATERIAL);
  applyGlitchDisplacement(SWAY_DEPTH_MATERIAL);
  // Horror wraps outermost, and lands *before* glitch in the compiled shader:
  // the body goes wrong first, then the signal of it corrupts on top. Depth
  // gets the displacement half for the same live-shadow reason as glitch.
  applyHorror(ART_MATERIAL);
  applyHorrorDisplacement(SWAY_DEPTH_MATERIAL);

  // The air, outermost of all. It is the last thing that happens to a
  // fragment: everything else is what the surface is, and this is what is between
  // you and it. Ground cover and weather do the same for themselves where they
  // are declared — importing them here would close a cycle, since both read the
  // wind out of this module.
  applyAerialFog(ART_MATERIAL);

  // The volume variants ride in the key: each stage is compiled out where the
  // zone has none of it, and the programs must not be confused for each other.
  ART_MATERIAL.customProgramCacheKey = () => `art:0:${glitchVariant()}:${horrorVariant()}`;
}

/** The compiled variants, by finish mask. Mask 0 is the lean shared material. */
const variants = new Map<number, THREE.Material>();

/** The art material carrying exactly the finish chunks `mask` names. Built on first request, kept for the session. */
export function artMaterialFor(mask: number): THREE.Material {
  if (mask === 0) return ART_MATERIAL;
  const held = variants.get(mask);
  if (held) return held;

  const material = new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true });
  applySway(material);
  applyWear(material);
  applyDetail(material);
  applyFinish(material, mask);
  applyGlitch(material);
  applyHorror(material);
  applyAerialFog(material);
  // After the chain: each stage sets its own constant key and the last wins.
  material.customProgramCacheKey = () => `art:${mask}:${glitchVariant()}:${horrorVariant()}`;
  variants.set(mask, material);
  return material;
}

/** Puts a mesh in the art material its mask names. Stamped so the compile warmers can read it. */
export function dressArtMesh(mesh: THREE.Mesh, mask: number): void {
  mesh.material = artMaterialFor(mask);
  if (mask !== 0) mesh.userData.finishMask = mask;
}

/** Set by `patchArtMaterial`. Held so late arrivals can be patched too. */
let swayPatch: ((shader: { vertexShader: string; uniforms: Record<string, unknown> }) => void) | null =
  null;

/**
 * Makes one more material displace vertices the same way the kit does. Anything
 * that draws the scene has to agree about where the scene is: the surface
 * material, the depth material the sun sees, and the `MeshNormalMaterial` the
 * edge detector's normal buffer is built with — an outline traced around
 * undisplaced geometry is a motionless wireframe of a plant's former shape.
 * Safe on non-kit geometry: a missing attribute reads as zero, so the terrain
 * and the floor get a sway weight of zero.
 */
export function applySway(material: THREE.Material): void {
  if (!swayPatch) return;
  material.onBeforeCompile = swayPatch;

  // What a missing attribute reads as, stated rather than assumed. When a
  // geometry does not supply an attribute the shader declares, WebGL falls back
  // to a generic value that persists across draw calls — so without this the
  // weight would be whatever the last mesh left in that slot, and the ground
  // would ripple occasionally and unreproducibly. Zero means rigid.
  (material as { defaultAttributeValues?: Record<string, number[]> }).defaultAttributeValues = {
    ...(material as { defaultAttributeValues?: Record<string, number[]> }).defaultAttributeValues,
    [FIELD_ATTRIBUTE]: [0, 0, 0],
  };

  // Three caches compiled programs by a key that knows nothing about an
  // `onBeforeCompile`, so two materials differing only in their patch can be
  // handed each other's program.
  material.customProgramCacheKey = () => 'sway';
  material.needsUpdate = true;
}

const texels = field.image.data as Uint8Array;
const sums = integral.image.data as unknown as Float32Array;

/**
 * How often the lookup window is rebuilt, in seconds. At the authored gust rate
 * a frame advances the window by 0.14 of a texel, so twelve times a second is
 * the same picture. The uniforms below still move every frame: `swayTime` is the
 * clock the finish and glitch stages read.
 */
const WIND_INTERVAL = 1 / 12;

/** When the window was last rebuilt, on `updateWind`'s own clock. */
let windRebuilt = -Infinity;

/**
 * Refills the lookup window and advances the clock, once a frame. The whole
 * texture is rebuilt rather than scrolled: 256 evaluations of a handful of
 * hashes, and it cannot drift out of alignment with the phase it claims to hold.
 */
export function updateWind(weather: Weather, elapsed: number): void {
  const { windDirection, frontSpeed, gustRate } = weather.settings;

  windUniforms.windDir.value.set(Math.cos(windDirection), Math.sin(windDirection));
  // Metres → gust-time, matching `Weather.lagAt` exactly. The shader multiplies
  // this by the along-wind distance to get the same lag the audio computes.
  const lagScale = gustRate / Math.max(frontSpeed, 0.5);
  const halfSpan = WORLD_REACH * lagScale;
  windUniforms.windLagScale.value = lagScale;
  windUniforms.windHalfSpan.value = halfSpan;
  windUniforms.swayTime.value = elapsed;
  // Seconds of age into a step along the window. A rate of zero is a still world
  // with an integral that never advances, which is exactly right for one.
  windUniforms.windAgeScale.value = gustRate / (2 * halfSpan || 1);

  if (elapsed - windRebuilt < WIND_INTERVAL) return;
  windRebuilt = elapsed;

  // Seconds between neighbouring texels, for the integral below. The window is
  // `2·halfSpan` of gust-time wide, and `gustRate` is gust-time per second.
  const step = (2 * halfSpan) / (FIELD_SIZE - 1) / Math.max(gustRate, 1e-6);
  let sum = 0;
  let previous = 0;

  const now = weather.phase;
  for (let i = 0; i < FIELD_SIZE; i++) {
    const u = i / (FIELD_SIZE - 1);
    // Inverse of the shader's u = 0.5 - lag / (2*halfSpan). Worth deriving rather
    // than eyeballing: the two are easy to get the wrong way round, and inverted
    // they still produce a plausible travelling gust — one moving upwind. So
    // u = 0 is the far downwind edge and holds an older gust, and u = 1 is upwind
    // and holds one that has not arrived yet.
    const phase = now + (u - 0.5) * 2 * halfSpan;
    const strength = weather.fieldAt(phase);
    texels[i] = Math.round(strength * 255);
    // Trapezoid, accumulated from the downwind edge, so the table holds the
    // integral up to each phase and a particle's drift is the difference between
    // two of them. The zero point slides with the window, harmlessly: nothing
    // ever compares two frames' tables.
    if (i > 0) sum += ((previous + strength) / 2) * step;
    previous = strength;
    sums[i] = sum;
  }
  field.needsUpdate = true;
  integral.needsUpdate = true;
}
