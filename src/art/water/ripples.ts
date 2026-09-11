import * as THREE from 'three';
import { FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass.js';

// The ripple height-field a still body owns: a ping-pong pair stepped once a
// frame, with impulses stamped in as cosine bumps.

/** Impulses one frame can take. The rest wait a frame, which nobody sees. */
const MAX_IMPULSES = 16;
/** Per-step damping of the wave equation. */
const DAMP = 0.985;

/** Rain on the water, 0..1. Written by the weather rig; read by every live ripple field. */
let rainRate = 0;
export function setWaterRain(amount: number): void {
  rainRate = Math.min(1, Math.max(0, amount));
}

const STEP = new THREE.ShaderMaterial({
  uniforms: {
    tPrev: { value: null },
    uTexel: { value: new THREE.Vector2() },
    uMin: { value: new THREE.Vector2() },
    uSize: { value: new THREE.Vector2(1, 1) },
    uImpulse: { value: Array.from({ length: MAX_IMPULSES }, () => new THREE.Vector4()) },
    uCount: { value: 0 },
    uDamp: { value: DAMP },
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
    uniform vec2 uTexel;
    uniform vec2 uMin;
    uniform vec2 uSize;
    uniform vec4 uImpulse[${MAX_IMPULSES}];
    uniform int uCount;
    uniform float uDamp;
    varying vec2 vUv;

    void main() {
      vec4 p = texture2D(tPrev, vUv);
      float h = p.r;
      float prev = p.g;
      float n = texture2D(tPrev, vUv + vec2(0.0, uTexel.y)).r;
      float s = texture2D(tPrev, vUv - vec2(0.0, uTexel.y)).r;
      float e = texture2D(tPrev, vUv + vec2(uTexel.x, 0.0)).r;
      float w = texture2D(tPrev, vUv - vec2(uTexel.x, 0.0)).r;
      float next = ((n + s + e + w) * 0.5 - prev) * uDamp;
      // The edge holds still, so a ring dies at the bank instead of bouncing off it.
      float edge = min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y));
      next *= smoothstep(0.0, uTexel.x * 3.0, edge);
      vec2 world = uMin + vUv * uSize;
      for (int i = 0; i < ${MAX_IMPULSES}; i++) {
        if (i >= uCount) break;
        vec4 imp = uImpulse[i];
        float d = distance(world, imp.xy) / max(imp.z, 1e-3);
        if (d < 1.0) next += imp.w * (0.5 + 0.5 * cos(3.14159265 * d));
      }
      gl_FragColor = vec4(next, h, 0.0, 1.0);
    }
  `,
});

const quad = new FullScreenQuad(STEP);

export class RippleField {
  readonly min = new THREE.Vector2();
  readonly size = new THREE.Vector2();
  private readonly targets: [THREE.WebGLRenderTarget, THREE.WebGLRenderTarget];
  private index = 0;
  private readonly pending: number[] = [];
  private rainCarry = 0;
  /** Set once the pair has been cleared; a field that comes back in range restarts flat. */
  private live = false;

  constructor(x0: number, z0: number, width: number, depth: number, resolution: number) {
    this.min.set(x0, z0);
    this.size.set(width, depth);
    const make = (): THREE.WebGLRenderTarget =>
      new THREE.WebGLRenderTarget(resolution, resolution, {
        type: THREE.HalfFloatType,
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
  }

  get texture(): THREE.Texture {
    return this.targets[this.index].texture;
  }

  get resolution(): number {
    return this.targets[0].width;
  }

  /** Metres of world one texel spans. */
  get texel(): number {
    return this.size.x / this.resolution;
  }

  /** A cosine bump `radius` metres wide and `strength` metres tall, next step. */
  impulse(x: number, z: number, radius: number, strength: number): void {
    this.pending.push(x, z, radius, strength);
  }

  /** Rain over the whole body at the weather's rate. `wet(x, z)` says whether a point is over water. */
  rain(dt: number, wet: (x: number, z: number) => boolean, rng: () => number): void {
    if (rainRate <= 0) return;
    const area = this.size.x * this.size.y;
    this.rainCarry += rainRate * 4 * area * dt;
    let budget = MAX_IMPULSES - this.pending.length / 4;
    while (this.rainCarry >= 1 && budget > 0) {
      this.rainCarry -= 1;
      budget--;
      const x = this.min.x + rng() * this.size.x;
      const z = this.min.y + rng() * this.size.y;
      if (wet(x, z)) this.impulse(x, z, 0.15, 0.012 + 0.01 * rng());
    }
    if (this.rainCarry > 4) this.rainCarry = 4;
  }

  step(renderer: THREE.WebGLRenderer, dt: number, motion: number): void {
    const prior = renderer.getRenderTarget();
    const priorAutoClear = renderer.autoClear;
    if (!this.live) {
      for (const t of this.targets) {
        renderer.setRenderTarget(t);
        renderer.setClearColor(0x000000, 0);
        renderer.clear(true, false, false);
      }
      this.live = true;
    }
    if (motion > 0) {
      const steps = Math.min(3, Math.max(1, Math.round(dt * 60)));
      const u = STEP.uniforms;
      (u.uTexel.value as THREE.Vector2).set(1 / this.resolution, 1 / this.resolution);
      (u.uMin.value as THREE.Vector2).copy(this.min);
      (u.uSize.value as THREE.Vector2).copy(this.size);
      renderer.autoClear = false;
      for (let s = 0; s < steps; s++) {
        const from = this.targets[this.index];
        const to = this.targets[1 - this.index];
        u.tPrev.value = from.texture;
        const count = s === 0 ? Math.min(MAX_IMPULSES, this.pending.length / 4) : 0;
        u.uCount.value = count;
        const list = u.uImpulse.value as THREE.Vector4[];
        for (let i = 0; i < count; i++) {
          list[i].set(this.pending[i * 4], this.pending[i * 4 + 1], this.pending[i * 4 + 2], this.pending[i * 4 + 3]);
        }
        renderer.setRenderTarget(to);
        quad.render(renderer);
        this.index = 1 - this.index;
      }
      this.pending.splice(0, Math.min(MAX_IMPULSES, this.pending.length / 4) * 4);
    }
    renderer.autoClear = priorAutoClear;
    renderer.setRenderTarget(prior);
  }

  /** Forgets the surface; the next step starts flat. */
  freeze(): void {
    this.live = false;
    this.pending.length = 0;
  }

  dispose(): void {
    for (const t of this.targets) t.dispose();
  }
}
