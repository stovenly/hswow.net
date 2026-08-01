/**
 * How much each species responds to wind, 0..1.
 *
 * The per-vertex `sway` attribute every builder authors already says *where* a
 * thing bends — roots pinned, tips free. What it cannot say is whether the
 * species bends **at all**, because that is a fact about the plant rather than
 * about a vertex: a mushroom's cap and a reed's tip are both "the far end from
 * the ground", and only one of them moves.
 *
 * Kept as one table rather than as a field on each of seventy builders,
 * because the judgement is comparative. The useful question is never "how much
 * does a thistle move" but "does a thistle move more or less than a fern", and
 * that is only answerable with the whole list in front of you.
 *
 * **A name that is not here does not move.** That is the right default: an
 * anvil that wobbles because somebody forgot is a worse failure than a new
 * plant that stands still until somebody notices.
 *
 * A leaf module with no imports, so `assemble` can apply it without a cycle
 * back through `sway`.
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

  // Light, open and pinnate — a rowan's leaves are small and its branches are
  // thin, so the whole crown stirs where an oak's only nods. Between the birch
  // and the oak, which is where the tree sits in every other respect too.
  'small-rowan': 0.7,
  rowan: 0.6,

  // A spruce is the stiffest. Short horizontal boughs on a thick straight
  // leader barely move; what you actually see is the top nodding. Below the
  // bushes on purpose.
  'small-spruce': 0.4,
  spruce: 0.3,
  bramble: 0.4,
  thistle: 0.35,

  // A thick stem carrying a heavy head. It nods, and that is all. More than
  // this and it reads as a plant made of rubber, which is the commonest way
  // vertex sway goes wrong.
  sunflower: 0.2,

  // Moss is deliberately absent. It was here at 0.05, on the reasoning that a
  // dead thing in a moving field draws the eye — which is true of a plant and
  // false of this: moss is a mat lying flat against rock, with nothing
  // standing clear of the surface to be pushed. Even a trace of movement reads
  // as the *ground* breathing.
  //
  // Everything else is rigid by omission too. Mushrooms especially: a fungus
  // is a stiff, low, fleshy thing, and a swaying one is instantly and
  // obviously wrong in a way a stationary one never is.
};
