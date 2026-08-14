import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { roughBox } from '../masonry';
import { stoneColour, faceWobble } from '../stone';

/**
 * Scree: a fan of shattered rock spilling from the foot of a slope.
 *
 * **The cheapest thing in the kit that makes a rock line look like it belongs to
 * the hill behind it.** A boulder run laid across grass always has one problem
 * the boulders themselves cannot fix: the stones begin exactly where the grass
 * stops, on a line, and there is nothing between the two. Scree is that
 * something — the debris that says the slope above is coming apart and this is
 * where the pieces ended up.
 *
 * ## Sorted, because real screes are
 *
 * A fan is not a uniform sprinkle. Pieces that come off a face bounce, and the
 * heavy ones carry furthest — so the head of a fan is fine chippings and the toe
 * is the big stuff. That sorting is most of what makes it read as *fallen*
 * rather than *scattered*, and it costs one multiply.
 *
 * Spreads along **+Z**, so a placer points it downhill.
 *
 * ## Tetrahedra
 *
 * Four triangles each. At this size a chip is two or three pixels of silhouette
 * and nothing else survives, so what matters is only that the outline has
 * corners on it — and a tetrahedron is the fewest triangles that can have any.
 * Twenty-odd of them come to less than a single `rock`'s worth of the same idea
 * at four times the coverage.
 *
 * **Not solid.** The collider indexes raw triangles and its cost rises faster
 * than linearly with how densely they are packed, so a hand-span of small sharp
 * pieces is the worst possible thing to put in it — and the feel argument agrees:
 * catching on a stone chip reads as the world being made of invisible boxes. The
 * ground underneath is already `rock` on any slope steep enough to shed.
 */
export const scree: MeshBuilder = {
  name: 'scree',
  category: 'nature',
  radius: 2.4,
  solid: false,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const pieces = rng.int(18, 28);
    const run = rng.range(2.6, 4.4);
    // How wide the fan opens by its toe. Narrow fans read as a chute, wide ones
    // as an apron, and both are worth having.
    const spread = rng.range(0.35, 0.85);
    const bed = stoneColour(rng);

    for (let i = 0; i < pieces; i++) {
      // Square-rooted, so pieces gather toward the head of the fan rather than
      // spreading evenly down its length — which is where they come from.
      const down = Math.sqrt(rng()) * run;
      const t = down / run;
      const across = rng.around(0, run * spread * t * 0.6 + 0.15);
      // Sorted: fine at the head, coarse at the toe.
      const size = rng.range(0.05, 0.13) * (0.5 + t * 1.6);

      const chip = rng.chance(0.72)
        ? new THREE.TetrahedronGeometry(size, 0)
        : roughBox(
            rng,
            [-size, size],
            [-size * 0.7, size * rng.range(0.35, 0.7)],
            [-size * rng.range(0.6, 1.1), size * rng.range(0.6, 1.1)],
            size * 0.2,
          );
      chip.rotateX(rng.range(0, Math.PI));
      chip.rotateY(rng.range(0, Math.PI * 2));
      chip.scale(1, rng.range(0.5, 0.8), 1);
      // Half sunk. Loose stone beds itself into whatever it lands on, and a
      // chip resting on a tangent line reads as floating at any distance.
      chip.translate(across, size * rng.range(0.1, 0.35), down);
      parts.push({ geometry: chip, color: faceWobble(bed, across, down), sway: 0 });
    }

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'scree', 0);
  },
};
