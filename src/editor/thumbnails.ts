import * as THREE from 'three';
import type { App } from '../app/boot';
import { builderByName } from '../art/registry';

/**
 * A picture of each builder, drawn once per session on demand.
 *
 * Rendered by the game's own renderer into a small target, a few per frame, so
 * a palette of two hundred builders never stalls a frame — and so a thumbnail
 * is made of the same material the world is.
 */

const SIZE = 96;
/** How many are drawn per frame. Small: each one builds a mesh. */
const PER_FRAME = 2;

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
  }

  private drain(): void {
    for (let i = 0; i < PER_FRAME; i++) {
      const next = this.queue.shift();
      if (!next) return;
      const url = this.draw(next.name);
      if (url) {
        this.cache.set(next.name, url);
        next.onDone(url);
      }
    }
  }

  private draw(name: string): string | null {
    const builder = builderByName(name);
    if (!builder) return null;

    let mesh: THREE.Mesh;
    try {
      mesh = builder.build({ seed: 1 });
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
    renderer.setRenderTarget(this.target);
    renderer.setClearColor(0x14141a, 1);
    renderer.clear();
    renderer.render(this.scene, this.camera);
    renderer.readRenderTargetPixels(this.target, 0, 0, SIZE, SIZE, this.pixels);
    renderer.setRenderTarget(wasTarget);

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
