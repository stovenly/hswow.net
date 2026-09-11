import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { finish } from '../art/assemble';
import { finishCaptured } from '../art/dress';
import { markVista } from '../art/vista';
import { createRng } from '../art/random';
import { CardAtlas, frameOf, type CardInstance, type CardVariant } from '../art/cards';
import { STAND_SPECIES, variantSeed } from '../art/foliage';
import type { MeshBuilder } from '../art/types';
import { takeWarm } from './warmProps';
import type { PropAsk } from '../engine/work/jobs';
import { outlineBounds, type Outline, type Skirt } from './vista';
import { VistaParallax, type ParallaxProp } from './vista-parallax';
import { standMesh } from './stands';

/**
 * The vista ring: everything standing out of bounds.
 *
 * Placement is an offset from the level, not a bearing from its middle. A bearing
 * from the origin can point along an S-shaped level's path as easily as away from
 * it, and "120 m out" can land inside the level's own far arm — so the whole ring
 * is written against the skirt's signed distance. Hand placement is a world
 * position; everything else is measured out from the outline.
 *
 * Merged means still, individual means moving: a prop with an `apparent` distance
 * slides with the camera, and merged geometry has nowhere to hang a per-object
 * transform, so the moving props are left as meshes of their own. The parallax set
 * is sparse — ten hills and a tower against fifty still props.
 *
 * Still props are bucketed into square cells and each cell merges into one
 * geometry, which behaves identically on a compact level and correctly on a long
 * one. Chunks earn their keep mainly as the rebuild-and-edit unit; a cell this
 * large has a bounding sphere in frustum most of the time.
 */

/**
 * Metres across one merge cell, when the ring does not say. Sized so a compact
 * level's whole band is a handful of chunks rather than one per prop — at 64 m it
 * produced twenty-one chunks for nineteen props, which is all of the bookkeeping
 * and none of the saving.
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
  /** A named variant, for a builder that has them. Rolled from the seed when omitted. */
  variant?: string;
  /**
   * Degrees either side of this prop's bearing from the origin kept free of
   * scattered props nearer than it, so a small far landmark is not stood in
   * front of. Hand placement is not checked: the placer can see.
   */
  clear?: number;
  /**
   * How far out it should read, in metres from the level's outline — the authoring
   * handle for parallax, with `k` derived from it and from where the prop actually
   * stands, so the composition survives the band's radii being retuned. Omitted, or
   * no further out than the prop really is, and it stands still and merges.
   */
  apparent?: number;
  /**
   * A billboard of the builder rather than the builder. Nothing works this out:
   * a placement says so or it does not, at any range.
   */
  card?: boolean;
  /** How many seeds of this species the atlas holds. One, unless the repeat shows. */
  variants?: number;
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
   * How far out these should read. A range is rolled per prop, and worth rolling
   * rather than fixing: props at different apparent distances move against each
   * other, and that difference is the depth cue. A whole band at one value is a tier.
   */
  apparent?: number | readonly [number, number];
  /** Every prop this scatter lands is a billboard. */
  card?: boolean;
  /** How many seeds of this species the atlas holds. */
  variants?: number;
}

/** What the ring hands the manager: the trees to render into an atlas, and where their cards stand. */
export interface VistaCards {
  variants: CardVariant[];
  instances: CardInstance[];
}

export interface VistaRingOptions {
  /** The ground it stands on, and the outline everything is measured from. */
  skirt: Skirt;
  seed: number;
  /** A plan the warm already made, so the build does not make it again. */
  plan?: VistaProp[];
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
   * Where a moving prop may never be dragged. For a compact level, the outline grown
   * by whatever the still band reaches — `dilateOutline` does that. For a bent one
   * it is drawn by hand, because the interesting case is a shape no dilation
   * produces: a Y-shaped level wants a keep-out spanning the cup between its arms.
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
 * Where everything in the ring stands, before any of it is built. Separated so
 * the warm pass can run it and have the props made off the main thread, and
 * hand the plan on for the build to stand up (`VistaRingOptions.plan`).
 */
export function vistaRingPlan(
  options: VistaRingOptions,
  onEmpty?: (fill: VistaScatter, range: { inner: number; outer: number }) => void,
): VistaProp[] {
  const { skirt, band } = options;
  const rng = createRng(options.seed);

  const placed: VistaProp[] = [...(options.place ?? [])];
  const taken: { x: number; z: number; keep: number }[] = placed.map((prop) => ({
    x: prop.at[0],
    z: prop.at[1],
    keep: prop.builder.radius * (prop.scale ?? 1),
  }));
  const sectors = placed
    .filter((prop) => prop.clear !== undefined)
    .map((prop) => ({
      bearing: Math.atan2(prop.at[0], prop.at[1]),
      reach: Math.hypot(prop.at[0], prop.at[1]),
      half: ((prop.clear ?? 0) * Math.PI) / 180,
    }));
  const inFront = (x: number, z: number): boolean => {
    const bearing = Math.atan2(x, z);
    const reach = Math.hypot(x, z);
    for (const sector of sectors) {
      if (reach > sector.reach) continue;
      let off = Math.abs(bearing - sector.bearing);
      if (off > Math.PI) off = Math.PI * 2 - off;
      if (off < sector.half) return true;
    }
    return false;
  };

  for (const fill of options.scatter ?? []) {
    const range = fill.band ?? band;
    // Per kind, not once for the ring: a kind with a band of its own can sit further
    // out than the ring's, and a box drawn to the ring's outer edge then never
    // generates a candidate that could pass, so the kind silently places nothing.
    const bounds = outlineBounds(skirt.outline, range.outer);
    const spacing = fill.spacing ?? fill.builder.radius * 1.4;
    let landed = 0;
    // Rejection sampling over the bounding box: the band is a thin shell around an
    // arbitrary outline and there is no cheap way to sample it directly. Capped
    // rather than looped until full, because a band that cannot hold `count` would
    // spin, and generous, because most darts miss the shell before spacing is
    // even considered.
    for (let attempt = 0; attempt < fill.count * 200 && landed < fill.count; attempt++) {
      const x = rng.range(bounds.min[0], bounds.max[0]);
      const z = rng.range(bounds.min[1], bounds.max[1]);
      const out = skirt.outside(x, z);
      if (out < range.inner || out > range.outer) continue;
      if (inFront(x, z)) continue;

      const scale = fill.scale ? rng.range(fill.scale[0], fill.scale[1]) : 1;
      const keep = fill.builder.radius * scale;
      let clear = true;
      for (const other of taken) {
        // A floor, not an addition: adding `spacing` on top of the two radii
        // double-counts, and a forest mass declaring a 34 m radius scaled past 3 has a
        // half-extent of a hundred metres already.
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
        card: fill.card,
        variants: fill.variants,
        apparent:
          fill.apparent === undefined || typeof fill.apparent === 'number'
            ? fill.apparent
            : rng.range(fill.apparent[0], fill.apparent[1]),
      });
      taken.push({ x, z, keep });
      landed++;
    }

    // Reported by the caller rather than here, because the plan runs twice —
    // once to warm the props and once to stand them up.
    if (landed === 0) onEmpty?.(fill, range);
  }

  // Named here rather than at the render, so a ring over the cap says so before
  // anything is built and says which trees put it over. Never dropped silently.
  const keys = new Set(placed.filter((prop) => prop.card).map(cardKey));
  if (keys.size > CardAtlas.capacity) {
    throw new Error(`vistaRing: ${keys.size} card variants over the atlas's ${CardAtlas.capacity}: ${[...keys].join(', ')}`);
  }

  return placed;
}

/** Which atlas variant a card placement wants: its species, and one of that species' seeds. */
function cardKey(prop: VistaProp): string {
  return `${prop.builder.name}:${variantSeed('vista', prop.builder.name, prop.seed, prop.variants ?? 1)}`;
}

/**
 * Builds the ring: a group of merged chunk meshes plus a mesh for each moving prop,
 * every one tagged as scenery — out of the collider, out of the shadow box, and
 * not moving in the wind. The parallax controller rides on the group's `userData`.
 */
export function vistaRing(options: VistaRingOptions): THREE.Group {
  const { skirt } = options;
  // Landing nothing at all is a mistake in the numbers rather than a tight fit,
  // and it is invisible from the outside — the band is simply empty and looks
  // like a placement nobody got round to.
  const placed =
    options.plan ??
    vistaRingPlan(options, (fill, range) => {
      console.warn(
        `vistaRing: ${fill.builder.name} placed none of ${fill.count} ` +
          `in band ${range.inner}–${range.outer} m`,
      );
    });

  const root = new THREE.Group();
  root.name = 'vista-ring';

  // --- sort still from moving -----------------------------------------------

  const still: VistaProp[] = [];
  const moving: { prop: VistaProp; k: number }[] = [];
  const carded: VistaProp[] = [];
  for (const prop of placed) {
    if (prop.card) {
      if (prop.apparent !== undefined) {
        console.warn(`vistaRing: ${prop.builder.name} is a card, so its apparent distance of ${prop.apparent.toFixed(0)} m does nothing — cards are one instanced mesh`);
      }
      carded.push(prop);
      continue;
    }
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
    root.add(markRing(prop, mesh));
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
  const stands = new Map<string, THREE.Mesh>();
  for (const prop of still) {
    // A crown is a second mesh on a second material, so a tree has nothing a
    // chunk could merge: it stands as its own mesh and shares its geometry with
    // the others of its variant, exactly as a tree inside the level does.
    if (STAND_SPECIES.has(prop.builder.name)) {
      const mesh = standMesh(stands, 'vista', prop.builder, prop.seed, prop.scale ?? 1);
      mesh.position.set(prop.at[0], skirt.heightAt(prop.at[0], prop.at[1]), prop.at[1]);
      mesh.rotation.y = prop.yaw ?? createRng(prop.seed ^ 0x1a71)() * Math.PI * 2;
      root.add(markRing(prop, mesh));
      continue;
    }
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

  // --- the cards ------------------------------------------------------------

  // Left as a plan on the group: rendering the atlas wants the renderer, which
  // only the manager has, and it has to happen after the branch sheet exists.
  const cards = planCards(carded, skirt);
  if (cards) root.userData.vistaCards = cards;

  return root;
}

/** The atlas variants a set of card placements wants, and where every card of them stands. */
function planCards(props: readonly VistaProp[], skirt: Skirt): VistaCards | null {
  if (props.length === 0) return null;
  const index = new Map<string, number>();
  const variants: CardVariant[] = [];
  const instances: CardInstance[] = [];
  for (const prop of props) {
    const key = cardKey(prop);
    let which = index.get(key);
    if (which === undefined) {
      which = variants.length;
      index.set(key, which);
      variants.push(cardVariant(key, prop.builder, Number(key.slice(key.lastIndexOf(':') + 1))));
    }
    instances.push({
      x: prop.at[0],
      y: skirt.heightAt(prop.at[0], prop.at[1]),
      z: prop.at[1],
      yaw: prop.yaw ?? createRng(prop.seed ^ 0x1a71)() * Math.PI * 2,
      scale: prop.scale ?? 1,
      variant: which,
    });
  }
  return { variants, instances };
}

/** One tree built at the origin, split into the two halves a card is rendered from. */
function cardVariant(key: string, builder: MeshBuilder, seed: number): CardVariant {
  const mesh = builder.build({ seed, scale: 1 });
  const crown = mesh.children.find((child) => child.userData.canopy === true);
  if (!(crown instanceof THREE.Mesh)) throw new Error(`vistaRing: "${builder.name}" has no crown, so there is nothing to card`);
  return { key, trunk: mesh.geometry, canopy: crown.geometry, ...frameOf(mesh.geometry, crown.geometry) };
}

/**
 * Scenery, out of the collider and out of the shadow box. A real tree keeps its
 * wind: `markVista` zeroes the sway lane, and a rigid trunk under a crown that
 * still moves opens the seam between the two.
 */
function markRing(prop: VistaProp, mesh: THREE.Mesh): THREE.Mesh {
  if (!STAND_SPECIES.has(prop.builder.name)) return markVista(mesh);
  mesh.userData.vista = true;
  mesh.userData.noCollide = true;
  return mesh;
}

/** One prop, built and stood on the skirt where it was placed. */
function build(prop: VistaProp, skirt: Skirt): THREE.Mesh {
  const scale = prop.scale ?? 1;
  const warm = takeWarm(propAsk(prop));
  const mesh = warm ? finishCaptured(warm) : prop.builder.build({ seed: prop.seed, scale, ...extrasOf(prop) });
  mesh.position.set(prop.at[0], skirt.heightAt(prop.at[0], prop.at[1]), prop.at[1]);
  mesh.rotation.y = prop.yaw ?? createRng(prop.seed ^ 0x1a71)() * Math.PI * 2;
  return mesh;
}

/** The builder call a prop is, as the warm pass files it. */
export function propAsk(prop: VistaProp): PropAsk {
  return { builder: prop.builder.name, seed: prop.seed, scale: prop.scale ?? 1, extras: extrasOf(prop) };
}

function extrasOf(prop: VistaProp): Record<string, unknown> | undefined {
  return prop.variant ? { variant: prop.variant } : undefined;
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
