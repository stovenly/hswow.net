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
  type Walling,
} from '../building';

// A house standing on its own out in the country: heavy rubble walls to the eave,
// a roof coming down far over them, and one great stack, since an isolated house
// has no neighbour's wall to share a hearth with. Lower and squatter than `hut`.
export const cottage: MeshBuilder = {
  name: 'cottage',
  category: 'structures',
  radius: 3.7,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const kind: RoofKind = rng.chance(0.76) ? 'thatch' : 'shingle';
    // Stone mostly. Timber framing out here means somebody carted the frame,
    // and out here nobody did.
    const walling: Walling = rng.chance(0.7) ? 'stone' : 'frame';
    const style = look(rng, walling, kind);

    const width = rng.range(4.4, 5.3);
    const depth = rng.range(3.9, 4.5);
    // See `hut`: deep thatch takes most of a metre off the usable wall, so the
    // wall has to start higher than the eave line suggests. Still lower than the
    // hut's, which is the difference between the two at a distance.
    const eave = rng.range(2.9, 3.15);
    const pitch = kind === 'thatch' ? rng.range(0.92, 1.06) : rng.range(0.82, 0.95);

    const shell = block(rng, {
      width,
      depth,
      base: walling === 'stone' ? 0.2 : 0.42,
      eave,
      pitch,
      // Deep. A low wall under a wide overhang is the whole shape of a cottage,
      // and it is also the only thing keeping the rain off a mud-mortared wall.
      overEave: rng.range(0.75, 0.95),
      overGable: rng.range(0.3, 0.45),
      look: style,
    });
    parts.push(...shell.parts);

    // --- the front -----------------------------------------------------------
    const doorWidth = rng.range(1.0, 1.18);
    const doorHeight = Math.min(rng.range(2.1, 2.3), shell.head - 0.3);
    const doorAt = rng.around(0, width * 0.2);

    // Nothing is built at the doorway itself — see `building.ts`.
    const front: Part[] = [];
    // Two openings, one either side where the door leaves room. Small: glass
    // costs money and the wall is a foot and a half thick.
    for (const side of [-1, 1]) {
      const clear = width / 2 - Math.abs(doorAt + (side * doorWidth) / 2) - 0.5;
      if (clear < 0.95) continue;
      front.push(
        ...shuttered(rng, {
          at: doorAt + side * (doorWidth / 2 + 0.4 + clear / 2),
          sill: rng.range(0.95, 1.15),
          // Capped by the wall left, so a shutter folded back cannot reach past
          // the corner it is nailed beside.
          width: Math.min(rng.range(0.44, 0.6), clear * 0.42),
          height: rng.range(0.46, 0.6),
          look: style,
        }),
      );
    }
    onFace(front, shell.wall.front);
    parts.push(...front);

    parts.push(
      ...onFace(
        shuttered(rng, {
          at: rng.around(0, width * 0.22),
          sill: rng.range(1.0, 1.2),
          width: rng.range(0.4, 0.52),
          height: rng.range(0.42, 0.54),
          look: style,
        }),
        shell.wall.back,
      ),
    );

    // --- the stack, and the store --------------------------------------------
    // Both on gable ends, which is where a detached house can put things.
    const stackEnd = rng.chance(0.5) ? 1 : -1;
    const girth = rng.range(1.05, 1.35);
    // Clear of the gable oversail, breast filling the gap — see `hut`, which had
    // the same slope driven through the same stack.
    const clear = shell.roof.overGable + 0.08;
    parts.push(
      ...chimney(rng, {
        x: stackEnd * (width / 2 + clear + girth / 2),
        z: rng.around(0, depth * 0.1),
        foot: 0,
        top: shell.crown + rng.range(0.6, 1.0),
        girth,
        breast: { span: clear + 0.32, top: eave, yaw: stackEnd > 0 ? Math.PI / 2 : -Math.PI / 2 },
        look: style,
      }),
    );

    if (rng.chance(0.6)) {
      const end = -stackEnd;
      parts.push(
        ...onFace(
          leanTo(rng, {
            at: rng.around(0, depth * 0.1),
            span: rng.range(1.7, 2.4),
            out: rng.range(1.1, 1.6),
            high: eave - 0.1,
            low: eave - 0.1 - rng.range(0.3, 0.5),
            openFront: rng.chance(0.45),
            look: style,
          }),
          end > 0 ? shell.wall.right : shell.wall.left,
        ),
      );
    }

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);

    const mesh = finish(geometry, 'cottage', 0);
    const at = facePoint(shell.wall.front, doorAt);
    const doorway: Doorway = { x: at.x, z: at.z, yaw: 0, width: doorWidth, height: doorHeight };
    markDoorways(mesh, [doorway], scale);
    return mesh;
  },
};
