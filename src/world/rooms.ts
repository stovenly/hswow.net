import * as THREE from 'three';
import { assemble, finish, type Part } from '../art/assemble';
import { createRng, type Rng } from '../art/random';
import { shade } from '../art/palette';
import { HOUSE_STYLE, interiorStyleByName, type InteriorStyle } from './interior';

/**
 * A shell of several rooms, joined where they touch.
 *
 * One room with no joins is the sealed box `buildInterior` makes, so the simple
 * case never pays for the general one. Kit pieces are not the way in: they make
 * sealing an authoring problem and put hairline seams exactly where flat shading
 * cannot hide them. Instead every wall is built as panels that tile it exactly,
 * with the openings taken out — watertight by construction rather than by care.
 *
 * Rooms are axis-aligned and stated by their inner extent. Two rooms share a
 * wall when their inner boxes touch along one axis and overlap along the other,
 * and a join cuts the same opening through both.
 */

export type WallSide = '+x' | '-x' | '+z' | '-z';
export type JoinKind = 'doorway' | 'arch' | 'open' | 'stair';

export interface Room {
  id: string;
  /** Centre of the inner floor, in the shell's space. */
  at: readonly [number, number];
  width: number;
  depth: number;
  height: number;
  /** Floor level. A room a step down from its neighbour says so here. */
  level?: number;
  style?: string;
  planks?: boolean;
  beams?: number;
  /**
   * Displaces the inner surfaces, 0..1, without touching topology — a cave or a
   * crypt rather than a built room. The walls stay panels and stay watertight;
   * only their inner faces move.
   */
  roughen?: number;
}

export interface Join {
  /** The two rooms it cuts through, by id. */
  between: readonly [string, string];
  kind: JoinKind;
  /** Metres from the middle of the shared span. */
  offset?: number;
  width?: number;
  height?: number;
}

export interface ShellGraph {
  rooms: readonly Room[];
  joins?: readonly Join[];
  seed?: number;
  style?: string;
  thickness?: number;
}

/** How far apart two inner faces may be and still count as touching. */
const TOUCHING = 0.001;

interface Opening {
  /** Along the wall's own axis, in the shell's space. */
  from: number;
  to: number;
  sill: number;
  top: number;
  kind: JoinKind;
}

const DEFAULTS: Record<JoinKind, { width: number; height: number }> = {
  doorway: { width: 1.1, height: 2.05 },
  arch: { width: 1.6, height: 2.4 },
  open: { width: Infinity, height: Infinity },
  stair: { width: 1.4, height: 2.2 },
};

export function buildRooms(graph: ShellGraph): THREE.Mesh {
  const rng = createRng(graph.seed ?? 1);
  const t = graph.thickness ?? 0.35;
  const base = interiorStyleByName(graph.style ?? 'house') ?? HOUSE_STYLE;
  const parts: Part[] = [];

  const byId = new Map(graph.rooms.map((room) => [room.id, room]));
  /** Openings per room, per wall. */
  const cuts = new Map<string, Map<WallSide, Opening[]>>();
  for (const room of graph.rooms) cuts.set(room.id, new Map());

  for (const join of graph.joins ?? []) {
    const a = byId.get(join.between[0]);
    const b = byId.get(join.between[1]);
    if (!a || !b) throw new Error(`join names a room that is not here: ${join.between.join(' — ')}`);
    const shared = sharedWall(a, b);
    if (!shared) throw new Error(`rooms "${a.id}" and "${b.id}" do not touch`);

    const wanted = DEFAULTS[join.kind];
    const span = shared.to - shared.from;
    const width = Math.min(join.width ?? wanted.width, span);
    const centre = (shared.from + shared.to) / 2 + (join.offset ?? 0);
    const from = Math.max(shared.from, centre - width / 2);
    const to = Math.min(shared.to, centre + width / 2);
    const floor = Math.max(a.level ?? 0, b.level ?? 0);
    const top = Math.min(
      floor + (join.height ?? wanted.height),
      Math.min((a.level ?? 0) + a.height, (b.level ?? 0) + b.height),
    );

    push(cuts, a.id, shared.aSide, { from, to, sill: a.level ?? 0, top, kind: join.kind });
    push(cuts, b.id, shared.bSide, { from, to, sill: b.level ?? 0, top, kind: join.kind });

    if (join.kind === 'stair') stairs(parts, a, b, shared, from, to, base);
    if (join.kind === 'arch' || join.kind === 'doorway') {
      reveal(parts, shared, from, to, Math.max(a.level ?? 0, b.level ?? 0), top, t, base);
    }
  }

  for (const room of graph.rooms) {
    const style = interiorStyleByName(room.style ?? graph.style ?? 'house') ?? base;
    buildRoom(parts, room, style, t, rng, cuts.get(room.id) ?? new Map());
  }

  return finish(assemble(parts), 'interior', 0);
}

function push(
  cuts: Map<string, Map<WallSide, Opening[]>>,
  room: string,
  side: WallSide,
  opening: Opening,
): void {
  const walls = cuts.get(room);
  if (!walls) return;
  const held = walls.get(side) ?? [];
  held.push(opening);
  walls.set(side, held);
}

interface Shared {
  /** Which of `a`'s walls the join cuts, and which of `b`'s. */
  aSide: WallSide;
  bSide: WallSide;
  /** The overlap along the wall, in the shell's space. */
  from: number;
  to: number;
  /** The plane the two rooms meet on. */
  at: number;
  /** Which axis the wall runs along. */
  along: 'x' | 'z';
}

/** Where two rooms touch, or nothing when they do not. */
function sharedWall(a: Room, b: Room): Shared | null {
  const ax = { min: a.at[0] - a.width / 2, max: a.at[0] + a.width / 2 };
  const az = { min: a.at[1] - a.depth / 2, max: a.at[1] + a.depth / 2 };
  const bx = { min: b.at[0] - b.width / 2, max: b.at[0] + b.width / 2 };
  const bz = { min: b.at[1] - b.depth / 2, max: b.at[1] + b.depth / 2 };

  const overlapZ = { from: Math.max(az.min, bz.min), to: Math.min(az.max, bz.max) };
  if (overlapZ.to - overlapZ.from > TOUCHING) {
    if (Math.abs(ax.max - bx.min) <= TOUCHING) {
      return { aSide: '+x', bSide: '-x', ...overlapZ, at: ax.max, along: 'z' };
    }
    if (Math.abs(bx.max - ax.min) <= TOUCHING) {
      return { aSide: '-x', bSide: '+x', ...overlapZ, at: ax.min, along: 'z' };
    }
  }

  const overlapX = { from: Math.max(ax.min, bx.min), to: Math.min(ax.max, bx.max) };
  if (overlapX.to - overlapX.from > TOUCHING) {
    if (Math.abs(az.max - bz.min) <= TOUCHING) {
      return { aSide: '+z', bSide: '-z', ...overlapX, at: az.max, along: 'x' };
    }
    if (Math.abs(bz.max - az.min) <= TOUCHING) {
      return { aSide: '-z', bSide: '+z', ...overlapX, at: az.min, along: 'x' };
    }
  }
  return null;
}

function buildRoom(
  parts: Part[],
  room: Room,
  style: InteriorStyle,
  t: number,
  rng: Rng,
  cuts: Map<WallSide, Opening[]>,
): void {
  const [cx, cz] = room.at;
  const level = room.level ?? 0;
  const planks = room.planks ?? true;
  const outerX = room.width + t * 2;
  const outerZ = room.depth + t * 2;

  // The slab is dropped a few millimetres under the boards: both at exactly the
  // floor level, the depth buffer has two coplanar faces to choose between and
  // picks differently from pixel to pixel, which reads as the floor crawling.
  const slabTop = level + (planks ? -0.006 : 0);
  const floor = new THREE.BoxGeometry(outerX, t, outerZ);
  floor.translate(cx, slabTop - t / 2, cz);
  parts.push({ geometry: floor, color: planks ? style.floorSeam : style.floor, sway: 0 });

  const ceiling = new THREE.BoxGeometry(outerX, t, outerZ);
  ceiling.translate(cx, level + room.height + t / 2, cz);
  parts.push({ geometry: ceiling, color: style.ceiling, sway: 0 });

  const walls: { side: WallSide; from: number; to: number; at: number; along: 'x' | 'z' }[] = [
    { side: '-z', from: cx - outerX / 2, to: cx + outerX / 2, at: cz - (room.depth + t) / 2, along: 'x' },
    { side: '+z', from: cx - outerX / 2, to: cx + outerX / 2, at: cz + (room.depth + t) / 2, along: 'x' },
    { side: '-x', from: cz - outerZ / 2, to: cz + outerZ / 2, at: cx - (room.width + t) / 2, along: 'z' },
    { side: '+x', from: cz - outerZ / 2, to: cz + outerZ / 2, at: cx + (room.width + t) / 2, along: 'z' },
  ];

  for (const wall of walls) {
    for (const panel of panelsFor(wall, level, room.height, cuts.get(wall.side) ?? [])) {
      const geometry =
        wall.along === 'x'
          ? new THREE.BoxGeometry(panel.to - panel.from, panel.top - panel.bottom, t)
          : new THREE.BoxGeometry(t, panel.top - panel.bottom, panel.to - panel.from);
      const mid = (panel.from + panel.to) / 2;
      geometry.translate(
        wall.along === 'x' ? mid : wall.at,
        (panel.bottom + panel.top) / 2,
        wall.along === 'x' ? wall.at : mid,
      );
      if (room.roughen) roughenInner(geometry, wall, t, room.roughen, rng);
      parts.push({ geometry, color: style.wall, sway: 0 });
    }
  }

  if (planks) boards(parts, room, style, level, rng);
  if ((room.beams ?? 3) > 0) beams(parts, room, style, level, outerX, rng);
  skirting(parts, room, style, level, t, cuts);
}

interface Panel {
  from: number;
  to: number;
  bottom: number;
  top: number;
}

/**
 * One wall as panels that tile it exactly. Between the openings, under them and
 * over them — so the wall is closed however many holes are cut in it, and no
 * rounding can open a seam a player could fall through.
 */
function panelsFor(
  wall: { from: number; to: number },
  level: number,
  height: number,
  openings: readonly Opening[],
): Panel[] {
  const top = level + height;
  const sorted = [...openings]
    .map((opening) => ({
      from: Math.max(wall.from, opening.from),
      to: Math.min(wall.to, opening.to),
      sill: Math.max(level, opening.sill),
      top: Math.min(top, opening.top),
    }))
    .filter((opening) => opening.to - opening.from > TOUCHING)
    .sort((a, b) => a.from - b.from);

  const panels: Panel[] = [];
  let at = wall.from;
  for (const opening of sorted) {
    // Overlapping openings would each take the same strip out; the later one
    // simply starts where the earlier one finished.
    const start = Math.max(at, opening.from);
    if (start - at > TOUCHING) panels.push({ from: at, to: start, bottom: level, top });
    if (opening.sill - level > TOUCHING) {
      panels.push({ from: start, to: opening.to, bottom: level, top: opening.sill });
    }
    if (top - opening.top > TOUCHING) {
      panels.push({ from: start, to: opening.to, bottom: opening.top, top });
    }
    at = Math.max(at, opening.to);
  }
  if (wall.to - at > TOUCHING) panels.push({ from: at, to: wall.to, bottom: level, top });
  return panels;
}

/**
 * Displaces a panel's inner face. The outer face and the four edges stay where
 * they are, so the shell is exactly as watertight as it was.
 */
function roughenInner(
  geometry: THREE.BufferGeometry,
  wall: { at: number; along: 'x' | 'z'; side: WallSide },
  t: number,
  amount: number,
  rng: Rng,
): void {
  const position = geometry.getAttribute('position') as THREE.BufferAttribute;
  const inward = wall.side === '+x' || wall.side === '+z' ? -1 : 1;
  const axis = wall.along === 'x' ? 'z' : 'x';
  const face = wall.at - inward * (t / 2);
  const reach = Math.min(t * 0.6, 0.28) * amount;

  for (let i = 0; i < position.count; i++) {
    const here = axis === 'x' ? position.getX(i) : position.getZ(i);
    if (Math.abs(here - face) > TOUCHING) continue;
    const jitter = rng.range(0, reach) * inward;
    if (axis === 'x') position.setX(i, here + jitter);
    else position.setZ(i, here + jitter);
  }
  position.needsUpdate = true;
  geometry.computeVertexNormals();
}

function boards(parts: Part[], room: Room, style: InteriorStyle, level: number, rng: Rng): void {
  const [cx, cz] = room.at;
  const boardWidth = rng.range(0.24, 0.34);
  const count = Math.ceil(room.width / boardWidth);
  const seamWidth = 0.009;
  const seamColor = shade(style.floor, 0.55);
  const strip = (from: number, span: number, color: number): void => {
    const geometry = new THREE.BoxGeometry(span, 0.03, room.depth);
    geometry.translate(from + span / 2, level - 0.015, cz);
    parts.push({ geometry, color, sway: 0, detail: span, detailTint: style.floor });
  };
  for (let i = 0; i < count; i++) {
    const x = cx - room.width / 2 + i * boardWidth;
    strip(x, seamWidth, seamColor);
    strip(x + seamWidth, boardWidth - seamWidth, shade(style.floor, rng.around(1, 0.09)));
  }
}

function beams(
  parts: Part[],
  room: Room,
  style: InteriorStyle,
  level: number,
  outerX: number,
  rng: Rng,
): void {
  const count = room.beams ?? 3;
  const drop = rng.range(0.16, 0.24);
  for (let i = 0; i < count; i++) {
    const z = room.at[1] - room.depth / 2 + ((i + 0.5) / count) * room.depth;
    const beam = new THREE.BoxGeometry(outerX, drop, rng.range(0.18, 0.26));
    beam.translate(room.at[0], level + room.height - drop / 2, z);
    parts.push({ geometry: beam, color: style.beam, sway: 0 });
  }
}

/** The band where a wall meets the floor, broken by whatever the wall is cut for. */
function skirting(
  parts: Part[],
  room: Room,
  style: InteriorStyle,
  level: number,
  t: number,
  cuts: Map<WallSide, Opening[]>,
): void {
  const [cx, cz] = room.at;
  const skirt = 0.16;
  const lay = (
    side: WallSide,
    from: number,
    to: number,
    at: number,
    along: 'x' | 'z',
  ): void => {
    for (const panel of panelsFor({ from, to }, level, skirt, (cuts.get(side) ?? []).map((cut) => ({
      ...cut,
      sill: level,
      top: level + skirt,
    })))) {
      const geometry =
        along === 'x'
          ? new THREE.BoxGeometry(panel.to - panel.from, skirt, 0.06)
          : new THREE.BoxGeometry(0.06, skirt, panel.to - panel.from);
      const mid = (panel.from + panel.to) / 2;
      geometry.translate(along === 'x' ? mid : at, level + skirt / 2, along === 'x' ? at : mid);
      parts.push({ geometry, color: style.wallTrim, sway: 0 });
    }
  };
  void t;
  lay('-z', cx - room.width / 2, cx + room.width / 2, cz - (room.depth - 0.06) / 2, 'x');
  lay('+z', cx - room.width / 2, cx + room.width / 2, cz + (room.depth - 0.06) / 2, 'x');
  lay('-x', cz - room.depth / 2, cz + room.depth / 2, cx - (room.width - 0.06) / 2, 'z');
  lay('+x', cz - room.depth / 2, cz + room.depth / 2, cx + (room.width - 0.06) / 2, 'z');
}

/** The lining round a cut opening, so its head and jambs read as built. */
function reveal(
  parts: Part[],
  shared: Shared,
  from: number,
  to: number,
  sill: number,
  top: number,
  t: number,
  style: InteriorStyle,
): void {
  const depth = t * 2.2;
  const jamb = 0.09;
  const place = (a: number, b: number, y0: number, y1: number): void => {
    const geometry =
      shared.along === 'x'
        ? new THREE.BoxGeometry(b - a, y1 - y0, depth)
        : new THREE.BoxGeometry(depth, y1 - y0, b - a);
    const mid = (a + b) / 2;
    geometry.translate(
      shared.along === 'x' ? mid : shared.at,
      (y0 + y1) / 2,
      shared.along === 'x' ? shared.at : mid,
    );
    parts.push({ geometry, color: style.wallTrim, sway: 0 });
  };
  place(from - jamb, from, sill, top + jamb);
  place(to, to + jamb, sill, top + jamb);
  place(from - jamb, to + jamb, top, top + jamb);
}

/** Steps between two rooms at different levels, inside the opening. */
function stairs(
  parts: Part[],
  a: Room,
  b: Room,
  shared: Shared,
  from: number,
  to: number,
  style: InteriorStyle,
): void {
  const low = Math.min(a.level ?? 0, b.level ?? 0);
  const high = Math.max(a.level ?? 0, b.level ?? 0);
  const rise = high - low;
  if (rise <= 0.02) return;
  // Roughly a comfortable step, and never fewer than one.
  const steps = Math.max(1, Math.round(rise / 0.18));
  const tread = 0.28;
  const highSide = (a.level ?? 0) > (b.level ?? 0) ? -1 : 1;

  for (let i = 0; i < steps; i++) {
    const y = low + ((i + 1) / steps) * rise;
    const out = (i + 1) * tread * highSide;
    const geometry =
      shared.along === 'x'
        ? new THREE.BoxGeometry(to - from, y - low, tread)
        : new THREE.BoxGeometry(tread, y - low, to - from);
    const mid = (from + to) / 2;
    geometry.translate(
      shared.along === 'x' ? mid : shared.at + out,
      (low + y) / 2,
      shared.along === 'x' ? shared.at + out : mid,
    );
    parts.push({ geometry, color: style.floor, sway: 0 });
  }
}
