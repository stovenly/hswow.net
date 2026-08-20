import * as THREE from 'three';
import type { Rng } from './random';

/**
 * One tier of conifer branches: a ring of separate boughs, not a cone. The sky
 * between the arms is most of what says conifer, so slots are left empty, and
 * the caller carries an `azimuth` forward to stagger one tier against the one
 * below rather than drawing a fresh angle.
 *
 * A bough is two flattened wedges hinged at a knee, and the wedge is the needle
 * mass rather than a stick: narrow at the leader, widest about a quarter of its
 * own reach across the knee, still a tenth of it at the tip. Only mildly
 * squashed — flat shading gives a part thinner than it is wide one face and no
 * depth, and anything narrower than a chunky block aliases rather than softens.
 *
 * The outer blade starts thinner than the inner one ended, so the two never meet
 * at coincident rings of vertices.
 */
export interface WhorlOptions {
  /** Height on the leader the ring hangs from. */
  y: number;
  /** Nominal reach of a bough. Individual boughs vary a long way either side. */
  radius: number;
  /** How far a tip falls below its attachment, as a fraction of its reach. */
  droop: number;
  /** How many slots the ring is divided into. Some are left empty. */
  slots: number;
  /** Bearing of slot zero. The stagger between one tier and the next lives here. */
  azimuth: number;
  /**
   * Half-width of a bough where it leaves the leader — the woody end, before
   * the needles start. The spray it widens into is sized from the bough's own
   * reach, not from this.
   */
  thickness: number;
  /** Chance a slot is left empty, 0..1 — the sky between the arms. */
  gaps: number;
  /** Height no part of a bough's *surface* may fall below — its depth is allowed for. */
  floor: number;
}

export function whorl(rng: Rng, options: WhorlOptions): THREE.BufferGeometry[] {
  const { y, radius, droop, slots, azimuth, thickness, gaps, floor } = options;
  const pieces: THREE.BufferGeometry[] = [];

  const base = new THREE.Vector3();
  const knee = new THREE.Vector3();
  const tip = new THREE.Vector3();

  for (let s = 0; s < slots; s++) {
    // Sky. A whorl with every slot filled is a disc again, and a spruce that
    // has never lost a branch does not exist.
    if (rng.chance(gaps)) continue;

    // Jittered off the slot, so even a full ring is not a rosette. The jitter
    // is kept under half a slot so two boughs cannot swap places and leave a
    // sixty-degree hole where the eye expects regularity.
    const bearing = azimuth + ((s + rng.around(0, 0.3)) / slots) * Math.PI * 2;
    // **Reach varies hard on purpose.** A clean cone edge is the thing being
    // fixed; the outline wants to be frayed, and a bough two thirds the length
    // of its neighbour is what frays it. The floor is absolute rather than
    // proportional so the topmost tiers still have boughs long enough to build.
    const reach = Math.max(0.1, radius * rng.range(0.66, 1.16));
    const fall = reach * droop * rng.range(0.75, 1.25);

    const cos = Math.cos(bearing);
    const sin = Math.sin(bearing);
    // Started off the axis rather than on it. Boughs all beginning at one
    // coordinate is the standard way to make a mesh that is not closed, and the
    // leader is fat enough to swallow the inset anyway.
    const inset = thickness * 0.8;
    // Where the bough stops being level and starts falling away.
    const bend = rng.range(0.4, 0.6);

    // How much the wedge is squashed against its width, and how far it is rolled
    // off level. Both per bough: a whorl of identically proportioned parts reads
    // as a machine part. A conifer spray is broad across and shallow through, so
    // it is the ratio rather than the size that reads.
    const flat = rng.range(0.26, 0.4);
    const roll = rng.around(0, 0.22);
    // The widest point, at the knee. Sized from the bough's reach so a stunted
    // top-tier arm stays in proportion, and floored on the wood so it can never
    // come out thinner than the branch it is growing on.
    const waist = Math.max(thickness * 1.4, reach * rng.range(0.17, 0.23));

    // The floor holds the surface, not the centreline. A bough is a cushion half
    // a metre deep, so clamping its axis to ground level buries a quarter of it
    // and the ground plane slices the skirt off in a dead straight line. Half the
    // vertical depth is added back, so callers pass the height they mean.
    const clear = floor + waist * flat;

    base.set(cos * inset, y, sin * inset);
    knee.set(
      cos * (inset + reach * bend),
      Math.max(clear, y - fall * rng.range(0.14, 0.3)),
      sin * (inset + reach * bend),
    );
    tip.set(cos * (inset + reach), Math.max(clear, y - fall), sin * (inset + reach));

    pieces.push(blade(base, knee, thickness, waist, flat, roll));
    pieces.push(
      blade(
        knee,
        tip,
        // Narrower than the piece that ended here — see the note above. The step
        // is small enough to read as the mass thinning rather than as a joint.
        waist * 0.88,
        // A point, or very nearly. A real spruce bough narrows steadily and
        // finishes in a fine spray: the mass lives at the knee and runs out.
        Math.max(thickness * 0.55, reach * 0.03),
        flat * rng.range(0.92, 1.08),
        roll + rng.around(0, 0.12),
      ),
    );
  }

  return pieces;
}

/**
 * One tapered wedge of needle mass running from a point to another point. Five
 * sides rather than four, so the faces land asymmetrically and the flat shading
 * gives nearly every one a different tone.
 *
 * Aimed by explicit bearing and pitch rather than by `rod`. `rod` uses the
 * shortest rotation taking +Y to the direction, which for a near-horizontal
 * target leaves the squashed axis lying sideways — a vertical fin instead of a
 * horizontal cushion. Pitch-then-bearing pins the squashed axis to vertical.
 */
function blade(
  from: THREE.Vector3,
  to: THREE.Vector3,
  radiusFrom: number,
  radiusTo: number,
  flat: number,
  roll: number,
): THREE.BufferGeometry {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const dz = to.z - from.z;
  const run = Math.hypot(dx, dz);
  const length = Math.hypot(run, dy);

  // Four-sided rather than five. An odd count rounds the cross-section off; four
  // gives a flat top, a flat underside and two crisp side edges, and the crisp
  // edge is most of what stops it reading as a tube.
  const geometry = new THREE.CylinderGeometry(radiusTo, radiusFrom, length, 4);
  geometry.translate(0, length / 2, 0);
  // Squash the cross-section while it is still axis-aligned. Doing it after the
  // turn would squash the bough's *droop* as well as its thickness.
  geometry.scale(1, 1, flat);
  // Twist about the bough's own axis, then lay it down, then swing it to its
  // bearing. In that order the squashed axis ends up vertical.
  geometry.rotateY(roll);
  geometry.rotateX(Math.PI / 2 + Math.atan2(-dy, run));
  geometry.rotateY(Math.PI / 2 - Math.atan2(dz, dx));
  geometry.translate(from.x, from.y, from.z);
  return geometry;
}
