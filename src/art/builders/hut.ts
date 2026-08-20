import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import {
  block,
  chimney,
  facePoint,
  leanTo,
  look,
  markDoorways,
  onFace,
  shuttered,
  type Doorway,
  type RoofKind,
} from '../building';

// A villager's house: one bay of box frame on a stone plinth, under thatch, and
// deliberately the plainest thing in the family — no porch, no jetty, no
// cross-wing. What varies is the infill colour, the roof, and whether there is an
// outshot on the back. Nothing is built at the doorway; all this hands over is
// where it goes, in `userData.doorways`.
export const hut: MeshBuilder = {
  name: 'hut',
  category: 'structures',
  radius: 3,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    // Thatch mostly, because that is what a villager could cut himself. The
    // other two are what he got when the manor was paying.
    const draw = rng();
    const kind: RoofKind = draw < 0.62 ? 'thatch' : draw < 0.82 ? 'shingle' : 'tile';
    const style = look(rng, 'frame', kind);

    const width = rng.range(3.8, 4.5);
    const depth = rng.range(3.1, 3.7);
    // Taller than it looks like it should be, and thatch is why: the roof's
    // underside crosses the wall face the best part of two thirds of a metre below
    // the wall head. `Block.head` is the number that matters.
    const eave = rng.range(3.1, 3.4);
    const plinth = rng.range(0.3, 0.46);
    // Steeper under thatch: straw only sheds water if the pitch throws it off
    // faster than it can soak in, which is why a thatched roof is never shallow.
    const pitch = kind === 'thatch' ? rng.range(0.86, 1.0) : rng.range(0.72, 0.86);

    const shell = block(rng, {
      width,
      depth,
      base: plinth,
      eave,
      pitch,
      look: style,
    });
    parts.push(...shell.parts);

    // --- the front ------------------------------------------------------------
    const doorWidth = rng.range(1.02, 1.2);
    const doorHeight = Math.min(rng.range(2.12, 2.36), shell.head - 0.3);
    const doorAt = rng.around(0, width * 0.17);

    // Nothing is built at the doorway itself — see `building.ts`. The three
    // numbers above are only here to be recorded, and to keep the window off it.
    const front: Part[] = [];
    // A window on the wider side of the door, and a second one if there is room
    // for it without crowding the frame.
    const side = doorAt > 0 ? -1 : 1;
    const room = width / 2 - Math.abs(doorAt + side * (doorWidth / 2)) - 0.4;
    if (room > 0.95) {
      // Sized to the wall left rather than rolled free. A shutter folded back
      // stands out past its own opening by half a leaf again, so a window that
      // only just fits the hole it is in does not fit the wall.
      front.push(
        ...shuttered(rng, {
          at: doorAt + side * (doorWidth / 2 + 0.35 + room / 2),
          sill: rng.range(1.15, 1.4),
          width: Math.min(rng.range(0.5, 0.7), room * 0.42),
          height: rng.range(0.5, 0.66),
          look: style,
        }),
      );
    }
    onFace(front, shell.wall.front);
    parts.push(...front);

    // --- the back, and the ends ----------------------------------------------
    // An outshot on the back rather than an end: this house stands in a row, so
    // anything on a gable would push into next door.
    const outshot = rng.chance(0.4);
    if (outshot) {
      parts.push(
        ...onFace(
          leanTo(rng, {
            at: rng.around(0, width * 0.12),
            span: rng.range(1.6, 2.3),
            out: rng.range(0.9, 1.25),
            high: eave - 0.15,
            low: eave - 0.15 - rng.range(0.35, 0.6),
            look: style,
          }),
          shell.wall.back,
        ),
      );
    } else {
      parts.push(
        ...onFace(
          shuttered(rng, {
            at: rng.around(0, width * 0.2),
            sill: rng.range(1.2, 1.45),
            width: rng.range(0.42, 0.56),
            height: rng.range(0.44, 0.56),
            look: style,
          }),
          shell.wall.back,
        ),
      );
    }

    // --- the stack -----------------------------------------------------------
    // Outside the gable rather than inside it, which is where a hearth against an
    // end wall puts one — and it is the only thing about this building visible over
    // the roof of the one in front.
    if (rng.chance(0.75)) {
      const end = rng.chance(0.5) ? 1 : -1;
      const girth = rng.range(0.74, 0.94);
      // Stood clear of the roof's gable oversail, with the gap behind filled as a
      // breast: a stack sitting in the oversail is one the slope drives through.
      const clear = shell.roof.overGable + 0.08;
      parts.push(
        ...chimney(rng, {
          x: end * (width / 2 + clear + girth / 2),
          z: rng.around(0, depth * 0.08),
          foot: 0,
          top: shell.crown + rng.range(0.4, 0.75),
          girth,
          breast: { span: clear + 0.3, top: eave, yaw: end > 0 ? Math.PI / 2 : -Math.PI / 2 },
          look: style,
        }),
      );
    }

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);

    const mesh = finish(geometry, 'hut', 0);
    const doorAtPlan = facePoint(shell.wall.front, doorAt);
    const doorway: Doorway = {
      x: doorAtPlan.x,
      z: doorAtPlan.z,
      yaw: 0,
      width: doorWidth,
      height: doorHeight,
    };
    markDoorways(mesh, [doorway], scale);
    return mesh;
  },
};
