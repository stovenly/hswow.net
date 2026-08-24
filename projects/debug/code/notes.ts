import { registerNotes, type Note } from '@engine/world/notes';

/**
 * Everything written down in the debug project's world.
 *
 * **The words here are placeholders** — engineering scaffolding, so there is
 * something to page through and something to put over a crosshair. None of it
 * is the world's fiction; the naming and the writing are the repo owner's.
 */

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

registerNotes(NOTES);
