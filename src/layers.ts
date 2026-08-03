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

/**
 * Water surfaces, and **the one exception to the additive rule above.**
 *
 * Everything else here is enabled alongside layer 0, so it adds a way to select
 * a mesh without changing what draws it. `waterPlane` calls `layers.set`, which
 * clears layer 0 — a water plane is on this layer and *only* this layer, so it
 * is invisible to every pass that does not name it.
 *
 * That is not an optimisation, it is the whole design (SHADERS.md §7). Water has
 * to read the colour and the depth of everything behind it, and nothing can
 * sample the buffer it is rendering into — so water cannot be in the opaque
 * pass. Being off layer 0 removes it from that pass, from the normal pass the
 * outline is differenced out of, and from the shadow map, in one line and with
 * no per-pass exclusion lists to keep in step.
 *
 * Three consequences, all of them wanted:
 *
 * - **No outline on the water.** The edge detector never sees it. The foam line
 *   is what draws the shore instead, which is the right line to draw.
 * - **No shadow cast, and no self-shadowing of a surface that has no thickness.**
 * - **The reflection ray cannot hit the water it left.** Water is absent from
 *   the depth buffer entirely, so the screen-space march has nothing of its own
 *   to intersect — the failure that needs a start-offset hack in most SSR
 *   implementations simply does not arise here.
 *
 * The collision layer is not involved: water is `noCollide`, so `markCollidable`
 * stops at it and never enables anything.
 */
export const WATER_LAYER = 3;
