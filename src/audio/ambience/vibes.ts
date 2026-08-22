import type { AmbienceSpec } from './spec';

/**
 * The ambience book — one spec per kind of place, keyed by the same names the
 * score uses. A zone names a vibe and gets both halves; see `audio/vibes.ts`.
 *
 * Every entry here is currently its keynote and nothing else. The chorus, the
 * cast and the soundmarks land with the director.
 */

export const VILLAGE_1_AMBIENCE: AmbienceSpec = {
  air: [{ model: 'wind', id: 'air', options: { gain: 0.15, tone: 3000 } }],
  activity: 0.55,
  seed: 148,
};

export const VILLAGE_2_AMBIENCE: AmbienceSpec = {
  air: [{ model: 'wind', id: 'air', options: { gain: 0.13, tone: 2800 } }],
  activity: 0.85,
  seed: 166,
};

export const VILLAGE_INTERIOR_1_AMBIENCE: AmbienceSpec = {
  air: [{ model: 'wind', id: 'air', options: { gain: 0.04, tone: 900, whistle: 0 } }],
  activity: 0.3,
  seed: 167,
};

export const VILLAGE_INTERIOR_2_AMBIENCE: AmbienceSpec = {
  air: [{ model: 'wind', id: 'air', options: { gain: 0.035, tone: 1100, whistle: 0 } }],
  activity: 0.3,
  seed: 168,
};

export const FARM_AMBIENCE: AmbienceSpec = {
  air: [{ model: 'wind', id: 'air', options: { gain: 0.19, tone: 3600 } }],
  activity: 0.7,
  seed: 149,
};

export const FOREST_A_AMBIENCE: AmbienceSpec = {
  air: [{ model: 'wind', id: 'air', options: { gain: 0.14, tone: 3100 } }],
  activity: 0.8,
  seed: 150,
};

export const FOREST_B_AMBIENCE: AmbienceSpec = {
  air: [{ model: 'wind', id: 'air', options: { gain: 0.16, tone: 2600 } }],
  activity: 0.45,
  seed: 151,
};

export const FOREST_PATH_A_AMBIENCE: AmbienceSpec = {
  air: [{ model: 'wind', id: 'air', options: { gain: 0.15, tone: 3300 } }],
  activity: 0.65,
  seed: 152,
};

export const FOREST_PATH_B_AMBIENCE: AmbienceSpec = {
  air: [{ model: 'wind', id: 'air', options: { gain: 0.12, tone: 2400 } }],
  activity: 0.5,
  seed: 153,
};

export const RIVERSIDE_AMBIENCE: AmbienceSpec = {
  air: [{ model: 'wind', id: 'air', options: { gain: 0.13, tone: 3200 } }],
  activity: 0.7,
  seed: 154,
};

export const CAVE_AMBIENCE: AmbienceSpec = {
  air: [{ model: 'wind', id: 'air', options: { gain: 0.06, tone: 500, whistle: 0.2 } }],
  activity: 0.25,
  seed: 155,
};

export const CAVE_2_AMBIENCE: AmbienceSpec = {
  air: [{ model: 'wind', id: 'air', options: { gain: 0.05, tone: 600, whistle: 0.15 } }],
  activity: 0.3,
  seed: 160,
};

export const CAVE_DARK_AMBIENCE: AmbienceSpec = {
  air: [{ model: 'wind', id: 'air', options: { gain: 0.06, tone: 380, whistle: 0.25 } }],
  activity: 0.18,
  seed: 156,
};

export const FACTORY_1_AMBIENCE: AmbienceSpec = {
  air: [{ model: 'wind', id: 'air', options: { gain: 0.08, tone: 1800, whistle: 0 } }],
  activity: 0.75,
  seed: 161,
};

export const FACTORY_2_AMBIENCE: AmbienceSpec = {
  air: [{ model: 'wind', id: 'air', options: { gain: 0.07, tone: 1500, whistle: 0 } }],
  activity: 0.9,
  seed: 159,
};

export const SEWER_1_AMBIENCE: AmbienceSpec = {
  air: [{ model: 'wind', id: 'air', options: { gain: 0.07, tone: 700, whistle: 0.2 } }],
  activity: 0.4,
  seed: 158,
};

export const SEWER_2_AMBIENCE: AmbienceSpec = {
  air: [{ model: 'wind', id: 'air', options: { gain: 0.06, tone: 800, whistle: 0.1 } }],
  activity: 0.4,
  seed: 157,
};

export const SCRAPYARD_AMBIENCE: AmbienceSpec = {
  air: [{ model: 'wind', id: 'air', options: { gain: 0.2, tone: 4200 } }],
  activity: 0.5,
  seed: 162,
};

export const SUBSTATION_1_AMBIENCE: AmbienceSpec = {
  air: [{ model: 'wind', id: 'air', options: { gain: 0.14, tone: 3800 } }],
  activity: 0.45,
  seed: 163,
};

export const SUBSTATION_2_AMBIENCE: AmbienceSpec = {
  air: [{ model: 'wind', id: 'air', options: { gain: 0.17, tone: 4000 } }],
  activity: 0.4,
  seed: 164,
};

export const BEACH_AMBIENCE: AmbienceSpec = {
  air: [{ model: 'wind', id: 'air', options: { gain: 0.24, tone: 4400 } }],
  activity: 0.6,
  seed: 169,
};

export const BEACH_PATH_AMBIENCE: AmbienceSpec = {
  air: [{ model: 'wind', id: 'air', options: { gain: 0.2, tone: 3900 } }],
  activity: 0.6,
  seed: 170,
};
