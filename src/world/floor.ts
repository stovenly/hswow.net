import * as THREE from 'three';
import { markCollidable } from '../player/Collider';

/**
 * A flat floor big enough to stop worrying about the edge of it — somewhere the
 * galleries can stand that does not have to be widened every time the art kit
 * grows. Do not build a ground mesh that recentres on the player: the collider
 * indexes each zone into an octree once and caches it by key, so ground that moves
 * reinvalidates that index every frame.
 *
 * The grid is a texture, and that is the whole point. `GridHelper` moirés at
 * distance — the lines converge to well under a pixel and there is no mipmap chain
 * for line geometry to fall back on. Anisotropic filtering is the correct fix and
 * cannot be applied to lines, because there is no texture being sampled. Drawn as
 * a texture, mipmaps average the lines away as they shrink and AF keeps the
 * minification from being taken along the wrong axis.
 *
 * Built as a `DataTexture` from arithmetic rather than on a canvas, because the
 * headless checks reach this file through esbuild and there is no `document`.
 */

/** Metres covered by one repeat of the grid texture. */
const TILE = 4;
/** Texels across one tile. Power of two, so the mipmap chain is complete. */
const PIXELS = 256;
/** Texels per metre. */
const CELL = PIXELS / TILE;

/** How dark the lines are, as a multiplier on the floor colour. The texture is white everywhere else, so the material's `color` still means what it says. */
const MINOR_TINT = 0.82;
const MAJOR_TINT = 0.6;

/**
 * Metres per collision quad. A capsule on a plane does not care how that plane is
 * triangulated, but the collider's octree does: two metres doubles the index cost
 * for no behavioural change, and eight starts making the triangles large against
 * the tree's leaves.
 */
const QUAD = 4;

/** Line half-widths in texels. A metre line lands around a centimetre wide. */
const MINOR_HALF = 0.6;
const MAJOR_HALF = 1.4;

/**
 * Coverage of one line by one texel, 0..1. Computed rather than stamped: a
 * hard-edged line is a step function, so every mipmap level below the first is an
 * average of an aliased signal and the moiré comes back at middle distance. Half a
 * texel of falloff gives the chain something band-limited to start from.
 */
function coverage(distance: number, halfWidth: number): number {
  return Math.min(Math.max(halfWidth + 0.5 - distance, 0), 1);
}

/** Distance in texels from `p` to the nearest multiple of `spacing`. */
function toNearest(p: number, spacing: number): number {
  const offset = ((p % spacing) + spacing) % spacing;
  return Math.min(offset, spacing - offset);
}

let gridTexture: THREE.DataTexture | null = null;

/**
 * The shared grid map, one texture for every floor that wants one. Cached at module
 * scope for the reason the art kit shares one material: a texture per zone is a
 * texture uploaded per zone, and these are identical. Never disposed.
 */
export function gridMap(): THREE.DataTexture {
  if (gridTexture) return gridTexture;

  const data = new Uint8Array(PIXELS * PIXELS * 4);

  for (let y = 0; y < PIXELS; y++) {
    for (let x = 0; x < PIXELS; x++) {
      // Texel centres, so a line on the tile boundary is split evenly between
      // this tile and the next one rather than landing a half-texel off.
      const px = x + 0.5;
      const py = y + 0.5;

      // Major lines sit on the tile boundary, which is where the repeat seam
      // is — so the seam is under the widest line in the pattern and cannot be
      // seen as a seam.
      const major = Math.max(
        coverage(toNearest(px, PIXELS), MAJOR_HALF),
        coverage(toNearest(py, PIXELS), MAJOR_HALF),
      );
      const minor = Math.max(
        coverage(toNearest(px, CELL), MINOR_HALF),
        coverage(toNearest(py, CELL), MINOR_HALF),
      );

      const tint = Math.min(
        1 - major * (1 - MAJOR_TINT),
        1 - minor * (1 - MINOR_TINT),
      );
      const value = Math.round(tint * 255);

      const i = (y * PIXELS + x) * 4;
      data[i] = value;
      data[i + 1] = value;
      data[i + 2] = value;
      data[i + 3] = 255;
    }
  }

  const texture = new THREE.DataTexture(data, PIXELS, PIXELS, THREE.RGBAFormat);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  // The lines are a multiplier on an already-sRGB material colour, so this is a
  // linear mask and not colour data. Tagging it sRGB would darken the floor.
  texture.colorSpace = THREE.NoColorSpace;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  // Clamped by the renderer to whatever the device actually supports, so this
  // is a request for "as much as there is" rather than a number to tune.
  texture.anisotropy = 16;
  texture.needsUpdate = true;

  gridTexture = texture;
  return texture;
}

export interface FlatGroundOptions {
  /** Floor colour. The grid is drawn as a darker multiple of it. */
  color?: THREE.ColorRepresentation;
  /**
   * Segments along each edge. Defaults to one every `QUAD` metres.
   *
   * Two arguments pull in opposite directions. Lighting wants more than one, since
   * a Lambert surface interpolates across the face and a single enormous quad is
   * one gradient corner to corner. The collider wants a great many more, and this
   * is the one that bites: the octree stores a triangle in every cell it touches,
   * so a triangle spanning a third of the level is inserted into a large fraction
   * of the tree.
   *
   * A flat floor is cheap because it is flat, not because it is undivided, and it
   * still has to be cut to roughly the size of the things indexed beside it.
   */
  segments?: number;
  /** Set false for a floor the player should fall through. */
  collidable?: boolean;
  /**
   * Height of the surface. A centimetre below zero, and not by accident: the player
   * is a capsule whose lowest point is exactly at its feet, so a floor whose surface
   * is also at the walkable plane is tangent to it — and tangency counts as an
   * overlap, which reads downstream as arriving inside geometry.
   */
  y?: number;
  /**
   * An existing material to use instead of building one, for the Proving Ground,
   * whose floor material is shared with its live colour picker. The grid map is
   * attached either way.
   */
  material?: THREE.MeshLambertMaterial;
}

/**
 * A square of level, gridded ground, centred on the origin. Pair it with
 * `groundAt: () => 0` and a `floor` well below zero. Deliberately does not do
 * painted ground cover or height variation: a gallery is a dev room.
 */
export function flatGround(size = 400, options: FlatGroundOptions = {}): THREE.Mesh {
  const segments = options.segments ?? Math.max(8, Math.round(size / QUAD));

  const geometry = new THREE.PlaneGeometry(size, size, segments, segments);
  geometry.rotateX(-Math.PI / 2);

  // The tiling is baked into the UVs rather than set as `repeat` on the texture, so
  // every floor in the game shares one map with one upload — `repeat` and `offset`
  // live on the texture, so using them would mean a texture per floor size. Written
  // in world units, so a grid line lands on x = 0 and z = 0.
  const uv = geometry.getAttribute('uv');
  for (let i = 0; i < uv.count; i++) {
    uv.setXY(i, (uv.getX(i) - 0.5) * (size / TILE), (uv.getY(i) - 0.5) * (size / TILE));
  }
  uv.needsUpdate = true;

  const material =
    options.material ?? new THREE.MeshLambertMaterial({ color: options.color ?? 0xcabb9c });
  if (material.map !== gridMap()) {
    material.map = gridMap();
    material.needsUpdate = true;
  }

  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = 'flatGround';
  mesh.position.y = options.y ?? -0.01;

  return options.collidable === false ? mesh : markCollidable(mesh);
}

/** Metres between the heavy lines, for anything that wants to lay out on them. */
export const GRID_TILE = TILE;
