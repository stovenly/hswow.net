import * as THREE from 'three';

/**
 * Extra distance haze, for out-of-bounds scenery only — VISTA.md.
 *
 * ## The problem it solves is a gradient, not a colour
 *
 * An eye 1.35 m above the ground maps distance to screen angle as
 * `atan(-h / d)`, which flattens brutally: ground at 70 m is 1.11 degrees below
 * the horizon, at 240 m it is 0.32, and at 316 m it is 0.24. So the whole of a
 * 70–240 m fog ramp lands inside 0.78 degrees — about eight pixels at 540p, and
 * fewer than three chunky ones at `pixelSize` 3. Across those the ground has to
 * travel the entire way from its own green to the near-white blue of the sky,
 * and there is no room for it: it quantises to a step, and the step reads as a
 * hard line ruled along the horizon that crawls as the camera moves.
 *
 * The fix is to spend the transition *earlier*, where the ground still has
 * screen space to spend it in. This is a second fog term with a much tighter
 * range, so distant scenery is already most of the way to the fog colour by the
 * time it reaches the compressed band near the horizon — and what is left to
 * happen there is a few percent instead of half the range.
 *
 * ## Why it is not baked into the vertex colours
 *
 * Because the sun is going to move. Vertex colours are frozen when a builder
 * runs, so a skirt hazed toward today's pale blue would still be pale blue at
 * sunset while the fog around it went warm — a painted skybox by another name,
 * which is the failure this whole spec is written against. Mixing toward
 * `fogColor` instead costs nothing and follows whatever the sky does, because
 * `fogColor` is the uniform `PostFX` already drives from the sky's horizon.
 *
 * ## Why it is a material rather than a flag
 *
 * A shader cannot ask whether the thing it is drawing is scenery. Everything
 * else about the vista family rides `userData` or a layer, and neither is
 * visible from inside a fragment shader — so the one honest way to say "this
 * geometry hazes differently" is to draw it with a material that does. It is a
 * third program against the kit's two, compiled once at boot with them.
 */

/** Shared, so one set of numbers reaches every vista draw. */
export const hazeUniforms = {
  /** Where the extra haze starts, in metres of view depth. */
  uHazeNear: { value: 0 },
  uHazeFar: { value: 1 },
  /** How far toward the fog colour it goes at `uHazeFar`. 0 disables it. */
  uHazeAmount: { value: 0 },
};

/**
 * Sets the band's haze from the zone's own air.
 *
 * Derived rather than authored: a zone already says where its fog begins and
 * ends, and the band wants to have done most of its fading by the time the
 * ground is too compressed to fade in. Two thirds of the way through the fog's
 * own range is that point for every fog setting rather than for one.
 */
export function setVistaHaze(fogNear: number, fogFar: number, amount = 0.8): void {
  hazeUniforms.uHazeNear.value = fogNear;
  hazeUniforms.uHazeFar.value = fogNear + (fogFar - fogNear) * 0.45;
  hazeUniforms.uHazeAmount.value = amount;
}

/**
 * Patches a material to haze early.
 *
 * Composed onto whatever patch is already there, exactly as the wear and detail
 * stages do, and applied *after* three's own fog so the two compound — the band
 * gets ordinary distance fog plus this.
 */
export function applyVistaHaze(material: THREE.Material): void {
  const prior = material.onBeforeCompile;
  material.onBeforeCompile = (shader, renderer) => {
    prior?.call(material, shader, renderer);

    shader.uniforms.uHazeNear = hazeUniforms.uHazeNear;
    shader.uniforms.uHazeFar = hazeUniforms.uHazeFar;
    shader.uniforms.uHazeAmount = hazeUniforms.uHazeAmount;

    shader.fragmentShader = shader.fragmentShader
      // Declared at file scope. Three's fog include sits inside main, and a
      // uniform declared there is a compile error.
      .replace(
        '#include <common>',
        /* glsl */ `#include <common>
        uniform float uHazeNear;
        uniform float uHazeFar;
        uniform float uHazeAmount;
        `,
      )
      .replace(
        '#include <fog_fragment>',
        /* glsl */ `#include <fog_fragment>
        #ifdef USE_FOG
          gl_FragColor.rgb = mix(
            gl_FragColor.rgb,
            fogColor,
            uHazeAmount * smoothstep(uHazeNear, uHazeFar, vFogDepth)
          );
        #endif
        `,
      );
  };

  // Three caches programs by a key that knows nothing about `onBeforeCompile`,
  // so a material differing only in its patch would be handed another's
  // program. See `applySway`, which says the same thing about the normal pass.
  material.customProgramCacheKey = () => 'vista-haze';
  material.needsUpdate = true;
}
