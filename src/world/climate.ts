import * as THREE from 'three';
import { hash, valueNoise, type Weather } from '../audio/weather';
import type { ParticleSpec } from '../art/particles';
import type { SurfaceName } from '../audio/models/footsteps';
import type { RainSurface } from '../audio/models/rain';
import { DECK_LEVELS, GENERA, type GenusName } from '../art/glsl/clouds';
import type { DeckState } from '../engine/Sky';

/**
 * The clock, the weather and the wind: one object that decides what today is,
 * everywhere at once. Nothing declares its own weather — a place samples this at
 * its map coordinate and gets the same day its neighbour gets.
 */

/** How the air biases a zone's own fog while a kind is running. */
export interface AirBias {
  /** sRGB hex the fog is pulled toward. */
  colour?: number;
  /** How far, at full amount, 0..1. */
  colourMix?: number;
  /** Multipliers on the zone's own distances at full amount. */
  near?: number;
  far?: number;
}

/** What a kind does to the ground and to what moves over it. */
export interface GroundBias {
  /** Added to the zone's wind multiplier at full amount. */
  wind?: number;
  /** Footstep surface while this kind covers the ground. */
  surface?: SurfaceName;
  /** How far groundcover is whitened and shortened, 0..1. */
  cover?: number;
}

/**
 * One weather. What a kind can do is closed; which kinds exist is open — a new
 * one is a row here and needs no code anywhere downstream.
 */
export interface WeatherKind {
  readonly name: string;
  /**
   * How rare it is, 0..1 — the height its own slow field has to clear before any
   * of it falls. High is rare.
   */
  readonly onset: number;
  /** Spells per day. Small is a weather that settles in for a while. */
  readonly pace: number;
  /** Season weighting, given the year phase 0..1 with 0 at midwinter. */
  readonly season?: (phase: number) => number;
  /**
   * Driven by the shared precipitation draw and its temperature split rather
   * than by a field of its own, so it can never rain and snow at once.
   */
  readonly precipitation?: 'warm' | 'cold';
  readonly particles?: ParticleSpec;
  /** Which rain-model surface this sounds like. Absent is silent. */
  readonly sound?: RainSurface;
  readonly air?: AirBias;
  /** What it does to every surface the sky can reach. */
  readonly surface?: 'wet' | 'crust';
  /** Which cloud genera it puts overhead, and how much of each. */
  readonly sky?: readonly (readonly [GenusName, number])[];
  readonly ground?: GroundBias;
  /** How much it stiffens the wind at full amount. Negative settles it. */
  readonly blow?: number;
}

export interface ClimateSettings {
  /** Seconds of real time in one game day. */
  dayLength: number;
  /** Game days in one year. Short, so a season is something a session reaches. */
  yearLength: number;
  /** Degrees north. Decides how long the twilights run and how low winter sits. */
  latitude: number;
  seed: number;
  /** Baseline wind before any weather leans on it, 0..1. */
  baseWind: number;
  /** Multiplier on how fast every weather field moves. */
  pace: number;
  /** Metres per second the weather front crosses the map. */
  frontSpeed: number;
  /** Days from one new moon to the next. The real one is 29.53. */
  moonMonth: number;
}

export const DEFAULT_CLIMATE: ClimateSettings = {
  dayLength: 24 * 60,
  yearLength: 96,
  latitude: 52,
  seed: 1337,
  baseWind: 0.5,
  pace: 1,
  frontSpeed: 11,
  moonMonth: 29.53,
};

/** Kilometres a weather field's cell spans. Fronts are tens of kilometres across. */
const FIELD_SPAN = 18;

/** Hours ahead the sky is read, to know what is coming. */
const LEAD_HOURS = 6;

/** Degrees the axis is tilted. Sets how far the sun's arc swings across the year. */
const OBLIQUITY = 23.44;

const DEG = Math.PI / 180;

function noise2(x: number, y: number): number {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const bx = (1 - Math.cos(fx * Math.PI)) * 0.5;
  const by = (1 - Math.cos(fy * Math.PI)) * 0.5;
  const corner = (cx: number, cy: number) => hash(cx * 73856093 + cy * 19349663);
  const top = corner(ix, iy) * (1 - bx) + corner(ix + 1, iy) * bx;
  const bottom = corner(ix, iy + 1) * (1 - bx) + corner(ix + 1, iy + 1) * bx;
  return top * (1 - by) + bottom * by;
}

/** Two octaves in days, so a spell arrives and leaves rather than switching. */
function slowField(t: number, offset: number): number {
  return valueNoise(t + offset) * 0.72 + valueNoise(t * 2.7 + offset * 1.31) * 0.28;
}

function clamp01(value: number): number {
  return value < 0 ? 0 : value > 1 ? 1 : value;
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp01((x - edge0) / (edge1 - edge0 || 1e-6));
  return t * t * (3 - 2 * t);
}

function clampSigned(value: number): number {
  return value < -1 ? -1 : value > 1 ? 1 : value;
}

/** 1 at midsummer, 0 at midwinter. */
const SUMMER = (phase: number): number => 0.5 - Math.cos(phase * Math.PI * 2) * 0.5;
const WINTER = (phase: number): number => 1 - SUMMER(phase);

/** Metres of the camera-carried box precipitation falls inside. */
const FALL_BOX = new THREE.Vector3(26, 18, 26);

export const RAIN_PARTICLES: ParticleSpec = {
  // Full downpour, and the count is the only thing the amount scales: fewer
  // drops is what a drizzle *is*, where the same drops at half alpha is a
  // downpour behind a gauze.
  count: 6000,
  shape: 'billboard',
  motion: 'fall',
  volume: { kind: 'follow', size: FALL_BOX },
  size: [0.012, 0.02],
  colour: [0x9fb4c4, 0xbcd0dd],
  opacity: 0.55,
  speed: [7, 9],
  windDrag: 0.15,
  weather: true,
};

export const SNOW_PARTICLES: ParticleSpec = {
  count: 3600,
  shape: 'billboard',
  motion: 'fall',
  volume: { kind: 'follow', size: FALL_BOX },
  size: [0.028, 0.05],
  colour: [0xf2f6fb, 0xd8e4f0],
  opacity: 0.9,
  speed: [0.8, 1.4],
  windDrag: 0.8,
  turbulence: 0.12,
  weather: true,
};

/**
 * The kinds this world knows. A zone that wants a weather nobody has written
 * adds a row; nothing downstream is edited to receive it.
 */
export const WEATHER_KINDS: WeatherKind[] = [
  {
    name: 'rain',
    onset: 0.46,
    pace: 0.55,
    precipitation: 'warm',
    particles: RAIN_PARTICLES,
    sound: 'earth',
    air: { colour: 0x8f9aa4, colourMix: 0.55, far: 0.55 },
    surface: 'wet',
    sky: [
      ['nimbostratus', 1],
      ['altostratus', 0.7],
    ],
    ground: { wind: 0.35, surface: 'mud' },
    blow: 0.45,
  },
  {
    name: 'snow',
    onset: 0.46,
    pace: 0.55,
    precipitation: 'cold',
    particles: SNOW_PARTICLES,
    air: { colour: 0xd8dee6, colourMix: 0.7, far: 0.45 },
    surface: 'crust',
    sky: [
      ['nimbostratus', 0.85],
      ['stratus', 0.6],
    ],
    ground: { wind: 0.15, surface: 'snow', cover: 1 },
    blow: 0.3,
  },
  {
    name: 'fog',
    onset: 0.62,
    pace: 0.4,
    season: (phase) => 0.4 + WINTER(phase) * 0.6,
    air: { colour: 0xc6cdd4, colourMix: 0.85, near: 0.25, far: 0.16 },
    sky: [['stratus', 0.8]],
    blow: -0.4,
  },
  {
    name: 'smog',
    onset: 0.72,
    pace: 0.3,
    season: (phase) => 0.5 + WINTER(phase) * 0.5,
    air: { colour: 0x9c8c6c, colourMix: 0.6, far: 0.4 },
    sky: [['altostratus', 0.9]],
    blow: -0.5,
  },
];

export function registerWeather(kind: WeatherKind): void {
  const at = WEATHER_KINDS.findIndex((existing) => existing.name === kind.name);
  if (at >= 0) WEATHER_KINDS[at] = kind;
  else WEATHER_KINDS.push(kind);
}

export type MoonName =
  | 'new'
  | 'waxing crescent'
  | 'first quarter'
  | 'waxing gibbous'
  | 'full'
  | 'waning gibbous'
  | 'last quarter'
  | 'waning crescent';

/** Eight names over the month, each centred on its eighth. */
const MOON_NAMES: readonly MoonName[] = [
  'new',
  'waxing crescent',
  'first quarter',
  'waxing gibbous',
  'full',
  'waning gibbous',
  'last quarter',
  'waning crescent',
];

/** Where a place stands on the map. Kilometres, and the node map's fiction made numeric. */
export interface ZonePlace {
  readonly at: readonly [number, number];
  /** Metres above the datum. What decides rain against snow. */
  readonly altitude?: number;
}

const ORIGIN: ZonePlace = { at: [0, 0], altitude: 0 };

export class Climate {
  readonly settings: ClimateSettings = { ...DEFAULT_CLIMATE };
  readonly wind: Weather;

  /**
   * Where the world starts: late spring, mid-morning. Day zero is midwinter,
   * and at this latitude a midwinter morning is still dark — booting into it
   * would be a fair reading of the model and a poor first frame.
   */
  day = 38;
  /** 0..1, with 0 at midnight. */
  timeOfDay = 0.42;

  /** Unit vector pointing at the sun. +X east, +Y up, +Z south. */
  readonly sunDirection = new THREE.Vector3(0, 1, 0);
  /** Degrees above the horizon. Negative below it; what the atmosphere table is keyed on. */
  sunElevation = 90;
  readonly moonDirection = new THREE.Vector3(0, 1, 0);
  /** 0 and 1 are new, 0.5 is full. Waxing below a half, waning above it. */
  moonPhase = 0.5;
  /** How much of the disc is lit, 0..1 — the phase turned into light. */
  moonLight = 1;
  /** Degrees C where the last sample was taken. */
  temperature = 12;
  /** How much is falling here now, and how much will be in a few hours. */
  precipitation = 0;
  precipitationSoon = 0;
  precipitationPast = 0;

  /** Held still, for the showcases and galleries. Every kind reads zero while set. */
  pinned = false;
  /** Clock stopped, weather still sampled — the dev scrub. */
  frozen = false;

  private readonly amounts = new Map<string, number>();
  private readonly forced = new Map<string, number>();
  private place: ZonePlace = ORIGIN;

  constructor(wind: Weather) {
    this.wind = wind;
    this.aim();
    this.sample();
  }

  /** Where the player is standing, in map kilometres. Set on every zone change. */
  setPlace(place: ZonePlace | undefined): void {
    this.place = place ?? ORIGIN;
  }

  /**
   * Holds one kind at a fixed amount, or clears the hold with null. The dev
   * panel's sliders come through here.
   */
  force(name: string, amount: number | null): void {
    if (amount === null) this.forced.delete(name);
    else this.forced.set(name, clamp01(amount));
  }

  forcedAmount(name: string): number | null {
    return this.forced.get(name) ?? null;
  }

  amountOf(name: string): number {
    return this.amounts.get(name) ?? 0;
  }

  /** How much of anything is falling. Drives the shared precipitation switch. */
  get falling(): number {
    let total = 0;
    for (const kind of WEATHER_KINDS) {
      if (kind.particles) total = Math.max(total, this.amountOf(kind.name));
    }
    return total;
  }

  /** Days since the world began, fractional. The axis every weather field runs on. */
  get elapsedDays(): number {
    return this.day + this.timeOfDay;
  }

  /** 0..1 with 0 at midwinter. */
  get seasonPhase(): number {
    return (this.elapsedDays / this.settings.yearLength) % 1;
  }

  /** What a person would call tonight's moon. */
  get moonName(): MoonName {
    return MOON_NAMES[Math.floor(((this.moonPhase + 1 / 16) % 1) * 8) % 8];
  }

  update(dt: number): void {
    if (!this.frozen) {
      this.timeOfDay += dt / Math.max(this.settings.dayLength, 1);
      while (this.timeOfDay >= 1) {
        this.timeOfDay -= 1;
        this.day += 1;
      }
    }
    this.aim();
    this.sample();
    // The settings only. The field itself is stepped by the audio engine, which
    // has to have done it before anything ships the same gust to the GPU.
    this.wind.settings.frontSpeed = this.settings.frontSpeed;
    this.wind.settings.windSpeed = clamp01(this.settings.baseWind + this.blow());
  }

  /** Scrubs the clock without advancing the world. */
  setTimeOfDay(value: number): void {
    this.timeOfDay = ((value % 1) + 1) % 1;
    this.aim();
  }

  private blow(): number {
    let total = 0;
    for (const kind of WEATHER_KINDS) {
      if (kind.blow) total += kind.blow * this.amountOf(kind.name);
    }
    // A day can be blustery with nothing falling out of it.
    const own = slowField(this.elapsedDays * 0.7 * this.settings.pace, 411.3) - 0.5;
    return total + own * 0.5;
  }

  /**
   * Built straight in the horizontal frame rather than rotated into it: +X is
   * east, +Y up, +Z south, so a northern noon sun sits at +Z and an afternoon
   * one at −X.
   */
  /**
   * Where a point at this ecliptic longitude stands, given its hour angle.
   * Built straight in the horizontal frame rather than rotated into it: +X is
   * east, +Y up, +Z south, so a northern noon sun sits at +Z and an afternoon
   * one at −X.
   */
  private aimAt(hourAngle: number, longitude: number, out: THREE.Vector3): void {
    const declination = Math.asin(Math.sin(OBLIQUITY * DEG) * Math.sin(longitude));
    const latitude = this.settings.latitude * DEG;
    const sinD = Math.sin(declination);
    const cosD = Math.cos(declination);
    const sinL = Math.sin(latitude);
    const cosL = Math.cos(latitude);
    const cosH = Math.cos(hourAngle);

    const east = -cosD * Math.sin(hourAngle);
    const north = sinD * cosL - cosD * cosH * sinL;
    const up = sinD * sinL + cosD * cosH * cosL;
    out.set(east, up, -north).normalize();
  }

  private aim(): void {
    // Midwinter is the December solstice, where the sun sits at 270 degrees of
    // ecliptic longitude — so season phase zero is there and the year runs on
    // from it.
    const sunLongitude = this.seasonPhase * Math.PI * 2 + Math.PI * 1.5;
    // Zero at local noon, positive in the afternoon.
    const hourAngle = (this.timeOfDay - 0.5) * Math.PI * 2;
    this.aimAt(hourAngle, sunLongitude, this.sunDirection);
    this.sunElevation = Math.asin(clampSigned(this.sunDirection.y)) / DEG;

    // The moon runs the same arithmetic one synodic phase further round the
    // ecliptic. Longitude *ahead* of the sun and hour angle *behind* it by the
    // same amount, which is the whole geometry of the month: a new moon keeps
    // the sun's company, a first quarter stands due south at sunset, and a full
    // moon rises as the sun goes down.
    const month = Math.max(this.settings.moonMonth, 1);
    this.moonPhase = ((this.elapsedDays / month) % 1 + 1) % 1;
    const swing = this.moonPhase * Math.PI * 2;
    this.moonLight = 0.5 - Math.cos(swing) * 0.5;
    this.aimAt(hourAngle - swing, sunLongitude + swing, this.moonDirection);
  }

  private sample(): void {
    const [kx, ky] = this.place.at;
    const altitude = this.place.altitude ?? 0;
    const days = this.elapsedDays * this.settings.pace;
    const phase = this.seasonPhase;

    // Metres of front travel since day zero, in kilometres of field offset.
    const travel = (this.elapsedDays * this.settings.dayLength * this.settings.frontSpeed) / 1000;
    const bearing = this.wind.settings.windDirection;
    const u = (kx - Math.cos(bearing) * travel) / FIELD_SPAN;
    const v = (ky - Math.sin(bearing) * travel) / FIELD_SPAN;

    this.temperature =
      9 +
      11 * -Math.cos(phase * Math.PI * 2) +
      4 * Math.sin((this.timeOfDay - 0.25) * Math.PI * 2) -
      altitude * 0.0065;

    // One precipitation draw split by temperature: it cannot rain and snow at once.
    const wet = (dayAt: number, uAt: number, vAt: number): number =>
      smoothstep(0.46, 0.6, slowField(dayAt * 0.55, 17.7))
      * smoothstep(0.32, 0.78, noise2(uAt + 3.1, vAt - 1.7));

    // The same field a few hours upwind and downwind. What is coming is what
    // decides the sky ahead of the rain, and it costs two more lookups.
    const lead = (LEAD_HOURS / 24) * this.settings.pace;
    const step = (LEAD_HOURS * 3600 * this.settings.frontSpeed) / 1000 / FIELD_SPAN;
    const du = Math.cos(bearing) * step;
    const dv = Math.sin(bearing) * step;
    const precipitation = wet(days, u, v);
    this.precipitation = precipitation;
    this.precipitationSoon = wet(days + lead, u - du, v - dv);
    this.precipitationPast = wet(days - lead, u + du, v + dv);
    const cold = smoothstep(2, -1, this.temperature);

    for (let i = 0; i < WEATHER_KINDS.length; i++) {
      const kind = WEATHER_KINDS[i];
      const override = this.forced.get(kind.name);
      if (override !== undefined) {
        this.amounts.set(kind.name, override);
        continue;
      }
      if (this.pinned) {
        this.amounts.set(kind.name, 0);
        continue;
      }

      let amount: number;
      if (kind.precipitation) {
        amount = precipitation * (kind.precipitation === 'cold' ? cold : 1 - cold);
      } else {
        const level = slowField(days * kind.pace, 53.9 * (i + 1));
        const bias = kind.season ? kind.season(phase) : 1;
        const here = smoothstep(0.3, 0.8, noise2(u * 1.4 + i * 11.3, v * 1.4 - i * 7.1));
        amount = smoothstep(kind.onset, kind.onset + 0.12, level * bias) * here;
      }
      this.amounts.set(kind.name, clamp01(amount));
    }
  }
}

/**
 * Which genus sits in each deck, and how much of it. Data rather than code: a
 * warm front is a set of curves against how far off the rain is, and it plays
 * out on its own as the field crosses the map.
 *
 * Reads high, mid, low. Nothing here writes a colour — the deck's own height
 * decides how far past sunset it stays lit, and the atmosphere fills that in.
 */
export function planSky(climate: Climate, out: DeckState[]): void {
  const pick = new Map<GenusName, number>();
  const put = (genus: GenusName, amount: number): void => {
    if (amount > (pick.get(genus) ?? 0)) pick.set(genus, amount);
  };

  const day = climate.elapsedDays;
  const hour = climate.timeOfDay;
  const summer = SUMMER(climate.seasonPhase);
  const here = climate.precipitation;
  const coming = Math.max(0, climate.precipitationSoon - here);
  const going = Math.max(0, climate.precipitationPast - here);

  // The fair-weather sky, before any weather is asked about. A slow high field
  // that is there most days, and a mid one that is there less often.
  const highLevel = slowField(day * 0.8, 233.1);
  // Cirrus most days; a mackerel sky is the rarer one and the finest-grained.
  put(highLevel > 0.78 ? 'cirrocumulus' : 'cirrus', smoothstep(0.4, 0.72, highLevel) * 0.75);
  put('altocumulus', smoothstep(0.55, 0.85, slowField(day * 0.65, 97.4)) * 0.7);

  // Diurnal cumulus: nothing at dawn, most of it mid-afternoon, gone by dusk.
  // Convective, so it wants a warm day and dies out over a cold one.
  const convection = Math.max(0, Math.sin(((hour - 0.33) / 0.5) * Math.PI));
  put('cumulus', convection * (0.25 + summer * 0.6) * (1 - here));

  // Valley stratus: still, damp and only around dawn.
  const settled = 1 - climate.wind.settings.windSpeed;
  put('stratus', smoothstep(0.19, 0.27, hour) * (1 - smoothstep(0.3, 0.4, hour)) * settled * 0.7);

  // The warm-front sequence. Cirrus first and highest, then the veil that
  // carries the halo, then the grey sheet, then the rain. Each leads the next,
  // so watching the sky tells you what is coming before it arrives.
  if (coming > 0.02) {
    put('cirrus', smoothstep(0.05, 0.5, coming) * 0.9);
    put('cirrostratus', smoothstep(0.25, 0.7, coming) * 0.85);
    put('altostratus', smoothstep(0.45, 0.9, coming) * 0.9);
  }
  // And what breaks up behind it.
  if (going > 0.02) put('stratocumulus', smoothstep(0.05, 0.5, going) * 0.85);

  // Whatever is actually falling has the last word.
  for (const kind of WEATHER_KINDS) {
    const amount = climate.amountOf(kind.name);
    if (amount <= 0 || !kind.sky) continue;
    for (const [genus, weight] of kind.sky) put(genus, amount * weight);
  }

  for (let i = 0; i < DECK_LEVELS.length; i++) {
    const level = DECK_LEVELS[i];
    let best: GenusName | null = null;
    let bestAmount = 0;
    for (const [genus, amount] of pick) {
      if (GENERA[genus].level !== level || amount <= bestAmount) continue;
      best = genus;
      bestAmount = amount;
    }
    out[i].genus = best;
    out[i].amount = clamp01(bestAmount);
  }
}
