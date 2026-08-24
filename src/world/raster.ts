/**
 * The sculpted layer of a heightfield: a square grid over the field, sampled
 * bilinearly for height and nearest for the painted tables.
 *
 * Shapes for what is deliberate, rasters for what is sculpted, and the two
 * compose — a landform stays the way to say "a hill here, eighteen metres
 * across", and the brush is how you raise the bank a little where the path
 * meets the lane.
 */

export class Raster<T extends Float32Array | Uint8Array> {
  readonly data: T;
  /** Metres per cell. May be finer than the mesh's own resolution. */
  readonly resolution: number;
  /** Metres across, centred on the origin. */
  readonly size: number;
  /** Cells per side. */
  readonly side: number;

  constructor(data: T, size: number, resolution: number) {
    this.data = data;
    this.size = size;
    this.resolution = resolution;
    this.side = Math.round(Math.sqrt(data.length));
  }

  /** A grid of zeroes, sized to a field. */
  static blank<T extends Float32Array | Uint8Array>(
    make: (length: number) => T,
    size: number,
    resolution: number,
  ): Raster<T> {
    const side = Math.round(size / resolution) + 1;
    return new Raster(make(side * side), size, resolution);
  }

  /** Grid coordinates for a world position. Fractional, and may be out of range. */
  cellOf(x: number, z: number): { col: number; row: number } {
    const half = this.size / 2;
    return { col: (x + half) / this.resolution, row: (z + half) / this.resolution };
  }

  /** World position of a cell's centre. */
  worldOf(col: number, row: number): { x: number; z: number } {
    const half = this.size / 2;
    return { x: col * this.resolution - half, z: row * this.resolution - half };
  }

  at(col: number, row: number): number {
    if (col < 0 || row < 0 || col >= this.side || row >= this.side) return 0;
    return this.data[row * this.side + col];
  }

  set(col: number, row: number, value: number): void {
    if (col < 0 || row < 0 || col >= this.side || row >= this.side) return;
    this.data[row * this.side + col] = value;
  }

  /** Bilinear, for height: a nearest-neighbour heightfield is a staircase. */
  sample(x: number, z: number): number {
    const { col, row } = this.cellOf(x, z);
    const c0 = Math.floor(col);
    const r0 = Math.floor(row);
    const fx = col - c0;
    const fz = row - r0;
    const a = this.at(c0, r0);
    const b = this.at(c0 + 1, r0);
    const c = this.at(c0, r0 + 1);
    const d = this.at(c0 + 1, r0 + 1);
    return a * (1 - fx) * (1 - fz) + b * fx * (1 - fz) + c * (1 - fx) * fz + d * fx * fz;
  }

  /** Nearest, for the painted tables: an index cannot be interpolated. */
  nearest(x: number, z: number): number {
    const { col, row } = this.cellOf(x, z);
    return this.at(Math.round(col), Math.round(row));
  }

  get bytes(): ArrayBuffer {
    return this.data.buffer.slice(
      this.data.byteOffset,
      this.data.byteOffset + this.data.byteLength,
    ) as ArrayBuffer;
  }
}

export type HeightRaster = Raster<Float32Array>;
export type IndexRaster = Raster<Uint8Array>;

export function heightRaster(bytes: ArrayBuffer, size: number, resolution: number): HeightRaster {
  return new Raster(new Float32Array(bytes), size, resolution);
}

export function indexRaster(bytes: ArrayBuffer, size: number, resolution: number): IndexRaster {
  return new Raster(new Uint8Array(bytes), size, resolution);
}
