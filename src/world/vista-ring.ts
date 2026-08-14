import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { finish } from '../art/assemble';
import { markVista } from '../art/vista';
import { createRng } from '../art/random';
import type { MeshBuilder } from '../art/types';
import { outlineBounds, type Outline, type Skirt } from './vista';
import { VistaParallax, type ParallaxProp } from './vista-parallax';

/**
 * The vista ring: everything standing out of bounds — VISTA.md.
 *
 * ## Placement is an offset from the level, not a bearing from its middle
 *
 * The spec wrote this as polar — hand-place by bearing and distance, scatter to
 * fill the gaps between. That works for a level shaped like a bowl and means
 * nothing for one shaped like an S: a bearing from the origin can point along
 * the path as easily as away from it, and "120 m out" can land inside the
 * level's own far arm.
 *
 * So the whole ring is written against the skirt's signed distance instead.
 * Hand placement is a world position, and everything else — the band, each
 * kind's own band, and the apparent distance a prop poses at — is measured
 * *out from the outline*. For a winding level that fills the crooks and hugs
 * the bends without a special case, and for a square one it is exactly the ring
 * the spec described.
 *
 * ## Merged means still, individual means moving
 *
 * A prop with an `apparent` distance slides with the camera, and merged
 * geometry has nowhere to hang a per-object transform. Rather than sorting the
 * band into layers that share one — which is what this used to do, and see
 * `vista-parallax.ts` for why that was the wrong shape — the moving props are
 * simply left as meshes of their own and everything else is merged.
 *
 * The parallax set is sparse: ten hills and a tower on a level, against fifty
 * or so still props. So the cost is a dozen draw calls, and the chunking they
 * would otherwise have shared was buying weak frustum culling anyway.
 *
 * ## Chunks are a grid, for the same reason bands are distances
 *
 * Sixty-degree arcs are polar too. Still props are bucketed into square cells
 * and each cell merges into one geometry, which behaves identically on a
 * compact level and correctly on a long one. Three.js frustum-culls per object
 * with no occlusion pass, so granularity is the only culling lever there is —
 * but be honest about the size of that win: a cell this large has a bounding
 * sphere that is in frustum most of the time. Chunks earn their keep mainly as
 * the rebuild-and-edit unit; the draw saving is a bonus.
 */

/**
 * Metres across one merge cell, when the ring does not say.
 *
 * Sized so that a compact level's whole band comes out as a handful of chunks
 * rather than one per prop. The first pass used 64 m and produced twenty-one
 * chunks for nineteen props — every merge a merge of one, which is all of the
 * bookkeeping and none of the saving. A cell wants to hold several things.
 */
const CHUNK = 280;

export interface VistaProp {
  builder: MeshBuilder;
  /** Where it stands, in world XZ. Dropped onto the skirt. */
  at: readonly [number, number];
  scale?: number;
  seed: number;
  /** Which way it faces. Rolled from the seed when omitted. */
  yaw?: number;
  /**
   * How far out it should *read*, in metres from the level's outline.
   *
   * The authoring handle for parallax, with `k` derived from it and from where
   * the prop actually stands — so the composition survives the band's radii
   * being retuned later, and a number in the same units as every other distance
   * out here. Omitted, or no further out than the prop really is, and it stands
   * still and merges with its neighbours.
   */
  apparent?: number;
}

export interface VistaScatter {
  builder: MeshBuilder;
  /** How many to try for. Fewer may land if the band is tight. */
  count: number;
  /**
   * Metres out from the level's outline this kind lives in. Defaults to the
   * ring's own band.
   */
  band?: { inner: number; outer: number };
  /** Uniform scale range. */
  scale?: readonly [number, number];
  /** Keep this far from anything already placed, centre to centre. */
  spacing?: number;
  /**
   * How far out these should read. A range is rolled per prop.
   *
   * Worth rolling rather than fixing: props at different apparent distances
   * move against each other, and that difference is the depth cue. A whole
   * band at one value is a tier by another name.
   */
  apparent?: number | readonly [number, number];
}

export interface VistaRingOptions {
  /** The ground it stands on, and the outline everything is measured from. */
  skirt: Skirt;
  seed: number;
  /** Metres out from the level's outline. */
  band: { inner: number; outer: number };
  /**
   * Hand-placed props, laid before anything is scattered.
   *
   * Sightline composition is authored, per the way everything else here is —
   * scatter only fills what is left.
   */
  place?: readonly VistaProp[];
  /** Seeded fills between them. */
  scatter?: readonly VistaScatter[];
  /**
   * Where a moving prop may never be dragged.
   *
   * For a compact level, the outline grown by whatever the still band reaches —
   * `dilateOutline` does that. For a bent one it is drawn by hand, because the
   * interesting case is a shape no dilation produces: a Y-shaped level wants a
   * keep-out spanning the cup between its arms, so nothing can be pulled across
   * the inside of the bend and cut the sightline down either one.
   *
   * Omitted, nothing stops a moving prop but the props in front of it.
   */
  keepOut?: readonly Outline[];
  /**
   * Metres across one merge cell. Bigger means fewer draws and coarser frustum
   * culling; a long winding level wants smaller than a compact one does.
   */
  chunk?: number;
}

/** One prop's triangles inside its chunk, so a raycast can name it again. */
interface Range {
  start: number;
  count: number;
  name: string;
  seed: number;
}

/** The fraction of the camera's travel a prop moves with. Zero is honest. */
function parallaxK(apparent: number | undefined, actual: number): number {
  if (apparent === undefined || actual <= 0) return 0;
  if (apparent <= actual) return 0;
  return 1 - actual / apparent;
}

/**
 * Builds the ring.
 *
 * Returns a group of merged chunk meshes plus a mesh for each moving prop,
 * every one of them tagged as scenery: out of the collider, out of the shadow
 * box, and not moving in the wind. The parallax controller rides on the group's
 * own `userData`, for `ZoneManager` to drive.
 */
export function vistaRing(options: VistaRingOptions): THREE.Group {
  const { skirt, band } = options;
  const rng = createRng(options.seed);

  const placed: VistaProp[] = [...(options.place ?? [])];
  const taken: { x: number; z: number; keep: number }[] = placed.map((prop) => ({
    x: prop.at[0],
    z: prop.at[1],
    keep: prop.builder.radius * (prop.scale ?? 1),
  }));

  for (const fill of options.scatter ?? []) {
    const range = fill.band ?? band;
    // **Per kind, not once for the ring.** A kind with a band of its own can
    // sit further out than the ring's, and a box drawn to the ring's outer edge
    // then never generates a single candidate that could pass — the filter
    // rejects all of them and the kind silently places nothing.
    const bounds = outlineBounds(skirt.outline, range.outer);
    const spacing = fill.spacing ?? fill.builder.radius * 1.4;
    let landed = 0;
    // Rejection sampling over the bounding box. The band is a thin shell around
    // an arbitrary outline and there is no cheap way to sample it directly, so
    // this throws darts and keeps the ones that stick. Capped rather than
    // looped until full, because a band that cannot hold `count` would spin.
    // Generous, because the band is a thin shell inside a square box and most
    // darts miss it before spacing is even considered.
    for (let attempt = 0; attempt < fill.count * 200 && landed < fill.count; attempt++) {
      const x = rng.range(bounds.min[0], bounds.max[0]);
      const z = rng.range(bounds.min[1], bounds.max[1]);
      const out = skirt.outside(x, z);
      if (out < range.inner || out > range.outer) continue;

      const scale = fill.scale ? rng.range(fill.scale[0], fill.scale[1]) : 1;
      const keep = fill.builder.radius * scale;
      let clear = true;
      for (const other of taken) {
        // **A floor, not an addition.** Adding `spacing` on top of the two
        // radii double-counts: a forest mass declares a 34 m radius and may be
        // scaled past 3, so its own half-extent is already a hundred metres,
        // and another thirty on top put the exclusion beyond anything the band
        // could hold. Four kinds silently placed nothing before this changed.
        const clearance = Math.max((keep + other.keep) * 0.5, spacing);
        if (Math.hypot(x - other.x, z - other.z) < clearance) {
          clear = false;
          break;
        }
      }
      if (!clear) continue;

      placed.push({
        builder: fill.builder,
        at: [x, z],
        scale,
        seed: rng.int(1, 0x7fffffff),
        apparent:
          fill.apparent === undefined || typeof fill.apparent === 'number'
            ? fill.apparent
            : rng.range(fill.apparent[0], fill.apparent[1]),
      });
      taken.push({ x, z, keep });
      landed++;
    }

    // Landing nothing at all is a mistake in the numbers rather than a tight
    // fit, and it is invisible from the outside — the band is simply empty and
    // looks like a placement nobody got round to.
    if (landed === 0) {
      console.warn(
        `vistaRing: ${fill.builder.name} placed none of ${fill.count} ` +
          `in band ${range.inner}–${range.outer} m`,
      );
    }
  }

  const root = new THREE.Group();
  root.name = 'vista-ring';

  // --- sort still from moving -----------------------------------------------

  const still: VistaProp[] = [];
  const moving: { prop: VistaProp; k: number }[] = [];
  for (const prop of placed) {
    const actual = skirt.outside(prop.at[0], prop.at[1]);
    const k = parallaxK(prop.apparent, actual);
    if (k > 0) moving.push({ prop, k });
    else {
      // Asking to read *nearer* than it stands would move the prop against the
      // camera, which is the one direction that reads as a bug rather than as
      // distance. Silently standing still is the safe answer; saying so is what
      // stops it being a mystery.
      if (prop.apparent !== undefined && prop.apparent <= actual) {
        console.warn(
          `vistaRing: ${prop.builder.name} asks to read at ${prop.apparent.toFixed(0)} m ` +
            `but stands at ${actual.toFixed(0)} m, so it does not move`,
        );
      }
      still.push(prop);
    }
  }

  // --- the moving props, one mesh each ---------------------------------------

  const parallax: ParallaxProp[] = moving.map(({ prop, k }) => {
    const mesh = build(prop, skirt);
    const count = mesh.geometry.getAttribute('position').count / 3;
    // The same table the chunks carry, so picking does not have to know whether
    // what it hit was merged — EDITOR.md.
    mesh.userData.vistaRanges = [
      { start: 0, count, name: prop.builder.name, seed: prop.seed },
    ] satisfies Range[];
    root.add(markVista(mesh));
    return {
      mesh,
      base: [prop.at[0], prop.at[1]] as const,
      k,
      keep: prop.builder.radius * (prop.scale ?? 1),
    };
  });

  if (parallax.length > 0) {
    // Read by `ZoneManager`, which drives it from the camera each frame.
    root.userData.vistaParallax = new VistaParallax(parallax, options.keepOut ?? []);
  }

  // --- everything else, bucketed and merged ---------------------------------

  const size = options.chunk ?? CHUNK;
  const cells = new Map<string, VistaProp[]>();
  for (const prop of still) {
    const key = `${Math.floor(prop.at[0] / size)},${Math.floor(prop.at[1] / size)}`;
    const cell = cells.get(key);
    if (cell) cell.push(prop);
    else cells.set(key, [prop]);
  }

  for (const [key, cell] of cells) {
    const geometries: THREE.BufferGeometry[] = [];
    const ranges: Range[] = [];
    let start = 0;

    for (const prop of cell) {
      const mesh = build(prop, skirt);
      const geometry = mesh.geometry;
      mesh.updateMatrix();
      // Baked in rather than left on the mesh: the whole cell becomes one
      // buffer, so there is nowhere left to hang a transform.
      geometry.applyMatrix4(mesh.matrix);

      const count = geometry.getAttribute('position').count / 3;
      // **Recorded here or never.** Once these are one buffer nothing
      // downstream can tell which triangle belonged to which prop, so a
      // raycast's `faceIndex` has no way back to the thing that was clicked.
      // Cheap during the merge, impossible afterwards — EDITOR.md.
      ranges.push({ start, count, name: prop.builder.name, seed: prop.seed });
      start += count;
      geometries.push(geometry);
    }

    const merged = mergeGeometries(geometries, false);
    for (const geometry of geometries) geometry.dispose();
    if (!merged) throw new Error(`vistaRing: chunk ${key} did not share an attribute set`);

    const chunk = finish(merged, 'vista-chunk', 0);
    chunk.userData.vistaRanges = ranges;
    root.add(markVista(chunk));
  }

  return root;
}

/** One prop, built and stood on the skirt where it was placed. */
function build(prop: VistaProp, skirt: Skirt): THREE.Mesh {
  const mesh = prop.builder.build({ seed: prop.seed, scale: prop.scale ?? 1 });
  mesh.position.set(prop.at[0], skirt.heightAt(prop.at[0], prop.at[1]), prop.at[1]);
  mesh.rotation.y = prop.yaw ?? createRng(prop.seed ^ 0x1a71)() * Math.PI * 2;
  return mesh;
}

/** Which prop a raycast hit, from the triangle it landed on. */
export function vistaPropAt(chunk: THREE.Mesh, faceIndex: number): Range | null {
  const ranges = chunk.userData.vistaRanges as Range[] | undefined;
  if (!ranges) return null;
  let low = 0;
  let high = ranges.length - 1;
  while (low <= high) {
    const mid = (low + high) >> 1;
    const range = ranges[mid];
    if (faceIndex < range.start) high = mid - 1;
    else if (faceIndex >= range.start + range.count) low = mid + 1;
    else return range;
  }
  return null;
}
