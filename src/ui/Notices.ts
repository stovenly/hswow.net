/**
 * A short line saying something changed hands, or was written down.
 *
 * The pack is behind a key and a conversation covers the middle of the screen,
 * so an item arriving during dialogue is otherwise silent. One notice at a
 * time, low on the screen under the dialogue: each runs its own CSS animation,
 * takes itself off the end of it, and the next in the queue goes up in its
 * place. Everything said in one burst — one line of dialogue's effects — goes
 * up together, and when the journal is among it the journal is the heading
 * and the rest is written under it.
 */

export type Change = 'gain' | 'loss' | 'quest';

/** How many wait behind the one showing, so a burst cannot hold the line for a minute. */
const MOST = 6;

export class Notices {
  private readonly root = document.createElement('div');
  private readonly queue: HTMLDivElement[] = [];
  private burst: { text: string; change: Change }[] = [];

  constructor(parent: HTMLElement) {
    this.root.id = 'notices';
    parent.append(this.root);
  }

  say(text: string, change: Change): void {
    if (this.burst.length === 0) queueMicrotask(() => this.flush());
    this.burst.push({ text, change });
  }

  /** One burst into notices: the journal heads whatever came with it; anything else stands alone. */
  private flush(): void {
    const said = this.burst;
    this.burst = [];
    const journal = said.find((one) => one.change === 'quest');
    if (journal) {
      const rest = said.filter((one) => one.change !== 'quest').map((one) => one.text);
      this.push(journal.text, 'quest', rest.join(' · ') || undefined);
    } else {
      for (const one of said) this.push(one.text, one.change);
    }
  }

  private push(text: string, change: Change, detail?: string): void {
    const line = document.createElement('div');
    line.className = `notice is-${change}`;
    const title = document.createElement('div');
    title.className = 'notice-title';
    if (change === 'quest') title.classList.add('quest-mark');
    title.textContent = text;
    line.append(title);
    if (detail) {
      const sub = document.createElement('div');
      sub.className = 'notice-detail';
      sub.textContent = detail;
      line.append(sub);
    }
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
    this.burst = [];
    this.queue.length = 0;
    this.root.replaceChildren();
  }
}
