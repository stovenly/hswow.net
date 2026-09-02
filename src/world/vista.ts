import * as THREE from 'three';
import { assemble, finish } from '../art/assemble';
import { markVista, landWash } from '../art/vista';
import { shade } from '../art/palette';
import { createRng } from '../art/random';
import type { MeshBuilder } from '../art/types';
import { vistaHill } from '../art/builders/vista-hill';
import { vistaCrag } from '../art/builders/vista-crag';
import { vistaForest } from '../art/builders/vista-forest';
import { vistaCopse } from '../art/builders/vista-copse';
import { vistaHamlet } from '../art/builders/vista-hamlet';
import { vistaTower } from '../art/builders/vista-tower';
import { vistaFieldWall } from '../art/builders/vista-field-wall';
import { vistaCastle } from '../art/builders/vista-castle';
import { vistaRange } from '../art/builders/vista-range';
import { GROUND, outlineDistance, shapeDistance, type PatchShape } from './ground';
import type { Terrain } from './terrain';

/**
 * The out-of-bounds world's ground, and the shape the level cuts out of it. The
 * roster is listed here rather than read off `art/registry`, which is Vite-only:
 * the headless checks reach this module through esbuild, and the ring placer wants
 * a palette to draw from anyway.
 */
export const VISTA_BUILDERS: readonly MeshBuilder[] = [
  vistaHill,
  vistaCrag,
  vistaForest,
  vistaCopse,
  vistaHamlet,
  vistaTower,
  vistaFieldWall,
  vistaCastle,
  vistaRange,
];

// ---------------------------------------------------------------------------
// The outline

/**
 * The shape of the level, for everything out here that has to know where it ends.
 * `PatchShape` rather than a type of its own: an outline is the same three shapes
 * ground materials and cover are already painted in, and a second vocabulary for
 * them would be one more thing to keep in agreement. A list is a union — nothing
 * here is subtractive, because a hole in the middle of a level is a hole the skirt
 * would have to fill upward, and the skirt runs underneath by construction.
 */
export type Outline = PatchShape;

/**
 * How far outside the level a point is. Negative inside. The one number the whole
 * band is written against — the collar, the apron, the band's edges and the
 * scatter's filter are all thresholds on it, which is what makes an S-shaped level
 * cost nothing extra. Shared with the terrain, which fades ground cover out
 * against the same field.
 */
export { outlineDistance };

/**
 * The nearest point on or inside the level, for sampling the ground there. Inside,
 * the point itself; outside, the closest point on the boundary of whichever shape
 * is nearest — so the skirt continues the level's own height outward rather than
 * falling off whatever the heightfield holds beyond its edge.
 */
export function outlineClamp(
  outline: readonly Outline[],
  x: number,
  z: number,
  out: THREE.Vector2,
): THREE.Vector2 {
  let best: Outline | null = null;
  let nearest = Infinity;
  for (const shape of outline) {
    const distance = shapeDistance(shape, x, z);
    if (distance < nearest) {
      nearest = distance;
      best = shape;
    }
  }
  if (!best || nearest <= 0) return out.set(x, z);

  switch (best.kind) {
    case 'blot': {
      const dx = x - best.at[0];
      const dz = z - best.at[1];
      const length = Math.hypot(dx, dz) || 1;
      return out.set(
        best.at[0] + (dx / length) * best.radius,
        best.at[1] + (dz / length) * best.radius,
      );
    }
    case 'field':
      return out.set(
        Math.min(Math.max(x, best.min[0]), best.max[0]),
        Math.min(Math.max(z, best.min[1]), best.max[1]),
      );
    case 'path': {
      // The closest point on the centre line, then out along the route's own
      // half-width toward the query — the surface of the capsule.
      let closest = { x: best.through[0][0], z: best.through[0][1] };
      let closestDistance = Infinity;
      for (let i = 0; i + 1 < best.through.length; i++) {
        const a = best.through[i];
        const b = best.through[i + 1];
        const dx = b[0] - a[0];
        const dz = b[1] - a[1];
        const lengthSquared = dx * dx + dz * dz;
        const t =
          lengthSquared === 0
            ? 0
            : Math.max(0, Math.min(1, ((x - a[0]) * dx + (z - a[1]) * dz) / lengthSquared));
        const px = a[0] + dx * t;
        const pz = a[1] + dz * t;
        const distance = Math.hypot(x - px, z - pz);
        if (distance < closestDistance) {
          closestDistance = distance;
          closest = { x: px, z: pz };
        }
      }
      const dx = x - closest.x;
      const dz = z - closest.z;
      const length = Math.hypot(dx, dz) || 1;
      const half = best.width / 2;
      return out.set(closest.x + (dx / length) * half, closest.z + (dz / length) * half);
    }
  }
}

/** The bounding box of an outline, grown by `margin`. */
export function outlineBounds(
  outline: readonly Outline[],
  margin: number,
): { min: [number, number]; max: [number, number] } {
  const min: [number, number] = [Infinity, Infinity];
  const max: [number, number] = [-Infinity, -Infinity];
  const grow = (x: number, z: number, pad: number): void => {
    min[0] = Math.min(min[0], x - pad);
    min[1] = Math.min(min[1], z - pad);
    max[0] = Math.max(max[0], x + pad);
    max[1] = Math.max(max[1], z + pad);
  };
  for (const shape of outline) {
    switch (shape.kind) {
      case 'blot':
        grow(shape.at[0], shape.at[1], shape.radius + margin);
        break;
      case 'path':
        for (const point of shape.through) grow(point[0], point[1], shape.width / 2 + margin);
        break;
      case 'field':
        grow(shape.min[0], shape.min[1], margin);
        grow(shape.max[0], shape.max[1], margin);
        break;
    }
  }
  return { min, max };
}

/**
 * The same region, grown outward by `by` metres — what a compact level's parallax
 * keep-out is. A bent level wants its keep-out drawn by hand instead, because the
 * interesting case is a shape no dilation produces.
 *
 * Exact for all three shapes, and each stays in the same vocabulary: a disc grows
 * its radius; a route grows its width by twice, since the width is measured
 * across; a rectangle becomes itself plus a rounded band traced round its
 * perimeter, whose union is the dilated rectangle exactly.
 */
export function dilateOutline(outline: readonly Outline[], by: number): Outline[] {
  const grown: Outline[] = [];
  for (const shape of outline) {
    switch (shape.kind) {
      case 'blot':
        grown.push({ ...shape, radius: shape.radius + by });
        break;
      case 'path':
        grown.push({ ...shape, width: shape.width + by * 2 });
        break;
      case 'field':
        grown.push(shape, {
          kind: 'path',
          through: [
            [shape.min[0], shape.min[1]],
            [shape.max[0], shape.min[1]],
            [shape.max[0], shape.max[1]],
            [shape.min[0], shape.max[1]],
            [shape.min[0], shape.min[1]],
          ],
          width: by * 2,
        });
        break;
    }
  }
  return grown;
}

/** The whole of a square terrain, as an outline. The default for a test level. */
export function terrainOutline(terrain: Terrain): Outline[] {
  const half = terrain.size / 2;
  return [{ kind: 'field', min: [-half, -half], max: [half, half] }];
}

// ---------------------------------------------------------------------------
// The skirt

/** Smootherstep, as the terrain uses — zero gradient at both ends. */
function ease(t: number): number {
  const x = t < 0 ? 0 : t > 1 ? 1 : t;
  return x * x * x * (x * (x * 6 - 15) + 10);
}

/**
 * Distant country, built around the level's own ground colour — centred on it, not
 * merely near it. The wash bunches toward the middle of its palette, so putting the
 * level's colour there makes the average skirt the same green as the field the
 * player is standing in, and the boundary stops being a place where the value
 * changes. A narrow spread either side: three greens this close give land variety
 * without giving it a pattern.
 */
function country(ground: number): readonly number[] {
  return [shade(ground, 0.8), ground, shade(ground, 1.1)];
}

export interface SkirtOptions {
  /** The level this runs underneath. Sampled across the boundary collar. */
  terrain: Terrain;
  /**
   * The level's shape. Defaults to the terrain's square, which is right for a
   * test level and wrong for anything winding — see `Outline`.
   */
  outline?: readonly Outline[];
  /**
   * How far past the level's outline the ground reaches. Measured from the outline
   * rather than the origin, because the player can be anywhere in the level and fog
   * is measured from where they stand. Past `fogFar` the last ring of vertices is
   * fully dissolved into horizon colour wherever it is seen from.
   */
  reach: number;
  /** Roughly metres between vertices. The grid lands exactly on its bounds. */
  resolution?: number;
  /** Metres inside the level's boundary over which the two have to agree. */
  collar?: number;
  /** Metres outside it over which the level falls away into open country. */
  apron?: number;
  /** How far below the level the skirt runs where it is hidden underneath it. */
  sink?: number;
  /**
   * How much the open country rolls, as a multiple of the authored waves. Zero is a
   * real answer and often the right one: ground outside the boundary that rises
   * above the level is a low ridge, which hides what is behind it and gathers the
   * whole remaining fog gradient into the few pixels at its crest. Three waves at up
   * to 3.6 m reach 7.5 m, which from an eye 1.35 m up is more than two degrees above
   * eye level at 160 m — a wall, drawn in ground.
   */
  roll?: number;
  /**
   * Radius of the world the ground pretends to sit on, in metres. Omitted, the sheet
   * is flat. Not a fix for the horizon step: bowing the ground away compresses the
   * visible band rather than spreading it, and it brings the true horizon in to
   * sqrt(2 R h), which at five kilometres is 116 m — close enough to hide the whole
   * band behind the bulge.
   */
  curve?: number;
  /**
   * Where the rolling ground gives out and the sheet goes dead flat. This exists for
   * the parallax props: a prop is dropped onto the skirt at build time and then
   * slides horizontally with the camera, so it ends up over ground it was never
   * measured against, and rolling several metres peak to peak lifts its footings
   * off. Flat ground cannot do that. Metres out from the outline, tapering between
   * the two; omitted, the ground rolls all the way out.
   */
  flatten?: { from: number; to: number };
  /**
   * What colour the distant land is, as sRGB hex.
   *
   * Defaults to the level's own base ground material, which is what it should
   * almost always be — see `country`.
   */
  ground?: number;
  seed: number;
}

/**
 * A coarse sheet of ground from well inside the level out past the fog. It runs
 * underneath the level, not up against it: the level is a lid laid on top, and only
 * a collar either side of the boundary has to agree in height. That is what makes
 * it indifferent to the level's shape — butting a ring against a square would leave
 * holes on the axes and overlaps into the corners.
 *
 * Resolution is brutal on purpose: this is value and silhouette, never walkable
 * ground. Not in the collider, never consulted by `surfaceAt`/`groundAt`, and
 * nothing grows on it.
 */
export class Skirt {
  readonly reach: number;
  readonly resolution: number;
  readonly outline: readonly Outline[];
  private readonly terrain: Terrain;
  private readonly collar: number;
  private readonly apron: number;
  private readonly sink: number;
  /** Broad rolling ground, at hundreds-of-metres wavelength. */
  private readonly waves: readonly {
    ax: number;
    az: number;
    length: number;
    phase: number;
    amp: number;
  }[];
  private readonly color: (x: number, y: number, z: number) => number;
  private readonly flatten: { from: number; to: number } | null;
  private readonly curve: number;
  private readonly roll: number;
  private readonly near = new THREE.Vector2();

  constructor(options: SkirtOptions) {
    this.terrain = options.terrain;
    this.outline = options.outline ?? terrainOutline(options.terrain);
    this.reach = options.reach;
    this.resolution = options.resolution ?? 9;
    this.collar = options.collar ?? 8;
    this.apron = options.apron ?? 24;
    this.sink = options.sink ?? 6;
    this.flatten = options.flatten ?? null;
    this.curve = options.curve ?? 0;
    this.roll = options.roll ?? 1;

    const rng = createRng(options.seed);
    // Long and shallow. The skirt is flat-shaded on a nine-metre grid, so every
    // degree of difference between neighbouring facets is a visible edge — short,
    // tall waves turn distant plains into a field of scales.
    this.waves = Array.from({ length: 3 }, () => {
      const angle = rng.range(0, Math.PI * 2);
      return {
        ax: Math.cos(angle),
        az: Math.sin(angle),
        length: rng.range(70, 165),
        phase: rng.range(0, Math.PI * 2),
        amp: rng.range(1.4, 3.6),
      };
    });
    const ground = options.ground ?? GROUND[options.terrain.baseMaterial].color;
    this.color = landWash(options.seed ^ 0x5417, country(ground), { scale: rng.range(150, 240) });
  }

  /** Open country, well away from the level. Flat past `flatten`. */
  private rolling(x: number, z: number): number {
    if (this.roll <= 0) return 0;
    let amount = this.roll;
    if (this.flatten) {
      const span = Math.max(this.flatten.to - this.flatten.from, 1e-6);
      amount = 1 - ease((this.outside(x, z) - this.flatten.from) / span);
      if (amount <= 0) return 0;
    }

    let height = 0;
    for (const wave of this.waves) {
      height += wave.amp * Math.sin((x * wave.ax + z * wave.az) / wave.length + wave.phase);
    }
    return height * amount;
  }

  /** How far outside the level a point is. Negative inside. */
  outside(x: number, z: number): number {
    return outlineDistance(this.outline, x, z);
  }

  /**
   * Ground height out here.
   *
   * On the outline itself both branches return the level's own height, so the
   * two meet exactly and there is no seam to hide.
   */
  heightAt(x: number, z: number): number {
    const distance = this.outside(x, z);
    outlineClamp(this.outline, x, z, this.near);
    const level = this.terrain.heightAt(this.near.x, this.near.y);

    if (distance <= 0) {
      // Under the lid. Falls away from the level so the two never z-fight, and
      // only the collar has to agree at all.
      return level - this.sink * ease(-distance / this.collar);
    }
    const open = level + (this.rolling(x, z) - level) * ease(distance / this.apron);
    // The world bending away underneath it. See `curve`.
    return this.curve > 0 ? open - (distance * distance) / (2 * this.curve) : open;
  }

  /**
   * One mesh, one draw, no collider. The grid is the outline's bounding box, and
   * every cell further than the reach from the outline is dropped — which is what
   * stops a winding level paying for the empty corners of its own bounding box.
   */
  build(): THREE.Mesh {
    const bounds = outlineBounds(this.outline, this.reach);
    const spanX = bounds.max[0] - bounds.min[0];
    const spanZ = bounds.max[1] - bounds.min[1];
    const cols = Math.max(2, Math.round(spanX / this.resolution));
    const rows = Math.max(2, Math.round(spanZ / this.resolution));
    const stepX = spanX / cols;
    const stepZ = spanZ / rows;

    // Kept if any corner is within reach — a cell straddling the edge has
    // to be drawn or the sheet ends in a staircase of missing quads.
    const kept = new Uint8Array(rows * cols);
    let count = 0;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x0 = bounds.min[0] + col * stepX;
        const z0 = bounds.min[1] + row * stepZ;
        const x1 = x0 + stepX;
        const z1 = z0 + stepZ;
        const near =
          this.outside(x0, z0) <= this.reach ||
          this.outside(x1, z0) <= this.reach ||
          this.outside(x0, z1) <= this.reach ||
          this.outside(x1, z1) <= this.reach;
        if (!near) continue;
        kept[row * cols + col] = 1;
        count++;
      }
    }

    const positions = new Float32Array(count * 18);
    let at = 0;
    const corner = (x: number, z: number): void => {
      positions[at] = x;
      positions[at + 1] = this.heightAt(x, z);
      positions[at + 2] = z;
      at += 3;
    };
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (!kept[row * cols + col]) continue;
        const x0 = bounds.min[0] + col * stepX;
        const z0 = bounds.min[1] + row * stepZ;
        const x1 = x0 + stepX;
        const z1 = z0 + stepZ;
        // One diagonal throughout, as the terrain does: a consistent split
        // gives the whole sheet one faceting direction.
        corner(x0, z0);
        corner(x0, z1);
        corner(x1, z1);
        corner(x0, z0);
        corner(x1, z1);
        corner(x1, z0);
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const merged = assemble([{ geometry, color: this.color, sway: 0 }]);
    return markVista(finish(merged, 'vista-skirt', 0));
  }
}
