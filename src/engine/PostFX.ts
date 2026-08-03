import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { applySway } from '../art/sway';
import { PixelStage } from './PixelStage';
import { GTAOEffect } from './GTAO';
import { FogVolumesEffect, type FogVolume } from './FogVolumes';
import { BloomEffect } from './Bloom';
import { RetroShader, COLORBLIND_CODE, type ColorblindMode } from './RetroShader';
import { Sky, DEFAULT_SKY, type SkySettings } from './Sky';
import { loadPreset, savePreset, clearPreset } from '../debug/presets';
import { GLOW_MATERIAL } from '../art/glow';
import type { Viewport } from './Viewport';

/**
 * The render pipeline.
 *
 * ```
 * scene ─► PixelStage ──────────────────► OutputPass ─► RetroShader ─► screen
 *          chunky pixels, edge lines,      tone map     vignette,
 *          GTAO ─► fog ─► bloom, upscale   and sRGB     dither, quantize
 * ```
 *
 * `PixelStage` is ours (SHADERS.md, R0): it renders at chunky resolution,
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
   * Ambient occlusion (SHADERS.md §1). `strength` is how dark full occlusion
   * gets, 0..1; `radius` is the world-space reach in metres — how far apart
   * two surfaces can be and still shade each other.
   */
  ao: { strength: number; radius: number };

  /**
   * Bloom (SHADERS.md §3). `strength` is how much of the blurred emitters is
   * added back; `radius` is the spread, as a multiple of the blur chain's
   * own texel offsets.
   *
   * There is no threshold, and there is deliberately nowhere to put one — see
   * `Bloom.ts`. What blooms is what is made of `GLOW_MATERIAL`.
   */
  bloom: { strength: number; radius: number };

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
  normalEdgeStrength: 0.5,
  depthEdgeStrength: 0.5,

  // Over a full step, so the transition between two levels never fully
  // resolves to flat colour and the screen stays visible as a texture in its
  // own right. Under 1 it would be the opposite — bands with clean centres.
  ditherScale: 1.65,
  // Three chunky pixels, so six device pixels at the pixel size above: a dot
  // small enough to read as a print screen rather than as a pattern.
  screenPeriod: 3,

  quantize: 'levels',
  // Sixteen. Costs nothing — it is a uniform, and the shader does identical
  // arithmetic whatever it holds — so the only question is the look. High
  // enough that the quantization is not the thing you see, which leaves the
  // halftone doing the work instead of fighting the banding.
  levels: 16,

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
   * Placed fog volumes for this zone (SHADERS.md §2), in its world space.
   *
   * Distinct from the three fields above, and not a refinement of them: those
   * are the haze of *distance*, which every zone wears everywhere. These are
   * objects made of air, standing in particular places. A zone can have either,
   * both or neither.
   */
  fogVolumes?: readonly FogVolume[];
}

export class PostFX {
  readonly settings: RenderSettings;

  private readonly viewport: Viewport;
  private readonly composer: EffectComposer;
  private readonly pixelStage: PixelStage;
  private readonly gtao: GTAOEffect;
  private readonly fog: FogVolumesEffect;
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
  private occlusion = true;
  /** Dev-only, unlike the others here. See `setFogVolumes`. */
  private volumetrics = true;
  private glow = true;
  private colorblind: ColorblindMode = 'off';
  private colorblindStrength = 1;

  constructor(viewport: Viewport) {
    this.viewport = viewport;
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
    // still only surfaces. Fog is what stands *between* the camera and those
    // surfaces, so it goes over the top of them — occluding shaded geometry
    // exactly as it occludes unshaded geometry, which is what stops mist
    // reading as a decal on the wall behind it. The slots after this one are
    // spoken for in the same way: DoF after fog, bloom after DoF so a blurred
    // lamp still blooms, god rays last.
    this.gtao = new GTAOEffect();
    this.fog = new FogVolumesEffect();
    this.bloom = new BloomEffect();
    this.pixelStage.effects.push(this.gtao, this.fog, this.bloom);

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
   * Turns ambient occlusion off without disturbing its tuning.
   *
   * A player option — see SHADERS.md's line on which effects cross into the
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
   * Deliberately not a player option, by SHADERS.md's line on which effects
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
   * A player option, by SHADERS.md's rule: it is taste as much as performance —
   * some people find glow bleed distracting — and switching it off loses
   * nothing but the bleed. The emitters still glow, because the geometry *is*
   * the glow; what goes is the light spreading off it.
   */
  setBloom(enabled: boolean): void {
    this.glow = enabled;
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

    this.gtao.enabled = this.occlusion && s.ao.strength > 0;
    this.gtao.strength = s.ao.strength;
    this.gtao.radius = s.ao.radius;

    // A zone with no volumes skips the pass entirely rather than running a
    // march that finds nothing — which is most zones, so the effect costs
    // exactly nothing everywhere it is not used.
    this.fog.enabled = this.volumetrics && this.fog.hasVolumes;

    this.bloom.enabled = this.glow && s.bloom.strength > 0;
    this.bloom.strength = s.bloom.strength;
    this.bloom.radius = s.bloom.radius;

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
      fog.near = this.air?.fogNear ?? s.fogNear;
      fog.far = this.air?.fogFar ?? s.fogFar;
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
   * Keeps additive glow geometry out of the edge detector.
   *
   * `RenderPixelatedPass` draws the scene twice: once for colour, and once with
   * `scene.overrideMaterial` set to a `MeshNormalMaterial`, whose output the
   * shader differences to find edges. That second pass has no concept of
   * transparency — every object in it is opaque — so a street lamp's flame came
   * back with a hard outline drawn round its silhouette, reading as a small
   * solid object hanging in the lantern rather than as something burning.
   *
   * Three tests `material.visible` while it is building the render list, and
   * `scene.onBeforeRender` fires just before that happens. Since every glow in
   * the game shares one material — exactly as the art kit shares one
   * `ART_MATERIAL` — switching that one flag drops all of them from the pass,
   * and `overrideMaterial` being set is what identifies the pass. One line, and
   * no copy of three's render loop to keep in step with upstream.
   */
  private hideGlowFromEdges(scene: THREE.Scene): void {
    scene.onBeforeRender = (_renderer, rendered) => {
      GLOW_MATERIAL.visible = (rendered as THREE.Scene).overrideMaterial === null;
    };
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
    this.viewport.scene.remove(this.sky.mesh);
    this.sky.dispose();
    this.pixelStage.dispose();
    this.composer.dispose();
  }
}
