import type { PortalGraph } from '../../world/Portal';
import { isDocumentZone } from '../../world/document';
import type { Zone, ZoneId } from '../../world/Zone';
import { hashString } from '../../world/loot';
import { ROAD, type Continent, type Loop, type Site, type Span } from './continent';
import { PALETTE, paintCanvas } from './paint';
import { route, through } from './pen';
import { drawRelief, familyOf, type Family, type Mark } from './relief';
import type { Ribbon, WorldAsk, WorldRaised } from './raise';
import { inPixels, type ChartView, type Sheet } from './view';

/**
 * The world map: a continent drawn from the zone graph and nothing else, in
 * the register of fantasy cartography, revealed as the player finds it.
 *
 * **Nodes are outdoor zones and edges are portals between them.** An interior
 * belongs to whichever outdoor zone it is reached from, so a walk from every
 * outdoor zone through its indoor neighbours gives the edges — the cottage, its
 * cellar and the store are inside the village node, and a chain of interiors
 * joining two outdoor zones is one road.
 *
 * A zone that declares a `place` stands where it says, in kilometres; the
 * distances the weather already believes are the distances the map draws.
 * Only a zone with no place is laid out, sprung off its neighbours.
 */

export { ROAD };

/** What the land is called. */
export const LAND_NAME = 'Arkstin';

/** Relaxation steps. Fixed, because the layout has to be the same everywhere. */
const STEPS = 400;

/** Kilometres of a zone's `place` to one road. */
const KM_PER_ROAD = 1.6;

/** How hard a road pulls its ends together, and how hard every pair pushes apart. */
const PULL = 0.06;
const PUSH = 0.055;

/** Chart units a node's circle takes up. */
export const NODE = 0.11;

/** Sea around the outermost places, in roads. */
const OFFING = 0.65;

/**
 * Pixels a road is at the scale the map was printed at. Every line weight and
 * type size below is stated in print pixels and multiplied by the zoom, so the
 * sheet is one drawing that is only ever looked at closer.
 */
const PRINT = 300;

/** How far the painted country reaches about a found place and along a found road, in roads. */
const REVEAL = 0.8;
const REVEAL_ROAD = 0.5;
const REVEAL_FADE = 0.16;

export interface WorldNode {
  id: ZoneId;
  name: string;
  family: Family | null;
  x: number;
  y: number;
  /** Roads out. A crossroads is a bigger place than a road's end. */
  degree: number;
}

export interface WorldEdge {
  a: ZoneId;
  b: ZoneId;
  /**
   * The portals whose door, once the fog has reached it, draws this road. One
   * per direction: the first hop out of either end.
   */
  gates: string[];
  /** The road's bends, in map units. */
  path: [number, number][];
}

export interface WorldChart {
  nodes: Map<ZoneId, WorldNode>;
  edges: WorldEdge[];
  span: Span;
  land: Continent;
  paint: HTMLCanvasElement;
  relief: Mark[];
  /** The rivers as the pen draws them: smoothed, evenly sampled, tapered. */
  rivers: Ribbon[];
}

/** The graph laid out, which is all the main thread does; the rest is `raiseWorld` on the pool. */
export interface WorldLayout {
  nodes: Map<ZoneId, WorldNode>;
  edges: WorldEdge[];
  span: Span;
  ask: WorldAsk;
}

/**
 * Folds every interior into the outdoor zone it hangs off, lays the result
 * out, and raises the continent under it. Run once per content load; nothing
 * about it depends on what the player has found, so a node does not move when
 * its neighbours appear.
 */
export function layoutWorld(zones: Map<ZoneId, Zone>, portals: PortalGraph): WorldLayout {
  const nodes = new Map<ZoneId, WorldNode>();
  for (const [id, zone] of zones) {
    // Outdoors, and authored. A gallery or a showcase written in code is a room
    // built to judge one system in, not a place anybody travels to.
    if (!zone.environment.sky || !isDocumentZone(id)) continue;
    nodes.set(id, {
      id,
      name: zone.name,
      family: familyOf(zone.environment.vibe),
      x: 0,
      y: 0,
      degree: 0,
    });
  }

  const edges = new Map<string, Omit<WorldEdge, 'path'>>();
  for (const from of nodes.keys()) {
    for (const side of portals.in(from)) {
      for (const reached of outdoorsBeyond(zones, portals, from, side.target.zone)) {
        if (reached === from || !nodes.has(reached)) continue;
        const key = from < reached ? `${from}|${reached}` : `${reached}|${from}`;
        const held = edges.get(key);
        if (held) {
          if (!held.gates.includes(side.portal)) held.gates.push(side.portal);
        } else {
          const [a, b] = key.split('|');
          edges.set(key, { a, b, gates: [side.portal] });
        }
      }
    }
  }

  const bare = [...edges.values()];
  relax(nodes, bare, zones);
  const list: WorldEdge[] = bare.map((edge) => {
    const a = nodes.get(edge.a) as WorldNode;
    const b = nodes.get(edge.b) as WorldNode;
    a.degree++;
    b.degree++;
    return { ...edge, path: route(a.x, a.y, b.x, b.y, roadSeed(edge)) };
  });
  uncross(list, nodes);

  const span = spanOf(nodes);
  const seed = hashString([...nodes.keys()].sort().join('|'));
  const sites: Site[] = [...nodes.values()].map((node) => ({ x: node.x, y: node.y, family: node.family }));
  return { nodes, edges: list, span, ask: { sites, roads: list.map((edge) => edge.path), span, seed } };
}

/** The chart, once the pool has raised the world the layout asked for. */
export function chartFrom(layout: WorldLayout, raised: WorldRaised): WorldChart {
  return {
    nodes: layout.nodes,
    edges: layout.edges,
    span: layout.span,
    land: raised.land,
    paint: paintCanvas(raised.land.cols, raised.land.rows, raised.pixels),
    relief: raised.relief,
    rivers: raised.rivers,
  };
}

function roadSeed(edge: { a: ZoneId; b: ZoneId }): number {
  return hashString(`road:${edge.a}|${edge.b}`);
}

/** Bends tried for a road that crosses another, after its own: less and less, then none. */
const STRAIGHTER = [0.13, 0.13, 0.13, 0.08, 0.08, 0.04, 0];

/**
 * Two roads may meet at a place and nowhere else. A road that crosses another
 * is redrawn with a different wander, then a lesser one, then straight, until
 * it clears — in document order, so the result is the same everywhere.
 */
function uncross(list: WorldEdge[], nodes: Map<ZoneId, WorldNode>): void {
  const crossesAny = (i: number): boolean => list.some((other, j) => j !== i && crosses(list[i].path, other.path));
  for (let sweep = 0; sweep < 3; sweep++) {
    let clean = true;
    for (let i = 0; i < list.length; i++) {
      if (!crossesAny(i)) continue;
      clean = false;
      const edge = list[i];
      const a = nodes.get(edge.a) as WorldNode;
      const b = nodes.get(edge.b) as WorldNode;
      for (let attempt = 0; attempt < STRAIGHTER.length; attempt++) {
        edge.path = route(a.x, a.y, b.x, b.y, roadSeed(edge) + attempt * 7919, STRAIGHTER[attempt]);
        if (!crossesAny(i)) break;
      }
    }
    if (clean) return;
  }
}

/** Whether two polylines cross anywhere but at a shared end. */
function crosses(p: readonly [number, number][], q: readonly [number, number][]): boolean {
  for (let i = 0; i + 1 < p.length; i++) {
    for (let j = 0; j + 1 < q.length; j++) {
      if (segmentsCross(p[i], p[i + 1], q[j], q[j + 1])) return true;
    }
  }
  return false;
}

function segmentsCross(a: [number, number], b: [number, number], c: [number, number], d: [number, number]): boolean {
  const rx = b[0] - a[0];
  const ry = b[1] - a[1];
  const sx = d[0] - c[0];
  const sy = d[1] - c[1];
  const den = rx * sy - ry * sx;
  if (Math.abs(den) < 1e-12) return false;
  const t = ((c[0] - a[0]) * sy - (c[1] - a[1]) * sx) / den;
  const u = ((c[0] - a[0]) * ry - (c[1] - a[1]) * rx) / den;
  const inside = 1e-6;
  return t > inside && t < 1 - inside && u > inside && u < 1 - inside;
}

/**
 * Which outdoor zones a step through one door eventually reaches, without
 * passing through another outdoor zone on the way. A tunnel or a house with a
 * back door onto another street is one road, not two.
 */
function outdoorsBeyond(
  zones: Map<ZoneId, Zone>,
  portals: PortalGraph,
  from: ZoneId,
  first: ZoneId,
): ZoneId[] {
  const zone = zones.get(first);
  if (!zone) return [];
  if (zone.environment.sky) return [first];
  const out: ZoneId[] = [];
  const walked = new Set<ZoneId>([from, first]);
  const frontier = [first];
  while (frontier.length > 0) {
    const at = frontier.pop() as ZoneId;
    for (const side of portals.in(at)) {
      const next = side.target.zone;
      if (walked.has(next)) continue;
      walked.add(next);
      const beyond = zones.get(next);
      if (!beyond) continue;
      if (beyond.environment.sky) out.push(next);
      else frontier.push(next);
    }
  }
  return out;
}

/**
 * A placed zone is pinned where its `place` says. The rest start from a hash
 * of their id and relax: springs on the roads, repulsion everywhere else.
 */
function relax(
  nodes: Map<ZoneId, WorldNode>,
  edges: readonly { a: ZoneId; b: ZoneId }[],
  zones: Map<ZoneId, Zone>,
): void {
  const list = [...nodes.values()];
  const pinned = new Set<ZoneId>();
  for (const node of list) {
    const place = zones.get(node.id)?.place;
    if (place) {
      node.x = place.at[0] / KM_PER_ROAD;
      node.y = place.at[1] / KM_PER_ROAD;
      pinned.add(node.id);
      continue;
    }
    const hash = hashString(`world:${node.id}`);
    const angle = ((hash >>> 8) / 16777216) * Math.PI * 2;
    const away = 0.4 + ((hash & 255) / 255) * ROAD * list.length * 0.2;
    node.x = Math.cos(angle) * away;
    node.y = Math.sin(angle) * away;
  }

  for (let step = 0; step < STEPS; step++) {
    for (const edge of edges) {
      const a = nodes.get(edge.a);
      const b = nodes.get(edge.b);
      if (!a || !b) continue;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const away = Math.hypot(dx, dy) || 0.001;
      const move = ((away - ROAD) / away) * PULL;
      if (!pinned.has(a.id)) {
        a.x += dx * move;
        a.y += dy * move;
      }
      if (!pinned.has(b.id)) {
        b.x -= dx * move;
        b.y -= dy * move;
      }
    }
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        const a = list[i];
        const b = list[j];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const away = Math.hypot(dx, dy) || 0.001;
        if (away >= ROAD * 1.7) continue;
        const move = ((ROAD * 1.7 - away) / away) * PUSH;
        if (!pinned.has(a.id)) {
          a.x -= dx * move;
          a.y -= dy * move;
        }
        if (!pinned.has(b.id)) {
          b.x += dx * move;
          b.y += dy * move;
        }
      }
    }
  }

  let cx = 0;
  let cy = 0;
  for (const node of list) {
    cx += node.x / list.length;
    cy += node.y / list.length;
  }
  for (const node of list) {
    node.x -= cx;
    node.y -= cy;
  }
}

function spanOf(nodes: Map<ZoneId, WorldNode>): Span {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const node of nodes.values()) {
    minX = Math.min(minX, node.x);
    minY = Math.min(minY, node.y);
    maxX = Math.max(maxX, node.x);
    maxY = Math.max(maxY, node.y);
  }
  if (!Number.isFinite(minX)) return { x: -1, y: -1, w: 2, h: 2 };
  const margin = ROAD * OFFING;
  return {
    x: minX - margin,
    y: minY - margin,
    w: maxX - minX + margin * 2,
    h: maxY - minY + margin * 2,
  };
}

/** What the player has found, which is all that decides what is drawn. */
export interface Discovery {
  visited: ReadonlySet<ZoneId>;
  found: ReadonlySet<string>;
  here: ZoneId | null;
}

/** Type size of a place's name, in print pixels, what a road out adds to it, and the clear space kept around it. */
const NAME = 24;
const NAME_PER_ROAD = 1.5;
const NAME_MOST = 32;
/** Window pixels a name never drops below, however far out the view is. */
const NAME_LEAST = 16;
const NAME_GAP = 9;
const NAME_PAD = 7;

/** A name, placed and reserved. */
interface Placed {
  node: WorldNode;
  x: number;
  y: number;
  text: string;
  size: number;
  /** Baseline top of the text, which may be under the node or over it. */
  top: number;
  box: Box;
}

/** A name's footprint in pixels, so two names can stand clear of each other. */
interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

export function drawWorld(
  context: CanvasRenderingContext2D,
  w: number,
  h: number,
  view: ChartView,
  chart: WorldChart,
  seen: Discovery,
  ink: Sheet,
): void {
  const density = ink.density;
  inPixels(context, density);
  context.clearRect(0, 0, w, h);
  context.fillStyle = PALETTE.parchment;
  context.fillRect(0, 0, w, h);

  const roads = chart.edges.filter(
    (edge) => edge.gates.some((id) => seen.found.has(id)) || both(seen.visited, edge),
  );
  const shown = new Set<ZoneId>();
  for (const id of seen.visited) if (chart.nodes.has(id)) shown.add(id);
  for (const road of roads) {
    shown.add(road.a);
    shown.add(road.b);
  }
  const places = [...shown].map((id) => chart.nodes.get(id)).filter((node): node is WorldNode => !!node);

  const point: [number, number] = [0, 0];
  const at = (node: WorldNode): [number, number] => {
    view.project(node.x, node.y, w, h, point);
    return [point[0], point[1]];
  };

  const radius = NODE * view.scale;
  // Print pixels to window pixels.
  const k = view.scale / PRINT;

  // Names first, because everything else has to stand clear of them. A place
  // reads below its own mark unless that would sit on a name already placed.
  context.textAlign = 'center';
  const named: Placed[] = [];
  for (const node of places) {
    const [x, y] = at(node);
    const text = node.name;
    const size = Math.max(NAME_LEAST, Math.min(NAME_MOST, NAME + NAME_PER_ROAD * Math.max(0, node.degree - 1)) * k);
    context.font = `600 ${size}px ${ink.prose}`;
    const width = context.measureText(text).width;
    const under = y + radius + NAME_GAP * k;
    const over = y - radius - NAME_GAP * k - size;
    const boxAt = (top: number): Box => ({
      x: x - width / 2 - NAME_PAD * k,
      y: top - NAME_PAD * k,
      w: width + NAME_PAD * k * 2,
      h: size + NAME_PAD * k * 2,
    });
    let top = under;
    if (named.some((other) => overlaps(other.box, boxAt(under)))) top = over;
    const box = boxAt(top);
    named.push({ node, x, y, text, size, top, box });
  }

  // The shape of the land is known from the start; the land itself is not.
  trace(context, view, w, h, density, chart.land.coast);
  context.strokeStyle = PALETTE.ink;
  context.globalAlpha = 0.3;
  context.lineWidth = 1 * k;
  context.stroke();
  context.globalAlpha = 1;

  drawFound(context, w, h, view, chart, places, roads, density, k);

  drawRhumbs(context, w, h, view, chart, density, k);
  drawRoads(context, chart, roads, at, k);
  for (const placed of named) {
    drawTown(context, placed.x, placed.y, radius, placed.node.id === seen.here, k);
  }

  // Last, over everything, and cased in the ground colour so a road that does
  // pass beneath one cannot break it up.
  context.textAlign = 'center';
  context.textBaseline = 'top';
  context.lineJoin = 'round';
  for (const placed of named) {
    context.font = `600 ${placed.size}px ${ink.prose}`;
    context.lineWidth = Math.max(3, 4 * k);
    context.strokeStyle = PALETTE.parchment;
    context.strokeText(placed.text, placed.x, placed.top);
    context.fillStyle = placed.node.id === seen.here ? PALETTE.road : PALETTE.ink;
    context.fillText(placed.text, placed.x, placed.top);
  }

  drawCompass(context, 44, h - 44, 30, ink);
  drawCartouche(context, w, ink);
}

/**
 * The painted country, over the found places and along the found roads and
 * fading out past them, laid down on its own layer and then cut to that
 * shape — everything on it, from the paint to the last tree, is one picture.
 */
function drawFound(
  context: CanvasRenderingContext2D,
  w: number,
  h: number,
  view: ChartView,
  chart: WorldChart,
  places: readonly WorldNode[],
  roads: readonly WorldEdge[],
  density: number,
  k: number,
): void {
  if (places.length === 0) return;
  const layer = scratch(0, w, h, density);
  const lc = layer.getContext('2d');
  const mask = scratch(1, w, h, density);
  const mc = mask.getContext('2d');
  if (!lc || !mc) return;
  const land = chart.land;

  inPixels(lc, density);
  lc.clearRect(0, 0, w, h);
  lc.save();
  lc.setTransform(...view.matrix(w, h, density));
  lc.imageSmoothingEnabled = true;
  lc.imageSmoothingQuality = 'high';
  lc.drawImage(chart.paint, land.span.x, land.span.y, land.span.w, land.span.h);
  lc.restore();
  inPixels(lc, density);

  lc.lineJoin = 'round';
  lc.lineCap = 'round';
  land.ripples.forEach((loops, i) => {
    trace(lc, view, w, h, density, loops);
    lc.strokeStyle = PALETTE.parchment;
    lc.globalAlpha = [0.4, 0.28, 0.18][i] ?? 0.15;
    lc.lineWidth = 0.9 * k;
    lc.stroke();
  });
  lc.globalAlpha = 1;

  trace(lc, view, w, h, density, land.lakes);
  lc.fillStyle = PALETTE.shallows;
  lc.fill();
  lc.strokeStyle = PALETTE.ink;
  lc.lineWidth = 1 * k;
  lc.globalAlpha = 0.7;
  lc.stroke();
  lc.globalAlpha = 1;

  trace(lc, view, w, h, density, land.coast);
  lc.strokeStyle = PALETTE.parchment;
  lc.globalAlpha = 0.55;
  lc.lineWidth = 4 * k;
  lc.stroke();
  lc.globalAlpha = 1;
  lc.strokeStyle = PALETTE.ink;
  lc.lineWidth = 1.4 * k;
  lc.stroke();

  const visible = (x: number, y: number): boolean => {
    for (const node of places) {
      if (Math.hypot(x - node.x, y - node.y) <= REVEAL * ROAD) return true;
    }
    const half = (REVEAL_ROAD * ROAD) / 2;
    for (const road of roads) {
      for (const [px, py] of road.path) {
        if (Math.hypot(x - px, y - py) <= half) return true;
      }
    }
    return false;
  };
  drawRelief(lc, chart.relief, view, w, h, visible);
  // Over the coast line, so a mouth breaks it, and over the marks: water is
  // the last thing the pen lays down on the land.
  drawRivers(lc, w, h, view, chart, k);

  // The cut: soft discs about the places and soft bands along the roads.
  inPixels(mc, density);
  mc.clearRect(0, 0, w, h);
  mc.filter = `blur(${Math.max(6, REVEAL_FADE * ROAD * view.scale)}px)`;
  mc.fillStyle = '#fff';
  mc.strokeStyle = '#fff';
  mc.lineCap = 'round';
  mc.lineJoin = 'round';
  const point: [number, number] = [0, 0];
  for (const node of places) {
    view.project(node.x, node.y, w, h, point);
    mc.beginPath();
    mc.arc(point[0], point[1], REVEAL * ROAD * view.scale, 0, Math.PI * 2);
    mc.fill();
  }
  mc.lineWidth = REVEAL_ROAD * ROAD * view.scale;
  for (const road of roads) {
    mc.beginPath();
    road.path.forEach(([x, y], i) => {
      view.project(x, y, w, h, point);
      if (i === 0) mc.moveTo(point[0], point[1]);
      else mc.lineTo(point[0], point[1]);
    });
    mc.stroke();
  }
  mc.filter = 'none';

  lc.globalCompositeOperation = 'destination-in';
  lc.drawImage(mask, 0, 0, w, h);
  lc.globalCompositeOperation = 'source-over';

  context.drawImage(layer, 0, 0, w, h);
}

/**
 * Each river as a filled ribbon — a hair at the source, a proper channel at
 * the mouth — with an ink edge and a pale thread down the middle, the way a
 * printed map draws water rather than a line.
 */
function drawRivers(
  context: CanvasRenderingContext2D,
  w: number,
  h: number,
  view: ChartView,
  chart: WorldChart,
  k: number,
): void {
  const point: [number, number] = [0, 0];
  const left: [number, number][] = [];
  const right: [number, number][] = [];
  context.lineCap = 'round';
  context.lineJoin = 'round';
  for (const river of chart.rivers) {
    const pts = river.points;
    if (pts.length < 2) continue;
    left.length = 0;
    right.length = 0;
    for (let i = 0; i < pts.length; i++) {
      const [ax, ay] = pts[Math.max(0, i - 1)];
      const [bx, by] = pts[Math.min(pts.length - 1, i + 1)];
      const length = Math.hypot(bx - ax, by - ay) || 1;
      const nx = -(by - ay) / length;
      const ny = (bx - ax) / length;
      const half = river.widths[i];
      view.project(pts[i][0] + nx * half, pts[i][1] + ny * half, w, h, point);
      left.push([point[0], point[1]]);
      view.project(pts[i][0] - nx * half, pts[i][1] - ny * half, w, h, point);
      right.push([point[0], point[1]]);
    }

    context.beginPath();
    context.moveTo(left[0][0], left[0][1]);
    for (let i = 1; i < left.length; i++) context.lineTo(left[i][0], left[i][1]);
    for (let i = right.length - 1; i >= 0; i--) context.lineTo(right[i][0], right[i][1]);
    context.closePath();
    // A pale casing first, so the channel stands off the paint it crosses.
    context.strokeStyle = PALETTE.parchment;
    context.globalAlpha = 0.6;
    context.lineWidth = 2.2 * k;
    context.stroke();
    context.globalAlpha = 1;
    context.fillStyle = PALETTE.river;
    context.fill();
    context.strokeStyle = PALETTE.ink;
    context.globalAlpha = 0.55;
    context.lineWidth = 0.7 * k;
    context.stroke();
    context.globalAlpha = 1;

    // The thread of light down the middle, from where the river is wide enough to carry one.
    context.beginPath();
    let started = false;
    for (let i = 0; i < pts.length; i++) {
      if (river.widths[i] * view.scale < 2.2 * k) continue;
      view.project(pts[i][0], pts[i][1], w, h, point);
      if (!started) {
        context.moveTo(point[0], point[1]);
        started = true;
      } else context.lineTo(point[0], point[1]);
    }
    if (started) {
      context.strokeStyle = PALETTE.parchment;
      context.globalAlpha = 0.35;
      context.lineWidth = 0.8 * k;
      context.stroke();
      context.globalAlpha = 1;
    }
  }
}

/** Straight lines radiating over the sea from points off the land, and never over it. */
function drawRhumbs(
  context: CanvasRenderingContext2D,
  w: number,
  h: number,
  view: ChartView,
  chart: WorldChart,
  density: number,
  k: number,
): void {
  const span = chart.land.span;
  const reach = Math.hypot(span.w, span.h) * 3;
  const centres: [number, number][] = [
    [span.x - span.w * 0.08, span.y - span.h * 0.06],
    [span.x + span.w * 1.08, span.y + span.h * 1.05],
    [span.x + span.w * 1.05, span.y + span.h * 0.22],
  ];
  context.save();
  // The sheet less the land is the sea.
  trace(context, view, w, h, density, chart.land.coast);
  context.rect(0, 0, w, h);
  context.clip('evenodd');
  context.setTransform(...view.matrix(w, h, density));
  context.beginPath();
  for (const [cx, cy] of centres) {
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      context.moveTo(cx, cy);
      context.lineTo(cx + Math.cos(angle) * reach, cy + Math.sin(angle) * reach);
    }
  }
  inPixels(context, density);
  context.strokeStyle = PALETTE.ink;
  context.globalAlpha = 0.13;
  context.lineWidth = 0.8 * k;
  context.stroke();
  context.restore();
  inPixels(context, density);
  context.globalAlpha = 1;
}

/** The roads, drawn twice: a pale casing and the red line over it, the way a pen goes over a route already laid down. */
function drawRoads(
  context: CanvasRenderingContext2D,
  chart: WorldChart,
  roads: readonly WorldEdge[],
  at: (node: WorldNode) => [number, number],
  k: number,
): void {
  context.lineCap = 'round';
  context.lineJoin = 'round';
  for (const road of roads) {
    const a = chart.nodes.get(road.a);
    const b = chart.nodes.get(road.b);
    if (!a || !b) continue;
    const [ax, ay] = at(a);
    const [bx, by] = at(b);
    const path = route(ax, ay, bx, by, roadSeed(road));
    context.strokeStyle = PALETTE.parchment;
    context.globalAlpha = 0.75;
    context.lineWidth = 4.2 * k;
    through(context, path);
    context.stroke();
    context.strokeStyle = PALETTE.road;
    context.globalAlpha = 1;
    context.lineWidth = 2 * k;
    through(context, path);
    context.stroke();
  }
  context.globalAlpha = 1;
}

/**
 * A place: a red disc in a pale ring in an ink ring, four ticks at the
 * cardinals. The one you are standing in sits in a red halo under a heavy
 * double ring, and its name is set in red.
 */
function drawTown(context: CanvasRenderingContext2D, x: number, y: number, r: number, here: boolean, k: number): void {
  context.lineCap = 'butt';
  context.strokeStyle = PALETTE.ink;

  if (here) {
    const reach = Math.max(r * 2.6, 14);
    context.beginPath();
    context.arc(x, y, reach, 0, Math.PI * 2);
    context.fillStyle = PALETTE.road;
    context.globalAlpha = 0.22;
    context.fill();
    context.globalAlpha = 1;
    context.lineWidth = Math.max(2, 2.4 * k);
    context.strokeStyle = PALETTE.road;
    context.beginPath();
    context.arc(x, y, reach, 0, Math.PI * 2);
    context.stroke();
    context.lineWidth = Math.max(1.5, 1.8 * k);
    context.strokeStyle = PALETTE.ink;
    context.beginPath();
    context.arc(x, y, Math.max(r * 1.85, 10), 0, Math.PI * 2);
    context.stroke();
  }

  context.globalAlpha = 0.5;
  context.lineWidth = 1 * k;
  for (const angle of [0, Math.PI / 2, Math.PI, -Math.PI / 2]) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    context.beginPath();
    context.moveTo(x + cos * r * 1.22, y + sin * r * 1.22);
    context.lineTo(x + cos * r * 1.62, y + sin * r * 1.62);
    context.stroke();
  }
  context.globalAlpha = 1;

  context.beginPath();
  context.arc(x, y, r, 0, Math.PI * 2);
  context.fillStyle = PALETTE.parchment;
  context.fill();
  context.lineWidth = 1.6 * k;
  context.stroke();

  context.beginPath();
  context.arc(x, y, r * 0.66, 0, Math.PI * 2);
  context.fillStyle = PALETTE.road;
  context.fill();

  context.beginPath();
  context.arc(x, y, r * 0.2, 0, Math.PI * 2);
  context.fillStyle = here ? PALETTE.ink : PALETTE.parchment;
  context.fill();
}

/** An eight-point rose, each point half in ink and half in paper, north in red. */
function drawCompass(context: CanvasRenderingContext2D, x: number, y: number, r: number, ink: Sheet): void {
  context.lineJoin = 'miter';
  context.lineWidth = 1;
  context.beginPath();
  context.arc(x, y, r * 0.78, 0, Math.PI * 2);
  context.strokeStyle = PALETTE.ink;
  context.globalAlpha = 0.5;
  context.stroke();
  context.globalAlpha = 1;
  const arm = (angle: number, length: number, width: number, red: boolean): void => {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const tipX = x + cos * length;
    const tipY = y + sin * length;
    const leftX = x - sin * width;
    const leftY = y + cos * width;
    const rightX = x + sin * width;
    const rightY = y - cos * width;
    context.beginPath();
    context.moveTo(tipX, tipY);
    context.lineTo(leftX, leftY);
    context.lineTo(x, y);
    context.closePath();
    context.fillStyle = red ? PALETTE.road : PALETTE.ink;
    context.fill();
    context.beginPath();
    context.moveTo(tipX, tipY);
    context.lineTo(rightX, rightY);
    context.lineTo(x, y);
    context.closePath();
    context.fillStyle = PALETTE.parchment;
    context.fill();
    context.strokeStyle = PALETTE.ink;
    context.stroke();
  };
  for (let i = 0; i < 4; i++) arm(Math.PI / 4 + (i * Math.PI) / 2, r * 0.55, r * 0.1, false);
  // Up the sheet is north, which is -y.
  for (let i = 0; i < 4; i++) arm(-Math.PI / 2 + (i * Math.PI) / 2, r, r * 0.16, i === 0);
  context.beginPath();
  context.arc(x, y, r * 0.09, 0, Math.PI * 2);
  context.fillStyle = PALETTE.parchment;
  context.fill();
  context.stroke();
  context.font = `700 ${Math.round(r * 0.42)}px ${ink.prose}`;
  context.textAlign = 'center';
  context.textBaseline = 'bottom';
  context.fillStyle = PALETTE.ink;
  context.fillText('N', x, y - r - 3);
}

/** The land's name in a framed box, top right. */
function drawCartouche(context: CanvasRenderingContext2D, w: number, ink: Sheet): void {
  const text = LAND_NAME.toUpperCase();
  const size = 15;
  const spacing = 4;
  context.font = `600 ${size}px ${ink.prose}`;
  let width = 0;
  for (const ch of text) width += context.measureText(ch).width + spacing;
  width -= spacing;
  const padX = 16;
  const padY = 9;
  const boxW = width + padX * 2;
  const boxH = size + padY * 2;
  const x = w - 18 - boxW;
  const y = 18;
  context.fillStyle = PALETTE.parchment;
  context.fillRect(x, y, boxW, boxH);
  context.strokeStyle = PALETTE.ink;
  context.lineWidth = 1.2;
  context.strokeRect(x, y, boxW, boxH);
  context.lineWidth = 0.6;
  context.strokeRect(x + 3, y + 3, boxW - 6, boxH - 6);
  for (const side of [x, x + boxW]) {
    context.beginPath();
    context.moveTo(side, y + boxH / 2 - 4);
    context.lineTo(side - 4, y + boxH / 2);
    context.lineTo(side, y + boxH / 2 + 4);
    context.lineTo(side + 4, y + boxH / 2);
    context.closePath();
    context.fillStyle = PALETTE.parchment;
    context.fill();
    context.lineWidth = 1;
    context.stroke();
  }
  context.textAlign = 'left';
  context.textBaseline = 'top';
  context.fillStyle = PALETTE.ink;
  let pen = x + padX;
  for (const ch of text) {
    context.fillText(ch, pen, y + padY);
    pen += context.measureText(ch).width + spacing;
  }
}

/**
 * Lays down closed loops in map units as the current path, then puts the
 * transform back so the stroke that follows is in pixels. A path is kept in
 * device space once built, so the width does not scale with the chart.
 */
function trace(
  context: CanvasRenderingContext2D,
  view: ChartView,
  w: number,
  h: number,
  density: number,
  loops: readonly Loop[],
): void {
  context.setTransform(...view.matrix(w, h, density));
  context.beginPath();
  for (const loop of loops) {
    if (loop.length < 2) continue;
    context.moveTo(loop[0][0], loop[0][1]);
    for (let i = 1; i < loop.length; i++) context.lineTo(loop[i][0], loop[i][1]);
    context.closePath();
  }
  inPixels(context, density);
}

const SCRATCH: HTMLCanvasElement[] = [];

/** A working canvas the size of the window, kept between draws. */
function scratch(slot: number, w: number, h: number, density: number): HTMLCanvasElement {
  const canvas = (SCRATCH[slot] ??= document.createElement('canvas'));
  const pw = Math.max(1, Math.round(w * density));
  const ph = Math.max(1, Math.round(h * density));
  if (canvas.width !== pw || canvas.height !== ph) {
    canvas.width = pw;
    canvas.height = ph;
  }
  return canvas;
}

function overlaps(a: Box, b: Box): boolean {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function both(visited: ReadonlySet<ZoneId>, edge: WorldEdge): boolean {
  return visited.has(edge.a) && visited.has(edge.b);
}
