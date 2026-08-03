/**
 * Every render layer in the game, in one file.
 *
 * Three gives an object 32 layers and a camera, a raycaster or an octree a mask
 * to select them with. They are a scarce, *global* namespace addressed by bare
 * integers, and nothing in three checks whether two subsystems have picked the
 * same one — which makes a collision the quietest kind of bug available:
 * everything compiles, everything runs, and two unrelated features silently
 * become the same feature.
 *
 * **This is written down because it happened.** Bloom's emitters pass wanted a
 * layer to select the glow meshes with (SHADERS.md §3) and took layer 1. Layer 1
 * is the collision layer, which `markCollidable` enables and the collider's
 * octree filters on — so every flame, lamp shaft and lit window in the game
 * became solid geometry. The symptom was four portal arrivals in the world check
 * reporting `ARRIVES INSIDE GEOMETRY`, in three zones that had nothing to do with
 * bloom, because a lantern by a door is a wall you cannot see.
 *
 * The fix is not a better comment on either constant. It is that there is now
 * one place where the numbers are handed out, and picking a new one means
 * reading the list.
 *
 * Layer 0 is three's default and stays enabled on everything, so every layer
 * here is *additive*: enabling one adds a way to select a mesh and never removes
 * it from ordinary rendering.
 */

/**
 * Meshes the player can walk into.
 *
 * Set by `markCollidable`, read by the collider's octree. Decoration and debug
 * fixtures stay off it, which is what keeps them out of the collision set
 * without a parallel scene graph.
 */
export const COLLISION_LAYER = 1;

/**
 * Meshes that emit rather than reflect.
 *
 * Set by `finishGlow` on everything drawn with `GLOW_MATERIAL`, read by bloom's
 * emitters pass, which points the camera at this layer alone to render the
 * lights and nothing else.
 */
export const GLOW_LAYER = 2;
