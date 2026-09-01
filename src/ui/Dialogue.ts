/**
 * Talking to somebody: their line low on the screen and the things you could
 * say under it.
 *
 * Deliberately plain. There is no panel and no background — the words are
 * orphaned on the world, in the same register as the crosshair's prompt. The
 * real dialogue interface is a later pass; nothing here is precious.
 */

/** A line being voiced. */
export interface Spoken {
  readonly seconds: number;
}

/** What the interface needs of whoever is being talked to. */
export interface Speaker {
  readonly name: string;
  /** Speaks a line. Null when the throat is mute, and the line is read on the wall clock. */
  speak(text: string, manner: 'greeting' | 'talk' | 'farewell'): Spoken | null;
  /** Cuts off whatever they are saying. */
  hush(): void;
  /** Metres from the player. A goodbye left behind goes quicker the further you walk. */
  away(): number;
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
 * Letters a second, flat. Not tied to the voice: reading is faster than
 * speaking, and this is fast enough to finish a line while the villager is
 * still saying the end of it.
 */
const REVEAL_RATE = 45;
/** Characters a letter takes to come up from nothing. */
const FADE_CHARS = 7;
/**
 * Milliseconds the box takes to fade out. Matches `#speech`'s transition in
 * `styles.css` — change both together, or it empties while still on screen.
 */
const FADE_OUT = 160;
/**
 * Seconds a goodbye stays up after it has finished being said, with the mouse
 * already handed back. Opening a new conversation is what cuts it short.
 */
const PARTING_HOLD = 1.1;
/** Metres you can walk off before a goodbye starts going faster, and where it is gone. */
const PARTING_NEAR = 3.5;
const PARTING_FAR = 11;
/** How much faster it runs down at `PARTING_FAR`. */
const PARTING_RUSH = 7;

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
  /** Seconds since the line was set. The reveal is written off this and nothing else. */
  private elapsed = 0;
  /** The pending empty-out, so reopening before it lands does not get wiped. */
  private wiping = 0;
  /** Seconds left on a goodbye that outlives the conversation it ended, and who said it. */
  private parting = 0;
  private parted: Speaker | null = null;

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
    window.clearTimeout(this.wiping);
    this.parting = 0;
    this.parted = null;
    this.speaker = speaker;
    this.nameEl.textContent = speaker.name;
    document.body.classList.add('is-dialogue');
    this.scrim.hidden = false;
    this.root.classList.add('is-shown');
    this.handlers.onOpen();
    this.say(speaker.greeting, 'greeting');
  }

  /** Drives the reveal and the wait on the line. Called from the frame loop. */
  update(dt: number): void {
    // A goodbye outlives the conversation: you have the mouse back and are
    // walking off, and it is still being said behind you.
    if (this.parting > 0) {
      this.elapsed += dt;
      this.reveal();
      this.parting -= dt * this.rush();
      if (this.parting <= 0) {
        this.parted = null;
        this.hide();
      }
      return;
    }
    if (!this.speaker || this.waiting <= 0) return;
    this.elapsed += dt;
    this.reveal();
    this.waiting -= dt;
    if (this.waiting > 0) return;
    this.fill();
    this.offer();
  }

  /** How fast a goodbye runs down: walking away from whoever said it hurries it. */
  private rush(): number {
    const away = this.parted?.away() ?? 0;
    const past = (away - PARTING_NEAR) / (PARTING_FAR - PARTING_NEAR);
    return 1 + (PARTING_RUSH - 1) * Math.max(0, Math.min(1, past));
  }

  private say(text: string, manner: 'greeting' | 'talk' | 'farewell' = 'talk'): void {
    this.line = text;
    this.choicesEl.replaceChildren();
    this.spoken = this.speaker?.speak(text, manner) ?? null;
    this.lay();
    this.waiting = this.spoken
      ? this.spoken.seconds + 0.15
      : Math.max(READ_LEAST, text.length * READ_RATE);
    this.elapsed = 0;
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

  /** How much of the line has arrived: the wall clock, whether there is a voice or not. */
  private reveal(): void {
    this.lightUp(this.elapsed * REVEAL_RATE);
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
    // Always there, always last, and set apart: it is the way out rather than
    // something to talk about.
    const bye = this.choice('Farewell', () => this.leave());
    bye.classList.add('speech-leave');
    this.choicesEl.append(bye);
  }

  private choice(label: string, chosen: () => void): HTMLButtonElement {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'speech-choice';
    button.textContent = label;
    button.addEventListener('click', chosen);
    return button;
  }

  /**
   * The goodbye is said on the way out. The conversation is over the moment it
   * starts — the mouse comes back, the camera lets go — and the line stays up
   * on its own until it has been said.
   */
  private leave(): void {
    const speaker = this.speaker;
    if (!speaker) return;
    const said = speaker.speak(speaker.farewell, 'farewell');
    // Before `shut`, which fades the box out if there is nothing left to say.
    const voiced = said ? said.seconds + 0.15 : Math.max(READ_LEAST, speaker.farewell.length * READ_RATE);
    this.parting = voiced + PARTING_HOLD;
    this.parted = speaker;
    this.shut();
    this.line = speaker.farewell;
    this.lay();
    this.choicesEl.replaceChildren();
    this.elapsed = 0;
  }

  /** Hands the game back. The box may still have a goodbye left to say. */
  private shut(): void {
    if (!this.speaker) return;
    this.speaker = null;
    this.waiting = 0;
    this.spoken = null;
    this.scrim.hidden = true;
    document.body.classList.remove('is-dialogue');
    this.handlers.onClose();
    if (this.parting <= 0) this.hide();
  }

  /**
   * Fades the box out, and empties it only once it has gone: dropping the line
   * and the choices first would leave the name to fall into the space they were
   * holding and the whole box would reflow on its way out.
   */
  private hide(): void {
    this.root.classList.remove('is-shown');
    this.wiping = window.setTimeout(() => {
      this.line = '';
      this.lay();
      this.choicesEl.replaceChildren();
      this.nameEl.textContent = '';
    }, FADE_OUT);
  }

  /** Ends it from outside — walking off, a zone change, a quit to the title. */
  close(): void {
    this.parting = 0;
    this.parted = null;
    if (this.speaker) this.shut();
    else this.hide();
  }
}
