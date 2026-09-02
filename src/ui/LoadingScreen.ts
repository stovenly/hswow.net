/**
 * The loading screen. **One of them, for everything that makes you wait**: the
 * boot sequence, a new game raising the world, a doorway into a zone that has
 * never been built, and a compile that runs long. There is deliberately no
 * second, smaller indicator for the shorter waits — two of them is how one of
 * them ends up looking like a different game.
 *
 * A dawn over a horizon with a stone going up on it. `--raised` is how many
 * courses are standing and `--lit` is the same fraction as 0..1 for the night
 * to lift by, and between them they are the only things that ever change.
 *
 * **A real readout is possible precisely because there is nothing to download.**
 * Every triangle and every sample is generated here, so loading is a fixed known
 * sequence rather than bytes arriving at an unknown rate, and the position shown
 * is the honest position in that sequence.
 *
 * **Nothing here may be driven from script while a step is running.** A step
 * blocks the main thread completely, so anything that has to keep moving during
 * one is a CSS animation on the compositor; everything else moves between steps,
 * which is exactly when the thread is free.
 *
 * The markup is written out statically in `index.html` as well, because the
 * screen has to be up before any module has evaluated. This builds the same
 * thing for a page that has none.
 */

/** Courses in the pile. `--raised` runs from 0 to this. */
const COURSES = 11;

/** Where a fresh wait starts. Enough for one course, so the first frame is not an empty horizon. */
const FIRST_COURSE = 0.1;

/**
 * Seconds the screen takes to go. Matches the CSS transition, and stays under
 * the black a zone crossing holds: the screen sits above the fade, so a slower
 * one would still be dissolving as the world came back.
 */
const FADE = 0.25;

/** `[raise order, width, left offset]` per course, bottom of each pile first. */
const PILES: readonly { width: string; courses: readonly [number, string, string][] }[] = [
  { width: '1.5em', courses: [[1, '100%', '0'], [4, '86%', '7%']] },
  {
    width: '4.4em',
    courses: [
      [0, '96%', '2%'],
      [2, '92%', '4%'],
      [3, '90%', '5%'],
      [5, '86%', '8%'],
      [7, '82%', '10%'],
      [8, '76%', '13%'],
      [9, '70%', '16%'],
      [10, '60%', '21%'],
    ],
  },
  { width: '1.1em', courses: [[6, '100%', '0']] },
];

export class LoadingScreen {
  private readonly root: HTMLElement;
  private readonly label: HTMLElement;
  private readonly courses: HTMLElement[];
  private shown = true;
  /** The last fraction anything reported, for naming the course above it. */
  private at = 0;

  /**
   * Adopts the markup already in the document, or builds it if it is missing.
   * Adopting is the point: that markup is static so it is on screen before any
   * script runs, and building it here would put it up one module-evaluation
   * later.
   */
  constructor() {
    this.root = document.getElementById('loading') ?? build();
    if (!this.root.isConnected) document.body.append(this.root);
    this.label =
      this.root.querySelector<HTMLElement>('.loading-label') ?? this.root.appendChild(labelEl());
    this.courses = [...this.root.querySelectorAll<HTMLElement>('.raise-course')];
    document.body.classList.add('is-loading');
  }

  /**
   * Puts the screen up, and awaits the paint — the caller is usually about to
   * block. Idempotent: a wait that is already being shown carries on from where
   * it is rather than starting the stone again.
   */
  async show(label: string): Promise<void> {
    this.label.textContent = label;
    if (this.shown) {
      await paint();
      return;
    }
    this.shown = true;
    // Back to the bottom of the stone with the transitions off. Left on, the
    // sky runs its lightening backwards over a third of a second as the screen
    // arrives, which is a sunset played to announce a load.
    this.root.classList.add('is-settling');
    this.set(FIRST_COURSE);
    this.root.classList.remove('is-gone');
    document.body.classList.add('is-loading');
    await paint();
    this.root.classList.remove('is-settling');
  }

  /**
   * Moves the readout and yields, so the move is drawn before the next step
   * runs. Does *not* put the screen up: boot runs behind the title screen, and
   * a step reporting itself is not a reason to cover it.
   *
   * Pass `progress` when a real fraction is known. Omit it for a step whose
   * cost cannot be reported from inside — `Zone.build()` is one synchronous
   * call — and the course above whatever is standing works instead.
   *
   * **A readout that stops moving is worse than none at all**: on a slow
   * machine it sits at one height and reads as a hang. That course is a
   * compositor animation, so it carries on while the main thread is blocked.
   */
  async working(label: string, progress?: number): Promise<void> {
    this.label.textContent = label;
    if (progress !== undefined) {
      this.at = progress;
      this.set(progress);
    }
    this.lift(progress === undefined ? Math.floor(this.at * COURSES) : null);
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

  /** Tops the stone out, holds for a beat, then takes the screen down. */
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
    this.lift(null);
    this.root.classList.add('is-gone');
    document.body.classList.remove('is-loading');
  }

  /** Leaves the message up rather than fading, if boot fails. */
  fail(message: string): void {
    this.label.textContent = message;
    this.lift(null);
    this.root.classList.add('is-failed');
  }

  /**
   * How far through the sequence everything is. Both properties come from the
   * one number so the sky and the stones cannot disagree about it.
   */
  private set(progress: number): void {
    const fraction = Math.min(Math.max(progress, 0), 1);
    this.root.style.setProperty('--lit', String(fraction));
    this.root.style.setProperty('--raised', String(fraction * COURSES));
  }

  /**
   * Marks the course being manoeuvred into place, or clears it with `null`. The
   * one above whatever is standing: a step that cannot say how far through it is
   * still knows which stone it is holding.
   */
  private lift(order: number | null): void {
    for (const course of this.courses) {
      const at = Number(course.style.getPropertyValue('--c'));
      course.classList.toggle('is-lifting', order !== null && at === order);
    }
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
 * the entire reason anything on this screen moves.
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

/** The whole screen, for a page whose markup does not carry it. */
function build(): HTMLElement {
  const root = document.createElement('div');
  root.id = 'loading';

  const sky = document.createElement('div');
  sky.className = 'sky';
  sky.setAttribute('aria-hidden', 'true');
  for (const layer of ['sky-bands', 'sky-dither', 'sky-night']) {
    const band = document.createElement('div');
    band.className = layer;
    sky.append(band);
  }

  const land = document.createElement('div');
  land.className = 'land';
  land.setAttribute('aria-hidden', 'true');

  const raise = document.createElement('div');
  raise.className = 'raise';
  raise.setAttribute('aria-hidden', 'true');
  const field = document.createElement('div');
  field.className = 'raise-field';
  for (const pile of PILES) {
    const column = document.createElement('div');
    column.className = 'raise-pile';
    column.style.setProperty('--pw', pile.width);
    for (const [order, width, offset] of pile.courses) {
      const course = document.createElement('span');
      course.className = 'raise-course';
      course.style.setProperty('--c', String(order));
      course.style.setProperty('--w', width);
      course.style.setProperty('--x', offset);
      column.append(course);
    }
    field.append(column);
  }
  const ground = document.createElement('div');
  ground.className = 'raise-ground';
  raise.append(field, ground);

  // No title line: which game this is belongs to the page, and the page that
  // wants one carries the markup itself.
  const caption = document.createElement('div');
  caption.className = 'boot-caption';
  caption.append(labelEl());

  root.append(sky, land, raise, caption);
  return root;
}
