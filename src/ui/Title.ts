import { listSaves, type SlotInfo } from '../world/save';

// The title screen. Adopts the page's static markup when it is there.

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
    const existing = document.getElementById('title');
    this.root = existing instanceof HTMLDivElement ? existing : document.createElement('div');
    this.root.id = 'title';

    const name = this.root.querySelector<HTMLElement>('.title-name') ?? document.createElement('div');
    name.className = 'title-name';
    name.textContent = title;

    const buttons = this.root.querySelector<HTMLElement>('.title-buttons') ?? document.createElement('div');
    buttons.className = 'title-buttons';
    buttons.replaceChildren();

    const newest = listSaves()
      .filter((held): held is SlotInfo => held !== null)
      .sort((a, b) => b.savedAt - a.savedAt)[0];
    const resume = this.button('continue', () => {
      if (newest) this.choose(() => handlers.continueFrom(newest.slot));
    });
    resume.classList.toggle('is-empty', !newest);
    buttons.appendChild(resume);
    buttons.appendChild(this.button('new game', () => this.choose(handlers.newGame)));
    buttons.appendChild(this.button('load', handlers.showLoad));
    buttons.appendChild(this.button('options', handlers.showOptions));

    this.root.replaceChildren(name, buttons);
    if (!this.root.isConnected) overlay.appendChild(this.root);
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
