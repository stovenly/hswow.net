import * as THREE from 'three';
import { CANOPY_FLAT_MATERIAL, CANOPY_NORMAL_MATERIAL, canopyUniforms } from './canopy';
import { skyUniforms } from '../engine/Sky';
import { applyAerialFog } from '../engine/fog';

// Cards: the flat version of a tree, for a vista. Every stand variant is
// rendered from eight bearings into one atlas, colour in one target and view
// normals in another; a card is one quad turned to the camera about Y, blending
// the two nearest views and lit from the normal. Nothing turns itself into a
// card and nothing changes with range: a card stands where one is placed, and
// it is the same picture from a hundred metres as from ten.

/** Pixels down one view. */
const TILE = 256;
/** Views across the widest atlas, so 32 variants at 4096. */
const MAX_PER_ROW = 16;
const VIEWS = 8;
/** Every view looks slightly down. */
const ELEVATION = (20 * Math.PI) / 180;

export interface CardVariant {
  key: string;
  trunk: THREE.BufferGeometry;
  canopy: THREE.BufferGeometry;
  /** Half the frame the views were rendered in, metres; the card is this wide either side and this tall either side of `mid`. */
  half: number;
  mid: number;
}

export interface CardInstance {
  x: number;
  y: number;
  z: number;
  yaw: number;
  scale: number;
  variant: number;
}

/** Frames a variant: the crown's sphere and the trunk's foot, seen from any side. */
export function frameOf(trunk: THREE.BufferGeometry, canopy: THREE.BufferGeometry): { half: number; mid: number } {
  trunk.computeBoundingBox();
  canopy.computeBoundingBox();
  const box = trunk.boundingBox!.clone().union(canopy.boundingBox!);
  const height = box.max.y - Math.min(box.min.y, 0);
  const reach = Math.max(Math.abs(box.min.x), Math.abs(box.max.x), Math.abs(box.min.z), Math.abs(box.max.z));
  const half = Math.max(reach * 1.05, height * 0.55);
  return { half, mid: height / 2 };
}

const TRUNK_FLAT = new THREE.MeshBasicMaterial({ vertexColors: true });
const TRUNK_NORMAL = new THREE.MeshNormalMaterial();

export class CardAtlas {
  readonly colour: THREE.WebGLRenderTarget;
  readonly normal: THREE.WebGLRenderTarget;
  /** Views across, and so the divisor a tile's uv is taken in. */
  readonly perRow: number;
  readonly size: number;
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 200);
  private readonly trunk = new THREE.Mesh();
  private readonly crown = new THREE.Mesh();

  /** Sized to the variants it is asked for: a zone with six trees in it does not pay for thirty-two. */
  constructor(variants: number) {
    this.perRow = Math.min(MAX_PER_ROW, Math.max(1, Math.ceil(Math.sqrt(Math.max(1, variants) * VIEWS))));
    this.size = this.perRow * TILE;
    const side = this.size;
    const make = (): THREE.WebGLRenderTarget =>
      new THREE.WebGLRenderTarget(side, side, {
        format: THREE.RGBAFormat,
        type: THREE.UnsignedByteType,
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        depthBuffer: true,
        stencilBuffer: false,
        generateMipmaps: false,
      });
    this.colour = make();
    this.normal = make();
    this.scene.add(this.trunk, this.crown);
    this.trunk.frustumCulled = false;
    this.crown.frustumCulled = false;
  }

  /** How many variants the widest atlas holds. */
  static get capacity(): number {
    return Math.floor((MAX_PER_ROW * MAX_PER_ROW) / VIEWS);
  }

  /** Renders every variant's eight views. Returns each variant's first tile. */
  render(renderer: THREE.WebGLRenderer, variants: readonly CardVariant[]): number[] {
    const prior = renderer.getRenderTarget();
    const priorClear = new THREE.Color();
    renderer.getClearColor(priorClear);
    const priorAlpha = renderer.getClearAlpha();
    const priorAutoClear = renderer.autoClear;
    const priorScissor = renderer.getScissorTest();
    const priorViewport = renderer.getViewport(new THREE.Vector4());
    const priorScissorBox = renderer.getScissor(new THREE.Vector4());
    renderer.autoClear = false;
    renderer.setScissorTest(true);

    const bases: number[] = [];
    for (const target of [this.colour, this.normal]) {
      renderer.setRenderTarget(target);
      renderer.setScissor(0, 0, this.size, this.size);
      renderer.setViewport(0, 0, this.size, this.size);
      renderer.setClearColor(0x000000, 0);
      renderer.clear(true, true, false);
    }
    variants.forEach((variant, v) => {
      const base = v * VIEWS;
      bases.push(base);
      this.trunk.geometry = variant.trunk;
      this.crown.geometry = variant.canopy;
      for (let view = 0; view < VIEWS; view++) {
        const tile = base + view;
        const tx = (tile % this.perRow) * TILE;
        const ty = Math.floor(tile / this.perRow) * TILE;
        this.aim(view, variant.half, variant.mid);
        for (const [target, trunkMaterial, crownMaterial] of [
          [this.colour, TRUNK_FLAT, CANOPY_FLAT_MATERIAL],
          [this.normal, TRUNK_NORMAL, CANOPY_NORMAL_MATERIAL],
        ] as const) {
          this.trunk.material = trunkMaterial;
          this.crown.material = crownMaterial;
          renderer.setRenderTarget(target);
          renderer.setViewport(tx, ty, TILE, TILE);
          renderer.setScissor(tx, ty, TILE, TILE);
          renderer.render(this.scene, this.camera);
        }
      }
    });

    renderer.setViewport(priorViewport);
    renderer.setScissor(priorScissorBox);
    renderer.setScissorTest(priorScissor);
    renderer.autoClear = priorAutoClear;
    renderer.setClearColor(priorClear, priorAlpha);
    renderer.setRenderTarget(prior);
    return bases;
  }

  /** View `i`: bearing i·45° at 20° elevation. */
  private aim(view: number, half: number, mid: number): void {
    const c = this.camera;
    c.left = -half;
    c.right = half;
    c.top = half;
    c.bottom = -half;
    c.near = 0.1;
    c.far = half * 8;
    const distance = half * 4;
    const b = (view * Math.PI) / 4;
    c.position.set(Math.sin(b) * Math.cos(ELEVATION) * distance, mid + Math.sin(ELEVATION) * distance, Math.cos(b) * Math.cos(ELEVATION) * distance);
    c.up.set(0, 1, 0);
    c.lookAt(0, mid, 0);
    c.updateProjectionMatrix();
    c.updateMatrixWorld(true);
  }

  dispose(): void {
    this.colour.dispose();
    this.normal.dispose();
  }
}

/** One material per stand, sharing the sky's uniforms by reference. */
function cardMaterial(atlas: CardAtlas): THREE.ShaderMaterial {
  const perRow = atlas.perRow.toFixed(1);
  const material = new THREE.ShaderMaterial({
  name: 'Cards',
  uniforms: {
    tCard: { value: atlas.colour.texture },
    tCardNormal: { value: atlas.normal.texture },
    // Shared by reference with the crowns. Never baked into the atlas: that is
    // rendered once at zone load, and the weather then would be the weather all session.
    uSnow: canopyUniforms.uSnow,
    ...skyUniforms,
    ...THREE.UniformsUtils.clone(THREE.UniformsLib.fog),
  },
  fog: true,
  side: THREE.DoubleSide,
  vertexShader: /* glsl */ `
    attribute vec4 iPlace;
    attribute vec4 iCard;
    varying vec2 vUv0;
    varying vec2 vUv1;
    varying float vBlend;
    varying vec3 vRight;
    varying vec3 vUp;
    varying vec3 vBack;
    #include <fog_pars_vertex>

    vec2 tileUv(float tile, vec2 local) {
      float col = mod(tile, ${perRow});
      float row = floor(tile / ${perRow});
      // Half a texel in at each edge, or a bilinear fetch on the rim of a tile
      // brings in the neighbouring view.
      vec2 texel = (local * ${(TILE - 1).toFixed(1)} + 0.5) / ${TILE.toFixed(1)};
      return (vec2(col, row) + texel) / ${perRow};
    }

    void main() {
      vec3 place = (modelMatrix * vec4(iPlace.xyz, 1.0)).xyz;
      vec3 toCam = cameraPosition - place;
      float level = max(length(toCam.xz), 1e-3);
      // Turned to the camera about Y only: right is perpendicular to the line to the eye.
      vec3 right = vec3(toCam.z, 0.0, -toCam.x) / level;
      float reach = iCard.x;
      vec3 world = place + right * (position.x * 2.0 * reach) + vec3(0.0, iCard.y - reach + position.y * 2.0 * reach, 0.0);
      // Which of the eight views the eye is nearest, in the tree's own frame.
      float viewYaw = atan(toCam.x, toCam.z);
      float rel = mod(viewYaw - iPlace.w, 6.2831853);
      float slot = rel / 0.78539816;
      // Wrapped, because a bearing reaching a full turn would otherwise index the
      // tile after this variant's last, which is the next variant's first view.
      float i0 = mod(floor(slot), 8.0);
      vBlend = fract(slot);
      float i1 = mod(i0 + 1.0, 8.0);
      vec2 local = vec2(position.x + 0.5, position.y);
      vUv0 = tileUv(iCard.z + i0, local);
      vUv1 = tileUv(iCard.z + i1, local);
      // The rendered view's camera basis, for turning its normals back into the world.
      float e = ${ELEVATION.toFixed(5)};
      vRight = vec3(cos(viewYaw), 0.0, -sin(viewYaw));
      vUp = vec3(-sin(viewYaw) * sin(e), cos(e), -cos(viewYaw) * sin(e));
      vBack = vec3(sin(viewYaw) * cos(e), sin(e), cos(viewYaw) * cos(e));
      vec4 mvPosition = viewMatrix * vec4(world, 1.0);
      gl_Position = projectionMatrix * mvPosition;
      #include <fog_vertex>
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tCard;
    uniform sampler2D tCardNormal;
    uniform float uSnow;
    varying vec2 vUv0;
    varying vec2 vUv1;
    varying float vBlend;
    varying vec3 vRight;
    varying vec3 vUp;
    varying vec3 vBack;
    #include <fog_pars_fragment>

    void main() {
      vec4 c = mix(texture2D(tCard, vUv0), texture2D(tCard, vUv1), vBlend);
      if (c.a < 0.5) discard;
      vec4 n0 = texture2D(tCardNormal, vUv0);
      vec4 n1 = texture2D(tCardNormal, vUv1);
      vec3 nv = mix(n0, n1, vBlend).xyz * 2.0 - 1.0;
      vec3 n = normalize(vRight * nv.x + vUp * nv.y + vBack * nv.z);
      vec3 sun = normalize(uSunDirection);
      float lit = 0.42 + 0.7 * uSunIntensity * max(dot(n, sun), 0.0);
      vec3 colour = c.rgb * (vec3(lit) * mix(vec3(1.0), uSunColor, 0.4));
      colour = mix(colour, vec3(0.86, 0.9, 0.96), clamp(uSnow, 0.0, 1.0) * 0.62 * smoothstep(0.2, 0.9, n.y));
      gl_FragColor = vec4(colour, 1.0);
      #include <fog_fragment>
    }
  `,
  });
  applyAerialFog(material);
  material.userData.owned = true;
  return material;
}

const QUAD = new THREE.PlaneGeometry(1, 1);
QUAD.translate(0, 0.5, 0);

/** One quad per far tree, on the atlas. Placed at the origin; the instances carry world positions. */
export function cardStand(atlas: CardAtlas, variants: readonly CardVariant[], bases: readonly number[], instances: readonly CardInstance[]): THREE.Mesh | null {
  if (instances.length === 0) return null;
  const geometry = new THREE.InstancedBufferGeometry();
  geometry.index = QUAD.index;
  geometry.setAttribute('position', QUAD.getAttribute('position'));
  geometry.setAttribute('uv', QUAD.getAttribute('uv'));
  const place = new Float32Array(instances.length * 4);
  const card = new Float32Array(instances.length * 4);
  instances.forEach((inst, i) => {
    const variant = variants[inst.variant];
    place[i * 4] = inst.x;
    place[i * 4 + 1] = inst.y;
    place[i * 4 + 2] = inst.z;
    place[i * 4 + 3] = inst.yaw;
    card[i * 4] = variant.half * inst.scale;
    card[i * 4 + 1] = variant.mid * inst.scale;
    card[i * 4 + 2] = bases[inst.variant];
    card[i * 4 + 3] = ((Math.sin(inst.x * 12.9898 + inst.z * 78.233) * 43758.5453) % 1) * 64;
  });
  geometry.setAttribute('iPlace', new THREE.InstancedBufferAttribute(place, 4));
  geometry.setAttribute('iCard', new THREE.InstancedBufferAttribute(card, 4));
  geometry.instanceCount = instances.length;
  const mesh = new THREE.Mesh(geometry, cardMaterial(atlas));
  mesh.name = 'cards';
  mesh.frustumCulled = false;
  mesh.userData.noCollide = true;
  mesh.userData.cards = true;
  mesh.castShadow = false;
  mesh.receiveShadow = false;
  return mesh;
}
