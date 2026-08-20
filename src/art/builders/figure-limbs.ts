import * as THREE from 'three';
import type { Part } from '../assemble';
import { loft } from '../loft';
import { shade } from '../palette';

/**
 * Limb segments: rigid lofts with a joint head above each pivot, and the
 * `Limb` handle their dressing is built against. Cuffs, wraps and garters are
 * bands over the same station arrays the loft used, so a changed elbow or
 * knee profile refits everything wound round it.
 */

export const LIMB_SIDES = 8;

/** A limb profile: (t along the segment, radius) stations. */
export type Stations = readonly (readonly [number, number])[];

/**
 * A limb segment: a loft along the line from `from` to `to`, with a profile
 * given as (t along the segment, radius). `t` may run below zero, which puts
 * a rounded joint head *above* the pivot. `flat` squashes the section across
 * the limb.
 */
export function limb(
  from: THREE.Vector3,
  to: THREE.Vector3,
  stations: Stations,
  flat = 1,
  caps: { start?: boolean; end?: boolean } = { start: true, end: true },
): THREE.BufferGeometry {
  const dir = new THREE.Vector3().subVectors(to, from);
  const length = dir.length();
  const axis = dir.clone().divideScalar(length);
  const at = axis.toArray() as [number, number, number];
  return loft(
    stations.map(([t, r]) => ({
      at: [from.x + axis.x * t * length, from.y + axis.y * t * length, from.z + axis.z * t * length] as [number, number, number],
      rx: r,
      ry: r * flat,
      axis: at,
    })),
    LIMB_SIDES,
    caps,
  );
}

/**
 * A joint head: the stations of a ball of radius `R` about a segment's start
 * pivot, for a segment `length` long, ending at the pivot itself. The segment
 * above must end thinner than `R` — then it is inside the ball whatever the
 * bend, and nothing pokes out or fights the surface.
 */
export function head(R: number, length: number): [number, number][] {
  return [0.95, 0.75, 0.45, 0].map((k) => [(-k * R) / length, R * Math.sqrt(1 - k * k)]);
}

/** Radius of a limb profile at `t`, for wrapping things round it. */
function radiusAt(stations: Stations, t: number): number {
  for (let i = 1; i < stations.length; i++) {
    if (t <= stations[i][0]) {
      const [t0, r0] = stations[i - 1];
      const [t1, r1] = stations[i];
      return r0 + ((r1 - r0) * (t - t0)) / (t1 - t0);
    }
  }
  return stations[stations.length - 1][1];
}

/** The surface of one built segment, which its dressing is wound over. */
export interface Limb {
  /**
   * A point `proud` off the segment's surface. Bearing 0 is the ring's right
   * (world up × axis), π/2 its up — the same basis `loft` gives the rings.
   */
  point(t: number, bearing: number, proud?: number): THREE.Vector3;
  radiusAt(t: number): number;
  /** The nominal limb radius, which cuffs and collars are sized against. */
  r: number;
  bone: string;
  from: THREE.Vector3;
  to: THREE.Vector3;
  /** Which side of the body the segment hangs on: +1 left, −1 right. */
  side: 1 | -1;
  /** The section's squash across the limb, shared by anything wound onto it. */
  flat: number;
}

/** The handle for a segment lofted from these same stations. */
export function makeLimb(
  from: THREE.Vector3,
  to: THREE.Vector3,
  stations: Stations,
  flat: number,
  bone: string,
  side: 1 | -1,
  r: number,
): Limb {
  const length = from.distanceTo(to);
  const axis = new THREE.Vector3().subVectors(to, from).divideScalar(length);
  // The loft's ring basis: right is world up × axis, up closes the frame.
  const right = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), axis);
  if (right.lengthSq() < 1e-6) right.set(1, 0, 0);
  right.normalize();
  const up = new THREE.Vector3().crossVectors(axis, right).normalize();
  return {
    r,
    bone,
    from,
    to,
    side,
    flat,
    radiusAt: (t) => radiusAt(stations, t),
    point(t, bearing, proud = 0) {
      const rr = radiusAt(stations, t) + proud;
      return new THREE.Vector3()
        .copy(from)
        .addScaledVector(axis, t * length)
        .addScaledVector(right, Math.cos(bearing) * rr)
        .addScaledVector(up, Math.sin(bearing) * rr * flat);
    },
  };
}

/** A band standing off the limb: a short loft along it at the limb's own squash. */
export function limbBand(l: Limb, stations: Stations, color: number): Part {
  return { geometry: limb(l.from, l.to, stations, l.flat), color, bone: l.bone };
}

/**
 * A boot: a collar carrying straight on from the trouser leg, and a foot.
 * The collar starts on the *same ring* the shin ended on, with neither piece
 * capped there, so the two are one surface with a colour change at a ring.
 * The foot's rear rings stay inside the collar and it emerges forward only.
 * The collar rides the shin; the foot rides the ankle bone.
 */
export function boot(
  ankle: THREE.Vector3,
  ankleTop: THREE.Vector3,
  cuffR: number,
  legR: number,
  color: number,
  shinBone: string,
  footBone: string,
  hose?: number,
): Part[] {
  // With `hose` given this is a shoe: the collar is the hose down to the
  // ankle, and the foot is low and long, drawn to a point.
  const shoe = hose !== undefined;
  const w = legR * 1.3;
  const h = legR * (shoe ? 1.2 : 1.5);
  const length = legR * (shoe ? 4.4 : 3.7);
  const back = ankle.z - legR * 1.2;

  const collar = limb(
    ankleTop,
    new THREE.Vector3(ankle.x, ankle.y - legR * 0.5, ankle.z),
    shoe
      ? [
          [0, cuffR],
          [0.5, legR * 0.78],
          [1, legR * 0.78],
        ]
      : [
          [0, cuffR],
          [0.3, legR * 1.14],
          [0.6, legR * 1.1],
          [1, legR * 1.0],
        ],
    0.94,
    { start: false, end: true },
  );

  const foot = loft(
    shoe
      ? [
          { at: [ankle.x, h * 0.5, back], rx: w * 0.62, ry: h * 0.5 },
          { at: [ankle.x, h * 0.5, back + length * 0.3], rx: w * 0.94, ry: h * 0.5 },
          { at: [ankle.x, h * 0.42, back + length * 0.56], rx: w * 0.9, ry: h * 0.42 },
          { at: [ankle.x, h * 0.3, back + length * 0.78], rx: w * 0.6, ry: h * 0.3 },
          { at: [ankle.x, h * 0.2, back + length * 0.92], rx: w * 0.3, ry: h * 0.18 },
          { at: [ankle.x, h * 0.16, back + length], rx: w * 0.1, ry: h * 0.1 },
        ]
      : [
          { at: [ankle.x, h * 0.5, back], rx: w * 0.66, ry: h * 0.5 },
          { at: [ankle.x, h * 0.5, back + length * 0.34], rx: w, ry: h * 0.5 },
          { at: [ankle.x, h * 0.45, back + length * 0.66], rx: w * 0.96, ry: h * 0.45 },
          { at: [ankle.x, h * 0.36, back + length * 0.88], rx: w * 0.78, ry: h * 0.36 },
          { at: [ankle.x, h * 0.3, back + length], rx: w * 0.44, ry: h * 0.28 },
        ],
    LIMB_SIDES + 1,
  );

  const strap = new THREE.BoxGeometry(w * (shoe ? 1.9 : 2.06), legR * (shoe ? 0.2 : 0.26), legR * 0.42);
  strap.translate(ankle.x, h * (shoe ? 0.7 : 0.6), back + length * (shoe ? 0.3 : 0.36));

  return [
    { geometry: collar, color: hose ?? color, bone: shinBone },
    { geometry: foot, color, bone: footBone },
    { geometry: strap, color: shoe ? shade(color, 1.3) : shade(color, 0.75), bone: footBone },
  ];
}
