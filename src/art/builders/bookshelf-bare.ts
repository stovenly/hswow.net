import { shelfCase } from '../shelf';

/**
 * The carcass on its own, for a placer who is bringing their own books.
 *
 * The kit's own books are a convenience — one entry instead of a hundred — and
 * a convenience that cannot be turned off is a constraint. This is the version
 * you put in a room and then hand-place exactly what belongs on it.
 *
 * The same case as `bookshelf` at the same seed, down to the joinery: every
 * roll that decides the carpentry is drawn before anything is shelved, so these
 * two are one bookcase photographed with and without its contents.
 */
export const bookshelfBare = shelfCase('bookshelf-bare', 'empty');
