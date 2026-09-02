import { createRng } from '../../art/random';
import { buildContinent, ROAD, type Continent, type Site, type Span } from './continent';
import { paintPixels } from './paint';
import { placeRelief, type Mark } from './relief';

/**
 * Raising the world: everything about the chart that is arithmetic over the
 * graph — the continent, its paint, its marks and its rivers — as a pure
 * function of an ask, so the pool can do it while the game loads.
 */

/** What the pool is handed: the places, the roads between them, the sheet and the seed. */
export interface WorldAsk {
  sites: Site[];
  roads: [number, number][][];
  span: Span;
  seed: number;
}

export interface WorldRaised {
  land: Continent;
  /** RGBA, `land.cols` by `land.rows`. */
  pixels: Uint8ClampedArray<ArrayBuffer>;
  relief: Mark[];
  rivers: Ribbon[];
}

/** A river's centreline and its half-width at every point, in map units. */
export interface Ribbon {
  points: [number, number][];
  widths: number[];
}

/**
 * How far the sheet runs on past the places, in roads, before the raster's
 * own edge. What lies out there is country nobody can reach: land raised by
 * phantom places, so the world the map shows is larger than the world the
 * player can walk.
 */
const BEYOND = 3.5;
/** Sea between the known island and the far country, in roads. */
const STRAIT = 1.0;
/** How many far masses there are, and how big each is, in roads. */
const MASSES: [number, number] = [2, 4];
const MASS_REACH: [number, number] = [1.1, 1.7];

export function raiseWorld(ask: WorldAsk): WorldRaised {
  const far = beyond(ask.span, ask.seed);
  const land = buildContinent([...ask.sites, ...far.sites], [...ask.roads, ...far.roads], far.span, ask.seed);
  return {
    land,
    pixels: paintPixels(land),
    relief: placeRelief(land, ask.sites, ask.seed),
    rivers: land.rivers.map((river) => ribbon(river, ask.seed)),
  };
}

/** Every buffer in a raised world, for the transfer list. */
export function raisedBuffers(raised: WorldRaised): ArrayBufferLike[] {
  const c = raised.land;
  return [
    c.land.buffer,
    c.lake.buffer,
    c.shore.buffer,
    c.height.buffer,
    c.wet.buffer,
    c.blight.buffer,
    c.shade.buffer,
    c.fresh.buffer,
    raised.pixels.buffer,
  ];
}

/** Half-width of a river at its mouth for a given flux, in roads. */
const RIVER_MOUTH = 0.011;
const RIVER_SOURCE = 0.0018;
/** Map units between the pen's samples along a river. */
const RIVER_STEP = 0.012;
/** How far a river runs on past the coast into the sea, in roads. */
const RIVER_REACH = 0.035;
/** The meander: a warp of the sheet, two waves, amplitude and wavelength in roads. */
const MEANDER: [number, number][] = [
  [0.045, 0.34],
  [0.016, 0.11],
];

/**
 * A river off the raster, made drawable: walked at an even step, bent by a
 * warp of the whole sheet — the same one for every river, so a tributary
 * still meets its river — smoothed twice so the descent's grid corners go,
 * run on past the coast, and given a width that grows from a hair at the
 * source to a mouth sized by what has joined it.
 */
function ribbon(river: { points: [number, number][]; flux: number }, seed: number): Ribbon {
  let points = resample(river.points, RIVER_STEP * ROAD);
  points = points.map(([x, y]) => {
    let dx = 0;
    let dy = 0;
    for (const [amount, wave] of MEANDER) {
      dx += (wobble(x / (wave * ROAD), y / (wave * ROAD), seed) - 0.5) * 2 * amount * ROAD;
      dy += (wobble(x / (wave * ROAD), y / (wave * ROAD), seed + 31) - 0.5) * 2 * amount * ROAD;
    }
    return [x + dx, y + dy];
  });
  points = chaikin(chaikin(points));
  if (points.length >= 2) {
    const [ax, ay] = points[points.length - 2];
    const [bx, by] = points[points.length - 1];
    const length = Math.hypot(bx - ax, by - ay) || 1;
    points.push([bx + ((bx - ax) / length) * RIVER_REACH * ROAD, by + ((by - ay) / length) * RIVER_REACH * ROAD]);
  }
  const mouth = (RIVER_SOURCE + (RIVER_MOUTH - RIVER_SOURCE) * Math.min(1, river.flux / 4)) * ROAD;
  const widths = points.map((_, i) => {
    const t = points.length > 1 ? i / (points.length - 1) : 1;
    return RIVER_SOURCE * ROAD + (mouth - RIVER_SOURCE * ROAD) * Math.pow(t, 1.3);
  });
  return { points, widths };
}

/** Smooth value noise, 0..1, continuous across the sheet. */
function wobble(x: number, y: number, seed: number): number {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const fx = x - x0;
  const fy = y - y0;
  const sx = fx * fx * (3 - 2 * fx);
  const sy = fy * fy * (3 - 2 * fy);
  const corner = (cx: number, cy: number): number => {
    let h = Math.imul(cx * 374761393 + cy * 668265263 + seed * 1442695041, 1274126177);
    h ^= h >>> 13;
    h = Math.imul(h, 1103515245);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
  };
  const top = corner(x0, y0) + (corner(x0 + 1, y0) - corner(x0, y0)) * sx;
  const bottom = corner(x0, y0 + 1) + (corner(x0 + 1, y0 + 1) - corner(x0, y0 + 1)) * sx;
  return top + (bottom - top) * sy;
}

function resample(points: readonly [number, number][], step: number): [number, number][] {
  if (points.length < 2) return points.map(([x, y]) => [x, y]);
  const out: [number, number][] = [[points[0][0], points[0][1]]];
  let carry = 0;
  for (let i = 1; i < points.length; i++) {
    const [ax, ay] = points[i - 1];
    const [bx, by] = points[i];
    const length = Math.hypot(bx - ax, by - ay);
    let along = step - carry;
    while (along <= length) {
      const t = along / length;
      out.push([ax + (bx - ax) * t, ay + (by - ay) * t]);
      along += step;
    }
    carry = length - (along - step);
  }
  const last = points[points.length - 1];
  out.push([last[0], last[1]]);
  return out;
}

/** One pass of corner cutting, ends held. */
function chaikin(points: readonly [number, number][]): [number, number][] {
  if (points.length < 3) return points.map(([x, y]) => [x, y]);
  const out: [number, number][] = [[points[0][0], points[0][1]]];
  for (let i = 0; i + 1 < points.length; i++) {
    const [ax, ay] = points[i];
    const [bx, by] = points[i + 1];
    out.push([ax * 0.75 + bx * 0.25, ay * 0.75 + by * 0.25]);
    out.push([ax * 0.25 + bx * 0.75, ay * 0.25 + by * 0.75]);
  }
  const last = points[points.length - 1];
  out.push([last[0], last[1]]);
  return out;
}

/**
 * The country past the places: a sheet run out unevenly on every side, and a
 * few solid masses of land standing off across a strait — each a knot of
 * phantom places packed close and ridged together, so the noise carves bays
 * into its coast but never a hole in its middle. They run out to the sheet's
 * edge, where the land fades away, so the far country is seen only in part.
 */
function beyond(span: Span, seed: number): { span: Span; sites: Site[]; roads: [number, number][][] } {
  const rng = createRng(seed ^ 0xbe70d);
  const pad = [rng.range(0.6, 1.4), rng.range(0.6, 1.4), rng.range(0.6, 1.4), rng.range(0.6, 1.4)].map(
    (side) => side * BEYOND * ROAD,
  );
  const outer: Span = {
    x: span.x - pad[0],
    y: span.y - pad[1],
    w: span.w + pad[0] + pad[2],
    h: span.h + pad[1] + pad[3],
  };

  // The island's own reach: its places and their bumps, with a strait past that.
  const cx = span.x + span.w / 2;
  const cy = span.y + span.h / 2;
  const clear = Math.hypot(span.w, span.h) / 2 + STRAIT * ROAD;

  const sites: Site[] = [];
  const roads: [number, number][][] = [];
  const masses = rng.int(MASSES[0], MASSES[1]);
  const turn = rng.range(0, Math.PI * 2);
  for (let m = 0; m < masses; m++) {
    const reach = rng.range(MASS_REACH[0], MASS_REACH[1]) * ROAD;
    // Round the island, each in its own sector, and far enough out that the
    // mass's own bumps stop short of the strait.
    const angle = turn + ((m + rng.range(-0.25, 0.25)) / masses) * Math.PI * 2;
    const away = clear + reach * 0.9 + rng.range(0, 0.6) * ROAD;
    let mx = cx + Math.cos(angle) * away;
    let my = cy + Math.sin(angle) * away;
    // Held on the sheet, but only just: what runs off the edge fades into sea.
    const keep = 0.6 * ROAD;
    mx = Math.min(outer.x + outer.w - keep, Math.max(outer.x + keep, mx));
    my = Math.min(outer.y + outer.h - keep, Math.max(outer.y + keep, my));

    // A knot of places, packed close enough that their bumps sum past any dip
    // in the noise, and ridged in a ring and to the middle.
    const knot: Site[] = [{ x: mx, y: my, family: null }];
    const count = 5 + Math.round((reach / ROAD) * 3);
    for (let k = 0; k < count; k++) {
      const a = (k / count) * Math.PI * 2 + rng.range(-0.3, 0.3);
      const d = reach * rng.range(0.45, 0.85);
      knot.push({ x: mx + Math.cos(a) * d, y: my + Math.sin(a) * d, family: null });
    }
    for (let k = 1; k < knot.length; k++) {
      roads.push(ridge(knot[k], knot[0]));
      roads.push(ridge(knot[k], knot[k === knot.length - 1 ? 1 : k + 1]));
    }
    sites.push(...knot);
  }
  return { span: outer, sites, roads };
}

/** A straight ridge between two places, sampled for the stamp. */
function ridge(a: Site, b: Site): [number, number][] {
  const length = Math.hypot(b.x - a.x, b.y - a.y);
  const steps = Math.max(2, Math.ceil(length / (0.05 * ROAD)));
  const path: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    path.push([a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t]);
  }
  return path;
}
