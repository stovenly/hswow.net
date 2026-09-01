import { createRng } from '../art/random';
import { displayOf, kindOf, type Item } from './items';

/**
 * Container loot: mundane stock rolled deterministically from the world seed
 * and the container's own key, so the same world fills the same crate the same
 * way on every visit until the player changes it. No treasure tier; the names
 * are placeholder junk.
 */

interface LootRow {
  readonly name?: string;
  readonly builder?: string;
  /** A row from ACCESSORY_STOCK rather than plain junk. */
  readonly accessory?: boolean;
  readonly weight: number;
}

const CRATE: readonly LootRow[] = [
  { name: 'Iron Nails', weight: 3 },
  { name: 'Hemp Twine', weight: 3 },
  { name: 'Old Rag', weight: 2 },
  { name: 'Flint', weight: 2 },
  { name: 'Fork', weight: 1.5 },
  { name: 'Wooden Spoon', weight: 1 },
  { name: 'Bent Horseshoe', weight: 1 },
  { name: 'Empty Bottle', weight: 1 },
  { builder: 'candle', weight: 1 },
  { builder: 'lantern', weight: 0.3 },
];

const BARREL: readonly LootRow[] = [
  { name: 'Apple', weight: 3 },
  { name: 'Handful Of Grain', weight: 3 },
  { name: 'Empty Bottle', weight: 2 },
  { name: 'Dried Herbs', weight: 2 },
  { name: 'Clay Cup', weight: 1 },
  { name: 'Fish Hooks', weight: 1 },
];

const CHEST: readonly LootRow[] = [
  { builder: 'folded-letter', weight: 2 },
  { builder: 'loose-note', weight: 2 },
  { name: 'Yarn Spool', weight: 1 },
  { name: 'Sewing Needle', weight: 1 },
  { name: 'Horn Buttons', weight: 1 },
  { builder: 'leather-book', weight: 0.7 },
  { name: 'Gold Ring', accessory: true, weight: 0.25 },
  { name: 'Silver Necklace', accessory: true, weight: 0.25 },
];

const DRESSER: readonly LootRow[] = [
  { name: 'Horn Buttons', weight: 2 },
  { name: 'Sewing Needle', weight: 2 },
  { name: 'Yarn Spool', weight: 2 },
  { name: 'Old Rag', weight: 2 },
  { name: 'Leather Boot', weight: 1 },
  { builder: 'candle', weight: 1 },
  { builder: 'folded-letter', weight: 1 },
  { name: 'Gold Ring', accessory: true, weight: 0.2 },
  { name: 'Silver Necklace', accessory: true, weight: 0.2 },
];

const SACK: readonly LootRow[] = [
  { name: 'Handful Of Grain', weight: 3 },
  { name: 'Apple', weight: 2 },
  { name: 'Yarn Spool', weight: 1 },
];

const TABLES: Record<string, { rows: readonly LootRow[]; rolls: readonly [number, number] }> = {
  crate: { rows: CRATE, rolls: [1, 3] },
  'crate-stack': { rows: CRATE, rolls: [2, 5] },
  barrel: { rows: BARREL, rolls: [1, 3] },
  'barrel-stack': { rows: BARREL, rolls: [2, 5] },
  chest: { rows: CHEST, rolls: [2, 4] },
  dresser: { rows: DRESSER, rolls: [1, 4] },
  sack: { rows: SACK, rolls: [1, 2] },
};

/** FNV-1a over UTF-16 code units. Stable across sessions; that is its whole job. */
export function hashString(text: string): number {
  let hash = 2166136261;
  for (let i = 0; i < text.length; i++) {
    hash = Math.imul(hash ^ text.charCodeAt(i), 16777619);
  }
  return hash >>> 0;
}

export function rollContainer(kind: string, key: string, worldSeed: number): Item[] {
  const table = TABLES[kind];
  if (!table) return [];
  const rng = createRng(hashString(`${worldSeed}:${key}`));
  const count = rng.int(table.rolls[0], table.rolls[1]);
  const total = table.rows.reduce((sum, row) => sum + row.weight, 0);
  const out: Item[] = [];
  for (let i = 0; i < count; i++) {
    let at = rng() * total;
    let picked = table.rows[table.rows.length - 1];
    for (const row of table.rows) {
      at -= row.weight;
      if (at <= 0) {
        picked = row;
        break;
      }
    }
    // The seed is drawn on every roll whether or not the row uses it, so a
    // table edit does not reshuffle what the other rolls gave.
    const seed = rng.int(1, 1_000_000);
    if (picked.builder) {
      out.push({
        name: displayOf(picked.builder, seed),
        kind: kindOf(picked.builder),
        builder: picked.builder,
        seed,
      });
    } else {
      out.push({ name: picked.name ?? 'Oddment', kind: picked.accessory ? 'accessory' : 'stuff' });
    }
  }
  return out;
}
