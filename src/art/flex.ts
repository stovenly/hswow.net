/**
 * How much each species responds to wind, 0..1. The per-vertex `sway` attribute
 * every builder authors already says where a thing bends; this says whether the
 * species bends at all, which is a fact about the plant rather than about a
 * vertex — a mushroom's cap and a reed's tip are both the far end from the
 * ground, and only one of them moves.
 *
 * One table rather than a field on each of seventy builders, because the
 * judgement is comparative: the useful question is never how much a thistle moves
 * but whether it moves more than a fern. A name that is not here does not move,
 * which is the right default.
 *
 * A leaf module with no imports, so `assemble` can apply it without a cycle back
 * through `sway`.
 */
export const FLEX: Record<string, number> = {
  // Thin, light, and built to bend. The archetypes.
  reeds: 1,
  'small-grass-clump': 0.95,
  'large-grass-clump': 0.9,

  // Light heads on thin stems.
  cowparsley: 0.85,
  wildflower: 0.8,
  poppy: 0.8,
  bluebell: 0.8,
  daisy: 0.75,
  lavender: 0.7,
  foxglove: 0.5,

  // Leafy, and stiffer than they look.
  fern: 0.6,
  nettle: 0.6,

  // Woody. The plant barely moves; the tips do, and the authored weights are
  // already shaped for that — this only decides how far.
  'small-tree': 0.6,
  tree: 0.55,
  bush: 0.5,

  // The three bushes, and they are not one thing. Elder is soft-wooded with
  // big loose leaves and moves nearly as freely as a young tree; hazel is a
  // sheaf of whippy multi-stems; gorse is a dense spiny cushion that barely
  // acknowledges weather at all, which is most of what makes it read as gorse.
  elder: 0.65,
  hazel: 0.6,
  gorse: 0.25,

  // Thin-stemmed and famously restless — the most mobile tree in the kit. The
  // sapling moves *more* than the adult, which is not a mistake: a young birch
  // is a wand, and the grown one at least has a trunk to hold it.
  'small-birch': 0.8,
  birch: 0.75,
  // Massive. The crown stirs and the trunk does not, and the sapling is stiff
  // for its size — which is most of what says oak rather than whip.
  'small-oak': 0.5,
  oak: 0.35,

  // A spruce is the stiffest. Short horizontal boughs on a thick straight
  // leader barely move; what you actually see is the top nodding. Below the
  // bushes on purpose.
  'small-spruce': 0.4,
  spruce: 0.3,
  bramble: 0.4,
  thistle: 0.35,

  // The two boundary masses sit low for gorse's reason: what makes a hedge or a
  // thicket read as impassable is that it is a solid interlocking body of wood,
  // and that does not billow. `snag`, `deadfall` and `root-tangle` are
  // deliberately absent — dead wood does not bend, and that is most of what makes
  // it read as dead.
  thicket: 0.3,
  hedge: 0.2,

  // A thick stem carrying a heavy head. It nods, and that is all. More than
  // this and it reads as a plant made of rubber, which is the commonest way
  // vertex sway goes wrong.
  sunflower: 0.2,

  // Cloth is deliberately absent: banners, flags and curtains are simulated
  // now (CLOTH.md), and their sway weights are zero — the wind shader leaves
  // them alone, so there is no double displacement.

  // Moss is deliberately absent: it is a mat lying flat against rock with nothing
  // standing clear of the surface to be pushed, and even a trace of movement reads
  // as the ground breathing. Everything else is rigid by omission — a fungus
  // especially, being a stiff, low, fleshy thing.
};
