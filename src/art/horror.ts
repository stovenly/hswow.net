import * as THREE from 'three';
import { EFFECT_ATTRIBUTE } from './effectId';
import { sinHash2, sinHash2x3, sinHash31 } from './glsl/hash';
import { indent } from './glsl/text';
import { volumeMembership } from './glsl/volume';
import type { HorrorEffectName, HorrorSpec } from '../engine/Horror';

/**
 * The in-scene half of the horror stage: organic dread on the shared art
 * material, `art/glitch.ts`'s twin. Same architecture — a world-space volume test
 * against a shared uniform store, displacement applied to the surface, the shadow
 * depth material and the outline normal material alike, everything a pure
 * function of the clock. The effects are the difference: the mesh breathes,
 * trembles, leans and drains rather than tearing.
 *
 * Nothing in this file may displace along `normal` or key on a face id. Kit
 * geometry is non-indexed and flat-shaded, so displacing along `normal`
 * translates each triangle rigidly in its own direction and every shared edge
 * opens into a hole straight through the object. Keyed on position, coincident
 * vertices are bit-identical and receive identical displacement. Glitch is free
 * to — `shatter` separating faces is the point there.
 */

/** Sixteen, matching glitch: the showcase walks a rank past eight. */
export const MAX_HORRORS = 16;

/**
 * Where each effect wakes up on the master dial. One table serves the shader
 * chunks and the showcase's strength steps, so the two cannot drift.
 */
export const HORROR_ONSETS: Record<HorrorEffectName, number> = {
  stretch: 0.05,
  pallor: 0.1,
  judder: 0.15,
  tremor: 0.25,
  lean: 0.3,
  breathe: 0.4,
  headshake: 0.55,
  shroud: 0.7,
  flicker: 0.8,
};

/** An onset as it appears in GLSL source. */
function on(name: HorrorEffectName): string {
  return HORROR_ONSETS[name].toFixed(2);
}

function vec4Array(length: number): THREE.Vector4[] {
  return Array.from({ length }, () => new THREE.Vector4());
}

/**
 * The shared store, written once per frame by `HorrorActivity` and read by every
 * art program and the screen pass. Lane packing, mirrored in
 * `HorrorActivity.update`:
 *
 * - `uHorrorCentre`   xyz centre, w shape (0 sphere, 1 box)
 * - `uHorrorSize`     xyz radii / half-extents, w steady strength
 * - `uHorrorVertexA`  tremor, judder, headshake, breathe
 * - `uHorrorVertexB`  stretch, lean, grounded flag, (spare)
 * - `uHorrorSurfaceW` pallor, flicker, shroud, (spare)
 * - `uHorrorParams`   seed, strength × fit envelope, tempo, owner id
 *
 * Two strengths on purpose: the steady one drives the effects that must not
 * blink, the fit one drives the motion effects, which arrive as fits between
 * stillness.
 *
 * An attached volume affects exactly the vertices carrying its owner id, whole
 * object at full strength, because no spatial test can tell an object's base from
 * the floor a centimetre under it. A free-standing volume keeps the spatial test,
 * and for it the underside is a cut rather than a fade — so one sited on a
 * surface covers what stands there without grading what it stands on.
 */
export const horrorUniforms = {
  uHorrorCount: { value: 0 },
  uHorrorCentre: { value: vec4Array(MAX_HORRORS) },
  uHorrorSize: { value: vec4Array(MAX_HORRORS) },
  uHorrorVertexA: { value: vec4Array(MAX_HORRORS) },
  uHorrorVertexB: { value: vec4Array(MAX_HORRORS) },
  uHorrorSurfaceW: { value: vec4Array(MAX_HORRORS) },
  uHorrorParams: { value: vec4Array(MAX_HORRORS) },
};

/**
 * Attaches a haunting to an object, `markGlitched`'s twin: collected when the
 * zone is prepared, and the volume follows the object's world matrix.
 */
export function markHaunted<T extends THREE.Object3D>(object: T, spec: HorrorSpec): T {
  object.userData.horror = spec;
  return object;
}

/** Horror's own seeding, its own constants — nothing shared with glitch's. */
const HASH = sinHash2('horrorHash', [37.219, 217.63]);
const HASH3 = sinHash2x3('horrorHash3', 'horrorHash', [13.7, 41.9]);
const HASH31 = sinHash31('horrorHash31', [17.1, 31.7, 11.3]);

/**
 * Which volume owns this vertex or fragment. Horror keeps the owner id in its
 * own lane rather than folded into the centre, so the read is direct.
 */
function membership(world: string, id: string, capture: string): string {
  return volumeMembership({
    system: 'Horror',
    prefix: 'h',
    max: MAX_HORRORS,
    world,
    id,
    owner: 'uHorrorParams[hi].w',
    capture,
  });
}

/** Uniform and helper declarations for the vertex stage. */
function vertexDecls(varyings: boolean): string {
  return /* glsl */ `
  uniform int uHorrorCount;
  uniform vec4 uHorrorCentre[${MAX_HORRORS}];
  uniform vec4 uHorrorSize[${MAX_HORRORS}];
  uniform vec4 uHorrorVertexA[${MAX_HORRORS}];
  uniform vec4 uHorrorVertexB[${MAX_HORRORS}];
  uniform vec4 uHorrorParams[${MAX_HORRORS}];
  #ifndef EFFECT_OWNER_ATTRIBUTE
  #define EFFECT_OWNER_ATTRIBUTE
  attribute float ${EFFECT_ATTRIBUTE};
  #endif
  ${varyings ? 'varying vec3 vHorrorWorld;\n  varying float vHorrorId;' : ''}

  ${indent(HASH, 2)}

  ${indent(HASH3, 2)}
  `;
}

/**
 * The vertex chunk, anchored after the skinning include for glitch's reason: the
 * day figures animate, dread follows the posed position for free. Wrapped after
 * the glitch patch, so this lands before glitch's chunk in the shader — the body
 * goes wrong first, then the signal of it corrupts on top.
 */
function vertexChunk(varyings: boolean): string {
  return /* glsl */ `
  {
    ${varyings ? `vHorrorId = ${EFFECT_ATTRIBUTE};` : ''}
    if (uHorrorCount > 0) {
      vec3 hWorld = (modelMatrix * vec4(transformed, 1.0)).xyz;
      float hAmt = 0.0;
      float hFit = 0.0;
      vec4 hVertA = vec4(0.0);
      vec4 hVertB = vec4(0.0);
      vec4 hC = vec4(0.0);
      vec4 hS = vec4(1.0);
      float hSeed = 0.0;
      float hPace = 1.0;
      ${indent(
        membership(
          'hWorld',
          EFFECT_ATTRIBUTE,
          `hFit = hFeather * uHorrorParams[hi].y;
           hVertA = uHorrorVertexA[hi];
           hVertB = uHorrorVertexB[hi];
           hC = uHorrorCentre[hi];
           hS = uHorrorSize[hi];
           hSeed = uHorrorParams[hi].x;
           hPace = max(uHorrorParams[hi].z, 1.0);`,
        ),
        6,
      )}
      if (hAmt > 0.004 || hFit > 0.004) {
        float hT = swayTime;
        // Two copies of a prop share object space; where they stand differs.
        float hWho = horrorHash(modelMatrix[3].xz * 2.7 + hSeed * 5.0);

        // The volume's centre on this object's own axis. Only Y rotation and a
        // uniform scale are ever used, so the height is a subtract and a
        // divide — sway's assumption, one system over.
        float hScale = max(length(modelMatrix[0].xyz), 1e-4);
        float hAnchorY = (hC.y - modelMatrix[3].y) / hScale;
        // What the shape-changing effects work about. A grounded thing pivots
        // at its base and keeps its feet; everything else pivots about the
        // volume's centre, so a boulder or a hanging sign tips in place rather
        // than being levered off a floor it never stood on.
        float hGround = step(0.5, hVertB.z);
        float hPivot = hGround > 0.5 ? 0.0 : hAnchorY;
        // The lever arm each effect leans on. Clamped for grounded things, so
        // anything modelled below its own origin does not shear backwards.
        float hLever = hGround > 0.5 ? max(transformed.y, 0.0) : transformed.y - hPivot;

        // Stretch: proportion drift too slow to catch moving. Taller and
        // gaunter about the pivot.
        float aStretch = smoothstep(${on('stretch')}, 1.0, hAmt) * hVertB.x;
        if (aStretch > 0.001) {
          float drift = 0.5 + 0.3 * sin(hT * 0.11 * hPace + hWho * 6.2831)
            + 0.2 * sin(hT * 0.043 * hPace + hSeed * 9.0);
          transformed.y = hPivot + (transformed.y - hPivot) * (1.0 + aStretch * 0.5 * drift);
          transformed.xz *= 1.0 - aStretch * 0.22 * drift;
        }

        // Lean: a few degrees past balance, frozen mid-topple, the axis
        // creeping. A shear about the base reads as the lean at these angles.
        float aLean = smoothstep(${on('lean')}, 1.0, hAmt) * hVertB.y;
        if (aLean > 0.001) {
          float ang = aLean * (0.08 + 0.22 * (0.5 + 0.5 * sin(hT * 0.07 * hPace + hWho * 6.2831)));
          float dir = hT * 0.05 * hPace + hWho * 6.2831;
          transformed.xz += vec2(cos(dir), sin(dir)) * (hLever * ang);
          transformed.y += aLean * aLean * 0.07;
        }

        // Judder: a slow wander shown only as held poses — stop-motion. The
        // offset is constant within a slot and snaps at the next.
        float aJud = smoothstep(${on('judder')}, 1.0, hFit) * hVertA.y;
        if (aJud > 0.001) {
          float slot = floor(hT * 5.0);
          float tq = (slot + 0.9 * horrorHash(vec2(slot, hWho * 77.0))) / 5.0;
          vec3 wob = vec3(
            sin(tq * 1.7 + hWho * 6.2831),
            0.35 * sin(tq * 1.3 + hSeed * 4.0),
            sin(tq * 2.1 + hWho * 9.4)
          );
          transformed += wob * (0.09 * aJud);
          transformed.xz += vec2(sin(tq * 1.1), cos(tq * 0.9)) * (hLever * 0.06 * aJud);
        }

        // Headshake: held offsets snapping 4fps-film style, with pauses. On a
        // grounded thing only the upper region goes, masked by height against
        // the volume's span — the head thrashing over a still body. On
        // anything else the whole of it snaps, there being no head to pick out.
        float aHead = smoothstep(${on('headshake')}, 1.0, hFit) * hVertA.z;
        if (aHead > 0.001) {
          float mask = hGround > 0.5 ? smoothstep(hC.y, hC.y + hS.y * 0.8, hWorld.y) : 1.0;
          if (mask > 0.001) {
            float slot = floor(hT * 9.0);
            float live = step(0.35, horrorHash(vec2(slot, hWho * 53.0)));
            transformed += (horrorHash3(vec2(slot + hWho * 31.0, hSeed * 13.0)) - 0.5)
              * (0.28 * aHead * mask * live);
          }
        }

        // Breathe: an asymmetric swell — fast in, held, let go — with breaths
        // skipped. Radial from the volume's height on the object's own axis
        // rather than along the face normal: see the welding note above.
        float aBr = smoothstep(${on('breathe')}, 1.0, hAmt) * hVertA.w;
        if (aBr > 0.001) {
          float cyc = floor((hT + hWho * 4.6) / 4.6);
          float ph = fract((hT + hWho * 4.6) / 4.6);
          float skip = step(0.14, horrorHash(vec2(cyc, hSeed * 23.0)));
          float env = smoothstep(0.0, 0.16, ph) * (1.0 - smoothstep(0.45, 0.95, ph));
          vec3 hOut = transformed - vec3(0.0, hAnchorY, 0.0);
          float hOutLen = length(hOut);
          // Up at the anchor itself, where there is no outward to speak of. A
          // constant rather than the normal, so coincident vertices still agree.
          vec3 hDir = hOutLen > 1e-3 ? hOut / hOutLen : vec3(0.0, 1.0, 0.0);
          transformed += hDir * (0.06 * aBr * env * skip);
        }

        // Tremor: high-frequency buzz, each vertex out of phase, so the
        // silhouette boils rather than the body shaking as one piece. Keyed on
        // position rather than face — the welding note above, and also what
        // PS1 vertex jitter actually was.
        float aTr = smoothstep(${on('tremor')}, 1.0, hFit) * hVertA.x;
        if (aTr > 0.001) {
          vec3 hQ = floor(transformed * 256.0);
          vec2 hKey = vec2(hQ.x + hQ.z * 131.0, hQ.y + hQ.z * 57.0) + hSeed * 3.0;
          vec3 dir = normalize(horrorHash3(hKey) - 0.5 + 1e-4);
          transformed += dir * (0.02 * aTr * sin(hT * 43.0 + horrorHash(hKey + 3.7) * 6.2831));
        }
      }
      ${varyings ? 'vHorrorWorld = hWorld;' : ''}
    }${varyings ? ' else {\n      vHorrorWorld = vec3(0.0);\n    }' : ''}
  }
  `;
}

/** Uniform and helper declarations for the fragment stage. */
const FRAGMENT_DECLS = /* glsl */ `
uniform int uHorrorCount;
uniform vec4 uHorrorCentre[${MAX_HORRORS}];
uniform vec4 uHorrorSize[${MAX_HORRORS}];
uniform vec4 uHorrorSurfaceW[${MAX_HORRORS}];
uniform vec4 uHorrorParams[${MAX_HORRORS}];
varying vec3 vHorrorWorld;
varying float vHorrorId;

${HASH}

${HASH31}

// Small 3D value noise: mottle and runnels want patches, not static.
float horrorNoise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(
      mix(horrorHash31(i), horrorHash31(i + vec3(1.0, 0.0, 0.0)), f.x),
      mix(horrorHash31(i + vec3(0.0, 1.0, 0.0)), horrorHash31(i + vec3(1.0, 1.0, 0.0)), f.x),
      f.y
    ),
    mix(
      mix(horrorHash31(i + vec3(0.0, 0.0, 1.0)), horrorHash31(i + vec3(1.0, 0.0, 1.0)), f.x),
      mix(horrorHash31(i + vec3(0.0, 1.0, 1.0)), horrorHash31(i + vec3(1.0, 1.0, 1.0)), f.x),
      f.y
    ),
    f.z
  );
}
`;

/**
 * The fragment chunk, after lighting: these grade the lit result, so pallor
 * keeps its shading and the weep darkens highlight and shadow alike. Anchored
 * on the same line glitch uses; wrapped after glitch, this lands *before*
 * glitch's chunk, so corruption tears the graded body — the right layering.
 */
const FRAGMENT_CHUNK = /* glsl */ `
if (uHorrorCount > 0) {
  float hAmt = 0.0;
  vec4 hSurf = vec4(0.0);
  float hSeed = 0.0;
  float hPace = 1.0;
  ${indent(
    membership(
      'vHorrorWorld',
      'vHorrorId',
      `hSurf = uHorrorSurfaceW[hi];
       hSeed = uHorrorParams[hi].x;
       hPace = max(uHorrorParams[hi].z, 1.0);`,
    ),
    2,
  )}
  if (hAmt > 0.004) {
    float hT = swayTime;

    // Pallor: colour drains toward grey-green, mottled patches blooming on a
    // clock too slow to watch. The shading stays honest under it.
    float aPal = smoothstep(${on('pallor')}, 1.0, hAmt) * hSurf.x;
    if (aPal > 0.003) {
      float grey = dot(outgoingLight, vec3(0.3, 0.5, 0.2));
      vec3 cadaver = grey * vec3(0.62, 0.72, 0.6);
      float n = horrorNoise(vHorrorWorld * 3.3 + vec3(0.0, hT * 0.02 * hPace, hSeed * 11.0));
      cadaver = mix(cadaver, cadaver * 0.35, smoothstep(0.5, 0.8, n));
      outgoingLight = mix(outgoingLight, cadaver, aPal * 0.9);
    }

    // Flicker: the figure is a flat black silhouette for a moment, then not.
    // Slot rate and duty are capped low — this borders on a strobe.
    float aFl = smoothstep(${on('flicker')}, 1.0, hAmt) * hSurf.y;
    if (aFl > 0.003) {
      float slot = floor(hT * 1.6);
      float roll = horrorHash(vec2(slot, hSeed * 41.0));
      if (roll < aFl * 0.3
        && fract(hT * 1.6) < 0.1 + 0.35 * horrorHash(vec2(slot, hSeed * 91.0))) {
        outgoingLight = vec3(0.015);
      }
    }
  }
}
`;

/** The line the finish stage leaves behind — must match `art/finish.ts`. */
const OUTGOING_LIGHT =
  'vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;';

/** Adds the full horror stage — displacement and surface — to the art material. */
export function applyHorror(material: THREE.Material): void {
  const prior = material.onBeforeCompile;
  material.onBeforeCompile = (shader, renderer) => {
    prior?.call(material, shader, renderer);

    Object.assign(shader.uniforms, horrorUniforms);

    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>\n${vertexDecls(true)}`)
      .replace('#include <skinning_vertex>', `#include <skinning_vertex>\n${vertexChunk(true)}`);

    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>\n${FRAGMENT_DECLS}`)
      .replace(OUTGOING_LIGHT, `${OUTGOING_LIGHT}\n${FRAGMENT_CHUNK}`);
  };

  defaultEffectAttribute(material);
  material.customProgramCacheKey = () => 'sway-wear-detail-finish-glitch-horror';
  material.needsUpdate = true;
}

/**
 * The displacement half alone, for the shadow depth material and the edge
 * pass's normal override — anything drawing the scene agrees where it is.
 */
export function applyHorrorDisplacement(material: THREE.Material): void {
  const prior = material.onBeforeCompile;
  material.onBeforeCompile = (shader, renderer) => {
    prior?.call(material, shader, renderer);

    Object.assign(shader.uniforms, horrorUniforms);

    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>\n${vertexDecls(false)}`)
      .replace('#include <skinning_vertex>', `#include <skinning_vertex>\n${vertexChunk(false)}`);
  };

  defaultEffectAttribute(material);
  material.customProgramCacheKey = () => 'sway-glitch-horror';
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
