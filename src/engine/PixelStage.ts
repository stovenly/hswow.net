import * as THREE from 'three';
import { Pass, FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass.js';
import { drawCoverNormals } from '../art/cover';

/**
 * The pixel stage: render at chunky resolution, run effects there, upscale.
 *
 * This replaces three's `RenderPixelatedPass`, which did render-and-upscale
 * in one opaque step — and the slot between those two halves is where every
 * planned screen-space feature wants to live (SHADERS.md, R0). Owning the
 * stage turns that slot into a real thing:
 *
 * ```
 * scene ─► colour target (chunky, half-float, depth texture)
 *       ─► normal target  (chunky, override material)
 *       ─► edges          (the outline, onto the surfaces)
 *       ─► [effects…]     (chunky → chunky, ping-pong)
 *       ─► upscale        (nearest-neighbour blit)
 * ```
 *
 * The edge shader came verbatim from the upstream pass — same maths, same
 * output — because R0's exit criterion was that nothing changes on screen. Its
 * thresholds have since been graded; see `createEdgeMaterial`. The rest of the
 * differences from upstream are structural: the colour target keeps its
 * depth texture bound and hands it, with the normals, to whoever asks; effects
 * run between render and upscale, each reading the chain's colour so far and
 * writing the next link; and the outline is drawn *before* those effects
 * rather than fused to the upscale after them, so that fog and bloom cover it
 * instead of it multiplying them. See `render` for what that cost and did not
 * cost.
 *
 * Half-float colour is deliberate and inherited from upstream: at this
 * resolution it costs nothing, and it is the headroom bloom and god rays
 * will add light into before the tone map.
 */

/** What an effect pass gets to work with. All textures are chunky-resolution. */
export interface EffectContext {
  /** The scene colour as accumulated so far — read this, never write it. */
  colour: THREE.Texture;
  /**
   * The scene's depth texture, from the colour render.
   *
   * Typed as what it is rather than as a plain texture, because bloom binds it
   * as the *depth attachment* of its own target so that a lamp inside a hut is
   * occluded by the hut. That needs the concrete type.
   */
  depth: THREE.DepthTexture;
  /** View-space normals, packed 0..1, from the override render. */
  normal: THREE.Texture;
  /** Where this effect's output goes. Becomes the next effect's `colour`. */
  write: THREE.WebGLRenderTarget;
  camera: THREE.PerspectiveCamera;
  /** Chunky resolution in pixels. */
  size: THREE.Vector2;
  /**
   * The scene itself, for the one effect that draws rather than filters.
   *
   * Bloom renders the emitters again on their own layer; everything else here
   * is a texture-to-texture filter and has no business touching this.
   */
  scene: THREE.Scene;
  /**
   * Seconds since start-up — the same clock the sky and the wind read.
   *
   * Effects are spatial-only by ground rule 3, which forbids *accumulating*
   * across frames. It does not forbid knowing what time it is: fog that drifts
   * is a function of the clock, not a history of previous frames.
   */
  time: number;
}

/**
 * A chunky-resolution effect. One value per chunky pixel, no temporal state —
 * the ground rules in SHADERS.md. A disabled effect is skipped entirely and
 * must cost nothing.
 */
export interface PixelEffect {
  enabled: boolean;
  setSize(width: number, height: number): void;
  render(renderer: THREE.WebGLRenderer, context: EffectContext): void;
  dispose(): void;
}

export class PixelStage extends Pass {
  /** Chunky pixel size in device pixels. Set through `setPixelSize`. */
  pixelSize: number;
  normalEdgeStrength = 0.3;
  depthEdgeStrength = 0.4;
  /** Seconds since start-up, pushed from `PostFX.render`. See `EffectContext`. */
  time = 0;

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
  private readonly depthTexture: THREE.DepthTexture;
  private readonly normalTarget: THREE.WebGLRenderTarget;
  /**
   * Ping-pong pair for the effect chain. Separate from the colour target on
   * purpose: writing back into it would race its own depth texture, which the
   * upscale still needs for the edge lines.
   */
  private readonly ping: [THREE.WebGLRenderTarget, THREE.WebGLRenderTarget];

  private readonly edgeMaterial: THREE.ShaderMaterial;
  private readonly blitMaterial: THREE.ShaderMaterial;
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
    this.normalTarget = chunky();
    this.ping = [chunky(), chunky()];

    this.edgeMaterial = createEdgeMaterial();
    this.blitMaterial = createBlitMaterial();
    this.fsQuad = new FullScreenQuad(this.edgeMaterial);
  }

  override setSize(width: number, height: number): void {
    this.resolution.set(width, height);
    this.renderResolution.set((width / this.pixelSize) | 0, (height / this.pixelSize) | 0);
    const { x, y } = this.renderResolution;
    this.colourTarget.setSize(x, y);
    this.normalTarget.setSize(x, y);
    for (const target of this.ping) target.setSize(x, y);
    for (const effect of this.effects) effect.setSize(x, y);
    this.edgeMaterial.uniforms.resolution.value.set(x, y, 1 / x, 1 / y);
  }

  setPixelSize(pixelSize: number): void {
    this.pixelSize = pixelSize;
    this.setSize(this.resolution.x, this.resolution.y);
  }

  /**
   * Coverage samples on the colour render. 0 is off. Clamped by the caller.
   *
   * **The colour target only.** The normal target feeds the edge detector, and
   * an averaged normal across a silhouette reads as a *smaller* discontinuity —
   * the ink lines would soften. The ping pair is written by fullscreen quads,
   * where there is no coverage to sample.
   *
   * Three builds the multisampled framebuffer once and never revisits the
   * count, so the target has to be thrown away for a new one to take. The depth
   * texture is detached first: `dispose` disposes it too, and bloom has it bound
   * as the depth attachment of its *own* target — which three would not rebuild,
   * because bloom's target has not changed. See `Bloom.renderEmitters`.
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

  override render(renderer: THREE.WebGLRenderer, writeBuffer: THREE.WebGLRenderTarget): void {
    // --- the two scene renders, exactly as the upstream pass did them ------
    renderer.setRenderTarget(this.colourTarget);
    renderer.render(this.scene, this.camera);

    const priorOverride = this.scene.overrideMaterial;
    renderer.setRenderTarget(this.normalTarget);
    this.scene.overrideMaterial = this.normalMaterial;
    renderer.render(this.scene, this.camera);
    this.scene.overrideMaterial = priorOverride;
    // The groundcover draws itself in afterwards: the override cannot know its
    // instanced construction, and a normal buffer that ends at the ground lets
    // the edge pass outline whatever stands behind a blade straight through it.
    drawCoverNormals(renderer, this.scene, this.camera);

    // --- the edge lines, before anything is put in front of them ------------
    // **The outline belongs to the surface, so it is drawn onto the surface.**
    // It used to be applied at the very end, over the finished effect chain,
    // and a normal edge *brightens* — so it multiplied whatever was standing in
    // front of the geometry rather than the geometry itself. Pale fog came back
    // 1.5× and clipped to white, and a lamp's bloom halo arrived wearing an
    // outline of its own. Neither is a fog bug or a bloom bug; both are this
    // multiply happening a stage too late.
    //
    // Moved here, mist covers an outline exactly as it covers the wall the
    // outline is on, and a halo washes its own outline out. No special case in
    // either effect.
    //
    // This is not the visual change it sounds like. GTAO's composite is a pure
    // multiply, and multiplication commutes — `colour × ao × edge` and
    // `colour × edge × ao` are the same number — so the picture only moves
    // where an effect *adds* light or veils it, which is precisely the case
    // being fixed.
    let colour: THREE.Texture = this.colourTarget.texture;
    let next = 0;
    if (this.normalEdgeStrength > 0 || this.depthEdgeStrength > 0) {
      const edges = this.edgeMaterial.uniforms;
      edges.tDiffuse.value = colour;
      edges.tDepth.value = this.depthTexture;
      edges.tNormal.value = this.normalTarget.texture;
      edges.normalEdgeStrength.value = this.normalEdgeStrength;
      edges.depthEdgeStrength.value = this.depthEdgeStrength;
      this.fsQuad.material = this.edgeMaterial;
      renderer.setRenderTarget(this.ping[0]);
      this.fsQuad.render(renderer);
      colour = this.ping[0].texture;
      next = 1;
    }

    // --- the effect chain ---------------------------------------------------
    for (const effect of this.effects) {
      if (!effect.enabled) continue;
      const write = this.ping[next];
      effect.render(renderer, {
        colour,
        depth: this.depthTexture,
        normal: this.normalTarget.texture,
        write,
        camera: this.camera,
        size: this.renderResolution,
        scene: this.scene,
        time: this.time,
      });
      colour = write.texture;
      next = 1 - next;
    }

    // --- upscale ------------------------------------------------------------
    // A nearest blit and nothing else now that the edges are drawn upstream.
    // Nearest is the whole of the pixelation: one chunky texel becomes a block
    // of identical device pixels, with no filtering to soften the step.
    this.blitMaterial.uniforms.tDiffuse.value = colour;
    this.fsQuad.material = this.blitMaterial;

    if (this.renderToScreen) {
      renderer.setRenderTarget(null);
    } else {
      renderer.setRenderTarget(writeBuffer);
      if (this.clear) renderer.clear();
    }
    this.fsQuad.render(renderer);
  }

  override dispose(): void {
    this.colourTarget.dispose();
    this.normalTarget.dispose();
    for (const target of this.ping) target.dispose();
    for (const effect of this.effects) effect.dispose();
    this.normalMaterial.dispose();
    this.edgeMaterial.dispose();
    this.blitMaterial.dispose();
    this.fsQuad.dispose();
  }
}

/**
 * The edge shader: the depth/normal outline, applied to the chunky colour.
 *
 * Two things have changed since it arrived from `RenderPixelatedPass`.
 *
 * **When it runs.** Upstream it was fused to the upscale and therefore ran last,
 * over everything; here it runs on the surfaces alone, before any effect puts
 * fog or bloom in front of them. See the note in `render`.
 *
 * **Its thresholds are graded rather than binary.** Upstream binarised the same
 * signal three times over — `sign()`, then a 0.02-wide window, then
 * `step(0.1, …)` — so an outline was on or off with nothing between. A pixel a
 * third covered by an edge got the same line as one fully covered, which is an
 * outline that cannot be antialiased however well the rest of the frame is
 * sampled, and it is why diagonals read as staircases. The underlying quantity,
 * how sharply the surface turns, is continuous; these hand that back. `sign` and
 * `step` became `smoothstep` at the same crossing points, so a hard edge is
 * unchanged and only shallow and partly-covered ones grade. `normalIndicator`
 * stayed binary deliberately — it picks which side draws.
 */
function createEdgeMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      tDiffuse: { value: null },
      tDepth: { value: null },
      tNormal: { value: null },
      resolution: { value: new THREE.Vector4(1, 1, 1, 1) },
      normalEdgeStrength: { value: 0 },
      depthEdgeStrength: { value: 0 },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;

      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform sampler2D tDiffuse;
      uniform sampler2D tDepth;
      uniform sampler2D tNormal;
      uniform vec4 resolution;
      uniform float normalEdgeStrength;
      uniform float depthEdgeStrength;
      varying vec2 vUv;

      float getDepth(int x, int y) {
        return texture2D(tDepth, vUv + vec2(x, y) * resolution.zw).r;
      }

      vec3 getNormal(int x, int y) {
        return texture2D(tNormal, vUv + vec2(x, y) * resolution.zw).rgb * 2.0 - 1.0;
      }

      float depthEdgeIndicator(float depth, vec3 normal) {
        float diff = 0.0;
        diff += clamp(getDepth(1, 0) - depth, 0.0, 1.0);
        diff += clamp(getDepth(-1, 0) - depth, 0.0, 1.0);
        diff += clamp(getDepth(0, 1) - depth, 0.0, 1.0);
        diff += clamp(getDepth(0, -1) - depth, 0.0, 1.0);
        // Upstream quantized this to three values with floor(x * 2.) / 2.
        // Ungraded, so a pixel a third covered by an edge got the same line as
        // one fully covered, and a diagonal came out a staircase.
        return smoothstep(0.01, 0.02, diff);
      }

      float neighborNormalEdgeIndicator(int x, int y, float depth, vec3 normal) {
        float depthDiff = getDepth(x, y) - depth;
        vec3 neighborNormal = getNormal(x, y);

        // Edge pixels should yield to faces whose normals are closer to the bias normal.
        vec3 normalEdgeBias = vec3(1., 1., 1.);
        float normalDiff = dot(normal - neighborNormal, normalEdgeBias);
        // Left binary on purpose. This picks *which side* of an edge draws the
        // line; graded, both sides draw and every outline comes out double.
        float normalIndicator = clamp(smoothstep(-.01, .01, normalDiff), 0.0, 1.0);

        // Only the shallower pixel should detect the normal edge. Upstream flipped
        // this hard with sign(); same crossing point, graded across it.
        float depthIndicator = smoothstep(-0.014, -0.006, depthDiff);

        return (1.0 - dot(normal, neighborNormal)) * depthIndicator * normalIndicator;
      }

      float normalEdgeIndicator(float depth, vec3 normal) {
        float indicator = 0.0;
        indicator += neighborNormalEdgeIndicator(0, -1, depth, normal);
        indicator += neighborNormalEdgeIndicator(0, 1, depth, normal);
        indicator += neighborNormalEdgeIndicator(-1, 0, depth, normal);
        indicator += neighborNormalEdgeIndicator(1, 0, depth, normal);
        // **The one that mattered.** Upstream returned step(0.1, indicator), so
        // an outline was on or off with nothing between and could not be
        // antialiased however the rest of the frame was sampled. The quantity
        // being thresholded — how sharply the surface turns — is continuous, and
        // this hands that back. A hard 90 degree edge still reads 1.0 from a
        // single tap and is unchanged; what grades is everything shallower and
        // everything partly covered, which is the whole of the staircasing.
        return smoothstep(0.05, 0.25, indicator);
      }

      void main() {
        vec4 texel = texture2D(tDiffuse, vUv);

        float depth = 0.0;
        vec3 normal = vec3(0.0);

        if (depthEdgeStrength > 0.0 || normalEdgeStrength > 0.0) {
          depth = getDepth(0, 0);
          normal = getNormal(0, 0);
        }

        float dei = 0.0;
        if (depthEdgeStrength > 0.0)
          dei = depthEdgeIndicator(depth, normal);

        float nei = 0.0;
        if (normalEdgeStrength > 0.0)
          nei = normalEdgeIndicator(depth, normal);

        float strength = dei > 0.0 ? (1.0 - depthEdgeStrength * dei) : (1.0 + normalEdgeStrength * nei);

        gl_FragColor = texel * strength;
      }
    `,
  });
}

/**
 * The upscale: a nearest-neighbour blit, and deliberately nothing else.
 *
 * Everything this pass used to do besides the blit now happens upstream at
 * chunky resolution. What is left is the pixelation itself — one chunky texel
 * spread across a block of device pixels with no filtering, which is the only
 * step in the pipeline that has to happen at device resolution and the only
 * reason there is a pass here at all.
 */
function createBlitMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: { tDiffuse: { value: null } },
    vertexShader: /* glsl */ `
      varying vec2 vUv;

      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform sampler2D tDiffuse;
      varying vec2 vUv;

      void main() {
        gl_FragColor = texture2D(tDiffuse, vUv);
      }
    `,
  });
}
