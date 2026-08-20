/**
 * Every render layer in the game, in one file.
 *
 * Three gives an object 32 layers and a camera, a raycaster or an octree a mask
 * to select them with. They are a scarce, *global* namespace addressed by bare
 * integers, and nothing in three checks whether two subsystems have picked the
 * same one — which makes a collision the quietest kind of bug available:
 * everything compiles, everything runs, and two unrelated features silently
 * become the same feature. This is the one place the numbers are handed out,
 * and picking a new one means reading the list.
 *
 * Layer 0 is three's default and stays enabled on everything, so every layer
 * here is *additive* unless it says otherwise: enabling one adds a way to
 * select a mesh and never removes it from ordinary rendering.
 */

/**
 * Meshes the player can walk into. Set by `markCollidable`, read by the
 * collider's octree. Decoration and debug fixtures stay off it, which keeps
 * them out of the collision set without a parallel scene graph.
 */
export const COLLISION_LAYER = 1;

/**
 * Meshes that emit rather than reflect. Set by `finishGlow` on everything drawn
 * with `GLOW_MATERIAL`, read by bloom's emitters pass, which points the camera
 * at this layer alone.
 */
export const GLOW_LAYER = 2;

/**
 * Water surfaces, and **the one exception to the additive rule.**
 *
 * `waterPlane` calls `layers.set`, which clears layer 0 — a water plane is on
 * this layer and *only* this layer, so it is invisible to every pass that does
 * not name it. Water has to read the colour and depth of everything behind it
 * and nothing can sample the buffer it is rendering into, so water cannot be in
 * the opaque pass. Being off layer 0 removes it from that pass, from the normal
 * pass and from the shadow map in one line.
 *
 * Two consequences, both wanted:
 *
 * - **No shadow cast**, and no self-shadowing of a surface with no thickness.
 * - **The reflection ray cannot hit the water it left.** Water is absent from
 *   the depth buffer entirely, so the screen-space march has nothing of its own
 *   to intersect — the failure that needs a start-offset hack in most SSR
 *   implementations does not arise here.
 *
 * The collision layer is not involved: water is `noCollide`.
 */
export const WATER_LAYER = 3;

/**
 * Groundcover — blades and props — additive like the first two.
 *
 * Read by `PixelStage`'s normal pass: the scene-wide override material cannot
 * know the instanced cover construction, so after the override render the
 * camera points at this layer alone and the cover draws itself into the normal
 * buffer with its own patched materials. Without it the normal buffer ends at
 * the ground under every blade and plume.
 */
export const COVER_LAYER = 4;

/**
 * Particles, and **the second exception to the additive rule.**
 *
 * `createParticles` calls `layers.set`, so a particle mesh is on this layer and
 * nothing else — water's line, for three of the same reasons:
 *
 * - **No outline.** A snowflake is one or two chunky pixels, and an outline
 *   round a two-pixel square is a dark square.
 * - **No hole in anything else's outline.** A flake crossing a roof ridge in
 *   the normal buffer would break the ridge's line for a frame, with the cause
 *   nowhere near the symptom.
 * - **No shadow.** Off layer 0 is out of the shadow map, so three thousand
 *   flakes cost the sun nothing.
 *
 * The lights have to be told: a camera restricted to this layer collects no
 * light that is not also on it, so `ZoneManager.prepare` enables it on every
 * light it walks past. Without that the particles compile against an empty
 * light list and come out black.
 *
 * An emissive system enables `GLOW_LAYER` as well, which is what puts a spark
 * in bloom's emitters pass with no code in `Bloom.ts`.
 */
export const PARTICLE_LAYER = 5;

/**
 * Crystal, glass and bubbles — **the third exception to the additive rule.**
 *
 * `glassMesh` calls `layers.set`, so a transmissive prop is on this layer and
 * nothing else, for water's reason: a surface that has to read the colour and
 * depth of everything behind it cannot be in the opaque pass.
 *
 * - **No outline.** The fresnel rim *is* the outline, and a drawn one over it
 *   would read as a sticker of a gem rather than a gem.
 * - **No shadow, and no self-shadowing** of a surface light goes through. If a
 *   chunky crystal ever reads as floating, the escape hatch is a shadow proxy:
 *   a copy of the hull on layer 0 with `colorWrite` and `depthWrite` off.
 * - **The refraction ray cannot hit the glass it left.** Absent from the depth
 *   buffer, a transmissive surface has nothing of its own to intersect.
 */
export const GLASS_LAYER = 6;

/**
 * Meshes owned by an attached effect volume — glitch or horror — additive like
 * collision and glow.
 *
 * Enabled by `ownerIdFor` on every mesh under a marked object, read by the
 * effect-mask pass, which points the camera at this layer alone to draw the
 * owned silhouettes into the id mask the screen-space corruption passes are
 * gated by.
 */
export const EFFECT_MASK_LAYER = 7;
