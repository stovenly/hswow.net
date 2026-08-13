import type { MusicSpec } from './director';

/**
 * The vibe book — the nine place compositions of SPEC Phase 6e, and the
 * eleven of Phase 6i below them.
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
 *
 * Phase 6h gave every vibe a `character` — register, gait, harmonic pace,
 * phrase habit, level — and then the roots themselves were spread, because
 * nine vibes rooted inside a single octave sounded like nine transpositions
 * however the behaviour differed. The ladder now runs from the cave's A1 to
 * the bright forest's D4, and each vibe's strata are placed to own a band:
 *
 *   cave        A1   55  — everything below 250, thought nearly stopped
 *   forest b    E2   82  — dark floor, high glints, the widest spread
 *   village     C3  131  — the mid reference, texture above, flute on top
 *   interior    C3  131  — same root as the village (through the walls),
 *                          but inverted: music box above, flute below
 *   riverside   D3  147  — mid, bells as light off the surface
 *   path b      E3  165  — compact, low, woody
 *   farm        F3  175  — guitar at the root, trumpet across the field
 *   path a      G3  196  — compact and humble, a walking band
 *   forest a    D4  294  — the high vibe, everything lit
 */

export const VILLAGE_VIBE: MusicSpec = {
  root: 130.81, // C3
  mode: 'mixolydian',
  palette: {
    drone: 'strings',
    texture: 'dulcimer',
    melody: 'flute',
    altTexture: 'guitar',
    // The evening fiddler.
    altMelody: 'fiddle',
  },
  character: {
    textureOctave: 12,
    melodyOctave: 24,
    gait: ['dotted', 'snap'],
    chordBars: 1,
    phraseRest: [10, 20],
    fragment: 0.15,
    level: 1,
    droneLevel: 1,
  },
  density: 0.9,
  pulse: [60, 72],
  drums: true,
  seed: 48,
};

/** The village heard from indoors: same seed, thinner, no kit — furniture music. */
export const VILLAGE_INTERIOR_VIBE: MusicSpec = {
  root: 130.81, // C3
  mode: 'mixolydian',
  palette: {
    drone: 'accordion',
    texture: 'musicbox',
    melody: 'flute',
    altTexture: 'harp',
    altMelody: 'musicbox',
  },
  character: {
    // Inverted on purpose: the box glints above, the flute speaks below it.
    textureOctave: 24,
    melodyOctave: 12,
    gait: ['even', 'dotted'],
    chordBars: 2,
    phraseRest: [12, 22],
    fragment: 0.35,
    // Furniture music arrives at furniture volume.
    level: 0.6,
    droneLevel: 1,
  },
  density: 0.75,
  pulse: [50, 58],
  seed: 48,
};

/** The working band: the guitar strums at the root, the trumpet carries far. */
export const FARM_VIBE: MusicSpec = {
  root: 174.61, // F3
  mode: 'ionian',
  palette: {
    // The working crank; the accordion is the interior's alone now.
    drone: 'gurdy',
    texture: 'guitar',
    melody: 'trumpet',
    // The barn dance's rhythm hand.
    altTexture: 'banjo',
    // The barn dance, when the texture flips.
    altMelody: 'fiddle',
  },
  character: {
    textureOctave: 0,
    melodyOctave: 24,
    // The barn dance owns the crooked number too.
    gait: ['even', 'short-short-long', 'aksak'],
    chordBars: 1,
    phraseRest: [10, 20],
    fragment: 0.1,
    level: 1,
    droneLevel: 1,
  },
  density: 0.85,
  pulse: [64, 78],
  drums: true,
  seed: 49,
};

/** The bright forest: rooted a fourth above everything else — the high vibe. */
export const FOREST_A_VIBE: MusicSpec = {
  root: 293.66, // D4
  mode: 'lydian',
  palette: {
    drone: 'strings',
    texture: 'harp',
    melody: 'ocarina',
    altTexture: 'dulcimer',
    altMelody: 'chimes',
  },
  character: {
    textureOctave: 12,
    melodyOctave: 24,
    gait: ['lilt', 'even'],
    chordBars: 2,
    phraseRest: [11, 22],
    fragment: 0.2,
    level: 1,
    droneLevel: 1,
  },
  density: 0.8,
  pulse: [54, 63],
  seed: 50,
};

/** The deep forest: a dark floor with high glints — the widest spread in the book. */
export const FOREST_B_VIBE: MusicSpec = {
  root: 82.41, // E2
  mode: 'dorian',
  palette: {
    drone: 'choir',
    texture: 'strings',
    melody: 'chimes',
    altTexture: 'tonguedrum',
    altMelody: 'musicbox',
  },
  character: {
    textureOctave: 12,
    melodyOctave: 24,
    gait: [],
    // Breath bars are long already; one per chord, or the pad turns to stone.
    chordBars: 1,
    phraseRest: [12, 24],
    fragment: 0.5,
    level: 1,
    droneLevel: 1,
  },
  density: 0.75,
  pulse: null,
  seed: 51,
};

/** The walked path: folk-footed, low and humble, the kalimba as the thumb tune. */
export const FOREST_PATH_A_VIBE: MusicSpec = {
  root: 196, // G3
  mode: 'pentatonic-major',
  palette: {
    // The walking drone.
    drone: 'gurdy',
    // The walking band's strum, sharpened.
    texture: 'banjo',
    melody: 'kalimba',
    altTexture: 'marimba',
    // The walker's pocket.
    altMelody: 'harmonica',
  },
  character: {
    textureOctave: 0,
    melodyOctave: 12,
    // The walking band walks with a limp some days.
    gait: ['lilt', 'crooked'],
    chordBars: 1,
    phraseRest: [10, 20],
    fragment: 0.2,
    level: 1,
    // Tuned when the bass held this seat; re-hear against the crank.
    droneLevel: 0.65,
  },
  density: 0.8,
  pulse: [62, 74],
  drums: true,
  seed: 52,
};

/** The overgrown path: hesitant, pulse-free, woody and low. */
export const FOREST_PATH_B_VIBE: MusicSpec = {
  root: 164.81, // E3
  mode: 'pentatonic-minor',
  palette: {
    drone: 'flute',
    texture: 'marimba',
    melody: 'harp',
    altTexture: 'kalimba',
    // The idle walker's twang.
    altMelody: 'jawharp',
  },
  character: {
    textureOctave: 0,
    melodyOctave: 12,
    gait: [],
    chordBars: 1,
    phraseRest: [13, 24],
    fragment: 0.6,
    level: 1,
    // A pure held flute cuts harder than it measures.
    droneLevel: 0.6,
  },
  density: 0.75,
  pulse: null,
  seed: 53,
};

/** Water on metal: the tongue drum ripples, bells as light on the surface. */
export const RIVERSIDE_VIBE: MusicSpec = {
  root: 146.83, // D3
  mode: 'dorian',
  palette: {
    // One bow by the water.
    drone: 'viol',
    texture: 'tonguedrum',
    melody: 'bells',
    altTexture: 'harp',
    // Someone by the water.
    altMelody: 'whistler',
  },
  character: {
    textureOctave: 12,
    melodyOctave: 24,
    gait: ['even', 'lilt'],
    chordBars: 2,
    phraseRest: [11, 22],
    fragment: 0.3,
    level: 1,
    // Tuned against the section; re-hear against one bow.
    droneLevel: 1,
  },
  density: 0.8,
  pulse: [52, 60],
  seed: 54,
};

/** Full dungeon: rooted at the very floor of the book, nothing above 250. */
export const CAVE_VIBE: MusicSpec = {
  root: 55, // A1
  mode: 'phrygian',
  palette: {
    drone: 'organ',
    texture: 'bass',
    melody: 'bells',
    // Struck far off, felt more than heard.
    altTexture: 'deepdrum',
    altMelody: 'chimes',
  },
  character: {
    textureOctave: 12,
    melodyOctave: 24,
    gait: [],
    // Two breath bars a chord — glacial, but no longer geological.
    chordBars: 2,
    phraseRest: [14, 24],
    fragment: 0.8,
    level: 1,
    droneLevel: 1,
  },
  density: 0.7,
  pulse: null,
  seed: 55,
};

/**
 * Phase 6i — the underground, the industrial park and a cold coast.
 *
 * Three rules run through all eleven. The industrial places will have loud
 * machinery over them, so their music vacates the low-mid the clatter owns —
 * drone underneath, glints well above, a thin middle — and sits at 0.85–0.9,
 * behind the world rather than over it. Machines march: those vibes take
 * `even` alone, or even against short-short-long, and hold their chords for
 * bars, while every folk gait stays in the pastoral half of the book. And the
 * caves, sewers, scrapyard and coast are weather, so they have no pulse at
 * all; only the three powered places keep time, and only factory 2 has a kit.
 *
 * The roots continue the ladder below the settlements, and the coast takes the
 * one gap above them:
 *
 *   cave dark    G1   49 — under the cave, in a mode with a leading tone
 *   sewer 2      B1   62 — low and close, everything within an octave
 *   sewer 1      C2   65 — the pipe with light down it
 *   factory 2    D2   73 — the loud room: the only kit in the eleven
 *   cave 2       F2   87 — five notes, two chords, monks
 *   factory 1    G2   98 — drone under the plant, chimes far above it
 *   scrapyard    A2  110 — one detuned guitar over the junk
 *   substation 1 B2  124 — the maze that hums
 *   substation 2 F#3 185 — the whine, not the buzz
 *   beach        A3  220 — all sky, no bottom
 *   beach path   A3  220 — the same music, heard through trees
 */

/** Deeper than the cave and worse: the one mode in the book with a leading tone. */
export const CAVE_DARK_VIBE: MusicSpec = {
  root: 49, // G1
  mode: 'harmonic-minor',
  palette: {
    drone: 'organ',
    texture: 'glass',
    // Bells said shrine; a glide in harmonic minor says something is down
    // there singing.
    melody: 'saw',
    altTexture: 'pipe',
    // Something bowed answers the saw.
    altMelody: 'waterphone',
  },
  character: {
    textureOctave: 12,
    melodyOctave: 24,
    gait: [],
    chordBars: 2,
    phraseRest: [15, 24],
    fragment: 0.85,
    level: 1,
    droneLevel: 1,
  },
  density: 0.7,
  pulse: null,
  seed: 56,
};

/** The maintenance side: low, close, everything inside one octave. */
export const SEWER_2_VIBE: MusicSpec = {
  root: 61.74, // B1
  mode: 'phrygian',
  palette: {
    drone: 'bass',
    texture: 'oildrum',
    melody: 'pipe',
    altTexture: 'anvil',
    // Someone lives down here.
    altMelody: 'harmonica',
  },
  character: {
    textureOctave: 12,
    melodyOctave: 12,
    gait: [],
    chordBars: 2,
    phraseRest: [14, 24],
    fragment: 0.75,
    level: 1,
    droneLevel: 1,
  },
  density: 0.7,
  pulse: null,
  seed: 57,
};

/** Inside the pipe: a blown drone the length of it, glass and light above. */
export const SEWER_1_VIBE: MusicSpec = {
  root: 65.41, // C2
  mode: 'aeolian',
  palette: {
    drone: 'pipe',
    texture: 'glass',
    melody: 'bells',
    altTexture: 'oildrum',
    // Water on metal, bowed.
    altMelody: 'waterphone',
  },
  character: {
    textureOctave: 12,
    melodyOctave: 24,
    gait: [],
    chordBars: 1,
    phraseRest: [14, 24],
    fragment: 0.6,
    level: 1,
    // A held pipe down a pipe is already the loudest thing here.
    droneLevel: 0.7,
  },
  density: 0.72,
  pulse: null,
  seed: 58,
};

/** The loud room: the plant keeps the time, and the flat fifth is the grind. */
export const FACTORY_2_VIBE: MusicSpec = {
  root: 73.42, // D2
  mode: 'blues-hexatonic',
  palette: {
    drone: 'tuba',
    texture: 'anvil',
    melody: 'brass',
    altTexture: 'guitar',
    altMelody: 'trumpet',
  },
  character: {
    textureOctave: 24,
    melodyOctave: 24,
    // A hammer, not a dance.
    gait: ['even', 'short-short-long'],
    chordBars: 4,
    phraseRest: [12, 24],
    fragment: 0.15,
    // The industrial voices read quiet; lifted against the farm.
    level: 1.15,
    droneLevel: 1,
  },
  density: 0.8,
  pulse: [72, 84],
  drums: true,
  seed: 59,
};

/** Five notes and two chords, sung over: the cave that has been lived in. */
export const CAVE_2_VIBE: MusicSpec = {
  root: 87.31, // F2
  mode: 'hirajoshi',
  palette: {
    drone: 'monks',
    texture: 'glass',
    melody: 'vibraphone',
    // Monks over a ritual drum.
    altTexture: 'deepdrum',
    altMelody: 'chimes',
  },
  character: {
    textureOctave: 12,
    melodyOctave: 24,
    gait: [],
    chordBars: 2,
    phraseRest: [14, 24],
    fragment: 0.7,
    level: 1,
    droneLevel: 1,
  },
  density: 0.7,
  pulse: null,
  seed: 60,
};

/** The plant floor: a hum under the clatter and chimes three octaves over it. */
export const FACTORY_1_VIBE: MusicSpec = {
  root: 98, // G2
  mode: 'phrygian-dominant',
  palette: {
    drone: 'hum',
    texture: 'anvil',
    melody: 'chimes',
    altTexture: 'oildrum',
    altMelody: 'vibraphone',
  },
  character: {
    textureOctave: 24,
    // Far above the band the machines will own.
    melodyOctave: 36,
    gait: ['even'],
    chordBars: 3,
    phraseRest: [12, 24],
    fragment: 0.2,
    // The industrial voices read quiet; lifted against the farm.
    level: 1.15,
    droneLevel: 1,
  },
  density: 0.78,
  pulse: [46, 54],
  seed: 61,
};

/** Mountains of it: junk metal underfoot, one detuned guitar over the heap. */
export const SCRAPYARD_VIBE: MusicSpec = {
  root: 110, // A2
  mode: 'blues-hexatonic',
  palette: {
    drone: 'bass',
    texture: 'anvil',
    melody: 'guitar',
    // Junk twang over the heap.
    altTexture: 'jawharp',
    // The literal one: a saw in the junk, played.
    altMelody: 'saw',
  },
  character: {
    textureOctave: 12,
    melodyOctave: 12,
    gait: [],
    chordBars: 2,
    phraseRest: [13, 24],
    fragment: 0.45,
    // The industrial voices read quiet; lifted against the farm.
    level: 1.1,
    droneLevel: 1,
  },
  density: 0.75,
  pulse: null,
  seed: 62,
};

/** The chainlink maze: it hums, it clicks, and it never phrases. */
export const SUBSTATION_1_VIBE: MusicSpec = {
  root: 123.47, // B2
  mode: 'aeolian',
  palette: {
    drone: 'hum',
    texture: 'anvil',
    melody: 'pluck',
    altTexture: 'oildrum',
    altMelody: 'vibraphone',
  },
  character: {
    textureOctave: 12,
    melodyOctave: 24,
    gait: ['even'],
    chordBars: 3,
    phraseRest: [12, 24],
    fragment: 0.25,
    // The industrial voices read quiet; lifted against the farm.
    level: 1.1,
    droneLevel: 1,
  },
  density: 0.78,
  pulse: [44, 52],
  seed: 63,
};

/** The whine, not the buzz: the same hum an octave and a half up, unpowered. */
export const SUBSTATION_2_VIBE: MusicSpec = {
  root: 185, // F#3
  mode: 'phrygian-dominant',
  palette: {
    drone: 'hum',
    texture: 'glass',
    melody: 'pluck',
    altTexture: 'anvil',
    // The whine's cousin.
    altMelody: 'saw',
  },
  character: {
    textureOctave: 0,
    melodyOctave: 12,
    gait: [],
    chordBars: 2,
    phraseRest: [13, 24],
    fragment: 0.5,
    // The industrial voices read quiet; lifted against the farm.
    level: 1.1,
    droneLevel: 0.75,
  },
  density: 0.75,
  pulse: null,
  seed: 64,
};

/** A cold Atlantic: a minor third with a major sixth, all sky and no bottom. */
export const BEACH_VIBE: MusicSpec = {
  root: 220, // A3
  mode: 'kumoi',
  palette: {
    // One cold bow on the shore.
    drone: 'viol',
    texture: 'glass',
    melody: 'vibraphone',
    altTexture: 'harp',
    // Someone at the cold shore.
    altMelody: 'harmonica',
  },
  character: {
    textureOctave: 0,
    melodyOctave: 12,
    // The shore is weather; it has no beat and no folk foot.
    gait: [],
    chordBars: 1,
    phraseRest: [9, 18],
    fragment: 0.35,
    level: 1,
    // Tuned against the section; re-hear against one bow.
    droneLevel: 1,
  },
  density: 0.8,
  pulse: null,
  seed: 65,
};

/** The beach through trees: same root, mode and seed, wood for glass. */
export const BEACH_PATH_VIBE: MusicSpec = {
  root: 220, // A3
  mode: 'kumoi',
  palette: {
    // The same bow, heard through trees.
    drone: 'viol',
    texture: 'pluck',
    // Someone walking the shore path, whistling.
    melody: 'whistler',
    altTexture: 'kalimba',
    altMelody: 'vibraphone',
  },
  character: {
    textureOctave: 0,
    melodyOctave: 12,
    gait: [],
    chordBars: 1,
    phraseRest: [12, 24],
    fragment: 0.5,
    level: 0.85,
    // Tuned against the section; re-hear against one bow.
    droneLevel: 1,
  },
  density: 0.75,
  pulse: null,
  seed: 65,
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
  'cave 2': CAVE_2_VIBE,
  'cave dark': CAVE_DARK_VIBE,
  'factory 1': FACTORY_1_VIBE,
  'factory 2': FACTORY_2_VIBE,
  'sewer 1': SEWER_1_VIBE,
  'sewer 2': SEWER_2_VIBE,
  scrapyard: SCRAPYARD_VIBE,
  'substation 1': SUBSTATION_1_VIBE,
  'substation 2': SUBSTATION_2_VIBE,
  beach: BEACH_VIBE,
  'beach path': BEACH_PATH_VIBE,
};
