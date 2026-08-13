import * as THREE from 'three';
import { FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass.js';
import { PARTICLE_LAYER } from '../layers';
import { particleUniforms } from '../art/particles';
import type { PixelEffect, EffectContext } from './PixelStage';

/**
 * The particle pass: the third-stage draw. PARTICLES.md §2.
 *
 * Borrowed from `WaterEffect` almost line for line, because it is the same
 * shape of thing: blit the chain's colour forward into the next link, then
 * re-render the scene with the camera restricted to `PARTICLE_LAYER`, into that
 * same target, with the scene's depth bound as a uniform. Three culls by layer
 * while building the render list, so this costs the particle draw calls — one
 * per system — and a scene-graph walk.
 *
 * ## Where it sits, and why each neighbour is where it is
 *
 * ```
 * GTAO ─► water ─► underwater ─► fog volumes ─► particles ─► bloom
 * ```
 *
 * - **After water.** Water draws into the chain and would paint over anything
 *   already there, so rain over a lake would stop at the shoreline.
 * - **After the fog volumes**, and this one is not obvious. The fog march veils
 *   a pixel by the *scene* depth at that pixel, so a flake half a metre from
 *   your face over a wall twenty metres away would be veiled by twenty metres
 *   of mist. Drawn after, particles apply the scene's own linear fog per
 *   particle at their own distance, which is right. The honest cost: a placed
 *   mist volume does not veil the snow standing inside it.
 * - **Before bloom**, so an ember's halo is added — and because bloom's
 *   emitters pass draws the emissive systems with their own material, whose
 *   depth test reads a uniform *this* pass sets. That is the one ordering that
 *   breaks silently if it is ever changed.
 *
 * **Nothing here restores a layer mask it did not save**, and unlike the water
 * pass this one needs the lights: a camera restricted to a layer collects only
 * the lights that are also on it, so `ZoneManager.prepare` enables
 * `PARTICLE_LAYER` on every light it walks. Without that the material compiles
 * against an empty light list and every flake comes out black.
 */
export class ParticlesEffect implements PixelEffect {
  readonly label = 'particles';
  enabled = false;

  private present = false;
  private readonly blitMaterial: THREE.ShaderMaterial;
  private readonly quad: FullScreenQuad;

  constructor() {
    this.blitMaterial = new THREE.ShaderMaterial({
      // **A blit has no business writing depth.** A `ShaderMaterial` does by
      // default, and a full-screen quad at the near plane therefore stamps zero
      // across the whole target — which is exactly what made the first version
      // of this pass draw eleven systems and show none of them. The particle
      // materials no longer depth-test at all, so this is belt as well as
      // braces; it is still the correct setting for a copy.
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
   * Whether the zone being entered has anything on the particle layer.
   *
   * Water's `setActive` exactly, and for its reason: the pass costs a
   * full-screen blit and a whole-scene walk whether or not there is a flake in
   * the zone, and most zones have none. Told at the threshold rather than
   * looked for per frame — see `ZoneManager.prepare` for what does the looking.
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
    // `WATER_MATERIAL` is: they are shared by every system that has ever been
    // built, and disposing them from here would free them out from under
    // geometry still holding them.
  }
}
