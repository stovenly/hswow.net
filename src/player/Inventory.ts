import type { Item } from '../world/items';

/**
 * What the player carries: a flat list, a primary tool slot, and the accessory
 * slots. No capacity limits yet, and nothing here knows about the world — the
 * UI and the item systems read and write it and listen for the change.
 */

export const ACCESSORY_SLOTS = 5;

export class Inventory {
  readonly items: Item[] = [];
  tool: Item | null = null;
  readonly accessories: (Item | null)[] = Array.from({ length: ACCESSORY_SLOTS }, () => null);

  private readonly listeners = new Set<() => void>();

  onChange(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  emit(): void {
    for (const listener of this.listeners) listener();
  }

  add(item: Item): void {
    this.items.push(item);
    this.emit();
  }

  takeAt(index: number): Item | null {
    const taken = this.items.splice(index, 1)[0] ?? null;
    if (taken) this.emit();
    return taken;
  }

  /** Everything carried, wherever it is: the pack, the hand, and what is worn. */
  *carried(): IterableIterator<Item> {
    yield* this.items;
    if (this.tool) yield this.tool;
    for (const worn of this.accessories) if (worn) yield worn;
  }

  /** Takes the first thing carried that matches, out of whichever slot holds it. */
  takeWhere(matches: (item: Item) => boolean): Item | null {
    const at = this.items.findIndex(matches);
    if (at >= 0) return this.takeAt(at);
    if (this.tool && matches(this.tool)) return this.setTool(null);
    const worn = this.accessories.findIndex((item) => item !== null && matches(item));
    if (worn >= 0) return this.setAccessory(worn, null);
    return null;
  }

  /** Returns whatever the slot held before, for the caller to rehome. */
  setTool(item: Item | null): Item | null {
    const displaced = this.tool;
    this.tool = item;
    this.emit();
    return displaced;
  }

  /** Returns whatever the slot held before, for the caller to rehome. */
  setAccessory(index: number, item: Item | null): Item | null {
    const displaced = this.accessories[index] ?? null;
    this.accessories[index] = item;
    this.emit();
    return displaced;
  }

  replace(items: readonly Item[], tool: Item | null, accessories: readonly (Item | null)[]): void {
    this.items.length = 0;
    for (const item of items) this.items.push({ ...item });
    this.tool = tool ? { ...tool } : null;
    for (let i = 0; i < ACCESSORY_SLOTS; i++) {
      const held = accessories[i];
      this.accessories[i] = held ? { ...held } : null;
    }
    // A save from when there were more slots keeps what it wore, in the pack.
    for (const held of accessories.slice(ACCESSORY_SLOTS)) if (held) this.items.push({ ...held });
    this.emit();
  }
}
