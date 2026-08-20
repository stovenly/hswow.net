import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { shade } from '../palette';

// Reeds at a waterline: bare stems with a dark seed head on top. One dark sausage
// on a bare stalk is the entire recognition, and it survives being three pixels
// tall, so it is the one part drawn at full size and full contrast. Tall relative
// to everything else on the ground — 1.5 to 2.5 m — so you look through a stand
// rather than over it.
export const reeds: MeshBuilder = {
  name: 'reeds',
  category: 'foliage',
  radius: 0.7,
  solid: false,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const stems = rng.int(9, 18);
    const spread = rng.range(0.28, 0.5);
    const stalk = rng.chance(0.4) ? 0x7d7a44 : 0x5f6b38;
    const head = rng.chance(0.5) ? 0x4a3524 : 0x5c412a;

    for (let i = 0; i < stems; i++) {
      const at = rng.range(0, Math.PI * 2);
      const away = Math.sqrt(rng()) * spread;
      const ox = Math.cos(at) * away;
      const oz = Math.sin(at) * away;

      const height = rng.range(1.4, 2.4) * (1 - (away / spread) * 0.22);
      const lean = rng.range(0, 0.14);
      const leanAt = rng.range(0, Math.PI * 2);
      const a = Math.cos(leanAt) * lean;
      const b = Math.sin(leanAt) * lean;

      const stem = new THREE.CylinderGeometry(0.008, 0.013, height, 4);
      stem.translate(0, height / 2, 0);
      stem.rotateX(a);
      stem.rotateZ(b);
      stem.translate(ox, 0, oz);
      parts.push({
        geometry: stem,
        // Free at the top, pinned at the root, and very free — a reed bed in
        // wind is the loosest thing in this kit by a distance.
        sway: (_x, y) => Math.max(0, y / height) ** 1.2,
        color: shade(stalk, rng.range(0.88, 1.12)),
      });

      // Where the top of the stem actually ended up. Taken from the transform
      // rather than derived on paper — the flowers were built the other way
      // round once and every head sat beside its own stalk.
      _tip.set(0, height, 0).applyAxisAngle(X_AXIS, a).applyAxisAngle(Z_AXIS, b);

      // Every stem carries a head: the head is the entire recognition here, and a
      // third of the clump being plain sticks reads as grass left too long. The head
      // is built as one piece about the origin and carried up, so the sausage and
      // the point cannot drift apart.
      const long = rng.range(0.16, 0.26);
      const headParts: [THREE.BufferGeometry, number][] = [];

      // The sausage, sitting with its top exactly at the tip of the stem.
      const spike = new THREE.CylinderGeometry(0.024, 0.028, long, 6);
      spike.translate(0, -long / 2, 0);
      headParts.push([spike, shade(head, rng.range(0.9, 1.1))]);

      // The point, standing on top of it — base at zero, where the sausage ends, and
      // sunk into it. A cone whose base cap sits exactly on a cylinder's top cap
      // gives two coincident faces at identical radius in the same plane.
      const point = new THREE.ConeGeometry(0.026, long * 0.46, 6);
      point.translate(0, long * 0.17, 0);
      headParts.push([point, shade(head, 1.15)]);

      // And the bare stem continuing a little way past the point, which every
      // cattail has and which is most of what stops the head reading as a
      // lollipop.
      const whisker = new THREE.CylinderGeometry(0.004, 0.007, long * 0.5, 4);
      whisker.translate(0, long * 0.63, 0);
      headParts.push([whisker, shade(stalk, 0.9)]);

      for (const [geometry, color] of headParts) {
        geometry.rotateX(a);
        geometry.rotateZ(b);
        geometry.translate(ox + _tip.x, _tip.y, oz + _tip.z);
        parts.push({ geometry, color, sway: 1 });
      }

      // A blade or two off the lower stem, which is what stops a bed of these
      // reading as wire.
      if (rng.chance(0.5)) {
        const bladeLength = height * rng.range(0.3, 0.5);
        const blade = new THREE.ConeGeometry(0.018, bladeLength, 3);
        blade.translate(0, bladeLength / 2, 0);
        blade.scale(1, 1, 0.28);
        blade.rotateZ(rng.range(0.25, 0.6) * (rng.chance(0.5) ? 1 : -1));
        blade.rotateY(rng.range(0, Math.PI * 2));
        blade.translate(ox, height * rng.range(0.1, 0.3), oz);
        parts.push({ geometry: blade, color: shade(stalk, 0.92), sway: 0.8 });
      }
    }

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'reeds', rng.range(0, Math.PI * 2));
  },
};

const X_AXIS = new THREE.Vector3(1, 0, 0);
const Z_AXIS = new THREE.Vector3(0, 0, 1);
/** Reused across stems. One clump is built at a time and never concurrently. */
const _tip = new THREE.Vector3();
