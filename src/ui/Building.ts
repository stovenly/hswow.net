import { COURSES, buildRaise, lifting, setProgress } from './raise';

/**
 * The indicator shown while a zone is being built.
 *
 * Separate from `ui/Loader`, which owns the boot sequence, but the **same
 * face**: the same stone, in the same place, so a doorway that takes a moment
 * looks like this game loading and not like a second piece of interface from a
 * different game. Everything visual comes from `ui/raise` and the shared
 * stylesheet and cannot drift.
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
  private readonly raise: HTMLElement;
  private readonly label: HTMLElement;
  private shown = false;
  /** The last fraction anything reported, for naming the course above it. */
  private at = 0;

  /**
   * Builds the boot screen's markup, in the boot screen's classes. Stone first
   * and label under it, the order `Loader` uses; the styling lives in
   * `styles.css` next to the rules it shares.
   */
  constructor(parent: HTMLElement) {
    this.root = document.createElement('div');
    this.root.id = 'building';

    this.raise = buildRaise();
    this.label = document.createElement('div');
    this.label.className = 'loading-label';

    this.root.append(this.raise, this.label);
    parent.appendChild(this.root);
  }

  /**
   * Puts the indicator up and waits for it to be on screen. Awaiting matters:
   * the caller is about to block, and an unpainted indicator will not appear
   * until after the work it is describing has finished.
   */
  async show(label: string): Promise<void> {
    this.label.textContent = label;
    this.at = 0.15;
    setProgress(this.root, this.at);
    lifting(this.raise, null);
    this.root.classList.add('is-shown');
    this.shown = true;
    await paint();
  }

  /**
   * Lays another course and yields, so it is drawn before the next step runs.
   *
   * Pass `progress` when a real fraction is known. Omit it for a step whose
   * cost cannot be reported from inside — `Zone.build()` is one synchronous
   * call — and the course above whatever is standing works instead.
   *
   * **A readout that stops moving is worse than none at all**: on a slow
   * machine it sits at one height and reads as a hang. That course is a
   * compositor animation, so it carries on while the main thread is blocked.
   */
  async step(label: string, progress?: number): Promise<void> {
    if (!this.shown) return;
    this.label.textContent = label;
    if (progress !== undefined) {
      this.at = progress;
      setProgress(this.root, progress);
    }
    lifting(this.raise, progress === undefined ? Math.floor(this.at * COURSES) : null);
    await paint();
  }

  hide(): void {
    if (!this.shown) return;
    this.shown = false;
    lifting(this.raise, null);
    this.root.classList.remove('is-shown');
  }

  dispose(): void {
    this.root.remove();
  }
}
