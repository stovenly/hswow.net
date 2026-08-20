import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import {
  block,
  facePoint,
  gableFace,
  leanTo,
  look,
  louvre,
  markDoorways,
  onFace,
  ridgeHeight,
  slab,
  type Doorway,
  type Facing,
} from '../building';

// A threshing barn: a long boarded shed with a cart porch on each side, facing
// each other, so the draught between the open doors carries the chaff off the
// grain. The gaps in the boarding are missing boards, not holes cut in them.
// One design, drawn rather than rolled.

const WIDTH = 12.8;
const DEPTH = 7.4;
const EAVE = 4;
const PITCH = 0.9;
const PLINTH = 0.5;

/** A little off the middle of the run, which is where a barn's midstrey falls. */
const PORCH_AT = -0.9;
const PORCH_WIDTH = 3.6;
const PORCH_DEPTH = 1.9;
const PORCH_EAVE = 3.4;
/** Both taken off the porch: the jambs and head beam stand out past the opening. */
const DOOR_WIDTH = PORCH_WIDTH - 0.8;
const DOOR_HEIGHT = PORCH_EAVE - 0.55;

export const barn: MeshBuilder = {
  name: 'barn',
  category: 'structures',
  radius: 8.5,
  variants: 1,

  build({ scale = 1 } = {}) {
    const rng = createRng(9536);
    const parts: Part[] = [];

    const style = look(rng, 'board', 'thatch');

    const shell = block(rng, {
      width: WIDTH,
      depth: DEPTH,
      base: PLINTH,
      eave: EAVE,
      pitch: PITCH,
      look: style,
    });
    parts.push(...shell.parts);

    // --- the porches ---------------------------------------------------------
    const ways: Doorway[] = [];
    for (const side of [1, -1]) {
      const porch = block(rng, {
        x: PORCH_AT,
        z: side * (DEPTH / 2 + PORCH_DEPTH / 2 - 0.35),
        width: PORCH_WIDTH,
        depth: PORCH_DEPTH,
        base: PLINTH,
        eave: PORCH_EAVE,
        pitch: PITCH + 0.06,
        ridge: 'z',
        overEave: 0.2,
        overGable: 0.18,
        look: style,
      });
      parts.push(...porch.parts);

      // The cart doorway builds nothing of its own — a door builder puts the whole
      // opening there. What is left is the porch's own carpentry above it: a tie
      // beam across the wall head, two raking struts to the apex, and an owl hole.
      const face: Facing = side > 0 ? porch.wall.front : porch.wall.back;
      const frame: Part[] = [];
      const gable = ridgeHeight(PORCH_WIDTH, PITCH + 0.06);
      frame.push({
        geometry: slab(PORCH_WIDTH - 0.24, 0.24, 0.22, 0, PORCH_EAVE + 0.02, 0.1),
        color: style.timberDark,
      });
      const foot = PORCH_WIDTH / 2 - 0.55;
      const apex = gable - 0.7;
      for (const strut of [-1, 1]) {
        // Axis foot-to-apex is `(−strut·foot, apex)`. `rotateZ(θ)` takes +Y to
        // `(−sin θ, cos θ)`, so θ = atan2(strut·foot, apex).
        const brace = slab(0.16, Math.hypot(foot, apex) + 0.2, 0.17, 0, 0, 0.065);
        brace.rotateZ(Math.atan2(strut * foot, apex));
        brace.translate(strut * (foot / 2), PORCH_EAVE + 0.15 + apex / 2, 0);
        frame.push({ geometry: brace, color: style.timberDark });
      }
      frame.push(
        ...louvre(rng, { at: 0, sill: PORCH_EAVE + 0.62, width: 0.5, height: 0.46, look: style }),
      );

      onFace(frame, face);
      parts.push(...frame);

      const at = facePoint(face, 0);
      ways.push({ x: at.x, z: at.z, yaw: face.yaw, width: DOOR_WIDTH, height: DOOR_HEIGHT });
    }

    // --- the gable ends, and the cart bay ------------------------------------
    const rise = ridgeHeight(DEPTH, PITCH);
    for (const end of [1, -1] as const) {
      parts.push(
        ...onFace(
          louvre(rng, { at: 0, sill: EAVE + rise * 0.28, width: 0.66, height: 0.6, look: style }),
          gableFace(shell.roof, end),
        ),
      );
    }

    // An open cart bay under an outshot on one end. It is where the wain waits
    // its turn, and it is part of the barn rather than a shed beside it.
    parts.push(
      ...onFace(
        leanTo(rng, {
          at: 0,
          span: 3.8,
          out: 2.2,
          high: EAVE - 0.2,
          low: EAVE - 1.2,
          posts: true,
          look: style,
        }),
        shell.wall.right,
      ),
    );

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);

    const mesh = finish(geometry, 'barn', 0);
    markDoorways(mesh, ways, scale);
    return mesh;
  },
};
