import * as THREE from 'three';
import { Climate, WEATHER_KINDS, planSky, type DeckTarget, type WeatherKind } from './climate';
import { createAtmosphere, sampleAtmosphere, cloudLightAt, tintToward } from '../engine/atmosphere';
import { createDecks, type DeckState } from '../engine/Sky';
import { GENERA, twilightLead } from '../art/glsl/clouds';
import {
  advanceParticleWind,
  createParticles,
  setParticleWeather,
  setWeatherTint,
} from '../art/particles';
import { finishUniforms } from '../art/finish';
import { setCoverWeather } from '../art/cover';
import { setGlowLevel } from '../art/glow';
import { setZoneWind } from '../art/sway';
import { createRain, type RainModel, type RainSurface } from '../audio/models/rain';
import type { Conditions } from '../audio/ambience/conditions';
import type { AudioEngine } from '../audio/AudioEngine';
import type { PostFX } from '../engine/PostFX';
import type { ZoneManager } from './ZoneManager';
import type { SurfaceName } from '../audio/models/footsteps';

/**
 * What the climate does to the world, once a frame. The climate decides; this
 * applies — the light rig, the dome, the decks, the falling, the sound and how
 * wet the stones are.
 */

/** Seconds for a surface to take up the rain it is standing in. */
const SOAK = 25;
/** Seconds to give it back in still air out of the sun. Wind and sun cut it. */
const DRY = 180;
/** Seconds for snow to lie, and to go once it is above freezing. */
const SETTLE = 240;
const THAW = 420;

/**
 * How far under the horizon the sun goes before the moon takes the key light.
 * Not zero: a sun a degree down still lights the world more than a full moon.
 */
const MOON_TAKES_OVER = -3;

/**
 * Seconds a deck takes to arrive or leave. A sky whose genus changes on the
 * frame the arithmetic changes its mind pops, and the pop is the one thing that
 * says "a parameter was turned" rather than "the weather moved".
 */
const DECK_EASE = 14;

/**
 * Seconds a held surface takes to answer. The lag is the point in play, and
 * exactly wrong in a panel: a control you wait three minutes to see is not one.
 */
const HELD_SNAP = 2.5;

export class WeatherRig {
  readonly climate: Climate;
  readonly air = createAtmosphere();
  readonly decks: DeckState[] = createDecks();
  private readonly wanted: DeckTarget[] = [
    { genus: null, amount: 0, snap: false },
    { genus: null, amount: 0, snap: false },
    { genus: null, amount: 0, snap: false },
  ];

  /** How wet and how snowed-over the world is, 0..1. Both lag the weather. */
  wet = 0;
  lying = 0;

  private readonly systems = new Map<string, THREE.Mesh>();
  private readonly root = new THREE.Group();
  private rain: RainModel | null = null;
  /** Seconds the fallback bed has been silent, before it is let go. */
  private quiet = 0;
  private readonly key = new THREE.Vector3();
  private postfx: PostFX | null = null;
  /**
   * The sky's own clock, in seconds. Driven by *game* time rather than by the
   * frame clock, so scrubbing the hour moves the cloud with it — but geared
   * down, because a day compressed to twenty-four minutes would otherwise put
   * the decks through sixty times their own speed and streak them.
   *
   * Kept as an accumulator rather than derived from the day count: the shared
   * hash loses its precision in the thousands, and a world several days old
   * would land there.
   */
  private cloudClock = 0;
  private lastDay = 0;
  private readonly airColour = new THREE.Color();
  private airMix = 0;
  private airNear = 1;
  private airFar = 1;
  private airDarken = 0;

  constructor(climate: Climate, scene: THREE.Scene) {
    this.climate = climate;
    this.root.name = 'Weather';
    // The systems are camera-carried boxes and belong to nobody's zone, so they
    // hang off the scene and survive every threshold.
    this.root.frustumCulled = false;
    scene.add(this.root);
  }

  /** Whichever kind is falling hardest, or null. Decides the footstep surface and the bed. */
  private heaviest(): { kind: WeatherKind; amount: number } | null {
    let best: WeatherKind | null = null;
    let amount = 0;
    for (const kind of WEATHER_KINDS) {
      const value = this.climate.amountOf(kind.name);
      if (value > amount) {
        best = kind;
        amount = value;
      }
    }
    return best ? { kind: best, amount } : null;
  }

  /** The floor underfoot while something is lying on it, or null for the zone's own. */
  get surface(): SurfaceName | null {
    if (this.lying > 0.35) return 'snow';
    const heavy = this.heaviest();
    if (heavy && heavy.amount > 0.25 && heavy.kind.ground?.surface) return heavy.kind.ground.surface;
    return null;
  }

  update(
    dt: number,
    postfx: PostFX,
    zones: ZoneManager,
    audio: AudioEngine,
    listener: THREE.Vector3,
  ): void {
    const climate = this.climate;
    const zone = zones.current;
    const outdoors = zone?.environment.sky ?? true;
    // Set before the sample, not after: a zone with no map coordinate stands
    // outside the weather entirely. The clock still runs over it, but nothing
    // falls on an exhibit.
    climate.setPlace(zone?.place);
    climate.pinned = zone !== null && zone.place === undefined;
    climate.update(dt);
    // Geared so that at the default day length one sky second is one real
    // second, and a longer or shorter day slows or quickens the sky with it.
    const moved = (climate.elapsedDays - this.lastDay) * 86400;
    this.lastDay = climate.elapsedDays;
    this.cloudClock += Math.max(0, Math.min(moved / 60, 600));

    this.readAir();
    this.applyLight(postfx, zones);
    this.applySky(postfx, dt);
    postfx.setWeatherAir(this.airColour, this.airMix, this.airNear, this.airFar);
    this.postfx = postfx;
    this.applySurfaces(dt, outdoors, zone?.environment.wind ?? 1);
    this.applyFalling(postfx, outdoors, dt);
    this.applySound(dt, audio, zones, listener, outdoors);
    this.applyAmbience(zones, listener, outdoors);
  }

  private applyLight(postfx: PostFX, zones: ZoneManager): void {
    const climate = this.climate;
    // Rising is the morning half of the day, which is what the dawn tint keys on.
    const rising = climate.timeOfDay < 0.5;
    sampleAtmosphere(climate.sunElevation, rising, this.air);

    // Overcast has no stars behind it and no moon through it.
    const overcast = this.cover();
    const clear = 1 - overcast;

    // The single thing that makes an overcast day read as one. A sky the sun
    // cannot get through has to *change the light*: the key goes out, the sky
    // itself becomes the light, and everything it lands on takes its colour.
    // Fog alone in front of an unchanged blue sky is a filter over the frame.
    const shut = overcast * overcast;
    this.air.sunScale *= 1 - shut * 0.82;
    this.air.ambientScale *= 1 + shut * 0.2;
    this.air.fillScale *= 1 - shut * 0.35;
    // Hue and chroma only, never lightness. How bright the sky is at this hour
    // is the atmosphere's to say; what colour the weather has made it is this.
    //
    // Driven by how much haze there is and *not* by how much cloud: air is
    // coloured by what is suspended in it, and a smog does not need an
    // overcast overhead to be brown. Tying the two together left a smoggy
    // clear day looking like an ordinary one with short fog.
    if (this.airMix > 0) {
      const wash = this.airMix;
      tintToward(this.air.horizon, this.airColour, wash * 0.8);
      tintToward(this.air.zenith, this.airColour, wash * 0.95);
      tintToward(this.air.ground, this.airColour, wash * 0.55);
      tintToward(this.air.ambientSky, this.airColour, wash * 0.7);
      tintToward(this.air.fillColour, this.airColour, wash * 0.55);
      tintToward(this.air.sunColour, this.airColour, wash * 0.55);

      // And what the haze takes out of the light. Hue alone cannot say this:
      // a brown smog is dimmer as well as browner, and preserving lightness —
      // which is what stops a snow haze lifting the night sky — would leave it
      // as bright as the clear day it replaced.
      if (this.airDarken > 0) {
        const shade = 1 - this.airDarken * wash;
        this.air.horizon.multiplyScalar(shade);
        this.air.zenith.multiplyScalar(shade);
        this.air.ground.multiplyScalar(shade);
        this.air.sunScale *= shade;
        this.air.ambientScale *= 0.6 + shade * 0.4;
      }
    }

    postfx.aimSun(climate.sunDirection);
    postfx.setAir(this.air.horizon, this.air.zenith, this.air.ground, this.air.sunDisc, this.air.warmth);
    // Up is up. The moon is drawn whenever it clears the horizon, whatever the
    // hour — it spends half of every day above it and a good deal of that in
    // daylight, and never drawing it then was the one thing making the sky feel
    // like scenery rather than a place.
    const risen = Math.max(0, Math.min(1, (climate.moonDirection.y + 0.02) / 0.09));
    // How hard the face is driven, which is a separate question. Past white at
    // night, just under it by day: what makes a daytime moon pale is that the
    // sky beside it is bright, not that the moon has dimmed.
    const daylight = Math.max(0, Math.min(1, (climate.sunElevation + 6) / 10));
    postfx.setNight(
      this.air.stars * clear,
      risen * (0.35 + clear * 0.65),
      1.78 - daylight * 0.86,
      climate.moonDirection,
      climate.settings.latitude,
      climate.starAngle,
    );

    // Once the sun is properly down the moon is the key light, and it casts —
    // faintly, and from the other side of the sky, which is most of what makes
    // a bright night read as night rather than as a dim day.
    const moonlit = climate.sunElevation < MOON_TAKES_OVER;
    this.key.copy(moonlit ? climate.moonDirection : climate.sunDirection);
    // A new moon lights nothing. Not zero at the bottom: at that point the sky
    // itself is the light, and the key is only shaping it.
    const phase = 0.25 + climate.moonLight * 0.75;
    zones.aimKeyLight(this.key, (moonlit ? 0.45 * phase : 1) * clear * clear);
    // The decks take the same key. A cloud shaded by a sun that has set carries
    // a lit side and a silvered rim aimed at nothing.
    postfx.setSkyLight(this.key, moonlit ? 0.5 * climate.moonLight : 1);
    zones.applyLightRig(this.air);

    // The lamps come up as the sun goes down, on the sun's elevation rather
    // than on the clock, so a winter afternoon lights itself early.
    const dusk = Math.max(0, Math.min(1, (4 - climate.sunElevation) / 10));
    setGlowLevel(dusk * dusk * (3 - 2 * dusk));
  }

  private applySky(postfx: PostFX, dt: number): void {
    planSky(this.climate, this.wanted);
    this.easeDecks(dt);
    for (const deck of this.decks) {
      if (!deck.genus) continue;
      // The deck's own sunset, not the observer's: a cirrus at nine kilometres
      // sees the sun for three degrees longer than the ground does, which is
      // why it burns while the low cloud has already gone flat.
      const height = GENERA[deck.genus].height;
      cloudLightAt(
        this.climate.sunElevation + twilightLead(height),
        this.climate.timeOfDay < 0.5,
        deck.lit,
        deck.shade,
      );
      const grey = GENERA[deck.genus].grey;
      if (grey > 0) {
        deck.lit.lerp(deck.shade, grey);
        deck.shade.multiplyScalar(1 - grey * 0.35);
      }
      // And the weather's own colour on the cloud, by hue as everywhere else.
      // A deck raining or snowing out of its bottom is that colour too — it is
      // the same air, seen from underneath rather than through.
      if (this.airMix > 0) {
        tintToward(deck.lit, this.airColour, this.airMix * 0.55);
        tintToward(deck.shade, this.airColour, this.airMix * 0.4);
        // Falling weather thickens the deck it falls out of.
        const falling = this.climate.falling;
        if (falling > 0) {
          deck.lit.multiplyScalar(1 - falling * 0.22);
          deck.shade.multiplyScalar(1 - falling * 0.3);
        }
      }
    }
    postfx.setDecks(
      this.decks,
      this.climate.wind.settings.windDirection,
      this.climate.wind.settings.windSpeed,
      this.cloudClock,
      dt,
    );
    // Strongest at broken cover and gone at both ends: a clear sky casts no
    // cloud shadow, and a solid one casts no shadow either — it darkens
    // everything, which the light rig above has already done.
    const broken = this.cover();
    postfx.setCloudShadowScale(4 * broken * (1 - broken));
    this.applyPhenomena(postfx);
  }

  /**
   * Eases each slot toward what the plan wants. A slot whose genus is being
   * replaced empties first and fills afterwards, so one form never becomes
   * another between frames — cirrus does not turn into stratocumulus, it goes,
   * and then stratocumulus arrives.
   */
  private easeDecks(dt: number): void {
    const step = Math.min(1, dt / DECK_EASE);
    for (let i = 0; i < this.decks.length; i++) {
      const deck = this.decks[i];
      const want = this.wanted[i];
      if (want.snap) {
        deck.genus = want.genus;
        deck.amount = want.amount;
        continue;
      }
      const target = deck.genus === null || deck.genus === want.genus ? want.amount : 0;
      deck.amount += (target - deck.amount) * step;
      if (deck.genus === null && want.genus !== null) deck.genus = want.genus;
      else if (deck.amount < 0.015 && deck.genus !== want.genus) {
        deck.genus = want.genus;
        deck.amount = 0;
      }
    }
  }

  /**
   * Each of these appears only in the conditions that make it and never
   * otherwise. The halo wants ice at cirrostratus height and the bow wants rain
   * falling with the sun low enough behind you to throw one, so both read the
   * sky and the weather rather than the clock.
   */
  private applyPhenomena(postfx: PostFX): void {
    const elevation = this.climate.sunElevation;
    // Strongest a couple of degrees under, gone by the time it is properly dark.
    const belt = Math.max(0, 1 - Math.abs(elevation + 2.5) / 5.5);
    // The 22 degree halo is off. It is accurate, cirrostratus really does carry
    // one, and it sits close enough to the sun to pull the eye away from
    // everything else in the frame. One line to bring back.
    const halo = 0;
    // A bow needs rain in the air and the sun under about forty degrees; above
    // that the arc has gone below the horizon and there is nothing to see.
    const falling = this.climate.amountOf('rain');
    const bow = falling * Math.max(0, Math.min(1, elevation / 6))
      * Math.max(0, Math.min(1, (40 - elevation) / 10))
      * (1 - this.cover() * 0.6);
    // The shadow rises opposite the sun at about twice the rate the sun sets.
    const top = Math.sin((Math.max(0, Math.min(20, -elevation * 2)) * Math.PI) / 180);
    postfx.setPhenomena(belt, halo, bow, top);
  }

  /** How much of the sky the decks take between them, 0..1. */
  private cover(): number {
    let total = 0;
    for (const deck of this.decks) {
      if (!deck.genus) continue;
      const taken = deck.amount * GENERA[deck.genus].cover * GENERA[deck.genus].opacity;
      total = total + taken - total * taken;
    }
    return total;
  }

  /** What every kind running right now does to the air between things. */
  private readAir(): void {
    this.airColour.setRGB(0, 0, 0);
    this.airMix = 0;
    this.airNear = 1;
    this.airFar = 1;
    this.airDarken = 0;
    for (const kind of WEATHER_KINDS) {
      const amount = this.climate.amountOf(kind.name);
      if (amount <= 0 || !kind.air) continue;
      // A kind with a palette runs in whichever colour the day drew.
      const tone = this.climate.toneOf(kind);
      const weight = amount * (kind.air.colourMix ?? 0) * (tone ? tone.mix : 1);
      if (weight > 0) {
        this.airColour.add(
          AIR_ONE.setHex(tone ? tone.colour : (kind.air.colour ?? 0xffffff), THREE.SRGBColorSpace)
            .multiplyScalar(weight),
        );
        this.airMix += weight;
      }
      this.airNear *= 1 - (1 - (kind.air.near ?? 1)) * amount;
      this.airFar *= 1 - (1 - (kind.air.far ?? 1)) * amount;
      this.airDarken = Math.max(this.airDarken, (kind.air.darken ?? 0) * amount);
    }
    if (this.airMix > 0) this.airColour.multiplyScalar(1 / this.airMix);
    else this.airColour.setRGB(0.5, 0.53, 0.56);
    this.airMix = Math.min(this.airMix, 0.95);
  }

  /**
   * The lag, in both directions. Rain wets a surface in about half a minute and
   * takes minutes to leave it, so the gloss arrives after the shower has and
   * outlives it — which is what makes it read as water in the stone rather than
   * as a filter over the frame. The ceiling is the rain rate, so a downpour
   * goes further than a drizzle without anything else being said.
   */
  private applySurfaces(dt: number, outdoors: boolean, zoneWind: number): void {
    const climate = this.climate;
    let wetTarget = 0;
    let snowTarget = 0;
    for (const kind of WEATHER_KINDS) {
      const amount = climate.amountOf(kind.name);
      if (kind.surface === 'wet') wetTarget = Math.max(wetTarget, amount);
      if (kind.surface === 'crust') snowTarget = Math.max(snowTarget, amount);
    }

    // A kind being held from the panel is a control, and a control you wait
    // three minutes to see the effect of is not one. The lag is what this is
    // for in play; under a hold it gets out of the way.
    const held = WEATHER_KINDS.some(
      (kind) => kind.surface !== undefined && climate.forcedAmount(kind.name) !== null,
    );

    // Sun and wind take it off; still, shaded air keeps it.
    const drying = 1 + Math.max(0, this.air.sunScale) * 1.2 + climate.wind.strength * 0.8;
    const wetTau = held ? HELD_SNAP : wetTarget > this.wet ? SOAK : DRY / drying;
    this.wet += (wetTarget - this.wet) * Math.min(1, dt / wetTau);

    // Snow lies while it falls and goes once it is above freezing, at a rate
    // the temperature decides rather than the weather.
    const thaw = Math.max(0, climate.temperature) / 6;
    const snowTau = held ? HELD_SNAP : snowTarget > this.lying ? SETTLE : THAW / (0.25 + thaw);
    this.lying += (snowTarget - this.lying) * Math.min(1, dt / snowTau);

    const gate = outdoors ? 1 : 0;
    finishUniforms.uWetness.value = this.wet * gate;
    finishUniforms.uSnow.value = this.lying * gate;

    // Groundcover goes white and short under snow, and heavy under rain.
    // Exactly what the finish stage hands a wet surface as its environment,
    // so what grows out of the ground reflects what the ground reflects.
    COVER_SKY.copy(this.air.horizon).lerp(this.air.zenith, 0.4);
    setCoverWeather(this.lying * gate, this.wet * gate, COVER_SKY);
    this.postfx?.setSurfaceWet(this.wet * gate);
    setZoneWind(this.windFor(zoneWind));
  }

  /** Adds the wind the weather is leaning on over whatever the zone declared. */
  windFor(zoneWind: number): number {
    let extra = 0;
    for (const kind of WEATHER_KINDS) {
      const bias = kind.ground?.wind;
      if (bias) extra += bias * this.climate.amountOf(kind.name);
    }
    return zoneWind * (1 + extra);
  }

  private applyFalling(postfx: PostFX, outdoors: boolean, dt: number): void {
    // Accumulated here rather than worked out per particle, because a particle
    // has no memory to accumulate it in. See `uWindDrift`.
    advanceParticleWind(
      this.climate.wind.settings.windDirection,
      this.climate.wind.strength,
      dt,
    );
    // Darkened after dark. The night here is deliberately bright and blue, so
    // pale flakes over it have nothing to separate them — what a snowfall reads
    // by is contrast, and once the sky is the brighter of the two the flakes
    // have to be the darker.
    const dusk = 1 - Math.max(0, Math.min(1, (this.climate.sunElevation + 4) / 10));
    setWeatherTint(1 - dusk * 0.45);

    let any = false;
    for (const kind of WEATHER_KINDS) {
      if (!kind.particles) continue;
      const amount = outdoors ? this.climate.amountOf(kind.name) : 0;
      const live = amount > 0.02;
      if (live) any = true;
      let mesh = this.systems.get(kind.name) ?? null;
      if (live && !mesh) {
        mesh = createParticles(kind.particles, hashName(kind.name));
        this.systems.set(kind.name, mesh);
        this.root.add(mesh);
      }
      if (!mesh) continue;
      mesh.visible = live;
      // Count and opacity together: fewer flakes and fainter ones, so a drizzle
      // is a drizzle rather than a downpour drawn at half alpha.
      setParticleWeather(mesh, amount);
    }
    postfx.setPrecipitating(any);
  }

  /**
   * Hands the ambience director what the world is doing. Sampled here because
   * this already owns the climate and the surface lag, and because nothing
   * under `src/audio` reads `src/world`.
   */
  private applyAmbience(zones: ZoneManager, listener: THREE.Vector3, outdoors: boolean): void {
    const director = zones.ambience;
    if (!director) return;
    const climate = this.climate;
    const wind = climate.wind;
    // Degrees the sun climbs per game minute at the horizon: fifteen an hour,
    // foreshortened by the latitude. It is what turns "forty-seven minutes
    // before sunrise" into an elevation a gate can test.
    const sunRate = 0.25 * Math.cos(climate.settings.latitude * (Math.PI / 180));

    CONDITIONS.sun = climate.sunElevation;
    CONDITIONS.sunRate = Math.max(sunRate, 0.02);
    CONDITIONS.rising = climate.timeOfDay < 0.5;
    CONDITIONS.timeOfDay = climate.timeOfDay;
    CONDITIONS.hour = Math.floor(climate.timeOfDay * 24);
    CONDITIONS.season = climate.seasonPhase;
    CONDITIONS.warmth = climate.temperature;
    CONDITIONS.moon = climate.moonLight;
    CONDITIONS.rain = climate.amountOf('rain');
    CONDITIONS.snow = climate.amountOf('snow');
    CONDITIONS.fog = climate.amountOf('fog');
    CONDITIONS.wet = this.wet;
    CONDITIONS.lying = this.lying;
    CONDITIONS.wind = wind.strengthAt(listener.x, listener.z);
    CONDITIONS.gust = wind.gust;
    CONDITIONS.indoors = !outdoors;
    CONDITIONS.elapsed = climate.elapsedDays;
    director.setConditions(CONDITIONS);
  }

  private applySound(
    dt: number,
    audio: AudioEngine,
    zones: ZoneManager,
    listener: THREE.Vector3,
    outdoors: boolean,
  ): void {
    let level = 0;
    let surface: RainSurface = 'earth';
    for (const kind of WEATHER_KINDS) {
      if (!kind.sound) continue;
      const amount = this.climate.amountOf(kind.name);
      if (amount > level) {
        level = amount;
        surface = kind.sound;
      }
    }
    // Indoors it is heard through a wall rather than switched off.
    if (!outdoors) level *= 0.28;

    // Driven by the amount and nothing else, exactly as the falling and the wet
    // are. A zone standing outside the weather already reads zero for every
    // kind, so it needs no gate of its own here — and a gate of its own is how
    // rain ended up falling in silence wherever it had been asked for by hand.
    //
    // A zone that declared a rain bed gets driven rather than doubled: its
    // model is already in the zone's bus, so it ducks, stops and resumes with
    // the rest of the air, and the soundscape updates it. Beds only — a rain
    // station on the sound stage shares the id and is an exhibit.
    const declared = zones.sound?.findBed<RainModel>('rain') ?? null;
    if (declared) {
      this.silence(audio, dt, listener);
      declared.setSurface(surface);
      declared.setIntensity(level);
      return;
    }

    if (this.rain === null) {
      if (level <= 0.01 || !audio.noise || !audio.started) return;
      // The same level a zone authors its own bed at, straight into the dry
      // bus. No second gain over it: the model ramps itself, and a fader on
      // top of that ramp is two envelopes racing.
      this.rain = createRain(audio, { gain: 0.17, intensity: 0, surface });
      this.rain.output.connect(audio.weatherBus);
    }
    this.quiet = 0;
    this.rain.setSurface(surface);
    this.rain.setIntensity(level);
    // Updated at every level including zero, and that is the point: the model
    // resets its own drop clocks when it goes quiet, and one that stops being
    // told the time keeps replaying the last block it scheduled.
    this.rain.update?.(dt, audio, listener);
  }

  /** Winds the fallback bed down, and lets it go once it is actually silent. */
  private silence(audio: AudioEngine, dt: number, listener: THREE.Vector3): void {
    if (this.rain === null) return;
    this.rain.setIntensity(0);
    this.rain.update?.(dt, audio, listener);
    this.quiet += dt;
    if (this.quiet > 3) {
      this.rain.dispose();
      this.rain = null;
      this.quiet = 0;
    }
  }

  dispose(): void {
    for (const mesh of this.systems.values()) {
      mesh.geometry.dispose();
      this.root.remove(mesh);
    }
    this.systems.clear();
    this.root.parent?.remove(this.root);
    this.rain?.dispose();
  }
}

/** Refilled every frame rather than rebuilt: one struct, handed straight over. */
const CONDITIONS: Conditions = {
  sun: 50,
  sunRate: 0.15,
  rising: true,
  timeOfDay: 0.5,
  hour: 12,
  season: 0.5,
  warmth: 12,
  moon: 0,
  rain: 0,
  snow: 0,
  fog: 0,
  wet: 0,
  lying: 0,
  wind: 0.4,
  gust: 0.5,
  indoors: false,
  elapsed: 0,
};

const AIR_ONE = new THREE.Color();
const COVER_SKY = new THREE.Color();

function hashName(name: string): number {
  let value = 0x811c9dc5;
  for (let i = 0; i < name.length; i++) value = Math.imul(value ^ name.charCodeAt(i), 0x01000193);
  return (value >>> 0) % 100000;
}
