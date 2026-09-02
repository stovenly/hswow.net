/**
 * The loading screen. **One of them, for everything that makes you wait**: the
 * boot sequence, a new game raising the world, a doorway into a zone that has
 * never been built, and a compile that runs long. There is deliberately no
 * second, smaller indicator for the shorter waits — two of them is how one of
 * them ends up looking like a different game.
 *
 * A dithered sky with the sun and the moon turning on one wheel about the
 * middle of the horizon, and the horizon itself as the bar. `--lit` is how far
 * through the sequence everything is, 0..1, and it is the only thing this
 * writes. **The sky is not progress and never pretends to be** — it runs on its
 * own clock, which is what says the game has not hung, and it is left alone
 * between waits so it picks up where it was rather than snapping back to dawn.
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

/** Seconds the screen takes to go. Matches the CSS transition, and stays under the black a zone crossing holds. */
const FADE = 0.25;

/** Where a fresh wait starts, so the bar is not empty on its first frame. */
const FIRST = 0.06;

export class LoadingScreen {
  private readonly root: HTMLElement;
  private readonly label: HTMLElement;
  private shown = true;

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
    document.body.classList.add('is-loading');
  }

  /**
   * Puts the screen up, and awaits the paint — the caller is usually about to
   * block. Idempotent: a wait already being shown carries on from where it is
   * rather than starting the bar again.
   */
  async show(label: string): Promise<void> {
    this.label.textContent = label;
    if (this.shown) {
      await paint();
      return;
    }
    this.shown = true;
    // The bar goes back to the start with its transitions off, or it slides
    // backwards across the whole horizon as the screen arrives. The sky is on
    // its own clock and is not reset at all.
    this.root.classList.add('is-settling');
    this.set(FIRST);
    this.root.classList.remove('is-gone');
    document.body.classList.add('is-loading');
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
   * here that is the sky, which is a compositor animation and carries on while
   * the main thread is blocked.
   */
  async working(label: string, progress?: number): Promise<void> {
    this.label.textContent = label;
    if (progress !== undefined) this.set(progress);
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

  /** How far through the sequence everything is. The sky and the bar both read it. */
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

function labelEl(): HTMLElement {
  const label = document.createElement('div');
  label.className = 'loading-label';
  return label;
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

  const sky = div('sky');
  sky.setAttribute('aria-hidden', 'true');
  for (const tier of ['is-dawn', 'is-day']) {
    const layer = div(`sky-tier ${tier}`, sky);
    div('tier-bands', layer);
    div('tier-dither', layer);
  }
  div('sky-veil', sky);
  const wheel = div('wheel', sky);
  div('orb is-sun', wheel);
  div('orb is-moon', wheel);

  const horizon = div('horizon');
  horizon.setAttribute('aria-hidden', 'true');
  div('horizon-fill', horizon);
  div('horizon-cap', horizon);

  const land = div('land');
  land.setAttribute('aria-hidden', 'true');

  // No title line: which game this is belongs to the page, and the page that
  // wants one carries the markup itself.
  const caption = div('boot-caption');
  caption.append(labelEl());

  root.append(sky, horizon, land, caption);
  return root;
}
