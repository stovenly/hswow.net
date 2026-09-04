import { Floating, type FloatingRect } from './Floating';

/**
 * The one window every screen you stop to open lives in — the pack, the
 * journal, the local map and the world map — as tabs along its head. Tab opens
 * it on whichever tab was last chosen by hand; a tab's own key opens it there.
 * Each tab's contents are somebody else's; this owns the window, the tabs, the
 * scrim behind it and the keys that open and close it.
 */

export type MenuTab = 'inventory' | 'journal' | 'map' | 'world';

/** What a tab's contents do when the tab comes and goes. */
export interface Pane {
  activate(): void;
  deactivate(): void;
  /** The whole window went away, whichever tab was up. */
  closed?(): void;
}

export interface MenuHandlers {
  onOpen: () => void;
  onClose: () => void;
  /** Whether a key may open it now — not mid transition, not with a page up. */
  canOpen: () => boolean;
}

const TABS: readonly { id: MenuTab; label: string; key: string; code: string }[] = [
  { id: 'inventory', label: 'inventory', key: 'I', code: 'KeyI' },
  { id: 'journal', label: 'journal', key: 'J', code: 'KeyJ' },
  { id: 'map', label: 'map', key: 'M', code: 'KeyM' },
  { id: 'world', label: 'world map', key: 'N', code: 'KeyN' },
];

const LIMITS = { minW: 640, minH: 460 };

export class Menu {
  readonly root: HTMLDivElement;
  /** Behind the window: catches the clicks that would take pointer lock, and is where the pack's world grabs and drops happen. */
  readonly scrim: HTMLDivElement;
  private readonly window: Floating;
  private readonly buttons = new Map<MenuTab, HTMLButtonElement>();
  private readonly panes = new Map<MenuTab, HTMLDivElement>();
  private readonly contents = new Map<MenuTab, Pane>();
  private readonly handlers: MenuHandlers;
  private current: MenuTab | null = null;
  /** The tab Tab opens on: the last one chosen by hand, in the window or by Tab itself. */
  private remembered: MenuTab = 'inventory';
  private open_ = false;

  constructor(overlay: HTMLElement, handlers: MenuHandlers) {
    this.handlers = handlers;

    this.root = document.createElement('div');
    this.root.id = 'menu';
    this.root.hidden = true;

    this.scrim = document.createElement('div');
    this.scrim.className = 'menu-scrim';
    this.root.append(this.scrim);

    this.window = new Floating(this.root, 'hswow:ui:menu', LIMITS, centred);

    const tabs = document.createElement('div');
    tabs.className = 'menu-tabs';
    // A press on a tab is a click, not the start of a window drag.
    tabs.addEventListener('pointerdown', (event) => event.stopPropagation());
    for (const tab of TABS) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'menu-tab';
      const cap = document.createElement('kbd');
      cap.className = 'key';
      cap.textContent = tab.key;
      button.append(tab.label, cap);
      button.addEventListener('click', () => this.select(tab.id, true));
      tabs.append(button);
      this.buttons.set(tab.id, button);

      const pane = document.createElement('div');
      pane.className = `menu-pane menu-pane-${tab.id}`;
      pane.hidden = true;
      this.window.body.append(pane);
      this.panes.set(tab.id, pane);
    }
    this.window.head.prepend(tabs);

    overlay.append(this.root);
    window.addEventListener('keydown', this.handleKeyDown);
  }

  pane(tab: MenuTab): HTMLDivElement {
    return this.panes.get(tab)!;
  }

  mount(tab: MenuTab, contents: Pane): void {
    this.contents.set(tab, contents);
  }

  get shown(): boolean {
    return this.open_;
  }

  get tab(): MenuTab | null {
    return this.current;
  }

  /** Opens on a tab. Without one, on the remembered tab; with one, the memory is left alone. */
  show(tab?: MenuTab): void {
    if (!this.open_) {
      this.open_ = true;
      this.root.hidden = false;
      document.body.classList.add('is-menu');
      this.handlers.onOpen();
    }
    this.select(tab ?? this.remembered, false);
  }

  hide(): void {
    if (!this.open_) return;
    this.open_ = false;
    if (this.current) this.contents.get(this.current)?.deactivate();
    this.current = null;
    for (const contents of this.contents.values()) contents.closed?.();
    this.root.hidden = true;
    document.body.classList.remove('is-menu');
    this.handlers.onClose();
  }

  /** Brings a tab up. Chosen by hand — a click, or a key while the window is open — it is what Tab opens on next. */
  select(tab: MenuTab, byHand: boolean): void {
    if (byHand) this.remembered = tab;
    if (tab === this.current) return;
    if (this.current) {
      this.contents.get(this.current)?.deactivate();
      this.pane(this.current).hidden = true;
      this.buttons.get(this.current)?.classList.remove('is-current');
    }
    this.current = tab;
    this.pane(tab).hidden = false;
    this.buttons.get(tab)?.classList.add('is-current');
    this.contents.get(tab)?.activate();
  }

  dispose(): void {
    window.removeEventListener('keydown', this.handleKeyDown);
    this.window.dispose();
    this.root.remove();
  }

  private readonly handleKeyDown = (event: KeyboardEvent): void => {
    if (event.repeat) return;
    const tab = TABS.find((one) => one.code === event.code)?.id;
    if (this.open_) {
      if (event.code === 'Tab' || event.code === 'Escape' || tab === this.current) {
        event.preventDefault();
        this.hide();
      } else if (tab) {
        event.preventDefault();
        this.select(tab, true);
      }
      return;
    }
    if (event.code !== 'Tab' && !tab) return;
    if (!this.handlers.canOpen()) return;
    event.preventDefault();
    this.show(tab);
  };
}

function centred(): FloatingRect {
  const w = Math.min(Math.round(window.innerWidth * 0.82), 1180);
  const h = Math.round(window.innerHeight * 0.84);
  return { x: Math.round((window.innerWidth - w) / 2), y: Math.round((window.innerHeight - h) / 2), w, h };
}
