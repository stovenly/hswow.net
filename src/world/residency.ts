import type { PortalGraph } from './Portal';
import type { ZoneId } from './Zone';

/**
 * Which zones may stay built when the player is standing in `active`. Distance is
 * measured in doors, not in metres: two rooms can share a wall and be a hundred
 * paces apart through the building, and it is the walk that decides what the player
 * is about to need. An LRU answers what they looked at least recently; the question
 * worth answering is what they can reach next.
 *
 * Pure, and separate from `ZoneManager`, which cannot be built without a renderer
 * and a DOM. The manager holds the mechanism; this is the rule.
 */
export function residentZones(
  portals: PortalGraph,
  active: ZoneId,
  keepWithin: number,
  cameFrom?: ZoneId | null,
): Set<ZoneId> {
  const keep = new Set<ZoneId>([active]);
  if (cameFrom) keep.add(cameFrom);
  let frontier: ZoneId[] = [active];

  for (let hop = 0; hop < keepWithin; hop++) {
    const next: ZoneId[] = [];
    for (const id of frontier) {
      for (const side of portals.in(id)) {
        const neighbour = side.target.zone;
        if (keep.has(neighbour)) continue;
        keep.add(neighbour);
        next.push(neighbour);
      }
    }
    // Nothing new this ring means the component is exhausted; the remaining
    // hops cannot add anything and walking them is wasted work.
    if (next.length === 0) break;
    frontier = next;
  }

  return keep;
}

/**
 * How many doors from the active zone a place may be and still be kept: one, plus
 * the room you just left.
 *
 * Evicting at exactly one hop would drop a zone the moment you stepped through a
 * door and rebuild it the moment you stepped back, so `cameFrom` is the hysteresis,
 * stated exactly — one zone, the one a step back would return to, rather than
 * everything a step-and-a-half might. A whole extra ring is a blunt instrument: in
 * a hub with seven heavy rooms hanging off it, a two-hop ring keeps all seven
 * resident for the session.
 *
 * Doorless travel obeys this too, and harder: a jump target usually shares no
 * neighbour with wherever you jumped from, so nearly everything is released and the
 * destination rebuilds. Jumping back and forth between two zones is still free.
 */
export const KEEP_WITHIN = 1;
