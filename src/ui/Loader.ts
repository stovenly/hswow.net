import { buildBootScreen, setProgress } from './raise';

/**
 * The boot screen.
 *
 * Everything in this game is generated at load — a couple of hundred thousand
 * triangles, a collision index over all of it, several seconds of noise, three
 * convolution impulse responses. None of it is a download, so there is no
 * network progress to report, but it is easily a second of work on a slow
 * machine and a second of blank page looks broken.
 *
 * **A real readout is possible precisely because there is nothing to download.**
 * Loading is a fixed known sequence rather than bytes arriving at an unknown
 * rate, so what is shown is the honest position in that sequence — courses of a
 * stone going up, and the sky behind it coming light. Steps are weighted by
 * roughly how long they take, which is why the numbers below are not evenly
 * spaced.
 *
 * A browser will not repaint in the middle of synchronous work, so every step
 * waits for two animation frames before starting — one to apply the style
 * change and one to let it composite. That is the entire reason it moves.
 */

/** Matches the CSS transition below. */
const FADE = 0.35;

export class Loader {
  private readonly root: HTMLElement;
  private readonly label: HTMLElement;

  /**
   * Adopts the markup already in `index.html`, or builds it if it is missing.
   * Adopting is the point: that markup is static so it is on screen before any
   * script runs, and building it here would put it up one module-evaluation
   * later. The constructed path exists only so this still works if the element
   * is removed from the document.
   */
  constructor(parent: HTMLElement) {
    const existing = document.getElementById('loading');
    const label = existing?.querySelector<HTMLElement>('.loading-label') ?? null;

    if (existing && label) {
      this.root = existing;
      this.label = label;
    } else {
      const built = buildBootScreen('here stands what once was');
      this.root = built.root;
      this.label = built.label;
      parent.appendChild(this.root);
    }

    document.body.classList.add('is-loading');
  }

  /**
   * Shows `label` at `progress`, lets it paint, then runs `work`. `work` may be
   * synchronous — most of it is, since building geometry cannot be yielded out
   * of — or a promise, for the audio context's offline renders.
   */
  async step<T>(label: string, progress: number, work: () => T | Promise<T>): Promise<T> {
    this.label.textContent = label;
    setProgress(this.root, progress);
    await paint();
    return work();
  }

  /** Tops the stone out, holds for a beat, then fades and removes itself. */
  async done(): Promise<void> {
    setProgress(this.root, 1);
    this.label.textContent = 'ready';
    await paint();
    await wait(0.18);
    this.root.classList.add('is-gone');
    document.body.classList.remove('is-loading');
    await wait(FADE);
    this.root.remove();
  }

  /** Leaves the message up rather than fading, if boot fails. */
  fail(message: string): void {
    this.label.textContent = message;
    this.root.classList.add('is-failed');
  }
}

/**
 * Waits until the browser has actually drawn. Two frames, not one: a single
 * `requestAnimationFrame` fires *before* the paint it belongs to.
 */
function paint(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}

function wait(seconds: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, seconds * 1000));
}
