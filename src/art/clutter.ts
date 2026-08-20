/**
 * Species small enough that their shadows are not worth drawing: grass and small
 * flowers, the only things scattered by the hundred. At a three-pixel chunk and a
 * five-level quantize a tuft's shadow is at most a couple of pixels, and there
 * are more tufts in a hub than everything else put together.
 *
 * A name that is not here casts — the same default `FLEX` takes. Kept per species
 * rather than derived from a size threshold, because size does not separate the
 * two groups (an anvil is 0.50 m across and a grass clump 0.55 m), and a
 * threshold would cut through a scatter, leaving half a field with shadows.
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
