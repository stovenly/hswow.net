import * as THREE from 'three';
import { Zone, type ZoneDefinition, type ZoneId, type Placement } from './Zone';
import { PortalGraph, type PortalDefinition, type PortalSide } from './Portal';
import { residentZones, KEEP_WITHIN } from './residency';
import { labelOf, type Interaction } from './Interaction';
import { noteById, type Note } from '../content/notes';
import { buildDoor, doorMetrics, doorName } from '../art/door';
import { coverFor } from '../art/cover';
import { buildZoneSparkles } from '../art/sparkle';
import { setZoneWind } from '../art/sway';
import { LightActivity } from '../engine/LightActivity';
import { ClothActivity } from '../engine/ClothActivity';
import { GlitchActivity } from '../engine/GlitchActivity';
import { HorrorActivity } from '../engine/HorrorActivity';
import type { Weather } from '../audio/weather';
import { PARTICLE_LAYER } from '../layers';
import { markCollidable, type Collider } from '../player/Collider';
import { Building } from '../ui/Building';
import type { Controller } from '../player/Controller';
import type { PostFX } from '../engine/PostFX';
import type { AudioEngine } from '../audio/AudioEngine';
import type { Footsteps, SurfaceName } from '../audio/models/footsteps';
import { DoorAudio } from '../audio/models/door';
import { Soundscape } from '../audio/Soundscape';
import { MusicDirector } from '../audio/music/director';
import type { Reticle, Fade } from '../ui/Reticle';

/**
 * Owns which place you are in, and moves you between places.
 *
 * Exactly one zone is in the scene and in the collider at any moment. Crossing
 * a threshold is: fade out, take the old zone's group out of the scene, put the
 * new one in, rebuild the collider from it, push the new zone's air and
 * acoustics into the render pipeline and the audio engine, drop the player on
 * the arrival marker, fade back in. All of it happens inside a single frame at
 * full black.
 *
 * The lights live here rather than in any zone. There is one sun and one
 * hemisphere light for the whole game and zones declare what they should be
 * doing, because lights that belong to a zone have to be added and removed with
 * it, and a frame where the old zone's lights have gone and the new zone's have
 * not yet arrived is a frame of pure black that no fade is covering.
 */

/**
 * What pressing the interact key would act on.
 *
 * A union rather than a door or null, because there are two verbs now and they
 * are not variants of one. A door moves you and a readable opens a page; the
 * caller has to say which, and a boolean dressed as an object is how that
 * decision ends up being made by whichever branch was written first.
 */
export type Focus =
  | { readonly kind: 'door'; readonly side: PortalSide }
  | { readonly kind: 'read'; readonly note: Note };

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
// census is a full shader recompile. Zones pad up to these tiers so the
// census takes a handful of values game-wide. See `padLights`.
const POINT_TIERS = [0, 4, 8] as const;
const SPOT_TIERS = [0, 2] as const;

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
  /**
   * The music director: one for the whole world, because a piece outlives any
   * single zone — the drone retunes across a border rather than restarting.
   */
  private director: MusicDirector | null = null;

  /**
   * One soundscape per zone that has been entered, kept for the session.
   *
   * Built lazily on first entry and never rebuilt. Granular models are not
   * free to construct and zones are revisited constantly; a gap where the wind
   * should be costs far more than a few dozen dormant filters.
   */
  private readonly soundscapes = new Map<ZoneId, Soundscape>();
  /**
   * Zones whose geometry has been built *and* indexed for collision.
   *
   * Distinct from `Zone.root`'s own cache: a zone can have been prebuilt
   * without ever being entered. This is what decides whether entering shows
   * anything, so it has to mean "the expensive part is already paid".
   */
  private readonly warmed = new Set<ZoneId>();
  /** Guards against a second `enter` arriving mid-transition. See `enter`. */
  private entering = 0;
  private readonly building = new Building(document.body);
  /**
   * Whether the player has arrived anywhere yet.
   *
   * The first entry is part of booting, and boot already has a loading bar —
   * `Loader`'s, in the same place on screen, saying the same thing. Putting the
   * transition indicator up underneath it stacks two bars over each other for
   * the length of the first zone build. So the first one is always silent, cold
   * or not, and the boot screen speaks for it.
   */
  private arrived = false;

  private active: Zone | null = null;
  /**
   * The zone the player stepped out of, kept resident so pacing in a doorway is
   * free. The whole of what the residency ring's second hop used to buy, and
   * one room instead of a ring of them. See `residency.ts`.
   */
  private cameFrom: ZoneId | null = null;
  /** Zones whose portal doors have been built into them. */
  private doored = new Set<ZoneId>();
  /**
   * The clutter in each built zone, collected while it was prepared.
   *
   * Gathered once rather than looked for each frame: a scene walk to find a few
   * hundred meshes that never move would cost more than the draws it saves. See
   * `cullClutter`.
   */
  private readonly clutter = new Map<ZoneId, THREE.Mesh[]>();
  /** Whether anything is currently hidden, so the default path stays free. */
  private clutterHidden = false;
  /** Every flame in every built zone, and what it is doing. See `LightActivity`. */
  private readonly activity = new LightActivity();
  /** Every simulated cloth in every built zone. See `ClothActivity`. */
  private readonly cloth = new ClothActivity();
  /** Every glitch volume in every built zone. See `GlitchActivity`. */
  private readonly glitch = new GlitchActivity();
  /** Every horror volume in every built zone. See `HorrorActivity`. */
  private readonly horror = new HorrorActivity();
  private transitioning = false;
  private hovered: PortalSide | null = null;

  /** Counts crossings, so the check suite can watch for growth across many. */
  crossings = 0;

  /**
   * Fired after every entry, including the first.
   *
   * How systems that are *not* zone-owned find out where they are. The Phase 3
   * sound garden is the case: it belongs to the exterior, it cannot work out
   * on its own that it has been left behind, and it has to be silenced rather
   * than torn down.
   */
  onZoneChange: ((zone: Zone) => void) | null = null;

  constructor(options: ZoneManagerOptions) {
    this.options = options;

    this.lights = {
      sun: new THREE.DirectionalLight(0xfff2d8, 2.2),
      fill: new THREE.DirectionalLight(0x8fa0b8, 0),
      ambient: new THREE.HemisphereLight(0x9dc4e8, 0x4c4536, 1.5),
    };
    // A direction, not a place. A directional light has no position in any
    // meaningful sense, and putting it inside a zone's group would mean its
    // angle changed when the zone did.
    // About 45° up and well round to one side — mid-morning.
    //
    // Halfway to the zenith is the useful compromise. Overhead, shadows are
    // puddles under things and every vertical face catches the same light; down
    // at 25° the shadows are long and handsome and the disc sits in the haze
    // band where the sky is palest, which is where a bright object is hardest
    // to see. This is high enough to be plainly in open sky and low enough that
    // the two lit walls of a building still differ.
    //
    // Set far out along that direction rather than at a handful of metres. A
    // directional light's *direction* is all the shading uses, but its
    // **position is where the shadow camera stands** — so a light at 25 units
    // with the scene spanning 48 puts half the world behind its own shadow
    // camera. Pushed out to about 125, everything is comfortably in front of
    // it and `near`/`far` can be drawn tight around the scene, which is what
    // makes the small bias below sufficient.
    this.lights.sun.position.set(-70, 90, 50);

    // Shadow setup, applied once. Whether it is *used* is `shadows`, below.
    //
    // A directional light's shadow camera is orthographic and has to be sized
    // by hand: three defaults to a 10 m box, which for a zone 200 m across
    // means everything past a few paces silently stops casting. Sized to the
    // village instead, which is the largest place in the game.
    //
    // The cost of that is resolution — one map stretched over 120 m — so the
    // map is large and the bias is generous. Shadow acne on flat-shaded
    // low-poly geometry is far more conspicuous than a soft contact edge,
    // because every facet is a single value and acne turns it into stripes.
    const shadow = this.lights.sun.shadow;
    // 4096 rather than 2048, and this is the fix for the gap that was showing
    // under everything. A shadow needs some depth bias or a surface shadows
    // itself in stripes; bias large enough to stop that at low resolution also
    // slides the shadow *away* from whatever cast it, so objects float above
    // their own contact point. The way out is not more bias tuning, it is more
    // texels: at 4096 over 96 m one texel is 2.3 cm, which needs a fraction of
    // the bias and closes the gap.
    shadow.mapSize.set(4096, 4096);
    const extent = 48;
    shadow.camera.left = -extent;
    shadow.camera.right = extent;
    shadow.camera.top = extent;
    shadow.camera.bottom = -extent;
    // Tight around the scene. Depth precision — and therefore how little bias
    // is needed — depends on this range and not on the map resolution, so the
    // 170-unit span here is worth as much as the extra texels above. It was
    // 1 to 260, and a bias small enough to keep a bush joined to its shadow
    // could not survive that.
    shadow.camera.near = 55;
    shadow.camera.far = 225;
    shadow.bias = -0.00008;
    // **The one that was actually causing the gap.** `normalBias` moves the
    // lookup along the surface normal, so it grows the shadow-free margin
    // around every silhouette — at 0.05 that margin was centimetres wide and it
    // is precisely the bright seam that appeared between a thing and its own
    // shadow. Small enough here to be invisible.
    shadow.normalBias = 0.006;
    // How dark a shadow gets, 0..1. Not full strength: the sun is only part of
    // the light in this world — there is a fill and a hemisphere too — and a
    // shadow that removes all of it is a hole rather than shade. A third is
    // enough to read as a shadow and leaves the material colour intact inside
    // it, which matters more than usual here because the pipeline quantizes to
    // a handful of levels and a dark shadow drives everything under it onto the
    // bottom one.
    shadow.intensity = 0.34;
    // Opposed on both horizontal axes but still above, so it lifts the walls
    // the sun misses without lighting the ceiling from underneath.
    this.lights.fill.position.set(9, 7, -7);
    // The three world lights are the scene's, not a zone's, so the walk in
    // `prepare` never reaches them — see the note there for why the particle
    // pass has to be shown every light there is.
    for (const light of [this.lights.sun, this.lights.fill, this.lights.ambient]) {
      light.layers.enable(PARTICLE_LAYER);
    }
    options.scene.add(this.lights.sun, this.lights.fill, this.lights.ambient);
  }

  /**
   * Which way the sun shines, normalised and pointing *toward* it.
   *
   * A directional light in three is aimed from its position at its target, so
   * the direction the light arrives from is its position. Exposed so the sky
   * can draw its disc in the same place — a painted sun that disagrees with the
   * one casting the shadows makes every shadow in the world look wrong at once.
   */
  get sunDirection(): THREE.Vector3 {
    return this.lights.sun.position;
  }

  /**
   * Turns cast shadows on or off for the whole game.
   *
   * One switch rather than a per-zone setting. Shadows are a *look*, in the
   * same sense the dither and the palette are — they belong with the render
   * preset and not with the description of a place, and a zone that quietly
   * turned them off would read as a bug the moment you walked back out of it.
   */
  setShadows(enabled: boolean): void {
    this.lights.sun.castShadow = enabled;
  }

  register(definition: ZoneDefinition): Zone {
    const zone = new Zone(definition);
    this.zones.set(zone.id, zone);
    return zone;
  }

  /**
   * Links two ends. Both zones must already be registered — a portal to a zone
   * that does not exist is a door that cannot be walked back through, and it
   * should fail at startup rather than when somebody opens it.
   */
  link(portal: PortalDefinition): void {
    for (const end of [portal.a, portal.b]) {
      if (!this.zones.has(end.zone)) {
        throw new Error(`portal ${portal.id} refers to unknown zone "${end.zone}"`);
      }
    }
    this.portals.add(portal, (id) => this.zones.get(id)?.name ?? id);
  }

  /**
   * Builds a zone's geometry and collision ahead of time, without entering it.
   *
   * For the loading screen. A big zone's first entry otherwise pays its whole
   * build cost behind the fade, which is only a third of a second of black.
   */
  async prebuild(id: ZoneId): Promise<void> {
    const zone = this.zones.get(id);
    if (!zone) return;
    await zone.ensureLoaded();
    const root = this.prepare(zone);
    root.updateWorldMatrix(true, true);
    this.options.collider.warm(root, zone.id);
    // Prebuilding pays the whole cost up front, so entering later must take the
    // silent path — that is the entire point of doing it at boot.
    this.warmed.add(zone.id);
  }

  /**
   * Compiles a zone's shader programs ahead of entry. Safe to fire unawaited:
   * parallel compile runs on driver threads, and an entry that arrives first
   * just awaits the remainder behind its fade.
   */
  async precompile(id: ZoneId): Promise<void> {
    const zone = this.zones.get(id);
    if (!zone) return;
    await zone.ensureLoaded();
    await this.compile(this.prepare(zone));
  }

  /** Compiles every program the root needs, off the critical frame. */
  private async compile(root: THREE.Group): Promise<void> {
    const { scene, player, postfx } = this.options;
    if (root.parent === scene) {
      await postfx.renderer.compileAsync(scene, player.camera);
      return;
    }
    // A detached root compiles against a stand-in holding clones of the global
    // rig: the real scene may hold another zone's lights (a combined census
    // compiles a program nothing renders with), and passing the root as the
    // pre-add object to its own scene would count its lights twice.
    const stand = new THREE.Scene();
    stand.fog = scene.fog;
    stand.environment = scene.environment;
    stand.add(this.lights.sun.clone(), this.lights.fill.clone(), this.lights.ambient.clone());
    await postfx.renderer.compileAsync(root, player.camera, stand);
  }

  /**
   * Which zones are currently holding memory. For the readout and the checks.
   *
   * "Built" rather than "resident" is the honest word: this is what exists, not
   * what policy says should exist, and the difference between the two is the
   * bug this is here to make visible.
   */
  get builtZones(): ZoneId[] {
    return [...this.zones.values()].filter((zone) => zone.isBuilt).map((zone) => zone.id);
  }

  /**
   * Drops every zone further than `KEEP_WITHIN` doors from where the player is.
   *
   * **This is safe because builders are seeded.** A zone is a name and a list of
   * seeds, and rebuilding one is guaranteed to give back the same world down to
   * the position of every blade of grass — which is the return on banning
   * `Math.random` from builders long before there was any thought of eviction.
   * Nothing here would be defensible otherwise: dropping a room you cannot
   * reconstruct exactly is dropping a room the player will notice changing.
   *
   * Everything the zone was costing has to go together, and the list is longer
   * than the geometry:
   *
   * - **The geometry**, which is most of the memory — `Zone.dispose` frees the
   *   buffers and leaves the shared materials alone.
   * - **The collider's octree**, which is roughly a fifth as much again and is
   *   held in a cache the zone knows nothing about.
   * - **The doors**, which are built by the manager rather than by the zone, so
   *   `dispose` cannot know about them. `doored` is cleared so the next entry
   *   stands them again, and the portal graph is told to forget the meshes.
   * - **The soundscape**, which is the one thing a dormant zone was already
   *   paying almost nothing for — but "almost nothing" times a hundred and forty
   *   rooms is worth collecting.
   * - **The warm mark**, because the zone is now cold and its next entry should
   *   show the indicator rather than hitching silently behind an instant fade.
   *
   * Called after an entry has fully settled, never during one: the active zone
   * is exempt by construction, and releasing anything mid-transition would mean
   * disposing geometry that the frame in flight is still holding a reference to.
   */
  private evict(): void {
    if (!this.active) return;
    const keep = residentZones(this.portals, this.active.id, KEEP_WITHIN, this.cameFrom);

    for (const zone of this.zones.values()) {
      if (!zone.isBuilt || keep.has(zone.id)) continue;

      zone.dispose();
      this.options.collider.invalidate(zone.id);
      this.doored.delete(zone.id);
      this.warmed.delete(zone.id);
      // The meshes are about to be freed; holding them here would be a leak
      // shaped exactly like the one eviction exists to prevent.
      this.clutter.delete(zone.id);
      this.activity.release(zone.id);
      this.cloth.release(zone.id);
      this.glitch.release(zone.id);
      this.horror.release(zone.id);
      for (const side of this.portals.in(zone.id)) this.portals.unbind(side);

      const soundscape = this.soundscapes.get(zone.id);
      if (soundscape) {
        soundscape.dispose();
        this.soundscapes.delete(zone.id);
      }

      this.evicted++;
    }
  }

  /** Counts releases, so the check suite can tell eviction from never-built. */
  private evicted = 0;

  get evictions(): number {
    return this.evicted;
  }

  /**
   * What the ground sounds like at a position in the active zone.
   *
   * Zones declare one floor material, which is right for a room and wrong for
   * anywhere outdoors — walking off a cobbled yard onto grass has to change the
   * sound or the ground cover is only paint. A zone that varies overrides this.
   *
   * **A prop you are standing on beats both**, and it has to: a plank walkway
   * over mud is timber underfoot, and a zone's paint has no way to know a prop
   * was put there. Which prop that is comes from the player's own collision —
   * see `Controller.groundSurface` — so it is whatever actually stopped them
   * rather than whatever a search near their feet turned up.
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

  /** Puts the player in a zone. Used for the initial boot and by `use`. */
  /**
   * Enters a zone, yielding to the browser while a cold one is built.
   *
   * **Async because building blocks, and a blocked frame cannot paint.** A
   * dense zone runs every builder, merges the geometry and indexes the lot into
   * an octree, which on the foliage gallery is comfortably over a second. Done
   * synchronously the game simply stops: no frame is presented, so anything put
   * on screen to say so is only drawn *after* the work it was describing. The
   * two costly steps are therefore separated by a real yield, and the indicator
   * goes up before either of them.
   *
   * A zone that has been entered before is cached in `Zone.root` and in the
   * collider, so it takes the fast path and shows nothing at all — which is
   * most doorways in the game.
   */
  async enter(id: ZoneId, at?: Placement): Promise<void> {
    const zone = this.zones.get(id);
    if (!zone) throw new Error(`no such zone "${id}"`);

    // **Re-entry guard.** Once this is async a second call can arrive while the
    // first is still yielding — a player mashing a door, or a jump from the
    // debug panel mid-transition. The later call wins and the earlier one is
    // abandoned at its next yield, because the later one is what the player
    // asked for most recently. Ignoring it instead would leave the door they
    // just used feeling dead.
    const token = ++this.entering;
    const stale = (): boolean => token !== this.entering;

    const { scene, collider, player, postfx, interaction } = this.options;
    const cold = !this.warmed.has(zone.id) && this.arrived;

    if (cold) {
      await this.building.show(`entering ${zone.name.toLowerCase()}`);
      // Sweeping rather than sitting at a width. The step about to run is one
      // synchronous `build()` that cannot report its own progress, and on a
      // slow machine a bar frozen at 4% for two seconds reads as a hang. See
      // `Building.step`.
      await this.building.step('raising the world');
      if (stale()) return;
    }

    // The zone's code, if it lives in its own chunk. The prefetch on the last
    // arrival usually means this is already resolved; a miss waits on the
    // network here, under the indicator or the fade.
    await zone.ensureLoaded();
    if (stale()) return;

    const root = this.prepare(zone);
    if (cold) {
      // Still indeterminate: neither the compile below nor the octree can say
      // how far through they are.
      await this.building.step('settling the ground');
      if (stale()) return;
    }

    // Triangles are read straight out of the graph, and this subtree may never
    // have been rendered — its world matrices are whatever they were left as.
    root.updateWorldMatrix(true, true);

    // **Compiled before anything is swapped.** This await is the long pole on
    // a cold entry, and every frame it yields still shows the old zone, whole,
    // with the player standing on its collider. Compiling after the swap put
    // rendered frames between the collider changing and the teleport — on a
    // doorless jump the player fell through a world they were not in yet.
    // The stand-in census in `compile` matches the scene the root is about to
    // join, so the programs are the ones the first real frame asks for.
    //
    // There is nothing to arrange first. Every mesh already carries the one of
    // two art materials it will keep (see `dressArtMesh`), so this pass
    // compiles what the first real frame will ask for, and there is no second
    // pass handing anything out afterwards. It used to need a probe and a
    // deferral; MATERIAL-SYSTEM.md R5 retired both.
    if (cold) await this.building.step('almost there', 0.96);
    await this.compile(root);
    if (stale()) return;

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
      // Off the definition rather than the environment, because a volume has
      // coordinates and an environment is shared between zones. See
      // `ZoneDefinition.fogVolumes`.
      fogVolumes: zone.fogVolumes,
      // Read off what was actually built rather than off a declaration, which
      // is why this is safe to ask here: `root()` ran a few lines up.
      water: zone.hasWater,
      glass: zone.hasGlass,
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

    // Doors, plus anything in the zone carrying a label. Collected by walking
    // the zone once on entry rather than being registered by whoever built it:
    // a builder deep inside a gallery has no handle on the interaction system,
    // and making it acquire one would thread a dependency through every layer
    // between them for the sake of a tooltip.
    const targets: THREE.Object3D[] = this.portals
      .in(zone.id)
      .map((side) => side.door)
      .filter((door): door is THREE.Mesh => door !== null);
    root.traverse((object) => {
      if (typeof object.userData.label === 'string') targets.push(object);
    });
    interaction.setTargets(targets);

    // Settled onto the zone's ground: an arrival is derived by stepping out
    // from a door, which keeps the door's height, and outdoors that is only
    // right if the ground happens to be level there.
    const placement = zone.settle(at ?? zone.spawn);
    player.teleport(placement.position, placement.yaw);

    // Whatever was under the crosshair belonged to the zone we just left.
    this.hovered = null;
    this.options.reticle.set(null);

    this.onZoneChange?.(zone);
    this.arrived = true;
    this.building.hide();

    // **Last, and only once the arrival is complete.** Everything above this
    // line holds live references into the zone being entered and, until
    // `scene.remove` above, into the one being left — so releasing geometry any
    // earlier means freeing buffers that the transition still has in hand. The
    // player is standing still on their marker by the time this runs.
    this.evict();
    this.prefetch();
  }

  /**
   * Fires the chunk load for every zone within the residency ring, so the
   * code behind each reachable door is cached before it is asked for. Every
   * door the player can see leads one hop out, well inside the ring.
   * Fire-and-forget: a failure clears itself and is retried, and surfaced, by
   * whichever entry actually needs the zone.
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
    this.audio.footsteps.setReverb(zone.environment.footstepReverb);

    let soundscape = this.soundscapes.get(zone.id);
    if (!soundscape) {
      soundscape = new Soundscape(this.audio.engine, zone.environment.soundscape);
      this.soundscapes.set(zone.id, soundscape);
    }
    // Everything else is silenced rather than disposed. Emitters cannot work
    // out that they have become inaudible on their own: occlusion is a raycast
    // against the collider, and the collider no longer holds the world they
    // live in, so every one of them would report itself unobstructed.
    for (const [id, other] of this.soundscapes) other.setActive(id === zone.id);

    this.director?.setZone(zone.environment.music ?? null);
  }

  /**
   * Drives the active zone's ambience.
   *
   * Separate from `update` on the loop because the listener has to be moved
   * before anything is judged against it — the caller pumps the engine first
   * and passes on whether the occlusion raycasts are due this frame.
   *
   * The music director is deliberately not here. It reads no frame state, so it
   * runs on its own timer off the frame loop entirely — see `dsp/ticker.ts`.
   */
  updateSound(dt: number, retestOcclusion: boolean): void {
    if (!this.active) return;
    this.soundscapes.get(this.active.id)?.update(dt, this.options.collider, retestOcclusion);
  }

  /** The music director, for the debug readout and the stage. */
  get music(): MusicDirector | null {
    return this.director;
  }

  /** The active zone's soundscape, for tuning panels and readouts. */
  get sound(): Soundscape | null {
    return this.active ? (this.soundscapes.get(this.active.id) ?? null) : null;
  }

  /**
   * Builds a zone's geometry and stands its doors in it.
   *
   * Doors are added by the manager rather than by the zone's own builder
   * because a door is half of a link between two zones, and a zone should not
   * have to know what is on the other side of its own walls. It also means the
   * door mesh and the arrival marker are derived from the same placement, so
   * they cannot disagree.
   */
  private prepare(zone: Zone): THREE.Group {
    const root = zone.root();
    if (this.doored.has(zone.id)) return root;
    this.doored.add(zone.id);

    for (const side of this.portals.in(zone.id)) {
      const end = side.end;
      const mesh = buildDoor({ seed: end.seed ?? 1, material: end.material });
      mesh.position.copy(end.position);
      mesh.rotation.y = end.yaw;
      // Solid: a door you can walk through is a hole, and the whole point of
      // this system is that it is not one.
      markCollidable(mesh);
      root.add(mesh);
      this.portals.bind(side, mesh, doorName(doorMetrics(mesh).material));
    }

    // Every solid surface both casts and receives, decided once here rather
    // than by each builder. Two exceptions, and both matter:
    //
    // - **Glow geometry never casts.** It is additive, unlit and has no
    //   business occluding anything; a flame that threw a shadow would be
    //   drawing the shape of the light source in darkness.
    // - **Ground never casts.** A floor can only ever shadow itself, and
    //   self-shadowing a vast flat plane is the classic source of acne — it is
    //   pure cost for an effect that is at best invisible and at worst stripes.
    //   Recognised by name for the two floors that predate the flag, and by
    //   `userData.ground` for anything else that is a large near-horizontal
    //   surface — a pond bed is one, and is not called either of those things.
    // - **Clutter never casts.** Grass and small flowers are the bulk of the
    //   object count in an outdoor zone and a couple of pixels each on screen,
    //   and occlusion already grounds them; see `art/clutter.ts`.
    const grounds: THREE.Mesh[] = [];
    const clutter: THREE.Mesh[] = [];
    let points = 0;
    let spots = 0;
    root.traverse((object) => {
      // **Every light is shown to the particle pass.** That pass restricts the
      // camera to `PARTICLE_LAYER`, and three collects only the lights a camera
      // can see — so without this the particle material compiles against an
      // empty light list and every flake in the zone comes out black. Enabled,
      // not set, so nothing about ordinary rendering changes; and done here
      // rather than in the builders so a forge lights the embers drifting off
      // it without knowing particles exist.
      if (object instanceof THREE.Light) {
        object.layers.enable(PARTICLE_LAYER);
        if (object instanceof THREE.PointLight) points++;
        if (object instanceof THREE.SpotLight) spots++;
      }
      if (!(object instanceof THREE.Mesh)) return;
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
      object.castShadow = !glow && !ground && !scatter;
      object.receiveShadow = !glow;
      // Walls opt in by stating a type — ivy on this one — without becoming
      // ground for shadows or anything else.
      if (ground || typeof object.userData.cover === 'string') grounds.push(object);
    });

    // **Cover is a property of the ground, not a set of objects standing on
    // it.** The same test that decided shadows decides this, so anything the
    // manager already calls ground grows what its material says it grows —
    // with no placement to author and nothing to invalidate when the mesh
    // moves. A mesh that grows nothing returns null and costs no draw. Attached
    // after the walk rather than during it, because adding to a tree you are
    // traversing is how you end up covering the cover.
    for (const mesh of grounds) {
      const cover = coverFor(mesh);
      if (cover) mesh.add(cover);
    }

    this.padLights(root, zone.id, points, spots);

    // Every star site in the zone as one instanced draw. See `art/sparkle.ts`.
    const sparkles = buildZoneSparkles(root);
    if (sparkles) root.add(sparkles);

    this.clutter.set(zone.id, clutter);
    this.activity.collect(zone.id, root);
    this.cloth.collect(zone.id, root);
    // Both attachment routes in one call: the definition's free-standing
    // placements, and whatever a builder marked with `markGlitched`.
    this.glitch.collect(zone.id, root, zone.glitches);
    this.horror.collect(zone.id, root, zone.horrors);

    return root;
  }

  /**
   * Pads the zone's light census up to the nearest tier with black
   * zero-intensity lights, so its shader programs are shared game-wide.
   *
   * A black light holds its slot in the shader's light loop and contributes
   * nothing; the cost is a few dead loop iterations per fragment. Pads carry
   * no `userData.activity`, so `LightActivity` never collects them. The rule
   * that keeps this working: flames flicker *intensity*, never `visible` — a
   * light toggling visible changes the census mid-zone and forces a compile.
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
        root.add(light);
      }
    };
    pad(points, POINT_TIERS, () => new THREE.PointLight(0x000000, 0), 'point');
    pad(spots, SPOT_TIERS, () => new THREE.SpotLight(0x000000, 0), 'spot');
  }

  /**
   * Hides clutter past the view distance (VIEW-DISTANCE.md).
   *
   * Grass and small flowers are about a third of the meshes in a zone that
   * scatters and almost none of the picture — near enough the fact that already
   * stops them casting shadows — so they are the right thing to drop first when
   * the view is pulled in. It removes draw calls rather than pixels, which is
   * what a pipeline this chunky is short of.
   *
   * Positions come out of the matrices the renderer has already updated, so a
   * zone that has never been drawn simply reads its meshes where they were
   * placed. Nothing here touches collision: `Collider` walks the graph without
   * asking what is visible, so the grass you cannot see is still grass.
   */
  private cullClutter(): void {
    const radius = this.options.postfx.clutterRadius;
    if (radius === Infinity) {
      // The default, and then this costs one comparison a frame. Releasing
      // takes every built zone rather than the one being stood in: a zone left
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
   * Per-frame: what is under the crosshair, and should the prompt be showing.
   *
   * Returns what the interact key would act on, so the caller can act on it
   * without probing a second time.
   */
  update(elapsed: number): Focus | null {
    const { interaction, collider, player, reticle } = this.options;

    // Ahead of the transition guard, because the zone being arrived in wants
    // its grass sorted out before it is first drawn rather than after, and a
    // hearth wants its light at the level it will be at rather than at rest.
    this.cullClutter();
    this.activity.update(this.active?.id ?? null, elapsed, player.camera.position);

    if (this.transitioning) {
      reticle.set(null);
      return null;
    }

    const hover = interaction.probe(player.camera, collider);
    this.hovered = hover ? this.portals.sideOf(hover.object) : null;
    if (this.hovered) {
      reticle.set({ title: this.hovered.title, target: this.hovered.label });
      return { kind: 'door', side: this.hovered };
    }

    // Not a door. Three things it can still be, and they are told apart by what
    // the object carries rather than by what kind of prop it is:
    //
    // - nothing named — no tooltip, no verb;
    // - named and nothing more — a sign. The tooltip shows and the key does
    //   nothing, which is a real state and the one a caption is in;
    // - named and bound to a note — a readable. Two lines, and a verb.
    const found = labelOf(hover?.object ?? null);
    if (!found) {
      reticle.set(null);
      return null;
    }

    // An id that resolves to nothing degrades to a plain label rather than
    // opening a blank page. It is a content bug, and `check:world` is where it
    // is meant to be caught — this is only what the game does meanwhile.
    const note = found.text === undefined ? undefined : noteById(found.text);
    reticle.set({ title: found.label, target: note?.title, kind: 'read' });
    return note ? { kind: 'read', note } : null;
  }

  /**
   * Uses a door.
   *
   * The door sound is fired *before* the fade and is not awaited. It is
   * scheduled onto the audio clock in one go at this moment, so it survives the
   * zone being torn down and rebuilt underneath it — the tail carries across
   * the cut, which is most of what makes the transition feel like walking
   * through a door rather than a screen wipe. It survives the *teleport* too,
   * which took removing the panner: see `door.ts`.
   *
   * One sound, here, and nothing on arrival. A second cue on the far side read
   * as a second event rather than as the other half of the same one.
   */
  async use(side: PortalSide): Promise<void> {
    if (this.transitioning) return;
    this.transitioning = true;
    this.options.reticle.set(null);

    const material = side.door ? doorMetrics(side.door).material : 'timber';
    this.doorAudio?.play(material);

    await this.options.fade.cover(async () => {
      await this.enter(side.target.zone, side.arrival);
      this.crossings++;
    });

    this.transitioning = false;
  }

  /**
   * A doorless jump under the same fade a door gets: the debug menu's travel,
   * and anything else scripted. Without the cover, the swap — however atomic —
   * is a hard cut in full view.
   */
  async travel(id: ZoneId, at?: Placement): Promise<void> {
    if (this.transitioning) return;
    this.transitioning = true;
    this.options.reticle.set(null);

    await this.options.fade.cover(async () => {
      await this.enter(id, at);
    });

    this.transitioning = false;
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
    for (const zone of this.zones.values()) zone.dispose();
    this.zones.clear();
    this.doored.clear();
    this.clutter.clear();
    this.activity.clear();
    this.cloth.clear();
    this.glitch.clear();
    this.horror.clear();
  }

  /**
   * Steps the active zone's cloths. Called from the loop after the wind ships,
   * so the cloth answers the same frame's weather the trees do.
   */
  updateCloth(dt: number, weather: Weather): void {
    this.cloth.update(this.active?.id ?? null, dt, weather, this.options.player.camera.position);
  }

  /**
   * Packs the active zone's glitch volumes into the shared uniform store.
   * Called from the loop after the clock is current and before the frame that
   * reads it — attached volumes re-read their object's world matrix here,
   * which is what lets corruption follow a thing rather than a place.
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
