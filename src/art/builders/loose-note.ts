import type { BuildOptions, MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { sheet, LEAF } from '../paper';
import { createRng } from '../random';

/**
 * A single sheet, put down and left.
 *
 * The smallest readable there is, and the one that has to work hardest: a sheet
 * of paper on a floor is a pale rectangle a millimetre thick, and from standing
 * height that is nearly nothing. What makes it findable is the curl — a sheet
 * that has been anywhere does not lie flat, and a corner standing a centimetre
 * off the ground is the only part of it that catches the light differently from
 * whatever it is lying on.
 *
 * Built lying flat, face up, corners lifted.
 */
export const looseNote: MeshBuilder = {
  name: 'loose-note',
  category: 'objects',
  display: 'Note',
  radius: 0.14,
  solid: false,

  build({ seed = 1, scale = 1 }: BuildOptions = {}) {
    const rng = createRng(seed);
    const width = rng.range(0.11, 0.16);
    const length = width * rng.range(1.15, 1.4);

    const parts: Part[] = sheet(width, length, rng);
    // A shallow turn about each axis in turn, so the sheet lies on two of its
    // corners rather than on all four. Applied to the whole assembly, because
    // the marks have to lift with the paper they are written on.
    const lift = rng.range(0.03, 0.09);
    for (const part of parts) {
      part.geometry.rotateX(rng.around(0, lift));
      part.geometry.rotateZ(rng.around(0, lift));
    }

    const geometry = assemble(parts);
    geometry.rotateY(rng.range(0, Math.PI * 2));
    // Sat down onto the ground rather than centred on it: the turn above put
    // the lowest corner below zero, and a note half sunk into the floor is
    // worse than one hovering over it.
    geometry.computeBoundingBox();
    geometry.translate(0, -(geometry.boundingBox?.min.y ?? 0) + LEAF * 0.5, 0);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'loose-note', 0);
  },
};
