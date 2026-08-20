/**
 * Where things go: the mouth shape of every vowel, the geometry of every
 * place, and how wide a channel each consonant leaves.
 *
 * These are positions, not frequencies. The formant tables in `dsp/formant`
 * were the reference they were tuned against, and after that it is the tube's
 * business what comes out.
 */

import type { Consonant, Place, Vowel } from '../speech';
import type { Track } from './body';

/**
 * A mouth shape: how far the jaw is down, where along the tract the tongue
 * humps and how tight it is, how far the lips are open, and — for the few
 * vowels that need it — where the tip sits.
 */
export interface Shape {
  jaw: number;
  bodyPos: number;
  bodyDia: number;
  lips: number;
  tip?: number;
}

/**
 * **No posture that is held may go below this**, tongue or lips.
 *
 * The worklet makes turbulence wherever the tube is narrower than `HISS_AT`
 * (0.45), and it is right to: that is what a fricative is. But a rounded lip
 * and a humped tongue are nowhere near that tight in a real mouth, so a vowel
 * target under it comes out as a vowel with a hiss laid over it. Only the
 * fricatives, a liquid, and a stop passing through on its way open may cross.
 */
export const NO_HISS = 0.55;
/**
 * A liquid's gap. Under the hiss threshold, on purpose: an `l` is a closed
 * midline with the air going round the sides, and a wider gap is not heard
 * as anything. What noise this makes is a whisper under a full voice.
 */
export const LIQUID = 0.36;
/** A fricative's gap, and the wider one a lateral hiss is forced through. */
export const FRIC = 0.16;
export const LATERAL = 0.26;

/** Where the tongue tip sits for a vowel: out of the way. */
export const TIP_OPEN = 1.5;
/** Track values for the tongue body, back to front. */
export const PHARYNX = 0;
export const UVULA = 0.2;
export const VELAR = 0.34;
export const PALATE = 0.85;

export const SHAPES: Record<Vowel, Shape> = {
  // Open jaw, tongue back and low: a narrow pharynx under a wide mouth.
  a: { jaw: 0.95, bodyPos: 0.12, bodyDia: 0.62, lips: 1.4 },
  e: { jaw: 0.55, bodyPos: 0.72, bodyDia: 1.0, lips: 1.35 },
  i: { jaw: 0.22, bodyPos: 0.92, bodyDia: NO_HISS, lips: 1.45 },
  o: { jaw: 0.58, bodyPos: 0.24, bodyDia: 0.85, lips: 0.7 },
  u: { jaw: 0.24, bodyPos: 0.3, bodyDia: 0.6, lips: NO_HISS },
  'ə': { jaw: 0.45, bodyPos: 0.55, bodyDia: 1.15, lips: 1.1 },
  // The far side of the chart: an i with the lips rounded, a u with them
  // spread, and the ones between.
  'ü': { jaw: 0.22, bodyPos: 0.92, bodyDia: NO_HISS, lips: 0.62 },
  'ɯ': { jaw: 0.24, bodyPos: 0.3, bodyDia: 0.6, lips: 1.4 },
  'ø': { jaw: 0.5, bodyPos: 0.72, bodyDia: 1.0, lips: 0.68 },
  'æ': { jaw: 0.8, bodyPos: 0.7, bodyDia: 0.85, lips: 1.4 },
  'ɑ': { jaw: 0.9, bodyPos: 0.04, bodyDia: NO_HISS, lips: 1.3 },
  'ɨ': { jaw: 0.25, bodyPos: 0.6, bodyDia: NO_HISS, lips: 1.4 },
  'ɤ': { jaw: 0.55, bodyPos: 0.24, bodyDia: 0.85, lips: 1.35 },
  // The half-open row and the middle of the chart: the jaw does most of the
  // work between e and ɛ, the lips between ɛ and œ.
  'ɛ': { jaw: 0.68, bodyPos: 0.7, bodyDia: 0.9, lips: 1.38 },
  'œ': { jaw: 0.66, bodyPos: 0.7, bodyDia: 0.9, lips: 0.66 },
  'ɔ': { jaw: 0.72, bodyPos: 0.18, bodyDia: 0.75, lips: 0.66 },
  'ʌ': { jaw: 0.72, bodyPos: 0.18, bodyDia: 0.75, lips: 1.32 },
  'ɪ': { jaw: 0.34, bodyPos: 0.85, bodyDia: 0.72, lips: 1.42 },
  'ʊ': { jaw: 0.36, bodyPos: 0.32, bodyDia: 0.72, lips: 0.6 },
  'ɐ': { jaw: 0.82, bodyPos: 0.45, bodyDia: 0.95, lips: 1.25 },
  'ɜ': { jaw: 0.6, bodyPos: 0.5, bodyDia: 1.05, lips: 1.2 },
  'ɵ': { jaw: 0.42, bodyPos: 0.55, bodyDia: 1.0, lips: 0.66 },
  'ʉ': { jaw: 0.24, bodyPos: 0.6, bodyDia: NO_HISS, lips: 0.6 },
  'ɒ': { jaw: 0.9, bodyPos: 0.06, bodyDia: NO_HISS, lips: 0.72 },
  'ɶ': { jaw: 0.85, bodyPos: 0.68, bodyDia: 0.85, lips: 0.66 },
  // The one vowel with a tip of its own: curled up, but well clear of the
  // gap that would make it hiss.
  'ɚ': { jaw: 0.45, bodyPos: 0.5, bodyDia: 0.9, lips: 0.95, tip: 0.6 },
};

/** How long a closure is held, by where it is made. Lips take the longest. */
export const CLOSURE: Record<Place, number> = {
  lip: 0.075, ridge: 0.058, palate: 0.056, back: 0.055, uvula: 0.055, throat: 0.055, glottis: 0.05,
};

/** A trill's beat, by what is trilling. Lips are heavier than the tip. */
export const TRILL_PERIOD: Record<Place, number> = {
  lip: 0.045, ridge: 0.036, palate: 0.038, back: 0.038, uvula: 0.038, throat: 0.038, glottis: 0.038,
};
export const TRILL_BEATS = 3;

/** Whether the tongue body is what shuts the tube at this place. */
export function inBody(place: Place): boolean {
  return place === 'palate' || place === 'back' || place === 'uvula' || place === 'throat';
}

/** Where the tongue body sits for a constriction at `place`. */
export function bodyAt(place: Place): number {
  return place === 'throat' ? PHARYNX : place === 'uvula' ? UVULA : place === 'palate' ? PALATE : VELAR;
}

/** The articulator that closes at `place`, and where it goes when it lets go. */
export function closer(place: Place, vowel: Shape): { track: Track; open: number } {
  if (place === 'lip') return { track: 'lips', open: vowel.lips };
  if (place === 'ridge') return { track: 'tip', open: vowel.tip ?? TIP_OPEN };
  return { track: 'bodyDia', open: vowel.bodyDia };
}

/**
 * The channel a continuant leaves open: which track makes it, how wide, and
 * where everything else stands while it does. `null` means the vowel's own.
 */
export interface Gap {
  track: Track;
  gap: number;
  jaw: number;
  bodyPos: number | null;
  bodyDia: number | null;
  lips: number | null;
}

/**
 * A fricative's channel. At the ridge the tip is at one fixed place, so the
 * sibilants are told apart by how wide the gap is, where the body sits behind
 * it and what the lips do — not by moving the tip.
 */
export function fricGap(c: Consonant): Gap {
  const g = channel(c);
  // The folds damp the flow, so the same gap voiced is the quieter of the
  // two. A voiced fricative is given a slightly wider one to hiss through.
  return c.voice === 'off' ? g : { ...g, gap: g.gap * 1.15 };
}

/** The tip's channels at the ridge, and the plain gap everywhere else. */
function channel(c: Consonant): Gap {
  if (c.manner === 'lateralFricative') {
    return { track: 'tip', gap: LATERAL, jaw: 0.25, bodyPos: 0.7, bodyDia: 1.0, lips: null };
  }
  if (c.place === 'ridge') {
    const ridge = { track: 'tip' as Track, jaw: 0.22, bodyPos: 0.75, bodyDia: 1.0, lips: null };
    // A palatalised sibilant *is* the alveolopalatal channel — the body cannot
    // be at the palate and behind the tip at once, so the colour picks a shade.
    switch (c.shade ?? (c.colour === 'palatal' ? 'alveolopalatal' : 'plain')) {
      case 'hush':
        // Wide and rounded: the front cavity is longer, so it sits lower.
        return { ...ridge, gap: 0.22, lips: 0.85 };
      case 'retroflex':
        // The body drops back behind the tip, which is the whole difference.
        return { ...ridge, gap: 0.2, bodyPos: 0.55 };
      case 'alveolopalatal':
        return { ...ridge, gap: 0.16, bodyPos: 0.9, lips: 1.4 };
      case 'dental':
        // Blunt and weak: a wide gap under an open jaw makes no whistle.
        return { ...ridge, gap: 0.3, jaw: 0.35 };
      default:
        return { ...ridge, gap: 0.13 };
    }
  }
  if (c.place === 'lip') {
    return { track: 'lips', gap: FRIC, jaw: 0.22, bodyPos: null, bodyDia: null, lips: null };
  }
  return { track: 'bodyDia', gap: FRIC, jaw: 0.22, bodyPos: bodyAt(c.place), bodyDia: null, lips: null };
}

/**
 * A liquid's channel: an `l`, a `w`, a `j`. As tight as the tube allows
 * without noise, which is what a liquid is.
 */
export function liquidGap(c: Consonant, vowel: Shape): Gap {
  const { track } = closer(c.place, vowel);
  return {
    track,
    gap: c.place === 'throat' ? 0.3 : LIQUID,
    jaw: Math.min(vowel.jaw, 0.4),
    bodyPos: inBody(c.place) ? bodyAt(c.place) : null,
    bodyDia: null,
    lips: null,
  };
}
