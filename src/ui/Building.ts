/**
 * The indicator shown while a zone is being built.
 *
 * Separate from `ui/Loader`, which owns the boot sequence, but the **same
 * face**: it builds `.loading-track` / `.loading-bar` / `.loading-label` in the
 * middle of the screen, so the rule that fills while a doorway opens is the
 * same rule, the same width and in the same place as the one that filled while
 * the game booted. Everything visual comes from the shared stylesheet and
 * cannot drift.
 *
 * Only ever shown for a zone that has not been built before, and never during
 * boot. A visited zone is cached in `Zone.root` and indexed in the collider, so
 * re-entering costs nothing; the first entry is covered by the boot screen.
 */

/**
 * Waits until the browser has actually drawn.
 *
 * **Two frames, not one.** A single `requestAnimationFrame` callback fires
 * *before* the paint it belongs to, so work started there still blocks the
 * frame it was meant to let through — the indicator would go into the DOM, the
 * build would block, and the element would never appear at all.
 *
 * Exported because `ZoneManager` yields between its own build steps with it.
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
   * Builds the boot screen's markup, in the boot screen's classes. Track first
   * and label under it, the order `Loader` uses; the styling lives in
   * `styles.css` next to the `.loading-*` rules it shares.
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
   * Puts the indicator up and waits for it to be on screen. Awaiting matters:
   * the caller is about to block, and an unpainted indicator will not appear
   * until after the work it is describing has finished.
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
   * call — and the bar sweeps instead.
   *
   * **A determinate bar that stops moving is worse than no bar at all**: on a
   * slow machine it sits at one width and reads as a hang. The sweep is a
   * compositor animation, so it carries on while the main thread is blocked.
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
