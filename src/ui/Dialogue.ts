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
  /** Cuts off whatever they are saying. */
  hush(): void;
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
const READ_RATE = 0.032;
const READ_LEAST = 0.9;
/**
 * How much of the speaking the writing takes. Under 1, so the sentence is
 * finished and readable while the villager is still saying the end of it.
 */
const REVEAL_AHEAD = 0.7;
/** Characters a letter takes to come up from nothing. */
const FADE_CHARS = 7;

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
  /** One span per letter of the line, in order. Built once when the line is set. */
  private chars: HTMLSpanElement[] = [];
  /** How many of them are fully up. Only ever moves forward. */
  private lit = 0;
  /** What `waiting` started at, for the reveal when there is no voice to follow. */
  private span = 0;

  constructor(
    overlay: HTMLElement,
    private readonly handlers: DialogueHandlers,
  ) {
    this.scrim = document.createElement('div');
    this.scrim.className = 'speech-scrim';
    this.scrim.hidden = true;
    this.scrim.addEventListener('pointerdown', () => this.advance());

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
        if (!this.speaker) return;
        // Tab closes it the way it closes the inventory. Escape does too, but
        // it is the browser's own key for giving up a pointer lock, so it is
        // not the one to build the way out on.
        if (event.key !== 'Escape' && event.code !== 'Tab') return;
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
      this.lay();
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
    this.fill();
    this.offer();
  }

  private say(text: string, manner: 'greeting' | 'talk' | 'farewell' = 'talk'): void {
    this.line = text;
    this.choicesEl.replaceChildren();
    this.spoken = this.speaker?.speak(text, manner) ?? null;
    this.lay();
    this.waiting = this.spoken
      ? this.spoken.seconds + 0.15
      : Math.max(READ_LEAST, text.length * READ_RATE);
    this.span = this.waiting;
  }

  /**
   * A click fills the line in. A click on a line already filled cuts the
   * villager off and takes what they say next — which is the choices, since a
   * line is one answer.
   */
  private advance(): void {
    if (!this.speaker || this.waiting <= 0) return;
    if (this.lit < this.chars.length) {
      this.fill();
      return;
    }
    this.speaker.hush();
    this.waiting = 0;
    this.offer();
  }

  /**
   * The whole line, one span per letter, laid out at once and invisible. Laid
   * out rather than typed so nothing reflows as it arrives, and per letter so
   * each can come up on its own. Words are kept whole, or a line that wraps
   * would break in the middle of one.
   */
  private lay(): void {
    this.chars = [];
    this.lit = 0;
    const out: Node[] = [];
    for (const piece of this.line.split(/(\s+)/)) {
      if (piece === '') continue;
      if (/^\s+$/.test(piece)) {
        out.push(document.createTextNode(piece));
        continue;
      }
      const word = document.createElement('span');
      word.className = 'speech-word';
      for (const letter of piece) {
        const span = document.createElement('span');
        span.textContent = letter;
        span.style.opacity = '0';
        this.chars.push(span);
        word.append(span);
      }
      out.push(word);
    }
    this.lineEl.replaceChildren(...out);
  }

  /**
   * How much of the line has arrived. A mute throat falls back to the wall
   * clock, so the words still come when there is no voice to come with.
   */
  private reveal(): void {
    const through = this.spoken
      ? this.spoken.upTo()
      : this.line.length * (1 - this.waiting / this.span);
    this.lightUp(through / REVEAL_AHEAD);
  }

  /** Brings every letter up to where a reveal of `p` letters leaves it. */
  private lightUp(p: number): void {
    const end = Math.min(this.chars.length, Math.floor(p) + FADE_CHARS + 1);
    for (let i = this.lit; i < end; i++) {
      const alpha = Math.min(1, (p - i) / FADE_CHARS + 1);
      if (alpha <= 0) break;
      this.chars[i].style.opacity = alpha >= 1 ? '1' : alpha.toFixed(2);
      if (alpha >= 1) this.lit = i + 1;
    }
  }

  private fill(): void {
    this.lightUp(this.chars.length + FADE_CHARS);
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
    // Cleared, or the choices stay in the document as invisible buttons that
    // can still be pressed.
    this.choicesEl.replaceChildren();
    this.lay();
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
