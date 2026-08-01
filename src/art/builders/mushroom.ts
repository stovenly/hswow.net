import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';

/**
 * A cluster of mushrooms, several to a clump at different ages.
 *
 * Never one. Fungi fruit in groups from the same mycelium, and a single
 * mushroom standing alone looks placed where five of graded sizes look grown.
 *
 * ## Three shapes, and never two in one clump
 *
 * A clump commits to one, because a clump is one organism — two kinds fruiting
 * out of the same patch of earth is the one thing that definitely never
 * happens.
 *
 * - **button** — young and domed, on a short fat stem. What everyone pictures.
 * - **open** — the same mushroom grown on: the cap has flattened right out and
 *   turned up at the rim, and the stem has barely got any longer.
 * - **puffball** — a ball on a short stout stalk. It was stemless, sitting
 *   straight on the earth, and it read as a dropped pebble: with nothing
 *   holding it up there was no reason for the eye to call it a fungus at all.
 *   A visible stalk is what makes a ball a *mushroom*.
 *
 * **All three grow out of the ground.** An earlier version had a bracket kind
 * that grew in shelves off a vertical surface, which is a real fungus and the
 * wrong object: brackets need a trunk to grow on and this builder is placed on
 * open ground, so every instance was a stack of shelves floating in mid-air.
 *
 * ## Stems are short
 *
 * The same version also had a tall thin-stemmed kind at five to eight times the
 * cap radius, which came out as a cocktail umbrella. Mushroom stems are *stout*
 * — roughly one to three cap-radii, thick enough to hold a wet cap up in wind —
 * and getting that ratio wrong reads as wrong instantly even though almost
 * nobody could say what the right number is.
 *
 * Walk-through, like the grass. Small soft things that stop the player are what
 * make a world feel like a floor with obstacles glued to it.
 */
export const mushroom: MeshBuilder = {
  name: 'mushroom',
  category: 'foliage',
  radius: 0.4,
  solid: false,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const kind = rng.chance(0.42) ? 'button' : rng.chance(0.55) ? 'open' : 'puffball';

    // One colour for the clump: they are the same organism.
    const cap = rng.pick([
      PALETTE.RUST,
      PALETTE.EARTH,
      PALETTE.STONE_PALE,
      PALETTE.BARK_PALE,
      0x8a3a2e,
      0xb8a468,
    ]);
    const flesh = rng.chance(0.5) ? PALETTE.CLOTH : 0xd8d0bc;

    const count = kind === 'puffball' ? rng.int(4, 9) : rng.int(3, 7);

    for (let i = 0; i < count; i++) {
      // Age, 0 young to 1 old. Nearly everything follows from it.
      const age = rng();
      const size = rng.range(0.045, 0.13) * (0.5 + age * 0.75);

      const angle = rng.range(0, Math.PI * 2);
      const distance = Math.sqrt(rng()) * 0.22;
      const x = Math.cos(angle) * distance;
      const z = Math.sin(angle) * distance;

      if (kind === 'puffball') {
        // A short fat stalk, flaring up into the ball. Stout and tapered
        // *outward*, which is the giveaway — every other mushroom here narrows
        // toward its cap and this one widens into it, so the two never get
        // confused even at a glance.
        const stalkH = size * rng.range(0.5, 0.9);
        const stalk = new THREE.CylinderGeometry(size * 0.62, size * 0.4, stalkH, 6);
        stalk.translate(x, stalkH / 2, z);
        parts.push({ geometry: stalk, color: shade(flesh, 0.9), sway: 0 });

        // The ball itself, squashed a little under its own weight and sunk
        // into the top of the stalk so the two cannot part company.
        const ball = new THREE.IcosahedronGeometry(size * 1.15, 1);
        ball.scale(1, rng.range(0.78, 0.95), 1);
        ball.translate(x, stalkH + size * 0.72, z);
        parts.push({ geometry: ball, color: shade(flesh, rng.range(0.92, 1.1)), sway: 0 });
        continue;
      }

      const lean = rng.around(0, 0.2);
      // Short and stout — one to two and a half cap radii, and thick. This is
      // the number that was badly wrong before.
      const stemHeight = size * rng.range(1.1, 2.4);
      const stemR = size * rng.range(0.24, 0.36);

      const stem = new THREE.CylinderGeometry(stemR * 0.86, stemR * 1.2, stemHeight, 6);
      stem.translate(0, stemHeight / 2, 0);
      stem.rotateZ(lean);
      stem.translate(x, 0, z);
      parts.push({ geometry: stem, color: shade(flesh, rng.range(0.94, 1.06)), sway: 0 });

      if (kind === 'button') {
        // A dome: tall relative to its width, and barely wider than the stem
        // on the youngest. A cone with a height that falls as the radius grows
        // is the whole young-to-old progression in two numbers.
        const capRadius = size * (0.8 + age * 0.5);
        const capHeight = size * (1.35 - age * 0.6);
        const dome = new THREE.ConeGeometry(capRadius, capHeight, rng.int(7, 9));
        dome.translate(0, capHeight * 0.34, 0);
        dome.rotateZ(lean);
        dome.translate(x, stemHeight, z);
        parts.push({ geometry: dome, color: cap, sway: 0 });
      } else {
        // Grown on: wide, shallow, and turned up at the rim. Built as a plate
        // and a lip rather than as one cone, because the upturned edge is the
        // whole difference from a button and a cone cannot make it.
        const capRadius = size * (1.3 + age * 0.7);
        const plate = new THREE.CylinderGeometry(capRadius * 0.55, capRadius, size * 0.2, 9);
        plate.rotateZ(lean);
        plate.translate(x, stemHeight + size * 0.08, z);
        parts.push({ geometry: plate, color: cap, sway: 0 });

        const lip = new THREE.CylinderGeometry(capRadius * 1.04, capRadius * 0.9, size * 0.13, 9);
        lip.rotateZ(lean);
        lip.translate(x, stemHeight + size * 0.2, z);
        parts.push({ geometry: lip, color: shade(cap, 1.14), sway: 0 });

        // Gills underneath, as a paler disc set just under the rim. Visible
        // only from low down, which is where an open cap is looked at.
        const gills = new THREE.CylinderGeometry(capRadius * 0.86, capRadius * 0.5, size * 0.1, 9);
        gills.rotateZ(lean);
        gills.translate(x, stemHeight - size * 0.02, z);
        parts.push({ geometry: gills, color: shade(flesh, 0.88), sway: 0 });
      }
    }

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'mushroom', 0);
  },
};
