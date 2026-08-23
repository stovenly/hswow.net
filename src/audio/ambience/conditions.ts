import type { Span, Window } from './spec';

/**
 * What the world is doing, sampled once per pump and handed to every gate —
 * two cast members must not disagree about what time it is.
 *
 * Filled in by the world, which owns the clock and the weather. Nothing under
 * `src/audio` reads `src/world`.
 */
export interface Conditions {
  /** Degrees above the horizon. Negative below it. */
  sun: number;
  /** Degrees the sun climbs per game minute at the horizon. Latitude's doing. */
  sunRate: number;
  /** Morning half of the day. Decides whether `wakes` applies. */
  rising: boolean;
  /** 0..1 with 0 at midnight. */
  timeOfDay: number;
  /** Whole game hours since midnight. Soundmarks strike on a change. */
  hour: number;
  /** 0..1 with 0 at midwinter. */
  season: number;
  /** Degrees C. */
  warmth: number;
  /** How much of the moon's disc is lit, 0..1. */
  moon: number;
  /** Falling now, 0..1 each. */
  rain: number;
  snow: number;
  fog: number;
  /** How hard it is thundering, 0..1. The cell, not the individual bolt. */
  storm: number;
  /** How wet and how snowed-over the ground is, 0..1. Both lag the weather. */
  wet: number;
  lying: number;
  /** Wind at the listener, 0..1. */
  wind: number;
  gust: number;
  /** Under a roof: everything outside is heard through a wall. */
  indoors: boolean;
  /** Fractional days since the world began. The axis slow fields run on. */
  elapsed: number;
}

/** A clear midsummer noon. What the director reads before the world speaks. */
export const CLEAR: Conditions = {
  sun: 50,
  sunRate: 0.15,
  rising: true,
  timeOfDay: 0.5,
  hour: 12,
  season: 0.5,
  warmth: 15,
  moon: 0,
  rain: 0,
  snow: 0,
  fog: 0,
  storm: 0,
  wet: 0,
  lying: 0,
  wind: 0.4,
  gust: 0.5,
  indoors: false,
  elapsed: 0,
};

function clamp01(value: number): number {
  return value < 0 ? 0 : value > 1 ? 1 : value;
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp01((x - edge0) / (edge1 - edge0 || 1e-6));
  return t * t * (3 - 2 * t);
}

/** Inside a span, falling off over `ease` at each end. */
function within(span: Span, value: number, ease: number): number {
  return Math.min(
    smoothstep(span[0] - ease, span[0], value),
    1 - smoothstep(span[1], span[1] + ease, value),
  );
}

/** The same, on a phase that wraps at 1. */
function withinPhase(span: Span, phase: number, ease: number): number {
  const [from, to] = span;
  if (from <= to) return within(span, phase, ease);
  return Math.max(within([from, 1 + to], phase, ease), within([from - 1, to], phase, ease));
}

/**
 * How wide a window stands open, 0..1 — a weight rather than a switch, so the
 * chorus builds through twilight instead of arriving all at once. Multiplied
 * into a source's rate, and a zero means it is not considered at all.
 */
export function openness(window: Window | undefined, now: Conditions): number {
  if (!window) return 1;
  let open = 1;

  if (window.sun) open *= within(window.sun, now.sun, 3);

  // Minutes before sunrise, turned into the elevation the sun has by then.
  // A song thrush at 47 minutes lands near civil twilight, which is where it
  // actually starts.
  if (window.wakes !== undefined) {
    const at = -window.wakes * now.sunRate * (now.rising ? 1 : -1);
    open *= now.rising
      ? smoothstep(at - 1.5, at + 1.5, now.sun)
      : smoothstep(at + 1.5, at - 1.5, now.sun);
  }

  if (window.season) open *= withinPhase(window.season, now.season, 0.06);
  if (window.shy !== undefined) open *= 1 - smoothstep(window.shy - 0.12, window.shy, now.wind);
  if (window.wind) open *= within(window.wind, now.wind, 0.1);
  if (window.rain) open *= within(window.rain, now.rain, 0.1);
  if (window.storm) open *= within(window.storm, now.storm, 0.1);
  if (window.fog) open *= within(window.fog, now.fog, 0.12);
  if (window.warmth) open *= within(window.warmth, now.warmth, 2.5);
  if (window.moon !== undefined) open *= smoothstep(window.moon - 0.2, window.moon, now.moon);
  if (window.under) open *= (window.under === 'roof') === now.indoors ? 1 : 0;

  // Wet ground and nothing falling: eaves, gutters, and a wood that has just
  // been rained on. `wet` lags the weather, so this outlives the shower.
  if (window.after === 'rain') open *= now.wet * (1 - smoothstep(0.02, 0.12, now.rain));
  if (window.after === 'snow') open *= now.lying * (1 - smoothstep(0.02, 0.12, now.snow));
  if (window.after === 'storm') open *= now.wet * (1 - smoothstep(0.02, 0.12, now.storm));

  return clamp01(open);
}

/** 1 once the sun is properly down. What the night cast is scaled by. */
export function night(now: Conditions): number {
  return 1 - smoothstep(-6, 2, now.sun);
}

/** How much the weather is taking off the top of everything alive. */
export function weatherDamp(now: Conditions): number {
  const falling = Math.max(now.rain, now.snow);
  return (1 - smoothstep(0.05, 0.55, falling)) * (1 - smoothstep(0.6, 1, now.wind) * 0.5);
}
