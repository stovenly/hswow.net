import type { Menu, Pane } from './Menu';
import { questFinished } from '../world/dialogue';
import { everyQuest, type QuestDocument } from '../world/people';
import type { WorldFlags } from '../world/state';

/**
 * The journal: every quest the player has started, and what was written down
 * at each stage they reached. The quests stand in a list, active ones first
 * and finished ones folded under a heading, and choosing one shows its entries
 * in the order they were written, each dated by how long ago that was.
 */

export class Journal implements Pane {
  private readonly listEl: HTMLDivElement;
  private readonly pageEl: HTMLDivElement;
  private readonly state: WorldFlags;
  private chosen: string | null = null;
  private finishedOpen = false;

  constructor(menu: Menu, state: WorldFlags) {
    this.state = state;

    const pane = menu.pane('journal');
    pane.classList.add('journal-pane');
    this.listEl = document.createElement('div');
    this.listEl.className = 'journal-list';
    this.pageEl = document.createElement('div');
    this.pageEl.className = 'journal-page';
    pane.append(this.listEl, this.pageEl);
    menu.mount('journal', this);
  }

  activate(): void {
    // Opens on an active quest, or on none: a finished one is only looked at by asking.
    this.chosen = null;
    this.finishedOpen = false;
    this.draw();
  }

  deactivate(): void {}

  private draw(): void {
    const active: QuestDocument[] = [];
    const finished: QuestDocument[] = [];
    for (const quest of everyQuest()) {
      if (this.state.stage(quest.id) <= 0) continue;
      (questFinished(quest, this.state) ? finished : active).push(quest);
    }
    const listed = [...active, ...finished];
    if (!listed.some((quest) => quest.id === this.chosen)) this.chosen = active[0]?.id ?? null;

    if (listed.length === 0) {
      this.listEl.replaceChildren(this.empty('No quests yet', 'What people ask of you is kept here.'));
      this.pageEl.replaceChildren();
      return;
    }

    const list = document.createDocumentFragment();
    list.append(this.heading(`active`, active.length));
    if (active.length === 0) list.append(this.empty('Nothing open'));
    for (const quest of active) list.append(this.row(quest));

    if (finished.length > 0) {
      const fold = this.heading(`finished`, finished.length, () => {
        this.finishedOpen = !this.finishedOpen;
        this.draw();
      });
      fold.classList.toggle('is-open', this.finishedOpen);
      list.append(fold);
      if (this.finishedOpen) for (const quest of finished) list.append(this.row(quest));
    }
    this.listEl.replaceChildren(list);

    this.page(listed.find((quest) => quest.id === this.chosen) ?? null);
  }

  private heading(text: string, count: number, fold?: () => void): HTMLElement {
    let heading: HTMLElement;
    if (fold) {
      const button = document.createElement('button');
      button.type = 'button';
      button.addEventListener('click', fold);
      heading = button;
      heading.classList.add('journal-fold');
    } else {
      heading = document.createElement('div');
    }
    heading.classList.add('journal-heading');
    heading.textContent = count > 0 ? `${text} · ${count}` : text;
    return heading;
  }

  private row(quest: QuestDocument): HTMLButtonElement {
    const row = document.createElement('button');
    row.type = 'button';
    row.className = 'journal-row';
    row.classList.toggle('is-chosen', quest.id === this.chosen);
    if (this.state.failed(quest.id)) row.classList.add('is-failed');
    row.textContent = quest.name;
    row.addEventListener('click', () => {
      this.chosen = quest.id;
      this.draw();
    });
    return row;
  }

  private empty(text: string, detail?: string): HTMLDivElement {
    const block = document.createElement('div');
    block.className = 'journal-empty';
    const line = document.createElement('div');
    line.className = 'journal-empty-line';
    line.textContent = text;
    block.append(line);
    if (detail) {
      const more = document.createElement('div');
      more.className = 'journal-empty-detail';
      more.textContent = detail;
      block.append(more);
    }
    return block;
  }

  private page(quest: QuestDocument | null): void {
    if (!quest) {
      this.pageEl.replaceChildren();
      return;
    }
    const page = document.createDocumentFragment();
    const title = document.createElement('div');
    title.className = 'journal-title';
    title.textContent = quest.name;
    if (this.state.failed(quest.id)) {
      const mark = document.createElement('span');
      mark.className = 'journal-mark';
      mark.textContent = 'failed';
      title.append(mark);
    }
    page.append(title);

    let written = 0;
    for (const visit of this.state.visits(quest.id)) {
      const log = quest.stages?.find((stage) => stage.at === visit.at)?.log;
      if (!log) continue;
      written++;
      const entry = document.createElement('div');
      entry.className = 'journal-entry';
      const when = document.createElement('div');
      when.className = 'journal-when';
      when.textContent = agoOf(this.state.today - visit.day);
      const text = document.createElement('p');
      text.className = 'journal-log';
      text.textContent = log;
      entry.append(when, text);
      page.append(entry);
    }
    if (written === 0) page.append(this.empty('Nothing written yet'));
    this.pageEl.replaceChildren(page);
    this.pageEl.scrollTop = 0;
  }
}

/** Whole days, in a diarist's words. */
function agoOf(days: number): string {
  if (days < 1) return 'today';
  if (days < 2) return 'yesterday';
  return `${Math.floor(days)} days ago`;
}
