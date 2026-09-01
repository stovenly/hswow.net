import * as THREE from 'three';
import { FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass.js';
import { HELD_LAYER } from '../layers';
import type { PixelEffect, EffectContext } from './PixelStage';

/**
 * The held-item pass: blit the chain forward, clear the target's depth, and
 * render `HELD_LAYER` over the finished frame — the tool depth-tests against
 * itself and never against the world, so it cannot clip into a wall.
 *
 * After fog and bloom, so neither treats the hand as part of the room; before
 * the corruption passes, so those still wash over everything.
 */
export class HeldEffect implements PixelEffect {
  readonly label = 'held';
  enabled = false;

  private readonly blitMaterial: THREE.ShaderMaterial;
  private readonly quad: FullScreenQuad;

  constructor() {
    this.blitMaterial = new THREE.ShaderMaterial({
      depthTest: false,
      depthWrite: false,
      uniforms: { tDiffuse: { value: null } },
      vertexShader: /* glsl */ `
        varying vec2 vUv;

        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform sampler2D tDiffuse;
        varying vec2 vUv;

        void main() {
          gl_FragColor = texture2D(tDiffuse, vUv);
        }
      `,
    });
    this.quad = new FullScreenQuad(this.blitMaterial);
  }

  setSize(): void {
    // Draws into the chain's next link, all at chunky resolution.
  }

  render(renderer: THREE.WebGLRenderer, context: EffectContext): void {
    const { camera, scene } = context;

    this.blitMaterial.uniforms.tDiffuse.value = context.colour;
    renderer.setRenderTarget(context.write);
    this.quad.render(renderer);

    const priorAutoClear = renderer.autoClear;
    const priorMask = camera.layers.mask;
    renderer.autoClear = false;
    // The write target's own depth, which nothing downstream reads.
    renderer.clearDepth();
    camera.layers.set(HELD_LAYER);
    renderer.render(scene, camera);

    camera.layers.mask = priorMask;
    renderer.autoClear = priorAutoClear;
  }

  dispose(): void {
    this.blitMaterial.dispose();
    this.quad.dispose();
  }
}
