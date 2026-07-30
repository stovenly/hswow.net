import * as THREE from 'three';

/** Owns the renderer, scene and camera, and keeps them sized to the window. */
export class Viewport {
  readonly renderer: THREE.WebGLRenderer;
  readonly scene: THREE.Scene;
  readonly camera: THREE.PerspectiveCamera;

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

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(70, 1, 0.1, 500);

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
  }

  render(): void {
    this.renderer.render(this.scene, this.camera);
  }

  dispose(): void {
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('orientationchange', this.handleResize);
    this.renderer.dispose();
  }
}
