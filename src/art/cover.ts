import * as THREE from 'three';
import { type CoverName, type PropLayer } from '../world/ground';
import {
  hat,
  packSample,
  sampleCover,
  COVER_ATTRIBUTE,
  COVER_BLEND_ATTRIBUTE,
  PROP_LOD,
  type CoverChunks,
} from './cover-sample';
import type { CoverReply, CoverRequest } from './cover.worker';
import { windUniforms } from './sway';
import { applyAerialFog } from '../engine/fog';
import { COVER_LAYER } from '../layers';

export {
  COVER_ATTRIBUTE,
  COVER_BLEND_ATTRIBUTE,
  COVER_FLOOR,
  PROP_LOD,
  PROP_TURN,
  WALL_LIFT,
} from './cover-sample';

/** The distance LOD's knobs. See `setCoverLod`. */
export interface CoverLod {
  /** Target blades per screen pixel in the far field. */
  blades: number;
  /** Exponent on the view angle, 0..1: 0 thins per ground pixel, 1 per screen pixel. */
  grazing: number;
  /** Fraction of a blade's keep distance over which it grows out of the ground. */
  sprout: number;
  /** Far wind brightness term on the thinned field. */
  sheen: number;
  /** Metres past which a blade is one triangle. 0 keeps every blade a ribbon. */
  swapAt: number;
}

/**
 * Groundcover: instanced blades sampled from any ground mesh. Each blade is a
 * camera-facing ribbon bent along a curve in the vertex shader; a CPU sampler
 * walks the ground's triangles once at zone build and packs one instance per
 * blade, with clump cells giving them local agreement. Blades rise along +Y,
 * never the face normal, are lit by the ground's normal, and never project
 * under one art pixel wide. Wall types grow on near-vertical faces instead,
 * oriented to them, and a mesh opts in with `userData.cover`.
 */

/** Blade ribbon segments. Two verts each plus a tip: 9 vertices a blade. */
const SEGMENTS = 4;

/** How dark a root is, and how much of that the tip recovers. */
const ROOT = 0.6;
const RAMP = 0.4;

export const coverUniforms = {
  /** Global length and width multipliers, for tuning. */
  coverHeight: { value: 1 },
  coverWidth: { value: 1 },
  /** World size of one art pixel at unit view depth. See `updateCover`. */
  coverPixel: { value: 0 },
  /** The player's feet, for treading a path through the blades. */
  coverPlayer: { value: new THREE.Vector3(0, -1000, 0) },
  /** Toward the sun, and the plume backlight colour, premultiplied. */
  coverSunDir: { value: new THREE.Vector3(0, 1, 0) },
  coverGlow: { value: new THREE.Color(0, 0, 0) },
  /** How far lying snow has buried and whitened the blades, 0..1. */
  coverSnow: { value: 0 },
  /** How heavy rain has left them, 0..1. Wet grass lies over and goes darker. */
  coverWet: { value: 0 },
  /** What the surfaces under the cover are reflecting. See `coverWeather`. */
  coverSky: { value: new THREE.Color(0.5, 0.55, 0.6) },
  /** sqrt of the target blades per pixel. With `iKeep = sqrt(area / rank)`, a blade is kept while `away * coverPixel < iKeep * coverLodScale`. */
  coverLodScale: { value: 1 },
  coverGrazing: { value: 1 },
  coverSprout: { value: 0.12 },
  coverSheen: { value: 0.18 },
  coverSwap: { value: 0 },
};

/**
 * What the weather does to a cover colour, and it has to be *exactly* what the
 * weather does to the surface underneath — see `art/finish.ts`. Cover is an
 * even lattice of instances, so the moment it responds differently to the
 * ground it stands in, the lattice stops being a texture and becomes a pattern:
 * saturated green tufts stencilled across a desaturated wet roof.
 *
 * Wet darkens by multiplying the colour by itself, which takes proportionally
 * more off a dark colour than a pale one and deepens the hue rather than
 * washing it out. That is the same operation the finish stage runs.
 */
const COVER_WEATHER = /* glsl */ `
uniform float coverSnow;
uniform float coverWet;
uniform vec3 coverSky;

vec3 coverWeather(vec3 tint) {
  vec3 wet = tint * mix(vec3(1.0), tint, coverWet * 0.7);
  // And the same sheen of sky the surface underneath picks up. Cover carries
  // no finish stage, so it has no environment term of its own — without this
  // the ground goes grey in the rain while everything growing out of it stays
  // green, and an even lattice of instances becomes a lattice you can see.
  wet += coverSky * (coverWet * 0.03);
  return mix(wet, vec3(0.86, 0.9, 0.96), coverSnow * 0.62);
}
`;

/** What the weather has done to the ground cover. See `world/WeatherRig`. */
export function setCoverWeather(snow: number, wet: number, sky: THREE.Color): void {
  coverUniforms.coverSnow.value = snow;
  coverUniforms.coverWet.value = wet;
  coverUniforms.coverSky.value.copy(sky);
}

/** World direction into a mesh's object space: Y rotation and uniform scale only. */
const TO_OBJECT = /* glsl */ `
vec3 coverToObject(vec3 v, vec3 c0, vec3 c1, vec3 c2, float scaleSq) {
  return vec3(dot(c0, v), dot(c1, v), dot(c2, v)) / scaleSq;
}
`;

/**
 * The blade material. Lambert, so a blade is lit by the same maths as the
 * ground — and by the ground's own normal, passed per instance.
 */
export const COVER_MATERIAL = new THREE.MeshLambertMaterial({
  name: 'CoverBlades',
  side: THREE.DoubleSide,
});

/** The blade construction, shared by the colour material and the normal-pass one. */
const patchBladeVertex = (shader: { vertexShader: string }): void => {
  shader.vertexShader = shader.vertexShader
    .replace(
      '#include <common>',
      /* glsl */ `#include <common>
      attribute vec4 iPlace;   // root position, facing yaw
      attribute vec4 iShape;   // length, width, sprawl, taper
      attribute vec3 iTint;
      attribute vec4 iWild;    // breathe phase, flutter phase, give, square metres per blade
      attribute vec3 iNormal;  // the ground's normal under the root
      attribute float iKeep;   // sqrt(area / rank): how far out this blade is still wanted
      uniform float coverHeight;
      uniform float coverWidth;
      uniform float coverPixel;
      uniform float coverLodScale;
      uniform float coverGrazing;
      uniform float coverSprout;
      uniform float coverSheen;
      uniform float coverSwap;
      uniform vec3 coverPlayer;
      uniform sampler2D gustField;
      uniform vec2 windDir;
      uniform float windLagScale;
      uniform float windHalfSpan;
      uniform float swayTime;
      uniform float swayAmount;
      varying vec3 vCoverTint;
      ${TO_OBJECT}
      `,
    )
    .replace(
      '#include <beginnormal_vertex>',
      /* glsl */ `vec3 objectNormal = iNormal;
      `,
    )
    .replace(
      '#include <begin_vertex>',
      /* glsl */ `vec3 transformed;
      {
        float t = position.y;

        vec3 c0 = modelMatrix[0].xyz;
        vec3 c1 = modelMatrix[1].xyz;
        vec3 c2 = modelMatrix[2].xyz;
        float scaleSq = max(dot(c0, c0), 0.0001);

        vec3 worldRoot = (modelMatrix * vec4(iPlace.xyz, 1.0)).xyz;
        float len = iShape.x * coverHeight;

        // Distance LOD. Each blade has its own keep distance, and sprouts over
        // the last fraction of it; the kept fraction of a field is k blades
        // per pixel of ground, times the view angle to the power of grazing.
        vec3 toCam = cameraPosition - worldRoot;
        float away = max(length(toCam), 0.001);
        vec3 groundUp = normalize(c0 * iNormal.x + c1 * iNormal.y + c2 * iNormal.z);
        float facing = pow(max(dot(groundUp, toCam / away), 0.02), 0.5 * coverGrazing);
        float keepD = iKeep * coverLodScale * facing / max(coverPixel, 1e-6);
        float grow = 1.0 - smoothstep(keepD * (1.0 - coverSprout), keepD, away);
        // One mesh draws each blade: the base geometry's z is 1 on the far,
        // one-triangle blade, and the switch is hashed per blade.
        if (coverSwap > 0.0) {
          float swapD = coverSwap * (0.8 + 0.4 * fract(iWild.x * 0.15915494));
          grow *= position.z > 0.5 ? step(swapD, away) : step(away, swapD);
        } else if (position.z > 0.5) {
          grow = 0.0;
        }
        len *= grow;

        // The same travelling gust the trees answer. See art/sway.ts.
        float lag = dot(worldRoot.xz, windDir) * windLagScale;
        float u = clamp(0.5 - lag / (2.0 * windHalfSpan), 0.0, 1.0);
        float gust = texture2D(gustField, vec2(u, 0.5)).r * swayAmount;

        float breathe = 0.6 + 0.4 * sin(swayTime * 1.3 + iWild.x);
        float flutter = sin(swayTime * 3.1 + iWild.y) * 0.6
                      + sin(swayTime * 5.3 + iWild.y * 1.7) * 0.4;

        // Where the tip goes: rest lean, then the wind, then the flutter.
        vec2 face = vec2(cos(iPlace.w), sin(iPlace.w));
        vec2 tip = face * (iShape.z * len);
        tip += windDir * (gust * breathe * iWild.z * len * 0.9);
        tip += vec2(-windDir.y, windDir.x) * (flutter * gust * iWild.z * len * 0.25);

        // Only cover tall enough to stand in the view parts around the player.
        vec2 fromPlayer = worldRoot.xz - coverPlayer.xz;
        float treadD = length(fromPlayer);
        float tall = smoothstep(0.4, 0.6, len);
        float tread = tall
                    * (1.0 - smoothstep(0.12, 0.85, treadD))
                    * (1.0 - smoothstep(1.0, 1.6, abs(worldRoot.y - coverPlayer.y)));
        if (tread > 0.0 && treadD > 0.001) tip += (fromPlayer / treadD) * (tread * len * 0.9);

        // Cantilever: displacement grows with t squared, and the tip dips to pay.
        float bend = length(tip) / max(len, 0.001);
        float dip = 1.0 - 0.35 * bend * t * t;

        // The ribbon faces the camera, and never projects under one art pixel.
        vec2 flatCam = vec2(toCam.x, toCam.z);
        vec2 sideDir = dot(flatCam, flatCam) > 0.001
          ? normalize(vec2(-flatCam.y, flatCam.x))
          : vec2(face.y, -face.x);
        float halfW = 0.5 * iShape.y * coverWidth * (1.0 - iShape.w * t) * grow;
        // A vertical ribbon is a line from above: fatten it as the view steepens.
        float steep = smoothstep(0.5, 1.0, toCam.y / max(length(toCam), 0.001));
        halfW *= 1.0 + 1.5 * steep;
        halfW = max(halfW, 0.5 * coverPixel * length(toCam));

        vec3 disp = vec3(tip.x, 0.0, tip.y) * (t * t)
                  + vec3(0.0, len * t * dip, 0.0)
                  + vec3(sideDir.x, 0.0, sideDir.y) * (position.x * halfW);
        transformed = iPlace.xyz + coverToObject(disp, c0, c1, c2, scaleSq);
        // Collapsed to its root: no area, no fragments.
        if (grow <= 0.0) transformed = iPlace.xyz;

        vCoverTint = iTint * (${ROOT.toFixed(2)} + ${RAMP.toFixed(2)} * t);

        // Far wind: a gust front read as a band of brightness rolling across
        // the thinned field, in place of the overdraw shimmer thinning takes
        // away. Zero wherever nothing has been thinned.
        float keepOne = sqrt(iWild.w) * coverLodScale * facing / max(coverPixel, 1e-6);
        float thinned = 1.0 - min(1.0, (keepOne * keepOne) / (away * away));
        vec2 viewXZ = dot(flatCam, flatCam) > 0.001 ? normalize(flatCam) : vec2(0.0);
        vCoverTint *= 1.0 + coverSheen * thinned * gust * breathe * (-dot(windDir, viewXZ));
      }
      `,
    );
};

COVER_MATERIAL.onBeforeCompile = (shader) => {
  Object.assign(shader.uniforms, windUniforms, coverUniforms);
  patchBladeVertex(shader);

  shader.fragmentShader = shader.fragmentShader
    .replace(
      '#include <common>',
      /* glsl */ `#include <common>
      varying vec3 vCoverTint;
      ${COVER_WEATHER}
      `,
    )
    .replace(
      '#include <normal_fragment_begin>',
      // Undo the double-sided flip: the normal is the ground's, whichever way
      // the ribbon happens to face.
      /* glsl */ `#include <normal_fragment_begin>
      normal = normalize(vNormal);
      `,
    )
    .replace(
      '#include <color_fragment>',
      /* glsl */ `#include <color_fragment>
      diffuseColor.rgb = coverWeather(vCoverTint);
      `,
    );
};

COVER_MATERIAL.customProgramCacheKey = () => 'cover-blades';

/**
 * The prop material: plume heads and flower heads. Vertex colours for the
 * authored parts, an instance tint over them, a stippled discard for feathery
 * edges, and a backlight term that makes plumes glow against a low sun.
 */
export const TUFT_MATERIAL = new THREE.MeshLambertMaterial({
  name: 'CoverTufts',
  vertexColors: true,
  side: THREE.DoubleSide,
});

/** The tuft construction, shared by the colour material and the normal-pass one. */
const patchTuftVertex = (shader: { vertexShader: string }): void => {
  shader.vertexShader = shader.vertexShader
    .replace(
      '#include <common>',
      /* glsl */ `#include <common>
      attribute vec4 fin;      // stipple uv, puff (how much it sways), solidity
      attribute vec4 iPlace;   // root position, yaw
      attribute vec4 iProp;    // scale, gust lag, seed, glow
      attribute vec3 iTintP;
      attribute vec3 iNormalP; // up for ground props, the wall's for wall ones
      attribute float iRoll;   // spin about the wall normal — crawling kinds only
      attribute float iKeepP;  // sqrt(area / rank); huge on kinds that never thin
      uniform float coverPixel;
      uniform float coverLodScale;
      uniform float coverGrazing;
      uniform float coverSprout;
      uniform vec3 coverPlayer;
      uniform sampler2D gustField;
      uniform vec2 windDir;
      uniform float windLagScale;
      uniform float windHalfSpan;
      uniform float swayTime;
      uniform float swayAmount;
      varying vec3 vTuftTint;
      varying vec4 vTuftGrain; // stipple uv, solidity, glow
      varying vec3 vTuftWorld;
      ${TO_OBJECT}
      `,
    )
    .replace(
      '#include <beginnormal_vertex>',
      // Lit as what it stands on is lit: the ground plane for a plume, the
      // wall's own face for ivy — a prop is a soft mass, not a surface.
      /* glsl */ `vec3 objectNormal = iNormalP;
      `,
    )
    .replace(
      '#include <begin_vertex>',
      /* glsl */ `vec3 transformed;
      {
        vec3 c0 = modelMatrix[0].xyz;
        vec3 c1 = modelMatrix[1].xyz;
        vec3 c2 = modelMatrix[2].xyz;
        float scaleSq = max(dot(c0, c0), 0.0001);

        float ca = cos(iPlace.w);
        float sa = sin(iPlace.w);
        vec3 p = position * iProp.x;
        // Spin the authored wall plane first, so a crawl can point any way.
        float rc = cos(iRoll);
        float rs = sin(iRoll);
        p = vec3(p.x * rc - p.y * rs, p.x * rs + p.y * rc, p.z);
        p = vec3(p.x * ca - p.z * sa, p.y, p.x * sa + p.z * ca);

        vec3 worldRoot = (modelMatrix * vec4(iPlace.xyz, 1.0)).xyz;

        // Distance LOD, as the blades do it: the authored mesh scales from its root.
        vec3 toCam = cameraPosition - worldRoot;
        float away = max(length(toCam), 0.001);
        vec3 propUp = normalize(c0 * iNormalP.x + c1 * iNormalP.y + c2 * iNormalP.z);
        float facing = pow(max(dot(propUp, toCam / away), 0.02), 0.5 * coverGrazing);
        float keepD = iKeepP * coverLodScale * facing / max(coverPixel, 1e-6);
        float grow = 1.0 - smoothstep(keepD * (1.0 - coverSprout), keepD, away);
        p *= grow;

        // The same gust, sampled a beat behind: a heavy head answers late.
        float lag = dot(worldRoot.xz, windDir) * windLagScale + iProp.y;
        float u = clamp(0.5 - lag / (2.0 * windHalfSpan), 0.0, 1.0);
        float gust = texture2D(gustField, vec2(u, 0.5)).r * swayAmount;

        // abs, because a hanging raceme's tip is *below* its root and should
        // still swing downwind, not up it.
        float roll = 0.7 + 0.3 * sin(swayTime * 1.1 + iProp.z * 6.2831);
        float reach = abs(p.y);
        vec2 push = windDir * (gust * roll * fin.z * reach * 0.3)
                  + vec2(-windDir.y, windDir.x)
                    * (sin(swayTime * 2.6 + iProp.z * 9.42) * gust * fin.z * reach * 0.08);

        // Stalks part around the player exactly as the blades under them do,
        // bending from the base — displacement grows with height.
        vec2 fromPlayer = worldRoot.xz - coverPlayer.xz;
        float treadD = length(fromPlayer);
        float tread = (1.0 - smoothstep(0.15, 0.9, treadD))
                    * (1.0 - smoothstep(1.0, 1.8, abs(worldRoot.y - coverPlayer.y)));
        tread *= smoothstep(0.4, 0.6, reach);
        if (tread > 0.0 && treadD > 0.001) push += (fromPlayer / treadD) * (tread * reach * 0.55);
        p.xz += push;

        transformed = iPlace.xyz + coverToObject(p, c0, c1, c2, scaleSq);
        if (grow <= 0.0) transformed = iPlace.xyz;
        vTuftWorld = (modelMatrix * vec4(transformed, 1.0)).xyz;
        vTuftTint = iTintP;
        vTuftGrain = vec4(fin.xy + iProp.z * 7.0, fin.w, iProp.w);
      }
      `,
    );
};

/** The stipple, shared the same way: both passes must discard identically. */
const TUFT_STIPPLE_DECL = /* glsl */ `
varying vec4 vTuftGrain;

// Fract-based, not sine-based: sin loses its fractional bits at large
// lattice indices and quantises into visible bands.
float coverHash(vec2 p) {
  vec3 q = fract(vec3(p.x, p.y, p.x) * 0.1031);
  q += dot(q, q.yzx + 33.33);
  return fract((q.x + q.y) * q.z);
}
`;

const TUFT_STIPPLE_TEST = /* glsl */ `
if (vTuftGrain.z < 1.0 && coverHash(floor(vTuftGrain.xy * 32.0)) > vTuftGrain.z) discard;
`;

TUFT_MATERIAL.onBeforeCompile = (shader) => {
  Object.assign(shader.uniforms, windUniforms, coverUniforms);
  patchTuftVertex(shader);

  shader.fragmentShader = shader.fragmentShader
    .replace(
      '#include <common>',
      /* glsl */ `#include <common>
      uniform vec3 coverSunDir;
      uniform vec3 coverGlow;
      varying vec3 vTuftTint;
      varying vec3 vTuftWorld;
      ${COVER_WEATHER}
      ${TUFT_STIPPLE_DECL}
      `,
    )
    .replace(
      '#include <clipping_planes_fragment>',
      // The feathery edge is a stipple, which is what this pipeline quantises
      // a soft edge into anyway.
      /* glsl */ `#include <clipping_planes_fragment>
      ${TUFT_STIPPLE_TEST}
      `,
    )
    .replace(
      '#include <normal_fragment_begin>',
      /* glsl */ `#include <normal_fragment_begin>
      normal = normalize(vNormal);
      `,
    )
    .replace(
      '#include <color_fragment>',
      /* glsl */ `#include <color_fragment>
      diffuseColor.rgb = coverWeather(diffuseColor.rgb * vTuftTint);
      `,
    )
    .replace(
      '#include <opaque_fragment>',
      // Looking through a plume toward a low sun lights it from behind.
      /* glsl */ `vec3 coverBack = normalize(vTuftWorld - cameraPosition);
      outgoingLight += diffuseColor.rgb * coverGlow
        * (pow(max(dot(coverBack, coverSunDir), 0.0), 4.0) * vTuftGrain.w);
      #include <opaque_fragment>
      `,
    );
};

TUFT_MATERIAL.customProgramCacheKey = () => 'cover-tufts';

/**
 * The same cover, for the normal buffer. `PixelStage` renders the scene with an
 * override that cannot know the instanced construction, so the cover meshes swap
 * to these and draw themselves in afterwards — otherwise the edge detector
 * outlines whatever stands behind a blade straight through it. Same vertex build
 * and same discard, so the two buffers agree per pixel.
 */
// The same air as everything else outdoors. After the patch above, not before:
// the chain composes onto whatever `onBeforeCompile` is already there.
applyAerialFog(COVER_MATERIAL);
applyAerialFog(TUFT_MATERIAL);

export const COVER_NORMAL_MATERIAL = new THREE.MeshNormalMaterial({ side: THREE.DoubleSide });

COVER_NORMAL_MATERIAL.onBeforeCompile = (shader) => {
  Object.assign(shader.uniforms, windUniforms, coverUniforms);
  patchBladeVertex(shader);
  shader.fragmentShader = shader.fragmentShader.replace(
    '#include <normal_fragment_begin>',
    /* glsl */ `#include <normal_fragment_begin>
    normal = normalize(vNormal);
    `,
  );
};

COVER_NORMAL_MATERIAL.customProgramCacheKey = () => 'cover-blades-normal';

export const TUFT_NORMAL_MATERIAL = new THREE.MeshNormalMaterial({ side: THREE.DoubleSide });

TUFT_NORMAL_MATERIAL.onBeforeCompile = (shader) => {
  Object.assign(shader.uniforms, windUniforms, coverUniforms);
  patchTuftVertex(shader);
  // The normal fragment has no <common> include; <packing> is its anchor.
  shader.fragmentShader = shader.fragmentShader
    .replace(
      '#include <packing>',
      /* glsl */ `#include <packing>
      ${TUFT_STIPPLE_DECL}
      `,
    )
    .replace(
      '#include <clipping_planes_fragment>',
      /* glsl */ `#include <clipping_planes_fragment>
      ${TUFT_STIPPLE_TEST}
      `,
    )
    .replace(
      '#include <normal_fragment_begin>',
      /* glsl */ `#include <normal_fragment_begin>
      normal = normalize(vNormal);
      `,
    );
};

TUFT_NORMAL_MATERIAL.customProgramCacheKey = () => 'cover-tufts-normal';

// --- base geometry -----------------------------------------------------------

/** The one blade every instance draws: a tapered ribbon on (side, t). `z` marks the far blade for the shader. */
function bladeGeometry(segments: number, z: number): THREE.BufferGeometry {
  const positions: number[] = [];
  const normals: number[] = [];
  const index: number[] = [];
  for (let i = 0; i < segments; i++) {
    const t = i / segments;
    positions.push(-1, t, z, 1, t, z);
    normals.push(0, 1, 0, 0, 1, 0);
  }
  positions.push(0, 1, z);
  normals.push(0, 1, 0);
  for (let i = 0; i < segments - 1; i++) {
    const a = i * 2;
    index.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
  }
  index.push(segments * 2 - 2, segments * 2 - 1, segments * 2);

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geometry.setIndex(index);
  return geometry;
}

const BLADE_GEOMETRY = bladeGeometry(SEGMENTS, 0);
/** The far blade: one triangle, same shader. */
const TRI_GEOMETRY = bladeGeometry(1, 1);

/** Vertex sink for the authored prop meshes. */
interface TuftSink {
  position: number[];
  color: number[];
  fin: number[];
  index: number[];
}

function tuftVertex(
  sink: TuftSink,
  x: number,
  y: number,
  z: number,
  color: THREE.Color,
  u: number,
  v: number,
  puff: number,
  solid: number,
): number {
  sink.position.push(x, y, z);
  sink.color.push(color.r, color.g, color.b);
  sink.fin.push(u, v, puff, solid);
  return sink.position.length / 3 - 1;
}

function tuftQuad(sink: TuftSink, a: number, b: number, c: number, d: number): void {
  sink.index.push(a, b, c, b, d, c);
}

function tuftGeometry(sink: TuftSink): THREE.BufferGeometry {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(sink.position, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(sink.color, 3));
  geometry.setAttribute('fin', new THREE.Float32BufferAttribute(sink.fin, 4));
  geometry.setIndex(sink.index);
  return geometry;
}

/**
 * One fin of plume: a lance whose width and solidity both taper to nothing at
 * its base and its tip, so it grows out of whatever it stands on. `haze` fades
 * the whole fin toward stipple.
 */
function plumeFin(
  sink: TuftSink,
  angle: number,
  y0: number,
  y1: number,
  reach: number,
  widest: number,
  haze: number,
  uvOff: number,
): void {
  const ROWS = 5;
  const dx = Math.cos(angle);
  const dz = Math.sin(angle);
  const px = -dz;
  const pz = dx;
  const bright = new THREE.Color();
  const rows: [number, number, number][] = [];
  for (let r = 0; r <= ROWS; r++) {
    const s = r / ROWS;
    const y = y0 + (y1 - y0) * s;
    const out = 0.008 + reach * s ** 0.9;
    const lance = Math.max(0, 1 - Math.abs(s - 0.45) / 0.55) ** 0.9;
    const halfW = 0.006 + widest * lance;
    const puff = 0.4 + 0.45 * Math.min(1, Math.max(0, (y - 0.9) / 0.9));
    const spine = (1.05 - 0.45 * s) * lance * (1 - 0.55 * haze) + 0.12;
    const rim = (0.3 - 0.3 * s) * lance * (1 - 0.6 * haze);
    bright.setScalar(0.72 + 0.28 * Math.min(1, Math.max(0, (y - 0.95) / 0.85)));
    const left = tuftVertex(
      sink, out * dx - halfW * px, y, out * dz - halfW * pz, bright, uvOff, s, puff, rim,
    );
    const mid = tuftVertex(sink, out * dx, y, out * dz, bright, uvOff + 0.5, s, puff, spine);
    const right = tuftVertex(
      sink, out * dx + halfW * px, y, out * dz + halfW * pz, bright, uvOff + 1, s, puff, rim,
    );
    rows.push([left, mid, right]);
  }
  for (let r = 0; r < ROWS; r++) {
    const [a0, a1, a2] = rows[r];
    const [b0, b1, b2] = rows[r + 1];
    tuftQuad(sink, a0, a1, b0, b1);
    tuftQuad(sink, a1, a2, b1, b2);
  }
}

/**
 * A pampas stalk, and a plume built in tiers: wisps hugging the stem from partway
 * down, a body of solid fins with hazier ones between, and a narrower crown
 * reaching past them. Every fin tapers into the stalk at its base, which keeps
 * the fluff from reading as a blob balanced on a stick.
 */
function plumeGeometry(): THREE.BufferGeometry {
  const sink: TuftSink = { position: [], color: [], fin: [], index: [] };
  const straw = new THREE.Color(0x8a8050);

  for (const angle of [0, Math.PI / 2]) {
    const dx = Math.cos(angle);
    const dz = Math.sin(angle);
    const b0 = tuftVertex(sink, -0.016 * dx, 0, -0.016 * dz, straw, 0, 0, 0.05, 1);
    const b1 = tuftVertex(sink, 0.016 * dx, 0, 0.016 * dz, straw, 1, 0, 0.05, 1);
    const t0 = tuftVertex(sink, -0.007 * dx, 1.3, -0.007 * dz, straw, 0, 1, 0.4, 1);
    const t1 = tuftVertex(sink, 0.007 * dx, 1.3, 0.007 * dz, straw, 1, 1, 0.4, 1);
    tuftQuad(sink, b0, b1, t0, t1);
  }

  // Wisps: where the plume starts leaving the stem.
  plumeFin(sink, 0.7, 0.92, 1.25, 0.1, 0.05, 0.75, 0);
  plumeFin(sink, 3.6, 0.96, 1.28, 0.1, 0.05, 0.75, 1.7);
  // The body, and the haze between its fins.
  plumeFin(sink, 0.0, 1.08, 1.55, 0.16, 0.11, 0, 3.4);
  plumeFin(sink, 2.09, 1.1, 1.52, 0.16, 0.11, 0, 5.1);
  plumeFin(sink, 4.19, 1.06, 1.56, 0.16, 0.11, 0, 6.8);
  plumeFin(sink, 1.05, 1.05, 1.6, 0.2, 0.13, 0.6, 8.5);
  plumeFin(sink, 3.14, 1.08, 1.58, 0.2, 0.13, 0.6, 10.2);
  plumeFin(sink, 5.24, 1.02, 1.62, 0.2, 0.13, 0.6, 11.9);
  // The crown, narrower and highest.
  plumeFin(sink, 0.5, 1.3, 1.82, 0.1, 0.085, 0.25, 13.6);
  plumeFin(sink, 2.6, 1.32, 1.8, 0.1, 0.085, 0.25, 15.3);
  plumeFin(sink, 4.7, 1.28, 1.84, 0.1, 0.085, 0.25, 17);

  return tuftGeometry(sink);
}

/**
 * A clover stalk: a short stem and three round leaflets tilted up around its
 * top. The instance tint carries the green; the stem is authored pale so it
 * comes out a quieter shade of the same.
 */
function leafGeometry(): THREE.BufferGeometry {
  const sink: TuftSink = { position: [], color: [], fin: [], index: [] };
  const stem = new THREE.Color(0.8, 0.85, 0.75);
  const leaf = new THREE.Color(1, 1, 1);

  for (const angle of [0, Math.PI / 2]) {
    const dx = Math.cos(angle);
    const dz = Math.sin(angle);
    const b0 = tuftVertex(sink, -0.006 * dx, 0, -0.006 * dz, stem, 0, 0, 0.15, 1);
    const b1 = tuftVertex(sink, 0.006 * dx, 0, 0.006 * dz, stem, 1, 0, 0.15, 1);
    const t0 = tuftVertex(sink, -0.004 * dx, 0.07, -0.004 * dz, stem, 0, 1, 0.35, 1);
    const t1 = tuftVertex(sink, 0.004 * dx, 0.07, 0.004 * dz, stem, 1, 1, 0.35, 1);
    tuftQuad(sink, b0, b1, t0, t1);
  }

  for (let l = 0; l < 3; l++) {
    const angle = (l / 3) * Math.PI * 2;
    const dx = Math.cos(angle);
    const dz = Math.sin(angle);
    const px = -dz;
    const pz = dx;
    const a0 = tuftVertex(sink, 0.004 * dx - 0.013 * px, 0.066, 0.004 * dz - 0.013 * pz, leaf, 0, 0, 0.4, 1);
    const a1 = tuftVertex(sink, 0.004 * dx + 0.013 * px, 0.066, 0.004 * dz + 0.013 * pz, leaf, 1, 0, 0.4, 1);
    const b0 = tuftVertex(sink, 0.036 * dx - 0.016 * px, 0.08, 0.036 * dz - 0.016 * pz, leaf, 0, 1, 0.45, 1);
    const b1 = tuftVertex(sink, 0.036 * dx + 0.016 * px, 0.08, 0.036 * dz + 0.016 * pz, leaf, 1, 1, 0.45, 1);
    tuftQuad(sink, a0, a1, b0, b1);
  }

  return tuftGeometry(sink);
}

/** A flower: a crossed stem and a small crossed head the instance tint colours. */
function bloomGeometry(): THREE.BufferGeometry {
  const sink: TuftSink = { position: [], color: [], fin: [], index: [] };
  const stem = new THREE.Color(0x5f7040);
  const head = new THREE.Color(1, 1, 1);

  for (const angle of [0, Math.PI / 2]) {
    const dx = Math.cos(angle);
    const dz = Math.sin(angle);
    const b0 = tuftVertex(sink, -0.009 * dx, 0, -0.009 * dz, stem, 0, 0, 0.1, 1);
    const b1 = tuftVertex(sink, 0.009 * dx, 0, 0.009 * dz, stem, 1, 0, 0.1, 1);
    const t0 = tuftVertex(sink, -0.005 * dx, 0.3, -0.005 * dz, stem, 0, 1, 0.45, 1);
    const t1 = tuftVertex(sink, 0.005 * dx, 0.3, 0.005 * dz, stem, 1, 1, 0.45, 1);
    tuftQuad(sink, b0, b1, t0, t1);

    const h0 = tuftVertex(sink, -0.05 * dx, 0.27, -0.05 * dz, head, 0, 0, 0.5, 1);
    const h1 = tuftVertex(sink, 0.05 * dx, 0.27, 0.05 * dz, head, 1, 0, 0.5, 1);
    const h2 = tuftVertex(sink, -0.05 * dx, 0.37, -0.05 * dz, head, 0, 1, 0.55, 1);
    const h3 = tuftVertex(sink, 0.05 * dx, 0.37, 0.05 * dz, head, 1, 1, 0.55, 1);
    tuftQuad(sink, h0, h1, h2, h3);
  }

  return tuftGeometry(sink);
}

/**
 * One flat leaf quad in the wall plane, tipped slightly out. `cell` pins the
 * whole quad to one stipple cell, so a `solid` under 1 drops the leaf per
 * instance rather than eating its pixels.
 */
function wallLeaf(
  sink: TuftSink,
  x: number,
  y: number,
  z: number,
  half: number,
  spin: number,
  color: THREE.Color,
  cell: number,
  puff: number,
  solid: number,
): void {
  const rx = Math.cos(spin) * half;
  const ry = Math.sin(spin) * half;
  const ux = -Math.sin(spin) * half;
  const uy = Math.cos(spin) * half;
  const uz = half * 0.5;
  const u = (cell * 0.173) % 1;
  const v = (cell * 0.317) % 1;
  const a0 = tuftVertex(sink, x - rx - ux, y - ry - uy, z - uz, color, u, v, puff, solid);
  const a1 = tuftVertex(sink, x + rx - ux, y + ry - uy, z - uz, color, u, v, puff, solid);
  const b0 = tuftVertex(sink, x - rx + ux, y - ry + uy, z + uz, color, u, v, puff, solid);
  const b1 = tuftVertex(sink, x + rx + ux, y + ry + uy, z + uz, color, u, v, puff, solid);
  tuftQuad(sink, a0, a1, b0, b1);
}

/**
 * A crawl of ivy, authored in the wall's frame — X along it, Y up it, +Z out of
 * it. Wandering vine runs with leaves scattered along them, each leaf droppable
 * per instance. Leaves are authored white and the vines dimmer, so the instance
 * tint comes out as darker lines of the same green.
 */
function ivyGeometry(): THREE.BufferGeometry {
  const sink: TuftSink = { position: [], color: [], fin: [], index: [] };
  const vine = new THREE.Color(0.5, 0.55, 0.45);
  const leaf = new THREE.Color();

  const RUNS: readonly (readonly [number, number])[][] = [
    [[0, 0], [-0.13, 0.15], [-0.21, 0.33], [-0.16, 0.47]],
    [[0, 0], [0.1, 0.12], [0.23, 0.25], [0.27, 0.42]],
    [[0, 0], [0.15, -0.02], [0.29, 0.07]],
    [[0, 0], [-0.07, -0.13], [-0.19, -0.2]],
  ];
  for (const run of RUNS) {
    for (let s = 0; s + 1 < run.length; s++) {
      const [ax, ay] = run[s];
      const [bx, by] = run[s + 1];
      const dx = bx - ax;
      const dy = by - ay;
      const inv = 0.009 / Math.max(Math.hypot(dx, dy), 0.001);
      const px = dy * inv;
      const py = -dx * inv;
      const z0 = 0.012 + s * 0.004;
      const a0 = tuftVertex(sink, ax - px, ay - py, z0, vine, 0, 0, 0.04 + s * 0.05, 1);
      const a1 = tuftVertex(sink, ax + px, ay + py, z0, vine, 1, 0, 0.04 + s * 0.05, 1);
      const b0 = tuftVertex(sink, bx - px, by - py, z0 + 0.004, vine, 0, 1, 0.09 + s * 0.05, 1);
      const b1 = tuftVertex(sink, bx + px, by + py, z0 + 0.004, vine, 1, 1, 0.09 + s * 0.05, 1);
      tuftQuad(sink, a0, a1, b0, b1);
    }
  }

  // Leaves along the runs, each near a vine point but off it a little. Only
  // the third of each triple is droppable: a crawl varies at its fringe and
  // stays a crawl at its heart, where dropping any leaf leaves bare wall.
  let cell = 0;
  for (const run of RUNS) {
    for (let p = 0; p < run.length; p++) {
      for (let l = 0; l < 3; l++) {
        cell++;
        const j1 = ((cell * 0.618) % 1) - 0.5;
        const j2 = ((cell * 0.414) % 1) - 0.5;
        const x = run[p][0] + j1 * 0.1;
        const y = run[p][1] + j2 * 0.1 + 0.02;
        const z = 0.024 + 0.028 * ((cell * 0.271) % 1);
        const half = 0.027 + 0.014 * ((cell * 0.372) % 1);
        leaf.setScalar(0.82 + 0.32 * ((cell * 0.417) % 1));
        const solid = l === 2 ? 0.72 : 1;
        wallLeaf(sink, x, y, z, half, cell * 2.4, leaf, cell, 0.1 + 0.1 * ((cell * 0.19) % 1), solid);
      }
    }
  }

  return tuftGeometry(sink);
}

/**
 * The stalk holding a wall bloom out off its wall. Authored dark, so whatever
 * the instance tint is it comes out a line rather than more flower.
 */
function wallStem(
  sink: TuftSink,
  x0: number,
  y0: number,
  z0: number,
  x1: number,
  y1: number,
  z1: number,
  puff: number,
): void {
  const stem = new THREE.Color(0.34, 0.36, 0.3);
  const half = 0.005;
  const a0 = tuftVertex(sink, x0 - half, y0, z0, stem, 0.11, 0.23, 0.03, 1);
  const a1 = tuftVertex(sink, x0 + half, y0, z0, stem, 0.11, 0.23, 0.03, 1);
  const b0 = tuftVertex(sink, x1 - half, y1, z1, stem, 0.11, 0.23, puff, 1);
  const b1 = tuftVertex(sink, x1 + half, y1, z1, stem, 0.11, 0.23, puff, 1);
  tuftQuad(sink, a0, a1, b0, b1);
}

/**
 * A posy for the climbing rose: three rosettes held just off the wall — five
 * petal quads fanned round a darker centre disc, with a depth fin so the bloom
 * has body edge-on — and a couple of tight buds. Authored white with a dark
 * heart; the instance tint is the rose.
 */
function posyGeometry(): THREE.BufferGeometry {
  const sink: TuftSink = { position: [], color: [], fin: [], index: [] };
  const petal = new THREE.Color();
  const heart = new THREE.Color(0.45, 0.4, 0.42);
  // Held off the wall by more than the foliage is thick, for the reason the
  // racemes are: a bloom among leaves, not behind them.
  const BLOOMS: readonly [number, number, number, number][] = [
    // x, y, z off the wall, size
    [0.03, 0.05, 0.105, 0.034],
    [-0.055, -0.005, 0.088, 0.026],
    [0.015, -0.06, 0.118, 0.022],
  ];
  BLOOMS.forEach(([x, y, z, size], i) => {
    wallStem(sink, x * 0.3, y * 0.3 - 0.03, 0.02, x, y, z - size * 0.4, 0.14);
    for (let p = 0; p < 5; p++) {
      const spin = i * 1.1 + (p / 5) * Math.PI * 2;
      const px = x + Math.cos(spin) * size * 0.8;
      const py = y + Math.sin(spin) * size * 0.8;
      petal.setScalar(0.82 + 0.24 * (((i * 5 + p) * 0.618) % 1));
      wallLeaf(sink, px, py, z + 0.006 * (p % 2), size * 0.62, spin + 0.8, petal, 40 + i * 5 + p, 0.18, 1);
    }
    // The heart, forward of the petals so it wins the depth test.
    wallLeaf(sink, x, y, z + 0.012, size * 0.42, i * 0.7, heart, 60 + i, 0.15, 1);
    // The depth fin: body when the bloom is seen edge-on.
    petal.setScalar(0.9);
    const c0 = tuftVertex(sink, x - size * 0.7, y, z - size * 0.7, petal, 0.31, 0.57, 0.15, 1);
    const c1 = tuftVertex(sink, x + size * 0.7, y, z - size * 0.7, petal, 0.31, 0.57, 0.15, 1);
    const d0 = tuftVertex(sink, x - size * 0.7, y, z + size * 0.7, petal, 0.31, 0.57, 0.2, 1);
    const d1 = tuftVertex(sink, x + size * 0.7, y, z + size * 0.7, petal, 0.31, 0.57, 0.2, 1);
    tuftQuad(sink, c0, c1, d0, d1);
  });
  // Buds: small, dimmer, droppable per instance so the count varies.
  petal.setScalar(0.7);
  wallLeaf(sink, -0.02, 0.09, 0.082, 0.011, 0.5, petal, 70, 0.2, 0.8);
  wallLeaf(sink, 0.07, -0.01, 0.092, 0.009, 1.3, petal, 71, 0.2, 0.8);
  return tuftGeometry(sink);
}

/** Deterministic wobble for authoring — irregularity without an `Rng`. */
function wob(i: number, k: number): number {
  return ((i + 1) * 0.6180339887 + k * 0.4142135624) % 1;
}

/**
 * A wisteria raceme: two crossed strips as the hanging core, drifting as they
 * fall, with florets stuck out around the chain, shrinking and fading toward the
 * stippled tail. Nothing about it is regular, and every floret is pinned to its
 * own stipple cell below full solidity, so no two instances carry the same
 * silhouette. Instances also turn about the hang; see `PROP_TURN`.
 */
function racemeGeometry(): THREE.BufferGeometry {
  const sink: TuftSink = { position: [], color: [], fin: [], index: [] };
  const bloom = new THREE.Color();
  const LEVELS = 7;

  // Held well off the wall — the foliage it hangs through is a good 8 cm
  // thick, and a raceme buried in leaves is a raceme nobody sees.
  const centers: [number, number, number][] = [];
  for (let l = 0; l <= LEVELS; l++) {
    const s = l / LEVELS;
    centers.push([
      Math.sin(l * 1.7) * 0.018 + (wob(l, 3) - 0.5) * 0.016,
      -0.03 - 0.44 * s - (wob(l, 5) - 0.5) * 0.02,
      0.125 + Math.cos(l * 1.3) * 0.014 + (wob(l, 7) - 0.5) * 0.012,
    ]);
  }

  // The peduncle: what it hangs from, so the chain reads as held out rather
  // than floating in front of the leaves.
  wallStem(sink, 0, 0.02, 0.02, centers[0][0], centers[0][1] + 0.01, centers[0][2], 0.1);

  for (const angle of [0, Math.PI / 2]) {
    const dx = Math.cos(angle);
    const dz = Math.sin(angle);
    const rows: [number, number][] = [];
    for (let l = 0; l <= LEVELS; l++) {
      const s = l / LEVELS;
      const [cx, cy, cz] = centers[l];
      // Pinched where the wobble says, so the core is a knobbly chain rather
      // than a smooth cone.
      const half = (0.006 + 0.036 * (1 - s * 0.8)) * (0.7 + 0.6 * wob(l, 11 + angle));
      const puff = 0.25 + 0.5 * s;
      const solid = s < 0.55 ? 1 : s < 0.9 ? 0.85 : 0.55;
      bloom.setScalar(1 - 0.18 * s);
      const v0 = tuftVertex(sink, cx - dx * half, cy, cz - dz * half, bloom, angle, s, puff, solid);
      const v1 = tuftVertex(sink, cx + dx * half, cy, cz + dz * half, bloom, angle + 1, s, puff, solid);
      rows.push([v0, v1]);
    }
    for (let l = 0; l < LEVELS; l++) {
      tuftQuad(sink, rows[l][0], rows[l][1], rows[l + 1][0], rows[l + 1][1]);
    }
  }

  // Florets around the chain: what makes it a stack of flowers rather than a
  // cone. Two or three to a level, and every one droppable.
  let cell = 80;
  for (let l = 0; l <= LEVELS; l++) {
    const s = l / LEVELS;
    const [cx, cy, cz] = centers[l];
    const count = wob(l, 13) > 0.45 ? 3 : 2;
    for (let p = 0; p < count; p++) {
      cell++;
      const phi = l * 2.1 + (p / count) * Math.PI * 2 + wob(cell, 17) * 1.5;
      const reach = (0.014 + 0.038 * (1 - s * 0.75)) * (0.68 + 0.62 * wob(cell, 19));
      const ox = Math.cos(phi) * reach;
      // Biased outward, so the back of the ring hangs in front of the leaves
      // rather than reaching back into the wall.
      const oz = reach * (0.35 + 0.75 * Math.sin(phi));
      const half = (0.017 * (1 - s * 0.6) + 0.004) * (0.7 + 0.7 * wob(cell, 23));
      // Some hang, some tuck up under the one above.
      const drop = 0.9 + 1.4 * wob(cell, 29);
      bloom.setScalar(0.94 + 0.18 * wob(cell, 31) - 0.22 * s);
      const u = (cell * 0.173) % 1;
      const v = (cell * 0.317) % 1;
      // Every floret drops on some instances, more toward the tail. This is
      // what stops one mesh reading as one shape.
      const solid = 0.78 - 0.22 * s;
      const puff = 0.3 + 0.5 * s;
      // A petal spanning outward and down, so the cluster reads knobbly.
      const a0 = tuftVertex(sink, cx + ox - oz * 0.4, cy - 0.004, cz + oz + ox * 0.4, bloom, u, v, puff, solid);
      const a1 = tuftVertex(sink, cx + ox + oz * 0.4, cy - 0.004, cz + oz - ox * 0.4, bloom, u, v, puff, solid);
      const b0 = tuftVertex(sink, cx + ox * 1.6 - oz * 0.4, cy - 0.004 - half * drop, cz + oz * 1.6 + ox * 0.4, bloom, u, v, puff, solid);
      const b1 = tuftVertex(sink, cx + ox * 1.6 + oz * 0.4, cy - 0.004 - half * drop, cz + oz * 1.6 - ox * 0.4, bloom, u, v, puff, solid);
      tuftQuad(sink, a0, a1, b0, b1);
    }
  }

  return tuftGeometry(sink);
}

const PROP_GEOMETRY: Record<PropLayer['kind'], () => THREE.BufferGeometry> = {
  plume: plumeGeometry,
  bloom: bloomGeometry,
  leaf: leafGeometry,
  ivy: ivyGeometry,
  posy: posyGeometry,
  raceme: racemeGeometry,
};

const propGeometry: Partial<Record<PropLayer['kind'], THREE.BufferGeometry>> = {};

// --- the meshes --------------------------------------------------------------

/**
 * Every cover mesh currently standing, so the toggle and the density fraction
 * can reach them. Pruned on geometry disposal, which `Zone.dispose` does.
 */
const live = new Set<THREE.Mesh>();

let drawDensity = 1;

/**
 * The whole sampled field for one chunk, on the heap. The type table is authored
 * at ultra and lower tiers draw a prefix of the shuffled pool, so this is kept
 * and a tier can be raised again without resampling.
 */
interface CoverPool {
  base: THREE.BufferGeometry;
  place: Float32Array;
  attributes: Record<string, [Float32Array, number]>;
  /** Instances currently uploaded. Everything past this is heap-only. */
  resident: number;
  /** Instances the tier wants uploaded whenever the mesh is needed. */
  wanted: number;
  /** Whether the camera could see anything this mesh draws. Off long enough, it is released. */
  needed: boolean;
  idleSince: number;
  /** The whole chunk, object space, whatever is uploaded. */
  sphere: THREE.Sphere;
  /** Largest square metres one instance accounts for. Zero where the chunk never thins. */
  area: number;
  /** The far, one-triangle blade of a pair. */
  tri: boolean;
}

/** How long a mesh nothing can see keeps its buffers, so a walk along the swap band does not thrash. */
const RELEASE_MS = 4000;

let lod: CoverLod = { blades: 1.5, grazing: 1, sprout: 0.12, sheen: 0.18, swapAt: 0 };

const pools = new WeakMap<THREE.Mesh, CoverPool>();

/** Drops the mesh out of `live` when its geometry goes. See `upload`. */
const pruners = new WeakMap<THREE.Mesh, () => void>();

function poolFor(mesh: THREE.Mesh): CoverPool {
  const pool = pools.get(mesh);
  if (!pool) throw new Error(`cover mesh ${mesh.name} has no pool`);
  return pool;
}

/**
 * Uploads the first `count` instances of a chunk, and releases what was there.
 * An attribute's buffer is the whole array it was built from whatever
 * `instanceCount` says, and three cannot resize one — so this builds a geometry
 * over the front of the same arrays and disposes the old one, which is the only
 * public way to free a buffer. The arrays are views, not copies.
 */
function upload(mesh: THREE.Mesh, count: number): void {
  const pool = poolFor(mesh);
  const geometry = new THREE.InstancedBufferGeometry();
  // Cloned, not shared: `Zone.dispose` calls `dispose()` on this geometry, and
  // three answers by deleting the GPU buffer behind every attribute it holds, so
  // a shared one would tear the buffers out from under every other chunk.
  const index = pool.base.getIndex();
  if (index) geometry.setIndex(index.clone());
  for (const [attr, attribute] of Object.entries(pool.base.attributes)) {
    geometry.setAttribute(attr, (attribute as THREE.BufferAttribute).clone());
  }
  geometry.setAttribute(
    'iPlace',
    new THREE.InstancedBufferAttribute(pool.place.subarray(0, count * 4), 4),
  );
  for (const [attr, [data, size]] of Object.entries(pool.attributes)) {
    geometry.setAttribute(
      attr,
      new THREE.InstancedBufferAttribute(data.subarray(0, count * size), size),
    );
  }
  geometry.instanceCount = count;
  geometry.boundingSphere = pool.sphere.clone();

  const prune = pruners.get(mesh);
  const old = mesh.geometry;
  if (old && prune) old.removeEventListener('dispose', prune);
  mesh.geometry = geometry;
  if (prune) geometry.addEventListener('dispose', prune);
  old?.dispose();
  pool.resident = count;
}

function refreshDraw(mesh: THREE.Mesh): void {
  const full = mesh.userData.coverFull as number;
  // Props thin on a gentler curve: they are the accents, and a plume field
  // thinned as hard as its grass would be a field with no plumes in it.
  const fraction =
    mesh.name === 'cover-blades' ? drawDensity : Math.sqrt(Math.max(drawDensity, 0));
  const pool = poolFor(mesh);
  pool.wanted = Math.round(full * fraction);
  if (!pool.needed) return;
  mesh.visible = pool.wanted > 0;
  if (pool.resident !== pool.wanted) upload(mesh, pool.wanted);
}

/** Sets the distance LOD. The shader reads the uniforms; the chunk cap reads the rest per frame. */
export function setCoverLod(settings: CoverLod): void {
  lod = { ...settings };
  coverUniforms.coverLodScale.value = Math.sqrt(Math.max(lod.blades, 0));
  coverUniforms.coverGrazing.value = Math.min(Math.max(lod.grazing, 0), 1);
  coverUniforms.coverSprout.value = Math.min(Math.max(lod.sprout, 0), 0.95);
  coverUniforms.coverSheen.value = lod.sheen;
  coverUniforms.coverSwap.value = Math.max(lod.swapAt, 0);
}

/**
 * Sets what the cover is drawn at. `density` thins by drawing a prefix of each
 * chunk's instances, which are shuffled at build, so a prefix is an even
 * scatter. Changing the tier re-uploads each chunk: tens of milliseconds, once,
 * on a settings change.
 */
export function setCoverDraw(density: number, height: number, width: number): void {
  drawDensity = Math.min(Math.max(density, 0), 1);
  coverUniforms.coverHeight.value = height;
  coverUniforms.coverWidth.value = width;
  for (const mesh of live) refreshDraw(mesh);
}

/**
 * Per frame: the width clamp's pixel size, the tread sphere, and the plume
 * backlight. `artHeight` is the render height in chunky pixels, and with the
 * camera's projection it gives the world size of one art pixel at unit depth —
 * the floor no blade projects under.
 */
export function updateCover(
  camera: THREE.PerspectiveCamera,
  artHeight: number,
  player: THREE.Vector3,
  sun?: THREE.DirectionalLight | null,
): void {
  coverUniforms.coverPixel.value = 2 / (camera.projectionMatrix.elements[5] * Math.max(artHeight, 1));
  coverUniforms.coverPlayer.value.copy(player);
  capChunks(camera);
  const glow = coverUniforms.coverGlow.value;
  if (sun) {
    const dir = coverUniforms.coverSunDir.value;
    dir.copy(sun.position).normalize();
    // Strongest with the sun low — the golden-hour shot — but never quite
    // gone, so a plume field always has a bright side.
    const low = 0.15 + 0.85 * Math.max(0, 1 - Math.abs(dir.y) / 0.5) ** 2;
    glow.copy(sun.color).multiplyScalar(sun.intensity * 0.5 * low);
  } else {
    glow.setRGB(0, 0, 0);
  }
}

const CAP_EYE = new THREE.Vector3();
const CAP_CENTRE = new THREE.Vector3();

/**
 * Per frame, per chunk: the largest rank the keep test could pass anywhere in
 * it, from the camera's distance to its sphere, and `instanceCount` set to
 * that. The shuffled order makes the prefix an even scatter and the shader
 * decides per blade inside it. Generous on purpose — the nearest point and the
 * steepest view — so a blade the shader would keep is never cut by the cap.
 *
 * The same distances decide which of a chunk's two blade meshes is needed
 * past the swap band, and a mesh nothing can see is released after a grace.
 */
function capChunks(camera: THREE.Camera): void {
  const now = performance.now();
  const eye = camera.getWorldPosition(CAP_EYE);
  const pixel = coverUniforms.coverPixel.value;
  const swap = lod.swapAt;
  for (const mesh of live) {
    const pool = pools.get(mesh);
    if (!pool) continue;
    const m = mesh.matrixWorld.elements;
    const scale = Math.sqrt(m[0] * m[0] + m[1] * m[1] + m[2] * m[2]);
    const centre = CAP_CENTRE.copy(pool.sphere.center).applyMatrix4(mesh.matrixWorld);
    const radius = pool.sphere.radius * scale;
    const dist = centre.distanceTo(eye);
    const dMin = Math.max(0, dist - radius);
    const dMax = dist + radius;

    let needed = true;
    if (mesh.userData.coverPair) {
      if (swap > 0) needed = pool.tri ? dMax > swap * 0.8 : dMin < swap * 1.2;
      else needed = !pool.tri;
    }

    const full = mesh.userData.coverFull as number;
    let cap = full;
    if (pool.area > 0 && dMin > 0) {
      // Vertical at the nearest point, with slack for a slope that faces the eye.
      const cos = Math.min(1, Math.max(0.02, (1.5 * (eye.y - centre.y + radius)) / dMin));
      const reach = dMin * pixel;
      const fraction = (lod.blades * pool.area * Math.pow(cos, lod.grazing)) / (reach * reach);
      cap = Math.min(full, Math.ceil(fraction * full));
    }

    if (needed) {
      pool.idleSince = now;
      if (!pool.needed || pool.resident !== pool.wanted) {
        pool.needed = true;
        upload(mesh, pool.wanted);
      }
      const count = Math.min(pool.resident, cap);
      (mesh.geometry as THREE.InstancedBufferGeometry).instanceCount = count;
      mesh.visible = count > 0;
    } else {
      mesh.visible = false;
      pool.needed = false;
      if (pool.resident > 0 && now - pool.idleSince > RELEASE_MS) upload(mesh, 0);
    }
  }
}

/**
 * Draws the cover into the normal buffer, after the scene-wide override pass has
 * drawn everything else. Called by `PixelStage` with the normal target still
 * bound, so depth testing keeps a wall in front of a field here too.
 */
export function drawCoverNormals(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.Camera,
): void {
  let any = false;
  for (const mesh of live) {
    if (!mesh.visible) continue;
    mesh.material = mesh.userData.coverTuft ? TUFT_NORMAL_MATERIAL : COVER_NORMAL_MATERIAL;
    any = true;
  }
  if (any) {
    const mask = camera.layers.mask;
    const autoClear = renderer.autoClear;
    camera.layers.set(COVER_LAYER);
    renderer.autoClear = false;
    renderer.render(scene, camera);
    renderer.autoClear = autoClear;
    camera.layers.mask = mask;
  }
  for (const mesh of live) {
    mesh.material = mesh.userData.coverTuft ? TUFT_MATERIAL : COVER_MATERIAL;
  }
}

/** Deterministic shuffle, so thinning by prefix stays an even scatter. */
function shuffledOrder(count: number, seed: number): Uint32Array {
  const order = new Uint32Array(count);
  for (let i = 0; i < count; i++) order[i] = i;
  let s = (seed * 4294967296) | 0;
  for (let i = count - 1; i > 0; i--) {
    s = (Math.imul(s ^ (s >>> 15), 0x85ebca6b) + 0x6d2b79f5) | 0;
    const j = (s >>> 0) % (i + 1);
    const swap = order[i];
    order[i] = order[j];
    order[j] = swap;
  }
  return order;
}

function gather(src: ArrayLike<number>, order: Uint32Array, stride: number): Float32Array {
  const out = new Float32Array(src.length);
  for (let i = 0; i < order.length; i++) {
    for (let k = 0; k < stride; k++) out[i * stride + k] = src[order[i] * stride + k];
  }
  return out;
}

/** A sphere over every root in the chunk, opened by the tallest thing in it. */
function chunkSphere(place: Float32Array, count: number, margin: number): THREE.Sphere {
  const box = new THREE.Box3();
  const at = new THREE.Vector3();
  for (let i = 0; i < count; i++) {
    box.expandByPoint(at.set(place[i * 4], place[i * 4 + 1], place[i * 4 + 2]));
  }
  const sphere = new THREE.Sphere();
  box.getBoundingSphere(sphere);
  // An empty box gives back a radius of −1, and a negative radius is a trap
  // for whatever reads it next.
  sphere.radius = Math.max(sphere.radius, 0) + margin;
  return sphere;
}

/** `sqrt(area / rank)` per instance, after the shuffle: the keep test's right-hand side. Zero area never thins. */
function keepOf(area: Float32Array | ((i: number) => number), count: number): Float32Array {
  const keep = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const a = typeof area === 'function' ? area(i) : area[i];
    keep[i] = a > 0 ? Math.sqrt(a / ((i + 0.5) / count)) : 1e9;
  }
  return keep;
}

function chunkMesh(
  base: THREE.BufferGeometry,
  material: THREE.Material,
  name: string,
  count: number,
  sphere: THREE.Sphere,
  place: Float32Array,
  attributes: Record<string, [Float32Array, number]>,
  area: number,
  tri = false,
): THREE.Mesh {
  const mesh = new THREE.Mesh(new THREE.BufferGeometry(), material);
  mesh.name = name;
  mesh.castShadow = false;
  mesh.receiveShadow = true;
  mesh.userData.coverFull = count;
  // Also on the cover layer, so the normal pass can point a camera at cover
  // alone. See drawCoverNormals.
  mesh.layers.enable(COVER_LAYER);

  // Negative, so the first `refreshDraw` always uploads — including at zero,
  // which is what a zone built with cover off is worth in video memory. The
  // far blade starts unneeded and uploads the first time the cap asks for it.
  pools.set(mesh, {
    base,
    place,
    attributes,
    resident: -1,
    wanted: 0,
    needed: !tri,
    idleSince: 0,
    sphere,
    area,
    tri,
  });
  live.add(mesh);
  const prune = (): void => {
    live.delete(mesh);
  };
  pruners.set(mesh, prune);
  // On the placeholder too: a far mesh the cap never asked for still has to
  // leave `live` when its zone goes.
  mesh.geometry.addEventListener('dispose', prune);
  mesh.visible = false;
  refreshDraw(mesh);
  return mesh;
}

/** Builds the chunk meshes for a sampled field. Main thread, either way. */
function assemble(chunks: CoverChunks): THREE.Object3D {
  const group = new THREE.Group();
  group.name = 'cover';

  let seed = 0;
  for (const chunk of chunks.blades) {
    const count = chunk.place.length / 4;
    const order = shuffledOrder(count, hat(seed++, count, 7));
    const place = gather(chunk.place, order, 4);
    const wild = gather(chunk.wild, order, 4);
    let area = 0;
    for (let i = 0; i < count; i++) area = Math.max(area, wild[i * 4 + 3]);
    const attributes: Record<string, [Float32Array, number]> = {
      iShape: [gather(chunk.shape, order, 4), 4],
      iTint: [gather(chunk.tint, order, 3), 3],
      iWild: [wild, 4],
      iNormal: [gather(chunk.normal, order, 3), 3],
      iKeep: [keepOf((i) => wild[i * 4 + 3], count), 1],
    };
    const sphere = chunkSphere(place, count, chunks.maxLen * 2 + 0.5);
    // Two meshes over the same arrays: the ribbon and the far triangle. Each
    // upload owns its attributes, because disposing a geometry deletes the
    // buffers behind every attribute it holds.
    const ribbon = chunkMesh(BLADE_GEOMETRY, COVER_MATERIAL, 'cover-blades', count, sphere, place, attributes, area);
    const far = chunkMesh(TRI_GEOMETRY, COVER_MATERIAL, 'cover-blades', count, sphere, place, attributes, area, true);
    ribbon.userData.coverPair = true;
    far.userData.coverPair = true;
    group.add(ribbon, far);
  }

  for (const chunk of chunks.props) {
    const base = (propGeometry[chunk.kind] ??= PROP_GEOMETRY[chunk.kind]());
    const count = chunk.place.length / 4;
    const order = shuffledOrder(count, hat(seed++, count, 11));
    const place = gather(chunk.place, order, 4);
    const area = gather(chunk.area, order, 1);
    const mesh = chunkMesh(
      base,
      TUFT_MATERIAL,
      `cover-${chunk.kind}`,
      count,
      chunkSphere(place, count, 3),
      place,
      {
        iProp: [gather(chunk.prop, order, 4), 4],
        iTintP: [gather(chunk.tint, order, 3), 3],
        iNormalP: [gather(chunk.normal, order, 3), 3],
        iRoll: [gather(chunk.roll, order, 1), 1],
        iKeepP: [keepOf(area, count), 1],
      },
      PROP_LOD[chunk.kind] ? area.reduce((m, a) => Math.max(m, a), 0) : 0,
    );
    mesh.userData.coverTuft = true;
    group.add(mesh);
  }

  return group;
}

/**
 * Cover for a ground mesh, or null if it grows nothing. A mesh with no `cover`
 * attribute grows nothing unless `userData.cover` or `type` says otherwise,
 * which is what keeps gallery floors bare. Asynchronous because the sampling
 * happens in a worker — the longest arithmetic step in building a zone, and it
 * reads nothing but attributes and a seed. With no worker it samples in place,
 * and the answer is identical either way.
 */
export async function coverFor(
  ground: THREE.Mesh,
  type?: CoverName,
): Promise<THREE.Object3D | null> {
  // Asked here as well as in the sampler, so a mesh that grows nothing — which
  // is most of them — costs a property read rather than a round trip.
  const stated = type ?? (ground.userData.cover as CoverName | undefined);
  if (!ground.geometry.getAttribute(COVER_ATTRIBUTE) && (!stated || stated === 'none')) {
    return null;
  }

  const chunks = await sampleInWorker(ground, type);
  return chunks ? assemble(chunks) : null;
}

// --- the worker --------------------------------------------------------------

/**
 * The sampling worker, built on first use and kept for the session. `undefined`
 * means it has not been asked for yet, `null` that there is none to be had.
 * Both fall back to sampling in place, which is never wrong, only blocking.
 */
let worker: Worker | null | undefined;

/** Requests still out, by id. The mesh is held with each one, because the answer to a worker that dies is to sample its outstanding fields here. */
const waiting = new Map<
  number,
  { ground: THREE.Mesh; type?: CoverName; settle: (chunks: CoverChunks | null) => void }
>();
let nextRequest = 0;

/** Samples on this thread. The fallback, and what this all used to be. */
function sampleHere(ground: THREE.Mesh, type?: CoverName): CoverChunks | null {
  const sample = sampleCover(ground, type);
  return sample && (sample.bladeCount > 0 || sample.propCount > 0) ? packSample(sample) : null;
}

function coverWorker(): Worker | null {
  if (worker !== undefined) return worker;
  worker = null;
  if (typeof Worker === 'undefined') return worker;
  try {
    const made = new Worker(new URL('./cover.worker.ts', import.meta.url), { type: 'module' });
    made.onmessage = (event: MessageEvent<CoverReply>) => {
      const pending = waiting.get(event.data.id);
      waiting.delete(event.data.id);
      pending?.settle(event.data.chunks);
    };
    // A worker that has fallen over must not leave a zone waiting on it. Every
    // field still out is sampled here, and the ones after it go the same way.
    made.onerror = () => {
      worker = null;
      made.terminate();
      for (const pending of waiting.values()) pending.settle(sampleHere(pending.ground, pending.type));
      waiting.clear();
    };
    worker = made;
  } catch {
    // Nothing to report and nothing to do: the fallback is the same field,
    // sampled on this thread.
  }
  return worker;
}

/**
 * Flattens a ground mesh, samples it in the worker, and waits. Attributes are
 * read through `getX`/`getY` rather than copied off `attribute.array`: a ground
 * mesh that turned out interleaved, or shorts, would otherwise arrive as noise.
 */
async function sampleInWorker(ground: THREE.Mesh, type?: CoverName): Promise<CoverChunks | null> {
  const hired = coverWorker();
  if (!hired) return sampleHere(ground, type);

  const source = ground.geometry;
  const attributes: CoverRequest['attributes'] = {};
  for (const name of ['position', 'color', COVER_ATTRIBUTE, COVER_BLEND_ATTRIBUTE]) {
    const attribute = source.getAttribute(name);
    if (!attribute) continue;
    const size = attribute.itemSize;
    const data = new Float32Array(attribute.count * size);
    for (let i = 0; i < attribute.count; i++) {
      for (let k = 0; k < size; k++) data[i * size + k] = attribute.getComponent(i, k);
    }
    attributes[name] = { data, size };
  }

  const indexed = source.getIndex();
  const index = indexed ? new Uint32Array(indexed.count) : null;
  if (indexed && index) {
    for (let i = 0; i < indexed.count; i++) index[i] = indexed.getX(i);
  }

  ground.updateWorldMatrix(true, false);
  const request: CoverRequest = {
    id: nextRequest++,
    cover: type ?? (ground.userData.cover as CoverName | undefined),
    matrix: ground.matrixWorld.toArray(),
    attributes,
    index,
  };

  const answer = new Promise<CoverChunks | null>((resolve) => {
    waiting.set(request.id, { ground, type, settle: resolve });
  });
  const transfer: ArrayBufferLike[] = Object.values(attributes).map((a) => a.data.buffer);
  if (index) transfer.push(index.buffer);
  hired.postMessage(request, transfer as Transferable[]);
  return answer;
}

/** Headless count of what a mesh would grow, for the world check's budget. */
export function coverCensus(
  ground: THREE.Mesh,
  type?: CoverName,
): { blades: number; props: number } {
  const sample = sampleCover(ground, type);
  return { blades: sample?.bladeCount ?? 0, props: sample?.propCount ?? 0 };
}
