import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';
import { rod } from '../rod';

/**
 * Herbs and onions hung up to dry, on a pole across the wall.
 *
 * **The overhead register.** A hut furnished only with things that stand on the
 * floor has a band of empty wall from head height up, and the eye reads that
 * emptiness as a room nobody uses — the ceiling of a real cottage is where the
 * food is, because it is the driest air in the house and out of reach of the
 * dog. This is the piece that fills it, and it is the only thing in the set
 * whose geometry starts above waist height and hangs *down*.
 *
 * Two kinds hang from the pole and they are chosen to differ in outline, not in
 * colour: a herb bunch is a narrow inverted cone that frays at the bottom, an
 * onion rope is a straight line of hard round lumps. At three pixels a block
 * those are still two different things, where two kinds of leafy bundle would
 * be one thing twice.
 *
 * Sway weights run the other way round from a plant's: a hanging bunch is
 * pinned at the *top* and free at the bottom, so the ramp is inverted. Nothing
 * will actually move until `hanging-herbs` gains an entry in `FLEX` — a name
 * that is not in that table is rigid by default, deliberately — but the weights
 * are authored now, because inferring them after the merge is impossible.
 *
 * Built against a wall at z = 0, hanging into +Z.
 */
export const hangingHerbs: MeshBuilder = {
  name: 'hanging-herbs',
  category: 'objects',
  radius: 0.7,
  solid: false,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    // High enough to be out of the way of a standing adult, low enough that the
    // brackets still have wall above them in a hut with a two-metre eaves.
    const railY = rng.range(1.68, 1.9);
    const span = rng.range(0.8, 1.35);
    const standOff = rng.range(0.08, 0.12);

    const poleColor = shade(PALETTE.BARK_PALE, rng.range(0.9, 1.1));

    // --- the pole and its brackets --------------------------------------------
    const left = new THREE.Vector3(-span / 2, railY, standOff);
    const right = new THREE.Vector3(span / 2, railY, standOff);
    parts.push({
      geometry: rod(left, right, rng.range(0.016, 0.022), rng.range(0.016, 0.022), 6),
      color: poleColor,
      sway: 0,
    });

    for (const end of [left, right]) {
      const wall = new THREE.Vector3(end.x, railY + rng.range(0.05, 0.09), 0.012);
      parts.push({
        geometry: rod(wall, end.clone(), rng.range(0.014, 0.019), 0.012, 5),
        color: shade(poleColor, 0.88),
        sway: 0,
      });
      const plate = new THREE.BoxGeometry(0.05, rng.range(0.06, 0.09), 0.024);
      plate.translate(end.x, wall.y, 0.012);
      parts.push({ geometry: plate, color: shade(poleColor, 0.8), sway: 0 });
    }

    /**
     * Weight for something hanging from the pole: nothing at the tie, full at
     * the free end. Smoothstepped, because a linear ramp puts its sharpest
     * change of bend right at the top and a crease across a bunch of herbs is
     * worse than a bunch that does not move.
     */
    const hangSway = (drop: number, amount: number) =>
      (_x: number, y: number): number => {
        const t = Math.max(0, Math.min(1, (railY - y) / Math.max(drop, 1e-6)));
        return t * t * (3 - 2 * t) * amount;
      };

    // --- what is hanging on it ------------------------------------------------
    // Four at most. This is loose clutter and it has a clutter's triangle
    // budget — a fifth bunch of six stems each carrying two leaf clumps is what
    // pushed the worst-case build over a thousand triangles, and a fifth bunch
    // is not worth a thousand triangles.
    const count = rng.int(2, 4);
    // Spaced by slot with a jitter inside it, so bunches never land on top of
    // one another but never march either.
    const usable = span * 0.82;
    for (let i = 0; i < count; i++) {
      const x = -usable / 2 + ((i + 0.5) / count) * usable + rng.around(0, usable / (count * 3));
      // **The tie has to straddle the rail, not hang below it.**
      //
      // This was `railY - 0.02..0.05`, against a tie only 3–4.5 cm tall — so
      // the top of the tie landed anywhere from just under the pole to three
      // centimetres clear of it, and a bunch whose knot misses the rail is a
      // bunch hanging in mid-air. Two independent rolls again deciding between
      // them whether two things touch, which is the same fault the fireplace
      // mantel had.
      //
      // Sitting the tie's *centre* on the rail is the formulation that cannot
      // come apart: a cloth tie is wrapped round a pole, so the pole should be
      // inside it. The jitter is small and vertical only.
      const tieY = railY + rng.around(0, 0.006);
      const tieZ = standOff + rng.around(0, 0.004);

      if (rng.chance(0.68)) {
        // --- a bunch of herbs, tied at the stalks and splaying at the leaf end
        const drop = rng.range(0.24, 0.42);
        const spread = rng.range(0.05, 0.1);
        const leaf = rng.pick([PALETTE.LEAF_DRY, PALETTE.LEAF_DARK, PALETTE.GRASS_DRY, PALETTE.LEAF]);

        const tie = new THREE.CylinderGeometry(0.026, 0.021, rng.range(0.03, 0.045), 5);
        tie.translate(x, tieY, tieZ);
        parts.push({ geometry: tie, color: PALETTE.CLOTH, sway: hangSway(drop, 0.06) });

        const stems = rng.int(3, 5);
        for (let s = 0; s < stems; s++) {
          const phi = (s / stems) * Math.PI * 2 + rng.range(0, 0.6);
          const reach = rng.range(0.72, 1);
          const top = new THREE.Vector3(
            x + Math.cos(phi) * 0.008,
            tieY - 0.01,
            tieZ + Math.sin(phi) * 0.008,
          );
          const tip = new THREE.Vector3(
            x + Math.cos(phi) * spread * reach,
            tieY - drop * reach,
            tieZ + Math.sin(phi) * spread * reach,
          );
          parts.push({
            geometry: rod(top, tip, rng.range(0.006, 0.009), 0.004, 4),
            color: shade(leaf, rng.range(0.8, 1.05)),
            sway: hangSway(drop, rng.range(0.2, 0.32)),
          });

          // Foliage on the lower half of the stem: a couple of flat slabs, not
          // a modelled leaf. Anything smaller than this is destroyed by the
          // dither before it reaches the screen.
          const clumps = rng.int(1, 2);
          for (let c = 0; c < clumps; c++) {
            const t = rng.range(0.45, 0.95);
            const clump = new THREE.BoxGeometry(
              rng.range(0.03, 0.055),
              rng.range(0.05, 0.1),
              rng.range(0.022, 0.04),
            );
            clump.rotateY(phi);
            clump.translate(
              top.x + (tip.x - top.x) * t,
              top.y + (tip.y - top.y) * t,
              top.z + (tip.z - top.z) * t,
            );
            parts.push({
              geometry: clump,
              color: shade(leaf, rng.range(0.75, 1.15)),
              sway: hangSway(drop, rng.range(0.24, 0.36)),
            });
          }
        }
      } else {
        // --- a rope of onions or garlic
        const bulbs = rng.int(4, 7);
        const pitch = rng.range(0.055, 0.08);
        const drop = pitch * bulbs + 0.06;
        const skin = rng.pick([PALETTE.MARKER_YELLOW, PALETTE.HIDE_PALE, PALETTE.WOOL, PALETTE.RUST]);

        parts.push({
          geometry: rod(
            new THREE.Vector3(x, tieY + 0.03, tieZ),
            new THREE.Vector3(x + rng.around(0, 0.02), tieY - drop, tieZ + rng.around(0, 0.02)),
            0.008,
            0.006,
            4,
          ),
          color: PALETTE.CLOTH,
          sway: hangSway(drop, 0.28),
        });

        for (let b = 0; b < bulbs; b++) {
          const y = tieY - 0.05 - b * pitch;
          // Alternating sides of the string, so the rope reads as plaited
          // rather than as beads on a wire.
          const swing = ((b % 2) * 2 - 1) * rng.range(0.012, 0.03);
          const bulb = new THREE.IcosahedronGeometry(rng.range(0.028, 0.042), 0);
          bulb.scale(1, rng.range(0.8, 1.05), 1);
          bulb.translate(x + swing, y, tieZ + rng.around(0, 0.012));
          parts.push({
            geometry: bulb,
            color: shade(skin, rng.range(0.85, 1.12)),
            sway: hangSway(drop, rng.range(0.15, 0.26)),
          });
        }
      }
    }

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'hanging-herbs', 0);
  },
};
