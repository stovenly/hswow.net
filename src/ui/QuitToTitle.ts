import { listSaves, type SlotInfo } from '../world/save';

/**
 * Quit to title, at the foot of the pause stack. Leaving loses everything since
 * the last save, so the confirm says when that was rather than making the
 * player remember.
 */

export class QuitToTitle {
  private readonly open: HTMLButtonElement;
  private readonly root: HTMLDivElement;
  private readonly when: HTMLDivElement;
  private shown = false;

  constructor(overlay: HTMLElement, onQuit: () => void) {
    this.open = document.createElement('button');
    this.open.id = 'quit-open';
    this.open.type = 'button';
    this.open.textContent = 'quit to title';
    this.open.addEventListener('click', () => this.show());

    this.root = document.createElement('div');
    this.root.id = 'quit';
    this.root.hidden = true;

    const scrim = document.createElement('div');
    scrim.className = 'options-scrim';
    scrim.addEventListener('click', () => this.hide());

    const panel = document.createElement('div');
    panel.className = 'slots-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');

    const title = document.createElement('div');
    title.className = 'inv-title';
    title.textContent = 'quit to title';

    const warning = document.createElement('div');
    warning.className = 'quit-warning';
    warning.textContent = 'anything since your last save will be lost.';

    this.when = document.createElement('div');
    this.when.className = 'quit-when';

    const row = document.createElement('div');
    row.className = 'quit-buttons';
    row.append(
      this.button('quit', () => {
        this.hide();
        onQuit();
      }),
      this.button('stay', () => this.hide()),
    );

    panel.append(title, warning, this.when, row);
    this.root.append(scrim, panel);
    (document.getElementById('pause-buttons') ?? overlay).append(this.open);
    overlay.append(this.root);
    window.addEventListener('keydown', this.handleKeyDown);
  }

  private show(): void {
    this.shown = true;
    this.root.hidden = false;
    document.body.classList.add('is-quitting');
    const newest = listSaves()
      .filter((held): held is SlotInfo => held !== null)
      .sort((a, b) => b.savedAt - a.savedAt)[0];
    this.when.textContent = newest
      ? `last saved ${agoOf(Date.now() - newest.savedAt)}.`
      : 'you have never saved.';
  }

  private hide(): void {
    if (!this.shown) return;
    this.shown = false;
    this.root.hidden = true;
    document.body.classList.remove('is-quitting');
  }

  dispose(): void {
    window.removeEventListener('keydown', this.handleKeyDown);
    this.open.remove();
    this.root.remove();
  }

  private button(label: string, onPress: () => void): HTMLButtonElement {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'quit-button';
    button.textContent = label;
    button.addEventListener('click', onPress);
    return button;
  }

  private readonly handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key !== 'Escape' || !this.shown) return;
    this.hide();
  };
}

/** Milliseconds as the coarsest unit that still says something: "a moment ago", "3 hours ago". */
function agoOf(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  if (minutes < 1) return 'a moment ago';
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}
