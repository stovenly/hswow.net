import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';

// A rowing boat pulled up above the tide: a clinker hull lofted through seven
// stations, open inside, with two thwarts and the oars shipped. Built along +X,
// bow toward +X, resting on its keel at y = 0 and heeled a little onto one
// bilge as a boat on sand lies.

const STATIONS = 7;

/** A hull's half section at a station: the keel, the turn of the bilge, the sheer. */
function section(t: number, beam: number, depth: number): [number, number][] {
  // Fullest just aft of the middle, fine at the bow, square-ish at the stern.
  const fullness = Math.max(0, Math.sin(Math.PI * (0.13 + t * 0.87))) ** 0.7;
  const w = (beam / 2) * Math.max(0.06, fullness);
  const h = depth * (0.86 + 0.14 * Math.abs(t - 0.5) * 2);
  return [
    [0, 0],
    [w * 0.55, h * 0.1],
    [w * 0.9, h * 0.42],
    [w, h],
  ];
}

export const skiff: MeshBuilder = {
  name: 'skiff',
  category: 'structures',
  radius: 2.6,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const length = rng.range(4.2, 5);
    const beam = rng.range(1.4, 1.7);
    const depth = rng.range(0.5, 0.62);
    const parts: Part[] = [];

    // The strakes: each loft between neighbouring stations, outside and in.
    const rings: THREE.Vector3[][] = [];
    for (let i = 0; i < STATIONS; i++) {
      const t = i / (STATIONS - 1);
      const x = -length / 2 + t * length;
      const rise = t > 0.85 ? (t - 0.85) * 1.2 : 0;
      const half = section(t, beam, depth).map(([z, y]) => new THREE.Vector3(x, y + rise * depth, z));
      const left = half.slice(1).reverse().map((v) => new THREE.Vector3(v.x, v.y, -v.z));
      rings.push([...left, ...half]);
    }
    const outer: number[] = [];
    const inner: number[] = [];
    const quad = (out: number[], a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3, d: THREE.Vector3): void => {
      out.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z, a.x, a.y, a.z, c.x, c.y, c.z, d.x, d.y, d.z);
    };
    for (let i = 0; i + 1 < STATIONS; i++) {
      const ra = rings[i];
      const rb = rings[i + 1];
      for (let k = 0; k + 1 < ra.length; k++) {
        // Outside faces out; the inner skin is the same quads wound the other way, a plank in.
        quad(outer, ra[k], rb[k], rb[k + 1], ra[k + 1]);
        const shrink = (v: THREE.Vector3): THREE.Vector3 => new THREE.Vector3(v.x, v.y + 0.02, v.z * 0.93);
        quad(inner, shrink(ra[k]), shrink(ra[k + 1]), shrink(rb[k + 1]), shrink(rb[k]));
      }
    }
    // The transom, closing the stern, and the gunwale strip joining the skins.
    const stern = rings[0];
    const keelPoint = stern[Math.floor(stern.length / 2)];
    for (let k = 0; k + 1 < stern.length; k++) {
      quad(outer, stern[k], stern[k + 1], keelPoint, keelPoint);
    }
    const gunwale = new THREE.BoxGeometry(length * 0.98, 0.06, 0.08);
    for (const side of [-1, 1]) {
      const strip = gunwale.clone();
      strip.translate(0, depth + 0.03, (side * beam) / 2 - side * 0.04);
      parts.push({ geometry: strip, color: shade(PALETTE.TIMBER_DARK, 0.85), sway: 0 });
    }

    const strakes = [shade(PALETTE.TIMBER_DARK, 0.95), PALETTE.TIMBER, shade(PALETTE.TIMBER_PALE, 0.9)];
    const byStrake = (_x: number, y: number): number => strakes[Math.min(2, Math.floor((y / depth) * 3))];
    const hull = new THREE.BufferGeometry();
    hull.setAttribute('position', new THREE.Float32BufferAttribute(outer, 3));
    parts.push({ geometry: hull, color: byStrake, sway: 0 });
    const lining = new THREE.BufferGeometry();
    lining.setAttribute('position', new THREE.Float32BufferAttribute(inner, 3));
    parts.push({ geometry: lining, color: shade(PALETTE.TIMBER_DARK, 0.8), sway: 0 });

    // The keel, the thwarts, and the oars laid along the thwarts.
    const keel = new THREE.BoxGeometry(length * 0.9, 0.08, 0.1);
    keel.translate(0, 0.02, 0);
    parts.push({ geometry: keel, color: shade(PALETTE.TIMBER_DARK, 0.8), sway: 0 });
    for (const x of [-length * 0.18, length * 0.2]) {
      const thwart = new THREE.BoxGeometry(0.22, 0.05, beam * 0.86);
      thwart.translate(x, depth * 0.62, 0);
      parts.push({ geometry: thwart, color: shade(PALETTE.TIMBER_PALE, 0.95), sway: 0 });
    }
    for (const side of [-1, 1]) {
      const oar = new THREE.CylinderGeometry(0.02, 0.025, length * 0.75, 5);
      oar.rotateZ(Math.PI / 2);
      oar.translate(0.1, depth * 0.68, side * beam * 0.22);
      parts.push({ geometry: oar, color: PALETTE.TIMBER_PALE, sway: 0 });
      const blade = new THREE.BoxGeometry(0.5, 0.02, 0.12);
      blade.translate(-length * 0.28, depth * 0.68, side * beam * 0.22);
      parts.push({ geometry: blade, color: shade(PALETTE.TIMBER_PALE, 0.9), sway: 0 });
    }

    const merged = assemble(parts);
    // rotateX heels the boat onto one bilge, about the keel.
    merged.rotateX(rng.pick([-1, 1]) * rng.range(0.08, 0.16));
    if (scale !== 1) merged.scale(scale, scale, scale);
    return finish(merged, 'skiff', 0);
  },
};
