import { shelfCase } from '../shelf';

// A case of shelves with books on every one of them. The construction is in
// `art/shelf.ts`; this file is the fullness and nothing else.
export const bookshelf = shelfCase('bookshelf', 'full');
