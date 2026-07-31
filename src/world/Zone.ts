import * as THREE from 'three';
import type { RoomName } from '../audio/reverb';
import type { SurfaceName } from '../audio/models/footsteps';

/**
 * A zone is a place: one contiguous piece of world you can walk around in.
 *
 * The exterior is a zone. Every interior is a zone. They never coexist — only
 * one is in the scene and in the collider at a time, which is what keeps a
 * building's inside from being twelve metres from its outside in world space
 * and lets every interior be authored about its own origin.
 *
 * A zone owns its geometry, its light, its air and its acoustics. It does not
 * own the player, the collider or the render pipeline; `ZoneManager` applies a
 * zone's declarations to those.
 *
 * **Definitions are data, runtime state is not.** A `ZoneDefinition` is a
 * description — a name, an environment, and a function that builds geometry.
 * That distinction is what will let Phase 6 or a JSON file produce zones
 * without any of this changing.
 */

export type ZoneId = string;

/**
 * Everything about a zone that is not geometry.
 *
 * Held separately from the render settings on purpose. `RenderSettings` is the
 * *look* — pixel size, dither, palette — and it is tuned once for the whole
 * game and saved as a preset. This is the *place*, and it changes every time
 * you walk through a door. Merging them would mean crossing a threshold
 * silently overwrote a preset the player had dialled in.
 */
export interface ZoneEnvironment {
  /**
   * Whether the sky dome is drawn.
   *
   * Off indoors. A ceiling hides it anyway in most directions, but "most" is
   * not "all", and a strip of blue sky visible through a seam is the single
   * most effective way to make an interior feel like a box sitting in a field.
   */
  sky: boolean;
  /** Fog colour. Indoors this is the darkness at the end of the room. */
  fogColor: string;
  fogNear: number;
  fogFar: number;
  /** Directional light. Interiors want this low and the ambient doing the work. */
  sunIntensity: number;
  sunColor: number;
  /**
   * A second directional light, aimed back the other way.
   *
   * Interiors need this and exteriors mostly do not. One directional light
   * means the walls it faces are lit and the walls behind it get nothing but
   * ambient — in a sealed box that is two walls out of four rendering as
   * very nearly black. Cranking the ambient until they come up flattens
   * everything else in the room, because ambient carries no direction and a
   * flat-shaded box lit only by ambient stops reading as a box at all.
   *
   * A weak opposing light fixes it properly: the dark walls get a direction to
   * catch, and the faces that were already lit barely change.
   */
  fillIntensity: number;
  fillColor: number;
  /** Hemisphere light, and the two colours it blends between. */
  ambientIntensity: number;
  ambientSky: number;
  ambientGround: number;
  /** Which impulse response the reverb crossfades to. */
  room: RoomName;
  /** What the floor is made of, for footsteps. */
  surface: SurfaceName;
  /**
   * How much of your own footsteps feed the room, 0..1.
   *
   * Separate from the room's own wetness, because footfalls are the one sound
   * that happens *at* the listener, and a long tail on something with no
   * distance to it reads as standing in a cave rather than as walking through
   * a hall. A big hard room wants its reverb on everything else and rather
   * less on your boots than the preset would give them.
   */
  footstepReverb: number;
}

export const OUTDOOR_ENVIRONMENT: ZoneEnvironment = {
  sky: true,
  fogColor: '#bcd4e6',
  fogNear: 25,
  fogFar: 140,
  sunIntensity: 2.2,
  sunColor: 0xfff2d8,
  // Outdoors the sky *is* the fill, and it comes from every direction at once.
  fillIntensity: 0,
  fillColor: 0xbcd4e6,
  ambientIntensity: 1.5,
  ambientSky: 0x9dc4e8,
  ambientGround: 0x4c4536,
  room: 'open',
  surface: 'earth',
  footstepReverb: 0.7,
};

/**
 * A sensible interior: no sky, close fog, light from two directions.
 *
 * The sun is not zero, and neither is the fill. Directional light is what stops
 * flat-shaded geometry collapsing indoors — with pure ambient every face of a
 * box returns the same value and the box stops being a box — but *one*
 * directional light leaves the two walls facing away from it near black. Two
 * opposing lights and a generous ambient give every wall something to catch
 * while keeping the faces distinguishable from one another.
 */
export const INDOOR_ENVIRONMENT: ZoneEnvironment = {
  sky: false,
  fogColor: '#0d0f12',
  fogNear: 6,
  fogFar: 34,
  sunIntensity: 1.1,
  sunColor: 0xffe6bc,
  fillIntensity: 0.75,
  fillColor: 0x8fa0b8,
  ambientIntensity: 2.1,
  ambientSky: 0x8a8676,
  ambientGround: 0x4a443a,
  room: 'cell',
  surface: 'wood',
  footstepReverb: 0.5,
};

/**
 * How far above the ground a settled placement is put.
 *
 * Not zero. The player is a capsule, and standing it with its feet exactly on
 * the ground means its lower sphere is tangent to the surface — which on any
 * slope at all is an intersection, because the ground on the uphill side of the
 * contact point is higher than the point itself. The collider then ejects the
 * player sideways out of a hill they were meant to be standing on.
 *
 * A few centimetres of clearance removes the whole problem: they land, gravity
 * takes them down, and the contact resolves the normal way in one frame.
 */
const SETTLE_CLEARANCE = 0.12;

/** Where the player stands, and which way they look. */
export interface Placement {
  position: THREE.Vector3;
  yaw: number;
}

export interface ZoneDefinition {
  readonly id: ZoneId;
  /**
   * What the player is told this place is called.
   *
   * This is the string a door's tooltip shows, so it is read far more often
   * than it is written. Naming is content, not engineering — these are
   * deliberately plain until the fiction says otherwise.
   */
  readonly name: string;
  readonly environment: ZoneEnvironment;
  /** Where you arrive with no portal to derive it from — a fresh boot. */
  readonly spawn: Placement;
  /** Below this the player has fallen out of the world and is put back. */
  readonly floor?: number;
  /**
   * Per-position floor material, overriding `environment.surface`.
   *
   * Interiors have one floor and want the flat value. Anywhere with painted
   * ground cover wants this, or a cobbled path sounds like the grass beside it.
   */
  readonly surfaceAt?: (x: number, z: number) => SurfaceName;
  /**
   * Ground height at a position, for zones whose floor is not level.
   *
   * Portal arrivals are derived by stepping horizontally out from a door, which
   * keeps the door's height — correct on a flat floor and wrong on any slope,
   * where it leaves the player hovering above the ground or standing inside it.
   * A zone that knows the shape of its own ground supplies this and the
   * placement is dropped onto it.
   */
  readonly groundAt?: (x: number, z: number) => number;
  /** Builds the zone's geometry. Called once, lazily, on first entry. */
  build(): THREE.Group;
}

/**
 * A definition plus whatever it built.
 *
 * Geometry is built on first entry and then kept, rather than rebuilt on every
 * crossing. Rebuilding would be defensible — everything is seeded, so it would
 * come back identical — but it would pay the build cost at every threshold and,
 * worse, it would make correct disposal a requirement for basic operation
 * rather than for shutdown. Keeping the group detached costs a few megabytes
 * for a world of this size and makes re-entry free.
 */
export class Zone {
  readonly definition: ZoneDefinition;
  private group: THREE.Group | null = null;

  constructor(definition: ZoneDefinition) {
    this.definition = definition;
  }

  get id(): ZoneId {
    return this.definition.id;
  }

  get name(): string {
    return this.definition.name;
  }

  get environment(): ZoneEnvironment {
    return this.definition.environment;
  }

  get spawn(): Placement {
    return this.definition.spawn;
  }

  get floor(): number {
    return this.definition.floor ?? -20;
  }

  /**
   * Drops a placement onto the zone's ground.
   *
   * A no-op for interiors, which are flat and say nothing about their floor.
   * Used by both the manager and the checks, so the two cannot disagree about
   * where a portal actually puts you.
   */
  settle(placement: Placement): Placement {
    const groundAt = this.definition.groundAt;
    if (!groundAt) return placement;
    const position = placement.position.clone();
    position.y = groundAt(position.x, position.z) + SETTLE_CLEARANCE;
    return { position, yaw: placement.yaw };
  }

  /** Builds on first call, returns the same group after that. */
  root(): THREE.Group {
    if (this.group === null) {
      this.group = this.definition.build();
      this.group.name = `zone:${this.definition.id}`;
      // World matrices have to be current before the collider reads triangles
      // out of the graph, and this subtree has never been rendered.
      this.group.updateWorldMatrix(true, true);
    }
    return this.group;
  }

  /** True once the geometry exists. The check suite uses this to spot churn. */
  get isBuilt(): boolean {
    return this.group !== null;
  }

  /**
   * Releases the zone's geometry.
   *
   * **Geometry only — materials are deliberately left alone.** The art kit
   * shares one `ART_MATERIAL` across every mesh it has ever built, and the
   * Proving Ground shares one material per surface family. Disposing a
   * material here would free it out from under every other zone still using
   * it, and the failure would show up as untextured black geometry somewhere
   * else entirely, long after the crossing that caused it. The buffers are
   * where the memory is; a handful of Lambert materials are not.
   */
  dispose(): void {
    if (this.group === null) return;
    this.group.traverse((object) => {
      if (object instanceof THREE.Mesh || object instanceof THREE.LineSegments) {
        object.geometry.dispose();
      }
    });
    this.group.clear();
    this.group = null;
  }
}
