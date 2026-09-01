import type { Inventory } from '../player/Inventory';
import type { Item } from '../world/items';
import { Floating, type FloatingRect } from './Floating';
import type { ItemIcons } from './ItemIcons';

/**
 * The inventory: two floating windows of icon cells — the pack and equipment
 * on the left, an opened container on the right — over the world, which stays
 * visible, hoverable and grabbable between them.
 *
 * Items move by dragging. Slots are typed; a refused drop goes back where it
 * came from. A drag released over no panel is a drop into the world, and a
 * drag begun in the world can land in any list. A cell is fully usable before
 * its icon has rendered — the picture is the only thing that is ever late.
 */

export interface OpenedContainer {
  key: string;
  kind: string;
  display: string;
  items: Item[];
}

interface Handlers {
  /** Called on the way in — where the pointer lock is given up. */
  onOpen: () => void;
  /** Called on the way out — where it is taken back. */
  onClose: () => void;
  /** True when the world took the item. False puts it back where it came from. */
  dropToWorld: (item: Item, ndc: { x: number; y: number }) => boolean;
  containerChanged: (key: string, items: readonly Item[]) => void;
  /** What the free cursor is over in the world — the tip's text, and whether the cursor should read as grabbable. */
  hoverWorld: (ndc: { x: number; y: number }) => { label: string; item: boolean } | null;
  /**
   * The pickable under the free cursor, for dragging it around. `item` is the
   * preview the ghost shows; `take` commits the pickup and `move` re-lands it
   * in the world — the mesh stays where it stands until one of them runs.
   */
  grabWorld: (ndc: { x: number; y: number }) => {
    item: Item;
    take: () => Item | null;
    move: (ndc: { x: number; y: number }) => boolean;
  } | null;
  /** A take-all swept the open container into the pack. */
  tookAll: () => void;
  /** E over a cell. True when the item was a readable and its page opened. */
  readItem: (item: Item) => boolean;
}

type Source =
  | { kind: 'inventory'; index: number }
  | { kind: 'container'; index: number }
  | { kind: 'tool' }
  | { kind: 'accessory'; index: number }
  | { kind: 'world'; take: () => Item | null; move: (ndc: { x: number; y: number }) => boolean };

/** Pixels of travel before a press becomes a drag rather than a click. */
const DRAG_START = 4;

/** The equipment block is the pack window's floor; a container needs less. */
const PLAYER_LIMITS = { minW: 470, minH: 420 };
const CONTAINER_LIMITS = { minW: 280, minH: 320 };

export class InventoryUI {
  private readonly root: HTMLDivElement;
  private readonly scrim: HTMLDivElement;
  private readonly tip: HTMLDivElement;
  private readonly note: HTMLDivElement;
  private readonly pack: Floating;
  private readonly holder: Floating;
  private readonly toolRow: HTMLDivElement;
  private readonly slotGrid: HTMLDivElement;
  private readonly packGrid: HTMLDivElement;
  private readonly containerGrid: HTMLDivElement;
  private readonly inventory: Inventory;
  private readonly icons: ItemIcons;
  private readonly handlers: Handlers;
  private readonly unsubscribe: () => void;

  private container: OpenedContainer | null = null;
  private open_ = false;
  private pending: { source: Source; item: Item; x: number; y: number; moved: boolean } | null =
    null;
  private ghost: HTMLDivElement | null = null;
  private noteTimer = 0;
  private hovered: Item | null = null;

  constructor(overlay: HTMLElement, inventory: Inventory, icons: ItemIcons, handlers: Handlers) {
    this.inventory = inventory;
    this.icons = icons;
    this.handlers = handlers;

    this.root = document.createElement('div');
    this.root.id = 'inventory';
    this.root.hidden = true;

    // Invisible and necessary, for the reading screen's reason: without it a
    // click beside the windows lands on the canvas and takes pointer lock. It
    // is also the surface world grabs start on and world drops land on.
    const scrim = document.createElement('div');
    scrim.className = 'inv-scrim';
    this.scrim = scrim;
    scrim.addEventListener('pointermove', this.handleHover);
    scrim.addEventListener('pointerleave', () => {
      this.tip.hidden = true;
      scrim.style.cursor = '';
    });
    scrim.addEventListener('pointerdown', (event) => {
      if (event.button !== 0) return;
      const grabbed = this.handlers.grabWorld(ndcOf(event));
      if (grabbed) {
        this.beginDrag({ kind: 'world', take: grabbed.take, move: grabbed.move }, grabbed.item, event);
      }
    });
    this.root.append(scrim);

    // The pack window, left by default.
    this.pack = new Floating(this.root, 'hswow:ui:inventory', PLAYER_LIMITS, () => {
      const w = 470;
      const h = Math.min(520, window.innerHeight - 100);
      return {
        x: Math.round(window.innerWidth * 0.03),
        y: Math.max(8, window.innerHeight - h - Math.round(window.innerHeight * 0.06)),
        w,
        h,
      } satisfies FloatingRect;
    });
    this.pack.setTitle('inventory');

    const equip = document.createElement('div');
    equip.className = 'inv-equip';

    const toolHead = document.createElement('div');
    toolHead.className = 'inv-section';
    toolHead.textContent = 'tool';

    this.toolRow = document.createElement('div');
    this.toolRow.className = 'inv-slots inv-slots-tool';

    const accessoryHead = document.createElement('div');
    accessoryHead.className = 'inv-section';
    accessoryHead.textContent = 'accessories';

    this.slotGrid = document.createElement('div');
    this.slotGrid.className = 'inv-slots';

    const toolCol = document.createElement('div');
    toolCol.className = 'inv-equip-col';
    toolCol.append(toolHead, this.toolRow);

    const accessoryCol = document.createElement('div');
    accessoryCol.className = 'inv-equip-col';
    accessoryCol.append(accessoryHead, this.slotGrid);

    equip.append(toolCol, accessoryCol);

    this.packGrid = document.createElement('div');
    this.packGrid.className = 'inv-grid';
    this.pack.root.dataset.drop = 'inventory';

    this.note = document.createElement('div');
    this.note.className = 'inv-note';

    this.pack.body.append(equip, this.packGrid, this.note);

    // The container window, right by default.
    this.holder = new Floating(this.root, 'hswow:ui:container', CONTAINER_LIMITS, () => {
      const w = 320;
      const h = Math.min(440, window.innerHeight - 100);
      return {
        x: window.innerWidth - w - Math.round(window.innerWidth * 0.03),
        y: Math.max(8, window.innerHeight - h - Math.round(window.innerHeight * 0.06)),
        w,
        h,
      } satisfies FloatingRect;
    });
    this.holder.root.hidden = true;

    const takeAll = document.createElement('button');
    takeAll.type = 'button';
    takeAll.className = 'inv-take';
    takeAll.textContent = 'take all';
    takeAll.addEventListener('click', () => this.takeAll());
    this.holder.tools.append(takeAll);

    this.containerGrid = document.createElement('div');
    this.containerGrid.className = 'inv-grid';
    this.holder.root.dataset.drop = 'container';
    this.holder.body.append(this.containerGrid);

    this.tip = document.createElement('div');
    this.tip.className = 'inv-tip';
    this.tip.hidden = true;
    this.root.append(this.tip);

    overlay.append(this.root);

    this.unsubscribe = inventory.onChange(() => {
      if (this.open_) this.render();
    });
    window.addEventListener('keydown', this.handleKeyDown);
  }

  get shown(): boolean {
    return this.open_;
  }

  show(): void {
    if (this.open_) return;
    this.open_ = true;
    this.root.hidden = false;
    document.body.classList.add('is-inventory');
    this.render();
    this.handlers.onOpen();
  }

  hide(): void {
    if (!this.open_) return;
    this.open_ = false;
    this.container = null;
    this.holder.root.hidden = true;
    this.hovered = null;
    this.tip.hidden = true;
    this.cancelDrag();
    this.root.hidden = true;
    document.body.classList.remove('is-inventory');
    this.handlers.onClose();
  }

  openContainer(opened: OpenedContainer): void {
    this.container = opened;
    this.holder.setTitle(opened.display.toLowerCase());
    this.holder.root.hidden = false;
    if (!this.open_) this.show();
    else this.render();
  }

  refresh(): void {
    if (this.open_) this.render();
  }

  dispose(): void {
    this.unsubscribe();
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('pointermove', this.handleDragMove);
    window.removeEventListener('pointerup', this.handleDragUp);
    window.removeEventListener('contextmenu', this.handleDragCancel);
    window.removeEventListener('pointercancel', this.handleDragCancel);
    window.removeEventListener('blur', this.handleDragCancel);
    this.pack.dispose();
    this.holder.dispose();
    this.root.remove();
  }

  // --- rendering ------------------------------------------------------------

  private render(): void {
    this.hovered = null;
    this.toolRow.replaceChildren(this.slotCell('tool', this.inventory.tool, 'tool'));
    this.slotGrid.replaceChildren(
      ...this.inventory.accessories.map((held, i) =>
        this.slotCell(`acc:${i}`, held ?? null, String(i + 1)),
      ),
    );

    const items = this.inventory.items;
    this.packGrid.replaceChildren(
      ...shown(items).map((index) => this.cell(items[index], { kind: 'inventory', index })),
    );
    if (this.inventory.items.length === 0) this.packGrid.appendChild(empty('nothing carried'));

    if (this.container) {
      const held = this.container.items;
      this.containerGrid.replaceChildren(
        ...shown(held).map((index) => this.cell(held[index], { kind: 'container', index })),
      );
      if (held.length === 0) this.containerGrid.appendChild(empty('empty'));
    }
  }

  /** An icon cell. Usable from the moment it exists; the picture arrives when it arrives. */
  private cell(item: Item, source: Source): HTMLDivElement {
    const cell = document.createElement('div');
    cell.className = 'inv-cell is-loading';
    cell.appendChild(this.icon(item, cell));
    this.watchHover(cell, item);
    cell.addEventListener('pointerdown', (event) => this.beginDrag(source, item, event));
    return cell;
  }

  private slotCell(drop: string, item: Item | null, placeholder: string): HTMLDivElement {
    const cell = document.createElement('div');
    cell.className = 'inv-slot';
    cell.dataset.drop = drop;
    if (!item) {
      cell.textContent = placeholder;
      return cell;
    }
    cell.classList.add('has-item', 'is-loading');
    cell.appendChild(this.icon(item, cell));
    this.watchHover(cell, item);
    cell.addEventListener('pointerdown', (event) => {
      const source: Source =
        drop === 'tool' ? { kind: 'tool' } : { kind: 'accessory', index: Number(drop.slice(4)) };
      this.beginDrag(source, item, event);
    });
    return cell;
  }

  private icon(item: Item, loading: HTMLElement): HTMLImageElement {
    const img = document.createElement('img');
    img.className = 'inv-icon';
    img.alt = item.name;
    img.draggable = false;
    this.icons.request(item, (url) => {
      img.src = url;
      loading.classList.remove('is-loading');
    });
    return img;
  }

  /** Cells carry no words; the tip does. Same tip the world hover uses. */
  private watchHover(cell: HTMLElement, item: Item): void {
    const at = (event: PointerEvent): void => {
      if (this.ghost) return;
      this.hovered = item;
      this.tip.hidden = false;
      this.tip.textContent = item.name;
      this.tip.style.left = `${event.clientX}px`;
      this.tip.style.top = `${event.clientY}px`;
    };
    cell.addEventListener('pointerenter', at);
    cell.addEventListener('pointermove', at);
    cell.addEventListener('pointerleave', () => {
      if (this.hovered === item) this.hovered = null;
      this.tip.hidden = true;
    });
  }

  private say(text: string): void {
    this.note.textContent = text;
    window.clearTimeout(this.noteTimer);
    this.noteTimer = window.setTimeout(() => {
      this.note.textContent = '';
    }, 2200);
  }

  // --- moving ---------------------------------------------------------------

  private takeAll(): void {
    const held = this.container;
    if (!held) return;
    if (held.items.length === 0) {
      this.hide();
      return;
    }
    for (const item of held.items) this.inventory.items.push(item);
    held.items = [];
    this.handlers.containerChanged(held.key, []);
    this.handlers.tookAll();
    this.inventory.emit();
    this.hide();
  }

  private takeFrom(source: Source): Item | null {
    switch (source.kind) {
      case 'inventory':
        return this.inventory.takeAt(source.index);
      case 'container': {
        if (!this.container) return null;
        const taken = this.container.items.splice(source.index, 1)[0] ?? null;
        if (taken) this.handlers.containerChanged(this.container.key, this.container.items);
        return taken;
      }
      case 'tool':
        return this.inventory.setTool(null);
      case 'accessory':
        return this.inventory.setAccessory(source.index, null);
      case 'world':
        return source.take();
    }
  }

  /** Whether a target would take the item — the slot typing, asked before anything moves. */
  private accepts(drop: string, item: Item): boolean {
    if (drop === 'tool') return item.kind === 'tool';
    if (drop.startsWith('acc:')) return item.kind === 'accessory';
    return true;
  }

  private putTo(drop: string, item: Item): void {
    if (drop === 'inventory') {
      this.inventory.add(item);
      return;
    }
    if (drop === 'container') {
      if (!this.container) {
        this.inventory.add(item);
        return;
      }
      this.container.items.push(item);
      this.handlers.containerChanged(this.container.key, this.container.items);
      return;
    }
    // A slot swap rehomes whatever was there into the pack, so nothing is lost.
    const displaced =
      drop === 'tool'
        ? this.inventory.setTool(item)
        : this.inventory.setAccessory(Number(drop.slice(4)), item);
    if (displaced) this.inventory.add(displaced);
  }

  private beginDrag(source: Source, item: Item, event: PointerEvent): void {
    if (event.button !== 0) return;
    event.preventDefault();
    this.pending = { source, item, x: event.clientX, y: event.clientY, moved: false };
    // The ghost picks the item up visually on the press itself; whether the
    // release *acts* still waits for real travel — see `moved`.
    this.ghost = document.createElement('div');
    this.ghost.className = 'inv-ghost';
    const face = document.createElement('img');
    face.className = 'inv-icon';
    face.draggable = false;
    this.icons.request(item, (url) => {
      face.src = url;
    });
    const label = document.createElement('span');
    label.textContent = item.name;
    this.ghost.append(face, label);
    this.ghost.style.left = `${event.clientX}px`;
    this.ghost.style.top = `${event.clientY}px`;
    this.root.appendChild(this.ghost);
    this.tip.hidden = true;
    window.addEventListener('pointermove', this.handleDragMove);
    window.addEventListener('pointerup', this.handleDragUp);
    // A right click raises the context menu, which swallows the pointerup the
    // drag is waiting for — the ghost would stand orphaned forever. Cancelled
    // instead, along with anything else that steals the pointer mid-drag.
    window.addEventListener('contextmenu', this.handleDragCancel);
    window.addEventListener('pointercancel', this.handleDragCancel);
    window.addEventListener('blur', this.handleDragCancel);
  }

  private readonly handleDragCancel = (event: Event): void => {
    if (event.type === 'contextmenu') event.preventDefault();
    this.cancelDrag();
  };

  private readonly handleHover = (event: PointerEvent): void => {
    // The ghost already names what is being dragged; two labels chase one cursor.
    if (this.ghost) {
      this.tip.hidden = true;
      this.scrim.style.cursor = 'grabbing';
      return;
    }
    const over = this.handlers.hoverWorld(ndcOf(event));
    this.scrim.style.cursor = over?.item ? 'grab' : '';
    this.tip.hidden = over === null;
    if (over === null) return;
    this.tip.textContent = over.label;
    this.tip.style.left = `${event.clientX}px`;
    this.tip.style.top = `${event.clientY}px`;
  };

  private readonly handleDragMove = (event: PointerEvent): void => {
    const pending = this.pending;
    if (!pending || !this.ghost) return;
    if (Math.hypot(event.clientX - pending.x, event.clientY - pending.y) >= DRAG_START) {
      pending.moved = true;
    }
    this.ghost.style.left = `${event.clientX}px`;
    this.ghost.style.top = `${event.clientY}px`;
  };

  private readonly handleDragUp = (event: PointerEvent): void => {
    const pending = this.pending;
    this.cancelDrag();
    // A press that never travelled is a click, and a click moves nothing.
    if (!pending?.moved) return;

    const over = document.elementFromPoint(event.clientX, event.clientY);
    const target = over?.closest<HTMLElement>('[data-drop]')?.dataset.drop ?? null;

    if (target && !this.accepts(target, pending.item)) {
      this.say(target === 'tool' ? 'only a tool fits there' : 'only an accessory fits there');
      this.render();
      return;
    }

    if (!target) {
      const ndc = ndcOf(event);
      // A world grab released over the world moves the thing where it landed.
      // A refusal is a change of nothing: it was never taken.
      if (pending.source.kind === 'world') {
        if (!pending.source.move(ndc)) this.say('no room to drop it there');
        return;
      }
      const item = this.takeFrom(pending.source);
      if (!item) return;
      if (!this.handlers.dropToWorld(item, ndc)) {
        this.putTo(sourceDrop(pending.source), item);
        this.say('no room to drop it there');
      }
      this.render();
      return;
    }

    const item = this.takeFrom(pending.source);
    if (!item) return;
    this.putTo(target, item);
    this.render();
  };

  private cancelDrag(): void {
    this.pending = null;
    this.ghost?.remove();
    this.ghost = null;
    this.scrim.style.cursor = '';
    window.removeEventListener('pointermove', this.handleDragMove);
    window.removeEventListener('pointerup', this.handleDragUp);
    window.removeEventListener('contextmenu', this.handleDragCancel);
    window.removeEventListener('pointercancel', this.handleDragCancel);
    window.removeEventListener('blur', this.handleDragCancel);
  }

  private readonly handleKeyDown = (event: KeyboardEvent): void => {
    if (!this.open_ || event.repeat) return;
    if (event.code === 'Escape') {
      event.preventDefault();
      this.hide();
      return;
    }
    if (event.code === 'KeyE' && this.hovered && !this.ghost) {
      if (this.handlers.readItem(this.hovered)) event.preventDefault();
    }
  };
}

function ndcOf(event: PointerEvent): { x: number; y: number } {
  return {
    x: (event.clientX / window.innerWidth) * 2 - 1,
    y: -(event.clientY / window.innerHeight) * 2 + 1,
  };
}

/** Where a failed world drop puts the item back. A slot addresses itself; a list index may be gone, so lists take it at the end. */
function sourceDrop(source: Source): string {
  switch (source.kind) {
    case 'inventory':
      return 'inventory';
    case 'container':
      return 'container';
    case 'tool':
      return 'tool';
    case 'accessory':
      return `acc:${source.index}`;
    // Unreachable — a world grab that fails a drop was never taken — but the
    // pack is the one place that always accepts.
    case 'world':
      return 'inventory';
  }
}

/**
 * Display order for a grid: alphabetical, ties broken by builder then seed —
 * never by list position. The result is indices into the list, so a source
 * carries the real one and the sort never touches the model.
 */
function shown(items: readonly Item[]): number[] {
  return items
    .map((_, i) => i)
    .sort(
      (a, b) =>
        items[a].name.localeCompare(items[b].name) ||
        (items[a].builder ?? '').localeCompare(items[b].builder ?? '') ||
        (items[a].seed ?? 0) - (items[b].seed ?? 0),
    );
}

function empty(text: string): HTMLDivElement {
  const note = document.createElement('div');
  note.className = 'inv-empty';
  note.textContent = text;
  return note;
}
