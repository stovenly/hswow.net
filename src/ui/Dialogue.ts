/**
 * Talking to somebody: their line low on the screen and the things you could
 * say under it.
 *
 * Deliberately plain. There is no panel and no background — the words are
 * orphaned on the world, in the same register as the crosshair's prompt. The
 * real dialogue interface is a later pass; nothing here is precious.
 */

/** A line being voiced: how long it lasts, and how far through it the voice is. */
export interface Spoken {
  readonly seconds: number;
  /** Characters of the line voiced so far. */
  upTo(): number;
}

/** What the interface needs of whoever is being talked to. */
export interface Speaker {
  readonly name: string;
  /** Speaks a line. Null when the throat is mute, and the line is read on the wall clock. */
  speak(text: string, manner: 'greeting' | 'talk' | 'farewell'): Spoken | null;
  /** True when they hailed the player in the open world a moment ago. */
  readonly hailedRecently: boolean;
  readonly greeting: string;
  readonly farewell: string;
  readonly topics: readonly { key: string; label: string; reply: string }[];
}

export interface DialogueHandlers {
  /** On the way in — where the pointer lock is given up. */
  onOpen: () => void;
  /** On the way out — where it is taken back. */
  onClose: () => void;
}

/** Seconds a line stays up when no voice timed it. */
const READ_RATE = 0.055;
const READ_LEAST = 1.4;

export class Dialogue {
  private readonly root: HTMLDivElement;
  private readonly nameEl: HTMLDivElement;
  private readonly lineEl: HTMLDivElement;
  private readonly choicesEl: HTMLDivElement;
  private readonly scrim: HTMLDivElement;
  private speaker: Speaker | null = null;
  private waiting = 0;
  /** The line on screen, and the voice saying it. */
  private line = '';
  private spoken: Spoken | null = null;
  private shown = 0;

  constructor(
    overlay: HTMLElement,
    private readonly handlers: DialogueHandlers,
  ) {
    this.scrim = document.createElement('div');
    this.scrim.className = 'speech-scrim';
    this.scrim.hidden = true;

    this.root = document.createElement('div');
    this.root.id = 'speech';

    this.nameEl = document.createElement('div');
    this.nameEl.className = 'speech-name';
    this.lineEl = document.createElement('div');
    this.lineEl.className = 'speech-line';
    this.choicesEl = document.createElement('div');
    this.choicesEl.className = 'speech-choices';
    this.root.append(this.nameEl, this.lineEl, this.choicesEl);
    overlay.append(this.scrim, this.root);

    // Capture phase: escape closes the conversation and nothing else, so it
    // never opens the pause menu on the way out.
    window.addEventListener(
      'keydown',
      (event) => {
        if (!this.speaker || event.key !== 'Escape') return;
        event.preventDefault();
        event.stopPropagation();
        this.leave();
      },
      true,
    );
  }

  get isOpen(): boolean {
    return this.speaker !== null;
  }

  open(speaker: Speaker): void {
    if (this.speaker) return;
    this.speaker = speaker;
    this.nameEl.textContent = speaker.name;
    document.body.classList.add('is-dialogue');
    this.scrim.hidden = false;
    this.root.classList.add('is-shown');
    this.handlers.onOpen();

    // Skipped when they already hailed you in the street: repeating it a second
    // later is what makes a village feel like a menu.
    if (speaker.hailedRecently) {
      this.line = '';
      this.spoken = null;
      this.lineEl.replaceChildren();
      this.offer();
    } else {
      this.say(speaker.greeting, 'greeting');
    }
  }

  /** Drives the reveal and the wait on the line. Called from the frame loop. */
  update(dt: number): void {
    if (!this.speaker || this.waiting <= 0) return;
    this.reveal();
    this.waiting -= dt;
    if (this.waiting > 0) return;
    this.shown = this.line.length;
    this.paint();
    this.offer();
  }

  private say(text: string, manner: 'greeting' | 'talk' | 'farewell' = 'talk'): void {
    this.line = text;
    this.shown = 0;
    this.choicesEl.replaceChildren();
    this.spoken = this.speaker?.speak(text, manner) ?? null;
    this.paint();
    this.waiting = this.spoken
      ? this.spoken.seconds + 0.35
      : Math.max(READ_LEAST, text.length * READ_RATE);
  }

  /**
   * How much of the line has been said. A mute throat falls back to the wall
   * clock, so the words still arrive when there is no voice to arrive with.
   */
  private reveal(): void {
    const was = this.shown;
    if (this.spoken) this.shown = Math.max(this.shown, this.spoken.upTo());
    else {
      const through = 1 - this.waiting / Math.max(READ_LEAST, this.line.length * READ_RATE);
      this.shown = Math.round(this.line.length * Math.min(1, Math.max(0, through)));
    }
    if (this.shown !== was) this.paint();
  }

  /**
   * The whole line is laid out at once with the unsaid half held invisible, so
   * nothing reflows as it arrives.
   */
  private paint(): void {
    const said = document.createElement('span');
    said.textContent = this.line.slice(0, this.shown);
    const unsaid = document.createElement('span');
    unsaid.className = 'speech-unsaid';
    unsaid.textContent = this.line.slice(this.shown);
    this.lineEl.replaceChildren(said, unsaid);
  }

  private offer(): void {
    const speaker = this.speaker;
    if (!speaker) return;
    this.waiting = 0;
    this.choicesEl.replaceChildren();
    for (const topic of speaker.topics) {
      this.choicesEl.append(this.choice(topic.label, () => this.say(topic.reply)));
    }
    this.choicesEl.append(this.choice('Farewell', () => this.leave()));
  }

  private choice(label: string, chosen: () => void): HTMLButtonElement {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'speech-choice';
    button.textContent = label;
    button.addEventListener('click', chosen);
    return button;
  }

  /** The goodbye plays as the box goes; nobody waits it out. */
  private leave(): void {
    const speaker = this.speaker;
    if (!speaker) return;
    speaker.speak(speaker.farewell, 'farewell');
    this.shut();
  }

  private shut(): void {
    if (!this.speaker) return;
    this.speaker = null;
    this.waiting = 0;
    this.spoken = null;
    this.line = '';
    this.root.classList.remove('is-shown');
    this.scrim.hidden = true;
    document.body.classList.remove('is-dialogue');
    this.handlers.onClose();
  }

  /** Ends it from outside — walking off, a zone change, a quit to the title. */
  close(): void {
    this.shut();
  }
}
