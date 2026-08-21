import * as THREE from 'three';
import { Climate, WEATHER_KINDS, planSky, type WeatherKind } from './climate';
import { createAtmosphere, sampleAtmosphere, cloudLightAt } from '../engine/atmosphere';
import { createDecks, type DeckState } from '../engine/Sky';
import { GENERA, twilightLead } from '../art/glsl/clouds';
import { createParticles, setParticleWeather } from '../art/particles';
import { finishUniforms } from '../art/finish';
import { setCoverWeather } from '../art/cover';
import { setGlowLevel } from '../art/glow';
import { setZoneWind } from '../art/sway';
import { createRain, type RainModel, type RainSurface } from '../audio/models/rain';
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

export class WeatherRig {
  readonly climate: Climate;
  readonly air = createAtmosphere();
  readonly decks: DeckState[] = createDecks();

  /** How wet and how snowed-over the world is, 0..1. Both lag the weather. */
  wet = 0;
  lying = 0;

  private readonly systems = new Map<string, THREE.Mesh>();
  private readonly root = new THREE.Group();
  private rain: RainModel | null = null;
  /** Seconds the fallback bed has been silent, before it is let go. */
  private quiet = 0;
  private readonly key = new THREE.Vector3();

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
    elapsed: number,
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

    this.applyLight(postfx, zones, elapsed);
    this.applySky(postfx, elapsed);
    this.applyAir(postfx);
    this.applySurfaces(dt, outdoors, zone?.environment.wind ?? 1);
    this.applyFalling(postfx, outdoors);
    this.applySound(dt, audio, zones, listener, outdoors);
  }

  private applyLight(postfx: PostFX, zones: ZoneManager, elapsed: number): void {
    const climate = this.climate;
    // Rising is the morning half of the day, which is what the dawn tint keys on.
    const rising = climate.timeOfDay < 0.5;
    sampleAtmosphere(climate.sunElevation, rising, this.air);

    // Overcast has no stars behind it and no moon through it.
    const clear = 1 - this.cover();
    postfx.aimSun(climate.sunDirection);
    postfx.setAir(this.air.horizon, this.air.zenith, this.air.ground, this.air.sunDisc, this.air.warmth);
    postfx.setNight(
      this.air.stars * clear,
      // Drawn whatever the phase — a new moon is a hole in the stars, not an
      // absence — but the *light* it gives is the lit fraction's, below.
      this.air.moon * (0.35 + clear * 0.65),
      climate.moonPhase,
      climate.moonDirection,
      climate.settings.latitude,
      elapsed,
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
    zones.applyLightRig(this.air);

    // The lamps come up as the sun goes down, on the sun's elevation rather
    // than on the clock, so a winter afternoon lights itself early.
    const dusk = Math.max(0, Math.min(1, (4 - climate.sunElevation) / 10));
    setGlowLevel(dusk * dusk * (3 - 2 * dusk));
  }

  private applySky(postfx: PostFX, elapsed: number): void {
    planSky(this.climate, this.decks);
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
    }
    postfx.setDecks(this.decks, this.climate.wind.settings.windDirection, elapsed);
    this.applyPhenomena(postfx);
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
    const veil = this.decks[0].genus === 'cirrostratus' ? this.decks[0].amount : 0;
    const halo = veil * Math.max(0, Math.min(1, (elevation - 6) / 12));
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
      const taken = deck.amount * GENERA[deck.genus].opacity;
      total = total + taken - total * taken;
    }
    return total;
  }

  private applyAir(postfx: PostFX): void {
    const colour = AIR_COLOUR.setRGB(0, 0, 0);
    let mix = 0;
    let near = 1;
    let far = 1;
    for (const kind of WEATHER_KINDS) {
      const amount = this.climate.amountOf(kind.name);
      if (amount <= 0 || !kind.air) continue;
      const weight = amount * (kind.air.colourMix ?? 0);
      if (weight > 0) {
        colour.add(AIR_ONE.setHex(kind.air.colour ?? 0xffffff, THREE.SRGBColorSpace).multiplyScalar(weight));
        mix += weight;
      }
      near *= 1 - (1 - (kind.air.near ?? 1)) * amount;
      far *= 1 - (1 - (kind.air.far ?? 1)) * amount;
    }
    if (mix > 0) colour.multiplyScalar(1 / mix);
    postfx.setWeatherAir(colour, Math.min(mix, 0.95), near, far);
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

    // Sun and wind take it off; still, shaded air keeps it.
    const drying = 1 + Math.max(0, this.air.sunScale) * 1.2 + climate.wind.strength * 0.8;
    const wetTau = wetTarget > this.wet ? SOAK : DRY / drying;
    this.wet += (wetTarget - this.wet) * Math.min(1, dt / wetTau);

    // Snow lies while it falls and goes once it is above freezing, at a rate
    // the temperature decides rather than the weather.
    const thaw = Math.max(0, climate.temperature) / 6;
    const snowTau = snowTarget > this.lying ? SETTLE : THAW / (0.25 + thaw);
    this.lying += (snowTarget - this.lying) * Math.min(1, dt / snowTau);

    const gate = outdoors ? 1 : 0;
    finishUniforms.uWetness.value = this.wet * gate;
    finishUniforms.uSnow.value = this.lying * gate;

    // Groundcover goes white and short under snow, and heavy under rain.
    setCoverWeather(this.lying * gate, this.wet * gate);
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

  private applyFalling(postfx: PostFX, outdoors: boolean): void {
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

  private applySound(
    dt: number,
    audio: AudioEngine,
    zones: ZoneManager,
    listener: THREE.Vector3,
    outdoors: boolean,
  ): void {
    // A zone that stands outside the weather keeps its own air entirely. The
    // sound stage has a rain station on it, and it is an exhibit.
    if (zones.current?.place === undefined) {
      this.silence(audio, dt, listener);
      return;
    }

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

    // A zone that declared a rain bed of its own gets driven rather than
    // doubled: its model is already in the zone's bus, so it ducks, stops and
    // resumes with the rest of the air, and the soundscape updates it.
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
      this.rain = createRain(audio, { gain: 0.5, intensity: 0, surface });
      this.rain.output.connect(audio.dry);
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

const AIR_COLOUR = new THREE.Color();
const AIR_ONE = new THREE.Color();

function hashName(name: string): number {
  let value = 0x811c9dc5;
  for (let i = 0; i < name.length; i++) value = Math.imul(value ^ name.charCodeAt(i), 0x01000193);
  return (value >>> 0) % 100000;
}
