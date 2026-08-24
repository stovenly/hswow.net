import type { PortalDefinition } from '@engine/world/Portal';
import { wallEnd } from '@engine/world/document';
import { HOUSE_DOORS, ZONE_COTTAGE, ZONE_WORKSHOP, ZONE_STORE } from './countryside-village';

/**
 * The doors into the three countryside homes.
 *
 * The rooms themselves are documents under `content/zones/`. What is left here
 * is the wiring, and only until the village exterior is a document too: one end
 * is a doorway on a hand-placed building in code, and the other is the north
 * wall of a room the editor owns.
 */

export function countrysideHomePortals(): PortalDefinition[] {
  return [
    homePortal(ZONE_COTTAGE, 8811),
    homePortal(ZONE_WORKSHOP, 8812),
    homePortal(ZONE_STORE, 8813),
  ];
}

function homePortal(zone: string, seed: number): PortalDefinition {
  const outside = HOUSE_DOORS.get(zone);
  if (!outside) throw new Error(`no doorway in the exterior for ${zone}`);
  const inside = wallEnd(zone, '-z');
  return {
    id: `${zone}-door`,
    a: outside,
    b: { zone, position: inside.position, yaw: inside.yaw, material: 'timber', seed },
  };
}
