import type { GalleryPlan } from './layout';
import { leatherBook } from '../../art/builders/leather-book';
import { claspedTome } from '../../art/builders/clasped-tome';
import { boardBook } from '../../art/builders/board-book';
import { ledger } from '../../art/builders/ledger';
import { pamphlet } from '../../art/builders/pamphlet';
import { bookshelf } from '../../art/builders/bookshelf';
import { bookshelfPart } from '../../art/builders/bookshelf-part';
import { bookshelfBare } from '../../art/builders/bookshelf-bare';
import { rollerScroll } from '../../art/builders/roller-scroll';
import { scrollCase } from '../../art/builders/scroll-case';
import { clothBook } from '../../art/builders/cloth-book';
import { vellumBook } from '../../art/builders/vellum-book';
import { giltBook } from '../../art/builders/gilt-book';
import { batteredBook } from '../../art/builders/battered-book';
import { looseNote } from '../../art/builders/loose-note';
import { foldedLetter } from '../../art/builders/folded-letter';
import { lectern } from '../../art/builders/lectern';

/**
 * The Readables Gallery: the books, letters, notes and scrolls as objects.
 *
 * Only what they *look* like. Whether a book can be read, what it says and how
 * the reading screen behaves are a different set of claims and get a room of
 * their own — see the Readables Showcase. The split is the one every gallery
 * makes: a rank of eight seeds proves a builder varies, and it cannot prove
 * anything about a system, because a rank only ever calls `build({ seed })`.
 *
 * These are small. The rank spacing is written for huts and oaks, so a row of
 * books is a long walk between eight things you have to stand over — which is
 * itself the honest test, since that is the range a reader finds one at.
 */

export const ZONE_READABLES_GALLERY = 'readables-gallery';

// Heaviest first and lightest last, so the rank reads as a range rather than
// as a list — the covers are meant to be judged against each other, and the
// only way to see that two of them are the same size is to stand them apart.
// The shelf closes it, because a shelf is what all of them end up inside.
const READABLE_BUILDERS = [
  // The covers, heaviest to lightest.
  claspedTome,
  giltBook,
  leatherBook,
  vellumBook,
  ledger,
  batteredBook,
  clothBook,
  boardBook,
  pamphlet,
  // Then what was never bound, and the furniture it ends up on.
  rollerScroll,
  scrollCase,
  foldedLetter,
  looseNote,
  lectern,
  bookshelf,
  bookshelfPart,
  bookshelfBare,
];

export const readablesGalleryPlan: GalleryPlan = {
  id: ZONE_READABLES_GALLERY,
  group: 'general',
  name: 'Readables',
  builders: READABLE_BUILDERS,
};
