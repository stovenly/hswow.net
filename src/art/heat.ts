import * as THREE from 'three';
import { HEAT_LAYER } from '../layers';

/**
 * Heat you can see: the air over a flame bending what is behind it. A billboard
 * on `HEAT_LAYER` that writes a screen offset — rising noise, masked to a soft
 * plume — which the heat pass reads to warp the finished frame. Nothing here
 * draws colour.
 */

export const heatUniforms = {
  uTime: { value: 0 },
  /** The scene's depth, so a plume behind a wall bends nothing. */
  tDepth: { value: null as THREE.Texture | null },
  uResolution: { value: new THREE.Vector2(1, 1) },
  uNear: { value: 0.1 },
  uFar: { value: 100 },
};

/** Offsets are written about this, so a cleared target bends nothing. */
export const HEAT_REST = 0.5;

const HEAT_MATERIAL = new THREE.ShaderMaterial({
  uniforms: heatUniforms,
  transparent: true,
  depthTest: false,
  depthWrite: false,
  // Straight over what is there: the strongest plume wins a pixel, and the
  // rest alpha is what the pass scales the bend by.
  blending: THREE.NormalBlending,
  vertexShader: /* glsl */ `
    attribute vec3 aSize;
    varying vec2 vUv;
    varying float vDepth;

    // A camera-facing quad about the flame, aSize.x wide and aSize.y tall at
    // the mesh's own scale, its foot at the mesh's origin.
    void main() {
      vUv = uv;
      vec4 centre = modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0);
      float scale = length(modelViewMatrix[1].xyz);
      vec2 corner = (uv - vec2(0.5, 0.0)) * aSize.xy * scale;
      vec4 eye = centre + vec4(corner, 0.0, 0.0);
      vDepth = -eye.z;
      gl_Position = projectionMatrix * eye;
    }
  `,
  fragmentShader: /* glsl */ `
    uniform float uTime;
    uniform sampler2D tDepth;
    uniform vec2 uResolution;
    uniform float uNear;
    uniform float uFar;
    varying vec2 vUv;
    varying float vDepth;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(
        mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
        mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
        f.y
      );
    }

    float sceneDepth(vec2 screen) {
      float z = texture2D(tDepth, screen).x;
      float ndc = z * 2.0 - 1.0;
      return (2.0 * uNear * uFar) / (uFar + uNear - ndc * (uFar - uNear));
    }

    void main() {
      // Behind something: bends nothing.
      if (sceneDepth(gl_FragCoord.xy / uResolution) < vDepth) discard;
      // A plume: wide at the foot, narrowing and fading as it rises.
      float x = vUv.x - 0.5;
      float width = mix(0.5, 0.18, vUv.y);
      float across = 1.0 - smoothstep(0.0, width, abs(x));
      float along = smoothstep(0.0, 0.12, vUv.y) * (1.0 - smoothstep(0.55, 1.0, vUv.y));
      float mask = across * along;
      // Two octaves rising at different speeds, so the bend churns rather than scrolls.
      vec2 flow = vec2(vUv.x * 3.0, vUv.y * 5.0 - uTime * 2.2);
      float n = noise(flow) * 0.65 + noise(flow * 2.3 + vec2(7.1, uTime * 1.3)) * 0.35;
      float m = noise(flow.yx * 1.7 + vec2(uTime * 0.9, 3.3));
      vec2 bend = vec2(n, m) - 0.5;
      gl_FragColor = vec4(0.5 + bend * 0.5, 0.0, mask);
    }
  `,
});

/**
 * One plume, standing on the flame. `width` and `height` in metres; the offset
 * it writes is scaled by the pass, not here.
 */
export function heatPlume(width: number, height: number): THREE.Mesh {
  const geometry = new THREE.PlaneGeometry(1, 1);
  const size = new Float32Array(geometry.getAttribute('position').count * 3);
  for (let i = 0; i < size.length; i += 3) {
    size[i] = width;
    size[i + 1] = height;
  }
  geometry.setAttribute('aSize', new THREE.BufferAttribute(size, 3));
  const mesh = new THREE.Mesh(geometry, HEAT_MATERIAL);
  mesh.name = 'heat';
  mesh.layers.set(HEAT_LAYER);
  mesh.frustumCulled = false;
  mesh.userData.noCollide = true;
  mesh.userData.heat = true;
  return mesh;
}
