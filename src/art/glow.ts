import * as THREE from 'three';
import { GLOW_LAYER } from '../layers';

/**
 * Light you can see, as opposed to light that lands on things. A light in three
 * illuminates surfaces and draws nothing itself, so a source is modelled twice: a
 * `PointLight` for what it does to the room, and geometry for what it looks like.
 * This is that geometry's material — additive, so a dark part of it is
 * transparent rather than grey and falloff can be vertex colour fading to black;
 * unlit, because a flame shaded by some other light is a contradiction; and
 * unfogged, because mixing an additive surface toward a pale sky would add that
 * sky on top of everything behind it.
 */
export const GLOW_MATERIAL = new THREE.MeshBasicMaterial({
  vertexColors: true,
  transparent: true,
  blending: THREE.AdditiveBlending,
  // Written to by nothing, tested against everything: the shaft is occluded by
  // walls and clipped by the ground like any other surface, but it never hides
  // what is behind it, and two overlapping beams both show.
  depthWrite: false,
  // Seen from inside as often as from outside — you walk through these.
  side: THREE.DoubleSide,
  fog: false,
});

/**
 * Emissive text, drawn solid — see `letteringGlow`. Additive would be wrong for a
 * caption twice over: it can only brighten what is behind it, so a word against
 * the pale sky disappears, and lettering's overlapping strokes and joint discs
 * would add three or four times at every elbow. Fogged, because a distant sign
 * should dim into the air.
 */
export const TEXT_GLOW_MATERIAL = new THREE.MeshBasicMaterial({
  vertexColors: true,
  // Fully opaque, but queued as transparent so it draws after the opaque
  // geometry — writing no depth, it would otherwise be painted over by a wall
  // drawn behind it later in the pass.
  transparent: true,
  // Bloom's emitters pass borrows the scene's depth texture, so anything that
  // writes depth there corrupts the buffer the edge lines are drawn from.
  depthWrite: false,
  fog: true,
});

/**
 * Emissive text drawn like a flame: light laid over the world rather than a
 * surface standing in it. Right on dark stone, unreadable against bright sky,
 * which is why `letteringGlow` defaults to the solid one.
 */
export const TEXT_GLOW_ADDITIVE = new THREE.MeshBasicMaterial({
  vertexColors: true,
  transparent: true,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
  // Letters are closed solids seen from outside; back faces would only add
  // themselves on top of the front ones.
  side: THREE.FrontSide,
  fog: true,
});

/**
 * Fades to black rather than to the fog colour. Three's fog mixes toward
 * `fogColor`, and on an additive surface that adds the sky on top of everything
 * behind the letters — a distant word in a rectangle of haze.
 */
TEXT_GLOW_ADDITIVE.onBeforeCompile = (shader) => {
  shader.fragmentShader = shader.fragmentShader.replace(
    '#include <fog_fragment>',
    /* glsl */ `
    #ifdef USE_FOG
      #ifdef FOG_EXP2
        float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
      #else
        float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
      #endif
      gl_FragColor.rgb *= 1.0 - fogFactor;
    #endif
    `,
  );
};
TEXT_GLOW_ADDITIVE.customProgramCacheKey = () => 'text-glow-additive';

/**
 * Wraps merged glow geometry into a mesh. `noCollide` keeps `markCollidable` out
 * of this subtree, so the player does not walk into the flame and stop, and
 * `renderOrder` puts it after the opaque pass, which keeps several glows in one
 * prop in a stable order between frames. Which of the three glow materials is a
 * caller's choice; that everything goes through here is not.
 */
/**
 * The dusk-to-dawn schedule, 0 at noon and 1 in the dark. One global rather than
 * a per-prop switch, and it lifts rather than lights: an additive flame is far
 * too strong against a bright sky and about right against a dim one, so the
 * floor is what a lamp looks like at noon and the ceiling is what it looks like
 * at midnight. Nothing is ever switched off.
 */
export function setGlowLevel(darkness: number): void {
  const level = 0.55 + Math.min(Math.max(darkness, 0), 1) * 0.45;
  GLOW_MATERIAL.opacity = level;
  TEXT_GLOW_ADDITIVE.opacity = level;
}

export function finishGlow(
  geometry: THREE.BufferGeometry,
  name: string,
  material: THREE.Material = GLOW_MATERIAL,
): THREE.Mesh {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = name;
  mesh.userData.noCollide = true;
  mesh.renderOrder = 2;
  // Bloom's emitters pass selects the lights with this layer and nothing else, so
  // the one place a glow mesh is made is the one place it has to be said: a glow
  // built by hand elsewhere would render normally and never bloom. Enabled, not
  // set — layer 0 stays on. The number comes from `src/layers.ts`.
  mesh.layers.enable(GLOW_LAYER);
  return mesh;
}
