/**
 * The two pieces of screen furniture portals need: a prompt and a fade.
 *
 * Both are DOM rather than drawn into the scene. The render pipeline chunks
 * everything to three-pixel blocks, quantizes it and dithers the result, and
 * text put through that is illegible. The interface stays sharp in the document
 * layer above the canvas while the world stays filtered.
 */

/** How long a transition spends at full black. Long enough to hide a rebuild. */
export const FADE_HOLD = 0.14;
/** Seconds each way. Matches the CSS transition duration below. */
export const FADE_TIME = 0.22;

/**
 * The label above the crosshair. Above rather than beside, because the
 * crosshair is the aiming point and text through the middle of it would fight
 * with what is being aimed at; above and centred keeps it in the same saccade.
 */
/**
 * What a prompt says: what the thing is, and — for a door — where it leads.
 * `target` is optional and the joiner disappears with it. A door is a link and
 * reads as two nouns with a preposition between them; a sign is one noun, and
 * "Bovine / to /" is worse than useless.
 */
export interface Prompt {
  title: string;
  target?: string;
  /**
   * Which of the two things a second line can be.
   *
   * `link` — a door. Object, joiner, destination, and the destination reads
   * *quieter*: the name of the door is what you are standing in front of.
   *
   * `read` — something with words in it. No joiner, and the emphasis inverts —
   * a Leather Bound Book is an object and A Treatise On Prague is the reason to
   * pick it up, so the title of the note is the loud line.
   */
  kind?: 'link' | 'read';
}

export class Reticle {
  private readonly element: HTMLElement;
  private readonly title: HTMLElement;
  private readonly target: HTMLElement;
  private readonly joiner: HTMLElement;
  private shown = false;
  private showing = '';

  constructor(parent: HTMLElement) {
    this.element = document.createElement('div');
    this.element.id = 'prompt';
    this.element.setAttribute('aria-live', 'polite');

    // No key cap here. The controls are taught once, on the capture panel;
    // repeating the key on every door competes with the name of the place,
    // which is the only part worth reading.
    //
    // Three stacked lines, all centred on each other:
    //
    //     Wooden Door
    //          to
    //     Arkstin Village
    //
    // The middle word is a joiner, not a label, so it is set small and dim.
    // Centring all three is what makes the block read as one statement rather
    // than a list of two things with a preposition stranded between them.
    const lines = document.createElement('span');
    lines.className = 'prompt-lines';

    this.title = document.createElement('span');
    this.title.className = 'prompt-title';

    this.joiner = document.createElement('span');
    this.joiner.className = 'prompt-to';
    this.joiner.textContent = 'to';

    this.target = document.createElement('span');
    this.target.className = 'prompt-target';

    lines.append(this.title, this.joiner, this.target);
    this.element.append(lines);
    parent.appendChild(this.element);
  }

  /**
   * Shows a prompt, or hides it when given null. Cheap to call every frame with
   * the same value — the DOM is only touched when something changed, because
   * writing `textContent` every frame invalidates layout every frame.
   */
  set(prompt: Prompt | null): void {
    const wanted = prompt !== null;
    if (prompt) {
      const kind = prompt.kind ?? 'link';
      // A NUL between the fields, so no pair of lines can spell another
      // pair’s key. Written as an escape: it used to be a raw control byte
      // in the source, which made the file read as binary to every tool.
      const key = `${kind}\u0000${prompt.title}\u0000${prompt.target}`;
      if (key !== this.showing) {
        this.showing = key;
        this.title.textContent = prompt.title;
        this.target.textContent = prompt.target ?? '';
        // Hidden rather than emptied. An empty span still occupies a line box,
        // so a one-line prompt would sit high in a three-line block and read as
        // misaligned with the crosshair it is meant to be captioning.
        const second = Boolean(prompt.target);
        // A readable never takes the joiner even when it has a second line. The
        // note is not somewhere the book leads, it is what the book *is*.
        this.joiner.hidden = !second || kind === 'read';
        this.target.hidden = !second;
        this.element.classList.toggle('is-readable', kind === 'read');
      }
    }
    if (wanted !== this.shown) {
      this.shown = wanted;
      this.element.classList.toggle('is-shown', wanted);
    }
  }

  dispose(): void {
    this.element.remove();
  }
}

/**
 * A black plane over everything, for covering a zone swap. The swap itself is
 * instant — geometry in, collider rebuilt, player moved — and the fade exists
 * to hide the fact that it is instant. Without it a portal reads as a glitch.
 */
export class Fade {
  private readonly element: HTMLElement;

  constructor(parent: HTMLElement) {
    this.element = document.createElement('div');
    this.element.id = 'fade';
    parent.appendChild(this.element);
  }

  /**
   * Fades out, runs `during`, fades back in.
   *
   * `during` is called at full black, so it may take as long as it likes
   * without anything being visible mid-change — **and that promise is
   * awaited**, which is the whole contract. The `void |` in the type is what
   * enforces it: a callback returning a promise has to be awaited to satisfy
   * the signature, and a synchronous one still works unchanged.
   */
  async cover(during: () => void | Promise<void>, hold = FADE_HOLD): Promise<void> {
    const from = performance.now();
    this.element.classList.add('is-black');
    await wait(FADE_TIME);
    await during();
    // `hold` is how long the cover lasts *in total*, counted from the moment it
    // started: a caller holding the black over a sound wants that sound covered,
    // not that many seconds added to however long the rebuild took.
    await wait(Math.max(FADE_HOLD, hold - (performance.now() - from) / 1000));
    this.element.classList.remove('is-black');
    await wait(FADE_TIME);
  }

  dispose(): void {
    this.element.remove();
  }
}

function wait(seconds: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, seconds * 1000));
}
