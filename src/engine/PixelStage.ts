import * as THREE from 'three';
import { Pass, FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass.js';

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
 *       ─► [effects…]     (chunky → chunky, ping-pong)
 *       ─► upscale        (edge detection + nearest-neighbour blit)
 * ```
 *
 * The upscale's edge shader is lifted verbatim from the upstream pass — same
 * maths, same output — because R0's exit criterion is that nothing changes on
 * screen. Differences from upstream are structural only: the colour target
 * keeps its depth texture bound and hands it, with the normals, to whoever
 * asks; and effects run between render and upscale, each reading the chain's
 * colour so far and writing the next link.
 *
 * Half-float colour is deliberate and inherited from upstream: at this
 * resolution it costs nothing, and it is the headroom bloom and god rays
 * will add light into before the tone map.
 */

/** What an effect pass gets to work with. All textures are chunky-resolution. */
export interface EffectContext {
  /** The scene colour as accumulated so far — read this, never write it. */
  colour: THREE.Texture;
  /** The scene's depth texture, from the colour render. */
  depth: THREE.Texture;
  /** View-space normals, packed 0..1, from the override render. */
  normal: THREE.Texture;
  /** Where this effect's output goes. Becomes the next effect's `colour`. */
  write: THREE.WebGLRenderTarget;
  camera: THREE.PerspectiveCamera;
  /** Chunky resolution in pixels. */
  size: THREE.Vector2;
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

  private readonly upscaleMaterial: THREE.ShaderMaterial;
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

    this.upscaleMaterial = createUpscaleMaterial();
    this.fsQuad = new FullScreenQuad(this.upscaleMaterial);
  }

  override setSize(width: number, height: number): void {
    this.resolution.set(width, height);
    this.renderResolution.set((width / this.pixelSize) | 0, (height / this.pixelSize) | 0);
    const { x, y } = this.renderResolution;
    this.colourTarget.setSize(x, y);
    this.normalTarget.setSize(x, y);
    for (const target of this.ping) target.setSize(x, y);
    for (const effect of this.effects) effect.setSize(x, y);
    this.upscaleMaterial.uniforms.resolution.value.set(x, y, 1 / x, 1 / y);
  }

  setPixelSize(pixelSize: number): void {
    this.pixelSize = pixelSize;
    this.setSize(this.resolution.x, this.resolution.y);
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

    // --- the effect chain ---------------------------------------------------
    let colour: THREE.Texture = this.colourTarget.texture;
    let next = 0;
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
      });
      colour = write.texture;
      next = 1 - next;
    }

    // --- upscale, with the edge lines --------------------------------------
    const uniforms = this.upscaleMaterial.uniforms;
    uniforms.tDiffuse.value = colour;
    uniforms.tDepth.value = this.depthTexture;
    uniforms.tNormal.value = this.normalTarget.texture;
    uniforms.normalEdgeStrength.value = this.normalEdgeStrength;
    uniforms.depthEdgeStrength.value = this.depthEdgeStrength;

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
    this.upscaleMaterial.dispose();
    this.fsQuad.dispose();
  }
}

/**
 * The upscale shader: nearest-neighbour blit plus the depth/normal edge
 * lines. Lifted from `RenderPixelatedPass` unchanged — the point of R0 is
 * that this stage produces the same picture the upstream pass did, and the
 * edge look is tuned; nothing here is ours to improve.
 */
function createUpscaleMaterial(): THREE.ShaderMaterial {
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
        return floor(smoothstep(0.01, 0.02, diff) * 2.) / 2.;
      }

      float neighborNormalEdgeIndicator(int x, int y, float depth, vec3 normal) {
        float depthDiff = getDepth(x, y) - depth;
        vec3 neighborNormal = getNormal(x, y);

        // Edge pixels should yield to faces whose normals are closer to the bias normal.
        vec3 normalEdgeBias = vec3(1., 1., 1.);
        float normalDiff = dot(normal - neighborNormal, normalEdgeBias);
        float normalIndicator = clamp(smoothstep(-.01, .01, normalDiff), 0.0, 1.0);

        // Only the shallower pixel should detect the normal edge.
        float depthIndicator = clamp(sign(depthDiff * .25 + .0025), 0.0, 1.0);

        return (1.0 - dot(normal, neighborNormal)) * depthIndicator * normalIndicator;
      }

      float normalEdgeIndicator(float depth, vec3 normal) {
        float indicator = 0.0;
        indicator += neighborNormalEdgeIndicator(0, -1, depth, normal);
        indicator += neighborNormalEdgeIndicator(0, 1, depth, normal);
        indicator += neighborNormalEdgeIndicator(-1, 0, depth, normal);
        indicator += neighborNormalEdgeIndicator(1, 0, depth, normal);
        return step(0.1, indicator);
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
