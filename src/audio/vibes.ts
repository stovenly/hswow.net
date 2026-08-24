import type { MusicSpec } from './music/director';
import type { AmbienceSpec } from './ambience/spec';
import * as music from './music/vibes';
import * as ambience from './ambience/vibes';

/**
 * A vibe is a kind of place, and it owns both halves of what that place sounds
 * like. A zone names one and gets the pair, or names each half separately —
 * a village cell need not take the same vibe's music and air.
 *
 * Rack identity is spec identity in both directors, so a zone must reach these
 * through `VIBES` and never copy the fields.
 *
 * These names are working labels.
 */

export interface Vibe {
  readonly music: MusicSpec;
  readonly ambience: AmbienceSpec;
}

export const VIBES = {
  'village 1': { music: music.VILLAGE_1_VIBE, ambience: ambience.VILLAGE_1_AMBIENCE },
  'village 2': { music: music.VILLAGE_2_VIBE, ambience: ambience.VILLAGE_2_AMBIENCE },
  'village interior 1': {
    music: music.VILLAGE_INTERIOR_1_VIBE,
    ambience: ambience.VILLAGE_INTERIOR_1_AMBIENCE,
  },
  'village interior 2': {
    music: music.VILLAGE_INTERIOR_2_VIBE,
    ambience: ambience.VILLAGE_INTERIOR_2_AMBIENCE,
  },
  farm: { music: music.FARM_VIBE, ambience: ambience.FARM_AMBIENCE },
  'forest a': { music: music.FOREST_A_VIBE, ambience: ambience.FOREST_A_AMBIENCE },
  'forest b': { music: music.FOREST_B_VIBE, ambience: ambience.FOREST_B_AMBIENCE },
  'forest path a': {
    music: music.FOREST_PATH_A_VIBE,
    ambience: ambience.FOREST_PATH_A_AMBIENCE,
  },
  'forest path b': {
    music: music.FOREST_PATH_B_VIBE,
    ambience: ambience.FOREST_PATH_B_AMBIENCE,
  },
  riverside: { music: music.RIVERSIDE_VIBE, ambience: ambience.RIVERSIDE_AMBIENCE },
  cave: { music: music.CAVE_VIBE, ambience: ambience.CAVE_AMBIENCE },
  'cave 2': { music: music.CAVE_2_VIBE, ambience: ambience.CAVE_2_AMBIENCE },
  'cave dark': { music: music.CAVE_DARK_VIBE, ambience: ambience.CAVE_DARK_AMBIENCE },
  'factory 1': { music: music.FACTORY_1_VIBE, ambience: ambience.FACTORY_1_AMBIENCE },
  'factory 2': { music: music.FACTORY_2_VIBE, ambience: ambience.FACTORY_2_AMBIENCE },
  'sewer 1': { music: music.SEWER_1_VIBE, ambience: ambience.SEWER_1_AMBIENCE },
  'sewer 2': { music: music.SEWER_2_VIBE, ambience: ambience.SEWER_2_AMBIENCE },
  scrapyard: { music: music.SCRAPYARD_VIBE, ambience: ambience.SCRAPYARD_AMBIENCE },
  'substation 1': {
    music: music.SUBSTATION_1_VIBE,
    ambience: ambience.SUBSTATION_1_AMBIENCE,
  },
  'substation 2': {
    music: music.SUBSTATION_2_VIBE,
    ambience: ambience.SUBSTATION_2_AMBIENCE,
  },
  beach: { music: music.BEACH_VIBE, ambience: ambience.BEACH_AMBIENCE },
  'beach path': { music: music.BEACH_PATH_VIBE, ambience: ambience.BEACH_PATH_AMBIENCE },
  'plains 1': { music: music.PLAINS_1_VIBE, ambience: ambience.PLAINS_1_AMBIENCE },
  'plains 2': { music: music.PLAINS_2_VIBE, ambience: ambience.PLAINS_2_AMBIENCE },
} as const satisfies Record<string, Vibe>;

export type VibeName = keyof typeof VIBES;

/** In the order they are worth walking. */
export const VIBE_NAMES = Object.keys(VIBES) as readonly VibeName[];

/**
 * What a zone declares. A bare name takes both halves; the object form splits
 * them, and an array of ambience names is a rotation — see `ambienceFor`.
 */
export type VibeChoice =
  | VibeName
  | {
      readonly music?: VibeName | null;
      readonly ambience?: VibeName | readonly VibeName[] | null;
    };

export function musicFor(choice: VibeChoice | undefined): MusicSpec | null {
  if (choice === undefined) return null;
  if (typeof choice === 'string') return VIBES[choice].music;
  const name = choice.music;
  return name ? VIBES[name].music : null;
}

/**
 * Which ambience a zone runs today.
 *
 * A rotation is drawn on the zone and the **day**, not on the crossing: a place
 * sounds the same all day and different next week, and walking out of a door
 * and back in cannot change what the village sounds like.
 */
export function ambienceFor(
  choice: VibeChoice | undefined,
  zoneId: string,
  day: number,
): AmbienceSpec | null {
  if (choice === undefined) return null;
  if (typeof choice === 'string') return VIBES[choice].ambience;
  const named = choice.ambience;
  if (!named) return null;
  if (typeof named === 'string') return VIBES[named].ambience;
  if (named.length === 0) return null;
  return VIBES[named[roll(zoneId, day) % named.length]].ambience;
}

/**
 * Which vibe a spec came out of, for readouts. Looked up by identity, which is
 * already what rack identity is in both directors — so a spec held from the
 * panel names itself as readily as one a zone asked for.
 */
export function vibeOf(spec: object | null | undefined): VibeName | null {
  return spec ? (OWNERS.get(spec) ?? null) : null;
}

const OWNERS = new Map<object, VibeName>();
for (const name of VIBE_NAMES) {
  OWNERS.set(VIBES[name].music, name);
  OWNERS.set(VIBES[name].ambience, name);
}

function roll(zoneId: string, day: number): number {
  let value = 0x811c9dc5;
  for (let i = 0; i < zoneId.length; i++) {
    value = Math.imul(value ^ zoneId.charCodeAt(i), 0x01000193);
  }
  return (Math.imul(value ^ Math.floor(day), 0x01000193) >>> 8) % 0x7fffffff;
}
