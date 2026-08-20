import * as THREE from 'three';
import type { Columns } from './loft';

/**
 * A quad grid over rows of points given outright — a loft whose rings are
 * whatever the caller made them, in whatever plane. For a surface that is
 * modelled rather than turned: a trunk with a shoulder girdle, a garment
 * fitted over it.
 *
 * Rows are strung in order and every row has the same count. A closed row's
 * columns wrap; the winding matches `loft` — for a row that runs from +X
 * toward −Z about a vertical axis, the outward face is the front. `columns`
 * takes a run of columns for a piece of the surface, exactly as in `loft`;
 * `skip(row, column)` leaves single quads out — a hole cut in the surface.
 */
export type Vec3 = readonly [number, number, number];

export function sheet(
  rows: readonly (readonly Vec3[])[],
  options: { closed?: boolean; caps?: { start?: boolean; end?: boolean }; columns?: Columns; skip?: (row: number, column: number) => boolean } = {},
): THREE.BufferGeometry {
  const closed = options.closed !== false;
  const caps = options.caps ?? { start: false, end: false };
  const n = rows[0].length;
  const positions: number[] = [];
  const indices: number[] = [];
  for (const row of rows) for (const p of row) positions.push(p[0], p[1], p[2]);

  const first = options.columns ? options.columns.from : 0;
  const last = options.columns ? options.columns.to : closed ? n - 1 : n - 2;
  const partial = options.columns !== undefined && last - first + 1 < n;
  for (let s = 0; s < rows.length - 1; s++) {
    const a = s * n;
    const b = (s + 1) * n;
    for (let c = first; c <= last; c++) {
      const i = ((c % n) + n) % n;
      const j = (i + 1) % n;
      if (!closed && j === 0) continue;
      if (options.skip?.(s, i)) continue;
      indices.push(a + i, b + j, b + i, a + i, a + j, b + j);
    }
  }

  const cap = (index: number, flip: boolean): void => {
    const row = rows[index];
    const centre = positions.length / 3;
    let cx = 0;
    let cy = 0;
    let cz = 0;
    for (const p of row) {
      cx += p[0];
      cy += p[1];
      cz += p[2];
    }
    positions.push(cx / n, cy / n, cz / n);
    const ring = index * n;
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      if (flip) indices.push(centre, ring + j, ring + i);
      else indices.push(centre, ring + i, ring + j);
    }
  };
  if (closed && !partial && caps.start) cap(0, true);
  if (closed && !partial && caps.end) cap(rows.length - 1, false);

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}
