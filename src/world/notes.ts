/**
 * The note registry: the shape of a note, and the one lookup everything that
 * binds prose to an object goes through.
 *
 * **Notes are stored apart from the things that carry them.** A book in a zone
 * document is a builder and a seed; what is written in it is one `text` id
 * pointing here. The same prose can move from a book to a letter without being
 * rewritten. A readable with no `text` is furniture, which is the common case.
 *
 * The format: a blank line starts a paragraph, a line of three or more hyphens
 * forces a page, and `[[keyword]]` marks a term the reader can be taught.
 * There is deliberately nothing else — no bold, no headings, no alignment. The
 * reading screen decides what a note looks like, and a format that lets one
 * note style itself is a format where two notes disagree.
 */

export interface Note {
  /** What an entry's `text` field points at. Stable; the prose may be rewritten. */
  readonly id: string;
  /**
   * The lower and louder of the two lines over the crosshair: what is *written
   * in* the thing, as against what the thing is. A Leather Bound Book is an
   * object and A Treatise On Prague is the reason to pick it up. Short enough
   * to sit on one line.
   */
  readonly title: string;
  readonly body: string;
}

const notes = new Map<string, Note>();

/** Every registered note, in registration order. */
export function allNotes(): readonly Note[] {
  return [...notes.values()];
}

/**
 * The note an entry's `text` field names, or nothing. Nothing is a real answer
 * at runtime and a fault at build time: a binding that resolves to no note
 * should be caught while the id and the entry that carries it are both in
 * front of you, not by a player opening a book onto a blank page.
 */
export function noteById(id: string): Note | undefined {
  return notes.get(id);
}

/** Adds notes to the registry. A repeated id replaces what was there. */
export function registerNotes(list: readonly Note[]): void {
  for (const note of list) notes.set(note.id, note);
}
