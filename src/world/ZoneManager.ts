import * as THREE from 'three';
import { Zone, type ZoneDefinition, type ZoneId, type Placement } from './Zone';
import { PortalGraph, type PortalDefinition, type PortalSide } from './Portal';
import type { Interaction } from './Interaction';
import { buildDoor, doorMetrics, doorName } from '../art/builders/door';
import { markCollidable, type Collider } from '../player/Collider';
import type { Controller } from '../player/Controller';
import type { PostFX } from '../engine/PostFX';
import type { AudioEngine } from '../audio/AudioEngine';
import type { Footsteps, SurfaceName } from '../audio/models/footsteps';
import { DoorAudio } from '../audio/models/door';
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

  private active: Zone | null = null;
  /** Zones whose portal doors have been built into them. */
  private doored = new Set<ZoneId>();
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
    this.lights.sun.position.set(-8, 12, 6);
    // Opposed on both horizontal axes but still above, so it lifts the walls
    // the sun misses without lighting the ceiling from underneath.
    this.lights.fill.position.set(9, 7, -7);
    options.scene.add(this.lights.sun, this.lights.fill, this.lights.ambient);
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
  }

  /**
   * What the ground sounds like at a position in the active zone.
   *
   * Zones declare one floor material, which is right for a room and wrong for
   * anywhere outdoors — walking off a cobbled yard onto grass has to change the
   * sound or the ground cover is only paint. A zone that varies overrides this.
   */
  surfaceAt(x: number, z: number): SurfaceName {
    const zone = this.active;
    if (!zone) return 'earth';
    return zone.definition.surfaceAt?.(x, z) ?? zone.environment.surface;
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
  enter(id: ZoneId, at?: Placement): void {
    const zone = this.zones.get(id);
    if (!zone) throw new Error(`no such zone "${id}"`);

    const { scene, collider, player, postfx, interaction } = this.options;

    if (this.active && this.active !== zone) scene.remove(this.active.root());

    const root = this.prepare(zone);
    scene.add(root);
    this.active = zone;

    // Triangles are read straight out of the graph, and this subtree may never
    // have been rendered — its world matrices are whatever they were left as.
    root.updateWorldMatrix(true, true);
    // Keyed by zone, so re-entering a place the player has been before costs
    // nothing. See `Collider.build`.
    collider.build(root, zone.id);

    const env = zone.environment;
    postfx.setEnvironment({
      sky: env.sky,
      fogColor: env.fogColor,
      fogNear: env.fogNear,
      fogFar: env.fogFar,
    });

    this.lights.sun.intensity = env.sunIntensity;
    this.lights.sun.color.setHex(env.sunColor);
    this.lights.fill.intensity = env.fillIntensity;
    this.lights.fill.color.setHex(env.fillColor);
    this.lights.ambient.intensity = env.ambientIntensity;
    this.lights.ambient.color.setHex(env.ambientSky);
    this.lights.ambient.groundColor.setHex(env.ambientGround);

    this.applyAudio(zone);

    interaction.setTargets(
      this.portals
        .in(zone.id)
        .map((side) => side.door)
        .filter((door): door is THREE.Mesh => door !== null),
    );

    // Settled onto the zone's ground: an arrival is derived by stepping out
    // from a door, which keeps the door's height, and outdoors that is only
    // right if the ground happens to be level there.
    const placement = zone.settle(at ?? zone.spawn);
    player.teleport(placement.position, placement.yaw);

    // Whatever was under the crosshair belonged to the zone we just left.
    this.hovered = null;
    this.options.reticle.set(null);

    this.onZoneChange?.(zone);
  }

  private applyAudio(zone: Zone): void {
    if (!this.audio) return;
    this.audio.engine.setRoom(zone.environment.room);
    this.audio.footsteps.surface = zone.environment.surface;
    this.audio.footsteps.setReverb(zone.environment.footstepReverb);
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
    reticle.set(this.hovered ? { title: this.hovered.title, target: this.hovered.label } : null);
    return this.hovered;
  }

  /**
   * Uses a door.
   *
   * The door sound is fired *before* the fade and is not awaited. It is
   * scheduled onto the audio clock in one go at this moment, so it survives the
   * zone being torn down and rebuilt underneath it — the tail carries across
   * the cut, which is most of what makes the transition feel like walking
   * through a door rather than a screen wipe.
   *
   * One sound, here, and nothing on arrival. A second cue on the far side read
   * as a second event rather than as the other half of the same one.
   */
  async use(side: PortalSide): Promise<void> {
    if (this.transitioning) return;
    this.transitioning = true;
    this.options.reticle.set(null);

    const material = side.door ? doorMetrics(side.door).material : 'timber';
    // Heard from where the door is, at head height rather than at its foot.
    _at.copy(side.end.position).setY(side.end.position.y + 1.2);
    this.doorAudio?.play(_at, material);

    await this.options.fade.cover(() => {
      this.enter(side.target.zone, side.arrival);
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
    for (const zone of this.zones.values()) zone.dispose();
    this.zones.clear();
    this.doored.clear();
  }
}

const _at = new THREE.Vector3();
