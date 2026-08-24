import type { WorldSource } from '../app/boot';
import { createTestWorld, ZONE_EXTERIOR, ZONE_COUNTRYSIDE } from './zones';

/** Every zone the debug build carries, and where a fresh boot lands. */
export const debugWorld: WorldSource = {
  world: (provingGround) => createTestWorld(provingGround),
  entry: ZONE_EXTERIOR,
  prebuild: [ZONE_COUNTRYSIDE],
  precompile: [ZONE_COUNTRYSIDE],
};
