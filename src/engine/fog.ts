import * as THREE from 'three';

/**
 * Fog measured from the camera, not from the plane in front of it.
 *
 * ## The bug this fixes is in three, and it is in most engines
 *
 * Three's fog chunk sets the depth every fogged material reads as
 *
 * ```glsl
 * vFogDepth = - mvPosition.z;
 * ```
 *
 * which is the distance to the camera **plane** — how far in front of you
 * something is — rather than the distance to the camera **point**, which is how
 * far away it actually is. Those agree only dead ahead. Everywhere else the
 * first is shorter by the cosine of the angle off the view axis, so the same
 * object is treated as nearer the further it sits toward the edge of the screen.
 *
 * At this game's 80 degree vertical field of view on a 16:9 window the
 * horizontal half-angle is 56 degrees, and `cos 56° = 0.56`. So a rock 200 m
 * away is fogged as though it were 111 m away when it is at the left or right
 * edge, and about 100 m in a corner. Turn to look straight at it and it fades
 * back out over the width of the screen. It reads as the fog thinning wherever
 * you are not looking, which is exactly what it is doing.
 *
 * Radial depth makes fog a property of where a thing *is* rather than of where
 * the camera happens to be pointed, so turning on the spot changes nothing.
 * That is worth having on its own, and it matters much more here than in most
 * games: the vista band is built out of fog, and a band that breathes as you
 * look around is a band nobody believes.
 *
 * ## Why it patches the chunk rather than each material
 *
 * Every fogged material in the scene has to agree, or the seam simply moves —
 * ground fading on one rule and the props standing on it fading on another is
 * worse than both being wrong together. The chunk is the one place all of them
 * come from, three's own built-ins included. `art/glow.ts` writes its own fog
 * maths but reads the same `vFogDepth`, so it follows for free.
 *
 * Costs a `length` in place of a negate, once per vertex.
 *
 * **Call before anything renders.** Programs bake the chunk in at compile time,
 * so a material compiled before this runs keeps the old rule for the session.
 */
export function useRadialFog(): void {
  const planar = 'vFogDepth = - mvPosition.z;';
  const radial = 'vFogDepth = length( mvPosition.xyz );';

  if (!THREE.ShaderChunk.fog_vertex.includes(planar)) {
    // Three changed the chunk under us. Better to say so than to render a
    // whole session with a fix that silently did nothing.
    console.warn('useRadialFog: three.js fog_vertex has changed; fog is still planar');
    return;
  }
  THREE.ShaderChunk.fog_vertex = THREE.ShaderChunk.fog_vertex.replace(planar, radial);
}
