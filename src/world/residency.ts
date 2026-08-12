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
 * How many doors from the active zone a place may be and still be kept.
 *
 * **One, plus the room you just left.**
 *
 * It was two, and the second hop was described here as hysteresis rather than
 * headroom: evicting at exactly one hop would drop a zone the moment you
 * stepped through a door and rebuild it the moment you stepped back, so a
 * player pacing in a doorway would pay a rebuild every crossing. That reasoning
 * was right and the implementation of it was a blunt instrument — a whole extra
 * ring of rooms to protect *one* of them, the one behind you.
 *
 * The Materials wing is what made the difference matter. It is a hub with seven
 * heavy rooms hanging off it, and under a two-hop ring every one of those rooms
 * is resident from inside any other one: walk the wing once and all seven stay
 * built for the session, which is about ninety megabytes of vertex buffers and
 * seven collision octrees that nothing will ever release. At one hop the wing
 * costs the room you are in, the hub, and the room you came from.
 *
 * `cameFrom` is the hysteresis, stated exactly: one zone, the one a step back
 * would return to, rather than everything a step-and-a-half might.
 *
 * **Doorless travel obeys this too, and harder.** The debug menu's jump goes
 * through `ZoneManager.travel`, which is `enter` under a fade — so it sets
 * `cameFrom` and evicts exactly as a door does. But a jump target usually
 * shares no neighbour with wherever you jumped from, so nearly everything is
 * released and the destination rebuilds. That is the right answer and it is a
 * change in feel: hopping round the Materials wing used to be instant after the
 * first visit *because* nothing was ever evicted, which is the same sentence as
 * the crash. Jumping back and forth between two zones is still free, that being
 * the one case `cameFrom` exists for.
 *
 * Measured over the real portal graph. Walking or jumping the whole wing peaks
 * at two built zones against seven before; visiting all forty-four zones in a
 * row peaks at three against eight; ping-ponging between two rooms is two
 * either way.
 */
export const KEEP_WITHIN = 1;
