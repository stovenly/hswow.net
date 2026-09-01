import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { CLUTTER } from './clutter';
import { MATERIALS } from './underfoot';
import type { SurfaceName } from '../audio/models/footsteps';
import { FLEX } from './flex';
import { SWAY_DEPTH_MATERIAL, dressArtMesh } from './sway';
import { dressRigged, type Rig } from './rig';
import { WEAR_TINT_ATTRIBUTE } from './weathering';
import { DETAIL_TINT_ATTRIBUTE } from './detail';
import {
  FINISH_ATTRIBUTE,
  GRAIN_ATTRIBUTE,
  GLINT_ATTRIBUTE,
  FACE_ATTRIBUTE,
  resolveFinish,
  type Finish,
  type FinishName,
  type Grain,
} from './finish';
import { RECIPE_ATTRIBUTE } from './recipes';
import { collectSparkleSites } from './sparkle';
import { FIELD_ATTRIBUTE, FIELD_SWAY, FIELD_WEAR, FIELD_DETAIL } from './fields';

/**
 * Turning a pile of primitives into one mesh: everything the art kit builds ends
 * up as a single geometry with vertex colours on one shared material, so a prop
 * is one draw call and one patch point. Colour becomes geometry, and recolouring
 * means rebuilding — cheap, because building is deterministic from a seed.
 *
 * Every input carries every attribute, zeroed where unused, because
 * `mergeGeometries` needs one attribute set and returns null rather than saying
 * which input broke it. The lane ledger and the rule about which parts are
 * collidable are in `src/art/CLAUDE.md`.
 */

export { FIELD_ATTRIBUTE, FIELD_SWAY, FIELD_WEAR, FIELD_DETAIL } from './fields';

/** One material for the entire art kit. Phase 7 patches this and nothing else. */
export const ART_MATERIAL = new THREE.MeshLambertMaterial({
  vertexColors: true,
  flatShading: true,
});

export interface Part {
  geometry: THREE.BufferGeometry;
  /**
   * sRGB hex, or a function of position for patterned surfaces. A function is
   * evaluated once per face, at its centroid, and given to all three of its
   * vertices — so patches land on facet boundaries and come out crisp rather
   * than smeared across triangles.
   */
  color: number | ((x: number, y: number, z: number) => number);
  /**
   * How much this part moves in the wind, 0..1. A number applies to the whole
   * part; a function is evaluated per vertex in the part's own local space, so a
   * trunk can be rigid at the base and loose at the top. Baked at build time,
   * because afterwards the parts have all been merged.
   */
  sway?: number | ((x: number, y: number, z: number) => number);
  /**
   * How weathered this part is, 0..1 — the same shapes as `sway`. The fine
   * speckle is generated per pixel by `art/weathering`; this is only the field
   * it is thresholded against, so it needs just enough vertices to bend smoothly.
   */
  wear?: number | ((x: number, y: number, z: number) => number);
  /** What colour the part weathers toward — rust, moss, patina. sRGB hex. */
  wearTint?: number;
  /**
   * The size of the feature this part is, in metres — a 9 mm seam says 0.009.
   * Once a pixel covers more than this, the part dissolves into `detailTint`.
   * Omitted, it never fades. Per part rather than per prop, because one surface
   * carries features of very different sizes.
   */
  detail?: number;
  /** What the feature dissolves into — its surroundings. sRGB hex. */
  detailTint?: number;
  /**
   * How this part answers light — a name from `FINISHES` or a raw profile.
   * Omitted means matte, which is what nearly everything is. See `art/finish.ts`.
   */
  finish?: FinishName | Finish;
  /**
   * Which way the grain runs, for an anisotropic finish. Object space, and an
   * axis rather than a direction: it is crossed with each facet's own normal to
   * get that facet's tangent, so one axis serves a whole turned surface.
   * Defaults to up, which is what a lathe spins about.
   */
  grain?: Grain;
  /**
   * Which bone this part rides, for a rigged creature — see `art/rig.ts`.
   * Only read when `assemble` is given a bone list; the first bone otherwise.
   */
  bone?: string;
  /**
   * Blended binding instead of `bone`: per vertex, up to four (bone, weight)
   * pairs from the vertex's position in the creature's space, for a surface that
   * runs across a joint and must curve rather than break. Weights are
   * normalised; missing bones throw.
   */
  skin?: (x: number, y: number, z: number) => ReadonlyArray<readonly [string, number]>;
  /** What this part is, for the debug picker. Unnamed parts are reported by their index. */
  name?: string;
}

/** One part's vertex range in a merged geometry, on `geometry.userData.parts`. */
export interface PartRange {
  index: number;
  start: number;
  count: number;
  name?: string;
  bone?: string;
  color?: number;
}

/**
 * @param bones Bone names, in skeleton order. Every vertex is bound to its part's
 *   `bone` — rigidly, one bone at weight one, which is the hinge look a limb
 *   wants — or blended by the part's `skin`, for a surface that must curve over
 *   a joint. The geometry can then be finished as a `SkinnedMesh`.
 */
export function assemble(parts: Part[], bones?: readonly string[]): THREE.BufferGeometry {
  // The union of the parts' finish chunks, stamped on the merged geometry so
  // `finish` can pick the material variant that compiles exactly those.
  let finishMask = 0;
  const prepared = parts.map((part) => {
    // Everything is un-indexed first. `mergeGeometries` refuses to mix indexed
    // and non-indexed inputs and returns null rather than saying so, and three's
    // own primitives are a mix. Un-indexing also suits flat shading.
    const source = part.geometry;
    const geometry = source.index === null ? source : source.toNonIndexed();
    if (geometry !== source) source.dispose();

    // No textures exist in this project, so UVs are dead weight — and a hazard:
    // one part that lost its UVs upstream would fail the merge for the whole prop.
    geometry.deleteAttribute('uv');

    const position = geometry.getAttribute('position');
    const count = position.count;

    const colors = new Float32Array(count * 3);
    const color = new THREE.Color();
    if (typeof part.color === 'function') {
      // Per face, from its centroid. Per vertex, the three corners of one triangle
      // could disagree, and interpolating between them turns a hard-edged patch
      // into a gradient.
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

    // The three fields, one lane each: sway and wear per vertex, detail constant
    // per part. Zeroed where unused, because a merge needs one attribute set.
    const fields = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const x = position.getX(i);
      const y = position.getY(i);
      const z = position.getZ(i);
      fields[i * 3 + FIELD_SWAY] =
        typeof part.sway === 'function' ? clamp01(part.sway(x, y, z)) : clamp01(part.sway ?? 0);
      fields[i * 3 + FIELD_WEAR] =
        typeof part.wear === 'function' ? clamp01(part.wear(x, y, z)) : clamp01(part.wear ?? 0);
      fields[i * 3 + FIELD_DETAIL] = part.detail ? Math.max(part.detail, 0) : 0;
    }
    geometry.setAttribute(FIELD_ATTRIBUTE, new THREE.BufferAttribute(fields, 3));

    const tints = new Float32Array(count * 3);
    if (part.wearTint !== undefined) {
      color.set(part.wearTint);
      for (let i = 0; i < count; i++) color.toArray(tints, i * 3);
    }
    geometry.setAttribute(WEAR_TINT_ATTRIBUTE, new THREE.BufferAttribute(tints, 3));

    const detailTints = new Float32Array(count * 3);
    if (part.detailTint !== undefined) {
      color.set(part.detailTint);
      for (let i = 0; i < count; i++) color.toArray(detailTints, i * 3);
    }
    geometry.setAttribute(DETAIL_TINT_ATTRIBUTE, new THREE.BufferAttribute(detailTints, 3));

    // The finish, packed to a byte a lane — every parameter is a 0..1 knob, so
    // 1/255 is finer than any of them can use. All zero is matte.
    const finishLanes = new Uint8Array(count * 4);
    const grainLanes = new Uint8Array(count * 4);
    const glintLanes = new Uint8Array(count * 2);
    const recipeLanes = new Uint8Array(count);
    if (part.finish !== undefined) {
      const lanes = resolveFinish(part.finish, part.grain);
      finishMask |= lanes.mask;
      for (let i = 0; i < count; i++) {
        for (let lane = 0; lane < 4; lane++) {
          finishLanes[i * 4 + lane] = Math.round(lanes.finish[lane] * 255);
          grainLanes[i * 4 + lane] = Math.round(lanes.grain[lane] * 255);
        }
        glintLanes[i * 2] = Math.round(lanes.glint[0] * 255);
        glintLanes[i * 2 + 1] = Math.round(lanes.glint[1] * 255);
        recipeLanes[i] = lanes.recipe;
      }
    }
    geometry.setAttribute(FINISH_ATTRIBUTE, new THREE.BufferAttribute(finishLanes, 4, true));
    geometry.setAttribute(GRAIN_ATTRIBUTE, new THREE.BufferAttribute(grainLanes, 4, true));
    geometry.setAttribute(GLINT_ATTRIBUTE, new THREE.BufferAttribute(glintLanes, 2, true));
    // Not normalized, unlike every lane above it: the shader compares this against
    // whole numbers, and an index scaled to 0..1 and multiplied back up is a
    // rounding decision nobody asked for. Constant across a triangle.
    geometry.setAttribute(RECIPE_ATTRIBUTE, new THREE.BufferAttribute(recipeLanes, 1, false));

    // One random draw per triangle, the same on all three of its vertices.
    // The geometry is un-indexed here by construction, so consecutive triples
    // are triangles. See `FACE_ATTRIBUTE`.
    const faces = new Uint8Array(count);
    for (let i = 0; i < count; i += 3) {
      let h = Math.imul(i / 3 + 1, 2654435761) >>> 0;
      h ^= h >>> 13;
      const draw = (Math.imul(h, 1274126177) >>> 0) & 0xff;
      faces[i] = draw;
      faces[i + 1] = draw;
      faces[i + 2] = draw;
    }
    geometry.setAttribute(FACE_ATTRIBUTE, new THREE.BufferAttribute(faces, 1, true));

    if (bones) {
      const skinIndex = new Uint16Array(count * 4);
      const skinWeight = new Float32Array(count * 4);
      if (part.skin) {
        for (let i = 0; i < count; i++) {
          const pairs = part.skin(position.getX(i), position.getY(i), position.getZ(i));
          let total = 0;
          for (const [, w] of pairs) total += w;
          pairs.slice(0, 4).forEach(([name, w], k) => {
            const index = bones.indexOf(name);
            if (index < 0) throw new Error(`assemble: part skinned to unknown bone "${name}"`);
            skinIndex[i * 4 + k] = index;
            skinWeight[i * 4 + k] = total > 0 ? w / total : 0;
          });
        }
      } else {
        const index = bones.indexOf(part.bone ?? bones[0]);
        if (index < 0) throw new Error(`assemble: part bound to unknown bone "${part.bone}"`);
        for (let i = 0; i < count; i++) {
          skinIndex[i * 4] = index;
          skinWeight[i * 4] = 1;
        }
      }
      geometry.setAttribute('skinIndex', new THREE.BufferAttribute(skinIndex, 4));
      geometry.setAttribute('skinWeight', new THREE.BufferAttribute(skinWeight, 4));
    }

    // Normals must exist before merging: mergeGeometries requires every input
    // to carry the same attributes, and a missing one silently drops the lot.
    if (!geometry.getAttribute('normal')) geometry.computeVertexNormals();
    return geometry;
  });

  const merged = mergeGeometries(prepared, false);
  for (const geometry of prepared) geometry.dispose();
  if (!merged) throw new Error('assemble: geometries did not share an attribute set');
  merged.userData.finishMask = finishMask;
  // Which vertices came from which part, so a picked face can be traced back
  // to the code that made it. Un-indexed, so face f is vertices 3f..3f+2.
  const table: PartRange[] = [];
  let start = 0;
  prepared.forEach((geometry, i) => {
    const count = geometry.getAttribute('position').count;
    const part = parts[i];
    table.push({ index: i, start, count, name: part.name, bone: part.bone, color: typeof part.color === 'number' ? part.color : undefined });
    start += count;
  });
  merged.userData.parts = table;
  // Star sparkle sites, scattered over whatever triangles carry the star lane.
  collectSparkleSites(merged);
  return merged;
}

/**
 * Finishes a merged geometry into a mesh, and where the species' stiffness is
 * applied: the per-vertex weights say where a thing bends, `FLEX` says whether it
 * bends at all, and multiplying them here keeps the kit on one material and so
 * one draw call. `swayPhase` is stamped for anything wanting a stable
 * per-instance number.
 */
/**
 * What `finish` was handed, which is everything the dressing needs. A builder
 * whose whole body is a pure walk to one `finish` call can therefore be run
 * anywhere — see `capture`.
 */
export interface Finished {
  geometry: THREE.BufferGeometry;
  name: string;
  phase: number;
  underfoot?: SurfaceName;
  /** Set when the builder finished a rigged creature rather than a plain mesh. */
  rig?: Rig;
  /** The builder's scale. The rig's pivots are in unscaled space and need it. */
  scale?: number;
  /** What the builder stamped on its mesh afterwards. Plain data, or no capture. */
  userData?: Record<string, unknown>;
}

let capturing = false;
let captured: Finished | null = null;
let doubled = false;

/** `finish` writes the slot from another frame, which a direct read cannot see. */
function taken(): Finished | null {
  return captured;
}
/**
 * The object a captured `finish` hands back, so the builder has something to
 * return. Skinned, so a rigged builder's declared return type is honest too.
 */
const STUB = new THREE.SkinnedMesh();

/**
 * Whether the stub came back exactly as it went out. Anything a builder did to
 * the mesh after finishing it — a position, a light, a child — is work the
 * geometry alone cannot carry, and the capture has to be refused. `userData` is
 * the exception: plain data can be carried and replayed, which is how a life
 * builder's `LifeSpec` survives the trip.
 */
function untouched(): boolean {
  return (
    STUB.children.length === 0 &&
    STUB.name === '' &&
    STUB.visible &&
    !STUB.castShadow &&
    !STUB.receiveShadow &&
    STUB.layers.mask === 1 &&
    plainData(STUB.userData) &&
    STUB.position.lengthSq() === 0 &&
    STUB.rotation.x === 0 &&
    STUB.rotation.y === 0 &&
    STUB.rotation.z === 0 &&
    STUB.scale.x === 1 &&
    STUB.scale.y === 1 &&
    STUB.scale.z === 1
  );
}

/**
 * Only what crosses a `postMessage` unchanged. A class instance would arrive as
 * a plain object with its prototype gone, which the clone would not complain
 * about and the runtime would, so anything that is not a literal is a refusal.
 */
function plainData(value: unknown, depth = 0): boolean {
  if (value === null || value === undefined) return true;
  const type = typeof value;
  if (type === 'number' || type === 'string' || type === 'boolean') return true;
  if (type !== 'object' || depth > 8) return false;
  if (Array.isArray(value)) return value.every((item) => plainData(item, depth + 1));
  if (Object.getPrototypeOf(value) !== Object.prototype) return false;
  return Object.values(value as object).every((item) => plainData(item, depth + 1));
}

function resetStub(): void {
  STUB.clear();
  STUB.name = '';
  STUB.visible = true;
  STUB.castShadow = false;
  STUB.receiveShadow = false;
  STUB.layers.set(0);
  STUB.userData = {};
  STUB.position.set(0, 0, 0);
  STUB.rotation.set(0, 0, 0);
  STUB.scale.set(1, 1, 1);
}

/**
 * Runs a builder for its geometry alone, off the seam `finish` already draws:
 * the parts walk and the merge are pure, and only the dressing needs a
 * material. Null when the builder is not that shape — it hung lights or child
 * meshes on its mesh, or finished through `finishMesh` with a mesh of its own —
 * and the caller must build it the ordinary way.
 */
export function capture(run: () => THREE.Object3D): Finished | null {
  if (capturing) throw new Error('assemble: capture does not nest');
  capturing = true;
  captured = null;
  doubled = false;
  resetStub();
  try {
    const returned = run();
    const finished = taken();
    if (!finished || doubled || returned !== STUB || !untouched()) return null;
    if (Object.keys(STUB.userData).length > 0) finished.userData = { ...STUB.userData };
    return finished;
  } finally {
    capturing = false;
    captured = null;
    resetStub();
  }
}

/** Dresses what `capture` took, on the thread that owns the materials. */
export function finishCaptured(taken: Finished): THREE.Mesh {
  const mesh = taken.rig
    ? dressRigged(taken.geometry, taken.rig, taken.name, taken.phase, taken.scale ?? 1)
    : finish(taken.geometry, taken.name, taken.phase, taken.underfoot);
  if (taken.userData) Object.assign(mesh.userData, taken.userData);
  return mesh;
}

/** True while a builder is being run for its geometry alone. Read by `rig.ts`. */
export function capturingNow(): boolean {
  return capturing;
}

/** What a captured `finishRigged` records. Hands back the same stub `finish` does. */
export function captureRigged(taken: Finished): THREE.SkinnedMesh {
  if (captured) doubled = true;
  captured = taken;
  return STUB;
}

export function finish(
  geometry: THREE.BufferGeometry,
  name: string,
  phase: number,
  /**
   * What it sounds like underfoot, for the few props that roll their own material
   * rather than having one. Every prop's material is declared by name in
   * `art/underfoot.ts`; this is for the case a table cannot express — a trough is
   * stone or timber depending on its own seed.
   */
  underfoot?: SurfaceName,
): THREE.Mesh {
  if (capturing) {
    // A builder that finishes twice makes two meshes, and one geometry cannot
    // stand for both.
    if (captured) doubled = true;
    captured = { geometry, name, phase, underfoot };
    return STUB;
  }
  return finishMesh(new THREE.Mesh(geometry, ART_MATERIAL), name, phase, underfoot);
}

/**
 * The body of `finish`, on a mesh the caller made — a `SkinnedMesh` for a
 * rigged creature (`art/rig.ts`), a plain one for everything else.
 */
export function finishMesh<T extends THREE.Mesh>(
  mesh: T,
  name: string,
  phase: number,
  underfoot?: SurfaceName,
): T {
  const geometry = mesh.geometry;
  // Baked into the attribute rather than passed as a uniform: a uniform would
  // need a material per species, and the whole kit sharing one material is what
  // keeps a prop to a single draw call.
  const flex = FLEX[name] ?? 0;
  const fields = geometry.getAttribute(FIELD_ATTRIBUTE);
  if (fields && flex !== 1) {
    const array = fields.array as Float32Array;
    for (let i = FIELD_SWAY; i < array.length; i += 3) array[i] *= flex;
    fields.needsUpdate = true;
  }

  // The lean material, and a note of what this prop's parts declared.
  dressArtMesh(mesh, (geometry.userData.finishMask as number | undefined) ?? 0);
  mesh.name = name;
  mesh.userData.swayPhase = phase;
  // Stamped here rather than looked up in the zone manager: by the time the
  // manager walks a built zone the builder is long gone, and the name on the mesh
  // is the only thing left that says what this is.
  if (CLUTTER.has(name)) mesh.userData.clutter = true;
  // What standing on it sounds like, declared by name in `art/underfoot.ts`. The
  // collider carries it onto every triangle, so what holds the player up is what
  // they hear.
  const material = underfoot ?? MATERIALS[name];
  if (material) mesh.userData.underfoot = material;
  // So the sun sees what the camera sees: without it the shadow map is drawn from
  // undisplaced geometry and every swaying plant casts a still shadow of where it
  // is not. Set on everything rather than only on things that bend — a rigid
  // prop's displacement is zero, and a rule would have to be remembered.
  mesh.customDepthMaterial = SWAY_DEPTH_MATERIAL;
  return mesh;
}

/**
 * A smooth 0→1 ramp between two heights, for sway weights. Smoothstep rather
 * than linear: a linear weight puts the sharpest change in bend right where the
 * ramp starts, and a visible crease across a trunk is worse than no sway at all.
 */
export function heightRamp(base: number, top: number, curve = 1.6) {
  return (_x: number, y: number): number => {
    const t = clamp01((y - base) / Math.max(top - base, 1e-6));
    return (t * t * (3 - 2 * t)) ** curve;
  };
}

/**
 * Clamps to 0..1, and maps NaN to 0. Written as comparisons rather than
 * `Math.min(1, Math.max(0, v))`, which passes NaN straight through — every
 * comparison against NaN is false. A NaN in a vertex attribute is not a slightly
 * wrong number, it is a mesh that fails to draw.
 */
function clamp01(value: number): number {
  return value > 0 ? (value < 1 ? value : 1) : 0;
}
