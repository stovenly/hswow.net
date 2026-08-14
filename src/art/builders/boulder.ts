import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { stoneLump, stoneColour, weathered } from '../stone';

/**
 * A boulder: one weathered mass, taller than the player.
 *
 * **The register the kit was missing.** `rock` runs from 35 cm to 1.1 m, which
 * is something you step over; this runs from 1.6 m to 3.4 m, which is something
 * you walk *round*. Between them was the whole of the size range that a natural
 * boundary is actually built from — big enough to stop you and to break a
 * sightline, small enough to be one object rather than terrain.
 *
 * Three or four of these in a loose run is the rock line. That is the entire
 * intended use, and it is why the shape is deliberately plain: a boulder with a
 * memorable silhouette placed six times in a row stops being scenery and starts
 * being wallpaper, which is the same failure a wood built from two tree shapes
 * has. The variety is meant to come from the seed, the scale and the *bearing*
 * the placer turns it to, not from the geometry being clever.
 *
 * A second smaller mass leans against the first about half the time. It costs
 * eighty triangles and it is most of what makes the object read as geology
 * rather than as a dropped prop — two stones that have come to rest against each
 * other have obviously been there a while.
 */
export const boulder: MeshBuilder = {
  name: 'boulder',
  category: 'nature',
  radius: 2.4,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const size = rng.range(0.8, 1.7);
    // Flatter than it is round, and wider one way than the other. A boulder
    // that is spherical reads as a ball; the squash and the stretch together
    // are what make it read as something that has been lying on its side.
    const squash = rng.range(0.62, 0.86);
    const stretch = rng.range(0.78, 1.3);
    const bury = rng.range(0.18, 0.32);

    const main = stoneLump(rng, { radius: size, detail: 1, rough: rng.range(0.2, 0.3), squash, stretch, bury });
    main.rotateY(rng.range(0, Math.PI * 2));
    const crown = size * squash * 2 * (1 - bury);
    parts.push({ geometry: main, color: weathered(rng, stoneColour(rng), crown), sway: 0 });

    // The one that came to rest against it. Set low and tucked in, so it reads
    // as leaning rather than as a second boulder that happens to be nearby.
    if (rng.chance(0.55)) {
      const lean = size * rng.range(0.34, 0.6);
      const away = size * rng.range(0.7, 1.05);
      const bearing = rng.range(0, Math.PI * 2);
      const buddy = stoneLump(rng, {
        radius: lean,
        detail: rng.chance(0.5) ? 1 : 0,
        rough: rng.range(0.22, 0.34),
        squash: rng.range(0.7, 1),
        bury: rng.range(0.25, 0.4),
      });
      buddy.rotateZ(rng.around(0, 0.3));
      buddy.rotateY(rng.range(0, Math.PI * 2));
      buddy.translate(Math.cos(bearing) * away, 0, Math.sin(bearing) * away);
      parts.push({
        geometry: buddy,
        color: weathered(rng, stoneColour(rng), lean * 1.4),
        sway: 0,
      });
    }

    // A couple of chips at the foot, where the mass has spalled. Detail 0 —
    // these are read as a broken edge round the base, never as objects.
    for (let i = rng.int(0, 3); i > 0; i--) {
      const chip = stoneLump(rng, {
        radius: size * rng.range(0.09, 0.18),
        detail: 0,
        rough: 0.4,
        squash: rng.range(0.5, 0.8),
        bury: 0.4,
      });
      const bearing = rng.range(0, Math.PI * 2);
      const out = size * rng.range(0.85, 1.25);
      chip.rotateY(rng.range(0, Math.PI * 2));
      chip.translate(Math.cos(bearing) * out, 0, Math.sin(bearing) * out * stretch);
      parts.push({ geometry: chip, color: stoneColour(rng), sway: 0 });
    }

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'boulder', 0);
  },
};
