import * as THREE from 'three';
import type { ZoneId, Placement } from './Zone';
import type { DoorMaterial } from '../audio/models/door';

/**
 * Portals: the ways between zones. A portal is one link with two ends, and an
 * end is a place, a way of touching it, and — for a door — a fitting built
 * there. Both markers are derived from their own end by default: an end knows
 * where it is and which way it faces, and in front of it facing out is a
 * rotation and a step, so a marker cannot drift out of alignment with the thing
 * it belongs to. `arrival` overrides that where the derived spot lands
 * somewhere awkward.
 *
 * Doors do not open: using one is a fade and a teleport, and `audio/models/door`
 * carries the gesture with a synthetic swing.
 */

/**
 * What stands at an end and what the crosshair finds there.
 *
 * `door` — the portal builds a door mesh, and the mesh is the target.
 *
 * `prop` — an entry the zone document already placed. The portal adopts it and
 * hangs an invisible box over its extent, which is what makes two ladder rails
 * findable and a hatch in a ceiling usable without the link layer knowing which
 * way up it is.
 *
 * `volume` — nothing stands there. An invisible box that names where it goes
 * from further off than arm's length, and fires when you walk into it.
 *
 * `none` — nothing stands there and nothing can be touched. A one-way link's
 * far end: somewhere to arrive, and no way back.
 */
export type EndUse = 'door' | 'prop' | 'volume' | 'none';

/** A walk-in trigger box. `offset` is in the end's own frame: +Z is the way it faces. */
export interface EndVolume {
  size: readonly [number, number, number];
  offset?: readonly [number, number, number];
  /** Metres the name carries. Defaults to `VOLUME_REACH`. */
  reach?: number;
}

/**
 * What the crosshair says. With no `title` the prompt is one line of `label`,
 * which is what a place-name over the crosshair wants and what a ladder inside
 * one cell wants — "to Countryside Village Demo" is a lie when you are already
 * standing in it.
 */
export interface EndPrompt {
  /** Explicitly `null` for one line, absent for whatever the fitting calls itself. */
  title?: string | null;
  label?: string;
}

/** One side of a portal. */
export interface PortalEnd {
  zone: ZoneId;
  /** Foot of the end — a door mesh stands on this point, a volume is centred over it. */
  position: THREE.Vector3;
  /** Which way the end faces, in radians — out toward whoever is looking. The door builder builds toward +Z, so the facing vector is `(sin yaw, 0, cos yaw)`. */
  yaw: number;
  use?: EndUse;
  /** The entry id this end adopts, for `use: 'prop'`. */
  propOf?: string;
  /** Which half of the adopted entry's extent answers, split in Y. */
  half?: 'lower' | 'upper';
  volume?: EndVolume;
  /** Look and voice. Rolled from the seed if omitted. */
  material?: DoorMaterial;
  /** Seeds the door mesh. Same seed, same door, every load. */
  seed?: number;
  /** Overrides the derived arrival marker. */
  arrival?: Placement;
  /**
   * An entry in this end's own zone whose top the arrival stands on. How high
   * the top of a stack of crates is, is not a number an author has; which crate
   * it is, is. Takes the height only — the rest of `arrival` is untouched.
   */
  landOn?: string;
  prompt?: EndPrompt;
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

/**
 * How far a door leaf stands proud of the wall it hangs in, in metres. One
 * number, here: a room whose door is placed from one figure and whose walls are
 * built from another has its way out inside a wall.
 */
export const DOOR_PROUD = 0.07;

/**
 * How far off a walk-in trigger names itself, in metres. Far enough that the
 * place at the end of the road has a name before you are in the archway, near
 * enough that it is not a caption on the horizon.
 */
export const VOLUME_REACH = 9;

/** Metres the adopted box is grown by, so a crosshair near a ladder rail still lands on it. */
export const PROP_PROXY_GROW = 0.14;

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
    const { position, yaw, exact } = end.arrival;
    return { position: position.clone(), yaw, exact };
  }
  // A standoff only means anything in front of something you walk through. A
  // hatch is walked *over* and a ladder is stood against, so an adopted end
  // with nothing stated lands on its own point rather than a step beyond it.
  if (end.use === 'prop') {
    return { position: end.position.clone(), yaw: end.yaw + Math.PI };
  }
  const facing = doorFacing(end.yaw);
  return {
    position: end.position.clone().addScaledVector(facing, ARRIVAL_STANDOFF),
    yaw: end.yaw + Math.PI,
  };
}

/** A live portal end: its definition, what the crosshair finds, and where it lands you. */
export interface PortalSide {
  readonly portal: string;
  readonly end: PortalEnd;
  /** The end this one leads to. */
  readonly target: PortalEnd;
  /**
   * Where this side lands you. Rewritten once the far end's fitting is built,
   * for the ends that take their landing off what they adopted: how high the
   * top of a ladder is, is not a number an author has.
   */
  arrival: Placement;
  /** Set once this end's target has been built into its zone. */
  node: THREE.Object3D | null;
  /** What the thing is — the prompt's first line, or null for a prompt of one line. Filled in when the node is bound, because a door's kind is rolled from its seed. */
  title: string | null;
  /** Where it goes — the prompt's last line. Resolved against zone names. */
  label: string;
  /** Where a volume end's box stands, in world space. Null for every other kind. */
  trigger: THREE.Box3 | null;
  /**
   * Whether the player was inside that box last frame. A volume fires on the
   * rising edge, so arriving inside one is not a crossing.
   */
  inside: boolean;
}

/**
 * Both sides of every portal, indexed by the zone they stand in. Zones ask which
 * doors are in them when they are built, and the interaction ray asks what a mesh
 * does when it hits one: two queries, two indexes.
 */
export class PortalGraph {
  private readonly byZone = new Map<ZoneId, PortalSide[]>();
  private readonly byNode = new Map<THREE.Object3D, PortalSide>();

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
      node: null,
      title: end.prompt?.title === undefined ? (end.use === 'volume' ? null : 'Door') : end.prompt.title,
      // An end is labelled with where it *goes*, not with where it is. Standing
      // outside a building, the useful thing to be told is the name of the
      // building; standing inside it, the name of the street.
      label: end.prompt?.label ?? nameOf(target.zone),
      trigger: null,
      inside: false,
    };
    const list = this.byZone.get(end.zone);
    if (list) list.push(side);
    else this.byZone.set(end.zone, [side]);
  }

  /** The portal sides standing in a zone. */
  in(zone: ZoneId): readonly PortalSide[] {
    return this.byZone.get(zone) ?? [];
  }

  /** Called once a side's target exists, to make it findable by raycast. */
  bind(side: PortalSide, node: THREE.Object3D, title: string | null): void {
    const stated = side.end.prompt?.title;
    side.node = node;
    side.title = stated === undefined ? title : stated;
    node.userData.portal = side;
    this.byNode.set(node, side);
  }

  /**
   * Says where an end actually lands you, now that what it stands on has been
   * built and measured. Every side leading *to* this end takes it.
   */
  landing(end: PortalEnd, at: Placement): void {
    for (const side of this.all()) {
      if (side.target === end) side.arrival = at;
    }
  }

  /** Where arriving at an end puts you, resolved. Undefined until it is linked. */
  arrivalAt(end: PortalEnd): Placement | undefined {
    return this.all().find((side) => side.target === end)?.arrival;
  }

  /**
   * Forgets a side's node, because the zone holding it has been released.
   * `bind` puts the node into `byNode`, a strong reference held for the life of
   * the session, so a zone torn down and rebuilt would leave its old one in
   * there forever, one per crossing. Idempotent.
   */
  unbind(side: PortalSide): void {
    if (side.node) this.byNode.delete(side.node);
    side.node = null;
    side.trigger = null;
    side.inside = false;
  }

  /** What a raycast hit means, if anything. Walks up to the owning mesh. */
  sideOf(object: THREE.Object3D | null): PortalSide | null {
    let node = object;
    while (node) {
      const side = this.byNode.get(node);
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
