import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { applySway } from '../art/sway';
import { PixelStage } from './PixelStage';
import { GTAOEffect } from './GTAO';
import { FogVolumesEffect, type FogVolume } from './FogVolumes';
import { WaterEffect } from './Water';
import { UnderwaterEffect } from './Underwater';
import { WATER_MATERIAL } from '../art/water';
import { ParticlesEffect } from './Particles';
import { setParticleDraw, particleUniforms } from '../art/particles';
import { BloomEffect } from './Bloom';
import { RetroShader, COLORBLIND_CODE, type ColorblindMode } from './RetroShader';
import { Sky, DEFAULT_SKY, type SkySettings } from './Sky';
import { loadPreset, savePreset, clearPreset } from '../debug/presets';
import { GLOW_MATERIAL, TEXT_GLOW_ADDITIVE, TEXT_GLOW_MATERIAL } from '../art/glow';
import { COVER_MATERIAL, TUFT_MATERIAL, setCoverDraw } from '../art/cover';
import { detailUniforms } from '../art/detail';
import { finishUniforms } from '../art/finish';
import type { Viewport } from './Viewport';

/**
 * The render pipeline.
 *
 * ```
 * scene ─► PixelStage ──────────────────────────► OutputPass ─► RetroShader ─► screen
 *          chunky pixels, edge lines,              tone map     vignette,
 *          GTAO ─► water ─► fog ─► bloom, upscale  and sRGB     dither, quantize
 * ```
 *
 * `PixelStage` is ours (SHADERS-AND-MATERIALS.md, R0): it renders at chunky resolution,
 * runs screen-space effects there, and upscales with the edge lines — the
 * job `RenderPixelatedPass` used to do, plus the effect slot it did not have.
 *
 * The order is load-bearing. `OutputPass` is where linear light becomes sRGB,
 * and spacing quantization steps evenly is only correct on the display side of
 * that conversion — quantizing in linear light would bunch every level into
 * the shadows. The dither *within* a step is a separate question and is
 * resolved in linear light; see `quantizeLevels`.
 *
 * **The colour is the scene's.** No palette, no colour set, no swatches. Every
 * surface is flat-shaded vertex colour out of `art/palette.ts`, lit and fogged;
 * this pass quantizes whatever that produces and nothing here decides what the
 * game is allowed to look like.
 *
 * Every parameter persists to localStorage, so a look dialled in on a phone is
 * still there after a reload.
 */

const PRESET = 'render';

export type QuantizeMode = 'off' | 'levels';

export interface RenderSettings {
  /** Chunky pixel size in *CSS* pixels, so the look survives a retina screen. */
  pixelSize: number;
  /**
   * Coverage samples per chunky pixel. Clamped to what the driver offers.
   *
   * The scene is rasterised at a fraction of display resolution, so a
   * floorboard seam or a lit batten edge is narrower than one pixel and either
   * wins its single sample or vanishes — which is a coin toss that re-flips
   * every time the camera turns. Sampling coverage several times per pixel
   * makes each block an honest average of the geometry under it. The blocks
   * stay blocks; this happens *inside* one.
   */
  samples: number;
  /**
   * Detail fading, in pixels per feature (`art/detail.ts`).
   *
   * The other half of the antialiasing answer, and the half multisampling
   * cannot reach: a feature narrower than a pixel is below Nyquist, so more
   * samples move the threshold and never cross it. `start` is where a feature
   * begins to dissolve into its surroundings — 1 is "as soon as it is narrower
   * than a pixel", which is exactly when it stops being sampleable. `span` is
   * how many times wider the pixel gets before it is gone.
   */
  detail: { start: number; span: number };
  normalEdgeStrength: number;
  depthEdgeStrength: number;

  /**
   * How much of one quantization step the dither spreads across.
   *
   * The only scale that makes sense. Dithering works across the gap between
   * two adjacent levels, and how wide that gap is changes every time `levels`
   * changes; held in absolute colour, a value tuned at 8 levels is far too
   * weak at 4 and the banding it was hiding comes straight back.
   *
   * 1 dithers the whole gap, which is the textbook amount and removes banding
   * outright. Below that, the ends of each band go flat and some banding
   * survives on purpose. Above, nothing is ever flat and it reads as grain in
   * its own right.
   */
  ditherScale: number;
  /**
   * Halftone dot cell, in chunky pixels.
   *
   * Counted in chunky pixels rather than device pixels because the threshold
   * is sampled once per chunky pixel — it has to be, or the dither would vary
   * *inside* a block and dissolve the pixelation. The consequence is that the
   * dot's size on screen is this times `pixelSize`, so raising one usually
   * means lowering the other.
   */
  screenPeriod: number;

  quantize: QuantizeMode;
  /** Levels per channel. 2 is one bit; 8 is generous. */
  levels: number;

  /**
   * Ambient occlusion (SHADERS-AND-MATERIALS.md §1). `strength` is how dark full occlusion
   * gets, 0..1; `radius` is the world-space reach in metres — how far apart
   * two surfaces can be and still shade each other.
   */
  ao: { strength: number; radius: number };

  /**
   * Bloom (SHADERS-AND-MATERIALS.md §3). `strength` is how much of the blurred emitters is
   * added back; `radius` is the spread, as a multiple of the blur chain's
   * own texel offsets.
   *
   * There is no threshold, and there is deliberately nowhere to put one — see
   * `Bloom.ts`. What blooms is what is made of `GLOW_MATERIAL`.
   */
  bloom: { strength: number; radius: number };

  /**
   * Water (SHADERS-AND-MATERIALS.md §7). `waves` scales the wave amplitude for every body of
   * water in the game; `reflections` runs the screen-space march, and off it
   * falls back to the analytic sky alone — which is the same colour, minus the
   * huts and banks that would have been in it.
   *
   * There is nothing per-pond here on purpose. Colour is global because water
   * is one material, and how rough a particular pool is rides on a per-vertex
   * attribute placed with the geometry. See `art/water.ts`.
   */
  water: { waves: number; reflections: boolean };

  /**
   * The finish stage (SHADERS-AND-MATERIALS.md, Track A / M0). `specular`
   * scales the direct highlight, `environment` the sky/hemisphere reflection.
   *
   * Nothing per-prop here on purpose: what a surface is made of rides on a
   * per-vertex attribute baked with the geometry. See `art/finish.ts`.
   */
  finish: { specular: number; environment: number };

  /**
   * Groundcover (GROUNDCOVER.md). Tuning multipliers over the type table.
   *
   * `density` is the fraction of sampled blades drawn, 0..1 — the cost knob.
   * `height` and `width` scale every blade live, no rebuild.
   */
  cover: { density: number; height: number; width: number };

  /**
   * Particles (PARTICLES.md). Tuning multipliers over the system table.
   *
   * `density` is the fraction of each system's instances drawn — the cost knob,
   * and a prefix of the buffer rather than a rebuild. `size` scales every
   * particle live. `shutter` is the exposure a streak is integrated over, which
   * is the one number that decides whether rain reads as rain.
   */
  particles: { density: number; size: number; shutter: number };

  /**
   * Fraction of the view distance at which clutter stops being drawn
   * (VIEW-DISTANCE.md). The player sets the distance; this decides how far
   * inside it the grass goes, which is where the frame-rate win actually is.
   */
  clutterCull: number;

  vignetteStrength: number;
  vignetteRadius: number;
  vignetteSoftness: number;

  sky: SkySettings;
  /**
   * Drive the fog colour from the sky's horizon.
   *
   * Distant geometry fades to the fog colour. If that disagrees with the
   * horizon it fades into a band of the wrong colour hanging in front of the
   * sky, which reads as a bug rather than as distance. On by default; turn it
   * off only to set the two deliberately apart.
   */
  linkFogToSky: boolean;
  fogColor: string;
  fogNear: number;
  fogFar: number;
}

// Dialled in by hand against the world. The whole block is a look, not a set
// of independent numbers — a fine pixel with a coarse screen reads differently
// from the reverse, and the dither spread is chosen against the level count.
export const DEFAULT_RENDER: RenderSettings = {
  pixelSize: 2,
  // Four. Only the colour render of the two scene renders is multisampled, and
  // MSAA shades once per triangle — so what multiplies is coverage, depth
  // testing and bandwidth, not shading. Eight is worth trying on a desktop card.
  samples: 4,
  // A long fade: one pixel per feature out to sixteen, four octaves. Found by
  // eye, and wider than the two octaves trilinear filtering uses between mip
  // levels — a short ramp puts a visible ring on the floor where the seams give
  // out, and nothing on screen should announce where the detail went.
  detail: { start: 1, span: 16 },
  // The interior crease line, and the quieter of the two on purpose. Grading the
  // thresholds means far more pixels now carry *some* normal edge, so the same
  // strength reads much heavier than it used to; and a world built of planks and
  // battens has a crease everywhere you look. The silhouette below keeps its
  // full weight — that is the line doing the work of making this look drawn.
  normalEdgeStrength: 0.2,
  depthEdgeStrength: 0.5,

  // A little over a full step: the gap between two levels dithers almost
  // exactly, so tones come out where they should with the halftone still
  // legible on the flat. Under 1 is the opposite — bands with clean centres.
  // Paired with `levels` below: a step is the unit here, so the two move
  // together.
  ditherScale: 1.25,
  // Three chunky pixels, so six device pixels at the pixel size above: a dot
  // small enough to read as a print screen rather than as a pattern.
  screenPeriod: 3,

  quantize: 'levels',
  // Sixty-four. Costs nothing — it is a uniform, and the shader does identical
  // arithmetic whatever it holds — so the only question is the look. High
  // enough that the quantization is not the thing you see, which leaves the
  // halftone doing the work instead of fighting the banding.
  //
  // The gradient that sets this is a point light half a metre from a wall: it
  // runs the whole range across one surface, where a distant sun leaves a
  // flat-shaded wall at a single value and no step ever shows.
  levels: 64,

  // Strength short of full black: GTAO's corners should read as seated, not
  // sooted, and the halftone will texture whatever gradient this produces.
  // Radius from the plan — under a metre is contact shadow, not room gloom.
  ao: { strength: 0.85, radius: 0.8 },

  // Restrained, and then halved again after looking at it. Every emitter in the
  // game is a small flame or a lit window against a dim surround, and anything
  // near 1 puts a halo across half a hut — which reads as a bug in the lamp
  // rather than as light. Radius 1 is the chain's natural spread; wider starts
  // detaching the glow from the thing making it.
  bloom: { strength: 0.28, radius: 1 },

  // Full amplitude and reflections on. Both are here to be turned *down* while
  // looking at water rather than to be lived at some other value — the wave
  // heights are authored in metres in `art/water.ts` against a pond you stand
  // beside, and this is the multiplier for asking what half of that looks like.
  water: { waves: 1, reflections: true },

  // Unity both: the lobes are authored in the shader against these at 1, and
  // the finish profiles themselves live in `FINISHES`, not here.
  finish: { specular: 1, environment: 1 },

  // Unity: the type table in world/ground.ts is authored in real metres and
  // real blades per square metre, and these only bend it for tuning.
  cover: { density: 1, height: 1, width: 1 },

  // Unity again, and a sixtieth of a second — a shutter near the frame time is
  // what a camera would integrate, and it is the number rain's streaks fall out
  // of. See PARTICLES.md §3.
  particles: { density: 1, size: 1, shutter: 1 / 60 },

  // Three quarters, so grass thins out where the fog is already most of the
  // way through hiding it rather than evaporating in clear air ahead of you.
  clutterCull: 0.75,

  // Off. It read as a bright oval hanging in the middle of the screen, which
  // is what a vignette is, and it was not wanted. The shader path is still
  // there in case a zone ever wants to close in around you; nothing uses it.
  vignetteStrength: 0,
  vignetteRadius: 0.5,
  vignetteSoftness: 0.7,

  sky: { ...DEFAULT_SKY },
  linkFogToSky: true,
  fogColor: '#bcd4e6',
  fogNear: 25,
  fogFar: 140,
};

const QUANTIZE_CODE: Record<QuantizeMode, number> = { off: 0, levels: 1 };

/**
 * The fog's share of the far plane, and the near's share of the fog.
 *
 * Fog has to finish before the cut or geometry vanishes in mid-air while it is
 * still plainly visible; near has to stay under far or the two invert. Below
 * `SKY_FRACTION`, so the dome is always behind solid fog — see `Sky.ts`.
 */
export const FOG_HEADROOM = 0.9;
const FOG_RISE = 0.6;

/**
 * The view distance at which the option stops being a distance.
 *
 * The top of the player's slider, and above every zone's own fog, so at this
 * setting the clamp cannot bite. Here rather than with the menu because what it
 * means — fall back to the camera's own far plane — is an engine fact.
 */
export const VIEW_UNLIMITED = 300;

/**
 * A zone's fog, pulled under a far plane (VIEW-DISTANCE.md).
 *
 * **Clamps and never extends.** A zone says what the air in it is like and this
 * can only take away — so indoors, where the fog is already a fraction of any
 * view distance, it does nothing at all.
 */
export function clampFog(
  near: number,
  far: number,
  viewFar: number,
): { near: number; far: number } {
  const fogFar = Math.min(far, viewFar * FOG_HEADROOM);
  return { near: Math.min(near, fogFar * FOG_RISE), far: fogFar };
}

/**
 * How many coverage samples the colour render actually gets.
 *
 * Its own function so it can be checked without a GPU, which is the whole of
 * what a headless run can say about multisampling. Asking for more than
 * `maxSamples` is a render target that fails to build; one sample is a
 * multisampled framebuffer with nothing to average, so anything under two is
 * off outright rather than an expensive way to change nothing.
 */
export function resolveSamples(enabled: boolean, wanted: number, max: number): number {
  if (!enabled) return 0;
  const samples = Math.min(Math.floor(wanted), Math.floor(max));
  return samples < 2 ? 0 : samples;
}

/** The player's groundcover setting. Off is a tier, not a separate switch. */
export type CoverDensity = 'off' | 'low' | 'medium' | 'high' | 'ultra';

/**
 * Fraction of the sampled pool each tier draws. The type table is authored at
 * ultra, which is twice a thick field: high is that thick field, medium an
 * ordinary one, low thin and worn. Props thin on a gentler curve than these —
 * see `art/cover.ts`.
 */
const COVER_TIERS: Record<CoverDensity, number> = {
  off: 0,
  low: 0.09,
  medium: 0.2,
  high: 0.3,
  ultra: 1,
};

/**
 * The part of the look that belongs to a *place* rather than to the game.
 *
 * Kept separate from `RenderSettings` and applied on top of it. The settings
 * are the look — pixel size, dither, levels — dialled in once and saved as a
 * preset; this is the air in the room, and it changes at every threshold. If a
 * zone wrote into the settings instead, walking through a door would silently
 * overwrite whatever the player had tuned, and it would be saved that way.
 */
export interface ZoneAir {
  /** Whether the sky dome is drawn at all. Off indoors. */
  sky: boolean;
  fogColor: string;
  fogNear: number;
  fogFar: number;
  /**
   * Placed fog volumes for this zone (SHADERS-AND-MATERIALS.md §2), in its world space.
   *
   * Distinct from the three fields above, and not a refinement of them: those
   * are the haze of *distance*, which every zone wears everywhere. These are
   * objects made of air, standing in particular places. A zone can have either,
   * both or neither.
   */
  fogVolumes?: readonly FogVolume[];
  /**
   * Whether this zone has any water in it (SHADERS-AND-MATERIALS.md §7).
   *
   * A fact about the geometry rather than about the air, and it is here for the
   * same reason `fogVolumes` is: this is the one call that fires at every
   * threshold, and the water pass costs a whole-scene walk that must not happen
   * in a room with no pond. Observed, not declared — see `Zone.hasWater`.
   */
  water?: boolean;
}

export class PostFX {
  readonly settings: RenderSettings;

  private readonly viewport: Viewport;
  private readonly composer: EffectComposer;
  private readonly pixelStage: PixelStage;
  private readonly gtao: GTAOEffect;
  private readonly water: WaterEffect;
  private readonly underwater: UnderwaterEffect;
  private readonly fog: FogVolumesEffect;
  private readonly particles: ParticlesEffect;
  private readonly bloom: BloomEffect;
  private readonly retroPass: ShaderPass;
  private readonly sky = new Sky();
  /** Null until a zone is entered, which on a real boot is immediately. */
  private air: ZoneAir | null = null;

  /**
   * The two halves of the look a player is allowed to turn off.
   *
   * Held here rather than written into `settings`, and for the same reason
   * `ZoneAir` is: the settings are a *preset*, saved and reloaded, and a
   * player switching the dither off must not silently overwrite a dither scale
   * that took an afternoon to find. These sit on top and the tuned values stay
   * underneath, so the switch is genuinely reversible.
   */
  private dither = true;
  private pixelate = true;
  private antialias = true;
  private occlusion = true;
  /** Dev-only, unlike the others here. See `setFogVolumes`. */
  private volumetrics = true;
  private glow = true;
  /** The accessibility switch, not a look setting. See `setWaterMotion`. */
  private waves = true;
  /** Dev-only, like the fog volumes: a finish is what a prop is made of. */
  private finished = true;
  /** The player's groundcover tier, `off` included. See `setGroundcover`. */
  private groundcover: CoverDensity = 'high';
  /**
   * Whether particles are drawn at all.
   *
   * Not a player video option, by SHADERS-AND-MATERIALS.md's line: snow in a snowy zone is
   * the place, like a pond or a mist pool. This is the dev switch, and the
   * accessibility one — which removes weather only — lives in `art/particles`.
   */
  private particulate = true;
  private colorblind: ColorblindMode = 'off';
  private colorblindStrength = 1;
  /**
   * How far the player can see, in metres, or null for the camera's own far
   * plane — the default, and today's picture exactly. See `setViewDistance`.
   */
  private viewDistance: number | null = null;
  /** The far plane the camera was built with, and what `null` above means. */
  private readonly baseFar: number;

  constructor(viewport: Viewport) {
    this.viewport = viewport;
    this.baseFar = viewport.camera.far;
    // Spread is shallow, so a preset saved before the sky existed would leave
    // `sky` undefined and take the whole pipeline down. Nested groups get
    // merged a level deeper.
    const saved = loadPreset<RenderSettings>(PRESET) ?? {};
    this.settings = {
      ...DEFAULT_RENDER,
      ...saved,
      sky: { ...DEFAULT_SKY, ...saved.sky },
      ao: { ...DEFAULT_RENDER.ao, ...saved.ao },
      bloom: { ...DEFAULT_RENDER.bloom, ...saved.bloom },
      water: { ...DEFAULT_RENDER.water, ...saved.water },
      finish: { ...DEFAULT_RENDER.finish, ...saved.finish },
      // A preset saved by the shell-era cover stored different keys with
      // different units; carrying them over would misread badly.
      cover:
        saved.cover && !('shells' in saved.cover)
          ? { ...DEFAULT_RENDER.cover, ...saved.cover }
          : { ...DEFAULT_RENDER.cover },
      particles: { ...DEFAULT_RENDER.particles, ...saved.particles },
      detail: { ...DEFAULT_RENDER.detail, ...saved.detail },
    };
    // A preset saved while palette matching existed still names it, and an
    // unknown mode would put `undefined` into the uniform and take the pass
    // down. Anything that is not a mode any more falls back to `levels`.
    if (!(this.settings.quantize in QUANTIZE_CODE)) this.settings.quantize = 'levels';

    viewport.scene.add(this.sky.mesh);
    this.hideGlowFromEdges(viewport.scene);

    this.composer = new EffectComposer(viewport.renderer);
    this.pixelStage = new PixelStage(1, viewport.scene, viewport.camera);
    // **The edge detector re-renders the whole scene with its own material.**
    // `PixelStage` swaps in a `MeshNormalMaterial` as `scene.overrideMaterial`
    // to build the normal buffer its outlines come from — which bypassed the
    // wind displacement entirely, so every swaying plant was outlined at the
    // position it would have had standing still. A motionless ghost of its
    // own shape, and the reason this line exists.
    applySway(this.pixelStage.normalMaterial);

    // The effect slot, in order. Registered once each; on/off is the effect's
    // own flag, set in `apply`.
    //
    // **Order is the design, not an accident of construction.** AO is shading
    // and belongs on the surfaces themselves, so it runs while the colour is
    // still only surfaces. Water is a surface too, but one that has to read
    // everything already drawn, so it comes next — over the shaded bed it lets
    // you see through, and under everything that stands between you and it.
    // Fog is what stands *between* the camera and all of that, so it goes over
    // the top — occluding shaded geometry exactly as it occludes unshaded
    // geometry, which is what stops mist reading as a decal on the wall behind
    // it. The slots after this one are spoken for in the same way: DoF after
    // fog, bloom after DoF so a blurred lamp still blooms, god rays last.
    this.gtao = new GTAOEffect();
    this.water = new WaterEffect();
    // Immediately after the surface, and on its own: this is the *volume* of
    // water rather than its boundary, so it runs over every pixel in the frame
    // rather than over the pixels a pond covers. See `Underwater.ts`.
    this.underwater = new UnderwaterEffect();
    this.fog = new FogVolumesEffect();
    // After the fog and before bloom, and both of those are load-bearing —
    // see `Particles.ts`.
    this.particles = new ParticlesEffect();
    this.bloom = new BloomEffect();
    this.pixelStage.effects.push(
      this.gtao,
      this.water,
      this.underwater,
      this.fog,
      this.particles,
      this.bloom,
    );

    this.retroPass = new ShaderPass(RetroShader);

    this.composer.addPass(this.pixelStage);
    this.composer.addPass(new OutputPass());
    this.composer.addPass(this.retroPass);

    this.resize();
    this.apply();
  }

  /**
   * Sets the current zone's air. Pass null to fall back to the tuned settings.
   *
   * Applied immediately rather than on the next frame: this is called at full
   * black during a transition, and the whole point is that the new fog is
   * already in place by the time anything is visible again.
   */
  setEnvironment(air: ZoneAir | null): void {
    this.air = air;
    // Swapped at the same instant as the fog colour and for the same reason:
    // this runs at full black mid-crossing, so the volumes of the room being
    // left are gone before the room being entered is visible. A volume that
    // survived a threshold would be a pool of mist hanging in the wrong
    // building, at coordinates that mean nothing there.
    this.fog.setVolumes(air?.fogVolumes ?? []);
    // Same instant, same reason. A pass that walks the scene graph looking for
    // water must not be running in a room that has none.
    this.water.setActive(air?.water ?? false);
    this.apply();
  }

  /** Pushes `settings` into the passes. Cheap; call it whenever they change. */
  /**
   * Points the drawn sun wherever the scene's sun light is.
   *
   * Called once at start-up rather than per frame, because the sun is static.
   * When it stops being static this is the seam that has to move — one call,
   * and the disc and the shadows keep agreeing by construction.
   */
  aimSun(direction: THREE.Vector3): void {
    this.sky.aimAt(direction);
  }

  /**
   * Turns the halftone dither off without disturbing its tuning.
   *
   * The pattern is a texture in its own right rather than a way of hiding
   * banding — see `ditherScale` — so this is a *look* option, and switching it
   * off leaves the quantization visible as flat bands. That is the point: some
   * people find a screen pattern over every surface hard to look at.
   */
  setDither(enabled: boolean): void {
    this.dither = enabled;
    this.apply();
  }

  /**
   * Drops the chunky pixels to one device pixel.
   *
   * The edge detection stays. It is drawn by the same pass, it is most of what
   * makes the world read as drawn rather than rendered, and it is not what
   * anybody means when they ask to turn the pixelation off — they mean the
   * blocks.
   */
  setPixelation(enabled: boolean): void {
    this.pixelate = enabled;
    this.apply();
  }

  /**
   * Multisamples the colour render, or does not.
   *
   * A player option by SHADERS-AND-MATERIALS.md's rule: real per-frame cost, and nothing is
   * lost with it off but the smoothing. It is not a quality ladder — the sample
   * count is a developer's dial in `RenderSettings`, because two controls for
   * one thing on screen is one control too many.
   *
   * Off is genuinely off: the target goes back to a single sample, not to a
   * cheaper multisample.
   */
  setAntialias(enabled: boolean): void {
    this.antialias = enabled;
    this.apply();
  }

  /**
   * Turns ambient occlusion off without disturbing its tuning.
   *
   * A player option — see SHADERS-AND-MATERIALS.md's line on which effects cross into the
   * options screen: it is the most measurable per-frame cost in the pipeline
   * and purely additive shading, so off, the world is exactly the pre-AO
   * picture.
   */
  setAmbientOcclusion(enabled: boolean): void {
    this.occlusion = enabled;
    this.apply();
  }

  /**
   * Turns placed fog volumes off. **Dev-facing only.**
   *
   * Deliberately not a player option, by SHADERS-AND-MATERIALS.md's line on which effects
   * cross into the options screen: a volume is not a flourish over the world,
   * it is part of the world. A dungeon dressed in mist is a different room
   * without it and a rim wrapped in cloud is a backdrop with a visible edge, so
   * switching these off is a thing to do while looking at the effect, not a
   * setting to ship. Their cost is carried in the zone budgets, like a prop's.
   */
  setFogVolumes(enabled: boolean): void {
    this.volumetrics = enabled;
    this.apply();
  }

  /**
   * Turns bloom off without disturbing its tuning.
   *
   * A player option, by SHADERS-AND-MATERIALS.md's rule: it is taste as much as performance —
   * some people find glow bleed distracting — and switching it off loses
   * nothing but the bleed. The emitters still glow, because the geometry *is*
   * the glow; what goes is the light spreading off it.
   */
  setBloom(enabled: boolean): void {
    this.glow = enabled;
    this.apply();
  }

  /**
   * Stops the water moving, without disturbing its tuning.
   *
   * **An accessibility switch, not a graphics one.** Water is not a player
   * video option — a pond is part of the place, by SHADERS-AND-MATERIALS.md's rule — but its
   * *motion* is one of the effects under reduced motion, beside wind sway and
   * head bob. The distinction is real: turning this off does not remove any
   * water from the world, it holds every surface of it still.
   *
   * It stops the waves and the drifting foam together. Foam creeping along a
   * shoreline is motion whatever the surface underneath it is doing, and
   * leaving that running would be the switch doing most of its job.
   */
  setWaterMotion(enabled: boolean): void {
    this.waves = enabled;
    this.apply();
  }

  /**
   * Turns the finish stage off. **Dev-facing only**, by the fog volumes'
   * argument: a finish is what a prop is made of, like its colour. Off, every
   * surface is exactly the Lambert it was before M0.
   */
  setFinish(enabled: boolean): void {
    this.finished = enabled;
    this.apply();
  }

  /**
   * How much of the sampled field to draw, `off` being none of it.
   *
   * One setting rather than a switch and a tier: off is where thinning ends,
   * and a tier that is still remembered while a switch above it says no is two
   * controls to reason about for one thing the player sees. Off skips every
   * cover draw outright; the tiers are prefixes of the same shuffled pool, so
   * changing one is an instance count and nothing else.
   */
  setGroundcover(density: CoverDensity): void {
    this.groundcover = density;
    this.apply();
  }

  /**
   * How far the player can see, in metres. Null is the camera's own far plane.
   *
   * One number driving five — the far plane, the fog's two distances, the sky
   * dome's radius and the clutter cull — and they are derived together in
   * `apply` because every way this goes wrong is two of them disagreeing.
   *
   * Layered over the tuning like the switches above, and it only ever pulls the
   * view *in*: the air belongs to the zone, so this clamps under what the zone
   * asked for and never past it. See VIEW-DISTANCE.md.
   */
  setViewDistance(metres: number | null): void {
    this.viewDistance = metres;
    this.apply();
  }

  /**
   * How far from the camera clutter is still worth drawing. Infinite by
   * default. Read by `ZoneManager`, which owns the tagged meshes.
   */
  get clutterRadius(): number {
    if (this.viewDistance === null) return Infinity;
    return this.viewDistance * this.settings.clutterCull;
  }

  /** Particles on or off. Off skips the pass and every particle draw with it. */
  setParticles(enabled: boolean): void {
    this.particulate = enabled;
    this.apply();
  }

  /**
   * Sets the colour vision correction and how strongly it is applied.
   *
   * `strength` is 0..1, and 0 is genuinely nothing rather than nearly nothing:
   * the shader mixes between the original and the corrected colour, so the
   * bottom of the slider is the untouched picture and every value above it is
   * a proportion of the full correction.
   */
  setColorblind(mode: ColorblindMode, strength: number): void {
    this.colorblind = mode;
    this.colorblindStrength = Math.min(Math.max(strength, 0), 1);
    this.apply();
  }

  apply(): void {
    const s = this.settings;

    // Pixel size is authored in CSS pixels and applied in device pixels, so a
    // look dialled in on a desktop reads the same on a phone at DPR 3 instead
    // of turning into a fine grain nobody can see.
    const scale = this.viewport.renderer.getPixelRatio();
    const devicePixels = this.pixelate ? Math.max(1, Math.round(s.pixelSize * scale)) : 1;
    if (this.pixelStage.pixelSize !== devicePixels) this.pixelStage.setPixelSize(devicePixels);
    this.pixelStage.normalEdgeStrength = s.normalEdgeStrength;
    this.pixelStage.depthEdgeStrength = s.depthEdgeStrength;
    this.pixelStage.setSamples(
      resolveSamples(this.antialias, s.samples, this.viewport.renderer.capabilities.maxSamples),
    );

    this.gtao.enabled = this.occlusion && s.ao.strength > 0;
    this.gtao.strength = s.ao.strength;
    this.gtao.radius = s.ao.radius;

    // A zone with no volumes skips the pass entirely rather than running a
    // march that finds nothing — which is most zones, so the effect costs
    // exactly nothing everywhere it is not used.
    this.fog.enabled = this.volumetrics && this.fog.hasVolumes;

    // Water is not a player option and is not a switch here either — a pond is
    // part of the place, by SHADERS-AND-MATERIALS.md's line on what crosses into the options
    // screen. The pass runs wherever there is water and nowhere else.
    this.water.enabled = this.water.hasWater;
    const w = WATER_MATERIAL.uniforms;
    w.uWaveScale.value = s.water.waves;
    // Layered over the tuning rather than written into it, exactly as the
    // dither switch is: a player asking for stillness must not overwrite a wave
    // scale somebody dialled in.
    w.uWaterMotion.value = this.waves ? 1 : 0;
    // A real switch, not a strength of zero: off, the march does not run and
    // every reflection is the analytic sky, which is what a miss would have
    // returned anyway.
    w.uReflections.value = s.water.reflections ? 1 : 0;

    this.bloom.enabled = this.glow && s.bloom.strength > 0;
    this.bloom.strength = s.bloom.strength;
    this.bloom.radius = s.bloom.radius;

    // The finish stage lives in the shared art material, not in a pass; these
    // are its uniforms. The sky flag mirrors the dome's own visibility below,
    // so an interior's reflections come from the hemisphere pair instead.
    finishUniforms.uFinishOn.value = this.finished ? 1 : 0;
    finishUniforms.uFinishSpecular.value = s.finish.specular;
    finishUniforms.uFinishEnv.value = s.finish.environment;
    finishUniforms.uFinishSky.value = this.air === null || this.air.sky ? 1 : 0;

    setCoverDraw(
      this.groundcover !== 'off',
      COVER_TIERS[this.groundcover] * s.cover.density,
      s.cover.height,
      s.cover.width,
    );

    detailUniforms.uDetailStart.value = s.detail.start;
    detailUniforms.uDetailSpan.value = s.detail.span;

    this.particles.enabled = this.particulate;
    setParticleDraw(this.particulate, s.particles.density, s.particles.size);
    particleUniforms.uShutter.value = s.particles.shutter;

    const u = this.retroPass.uniforms;
    u.uPixelSize.value = devicePixels;
    // Passed through in steps rather than converted to absolute colour: the
    // shader now works inside one step, so it is the natural unit on both
    // sides and `levels` and the dither stay independent knobs.
    u.uDitherScale.value = this.dither ? s.ditherScale : 0;
    u.uPeriod.value = s.screenPeriod;
    u.uQuantize.value = QUANTIZE_CODE[s.quantize];
    u.uLevels.value = s.levels;
    u.uVignette.value = s.vignetteStrength;
    u.uVignetteRadius.value = s.vignetteRadius;
    u.uVignetteSoftness.value = s.vignetteSoftness;
    u.uColorblind.value = COLORBLIND_CODE[this.colorblind];
    u.uColorblindStrength.value = this.colorblindStrength;

    this.sky.apply(s.sky);
    this.sky.mesh.visible = this.air === null || this.air.sky;

    // The far plane, and with it the frustum culling every prop gets for free.
    // The sky follows it in `Sky.follow` and the clutter in `clutterRadius`;
    // the fog is clamped under it below.
    const camera = this.viewport.camera;
    const far = this.viewDistance ?? this.baseFar;
    if (camera.far !== far) {
      camera.far = far;
      camera.updateProjectionMatrix();
    }

    const fog = this.viewport.scene.fog;
    if (fog instanceof THREE.Fog) {
      // Indoors the fog is the darkness at the end of the room and has nothing
      // to do with the horizon, so `linkFogToSky` only applies where there is
      // a sky to link it to.
      if (this.air && !this.air.sky) {
        fog.color.set(this.air.fogColor);
      } else if (s.linkFogToSky) {
        fog.color.set(s.sky.horizon);
      } else {
        fog.color.set(this.air?.fogColor ?? s.fogColor);
      }
      // Clamped under the far plane, never extended past what the zone asked
      // for — a cut with no fade in front of it is geometry disappearing in
      // mid-air. At the default far this is a no-op everywhere.
      const range = clampFog(this.air?.fogNear ?? s.fogNear, this.air?.fogFar ?? s.fogFar, far);
      fog.near = range.near;
      fog.far = range.far;
      // The clear colour is what shows where nothing was drawn. With the sky
      // dome off that is every pixel the geometry does not cover, so it has to
      // be the fog colour or an interior is a lit room floating in blue.
      this.viewport.renderer.setClearColor(fog.color, 1);
      // AO fades against the fog the zone actually has — set here, after the
      // air has had its say, so an interior's short fog shortens the AO too.
      this.gtao.setFog(fog.near, fog.far);
    }
  }

  /**
   * Keeps glow and groundcover out of the edge detector.
   *
   * `RenderPixelatedPass` draws the scene twice: once for colour, and once with
   * `scene.overrideMaterial` set to a `MeshNormalMaterial`, whose output the
   * shader differences to find edges.
   *
   * - **Glow.** That second pass has no concept of transparency — every object
   *   in it is opaque — so a street lamp's flame came back with a hard outline
   *   drawn round its silhouette, reading as a small solid object hanging in
   *   the lantern rather than as something burning. All three glow materials —
   *   a glowing word with a dark rim round every stroke is a sign in the air,
   *   not a line of light.
   * - **Cover.** The blade and tuft construction lives in the cover materials'
   *   own vertex shaders, so an override material would draw every instance as
   *   an untransformed sliver at its mesh's origin. Hidden here, and drawn
   *   into the normal buffer afterwards with its own patched materials — see
   *   `drawCoverNormals` — or the edge pass outlines whatever stands behind a
   *   blade straight through it.
   *
   * Three tests `material.visible` while it is building the render list, and
   * `scene.onBeforeRender` fires just before that happens. Each is one shared
   * material, so three flags drop all of them, and `overrideMaterial` being set
   * is what identifies the pass.
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

  render(elapsed: number): void {
    // Both of these are per-frame counterparts to switches turned off in
    // `Viewport`, and both belong here rather than at the call site because
    // this is the one place a frame is drawn — `main.ts` calls it from the loop
    // and once more to prime the first frame, and a rule that has to be
    // remembered at two call sites is a rule that will be missed at one.
    const { renderer } = this.viewport;
    renderer.info.reset();
    renderer.shadowMap.needsUpdate = true;

    this.sky.follow(this.viewport.camera, elapsed);
    // Asked before the frame is drawn rather than during it, because the pass
    // that needs the answer runs inside the composer and cannot go and look.
    // Costs a handful of box tests in a zone with water and nothing at all
    // anywhere else — see `WaterEffect.submersion`.
    this.underwater.setDepth(this.water.submersion(this.viewport.scene, this.viewport.camera));
    // The same clock the sky drifts on, handed to the effect chain. Fog volumes
    // are the only reader today; see `EffectContext.time` on why knowing the
    // time is not the temporal accumulation the ground rules forbid.
    this.pixelStage.time = elapsed;
    this.composer.render();
  }

  resize(): void {
    const size = this.viewport.renderer.getSize(new THREE.Vector2());
    this.composer.setPixelRatio(this.viewport.renderer.getPixelRatio());
    this.composer.setSize(size.x, size.y);
    // Device pixel ratio can change when a window moves between monitors, and
    // pixel size is derived from it.
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
    // Left set, the hook would keep flipping a shared material for a pipeline
    // that no longer exists — and it could leave it hidden.
    this.viewport.scene.onBeforeRender = () => {};
    GLOW_MATERIAL.visible = true;
    TEXT_GLOW_MATERIAL.visible = true;
    TEXT_GLOW_ADDITIVE.visible = true;
    this.viewport.scene.remove(this.sky.mesh);
    this.sky.dispose();
    this.pixelStage.dispose();
    this.composer.dispose();
  }
}
