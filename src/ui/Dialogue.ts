/**
 * Talking to somebody: their line low on the screen and the things you could
 * say under it.
 *
 * Deliberately plain. There is no panel and no background — the words are
 * orphaned on the world, in the same register as the crosshair's prompt. The
 * real dialogue interface is a later pass; nothing here is precious.
 */

/** What the interface needs of whoever is being talked to. */
export interface Speaker {
  readonly name: string;
  /** Speaks a line, and says how long it lasts. Zero when the throat is mute. */
  speak(kind: 'greeting' | 'talk'): number;
  /** True when they hailed the player in the open world a moment ago. */
  readonly hailedRecently: boolean;
  readonly greeting: string;
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
      this.lineEl.textContent = '';
      this.offer();
    } else {
      this.say(speaker.greeting, 'greeting');
    }
  }

  /** Drives the wait on the line being spoken. Called from the frame loop. */
  update(dt: number): void {
    if (!this.speaker || this.waiting <= 0) return;
    this.waiting -= dt;
    if (this.waiting > 0) return;
    this.offer();
  }

  private say(text: string, kind: 'greeting' | 'talk'): void {
    this.lineEl.textContent = text;
    this.choicesEl.replaceChildren();
    const spoken = this.speaker?.speak(kind) ?? 0;
    this.waiting = spoken > 0 ? spoken + 0.35 : Math.max(READ_LEAST, text.length * READ_RATE);
  }

  private offer(): void {
    const speaker = this.speaker;
    if (!speaker) return;
    this.waiting = 0;
    this.choicesEl.replaceChildren();
    for (const topic of speaker.topics) {
      this.choicesEl.append(this.choice(topic.label, () => this.say(topic.reply, 'talk')));
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
    speaker.speak('talk');
    this.shut();
  }

  private shut(): void {
    if (!this.speaker) return;
    this.speaker = null;
    this.waiting = 0;
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
