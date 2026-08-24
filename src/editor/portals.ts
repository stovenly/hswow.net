import * as THREE from 'three';
import type { App } from '../app/boot';
import { doorways } from '../art/building';
import type { ManifestEnd, ManifestPortal } from '../world/document';
import { entryTagOf } from './selection';
import { groundPoint } from './shapes';
import type { Session } from './session';

/**
 * Two-click portal wiring.
 *
 * A portal is a fact about a pair of zones, so it lives in neither. The first
 * click starts a pending portal, which survives switching zones; the second, in
 * any zone, writes one entry to `world.json` with a seed rolled once and kept.
 */

export type DoorSite = ManifestEnd;

export class PortalTool {
  private readonly app: App;
  private readonly session: Session;
  private pending: DoorSite | null = null;

  say: (message: string) => void = () => {};
  onWired: (() => void) | null = null;

  constructor(app: App, session: Session) {
    this.app = app;
    this.session = session;
  }

  get armed(): boolean {
    return this.pending !== null;
  }

  cancel(): void {
    this.pending = null;
  }

  /**
   * A click while the tool is up. Snaps to a doorway on a placed building, to a
   * shell wall, or to open ground.
   */
  click(event: MouseEvent, picked: THREE.Object3D | null): void {
    const zone = this.app.zones.current?.id;
    if (!zone) return;
    const site = this.siteAt(zone, event, picked);
    if (!site) return;

    if (!this.pending) {
      this.pending = site;
      this.say(`portal from ${describe(site)} — now pick the other end`);
      return;
    }
    this.join(this.pending, site);
    this.pending = null;
  }

  /** Wires the pending end to a named zone's wall, from the zone list. */
  joinWall(zone: string, wall: '+x' | '-x' | '+z' | '-z'): void {
    if (!this.pending) return;
    this.join(this.pending, { zone, wall });
    this.pending = null;
  }

  private siteAt(zone: string, event: MouseEvent, picked: THREE.Object3D | null): DoorSite | null {
    // A placed building with a doorway: the door goes in the doorway.
    if (picked instanceof THREE.Mesh && doorways(picked).length > 0) {
      const tag = entryTagOf(picked);
      if (tag) return { zone, doorOf: tag.id };
    }
    // A room: the door goes in the wall nearest the click.
    const shell = this.session.doc(zone)?.shell;
    const at = groundPoint(this.app, event);
    if (!at) return null;
    if (shell) {
      // Whichever room the click lands in, and whichever of its walls is nearest.
      const room = shell.rooms?.find(
        (candidate) =>
          Math.abs(at.x - candidate.at[0]) <= candidate.width / 2 &&
          Math.abs(at.z - candidate.at[1]) <= candidate.depth / 2,
      );
      const box = room
        ? { width: room.width, depth: room.depth, cx: room.at[0], cz: room.at[1] }
        : { width: shell.width ?? 8, depth: shell.depth ?? 6, cx: 0, cz: 0 };
      const toX = box.width / 2 - Math.abs(at.x - box.cx);
      const toZ = box.depth / 2 - Math.abs(at.z - box.cz);
      const wall =
        toX < toZ ? (at.x > box.cx ? '+x' : '-x') : at.z > box.cz ? '+z' : '-z';
      return { zone, wall, ...(room ? { room: room.id } : {}) };
    }
    // Open ground: a freestanding door, facing whoever is looking at it.
    const yaw = round(this.app.player.heading + Math.PI);
    return { zone, at: [round(at.x), round(at.z)], yaw };
  }

  private join(a: DoorSite, b: DoorSite): void {
    const id = `${a.zone}-${b.zone}-door`;
    const portal: ManifestPortal = {
      id,
      a,
      b,
      material: 'timber',
      seed: Math.floor(Math.random() * 1_000_000),
    };
    const manifest = this.session.portals;
    manifest.portals = [...(manifest.portals ?? []).filter((held) => held.id !== id), portal];
    void this.session.saveWorld();
    this.say(`wired ${id} — reload to walk through it`);
    this.onWired?.();
  }

  /** Every place in a zone a door could stand, for picking the far end off a list. */
  sitesIn(zone: string): DoorSite[] {
    const doc = this.session.doc(zone);
    if (!doc) return [];
    const sites: DoorSite[] = [];
    if (doc.shell?.rooms) {
      for (const room of doc.shell.rooms) {
        for (const wall of ['-z', '+z', '-x', '+x'] as const) {
          sites.push({ zone, wall, room: room.id });
        }
      }
    } else if (doc.shell) {
      for (const wall of ['-z', '+z', '-x', '+x'] as const) sites.push({ zone, wall });
    }
    for (const { entry } of this.session.entries(zone)) {
      if (entry.kind !== 'prop' || !entry.id) continue;
      const built = this.app.zones.zones.get(zone);
      if (!built?.isBuilt) continue;
      let found: THREE.Object3D | null = null;
      built.root().traverse((object) => {
        const tag = object.userData.entry as { id: string } | undefined;
        if (!found && tag?.id === entry.id) found = object;
      });
      const mesh = found as THREE.Object3D | null;
      if (mesh instanceof THREE.Mesh && doorways(mesh).length > 0) {
        sites.push({ zone, doorOf: entry.id });
      }
    }
    return sites;
  }
}

function describe(site: DoorSite): string {
  if (site.doorOf) return `${site.zone}/${site.doorOf}`;
  if (site.wall) return `${site.zone} wall ${site.wall}`;
  return site.zone;
}

function round(value: number): number {
  return Math.round(value * 1000) / 1000;
}
