import * as THREE from 'three';
import type { App } from '../app/boot';
import {
  rebuildEntry,
  zoneFromDocument,
  type PortalManifest,
  type ZoneDocument,
} from '../world/document';
import type { Entry } from '../world/entry';
import { applyPlacement, type EntryPlacement } from '../world/entry';
import { Api, SaveConflict } from './api';
import { moved } from './matrices';

/**
 * The documents the editor is holding, what has changed in them, and how a
 * change reaches the world.
 *
 * Every commit is document to world, one direction. Nothing here reads the
 * scene graph back into a document.
 */

/** How long after the last change one entry is raised again. */
const ENTRY_DELAY = 120;
/** And how long after the last change the whole zone is. */
const REBUILD_DELAY = 250;
/** And how long after that the file is written. */
const SAVE_DELAY = 1000;

/**
 * What a change costs to show.
 *
 * `transform` moves the built object and re-indexes nothing else. `entry`
 * builds that one object again and swaps it in — a re-rolled seed, a changed
 * builder option. `zone` raises the whole level, which is what terrain, a
 * scatter rule, a shell or a layer condition need, and what makes the world
 * blink; nothing should ask for it that does not need it.
 */
export type Reach = 'transform' | 'entry' | 'zone';

interface Step {
  zone: string;
  before: string;
  after: string;
}

export class Session {
  readonly app: App;
  readonly api: Api;
  private readonly docs = new Map<string, ZoneDocument>();
  private manifest: PortalManifest = { portals: [] };
  private readonly dirty = new Set<string>();
  private readonly undoStack: Step[] = [];
  private readonly redoStack: Step[] = [];
  private rebuildTimer = 0;
  private saveTimer = 0;
  private readonly pendingRebuild = new Set<string>();
  /** Zones whose octree is behind the props. See `reindex`. */
  private readonly stale = new Set<string>();
  /**
   * Each document as it stood after the last commit.
   *
   * **`commit` is the only thing allowed to write to a document.** A panel that
   * binds a control straight to one, or seeds a missing field so a control has
   * something to sit on, has changed the level by being opened — and autosave
   * will put it on disk. An absent field is not the same as its default: a
   * skirt with no `sink` falls six metres under the level, and one written as
   * `sink: 0` sits on it and z-fights the whole thing.
   *
   * So every commit checks the document still looks the way it left it, and
   * puts back anything that was written behind its back.
   */
  private readonly canonical = new Map<string, string>();
  /** Entries waiting to be raised again on their own, by `zone/id`. */
  private readonly pendingEntries = new Set<string>();
  private entryTimer = 0;
  /** What the editor is holding, so a swap can hand back the new object. */
  onReplaced: ((zone: string, id: string, object: THREE.Object3D) => void) | null = null;

  /** Called after anything changes: the status line, the dirty dot, the rings. */
  onChange: (() => void) | null = null;
  /**
   * Called only when the *shape* of a document changed — an entry added,
   * removed or reordered, a layer edited, a snapshot restored, a zone made.
   *
   * The panels rebuild from this and never from `onChange`. A slider being
   * dragged commits on every frame, and a panel that rebuilt itself each time
   * would destroy the control under the mouse.
   */
  onStructure: (() => void) | null = null;
  /** Called with a line for the status bar. */
  say: (message: string) => void = () => {};

  constructor(app: App) {
    this.app = app;
    this.api = new Api(app.project.id);
  }

  /** Adopts the documents the page booted with, so nothing is fetched twice. */
  adopt(documents: readonly ZoneDocument[], manifest: PortalManifest): void {
    for (const doc of documents) {
      this.docs.set(doc.id, doc);
      this.canonical.set(doc.id, JSON.stringify(doc));
    }
    this.manifest = manifest;
    // The mtimes the writes will be checked against.
    void this.api.zones().catch(() => {});
  }

  get zones(): readonly ZoneDocument[] {
    return [...this.docs.values()];
  }

  doc(zone: string): ZoneDocument | undefined {
    return this.docs.get(zone);
  }

  get portals(): PortalManifest {
    return this.manifest;
  }

  isDirty(zone: string): boolean {
    return this.dirty.has(zone);
  }

  /** Every entry in a document, in build order, with the layer it came from. */
  entries(zone: string): { entry: Entry; layer: string }[] {
    const doc = this.docs.get(zone);
    if (!doc) return [];
    if (doc.layers) {
      return doc.layers.flatMap((layer) =>
        layer.entries.map((entry) => ({ entry, layer: layer.name })),
      );
    }
    return (doc.entries ?? []).map((entry) => ({ entry, layer: 'main' }));
  }

  entry(zone: string, id: string): Entry | undefined {
    return this.entries(zone).find((row) => row.entry.id === id)?.entry;
  }

  /** Replaces a document's entry list, wherever the entries live. */
  setEntries(doc: ZoneDocument, entries: Entry[]): void {
    if (doc.layers) {
      // One layer for now; the layer editor is a later step and this keeps the
      // file honest until then.
      doc.layers = [{ ...doc.layers[0], entries }];
    } else {
      doc.entries = entries;
    }
  }

  /**
   * Mutates a document and schedules whatever the change needs.
   *
   * `transform` means the entry's placement moved and nothing else, which the
   * built object can take directly: the mesh is repositioned and the zone's
   * collider re-indexed, with no rebuild at all. Anything else is a full zone
   * rebuild through the eviction path, debounced.
   */
  commit(zone: string, reach: Reach, mutate: (doc: ZoneDocument) => void, entry?: string): void {
    const doc = this.docs.get(zone);
    if (!doc) return;

    let before = JSON.stringify(doc);
    const canon = this.canonical.get(zone);
    if (canon !== undefined && canon !== before) {
      console.warn(`document "${zone}" was written to outside a commit; putting it back`);
      writeInto(doc, JSON.parse(canon) as ZoneDocument);
      before = canon;
    }

    mutate(doc);
    const after = JSON.stringify(doc);
    if (before === after) return;
    this.canonical.set(zone, after);

    this.undoStack.push({ zone, before, after });
    this.redoStack.length = 0;
    this.dirty.add(zone);
    this.schedule(zone, reach, entry);
    this.onChange?.();
  }

  /** Says the document's shape changed, so the panels redraw. */
  structureChanged(): void {
    this.onStructure?.();
  }

  private schedule(zone: string, reach: Reach, entry?: string): void {
    if (reach === 'entry' && entry) {
      this.pendingEntries.add(`${zone}/${entry}`);
      window.clearTimeout(this.entryTimer);
      this.entryTimer = window.setTimeout(() => void this.flushEntries(), ENTRY_DELAY);
    }
    if (reach === 'zone') {
      this.pendingRebuild.add(zone);
      window.clearTimeout(this.rebuildTimer);
      this.rebuildTimer = window.setTimeout(() => void this.flushRebuild(), REBUILD_DELAY);
    }
    window.clearTimeout(this.saveTimer);
    this.saveTimer = window.setTimeout(() => void this.saveAll(), SAVE_DELAY);
  }

  private async flushRebuild(): Promise<void> {
    const zones = [...this.pendingRebuild];
    this.pendingRebuild.clear();
    for (const zone of zones) {
      this.say(`rebuilding ${zone}…`);
      await this.app.zones.rebuild(zone);
      this.stale.delete(zone);
    }
    this.say('');
    this.onChange?.();
  }

  /**
   * Raises each waiting entry again on its own. Anything the interpreter cannot
   * build alone falls back to raising its zone.
   */
  private async flushEntries(): Promise<void> {
    const waiting = [...this.pendingEntries];
    this.pendingEntries.clear();
    for (const key of waiting) {
      const [zone, id] = splitKey(key);
      const from = this.objectFor(zone, id);
      const to = from ? rebuildEntry(zone, id) : null;
      if (!from || !to) {
        this.pendingRebuild.add(zone);
        continue;
      }
      await this.app.zones.replaceObject(zone, from, to);
      this.stale.add(zone);
      this.onReplaced?.(zone, id, to);
    }
    if (this.pendingRebuild.size > 0) await this.flushRebuild();
    this.onChange?.();
  }

  /** The built object for an entry id, or nothing. */
  objectFor(zone: string, id: string): THREE.Object3D | null {
    const held = this.app.zones.zones.get(zone);
    if (!held?.isBuilt) return null;
    return findEntryObject(held.root(), zone, id) ?? null;
  }

  /** Forces the debounced rebuild to happen now. */
  async rebuildNow(zone: string): Promise<void> {
    window.clearTimeout(this.rebuildTimer);
    this.pendingRebuild.add(zone);
    await this.flushRebuild();
  }

  /**
   * Moves a built object to where its entry now says, and re-indexes the zone.
   * The transform fast path: no builder is called and nothing is disposed.
   */
  reposition(zone: string, entry: Entry, object: THREE.Object3D): void {
    const definition = this.app.zones.zones.get(zone);
    if (!definition) return;
    applyPlacement(object, entry as EntryPlacement, {
      groundAt: (x, z) => definition.definition.groundAt?.(x, z) ?? 0,
      resolve: (id) => findEntryObject(definition.root(), zone, id),
    });
    moved(object);
    this.reindex(zone);
  }

  /**
   * Says the zone's collision is out of date. It is *not* rebuilt here:
   * indexing a level the size of the village is a second of blocked main
   * thread, and nothing in Fly collides with anything.
   */
  reindex(zone: string): void {
    this.stale.add(zone);
  }

  /**
   * Rebuilds the collision if a move has left it behind. Called on the way into
   * Play, which is the only place it is asked to be right.
   */
  settleCollision(zone: string): void {
    if (!this.stale.delete(zone)) return;
    const held = this.app.zones.zones.get(zone);
    if (!held?.isBuilt) return;
    this.app.collider.invalidate(zone);
    if (this.app.zones.current?.id === zone) this.app.collider.build(held.root(), zone);
  }

  /** Whether a zone's octree is behind where its props now are. */
  collisionStale(zone: string): boolean {
    return this.stale.has(zone);
  }

  undo(): void {
    const step = this.undoStack.pop();
    if (!step) return;
    this.redoStack.push(step);
    this.restore(step.zone, step.before);
  }

  redo(): void {
    const step = this.redoStack.pop();
    if (!step) return;
    this.undoStack.push(step);
    this.restore(step.zone, step.after);
  }

  private restore(zone: string, snapshot: string): void {
    const doc = this.docs.get(zone);
    if (!doc) return;
    // In place, because the zone definition closed over this object when it was
    // interpreted and a replacement would leave the world reading the old one.
    writeInto(doc, JSON.parse(snapshot) as ZoneDocument);
    this.canonical.set(zone, snapshot);
    this.dirty.add(zone);
    this.schedule(zone, 'zone');
    this.onChange?.();
    this.structureChanged();
  }

  async saveAll(): Promise<void> {
    for (const zone of [...this.dirty]) {
      const doc = this.docs.get(zone);
      if (!doc) continue;
      try {
        await this.api.saveZone(doc);
        this.dirty.delete(zone);
      } catch (error) {
        if (error instanceof SaveConflict) {
          this.say(`${zone}: the file on disk is newer — reload or overwrite`);
          return;
        }
        this.say(`${zone}: ${error instanceof Error ? error.message : String(error)}`);
        return;
      }
    }
    this.say('saved');
    this.onChange?.();
  }

  /** Adds a document and registers it as a zone, without a reload. */
  createZone(doc: ZoneDocument): void {
    this.docs.set(doc.id, doc);
    this.canonical.set(doc.id, JSON.stringify(doc));
    this.app.zones.register(zoneFromDocument(doc));
    this.dirty.add(doc.id);
    void this.api.saveZone(doc).then(() => this.dirty.delete(doc.id));
    this.onChange?.();
    this.structureChanged();
  }

  async deleteZone(id: string): Promise<void> {
    this.docs.delete(id);
    this.canonical.delete(id);
    this.dirty.delete(id);
    await this.api.deleteZone(id);
    this.onChange?.();
    this.structureChanged();
  }

  async saveWorld(): Promise<void> {
    await this.api.saveWorld(this.manifest);
  }
}

/** The first object in a zone tagged with an entry id. */
export function findEntryObject(
  root: THREE.Object3D,
  zone: string,
  id: string,
): THREE.Object3D | undefined {
  let found: THREE.Object3D | undefined;
  root.traverse((object) => {
    if (found) return;
    const tag = object.userData.entry as { zone: string; id: string } | undefined;
    if (tag && tag.zone === zone && tag.id === id) found = object;
  });
  return found;
}

/** Replaces a document's contents without replacing the object itself. */
function writeInto(doc: ZoneDocument, from: ZoneDocument): void {
  const held = doc as unknown as Record<string, unknown>;
  for (const key of Object.keys(held)) delete held[key];
  Object.assign(held, from);
}

function splitKey(key: string): [string, string] {
  const at = key.indexOf('/');
  return [key.slice(0, at), key.slice(at + 1)];
}
