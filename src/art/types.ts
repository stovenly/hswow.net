import * as THREE from 'three';

/**
 * The art kit's contract.
 *
 * Every buildable thing in the world is one of these. A builder takes a seed
 * and returns a finished mesh — no textures, no files, no loading. The seed is
 * the whole reason the world can be authored as data: a prop is a name and a
 * number, and the same number always gives back the same object.
 */

export interface BuildOptions {
  /** Same seed, same mesh, every time. Placement data stores this, not geometry. */
  seed?: number;
  /** Uniform scale applied to the finished geometry. */
  scale?: number;
}

/**
 * What kind of thing a builder makes.
 *
 * Only used for ordering the gallery, but that is worth having: sorted purely
 * by name, a barrel sits between an ovine and a bovine and the row reads as an
 * alphabet rather than as a kit. Grouped, you can see at a glance whether the
 * furniture hangs together, whether the animals share a scale, and whether
 * anything is missing from a family.
 */
export type BuilderCategory =
  | 'foliage'
  | 'nature'
  | 'animals'
  | 'structures'
  | 'furniture'
  | 'objects'
  | 'people'
  /**
   * Scenery beyond the rim — seen, never visited. A family by its invariants
   * rather than by its subject: never solid, never swaying, never clutter,
   * never a shadow, and a few dozen triangles each. See `art/vista.ts` and
   * VISTA.md.
   */
  | 'vista';

/** Gallery order. Not alphabetical — this is the order they read best in. */
export const CATEGORY_ORDER: readonly BuilderCategory[] = [
  'foliage',
  'nature',
  'animals',
  'structures',
  'furniture',
  'objects',
  'people',
  // Last, because the gallery reads near to far.
  'vista',
];

export interface MeshBuilder {
  /** Stable identifier. Content data refers to props by this. */
  readonly name: string;
  /**
   * Which family it belongs to, for grouping the gallery.
   *
   * Required rather than optional with a default, so a new builder cannot
   * silently land in whichever bucket the default happens to be — the art
   * check fails until it declares one.
   */
  readonly category: BuilderCategory;
  /**
   * What the player is told this is, when it differs from `name`.
   *
   * The two are not the same job. `name` is the identifier content data uses,
   * and it says which *builder* made the thing — `hut-door` and `factory-door`
   * are named for where they belong, which is what someone placing them needs
   * to know. A player standing in front of one has no idea what a hut door is;
   * they can see that it is wood, and that is the word they would use.
   *
   * So this is only worth setting where the builder's own name would say
   * something the player has no way to check. Most props leave it alone,
   * because for most props the name already is the plain word for the thing.
   */
  readonly display?: string;
  /**
   * Rough horizontal extent in metres.
   *
   * Used to space the gallery and, later, to keep placed props from growing
   * into one another. Approximate by design — it is a spacing hint, not a
   * bounding volume.
   */
  readonly radius: number;
  /**
   * Whether the player collides with it. Defaults to true.
   *
   * Small soft things should be walked through. Blocking on a tuft of grass
   * is not realism — it is the single most reliable way to make a world feel
   * like a set of boxes, because the player feels every one of them.
   */
  readonly solid?: boolean;
  build(options?: BuildOptions): THREE.Mesh;
}

/**
 * A builder that takes something beyond the standard seed and scale — a
 * signboard's text, a fence's section count.
 *
 * It is still a `MeshBuilder`, so a gallery can call it with nothing and get
 * whatever the seed rolled, and it still sits in a list of them. This only adds
 * the option to *say*: a placer laying a boundary to a length wants the section
 * count checked rather than silently dropped as an unknown property.
 */
export interface BuilderWith<Options extends BuildOptions> extends MeshBuilder {
  build(options?: Options): THREE.Mesh;
}
