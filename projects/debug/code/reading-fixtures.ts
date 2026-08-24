import { registerNotes, type Note } from '@engine/world/notes';

/**
 * Notes built to break the reading screen.
 *
 * Engineering fixtures, not content — the Text Showcase's rule, and the same
 * one. These exist so the pagination can be judged against the cases that have
 * no sensible answer; what an ordinary note *reads* like is judged against an
 * ordinary note, which is what `content/notes` is for.
 *
 * The four are the four ways the box can be wrong. A single word proves an
 * almost-empty page is still a page and still counts. Forty pages proves the
 * paginator does not slow to a crawl and that the count is right at the far
 * end. A run with nowhere to break would silently lose its tail. An empty body
 * is what a loader hands over when a note exists and nobody has written it yet,
 * which will happen the first day the editor is used.
 *
 * A title long enough to overflow the tooltip is deliberately *not* here. A
 * title that does not fit is a fault to refuse, not one to demonstrate.
 */

const SENTENCES = [
  'The quick brown fox jumps over the lazy dog.',
  'Pack my box with five dozen liquor jugs.',
  'How vexingly quick daft zebras jump.',
  'Sphinx of black quartz, judge my vow.',
  'Jackdaws love my big sphinx of quartz.',
  'Waltz, bad nymph, for quick jigs vex.',
] as const;

/**
 * A wall of repeated pangrams.
 *
 * Repetition is the point *here* and only here: this fixture is a length, and
 * a length is all it is measuring. Nothing about how a page reads should be
 * judged off it — the same six sentences coming round every paragraph makes it
 * useless for that.
 */
function filler(paragraphs: number, sentences: number): string {
  const out: string[] = [];
  let at = 0;
  for (let p = 0; p < paragraphs; p++) {
    const lines: string[] = [];
    for (let s = 0; s < sentences; s++) lines.push(SENTENCES[at++ % SENTENCES.length]);
    out.push(lines.join(' '));
  }
  return out.join('\n\n');
}

export const READING_FIXTURES: readonly Note[] = [
  { id: 'fixture-one-word', title: 'One Word', body: 'Sphinx.' },
  { id: 'fixture-long', title: 'Forty Pages', body: filler(90, 6) },
  {
    id: 'fixture-unbroken',
    title: 'No Spaces',
    body: 'Sphinxofblackquartzjudgemyvow'.repeat(60),
  },
  { id: 'fixture-empty', title: 'Empty', body: '' },
];

// Registered on import, so a book in the showcase can be bound to one of these
// through exactly the path a book in the world uses. Nothing else has to know
// that these are fixtures.
registerNotes(READING_FIXTURES);
