import { listSaves, SAVE_SLOTS } from '../world/save';

/**
 * Save and load on the pause screen: two buttons in the not-playing stack
 * beside the options button, each opening the same slot picker in its own
 * mode. Saving writes over whatever the chosen slot holds; loading offers
 * only slots that hold something.
 */

interface Handlers {
  save(slot: number): boolean;
  load(slot: number): Promise<boolean>;
}

export class SaveSlots {
  private readonly saveOpen: HTMLButtonElement;
  private readonly loadOpen: HTMLButtonElement;
  private readonly root: HTMLDivElement;
  private readonly panel: HTMLDivElement;
  private readonly title: HTMLDivElement;
  private readonly rows: HTMLDivElement;
  private readonly handlers: Handlers;

  private mode: 'save' | 'load' = 'save';
  private shown = false;

  constructor(overlay: HTMLElement, handlers: Handlers) {
    this.handlers = handlers;

    this.saveOpen = pauseButton('save-open', 'save', () => this.show('save'));
    this.loadOpen = pauseButton('load-open', 'load', () => this.show('load'));

    this.root = document.createElement('div');
    this.root.id = 'slots';
    this.root.hidden = true;

    const scrim = document.createElement('div');
    scrim.className = 'options-scrim';
    scrim.addEventListener('click', () => this.hide());

    this.panel = document.createElement('div');
    this.panel.className = 'slots-panel';
    this.panel.setAttribute('role', 'dialog');
    this.panel.setAttribute('aria-modal', 'true');

    this.title = document.createElement('div');
    this.title.className = 'inv-title';

    this.rows = document.createElement('div');
    this.rows.className = 'slots-rows';

    this.panel.append(this.title, this.rows);
    this.root.append(scrim, this.panel);
    // Into the pause stack where the page has one; the editor page does not.
    (document.getElementById('pause-buttons') ?? overlay).append(this.saveOpen, this.loadOpen);
    overlay.append(this.root);
    window.addEventListener('keydown', this.handleKeyDown);
  }

  show(mode: 'save' | 'load'): void {
    this.mode = mode;
    this.shown = true;
    this.root.hidden = false;
    document.body.classList.add('is-slots');
    this.render();
  }

  hide(): void {
    if (!this.shown) return;
    this.shown = false;
    this.root.hidden = true;
    document.body.classList.remove('is-slots');
  }

  dispose(): void {
    window.removeEventListener('keydown', this.handleKeyDown);
    this.saveOpen.remove();
    this.loadOpen.remove();
    this.root.remove();
  }

  private render(): void {
    this.title.textContent = this.mode === 'save' ? 'save world' : 'load world';
    const saves = listSaves();
    const rows: HTMLButtonElement[] = [];
    for (let slot = 1; slot <= SAVE_SLOTS; slot++) {
      const held = saves[slot - 1];
      const row = document.createElement('button');
      row.type = 'button';
      row.className = 'slots-row';

      const name = document.createElement('span');
      name.className = 'slots-name';
      name.textContent = `slot ${slot}`;

      const detail = document.createElement('span');
      detail.className = 'slots-detail';
      detail.textContent = held
        ? `${held.zoneName.toLowerCase()} — ${new Date(held.savedAt).toLocaleString()}`
        : 'empty';

      row.append(name, detail);
      row.disabled = this.mode === 'load' && !held;
      row.addEventListener('click', () => this.choose(slot, detail));
      rows.push(row);
    }
    this.rows.replaceChildren(...rows);
  }

  private choose(slot: number, detail: HTMLSpanElement): void {
    if (this.mode === 'save') {
      const written = this.handlers.save(slot);
      if (!written) {
        detail.textContent = 'save failed';
        return;
      }
      this.hide();
      return;
    }
    void this.handlers.load(slot).then((loaded) => {
      if (loaded) this.hide();
      else detail.textContent = 'could not load';
    });
  }

  private readonly handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key !== 'Escape' || !this.shown) return;
    // Claimed, so the pause stack's own Escape does not also resume.
    event.preventDefault();
    this.hide();
  };
}

function pauseButton(id: string, label: string, onPress: () => void): HTMLButtonElement {
  const button = document.createElement('button');
  button.id = id;
  button.type = 'button';
  button.textContent = label;
  button.addEventListener('click', onPress);
  return button;
}
