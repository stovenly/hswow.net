import type { MusicSpec } from './director';

/**
 * The vibe book — one spec per kind of place, built on three findings.
 * Settlements pulse and wilderness floats, and a felt pulse with drums is the
 * strongest lever the table has for human presence. The mode is the character.
 * And an interior is usually a *reduction* of its outside — same root, same
 * mode, same seed, thinner arrangement — so stepping indoors is the same music
 * heard through walls rather than a different track.
 *
 * The villages are the exception: their interiors are rooms, a hearth or a
 * shop counter, so they carry their own roots, modes and seeds and stand to
 * the villages the way the forest paths stand to the forests.
 *
 * Rack identity is spec identity: a zone must declare one of these constants
 * and not a copy of its fields, so every zone with the same vibe shares one
 * rack and the border crossfade works. These names are working labels.
 *
 * The roots are spread across a ladder rather than crowded into one octave,
 * and each vibe's strata are placed to own a band:
 *
 *   cave        A1   55  — everything below 250, thought nearly stopped
 *   forest b    E2   82  — dark floor, high glints, the widest spread
 *   village 1   C3  131  — the mid reference, texture above, flute on top
 *   riverside   D3  147  — mid, bells as light off the surface
 *   village 2   D#3 156  — the market: strata close, the fastest pulse here
 *   path b      E3  165  — compact, low, woody
 *   farm        F3  175  — guitar at the root, trumpet across the field
 *   path a      G3  196  — compact and humble, a walking band
 *   interior 2  A#3 233  — the shop, small and lit
 *   interior 1  C4  262  — the hearth room, the warmest thing in the book
 *   forest a    D4  294  — the high vibe, everything lit
 */

/**
 * The village at evening: settled rather than trading, and the wide one.
 * Everything the market does close and quick, this does spread and slow — the
 * strata two octaves apart, chords held for two bars, a pulse under it but no
 * kit, because one village having the drums is the clearest thing that tells
 * them apart from the far side of a fence.
 */
export const VILLAGE_1_VIBE: MusicSpec = {
  root: 130.81, // C3
  mode: 'mixolydian',
  palette: {
    drone: 'strings',
    texture: 'dulcimer',
    melody: 'flute',
    altTexture: 'harp',
    // Someone in the lane, going home.
    altMelody: 'whistler',
  },
  character: {
    textureOctave: 12,
    melodyOctave: 24,
    gait: ['dotted', 'lilt'],
    chordBars: 2,
    phraseRest: [11, 22],
    fragment: 0.3,
    level: 1,
    droneLevel: 1,
  },
  density: 0.8,
  pulse: [52, 62],
  seed: 48,
};

/** The market village: the fastest pulse in the book, and the band is in the square. */
export const VILLAGE_2_VIBE: MusicSpec = {
  root: 155.56, // D#3
  mode: 'ionian',
  palette: {
    // The squeezebox in the square — the interiors gave it up for this.
    drone: 'accordion',
    texture: 'banjo',
    melody: 'fiddle',
    altTexture: 'dulcimer',
    altMelody: 'trumpet',
  },
  character: {
    // Close strata: a band standing together, not a village across a valley.
    textureOctave: 0,
    melodyOctave: 12,
    gait: ['snap', 'short-short-long'],
    chordBars: 1,
    phraseRest: [9, 18],
    fragment: 0.1,
    // A band in a square states a tune and works it, rather than asking and
    // answering. The sentence goes where a pulse meets a chord a bar and a
    // tune that is rarely a fragment; five vibes qualify. Flip it back here.
    phrase: 'sentence',
    level: 1,
    droneLevel: 1,
  },
  density: 0.9,
  pulse: [72, 86],
  drums: true,
  seed: 66,
};

/**
 * The hearth room: someone's home, with someone humming in the next one. A
 * room rather than the village heard through its wall — its own root at the
 * top of the ladder, its own five notes, its own tunes. High roots want their
 * strata close, the way the beach settles them.
 */
export const VILLAGE_INTERIOR_1_VIBE: MusicSpec = {
  root: 261.63, // C4
  mode: 'pentatonic-major',
  palette: {
    drone: 'choir',
    texture: 'guitar',
    melody: 'kalimba',
    altTexture: 'harp',
    altMelody: 'ocarina',
  },
  character: {
    textureOctave: 0,
    melodyOctave: 12,
    gait: ['even', 'lilt'],
    chordBars: 2,
    phraseRest: [10, 20],
    fragment: 0.4,
    // Furniture music arrives at furniture volume.
    level: 0.6,
    droneLevel: 1,
  },
  density: 0.75,
  pulse: [46, 54],
  seed: 67,
};

/** The little shop: clockwork and a counter, lit and slightly wrong. */
export const VILLAGE_INTERIOR_2_VIBE: MusicSpec = {
  root: 233.08, // A#3
  mode: 'lydian',
  palette: {
    // A shop harmonium, nothing like the same stop three octaves down a cave.
    drone: 'organ',
    texture: 'musicbox',
    melody: 'pluck',
    altTexture: 'marimba',
    // The bell over the door.
    altMelody: 'chimes',
  },
  character: {
    textureOctave: 0,
    melodyOctave: 12,
    gait: ['even', 'dotted'],
    chordBars: 2,
    phraseRest: [10, 20],
    fragment: 0.35,
    level: 0.65,
    // An organ this high cuts before it measures.
    droneLevel: 0.8,
  },
  density: 0.75,
  pulse: [48, 56],
  seed: 68,
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
    phrase: 'sentence',
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
    // Two, now that a breath bar is six and a half seconds rather than ten:
    // this is a slower chord than the vibe asked for before and still moves
    // more often, and the continuation halves it back to one.
    chordBars: 2,
    phraseRest: [10, 20],
    fragment: 0.5,
    form: 'speac',
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
    phrase: 'sentence',
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
    chordBars: 2,
    phraseRest: [11, 20],
    fragment: 0.6,
    form: 'speac',
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
    // Two breath bars a chord: glacial, and deliberately so.
    chordBars: 2,
    phraseRest: [12, 21],
    fragment: 0.8,
    form: 'speac',
    level: 1,
    droneLevel: 1,
  },
  density: 0.7,
  pulse: null,
  seed: 55,
};

/**
 * The underground, the industrial park and a cold coast.
 *
 * Three rules run through all eleven. The industrial places have loud
 * machinery over them, so their music vacates the low-mid the clatter owns —
 * drone underneath, glints well above, a thin middle — and sits at 0.85-0.9,
 * behind the world rather than over it. Machines march: those vibes take
 * `even` alone, or even against short-short-long, and hold their chords for
 * bars, while every folk gait stays in the pastoral half of the book. And the
 * caves, sewers and scrapyard are weather, so they have no pulse at all; the
 * three powered places keep time, and only factory 2 has a kit.
 *
 * Both coast vibes keep time too — the swell does, not a band — and neither
 * has a kit.
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
 *   beach        A3  220 — the swell keeps the time, and there is no kit
 *   beach path   A3  220 — the same water, walked past rather than sat at
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
    phraseRest: [13, 21],
    fragment: 0.85,
    // Nothing that is weather expects a verse and a chorus: every pulse-free
    // vibe takes its form from its own seed. Flip it back here.
    form: 'speac',
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
    phraseRest: [12, 21],
    fragment: 0.75,
    form: 'speac',
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
    chordBars: 2,
    phraseRest: [12, 21],
    fragment: 0.6,
    form: 'speac',
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
    phraseRest: [12, 21],
    fragment: 0.7,
    form: 'speac',
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
    phraseRest: [11, 20],
    fragment: 0.45,
    form: 'speac',
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
    // The one powered place that takes the weather's form: it hums, it clicks
    // and it never phrases, so a verse and a chorus were never right for it.
    form: 'speac',
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
    phraseRest: [11, 20],
    fragment: 0.5,
    form: 'speac',
    // The industrial voices read quiet; lifted against the farm.
    level: 1.1,
    droneLevel: 0.75,
  },
  density: 0.75,
  pulse: null,
  seed: 64,
};

/**
 * A cold Atlantic, with the sea moving in it.
 *
 * The swell keeps time here: a felt pulse and no kit is motion, not people.
 * Everything follows from that — the chord moves every bar, the rests are
 * short and the density leans them shorter, and the texture is a voice that
 * sustains rather than one that decays into the gap. A shore rooted this high
 * with no low end has nothing to fill a breath bar with.
 */
export const BEACH_VIBE: MusicSpec = {
  root: 220, // A3
  mode: 'aeolian',
  palette: {
    // One cold bow on the shore.
    drone: 'viol',
    texture: 'harp',
    melody: 'vibraphone',
    // The shimmer is the alternate now, not the thing carrying the bar.
    altTexture: 'glass',
    // Someone at the cold shore.
    altMelody: 'harmonica',
  },
  character: {
    textureOctave: 0,
    melodyOctave: 12,
    gait: ['even', 'lilt'],
    chordBars: 1,
    phraseRest: [7, 13],
    fragment: 0.2,
    phrase: 'sentence',
    level: 1,
    // A bowed drone at this height cuts before it measures.
    droneLevel: 0.85,
  },
  density: 0.9,
  pulse: [50, 60],
  seed: 69,
};

/** The shore path: the same water and the same bow, walked past rather than sat at. */
export const BEACH_PATH_VIBE: MusicSpec = {
  root: 220, // A3
  mode: 'aeolian',
  palette: {
    // The same bow, heard through trees.
    drone: 'viol',
    // Wood for the water's harp.
    texture: 'marimba',
    // Someone walking the shore path, whistling.
    melody: 'whistler',
    altTexture: 'kalimba',
    altMelody: 'ocarina',
  },
  character: {
    textureOctave: 0,
    melodyOctave: 12,
    gait: ['lilt', 'even'],
    chordBars: 1,
    phraseRest: [8, 15],
    fragment: 0.25,
    phrase: 'sentence',
    // A step back from the water.
    level: 0.9,
    droneLevel: 0.85,
  },
  density: 0.85,
  pulse: [56, 66],
  seed: 69,
};

/**
 * The open grassland: wide, warm, and pulse-free — the horizon is the only
 * thing moving. Strata two octaves apart, a long-held chord, and a tune that
 * mostly does not finish.
 */
export const PLAINS_1_VIBE: MusicSpec = {
  root: 138.59, // C#3
  mode: 'pentatonic-major',
  palette: {
    drone: 'strings',
    texture: 'harp',
    melody: 'flute',
    altTexture: 'guitar',
    altMelody: 'ocarina',
  },
  character: {
    textureOctave: 12,
    melodyOctave: 24,
    gait: [],
    chordBars: 3,
    phraseRest: [12, 24],
    fragment: 0.45,
    form: 'speac',
    level: 1,
    droneLevel: 1,
  },
  density: 0.7,
  pulse: null,
  seed: 70,
};

/** The moor: the same emptiness, colder. A bow on the wind and a fiddle far off. */
export const PLAINS_2_VIBE: MusicSpec = {
  root: 207.65, // G#3
  mode: 'kumoi',
  palette: {
    drone: 'viol',
    texture: 'dulcimer',
    melody: 'fiddle',
    altTexture: 'harp',
    altMelody: 'flute',
  },
  character: {
    textureOctave: 0,
    melodyOctave: 12,
    gait: [],
    chordBars: 2,
    phraseRest: [14, 26],
    fragment: 0.5,
    form: 'speac',
    level: 0.95,
    droneLevel: 0.85,
  },
  density: 0.6,
  pulse: null,
  seed: 71,
};
