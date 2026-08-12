import type { MusicSpec } from './director';

/**
 * The vibe book — the nine place compositions of SPEC Phase 6e.
 *
 * A spec per kind of place, built on three findings: settlements pulse and
 * wilderness floats (a felt pulse with drums is human presence, and its
 * absence is the strongest lever the table has); the mode is the character;
 * and an interior is a *reduction* of its outside — same root, same mode,
 * same seed, thinner arrangement — so stepping indoors is the same music
 * heard through walls rather than a different track.
 *
 * Rack identity is spec identity: a zone must declare one of these constants,
 * not a copy of its fields, so every zone with the same vibe shares one rack
 * and the border crossfade works. The table in the spec is the tunable;
 * these names are working labels — naming stays with the repo owner.
 */

export const VILLAGE_VIBE: MusicSpec = {
  root: 130.81, // C3
  mode: 'mixolydian',
  palette: { drone: 'strings', texture: 'pluck', melody: 'flute' },
  density: 0.85,
  pulse: 65,
  drums: true,
  seed: 48,
};

/** The village heard from indoors: same seed, thinner, no kit. */
export const VILLAGE_INTERIOR_VIBE: MusicSpec = {
  root: 130.81, // C3
  mode: 'mixolydian',
  palette: { drone: 'bass', texture: 'pluck', melody: 'flute' },
  density: 0.4,
  pulse: 55,
  seed: 48,
};

export const FARM_VIBE: MusicSpec = {
  root: 174.61, // F3
  mode: 'ionian',
  palette: { drone: 'strings', texture: 'guitar', melody: 'flute' },
  density: 0.8,
  pulse: 70,
  drums: true,
  seed: 49,
};

/** The bright forest: enchanted, moving, lit. */
export const FOREST_A_VIBE: MusicSpec = {
  root: 220, // A3
  mode: 'lydian',
  palette: { drone: 'strings', texture: 'pluck', melody: 'flute' },
  density: 0.6,
  pulse: 58,
  seed: 50,
};

/** The deep forest: dark, still, no pulse — the other end of the same axis. */
export const FOREST_B_VIBE: MusicSpec = {
  root: 82.41, // E2
  mode: 'dorian',
  palette: { drone: 'choir', texture: 'strings', melody: 'bells' },
  density: 0.35,
  pulse: null,
  seed: 51,
};

/** The walked path: purposeful, folk-footed, in its forest's key family. */
export const FOREST_PATH_A_VIBE: MusicSpec = {
  root: 196, // G3
  mode: 'pentatonic-major',
  palette: { drone: 'bass', texture: 'guitar', melody: 'pluck' },
  density: 0.55,
  pulse: 68,
  drums: true,
  seed: 52,
};

/** The overgrown path: hesitant, pulse-free, mostly drone. */
export const FOREST_PATH_B_VIBE: MusicSpec = {
  root: 164.81, // E3
  mode: 'pentatonic-minor',
  palette: { drone: 'flute', texture: 'strings', melody: 'pluck' },
  density: 0.25,
  pulse: null,
  seed: 53,
};

export const RIVERSIDE_VIBE: MusicSpec = {
  root: 146.83, // D3
  mode: 'dorian',
  palette: { drone: 'strings', texture: 'pluck', melody: 'bells' },
  density: 0.5,
  pulse: 56,
  seed: 54,
};

export const CAVE_VIBE: MusicSpec = {
  root: 110, // A2
  mode: 'phrygian',
  palette: { drone: 'choir', texture: 'bass', melody: 'bells' },
  density: 0.2,
  pulse: null,
  seed: 55,
};

/** The book by name, for the dev panel. */
export const VIBES: Record<string, MusicSpec> = {
  village: VILLAGE_VIBE,
  'village interior': VILLAGE_INTERIOR_VIBE,
  farm: FARM_VIBE,
  'forest a': FOREST_A_VIBE,
  'forest b': FOREST_B_VIBE,
  'forest path a': FOREST_PATH_A_VIBE,
  'forest path b': FOREST_PATH_B_VIBE,
  riverside: RIVERSIDE_VIBE,
  cave: CAVE_VIBE,
};
