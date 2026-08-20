import * as THREE from 'three';
import type { ZoneId, Placement } from './Zone';
import type { DoorMaterial } from '../audio/models/door';

/**
 * Portals: the doors between zones. A portal is one link with two ends, and each
 * end is a door and a place to stand in front of it. Both markers are derived from
 * their own door by default — a door knows where it is and which way it faces, and
 * in front of it facing out is a rotation and a step — so a marker cannot drift
 * out of alignment with the door it belongs to. `arrival` overrides that where the
 * derived spot lands somewhere awkward.
 *
 * Doors do not open: using one is a fade and a teleport, and `audio/models/door`
 * carries the gesture with a synthetic swing.
 */

/** One side of a portal. */
export interface PortalEnd {
  zone: ZoneId;
  /** Foot of the door — the door mesh stands on this point. */
  position: THREE.Vector3;
  /** Which way the door faces, in radians — out of the doorway, toward whoever is looking. The door builder builds toward +Z, so the facing vector is `(sin yaw, 0, cos yaw)`. */
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
 * How far in front of the door you arrive, in metres. Has to clear the player's
 * capsule radius plus the door and its frame, or the collider ejects you sideways,
 * and has to stay inside the interaction ray's reach, or you land somewhere you
 * cannot use the door you are standing in front of.
 */
export const ARRIVAL_STANDOFF = 1.15;

/** Unit vector the door faces. */
export function doorFacing(yaw: number, out = new THREE.Vector3()): THREE.Vector3 {
  return out.set(Math.sin(yaw), 0, Math.cos(yaw));
}

/**
 * The arrival marker for an end: in front of its door, facing away from it. The yaw
 * offset is π because the controller's forward vector is `(-sin yaw, 0, -cos yaw)`
 * — the camera looks down −Z at yaw 0, where the door faces +Z.
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
  /** What kind of door this is — the tooltip's first line. Filled in when the mesh is bound, because the kind is rolled from the door's seed. */
  title: string;
  /** Where it goes — the tooltip's last line. Resolved against zone names. */
  label: string;
}

/**
 * Both sides of every portal, indexed by the zone they stand in. Zones ask which
 * doors are in them when they are built, and the interaction ray asks what a mesh
 * does when it hits one: two queries, two indexes.
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
   * `bind` puts the mesh into `byDoor`, a strong reference held for the life of the
   * session, so a zone torn down and rebuilt would leave its old door in there
   * forever, one per crossing. Idempotent.
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
