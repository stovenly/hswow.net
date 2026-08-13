import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { finish } from '../art/assemble';
import { markVista } from '../art/vista';
import { createRng } from '../art/random';
import type { MeshBuilder } from '../art/types';
import { outlineBounds, type Skirt } from './vista';

/**
 * The vista ring: everything standing out of bounds, merged into a handful of
 * draws — VISTA.md.
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
 * Hand placement is a world position, and the band is the region between two
 * distances *from the outline* — which for a winding level fills the crooks and
 * hugs the bends without a special case, and for a square one is exactly the
 * ring the spec described.
 *
 * ## Tiers, and the other half of the lie
 *
 * Scale alone does not sell distance, because walking exposes it. Cross forty
 * metres of a level and a hill placed at 150 m sweeps about 15 degrees of
 * bearing where a genuine 600 m hill sweeps four. Fog says far, motion says
 * near, and motion wins.
 *
 * A tier is a group that slides *with* the camera by a fraction `k` of its
 * travel, so what is left over — `1 - k` — is the parallax the eye reads. A
 * tier at `k = 0.75` moves a quarter as much as the ground does and therefore
 * reads four times further away than it is. `ZoneManager` does the sliding; all
 * that happens here is that a tier's chunks go under a group of their own with
 * `userData.vistaK` on it.
 *
 * Two rules come with it, and both are geometry rather than taste:
 *
 * - **A moving tier cannot stand on still ground.** Its footings would slide
 *   across the skirt. Moving tiers belong out where the skirt has dissolved
 *   into horizon colour and no footing can be read, which is also where the
 *   spec reserves ribbons and suggestions.
 * - **Slide budget must stay under tier separation.** A tier's maximum slide is
 *   the level's traversable radius times `k`; two tiers closer together than
 *   that will visibly swim through one another.
 *
 * ## Chunks are a grid, for the same reason
 *
 * Sixty-degree arcs are polar too. Props are bucketed into square cells and
 * each cell merges into one geometry, which behaves identically on a compact
 * level and correctly on a long one. Three.js frustum-culls per object with no
 * occlusion pass, so granularity is the only culling lever there is — but be
 * honest about the size of that win: a cell this large has a bounding sphere
 * that is in frustum most of the time. Chunks earn their keep mainly as the
 * rebuild-and-edit unit; the draw saving is a bonus.
 */

/**
 * Metres across one merge cell, when the ring does not say.
 *
 * Sized so that a compact level's whole band comes out as a handful of chunks
 * rather than one per prop. The first pass used 64 m and produced twenty-one
 * chunks for nineteen props — every merge a merge of one, which is all of the
 * bookkeeping and none of the saving. A cell wants to hold several things.
 *
 * Tiers multiply it: each one buckets separately, because a group that moves
 * cannot share a buffer with one that does not. Three tiers is three times the
 * floor, which is why this went up again when the second moving tier landed.
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
  /** Which tier it belongs to, as an index into `tiers`. Defaults to the honest one. */
  tier?: number;
}

/**
 * A parallax layer.
 *
 * `k` is the fraction of the camera's travel the tier moves with — 0 is honest
 * geometry standing still, and the sky ridge is this same mechanism at 1. It is
 * per-tier data rather than a constant so that one number describes all three
 * bands instead of them being three unrelated ideas.
 */
export interface VistaTier {
  k: number;
}

export interface VistaScatter {
  builder: MeshBuilder;
  /** Which tier these belong to. Defaults to the honest one. */
  tier?: number;
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
   * Metres across one merge cell. Bigger means fewer draws and coarser frustum
   * culling; a long winding level wants smaller than a compact one does.
   */
  chunk?: number;
  /**
   * How far the player can get from the middle of the level, in metres.
   *
   * The corner of the walkable area, not its half-width. Every tier's slide is
   * this times its `k`, so it is what decides whether a tier can be allowed to
   * move at all — see `tiers`.
   */
  travel?: number;
  /**
   * The parallax layers, index 0 first and always still.
   *
   * Two moving tiers is plenty — and whether even one is too many is an
   * eyeball question, which is what the freeze toggle is for.
   */
  tiers?: readonly VistaTier[];
}

/** Clearance kept between one tier's reach and the next tier's nearest prop. */
const TIER_MARGIN = 6;

/**
 * The largest `k` each tier may actually use.
 *
 * **Pairwise and local, because the constraint is local.** A tier translates
 * rigidly, so the half of the ring you walk away from is dragged toward the
 * level — but what a given prop can collide with is whatever is *near it*, not
 * whatever is furthest out anywhere. Comparing a tier's nearest prop against
 * another tier's furthest one is a global answer to a local question, and on
 * anything but a small square level it is wrong by a mile: a landmark placed
 * far out due north would hold back a tier prop due south that it can never
 * meet. On a level shaped like an L it would be hopeless.
 *
 * So every moving prop is checked against every prop in front of it, and the
 * worst case is the two sliding straight at each other. Both half-extents count,
 * because a scaled-up forest mass is most of a hundred metres of its own.
 *
 * Quadratic, over a few dozen props, once at build time.
 *
 * What this cannot see is *sightlines* — a tier prop drifting across the line
 * between the player and a landmark reads as passing in front of it without
 * ever touching it. That needs authored keep-out shapes; see VISTA.md.
 */
function safeTiers(
  tiers: readonly VistaTier[],
  placed: readonly VistaProp[],
  travel: number,
): number[] {
  const safe = tiers.map((tier) => tier.k);
  if (travel <= 0) return safe;

  const reach = (prop: VistaProp): number => prop.builder.radius * (prop.scale ?? 1);

  for (let t = 1; t < tiers.length; t++) {
    if (safe[t] <= 0) continue;
    let limit = safe[t];
    for (const a of placed) {
      if ((a.tier ?? 0) !== t) continue;
      for (const b of placed) {
        const s = b.tier ?? 0;
        if (s >= t) continue;
        const gap =
          Math.hypot(a.at[0] - b.at[0], a.at[1] - b.at[1]) - reach(a) - reach(b) - TIER_MARGIN;
        limit = Math.min(limit, safe[s] + gap / travel);
      }
    }
    const capped = Math.max(0, Math.min(safe[t], limit));
    if (capped < safe[t] - 1e-6) {
      console.warn(
        `vistaRing: tier ${t} asked for k=${safe[t].toFixed(2)} but only ` +
          `k=${capped.toFixed(2)} clears what is in front of it over ` +
          `${travel.toFixed(0)} m of travel`,
      );
    }
    safe[t] = capped;
  }
  return safe;
}

/** One prop's triangles inside its chunk, so a raycast can name it again. */
interface Range {
  start: number;
  count: number;
  name: string;
  seed: number;
}

/**
 * Builds the ring.
 *
 * Returns a group of merged chunk meshes, every one tagged as scenery: out of
 * the collider, out of the shadow box, and not moving in the wind.
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
    // rejects all of them and the kind silently places nothing. That is exactly
    // how the first parallax tier came to be empty.
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
        tier: fill.tier,
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

  // --- bucket, then merge ---------------------------------------------------

  const size = options.chunk ?? CHUNK;
  const tiers = options.tiers ?? [{ k: 0 }];
  const safe = safeTiers(tiers, placed, options.travel ?? 0);
  // Bucketed by tier as well as by cell: a tier is a group that moves, so its
  // geometry cannot share a buffer with anything that stands still.
  const cells = new Map<string, VistaProp[]>();
  for (const prop of placed) {
    const tier = prop.tier ?? 0;
    const key = `${tier}/${Math.floor(prop.at[0] / size)},${Math.floor(prop.at[1] / size)}`;
    const cell = cells.get(key);
    if (cell) cell.push(prop);
    else cells.set(key, [prop]);
  }

  const root = new THREE.Group();
  root.name = 'vista-ring';

  /**
   * One group per tier, created on demand.
   *
   * The still tier gets no group of its own — it never moves, so a wrapper
   * would be a matrix multiply a frame for nothing.
   */
  const layers = new Map<number, THREE.Object3D>();
  const layerFor = (tier: number): THREE.Object3D => {
    if (tier === 0 || (safe[tier] ?? 0) === 0) return root;
    let group = layers.get(tier);
    if (!group) {
      group = new THREE.Group();
      group.name = `vista-tier-${tier}`;
      // Read by `ZoneManager`, which does the sliding. Translate only, and XZ
      // only: a tier that yaw-locks to the camera is a skybox, and vertical
      // slide against the horizon line is the most detectable kind there is.
      group.userData.vistaK = safe[tier];
      layers.set(tier, group);
      root.add(group);
    }
    return group;
  };

  for (const [key, cell] of cells) {
    const geometries: THREE.BufferGeometry[] = [];
    const ranges: Range[] = [];
    let start = 0;

    for (const prop of cell) {
      const mesh = prop.builder.build({ seed: prop.seed, scale: prop.scale ?? 1 });
      const geometry = mesh.geometry;
      mesh.position.set(prop.at[0], skirt.heightAt(prop.at[0], prop.at[1]), prop.at[1]);
      mesh.rotation.y = prop.yaw ?? createRng(prop.seed ^ 0x1a71)() * Math.PI * 2;
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
    layerFor(cell[0].tier ?? 0).add(markVista(chunk));
  }

  return root;
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
