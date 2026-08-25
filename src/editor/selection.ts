import * as THREE from 'three';
import type { App } from '../app/boot';

/**
 * What is picked, and the box drawn round it.
 *
 * A pick reads `userData.entry` off the hit or its nearest tagged ancestor, so
 * nothing in the editor has to know how a builder assembles its parts.
 */

export interface EntryTag {
  zone: string;
  id: string;
}

export function entryTagOf(object: THREE.Object3D): EntryTag | null {
  for (let node: THREE.Object3D | null = object; node; node = node.parent) {
    const tag = node.userData.entry as EntryTag | undefined;
    if (tag) return tag;
  }
  return null;
}

/** The object the tag was found on, which is what a gizmo moves. */
export function taggedAncestor(object: THREE.Object3D): THREE.Object3D | null {
  for (let node: THREE.Object3D | null = object; node; node = node.parent) {
    if (node.userData.entry) return node;
  }
  return null;
}

const OUTLINE = new THREE.LineBasicMaterial({
  color: 0x7fd4ff,
  depthTest: false,
  fog: false,
  toneMapped: false,
});
const HOVER = new THREE.LineBasicMaterial({
  color: 0x7fd4ff,
  opacity: 0.35,
  transparent: true,
  depthTest: false,
  fog: false,
  toneMapped: false,
});

/** One wireframe box, reused. */
function boxLines(material: THREE.Material): THREE.LineSegments {
  const lines = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(1, 1, 1)), material);
  lines.renderOrder = 999;
  lines.frustumCulled = false;
  lines.visible = false;
  return lines;
}

export class Selection {
  private readonly app: App;
  private readonly picker = new THREE.Raycaster();
  private readonly pointer = new THREE.Vector2();
  private readonly bounds = new THREE.Box3();
  private readonly hoverBounds = new THREE.Box3();
  private readonly centre = new THREE.Vector3();
  private readonly extent = new THREE.Vector3();

  private readonly outline = boxLines(OUTLINE);
  private readonly hoverBox = boxLines(HOVER);

  /** Objects currently selected, in the order they were picked. */
  readonly objects: THREE.Object3D[] = [];
  private hoveredObject: THREE.Object3D | null = null;

  private readonly listeners: (() => void)[] = [];

  /** Told whenever the selection changes. More than one thing follows it. */
  onChanged(listener: () => void): void {
    this.listeners.push(listener);
  }

  private changed(): void {
    for (const listener of this.listeners) listener();
  }

  constructor(app: App) {
    this.app = app;
    app.viewport.scene.add(this.outline, this.hoverBox);
    app.loop.add(() => this.follow());
  }

  /** What the mouse is over, in the active zone. */
  pick(event: MouseEvent): THREE.Object3D | null {
    const zone = this.app.zones.current;
    if (!zone?.isBuilt) return null;
    const canvas = this.app.viewport.renderer.domElement;
    const rect = canvas.getBoundingClientRect();
    this.pointer.set(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1,
    );
    this.picker.setFromCamera(this.pointer, this.app.viewport.camera);
    const hits = this.picker.intersectObject(zone.root(), true);
    for (const hit of hits) {
      const tagged = taggedAncestor(hit.object);
      if (tagged) return tagged;
    }
    return null;
  }

  set(objects: readonly THREE.Object3D[]): void {
    this.objects.length = 0;
    this.objects.push(...objects);
    this.changed();
  }

  add(object: THREE.Object3D): void {
    if (!this.objects.includes(object)) this.objects.push(object);
    this.changed();
  }

  toggle(object: THREE.Object3D): void {
    const at = this.objects.indexOf(object);
    if (at >= 0) this.objects.splice(at, 1);
    else this.objects.push(object);
    this.changed();
  }

  clear(): void {
    if (this.objects.length === 0) return;
    this.objects.length = 0;
    this.changed();
  }

  get first(): THREE.Object3D | null {
    return this.objects[0] ?? null;
  }

  get tag(): EntryTag | null {
    return this.first ? entryTagOf(this.first) : null;
  }

  hover(object: THREE.Object3D | null): void {
    this.hoveredObject = object;
  }

  /**
   * The selection's bounds in world space, or null when nothing is selected.
   *
   * Not `precise`: that walks every vertex, and this is asked twice a frame by
   * the outline and the gizmo. A merged prop's own bounding box is close enough
   * to draw a box round and is computed once by three and kept.
   */
  boundsOf(objects: readonly THREE.Object3D[]): THREE.Box3 | null {
    if (objects.length === 0) return null;
    this.bounds.makeEmpty();
    for (const object of objects) this.bounds.expandByObject(object);
    return this.bounds.isEmpty() ? null : this.bounds;
  }

  private follow(): void {
    const box = this.boundsOf(this.objects);
    this.outline.visible = box !== null;
    if (box) {
      box.getCenter(this.centre);
      box.getSize(this.extent);
      this.outline.position.copy(this.centre);
      this.outline.scale.set(
        Math.max(this.extent.x, 0.05),
        Math.max(this.extent.y, 0.05),
        Math.max(this.extent.z, 0.05),
      );
    }

    const hovered = this.hoveredObject && !this.objects.includes(this.hoveredObject)
      ? this.hoveredObject
      : null;
    this.hoverBox.visible = hovered !== null;
    if (!hovered) return;
    const over = this.hoverBounds.makeEmpty().expandByObject(hovered);
    if (over.isEmpty()) {
      this.hoverBox.visible = false;
      return;
    }
    over.getCenter(this.centre);
    over.getSize(this.extent);
    this.hoverBox.position.copy(this.centre);
    this.hoverBox.scale.set(
      Math.max(this.extent.x, 0.05),
      Math.max(this.extent.y, 0.05),
      Math.max(this.extent.z, 0.05),
    );
  }
}
