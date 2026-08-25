import * as THREE from 'three';
import type { App } from '../app/boot';
import { zoneFromDocument, type ZoneDocument, type PortalManifest } from '../world/document';
import type { Entry } from '../world/entry';
import { applyPlacement, type EntryPlacement } from '../world/entry';
import { Api, SaveConflict } from './api';

/**
 * The documents the editor is holding, what has changed in them, and how a
 * change reaches the world.
 *
 * Every commit is document to world, one direction. Nothing here reads the
 * scene graph back into a document.
 */

/** How long after the last change a full rebuild runs. */
const REBUILD_DELAY = 250;
/** And how long after that the file is written. */
const SAVE_DELAY = 1000;

export type Reach = 'transform' | 'zone';

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
    for (const doc of documents) this.docs.set(doc.id, doc);
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
  commit(zone: string, reach: Reach, mutate: (doc: ZoneDocument) => void): void {
    const doc = this.docs.get(zone);
    if (!doc) return;
    const before = JSON.stringify(doc);
    mutate(doc);
    const after = JSON.stringify(doc);
    if (before === after) return;

    this.undoStack.push({ zone, before, after });
    this.redoStack.length = 0;
    this.dirty.add(zone);
    this.schedule(zone, reach);
    this.onChange?.();
  }

  /** Says the document's shape changed, so the panels redraw. */
  structureChanged(): void {
    this.onStructure?.();
  }

  private schedule(zone: string, reach: Reach): void {
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
    }
    this.say('');
    this.onChange?.();
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
    object.updateWorldMatrix(true, true);
    this.reindex(zone);
  }

  reindex(zone: string): void {
    const held = this.app.zones.zones.get(zone);
    if (!held?.isBuilt) return;
    this.app.collider.invalidate(zone);
    if (this.app.zones.current?.id === zone) this.app.collider.build(held.root(), zone);
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
    const held = doc as unknown as Record<string, unknown>;
    for (const key of Object.keys(held)) delete held[key];
    Object.assign(doc, JSON.parse(snapshot));
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
    this.app.zones.register(zoneFromDocument(doc));
    this.dirty.add(doc.id);
    void this.api.saveZone(doc).then(() => this.dirty.delete(doc.id));
    this.onChange?.();
    this.structureChanged();
  }

  async deleteZone(id: string): Promise<void> {
    this.docs.delete(id);
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
