import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPixelatedPass } from 'three/examples/jsm/postprocessing/RenderPixelatedPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { RetroShader, MAX_PALETTE } from './RetroShader';
import { generateBlueNoise } from './blueNoise';
import { Sky, DEFAULT_SKY, type SkySettings } from './Sky';
import { loadPreset, savePreset, clearPreset } from '../debug/presets';
import type { Viewport } from './Viewport';

/**
 * The render pipeline.
 *
 * ```
 * scene ─► RenderPixelatedPass ─► OutputPass ─► RetroShader ─► screen
 *          chunky pixels,          tone map     vignette,
 *          depth/normal edges      and sRGB     dither, quantize
 * ```
 *
 * The order is load-bearing. `OutputPass` is where linear light becomes sRGB,
 * and everything the retro pass does — matching a hex palette, spacing
 * quantization steps evenly, dithering across those steps — is only correct on
 * the display side of that conversion.
 *
 * Every parameter persists to localStorage, so a look dialled in on a phone is
 * still there after a reload.
 */

const PRESET = 'render';

export type QuantizeMode = 'off' | 'levels' | 'palette';
export type DitherPattern = 'bayer' | 'blue' | 'noise';

/**
 * Edge of the blue-noise tile. 64 costs ~25 ms to generate at boot and repeats
 * every 64 chunky pixels, which at any sane pixel size is far enough apart that
 * the tiling is not readable. Doubling it quadruples the generation cost.
 */
const BLUE_NOISE_SIZE = 64;

export interface RenderSettings {
  /** Chunky pixel size in *CSS* pixels, so the look survives a retina screen. */
  pixelSize: number;
  normalEdgeStrength: number;
  depthEdgeStrength: number;

  /**
   * Dither amplitude, in units of **one quantization step** rather than in
   * absolute colour.
   *
   * This is the only scale that makes sense. Dithering works by pushing
   * colours across the boundary between two adjacent levels, so how far it
   * needs to push depends entirely on how far apart those levels are — and
   * that changes every time `levels` changes. Held absolute, a value tuned at
   * 8 levels is far too weak at 4 and the banding it was hiding comes
   * straight back.
   *
   * 1 spreads exactly one step, which is the textbook amount and fully covers
   * the gap between levels. Below that, bands survive; above, it starts to
   * read as grain in its own right.
   */
  ditherScale: number;
  /**
   * Which threshold pattern to dither against.
   *
   * `bayer` is the classic ordered matrix — beautiful on gradients, and a
   * visible grid of dots on flat colour, because on a flat colour the pattern
   * *is* what you see. `blue` is a void-and-cluster mask with the same even
   * coverage and none of the regularity; it reads as a fine stipple. `noise`
   * is interleaved gradient noise, cheaper and with a faint diagonal weave.
   */
  ditherPattern: DitherPattern;
  /** Bayer matrix edge: 2, 4 or 8. Only used by the `bayer` pattern. */
  ditherMatrix: number;

  quantize: QuantizeMode;
  /** Levels per channel in `levels` mode. 2 is one bit; 8 is generous. */
  levels: number;
  /** Hex colours for `palette` mode. Placeholder — the art direction is yours. */
  palette: string[];

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

/**
 * A neutral sixteen: cold greys, dusty browns, one weak gold.
 *
 * This is scaffolding, not a decision. It exists so palette mode does
 * something the first time it is switched on, and it should be replaced with
 * an actual chosen palette before any of this is content.
 */
const PLACEHOLDER_PALETTE = [
  '#0a0a0f', '#141a24', '#1e2733', '#2e3640',
  '#3d4a54', '#525f66', '#6f7a7d', '#8d9491',
  '#b0b3a8', '#dcdcc8', '#3a2f28', '#5c3a2e',
  '#7a5238', '#9a7248', '#b08040', '#c9a25e',
];

export const DEFAULT_RENDER: RenderSettings = {
  pixelSize: 3,
  normalEdgeStrength: 0.3,
  depthEdgeStrength: 0.4,

  // Under a full step, so some banding survives in shallow gradients. Chosen
  // by eye against the sky, which is the largest and shallowest gradient in
  // the game and therefore the one that decides this number.
  ditherScale: 0.6,
  ditherPattern: 'bayer',
  ditherMatrix: 8,

  quantize: 'levels',
  levels: 5,
  palette: [...PLACEHOLDER_PALETTE],

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

const QUANTIZE_CODE: Record<QuantizeMode, number> = { off: 0, levels: 1, palette: 2 };
const PATTERN_CODE: Record<DitherPattern, number> = { bayer: 0, blue: 1, noise: 2 };

export class PostFX {
  readonly settings: RenderSettings;

  private readonly viewport: Viewport;
  private readonly composer: EffectComposer;
  private readonly pixelPass: RenderPixelatedPass;
  private readonly retroPass: ShaderPass;
  private readonly sky = new Sky();
  private readonly paletteBuffer = new Float32Array(MAX_PALETTE * 3);
  /** Built on first use — see `ensureBlueNoise`. */
  private ditherTexture: THREE.DataTexture | null = null;

  constructor(viewport: Viewport) {
    this.viewport = viewport;
    // Spread is shallow, so a preset saved before the sky existed would leave
    // `sky` undefined and take the whole pipeline down. Nested groups get
    // merged a level deeper.
    const saved = loadPreset<RenderSettings>(PRESET) ?? {};
    this.settings = { ...DEFAULT_RENDER, ...saved, sky: { ...DEFAULT_SKY, ...saved.sky } };

    viewport.scene.add(this.sky.mesh);

    this.composer = new EffectComposer(viewport.renderer);
    this.pixelPass = new RenderPixelatedPass(1, viewport.scene, viewport.camera);
    this.retroPass = new ShaderPass(RetroShader);

    this.composer.addPass(this.pixelPass);
    this.composer.addPass(new OutputPass());
    this.composer.addPass(this.retroPass);

    // The palette uniform is a fixed-length array in GLSL, so it has to be
    // fully populated even when fewer colours are in use; the count uniform is
    // what actually bounds the search.
    this.retroPass.uniforms.uPalette.value = this.paletteBuffer;

    this.retroPass.uniforms.uDitherSize.value = BLUE_NOISE_SIZE;

    this.resize();
    this.apply();
  }

  /** Pushes `settings` into the passes. Cheap; call it whenever they change. */
  apply(): void {
    const s = this.settings;

    // Pixel size is authored in CSS pixels and applied in device pixels, so a
    // look dialled in on a desktop reads the same on a phone at DPR 3 instead
    // of turning into a fine grain nobody can see.
    const scale = this.viewport.renderer.getPixelRatio();
    const devicePixels = Math.max(1, Math.round(s.pixelSize * scale));
    if (this.pixelPass.pixelSize !== devicePixels) this.pixelPass.setPixelSize(devicePixels);
    this.pixelPass.normalEdgeStrength = s.normalEdgeStrength;
    this.pixelPass.depthEdgeStrength = s.depthEdgeStrength;

    const u = this.retroPass.uniforms;
    u.uPixelSize.value = devicePixels;
    // Converted from steps to absolute colour here, so `levels` and the dither
    // stay independent knobs: sweeping one does not silently detune the other.
    // Palette mode has no uniform step to measure, so `levels` doubles as the
    // reference for how coarse the palette is assumed to be.
    const step = 1 / Math.max(s.levels - 1, 1);
    u.uDither.value = s.ditherScale * step;
    u.uPattern.value = PATTERN_CODE[s.ditherPattern] ?? PATTERN_CODE.bayer;
    u.uMatrix.value = s.ditherMatrix;
    if (s.ditherPattern === 'blue') this.ensureBlueNoise();
    u.uQuantize.value = QUANTIZE_CODE[s.quantize];
    u.uLevels.value = s.levels;
    u.uVignette.value = s.vignetteStrength;
    u.uVignetteRadius.value = s.vignetteRadius;
    u.uVignetteSoftness.value = s.vignetteSoftness;

    const count = Math.min(s.palette.length, MAX_PALETTE);
    for (let i = 0; i < count; i++) writeSrgb(s.palette[i], this.paletteBuffer, i * 3);
    u.uPaletteCount.value = count;

    this.sky.apply(s.sky);

    const fog = this.viewport.scene.fog;
    if (fog instanceof THREE.Fog) {
      fog.color.set(s.linkFogToSky ? s.sky.horizon : s.fogColor);
      fog.near = s.fogNear;
      fog.far = s.fogFar;
      this.viewport.renderer.setClearColor(fog.color, 1);
    }
  }

  /**
   * Builds the blue-noise mask, once, the first time that pattern is selected.
   *
   * Void-and-cluster costs about 25 ms, which is not much but is entirely
   * wasted on a boot that never leaves the default pattern. Paying it on the
   * frame someone switches instead puts the cost where the intent is.
   */
  private ensureBlueNoise(): void {
    if (this.ditherTexture !== null) return;

    // Nearest and repeating, because one texel has to land on exactly one
    // chunky pixel — filtering the mask would blur the thresholds together and
    // give back the soft banding the dither exists to break up.
    this.ditherTexture = new THREE.DataTexture(
      generateBlueNoise(BLUE_NOISE_SIZE),
      BLUE_NOISE_SIZE,
      BLUE_NOISE_SIZE,
      THREE.RedFormat,
    );
    this.ditherTexture.magFilter = THREE.NearestFilter;
    this.ditherTexture.minFilter = THREE.NearestFilter;
    this.ditherTexture.wrapS = THREE.RepeatWrapping;
    this.ditherTexture.wrapT = THREE.RepeatWrapping;
    this.ditherTexture.needsUpdate = true;
    this.retroPass.uniforms.tDither.value = this.ditherTexture;
  }

  render(elapsed: number): void {
    this.sky.follow(this.viewport.camera, elapsed);
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
    this.ditherTexture?.dispose();
    this.viewport.scene.remove(this.sky.mesh);
    this.sky.dispose();
    this.composer.dispose();
  }
}

/**
 * Hex to sRGB components, parsed by hand.
 *
 * `THREE.Color` would convert into the linear working space on the way in,
 * which is right for anything the renderer lights but wrong here — the retro
 * pass runs after the sRGB transfer and compares against display values.
 */
function writeSrgb(hex: string, target: Float32Array, offset: number): void {
  const value = Number.parseInt(hex.replace('#', ''), 16);
  target[offset] = ((value >> 16) & 0xff) / 255;
  target[offset + 1] = ((value >> 8) & 0xff) / 255;
  target[offset + 2] = (value & 0xff) / 255;
}
