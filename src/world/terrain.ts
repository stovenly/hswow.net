import * as THREE from 'three';
import { SWAY_ATTRIBUTE, finish } from '../art/assemble';
import { COVER_ATTRIBUTE, COVER_BLEND_ATTRIBUTE } from '../art/cover';
import { shade } from '../art/palette';
import {
  GROUND,
  COVER,
  COVER_ORDER,
  patchAt,
  coverPatchAt,
  coverPatchWinner,
  coverSwell,
  coverThickness,
  groundJitter,
  type GroundName,
  type GroundPatch,
  type CoverPatch,
  type CoverName,
} from './ground';
import type { SurfaceName } from '../audio/models/footsteps';

/**
 * Authored terrain: a heightfield summed from placed landforms.
 *
 * **Not noise.** The locked design says the exterior is hand-authored, and this
 * is how: every bump in the ground is a shape somebody put there on purpose,
 * listed in data. A hill is a position, a radius and a height. Building the
 * field is just adding those up.
 *
 * The alternative was a grid of control points — sixteen by sixteen, or two
 * hundred and fifty-six numbers, and a bigger zone needs proportionally more.
 * That is unreadable to edit and impossible to review: nobody can look at a
 * block of decimals and see a valley in it. Landforms are legible as text,
 * cheap to move, and they are the same list a Phase 6 editor would drag around.
 *
 * ## The rim is the boundary
 *
 * There is no invisible wall and no fence. The `rim` landform lifts the outer
 * ring of the map past the controller's slope limit, so walking at the edge of
 * the world means walking up a slope that gets steeper until you slide back
 * down it. That is the "ringed by natural barriers" in the design, made of the
 * same triangles as everything else — nothing special in the collider, nothing
 * to fall through, and it looks like hills because it is hills.
 *
 * The check asserts it actually holds: a ray of samples inward from every point
 * around the boundary has to cross at least one stretch steeper than the limit.
 */

export type Landform =
  /** A rounded rise. `falloff` above 1 makes it peakier, below 1 flatter-topped. */
  | { kind: 'hill'; at: [number, number]; radius: number; height: number; falloff?: number }
  /** A raised line between two points — an esker, a spine, a bank. */
  | { kind: 'ridge'; from: [number, number]; to: [number, number]; width: number; height: number }
  /** A rounded hollow. Somewhere to put things. */
  | { kind: 'basin'; at: [number, number]; radius: number; depth: number }
  /**
   * The wall of hills around the edge.
   *
   * `inset` is how far in from the boundary it starts climbing — short insets
   * give steep, cliff-like sides, long ones give a gentle bowl you can walk a
   * long way up before it turns you back.
   */
  | { kind: 'rim'; inset: number; height: number }
  /**
   * Level ground, for building on.
   *
   * **The one landform that is not additive.** Everything else adds to the
   * height; this *replaces* it, forcing the ground to `height` inside `radius`
   * and easing back to whatever the rest of the landforms wanted over `blend`.
   *
   * It exists because buildings are rigid and ground is not. A hut is placed at
   * a single point and stands square, so on ground that falls even a little
   * across its footprint one corner buries itself and the opposite corner
   * floats — which is exactly what happened to the first village. Nudging the
   * placement cannot fix that; the building needs somewhere flat to be, so the
   * flat place is authored like anything else.
   *
   * Applied after the additive pass, in list order, so a later terrace can cut
   * a step into an earlier one.
   */
  | { kind: 'terrace'; at: [number, number]; radius: number; height: number; blend: number };

/** A circle in which the base grid is subdivided further. */
export interface DetailRegion {
  at: readonly [number, number];
  radius: number;
  /** Sub-quads per base quad edge. 2 halves them, 4 quarters them. */
  level: number;
}

export interface TerrainOptions {
  /** Metres across. The field is square and centred on the origin. */
  size: number;
  /** Metres per quad. Also the collision resolution — they are the same mesh. */
  resolution: number;
  landforms: readonly Landform[];
  /**
   * Places the grid is subdivided further.
   *
   * One resolution for a whole map is a compromise made everywhere at once:
   * fine enough for a two-metre street to have straight edges is far finer than
   * a bare hillside will ever need, and paying for it across the map is most of
   * the cost for none of the benefit. A village square wants sub-metre quads,
   * the hills behind it do not care, and this is how to say so.
   *
   * **Put the edges of these on gentle ground.** Stitching closes the geometric
   * seam — there is no gap — but nothing can hide a change in *facet size* on a
   * steep slope: big facets and small facets approximate a curve with different
   * normals, and under flat shading two different normals meeting along a line
   * is a line you can see. On flat ground every facet points straight up
   * whatever its size, so the boundary vanishes. A ring that happened to cross
   * the map's rim at 61° drew exactly this, and it looked like a crack.
   */
  detail?: readonly DetailRegion[];
  /**
   * Ground cover, painted over the shape. Later patches win.
   *
   * Optional — a field with none is all turf, which is fine for a test slope
   * and wrong for anywhere anybody lives.
   */
  patches?: readonly GroundPatch[];
  /**
   * Cover painted over the automatic result. Later patches win.
   *
   * Most ground grows what its material says it grows — see `COVER` in
   * `world/ground.ts`. This is for the cases a material cannot state: clover in
   * one hollow, moss along one wall, a clearing trodden bare.
   */
  cover?: readonly CoverPatch[];
  /** Slope in degrees past which a face falls back to rock, whatever is painted. */
  rockAngle?: number;
  /** What unpainted, unsteep ground is made of. */
  base?: GroundName;
}

/** Smootherstep: zero gradient at both ends, so landforms blend without creases. */
function ease(t: number): number {
  const x = t < 0 ? 0 : t > 1 ? 1 : t;
  return x * x * x * (x * (x * 6 - 15) + 10);
}

/** Shortest distance from a point to a line segment, in the XZ plane. */
function toSegment(x: number, z: number, ax: number, az: number, bx: number, bz: number): number {
  const dx = bx - ax;
  const dz = bz - az;
  const lengthSquared = dx * dx + dz * dz;
  const t = lengthSquared === 0 ? 0 : Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / lengthSquared));
  return Math.hypot(x - (ax + dx * t), z - (az + dz * t));
}

export class Terrain {
  readonly size: number;
  readonly resolution: number;
  private readonly landforms: readonly Landform[];
  private readonly patches: readonly GroundPatch[];
  private readonly cover: readonly CoverPatch[];
  private readonly detail: readonly DetailRegion[];
  private readonly rockAngle: number;
  private readonly base: GroundName;

  constructor(options: TerrainOptions) {
    this.size = options.size;
    this.resolution = options.resolution;
    this.landforms = options.landforms;
    this.patches = options.patches ?? [];
    this.cover = options.cover ?? [];
    this.detail = options.detail ?? [];
    this.rockAngle = options.rockAngle ?? 34;
    this.base = options.base ?? 'turf';
  }

  /**
   * Ground height at a world position.
   *
   * The authority for everything: the mesh is sampled from it, props are
   * dropped onto it, and the checks measure it. Cheap enough to call per prop
   * per build — it is a handful of distance calculations — but it is called
   * once per vertex when building the mesh, so nothing expensive belongs here.
   */
  heightAt(x: number, z: number): number {
    let height = 0;

    for (const form of this.landforms) {
      switch (form.kind) {
        // Handled in the second pass — it replaces rather than adds.
        case 'terrace':
          break;
        case 'hill': {
          const d = Math.hypot(x - form.at[0], z - form.at[1]);
          const t = ease(1 - d / form.radius);
          height += form.height * (form.falloff ? t ** form.falloff : t);
          break;
        }
        case 'ridge': {
          const d = toSegment(x, z, form.from[0], form.from[1], form.to[0], form.to[1]);
          height += form.height * ease(1 - d / form.width);
          break;
        }
        case 'basin': {
          const d = Math.hypot(x - form.at[0], z - form.at[1]);
          height -= form.depth * ease(1 - d / form.radius);
          break;
        }
        case 'rim': {
          // Chebyshev distance to the edge, so the rim follows the square
          // boundary instead of being a circle inscribed in it — which would
          // leave four walkable corners straight out of the map.
          const half = this.size / 2;
          const edge = half - Math.max(Math.abs(x), Math.abs(z));
          height += form.height * ease(1 - edge / form.inset);
          break;
        }
      }
    }

    // Second pass: levelling. Separate from the sum above because blending
    // toward a target is not something that can be added in — a terrace has to
    // know what the ground would otherwise have been in order to replace it.
    for (const form of this.landforms) {
      if (form.kind !== 'terrace') continue;
      const d = Math.hypot(x - form.at[0], z - form.at[1]);
      if (d >= form.radius + form.blend) continue;
      const w = d <= form.radius ? 1 : ease((form.radius + form.blend - d) / form.blend);
      height = height * (1 - w) + form.height * w;
    }

    return height;
  }

  /** The detail regions, so the check can measure the ground under their edges. */
  get detailRegions(): readonly DetailRegion[] {
    return this.detail;
  }

  /** Steepest slope at a position, in degrees. Sampled, not analytic. */
  slopeAt(x: number, z: number, step = this.resolution): number {
    const dx = (this.heightAt(x + step, z) - this.heightAt(x - step, z)) / (2 * step);
    const dz = (this.heightAt(x, z + step) - this.heightAt(x, z - step)) / (2 * step);
    return (Math.atan(Math.hypot(dx, dz)) * 180) / Math.PI;
  }

  /**
   * Builds the visible and collidable mesh. They are the same triangles.
   *
   * Split into two meshes would mean the player walking on a surface they
   * cannot see the shape of, which on a slope is the difference between a hill
   * and a bug report.
   *
   * ## Variable density, and the seams it would otherwise open
   *
   * Cells inside a `detail` region are subdivided. That is the only way to get a
   * straight-edged two-metre street without paying for sub-metre quads across a
   * whole map of empty hillside — at the base resolution a street is about one
   * quad wide and its edges zigzag along whatever the grid happened to do, which
   * is what makes a village square look like a pile of triangles.
   *
   * Subdividing unevenly opens **T-junctions**. A fine cell has vertices along
   * its border that its coarse neighbour has never heard of, and since those
   * vertices sit on the true surface while the neighbour's edge is a straight
   * line between two corners, any curvature pulls them apart and daylight shows
   * through the crack.
   *
   * The fix is to make border vertices lie. A vertex on an edge shared with a
   * coarser neighbour takes its height from *that edge as the neighbour draws
   * it*, interpolated between the neighbour's own samples, rather than from the
   * surface. Both sides then describe the same line and meet exactly. Corners
   * need no special case: at either end of an edge the interpolation lands on a
   * real sample anyway.
   *
   * Built by hand rather than through `assemble`, because face colour here
   * depends on the face *normal* — flat ground is turf, steep ground is rock —
   * and `assemble` only offers the centroid position.
   */
  build(): THREE.Mesh {
    const cells = Math.round(this.size / this.resolution);
    const half = this.size / 2;
    const res = this.resolution;

    // Subdivision per base cell, decided up front so neighbours can be asked.
    const levels = new Uint8Array(cells * cells);
    for (let row = 0; row < cells; row++) {
      for (let col = 0; col < cells; col++) {
        const cx = -half + (col + 0.5) * res;
        const cz = -half + (row + 0.5) * res;
        let best = 1;
        for (const region of this.detail) {
          if (Math.hypot(cx - region.at[0], cz - region.at[1]) <= region.radius) {
            best = Math.max(best, region.level);
          }
        }
        levels[row * cells + col] = best;
      }
    }
    // Off the map counts as coarse, which is right: there is nothing there.
    const levelAt = (row: number, col: number): number =>
      row < 0 || col < 0 || row >= cells || col >= cells ? 1 : levels[row * cells + col];

    const positions: number[] = [];
    const normals: number[] = [];
    const colors: number[] = [];
    // Type, feather, and the two broad fields, per vertex, for the cover sampler.
    const covers: number[] = [];
    // And who the neighbour across a boundary is, with how much of it to mix in.
    const blends: number[] = [];

    const a = new THREE.Vector3();
    const b = new THREE.Vector3();
    const c = new THREE.Vector3();
    const ab = new THREE.Vector3();
    const ac = new THREE.Vector3();
    const normal = new THREE.Vector3();
    const color = new THREE.Color();

    const emit = (p: THREE.Vector3, n: THREE.Vector3): void => {
      positions.push(p.x, p.y, p.z);
      normals.push(n.x, n.y, n.z);
      colors.push(color.r, color.g, color.b);
    };

    for (let row = 0; row < cells; row++) {
      for (let col = 0; col < cells; col++) {
        const n = levels[row * cells + col];
        const x0 = -half + col * res;
        const z0 = -half + row * res;

        const west = levelAt(row, col - 1);
        const east = levelAt(row, col + 1);
        const north = levelAt(row - 1, col);
        const south = levelAt(row + 1, col);

        // Height inside this cell in local 0..1 coordinates, deferring to a
        // coarser neighbour along any shared border. See the note above.
        const at = (u: number, v: number): number => {
          if (u === 0 && west < n) return this.alongEdge(x0, z0, x0, z0 + res, v, west);
          if (u === 1 && east < n) return this.alongEdge(x0 + res, z0, x0 + res, z0 + res, v, east);
          if (v === 0 && north < n) return this.alongEdge(x0, z0, x0 + res, z0, u, north);
          if (v === 1 && south < n) return this.alongEdge(x0, z0 + res, x0 + res, z0 + res, u, south);
          return this.heightAt(x0 + u * res, z0 + v * res);
        };

        for (let sv = 0; sv < n; sv++) {
          for (let su = 0; su < n; su++) {
            const u0 = su / n;
            const u1 = (su + 1) / n;
            const v0 = sv / n;
            const v1 = (sv + 1) / n;

            // Two triangles per quad, split along the same diagonal
            // throughout. A consistent split gives the field one faceting
            // direction, which reads as deliberate; alternating looks woven.
            const corners: [number, number, number][] = [
              [x0 + u0 * res, at(u0, v0), z0 + v0 * res],
              [x0 + u0 * res, at(u0, v1), z0 + v1 * res],
              [x0 + u1 * res, at(u1, v1), z0 + v1 * res],
              [x0 + u1 * res, at(u1, v0), z0 + v0 * res],
            ];

            for (const [p, q, r] of [
              [0, 1, 2],
              [0, 2, 3],
            ]) {
              a.set(...corners[p]);
              b.set(...corners[q]);
              c.set(...corners[r]);
              ab.subVectors(b, a);
              ac.subVectors(c, a);
              normal.crossVectors(ab, ac).normalize();
              if (normal.y < 0) normal.negate();

              const midX = (a.x + b.x + c.x) / 3;
              const midZ = (a.z + b.z + c.z) / 3;
              const name = this.faceMaterial(normal.y, midX, midZ);
              color.set(this.faceColor(name, (a.y + b.y + c.y) / 3, midX, midZ));
              // Type per face, so its edges stay hard; feather and blend per
              // corner, so they interpolate — cover runs out onto bare ground
              // over a couple of metres, and two grown types interleave at
              // their boundary instead of thinning to a gap.
              const cover = this.faceCover(name, midX, midZ);
              for (const corner of [a, b, c]) {
                const [feather, neighbor, blend] = this.coverEdge(cover, corner.x, corner.z);
                covers.push(
                  cover,
                  feather,
                  coverSwell(corner.x, corner.z),
                  coverThickness(corner.x, corner.z),
                );
                blends.push(neighbor, blend);
              }
              emit(a, normal);
              emit(b, normal);
              emit(c, normal);
            }
          }
        }
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    // Ground does not move in the wind. The attribute still has to exist —
    // Phase 7 patches one shared material, and a mesh missing the attribute it
    // reads is a mesh that fails to draw.
    geometry.setAttribute(
      SWAY_ATTRIBUTE,
      new THREE.Float32BufferAttribute(new Float32Array(positions.length / 3), 1),
    );
    // Read by the cover sampler on the CPU and by nothing else. The ground's
    // own material never declares it, so it costs a buffer and no draw.
    geometry.setAttribute(COVER_ATTRIBUTE, new THREE.Float32BufferAttribute(covers, 4));
    geometry.setAttribute(COVER_BLEND_ATTRIBUTE, new THREE.Float32BufferAttribute(blends, 2));

    return finish(geometry, 'terrain', 0);
  }

  /**
   * Height along an edge as a mesh subdivided `level` times would draw it.
   *
   * The stitching primitive. Instead of sampling the surface at `t`, this finds
   * the segment of the coarser neighbour's edge that `t` falls in and
   * interpolates between its endpoints — so a fine vertex lands exactly on the
   * straight line the neighbour is already drawing, and the seam closes.
   */
  private alongEdge(
    x0: number,
    z0: number,
    x1: number,
    z1: number,
    t: number,
    level: number,
  ): number {
    const span = 1 / level;
    const i = Math.min(level - 1, Math.floor(t / span));
    const ta = i * span;
    const tb = ta + span;
    const ha = this.heightAt(x0 + (x1 - x0) * ta, z0 + (z1 - z0) * ta);
    const hb = this.heightAt(x0 + (x1 - x0) * tb, z0 + (z1 - z0) * tb);
    return ha + (hb - ha) * ((t - ta) / span);
  }

  /**
   * Which ground material covers a position.
   *
   * Steep ground overrides whatever is painted on it. That is not a shortcut:
   * a cobbled yard laid across a forty-degree bank is not a cobbled yard, it is
   * a cliff, and a path drawn straight up one should turn to rock where it gets
   * too steep to have been laid. Making slope win means patches can be drawn
   * carelessly across a hillside and still come out looking sensible.
   */
  materialAt(x: number, z: number): GroundName {
    if (this.slopeAt(x, z) > this.rockAngle) return 'rock';
    return patchAt(this.patches, x, z) ?? this.base;
  }

  /** What the ground here sounds like underfoot. Read per footstep. */
  stepAt(x: number, z: number): SurfaceName {
    return GROUND[this.materialAt(x, z)].step;
  }

  /**
   * What grows here. A painted patch wins over whatever the material grows.
   *
   * The mesh does not read this — `build` asks the same question per face off
   * the face normal, which is cheaper and cannot disagree with the shading. It
   * is here so the checks and the debug panel can ask without a mesh.
   */
  coverAt(x: number, z: number): CoverName {
    return coverPatchAt(this.cover, x, z) ?? COVER[this.materialAt(x, z)] ?? 'none';
  }

  /**
   * Which material one face is made of.
   *
   * Slope is taken from the face normal rather than resampled, because the
   * normal is what the light will actually use — deciding a face is turf while
   * shading it as a cliff is the sort of disagreement that looks like a bug in
   * the lighting. Asked once per face and answered for the colour and the
   * cover together, so the grass cannot disagree with the ground it stands on.
   */
  private faceMaterial(normalY: number, x: number, z: number): GroundName {
    const slope = (Math.acos(Math.min(1, Math.max(-1, normalY))) * 180) / Math.PI;
    return slope > this.rockAngle ? 'rock' : (patchAt(this.patches, x, z) ?? this.base);
  }

  /**
   * Colour for one face: its material, jittered, and darkened a little with
   * height so the high ground reads as further away and colder.
   */
  private faceColor(name: GroundName, height: number, x: number, z: number): number {
    const material = GROUND[name];

    // Centred on 1, so variation brightens as often as it darkens and the
    // material's stated colour stays its average.
    const jitter = 1 + (groundJitter(x, z) - 0.5) * material.variation * 2;
    const cooling = 1 - Math.min(Math.max(height / 55, 0), 1) * 0.16;
    return shade(material.color, jitter * cooling);
  }

  /** What one face grows, as a cover type index. A patch wins outright. */
  private faceCover(name: GroundName, x: number, z: number): number {
    const painted = coverPatchAt(this.cover, x, z);
    return COVER_ORDER.indexOf(painted ?? COVER[name] ?? 'none');
  }

  /** The cover at a probe point, and whether a hard-edged patch put it there. */
  private coverThere(x: number, z: number): { index: number; hard: boolean } {
    const patch = coverPatchWinner(this.cover, x, z);
    if (patch) return { index: COVER_ORDER.indexOf(patch.cover), hard: patch.edge === 'hard' };
    const name = COVER[patchAt(this.patches, x, z) ?? this.base] ?? 'none';
    return { index: COVER_ORDER.indexOf(name), hard: false };
  }

  /**
   * What happens to the cover at a corner: [feather, neighbour, blend].
   *
   * Rings of probes rather than a distance field — enough to know what
   * surrounds a point. Feather thins density, and only toward *bare* ground,
   * so grass runs out onto a path as a scatter; between two grown types the
   * density holds and `blend` takes over — how much of this corner's cover
   * should be rolled as the neighbouring type instead, so a boundary is an
   * interleaved band rather than a line or a gap. A `hard` patch opts out of
   * both, from both sides. Slope is left out, so the rock line on a cliff
   * stays hard — it is a cliff.
   */
  private coverEdge(cover: number, x: number, z: number): [number, number, number] {
    const own = coverPatchWinner(this.cover, x, z);
    if (own?.edge === 'hard') return [1, 0, 0];

    let same = 0;
    for (let i = 0; i < FEATHER_PROBES; i++) {
      const angle = (i / FEATHER_PROBES) * Math.PI * 2;
      const there = this.coverThere(
        x + Math.cos(angle) * FEATHER_REACH,
        z + Math.sin(angle) * FEATHER_REACH,
      );
      if (there.index === cover || there.index > 0 || there.hard) same++;
    }
    // Remapped so a point on the boundary, where half its ring disagrees, comes
    // out near nothing rather than near half.
    const feather = Math.min(Math.max((same / FEATHER_PROBES - 0.45) / 0.55, 0), 1);

    const votes = new Map<number, number>();
    for (let i = 0; i < BLEND_PROBES; i++) {
      const angle = ((i + 0.5) / BLEND_PROBES) * Math.PI * 2;
      const there = this.coverThere(
        x + Math.cos(angle) * BLEND_REACH,
        z + Math.sin(angle) * BLEND_REACH,
      );
      if (there.index > 0 && there.index !== cover && !there.hard) {
        votes.set(there.index, (votes.get(there.index) ?? 0) + 1);
      }
    }
    let neighbor = 0;
    let best = 0;
    for (const [index, count] of votes) {
      if (count > best) {
        best = count;
        neighbor = index;
      }
    }
    // Capped: a strip narrower than the ring keeps at least half its own kind.
    return [feather, neighbor, Math.min(best / BLEND_PROBES, 0.5)];
  }
}

/** How far out the feather looks, and how many ways. */
const FEATHER_REACH = 0.9;
const FEATHER_PROBES = 8;
/** The blend looks further: an interleaved boundary is a band, not a seam. */
const BLEND_REACH = 1.8;
const BLEND_PROBES = 10;
