/**
 * The boot screen.
 *
 * Everything in this game is generated at load — a couple of hundred thousand
 * triangles, a collision index over all of it, several seconds of noise, three
 * convolution impulse responses. None of it is a download, so there is no
 * network progress to report, but it is easily a second of work on a slow
 * machine and a second of blank page looks broken.
 *
 * **A real bar is possible precisely because there is nothing to download.**
 * Loading is a fixed known sequence rather than bytes arriving at an unknown
 * rate, so the progress shown is the honest position in that sequence. Steps
 * are weighted by roughly how long they take, which is why the numbers below
 * are not evenly spaced.
 *
 * A browser will not repaint in the middle of synchronous work, so every step
 * waits for two animation frames before starting — one to apply the style
 * change and one to let it composite. That is the entire reason the bar moves.
 */

/** Matches the CSS transition below. */
const FADE = 0.35;

export class Loader {
  private readonly root: HTMLElement;
  private readonly bar: HTMLElement;
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
    const bar = existing?.querySelector<HTMLElement>('.loading-bar') ?? null;
    const label = existing?.querySelector<HTMLElement>('.loading-label') ?? null;

    if (existing && bar && label) {
      this.root = existing;
      this.bar = bar;
      this.label = label;
    } else {
      this.root = document.createElement('div');
      this.root.id = 'loading';

      const track = document.createElement('div');
      track.className = 'loading-track';
      this.bar = document.createElement('div');
      this.bar.className = 'loading-bar';
      track.appendChild(this.bar);

      this.label = document.createElement('div');
      this.label.className = 'loading-label';

      this.root.append(track, this.label);
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
    this.bar.style.transform = `scaleX(${Math.min(Math.max(progress, 0), 1)})`;
    await paint();
    return work();
  }

  /** Fills the bar, holds for a beat, then fades out and removes itself. */
  async done(): Promise<void> {
    this.bar.style.transform = 'scaleX(1)';
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
    this.bar.style.transform = 'scaleX(1)';
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
