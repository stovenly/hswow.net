import * as THREE from 'three';
import type { Part } from './assemble';
import type { Rng } from './random';
import { PALETTE, shade } from './palette';

/**
 * Walls, piers and arches: stone laid by hand.
 *
 * Shared by `stone-wall`, `stone-wall-column` and `archway`, because they are
 * the same masonry at three sizes and a wall that did not match the gate beside
 * it would be worse than either.
 *
 * ## A face is split, then warped
 *
 * A face starts as one polygon and is cut in two, over and over, until the
 * pieces are near stone size, at whatever angle the piece wants. That gets
 * convex cells of every shape and orientation which still share their edges
 * exactly — but every edge is dead straight, and a cut made early in the
 * sequence leaves a run of collinear edges right across the wall that reads as a
 * crack rather than as masonry.
 *
 * So every vertex is then moved by a **smooth field of position**. Two things
 * fall out of doing it that way and both are the point:
 *
 * - Cells still tile. Two cells meeting at a vertex read the field at the same
 *   place and move together.
 * - Long edges are chopped first, so a line that ran a third of a metre without
 *   a joint in it now has several, and each of them moves by a different amount.
 *
 * Where an edge has a junction on one side and not the other the two disagree
 * slightly, and that is wanted too: it varies the width of the joint, which is
 * the last thing about a hand-built wall a regular tiling cannot fake. The
 * disagreement is bounded by the size of the warp, which is smaller than a
 * joint.
 *
 * ## A stone's outline lies in the face
 *
 * It is the widest part of the stone and the thing that reads as masonry, so it
 * sits at the surface, with a flat crown a couple of centimetres proud and the
 * rest tailing back into the hearting where nobody sees it. Put that outline
 * anywhere else — half way through the wall, say — and every stone is a lump on
 * a flat slab.
 *
 * ## Corners are their own stones
 *
 * Two skins bedded on two perpendicular faces both want the same corner of
 * space, and if both are allowed it they poke through each other the whole way
 * up. Quoins are what a mason does about that and what `quoinedPier` does here:
 * the corners are squared stones, a course at a time, and the panels stop short
 * of them.
 */

/** How far a face stone stands out from the hearting behind it. */
export const SKIN = 0.05;

export interface Point {
  x: number;
  y: number;
}

/** A patch of a face, waiting for a stone. Shares its edges with its neighbours. */
export type Cell = Point[];

/** How wide the joints are, and how far the stones are worn back off them. */
export interface Pointing {
  joint: number;
  chamfer: number;
}

export function centroid(cell: Cell): Point {
  let x = 0;
  let y = 0;
  for (const p of cell) {
    x += p.x;
    y += p.y;
  }
  return { x: x / cell.length, y: y / cell.length };
}

/** Half of a convex polygon, on the side of `n · p <= c`. */
function clip(cell: Cell, nx: number, ny: number, c: number, keepBelow: boolean): Cell {
  const inside = (p: Point): boolean =>
    keepBelow ? nx * p.x + ny * p.y <= c : nx * p.x + ny * p.y >= c;
  const out: Cell = [];
  for (let i = 0; i < cell.length; i++) {
    const a = cell[i];
    const b = cell[(i + 1) % cell.length];
    const ina = inside(a);
    const inb = inside(b);
    if (ina) out.push(a);
    if (ina !== inb) {
      const da = nx * a.x + ny * a.y - c;
      const db = nx * b.x + ny * b.y - c;
      const t = da / (da - db);
      out.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
    }
  }
  return out;
}

function area(cell: Cell): number {
  let twice = 0;
  for (let i = 0; i < cell.length; i++) {
    const a = cell[i];
    const b = cell[(i + 1) % cell.length];
    twice += a.x * b.y - b.x * a.y;
  }
  return Math.abs(twice) / 2;
}

/**
 * Cells from scattered stones: every cell is the patch of face nearer to its own
 * stone than to any other.
 *
 * **Splitting a face cannot help leaving seams and this can.** Cut a rectangle
 * in two and the joint you made runs the whole way across it; cut the halves and
 * those joints run the whole way across a half. Warping bends such a line and
 * chopping breaks it into segments, but it is still one joint from one side of
 * the wall to the other, and the eye follows it. Splitting is hierarchical and a
 * wall is not.
 *
 * Sites have no hierarchy. Two stones share exactly one joint, and it is as long
 * as the two of them and no longer — in any direction. There is nothing left for
 * a seam to run along.
 *
 * Size comes from how close a stone was allowed to sit to the ones already down:
 * the clearance is rolled per stone, so some crowd in small and some take a wide
 * berth, which is the size variation a wall wants. Rejecting crowded ones at all
 * is what makes it *evenly* random — points thrown down with no clearance clump,
 * and a clump of sites is a cluster of splinters.
 */
export function scatter(
  rng: Rng,
  bounds: Cell,
  sizeAt: (y: number) => number,
  out: Cell[],
  /**
   * How much wider than tall the stones come out.
   *
   * Sites scattered evenly give cells that are as tall as they are wide, and a
   * wall of those reads as a cobbled path stood on its end. A stone is laid on
   * its bed, so the scatter is done in a space stretched upright and the cells
   * are squashed back down afterwards — same tiling, same absence of seams,
   * stones that lie down.
   */
  lie = 1.5,
): void {
  const tallBounds = bounds.map((p) => ({ x: p.x, y: p.y * lie }));
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const p of tallBounds) {
    minX = Math.min(minX, p.x);
    maxX = Math.max(maxX, p.x);
    minY = Math.min(minY, p.y);
    maxY = Math.max(maxY, p.y);
  }
  const width = Math.max(maxX - minX, 1e-6);
  const tall = Math.max(maxY - minY, 1e-6);
  const middle = sizeAt((minY + maxY) / 2 / lie);

  const sites: Point[] = [];
  const tries = Math.min(6000, Math.ceil(((width * tall) / (middle * middle)) * 45) + 60);
  for (let i = 0; i < tries; i++) {
    const p = { x: minX + rng() * width, y: minY + rng() * tall };
    const clear = sizeAt(p.y / lie) * rng.range(0.62, 1.2);
    let crowded = false;
    for (const other of sites) {
      if (Math.hypot(other.x - p.x, other.y - p.y) < clear) {
        crowded = true;
        break;
      }
    }
    if (!crowded) sites.push(p);
  }
  if (sites.length === 0) {
    out.push(bounds);
    return;
  }

  // Only the near ones can take a bite out of a cell, and past twice the widest
  // stone none of them can. Testing every pair would be the same answer for
  // several times the work.
  const near = middle * 3.2;
  for (const site of sites) {
    let cell = tallBounds;
    for (const other of sites) {
      const dx = other.x - site.x;
      const dy = other.y - site.y;
      const away = Math.hypot(dx, dy);
      if (away < 1e-9 || away > near) continue;
      const nx = dx / away;
      const ny = dy / away;
      cell = clip(cell, nx, ny, (nx * (site.x + other.x) + ny * (site.y + other.y)) / 2, true);
      if (cell.length < 3) break;
    }
    if (cell.length >= 3 && area(cell) > 6e-4) {
      out.push(cell.map((p) => ({ x: p.x, y: p.y / lie })));
    }
  }
}

/**
 * A smooth wander, read off position alone.
 *
 * Two sines per axis at frequencies with no visible common factor — one about a
 * metre across, one about a quarter of that. Because it is a function of *where
 * a vertex is* rather than of which cell it belongs to, two cells meeting at a
 * point move together and the tiling survives.
 */
function warp(p: Point, amount: number, a: number, b: number): Point {
  const dx =
    (Math.sin(p.x * 7.3 + p.y * 4.1 + a) + 0.8 * Math.sin(p.x * 23.3 - p.y * 18.1 + b)) / 1.8;
  const dy =
    (Math.sin(p.y * 6.9 - p.x * 5.3 + b) + 0.8 * Math.sin(p.y * 25.1 + p.x * 16.7 + a)) / 1.8;
  return { x: p.x + dx * amount, y: p.y + dy * amount };
}

/**
 * The warp, optionally with its sideways part faded out at a pair of edges.
 *
 * A vertex on the end of a piece may slide up and down all it likes; it may not
 * leave the plane the next piece meets it on.
 */
export function wander(
  rng: Rng,
  amount: number,
  held?: { at: number; over: number; seam: (y: number) => number },
  /**
   * A height the wander is held to, and how far either side it eases off.
   *
   * For where one course has to meet another built separately — a coping on a
   * wall face. Both are warped, by different fields, so their edges disagree by
   * twice the warp; the only way to bed the coping close down onto the face
   * without a gap opening somewhere along it is for neither of them to wander
   * where they touch.
   */
  level?: { at: number; over: number },
): (p: Point) => Point {
  const a = rng.range(0, 20);
  const b = rng.range(0, 20);
  return (p) => {
    const moved = warp(p, amount, a, b);
    const still = level
      ? Math.max(0, Math.min(1, Math.abs(p.y - level.at) / level.over))
      : 1;
    const y = p.y + (moved.y - p.y) * still;
    if (!held) return { x: moved.x, y };
    const fade = Math.max(0, Math.min(1, (held.at - Math.abs(p.x)) / held.over));
    // Inside, the full field. At the join, a wander that is a function of height
    // alone — see `seam`.
    return { x: p.x + (moved.x - p.x) * fade + held.seam(p.y) * (1 - fade), y };
  };
}

/**
 * How the face wanders at a join, as a function of height and nothing else.
 *
 * The two pieces meeting there are built separately and cannot see each other,
 * so the only displacement they can both apply is one that depends on something
 * they agree about. Height is it: the same y is the same y in either piece's own
 * frame, so both sides of the join move together and the wall still tiles.
 *
 * Without it the join is the one dead-straight line in the wall, running its
 * whole height, which is exactly what a wall must never have.
 */
export function seam(rng: Rng, amount: number): (y: number) => number {
  const a = rng.range(0, 20);
  const b = rng.range(0, 20);
  return (y) => (amount * (Math.sin(y * 8.1 + a) + 0.6 * Math.sin(y * 21.7 + b))) / 1.6;
}

/** Extra vertices along any edge longer than `longest`, so the warp can bend it. */
function chop(cell: Cell, longest: number): Cell {
  const out: Cell = [];
  for (let i = 0; i < cell.length; i++) {
    const a = cell[i];
    const b = cell[(i + 1) % cell.length];
    out.push(a);
    const extra = Math.floor(Math.hypot(b.x - a.x, b.y - a.y) / longest);
    for (let k = 1; k <= extra; k++) {
      const t = k / (extra + 1);
      out.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
    }
  }
  return out;
}

/** A cell pulled in by half a joint and worn at the corners. */
function bed(rng: Rng, cell: Cell, point: Pointing): THREE.Vector3[] {
  const middle = centroid(cell);
  return cell.map((p) => {
    const dx = p.x - middle.x;
    const dy = p.y - middle.y;
    const reach = Math.hypot(dx, dy) || 1e-6;
    const back = point.joint / 2 + reach * rng.range(point.chamfer * 0.2, point.chamfer);
    const at = Math.max(1 - back / reach, 0.3);
    return new THREE.Vector3(middle.x + dx * at, middle.y + dy * at, 0);
  });
}

function middleOf(ring: THREE.Vector3[]): THREE.Vector3 {
  return ring.reduce((a, v) => a.add(v), new THREE.Vector3()).divideScalar(ring.length);
}

function geometryOf(position: number[]): THREE.BufferGeometry {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(position, 3));
  return geometry;
}

/**
 * A face stone: its outline in the plane of the surface, a flat crown `bulge`
 * proud of it, and a tail running back into the hearting.
 *
 * Four triangles a side. The crown fans from the middle rather than from a
 * corner, because a warped cell is not reliably convex and a corner fan on a
 * dented polygon turns triangles inside out — which the back-face cull then
 * punches a hole through.
 */
function faceStone(
  rng: Rng,
  ring: THREE.Vector3[],
  bulge: number,
  tail: number,
): THREE.BufferGeometry {
  const sides = ring.length;
  const middle = middleOf(ring);
  // A flat top rather than a point, set off centre so no two stones catch the
  // light the same way. A stone that comes to an apex is a gem.
  const shrink = rng.range(0.72, 0.88);
  let reach = 0;
  for (const v of ring) reach = Math.max(reach, Math.hypot(v.x - middle.x, v.y - middle.y));
  const offX = rng.around(0, reach * 0.09);
  const offY = rng.around(0, reach * 0.09);

  const top = ring.map(
    (v) =>
      new THREE.Vector3(
        middle.x + (v.x - middle.x) * shrink + offX,
        middle.y + (v.y - middle.y) * shrink + offY,
        bulge,
      ),
  );
  const crown = new THREE.Vector3(middle.x + offX, middle.y + offY, bulge);
  const root = new THREE.Vector3(middle.x, middle.y, -tail);

  const position: number[] = [];
  const put = (v: THREE.Vector3): void => {
    position.push(v.x, v.y, v.z);
  };
  for (let i = 0; i < sides; i++) {
    const j = (i + 1) % sides;
    put(ring[i]);
    put(ring[j]);
    put(top[j]);
    put(ring[i]);
    put(top[j]);
    put(top[i]);
    put(ring[j]);
    put(ring[i]);
    put(root);
    put(top[i]);
    put(top[j]);
    put(crown);
  }
  return geometryOf(position);
}

/**
 * A stone running right through a wall, for coping: an outline at each face, a
 * band of sides between them, and a flat crown on each.
 */
export function throughStone(
  rng: Rng,
  cell: Cell,
  point: Pointing,
  d: number,
  bulge: number,
  /** Flattens the underside to this height — what a coping is bedded down onto. */
  seat?: number,
): THREE.BufferGeometry {
  const ring = bed(rng, cell, point);
  const sides = ring.length;
  if (seat !== undefined) {
    const mid = middleOf(ring).y;
    for (const v of ring) if (v.y < mid) v.y = seat;
  }
  const middle = middleOf(ring);
  const at = (z: number, scale: number): THREE.Vector3[] =>
    ring.map(
      (v) =>
        new THREE.Vector3(
          middle.x + (v.x - middle.x) * scale,
          middle.y + (v.y - middle.y) * scale,
          z,
        ),
    );
  const front = at(d / 2, 1);
  const back = at(-d / 2, 0.96);
  const frontTop = at(d / 2 + bulge, 0.84);
  const backTop = at(-d / 2 - bulge, 0.82);
  const crown = new THREE.Vector3(middle.x, middle.y, d / 2 + bulge);
  const heel = new THREE.Vector3(middle.x, middle.y, -d / 2 - bulge);

  const position: number[] = [];
  const put = (v: THREE.Vector3): void => {
    position.push(v.x, v.y, v.z);
  };
  for (let i = 0; i < sides; i++) {
    const j = (i + 1) % sides;
    put(front[i]);
    put(back[i]);
    put(back[j]);
    put(front[i]);
    put(back[j]);
    put(front[j]);
    put(front[i]);
    put(front[j]);
    put(frontTop[j]);
    put(front[i]);
    put(frontTop[j]);
    put(frontTop[i]);
    put(back[j]);
    put(back[i]);
    put(backTop[i]);
    put(back[j]);
    put(backTop[i]);
    put(backTop[j]);
    put(frontTop[i]);
    put(frontTop[j]);
    put(crown);
    put(backTop[j]);
    put(backTop[i]);
    put(heel);
  }
  return geometryOf(position);
}

/** Six quads over a bottom ring and a top ring, wound outward. */
function hull(b: THREE.Vector3[], t: THREE.Vector3[]): THREE.BufferGeometry {
  const position: number[] = [];
  const face = (...v: THREE.Vector3[]): void => {
    for (const [i, j, k] of [
      [0, 1, 2],
      [0, 2, 3],
    ]) {
      position.push(v[i].x, v[i].y, v[i].z, v[j].x, v[j].y, v[j].z, v[k].x, v[k].y, v[k].z);
    }
  };
  face(b[0], b[1], t[1], t[0]);
  face(b[2], b[3], t[3], t[2]);
  face(b[1], b[2], t[2], t[1]);
  face(b[3], b[0], t[0], t[3]);
  face(t[0], t[1], t[2], t[3]);
  face(b[3], b[2], b[1], b[0]);
  return geometryOf(position);
}

/**
 * A corner stone, laid on the same terms as the face stones beside it.
 *
 * A quoin cut as a plain box reads as machined next to hand-laid rubble, however
 * much its corners are knocked about — its edges are dead straight and it butts
 * its neighbours with no joint. This takes the corner's own plan, breaks the
 * long edges, wears the corners in and beds it off the courses above and below,
 * which is what `skin` does to a face stone and is why the two now match.
 */
export function quoinStone(
  rng: Rng,
  plan: Cell,
  low: number,
  high: number,
  point: Pointing,
): THREE.BufferGeometry {
  // Worn in the plan, which is the x–z plane here — `bed` does not care which
  // two axes it is given, only that they are the ones that show. Wound so the
  // faces come out pointing away from the stone; the other way round it is
  // inside out, and the back-face cull turns it into a hole.
  let twice = 0;
  for (let i = 0; i < plan.length; i++) {
    const a = plan[i];
    const b = plan[(i + 1) % plan.length];
    twice += a.x * b.y - b.x * a.y;
  }
  const worn = bed(rng, chop(twice > 0 ? plan : [...plan].reverse(), 0.11), point);
  const drop = point.joint / 2;
  const bottom = worn.map(
    (v) => new THREE.Vector3(v.x, low + drop + rng.range(0, 0.014), v.y),
  );
  const top = worn.map((v) => new THREE.Vector3(v.x, high - drop - rng.range(0, 0.014), v.y));
  return prismUp(bottom, top);
}

/** Side quads over a bottom ring and a top ring of any size, capped from the middle. */
function prismUp(bottom: THREE.Vector3[], top: THREE.Vector3[]): THREE.BufferGeometry {
  const sides = bottom.length;
  const low = bottom.reduce((a, v) => a.add(v), new THREE.Vector3()).divideScalar(sides);
  const high = top.reduce((a, v) => a.add(v), new THREE.Vector3()).divideScalar(sides);

  const position: number[] = [];
  const put = (v: THREE.Vector3): void => {
    position.push(v.x, v.y, v.z);
  };
  for (let i = 0; i < sides; i++) {
    const j = (i + 1) % sides;
    put(bottom[i]);
    put(top[i]);
    put(top[j]);
    put(bottom[i]);
    put(top[j]);
    put(bottom[j]);
    put(top[i]);
    put(high);
    put(top[j]);
    put(bottom[i]);
    put(bottom[j]);
    put(low);
  }
  return geometryOf(position);
}

/**
 * A box with its eight corners knocked about — the lintels and capstones a wall
 * has actually been squared up, without their being machined.
 */
export function roughBox(
  rng: Rng,
  x: readonly [number, number],
  y: readonly [number, number],
  z: readonly [number, number],
  jitter: number,
): THREE.BufferGeometry {
  const at = (px: number, py: number, pz: number): THREE.Vector3 =>
    new THREE.Vector3(
      px + rng.around(0, jitter),
      py + rng.around(0, jitter),
      pz + rng.around(0, jitter),
    );
  return hull(
    [at(x[0], y[0], z[1]), at(x[1], y[0], z[1]), at(x[1], y[0], z[0]), at(x[0], y[0], z[0])],
    [at(x[0], y[1], z[1]), at(x[1], y[1], z[1]), at(x[1], y[1], z[0]), at(x[0], y[1], z[0])],
  );
}

/**
 * A profile extruded through `depth`, centred on z = 0.
 *
 * The filler behind a run of dressed stones. Every stone is bedded a joint's
 * width off its neighbour, so a course laid on nothing at all has daylight
 * between each pair of them — and an arch made only of its own voussoirs is a
 * comb you can see the sky through.
 */
export function prism(profile: Cell, depth: number): THREE.BufferGeometry {
  const n = profile.length;
  const front = profile.map((p) => new THREE.Vector3(p.x, p.y, depth / 2));
  const back = profile.map((p) => new THREE.Vector3(p.x, p.y, -depth / 2));
  const mid = centroid(profile);
  const capFront = new THREE.Vector3(mid.x, mid.y, depth / 2);
  const capBack = new THREE.Vector3(mid.x, mid.y, -depth / 2);

  const position: number[] = [];
  const put = (v: THREE.Vector3): void => {
    position.push(v.x, v.y, v.z);
  };
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    put(front[i]);
    put(back[i]);
    put(back[j]);
    put(front[i]);
    put(back[j]);
    put(front[j]);
    put(front[i]);
    put(front[j]);
    put(capFront);
    put(back[j]);
    put(back[i]);
    put(capBack);
  }
  return geometryOf(position);
}

/** A box that narrows with height: the batter as a slope, not a flight of steps. */
export function tapered(
  span: number,
  height: number,
  low: number,
  high: number,
): THREE.BufferGeometry {
  const s = span / 2;
  const at = (px: number, py: number, pz: number): THREE.Vector3 => new THREE.Vector3(px, py, pz);
  return hull(
    [at(-s, 0, low), at(s, 0, low), at(s, 0, -low), at(-s, 0, -low)],
    [at(-s, height, high), at(s, height, high), at(s, height, -high), at(-s, height, -high)],
  );
}

/** A rectangle as a cell, wound anticlockwise. */
export function patch(x: number, y: number, w: number, h: number): Cell {
  return [
    { x, y },
    { x: x + w, y },
    { x: x + w, y: y + h },
    { x, y: y + h },
  ];
}

/** Part way from one colour to another, per channel. */
function blend(from: number, to: number, at: number): number {
  const lerp = (shift: number): number =>
    Math.round(((from >> shift) & 0xff) * (1 - at) + ((to >> shift) & 0xff) * at);
  return (lerp(16) << 16) | (lerp(8) << 8) | lerp(0);
}

/**
 * Grey with the odd warm one. Hue separates where brightness alone would not.
 *
 * `warmth` is how often a stone comes out brown. Rubble off a field is mixed;
 * dressed work — lintels, copings, a gateway's crown — was chosen from one bed
 * and passes zero.
 */
export function stoneColours(rng: Rng, warmth = 0.14): () => number {
  const greys = rng.chance(0.4)
    ? ([PALETTE.STONE, PALETTE.STONE, PALETTE.STONE_PALE, PALETTE.STONE_DARK] as const)
    : ([PALETTE.STONE, PALETTE.STONE, PALETTE.STONE_DARK, PALETTE.STONE_DARK] as const);
  // Pulled most of the way back toward the greys before it is lifted. Raw earth
  // beside stone is a brown that announces itself; a stone off a different bed
  // differs in hue and barely in anything else.
  const warm = shade(blend(PALETTE.EARTH, PALETTE.STONE, 0.4), rng.range(1.1, 1.28));
  return () => shade(rng.chance(warmth) ? warm : rng.pick(greys), rng.around(1, 0.19));
}

/**
 * What shows in the joints: shadow on a dry wall, pointing on a mortared one.
 *
 * Both are mid greys. A joint dark enough to read as a hole draws the eye
 * straight to every place two stones failed to meet — a paler one takes the
 * same imperfection and reads it as a joint.
 */
export function hearting(rng: Rng, dry: boolean): number {
  return dry
    ? shade(PALETTE.STONE_DARK, rng.range(0.86, 1))
    : shade(PALETTE.STONE_PALE, rng.range(0.9, 1));
}

/** How wide a joint is and how worn its stones are, dry-laid or pointed. */
export function pointing(rng: Rng, dry: boolean): Pointing {
  return dry
    ? { joint: rng.range(0.014, 0.02), chamfer: 0.028 }
    : { joint: rng.range(0.018, 0.026), chamfer: 0.026 };
}

/**
 * Cuts a panel into stones and beds them on a face at `seat`, ready to be turned
 * onto whichever side of a wall, pier or arch they belong to.
 */
export function skin(
  rng: Rng,
  panel: Cell,
  sizeAt: (y: number) => number,
  point: Pointing,
  seat: (y: number) => number,
  move: (p: Point) => Point,
  colour: () => number,
  out: Part[],
): void {
  const cells: Cell[] = [];
  scatter(rng, panel, sizeAt, cells);

  for (const cell of cells) {
    const warped = chop(cell, 0.26).map(move);
    const stone = faceStone(
      rng,
      bed(rng, warped, point),
      rng.range(SKIN * 0.35, SKIN * 0.8),
      rng.range(0.06, 0.14),
    );
    // Some sit prouder than others, and all of them proud of the hearting, so
    // the outline is a step the edge pass can find rather than a coplanar seam.
    stone.translate(0, 0, seat(centroid(warped).y) + rng.range(0.002, 0.012));
    out.push({ geometry: stone, color: colour(), sway: 0 });
  }
}

export interface PierOptions {
  /** Across the pier. */
  width: number;
  /** Through it. */
  depth: number;
  height: number;
  /** How far into each face a corner stone reaches. */
  quoin: number;
  /** Stone size at the foot. */
  stone: number;
  point: Pointing;
  fill: number;
  colour: () => number;
}

/**
 * A rectangular pier: a hearting, squared quoins down each corner, and a rubble
 * panel on each of the four faces between them.
 *
 * Standing on y = 0, centred on the origin, `width` along X and `depth` along Z.
 */
export function quoinedPier(rng: Rng, options: PierOptions): Part[] {
  const { width, depth, height, quoin, stone, point, fill, colour } = options;
  const parts: Part[] = [];
  const acrossFace = width / 2 - SKIN;
  const throughFace = depth / 2 - SKIN;

  const core = new THREE.BoxGeometry(acrossFace * 2, height, throughFace * 2);
  core.translate(0, height / 2, 0);
  parts.push({ geometry: core, color: fill, sway: 0 });

  // The quoins, one course at a time and the same heights all four corners
  // round, because that is how a pier goes up. How far each stands proud
  // alternates between the two axes course by course, which is the step in the
  // arris that says long-and-short work without needing stones of two lengths.
  const courses: number[] = [];
  for (let y = 0; height - y > 1e-6; ) {
    let h = rng.range(0.24, 0.36);
    if (height - (y + h) < 0.16) h = height - y;
    h = Math.min(h, height - y);
    courses.push(h);
    y += h;
  }

  let at = 0;
  courses.forEach((h, c) => {
    const long = c % 2 === 0;
    const outX = acrossFace + SKIN * (long ? 0.85 : 0.5);
    const outZ = throughFace + SKIN * (long ? 0.5 : 0.85);
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        const reach = (s: number, inner: number, outer: number): [number, number] =>
          s > 0 ? [inner, outer] : [-outer, -inner];
        const [x0, x1] = reach(sx, acrossFace - quoin, outX);
        const [z0, z1] = reach(sz, throughFace - quoin, outZ);
        parts.push({
          geometry: quoinStone(
            rng,
            [
              { x: x0, y: z0 },
              { x: x1, y: z0 },
              { x: x1, y: z1 },
              { x: x0, y: z1 },
            ],
            at,
            at + h,
            point,
          ),
          color: colour(),
          sway: 0,
        });
      }
    }
    at += h;
  });

  // The panels between them. A stone is built looking down +Z, so a side face
  // is the same panel yawed a quarter turn.
  for (let side = 0; side < 4; side++) {
    const facing = side % 2 === 0;
    const half = (facing ? acrossFace : throughFace) - quoin;
    const seat = facing ? throughFace : acrossFace;
    if (half <= 0.02) continue;

    const stones: Part[] = [];
    skin(
      rng,
      patch(-half, 0, half * 2, height),
      (y) => stone * (1 - 0.28 * (y / height)),
      point,
      () => seat,
      wander(rng, rng.range(0.012, 0.02)),
      colour,
      stones,
    );
    const yaw = (side * Math.PI) / 2;
    for (const part of stones) {
      part.geometry.rotateY(yaw);
      parts.push(part);
    }
  }

  return parts;
}
