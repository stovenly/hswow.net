/**
 * The two pieces of screen furniture portals need: a prompt and a fade.
 *
 * Both are DOM rather than drawn into the scene. That is deliberate — the
 * render pipeline chunks everything to three-pixel blocks, quantizes it to a
 * handful of levels and dithers the result, and text put through that is
 * illegible. Keeping the interface in the document layer above the canvas
 * means it stays sharp while the world stays filtered, which is also how the
 * capture hint and the touch controls already work.
 */

/** How long a transition spends at full black. Long enough to hide a rebuild. */
export const FADE_HOLD = 0.14;
/** Seconds each way. Matches the CSS transition duration below. */
export const FADE_TIME = 0.22;

/**
 * The label above the crosshair.
 *
 * Sits above rather than beside it because the crosshair is the aiming point
 * and text through the middle of it would fight with what is being aimed at.
 * Above and centred keeps it in the same saccade.
 */
export class Reticle {
  private readonly element: HTMLElement;
  private shown = false;
  private label = '';

  constructor(parent: HTMLElement) {
    this.element = document.createElement('div');
    this.element.id = 'prompt';
    this.element.setAttribute('aria-live', 'polite');
    parent.appendChild(this.element);
  }

  /**
   * Shows `label`, or hides the prompt when given null.
   *
   * Cheap to call every frame with the same value — the DOM is only touched
   * when something actually changed, because writing `textContent` on every
   * frame invalidates layout on every frame.
   */
  set(label: string | null, verb = 'E'): void {
    const wanted = label !== null;
    if (wanted && label !== this.label) {
      this.label = label;
      // The key cap is a separate element so it can be styled as a key rather
      // than as words, which is the difference between reading it as an
      // instruction and reading it as part of the name of the place.
      this.element.replaceChildren(key(verb), document.createTextNode(label));
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

function key(text: string): HTMLElement {
  const cap = document.createElement('kbd');
  cap.textContent = text;
  return cap;
}

/**
 * A black plane over everything, for covering a zone swap.
 *
 * The swap itself is instant — geometry in, collider rebuilt, player moved —
 * and the fade exists to hide the fact that it is instant. Without it a portal
 * reads as a glitch: the world simply becomes a different world between one
 * frame and the next, which is startling in a way that has nothing to do with
 * walking through a door.
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
   * without anything being visible mid-change.
   */
  async cover(during: () => void): Promise<void> {
    this.element.classList.add('is-black');
    await wait(FADE_TIME);
    during();
    await wait(FADE_HOLD);
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
