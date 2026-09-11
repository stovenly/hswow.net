import { CELL, PARTITION, SLAB, WALL, type EdgeMark, type InteriorSpec, type RoomOverride, type Side, type StairSpec, type StoreySpec } from './spec';

// From the map to the plan: rooms as cell sets, every wall derived from the
// cells, posts at the corners, openings at the marks, stairs and the holes
// they cut, and the warnings for what does not fit.

export interface RoomPlan {
  id: string;
  storey: number;
  cells: Set<number>;
  /** Cell bounds, half-open on the high side. */
  i0: number;
  j0: number;
  i1: number;
  j1: number;
  /** Floor top, world y. */
  level: number;
  height: number;
  override: RoomOverride;
  /** Whether the cells fill the bounds. */
  rectangular: boolean;
}

export interface Opening {
  /** World coordinates along the wall. */
  from: number;
  to: number;
  sill: number;
  top: number;
  kind: string;
  mark: EdgeMark;
}

export interface WallRun {
  storey: number;
  room: string;
  /** The room on the far side of a partition. */
  other: string | null;
  kind: 'boundary' | 'partition' | 'balustrade';
  along: 'x' | 'z';
  /** The cell edge line, world. */
  at: number;
  from: number;
  to: number;
  /** As seen from `room`. */
  side: Side;
  level: number;
  height: number;
  openings: Opening[];
}

export interface PostPlan {
  x: number;
  z: number;
  storey: number;
  level: number;
  height: number;
  arms: number;
}

export interface StairPlan {
  storey: number;
  room: string;
  /** The strip's north-west corner, world. */
  x0: number;
  z0: number;
  dir: Side;
  run: number;
  level: number;
  rise: number;
}

/** A mark's place in the world: its centre on the inner face and the yaw that faces into the room. */
export interface MarkSite {
  storey: number;
  room: string;
  mark: EdgeMark;
  x: number;
  y: number;
  z: number;
  /** rotateY(yaw) takes +Z to the inward normal of the wall. */
  yaw: number;
  /** Metres along the wall the mark covers. */
  width: number;
  side: Side;
}

export interface StoreyPlan {
  index: number;
  spec: StoreySpec;
  level: number;
  height: number;
  pitch: number;
  origin: readonly [number, number];
  rooms: Map<string, RoomPlan>;
  /** Room id per cell key, `_` for void. */
  cells: Map<number, string>;
  walls: WallRun[];
  posts: PostPlan[];
  stairs: StairPlan[];
  /** Cells whose floor is cut, by a stair arriving from below or a hatch. */
  holes: Set<number>;
  /** Cells whose ceiling is cut by a hatch. */
  ceilingHoles: Set<number>;
  sites: MarkSite[];
}

export interface InteriorPlan {
  spec: InteriorSpec;
  storeys: StoreyPlan[];
  warnings: string[];
  minX: number;
  minZ: number;
  maxX: number;
  maxZ: number;
  ceiling: number;
  /** Every mark with an id. */
  edges: Map<string, MarkSite>;
  /** World metres the grid is shifted by. Cell coordinates in the storeys are unshifted; sites and bounds are shifted. */
  offset: readonly [number, number];
}

const SPAN: Record<string, number> = { door: 2, arch: 3, window: 2, hearth: 3, hatch: 2, mouth: 4, niche: 2, alcove: 2 };
const HEAD: Record<string, number> = { door: 2.05, arch: 2.4 };

export function cellKey(i: number, j: number): number {
  return (i + 32768) * 65536 + (j + 32768);
}

/** The step from a side: n is −z, e is +x, s is +z, w is −x. */
const STEP: Record<Side, readonly [number, number]> = { n: [0, -1], e: [1, 0], s: [0, 1], w: [-1, 0] };
const OPPOSITE: Record<Side, Side> = { n: 's', e: 'w', s: 'n', w: 'e' };

export function planInterior(spec: InteriorSpec): InteriorPlan {
  const warnings: string[] = [];
  const storeys: StoreyPlan[] = [];
  const edges = new Map<string, MarkSite>();
  let level = 0;
  let minX = Infinity;
  let minZ = Infinity;
  let maxX = -Infinity;
  let maxZ = -Infinity;

  spec.storeys.forEach((storey, index) => {
    const origin = storey.origin ?? [0, 0];
    const cells = new Map<number, string>();
    const roomCells = new Map<string, number[][]>();
    storey.cells.forEach((row, r) => {
      for (let c = 0; c < row.length; c++) {
        const ch = row[c];
        if (ch === '.' || ch === ' ') continue;
        const i = origin[0] + c;
        const j = origin[1] + r;
        cells.set(cellKey(i, j), ch);
        if (ch === '_') continue;
        const list = roomCells.get(ch) ?? [];
        list.push([i, j]);
        roomCells.set(ch, list);
      }
    });
    const rooms = new Map<string, RoomPlan>();
    for (const [id, list] of roomCells) {
      const override = spec.rooms?.[id] ?? {};
      let i0 = Infinity;
      let j0 = Infinity;
      let i1 = -Infinity;
      let j1 = -Infinity;
      const set = new Set<number>();
      for (const [i, j] of list) {
        set.add(cellKey(i, j));
        i0 = Math.min(i0, i);
        j0 = Math.min(j0, j);
        i1 = Math.max(i1, i + 1);
        j1 = Math.max(j1, j + 1);
      }
      rooms.set(id, {
        id,
        storey: index,
        cells: set,
        i0,
        j0,
        i1,
        j1,
        level: level - (override.drop ?? 0),
        height: override.height ?? storey.height,
        override,
        rectangular: set.size === (i1 - i0) * (j1 - j0),
      });
      minX = Math.min(minX, i0 * CELL - WALL);
      minZ = Math.min(minZ, j0 * CELL - WALL);
      maxX = Math.max(maxX, i1 * CELL + WALL);
      maxZ = Math.max(maxZ, j1 * CELL + WALL);
    }

    const plan: StoreyPlan = {
      index,
      spec: storey,
      level,
      height: storey.height,
      pitch: storey.height + SLAB,
      origin,
      rooms,
      cells,
      walls: [],
      posts: [],
      stairs: [],
      holes: new Set(),
      ceilingHoles: new Set(),
      sites: [],
    };
    deriveWalls(plan);
    derivePosts(plan);
    applyMarks(plan, warnings, edges);
    for (const stair of storey.stairs ?? []) planStair(plan, stair, warnings);
    storeys.push(plan);
    level += plan.pitch;
  });

  // Holes: a stair's top three risers arrive through the storey above's floor.
  storeys.forEach((plan, k) => {
    const above = storeys[k + 1];
    if (!above) return;
    for (const stair of plan.stairs) {
      const [di, dj] = STEP[stair.dir];
      const cut = Math.max(2, Math.ceil(stair.run * 0.4));
      for (let s = stair.run - cut; s < stair.run; s++) {
        const i0 = Math.round(stair.x0 / CELL) + di * s;
        const j0 = Math.round(stair.z0 / CELL) + dj * s;
        // Two cells wide: the strip's other row is across the direction of ascent.
        const across: readonly [number, number] = stair.dir === 'e' || stair.dir === 'w' ? [0, 1] : [1, 0];
        for (const k2 of [0, 1]) {
          const key = cellKey(i0 + across[0] * k2, j0 + across[1] * k2);
          above.holes.add(key);
          plan.ceilingHoles.add(key);
        }
      }
    }
    for (const key of plan.ceilingHoles) above.holes.add(key);
  });

  const top = storeys[storeys.length - 1];
  const ceiling = top ? top.level + top.height : 3;
  const [ox, oz] = spec.offset ?? [0, 0];
  for (const storey of storeys) {
    for (const site of storey.sites) {
      site.x += ox;
      site.z += oz;
    }
  }
  return { spec, storeys, warnings, minX: minX + ox, minZ: minZ + oz, maxX: maxX + ox, maxZ: maxZ + oz, ceiling, edges, offset: [ox, oz] };
}

/** Every wall as a run of collinear cell edges, from the room's own point of view. */
function deriveWalls(plan: StoreyPlan): void {
  type Edge = { room: string; other: string | null; kind: WallRun['kind']; side: Side; line: number; along: number };
  const edges: Edge[] = [];
  for (const room of plan.rooms.values()) {
    for (const key of room.cells) {
      const i = Math.floor(key / 65536) - 32768;
      const j = (key % 65536) - 32768;
      for (const side of ['n', 'e', 's', 'w'] as const) {
        const [di, dj] = STEP[side];
        const neighbour = plan.cells.get(cellKey(i + di, j + dj));
        if (neighbour === room.id) continue;
        let kind: WallRun['kind'];
        let other: string | null = null;
        if (neighbour === undefined) kind = 'boundary';
        else if (neighbour === '_') kind = 'balustrade';
        else {
          // A partition is placed once, from the lower id.
          if (neighbour < room.id) continue;
          kind = 'partition';
          other = neighbour;
        }
        const along = side === 'n' || side === 's' ? i : j;
        const line = side === 'n' ? j : side === 's' ? j + 1 : side === 'w' ? i : i + 1;
        edges.push({ room: room.id, other, kind, side, line, along });
      }
    }
  }
  const groups = new Map<string, Edge[]>();
  for (const edge of edges) {
    const key = `${edge.room}|${edge.other}|${edge.kind}|${edge.side}|${edge.line}`;
    const list = groups.get(key) ?? [];
    list.push(edge);
    groups.set(key, list);
  }
  for (const list of groups.values()) {
    list.sort((a, b) => a.along - b.along);
    let start = list[0].along;
    let prev = start;
    const flush = (end: number): void => {
      const first = list[0];
      const room = plan.rooms.get(first.room) as RoomPlan;
      const along: 'x' | 'z' = first.side === 'n' || first.side === 's' ? 'x' : 'z';
      // Boundary runs span their outer extent so corners overlap; partitions reach a little into the walls they meet.
      const grow = first.kind === 'boundary' ? WALL : first.kind === 'partition' ? 0.05 : 0;
      plan.walls.push({
        storey: plan.index,
        room: first.room,
        other: first.other,
        kind: first.kind,
        along,
        at: first.line * CELL,
        from: start * CELL - grow,
        to: (end + 1) * CELL + grow,
        side: first.side,
        level: room.level,
        height: first.other ? Math.max(room.height, (plan.rooms.get(first.other)?.height ?? room.height) + ((plan.rooms.get(first.other)?.level ?? room.level) - room.level)) : room.height,
        openings: [],
      });
    };
    for (let k = 1; k < list.length; k++) {
      if (list[k].along === prev + 1) {
        prev = list[k].along;
        continue;
      }
      flush(prev);
      start = list[k].along;
      prev = start;
    }
    flush(prev);
  }
}

/** A post at every cell vertex where walls meet other than straight through. */
function derivePosts(plan: StoreyPlan): void {
  const arms = new Map<number, Set<Side>>();
  const solid = plan.walls.filter((w) => w.kind !== 'balustrade');
  for (const wall of solid) {
    const line = Math.round(wall.at / CELL);
    const a = Math.round((wall.from + (wall.kind === 'boundary' ? WALL : 0.05)) / CELL);
    const b = Math.round((wall.to - (wall.kind === 'boundary' ? WALL : 0.05)) / CELL);
    for (let k = a; k <= b; k++) {
      const [i, j] = wall.along === 'x' ? [k, line] : [line, k];
      const key = cellKey(i, j);
      const set = arms.get(key) ?? new Set<Side>();
      // The wall runs along x through this vertex: arms to the west and east of it.
      if (wall.along === 'x') {
        if (k > a) set.add('w');
        if (k < b) set.add('e');
      } else {
        if (k > a) set.add('n');
        if (k < b) set.add('s');
      }
      arms.set(key, set);
    }
  }
  for (const [key, set] of arms) {
    const straight = set.size === 2 && ((set.has('n') && set.has('s')) || (set.has('e') && set.has('w')));
    if (set.size < 2 || straight) continue;
    const i = Math.floor(key / 65536) - 32768;
    const j = (key % 65536) - 32768;
    // The tallest room touching this vertex sets the post.
    let level = Infinity;
    let top = -Infinity;
    for (const [di, dj] of [[-1, -1], [0, -1], [-1, 0], [0, 0]]) {
      const id = plan.cells.get(cellKey(i + di, j + dj));
      const room = id ? plan.rooms.get(id) : undefined;
      if (!room) continue;
      level = Math.min(level, room.level);
      top = Math.max(top, room.level + room.height);
    }
    if (level === Infinity) continue;
    plan.posts.push({ x: i * CELL, z: j * CELL, storey: plan.index, level, height: top - level, arms: set.size });
  }
}

function applyMarks(plan: StoreyPlan, warnings: string[], edges: Map<string, MarkSite>): void {
  for (const mark of plan.spec.edges ?? []) {
    const [i, j] = mark.at;
    const roomId = plan.cells.get(cellKey(i, j));
    const room = roomId && roomId !== '_' ? plan.rooms.get(roomId) : undefined;
    if (!room) {
      warnings.push(`interior: mark ${mark.kind} at [${i}, ${j}] is not on a room cell`);
      continue;
    }
    const span = mark.span ?? SPAN[mark.kind] ?? 2;
    if (mark.side === 'up') {
      for (let a = 0; a < span; a++) for (let b = 0; b < span; b++) plan.ceilingHoles.add(cellKey(i + a, j + b));
      const site: MarkSite = { storey: plan.index, room: room.id, mark, x: (i + span / 2) * CELL, y: room.level, z: (j + span / 2) * CELL, yaw: 0, width: span * CELL, side: 'n' };
      plan.sites.push(site);
      if (mark.id) edges.set(mark.id, site);
      continue;
    }
    const side = mark.side;
    const along: 'x' | 'z' = side === 'n' || side === 's' ? 'x' : 'z';
    const line = side === 'n' ? j : side === 's' ? j + 1 : side === 'w' ? i : i + 1;
    const start = along === 'x' ? i : j;
    const from = start * CELL;
    const to = (start + span) * CELL;
    const run = plan.walls.find((w) => w.along === along && Math.abs(w.at - line * CELL) < 1e-6 && w.from <= from + 1e-6 && w.to >= to - 1e-6 && (w.room === room.id || w.other === room.id));
    if (!run) {
      // Canonical marks may name the far room's cell: try the neighbour.
      const [di, dj] = STEP[side];
      const otherId = plan.cells.get(cellKey(i + di, j + dj));
      const other = otherId && otherId !== '_' ? plan.rooms.get(otherId) : undefined;
      const flipped = other ? plan.walls.find((w) => w.along === along && Math.abs(w.at - line * CELL) < 1e-6 && (w.room === other.id || w.other === other.id)) : undefined;
      if (!flipped) {
        warnings.push(`interior: mark ${mark.kind} at [${i}, ${j}] ${side} lies on no wall`);
        continue;
      }
    }
    const wall = run ?? (plan.walls.find((w) => w.along === along && Math.abs(w.at - line * CELL) < 1e-6) as WallRun);
    const cut = mark.kind === 'door' || mark.kind === 'arch' || mark.kind === 'open';
    if (cut && wall.kind === 'partition') {
      const sill = Math.max(room.level, plan.rooms.get(wall.other ?? wall.room)?.level ?? room.level);
      wall.openings.push({
        from: mark.kind === 'open' ? wall.from : from,
        to: mark.kind === 'open' ? wall.to : to,
        sill,
        top: mark.kind === 'open' ? wall.level + wall.height : sill + (HEAD[mark.kind] ?? 2.05),
        kind: mark.kind,
        mark,
      });
    } else if (cut && wall.kind === 'boundary' && mark.kind !== 'door') {
      warnings.push(`interior: ${mark.kind} at [${i}, ${j}] ${side} opens onto nothing`);
    }
    if ((mark.kind === 'window' || mark.kind === 'hearth' || mark.kind === 'niche' || mark.kind === 'alcove' || mark.kind === 'mouth') && wall.kind !== 'boundary') {
      warnings.push(`interior: ${mark.kind} at [${i}, ${j}] ${side} is not on a boundary wall`);
    }
    // The inner face, and the yaw that faces into the room: rotateY(yaw) takes +Z to the inward normal.
    const mid = (from + to) / 2;
    const yaw = side === 'n' ? 0 : side === 's' ? Math.PI : side === 'w' ? Math.PI / 2 : -Math.PI / 2;
    const site: MarkSite = {
      storey: plan.index,
      room: room.id,
      mark,
      x: along === 'x' ? mid : line * CELL,
      y: room.level,
      z: along === 'x' ? line * CELL : mid,
      yaw,
      width: to - from,
      side,
    };
    plan.sites.push(site);
    if (mark.id) edges.set(mark.id, site);
  }
}

function planStair(plan: StoreyPlan, stair: StairSpec, warnings: string[]): void {
  const [i, j] = stair.at;
  const roomId = plan.cells.get(cellKey(i, j));
  const room = roomId && roomId !== '_' ? plan.rooms.get(roomId) : undefined;
  if (!room) {
    warnings.push(`interior: stair at [${i}, ${j}] is not in a room`);
    return;
  }
  plan.stairs.push({ storey: plan.index, room: room.id, x0: i * CELL, z0: j * CELL, dir: stair.dir, run: stair.run, level: room.level, rise: plan.pitch + (room.level - plan.level) * -1 });
}

export { OPPOSITE, PARTITION };
