import type { Item } from './items';

/**
 * The world seed, the player's affected records, and the save slots.
 *
 * A fresh page load mints a fresh seed and an empty delta: nothing is loaded
 * unless the player asks. The delta is everything the player has changed about
 * the derived world — what was taken, what was put down, what a container now
 * holds — keyed so a rebuild from the recipe can be corrected afterward.
 */

export interface PlacedItem {
  id: string;
  zone: string;
  item: Item;
  at: [number, number, number];
  yaw: number;
}

export interface DeltaData {
  removed: string[];
  placed: PlacedItem[];
  containers: [string, Item[]][];
}

export class WorldDelta {
  readonly removed = new Set<string>();
  private readonly placed = new Map<string, PlacedItem[]>();
  readonly containers = new Map<string, Item[]>();
  private seq = 1;

  mintPlacedId(): string {
    return `p${this.seq++}`;
  }

  place(record: PlacedItem): void {
    const list = this.placed.get(record.zone);
    if (list) list.push(record);
    else this.placed.set(record.zone, [record]);
  }

  unplace(zone: string, id: string): void {
    const list = this.placed.get(zone);
    if (!list) return;
    const at = list.findIndex((record) => record.id === id);
    if (at >= 0) list.splice(at, 1);
  }

  placedIn(zone: string): readonly PlacedItem[] {
    return this.placed.get(zone) ?? [];
  }

  setContainer(key: string, items: readonly Item[]): void {
    this.containers.set(
      key,
      items.map((item) => ({ ...item })),
    );
  }

  serialize(): DeltaData {
    return {
      removed: [...this.removed],
      placed: [...this.placed.values()].flat(),
      containers: [...this.containers.entries()].map(([key, items]) => [
        key,
        items.map((item) => ({ ...item })),
      ]),
    };
  }

  replace(data: DeltaData): void {
    this.removed.clear();
    this.placed.clear();
    this.containers.clear();
    this.seq = 1;
    for (const key of data.removed) this.removed.add(key);
    for (const record of data.placed) {
      this.place(record);
      const numbered = /^p(\d+)$/.exec(record.id);
      if (numbered) this.seq = Math.max(this.seq, Number(numbered[1]) + 1);
    }
    for (const [key, items] of data.containers) this.setContainer(key, items);
  }
}

export const worldDelta = new WorldDelta();

function mintSeed(): number {
  const bytes = new Uint32Array(1);
  crypto.getRandomValues(bytes);
  return bytes[0] || 1;
}

let worldSeed = mintSeed();

export function currentWorldSeed(): number {
  return worldSeed;
}

export function setWorldSeed(seed: number): void {
  worldSeed = seed;
}

// --- the slots --------------------------------------------------------------

export const SAVE_SLOTS = 3;

export interface SaveData {
  version: 1;
  /** Epoch milliseconds, for the slot picker. */
  savedAt: number;
  /** The zone's display name at save time, for the slot picker. */
  zoneName: string;
  worldSeed: number;
  items: Item[];
  tool: Item | null;
  accessories: (Item | null)[];
  delta: DeltaData;
  zone: string;
  at: [number, number, number];
  yaw: number;
}

/** What the picker shows for one slot without parsing the whole save. */
export interface SlotInfo {
  slot: number;
  zoneName: string;
  savedAt: number;
}

function keyFor(slot: number): string {
  return `hswow:save:${slot}`;
}

export function writeSave(slot: number, data: SaveData): boolean {
  try {
    localStorage.setItem(keyFor(slot), JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

export function readSave(slot: number): SaveData | null {
  try {
    const raw = localStorage.getItem(keyFor(slot));
    if (!raw) return null;
    const data = JSON.parse(raw) as SaveData;
    if (data.version !== 1) return null;
    return data;
  } catch {
    return null;
  }
}

/** One entry per slot, in slot order; null where nothing is saved. */
export function listSaves(): (SlotInfo | null)[] {
  const out: (SlotInfo | null)[] = [];
  for (let slot = 1; slot <= SAVE_SLOTS; slot++) {
    const data = readSave(slot);
    out.push(data ? { slot, zoneName: data.zoneName, savedAt: data.savedAt } : null);
  }
  return out;
}
