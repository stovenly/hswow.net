import * as THREE from 'three';
import { applySway } from '../art/sway';
import { applyGlitchDisplacement } from '../art/glitch';
import { applyHorrorDisplacement } from '../art/horror';
import { EFFECT_ATTRIBUTE, maskUniforms } from '../art/effectId';
import { EFFECT_MASK_LAYER } from '../layers';
import type { PixelEffect, EffectContext } from './PixelStage';

/**
 * The owner-id mask: which marked object, if any, each chunky pixel shows.
 *
 * The screen-space corruption passes cannot tell an object from the floor it
 * stands on by position alone — the two are a centimetre apart, and depth
 * reconstruction at grazing range errs by several times that (the resolve of a
 * multisampled depth buffer picks an arbitrary sample, not the pixel centre).
 * So attached volumes are gated by *identity* instead: this pass draws every
 * mask-layer mesh into a one-channel target, writing the owner id baked into
 * its geometry, and the passes compare that id against each volume's owner.
 * The floor is never drawn here, so it can never leak, at any distance.
 *
 * It runs as a passthrough effect just ahead of the passes that read it, only
 * on frames where an activity packed at least one owned volume — a zone with
 * no attached effects pays nothing. Cost when live: the owned meshes once
 * more at chunky resolution with an unlit constant-colour fragment.
 *
 * The material carries the same displacement chain as the shadow-depth and
 * outline-normal materials, and for their reason: the mask has to hug the
 * geometry mid-convulsion, not outline where it used to be. It tests against
 * the scene's own depth (bloom's trick of binding the resolved depth as an
 * attachment), so an owned mesh behind a wall masks nothing — with a little
 * polygon offset toward the camera, because the resolved depth it tests
 * against is sample-picked and would otherwise z-fight its own surface.
 */
export class EffectMaskPass implements PixelEffect {
  readonly label = 'mask';
  enabled = false;
  /** Draws to its own target; the chain's colour passes through untouched. */
  readonly passthrough = true;

  private readonly material: THREE.MeshBasicMaterial;
  private target: THREE.WebGLRenderTarget | null = null;
  private width = 1;
  private height = 1;
  private readonly priorClear = new THREE.Color();

  constructor() {
    this.material = createMaskMaterial();
  }

  setSize(width: number, height: number): void {
    this.width = width;
    this.height = height;
    if (this.target) {
      // Recreated on next render: the depth attachment belongs to the pixel
      // stage and is resized by it, so the pair are rebuilt together.
      this.target.depthTexture = null as unknown as THREE.DepthTexture;
      this.target.dispose();
      this.target = null;
    }
  }

  render(renderer: THREE.WebGLRenderer, context: EffectContext): void {
    if (!this.target) {
      this.target = new THREE.WebGLRenderTarget(this.width, this.height, {
        format: THREE.RedFormat,
        type: THREE.FloatType,
        minFilter: THREE.NearestFilter,
        magFilter: THREE.NearestFilter,
        depthBuffer: true,
      });
      this.target.depthTexture = context.depth;
    }

    const { scene, camera } = context;
    const priorOverride = scene.overrideMaterial;
    const priorLayers = camera.layers.mask;
    const priorAutoClear = renderer.autoClear;
    const priorAlpha = renderer.getClearAlpha();
    renderer.getClearColor(this.priorClear);

    renderer.setRenderTarget(this.target);
    renderer.setClearColor(0x000000, 0);
    renderer.autoClear = false;
    // Colour only. The depth attachment is the scene's, already drawn this
    // frame, and is exactly what the owned meshes must test against.
    renderer.clear(true, false, false);
    scene.overrideMaterial = this.material;
    camera.layers.set(EFFECT_MASK_LAYER);
    renderer.render(scene, camera);
    scene.overrideMaterial = priorOverride;
    camera.layers.mask = priorLayers;
    renderer.autoClear = priorAutoClear;
    renderer.setClearColor(this.priorClear, priorAlpha);

    maskUniforms.tEffectMask.value = this.target.texture;
  }

  dispose(): void {
    this.material.dispose();
    if (this.target) {
      this.target.depthTexture = null as unknown as THREE.DepthTexture;
      this.target.dispose();
    }
  }
}

function createMaskMaterial(): THREE.MeshBasicMaterial {
  const material = new THREE.MeshBasicMaterial();
  // Unlit, unfogged, untonemapped: the output is an id, not a colour.
  material.fog = false;
  material.toneMapped = false;
  // Test against the scene's depth, never write it.
  material.depthWrite = false;
  material.depthTest = true;
  // Pulled slightly toward the camera: the attached depth is the resolved
  // multisample buffer, whose per-pixel value is an arbitrary sample rather
  // than the centre this pass rasterises at, and an exact comparison would
  // punch pinholes in the mask wherever the surface is steep.
  material.polygonOffset = true;
  material.polygonOffsetFactor = -2;
  material.polygonOffsetUnits = -2;

  // The same displacement chain, in the same order, as the shadow depth and
  // outline normal materials — anything drawing the scene agrees where it is.
  applySway(material);
  applyGlitchDisplacement(material);
  applyHorrorDisplacement(material);

  const prior = material.onBeforeCompile;
  material.onBeforeCompile = (shader, renderer) => {
    prior?.call(material, shader, renderer);

    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        /* glsl */ `#include <common>
        #ifndef EFFECT_OWNER_ATTRIBUTE
        #define EFFECT_OWNER_ATTRIBUTE
        attribute float ${EFFECT_ATTRIBUTE};
        #endif
        varying float vMaskId;
        `,
      )
      .replace('#include <begin_vertex>', `#include <begin_vertex>\n  vMaskId = ${EFFECT_ATTRIBUTE};`);

    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying float vMaskId;')
      .replace('#include <opaque_fragment>', 'gl_FragColor = vec4(vMaskId, 0.0, 0.0, 1.0);');
  };

  material.customProgramCacheKey = () => 'sway-glitch-horror-mask';
  material.needsUpdate = true;
  return material;
}
