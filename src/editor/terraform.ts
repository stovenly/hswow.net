import * as THREE from 'three';
import type { App } from '../app/boot';
import { GROUND, COVER_TYPES } from '../world/ground';
import type { Raster } from '../world/raster';
import { holdSidecar, terrainOf, type ZoneDocument } from '../world/document';
import { createRng } from '../art/random';
import { groundPoint } from './shapes';
import type { Session } from './session';

/**
 * The brushes: lifting, lowering, shaping, and painting what the ground is made
 * of.
 *
 * Strokes write the sculpt raster; the landforms underneath are untouched, so a
 * hill can still be dragged after its flank has been shaped. During a stroke the
 * terrain mesh's vertices are re-evaluated from `heightAt`, which is a pass over
 * a few thousand vertices on a known grid; the collider and the cover wait for
 * the mouse to come up.
 */

export type Brush =
  | 'raise'
  | 'smooth'
  | 'flatten'
  | 'set'
  | 'ramp'
  | 'roughen'
  | 'erase'
  | 'paint'
  | 'unpaint';

export type Falloff = 'smooth' | 'linear' | 'flat';

const GROUND_NAMES = Object.keys(GROUND);
const COVER_NAMES = Object.keys(COVER_TYPES);

const RING_SEGMENTS = 40;
const RING_MATERIAL = new THREE.LineBasicMaterial({
  color: 0x7fd4ff,
  depthTest: false,
  fog: false,
  toneMapped: false,
});
const FALLOFF_MATERIAL = new THREE.LineBasicMaterial({
  color: 0x7fd4ff,
  opacity: 0.4,
  transparent: true,
  depthTest: false,
  fog: false,
  toneMapped: false,
});

function ring(material: THREE.Material): THREE.Line {
  const points: THREE.Vector3[] = [];
  for (let i = 0; i <= RING_SEGMENTS; i++) {
    const t = (i / RING_SEGMENTS) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(t), 0, Math.sin(t)));
  }
  const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), material);
  line.frustumCulled = false;
  line.renderOrder = 999;
  line.visible = false;
  return line;
}

/** Smootherstep, so a stroke has no gradient at its own edge. */
function ease(t: number): number {
  const x = t < 0 ? 0 : t > 1 ? 1 : t;
  return x * x * x * (x * (x * 6 - 15) + 10);
}

export class Terraform {
  private readonly app: App;
  private readonly session: Session;
  private readonly outer = ring(RING_MATERIAL);
  private readonly inner = ring(FALLOFF_MATERIAL);

  /** Which layer a stroke writes, and how. */
  brush: Brush = 'raise';
  radius = 6;
  strength = 1.2;
  falloff: Falloff = 'smooth';
  /** What `paint` writes. */
  material = 'dirt';
  cover = 'none';
  /** Which of the two painted layers `paint` touches. */
  painting: 'material' | 'cover' = 'material';
  /** Roughen's own seed, so the same hand makes the same ground twice. */
  seed = 1;

  private active = false;
  private levelling = 0;
  private rampFrom: THREE.Vector3 | null = null;
  private touched = false;

  say: (message: string) => void = () => {};

  constructor(app: App, session: Session) {
    this.app = app;
    this.session = session;
    app.viewport.scene.add(this.outer, this.inner);
  }

  get enabled(): boolean {
    return this.active;
  }

  setEnabled(on: boolean): void {
    this.active = on;
    this.outer.visible = on;
    this.inner.visible = on;
    if (!on) this.rampFrom = null;
  }

  /** Moves the ring under the cursor and, while dragging, lays a stroke. */
  hover(event: MouseEvent, painting: boolean): void {
    if (!this.active) return;
    const at = groundPoint(this.app, event);
    if (!at) return;
    this.outer.position.copy(at).setY(at.y + 0.05);
    this.outer.scale.set(this.radius, 1, this.radius);
    this.inner.position.copy(this.outer.position);
    this.inner.scale.set(this.radius * 0.55, 1, this.radius * 0.55);
    if (!painting) return;
    this.stroke(at);
  }

  /** Scroll under the brush is the radius. */
  scale(delta: number): void {
    this.radius = Math.max(0.5, Math.min(120, this.radius * (delta > 0 ? 1.12 : 1 / 1.12)));
  }

  down(event: MouseEvent, shift: boolean): void {
    if (!this.active) return;
    const at = groundPoint(this.app, event);
    if (!at) return;
    if (this.brush === 'ramp') {
      if (!this.rampFrom) {
        this.rampFrom = at.clone();
        this.say('now click where the ramp ends');
        return;
      }
      this.ramp(this.rampFrom, at);
      this.rampFrom = null;
      this.commit();
      return;
    }
    this.levelling = at.y;
    this.touched = false;
    this.stroke(at, shift);
  }

  /** Mouse-up: one undo step, the collider back, and the cover regrown. */
  up(): void {
    if (!this.touched) return;
    this.touched = false;
    this.commit();
  }

  private zoneDoc(): ZoneDocument | null {
    const zone = this.app.zones.current?.id;
    return (zone ? this.session.doc(zone) : null) ?? null;
  }

  /** The layer a stroke writes, made on first use and named after the zone. */
  private layer(): { raster: Raster<Float32Array | Uint8Array>; file: string } | null {
    const doc = this.zoneDoc();
    if (!doc?.terrain) return null;
    const terrain = doc.terrain;
    const painted = this.brush === 'paint' || this.brush === 'unpaint';
    const which = painted ? (this.painting === 'cover' ? 'coverPaint' : 'paint') : 'sculpt';
    const suffix = which === 'sculpt' ? 'height.r32' : which === 'paint' ? 'paint.u8' : 'cover.u8';
    const file = `${doc.id}.${suffix}`;
    const resolution = terrain[which]?.resolution ?? 1;

    // The zone's own raster, not a copy of the file: the brush writes into it
    // and `heightAt` reads it on the next vertex, which is what makes a stroke
    // visible while the mouse is still down.
    const field = terrainOf(doc.id);
    if (!field) return null;
    const raster: Raster<Float32Array | Uint8Array> =
      which === 'sculpt'
        ? field.sculptRaster(resolution)
        : which === 'paint'
          ? field.paintRaster(resolution)
          : field.coverRaster(resolution);

    if (!terrain[which]) {
      this.session.commit(doc.id, 'zone', (target) => {
        if (target.terrain) target.terrain[which] = { file, resolution };
      });
    }
    return { raster, file };
  }

  /** One dab, weighted by falloff, on whichever layer the brush names. */
  private stroke(at: THREE.Vector3, invert = false): void {
    const layer = this.layer();
    if (!layer) return;
    const { raster } = layer;
    const half = raster.size / 2;
    const cells = Math.ceil(this.radius / raster.resolution) + 1;
    const centre = raster.cellOf(at.x, at.z);
    const rng = createRng(this.seed);
    const painted = this.brush === 'paint' || this.brush === 'unpaint';
    const index = painted
      ? this.brush === 'unpaint'
        ? 0
        : (this.painting === 'cover'
            ? COVER_NAMES.indexOf(this.cover)
            : GROUND_NAMES.indexOf(this.material)) + 1
      : 0;

    for (let row = Math.floor(centre.row) - cells; row <= Math.ceil(centre.row) + cells; row++) {
      for (let col = Math.floor(centre.col) - cells; col <= Math.ceil(centre.col) + cells; col++) {
        const world = raster.worldOf(col, row);
        if (Math.abs(world.x) > half || Math.abs(world.z) > half) continue;
        const distance = Math.hypot(world.x - at.x, world.z - at.z);
        if (distance > this.radius) continue;
        const t = 1 - distance / this.radius;
        const weight =
          this.falloff === 'flat' ? 1 : this.falloff === 'linear' ? t : ease(t);
        if (weight <= 0) continue;

        if (painted) {
          raster.set(col, row, weight > 0.5 ? index : raster.at(col, row));
          continue;
        }

        const held = raster.at(col, row);
        const step = this.strength * weight * (invert ? -1 : 1);
        switch (this.brush) {
          case 'raise':
            raster.set(col, row, held + step * 0.06);
            break;
          case 'smooth': {
            const mean =
              (raster.at(col - 1, row) +
                raster.at(col + 1, row) +
                raster.at(col, row - 1) +
                raster.at(col, row + 1)) /
              4;
            raster.set(col, row, held + (mean - held) * weight * 0.35);
            break;
          }
          case 'flatten': {
            const ground = this.app.zones.current?.definition.groundAt?.(world.x, world.z) ?? 0;
            const wanted = held + (this.levelling - ground);
            raster.set(col, row, held + (wanted - held) * weight * 0.3);
            break;
          }
          case 'set': {
            const ground = this.app.zones.current?.definition.groundAt?.(world.x, world.z) ?? 0;
            raster.set(col, row, held + (this.levelling - ground));
            break;
          }
          case 'roughen':
            // Authored noise: it goes where you put it and nowhere else.
            raster.set(col, row, held + (rng() - 0.5) * this.strength * weight * 0.12);
            break;
          case 'erase':
            raster.set(col, row, held * (1 - weight * 0.4));
            break;
          default:
            break;
        }
      }
    }

    this.touched = true;
    this.reshape();
  }

  /** Two clicks: a linear gradient between their heights along the segment. */
  private ramp(from: THREE.Vector3, to: THREE.Vector3): void {
    const layer = this.layer();
    if (!layer) return;
    const { raster } = layer;
    const dx = to.x - from.x;
    const dz = to.z - from.z;
    const lengthSq = dx * dx + dz * dz;
    if (lengthSq < 1e-6) return;

    const minX = Math.min(from.x, to.x) - this.radius;
    const maxX = Math.max(from.x, to.x) + this.radius;
    const minZ = Math.min(from.z, to.z) - this.radius;
    const maxZ = Math.max(from.z, to.z) + this.radius;
    const a = raster.cellOf(minX, minZ);
    const b = raster.cellOf(maxX, maxZ);

    for (let row = Math.floor(a.row); row <= Math.ceil(b.row); row++) {
      for (let col = Math.floor(a.col); col <= Math.ceil(b.col); col++) {
        const world = raster.worldOf(col, row);
        const t = Math.max(
          0,
          Math.min(1, ((world.x - from.x) * dx + (world.z - from.z) * dz) / lengthSq),
        );
        const onLine = { x: from.x + dx * t, z: from.z + dz * t };
        const across = Math.hypot(world.x - onLine.x, world.z - onLine.z);
        if (across > this.radius) continue;
        const weight = ease(1 - across / this.radius);
        const wanted = from.y + (to.y - from.y) * t;
        const ground = this.app.zones.current?.definition.groundAt?.(world.x, world.z) ?? 0;
        const held = raster.at(col, row);
        raster.set(col, row, held + (wanted - ground) * weight);
      }
    }
    this.touched = true;
    this.reshape();
  }

  /**
   * Re-evaluates the built terrain mesh's vertices from `heightAt`. They lie on
   * a known grid, so this is a pass over a few thousand of them; the colours,
   * the cover and the collider wait for the stroke to end.
   */
  private reshape(): void {
    const zone = this.app.zones.current;
    const definition = zone?.definition;
    if (!zone?.isBuilt || !definition?.groundAt) return;
    let mesh: THREE.Mesh | null = null;
    zone.root().traverse((object) => {
      if (!mesh && object instanceof THREE.Mesh && object.name === 'terrain') mesh = object;
    });
    const found = mesh as THREE.Mesh | null;
    if (!found) return;

    const position = found.geometry.getAttribute('position') as THREE.BufferAttribute;
    for (let i = 0; i < position.count; i++) {
      position.setY(i, definition.groundAt(position.getX(i), position.getZ(i)));
    }
    position.needsUpdate = true;
    found.geometry.computeVertexNormals();
  }

  /** The stroke is finished: rebuild the zone and write the raster to disk. */
  private commit(): void {
    const doc = this.zoneDoc();
    if (!doc?.terrain) return;
    const field = terrainOf(doc.id);
    if (!field) return;
    for (const [which, raster] of [
      ['sculpt', field.sculptRasterIfAny()],
      ['paint', field.paintRasterIfAny()],
      ['coverPaint', field.coverRasterIfAny()],
    ] as const) {
      const named = doc.terrain[which];
      if (!named || !raster) continue;
      const bytes = raster.bytes;
      holdSidecar(named.file, bytes);
      void this.session.api.saveRaster(doc.id, named.file.slice(doc.id.length + 1), bytes);
    }
    // Props on the ground ride it: every entry with a two-number `at` is
    // re-settled by the rebuild, which is the same rule as everywhere else.
    void this.session.rebuildNow(doc.id);
    this.say('ground committed');
  }

  /** What the swatch rows offer. */
  static get materials(): readonly string[] {
    return GROUND_NAMES;
  }

  static get covers(): readonly string[] {
    return ['none', ...COVER_NAMES];
  }
}
