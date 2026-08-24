import type { Entry } from '../world/entry';
import type { Session } from './session';

/**
 * The tree: zone, layers, entries.
 *
 * Document order is build order and `on` depends on it, so dragging a row
 * reorders the file. Visibility and lock are inspection state and are never
 * saved.
 */

export interface OutlinerHooks {
  select(id: string, extend: boolean): void;
  frame(id: string): void;
  setVisible(id: string, visible: boolean): void;
  reorder(from: string, to: string): void;
}

const ICONS: Record<string, string> = {
  prop: '▣',
  creature: '☗',
  run: '▬',
  chain: '⛓',
  scatter: '⁙',
  barrier: '▤',
  prefab: '⬒',
  ground: '▭',
  water: '≈',
  particles: '✳',
  fogVolume: '☁',
  glitch: '⌁',
  horror: '☠',
  sound: '♪',
  soundScatter: '♫',
  vistaRing: '◠',
  dressing: '❦',
};

export class Outliner {
  readonly element = document.createElement('div');
  private readonly filter = document.createElement('input');
  private readonly list = document.createElement('div');
  private readonly session: Session;
  private readonly hooks: OutlinerHooks;
  private readonly hidden = new Set<string>();
  private zone: string | null = null;
  private selected = new Set<string>();
  private dragging: string | null = null;
  /** Shows only this kind, or every kind with null. */
  private isolated: string | null = null;

  constructor(session: Session, hooks: OutlinerHooks, parent: HTMLElement = document.body) {
    this.session = session;
    this.hooks = hooks;
    this.element.className = 'editor-outliner';
    this.filter.type = 'search';
    this.filter.placeholder = 'filter by name or kind';
    this.filter.className = 'editor-search';
    this.filter.addEventListener('input', () => this.redraw());
    this.list.className = 'editor-tree';
    this.element.append(this.filter, this.list);
    parent.append(this.element);
  }

  get visible(): boolean {
    return !this.element.classList.contains('is-hidden');
  }

  set visible(on: boolean) {
    this.element.classList.toggle('is-hidden', !on);
  }

  /** Shows only one kind, or clears the filter. */
  isolate(kind: string | null): void {
    this.isolated = this.isolated === kind ? null : kind;
    this.redraw();
  }

  show(zone: string | null, selected: readonly string[]): void {
    this.zone = zone;
    this.selected = new Set(selected);
    this.redraw();
  }

  isHidden(id: string): boolean {
    return this.hidden.has(id);
  }

  private redraw(): void {
    this.list.replaceChildren();
    if (!this.zone) return;
    const needle = this.filter.value.trim().toLowerCase();
    let layer = '';

    for (const row of this.session.entries(this.zone)) {
      if (row.layer !== layer) {
        layer = row.layer;
        const head = document.createElement('div');
        head.className = 'editor-layer';
        head.textContent = layer;
        this.list.append(head);
      }
      if (this.isolated && row.entry.kind !== this.isolated) continue;
      const id = row.entry.id ?? '';
      if (needle && !id.toLowerCase().includes(needle) && !row.entry.kind.includes(needle)) continue;
      this.list.append(this.row(row.entry, id));
    }
  }

  private row(entry: Entry, id: string): HTMLElement {
    const row = document.createElement('div');
    row.className = 'editor-row';
    row.draggable = true;
    if (this.selected.has(id)) row.classList.add('is-selected');

    const eye = document.createElement('button');
    eye.className = 'editor-eye';
    eye.textContent = this.hidden.has(id) ? '·' : '●';
    eye.title = 'hide — session only';
    eye.addEventListener('click', (event) => {
      event.stopPropagation();
      const nowHidden = !this.hidden.has(id);
      if (nowHidden) this.hidden.add(id);
      else this.hidden.delete(id);
      this.hooks.setVisible(id, !nowHidden);
      this.redraw();
    });

    const icon = document.createElement('span');
    icon.className = 'editor-icon';
    icon.textContent = ICONS[entry.kind] ?? '◇';
    icon.title = entry.kind;

    const name = document.createElement('span');
    name.className = 'editor-name';
    name.textContent = id;

    row.append(eye, icon, name);
    row.addEventListener('click', (event) => this.hooks.select(id, event.ctrlKey || event.shiftKey));
    row.addEventListener('dblclick', () => this.hooks.frame(id));
    row.addEventListener('dragstart', () => {
      this.dragging = id;
    });
    row.addEventListener('dragover', (event) => event.preventDefault());
    row.addEventListener('drop', (event) => {
      event.preventDefault();
      if (this.dragging && this.dragging !== id) this.hooks.reorder(this.dragging, id);
      this.dragging = null;
    });
    return row;
  }
}
