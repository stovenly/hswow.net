import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE } from '../palette';

/**
 * A water trough: four walls, a floor, and sometimes standing water.
 *
 * Hollow, built from five slabs rather than by cutting a box, because there is
 * no constructive solid geometry here and none is needed — a container is
 * walls, and walls are what it is actually made of.
 *
 * The water is a flat panel a little below the rim. It is the only surface in
 * the kit that is meant to be looked *into* rather than at, which is why it
 * sits low: a trough filled to the brim reads as a solid block of colour.
 */
export const trough: MeshBuilder = {
  name: 'trough',
  category: 'objects',
  radius: 1.1,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const length = rng.range(1.4, 2.1);
    const width = rng.range(0.5, 0.75);
    const height = rng.range(0.4, 0.6);
    const t = rng.range(0.09, 0.14);
    const stone = rng.chance(0.55);
    const shell = stone ? PALETTE.STONE : PALETTE.TIMBER;

    // **Set into the walls rather than flush with them**, in both directions.
    //
    // A floor the full outer size puts its own side faces at exactly ±length/2
    // and ±width/2 — which is precisely where the walls' *outer* faces land,
    // because each wall is positioned so its outside is the outside of the
    // trough. That is a coplanar pair running the whole way round the base,
    // and it flickers along the bottom edge from any distance where the two
    // round to the same depth.
    //
    // A thickness smaller in each direction lands the floor's edge halfway
    // into the wall it meets: outside the wall's inner face, inside its outer
    // one, coincident with neither.
    const floor = new THREE.BoxGeometry(length - t, t, width - t);
    // Lifted clear of the ground for the same reason, in the one direction the
    // inset cannot help with: sitting on y = 0 the floor's underside is
    // coplanar with the four walls' undersides. That pair only shows from
    // below, and the trough is on the ground — but it is the same defect, it
    // costs a centimetre nobody can see, and the void it leaves underneath is
    // sealed by the walls on every side.
    floor.translate(0, t / 2 + 0.01, 0);
    parts.push({ geometry: floor, color: stone ? PALETTE.STONE_DARK : PALETTE.TIMBER_DARK, sway: 0 });

    // Each piece is a slightly different size from its neighbours on purpose.
    // Boxes that share an exact corner share exact edges, and a shared edge
    // belongs to four faces instead of two — coincident surfaces that z-fight
    // where they show and make nonsense of any test for whether the solid is
    // closed. A percent of difference removes the coincidence entirely and is
    // invisible.
    for (const side of [-1, 1]) {
      const long = new THREE.BoxGeometry(length * 0.99, height, t);
      long.translate(0, height / 2, (side * (width - t)) / 2);
      parts.push({ geometry: long, color: shell, sway: 0 });

      // Full width, so the ends run *through* the sides rather than butting
      // exactly against them. Faces that meet precisely are coincident faces:
      // two surfaces occupying the same plane, which z-fight where they show
      // and confuse any measure of whether the solid is closed. Overlapping is
      // both cheaper to reason about and how joinery actually works.
      const short = new THREE.BoxGeometry(t, height * 0.985, width * 0.985);
      short.translate((side * (length - t)) / 2, height / 2, 0);
      parts.push({ geometry: short, color: shell, sway: 0 });
    }

    if (rng.chance(0.6)) {
      // Wider than the cavity, so its edges disappear *into* the walls.
      //
      // Exactly `length - t*2` is the width of the opening — which means the
      // water's four side faces sit in the same planes as the walls' inner
      // faces. That is the pair you are looking straight at whenever you look
      // into the trough, and it is the worst place in the object to have one.
      // Sinking the surface a fifth of a wall's thickness into each side also
      // removes the hairline of background that a perfectly fitted panel shows
      // at grazing angles.
      const water = new THREE.BoxGeometry(length - t * 1.6, 0.03, width - t * 1.6);
      water.translate(0, height * rng.range(0.55, 0.78), 0);
      parts.push({ geometry: water, color: 0x2c3f46, sway: 0 });
    }

    const geometry = assemble(parts);
    geometry.rotateY(rng.range(0, Math.PI));
    if (scale !== 1) geometry.scale(scale, scale, scale);
    // Said here rather than in `art/underfoot.ts`, because only the roll above
    // knows which of the two this one is.
    return finish(geometry, 'trough', 0, stone ? 'stone' : 'wood');
  },
};
