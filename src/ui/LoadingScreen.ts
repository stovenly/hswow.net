/**
 * The loading screen. **One of them, for everything that makes you wait**: the
 * boot sequence, a new game raising the world, a doorway into a zone that has
 * never been built, and a compile that runs long. There is deliberately no
 * second, smaller indicator for the shorter waits — two of them is how one of
 * them ends up looking like a different game.
 *
 * A painting in a frame on a sheet, picked at random for each wait, its credit
 * under the frame and a plaque with the caption and the bar below that. `--lit`
 * is how far through the sequence everything is, 0..1, and it is the only thing
 * this writes. The painting is still; a blinking cell after the caption is what
 * says the game has not hung.
 *
 * **A real bar is possible precisely because there is nothing to download.**
 * Every triangle and every sample is generated here, so loading is a fixed known
 * sequence rather than bytes arriving at an unknown rate, and the position shown
 * is the honest position in that sequence.
 *
 * **Nothing here may be driven from script while a step is running.** A step
 * blocks the main thread completely, so everything that has to keep moving
 * during one is a CSS animation on the compositor; `--lit` is written between
 * steps, which is exactly when the thread is free.
 *
 * The markup is written out statically in `index.html` as well, because the
 * screen has to be up before any module has evaluated. This builds the same
 * thing for a page that has none.
 */

import { paintingCredit, paintingSrc, pickPainting } from './loadingScenes';

/** Seconds the screen takes to go. Matches the CSS transition, and stays under the black a zone crossing holds. */
const FADE = 0.25;

/** Where a fresh wait starts, so the bar is not empty on its first frame. */
const FIRST = 0.06;

export class LoadingScreen {
  private readonly root: HTMLElement;
  private readonly label: HTMLElement;
  /** Where the wait is taking the player, over the caption. Empty for a wait that goes nowhere. */
  private readonly place: HTMLElement;
  private readonly picture: HTMLImageElement;
  private readonly credit: HTMLElement;
  private shown = true;
  /** The painting decoded, or given up on, so a wait's first paint has it. */
  private hung: Promise<void> = Promise.resolve();

  /**
   * Adopts the markup already in the document, or builds it if it is missing.
   * Adopting is the point: that markup is static so it is on screen before any
   * script runs, and building it here would put it up one module-evaluation
   * later.
   */
  constructor() {
    this.root = document.getElementById('loading') ?? build();
    if (!this.root.isConnected) document.body.append(this.root);
    this.label = this.root.querySelector<HTMLElement>('.loading-label') ?? labelEl();
    this.place = this.root.querySelector<HTMLElement>('.loading-place') ?? placeEl(this.label);
    this.picture = this.root.querySelector<HTMLImageElement>('.scene') ?? sceneEl(this.root);
    this.credit = this.root.querySelector<HTMLElement>('.credit') ?? creditEl(this.root);
    if (this.root.dataset.scene) this.hung = decoded(this.picture);
    else this.hang(null);
    document.body.classList.add('is-loading');
  }

  /** Hangs a painting that is not `current`, and starts waiting for it to decode. */
  private hang(current: string | null): void {
    const painting = pickPainting(current);
    this.root.dataset.scene = painting.id;
    this.picture.style.objectPosition = painting.focus ?? '';
    this.picture.src = paintingSrc(painting);
    this.credit.textContent = paintingCredit(painting);
    this.hung = decoded(this.picture);
  }

  /**
   * Puts the screen up, and awaits the paint — the caller is usually about to
   * block. Idempotent: a wait already being shown carries on from where it is
   * rather than starting the bar again.
   */
  async show(label: string, place?: string): Promise<void> {
    this.label.textContent = label;
    this.place.textContent = place ?? '';
    this.place.hidden = !place;
    if (this.shown) {
      await paint();
      return;
    }
    this.shown = true;
    this.hang(this.root.dataset.scene ?? null);
    // The bar goes back to the start with its transitions off, or it runs
    // backwards as the screen arrives.
    this.root.classList.add('is-settling');
    this.set(FIRST);
    this.root.classList.remove('is-gone');
    document.body.classList.add('is-loading');
    await this.hung;
    await paint();
    this.root.classList.remove('is-settling');
  }

  /**
   * Moves the bar and yields, so the move is drawn before the next step runs.
   * Does *not* put the screen up: boot runs behind the title screen, and a step
   * reporting itself is not a reason to cover it.
   *
   * `progress` is omitted for a step whose cost cannot be reported from inside
   * — `Zone.build()` is one synchronous call — and the bar simply holds. **A bar
   * that stops moving reads as a hang, so something else has to be moving**:
   * here that is the blinking cell after the caption, a compositor animation
   * that carries on while the main thread is blocked.
   */
  async working(label: string, progress?: number): Promise<void> {
    this.label.textContent = label;
    if (progress !== undefined) this.set(progress);
    await this.hung;
    await paint();
  }

  /**
   * Shows `label` at `progress`, lets it paint, then runs `work`. `work` may be
   * synchronous — most of it is, since building geometry cannot be yielded out
   * of — or a promise, for the audio context's offline renders. This is what a
   * project's own `world()` is handed.
   */
  async step<T>(label: string, progress: number, work: () => T | Promise<T>): Promise<T> {
    await this.working(label, progress);
    return work();
  }

  /** Fills the bar, holds for a beat, then takes the screen down. */
  async done(): Promise<void> {
    this.set(1);
    this.label.textContent = 'ready';
    await paint();
    await wait(0.18);
    this.hide();
    await wait(FADE);
  }

  hide(): void {
    if (!this.shown) return;
    this.shown = false;
    this.root.classList.add('is-gone');
    document.body.classList.remove('is-loading');
  }

  /** Leaves the message up rather than fading, if boot fails. */
  fail(message: string): void {
    this.label.textContent = message;
    this.root.classList.add('is-failed');
  }

  /** How far through the sequence everything is. */
  private set(progress: number): void {
    this.root.style.setProperty('--lit', String(Math.min(Math.max(progress, 0), 1)));
  }
}

let held: LoadingScreen | null = null;

/** The one screen. Built on first ask, and the same one from then on. */
export function loadingScreen(): LoadingScreen {
  return (held ??= new LoadingScreen());
}

/**
 * Waits until the browser has actually drawn. Two frames, not one: a single
 * `requestAnimationFrame` fires *before* the paint it belongs to, so work
 * started there still blocks the frame it was meant to let through — which is
 * the entire reason the bar moves at all.
 */
function paint(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}

function wait(seconds: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, seconds * 1000));
}

/** Resolves when the image can be drawn, or after a beat, so a missing file cannot hold a step. */
function decoded(image: HTMLImageElement): Promise<void> {
  return Promise.race([image.decode().catch(() => undefined), wait(0.4)]);
}

function sceneEl(root: HTMLElement): HTMLImageElement {
  const image = document.createElement('img');
  image.className = 'scene';
  image.alt = '';
  image.decoding = 'async';
  (root.querySelector('.picture') ?? root).append(image);
  return image;
}

function creditEl(root: HTMLElement): HTMLElement {
  const credit = document.createElement('div');
  credit.className = 'credit';
  (root.querySelector('.sheet') ?? root).append(credit);
  return credit;
}

function labelEl(): HTMLElement {
  const label = document.createElement('div');
  label.className = 'loading-label';
  return label;
}

function placeEl(before: HTMLElement): HTMLElement {
  const place = document.createElement('div');
  place.className = 'loading-place';
  place.hidden = true;
  before.before(place);
  return place;
}

function div(className: string, into?: HTMLElement): HTMLElement {
  const element = document.createElement('div');
  element.className = className;
  into?.append(element);
  return element;
}

/** The whole screen, for a page whose markup does not carry it. */
function build(): HTMLElement {
  const root = document.createElement('div');
  root.id = 'loading';

  const sheet = div('sheet', root);

  // No title line: which game this is belongs to the page, and the page that
  // wants one carries the markup itself.
  const frame = div('frame', sheet);
  frame.setAttribute('aria-hidden', 'true');
  for (let corner = 0; corner < 4; corner++) div('frame-corner', frame);
  sceneEl(div('picture', frame));
  creditEl(sheet);

  const plaque = div('plaque', sheet);
  const label = labelEl();
  plaque.append(label);
  placeEl(label);
  div('bar-fill', div('bar', plaque));

  return root;
}
