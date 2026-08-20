import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { stoneColour, weathered, stoneLump, stoneChunk } from '../stone';

// A standing stone: one slab, set upright on end — a rock that could not have got
// where it is on its own, so the whole content is that somebody stood it up.
//
// A slab and not a column: much wider one way than the other, so it presents a
// broad face from one bearing and almost nothing from ninety degrees round. A
// square-section pillar reads as masonry. And no two faces parallel — a hull of
// scattered points sheared over between top and bottom, because a jittered box set
// upright is a gatepost, which is dressed stone. It leans a little, since dead
// upright is the one angle that says machine, and it has packing stones at the
// foot, which is literally how one is erected.
export const standingStone: MeshBuilder = {
  name: 'standing-stone',
  category: 'nature',
  radius: 0.7,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const height = rng.range(1.8, 3.4);
    const width = height * rng.range(0.24, 0.38);
    const thick = width * rng.range(0.3, 0.5);
    const lean = rng.around(0, 0.11);
    const bed = stoneColour(rng);

    // Tapered: narrower at the top than at the butt, because that is which way
    // up you stand a wedge if you want it to stay standing. Buried a third —
    // which is the only reason any of them are still upright.
    const slab = stoneChunk(rng, {
      width: width / 2,
      height: height * 0.65,
      depth: thick / 2,
      // Few sides, so the faces are broad. A menhir read at twenty metres is
      // two planes and an edge between them, and more facets only blur that.
      sides: rng.int(5, 6),
      rough: rng.range(0.12, 0.22),
      // Leaned over between butt and crown, so the two ends are not parallel.
      skew: rng.range(0.14, 0.3),
      taper: rng.range(0.6, 0.85),
      bury: 0.3,
    });
    slab.rotateZ(lean);
    slab.rotateX(rng.around(0, 0.05));
    slab.rotateY(rng.range(0, Math.PI * 2));
    parts.push({ geometry: slab, color: weathered(rng, bed, height), sway: 0 });

    // Packing stones, wedged into the socket: low, against the butt, and partly
    // buried, because they are holding it up rather than lying beside it. Thrown
    // wide they stand clear of the slab and read as a separate little pile.
    for (let i = rng.int(3, 6); i > 0; i--) {
      const size = rng.range(0.1, 0.24);
      const bearing = rng.range(0, Math.PI * 2);
      const out = width * rng.range(0.2, 0.5);
      const packing = rng.chance(0.5)
        ? stoneChunk(rng, {
            width: size,
            height: size * rng.range(0.5, 0.8),
            depth: size * rng.range(0.7, 1.1),
            sides: rng.int(5, 7),
            rough: 0.28,
            skew: 0.4,
            bury: 0.45,
          })
        : stoneLump(rng, { radius: size, detail: 0, rough: 0.34, squash: 0.7, bury: 0.45 });
      packing.rotateY(rng.range(0, Math.PI * 2));
      packing.translate(Math.cos(bearing) * out, rng.range(-0.02, 0.05), Math.sin(bearing) * out);
      parts.push({ geometry: packing, color: stoneColour(rng), sway: 0 });
    }

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'standing-stone', 0);
  },
};
