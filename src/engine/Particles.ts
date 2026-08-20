import * as THREE from 'three';
import { FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass.js';
import { PARTICLE_LAYER } from '../layers';
import { particleUniforms } from '../art/particles';
import type { PixelEffect, EffectContext } from './PixelStage';

/**
 * The particle pass: the third-stage draw. Borrowed from `WaterEffect` almost line
 * for line — blit the chain's colour forward, then re-render the scene with the
 * camera restricted to `PARTICLE_LAYER` into that same target, with the scene's
 * depth bound as a uniform.
 *
 * After water, which would otherwise paint over rain at the shoreline. After the
 * fog volumes, because the fog march veils a pixel by the scene depth at that
 * pixel — a flake half a metre from your face over a wall twenty metres away would
 * be veiled by twenty metres of mist. The cost is that a placed mist volume does
 * not veil the snow standing inside it. Before bloom, whose emitters pass
 * depth-tests against a uniform this pass sets, which is the one ordering that
 * breaks silently if it is changed.
 *
 * Unlike the water pass this one needs the lights: a camera restricted to a layer
 * collects only the lights also on it, so `ZoneManager.prepare` enables
 * `PARTICLE_LAYER` on every light it walks, or every flake comes out black.
 */
export class ParticlesEffect implements PixelEffect {
  readonly label = 'particles';
  enabled = false;

  private present = false;
  private readonly blitMaterial: THREE.ShaderMaterial;
  private readonly quad: FullScreenQuad;

  constructor() {
    this.blitMaterial = new THREE.ShaderMaterial({
      // A blit has no business writing depth. A `ShaderMaterial` does by default, and
      // a full-screen quad at the near plane therefore stamps zero across the whole
      // target. The particle materials no longer depth-test at all, so this is belt
      // as well as braces; it is still the correct setting for a copy.
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
    // Nothing of its own to resize. It draws into the chain's next link and
    // reads what it is handed, all at chunky resolution.
  }

  /**
   * Whether the zone being entered has anything on the particle layer. Water's
   * `setActive` exactly, and for its reason: the pass costs a full-screen blit and
   * a whole-scene walk whether or not there is a flake in the zone.
   */
  setActive(present: boolean): void {
    this.present = present;
  }

  get hasParticles(): boolean {
    return this.present;
  }

  render(renderer: THREE.WebGLRenderer, context: EffectContext): void {
    const { camera, scene } = context;

    // --- carry the frame forward ---------------------------------------------
    // The particles cover a small fraction of the frame and the rest has to
    // arrive intact, so the link starts as a copy of the previous one.
    this.blitMaterial.uniforms.tDiffuse.value = context.colour;
    renderer.setRenderTarget(context.write);
    this.quad.render(renderer);

    // --- what the particles need to know about the frame ---------------------
    particleUniforms.tDepth.value = context.depth;
    particleUniforms.uResolution.value.copy(context.size);
    particleUniforms.uNear.value = camera.near;
    particleUniforms.uFar.value = camera.far;

    // --- the draw -------------------------------------------------------------
    const priorAutoClear = renderer.autoClear;
    const priorMask = camera.layers.mask;

    renderer.autoClear = false;
    camera.layers.set(PARTICLE_LAYER);
    renderer.render(scene, camera);

    camera.layers.mask = priorMask;
    renderer.autoClear = priorAutoClear;
  }

  dispose(): void {
    this.blitMaterial.dispose();
    this.quad.dispose();
    // The two particle materials are deliberately left alone, exactly as
    // `WATER_MATERIAL` is: they are shared by every system that has ever been built,
    // and disposing them from here would free them out from under live geometry.
  }
}
