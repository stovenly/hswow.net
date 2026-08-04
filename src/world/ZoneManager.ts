import * as THREE from 'three';
import { Zone, type ZoneDefinition, type ZoneId, type Placement } from './Zone';
import { PortalGraph, type PortalDefinition, type PortalSide } from './Portal';
import { residentZones, KEEP_WITHIN } from './residency';
import { labelOf, type Interaction } from './Interaction';
import { buildDoor, doorMetrics, doorName } from '../art/door';
import { coverFor } from '../art/cover';
import { setZoneWind } from '../art/sway';
import { markCollidable, type Collider } from '../player/Collider';
import { Building } from '../ui/Building';
import type { Controller } from '../player/Controller';
import type { PostFX } from '../engine/PostFX';
import type { AudioEngine } from '../audio/AudioEngine';
import type { Footsteps, SurfaceName } from '../audio/models/footsteps';
import { DoorAudio } from '../audio/models/door';
import { Soundscape } from '../audio/Soundscape';
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
  /** Zones whose portal doors have been built into them. */
  private doored = new Set<ZoneId>();
  /** Whether grass and small flowers cast. See `setClutterShadows`. */
  private clutterShadows = false;
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

  /**
   * Whether grass and small flowers cast. Off by default — see `art/clutter.ts`.
   *
   * Applies to zones already standing, not only to ones built after the switch.
   * Half the point of the control is watching the frame cost move while looking
   * at the same field of grass, and a setting that only takes effect through a
   * door is not a setting, it is a build flag with a dial on it.
   */
  setClutterShadows(enabled: boolean): void {
    if (enabled === this.clutterShadows) return;
    this.clutterShadows = enabled;

    for (const zone of this.zones.values()) {
      // Only what is already standing. Reading `root()` here would *build*
      // every zone in the world to change a shadow flag on it.
      if (!zone.isBuilt) continue;
      zone.root().traverse((object) => {
        if (object instanceof THREE.Mesh && object.userData.clutter === true) {
          object.castShadow = enabled;
        }
      });
    }

    // The map is drawn from a `needsUpdate` set once a frame, so the next frame
    // picks this up on its own — no invalidation needed here.
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
  prebuild(id: ZoneId): void {
    const zone = this.zones.get(id);
    if (!zone) return;
    const root = this.prepare(zone);
    root.updateWorldMatrix(true, true);
    this.options.collider.warm(root, zone.id);
    // Prebuilding pays the whole cost up front, so entering later must take the
    // silent path — that is the entire point of doing it at boot.
    this.warmed.add(zone.id);
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
    const keep = residentZones(this.portals, this.active.id, KEEP_WITHIN);

    for (const zone of this.zones.values()) {
      if (!zone.isBuilt || keep.has(zone.id)) continue;

      zone.dispose();
      this.options.collider.invalidate(zone.id);
      this.doored.delete(zone.id);
      this.warmed.delete(zone.id);
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
   * was put there. What the prop is made of is measured off its own geometry at
   * build time — see `art/underfoot.ts` — so nothing has to be declared twice
   * and re-colouring a thing changes what it sounds like.
   */
  surfaceAt(x: number, z: number, feet = -Infinity): SurfaceName {
    const zone = this.active;
    if (!zone) return 'soil';
    // **Widened by the capsule's radius, because you are held up by whatever is
    // under any part of your feet — not by whatever is under their centre.**
    // A railing is narrower than a stride: stand on one and lean, and a point
    // test loses it the moment your middle is past the edge, so the rail you
    // are plainly balanced on goes back to sounding like the floor below.
    return (
      zone.standingOn(x, z, feet, this.options.player.tuning.radius) ??
      zone.definition.surfaceAt?.(x, z) ??
      zone.environment.surface
    );
  }

  attachAudio(audio: ZoneAudio): void {
    this.audio = audio;
    this.doorAudio = new DoorAudio(audio.engine);
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

    if (this.active && this.active !== zone) scene.remove(this.active.root());

    const root = this.prepare(zone);
    if (cold) {
      // Still indeterminate: indexing the octree is the longer of the two and
      // is equally unable to say how far through it is.
      await this.building.step('settling the ground');
      if (stale()) return;
    }
    scene.add(root);
    this.active = zone;

    // Triangles are read straight out of the graph, and this subtree may never
    // have been rendered — its world matrices are whatever they were left as.
    root.updateWorldMatrix(true, true);
    // Keyed by zone, so re-entering a place the player has been before costs
    // nothing. See `Collider.build`. This is the single most expensive step on
    // a dense zone, which is why it gets the yield before it rather than after.
    collider.build(root, zone.id);
    this.warmed.add(zone.id);
    if (cold) await this.building.step('almost there', 0.96);

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
  }

  /**
   * Drives the active zone's ambience.
   *
   * Separate from `update` on the loop because the listener has to be moved
   * before anything is judged against it — the caller pumps the engine first
   * and passes on whether the occlusion raycasts are due this frame.
   */
  updateSound(dt: number, retestOcclusion: boolean): void {
    if (!this.active) return;
    this.soundscapes.get(this.active.id)?.update(dt, this.options.collider, retestOcclusion);
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
    // - **Clutter casts only when asked.** Grass and small flowers are the bulk
    //   of the object count in an outdoor zone and a couple of pixels each on
    //   screen. Off by default and switchable; see `art/clutter.ts`.
    const grounds: THREE.Mesh[] = [];
    root.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      const glow = object.userData.noCollide === true;
      const ground =
        object.name === 'flatGround' ||
        object.name === 'terrain' ||
        object.userData.ground === true;
      const clutter = object.userData.clutter === true;
      object.castShadow = !glow && !ground && (!clutter || this.clutterShadows);
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

    return root;
  }

  /**
   * Per-frame: what is under the crosshair, and should the prompt be showing.
   *
   * Returns the side the player could use right now, so the caller can act on
   * the interact key without probing a second time.
   */
  update(): PortalSide | null {
    const { interaction, collider, player, reticle } = this.options;

    if (this.transitioning) {
      reticle.set(null);
      return null;
    }

    const hover = interaction.probe(player.camera, collider);
    this.hovered = hover ? this.portals.sideOf(hover.object) : null;
    if (this.hovered) {
      reticle.set({ title: this.hovered.title, target: this.hovered.label });
    } else {
      // Not a door. It may still be something with a name on it — a sign — in
      // which case the tooltip shows and `null` comes back, so the interact key
      // does nothing. Readable and not usable is a real state, and the one a
      // caption is in.
      const label = labelOf(hover?.object ?? null);
      reticle.set(label ? { title: label } : null);
    }
    return this.hovered;
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
    for (const zone of this.zones.values()) zone.dispose();
    this.zones.clear();
    this.doored.clear();
  }
}
