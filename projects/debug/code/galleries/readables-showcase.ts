import * as THREE from 'three';
import type { GalleryPlan } from './layout';
import { signPost } from './layout';
import { markReadable } from '@engine/world/Interaction';
import { DEFAULT_TUNING } from '@engine/player/Controller';
import { type CoverBuilder } from '@engine/art/book';
import { leatherBook } from '@engine/art/builders/leather-book';
import { claspedTome } from '@engine/art/builders/clasped-tome';
import { ledger } from '@engine/art/builders/ledger';
import { boardBook } from '@engine/art/builders/board-book';
import { pamphlet } from '@engine/art/builders/pamphlet';
import { clothBook } from '@engine/art/builders/cloth-book';
import { vellumBook } from '@engine/art/builders/vellum-book';
import { giltBook } from '@engine/art/builders/gilt-book';
import { batteredBook } from '@engine/art/builders/battered-book';
import { rollerScroll } from '@engine/art/builders/roller-scroll';
import { READING_FIXTURES } from '../reading-fixtures';

/**
 * The Readables Showcase: the reading system, demonstrated.
 *
 * The gallery next door holds the objects and says nothing about reading. This
 * room is the other half, and the distinction is what it can do rather than
 * what it is made of: **nearly everything in here is bound to a note and opens
 * when you press the key.** A room full of books you can only look at would be
 * the gallery with different lighting.
 *
 * One station per claim, the way the Light, Dark and Fog rooms are built. No
 * rank, no rows of seeds.
 *
 * **Books float.** Every station hangs its objects in the air at a height you
 * can read them at, tipped to face the way you came in: no desks, no shelves,
 * no lectern staging. A showcase is a rig, and hanging one prop off another
 * means judging two things at once and moving both when one of them is wrong.
 *
 * The prose is split the way it has to be. The reading station and the
 * accessibility pass use the **real** note out of `content/notes`, because what
 * they are asking is how a page of writing reads. The pagination row uses the
 * **fixtures**, because what it is asking is what happens to a page that has no
 * sensible answer.
 */

export const ZONE_READABLES_SHOWCASE = 'readables-showcase';

/** The one note there is. Both stations that judge *reading* use it. */
const REAL = 'field-hand';

/**
 * How far a hanging book is tipped back, in radians.
 *
 * A book is built lying flat, so a floating one presents its own edge to
 * somebody standing in front of it — a 5 cm sliver, and nothing to judge. This
 * turns the cover to face the door.
 */
const FACING = 1.15;

/** A book hanging at eye height, facing the way in. Bound unless `text` is null. */
function hang(x: number, z: number, seed: number, text: string | null, open = false): THREE.Mesh {
  const book = leatherBook.build({ seed, state: open ? 'open' : 'shut' });
  book.position.set(x, DEFAULT_TUNING.eyeHeight, z);
  book.rotation.x = FACING;
  if (text !== null) markReadable(book, leatherBook, text);
  return book;
}

/** A station's caption, standing beside its exhibit rather than in front of it. */
function caption(name: string, says: string, x: number, z: number): THREE.Group {
  const post = signPost(name, says);
  post.position.set(x, 0, z);
  return post;
}

/**
 * The reading station: one book, one note, the whole loop.
 *
 * Dead ahead of the door, because it is the claim the room exists to make.
 * Walk up, read two lines over the crosshair, press the key, read it, close it.
 */
function readingStation(): THREE.Object3D[] {
  return [
    caption('reading-station', 'Reading Station — Look At It And Press E', -1.5, 11.8),
    hang(0, 11, 5101, REAL),
  ];
}

/**
 * The state matrix: every builder that has a state, in both of them.
 *
 * The only place the options are visible at all, and the reason this room is
 * separate from the gallery — a rank only ever calls `build({ seed })`, so it
 * shows every builder in its default state and no other. One row per cover,
 * default on the left and the alternative on the right, and **the same seed
 * across the pair**: the row is a claim about the state, so anything else that
 * moved between the two would be in the frame arguing with it.
 */
const STATED: readonly CoverBuilder[] = [
  leatherBook,
  claspedTome,
  ledger,
  boardBook,
  pamphlet,
  clothBook,
  vellumBook,
  giltBook,
  batteredBook,
];

function stateMatrix(): THREE.Object3D[] {
  const objects: THREE.Object3D[] = [
    caption('state-matrix', 'State Matrix — Shut And Open', 5.2, 12.4),
  ];

  STATED.forEach((builder, i) => {
    const z = 11.6 - i * 1.5;
    for (const [column, open] of [[0, false], [1, true]] as const) {
      const book = builder.build({ seed: 5200 + i * 97, state: open ? 'open' : 'shut' });
      book.position.set(7.4 + column * 2.4, DEFAULT_TUNING.eyeHeight, z);
      book.rotation.x = FACING;
      markReadable(book, builder, REAL);
      objects.push(book);
    }
  });

  // The scroll is the odd one out — its states are rolled and spread, not shut
  // and open — so it goes on the end of the matrix rather than being left off
  // it. A room that shows nine builders' states and quietly skips the tenth has
  // stopped being a matrix.
  const bottom = 11.6 - STATED.length * 1.5;
  for (const [column, open] of [[0, false], [1, true]] as const) {
    const roll = rollerScroll.build({ seed: 5290, state: open ? 'unrolled' : 'rolled' });
    roll.position.set(7.4 + column * 2.4, DEFAULT_TUNING.eyeHeight, bottom);
    roll.rotation.x = FACING;
    markReadable(roll, rollerScroll, REAL);
    objects.push(roll);
  }

  return objects;
}

/**
 * The legibility run: the same open page at four distances.
 *
 * The one number the illegible marks have — how heavy a row of them is —
 * cannot be picked at any single range. Too fine and the page is a grey
 * rectangle from two paces; too coarse and walking up to it resolves into a
 * barcode. One seed across all four, because four different books would put
 * variation in the frame beside the thing being measured.
 */
function legibilityRun(): THREE.Object3D[] {
  const mark = 13;
  const objects: THREE.Object3D[] = [
    caption('legibility-run', 'Legibility Run — 0.5, 1, 2, 4 m', -10.4, mark),
  ];
  for (const range of [0.5, 1, 2, 4]) {
    objects.push(hang(-9, mark - range, 5301, REAL, true));
  }
  return objects;
}

/**
 * The findability row: one bound book among many that are not.
 *
 * Two things at once, and the second is the one that is easy to lose. That the
 * bound one speaks is obvious. That the other twelve *do not* is the rule
 * working — a book with nothing written in it is furniture, and a row of them
 * should read as furniture rather than as twelve things that are broken.
 *
 * The bound one is off centre on purpose. In the middle it would be found by
 * standing still.
 */
function findabilityRow(): THREE.Object3D[] {
  const count = 13;
  const bound = 9;
  const pitch = 1.1;
  const objects: THREE.Object3D[] = [
    caption('findability-row', 'Findability — One Of These Is Written In', -(count * pitch) / 2 - 1.4, 5),
  ];
  for (let i = 0; i < count; i++) {
    const x = (i - (count - 1) / 2) * pitch;
    objects.push(hang(x, 5, 5400 + i * 131, i === bound ? REAL : null));
  }
  return objects;
}

/**
 * The pagination extremes: four notes with no sensible answer.
 *
 * Each book carries its own label, because the second line of the tooltip is
 * the note's title — so the row names itself and needs no captions of its own.
 */
function paginationRow(): THREE.Object3D[] {
  const objects: THREE.Object3D[] = [
    caption('pagination-row', 'Pagination Extremes', -6.6, -1),
  ];
  READING_FIXTURES.forEach((note, i) => {
    const x = (i - (READING_FIXTURES.length - 1) / 2) * 3;
    objects.push(hang(x, -1, 5500 + i * 271, note.id));
  });
  return objects;
}

/**
 * The accessibility pass: the same real note, read under the switches.
 *
 * Nothing here is geometry — it is one book and an instruction, and it is a
 * station because measured pagination has to *prove* it measured. The
 * dyslexia-friendly face is substantially wider than the default at the same
 * size, so a note that pages correctly in one and clips in the other is a
 * pagination that was estimated rather than measured.
 */
function accessibilityPass(): THREE.Object3D[] {
  return [
    caption('accessibility-pass', 'Accessibility — Largest Size, OpenDyslexic On', -2.4, -7),
    hang(0, -7, 5601, REAL),
  ];
}

export const readablesShowcasePlan: GalleryPlan = {
  id: ZONE_READABLES_SHOWCASE,
  group: 'general',
  name: 'Readables Showcase',
  // No rank. Every gallery in the game is a rank of seeds and this room is the
  // one that is not — what it shows cannot be built by calling a builder eight
  // times, which is exactly why it is not the gallery.
  builders: [],
  extras: () => [
    ...readingStation(),
    ...stateMatrix(),
    ...legibilityRun(),
    ...findabilityRow(),
    ...paginationRow(),
    ...accessibilityPass(),
  ],
};
