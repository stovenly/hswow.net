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
 * The out-of-bounds world's ground, and the shape the level cuts out of it —
 * VISTA.md.
 *
 * The roster is listed here rather than read off `art/registry`, which is
 * Vite-only: the headless checks reach this module through esbuild, and the
 * ring placer wants a palette to draw from anyway.
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
 * The shape of the level, for everything out here that has to know where it
 * ends.
 *
 * **`PatchShape` rather than a type of its own**, and deliberately: an outline
 * is the same three shapes ground materials and cover are already painted in —
 * a route, a rough circle, a surveyed rectangle — and a second vocabulary for
 * the same three would be one more thing to keep in agreement. A winding level
 * is a `path` with a width; an L is two segments, an S three or four.
 *
 * A list is a union. Nothing here is subtractive, because a hole in the middle
 * of a level is a hole the skirt would have to fill *upward*, and the skirt runs
 * underneath by construction.
 */
export type Outline = PatchShape;

/**
 * How far outside the level a point is. Negative inside.
 *
 * The one number the whole band is written against — the collar, the apron, the
 * band's own edges and the scatter's filter are all thresholds on this. That is
 * what makes an S-shaped level cost nothing extra: the vista fills the crooks
 * because the distance field says the level is near there, not because anything
 * special-cases a bend. Shared with the terrain, which fades ground cover out
 * against the same field — see `world/ground.ts`.
 */
export { outlineDistance };

/**
 * The nearest point on or inside the level, for sampling the ground there.
 *
 * Inside, that is the point itself. Outside, it is the closest point on the
 * boundary of whichever shape is nearest — so the skirt continues the level's
 * own height outward rather than falling off whatever the heightfield happens
 * to hold beyond its edge.
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
 * The same region, grown outward by `by` metres.
 *
 * What a compact level's parallax keep-out is: the outline dilated by whatever
 * the still band reaches, so nothing that moves can be dragged in among things
 * that do not. A bent level wants its keep-out drawn by hand instead — the
 * interesting case is a shape no dilation produces, like the cup between the
 * arms of a Y — which is why this is a helper and not what the ring does for
 * you.
 *
 * Exact for all three shapes, and each stays in the same vocabulary:
 *
 * - A disc grows its radius.
 * - A route grows its width, by twice — the width is measured across.
 * - A rectangle becomes itself plus a rounded band traced round its perimeter.
 *   The union is the dilated rectangle exactly; the band alone would leave the
 *   middle uncovered on anything wider than `by`.
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
 * Distant country, built around the level's own ground colour.
 *
 * **Centred on it, not merely near it.** The wash bunches toward the middle of
 * its palette, so putting the level's colour there makes the *average* skirt the
 * same green as the field the player is standing in — and the boundary stops
 * being a place where the value changes. A fixed palette had the skirt
 * averaging a full step darker than the turf, which drew the exact line the
 * band exists to hide, and no amount of dressing in front of it helps when the
 * two sides of the seam are different colours.
 *
 * A narrow spread either side, because three greens this close give land
 * variety without giving it a pattern. It was four colours ending in bare
 * earth, which at this scale reads as a quilt however smoothly it is blended.
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
   * How far past the level's outline the ground reaches.
   *
   * Measured from the *outline* rather than from the origin, because the player
   * can be anywhere in the level and fog is measured from where they stand. Past
   * `fogFar` means the last ring of vertices is fully dissolved into horizon
   * colour wherever it is seen from, and no rim can ever show.
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
   * How much the open country rolls, as a multiple of the authored waves.
   *
   * **Zero is a real answer and often the right one.** Ground outside the
   * boundary that rises above the level is a low ridge, and a low ridge close
   * to the player is the worst thing that can happen to a vista: it hides what
   * is behind it, and it gathers the whole remaining fog gradient into the few
   * pixels at its crest, where there is no room for a gradient at all. Three
   * waves at up to 3.6 m each reach 7.5 m, which from an eye 1.35 m up is more
   * than two degrees *above* eye level at 160 m — a wall, drawn in ground.
   *
   * Level with the walkable terrain, none of that happens: the horizon is where
   * it should be, everything in the band stands clear of it, and the fog has
   * the whole of the ground plane to fade across instead of one crest line.
   */
  roll?: number;
  /**
   * Radius of the world the ground pretends to sit on, in metres. Omitted, the
   * sheet is flat.
   *
   * **Not a fix for the horizon step, and it was tried as one.** Bowing the
   * ground away compresses the visible band rather than spreading it: near
   * ground hardly moves and far ground drops a long way, so the two converge in
   * angle. Measured over the 70–240 m fog ramp it took 0.78 degrees down to
   * 0.19. It also brings the true horizon in to sqrt(2 R h), which at five
   * kilometres is 116 m — close enough to hide the whole band behind the
   * bulge. Kept because a very large radius is a real thing a level might want;
   * do not reach for it to solve a gradient.
   */
  curve?: number;
  /**
   * Where the rolling ground gives out and the sheet goes dead flat.
   *
   * **This exists for the parallax props, and it is not cosmetic.** A prop is
   * dropped onto the skirt at build time and then slides horizontally with the
   * camera, so it ends up over ground it was never measured against — and the
   * rolling is several metres peak to peak, so its footings lift off and you
   * see straight under them. Flat ground cannot do that: every point out there
   * is the same height, so a prop may slide as far as it likes and still meet
   * it exactly.
   *
   * Costs nothing to look at. Everything past this distance is most of the way
   * to the fog's end, where the ground is a value and not a shape.
   *
   * Metres out from the outline, tapering between the two. Omitted, the ground
   * rolls all the way out, which is right for a level with nothing moving.
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
 * A coarse sheet of ground from well inside the level out past the fog.
 *
 * **It runs underneath the level, not up against it.** The level is a lid laid
 * on top; only a collar either side of the boundary has to agree in height, and
 * everywhere further in the skirt is hidden and free to be wrong. That is what
 * makes it indifferent to the level's *shape* — square, ring, L or S — and it
 * is why generalising from a square cost one distance function rather than a
 * rewrite. Butting a ring against a square would have left holes on the axes
 * and overlaps into the corners; running underneath has no such case.
 *
 * Resolution is brutal on purpose: this is value and silhouette, never walkable
 * ground. It is not in the collider, `surfaceAt`/`groundAt` never consult it,
 * and nothing grows on it — field colour is vertex colour on the skirt itself.
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
    // **Long and shallow.** The skirt is flat-shaded on a nine-metre grid, so
    // every degree of difference between neighbouring facets is a visible edge
    // — short, tall waves turn distant plains into a field of scales. Stretched
    // out and flattened, adjacent faces very nearly agree and the ground reads
    // as ground.
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
   * One mesh, one draw, no collider.
   *
   * The grid is the outline's bounding box, and every cell further than the
   * reach from the outline is dropped. That is what stops a winding level
   * paying for the empty corners of its own bounding box — an S in an
   * 800 × 800 box would otherwise be mostly ground nobody can see.
   */
  build(): THREE.Mesh {
    const bounds = outlineBounds(this.outline, this.reach);
    const spanX = bounds.max[0] - bounds.min[0];
    const spanZ = bounds.max[1] - bounds.min[1];
    const cols = Math.max(2, Math.round(spanX / this.resolution));
    const rows = Math.max(2, Math.round(spanZ / this.resolution));
    const stepX = spanX / cols;
    const stepZ = spanZ / rows;

    const positions: number[] = [];
    const corner = (x: number, z: number): void => {
      positions.push(x, this.heightAt(x, z), z);
    };

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x0 = bounds.min[0] + col * stepX;
        const z0 = bounds.min[1] + row * stepZ;
        const x1 = x0 + stepX;
        const z1 = z0 + stepZ;
        // Kept if any corner is within reach — a cell straddling the edge has
        // to be drawn or the sheet ends in a staircase of missing quads.
        const near =
          this.outside(x0, z0) <= this.reach ||
          this.outside(x1, z0) <= this.reach ||
          this.outside(x0, z1) <= this.reach ||
          this.outside(x1, z1) <= this.reach;
        if (!near) continue;

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
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    const merged = assemble([{ geometry, color: this.color, sway: 0 }]);
    return markVista(finish(merged, 'vista-skirt', 0));
  }
}
