import * as THREE from 'three';
import type { App } from '../app/boot';
import { arrivalFor } from '../world/Portal';
import { shapeDistance, type PatchShape } from '../world/ground';
import type { Session } from './session';

/**
 * Everything the world does not draw: sound radii, volume shells, roam rings,
 * regions, the spawn, portal ends and where they land you.
 *
 * All session-only, all on the View menu. If a control changes what you see it
 * wrote a document field; this is the other category, and it says so.
 */

const RING_SEGMENTS = 48;
/** Milliseconds of quiet before the rings are rebuilt. */
const SETTLE = 120;

function lineMaterial(color: number, opacity = 1): THREE.LineBasicMaterial {
  return new THREE.LineBasicMaterial({
    color,
    transparent: opacity < 1,
    opacity,
    depthTest: false,
    fog: false,
    toneMapped: false,
  });
}

const COLOURS = {
  sound: 0xffc14d,
  volume: 0xb98cff,
  roam: 0x8fe08f,
  region: 0x6fa8ff,
  spawn: 0xffffff,
  portal: 0xff8f6b,
  scatter: 0x6fe0d0,
};

/** A flat ring on the XZ plane, radius 1. */
function ringGeometry(): THREE.BufferGeometry {
  const points: THREE.Vector3[] = [];
  for (let i = 0; i <= RING_SEGMENTS; i++) {
    const t = (i / RING_SEGMENTS) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(t), 0, Math.sin(t)));
  }
  return new THREE.BufferGeometry().setFromPoints(points);
}

const RING = ringGeometry();
const SPHERE = new THREE.WireframeGeometry(new THREE.SphereGeometry(1, 12, 8));
const BOX = new THREE.EdgesGeometry(new THREE.BoxGeometry(2, 2, 2));
const CAPSULE = new THREE.EdgesGeometry(new THREE.CapsuleGeometry(0.35, 1, 4, 8));

export interface ViewFlags {
  sounds: boolean;
  volumes: boolean;
  roam: boolean;
  regions: boolean;
  spawn: boolean;
  portals: boolean;
  scatters: boolean;
  grid: boolean;
}

export class Visualisers {
  /**
   * All off. Every one of these draws a ring or a shell over the world, and a
   * level opened with the lot on is a level you cannot see.
   */
  readonly flags: ViewFlags = {
    sounds: false,
    volumes: false,
    roam: false,
    regions: false,
    spawn: false,
    portals: false,
    scatters: false,
    grid: false,
  };

  private readonly app: App;
  private readonly session: Session;
  private readonly root = new THREE.Group();
  private readonly grid: THREE.GridHelper;
  private dirty = true;
  private settleAt = 0;
  private shownZone = '';

  constructor(app: App, session: Session) {
    this.app = app;
    this.session = session;
    this.root.name = 'editor:visualisers';
    this.root.renderOrder = 998;
    app.viewport.scene.add(this.root);

    this.grid = new THREE.GridHelper(200, 200, 0x4a5a6a, 0x2a3440);
    (this.grid.material as THREE.Material).depthTest = false;
    this.grid.visible = false;
    this.root.add(this.grid);

    app.loop.add(() => this.tick());
  }

  /**
   * Redraws shortly. Debounced rather than immediate: a slider being dragged
   * commits every frame, and this rebuilds every ring in the zone.
   */
  invalidate(): void {
    this.dirty = true;
    this.settleAt = performance.now() + SETTLE;
  }

  set(flag: keyof ViewFlags, on: boolean): void {
    this.flags[flag] = on;
    this.dirty = true;
  }

  private tick(): void {
    const zone = this.app.zones.current?.id ?? '';
    if (zone !== this.shownZone) {
      this.shownZone = zone;
      this.dirty = true;
    }
    if (!this.dirty || performance.now() < this.settleAt) return;
    this.dirty = false;
    this.redraw();
  }

  private clear(): void {
    for (let i = this.root.children.length - 1; i >= 0; i--) {
      const child = this.root.children[i];
      if (child === this.grid) continue;
      this.root.remove(child);
      if (child instanceof THREE.Line || child instanceof THREE.LineSegments) {
        (child.material as THREE.Material).dispose();
      }
    }
  }

  private redraw(): void {
    this.clear();
    this.grid.visible = this.flags.grid;
    const zone = this.shownZone;
    const doc = this.session.doc(zone);
    if (!doc) return;

    const groundAt = (x: number, z: number): number =>
      this.app.zones.zones.get(zone)?.definition.groundAt?.(x, z) ?? 0;

    if (this.flags.spawn && doc.spawn) {
      const at = doc.spawn.at;
      const x = at[0];
      const z = at.length >= 3 ? at[2] : at[1];
      this.flag(x, groundAt(x, z), z, COLOURS.spawn);
    }

    if (this.flags.regions) {
      for (const shapes of Object.values(doc.regions ?? {})) {
        for (const shape of shapes) this.shape(shape, groundAt, COLOURS.region);
      }
    }

    for (const { entry } of this.session.entries(zone)) {
      const record = entry as unknown as Record<string, unknown>;
      const at = (record.at as number[] | undefined) ?? [0, 0];
      const x = at[0] ?? 0;
      const z = at.length >= 3 ? at[2] : (at[1] ?? 0);
      const y = at.length >= 3 ? (at[1] as number) : groundAt(x, z);

      if (this.flags.sounds && (entry.kind === 'sound' || entry.kind === 'soundScatter')) {
        const spec = (record.spec as Record<string, number>) ?? {};
        const anchor = this.anchorOf(entry.kind === 'sound' ? record : record, x, y, z);
        this.ring(anchor, spec.refDistance ?? 1, COLOURS.sound, 0.9);
        this.ring(anchor, spec.maxDistance ?? 20, COLOURS.sound, 0.3);
      }

      if (this.flags.volumes && (entry.kind === 'fogVolume' || entry.kind === 'glitch' || entry.kind === 'horror')) {
        const centre = (record.center as number[] | undefined) ?? [x, y, z];
        const size = (record.size as number[] | undefined) ?? [1, 1, 1];
        const shell = record.shape === 'box' ? BOX : SPHERE;
        const lines = new THREE.LineSegments(shell, lineMaterial(COLOURS.volume, 0.55));
        lines.position.set(centre[0], centre[1], centre[2]);
        lines.scale.set(size[0] / (record.shape === 'box' ? 2 : 1), size[1] / (record.shape === 'box' ? 2 : 1), size[2] / (record.shape === 'box' ? 2 : 1));
        this.add(lines);
      }

      if (this.flags.roam && entry.kind === 'creature' && typeof record.roam === 'number') {
        this.ring(new THREE.Vector3(x, y, z), record.roam, COLOURS.roam, 0.8);
      }

      if (this.flags.scatters && entry.kind === 'scatter') {
        const from = (record.from as number[] | undefined) ?? [0, 0];
        const centre = new THREE.Vector3(from[0], groundAt(from[0], from[1]), from[1]);
        this.ring(centre, (record.within as number) ?? 1, COLOURS.scatter, 0.6);
      }
    }

    if (!this.flags.portals) return;
    for (const side of this.app.zones.portals.in(zone)) {
      const end = side.end;
      this.flag(end.position.x, end.position.y, end.position.z, COLOURS.portal);
      // Where you would land coming the other way, drawn as a capsule: a door
      // whose arrival is in a hedge is visible before anybody walks through it.
      const arrival = arrivalFor(end);
      const capsule = new THREE.LineSegments(CAPSULE, lineMaterial(COLOURS.portal, 0.45));
      capsule.position.copy(arrival.position).setY(arrival.position.y + 0.85);
      this.add(capsule);
    }
  }

  /** Where a sound entry actually ends up, following its ref. */
  private anchorOf(record: Record<string, unknown>, x: number, y: number, z: number): THREE.Vector3 {
    const ref = record.ref as string | undefined;
    if (!ref) return new THREE.Vector3(x, y + ((record.lift as number) ?? 0), z);
    const zone = this.app.zones.current;
    let found: THREE.Object3D | null = null;
    zone?.root().traverse((object) => {
      const tag = object.userData.entry as { id: string } | undefined;
      if (!found && tag?.id === ref) found = object;
    });
    const held = found as THREE.Object3D | null;
    if (!held) return new THREE.Vector3(x, y, z);
    return held.position.clone().setY(held.position.y + ((record.lift as number) ?? 0));
  }

  private add(object: THREE.Object3D): void {
    object.renderOrder = 998;
    object.frustumCulled = false;
    this.root.add(object);
  }

  private ring(at: THREE.Vector3, radius: number, colour: number, opacity: number): void {
    const line = new THREE.Line(RING, lineMaterial(colour, opacity));
    line.position.copy(at);
    line.scale.set(radius, 1, radius);
    this.add(line);
  }

  /** A stake with a cross-bar: the spawn, and each portal end. */
  private flag(x: number, y: number, z: number, colour: number): void {
    const points = [
      new THREE.Vector3(x, y, z),
      new THREE.Vector3(x, y + 1.6, z),
      new THREE.Vector3(x, y + 1.6, z),
      new THREE.Vector3(x + 0.5, y + 1.35, z),
      new THREE.Vector3(x + 0.5, y + 1.35, z),
      new THREE.Vector3(x, y + 1.1, z),
    ];
    this.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(points), lineMaterial(colour)));
  }

  /** A region's edge, walked at a metre or so. */
  private shape(shape: PatchShape, groundAt: (x: number, z: number) => number, colour: number): void {
    const points: THREE.Vector3[] = [];
    const push = (x: number, z: number): void => {
      points.push(new THREE.Vector3(x, groundAt(x, z) + 0.05, z));
    };

    if (shape.kind === 'blot') {
      for (let i = 0; i <= RING_SEGMENTS; i++) {
        const t = (i / RING_SEGMENTS) * Math.PI * 2;
        push(shape.at[0] + Math.cos(t) * shape.radius, shape.at[1] + Math.sin(t) * shape.radius);
      }
    } else if (shape.kind === 'field') {
      const [x0, z0] = shape.min;
      const [x1, z1] = shape.max;
      for (const [x, z] of [[x0, z0], [x1, z0], [x1, z1], [x0, z1], [x0, z0]]) push(x, z);
    } else {
      // The centre line, not the width: a path's edge is a signed distance and
      // walking it costs more than it says.
      for (const point of shape.through) push(point[0], point[1]);
    }

    this.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), lineMaterial(colour, 0.6)));
  }
}

/** True when a point falls inside a region, for the tools that ask. */
export function insideShapes(shapes: readonly PatchShape[], x: number, z: number): boolean {
  return shapes.some((shape) => shapeDistance(shape, x, z) <= 0);
}
