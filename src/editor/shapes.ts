import * as THREE from 'three';
import type { App } from '../app/boot';
import type { Point } from '../world/placement';

/**
 * Drawing on the ground: a polyline, a circle, a rectangle.
 *
 * Runs, chains, paths, fields, blots, landform footprints and the vista
 * keep-out are all XZ shapes, so they share one tool set — and they are drawn in
 * Top view, because a perspective view lies about them.
 */

export type ShapeKind = 'polyline' | 'circle' | 'rectangle';

export type DrawnShape =
  | { kind: 'polyline'; points: Point[] }
  | { kind: 'circle'; at: Point; radius: number }
  | { kind: 'rectangle'; min: Point; max: Point };

const PREVIEW = new THREE.LineBasicMaterial({
  color: 0x7fd4ff,
  depthTest: false,
  fog: false,
  toneMapped: false,
});

const HANDLE = new THREE.MeshBasicMaterial({ color: 0x7fd4ff, depthTest: false, fog: false });
const HANDLE_HOT = new THREE.MeshBasicMaterial({ color: 0xffffff, depthTest: false, fog: false });
const HANDLE_SHAPE = new THREE.SphereGeometry(0.22, 10, 6);

const DOWN = new THREE.Vector3(0, -1, 0);
const GROUND = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

/** Where a screen point meets the world, by collider first and ground plane after. */
export function groundPoint(app: App, event: MouseEvent): THREE.Vector3 | null {
  const canvas = app.viewport.renderer.domElement;
  const rect = canvas.getBoundingClientRect();
  const pointer = new THREE.Vector2(
    ((event.clientX - rect.left) / rect.width) * 2 - 1,
    -((event.clientY - rect.top) / rect.height) * 2 + 1,
  );
  const caster = new THREE.Raycaster();
  caster.setFromCamera(pointer, app.viewport.camera);
  const zone = app.zones.current;
  if (zone?.isBuilt) {
    const hit = caster.intersectObject(zone.root(), true)[0];
    if (hit) return hit.point.clone();
  }
  const at = new THREE.Vector3();
  return caster.ray.intersectPlane(GROUND, at) ? at : null;
}

export class Shapes {
  private readonly app: App;
  private readonly preview = new THREE.Group();
  private line: THREE.Line | null = null;
  private points: Point[] = [];
  private kind: ShapeKind | null = null;
  private onDone: ((shape: DrawnShape) => void) | null = null;

  /** Handles for the shape currently being edited, if any. */
  private readonly handles: THREE.Mesh[] = [];
  private editing: { points: Point[]; onChange(points: Point[]): void } | null = null;
  private dragging = -1;

  constructor(app: App) {
    this.app = app;
    this.preview.renderOrder = 999;
    app.viewport.scene.add(this.preview);
  }

  get drawing(): boolean {
    return this.kind !== null;
  }

  /** Starts a draw. The next clicks build the shape; enter or escape ends it. */
  start(kind: ShapeKind, onDone: (shape: DrawnShape) => void): void {
    this.cancel();
    this.kind = kind;
    this.onDone = onDone;
    this.points = [];
  }

  cancel(): void {
    this.kind = null;
    this.onDone = null;
    this.points = [];
    this.clearPreview();
  }

  /** A click while drawing. Returns true when it was consumed. */
  click(event: MouseEvent): boolean {
    if (!this.kind) return false;
    const at = groundPoint(this.app, event);
    if (!at) return true;
    const point: Point = [round(at.x), round(at.z)];
    this.points.push(point);

    if (this.kind === 'circle' && this.points.length === 2) {
      const [centre, edge] = this.points;
      this.finish({ kind: 'circle', at: centre, radius: round(Math.hypot(edge[0] - centre[0], edge[1] - centre[1])) });
      return true;
    }
    if (this.kind === 'rectangle' && this.points.length === 2) {
      const [a, b] = this.points;
      this.finish({
        kind: 'rectangle',
        min: [Math.min(a[0], b[0]), Math.min(a[1], b[1])],
        max: [Math.max(a[0], b[0]), Math.max(a[1], b[1])],
      });
      return true;
    }
    this.drawPreview();
    return true;
  }

  /** Enter, or a double click: ends a polyline. */
  finishPolyline(): void {
    if (this.kind !== 'polyline' || this.points.length < 2) {
      this.cancel();
      return;
    }
    this.finish({ kind: 'polyline', points: [...this.points] });
  }

  private finish(shape: DrawnShape): void {
    const done = this.onDone;
    this.cancel();
    done?.(shape);
  }

  private clearPreview(): void {
    if (!this.line) return;
    this.preview.remove(this.line);
    this.line.geometry.dispose();
    this.line = null;
  }

  private drawPreview(): void {
    this.clearPreview();
    if (this.points.length < 2) return;
    const geometry = new THREE.BufferGeometry().setFromPoints(
      this.points.map((point) => new THREE.Vector3(point[0], this.groundAt(point) + 0.05, point[1])),
    );
    this.line = new THREE.Line(geometry, PREVIEW);
    this.line.frustumCulled = false;
    this.preview.add(this.line);
  }

  private groundAt(point: Point): number {
    return this.app.zones.current?.definition.groundAt?.(point[0], point[1]) ?? 0;
  }

  // --- editing an existing polyline -----------------------------------------

  /** Puts a draggable handle on each point of a shape being edited. */
  edit(points: readonly Point[] | null, onChange?: (points: Point[]) => void): void {
    for (const handle of this.handles) {
      this.preview.remove(handle);
      handle.geometry.dispose();
    }
    this.handles.length = 0;
    this.editing = points && onChange ? { points: points.map((p) => [...p] as Point), onChange } : null;
    if (!this.editing) return;

    for (const point of this.editing.points) {
      const handle = new THREE.Mesh(HANDLE_SHAPE, HANDLE);
      handle.position.set(point[0], this.groundAt(point) + 0.15, point[1]);
      handle.renderOrder = 999;
      handle.frustumCulled = false;
      this.handles.push(handle);
      this.preview.add(handle);
    }
  }

  /** Which handle is under the cursor, or -1. */
  private handleUnder(event: MouseEvent): number {
    const canvas = this.app.viewport.renderer.domElement;
    const rect = canvas.getBoundingClientRect();
    const pointer = new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1,
    );
    const caster = new THREE.Raycaster();
    caster.setFromCamera(pointer, this.app.viewport.camera);
    const hit = caster.intersectObjects(this.handles, false)[0];
    return hit ? this.handles.indexOf(hit.object as THREE.Mesh) : -1;
  }

  /** True when the press grabbed a handle. */
  grab(event: MouseEvent): boolean {
    if (!this.editing) return false;
    this.dragging = this.handleUnder(event);
    if (this.dragging < 0) return false;
    this.handles[this.dragging].material = HANDLE_HOT;
    return true;
  }

  drag(event: MouseEvent): boolean {
    if (this.dragging < 0 || !this.editing) return false;
    const at = groundPoint(this.app, event);
    if (!at) return true;
    const point: Point = [round(at.x), round(at.z)];
    this.editing.points[this.dragging] = point;
    this.handles[this.dragging].position.set(point[0], this.groundAt(point) + 0.15, point[1]);
    return true;
  }

  release(): void {
    if (this.dragging < 0 || !this.editing) return;
    this.handles[this.dragging].material = HANDLE;
    this.dragging = -1;
    this.editing.onChange(this.editing.points.map((p) => [...p] as Point));
  }

  /** Splits the segment nearest the cursor, or drops the handle under it. */
  insertNear(event: MouseEvent): void {
    if (!this.editing) return;
    const at = groundPoint(this.app, event);
    if (!at) return;
    const points = this.editing.points;
    let best = 1;
    let closest = Infinity;
    for (let i = 1; i < points.length; i++) {
      const distance = toSegment(at.x, at.z, points[i - 1], points[i]);
      if (distance < closest) {
        closest = distance;
        best = i;
      }
    }
    points.splice(best, 0, [round(at.x), round(at.z)]);
    this.editing.onChange(points.map((p) => [...p] as Point));
  }

  removeUnder(event: MouseEvent): void {
    if (!this.editing) return;
    const at = this.handleUnder(event);
    if (at < 0 || this.editing.points.length <= 2) return;
    this.editing.points.splice(at, 1);
    this.editing.onChange(this.editing.points.map((p) => [...p] as Point));
  }
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

function toSegment(x: number, z: number, a: Point, b: Point): number {
  const dx = b[0] - a[0];
  const dz = b[1] - a[1];
  const lenSq = dx * dx + dz * dz;
  const t = lenSq === 0 ? 0 : Math.max(0, Math.min(1, ((x - a[0]) * dx + (z - a[1]) * dz) / lenSq));
  return Math.hypot(x - (a[0] + dx * t), z - (a[1] + dz * t));
}

export { DOWN };
