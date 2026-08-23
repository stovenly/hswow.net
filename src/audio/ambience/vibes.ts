import type { AmbienceSpec, CastMember, Signal } from './spec';

/**
 * The ambience book — one spec per kind of place, keyed by the same names the
 * score uses. A zone names a vibe and gets both halves; see `audio/vibes.ts`.
 *
 * Four strata per entry, and they are Schafer's: the `air` is the keynote and
 * never stops, the `chorus` is the middle distance, the `cast` is who speaks,
 * and a `signal` is meant to be listened to. A signal marked `clock: 'hour'` is
 * a soundmark — the one thing here allowed to be predictable.
 *
 * Everything here is what a whole place sounds like from anywhere in it. The
 * test for a row is whether you could walk round the thing making it; if you
 * could, it belongs to the zone that placed it and not here.
 */

/** Thunder, for anywhere under the sky. Indoors it arrives through the roof at `level`. */
const thunder = (level = 1): Signal => ({
  voice: 'thunder',
  every: [40, 140],
  floor: 25,
  height: 40,
  level,
  hushes: true,
  when: { rain: [0.25, 1] },
});

/** Drips after a shower, off whatever is overhead. */
const afterRain = (voice: 'drip' | 'eaves', height: number, level = 1): CastMember => ({
  voice,
  every: [2.4, 4.6],
  height,
  level,
  when: { after: 'rain' },
});

/** A roof's worth of snow letting go, in a thaw. */
const thaw = (level = 1): CastMember => ({
  voice: 'slide',
  every: [60, 200],
  height: 5,
  level,
  when: { after: 'snow', warmth: [1, 30] },
});

/** The evening's bats, anywhere warm enough to have insects. */
const dusk = (every: readonly [number, number] = [20, 60], height = 6): CastMember => ({
  voice: 'bats',
  every,
  height,
  when: { sun: [-12, -1], warmth: [8, 40] },
});

export const VILLAGE_1_AMBIENCE: AmbienceSpec = {
  air: [
    { model: 'air', id: 'air', options: { gain: 0.15, tone: 3000, shelter: 0.45, aperture: 0.25, roar: 0.5, rush: 1.0, hiss: 0.6 }, follow: [{ by: 'wind', span: [0.5, 1.2] }] },
  ],
  chorus: [
    { model: 'bustle', options: { rate: 7, distance: 700, roll: 0.4, busy: 0.5, gain: 0.09 }, follow: [{ by: 'night', span: [1, 0.1] }] },
    { model: 'hedge', options: { density: 190, tone: 1.15, woody: 0.45, gain: 0.08 } },
    { model: 'hedge', options: { density: 240, tone: 0.85, woody: 0.3, gain: 0.07 } },
    { model: 'foliage', options: { density: 220, tone: 0.85, gain: 0.07, articulation: 0.2 }, follow: [{ by: 'wind', span: [0.15, 1] }] },
    // Every shutter and sign in the lane, in a gust. Wood, so it claps rather than rings.
    { model: 'plate', options: { pitch: 260, decay: 0.25, bright: 0.3, onset: 0.5, snap: 0.15, gain: 0.06 } },
  ],
  cast: [
    { voice: 'blackbird', every: [22, 50], height: 7, when: { sun: [-7, 12], wakes: 50, shy: 0.65 } },
    { voice: 'robin', every: [26, 60], height: 3, when: { sun: [-9, 20], wakes: 45, shy: 0.6 } },
    { voice: 'sparrow', every: [14, 34], height: 3, when: { sun: [-1, 90], shy: 0.7 } },
    { voice: 'swift', every: [12, 30], height: 16, passes: { over: 60, seconds: [1.6, 3] }, when: { sun: [2, 40], season: [0.38, 0.68] } },
    { voice: 'wings', every: [50, 150], height: 7 },
    { voice: 'thump', every: [40, 120], level: 0.6, when: { sun: [-2, 90] } },
    { voice: 'buffet', every: [10, 35], level: 0.6, when: { wind: [0.5, 1] } },
    afterRain('eaves', 4),
    thaw(0.7),
    dusk(),
  ],
  signals: [
    { voice: 'bell-church', every: [0, 0], height: 18, floor: 0, clock: 'hour', level: 0.9 },
    thunder(),
  ],
  activity: 0.55,
  seed: 148,
};

export const VILLAGE_2_AMBIENCE: AmbienceSpec = {
  air: [
    { model: 'air', id: 'air', options: { gain: 0.11, tone: 2800, shelter: 0.55, aperture: 0.2, roar: 0.5, rush: 1.0, hiss: 0.5 }, follow: [{ by: 'wind', span: [0.5, 1.1] }] },
  ],
  chorus: [
    { model: 'bustle', options: { rate: 24, distance: 1000, roll: 0.75, busy: 0.85, gain: 0.14 }, follow: [{ by: 'night', span: [1, 0.05] }, { by: 'rain', span: [1, 0.4] }] },
    { model: 'hedge', options: { density: 130, tone: 1.3, woody: 0.5, gain: 0.055 } },
    { model: 'foliage', options: { density: 180, tone: 0.9, gain: 0.06, articulation: 0.2 }, follow: [{ by: 'wind', span: [0.15, 1] }] },
    // The square's awnings: canvas, so it flaps and lets go easily.
    { model: 'plate', options: { pitch: 120, decay: 0.15, bright: 0.5, onset: 0.42, snap: 0.5, gain: 0.07 } },
  ],
  cast: [
    { voice: 'wings', every: [40, 120], height: 7 },
    { voice: 'sparrow', every: [16, 40], height: 4, when: { sun: [-2, 90] } },
    { voice: 'swift', every: [14, 34], height: 16, passes: { over: 60, seconds: [1.6, 3] }, when: { sun: [2, 40], season: [0.38, 0.68] } },
    { voice: 'rabble', every: [50, 160], level: 0.6, when: { sun: [0, 90] } },
    { voice: 'thump', every: [30, 90], level: 0.7, when: { sun: [-2, 90] } },
    { voice: 'slab', every: [60, 180], level: 0.5, when: { sun: [0, 90] } },
    { voice: 'buffet', every: [10, 35], level: 0.6, when: { wind: [0.5, 1] } },
    afterRain('eaves', 4),
    thaw(0.7),
    dusk(),
  ],
  signals: [
    { voice: 'bell-church', every: [0, 0], height: 18, floor: 0, clock: 'hour', level: 0.7 },
    thunder(),
  ],
  activity: 0.85,
  seed: 166,
};

export const VILLAGE_INTERIOR_1_AMBIENCE: AmbienceSpec = {
  air: [
    { model: 'cavern', id: 'room', options: { size: 155, hard: 0.22, draught: 0.12, drift: 0.1, floor: 0.22, gain: 0.09 } },
    // The draught: under the door, round the frames, all through the house.
    { model: 'air', id: 'draught', options: { gain: 0.035, tone: 900, shelter: 0.95, aperture: 0.5, roar: 0.6, rush: 0.8, hiss: 0.2, width: 0.5 }, follow: [{ by: 'wind', span: [0.2, 1.2] }] },
  ],
  chorus: [
    // The village, through the wall.
    { model: 'bustle', options: { rate: 6, distance: 320, roll: 0.4, busy: 0.5, gain: 0.04 }, follow: [{ by: 'night', span: [1, 0.1] }] },
    // The thatch overhead.
    { model: 'foliage', options: { density: 120, tone: 2.4, gain: 0.03, articulation: 0.4 }, follow: [{ by: 'wind', span: [0.1, 1] }] },
  ],
  cast: [
    { voice: 'crack', every: [60, 200], level: 0.4, when: { sun: [-9, 8] } },
    { voice: 'timber', every: [25, 80], level: 0.5, when: { wind: [0.3, 1] } },
    { voice: 'buffet', every: [8, 30], when: { wind: [0.45, 1] } },
    { voice: 'blackbird', every: [30, 70], height: 6, level: 0.25, when: { sun: [-7, 12], wakes: 50 } },
    { voice: 'sparrow', every: [30, 70], height: 3, level: 0.2, when: { sun: [-1, 90] } },
    { voice: 'swift', every: [20, 50], height: 14, level: 0.3, passes: { over: 60, seconds: [1.6, 3] }, when: { sun: [2, 40], season: [0.38, 0.68] } },
    afterRain('eaves', 3, 0.6),
    thaw(0.8),
  ],
  signals: [
    { voice: 'bell-church', every: [0, 0], height: 18, floor: 0, clock: 'hour', level: 0.3 },
    thunder(0.6),
  ],
  activity: 0.3,
  seed: 167,
};

export const VILLAGE_INTERIOR_2_AMBIENCE: AmbienceSpec = {
  air: [
    { model: 'cavern', id: 'room', options: { size: 178, hard: 0.3, draught: 0.1, drift: 0.08, floor: 0.18, gain: 0.08 } },
    { model: 'air', id: 'draught', options: { gain: 0.03, tone: 800, shelter: 0.95, aperture: 0.4, roar: 0.5, rush: 0.8, hiss: 0.2, width: 0.5 }, follow: [{ by: 'wind', span: [0.2, 1.2] }] },
  ],
  chorus: [
    { model: 'bustle', options: { rate: 12, distance: 380, roll: 0.5, busy: 0.7, gain: 0.045 }, follow: [{ by: 'night', span: [1, 0.05] }] },
    { model: 'foliage', options: { density: 100, tone: 2.0, gain: 0.025, articulation: 0.4 }, follow: [{ by: 'wind', span: [0.1, 1] }] },
  ],
  cast: [
    { voice: 'crack', every: [90, 260], level: 0.35, when: { sun: [-9, 8] } },
    { voice: 'timber', every: [30, 90], level: 0.45, when: { wind: [0.3, 1] } },
    { voice: 'buffet', every: [8, 30], level: 0.9, when: { wind: [0.45, 1] } },
    { voice: 'sparrow', every: [26, 60], height: 3, level: 0.25, when: { sun: [-1, 90] } },
    { voice: 'swift', every: [20, 50], height: 14, level: 0.3, passes: { over: 60, seconds: [1.6, 3] }, when: { sun: [2, 40], season: [0.38, 0.68] } },
    { voice: 'wings', every: [60, 180], height: 5, level: 0.4 },
    afterRain('eaves', 3, 0.6),
    thaw(0.8),
  ],
  signals: [
    { voice: 'bell-church', every: [0, 0], height: 18, floor: 0, clock: 'hour', level: 0.35 },
    thunder(0.6),
  ],
  activity: 0.3,
  seed: 168,
};

export const FARM_AMBIENCE: AmbienceSpec = {
  air: [
    { model: 'air', id: 'air', options: { gain: 0.19, tone: 3600, shelter: 0.1, aperture: 0.35, roar: 0.7, rush: 1.0, hiss: 0.95 }, follow: [{ by: 'wind', span: [0.4, 1.3] }] },
    // The crop. Dry, high and papery, and it is the field's own voice.
    {
      model: 'foliage',
      options: { density: 300, tone: 1.7, gain: 0.11, articulation: 0.4, restlessness: 0.1 },
      follow: [{ by: 'wind', span: [0.1, 1] }],
      when: { season: [0.3, 0.8] },
    },
  ],
  chorus: [
    { model: 'hedge', options: { density: 260, tone: 0.95, woody: 0.4, gain: 0.075 } },
    { model: 'foliage', options: { density: 220, tone: 0.85, gain: 0.07, articulation: 0.2 }, follow: [{ by: 'wind', span: [0.15, 1] }] },
    { model: 'insect', options: { kind: 'cricket', voices: 4, gain: 0.085 }, follow: [{ by: 'night', span: [0.35, 1] }], when: { season: [0.32, 0.82] } },
    { model: 'insect', options: { kind: 'grasshopper', voices: 5, gain: 0.06 }, when: { sun: [4, 90], season: [0.36, 0.8] } },
    // Work going on somewhere over the hedges: wood, stone, and nothing sharp.
    { model: 'bustle', options: { rate: 3, distance: 600, roll: 0.3, busy: 0.4, gain: 0.05 }, follow: [{ by: 'night', span: [1, 0.05] }] },
  ],
  cast: [
    { voice: 'swallow', every: [16, 40], height: 6, passes: { over: 40, seconds: [1.2, 2.4] }, when: { season: [0.35, 0.72], sun: [0, 90] } },
    { voice: 'quail', every: [30, 80], height: 0.3, when: { season: [0.38, 0.7], sun: [-30, 90] } },
    { voice: 'lapwing', every: [40, 110], height: 6, passes: { over: 40, seconds: [2, 4] }, when: { season: [0.2, 0.6], sun: [-6, 90] } },
    { voice: 'curlew', every: [60, 180], height: 3, when: { season: [0.78, 0.22], sun: [-8, 90] } },
    { voice: 'yellowhammer', every: [30, 75], height: 2, when: { season: [0.28, 0.72], sun: [2, 90], shy: 0.6 } },
    { voice: 'linnet', every: [40, 110], height: 2.5, when: { season: [0.3, 0.74], sun: [2, 90] } },
    { voice: 'wings', every: [60, 160], height: 4 },
    { voice: 'thump', every: [40, 120], level: 0.6, when: { sun: [-2, 90] } },
    { voice: 'timber', every: [30, 90], level: 0.5, when: { wind: [0.35, 1] } },
    afterRain('eaves', 4),
    thaw(),
    dusk(),
  ],
  signals: [thunder()],
  activity: 0.7,
  seed: 149,
};

export const FOREST_A_AMBIENCE: AmbienceSpec = {
  air: [
    { model: 'air', id: 'air', options: { gain: 0.12, tone: 3100, shelter: 0.5, aperture: 0.2, roar: 0.55, rush: 1.0, hiss: 0.75 }, follow: [{ by: 'wind', span: [0.35, 1.2] }] },
    { model: 'foliage', options: { density: 280, tone: 0.8, gain: 0.08, articulation: 0.2, restlessness: 0.12 }, follow: [{ by: 'wind', span: [0.2, 1] }] },
  ],
  chorus: [
    { model: 'foliage', options: { density: 260, tone: 0.78, gain: 0.14, articulation: 0.2 }, follow: [{ by: 'wind', span: [0.2, 1] }] },
    { model: 'foliage', options: { density: 240, tone: 0.86, gain: 0.13, articulation: 0.22 }, follow: [{ by: 'wind', span: [0.2, 1] }] },
    { model: 'foliage', options: { density: 200, tone: 0.7, gain: 0.12, articulation: 0.16 }, follow: [{ by: 'wind', span: [0.15, 1] }] },
    { model: 'hedge', options: { density: 160, tone: 1.0, woody: 0.4, gain: 0.06 } },
  ],
  cast: [
    { voice: 'songthrush', every: [20, 46], height: 9, when: { sun: [-9, 24], wakes: 47, shy: 0.6 } },
    { voice: 'blackbird', every: [24, 55], height: 8, when: { sun: [-9, 26], wakes: 50, shy: 0.6 } },
    { voice: 'robin', every: [22, 52], height: 3, when: { sun: [-10, 30], wakes: 45, shy: 0.6 } },
    { voice: 'wren', every: [30, 80], height: 1.5, when: { sun: [-4, 40], wakes: 20, shy: 0.55 } },
    { voice: 'chaffinch', every: [26, 65], height: 7, when: { sun: [-2, 50], wakes: 10, shy: 0.6 } },
    { voice: 'greattit', every: [28, 70], height: 6, when: { sun: [-1, 60], wakes: 8, shy: 0.6 } },
    { voice: 'blackcap', every: [34, 90], height: 7, when: { season: [0.3, 0.7], sun: [-4, 60], shy: 0.55 } },
    { voice: 'nightingale', every: [30, 80], height: 3, when: { season: [0.3, 0.5], sun: [-90, -2], shy: 0.5 } },
    { voice: 'wings', every: [50, 150], height: 7 },
    { voice: 'timber', every: [30, 90], height: 8, level: 0.6, when: { wind: [0.35, 1] } },
    { voice: 'bough', every: [300, 900], height: 6, level: 0.8 },
    { voice: 'mast', every: [20, 60], height: 7, when: { season: [0.62, 0.85] } },
    afterRain('drip', 6),
    dusk([30, 80], 5),
  ],
  signals: [thunder()],
  activity: 0.8,
  seed: 150,
};

export const FOREST_B_AMBIENCE: AmbienceSpec = {
  air: [
    { model: 'air', id: 'air', options: { gain: 0.14, tone: 2400, shelter: 0.62, aperture: 0.15, roar: 0.7, rush: 1.0, hiss: 0.6 }, follow: [{ by: 'wind', span: [0.4, 1.2] }] },
    { model: 'foliage', options: { density: 340, tone: 1.35, gain: 0.075, articulation: 0.12, restlessness: 0.32 }, follow: [{ by: 'wind', span: [0.35, 1] }] },
  ],
  chorus: [
    { model: 'foliage', options: { density: 300, tone: 1.25, gain: 0.12, articulation: 0.14, restlessness: 0.25 }, follow: [{ by: 'wind', span: [0.3, 1] }] },
    { model: 'friction', options: { force: 0.55, pitch: 96, decay: 1.1, bright: 0.25, roughness: 0.55, gain: 0.24, motion: 'weather' }, follow: [{ by: 'gust', span: [0, 1] }] },
    { model: 'water', options: { flow: 'stream', gain: 0.1, tone: 0.45 } },
    { model: 'hedge', options: { density: 140, tone: 0.9, woody: 0.6, gain: 0.05 } },
  ],
  cast: [
    { voice: 'wren', every: [45, 130], height: 1.2, when: { sun: [-2, 40], shy: 0.5 } },
    { voice: 'robin', every: [40, 110], height: 2.5, when: { sun: [-10, 16], wakes: 45, shy: 0.5 } },
    { voice: 'crack', every: [70, 220], height: 1, level: 0.8 },
    { voice: 'slab', every: [220, 700], level: 0.6 },
    { voice: 'grit', every: [60, 180], height: 2, level: 0.7 },
    { voice: 'timber', every: [25, 70], height: 8, level: 0.7, when: { wind: [0.3, 1] } },
    { voice: 'bough', every: [240, 700], height: 6 },
    { voice: 'mast', every: [25, 70], height: 8, when: { season: [0.62, 0.85] } },
    { voice: 'wings', every: [80, 220], height: 6, level: 0.7 },
    afterRain('drip', 7),
    dusk([14, 40], 5),
  ],
  signals: [thunder()],
  activity: 0.45,
  seed: 151,
};

export const FOREST_PATH_A_AMBIENCE: AmbienceSpec = {
  air: [
    { model: 'air', id: 'air', options: { gain: 0.15, tone: 3300, shelter: 0.38, aperture: 0.25, roar: 0.55, rush: 1.0, hiss: 0.8 }, follow: [{ by: 'wind', span: [0.4, 1.25] }] },
    { model: 'foliage', options: { density: 200, tone: 1.1, gain: 0.06, articulation: 0.24 }, follow: [{ by: 'wind', span: [0.2, 1] }] },
  ],
  chorus: [
    { model: 'foliage', options: { density: 150, tone: 1.5, gain: 0.11, articulation: 0.34 }, follow: [{ by: 'wind', span: [0.2, 1] }] },
    { model: 'foliage', options: { density: 220, tone: 0.8, gain: 0.1, articulation: 0.16 }, follow: [{ by: 'wind', span: [0.15, 1] }] },
    { model: 'water', options: { flow: 'brook', gain: 0.12, tone: 1 } },
    { model: 'insect', options: { kind: 'grasshopper', voices: 4, gain: 0.06 }, when: { sun: [4, 90], season: [0.36, 0.8] } },
    { model: 'hedge', options: { density: 200, tone: 1.1, woody: 0.45, gain: 0.06 } },
  ],
  cast: [
    { voice: 'yellowhammer', every: [26, 65], height: 2.5, when: { season: [0.28, 0.72], sun: [2, 90], shy: 0.6 } },
    { voice: 'whitethroat', every: [30, 80], height: 2, when: { season: [0.32, 0.68], sun: [0, 90], shy: 0.55 } },
    { voice: 'chaffinch', every: [30, 78], height: 6, when: { sun: [-2, 60], wakes: 10, shy: 0.6 } },
    { voice: 'robin', every: [30, 80], height: 2, when: { sun: [-9, 30], wakes: 45, shy: 0.6 } },
    { voice: 'greattit', every: [34, 90], height: 5, when: { sun: [-1, 60], shy: 0.6 } },
    { voice: 'nightingale', every: [40, 100], height: 2.5, when: { season: [0.3, 0.5], sun: [-90, -2], shy: 0.5 } },
    { voice: 'wings', every: [60, 160], height: 6 },
    { voice: 'timber', every: [40, 110], height: 7, level: 0.5, when: { wind: [0.35, 1] } },
    { voice: 'mast', every: [25, 70], height: 7, when: { season: [0.62, 0.85] } },
    afterRain('drip', 6),
    dusk([30, 80], 5),
  ],
  signals: [
    // The village bell, from the path: on the hour, and a long way off.
    { voice: 'bell-church', every: [0, 0], height: 20, floor: 0, clock: 'hour', level: 0.4 },
    thunder(),
  ],
  activity: 0.65,
  seed: 152,
};

export const FOREST_PATH_B_AMBIENCE: AmbienceSpec = {
  air: [
    { model: 'air', id: 'air', options: { gain: 0.1, tone: 2200, shelter: 0.7, aperture: 0.12, roar: 0.6, rush: 0.9, hiss: 0.45 }, follow: [{ by: 'wind', span: [0.5, 1.1] }] },
    { model: 'foliage', options: { density: 260, tone: 0.65, gain: 0.075, articulation: 0.16, restlessness: 0.14 }, follow: [{ by: 'wind', span: [0.3, 1] }] },
  ],
  chorus: [
    { model: 'foliage', options: { density: 180, tone: 0.9, gain: 0.12, articulation: 0.3 }, follow: [{ by: 'wind', span: [0.25, 1] }] },
    { model: 'water', options: { flow: 'cistern', gain: 0.12, tone: 0.8 } },
    { model: 'hedge', options: { density: 170, tone: 1.1, woody: 0.6, gain: 0.055 } },
    { model: 'friction', options: { force: 0.4, pitch: 110, decay: 0.9, bright: 0.3, roughness: 0.6, gain: 0.14, motion: 'weather' }, follow: [{ by: 'gust', span: [0, 1] }] },
  ],
  cast: [
    // The drip outlives the shower by a long way, and that is the whole point.
    { voice: 'drip', every: [2.6, 2.6], height: 2.5, when: { after: 'rain' } },
    { voice: 'drip', every: [3.7, 3.7], height: 3.2, level: 0.8, when: { after: 'rain' } },
    { voice: 'drip', every: [5.3, 5.3], height: 4, level: 0.7, when: { after: 'rain' } },
    { voice: 'wren-scold', every: [30, 90], height: 1.2, when: { sun: [-4, 40] } },
    { voice: 'robin', every: [34, 95], height: 2, when: { sun: [-9, 20], wakes: 45 } },
    { voice: 'blackbird', every: [60, 170], height: 6, when: { sun: [-8, 14], wakes: 50 } },
    { voice: 'grit', every: [40, 120], height: 0.1, level: 0.6 },
    { voice: 'timber', every: [30, 90], height: 7, level: 0.6, when: { wind: [0.3, 1] } },
    { voice: 'bough', every: [300, 900], height: 6, level: 0.8 },
    { voice: 'mast', every: [25, 70], height: 7, when: { season: [0.62, 0.85] } },
    { voice: 'pool', every: [20, 60], height: 0.5, level: 0.5 },
    { voice: 'wings', every: [70, 200], height: 5, level: 0.7 },
    dusk([20, 60], 4),
  ],
  signals: [thunder()],
  activity: 0.5,
  seed: 153,
};

export const RIVERSIDE_AMBIENCE: AmbienceSpec = {
  air: [
    { model: 'air', id: 'air', options: { gain: 0.12, tone: 3200, shelter: 0.3, aperture: 0.3, roar: 0.5, rush: 1.0, hiss: 0.85 }, follow: [{ by: 'wind', span: [0.4, 1.2] }] },
    { model: 'water', id: 'river', options: { flow: 'stream', gain: 0.2, tone: 1 } },
  ],
  chorus: [
    { model: 'water', options: { flow: 'brook', gain: 0.18, tone: 1.1 } },
    { model: 'water', options: { flow: 'fountain', gain: 0.1, tone: 0.9 } },
    // Reeds: dry, papery, and nothing else in the book sounds like them.
    { model: 'foliage', options: { density: 170, tone: 2.2, gain: 0.08, articulation: 0.45 }, follow: [{ by: 'wind', span: [0.15, 1] }] },
    { model: 'hedge', options: { density: 200, tone: 0.9, woody: 0.35, gain: 0.06 } },
    { model: 'insect', options: { kind: 'grasshopper', voices: 4, gain: 0.05 }, when: { sun: [4, 90], season: [0.36, 0.8] } },
    {
      model: 'flock',
      options: {
        shape: {
          pitch: 340,
          variance: 0.14,
          phrase: [{ from: 1, to: 0.86, length: [0.09, 0.16], gap: [0.14, 0.3], drive: 0.8 }],
          count: [2, 5],
          rasp: 0.55,
          formant: 620,
          q: 2.2,
        },
        voices: 6,
        density: 0.55,
        variety: 0.5,
        entrain: 0.65,
        distance: 2200,
        gain: 0.1,
      },
      when: { warmth: [12, 32], sun: [-90, 2], season: [0.26, 0.62] },
    },
  ],
  cast: [
    { voice: 'reedwarbler', every: [26, 70], height: 1.4, when: { season: [0.32, 0.68], sun: [-2, 90] } },
    { voice: 'wagtail', every: [35, 95], height: 0.6, when: { sun: [0, 90] } },
    { voice: 'swallow', every: [18, 48], height: 3, passes: { over: 40, seconds: [1.1, 2.2] }, when: { season: [0.35, 0.72], sun: [0, 90] } },
    { voice: 'rise', every: [25, 70], height: 0, when: { sun: [-6, 40], warmth: [8, 30] } },
    { voice: 'pool', every: [60, 180], height: 0, level: 0.5 },
    { voice: 'curlew', every: [50, 150], height: 3, when: { season: [0.78, 0.25], sun: [-8, 90] } },
    { voice: 'lapwing', every: [50, 140], height: 6, passes: { over: 40, seconds: [2, 4] }, when: { season: [0.2, 0.6], sun: [-6, 90] } },
    { voice: 'surge', every: [90, 300], height: 0, level: 0.5 },
    afterRain('drip', 5),
    dusk([12, 35], 3),
  ],
  signals: [
    // A swan going over: a slow periodic throb, and nothing else makes it.
    { voice: 'wings', every: [200, 640], height: 14, floor: 160, level: 1.2 },
    thunder(),
  ],
  activity: 0.7,
  seed: 154,
};

export const CAVE_AMBIENCE: AmbienceSpec = {
  air: [
    { model: 'cavern', id: 'room', options: { size: 42, hard: 0.78, drift: 0.55, floor: 0.6, gain: 0.2 } },
  ],
  chorus: [
    { model: 'water', options: { flow: 'stream', gain: 0.09, tone: 0.3 } },
    { model: 'water', options: { flow: 'cistern', gain: 0.11, tone: 0.6 } },
    // A fall somewhere deeper, heard through the rock.
    { model: 'water', options: { flow: 'fountain', gain: 0.06, tone: 0.3 } },
  ],
  cast: [
    // Coprime, as `drip.ts` asks for: several slow fields beat one fast one.
    { voice: 'drip', every: [4.1, 4.1], rhythm: 'periodic', height: 3 },
    { voice: 'drip', every: [6.7, 6.7], rhythm: 'periodic', height: 4, level: 0.8 },
    { voice: 'drip', every: [9.3, 9.3], rhythm: 'periodic', height: 5, level: 0.7 },
    { voice: 'pool', every: [20, 50], height: 1, level: 0.7 },
    { voice: 'grit', every: [40, 130], height: 3 },
    { voice: 'slab', every: [110, 340] },
    { voice: 'slip', every: [150, 500], height: 2, level: 0.5 },
    { voice: 'strain', every: [120, 400], height: 4, level: 0.6 },
    { voice: 'bats', every: [30, 90], height: 6 },
  ],
  signals: [
    { voice: 'rockfall', every: [400, 1200], floor: 300 },
    { voice: 'rumble', every: [300, 900], floor: 200, height: 8, level: 0.7 },
  ],
  activity: 0.25,
  seed: 155,
};

export const CAVE_2_AMBIENCE: AmbienceSpec = {
  air: [
    { model: 'cavern', id: 'room', options: { size: 62, hard: 0.62, drift: 0.4, floor: 0.45, gain: 0.16 } },
  ],
  chorus: [
    { model: 'cavern', options: { size: 96, hard: 0.5, draught: 0.25, drift: 0.3, floor: 0.3, gain: 0.09 } },
    { model: 'water', options: { flow: 'cistern', gain: 0.07, tone: 0.6 } },
    // The draught through the entrance, from wherever the entrance is.
    { model: 'air', options: { gain: 0.03, tone: 700, shelter: 0.95, aperture: 0.6, roar: 0.8, rush: 0.7, hiss: 0.15, width: 0.5 }, follow: [{ by: 'wind', span: [0.3, 1] }] },
  ],
  cast: [
    { voice: 'drip', every: [5.9, 5.9], rhythm: 'periodic', height: 4, level: 0.8 },
    { voice: 'drip', every: [8.3, 8.3], rhythm: 'periodic', height: 5, level: 0.6 },
    { voice: 'pool', every: [30, 80], height: 1, level: 0.6 },
    { voice: 'grit', every: [70, 210], height: 3, level: 0.6 },
    { voice: 'slab', every: [160, 480], level: 0.6 },
    { voice: 'slip', every: [200, 600], height: 2, level: 0.4 },
    { voice: 'strain', every: [180, 500], height: 4, level: 0.5 },
    { voice: 'bats', every: [40, 120], height: 5 },
  ],
  signals: [
    { voice: 'rumble', every: [400, 1200], floor: 240, height: 8, level: 0.6 },
    { voice: 'rockfall', every: [600, 1800], floor: 400, level: 0.5 },
  ],
  activity: 0.3,
  seed: 160,
};

export const CAVE_DARK_AMBIENCE: AmbienceSpec = {
  air: [
    { model: 'cavern', id: 'room', options: { size: 28, hard: 0.88, drift: 0.75, floor: 0.85, gain: 0.24 } },
  ],
  chorus: [
    { model: 'water', options: { flow: 'stream', gain: 0.07, tone: 0.22 } },
    { model: 'water', options: { flow: 'cistern', gain: 0.06, tone: 0.4 } },
    // Rock under its own weight: the one sound that says how much is above you.
    { model: 'friction', options: { force: 0.8, pitch: 38, decay: 3.2, bright: 0.1, roughness: 0.35, gain: 0.2, motion: 'weather' }, follow: [{ by: 'gust', span: [0.2, 1] }] },
  ],
  cast: [
    // Two seeps off one fissure, not a conversation.
    { voice: 'drip', every: [7.1, 7.1], rhythm: 'periodic', height: 5, level: 0.8, answers: 1 },
    { voice: 'drip', every: [11.3, 11.3], rhythm: 'periodic', height: 6, level: 0.6 },
    { voice: 'pool', every: [40, 110], height: 1, level: 0.6 },
    { voice: 'grit', every: [70, 220], height: 4, level: 0.5 },
    { voice: 'slab', every: [150, 460], level: 0.7 },
    { voice: 'slip', every: [200, 600], height: 3, level: 0.5 },
    { voice: 'strain', every: [90, 300], height: 5, level: 0.8 },
    { voice: 'bats', every: [60, 180], height: 5, level: 0.7 },
  ],
  signals: [
    { voice: 'rockfall', every: [600, 1800], floor: 480, level: 0.9 },
    { voice: 'rumble', every: [240, 800], floor: 160, height: 10, level: 0.9 },
  ],
  activity: 0.18,
  seed: 156,
};

export const FACTORY_1_AMBIENCE: AmbienceSpec = {
  air: [
    { model: 'air', id: 'air', options: { gain: 0.05, tone: 1600, shelter: 0.85, aperture: 0.1, roar: 0.6, rush: 0.8, hiss: 0.25 } },
    { model: 'plant', id: 'plant', options: { rpm: 340, size: 74, metal: 0.55, clank: 0.35, wear: 0.5, load: 0.5, duty: 0.5, gain: 0.2 } },
  ],
  chorus: [
    { model: 'bustle', options: { rate: 5, distance: 900, roll: 0.7, metal: 0.8, busy: 0.7, gain: 0.11 } },
    // A second line, further off and slower, so the floor has two pulses that never agree.
    { model: 'plant', options: { rpm: 210, size: 96, metal: 0.5, clank: 0.25, wear: 0.6, load: 0.4, duty: 0.7, gain: 0.08 } },
  ],
  cast: [
    { voice: 'slab', every: [40, 130], level: 0.8 },
    { voice: 'girder', every: [40, 120], height: 6, level: 0.8 },
    { voice: 'sheet', every: [60, 180], height: 5, level: 0.7 },
    { voice: 'beam', every: [30, 90], height: 8 },
    { voice: 'blowoff', every: [60, 200], height: 7, level: 0.8 },
    { voice: 'rabble', every: [50, 150], height: 3, level: 0.6 },
    { voice: 'thump', every: [25, 70], level: 0.8 },
  ],
  signals: [
    { voice: 'horn', every: [0, 0], height: 14, floor: 0, clock: 'hour', level: 0.9, when: { sun: [-4, 90] } },
    { voice: 'rumble', every: [120, 400], floor: 60, height: 6, level: 0.8 },
  ],
  activity: 0.75,
  seed: 161,
};

export const FACTORY_2_AMBIENCE: AmbienceSpec = {
  air: [
    { model: 'air', id: 'air', options: { gain: 0.045, tone: 1400, shelter: 0.88, aperture: 0.08, roar: 0.65, rush: 0.8, hiss: 0.2 } },
    { model: 'plant', id: 'plant', options: { rpm: 260, size: 58, metal: 0.75, clank: 0.6, wear: 0.6, load: 0.75, duty: 0.6, gain: 0.26 } },
  ],
  chorus: [
    { model: 'bustle', options: { rate: 8, distance: 1200, roll: 0.9, metal: 0.9, busy: 0.9, gain: 0.15 } },
    { model: 'plant', options: { rpm: 150, size: 110, metal: 0.7, clank: 0.4, wear: 0.7, load: 0.6, duty: 0.8, gain: 0.09 } },
  ],
  cast: [
    { voice: 'slab', every: [22, 70], level: 0.9 },
    { voice: 'rockfall', every: [90, 300], level: 0.6 },
    { voice: 'girder', every: [25, 80], height: 6 },
    { voice: 'sheet', every: [40, 120], height: 5, level: 0.8 },
    { voice: 'beam', every: [20, 60], height: 8 },
    { voice: 'blowoff', every: [40, 140], height: 7 },
    { voice: 'rabble', every: [40, 120], height: 3, level: 0.7 },
    { voice: 'thump', every: [20, 60], level: 0.9 },
  ],
  signals: [
    { voice: 'horn', every: [0, 0], height: 14, floor: 0, clock: 'hour', level: 1, when: { sun: [-4, 90] } },
    { voice: 'rumble', every: [90, 300], floor: 50, height: 6, level: 0.9 },
  ],
  activity: 0.9,
  seed: 159,
};

export const SEWER_1_AMBIENCE: AmbienceSpec = {
  air: [
    { model: 'cavern', id: 'room', options: { size: 96, hard: 0.85, drift: 0.2, floor: 0.4, gain: 0.15 } },
    { model: 'water', id: 'flow', options: { flow: 'stream', gain: 0.14, tone: 0.5 } },
  ],
  chorus: [
    { model: 'water', options: { flow: 'fountain', gain: 0.12, tone: 0.6 } },
    { model: 'water', options: { flow: 'cistern', gain: 0.09, tone: 0.4 } },
    // Air drawn down the tunnel from the street.
    { model: 'air', options: { gain: 0.025, tone: 600, shelter: 0.95, aperture: 0.3, roar: 0.9, rush: 0.7, hiss: 0.1, width: 0.5 }, follow: [{ by: 'wind', span: [0.2, 0.8] }] },
  ],
  cast: [
    { voice: 'drip', every: [3.1, 3.1], height: 2.6 },
    { voice: 'drip', every: [5.7, 5.7], height: 3.4, level: 0.8 },
    { voice: 'drip', every: [1.5, 3], height: 3, level: 0.8, when: { rain: [0.2, 1] } },
    { voice: 'patter', every: [4, 10], height: 3, when: { rain: [0.2, 1] } },
    { voice: 'pool', every: [15, 45], height: 0.5 },
    { voice: 'grit', every: [50, 150], level: 0.6 },
    { voice: 'surge', every: [60, 200], height: 0, level: 0.6 },
    { voice: 'beam', every: [60, 180], height: 3, level: 0.5 },
    { voice: 'girder', every: [120, 400], height: 3, level: 0.4 },
    { voice: 'bats', every: [40, 120], height: 2 },
  ],
  signals: [
    // Something heavy going over the street above.
    { voice: 'rumble', every: [90, 300], floor: 40, height: 8, level: 0.6 },
  ],
  activity: 0.4,
  seed: 158,
};

export const SEWER_2_AMBIENCE: AmbienceSpec = {
  air: [
    { model: 'cavern', id: 'room', options: { size: 128, hard: 0.55, draught: 0.2, drift: 0.1, floor: 0.28, gain: 0.12 } },
    { model: 'water', id: 'flow', options: { flow: 'cistern', gain: 0.13, tone: 0.55 } },
  ],
  chorus: [
    { model: 'water', options: { flow: 'cistern', gain: 0.12, tone: 0.7 } },
    { model: 'water', options: { flow: 'stream', gain: 0.06, tone: 0.4 } },
    { model: 'air', options: { gain: 0.02, tone: 600, shelter: 0.95, aperture: 0.3, roar: 0.9, rush: 0.7, hiss: 0.1, width: 0.5 }, follow: [{ by: 'wind', span: [0.2, 0.8] }] },
  ],
  cast: [
    { voice: 'drip', every: [2.3, 2.3], height: 2.2 },
    { voice: 'drip', every: [4.7, 4.7], height: 2.8, level: 0.7 },
    { voice: 'drip', every: [1.4, 2.8], height: 3, level: 0.8, when: { rain: [0.2, 1] } },
    { voice: 'patter', every: [4, 10], height: 3, when: { rain: [0.2, 1] } },
    { voice: 'pool', every: [15, 45], height: 0.5 },
    { voice: 'grit', every: [60, 180], level: 0.5 },
    { voice: 'surge', every: [80, 240], height: 0, level: 0.5 },
    { voice: 'beam', every: [50, 160], height: 3, level: 0.5 },
    { voice: 'girder', every: [150, 450], height: 3, level: 0.3 },
    { voice: 'bats', every: [50, 140], height: 2 },
  ],
  signals: [
    { voice: 'rumble', every: [120, 360], floor: 50, height: 8, level: 0.5 },
  ],
  activity: 0.4,
  seed: 157,
};

export const SCRAPYARD_AMBIENCE: AmbienceSpec = {
  air: [
    { model: 'air', id: 'air', options: { gain: 0.2, tone: 4200, shelter: 0.05, aperture: 0.85, roar: 0.75, rush: 1.0, hiss: 1.0 }, follow: [{ by: 'wind', span: [0.35, 1.3] }] },
  ],
  chorus: [
    { model: 'plate', options: { pitch: 88, decay: 2.2, bright: 0.75, onset: 0.3, snap: 0.4, gain: 0.24 } },
    { model: 'plate', options: { pitch: 148, decay: 1.5, bright: 0.85, onset: 0.36, snap: 0.3, gain: 0.19 } },
    { model: 'wire', options: { diameter: 0.0028, strands: 4, gain: 0.09 } },
    // Steel giving up the day's heat: fast at first, slowing to nothing.
    { model: 'tick', options: { every: 0.5, pitch: 1300, decay: 0.12, swing: 0.15, cooling: 260, gain: 0.075 }, when: { sun: [-8, 9] } },
    { model: 'tick', options: { every: 0.8, pitch: 900, decay: 0.16, swing: 0.1, cooling: 320, gain: 0.06 }, when: { sun: [-8, 9] } },
    { model: 'foliage', options: { density: 130, tone: 1.9, gain: 0.05, articulation: 0.42 }, follow: [{ by: 'wind', span: [0.15, 1] }] },
    { model: 'insect', options: { kind: 'grasshopper', voices: 3, gain: 0.045 }, when: { sun: [4, 90], season: [0.36, 0.8] } },
  ],
  cast: [
    { voice: 'grit', every: [50, 150], level: 0.7 },
    { voice: 'beam', every: [20, 70], height: 3, when: { wind: [0.3, 1] } },
    { voice: 'girder', every: [60, 200], height: 3, level: 0.7 },
    { voice: 'sheet', every: [40, 140], height: 3, level: 0.8 },
    { voice: 'slip', every: [90, 300], height: 2, level: 0.6 },
    { voice: 'sparrow', every: [30, 80], height: 3, when: { sun: [0, 90] } },
    { voice: 'wagtail', every: [50, 150], height: 2, when: { sun: [2, 90] } },
    afterRain('eaves', 3),
    thaw(),
    dusk(),
  ],
  signals: [
    // A stack going over. Once in a very long while, and it is enormous.
    { voice: 'rockfall', every: [420, 1300], floor: 340, level: 1.1, hushes: true },
    thunder(),
  ],
  activity: 0.5,
  seed: 162,
};

export const SUBSTATION_1_AMBIENCE: AmbienceSpec = {
  air: [
    { model: 'air', id: 'air', options: { gain: 0.13, tone: 3800, shelter: 0.1, aperture: 0.8, roar: 0.6, rush: 1.0, hiss: 0.95 }, follow: [{ by: 'wind', span: [0.4, 1.25] }] },
    { model: 'plant', id: 'plant', options: { rpm: 190, size: 118, metal: 0.5, clank: 0.45, wear: 0.6, load: 0.4, duty: 0.6, gain: 0.16 } },
  ],
  chorus: [
    { model: 'wire', options: { diameter: 0.003, strands: 5, gain: 0.085 } },
    { model: 'plate', options: { pitch: 200, decay: 1.0, bright: 0.8, onset: 0.4, snap: 0.2, gain: 0.1 } },
    { model: 'foliage', options: { density: 130, tone: 1.9, gain: 0.05, articulation: 0.42 }, follow: [{ by: 'wind', span: [0.15, 1] }] },
    { model: 'insect', options: { kind: 'grasshopper', voices: 3, gain: 0.045 }, when: { sun: [4, 90], season: [0.36, 0.8] } },
  ],
  cast: [
    { voice: 'sparrow', every: [26, 75], height: 4, when: { sun: [0, 90] } },
    { voice: 'wagtail', every: [50, 150], height: 3, when: { sun: [2, 90] } },
    { voice: 'linnet', every: [50, 140], height: 2.5, when: { season: [0.3, 0.74], sun: [2, 90] } },
    { voice: 'beam', every: [30, 90], height: 4, when: { wind: [0.3, 1] } },
    { voice: 'girder', every: [80, 240], height: 4, level: 0.6 },
    { voice: 'sheet', every: [60, 180], height: 3, level: 0.7 },
    afterRain('eaves', 4),
    thaw(),
    dusk(),
  ],
  signals: [thunder()],
  activity: 0.45,
  seed: 163,
};

export const SUBSTATION_2_AMBIENCE: AmbienceSpec = {
  air: [
    { model: 'air', id: 'air', options: { gain: 0.17, tone: 4000, shelter: 0.08, aperture: 0.75, roar: 0.6, rush: 1.0, hiss: 1.0 }, follow: [{ by: 'wind', span: [0.35, 1.3] }] },
    { model: 'plant', id: 'plant', options: { rpm: 22, size: 142, metal: 0.75, clank: 0.7, wear: 0.9, load: 0.12, duty: 0.25, gain: 0.1 } },
  ],
  chorus: [
    { model: 'plate', options: { pitch: 165, decay: 1.2, bright: 0.85, onset: 0.34, snap: 0.35, gain: 0.17 } },
    { model: 'foliage', options: { density: 130, tone: 1.9, gain: 0.07, articulation: 0.42 }, follow: [{ by: 'wind', span: [0.15, 1] }] },
    { model: 'wire', options: { diameter: 0.0035, strands: 4, gain: 0.07 } },
    { model: 'tick', options: { every: 0.6, pitch: 1100, decay: 0.14, swing: 0.15, cooling: 280, gain: 0.06 }, when: { sun: [-8, 9] } },
    { model: 'insect', options: { kind: 'grasshopper', voices: 3, gain: 0.045 }, when: { sun: [4, 90], season: [0.36, 0.8] } },
  ],
  cast: [
    { voice: 'sparrow', every: [22, 65], height: 3, when: { sun: [0, 90] } },
    { voice: 'linnet', every: [40, 120], height: 2.5, when: { season: [0.3, 0.74], sun: [2, 90] } },
    { voice: 'wagtail', every: [50, 150], height: 3, when: { sun: [2, 90] } },
    { voice: 'wings', every: [60, 180], height: 4 },
    { voice: 'beam', every: [30, 90], height: 4, when: { wind: [0.3, 1] } },
    { voice: 'sheet', every: [50, 160], height: 3, level: 0.7 },
    { voice: 'girder', every: [100, 300], height: 4, level: 0.5 },
    afterRain('eaves', 4),
    thaw(),
    dusk(),
  ],
  signals: [thunder()],
  activity: 0.4,
  seed: 164,
};

export const BEACH_AMBIENCE: AmbienceSpec = {
  air: [
    { model: 'air', id: 'air', options: { gain: 0.24, tone: 4400, shelter: 0.0, aperture: 0.4, roar: 0.9, rush: 1.0, hiss: 1.1 }, follow: [{ by: 'wind', span: [0.4, 1.35] }] },
    { model: 'surf', id: 'surf', options: { gain: 0.26, shingle: 0.85, period: [8, 14] } },
  ],
  chorus: [
    { model: 'water', options: { flow: 'brook', gain: 0.14, tone: 0.6 } },
    { model: 'foliage', options: { density: 150, tone: 2, gain: 0.065, articulation: 0.44 }, follow: [{ by: 'wind', span: [0.15, 1] }] },
    { model: 'insect', options: { kind: 'grasshopper', voices: 3, gain: 0.04 }, when: { sun: [4, 90], season: [0.36, 0.8] } },
  ],
  cast: [
    { voice: 'grit', every: [26, 75], height: 0.1, level: 0.8 },
    { voice: 'sand', every: [6, 18], height: 0.2, when: { wind: [0.4, 1] } },
    // A big one going over the rocks.
    { voice: 'surge', every: [40, 120], height: 0, level: 0.8 },
    { voice: 'pool', every: [30, 90], height: 0, level: 0.4 },
    { voice: 'stonechat', every: [40, 120], height: 1.4, when: { sun: [0, 90] } },
    { voice: 'wagtail', every: [40, 120], height: 0.6, when: { sun: [0, 90] } },
    { voice: 'linnet', every: [40, 120], height: 1.2, when: { season: [0.3, 0.74], sun: [2, 90] } },
    { voice: 'swallow', every: [20, 50], height: 3, passes: { over: 40, seconds: [1.1, 2.2] }, when: { season: [0.35, 0.72], sun: [0, 90] } },
    { voice: 'wings', every: [60, 180], height: 4 },
    afterRain('eaves', 6, 0.7),
    dusk([30, 80], 4),
  ],
  signals: [thunder()],
  activity: 0.6,
  seed: 169,
};

export const BEACH_PATH_AMBIENCE: AmbienceSpec = {
  air: [
    { model: 'air', id: 'air', options: { gain: 0.19, tone: 3900, shelter: 0.15, aperture: 0.45, roar: 0.8, rush: 1.0, hiss: 1.0 }, follow: [{ by: 'wind', span: [0.4, 1.3] }] },
    { model: 'surf', id: 'surf', options: { gain: 0.13, shingle: 0.7, period: [9, 15], tone: 0.6 } },
  ],
  chorus: [
    { model: 'foliage', options: { density: 170, tone: 1.6, gain: 0.1, articulation: 0.38 }, follow: [{ by: 'wind', span: [0.15, 1] }] },
    { model: 'foliage', options: { density: 200, tone: 1.3, gain: 0.08, articulation: 0.3 }, follow: [{ by: 'wind', span: [0.15, 1] }] },
    { model: 'wire', options: { diameter: 0.004, strands: 3, gain: 0.075 } },
    { model: 'insect', options: { kind: 'grasshopper', voices: 4, gain: 0.055 }, when: { sun: [4, 90], season: [0.36, 0.8] } },
    { model: 'hedge', options: { density: 150, tone: 1.2, woody: 0.7, gain: 0.05 } },
  ],
  cast: [
    { voice: 'linnet', every: [34, 95], height: 1.2, when: { season: [0.3, 0.74], sun: [2, 90] } },
    { voice: 'yellowhammer', every: [40, 100], height: 1.5, when: { season: [0.28, 0.72], sun: [2, 90], shy: 0.6 } },
    { voice: 'whitethroat', every: [40, 110], height: 1.5, when: { season: [0.32, 0.68], sun: [0, 90], shy: 0.55 } },
    { voice: 'wagtail', every: [50, 150], height: 0.6, when: { sun: [0, 90] } },
    { voice: 'swallow', every: [24, 60], height: 3, passes: { over: 40, seconds: [1.1, 2.2] }, when: { season: [0.35, 0.72], sun: [0, 90] } },
    { voice: 'sand', every: [8, 24], height: 0.2, level: 0.7, when: { wind: [0.45, 1] } },
    { voice: 'surge', every: [60, 180], height: 0, level: 0.5 },
    { voice: 'wings', every: [60, 180], height: 3 },
    afterRain('drip', 3, 0.7),
    dusk([30, 80], 4),
  ],
  signals: [
    // Gorse pods going off in the heat.
    { voice: 'crack', every: [14, 40], height: 1, floor: 6, level: 0.7, when: { warmth: [20, 40], sun: [15, 90], rain: [0, 0.05] } },
    // The stonechat: two stones tapped together, and instantly identifiable.
    { voice: 'stonechat', every: [40, 120], height: 1.4, floor: 25, when: { sun: [0, 90] } },
    thunder(),
  ],
  activity: 0.6,
  seed: 170,
};

/**
 * The open grassland in summer: nothing between you and the horizon but grass,
 * and everything in it is heard and never seen.
 */
export const PLAINS_1_AMBIENCE: AmbienceSpec = {
  air: [
    { model: 'air', id: 'air', options: { gain: 0.13, tone: 4200, shelter: 0.05, aperture: 0.1, roar: 0.6, rush: 1.0, hiss: 1.0 }, follow: [{ by: 'wind', span: [0.4, 1.3] }] },
    // The grass: the whole plain, and it is the keynote under the air.
    { model: 'foliage', options: { density: 320, tone: 2.1, gain: 0.1, articulation: 0.45, restlessness: 0.1 }, follow: [{ by: 'wind', span: [0.1, 1] }] },
  ],
  chorus: [
    { model: 'foliage', options: { density: 260, tone: 1.8, gain: 0.12, articulation: 0.5 }, follow: [{ by: 'wind', span: [0.1, 1] }] },
    { model: 'insect', options: { kind: 'grasshopper', voices: 6, gain: 0.07 }, when: { sun: [4, 90], season: [0.36, 0.8] } },
    { model: 'insect', options: { kind: 'cricket', voices: 5, gain: 0.08 }, follow: [{ by: 'night', span: [0.3, 1] }], when: { season: [0.32, 0.82] } },
  ],
  cast: [
    { voice: 'quail', every: [24, 60], height: 0.3, when: { season: [0.38, 0.7], sun: [-30, 90] } },
    { voice: 'lapwing', every: [30, 80], height: 6, passes: { over: 50, seconds: [2, 4] }, when: { season: [0.2, 0.6], sun: [-6, 90] } },
    { voice: 'curlew', every: [40, 110], height: 3, when: { season: [0.22, 0.62], sun: [-10, 90] } },
    { voice: 'linnet', every: [40, 110], height: 2, when: { season: [0.3, 0.74], sun: [2, 90] } },
    { voice: 'swallow', every: [18, 44], height: 2, passes: { over: 50, seconds: [1.2, 2.4] }, when: { season: [0.35, 0.72], sun: [0, 90] } },
    { voice: 'swift', every: [20, 50], height: 18, passes: { over: 70, seconds: [1.8, 3.2] }, when: { sun: [2, 40], season: [0.38, 0.68] } },
    // A covey going up out of the grass, somewhere.
    { voice: 'wings', every: [60, 180], height: 2, level: 0.8 },
    { voice: 'sand', every: [10, 30], height: 0.3, level: 0.5, when: { wind: [0.5, 1] } },
    dusk([20, 60], 4),
  ],
  signals: [thunder()],
  activity: 0.65,
  trim: 0.7,
  seed: 171,
};

/**
 * The moor: heather and wind, colder and emptier than the grassland, and the
 * birds that live on it are the loneliest sounds in the book.
 */
export const PLAINS_2_AMBIENCE: AmbienceSpec = {
  air: [
    { model: 'air', id: 'air', options: { gain: 0.15, tone: 3800, shelter: 0, aperture: 0.15, roar: 0.8, rush: 1.0, hiss: 0.95 }, follow: [{ by: 'wind', span: [0.4, 1.35] }] },
    // Heather: lower and woodier than grass, and it never quite stops.
    { model: 'foliage', options: { density: 220, tone: 1.4, gain: 0.07, articulation: 0.3, restlessness: 0.2 }, follow: [{ by: 'wind', span: [0.15, 1] }] },
  ],
  chorus: [
    { model: 'hedge', options: { density: 180, tone: 1.25, woody: 0.7, gain: 0.06 } },
    { model: 'foliage', options: { density: 200, tone: 1.9, gain: 0.08, articulation: 0.45 }, follow: [{ by: 'wind', span: [0.1, 1] }] },
    { model: 'insect', options: { kind: 'grasshopper', voices: 3, gain: 0.045 }, when: { sun: [6, 90], season: [0.4, 0.78], warmth: [16, 40] } },
  ],
  cast: [
    { voice: 'curlew', every: [30, 90], height: 3, when: { season: [0.22, 0.62], sun: [-10, 90] } },
    { voice: 'plover', every: [40, 120], height: 2, when: { season: [0.25, 0.6], sun: [-8, 90] } },
    { voice: 'snipe', every: [40, 120], height: 12, when: { season: [0.25, 0.55], sun: [-10, 5] } },
    { voice: 'lapwing', every: [50, 140], height: 6, passes: { over: 50, seconds: [2, 4] }, when: { season: [0.2, 0.55], sun: [-6, 90] } },
    { voice: 'stonechat', every: [40, 120], height: 1.2, when: { sun: [0, 90], season: [0.25, 0.75] } },
    { voice: 'linnet', every: [50, 140], height: 1.5, when: { season: [0.3, 0.74], sun: [2, 90] } },
    { voice: 'wings', every: [70, 200], height: 2, level: 0.8 },
    { voice: 'sand', every: [8, 24], height: 0.3, level: 0.6, when: { wind: [0.45, 1] } },
    dusk([30, 90], 4),
  ],
  signals: [thunder()],
  activity: 0.5,
  trim: 0.85,
  seed: 172,
};
