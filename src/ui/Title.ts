import { listSaves, type SlotInfo } from '../world/save';

/**
 * The title screen: the game's name over continue, new game, load and options.
 * The buttons drive the same panels the pause screen owns; `body.is-title`
 * hides that stack while this one is up.
 */

interface Handlers {
  newGame(): Promise<void>;
  /** The slot picker's own load path. */
  continueFrom(slot: number): Promise<boolean>;
  showLoad(): void;
  showOptions(): void;
}

export class Title {
  private readonly root: HTMLDivElement;
  private busy = false;

  constructor(overlay: HTMLElement, title: string, handlers: Handlers) {
    this.root = document.createElement('div');
    this.root.id = 'title';

    const name = document.createElement('div');
    name.className = 'title-name';
    name.textContent = title;

    const buttons = document.createElement('div');
    buttons.className = 'title-buttons';

    const newest = listSaves()
      .filter((held): held is SlotInfo => held !== null)
      .sort((a, b) => b.savedAt - a.savedAt)[0];
    if (newest) {
      buttons.appendChild(
        this.button('continue', () => this.choose(() => handlers.continueFrom(newest.slot))),
      );
    }
    buttons.appendChild(this.button('new game', () => this.choose(handlers.newGame)));
    buttons.appendChild(this.button('load', handlers.showLoad));
    buttons.appendChild(this.button('options', handlers.showOptions));

    this.root.append(name, buttons);
    overlay.appendChild(this.root);
    document.body.classList.add('is-title');
  }

  /** One way in at a time. */
  private choose(go: () => Promise<unknown>): void {
    if (this.busy) return;
    this.busy = true;
    void go().finally(() => {
      this.busy = false;
    });
  }

  private button(label: string, onPress: () => void): HTMLButtonElement {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'title-button';
    button.textContent = label;
    button.addEventListener('click', onPress);
    return button;
  }

  dispose(): void {
    this.root.remove();
    document.body.classList.remove('is-title');
  }
}
