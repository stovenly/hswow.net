import { builders } from '../art/registry';
import { CATEGORY_ORDER, type BuilderCategory } from '../art/types';
import { entryKinds } from '../world/entry';
import type { Thumbnails } from './thumbnails';

/**
 * What can be placed, and what is pinned.
 *
 * A tab per kind of thing, a search box, and a grid of thumbnails. Favourites
 * are a pinned row with per-item yaw and scale ranges, rolled from each placed
 * entry's seed — manual scatter, for where a rule would be wrong.
 */

export interface Favourite {
  builder: string;
  /** Radians, rolled per placement. */
  yaw: [number, number];
  scale: [number, number];
}

export interface PaletteChoice {
  /** The entry kind being placed. */
  kind: string;
  /** The builder, for the kinds that name one. */
  builder?: string;
}

const CREATURES = ['figure', 'dog', 'bovine', 'ovine', 'porcine', 'poultry'];

/** The tabs, and what each one lists. */
function tabs(): { name: string; items(): string[]; kind: string }[] {
  const creatures = new Set(CREATURES);
  return [
    {
      name: 'objects',
      kind: 'prop',
      items: () =>
        [...builders]
          .filter((builder) => !creatures.has(builder.name))
          .sort(byCategory)
          .map((builder) => builder.name),
    },
    { name: 'creatures', kind: 'creature', items: () => CREATURES.filter(exists) },
    {
      name: 'other',
      kind: '',
      items: () =>
        entryKinds()
          .map((kind) => kind.kind)
          .filter((kind) => kind !== 'prop' && kind !== 'creature')
          .sort(),
    },
  ];
}

function exists(name: string): boolean {
  return builders.some((builder) => builder.name === name);
}

function byCategory(a: { category: BuilderCategory; name: string }, b: { category: BuilderCategory; name: string }): number {
  const order = CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category);
  return order !== 0 ? order : a.name.localeCompare(b.name);
}

export class Palette {
  readonly element = document.createElement('div');
  private readonly grid = document.createElement('div');
  private readonly pinned = document.createElement('div');
  private readonly search = document.createElement('input');
  private readonly tabRow = document.createElement('div');
  private readonly thumbnails: Thumbnails;
  private readonly tabs = tabs();
  private tab = this.tabs[0];

  /** The pinned list. Session state until a project tuning file exists. */
  readonly favourites: Favourite[] = [];

  /** What clicking the ground will place, or null. */
  choice: PaletteChoice | null = null;
  onChoice: ((choice: PaletteChoice | null) => void) | null = null;
  /** True while the prop brush is dragging favourites out at a spacing. */
  brushing = false;
  brushSpacing = 2;

  constructor(thumbnails: Thumbnails, parent: HTMLElement = document.body) {
    this.thumbnails = thumbnails;
    this.element.className = 'editor-palette';

    this.tabRow.className = 'editor-tabs';
    for (const tab of this.tabs) {
      const button = document.createElement('button');
      button.textContent = tab.name;
      button.addEventListener('click', () => {
        this.tab = tab;
        this.redraw();
      });
      this.tabRow.append(button);
    }

    this.search.type = 'search';
    this.search.placeholder = 'search';
    this.search.className = 'editor-search';
    this.search.addEventListener('input', () => this.redraw());

    this.pinned.className = 'editor-pinned';
    this.grid.className = 'editor-grid';
    this.element.append(this.tabRow, this.search, this.pinned, this.grid);
    parent.append(this.element);
    this.redraw();
  }

  get visible(): boolean {
    return !this.element.classList.contains('is-hidden');
  }

  set visible(on: boolean) {
    this.element.classList.toggle('is-hidden', !on);
  }

  pick(choice: PaletteChoice | null): void {
    this.choice = choice;
    this.onChoice?.(choice);
    this.redraw();
  }

  favourite(builder: string): Favourite | undefined {
    return this.favourites.find((item) => item.builder === builder);
  }

  togglePin(builder: string): void {
    const at = this.favourites.findIndex((item) => item.builder === builder);
    if (at >= 0) this.favourites.splice(at, 1);
    else this.favourites.push({ builder, yaw: [0, Math.PI * 2], scale: [1, 1] });
    this.redraw();
  }

  private redraw(): void {
    for (const button of this.tabRow.children) {
      const active = button.textContent === this.tab.name;
      (button as HTMLElement).setAttribute('aria-pressed', active ? 'true' : 'false');
    }

    this.pinned.replaceChildren();
    for (const item of this.favourites) {
      this.pinned.append(this.cell(item.builder, this.tab.kind || 'prop', true));
    }

    const needle = this.search.value.trim().toLowerCase();
    const items = this.tab.items().filter((name) => !needle || name.includes(needle));
    this.grid.replaceChildren();
    for (const name of items) {
      this.grid.append(this.cell(name, this.tab.kind || name, false));
    }
  }

  private cell(name: string, kind: string, pinnedHere: boolean): HTMLElement {
    const cell = document.createElement('button');
    cell.className = 'editor-cell';
    cell.title = pinnedHere ? `${name} — right-click to unpin` : `${name} — right-click to pin`;
    const chosen =
      this.choice?.kind === (kind === name ? name : kind) &&
      (this.choice?.builder ?? name) === name;
    cell.setAttribute('aria-pressed', chosen ? 'true' : 'false');

    const label = document.createElement('span');
    label.textContent = name;

    if (kind === 'prop' || kind === 'creature') {
      const image = document.createElement('img');
      image.width = 48;
      image.height = 48;
      image.alt = '';
      cell.append(image);
      this.thumbnails.request(name, (url) => {
        image.src = url;
      });
      cell.addEventListener('click', () => this.pick({ kind, builder: name }));
    } else {
      cell.classList.add('is-kind');
      cell.addEventListener('click', () => this.pick({ kind: name }));
    }

    cell.append(label);
    cell.addEventListener('contextmenu', (event) => {
      event.preventDefault();
      if (kind === 'prop' || kind === 'creature') this.togglePin(name);
    });
    return cell;
  }
}
