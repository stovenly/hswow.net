import type { ZonePlan } from '../../world/Zone';

/** What a zone's plan means on a chart: the line the player cannot cross, and the ground it encloses. */

/** A rectangle of ground, in the zone's own metres. */
export interface Span {
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * The line the player cannot cross: the stated outline pulled in by the rim's
 * inset, or the zone's own rectangle where no outline is stated. Each vertex
 * moves along its own ray from the outline's centre, which is exact on a
 * straight run and close enough on the gentle corners a level outline is made
 * of.
 */
export function playableLine(plan: ZonePlan): readonly (readonly [number, number])[] {
  const outline = plan.outline;
  if (!outline || outline.length < 3) {
    const [x0, z0] = plan.min;
    const [x1, z1] = plan.max;
    return [
      [x0, z0],
      [x1, z0],
      [x1, z1],
      [x0, z1],
    ];
  }
  const inset = plan.inset ?? 0;
  if (inset <= 0) return outline;
  const centre = outline.reduce(
    (sum, [x, z]) => [sum[0] + x / outline.length, sum[1] + z / outline.length],
    [0, 0],
  );
  return outline.map(([x, z]) => {
    const dx = x - centre[0];
    const dz = z - centre[1];
    const away = Math.hypot(dx, dz) || 1;
    const pulled = Math.max(0, away - inset) / away;
    return [centre[0] + dx * pulled, centre[1] + dz * pulled] as const;
  });
}

/**
 * The ground inside that line, grown by `room`. **Not the terrain's square**:
 * a level is a shape cut out of a heightfield twice its width, and both the
 * picture drawn of it and the window fitted to it want the level.
 */
export function playableSpan(plan: ZonePlan, room = 1): Span {
  let minX = Infinity;
  let minZ = Infinity;
  let maxX = -Infinity;
  let maxZ = -Infinity;
  for (const [x, z] of playableLine(plan)) {
    minX = Math.min(minX, x);
    minZ = Math.min(minZ, z);
    maxX = Math.max(maxX, x);
    maxZ = Math.max(maxZ, z);
  }
  const w = (maxX - minX) * room;
  const h = (maxZ - minZ) * room;
  return { x: (minX + maxX) / 2 - w / 2, y: (minZ + maxZ) / 2 - h / 2, w, h };
}
