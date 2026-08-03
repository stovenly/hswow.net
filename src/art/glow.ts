import * as THREE from 'three';
import { GLOW_LAYER } from '../layers';

/**
 * Light you can see, as opposed to light that lands on things.
 *
 * A light in three illuminates surfaces; it draws nothing itself. So the source
 * has to be modelled twice — once as a `PointLight` for what it does to the
 * room, and once as geometry for what it looks like. This is the material that
 * geometry is drawn with: a lamp's flame, and anything else that is meant to be
 * emitting rather than reflecting.
 *
 * **Additive, and unlit.** Additive blending means the surface only ever
 * brightens what is behind it, so a dark part of it is *transparent* rather than
 * grey — falloff can be authored as vertex colour fading to black, with no alpha
 * channel and no sorting problems, because black adds nothing. Unlit, because a
 * flame being shaded by some other light is a contradiction.
 *
 * Fog is off for the same reason. Fog mixes toward the fog colour, and mixing an
 * additive surface toward a pale sky adds that sky on top of everything behind
 * it — a distant lamp would sit in a rectangle of haze.
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
 * Wraps merged glow geometry into a mesh.
 *
 * Two flags, both load-bearing:
 *
 * - `noCollide` keeps `markCollidable` out of this subtree. A builder returns
 *   one object and the caller marks the whole thing solid, so without this the
 *   player would walk into the flame and stop.
 * - `renderOrder` puts it after the opaque pass. Three sorts transparent
 *   objects behind opaque ones already; this keeps several glows in one prop
 *   in a stable order between frames.
 */
export function finishGlow(geometry: THREE.BufferGeometry, name: string): THREE.Mesh {
  const mesh = new THREE.Mesh(geometry, GLOW_MATERIAL);
  mesh.name = name;
  mesh.userData.noCollide = true;
  mesh.renderOrder = 2;
  // Bloom's emitters pass selects the lights with this and nothing else. The
  // one place a glow mesh is made is the one place it has to be said: a glow
  // built by hand elsewhere would render normally and simply never bloom, which
  // is the kind of silent omission a single constructor makes impossible.
  //
  // *Enabled*, not set — layer 0 stays on, so ordinary rendering is untouched.
  // And the number comes from `src/layers.ts` rather than from here, which is a
  // rule this file learned the hard way; that file says how.
  mesh.layers.enable(GLOW_LAYER);
  return mesh;
}
