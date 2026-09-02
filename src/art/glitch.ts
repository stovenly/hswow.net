import * as THREE from 'three';
import { EFFECT_ATTRIBUTE } from './effectId';
import { sinHash2, sinHash2x3 } from './glsl/hash';
import { indent } from './glsl/text';
import { volumeMembership } from './glsl/volume';
import type { GlitchEffectName, GlitchSpec } from '../engine/Glitch';

/**
 * The in-scene half of the glitch stage: corruption on the shared art material.
 * One material serves the whole kit, so per-object corruption cannot be a
 * per-mesh uniform — it is a world-space test against the same eight-slot store
 * the screen pass reads. The displacement is applied three times, and has to be:
 * the surface material, the shadow depth material, and the edge pass's normal
 * override all have to agree about where the scene is.
 *
 * Everything is a pure function of the clock, so there is no accumulated state
 * and nothing to invalidate on a zone crossing. Attached volumes are gated by
 * owner id and free-standing ones by space, and for those the underside is a cut
 * rather than a fade. Per-face effects rely on kit geometry being non-indexed,
 * so `gl_VertexID / 3` is a stable face id — this is the assumption site.
 */

/** Sixteen rather than fog's eight: the showcase walks a rank of sixty-odd stations and packs the nearest. The shader loop breaks at the live count. */
export const MAX_GLITCHES = 8;

/** Where each effect wakes up on the master dial. The shader chunks interpolate these and the showcase reads them, so rooms and shaders cannot drift apart. */
export const GLITCH_ONSETS: Record<GlitchEffectName, number> = {
  stutter: 0.05,
  split: 0.1,
  jitter: 0.15,
  tear: 0.25,
  'palette-rot': 0.3,
  slice: 0.35,
  salt: 0.35,
  'facet-flash': 0.4,
  dropout: 0.5,
  blocks: 0.55,
  crush: 0.6,
  erode: 0.6,
  'static-fill': 0.7,
  ghost: 0.75,
  shatter: 0.85,
};

/** An onset as it appears in GLSL source. */
function on(name: GlitchEffectName): string {
  return GLITCH_ONSETS[name].toFixed(2);
}

function vec4Array(length: number): THREE.Vector4[] {
  return Array.from({ length }, () => new THREE.Vector4());
}

/**
 * The shared store, written once per frame by `GlitchActivity` and read by
 * every compiled art program *and* the screen pass — the `windUniforms`
 * mechanism. Lane packing is fixed and mirrored in `GlitchActivity.pack`:
 *
 * - `uGlitchCentre`  xyz centre, w = shape (0 sphere, 1 box) + 2 × owner id
 * - `uGlitchSize`    xyz radii / half-extents, w strength × burst
 * - `uGlitchVertexW`  jitter, slice, shatter, stutter
 * - `uGlitchSurfaceW` palette-rot, facet-flash, crush, static-fill
 * - `uGlitchScreenW`  split, tear, blocks, dropout
 * - `uGlitchParams`   seed, erode, ghost, salt
 */
export const glitchUniforms = {
  uGlitchCount: { value: 0 },
  uGlitchCentre: { value: vec4Array(MAX_GLITCHES) },
  uGlitchSize: { value: vec4Array(MAX_GLITCHES) },
  uGlitchVertexW: { value: vec4Array(MAX_GLITCHES) },
  uGlitchSurfaceW: { value: vec4Array(MAX_GLITCHES) },
  uGlitchScreenW: { value: vec4Array(MAX_GLITCHES) },
  uGlitchParams: { value: vec4Array(MAX_GLITCHES) },
};

/**
 * Attaches a glitch to an object, the way `markCollidable` marks a solid. The tag
 * is collected by `GlitchActivity` when the zone is prepared, and the volume's
 * centre follows the object's world matrix every frame.
 */
export function markGlitched<T extends THREE.Object3D>(object: T, spec: GlitchSpec): T {
  object.userData.glitch = spec;
  return object;
}

/** Glitch's own seeding. Both stages declare it, and it must be the same one. */
const HASH = sinHash2('glitchHash', [41.3457, 289.97]);
const HASH3 = sinHash2x3('glitchHash3', 'glitchHash', [19.19, 47.5]);

/**
 * Which volume owns this vertex or fragment. The owner id shares
 * `uGlitchCentre.w` with the shape bit — doubled and offset, so the floor
 * recovers it and the fractional half is the sphere-or-box flag.
 */
function membership(world: string, id: string, capture: string): string {
  return volumeMembership({
    system: 'Glitch',
    prefix: 'g',
    max: MAX_GLITCHES,
    world,
    id,
    owner: 'floor(uGlitchCentre[gi].w * 0.5 + 0.25)',
    capture,
  });
}

/** Uniform and helper declarations for the vertex stage. */
function vertexDecls(varyings: boolean): string {
  return /* glsl */ `
  uniform int uGlitchCount;
  uniform vec4 uGlitchCentre[${MAX_GLITCHES}];
  uniform vec4 uGlitchSize[${MAX_GLITCHES}];
  uniform vec4 uGlitchVertexW[${MAX_GLITCHES}];
  uniform vec4 uGlitchParams[${MAX_GLITCHES}];
  #ifndef EFFECT_OWNER_ATTRIBUTE
  #define EFFECT_OWNER_ATTRIBUTE
  attribute float ${EFFECT_ATTRIBUTE};
  #endif
  ${varyings ? 'varying vec3 vGlitchWorld;\n  varying float vGlitchFace;\n  varying float vGlitchId;' : ''}

  ${indent(HASH, 2)}

  ${indent(HASH3, 2)}
  `;
}

/**
 * The vertex chunk, anchored after the skinning include on purpose: nothing skins
 * today, but corruption computed here follows the posed position rather than the
 * bind pose, and anchored earlier a limb would slide out of its own volume.
 */
function vertexChunk(varyings: boolean): string {
  return /* glsl */ `
  {
    ${varyings ? `vGlitchId = ${EFFECT_ATTRIBUTE};` : ''}
    if (uGlitchCount > 0) {
      vec3 glitchWorld = (modelMatrix * vec4(transformed, 1.0)).xyz;
      float gAmt = 0.0;
      vec4 gVertW = vec4(0.0);
      float gSeed = 0.0;
      ${indent(
        membership(
          'glitchWorld',
          EFFECT_ATTRIBUTE,
          `gVertW = uGlitchVertexW[gi];
           gSeed = uGlitchParams[gi].x;`,
        ),
        6,
      )}
      // Kit geometry is non-indexed, so three consecutive vertices are one
      // triangle and this is constant across it — the per-face address.
      float gFace = fract(sin((float(gl_VertexID / 3) + 1.0) * 12.9898) * 43758.5453);
      if (gAmt > 0.004) {
        float gT = swayTime;
        // Two copies of a prop share object space; where they stand differs.
        float gWho = glitchHash(modelMatrix[3].xz * 3.1 + gSeed * 7.0);

        // Stutter: the whole object holds a small offset, then re-rolls it —
        // it moves like dropped frames. The earliest tell on the ladder.
        float aStutter = smoothstep(${on('stutter')}, 1.0, gAmt) * gVertW.w;
        if (aStutter > 0.001) {
          float slot = floor(gT * 3.0);
          float live = step(0.75 - aStutter * 0.45, glitchHash(vec2(slot, gWho * 91.0)));
          transformed += (glitchHash3(vec2(slot + gWho * 61.0, gSeed * 17.0)) - 0.5)
            * (0.07 * aStutter * live);
        }

        // Jitter: per-vertex boil, stepped in time so it reads as bad data
        // rather than as wind.
        float aJitter = smoothstep(${on('jitter')}, 1.0, gAmt) * gVertW.x;
        if (aJitter > 0.001) {
          vec3 gj = glitchHash3(transformed.xy * 37.0
            + vec2(floor(gT * 13.0) * 0.713, transformed.z * 29.0)) - 0.5;
          transformed += gj * (0.05 * aJitter);
        }

        // Slice: horizontal bands shear sideways and re-roll — the sliced
        // signal, in three dimensions.
        float aSlice = smoothstep(${on('slice')}, 1.0, gAmt) * gVertW.y;
        if (aSlice > 0.001) {
          float band = floor(glitchWorld.y * 7.0) + floor(gWho * 8.0);
          float roll = floor(gT * 6.0);
          float live = step(1.0 - aSlice * 0.4, glitchHash(vec2(band, roll)));
          transformed.xz += vec2(
            glitchHash(vec2(band * 1.7, roll + 9.0)) - 0.5,
            glitchHash(vec2(band * 2.3, roll + 5.0)) - 0.5
          ) * (0.5 * aSlice * live);
        }

        // Shatter: whole faces drift off along their own normals. The raw
        // attribute rather than objectNormal, which the depth material only
        // declares when it displacement-maps.
        float aShatter = smoothstep(${on('shatter')}, 1.0, gAmt) * gVertW.z;
        if (aShatter > 0.001) {
          float pick = glitchHash(vec2(gFace * 251.0, floor(gT * 2.0) + gSeed * 37.0));
          float go = step(1.0 - min(0.3 + aShatter * 0.6, 0.95), pick);
          transformed += normal * (go * aShatter
            * (0.15 + 0.5 * glitchHash(vec2(gFace * 97.0, gSeed))));
        }
      }
      ${varyings ? 'vGlitchWorld = glitchWorld;\n      vGlitchFace = gFace;' : ''}
    }${
      varyings
        ? ' else {\n      vGlitchWorld = vec3(0.0);\n      vGlitchFace = 0.0;\n    }'
        : ''
    }
  }
  `;
}

/** Uniform and helper declarations for the fragment stage. */
const FRAGMENT_DECLS = /* glsl */ `
uniform int uGlitchCount;
uniform vec4 uGlitchCentre[${MAX_GLITCHES}];
uniform vec4 uGlitchSize[${MAX_GLITCHES}];
uniform vec4 uGlitchSurfaceW[${MAX_GLITCHES}];
uniform vec4 uGlitchParams[${MAX_GLITCHES}];
varying vec3 vGlitchWorld;
varying float vGlitchFace;
varying float vGlitchId;

${HASH}
`;

/**
 * Erode, the one effect that removes a fragment rather than grading it. Split out
 * because a driver disables early depth rejection for any shader that can
 * discard, whether or not it ever does — so left in the source unconditionally
 * this costs every opaque pixel in the game its early-Z. See `setGlitchVolumes`.
 */
const ERODE = /* glsl */ `
    // Erode: faces vanish on a hash schedule and holes open through the object.
    // Surface only — the eroded face still casts and outlines.
    float aErode = smoothstep(${on('erode')}, 1.0, gAmt) * gParams.y;
    if (aErode > 0.001
      && glitchHash(vec2(vGlitchFace * 137.0, floor(gT * 5.0) + gSeed * 31.0)) < aErode * 0.65) {
      discard;
    }
`;

/**
 * The fragment chunk, after the lighting has produced `outgoingLight`: these
 * effects grade the lit result, so palette rot keeps its shading and static
 * swallows highlight and shadow alike. `swayTime` is declared by the finish
 * stage's fragment block, which the surface material always carries.
 */
const fragmentChunk = (erode: boolean): string => /* glsl */ `
if (uGlitchCount > 0) {
  float gAmt = 0.0;
  vec4 gSurfW = vec4(0.0);
  vec4 gParams = vec4(0.0);
  ${indent(
    membership(
      'vGlitchWorld',
      'vGlitchId',
      `gSurfW = uGlitchSurfaceW[gi];
       gParams = uGlitchParams[gi];`,
    ),
    2,
  )}
  if (gAmt > 0.004) {
    float gT = swayTime;
    float gSeed = gParams.x;
${erode ? ERODE : ''}
    // Facet-flash: single facets slam to white or black for a few frames.
    // Flat shading makes this read exactly as corrupted triangle data.
    float aFlash = smoothstep(${on('facet-flash')}, 1.0, gAmt) * gSurfW.y;
    if (aFlash > 0.001) {
      float roll = glitchHash(vec2(vGlitchFace * 211.0, floor(gT * 9.0) + gSeed * 77.0));
      if (roll < aFlash * 0.22) {
        outgoingLight = roll < aFlash * 0.08 ? vec3(0.015) : vec3(1.4);
      }
    }

    // Palette-rot: channels swap in bands. The shading stays right while the
    // colours go wrong, which is what reads as data rather than light.
    float aRot = smoothstep(${on('palette-rot')}, 1.0, gAmt) * gSurfW.x;
    if (aRot > 0.001) {
      float roll = floor(gT * 3.0);
      float band = floor(vGlitchWorld.y * 4.0 + roll * 0.37);
      float r = glitchHash(vec2(band, roll + gSeed * 43.0));
      if (r < aRot * 0.6) {
        outgoingLight = r < aRot * 0.3 ? outgoingLight.brg : outgoingLight.gbr;
      }
    }

    // Crush: the lit result posterizes to fewer and fewer levels.
    float aCrush = smoothstep(${on('crush')}, 1.0, gAmt) * gSurfW.z;
    if (aCrush > 0.003) {
      float levels = mix(6.0, 2.0, aCrush);
      outgoingLight = mix(outgoingLight, floor(outgoingLight * levels + 0.5) / levels,
        smoothstep(0.0, 0.2, aCrush));
    }

    // Static-fill: the surface gives way to per-pixel noise. The scene renders
    // at chunky resolution, so this is one value per chunky pixel for free.
    float aStatic = smoothstep(${on('static-fill')}, 1.0, gAmt) * gSurfW.w;
    if (aStatic > 0.003) {
      vec2 cp = floor(gl_FragCoord.xy);
      float n = glitchHash(cp * 0.61 + floor(gT * 14.0) * 1.31);
      vec3 sc = mix(
        vec3(n),
        vec3(step(0.5, glitchHash(cp + 1.0)), step(0.5, glitchHash(cp + 2.0)),
          step(0.5, glitchHash(cp + 3.0))),
        0.4
      ) * (0.15 + 0.85 * n);
      outgoingLight = mix(outgoingLight, sc,
        aStatic * (0.4 + 0.6 * glitchHash(cp * 0.23 + floor(gT * 7.0))));
    }
  }
}
`;

/**
 * The line the finish stage leaves behind, and the anchor the fragment chunk
 * lands after. Fragile by nature — it must match `art/finish.ts` exactly —
 * and stated as a constant so the coupling has one address.
 */
const OUTGOING_LIGHT =
  'vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;';

/** Whether the programs being compiled now carry the glitch stage at all. */
let present = false;

/** Materials carrying any part of the stage, so the switch can recompile them. */
const surfaces = new Set<THREE.Material>();

/**
 * Which variant a program is. Belongs in every carrying material's cache key —
 * three's own key knows nothing about an `onBeforeCompile`, so without this the
 * two variants would ask for the same program and one would get the other's.
 */
export function glitchVariant(): string {
  return present ? 'glitch' : 'plain';
}

/**
 * Whether the zone being drawn has any glitch volume in it at all. Off, the
 * whole stage — the volume uniforms, the vertex loop, the surface grading and
 * its erode discard — is out of the source. The trade is a program variant,
 * which `PostFX.prewarm` compiles up front so it never lands on a door.
 */
export function setGlitchVolumes(on: boolean): void {
  if (on === present) return;
  present = on;
  for (const material of surfaces) material.needsUpdate = true;
}

/**
 * Adds the full glitch stage — displacement and surface — to the shared art
 * material. Wrapping rather than replacing, for the reason every stage since
 * sway gives: `onBeforeCompile` is a single slot and sway got there first.
 */
export function applyGlitch(material: THREE.Material): void {
  const prior = material.onBeforeCompile;
  material.onBeforeCompile = (shader, renderer) => {
    prior?.call(material, shader, renderer);
    if (!present) return;

    Object.assign(shader.uniforms, glitchUniforms);

    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>\n${vertexDecls(true)}`)
      .replace('#include <skinning_vertex>', `#include <skinning_vertex>\n${vertexChunk(true)}`);

    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>\n${FRAGMENT_DECLS}`)
      .replace(OUTGOING_LIGHT, `${OUTGOING_LIGHT}\n${fragmentChunk(true)}`);
  };

  surfaces.add(material);
  defaultEffectAttribute(material);
  material.customProgramCacheKey = () => `sway-wear-detail-finish-glitch:${glitchVariant()}`;
  material.needsUpdate = true;
}

/**
 * Adds the displacement half alone, for the materials that read geometry and
 * not colour: the shadow depth material and the edge pass's normal override.
 * Anything that draws the scene has to agree about where the scene is.
 */
export function applyGlitchDisplacement(material: THREE.Material): void {
  const prior = material.onBeforeCompile;
  material.onBeforeCompile = (shader, renderer) => {
    prior?.call(material, shader, renderer);
    if (!present) return;

    Object.assign(shader.uniforms, glitchUniforms);

    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>\n${vertexDecls(false)}`)
      .replace('#include <skinning_vertex>', `#include <skinning_vertex>\n${vertexChunk(false)}`);
  };

  surfaces.add(material);
  defaultEffectAttribute(material);
  material.customProgramCacheKey = () => `sway-glitch:${glitchVariant()}`;
  material.needsUpdate = true;
}

/**
 * Unmarked geometry reads owner 0 — sway's `defaultAttributeValues` mechanism,
 * for sway's reason: a missing attribute otherwise reads whatever the last
 * draw left in the slot.
 */
function defaultEffectAttribute(material: THREE.Material): void {
  const holder = material as { defaultAttributeValues?: Record<string, number[]> };
  holder.defaultAttributeValues = {
    ...holder.defaultAttributeValues,
    [EFFECT_ATTRIBUTE]: [0],
  };
}
