import GUI from 'lil-gui';
import { Panel } from './ui';

/**
 * The editor's menu bar: named buttons, one panel showing at a time.
 *
 * The game's `?debug` panel is one accordion of thirty folders because it is a
 * developer's scratchpad. An editor is not that — you come to it to do a named
 * thing, so the things are named and each opens its own panel.
 *
 * A menu holds either the editor's own controls or a lil-gui, never both: the
 * panels the editor owns are built from `ui.ts`, and lil-gui is left holding the
 * game's tuning folders, which are the game's to lay out.
 */

export type MenuName = string;

export class Menus {
  private readonly bar = document.createElement('div');
  private readonly column = document.createElement('div');
  private readonly slots = new Map<MenuName, HTMLElement>();
  private readonly guis = new Map<MenuName, GUI>();
  private readonly panels = new Map<MenuName, Panel>();
  private readonly buttons = new Map<MenuName, HTMLButtonElement>();
  private open: MenuName | null = null;

  /** Called before a menu is shown, so a panel can be filled on first sight. */
  beforeShow: ((name: MenuName) => void) | null = null;

  constructor(parent: HTMLElement = document.body) {
    this.bar.className = 'editor-menubar';
    this.column.className = 'editor-column';
    parent.append(this.bar, this.column);
  }

  /** The container for a menu, made on first ask, with its button. */
  slot(name: MenuName): HTMLElement {
    const held = this.slots.get(name);
    if (held) return held;

    const slot = document.createElement('div');
    slot.className = 'editor-slot';
    slot.style.display = 'none';
    this.column.append(slot);
    this.slots.set(name, slot);

    const button = document.createElement('button');
    button.textContent = name;
    button.addEventListener('click', () => {
      this.show(this.open === name ? null : name);
      button.blur();
    });
    this.bar.append(button);
    this.buttons.set(name, button);
    return slot;
  }

  /** A menu built from the editor's own controls. */
  panel(name: MenuName): Panel {
    const held = this.panels.get(name);
    if (held) return held;
    const panel = new Panel(name);
    this.slot(name).append(panel.element);
    this.panels.set(name, panel);
    return panel;
  }

  /** A menu holding the game's own tuning folders. */
  gui(name: MenuName): GUI {
    const held = this.guis.get(name);
    if (held) return held;
    const gui = new GUI({ container: this.slot(name), title: name });
    gui.domElement.classList.add('editor-gui');
    this.guis.set(name, gui);
    return gui;
  }

  /** Which menu is showing, or none. */
  show(name: MenuName | null): void {
    if (name) this.beforeShow?.(name);
    this.open = name;
    for (const [held, slot] of this.slots) {
      slot.style.display = held === name ? '' : 'none';
    }
    for (const [held, button] of this.buttons) {
      button.setAttribute('aria-pressed', held === name ? 'true' : 'false');
    }
    this.column.classList.toggle('is-empty', name === null);
  }

  get showing(): MenuName | null {
    return this.open;
  }

  /**
   * Moves a folder from wherever it was built into a menu.
   *
   * The game's tuning folders are built by one function into one GUI, and this
   * re-parents them by name — re-appending a node that is already in the DOM
   * moves it. That keeps `installDevPanel` the one place a knob is written,
   * which is the whole reason it exists.
   */
  adopt(name: MenuName, folder: GUI): void {
    this.gui(name).$children.appendChild(folder.domElement);
  }
}
