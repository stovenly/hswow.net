import { createRng } from '../../art/random';

/**
 * How a road is drawn between two places on the world chart.
 *
 * Not a straight line and not one arc: a road bows and wanders, because what it
 * is going round is the country and not the map. Drawn from a seed on the pair
 * it joins, so the same world comes back with the same bends in the same places
 * on every load and every machine.
 *
 * The marks the chart is made of are struck clean — a true circle, a true
 * diamond. The wander belongs to the roads and to nothing else.
 */

/** Places sampled along a road, per pixel of its length, and the bounds on that count. */
const PER_PIXEL = 1 / 14;
const LEAST = 10;
const MOST = 90;

/**
 * A road between two places: a long bow with a lesser wander over it, both
 * tapered to nothing at the ends so the route meets its towns square rather
 * than sliding past them.
 *
 * `bend` is the bow's reach as a fraction of the road's own length, so a long
 * road wanders further than a short one — which is what a road does, because
 * what it is going round is the country and not the map.
 */
export function route(
  ax: number,
  ay: number,
  bx: number,
  by: number,
  seed: number,
  bend = 0.13,
): [number, number][] {
  const rng = createRng(seed);
  const dx = bx - ax;
  const dy = by - ay;
  const length = Math.hypot(dx, dy) || 1;
  const alongX = dx / length;
  const alongY = dy / length;
  const acrossX = -alongY;
  const acrossY = alongX;

  const bow = length * bend * rng.range(0.7, 1.3) * (rng.chance(0.5) ? 1 : -1);
  const wander = length * bend * 0.36 * (rng.chance(0.5) ? 1 : -1);
  const slowTurns = rng.range(0.7, 1.4);
  const fastTurns = rng.range(2.3, 4.1);
  const slowPhase = rng.range(0, Math.PI * 2);
  const fastPhase = rng.range(0, Math.PI * 2);

  const steps = Math.max(LEAST, Math.min(MOST, Math.round(length * PER_PIXEL)));
  const out: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const taper = Math.sin(Math.PI * t);
    const off =
      taper *
      (bow * Math.sin(Math.PI * slowTurns * t + slowPhase) +
        wander * Math.sin(Math.PI * fastTurns * t + fastPhase));
    // Along the road as well as across it, or the wander reads as one sine
    // wave laid on a straight line, which is what it would be.
    const drift = taper * wander * 0.3 * Math.sin(Math.PI * fastTurns * t + slowPhase);
    const run = length * t + drift;
    out.push([ax + alongX * run + acrossX * off, ay + alongY * run + acrossY * off]);
  }
  return out;
}

/** A smooth path through a run of points, curved through their midpoints. */
export function through(context: CanvasRenderingContext2D, points: readonly [number, number][]): void {
  if (points.length === 0) return;
  context.beginPath();
  context.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length - 1; i++) {
    const [x, y] = points[i];
    const [nx, ny] = points[i + 1];
    context.quadraticCurveTo(x, y, (x + nx) / 2, (y + ny) / 2);
  }
  const last = points[points.length - 1];
  context.lineTo(last[0], last[1]);
}
