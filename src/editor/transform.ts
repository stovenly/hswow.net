import * as THREE from 'three';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import type { App } from '../app/boot';
import type { Entry, EntryPlacement } from '../world/entry';
import type { Selection } from './selection';
import { entryTagOf } from './selection';
import type { Session } from './session';
import { moved } from './matrices';

/**
 * The gizmo, and what a drag means.
 *
 * `TransformControls` moves an `Object3D`; this listens and writes the entry.
 * The collision-aware move is done in the drag handler rather than inside the
 * control, which is not extended.
 */

export type Tool = 'move' | 'rotate' | 'scale' | 'stretch';

/**
 * Free lets things interpenetrate — a candle is *meant* to sit inside a table's
 * bounding box. Contact sweeps the selection's extent against the zone and
 * stops at the first touch. Ground gives the object's height to the terrain.
 */
export type MoveMode = 'free' | 'contact' | 'ground';

/** Snap steps when ctrl is held. */
const SNAP = { move: 0.1, rotate: Math.PI / 36, scale: 0.05 };
/** How far short of a contact the object stops, in metres. */
const SKIN = 0.002;

const DOWN = new THREE.Vector3(0, -1, 0);
const _size = new THREE.Vector3();
const _caster = new THREE.Raycaster();
const _from = new THREE.Vector3();
const _to = new THREE.Vector3();
const _step = new THREE.Vector3();

export class Transform {
  readonly controls: TransformControls;
  private readonly app: App;
  private readonly session: Session;
  private readonly selection: Selection;
  /** What the gizmo actually drags: a proxy the selection follows. */
  private readonly handle = new THREE.Object3D();
  private readonly offsets = new Map<THREE.Object3D, THREE.Vector3>();
  private readonly startPositions = new Map<THREE.Object3D, THREE.Vector3>();
  private start = new THREE.Vector3();

  private toolName: Tool = 'move';
  mode: MoveMode = 'ground';
  onCommit: (() => void) | null = null;

  constructor(app: App, session: Session, selection: Selection) {
    this.app = app;
    this.session = session;
    this.selection = selection;

    const canvas = app.viewport.renderer.domElement;
    this.controls = new TransformControls(app.viewport.camera, canvas);
    this.controls.setSpace('world');
    app.viewport.scene.add(this.handle);
    app.viewport.scene.add(this.controls.getHelper());
    this.controls.enabled = false;

    this.controls.addEventListener('dragging-changed', (event) => {
      const dragging = (event as unknown as { value: boolean }).value;
      if (dragging) this.beginDrag();
      else this.endDrag();
    });
    this.controls.addEventListener('objectChange', () => this.drag());

    selection.onChanged(() => this.attach());
    app.loop.add(() => this.followSelection());
  }

  get tool(): Tool {
    return this.toolName;
  }

  setTool(tool: Tool): void {
    this.toolName = tool;
    this.controls.setMode(tool === 'stretch' ? 'scale' : (tool as 'translate' | 'rotate' | 'scale'));
    if (tool === 'move') this.controls.setMode('translate');
    this.applyAxes();
  }

  setSpace(space: 'local' | 'world'): void {
    this.controls.setSpace(space);
  }

  get space(): 'local' | 'world' {
    return this.controls.space;
  }

  /** Constrains to one axis, or back to all three with null. */
  axis: 'X' | 'Y' | 'Z' | null = null;

  setAxis(axis: 'X' | 'Y' | 'Z' | null): void {
    this.axis = this.axis === axis ? null : axis;
    this.applyAxes();
  }

  private applyAxes(): void {
    const only = this.axis;
    const move = this.toolName === 'move';
    // Ground mode hands Y to the terrain, so the vertical arrow would lie.
    const vertical = !(move && this.mode === 'ground');
    this.controls.showX = only === null || only === 'X';
    this.controls.showY = (only === null || only === 'Y') && vertical;
    this.controls.showZ = only === null || only === 'Z';
  }

  setMode(mode: MoveMode): void {
    this.mode = mode;
    this.applyAxes();
  }

  setSnapping(on: boolean): void {
    this.controls.setTranslationSnap(on ? SNAP.move : null);
    this.controls.setRotationSnap(on ? SNAP.rotate : null);
    this.controls.setScaleSnap(on ? SNAP.scale : null);
  }

  private attach(): void {
    const objects = this.selection.objects;
    if (objects.length === 0) {
      this.controls.detach();
      this.controls.enabled = false;
      return;
    }
    const box = this.selection.boundsOf(objects);
    if (!box) return;
    // The handle sits at the selection's foot, because rotation is about the
    // foot and a gizmo whose origin is not the pivot lies about what it does.
    box.getCenter(this.handle.position).setY(box.min.y);
    this.handle.rotation.set(0, objects.length === 1 ? objects[0].rotation.y : 0, 0);
    this.handle.scale.set(1, 1, 1);
    this.controls.attach(this.handle);
    this.controls.enabled = true;
  }

  /** Keeps the gizmo on the selection while something else moves it. */
  private followSelection(): void {
    if (this.controls.dragging || this.selection.objects.length === 0) return;
    const box = this.selection.boundsOf(this.selection.objects);
    if (box) box.getCenter(this.handle.position).setY(box.min.y);
  }

  private beginDrag(): void {
    this.start.copy(this.handle.position);
    this.offsets.clear();
    this.startPositions.clear();
    for (const object of this.selection.objects) {
      this.offsets.set(object, object.position.clone().sub(this.handle.position));
      this.startPositions.set(object, object.position.clone());
    }
  }

  private drag(): void {
    if (!this.controls.dragging) return;
    const objects = this.selection.objects;
    if (objects.length === 0) return;

    if (this.toolName === 'move') {
      let delta = _step.copy(this.handle.position).sub(this.start);
      if (this.mode === 'contact') delta = this.sweep(delta);
      for (const object of objects) {
        const from = this.startPositions.get(object);
        if (!from) continue;
        object.position.copy(from).add(delta);
        if (this.mode === 'ground') object.position.y = this.groundUnder(object.position);
        moved(object);
      }
      this.handle.position.copy(this.start).add(delta);
      return;
    }

    if (this.toolName === 'rotate') {
      const yaw = this.handle.rotation.y;
      for (const object of objects) {
        object.rotation.y = yaw;
        moved(object);
      }
      return;
    }

    const scale = this.handle.scale;
    for (const object of objects) {
      if (this.toolName === 'stretch') object.scale.copy(scale);
      else object.scale.setScalar((scale.x + scale.y + scale.z) / 3);
      moved(object);
    }
  }

  /**
   * Sweeps the selection's extent along the drag against the zone, stopping at
   * the first contact.
   *
   * Against the scene graph rather than the octree: the octree is only rebuilt
   * on the way into Play, so during a drag it is a second out of date — and the
   * one prop it is most out of date about is the one in your hand.
   */
  private sweep(delta: THREE.Vector3): THREE.Vector3 {
    const distance = delta.length();
    if (distance < 1e-6) return delta;
    const box = this.selection.boundsOf(this.selection.objects);
    if (!box) return delta;
    box.getSize(_size);
    const radius = Math.max(_size.x, _size.z) / 2;
    const direction = _to.copy(delta).normalize();
    box.getCenter(_from);

    const hit = this.castWorld(_from, direction, distance + radius + 1);
    if (hit === null) return delta;
    const room = Math.max(0, hit - radius - SKIN);
    return room >= distance ? delta : delta.setLength(room);
  }

  /**
   * Distance to the nearest thing in the zone that is not the selection, along
   * a ray. The scene graph, so it is never out of date.
   */
  private castWorld(from: THREE.Vector3, direction: THREE.Vector3, far: number): number | null {
    const zone = this.app.zones.current;
    if (!zone?.isBuilt) return null;
    _caster.set(from, direction);
    _caster.far = far;
    const mine = new Set(this.selection.objects);
    for (const hit of _caster.intersectObject(zone.root(), true)) {
      let owned = false;
      for (let node: THREE.Object3D | null = hit.object; node; node = node.parent) {
        if (mine.has(node)) {
          owned = true;
          break;
        }
      }
      if (!owned) return hit.distance;
    }
    return null;
  }

  private groundUnder(at: THREE.Vector3): number {
    const zone = this.app.zones.current;
    const ground = zone?.definition.groundAt?.(at.x, at.z);
    if (ground !== undefined) return ground;
    // No heightfield: fall onto whatever is under it, or leave it where it is.
    _from.set(at.x, at.y + 20, at.z);
    const hit = this.castWorld(_from, DOWN, 60);
    return hit === null ? at.y : _from.y - hit;
  }

  /** Settles the selection onto whatever is beneath it. */
  drop(): void {
    for (const object of this.selection.objects) {
      _from.copy(object.position).setY(object.position.y + 0.05);
      const hit = this.castWorld(_from, DOWN, 80);
      if (hit === null) continue;
      const landed = _from.y - hit;
      const under = this.underEntry(_from, hit);
      const tag = entryTagOf(object);
      if (!tag) continue;
      this.session.commit(tag.zone, 'transform', (doc) => {
        const entry = findIn(doc, tag.id);
        if (!entry) return;
        if (under && under !== tag.id) {
          entry.on = under;
          entry.at = [round(object.position.x), round(object.position.z)];
        } else {
          delete entry.on;
          entry.at = [round(object.position.x), round(landed), round(object.position.z)];
        }
      });
      const entry = this.session.entry(tag.zone, tag.id);
      if (entry) this.session.reposition(tag.zone, entry, object);
    }
    this.onCommit?.();
  }

  /** Which entry, if any, the ray landed on. */
  private underEntry(from: THREE.Vector3, distance: number): string | null {
    const zone = this.app.zones.current;
    if (!zone?.isBuilt) return null;
    const caster = new THREE.Raycaster(from, DOWN, 0, distance + 0.1);
    for (const hit of caster.intersectObject(zone.root(), true)) {
      const tag = entryTagOf(hit.object);
      if (tag) return tag.id;
    }
    return null;
  }

  /**
   * Moves the selection onto a picked entry: origin to origin, and with an axis
   * held, along that axis until the two collision extents touch.
   */
  snapTo(target: THREE.Object3D): void {
    const box = this.selection.boundsOf(this.selection.objects);
    const onto = new THREE.Box3().expandByObject(target, true);
    if (!box || onto.isEmpty()) return;
    const delta = new THREE.Vector3();

    if (this.axis === null) {
      delta.copy(target.position).sub(this.selection.objects[0].position);
    } else {
      const key = this.axis.toLowerCase() as 'x' | 'y' | 'z';
      // Whichever face is nearer along the axis: pushing away is never wanted.
      const push = box.max[key] <= onto.min[key] ? onto.min[key] - box.max[key] : onto.max[key] - box.min[key];
      delta[key] = push;
    }

    for (const object of this.selection.objects) {
      object.position.add(delta);
      moved(object);
    }
    this.write();
  }

  private endDrag(): void {
    this.write();
    // The octree indexed the prop where it used to be.
    const zone = this.selection.tag?.zone;
    if (zone) this.session.reindex(zone);
  }

  /** Writes every selected object's transform back into its entry. */
  write(): void {
    for (const object of this.selection.objects) {
      const tag = entryTagOf(object);
      if (!tag) continue;
      const definition = this.app.zones.zones.get(tag.zone);
      const ground = definition?.definition.groundAt?.(object.position.x, object.position.z);
      const settled = ground !== undefined && Math.abs(ground - object.position.y) < 0.02;
      // Scale is a builder option, so it cannot be applied to a built mesh: the
      // entry takes it and the zone rebuilds.
      const rebuilt = this.toolName === 'scale';
      this.session.commit(tag.zone, rebuilt ? 'zone' : 'transform', (doc) => {
        const entry = findIn(doc, tag.id);
        if (!entry) return;
        if (!entry.on) {
          entry.at = settled
            ? [round(object.position.x), round(object.position.z)]
            : [round(object.position.x), round(object.position.y), round(object.position.z)];
        }
        if (this.toolName === 'rotate') entry.yaw = round(object.rotation.y, 4);
        if (this.toolName === 'scale') entry.scale = round(object.scale.x, 3);
        if (this.toolName === 'stretch') {
          entry.stretch = [round(object.scale.x, 3), round(object.scale.y, 3), round(object.scale.z, 3)];
        }
      });
    }
    this.onCommit?.();
  }
}

function round(value: number, places = 3): number {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
}

/** The entry with this id, as a mutable placement. */
export function findIn(doc: { layers?: readonly { entries: readonly Entry[] }[]; entries?: readonly Entry[] }, id: string):
  | (Entry & EntryPlacement)
  | undefined {
  const lists = doc.layers ? doc.layers.map((layer) => layer.entries) : [doc.entries ?? []];
  for (const list of lists) {
    for (const entry of list) if (entry.id === id) return entry as Entry & EntryPlacement;
  }
  return undefined;
}
