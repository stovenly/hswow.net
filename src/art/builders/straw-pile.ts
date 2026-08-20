import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';

// A pile of loose straw, forked into a corner of the yard — the same material
// before it has been squared, corded or stacked.
//
// Loose is a shape, not an absence of one. It is much wider than it is tall, a
// third as high as it is across at most, because a steep pile of straw is a rick.
// The edge is where the shape lives: the outline is broken by low tongues where
// the stuff has spread, every one attached to the mound rather than lying near it.
// And the surface is full of straw ends, or a mound of this colour reads as a sand
// dune. Not solid — you wade into straw.
export const strawPile: MeshBuilder = {
  name: 'straw-pile',
  category: 'objects',
  radius: 1.7,
  solid: false,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const across = rng.range(1.1, 1.6);
    const tall = across * rng.range(0.28, 0.42);
    const straw = shade(PALETTE.GRASS_DRY, rng.range(1.02, 1.18));
    const shadowed = shade(PALETTE.GRASS_DRY, rng.range(0.78, 0.9));
    const sides = 9;

    /** Paler on top where the light is, dull in the hollows. */
    const lit = (_x: number, y: number): number =>
      shade(y > tall * 0.45 ? straw : shadowed, rng.range(0.93, 1.07));

    // The mound: low, wide, with slack sides. Stretched one way so it is a heap
    // that was thrown from a direction rather than a dome.
    const stretch = rng.range(1.05, 1.45);
    // Stated once, so the straw standing out of the mound can be sited on its actual
    // surface rather than on a straight-line guess — a guess runs inside the curve,
    // and a stalk rooted inside the curve is a stalk sealed in the heap.
    const STOPS: readonly (readonly [number, number])[] = [
      [0, 0.5],
      [0.3, 0.42],
      [0.72, 0.28],
      [1, 0],
    ];
    const radiusAt = (t: number): number => {
      const u = Math.min(1, Math.max(0, t));
      for (let i = 1; i < STOPS.length; i++) {
        if (u <= STOPS[i][0]) {
          const [y0, r0] = STOPS[i - 1];
          const [y1, r1] = STOPS[i];
          return (r0 + ((r1 - r0) * (u - y0)) / (y1 - y0)) * across;
        }
      }
      return 0;
    };
    const profile = [
      new THREE.Vector2(0, 0),
      ...STOPS.map(([t, r]) => new THREE.Vector2(r * across, t * tall)),
    ];
    const mound = new THREE.LatheGeometry(profile, sides);
    mound.scale(stretch, 1, 1 / stretch);
    // Not turned — the tongues and the straw ends are all sited against this
    // shape's own axes, so it may not have a bearing of its own. See
    // `dung-heap`, which had the same mistake and wore it worse.
    parts.push({ geometry: mound, color: lit, sway: 0 });

    // Tongues of it spread out round the foot. Each starts **inside** the mound
    // and runs outward, so the skirt is part of the pile and not a ring of
    // separate lumps round it.
    const tongues = rng.int(5, 8);
    const start = rng.range(0, Math.PI * 2);
    for (let i = 0; i < tongues; i++) {
      const around = start + (i / tongues) * Math.PI * 2 + rng.around(0, 0.4);
      const reach = across * rng.range(0.3, 0.55);
      const lump = new THREE.IcosahedronGeometry(1, 0);
      lump.scale(reach, tall * rng.range(0.16, 0.3), across * rng.range(0.16, 0.26));
      lump.rotateY(around);
      // Its middle sits on the flank of the mound, so half of it is buried —
      // measured against the profile at that height rather than guessed.
      const seat = rng.range(0.12, 0.24);
      const skin = radiusAt(seat) * rng.range(0.72, 0.92);
      lump.translate(
        Math.cos(around) * skin * stretch,
        tall * seat,
        (Math.sin(around) * skin) / stretch,
      );
      parts.push({ geometry: lump, color: lit, sway: 0 });
    }

    // Straw ends out of the whole surface. Placed on the mound's own profile —
    // a height, then pulled in to the radius the profile has there — so every
    // one of them has its root in the pile.
    for (let i = rng.int(16, 26); i > 0; i--) {
      const t = rng.range(0.04, 0.94);
      const at = tall * t;
      const skin = radiusAt(t) * rng.range(0.85, 0.98);
      const around = rng.range(0, Math.PI * 2);
      const out = rng.range(0.1, 0.26);
      const wisp = new THREE.ConeGeometry(rng.range(0.007, 0.015), out, 3);
      // Laid over at every angle, which is what loose straw does and what
      // nothing else in this family is allowed to do.
      wisp.rotateZ(rng.range(0.35, 1.5));
      wisp.rotateY(around + rng.around(0, 1.2));
      wisp.translate(
        Math.cos(around) * skin * stretch,
        at,
        (Math.sin(around) * skin) / stretch,
      );
      parts.push({ geometry: wisp, color: shade(straw, rng.range(0.9, 1.14)), sway: 0.25 });
    }

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'straw-pile', 0);
  },
};
