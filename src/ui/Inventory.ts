import type { Inventory } from '../player/Inventory';
import { cardOf, type Item, type ItemCard } from '../world/items';
import { keyHint } from './Reticle';
import type { Menu, Pane } from './Menu';
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
  /** Brings the menu up on the pack: a container was opened from the world. */
  open: () => void;
  /** Puts the menu away: E with a container open and nothing under the cursor. */
  close: () => void;
  /** True when the world took the item. False puts it back where it came from. */
  dropToWorld: (item: Item, ndc: { x: number; y: number }) => boolean;
  containerChanged: (key: string, items: readonly Item[]) => void;
  /** What the free cursor is over in the world — the tip's text, and whether the cursor should read as grabbable. */
  hoverWorld: (ndc: { x: number; y: number }) => { card: ItemCard; item: boolean } | null;
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
  /** An item was dragged from one list into the other, pack or container. */
  moved: (item: Item) => void;
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

export class InventoryUI implements Pane {
  private readonly root: HTMLDivElement;
  private readonly scrim: HTMLDivElement;
  private readonly tip: HTMLDivElement;
  private readonly note: HTMLDivElement;
  private readonly holder: HTMLDivElement;
  private readonly holderTitle: HTMLSpanElement;
  private readonly toolRow: HTMLDivElement;
  private readonly slotGrid: HTMLDivElement;
  private readonly packGrid: HTMLDivElement;
  private readonly containerGrid: HTMLDivElement;
  private readonly inventory: Inventory;
  private readonly icons: ItemIcons;
  private readonly handlers: Handlers;
  private readonly unsubscribe: () => void;

  private container: OpenedContainer | null = null;
  private active = false;
  private pending: { source: Source; item: Item; x: number; y: number; moved: boolean } | null =
    null;
  private ghost: HTMLDivElement | null = null;
  private noteTimer = 0;
  private hovered: Item | null = null;

  constructor(menu: Menu, inventory: Inventory, icons: ItemIcons, handlers: Handlers) {
    this.inventory = inventory;
    this.icons = icons;
    this.handlers = handlers;
    this.root = menu.root;

    // The menu's scrim is also the surface world grabs start on and world
    // drops land on, while the pack is the tab that is up.
    const scrim = menu.scrim;
    this.scrim = scrim;
    scrim.addEventListener('pointermove', this.handleHover);
    scrim.addEventListener('pointerleave', () => {
      if (!this.active) return;
      this.tip.hidden = true;
      scrim.style.cursor = '';
    });
    scrim.addEventListener('pointerdown', (event) => {
      if (!this.active || event.button !== 0) return;
      const grabbed = this.handlers.grabWorld(ndcOf(event));
      if (grabbed) {
        this.beginDrag({ kind: 'world', take: grabbed.take, move: grabbed.move }, grabbed.item, event);
      }
    });

    const pane = menu.pane('inventory');
    pane.classList.add('inv-pane');

    const pack = document.createElement('div');
    pack.className = 'inv-pack';
    pack.dataset.drop = 'inventory';

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

    this.note = document.createElement('div');
    this.note.className = 'inv-note';

    pack.append(equip, this.packGrid, this.note);

    // The open container, beside the pack while there is one.
    this.holder = document.createElement('div');
    this.holder.className = 'inv-holder';
    this.holder.dataset.drop = 'container';
    this.holder.hidden = true;

    const holderHead = document.createElement('div');
    holderHead.className = 'inv-holder-head';
    this.holderTitle = document.createElement('span');
    this.holderTitle.className = 'inv-section';
    const takeAll = document.createElement('button');
    takeAll.type = 'button';
    takeAll.className = 'inv-take';
    takeAll.append(keyHint('R', 'take all'));
    takeAll.addEventListener('click', () => this.takeAll());
    holderHead.append(this.holderTitle, takeAll);

    this.containerGrid = document.createElement('div');
    this.containerGrid.className = 'inv-grid';
    this.holder.append(holderHead, this.containerGrid);

    pane.append(pack, this.holder);

    this.tip = document.createElement('div');
    this.tip.className = 'inv-tip';
    this.tip.hidden = true;
    this.root.append(this.tip);

    this.unsubscribe = inventory.onChange(() => {
      if (this.active) this.render();
    });
    window.addEventListener('keydown', this.handleKeyDown);
    menu.mount('inventory', this);
  }

  get shown(): boolean {
    return this.active;
  }

  activate(): void {
    this.active = true;
    this.render();
  }

  deactivate(): void {
    this.active = false;
    this.hovered = null;
    this.tip.hidden = true;
    this.scrim.style.cursor = '';
    this.cancelDrag();
  }

  /** The window went away: whatever was open is shut. */
  closed(): void {
    this.container = null;
    this.holder.hidden = true;
  }

  openContainer(opened: OpenedContainer): void {
    this.container = opened;
    this.holderTitle.textContent = opened.display.toLowerCase();
    this.holder.hidden = false;
    if (this.active) this.render();
    else this.handlers.open();
  }

  refresh(): void {
    if (this.active) this.render();
  }

  dispose(): void {
    this.unsubscribe();
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('pointermove', this.handleDragMove);
    window.removeEventListener('pointerup', this.handleDragUp);
    window.removeEventListener('contextmenu', this.handleDragCancel);
    window.removeEventListener('pointercancel', this.handleDragCancel);
    window.removeEventListener('blur', this.handleDragCancel);
  }

  // --- rendering ------------------------------------------------------------

  private render(): void {
    this.hovered = null;
    this.toolRow.replaceChildren(this.slotCell('tool', this.inventory.tool, 'tool'));
    this.slotGrid.replaceChildren(
      ...this.inventory.accessories.map((held, i) => this.slotCell(`acc:${i}`, held ?? null, 'accessory')),
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

  private slotCell(drop: string, item: Item | null, kind: 'tool' | 'accessory'): HTMLDivElement {
    const cell = document.createElement('div');
    cell.className = 'inv-slot';
    cell.dataset.drop = drop;
    if (!item) {
      cell.append(slotMark(kind));
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

  /** The tip renders a card and nothing else. */
  private tell(card: ItemCard): void {
    const name = document.createElement('span');
    name.className = 'inv-tip-name';
    name.textContent = card.name;
    this.tip.replaceChildren(name);
    if (card.quest) {
      const line = document.createElement('span');
      line.className = 'inv-tip-quest quest-mark';
      line.textContent = card.quest;
      this.tip.append(line);
    }
    if (card.read) {
      const line = keyHint('E', 'Read');
      line.classList.add('inv-tip-hint');
      this.tip.append(line);
    }
  }

  /** Cells carry no words; the tip does. Same tip the world hover uses. */
  private watchHover(cell: HTMLElement, item: Item): void {
    const at = (event: PointerEvent): void => {
      if (this.ghost) return;
      this.hovered = item;
      this.tip.hidden = false;
      this.tell(cardOf(item));
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
      this.handlers.close();
      return;
    }
    for (const item of held.items) this.inventory.items.push(item);
    held.items = [];
    this.handlers.containerChanged(held.key, []);
    this.handlers.tookAll();
    this.inventory.emit();
    this.handlers.close();
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
    document.body.classList.add('is-dragging');
    // The slots this could go in light up; the rest say nothing.
    for (const slot of this.slots()) {
      slot.classList.toggle('can-take', this.accepts(slot.dataset.drop ?? '', item));
    }
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
    if (!this.active) return;
    // The ghost already names what is being dragged; two labels chase one cursor.
    if (this.ghost) {
      this.tip.hidden = true;
      return;
    }
    const over = this.handlers.hoverWorld(ndcOf(event));
    this.scrim.style.cursor = over?.item ? 'grab' : '';
    this.tip.hidden = over === null;
    if (over === null) return;
    this.tell(over.card);
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
    const over = document.elementFromPoint(event.clientX, event.clientY)?.closest<HTMLElement>('.inv-slot');
    for (const slot of this.slots()) slot.classList.toggle('is-over', slot === over && slot.classList.contains('can-take'));
  };

  private slots(): HTMLElement[] {
    return [...this.toolRow.children, ...this.slotGrid.children] as HTMLElement[];
  }

  private readonly handleDragUp = (event: PointerEvent): void => {
    const pending = this.pending;
    this.cancelDrag();
    // A press that never travelled is a click, and a click moves nothing.
    if (!pending?.moved) return;

    const over = document.elementFromPoint(event.clientX, event.clientY);
    const target = over?.closest<HTMLElement>('[data-drop]')?.dataset.drop ?? null;

    // A slot that does not take it never lit up, so a drop on it is nothing.
    if (target && !this.accepts(target, pending.item)) {
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
    // A world grab already sounded on the take, and the slots sound as equip
    // and unequip; the list-to-list move is the one shift nothing else voices.
    const between = pending.source.kind === 'inventory' || pending.source.kind === 'container';
    if (between && (target === 'inventory' || target === 'container')) this.handlers.moved(item);
    this.render();
  };

  private cancelDrag(): void {
    this.pending = null;
    this.ghost?.remove();
    this.ghost = null;
    for (const slot of this.slots()) slot.classList.remove('can-take', 'is-over');
    document.body.classList.remove('is-dragging');
    this.scrim.style.cursor = '';
    window.removeEventListener('pointermove', this.handleDragMove);
    window.removeEventListener('pointerup', this.handleDragUp);
    window.removeEventListener('contextmenu', this.handleDragCancel);
    window.removeEventListener('pointercancel', this.handleDragCancel);
    window.removeEventListener('blur', this.handleDragCancel);
  }

  private readonly handleKeyDown = (event: KeyboardEvent): void => {
    if (!this.active || event.repeat) return;
    // A page open over the pack has every key; the pack waits under it.
    if (document.body.classList.contains('is-reading')) return;
    if (this.ghost) return;
    // R sweeps the open container into the pack and puts it away, as the button does.
    if (event.code === 'KeyR') {
      if (!this.container) return;
      event.preventDefault();
      this.takeAll();
      return;
    }
    if (event.code !== 'KeyE') return;
    if (this.hovered) {
      if (this.handlers.readItem(this.hovered)) {
        event.preventDefault();
        // The page covers the cell without the pointer leaving it.
        this.tip.hidden = true;
      }
      return;
    }
    // The key that opened the container closes it again.
    if (this.container) {
      event.preventDefault();
      this.handlers.close();
    }
  };
}

/** What an empty slot is for, drawn faint in it: a hammer, or a ring. Inline, as the pause screen's mouse is. */
function slotMark(kind: 'tool' | 'accessory'): SVGSVGElement {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('class', 'inv-slot-mark');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  // Solid shapes, drawn upright and turned: a hammer's head and handle; a
  // ring cut hollow by an inner circle wound the other way, its stone turned
  // to the right.
  if (kind === 'tool') {
    path.setAttribute('d', 'M6 4.5q0-1.5 1.5-1.5h9q1.5 0 1.5 1.5v4q0 1.5-1.5 1.5h-9Q6 10 6 8.5zM10.7 9.5h2.6v10.5q0 1.3-1.3 1.3t-1.3-1.3z');
    path.setAttribute('transform', 'rotate(-38 12 12)');
  } else {
    path.setAttribute('d', 'M12 6.2a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM12 9a4.2 4.2 0 1 1 0 8.4 4.2 4.2 0 0 1 0-8.4zM12 2.4l3 3.1-3 3.1-3-3.1z');
    path.setAttribute('transform', 'rotate(90 12 12)');
  }
  svg.append(path);
  return svg;
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
