import * as THREE from 'three';
import { EFFECT_ATTRIBUTE } from './effectId';
import type { GlitchEffectName, GlitchSpec } from '../engine/Glitch';

/**
 * The in-scene half of the glitch stage: corruption on the shared art
 * material. GLITCH-SHADERS.md.
 *
 * One material serves the whole kit, so per-object corruption cannot be a
 * per-mesh uniform — it is a world-space test instead, exactly as a screen
 * pixel asks whether it stands in a fog volume. Every vertex asks the same
 * eight-slot uniform store the screen pass reads, and what falls inside a
 * volume misbehaves: the vertex stage shivers, shears and shatters the
 * geometry, the fragment stage rots the palette, flashes facets, erodes faces
 * and finally replaces the surface with static.
 *
 * **The displacement is applied three times, and has to be.** The surface
 * material decides what you see; the depth material decides what the sun sees
 * (shadow maps re-render every frame — see PostFX.render), and the normal
 * override material is what the edge detector outlines. Sway learned this
 * lesson first and this patch walks the same road: `applyGlitch` for the
 * surface, `applyGlitchDisplacement` for the other two. The normal override
 * draws non-kit geometry too, which the colour pass leaves alone — harmless in
 * practice, because floors and terrain are vertex-sparse and their corners
 * stand outside any volume anyone would place.
 *
 * Everything is a pure function of the clock. No accumulated state, nothing
 * to invalidate on a zone crossing, and the depth pass hashes the same slots
 * the colour pass does, so a shattered face casts the shadow of where it went.
 *
 * **Attached volumes are gated by identity, free-standing ones by space.** An
 * attached volume (owner id folded into `uGlitchCentre.w`, see
 * art/effectId.ts) corrupts exactly the vertices and pixels carrying its id —
 * whole object, full strength, floor immune at any distance. A free-standing
 * volume keeps the spatial test, and for it the underside is a cut rather
 * than a fade: below `centre.y - size.y` it simply stops, so one sited on a
 * surface covers what stands there without corrupting what it stands on.
 *
 * Per-face effects lean on the kit being non-indexed: three consecutive
 * vertices are one triangle, so gl_VertexID / 3 is a stable face id in every
 * pass. If kit geometry is ever re-indexed or instanced, shatter, erode and
 * facet-flash quietly stop being per-face — this is the assumption site.
 */

/**
 * Sixteen rather than fog's eight: the showcase walks a rank of sixty-odd
 * stations and packs the nearest of them, and at eight the next row over kept
 * winking out mid-comparison. The loop in every shader breaks at the live
 * count, so the raise costs uniform space and nothing per frame.
 */
export const MAX_GLITCHES = 16;

/**
 * Where each effect wakes up on the master dial — the ladder itself, as data.
 * The shader chunks interpolate these, and the showcase reads them to place a
 * row's strength steps inside the effect's own active range; one table, so
 * the rooms and the shaders cannot drift apart.
 */
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
 * Attaches a glitch to an object, the way `markCollidable` marks a solid.
 *
 * The tag is collected by `GlitchActivity` when the zone is prepared, and the
 * volume's centre follows the object's world matrix every frame — so when
 * anything starts moving, its corruption moves with it, with no API change.
 */
export function markGlitched<T extends THREE.Object3D>(object: T, spec: GlitchSpec): T {
  object.userData.glitch = spec;
  return object;
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

  float glitchHash(vec2 p) {
    return fract(sin(dot(p, vec2(41.3457, 289.97))) * 43758.5453);
  }

  vec3 glitchHash3(vec2 p) {
    return vec3(glitchHash(p), glitchHash(p + 19.19), glitchHash(p + 47.5));
  }
  `;
}

/**
 * The vertex chunk, anchored after the skinning include on purpose: nothing
 * skins today, but the day figures animate, corruption computed here follows
 * the posed position rather than the bind pose — and anchored earlier, limbs
 * would slide out of their own glitch volumes. Free now, rework later.
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
      for (int gi = 0; gi < ${MAX_GLITCHES}; gi++) {
        if (gi >= uGlitchCount) break;
        float gOwn = floor(uGlitchCentre[gi].w * 0.5 + 0.25);
        float gin;
        if (gOwn > 0.5) {
          // Owned: membership is identity, not geometry — the whole object at
          // full strength, and nothing that is not it. See art/effectId.ts.
          gin = abs(${EFFECT_ATTRIBUTE} - gOwn) < 0.5 ? uGlitchSize[gi].w : 0.0;
        } else {
          vec3 grel = (glitchWorld - uGlitchCentre[gi].xyz) / uGlitchSize[gi].xyz;
          // The underside is a cut, not a fade. See the note on the store.
          if (grel.y < -1.0) continue;
          vec3 gd = vec3(abs(grel.x), max(grel.y, 0.0), abs(grel.z));
          float ge = uGlitchCentre[gi].w > 0.5 ? max(gd.x, max(gd.y, gd.z)) : length(gd);
          gin = (1.0 - smoothstep(0.7, 1.0, ge)) * uGlitchSize[gi].w;
        }
        if (gin > gAmt) {
          gAmt = gin;
          gVertW = uGlitchVertexW[gi];
          gSeed = uGlitchParams[gi].x;
        }
      }
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

float glitchHash(vec2 p) {
  return fract(sin(dot(p, vec2(41.3457, 289.97))) * 43758.5453);
}
`;

/**
 * The fragment chunk, after the lighting has produced `outgoingLight`: these
 * effects grade the lit result, so palette rot keeps its shading and static
 * swallows highlight and shadow alike. `swayTime` is declared by the finish
 * stage's fragment block, which the surface material always carries.
 */
const FRAGMENT_CHUNK = /* glsl */ `
if (uGlitchCount > 0) {
  float gAmt = 0.0;
  vec4 gSurfW = vec4(0.0);
  vec4 gParams = vec4(0.0);
  for (int gi = 0; gi < ${MAX_GLITCHES}; gi++) {
    if (gi >= uGlitchCount) break;
    float gOwn = floor(uGlitchCentre[gi].w * 0.5 + 0.25);
    float gin;
    if (gOwn > 0.5) {
      gin = abs(vGlitchId - gOwn) < 0.5 ? uGlitchSize[gi].w : 0.0;
    } else {
      vec3 grel = (vGlitchWorld - uGlitchCentre[gi].xyz) / uGlitchSize[gi].xyz;
      if (grel.y < -1.0) continue;
      vec3 gd = vec3(abs(grel.x), max(grel.y, 0.0), abs(grel.z));
      float ge = uGlitchCentre[gi].w > 0.5 ? max(gd.x, max(gd.y, gd.z)) : length(gd);
      gin = (1.0 - smoothstep(0.7, 1.0, ge)) * uGlitchSize[gi].w;
    }
    if (gin > gAmt) {
      gAmt = gin;
      gSurfW = uGlitchSurfaceW[gi];
      gParams = uGlitchParams[gi];
    }
  }
  if (gAmt > 0.004) {
    float gT = swayTime;
    float gSeed = gParams.x;

    // Erode: faces vanish on a hash schedule and holes open through the
    // object. Surface only — the eroded face still casts and outlines, which
    // is the known depth/normal gap, accepted for now.
    float aErode = smoothstep(${on('erode')}, 1.0, gAmt) * gParams.y;
    if (aErode > 0.001
      && glitchHash(vec2(vGlitchFace * 137.0, floor(gT * 5.0) + gSeed * 31.0)) < aErode * 0.65) {
      discard;
    }

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

/**
 * Adds the full glitch stage — displacement and surface — to the shared art
 * material. Wrapping rather than replacing, for the reason every stage since
 * sway gives: `onBeforeCompile` is a single slot and sway got there first.
 */
export function applyGlitch(material: THREE.Material): void {
  const prior = material.onBeforeCompile;
  material.onBeforeCompile = (shader, renderer) => {
    prior?.call(material, shader, renderer);

    Object.assign(shader.uniforms, glitchUniforms);

    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>\n${vertexDecls(true)}`)
      .replace('#include <skinning_vertex>', `#include <skinning_vertex>\n${vertexChunk(true)}`);

    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>\n${FRAGMENT_DECLS}`)
      .replace(OUTGOING_LIGHT, `${OUTGOING_LIGHT}\n${FRAGMENT_CHUNK}`);
  };

  defaultEffectAttribute(material);
  material.customProgramCacheKey = () => 'sway-wear-detail-finish-glitch';
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

    Object.assign(shader.uniforms, glitchUniforms);

    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>\n${vertexDecls(false)}`)
      .replace('#include <skinning_vertex>', `#include <skinning_vertex>\n${vertexChunk(false)}`);
  };

  defaultEffectAttribute(material);
  material.customProgramCacheKey = () => 'sway-glitch';
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
