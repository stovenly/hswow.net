import type { PortalGraph } from './Portal';
import type { ZoneId } from './Zone';

/**
 * Which zones may stay built when the player is standing in `active`.
 *
 * **Distance is measured in doors, not in metres.** Two rooms can share a wall
 * and be a hundred paces apart through the building, and it is the walk that
 * decides what the player is about to need. The portal graph is the only
 * structure that knows this, which is why residency is keyed to it rather than
 * to a least-recently-used list: an LRU answers "what did they look at least
 * recently", and the question worth answering is "what can they reach next".
 *
 * Pure, and separate from `ZoneManager`, because the manager cannot be built
 * without a renderer and a DOM — so this is the half of the policy the headless
 * check suite can actually interrogate. The manager holds the *mechanism*
 * (disposing geometry, dropping octrees, unbinding doors); this is the rule.
 *
 * @see SCALING.md §1
 */
export function residentZones(
  portals: PortalGraph,
  active: ZoneId,
  keepWithin: number,
): Set<ZoneId> {
  const keep = new Set<ZoneId>([active]);
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
 * How many doors from the active zone a place may be and still be kept.
 *
 * **Two, and the second one is hysteresis rather than headroom.** The resident
 * set the policy actually aims at is the current zone plus everything one hop
 * away — under the finished shape that is one hub and its interiors, which is
 * the set the player can reach in a single action. Evicting at exactly that
 * boundary would drop a zone the moment you stepped through a door and rebuild
 * it the moment you stepped back, so a player pacing in and out of a doorway
 * would pay a full rebuild every crossing. Keeping the ring beyond it costs one
 * more layer of rooms and makes that free.
 */
export const KEEP_WITHIN = 2;
