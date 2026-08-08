import * as THREE from 'three';

/**
 * Detail fading: a mipmap for geometry that has no texture to mip.
 *
 * A texture gets pre-filtered levels, so when it minifies the GPU samples a
 * version where the high frequency has already been *removed*. Vertex colour
 * has no such thing — the colour is per-vertex data, there is no level
 * structure, and a fine dark seam on a floorboard is sampled once per chunky
 * pixel or not at all. Most pixels miss it, a few catch it whole, and which is
 * which re-decides itself every frame as the camera turns. That is moiré, and
 * no number of coverage samples fixes it: the frequency is below Nyquist and
 * multisampling only moves the threshold (ANTIALIASING.md).
 *
 * So each part says how big its detail is and what it looks like from far
 * enough away that you cannot tell it apart from its surroundings, and the
 * shader crossfades between the two:
 *
 * - **`Part.detail`** — the size of the feature this part *is*, in metres. A
 *   9 mm seam says 0.009. Zero, the default, means never fade.
 * - **`Part.detailTint`** — what it fades toward. Its surroundings, usually:
 *   the seam between two boards fades into the boards.
 *
 * The two are per part, which is the point. A floor carries a 9 mm seam and a
 * 290 mm board on the same surface, and they stop being resolvable at wildly
 * different ranges — the seam dissolves while the board-to-board variation is
 * still perfectly clear. One global fade distance could not tell them apart.
 *
 * ## Why `fwidth` and not view distance
 *
 * The obvious trigger is distance, and it is wrong in exactly the case that
 * matters. **A floor is not viewed head-on.** At a shallow angle one chunky
 * pixel covers far more surface than its distance suggests, which is why the
 * shimmer is worst toward the far wall rather than in a ring around you — so a
 * distance fade would under-fade precisely where it is needed.
 *
 * `fwidth` of the view-space position is how many metres of surface one chunky
 * pixel actually covers, there, at that angle. It is the same quantity the GPU
 * uses to choose a mipmap level, it costs one instruction, and it is spatial
 * only — no history, so it stays inside SHADERS-AND-MATERIALS.md's ground rule 3.
 *
 * The fade runs from one pixel per feature to `DETAIL_SPAN` pixels per feature,
 * a couple of octaves, the way trilinear filtering blends between two levels
 * rather than snapping.
 *
 * Costs: two attributes per vertex, as weathering pays; one `fwidth`, one
 * `smoothstep` and one `mix` per fragment behind an early-out that skips every
 * part which declared nothing. Which, today, is nearly all of them.
 */

/** Per-vertex feature size in metres. 0 means never fade. From `Part.detail`. */
export const DETAIL_ATTRIBUTE = 'detail';
/** Per-vertex colour the feature dissolves into. From `Part.detailTint`. */
export const DETAIL_TINT_ATTRIBUTE = 'detailTint';

/**
 * The two dials, in pixels per feature.
 *
 * `uDetailStart` is where a feature begins to dissolve — 1 is "as soon as it is
 * narrower than a pixel", which is exactly when it stops being sampleable.
 * `uDetailSpan` is how many times wider the pixel has to get before the feature
 * is gone entirely. Both are pure uniforms, so both are free to move.
 */
export const detailUniforms = {
  uDetailStart: { value: 1 },
  uDetailSpan: { value: 4 },
};

/**
 * Adds the detail-fade stage to a material that already carries the sway and
 * wear patches. Wrapping rather than replacing, for the reason `applyWear`
 * gives: `onBeforeCompile` is a single slot and sway got there first.
 *
 * Surface material only. The depth and edge passes read geometry, not colour.
 */
export function applyDetail(material: THREE.Material): void {
  const prior = material.onBeforeCompile;
  material.onBeforeCompile = (shader, renderer) => {
    prior?.call(material, shader, renderer);

    shader.uniforms.uDetailStart = detailUniforms.uDetailStart;
    shader.uniforms.uDetailSpan = detailUniforms.uDetailSpan;

    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        /* glsl */ `#include <common>
        attribute float ${DETAIL_ATTRIBUTE};
        attribute vec3 ${DETAIL_TINT_ATTRIBUTE};
        varying float vDetail;
        varying vec3 vDetailTint;
        varying vec3 vDetailView;
        `,
      )
      .replace(
        // After the vertex has been displaced and placed, unlike the wear
        // patch: this one is asking how big the surface is *on screen*, which
        // is a question about where it ended up rather than how it was built.
        '#include <project_vertex>',
        /* glsl */ `#include <project_vertex>
        vDetail = ${DETAIL_ATTRIBUTE};
        vDetailTint = ${DETAIL_TINT_ATTRIBUTE};
        vDetailView = mvPosition.xyz;
        `,
      );

    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        /* glsl */ `#include <common>
        uniform float uDetailStart;
        uniform float uDetailSpan;
        varying float vDetail;
        varying vec3 vDetailTint;
        varying vec3 vDetailView;
        `,
      )
      .replace(
        // **Anchored after `<color_fragment>`, not on it.** The wear stage has
        // already replaced that chunk by the time this runs, and replacing it
        // again would land this code *above* the wear block — so a rusted patch
        // would survive at full contrast into the distance while the surface
        // under it dissolved, which is the sparkle this exists to remove. Rust
        // painted on a surface is part of that surface and goes with it.
        //
        // `<alphamap_fragment>` is the next chunk after `<color_fragment>` in
        // three's fragment order, and is the first thing past the wear patch.
        // The art check asserts it is still there to land on.
        '#include <alphamap_fragment>',
        /* glsl */ `
        if (vDetail > 0.0) {
          // Metres of surface under one chunky pixel, at this angle. View space
          // is metric and unscaled, so this needs no correction — and taking it
          // from a derivative rather than from depth is what makes a floor seen
          // edge-on fade when a floor seen face-on does not.
          float footprint = length(fwidth(vDetailView));
          // Held apart, because smoothstep with equal edges is undefined and
          // both of these are dials a saved preset can carry to zero.
          float lo = max(vDetail * uDetailStart, 1e-6);
          float hi = max(lo * uDetailSpan, lo * 1.001);
          float gone = smoothstep(lo, hi, footprint);
          diffuseColor.rgb = mix(diffuseColor.rgb, vDetailTint, gone);
        }
        #include <alphamap_fragment>`,
      );
  };

  // Same lesson the sway and wear patches both record: an attribute the
  // geometry does not supply falls back to a generic value that persists
  // across draw calls. Zero means this part declared no detail size, and
  // nothing with no detail size ever fades.
  (material as { defaultAttributeValues?: Record<string, number[]> }).defaultAttributeValues = {
    ...(material as { defaultAttributeValues?: Record<string, number[]> }).defaultAttributeValues,
    [DETAIL_ATTRIBUTE]: [0],
    [DETAIL_TINT_ATTRIBUTE]: [0, 0, 0],
  };

  material.customProgramCacheKey = () => 'sway-wear-detail';
  material.needsUpdate = true;
}
