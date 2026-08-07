import { shelfCase } from '../shelf';

/**
 * A case of shelves with books on every one of them.
 *
 * The default, because a bare bookcase is not a plain object, it is a missing
 * one — see `art/shelf.ts`, which makes that argument at length and holds the
 * whole construction. This file is the fullness and nothing else.
 */
export const bookshelf = shelfCase('bookshelf', 'full');
