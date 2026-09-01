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

/**
 * Under the cottage: no window, so nothing arrives but what is carried down.
 * The sun is off entirely and the fog is close, which is the whole of what
 * makes a room read as being below ground.
 */
const COUNTRYSIDE_CELLAR: ZoneEnvironment = {
  ...COUNTRYSIDE_HOUSE,
  room: 'cell',
  surface: 'stone',
  fogColor: '#0d0b07',
  fogNear: 3,
  fogFar: 14,
  ambientSky: 0x4a4438,
  ambientGround: 0x2b2620,
  ambientIntensity: 1.1,
  sunIntensity: 0,
  fillIntensity: 0.3,
  firstPersonReverb: 0.7,
  vibe: 'village interior 2',
};

registerEnvironment('countryside-house', COUNTRYSIDE_HOUSE);
registerEnvironment('countryside-store', COUNTRYSIDE_STORE);
registerEnvironment('countryside-cellar', COUNTRYSIDE_CELLAR);

/**
 * A flagged floor, for the store. `buildInterior` paints its slab in `floor`
 * when boards are off, and nothing else moves: it is the same building as its
 * neighbours, and the floor is the whole of what makes it read as cold.
 */
registerInteriorStyle('countryside-store', { ...HOUSE_STYLE, floor: PALETTE.STONE_DARK });

/** Stone all round, with the cottage's boards overhead as the cellar's ceiling. */
registerInteriorStyle('countryside-cellar', {
  floor: PALETTE.STONE_DARK,
  floorSeam: 0x0b0d0e,
  wall: PALETTE.STONE_DARK,
  wallTrim: PALETTE.STONE,
  ceiling: PALETTE.TIMBER_DARK,
  beam: PALETTE.BARK,
});
