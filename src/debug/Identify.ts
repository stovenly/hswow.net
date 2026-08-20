import * as THREE from 'three';
import type { PartRange } from '../art/assemble';
import type { LifeSpec } from '../life/spec';

/**
 * The debug picker: "identify mesh" freezes the world, frees the mouse, and a
 * click on anything reports which prop it is and which part of that prop's
 * build the clicked face came from — by name where the builder named it, by
 * index otherwise (`assemble` stamps the table on every merged geometry). The
 * picked part is painted over so the report and the thing can be checked
 * against each other, and the line is put on the clipboard.
 *
 * `frozen` is read by the main loop, which then advances nothing.
 */
export class Identify {
  active = false;
  /** The clock the loop holds while picking. */
  frozenElapsed = 0;

  private readonly raycaster = new THREE.Raycaster();
  private readonly overlay: THREE.Group;
  private readonly panel: HTMLDivElement;
  private wasLocked = false;

  constructor(
    private readonly scene: THREE.Scene,
    private readonly camera: THREE.Camera,
    private readonly canvas: HTMLCanvasElement,
  ) {
    this.overlay = new THREE.Group();
    this.overlay.name = 'identify-overlay';
    this.overlay.renderOrder = 1000;
    this.panel = document.createElement('div');
    this.panel.id = 'identify-panel';
    this.panel.style.cssText = [
      'position:fixed', 'left:50%', 'bottom:24px', 'transform:translateX(-50%)', 'max-width:90vw',
      'padding:10px 14px', 'background:rgba(10,10,15,0.92)', 'color:#eee', 'font:13px/1.5 ui-monospace,monospace',
      'border:1px solid #f0f', 'border-radius:6px', 'z-index:10000', 'white-space:pre-wrap', 'user-select:text', 'display:none',
    ].join(';');
    document.body.appendChild(this.panel);
  }

  toggle(): void {
    if (this.active) this.stop();
    else this.start(this.frozenElapsed);
  }

  start(elapsed: number): void {
    if (this.active) return;
    this.active = true;
    this.frozenElapsed = elapsed;
    this.wasLocked = document.pointerLockElement === this.canvas;
    document.exitPointerLock();
    document.body.classList.add('is-identifying');
    this.canvas.style.cursor = 'crosshair';
    this.scene.add(this.overlay);
    // Capture phase, ahead of `Input`, whose canvas click would take the mouse back.
    window.addEventListener('pointerdown', this.onPointerDown, true);
    window.addEventListener('keydown', this.onKeyDown, true);
    this.say('identify: click a mesh — Esc to leave');
  }

  stop(): void {
    if (!this.active) return;
    this.active = false;
    window.removeEventListener('pointerdown', this.onPointerDown, true);
    window.removeEventListener('keydown', this.onKeyDown, true);
    document.body.classList.remove('is-identifying');
    this.canvas.style.cursor = '';
    this.clearOverlay();
    this.scene.remove(this.overlay);
    this.panel.style.display = 'none';
    if (this.wasLocked) void this.canvas.requestPointerLock();
  }

  private readonly onKeyDown = (event: KeyboardEvent): void => {
    if (event.code === 'Escape') {
      event.stopImmediatePropagation();
      this.stop();
    }
  };

  private readonly onPointerDown = (event: PointerEvent): void => {
    if (event.button !== 0) return;
    if (event.target !== this.canvas) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const rect = this.canvas.getBoundingClientRect();
    const ndc = new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1,
    );
    this.pick(ndc);
  };

  private pick(ndc: THREE.Vector2): void {
    this.clearOverlay();
    this.raycaster.setFromCamera(ndc, this.camera);
    // A skinned figure's bounding sphere is its bind pose; a posed one can
    // lean out of it, so the sphere is loosened before it is used to cull.
    const candidates: THREE.Mesh[] = [];
    this.scene.traverse((o) => {
      if (!(o instanceof THREE.Mesh) || !o.visible || o.parent === this.overlay) return;
      if (o instanceof THREE.SkinnedMesh && !o.userData.identifyLoosened) {
        const g = o.geometry;
        if (g.boundingSphere === null) g.computeBoundingSphere();
        if (g.boundingSphere) g.boundingSphere.radius *= 1.6;
        o.userData.identifyLoosened = true;
      }
      candidates.push(o);
    });
    const hits = this.raycaster.intersectObjects(candidates, false);
    const hit = hits.find((h) => h.faceIndex !== undefined && h.faceIndex !== null);
    if (!hit) {
      this.say('identify: nothing there');
      return;
    }
    const mesh = hit.object as THREE.Mesh;
    const table = mesh.geometry.userData.parts as PartRange[] | undefined;
    const vertex = mesh.geometry.index ? mesh.geometry.index.getX(hit.faceIndex! * 3) : hit.faceIndex! * 3;
    const part = table?.find((r) => vertex >= r.start && vertex < r.start + r.count);
    const life = mesh.userData.life as LifeSpec | undefined;

    const bits: string[] = [];
    bits.push(`mesh "${mesh.name || '(unnamed)'}"`);
    const chain: string[] = [];
    for (let p = mesh.parent; p && p !== this.scene; p = p.parent) if (p.name) chain.push(p.name);
    if (chain.length) bits.push(`in ${chain.join(' < ')}`);
    if (life) bits.push(`life seed=${life.seed} kind=${life.kind}${life.face ? ` face=${life.face}` : ''}`);
    if (part) {
      bits.push(`part #${part.index}${part.name ? ` "${part.name}"` : ''}${part.bone ? ` bone=${part.bone}` : ''}${part.color !== undefined ? ` color=#${part.color.toString(16).padStart(6, '0')}` : ''}`);
    } else {
      bits.push(`face ${hit.faceIndex} (no part table)`);
    }
    const p = hit.point;
    bits.push(`at (${p.x.toFixed(2)}, ${p.y.toFixed(2)}, ${p.z.toFixed(2)})`);
    const line = bits.join('  ');
    this.say(`${line}\n(copied — click again to pick another, Esc to leave)`);
    void navigator.clipboard?.writeText(line).catch(() => {});

    if (part) this.paint(mesh, part.start, part.count);
    else this.paint(mesh, hit.faceIndex! * 3, 3);
  }

  /** Paints the part's triangles over the scene, in world space, ignoring depth. */
  private paint(mesh: THREE.Mesh, start: number, count: number): void {
    const positions = new Float32Array(count * 3);
    const v = new THREE.Vector3();
    const geometry = mesh.geometry;
    const index = geometry.index;
    for (let i = 0; i < count; i++) {
      const vi = index ? index.getX(start + i) : start + i;
      // Skinned meshes are read posed; plain ones from the attribute.
      mesh.getVertexPosition(vi, v);
      v.applyMatrix4(mesh.matrixWorld);
      v.toArray(positions, i * 3);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const fill = new THREE.Mesh(
      g,
      new THREE.MeshBasicMaterial({ color: 0xff2ad4, transparent: true, opacity: 0.55, depthTest: false, depthWrite: false, side: THREE.DoubleSide }),
    );
    fill.renderOrder = 1000;
    fill.frustumCulled = false;
    const wire = new THREE.Mesh(
      g,
      new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, depthTest: false, depthWrite: false, transparent: true, opacity: 0.9 }),
    );
    wire.renderOrder = 1001;
    wire.frustumCulled = false;
    this.overlay.add(fill, wire);
  }

  private clearOverlay(): void {
    for (const child of [...this.overlay.children]) {
      this.overlay.remove(child);
      const m = child as THREE.Mesh;
      m.geometry.dispose();
      (m.material as THREE.Material).dispose();
    }
  }

  private say(text: string): void {
    this.panel.textContent = text;
    this.panel.style.display = 'block';
  }
}
