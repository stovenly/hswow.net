import * as THREE from 'three';
import { FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass.js';
import { WATER_LAYER } from '../layers';
import { WATER_MATERIAL } from '../art/water';
import type { PixelEffect, EffectContext } from './PixelStage';

/**
 * The water pass: the second-stage draw, and one of the two entries in the effect
 * slot that draw rather than filter. Copy the chain's colour forward, then render
 * the scene again with the camera on `WATER_LAYER` into that same target, with the
 * colour and depth just copied bound as textures. Nothing here is lit: the camera
 * is on a layer no light is on, so no light is pushed and the shadow map is not
 * redrawn.
 *
 * After GTAO, so the pond bed showing through shallow water is the shaded bed.
 * Before the fog volumes, so mist hangs over a pond rather than under it — at the
 * honest cost that the fog march reads a depth buffer holding the bed, so a volume
 * sitting on a pond is integrated down to it. Before bloom, so a lantern's halo
 * lies over the water and a reflected lamp reflects the lamp and not its bleed.
 *
 * `setActive` is called on every crossing with whether the entered zone built any
 * water, taken off the geometry rather than off a declaration.
 */
export class WaterEffect implements PixelEffect {
  readonly label = 'water';
  enabled = false;

  private readonly blitMaterial: THREE.ShaderMaterial;
  private readonly quad: FullScreenQuad;

  /** Whether the zone standing in the scene right now built any water. */
  private present = false;

  /**
   * Every water surface in the zone, with the box it covers and the height it sits
   * at, for working out whether the camera is under one. Collected once per zone
   * with the boxes cached: the open-sea plane is a hundred and twenty thousand
   * vertices, and asking three for its bounding box sixty times a second would cost
   * more than the pass that draws it.
   */
  private readonly surfaces: { box: THREE.Box3; level: number }[] = [];
  private scanned = false;

  /** Scratch, so a per-frame uniform push allocates nothing. */
  private readonly projectionView = new THREE.Matrix4();
  private readonly inverse = new THREE.Matrix4();
  private priorMask = 1;

  constructor() {
    this.blitMaterial = new THREE.ShaderMaterial({
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

  /** Tells the pass whether the zone now standing has water in it. Called at full black during a crossing, with the fog volumes. */
  setActive(present: boolean): void {
    this.present = present;
    // The surfaces belong to the zone being left. Cleared here and rebuilt on
    // the next frame that asks, which is the same lazy shape `Zone.root` uses.
    this.surfaces.length = 0;
    this.scanned = false;
  }

  /** True when there is anything to draw. `PostFX` layers its switch over this. */
  get hasWater(): boolean {
    return this.present;
  }

  /**
   * How far below a water surface the camera is, in metres. Zero in the air. Asked
   * once a frame and answered from a cached list, because the underwater pass has
   * to know before the frame is drawn. The mean surface height, not the wave
   * height: keying a full-screen effect to a crest going past the camera would make
   * it flicker.
   */
  submersion(scene: THREE.Scene, camera: THREE.Camera): number {
    if (!this.present) return 0;

    if (!this.scanned) {
      this.scanned = true;
      scene.traverse((object) => {
        if (!(object instanceof THREE.Mesh) || object.userData.water !== true) return;
        this.surfaces.push({
          box: new THREE.Box3().setFromObject(object),
          level: object.getWorldPosition(_worldPosition).y,
        });
      });
    }

    _cameraPosition.setFromMatrixPosition(camera.matrixWorld);
    let deepest = 0;
    for (const surface of this.surfaces) {
      const { box, level } = surface;
      if (_cameraPosition.x < box.min.x || _cameraPosition.x > box.max.x) continue;
      if (_cameraPosition.z < box.min.z || _cameraPosition.z > box.max.z) continue;
      deepest = Math.max(deepest, level - _cameraPosition.y);
    }
    return deepest;
  }

  setSize(): void {
    // Nothing of its own to resize. The pass draws into the chain's next link
    // and reads the colour and depth it is handed, all at chunky resolution.
  }

  render(renderer: THREE.WebGLRenderer, context: EffectContext): void {
    const { camera, scene } = context;

    // --- carry the frame forward ---------------------------------------------
    this.blitMaterial.uniforms.tDiffuse.value = context.colour;
    renderer.setRenderTarget(context.write);
    this.quad.render(renderer);

    // --- what the water needs to know about the frame ------------------------
    const u = WATER_MATERIAL.uniforms;
    // The colour it composites over and marches through, and the depth it tests
    // itself against. Both are the chain's, not the stage's — so water sees the
    // outline and the ambient occlusion that were applied before it.
    u.tScene.value = context.colour;
    u.tDepth.value = context.depth;
    (u.uResolution.value as THREE.Vector2).copy(context.size);
    u.uFar.value = camera.far;

    // Recomputed every frame because the camera moves every frame.
    // `camera.matrixWorld` is current by the time a pass runs, and
    // `cameraPosition` in the shader is filled by the renderer from it.
    this.projectionView.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    (u.uProjectionView.value as THREE.Matrix4).copy(this.projectionView);
    (u.uInverseProjectionView.value as THREE.Matrix4).copy(
      this.inverse.copy(this.projectionView).invert(),
    );

    // --- the draw -------------------------------------------------------------
    // No clear of any kind: the blit above is the frame, and the depth attached to
    // this target is a renderbuffer nothing in this pipeline reads — the water does
    // its own depth test in the shader against the scene's depth texture.
    const priorAutoClear = renderer.autoClear;
    this.priorMask = camera.layers.mask;

    renderer.autoClear = false;
    camera.layers.set(WATER_LAYER);
    renderer.render(scene, camera);

    camera.layers.mask = this.priorMask;
    renderer.autoClear = priorAutoClear;
  }

  dispose(): void {
    this.blitMaterial.dispose();
    this.quad.dispose();
    // `WATER_MATERIAL` is deliberately left alone. It is shared by every pond
    // that has ever been built, exactly as `ART_MATERIAL` is, and disposing it
    // from here would free it out from under geometry still holding it.
  }
}

/** Scratch for `submersion`, so asking every frame allocates nothing. */
const _worldPosition = new THREE.Vector3();
const _cameraPosition = new THREE.Vector3();
