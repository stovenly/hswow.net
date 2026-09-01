import * as THREE from 'three';
import type { App } from '../app/boot';
import { builderByName } from '../art/registry';
import { finishCaptured, type Finished } from '../art/assemble';
import { pool } from '../engine/work/pool';

/**
 * A picture of each builder, drawn once per session on demand.
 *
 * Rendered by the game's own renderer into a small target, a few per frame, so
 * a palette of two hundred builders never stalls a frame — and so a thumbnail
 * is made of the same material the world is. The geometry is made on the work
 * pool, so the frame pays for the render and the readback and not the build.
 */

/**
 * Pixels square. Drawn at 48 in the palette, so this is one step of headroom
 * and no more: every pixel is read back off the GPU, which is a hard sync.
 */
const SIZE = 64;
/**
 * How many are drawn per frame. Still budgeted with the build off the frame,
 * because reading the target back is a hard sync with the GPU.
 */
const PER_FRAME = 4;

export class Thumbnails {
  private readonly app: App;
  private readonly target = new THREE.WebGLRenderTarget(SIZE, SIZE);
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.01, 100);
  private readonly pixels = new Uint8Array(SIZE * SIZE * 4);
  private readonly canvas = document.createElement('canvas');
  private readonly cache = new Map<string, string>();
  private readonly queue: { name: string; onDone: (url: string) => void }[] = [];
  private readonly asked = new Set<string>();
  /** Geometry the pool has answered for. Null is a builder the capture refused. */
  private readonly made = new Map<string, Finished | null>();

  constructor(app: App) {
    this.app = app;
    this.canvas.width = SIZE;
    this.canvas.height = SIZE;

    const key = new THREE.DirectionalLight(0xfff2d8, 2.4);
    key.position.set(-6, 9, 7);
    const fill = new THREE.HemisphereLight(0x9dc4e8, 0x8a7f68, 1.9);
    this.scene.add(key, fill);
    app.loop.add(() => this.drain());
  }

  /** Calls back with a data URL once the builder has been drawn. */
  request(name: string, onDone: (url: string) => void): void {
    const held = this.cache.get(name);
    if (held) {
      onDone(held);
      return;
    }
    if (this.asked.has(name)) return;
    this.asked.add(name);
    this.queue.push({ name, onDone });
    void this.warm(name);
  }

  private async warm(name: string): Promise<void> {
    try {
      this.made.set(name, await pool.run('prop-geometry', { builder: name, seed: 1 }));
    } catch {
      this.made.set(name, null);
    }
  }

  private drain(): void {
    for (let i = 0; i < PER_FRAME; i++) {
      // The first the pool has answered for, which is not always the first in
      // the queue. Waiting on the head would put a build back on the frame.
      const at = this.queue.findIndex((item) => this.made.has(item.name));
      if (at < 0) return;
      const [next] = this.queue.splice(at, 1);
      const ready = this.made.get(next.name) ?? null;
      this.made.delete(next.name);
      const url = this.draw(next.name, ready);
      if (url) {
        this.cache.set(next.name, url);
        next.onDone(url);
      }
    }
  }

  /** How many are still waiting, for the status line. */
  get pending(): number {
    return this.queue.length;
  }

  private draw(name: string, ready: Finished | null): string | null {
    const builder = builderByName(name);
    if (!builder) return null;

    let mesh: THREE.Mesh;
    try {
      mesh = ready ? finishCaptured(ready) : builder.build({ seed: 1 });
    } catch {
      return null;
    }

    this.scene.add(mesh);
    const box = new THREE.Box3().setFromObject(mesh, true);
    const centre = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    // Three-quarter view, which is how the galleries read: a straight elevation
    // makes a barrel and a column the same picture.
    const reach = Math.max(size.x, size.y, size.z, 0.2) * 0.72;
    this.camera.left = -reach;
    this.camera.right = reach;
    this.camera.top = reach;
    this.camera.bottom = -reach;
    this.camera.near = 0.01;
    this.camera.far = reach * 20 + 10;
    this.camera.updateProjectionMatrix();
    this.camera.position.copy(centre).add(new THREE.Vector3(reach * 3, reach * 2.2, reach * 3));
    this.camera.lookAt(centre);

    const renderer = this.app.viewport.renderer;
    const wasTarget = renderer.getRenderTarget();
    // Put the clear colour back: the pipeline's own passes rely on it, and a
    // thumbnail is not a reason for the world to change colour behind you.
    const wasClear = renderer.getClearColor(new THREE.Color());
    const wasAlpha = renderer.getClearAlpha();
    renderer.setRenderTarget(this.target);
    renderer.setClearColor(0x14141a, 1);
    renderer.clear();
    renderer.render(this.scene, this.camera);
    renderer.readRenderTargetPixels(this.target, 0, 0, SIZE, SIZE, this.pixels);
    renderer.setRenderTarget(wasTarget);
    renderer.setClearColor(wasClear, wasAlpha);

    this.scene.remove(mesh);
    mesh.geometry.dispose();

    const context = this.canvas.getContext('2d');
    if (!context) return null;
    const image = context.createImageData(SIZE, SIZE);
    // The target reads bottom-up; a canvas is top-down.
    for (let y = 0; y < SIZE; y++) {
      const from = (SIZE - 1 - y) * SIZE * 4;
      image.data.set(this.pixels.subarray(from, from + SIZE * 4), y * SIZE * 4);
    }
    context.putImageData(image, 0, 0);
    return this.canvas.toDataURL('image/png');
  }
}
