import * as THREE from 'three';
import { FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass.js';
import { glitchUniforms, GLITCH_ONSETS, MAX_GLITCHES } from '../art/glitch';
import { maskUniforms } from '../art/effectId';
import type { PixelEffect, EffectContext } from './PixelStage';

/**
 * Placed glitch volumes: digital corruption as set dressing. A volume is authored
 * data, exactly as a fog volume is — no geometry, no collision, pushed to the GPU
 * as uniforms. The in-scene half (`art/glitch.ts`) makes the object misbehave;
 * this pass makes the image of it misbehave, with channel splits, tears, block
 * copies and dropped rows. The two together read as a signal going bad.
 *
 * Per chunky pixel, gated by a world-space membership test reconstructed from
 * depth, so corruption tracks the volume and respects occlusion with nothing to
 * author. Everything is a pure function of the clock — bursts are hashed slots,
 * not accumulated state — so there is no history buffer, which is also why true
 * datamoshing and pixel sorting are deliberately absent. Both halves read the same
 * uniform store, packed once per frame by `GlitchActivity`.
 */

export type GlitchShape = 'sphere' | 'box';

/**
 * Every effect, in ladder order — the order they arrive as strength climbs.
 * Working names; renaming an effect renames a weight key and nothing else.
 */
export const GLITCH_EFFECTS = [
  'stutter',
  'split',
  'jitter',
  'tear',
  'palette-rot',
  'slice',
  'salt',
  'facet-flash',
  'dropout',
  'blocks',
  'crush',
  'erode',
  'static-fill',
  'ghost',
  'shatter',
] as const;

export type GlitchEffectName = (typeof GLITCH_EFFECTS)[number];

/** An onset as it appears in GLSL source. The table lives in `art/glitch.ts`. */
function on(name: GlitchEffectName): string {
  return GLITCH_ONSETS[name].toFixed(2);
}

/**
 * One authored piece of corruption. `strength` is the master dial, 0..1, and each
 * effect has a fixed onset along it, so one number walks an object from faintly
 * wrong through visibly breaking apart to unreadable. `weights` are per-effect
 * sliders over that — 1 by default, 0 silences an effect entirely.
 */
export interface GlitchSpec {
  /** Default 'sphere'. */
  shape?: GlitchShape;
  /** Radii for a sphere, half-extents for a box. Metres. */
  size: THREE.Vector3;
  /** The master dial, 0..1. See the ladder in GLITCH-SHADERS.md §3. */
  strength: number;
  /** Decorrelates two identical specs. Salted by position on collection. */
  seed?: number;
  /** Burst cadence multiplier. Default 1; 0 approaches steady corruption. */
  tempo?: number;
  /** Where the volume sits relative to the object it is attached to, for `markGlitched` specs only. Ignored on free-standing placements, which carry a `center`. */
  offset?: THREE.Vector3;
  /** Per-effect sliders, 0..1 each. Absent means 1. */
  weights?: Partial<Record<GlitchEffectName, number>>;
}

/** A free-standing volume: a spec with a place. See `ZoneDefinition.glitches`. */
export interface GlitchPlacement extends GlitchSpec {
  /** Centre, in the zone's world space. */
  center: THREE.Vector3;
}

export class GlitchEffect implements PixelEffect {
  readonly label = 'glitch';
  enabled = false;

  private readonly material: THREE.ShaderMaterial;
  private readonly quad: FullScreenQuad;
  /** Scratch, so the per-frame uniform push allocates nothing. */
  private readonly inverseProjectionView = new THREE.Matrix4();

  constructor() {
    this.material = createGlitchMaterial();
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

function createGlitchMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      tDiffuse: { value: null },
      tDepth: { value: null },
      // The shared store, by reference: `GlitchActivity` writes it once per
      // frame and the in-scene patch reads the same objects.
      uCount: glitchUniforms.uGlitchCount,
      uCentre: glitchUniforms.uGlitchCentre,
      uSize: glitchUniforms.uGlitchSize,
      uScreenW: glitchUniforms.uGlitchScreenW,
      uParams: glitchUniforms.uGlitchParams,
      tEffectMask: maskUniforms.tEffectMask,
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
      uniform sampler2D tEffectMask;
      uniform int uCount;
      uniform vec4 uCentre[${MAX_GLITCHES}];
      uniform vec4 uSize[${MAX_GLITCHES}];
      uniform vec4 uScreenW[${MAX_GLITCHES}];
      uniform vec4 uParams[${MAX_GLITCHES}];
      uniform mat4 uInverseProjectionView;
      uniform vec3 uCameraPosition;
      uniform float uFar;
      uniform float uTime;
      uniform vec2 uResolution;
      varying vec2 vUv;

      float glitchHash(vec2 p) {
        return fract(sin(dot(p, vec2(41.3457, 289.97))) * 43758.5453);
      }

      void main() {
        vec4 colour = texture2D(tDiffuse, vUv);
        if (uCount == 0) {
          gl_FragColor = colour;
          return;
        }

        // Where the scene stops this pixel's ray, in world space — unprojected
        // from clip space, the fog march's method and correct by construction.
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

        // Per-effect amounts, max over the volumes this pixel stands in. Each
        // effect ramps in above its own onset on the master dial, so the same
        // stages arrive in the same order everywhere.
        float aSplit = 0.0;
        float aTear = 0.0;
        float aBlocks = 0.0;
        float aDrop = 0.0;
        float aGhost = 0.0;
        float aSalt = 0.0;
        float gAny = 0.0;
        float gSeed = 0.0;
        // Which marked object this pixel shows, 0 for none. Owned volumes are
        // gated by this identity rather than by reconstructed position, which
        // cannot tell an object's base from the floor it stands on at range.
        // See art/effectId.ts. (No backticks in this source.)
        float gMask = texture2D(tEffectMask, vUv).r;
        for (int i = 0; i < ${MAX_GLITCHES}; i++) {
          if (i >= uCount) break;
          float own = floor(uCentre[i].w * 0.5 + 0.25);
          float w;
          if (own > 0.5) {
            w = abs(gMask - own) < 0.5 ? uSize[i].w : 0.0;
          } else {
            vec3 rel = (world - uCentre[i].xyz) / uSize[i].xyz;
            // The underside is a cut, not a fade — see art/glitch.ts.
            if (rel.y < -1.0) continue;
            vec3 d = vec3(abs(rel.x), max(rel.y, 0.0), abs(rel.z));
            float e = uCentre[i].w > 0.5 ? max(d.x, max(d.y, d.z)) : length(d);
            // Feathered toward the shell, so the volume never shows its edge.
            w = (1.0 - smoothstep(0.7, 1.0, e)) * uSize[i].w;
          }
          if (w <= 0.0) continue;
          if (w > gAny) {
            gAny = w;
            gSeed = uParams[i].x;
          }
          aSplit = max(aSplit, smoothstep(${on('split')}, 1.0, w) * uScreenW[i].x);
          aTear = max(aTear, smoothstep(${on('tear')}, 1.0, w) * uScreenW[i].y);
          aBlocks = max(aBlocks, smoothstep(${on('blocks')}, 1.0, w) * uScreenW[i].z);
          aDrop = max(aDrop, smoothstep(${on('dropout')}, 1.0, w) * uScreenW[i].w);
          aGhost = max(aGhost, smoothstep(${on('ghost')}, 1.0, w) * uParams[i].z);
          aSalt = max(aSalt, smoothstep(${on('salt')}, 1.0, w) * uParams[i].w);
        }
        if (gAny < 0.004) {
          gl_FragColor = colour;
          return;
        }

        vec2 uv = vUv;
        vec2 px = 1.0 / uResolution;
        float row = floor(vUv.y * uResolution.y);

        // Tear: rows displace sideways and re-roll in bursts. Pulls background
        // pixels into the silhouette — the image is torn, not the object.
        if (aTear > 0.001) {
          float roll = floor(uTime * 8.0);
          float live = step(1.0 - aTear * 0.45, glitchHash(vec2(row, roll + gSeed * 100.0)));
          uv.x += (glitchHash(vec2(row * 1.3, roll + 31.0)) - 0.5) * (0.25 * aTear * live);
        }

        // Blocks: cells copy their colour from a hash-offset source. The faux
        // datamosh — no frame history, so the offset is hashed, not motion.
        if (aBlocks > 0.001) {
          vec2 cellSize =
            px * (4.0 + floor(glitchHash(vec2(floor(uTime * 2.0), gSeed * 53.0)) * 12.0));
          vec2 cell = floor(uv / cellSize);
          float pick = glitchHash(cell * 0.37 + floor(uTime * 5.0) * 0.71 + gSeed * 29.0);
          if (pick < aBlocks * 0.35) {
            uv += (vec2(glitchHash(cell + 3.7), glitchHash(cell + 9.1)) - 0.5) * (0.2 * aBlocks);
          }
        }

        uv = clamp(uv, vec2(0.0), vec2(1.0));
        vec3 col = texture2D(tDiffuse, uv).rgb;

        // Split: red and blue part company. One chunky pixel already reads.
        if (aSplit > 0.001) {
          vec2 off = vec2((1.0 + floor(aSplit * 4.0)) * px.x, 0.0);
          col.r = texture2D(tDiffuse, clamp(uv + off, vec2(0.0), vec2(1.0))).r;
          col.b = texture2D(tDiffuse, clamp(uv - off, vec2(0.0), vec2(1.0))).b;
        }

        // Ghost: a displaced translucent double, drifting on the clock.
        if (aGhost > 0.001) {
          vec2 go = vec2(0.05, 0.018) * aGhost * (0.4 + 0.6 * sin(uTime * 2.3 + gSeed * 6.2831));
          vec3 gc = texture2D(tDiffuse, clamp(vUv - go, vec2(0.0), vec2(1.0))).rgb;
          col = mix(col, max(col, gc), aGhost * 0.55);
        }

        // Dropout: scanline rows go nearly black.
        if (aDrop > 0.001) {
          float dead =
            step(1.0 - aDrop * 0.3, glitchHash(vec2(row * 2.3, floor(uTime * 6.0) + gSeed * 71.0)));
          col *= 1.0 - dead * 0.92;
        }

        // Salt: sparse chunky pixels of saturated bit-error colour.
        if (aSalt > 0.001) {
          vec2 cp = floor(gl_FragCoord.xy);
          if (glitchHash(cp * 0.37 + floor(uTime * 10.0) * 1.7) < aSalt * 0.12) {
            vec3 sc = vec3(
              step(0.5, glitchHash(cp + 1.0)),
              step(0.5, glitchHash(cp + 2.0)),
              step(0.5, glitchHash(cp + 3.0))
            );
            col = max(sc, vec3(0.06)) * (0.6 + 0.8 * glitchHash(cp + 4.0));
          }
        }

        gl_FragColor = vec4(col, colour.a);
      }
    `,
  });
}
