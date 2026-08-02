/**
 * Species small enough that their shadows are not worth drawing.
 *
 * Nothing subtle: grass and small flowers, which are the only things that get
 * scattered by the hundred. At a three-pixel chunk and a five-level quantize a
 * tuft's shadow is at most a couple of pixels, and there are more tufts in a
 * hub than everything else put together — so they are most of the shadow pass
 * and almost none of the picture.
 *
 * **A name that is not here casts.** The same default `FLEX` takes, for the
 * same reason: a barrel that quietly stopped casting because somebody added it
 * to a list is a worse failure than a new plant that keeps its shadow until
 * somebody decides otherwise.
 *
 * Kept per species rather than derived from a size threshold, because size does
 * not separate the two groups — an anvil is 0.50 m across and a grass clump is
 * 0.55 m. A threshold would also cut *through* a scatter, since one builder's
 * instances vary in size, and half a field with shadows reads as a bug.
 *
 * This is a look, not a fact about the world: `?debug` → look → "grass casts
 * shadows" puts them back, and Phase 9 can hang a real graphics option off the
 * same switch.
 *
 * A leaf module with no imports, so `assemble` can apply it without a cycle.
 */
export const CLUTTER: ReadonlySet<string> = new Set([
  'small-grass-clump',
  'large-grass-clump',

  // The small flowers. Sunflower is deliberately absent — it stands as tall as
  // a person and reads as a plant you could walk up to, which is exactly the
  // line this list is drawn along.
  'daisy',
  'bluebell',
  'poppy',
  'lavender',
  'wildflower',
  'thistle',
]);
