import * as THREE from 'three';
import type { BuildOptions, MeshBuilder } from './types';
import { assemble, finish, type Part } from './assemble';
import { bookParts, type Book, type CoverBuilder } from './book';
import { createRng, type Rng } from './random';
import { PALETTE, shade } from './palette';
import { boardBook } from './builders/board-book';
import { leatherBook } from './builders/leather-book';
import { claspedTome } from './builders/clasped-tome';
import { ledger } from './builders/ledger';
import { pamphlet } from './builders/pamphlet';

/**
 * A case of shelves, filled, half emptied, or bare.
 *
 * **A bare bookshelf is not a plain object, it is a missing one** — which is
 * why it arrives full. The dresser's crockery was cut on the argument that a
 * prop should not stage a scene, and that argument is right about a dresser and
 * wrong here: a dresser with nothing on it is a piece of furniture, and a
 * bookcase with nothing in it is a bookcase somebody has moved out of.
 *
 * But *full* cannot be the only answer, because the books it stocks itself with
 * are the builder's and a placer may want their own on it — a shelf that has to
 * be argued with is a shelf that gets used once. Hence `fill`: take the case
 * with its own books, take it with room left on it, or take the carcass and put
 * whatever you like there.
 *
 * The shelves are stocked from the cover profiles themselves rather than from a
 * table of dimensions kept here, which is the reason `Cover` rides on the
 * builder — one library, one set of numbers, and a cover that changes shape
 * changes shape on the shelf too.
 *
 * **Two meshes, and that is the important part.** A filled case is upward of a
 * hundred books and several thousand triangles packed into a couple of square
 * metres, which is precisely the arrangement `assemble.ts` warns about: the
 * collider's cost rises faster than linearly with how densely triangles are
 * packed, and pressing the player's capsule into a wall of spines would cost
 * whole milliseconds a frame. The carcass is what you collide with; the books
 * are a child mesh flagged `noCollide`, drawn and never indexed.
 *
 * Built facing +Z, standing against a wall behind it.
 */

/**
 * How much of the case has books on it.
 *
 * **A builder each, not an option on one.** It was an option, and an option is
 * invisible: a gallery rank only ever calls `build({ seed })`, so a room built
 * to show the kit showed nothing but full cases and there was no way to see
 * that the other two existed at all. The same argument the covers are split on,
 * arriving from the other direction — the catalogue is a list of builders, so
 * anything that is not a builder is not in the catalogue.
 *
 * Never the seed's decision either way. A case that arrived full or empty
 * depending on a number nobody chose could not be put in a room on purpose,
 * which is the same argument that keeps a chest's lid shut.
 */
export type ShelfFill = 'full' | 'part' | 'empty';

/**
 * What it stocks, and how often.
 *
 * Repeated entries are the weighting. The plain board book appears three times
 * because a shelf is mostly ordinary books — see its own header, which is the
 * argument for why the interesting covers need the dull one around them.
 */
const STOCK: readonly CoverBuilder[] = [
  boardBook,
  boardBook,
  boardBook,
  leatherBook,
  claspedTome,
  ledger,
  pamphlet,
];

/** Board thickness for the carcass, and how far books stand back from the front. */
const TIMBER = 0.022;
const SETBACK = 0.012;
/** How far past that a book may be pushed, so the spines are not a ruled line. */
const SHUFFLE = 0.016;
/**
 * Room kept between the deepest book and the back of the case.
 *
 * Covers the backing panel, the bulge of a rounded spine and a little air. A
 * case is only 30 cm deep and a folio is 27 cm wide, so this is the difference
 * between *a shallow case does not stock folios* and *a folio stands out
 * through the back of it*.
 */
const BACKROOM = 0.035;

/**
 * One case at one fullness.
 *
 * **The carcass is the same case whichever fullness asked for it.** Every roll
 * that decides the joinery is drawn before anything is put on a shelf, and the
 * per-shelf fullness is rolled whether or not it is used — so `bookshelf` and
 * `bookshelf-bare` at seed 7 are the same bookcase with and without books in
 * it, and a placer can swap one for the other without the furniture moving.
 */
export function shelfCase(name: string, fill: ShelfFill): MeshBuilder {
  return {
    name,
    category: 'furniture',
    radius: 0.65,
    build: (options = {}) => buildCase(name, fill, options),
  };
}

function buildCase(name: string, fill: ShelfFill, { seed = 1, scale = 1 }: BuildOptions): THREE.Mesh {
  const rng = createRng(seed);
    const carcass: Part[] = [];
    const books: Part[] = [];

    const width = rng.range(0.86, 1.16);
    const depth = rng.range(0.27, 0.33);
    const plinth = rng.range(0.05, 0.08);
    const timber = rng.chance(0.5) ? PALETTE.TIMBER_DARK : shade(PALETTE.TIMBER, 0.86);

    // **The shelves are sized before the case is.** Each gap is rolled first
    // and the height is what they add up to, rather than a height being rolled
    // and divided — divided, every case comes out with the same regular ladder
    // of shelves, and a real one has a deep gap at the bottom for the tall
    // books and shallower ones above.
    const levels = rng.int(4, 5);
    const gaps: number[] = [];
    for (let i = 0; i < levels; i++) {
      // Deepest at the bottom, which is where the folios go.
      const t = i / Math.max(1, levels - 1);
      gaps.push(rng.range(0.42 - t * 0.14, 0.47 - t * 0.15));
    }

    const inner = width - TIMBER * 2;
    const height = plinth + gaps.reduce((a, b) => a + b + TIMBER, 0) + TIMBER;

    // --- the carcass ----------------------------------------------------------
    for (const sx of [-1, 1]) {
      const side = new THREE.BoxGeometry(TIMBER, height, depth);
      side.translate((sx * (width - TIMBER)) / 2, height / 2, 0);
      carcass.push({ geometry: side, color: shade(timber, 0.94), sway: 0 });
    }

    const foot = new THREE.BoxGeometry(width * 0.97, plinth, depth * 0.94);
    foot.translate(0, plinth / 2, 0);
    carcass.push({ geometry: foot, color: shade(timber, 0.82), sway: 0 });

    const top = new THREE.BoxGeometry(width * 1.04, TIMBER * 1.3, depth * 1.06);
    top.translate(0, height - TIMBER * 0.65, 0);
    carcass.push({ geometry: top, color: shade(timber, 1.08), sway: 0 });

    // A thin back, so the case does not read as a frame with a hole in it and
    // the books have something to be seen against.
    const backing = new THREE.BoxGeometry(inner, height - plinth, 0.008);
    backing.translate(0, plinth + (height - plinth) / 2, -depth / 2 + 0.006);
    carcass.push({ geometry: backing, color: shade(timber, 0.7), sway: 0 });

    // --- the shelves, and what is on them --------------------------------------
    let level = plinth;
    for (let i = 0; i < levels; i++) {
      const gap = gaps[i];
      // Rolled per shelf even when the case is empty, so a case is the same
      // case whichever way it was asked for — only its contents change.
      const how = rng();
      if (fill !== 'empty') {
        stock(books, rng, inner, gap, level, depth, fill === 'full' ? 1 : partial(how));
      }

      level += gap;
      const board = new THREE.BoxGeometry(inner * 1.005, TIMBER, depth * 0.93);
      board.translate(0, level + TIMBER / 2, 0.004);
      carcass.push({ geometry: board, color: timber, sway: 0 });
      level += TIMBER;
    }

    const geometry = assemble(carcass);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    const mesh = finish(geometry, name, 0);

    // The contents, in their own mesh. Never merged into the carcass: see the
    // header — this is the whole reason a filled case is affordable.
    if (books.length > 0) {
      const contents = assemble(books);
      if (scale !== 1) contents.scale(scale, scale, scale);
      const shelved = finish(contents, 'bookshelf-books', 0);
      shelved.userData.noCollide = true;
      mesh.add(shelved);
    }

  return mesh;
}

/**
 * How much of one shelf is used, on a partly emptied case.
 *
 * Not a uniform fraction. A case somebody has been taking books off has *some*
 * shelves untouched and some nearly bare, because a person empties a shelf at a
 * time — an even three-quarters everywhere reads as a setting rather than as
 * something that happened.
 */
function partial(roll: number): number {
  // **Never a full shelf**, however the roll lands. A builder called
  // *part-filled* that sometimes builds a full case is a builder that lies
  // about itself, and a placer picking it off a list has no way to know that
  // the one they got was the exception.
  if (roll < 0.24) return 0.88;
  if (roll < 0.44) return 0;
  return 0.26 + roll * 0.45;
}

/** One run of like books: a set, or a stray. */
interface Run {
  books: Book[];
  /** What it sorts by — its height, with enough noise to stop the shelf ruling itself. */
  key: number;
}

/**
 * Fills one shelf.
 *
 * **A shelf is runs of like books, not a stream of dice rolls.** The first
 * version picked a cover per book and stood it where the last one ended, which
 * is random and reads as random: a 15 cm pamphlet between two 35 cm folios,
 * three bindings alternating, no two neighbours agreeing about anything. Nobody
 * shelves like that, and the thing that gives it away is not any single book —
 * it is that no two of them are related.
 *
 * So two rules, and they are the two a person actually follows.
 *
 * **Like goes with like.** Books arrive in runs: one cover, one height, and
 * often one colour, two to six of them — which is a set, and a set is what a
 * shelf mostly is. A run of matched spines is the single most legible thing on
 * a bookcase and it cannot come out of a per-book roll, because the whole point
 * of it is that the books agree.
 *
 * **Tall to short.** The runs are then ordered by height along the shelf, one
 * way or the other. Not exactly — the sort key carries noise, so the gradient
 * is there without the shelf looking as though it had been ruled — but enough
 * that the eye reads an arrangement instead of a scatter.
 */
function stock(
  parts: Part[],
  rng: Rng,
  inner: number,
  gap: number,
  level: number,
  depth: number,
  density: number,
): void {
  if (density <= 0) return;

  // Off the shelf board by a hair, so a hundred books do not share a plane with
  // the timber they stand on.
  const foot = level + 0.0006;
  const headroom = gap - 0.012;
  // Front to back, from the spine line to where the backing starts.
  const clear = depth - SETBACK - SHUFFLE - BACKROOM;
  // A cover has to fit both ways round. Filtered on the *smallest* book it can
  // roll, since a cover that cannot make one that fits should not be offered at
  // all — clamping it instead would give a shelf full of the same cover cut to
  // the same size, which is worse than not stocking it.
  const fits = STOCK.filter(
    (builder) =>
      builder.plan.height[0] < headroom &&
      builder.plan.height[0] * builder.plan.proportion[0] < clear,
  );
  if (fits.length === 0) return;

  const room = inner * density - 0.008;
  const runs: Run[] = [];
  let used = 0;

  while (used < room) {
    const builder = rng.pick(fits);
    // The tallest this cover may be here, and then the run's own height under
    // it. Every book in the run is built to within a couple of per cent of it.
    const ceiling = Math.min(
      headroom,
      clear / builder.plan.proportion[1],
      builder.plan.height[1],
    );
    const shortest = Math.min(builder.plan.height[0], ceiling * 0.95);
    const stature = rng.range(shortest, ceiling);

    // A matched set carries one colour through. Not always — a run of the same
    // binding in four colours is just as real, and it is what a shelf of
    // somebody's own books looks like.
    const matched = rng.chance(0.5);
    const hide = rng.pick(builder.plan.hide);
    const spine = builder.plan.spine ? rng.pick(builder.plan.spine) : undefined;

    const run: Run = { books: [], key: stature + rng.around(0, 0.022) };
    const want = rng.int(1, 6);
    for (let i = 0; i < want && used < room; i++) {
      const book = bookParts(builder.plan, rng, {
        height: stature * rng.range(0.985, 1),
        tallest: ceiling,
        hide: matched ? hide : undefined,
        spine: matched ? spine : undefined,
      });
      if (used + book.thickness > room) break;
      run.books.push(book);
      used += book.thickness + rng.range(0.0004, 0.0022);
    }

    if (run.books.length === 0) break;
    runs.push(run);
  }

  if (runs.length === 0) return;

  // Ordered along the shelf. The direction is the shelf's own, so a case does
  // not read as five copies of one arrangement.
  const direction = rng.chance(0.5) ? 1 : -1;
  runs.sort((a, b) => (a.key - b.key) * direction);

  const laid = runs.flatMap((run) => run.books);
  let x = -inner / 2 + rng.range(0.004, 0.02);
  const placed: { at: number; book: Book }[] = [];
  for (const book of laid) {
    placed.push({ at: x + book.thickness / 2, book });
    x += book.thickness + rng.range(0.0004, 0.0022);
  }

  // How much shelf is left over. Anything more than a book's own width and the
  // last one goes over into it — a book can only fall into a space, and the end
  // of the run is the only place there is one.
  const slack = inner / 2 - x;
  const last = placed[placed.length - 1];
  const lean =
    slack > last.book.thickness * 1.6 && rng.chance(0.6)
      ? Math.min(rng.range(0.18, 0.42), Math.atan(slack / last.book.height))
      : 0;

  for (let i = 0; i < placed.length; i++) {
    const { at, book } = placed[i];
    const tipped = i === placed.length - 1 ? lean : 0;
    const back = rng.range(0, SHUFFLE);
    for (const part of book.parts) {
      // About its own base, which is where a book actually pivots when it goes
      // over — the geometry is authored standing on the origin, so the rotation
      // needs no pivot arithmetic at all.
      //
      // Negative, and that sign is the whole of it: a positive turn about Z
      // takes the head of the book to *−x*, which is into the row it is
      // standing at the end of. A book can only fall into the space.
      if (tipped !== 0) part.geometry.rotateZ(-tipped);
      // Lined up by the spine face rather than by the middle, so a fat rounded
      // back and a flat one present the same plane — and then pushed back a
      // little at random, because a shelf where every spine is exactly flush is
      // a shelf somebody has just tidied.
      part.geometry.translate(at, foot, depth / 2 - SETBACK - book.reach - back);
      parts.push(part);
    }
  }

  // **Nothing lies flat.** There was a pile of books on its side in the leftover
  // space at the end of a run, on the argument that it is what a real shelf does
  // with a gap too small to stand another book up in. It is, and it is not this
  // builder's decision to make: a stack is a thing a placer puts somewhere,
  // which is why there is no stack builder either. The gap stays a gap.
}
