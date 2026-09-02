import * as THREE from 'three';
import { COVER_LAYER } from '../../layers';
import type { Zone } from '../../world/Zone';
import { playableSpan } from './plan';

/**
 * The local map's picture: one orthographic render of a zone from straight
 * above, in the world's own colours with a line wherever the height steps.
 *
 * A render rather than a drawing built from the document, because the document
 * knows landforms and patches but not what a builder made. A drawn map needs a
 * symbol for every kind of entry that should show, which is a second
 * description of every builder and would drift from the first.
 *
 * Two passes over the same view: colour, and a packed depth from which the
 * height of the topmost surface at every pixel is recovered. The height is what
 * gives the map its lines — a roof edge, a wall and a trunk are all places
 * where it steps.
 */

/**
 * Pixels square, over the **playable** ground and not over the terrain's
 * square. A level is a shape cut out of a heightfield twice its width, and
 * framing the square instead spends four fifths of the picture on ground the
 * chart clips away — which is what makes the part you can see coarse.
 */
const SIZE = 768;

/**
 * Samples per axis. The render has no antialiasing and the line is a test on
 * neighbouring depths, so at one sample a barrel's rim is a hard staircase and
 * the outline drawn round it is a second one. Every sample is drawn and tested
 * on its own and the four are averaged into the picture, which antialiases the
 * silhouette and the line together — and is the only thing that can, because
 * averaging *depth* across samples gives a depth no surface is at.
 */
const SUPER = 2;

/** Pixels square the two passes are actually drawn at. */
const RENDER = SIZE * SUPER;

/** How far past the playable line the picture reaches, so its own edge is never a texel boundary. */
const OVERSHOOT = 1.06;

/**
 * Metres of *curvature* in the height where a line starts, reaching full weight
 * at twice it. Curvature and not slope: the side of a barrel is nearly vertical
 * and perfectly smooth, so a test on the difference between one sample and the
 * next fires somewhere along it and not along its neighbour, which is what
 * draws a ragged crawling ring instead of a rim.
 */
const EDGE = 0.17;

/** Radius of the smear over the line, in samples. A line found per sample is a dotted one. */
const SOFTEN = 1;

/** What an edge multiplies the colour under it by. */
const LINE = 0.42;

/**
 * How high the camera stands outdoors, and how far down it sees, in metres.
 * Stated rather than measured off the built world: a bounding box of a zone is
 * a full traversal that computes one for every geometry in it, and the packed
 * depth carries this range at a precision of tens of microns either way.
 */
const SKY = 90;
const REACH = 130;

/** Metres an interior sees below its own cut, which has to clear a floor a step down. */
const UNDER = 4;

/** Metres below the ceiling an interior is cut at — a hand's width, so the picture is the floor and the wall tops. */
const CEILING_CUT = 0.18;

/** The flat unlit stand-in every surface is drawn with. Vertex colours are what the whole art kit carries. */
const FLAT = new THREE.MeshBasicMaterial({ vertexColors: true, fog: false });

/**
 * Water, drawn flat in its own shallow colour. The real material composites the
 * scene behind it out of buffers a bake has none of, so the alternative to a
 * stand-in is a pond that smears the last frame drawn.
 */
const FLAT_WATER = new THREE.MeshBasicMaterial({ color: 0x53757c, fog: false });

/** Depth for the second pass, packed into RGBA so it can be read back off an ordinary colour target. */
const DEPTH = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking });

/** One per flat colour met, so a bake allocates nothing after the first of its kind. */
const solids = new Map<number, THREE.MeshBasicMaterial>();

function solid(colour: THREE.Color): THREE.MeshBasicMaterial {
  const hex = colour.getHex();
  let material = solids.get(hex);
  if (!material) {
    material = new THREE.MeshBasicMaterial({ color: hex, fog: false });
    solids.set(hex, material);
  }
  return material;
}

/** A zone drawn from above, and the ground it covers. */
export interface ZonePicture {
  readonly canvas: HTMLCanvasElement;
  /** The world rectangle the canvas spans, in the zone's own metres. */
  readonly minX: number;
  readonly minZ: number;
  readonly width: number;
  readonly depth: number;
}

interface Swapped {
  mesh: THREE.Mesh;
  material: THREE.Material | THREE.Material[];
  layers: number;
}

export class MapBake {
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.01, 100);
  private readonly colourTarget: THREE.WebGLRenderTarget;
  private readonly depthTarget: THREE.WebGLRenderTarget;
  private readonly colour = new Uint8Array(RENDER * RENDER * 4);
  private readonly depth = new Uint8Array(RENDER * RENDER * 4);
  private readonly pictures = new Map<string, ZonePicture>();

  constructor(renderer: THREE.WebGLRenderer) {
    this.renderer = renderer;
    this.colourTarget = new THREE.WebGLRenderTarget(RENDER, RENDER);
    // The readback is what ends up on a 2D canvas, so it has to come out of the
    // target already display-encoded.
    this.colourTarget.texture.colorSpace = THREE.SRGBColorSpace;
    this.depthTarget = new THREE.WebGLRenderTarget(RENDER, RENDER);
    // North up: `lookAt` from directly above with up = -Z puts the camera's own
    // +X on world +X and its screen-up on world -Z, which is authored north.
    this.camera.up.set(0, 0, -1);
  }

  held(zone: string): ZonePicture | undefined {
    return this.pictures.get(zone);
  }

  release(zone: string): void {
    this.pictures.delete(zone);
  }

  /**
   * Draws the zone, once. Called on entry, at full black; the picture is kept
   * until the zone is released and is rebuilt from the world on the next entry.
   */
  bake(zone: Zone): ZonePicture | undefined {
    const plan = zone.plan;
    if (!plan || !zone.isBuilt) return undefined;
    const held = this.pictures.get(zone.id);
    if (held) return held;

    const root = zone.root();
    const parent = root.parent;
    const swapped: Swapped[] = [];
    const hidden: THREE.Object3D[] = [];
    dress(root, swapped, hidden);

    const span = playableSpan(plan, OVERSHOOT);
    const width = span.w;
    const depth = span.h;
    const centreX = span.x + span.w / 2;
    const centreZ = span.y + span.h / 2;
    // Indoors the eye sits under the ceiling, so a sealed shell is its floor and
    // its furniture rather than the underside of its roof. Outdoors nothing is
    // cut: a bird sees roofs and crowns, and so does the map.
    const indoors = plan.ceiling !== undefined;
    const eye = indoors ? (plan.ceiling as number) - CEILING_CUT : SKY;
    const far = indoors ? eye + UNDER : REACH;

    this.camera.left = -width / 2;
    this.camera.right = width / 2;
    this.camera.top = depth / 2;
    this.camera.bottom = -depth / 2;
    this.camera.near = 0.01;
    this.camera.far = far;
    this.camera.position.set(centreX, eye, centreZ);
    this.camera.lookAt(centreX, eye - 1, centreZ);
    this.camera.updateProjectionMatrix();

    this.scene.add(root);
    const wasTarget = this.renderer.getRenderTarget();
    const wasClear = this.renderer.getClearColor(new THREE.Color());
    const wasAlpha = this.renderer.getClearAlpha();
    this.renderer.setClearColor(0x000000, 0);
    try {
      this.renderer.setRenderTarget(this.colourTarget);
      this.renderer.clear();
      this.renderer.render(this.scene, this.camera);
      this.renderer.readRenderTargetPixels(this.colourTarget, 0, 0, RENDER, RENDER, this.colour);

      this.scene.overrideMaterial = DEPTH;
      this.renderer.setRenderTarget(this.depthTarget);
      this.renderer.clear();
      this.renderer.render(this.scene, this.camera);
      this.renderer.readRenderTargetPixels(this.depthTarget, 0, 0, RENDER, RENDER, this.depth);
    } finally {
      this.scene.overrideMaterial = null;
      this.renderer.setRenderTarget(wasTarget);
      this.renderer.setClearColor(wasClear, wasAlpha);
      parent?.add(root);
      this.scene.remove(root);
      for (const held of swapped) {
        held.mesh.material = held.material;
        held.mesh.layers.mask = held.layers;
      }
      for (const object of hidden) object.visible = true;
    }

    const picture: ZonePicture = {
      canvas: this.stylise(eye, far),
      minX: span.x,
      minZ: span.y,
      width,
      depth,
    };
    this.pictures.set(zone.id, picture);
    return picture;
  }

  /**
   * The picture itself. Once, here, rather than as a pass while the map is
   * open: the result is the same picture and a window redraw is then a
   * `drawImage`.
   */
  private stylise(eye: number, far: number): HTMLCanvasElement {
    const height = new Float32Array(RENDER * RENDER);
    const there = new Uint8Array(RENDER * RENDER);
    for (let i = 0; i < RENDER * RENDER; i++) {
      const at = i * 4;
      there[i] = this.colour[at + 3] > 8 ? 1 : 0;
      // Packed depth back to a fraction of the near-to-far span, which for an
      // orthographic camera is linear, so this is metres straight away.
      const packed =
        (this.depth[at] / 255) * (255 / 256 / 16777216) +
        (this.depth[at + 1] / 255) * (255 / 256 / 65536) +
        (this.depth[at + 2] / 255) * (255 / 256 / 256) +
        (this.depth[at + 3] / 255) * (255 / 256);
      height[i] = eye - (0.01 + packed * (far - 0.01));
    }

    const lines = soften(edges(height, there));

    const canvas = document.createElement('canvas');
    canvas.width = SIZE;
    canvas.height = SIZE;
    const context = canvas.getContext('2d');
    if (!context) return canvas;
    const image = context.createImageData(SIZE, SIZE);

    for (let y = 0; y < SIZE; y++) {
      for (let x = 0; x < SIZE; x++) {
        let r = 0;
        let g = 0;
        let b = 0;
        let line = 0;
        let on = 0;
        for (let sy = 0; sy < SUPER; sy++) {
          const gy = y * SUPER + sy;
          // The target reads bottom-up; a canvas is top-down.
          const row = (RENDER - 1 - gy) * RENDER;
          for (let sx = 0; sx < SUPER; sx++) {
            const src = row + x * SUPER + sx;
            if (!there[src]) continue;
            on++;
            r += this.colour[src * 4];
            g += this.colour[src * 4 + 1];
            b += this.colour[src * 4 + 2];
            line += lines[src] / 255;
          }
        }
        const at = (y * SIZE + x) * 4;
        if (on === 0) {
          image.data[at + 3] = 0;
          continue;
        }
        // The world's own colour, and nothing done to it but the line. Anything
        // that quantizes the three channels separately moves the hue: two woods
        // a few values apart land on olive and on maroon.
        const shade = 1 - (line / on) * (1 - LINE);
        image.data[at] = (r / on) * shade;
        image.data[at + 1] = (g / on) * shade;
        image.data[at + 2] = (b / on) * shade;
        // The silhouette fades out over the samples that missed it, rather than
        // ending on a staircase of whole pixels.
        image.data[at + 3] = (on / (SUPER * SUPER)) * 255;
      }
    }
    context.putImageData(image, 0, 0);
    return canvas;
  }

  dispose(): void {
    this.colourTarget.dispose();
    this.depthTarget.dispose();
    this.pictures.clear();
  }
}

/**
 * Where the lines are, 0..255 per sample.
 *
 * **How far the height bends, not how fast it changes.** A sample is compared
 * against the average of the two opposite it, on both axes: a smooth surface
 * sits where that average predicts however steeply it is tilted, and only a
 * genuine break in the surface does not. The side of a barrel is nearly
 * vertical and perfectly smooth, and a test on slope alone draws it as a ring
 * of dashes; this leaves it alone and draws the rim.
 *
 * A missing neighbour is the object standing against nothing, which is an
 * outline and always draws full.
 */
function edges(height: Float32Array, there: Uint8Array): Uint8Array {
  const out = new Uint8Array(RENDER * RENDER);
  for (let y = 1; y < RENDER - 1; y++) {
    for (let x = 1; x < RENDER - 1; x++) {
      const at = y * RENDER + x;
      if (!there[at]) continue;
      const left = at - 1;
      const right = at + 1;
      const up = at - RENDER;
      const down = at + RENDER;
      if (!there[left] || !there[right] || !there[up] || !there[down]) {
        out[at] = 255;
        continue;
      }
      const mine = height[at];
      const bend =
        Math.abs((height[left] + height[right]) / 2 - mine) +
        Math.abs((height[up] + height[down]) / 2 - mine);
      out[at] = Math.min(255, Math.max(0, Math.round(((bend - EDGE) / EDGE) * 255)));
    }
  }
  return out;
}

/** A separable box smear over the lines, so a rim comes out continuous rather than dotted. */
function soften(lines: Uint8Array): Uint8Array {
  const span = SOFTEN * 2 + 1;
  const across = new Uint8Array(lines.length);
  for (let y = 0; y < RENDER; y++) {
    const row = y * RENDER;
    for (let x = 0; x < RENDER; x++) {
      let sum = 0;
      for (let d = -SOFTEN; d <= SOFTEN; d++) {
        sum += lines[row + Math.min(RENDER - 1, Math.max(0, x + d))];
      }
      across[row + x] = sum / span;
    }
  }
  const out = new Uint8Array(lines.length);
  for (let y = 0; y < RENDER; y++) {
    for (let x = 0; x < RENDER; x++) {
      let sum = 0;
      for (let d = -SOFTEN; d <= SOFTEN; d++) {
        sum += across[Math.min(RENDER - 1, Math.max(0, y + d)) * RENDER + x];
      }
      out[y * RENDER + x] = sum / span;
    }
  }
  return out;
}

/**
 * What the camera is allowed to see. Living things are left out — a map is of a
 * place, not of who is standing in it — and so is scenery past the boundary,
 * anything drawn transparent, and groundcover, whose blades are placed by
 * per-instance attributes a stand-in material does not carry.
 */
function dress(root: THREE.Object3D, swapped: Swapped[], hidden: THREE.Object3D[]): void {
  root.traverse((object) => {
    if (!object.visible) return;
    if (
      object.userData.life ||
      object.userData.vista === true ||
      object.layers.isEnabled(COVER_LAYER)
    ) {
      object.visible = false;
      hidden.push(object);
      return;
    }
    if (!(object instanceof THREE.Mesh)) return;
    // Light is not a thing on a map. A shaft through a window, a flame's glow
    // and a pane of glass are all drawn transparent in the world and would all
    // come out here as solid shapes standing on the ground.
    if ([object.material].flat().some((material) => material.transparent)) {
      object.visible = false;
      hidden.push(object);
      return;
    }
    const held: Swapped = {
      mesh: object,
      material: object.material,
      layers: object.layers.mask,
    };
    if (object.userData.water === true) {
      object.material = FLAT_WATER;
      object.layers.enable(0);
    } else if (object.geometry.getAttribute('color')) {
      object.material = FLAT;
    } else {
      const source = [object.material].flat()[0] as THREE.Material & { color?: THREE.Color };
      object.material = source.color ? solid(source.color) : FLAT_WATER;
    }
    swapped.push(held);
  });
}
