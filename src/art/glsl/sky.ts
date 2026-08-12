/**
 * The scene class: materials that are a window rather than a surface.
 *
 * Voidstone was the only one of these for a long time, and everything it
 * learned was private to it. This is that machinery, shared — the drift
 * rotation and its trap, the ray, the fixed sun — so a second scene is a colour
 * idea and nothing else. MATERIAL-SYSTEM.md, "Scenes, and what one costs".
 *
 * **What a scene is, exactly.** A pure function of one direction returning a
 * colour, filling `envSource`, replacing what the surface samples. No light
 * loop, no lobe, no geometry, no pass. It is the cheapest extension point in
 * the material system and by some distance the most flexible.
 *
 * **The ray is the class's, not the scene's.** Every one of these reads the raw
 * eye ray, so every fragment looks straight out along its own line of sight.
 * That is not a reflection — passing the reflected direction instead would make
 * a polished stone with a sky *on* it, which is a different material. And it is
 * not a hole: a direction-only scene has no parallax, so the view does not
 * slide as you walk past it.
 *
 * That is the point rather than the limitation. **These are portals, and a
 * portal does not have to obey a room.** Because the scene depends on the eye
 * ray alone it shows the same sky at every angle on every shape — an orb, a
 * column, a pane and a wall all read as the same window, and none of them can
 * be walked around to catch it out. A position term would buy correctness for
 * one case, the window set in a wall, and cost the property that makes the
 * whole class hang together. So there is no position term.
 */

/**
 * The eye ray, in world space, as every scene's `envSource` must ask for it.
 *
 * Spliced rather than wrapped in a function because `geometryViewDir` and
 * `viewMatrix` are locals of the lighting stage — a function declared at file
 * scope cannot see them, and passing them in would be four scenes each free to
 * pass the wrong thing.
 */
export const SCENE_RAY = 'inverseTransformDirection(-geometryViewDir, viewMatrix)';

/**
 * The two slots every scene fills, given its own entry point.
 *
 * `gain` is the only thing that differs between them and it is a brightness,
 * not a decision. Written once here so a fifth scene cannot quietly pick up a
 * reflected ray or an angle-rationed ambient — both of which look plausible in
 * isolation and break the class.
 */
export function sceneSlots(call: string, gain: number): { envSource: string; ambient: string } {
  return {
    envSource: /* glsl */ `
      // The raw view ray, untouched: every fragment looks straight out along
      // its own eye ray, so the surface is a flat window on the scene at every
      // angle. Ignores uFinishSky — what is behind this is not the zone's sky
      // and does not go out when you step indoors.
      finishEnv = ${call}(${SCENE_RAY});
    `,
    ambient: /* glsl */ `
      // Flat: what you are looking at is behind the surface, so it is not
      // rationed by how obliquely you meet that surface.
      reflectedLight.indirectSpecular += finishEnv * (${gain.toFixed(2)} * uFinishEnv);
    `,
  };
}

/**
 * Helpers every scene leans on. Emitted once however many scenes are in the
 * mask — see `Recipe.shared`.
 *
 * Requires the recipe kit above it: `recipeTime`, `recipeFbm`, `wearNoise`.
 */
export const SCENE_SHARED = /* glsl */ `
  // --- the scene class ------------------------------------------------------

  /**
   * Turns a direction about an axis. Layers drifting on their own axes at their
   * own rates is what makes a scene a volume rather than a turntable.
   *
   * **Add a layer's offset AFTER this, never before.** Rotating an offset
   * vector turns a slow rotation into a fast translation, and the whole field
   * sweeps across the window instead of drifting in place. It cost an evening
   * once and it will cost one again.
   */
  vec3 recipeDrift(vec3 d, float rate, vec3 axis) {
    float a = recipeTime() * rate;
    float c = cos(a);
    float s = sin(a);
    return d * c + cross(axis, d) * s + axis * dot(axis, d) * (1.0 - c);
  }

  /**
   * Where the light in a scene comes from.
   *
   * One direction for the whole class, low and off to one side, because two
   * scenes lit from different quarters cannot be compared and a player walking
   * between two portals is comparing them whether or not that was intended.
   * Not the zone's sun: a portal does not obey the room it is in.
   */
  vec3 sceneSun() {
    return normalize(vec3(0.42, 0.30, -0.84));
  }

  /**
   * A flat layer read in projection: dividing by elevation piles the same field
   * up toward the horizon, which is what turns a noise into a ceiling rather
   * than a fog.
   *
   * **Not abs(d.y), and this cost a look.** Taking the magnitude mirrors the
   * deck onto its own underside, so the sky below the horizon is the sky above
   * it reflected — and the two meet along d.y = 0 in a hard bright seam that
   * reads as a smear welded across the middle of the object. Elevation is
   * signed; a ray pointing down does not see the ceiling.
   *
   * Floored rather than clamped because the projection genuinely diverges at
   * the horizon — the deck really is infinitely far away there. sceneAbove
   * is what stops the divergence being drawn.
   */
  vec2 sceneDeck(vec3 d, float scale) {
    return d.xz / max(d.y, 0.02) * scale;
  }

  /**
   * How much of a deck this ray sees: one overhead, zero at and below the
   * horizon.
   *
   * Every scene reading sceneDeck has to fade it out with this before the
   * projection blows up, or the last few degrees above the horizon are a band
   * of infinitely stretched, aliasing noise. What replaces it is haze, which is
   * what is actually there.
   */
  float sceneAbove(vec3 d) {
    return smoothstep(0.03, 0.30, d.y);
  }
`;
