import GUI from 'lil-gui';

/**
 * The editor's menu bar: named buttons, one panel showing at a time.
 *
 * The game's `?debug` panel is one accordion of thirty folders because it is a
 * developer's scratchpad. An editor is not that — you come to it to do a named
 * thing, so the things are named and each opens its own panel.
 *
 * lil-gui stays the form library. What changes is that there are several of
 * them and a bar decides which one you are looking at.
 */

export type MenuName = string;

export class Menus {
  private readonly bar = document.createElement('div');
  private readonly column = document.createElement('div');
  private readonly panels = new Map<MenuName, GUI>();
  private readonly buttons = new Map<MenuName, HTMLButtonElement>();
  private open: MenuName | null = null;

  /** Called before a menu is shown, so a panel can be filled on first sight. */
  beforeShow: ((name: MenuName) => void) | null = null;

  constructor(parent: HTMLElement = document.body) {
    this.bar.className = 'editor-menubar';
    this.column.className = 'editor-column';
    parent.append(this.bar, this.column);
  }

  /** The panel for a menu, made on first ask. */
  panel(name: MenuName): GUI {
    const held = this.panels.get(name);
    if (held) return held;

    const gui = new GUI({ container: this.column, title: name });
    gui.domElement.classList.add('editor-panel');
    // The bar decides what is open, so a panel never closes into a title bar.
    gui.domElement.style.display = 'none';
    this.panels.set(name, gui);

    const button = document.createElement('button');
    button.textContent = name;
    button.addEventListener('click', () => {
      this.show(this.open === name ? null : name);
      button.blur();
    });
    this.bar.append(button);
    this.buttons.set(name, button);
    return gui;
  }

  /** Which menu is showing, or none. */
  show(name: MenuName | null): void {
    if (name) this.beforeShow?.(name);
    this.open = name;
    for (const [held, gui] of this.panels) {
      gui.domElement.style.display = held === name ? '' : 'none';
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
    this.panel(name).$children.appendChild(folder.domElement);
  }
}
