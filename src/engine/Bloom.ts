import * as THREE from 'three';
import { FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass.js';
import { GLOW_LAYER } from '../layers';
import type { PixelEffect, EffectContext } from './PixelStage';

/**
 * Selective bloom, via the glow material. No threshold: nothing in this scene is
 * HDR-bright, so a brightness threshold either catches nothing or catches sunlit
 * walls — but everything that means to emit shares one layer, so what blooms is
 * what is on `GLOW_LAYER`.
 *
 * Three stages: an emitters pass with the camera restricted to that layer; a
 * dual-Kawase blur three levels down and two back up, all at chunky resolution
 * and below; and an additive composite in linear light before the sRGB encode, so
 * the glow goes through the tone map and the halftone like any other light.
 *
 * The emitters pass borrows the scene's depth buffer, which is what stops a
 * lantern inside a hut blooming through the wall: `GLOW_MATERIAL` is
 * `depthTest: true, depthWrite: false`, so it fails the test and never reaches
 * the blur. This pass clears colour only — the upscale needs the depth.
 */

/** Levels in the blur chain. Three halvings is a wide blur at this resolution. */
const LEVELS = 3;

export class BloomEffect implements PixelEffect {
  readonly label = 'bloom';
  enabled = false;
  /** How much of the blurred emitters is added back. The one taste knob. */
  strength = 1;
  /** Spread, as a multiple of the texel offset at each level. */
  radius = 1;

  private readonly emitters: THREE.WebGLRenderTarget;
  /** Successively halved. `down[0]` is half the chunky resolution. */
  private readonly down: THREE.WebGLRenderTarget[] = [];
  /**
   * The way back up, one target per level below the smallest. A separate set
   * rather than writing back into `down`, because an up pass reads the level it is
   * adding to, and sampling the texture you are rendering into is undefined
   * behaviour that happens to work on most drivers.
   */
  private readonly up: THREE.WebGLRenderTarget[] = [];

  private readonly downMaterial: THREE.ShaderMaterial;
  private readonly upMaterial: THREE.ShaderMaterial;
  private readonly compositeMaterial: THREE.ShaderMaterial;
  private readonly quad: FullScreenQuad;

  /** Scratch for saving renderer and camera state across the emitters pass. */
  private readonly priorClear = new THREE.Color();
  private priorMask = 1;

  constructor() {
    this.emitters = half();
    for (let i = 0; i < LEVELS; i++) this.down.push(half());
    for (let i = 0; i < LEVELS - 1; i++) this.up.push(half());

    this.downMaterial = createDownMaterial();
    this.upMaterial = createUpMaterial();
    this.compositeMaterial = createCompositeMaterial();
    this.quad = new FullScreenQuad(this.downMaterial);
  }

  setSize(width: number, height: number): void {
    this.emitters.setSize(width, height);
    for (let i = 0; i < LEVELS; i++) {
      // Halved per level, floored at one texel so a very small window cannot
      // produce a zero-sized target.
      const scale = 2 ** (i + 1);
      const w = Math.max(1, Math.floor(width / scale));
      const h = Math.max(1, Math.floor(height / scale));
      this.down[i].setSize(w, h);
      // The up target at a level is the same size as the down target it adds
      // to, which is what lets the two be sampled with one set of UVs.
      if (i < LEVELS - 1) this.up[i].setSize(w, h);
    }
  }

  render(renderer: THREE.WebGLRenderer, context: EffectContext): void {
    this.renderEmitters(renderer, context);

    // --- down the chain -----------------------------------------------------
    this.quad.material = this.downMaterial;
    let source: THREE.Texture = this.emitters.texture;
    let sourceWidth = context.size.x;
    let sourceHeight = context.size.y;
    for (let i = 0; i < LEVELS; i++) {
      const target = this.down[i];
      this.downMaterial.uniforms.tDiffuse.value = source;
      // Half a source texel, not a whole one, and this is the difference between a
      // stable bloom and one that flickers as you walk. At a full texel every tap
      // lands dead on a texel centre, so the bilinear filter interpolates nothing
      // and most source texels are never read at all. Offset by half, every tap
      // sits at a corner between four texels and comes back as their average.
      this.downMaterial.uniforms.uHalfTexel.value.set(
        (0.5 * this.radius) / sourceWidth,
        (0.5 * this.radius) / sourceHeight,
      );
      // Firefly suppression on the first level only — see the material.
      this.downMaterial.uniforms.uKaris.value = i === 0 ? 1 : 0;
      renderer.setRenderTarget(target);
      this.quad.render(renderer);
      source = target.texture;
      sourceWidth = target.width;
      sourceHeight = target.height;
    }

    // --- and back up --------------------------------------------------------
    // Each up pass reads the smaller level and the down level at its own size and
    // sums them, rather than relying on additive blend state.
    this.quad.material = this.upMaterial;
    for (let i = LEVELS - 2; i >= 0; i--) {
      // The first step up comes off the smallest down level; after that, off
      // the up level below, so the sum accumulates all the way to the top.
      const smaller = i === LEVELS - 2 ? this.down[LEVELS - 1] : this.up[i + 1];
      this.upMaterial.uniforms.tSource.value = smaller.texture;
      this.upMaterial.uniforms.tPrevious.value = this.down[i].texture;
      // Half a texel of the smaller level, matching the downsample — the tent
      // below is written in units of it.
      this.upMaterial.uniforms.uHalfTexel.value.set(
        (0.5 * this.radius) / smaller.width,
        (0.5 * this.radius) / smaller.height,
      );
      renderer.setRenderTarget(this.up[i]);
      this.quad.render(renderer);
    }

    // --- composite ----------------------------------------------------------
    const composite = this.compositeMaterial.uniforms;
    composite.tDiffuse.value = context.colour;
    composite.tBloom.value = this.up[0].texture;
    composite.uStrength.value = this.strength;
    renderer.setRenderTarget(context.write);
    this.quad.material = this.compositeMaterial;
    this.quad.render(renderer);
  }

  /** The scene, with only the things that mean to emit in it. */
  private renderEmitters(renderer: THREE.WebGLRenderer, context: EffectContext): void {
    const { camera, scene } = context;

    // Bound once, and only when it changes: the depth the colour pass filled, so a
    // lamp behind a wall is a lamp behind a wall. The dispose is not optional —
    // three builds a target's framebuffer the first time it is rendered into and
    // never revisits the attachments, so a depth texture assigned afterwards is a
    // field that is set and an attachment that is not.
    if (this.emitters.depthTexture !== context.depth) {
      this.emitters.depthTexture = context.depth;
      this.emitters.dispose();
    }

    const priorAutoClear = renderer.autoClear;
    const priorAlpha = renderer.getClearAlpha();
    renderer.getClearColor(this.priorClear);
    this.priorMask = camera.layers.mask;

    renderer.setRenderTarget(this.emitters);
    // **Colour only.** An automatic clear would take the depth buffer with it,
    // and that buffer is the scene's — the fog volumes have already marched
    // against it.
    renderer.autoClear = false;
    renderer.setClearColor(0x000000, 1);
    renderer.clearColor();

    camera.layers.set(GLOW_LAYER);
    renderer.render(scene, camera);

    camera.layers.mask = this.priorMask;
    renderer.setClearColor(this.priorClear, priorAlpha);
    renderer.autoClear = priorAutoClear;
  }

  dispose(): void {
    this.emitters.dispose();
    for (const target of this.down) target.dispose();
    for (const target of this.up) target.dispose();
    this.downMaterial.dispose();
    this.upMaterial.dispose();
    this.compositeMaterial.dispose();
    this.quad.dispose();
  }
}

/**
 * A blur-chain target. Half-float, like the stage's own colour target: glow is
 * additive and several overlapping emitters go well past 1 before the tone map has
 * brought them back. Linear filtering rather than the nearest the rest of the
 * pipeline uses — this is the one place sampling between chunky pixels is correct,
 * because the whole job is to spread light across them.
 */
function half(): THREE.WebGLRenderTarget {
  const target = new THREE.WebGLRenderTarget(1, 1);
  target.texture.minFilter = THREE.LinearFilter;
  target.texture.magFilter = THREE.LinearFilter;
  target.texture.type = THREE.HalfFloatType;
  return target;
}

const FULLSCREEN_VERTEX = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/**
 * Dual-Kawase downsample: the centre plus four diagonals, weighted so the centre
 * carries half. The halving does most of the widening, so three levels of five
 * taps compound into a very wide kernel.
 */
function createDownMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      tDiffuse: { value: null },
      uHalfTexel: { value: new THREE.Vector2() },
      uKaris: { value: 0 },
    },
    vertexShader: FULLSCREEN_VERTEX,
    fragmentShader: /* glsl */ `
      uniform sampler2D tDiffuse;
      uniform vec2 uHalfTexel;
      uniform float uKaris;
      varying vec2 vUv;

      // Karis average: weight each tap by the reciprocal of its brightness. A blur
      // is a mean, and a mean is dominated by its largest term — so one texel far
      // brighter than its neighbours decides every downsample it survives into, and
      // whether it survives depends on where it lands on the next grid down.
      // First level only; after it the fireflies are already averaged away.
      float weigh(vec3 colour) {
        float luma = dot(colour, vec3(0.2126, 0.7152, 0.0722));
        return mix(1.0, 1.0 / (1.0 + luma), uKaris);
      }

      void main() {
        // Every tap sits half a texel off centre, so the bilinear filter
        // returns the average of the four texels around it — see the note in
        // the render loop on why a whole texel is the bug this replaced.
        vec4 c0 = texture2D(tDiffuse, vUv);
        vec4 c1 = texture2D(tDiffuse, vUv + vec2(-uHalfTexel.x, -uHalfTexel.y));
        vec4 c2 = texture2D(tDiffuse, vUv + vec2( uHalfTexel.x, -uHalfTexel.y));
        vec4 c3 = texture2D(tDiffuse, vUv + vec2(-uHalfTexel.x,  uHalfTexel.y));
        vec4 c4 = texture2D(tDiffuse, vUv + vec2( uHalfTexel.x,  uHalfTexel.y));

        float w0 = 4.0 * weigh(c0.rgb);
        float w1 = weigh(c1.rgb);
        float w2 = weigh(c2.rgb);
        float w3 = weigh(c3.rgb);
        float w4 = weigh(c4.rgb);

        vec4 sum = c0 * w0 + c1 * w1 + c2 * w2 + c3 * w3 + c4 * w4;
        gl_FragColor = sum / max(w0 + w1 + w2 + w3 + w4, 1e-4);
      }
    `,
  });
}

/**
 * Dual-Kawase upsample: eight taps in a ring, summed with what is already at this
 * level — four on the diagonals at full offset, four on the axes at double,
 * weighted 1 and 2. It is what keeps a plain bilinear upscale of a small target
 * from giving a boxy, stepped falloff.
 */
function createUpMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      tSource: { value: null },
      tPrevious: { value: null },
      uHalfTexel: { value: new THREE.Vector2() },
    },
    vertexShader: FULLSCREEN_VERTEX,
    fragmentShader: /* glsl */ `
      uniform sampler2D tSource;
      uniform sampler2D tPrevious;
      uniform vec2 uHalfTexel;
      varying vec2 vUv;

      void main() {
        vec4 sum = texture2D(tSource, vUv + vec2(-uHalfTexel.x * 2.0, 0.0));
        sum += texture2D(tSource, vUv + vec2(-uHalfTexel.x, uHalfTexel.y)) * 2.0;
        sum += texture2D(tSource, vUv + vec2(0.0, uHalfTexel.y * 2.0));
        sum += texture2D(tSource, vUv + vec2(uHalfTexel.x, uHalfTexel.y)) * 2.0;
        sum += texture2D(tSource, vUv + vec2(uHalfTexel.x * 2.0, 0.0));
        sum += texture2D(tSource, vUv + vec2(uHalfTexel.x, -uHalfTexel.y)) * 2.0;
        sum += texture2D(tSource, vUv + vec2(0.0, -uHalfTexel.y * 2.0));
        sum += texture2D(tSource, vUv + vec2(-uHalfTexel.x, -uHalfTexel.y)) * 2.0;
        gl_FragColor = sum / 12.0 + texture2D(tPrevious, vUv);
      }
    `,
  });
}

function createCompositeMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      tDiffuse: { value: null },
      tBloom: { value: null },
      uStrength: { value: 1 },
    },
    vertexShader: FULLSCREEN_VERTEX,
    fragmentShader: /* glsl */ `
      uniform sampler2D tDiffuse;
      uniform sampler2D tBloom;
      uniform float uStrength;
      varying vec2 vUv;

      void main() {
        vec4 colour = texture2D(tDiffuse, vUv);
        // Additive, and in linear light, because this is light being added to
        // a scene rather than a screen effect being mixed over a picture.
        // Alpha is the scene's — the bloom contributes brightness, not cover.
        colour.rgb += texture2D(tBloom, vUv).rgb * uStrength;
        gl_FragColor = colour;
      }
    `,
  });
}
