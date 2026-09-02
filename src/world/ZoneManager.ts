import * as THREE from 'three';
import { partitionStatic } from '../engine/statics';
import { cacheKey } from '../engine/work/cache';
import { SETTLE_CLEARANCE, Zone, type ZoneDefinition, type ZoneId, type Placement } from './Zone';
import {
  PortalGraph,
  PROP_PROXY_GROW,
  arrivalFor,
  type EndVolume,
  type PortalDefinition,
  type PortalEnd,
  type PortalSide,
} from './Portal';
import { residentZones, KEEP_WITHIN } from './residency';
import {
  carriedOf,
  labelOf,
  npcOf,
  type ContainerInfo,
  type Interaction,
  type NpcMark,
  type PickupInfo,
} from './Interaction';
import { isReadable } from './items';
import { noteById, type Note } from './notes';
import { buildDoor, doorMetrics, doorName } from '../art/door';
import { builderByName } from '../art/registry';
import { coverFor } from '../art/cover';
import { buildZoneSparkles } from '../art/sparkle';
import { setZoneWind } from '../art/sway';
import { setGlitchVolumes } from '../art/glitch';
import { setHorrorVolumes } from '../art/horror';
import { LightActivity } from '../engine/LightActivity';
import { WindowLight } from '../engine/WindowLight';
import type { Daylight } from '../engine/daylight';
import { ClothActivity } from '../engine/ClothActivity';
import { LifeActivity } from '../engine/LifeActivity';
import type { Creature } from '../life/Creature';
import { GlitchActivity } from '../engine/GlitchActivity';
import { HorrorActivity } from '../engine/HorrorActivity';
import type { Weather } from '../audio/weather';
import { COLLISION_LAYER, HELD_LAYER, PARTICLE_LAYER } from '../layers';
import { markCollidable, type Collider } from '../player/Collider';
import { VistaParallax } from './vista-parallax';
import { loadingScreen } from '../ui/LoadingScreen';
import type { Controller } from '../player/Controller';
import type { PostFX } from '../engine/PostFX';
import type { AudioEngine } from '../audio/AudioEngine';
import type { Footsteps, SurfaceName } from '../audio/models/footsteps';
import { DoorAudio } from '../audio/models/door';
import { Soundscape } from '../audio/Soundscape';
import { MusicDirector } from '../audio/music/director';
import { musicFor } from '../audio/vibes';
import { AmbienceDirector } from '../audio/ambience/director';
import { linkPrompt } from '../ui/Reticle';
import type { Reticle, Fade } from '../ui/Reticle';

// Owns which place you are in. Exactly one zone is in the scene and in the
// collider at any moment; crossing a threshold swaps both, pushes the new air
// and acoustics out and drops the player on the arrival marker, all at full
// black in one frame. The three world lights live here, not in any zone.

/** A `Layers` to test a mesh against, so the particle gate is one call. */
/**
 * Metres the sun light stands out along its own direction. It is where the
 * orthographic shadow camera sits, so it has to clear the scene and stay inside
 * the camera's near and far.
 */
const SUN_DISTANCE = 140;

/**
 * Degrees below which the shadow box stops being usable. The light is held here
 * and the shadow ramped out rather than the box widened.
 */
const SHADOW_FLOOR = 8;

/**
 * How dark a shadow gets at full strength, 0..1. Not full: the sun is only part
 * of the light here, and the pipeline quantizes, so a dark shadow drives
 * everything under it onto the bottom level.
 */
const SHADOW_DEPTH = 0.34;

/** What the atmosphere hands the rig each frame. See `engine/atmosphere.ts`. */
export interface LightRig {
  sunScale: number;
  sunColour: THREE.Color;
  fillScale: number;
  fillColour: THREE.Color;
  ambientScale: number;
  ambientSky: THREE.Color;
  ambientGround: THREE.Color;
}

const PARTICLE_MASK = new THREE.Layers();
PARTICLE_MASK.set(PARTICLE_LAYER);

/** The same, for spotting collision geometry. See `showBarriers`. */
const COLLISION_MASK = new THREE.Layers();
COLLISION_MASK.set(COLLISION_LAYER);

/** Unlit, translucent and writing no depth, so overlapping slabs read as overlapping and the world behind stays legible. */
const BARRIER_MATERIAL = new THREE.MeshBasicMaterial({
  color: 0xff5a3c,
  transparent: true,
  opacity: 0.22,
  depthWrite: false,
  side: THREE.DoubleSide,
});

/** Shows or hides one piece of collision that is never drawn. The mesh's own material is put back, because several colliders share one. */
function revealBarrier(mesh: THREE.Mesh, shown: boolean): void {
  if (shown) {
    mesh.userData.hiddenMaterial ??= mesh.material;
    mesh.material = BARRIER_MATERIAL;
    mesh.visible = true;
    return;
  }
  const original = mesh.userData.hiddenMaterial as THREE.Material | THREE.Material[] | undefined;
  if (original) mesh.material = original;
  mesh.visible = false;
}

/**
 * Composes every matrix in a finished zone once, and stops three composing them
 * again every frame. Anything already off is left alone: a builder that turned
 * it off wrote its own matrix. `LightActivity` turns the flames' back on.
 */
/**
 * Frees one subtree's buffers. Materials are shared across the whole kit and
 * must survive — a per-instance clone says so with `userData.owned`.
 */
function releaseSubtree(root: THREE.Object3D): void {
  root.traverse((object) => {
    if (
      object instanceof THREE.Mesh ||
      object instanceof THREE.LineSegments ||
      object instanceof THREE.Points
    ) {
      if (object.userData.borrowedGeometry !== true) object.geometry.dispose();
      for (const material of [object.material].flat()) {
        if (material.userData.owned) material.dispose();
      }
    }
  });
  root.clear();
}

function freezeMatrices(root: THREE.Object3D): void {
  root.traverse((object) => {
    if (!object.matrixAutoUpdate) return;
    object.updateMatrix();
    object.matrixAutoUpdate = false;
  });
}

/** What pressing the interact key would act on. A union, because a door moves you, a readable opens a page, and an item or container belongs to the item systems. */
export type Focus =
  | { readonly kind: 'door'; readonly side: PortalSide }
  | { readonly kind: 'read'; readonly note: Note; readonly object: THREE.Object3D }
  | { readonly kind: 'item'; readonly object: THREE.Object3D; readonly pickup: PickupInfo }
  | { readonly kind: 'talk'; readonly object: THREE.Object3D; readonly npc: NpcMark }
  | {
      readonly kind: 'container';
      readonly object: THREE.Object3D;
      readonly container: ContainerInfo;
    };

export interface ZoneManagerOptions {
  scene: THREE.Scene;
  collider: Collider;
  player: Controller;
  postfx: PostFX;
  interaction: Interaction;
  reticle: Reticle;
  fade: Fade;
}

/** Attached once the audio context has finished rendering its noise and IRs. */
export interface ZoneAudio {
  engine: AudioEngine;
  footsteps: Footsteps;
}

// three keys its program cache on per-type light counts, so every distinct
// census is a full shader recompile. Zones pad up to these tiers.
const POINT_TIERS = [0, 4, 8] as const;
const SPOT_TIERS = [0, 2] as const;

/** How often what is under the crosshair is re-tested, in seconds. At walking pace nothing crosses the crosshair in under fifty milliseconds. */
const PROBE_INTERVAL = 1 / 18;

/**
 * Footfalls heard leaving through something with nothing to open — a gap in a
 * wall at the end of a road. Seconds between them, and the tail of the last
 * one, so the black can be held for exactly as long as they take.
 */
const WALK_AWAY_STEPS = 4;
const WALK_AWAY_SPACING = 0.34;
const WALK_AWAY_TAIL = 0.35;

/** Where the camera is looking, refilled each life update. */
const _gaze = new THREE.Vector3();

/** The cursor, for `cursorLabel`. */
const _ndc = new THREE.Vector2();

/** What a volume end falls back to when it states no box, in metres. */
const DEFAULT_VOLUME: EndVolume = { size: [2, 2.4, 2] };

const UP = new THREE.Vector3(0, 1, 0);

/** Shared, and never drawn: a proxy is invisible, and one default material per box would leak one per zone build. */
const PROXY_MATERIAL = new THREE.MeshBasicMaterial();
const _box = new THREE.Box3();
const _centre = new THREE.Vector3();
const _size = new THREE.Vector3();

export class ZoneManager {
  readonly zones = new Map<ZoneId, Zone>();
  readonly portals = new PortalGraph();

  /** Driven from the active zone's environment; exposed for the tuning panel. */
  readonly lights: {
    sun: THREE.DirectionalLight;
    /** Opposing the sun, so the walls it cannot reach are not black. */
    fill: THREE.DirectionalLight;
    ambient: THREE.HemisphereLight;
  };

  private readonly options: ZoneManagerOptions;
  private audio: ZoneAudio | null = null;
  private doorAudio: DoorAudio | null = null;
  /** One director for the whole world: a piece outlives any single zone, and the drone retunes across a border rather than restarting. */
  private director: MusicDirector | null = null;
  /** One director for the ambience too, for the same reason: it crosses borders. */
  private air: AmbienceDirector | null = null;

  /** One soundscape per zone that has been entered, kept for the session. Built lazily on first entry and never rebuilt. */
  private readonly soundscapes = new Map<ZoneId, Soundscape>();
  /** Zones whose geometry has been built *and* indexed for collision. A zone can be prebuilt without ever being entered. */
  private readonly warmed = new Set<ZoneId>();
  /** Finish masks with a program compiled against the named zone's census. Keyed `zone:mask`. */
  private readonly warmFinish = new Map<string, { done: boolean; wait: Promise<void> }>();
  /** Guards against a second `enter` arriving mid-transition. See `enter`. */
  private entering = 0;
  private readonly loading = loadingScreen();
  /** Whether a frame has been drawn with a zone standing in the scene. See the prewarm in `enter`. */
  private drawn = false;

  private active: Zone | null = null;
  /** The zone the player stepped out of, kept resident so pacing in a doorway is free. */
  private cameFrom: ZoneId | null = null;
  /** Zones whose portal doors have been built into them. */
  private doored = new Set<ZoneId>();
  /** Preparations still running, so two callers share one. See `prepare`. */
  private readonly preparing = new Map<ZoneId, Promise<THREE.Group>>();
  /** The clutter in each built zone, collected while it was prepared rather than searched for each frame. */
  private readonly clutter = new Map<ZoneId, THREE.Mesh[]>();
  /** Parallax controllers per zone, collected on prepare. See `slideVista`. */
  private readonly parallax = new Map<ZoneId, VistaParallax[]>();
  /** Collision geometry that is never drawn, per zone. See `showBarriers`. */
  private readonly barriers = new Map<ZoneId, THREE.Mesh[]>();
  /** Lights a builder asked to cast, per zone. See `setShadows`. */
  private readonly casters = new Map<ZoneId, THREE.Light[]>();
  /** What the render preset last said. A zone built later has to arrive at it. */
  private shadowed = false;
  private barriersShown = false;
  /** Holds every moving vista prop where it was placed. Session-only inspection state. */
  freezeVista = false;

  /**
   * Draws the collision the player can hit but never see — a stair's ramp, a
   * level's boundary plane. Session-only inspection state, like `freezeVista`.
   */
  get showBarriers(): boolean {
    return this.barriersShown;
  }

  set showBarriers(shown: boolean) {
    if (shown === this.barriersShown) return;
    this.barriersShown = shown;
    for (const list of this.barriers.values()) {
      for (const mesh of list) revealBarrier(mesh, shown);
    }
  }
  /** Whether anything is currently hidden, so the default path stays free. */
  private clutterHidden = false;
  /** Built zones with anything on the particle layer in them, which is what decides whether the particle pass runs. */
  private readonly particled = new Set<ZoneId>();
  /** Every flame in every built zone, and what it is doing. See `LightActivity`. */
  private readonly activity = new LightActivity();
  /** Every window in every built zone that states a bearing. See `WindowLight`. */
  private readonly windows = new WindowLight();
  /** Every simulated cloth in every built zone. See `ClothActivity`. */
  private readonly cloth = new ClothActivity();
  private readonly life = new LifeActivity();
  /** Every glitch volume in every built zone. See `GlitchActivity`. */
  private readonly glitch = new GlitchActivity();
  /** Every horror volume in every built zone. See `HorrorActivity`. */
  private readonly horror = new HorrorActivity();
  private transitioning = false;
  private hovered: PortalSide | null = null;
  /** What the last probe found, held between probes. See `update`. */
  private focus: Focus | null = null;
  /** When that probe ran, on the frame loop's own clock. */
  private probed = -Infinity;

  /** Counts crossings, for the readout. */
  crossings = 0;

  /** Fired after every entry, including the first: how systems that are not zone-owned find out where they are. */
  onZoneChange: ((zone: Zone) => void) | null = null;

  /** Fired once per build of a zone, after dressing, with the finished root — where the item systems mark and correct what was built. */
  onDressed: ((zone: Zone, root: THREE.Group) => void) | null = null;

  /** Fired as a zone's geometry goes, for anything holding a picture of it. */
  onZoneRelease: ((id: ZoneId) => void) | null = null;

  constructor(options: ZoneManagerOptions) {
    this.options = options;

    this.lights = {
      sun: new THREE.DirectionalLight(0xfff2d8, 2.2),
      fill: new THREE.DirectionalLight(0x8fa0b8, 0),
      ambient: new THREE.HemisphereLight(0x9dc4e8, 0x4c4536, 1.5),
    };
    // A direction, not a place: inside a zone's group its angle would change
    // with the zone. About 45° up and well round to one side, mid-morning. Set
    // far out along that direction, because a directional light's position is
    // where the shadow camera stands — at 25 units half the world falls behind it.
    this.lights.sun.position.set(-70, 90, 50).setLength(SUN_DISTANCE);

    // Shadow setup, applied once; whether it is used is `setShadows`. A
    // directional light's shadow camera is orthographic and has to be sized by
    // hand — three's 10 m default stops everything past a few paces casting.
    const shadow = this.lights.sun.shadow;
    // Texels rather than bias: at 2048 over 96 m one texel is 4.6 cm, then
    // resampled to the chunky frame.
    shadow.mapSize.set(2048, 2048);
    const extent = 48;
    shadow.camera.left = -extent;
    shadow.camera.right = extent;
    shadow.camera.top = extent;
    shadow.camera.bottom = -extent;
    // Tight around the scene. Depth precision, and so how little bias is needed,
    // depends on this range rather than on the map resolution.
    shadow.camera.near = 55;
    shadow.camera.far = 225;
    shadow.bias = -0.00008;
    // `normalBias` grows the shadow-free margin around every silhouette, which
    // is the bright seam between a thing and its own shadow. Small enough to hide.
    shadow.normalBias = 0.012;
    // How dark a shadow gets, 0..1. Not full strength: the sun is only part of
    // the light here, and the pipeline quantizes, so a dark shadow drives
    // everything under it onto the bottom level.
    shadow.intensity = SHADOW_DEPTH;
    // Opposed to the key and above it. `aimKeyLight` moves it every frame; this
    // is only where it stands before the clock has run once.
    this.lights.fill.position.set(9, 7, -7);
    // The three world lights are the scene's, not a zone's, so `prepare`'s walk
    // never reaches them.
    for (const light of [this.lights.sun, this.lights.fill, this.lights.ambient]) {
      light.layers.enable(PARTICLE_LAYER);
      light.layers.enable(HELD_LAYER);
    }
    options.scene.add(this.lights.sun, this.lights.fill, this.lights.ambient);
  }

  /** Which way the sun shines, normalised and pointing toward it — a directional light arrives from its position. */
  get sunDirection(): THREE.Vector3 {
    return this.lights.sun.position;
  }

  /**
   * Points the key light and travels the shadow box with it. The light's
   * position is where the orthographic shadow camera stands, so keeping it at a
   * fixed distance along the direction leaves near and far correct at every
   * hour instead of growing the box as the sun drops.
   *
   * Below the clamp the geometry stops working — a box wide enough for a shadow
   * cast from two degrees is a box with no texels left — so the light is held at
   * the clamp and the shadow is ramped out instead of stretched.
   */
  aimKeyLight(direction: THREE.Vector3, shadow: number): void {
    const flat = Math.hypot(direction.x, direction.z);
    const elevation = (Math.atan2(direction.y, flat) * 180) / Math.PI;
    const sun = this.lights.sun;
    if (elevation < SHADOW_FLOOR && flat > 1e-4) {
      const lift = Math.tan((SHADOW_FLOOR * Math.PI) / 180) * flat;
      sun.position.set(direction.x, lift, direction.z);
    } else {
      sun.position.copy(direction);
    }
    sun.position.normalize().multiplyScalar(SUN_DISTANCE);
    const fade = Math.max(0, Math.min(1, (elevation - SHADOW_FLOOR + 4) / 6));
    sun.shadow.intensity = SHADOW_DEPTH * shadow * fade * fade * (3 - 2 * fade * fade);

    // The fill stands opposite the key and above it, and has to travel with it:
    // its whole job is taking the faces the key cannot, and a fixed one ends up
    // on the same side of the world twice a day doing nothing.
    this.lights.fill.position
      .set(-direction.x, Math.abs(direction.y) * 0.5 + 0.55, -direction.z)
      .normalize()
      .multiplyScalar(60);
  }

  /**
   * Points the fill somewhere else for a frame. `aimKeyLight` puts it back
   * opposite the key on the next one, so this needs no releasing.
   */
  aimFill(direction: THREE.Vector3): void {
    this.lights.fill.position.copy(direction).normalize().multiplyScalar(60);
  }

  /**
   * The atmosphere over the zone's own declaration. The zone says how bright
   * this place is relative to open daylight; the atmosphere says what open
   * daylight currently is.
   *
   * `indoors` is what a room's base light is worth at this hour, 0..1. A room
   * gets that and nothing else: its base light exists to make the place
   * visible, and a directional light doing that job is a sun the room cannot
   * see — it swings a bright wall across the floor as the clock moves and
   * agrees with nothing coming through the window. What has direction in here
   * is the windows and the lamps.
   */
  applyLightRig(rig: LightRig, indoors: number): void {
    const env = this.current?.environment;
    if (!env) return;
    if (!env.sky) {
      this.lights.sun.intensity = 0;
      this.lights.fill.intensity = 0;
      this.lights.ambient.intensity = env.ambientIntensity * indoors;
      return;
    }
    this.lights.sun.intensity = env.sunIntensity * rig.sunScale;
    this.lights.sun.color.copy(rig.sunColour);
    this.lights.fill.intensity = env.fillIntensity * rig.fillScale;
    this.lights.fill.color.copy(rig.fillColour);
    this.lights.ambient.intensity = env.ambientIntensity * rig.ambientScale;
    this.lights.ambient.color.copy(rig.ambientSky);
    this.lights.ambient.groundColor.copy(rig.ambientGround);
  }

  /** Turns cast shadows on or off for the whole game. Shadows are a look, and belong with the render preset rather than with a place. */
  setShadows(enabled: boolean): void {
    this.shadowed = enabled;
    const sun = this.lights.sun;
    sun.castShadow = enabled;
    // Three allocates the shadow map on first use and never gives it back: over
    // a hundred megabytes resident for a setting that is switched off.
    if (!enabled) sun.shadow.dispose();
    // And the flames a placer asked to cast. A point light's is a cube of six,
    // so the same argument applies harder.
    for (const lights of this.casters.values()) {
      for (const light of lights) {
        light.castShadow = enabled;
        if (!enabled) light.shadow?.dispose();
      }
    }
  }

  register(definition: ZoneDefinition): Zone {
    const zone = new Zone(definition);
    this.zones.set(zone.id, zone);
    return zone;
  }

  /** Links two ends. Both zones must already be registered, so a broken portal fails at startup rather than when somebody opens it. */
  link(portal: PortalDefinition): void {
    for (const end of [portal.a, portal.b]) {
      if (!this.zones.has(end.zone)) {
        throw new Error(`portal ${portal.id} refers to unknown zone "${end.zone}"`);
      }
    }
    this.portals.add(portal, (id) => this.zones.get(id)?.name ?? id);
  }

  /** Builds a zone's geometry and collision ahead of time, for the loading screen. */
  async prebuild(id: ZoneId): Promise<void> {
    const zone = this.zones.get(id);
    if (!zone) return;
    await zone.ensureLoaded();
    const root = await this.prepare(zone);
    root.updateWorldMatrix(true, true);
    await this.options.collider.warmAsync(root, zone.id, false, cacheKey(zone.id, 'collision', zone.fingerprint));
    // Prebuilding pays the cost up front, so entering later takes the silent path.
    this.warmed.add(zone.id);
  }

  /** Compiles a zone's shader programs ahead of entry. Safe to fire unawaited: parallel compile runs on driver threads. */
  async precompile(id: ZoneId): Promise<void> {
    const zone = this.zones.get(id);
    if (!zone) return;
    await zone.ensureLoaded();
    const root = await this.prepare(zone);
    await this.compile(root);
    this.markWarm(id, root);
  }

  /** Marks every finish mask under `root` as having a program compiled for `id`. */
  private markWarm(id: ZoneId, root: THREE.Object3D): void {
    for (const mask of finishMasksOf(root)) {
      this.warmFinish.set(`${id}:${mask}`, { done: true, wait: Promise.resolve() });
    }
  }

  /** Whether dropping this mesh into the active zone would compile a program mid-frame. */
  itemWarm(root: THREE.Object3D): boolean {
    const zone = this.active;
    if (!zone) return true;
    return finishMasksOf(root).every((mask) => this.warmFinish.get(`${zone.id}:${mask}`)?.done);
  }

  /** Compiles an item mesh's programs against the live scene, off the frame. Its own lights are hidden — they are not in the zone's census. */
  warmItem(root: THREE.Object3D): Promise<void> {
    const zone = this.active;
    if (!zone) return Promise.resolve();
    const cold = finishMasksOf(root).filter(
      (mask) => !this.warmFinish.get(`${zone.id}:${mask}`)?.done,
    );
    if (cold.length === 0) return Promise.resolve();
    const pending = cold
      .map((mask) => this.warmFinish.get(`${zone.id}:${mask}`)?.wait)
      .filter((held): held is Promise<void> => held !== undefined);
    if (pending.length === cold.length) return Promise.all(pending).then(() => undefined);

    const { scene, player, postfx } = this.options;
    const lights: THREE.Light[] = [];
    root.traverse((object) => {
      if (object instanceof THREE.Light && object.visible) lights.push(object);
    });
    for (const light of lights) light.visible = false;
    const wait: Promise<void> = postfx
      .compiling(() => postfx.renderer.compileAsync(root, player.camera, scene))
      .then(() => {
        for (const mask of cold) this.warmFinish.set(`${zone.id}:${mask}`, { done: true, wait });
      })
      .catch((error: unknown) => {
        for (const mask of cold) this.warmFinish.delete(`${zone.id}:${mask}`);
        throw error;
      })
      .finally(() => {
        for (const light of lights) light.visible = true;
      });
    for (const mask of cold) this.warmFinish.set(`${zone.id}:${mask}`, { done: false, wait });
    return wait;
  }

  /** Compiles every program the root needs, off the critical frame. */
  private async compile(root: THREE.Group): Promise<void> {
    const { scene, player, postfx } = this.options;
    if (root.parent === scene) {
      await postfx.compiling(() => postfx.renderer.compileAsync(scene, player.camera));
      return;
    }
    // A detached root compiles against a stand-in holding clones of the global
    // rig: the real scene may hold another zone's lights, and passing the root
    // to its own scene would count its lights twice.
    const stand = new THREE.Scene();
    stand.fog = scene.fog;
    stand.environment = scene.environment;
    stand.add(this.lights.sun.clone(), this.lights.fill.clone(), this.lights.ambient.clone());
    await postfx.compiling(() => postfx.renderer.compileAsync(root, player.camera, stand));
  }

  /** Which zones are currently holding memory — what exists, not what policy says should exist. */
  get builtZones(): ZoneId[] {
    return [...this.zones.values()].filter((zone) => zone.isBuilt).map((zone) => zone.id);
  }

  /**
   * Drops every zone further than `KEEP_WITHIN` doors from the player. Safe
   * because builders are seeded, so a rebuild gives back the same world down to
   * the blade of grass. Geometry, octree, doors, soundscape and the warm mark
   * all go together, and only once an entry has fully settled.
   */
  private evict(): void {
    if (!this.active) return;
    const keep = residentZones(this.portals, this.active.id, KEEP_WITHIN, this.cameFrom);

    for (const zone of this.zones.values()) {
      if (!zone.isBuilt || keep.has(zone.id)) continue;

      // The meshes are about to be freed; holding anything here would be a leak
      // shaped exactly like the one eviction exists to prevent.
      this.release(zone, true);
      this.evicted++;
    }
  }

  /**
   * Releases one zone and raises it again, in place. The editor's rebuild path:
   * everything eviction drops goes, then the zone is prepared and, if it is the
   * one being stood in, swapped back into the scene and the collider without
   * moving the camera.
   *
   * The soundscape is only dropped when asked, because rebuilding one silences
   * the place for as long as its models take to construct — which for a nudged
   * crate is a bad trade.
   */
  async rebuild(id: ZoneId, sound = false): Promise<void> {
    const zone = this.zones.get(id);
    if (!zone) return;
    const wasActive = this.active === zone;
    if (wasActive) this.options.scene.remove(zone.root());
    this.release(zone, sound);
    await zone.ensureLoaded();
    const root = await this.prepare(zone);
    root.updateWorldMatrix(true, true);
    if (!wasActive) return;
    this.options.scene.add(root);
    this.options.collider.build(root, zone.id);
    this.warmed.add(zone.id);
    this.applyAudio(zone);
    this.collectTargets(zone, root);
    this.options.postfx.setEnvironment({
      sky: zone.environment.sky,
      fogColor: zone.environment.fogColor,
      fogNear: zone.environment.fogNear,
      fogFar: zone.environment.fogFar,
      fogVolumes: zone.fogVolumes,
      water: zone.hasWater,
      glass: zone.hasGlass,
      particles: this.particled.has(zone.id),
    });
    this.hovered = null;
    this.options.reticle.set(null);
  }

  /**
   * Swaps one built object for another without raising the zone again.
   *
   * The editor's fast path for a re-rolled seed or a changed builder option:
   * re-raising a level the size of the village makes the whole world blink,
   * and the thing that changed is one mesh. What is re-run is the dressing —
   * shadows, the light census, the clutter and barrier lists, the activities —
   * all of which are a traverse and none of which is geometry.
   */
  async replaceObject(id: ZoneId, from: THREE.Object3D, to: THREE.Object3D): Promise<void> {
    const zone = this.zones.get(id);
    if (!zone?.isBuilt) return;
    const root = zone.root();
    (from.parent ?? root).add(to);
    from.removeFromParent();
    releaseSubtree(from);

    // The pads and the sparkle field are the dressing's own additions; they go
    // before it runs again, or the census counts its own padding.
    for (const held of [...root.children]) {
      if (held.userData.lightPad === true || held.userData.sparkleField === true) {
        held.removeFromParent();
        if (held instanceof THREE.Mesh) held.geometry.dispose();
      }
    }

    await this.decorate(zone, root);
    this.options.collider.invalidate(id);
    if (this.active === zone) this.options.collider.build(root, id);
  }

  /** Everything eviction drops, for one zone. */
  private release(zone: Zone, sound: boolean): void {
    zone.dispose();
    this.onZoneRelease?.(zone.id);
    this.options.collider.invalidate(zone.id);
    this.doored.delete(zone.id);
    this.preparing.delete(zone.id);
    this.warmed.delete(zone.id);
    this.clutter.delete(zone.id);
    this.parallax.delete(zone.id);
    this.barriers.delete(zone.id);
    this.casters.delete(zone.id);
    this.particled.delete(zone.id);
    this.activity.release(zone.id);
    this.windows.release(zone.id);
    this.cloth.release(zone.id);
    this.life.release(zone.id);
    this.glitch.release(zone.id);
    this.horror.release(zone.id);
    for (const side of this.portals.in(zone.id)) this.portals.unbind(side);
    if (!sound) return;
    const soundscape = this.soundscapes.get(zone.id);
    if (soundscape) {
      soundscape.dispose();
      this.soundscapes.delete(zone.id);
    }
  }

  /**
   * Everything still sounding for a place nobody is in any more. Eviction
   * silences a soundscape rather than disposing it, because the player is
   * expected back; leaving the world entirely is the case where they are not.
   */
  private hush(): void {
    for (const soundscape of this.soundscapes.values()) soundscape.dispose();
    this.soundscapes.clear();
    this.air?.leave();
    this.director?.setZone(null);
  }

  /** Counts releases, so eviction can be told from never-built. */
  private evicted = 0;

  get evictions(): number {
    return this.evicted;
  }

  /**
   * What the ground sounds like at a position in the active zone. A prop you
   * are standing on beats the zone's paint and comes from the player's own
   * collision — a plank walkway over mud is timber underfoot.
   */
  surfaceAt(x: number, z: number): SurfaceName {
    const zone = this.active;
    if (!zone) return 'soil';
    return (
      this.options.player.groundSurface ??
      zone.definition.surfaceAt?.(x, z) ??
      zone.environment.surface
    );
  }

  attachAudio(audio: ZoneAudio): void {
    this.audio = audio;
    this.doorAudio = new DoorAudio(audio.engine);
    this.director = new MusicDirector(audio.engine);
    this.air = new AmbienceDirector(audio.engine);
    // The zone was entered before the audio existed, so its acoustics and its
    // floor material were never applied. Do it now.
    if (this.active) this.applyAudio(this.active);
  }

  get current(): Zone | null {
    return this.active;
  }

  get isTransitioning(): boolean {
    return this.transitioning;
  }

  /**
   * Enters a zone, yielding to the browser while a cold one is built. Async
   * because building blocks and a blocked frame cannot paint: the two costly
   * steps are separated by a real yield, with the indicator up before either.
   */
  async enter(id: ZoneId, at?: Placement): Promise<void> {
    const zone = this.zones.get(id);
    if (!zone) throw new Error(`no such zone "${id}"`);

    // Re-entry guard. A second call can arrive while the first is yielding; the
    // later one wins, because it is what the player asked for most recently.
    const token = ++this.entering;
    const stale = (): boolean => token !== this.entering;

    const { scene, collider, player, postfx } = this.options;
    const cold = !this.warmed.has(zone.id);

    if (cold) {
      await this.loading.show(`entering ${zone.name.toLowerCase()}`);
      // Indeterminate: the step about to run is one synchronous `build()` that
      // cannot report its own progress.
      await this.loading.working('raising the world');
      if (stale()) return;
    }

    // The zone's code, if it lives in its own chunk. Usually already resolved by
    // the prefetch on the last arrival; a miss waits on the network here.
    await zone.ensureLoaded();
    if (stale()) return;

    const root = await this.prepare(zone);
    if (stale()) return;
    if (cold) {
      // Still indeterminate: neither the compile below nor the octree can say
      // how far through they are.
      await this.loading.working('settling the ground');
      if (stale()) return;
    }

    // Triangles are read straight out of the graph, and this subtree may never
    // have been rendered — its world matrices are whatever they were left as.
    root.updateWorldMatrix(true, true);

    // Indexed here, where yielding is still allowed, so the swap below finds it
    // cached. A pool that refuses the work leaves `build` to do it inline.
    await collider.warmAsync(root, zone.id, true, cacheKey(zone.id, 'collision', zone.fingerprint));
    if (stale()) return;

    // Compiled before anything is swapped. Every frame this yields still shows
    // the old zone with the player standing on its collider; compiling after the
    // swap put rendered frames between the collider changing and the teleport.
    if (cold) await this.loading.working('almost there', 0.96);
    // Before the compile: it decides which variant the compile builds.
    setGlitchVolumes(this.glitch.glitches(zone.id));
    setHorrorVolumes(this.horror.haunts(zone.id));
    // Only when it runs long: a compile that takes a frame is covered by the
    // fade already, and a screen that appears for one frame is a flicker.
    const slow = window.setTimeout(() => void this.loading.show('compiling materials'), 250);
    try {
      await this.compile(root);
    } finally {
      window.clearTimeout(slow);
    }
    if (stale()) return;
    this.markWarm(zone.id, root);

    // From here to the teleport nothing yields: the swap, the collider and
    // the player's arrival land in one task, so no frame renders mid-swap.
    if (this.active && this.active !== zone) {
      scene.remove(this.active.root());
      this.cameFrom = this.active.id;
    }
    scene.add(root);
    this.active = zone;
    // Keyed by zone, so re-entering a place the player has been before costs
    // nothing. See `Collider.build`.
    collider.build(root, zone.id);
    this.warmed.add(zone.id);

    const env = zone.environment;
    postfx.setEnvironment({
      sky: env.sky,
      fogColor: env.fogColor,
      fogNear: env.fogNear,
      fogFar: env.fogFar,
      // Off the definition rather than the environment: a volume has coordinates
      // and an environment is shared between zones.
      fogVolumes: zone.fogVolumes,
      // Read off what was actually built rather than off a declaration.
      water: zone.hasWater,
      glass: zone.hasGlass,
      // Off `prepare`'s walk rather than off the zone, because the sparkles are
      // built after the zone is and ride the same layer.
      particles: this.particled.has(zone.id),
    });

    this.lights.sun.intensity = env.sunIntensity;
    this.lights.sun.color.setHex(env.sunColor);
    this.lights.fill.intensity = env.fillIntensity;
    this.lights.fill.color.setHex(env.fillColor);
    this.lights.ambient.intensity = env.ambientIntensity;
    this.lights.ambient.color.setHex(env.ambientSky);
    this.lights.ambient.groundColor.setHex(env.ambientGround);
    setZoneWind(env.wind ?? 1);

    this.applyAudio(zone);

    this.collectTargets(zone, root);

    // Settled onto the zone's ground: an arrival is derived by stepping out
    // from a door, which keeps the door's height, and outdoors that is only
    // right if the ground happens to be level there.
    const placement = zone.settle(at ?? zone.spawn);
    player.teleport(placement.position, placement.yaw);
    // Level, not just turned. An arrival states which way you are looking, and
    // dropping into a cellar still staring at the hatch you came through is not
    // a direction anybody chose.
    player.aim(placement.yaw, 0);

    // `compile` above covers surface materials only, and a pass compiles what it
    // draws. `teleport` moves the capsule; only an update places the camera.
    if (!this.drawn) {
      this.drawn = true;
      player.update(0);
      postfx.warmScene();
    }

    // Again, with the zone in the scene. The compile above ran the root against
    // a stand-in, and a parameter that differs between the two is one a mesh
    // compiles the first frame it is drawn — whenever the player turns to it.
    const late = window.setTimeout(() => void this.loading.show('compiling materials'), 250);
    try {
      await this.compile(root);
    } finally {
      window.clearTimeout(late);
    }
    if (stale()) return;

    // Whatever was under the crosshair belonged to the zone we just left.
    this.hovered = null;
    this.options.reticle.set(null);
    this.seedVolumes(zone);

    this.onZoneChange?.(zone);
    this.loading.hide();

    // Last, and only once the arrival is complete: everything above holds live
    // references into both zones, so releasing earlier frees buffers still in hand.
    this.evict();
    this.prefetch();
  }

  /**
   * Fires the chunk load for every zone within the residency ring, so the code
   * behind each reachable door is cached before it is asked for. Fire-and-forget:
   * a failure is retried, and surfaced, by whichever entry actually needs it.
   */
  private prefetch(): void {
    if (!this.active) return;
    for (const id of residentZones(this.portals, this.active.id, KEEP_WITHIN, this.cameFrom)) {
      void this.zones.get(id)?.ensureLoaded().catch(() => {});
    }
  }

  private applyAudio(zone: Zone): void {
    if (!this.audio) return;
    this.audio.engine.setRoom(zone.environment.room);
    this.audio.footsteps.surface = zone.environment.surface;
    this.audio.engine.setFirstPersonReverb(zone.environment.firstPersonReverb);

    let soundscape = this.soundscapes.get(zone.id);
    if (!soundscape) {
      soundscape = new Soundscape(this.audio.engine, zone.environment.soundscape);
      this.soundscapes.set(zone.id, soundscape);
    }
    // Everything else is silenced rather than disposed: an emitter cannot work
    // out that it has become inaudible, because occlusion raycasts against a
    // collider that no longer holds the world it lives in.
    for (const [id, other] of this.soundscapes) other.setActive(id === zone.id);

    this.director?.setZone(musicFor(zone.environment.vibe));
    this.air?.setZone(zone.environment.vibe, zone.id);
  }

  /**
   * Drives the active zone's ambience. Separate from `update` because the
   * listener has to be moved before anything is judged against it. The music
   * director reads no frame state and runs off the frame loop entirely.
   */
  updateSound(dt: number, retestOcclusion: boolean): void {
    if (!this.active) return;
    this.soundscapes.get(this.active.id)?.update(dt, this.options.collider, retestOcclusion);
    this.air?.setScore(this.director?.voicing ?? null);
    this.air?.update(dt, this.options.collider, retestOcclusion);
  }

  /** The music director, for the debug readout and the stage. */
  get music(): MusicDirector | null {
    return this.director;
  }

  /** The ambience director, for the debug readout and the weather rig. */
  get ambience(): AmbienceDirector | null {
    return this.air;
  }

  /** The active zone's soundscape, for tuning panels and readouts. */
  get sound(): Soundscape | null {
    return this.active ? (this.soundscapes.get(this.active.id) ?? null) : null;
  }

  /**
   * Builds a zone's geometry and stands its doors in it. Doors belong to the
   * manager because a door is half a link, and a zone should not have to know
   * what is on the other side of its own walls. In-flight work is shared, so
   * two callers arriving mid-preparation get the same finished zone.
   */
  private prepare(zone: Zone): Promise<THREE.Group> {
    const pending = this.preparing.get(zone.id);
    if (pending) return pending;
    const work = this.dress(zone).finally(() => this.preparing.delete(zone.id));
    this.preparing.set(zone.id, work);
    return work;
  }

  private async dress(zone: Zone): Promise<THREE.Group> {
    const root = zone.root();
    // Dressing is once per build. `prepare` runs on every entry, and a second
    // pass would hang a second set of light pads and a second sparkle field
    // on the zone — which is a shader permutation and a frame rate.
    if (this.doored.has(zone.id)) return root;
    this.doored.add(zone.id);

    for (const side of this.portals.in(zone.id)) {
      this.stand(side, root);
      this.perch(side.end, root);
    }

    const dressed = await this.decorate(zone, root);
    this.onDressed?.(zone, dressed);
    return dressed;
  }

  /**
   * Puts one portal end into its zone: a door mesh, an invisible box over an
   * entry the document already placed, or an invisible box standing on its own.
   * Only the door is solid — a door you can walk through is a hole, and the
   * whole point of this system is that it is not one.
   */
  private stand(side: PortalSide, root: THREE.Group): void {
    const end = side.end;
    if (end.use === 'none') return;

    if (end.use === 'prop') {
      const adopted = end.propOf ? findTagged(root, end.propOf) : null;
      if (!adopted) {
        console.warn(`portal ${side.portal}: no entry "${end.propOf}" in "${end.zone}"`);
        return;
      }
      const box = _box.setFromObject(adopted);
      const middle = (box.min.y + box.max.y) / 2;
      box.expandByScalar(PROP_PROXY_GROW);
      if (end.half === 'lower') box.max.y = middle;
      else if (end.half === 'upper') box.min.y = middle;
      const proxy = boxProxy(box);
      root.add(proxy);
      this.portals.bind(side, proxy, builderByName(adopted.name)?.display ?? null);
      return;
    }

    if (end.use === 'volume') {
      const volume = end.volume ?? DEFAULT_VOLUME;
      const [ox, oy, oz] = volume.offset ?? [0, 0, 0];
      const [sx, sy, sz] = volume.size;
      // The offset is in the end's own frame, where +Z is the way it faces.
      // `rotateY(yaw)` takes +Z to `(sin yaw, 0, cos yaw)`, which is the vector
      // `doorFacing` gives, so an author says "beyond me" without knowing which
      // way north is. The box stands *on* the end's height, not centred on it.
      _centre.set(ox, oy, oz).applyAxisAngle(UP, end.yaw).add(end.position);
      _centre.y += sy / 2;
      const proxy = boxProxy(_box.setFromCenterAndSize(_centre, _size.set(sx, sy, sz)));
      root.add(proxy);
      side.trigger = _box.clone();
      this.portals.bind(side, proxy, null);
      return;
    }

    const mesh = buildDoor({ seed: end.seed ?? 1, material: end.material });
    mesh.position.copy(end.position);
    mesh.rotation.y = end.yaw;
    markCollidable(mesh);
    root.add(mesh);
    this.portals.bind(side, mesh, doorName(doorMetrics(mesh).material));
  }

  /**
   * Stands an end's arrival on top of something built in its own zone, for the
   * ends whose height nobody could have written down. Everything else about
   * the arrival — where in plan, and which way you face — stays the author's.
   */
  private perch(end: PortalEnd, root: THREE.Group): void {
    if (!end.landOn) return;
    const under = findTagged(root, end.landOn);
    if (!under) {
      console.warn(`portal end in "${end.zone}": nothing built for "${end.landOn}"`);
      return;
    }
    const top = _box.setFromObject(under).max.y + SETTLE_CLEARANCE;
    const stated = end.arrival ?? arrivalFor(end);
    this.portals.landing(end, {
      position: stated.position.clone().setY(top),
      yaw: stated.yaw,
      exact: true,
    });
  }

  /**
   * Doors, plus anything in the zone carrying a label. Collected by walking the
   * zone: a builder deep inside a gallery has no handle on the interaction
   * system, and threading one through would cost every layer between.
   */
  private collectTargets(zone: Zone, root: THREE.Group): void {
    const targets: THREE.Object3D[] = this.portals
      .in(zone.id)
      .map((side) => side.node)
      .filter((node): node is THREE.Object3D => node !== null);
    root.traverse((object) => {
      if (typeof object.userData.label === 'string') targets.push(object);
    });
    this.options.interaction.setTargets(targets);
  }

  /** Re-collects the active zone's interactables after something was added or taken. */
  refreshTargets(): void {
    if (this.active?.isBuilt) this.collectTargets(this.active, this.active.root());
  }

  /** Rebuilds the zone's star sites: the field bakes in every site's position, so it is wrong the moment a starred prop arrives or leaves. */
  refreshSparkles(id: ZoneId): void {
    const zone = this.zones.get(id);
    if (!zone?.isBuilt) return;
    const root = zone.root();
    const held: THREE.Object3D[] = [];
    root.traverse((object) => {
      if (object.userData.sparkleField === true) held.push(object);
    });
    for (const old of held) {
      old.removeFromParent();
      if (old instanceof THREE.Mesh) old.geometry.dispose();
    }

    const sparkles = buildZoneSparkles(root);
    if (sparkles) {
      sparkles.userData.sparkleField = true;
      root.add(sparkles);
      this.particled.add(id);
    } else this.particled.delete(id);

    // Only the live zone owns the effect chain's state.
    if (this.active === zone) this.options.postfx.setZoneParticles(this.particled.has(id));
  }

  /**
   * Everything dressing does that is not the doors: shadows, the light census,
   * the clutter and barrier lists, the cover, the sparkles.
   *
   * Separate from `dress` because it is the half that can be run again — over
   * a zone one of whose objects has just been swapped. Whatever it adds of its
   * own has to be taken back out first; see `replaceObject`.
   */
  private async decorate(zone: Zone, root: THREE.Group): Promise<THREE.Group> {
    // Every solid surface both casts and receives, decided once here rather than
    // by each builder. Glow never casts: it is additive and unlit. Ground never
    // casts: a floor can only shadow itself, which is the classic source of acne.
    // Clutter never casts either, and occlusion already grounds it.
    const grounds: THREE.Mesh[] = [];
    const clutter: THREE.Mesh[] = [];
    const parallax: VistaParallax[] = [];
    const barriers: THREE.Mesh[] = [];
    const casters: THREE.Light[] = [];
    let particles = false;
    let points = 0;
    let spots = 0;
    root.traverse((object) => {
      // Every light is shown to the particle pass, which restricts the camera to
      // `PARTICLE_LAYER` — three collects only the lights a camera can see, so
      // without this every flake in the zone comes out black.
      if (object instanceof THREE.Light) {
        object.layers.enable(PARTICLE_LAYER);
        object.layers.enable(HELD_LAYER);
        if (object instanceof THREE.PointLight) points++;
        if (object instanceof THREE.SpotLight) spots++;
        // A flame that asked to cast, which the preset can still overrule.
        if (object.userData.casts === true) {
          object.castShadow = this.shadowed;
          casters.push(object);
        }
      }
      // The vista's parallax, which rides a group rather than a mesh — so this
      // has to be asked before the mesh guard below. See `slideVista`.
      if (object.userData.vistaParallax instanceof VistaParallax) {
        parallax.push(object.userData.vistaParallax);
      }
      if (!(object instanceof THREE.Mesh)) return;
      // Collidable and never drawn. Caught before the shadow decision below,
      // because a revealed barrier must not start casting one.
      if (!object.visible && object.layers.test(COLLISION_MASK)) {
        barriers.push(object);
        object.castShadow = false;
        object.receiveShadow = false;
        if (this.barriersShown) revealBarrier(object, true);
        return;
      }
      // The layer rather than the builder: weather systems and the zone's
      // sparkles both ride it, and a test naming either would go wrong the first
      // time the other was alone in a zone.
      if (object.layers.test(PARTICLE_MASK)) particles = true;
      // A cloth panel is `noCollide` — its triangles stay out of the octree —
      // but it is solid to light: the sim moves the actual buffer, so its
      // shadow follows the drape with nothing to patch.
      const glow = object.userData.noCollide === true && object.userData.cloth === undefined;
      const ground =
        object.name === 'flatGround' ||
        object.name === 'terrain' ||
        object.userData.ground === true;
      const scatter = object.userData.clutter === true;
      // The same tag decides the distance cull, and for the same reason it
      // decides shadows — see `cullClutter`.
      if (scatter) clutter.push(object);
      // Out-of-bounds scenery. The sun's shadow box is ±48 m and the vista band
      // starts past it.
      const vista = object.userData.vista === true;
      object.castShadow = !glow && !ground && !scatter && !vista;
      object.receiveShadow = !glow && !vista;
      // Walls opt in by stating a type — ivy on this one — without becoming
      // ground for shadows or anything else.
      if (ground || typeof object.userData.cover === 'string') grounds.push(object);
    });

    // Cover is a property of the ground, not a set of objects standing on it, so
    // the same test that decided shadows decides this. Attached after the walk
    // rather than during it, because adding to a tree you are traversing is how
    // you end up covering the cover.
    const bare = grounds.filter(
      (mesh) => !mesh.children.some((child) => child.userData.coverField === true),
    );
    const covers = await Promise.all(
      bare.map((mesh, i) => coverFor(mesh, undefined, cacheKey(zone.id, `cover${i}`, zone.fingerprint))),
    );
    bare.forEach((mesh, i) => {
      const cover = covers[i];
      if (!cover) return;
      cover.userData.coverField = true;
      mesh.add(cover);
    });

    this.padLights(root, zone.id, points, spots);

    // Every star site in the zone as one instanced draw. See `art/sparkle.ts`.
    // Built after the walk above, so it is counted here rather than found there.
    const sparkles = buildZoneSparkles(root);
    if (sparkles) {
      sparkles.userData.sparkleField = true;
      root.add(sparkles);
      particles = true;
    }

    // Last, so it catches the doors, the cover, the light pads and the sparkles
    // as well as whatever the zone built.
    freezeMatrices(root);

    this.clutter.set(zone.id, clutter);
    // Kept even when empty, so `slideVista` can tell "nothing moves here" from
    // "not prepared yet". `thaw` puts auto-update back on for the moving props,
    // which `freezeMatrices` has just turned off across the whole zone.
    for (const controller of parallax) controller.thaw();
    this.parallax.set(zone.id, parallax);
    this.barriers.set(zone.id, barriers);
    this.casters.set(zone.id, casters);
    if (particles) this.particled.add(zone.id);
    this.activity.collect(zone.id, root);
    this.windows.collect(zone.id, root, zone.environment.bearing);
    this.cloth.collect(zone.id, root);
    this.life.collect(zone.id, root);
    // Both attachment routes in one call: the definition's free-standing
    // placements, and whatever a builder marked with `markGlitched`.
    this.glitch.collect(zone.id, root, zone.glitches);
    this.horror.collect(zone.id, root, zone.horrors);
    // After every layer and light is decided, so the sort is honest.
    partitionStatic(root);

    return root;
  }

  /**
   * Pads the zone's light census up to the nearest tier with black
   * zero-intensity lights, so its shader programs are shared game-wide. Flames
   * must flicker *intensity*, never `visible`: that would change the census.
   */
  private padLights(root: THREE.Group, id: ZoneId, points: number, spots: number): void {
    const pad = (count: number, tiers: readonly number[], make: () => THREE.Light, kind: string): void => {
      const ceiling = tiers.find((t) => t >= count);
      if (ceiling === undefined) {
        // One greedy zone mints a new shader permutation for the whole game.
        console.warn(
          `zone "${id}" carries ${count} ${kind} lights, over the top tier of ${tiers[tiers.length - 1]}`,
        );
        return;
      }
      for (let i = count; i < ceiling; i++) {
        const light = make();
        // Like every real light, so the particle pass sees the same census.
        light.layers.enable(PARTICLE_LAYER);
        light.layers.enable(HELD_LAYER);
        // Marked, so re-dressing a zone replaces the pads rather than stacking
        // a second set on top of them.
        light.userData.lightPad = true;
        root.add(light);
      }
    };
    pad(points, POINT_TIERS, () => new THREE.PointLight(0x000000, 0), 'point');
    pad(spots, SPOT_TIERS, () => new THREE.SpotLight(0x000000, 0), 'spot');
  }

  /**
   * Re-pads a built zone's census after a runtime light add or remove — a
   * lantern picked up or put down — so its programs stay on the shared tiers.
   */
  rebalanceLights(id: ZoneId): void {
    const zone = this.zones.get(id);
    if (!zone?.isBuilt) return;
    const root = zone.root();
    const pads: THREE.Light[] = [];
    let points = 0;
    let spots = 0;
    root.traverse((object) => {
      if (!(object instanceof THREE.Light)) return;
      if (object.userData.lightPad === true) {
        pads.push(object);
        return;
      }
      // Like decorate does for the zone's own lights, or the flake pass draws
      // this one black.
      object.layers.enable(PARTICLE_LAYER);
      object.layers.enable(HELD_LAYER);
      if (object instanceof THREE.PointLight) points++;
      if (object instanceof THREE.SpotLight) spots++;
    });
    for (const held of pads) held.removeFromParent();
    this.padLights(root, id, points, spots);

    // The flames changed with the lights. Settled before the walk, so a
    // mid-flicker intensity is not captured as the new baseline.
    this.activity.settle(id);
    this.activity.release(id);
    this.activity.collect(id, root);
  }

  /**
   * Hides clutter past the view distance. It removes draw calls rather than
   * pixels, which is what a pipeline this chunky is short of. Nothing here
   * touches collision — the grass you cannot see is still grass.
   */
  private cullClutter(): void {
    const radius = this.options.postfx.clutterRadius;
    if (radius === Infinity) {
      // Releasing takes every built zone rather than the active one: a zone left
      // behind mid-cull would still be missing its grass on the way back.
      if (!this.clutterHidden) return;
      for (const zone of this.clutter.values()) for (const mesh of zone) mesh.visible = true;
      this.clutterHidden = false;
      return;
    }

    const list = this.active ? this.clutter.get(this.active.id) : undefined;
    if (!list) return;

    const eye = this.options.player.camera.position;
    const limit = radius * radius;
    for (const mesh of list) {
      const m = mesh.matrixWorld.elements;
      const dx = m[12] - eye.x;
      const dy = m[13] - eye.y;
      const dz = m[14] - eye.z;
      mesh.visible = dx * dx + dy * dy + dz * dz <= limit;
    }
    this.clutterHidden = true;
  }

  /**
   * Slides the vista's moving props under the camera; the arithmetic lives in
   * `VistaParallax`. Frozen means as authored, not as you left it — the origin
   * puts every prop back where the ring built it.
   */
  private slideVista(): void {
    const list = this.active ? this.parallax.get(this.active.id) : undefined;
    if (!list || list.length === 0) return;
    const eye = this.options.player.camera.position;
    const x = this.freezeVista ? 0 : eye.x;
    const z = this.freezeVista ? 0 : eye.z;
    for (const controller of list) controller.update(x, z);
  }

  /** Per-frame: what is under the crosshair. Returns what the interact key would act on, so the caller need not probe again. */
  update(elapsed: number): Focus | null {
    const { interaction, collider, player, reticle } = this.options;

    // Ahead of the transition guard, because the zone being arrived in wants
    // its grass sorted out before it is first drawn rather than after, and a
    // hearth wants its light at the level it will be at rather than at rest.
    this.cullClutter();
    this.slideVista();
    this.activity.update(this.active?.id ?? null, elapsed, player.camera.position);

    if (this.transitioning) {
      reticle.set(null);
      this.focus = null;
      // So the frame the fade lifts on probes rather than waiting its turn.
      this.probed = -Infinity;
      return null;
    }

    // Every frame, not on the probe's clock: this is a threshold being crossed
    // at walking pace and the frame it happens on is the one it has to happen on.
    this.crossVolumes();

    // The probe is where the raycasts live and it is the same answer for several
    // frames at a time. The answer is held between probes, so the interact key
    // acts on what is being shown rather than on nothing.
    if (elapsed - this.probed < PROBE_INTERVAL) return this.focus;
    this.probed = elapsed;
    this.focus = this.lookAhead(interaction, collider, player, reticle);
    return this.focus;
  }

  /**
   * Fires a walk-in trigger the player has just entered.
   *
   * Hovering it is the whole gate on direction. The crosshair is the view axis,
   * so a volume you are reversing into or sliding past sideways is not the one
   * under it, and nothing has to read a velocity to know that. Rising edge,
   * because a crossing that lands you inside one is not a second crossing.
   */
  private crossVolumes(): void {
    if (!this.active) return;
    const at = this.options.player.position;
    for (const side of this.portals.in(this.active.id)) {
      if (!side.trigger) continue;
      const inside = side.trigger.containsPoint(at);
      const entered = inside && !side.inside;
      side.inside = inside;
      if (entered && this.hovered === side) void this.use(side);
    }
  }

  /**
   * Marks every trigger the player has landed inside, so arriving next to one
   * does not read as walking into it.
   */
  private seedVolumes(zone: Zone): void {
    const at = this.options.player.position;
    for (const side of this.portals.in(zone.id)) {
      if (side.trigger) side.inside = side.trigger.containsPoint(at);
    }
  }

  /** One probe's worth of work: what is under the crosshair, and its prompt. */
  private lookAhead(
    interaction: Interaction,
    collider: Collider,
    player: Controller,
    reticle: Reticle,
  ): Focus | null {
    const hover = interaction.probe(player.camera, collider);
    this.hovered = hover ? this.portals.sideOf(hover.object) : null;
    if (this.hovered) {
      // With no title the prompt is one line: the name of the place, over the
      // crosshair, which is what a walk-in trigger and a ladder inside one cell
      // both want.
      const { title, label } = this.hovered;
      reticle.set(linkPrompt(title, label));
      return { kind: 'door', side: this.hovered };
    }

    // Not a door. Told apart by what the object carries: a note binding is a
    // readable, a pickup or container mark brings its own verb, and a bare
    // label is a sign with no verb at all.
    const object = hover?.object ?? null;
    const found = labelOf(object);

    // Before the readable and pickup walks: a villager holding a book is still
    // a villager, and the hover proxy is the innermost mark either way.
    const person = npcOf(object);
    if (person && found) {
      reticle.set({ title: found.label });
      return { kind: 'talk', object: person.node, npc: person.npc };
    }

    if (found?.text !== undefined) {
      // An id that resolves to nothing degrades to a plain label rather than
      // opening a blank page.
      const note = noteById(found.text);
      // Only a bound note inverts the prompt; a single line keeps the item register.
      reticle.set(note ? { title: found.label, target: note.title, kind: 'read' } : { title: found.label });
      return note && object ? { kind: 'read', note, object } : null;
    }

    const carried = carriedOf(object);
    if (carried?.container) {
      reticle.set({ title: carried.container.display });
      return { kind: 'container', object: carried.node, container: carried.container };
    }
    if (carried?.pickup) {
      const pickup = carried.pickup;
      // A readable with nothing bound still opens as a page: the player always
      // reads before pocketing, and an unwritten book says so itself.
      if (pickup.item.builder && isReadable(pickup.item.builder)) {
        reticle.set({ title: pickup.item.name });
        return {
          kind: 'read',
          note: { id: '', title: pickup.item.name, body: '' },
          object: carried.node,
        };
      }
      reticle.set({ title: pickup.item.name });
      return { kind: 'item', object: carried.node, pickup };
    }

    if (!found) {
      reticle.set(null);
      return null;
    }
    reticle.set({ title: found.label, target: undefined, kind: 'read' });
    return null;
  }

  /**
   * What the free cursor is over — the crosshair resolution reduced to a name
   * and whether it could be dragged, for the inventory screen's hover tip and
   * cursor. Touches neither the reticle nor the held focus, so closing the
   * screen leaves the crosshair exactly as it was.
   */
  /** The pickable under the free cursor, for dragging it out of the world. Same ray, same reach, same occlusion as everything else. */
  cursorItem(ndcX: number, ndcY: number): { object: THREE.Object3D; pickup: PickupInfo } | null {
    if (!this.active || this.transitioning) return null;
    const { interaction, collider, player } = this.options;
    const hover = interaction.probe(player.camera, collider, _ndc.set(ndcX, ndcY));
    const carried = carriedOf(hover?.object ?? null);
    return carried?.pickup ? { object: carried.node, pickup: carried.pickup } : null;
  }

  cursorHover(ndcX: number, ndcY: number): { label: string; item: boolean } | null {
    if (!this.active || this.transitioning) return null;
    const { interaction, collider, player } = this.options;
    const hover = interaction.probe(player.camera, collider, _ndc.set(ndcX, ndcY));
    if (!hover) return null;
    const side = this.portals.sideOf(hover.object);
    if (side) return { label: side.title ?? side.label, item: false };
    const carried = carriedOf(hover.object);
    if (carried?.container) return { label: carried.container.display, item: false };
    if (carried?.pickup) return { label: carried.pickup.item.name, item: true };
    const found = labelOf(hover.object);
    return found ? { label: found.label, item: false } : null;
  }

  /**
   * Uses a door. The sound fires before the fade and is not awaited: scheduled
   * onto the audio clock in one go, its tail carries across the cut. One sound,
   * here, and nothing on arrival.
   */
  async use(side: PortalSide): Promise<void> {
    if (this.transitioning) return;
    this.transitioning = true;
    this.options.reticle.set(null);

    // A hatch has a leaf and hinges and a ladder is timber underfoot, so both
    // are heard the way a door is. A gap in a wall has nothing to open, and
    // what you hear leaving through one is your own feet going away.
    const leaf = isDoorEnd(side) ? (side.node as THREE.Mesh | null) : null;
    const steps = side.end.use === 'volume' ? WALK_AWAY_STEPS : 0;
    if (steps) this.audio?.footsteps?.walkAway(steps, WALK_AWAY_SPACING);
    else this.doorAudio?.play(leaf ? doorMetrics(leaf).material : 'timber');

    // Same zone: the fade and the teleport, without the entry. Re-entering the
    // zone you are standing in would rebuild its audio, its targets and its
    // lighting in order to arrive four metres higher up the same ladder.
    const hop = side.target.zone === this.active?.id ? this.active : null;
    await this.options.fade.cover(async () => {
      if (hop) {
        const landing = hop.settle(side.arrival);
        this.options.player.teleport(landing.position, landing.yaw);
        this.options.player.aim(landing.yaw, 0);
      } else {
        await this.enter(side.target.zone, side.arrival);
      }
      this.crossings++;
    }, steps === 0 ? undefined : (steps - 1) * WALK_AWAY_SPACING + WALK_AWAY_TAIL);

    if (hop) this.seedVolumes(hop);
    this.transitioning = false;
  }

  /** A doorless jump under the same fade a door gets. Without the cover the swap, however atomic, is a hard cut in full view. */
  async travel(id: ZoneId, at?: Placement): Promise<void> {
    if (this.transitioning) return;
    this.transitioning = true;
    this.options.reticle.set(null);

    // With nowhere named, arrive where a door would put you rather than on the
    // zone's `spawn`. A spawn is the boot placement and several zones author it
    // looking *at* their door, which is correct for a first frame that wants to
    // show you the way out and wrong for a jump, where it lands you facing a
    // wall. Walking in and jumping in now agree.
    const landing = at ?? this.doorArrival(id);
    await this.options.fade.cover(async () => {
      await this.enter(id, landing);
    });

    this.transitioning = false;
  }

  /** The title's way into the world: the zone's own spawn, under the fade a jump gets. */
  async begin(id: ZoneId): Promise<void> {
    if (this.transitioning) return;
    this.transitioning = true;
    this.options.reticle.set(null);

    await this.options.fade.cover(async () => {
      await this.enter(id);
    });

    this.transitioning = false;
  }

  /**
   * Loading a save: every built zone is released so the next build reads the
   * new records, then `id` is entered under one fade.
   */
  async hardReset(id: ZoneId, at?: Placement): Promise<void> {
    if (!this.zones.has(id) || this.transitioning) return;
    this.transitioning = true;
    this.options.reticle.set(null);

    await this.options.fade.cover(async () => {
      if (this.active) this.options.scene.remove(this.active.root());
      this.active = null;
      this.cameFrom = null;
      for (const held of this.zones.values()) {
        if (held.isBuilt) this.release(held, false);
      }
      await this.enter(id, at);
    });

    this.transitioning = false;
  }

  /**
   * Empties the world under one fade: every zone released, nothing active. The
   * way back to the title. `during` runs at full black, so whatever replaces
   * the world is already standing when the fade lifts.
   */
  async leave(during?: () => void): Promise<void> {
    if (this.transitioning) return;
    this.transitioning = true;
    this.options.reticle.set(null);

    await this.options.fade.cover(() => {
      if (this.active) this.options.scene.remove(this.active.root());
      this.active = null;
      this.cameFrom = null;
      for (const held of this.zones.values()) {
        if (held.isBuilt) this.release(held, false);
      }
      this.hush();
      during?.();
    });

    this.transitioning = false;
  }

  /**
   * Where the first door into a zone lands you, if it has one. Deterministic:
   * the same door every time, so a jump is repeatable.
   */
  private doorArrival(id: ZoneId): Placement | undefined {
    const side = this.portals.in(id)[0];
    return side ? arrivalFor(side.end) : undefined;
  }

  /** Puts the player back on the current zone's spawn. */
  respawn(): void {
    const zone = this.active;
    if (!zone) return;
    this.options.player.teleport(zone.spawn.position, zone.spawn.yaw);
  }

  dispose(): void {
    const { scene } = this.options;
    if (this.active) scene.remove(this.active.root());
    scene.remove(this.lights.sun, this.lights.fill, this.lights.ambient);
    for (const soundscape of this.soundscapes.values()) soundscape.dispose();
    this.soundscapes.clear();
    this.director?.dispose();
    this.director = null;
    this.air?.dispose();
    this.air = null;
    for (const zone of this.zones.values()) zone.dispose();
    this.zones.clear();
    this.doored.clear();
    this.clutter.clear();
    this.particled.clear();
    this.activity.clear();
    this.windows.clear();
    this.cloth.clear();
    this.life.clear();
    this.glitch.clear();
    this.horror.clear();
  }

  /**
   * Swings the active zone's windows with the sky. Driven on arrival of the
   * sample rather than on the frame loop, so a window is aimed at the hour the
   * rig has just worked out and not the one before it.
   */
  applyDaylight(daylight: Daylight): void {
    this.windows.update(this.active?.id ?? null, daylight, this.options.player.camera.position);
  }

  /** Steps the active zone's cloths. Called after the wind ships, so cloth and trees answer the same frame's weather. */
  updateCloth(dt: number, weather: Weather): void {
    this.cloth.update(this.active?.id ?? null, dt, weather, this.options.player.camera.position);
  }

  /** The creature behind a `talk` focus, for whoever is going to speak to it. */
  creatureFor(mesh: THREE.Object3D): Creature | null {
    return this.life.creatureFor(mesh);
  }

  /** Moves the active zone's creatures. Called after the sound update, so a voice is placed after the listener and before the wind ships. */
  updateLife(dt: number, retestOcclusion: boolean): void {
    const { player, collider } = this.options;
    const ground = this.active?.definition.groundAt ?? (() => 0);
    this.life.update(
      this.active?.id ?? null,
      dt,
      player.position,
      player.camera.position,
      player.camera.getWorldDirection(_gaze),
      ground,
      collider,
      this.audio?.engine ?? null,
      retestOcclusion,
    );
    player.obstacles = this.life.obstacles;
  }

  /** Creatures moved last frame, for the readout. */
  get creaturesAwake(): number {
    return this.life.awake;
  }

  /**
   * Packs the active zone's glitch volumes into the shared uniform store.
   * Attached volumes re-read their object's world matrix here, which is what
   * lets corruption follow a thing rather than a place.
   */
  updateGlitch(elapsed: number): void {
    this.glitch.update(this.active?.id ?? null, elapsed, this.options.player.camera.position);
  }

  /** Packs the active zone's horror volumes, glitch's twin. */
  updateHorror(elapsed: number): void {
    this.horror.update(this.active?.id ?? null, elapsed, this.options.player.camera.position);
  }

  /** Collider wireframes for the fabrics gallery's no-clipping row. Dev only. */
  setClothWireframes(on: boolean): void {
    this.cloth.setWireframes(on);
  }

  /** Cloths stepped last frame, for readouts. */
  get clothAwake(): number {
    return this.cloth.awake;
  }
}

/** Whether an end is the plain door the portal built for itself. */
function isDoorEnd(side: PortalSide): boolean {
  return side.end.use === undefined || side.end.use === 'door';
}

/** The nearest object under `root` tagged with an entry id. */
function findTagged(root: THREE.Object3D, id: string): THREE.Object3D | null {
  let found: THREE.Object3D | null = null;
  root.traverse((object) => {
    const tag = object.userData.entry as { id?: string } | undefined;
    if (!found && tag?.id === id) found = object;
  });
  return found;
}

/**
 * An invisible, non-colliding box over a world-space extent. Invisible rather
 * than absent: the crosshair's raycast does not test visibility, so this is
 * found exactly as a mesh is, and nothing is drawn and nothing is walked into.
 */
function boxProxy(box: THREE.Box3): THREE.Mesh {
  box.getSize(_size);
  box.getCenter(_centre);
  const proxy = new THREE.Mesh(new THREE.BoxGeometry(_size.x, _size.y, _size.z), PROXY_MATERIAL);
  proxy.name = 'portal-volume';
  proxy.visible = false;
  proxy.position.copy(_centre);
  proxy.userData.noCollide = true;
  return proxy;
}

/** The distinct nonzero finish masks stamped under `root` — see `dressArtMesh`. */
function finishMasksOf(root: THREE.Object3D): number[] {
  const masks = new Set<number>();
  root.traverse((object) => {
    const mask = object.userData.finishMask as number | undefined;
    if (mask) masks.add(mask);
  });
  return [...masks];
}
