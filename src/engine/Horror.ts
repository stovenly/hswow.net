import * as THREE from 'three';
import { FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass.js';
import { horrorUniforms, HORROR_ONSETS, MAX_HORRORS } from '../art/horror';
import type { PixelEffect, EffectContext } from './PixelStage';

/**
 * Placed horror volumes: organic dread as set dressing, the glitch system's
 * sibling (HORROR-SHADERS.md). Same shape end to end — authored volumes, one
 * shared uniform store, an in-scene half (art/horror.ts) and this screen-space
 * half — but the effects are bodily and paranormal where glitch is electronic.
 */

export type HorrorShape = 'sphere' | 'box';

/**
 * Every effect, in ladder order — the order they arrive as strength climbs.
 * Working names; renaming an effect renames a weight key and nothing else.
 */
export const HORROR_EFFECTS = [
  'stretch',
  'pallor',
  'judder',
  'tremor',
  'lean',
  'breathe',
  'headshake',
  'shroud',
  'flicker',
] as const;

export type HorrorEffectName = (typeof HORROR_EFFECTS)[number];

/** An onset as it appears in GLSL source. The table lives in `art/horror.ts`. */
function on(name: HorrorEffectName): string {
  return HORROR_ONSETS[name].toFixed(2);
}

/**
 * One authored haunting. `strength` is the master dial with fixed per-effect
 * onsets along it; `weights` are per-effect sliders over that, 1 by default.
 */
export interface HorrorSpec {
  /** Default 'sphere'. */
  shape?: HorrorShape;
  /** Radii for a sphere, half-extents for a box. Metres. */
  size: THREE.Vector3;
  /** The master dial, 0..1. */
  strength: number;
  /** Decorrelates two identical specs. Salted by position on collection. */
  seed?: number;
  /** Fit cadence multiplier. Default 1; the showcase runs hot. */
  tempo?: number;
  /**
   * Whether this thing stands on the floor and should stay standing on it.
   *
   * Off by default, and that default is the honest one: most of the kit is not
   * a body with feet. Off, the shape-changing effects pivot about the volume's
   * own centre — a hanging sign, a boulder or a floating orb tips and stretches
   * in place. On, they pivot about the object's base, so a figure leans from
   * the ankles and grows from the floor rather than sinking through it.
   */
  grounded?: boolean;
  /** Volume position relative to the object, for `markHaunted` specs only. */
  offset?: THREE.Vector3;
  /** Per-effect sliders, 0..1 each. Absent means 1. */
  weights?: Partial<Record<HorrorEffectName, number>>;
}

/** A free-standing volume: a spec with a place. See `ZoneDefinition.horrors`. */
export interface HorrorPlacement extends HorrorSpec {
  /** Centre, in the zone's world space. */
  center: THREE.Vector3;
}

/**
 * The screen-space half: shroud only. Darkness pools over everything standing
 * in a volume — the figure and the air around it — so the thing reads as a
 * hole in the scene's light rather than a repainted mesh.
 */
export class HorrorEffect implements PixelEffect {
  enabled = false;

  private readonly material: THREE.ShaderMaterial;
  private readonly quad: FullScreenQuad;
  private readonly inverseProjectionView = new THREE.Matrix4();

  constructor() {
    this.material = createHorrorMaterial();
    this.quad = new FullScreenQuad(this.material);
  }

  setSize(width: number, height: number): void {
    this.material.uniforms.uResolution.value.set(width, height);
  }

  render(renderer: THREE.WebGLRenderer, context: EffectContext): void {
    const { camera } = context;
    const u = this.material.uniforms;

    u.tDiffuse.value = context.colour;
    u.tDepth.value = context.depth;
    u.uTime.value = context.time;

    this.inverseProjectionView
      .copy(camera.projectionMatrix)
      .multiply(camera.matrixWorldInverse)
      .invert();
    u.uInverseProjectionView.value.copy(this.inverseProjectionView);
    u.uCameraPosition.value.setFromMatrixPosition(camera.matrixWorld);
    u.uFar.value = camera.far;

    renderer.setRenderTarget(context.write);
    this.quad.render(renderer);
  }

  dispose(): void {
    this.material.dispose();
    this.quad.dispose();
  }
}

function createHorrorMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      tDiffuse: { value: null },
      tDepth: { value: null },
      // The shared store, by reference — `HorrorActivity` writes it per frame.
      uCount: horrorUniforms.uHorrorCount,
      uCentre: horrorUniforms.uHorrorCentre,
      uSize: horrorUniforms.uHorrorSize,
      uSurfaceW: horrorUniforms.uHorrorSurfaceW,
      uParams: horrorUniforms.uHorrorParams,
      uInverseProjectionView: { value: new THREE.Matrix4() },
      uCameraPosition: { value: new THREE.Vector3() },
      uFar: { value: 500 },
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;

      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform sampler2D tDiffuse;
      uniform sampler2D tDepth;
      uniform int uCount;
      uniform vec4 uCentre[${MAX_HORRORS}];
      uniform vec4 uSize[${MAX_HORRORS}];
      uniform vec4 uSurfaceW[${MAX_HORRORS}];
      uniform vec4 uParams[${MAX_HORRORS}];
      uniform mat4 uInverseProjectionView;
      uniform vec3 uCameraPosition;
      uniform float uFar;
      uniform float uTime;
      uniform vec2 uResolution;
      varying vec2 vUv;

      float horrorHash(vec3 p) {
        return fract(sin(dot(p, vec3(17.1, 31.7, 11.3))) * 43758.5453);
      }

      // Small 3D value noise, for smoke rather than static.
      float horrorNoise(vec3 p) {
        vec3 i = floor(p);
        vec3 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        float n000 = horrorHash(i);
        float n100 = horrorHash(i + vec3(1.0, 0.0, 0.0));
        float n010 = horrorHash(i + vec3(0.0, 1.0, 0.0));
        float n110 = horrorHash(i + vec3(1.0, 1.0, 0.0));
        float n001 = horrorHash(i + vec3(0.0, 0.0, 1.0));
        float n101 = horrorHash(i + vec3(1.0, 0.0, 1.0));
        float n011 = horrorHash(i + vec3(0.0, 1.0, 1.0));
        float n111 = horrorHash(i + vec3(1.0, 1.0, 1.0));
        return mix(
          mix(mix(n000, n100, f.x), mix(n010, n110, f.x), f.y),
          mix(mix(n001, n101, f.x), mix(n011, n111, f.x), f.y),
          f.z
        );
      }

      void main() {
        vec4 colour = texture2D(tDiffuse, vUv);
        if (uCount == 0) {
          gl_FragColor = colour;
          return;
        }

        // World position of this pixel's hit, unprojected from depth — the
        // fog march's method, shared with the glitch pass.
        vec2 ndc = vUv * 2.0 - 1.0;
        float depth = texture2D(tDepth, vUv).r;
        vec3 world;
        if (depth >= 0.9999) {
          vec4 farPoint = uInverseProjectionView * vec4(ndc, 1.0, 1.0);
          world = uCameraPosition
            + normalize(farPoint.xyz / farPoint.w - uCameraPosition) * uFar;
        } else {
          vec4 hit = uInverseProjectionView * vec4(ndc, depth * 2.0 - 1.0, 1.0);
          world = hit.xyz / hit.w;
        }

        // Shroud amount: strongest at a volume's heart, gone at its shell.
        float sh = 0.0;
        float shSeed = 0.0;
        float shPace = 1.0;
        for (int i = 0; i < ${MAX_HORRORS}; i++) {
          if (i >= uCount) break;
          vec3 rel = (world - uCentre[i].xyz) / uSize[i].xyz;
          // The underside is a cut, not a fade — see art/horror.ts. This is
          // the pass the rule exists for: it grades whatever a pixel hit, and
          // a volume reaching below its subject grades the floor beneath it.
          // (No backticks in this source: it is a template literal.)
          if (rel.y < -1.0) continue;
          vec3 d = vec3(abs(rel.x), max(rel.y, 0.0), abs(rel.z));
          float e = uCentre[i].w > 0.5 ? max(d.x, max(d.y, d.z)) : length(d);
          float w = (1.0 - smoothstep(0.7, 1.0, e)) * uSize[i].w;
          if (w <= 0.0) continue;
          float a = smoothstep(${on('shroud')}, 1.0, w) * uSurfaceW[i].z;
          float body = 1.0 - smoothstep(0.0, 1.0, e);
          if (a * body > sh) {
            sh = a * body;
            shSeed = uParams[i].x;
            shPace = max(uParams[i].z, 1.0);
          }
        }
        if (sh < 0.004) {
          gl_FragColor = colour;
          return;
        }

        // Slow smoke, not static: the noise drifts on a long clock.
        float n = horrorNoise(world * 1.4 + vec3(0.0, uTime * 0.12 * shPace, shSeed * 9.0));
        float dark = clamp(sh * (0.55 + 0.45 * n) * 1.4, 0.0, 0.95);

        vec3 col = colour.rgb;
        float grey = dot(col, vec3(0.299, 0.587, 0.114));
        col = mix(col, vec3(grey), dark * 0.6);
        col = mix(col, vec3(0.02, 0.018, 0.028), dark);

        gl_FragColor = vec4(col, colour.a);
      }
    `,
  });
}
