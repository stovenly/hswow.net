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
 * layer to select the glow meshes with (SHADERS-AND-MATERIALS.md §3) and took layer 1. Layer 1
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
 * That is not an optimisation, it is the whole design (SHADERS-AND-MATERIALS.md §7). Water has
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

/**
 * Groundcover — blades and props — additive like the first two.
 *
 * Read by `PixelStage`'s normal pass: the scene-wide override material cannot
 * know the instanced cover construction, so after the override render the
 * camera points at this layer alone and the cover draws itself into the normal
 * buffer with its own patched normal materials. Without that, the edge
 * detector outlines whatever stands *behind* a blade or a plume straight
 * through it — worst against the rim hills, whose normals are full of edges.
 */
export const COVER_LAYER = 4;

/**
 * Particles, and **the second exception to the additive rule.**
 *
 * `createParticles` calls `layers.set`, so a particle mesh is on this layer and
 * nothing else — the same one line water uses, for three of the same reasons
 * (PARTICLES.md §2):
 *
 * - **No outline.** A snowflake is one or two chunky pixels, and an outline
 *   round a two-pixel square is a dark square.
 * - **No hole in anything else's outline.** The subtler half: a flake crossing
 *   a roof ridge in the normal buffer would break the ridge's line for a frame,
 *   with the cause nowhere near the symptom.
 * - **No shadow.** Off layer 0 is out of the shadow map, so three thousand
 *   flakes cost the sun nothing.
 *
 * The lights are the one thing that has to be told: a camera restricted to this
 * layer collects no light that is not also on it, so `ZoneManager.prepare`
 * enables it on every light it walks past. Without that the particles compile
 * against an empty light list and come out black.
 *
 * An emissive system enables `GLOW_LAYER` as well, which is what puts a spark
 * in bloom's emitters pass with no code in `Bloom.ts`.
 */
export const PARTICLE_LAYER = 5;

/**
 * Crystal, glass and bubbles — **the third exception to the additive rule.**
 *
 * `glassMesh` calls `layers.set`, so a transmissive prop is on this layer and
 * nothing else. Water's line, for water's reasons (SHADERS-AND-MATERIALS.md
 * Track B): a surface that has to read the colour and depth of everything
 * behind it cannot be in the opaque pass, because nothing can sample the buffer
 * it is rendering into.
 *
 * - **No outline.** The fresnel rim *is* the outline, and a drawn one over it
 *   would read as a sticker of a gem rather than a gem.
 * - **No shadow, and no self-shadowing** of a surface light goes through. If a
 *   chunky crystal ever reads as floating, the escape hatch is a shadow proxy:
 *   a copy of the hull on layer 0 with `colorWrite` and `depthWrite` off, which
 *   draws nothing and occludes nothing but appears in the shadow map.
 * - **The refraction ray cannot hit the glass it left.** Absent from the depth
 *   buffer, a transmissive surface has nothing of its own to intersect.
 */
export const GLASS_LAYER = 6;

/**
 * Meshes owned by an attached effect volume — glitch or horror — additive like
 * collision and glow.
 *
 * Enabled by `ownerIdFor` (art/effectId.ts) on every mesh under a marked
 * object, read by the effect-mask pass (engine/EffectMask.ts), which points
 * the camera at this layer alone to draw the owned silhouettes into the id
 * mask the screen-space corruption passes are gated by.
 */
export const EFFECT_MASK_LAYER = 7;
