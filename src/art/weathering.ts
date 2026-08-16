import * as THREE from 'three';
import { shade } from './palette';
import { FIELD_ATTRIBUTE } from './fields';

/**
 * Weathering: how one material shows through another.
 *
 * Rust through paint, moss over stone, soot up a chimney breast, polish where
 * hands go. Three generations of this module tried to paint that story into
 * vertex colours — raw per-face noise, then quantized cells, then an
 * irregular canvas — and every one of them read as what it was: triangles,
 * then squares, then irregular triangles. The resolution of vertex paint *is*
 * the face size, and no arrangement of faces at prop-scale budgets is finer
 * than the speckle being asked for.
 *
 * So the speckle moved to the one place with per-pixel resolution: the
 * fragment shader. The design is deliberately the sway system's twin —
 * per-vertex attributes baked at build time, one patch applied to the shared
 * art material, and the GPU does the rest:
 *
 * - **`Part.wear`** (baked by `assemble` into a float attribute) says *how
 *   much* a region weathers, 0..1 — this is where the story goes: bias it
 *   toward the ground, the edges, the fixings (see `near`), the weather
 *   side. It varies per vertex and interpolates, so it needs only enough
 *   subdivision to bend the field, not to draw the patches.
 * - **`Part.wearTint`** (a vec3 attribute) says what colour the material
 *   weathers *toward* — rust, moss, patina, soot. Per part, so one prop can
 *   rust its iron and mould its timber in a single mesh and draw call.
 * - **`applyWear`** patches the shared material's fragment stage: clumped
 *   value noise generated from *undisplaced object-space position* — no
 *   texture object, no UVs, no asset, just arithmetic — thresholded against
 *   the interpolated wear, replacing the surface colour where it wins. The
 *   art direction's line is "no texture files in the codebase"; a texture
 *   computed from a sine at runtime is on the right side of it, exactly as a
 *   mesh computed from boxes is.
 *
 * Object-space sampling matters twice: it is stable while the sway shader
 * displaces the surface (rust must not swim over a waving banner), and it is
 * deterministic per prop, which keeps the art check's rebuild guarantee.
 *
 * Costs, honestly: four floats per vertex across the whole kit (everything
 * shares the material, so everything carries the attributes — zeroed where
 * unused), and ~30 hash evaluations per fragment behind an early-out that
 * skips clean surfaces. The pixel pass renders at chunky-pixel resolution,
 * so the fragment count is a quarter of the screen at default settings.
 * Geometry cost: none. That is the entire point.
 *
 * One field helper survives from the earlier generations: `near`, for wear
 * that concentrates around fixings. Drip-streak geometry and quantized block
 * paint existed for a while and were cut on request — the shader layer is
 * the whole system now.
 *
 * **Weathering is opt-in per part, and the values are statements.** Rust
 * does not leap from a plate onto the hardware standing proud of it, painted
 * surfaces resist outright (zero wear on hazard blocks — paint is the
 * anti-rust technology), handled metal stays bright, and the accent is
 * matched to each surface with `weatherTint` rather than being one orange
 * everywhere. Accent colours should differ from the base in hue, not only
 * value — the quantizer collapses same-hue brightness steps; see the palette
 * header. And err quiet: weathering that announces itself reads as a
 * texture pack, not a place.
 */

/** The wear amount itself rides `FIELD_ATTRIBUTE.y` — see `art/fields`. */
/** Per-vertex colour the surface weathers toward. Baked from `Part.wearTint`. */
export const WEAR_TINT_ATTRIBUTE = 'wearTint';

/**
 * Adds the weathering stage to a material that already carries the sway
 * patch. Wrapping rather than replacing, because `onBeforeCompile` is a
 * single slot and sway got there first; the cache key changes so the
 * combined program is never confused with a sway-only one on the depth and
 * normal materials.
 *
 * Applied to the surface material only. The depth and edge passes read
 * geometry, not colour, and patching them would spend compile time on
 * nothing.
 */
export function applyWear(material: THREE.Material): void {
  const prior = material.onBeforeCompile;
  material.onBeforeCompile = (shader, renderer) => {
    prior?.call(material, shader, renderer);

    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        /* glsl */ `#include <common>
        attribute vec3 ${WEAR_TINT_ATTRIBUTE};
        varying float vWear;
        varying vec3 vWearTint;
        varying vec3 vWearPos;
        `,
      )
      .replace(
        '#include <begin_vertex>',
        /* glsl */ `#include <begin_vertex>
        vWear = ${FIELD_ATTRIBUTE}.y;
        vWearTint = ${WEAR_TINT_ATTRIBUTE};
        // The raw attribute, not 'transformed': sampled before sway displaces
        // anything, so the pattern is welded to the surface and does not swim
        // when the surface moves.
        vWearPos = position;
        `,
      );

    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        /* glsl */ `#include <common>
        varying float vWear;
        varying vec3 vWearTint;
        varying vec3 vWearPos;

        // (No backticks anywhere below: this is a template literal, and one
        // would end it mid-GLSL. Same note as the sway patch.)

        // The hand-off to the finish stage: 1 where wear replaced the surface,
        // so rusted gilt goes matte. Read in art/finish.ts.
        float finishWorn = 0.0;

        float wearHash(vec3 p) {
          return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453);
        }

        // Trilinear value noise: blobs, where a raw hash is static.
        float wearNoise(vec3 p) {
          vec3 i = floor(p);
          vec3 f = fract(p);
          vec3 s = f * f * (3.0 - 2.0 * f);
          float n000 = wearHash(i);
          float n100 = wearHash(i + vec3(1.0, 0.0, 0.0));
          float n010 = wearHash(i + vec3(0.0, 1.0, 0.0));
          float n110 = wearHash(i + vec3(1.0, 1.0, 0.0));
          float n001 = wearHash(i + vec3(0.0, 0.0, 1.0));
          float n101 = wearHash(i + vec3(1.0, 0.0, 1.0));
          float n011 = wearHash(i + vec3(0.0, 1.0, 1.0));
          float n111 = wearHash(i + vec3(1.0, 1.0, 1.0));
          return mix(
            mix(mix(n000, n100, s.x), mix(n010, n110, s.x), s.y),
            mix(mix(n001, n101, s.x), mix(n011, n111, s.x), s.y),
            s.z
          );
        }
        `,
      )
      .replace(
        '#include <color_fragment>',
        /* glsl */ `#include <color_fragment>
        if (vWear > 0.004) {
          // Two scales: hand-sized clumps, finger-sized mottle inside them.
          float n = 0.62 * wearNoise(vWearPos * 9.0) + 0.38 * wearNoise(vWearPos * 47.0);
          if (n < vWear) {
            // Tone varies inside a patch — centres deeper, rims brighter —
            // from a third scale of the same noise, so no second attribute.
            float depth = wearNoise(vWearPos * 23.0 + 11.0);
            diffuseColor.rgb = vWearTint * (0.72 + 0.42 * depth);
            finishWorn = 1.0;
          }
        }
        `,
      );
  };

  // A shader attribute the geometry does not supply falls back to a generic
  // value that persists across draw calls — the sway patch's lesson, stated
  // there in full. Zero wear means untouched.
  (material as { defaultAttributeValues?: Record<string, number[]> }).defaultAttributeValues = {
    ...(material as { defaultAttributeValues?: Record<string, number[]> }).defaultAttributeValues,
    [WEAR_TINT_ATTRIBUTE]: [0, 0, 0],
  };

  material.customProgramCacheKey = () => 'sway-wear';
  material.needsUpdate = true;
}

/**
 * An accent matched to the surface it weathers on.
 *
 * Rust is not one colour: on dark channel iron it is a dark bloom, on bright
 * plate it is nearly orange, because corrosion inherits the light of the
 * metal it grows from. One accent hex for every surface reads as a sticker
 * applied over the prop; scaled to the surface's own luminance — measured
 * against a reference, usually the palette entry the accent was tuned for —
 * it reads as the surface's own state. Clamped, so a near-black part still
 * shows its weathering rather than hiding it.
 */
export function weatherTint(accent: number, surface: number, reference: number): number {
  const luminance = (hex: number): number =>
    0.2126 * ((hex >> 16) & 0xff) + 0.7152 * ((hex >> 8) & 0xff) + 0.0722 * (hex & 0xff);
  const factor = Math.min(Math.max(luminance(surface) / Math.max(luminance(reference), 1), 0.55), 1.3);
  return shade(accent, factor);
}

/**
 * Proximity field: 1 at any of the points, falling to 0 at `radius`.
 *
 * For composing into a `Part.wear` function — staining concentrates around
 * fixings, because fixings are where water sits and where two metals meet.
 * Evaluated per vertex at build time, so the loop over points costs nothing
 * that matters.
 */
export function near(
  points: readonly (readonly [number, number])[],
  radius: number,
): (u: number, v: number) => number {
  return (u, v) => {
    let strongest = 0;
    for (const [pu, pv] of points) {
      const d = Math.hypot(u - pu, v - pv);
      if (d < radius) strongest = Math.max(strongest, 1 - d / radius);
    }
    return strongest;
  };
}


