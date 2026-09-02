/**
 * The stone that goes up while the game loads, and the dawn it goes up in.
 *
 * Progress is a course count, not a bar: a known sequence of steps lays a known
 * number of courses, so the readout is still the honest position in that
 * sequence. `--raised` is the course, `--lit` is the same fraction as 0..1 for
 * the sky to lighten by, and they are the only things that ever change.
 *
 * **Nothing here may be driven from JavaScript while a step is running.** A load
 * step blocks the main thread completely, so anything that has to keep moving
 * during one is a CSS animation on the compositor; the courses and the sky only
 * move between steps, which is exactly when the thread is free.
 *
 * The boot screen's markup is written out statically in `index.html` as well,
 * because it has to be up before any module has evaluated. This builds the same
 * thing for the zone indicator — which gets the stones and the ground but no
 * sky, since it only ever appears inside a transition already at full black —
 * and for the fallback path if that markup is gone.
 */

/** Courses in the pile. `--raised` runs from 0 to this. */
export const COURSES = 11;

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

export function buildRaise(): HTMLElement {
  const root = document.createElement('div');
  root.className = 'raise';
  root.setAttribute('aria-hidden', 'true');

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

  root.append(field, ground);
  return root;
}

/** The whole boot screen, for the fallback path. Sky, land, stones, caption. */
export function buildBootScreen(title: string): {
  root: HTMLElement;
  raise: HTMLElement;
  label: HTMLElement;
} {
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

  const raise = buildRaise();

  const caption = document.createElement('div');
  caption.className = 'boot-caption';
  const heading = document.createElement('div');
  heading.className = 'boot-title';
  heading.textContent = title;
  const label = document.createElement('div');
  label.className = 'loading-label';
  caption.append(heading, label);

  root.append(sky, land, raise, caption);
  return { root, raise, label };
}

/**
 * How far through the sequence everything is. Both properties come from the one
 * number so the sky and the stones cannot disagree about it, and they go on the
 * screen rather than on the stones because the sky is the screen's, not theirs.
 */
export function setProgress(screen: HTMLElement, progress: number): void {
  const fraction = Math.min(Math.max(progress, 0), 1);
  screen.style.setProperty('--lit', String(fraction));
  screen.style.setProperty('--raised', String(fraction * COURSES));
}

/**
 * Marks the course being manoeuvred into place, or clears it with `null`. The
 * one above whatever is standing: a step that cannot say how far through it is
 * still knows which stone it is holding.
 */
export function lifting(root: HTMLElement, order: number | null): void {
  for (const course of root.querySelectorAll('.raise-course')) {
    const at = Number(getComputedStyle(course).getPropertyValue('--c'));
    course.classList.toggle('is-lifting', order !== null && at === order);
  }
}
