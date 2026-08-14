import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { createRng, type Rng } from './random';
import { blend, shade } from './palette';
import { SWAY_ATTRIBUTE } from './assemble';
import { VISTA_LAYER } from '../layers';

/**
 * The vista family's grammar — VISTA.md.
 *
 * Out-of-bounds scenery is one mass function and a set of profiles, not a set
 * of unrelated builders. `vistaMass` is that function: the `rock` recipe —
 * weld, displace along normals, squash, all from a seed — at hillside scale.
 * What separates a hill from a crag from a forest mass is the numbers passed
 * in and the colour function laid over the result.
 *
 * Everything here is judged at 100+ metres through heavy fog on a 960×540
 * buffer, where the silhouette is the whole prop and interior detail is a
 * rounding error. So: big triangles, value contrast over hue, and patches of
 * colour instead of patches of geometry.
 */

/**
 * Triangles a single vista builder may spend. Most should sit well under 120 —
 * the whole band is meant to cost less than three birches.
 */
export const VISTA_TRIANGLES = 300;

/**
 * States that a mesh is scenery.
 *
 * Five claims at once, and every one of them is something the band would
 * otherwise inherit from a system that knows nothing about it: it is out of the
 * collider, it is out of the sun's shadow box in both directions, it does not
 * move in the wind, it draws no outline, and `ZoneManager.prepare` reads the
 * tag rather than guessing from the shadow box's current size.
 *
 * Sway is zeroed here rather than left to the builders because amplitude is
 * authored in metres at prop scale — on a hillside, or on an ordinary prop
 * scaled up to stand in for one, the same weights read as an earthquake.
 */
export function markVista<T extends THREE.Object3D>(object: T): T {
  object.userData.vista = true;
  object.userData.noCollide = true;
  object.traverse((node) => {
    node.castShadow = false;
    node.receiveShadow = false;
    if (!(node instanceof THREE.Mesh)) return;
    // Additive — it stays on layer 0 and draws normally. See `VISTA_LAYER`.
    node.layers.enable(VISTA_LAYER);
    const sway = node.geometry.getAttribute(SWAY_ATTRIBUTE);
    if (!sway) return;
    (sway.array as Float32Array).fill(0);
    sway.needsUpdate = true;
  });
  return object;
}

export interface MassOptions {
  /** Radius before any squashing, in metres. */
  radius: number;
  /** Icosahedron subdivision. 0 is 20 triangles, 1 is 80, 2 is 320. */
  detail?: number;
  /** How far vertices wander along their own normals, as a fraction of radius. */
  rough?: number;
  /** Vertical scale. Below 1 is a dome, above 1 is a spire. */
  squash?: number;
  /** Scale across Z, for a mass longer one way than the other. */
  stretch?: number;
  /** How much of the mass sits below y = 0. 0 rests on it, 0.5 is half buried. */
  bury?: number;
}

/**
 * A displaced solid — the shared shape every vista builder is cut from.
 *
 * Welded before displacement for `rock`'s reason: an icosahedron is
 * non-indexed, so a corner shared by five faces exists five times over, and
 * displacing the copies independently pulls the solid to pieces.
 */
export function vistaMass(rng: Rng, options: MassOptions): THREE.BufferGeometry {
  const { radius, detail = 1, rough = 0.24, squash = 0.6, stretch = 1, bury = 0.4 } = options;

  const raw = new THREE.IcosahedronGeometry(radius, detail);
  raw.deleteAttribute('normal');
  raw.deleteAttribute('uv');
  const geometry = mergeVertices(raw);
  raw.dispose();

  const position = geometry.getAttribute('position');
  const vertex = new THREE.Vector3();
  for (let i = 0; i < position.count; i++) {
    vertex.fromBufferAttribute(position, i);
    vertex.multiplyScalar(rng.range(1 - rough, 1 + rough));
    position.setXYZ(i, vertex.x, vertex.y, vertex.z);
  }
  position.needsUpdate = true;

  geometry.scale(1, squash, stretch);
  // The mass spans ±`half` about its own centre; this drops it so that `bury`
  // of its height is underground.
  const half = radius * squash;
  geometry.translate(0, half * (1 - 2 * bury), 0);
  geometry.computeVertexNormals();
  return geometry;
}

export interface WashOptions {
  /** Roughly how far the colour takes to drift, in metres. Deliberately large. */
  scale?: number;
  /** Height at which the mass is fully lit. Below it, values fall away. */
  crown?: number;
}

/**
 * A continuous wash of colour across land — no patches, no edges.
 *
 * **This replaced a version that indexed into the palette**, and the difference
 * is the whole point. Picking `palette[floor(t × n)]` turns a smooth field into
 * n hard-edged bands, and since `assemble` evaluates colour per face those
 * bands are drawn along facet boundaries — so a nine-metre grid came out as a
 * quilt of ragged, strongly contrasting blobs. Blending between neighbours
 * instead means adjacent facets differ by a fraction of a step and the eye
 * reads land rather than pattern.
 *
 * Three sines at unrelated bearings and incommensurate wavelengths, so nothing
 * repeats and nothing lines up with the grid. Their sum bunches toward the
 * middle of the palette, which is right — most ground is the ordinary colour and
 * the ends are excursions.
 *
 * The palette this is given should be *close*. Fog compresses hue long before
 * it compresses value, so a wide palette does not read as variety at distance,
 * it reads as a mistake.
 */
export function landWash(
  seed: number,
  palette: readonly number[],
  { scale = 140, crown = 0 }: WashOptions = {},
): (x: number, y: number, z: number) => number {
  const rng = createRng(seed);
  const waves = Array.from({ length: 3 }, () => {
    const angle = rng.range(0, Math.PI * 2);
    return {
      ax: Math.cos(angle),
      az: Math.sin(angle),
      length: scale * rng.range(0.55, 1.7),
      phase: rng.range(0, Math.PI * 2),
    };
  });

  return (x, y, z) => {
    let sum = 0;
    for (const wave of waves) {
      sum += Math.sin((x * wave.ax + z * wave.az) / wave.length + wave.phase);
    }
    const t = clamp01(0.5 + sum / 4);
    const span = (palette.length - 1) * t;
    const step = Math.min(palette.length - 2, Math.floor(span));
    const base = blend(palette[step], palette[step + 1], span - step);

    // Value falls toward the foot of the mass, and a couple of percent of
    // per-face wobble on top — small enough not to read as speckle, big enough
    // that the retro pass dithers the gradient instead of banding it.
    const lit = crown > 0 ? 0.82 + clamp01(y / crown) * 0.24 : 1;
    return shade(base, lit * (0.975 + faceJitter(x, z) * 0.05));
  };
}

function clamp01(value: number): number {
  return value > 0 ? (value < 1 ? value : 1) : 0;
}

/** A stable 0..1 draw from a position, at roughly a hand's width. */
function faceJitter(x: number, z: number): number {
  let h = Math.imul(Math.round(x * 7.3), 374761393) ^ Math.imul(Math.round(z * 7.3), 668265263);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
