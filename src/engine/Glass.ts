import * as THREE from 'three';
import { FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass.js';
import { GLASS_LAYER } from '../layers';
import { GLASS_MATERIAL } from '../art/glass';
import type { PixelEffect, EffectContext } from './PixelStage';

/**
 * The glass pass. SHADERS-AND-MATERIALS.md Track B / M3.
 *
 * `WaterEffect`'s shape, near enough line for line, because it is the same kind
 * of thing: blit the chain's colour forward, then re-render the scene with the
 * camera restricted to `GLASS_LAYER` into that same target, with the scene's
 * colour and depth bound as uniforms. Three culls by layer while building the
 * render list, so this costs the glass draw calls and a scene-graph walk.
 *
 * **Nothing here is lit**, and nothing needs to be — the camera is on a layer no
 * light is on, so no light is pushed and the shadow map is not redrawn.
 * `GLASS_MATERIAL` shades itself from the sky and the buffers below it.
 *
 * ## Where it sits
 *
 * ```
 * GTAO ─► water ─► underwater ─► glass ─► fog volumes ─► particles ─► bloom
 * ```
 *
 * - **After water and underwater**, so a crystal standing over a pond refracts
 *   the pond, and so a crystal seen from underwater is behind the murk rather
 *   than in front of it. Both of those are surfaces; glass is a surface too,
 *   and the one that reads all the others.
 * - **Before the fog volumes and bloom**, for the reasons water gives: mist
 *   hangs in front of a crystal rather than inside it, and a lantern's halo
 *   lies over the glass. The refraction reads the pre-bloom colour, so a
 *   refracted lamp shows the lamp and not its bleed — correct, since the bleed
 *   is in the air near the lamp rather than on its surface.
 *
 * A pass that costs a scene walk must not run in the zones with no glass in
 * them, so `setActive` fires on every crossing with what the entered zone
 * actually built — observed rather than declared, see `Zone.hasGlass`.
 */
export class GlassEffect implements PixelEffect {
  enabled = false;

  private readonly blitMaterial: THREE.ShaderMaterial;
  private readonly quad: FullScreenQuad;

  /** Whether the zone standing in the scene right now built any glass. */
  private present = false;

  /** Scratch, so a per-frame uniform push allocates nothing. */
  private readonly projectionView = new THREE.Matrix4();
  private readonly inverse = new THREE.Matrix4();

  constructor() {
    this.blitMaterial = new THREE.ShaderMaterial({
      // A blit has no business writing depth — a `ShaderMaterial` does by
      // default, and a full-screen quad at the near plane would stamp zero
      // across the target a moment before the glass is drawn against it.
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

  /**
   * Tells the pass whether the zone now standing has glass in it. Called at the
   * same moment the fog volumes and the water flag are swapped, and for the
   * same reason: it happens at full black during a crossing.
   */
  setActive(present: boolean): void {
    this.present = present;
  }

  /** True when there is anything to draw. `PostFX` layers its switch over this. */
  get hasGlass(): boolean {
    return this.present;
  }

  setSize(): void {
    // Nothing of its own to resize. It draws into the chain's next link and
    // reads what it is handed, all at chunky resolution.
  }

  render(renderer: THREE.WebGLRenderer, context: EffectContext): void {
    const { camera, scene } = context;

    // --- carry the frame forward ---------------------------------------------
    // Glass covers a few hundred pixels and the rest has to arrive intact.
    this.blitMaterial.uniforms.tDiffuse.value = context.colour;
    renderer.setRenderTarget(context.write);
    this.quad.render(renderer);

    // --- what the glass needs to know about the frame ------------------------
    const u = GLASS_MATERIAL.uniforms;
    u.tScene.value = context.colour;
    u.tDepth.value = context.depth;
    (u.uResolution.value as THREE.Vector2).copy(context.size);
    u.uFar.value = camera.far;

    this.projectionView.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    (u.uProjectionView.value as THREE.Matrix4).copy(this.projectionView);
    (u.uInverseProjectionView.value as THREE.Matrix4).copy(
      this.inverse.copy(this.projectionView).invert(),
    );

    // --- the draw -------------------------------------------------------------
    // No clear of any kind: the blit above is the frame, and the depth attached
    // to this target is a renderbuffer nothing here reads — the glass tests
    // itself in the shader against the scene's depth texture, which is a
    // different buffer and is not bound here.
    const priorAutoClear = renderer.autoClear;
    const priorMask = camera.layers.mask;

    renderer.autoClear = false;
    camera.layers.set(GLASS_LAYER);
    renderer.render(scene, camera);

    camera.layers.mask = priorMask;
    renderer.autoClear = priorAutoClear;
  }

  dispose(): void {
    this.blitMaterial.dispose();
    this.quad.dispose();
    // `GLASS_MATERIAL` is deliberately left alone, exactly as `WATER_MATERIAL`
    // is: it is shared by every crystal ever built, and disposing it from here
    // would free it out from under geometry still holding it.
  }
}
