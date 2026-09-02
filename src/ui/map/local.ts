import * as THREE from 'three';
import { sideAt, type PortalSide } from '../../world/Portal';
import type { ZonePlan } from '../../world/Zone';
import { CELL, FOUND_AT, type SeenRaster } from '../../world/chart';
import type { ZonePicture } from './bake';
import { playableLine, playableSpan } from './plan';
import { inPixels, type ChartView, type Sheet } from './view';

/**
 * The local map: the zone from straight above, cut to the playable area, with
 * the ground you have walked opened out of the fog and every door you have
 * found marked and named.
 *
 * Four things and nothing else — the playable area, the picture, the doors and
 * where you have been. People, animals and items are not on it; the player is
 * one marker with a heading wedge.
 */

/** Pixels between strokes of the hatch. */
const HATCH = 7;

/** Half-height of the player's arrow, at the fitting scale. Larger than a door: it is the one thing on the chart you look for first. */
const HERE = 20;

/**
 * Half-width and half-height of a door mark, in pixels at the scale the whole
 * level fits the window. A mark belongs to the chart and not to the window, so
 * pulling in makes it larger — but only so far either way, or it is a speck at
 * one end of the range and a billboard at the other.
 */
const DOOR_W = 12;
const DOOR_H = 16;

/** How thick the arch's own stonework is, at that same scale. */
const JAMB = 3;

/** What a mark may be multiplied by as the view is pulled in and pushed out. */
const LEAST = 0.75;
const MOST = 2.6;

/** Pixels of the window's edge a level keeps clear of. */
export const LOCAL_MARGIN = 18;

/** Times the fitting scale a level opens at, so it arrives with air round it rather than filling the frame. */
export const LOCAL_ZOOM = 0.86;

export interface LocalChart {
  plan: ZonePlan;
  /** Radians the zone's own +Z is turned from world +Z. What puts north up. */
  bearing: number;
  picture: ZonePicture | undefined;
  seen: SeenRaster;
  /** Every portal side standing in this zone. */
  sides: readonly PortalSide[];
  /** Where the player is, and which way they are looking. */
  at: { x: number; z: number; heading: number };
  /** How lit a world position is, 0..1. */
  lit(x: number, z: number): number;
}

const fog = document.createElement('canvas');
const _at = new THREE.Vector3();
/** The hatch's tile, drawn once. The pattern made from it is not kept: a pattern belongs to the context that made it, and there are two windows. */
let tile: HTMLCanvasElement | null = null;

/** Something drawn on the chart the cursor can ask about, tested against the mark itself and not against a guess at one. */
export interface Mark {
  /** The door this stands for, or null for the player. */
  side: PortalSide | null;
  x: number;
  y: number;
  r: number;
}

export function drawLocal(
  context: CanvasRenderingContext2D,
  w: number,
  h: number,
  view: ChartView,
  chart: LocalChart,
  ink: Sheet,
  hovered: PortalSide | null,
): Mark[] {
  inPixels(context, ink.density);
  context.clearRect(0, 0, w, h);
  context.fillStyle = ink.void;
  context.fillRect(0, 0, w, h);

  const edge = playableLine(chart.plan);
  const point: [number, number] = [0, 0];
  const path = new Path2D();
  edge.forEach(([x, z], at) => {
    view.project(x, z, w, h, point);
    if (at === 0) path.moveTo(point[0], point[1]);
    else path.lineTo(point[0], point[1]);
  });
  path.closePath();

  // Inside the line: the picture, then the fog over it. Clipped rather than
  // dimmed — nothing of the render belongs outside the level.
  context.save();
  context.clip(path);
  const picture = chart.picture;
  if (picture) {
    const [a, b, c, d, e, f] = view.matrix(w, h, ink.density);
    context.setTransform(a, b, c, d, e, f);
    context.imageSmoothingEnabled = true;
    context.drawImage(picture.canvas, picture.minX, picture.minZ, picture.width, picture.depth);
    inPixels(context, ink.density);
  }
  drawFog(context, w, h, view, chart.seen, ink);
  context.restore();

  // Outside it: flat ground, scratched out. The even-odd fill is the window
  // with the level punched out of it.
  const outside = new Path2D();
  outside.rect(0, 0, w, h);
  outside.addPath(path);
  context.save();
  context.clip(outside, 'evenodd');
  context.fillStyle = 'rgb(220 220 200 / 4%)';
  context.fillRect(0, 0, w, h);
  context.fillStyle = hatching(context, ink.ink);
  context.fillRect(0, 0, w, h);
  context.restore();

  context.strokeStyle = 'rgb(220 220 200 / 62%)';
  context.lineWidth = 1;
  context.stroke(path);

  // A mark's size on the chart, not on the window. See `DOOR_W`.
  const mark = Math.min(MOST, Math.max(LEAST, view.drawn));
  const marks = drawDoors(context, w, h, view, chart, ink, hovered, mark);
  marks.push(drawPlayer(context, w, h, view, chart.at, ink, mark));
  return marks;
}

export { playableSpan as localSpan };

/** The fog, as one image the size of the raster, stretched over the ground it covers. */
function drawFog(
  context: CanvasRenderingContext2D,
  w: number,
  h: number,
  view: ChartView,
  seen: SeenRaster,
  ink: Sheet,
): void {
  fog.width = seen.w;
  fog.height = seen.h;
  const into = fog.getContext('2d');
  if (!into) return;
  const image = into.createImageData(seen.w, seen.h);
  const [r, g, b] = channels(ink.void);
  for (let i = 0; i < seen.cells.length; i++) {
    const at = i * 4;
    image.data[at] = r;
    image.data[at + 1] = g;
    image.data[at + 2] = b;
    image.data[at + 3] = 255 - seen.cells[i];
  }
  into.putImageData(image, 0, 0);
  const [a, bb, c, d, e, f] = view.matrix(w, h, ink.density);
  context.setTransform(a, bb, c, d, e, f);
  context.imageSmoothingEnabled = true;
  context.drawImage(fog, seen.minX, seen.minZ, seen.w * CELL, seen.h * CELL);
  inPixels(context, ink.density);
}

/**
 * One mark per found door: an archway, standing open. One glyph for every kind
 * of way out, because a hatch, a road and a door are the same thing to whoever
 * is reading the chart — somewhere this place carries on from.
 *
 * Upright, and never turned to the doorway's own bearing: a symbol laid on its
 * side reads as a fallen one.
 *
 * **Only ways out of the zone.** A ladder between two floors of the same cell
 * is a portal to this engine and a ladder to the player, and a chart of a place
 * marks its exits.
 *
 * **No name written on the chart.** What a door is called is the crosshair's own
 * wording, and setting it here in a second voice would be a second answer; the
 * cursor asks, and gets back the line the game would have given it.
 */
function drawDoors(
  context: CanvasRenderingContext2D,
  w: number,
  h: number,
  view: ChartView,
  chart: LocalChart,
  ink: Sheet,
  hovered: PortalSide | null,
  mark: number,
): Mark[] {
  const marks: Mark[] = [];
  const point: [number, number] = [0, 0];
  for (const side of chart.sides) {
    if (side.target.zone === side.end.zone || side.end.accessory) continue;
    const at = sideAt(side, _at);
    if (chart.lit(at.x, at.z) < FOUND_AT) continue;
    view.project(at.x, at.z, w, h, point);
    const [px, py] = point;
    const grow = mark * (side === hovered ? 1.22 : 1);
    const halfW = DOOR_W * grow;
    const halfH = DOOR_H * grow;
    marks.push({ side, x: px, y: py, r: Math.hypot(halfW, halfH) });

    // Cased in the ground colour first, so the arch keeps its shape over a roof
    // as readily as over open grass.
    archway(context, px, py, halfW, halfH);
    context.lineWidth = 3 * Math.min(1.6, grow);
    context.lineJoin = 'round';
    context.strokeStyle = ink.void;
    context.stroke();
    context.fillStyle = ink.ink;
    context.fill();

    // The opening itself, cut through in the ground's own colour. Nothing is
    // drawn inside it: what is through there is the other zone.
    archway(context, px, py + JAMB * grow * 0.5, halfW - JAMB * grow, halfH - JAMB * grow * 0.5);
    context.fillStyle = ink.void;
    context.fill();

    // The threshold, which is what stops the opening reading as a horseshoe.
    context.beginPath();
    context.moveTo(px - halfW, py + halfH);
    context.lineTo(px + halfW, py + halfH);
    context.lineWidth = JAMB * grow * 1.1;
    context.lineCap = 'butt';
    context.strokeStyle = ink.ink;
    context.stroke();
  }
  return marks;
}

/** An arch: square at the foot, a half-round over the head. */
function archway(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  halfW: number,
  halfH: number,
): void {
  const foot = y + halfH;
  const spring = foot - Math.max(0, halfH * 2 - halfW);
  context.beginPath();
  context.moveTo(x - halfW, foot);
  context.lineTo(x - halfW, spring);
  context.arc(x, spring, halfW, Math.PI, 0);
  context.lineTo(x + halfW, foot);
  context.closePath();
}

/**
 * Where you are: one arrow, solid ink inside a heavy casing of the ground. It
 * has to be findable in a glance over a chart that is otherwise all ink, so it
 * is bigger than anything else on the sheet and it is not a dot with a wedge on
 * it — it is the arrow. Curved flanks and a rounded tip, or the point of it
 * comes out as a staircase.
 */
function drawPlayer(
  context: CanvasRenderingContext2D,
  w: number,
  h: number,
  view: ChartView,
  at: { x: number; z: number; heading: number },
  ink: Sheet,
  mark: number,
): Mark {
  const point: [number, number] = [0, 0];
  view.project(at.x, at.z, w, h, point);
  const [px, py] = point;
  // The camera looks down -Z at yaw 0, so forward is `(-sin yaw, -cos yaw)`.
  const facing = at.heading - view.rotation;
  const size = HERE * mark;
  context.save();
  context.translate(px, py);
  context.rotate(-facing);

  // Drawn nose toward -Y about the origin, which is up the screen, and turned
  // from there: `rotate(-facing)` takes -Y to `(-sin facing, -cos facing)`,
  // which is the controller's own forward vector.
  const wing = size * 0.66;
  context.beginPath();
  context.moveTo(0, -size);
  context.quadraticCurveTo(wing * 0.55, -size * 0.1, wing, size * 0.62);
  context.quadraticCurveTo(wing * 0.4, size * 0.34, 0, size * 0.3);
  context.quadraticCurveTo(-wing * 0.4, size * 0.34, -wing, size * 0.62);
  context.quadraticCurveTo(-wing * 0.55, -size * 0.1, 0, -size);
  context.closePath();

  context.lineJoin = 'round';
  context.lineCap = 'round';
  context.strokeStyle = ink.void;
  context.lineWidth = Math.max(2.5, size * 0.28);
  context.stroke();
  context.fillStyle = ink.ink;
  context.fill();
  context.restore();
  return { side: null, x: px, y: py, r: size * 0.85 };
}

/** Diagonal strokes: everything past the level's edge wears them. */
function hatching(context: CanvasRenderingContext2D, colour: string): CanvasPattern | string {
  if (!tile) {
    tile = document.createElement('canvas');
    tile.width = HATCH;
    tile.height = HATCH;
    const into = tile.getContext('2d');
    if (!into) return colour;
    into.strokeStyle = 'rgb(220 220 200 / 16%)';
    into.lineWidth = 1;
    into.beginPath();
    into.moveTo(-1, HATCH + 1);
    into.lineTo(HATCH + 1, -1);
    into.stroke();
  }
  return context.createPattern(tile, 'repeat') ?? colour;
}

/** `#rrggbb` to its three bytes. The fog is painted in the interface's own void. */
function channels(colour: string): [number, number, number] {
  const hex = colour.trim().replace('#', '');
  if (hex.length !== 6) return [10, 10, 15];
  const value = Number.parseInt(hex, 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}
