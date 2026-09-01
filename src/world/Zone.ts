import * as THREE from 'three';
import type { RoomName } from '../audio/reverb';
import type { SurfaceName } from '../audio/models/footsteps';
import { SILENCE, type SoundscapeSpec } from '../audio/Soundscape';
import type { VibeChoice } from '../audio/vibes';
import type { FogVolume } from '../engine/FogVolumes';
import type { GlitchPlacement } from '../engine/Glitch';
import type { HorrorPlacement } from '../engine/Horror';
import type { ZonePlace } from './climate';

/**
 * A zone is a place: one contiguous piece of world you can walk around in. The
 * exterior is a zone and every interior is a zone, and they never coexist — only
 * one is in the scene and in the collider at a time, which is what lets every
 * interior be authored about its own origin.
 *
 * A zone owns its geometry, its light, its air and its acoustics; `ZoneManager`
 * applies those declarations. Definitions are data and runtime state is not.
 */

export type ZoneId = string;

/**
 * Everything about a zone that is not geometry. Held separately from the render
 * settings: those are the look, tuned once and saved as a preset, and this is the
 * place, which changes every time you walk through a door.
 */
export interface ZoneEnvironment {
  /** Whether the sky dome is drawn. Off indoors: a strip of blue visible through a seam is the most effective way to make an interior feel like a box in a field. */
  sky: boolean;
  /** Fog colour. Indoors this is the darkness at the end of the room. */
  fogColor: string;
  fogNear: number;
  fogFar: number;
  /** Directional light. Interiors want this low and the ambient doing the work. */
  sunIntensity: number;
  sunColor: number;
  /**
   * A second directional light, aimed back the other way. One directional light
   * leaves the walls behind it with nothing but ambient, which in a sealed box is
   * two walls out of four rendering as very nearly black — and cranking the ambient
   * flattens everything else, because ambient carries no direction.
   */
  fillIntensity: number;
  fillColor: number;
  /** Hemisphere light, and the two colours it blends between. */
  ambientIntensity: number;
  ambientSky: number;
  ambientGround: number;
  /**
   * How hard the wind moves things here, over the weather's own strength.
   * An exposed field blows harder than a sheltered yard. Default 1.
   */
  wind?: number;
  /**
   * Degrees this zone's +Z is turned from world +Z. Interiors are their own
   * zones authored about their own origin, so nothing otherwise connects a
   * room's north to the building's, and one number here orients every window
   * in it against the sun.
   *
   * Absent is the opt-out: a zone that has not said which way it faces keeps
   * its windows exactly as they were built.
   */
  bearing?: number;
  /** Which impulse response the reverb crossfades to. */
  room: RoomName;
  /** What the floor is made of, for footsteps. */
  surface: SurfaceName;
  /**
   * How much of what happens *at* you feeds the room, 0..1 — footsteps, the
   * door cue, and whatever is added later.
   *
   * Separate from the room's own wetness, because these are the sounds with no
   * distance to derive a send from: every other source gets one from how far
   * off it is, and a first-person gesture is not anywhere. It lives on the bus
   * rather than on each model, so a weapon swing inherits it without anybody
   * having to remember.
   */
  firstPersonReverb: number;
  /**
   * What this place sounds like when nothing is happening in it. Declared here next
   * to the fog and the light, because those three together are what a zone is before
   * any of its geometry is considered. Built on first entry and kept.
   */
  soundscape: SoundscapeSpec;
  /**
   * Which kind of place this is, for the two directors that ask. A bare name
   * takes the vibe's music and its ambience; the object form splits them, and
   * an array of ambience names is a rotation drawn per day.
   *
   * Absent means silent on both counts: every zone stays untouched until it is
   * given a vibe on purpose.
   */
  vibe?: VibeChoice;
}

export const OUTDOOR_ENVIRONMENT: ZoneEnvironment = {
  sky: true,
  fogColor: '#bcd4e6',
  fogNear: 25,
  fogFar: 140,
  sunIntensity: 2.2,
  sunColor: 0xfff2d8,
  // Not zero. Outdoors the sky is the fill, but what stands in for it is a
  // `HemisphereLight` — a two-lobe gradient sampled by the surface normal, which
  // gives every vertical face the same value whichever way it points. So the walls
  // the sun reaches were lit and shaped and the ones it misses were flat and dark.
  //
  // Aimed from (9, 7, -7) against the sun's (-8, 12, 6), so it takes precisely the
  // faces the sun cannot. Warm rather than sky-blue, because outdoor fill is light
  // bounced off earth and grass — lighting brown timber with a cool blue subtracts
  // its own complement and leaves grey — and strong enough that the shaded side
  // lands high enough up the quantizer's ramp for its colour to still resolve.
  fillIntensity: 1.15,
  fillColor: 0xe0d6c0,
  // Lifted with it, and for the second reason above: the downward lobe is the bounce
  // off the ground, and vertical faces take roughly the average of the two lobes.
  ambientIntensity: 1.8,
  ambientSky: 0x9dc4e8,
  ambientGround: 0x8a7f68,
  room: 'open',
  surface: 'soil',
  firstPersonReverb: 0.7,
  // Wind and nothing else. A zone that wants trees or a mill declares them;
  // this is only what every outdoor place has in common.
  soundscape: { bed: { model: 'wind', id: 'wind', options: { gain: 0.17, tone: 3400 } } },
};

/**
 * A sensible interior: no sky, close fog, light from two directions. The sun is not
 * zero and neither is the fill — directional light is what stops flat-shaded
 * geometry collapsing indoors, since with pure ambient every face of a box returns
 * the same value, and one directional light leaves two walls near black.
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
  firstPersonReverb: 0.5,
  // Silent by default, and deliberately so. An interior with a generic hum in
  // it sounds like a menu; one that is genuinely quiet makes the room you came
  // from audible by its absence, which is most of what a threshold is for.
  soundscape: SILENCE,
};

/**
 * How far above the ground a settled placement is put. Not zero: the player is a
 * capsule, and feet exactly on the ground means the lower sphere is tangent to the
 * surface — which on any slope is an intersection, because the ground uphill of the
 * contact point is higher than the point. A few centimetres lets gravity resolve it
 * in one frame.
 */
const SETTLE_CLEARANCE = 0.12;

/** Shared, so the common case of no fog allocates nothing on every crossing. */
const EMPTY_FOG: readonly FogVolume[] = [];
/** The same, for the common case of nothing corrupting. */
const EMPTY_GLITCH: readonly GlitchPlacement[] = [];
/** And the same again, for the common case of nothing haunted. */
const EMPTY_HORROR: readonly HorrorPlacement[] = [];

/** Where the player stands, and which way they look. */
export interface Placement {
  position: THREE.Vector3;
  yaw: number;
}

/**
 * Which family of rooms a zone belongs to — the same three the prop halls are split
 * into, deliberately, since a second grouping that disagreed with them would be a
 * second answer. Declared on the zone rather than derived from which hall its door
 * stands in: door topology is a fact about reachability and this is about kind.
 */
export type ZoneGroup = 'countryside' | 'industrial' | 'general';

/** In the order they are worth reading. Ungrouped zones come before all of them. */
export const ZONE_GROUPS: readonly ZoneGroup[] = ['countryside', 'industrial', 'general'];

export interface ZoneDefinition {
  readonly id: ZoneId;
  /** What the player is told this place is called — the string a door's tooltip shows. Naming is content, so these are deliberately plain until the fiction says otherwise. */
  readonly name: string;
  /**
   * Which family this belongs to, for anything that lists zones. See
   * `ZoneGroup`. The hub has none, because it is what the families hang off.
   */
  readonly group?: ZoneGroup;
  readonly environment: ZoneEnvironment;
  /**
   * Where this place stands on the map, in kilometres. Declaring it is what
   * puts the zone under the world's weather; a zone with no coordinate is held
   * clear, which is what a gallery or a showcase wants — an exhibit in a
   * snowstorm is an exhibit nobody can judge.
   */
  readonly place?: ZonePlace;
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
   * Ground height at a position, for zones whose floor is not level. Portal arrivals
   * are derived by stepping horizontally out from a door, which keeps the door's
   * height — correct on a flat floor and wrong on any slope. A zone that knows the
   * shape of its own ground supplies this and the placement is dropped onto it.
   */
  readonly groundAt?: (x: number, z: number) => number;
  /**
   * Placed fog volumes, in this zone's world space. On the definition rather than in
   * `ZoneEnvironment`, because a volume has a centre and a size and so cannot be
   * shared: a mist pool declared in a constant that forty zones spread would put the
   * same pool at the same coordinates in all forty. It belongs beside `spawn` and
   * `groundAt`, the other facts about this place's geometry rather than its kind.
   * Authored data, pushed to the fog pass as uniforms on entry; eight live at once.
   */
  readonly fogVolumes?: readonly FogVolume[];
  /**
   * Placed glitch volumes, in this zone's world space, on the definition for
   * `fogVolumes`' reason. These are the free-standing kind — corruption that belongs
   * to a spot. Corruption that belongs to an object is declared with `markGlitched`
   * and collected off the built zone, and it follows the object.
   */
  readonly glitches?: readonly GlitchPlacement[];
  /**
   * Placed horror volumes (HORROR-SHADERS.md), in this zone's world space —
   * `glitches`' twin. Object-bound hauntings are declared with `markHaunted`
   * (art/horror.ts) and collected off the built zone instead.
   */
  readonly horrors?: readonly HorrorPlacement[];
  /** Builds the zone's geometry. Called once, lazily, on first entry. */
  readonly build?: () => THREE.Group;
  /**
   * Resolves the build function from its own chunk, for zones whose geometry should
   * stay out of the boot bundle — `() => import('./foo').then((m) => m.build)`. A
   * definition carries this or `build`; entry and prebuild await it, and every
   * arrival prefetches the chunks within the residency ring.
   */
  readonly load?: () => Promise<() => THREE.Group>;
  /**
   * Work the build wants done off the main thread first — a document zone
   * warms its props on the worker pool. Awaited with `load`, and building
   * without it is only slower, never wrong.
   */
  readonly warm?: () => Promise<void>;
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
  /** The build function, once known — from the definition or from `load`. */
  private builder: (() => THREE.Group) | null;
  /** The in-flight `load()`, so concurrent callers share one import. */
  private loading: Promise<void> | null = null;
  /** Set when the zone is built, by looking. See `hasWater`. */
  private water = false;
  /** The same, for the transmissive pass. See `hasGlass`. */
  private glass = false;

  constructor(definition: ZoneDefinition) {
    this.definition = definition;
    this.builder = definition.build?.bind(definition) ?? null;
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

  /** Undefined for every zone that stands outside the weather. See `ZoneDefinition`. */
  get place(): ZonePlace | undefined {
    return this.definition.place;
  }

  /** Empty for every zone that has not placed any. See `ZoneDefinition`. */
  get fogVolumes(): readonly FogVolume[] {
    return this.definition.fogVolumes ?? EMPTY_FOG;
  }

  /** Empty for every zone that has not placed any. See `ZoneDefinition`. */
  get glitches(): readonly GlitchPlacement[] {
    return this.definition.glitches ?? EMPTY_GLITCH;
  }

  /** Empty for every zone that has not placed any. See `ZoneDefinition`. */
  get horrors(): readonly HorrorPlacement[] {
    return this.definition.horrors ?? EMPTY_HORROR;
  }

  /**
   * Whether anything in this zone is water. Observed rather than declared, unlike
   * `fogVolumes`: a fog volume has no geometry while water is nothing but geometry,
   * so a flag on the definition would be a second statement about the same fact and
   * the two would eventually disagree. `waterPlane` marks what it makes and this
   * counts them. Read after `root()` has run, and deliberately does not build the
   * zone to answer.
   */
  get hasWater(): boolean {
    return this.water;
  }

  /**
   * Whether anything in this zone is transmissive (Track B). Observed on the
   * build traversal above, for `hasWater`'s reasons exactly.
   */
  get hasGlass(): boolean {
    return this.glass;
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

  /**
   * Resolves the build function, for zones whose geometry code lives in its
   * own chunk. Instant when the definition carries `build` or the chunk has
   * already arrived. A failed import clears itself, so the entry that actually
   * needs the zone retries rather than inheriting a prefetch's dead promise.
   */
  ensureLoaded(): Promise<void> {
    if (this.builder && !this.definition.warm) return Promise.resolve();
    this.loading ??= (async () => {
      if (!this.builder && this.definition.load) this.builder = await this.definition.load();
      await this.definition.warm?.();
    })().catch((error: unknown) => {
      this.loading = null;
      throw error;
    });
    return this.loading;
  }

  /** Builds on first call, returns the same group after that. */
  root(): THREE.Group {
    if (this.group === null) {
      if (!this.builder) {
        // A programming error, not a race: every path that builds a zone is
        // required to await `ensureLoaded` first.
        throw new Error(`zone "${this.definition.id}" built before its code loaded`);
      }
      this.group = this.builder();
      this.group.name = `zone:${this.definition.id}`;
      // World matrices have to be current before the collider reads triangles
      // out of the graph, and this subtree has never been rendered.
      this.group.updateWorldMatrix(true, true);
      // Once, here, rather than on every crossing: the answer cannot change
      // without the geometry being rebuilt, and this is where that happens.
      this.water = false;
      this.glass = false;
      this.group.traverse((object) => {
        if (object.userData.water === true) this.water = true;
        if (object.userData.glass === true) this.glass = true;
      });
    }
    return this.group;
  }

  /** True once the geometry exists. The check suite uses this to spot churn. */
  get isBuilt(): boolean {
    return this.group !== null;
  }

  /**
   * Releases the zone's geometry — geometry only, because the art kit shares two
   * materials across every mesh it has ever built. Disposing one here would free it
   * out from under every other zone still using it, and the failure would show up
   * as black geometry somewhere else entirely, long after the crossing. The buffers
   * are where the memory is.
   */
  dispose(): void {
    if (this.group === null) return;
    this.group.traverse((object) => {
      // `Points` as well as meshes and lines: the Proving Ground draws some of
      // its fixtures that way, and a geometry missed here is a buffer that
      // survives every release of the zone holding it.
      if (
        object instanceof THREE.Mesh ||
        object instanceof THREE.LineSegments ||
        object instanceof THREE.Points
      ) {
        // A mesh drawing another's geometry in a second pass says so; freeing
        // it here would pull the buffers out from under the owner.
        if (object.userData.borrowedGeometry !== true) object.geometry.dispose();
        // Almost every material in the world is a shared module-level one and
        // must survive this. A per-instance clone says so — see `cloneGlow`.
        for (const material of [object.material].flat()) {
          if (material.userData.owned) material.dispose();
        }
      }
    });
    this.group.clear();
    this.group = null;
    // Recomputed on the next build. Left true, a released zone would have the
    // water pass running in whatever room the player walked into instead.
    this.water = false;
    this.glass = false;
  }
}
