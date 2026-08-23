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
    { model: 'air', id: 'air', options: { gain: 0.15, tone: 3000, shelter: 0.45, aperture: 0.25, roar: 0.5, rush: 1.0, hiss: 0.6 }, follow: [{ by: 'wind', span: [0.5, 1.2] }] },
  ],
  chorus: [
    // and then a bucket, and nothing in between.
    { model: 'bustle', options: { rate: 7, distance: 700, roll: 0.4, busy: 0.5, gain: 0.09 }, follow: [{ by: 'night', span: [1, 0.1] }] },
    // Gardens and a hedge, near enough that you hear leaves rather than hush.
    { model: 'hedge', options: { density: 190, tone: 1.15, woody: 0.45, gain: 0.08 } },
    { model: 'hedge', height: 4, options: { density: 240, tone: 0.85, woody: 0.3, gain: 0.07 } },
  ],
  cast: [
    { voice: 'blackbird', every: [22, 50], height: 7, when: { sun: [-7, 12], wakes: 50, shy: 0.65 } },
    { voice: 'robin', every: [26, 60], height: 3, when: { sun: [-9, 20], wakes: 45, shy: 0.6 } },
    { voice: 'sparrow', every: [14, 34], height: 3, when: { sun: [-1, 90], shy: 0.7 } },
    { voice: 'swift', every: [12, 30], height: 16, passes: { over: 60, seconds: [1.6, 3] }, when: { sun: [2, 40], season: [0.38, 0.68] } },
    // without any gate: a pail goes down empty and comes up full, and the air
  ],
  signals: [
    { voice: 'bell-church', every: [0, 0], height: 18, floor: 0, clock: 'hour', level: 0.9 },
  ],
  activity: 0.55,
  seed: 148,
};

export const VILLAGE_2_AMBIENCE: AmbienceSpec = {
  air: [
    { model: 'air', id: 'air', options: { gain: 0.11, tone: 2800, shelter: 0.55, aperture: 0.2, roar: 0.5, rush: 1.0, hiss: 0.5 }, follow: [{ by: 'wind', span: [0.5, 1.1] }] },
  ],
  chorus: [
    // far off to pick apart, which is what a market is once the voices are out.
    { model: 'bustle', options: { rate: 24, distance: 1000, roll: 0.75, busy: 0.85, gain: 0.14 }, follow: [{ by: 'night', span: [1, 0.05] }, { by: 'rain', span: [1, 0.4] }] },
    { model: 'hedge', options: { density: 130, tone: 1.3, woody: 0.5, gain: 0.055 } },
  ],
  cast: [
    { voice: 'wings', every: [40, 120], height: 7 },
    { voice: 'sparrow', every: [16, 40], height: 4, when: { sun: [-2, 90] } },
  ],
  signals: [
    { voice: 'bell-church', every: [0, 0], height: 18, floor: 0, clock: 'hour', level: 0.7 },
  ],
  activity: 0.85,
  seed: 166,
};

export const VILLAGE_INTERIOR_1_AMBIENCE: AmbienceSpec = {
  air: [
    // is allowed in is the chimney and the window, both of which are below.
    { model: 'cavern', id: 'room', options: { size: 155, hard: 0.22, draught: 0.12, drift: 0.1, floor: 0.22, gain: 0.09 } },
    { model: 'rain', id: 'rain', options: { gain: 0.06, intensity: 0, surface: 'stone', articulation: 0.5 } },
  ],
  cast: [
    { voice: 'fly', every: [30, 90], height: 1.5, when: { season: [0.35, 0.72], warmth: [14, 40], sun: [0, 90] } },
    { voice: 'mouse', every: [60, 180], height: 0.1, when: { sun: [-90, -3] } },
    { voice: 'wood', every: [70, 200], level: 0.6 },
  ],
  signals: [{ voice: 'bell-shop', every: [0, 0], floor: 0, clock: 'hour', level: 0.45 }],
  activity: 0.3,
  seed: 167,
};

export const VILLAGE_INTERIOR_2_AMBIENCE: AmbienceSpec = {
  air: [
    { model: 'cavern', id: 'room', options: { size: 178, hard: 0.3, draught: 0.1, drift: 0.08, floor: 0.18, gain: 0.08 } },
    { model: 'rain', id: 'rain', options: { gain: 0.05, intensity: 0, surface: 'canopy', articulation: 0.3 } },
  ],
  cast: [
    // A smaller frame than the hearth room's, so it talks more and says less.
    { voice: 'wood', every: [50, 160], level: 0.42 },
    { voice: 'crack', every: [90, 260], level: 0.35, when: { sun: [-9, 8] } },
    { voice: 'mouse', every: [60, 190], height: 0.1, when: { sun: [-90, -3] } },
    { voice: 'fly', every: [40, 120], height: 1.6, when: { season: [0.35, 0.72], warmth: [14, 40] } },
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
    // is quiet for a reason nobody has to be told.
    { model: 'insect', height: 0.15, options: { kind: 'cricket', voices: 4, gain: 0.085 }, follow: [{ by: 'night', span: [0.35, 1] }], when: { season: [0.32, 0.82] } },
  ],
  cast: [
    { voice: 'swallow', every: [16, 40], height: 6, passes: { over: 40, seconds: [1.2, 2.4] }, when: { season: [0.35, 0.72], sun: [0, 90] } },
    { voice: 'wood', every: [40, 110], when: { sun: [-2, 90] } },
  ],
  activity: 0.7,
  seed: 149,
};

export const FOREST_A_AMBIENCE: AmbienceSpec = {
  air: [
    { model: 'air', id: 'air', options: { gain: 0.12, tone: 3100, shelter: 0.5, aperture: 0.2, roar: 0.55, rush: 1.0, hiss: 0.75 }, follow: [{ by: 'wind', span: [0.35, 1.2] }] },
    { model: 'foliage', options: { density: 280, tone: 0.8, gain: 0.08, articulation: 0.2, restlessness: 0.12 }, follow: [{ by: 'wind', span: [0.2, 1] }] },
  ],
  chorus: [
    // order you would watch it — the gust field already lags with distance.
    { model: 'foliage', height: 9, options: { density: 260, tone: 0.78, gain: 0.14, articulation: 0.2 }, follow: [{ by: 'wind', span: [0.2, 1] }] },
    { model: 'foliage', height: 11, options: { density: 240, tone: 0.86, gain: 0.13, articulation: 0.22 }, follow: [{ by: 'wind', span: [0.2, 1] }] },
    { model: 'foliage', height: 13, options: { density: 200, tone: 0.7, gain: 0.12, articulation: 0.16 }, follow: [{ by: 'wind', span: [0.15, 1] }] },
  ],
  cast: [
    { voice: 'songthrush', every: [20, 46], height: 9, when: { sun: [-9, 24], wakes: 47, shy: 0.6 } },
    { voice: 'blackbird', every: [24, 55], height: 8, when: { sun: [-9, 26], wakes: 50, shy: 0.6 } },
    { voice: 'robin', every: [22, 52], height: 3, when: { sun: [-10, 30], wakes: 45, shy: 0.6 } },
    { voice: 'wren', every: [30, 80], height: 1.5, when: { sun: [-4, 40], wakes: 20, shy: 0.55 } },
    { voice: 'chaffinch', every: [26, 65], height: 7, when: { sun: [-2, 50], wakes: 10, shy: 0.6 } },
    { voice: 'greattit', every: [28, 70], height: 6, when: { sun: [-1, 60], wakes: 8, shy: 0.6 } },
    { voice: 'blackcap', every: [34, 90], height: 7, when: { season: [0.3, 0.7], sun: [-4, 60], shy: 0.55 } },
    { voice: 'wings', every: [50, 150], height: 7 },
    { voice: 'bee', every: [20, 60], height: 1.2, when: { warmth: [15, 40], sun: [6, 90], season: [0.3, 0.76] } },
    { voice: 'midge', every: [12, 34], height: 1.7, when: { warmth: [13, 40], sun: [-6, 8], season: [0.35, 0.8] } },
  ],
  activity: 0.8,
  seed: 150,
};

export const FOREST_B_AMBIENCE: AmbienceSpec = {
  air: [
    { model: 'air', id: 'air', options: { gain: 0.14, tone: 2400, shelter: 0.62, aperture: 0.15, roar: 0.7, rush: 1.0, hiss: 0.6 }, follow: [{ by: 'wind', span: [0.4, 1.2] }] },
    // Conifer: steadier and higher than broadleaf, and it never quite stops.
    { model: 'foliage', options: { density: 340, tone: 1.35, gain: 0.075, articulation: 0.12, restlessness: 0.32 }, follow: [{ by: 'wind', span: [0.35, 1] }] },
  ],
  chorus: [
    { model: 'foliage', height: 12, options: { density: 300, tone: 1.25, gain: 0.12, articulation: 0.14, restlessness: 0.25 }, follow: [{ by: 'wind', span: [0.3, 1] }] },
    // things in it.
    { model: 'friction', height: 5, options: { force: 0.55, pitch: 96, decay: 1.1, bright: 0.25, roughness: 0.55, gain: 0.24, motion: 'weather' }, follow: [{ by: 'gust', span: [0, 1] }] },
    { model: 'water', options: { flow: 'stream', gain: 0.1, tone: 0.45 } },
  ],
  cast: [
    { voice: 'wren', every: [45, 130], height: 1.2, when: { sun: [-2, 40], shy: 0.5 } },
    { voice: 'fox', every: [120, 380], when: { sun: [-90, -6], season: [0.78, 0.28] } },
    { voice: 'stag', every: [160, 460], when: { season: [0.66, 0.84], sun: [-90, 4] } },
    { voice: 'bats', every: [14, 40], height: 5, when: { sun: [-9, -1], warmth: [8, 40] } },
    { voice: 'midge', every: [16, 44], height: 1.7, when: { warmth: [12, 40], sun: [-7, 6] } },
    { voice: 'crack', every: [70, 220], height: 1, level: 0.8 },
    { voice: 'slab', every: [220, 700], level: 0.6 },
  ],
  activity: 0.45,
  seed: 151,
};

export const FOREST_PATH_A_AMBIENCE: AmbienceSpec = {
  air: [
    { model: 'air', id: 'air', options: { gain: 0.15, tone: 3300, shelter: 0.38, aperture: 0.25, roar: 0.55, rush: 1.0, hiss: 0.8 }, follow: [{ by: 'wind', span: [0.4, 1.25] }] },
    { model: 'foliage', options: { density: 200, tone: 1.1, gain: 0.06, articulation: 0.24 }, follow: [{ by: 'wind', span: [0.2, 1] }] },
  ],
  chorus: [
    { model: 'foliage', height: 1.6, options: { density: 150, tone: 1.5, gain: 0.11, articulation: 0.34 }, follow: [{ by: 'wind', span: [0.2, 1] }] },
    { model: 'foliage', height: 8, options: { density: 220, tone: 0.8, gain: 0.1, articulation: 0.16 }, follow: [{ by: 'wind', span: [0.15, 1] }] },
    { model: 'water', options: { flow: 'brook', gain: 0.12, tone: 1 } },
    { model: 'insect', height: 0.2, options: { kind: 'grasshopper', voices: 4, gain: 0.06 }, when: { sun: [4, 90], season: [0.36, 0.8] } },
  ],
  cast: [
    { voice: 'yellowhammer', every: [26, 65], height: 2.5, when: { season: [0.28, 0.72], sun: [2, 90], shy: 0.6 } },
    { voice: 'whitethroat', every: [30, 80], height: 2, when: { season: [0.32, 0.68], sun: [0, 90], shy: 0.55 } },
    { voice: 'chaffinch', every: [30, 78], height: 6, when: { sun: [-2, 60], wakes: 10, shy: 0.6 } },
    { voice: 'robin', every: [30, 80], height: 2, when: { sun: [-9, 30], wakes: 45, shy: 0.6 } },
    { voice: 'greattit', every: [34, 90], height: 5, when: { sun: [-1, 60], shy: 0.6 } },
    { voice: 'rabbit', every: [50, 150], height: 0.1, when: { sun: [-9, 12] } },
    { voice: 'bee', every: [22, 60], height: 1.1, when: { warmth: [15, 40], sun: [6, 90], season: [0.3, 0.76] } },
    { voice: 'wood', every: [80, 240], level: 0.7 },
    { voice: 'bell-church', every: [0, 0], height: 20, level: 0.4 },
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
    { model: 'foliage', height: 1.2, options: { density: 180, tone: 0.9, gain: 0.12, articulation: 0.3 }, follow: [{ by: 'wind', span: [0.25, 1] }] },
    { model: 'water', height: 0.2, options: { flow: 'cistern', gain: 0.12, tone: 0.8 } },
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
    { voice: 'toad', every: [50, 150], height: 0.1, when: { warmth: [10, 30], sun: [-90, 2], season: [0.24, 0.6] } },
    { voice: 'midge', every: [10, 28], height: 1.7, when: { warmth: [12, 40], sun: [-7, 8] } },
  ],
  activity: 0.5,
  seed: 153,
};

export const RIVERSIDE_AMBIENCE: AmbienceSpec = {
  air: [
    { model: 'air', id: 'air', options: { gain: 0.12, tone: 3200, shelter: 0.3, aperture: 0.3, roar: 0.5, rush: 1.0, hiss: 0.85 }, follow: [{ by: 'wind', span: [0.4, 1.2] }] },
    { model: 'water', id: 'river', options: { flow: 'stream', gain: 0.2, tone: 1 } },
  ],
  chorus: [
    { model: 'water', height: 0.1, options: { flow: 'brook', gain: 0.18, tone: 1.1 } },
    { model: 'water', options: { flow: 'fountain', gain: 0.1, tone: 0.9 } },
    // Reeds: dry, papery, and nothing else in the book sounds like them.
    { model: 'foliage', height: 1.4, options: { density: 170, tone: 2.2, gain: 0.08, articulation: 0.45 }, follow: [{ by: 'wind', span: [0.15, 1] }] },
    // into step over a few seconds, holds, and falls apart again.
    {
      model: 'flock',
      height: 0.1,
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
    { voice: 'kingfisher', every: [120, 340], height: 1.2, when: { sun: [2, 90] } },
    { voice: 'wagtail', every: [35, 95], height: 0.6, when: { sun: [0, 90] } },
    { voice: 'plop', every: [40, 120], height: 0, when: { sun: [-8, 20] } },
    { voice: 'dragonfly', every: [20, 55], height: 1.2, when: { warmth: [17, 38], sun: [8, 90], season: [0.38, 0.76] } },
    { voice: 'curlew', every: [70, 200], height: 6, when: { sun: [-8, 14] } },
    { voice: 'swallow', every: [18, 48], height: 3, passes: { over: 40, seconds: [1.1, 2.2] }, when: { season: [0.35, 0.72], sun: [0, 90] } },
  ],
  signals: [
    // A swan going over: a slow periodic throb, and nothing else makes it.
    { voice: 'wings', every: [200, 640], height: 14, floor: 160, level: 1.2 },
  ],
  activity: 0.7,
  seed: 154,
};

export const CAVE_AMBIENCE: AmbienceSpec = {
  air: [
    // The chamber itself. Not a pipe: a cave has no note, it has several broad
    // irrational resonances that wander as the air moves through it.
    { model: 'cavern', id: 'room', options: { size: 42, hard: 0.78, drift: 0.55, floor: 0.6, gain: 0.2 } },
  ],
  chorus: [
    { model: 'water', options: { flow: 'stream', gain: 0.09, tone: 0.3 } },
    { model: 'water', height: -0.5, options: { flow: 'cistern', gain: 0.11, tone: 0.6 } },
  ],
  cast: [
    // Coprime, as `drip.ts` asks for: several slow fields beat one fast one.
    { voice: 'drip', every: [4.1, 4.1], rhythm: 'periodic', height: 3 },
    { voice: 'drip', every: [6.7, 6.7], rhythm: 'periodic', height: 4, level: 0.8 },
    { voice: 'drip', every: [9.3, 9.3], rhythm: 'periodic', height: 5, level: 0.7 },
    { voice: 'grit', every: [40, 130], height: 3 },
    { voice: 'slab', every: [110, 340] },
    { voice: 'bats', every: [30, 90], height: 6 },
  ],
  signals: [{ voice: 'rockfall', every: [400, 1200], floor: 300 }],
  activity: 0.25,
  seed: 155,
};

export const CAVE_2_AMBIENCE: AmbienceSpec = {
  air: [
    // Smaller and softer than the deep cave: it has been lived in.
    { model: 'cavern', id: 'room', options: { size: 62, hard: 0.62, drift: 0.4, floor: 0.45, gain: 0.16 } },
  ],
  chorus: [
    // traces of somebody, not a second layer of geology.
    { model: 'cavern', options: { size: 96, hard: 0.5, draught: 0.25, drift: 0.3, floor: 0.3, gain: 0.09 } },
  ],
  cast: [
    { voice: 'drip', every: [5.9, 5.9], rhythm: 'periodic', height: 4, level: 0.8 },
    { voice: 'drip', every: [8.3, 8.3], rhythm: 'periodic', height: 5, level: 0.6 },
    { voice: 'grit', every: [70, 210], height: 3, level: 0.6 },
  ],
  activity: 0.3,
  seed: 160,
};

export const CAVE_DARK_AMBIENCE: AmbienceSpec = {
  air: [
    // Bigger, harder and lower than the cave above it, and it drifts further.
    { model: 'cavern', id: 'room', options: { size: 28, hard: 0.88, drift: 0.75, floor: 0.85, gain: 0.24 } },
  ],
  chorus: [
    { model: 'water', options: { flow: 'stream', gain: 0.07, tone: 0.22 } },
    // Rock under its own weight: the one sound that says how much is above you.
    { model: 'friction', height: -4, options: { force: 0.8, pitch: 38, decay: 3.2, bright: 0.1, roughness: 0.35, gain: 0.2, motion: 'weather' }, follow: [{ by: 'gust', span: [0.2, 1] }] },
  ],
  cast: [
    // Two seeps off one fissure, not a conversation.
    { voice: 'drip', every: [7.1, 7.1], rhythm: 'periodic', height: 5, level: 0.8, answers: 1 },
    { voice: 'drip', every: [11.3, 11.3], rhythm: 'periodic', height: 6, level: 0.6 },
    { voice: 'grit', every: [70, 220], height: 4, level: 0.5 },
    { voice: 'slab', every: [150, 460], level: 0.7 },
  ],
  signals: [{ voice: 'rockfall', every: [600, 1800], floor: 480, level: 0.9 }],
  activity: 0.18,
  seed: 156,
};

export const FACTORY_1_AMBIENCE: AmbienceSpec = {
  air: [
    { model: 'air', id: 'air', options: { gain: 0.05, tone: 1600, shelter: 0.85, aperture: 0.1, roar: 0.6, rush: 0.8, hiss: 0.25 } },
    // saturation inside the loop, so it grinds and wanders rather than droning.
    { model: 'plant', id: 'plant', options: { rpm: 340, size: 74, metal: 0.55, clank: 0.35, wear: 0.5, load: 0.5, duty: 0.5, gain: 0.2 } },
  ],
  chorus: [
    // valve in here stands somewhere and carries its own sound; what a shop
    // a great deal of steel being handled out of sight.
    { model: 'bustle', options: { rate: 16, distance: 1400, roll: 0.6, metal: 0.9, busy: 0.7, gain: 0.11 } },
  ],
  cast: [
    // load dropped at the other end of the building.
    { voice: 'slab', every: [40, 130], level: 0.8 },
    { voice: 'steam', every: [50, 160], level: 0.7 },
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
    // in it you could walk over to.
    { model: 'bustle', options: { rate: 30, distance: 1900, roll: 0.8, metal: 1, busy: 0.9, gain: 0.15 } },
  ],
  cast: [
    { voice: 'slab', every: [22, 70], level: 0.9 },
    { voice: 'steam', every: [30, 90], level: 0.8 },
    { voice: 'rockfall', every: [90, 300], level: 0.6 },
  ],
  activity: 0.9,
  seed: 159,
};

export const SEWER_1_AMBIENCE: AmbienceSpec = {
  air: [
    // A long brick tube: high, hard, and it drifts almost not at all.
    { model: 'cavern', id: 'room', options: { size: 96, hard: 0.85, drift: 0.2, floor: 0.4, gain: 0.15 } },
    { model: 'water', id: 'flow', options: { flow: 'stream', gain: 0.14, tone: 0.5 } },
  ],
  chorus: [
    { model: 'water', options: { flow: 'fountain', gain: 0.12, tone: 0.6 } },
    { model: 'water', options: { flow: 'cistern', gain: 0.09, tone: 0.4 } },
  ],
  cast: [
    { voice: 'drip', every: [3.1, 3.1], height: 2.6 },
    { voice: 'drip', every: [5.7, 5.7], height: 3.4, level: 0.8 },
    { voice: 'rat', every: [24, 70], height: 0.1 },
    { voice: 'grit', every: [50, 150], level: 0.6 },
  ],
  activity: 0.4,
  seed: 158,
};

export const SEWER_2_AMBIENCE: AmbienceSpec = {
  air: [
    // is a pump, it stands somewhere, and at four hundred revolutions a minute
    // its once-per-turn knock is seven a second, which is a helicopter.
    { model: 'cavern', id: 'room', options: { size: 128, hard: 0.55, draught: 0.2, drift: 0.1, floor: 0.28, gain: 0.12 } },
    { model: 'water', id: 'flow', options: { flow: 'cistern', gain: 0.13, tone: 0.55 } },
  ],
  chorus: [
    { model: 'water', height: 0.2, options: { flow: 'cistern', gain: 0.12, tone: 0.7 } },
  ],
  cast: [
    { voice: 'drip', every: [2.3, 2.3], height: 2.2 },
    { voice: 'drip', every: [4.7, 4.7], height: 2.8, level: 0.7 },
    { voice: 'rat', every: [18, 55], height: 0.1 },
  ],
  activity: 0.4,
  seed: 157,
};

export const SCRAPYARD_AMBIENCE: AmbienceSpec = {
  air: [
    { model: 'air', id: 'air', options: { gain: 0.2, tone: 4200, shelter: 0.05, aperture: 0.85, roar: 0.75, rush: 1.0, hiss: 1.0 }, follow: [{ by: 'wind', span: [0.35, 1.3] }] },
  ],
  chorus: [
    // only in wind — including the crack when a panel lets go.
    { model: 'plate', height: 1.5, options: { pitch: 88, decay: 2.2, bright: 0.75, onset: 0.3, snap: 0.4, gain: 0.24 } },
    { model: 'plate', height: 2.5, options: { pitch: 148, decay: 1.5, bright: 0.85, onset: 0.36, snap: 0.3, gain: 0.19 } },
    { model: 'wire', height: 2, options: { diameter: 0.0028, strands: 4, gain: 0.09 } },
    // Steel giving up the day's heat: fast at first, slowing to nothing.
    { model: 'tick', height: 1, options: { every: 0.5, pitch: 1300, decay: 0.12, swing: 0.15, cooling: 260, gain: 0.075 }, when: { sun: [-8, 9] } },
    { model: 'tick', height: 1.4, options: { every: 0.8, pitch: 900, decay: 0.16, swing: 0.1, cooling: 320, gain: 0.06 }, when: { sun: [-8, 9] } },
  ],
  cast: [
    { voice: 'rat', every: [40, 120], height: 0.1 },
    { voice: 'grit', every: [50, 150], level: 0.7 },
  ],
  signals: [
    // A stack going over. Once in a very long while, and it is enormous.
    { voice: 'rockfall', every: [420, 1300], floor: 340, level: 1.1, hushes: true },
  ],
  activity: 0.5,
  seed: 162,
};

export const SUBSTATION_1_AMBIENCE: AmbienceSpec = {
  air: [
    { model: 'air', id: 'air', options: { gain: 0.13, tone: 3800, shelter: 0.1, aperture: 0.8, roar: 0.6, rush: 1.0, hiss: 0.95 }, follow: [{ by: 'wind', span: [0.4, 1.25] }] },
    // Not a transformer: there is nothing to hum, only things that turn.
    { model: 'plant', id: 'plant', options: { rpm: 190, size: 118, metal: 0.5, clank: 0.45, wear: 0.6, load: 0.4, duty: 0.6, gain: 0.16 } },
  ],
  chorus: [
    // The fence singing up in a gust: f is about 0.2 U over d.
    { model: 'wire', height: 1.8, options: { diameter: 0.003, strands: 5, gain: 0.085 } },
  ],
  cast: [
    { voice: 'sparrow', every: [26, 75], height: 4, when: { sun: [0, 90] } },
    { voice: 'wagtail', every: [50, 150], height: 3, when: { sun: [2, 90] } },
    { voice: 'wasp', every: [30, 90], height: 1.5, when: { season: [0.4, 0.76], warmth: [16, 40], sun: [4, 90] } },
  ],
  signals: [
    { voice: 'crack', every: [40, 140], height: 4, floor: 25, level: 1.2, when: { rain: [0.15, 1] } },
  ],
  activity: 0.45,
  seed: 163,
};

export const SUBSTATION_2_AMBIENCE: AmbienceSpec = {
  air: [
    { model: 'air', id: 'air', options: { gain: 0.17, tone: 4000, shelter: 0.08, aperture: 0.75, roar: 0.6, rush: 1.0, hiss: 1.0 }, follow: [{ by: 'wind', span: [0.35, 1.3] }] },
    // of them is turning, so all that is left is what the weather does to them.
    { model: 'plant', id: 'plant', options: { rpm: 22, size: 142, metal: 0.75, clank: 0.7, wear: 0.9, load: 0.12, duty: 0.25, gain: 0.1 } },
  ],
  chorus: [
    // A fan with no power, turned by the weather and nothing else.
    { model: 'plate', height: 2, options: { pitch: 165, decay: 1.2, bright: 0.85, onset: 0.34, snap: 0.35, gain: 0.17 } },
    { model: 'foliage', height: 0.6, options: { density: 130, tone: 1.9, gain: 0.07, articulation: 0.42 }, follow: [{ by: 'wind', span: [0.15, 1] }] },
  ],
  cast: [
    { voice: 'sparrow', every: [22, 65], height: 3, when: { sun: [0, 90] } },
    { voice: 'linnet', every: [40, 120], height: 2.5, when: { season: [0.3, 0.74], sun: [2, 90] } },
    { voice: 'rat', every: [50, 150], height: 0.1 },
    { voice: 'grasshopper', every: [10, 30], height: 0.2, when: { warmth: [17, 38], sun: [6, 90], season: [0.38, 0.78] } },
  ],
  signals: [{ voice: 'metal', every: [150, 460], floor: 120, level: 1.1 }],
  activity: 0.4,
  seed: 164,
};

export const BEACH_AMBIENCE: AmbienceSpec = {
  air: [
    // The strongest wind in the book: nothing between here and the water.
    { model: 'air', id: 'air', options: { gain: 0.24, tone: 4400, shelter: 0.0, aperture: 0.4, roar: 0.9, rush: 1.0, hiss: 1.1 }, follow: [{ by: 'wind', span: [0.4, 1.35] }] },
    // the whole difference between a shore and a waterfall.
    { model: 'surf', id: 'surf', options: { gain: 0.26, shingle: 0.85, period: [8, 14] } },
  ],
  chorus: [
    { model: 'water', height: 0, options: { flow: 'brook', gain: 0.14, tone: 0.6 } },
    { model: 'foliage', height: 0.8, options: { density: 150, tone: 2, gain: 0.065, articulation: 0.44 }, follow: [{ by: 'wind', span: [0.15, 1] }] },
  ],
  cast: [
    { voice: 'kittiwake', every: [26, 70], height: 16, when: { sun: [-2, 90] } },
    { voice: 'oystercatcher', every: [34, 95], height: 2, when: { sun: [-4, 90] } },
    { voice: 'curlew', every: [50, 150], height: 5, when: { season: [0.72, 0.32] } },
    { voice: 'seal', every: [160, 480], height: 0 },
    { voice: 'splash', every: [30, 90], height: 0 },
    { voice: 'grit', every: [26, 75], height: 0.1, level: 0.8 },
  ],
  signals: [
    // soundmark rather than a bell.
    { voice: 'bell-buoy', every: [26, 44], height: 1, floor: 20, level: 0.8 },
    { voice: 'foghorn', every: [70, 130], height: 3, floor: 55, when: { fog: [0.3, 1] } },
  ],
  activity: 0.6,
  seed: 169,
};

export const BEACH_PATH_AMBIENCE: AmbienceSpec = {
  air: [
    { model: 'air', id: 'air', options: { gain: 0.19, tone: 3900, shelter: 0.15, aperture: 0.45, roar: 0.8, rush: 1.0, hiss: 1.0 }, follow: [{ by: 'wind', span: [0.4, 1.3] }] },
    { model: 'surf', id: 'surf', options: { gain: 0.13, shingle: 0.7, period: [9, 15], tone: 0.6 } },
  ],
  chorus: [
    { model: 'foliage', height: 0.9, options: { density: 170, tone: 1.6, gain: 0.1, articulation: 0.38 }, follow: [{ by: 'wind', span: [0.15, 1] }] },
    { model: 'foliage', height: 0.6, options: { density: 200, tone: 1.3, gain: 0.08, articulation: 0.3 }, follow: [{ by: 'wind', span: [0.15, 1] }] },
    // shedding does.
    { model: 'wire', height: 1.4, options: { diameter: 0.004, strands: 3, gain: 0.075 } },
    { model: 'insect', height: 0.2, options: { kind: 'grasshopper', voices: 4, gain: 0.055 }, when: { sun: [4, 90], season: [0.36, 0.8] } },
  ],
  cast: [
    { voice: 'linnet', every: [34, 95], height: 1.2, when: { season: [0.3, 0.74], sun: [2, 90] } },
    { voice: 'rabbit', every: [50, 150], height: 0.1, when: { sun: [-9, 12] } },
    { voice: 'bee', every: [26, 75], height: 1, when: { warmth: [15, 40], sun: [6, 90], season: [0.3, 0.76] } },
  ],
  signals: [
    // game.
    { voice: 'crack', every: [14, 40], height: 1, floor: 6, level: 0.7, when: { warmth: [20, 40], sun: [15, 90], rain: [0, 0.05] } },
    // The stonechat: two stones tapped together, and instantly identifiable.
    { voice: 'stonechat', every: [40, 120], height: 1.4, floor: 25, when: { sun: [0, 90] } },
  ],
  activity: 0.6,
  seed: 170,
};
