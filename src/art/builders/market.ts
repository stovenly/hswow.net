import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import {
  block,
  casement,
  chimney,
  facePoint,
  jetty,
  look,
  markDoorways,
  boarded,
  onFace,
  proud,
  slab,
  type Doorway,
} from '../building';
import { shade } from '../palette';

// A shop: a trading floor open to the street, with the household over it. The
// shopfront is the building — one pair of shutters, the upper hinged up to an
// awning and the lower dropped down to become the counter. That is joinery fixed
// to the building, so it is here; what stands on the counter is not. Gable to the
// street, upper floor jettied out over it. One design, drawn rather than rolled.

const WIDTH = 6.4;
const DEPTH = 7.2;
const GROUND = 2.9;
const FIRST = 2.45;
const PITCH = 0.85;
const JETTY = 0.5;

const DOOR_WIDTH = 1.1;
const DOOR_HEIGHT = 2.25;
/** Hard against the right of the front; the shop takes everything left of it. */
const DOOR_AT = WIDTH / 2 - DOOR_WIDTH / 2 - 0.45;

const SHOP_WIDTH = 3.8;
const SHOP_AT = -(WIDTH / 2 - SHOP_WIDTH / 2 - 0.38);
/** Height of the stall board, and of the beam the upper shutter swings on. */
const COUNTER = 1;
const HEAD = 2.25;

export const market: MeshBuilder = {
  name: 'market',
  category: 'structures',
  radius: 6,
  variants: 1,

  build({ scale = 1 } = {}) {
    const rng = createRng(5307);
    const parts: Part[] = [];

    const lower = look(rng, 'frame', 'tile');
    const upper = {
      ...look(rng, 'frame', 'tile'),
      stone: lower.stone,
      stoneDark: lower.stoneDark,
      roof: lower.roof,
      timber: lower.timber,
      timberDark: lower.timberDark,
      studs: 0.55,
    };

    // Ridge along Z: the gable faces the street, which is what a narrow plot on
    // a market place forces and what makes a row of these read as a row.
    const low = block(rng, {
      width: WIDTH,
      depth: DEPTH,
      base: 0.3,
      eave: GROUND,
      pitch: PITCH,
      ridge: 'z',
      roofless: true,
      look: lower,
    });
    parts.push(...low.parts);

    const high = block(rng, {
      z: JETTY / 2,
      width: WIDTH,
      depth: DEPTH + JETTY,
      base: GROUND,
      plinth: 0,
      eave: GROUND + FIRST,
      pitch: PITCH,
      ridge: 'z',
      look: upper,
    });
    parts.push(...high.parts);
    parts.push(
      ...onFace(jetty(rng, { at: 0, span: WIDTH, y: GROUND, out: JETTY, look: upper }), low.wall.front),
    );

    // --- the shopfront -------------------------------------------------------
    const front: Part[] = [];
    // Boarded, not open: the building behind the shutters has no room in it, and an
    // open shop front is a rectangle of black. What is behind the awning is the shop
    // shut up — boards on ledges.
    front.push(...boarded(rng, SHOP_AT, COUNTER, SHOP_WIDTH, HEAD - COUNTER, lower));
    for (const side of [-1, 1]) {
      front.push({
        geometry: slab(0.19, HEAD + 0.16, 0.25, SHOP_AT + side * (SHOP_WIDTH / 2 + 0.095), (HEAD + 0.1) / 2 - 0.03, 0.105),
        color: lower.timberDark,
      });
    }
    front.push({
      geometry: slab(SHOP_WIDTH + 0.6, 0.22, 0.28, SHOP_AT, HEAD + 0.11, 0.125),
      color: lower.timberDark,
    });
    front.push({
      geometry: slab(SHOP_WIDTH + 0.3, 0.14, 0.32, SHOP_AT, COUNTER - 0.07, 0.145),
      color: shade(lower.timber, 0.94),
    });

    // The upper shutter, hinged at the head and propped out as an awning. It slopes
    // down and out, which is the whole point of it: `rotateX(+θ)` takes +Z to
    // `(0, −sin θ, cos θ)`, so the outer edge falls, and the translate then puts the
    // hinged edge back on the head beam.
    const reach = 1.15;
    const lift = 0.38;
    const awning = slab(SHOP_WIDTH + 0.24, 0.06, reach, 0, 0, 0);
    awning.rotateX(lift);
    awning.translate(SHOP_AT, HEAD - (reach / 2) * Math.sin(lift), (reach / 2) * Math.cos(lift));
    front.push({ geometry: awning, color: shade(lower.timber, 0.97) });

    const tipY = HEAD - reach * Math.sin(lift);
    const tipZ = reach * Math.cos(lift);
    for (const side of [-1, 1]) {
      // A prop from the awning's outer corner down to the stall board.
      // `rotateX(φ)` takes +Y to `(0, cos φ, sin φ)`, so φ is the lean of the
      // pole measured off vertical.
      const dy = tipY - COUNTER;
      const dz = tipZ - 0.12;
      const pole = slab(0.07, Math.hypot(dy, dz), 0.07, 0, 0, 0);
      pole.rotateX(Math.atan2(dz, dy));
      pole.translate(SHOP_AT + side * (SHOP_WIDTH / 2 - 0.1), COUNTER + dy / 2, 0.12 + dz / 2);
      front.push({ geometry: pole, color: lower.timberDark });
    }

    // The lower shutter, dropped flat onto two legs — the counter itself.
    const boardOut = 0.6;
    const board = slab(SHOP_WIDTH + 0.16, 0.055, boardOut, 0, 0, 0);
    board.rotateX(0.1);
    board.translate(SHOP_AT, COUNTER - (boardOut / 2) * Math.sin(0.1), 0.14 + (boardOut / 2) * Math.cos(0.1));
    front.push({ geometry: board, color: shade(lower.timber, 0.93) });
    for (const side of [-1, 1]) {
      front.push({
        geometry: slab(0.07, COUNTER - 0.1, 0.07, SHOP_AT + side * (SHOP_WIDTH / 2 - 0.12), (COUNTER - 0.1) / 2, 0.14 + boardOut * 0.8),
        color: lower.timberDark,
      });
    }

    onFace(front, low.wall.front);
    parts.push(...front);

    // --- upstairs, and the sides ---------------------------------------------
    for (const at of [-1.55, 1.55]) {
      parts.push(
        ...onFace(
          casement(rng, { at, sill: GROUND + 0.85, width: 0.9, height: 0.95, look: upper }),
          proud(low.wall.front, JETTY),
        ),
      );
    }
    for (const face of [high.wall.right, high.wall.left]) {
      for (const at of [-1.4, 1.3]) {
        parts.push(
          ...onFace(
            casement(rng, { at, sill: GROUND + 0.9, width: 0.7, height: 0.85, look: upper }),
            face,
          ),
        );
      }
    }

    // The stack, on the rear gable rather than the side: on the side it stands in
    // front of a casement, and a chimney with a window behind it is a window nobody
    // can see. Clear of the gable oversail with a breast filling the gap.
    const clear = high.roof.overGable + 0.1;
    parts.push(
      ...chimney(rng, {
        x: WIDTH * 0.18,
        z: -(DEPTH / 2 + clear + 0.45),
        foot: 0,
        top: high.crown + 0.9,
        girth: 0.9,
        breast: { span: clear + 0.35, top: GROUND + FIRST, yaw: Math.PI },
        look: lower,
      }),
    );

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);

    const mesh = finish(geometry, 'market', 0);
    const at = facePoint(low.wall.front, DOOR_AT);
    const doorway: Doorway = { x: at.x, z: at.z, yaw: 0, width: DOOR_WIDTH, height: DOOR_HEIGHT };
    markDoorways(mesh, [doorway], scale);
    return mesh;
  },
};
