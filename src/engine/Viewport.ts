import * as THREE from 'three';

/**
 * The camera's far plane, and what an unlimited view distance means.
 *
 * Everything in the game is drawn well inside it; it is out here because the
 * view-distance option replaces it and the checks compare against it.
 */
export const CAMERA_FAR = 500;

/** Owns the renderer, scene and camera, and keeps them sized to the window. */
export class Viewport {
  readonly renderer: THREE.WebGLRenderer;
  readonly scene: THREE.Scene;
  readonly camera: THREE.PerspectiveCamera;

  /** Fires after every resize, for anything sized off the renderer. */
  onResize: (() => void) | null = null;

  private readonly canvas: HTMLCanvasElement;
  private readonly handleResize = (): void => this.resize();

  constructor(canvas: HTMLCanvasElement, lowLatency = false) {
    this.canvas = canvas;

    // The context is made here rather than by three so it can be asked for
    // `desynchronized`, which three's options do not carry.
    const context = canvas.getContext('webgl2', {
      antialias: false,
      powerPreference: 'high-performance',
      stencil: false,
      desynchronized: lowLatency,
    });
    if (!context) throw new Error('WebGL2 is not available');
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      context,
      // Antialiasing is off on purpose: Phase 2 renders through a pixelation
      // pass, and smoothed edges fight the effect. It also costs nothing to skip.
      antialias: false,
      powerPreference: 'high-performance',
      stencil: false,
    });
    this.renderer.setClearColor(0x0a0a0f, 1);

    // On at the renderer, and gated at the light: `shadowMap.enabled` is a
    // shader-compilation switch, so flipping it invalidates every program in the
    // scene, and the runtime toggle sets `castShadow` on the sun instead. PCF soft
    // rather than basic — the pipeline renders at a third of display resolution and
    // then quantizes, so a hard shadow edge crawls as the camera moves.
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // The shadow map is drawn once a frame, not once a pass. `WebGLRenderer.render`
    // calls `shadowMap.render()` unconditionally and this pipeline renders the scene
    // twice, but the shadow pass uses its own depth materials and ignores
    // `overrideMaterial`, so the second render is pure waste. With `autoUpdate` off
    // it returns early unless `needsUpdate` is set, which `PostFX.render` does once
    // per frame. Byte-identical output, half the shadow cost.
    this.renderer.shadowMap.autoUpdate = false;

    // And the frame counters are reset once a frame, for the same reason:
    // `info.reset()` normally runs inside every `render()` call, after the shadow
    // pass, so read at the end of a frame it would report the last fullscreen quad
    // and nothing else.
    this.renderer.info.autoReset = false;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(70, 1, 0.1, CAMERA_FAR);

    // And the world matrices are updated once a frame, by hand.
    // `WebGLRenderer.render` calls `scene.updateMatrixWorld()` on the way in, and
    // this pipeline renders the scene up to eight times a frame with nothing moving
    // between the calls. Off here, whoever draws does it once and says so —
    // `PostFX.render` and `render` below, each on its way into the frame.
    this.scene.matrixAutoUpdate = false;
    this.scene.matrixWorldAutoUpdate = false;

    this.resize();
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('orientationchange', this.handleResize);
  }

  resize(): void {
    const w = this.canvas.clientWidth || window.innerWidth;
    const h = this.canvas.clientHeight || window.innerHeight;

    // Capped at 2: past that it's invisible on phones and merely expensive.
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    // false = don't write inline styles onto the canvas; CSS owns its box.
    this.renderer.setSize(w, h, false);

    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();

    this.onResize?.();
  }

  /**
   * Straight to the screen, with no post pipeline. Nothing calls this; it is kept
   * as the plain path for bisecting a problem down to the pipeline or the scene. It
   * carries the same per-frame bookkeeping `PostFX.render` does, because both
   * switches above are off by default.
   */
  render(): void {
    this.renderer.info.reset();
    this.renderer.shadowMap.needsUpdate = true;
    this.scene.updateMatrixWorld();
    this.renderer.render(this.scene, this.camera);
  }

  dispose(): void {
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('orientationchange', this.handleResize);
    this.renderer.dispose();
  }
}
