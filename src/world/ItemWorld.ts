import * as THREE from 'three';
import { COLLISION_LAYER } from '../layers';
import { type Collider } from '../player/Collider';
import { builderByName } from '../art/registry';
import { setCoverTreads } from '../art/cover';
import type { Inventory } from '../player/Inventory';
import {
  CONTAINERS,
  captureState,
  displayOf,
  isPickup,
  kindOf,
  restoreState,
  type Item,
} from './items';
import { hashString, rollContainer } from './loot';
import { currentWorldSeed, worldDelta, type PlacedItem } from './save';
import type { ContainerInfo, PickupInfo } from './Interaction';
import type { Zone, ZoneId } from './Zone';
import type { ZoneManager } from './ZoneManager';

/**
 * Items in the world: marks what a zone built as pickable or openable, applies
 * the player's affected records to every build, and edits the live zone when
 * something is taken or put down.
 */

/** How wide a dropped thing parts the cover: its builder radius plus a margin, held to a band. */
const TREAD_MARGIN = 0.15;
const TREAD_MIN = 0.25;
const TREAD_MAX = 0.6;

/** Metres the drop ray may reach, and how far from the feet a drop may land. */
const DROP_REACH = 5;
const DROP_RANGE = 4.5;

const COLLISION_MASK = new THREE.Layers();
COLLISION_MASK.set(COLLISION_LAYER);

const _point = new THREE.Vector3();
const _above = new THREE.Vector3();
const _down = new THREE.Vector3();
const _stack = new THREE.Box3();
const _raycaster = new THREE.Raycaster();

export class ItemWorld {
  constructor(
    private readonly zones: ZoneManager,
    private readonly collider: Collider,
    private readonly inventory: Inventory,
  ) {}

  /** Wired to `ZoneManager.onDressed`: runs once per build of every zone. */
  dressed(zone: Zone, root: THREE.Group): void {
    this.mark(zone.id, root);
    this.applyDelta(zone.id, root);
  }

  private mark(zone: ZoneId, root: THREE.Group): void {
    root.traverse((object) => {
      if (!(object instanceof THREE.Mesh) || object.userData.vista === true) return;
      if (object.userData.pickup || object.userData.container) return;
      const name = object.name;
      const holds = CONTAINERS[name];
      if (holds) {
        const info: ContainerInfo = { key: this.keyFor(zone, object), kind: name, display: holds };
        object.userData.container = info;
        if (typeof object.userData.label !== 'string') object.userData.label = holds;
        return;
      }
      if (!isPickup(name)) return;
      const key = this.keyFor(zone, object);
      const seed =
        typeof object.userData.seed === 'number'
          ? object.userData.seed
          : hashString(key) % 1_000_000;
      const item: Item = { name: displayOf(name, seed), kind: kindOf(name), builder: name, seed };
      const state = captureState(object);
      if (state) item.state = state;
      const info: PickupInfo = { key, item };
      object.userData.pickup = info;
      if (typeof object.userData.label !== 'string') object.userData.label = item.name;
    });
  }

  /**
   * Stable across rebuilds, because builds are seeded: the same entry stands
   * the same mesh at the same coordinates every time.
   */
  private keyFor(zone: ZoneId, object: THREE.Object3D): string {
    let entry: string | null = null;
    for (let node: THREE.Object3D | null = object; node; node = node.parent) {
      const tag = node.userData.entry as { id?: string } | undefined;
      if (tag?.id) {
        entry = tag.id;
        break;
      }
    }
    object.getWorldPosition(_point);
    const at = `${_point.x.toFixed(2)},${_point.y.toFixed(2)},${_point.z.toFixed(2)}`;
    return `${zone}:${entry ?? object.name}@${at}`;
  }

  private applyDelta(zone: ZoneId, root: THREE.Group): void {
    let relight = false;
    // The sparkle field is baked before this runs, so anything these records
    // take out or put down leaves it describing the document, not the save.
    let restar = false;
    if (worldDelta.removed.size > 0) {
      const gone: THREE.Object3D[] = [];
      root.traverse((object) => {
        const pickup = object.userData.pickup as PickupInfo | undefined;
        if (pickup && worldDelta.removed.has(pickup.key)) gone.push(object);
      });
      for (const object of gone) {
        restar = restar || hasSparkles(object);
        relight = this.removeFromWorld(object) || relight;
      }
    }
    for (const record of worldDelta.placedIn(zone)) {
      const mesh = this.buildPlaced(record);
      root.add(mesh);
      relight = relight || hasLights(mesh);
      restar = restar || hasSparkles(mesh);
    }
    if (relight) this.zones.rebalanceLights(zone);
    if (restar) this.zones.refreshSparkles(zone);
    this.refreshTreads(zone);
  }

  /** What the groundcover parts around. Rewritten on a drop, a pickup and every build. */
  private refreshTreads(zone: ZoneId): void {
    setCoverTreads(
      worldDelta.placedIn(zone).map((record) => {
        const builder = record.item.builder ? builderByName(record.item.builder) : undefined;
        const radius = (builder?.radius ?? 0.2) + TREAD_MARGIN;
        return {
          at: { x: record.at[0], y: record.at[1], z: record.at[2] },
          radius: Math.min(Math.max(radius, TREAD_MIN), TREAD_MAX),
        };
      }),
    );
  }

  pickup(object: THREE.Object3D): Item | null {
    const item = this.takeFromWorld(object);
    if (item) this.inventory.add(item);
    return item;
  }

  /** Removes a pickable from the world and records it, handing the item back for the caller to home — a pack, a slot, an open container. */
  takeFromWorld(object: THREE.Object3D): Item | null {
    const zone = this.zones.current;
    if (!zone?.isBuilt) return null;
    let node: THREE.Object3D | null = object;
    while (node && !node.userData.pickup) node = node.parent;
    if (!node) return null;
    const pickup = node.userData.pickup as PickupInfo;
    const solid = this.isCollidable(node);
    const starred = hasSparkles(node);
    const relight = this.removeFromWorld(node);
    // After the removal, so the rebuild reads the zone without it.
    if (starred) this.zones.refreshSparkles(zone.id);
    if (pickup.placedId) worldDelta.unplace(zone.id, pickup.placedId);
    else worldDelta.removed.add(pickup.key);
    // Invalidated, never rebuilt here: reindexing a whole zone for a candle is
    // a hitch the hand feels. The stale triangles cost a candle-shaped bump
    // underfoot until the next entry rebuilds behind the fade.
    if (solid) this.collider.invalidate(zone.id);
    if (relight) this.zones.rebalanceLights(zone.id);
    this.refreshTreads(zone.id);
    this.zones.refreshTargets();
    return cloneItem(pickup.item);
  }

  /**
   * Puts an item down where the ray lands. Released onto another item it
   * stacks naively on the top of that item's bounds; otherwise it settles
   * straight down from just short of the hit, so a drop against a wall lands
   * on the floor in front of it. False when nothing in reach would take it;
   * the caller keeps the item.
   */
  drop(item: Item, origin: THREE.Vector3, direction: THREE.Vector3, feet: THREE.Vector3): boolean {
    const zone = this.zones.current;
    if (!zone?.isBuilt || this.zones.isTransitioning) return false;

    const landing = this.landingFor(zone, origin, direction, feet);
    if (!landing) return false;
    this.placeAt(zone, item, landing, feet);
    return true;
  }

  /**
   * Moves a standing pickable to where the ray lands — a take and a drop as
   * one gesture. The landing is found first, so a refusal leaves the thing
   * exactly where it stood.
   */
  move(
    object: THREE.Object3D,
    origin: THREE.Vector3,
    direction: THREE.Vector3,
    feet: THREE.Vector3,
  ): boolean {
    const zone = this.zones.current;
    if (!zone?.isBuilt || this.zones.isTransitioning) return false;
    const landing = this.landingFor(zone, origin, direction, feet, object);
    if (!landing) return false;
    const item = this.takeFromWorld(object);
    if (!item) return false;
    this.placeAt(zone, item, landing, feet);
    return true;
  }

  private placeAt(zone: Zone, item: Item, at: [number, number, number], feet: THREE.Vector3): void {
    const record: PlacedItem = {
      id: worldDelta.mintPlacedId(),
      zone: zone.id,
      item: cloneItem(item),
      at,
      yaw: Math.atan2(feet.x - at[0], feet.z - at[2]),
    };
    const mesh = this.buildPlaced(record);
    worldDelta.place(record);
    this.refreshTreads(zone.id);
    const root = zone.root();
    const land = (): void => {
      root.add(mesh);
      if (hasLights(mesh)) this.zones.rebalanceLights(zone.id);
      if (hasSparkles(mesh)) this.zones.refreshSparkles(zone.id);
      this.zones.refreshTargets();
    };
    if (this.zones.itemWarm(mesh)) {
      land();
      return;
    }
    // The record is already in the delta; only the visual waits. A rebuild
    // meanwhile stands it up itself, which is what the root check catches.
    void this.zones
      .warmItem(mesh)
      .then(() => {
        if (this.zones.current !== zone || zone.root() !== root) return;
        land();
      })
      .catch(() => {});
  }

  /** Where a drop lands, or null when nothing in reach takes it. */
  private landingFor(
    zone: Zone,
    origin: THREE.Vector3,
    direction: THREE.Vector3,
    feet: THREE.Vector3,
    except?: THREE.Object3D,
  ): [number, number, number] | null {
    // Dropped items are not solid, so the collider never sees them; stacking
    // needs its own ray against the zone's item meshes. A move excludes the
    // thing being moved, or it would stack on itself.
    const items: THREE.Object3D[] = [];
    zone.root().traverse((object) => {
      if (object.userData.pickup && object !== except) items.push(object);
    });
    _raycaster.set(origin, direction);
    _raycaster.far = DROP_REACH;
    const struck = _raycaster.intersectObjects(items, true)[0];

    const wall = this.collider.raycast(origin, direction);

    if (struck && (wall === null || struck.distance < wall + 0.05)) {
      if (Math.hypot(struck.point.x - feet.x, struck.point.z - feet.z) > DROP_RANGE) return null;
      let holder: THREE.Object3D | null = struck.object;
      while (holder && !holder.userData.pickup) holder = holder.parent;
      if (holder) {
        _stack.setFromObject(holder, true);
        return [struck.point.x, _stack.max.y, struck.point.z];
      }
    }

    if (wall === null || wall > DROP_REACH) return null;
    _point.copy(origin).addScaledVector(direction, Math.max(wall - 0.05, 0));
    if (Math.hypot(_point.x - feet.x, _point.z - feet.z) > DROP_RANGE) return null;
    // Capped at eye height: lifted through a ceiling, the settle would land the
    // drop on its unreachable top. Tops of surfaces only, and only below the eye.
    _above.set(_point.x, Math.min(_point.y + 0.4, origin.y), _point.z);
    const fall = this.collider.raycast(_above, _down.set(0, -1, 0));
    if (fall === null || fall > 3) return null;
    return [_point.x, _above.y - fall, _point.z];
  }

  containerContents(key: string, kind: string): Item[] {
    const stored = worldDelta.containers.get(key);
    if (stored) return stored.map(cloneItem);
    return rollContainer(kind, key, currentWorldSeed());
  }

  setContainer(key: string, items: readonly Item[]): void {
    worldDelta.setContainer(key, items);
  }

  private buildPlaced(record: PlacedItem): THREE.Object3D {
    const own = record.item.builder ? builderByName(record.item.builder) : undefined;
    const stand = own ?? builderByName('sack');
    if (!stand) throw new Error('no builder to stand a dropped item on');
    const seed = record.item.seed ?? hashString(record.item.name) % 1_000_000;
    const mesh = stand.build(own ? { seed } : { seed, scale: 0.55 });
    mesh.position.set(record.at[0], record.at[1], record.at[2]);
    // rotateY(yaw) takes +Z to the bearing back toward whoever dropped it.
    mesh.rotation.y = record.yaw;
    mesh.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      const glow = object.userData.noCollide === true;
      object.castShadow = !glow;
      object.receiveShadow = !glow;
    });
    mesh.userData.label = record.item.name;
    restoreState(mesh, record.item.state);
    const info: PickupInfo = { key: record.id, item: cloneItem(record.item), placedId: record.id };
    mesh.userData.pickup = info;
    return mesh;
  }

  private isCollidable(root: THREE.Object3D): boolean {
    let solid = false;
    root.traverse((object) => {
      if (object instanceof THREE.Mesh && object.layers.test(COLLISION_MASK)) solid = true;
    });
    return solid;
  }

  /** Removes and frees a pickable. True when it carried lights — the caller owes the zone a census rebalance. */
  private removeFromWorld(object: THREE.Object3D): boolean {
    const lit = hasLights(object);
    object.removeFromParent();
    release(object);
    return lit;
  }

}

function cloneItem(item: Item): Item {
  return { ...item, state: item.state ? { ...item.state } : undefined };
}

/** Whether anything under `root` seeds star sites — see `art/sparkle.ts`. */
function hasSparkles(root: THREE.Object3D): boolean {
  let starred = false;
  root.traverse((object) => {
    if (object instanceof THREE.Mesh && object.geometry.userData.sparkleSites) starred = true;
  });
  return starred;
}

function hasLights(root: THREE.Object3D): boolean {
  let lit = false;
  root.traverse((child) => {
    if (child instanceof THREE.Light) lit = true;
  });
  return lit;
}

function release(root: THREE.Object3D): void {
  root.traverse((object) => {
    if (
      object instanceof THREE.Mesh ||
      object instanceof THREE.LineSegments ||
      object instanceof THREE.Points
    ) {
      object.geometry.dispose();
      for (const material of [object.material].flat()) {
        if (material.userData.owned) material.dispose();
      }
    }
  });
}
