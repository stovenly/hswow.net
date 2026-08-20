import * as THREE from 'three';
import type { Rng } from './random';

/**
 * A lofted tube: rings of vertices strung along a spine and skinned with quads.
 *
 * The body of every animal and the trunk of every figure is one of these. A
 * loft is what lets a barrel be deeper at the chest than the loin, a neck arch
 * and taper, a chest sit narrower than the hips — the proportions that tell a
 * horse from a cow, which a single stretched primitive cannot carry.
 */

export interface Station {
  /** Ring centre, in the creature's own space. */
  at: readonly [number, number, number];
  /** Half-width (x) and half-height (y) of the ring. */
  rx: number;
  ry: number;
  /**
   * The ring's normal. Defaults to +Z, the spine of a body; a neck says its
   * own direction so its rings stay square to it.
   */
  axis?: readonly [number, number, number];
  /**
   * How boxy the ring is: a superellipse exponent. 2 is an ellipse; higher
   * fills the corners toward a rounded box, which is what a ribcage is.
   */
  n?: number;
}

/**
 * A point on a station's ring at a parameter angle, in the ring's own (right,
 * up) plane. Angle 0 is +right, π/2 is +up.
 */
export function ringPoint(station: Pick<Station, 'rx' | 'ry' | 'n'>, angle: number): [number, number] {
  const k = 2 / (station.n ?? 2);
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return [Math.sign(c) * Math.pow(Math.abs(c), k) * station.rx, Math.sign(s) * Math.pow(Math.abs(s), k) * station.ry];
}

const _axis = new THREE.Vector3();
const _right = new THREE.Vector3();
const _up = new THREE.Vector3();
const _world = new THREE.Vector3(0, 1, 0);

/**
 * A range of columns of a loft, for building one surface out of several
 * pieces that meet exactly.
 *
 * **This is how a colour boundary gets a clean edge.** Colour is per face and
 * a builder cannot tint half a triangle — so a garment's hem or a panel's side
 * cannot be a threshold inside a colour function. A loft quad is two triangles
 * whose centroids sit at a third and two thirds of the ring gap, so any
 * threshold between two rings takes one triangle of each quad and leaves the
 * other: a saw. The fix is not more rings, it is to stop asking. A hem is a
 * *ring* of the loft and a panel's side is a *column* of it, so each coloured
 * region is built as its own geometry over the same stations — sharing exact
 * vertex positions along the seam, and reading as one surface with a straight
 * line drawn on it.
 */
export interface Columns {
  /** First column, inclusive. */
  from: number;
  /** Last column, inclusive. */
  to: number;
}

/**
 * @param sides Vertices per ring. Six is boxy, eight is round enough.
 * @param caps Close the ends with a fan. Off where the end is buried in
 *   another part anyway.
 * @param columns A range of columns, for a piece of a surface — see `Columns`.
 *   Caps are ignored for a partial ring, which is not a closed loop.
 */
export function loft(
  stations: readonly Station[],
  sides: number,
  caps: { start?: boolean; end?: boolean } = { start: true, end: true },
  columns?: Columns,
): THREE.BufferGeometry {
  const positions: number[] = [];
  const indices: number[] = [];

  for (const station of stations) {
    _axis.set(...(station.axis ?? [0, 0, 1])).normalize();
    // Right-hand basis about the axis. A ring perpendicular to +Z has its
    // width along +X and its height along +Y.
    _right.crossVectors(_world, _axis);
    if (_right.lengthSq() < 1e-6) _right.set(1, 0, 0);
    _right.normalize();
    _up.crossVectors(_axis, _right).normalize();
    for (let i = 0; i < sides; i++) {
      // Start on the side rather than at the top, so a boxy ring stands on a
      // flat face and its edges fall at the flanks.
      const angle = (i / sides) * Math.PI * 2 + Math.PI / sides;
      const [cx, cy] = ringPoint(station, angle);
      positions.push(
        station.at[0] + _right.x * cx + _up.x * cy,
        station.at[1] + _right.y * cx + _up.y * cy,
        station.at[2] + _right.z * cx + _up.z * cy,
      );
    }
  }

  // Every column, or the requested run of them. `to` is inclusive and may
  // wrap past `sides`, so a run across the front of a ring is one range.
  const first = columns ? columns.from : 0;
  const last = columns ? columns.to : sides - 1;
  const partial = columns !== undefined && last - first + 1 < sides;
  for (let s = 0; s < stations.length - 1; s++) {
    const a = s * sides;
    const b = (s + 1) * sides;
    for (let c = first; c <= last; c++) {
      const i = ((c % sides) + sides) % sides;
      const j = (i + 1) % sides;
      // Wound so the outward face is the front: with +Z as the spine and the
      // ring counter-clockwise seen from +Z, (a+i, b+j, b+i) faces out —
      // (b_j − a_i) × (b_i − a_i) is the ring's outward radial.
      indices.push(a + i, b + j, b + i, a + i, a + j, b + j);
    }
  }

  const cap = (index: number, flip: boolean): void => {
    const station = stations[index];
    const centre = positions.length / 3;
    positions.push(...station.at);
    const ring = index * sides;
    for (let i = 0; i < sides; i++) {
      const j = (i + 1) % sides;
      if (flip) indices.push(centre, ring + j, ring + i);
      else indices.push(centre, ring + i, ring + j);
    }
  };
  if (!partial && caps.start !== false) cap(0, true);
  if (!partial && caps.end !== false) cap(stations.length - 1, false);

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

/**
 * Pushes every vertex of an indexed geometry in or out along its own radius
 * from the given centre line — a fleece over a body. Indexed, so shared
 * corners move together and the surface stays closed.
 */
export function ruffle(
  geometry: THREE.BufferGeometry,
  rng: Rng,
  low: number,
  high: number,
  centreY: number,
): THREE.BufferGeometry {
  const position = geometry.getAttribute('position');
  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i);
    const y = position.getY(i) - centreY;
    const z = position.getZ(i);
    const k = rng.range(low, high);
    // Radially in the ring's own plane; along the spine the rings keep their
    // spacing, so the loaf gets lumpy without getting longer.
    position.setXYZ(i, x * k, centreY + y * k, z);
  }
  position.needsUpdate = true;
  geometry.computeVertexNormals();
  return geometry;
}
