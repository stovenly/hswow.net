import * as THREE from 'three';
import { FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass.js';
import { WATER_MATERIAL, MURK_MIX } from '../art/water/material';
import { NOISE_GLSL } from './noise';
import type { PixelEffect, EffectContext } from './PixelStage';

/**
 * Being in the water. `Water.ts` draws the surface; this is the volume on the
 * near side of it: Beer–Lambert murk against the scene depth, a flat cast and a
 * slow wobble of at most one chunky pixel. Water surfaces are marked with alpha
 * 0 and skipped, because the depth buffer has no water in it. While the near
 * plane straddles the surface, each pixel decides for itself which side it is
 * on, with a one-pixel meniscus between.
 */
export class UnderwaterEffect implements PixelEffect {
  readonly label = 'underwater';
  enabled = false;

  private readonly material: THREE.ShaderMaterial;
  private readonly quad: FullScreenQuad;
  private readonly inverse = new THREE.Matrix4();

  constructor() {
    this.material = createUnderwaterMaterial();
    this.quad = new FullScreenQuad(this.material);
  }

  /**
   * Where the camera stands against the water. `depth` is metres below the mean
   * surface, `level` that surface's height; null in the air. The full-screen
   * amount ramps over the first 35 cm, and while the camera is within the near
   * plane's reach of the surface the shader decides per pixel.
   */
  setSurface(surface: { depth: number; level: number } | null, camera: THREE.PerspectiveCamera): void {
    const u = this.material.uniforms;
    if (!surface) {
      u.uAmount.value = 0;
      u.uCrossing.value = 0;
      this.enabled = false;
      return;
    }
    const amount = Math.min(Math.max(surface.depth / 0.35, 0), 1);
    u.uAmount.value = amount;
    u.uSurfaceY.value = surface.level;
    // The near plane's half-height in metres, plus a little: within it the
    // frame can be half in and half out.
    const reach = camera.near * Math.tan((camera.fov * Math.PI) / 360) * 1.5 + 0.05;
    u.uCrossing.value = Math.abs(surface.depth) < reach ? 1 : 0;
    this.enabled = amount > 0 || u.uCrossing.value > 0;
  }

  setSize(): void {
    // Nothing of its own to resize.
  }

  render(renderer: THREE.WebGLRenderer, context: EffectContext): void {
    const { camera } = context;
    const u = this.material.uniforms;

    u.tDiffuse.value = context.colour;
    u.tDepth.value = context.depth;
    u.uTime.value = context.time;
    u.uFar.value = camera.far;
    (u.uResolution.value as THREE.Vector2).copy(context.size);

    this.inverse.copy(camera.projectionMatrix).multiply(camera.matrixWorldInverse).invert();
    (u.uInverseProjectionView.value as THREE.Matrix4).copy(this.inverse);
    (u.uCameraPosition.value as THREE.Vector3).setFromMatrixPosition(camera.matrixWorld);

    renderer.setRenderTarget(context.write);
    this.quad.render(renderer);
  }

  dispose(): void {
    this.material.dispose();
    this.quad.dispose();
  }
}

function createUnderwaterMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      tDiffuse: { value: null },
      tDepth: { value: null },
      uInverseProjectionView: { value: new THREE.Matrix4() },
      uCameraPosition: { value: new THREE.Vector3() },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uFar: { value: 500 },
      uTime: { value: 0 },
      uSurfaceY: { value: 0 },
      /** 1 while the near plane straddles the surface. */
      uCrossing: { value: 0 },
      // Shared with the surface rather than copied, so the two cannot disagree
      // and leave a seam where they meet.
      uAmount: WATER_MATERIAL.uniforms.uSubmerged,
      uTint: WATER_MATERIAL.uniforms.uDeep,
      uHaze: WATER_MATERIAL.uniforms.uShallow,
      /** Absorption per metre. 0.085 hides ~72% at 15 m, ~95% at 35 m. */
      uDensity: WATER_MATERIAL.uniforms.uMurkDensity,
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
      uniform mat4 uInverseProjectionView;
      uniform vec3 uCameraPosition;
      uniform vec2 uResolution;
      uniform float uFar;
      uniform float uTime;
      uniform float uAmount;
      uniform float uSurfaceY;
      uniform float uCrossing;
      uniform vec3 uTint;
      uniform vec3 uHaze;
      uniform float uDensity;
      varying vec2 vUv;

      ${NOISE_GLSL}

      void main() {
        // Which side of the surface this pixel's bit of the near plane is on.
        float amount = uAmount;
        float meniscus = 0.0;
        if (uCrossing > 0.5) {
          vec4 nearPoint = uInverseProjectionView * vec4(vUv * 2.0 - 1.0, -1.0, 1.0);
          float nearY = nearPoint.y / nearPoint.w;
          float px = abs(dFdy(nearY)) + 1e-4;
          amount = 1.0 - smoothstep(uSurfaceY - px, uSurfaceY + px, nearY);
          meniscus = 1.0 - smoothstep(0.0, px * 1.5, abs(nearY - uSurfaceY));
        }

        // A slow two-octave sway of at most one chunky pixel, so the view swims without smearing.
        vec2 pixel = 1.0 / uResolution;
        vec2 wobble = vec2(
          valueNoise(vUv * 6.0 + vec2(uTime * 0.35, 0.0)) - 0.5,
          valueNoise(vUv * 6.0 + vec2(0.0, uTime * 0.29) + 7.3) - 0.5
        ) * 2.0 * pixel * amount;
        vec2 uv = clamp(vUv + wobble, 0.0, 1.0);

        vec4 source = texture2D(tDiffuse, uv);
        vec3 colour = source.rgb;

        float depth = texture2D(tDepth, uv).r;
        float distance;
        if (depth >= 0.9999) {
          distance = uFar;
        } else {
          vec4 hit = uInverseProjectionView * vec4(uv * 2.0 - 1.0, depth * 2.0 - 1.0, 1.0);
          distance = length(hit.xyz / hit.w - uCameraPosition);
        }

        // Water surfaces murk themselves — see the class note.
        float murk = 1.0 - exp(-distance * uDensity);
        murk *= step(0.5, source.a);

        vec3 scattered = mix(uTint, uHaze, ${MURK_MIX.toFixed(2)});
        colour = mix(colour, scattered, murk * amount);
        colour = mix(colour, colour * 0.85 + uTint * 0.09, amount);
        colour = mix(colour, mix(uHaze, vec3(1.0), 0.4), meniscus * 0.8);

        gl_FragColor = vec4(colour, 1.0);
      }
    `,
  });
}
