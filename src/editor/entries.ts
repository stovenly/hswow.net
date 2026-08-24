import type { ZoneDocument } from '../world/document';
import type { Entry } from '../world/entry';
import type { Session } from './session';

/**
 * Adding, copying and removing entries.
 *
 * Ids are minted once from the builder name and a counter and never re-minted:
 * they are what `on`, emitter anchors, portal ends and the player-state override
 * layer point at.
 */

export function listOf(doc: ZoneDocument): Entry[] {
  if (doc.layers) return doc.layers.flatMap((layer) => [...layer.entries]);
  return [...(doc.entries ?? [])];
}

function write(doc: ZoneDocument, entries: Entry[]): void {
  if (doc.layers) doc.layers = [{ ...doc.layers[0], entries }];
  else doc.entries = entries;
}

/** A short slug from the builder name and a counter, unique in this zone. */
export function mintId(doc: ZoneDocument, stem: string): string {
  const taken = new Set(listOf(doc).map((entry) => entry.id));
  for (let n = 1; ; n++) {
    const id = `${stem}-${n}`;
    if (!taken.has(id)) return id;
  }
}

export function addEntry(session: Session, zone: string, entry: Entry, stem: string): string | null {
  const doc = session.doc(zone);
  if (!doc) return null;
  const id = mintId(doc, stem);
  session.commit(zone, 'zone', (target) => {
    write(target, [...listOf(target), { ...entry, id }]);
  });
  return id;
}

/** Copies entries offset by a radius, re-rolling only the copies' seeds. */
export function duplicateEntries(session: Session, zone: string, ids: readonly string[], offset: number): string[] {
  const doc = session.doc(zone);
  if (!doc) return [];
  const made: string[] = [];
  session.commit(zone, 'zone', (target) => {
    const entries = listOf(target);
    for (const id of ids) {
      const source = entries.find((entry) => entry.id === id);
      if (!source) continue;
      const stem = stemOf(source);
      const copy = JSON.parse(JSON.stringify(source)) as Entry & { seed?: number };
      copy.id = mintId({ ...target, entries } as ZoneDocument, stem);
      // Only the copy: the original keeps its seed, always.
      copy.seed = Math.floor(Math.random() * 1_000_000);
      const at = copy.at as number[] | undefined;
      if (at && at.length >= 2) {
        copy.at = at.length >= 3 ? [at[0] + offset, at[1], at[2] + offset] : [at[0] + offset, at[1] + offset];
      }
      entries.push(copy);
      made.push(copy.id);
    }
    write(target, entries);
  });
  return made;
}

/** Pastes entries into a zone, with fresh ids and their seeds kept. */
export function pasteEntries(
  session: Session,
  zone: string,
  clipboard: readonly Entry[],
  inPlace: boolean,
  at?: readonly [number, number],
): string[] {
  const doc = session.doc(zone);
  if (!doc) return [];
  const made: string[] = [];
  session.commit(zone, 'zone', (target) => {
    const entries = listOf(target);
    for (const source of clipboard) {
      const copy = JSON.parse(JSON.stringify(source)) as Entry;
      copy.id = mintId({ ...target, entries } as ZoneDocument, stemOf(source));
      if (!inPlace && at) copy.at = [at[0], at[1]];
      entries.push(copy);
      made.push(copy.id as string);
    }
    write(target, entries);
  });
  return made;
}

export function removeEntries(session: Session, zone: string, ids: readonly string[]): void {
  const gone = new Set(ids);
  session.commit(session.doc(zone)?.id ?? zone, 'zone', (target) => {
    write(
      target,
      listOf(target).filter((entry) => !gone.has(entry.id ?? '')),
    );
  });
}

/** Moves one entry to sit before another. Document order is build order. */
export function reorderEntry(session: Session, zone: string, from: string, to: string): void {
  session.commit(zone, 'zone', (target) => {
    const entries = listOf(target);
    const at = entries.findIndex((entry) => entry.id === from);
    if (at < 0) return;
    const [moved] = entries.splice(at, 1);
    const before = entries.findIndex((entry) => entry.id === to);
    entries.splice(before < 0 ? entries.length : before, 0, moved);
    write(target, entries);
  });
}

/** Composes a set of entries into a named prefab on the document. */
export function makePrefab(session: Session, zone: string, ids: readonly string[], name: string): void {
  session.commit(zone, 'zone', (target) => {
    const kept = new Set(ids);
    const body = listOf(target).filter((entry) => kept.has(entry.id ?? ''));
    if (body.length === 0) return;
    target.prefabs = { ...target.prefabs, [name]: JSON.parse(JSON.stringify(body)) as Entry[] };
  });
}

function stemOf(entry: Entry): string {
  const named = entry as { builder?: string; prefab?: string };
  return named.builder ?? named.prefab ?? entry.kind;
}

/** A blank document, exterior or interior. */
export function templateDocument(id: string, name: string, kind: 'exterior' | 'interior'): ZoneDocument {
  if (kind === 'interior') {
    return {
      id,
      name,
      environment: { base: 'indoor' },
      spawn: { at: [0, 0.1, 2], yaw: 'north' },
      floor: -5,
      shell: { width: 8, depth: 6, height: 3, seed: 1, style: 'house', planks: true, beams: 3 },
      entries: [],
    };
  }
  return {
    id,
    name,
    environment: { base: 'outdoor' },
    place: { at: [0, 0] },
    spawn: { at: [0, 0], yaw: 'north' },
    floor: -20,
    terrain: { size: 96, resolution: 3, base: 'turf', landforms: [] },
    entries: [],
  };
}
