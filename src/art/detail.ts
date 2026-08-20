import * as THREE from 'three';
import { FIELD_ATTRIBUTE } from './fields';

/**
 * Detail fading: a mipmap for geometry that has no texture to mip. Vertex colour
 * has no pre-filtered levels, so a fine dark seam on a floorboard is sampled once
 * per chunky pixel or not at all, and which is which re-decides itself every
 * frame as the camera turns. That is moiré, and multisampling only moves the
 * threshold rather than crossing it.
 *
 * So each part says how big its detail is (`Part.detail`, in metres) and what it
 * looks like from far enough away (`Part.detailTint`), and the shader crossfades
 * between them. Per part, because a floor carries a 9 mm seam and a 290 mm board
 * on the same surface and they stop being resolvable at wildly different ranges.
 *
 * The trigger is `fwidth` of the view-space position rather than distance: a
 * floor is not viewed head-on, and at a shallow angle one chunky pixel covers far
 * more surface than its distance suggests. It is the same quantity the GPU uses
 * to choose a mip level, it costs one instruction, and it carries no history.
 */

/** The feature size itself rides `FIELD_ATTRIBUTE.z` — see `art/fields`. */
/** Per-vertex colour the feature dissolves into. From `Part.detailTint`. */
export const DETAIL_TINT_ATTRIBUTE = 'detailTint';

/**
 * The two dials, in pixels per feature. `uDetailStart` is where a feature begins
 * to dissolve — 1 is as soon as it is narrower than a pixel, which is exactly
 * when it stops being sampleable. `uDetailSpan` is how many times wider the pixel
 * has to get before it is gone entirely.
 */
export const detailUniforms = {
  uDetailStart: { value: 1 },
  uDetailSpan: { value: 4 },
};

/**
 * Adds the detail-fade stage to a material that already carries the sway and wear
 * patches. Wrapping rather than replacing: `onBeforeCompile` is a single slot and
 * sway got there first. Surface material only — the depth and edge passes read
 * geometry, not colour.
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
        vDetail = ${FIELD_ATTRIBUTE}.z;
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
        // Anchored after <color_fragment>, not on it. The wear stage has already
        // replaced that chunk, and replacing it again would land this code above
        // the wear block — so a rusted patch would survive at full contrast into
        // the distance while the surface under it dissolved. <alphamap_fragment>
        // is the next chunk in three's fragment order, past the wear patch.
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
    [DETAIL_TINT_ATTRIBUTE]: [0, 0, 0],
  };

  material.customProgramCacheKey = () => 'sway-wear-detail';
  material.needsUpdate = true;
}
