/**
 * A short line saying something changed hands.
 *
 * The pack is behind a key and a conversation covers the middle of the screen,
 * so an item arriving during dialogue is otherwise silent. Each line runs its
 * own CSS animation and takes itself off the end of it — there is no clock here
 * and nothing to step.
 */

export type Change = 'gain' | 'loss';

/** How many stack before the oldest is dropped, so a long list cannot climb the screen. */
const MOST = 5;

export class Notices {
  private readonly root = document.createElement('div');

  constructor(parent: HTMLElement) {
    this.root.id = 'notices';
    parent.append(this.root);
  }

  say(text: string, change: Change): void {
    const line = document.createElement('div');
    line.className = `notice is-${change}`;
    line.textContent = text;
    line.addEventListener('animationend', () => line.remove());
    this.root.append(line);
    while (this.root.childElementCount > MOST) this.root.firstElementChild?.remove();
  }

  clear(): void {
    this.root.replaceChildren();
  }
}
