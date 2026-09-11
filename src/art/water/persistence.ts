import * as THREE from 'three';
import { FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass.js';
import { NOISE_GLSL } from '../../engine/noise';
import { windUniforms } from '../sway';
import { TRAIN_GLSL } from './waves';

// The persistence buffer: what moved on the water, remembered. Red is foam,
// green is wet sand. A world-xz target round the camera, snapped to its texel,
// ping-ponged each frame as max(old · decay, source) with a one-texel blur.

/** Texels a side, and metres the buffer covers. 0.25 m per texel. */
const RESOLUTION = 512;
const SPAN = 128;
const TEXEL = SPAN / RESOLUTION;
/** Per-frame decay at sixty, for foam and for wet. */
const FOAM_DECAY = 0.985;
const WET_DECAY = 0.995;
/** Stamps one frame can take. */
const MAX_STAMPS = 256;

export interface Stamp {
  x: number;
  z: number;
  radius: number;
  /** 0..1 foam written, and 0..1 wet written. */
  foam: number;
  wet: number;
}

const DECAY = new THREE.ShaderMaterial({
  uniforms: {
    tPrev: { value: null },
    /** Texels the window moved since the last frame. */
    uShift: { value: new THREE.Vector2() },
    uTexel: { value: 1 / RESOLUTION },
    uDecay: { value: new THREE.Vector2(FOAM_DECAY, WET_DECAY) },
    uMin: { value: new THREE.Vector2() },
    uSize: { value: new THREE.Vector2(SPAN, SPAN) },
    /** Whether a sea writes its swash into the wet lane this frame. */
    uSeaOn: { value: 0 },
    ...windUniforms,
    tFieldA: { value: null },
    tFieldB: { value: null },
    uFieldMin: { value: new THREE.Vector2() },
    uFieldSize: { value: new THREE.Vector2(1, 1) },
    uLevel: { value: 0 },
    uSwell: { value: new THREE.Vector4(0, -1, 0.2, 0) },
    uOmega: { value: 1.4 },
    uWaterMotion: { value: 1 },
    uWaveScale: { value: 1 },
    uRunup: { value: 1.4 },
    uChop: { value: 1 },
  },
  depthTest: false,
  depthWrite: false,
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tPrev;
    uniform vec2 uShift;
    uniform float uTexel;
    uniform vec2 uDecay;
    uniform vec2 uMin;
    uniform vec2 uSize;
    uniform float uSeaOn;
    varying vec2 vUv;

    ${NOISE_GLSL}
    ${TRAIN_GLSL}

    vec4 prev(vec2 uv) {
      if (any(lessThan(uv, vec2(0.0))) || any(greaterThan(uv, vec2(1.0)))) return vec4(0.0);
      return texture2D(tPrev, uv);
    }

    void main() {
      vec2 uv = vUv + uShift * uTexel;
      vec4 c = prev(uv);
      vec4 sum = c * 4.0
        + prev(uv + vec2(uTexel, 0.0)) + prev(uv - vec2(uTexel, 0.0))
        + prev(uv + vec2(0.0, uTexel)) + prev(uv - vec2(0.0, uTexel));
      vec4 blurred = sum / 8.0;
      vec2 kept = blurred.rg * uDecay;
      if (uSeaOn > 0.5) {
        vec2 world = uMin + vUv * uSize;
        vec4 fa = fieldA(world);
        vec4 fb = fieldB(world);
        if (inField(world) && fa.x <= 0.0) {
          float a0 = swellAmplitude(fb.w);
          float a;
          float b;
          float k;
          float phi;
          trainAt(fa.x, fb.z, a0, a, b, k, phi);
          float since = sinceCrest(phi);
          vec2 dir = vec2(cos(fa.z), sin(fa.z));
          vec2 across = vec2(-dir.y, dir.x);
          float wave = floor(-phi * 0.15915494);
          float tongue = valueNoise(vec2(dot(world, across) * 0.3, wave * 0.618 + 3.7));
          float runup = uRunup * a0 * (0.65 + 0.7 * tongue);
          float rise = -fa.x;
          float wet = surgeAt(since) * (1.0 - smoothstep(runup * 0.7, runup * 1.3, rise)) * step(0.0, a0 - 0.001);
          kept.g = max(kept.g, wet);
        }
      }
      gl_FragColor = vec4(kept, 0.0, 1.0);
    }
  `,
});

const STAMP = new THREE.ShaderMaterial({
  depthTest: false,
  depthWrite: false,
  transparent: true,
  blending: THREE.CustomBlending,
  blendEquation: THREE.MaxEquation,
  blendSrc: THREE.OneFactor,
  blendDst: THREE.OneFactor,
  vertexShader: /* glsl */ `
    attribute vec2 aCorner;
    attribute vec2 aValue;
    varying vec2 vCorner;
    varying vec2 vValue;
    void main() {
      vCorner = aCorner;
      vValue = aValue;
      gl_Position = vec4(position.xy * 2.0 - 1.0, 0.0, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    varying vec2 vCorner;
    varying vec2 vValue;
    void main() {
      float d = length(vCorner);
      float soft = clamp(1.0 - d * d, 0.0, 1.0);
      gl_FragColor = vec4(vValue * soft, 0.0, 1.0);
    }
  `,
});

export class Persistence {
  readonly min = new THREE.Vector2();
  readonly size = new THREE.Vector2(SPAN, SPAN);
  private readonly targets: [THREE.WebGLRenderTarget, THREE.WebGLRenderTarget];
  private index = 0;
  private readonly quad = new FullScreenQuad(DECAY);
  private readonly stamps: Stamp[] = [];
  private readonly stampMesh: THREE.Mesh;
  private readonly stampPositions: THREE.BufferAttribute;
  private readonly stampCorners: THREE.BufferAttribute;
  private readonly stampValues: THREE.BufferAttribute;
  private readonly stampScene = new THREE.Scene();
  private readonly stampCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  private placed = false;

  constructor() {
    const make = (): THREE.WebGLRenderTarget =>
      new THREE.WebGLRenderTarget(RESOLUTION, RESOLUTION, {
        type: THREE.UnsignedByteType,
        format: THREE.RGBAFormat,
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        wrapS: THREE.ClampToEdgeWrapping,
        wrapT: THREE.ClampToEdgeWrapping,
        depthBuffer: false,
        stencilBuffer: false,
        generateMipmaps: false,
      });
    this.targets = [make(), make()];

    const geometry = new THREE.BufferGeometry();
    this.stampPositions = new THREE.BufferAttribute(new Float32Array(MAX_STAMPS * 4 * 3), 3);
    this.stampCorners = new THREE.BufferAttribute(new Float32Array(MAX_STAMPS * 4 * 2), 2);
    this.stampValues = new THREE.BufferAttribute(new Float32Array(MAX_STAMPS * 4 * 2), 2);
    this.stampPositions.setUsage(THREE.DynamicDrawUsage);
    this.stampCorners.setUsage(THREE.DynamicDrawUsage);
    this.stampValues.setUsage(THREE.DynamicDrawUsage);
    geometry.setAttribute('position', this.stampPositions);
    geometry.setAttribute('aCorner', this.stampCorners);
    geometry.setAttribute('aValue', this.stampValues);
    const index: number[] = [];
    for (let i = 0; i < MAX_STAMPS; i++) {
      const b = i * 4;
      index.push(b, b + 1, b + 2, b, b + 2, b + 3);
    }
    geometry.setIndex(index);
    geometry.setDrawRange(0, 0);
    this.stampMesh = new THREE.Mesh(geometry, STAMP);
    this.stampMesh.frustumCulled = false;
    this.stampScene.add(this.stampMesh);
  }

  get texture(): THREE.Texture {
    return this.targets[this.index].texture;
  }

  stamp(stamp: Stamp): void {
    if (this.stamps.length < MAX_STAMPS) this.stamps.push(stamp);
  }

  /** The V behind something moving: discs down two arms at Kelvin's 19.47° half angle. */
  wake(x: number, z: number, dirX: number, dirZ: number, radius: number, speed: number): void {
    const length = Math.min(6, speed * 4);
    const arms = Math.max(1, Math.round(length / (radius * 0.8)));
    const half = Math.tan(0.3398);
    for (let i = 1; i <= arms; i++) {
      const back = (i / arms) * length;
      const side = back * half;
      const s = 0.5 * (1 - i / (arms + 1));
      this.stamp({ x: x - dirX * back - dirZ * side, z: z - dirZ * back + dirX * side, radius: radius * 0.5, foam: s, wet: 0 });
      this.stamp({ x: x - dirX * back + dirZ * side, z: z - dirZ * back - dirX * side, radius: radius * 0.5, foam: s, wet: 0 });
    }
  }

  /**
   * One frame: move the window with the camera, decay and blur, write the sea's
   * swash into wet, then stamp this frame's sources.
   */
  update(
    renderer: THREE.WebGLRenderer,
    cameraX: number,
    cameraZ: number,
    motion: number,
    sea: { bind(uniforms: Record<string, THREE.IUniform>): void } | null,
  ): void {
    const targetX = Math.round((cameraX - SPAN / 2) / TEXEL) * TEXEL;
    const targetZ = Math.round((cameraZ - SPAN / 2) / TEXEL) * TEXEL;
    const shiftX = this.placed ? Math.round((targetX - this.min.x) / TEXEL) : 0;
    const shiftZ = this.placed ? Math.round((targetZ - this.min.y) / TEXEL) : 0;
    this.min.set(targetX, targetZ);

    const prior = renderer.getRenderTarget();
    const priorAutoClear = renderer.autoClear;
    renderer.autoClear = false;
    if (!this.placed) {
      for (const t of this.targets) {
        renderer.setRenderTarget(t);
        renderer.setClearColor(0x000000, 0);
        renderer.clear(true, false, false);
      }
      this.placed = true;
    }

    const from = this.targets[this.index];
    const to = this.targets[1 - this.index];
    const u = DECAY.uniforms;
    u.tPrev.value = from.texture;
    (u.uShift.value as THREE.Vector2).set(shiftX, shiftZ);
    (u.uMin.value as THREE.Vector2).copy(this.min);
    (u.uDecay.value as THREE.Vector2).set(motion > 0 ? FOAM_DECAY : 1, motion > 0 ? WET_DECAY : 1);
    u.uSeaOn.value = sea ? 1 : 0;
    if (sea) sea.bind(u);
    renderer.setRenderTarget(to);
    this.quad.render(renderer);

    const count = Math.min(MAX_STAMPS, this.stamps.length);
    if (count > 0) {
      const pos = this.stampPositions.array as Float32Array;
      const corner = this.stampCorners.array as Float32Array;
      const value = this.stampValues.array as Float32Array;
      for (let i = 0; i < count; i++) {
        const s = this.stamps[i];
        const cx = (s.x - this.min.x) / SPAN;
        const cz = (s.z - this.min.y) / SPAN;
        const r = s.radius / SPAN;
        const corners = [-1, -1, 1, -1, 1, 1, -1, 1];
        for (let k = 0; k < 4; k++) {
          const v = i * 4 + k;
          pos[v * 3] = cx + corners[k * 2] * r;
          pos[v * 3 + 1] = cz + corners[k * 2 + 1] * r;
          pos[v * 3 + 2] = 0;
          corner[v * 2] = corners[k * 2];
          corner[v * 2 + 1] = corners[k * 2 + 1];
          value[v * 2] = s.foam;
          value[v * 2 + 1] = s.wet;
        }
      }
      this.stampPositions.needsUpdate = true;
      this.stampCorners.needsUpdate = true;
      this.stampValues.needsUpdate = true;
      this.stampMesh.geometry.setDrawRange(0, count * 6);
      renderer.render(this.stampScene, this.stampCamera);
    }
    this.stamps.length = 0;
    this.index = 1 - this.index;
    renderer.autoClear = priorAutoClear;
    renderer.setRenderTarget(prior);
  }

  dispose(): void {
    for (const t of this.targets) t.dispose();
    this.quad.dispose();
    this.stampMesh.geometry.dispose();
  }
}
