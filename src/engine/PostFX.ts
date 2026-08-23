import * as THREE from 'three';
import { applySway } from '../art/sway';
import { PixelStage } from './PixelStage';
import { GpuClock } from './GpuClock';
import { GTAOEffect } from './GTAO';
import { FogVolumesEffect, type FogVolume } from './FogVolumes';
import { WaterEffect } from './Water';
import { UnderwaterEffect } from './Underwater';
import { WATER_MATERIAL } from '../art/water';
import { GlassEffect } from './Glass';
import { glassUniforms } from '../art/glass';
import { ParticlesEffect } from './Particles';
import { setParticleDraw, particleUniforms } from '../art/particles';
import { BloomEffect } from './Bloom';
import { GlitchEffect } from './Glitch';
import { applyGlitchDisplacement, glitchUniforms, setGlitchErode } from '../art/glitch';
import { HorrorEffect } from './Horror';
import { applyHorrorDisplacement, horrorUniforms } from '../art/horror';
import { EffectMaskPass } from './EffectMask';
import { maskState } from '../art/effectId';
import { COLORBLIND_CODE, type ColorblindMode } from './RetroShader';
import { Sky, DEFAULT_SKY, type SkySettings, type DeckState } from './Sky';
import { fogUniforms } from './fog';
import { loadPreset, savePreset, clearPreset } from '../debug/presets';
import { GLOW_MATERIAL, TEXT_GLOW_ADDITIVE, TEXT_GLOW_MATERIAL } from '../art/glow';
import { COVER_MATERIAL, TUFT_MATERIAL, setCoverDraw } from '../art/cover';
import { COVER_POOL_SCALE } from '../art/cover-sample';
import { detailUniforms } from '../art/detail';
import { finishUniforms } from '../art/finish';
import { recipeUniforms } from '../art/recipes';
import type { Viewport } from './Viewport';

// The render pipeline: one PixelStage renders at chunky resolution, runs the
// screen-space effects there, then upscales with the edge lines, sRGB, dither
// and quantize. Every parameter persists to localStorage.

const PRESET = 'render';

export type QuantizeMode = 'off' | 'levels';

export interface RenderSettings {
  /** Chunky pixel size in *CSS* pixels, so the look survives a retina screen. */
  pixelSize: number;
  /** Coverage samples per chunky pixel, averaged inside one block. Clamped to what the driver offers. */
  samples: number;
  /**
   * Detail fading, in pixels per feature. `start` is where a feature begins to
   * dissolve; `span` is how many times wider the pixel gets before it is gone.
   */
  detail: { start: number; span: number };

  /** How much of one quantization step the dither spreads across. 1 dithers the whole gap. */
  ditherScale: number;
  /** Halftone dot cell, in chunky pixels — the threshold is sampled once per chunky pixel. */
  screenPeriod: number;

  quantize: QuantizeMode;
  /** Levels per channel. 2 is one bit; 8 is generous. */
  levels: number;

  /** `strength` is how dark full occlusion gets, 0..1; `radius` is its world reach in metres. */
  ao: { strength: number; radius: number };

  /**
   * `strength` is how much of the blurred emitters is added back, `radius` the
   * spread. No threshold: what blooms is what is made of `GLOW_MATERIAL`.
   */
  bloom: { strength: number; radius: number };

  /**
   * `waves` scales wave amplitude for every body of water; `reflections` runs
   * the screen-space march. Nothing per-pond: roughness is a vertex attribute.
   */
  water: { waves: number; reflections: boolean };

  /** `specular` scales the direct highlight, `environment` the sky/hemisphere reflection. */
  finish: { specular: number; environment: number };

  /** `refraction` scales how far a crystal bends the image behind it; 1 is what `GLASSES` says. Glass rides `water.reflections`. */
  glass: { refraction: number };

  /** Multipliers over the groundcover type table. `density` is the fraction of sampled blades drawn, 0..1. */
  cover: { density: number; height: number; width: number };

  /**
   * Multipliers over the particle system table. `density` is a prefix of the
   * buffer, not a rebuild; `shutter` is the exposure a streak integrates over.
   */
  particles: { density: number; size: number; shutter: number };

  /** Fraction of the view distance at which clutter stops being drawn. */
  clutterCull: number;

  sky: SkySettings;
  /** How dark the low deck's shadow falls on the ground, 0..1. Zero costs no noise at all. */
  cloudShadow: number;
  /** Drive the fog colour from the sky's horizon, so distance does not fade into a band of the wrong colour. */
  linkFogToSky: boolean;
  fogColor: string;
  fogNear: number;
  fogFar: number;
  /** Metres of altitude the haze thins by 1/e over. */
  fogHeight: number;
  /** How much of the sky's gradient the air takes, against the flat colour. */
  fogSky: number;
  /** How late the haze arrives across the fog's range. */
  fogRamp: number;
  /** The most of a thing the air may hide, above the horizon. */
  fogCeiling: number;
}

// Dialled in by hand against the world. The whole block is one look.
export const DEFAULT_RENDER: RenderSettings = {
  pixelSize: 2,
  samples: 4,
  detail: { start: 1, span: 16 },

  ditherScale: 1.25,
  screenPeriod: 3,

  quantize: 'levels',
  levels: 64,

  ao: { strength: 0.85, radius: 0.8 },

  bloom: { strength: 0.28, radius: 1 },

  water: { waves: 1, reflections: true },

  // Unity: the lobes are authored in the shader against these at 1.
  finish: { specular: 1, environment: 1 },

  // Unity: the indices in `GLASSES` are real refractive indices.
  glass: { refraction: 1 },

  // Unity: the type table is authored in real metres and blades per square metre.
  cover: { density: 1, height: 1, width: 1 },

  // A sixtieth of a second: a shutter near the frame time.
  particles: { density: 1, size: 1, shutter: 1 / 60 },

  clutterCull: 0.75,

  sky: { ...DEFAULT_SKY },
  cloudShadow: 0.35,
  linkFogToSky: true,
  fogColor: '#bcd4e6',
  fogNear: 25,
  fogFar: 140,

  fogHeight: 600,
  fogSky: 1,
  fogRamp: 1.5,
  fogCeiling: 0.85,
};

const QUANTIZE_CODE: Record<QuantizeMode, number> = { off: 0, levels: 1 };

/**
 * The fog's share of the far plane, and the near's share of the fog. Fog has to
 * finish before the cut, or geometry vanishes in mid-air while plainly visible.
 */
export const FOG_HEADROOM = 0.9;
const FOG_RISE = 0.6;

/** The view distance at which the option stops being a distance and falls back to the camera's own far plane. */
export const VIEW_UNLIMITED = 300;

/** A zone's fog, pulled under a far plane. Clamps and never extends. */
export function clampFog(
  near: number,
  far: number,
  viewFar: number,
): { near: number; far: number } {
  const fogFar = Math.min(far, viewFar * FOG_HEADROOM);
  return { near: Math.min(near, fogFar * FOG_RISE), far: fogFar };
}

/**
 * How many coverage samples the colour render actually gets. Above `max` is a
 * target that fails to build; under two is a framebuffer with nothing to average.
 */
export function resolveSamples(enabled: boolean, wanted: number, max: number): number {
  if (!enabled) return 0;
  const samples = Math.min(Math.floor(wanted), Math.floor(max));
  return samples < 2 ? 0 : samples;
}

/** The player's groundcover setting. */
export type CoverDensity = 'low' | 'medium' | 'high' | 'ultra';

/** Density each tier draws, over the type table's own. The pool is sampled at `COVER_POOL_SCALE`, so ultra draws all of it. */
const COVER_TIERS: Record<CoverDensity, number> = {
  low: 0.25,
  medium: 0.5,
  high: 0.85,
  ultra: COVER_POOL_SCALE,
};

/**
 * The part of the look that belongs to a place rather than to the game, applied
 * on top of `RenderSettings` so a threshold never overwrites the player's tuning.
 */
export interface ZoneAir {
  /** Whether the sky dome is drawn at all. Off indoors. */
  sky: boolean;
  fogColor: string;
  fogNear: number;
  fogFar: number;
  /** Placed fog volumes in this zone's world space: objects made of air, not the haze of distance. */
  fogVolumes?: readonly FogVolume[];
  /** Whether this zone has any water in it. Observed, not declared — the pass costs a whole-scene walk. */
  water?: boolean;
  /** Whether this zone has any crystal, glass or bubbles in it. Observed, not declared. */
  glass?: boolean;
  /** Whether anything in this zone is drawn on the particle layer. Observed by looking for the layer. */
  particles?: boolean;
}

export class PostFX {
  readonly settings: RenderSettings;

  private readonly viewport: Viewport;
  private readonly pixelStage: PixelStage;
  private readonly gtao: GTAOEffect;
  private readonly water: WaterEffect;
  private readonly underwater: UnderwaterEffect;
  private readonly glass: GlassEffect;
  private readonly fog: FogVolumesEffect;
  private readonly particles: ParticlesEffect;
  private readonly bloom: BloomEffect;
  private readonly glitchFx: GlitchEffect;
  private readonly horrorFx: HorrorEffect;
  private readonly maskFx: EffectMaskPass;
  private readonly sky = new Sky();
  /** Null until a zone is entered, which on a real boot is immediately. */
  private air: ZoneAir | null = null;
  /** What the atmosphere painted the horizon this frame. The fog follows it. */
  /** What the atmosphere painted this frame. The dome and the fog both follow it. */
  private readonly horizon = new THREE.Color(0xcce6f9);
  private readonly zenith = new THREE.Color(0x458acf);
  private readonly groundBand = new THREE.Color(0x656d72);
  private readonly sunTint = new THREE.Color(0xfff6e0);
  private skyWarmth = 0.3;
  private readonly weatherAir = new THREE.Color(0xffffff);
  private weatherMix = 0;
  private weatherNear = 1;
  private weatherFar = 1;
  /** Whether anything is falling. The pass costs a scene walk either way. */
  private weatherParticles = false;
  private shadowScale = 1;
  private decks: readonly DeckState[] | null = null;

  /**
   * Layered over `settings` rather than written into it: the settings are a
   * saved preset, and a switch must not overwrite tuning underneath it.
   */
  private dither = true;
  private pixelate = true;
  private antialias = true;
  private occlusion = true;
  /** Dev-only, unlike the others here. See `setFogVolumes`. */
  private volumetrics = true;
  /** Dev-only, for the fog volumes' reason. See `setGlitch`. */
  private glitching = true;
  /** Dev-only, glitch's twin. See `setHorror`. */
  private haunting = true;
  private glow = true;
  /** The accessibility switch, not a look setting. See `setWaterMotion`. */
  private waves = true;
  /** Dev-only, like the fog volumes: a finish is what a prop is made of. */
  private finished = true;
  /** Dev-only, `finished`'s companion. See `setRecipes`. */
  private recipes = true;
  /** The player's groundcover tier. See `setGroundcover`. */
  private groundcover: CoverDensity = 'high';
  /** Whether particles are drawn at all. The dev switch; the accessibility one removes weather only, in `art/particles`. */
  private particulate = true;
  private colorblind: ColorblindMode = 'off';
  private colorblindStrength = 1;
  /** How far the player can see, in metres, or null for the camera's own far plane. */
  private viewDistance: number | null = null;
  /** The far plane the camera was built with, and what `null` above means. */
  private readonly baseFar: number;

  /** Per-pass GPU milliseconds. Idle until switched on, and `available` is false where the driver will not answer. */
  readonly gpu: GpuClock;

  /** Set for the duration of `prewarm`, and read by `render`. */
  private warming = false;

  constructor(viewport: Viewport) {
    this.viewport = viewport;
    this.baseFar = viewport.camera.far;
    // Shallow spread: a preset saved before the sky existed would leave `sky`
    // undefined. Nested groups are merged a level deeper.
    const saved = loadPreset<RenderSettings>(PRESET) ?? {};
    this.settings = {
      ...DEFAULT_RENDER,
      ...saved,
      sky: { ...DEFAULT_SKY, ...saved.sky },
      ao: { ...DEFAULT_RENDER.ao, ...saved.ao },
      bloom: { ...DEFAULT_RENDER.bloom, ...saved.bloom },
      water: { ...DEFAULT_RENDER.water, ...saved.water },
      finish: { ...DEFAULT_RENDER.finish, ...saved.finish },
      glass: { ...DEFAULT_RENDER.glass, ...saved.glass },
      // A preset from the shell-era cover stored different keys with different units.
      cover:
        saved.cover && !('shells' in saved.cover)
          ? { ...DEFAULT_RENDER.cover, ...saved.cover }
          : { ...DEFAULT_RENDER.cover },
      particles: { ...DEFAULT_RENDER.particles, ...saved.particles },
      detail: { ...DEFAULT_RENDER.detail, ...saved.detail },
    };
    // An unknown mode would put `undefined` into the uniform and take the pass down.
    if (!(this.settings.quantize in QUANTIZE_CODE)) this.settings.quantize = 'levels';

    viewport.scene.add(this.sky.mesh);
    this.hideGlowFromEdges(viewport.scene);

    this.pixelStage = new PixelStage(1, viewport.scene, viewport.camera);
    this.gpu = new GpuClock(viewport.renderer);
    this.pixelStage.clock = this.gpu;
    // The whole chain, so its upscale goes to the default framebuffer.
    this.pixelStage.renderToScreen = true;
    // The edge detector re-renders the scene with `MeshNormalMaterial` as
    // `scene.overrideMaterial`, which bypasses the wind displacement — so a
    // swaying plant would be outlined at the position it had standing still.
    applySway(this.pixelStage.normalMaterial);
    // The same for the glitch stage's vertex displacement.
    applyGlitchDisplacement(this.pixelStage.normalMaterial);
    // And for horror: a trembling figure's outline trembles with it.
    applyHorrorDisplacement(this.pixelStage.normalMaterial);

    // The effect slot, in order, and the order is the design: shading first,
    // then surfaces that read what is drawn, then what stands between them and
    // the eye.
    this.gtao = new GTAOEffect();
    this.water = new WaterEffect();
    // The volume of water rather than its boundary, so it runs over every pixel.
    this.underwater = new UnderwaterEffect();
    // The last of the surfaces, and the one that reads all the others.
    this.glass = new GlassEffect();
    this.fog = new FogVolumesEffect();
    // After the fog and before bloom, and both of those are load-bearing.
    this.particles = new ParticlesEffect();
    this.bloom = new BloomEffect();
    // The owner-id mask both corruption passes are gated by. A passthrough.
    this.maskFx = new EffectMaskPass();
    // Under the glitch pass: darkness pools over the bloomed, fogged scene.
    this.horrorFx = new HorrorEffect();
    // Last in the chain and still upstream of the retro pass, so corruption is
    // dithered into the world's look rather than floating over it.
    this.glitchFx = new GlitchEffect();
    this.pixelStage.effects.push(
      this.gtao,
      this.water,
      this.underwater,
      this.glass,
      this.fog,
      this.particles,
      this.bloom,
      this.maskFx,
      this.horrorFx,
      this.glitchFx,
    );

    this.resize();
    this.apply();
  }

  /** Null falls back to the tuned settings. Applied immediately: this runs at full black during a transition. */
  setEnvironment(air: ZoneAir | null): void {
    this.air = air;
    // Swapped at full black, so a volume never survives a threshold.
    this.fog.setVolumes(air?.fogVolumes ?? []);
    // A pass that walks the scene graph for water must not run in a room with none.
    this.water.setActive(air?.water ?? false);
    this.glass.setActive(air?.glass ?? false);
    this.particles.setActive((air?.particles ?? false) || this.weatherParticles);
    this.apply();
  }

  /** Per frame: the sun moves, so nothing may bake or rate-limit what depends on it. */
  aimSun(direction: THREE.Vector3): void {
    this.sky.aimAt(direction);
  }

  /** The colours the atmosphere decided this frame, over the authored sky. */
  setAir(horizon: THREE.Color, zenith: THREE.Color, ground: THREE.Color, sun: THREE.Color, warmth: number): void {
    this.horizon.copy(horizon);
    this.zenith.copy(zenith);
    this.groundBand.copy(ground);
    this.sunTint.copy(sun);
    this.skyWarmth = warmth;
    this.sky.setAir(horizon, zenith, ground, sun, warmth);
    this.applyFog();
  }

  /** Weather draws on the particle layer without being part of any zone. */
  setPrecipitating(falling: boolean): void {
    if (this.weatherParticles === falling) return;
    this.weatherParticles = falling;
    this.particles.setActive((this.air?.particles ?? false) || falling);
    this.apply();
  }

  setNight(stars: number, moon: number, bright: number, direction: THREE.Vector3, latitude: number, spin: number): void {
    this.sky.setNight(stars, moon, bright, direction, latitude, spin);
  }

  /**
   * How wet the world is, for the occlusion. A wet surface is darker, so less
   * light bounces back out of a crevice into it — the pit genuinely reads
   * deeper against the open ground beside it, and water gathers down there
   * besides. Modest: this occlusion is screen-space, and leaning on it hard
   * reads as grime rather than as depth.
   */
  setSurfaceWet(wet: number): void {
    this.gtao.strength = this.settings.ao.strength * (1 + wet * 0.35);
  }

  setSkyLight(direction: THREE.Vector3, strength: number): void {
    this.sky.setSkyLight(direction, strength);
  }

  setPhenomena(belt: number, halo: number, bow: number, shadowTop: number): void {
    this.sky.setPhenomena(belt, halo, bow, shadowTop);
  }

  setDecks(
    decks: readonly DeckState[],
    windBearing: number,
    windStrength: number,
    elapsed: number,
    dt: number,
  ): void {
    this.sky.setDecks(decks, windBearing, windStrength, elapsed, dt);
    this.decks = decks;
    this.sky.setCloudShadow(this.settings.cloudShadow * this.shadowScale, decks);
  }

  /** How much of a shadow the low deck is in a position to cast. See the rig. */
  setCloudShadowScale(scale: number): void {
    this.shadowScale = scale;
    if (this.decks) this.sky.setCloudShadow(this.settings.cloudShadow * scale, this.decks);
  }

  /**
   * The weather's bias on this zone's own air. Layered rather than written in,
   * as `ZoneAir` is over `RenderSettings`: a shower must not overwrite what the
   * place is.
   */
  setWeatherAir(colour: THREE.Color, mix: number, near: number, far: number): void {
    this.weatherAir.copy(colour);
    this.weatherMix = mix;
    this.weatherNear = near;
    this.weatherFar = far;
    this.applyFog();
  }

  setDither(enabled: boolean): void {
    this.dither = enabled;
    this.apply();
  }

  /** Drops the chunky pixels to one device pixel. The edge detection stays. */
  setPixelation(enabled: boolean): void {
    this.pixelate = enabled;
    this.apply();
  }

  /** Off is genuinely a single sample, not a cheaper multisample. */
  setAntialias(enabled: boolean): void {
    this.antialias = enabled;
    this.apply();
  }

  setAmbientOcclusion(enabled: boolean): void {
    this.occlusion = enabled;
    this.apply();
  }

  /** Dev-facing only: a fog volume is part of the world, not a flourish over it. */
  setFogVolumes(enabled: boolean): void {
    this.volumetrics = enabled;
    this.apply();
  }

  /** Dev-facing only, by the fog volumes' argument. */
  setGlitch(enabled: boolean): void {
    this.glitching = enabled;
  }

  /** Dev-facing only, as glitch. */
  setHorror(enabled: boolean): void {
    this.haunting = enabled;
  }

  /** The emitters still glow; what goes is the bleed. */
  setBloom(enabled: boolean): void {
    this.glow = enabled;
    this.apply();
  }

  /**
   * An accessibility switch rather than a graphics one: no water is removed,
   * it is held still. Waves and drifting foam together.
   */
  setWaterMotion(enabled: boolean): void {
    this.waves = enabled;
    this.apply();
  }

  /** Off, every surface is the plain Lambert underneath. Dev-facing only. */
  setFinish(enabled: boolean): void {
    this.finished = enabled;
    this.apply();
  }

  /** Leaves the finish the recipes are added to. Dev-facing only. */
  setRecipes(enabled: boolean): void {
    this.recipes = enabled;
    this.apply();
  }

  setGroundcover(density: CoverDensity): void {
    this.groundcover = density;
    this.apply();
  }

  /**
   * How far the player can see, in metres; null is the camera's own far plane.
   * Drives the far plane, both fog distances, the sky radius and the clutter
   * cull together in `apply`, and only ever pulls the view in.
   */
  setViewDistance(metres: number | null): void {
    this.viewDistance = metres;
    this.apply();
  }

  /** How far from the camera clutter is still worth drawing. Infinite by default. */
  get clutterRadius(): number {
    if (this.viewDistance === null) return Infinity;
    return this.viewDistance * this.settings.clutterCull;
  }

  /** Particles on or off. Off skips the pass and every particle draw with it. */
  setParticles(enabled: boolean): void {
    this.particulate = enabled;
    this.apply();
  }

  /** `strength` is 0..1, and 0 is the untouched picture rather than nearly one. */
  setColorblind(mode: ColorblindMode, strength: number): void {
    this.colorblind = mode;
    this.colorblindStrength = Math.min(Math.max(strength, 0), 1);
    this.apply();
  }

  apply(): void {
    const s = this.settings;

    // Authored in CSS pixels, applied in device pixels, so DPR does not change the look.
    const scale = this.viewport.renderer.getPixelRatio();
    const devicePixels = this.pixelate ? Math.max(1, Math.round(s.pixelSize * scale)) : 1;
    if (this.pixelStage.pixelSize !== devicePixels) this.pixelStage.setPixelSize(devicePixels);
    this.pixelStage.setSamples(
      resolveSamples(this.antialias, s.samples, this.viewport.renderer.capabilities.maxSamples),
    );

    this.gtao.enabled = this.occlusion && s.ao.strength > 0;
    this.gtao.strength = s.ao.strength;
    this.gtao.radius = s.ao.radius;

    // A zone with no volumes skips the pass rather than marching to find nothing.
    this.fog.enabled = this.volumetrics && this.fog.hasVolumes;

    // Water is part of the place, not a player option.
    this.water.enabled = this.water.hasWater;
    const w = WATER_MATERIAL.uniforms;
    w.uWaveScale.value = s.water.waves;
    // Layered over the tuning rather than written into it, as the dither is.
    w.uWaterMotion.value = this.waves ? 1 : 0;
    // A real switch, not a strength of zero: off, the march does not run.
    w.uReflections.value = s.water.reflections ? 1 : 0;

    // Glass follows water and rides its reflection switch: one march, one decision.
    this.glass.enabled = this.glass.hasGlass;
    glassUniforms.uGlassReflections.value = s.water.reflections ? 1 : 0;
    glassUniforms.uGlassRefraction.value = s.glass.refraction;
    // Indoors there is no sky to mirror.
    glassUniforms.uGlassSky.value = this.air === null || this.air.sky ? 1 : 0;

    this.bloom.enabled = this.glow && s.bloom.strength > 0;
    this.bloom.strength = s.bloom.strength;
    this.bloom.radius = s.bloom.radius;

    // The finish stage lives in the shared art material, not in a pass.
    finishUniforms.uFinishOn.value = this.finished ? 1 : 0;
    finishUniforms.uFinishSpecular.value = s.finish.specular;
    finishUniforms.uFinishEnv.value = s.finish.environment;
    finishUniforms.uFinishSky.value = this.air === null || this.air.sky ? 1 : 0;
    // The recipes ride inside the finish stage; this is the separate switch.
    // Their clocks ride the same reduced-motion switch the water does.
    recipeUniforms.uRecipeOn.value = this.recipes ? 1 : 0;
    recipeUniforms.uRecipeMotion.value = this.waves ? 1 : 0;

    setCoverDraw(
      (COVER_TIERS[this.groundcover] / COVER_POOL_SCALE) * s.cover.density,
      s.cover.height,
      s.cover.width,
    );

    detailUniforms.uDetailStart.value = s.detail.start;
    detailUniforms.uDetailSpan.value = s.detail.span;

    // Presence as well as the switch, exactly as water and glass are gated.
    this.particles.enabled = this.particulate && this.particles.hasParticles;
    setParticleDraw(this.particulate, s.particles.density, s.particles.size);
    particleUniforms.uShutter.value = s.particles.shutter;

    const u = this.pixelStage.outputUniforms;
    u.uPixelSize.value = devicePixels;
    // In steps rather than absolute colour, so `levels` and the dither stay independent.
    u.uDitherScale.value = this.dither ? s.ditherScale : 0;
    u.uPeriod.value = s.screenPeriod;
    u.uQuantize.value = QUANTIZE_CODE[s.quantize];
    u.uLevels.value = s.levels;
    u.uColorblind.value = COLORBLIND_CODE[this.colorblind];
    u.uColorblindStrength.value = this.colorblindStrength;

    this.sky.apply(s.sky);
    // Back over the top: `apply` writes the authored dome, and the sky's colour
    // belongs to the atmosphere table now. Without this a settings change
    // flashes the noon sky for one frame at midnight.
    this.sky.setAir(this.horizon, this.zenith, this.groundBand, this.sunTint, this.skyWarmth);
    this.sky.mesh.visible = this.air === null || this.air.sky;

    // The far plane, and the frustum culling every prop gets from it. The sky
    // follows it in `Sky.follow`, the clutter in `clutterRadius`.
    const camera = this.viewport.camera;
    const far = this.viewDistance ?? this.baseFar;
    if (camera.far !== far) {
      camera.far = far;
      camera.updateProjectionMatrix();
    }

    this.applyFog();
  }

  /**
   * The fog, and the clear colour behind it. Split out of `apply` because the
   * sun moves: this runs every frame off the atmosphere and the weather, while
   * the rest of `apply` runs when a setting changes.
   */
  private applyFog(): void {
    const s = this.settings;
    const fog = this.viewport.scene.fog;
    if (!(fog instanceof THREE.Fog)) return;
    const far = this.viewDistance ?? this.baseFar;
    const outdoors = this.air === null || this.air.sky;

    // Indoors the fog is the darkness at the end of the room, not the horizon.
    if (!outdoors) {
      fog.color.set(this.air?.fogColor ?? s.fogColor);
    } else if (s.linkFogToSky) {
      fog.color.copy(this.horizon);
    } else {
      fog.color.set(this.air?.fogColor ?? s.fogColor);
    }
    if (outdoors && this.weatherMix > 0) fog.color.lerp(this.weatherAir, this.weatherMix);

    // Clamped under the far plane, never extended: a cut with no fade in front
    // of it is geometry disappearing in mid-air.
    const near = (this.air?.fogNear ?? s.fogNear) * (outdoors ? this.weatherNear : 1);
    const distance = (this.air?.fogFar ?? s.fogFar) * (outdoors ? this.weatherFar : 1);
    const range = clampFog(near, distance, far);
    fog.near = range.near;
    fog.far = range.far;

    fogUniforms.uFogHeight.value = s.fogHeight;
    fogUniforms.uFogSky.value = outdoors ? s.fogSky : 0;
    fogUniforms.uFogRamp.value = s.fogRamp;
    // The ceiling is a fact about outdoor air.
    fogUniforms.uFogCeiling.value = outdoors ? s.fogCeiling : 1;
    // The clear colour shows where nothing was drawn; with the dome off that
    // is every pixel the geometry does not cover.
    this.viewport.renderer.setClearColor(fog.color, 1);
    // After the air has had its say, so an interior's short fog shortens the AO.
    this.gtao.setFog(fog.near, fog.far);
  }

  /**
   * Keeps glow and groundcover out of the edge detector. The normal pass has no
   * concept of transparency, and cover builds its blades in its own vertex
   * shader, so both come back wrong. `overrideMaterial` being set identifies it.
   */
  private hideGlowFromEdges(scene: THREE.Scene): void {
    scene.onBeforeRender = (_renderer, rendered) => {
      const colourPass = (rendered as THREE.Scene).overrideMaterial === null;
      GLOW_MATERIAL.visible = colourPass;
      TEXT_GLOW_MATERIAL.visible = colourPass;
      TEXT_GLOW_ADDITIVE.visible = colourPass;
      COVER_MATERIAL.visible = colourPass;
      TUFT_MATERIAL.visible = colourPass;
    };
  }

  /** Render height in chunky pixels, for the groundcover width clamp. */
  get artHeight(): number {
    return this.pixelStage.renderHeight;
  }

  /** The renderer, for `ZoneManager`'s ahead-of-time shader compiles. */
  get renderer(): THREE.WebGLRenderer {
    return this.viewport.renderer;
  }

  /**
   * Compiles every screen-space program by drawing frames nothing will see, so
   * the first pond does not stall the frame a fade lifts. Two frames: the art
   * materials compile the glitch discard out where nothing is glitched.
   */
  prewarm(): void {
    const held = this.pixelStage.effects.map((effect) => effect.enabled);
    this.warming = true;
    for (const eroding of [true, false]) {
      setGlitchErode(eroding);
      this.render(0);
    }
    this.warming = false;
    this.pixelStage.effects.forEach((effect, i) => {
      effect.enabled = held[i];
    });
  }

  render(elapsed: number): void {
    // Per-frame counterparts to switches turned off in `Viewport`, here because
    // this is the one place a frame is drawn.
    const { renderer } = this.viewport;
    renderer.info.reset();
    renderer.shadowMap.needsUpdate = true;

    this.sky.follow(this.viewport.camera, elapsed);
    // The frame's one matrix update. `Viewport` turns three's automatic one off,
    // because this pipeline renders up to eight times a frame. After
    // `sky.follow`, the last thing in the frame to write a transform.
    this.viewport.scene.updateMatrixWorld();
    // Asked before the frame: the pass that needs it runs inside the effect chain.
    this.underwater.setDepth(this.water.submersion(this.viewport.scene, this.viewport.camera));
    // Per frame rather than in `apply`: the count changes as the player walks.
    this.glitchFx.enabled = this.glitching && glitchUniforms.uGlitchCount.value > 0;
    this.horrorFx.enabled = this.haunting && horrorUniforms.uHorrorCount.value > 0;
    // Only when an activity packed an owned volume, and only for passes that read it.
    this.maskFx.enabled =
      (this.glitchFx.enabled && maskState.glitch > 0) ||
      (this.horrorFx.enabled && maskState.horror > 0);
    // The warm frame runs every pass. Last, so it overrides the presence gates.
    if (this.warming) for (const effect of this.pixelStage.effects) effect.enabled = true;

    this.pixelStage.time = elapsed;
    this.pixelStage.render(renderer, null);
    // Collects whatever finished a few frames ago rather than waiting on this one.
    this.gpu.collect();
  }

  resize(): void {
    // Drawing-buffer pixels, which is what the stage sizes its chunky targets off.
    const size = this.viewport.renderer.getDrawingBufferSize(new THREE.Vector2());
    this.pixelStage.setSize(size.x, size.y);
    // DPR can change when a window moves between monitors, and pixel size derives from it.
    this.apply();
  }

  save(): boolean {
    return savePreset(PRESET, this.settings);
  }

  reset(): void {
    clearPreset(PRESET);
    Object.assign(this.settings, structuredClone(DEFAULT_RENDER));
    this.apply();
  }

  dispose(): void {
    // Left set, the hook would keep flipping a shared material for a dead pipeline.
    this.viewport.scene.onBeforeRender = () => {};
    GLOW_MATERIAL.visible = true;
    TEXT_GLOW_MATERIAL.visible = true;
    TEXT_GLOW_ADDITIVE.visible = true;
    this.viewport.scene.remove(this.sky.mesh);
    this.sky.dispose();
    this.pixelStage.dispose();
  }
}
