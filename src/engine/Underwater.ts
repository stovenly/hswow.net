import * as THREE from 'three';
import { FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass.js';
import { WATER_MATERIAL, MURK_MIX } from '../art/water';
import type { PixelEffect, EffectContext } from './PixelStage';

/**
 * Being in the water. `Water.ts` draws the surface; this is the volume on the near
 * side of it, so it runs over every pixel rather than over the pixels a pond
 * covers — Beer-Lambert murk against the scene depth, plus a flat cast and a slow
 * wobble. Water surfaces are marked with alpha 0 and skipped, because the depth
 * buffer has no water in it and at those pixels holds whatever is beyond the
 * surface; the water shader murks its own back face instead.
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

  /** Ramped over the first 35 cm, so a head bobbing at the waterline cannot strobe. */
  setDepth(metres: number): void {
    const amount = Math.min(Math.max(metres / 0.35, 0), 1);
    this.material.uniforms.uAmount.value = amount;
    this.enabled = amount > 0;
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
      uFar: { value: 500 },
      uTime: { value: 0 },
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
      uniform float uFar;
      uniform float uTime;
      uniform float uAmount;
      uniform vec3 uTint;
      uniform vec3 uHaze;
      uniform float uDensity;
      varying vec2 vUv;

      void main() {
        // A couple of pixels of sway, so there is something in front of the lens.
        vec2 wobble = vec2(
          sin(vUv.y * 23.0 + uTime * 1.3) + 0.5 * sin(vUv.y * 41.0 - uTime * 0.9),
          sin(vUv.x * 27.0 - uTime * 1.1) + 0.5 * sin(vUv.x * 37.0 + uTime * 1.6)
        ) * (0.0022 * uAmount);
        vec2 uv = clamp(vUv + wobble, 0.0, 1.0);

        vec4 source = texture2D(tDiffuse, uv);
        vec3 colour = source.rgb;

        // Distance by unprojection, the same way the water and fog volumes do it.
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

        // The far field. Same constant the surface uses — see MURK_MIX.
        vec3 scattered = mix(uTint, uHaze, ${MURK_MIX.toFixed(2)});
        colour = mix(colour, scattered, murk * uAmount);
        // Applies at every distance, so this is what sets how gloomy the near
        // field is. Light-handed on purpose.
        colour = mix(colour, colour * 0.85 + uTint * 0.09, uAmount);

        gl_FragColor = vec4(colour, 1.0);
      }
    `,
  });
}
