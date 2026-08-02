import * as THREE from 'three';
import type { ZoneId, Placement } from './Zone';
import type { DoorMaterial } from '../audio/models/door';

/**
 * Portals: the doors between zones.
 *
 * A portal is one link with **two ends**, and each end is two things — a door
 * and a place to stand in front of it. So four objects in the world per portal:
 * the door on the outside, the door on the inside, and the arrival marker in
 * front of each. Using one end puts you at the other end's marker.
 *
 * Both markers are *derived from their own door* by default. A door knows where
 * it is and which way it faces, and "in front of it, facing out of it" is a
 * rotation and a step — so authoring a portal is normally two placements
 * rather than four, and the marker cannot drift out of alignment with the door
 * it belongs to because it is not stored separately. `arrival` overrides it for
 * the cases where the derived spot lands somewhere awkward — a step, a corner,
 * the wrong side of a pillar.
 *
 * Doors do not open. There is no swing, no animation and no hinge axis: using
 * one is a fade and a teleport. The sound carries the gesture instead, which
 * `audio/models/door` does with a synthetic swing trajectory.
 */

/** One side of a portal. */
export interface PortalEnd {
  zone: ZoneId;
  /** Foot of the door — the door mesh stands on this point. */
  position: THREE.Vector3;
  /**
   * Which way the door faces, in radians.
   *
   * "Faces" means out of the doorway, toward whoever is looking at it. The
   * door builder builds toward +Z, so this is a plain rotation about Y and the
   * facing vector is `(sin yaw, 0, cos yaw)`.
   */
  yaw: number;
  /** Look and voice. Rolled from the seed if omitted. */
  material?: DoorMaterial;
  /** Seeds the door mesh. Same seed, same door, every load. */
  seed?: number;
  /** Overrides the derived arrival marker. */
  arrival?: Placement;
  /** Overrides the tooltip. Defaults to the name of the zone it leads to. */
  label?: string;
}

export interface PortalDefinition {
  readonly id: string;
  readonly a: PortalEnd;
  readonly b: PortalEnd;
}

/**
 * How far in front of the door you arrive, in metres.
 *
 * Has to clear the player's capsule radius plus the thickness of the door and
 * its frame, or you arrive intersecting the thing you just came through and
 * the collider ejects you sideways. It also has to stay inside the reach of
 * the interaction ray, or you would land somewhere you cannot use the door you
 * are standing in front of — which is how a one-way trip happens.
 */
export const ARRIVAL_STANDOFF = 1.15;

/** Unit vector the door faces. */
export function doorFacing(yaw: number, out = new THREE.Vector3()): THREE.Vector3 {
  return out.set(Math.sin(yaw), 0, Math.cos(yaw));
}

/**
 * The arrival marker for an end: in front of its door, facing away from it.
 *
 * The yaw offset is π because the controller's forward vector is
 * `(-sin yaw, 0, -cos yaw)` — the camera looks down -Z at yaw 0, where the
 * door faces +Z. Arriving facing the door you just came through would be
 * correct for a door you had opened and stepped through backwards, and wrong
 * for every other reading of the gesture.
 */
export function arrivalFor(end: PortalEnd): Placement {
  if (end.arrival) {
    return { position: end.arrival.position.clone(), yaw: end.arrival.yaw };
  }
  const facing = doorFacing(end.yaw);
  return {
    position: end.position.clone().addScaledVector(facing, ARRIVAL_STANDOFF),
    yaw: end.yaw + Math.PI,
  };
}

/** A live portal end: its definition, its door mesh, and where it lands you. */
export interface PortalSide {
  readonly portal: string;
  readonly end: PortalEnd;
  /** The end this one leads to. */
  readonly target: PortalEnd;
  readonly arrival: Placement;
  /** Set once the door mesh has been built into its zone. */
  door: THREE.Mesh | null;
  /**
   * What kind of door this is — the tooltip's first line.
   *
   * Filled in when the mesh is bound, because the kind is rolled from the
   * door's seed and is not knowable before it has been built.
   */
  title: string;
  /** Where it goes — the tooltip's last line. Resolved against zone names. */
  label: string;
}

/**
 * Both sides of every portal, indexed by the zone they stand in.
 *
 * Zones ask "which doors are in me?" when they are built, and the interaction
 * ray asks "what does this mesh do?" when it hits something. Those are the two
 * queries, so those are the two indexes.
 */
export class PortalGraph {
  private readonly byZone = new Map<ZoneId, PortalSide[]>();
  private readonly byDoor = new Map<THREE.Object3D, PortalSide>();

  /**
   * @param nameOf Resolves a zone id to its display name, for default labels.
   */
  add(portal: PortalDefinition, nameOf: (id: ZoneId) => string): void {
    this.addSide(portal.id, portal.a, portal.b, nameOf);
    this.addSide(portal.id, portal.b, portal.a, nameOf);
  }

  private addSide(
    id: string,
    end: PortalEnd,
    target: PortalEnd,
    nameOf: (zone: ZoneId) => string,
  ): void {
    const side: PortalSide = {
      portal: id,
      end,
      target,
      arrival: arrivalFor(target),
      door: null,
      title: 'Door',
      // A door is labelled with where it *goes*, not with where it is. Standing
      // outside a building, the useful thing to be told is the name of the
      // building; standing inside it, the name of the street.
      label: end.label ?? nameOf(target.zone),
    };
    const list = this.byZone.get(end.zone);
    if (list) list.push(side);
    else this.byZone.set(end.zone, [side]);
  }

  /** The portal sides standing in a zone. */
  in(zone: ZoneId): readonly PortalSide[] {
    return this.byZone.get(zone) ?? [];
  }

  /** Called once a side's door mesh exists, to make it findable by raycast. */
  bind(side: PortalSide, door: THREE.Mesh, title: string): void {
    side.door = door;
    side.title = title;
    door.userData.portal = side;
    this.byDoor.set(door, side);
  }

  /**
   * Forgets a side's door mesh, because the zone holding it has been released.
   *
   * **The lookup table is the reason this has to exist.** `bind` puts the mesh
   * into `byDoor`, which is a strong reference held by the graph for the life
   * of the session — so a zone that is torn down and rebuilt would leave its
   * old door in there forever, one per crossing, each keeping a disposed
   * geometry's wrapper alive. That is a leak whose whole symptom is a number
   * climbing slowly in a heap profile, which is exactly the kind nobody finds.
   *
   * Idempotent, so releasing a zone whose doors were never built is fine.
   */
  unbind(side: PortalSide): void {
    if (side.door) this.byDoor.delete(side.door);
    side.door = null;
  }

  /** What a raycast hit means, if anything. Walks up to the owning mesh. */
  sideOf(object: THREE.Object3D | null): PortalSide | null {
    let node = object;
    while (node) {
      const side = this.byDoor.get(node);
      if (side) return side;
      node = node.parent;
    }
    return null;
  }

  /** Every side, for the checks. */
  all(): PortalSide[] {
    return [...this.byZone.values()].flat();
  }
}
