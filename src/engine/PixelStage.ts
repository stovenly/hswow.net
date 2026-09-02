import * as THREE from 'three';
import { Pass, FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass.js';
import { drawCoverNormals } from '../art/cover';
import { RetroShader } from './RetroShader';
import { showSurfaces } from './surfaces';
import type { GpuClock } from './GpuClock';

/**
 * The pixel stage: render at chunky resolution, run effects there, upscale.
 *
 * ```
 * scene ─► colour target (chunky, half-float, depth texture)
 *       ─► normal target  (chunky, override material)
 *       ─► [effects…]     (chunky → chunky, ping-pong)
 *       ─► upscale        (nearest blit, sRGB, dither, quantize)
 * ```
 *
 * The upscale is the only step in the pipeline that runs at device resolution, so
 * everything that has to happen there happens in its one shader — see
 * `RetroShader`. The colour target keeps its depth texture bound and hands it,
 * with the normals, to whoever asks; effects run between render and upscale, each
 * reading the chain's colour so far and writing the next link. Half-float colour
 * costs nothing at this resolution and is the headroom bloom adds light into.
 */

/** What an effect pass gets to work with. All textures are chunky-resolution. */
export interface EffectContext {
  /** The scene colour as accumulated so far — read this, never write it. */
  colour: THREE.Texture;
  /** The scene's depth texture, from the colour render. Typed as what it is rather than as a plain texture, because bloom binds it as the depth attachment of its own target. */
  depth: THREE.DepthTexture;
  /** View-space normals, packed 0..1, from the override render. */
  normal: THREE.Texture;
  /** Where this effect's output goes. Becomes the next effect's `colour`. */
  write: THREE.WebGLRenderTarget;
  camera: THREE.PerspectiveCamera;
  /** Chunky resolution in pixels. */
  size: THREE.Vector2;
  /** The scene itself, for the one effect that draws rather than filters: bloom renders the emitters again on their own layer. */
  scene: THREE.Scene;
  /**
   * Seconds since start-up — the same clock the sky and the wind read. Effects are
   * spatial-only, which forbids accumulating across frames; it does not forbid
   * knowing what time it is, so fog that drifts is a function of the clock.
   */
  time: number;
}

/**
 * A chunky-resolution effect. One value per chunky pixel, no temporal state —
 * the ground rules in SHADERS-AND-MATERIALS.md. A disabled effect is skipped entirely and
 * must cost nothing.
 */
export interface PixelEffect {
  enabled: boolean;
  /** Short name for the GPU timing readout. See `GpuClock`. */
  readonly label: string;
  /**
   * True for an effect that renders to its own target rather than into the
   * chain — the effect-mask pass. The chain's colour passes it untouched.
   */
  readonly passthrough?: boolean;
  setSize(width: number, height: number): void;
  render(renderer: THREE.WebGLRenderer, context: EffectContext): void;
  dispose(): void;
}

/**
 * What the normal buffer is cleared to: the packed normal `(0, 0, 1)`, a flat
 * surface facing the camera. It has to decode to a unit vector, and the renderer's
 * own clear colour does not — it is about 0.66 long, and the sky dome is culled out
 * of the normal pass, so every pixel the geometry misses would carry a normal
 * nobody meant. Linear on purpose: the target carries no colour space.
 */
export const FLAT_NORMAL = new THREE.Color().setRGB(0.5, 0.5, 1, THREE.LinearSRGBColorSpace);

export class PixelStage extends Pass {
  /** Chunky pixel size in device pixels. Set through `setPixelSize`. */
  pixelSize: number;
  /** Seconds since start-up, pushed from `PostFX.render`. See `EffectContext`. */
  time = 0;

  /**
   * Where per-pass GPU milliseconds go. Null until `PostFX` hands one over, and
   * a no-op while nothing is reading it. See `GpuClock`.
   */
  clock: GpuClock | null = null;

  /**
   * The effect slot. Enabled effects run in array order, each reading the
   * previous output. Fixed at construction time in practice — effects toggle
   * with their `enabled` flag rather than by joining and leaving the array.
   */
  readonly effects: PixelEffect[] = [];

  /** The override material for the normal render. The sway patch goes on this. */
  readonly normalMaterial = new THREE.MeshNormalMaterial();

  private readonly scene: THREE.Scene;
  private readonly camera: THREE.PerspectiveCamera;

  private readonly resolution = new THREE.Vector2();
  private readonly renderResolution = new THREE.Vector2();

  private readonly colourTarget: THREE.WebGLRenderTarget;
  /** What the scene is drawn into. Programs carry its colour space; see `PostFX.sceneTarget`. */
  get sceneTarget(): THREE.WebGLRenderTarget {
    return this.colourTarget;
  }
  private readonly depthTexture: THREE.DepthTexture;
  private readonly normalTarget: THREE.WebGLRenderTarget;
  /**
   * Ping-pong pair for the effect chain. Separate from the colour target on
   * purpose: writing back into it would race its own depth texture, which the
   * effects still read.
   */
  private readonly ping: [THREE.WebGLRenderTarget, THREE.WebGLRenderTarget];

  /** Scratch for the clear colour the normal render borrows and gives back. */
  private readonly priorClear = new THREE.Color();
  /** Handed to every effect, mutated rather than rebuilt per pass. */
  private readonly context: EffectContext;

  private readonly outputMaterial: THREE.ShaderMaterial;
  private readonly fsQuad: FullScreenQuad;

  constructor(pixelSize: number, scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
    super();
    this.pixelSize = pixelSize;
    this.scene = scene;
    this.camera = camera;

    const chunky = (): THREE.WebGLRenderTarget => {
      const target = new THREE.WebGLRenderTarget();
      target.texture.minFilter = THREE.NearestFilter;
      target.texture.magFilter = THREE.NearestFilter;
      target.texture.type = THREE.HalfFloatType;
      return target;
    };

    this.colourTarget = chunky();
    this.depthTexture = new THREE.DepthTexture(1, 1);
    this.colourTarget.depthTexture = this.depthTexture;
    // Eight bits a lane: it holds a packed normal, not light.
    this.normalTarget = chunky();
    this.normalTarget.texture.type = THREE.UnsignedByteType;
    this.ping = [chunky(), chunky()];

    this.outputMaterial = createOutputMaterial();
    this.fsQuad = new FullScreenQuad(this.outputMaterial);
    this.context = {
      colour: this.colourTarget.texture,
      depth: this.depthTexture,
      normal: this.normalTarget.texture,
      write: this.ping[0],
      camera,
      size: this.renderResolution,
      scene,
      time: 0,
    };
  }

  /** The look's dials, written by `PostFX.apply`. See `RetroShader`. */
  get outputUniforms(): Record<string, THREE.IUniform> {
    return this.outputMaterial.uniforms;
  }

  override setSize(width: number, height: number): void {
    this.resolution.set(width, height);
    this.renderResolution.set((width / this.pixelSize) | 0, (height / this.pixelSize) | 0);
    const { x, y } = this.renderResolution;
    this.colourTarget.setSize(x, y);
    this.normalTarget.setSize(x, y);
    for (const target of this.ping) target.setSize(x, y);
    for (const effect of this.effects) effect.setSize(x, y);
  }

  setPixelSize(pixelSize: number): void {
    this.pixelSize = pixelSize;
    this.setSize(this.resolution.x, this.resolution.y);
  }

  /**
   * Coverage samples on the colour render. 0 is off, and it is the colour target
   * only: an averaged normal across a silhouette is not a normal any surface has,
   * and the ping pair is written by fullscreen quads. Three builds the
   * multisampled framebuffer once and never revisits the count, so the target has
   * to be thrown away — with the depth texture detached first, because `dispose`
   * disposes it too and bloom has it bound as its own depth attachment.
   */
  setSamples(samples: number): void {
    if (this.colourTarget.samples === samples) return;
    this.colourTarget.samples = samples;
    this.colourTarget.depthTexture = null;
    this.colourTarget.dispose();
    this.colourTarget.depthTexture = this.depthTexture;
  }

  /** What the colour render is actually sampling at. Read by the checks. */
  get samples(): number {
    return this.colourTarget.samples;
  }

  /** Render height in chunky pixels. The groundcover width clamp reads it. */
  get renderHeight(): number {
    return this.renderResolution.y;
  }

  override render(
    renderer: THREE.WebGLRenderer,
    writeBuffer: THREE.WebGLRenderTarget | null,
  ): void {
    const gpu = this.clock;

    // --- the two scene renders ---------------------------------------------
    // The shadow map is drawn inside the first of these — `WebGLRenderer.render`
    // calls the shadow pass before its own — so `scene` here is scene plus shadows,
    // which is the honest grouping: they are one submission.
    gpu?.begin('scene');
    renderer.setRenderTarget(this.colourTarget);
    renderer.render(this.scene, this.camera);
    gpu?.end();

    gpu?.begin('normals');
    const priorOverride = this.scene.overrideMaterial;
    const priorAlpha = renderer.getClearAlpha();
    renderer.getClearColor(this.priorClear);
    renderer.setRenderTarget(this.normalTarget);
    // Its own clear, and not the fog colour every other target wants. See
    // `FLAT_NORMAL` — a clear that decodes to a short vector lights every pixel
    // the geometry misses, which outdoors is the whole sky.
    renderer.setClearColor(FLAT_NORMAL, 1);
    this.scene.overrideMaterial = this.normalMaterial;
    // Glow and cover out, for the one pass that reads geometry as geometry.
    showSurfaces(false);
    renderer.render(this.scene, this.camera);

    this.scene.overrideMaterial = priorOverride;
    renderer.setClearColor(this.priorClear, priorAlpha);
    // The groundcover draws itself in afterwards: the override cannot know its
    // instanced construction, so a normal buffer left to the override alone
    // ends at the ground under every blade and plume.
    drawCoverNormals(renderer, this.scene, this.camera);
    showSurfaces(true);
    gpu?.end();

    let colour: THREE.Texture = this.colourTarget.texture;
    let next = 0;

    // --- the effect chain ---------------------------------------------------
    const context = this.context;
    context.time = this.time;
    for (const effect of this.effects) {
      if (!effect.enabled) continue;
      gpu?.begin(effect.label);
      const write = this.ping[next];
      context.colour = colour;
      context.write = write;
      effect.render(renderer, context);
      gpu?.end();
      // A passthrough effect drew to its own target; the chain's colour is
      // untouched and the ping-pong slot stays free.
      if (effect.passthrough) continue;
      colour = write.texture;
      next = 1 - next;
    }

    // --- upscale ------------------------------------------------------------
    // Nearest is the whole of the pixelation: one chunky texel becomes a block of
    // identical device pixels, with no filtering to soften the step. The display
    // encode, the halftone and the quantizer ride along in the same shader, because
    // this is the one place they can all see a device pixel.
    gpu?.begin('upscale');
    this.outputMaterial.uniforms.tDiffuse.value = colour;
    this.fsQuad.material = this.outputMaterial;

    if (this.renderToScreen) {
      renderer.setRenderTarget(null);
    } else {
      renderer.setRenderTarget(writeBuffer);
      if (this.clear) renderer.clear();
    }
    this.fsQuad.render(renderer);
    gpu?.end();
  }

  override dispose(): void {
    this.colourTarget.dispose();
    this.normalTarget.dispose();
    for (const target of this.ping) target.dispose();
    for (const effect of this.effects) effect.dispose();
    this.normalMaterial.dispose();
    this.outputMaterial.dispose();
    this.fsQuad.dispose();
  }
}

/**
 * The upscale, and with it everything the frame owes device resolution. This blit,
 * the sRGB encode and the halftone and quantizer are one quad and one buffer
 * rather than three full-resolution passes — at 1080p and a device pixel ratio of
 * two that is about 25 M fragments and 133 MB of bandwidth a frame saved. The
 * order the three ran in is the order this shader does its work in.
 */
function createOutputMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    name: RetroShader.name,
    uniforms: THREE.UniformsUtils.clone(RetroShader.uniforms),
    vertexShader: RetroShader.vertexShader,
    fragmentShader: RetroShader.fragmentShader,
  });
}
