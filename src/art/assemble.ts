import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { CLUTTER } from './clutter';
import { FLEX } from './flex';
import { SWAY_DEPTH_MATERIAL } from './sway';

/**
 * Turning a pile of primitives into one mesh.
 *
 * Everything the art kit builds ends up as a **single geometry with vertex
 * colours and a single shared material**. Three reasons, and they compound:
 *
 * - One draw call per prop instead of one per part. A tree is six or seven
 *   primitives; drawn separately that is six or seven calls for something the
 *   player reads as one object.
 * - Phase 7's wind sway patches exactly one material. Separate materials per
 *   colour would mean patching each of them and keeping their uniforms in
 *   step.
 * - Merged geometry can be merged *again*, so Phase 5 can collapse a stand of
 *   trees into one buffer if it needs to.
 *
 * The cost is that colour becomes geometry: recolouring means rebuilding.
 * Since building is deterministic from a seed, that is cheap.
 */

/** Per-vertex sway weight, read by the Phase 7 wind shader. */
export const SWAY_ATTRIBUTE = 'sway';

/** One material for the entire art kit. Phase 7 patches this and nothing else. */
export const ART_MATERIAL = new THREE.MeshLambertMaterial({
  vertexColors: true,
  flatShading: true,
});

export interface Part {
  geometry: THREE.BufferGeometry;
  /**
   * sRGB hex, or a function of position for patterned surfaces.
   *
   * A function is evaluated **once per face**, at its centroid, and the result
   * given to all three of its vertices — so patches land on facet boundaries
   * and come out crisp rather than smeared across triangles. That is what
   * makes markings possible without geometry: the spots on a cow are two
   * colours in one mesh, not a second mesh stuck on top of the first.
   */
  color: number | ((x: number, y: number, z: number) => number);
  /**
   * How much this part moves in the wind, 0..1.
   *
   * A number applies to the whole part; a function is evaluated per vertex in
   * the part's own local space, which is how a trunk gets to be rigid at the
   * base and loose at the top. Weights are baked here, at build time, because
   * doing it afterwards would mean inferring which vertices belong to which
   * part from position alone — and by then they have all been merged.
   */
  sway?: number | ((x: number, y: number, z: number) => number);
}

export function assemble(parts: Part[]): THREE.BufferGeometry {
  const prepared = parts.map((part) => {
    // Everything is un-indexed first. `mergeGeometries` refuses to mix indexed
    // and non-indexed inputs and returns null rather than saying so, and
    // three's own primitives are a mix: boxes, cylinders and tori carry an
    // index, icosahedra and cones do not. Un-indexing also suits flat shading,
    // which wants per-face vertices anyway.
    const source = part.geometry;
    const geometry = source.index === null ? source : source.toNonIndexed();
    if (geometry !== source) source.dispose();

    // No textures exist in this project, so UVs are dead weight — and worse,
    // they are a hazard: `mergeGeometries` needs every input to carry the same
    // attributes, so one part that has lost its UVs somewhere upstream would
    // fail the merge for the whole prop.
    geometry.deleteAttribute('uv');

    const position = geometry.getAttribute('position');
    const count = position.count;

    const colors = new Float32Array(count * 3);
    const color = new THREE.Color();
    if (typeof part.color === 'function') {
      // Per face, from its centroid. Sampling per vertex instead would let the
      // three corners of one triangle disagree, and the interpolation between
      // them turns a hard-edged patch into a gradient — which is the one thing
      // a flat-shaded look must not have.
      for (let i = 0; i < count; i += 3) {
        const x = (position.getX(i) + position.getX(i + 1) + position.getX(i + 2)) / 3;
        const y = (position.getY(i) + position.getY(i + 1) + position.getY(i + 2)) / 3;
        const z = (position.getZ(i) + position.getZ(i + 1) + position.getZ(i + 2)) / 3;
        color.set(part.color(x, y, z));
        color.toArray(colors, i * 3);
        color.toArray(colors, (i + 1) * 3);
        color.toArray(colors, (i + 2) * 3);
      }
    } else {
      color.set(part.color);
      for (let i = 0; i < count; i++) color.toArray(colors, i * 3);
    }
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const sway = new Float32Array(count);
    if (typeof part.sway === 'function') {
      for (let i = 0; i < count; i++) {
        sway[i] = clamp01(part.sway(position.getX(i), position.getY(i), position.getZ(i)));
      }
    } else if (part.sway) {
      sway.fill(clamp01(part.sway));
    }
    geometry.setAttribute(SWAY_ATTRIBUTE, new THREE.BufferAttribute(sway, 1));

    // Normals must exist before merging: mergeGeometries requires every input
    // to carry the same attributes, and a missing one silently drops the lot.
    if (!geometry.getAttribute('normal')) geometry.computeVertexNormals();
    return geometry;
  });

  const merged = mergeGeometries(prepared, false);
  for (const geometry of prepared) geometry.dispose();
  if (!merged) throw new Error('assemble: geometries did not share an attribute set');
  return merged;
}

/**
 * Finishes a merged geometry into a mesh.
 *
 * Also where the species' stiffness is applied: the per-vertex weights say
 * where a thing bends, `FLEX` says whether it bends at all, and multiplying
 * them here keeps the whole kit on one material and therefore one draw call.
 * See `art/sway.ts` for the table and the reasoning.
 *
 * `swayPhase` is stamped here rather than derived in the shader, and is now
 * carried for anything that wants a stable per-instance number — the sway
 * shader itself ended up not needing it, because a travelling front already
 * gives every instance a different phase from where it stands, which is both
 * cheaper and more correct than a random offset.
 */
export function finish(geometry: THREE.BufferGeometry, name: string, phase: number): THREE.Mesh {
  // Baked into the attribute rather than passed as a uniform: a uniform would
  // need a material per species, and the whole kit sharing one material is
  // what keeps a prop to a single draw call.
  const flex = FLEX[name] ?? 0;
  const weights = geometry.getAttribute(SWAY_ATTRIBUTE);
  if (weights && flex !== 1) {
    const array = weights.array as Float32Array;
    for (let i = 0; i < array.length; i++) array[i] *= flex;
    weights.needsUpdate = true;
  }

  const mesh = new THREE.Mesh(geometry, ART_MATERIAL);
  mesh.name = name;
  mesh.userData.swayPhase = phase;
  // Stamped here rather than looked up in the zone manager, because by the time
  // the manager walks a built zone all it has is a scene graph — the builder is
  // long gone, and the name on the mesh is the only thing left that says what
  // this is. `ZoneManager.prepare` reads it; see `art/clutter.ts`.
  if (CLUTTER.has(name)) mesh.userData.clutter = true;
  // So the sun sees what the camera sees. Without it the shadow map is drawn
  // from undisplaced geometry and every swaying plant casts a still shadow of
  // where it is not — see `SWAY_DEPTH_MATERIAL`. Set on everything rather than
  // only on things that bend: it is one shared material, a rigid prop's
  // displacement is zero, and the alternative is a rule that has to be
  // remembered every time a species is added to `FLEX`.
  mesh.customDepthMaterial = SWAY_DEPTH_MATERIAL;
  return mesh;
}

/**
 * A smooth 0→1 ramp between two heights, for sway weights.
 *
 * Smoothstep rather than linear, because a linear weight puts the sharpest
 * change in bend right where the ramp starts, and a visible crease across a
 * trunk is worse than no sway at all.
 */
export function heightRamp(base: number, top: number, curve = 1.6) {
  return (_x: number, y: number): number => {
    const t = clamp01((y - base) / Math.max(top - base, 1e-6));
    return (t * t * (3 - 2 * t)) ** curve;
  };
}

/**
 * Clamps to 0..1, and maps NaN to 0.
 *
 * Written as comparisons rather than `Math.min(1, Math.max(0, v))` because
 * that form passes NaN straight through — every comparison against NaN is
 * false, so it survives both clamps untouched. A NaN in a vertex attribute is
 * not a slightly wrong number, it is a mesh that fails to draw, and the cause
 * is a long way from the symptom.
 */
function clamp01(value: number): number {
  return value > 0 ? (value < 1 ? value : 1) : 0;
}
