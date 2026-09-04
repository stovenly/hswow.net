/**
 * A short line saying something changed hands, or was written down.
 *
 * The pack is behind a key and a conversation covers the middle of the screen,
 * so an item arriving during dialogue is otherwise silent. One line at a time,
 * low on the screen under the dialogue: each runs its own CSS animation, takes
 * itself off the end of it, and the next in the queue goes up in its place.
 */

export type Change = 'gain' | 'loss' | 'quest';

/** How many wait behind the one showing, so a burst cannot hold the line for a minute. */
const MOST = 6;

export class Notices {
  private readonly root = document.createElement('div');
  private readonly queue: HTMLDivElement[] = [];

  constructor(parent: HTMLElement) {
    this.root.id = 'notices';
    parent.append(this.root);
  }

  say(text: string, change: Change): void {
    const line = document.createElement('div');
    line.className = `notice is-${change}`;
    if (change === 'quest') line.classList.add('quest-mark');
    line.textContent = text;
    line.addEventListener('animationend', () => {
      line.remove();
      this.show();
    });
    this.queue.push(line);
    while (this.queue.length > MOST) this.queue.shift();
    if (this.root.childElementCount === 0) this.show();
  }

  private show(): void {
    const next = this.queue.shift();
    if (next) this.root.append(next);
  }

  clear(): void {
    this.queue.length = 0;
    this.root.replaceChildren();
  }
}
