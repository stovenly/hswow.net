import * as THREE from 'three';
import type { Fields } from './schema';

/**
 * The art kit's contract. Every buildable thing in the world is one of these: a
 * builder takes a seed and returns a finished mesh, with no textures, no files
 * and no loading. A prop is a name and a number, and the same number always gives
 * back the same object.
 */

export interface BuildOptions {
  /** Same seed, same mesh, every time. Placement data stores this, not geometry. */
  seed?: number;
  /** Uniform scale applied to the finished geometry. */
  scale?: number;
}

/**
 * What kind of thing a builder makes. Only used for ordering the gallery, but
 * grouped you can see at a glance whether the furniture hangs together, whether
 * the animals share a scale, and whether anything is missing from a family.
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
   * rather than by its subject: never solid, never swaying, never clutter, never
   * a shadow, and a few dozen triangles each. See `art/vista.ts`.
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
  /** Which family it belongs to, for grouping the gallery. Required rather than defaulted, so a new builder cannot silently land in a bucket. */
  readonly category: BuilderCategory;
  /**
   * What the player is told this is, when it differs from `name`. `name` is the
   * identifier content data uses and says which builder made the thing —
   * `hut-door` is named for where it belongs, which is what a placer needs. A
   * player sees that it is wood. Only worth setting where the builder's own name
   * would say something the player has no way to check.
   */
  readonly display?: string;
  /**
   * What this particular one is called, where the seed decides something the
   * name carries. From the seed alone, never from a mesh: container stock is
   * named unbuilt. Share the draw with `build`, never repeat it.
   */
  nameFor?(seed: number): string;
  /** Rough horizontal extent in metres, for spacing the gallery. Approximate by design: a hint, not a bounding volume. */
  readonly radius: number;
  /**
   * How many of these are worth seeing side by side. One for a builder that does
   * not vary with its seed; a rank of eight is how you see whether a scatter is
   * even. A building placed once in a world is designed rather than rolled, so
   * eight of it is eight copies of one thing. Omitted means the gallery's count.
   */
  readonly variants?: number;
  /**
   * Whether the player collides with it. Defaults to true. Small soft things
   * should be walked through: blocking on a tuft of grass is the single most
   * reliable way to make a world feel like a set of boxes.
   */
  readonly solid?: boolean;
  /** Set by extended builders — see `BuilderWith`. */
  readonly options?: Fields;
  build(options?: BuildOptions): THREE.Mesh;
}

/**
 * A builder that takes something beyond the standard seed and scale — a
 * signboard's text, a fence's section count. Still a `MeshBuilder`, so a gallery
 * can call it with nothing and get whatever the seed rolled; this only adds the
 * option to say, so a placer's section count is checked rather than dropped.
 */
export interface BuilderWith<Options extends BuildOptions> extends MeshBuilder {
  /** What the extras are, so a form can draw controls for them. */
  readonly options?: Fields;
  build(options?: Options): THREE.Mesh;
}
