/**
 * The stone that goes up while the game loads.
 *
 * Progress is a course count, not a bar: a known sequence of steps lays a known
 * number of courses, so the readout is still the honest position in that
 * sequence. `--raised` on the block is the only thing that ever changes, and
 * each course fades in off a `calc` against its own index — one property write
 * per step, and no per-element work.
 *
 * **Nothing here may be driven from JavaScript while a step is running.** A load
 * step blocks the main thread completely, so anything that has to keep moving
 * during one is a CSS animation on the compositor; the courses only move
 * between steps, which is exactly when the thread is free.
 *
 * The same markup is written out statically in `index.html`, because the boot
 * screen has to be on screen before any module has evaluated. This is what the
 * zone indicator builds, and what `Loader` falls back to if that markup is gone.
 */

/** Courses in the pile. `--raised` runs from 0 to this. */
export const COURSES = 11;

/** `[raise order, width, left offset]` per course, bottom of each pile first. */
const PILES: readonly { width: string; courses: readonly [number, string, string][] }[] = [
  { width: '1.5rem', courses: [[1, '100%', '0'], [4, '86%', '7%']] },
  {
    width: '4.4rem',
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
  { width: '1.1rem', courses: [[6, '100%', '0']] },
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

  const glimmer = document.createElement('div');
  glimmer.className = 'raise-glimmer';
  field.append(glimmer);

  const ground = document.createElement('div');
  ground.className = 'raise-ground';

  root.append(field, ground);
  return root;
}

/** How far up the pile a fraction of the way through is. */
export function raisedTo(progress: number): string {
  return String(Math.min(Math.max(progress, 0), 1) * COURSES);
}
