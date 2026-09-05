import * as THREE from 'three';
import {
  buildJunction,
  buildStonePaving,
  buildTrackWith,
  isStone,
  junctionRingEdges,
  liftOf,
  rowOf,
  type JunctionArm,
  type StoneRing,
  type StoneStrip,
  type TrackEdge,
  type TrackSurface,
} from './track';
import type { GroundAt, Point } from './placement';

/**
 * A zone's tracks built together, so that where they meet is one junction
 * and not two strips drawn over each other. Every polyline is cut where it
 * crosses or ends on another; each cut is a junction, paved once in the
 * winning surface over the mouths of every strip that meets it, and each
 * strip stops at the junction's edge with its profile eased into the
 * junction's plane.
 */

export interface NetworkTrack {
  id: string;
  through: readonly Point[];
  width: number;
  surface: TrackSurface;
  edge?: TrackEdge;
  wear?: number;
  seed: number;
}

export interface NetworkOptions {
  tracks: readonly NetworkTrack[];
  groundAt: GroundAt;
  /** sRGB hex of the ground beside the tracks. */
  beside: number;
}

/** Which surface a mixed junction is paved in: the first of these present, and a tie to the wider. */
const RANK: readonly TrackSurface[] = ['cobble', 'flagstone', 'boards', 'gravel', 'dirt'];

/** Metres of strip too short to be worth building between two junctions, which are merged instead. */
const STUB = 0.4;
/** A junction reaches at most this many half widths out along its widest arm. */
const REACH_MOST = 4;

interface Line {
  track: NetworkTrack;
  points: [number, number][];
  /** Metres along at each point. */
  at: number[];
  length: number;
}

interface Hit {
  line: Line;
  s: number;
}

interface Node {
  x: number;
  z: number;
  hits: Hit[];
  /** Metres from the middle each arm is trimmed back. */
  reach: number;
  surface: TrackSurface;
  width: number;
}

export function buildTrackNetwork(options: NetworkOptions): Map<string, THREE.Group> {
  const lines = options.tracks.map(lineOf).filter((line) => line.points.length >= 2);
  snapEnds(lines);
  for (const line of lines) measure(line);
  const nodes = findNodes(lines);
  for (const node of nodes) settle(node);
  mergeStubs(nodes);

  const groups = new Map<string, THREE.Group>();
  for (const line of lines) groups.set(line.track.id, new THREE.Group());

  // Each line's junctions in order along it, then the strips between. The
  // stone strips and junctions are gathered and paved once, together.
  const arms = new Map<Node, JunctionArm[]>();
  for (const node of nodes) arms.set(node, []);
  const stoneStrips: StoneStrip[] = [];
  const stoneRings: StoneRing[] = [];
  let stoneOwner: NetworkTrack | null = null;
  let stoneWear = 0;
  for (const line of lines) {
    const hits = nodes
      .flatMap((node) => node.hits.filter((hit) => hit.line === line).map((hit) => ({ node, s: hit.s })))
      .sort((a, b) => a.s - b.s);
    const group = groups.get(line.track.id) as THREE.Group;
    let from = 0;
    let fromS = 0;
    let fromNode: Node | null = null;
    for (let k = 0; k <= hits.length; k++) {
      const next = k < hits.length ? hits[k] : null;
      const to = next ? next.s - next.node.reach : line.length;
      const toNode = next ? next.node : null;
      if (to - from >= STUB || (!fromNode && !toNode)) {
        const built = buildTrackWith({
          through: slice(line, from, to),
          width: line.track.width,
          surface: line.track.surface,
          edge: line.track.edge,
          wear: line.track.wear,
          seed: line.track.seed + k * 101,
          groundAt: options.groundAt,
          beside: options.beside,
          ends: {
            start: fromNode ? liftOf(fromNode.surface, fromNode.width) : undefined,
            end: toNode ? liftOf(toNode.surface, toNode.width) : undefined,
          },
        });
        group.add(built.group);
        if (built.stone) {
          stoneStrips.push(built.stone);
          stoneWear += line.track.wear ?? 0.5;
          if (!stoneOwner) stoneOwner = line.track;
        }
        if (built.samples.length >= 2) {
          const arm = { surface: line.track.surface, width: line.track.width, edge: line.track.edge };
          if (fromNode) arms.get(fromNode)?.push({ ...arm, row: rowOf(built.samples[0]), spine: slice(line, fromS, from) });
          if (toNode && next) {
            const row = rowOf(built.samples[built.samples.length - 1]);
            arms.get(toNode)?.push({ ...arm, row, spine: slice(line, to, next.s).reverse() });
          }
        }
      }
      if (next) {
        from = next.s + next.node.reach;
        fromS = next.s;
        fromNode = next.node;
      }
    }
  }

  nodes.forEach((node, index) => {
    const rows = arms.get(node) ?? [];
    if (rows.length < 2) return;
    const owner = node.hits
      .map((hit) => hit.line.track)
      .sort((a, b) => RANK.indexOf(a.surface) - RANK.indexOf(b.surface) || b.width - a.width)[0];
    if (isStone(node.surface)) {
      const { ring, outer } = junctionRingEdges([node.x, node.z], rows);
      if (ring.length >= 3) {
        stoneRings.push({
          ring,
          outer,
          kerb: rows.some((arm) => arm.edge === 'kerb'),
          lift: liftOf(node.surface, node.width),
          surface: node.surface,
        });
      }
      return;
    }
    groups.get(owner.id)?.add(
      buildJunction({
        at: [node.x, node.z],
        arms: rows,
        surface: node.surface,
        width: node.width,
        wear: node.hits.reduce((sum, hit) => sum + (hit.line.track.wear ?? 0.5), 0) / node.hits.length,
        seed: owner.seed + 7919 + index * 13,
        groundAt: options.groundAt,
        beside: options.beside,
      }),
    );
  });
  if (stoneOwner) {
    groups.get(stoneOwner.id)?.add(
      buildStonePaving({
        strips: stoneStrips,
        rings: stoneRings,
        wear: stoneWear / Math.max(1, stoneStrips.length),
        seed: stoneOwner.seed + 4099,
        groundAt: options.groundAt,
      }),
    );
  }
  return groups;
}

function lineOf(track: NetworkTrack): Line {
  const points: [number, number][] = [];
  for (const p of track.through) {
    const last = points[points.length - 1];
    if (!last || Math.hypot(p[0] - last[0], p[1] - last[1]) > 1e-3) points.push([p[0], p[1]]);
  }
  const line: Line = { track, points, at: [], length: 0 };
  measure(line);
  return line;
}

function measure(line: Line): void {
  line.at = [0];
  for (let i = 1; i < line.points.length; i++) {
    const [ax, az] = line.points[i - 1];
    const [bx, bz] = line.points[i];
    line.at.push(line.at[i - 1] + Math.hypot(bx - ax, bz - az));
  }
  line.length = line.at[line.at.length - 1];
}

/** The nearest point of a line to a point: metres along, and how far off. */
function nearest(line: Line, x: number, z: number): { s: number; away: number; x: number; z: number } {
  let best = { s: 0, away: Infinity, x: 0, z: 0 };
  for (let i = 0; i + 1 < line.points.length; i++) {
    const [ax, az] = line.points[i];
    const [bx, bz] = line.points[i + 1];
    const dx = bx - ax;
    const dz = bz - az;
    const lengthSquared = dx * dx + dz * dz;
    const t = lengthSquared === 0 ? 0 : Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / lengthSquared));
    const px = ax + dx * t;
    const pz = az + dz * t;
    const away = Math.hypot(x - px, z - pz);
    if (away < best.away) best = { s: line.at[i] + Math.sqrt(lengthSquared) * t, away, x: px, z: pz };
  }
  return best;
}

/**
 * An end that reaches another line is moved onto it: onto the line where it
 * runs into the side of one, onto the other's end where the two ends meet.
 */
function snapEnds(lines: Line[]): void {
  for (const line of lines) {
    for (const end of [0, line.points.length - 1]) {
      const [x, z] = line.points[end];
      let closest: { line: Line; s: number; x: number; z: number; away: number } | null = null;
      for (const other of lines) {
        if (other === line) continue;
        const found = nearest(other, x, z);
        const touch = other.track.width / 2 + line.track.width / 2;
        if (found.away > touch) continue;
        if (!closest || found.away < closest.away) closest = { line: other, ...found };
      }
      if (!closest) continue;
      const other = closest.line;
      const atEnd = closest.s < other.track.width / 2 ? 0 : closest.s > other.length - other.track.width / 2 ? other.points.length - 1 : -1;
      const target = atEnd >= 0 ? other.points[atEnd] : [closest.x, closest.z];
      line.points[end] = [target[0], target[1]];
    }
  }
}

/** Where lines cross, and where an end lies on another line, grouped into junctions. */
function findNodes(lines: Line[]): Node[] {
  const nodes: Node[] = [];
  const add = (x: number, z: number, hits: Hit[]): void => {
    nodes.push({ x, z, hits, reach: 0, surface: 'dirt', width: 0 });
  };
  for (let i = 0; i < lines.length; i++) {
    const a = lines[i];
    for (let j = i + 1; j < lines.length; j++) {
      const b = lines[j];
      for (let p = 0; p + 1 < a.points.length; p++) {
        for (let q = 0; q + 1 < b.points.length; q++) {
          const cross = crossing(a.points[p], a.points[p + 1], b.points[q], b.points[q + 1]);
          if (!cross) continue;
          const sa = a.at[p] + (a.at[p + 1] - a.at[p]) * cross.t;
          const sb = b.at[q] + (b.at[q + 1] - b.at[q]) * cross.u;
          add(cross.x, cross.z, [{ line: a, s: sa }, { line: b, s: sb }]);
        }
      }
    }
  }
  for (const line of lines) {
    for (const s of [0, line.length]) {
      const [x, z] = line.points[s === 0 ? 0 : line.points.length - 1];
      const hits: Hit[] = [{ line, s }];
      for (const other of lines) {
        if (other === line) continue;
        const found = nearest(other, x, z);
        if (found.away <= 0.05) hits.push({ line: other, s: found.s });
      }
      if (hits.length > 1) add(x, z, hits);
    }
  }
  return merge(nodes, (a, b) => Math.hypot(a.x - b.x, a.z - b.z) <= (widest(a) + widest(b)) * 0.6);
}

function widest(node: Node): number {
  return node.hits.reduce((most, hit) => Math.max(most, hit.line.track.width), 0);
}

/** Nodes folded together wherever `near` says two are one, until none are. */
function merge(nodes: Node[], near: (a: Node, b: Node) => boolean): Node[] {
  let list = nodes;
  for (;;) {
    let folded = false;
    const out: Node[] = [];
    for (const node of list) {
      const into = out.find((held) => near(held, node));
      if (!into) {
        out.push(node);
        continue;
      }
      folded = true;
      const n = into.hits.length + node.hits.length;
      into.x = (into.x * into.hits.length + node.x * node.hits.length) / n;
      into.z = (into.z * into.hits.length + node.z * node.hits.length) / n;
      for (const hit of node.hits) {
        // One place on each line per junction: the hit nearest the middle stands.
        const held = into.hits.find((h) => h.line === hit.line);
        if (!held) into.hits.push(hit);
        else if (Math.abs(held.s - hit.s) > 1e-6) {
          const mine = nearest(hit.line, into.x, into.z).s;
          if (Math.abs(hit.s - mine) < Math.abs(held.s - mine)) held.s = hit.s;
        }
      }
    }
    list = out;
    if (!folded) return list;
  }
}

/**
 * How far a junction reaches along its arms, from the angle its neighbouring
 * arms make: far enough that two end rows do not overlap, and what it is
 * paved in — the highest-ranked surface that meets there, the wider on a tie.
 */
function settle(node: Node): void {
  const arms: { bearing: number; half: number }[] = [];
  for (const hit of node.hits) {
    const half = hit.line.track.width / 2;
    if (hit.s > 0.3) {
      const [dx, dz] = direction(hit.line, hit.s, -1);
      arms.push({ bearing: Math.atan2(dz, dx), half });
    }
    if (hit.s < hit.line.length - 0.3) {
      const [dx, dz] = direction(hit.line, hit.s, 1);
      arms.push({ bearing: Math.atan2(dz, dx), half });
    }
  }
  arms.sort((a, b) => a.bearing - b.bearing);
  const most = arms.reduce((held, arm) => Math.max(held, arm.half), 0);
  let reach = most * 1.3;
  for (let i = 0; i < arms.length && arms.length > 1; i++) {
    const a = arms[i];
    const b = arms[(i + 1) % arms.length];
    let gap = b.bearing - a.bearing;
    if (gap <= 0) gap += Math.PI * 2;
    const sin = Math.sin(Math.min(gap, Math.PI) / 2);
    if (sin > 1e-3) reach = Math.max(reach, (a.half + b.half) / (2 * sin));
  }
  node.reach = Math.min(reach, most * REACH_MOST) * 1.05;
  const winner = node.hits
    .map((hit) => hit.line.track)
    .sort((a, b) => RANK.indexOf(a.surface) - RANK.indexOf(b.surface) || b.width - a.width)[0];
  node.surface = winner.surface;
  node.width = winner.width;
}

/** Two junctions on one line with less than a stub of strip between them become one. */
function mergeStubs(nodes: Node[]): void {
  for (let pass = 0; pass < 8; pass++) {
    let folded = false;
    outer: for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];
        for (const ha of a.hits) {
          const hb = b.hits.find((hit) => hit.line === ha.line);
          if (!hb) continue;
          if (Math.abs(ha.s - hb.s) - a.reach - b.reach < STUB) {
            const [kept] = merge([a, b], () => true);
            settle(kept);
            nodes.splice(j, 1);
            nodes[i] = kept;
            folded = true;
            break outer;
          }
        }
      }
    }
    if (!folded) return;
  }
}

/** Unit direction of travel at `s`, forward or back along the line. */
function direction(line: Line, s: number, sign: 1 | -1): [number, number] {
  const from = pointAt(line, s);
  const to = pointAt(line, Math.max(0, Math.min(line.length, s + sign * Math.max(0.5, line.track.width))));
  const dx = to[0] - from[0];
  const dz = to[1] - from[1];
  const len = Math.hypot(dx, dz) || 1;
  return [dx / len, dz / len];
}

function pointAt(line: Line, s: number): [number, number] {
  if (s <= 0) return line.points[0];
  for (let i = 1; i < line.points.length; i++) {
    if (s <= line.at[i]) {
      const span = line.at[i] - line.at[i - 1] || 1;
      const t = (s - line.at[i - 1]) / span;
      const [ax, az] = line.points[i - 1];
      const [bx, bz] = line.points[i];
      return [ax + (bx - ax) * t, az + (bz - az) * t];
    }
  }
  return line.points[line.points.length - 1];
}

/** The line between two distances along it, with its own vertices between. */
function slice(line: Line, from: number, to: number): Point[] {
  const out: Point[] = [pointAt(line, from)];
  for (let i = 0; i < line.points.length; i++) {
    if (line.at[i] > from + 1e-6 && line.at[i] < to - 1e-6) out.push(line.points[i]);
  }
  out.push(pointAt(line, to));
  return out;
}

function crossing(
  a: [number, number],
  b: [number, number],
  c: [number, number],
  d: [number, number],
): { x: number; z: number; t: number; u: number } | null {
  const rx = b[0] - a[0];
  const rz = b[1] - a[1];
  const sx = d[0] - c[0];
  const sz = d[1] - c[1];
  const den = rx * sz - rz * sx;
  if (Math.abs(den) < 1e-9) return null;
  const t = ((c[0] - a[0]) * sz - (c[1] - a[1]) * sx) / den;
  const u = ((c[0] - a[0]) * rz - (c[1] - a[1]) * rx) / den;
  const inside = 1e-4;
  if (t < inside || t > 1 - inside || u < inside || u > 1 - inside) return null;
  return { x: a[0] + rx * t, z: a[1] + rz * t, t, u };
}
