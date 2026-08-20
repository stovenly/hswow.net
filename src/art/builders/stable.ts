import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import {
  block,
  gableFace,
  look,
  louvre,
  markDoorways,
  onFace,
  ridgeHeight,
  slab,
} from '../building';
import { shade } from '../palette';

// A stable: a low boarded range, open along its front, divided into bays. The
// bays are the building — a partition between each pair, a post at the head of
// every partition carrying the plate, and the front left open under the eaves so
// the range airs. The boarding has gaps for the same reason. No doors and no
// doorway is recorded: everything it has is open to the front. One design, drawn.

const WIDTH = 7.2;
const DEPTH = 5.4;
const EAVE = 3.05;
const PITCH = 0.84;
const PLINTH = 0.4;
/** How many standings the run is divided into. */
const BAYS = 3;
/** Height of the boarded division between one standing and the next. */
const PARTITION = 1.95;

export const stable: MeshBuilder = {
  name: 'stable',
  category: 'structures',
  radius: 4.6,
  variants: 1,

  build({ scale = 1 } = {}) {
    const rng = createRng(7318);
    const parts: Part[] = [];

    const style = look(rng, 'board', 'thatch');

    // The front wall is left out and the loft closed with a leaf at each gable,
    // so you can look up into the roof over the standings — which is what an
    // open range actually shows you.
    const shell = block(rng, {
      width: WIDTH,
      depth: DEPTH,
      base: PLINTH,
      eave: EAVE,
      pitch: PITCH,
      open: [0],
      loft: 'gables',
      look: style,
    });
    parts.push(...shell.parts);

    // --- the standings -------------------------------------------------------
    const inner = DEPTH / 2 - 0.24;
    const step = WIDTH / BAYS;
    const standings: Part[] = [];

    // The plate over the whole open front, which is what the posts are there to
    // hold up.
    standings.push({
      geometry: slab(WIDTH, 0.24, 0.26, 0, EAVE - 0.14, -0.13),
      color: style.timberDark,
    });

    for (let i = 0; i <= BAYS; i++) {
      // The end posts stand against the gables, so every partition meets
      // something at both ends of the run.
      const x = -WIDTH / 2 + i * step;
      standings.push({
        geometry: slab(0.2, EAVE - 0.14, 0.22, x, (EAVE - 0.14) / 2, -0.13),
        color: style.timberDark,
      });
      if (i === 0 || i === BAYS) continue;

      // The partition itself: boards on a rail, running back to the far wall.
      const reach = inner - 0.2;
      standings.push({
        geometry: slab(0.09, PARTITION, reach, x, PARTITION / 2, -0.24 - reach / 2),
        color: shade(style.wall, 1.04),
      });
      standings.push({
        geometry: slab(0.13, 0.13, reach, x, PARTITION, -0.24 - reach / 2),
        color: style.timberDark,
      });
      // The heel post at the open end, which is what a partition is nailed to.
      standings.push({
        geometry: slab(0.16, PARTITION + 0.16, 0.16, x, (PARTITION + 0.16) / 2, -0.3),
        color: style.timberDark,
      });
    }
    onFace(standings, shell.wall.front);
    parts.push(...standings);

    // --- the loft ------------------------------------------------------------
    // A vent in the gable, and nothing else: a hoist beam out under the apex is, from
    // anywhere but square-on, a plank sticking out of the roof for no reason.
    const rise = ridgeHeight(DEPTH, PITCH);
    parts.push(
      ...onFace(
        louvre(rng, {
          at: 0,
          sill: EAVE + rise * 0.16,
          width: 0.78,
          height: Math.min(0.85, rise * 0.4),
          look: style,
        }),
        gableFace(shell.roof, -1),
      ),
    );

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);

    const mesh = finish(geometry, 'stable', 0);
    markDoorways(mesh, [], scale);
    return mesh;
  },
};
