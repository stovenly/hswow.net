import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import {
  block,
  chimney,
  facePoint,
  gableFace,
  leanTo,
  look,
  louvre,
  markDoorways,
  onFace,
  ridgeHeight,
  shuttered,
  type Doorway,
} from '../building';

/**
 * A smithy: a stone shed with one wall mostly missing and a stack over it.
 *
 * Three things follow from the fire and they are the whole building. **Stone
 * and a hard roof** — the one trade in the village that never got thatch,
 * because it kept an open hearth alight all day. **An open working front**
 * under a canopy, because a forge has to be worked in daylight and vented, and
 * because everything that comes out of it is too heavy to carry far. **A stack
 * with real girth**, drawing a hearth rather than a cooking fire.
 *
 * The hearth, the anvil and the trough are `forge`, `anvil` and `trough`, and
 * they are placed in here by hand. This is the shed they stand in.
 *
 * **One design, not a family** — drawn rather than rolled. See `manor`.
 */

const WIDTH = 6.8;
const DEPTH = 5.6;
const EAVE = 2.85;
const PITCH = 0.72;

const BAY_WIDTH = 2.9;
/** Hard against one end of the front, so the door has the whole of what is left. */
const BAY_AT = WIDTH / 2 - BAY_WIDTH / 2 - 0.35;

const DOOR_WIDTH = 1.1;
const DOOR_HEIGHT = 2.25;
const DOOR_AT = -(WIDTH / 2 - DOOR_WIDTH / 2 - 0.5);

export const blacksmith: MeshBuilder = {
  name: 'blacksmith',
  category: 'structures',
  radius: 4.6,
  variants: 1,

  build({ scale = 1 } = {}) {
    const rng = createRng(6142);
    const parts: Part[] = [];

    const style = look(rng, 'stone', 'slate');

    const shell = block(rng, {
      width: WIDTH,
      depth: DEPTH,
      base: 0.32,
      eave: EAVE,
      pitch: PITCH,
      look: style,
    });
    parts.push(...shell.parts);

    // --- the working front ---------------------------------------------------
    //
    // A canopy over the ground outside, and a wide window under it. **One way in
    // and no more**: this had a second opening the height of a doorway beside
    // the door, which reads as a front entrance to a building that has one.
    // What a smithy needs at that wall is light and a place to work out of the
    // rain, and that is what these two are.
    const front: Part[] = [];
    front.push(
      ...shuttered(rng, { at: BAY_AT, sill: 1.05, width: BAY_WIDTH * 0.5, height: 0.95, look: style }),
    );
    onFace(front, shell.wall.front);
    parts.push(...front);

    parts.push(
      ...onFace(
        leanTo(rng, {
          // Sized so its outer edge lands exactly on the building's corner.
          // It was rolled a metre wider than the bay and hung past the wall.
          at: BAY_AT,
          span: (WIDTH / 2 - BAY_AT) * 2,
          out: 2.2,
          high: EAVE - 0.12,
          low: EAVE - 0.57,
          posts: true,
          look: style,
        }),
        shell.wall.front,
      ),
    );

    // --- the stack, and what lets the rest of the smoke out ------------------
    //
    // Clear of the gable oversail with a breast filling the gap: a stack inside
    // the oversail has the slope driven through it and out the far side.
    const clear = shell.roof.overGable + 0.1;
    parts.push(
      ...chimney(rng, {
        x: WIDTH / 2 + clear + 0.65,
        z: -DEPTH * 0.2,
        foot: 0,
        top: shell.crown + 1.1,
        girth: 1.3,
        breast: { span: clear + 0.35, top: EAVE, yaw: Math.PI / 2 },
        look: style,
      }),
    );

    // A louvre high in the far gable, which is the only other way the roof space
    // is vented once the doors are shut.
    const rise = ridgeHeight(DEPTH, PITCH);
    parts.push(
      ...onFace(
        louvre(rng, { at: 0, sill: EAVE + rise * 0.18, width: 0.7, height: 0.58, look: style }),
        gableFace(shell.roof, -1),
      ),
    );

    parts.push(
      ...onFace(
        shuttered(rng, { at: 0, sill: 1.4, width: 0.7, height: 0.58, look: style }),
        shell.wall.back,
      ),
    );

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);

    const mesh = finish(geometry, 'blacksmith', 0);
    const at = facePoint(shell.wall.front, DOOR_AT);
    const doorway: Doorway = { x: at.x, z: at.z, yaw: 0, width: DOOR_WIDTH, height: DOOR_HEIGHT };
    markDoorways(mesh, [doorway], scale);
    return mesh;
  },
};
