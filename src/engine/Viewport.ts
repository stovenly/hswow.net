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

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      // Antialiasing is off on purpose: Phase 2 renders through a pixelation
      // pass, and smoothed edges fight the effect. It also costs nothing to skip.
      antialias: false,
      powerPreference: 'high-performance',
      stencil: false,
    });
    this.renderer.setClearColor(0x0a0a0f, 1);

    // On at the renderer, and gated at the light. `shadowMap.enabled` is a
    // shader-compilation switch — flipping it invalidates every program in the
    // scene and stalls for a frame or more — so the runtime toggle sets
    // `castShadow` on the sun instead, which costs nothing to change.
    //
    // PCF soft rather than basic: the pipeline renders at a third of display
    // resolution and then quantizes, so a hard shadow edge lands on a
    // three-pixel block boundary and crawls as the camera moves.
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // **The shadow map is drawn once a frame, not once a pass.**
    // `WebGLRenderer.render` calls `shadowMap.render()` unconditionally, and
    // the pipeline renders the scene twice — once for beauty and once with
    // `overrideMaterial` set to a normal material for the edge detector. The
    // second shadow render is pure waste: the shadow pass uses its own depth
    // materials and ignores `overrideMaterial` entirely, so it redraws exactly
    // the same map and throws the first one away.
    //
    // With `autoUpdate` off, `WebGLShadowMap` returns early unless `needsUpdate`
    // is set, and clears the flag once it has drawn. `PostFX.render` sets it
    // once per frame, so the first pass draws the map and the rest reuse it.
    // Byte-identical output, half the shadow cost.
    this.renderer.shadowMap.autoUpdate = false;

    // **And the frame counters are reset once a frame, for the same reason.**
    // `info.reset()` normally runs inside every `render()` call — *after* the
    // shadow pass, and once per `render()` call — so read at the end of a frame
    // `info.render.calls` would report the last fullscreen quad and nothing
    // else. Off, it accumulates across every pass and includes the shadow
    // draws, which is the number the debug readout is actually asking for.
    this.renderer.info.autoReset = false;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(70, 1, 0.1, CAMERA_FAR);

    // **And the world matrices are updated once a frame, by hand.** The third
    // switch of the same shape as the two above, and the largest of the three.
    // `WebGLRenderer.render` calls `scene.updateMatrixWorld()` on the way in,
    // and this pipeline renders the scene up to eight times a frame — colour,
    // the normal override, the cover normals, and one per layer pass. Nothing
    // moves between those calls, so seven of the eight walks recompute matrices
    // that already hold the right numbers.
    //
    // Off here, whoever draws does it once and says so: `PostFX.render` and
    // `render` below, each on its way into the frame. That is where the first
    // implicit walk used to happen, so nothing reads a matrix any staler than
    // it did before.
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
   * Straight to the screen, with no post pipeline. Nothing calls this — the
   * game renders through `PostFX` — and it is kept as the plain path for
   * bisecting a problem down to "is it the pipeline or the scene".
   *
   * It carries the same per-frame bookkeeping `PostFX.render` does, because
   * both switches above are off by default now: without the reset the counters
   * would climb forever, and without `needsUpdate` the shadow map would be
   * whatever the last full frame left behind.
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
