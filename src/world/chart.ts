import * as THREE from 'three';
import { sideAt, type PortalGraph } from './Portal';
import type { ZoneId, ZonePlan } from './Zone';

/**
 * What the player has found: the fog raster the local map unveils, one per zone
 * ever stood in, and the portals whose door the fog has revealed — which is
 * what draws a road on the world map.
 *
 * Beside `state.ts` rather than in it. `WorldFlags` is what a `when` is judged
 * against; a raster is not a condition and nothing may branch on one.
 */

/** Metres per cell. Coarser than the terrain: this records where you walked, not what you saw. */
export const CELL = 2;

/** Metres around the player that fill in. No line of sight is consulted. */
const REACH = 14;

/** Seconds a cell at the edge of that disc takes to go from untouched to full; the middle is open at once. */
const REVEAL = 1.4;
/** How much of the disc, from the middle, opens the moment the player stands in it. */
const AT_ONCE = 0.55;

/** And the same for a room, which opens whole. */
const ROOM_REVEAL = 1.8;

/** How lit a cell must be before the door standing in it is marked and named. */
export const FOUND_AT = 0.35;

/** One zone's fog, sized from that zone's plan. */
export interface SeenRaster {
  readonly w: number;
  readonly h: number;
  /** World metres of the raster's first cell corner. */
  readonly minX: number;
  readonly minZ: number;
  /** 0..255 per cell, and never falling. */
  readonly cells: Uint8Array;
}

export interface ChartData {
  /** Base64 of each zone's cells, with the grid it was written for. */
  seen: Record<ZoneId, { w: number; h: number; bytes: string }>;
  found: string[];
}

/** The grid a plan implies. One place, so a restored raster can be checked against it. */
function gridOf(plan: ZonePlan): { w: number; h: number; minX: number; minZ: number } {
  return {
    w: Math.max(1, Math.ceil((plan.max[0] - plan.min[0]) / CELL)),
    h: Math.max(1, Math.ceil((plan.max[1] - plan.min[1]) / CELL)),
    minX: plan.min[0],
    minZ: plan.min[1],
  };
}

export class Chart {
  private readonly rasters = new Map<ZoneId, SeenRaster>();
  /** Restored bytes waiting for the plan that says whether they still fit. */
  private pending = new Map<ZoneId, { w: number; h: number; bytes: string }>();
  readonly found = new Set<string>();

  /** Zones the player has stood in. Derived, and the world map's reveal rule. */
  get visited(): Set<ZoneId> {
    return new Set([...this.rasters.keys(), ...this.pending.keys()]);
  }

  has(zone: ZoneId): boolean {
    return this.rasters.has(zone) || this.pending.has(zone);
  }

  /** This zone's fog, made on first ask and kept. */
  raster(zone: ZoneId, plan: ZonePlan): SeenRaster {
    const held = this.rasters.get(zone);
    if (held) return held;
    const grid = gridOf(plan);
    const made: SeenRaster = { ...grid, cells: new Uint8Array(grid.w * grid.h) };
    // A raster written for a different grid is a raster of a level that has
    // since been re-authored. The fog starts again rather than landing askew.
    const saved = this.pending.get(zone);
    this.pending.delete(zone);
    if (saved && saved.w === grid.w && saved.h === grid.h) {
      const bytes = decode(saved.bytes);
      if (bytes.length === made.cells.length) made.cells.set(bytes);
    }
    this.rasters.set(zone, made);
    return made;
  }

  /** How lit a world position is, 0..1. Zero outside the grid. */
  at(seen: SeenRaster, x: number, z: number): number {
    const cx = Math.floor((x - seen.minX) / CELL);
    const cz = Math.floor((z - seen.minZ) / CELL);
    if (cx < 0 || cz < 0 || cx >= seen.w || cz >= seen.h) return 0;
    return seen.cells[cz * seen.w + cx] / 255;
  }

  /**
   * Opens the fog around where the player is standing. Outdoors that is a disc
   * about them; indoors it is the whole room, because a room is a room and not
   * a torch beam.
   */
  stamp(zone: ZoneId, plan: ZonePlan, x: number, z: number, dt: number, whole: boolean): void {
    const seen = this.raster(zone, plan);
    if (whole) {
      const step = Math.min(255, Math.max(1, Math.round((dt / ROOM_REVEAL) * 255)));
      for (let i = 0; i < seen.cells.length; i++) {
        if (seen.cells[i] < 255) seen.cells[i] = Math.min(255, seen.cells[i] + step);
      }
      return;
    }
    const gain = dt / REVEAL;
    const minX = Math.max(0, Math.floor((x - REACH - seen.minX) / CELL));
    const maxX = Math.min(seen.w - 1, Math.floor((x + REACH - seen.minX) / CELL));
    const minZ = Math.max(0, Math.floor((z - REACH - seen.minZ) / CELL));
    const maxZ = Math.min(seen.h - 1, Math.floor((z + REACH - seen.minZ) / CELL));
    for (let cz = minZ; cz <= maxZ; cz++) {
      const wz = seen.minZ + (cz + 0.5) * CELL - z;
      for (let cx = minX; cx <= maxX; cx++) {
        const wx = seen.minX + (cx + 0.5) * CELL - x;
        const away = Math.hypot(wx, wz) / REACH;
        if (away >= 1) continue;
        const at = cz * seen.w + cx;
        if (seen.cells[at] === 255) continue;
        // Where the player stands is seen now; the rim fills in over time, so
        // walking on leaves a trail that fades out rather than a hard stamp.
        if (away < AT_ONCE) {
          seen.cells[at] = 255;
          continue;
        }
        const rim = (away - AT_ONCE) / (1 - AT_ONCE);
        const step = Math.max(1, Math.round(gain * (1 - rim * rim) * 255));
        seen.cells[at] = Math.min(255, seen.cells[at] + step);
      }
    }
  }

  /**
   * Marks every portal in this zone whose door the fog has now reached. What
   * names a door on the local map and draws its road on the world map, so the
   * two cannot disagree about what has been found.
   */
  sweep(portals: PortalGraph, zone: ZoneId, plan: ZonePlan): void {
    const seen = this.raster(zone, plan);
    for (const side of portals.in(zone)) {
      if (this.found.has(side.portal)) continue;
      const at = sideAt(side, _at);
      if (this.at(seen, at.x, at.z) >= FOUND_AT) this.found.add(side.portal);
    }
  }

  save(): ChartData {
    const out: ChartData = { seen: {}, found: [...this.found] };
    for (const [zone, held] of this.pending) out.seen[zone] = held;
    for (const [zone, seen] of this.rasters) {
      out.seen[zone] = { w: seen.w, h: seen.h, bytes: encode(seen.cells) };
    }
    return out;
  }

  restore(data: ChartData | undefined): void {
    this.clear();
    if (!data) return;
    for (const [zone, held] of Object.entries(data.seen ?? {})) this.pending.set(zone, held);
    for (const id of data.found ?? []) this.found.add(id);
  }

  clear(): void {
    this.rasters.clear();
    this.pending.clear();
    this.found.clear();
  }
}

/** Where a door stands, refilled per side. */
const _at = new THREE.Vector3();

/** One chart per session, for `worldDelta`'s reason: it is what the save file is of. */
export const worldChart = new Chart();

/** Chunked, because a raster is tens of thousands of bytes and `apply` has an argument limit. */
function encode(cells: Uint8Array): string {
  let text = '';
  for (let at = 0; at < cells.length; at += 4096) {
    text += String.fromCharCode(...cells.subarray(at, at + 4096));
  }
  return btoa(text);
}

function decode(text: string): Uint8Array {
  try {
    const raw = atob(text);
    const out = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
    return out;
  } catch {
    return new Uint8Array(0);
  }
}
