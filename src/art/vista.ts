import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { createRng, type Rng } from './random';
import { blend, shade } from './palette';
import { FIELD_ATTRIBUTE, FIELD_SWAY } from './assemble';

/**
 * The vista family's grammar. Out-of-bounds scenery is one mass function and a
 * set of profiles rather than a set of unrelated builders: `vistaMass` is the
 * `rock` recipe — weld, displace along normals, squash — at hillside scale, and
 * what separates a hill from a crag from a forest mass is the numbers passed in
 * and the colour function laid over the result. Judged at 100+ metres through
 * heavy fog, so: big triangles, value contrast over hue, and patches of colour
 * instead of patches of geometry.
 */

/**
 * Triangles a single vista builder may spend. Most should sit well under 120 —
 * the whole band is meant to cost less than three birches.
 */
export const VISTA_TRIANGLES = 300;

/**
 * States that a mesh is scenery: out of the collider, out of the sun's shadow box
 * in both directions, no wind, and `ZoneManager.prepare` reads the tag rather
 * than guessing from the shadow box's current size. Sway is zeroed here rather
 * than left to the builders, because amplitude is authored in metres at prop
 * scale and on a hillside the same weights read as an earthquake.
 */
export function markVista<T extends THREE.Object3D>(object: T): T {
  object.userData.vista = true;
  object.userData.noCollide = true;
  object.traverse((node) => {
    node.castShadow = false;
    node.receiveShadow = false;
    if (!(node instanceof THREE.Mesh)) return;
    const fields = node.geometry.getAttribute(FIELD_ATTRIBUTE);
    if (!fields) return;
    const array = fields.array as Float32Array;
    for (let i = FIELD_SWAY; i < array.length; i += 3) array[i] = 0;
    fields.needsUpdate = true;
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
 * A displaced solid — the shared shape every vista builder is cut from. Welded
 * before displacement for `rock`'s reason: an icosahedron is non-indexed, so a
 * corner shared by five faces exists five times over, and displacing the copies
 * independently pulls the solid to pieces.
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
 * A continuous wash of colour across land — no patches, no edges. Indexing into a
 * palette turns a smooth field into hard-edged bands, and since `assemble`
 * evaluates colour per face those bands are drawn along facet boundaries;
 * blending between neighbours instead means adjacent facets differ by a fraction
 * of a step. Three sines at unrelated bearings and incommensurate wavelengths,
 * bunching toward the middle of the palette. The palette should be close — fog
 * compresses hue long before it compresses value.
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
