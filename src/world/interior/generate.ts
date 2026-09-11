import * as THREE from 'three';
import { assemble, finish, type Part } from '../../art/assemble';
import { createRng, type Rng } from '../../art/random';
import { shade } from '../../art/palette';
import { CELL, PARTITION, SLAB, WALL, type InteriorSpec } from './spec';
import { kitByName, kitStyle, type Kit, type KitStyle } from './kits';
import { cellKey, planInterior, type InteriorPlan, type Opening, type RoomPlan, type StoreyPlan, type WallRun } from './plan';

// The generator: the plan's rooms, walls, posts, stairs and marks as one merged
// mesh in the kit's recipes, plus the props the marks call for.

/**
 * Every builder an interior's marks can stand, its defaults included. Read
 * before the interior is generated, so a zone can load them with the rest.
 */
export function interiorBuilders(spec: InteriorSpec | null): readonly string[] {
  if (!spec) return [];
  const names = new Set<string>(['window', 'fireplace', 'ladder']);
  for (const storey of spec.storeys ?? []) {
    for (const mark of storey.edges ?? []) if (mark.builder) names.add(mark.builder);
  }
  return [...names];
}

export interface InteriorProp {
  builder: string;
  at: readonly [number, number, number];
  yaw: number;
  seed: number;
  options?: Record<string, unknown>;
}

export interface BuiltInterior {
  mesh: THREE.Mesh;
  props: InteriorProp[];
  plan: InteriorPlan;
}

const TOUCHING = 0.001;

export function buildInteriorFromSpec(spec: InteriorSpec): BuiltInterior {
  const plan = planInterior(spec);
  for (const warning of plan.warnings) console.warn(warning);
  const kit = kitByName(spec.kit);
  const rng = createRng(spec.seed ?? 1);
  const parts: Part[] = [];
  const props: InteriorProp[] = [];

  plan.storeys.forEach((storey, k) => {
    const above = plan.storeys[k + 1];
    for (const room of storey.rooms.values()) {
      const style = kitStyle(kit, room.override.style);
      floor(parts, storey, room, style, rng);
      ceiling(parts, storey, above, room, style, rng);
    }
    for (const wall of storey.walls) {
      const style = kitStyle(kit, storey.rooms.get(wall.room)?.override.style);
      if (wall.kind === 'balustrade') balustrade(parts, wall, style);
      else wallRun(parts, wall, style, rng, storey.rooms.get(wall.room));
    }
    for (const post of storey.posts) {
      const style = kitStyle(kit, undefined);
      const box = new THREE.BoxGeometry(style.post, post.height, style.post);
      box.translate(post.x, post.level + post.height / 2, post.z);
      parts.push({ geometry: box, color: shade(style.wallTrim, 0.95), sway: 0 });
    }
    for (const stair of storey.stairs) stairs(parts, stair, kitStyle(kit, storey.rooms.get(stair.room)?.override.style), storey);
    for (const site of storey.sites) {
      const seed = site.mark.seed ?? (spec.seed ?? 1) + Math.round(site.x * 7 + site.z * 13);
      switch (site.mark.kind) {
        case 'window':
          props.push({ builder: site.mark.builder ?? 'window', at: [site.x, site.y, site.z], yaw: site.yaw, seed, options: site.mark.options });
          break;
        case 'hearth':
          props.push({ builder: site.mark.builder ?? 'fireplace', at: [site.x, site.y, site.z], yaw: site.yaw, seed, options: site.mark.options });
          break;
        case 'hatch': {
          const room = storey.rooms.get(site.room);
          const height = room ? room.height + SLAB : 3;
          props.push({ builder: 'ladder', at: [site.x - 0.4, site.y, site.z], yaw: 0, seed, options: { height: height - 0.1 } });
          hatchFrame(parts, site.x, site.z, site.width, (room?.level ?? 0) + (room?.height ?? 3), kitStyle(kit, room?.override.style));
          break;
        }
        default:
          if (site.mark.builder && site.mark.kind !== 'door' && site.mark.kind !== 'arch' && site.mark.kind !== 'open') {
            props.push({ builder: site.mark.builder, at: [site.x, site.y, site.z], yaw: site.yaw, seed, options: site.mark.options });
          }
      }
    }
  });

  const first = plan.storeys[0]?.rooms.values().next().value as RoomPlan | undefined;
  const style = kitStyle(kit, first?.override.style);
  const geometry = assemble(parts);
  const [ox, oz] = plan.offset;
  if (ox !== 0 || oz !== 0) geometry.translate(ox, 0, oz);
  const mesh = finish(geometry, 'interior', 0, style.underfoot);
  return { mesh, props, plan };
}

/** Rows of contiguous cells of a room, as world rectangles, minus any cut cells. */
function rowRuns(room: RoomPlan, cut: Set<number>): { x0: number; x1: number; z0: number; z1: number }[] {
  const out: { x0: number; x1: number; z0: number; z1: number }[] = [];
  for (let j = room.j0; j < room.j1; j++) {
    let start: number | null = null;
    for (let i = room.i0; i <= room.i1; i++) {
      const here = i < room.i1 && room.cells.has(cellKey(i, j)) && !cut.has(cellKey(i, j));
      if (here && start === null) start = i;
      if (!here && start !== null) {
        out.push({ x0: start * CELL, x1: i * CELL, z0: j * CELL, z1: (j + 1) * CELL });
        start = null;
      }
    }
  }
  // Merge rows that share the same x extent into taller rectangles.
  const merged: typeof out = [];
  for (const run of out) {
    const last = merged[merged.length - 1];
    if (last && Math.abs(last.x0 - run.x0) < TOUCHING && Math.abs(last.x1 - run.x1) < TOUCHING && Math.abs(last.z1 - run.z0) < TOUCHING) last.z1 = run.z1;
    else merged.push({ ...run });
  }
  return merged;
}

function floor(parts: Part[], storey: StoreyPlan, room: RoomPlan, style: KitStyle, rng: Rng): void {
  const boards = (room.override.planks ?? style.floorKind === 'boards') && style.floorKind !== 'earth';
  const slabTop = room.level + (boards ? -0.006 : 0);
  const rects = rowRuns(room, storey.holes);
  for (const r of rects) {
    // Grown under the boundary walls, so a wall never stands over nothing.
    const grow = WALL;
    const slab = new THREE.BoxGeometry(r.x1 - r.x0 + grow * 2, SLAB, r.z1 - r.z0 + grow * 2);
    slab.translate((r.x0 + r.x1) / 2, slabTop - SLAB / 2, (r.z0 + r.z1) / 2);
    parts.push({ geometry: slab, color: boards ? style.floorSeam : style.floorKind === 'flags' ? style.floor : shade(style.floor, 0.9), sway: 0 });
    if (boards) {
      const boardWidth = rng.range(0.24, 0.34);
      const count = Math.ceil((r.x1 - r.x0) / boardWidth);
      const seamWidth = 0.009;
      const seamColor = shade(style.floor, 0.55);
      const strip = (from: number, span: number, color: number): void => {
        const geometry = new THREE.BoxGeometry(Math.min(span, r.x1 - from), 0.03, r.z1 - r.z0);
        geometry.translate(from + Math.min(span, r.x1 - from) / 2, room.level - 0.015, (r.z0 + r.z1) / 2);
        parts.push({ geometry, color, sway: 0, detail: span, detailTint: style.floor });
      };
      for (let i = 0; i < count; i++) {
        const x = r.x0 + i * boardWidth;
        if (x >= r.x1) break;
        strip(x, seamWidth, seamColor);
        if (x + seamWidth < r.x1) strip(x + seamWidth, boardWidth - seamWidth, shade(style.floor, rng.around(1, 0.09)));
      }
    } else if (style.floorKind === 'flags') {
      // Flags as a grid of slightly proud slabs, each its own shade.
      const size = 0.5;
      for (let x = r.x0; x < r.x1 - TOUCHING; x += size) {
        for (let z = r.z0; z < r.z1 - TOUCHING; z += size) {
          const w = Math.min(size, r.x1 - x) - 0.012;
          const d = Math.min(size, r.z1 - z) - 0.012;
          const flag = new THREE.BoxGeometry(w, 0.02, d);
          flag.translate(x + w / 2 + 0.006, room.level + 0.01, z + d / 2 + 0.006);
          parts.push({ geometry: flag, color: shade(style.floor, rng.around(1, 0.08)), sway: 0, detail: 0.012, detailTint: style.floor });
        }
      }
    }
  }
}

function ceiling(parts: Part[], storey: StoreyPlan, above: StoreyPlan | undefined, room: RoomPlan, style: KitStyle, rng: Rng): void {
  const top = room.level + room.height;
  // Cells with a room above take the upper floor as their ceiling; void above is open; only outside above needs a roof.
  const cut = new Set<number>();
  for (const key of room.cells) {
    const over = above?.cells.get(key);
    if (over && over !== '_') cut.add(key);
    else if (over === '_') cut.add(key);
    if (storey.ceilingHoles.has(key)) cut.add(key);
  }
  const rafters = storey.spec.ceiling === 'rafters' && !above;
  const rects = rowRuns(room, cut);
  for (const r of rects) {
    const grow = WALL;
    if (rafters) continue;
    const slab = new THREE.BoxGeometry(r.x1 - r.x0 + grow * 2, SLAB, r.z1 - r.z0 + grow * 2);
    slab.translate((r.x0 + r.x1) / 2, top + SLAB / 2, (r.z0 + r.z1) / 2);
    parts.push({ geometry: slab, color: style.ceiling, sway: 0 });
  }
  if (rafters) {
    // A pitched underside from the eaves walls to a ridge along the long axis, with purlins.
    const wide = room.i1 - room.i0 >= room.j1 - room.j0;
    const x0 = room.i0 * CELL - WALL;
    const x1 = room.i1 * CELL + WALL;
    const z0 = room.j0 * CELL - WALL;
    const z1 = room.j1 * CELL + WALL;
    const eave = top - 0.7;
    const ridge = top + 0.5;
    const half = wide ? (z1 - z0) / 2 : (x1 - x0) / 2;
    const slope = Math.hypot(half, ridge - eave);
    const pitch = Math.atan2(ridge - eave, half);
    for (const sign of [-1, 1] as const) {
      const slab = new THREE.BoxGeometry(wide ? x1 - x0 : slope, 0.12, wide ? slope : z1 - z0);
      // rotateX(θ) takes +Z toward −Y... stated per axis: the slab tilts up toward the ridge on its own side.
      if (wide) slab.rotateX(sign * pitch);
      else slab.rotateZ(-sign * pitch);
      slab.translate(wide ? (x0 + x1) / 2 : (x0 + x1) / 2 + (sign * half) / 2, (eave + ridge) / 2, wide ? (z0 + z1) / 2 + (sign * half) / 2 : (z0 + z1) / 2);
      parts.push({ geometry: slab, color: style.ceiling, sway: 0 });
    }
    const purlins = 3;
    for (let p = 1; p <= purlins; p++) {
      const t = p / (purlins + 1);
      for (const sign of [-1, 1] as const) {
        const y = eave + (ridge - eave) * t - 0.08;
        const off = sign * half * (1 - t);
        const beam = new THREE.BoxGeometry(wide ? x1 - x0 : 0.14, 0.12, wide ? 0.14 : z1 - z0);
        beam.translate(wide ? (x0 + x1) / 2 : (x0 + x1) / 2 + off, y, wide ? (z0 + z1) / 2 + off : (z0 + z1) / 2);
        parts.push({ geometry: beam, color: style.beam, sway: 0 });
      }
    }
    return;
  }
  const beams = room.override.beams ?? (style.ceilingKind === 'none' ? 0 : style.ceilingKind === 'joists' ? 6 : 3);
  if (beams > 0 && room.rectangular) {
    const drop = style.ceilingKind === 'joists' ? 0.12 : rng.range(0.16, 0.24);
    const wide = room.i1 - room.i0 >= room.j1 - room.j0;
    const x0 = room.i0 * CELL;
    const x1 = room.i1 * CELL;
    const z0 = room.j0 * CELL;
    const z1 = room.j1 * CELL;
    for (let b = 0; b < beams; b++) {
      const t = (b + 0.5) / beams;
      const beam = new THREE.BoxGeometry(wide ? x1 - x0 + WALL * 2 : rng.range(0.16, 0.22), drop, wide ? rng.range(0.16, 0.22) : z1 - z0 + WALL * 2);
      beam.translate(wide ? (x0 + x1) / 2 : x0 + (x1 - x0) * t, top - drop / 2, wide ? z0 + (z1 - z0) * t : (z0 + z1) / 2);
      parts.push({ geometry: beam, color: style.beam, sway: 0 });
    }
  }
}

interface Panel {
  from: number;
  to: number;
  bottom: number;
  top: number;
}

/** One wall as panels that tile it exactly, with the openings taken out. */
function panelsFor(from: number, to: number, level: number, height: number, openings: readonly Opening[]): Panel[] {
  const top = level + height;
  const sorted = [...openings]
    .map((o) => ({ from: Math.max(from, o.from), to: Math.min(to, o.to), sill: Math.max(level, o.sill), top: Math.min(top, o.top) }))
    .filter((o) => o.to - o.from > TOUCHING)
    .sort((a, b) => a.from - b.from);
  const panels: Panel[] = [];
  let at = from;
  for (const o of sorted) {
    const start = Math.max(at, o.from);
    if (start - at > TOUCHING) panels.push({ from: at, to: start, bottom: level, top });
    if (o.sill - level > TOUCHING) panels.push({ from: start, to: o.to, bottom: level, top: o.sill });
    if (top - o.top > TOUCHING) panels.push({ from: start, to: o.to, bottom: o.top, top });
    at = Math.max(at, o.to);
  }
  if (to - at > TOUCHING) panels.push({ from: at, to, bottom: level, top });
  return panels;
}

/** Box helper: a panel along the wall's axis at its line, `thick` across, offset by `shift` across. */
function panelBox(wall: WallRun, panel: Panel, thick: number, shift: number): THREE.BufferGeometry {
  const length = panel.to - panel.from;
  const geometry = wall.along === 'x' ? new THREE.BoxGeometry(length, panel.top - panel.bottom, thick) : new THREE.BoxGeometry(thick, panel.top - panel.bottom, length);
  const mid = (panel.from + panel.to) / 2;
  const across = wall.at + shift;
  geometry.translate(wall.along === 'x' ? mid : across, (panel.bottom + panel.top) / 2, wall.along === 'x' ? across : mid);
  return geometry;
}

/** Which way is into the room from this wall: +1 along the across axis or −1. */
function inward(wall: WallRun): number {
  return wall.side === 'n' || wall.side === 'w' ? 1 : -1;
}

function wallRun(parts: Part[], wall: WallRun, style: KitStyle, rng: Rng, room: RoomPlan | undefined): void {
  const thick = wall.kind === 'boundary' ? WALL : PARTITION;
  // A boundary wall stands outside the cell edge; a partition is centred on it.
  const shift = wall.kind === 'boundary' ? (-inward(wall) * WALL) / 2 : 0;
  const level = wall.kind === 'partition' ? Math.min(wall.level, room?.level ?? wall.level) : wall.level;
  const bottom = level - (wall.kind === 'boundary' ? SLAB : 0);
  for (const panel of panelsFor(wall.from, wall.to, bottom, wall.level + wall.height - bottom, wall.openings)) {
    const geometry = panelBox(wall, panel, thick, shift);
    if (room?.override.roughen) roughenInner(geometry, wall, thick, shift, room.override.roughen, rng);
    parts.push({ geometry, color: style.wallKind === 'rubble' ? shade(style.wall, rng.around(1, 0.06)) : style.wall, sway: 0 });
  }
  // The frame, boards or rubble courses: the cell rhythm seen from inside.
  const faceShift = shift + inward(wall) * (thick / 2 + 0.015);
  if (style.wallKind === 'frame') {
    const studAt: number[] = [];
    for (let s = Math.ceil(wall.from / CELL) * CELL; s <= wall.to + TOUCHING; s += CELL * 2) studAt.push(s);
    for (const s of studAt) {
      if (wall.openings.some((o) => s > o.from - 0.05 && s < o.to + 0.05)) continue;
      const stud = panelBox(wall, { from: s - 0.05, to: s + 0.05, bottom: wall.level + 0.16, top: wall.level + wall.height - 0.05 }, 0.03, faceShift);
      parts.push({ geometry: stud, color: style.wallTrim, sway: 0 });
    }
    const rail = panelBox(wall, { from: wall.from, to: wall.to, bottom: wall.level + wall.height - 0.14, top: wall.level + wall.height - 0.02 }, 0.03, faceShift);
    parts.push({ geometry: rail, color: style.wallTrim, sway: 0 });
  } else if (style.wallKind === 'boards') {
    for (let y = wall.level + 0.16; y < wall.level + wall.height - 0.1; y += 0.26) {
      for (const panel of panelsFor(wall.from, wall.to, y, 0.24, wall.openings)) {
        const board = panelBox(wall, { ...panel, bottom: y, top: Math.min(y + 0.24, wall.level + wall.height) }, 0.02, faceShift);
        parts.push({ geometry: board, color: shade(style.wall, rng.around(1, 0.07)), sway: 0, detail: 0.24, detailTint: style.wall });
      }
    }
  }
  // Skirting, broken by the openings.
  const skirt = 0.16;
  for (const panel of panelsFor(wall.from, wall.to, wall.level, skirt, wall.openings.map((o) => ({ ...o, sill: wall.level, top: wall.level + skirt })))) {
    const trim = panelBox(wall, panel, 0.06, shift + inward(wall) * (thick / 2 + 0.03));
    parts.push({ geometry: trim, color: style.wallTrim, sway: 0 });
  }
  // Reveals: jambs and a lintel round every cut opening.
  for (const o of wall.openings) {
    if (o.kind === 'open') continue;
    const jamb = 0.09;
    const depth = thick * 1.6;
    for (const [a, b] of [
      [o.from - jamb, o.from],
      [o.to, o.to + jamb],
    ]) {
      parts.push({ geometry: panelBox(wall, { from: a, to: b, bottom: o.sill, top: o.top + jamb }, depth, shift), color: style.wallTrim, sway: 0 });
    }
    parts.push({ geometry: panelBox(wall, { from: o.from - jamb, to: o.to + jamb, bottom: o.top, top: o.top + jamb }, depth, shift), color: style.wallTrim, sway: 0 });
  }
}

/** Displaces a panel's inner face, seeded from its cells, so the outer face and the edges stay put. */
function roughenInner(geometry: THREE.BufferGeometry, wall: WallRun, thick: number, shift: number, amount: number, rng: Rng): void {
  const position = geometry.getAttribute('position') as THREE.BufferAttribute;
  const face = wall.at + shift + (inward(wall) * thick) / 2;
  const reach = Math.min(thick * 0.6, 0.28) * amount;
  for (let i = 0; i < position.count; i++) {
    const here = wall.along === 'x' ? position.getZ(i) : position.getX(i);
    if (Math.abs(here - face) > TOUCHING) continue;
    const jitter = rng.range(0, reach) * inward(wall);
    if (wall.along === 'x') position.setZ(i, here + jitter);
    else position.setX(i, here + jitter);
  }
  position.needsUpdate = true;
  geometry.computeVertexNormals();
}

function balustrade(parts: Part[], wall: WallRun, style: KitStyle): void {
  const rail = panelBox(wall, { from: wall.from, to: wall.to, bottom: wall.level + 0.86, top: wall.level + 0.92 }, 0.08, 0);
  parts.push({ geometry: rail, color: style.wallTrim, sway: 0 });
  for (let s = wall.from + 0.12; s < wall.to; s += 0.25) {
    const baluster = panelBox(wall, { from: s - 0.02, to: s + 0.02, bottom: wall.level, top: wall.level + 0.86 }, 0.04, 0);
    parts.push({ geometry: baluster, color: style.wallTrim, sway: 0 });
  }
}

function hatchFrame(parts: Part[], x: number, z: number, width: number, top: number, style: KitStyle): void {
  const frame = 0.08;
  for (const [dx, dz, w, d] of [
    [0, -width / 2, width + frame, frame],
    [0, width / 2, width + frame, frame],
    [-width / 2, 0, frame, width + frame],
    [width / 2, 0, frame, width + frame],
  ]) {
    const box = new THREE.BoxGeometry(w, SLAB, d);
    box.translate(x + dx, top + SLAB / 2, z + dz);
    parts.push({ geometry: box, color: style.wallTrim, sway: 0 });
  }
}

/** A closed-string stair two cells wide: risers at about 0.19, treads real geometry the controller climbs. */
function stairs(parts: Part[], stair: { x0: number; z0: number; dir: 'n' | 'e' | 's' | 'w'; run: number; level: number; rise: number }, style: KitStyle, storey: StoreyPlan): void {
  const risers = Math.max(2, Math.round(stair.rise / 0.19));
  const going = (stair.run * CELL) / risers;
  const riser = stair.rise / risers;
  const width = 2 * CELL;
  const alongX = stair.dir === 'e' || stair.dir === 'w';
  const sign = stair.dir === 'e' || stair.dir === 's' ? 1 : -1;
  // The strip's start edge, at the bottom of the flight.
  const startAlong = alongX ? (sign > 0 ? stair.x0 : stair.x0 + stair.run * CELL) : sign > 0 ? stair.z0 : stair.z0 + stair.run * CELL;
  const acrossMid = alongX ? stair.z0 + width / 2 : stair.x0 + width / 2;
  const timber = style.stair === 'timber';
  const treadColour = timber ? style.floor : shade(style.wallTrim, 1.05);
  for (let k = 0; k < risers; k++) {
    const y0 = stair.level + k * riser;
    const y1 = y0 + riser;
    const a = startAlong + sign * k * going;
    const b = a + sign * going;
    const lo = Math.min(a, b);
    const hi = Math.max(a, b);
    // Each step is a block from its riser down to the floor, so the flight is solid underneath.
    const block = alongX ? new THREE.BoxGeometry(hi - lo + 0.01, y1 - stair.level, width - 0.04) : new THREE.BoxGeometry(width - 0.04, y1 - stair.level, hi - lo + 0.01);
    block.translate(alongX ? (lo + hi) / 2 : acrossMid, (stair.level + y1) / 2, alongX ? acrossMid : (lo + hi) / 2);
    parts.push({ geometry: block, color: k % 2 === 0 ? treadColour : shade(treadColour, 0.94), sway: 0 });
  }
  if (timber) {
    // Strings either side and a handrail on the open side.
    const length = Math.hypot(stair.run * CELL, stair.rise);
    const pitch = Math.atan2(stair.rise, stair.run * CELL);
    for (const side of [-1, 1] as const) {
      const string = alongX ? new THREE.BoxGeometry(length, 0.28, 0.05) : new THREE.BoxGeometry(0.05, 0.28, length);
      if (alongX) string.rotateZ(sign * pitch);
      else string.rotateX(-sign * pitch);
      string.translate(alongX ? startAlong + (sign * stair.run * CELL) / 2 : acrossMid + side * (width / 2 - 0.02), stair.level + stair.rise / 2 - 0.05, alongX ? acrossMid + side * (width / 2 - 0.02) : startAlong + (sign * stair.run * CELL) / 2);
      parts.push({ geometry: string, color: style.wallTrim, sway: 0 });
    }
    const open = storey.cells.get(cellKey(Math.round(alongX ? stair.x0 / CELL : stair.x0 / CELL + 1), Math.round(alongX ? stair.z0 / CELL - 1 : stair.z0 / CELL))) !== undefined ? -1 : 1;
    const rail = alongX ? new THREE.BoxGeometry(length, 0.06, 0.06) : new THREE.BoxGeometry(0.06, 0.06, length);
    if (alongX) rail.rotateZ(sign * pitch);
    else rail.rotateX(-sign * pitch);
    rail.translate(alongX ? startAlong + (sign * stair.run * CELL) / 2 : acrossMid + open * (width / 2 - 0.03), stair.level + stair.rise / 2 + 0.9, alongX ? acrossMid + open * (width / 2 - 0.03) : startAlong + (sign * stair.run * CELL) / 2);
    parts.push({ geometry: rail, color: style.wallTrim, sway: 0 });
    for (let k = 0; k <= risers; k += 3) {
      const a = startAlong + sign * k * going;
      const y = stair.level + k * riser;
      const newel = new THREE.BoxGeometry(0.07, 0.95, 0.07);
      newel.translate(alongX ? a : acrossMid + open * (width / 2 - 0.03), y + 0.47, alongX ? acrossMid + open * (width / 2 - 0.03) : a);
      parts.push({ geometry: newel, color: style.wallTrim, sway: 0 });
    }
  }
}

export { planInterior, kitByName, kitStyle };
export type { Kit };
