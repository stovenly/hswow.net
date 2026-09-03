import * as THREE from 'three';

/**
 * Where groundcover may not grow: one byte per quarter metre over a zone,
 * 255 where the field is untouched and 0 where something stands on it.
 *
 * Two layers. `built` is stamped once, from the footprint of everything the
 * zone built, and is what the cover sampler reads — nothing is rolled under a
 * wall or a lane. `placed` is rewritten as things are put down and picked up,
 * and reaches the blades as a texture, so a dropped crate hides the grass under
 * it and a lifted one gives it back.
 */

/** Metres per cell. */
export const MASK_RESOLUTION = 0.25;
/** Cells per axis, at most. A zone wider than this is masked coarser. */
const MOST_CELLS = 1024;
/** Metres above its own base that a mesh's vertices count as standing on the ground. */
const LOW = 0.35;
/** Metres a footprint reaches past its triangles, so a root just outside a wall's face is not drawn through it. */
const DILATE = 0.12;

/** The built layer, flattened for the sampler. */
export interface MaskWire {
  data: Uint8Array;
  minX: number;
  minZ: number;
  cells: number;
  /** Metres per cell. */
  step: number;
}

/** How much cover survives at a point, 0..1. Nearest cell; the field is coarser than a blade. */
export function maskAt(wire: MaskWire, x: number, z: number): number {
  const col = Math.floor((x - wire.minX) / wire.step);
  const row = Math.floor((z - wire.minZ) / wire.step);
  if (col < 0 || row < 0 || col >= wire.cells || row >= wire.cells) return 1;
  return wire.data[row * wire.cells + col] / 255;
}

const _a = new THREE.Vector3();
const _b = new THREE.Vector3();
const _c = new THREE.Vector3();

export class CoverMask {
  readonly cells: number;
  readonly step: number;
  readonly minX: number;
  readonly minZ: number;
  private readonly built: Uint8Array;
  private readonly placed: Uint8Array;
  private readonly shown: Uint8Array<ArrayBuffer>;
  readonly texture: THREE.DataTexture;

  constructor(min: readonly [number, number], max: readonly [number, number]) {
    const extent = Math.max(max[0] - min[0], max[1] - min[1], 1);
    this.step = Math.max(MASK_RESOLUTION, extent / MOST_CELLS);
    this.cells = Math.ceil(extent / this.step);
    this.minX = (min[0] + max[0]) / 2 - (this.cells * this.step) / 2;
    this.minZ = (min[1] + max[1]) / 2 - (this.cells * this.step) / 2;
    const n = this.cells * this.cells;
    this.built = new Uint8Array(new ArrayBuffer(n)).fill(255);
    this.placed = new Uint8Array(new ArrayBuffer(n)).fill(255);
    this.shown = new Uint8Array(new ArrayBuffer(n)).fill(255);
    this.texture = new THREE.DataTexture(this.shown, this.cells, this.cells, THREE.RedFormat, THREE.UnsignedByteType);
    this.texture.minFilter = THREE.LinearFilter;
    this.texture.magFilter = THREE.LinearFilter;
    this.texture.wrapS = THREE.ClampToEdgeWrapping;
    this.texture.wrapT = THREE.ClampToEdgeWrapping;
    this.texture.needsUpdate = true;
  }

  /** xy the corner the texture starts at, z metres to texture space. Spelt `coverMaskSpan` in the shaders. */
  span(out: THREE.Vector4): THREE.Vector4 {
    return out.set(this.minX, this.minZ, 1 / (this.cells * this.step), 1);
  }

  wire(): MaskWire {
    return { data: this.built.slice(), minX: this.minX, minZ: this.minZ, cells: this.cells, step: this.step };
  }

  /**
   * Stamps everything under `root` that stands on the ground: every triangle
   * of every mesh with a vertex within `LOW` of the mesh's own base, in the
   * mesh's own frame — a prop is built up from its feet, so its feet are at
   * its origin however the ground under it lies.
   */
  stampObject(root: THREE.Object3D, layer: 'built' | 'placed', skip: (object: THREE.Mesh) => boolean): void {
    const into = layer === 'built' ? this.built : this.placed;
    root.updateWorldMatrix(true, true);
    root.traverse((object) => {
      if (!(object instanceof THREE.Mesh) || object instanceof THREE.SkinnedMesh || skip(object)) return;
      const footprint = object.userData.footprint as readonly (readonly [number, number, number])[] | undefined;
      if (footprint) {
        const soft = (object.userData.footprintSoft as number | undefined) ?? 0;
        for (let i = 0; i + 1 < footprint.length; i++) {
          const [ax, az, ar] = footprint[i];
          const [bx, bz, br] = footprint[i + 1];
          this.stampCapsule(into, ax, az, bx, bz, Math.min(ar, br), soft);
        }
        return;
      }
      const position = object.geometry.getAttribute('position');
      if (!position) return;
      const index = object.geometry.getIndex();
      const count = index ? index.count : position.count;
      const matrix = object.matrixWorld;
      const scaleY = Math.hypot(matrix.elements[4], matrix.elements[5], matrix.elements[6]) || 1;
      // A skin laid over the ground prints every face it has.
      const low = object.userData.footprintFaces === true ? Infinity : LOW / scaleY;
      for (let i = 0; i + 2 < count; i += 3) {
        const i0 = index ? index.getX(i) : i;
        const i1 = index ? index.getX(i + 1) : i + 1;
        const i2 = index ? index.getX(i + 2) : i + 2;
        if (position.getY(i0) > low && position.getY(i1) > low && position.getY(i2) > low) continue;
        _a.fromBufferAttribute(position, i0).applyMatrix4(matrix);
        _b.fromBufferAttribute(position, i1).applyMatrix4(matrix);
        _c.fromBufferAttribute(position, i2).applyMatrix4(matrix);
        this.stampTriangle(into, _a.x, _a.z, _b.x, _b.z, _c.x, _c.z);
      }
    });
  }

  /** A disc, bare within `radius - soft` and thinning to the field over `soft`. */
  stampDisc(layer: 'built' | 'placed', x: number, z: number, radius: number, soft = 0): void {
    this.stampCapsule(layer === 'built' ? this.built : this.placed, x, z, x, z, radius, soft);
  }

  resetPlaced(): void {
    this.placed.fill(255);
  }

  /** Folds the layers into what the blades see. Once per change, never per frame. */
  commit(): void {
    const { built, placed, shown } = this;
    for (let i = 0; i < shown.length; i++) shown[i] = Math.min(built[i], placed[i]);
    this.texture.needsUpdate = true;
  }

  dispose(): void {
    this.texture.dispose();
  }

  private stampTriangle(into: Uint8Array, ax: number, az: number, bx: number, bz: number, cx: number, cz: number): void {
    const { step, cells } = this;
    const c0 = Math.max(0, Math.floor((Math.min(ax, bx, cx) - DILATE - this.minX) / step));
    const c1 = Math.min(cells - 1, Math.floor((Math.max(ax, bx, cx) + DILATE - this.minX) / step));
    const r0 = Math.max(0, Math.floor((Math.min(az, bz, cz) - DILATE - this.minZ) / step));
    const r1 = Math.min(cells - 1, Math.floor((Math.max(az, bz, cz) + DILATE - this.minZ) / step));
    if (c0 > c1 || r0 > r1) return;
    const area = (bx - ax) * (cz - az) - (bz - az) * (cx - ax);
    for (let row = r0; row <= r1; row++) {
      const z = this.minZ + (row + 0.5) * step;
      for (let col = c0; col <= c1; col++) {
        const at = row * cells + col;
        if (into[at] === 0) continue;
        const x = this.minX + (col + 0.5) * step;
        if (area !== 0) {
          const u = ((bx - ax) * (z - az) - (bz - az) * (x - ax)) / area;
          const v = ((cx - ax) * (z - az) - (cz - az) * (x - ax)) / -area;
          if (u >= 0 && v >= 0 && u + v <= 1) {
            into[at] = 0;
            continue;
          }
        }
        if (
          toSegment(x, z, ax, az, bx, bz) <= DILATE ||
          toSegment(x, z, bx, bz, cx, cz) <= DILATE ||
          toSegment(x, z, cx, cz, ax, az) <= DILATE
        ) {
          into[at] = 0;
        }
      }
    }
  }

  private stampCapsule(into: Uint8Array, ax: number, az: number, bx: number, bz: number, radius: number, soft: number): void {
    const { step, cells } = this;
    const reach = radius + soft;
    const c0 = Math.max(0, Math.floor((Math.min(ax, bx) - reach - this.minX) / step));
    const c1 = Math.min(cells - 1, Math.floor((Math.max(ax, bx) + reach - this.minX) / step));
    const r0 = Math.max(0, Math.floor((Math.min(az, bz) - reach - this.minZ) / step));
    const r1 = Math.min(cells - 1, Math.floor((Math.max(az, bz) + reach - this.minZ) / step));
    for (let row = r0; row <= r1; row++) {
      const z = this.minZ + (row + 0.5) * step;
      for (let col = c0; col <= c1; col++) {
        const at = row * cells + col;
        if (into[at] === 0) continue;
        const d = toSegment(this.minX + (col + 0.5) * step, z, ax, az, bx, bz);
        if (d >= reach) continue;
        const keep = soft > 0 ? Math.min(1, Math.max(0, (d - radius) / soft)) : 0;
        into[at] = Math.min(into[at], Math.round(keep * 255));
      }
    }
  }
}

function toSegment(x: number, z: number, ax: number, az: number, bx: number, bz: number): number {
  const dx = bx - ax;
  const dz = bz - az;
  const lengthSquared = dx * dx + dz * dz;
  const t = lengthSquared === 0 ? 0 : Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / lengthSquared));
  return Math.hypot(x - (ax + dx * t), z - (az + dz * t));
}
