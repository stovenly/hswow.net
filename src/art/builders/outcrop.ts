import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { stoneColour, weathered, stoneLump, stoneChunk } from '../stone';

/**
 * An outcrop: bedrock breaking through the surface.
 *
 * **This is the piece that marries a rock line into a hillside**, and it does it
 * by being the one stone in the family that is obviously *attached to something*.
 * A boulder sits on the ground and could be moved; an outcrop is the ground,
 * with the soil worn off it. Put a run of boulders along a slope and it reads as
 * a wall somebody built out of round stones. Put two outcrops in the run and the
 * whole line reads as the hill showing through.
 *
 * ## One bedding plane, and everything obeys it
 *
 * The trick is entirely in the shared angle. Rock does not fracture at random —
 * it splits along the planes it was laid down in, so every plate in a real
 * outcrop dips the same way by the same amount, and the eye reads that
 * agreement as structure long before it could say why.
 *
 * So the dip and the strike are rolled **once**, and every slab takes them with
 * only a degree or two of disagreement. Rolling per slab instead gives a heap of
 * tilted boxes, which is what the first version was.
 *
 * Plates rather than lumps: broken rock has straight edges and sharp arrises
 * where weathered rock has none. They are **convex hulls of scattered points,
 * not boxes** — the first version used a jittered box, on the reasoning that a
 * box has flat faces and sharp edges. It does, along with six of them meeting at
 * twelve right angles that no amount of corner jitter takes away, and a row of
 * those stood on end at a shared angle is not bedrock, it is brickwork. See
 * `art/stone.ts`.
 *
 * Built about the origin with the strike along **+X**, so a placer turns it to
 * follow the line it is edging. Buried deep — most of an outcrop is underground,
 * and the part that shows is the part that reads.
 */
export const outcrop: MeshBuilder = {
  name: 'outcrop',
  category: 'nature',
  radius: 2.3,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    // The bed. Dip is how steeply the plates lean out of the ground; a shallow
    // dip gives a pavement and a steep one gives a set of fins, and both are
    // real, so the range is wide and the roll is once.
    const dip = rng.range(0.14, 0.7);
    const strike = rng.range(-0.25, 0.25);
    const plates = rng.int(3, 6);
    const reach = rng.range(1.6, 2.8);
    const thick = rng.range(0.22, 0.44);
    const rise = rng.range(0.7, 1.9);
    const bed = stoneColour(rng);

    for (let i = 0; i < plates; i++) {
      // Stepped along the strike and shortening away from the tallest, so the
      // mass has a high shoulder and a low tail rather than being a fan.
      const t = i / Math.max(plates - 1, 1);
      const fade = 1 - Math.abs(t - rng.range(0.25, 0.45)) * rng.range(0.7, 1.2);
      const height = rise * Math.max(0.35, fade) * rng.range(0.85, 1.15);
      const width = reach * rng.range(0.5, 0.95);
      const deep = thick * rng.range(0.8, 1.35);

      // Long in X, thin through Z, and reaching well below zero. The buried
      // half is what stops a plate looking like a slab standing on the grass.
      //
      // `taper` above 1 on purpose: a plate levered up along its bedding is
      // usually *wider* at the exposed end than where it is still in the ground,
      // because that is the end frost has been working on.
      const slab = stoneChunk(rng, {
        width: width / 2,
        height: height * rng.range(0.9, 1.15),
        depth: deep / 2,
        sides: rng.int(5, 7),
        rough: rng.range(0.18, 0.3),
        skew: rng.range(0.15, 0.35),
        taper: rng.range(0.95, 1.25),
        bury: 0.5,
      });
      slab.rotateX(dip + rng.around(0, 0.06));
      slab.rotateY(strike + rng.around(0, 0.09));
      // **Stepped along the strike by less than a plate's own width, and barely
      // moved across it.** The across-strike scatter was ±1.6 thicknesses on a
      // plate one thickness deep, so a five-plate outcrop routinely came apart
      // into two groups with clear air between them — two objects standing near
      // each other, which is not what a piece of bedrock is. Plates in one
      // outcrop are one bed; they may step and they may not separate.
      slab.translate(
        (t - 0.5) * reach * rng.range(0.55, 0.85),
        rng.around(-height * 0.12, height * 0.1),
        rng.around(0, thick * 0.45),
      );
      parts.push({ geometry: slab, color: weathered(rng, bed, height), sway: 0 });
    }

    // Rubble in the joints — what has come off the plates and lodged between
    // them. Rounded rather than fractured, because these are the pieces that
    // have been loose long enough to wear.
    for (let i = rng.int(2, 5); i > 0; i--) {
      const chip = stoneLump(rng, {
        radius: rng.range(0.12, 0.3),
        detail: 0,
        rough: 0.36,
        squash: rng.range(0.5, 0.8),
        bury: rng.range(0.3, 0.5),
      });
      chip.rotateY(rng.range(0, Math.PI * 2));
      chip.translate(rng.around(0, reach * 0.9), 0, rng.around(0, thick * 3));
      parts.push({ geometry: chip, color: stoneColour(rng), sway: 0 });
    }

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'outcrop', 0);
  },
};
