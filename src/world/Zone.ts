import * as THREE from 'three';
import type { RoomName } from '../audio/reverb';
import type { SurfaceName } from '../audio/models/footsteps';
import { SILENCE, type SoundscapeSpec } from '../audio/Soundscape';
import type { FogVolume } from '../engine/FogVolumes';
import type { GlitchPlacement } from '../engine/Glitch';
import type { HorrorPlacement } from '../engine/Horror';

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
  /**
   * How hard the wind moves things here, over the weather's own strength.
   * An exposed field blows harder than a sheltered yard. Default 1.
   */
  wind?: number;
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
  /**
   * What this place sounds like when nothing is happening in it.
   *
   * Declared here, next to the fog and the light, because ambience is part of
   * the same statement: those three together are what a zone *is* before any
   * of its geometry is considered. Built on first entry and kept — see
   * `Soundscape`.
   */
  soundscape: SoundscapeSpec;
}

export const OUTDOOR_ENVIRONMENT: ZoneEnvironment = {
  sky: true,
  fogColor: '#bcd4e6',
  fogNear: 25,
  fogFar: 140,
  sunIntensity: 2.2,
  sunColor: 0xfff2d8,
  // **Not zero, though it was.** The argument for zero was that outdoors the
  // sky is the fill and it comes from every direction at once — which is true
  // of the sky and false of a `HemisphereLight`, which is what actually stands
  // in for it. A hemisphere light is a two-lobe gradient sampled by the surface
  // normal, and *every vertical face gets the same value from it* regardless of
  // which way it points. So the two walls of a building the sun reaches were
  // lit and shaped, and the two it misses were flat and dark, with nothing
  // distinguishing them from each other.
  //
  // That is also what made the palette lift look like it had only landed on
  // half of every house: the change was there on all four walls and only
  // legible on the lit two.
  //
  // Aimed from (9, 7, -7) against the sun's (-8, 12, 6), so it takes precisely
  // the faces the sun cannot.
  //
  // **Warm, and not weak.** The first attempt was 0.55 of the sky's own pale
  // blue, on the theory that a fill should stay well under the sun. Both halves
  // were wrong, and together they turned every shaded wall into dirty grey:
  //
  // - *Colour.* Outdoor fill is not the sky, it is light that has bounced off
  //   the ground — which is earth and grass and therefore warm. Lighting brown
  //   timber with a cool blue at low intensity subtracts its own complement out
  //   of the surface, and brown minus blue-ish light is exactly grey.
  // - *Level.* The render pipeline quantizes to a handful of levels per
  //   channel. A wall that lands in the bottom two collapses onto them, the
  //   material colour stops being recoverable, and the dither pattern becomes
  //   the only structure left in it — which is what "sloppy" is describing.
  //   The fix is not a softer curve, it is landing the shaded side high enough
  //   up the ramp that its colour still resolves.
  //
  // It still reads as shade because the sun is 2.2 against this and comes from
  // the other side; what it no longer does is fall off a cliff.
  fillIntensity: 1.15,
  fillColor: 0xe0d6c0,
  // Lifted with it, and for the second reason above. The downward lobe is the
  // bounce off the ground, and vertical faces take roughly the average of the
  // two lobes — so a near-black ground colour was dragging every wall in the
  // game halfway to black before any directional light was added.
  ambientIntensity: 1.8,
  ambientSky: 0x9dc4e8,
  ambientGround: 0x8a7f68,
  room: 'open',
  surface: 'soil',
  footstepReverb: 0.7,
  // Wind and nothing else. A zone that wants trees or a mill declares them;
  // this is only what every outdoor place has in common.
  soundscape: { bed: { model: 'wind', id: 'wind', options: { gain: 0.17, tone: 3400 } } },
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
  // Silent by default, and deliberately so. An interior with a generic hum in
  // it sounds like a menu; one that is genuinely quiet makes the room you came
  // from audible by its absence, which is most of what a threshold is for.
  soundscape: SILENCE,
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
 * Which family of rooms a zone belongs to.
 *
 * The same three the prop halls are split into, and deliberately so: the halls
 * are already the world's answer to "what setting is this", and a second
 * grouping that disagreed with them would be a second answer. `general` is the
 * one with no setting — lettering, air, water, ground, a rack of machinery.
 *
 * Declared on the zone rather than derived from which hall its door happens to
 * stand in. Door topology is a fact about *reachability* and this is a fact
 * about *kind*, and the two only coincide today by luck.
 */
export type ZoneGroup = 'countryside' | 'industrial' | 'general';

/** In the order they are worth reading. Ungrouped zones come before all of them. */
export const ZONE_GROUPS: readonly ZoneGroup[] = ['countryside', 'industrial', 'general'];

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
  /**
   * Which family this belongs to, for anything that lists zones. See
   * `ZoneGroup`. The hub has none, because it is what the families hang off.
   */
  readonly group?: ZoneGroup;
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
  /**
   * Placed fog volumes, in this zone's world space (SHADERS-AND-MATERIALS.md §2).
   *
   * **On the definition rather than in `ZoneEnvironment`, and the reason is
   * positions.** Everything in the environment is a property a place can share
   * with every other place of its kind — which is why `OUTDOOR_ENVIRONMENT`
   * and `INDOOR_ENVIRONMENT` exist and why most zones spread one and override
   * two fields. A volume has a centre and a size, so it cannot be shared by
   * anything: a mist pool declared in a constant that forty zones spread would
   * put the same pool at the same coordinates in all forty. It belongs here,
   * beside `spawn` and `groundAt` — the other facts that are about *this*
   * place's geometry rather than about its kind.
   *
   * Authored data, never scene objects: they are pushed to the fog pass as
   * uniforms on entry, the way the air is. At most eight are live at once.
   */
  readonly fogVolumes?: readonly FogVolume[];
  /**
   * Placed glitch volumes (GLITCH-SHADERS.md), in this zone's world space.
   *
   * On the definition rather than in `ZoneEnvironment` for `fogVolumes`'
   * reason exactly: a volume has coordinates, so it cannot be shared between
   * places. These are the free-standing kind — corruption that belongs to a
   * *spot*. Corruption that belongs to an *object* is declared on the object
   * with `markGlitched` (art/glitch.ts) and collected off the built zone, and
   * it follows the object rather than the place.
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
   * Resolves the build function from its own chunk, for zones whose geometry
   * code should stay out of the boot bundle — written as
   * `() => import('./foo').then((m) => m.build)`, which esbuild and Vite both
   * understand. A definition carries this or `build`. Entry and prebuild await
   * it, and every arrival prefetches the chunks of the zones within the
   * residency ring, so the door click rarely waits on the network.
   */
  readonly load?: () => Promise<() => THREE.Group>;
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
   * Whether anything in this zone is water (SHADERS-AND-MATERIALS.md §7).
   *
   * **Observed rather than declared, unlike `fogVolumes` above**, and the
   * difference is that a fog volume has no geometry while water is nothing but
   * geometry. A `water: true` on the definition would be a second statement
   * about the same fact, and the two would eventually disagree — a pond moved
   * out of a zone leaves a flag behind that costs a whole-scene walk every
   * frame for nothing, and one added without the flag is a pond that never
   * draws. So `waterPlane` marks what it makes and this counts them.
   *
   * Read after `root()` has run, which every entry guarantees. Deliberately
   * does *not* build the zone to answer: asking whether a place has water in it
   * is not a reason to construct the place.
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
    if (this.builder || !this.definition.load) return Promise.resolve();
    this.loading ??= this.definition.load().then(
      (build) => {
        this.builder = build;
      },
      (error: unknown) => {
        this.loading = null;
        throw error;
      },
    );
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
   * Releases the zone's geometry.
   *
   * **Geometry only — materials are deliberately left alone.** The art kit
   * shares two materials — `ART_MATERIAL` and `ART_FINISHED_MATERIAL` — across
   * every mesh it has ever built, and the
   * Proving Ground shares one material per surface family. Disposing a
   * material here would free it out from under every other zone still using
   * it, and the failure would show up as untextured black geometry somewhere
   * else entirely, long after the crossing that caused it. The buffers are
   * where the memory is; a handful of Lambert materials are not.
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
        object.geometry.dispose();
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
