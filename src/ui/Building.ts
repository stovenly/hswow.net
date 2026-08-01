/**
 * The indicator shown while a zone is being built.
 *
 * Separate from `ui/Loader`, which owns the boot sequence and removes itself
 * from the document when it calls `done()`. Separate class, **same face**: it
 * builds `.loading-track` / `.loading-bar` / `.loading-label` and sits in the
 * middle of the screen, so the rule that fills while a doorway opens is the
 * same rule, the same width and in the same place as the one that filled while
 * the game booted. It used to be a small dark panel down at the bottom, which
 * read as a second, unrelated piece of UI — two loading bars in one product is
 * one too many. Everything visual now comes from the shared stylesheet and
 * cannot drift.
 *
 * **It is only ever shown for a zone that has not been built before, and never
 * during boot.** A zone the player has already visited is cached in
 * `Zone.root` and indexed in the collider, so re-entering it costs nothing and
 * a flash of UI on it would be a regression; the very first entry is covered
 * by the boot screen, which is already saying the same thing in the same place.
 */

/**
 * Waits until the browser has actually drawn.
 *
 * **Two frames, not one, and this is the whole reason any of this works.** A
 * single `requestAnimationFrame` callback fires *before* the paint it belongs
 * to, so work started there still blocks the frame it was meant to let
 * through — the indicator would be added to the DOM, the build would block,
 * and the element would never appear on screen at all. Waiting for a second
 * frame means the first one has been presented.
 *
 * Exported because `ZoneManager` yields between its own build steps with it and
 * the reasoning has to be in one place.
 */
export function paint(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}

export class Building {
  private readonly root: HTMLElement;
  private readonly bar: HTMLElement;
  private readonly label: HTMLElement;
  private shown = false;

  /**
   * Builds the boot screen's markup, in the boot screen's classes.
   *
   * Track first and label under it, which is the order `Loader` uses. The
   * styling — width, height, colour, letter-spacing, the clipping on the track
   * that keeps the sweep inside it — all lives in `styles.css` next to the
   * `.loading-*` rules it shares, so the two indicators cannot drift apart.
   */
  constructor(parent: HTMLElement) {
    this.root = document.createElement('div');
    this.root.id = 'building';

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

  /**
   * Puts the indicator up and waits for it to be on screen.
   *
   * Awaiting matters: the caller is about to block, and an indicator that has
   * not been painted yet will not appear until after the work it is describing
   * has finished.
   */
  async show(label: string): Promise<void> {
    this.label.textContent = label;
    this.bar.style.animation = 'none';
    this.bar.style.transform = 'scaleX(0.04)';
    this.root.classList.add('is-shown');
    this.shown = true;
    await paint();
  }

  /**
   * Moves the bar and yields, so the move is drawn before the next step runs.
   *
   * Pass `progress` when a real fraction is known. Omit it for a step whose
   * cost cannot be reported from inside — `Zone.build()` is one synchronous
   * call and cannot say how far through it is — and the bar sweeps instead.
   *
   * **A determinate bar that stops moving is worse than no bar at all**: on a
   * slow machine it sits at one width for two seconds and reads as a hang. The
   * sweep is a compositor animation, so it carries on while the main thread is
   * blocked and the window keeps looking alive.
   */
  async step(label: string, progress?: number): Promise<void> {
    if (!this.shown) return;
    this.label.textContent = label;
    if (progress === undefined) {
      this.bar.style.transition = 'none';
      this.bar.style.animation = 'building-sweep 900ms ease-in-out infinite';
    } else {
      this.bar.style.animation = 'none';
      this.bar.style.transition = '';
      this.bar.style.transform = `scaleX(${Math.min(Math.max(progress, 0), 1)})`;
    }
    await paint();
  }

  hide(): void {
    if (!this.shown) return;
    this.shown = false;
    this.bar.style.animation = 'none';
    this.root.classList.remove('is-shown');
  }

  dispose(): void {
    this.root.remove();
  }
}
