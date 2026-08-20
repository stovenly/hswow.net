import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { shade } from '../palette';

// A chainlink fence panel: two posts, rails, and two families of thin diagonal
// wires crossing at right angles. Spaced at 22 cm rather than a real fence's 5,
// so the diamond still reads at a couple of hundred triangles. Single boxes corner
// to corner rather than a woven over-and-under.
export const chainlink: MeshBuilder = {
  name: 'chainlink',
  category: 'structures',
  radius: 1.6,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const width = rng.range(2.4, 3.2);
    const height = rng.range(1.8, 2.4);
    const postR = rng.range(0.04, 0.055);
    // Galvanised, so pale and cool rather than the kit's darker structural
    // iron. A chainlink fence that is the same colour as a gate reads as
    // wrought iron, which is a completely different thing.
    const galv = shade(0x8d949a, rng.range(0.92, 1.08));
    const wire = shade(0x9aa1a6, rng.range(0.9, 1.1));

    // --- posts and rails -----------------------------------------------------
    for (const side of [-1, 1]) {
      const post = new THREE.CylinderGeometry(postR, postR * 1.06, height, 6);
      post.translate((side * width) / 2, height / 2, 0);
      parts.push({ geometry: post, color: galv, sway: 0 });

      // A cap, so the post does not end in an open tube.
      const cap = new THREE.CylinderGeometry(postR * 1.15, postR * 1.15, postR * 0.5, 6);
      cap.translate((side * width) / 2, height + postR * 0.2, 0);
      parts.push({ geometry: cap, color: shade(galv, 0.9), sway: 0 });
    }

    // Top rail always, bottom rail on most. The top rail is what stops a
    // chainlink fence reading as a net hung between two poles.
    const rails: number[] = [height - postR * 1.4];
    if (rng.chance(0.75)) rails.push(postR * 1.6);
    for (const at of rails) {
      const rail = new THREE.CylinderGeometry(postR * 0.62, postR * 0.62, width, 6);
      rail.rotateZ(Math.PI / 2);
      rail.translate(0, at, 0);
      parts.push({ geometry: rail, color: shade(galv, 1.05), sway: 0 });
    }

    // --- the mesh ------------------------------------------------------------
    // Diagonals at 45°, so the two families cross square and the gaps are diamonds
    // rather than parallelograms. Spacing is measured along the horizontal.
    const pitch = rng.range(0.2, 0.26);
    const gauge = rng.range(0.008, 0.011);
    const meshTop = rails[0];
    const meshBottom = rails.length > 1 ? rails[1] : 0;
    const meshH = meshTop - meshBottom;
    const half = width / 2;

    for (const lean of [1, -1]) {
      // A wire at 45° through (c, 0) hits the panel's top at (c + lean·meshH).
      // Running c from beyond the left edge to beyond the right guarantees the
      // corners are covered without a special case for them.
      for (let c = -half - meshH; c <= half + meshH; c += pitch) {
        // Clip to the panel: both ends are pulled inside the rectangle and the wire
        // is built to whatever is left, so a full wire and a corner stub take the
        // same code path.
        const x0 = Math.max(-half, Math.min(half, c));
        const x1 = Math.max(-half, Math.min(half, c + lean * meshH));
        if (Math.abs(x1 - x0) < 1e-3) continue;
        const y0 = meshBottom + Math.abs(x0 - c);
        const y1 = meshBottom + Math.abs(x1 - c);

        const length = Math.hypot(x1 - x0, y1 - y0);
        const strand = new THREE.BoxGeometry(gauge, length, gauge);
        strand.rotateZ(-Math.atan2(x1 - x0, y1 - y0));
        strand.translate((x0 + x1) / 2, (y0 + y1) / 2, lean > 0 ? gauge : -gauge);
        parts.push({ geometry: strand, color: wire, sway: 0 });
      }
    }

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'chainlink', 0);
  },
};
