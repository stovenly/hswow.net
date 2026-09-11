import * as THREE from 'three';
import { withStaticHidden } from './statics';
import { FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass.js';
import { WATER_LAYER } from '../layers';
import { WATER_MATERIAL } from '../art/water/material';
import type { PixelEffect, EffectContext } from './PixelStage';

/** What the pass needs of the zone's water: its per-frame GPU work and its query. */
export interface WaterRuntimeLike {
  readonly hasWater: boolean;
  readonly persistence: { readonly texture: THREE.Texture; readonly min: THREE.Vector2; readonly size: THREE.Vector2 };
  step(renderer: THREE.WebGLRenderer, camera: THREE.Camera, dt: number, motion: number): void;
  submersionAt(x: number, y: number, z: number): { depth: number; level: number } | null;
}

/**
 * The water pass: the second-stage draw. Copy the chain's colour forward, step
 * the water's own buffers, then render the scene again with the camera on
 * `WATER_LAYER` into that same target, with the colour and depth just copied
 * bound as textures. Nothing here is lit: the camera is on a layer no light is
 * on, so no light is pushed and the shadow map is not redrawn.
 *
 * After GTAO, so the bed showing through shallow water is the shaded bed.
 * Before the fog volumes, so mist hangs over a pond rather than under it.
 * Before bloom, so a lantern's halo lies over the water.
 */
export class WaterEffect implements PixelEffect {
  readonly label = 'water';
  enabled = false;

  private readonly blitMaterial: THREE.ShaderMaterial;
  private readonly quad: FullScreenQuad;
  private runtime: WaterRuntimeLike | null = null;
  private lastTime = -1;

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

  /** The standing zone's water, or null in a room with none. Swapped at full black. */
  setRuntime(runtime: WaterRuntimeLike | null): void {
    this.runtime = runtime;
    this.lastTime = -1;
  }

  get hasWater(): boolean {
    return this.runtime?.hasWater ?? false;
  }

  /**
   * How far below the surface the camera is, and where that surface is. Null in
   * the air. The mean surface height, not the wave height: keying a full-screen
   * effect to a crest going past the camera would make it flicker.
   */
  submersion(camera: THREE.Camera): { depth: number; level: number } | null {
    if (!this.runtime) return null;
    _cameraPosition.setFromMatrixPosition(camera.matrixWorld);
    return this.runtime.submersionAt(_cameraPosition.x, _cameraPosition.y, _cameraPosition.z);
  }

  setSize(): void {
    // Nothing of its own to resize: the pass draws into the chain's next link at chunky resolution.
  }

  render(renderer: THREE.WebGLRenderer, context: EffectContext): void {
    const { camera, scene } = context;

    this.blitMaterial.uniforms.tDiffuse.value = context.colour;
    renderer.setRenderTarget(context.write);
    this.quad.render(renderer);

    const u = WATER_MATERIAL.uniforms;
    if (this.runtime) {
      const dt = this.lastTime < 0 ? 1 / 60 : Math.min(0.1, Math.max(0, context.time - this.lastTime));
      this.lastTime = context.time;
      this.runtime.step(renderer, camera, dt, u.uWaterMotion.value as number);
      const buffer = this.runtime.persistence;
      u.tPersist.value = buffer.texture;
      (u.uPersistMin.value as THREE.Vector2).copy(buffer.min);
      (u.uPersistSize.value as THREE.Vector2).copy(buffer.size);
      renderer.setRenderTarget(context.write);
    }

    this.projectionView.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    this.inverse.copy(this.projectionView).invert();
    u.tScene.value = context.colour;
    u.tDepth.value = context.depth;
    (u.uResolution.value as THREE.Vector2).copy(context.size);
    u.uFar.value = camera.far;
    (u.uProjectionView.value as THREE.Matrix4).copy(this.projectionView);
    (u.uInverseProjectionView.value as THREE.Matrix4).copy(this.inverse);

    // No clear: the blit above is the frame, and the water does its own depth
    // test in the shader against the scene's depth texture.
    const priorAutoClear = renderer.autoClear;
    this.priorMask = camera.layers.mask;
    renderer.autoClear = false;
    camera.layers.set(WATER_LAYER);
    withStaticHidden(() => renderer.render(scene, camera));
    camera.layers.mask = this.priorMask;
    renderer.autoClear = priorAutoClear;
  }

  dispose(): void {
    this.blitMaterial.dispose();
    this.quad.dispose();
    // `WATER_MATERIAL` is shared by every body ever built and is left alone.
  }
}

const _cameraPosition = new THREE.Vector3();
