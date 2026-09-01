import * as THREE from 'three';
import { builderByName } from '../art/registry';
import { hashString } from '../world/loot';
import type { Item } from '../world/items';
import type { App } from '../app/boot';

/**
 * Item icons, derived from the seed like everything else in the kit: a small
 * render of the item's own builder, drawn off a budgeted queue so the grid
 * never pays for one synchronously, cached for the session, and persisted to
 * IndexedDB so a returning browser renders nothing at all.
 */

/** Bump when builders change enough that cached icons lie. Orphans are pruned. */
const ICON_VERSION = 4;

/** Pixels square. Covers a cell at twice its CSS size, so a retina panel upscales nothing. */
const SIZE = 128;

/** Builds per frame: warming pace with no grid up, careful pace with one. */
const PACE_IDLE = 4;
const PACE_OPEN = 1;

const DB_NAME = 'hswow-icons';
const STORE = 'icons';

export class ItemIcons {
  /** The pace chooser, replaced by the installer once it knows about the grid. */
  paced: () => number = () => PACE_IDLE;

  private readonly app: App;
  private readonly target = new THREE.WebGLRenderTarget(SIZE, SIZE);
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.01, 100);
  private readonly pixels = new Uint8Array(SIZE * SIZE * 4);
  private readonly canvas = document.createElement('canvas');
  private readonly urls = new Map<string, string>();
  /** Callbacks per key with work in flight, which also dedupes the queue. */
  private readonly waiting = new Map<string, ((url: string) => void)[]>();
  private readonly queue: { key: string; icon: boolean }[] = [];
  /** Keys whose material programs have been warmed against the live scene this session. */
  private readonly warmed = new Set<string>();
  /** Whether a job is in flight. One at a time; see `drain`. */
  private busy = false;
  private db: IDBDatabase | null = null;

  constructor(app: App) {
    this.app = app;
    this.canvas.width = SIZE;
    this.canvas.height = SIZE;

    const key = new THREE.DirectionalLight(0xfff2d8, 6.8);
    key.position.set(-6, 9, 7);
    const fill = new THREE.HemisphereLight(0x9dc4e8, 0x8a7f68, 5.6);
    this.scene.add(key, fill);

    this.openStore();
    app.loop.add(() => this.drain());
  }

  /**
   * Calls back with the icon's URL — immediately on a cache hit, later off the
   * queue on a miss. The caller stays fully usable meanwhile; the picture is
   * the only thing that is ever late. With no callback this is a warm-up.
   */
  request(item: Item, onDone?: (url: string) => void): void {
    const key = keyOf(item);
    const held = this.urls.get(key);
    if (held) {
      onDone?.(held);
      return;
    }
    const line = this.waiting.get(key);
    if (line) {
      if (onDone) line.push(onDone);
      return;
    }
    this.waiting.set(key, onDone ? [onDone] : []);
    this.fromStore(key, (url) => {
      if (url) {
        this.resolve(key, url);
        // A stored picture skips the build, which is where warming happens.
        if (!this.warmed.has(key)) this.queue.push({ key, icon: false });
      } else this.queue.push({ key, icon: true });
    });
  }

  /** Renders still owed, for readouts. */
  get pending(): number {
    return this.queue.length;
  }

  private resolve(key: string, url: string): void {
    this.urls.set(key, url);
    const line = this.waiting.get(key);
    this.waiting.delete(key);
    if (line) for (const done of line) done(url);
  }

  /** One job at a time: each awaits a shader compile, and each compile walks the live zone. */
  private drain(): void {
    if (this.busy || this.paced() <= 0) return;
    const next = this.queue.shift();
    if (!next) return;
    this.busy = true;
    const job = next.icon ? this.render(next.key) : this.warm(next.key);
    void job.finally(() => {
      this.busy = false;
    });
  }

  /** Compiles the item's world programs, so a later drop finds them ready. Builds a mesh for the walk if not given one. */
  private async warm(key: string, built?: THREE.Mesh): Promise<void> {
    if (this.warmed.has(key)) return;
    this.warmed.add(key);
    let mesh = built ?? null;
    if (!mesh) {
      const [, builderName, seedText] = key.split(':');
      const stand = builderByName(builderName ?? '');
      if (!stand) return;
      try {
        mesh = stand.build({ seed: Number(seedText) || 1 });
      } catch {
        return;
      }
    }
    try {
      await this.app.zones.warmItem(mesh);
    } catch {
      this.warmed.delete(key);
    } finally {
      if (!built) release(mesh);
    }
  }

  /** One icon, drawn only once its program is linked: rendering first forces the link on this frame. */
  private async render(key: string): Promise<void> {
    const [, builderName, seedText] = key.split(':');
    const stand = builderByName(builderName ?? '') ?? builderByName('sack');
    if (!stand) {
      this.waiting.delete(key);
      return;
    }

    let mesh: THREE.Mesh;
    try {
      mesh = stand.build({ seed: Number(seedText) || 1 });
    } catch {
      this.waiting.delete(key);
      return;
    }
    // An icon is a picture, not a lamp: the light must not join any census.
    const lights: THREE.Object3D[] = [];
    mesh.traverse((child) => {
      if (child instanceof THREE.Light) lights.push(child);
    });
    for (const light of lights) light.removeFromParent();

    this.scene.add(mesh);
    try {
      // The icon rig is its own scene: these programs are not the world's. Its
      // own target is bound for the compile, because the program's key carries
      // the colour space of whatever is current and the draw below binds it.
      const renderer = this.app.viewport.renderer;
      const held = renderer.getRenderTarget();
      renderer.setRenderTarget(this.target);
      try {
        await renderer.compileAsync(mesh, this.camera, this.scene);
      } finally {
        renderer.setRenderTarget(held);
      }
      const url = this.draw(mesh);
      if (url) {
        this.persist(key, url);
        this.resolve(key, url);
      } else this.waiting.delete(key);
      await this.warm(key, mesh);
    } catch {
      this.waiting.delete(key);
    } finally {
      this.scene.remove(mesh);
      release(mesh);
    }
  }

  /** The picture itself: frames `mesh`, which is already in the scene and compiled. */
  private draw(mesh: THREE.Mesh): string | null {
    mesh.updateWorldMatrix(true, true);
    const box = new THREE.Box3().setFromObject(mesh, true);
    const centre = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    // Three-quarter view, the galleries' reading: a straight elevation makes a
    // pail and a broom the same picture.
    const reach = Math.max(size.x, size.y, size.z, 0.05) * 0.72;
    this.camera.left = -reach;
    this.camera.right = reach;
    this.camera.top = reach;
    this.camera.bottom = -reach;
    this.camera.far = reach * 20 + 10;
    this.camera.updateProjectionMatrix();
    this.camera.position.copy(centre).add(new THREE.Vector3(reach * 3, reach * 2.2, reach * 3));
    this.camera.lookAt(centre);

    const renderer = this.app.viewport.renderer;
    const wasTarget = renderer.getRenderTarget();
    const wasClear = renderer.getClearColor(new THREE.Color());
    const wasAlpha = renderer.getClearAlpha();
    renderer.setRenderTarget(this.target);
    renderer.setClearColor(0x000000, 0);
    renderer.clear();
    renderer.render(this.scene, this.camera);
    renderer.readRenderTargetPixels(this.target, 0, 0, SIZE, SIZE, this.pixels);
    renderer.setRenderTarget(wasTarget);
    renderer.setClearColor(wasClear, wasAlpha);

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

  // --- the store ------------------------------------------------------------
  // Every path in and out swallows refusal: private windows and full quotas
  // degrade to the session cache, never to an error the player sees.

  private openStore(): void {
    let asked: IDBOpenDBRequest;
    try {
      asked = indexedDB.open(DB_NAME, 1);
    } catch {
      return;
    }
    asked.onupgradeneeded = () => asked.result.createObjectStore(STORE);
    asked.onsuccess = () => {
      this.db = asked.result;
      this.prune();
    };
    asked.onerror = () => {};
  }

  private fromStore(key: string, settle: (url: string | null) => void): void {
    const db = this.db;
    if (!db) {
      settle(null);
      return;
    }
    try {
      const asked = db.transaction(STORE, 'readonly').objectStore(STORE).get(key);
      asked.onsuccess = () => {
        const held = asked.result as Blob | undefined;
        settle(held ? URL.createObjectURL(held) : null);
      };
      asked.onerror = () => settle(null);
    } catch {
      settle(null);
    }
  }

  /** Through the data URL rather than the canvas, which the next draw reuses. */
  private persist(key: string, url: string): void {
    if (!this.db) return;
    void fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const db = this.db;
        if (!db) return;
        try {
          db.transaction(STORE, 'readwrite').objectStore(STORE).put(blob, key);
        } catch {
          // Kept for the session only.
        }
      })
      .catch(() => {});
  }

  /** Old-version keys are pictures of old art; deleted lazily on open. */
  private prune(): void {
    const db = this.db;
    if (!db) return;
    try {
      const asked = db.transaction(STORE, 'readwrite').objectStore(STORE).openCursor();
      const keep = `v${ICON_VERSION}:`;
      asked.onsuccess = () => {
        const cursor = asked.result;
        if (!cursor) return;
        if (typeof cursor.key === 'string' && !cursor.key.startsWith(keep)) cursor.delete();
        cursor.continue();
      };
    } catch {
      // Nothing to prune where nothing is stored.
    }
  }
}

export { PACE_IDLE, PACE_OPEN };

function keyOf(item: Item): string {
  const builder = item.builder ?? 'sack';
  const seed = item.seed ?? hashString(item.name) % 1_000_000;
  return `v${ICON_VERSION}:${builder}:${seed}`;
}

function release(root: THREE.Object3D): void {
  root.traverse((object) => {
    if (object instanceof THREE.Mesh) {
      object.geometry.dispose();
      for (const material of [object.material].flat()) {
        if (material.userData.owned) material.dispose();
      }
    }
  });
}
