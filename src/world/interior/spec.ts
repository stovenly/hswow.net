// An interior as a map: storeys of half-metre cells lettered by room, marks on
// cell edges, stair strips, and a kit that turns the map into walls.

/** Metres per cell. */
export const CELL = 0.5;
/** The slab between storeys: the upper floor and the lower ceiling are one piece. */
export const SLAB = 0.3;
/** A boundary wall's thickness, extruded outward from the cell edge. */
export const WALL = 0.35;
/** A partition's thickness, centred on the cell edge. */
export const PARTITION = 0.2;

export type Side = 'n' | 'e' | 's' | 'w';

export interface EdgeMark {
  /** What a portal names. */
  id?: string;
  /** The cell the mark starts at, in the storey's own cell coordinates. */
  at: readonly [number, number];
  /** Which edge of that cell; `up` is the ceiling over it. */
  side: Side | 'up';
  kind: string;
  /** Cells along the wall; defaults per kind. */
  span?: number;
  builder?: string;
  seed?: number;
  options?: Record<string, unknown>;
}

export interface StairSpec {
  id?: string;
  /** The strip's north-west cell. */
  at: readonly [number, number];
  /** The direction of ascent. */
  dir: Side;
  /** Cells long. */
  run: number;
}

export interface StoreySpec {
  /** Clear height, floor top to ceiling underside, metres. */
  height: number;
  /** One string per row, z down the rows, x along them: a letter is a room, `.` is outside, `_` is void. */
  cells: readonly string[];
  /** The cell coordinate of the first character of the first row. Default [0, 0]. */
  origin?: readonly [number, number];
  edges?: readonly EdgeMark[];
  stairs?: readonly StairSpec[];
  ceiling?: 'flat' | 'rafters';
}

export interface RoomOverride {
  /** A floor step down within the storey, metres. */
  drop?: number;
  style?: string;
  height?: number;
  roughen?: number;
  planks?: boolean;
  beams?: number;
}

export interface InteriorSpec {
  kit?: string;
  seed?: number;
  storeys: readonly StoreySpec[];
  rooms?: Record<string, RoomOverride>;
  /** Metres the whole grid is shifted in world x and z, for a room an odd count of cells wide that must stay centred. */
  offset?: readonly [number, number];
}

// --- the old shell, read for one release ----------------------------------------

export type WallSide = '+x' | '-x' | '+z' | '-z';
export type JoinKind = 'doorway' | 'arch' | 'open' | 'stair';

export interface Room {
  id: string;
  at: readonly [number, number];
  width: number;
  depth: number;
  height: number;
  level?: number;
  style?: string;
  planks?: boolean;
  beams?: number;
  roughen?: number;
}

export interface Join {
  between: readonly [string, string];
  kind: JoinKind;
  offset?: number;
  width?: number;
  height?: number;
}

export interface ShellSpec {
  width?: number;
  depth?: number;
  height?: number;
  seed?: number;
  style?: string;
  planks?: boolean;
  beams?: number;
  thickness?: number;
  rooms?: readonly Room[];
  joins?: readonly Join[];
}

/** A style name the shell reader maps onto a kit and a style within it. */
export function kitOfStyle(style: string | undefined): { kit: string; style?: string } {
  switch (style) {
    case 'countryside-cellar':
      return { kit: 'cellar' };
    case 'barn':
      return { kit: 'barn' };
    case 'countryside-store':
      return { kit: 'house', style: 'store' };
    case 'works':
      return { kit: 'house', style: 'works' };
    case undefined:
    case 'house':
      return { kit: 'house' };
    default:
      return { kit: 'house', style };
  }
}

/**
 * The old box or room graph as one storey of cells: rooms snapped to the
 * half-metre grid about the origin, joins as marks on the shared edges. Nothing
 * moves, because every interior that exists lands on the grid exactly.
 */
export function interiorOfShell(shell: ShellSpec): InteriorSpec {
  const kit = kitOfStyle(shell.style);
  const rooms: Room[] = shell.rooms?.length
    ? [...shell.rooms]
    : [{ id: 'A', at: [0, 0], width: shell.width ?? 8, depth: shell.depth ?? 6, height: shell.height ?? 3, planks: shell.planks, beams: shell.beams }];
  const cellsOf = (room: Room): { i0: number; j0: number; i1: number; j1: number } => ({
    i0: Math.round((room.at[0] - room.width / 2) / CELL),
    j0: Math.round((room.at[1] - room.depth / 2) / CELL),
    i1: Math.round((room.at[0] + room.width / 2) / CELL),
    j1: Math.round((room.at[1] + room.depth / 2) / CELL),
  });
  let minI = Infinity;
  let minJ = Infinity;
  let maxI = -Infinity;
  let maxJ = -Infinity;
  const boxes = rooms.map((room) => {
    const b = cellsOf(room);
    minI = Math.min(minI, b.i0);
    minJ = Math.min(minJ, b.j0);
    maxI = Math.max(maxI, b.i1);
    maxJ = Math.max(maxJ, b.j1);
    return b;
  });
  const letters = rooms.map((_, k) => String.fromCharCode(65 + k));
  const rows: string[] = [];
  for (let j = minJ; j < maxJ; j++) {
    let row = '';
    for (let i = minI; i < maxI; i++) {
      let letter = '.';
      boxes.forEach((b, k) => {
        if (i >= b.i0 && i < b.i1 && j >= b.j0 && j < b.j1) letter = letters[k];
      });
      row += letter;
    }
    rows.push(row);
  }
  const overrides: Record<string, RoomOverride> = {};
  const baseLevel = Math.min(...rooms.map((r) => r.level ?? 0));
  rooms.forEach((room, k) => {
    const override: RoomOverride = {};
    if ((room.level ?? 0) > baseLevel) override.drop = -((room.level ?? 0) - baseLevel);
    if (room.style) override.style = kitOfStyle(room.style).style ?? room.style;
    if (room.planks !== undefined) override.planks = room.planks;
    if (room.beams !== undefined) override.beams = room.beams;
    if (room.roughen !== undefined) override.roughen = room.roughen;
    if (Object.keys(override).length > 0) overrides[letters[k]] = override;
  });
  const edges: EdgeMark[] = [];
  for (const join of shell.joins ?? []) {
    const ka = rooms.findIndex((r) => r.id === join.between[0]);
    const kb = rooms.findIndex((r) => r.id === join.between[1]);
    if (ka < 0 || kb < 0) continue;
    const a = boxes[ka];
    const b = boxes[kb];
    const kind = join.kind === 'doorway' ? 'door' : join.kind === 'stair' ? 'open' : join.kind;
    // The shared edge, and the cell on `a`'s side of it.
    if (a.i1 === b.i0 || b.i1 === a.i0) {
      const j0 = Math.max(a.j0, b.j0);
      const j1 = Math.min(a.j1, b.j1);
      const span = kind === 'open' ? j1 - j0 : kind === 'arch' ? 3 : 2;
      const jm = Math.floor((j0 + j1) / 2 + ((join.offset ?? 0) / CELL) - span / 2);
      edges.push({ at: [a.i1 === b.i0 ? a.i1 - 1 : a.i0, jm], side: a.i1 === b.i0 ? 'e' : 'w', kind, span });
    } else if (a.j1 === b.j0 || b.j1 === a.j0) {
      const i0 = Math.max(a.i0, b.i0);
      const i1 = Math.min(a.i1, b.i1);
      const span = kind === 'open' ? i1 - i0 : kind === 'arch' ? 3 : 2;
      const im = Math.floor((i0 + i1) / 2 + ((join.offset ?? 0) / CELL) - span / 2);
      edges.push({ at: [im, a.j1 === b.j0 ? a.j1 - 1 : a.j0], side: a.j1 === b.j0 ? 's' : 'n', kind, span });
    }
  }
  return {
    kit: kit.kit,
    seed: shell.seed,
    storeys: [{ height: Math.max(...rooms.map((r) => r.height)), cells: rows, origin: [minI, minJ], edges }],
    rooms: {
      ...overrides,
      ...(kit.style ? Object.fromEntries(letters.map((l) => [l, { ...(overrides[l] ?? {}), style: overrides[l]?.style ?? kit.style }])) : {}),
    },
  };
}
