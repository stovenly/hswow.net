import * as THREE from 'three';
import { withStaticHidden } from './statics';
import { FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass.js';
import { HEAT_LAYER } from '../layers';
import { heatUniforms, HEAT_REST } from '../art/heat';
import type { PixelEffect, EffectContext } from './PixelStage';

/**
 * The heat pass: the air over a flame bending the frame. The plumes on
 * `HEAT_LAYER` are drawn into a field of screen offsets, and the frame is then
 * read back through that field. After bloom, so the glow bends with the wall
 * behind it; before the held pass, so the lantern in the hand is drawn sharp
 * over the shimmer its own flame makes.
 */

/** Chunky pixels a plume can move a pixel by at full strength. */
const BEND = 6;

export class HeatEffect implements PixelEffect {
  readonly label = 'heat';
  enabled = false;

  private present = false;
  private readonly field: THREE.WebGLRenderTarget;
  private readonly warpMaterial: THREE.ShaderMaterial;
  private readonly quad: FullScreenQuad;
  private readonly priorClear = new THREE.Color();

  constructor() {
    this.field = new THREE.WebGLRenderTarget(1, 1, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      depthBuffer: false,
    });
    this.warpMaterial = new THREE.ShaderMaterial({
      depthTest: false,
      depthWrite: false,
      uniforms: {
        tDiffuse: { value: null },
        tField: { value: this.field.texture },
        uBend: { value: new THREE.Vector2() },
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
        uniform sampler2D tField;
        uniform vec2 uBend;
        varying vec2 vUv;

        void main() {
          vec4 field = texture2D(tField, vUv);
          vec2 offset = (field.rg - ${HEAT_REST.toFixed(2)}) * 2.0 * field.a * uBend;
          gl_FragColor = texture2D(tDiffuse, vUv + offset);
        }
      `,
    });
    this.quad = new FullScreenQuad(this.warpMaterial);
  }

  setSize(width: number, height: number): void {
    this.field.setSize(Math.max(1, width), Math.max(1, height));
    this.warpMaterial.uniforms.uBend.value.set(BEND / Math.max(1, width), BEND / Math.max(1, height));
  }

  /** Whether anything on screen is hot: the zone's flames, or the one in the hand. */
  setActive(present: boolean): void {
    this.present = present;
  }

  get hasHeat(): boolean {
    return this.present;
  }

  render(renderer: THREE.WebGLRenderer, context: EffectContext): void {
    const { camera, scene } = context;

    heatUniforms.uTime.value = context.time;
    heatUniforms.tDepth.value = context.depth;
    heatUniforms.uResolution.value.copy(context.size);
    heatUniforms.uNear.value = camera.near;
    heatUniforms.uFar.value = camera.far;

    const priorAutoClear = renderer.autoClear;
    const priorAlpha = renderer.getClearAlpha();
    renderer.getClearColor(this.priorClear);
    const priorMask = camera.layers.mask;

    // The field: rest everywhere, then every plume over it.
    renderer.setRenderTarget(this.field);
    renderer.setClearColor(new THREE.Color(HEAT_REST, HEAT_REST, 0), 0);
    renderer.clear(true, false, false);
    renderer.autoClear = false;
    camera.layers.set(HEAT_LAYER);
    withStaticHidden(() => renderer.render(scene, camera));

    camera.layers.mask = priorMask;
    renderer.setClearColor(this.priorClear, priorAlpha);
    renderer.autoClear = priorAutoClear;

    // The frame, read through the field.
    this.warpMaterial.uniforms.tDiffuse.value = context.colour;
    renderer.setRenderTarget(context.write);
    this.quad.render(renderer);
  }

  dispose(): void {
    this.field.dispose();
    this.warpMaterial.dispose();
    this.quad.dispose();
  }
}
