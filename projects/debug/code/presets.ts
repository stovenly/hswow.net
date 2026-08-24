import { INDOOR_ENVIRONMENT, type ZoneEnvironment } from '@engine/world/Zone';
import { registerEnvironment } from '@engine/world/environments';
import { HOUSE_STYLE, registerInteriorStyle } from '@engine/world/interior';
import { PALETTE } from '@engine/art/palette';

/**
 * Named environments and interior styles the project's documents point at.
 * Registered at import, which is before any document is read.
 */

/** Warm, close and quiet — the register the countryside interiors share. */
const COUNTRYSIDE_HOUSE: ZoneEnvironment = {
  ...INDOOR_ENVIRONMENT,
  room: 'cell',
  surface: 'wood',
  fogColor: '#181309',
  fogNear: 8,
  fogFar: 30,
  ambientSky: 0xa2977c,
  ambientGround: 0x574c3c,
  ambientIntensity: 2.3,
  sunIntensity: 1.2,
  fillIntensity: 0.8,
  fillColor: 0xa08c6a,
  firstPersonReverb: 0.45,
  vibe: 'village interior 1',
  // The rooms behind the village's south walls, so the world's north is theirs
  // and their windows take the sun square at noon.
  bearing: 0,
};

/**
 * The store: stone underfoot in a shorter, harder room, so the fog closes
 * sooner and the boots ring. Everything here is the floor's doing.
 */
const COUNTRYSIDE_STORE: ZoneEnvironment = {
  ...COUNTRYSIDE_HOUSE,
  surface: 'stone',
  fogNear: 6,
  fogFar: 24,
  firstPersonReverb: 0.55,
  vibe: 'village interior 2',
};

registerEnvironment('countryside-house', COUNTRYSIDE_HOUSE);
registerEnvironment('countryside-store', COUNTRYSIDE_STORE);

/**
 * A flagged floor, for the store. `buildInterior` paints its slab in `floor`
 * when boards are off, and nothing else moves: it is the same building as its
 * neighbours, and the floor is the whole of what makes it read as cold.
 */
registerInteriorStyle('countryside-store', { ...HOUSE_STYLE, floor: PALETTE.STONE_DARK });
