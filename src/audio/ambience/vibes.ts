import type { AmbienceSpec } from './spec';

/**
 * The ambience book — one spec per kind of place, keyed by the same names the
 * score uses. A zone names a vibe and gets both halves; see `audio/vibes.ts`.
 *
 * Four strata per entry, and they are Schafer's: the `air` is the keynote and
 * never stops, the `chorus` is the middle distance, the `cast` is who speaks,
 * and a `signal` is meant to be listened to. A signal marked `clock: 'hour'` is
 * a soundmark — the one thing here allowed to be predictable.
 *
 * No two vibes share a soundmark. That is what makes it one.
 */

export const VILLAGE_1_AMBIENCE: AmbienceSpec = {
  air: [
    { model: 'wind', id: 'air', options: { gain: 0.15, tone: 3000 }, follow: [{ by: 'wind', span: [0.5, 1.2] }] },
    // The settlement itself, too far off to make out a word of it.
    {
      model: 'crowd',
      options: { gain: 0.05, voices: 4, density: 0.25, distance: 700 },
      follow: [{ by: 'night', span: [1, 0.15] }],
      when: { sun: [-6, 90] },
    },
  ],
  chorus: [
    { model: 'foliage', tier: 'mid', options: { density: 220, tone: 0.9, gain: 0.3, articulation: 0.2 }, follow: [{ by: 'wind', span: [0.25, 1] }] },
    { model: 'foliage', tier: 'near', options: { density: 150, tone: 1.4, gain: 0.2, articulation: 0.32 }, follow: [{ by: 'wind', span: [0.2, 1] }] },
    // The chimney, when the wind gets over it.
    { model: 'waveguide', tier: 'near', height: 6, options: { pitch: 88, decay: 2.2, closed: true, bright: 0.25, gain: 0.18 }, follow: [{ by: 'gust', span: [0, 1] }] },
  ],
  cast: [
    { voice: 'blackbird', every: [22, 50], tier: 'mid', height: 7, when: { sun: [-7, 12], wakes: 50, shy: 0.65 } },
    { voice: 'robin', every: [26, 60], tier: 'near', height: 3, when: { sun: [-9, 20], wakes: 45, shy: 0.6 } },
    { voice: 'sparrow', every: [14, 34], tier: 'near', height: 3, when: { sun: [-1, 90], shy: 0.7 } },
    { voice: 'swift', every: [12, 30], tier: 'mid', height: 16, passes: { over: 60, seconds: [1.6, 3] }, when: { sun: [2, 40], season: [0.38, 0.68] } },
    { voice: 'rook', every: [30, 80], tier: 'far', height: 22, passes: { over: 120, seconds: [4, 8] }, when: { sun: [-6, 8], season: [0.72, 0.34] } },
    { voice: 'dog', every: [40, 110], tier: 'far', answers: 0.6 },
    { voice: 'cow', every: [70, 180], tier: 'far', when: { sun: [-8, 30] } },
    { voice: 'hen', every: [30, 90], tier: 'mid', when: { sun: [0, 90] } },
    { voice: 'wood', every: [45, 120], tier: 'mid', when: { sun: [-4, 90] } },
    { voice: 'latch', every: [70, 200], tier: 'mid', when: { sun: [-6, 90] } },
    { voice: 'whistle', every: [90, 260], tier: 'mid', when: { sun: [-4, 25] } },
    { voice: 'owl', every: [70, 200], tier: 'far', height: 10, answers: 0.7, when: { sun: [-90, -5] } },
  ],
  signals: [
    { voice: 'bell-church', every: [0, 0], tier: 'far', height: 18, floor: 0, clock: 'hour', level: 0.9 },
  ],
  activity: 0.55,
  seed: 148,
};

export const VILLAGE_2_AMBIENCE: AmbienceSpec = {
  air: [
    { model: 'wind', id: 'air', options: { gain: 0.11, tone: 2800 }, follow: [{ by: 'wind', span: [0.5, 1.1] }] },
    // The square, and it is the keynote here rather than a source in it.
    {
      model: 'crowd',
      options: { gain: 0.16, voices: 6, density: 0.55, pitch: 150, variety: 0.8, distance: 1300 },
      follow: [{ by: 'night', span: [1, 0.05] }, { by: 'rain', span: [1, 0.35] }],
      when: { sun: [-4, 90] },
    },
  ],
  chorus: [
    // Canvas over the stalls: it only exists when the wind gets under it.
    { model: 'friction', tier: 'near', height: 3, options: { force: 0.3, pitch: 190, decay: 0.3, bright: 0.8, roughness: 0.8, gain: 0.16, motion: 'weather' }, follow: [{ by: 'gust', span: [0, 1] }] },
    { model: 'foliage', tier: 'mid', options: { density: 120, tone: 1.2, gain: 0.14, articulation: 0.3 }, follow: [{ by: 'wind', span: [0.2, 1] }] },
  ],
  cast: [
    { voice: 'shout', every: [18, 45], tier: 'mid', when: { sun: [-2, 90] } },
    { voice: 'laugh', every: [25, 70], tier: 'near', when: { sun: [-2, 90] } },
    { voice: 'chatter', every: [12, 30], tier: 'near', when: { sun: [-2, 90] } },
    { voice: 'pot', every: [16, 40], tier: 'near', when: { sun: [-2, 90] } },
    { voice: 'wood', every: [20, 50], tier: 'mid', when: { sun: [-2, 90] } },
    { voice: 'coins', every: [30, 80], tier: 'near', when: { sun: [-2, 90] } },
    { voice: 'whetstone', every: [40, 110], tier: 'mid', when: { sun: [-2, 90] } },
    { voice: 'hen', every: [22, 60], tier: 'near' },
    { voice: 'woodpigeon', every: [30, 75], tier: 'near', height: 6, when: { sun: [-2, 90] } },
    { voice: 'wings', every: [40, 120], tier: 'near', height: 7 },
    { voice: 'sparrow', every: [16, 40], tier: 'near', height: 4, when: { sun: [-2, 90] } },
    { voice: 'dog', every: [50, 140], tier: 'mid' },
  ],
  signals: [
    { voice: 'bell-hand', every: [220, 600], tier: 'mid', floor: 180, when: { sun: [2, 90] } },
    { voice: 'bell-church', every: [0, 0], tier: 'far', height: 18, floor: 0, clock: 'hour', level: 0.7 },
  ],
  activity: 0.85,
  seed: 166,
};

export const VILLAGE_INTERIOR_1_AMBIENCE: AmbienceSpec = {
  air: [
    // The room, and nothing else. An interior with a generic hum in it sounds
    // like a menu; this is the wall taking the outside down to a murmur.
    { model: 'wind', id: 'air', options: { gain: 0.035, tone: 700, whistle: 0 }, follow: [{ by: 'wind', span: [0.4, 1.3] }] },
    { model: 'rain', id: 'rain', options: { gain: 0.06, intensity: 0, surface: 'stone', articulation: 0.5 } },
  ],
  chorus: [
    { model: 'fire', tier: 'near', height: 0.4, options: { gain: 0.34, intensity: 0.55, tone: 0.9, crackle: 0.6, draught: 0.15 } },
    // Down the chimney, and only when it gusts.
    { model: 'waveguide', tier: 'near', height: 4, options: { pitch: 74, decay: 3, closed: true, bright: 0.2, gain: 0.2 }, follow: [{ by: 'gust', span: [0, 1] }] },
  ],
  cast: [
    { voice: 'embers', every: [18, 55], tier: 'near', height: 0.3 },
    { voice: 'tick', every: [1.05, 1.05], tier: 'near', height: 1.7, level: 0.7 },
    { voice: 'fly', every: [30, 90], tier: 'near', height: 1.5, when: { season: [0.35, 0.72], warmth: [14, 40], sun: [0, 90] } },
    { voice: 'mouse', every: [60, 180], tier: 'near', height: 0.1, when: { sun: [-90, -3] } },
    { voice: 'hum', every: [90, 260], tier: 'near', level: 0.7 },
    { voice: 'wood', every: [70, 200], tier: 'near', level: 0.6 },
    { voice: 'pot', every: [80, 220], tier: 'near', level: 0.5 },
    { voice: 'latch', every: [120, 340], tier: 'near', level: 0.5 },
  ],
  signals: [{ voice: 'bell-shop', every: [0, 0], tier: 'near', floor: 0, clock: 'hour', level: 0.45 }],
  activity: 0.3,
  seed: 167,
};

export const VILLAGE_INTERIOR_2_AMBIENCE: AmbienceSpec = {
  air: [
    { model: 'wind', id: 'air', options: { gain: 0.03, tone: 900, whistle: 0 }, follow: [{ by: 'wind', span: [0.4, 1.2] }] },
  ],
  chorus: [
    { model: 'fire', tier: 'near', height: 0.5, options: { gain: 0.2, intensity: 0.3, tone: 1.1, crackle: 0.4, draught: 0.08 } },
  ],
  cast: [
    // Three clocks at coprime periods, so they never fall into step. The shop's
    // whole character, and it costs three entries.
    { voice: 'tick', every: [1.03, 1.03], tier: 'near', height: 1.8, level: 0.65 },
    { voice: 'tick', every: [1.19, 1.19], tier: 'near', height: 1.4, level: 0.5 },
    { voice: 'tick', every: [1.31, 1.31], tier: 'near', height: 2.1, level: 0.4 },
    { voice: 'paper', every: [40, 120], tier: 'near' },
    { voice: 'coins', every: [55, 160], tier: 'near' },
    { voice: 'pot', every: [70, 200], tier: 'near', level: 0.6 },
    { voice: 'cough', every: [110, 300], tier: 'near', level: 0.5 },
    { voice: 'fly', every: [40, 120], tier: 'near', height: 1.6, when: { season: [0.35, 0.72], warmth: [14, 40] } },
    { voice: 'mouse', every: [80, 240], tier: 'near', height: 0.1, when: { sun: [-90, -3] } },
  ],
  signals: [
    // The bell over the door — deliberately not the `chimes` the score gives
    // this vibe for its melody.
    { voice: 'bell-shop', every: [150, 420], tier: 'near', floor: 90 },
  ],
  activity: 0.3,
  seed: 168,
};

export const FARM_AMBIENCE: AmbienceSpec = {
  air: [
    { model: 'wind', id: 'air', options: { gain: 0.19, tone: 3600 }, follow: [{ by: 'wind', span: [0.4, 1.3] }] },
    // The crop. Dry, high and papery, and it is the field's own voice.
    {
      model: 'foliage',
      options: { density: 300, tone: 1.7, gain: 0.11, articulation: 0.4, restlessness: 0.1 },
      follow: [{ by: 'wind', span: [0.1, 1] }],
      when: { season: [0.3, 0.8] },
    },
  ],
  chorus: [
    { model: 'foliage', tier: 'mid', options: { density: 240, tone: 0.85, gain: 0.26, articulation: 0.22 }, follow: [{ by: 'wind', span: [0.25, 1] }] },
    // The windpump: it has no engine, only the weather.
    { model: 'machine', tier: 'mid', height: 5, options: { rpm: 34, fundamental: 46, gain: 0.2, wear: 0.6, clank: 0.5 }, follow: [{ by: 'wind', span: [0.05, 1] }] },
    { model: 'friction', tier: 'mid', height: 2, options: { force: 0.35, pitch: 240, decay: 0.5, bright: 0.5, roughness: 0.7, gain: 0.14, motion: 'weather' }, follow: [{ by: 'gust', span: [0, 1] }] },
    // The hive, and only in the heat.
    { model: 'crowd', tier: 'near', height: 1.2, options: { gain: 0.05, voices: 5, density: 0.95, pitch: 220, variety: 0.35, distance: 900 }, when: { season: [0.32, 0.74], warmth: [16, 40], sun: [4, 90] } },
  ],
  cast: [
    { voice: 'cow', every: [30, 80], tier: 'mid', answers: 0.4 },
    { voice: 'sheep', every: [24, 70], tier: 'mid', answers: 0.5 },
    { voice: 'pig', every: [40, 110], tier: 'mid' },
    { voice: 'hen', every: [16, 44], tier: 'near' },
    { voice: 'cockerel', every: [60, 180], tier: 'mid', when: { sun: [-8, 90], wakes: 20 } },
    { voice: 'horse', every: [90, 240], tier: 'mid' },
    { voice: 'dog', every: [35, 100], tier: 'mid', answers: 0.5, when: { sun: [-3, 90] } },
    { voice: 'swallow', every: [16, 40], tier: 'near', height: 6, passes: { over: 40, seconds: [1.2, 2.4] }, when: { season: [0.35, 0.72], sun: [0, 90] } },
    { voice: 'skylark', every: [45, 130], tier: 'far', height: 40, when: { season: [0.3, 0.72], sun: [6, 90], shy: 0.6 } },
    { voice: 'whetstone', every: [70, 200], tier: 'mid', when: { sun: [2, 90] } },
    { voice: 'call', every: [60, 170], tier: 'mid', when: { sun: [0, 90] } },
    { voice: 'whistle', every: [110, 300], tier: 'mid', level: 0.7, when: { sun: [0, 90] } },
    { voice: 'wood', every: [40, 110], tier: 'mid', when: { sun: [-2, 90] } },
    { voice: 'owl', every: [90, 240], tier: 'far', height: 9, answers: 0.6, when: { sun: [-90, -5] } },
    { voice: 'cricket', every: [3, 9], tier: 'near', height: 0.15, when: { warmth: [13, 34], sun: [-90, 6], season: [0.35, 0.8] } },
  ],
  signals: [
    // Geese. The best "somebody is coming" sound there is, and it stops the
    // yard dead when it goes up.
    { voice: 'goose', every: [280, 900], tier: 'mid', floor: 220, hushes: true, level: 1.1 },
  ],
  activity: 0.7,
  seed: 149,
};

export const FOREST_A_AMBIENCE: AmbienceSpec = {
  air: [
    { model: 'wind', id: 'air', options: { gain: 0.12, tone: 3100 }, follow: [{ by: 'wind', span: [0.35, 1.2] }] },
    { model: 'foliage', options: { density: 280, tone: 0.8, gain: 0.16, articulation: 0.2, restlessness: 0.12 }, follow: [{ by: 'wind', span: [0.2, 1] }] },
  ],
  chorus: [
    // Three canopies at spread positions, so one gust crosses the wood in the
    // order you would watch it — the gust field already lags with distance.
    { model: 'foliage', tier: 'mid', height: 9, options: { density: 260, tone: 0.78, gain: 0.28, articulation: 0.2 }, follow: [{ by: 'wind', span: [0.2, 1] }] },
    { model: 'foliage', tier: 'mid', height: 11, options: { density: 240, tone: 0.86, gain: 0.26, articulation: 0.22 }, follow: [{ by: 'wind', span: [0.2, 1] }] },
    { model: 'foliage', tier: 'far', height: 13, options: { density: 200, tone: 0.7, gain: 0.24, articulation: 0.16 }, follow: [{ by: 'wind', span: [0.15, 1] }] },
  ],
  cast: [
    { voice: 'songthrush', every: [20, 46], tier: 'mid', height: 9, when: { sun: [-9, 24], wakes: 47, shy: 0.6 } },
    { voice: 'blackbird', every: [24, 55], tier: 'mid', height: 8, when: { sun: [-9, 26], wakes: 50, shy: 0.6 } },
    { voice: 'robin', every: [22, 52], tier: 'near', height: 3, when: { sun: [-10, 30], wakes: 45, shy: 0.6 } },
    { voice: 'wren', every: [30, 80], tier: 'near', height: 1.5, when: { sun: [-4, 40], wakes: 20, shy: 0.55 } },
    { voice: 'chaffinch', every: [26, 65], tier: 'mid', height: 7, when: { sun: [-2, 50], wakes: 10, shy: 0.6 } },
    { voice: 'greattit', every: [28, 70], tier: 'near', height: 6, when: { sun: [-1, 60], wakes: 8, shy: 0.6 } },
    { voice: 'blackcap', every: [34, 90], tier: 'mid', height: 7, when: { season: [0.3, 0.7], sun: [-4, 60], shy: 0.55 } },
    { voice: 'woodpigeon', every: [40, 100], tier: 'mid', height: 8, when: { sun: [-2, 90] } },
    { voice: 'cuckoo', every: [60, 170], tier: 'far', height: 12, when: { season: [0.34, 0.56], sun: [0, 90] } },
    { voice: 'woodpecker', every: [70, 200], tier: 'mid', height: 8, when: { season: [0.2, 0.55], sun: [0, 90] } },
    { voice: 'wings', every: [50, 150], tier: 'near', height: 7 },
    { voice: 'bee', every: [20, 60], tier: 'near', height: 1.2, when: { warmth: [15, 40], sun: [6, 90], season: [0.3, 0.76] } },
    { voice: 'midge', every: [12, 34], tier: 'near', height: 1.7, when: { warmth: [13, 40], sun: [-6, 8], season: [0.35, 0.8] } },
    { voice: 'deer', every: [140, 400], tier: 'far', when: { sun: [-90, 2] } },
  ],
  signals: [
    // The jay silences the wood, which is exactly what a jay is for.
    { voice: 'jay', every: [150, 480], tier: 'mid', height: 9, floor: 100, hushes: true },
  ],
  activity: 0.8,
  seed: 150,
};

export const FOREST_B_AMBIENCE: AmbienceSpec = {
  air: [
    { model: 'wind', id: 'air', options: { gain: 0.14, tone: 2400 }, follow: [{ by: 'wind', span: [0.4, 1.2] }] },
    // Conifer: steadier and higher than broadleaf, and it never quite stops.
    { model: 'foliage', options: { density: 340, tone: 1.35, gain: 0.15, articulation: 0.12, restlessness: 0.32 }, follow: [{ by: 'wind', span: [0.35, 1] }] },
  ],
  chorus: [
    { model: 'foliage', tier: 'mid', height: 12, options: { density: 300, tone: 1.25, gain: 0.24, articulation: 0.14, restlessness: 0.25 }, follow: [{ by: 'wind', span: [0.3, 1] }] },
    // Trunks leaning on each other. Already in the kit, and one of the best
    // things in it.
    { model: 'friction', tier: 'mid', height: 5, options: { force: 0.55, pitch: 96, decay: 1.1, bright: 0.25, roughness: 0.55, gain: 0.24, motion: 'weather' }, follow: [{ by: 'gust', span: [0, 1] }] },
    { model: 'water', tier: 'far', options: { flow: 'stream', gain: 0.1, tone: 0.45 } },
  ],
  cast: [
    { voice: 'woodpigeon', every: [35, 90], tier: 'mid', height: 10, when: { sun: [-2, 90] } },
    { voice: 'raven', every: [60, 170], tier: 'far', height: 14, answers: 0.4, when: { sun: [-2, 90] } },
    { voice: 'wren', every: [45, 130], tier: 'near', height: 1.2, when: { sun: [-2, 40], shy: 0.5 } },
    { voice: 'nightjar', every: [40, 120], tier: 'mid', height: 2, when: { season: [0.36, 0.66], sun: [-8, 0] } },
    { voice: 'woodcock', every: [90, 260], tier: 'far', height: 16, when: { season: [0.28, 0.6], sun: [-7, 2] } },
    { voice: 'fox', every: [120, 380], tier: 'far', when: { sun: [-90, -6], season: [0.78, 0.28] } },
    { voice: 'stag', every: [160, 460], tier: 'far', when: { season: [0.66, 0.84], sun: [-90, 4] } },
    { voice: 'bats', every: [14, 40], tier: 'near', height: 5, when: { sun: [-9, -1], warmth: [8, 40] } },
    { voice: 'midge', every: [16, 44], tier: 'near', height: 1.7, when: { warmth: [12, 40], sun: [-7, 6] } },
    { voice: 'crack', every: [70, 220], tier: 'near', height: 1, level: 0.8 },
    { voice: 'slab', every: [220, 700], tier: 'far', level: 0.6 },
  ],
  signals: [
    // The hoot, and a second bird answering with something else entirely.
    { voice: 'owl', every: [90, 260], tier: 'mid', height: 11, floor: 60, answers: 0.85, when: { sun: [-90, -4] } },
  ],
  activity: 0.45,
  seed: 151,
};

export const FOREST_PATH_A_AMBIENCE: AmbienceSpec = {
  air: [
    { model: 'wind', id: 'air', options: { gain: 0.15, tone: 3300 }, follow: [{ by: 'wind', span: [0.4, 1.25] }] },
    { model: 'foliage', options: { density: 200, tone: 1.1, gain: 0.12, articulation: 0.24 }, follow: [{ by: 'wind', span: [0.2, 1] }] },
  ],
  chorus: [
    { model: 'foliage', tier: 'near', height: 1.6, options: { density: 150, tone: 1.5, gain: 0.22, articulation: 0.34 }, follow: [{ by: 'wind', span: [0.2, 1] }] },
    { model: 'foliage', tier: 'far', height: 8, options: { density: 220, tone: 0.8, gain: 0.2, articulation: 0.16 }, follow: [{ by: 'wind', span: [0.15, 1] }] },
    { model: 'water', tier: 'mid', options: { flow: 'brook', gain: 0.12, tone: 1 } },
  ],
  cast: [
    { voice: 'yellowhammer', every: [26, 65], tier: 'near', height: 2.5, when: { season: [0.28, 0.72], sun: [2, 90], shy: 0.6 } },
    { voice: 'whitethroat', every: [30, 80], tier: 'near', height: 2, when: { season: [0.32, 0.68], sun: [0, 90], shy: 0.55 } },
    { voice: 'chaffinch', every: [30, 78], tier: 'mid', height: 6, when: { sun: [-2, 60], wakes: 10, shy: 0.6 } },
    { voice: 'robin', every: [30, 80], tier: 'near', height: 2, when: { sun: [-9, 30], wakes: 45, shy: 0.6 } },
    { voice: 'greattit', every: [34, 90], tier: 'near', height: 5, when: { sun: [-1, 60], shy: 0.6 } },
    { voice: 'woodpigeon', every: [45, 120], tier: 'mid', height: 8, when: { sun: [-2, 90] } },
    { voice: 'rabbit', every: [50, 150], tier: 'near', height: 0.1, when: { sun: [-9, 12] } },
    { voice: 'grasshopper', every: [8, 24], tier: 'near', height: 0.2, when: { warmth: [17, 38], sun: [6, 90], season: [0.38, 0.78] } },
    { voice: 'bee', every: [22, 60], tier: 'near', height: 1.1, when: { warmth: [15, 40], sun: [6, 90], season: [0.3, 0.76] } },
    { voice: 'dog', every: [90, 260], tier: 'far' },
    { voice: 'wood', every: [80, 240], tier: 'far', level: 0.7 },
    { voice: 'bell-church', every: [0, 0], tier: 'far', height: 20, level: 0.4 },
  ],
  signals: [
    // A pheasant going up under your feet. The one genuine fright in the book.
    { voice: 'pheasant', every: [200, 600], tier: 'near', height: 1, floor: 150, hushes: true },
  ],
  activity: 0.65,
  seed: 152,
};

export const FOREST_PATH_B_AMBIENCE: AmbienceSpec = {
  air: [
    { model: 'wind', id: 'air', options: { gain: 0.1, tone: 2200 }, follow: [{ by: 'wind', span: [0.5, 1.1] }] },
    { model: 'foliage', options: { density: 260, tone: 0.65, gain: 0.15, articulation: 0.16, restlessness: 0.14 }, follow: [{ by: 'wind', span: [0.3, 1] }] },
  ],
  chorus: [
    { model: 'foliage', tier: 'near', height: 1.2, options: { density: 180, tone: 0.9, gain: 0.24, articulation: 0.3 }, follow: [{ by: 'wind', span: [0.25, 1] }] },
    { model: 'water', tier: 'near', height: 0.2, options: { flow: 'cistern', gain: 0.12, tone: 0.8 } },
    { model: 'friction', tier: 'mid', height: 4, options: { force: 0.4, pitch: 120, decay: 0.9, bright: 0.3, roughness: 0.6, gain: 0.18, motion: 'weather' }, follow: [{ by: 'gust', span: [0, 1] }] },
  ],
  cast: [
    // The drip outlives the shower by a long way, and that is the whole point.
    { voice: 'drip', every: [2.6, 2.6], tier: 'near', height: 2.5, when: { after: 'rain' } },
    { voice: 'drip', every: [3.7, 3.7], tier: 'near', height: 3.2, level: 0.8, when: { after: 'rain' } },
    { voice: 'drip', every: [5.3, 5.3], tier: 'mid', height: 4, level: 0.7, when: { after: 'rain' } },
    { voice: 'wren-scold', every: [30, 90], tier: 'near', height: 1.2, when: { sun: [-4, 40] } },
    { voice: 'robin', every: [34, 95], tier: 'near', height: 2, when: { sun: [-9, 20], wakes: 45 } },
    { voice: 'blackbird', every: [60, 170], tier: 'mid', height: 6, when: { sun: [-8, 14], wakes: 50 } },
    { voice: 'grit', every: [40, 120], tier: 'near', height: 0.1, level: 0.6 },
    { voice: 'toad', every: [50, 150], tier: 'near', height: 0.1, when: { warmth: [10, 30], sun: [-90, 2], season: [0.24, 0.6] } },
    { voice: 'midge', every: [10, 28], tier: 'near', height: 1.7, when: { warmth: [12, 40], sun: [-7, 8] } },
    { voice: 'crow', every: [70, 220], tier: 'far', height: 12 },
  ],
  signals: [{ voice: 'jay', every: [180, 540], tier: 'mid', height: 7, floor: 140, hushes: true, level: 0.8 }],
  activity: 0.5,
  seed: 153,
};

export const RIVERSIDE_AMBIENCE: AmbienceSpec = {
  air: [
    { model: 'wind', id: 'air', options: { gain: 0.12, tone: 3200 }, follow: [{ by: 'wind', span: [0.4, 1.2] }] },
    { model: 'water', id: 'river', options: { flow: 'stream', gain: 0.2, tone: 1 } },
  ],
  chorus: [
    { model: 'water', tier: 'near', height: 0.1, options: { flow: 'brook', gain: 0.18, tone: 1.1 } },
    { model: 'water', tier: 'mid', options: { flow: 'fountain', gain: 0.1, tone: 0.9 } },
    // Reeds: dry, papery, and nothing else in the book sounds like them.
    { model: 'foliage', tier: 'near', height: 1.4, options: { density: 170, tone: 2.2, gain: 0.16, articulation: 0.45 }, follow: [{ by: 'wind', span: [0.15, 1] }] },
    { model: 'friction', tier: 'near', height: 0.6, options: { force: 0.3, pitch: 150, decay: 0.7, bright: 0.35, roughness: 0.5, gain: 0.13, motion: 'weather' }, follow: [{ by: 'gust', span: [0, 1] }] },
  ],
  cast: [
    { voice: 'duck', every: [22, 60], tier: 'mid', height: 0.4, answers: 0.4 },
    { voice: 'moorhen', every: [30, 85], tier: 'mid', height: 0.4 },
    { voice: 'heron', every: [90, 260], tier: 'far', height: 5 },
    { voice: 'reedwarbler', every: [26, 70], tier: 'near', height: 1.4, when: { season: [0.32, 0.68], sun: [-2, 90] } },
    { voice: 'kingfisher', every: [120, 340], tier: 'mid', height: 1.2, when: { sun: [2, 90] } },
    { voice: 'wagtail', every: [35, 95], tier: 'near', height: 0.6, when: { sun: [0, 90] } },
    { voice: 'plop', every: [40, 120], tier: 'mid', height: 0, when: { sun: [-8, 20] } },
    { voice: 'frog', every: [8, 24], tier: 'near', height: 0.1, when: { warmth: [12, 32], sun: [-90, 2], season: [0.26, 0.62] } },
    { voice: 'dragonfly', every: [20, 55], tier: 'near', height: 1.2, when: { warmth: [17, 38], sun: [8, 90], season: [0.38, 0.76] } },
    { voice: 'curlew', every: [70, 200], tier: 'far', height: 6, when: { sun: [-8, 14] } },
    { voice: 'swallow', every: [18, 48], tier: 'near', height: 3, passes: { over: 40, seconds: [1.1, 2.2] }, when: { season: [0.35, 0.72], sun: [0, 90] } },
    { voice: 'owl', every: [100, 300], tier: 'far', height: 8, when: { sun: [-90, -5] } },
  ],
  signals: [
    // A swan going over: a slow periodic throb, and nothing else makes it.
    { voice: 'wings', every: [200, 640], tier: 'mid', height: 14, floor: 160, level: 1.2 },
  ],
  activity: 0.7,
  seed: 154,
};

export const CAVE_AMBIENCE: AmbienceSpec = {
  air: [
    { model: 'wind', id: 'air', options: { gain: 0.05, tone: 400, whistle: 0 }, follow: [{ by: 'wind', span: [0.7, 1.1] }] },
    // The passage, blown across. The best cave sound there is and it is already
    // in the kit.
    { model: 'waveguide', options: { pitch: 41, decay: 4.5, closed: true, bright: 0.12, gain: 0.16 }, follow: [{ by: 'gust', span: [0.4, 1] }] },
  ],
  chorus: [
    { model: 'water', tier: 'far', options: { flow: 'stream', gain: 0.09, tone: 0.3 } },
    { model: 'water', tier: 'mid', height: -0.5, options: { flow: 'cistern', gain: 0.11, tone: 0.6 } },
  ],
  cast: [
    // Coprime, as `drip.ts` asks for: several slow fields beat one fast one.
    { voice: 'drip', every: [4.1, 4.1], tier: 'near', height: 3 },
    { voice: 'drip', every: [6.7, 6.7], tier: 'mid', height: 4, level: 0.8 },
    { voice: 'drip', every: [9.3, 9.3], tier: 'far', height: 5, level: 0.7 },
    { voice: 'grit', every: [40, 130], tier: 'mid', height: 3 },
    { voice: 'slab', every: [110, 340], tier: 'far' },
    { voice: 'bats', every: [30, 90], tier: 'mid', height: 6 },
  ],
  signals: [{ voice: 'rockfall', every: [400, 1200], tier: 'far', floor: 300 }],
  activity: 0.25,
  seed: 155,
};

export const CAVE_2_AMBIENCE: AmbienceSpec = {
  air: [
    { model: 'wind', id: 'air', options: { gain: 0.04, tone: 500, whistle: 0 }, follow: [{ by: 'wind', span: [0.7, 1.05] }] },
    { model: 'waveguide', options: { pitch: 55, decay: 3.6, closed: true, bright: 0.16, gain: 0.11 }, follow: [{ by: 'gust', span: [0.4, 1] }] },
  ],
  chorus: [
    { model: 'fire', tier: 'near', height: 0.4, options: { gain: 0.3, intensity: 0.5, tone: 0.85, crackle: 0.55, draught: 0.1 } },
    { model: 'water', tier: 'far', options: { flow: 'cistern', gain: 0.08, tone: 0.5 } },
    { model: 'friction', tier: 'mid', height: 2.5, options: { force: 0.25, pitch: 320, decay: 1.4, bright: 0.7, roughness: 0.4, gain: 0.1, motion: 'weather' }, follow: [{ by: 'gust', span: [0, 1] }] },
  ],
  cast: [
    { voice: 'drip', every: [5.9, 5.9], tier: 'mid', height: 4, level: 0.8 },
    { voice: 'drip', every: [8.3, 8.3], tier: 'far', height: 5, level: 0.6 },
    { voice: 'embers', every: [22, 65], tier: 'near', height: 0.3 },
    { voice: 'stone', every: [60, 180], tier: 'mid' },
    { voice: 'pot', every: [80, 240], tier: 'mid', level: 0.6 },
    { voice: 'cough', every: [120, 340], tier: 'far', level: 0.6 },
    { voice: 'grit', every: [60, 180], tier: 'mid', height: 3, level: 0.6 },
  ],
  signals: [
    // One throat, held, in a register the score's monks never occupy — and not
    // in their key.
    { voice: 'hum', every: [180, 540], tier: 'far', floor: 150, level: 0.8 },
    { voice: 'bowl', every: [260, 800], tier: 'mid', floor: 200 },
  ],
  activity: 0.3,
  seed: 160,
};

export const CAVE_DARK_AMBIENCE: AmbienceSpec = {
  air: [
    { model: 'wind', id: 'air', options: { gain: 0.05, tone: 300, whistle: 0 }, follow: [{ by: 'wind', span: [0.8, 1.05] }] },
    // A passage whose length keeps changing as the air moves through it.
    { model: 'waveguide', options: { pitch: 33, decay: 6, closed: true, bright: 0.08, gain: 0.19 }, follow: [{ by: 'gust', span: [0.5, 1] }] },
  ],
  chorus: [
    { model: 'water', tier: 'far', options: { flow: 'stream', gain: 0.07, tone: 0.22 } },
    // Rock under its own weight: the one sound that says how much is above you.
    { model: 'friction', tier: 'far', height: -4, options: { force: 0.8, pitch: 38, decay: 3.2, bright: 0.1, roughness: 0.35, gain: 0.2, motion: 'weather' }, follow: [{ by: 'gust', span: [0.2, 1] }] },
  ],
  cast: [
    // Two seeps off one fissure, not a conversation.
    { voice: 'drip', every: [7.1, 7.1], tier: 'mid', height: 5, level: 0.8, answers: 1 },
    { voice: 'drip', every: [11.3, 11.3], tier: 'far', height: 6, level: 0.6 },
    { voice: 'grit', every: [70, 220], tier: 'mid', height: 4, level: 0.5 },
    { voice: 'slab', every: [150, 460], tier: 'far', level: 0.7 },
  ],
  signals: [{ voice: 'rockfall', every: [600, 1800], tier: 'far', floor: 480, level: 0.9 }],
  activity: 0.18,
  seed: 156,
};

export const FACTORY_1_AMBIENCE: AmbienceSpec = {
  air: [
    { model: 'wind', id: 'air', options: { gain: 0.06, tone: 1600, whistle: 0 } },
    // The plant, felt before it is heard.
    { model: 'machine', options: { rpm: 340, fundamental: 50, gain: 0.16, wear: 0.5, clank: 0.1 } },
  ],
  chorus: [
    { model: 'machine', tier: 'mid', height: 2, options: { rpm: 96, fundamental: 62, gain: 0.2, wear: 0.55, clank: 0.7 } },
    { model: 'friction', tier: 'mid', height: 1.5, options: { force: 0.45, pitch: 180, decay: 0.4, bright: 0.55, roughness: 0.75, gain: 0.16, motion: 'steady', speed: 0.4 } },
    { model: 'machine', tier: 'far', height: 3, options: { rpm: 520, fundamental: 88, gain: 0.12, wear: 0.7, clank: 0.05 } },
  ],
  cast: [
    { voice: 'metal', every: [20, 55], tier: 'mid' },
    { voice: 'relay', every: [9, 26], tier: 'near', height: 1.6 },
    { voice: 'contactor', every: [60, 180], tier: 'mid' },
    { voice: 'chatter', every: [40, 120], tier: 'far', level: 0.7 },
    { voice: 'shout', every: [70, 200], tier: 'far', level: 0.8 },
    { voice: 'tick', every: [1.7, 1.7], tier: 'near', height: 1.2, level: 0.5 },
    { voice: 'steam', every: [50, 160], tier: 'mid', height: 2 },
  ],
  signals: [
    // Unintelligible on purpose: the words never arrive and the room does.
    { voice: 'tannoy', every: [200, 620], tier: 'far', height: 5, floor: 150 },
    { voice: 'klaxon', every: [0, 0], tier: 'far', height: 6, floor: 0, clock: 'hour', level: 0.8 },
  ],
  activity: 0.75,
  seed: 161,
};

export const FACTORY_2_AMBIENCE: AmbienceSpec = {
  air: [
    { model: 'wind', id: 'air', options: { gain: 0.05, tone: 1400, whistle: 0 } },
    { model: 'machine', options: { rpm: 260, fundamental: 42, gain: 0.24, wear: 0.6, clank: 0.15 } },
  ],
  chorus: [
    { model: 'machine', tier: 'near', height: 1.5, options: { rpm: 140, fundamental: 55, gain: 0.26, wear: 0.6, clank: 0.85 } },
    { model: 'fire', tier: 'mid', height: 1, options: { gain: 0.3, intensity: 0.95, tone: 0.7, crackle: 0.25, draught: 0.05 } },
    { model: 'friction', tier: 'near', height: 1.2, options: { force: 0.75, pitch: 420, decay: 0.25, bright: 0.9, roughness: 0.85, gain: 0.2, motion: 'steady', speed: 0.75 } },
  ],
  cast: [
    // Deliberately off the score's grid: a press that locked to the kit would
    // read as a doubled metronome.
    { voice: 'press', every: [2.9, 2.9], tier: 'mid', level: 0.9 },
    { voice: 'metal', every: [10, 26], tier: 'near' },
    { voice: 'contactor', every: [30, 90], tier: 'mid' },
    { voice: 'shout', every: [40, 120], tier: 'mid', level: 1.1 },
    { voice: 'steam', every: [30, 90], tier: 'near', height: 2 },
  ],
  signals: [{ voice: 'klaxon', every: [280, 900], tier: 'mid', height: 5, floor: 220 }],
  activity: 0.9,
  seed: 159,
};

export const SEWER_1_AMBIENCE: AmbienceSpec = {
  air: [
    { model: 'wind', id: 'air', options: { gain: 0.05, tone: 600, whistle: 0 } },
    // Down the length of it, at a different length from the score's drone.
    { model: 'waveguide', options: { pitch: 47, decay: 5, closed: true, bright: 0.14, gain: 0.15 }, follow: [{ by: 'gust', span: [0.5, 1] }] },
    { model: 'water', id: 'flow', options: { flow: 'stream', gain: 0.14, tone: 0.5 } },
  ],
  chorus: [
    { model: 'water', tier: 'mid', options: { flow: 'fountain', gain: 0.12, tone: 0.6 } },
    { model: 'water', tier: 'far', options: { flow: 'cistern', gain: 0.09, tone: 0.4 } },
  ],
  cast: [
    { voice: 'drip', every: [3.1, 3.1], tier: 'near', height: 2.6 },
    { voice: 'drip', every: [5.7, 5.7], tier: 'mid', height: 3.4, level: 0.8 },
    { voice: 'rat', every: [24, 70], tier: 'near', height: 0.1 },
    { voice: 'grit', every: [50, 150], tier: 'mid', level: 0.6 },
    { voice: 'chatter', every: [90, 280], tier: 'far', level: 0.5 },
    { voice: 'woodpigeon', every: [70, 200], tier: 'far', height: 6, level: 0.5, when: { sun: [0, 90] } },
  ],
  signals: [
    // The street, through a grating, and it is the only daylight in the place.
    { voice: 'metal', every: [180, 520], tier: 'far', height: 7, floor: 140, level: 1.1 },
  ],
  activity: 0.4,
  seed: 158,
};

export const SEWER_2_AMBIENCE: AmbienceSpec = {
  air: [
    { model: 'wind', id: 'air', options: { gain: 0.045, tone: 800, whistle: 0 } },
    { model: 'machine', options: { rpm: 420, fundamental: 96, gain: 0.1, wear: 0.75, clank: 0.05 } },
  ],
  chorus: [
    { model: 'machine', tier: 'mid', height: 0.8, options: { rpm: 88, fundamental: 58, gain: 0.16, wear: 0.6, clank: 0.5 } },
    { model: 'water', tier: 'near', height: 0.2, options: { flow: 'cistern', gain: 0.12, tone: 0.7 } },
  ],
  cast: [
    { voice: 'drip', every: [2.3, 2.3], tier: 'near', height: 2.2 },
    { voice: 'drip', every: [4.7, 4.7], tier: 'mid', height: 2.8, level: 0.7 },
    { voice: 'rat', every: [18, 55], tier: 'near', height: 0.1 },
    { voice: 'relay', every: [7, 20], tier: 'near', height: 1.9, level: 0.7 },
    { voice: 'hinge', every: [70, 220], tier: 'mid' },
    { voice: 'metal', every: [50, 150], tier: 'mid', level: 0.7 },
  ],
  signals: [
    // Water hammer: one blow that travels the whole run.
    { voice: 'contactor', every: [140, 440], tier: 'mid', floor: 110, level: 1.2 },
  ],
  activity: 0.4,
  seed: 157,
};

export const SCRAPYARD_AMBIENCE: AmbienceSpec = {
  air: [
    { model: 'wind', id: 'air', options: { gain: 0.2, tone: 4200 }, follow: [{ by: 'wind', span: [0.35, 1.3] }] },
  ],
  chorus: [
    // Loose sheet. The defining sound of the place, and it only exists in wind.
    { model: 'friction', tier: 'near', height: 1.5, options: { force: 0.6, pitch: 72, decay: 2.4, bright: 0.85, roughness: 0.9, gain: 0.26, motion: 'weather' }, follow: [{ by: 'gust', span: [0, 1] }] },
    { model: 'friction', tier: 'mid', height: 2.5, options: { force: 0.45, pitch: 128, decay: 1.8, bright: 0.9, roughness: 0.85, gain: 0.2, motion: 'weather' }, follow: [{ by: 'gust', span: [0, 1] }] },
    // Chainlink: a fine whistle that pitches up with the wind.
    { model: 'wind', tier: 'near', height: 2, options: { gain: 0.12, tone: 6200, whistle: 1.6 }, follow: [{ by: 'wind', span: [0.05, 1] }] },
  ],
  cast: [
    { voice: 'gull', every: [30, 90], tier: 'far', height: 14, when: { sun: [-2, 90] } },
    { voice: 'crow', every: [40, 120], tier: 'mid', height: 8, when: { sun: [-2, 90] } },
    { voice: 'metal', every: [24, 70], tier: 'mid' },
    { voice: 'rat', every: [40, 120], tier: 'near', height: 0.1 },
    { voice: 'dog', every: [90, 260], tier: 'far' },
    // Steel letting go of the day's heat. Gated on the sun going down.
    { voice: 'tick', every: [2.3, 2.3], tier: 'near', height: 1, level: 0.8, when: { sun: [-8, 9] } },
    { voice: 'tick', every: [3.7, 3.7], tier: 'mid', height: 1.4, level: 0.6, when: { sun: [-8, 9] } },
    { voice: 'grit', every: [50, 150], tier: 'mid', level: 0.7 },
  ],
  signals: [
    // A stack going over. Once in a very long while, and it is enormous.
    { voice: 'rockfall', every: [420, 1300], tier: 'mid', floor: 340, level: 1.1, hushes: true },
  ],
  activity: 0.5,
  seed: 162,
};

export const SUBSTATION_1_AMBIENCE: AmbienceSpec = {
  air: [
    { model: 'wind', id: 'air', options: { gain: 0.13, tone: 3800 }, follow: [{ by: 'wind', span: [0.4, 1.25] }] },
    // A hundred hertz: twice the line frequency, because the core pulls twice
    // per cycle. Not fifty.
    { model: 'machine', id: 'hum', options: { rpm: 3000, fundamental: 100, gain: 0.2, wear: 0.2, clank: 0 } },
    // Corona, and the damp makes it worse — which is physically why, not a
    // gesture at a mixer.
    {
      model: 'wind',
      id: 'corona',
      options: { gain: 0.05, tone: 9000, whistle: 0.2 },
      follow: [{ by: 'rain', span: [0.35, 1.6] }],
    },
  ],
  chorus: [
    { model: 'machine', tier: 'mid', height: 2, options: { rpm: 680, fundamental: 118, gain: 0.12, wear: 0.6, clank: 0.1 } },
    { model: 'wind', tier: 'near', height: 1.8, options: { gain: 0.11, tone: 5800, whistle: 1.5 }, follow: [{ by: 'wind', span: [0.05, 1] }] },
  ],
  cast: [
    { voice: 'relay', every: [6, 18], tier: 'near', height: 1.7 },
    { voice: 'contactor', every: [70, 220], tier: 'mid' },
    { voice: 'tick', every: [2.9, 2.9], tier: 'near', height: 2.2, level: 0.5 },
    { voice: 'sparrow', every: [26, 75], tier: 'near', height: 4, when: { sun: [0, 90] } },
    { voice: 'wagtail', every: [50, 150], tier: 'near', height: 3, when: { sun: [2, 90] } },
    { voice: 'wasp', every: [30, 90], tier: 'near', height: 1.5, when: { season: [0.4, 0.76], warmth: [16, 40], sun: [4, 90] } },
    { voice: 'metal', every: [60, 180], tier: 'mid', level: 0.7 },
  ],
  signals: [
    { voice: 'crack', every: [40, 140], tier: 'mid', height: 4, floor: 25, level: 1.2, when: { rain: [0.15, 1] } },
  ],
  activity: 0.45,
  seed: 163,
};

export const SUBSTATION_2_AMBIENCE: AmbienceSpec = {
  air: [
    { model: 'wind', id: 'air', options: { gain: 0.17, tone: 4000 }, follow: [{ by: 'wind', span: [0.35, 1.3] }] },
    // The harmonic without the fundamental: thinner, and there is no mass in it.
    { model: 'machine', id: 'whine', options: { rpm: 3000, fundamental: 300, gain: 0.09, wear: 0.35, clank: 0 } },
  ],
  chorus: [
    // A fan with no power, turned by the weather and nothing else.
    { model: 'machine', tier: 'near', height: 2, options: { rpm: 20, fundamental: 74, gain: 0.16, wear: 0.85, clank: 0.6 }, follow: [{ by: 'wind', span: [0, 1] }] },
    { model: 'friction', tier: 'mid', height: 2, options: { force: 0.4, pitch: 150, decay: 1.6, bright: 0.8, roughness: 0.85, gain: 0.18, motion: 'weather' }, follow: [{ by: 'gust', span: [0, 1] }] },
    { model: 'foliage', tier: 'near', height: 0.6, options: { density: 130, tone: 1.9, gain: 0.14, articulation: 0.42 }, follow: [{ by: 'wind', span: [0.15, 1] }] },
  ],
  cast: [
    { voice: 'sparrow', every: [22, 65], tier: 'near', height: 3, when: { sun: [0, 90] } },
    { voice: 'linnet', every: [40, 120], tier: 'near', height: 2.5, when: { season: [0.3, 0.74], sun: [2, 90] } },
    { voice: 'paper', every: [30, 90], tier: 'near', height: 0.2 },
    { voice: 'rat', every: [50, 150], tier: 'near', height: 0.1 },
    { voice: 'grasshopper', every: [10, 30], tier: 'near', height: 0.2, when: { warmth: [17, 38], sun: [6, 90], season: [0.38, 0.78] } },
    { voice: 'stone', every: [70, 220], tier: 'mid', level: 0.7 },
    { voice: 'hinge', every: [60, 190], tier: 'mid' },
  ],
  signals: [{ voice: 'metal', every: [150, 460], tier: 'mid', floor: 120, level: 1.1 }],
  activity: 0.4,
  seed: 164,
};

export const BEACH_AMBIENCE: AmbienceSpec = {
  air: [
    // The strongest wind in the book: nothing between here and the water.
    { model: 'wind', id: 'air', options: { gain: 0.24, tone: 4400 }, follow: [{ by: 'wind', span: [0.4, 1.35] }] },
    // The surf, until it has a cycle of its own.
    { model: 'water', id: 'surf', options: { flow: 'fountain', gain: 0.22, tone: 0.42 } },
  ],
  chorus: [
    { model: 'water', tier: 'near', height: 0, options: { flow: 'brook', gain: 0.14, tone: 0.6 } },
    { model: 'foliage', tier: 'near', height: 0.8, options: { density: 150, tone: 2, gain: 0.13, articulation: 0.44 }, follow: [{ by: 'wind', span: [0.15, 1] }] },
    { model: 'friction', tier: 'near', height: 2.4, options: { force: 0.3, pitch: 210, decay: 0.8, bright: 0.6, roughness: 0.6, gain: 0.12, motion: 'weather' }, follow: [{ by: 'gust', span: [0, 1] }] },
  ],
  cast: [
    { voice: 'gull', every: [16, 44], tier: 'mid', height: 12, answers: 0.5, when: { sun: [-4, 90] } },
    { voice: 'kittiwake', every: [26, 70], tier: 'far', height: 16, when: { sun: [-2, 90] } },
    { voice: 'oystercatcher', every: [34, 95], tier: 'mid', height: 2, when: { sun: [-4, 90] } },
    { voice: 'curlew', every: [50, 150], tier: 'far', height: 5, when: { season: [0.72, 0.32] } },
    { voice: 'raven', every: [90, 260], tier: 'far', height: 20, when: { sun: [0, 90] } },
    { voice: 'seal', every: [160, 480], tier: 'far', height: 0 },
    { voice: 'splash', every: [30, 90], tier: 'mid', height: 0 },
    { voice: 'grit', every: [26, 75], tier: 'near', height: 0.1, level: 0.8 },
  ],
  signals: [
    // Rung by the swell rather than by anybody, which is what makes it the
    // soundmark rather than a bell.
    { voice: 'bell-buoy', every: [26, 44], tier: 'far', height: 1, floor: 20, level: 0.8 },
    { voice: 'foghorn', every: [70, 130], tier: 'far', height: 3, floor: 55, when: { fog: [0.3, 1] } },
  ],
  activity: 0.6,
  seed: 169,
};

export const BEACH_PATH_AMBIENCE: AmbienceSpec = {
  air: [
    { model: 'wind', id: 'air', options: { gain: 0.19, tone: 3900 }, follow: [{ by: 'wind', span: [0.4, 1.3] }] },
    { model: 'water', id: 'surf', options: { flow: 'fountain', gain: 0.11, tone: 0.28 } },
  ],
  chorus: [
    { model: 'foliage', tier: 'near', height: 0.9, options: { density: 170, tone: 1.6, gain: 0.2, articulation: 0.38 }, follow: [{ by: 'wind', span: [0.15, 1] }] },
    { model: 'foliage', tier: 'mid', height: 0.6, options: { density: 200, tone: 1.3, gain: 0.16, articulation: 0.3 }, follow: [{ by: 'wind', span: [0.15, 1] }] },
    { model: 'wind', tier: 'near', height: 1.4, options: { gain: 0.08, tone: 5400, whistle: 1.4 }, follow: [{ by: 'wind', span: [0.05, 1] }] },
  ],
  cast: [
    { voice: 'skylark', every: [34, 95], tier: 'far', height: 38, when: { season: [0.3, 0.72], sun: [6, 90], shy: 0.6 } },
    { voice: 'meadowpipit', every: [26, 70], tier: 'near', height: 1.5, when: { sun: [0, 90] } },
    { voice: 'linnet', every: [34, 95], tier: 'near', height: 1.2, when: { season: [0.3, 0.74], sun: [2, 90] } },
    { voice: 'gull', every: [40, 120], tier: 'far', height: 16, when: { sun: [-2, 90] } },
    { voice: 'rabbit', every: [50, 150], tier: 'near', height: 0.1, when: { sun: [-9, 12] } },
    { voice: 'grasshopper', every: [9, 26], tier: 'near', height: 0.2, when: { warmth: [17, 38], sun: [6, 90], season: [0.38, 0.78] } },
    { voice: 'bee', every: [26, 75], tier: 'near', height: 1, when: { warmth: [15, 40], sun: [6, 90], season: [0.3, 0.76] } },
    { voice: 'dog', every: [110, 320], tier: 'far' },
  ],
  signals: [
    // Gorse pods going off in the heat. Real, and nobody has ever put it in a
    // game.
    { voice: 'crack', every: [14, 40], tier: 'near', height: 1, floor: 6, level: 0.7, when: { warmth: [20, 40], sun: [15, 90], rain: [0, 0.05] } },
    // The stonechat: two stones tapped together, and instantly identifiable.
    { voice: 'stonechat', every: [40, 120], tier: 'near', height: 1.4, floor: 25, when: { sun: [0, 90] } },
  ],
  activity: 0.6,
  seed: 170,
};
