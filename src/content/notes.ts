/**
 * Everything written down in the world.
 *
 * **Notes are stored apart from the things that carry them.** A book in a zone
 * file is a builder and a seed; what is written in it is one `text` id
 * pointing here. The same prose can move from a book to a letter without
 * being rewritten, and a book can be re-dressed without touching a word. A
 * readable with no `text` is furniture, which is the common case.
 *
 * **The words here are placeholders** — engineering scaffolding, so there is
 * something to page through and something to put over a crosshair. None of it
 * is the world's fiction; the naming and the writing are the repo owner's.
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

export const NOTES: readonly Note[] = [
  {
    id: 'field-hand',
    title: 'A Hand Kept In The Field',
    body: `Every word of this is placeholder. It is here so that something in the world
is bound to something written, and so the walk from a crosshair to a page and
back can be made before there is any fiction to put through it.

It is deliberately continuous prose rather than a wall of repeated sentences.
A note built by cycling a handful of pangrams tests the length of a page and
nothing else, and the length of a page is the least interesting thing about
it. What has to be judged here is how the type sits: whether the measure is
too wide to track back to, whether the leading is loose enough at the largest
text size and still tight enough at the smallest, and whether the indent
between paragraphs is doing the work that a blank line would otherwise be
spending a whole line of a short page on.

Read the second and third lines of a paragraph rather than the first. The eye
forgives the opening of anything; where a setting goes wrong is halfway down,
when you have stopped noticing the page and are only following the sentence.

---

The mark above forces this page whatever else would have fitted, and it is the
only piece of formatting the note format has. There is no bold, no heading and
no alignment, because the screen decides what a note looks like — a format
that lets one note style itself is a format where two notes disagree, and by
then there are forty of them.

The rest is arithmetic that cannot be done in advance. How many words reach
the foot of the box depends on the typeface, the size the reader has chosen
and the shape of the window, and no two of those are known when this is
written. So the words go into the real box and the browser is asked how tall
they came out, which is slower than a guess and is right.`,
  },
];

/**
 * The note an entry's `text` field names, or nothing. Nothing is a real answer
 * at runtime and a fault at build time: a binding that resolves to no note
 * should be caught while the id and the entry that carries it are both in
 * front of you, not by a player opening a book onto a blank page.
 */
export function noteById(id: string): Note | undefined {
  return NOTES.find((note) => note.id === id) ?? rig.get(id);
}

const rig = new Map<string, Note>();

/**
 * Adds notes that exist for a rig rather than for the world. The showcase binds
 * books to notes built to break pagination — one word, forty pages, a run with
 * nowhere to break. They resolve like any other note so the whole path from
 * crosshair to page is the real one, and they stay out of `NOTES`.
 */
export function registerNotes(notes: readonly Note[]): void {
  for (const note of notes) rig.set(note.id, note);
}
