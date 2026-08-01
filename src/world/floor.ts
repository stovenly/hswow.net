import * as THREE from 'three';
import { markCollidable } from '../player/Collider';

/**
 * A flat floor big enough to stop worrying about the edge of it.
 *
 * The galleries need somewhere to stand that does not have to be widened every
 * time the art kit grows. The Proving Ground has been widened three times for
 * exactly that reason, and each widening cost collider index time on every zone
 * crossing, because its floor is a *painted terrain patch* — subdivided,
 * per-vertex coloured, materially varied underfoot.
 *
 * A gallery needs none of that. It needs a plane and a ruler.
 *
 * **The instinct is a ground mesh that recentres on the player. Do not build
 * it.** The collider indexes each zone into an octree once and caches it by key
 * (`src/player/Collider.ts`), so ground that moves reinvalidates that index
 * every frame — the one shape guaranteed to cost more than the thing it was
 * avoiding. Size is not what makes a floor expensive. One 400 m quad is two
 * triangles, and the outdoor `fogFar` of 140 m hides its edge two and a half
 * times over.
 *
 * ## The grid is a texture, and that is the whole point
 *
 * In a featureless void there is no way to judge how big something is or how
 * far you have walked, so a gallery floor needs a grid. The obvious way to draw
 * one is `THREE.GridHelper`, which is what the Proving Ground used, and at
 * distance it **moirés**: the lines converge to well under a pixel, there is no
 * mipmap chain for line geometry to fall back on, and the pattern that comes
 * back is an interference fringe between the grid's spacing and the pixel grid.
 * `RenderPixelatedPass` at `pixelSize: 3` renders the scene at a third of the
 * display resolution, which makes the effect impossible to miss — the far grid
 * reads as smooth curves sweeping across the floor as you turn.
 *
 * Anisotropic filtering is the correct fix and it cannot be applied to lines,
 * because there is no texture being sampled. Drawn as a texture on the floor
 * instead, both halves of the problem are solved by the hardware: mipmaps
 * average the lines away as they shrink instead of aliasing them, and AF keeps
 * the minification from being taken along the wrong axis, which is what
 * otherwise smears a ground plane at grazing angles into mush.
 *
 * The texture is built as a `DataTexture` from arithmetic rather than drawn on
 * a canvas, because the headless checks reach this file through esbuild and
 * there is no `document` there.
 */

/** Metres covered by one repeat of the grid texture. */
const TILE = 4;
/** Texels across one tile. Power of two, so the mipmap chain is complete. */
const PIXELS = 256;
/** Texels per metre. */
const CELL = PIXELS / TILE;

/**
 * How dark the lines are, as a multiplier on the floor colour.
 *
 * The texture is white everywhere else, so the material's `color` still means
 * what it says and a colour picker pointed at it still works — a map multiplies
 * the colour rather than replacing it.
 */
const MINOR_TINT = 0.82;
const MAJOR_TINT = 0.6;

/**
 * Metres per collision quad.
 *
 * The same figure the Proving Ground settled on, and reached the same way: a
 * capsule on a plane does not care how that plane is triangulated, but the
 * collider's octree does. Two metres doubles the index cost for no behavioural
 * change; eight starts making the triangles large against the tree's leaves,
 * which is the problem the subdivision exists to avoid.
 */
const QUAD = 4;

/** Line half-widths in texels. A metre line lands around a centimetre wide. */
const MINOR_HALF = 0.6;
const MAJOR_HALF = 1.4;

/**
 * Coverage of one line by one texel, 0..1.
 *
 * Computed rather than stamped. A hard-edged line in the source texture is a
 * step function, and every mipmap level below the first is then an average of
 * an aliased signal — the moiré comes back at middle distance having been paid
 * for twice. Half a texel of falloff costs nothing and gives the chain
 * something band-limited to start from.
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
 * The shared grid map. One texture for every floor that wants one.
 *
 * Cached at module scope for the same reason the art kit shares one material:
 * a texture per zone is a texture uploaded per zone, and these are all
 * identical. Never disposed — `Zone.dispose` frees geometry and deliberately
 * leaves shared resources alone.
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
   * **Not eight, which is what this used to be, and which broke the collider.**
   * Two arguments pull in opposite directions here and only one of them is
   * obvious:
   *
   * - *Lighting* wants more than one. A Lambert surface interpolates across the
   *   face, so a single enormous quad lit by a hemisphere light is one gradient
   *   corner to corner and the floor visibly changes brightness as you cross
   *   it. Eight was chosen for this and is plenty.
   * - *The collider* wants a great many more, and this is the one that bites.
   *   The octree stores a triangle in **every cell it touches**, so a triangle
   *   spanning a third of the level is inserted into a large fraction of the
   *   tree. At eight segments over 280 m the quads are 35 m across, and
   *   indexing four such floors exhausted a 4 GB heap — the world check died
   *   with `Ineffective mark-compacts near heap limit`, which names the symptom
   *   and not the cause.
   *
   * So the note at the top of this file — that one flat quad is two triangles
   * and therefore free — is true of the *renderer* and false of the collider. A
   * flat floor is cheap because it is flat, not because it is undivided, and it
   * still has to be cut to roughly the size of the things that will be indexed
   * beside it. Four metres is the figure the Proving Ground arrived at
   * independently, for the same reason.
   */
  segments?: number;
  /** Set false for a floor the player should fall through. */
  collidable?: boolean;
  /**
   * Height of the surface. A centimetre below zero, and not by accident.
   *
   * The player is a capsule whose lowest point is exactly at its feet, and a
   * placement on flat ground puts those feet at the walkable plane. A floor
   * whose surface is *also* at that plane is therefore tangent to the capsule,
   * and tangency counts as an overlap — which reads downstream as "arrives
   * inside geometry", a spawn or a portal arrival rejected for standing on the
   * floor. `world-check` catches it; the symptom does not name the cause.
   *
   * Everything that walks here is clearance-settled well above a centimetre, so
   * the offset is invisible and costs nothing.
   */
  y?: number;
  /**
   * An existing material to use instead of building one.
   *
   * For the Proving Ground, whose floor material is shared with its live colour
   * picker. The grid map is attached to it either way, so a caller passing one
   * in gets the same floor and keeps its own handle on the colour.
   */
  material?: THREE.MeshLambertMaterial;
}

/**
 * A square of level, gridded ground, centred on the origin.
 *
 * Pair it with `groundAt: () => 0` and a `floor` well below zero on the zone
 * that uses it. Deliberately does not do painted ground cover, height
 * variation, or anything else the terrain system does: a gallery is a dev room
 * and should look like one.
 */
export function flatGround(size = 400, options: FlatGroundOptions = {}): THREE.Mesh {
  const segments = options.segments ?? Math.max(8, Math.round(size / QUAD));

  const geometry = new THREE.PlaneGeometry(size, size, segments, segments);
  geometry.rotateX(-Math.PI / 2);

  // The tiling is baked into the UVs rather than set as `repeat` on the
  // texture, so every floor in the game — at any size — shares one map with one
  // upload. `repeat` and `offset` live on the texture, so using them would mean
  // a texture per floor size, which is a GPU upload to save an attribute edit.
  //
  // Written in world units, so a grid line lands on x = 0 and z = 0 and a
  // gallery laid out on round numbers sits on the lines rather than between
  // them.
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
