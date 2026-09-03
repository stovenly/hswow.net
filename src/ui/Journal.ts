import { Floating, type FloatingRect } from './Floating';
import { everyQuest, type QuestDocument } from '../world/people';
import type { WorldFlags } from '../world/state';

/**
 * The journal: every quest the player has started, and what was written down
 * at each stage they reached. The quests stand in a list, active ones first
 * and finished ones folded under a heading, and choosing one shows its entries
 * in the order they were written, each dated by how long ago that was.
 */

export interface JournalHandlers {
  onOpen: () => void;
  onClose: () => void;
}

const LIMITS = { minW: 460, minH: 300 };

export class Journal {
  private readonly root: HTMLDivElement;
  private readonly window: Floating;
  private readonly listEl: HTMLDivElement;
  private readonly pageEl: HTMLDivElement;
  private readonly state: WorldFlags;
  private readonly handlers: JournalHandlers;
  private chosen: string | null = null;
  private finishedOpen = false;
  private open_ = false;

  constructor(overlay: HTMLElement, state: WorldFlags, handlers: JournalHandlers) {
    this.state = state;
    this.handlers = handlers;

    this.root = document.createElement('div');
    this.root.id = 'journal';
    this.root.hidden = true;

    const scrim = document.createElement('div');
    scrim.className = 'journal-scrim';
    this.root.append(scrim);

    this.window = new Floating(this.root, 'hswow:ui:journal', LIMITS, centred);
    this.window.setTitle('journal');
    this.window.body.classList.add('journal-body');

    this.listEl = document.createElement('div');
    this.listEl.className = 'journal-list';
    this.pageEl = document.createElement('div');
    this.pageEl.className = 'journal-page';
    this.window.body.append(this.listEl, this.pageEl);

    overlay.append(this.root);
    window.addEventListener('keydown', this.handleKeyDown);
  }

  get shown(): boolean {
    return this.open_;
  }

  show(): void {
    if (this.open_) return;
    this.open_ = true;
    this.root.hidden = false;
    document.body.classList.add('is-journal');
    this.draw();
    this.handlers.onOpen();
  }

  hide(): void {
    if (!this.open_) return;
    this.open_ = false;
    this.root.hidden = true;
    document.body.classList.remove('is-journal');
    this.handlers.onClose();
  }

  dispose(): void {
    window.removeEventListener('keydown', this.handleKeyDown);
    this.window.dispose();
    this.root.remove();
  }

  private draw(): void {
    const active: QuestDocument[] = [];
    const finished: QuestDocument[] = [];
    for (const quest of everyQuest()) {
      if (this.state.stage(quest.id) <= 0) continue;
      (this.finished(quest) ? finished : active).push(quest);
    }
    const listed = [...active, ...finished];
    if (!listed.some((quest) => quest.id === this.chosen)) this.chosen = active[0]?.id ?? finished[0]?.id ?? null;
    if (this.chosen && finished.some((quest) => quest.id === this.chosen)) this.finishedOpen = true;

    const list = document.createDocumentFragment();
    list.append(this.heading(`active`, active.length));
    if (active.length === 0) list.append(this.empty('no quests'));
    for (const quest of active) list.append(this.row(quest));

    const fold = this.heading(`finished`, finished.length, () => {
      this.finishedOpen = !this.finishedOpen;
      this.draw();
    });
    fold.classList.toggle('is-open', this.finishedOpen);
    list.append(fold);
    if (this.finishedOpen) for (const quest of finished) list.append(this.row(quest));
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

  private empty(text: string): HTMLDivElement {
    const line = document.createElement('div');
    line.className = 'journal-empty';
    line.textContent = text;
    return line;
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
    if (written === 0) page.append(this.empty('no entries'));
    this.pageEl.replaceChildren(page);
    this.pageEl.scrollTop = 0;
  }

  private finished(quest: QuestDocument): boolean {
    if (this.state.failed(quest.id)) return true;
    const at = this.state.stage(quest.id);
    return quest.stages?.some((stage) => stage.at === at && stage.ends === true) ?? false;
  }

  private readonly handleKeyDown = (event: KeyboardEvent): void => {
    if (!this.open_ || event.repeat || event.code !== 'Escape') return;
    event.preventDefault();
    this.hide();
  };
}

/** Whole days, in a diarist's words. */
function agoOf(days: number): string {
  if (days < 1) return 'today';
  if (days < 2) return 'yesterday';
  return `${Math.floor(days)} days ago`;
}

function centred(): FloatingRect {
  const w = Math.min(Math.round(window.innerWidth * 0.62), 900);
  const h = Math.round(window.innerHeight * 0.78);
  return { x: Math.round((window.innerWidth - w) / 2), y: Math.round((window.innerHeight - h) / 2), w, h };
}
